# 🐳 Step-by-Step Docker Deployment Guide

Follow these steps **in order** to deploy your app using Docker.

---

## ✅ Step 1: Start Docker Desktop

1. **Open Docker Desktop** from your Start menu
2. **Wait for it to start** (you'll see "Docker Desktop is running" in the system tray)
3. **Verify it's running** by opening PowerShell and running:
   ```powershell
   docker ps
   ```
   You should see an empty list (not an error).

---

## ✅ Step 2: Test Docker Build Locally (Recommended)

This ensures everything works before deploying to the cloud.

### 2.1 Navigate to Your Project

```powershell
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform
```

### 2.2 Build the Docker Image

```powershell
docker build -t ai-preauth-platform:latest .
```

**What this does:**
- Creates a Docker image named `ai-preauth-platform`
- Builds your React app inside the container
- Creates a production-ready nginx server

**Expected time:** 2-5 minutes (first time is slower)

**Expected output:** 
```
Successfully built abc123def456
Successfully tagged ai-preauth-platform:latest
```

### 2.3 Run the Container Locally

```powershell
docker run -p 8080:8080 -e GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg ai-preauth-platform:latest
```

**What this does:**
- Runs your container on port 8080
- Sets your Gemini API key as an environment variable
- Starts the nginx server

### 2.4 Test in Browser

Open your browser and go to:
```
http://localhost:8080
```

You should see your app! 🎉

**To stop:** Press `Ctrl+C` in PowerShell

---

## ✅ Step 3: Set Up Google Cloud (First Time Only)

### 3.1 Install Google Cloud SDK

If you haven't already:
1. Download: https://cloud.google.com/sdk/docs/install
2. Install it
3. Restart PowerShell

### 3.2 Login to Google Cloud

```powershell
gcloud auth login
```

This opens a browser - sign in with your Google account.

### 3.3 Create/Select a Project

**Option A: Create a new project**
1. Go to: https://console.cloud.google.com
2. Click project dropdown (top left)
3. Click "New Project"
4. Name: `ai-preauth-platform`
5. Click "Create"
6. Note your **Project ID** (shown in the dropdown)

**Option B: Use existing project**
```powershell
gcloud config set project YOUR_PROJECT_ID
```

### 3.4 Enable Billing

1. Go to: https://console.cloud.google.com/billing
2. Link a billing account
3. **New accounts get $300 free credit!**

### 3.5 Enable Required APIs

```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## ✅ Step 4: Deploy to Google Cloud Run

### Option A: Using Automated Script (Easiest) ⭐

```powershell
# Make sure you're in the project directory
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Run the deployment script
.\deploy-docker.ps1
```

The script will:
1. Build your Docker image
2. Push it to Google Container Registry
3. Deploy to Cloud Run
4. Give you the URL

**Follow the prompts** - it will ask for your Project ID and API key if needed.

### Option B: Manual Deployment

#### 4.1 Set Variables

```powershell
# Replace YOUR_PROJECT_ID with your actual project ID
$PROJECT_ID = "YOUR_PROJECT_ID"
$SERVICE_NAME = "ai-preauth-platform"
$REGION = "us-central1"
```

#### 4.2 Build and Push Image

```powershell
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME
```

**This takes 3-5 minutes** - it builds your Docker image in the cloud.

#### 4.3 Deploy to Cloud Run

```powershell
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10
```

**What each flag means:**
- `--platform managed`: Fully managed by Google
- `--allow-unauthenticated`: Makes it publicly accessible
- `--set-env-vars`: Sets your API key
- `--port 8080`: Cloud Run expects port 8080
- `--memory 512Mi`: Memory allocation
- `--min-instances 0`: Scales to zero (saves money!)
- `--max-instances 10`: Maximum concurrent instances

---

## ✅ Step 5: Get Your Deployment URL

After deployment completes, you'll see:

```
Service [ai-preauth-platform] revision [ai-preauth-platform-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://ai-preauth-platform-xxxxx-uc.a.run.app
```

**Copy that URL and open it in your browser!** 🚀

---

## 🔄 Step 6: Update Your Deployment (When You Make Changes)

When you update your code:

```powershell
# 1. Rebuild and push
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 2. Redeploy (uses new image)
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME `
  --region $REGION
```

Or use the script:
```powershell
.\deploy-docker.ps1
```

---

## 📊 Step 7: Monitor Your Deployment

### View Logs

```powershell
# Recent logs
gcloud run services logs read $SERVICE_NAME --region $REGION

# Follow logs in real-time
gcloud run services logs tail $SERVICE_NAME --region $REGION
```

### View in Cloud Console

Go to: https://console.cloud.google.com/run

---

## 🔧 Troubleshooting

### ❌ "Docker Desktop is not running"
**Solution:** Start Docker Desktop and wait for it to fully start.

### ❌ "Cannot connect to Docker daemon"
**Solution:** 
1. Make sure Docker Desktop is running
2. Restart PowerShell
3. Try `docker ps` again

### ❌ "Build failed" during Docker build
**Solution:**
- Check that `npm install` works: `npm install`
- Verify Node.js version: `node --version` (should be 18+)
- Check for errors in the build output

### ❌ "gcloud: command not found"
**Solution:** Install Google Cloud SDK from https://cloud.google.com/sdk/docs/install

### ❌ "Permission denied" or "API not enabled"
**Solution:** Run Step 3.5 again to enable APIs

### ❌ "API key not working" in deployed app
**Solution:**
- Check environment variable: `gcloud run services describe $SERVICE_NAME --region $REGION`
- View logs for errors
- Verify API key is correct

### ❌ "Port 8080 already in use" (local testing)
**Solution:**
```powershell
# Use different port
docker run -p 3000:8080 -e GEMINI_API_KEY=YOUR_KEY ai-preauth-platform:latest
# Access at http://localhost:3000
```

---

## 📝 Quick Reference Commands

```powershell
# Build Docker image locally
docker build -t ai-preauth-platform:latest .

# Run locally
docker run -p 8080:8080 -e GEMINI_API_KEY=YOUR_KEY ai-preauth-platform:latest

# List running containers
docker ps

# Stop container
docker stop CONTAINER_ID

# View container logs
docker logs CONTAINER_ID

# Build and push to GCP
gcloud builds submit --tag gcr.io/PROJECT_ID/SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy SERVICE_NAME --image gcr.io/PROJECT_ID/SERVICE_NAME --region REGION

# View Cloud Run logs
gcloud run services logs read SERVICE_NAME --region REGION
```

---

## 🎯 What Happens Behind the Scenes?

1. **Docker Build**: 
   - Installs Node.js dependencies
   - Builds your React app (creates `dist` folder)
   - Packages it with nginx in a lightweight container

2. **Cloud Build**:
   - Uploads your code to Google Cloud
   - Builds the Docker image in the cloud
   - Stores it in Container Registry

3. **Cloud Run Deployment**:
   - Creates a serverless container
   - Routes traffic to your app
   - Auto-scales based on traffic
   - Provides HTTPS URL automatically

---

## 💰 Cost Estimate

- **Free Tier Includes:**
  - 2 million requests/month
  - 360,000 GB-seconds memory
  - 180,000 vCPU-seconds

- **After Free Tier:**
  - ~$0.40 per million requests
  - ~$0.0000025 per GB-second

**For low-medium traffic, you'll likely stay within free tier!**

---

## 🎉 Success Checklist

- [ ] Docker Desktop is running
- [ ] Built Docker image locally
- [ ] Tested app locally (http://localhost:8080)
- [ ] Google Cloud SDK installed
- [ ] Logged into Google Cloud
- [ ] Created/selected GCP project
- [ ] Enabled billing
- [ ] Enabled required APIs
- [ ] Built and pushed image to GCP
- [ ] Deployed to Cloud Run
- [ ] Got deployment URL
- [ ] Tested deployed app

---

## 📞 Need More Help?

- **Full guide**: `DOCKER_DEPLOYMENT.md`
- **Quick start**: `QUICK_START_DOCKER.md`
- **Google Cloud docs**: https://cloud.google.com/run/docs
- **Docker docs**: https://docs.docker.com

---

**Ready? Start with Step 1!** 🚀
