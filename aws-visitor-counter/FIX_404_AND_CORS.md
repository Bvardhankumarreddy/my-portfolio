# Fix 404 and CORS Errors - Step by Step

## 🔴 Problem 1: API Gateway 404 Error

The 404 error means the API Gateway endpoint doesn't match what Lambda expects.

### **Solution: Configure API Gateway Correctly**

#### Option A: Using Lambda Function URL (RECOMMENDED - Simpler)

1. **Go to Lambda Console** → Open `PortfolioVisitorCounter` function
2. **Configuration** tab → **Function URL**
3. Click **"Create function URL"**
4. Settings:
   - **Auth type**: NONE
   - **Configure cross-origin resource sharing (CORS)**: ✅ Check this
   - **Allow origin**: `https://www.portfolio.vardhandevops.xyz`
   - **Allow methods**: `GET, POST, OPTIONS`
   - **Allow headers**: `Content-Type`
   - **Max age**: `300`
5. Click **"Save"**
6. **Copy the Function URL** (looks like: `https://abc123xyz.lambda-url.us-east-1.on.aws/`)

**Update VisitCounter.jsx with this new URL**

---

#### Option B: Fix Existing API Gateway (If you prefer)

1. **Go to API Gateway Console**
2. Find your HTTP API
3. Click **"Routes"**
4. **Delete existing route if misconfigured**
5. Click **"Create"**
6. Settings:
   - **Method**: `ANY`
   - **Path**: `/` (just a forward slash)
   - **Integration**: Your Lambda function
7. Click **"Create"**
8. Go to **"CORS"** settings
9. Configure:
   - **Access-Control-Allow-Origin**: `https://www.portfolio.vardhandevops.xyz`
   - **Access-Control-Allow-Headers**: `Content-Type`
   - **Access-Control-Allow-Methods**: `GET, POST, OPTIONS`
10. Click **"Deploy"**

---

## 🔴 Problem 2: CORS Error

### **Solution: Update Lambda Function CORS Headers**

Your S3 bucket URL is: `https://www.portfolio.vardhandevops.xyz`

**Edit lambda_function.py** (around line 20):

```python
# Allow your production site
allowed_origins = [
    'https://www.portfolio.vardhandevops.xyz',
    'https://portfolio.vardhandevops.xyz',  # Without www
    'http://localhost:3000',  # For local testing
]
```

**Deploy the updated code** in Lambda Console.

---

## 🧪 Testing Steps

### **Step 1: Test Lambda Directly**

1. Go to Lambda → `PortfolioVisitorCounter`
2. Click **"Test"** tab
3. Create test event:
```json
{
  "httpMethod": "POST",
  "headers": {
    "origin": "https://www.portfolio.vardhandevops.xyz"
  }
}
```
4. Click **"Test"**
5. **Expected Response**:
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

### **Step 2: Test API Gateway Endpoint**

**Using curl (PowerShell):**

```powershell
# Replace with YOUR actual API URL
$apiUrl = "https://YOUR-API-ID.lambda-url.us-east-1.on.aws/"

# Test OPTIONS (CORS preflight)
curl -X OPTIONS $apiUrl `
  -H "Origin: https://www.portfolio.vardhandevops.xyz" `
  -H "Access-Control-Request-Method: POST" `
  -v

# Test POST (actual request)
curl -X POST $apiUrl `
  -H "Origin: https://www.portfolio.vardhandevops.xyz" `
  -H "Content-Type: application/json" `
  -v
```

**Expected Response Headers:**
```
< HTTP/2 200
< access-control-allow-origin: https://www.portfolio.vardhandevops.xyz
< access-control-allow-methods: GET, POST, OPTIONS
< access-control-allow-headers: Content-Type
< content-type: application/json
```

### **Step 3: Test from Browser**

1. Open your portfolio: `https://www.portfolio.vardhandevops.xyz`
2. Open **DevTools** (F12) → **Console** tab
3. Check for errors
4. Go to **Network** tab
5. Refresh page
6. Find the Lambda API call
7. Click on it → Check:
   - **Status**: Should be `200 OK` (not 404)
   - **Response Headers**: Should have `access-control-allow-origin`
   - **Response**: Should have `{"success": true, "visitCount": X}`

---

## 🔍 Common Issues & Fixes

### Issue 1: Still Getting 404
**Cause**: API Gateway route path mismatch

**Fix**:
- Use Lambda Function URL instead (simpler)
- OR ensure API Gateway route is `/` not `/default/PortfolioVisitorCounter`

### Issue 2: CORS Preflight Failing
**Cause**: Lambda not handling OPTIONS request

**Fix**: Check lambda_function.py lines 40-47 handle OPTIONS:
```python
if event.get('httpMethod') == 'OPTIONS':
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps('OK')
    }
```

### Issue 3: Origin Not Allowed
**Cause**: S3 URL doesn't match allowed_origins

**Fix**: Add exact URL from browser address bar to allowed_origins array

### Issue 4: Still Getting 404 with Function URL
**Cause**: Function URL expects root path

**Fix**: Your Lambda is deployed correctly, URL should work at root `/`

---

## ✅ Final Checklist

- [ ] Lambda function deployed with updated CORS origins
- [ ] API endpoint chosen (Function URL recommended)
- [ ] Test event passes in Lambda console
- [ ] curl test returns 200 status
- [ ] Browser DevTools shows 200 response (not 404)
- [ ] CORS headers present in response
- [ ] VisitCounter.jsx updated with correct URL
- [ ] Portfolio rebuild: `npm run build`
- [ ] Upload build to S3
- [ ] Test on production site

---

## 📝 Next Step: Update Your React Component

After you get the working API URL (either Function URL or fixed API Gateway), update:

**File**: `src/components/countvists/VisitCounter.jsx`

**Line 4**: Replace with your working URL:
```javascript
const LAMBDA_API_URL = 'https://YOUR-ACTUAL-WORKING-URL/';
```

Then rebuild and deploy to S3.

---

## 🆘 Still Not Working?

Share these details:
1. Your actual API Gateway URL or Function URL
2. Screenshot of Lambda test result
3. Browser DevTools Network tab screenshot showing the API call
4. Error message from browser console

I'll help debug further!
