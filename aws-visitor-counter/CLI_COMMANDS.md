# Quick Commands for AWS Deployment

## Using AWS CLI (Faster Method)

### 1. Create DynamoDB Table
```bash
aws dynamodb create-table \
    --table-name PortfolioVisitorCounter \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 2. Create IAM Role (Save as trust-policy.json)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
# Create role
aws iam create-role \
    --role-name PortfolioVisitorCounterLambdaRole \
    --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
    --role-name PortfolioVisitorCounterLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
    --role-name PortfolioVisitorCounterLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### 3. Create Lambda Function Deployment Package
```bash
cd aws-visitor-counter
zip function.zip lambda_function.py
```

### 4. Create Lambda Function
```bash
# Replace YOUR-ACCOUNT-ID with your AWS account ID
aws lambda create-function \
    --function-name PortfolioVisitorCounter \
    --runtime python3.12 \
    --role arn:aws:iam::YOUR-ACCOUNT-ID:role/PortfolioVisitorCounterLambdaRole \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://function.zip \
    --region us-east-1
```

### 5. Create API Gateway
```bash
# Create HTTP API
aws apigatewayv2 create-api \
    --name PortfolioVisitorCounterAPI \
    --protocol-type HTTP \
    --target arn:aws:lambda:us-east-1:YOUR-ACCOUNT-ID:function:PortfolioVisitorCounter \
    --region us-east-1
```

### 6. Add Lambda Permission for API Gateway
```bash
aws lambda add-permission \
    --function-name PortfolioVisitorCounter \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --region us-east-1
```

---

## Get Your API Endpoint

```bash
aws apigatewayv2 get-apis --region us-east-1 | grep -A 5 "PortfolioVisitorCounterAPI"
```

Look for `"ApiEndpoint"` in the output - this is your Lambda URL!

---

## Test Your Lambda Function

```bash
aws lambda invoke \
    --function-name PortfolioVisitorCounter \
    --payload '{"httpMethod":"POST"}' \
    response.json \
    --region us-east-1

cat response.json
```

You should see:
```json
{"statusCode": 200, "body": "{\"success\": true, \"visitCount\": 1}"}
```

---

## View DynamoDB Data

```bash
aws dynamodb get-item \
    --table-name PortfolioVisitorCounter \
    --key '{"id":{"S":"portfolio_visits"}}' \
    --region us-east-1
```

---

## Update Lambda Code (After Changes)

```bash
cd aws-visitor-counter
zip function.zip lambda_function.py

aws lambda update-function-code \
    --function-name PortfolioVisitorCounter \
    --zip-file fileb://function.zip \
    --region us-east-1
```

---

## Delete Everything (Cleanup)

```bash
# Delete API Gateway
aws apigatewayv2 delete-api --api-id YOUR-API-ID --region us-east-1

# Delete Lambda
aws lambda delete-function --function-name PortfolioVisitorCounter --region us-east-1

# Delete DynamoDB Table
aws dynamodb delete-table --table-name PortfolioVisitorCounter --region us-east-1

# Delete IAM Role
aws iam detach-role-policy --role-name PortfolioVisitorCounterLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam detach-role-policy --role-name PortfolioVisitorCounterLambdaRole --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam delete-role --role-name PortfolioVisitorCounterLambdaRole
```
