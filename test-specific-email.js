// Test specific email address
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

async function testSpecificEmail() {
    console.log('🧪 Testing specific email: bdjfbjdhfnbjdnjhdnjjdn@gmail.com\n');
    
    const testEmail = 'bdjfbjdhfnbjdnjhdnjjdn@gmail.com';
    
    // Test 1: Send confirmation to user
    console.log('1️⃣ Sending confirmation to:', testEmail);
    
    const params = {
        Source: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: {
            ToAddresses: [testEmail],
        },
        Message: {
            Subject: {
                Data: '✅ Test Email - Contact Form Confirmation',
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: `
                        <h2>Message Received!</h2>
                        <p>Hi there,</p>
                        <p>This is a test confirmation email to verify that emails can be sent to: ${testEmail}</p>
                        <p>Best regards,<br>Vardhan</p>
                    `,
                    Charset: 'UTF-8',
                },
                Text: {
                    Data: `Message Received!\n\nHi there,\n\nThis is a test confirmation email.\n\nBest regards,\nVardhan`,
                    Charset: 'UTF-8',
                },
            },
        },
        ReplyToAddresses: [REPLY_TO],
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        
        console.log('✅ SUCCESS! Email sent to:', testEmail);
        console.log('📨 Message ID:', response.MessageId);
        console.log('\n✉️ Check the inbox for:', testEmail);
        
    } catch (error) {
        console.error('❌ FAILED! Error sending to:', testEmail);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.Code || error.code);
        
        if (error.message.includes('Email address is not verified')) {
            console.log('\n💡 This email needs to be verified in AWS SES because your account is in sandbox mode.');
            console.log('Solutions:');
            console.log('  1. Verify this email in AWS SES Console');
            console.log('  2. Request production access to send to any email');
        }
        
        process.exit(1);
    }
}

testSpecificEmail();
