// Test script for AWS SES email functionality
require('dotenv').config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// AWS SES Configuration
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

async function testEmail() {
    console.log('🧪 Testing AWS SES Email Functionality...\n');
    
    // Check environment variables
    console.log('📋 Configuration:');
    console.log('  Region:', sesConfig.region);
    console.log('  From Email:', FROM_EMAIL);
    console.log('  From Name:', FROM_NAME);
    console.log('  Reply To:', REPLY_TO);
    console.log('  Access Key ID:', sesConfig.credentials.accessKeyId ? '✓ Set' : '✗ Missing');
    console.log('  Secret Access Key:', sesConfig.credentials.secretAccessKey ? '✓ Set' : '✗ Missing');
    console.log('');

    if (!sesConfig.credentials.accessKeyId || !sesConfig.credentials.secretAccessKey) {
        console.error('❌ Error: AWS credentials are missing!');
        console.log('Please check your .env file has:');
        console.log('  REACT_APP_SES_ACCESS_KEY_ID');
        console.log('  REACT_APP_SES_SECRET_ACCESS_KEY');
        process.exit(1);
    }

    // Test email parameters
    const testEmailAddress = REPLY_TO; // Send test email to yourself
    
    const params = {
        Source: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: {
            ToAddresses: [testEmailAddress],
        },
        Message: {
            Subject: {
                Data: '✅ Test Email from Portfolio - AWS SES Working!',
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
                                .info { background: #fff; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px; margin: 10px 0; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🎉 AWS SES Test Successful!</h1>
                                </div>
                                <div class="content">
                                    <div class="success">
                                        <h2>✅ Email Service is Working!</h2>
                                        <p>Your AWS SES integration is configured correctly and emails are being sent successfully.</p>
                                    </div>
                                    
                                    <div class="info">
                                        <h3>Configuration Details:</h3>
                                        <ul>
                                            <li><strong>Region:</strong> ${sesConfig.region}</li>
                                            <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
                                            <li><strong>From Name:</strong> ${FROM_NAME}</li>
                                            <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
                                        </ul>
                                    </div>
                                    
                                    <div class="info">
                                        <h3>What's Working:</h3>
                                        <ul>
                                            <li>✅ AWS SES credentials are valid</li>
                                            <li>✅ Email sending is functional</li>
                                            <li>✅ HTML email rendering</li>
                                            <li>✅ Ready for production use</li>
                                        </ul>
                                    </div>
                                    
                                    <p style="margin-top: 20px;">
                                        <strong>Next Steps:</strong>
                                    </p>
                                    <ul>
                                        <li>Test contact form on your website</li>
                                        <li>Test newsletter subscription</li>
                                        <li>Test review submission notifications</li>
                                        <li>Verify email deliverability</li>
                                    </ul>
                                </div>
                                <div class="footer">
                                    <p>This is an automated test email from your portfolio's AWS SES integration.</p>
                                    <p>© ${new Date().getFullYear()} Vardhan's Portfolio</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                    Charset: 'UTF-8',
                },
                Text: {
                    Data: `
AWS SES Test Email - Success!

Your AWS SES integration is working correctly!

Configuration:
- Region: ${sesConfig.region}
- From Email: ${FROM_EMAIL}
- From Name: ${FROM_NAME}
- Test Date: ${new Date().toLocaleString()}

All systems are functional and ready for production use.

Next steps:
1. Test contact form on your website
2. Test newsletter subscription
3. Test review submission notifications
4. Verify email deliverability

This is an automated test email from your portfolio's AWS SES integration.
                    `,
                    Charset: 'UTF-8',
                },
            },
        },
        ReplyToAddresses: [REPLY_TO],
    };

    try {
        console.log('📧 Sending test email to:', testEmailAddress);
        console.log('⏳ Please wait...\n');
        
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        
        console.log('✅ SUCCESS! Email sent successfully!');
        console.log('📨 Message ID:', response.MessageId);
        console.log('');
        console.log('✉️  Check your inbox at:', testEmailAddress);
        console.log('💡 If you don\'t see it, check your spam folder.');
        console.log('');
        console.log('🎉 Your AWS SES integration is working perfectly!');
        
    } catch (error) {
        console.error('❌ FAILED! Error sending email:');
        console.error('');
        console.error('Error Details:');
        console.error('  Message:', error.message);
        console.error('  Code:', error.Code || error.code);
        console.error('');
        
        if (error.message.includes('Email address is not verified')) {
            console.log('💡 Solution: Verify your email address in AWS SES:');
            console.log('   1. Go to AWS SES Console');
            console.log('   2. Navigate to "Verified identities"');
            console.log('   3. Click "Create identity"');
            console.log('   4. Verify:', FROM_EMAIL);
            console.log('   5. Check your email for verification link');
        } else if (error.message.includes('AccessDenied') || error.message.includes('InvalidClientTokenId')) {
            console.log('💡 Solution: Check your AWS credentials:');
            console.log('   1. Verify REACT_APP_SES_ACCESS_KEY_ID in .env');
            console.log('   2. Verify REACT_APP_SES_SECRET_ACCESS_KEY in .env');
            console.log('   3. Ensure IAM user has SES permissions');
        } else if (error.message.includes('Sandbox')) {
            console.log('💡 Solution: Your account is in SES Sandbox mode:');
            console.log('   1. Verify the recipient email in AWS SES');
            console.log('   2. Or request production access in AWS SES Console');
        }
        
        process.exit(1);
    }
}

// Run the test
testEmail();
