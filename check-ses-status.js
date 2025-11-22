// Check domain verification status
require('dotenv').config();
const { SESClient, ListIdentitiesCommand, GetIdentityVerificationAttributesCommand } = require("@aws-sdk/client-ses");

const sesConfig = {
    region: process.env.REACT_APP_SES_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SES_SECRET_ACCESS_KEY,
    },
};

const sesClient = new SESClient(sesConfig);

async function checkVerificationStatus() {
    console.log('🔍 Checking SES Identity Verification Status...\n');
    
    try {
        // List all identities
        const listCommand = new ListIdentitiesCommand({});
        const listResponse = await sesClient.send(listCommand);
        
        console.log('📋 Your SES Identities:');
        console.log('========================\n');
        
        if (listResponse.Identities.length === 0) {
            console.log('❌ No identities found. Please add your domain or email addresses.\n');
            return;
        }
        
        // Get verification status for all identities
        const verifyCommand = new GetIdentityVerificationAttributesCommand({
            Identities: listResponse.Identities
        });
        const verifyResponse = await sesClient.send(verifyCommand);
        
        listResponse.Identities.forEach(identity => {
            const status = verifyResponse.VerificationAttributes[identity];
            const isVerified = status?.VerificationStatus === 'Success';
            const isDomain = identity.includes('.');
            
            console.log(`${isVerified ? '✅' : '⏳'} ${isDomain ? '🌐 Domain:' : '📧 Email:'} ${identity}`);
            console.log(`   Status: ${status?.VerificationStatus || 'Pending'}`);
            
            if (!isVerified && isDomain) {
                console.log('   💡 Action: Add the CNAME records to your domain DNS');
            } else if (!isVerified && !isDomain) {
                console.log('   💡 Action: Check inbox and click verification link');
            }
            console.log('');
        });
        
        const allVerified = listResponse.Identities.every(identity => 
            verifyResponse.VerificationAttributes[identity]?.VerificationStatus === 'Success'
        );
        
        if (allVerified) {
            console.log('🎉 All identities verified!\n');
            console.log('Next step: Request production access to send to any email address.');
        } else {
            console.log('⏳ Some identities pending verification.\n');
            console.log('Wait for verification to complete, then request production access.');
        }
        
    } catch (error) {
        console.error('❌ Error checking status:', error.message);
    }
}

checkVerificationStatus();
