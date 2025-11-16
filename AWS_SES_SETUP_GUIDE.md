# AWS SES & Newsletter Setup Guide

## 📋 Overview
This guide will help you set up AWS SES (Simple Email Service) for sending emails from your portfolio, including contact form notifications and newsletter subscriptions.

---

## 🚀 Step 1: AWS SES Setup

### 1.1 Access AWS SES Console
1. Go to: https://console.aws.amazon.com/ses/
2. Make sure you're in **us-east-1** (N. Virginia) region
3. Click on the region dropdown at top-right to verify/change

### 1.2 Verify Your Sender Email Address
1. In SES Console, click **"Verified identities"** in the left sidebar
2. Click **"Create identity"** button
3. Choose **"Email address"**
4. Enter: `bhopathivardhan654321@gmail.com`
5. Click **"Create identity"**
6. **IMPORTANT**: Check your Gmail inbox
7. Open the email from AWS and click the **verification link**
8. Wait until the status shows **"Verified"** ✅
9. Refresh the page if needed

### 1.3 (Optional) Verify Domain for Professional Emails
If you want to send from `noreply@vardhandevops.xyz`:
1. Click **"Create identity"** → Choose **"Domain"**
2. Enter: `vardhandevops.xyz`
3. Follow DNS verification steps (add TXT records to your domain)
4. Wait for verification (can take up to 72 hours)

**For now**: You can use `bhopathivardhan654321@gmail.com` as the sender email.

---

## 🔐 Step 2: Create IAM User for SES

### 2.1 Go to IAM Console
1. Navigate to: https://console.aws.amazon.com/iam/
2. Click **"Users"** in the left sidebar
3. Click **"Create user"** button

### 2.2 Configure User
1. **User name**: `ses-portfolio-user`
2. Click **"Next"**
3. Select **"Attach policies directly"**
4. Search for: `AmazonSESFullAccess`
5. Check the box next to **"AmazonSESFullAccess"**
6. Click **"Next"** → **"Create user"**

