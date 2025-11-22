import { dynamoDB } from './dynamodbConfig';
import { sendNewsletterVerification, sendNewsletterWelcome } from './emailService';
import { v4 as uuidv4 } from 'uuid';

const NEWSLETTER_TABLE = process.env.REACT_APP_NEWSLETTER_TABLE || 'portfolio-newsletter-subscribers';

/**
 * Generate a verification token
 */
const generateVerificationToken = () => {
    return uuidv4();
};

/**
 * Subscribe a new email to the newsletter
 * Sends verification email and stores subscription with pending status
 */
export const subscribeToNewsletter = async (email) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        
        // Check if email already exists
        const existingSubscriber = await dynamoDB.get({
            TableName: NEWSLETTER_TABLE,
            Key: { email: normalizedEmail }
        }).promise();

        if (existingSubscriber.Item) {
            if (existingSubscriber.Item.verified) {
                return {
                    success: false,
                    message: 'This email is already subscribed to the newsletter.'
                };
            } else {
                // Resend verification email
                const verificationToken = generateVerificationToken();
                
                await dynamoDB.update({
                    TableName: NEWSLETTER_TABLE,
                    Key: { email: normalizedEmail },
                    UpdateExpression: 'SET verificationToken = :token, updatedAt = :updatedAt',
                    ExpressionAttributeValues: {
                        ':token': verificationToken,
                        ':updatedAt': new Date().toISOString()
                    }
                }).promise();

                await sendNewsletterVerification({ email: normalizedEmail, verificationToken });
                
                return {
                    success: true,
                    message: 'Verification email resent! Please check your inbox.'
                };
            }
        }

        // Create new subscription
        const verificationToken = generateVerificationToken();
        const timestamp = new Date().toISOString();

        await dynamoDB.put({
            TableName: NEWSLETTER_TABLE,
            Item: {
                email: normalizedEmail,
                verificationToken,
                verified: false,
                subscribedAt: timestamp,
                updatedAt: timestamp
            }
        }).promise();

        // Send verification email
        await sendNewsletterVerification({ email: normalizedEmail, verificationToken });

        return {
            success: true,
            message: 'Verification email sent! Please check your inbox to confirm your subscription.'
        };

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        throw new Error('Failed to subscribe. Please try again later.');
    }
};

/**
 * Verify email subscription using the verification token
 */
export const verifyNewsletterSubscription = async (token) => {
    try {
        // Scan for the subscriber with this token (since token is not the key)
        const result = await dynamoDB.scan({
            TableName: NEWSLETTER_TABLE,
            FilterExpression: 'verificationToken = :token',
            ExpressionAttributeValues: {
                ':token': token
            }
        }).promise();

        if (!result.Items || result.Items.length === 0) {
            return {
                success: false,
                message: 'Invalid or expired verification link.'
            };
        }

        const subscriber = result.Items[0];

        if (subscriber.verified) {
            return {
                success: true,
                message: 'Your email is already verified!'
            };
        }

        // Update subscriber as verified
        await dynamoDB.update({
            TableName: NEWSLETTER_TABLE,
            Key: { email: subscriber.email },
            UpdateExpression: 'SET verified = :verified, verifiedAt = :verifiedAt, updatedAt = :updatedAt REMOVE verificationToken',
            ExpressionAttributeValues: {
                ':verified': true,
                ':verifiedAt': new Date().toISOString(),
                ':updatedAt': new Date().toISOString()
            }
        }).promise();

        // Send welcome email
        await sendNewsletterWelcome({ email: subscriber.email });

        return {
            success: true,
            message: 'Email verified successfully! Welcome to the newsletter! 🎉'
        };

    } catch (error) {
        console.error('Error verifying subscription:', error);
        throw new Error('Failed to verify subscription. Please try again later.');
    }
};

/**
 * Unsubscribe from newsletter
 */
export const unsubscribeFromNewsletter = async (email) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();

        await dynamoDB.delete({
            TableName: NEWSLETTER_TABLE,
            Key: { email: normalizedEmail }
        }).promise();

        return {
            success: true,
            message: 'You have been successfully unsubscribed from the newsletter.'
        };

    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        throw new Error('Failed to unsubscribe. Please try again later.');
    }
};

/**
 * Get all verified newsletter subscribers (admin function)
 */
export const getVerifiedSubscribers = async () => {
    try {
        const result = await dynamoDB.scan({
            TableName: NEWSLETTER_TABLE,
            FilterExpression: 'verified = :verified',
            ExpressionAttributeValues: {
                ':verified': true
            }
        }).promise();

        return result.Items || [];

    } catch (error) {
        console.error('Error getting subscribers:', error);
        throw new Error('Failed to retrieve subscribers.');
    }
};
