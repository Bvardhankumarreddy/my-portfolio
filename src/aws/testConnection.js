// Test DynamoDB connection and create table if needed
// Run this with: node src/aws/testConnection.js

const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.REACT_APP_DYNAMODB_TABLE_NAME || 'portfolio-reviews';

async function testConnection() {
    console.log('Testing AWS DynamoDB connection...\n');
    console.log('Region:', process.env.REACT_APP_AWS_REGION);
    console.log('Table Name:', tableName);
    console.log('Access Key:', process.env.REACT_APP_AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing');
    console.log('Secret Key:', process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing');
    console.log('\n---\n');

    try {
        // Check if table exists
        console.log('Checking if table exists...');
        const tableInfo = await dynamoDB.describeTable({ TableName: tableName }).promise();
        console.log('✓ Table exists!');
        console.log('Table Status:', tableInfo.Table.TableStatus);
        console.log('Item Count:', tableInfo.Table.ItemCount);
        console.log('\n---\n');

        // Try to scan the table
        console.log('Fetching reviews...');
        const result = await docClient.scan({ TableName: tableName }).promise();
        console.log(`✓ Found ${result.Items.length} reviews`);
        if (result.Items.length > 0) {
            console.log('\nSample review:');
            console.log(JSON.stringify(result.Items[0], null, 2));
        }

        console.log('\n✅ Connection test successful!');
    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            console.log('✗ Table does not exist!');
            console.log('\nWould you like to create it? (This will create the table now)');
            
            // Create table
            await createTable();
        } else if (error.code === 'UnrecognizedClientException' || error.code === 'InvalidSignatureException') {
            console.error('✗ Authentication failed!');
            console.error('Please check your AWS credentials in .env file');
            console.error('Error:', error.message);
        } else {
            console.error('✗ Error:', error.code);
            console.error('Message:', error.message);
        }
    }
}

async function createTable() {
    console.log('\nCreating table...');
    
    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };

    try {
        await dynamoDB.createTable(params).promise();
        console.log('✓ Table created successfully!');
        console.log('Waiting for table to become active...');
        
        await dynamoDB.waitFor('tableExists', { TableName: tableName }).promise();
        console.log('✅ Table is now active and ready to use!');
    } catch (error) {
        console.error('✗ Failed to create table:', error.message);
    }
}

testConnection();
