# 🐳 Quick Start: Docker Deployment Guide

**Fastest way to deploy your app using Docker to Google Cloud Run**

---

## ⚡ Quick Steps (5 minutes)

### Step 1: Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Verify: Open PowerShell and run `docker --version`

### Step 2: Test Locally (Optional but Recommended)

```powershell
# Navigate to project folder
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Build the Docker image
docker build -t ai-preauth-platform:latest .

# Run it locally
docker run -p 8080:8080 -e GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg ai-preauth-platform:latest
```

Open http://localhost:8080 in your browser to test!

**To stop:** Press `Ctrl+C` in the terminal

---

### Step 3: Deploy to Google Cloud Run

#### Option A: Using Automated Script (Easiest) ⭐

```powershell
# Make sure you have Google Cloud SDK installed
# Then run:
.\deploy-docker.ps1
```

The script will:
- ✅ Build your Docker image
- ✅ Push to Google Container Registry  
- ✅ Deploy to Cloud Run
- ✅ Give you the URL

#### Option B: Manual Deployment

```powershell
# 1. Login to Google Cloud
gcloud auth login

# 2. Set your project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# 4. Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ai-preauth-platform

# 5. Deploy to Cloud Run
gcloud run deploy ai-preauth-platform `
  --image gcr.io/YOUR_PROJECT_ID/ai-preauth-platform `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg `
  --port 8080 `
  --memory 512Mi
```

---

## 🎯 That's It!

After deployment, you'll get a URL like:
```
https://ai-preauth-platform-xxxxx-uc.a.run.app
```

**Open it in your browser!** 🚀

---

## 📚 More Details

- **Full guide**: See `DOCKER_DEPLOYMENT.md`
- **Troubleshooting**: Check the troubleshooting section in `DOCKER_DEPLOYMENT.md`

---

## 🔧 Common Commands

```powershell
# Test locally
docker run -p 8080:8080 -e GEMINI_API_KEY=YOUR_KEY ai-preauth-platform:latest

# View logs (Cloud Run)
gcloud run services logs read ai-preauth-platform --region us-central1

# Update deployment
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ai-preauth-platform
gcloud run deploy ai-preauth-platform --image gcr.io/YOUR_PROJECT_ID/ai-preauth-platform --region us-central1
```

---

## 💡 Pro Tips

1. **Use Secret Manager** for production (see `DOCKER_DEPLOYMENT.md`)
2. **Set up CI/CD** for automatic deployments
3. **Monitor logs** regularly: `gcloud run services logs tail SERVICE_NAME --region REGION`
