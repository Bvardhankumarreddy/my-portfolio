# AWS Visitor Counter - Deployment Guide

## 📋 Prerequisites
- AWS Account (Free tier is enough)
- AWS CLI installed (optional but recommended)
- Your portfolio URL: https://www.portfolio.vardhandevops.xyz/

---

## 🚀 Step-by-Step Deployment

### **Step 1: Create DynamoDB Table**

1. Go to AWS Console → DynamoDB
2. Click **"Create table"**
3. Enter these details:
   - **Table name**: `PortfolioVisitorCounter`
   - **Partition key**: `id` (String)
   - **Table settings**: Use default settings
4. Click **"Create table"**
5. Wait for table to become "Active" (30 seconds)

---

### **Step 2: Create IAM Role for Lambda**

1. Go to AWS Console → IAM → Roles
2. Click **"Create role"**
3. Select **"AWS Service"** → **"Lambda"**
4. Attach these policies:
   - `AWSLambdaBasicExecutionRole` (for CloudWatch logs)
   - `AmazonDynamoDBFullAccess` (for DynamoDB access)
5. Name the role: `PortfolioVisitorCounterLambdaRole`
6. Click **"Create role"**

---

### **Step 3: Create Lambda Function**

1. Go to AWS Console → Lambda
2. Click **"Create function"**
3. Enter details:
   - **Function name**: `PortfolioVisitorCounter`
   - **Runtime**: Python 3.12 (or latest Python)
   - **Architecture**: x86_64
   - **Permissions**: Use existing role → Select `PortfolioVisitorCounterLambdaRole`
4. Click **"Create function"**
5. In the code editor:
   - Delete default code
   - Copy-paste content from `lambda_function.py`
   - Click **"Deploy"**

---

### **Step 4: Create API Gateway**

1. In Lambda function page, click **"Add trigger"**
2. Select **"API Gateway"**
3. Choose:
   - **Create a new API**
   - **HTTP API** (simpler and cheaper)
   - **Security**: Open (we'll use CORS)
4. Click **"Add"**
5. Note down the **API endpoint URL** (looks like: `https://abc123.execute-api.us-east-1.amazonaws.com/default/PortfolioVisitorCounter`)

---

### **Step 5: Configure CORS (Security)**

1. In Lambda function, scroll to **Configuration** tab
2. Click **Environment variables** → **Edit**
3. Add variable:
   - Key: `ALLOWED_ORIGIN`
   - Value: `https://www.portfolio.vardhandevops.xyz`
4. Save

5. Update `lambda_function.py` line 13:
   ```python
   'Access-Control-Allow-Origin': 'https://www.portfolio.vardhandevops.xyz',
   ```
   (Replace * with your actual S3 URL for security)

---

### **Step 6: Test Lambda Function**

1. In Lambda console, click **"Test"** tab
2. Create new test event:
   ```json
   {
     "httpMethod": "POST"
   }
   ```
3. Click **"Test"**
4. You should see:
   ```json
   {
     "statusCode": 200,
     "body": "{\"success\": true, \"visitCount\": 1}"
   }
   ```

---

### **Step 7: Update React Component**

Replace the API endpoint in `VisitCounter.jsx` with your Lambda URL from Step 4.

---

## 📊 Verify DynamoDB

1. Go to DynamoDB → Tables → `PortfolioVisitorCounter`
2. Click **"Explore table items"**
3. You should see:
   - `id`: "portfolio_visits"
   - `visit_count`: 1 (or current count)

---

## 💰 Cost Breakdown (Always Free Tier)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Lambda | 1M requests/month | ~10K/month | $0 |
| DynamoDB | 25GB + 200M requests | <1GB + 10K requests | $0 |
| API Gateway | 1M calls/month (12 months) | ~10K/month | $0 (then ~$0.03) |

**Total Monthly Cost: $0.00** 🎉

---

## 🔧 Troubleshooting

### Issue: CORS Error
**Solution**: Update CORS headers in lambda_function.py to match your S3 URL

### Issue: Access Denied
**Solution**: Check IAM role has DynamoDB permissions

### Issue: Table Not Found
**Solution**: Verify table name is exactly `PortfolioVisitorCounter`

---

## 📝 Next Steps

1. Deploy Lambda function
2. Get API Gateway URL
3. Update React component (next file)
4. Test on your portfolio
5. Monitor CloudWatch logs

---

## 🎯 Your API Endpoint

After deployment, your endpoint will be:
```
https://[YOUR-API-ID].execute-api.[REGION].amazonaws.com/default/PortfolioVisitorCounter
```

Save this URL - you'll need it for the React component!
