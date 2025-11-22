import { SESClient } from "@aws-sdk/client-ses";

// AWS SES Configuration
const sesConfig = {
    region: process.env.REACT_APP_SES_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SES_SECRET_ACCESS_KEY,
    },
};

// Create SES client
export const sesClient = new SESClient(sesConfig);

// Email configuration
export const EMAIL_CONFIG = {
    FROM_EMAIL: process.env.REACT_APP_SES_FROM_EMAIL || 'noreply@vardhandevops.xyz',
    FROM_NAME: process.env.REACT_APP_SES_FROM_NAME || "Vardhan's Portfolio",
    REPLY_TO: process.env.REACT_APP_SES_REPLY_TO || 'bhopathivardhan654321@gmail.com',
    
    // Email templates
    TEMPLATES: {
        CONTACT_NOTIFICATION: 'contact-notification',
        CONTACT_CONFIRMATION: 'contact-confirmation',
        NEWSLETTER_WELCOME: 'newsletter-welcome',
        NEWSLETTER_VERIFICATION: 'newsletter-verification',
        BLOG_NOTIFICATION: 'blog-notification',
    }
};

export default sesClient;
