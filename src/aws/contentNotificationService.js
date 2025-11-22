import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { dynamoDB } from './dynamodbConfig';

const sesClient = new SESClient({
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
});

const SENDER_EMAIL = process.env.REACT_APP_SENDER_EMAIL;
const TABLE_NAME = process.env.REACT_APP_DYNAMODB_NEWSLETTER_TABLE || 'portfolio-newsletter';

/**
 * Get all verified newsletter subscribers
 */
export const getSubscribers = async () => {
    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'verified = :verified',
            ExpressionAttributeValues: {
                ':verified': true
            }
        };

        const result = await dynamoDB.scan(params).promise();
        return result.Items || [];
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        throw error;
    }
};

/**
 * Send notification email to a subscriber
 */
const sendNotificationEmail = async (subscriberEmail, contentData) => {
    const { platform, title, url, excerpt, author, publishDate } = contentData;

    const platformEmojis = {
        linkedin: '💼',
        youtube: '🎥',
        medium: '✍️'
    };

    const platformColors = {
        linkedin: '#0A66C2',
        youtube: '#FF0000',
        medium: '#000000'
    };

    const emoji = platformEmojis[platform.toLowerCase()] || '📢';
    const color = platformColors[platform.toLowerCase()] || '#3b82f6';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .platform-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
        }
        .content {
            padding: 30px 20px;
        }
        .content h2 {
            color: #1f2937;
            font-size: 22px;
            margin: 0 0 15px 0;
            line-height: 1.3;
        }
        .excerpt {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0 25px 0;
        }
        .cta-button {
            display: inline-block;
            background: ${color};
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s;
        }
        .meta {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 14px;
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
        }
        .footer a {
            color: ${color};
            text-decoration: none;
        }
        .unsubscribe {
            margin-top: 15px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${emoji} New Content Published!</h1>
            <div class="platform-badge">
                ${platform.toUpperCase()}
            </div>
        </div>
        <div class="content">
            <h2>${title}</h2>
            <div class="excerpt">${excerpt || 'Check out my latest post!'}</div>
            <a href="${url}" class="cta-button">Read Now →</a>
            <div class="meta">
                <div>Published by ${author}</div>
                <div>${publishDate}</div>
            </div>
        </div>
        <div class="footer">
            <p>You're receiving this because you subscribed to updates from Vardhan Kumar Reddy.</p>
            <div class="unsubscribe">
                <a href="${process.env.REACT_APP_WEBSITE_URL}/newsletter-unsubscribe">Unsubscribe</a> | 
                <a href="${process.env.REACT_APP_WEBSITE_URL}">Visit Website</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    const textBody = `
${emoji} New Content on ${platform.toUpperCase()}!

${title}

${excerpt || 'Check out my latest post!'}

Read the full article: ${url}

Published by ${author}
${publishDate}

---
You're receiving this because you subscribed to updates.
Unsubscribe: ${process.env.REACT_APP_WEBSITE_URL}/newsletter-unsubscribe
`;

    const params = {
        Source: SENDER_EMAIL,
        Destination: {
            ToAddresses: [subscriberEmail]
        },
        Message: {
            Subject: {
                Data: `${emoji} ${title}`,
                Charset: 'UTF-8'
            },
            Body: {
                Text: {
                    Data: textBody,
                    Charset: 'UTF-8'
                },
                Html: {
                    Data: htmlBody,
                    Charset: 'UTF-8'
                }
            }
        }
    };

    try {
        const command = new SendEmailCommand(params);
        await sesClient.send(command);
        return { success: true };
    } catch (error) {
        console.error('Error sending email to:', subscriberEmail, error);
        return { success: false, error: error.message };
    }
};

/**
 * Notify all subscribers about new content
 */
export const notifySubscribers = async (contentData) => {
    try {
        const subscribers = await getSubscribers();
        
        if (subscribers.length === 0) {
            return {
                success: true,
                message: 'No subscribers to notify',
                sent: 0,
                failed: 0
            };
        }

        console.log(`Notifying ${subscribers.length} subscribers...`);

        const results = await Promise.allSettled(
            subscribers.map(subscriber => 
                sendNotificationEmail(subscriber.email, contentData)
            )
        );

        const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;

        return {
            success: true,
            message: `Notifications sent to ${sent} subscribers`,
            sent,
            failed,
            total: subscribers.length
        };
    } catch (error) {
        console.error('Error notifying subscribers:', error);
        throw error;
    }
};

/**
 * Save content notification record to DynamoDB
 */
export const saveNotificationRecord = async (contentData) => {
    try {
        const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const params = {
            TableName: 'portfolio-notifications',
            Item: {
                id: notificationId,
                platform: contentData.platform,
                title: contentData.title,
                url: contentData.url,
                excerpt: contentData.excerpt,
                publishDate: contentData.publishDate,
                sentAt: new Date().toISOString(),
                subscribersNotified: contentData.subscribersNotified || 0
            }
        };

        await dynamoDB.put(params).promise();
        return { success: true, notificationId };
    } catch (error) {
        console.error('Error saving notification record:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Manual notification trigger (for admin panel)
 */
export const sendManualNotification = async (contentData) => {
    try {
        // Notify all subscribers
        const notificationResult = await notifySubscribers(contentData);
        
        // Save notification record
        const recordResult = await saveNotificationRecord({
            ...contentData,
            subscribersNotified: notificationResult.sent
        });

        return {
            success: true,
            ...notificationResult,
            recordId: recordResult.notificationId
        };
    } catch (error) {
        console.error('Error sending manual notification:', error);
        throw error;
    }
};
