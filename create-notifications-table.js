// Create portfolio-notifications DynamoDB table
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB();

const params = {
    TableName: 'portfolio-notifications',
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }  // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'  // On-demand billing
};

async function createTable() {
    try {
        console.log('Creating portfolio-notifications table...');
        const result = await dynamoDB.createTable(params).promise();
        console.log('✅ Table created successfully!');
        console.log('Table ARN:', result.TableDescription.TableArn);
        console.log('Table Status:', result.TableDescription.TableStatus);
        console.log('\nWaiting for table to become ACTIVE...');
        
        // Wait for table to be active
        await dynamoDB.waitFor('tableExists', { TableName: 'portfolio-notifications' }).promise();
        console.log('✅ Table is now ACTIVE and ready to use!');
    } catch (error) {
        if (error.code === 'ResourceInUseException') {
            console.log('ℹ️  Table already exists. Checking status...');
            const describeResult = await dynamoDB.describeTable({ TableName: 'portfolio-notifications' }).promise();
            console.log('Table Status:', describeResult.Table.TableStatus);
        } else {
            console.error('❌ Error creating table:', error);
        }
    }
}

createTable();
