# Deploy Lambda Function URL - Quick Steps

## ✅ Your Lambda Function URL
```
https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/
```

---

## 🚀 Deployment Steps

### **Step 1: Update Lambda Function Code**

1. **Go to AWS Lambda Console** → `PortfolioVisitorCounter`
2. **Code tab** → Open `lambda_function.py`
3. **Replace ALL code** with the updated version from `aws-visitor-counter/lambda_function.py`
4. Click **"Deploy"** button
5. Wait for "Successfully updated the function" message

### **Step 2: Configure Function URL CORS (IMPORTANT)**

1. In Lambda function, go to **Configuration** tab
2. Click **Function URL** (left sidebar)
3. Click **Edit**
4. **Configure cross-origin resource sharing (CORS)** section:
   - ✅ **Enable CORS**
   - **Allow origin**: `https://www.portfolio.vardhandevops.xyz,https://portfolio.vardhandevops.xyz`
   - **Allow methods**: `GET,POST,OPTIONS`
   - **Allow headers**: `Content-Type`
   - **Expose headers**: `*` (optional)
   - **Max age**: `300`
   - **Allow credentials**: ✅ Check this
5. Click **Save**

---

## 🧪 Test the Function

### **Test 1: Lambda Console**

1. In Lambda console, click **Test** tab
2. Create new test event:
```json
{
  "requestContext": {
    "http": {
      "method": "POST"
    }
  },
  "headers": {
    "origin": "https://www.portfolio.vardhandevops.xyz"
  }
}
```
3. Click **Test**
4. **Expected Result**:
```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "https://www.portfolio.vardhandevops.xyz",
    ...
  },
  "body": "{\"success\": true, \"visitCount\": X}"
}
```

### **Test 2: PowerShell (From Your Computer)**

```powershell
# Test POST request
curl -X POST https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/ `
  -H "Origin: https://www.portfolio.vardhandevops.xyz" `
  -H "Content-Type: application/json" `
  -v
```

**Expected Output:**
```
< HTTP/2 200
< access-control-allow-origin: https://www.portfolio.vardhandevops.xyz
< content-type: application/json
...
{"success": true, "visitCount": X}
```

### **Test 3: Browser DevTools**

1. Open `https://www.portfolio.vardhandevops.xyz`
2. Press **F12** → **Console** tab
3. You should see: `AWS Lambda response: {success: true, visitCount: X}`
4. Go to **Network** tab
5. Find the Lambda request
6. Click on it → **Headers** section:
   - Status: `200 OK`
   - Response Headers should have: `access-control-allow-origin: https://www.portfolio.vardhandevops.xyz`

---

## 🔍 Verify DynamoDB

1. **AWS Console** → **DynamoDB** → **Tables**
2. Click `PortfolioVisitorCounter`
3. **Actions** → **Explore table items**
4. You should see:
   - `id`: `"portfolio_visits"`
   - `visit_count`: Incremented number

---

## ⚠️ Common Issues

### Issue: Still Getting CORS Error
**Solution**: 
1. Verify Function URL CORS settings in AWS Console
2. Make sure `Access-Control-Allow-Credentials` is enabled
3. Redeploy Lambda function after code update

### Issue: 404 Not Found
**Solution**: 
1. Function URL should NOT have `/default/` in path
2. Your URL is correct: `https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/`
3. Make sure you're using POST method, not GET

### Issue: Headers Case Sensitivity
**Solution**: Updated code now checks both `origin` and `Origin` headers

---

## 📦 Build & Deploy to S3

After Lambda is working:

```powershell
# 1. Build React app
npm run build

# 2. Upload to S3 (replace with your bucket name)
aws s3 sync ./build s3://your-bucket-name --delete

# OR use S3 Console to upload build folder
```

---

## ✅ Final Verification Checklist

- [ ] Lambda function code updated and deployed
- [ ] Function URL CORS configured in AWS Console
- [ ] Lambda test passes with 200 status
- [ ] curl test returns correct CORS headers
- [ ] DynamoDB shows incrementing visit_count
- [ ] React app rebuilt with `npm run build`
- [ ] Build uploaded to S3
- [ ] Production site shows visitor count
- [ ] Browser console shows no CORS errors
- [ ] Counter increments on new browser sessions

---

## 🎯 Your Setup Summary

| Component | Value |
|-----------|-------|
| **Lambda Function** | `PortfolioVisitorCounter` |
| **DynamoDB Table** | `PortfolioVisitorCounter` |
| **Function URL** | `https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/` |
| **Production Site** | `https://www.portfolio.vardhandevops.xyz` |
| **React Component** | `src/components/countvists/VisitCounter.jsx` ✅ |

---

## 🆘 Still Having Issues?

Share these details:
1. Screenshot of Lambda test result
2. Browser DevTools Network tab screenshot
3. Exact error message from console
4. CloudWatch logs (Lambda → Monitor → View logs in CloudWatch)
