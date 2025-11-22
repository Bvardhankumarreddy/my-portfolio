# Switch to API Gateway - Step by Step Guide

## Why API Gateway?
Your Lambda Function URL is not resolving properly even though it shows in the console. API Gateway is more reliable and gives you better control.

---

## 🚀 Create API Gateway HTTP API

### Step 1: Create the API

1. Go to **AWS Console** → **API Gateway**
2. Click **"Create API"**
3. Find **"HTTP API"** section → Click **"Build"**

### Step 2: Add Lambda Integration

1. **Add integration**:
   - Click **"Add integration"**
   - Integration type: **Lambda**
   - AWS Region: **us-east-1**
   - Lambda function: Start typing and select **PortfolioVisitorCounter**
   - Version: **2.0**

2. **API name**: `PortfolioVisitorAPI` (or any name you like)

3. Click **"Next"**

### Step 3: Configure Routes

1. **Route configuration** page:
   - You should see a route already created: `ANY /PortfolioVisitorCounter`
   - Leave it as is OR change to `ANY /`
   - Click **"Next"**

2. **Stages** page:
   - Stage name: **$default** (auto-created)
   - Auto-deploy: ✅ Enabled
   - Click **"Next"**

3. **Review and create**:
   - Click **"Create"**

4. **Copy the Invoke URL** that appears (looks like):
   ```
   https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
   ```

### Step 4: Configure CORS

1. In your new API Gateway, click **"CORS"** (left sidebar)
2. Click **"Configure"**
3. Settings:
   - **Access-Control-Allow-Origin**: `https://www.portfolio.vardhandevops.xyz,https://portfolio.vardhandevops.xyz`
   - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - **Access-Control-Allow-Methods**: `GET,POST,OPTIONS`
   - **Access-Control-Max-Age**: `300`
   - **Access-Control-Allow-Credentials**: Leave unchecked initially
4. Click **"Save"**

---

## 🧪 Test Your API Gateway

### PowerShell Test:
```powershell
# Replace with YOUR API Gateway URL
$url = "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/PortfolioVisitorCounter"

# Test it
Invoke-WebRequest -Uri $url -Method POST -Headers @{
    "Origin"="https://www.portfolio.vardhandevops.xyz"
    "Content-Type"="application/json"
} -UseBasicParsing
```

**Expected Response:**
```
StatusCode        : 200
Content           : {"success": true, "visitCount": X, ...}
```

---

## 📝 Update Your React Component

Once API Gateway works, update the URL:

**File**: `src/components/countvists/VisitCounter.jsx`

**Line 4**: Change to your API Gateway URL:
```javascript
const LAMBDA_API_URL = 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/PortfolioVisitorCounter';
```

OR if you set route to `/`:
```javascript
const LAMBDA_API_URL = 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/';
```

---

## ✅ Your Complete URL Will Be:

Format: `https://[API-ID].execute-api.[REGION].amazonaws.com/[ROUTE]`

Examples:
- `https://abc123xyz.execute-api.us-east-1.amazonaws.com/PortfolioVisitorCounter`
- `https://abc123xyz.execute-api.us-east-1.amazonaws.com/` (if using root route)

---

## 🔍 After Creation - What to Share:

Share your **Invoke URL** from API Gateway, and I'll:
1. Update your `VisitCounter.jsx` with the correct URL
2. Test it with you
3. Make sure CORS works properly

---

## 💡 Why This Will Work:

- ✅ API Gateway URLs are always resolvable
- ✅ Better CORS control
- ✅ More debugging options in CloudWatch
- ✅ Can see request/response logs
- ✅ Same cost (free tier covers it)

Let me know your API Gateway URL once created!
