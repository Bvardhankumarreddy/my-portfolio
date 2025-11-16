# AWS Visitor Counter - Complete Setup

This directory contains everything you need to deploy a visitor counter using AWS Lambda + DynamoDB.

## 📁 Files Included

1. **lambda_function.py** - Python code for Lambda function
2. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment via AWS Console
3. **CLI_COMMANDS.md** - Quick deployment using AWS CLI
4. **VisitCounter_AWS.jsx** - Updated React component for your portfolio

## 🚀 Quick Start (Choose One Method)

### Method 1: AWS Console (Beginner-friendly) - 10 minutes
Follow: `DEPLOYMENT_GUIDE.md`

### Method 2: AWS CLI (Faster) - 5 minutes
Follow: `CLI_COMMANDS.md`

## 📊 After Deployment

1. Get your Lambda API Gateway URL
2. Copy `VisitCounter_AWS.jsx` content
3. Replace your current `src/components/countvists/VisitCounter.jsx`
4. Update the `LAMBDA_API_URL` with your actual API endpoint
5. Deploy your portfolio to S3
6. Test and enjoy! 🎉

## 💰 Cost

**$0.00/month** (or max $0.03/month after first year for API Gateway)

- Lambda: FREE (Always Free - 1M requests/month)
- DynamoDB: FREE (Always Free - 25GB + 200M requests)
- API Gateway: FREE for 12 months, then ~$3.50 per 1M requests

## 🔒 Security

The Lambda function includes CORS headers. Update line 13 in `lambda_function.py`:

```python
'Access-Control-Allow-Origin': 'https://www.portfolio.vardhandevops.xyz',
```

## 📈 Monitoring

View visitor count in real-time:
- AWS Console → DynamoDB → Tables → PortfolioVisitorCounter → Explore items
- AWS Console → Lambda → PortfolioVisitorCounter → Monitor tab

## 🆘 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` troubleshooting section
2. View CloudWatch logs in Lambda console
3. Test Lambda function using Test tab in AWS Console

## ✅ Next Steps

After deployment:
1. ✅ DynamoDB table created
2. ✅ Lambda function deployed
3. ✅ API Gateway configured
4. ✅ React component updated
5. ✅ Portfolio tested
6. ✅ Monitoring setup

Happy coding! 🚀
