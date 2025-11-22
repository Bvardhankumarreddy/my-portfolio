// Test script to verify DynamoDB tables are accessible
require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB();

const tables = [
    'portfolio-projects',
    'portfolio-certifications',
    'portfolio-blogs'
];

async function testTable(tableName) {
    try {
        const result = await dynamoDB.describeTable({ TableName: tableName }).promise();
        console.log(`✅ ${tableName}: EXISTS`);
        console.log(`   - Status: ${result.Table.TableStatus}`);
        console.log(`   - Items: Checking count...`);
        
        // Count items
        const docClient = new AWS.DynamoDB.DocumentClient();
        const scanResult = await docClient.scan({ TableName: tableName }).promise();
        console.log(`   - Count: ${scanResult.Count} items\n`);
        
        return true;
    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            console.log(`❌ ${tableName}: NOT FOUND`);
            console.log(`   - Please create this table in AWS Console\n`);
        } else {
            console.log(`❌ ${tableName}: ERROR`);
            console.log(`   - ${error.message}\n`);
        }
        return false;
    }
}

async function runTests() {
    console.log('🔍 Testing DynamoDB Tables...\n');
    console.log('Region:', process.env.REACT_APP_AWS_REGION || 'us-east-1');
    console.log('Access Key:', process.env.REACT_APP_AWS_ACCESS_KEY_ID ? '✓ Configured' : '❌ Missing');
    console.log('Secret Key:', process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ? '✓ Configured' : '❌ Missing');
    console.log('\n' + '='.repeat(50) + '\n');
    
    let allSuccess = true;
    for (const table of tables) {
        const success = await testTable(table);
        if (!success) allSuccess = false;
    }
    
    console.log('='.repeat(50));
    if (allSuccess) {
        console.log('\n✅ All tables are ready!');
        console.log('\nYou can now:');
        console.log('1. Navigate to http://localhost:3000/admin');
        console.log('2. Login with password: admin123');
        console.log('3. Start adding projects, certifications, and blogs!\n');
    } else {
        console.log('\n⚠️  Some tables are missing or have errors.');
        console.log('\nNext steps:');
        console.log('1. Check AWS Console: https://console.aws.amazon.com/dynamodb');
        console.log('2. Verify table names match exactly');
        console.log('3. Verify IAM permissions are set correctly');
        console.log('4. Check your .env file has correct AWS credentials\n');
    }
}

runTests().catch(console.error);
