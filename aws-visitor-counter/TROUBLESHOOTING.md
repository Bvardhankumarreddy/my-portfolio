# Common Issues and Solutions

## 🔴 Issue 1: CORS Error in Browser Console

**Error Message:**
```
Access to fetch at 'https://...' from origin 'https://www.portfolio.vardhandevops.xyz' 
has been blocked by CORS policy
```

**Solution:**
1. Open `lambda_function.py`
2. Update line 13:
   ```python
   'Access-Control-Allow-Origin': 'https://www.portfolio.vardhandevops.xyz',
   ```
3. Redeploy Lambda function (click "Deploy" button)

---

## 🔴 Issue 2: 403 Forbidden / Access Denied

**Error Message:**
```
User: arn:aws:lambda:... is not authorized to perform: dynamodb:UpdateItem
```

**Solution:**
1. Go to IAM → Roles → `PortfolioVisitorCounterLambdaRole`
2. Click "Attach policies"
3. Add `AmazonDynamoDBFullAccess`
4. Wait 1 minute for permissions to propagate
5. Test again

---

## 🔴 Issue 3: Table Not Found

**Error Message:**
```
Requested resource not found: Table: PortfolioVisitorCounter not found
```

**Solution:**
1. Go to DynamoDB → Tables
2. Verify table name is exactly `PortfolioVisitorCounter` (case-sensitive)
3. If wrong, update table name in `lambda_function.py` line 9
4. Or recreate table with correct name

---

## 🔴 Issue 4: API Gateway 404 Not Found

**Error Message:**
```
{"message":"Not Found"}
```

**Solution:**
1. Verify API Gateway URL is complete
2. Should end with: `/default/PortfolioVisitorCounter`
3. Test Lambda directly in AWS Console first
4. Recreate API Gateway trigger if needed

---

## 🔴 Issue 5: Count Doesn't Increase

**Symptoms:**
- Counter stuck at same number
- No errors in console

**Solution:**
1. Check sessionStorage: Open DevTools → Application → Session Storage
2. Clear `awsVisitCountedThisSession` to force recount
3. Check CloudWatch Logs:
   - Lambda → Monitor → View CloudWatch logs
   - Look for errors in latest log stream
4. Test DynamoDB directly:
   ```bash
   aws dynamodb get-item \
     --table-name PortfolioVisitorCounter \
     --key '{"id":{"S":"portfolio_visits"}}'
   ```

---

## 🔴 Issue 6: High Latency (Slow Response)

**Symptoms:**
- Counter takes 3-5 seconds to load
- "Cold start" delay

**Solution:**
This is normal for AWS Lambda free tier! Solutions:
1. **Accept it** - Only first visit is slow, subsequent are fast
2. **Warm up** - Call API every 5 minutes to keep Lambda warm
3. **Upgrade** - Provisioned concurrency ($$$) eliminates cold starts

For portfolio, cold start is acceptable. Most users won't notice.

---

## 🔴 Issue 7: Counter Resets to 0

**Symptoms:**
- Counter randomly resets
- Loses all visits

**Possible Causes:**
1. DynamoDB table deleted
2. Lambda function updating wrong item
3. Testing with different `id` values

**Solution:**
1. Check DynamoDB → Explore Items
2. Verify `id` is `"portfolio_visits"` (not changing)
3. Check Lambda code - `counter_id` should be constant

---

## 🔴 Issue 8: React Component Not Updating

**Symptoms:**
- Still shows 150 (fallback value)
- No API calls in Network tab

**Solution:**
1. Verify `LAMBDA_API_URL` is updated with your actual endpoint
2. Check browser Network tab:
   - Should see POST request to Lambda URL
   - Check response status (200 = success)
3. Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Check console for errors

---

## 🔴 Issue 9: Multiple Counts Per Visit

**Symptoms:**
- Counter increments by 2-3 on single visit
- Rapid count increase

**Solution:**
1. React StrictMode causes double renders in dev
2. sessionStorage should prevent this
3. Verify `sessionStorage.getItem('awsVisitCountedThisSession')` check
4. Test in production build, not dev server

---

## 🔴 Issue 10: Billing Concerns

**Question:**
"Am I getting charged? I see requests in CloudWatch"

**Answer:**
- Check your AWS Billing Dashboard
- Lambda free tier: 1,000,000 requests/month
- DynamoDB free tier: 200,000,000 requests/month
- Unless you have millions of visitors, you're fine!

**Verify:**
```bash
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-02-01 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

---

## ✅ Testing Checklist

Before going live:

- [ ] Lambda function deployed successfully
- [ ] Test button works in Lambda console
- [ ] DynamoDB table has data
- [ ] API Gateway URL accessible
- [ ] CORS headers match your S3 domain
- [ ] React component updated with correct URL
- [ ] Test in incognito window (fresh session)
- [ ] Check Network tab shows successful POST
- [ ] Verify count increases on refresh (new session)
- [ ] CloudWatch logs show no errors

---

## 📞 Still Stuck?

1. **Check CloudWatch Logs**:
   - Lambda → Monitor → View logs in CloudWatch
   - Most recent log stream shows errors

2. **Test Lambda Directly**:
   - Lambda → Test tab
   - Use test event: `{"httpMethod":"POST"}`
   - Should return `statusCode: 200`

3. **Verify DynamoDB**:
   - DynamoDB → Tables → PortfolioVisitorCounter
   - Explore items → Should see `portfolio_visits` item

4. **Check IAM Permissions**:
   - IAM → Roles → PortfolioVisitorCounterLambdaRole
   - Should have both Lambda and DynamoDB policies

---

## 🎯 Quick Debug Commands

```bash
# Test Lambda
aws lambda invoke \
  --function-name PortfolioVisitorCounter \
  --payload '{"httpMethod":"POST"}' \
  response.json && cat response.json

# Check DynamoDB
aws dynamodb scan --table-name PortfolioVisitorCounter

# View logs
aws logs tail /aws/lambda/PortfolioVisitorCounter --follow

# Get API URL
aws apigatewayv2 get-apis | grep ApiEndpoint
```

---

Happy debugging! 🐛🔧
