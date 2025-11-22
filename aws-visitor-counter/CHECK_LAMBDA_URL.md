# Quick AWS Lambda Function URL Check

## 🔍 Verify Your Lambda Setup

### Step 1: Check Lambda Function Exists

1. Go to **AWS Lambda Console**: https://console.aws.amazon.com/lambda
2. Look for function named: `PortfolioVisitorCounter`
3. Click on it

### Step 2: Get the Correct URL

#### Check Function URL:
1. In the Lambda function, look at the top - you should see a **"Function URL"** section
2. **If you see a URL there** → Copy it exactly
3. **If you DON'T see a Function URL** → We need to create it OR use API Gateway

#### To Create Function URL (if missing):
1. Scroll down to **Configuration** tab
2. Click **Function URL** on the left
3. If it says "No function URL configured":
   - Click **"Create function URL"**
   - Auth type: **NONE**
   - Check **"Configure cross-origin resource sharing (CORS)"**
   - Additional CORS settings:
     - **Allow origin**: `*` (we'll restrict later)
     - **Allow methods**: `*`
     - **Allow headers**: `*`
     - **Max age**: `86400`
   - Click **"Save"**
4. Copy the new Function URL that appears

### Step 3: Alternative - Use API Gateway

If Function URL continues to fail, let's use API Gateway instead:

1. **AWS Console** → **API Gateway**
2. **Create API** → **HTTP API** → **Build**
3. **Add integration**:
   - Type: Lambda
   - Region: us-east-1
   - Lambda: PortfolioVisitorCounter
4. Name: `PortfolioAPI`
5. **Next** → **Next** → **Create**
6. **Note the Invoke URL** (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com`)

Then configure CORS:
1. Click **CORS** (left menu)
2. Configure:
   - Allow origins: `*`
   - Allow methods: `GET,POST,OPTIONS`
   - Allow headers: `Content-Type`
3. Save

### Step 4: Test in Lambda Console

1. In Lambda function, click **Test** tab
2. Create test event with this JSON:
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
4. Should see success response with visit count

---

## 🧪 Test the URL You Have

Let's verify if your URL actually works:

### Test 1: Simple Browser Test
Open this URL directly in your browser:
```
https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/
```

**Expected:**
- If it works: You'll see JSON response (might be an error about method, but at least it loads)
- If it doesn't work: "This site can't be reached" or DNS error

### Test 2: PowerShell Simple Test
```powershell
# Just try to reach it (no headers)
Invoke-WebRequest -Uri "https://t6yv6mnuf3k7swszd56uz7kpcy0tkbxb.lambda-url.us-east-1.on.aws/" -UseBasicParsing
```

---

## 📸 What I Need From You

Please share:

1. **Screenshot** of your Lambda function overview page (showing if Function URL is configured)
2. **Screenshot** of Configuration → Function URL section
3. Try opening the URL in browser and share what happens
4. Or tell me if Function URL section shows "Not configured"

This will help me give you the exact fix!

---

## 🎯 Most Likely Issue

The Function URL you shared might be:
- Not actually created in AWS
- Deleted and recreated (so the old URL is invalid)
- There's a typo in one character

**Solution:** Go to AWS Console and copy-paste the actual URL directly from there, don't type it manually.
