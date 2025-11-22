// Test Newsletter Email Functionality
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
const WEBSITE_URL = 'https://vardhandevops.xyz';

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

async function sendNewsletterVerification({ email, verificationToken }) {
    const verificationUrl = `${WEBSITE_URL}/newsletter/verify?token=${verificationToken}`;
    
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
                .content { padding: 40px 30px; }
                .verify-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; transition: transform 0.2s; }
                .verify-button:hover { transform: scale(1.05); }
                .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 Verify Your Email</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Welcome to Vardhan's Newsletter!</p>
                </div>
                <div class="content">
                    <p>Hi there! 👋</p>
                    <p>Thank you for subscribing to my newsletter! I'm excited to share my latest insights on DevOps, Cloud, and Tech with you.</p>
                    
                    <div class="info-box">
                        <p style="margin: 0;"><strong>🔐 Security First!</strong> Please verify your email address to complete your subscription.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" class="verify-button">
                            ✅ Verify Email Address
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                    </p>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0;"><strong>⏰ This link expires in 24 hours</strong></p>
                        <p style="margin: 5px 0 0; font-size: 14px;">Please verify your email soon to start receiving updates.</p>
                    </div>
                    
                    <h3 style="margin-top: 30px;">📬 What to Expect:</h3>
                    <ul style="line-height: 1.8;">
                        <li>🚀 Latest blog posts and tutorials</li>
                        <li>💡 DevOps tips and best practices</li>
                        <li>☁️ Cloud technology insights</li>
                        <li>🛠️ New project announcements</li>
                    </ul>
                    
                    <p style="margin-top: 30px;">Looking forward to connecting with you!</p>
                    <p><strong>Vardhan</strong><br>DevOps Engineer</p>
                </div>
                <div class="footer">
                    <p>You received this email because you subscribed to Vardhan's Newsletter at vardhandevops.xyz</p>
                    <p>If you didn't subscribe, you can safely ignore this email.</p>
                    <p style="margin-top: 10px;">© ${new Date().getFullYear()} Vardhan's Portfolio</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textBody = `
Verify Your Email - Vardhan's Newsletter

Hi there!

Thank you for subscribing to my newsletter! Please verify your email address to complete your subscription.

Verification Link:
${verificationUrl}

⏰ This link expires in 24 hours.

What to Expect:
- Latest blog posts and tutorials
- DevOps tips and best practices
- Cloud technology insights
- New project announcements

Looking forward to connecting with you!

Vardhan
DevOps Engineer

