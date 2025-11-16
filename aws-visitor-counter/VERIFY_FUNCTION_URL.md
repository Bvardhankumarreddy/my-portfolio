# Verify and Fix Lambda Function URL

## ❌ Current Issue
DNS cannot resolve: `t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws`

This means the Function URL is not active or the URL is incorrect.

---

## ✅ Step 1: Verify Function URL in AWS Console

1. **Go to AWS Lambda Console**
2. **Open your function**: `PortfolioVisitorCounter`
3. **Configuration** tab → **Function URL** (left sidebar)

### Check These:

#### Option A: Function URL Already Exists
- You should see: **Function URL**: `https://something.lambda-url.us-east-1.on.aws/`
- **Copy the EXACT URL** (it might be different from what you sent)
- If the URL matches what you sent, proceed to check if it's enabled

#### Option B: Function URL Not Created Yet
- If you see "No function URL configured"
- Click **Create function URL**
- Settings:
  - **Auth type**: NONE
  - **Configure CORS**: ✅ Enable
  - **Allow origin**: `https://www.portfolio.vardhandevops.xyz`
  - **Allow methods**: `GET,POST,OPTIONS`
  - **Allow headers**: `Content-Type`
  - **Allow credentials**: ✅ Enable
- Click **Save**
- **Copy the new Function URL**

---

## ✅ Step 2: Verify the URL Format

Function URLs should look like:
```
https://[UNIQUE-ID].lambda-url.[REGION].on.aws/
```

**Common mistakes:**
- ❌ Extra `/default/` in path
- ❌ Using API Gateway URL instead of Function URL
- ❌ Typo in the unique ID

---

## ✅ Step 3: Alternative - Use API Gateway Instead

If Function URL continues to have issues, use API Gateway HTTP API:

### Create API Gateway:

1. **AWS Console** → **API Gateway**
2. **Create API** → **HTTP API** → **Build**
3. **Add integration**:
   - Integration type: **Lambda**
   - Lambda function: `PortfolioVisitorCounter`
   - Version: **2.0**
4. **API name**: `PortfolioVisitorCounterAPI`
5. **Next** → **Next** → **Create**
6. **Copy the Invoke URL** (looks like: `https://abc123.execute-api.us-east-1.amazonaws.com`)

### Configure CORS in API Gateway:

1. In your HTTP API, go to **CORS**
2. Click **Configure**
3. Settings:
   - **Access-Control-Allow-Origin**: `https://www.portfolio.vardhandevops.xyz`
   - **Access-Control-Allow-Headers**: `Content-Type`
   - **Access-Control-Allow-Methods**: `GET,POST,OPTIONS`
4. **Save**

### Your API endpoint will be:
```
https://[API-ID].execute-api.us-east-1.amazonaws.com/PortfolioVisitorCounter
```

**Note**: With API Gateway, you may need to add a route. The default route is `/`

---

## ✅ Step 4: Test the URL

Once you have the correct URL, test it:

### PowerShell Test:
```powershell
# Replace [YOUR-CORRECT-URL] with actual URL
$url = "https://[YOUR-CORRECT-URL]/"

Invoke-WebRequest -Uri $url -Method POST -Headers @{
    "Origin"="https://www.portfolio.vardhandevops.xyz"
    "Content-Type"="application/json"
} -UseBasicParsing
```

### Expected Success Response:
```
StatusCode        : 200
StatusDescription : OK
Content           : {"success": true, "visitCount": X, "message": "Visit recorded successfully"}
```

---

## ✅ Step 5: Update React Component

Once you have the **correct working URL**, update `VisitCounter.jsx`:

**File**: `src/components/countvists/VisitCounter.jsx`
**Line 4**: Replace with your actual working URL:

```javascript
const LAMBDA_API_URL = 'https://YOUR-ACTUAL-WORKING-URL/';
```

---

## 🔍 Debug Steps

### Check Lambda Function Name:
```powershell
# If you have AWS CLI installed
aws lambda list-functions --query "Functions[?FunctionName=='PortfolioVisitorCounter'].FunctionName"
```

### Check Function URL:
```powershell
# Get function URL configuration
aws lambda get-function-url-config --function-name PortfolioVisitorCounter
```

This will show if Function URL exists and what it is.

---

## 📝 Next Steps

1. ✅ Verify Function URL exists in AWS Console
2. ✅ Copy the **exact** URL from AWS Console
3. ✅ Test the URL with PowerShell command above
4. ✅ Update `VisitCounter.jsx` with correct URL
5. ✅ Rebuild React app: `npm run build`
6. ✅ Upload to S3

---

## 🆘 Share This Info

To help you further, please share:

1. **Screenshot** of Lambda Function → Configuration → Function URL page
2. The **exact URL** shown in AWS Console
3. Any error messages from AWS Console

I'll help you get the correct URL and make it work!
