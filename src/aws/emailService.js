import { SendEmailCommand, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { sesClient, EMAIL_CONFIG } from './sesConfig';

/**
 * Send an email using AWS SES
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.htmlBody - HTML email body
 * @param {string} params.textBody - Plain text email body
 * @param {string} params.replyTo - Reply-to email address (optional)
 * @param {Object} params.attachment - Attachment object with name and base64Data (optional)
 */
export const sendEmail = async ({ to, subject, htmlBody, textBody, replyTo, attachment }) => {
    try {
        // Check if the recipient email is from Gmail - these are always allowed
        const isGmail = to.toLowerCase().endsWith('@gmail.com');
        
        // If there's an attachment, use SendRawEmailCommand with MIME
        if (attachment) {
            const boundary = `----=_Part${Date.now()}`;
            const mimeMessage = [
                `From: ${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
                `To: ${to}`,
                `Reply-To: ${replyTo || EMAIL_CONFIG.REPLY_TO}`,
                `Subject: ${subject}`,
                `MIME-Version: 1.0`,
                `Content-Type: multipart/mixed; boundary="${boundary}"`,
                ``,
                `--${boundary}`,
                `Content-Type: text/html; charset=UTF-8`,
                `Content-Transfer-Encoding: 7bit`,
                ``,
                htmlBody,
                ``,
                `--${boundary}`,
                `Content-Type: ${attachment.contentType}; name="${attachment.name}"`,
                `Content-Transfer-Encoding: base64`,
                `Content-Disposition: attachment; filename="${attachment.name}"`,
                ``,
                attachment.base64Data,
                ``,
                `--${boundary}--`
            ].join('\r\n');

            const rawParams = {
                RawMessage: {
                    Data: new TextEncoder().encode(mimeMessage)
                }
            };

            const command = new SendRawEmailCommand(rawParams);
            const response = await sesClient.send(command);
            console.log('Email with attachment sent successfully:', response.MessageId);
            return { success: true, messageId: response.MessageId };
        }
        
        // Normal email without attachment
        const params = {
            Source: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    Html: {
                        Data: htmlBody,
                        Charset: 'UTF-8',
                    },
                    Text: {
                        Data: textBody || htmlBody.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
                        Charset: 'UTF-8',
                    },
                },
            },
            ReplyToAddresses: [replyTo || EMAIL_CONFIG.REPLY_TO],
        };

        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        
        console.log('Email sent successfully:', response.MessageId);
        return { success: true, messageId: response.MessageId };
    } catch (error) {
        console.error('AWS SES Error:', error);
        
        const errorMessage = error.message || '';
        const isGmail = to.toLowerCase().endsWith('@gmail.com');
        
        // If it's a Gmail address and there's an error, it's likely a configuration issue
        if (isGmail) {
            console.error('Gmail sending failed - likely AWS SES configuration issue:', errorMessage);
        }
        
        // For all errors, show invalid mail message
        throw new Error('Invalid mail. Please provide correct mail');
    }
};

/**
 * Send contact form notification to admin
 */
export const sendContactNotification = async ({ name, email, subject, message, attachment }) => {
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
                .label { font-weight: bold; color: #667eea; }
                .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="info-box">
                        <p><span class="label">From:</span> ${name}</p>
                        <p><span class="label">Email:</span> ${email}</p>
                        <p><span class="label">Subject:</span> ${subject}</p>
                    </div>
                    <div class="info-box">
                        <p class="label">Message:</p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p style="margin-top: 20px;">
                        <a href="mailto:${email}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to ${name}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>This email was sent from your portfolio contact form</p>
                    <p>Portfolio: <a href="https://portfolio.vardhandevops.xyz">portfolio.vardhandevops.xyz</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: EMAIL_CONFIG.REPLY_TO,
        subject: `Portfolio Contact: ${subject}`,
        htmlBody,
        replyTo: email,
        attachment,
    });
};

/**
 * Send confirmation email to contact form submitter
 */
export const sendContactConfirmation = async ({ name, email }) => {
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .checkmark { font-size: 48px; color: #10b981; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✉️ Message Received!</h1>
                </div>
                <div class="content">
                    <div class="checkmark">✓</div>
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
                    <p>In the meantime, feel free to explore my portfolio:</p>
                    <ul>
                        <li><a href="https://portfolio.vardhandevops.xyz/#projects">View My Projects</a></li>
                        <li><a href="https://portfolio.vardhandevops.xyz/#blog">Read My Blog Posts</a></li>
                        <li><a href="https://www.linkedin.com/in/bhopathi-vardhan">Connect on LinkedIn</a></li>
                    </ul>
                    <p>Best regards,<br><strong>Vardhan Kumar Reddy Bhopathi</strong><br>DevOps Engineer</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const textBody = `
Hi ${name},

Thank you for reaching out. I have received your message and will get back to you as soon as possible.

In the meantime, feel free to explore my portfolio:
- View My Projects: https://portfolio.vardhandevops.xyz/#projects
- Read My Blog Posts: https://portfolio.vardhandevops.xyz/#blog
- Connect on LinkedIn: https://www.linkedin.com/in/bhopathi-vardhan

Best regards,
Vardhan Kumar Reddy Bhopathi
DevOps Engineer
    `;

    return await sendEmail({
        to: email,
        subject: "Message Received - Vardhan Portfolio",
        htmlBody,
        textBody,
    });
};

/**
 * Send newsletter verification email
 */
export const sendNewsletterVerification = async ({ email, verificationToken }) => {
    const verificationUrl = `https://portfolio.vardhandevops.xyz/verify-subscription?token=${verificationToken}`;
    
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                .button:hover { background: #5568d3; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 Confirm Your Subscription</h1>
                </div>
                <div class="content">
                    <p>Hi there! 👋</p>
                    <p>Thanks for subscribing to my newsletter! You'll receive updates about:</p>
                    <ul>
                        <li>🎯 New blog posts on DevOps & Cloud</li>
                        <li>📹 YouTube tutorial releases</li>
                        <li>🚀 New project launches</li>
                    </ul>
                    <p>Please confirm your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="${verificationUrl}" class="button">Confirm Subscription</a>
                    </p>
                    <p style="color: #888; font-size: 14px;">
                        If you didn't subscribe to this newsletter, you can safely ignore this email.
                    </p>
                    <p style="color: #888; font-size: 12px; margin-top: 20px;">
                        Or copy and paste this link: ${verificationUrl}
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: email,
        subject: "Please verify your email - Vardhan's Newsletter",
        htmlBody,
    });
};

/**
 * Send welcome email after verification
 */
export const sendNewsletterWelcome = async ({ email }) => {
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to the Newsletter!</h1>
                </div>
                <div class="content">
                    <div class="celebration">🚀</div>
                    <p>Hi there!</p>
                    <p>Your subscription is confirmed! You're now part of an exclusive community receiving updates on DevOps, Cloud, and automation insights.</p>
                    <p><strong>What to expect:</strong></p>
                    <ul>
                        <li>📝 In-depth blog posts on DevOps best practices</li>
                        <li>📹 Video tutorials on AWS, Kubernetes, and CI/CD</li>
                        <li>💡 Project updates and case studies</li>
                        <li>🔧 Tips and tricks from real-world experience</li>
                    </ul>
                    <p>Follow me on social media for more content:</p>
                    <ul>
                        <li><a href="https://www.linkedin.com/in/bhopathi-vardhan">LinkedIn</a></li>
                        <li><a href="https://medium.com/@bhopathivardhan654321">Medium Blog</a></li>
                        <li><a href="https://github.com/Bvardhankumarreddy">GitHub</a></li>
                        <li><a href="https://www.youtube.com/@thetechsage-r8f">YouTube</a></li>
                    </ul>
                    <p>Thanks for subscribing!<br><strong>Vardhan Kumar Reddy Bhopathi</strong></p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: email,
        subject: "Welcome to Vardhan's Newsletter! 🎉",
        htmlBody,
    });
};

/**
 * Send review submission confirmation
 */
export const sendReviewSubmissionConfirmation = async ({ name, email, rating }) => {
    const stars = '⭐'.repeat(rating);
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .stars { font-size: 32px; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Review Submitted!</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>Thank you for taking the time to submit your review! Your feedback is greatly appreciated.</p>
                    <div class="stars">${stars}</div>
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>🔍 Your review is currently pending approval</li>
                        <li>✅ Once approved, it will appear on my portfolio</li>
                        <li>📧 You'll receive another email when it's published</li>
                    </ul>
                    <p>Your honest feedback helps me improve and grow. Thank you for being part of my journey!</p>
                    <p>Best regards,<br><strong>Vardhan Kumar Reddy Bhopathi</strong><br>DevOps Engineer</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="text-align: center; color: #888; font-size: 12px;">
                            Portfolio: <a href="https://portfolio.vardhandevops.xyz">portfolio.vardhandevops.xyz</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: email,
        subject: "Review Submitted - Vardhan Portfolio",
        htmlBody,
    });
};

