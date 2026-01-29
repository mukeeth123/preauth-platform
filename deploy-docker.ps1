# PowerShell script for Docker deployment to Google Cloud Run
# Usage: .\deploy-docker.ps1

param(
    [string]$ProjectId = "",
    [string]$Region = "us-central1",
    [string]$ServiceName = "ai-preauth-platform",
    [switch]$LocalTest = $false,
    [switch]$UseSecret = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🐳 Docker Deployment Script for AI Preauthorization Platform" -ForegroundColor Cyan
Write-Host ""

# Local testing
if ($LocalTest) {
    Write-Host "🧪 Testing Docker locally..." -ForegroundColor Yellow
    
    # Check if Docker is running
    try {
        docker ps | Out-Null
    } catch {
        Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Building Docker image..." -ForegroundColor Cyan
    docker build -t $ServiceName`:latest .
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Get API key
    $apiKey = $env:GEMINI_API_KEY
    if (-not $apiKey) {
        Write-Host "⚠️  GEMINI_API_KEY not set in environment" -ForegroundColor Yellow
        $apiKey = Read-Host "Enter your GEMINI_API_KEY"
    }
    
    Write-Host "Starting container on http://localhost:8080..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    docker run --rm -p 8080:8080 -e GEMINI_API_KEY=$apiKey $ServiceName`:latest
    
    exit 0
}

# Cloud deployment
Write-Host "☁️  Deploying to Google Cloud Run..." -ForegroundColor Yellow

# Get project ID
if (-not $ProjectId) {
    $ProjectId = gcloud config get-value project 2>$null
    if (-not $ProjectId) {
        Write-Host "❌ No GCP project set." -ForegroundColor Red
        $ProjectId = Read-Host "Enter your GCP Project ID"
        gcloud config set project $ProjectId
    }
}

Write-Host "📦 Project ID: $ProjectId" -ForegroundColor Cyan

# Check if gcloud is installed
try {
    gcloud --version | Out-Null
} catch {
    Write-Host "❌ Google Cloud SDK not found. Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Authenticate if needed
Write-Host "Checking authentication..." -ForegroundColor Cyan
$authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $authStatus) {
    Write-Host "🔐 Please authenticate..." -ForegroundColor Yellow
    gcloud auth login
}

# Enable required APIs
Write-Host "Enabling required APIs..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet

# Build and push image
$IMAGE_NAME = "gcr.io/$ProjectId/$ServiceName"
Write-Host "🔨 Building and pushing Docker image..." -ForegroundColor Cyan
Write-Host "This may take 3-5 minutes..." -ForegroundColor Yellow

gcloud builds submit --tag $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Image built and pushed successfully!" -ForegroundColor Green

# Prepare deployment command
$deployCmd = "gcloud run deploy $ServiceName " +
    "--image $IMAGE_NAME " +
    "--platform managed " +
    "--region $Region " +
    "--allow-unauthenticated " +
    "--port 8080 " +
    "--memory 512Mi " +
    "--cpu 1 " +
    "--min-instances 0 " +
    "--max-instances 10"

# Handle API key
if ($UseSecret) {
    Write-Host "Using Secret Manager for API key..." -ForegroundColor Cyan
    $deployCmd += " --update-secrets GEMINI_API_KEY=gemini-api-key:latest"
} else {
    $apiKey = $env:GEMINI_API_KEY
    if (-not $apiKey) {
        Write-Host "⚠️  GEMINI_API_KEY not set in environment" -ForegroundColor Yellow
        $apiKey = Read-Host "Enter your GEMINI_API_KEY (or press Enter to skip)"
    }
    
    if ($apiKey) {
        $deployCmd += " --set-env-vars GEMINI_API_KEY=$apiKey"
    } else {
        Write-Host "⚠️  Warning: No API key provided. The app may not work correctly." -ForegroundColor Yellow
    }
}

# Deploy
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Cyan
Invoke-Expression $deployCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

# Get service URL
Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is available at:" -ForegroundColor Cyan
$serviceUrl = gcloud run services describe $ServiceName --region $Region --format="value(status.url)"
Write-Host $serviceUrl -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 View logs: gcloud run services logs read $ServiceName --region $Region" -ForegroundColor Gray
Write-Host ""
