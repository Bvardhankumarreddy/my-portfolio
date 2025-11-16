import { dynamoDB } from './dynamodbConfig';

const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE_NAME || 'portfolio-reviews';

/**
 * Fetch all approved reviews from DynamoDB
 */
export const getReviews = async () => {
    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'approved = :approved',
            ExpressionAttributeValues: {
                ':approved': true
            }
        };

        const result = await dynamoDB.scan(params).promise();
        
        // Sort by createdAt descending
        const reviews = result.Items.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return reviews;
    } catch (error) {
        console.error('Error fetching reviews from DynamoDB:', error);
        throw error;
    }
};

/**
 * Add a new review to DynamoDB
 */
export const addReview = async (reviewData) => {
    try {
        // Server-side validation - check for standalone bad words
        const blockedWords = [
            'fuck', 'shit', 'bitch', 'bastard', 'damn', 'hell', 'crap',
            'dick', 'cock', 'pussy', 'nigger', 'fag', 'retard', 'slut', 'whore',
            'sex', 'porn', 'xxx', 'nude', 'rape', 'kill', 'die', 'hate',
            'spam', 'bot'
        ];

        // Function to check for standalone bad words using word boundaries
        const containsBadWord = (text) => {
            const lowerText = text.toLowerCase();
            return blockedWords.some(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return regex.test(lowerText);
            });
        };
        
        // Check for blocked words in all fields
        if (containsBadWord(reviewData.name)) {
            throw new Error('Inappropriate content detected in name');
        }
        if (containsBadWord(reviewData.company)) {
            throw new Error('Inappropriate content detected in company name');
        }
        if (containsBadWord(reviewData.role)) {
            throw new Error('Inappropriate content detected in role');
        }
        if (containsBadWord(reviewData.comment)) {
            throw new Error('Inappropriate content detected in comment');
        }

        // Check for valid name format
        if (!/^[a-zA-Z\s.''-]+$/.test(reviewData.name)) {
            throw new Error('Invalid name format');
        }

        const timestamp = new Date().toISOString();
        const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const item = {
            id: reviewId,
            name: reviewData.name,
            company: reviewData.company || 'N/A',
            role: reviewData.role || 'Visitor',
            title: reviewData.title,
            rating: reviewData.rating,
            comment: reviewData.comment,
            approved: false, // Changed to false - requires admin approval
            createdAt: timestamp,
            updatedAt: timestamp
        };

        const params = {
            TableName: TABLE_NAME,
            Item: item
        };

        await dynamoDB.put(params).promise();
        
        return { success: true, reviewId };
    } catch (error) {
        console.error('Error adding review to DynamoDB:', error);
        throw error;
    }
};

/**
 * Get review statistics (count and average rating)
 */
export const getReviewStats = async () => {
    try {
        const reviews = await getReviews();
        
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : '5.0';

        return {
            totalReviews,
            averageRating
        };
    } catch (error) {
        console.error('Error getting review stats:', error);
        throw error;
    }
};

/**
 * Get all unapproved reviews (for admin panel)
 */
export const getUnapprovedReviews = async () => {
    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'approved = :approved',
            ExpressionAttributeValues: {
                ':approved': false
            }
        };

        const result = await dynamoDB.scan(params).promise();
        
        // Sort by createdAt descending
        const reviews = result.Items.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return reviews;
    } catch (error) {
        console.error('Error fetching unapproved reviews:', error);
        throw error;
    }
};

/**
 * Update review approval status (for admin panel)
 */
export const updateReviewApproval = async (reviewId, approved) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { id: reviewId },
            UpdateExpression: 'set approved = :approved, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':approved': approved,
                ':updatedAt': new Date().toISOString()
            }
        };

        await dynamoDB.update(params).promise();
        
        return { success: true };
    } catch (error) {
        console.error('Error updating review approval:', error);
        throw error;
    }
};

/**
 * Delete a review (for admin panel)
 */
export const deleteReview = async (reviewId) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { id: reviewId }
        };

        await dynamoDB.delete(params).promise();
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};


