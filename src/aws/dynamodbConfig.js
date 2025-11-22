import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

// Create DynamoDB document client for easier data manipulation
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export { dynamoDB, AWS };
