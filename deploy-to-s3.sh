#!/bin/bash

# S3 Deployment Script for Portfolio
# This script uploads the build folder to an S3 bucket and configures it for static website hosting

echo "🚀 Portfolio S3 Deployment Script"
echo "=================================="
echo ""

# Load environment variables
source .env 2>/dev/null || true

# Configuration
BUCKET_NAME="${S3_BUCKET_NAME:-my-portfolio-bucket}"
REGION="${REACT_APP_AWS_REGION:-us-east-1}"
BUILD_DIR="build"

echo "Configuration:"
echo "  Bucket: $BUCKET_NAME"
echo "  Region: $REGION"
echo "  Build Directory: $BUILD_DIR"
echo ""

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found. Running build first..."
    CI=false npm run build
    echo ""
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "Install it with: brew install awscli"
    exit 1
fi

echo "📦 Step 1: Creating/Checking S3 Bucket..."
# Check if bucket exists
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "Creating new bucket: $BUCKET_NAME"
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    
    # Enable static website hosting
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document index.html
    
    # Set bucket policy for public read
    cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy file:///tmp/bucket-policy.json
    
    # Disable block public access
    aws s3api put-public-access-block \
        --bucket "$BUCKET_NAME" \
        --public-access-block-configuration \
        "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
    
    rm /tmp/bucket-policy.json
    echo "✅ Bucket created and configured for static website hosting"
else
    echo "✅ Bucket already exists"
fi

echo ""
echo "🗑️  Step 2: Clearing old files from bucket..."
aws s3 rm "s3://$BUCKET_NAME" --recursive --quiet
echo "✅ Old files removed"

echo ""
echo "📤 Step 3: Uploading build files to S3..."

# Upload HTML files
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*" \
    --include "*.html" \
    --content-type "text/html" \
    --cache-control "public, max-age=0, must-revalidate" \
    --metadata-directive REPLACE

# Upload CSS files
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --content-type "text/css" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE

# Upload JS files
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE

# Upload JSON files
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*" \
    --include "*.json" \
    --content-type "application/json" \
    --cache-control "public, max-age=0, must-revalidate" \
    --metadata-directive REPLACE

# Upload images
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*" \
    --include "*.png" \
    --include "*.jpg" \
    --include "*.jpeg" \
    --include "*.gif" \
    --include "*.svg" \
    --include "*.ico" \
    --content-type "image/*" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE

# Upload remaining files
aws s3 cp "$BUILD_DIR" "s3://$BUCKET_NAME" \
    --recursive \
    --exclude "*.html" \
    --exclude "*.css" \
    --exclude "*.js" \
    --exclude "*.json" \
    --exclude "*.png" \
    --exclude "*.jpg" \
    --exclude "*.jpeg" \
    --exclude "*.gif" \
    --exclude "*.svg" \
    --exclude "*.ico"

echo "✅ Upload complete!"

echo ""
echo "🌐 Step 4: Getting website URL..."
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "=================================="
echo "✅ Deployment Successful!"
echo "=================================="
echo ""
echo "Your website is live at:"
echo "  $WEBSITE_URL"
echo ""
echo "S3 Bucket: $BUCKET_NAME"
echo "Region: $REGION"
echo ""
echo "Next steps:"
echo "  1. Set up CloudFront distribution for HTTPS and better performance"
echo "  2. Configure custom domain with Route 53"
echo "  3. Enable CloudFront caching for faster load times"
echo ""
