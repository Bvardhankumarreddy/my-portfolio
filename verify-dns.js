// Verify DNS Records and Email Configuration
const dns = require('dns').promises;

async function checkDNSRecords() {
    console.log('🔍 Checking DNS Records for vardhandevops.xyz...\n');
    
    const domain = 'vardhandevops.xyz';
    
    try {
        // Check SPF Record
        console.log('📧 SPF Record Check:');
        console.log('====================');
        try {
            const txtRecords = await dns.resolveTxt(domain);
            const spfRecord = txtRecords.find(record => 
                record.join('').includes('v=spf1')
            );
            
            if (spfRecord) {
                console.log('✅ SPF Record Found:');
                console.log(`   ${spfRecord.join('')}`);
                
                if (spfRecord.join('').includes('amazonses.com')) {
                    console.log('✅ Includes amazonses.com');
                } else {
                    console.log('⚠️  Missing amazonses.com - emails may be flagged as spam');
                }
            } else {
                console.log('❌ No SPF record found!');
                console.log('Action: Add this TXT record:');
                console.log('   Name: @');
                console.log('   Value: v=spf1 include:amazonses.com ~all');
            }
        } catch (err) {
            console.log('❌ SPF record not found or DNS error');
        }
        
        console.log('\n\n📊 DMARC Record Check:');
        console.log('======================');
        try {
            const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
            if (dmarcRecords && dmarcRecords.length > 0) {
                console.log('✅ DMARC Record Found:');
                dmarcRecords.forEach(record => {
                    console.log(`   ${record.join('')}`);
                });
            } else {
                console.log('❌ No DMARC record found!');
            }
        } catch (err) {
            console.log('❌ DMARC record not found');
            console.log('Action: Add this TXT record:');
            console.log('   Name: _dmarc');
            console.log('   Value: v=DMARC1; p=quarantine; rua=mailto:bhopathivardhan654321@gmail.com');
        }
        
        console.log('\n\n🔐 DKIM Records Check:');
        console.log('======================');
        const dkimSelectors = [
            'f72h7bruodpe4xyoeprfoma45trfcbab',
            'le6z4f6afwcnbanzteqk6zzcjmpiczjq',
            's6lnimtu743hbpnwr4rjuqf4ut3wmmz2'
        ];
        
        for (const selector of dkimSelectors) {
            try {
                const dkimDomain = `${selector}._domainkey.${domain}`;
                const records = await dns.resolveCname(dkimDomain);
                if (records && records.length > 0) {
                    console.log(`✅ DKIM ${selector.substring(0, 8)}... configured`);
                }
            } catch (err) {
                console.log(`❌ DKIM ${selector.substring(0, 8)}... NOT found`);
            }
        }
        
        console.log('\n\n💡 Additional Spam Prevention Tips:');
        console.log('====================================\n');
        
        console.log('1. ✅ Warm up your sending domain:');
        console.log('   - Start with low volume (10-20 emails/day)');
        console.log('   - Gradually increase over 2-4 weeks');
        console.log('   - This builds sender reputation\n');
        
        console.log('2. ⚠️  Email Content Issues:');
        console.log('   - Avoid spam trigger words (FREE, URGENT, ACT NOW, etc.)');
        console.log('   - Don\'t use ALL CAPS in subject lines');
        console.log('   - Keep text-to-image ratio balanced');
        console.log('   - Include unsubscribe link (for newsletters)\n');
        
        console.log('3. 📧 Email Headers:');
        console.log('   - Use a professional "From" name');
        console.log('   - Set proper Reply-To address');
        console.log('   - Include List-Unsubscribe header (newsletters)\n');
        
        console.log('4. 🎯 Recipient Engagement:');
        console.log('   - Only send to engaged users');
        console.log('   - Remove bounced/complained addresses');
        console.log('   - Monitor complaint rates in SES\n');
        
        console.log('5. 🌐 Domain Reputation:');
        console.log('   - New domains need time (2-4 weeks)');
        console.log('   - Consistent sending patterns help');
        console.log('   - Keep bounce rate < 5%');
        console.log('   - Keep complaint rate < 0.1%\n');
        
        console.log('6. 📱 Gmail-Specific Tips:');
        console.log('   - Send from same address consistently');
        console.log('   - Ask recipients to add you to contacts');
        console.log('   - Request recipients to move from spam to inbox');
        console.log('   - Check Gmail Postmaster Tools (postmaster.google.com)\n');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkDNSRecords();
