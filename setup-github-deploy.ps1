# PowerShell script to help set up GitHub deployment
# This script guides you through the setup process

Write-Host "🚀 GitHub Deployment Setup Helper" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "⚠️  Git not initialized. Initializing now..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if .github/workflows directory exists
if (-not (Test-Path .github/workflows)) {
    Write-Host "⚠️  Creating .github/workflows directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path .github/workflows -Force | Out-Null
    Write-Host "✅ Directory created" -ForegroundColor Green
}

# Check if workflow file exists
if (-not (Test-Path .github/workflows/deploy-cloud-run.yml)) {
    Write-Host "❌ Workflow file not found!" -ForegroundColor Red
    Write-Host "Please make sure deploy-cloud-run.yml exists in .github/workflows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Workflow file found" -ForegroundColor Green
Write-Host ""

# Check for required files
Write-Host "Checking required files..." -ForegroundColor Cyan
$requiredFiles = @("Dockerfile", "package.json", "nginx.conf")
$allPresent = $true

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (missing!)" -ForegroundColor Red
        $allPresent = $false
    }
}

if (-not $allPresent) {
    Write-Host ""
    Write-Host "❌ Some required files are missing!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Setup Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create GitHub repository:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Create a new repository" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Set up Google Cloud:" -ForegroundColor Yellow
Write-Host "   - Create project: https://console.cloud.google.com" -ForegroundColor Gray
Write-Host "   - Enable billing" -ForegroundColor Gray
Write-Host "   - Enable APIs (see GITHUB_DEPLOYMENT.md Step 2)" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Create service account:" -ForegroundColor Yellow
Write-Host "   - Run commands from GITHUB_DEPLOYMENT.md Step 3" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Configure GitHub secrets:" -ForegroundColor Yellow
Write-Host "   - Go to: Repository → Settings → Secrets → Actions" -ForegroundColor Gray
Write-Host "   - Add: GCP_PROJECT_ID, GCP_SA_KEY, GEMINI_API_KEY" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 For detailed instructions, see: GITHUB_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to check git status
$checkGit = Read-Host "Check git status? (y/n)"
if ($checkGit -eq "y" -or $checkGit -eq "Y") {
    Write-Host ""
    Write-Host "Git status:" -ForegroundColor Cyan
    git status
    Write-Host ""
}

Write-Host "✨ Setup helper complete!" -ForegroundColor Green
