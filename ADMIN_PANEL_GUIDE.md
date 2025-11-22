# Admin Panel - Review Moderation System

## Overview
The admin panel allows you to moderate user-submitted reviews before they appear publicly on your portfolio. All new reviews now require approval.

## Access

**URL**: `http://localhost:3000/admin` (development) or `https://yourdomain.com/admin` (production)

**Default Password**: Check your `.env` file for `REACT_APP_ADMIN_PASSWORD`
- Default: `YourSecurePassword123!`
- **IMPORTANT**: Change this to a strong, unique password before deploying!

## Features

### 1. **Pending Reviews Dashboard**
- See all reviews waiting for approval
- Shows: Name, Company, Role, Rating, Comment, Submission Date
- Visual card layout with easy-to-scan information

### 2. **Review Actions**
- **👁️ View**: See full review details in a modal
- **✓ Approve**: Publish the review to your portfolio
- **🗑️ Delete**: Permanently remove inappropriate reviews

### 3. **Security**
- Session-based authentication
- Password-protected access
- Reviews are hidden until approved

## How It Works

### User Submission Flow:
1. User fills out review form on your portfolio
2. Review is saved to DynamoDB with `approved: false`
3. User sees message: "Review submitted successfully! Your review is pending approval."
4. Review does NOT appear on the public testimonials section yet

### Admin Approval Flow:
1. Visit `/admin` and log in
2. See all pending reviews in the dashboard
3. Review each submission:
   - Check for appropriate content
   - Verify authenticity
   - Approve or delete
4. Approved reviews appear immediately on the testimonials section

## Configuration

### Change Admin Password
Edit `.env` file:
```env
REACT_APP_ADMIN_PASSWORD=YourNewSecurePassword
```

**Password Guidelines**:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't share or commit to Git
- Change regularly

### For Production
For a production environment, consider upgrading to:
- **AWS Cognito**: Proper user authentication
- **JWT tokens**: Secure session management
- **Multi-admin support**: Multiple moderators
- **Email notifications**: Alert when new reviews arrive
- **Activity logs**: Track all moderation actions

## Review Criteria

When moderating reviews, check for:

✅ **Approve if**:
- Professional and respectful language
- Genuine feedback
- Reasonable rating (matches comment tone)
- Valid company/role information

❌ **Delete if**:
- Spam or promotional content
- Offensive language (should be caught by validation)
- Fake or suspicious information
- Duplicate submissions
- Unrelated content

## Technical Details

### Files Modified:
- `src/aws/reviewService.js`: Added `approved: false` flag, moderation functions
- `src/components/admin/AdminPanel.jsx`: Admin dashboard component
- `src/components/admin/adminpanel.css`: Styling
- `src/App.js`: Added admin route handling
- `src/components/testmonials/ReviewForm.jsx`: Updated success message

### DynamoDB Changes:
All reviews now have `approved` field:
- `approved: false` (default) - Pending moderation
- `approved: true` - Published on portfolio

### API Functions:
- `getUnapprovedReviews()`: Fetch pending reviews
- `updateReviewApproval(id, true)`: Approve a review
- `deleteReview(id)`: Delete a review

## Usage Tips

1. **Check Regularly**: Visit admin panel daily to moderate new reviews
2. **Be Prompt**: Approve legitimate reviews quickly to maintain user trust
3. **Be Consistent**: Apply the same standards to all reviews
4. **Document Decisions**: Keep notes on why you rejected specific reviews (optional)

## Troubleshooting

### Can't Access Admin Panel
- Verify you're using the correct password from `.env`
- Clear browser cache and try again
- Check browser console for errors

### Reviews Not Showing After Approval
- Refresh the main portfolio page
- Check browser console for DynamoDB errors
- Verify AWS credentials are correct

### Forgot Password
- Check `.env` file for `REACT_APP_ADMIN_PASSWORD`
- If lost, update `.env` and restart development server
- In production, redeploy with new environment variable

## Future Enhancements

Consider adding:
- **Email Notifications**: Get alerts for new reviews
- **Bulk Actions**: Approve/delete multiple reviews at once
- **Review Editing**: Fix typos before publishing
- **Analytics**: Track approval rate, response time
- **Auto-approve**: Trusted users skip moderation
- **Comment Responses**: Reply to reviews publicly

## Security Reminder

⚠️ **Important**:
- Never commit `.env` file to Git
- Use strong, unique passwords
- Change default password immediately
- Consider IP whitelisting for admin access
- Use HTTPS in production
- Implement proper authentication for production

## Support

For issues or questions:
1. Check browser console for error messages
2. Review AWS DynamoDB logs
3. Verify environment variables are set correctly
4. Check network connectivity to AWS

---

**Admin Panel Version**: 1.0
**Last Updated**: November 2025
