# DynamoDB Setup Guide for Portfolio Reviews

## Prerequisites
- AWS Account (Free Tier available)
- AWS CLI installed (optional, but recommended)

## Step 1: Create DynamoDB Table

### Option A: Using AWS Console (Easier)

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **DynamoDB** service
3. Click **Create table**
4. Configure:
   - **Table name**: `portfolio-reviews`
   - **Partition key**: `id` (String)
   - **Table settings**: Use default settings (On-demand capacity)
5. Click **Create table**

### Option B: Using AWS CLI

```bash
aws dynamodb create-table \
    --table-name portfolio-reviews \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

## Step 2: Create IAM User for Access

1. Go to **IAM** → **Users** → **Create user**
2. User name: `portfolio-app-user`
3. Enable **Access key - Programmatic access**
4. Click **Next: Permissions**
5. Click **Attach policies directly**
6. Search and select: **AmazonDynamoDBFullAccess** (or create custom policy below)
7. Click **Create user**
8. **IMPORTANT**: Save the **Access Key ID** and **Secret Access Key**

### Custom Policy (More Secure - Recommended)

Instead of Full Access, create a custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:*:table/portfolio-reviews"
        }
    ]
}
```

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your AWS credentials:
   ```env
   REACT_APP_AWS_REGION=us-east-1
   REACT_APP_AWS_ACCESS_KEY_ID=your_access_key_id
   REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_access_key
   REACT_APP_DYNAMODB_TABLE_NAME=portfolio-reviews
   ```

3. **IMPORTANT**: Add `.env` to `.gitignore` (should already be there)

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to Testimonials section
3. Click "Add Your Review"
4. Fill out the form and submit
5. Check DynamoDB table in AWS Console to verify data was saved

## Table Schema

The `portfolio-reviews` table stores items with this structure:

```json
{
    "id": "review_1699999999999_abc123",     // Partition Key
    "name": "John Doe",
    "title": "Software Engineer at Company Name",
    "rating": 5,
    "comment": "Great work!",
    "approved": true,
    "createdAt": "2025-11-12T10:30:00.000Z",
    "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

## Cost Estimate (Free Tier)

- **DynamoDB Free Tier**: 25 GB storage, 25 Read/Write capacity units
- **Estimated Usage**: 
  - Storage: < 1 MB for hundreds of reviews
  - Reads: ~10-50 per day (well under limit)
  - Writes: ~1-5 per day (well under limit)

**Result**: Completely FREE for personal portfolio use! 🎉

## Security Best Practices

1. ✅ Never commit `.env` file to Git
2. ✅ Use IAM user with minimal permissions (custom policy above)
3. ✅ Rotate access keys every 90 days
4. ✅ Consider using AWS Cognito for frontend authentication in production
5. ✅ Enable CloudWatch monitoring for unusual activity

## Troubleshooting

### Error: "Access Denied"
- Check IAM permissions are correct
- Verify access keys are properly set in `.env`
- Ensure table name matches in both DynamoDB and `.env`

### Error: "Table Not Found"
- Verify table was created in correct region
- Check `REACT_APP_AWS_REGION` matches table region

### Reviews Not Showing
- Check browser console for errors
- Verify AWS credentials in `.env`
- Check DynamoDB table has items with `approved: true`

## Advantages Over Firebase

✅ **Native AWS Integration** - Works with your AWS skills
✅ **Better Free Tier** - 25 GB vs Firebase's 1 GB
✅ **No Real-time Overhead** - Simpler, faster, smaller bundle
✅ **Pay-per-use** - Only pay for what you actually use
✅ **IAM Security** - Fine-grained access control
✅ **AWS Ecosystem** - Easy to add Lambda, S3, CloudFront later

## Next Steps

- [ ] Set up CloudWatch alarms for error monitoring
- [ ] Create Lambda function for review moderation
- [ ] Add API Gateway for secure backend API
- [ ] Implement review reporting/flagging system
