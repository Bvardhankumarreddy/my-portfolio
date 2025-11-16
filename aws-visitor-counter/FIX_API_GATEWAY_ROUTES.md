# Fix API Gateway Routes - Your URL: https://not47wmc3f.execute-api.us-east-1.amazonaws.com

## ❌ Current Issue
Getting `{"message":"Not Found"}` - this means API Gateway routes aren't configured properly.

---

## ✅ Fix API Gateway Configuration

### Step 1: Go to API Gateway

1. **AWS Console** → **API Gateway**
2. Find your API (the one with ID: `not47wmc3f`)
3. Click on it

### Step 2: Configure Routes

1. Click **"Routes"** (left sidebar)
2. You should see existing routes OR no routes

#### Option A: Add a New Route

1. Click **"Create"** button
2. Route settings:
   - **Method**: `ANY`
   - **Path**: `/` (just a forward slash for root)
3. Click **"Create"**

#### Option B: Fix Existing Route

If you see a route like `ANY /default/PortfolioVisitorCounter`:
1. Click on it
2. Note the path - you might need to use this exact path

### Step 3: Attach Lambda Integration

1. Click on your route
2. **Integration details** section:
   - Click **"Attach integration"** or **"Create and attach an integration"**
3. Integration settings:
   - **Integration type**: Lambda function
   - **Integration target**: `PortfolioVisitorCounter`
   - **Payload format version**: 2.0
   - **Invoke permissions**: (leave default or grant permissions)
4. Click **"Create"** or **"Attach"**

### Step 4: Deploy the API

1. Click **"Deploy"** button at the top (or find **Stages** in left menu)
2. Select stage: **$default**
3. Click **"Deploy to $default"**

---

## 🧪 Test Different Paths

After deploying, try these paths to find which one works:

### Test 1: Root path
```powershell
Invoke-WebRequest -Uri "https://not47wmc3f.execute-api.us-east-1.amazonaws.com/" -Method POST -UseBasicParsing
```

### Test 2: With /default
```powershell
Invoke-WebRequest -Uri "https://not47wmc3f.execute-api.us-east-1.amazonaws.com/default" -Method POST -UseBasicParsing
```

### Test 3: Full path
```powershell
Invoke-WebRequest -Uri "https://not47wmc3f.execute-api.us-east-1.amazonaws.com/default/PortfolioVisitorCounter" -Method POST -UseBasicParsing
```

**One of these should return:**
```
StatusCode: 200
Content: {"success": true, "visitCount": X}
```

---

## 📝 Common API Gateway Route Configurations

### Configuration 1: Simple Root Route
- **Route**: `ANY /`
- **URL**: `https://not47wmc3f.execute-api.us-east-1.amazonaws.com/`

### Configuration 2: Named Route
- **Route**: `ANY /portfolio-counter`
- **URL**: `https://not47wmc3f.execute-api.us-east-1.amazonaws.com/portfolio-counter`

### Configuration 3: With Stage Path
- **Route**: `ANY /{proxy+}` or `ANY /PortfolioVisitorCounter`
- **URL**: `https://not47wmc3f.execute-api.us-east-1.amazonaws.com/PortfolioVisitorCounter`

---

## ✅ What to Check in AWS Console

1. **API Gateway** → Your API → **Routes**
   - Look at what routes exist
   - Note the exact path

2. **Integrations**
   - Make sure Lambda function `PortfolioVisitorCounter` is attached

3. **CORS** (Important!)
   - Click **CORS** (left sidebar)
   - Configure:
     - **Allow origins**: `https://www.portfolio.vardhandevops.xyz,https://portfolio.vardhandevops.xyz`
     - **Allow methods**: `GET,POST,OPTIONS`
     - **Allow headers**: `Content-Type`
   - Click **Save**

4. **Deploy**
   - After any changes, click **Deploy** → Stage: `$default`

---

## 🎯 Quick Fix Steps

1. ✅ Go to API Gateway Console
2. ✅ Click on your API (`not47wmc3f`)
3. ✅ Go to **Routes**
4. ✅ Create route: `ANY /`
5. ✅ Attach integration: Lambda function `PortfolioVisitorCounter`
6. ✅ Configure **CORS** with your domain
7. ✅ Click **Deploy** to `$default` stage
8. ✅ Test with PowerShell commands above
9. ✅ Share the working URL path with me

---

## 📸 What I Need From You

Please check your API Gateway and tell me:

1. **What routes do you see?** (e.g., `ANY /`, `GET /something`, etc.)
2. **Which PowerShell test command works?** (test all 3 above)
3. **What's in the Routes section?** (screenshot or list of routes)

Then I'll update the React component with the correct path!