---
You received this email because you subscribed at vardhandevops.xyz
If you didn't subscribe, you can safely ignore this email.
© ${new Date().getFullYear()} Vardhan's Portfolio
    `;

    return await sendEmail({
        to: email,
        subject: '📧 Verify Your Email - Vardhan\'s Newsletter',
        htmlBody,
        textBody
    });
}

async function sendNewsletterWelcome({ email }) {
    const unsubscribeUrl = `${WEBSITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
    
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; }
                .content { padding: 40px 30px; }
                .success-badge { background: #d4edda; color: #155724; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid #c3e6cb; }
                .feature-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
                .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to the Newsletter!</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">You're all set!</p>
                </div>
                <div class="content">
                    <div class="success-badge">
                        <h2 style="margin: 0; font-size: 24px;">✅ Email Verified Successfully!</h2>
                        <p style="margin: 10px 0 0;">Your subscription is now active.</p>
                    </div>
                    
                    <p style="font-size: 16px;">Hi there! 👋</p>
                    <p>Welcome to Vardhan's Newsletter! I'm thrilled to have you as part of this community.</p>
                    
                    <h3 style="color: #667eea; margin-top: 30px;">📬 What You'll Receive:</h3>
                    
                    <div class="feature-box">
                        <h4 style="margin: 0 0 10px; color: #667eea;">🚀 Latest Blog Posts</h4>
                        <p style="margin: 0;">In-depth tutorials and guides on DevOps, Cloud, and modern tech stacks.</p>
                    </div>
                    
                    <div class="feature-box">
                        <h4 style="margin: 0 0 10px; color: #667eea;">💡 Pro Tips & Best Practices</h4>
                        <p style="margin: 0;">Real-world insights from my experience in DevOps and cloud engineering.</p>
                    </div>
                    
                    <div class="feature-box">
                        <h4 style="margin: 0 0 10px; color: #667eea;">🛠️ Project Updates</h4>
                        <p style="margin: 0;">First look at new projects, tools, and automation solutions.</p>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
                        <h3 style="margin: 0 0 10px; color: #1976d2;">🔗 Stay Connected</h3>
                        <p style="margin: 0;">Follow me on:</p>
                        <ul style="list-style: none; padding: 10px 0 0; margin: 0;">
                            <li>💼 <a href="https://www.linkedin.com/in/bhopathi-vardhan" style="color: #0077b5;">LinkedIn</a></li>
                            <li>💻 <a href="https://github.com/Bvardhankumarreddy" style="color: #333;">GitHub</a></li>
                            <li>📝 <a href="https://medium.com/@bhopathivardhan654321" style="color: #000;">Medium</a></li>
                            <li>🎥 <a href="https://www.youtube.com/@thetechsage-r8f" style="color: #ff0000;">YouTube</a></li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px;">Thank you for joining! I look forward to sharing valuable content with you.</p>
                    <p><strong>Best regards,</strong><br><strong>Vardhan</strong><br>DevOps Engineer</p>
                </div>
                <div class="footer">
                    <p>You're receiving this because you verified your subscription at vardhandevops.xyz</p>
                    <p><a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a> | <a href="${WEBSITE_URL}" style="color: #666;">Visit Portfolio</a></p>
                    <p style="margin-top: 10px;">© ${new Date().getFullYear()} Vardhan's Portfolio</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textBody = `
Welcome to Vardhan's Newsletter!

Hi there!

✅ Your email has been verified successfully! Your subscription is now active.

What You'll Receive:
- 🚀 Latest blog posts and in-depth tutorials
- 💡 Pro tips and best practices from real-world DevOps experience
- 🛠️ Project updates and new tools

Stay Connected:
- LinkedIn: https://www.linkedin.com/in/bhopathi-vardhan
- GitHub: https://github.com/Bvardhankumarreddy
- Medium: https://medium.com/@bhopathivardhan654321
- YouTube: https://www.youtube.com/@thetechsage-r8f

Thank you for joining! I look forward to sharing valuable content with you.

Best regards,
Vardhan
DevOps Engineer

---
Unsubscribe: ${unsubscribeUrl}
Visit Portfolio: ${WEBSITE_URL}
© ${new Date().getFullYear()} Vardhan's Portfolio
    `;

    return await sendEmail({
        to: email,
        subject: '🎉 Welcome to Vardhan\'s Newsletter - You\'re In!',
        htmlBody,
        textBody
    });
}

async function testNewsletter() {
    console.log('🧪 Testing Newsletter Email Flow...\n');
    
    const testEmail = REPLY_TO;
    const testToken = 'test-verification-token-12345';
    
    try {
        console.log('1️⃣ Sending verification email...');
        const verifyResult = await sendNewsletterVerification({
            email: testEmail,
            verificationToken: testToken
        });
        console.log('   ✅ Verification email sent!');
        console.log('   📨 Message ID:', verifyResult.messageId);
        console.log('');
        
        console.log('2️⃣ Sending welcome email...');
        const welcomeResult = await sendNewsletterWelcome({ email: testEmail });
        console.log('   ✅ Welcome email sent!');
        console.log('   📨 Message ID:', welcomeResult.messageId);
        console.log('');
        
        console.log('🎉 SUCCESS! Newsletter email flow is working perfectly!');
        console.log('');
        console.log('📬 Check your inbox for:');
        console.log('   1. Verification email (with verification link)');
        console.log('   2. Welcome email (subscription confirmed)');
        console.log('');
        console.log('✅ All newsletter emails are being sent successfully!');
        
    } catch (error) {
        console.error('❌ FAILED! Error:', error.message);
        process.exit(1);
    }
}

testNewsletter();
