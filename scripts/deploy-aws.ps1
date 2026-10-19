# Deployment script for Fresh Market on AWS S3 + CloudFront CDN

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Deploying Fresh Market to AWS CloudFront CDN" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check AWS Credentials
Write-Host "`n[1/4] Verifying AWS Credentials..." -ForegroundColor Yellow
$identity = aws sts get-caller-identity 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nAWS Authentication Failed:" -ForegroundColor Red
    Write-Host "$identity" -ForegroundColor Red
    Write-Host "`nYour AWS CLI credentials / session token have expired." -ForegroundColor Yellow
    Write-Host "If using AWS Learner Lab / Academy:" -ForegroundColor Cyan
    Write-Host "   1. Open AWS Academy Learner Lab console"
    Write-Host "   2. Click 'AWS Details' -> 'AWS CLI'"
    Write-Host "   3. Copy the credentials and paste them into: $($env:USERPROFILE)\.aws\credentials"
    Write-Host "   4. Then re-run: npm run deploy:aws"
    exit 1
}

Write-Host "AWS Authenticated successfully!" -ForegroundColor Green

# 2. Build Frontend
Write-Host "`n[2/4] Building production frontend bundle..." -ForegroundColor Yellow
npm --prefix frontend run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend bundle built successfully!" -ForegroundColor Green

# 3. Locate Target CloudFront Distribution and S3 Bucket
Write-Host "`n[3/4] Finding S3 bucket and CloudFront distribution..." -ForegroundColor Yellow

$targetDomain = "d1vsslyvj5i9m6.cloudfront.net"
$distId = $null
$s3Bucket = $null

try {
    $distsJson = aws cloudfront list-distributions --output json | ConvertFrom-Json
    if ($distsJson.DistributionList -and $distsJson.DistributionList.Items) {
        foreach ($d in $distsJson.DistributionList.Items) {
            if ($d.DomainName -eq $targetDomain) {
                $distId = $d.Id
                $originDomain = $d.Origins.Items[0].DomainName
                if ($originDomain -match "^([^.]+)\.s3") {
                    $s3Bucket = $matches[1]
                }
                break
            }
        }
    }
} catch {
    Write-Host "Warning while inspecting CloudFront: $_" -ForegroundColor DarkGray
}

if (-not $s3Bucket) {
    Write-Host "Searching for available S3 buckets..." -ForegroundColor Cyan
    $buckets = (aws s3 ls | ForEach-Object { ($_ -split '\s+')[-1] })
    Write-Host "Found S3 buckets: $($buckets -join ', ')" -ForegroundColor DarkGray
    
    $candidate = $buckets | Where-Object { $_ -match "fresh|market|frontend|website|canopy|coffee|d1v" } | Select-Object -First 1
    if ($candidate) {
        $s3Bucket = $candidate
    } elseif ($buckets.Count -eq 1) {
        $s3Bucket = $buckets[0]
    }
}

if (-not $s3Bucket) {
    Write-Host "`nCould not automatically detect the target S3 bucket." -ForegroundColor Yellow
    $s3Bucket = Read-Host "Please enter the S3 bucket name"
}

Write-Host "Target S3 Bucket: $s3Bucket" -ForegroundColor Cyan
if ($distId) {
    Write-Host "Target CloudFront Distribution ID: $distId" -ForegroundColor Cyan
}

# 4. Sync files to S3
Write-Host "`n[4/4] Uploading frontend files to s3://$s3Bucket..." -ForegroundColor Yellow
aws s3 sync frontend/dist "s3://$s3Bucket" --delete
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to upload files to S3 bucket $s3Bucket" -ForegroundColor Red
    exit 1
}
Write-Host "Files uploaded to S3!" -ForegroundColor Green

# 5. Invalidate CloudFront Cache (if distribution found)
if ($distId) {
    Write-Host "`nInvalidating CloudFront cache for distribution $distId..." -ForegroundColor Yellow
    aws cloudfront create-invalidation --distribution-id "$distId" --paths "/*" | Out-Null
    Write-Host "CloudFront cache invalidated!" -ForegroundColor Green
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "CloudFront CDN: https://$targetDomain" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Green
