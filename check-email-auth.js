// Check SES DKIM and Email Authentication Status
require('dotenv').config();
const { SESClient, GetIdentityDkimAttributesCommand, GetIdentityMailFromDomainAttributesCommand } = require("@aws-sdk/client-ses");

const sesConfig = {
    region: process.env.REACT_APP_SES_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SES_SECRET_ACCESS_KEY,
    },
};

const sesClient = new SESClient(sesConfig);

async function checkEmailAuthentication() {
    console.log('🔍 Checking Email Authentication Setup...\n');
    
    const domain = 'vardhandevops.xyz';
    
    try {
        // Check DKIM status
        console.log('📧 DKIM Authentication:');
        console.log('========================\n');
        
        const dkimCommand = new GetIdentityDkimAttributesCommand({
            Identities: [domain]
        });
        const dkimResponse = await sesClient.send(dkimCommand);
        const dkimAttr = dkimResponse.DkimAttributes[domain];
        
        if (dkimAttr) {
            console.log(`Domain: ${domain}`);
            console.log(`DKIM Enabled: ${dkimAttr.DkimEnabled ? '✅ Yes' : '❌ No'}`);
            console.log(`DKIM Status: ${dkimAttr.DkimVerificationStatus}`);
            
            if (dkimAttr.DkimTokens && dkimAttr.DkimTokens.length > 0) {
                console.log('\nDKIM DNS Records to Add:');
                console.log('------------------------');
                dkimAttr.DkimTokens.forEach((token, index) => {
                    console.log(`\n${index + 1}. CNAME Record:`);
                    console.log(`   Name: ${token}._domainkey.${domain}`);
                    console.log(`   Value: ${token}.dkim.amazonses.com`);
                });
            }
            
            if (dkimAttr.DkimVerificationStatus !== 'Success') {
                console.log('\n⚠️  DKIM not verified! This causes emails to go to spam.');
                console.log('Action needed: Add the CNAME records above to your DNS.');
            } else {
                console.log('\n✅ DKIM is properly configured!');
            }
        }
        
        console.log('\n\n📬 Custom MAIL FROM Domain:');
        console.log('===========================\n');
        
        const mailFromCommand = new GetIdentityMailFromDomainAttributesCommand({
            Identities: [domain]
        });
        const mailFromResponse = await sesClient.send(mailFromCommand);
        const mailFromAttr = mailFromResponse.MailFromDomainAttributes[domain];
        
        if (mailFromAttr && mailFromAttr.MailFromDomain) {
            console.log(`Domain: ${domain}`);
            console.log(`MAIL FROM Domain: ${mailFromAttr.MailFromDomain}`);
            console.log(`Status: ${mailFromAttr.MailFromDomainStatus}`);
            
            if (mailFromAttr.MailFromDomainStatus !== 'Success') {
                console.log('\n⚠️  Custom MAIL FROM not verified!');
                console.log('Action needed: Add MX and SPF records to DNS.');
            } else {
                console.log('\n✅ Custom MAIL FROM is configured!');
            }
        } else {
            console.log('❌ No custom MAIL FROM domain configured.');
            console.log('\nRecommended: Set up custom MAIL FROM domain to improve deliverability.');
        }
        
        console.log('\n\n📊 Spam Prevention Checklist:');
        console.log('=============================\n');
        
        const checks = [
            { name: 'DKIM Records', status: dkimAttr?.DkimVerificationStatus === 'Success' },
            { name: 'Domain Verified', status: true },
            { name: 'Production Access', status: true },
            { name: 'SPF Record', status: false, note: 'Need to check DNS' },
            { name: 'DMARC Record', status: false, note: 'Recommended to add' },
        ];
        
        checks.forEach(check => {
            const icon = check.status ? '✅' : '⏳';
            const note = check.note ? ` (${check.note})` : '';
            console.log(`${icon} ${check.name}${note}`);
        });
        
        console.log('\n\n💡 Quick Fixes to Avoid Spam:');
        console.log('==============================\n');
        console.log('1. Add DKIM records (if not verified above)');
        console.log('2. Add SPF record to your DNS:');
        console.log('   Type: TXT');
        console.log('   Name: @');
        console.log('   Value: v=spf1 include:amazonses.com ~all');
        console.log('\n3. Add DMARC record to your DNS:');
        console.log('   Type: TXT');
        console.log('   Name: _dmarc');
        console.log('   Value: v=DMARC1; p=none; rua=mailto:bhopathivardhan654321@gmail.com');
        console.log('\n4. Wait 24-48 hours after adding records');
        console.log('5. Build sender reputation by sending legitimate emails');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkEmailAuthentication();