/**
 * Send review approval notification
 */
export const sendReviewApprovalNotification = async ({ name, email, rating, comment }) => {
    const stars = '⭐'.repeat(rating);
    const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .stars { font-size: 32px; text-align: center; margin: 20px 0; }
                .review-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
                .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Your Review is Live!</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>Great news! Your review has been approved and is now live on my portfolio!</p>
                    <div class="stars">${stars}</div>
                    <div class="review-box">
                        <p style="font-style: italic; color: #555;">"${comment}"</p>
                    </div>
                    <p style="text-align: center;">
                        <a href="https://portfolio.vardhandevops.xyz/#testimonials" class="button">View Your Review</a>
                    </p>
                    <p>Thank you for your valuable feedback! It means a lot to me and helps others understand my work better.</p>
                    <p>Feel free to share this with your network!</p>
                    <p>Best regards,<br><strong>Vardhan Kumar Reddy Bhopathi</strong><br>DevOps Engineer</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="text-align: center; color: #888; font-size: 12px;">
                            Connect with me: 
                            <a href="https://www.linkedin.com/in/bhopathi-vardhan">LinkedIn</a> • 
                            <a href="https://github.com/Bvardhankumarreddy">GitHub</a> • 
                            <a href="https://medium.com/@bhopathivardhan654321">Medium</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail({
        to: email,
        subject: "🎉 Your Review is Now Live - Vardhan Portfolio",
        htmlBody,
    });
};
