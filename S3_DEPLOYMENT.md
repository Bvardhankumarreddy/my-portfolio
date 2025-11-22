# S3 Deployment Guide

## Quick Deploy

### Option 1: Using AWS CLI (Recommended)

1. **Set your bucket name in `.env`**:
   ```bash
   echo "S3_BUCKET_NAME=your-portfolio-bucket-name" >> .env
   ```

2. **Make script executable**:
   ```bash
   chmod +x deploy-to-s3.sh
   ```

3. **Run deployment**:
   ```bash
   ./deploy-to-s3.sh
   ```

### Option 2: Manual Upload via AWS Console

1. **Go to S3 Console**: https://s3.console.aws.amazon.com/s3/
2. **Create a bucket** (if you don't have one)
3. **Upload the `build` folder**:
   - Select all files in `build/` directory
   - Upload to S3 bucket
4. **Enable Static Website Hosting**:
   - Go to bucket → Properties → Static website hosting
   - Enable it
   - Index document: `index.html`
   - Error document: `index.html`
5. **Make bucket public**:
   - Go to Permissions → Block public access → Edit → Uncheck all
   - Bucket Policy → Add this policy:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
           }
       ]
   }
   ```

### Option 3: AWS CLI One-Liner

```bash
# Sync build folder to S3
aws s3 sync build/ s3://your-bucket-name --delete --cache-control "public, max-age=31536000"

# Update HTML files with no cache
aws s3 cp build/index.html s3://your-bucket-name/index.html --cache-control "public, max-age=0, must-revalidate"
```

## Environment Variables

Make sure your `.env` file has:

```env
# S3 Deployment
S3_BUCKET_NAME=your-portfolio-bucket-name

# AWS Credentials (already configured)
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Post-Deployment

Your site will be available at:
```
http://your-bucket-name.s3-website-us-east-1.amazonaws.com
```

## CloudFront Setup (Optional - for HTTPS and CDN)

1. **Create CloudFront Distribution**:
   - Origin: Your S3 website endpoint
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: index.html

2. **Custom Error Pages**:
   - 403 → /index.html (for React Router)
   - 404 → /index.html (for React Router)

3. **Custom Domain** (Optional):
   - Add alternate domain name (CNAME)
   - Request SSL certificate in ACM
   - Update Route 53 DNS records

## Deployment Checklist

- [ ] Build completed successfully
- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Bucket is public (if needed)
- [ ] Files uploaded
- [ ] Website accessible via S3 URL
- [ ] CloudFront distribution created (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate installed (optional)

## Troubleshooting

### 403 Forbidden Error
- Check bucket policy allows public read
- Disable "Block all public access"
- Verify files are uploaded

### Blank Page
- Check browser console for errors
- Verify `index.html` is uploaded
- Check homepage field in package.json

### React Router Not Working
- Set error document to `index.html`
- For CloudFront, add custom error responses

## Performance Tips

1. **Enable gzip compression** in S3 (upload pre-compressed files)
2. **Use CloudFront** for global CDN
3. **Set proper cache headers**:
   - HTML: no-cache
   - JS/CSS: max-age=31536000 (1 year)
   - Images: max-age=31536000
4. **Enable CloudFront compression**

## Cost Optimization

- Use S3 Intelligent-Tiering for old files
- Enable CloudFront to reduce S3 data transfer costs
- Monitor CloudWatch metrics
- Set lifecycle policies for logs

---

**Quick Deploy Command:**
```bash
chmod +x deploy-to-s3.sh && ./deploy-to-s3.sh
```