### 2.3 Create Access Keys
1. Click on the newly created user: `ses-portfolio-user`
2. Go to **"Security credentials"** tab
3. Scroll down to **"Access keys"** section
4. Click **"Create access key"**
5. Choose: **"Application running outside AWS"**
6. Click **"Next"** → **"Create access key"**
7. **SAVE THESE CREDENTIALS** (you won't see them again):
   - Access key ID: `AKIA...`
   - Secret access key: `wJalr...`
8. Click **"Done"**

---

## 📝 Step 3: Update .env File

Open `d:\Personal\my-portfolio\.env` and replace the placeholders:

```properties
# AWS SES Configuration
REACT_APP_SES_REGION=us-east-1
REACT_APP_SES_ACCESS_KEY_ID=PASTE_YOUR_ACCESS_KEY_ID_HERE
REACT_APP_SES_SECRET_ACCESS_KEY=PASTE_YOUR_SECRET_ACCESS_KEY_HERE
REACT_APP_SES_FROM_EMAIL=bhopathivardhan654321@gmail.com
REACT_APP_SES_FROM_NAME=Vardhan's Portfolio
REACT_APP_SES_REPLY_TO=bhopathivardhan654321@gmail.com
```

**Important**: 
- Replace `PASTE_YOUR_ACCESS_KEY_ID_HERE` with the Access Key ID from Step 2.3
- Replace `PASTE_YOUR_SECRET_ACCESS_KEY_HERE` with the Secret Access Key from Step 2.3
- Keep the quotes if they exist, or add them

---

## 🧪 Step 4: Test in Sandbox Mode (Optional but Recommended)

By default, SES is in **"Sandbox mode"** - you can only send emails to verified addresses.

### 4.1 Verify Test Recipient Email
1. Go back to SES Console → **"Verified identities"**
2. Click **"Create identity"** → **"Email address"**
3. Enter another email you want to test with (e.g., your personal email)
4. Verify it via the email link

### 4.2 Test Sending Email
After completing all steps, you can test by:
1. Filling out your portfolio contact form
2. Checking if you receive the notification email
3. Checking if the sender receives confirmation email

**Sandbox Limitations**:
- Can only send to verified email addresses
- Limited to 200 emails per day
- 1 email per second

---

## 🌍 Step 5: Request Production Access (For Real Use)

To send emails to anyone (not just verified addresses):

### 5.1 Submit Request
1. Go to SES Console → **"Account dashboard"** (left sidebar)
2. Look for **"Account details"** section
3. You'll see: **"Your account is in the sandbox"**
4. Click **"Request production access"** button

### 5.2 Fill Out the Form
**Mail type**: `Transactional`

**Website URL**: `https://portfolio.vardhandevops.xyz`

**Use case description**: (Copy and paste this)
```
I am developing a personal portfolio website that includes:

1. Contact Form: Users can send me messages, and I need to send:
   - Notification emails to myself when someone contacts me
   - Confirmation emails to users that their message was received

2. Newsletter Subscription: Visitors can subscribe to receive updates about:
   - New blog posts on DevOps, Cloud, and automation
   - New YouTube tutorial releases
   - Project launches and case studies

All emails include:
- Proper unsubscribe links (one-click unsubscribe)
- Double opt-in verification for newsletter subscriptions
- Professional email templates with clear sender information
- Compliance with email best practices and CAN-SPAM Act

Expected volume: 50-100 emails per day
All recipients have explicitly opted in to receive communications.
```

**Additional information**: (Optional)
```
I will monitor bounce rates and complaints closely.
I have implemented proper email verification and validation.
All emails are transactional or explicitly opted-in newsletters.
```

### 5.3 Submit and Wait
1. Click **"Submit request"**
2. **Wait for approval** (usually 24-48 hours, sometimes instant)
3. You'll receive an email when approved
4. Check the SES Console dashboard - sandbox restriction will be removed

**Production Limits After Approval**:
- Send to any email address
- 50,000 emails per day (can request increase)
- 14 emails per second

---

## 📊 Step 6: Monitor Email Sending

### 6.1 Check Email Sending Statistics
1. Go to SES Console → **"Account dashboard"**
2. View metrics:
   - Emails sent
   - Bounces
   - Complaints
   - Reputation metrics

### 6.2 Set Up Bounce/Complaint Notifications (Optional)
1. Go to **"Verified identities"**
2. Click on your verified email
3. Go to **"Notifications"** tab
4. Configure SNS topics for:
   - Bounces
   - Complaints
   - Deliveries

---

## ✅ Verification Checklist

Before using SES in your portfolio:

- [ ] Verified sender email in SES Console (status = "Verified")
- [ ] Created IAM user with SESFullAccess policy
- [ ] Generated and saved access keys
- [ ] Updated `.env` file with correct credentials
- [ ] (Optional) Tested email sending in sandbox mode
- [ ] (For production) Requested and received production access approval

---

## 🚨 Important Security Notes

### Protect Your Credentials
- ✅ `.env` file is in `.gitignore` - never commit credentials to GitHub
- ✅ Access keys are only stored in `.env` file locally
- ✅ Never share your AWS secret access key

### If Credentials Are Compromised
1. Go to IAM Console → Users → `ses-portfolio-user`
2. Go to **"Security credentials"** tab
3. Find the compromised access key
4. Click **"Actions"** → **"Deactivate"** or **"Delete"**
5. Create new access key and update `.env`

---

## 📧 Email Features Ready

After completing setup, you'll have:

### 1. Contact Form Emails
- **Admin Notification**: You receive beautiful HTML email when someone contacts you
- **User Confirmation**: User receives confirmation that message was received

### 2. Newsletter Subscription
- **Verification Email**: Double opt-in with clickable verification link
- **Welcome Email**: Professional welcome email after verification
- **Preference Management**: Users can choose what updates to receive

### 3. Email Templates
All emails use professional HTML templates with:
- Gradient headers with your branding
- Responsive design
- Clear call-to-action buttons
- Unsubscribe links (for newsletters)
- Professional footer with links

---

## 🔧 Troubleshooting

### Error: "Email address is not verified"
**Solution**: Make sure you clicked the verification link in the email AWS sent you. Check spam folder if you don't see it.

### Error: "AccessDenied"
**Solution**: Verify the IAM user has `AmazonSESFullAccess` policy attached.

### Error: "MessageRejected"
**Solution**: You're in sandbox mode. Either verify the recipient email or request production access.

### Emails going to spam
**Solution**: 
1. Set up SPF, DKIM, and DMARC records (automatic if using verified domain)
2. Use professional email content
3. Avoid spam trigger words
4. Include unsubscribe links

### Rate limit errors
**Solution**: 
- Sandbox: Max 1 email/second, 200/day
- Production: Max 14 emails/second, 50,000/day
- Implement rate limiting in your code if needed

---

## 📞 Support

If you encounter issues:
1. Check AWS SES documentation: https://docs.aws.amazon.com/ses/
2. Review IAM permissions
3. Check CloudWatch logs for detailed error messages
4. Contact AWS Support if production access is delayed

---

## 🎯 Next Steps

After completing this setup:
1. ✅ SES is ready to send emails
2. ⏭️ Create DynamoDB table for newsletter subscribers
3. ⏭️ Build newsletter subscription component
4. ⏭️ Integrate SES with contact form
5. ⏭️ Set up automated blog/YouTube notifications

---

**Created**: November 15, 2025  
**Last Updated**: November 15, 2025  
**Version**: 1.0
