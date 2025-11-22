// Test Contact Form Email Functionality
require('dotenv').config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesConfig = {
    region: process.env.REACT_APP_SES_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SES_SECRET_ACCESS_KEY,
    },
};

const sesClient = new SESClient(sesConfig);
const FROM_EMAIL = process.env.REACT_APP_SES_FROM_EMAIL || 'noreply@vardhandevops.xyz';
const FROM_NAME = process.env.REACT_APP_SES_FROM_NAME || "Vardhan's Portfolio";
const REPLY_TO = process.env.REACT_APP_SES_REPLY_TO || 'bhopathivardhan654321@gmail.com';

async function sendEmail({ to, subject, htmlBody, textBody, replyTo }) {
    try {
        const params = {
            Source: `${FROM_NAME} <${FROM_EMAIL}>`,
            Destination: { ToAddresses: [to] },
            Message: {
                Subject: { Data: subject, Charset: 'UTF-8' },
                Body: {
                    Html: { Data: htmlBody, Charset: 'UTF-8' },
                    Text: { Data: textBody || htmlBody.replace(/<[^>]*>/g, ''), Charset: 'UTF-8' },
                },
            },
            ReplyToAddresses: [replyTo || REPLY_TO],
        };

        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        return { success: true, messageId: response.MessageId };
    } catch (error) {
        throw new Error('Invalid mail. Please provide correct mail');
    }
}

async function sendContactNotification({ name, email, subject, message }) {
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .message-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📬 New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="info-box">
                        <p><strong>📧 From:</strong> ${name}</p>
                        <p><strong>✉️ Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>📌 Subject:</strong> ${subject}</p>
                        <p><strong>📅 Received:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <h3>💬 Message:</h3>
                    <div class="message-box">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                        💡 <strong>Quick Action:</strong> Reply directly to this email to respond to ${name}
                    </p>
                </div>
                <div class="footer">
                    <p>This notification was sent from your portfolio contact form</p>
                    <p>© ${new Date().getFullYear()} Vardhan's Portfolio - Automated Notification System</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textBody = `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}
Received: ${new Date().toLocaleString()}

Message:
${message}

---
Reply directly to this email to respond to ${name}
This notification was sent from your portfolio contact form.
    `;

    return await sendEmail({
        to: REPLY_TO,
        subject: `📬 New Contact: ${subject}`,
        htmlBody,
        textBody,
        replyTo: email
    });
}

async function sendContactConfirmation({ name, email }) {
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Message Received!</h1>
                </div>
                <div class="content">
                    <div class="success-box">
                        <h2 style="color: #28a745; margin-top: 0;">🎉 Thank You, ${name}!</h2>
                        <p style="font-size: 16px; margin-bottom: 0;">Your message has been successfully received.</p>
                    </div>
                    
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
                    <p>I typically respond within 24-48 hours during business days.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <p style="margin: 0;"><strong>What happens next?</strong></p>
                        <ul style="margin-top: 10px;">
                            <li>I'll review your message carefully</li>
                            <li>You'll receive a personalized response</li>
                            <li>We can discuss your inquiry in detail</li>
                        </ul>
                    </div>
                    
                    <p>In the meantime, feel free to:</p>
                    <ul>
                        <li>Check out my <a href="https://vardhandevops.xyz/#projects">latest projects</a></li>
                        <li>Read my <a href="https://medium.com/@bhopathivardhan654321">blog posts</a></li>
                        <li>Connect on <a href="https://www.linkedin.com/in/bhopathi-vardhan">LinkedIn</a></li>
                    </ul>
                    
                    <p>Looking forward to connecting with you!</p>
                    <p>Best regards,<br><strong>Vardhan</strong><br>DevOps Engineer</p>
                </div>
                <div class="footer">
                    <p>This is an automated confirmation email from Vardhan's Portfolio</p>
                    <p>© ${new Date().getFullYear()} Vardhan's Portfolio</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textBody = `
Message Received - Thank You!

Hi ${name},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

I typically respond within 24-48 hours during business days.

What happens next?
- I'll review your message carefully
- You'll receive a personalized response
- We can discuss your inquiry in detail

In the meantime, feel free to check out my portfolio and projects at vardhandevops.xyz

Looking forward to connecting with you!

Best regards,
Vardhan
DevOps Engineer

---
This is an automated confirmation email from Vardhan's Portfolio
© ${new Date().getFullYear()} Vardhan's Portfolio
    `;

    return await sendEmail({
        to: email,
        subject: "✅ Message Received - I'll Get Back to You Soon!",
        htmlBody,
        textBody
    });
}

async function testContactForm() {
    console.log('🧪 Testing Contact Form Email Flow...\n');
    
    const testData = {
        name: 'Test User',
        email: REPLY_TO, // Send to yourself
        subject: 'Test Contact Form Submission',
        message: 'This is a test message to verify the contact form email functionality is working correctly.\n\nFeatures being tested:\n- Contact notification to admin\n- Confirmation email to user\n- Email formatting and styling\n- Reply-to functionality'
    };
    
    try {
        console.log('1️⃣ Sending admin notification...');
        const notificationResult = await sendContactNotification(testData);
        console.log('   ✅ Admin notification sent!');
        console.log('   📨 Message ID:', notificationResult.messageId);
        console.log('');
        
        console.log('2️⃣ Sending user confirmation...');
        const confirmationResult = await sendContactConfirmation(testData);
        console.log('   ✅ User confirmation sent!');
        console.log('   📨 Message ID:', confirmationResult.messageId);
        console.log('');
        
        console.log('🎉 SUCCESS! Contact form email flow is working perfectly!');
        console.log('');
        console.log('📬 Check your inbox for:');
        console.log('   1. Admin notification (with message details)');
        console.log('   2. User confirmation (thank you message)');
        console.log('');
        console.log('✅ All contact form emails are being sent successfully!');
        
    } catch (error) {
        console.error('❌ FAILED! Error:', error.message);
        process.exit(1);
    }
}

testContactForm();
