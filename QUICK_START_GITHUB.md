# ⚡ Quick Start: GitHub Deployment

**Fastest way to set up automatic deployment from GitHub to Google Cloud Run**

---

## 🎯 5-Minute Setup

### Step 1: Create GitHub Repo (2 min)

1. Go to: https://github.com/new
2. Name: `ai-preauth-platform`
3. Click **"Create repository"**

### Step 2: Push Your Code (1 min)

```powershell
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

git init
git add .
git commit -m "Initial commit"

git remote add origin https://github.com/YOUR_USERNAME/ai-preauth-platform.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

### Step 3: Set Up Google Cloud (2 min)

```powershell
# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com iam.googleapis.com

# Create service account
gcloud iam service-accounts create github-actions-deployer --display-name="GitHub Actions Deployer"

# Grant permissions
$PROJECT_ID = "YOUR_PROJECT_ID"
$SA_EMAIL = "github-actions-deployer@$PROJECT_ID.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/cloudbuild.builds.editor"

# Create key
gcloud iam service-accounts keys create github-actions-key.json --iam-account=$SA_EMAIL

# Display key (copy the entire JSON)
cat github-actions-key.json
```

### Step 4: Add GitHub Secrets (1 min)

1. Go to: `https://github.com/YOUR_USERNAME/ai-preauth-platform/settings/secrets/actions`
2. Click **"New repository secret"** and add:

   **Secret 1:**
   - Name: `GCP_PROJECT_ID`
   - Value: Your GCP Project ID

   **Secret 2:**
   - Name: `GCP_SA_KEY`
   - Value: Paste the entire JSON from `github-actions-key.json`

   **Secret 3:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg`

### Step 5: Push Workflow & Deploy

```powershell
git add .github/workflows/deploy-cloud-run.yml
git commit -m "Add deployment workflow"
git push origin main
```

### Step 6: Watch It Deploy! 🎉

1. Go to: `https://github.com/YOUR_USERNAME/ai-preauth-platform/actions`
2. Click on the running workflow
3. Wait 3-5 minutes
4. Get your URL from the workflow output!

---

## ✅ That's It!

Your app now auto-deploys on every push to `main` branch!

**For detailed instructions:** See `GITHUB_DEPLOYMENT.md`

---

## 🔧 Troubleshooting

**Workflow not running?**
- Check workflow file is in `.github/workflows/`
- Make sure you pushed to `main` branch

**Authentication failed?**
- Verify `GCP_SA_KEY` is correct (full JSON)
- Check service account permissions

**Need help?**
- See `GITHUB_DEPLOYMENT.md` for detailed troubleshooting
