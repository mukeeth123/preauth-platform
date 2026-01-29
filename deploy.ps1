# PowerShell deployment script for GCP
# Usage: .\deploy.ps1 [cloud-run|app-engine|storage]

param(
    [Parameter(Position=0)]
    [ValidateSet("cloud-run", "app-engine", "storage")]
    [string]$DeploymentType = "cloud-run"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting GCP Deployment..." -ForegroundColor Green

# Get project ID
$PROJECT_ID = gcloud config get-value project 2>$null
if (-not $PROJECT_ID) {
    Write-Host "❌ Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Project ID: $PROJECT_ID" -ForegroundColor Cyan

# Build the application
Write-Host "`n🔨 Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

switch ($DeploymentType) {
    "cloud-run" {
        Write-Host "`n🐳 Deploying to Cloud Run..." -ForegroundColor Yellow
        
        $SERVICE_NAME = "ai-preauth-platform"
        $REGION = "us-central1"
        
        # Check if API key is set
        $API_KEY = $env:GEMINI_API_KEY
        if (-not $API_KEY) {
            Write-Host "⚠️  Warning: GEMINI_API_KEY not set in environment" -ForegroundColor Yellow
            $API_KEY = Read-Host "Enter your GEMINI_API_KEY (or press Enter to skip)"
        }
        
        # Build and deploy
        Write-Host "Building container image..." -ForegroundColor Cyan
        gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME
        
        $deployCmd = "gcloud run deploy $SERVICE_NAME --image gcr.io/$PROJECT_ID/$SERVICE_NAME --platform managed --region $REGION --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1"
        
        if ($API_KEY) {
            $deployCmd += " --set-env-vars GEMINI_API_KEY=$API_KEY"
        }
        
        Invoke-Expression $deployCmd
        
        Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your app is available at:" -ForegroundColor Cyan
        gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
    }
    
    "app-engine" {
        Write-Host "`n☁️  Deploying to App Engine..." -ForegroundColor Yellow
        
        gcloud app deploy app.yaml --quiet
        
        Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your app is available at: https://$PROJECT_ID.appspot.com" -ForegroundColor Cyan
    }
    
    "storage" {
        Write-Host "`n📦 Deploying to Cloud Storage..." -ForegroundColor Yellow
        
        $BUCKET_NAME = "ai-preauth-platform-$(Get-Date -Format 'yyyyMMddHHmmss')"
        
        Write-Host "Creating bucket: $BUCKET_NAME" -ForegroundColor Cyan
        gsutil mb -p $PROJECT_ID -c STANDARD -l us-central1 gs://$BUCKET_NAME
        
        Write-Host "Configuring static website hosting..." -ForegroundColor Cyan
        gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
        
        Write-Host "Uploading files..." -ForegroundColor Cyan
        gsutil -m cp -r dist/* gs://$BUCKET_NAME/
        
        Write-Host "Setting permissions..." -ForegroundColor Cyan
        gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
        
        Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your app is available at: https://storage.googleapis.com/$BUCKET_NAME/index.html" -ForegroundColor Cyan
        Write-Host "📝 Bucket name: $BUCKET_NAME" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ Done!" -ForegroundColor Green
