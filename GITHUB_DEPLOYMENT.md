# 🚀 Complete Guide: Deploy to GCP via GitHub Actions

This guide will walk you through **every single step** to set up automatic deployment from GitHub to Google Cloud Run.

---

## 📋 Overview

**What we're setting up:**
- GitHub repository for your code
- GitHub Actions workflow (automated deployment)
- Google Cloud service account (for authentication)
- Automatic deployment on every push to main branch

**How it works:**
1. You push code to GitHub
2. GitHub Actions automatically builds your Docker image
3. Pushes it to Google Container Registry
4. Deploys to Cloud Run
5. Your app is live! 🎉

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] GitHub account (free: https://github.com)
- [ ] Google Cloud account (free: https://cloud.google.com)
- [ ] Google Cloud project created
- [ ] Billing enabled on GCP (new accounts get $300 free credit)
- [ ] Google Cloud SDK installed (optional, for local testing)

---

## 📝 Step 1: Create GitHub Repository

### 1.1 Create New Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name**: `ai-preauth-platform` (or your preferred name)
3. **Description**: "AI Preauthorization Platform"
4. **Visibility**: Choose Public or Private
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

### 1.2 Initialize Git in Your Local Project

Open PowerShell in your project directory:

```powershell
# Navigate to your project
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: AI Preauthorization Platform"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with your repository name

---

## 📝 Step 2: Set Up Google Cloud Project

### 2.1 Create/Select Project

1. Go to: https://console.cloud.google.com
2. Click project dropdown (top left)
3. Click **"New Project"**
4. **Name**: `ai-preauth-platform`
5. Click **"Create"**
6. **Note your Project ID** (shown in the dropdown, e.g., `ai-preauth-platform-123456`)

### 2.2 Enable Billing

1. Go to: https://console.cloud.google.com/billing
2. Link a billing account
3. **New accounts get $300 free credit!**

### 2.3 Enable Required APIs

Open PowerShell and run:

```powershell
# Login to Google Cloud
gcloud auth login

# Set your project (replace YOUR_PROJECT_ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable iam.googleapis.com
```

**Replace `YOUR_PROJECT_ID` with your actual project ID**

---

## 📝 Step 3: Create Google Cloud Service Account

This service account allows GitHub Actions to deploy to your GCP project.

### 3.1 Create Service Account

```powershell
# Set your project ID
$PROJECT_ID = "YOUR_PROJECT_ID"
$SA_NAME = "github-actions-deployer"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Create service account
gcloud iam service-accounts create $SA_NAME `
  --display-name="GitHub Actions Deployer" `
  --project=$PROJECT_ID
```

### 3.2 Grant Required Permissions

```powershell
# Grant Cloud Run Admin (to deploy services)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/run.admin"

# Grant Service Account User (to act as service account)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/iam.serviceAccountUser"

# Grant Storage Admin (to push Docker images)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/storage.admin"

# Grant Cloud Build Editor (to build images)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/cloudbuild.builds.editor"
```

### 3.3 Create and Download Service Account Key

```powershell
# Create key file
gcloud iam service-accounts keys create github-actions-key.json `
  --iam-account=$SA_EMAIL `
  --project=$PROJECT_ID

# Display the key (you'll need to copy this)
cat github-actions-key.json
```

**⚠️ Important:** Copy the entire JSON content - you'll need it in the next step!

**Alternative:** The key file `github-actions-key.json` is saved in your current directory. Open it and copy its contents.

---

## 📝 Step 4: Configure GitHub Secrets

GitHub Secrets store sensitive information securely.

### 4.1 Go to Repository Settings

1. Go to your GitHub repository
2. Click **"Settings"** (top menu)
3. Click **"Secrets and variables"** → **"Actions"** (left sidebar)

### 4.2 Add Required Secrets

Click **"New repository secret"** for each of these:

#### Secret 1: `GCP_PROJECT_ID`
- **Name**: `GCP_PROJECT_ID`
- **Value**: Your Google Cloud Project ID (e.g., `ai-preauth-platform-123456`)
- Click **"Add secret"**

#### Secret 2: `GCP_SA_KEY`
- **Name**: `GCP_SA_KEY`
- **Value**: Paste the **entire JSON content** from `github-actions-key.json`
  - It should look like:
    ```json
    {
      "type": "service_account",
      "project_id": "...",
      "private_key_id": "...",
      "private_key": "...",
      ...
    }
    ```
- Click **"Add secret"**

#### Secret 3: `GEMINI_API_KEY`
- **Name**: `GEMINI_API_KEY`
- **Value**: Your Gemini API key (from your `.env` file: `AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg`)
- Click **"Add secret"**

### 4.3 Verify Secrets

You should now see 3 secrets:
- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SA_KEY`
- ✅ `GEMINI_API_KEY`

---

## 📝 Step 5: Push Workflow File to GitHub

The workflow file is already created in your project. Let's commit and push it:

```powershell
# Make sure you're in the project directory
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Add the workflow file
git add .github/workflows/deploy-cloud-run.yml

# Commit
git commit -m "Add GitHub Actions workflow for Cloud Run deployment"

# Push to GitHub
git push origin main
```

---

## 📝 Step 6: Trigger First Deployment

### Option A: Automatic (on push)

The workflow runs automatically when you push to `main` branch. Since you just pushed, it should start automatically!

### Option B: Manual Trigger

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click **"Deploy to Google Cloud Run"** workflow
4. Click **"Run workflow"** button (top right)
5. Select branch: `main`
6. Click **"Run workflow"**

---

## 📝 Step 7: Monitor Deployment

### 7.1 View Workflow Progress

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click on the running workflow
4. Watch the progress in real-time!

**You'll see steps like:**
- ✅ Checkout code
- ✅ Set up Node.js
- ✅ Install dependencies
- ✅ Build application
- ✅ Authenticate to Google Cloud
- ✅ Build Docker image
- ✅ Push Docker image
- ✅ Deploy to Cloud Run

### 7.2 Get Deployment URL

After successful deployment:

1. Scroll to the bottom of the workflow run
2. Look for the **"Get Service URL"** step
3. You'll see output like:
   ```
   🚀 Deployment successful!
   🌐 Service URL: https://ai-preauth-platform-xxxxx-uc.a.run.app
   ```

**Copy that URL and open it in your browser!** 🎉

---

## 🔄 Step 8: Test Automatic Deployment

Make a small change to test the workflow:

```powershell
# Make a small change (e.g., update README)
echo "# Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "Test automatic deployment"
git push origin main
```

Go to **Actions** tab and watch it deploy automatically! 🚀

---

## 🔧 Troubleshooting

### ❌ "Workflow not running"

**Check:**
- [ ] Workflow file is in `.github/workflows/` directory
- [ ] File is named `.yml` or `.yaml`
- [ ] File is committed and pushed to GitHub
- [ ] You're pushing to `main` or `master` branch

### ❌ "Authentication failed"

**Solution:**
- Verify `GCP_SA_KEY` secret is correct (full JSON)
- Check service account has correct permissions
- Verify `GCP_PROJECT_ID` is correct

### ❌ "Build failed"

**Check:**
- View workflow logs for specific error
- Verify `GEMINI_API_KEY` is set correctly
- Check that `package.json` has all dependencies

### ❌ "Deployment failed"

**Check:**
- Verify Cloud Run API is enabled
- Check service account has `roles/run.admin`
- View Cloud Run logs: `gcloud run services logs read SERVICE_NAME --region REGION`

### ❌ "Permission denied"

**Solution:**
- Re-run Step 3.2 to grant permissions
- Make sure service account email is correct

---

## 📊 Viewing Logs

### GitHub Actions Logs
- Go to repository → **Actions** tab
- Click on a workflow run
- Click on a job to see detailed logs

### Cloud Run Logs
```powershell
gcloud run services logs read ai-preauth-platform --region us-central1
```

### Cloud Console
- Go to: https://console.cloud.google.com/run
- Click on your service
- Click **"Logs"** tab

---

## 🔐 Security Best Practices

### ✅ What We've Done:
- Service account with minimal required permissions
- Secrets stored securely in GitHub
- API key not exposed in code

### 🔒 Additional Recommendations:

1. **Use Secret Manager** (instead of environment variables):
   ```powershell
   # Create secret
   echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-
   
   # Update workflow to use secret
   # (modify deploy-cloud-run.yml)
   ```

2. **Restrict Service Account**:
   - Use Workload Identity Federation (more secure)
   - Limit to specific repository

3. **Enable Branch Protection**:
   - Require PR reviews before merging
   - Prevent force pushes to main

---

## 🎯 Workflow Customization

### Deploy Only on Tags

Edit `.github/workflows/deploy-cloud-run.yml`:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Deploy to Different Environments

Create separate workflows:
- `deploy-staging.yml` (deploys on push to `develop`)
- `deploy-production.yml` (deploys on tags)

### Add Notifications

Add Slack/Discord notifications on deployment success/failure.

---

## 📝 Quick Reference Commands

```powershell
# View service account
gcloud iam service-accounts list

# View service account permissions
gcloud projects get-iam-policy PROJECT_ID

# View Cloud Run services
gcloud run services list

# View deployment URL
gcloud run services describe ai-preauth-platform --region us-central1 --format='value(status.url)'

# View logs
gcloud run services logs read ai-preauth-platform --region us-central1
```

---

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] APIs enabled
- [ ] Service account created
- [ ] Service account permissions granted
- [ ] Service account key downloaded
- [ ] GitHub secrets configured (3 secrets)
- [ ] Workflow file pushed to GitHub
- [ ] First deployment successful
- [ ] App accessible via URL

---

## 🎉 You're Done!

Your app now automatically deploys to Google Cloud Run every time you push to GitHub!

**Next Steps:**
1. ✅ Test your deployed app
2. 🔄 Make changes and push (watch it auto-deploy!)
3. 🌐 Add custom domain
4. 📈 Set up monitoring
5. 🔒 Implement additional security measures

---

## 📞 Need Help?

- **GitHub Actions docs**: https://docs.github.com/en/actions
- **Cloud Run docs**: https://cloud.google.com/run/docs
- **Check workflow logs**: Repository → Actions tab
- **Check Cloud Run logs**: `gcloud run services logs read SERVICE_NAME --region REGION`

---

**Happy Deploying! 🚀**
