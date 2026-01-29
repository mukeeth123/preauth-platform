# 📝 Step-by-Step: GitHub Deployment Guide

**Follow these steps in order - each step is explained in detail.**

---

## ✅ STEP 1: Create GitHub Repository

### What you'll do:
Create a new repository on GitHub to store your code.

### How to do it:

1. **Go to GitHub:**
   - Open: https://github.com/new
   - Or click the "+" icon → "New repository"

2. **Fill in the form:**
   - **Repository name**: `ai-preauth-platform`
   - **Description**: "AI Preauthorization Platform"
   - **Visibility**: Choose Public or Private
   - **⚠️ IMPORTANT**: Do NOT check "Initialize with README"
   - **⚠️ IMPORTANT**: Do NOT add .gitignore or license (we already have them)

3. **Click "Create repository"**

4. **Copy the repository URL** (you'll need it in Step 2)
   - It will look like: `https://github.com/YOUR_USERNAME/ai-preauth-platform.git`

### ✅ Checkpoint:
- [ ] Repository created on GitHub
- [ ] Repository URL copied

---

## ✅ STEP 2: Push Your Code to GitHub

### What you'll do:
Upload your local code to GitHub.

### How to do it:

Open PowerShell in your project directory:

```powershell
# Navigate to your project
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Check if git is initialized
git status
```

**If you see "not a git repository":**
```powershell
git init
```

**Now push to GitHub:**

```powershell
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: AI Preauthorization Platform"

# Add GitHub remote (REPLACE YOUR_USERNAME AND REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-preauth-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `ai-preauth-platform` with your repository name (if different)

### ✅ Checkpoint:
- [ ] Code pushed to GitHub
- [ ] Can see files in GitHub repository

---

## ✅ STEP 3: Set Up Google Cloud Project

### What you'll do:
Create a Google Cloud project and enable required services.

### How to do it:

#### 3.1 Create Project

1. **Go to Google Cloud Console:**
   - Open: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create new project:**
   - Click project dropdown (top left)
   - Click **"New Project"**
   - **Project name**: `ai-preauth-platform`
   - Click **"Create"**
   - **Note your Project ID** (shown in dropdown, e.g., `ai-preauth-platform-123456`)

#### 3.2 Enable Billing

1. **Go to billing:**
   - Open: https://console.cloud.google.com/billing
   - Click **"Link a billing account"**
   - Follow prompts (new accounts get $300 free credit!)

#### 3.3 Enable APIs

Open PowerShell and run:

```powershell
# Login to Google Cloud
gcloud auth login

# Set your project (REPLACE YOUR_PROJECT_ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable iam.googleapis.com
```

**Replace `YOUR_PROJECT_ID` with your actual project ID**

Wait for each API to enable (takes 10-30 seconds each).

### ✅ Checkpoint:
- [ ] Google Cloud project created
- [ ] Project ID noted
- [ ] Billing enabled
- [ ] All APIs enabled

---

## ✅ STEP 4: Create Service Account

### What you'll do:
Create a service account that GitHub Actions will use to deploy to your GCP project.

### How to do it:

Open PowerShell and run these commands **one by one**:

```powershell
# Set your project ID (REPLACE THIS)
$PROJECT_ID = "YOUR_PROJECT_ID"
$SA_NAME = "github-actions-deployer"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Create service account
gcloud iam service-accounts create $SA_NAME `
  --display-name="GitHub Actions Deployer" `
  --project=$PROJECT_ID
```

**Expected output:** `Created service account [github-actions-deployer].`

### ✅ Checkpoint:
- [ ] Service account created

---

## ✅ STEP 5: Grant Permissions to Service Account

### What you'll do:
Give the service account permission to deploy to Cloud Run.

### How to do it:

Run these commands **one by one**:

```powershell
# Make sure variables are set
$PROJECT_ID = "YOUR_PROJECT_ID"
$SA_EMAIL = "github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com"

# Grant Cloud Run Admin (allows deploying services)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/run.admin"

# Grant Service Account User (allows acting as service account)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/iam.serviceAccountUser"

# Grant Storage Admin (allows pushing Docker images)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/storage.admin"

# Grant Cloud Build Editor (allows building images)
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SA_EMAIL" `
  --role="roles/cloudbuild.builds.editor"
```

**Expected output:** For each command, you'll see policy bindings updated.

### ✅ Checkpoint:
- [ ] All 4 permissions granted

---

## ✅ STEP 6: Create Service Account Key

### What you'll do:
Create a key file that GitHub will use to authenticate.

### How to do it:

```powershell
# Make sure variables are set
$PROJECT_ID = "YOUR_PROJECT_ID"
$SA_EMAIL = "github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com"

# Create key file
gcloud iam service-accounts keys create github-actions-key.json `
  --iam-account=$SA_EMAIL `
  --project=$PROJECT_ID
```

**Expected output:** `created key [KEY_ID] of type [json] for serviceAccount [github-actions-deployer@...]`

### 6.1 View the Key File

```powershell
# Display the key content
cat github-actions-key.json
```

**⚠️ IMPORTANT:** Copy the **entire JSON content** - you'll need it in the next step!

The file should look like:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  ...
}
```

**Copy everything from `{` to `}`**

### ✅ Checkpoint:
- [ ] Key file created
- [ ] Key content copied

---

## ✅ STEP 7: Add GitHub Secrets

### What you'll do:
Store sensitive information (project ID, service account key, API key) securely in GitHub.

### How to do it:

#### 7.1 Go to Secrets Page

1. **Go to your GitHub repository**
2. **Click "Settings"** (top menu)
3. **Click "Secrets and variables"** → **"Actions"** (left sidebar)

#### 7.2 Add Secret 1: GCP_PROJECT_ID

1. Click **"New repository secret"**
2. **Name**: `GCP_PROJECT_ID`
3. **Secret**: Paste your Google Cloud Project ID (e.g., `ai-preauth-platform-123456`)
4. Click **"Add secret"**

#### 7.3 Add Secret 2: GCP_SA_KEY

1. Click **"New repository secret"**
2. **Name**: `GCP_SA_KEY`
3. **Secret**: Paste the **entire JSON** from `github-actions-key.json`
   - Make sure to include the opening `{` and closing `}`
   - It should be a complete, valid JSON object
4. Click **"Add secret"**

#### 7.4 Add Secret 3: GEMINI_API_KEY

1. Click **"New repository secret"**
2. **Name**: `GEMINI_API_KEY`
3. **Secret**: `AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg` (from your `.env` file)
4. Click **"Add secret"**

#### 7.5 Verify Secrets

You should now see 3 secrets listed:
- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SA_KEY`
- ✅ `GEMINI_API_KEY`

### ✅ Checkpoint:
- [ ] All 3 secrets added
- [ ] Secrets verified

---

## ✅ STEP 8: Push Workflow File

### What you'll do:
The workflow file is already in your project. We need to commit and push it.

### How to do it:

```powershell
# Make sure you're in project directory
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Check if workflow file exists
ls .github/workflows/deploy-cloud-run.yml
```

**If file exists, continue:**

```powershell
# Add workflow file
git add .github/workflows/deploy-cloud-run.yml

# Commit
git commit -m "Add GitHub Actions workflow for Cloud Run deployment"

# Push to GitHub
git push origin main
```

**Expected output:** Files pushed successfully.

### ✅ Checkpoint:
- [ ] Workflow file pushed to GitHub
- [ ] Can see `.github/workflows/deploy-cloud-run.yml` in GitHub

---

## ✅ STEP 9: Trigger Deployment

### What you'll do:
Watch GitHub Actions automatically deploy your app!

### How to do it:

#### Option A: Automatic (Recommended)

The workflow runs automatically when you push to `main`. Since you just pushed, it should start automatically!

1. **Go to your GitHub repository**
2. **Click "Actions" tab** (top menu)
3. **You should see a workflow running!**

#### Option B: Manual Trigger

If workflow didn't start automatically:

1. Go to **"Actions"** tab
2. Click **"Deploy to Google Cloud Run"** workflow (left sidebar)
3. Click **"Run workflow"** button (top right)
4. Select branch: `main`
5. Click **"Run workflow"**

### ✅ Checkpoint:
- [ ] Workflow is running
- [ ] Can see workflow progress

---

## ✅ STEP 10: Monitor Deployment

### What you'll do:
Watch the deployment progress and get your app URL.

### How to do it:

1. **Click on the running workflow** (in Actions tab)

2. **Watch the steps execute:**
   - ✅ Checkout code
   - ✅ Set up Node.js
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Authenticate to Google Cloud
   - ✅ Build Docker image
   - ✅ Push Docker image
   - ✅ Deploy to Cloud Run
   - ✅ Get Service URL

3. **Wait for completion** (takes 3-5 minutes)

4. **Get your URL:**
   - Scroll to the bottom
   - Look for **"Get Service URL"** step
   - You'll see:
     ```
     🚀 Deployment successful!
     🌐 Service URL: https://ai-preauth-platform-xxxxx-uc.a.run.app
     ```

5. **Copy the URL and open it in your browser!** 🎉

### ✅ Checkpoint:
- [ ] Deployment completed successfully
- [ ] Got deployment URL
- [ ] App is accessible in browser

---

## 🎉 SUCCESS!

Your app is now deployed and will automatically redeploy every time you push to GitHub!

---

## 🔄 Testing Automatic Deployment

Make a small change to test:

```powershell
# Make a small change
echo "`n## Deployment Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test automatic deployment"
git push origin main
```

Go to **Actions** tab and watch it deploy automatically! 🚀

---

## 🔧 Troubleshooting

### Workflow not running?

**Check:**
- [ ] Workflow file is in `.github/workflows/` directory
- [ ] File is named `deploy-cloud-run.yml`
- [ ] File is committed and pushed
- [ ] You're pushing to `main` branch

### Authentication failed?

**Check:**
- [ ] `GCP_SA_KEY` secret contains full JSON (with `{` and `}`)
- [ ] Service account has correct permissions (Step 5)
- [ ] `GCP_PROJECT_ID` is correct

### Build failed?

**Check:**
- [ ] View workflow logs for specific error
- [ ] `GEMINI_API_KEY` is set correctly
- [ ] `package.json` has all dependencies

### Deployment failed?

**Check:**
- [ ] Cloud Run API is enabled
- [ ] Service account has `roles/run.admin`
- [ ] View Cloud Run logs: `gcloud run services logs read ai-preauth-platform --region us-central1`

---

## 📊 Viewing Logs

### GitHub Actions Logs
- Repository → **Actions** tab → Click workflow run → Click job

### Cloud Run Logs
```powershell
gcloud run services logs read ai-preauth-platform --region us-central1
```

---

## ✅ Complete Checklist

- [ ] Step 1: GitHub repository created
- [ ] Step 2: Code pushed to GitHub
- [ ] Step 3: Google Cloud project set up
- [ ] Step 4: Service account created
- [ ] Step 5: Permissions granted
- [ ] Step 6: Service account key created
- [ ] Step 7: GitHub secrets configured
- [ ] Step 8: Workflow file pushed
- [ ] Step 9: Deployment triggered
- [ ] Step 10: Deployment successful
- [ ] App is accessible via URL

---

## 📞 Need Help?

- **Detailed guide**: `GITHUB_DEPLOYMENT.md`
- **Quick start**: `QUICK_START_GITHUB.md`
- **GitHub Actions docs**: https://docs.github.com/en/actions
- **Cloud Run docs**: https://cloud.google.com/run/docs

---

**Follow the steps above, and you'll have automatic deployment set up in no time!** 🚀
