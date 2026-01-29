# Docker Deployment Guide for AI Preauthorization Platform

Complete guide to deploy your React app using Docker to Google Cloud Platform (Cloud Run).

---

## 📋 Prerequisites

1. **Docker Desktop** (for local testing)
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Google Cloud SDK** (for deployment)
   - Download: https://cloud.google.com/sdk/docs/install
   - Or use: `gcloud` CLI

3. **Google Cloud Account**
   - Sign up: https://console.cloud.google.com
   - Create a project and enable billing

---

## 🐳 Step 1: Test Docker Locally

### 1.1 Build the Docker Image

```powershell
# Navigate to your project directory
cd c:\Users\mukee\Downloads\ai-preauthorization-platform\ai-preauthorization-platform

# Build the Docker image
docker build -t ai-preauth-platform:latest .

# This will:
# - Install dependencies
# - Build your React app
# - Create a production-ready nginx container
```

**Expected output:** You should see build progress and finally "Successfully tagged ai-preauth-platform:latest"

### 1.2 Run the Container Locally

```powershell
# Run the container (replace YOUR_API_KEY with your actual Gemini API key)
docker run -d `
  -p 8080:8080 `
  -e GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg `
  --name ai-preauth-app `
  ai-preauth-platform:latest

# Or if you want to see logs in real-time:
docker run -p 8080:8080 -e GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg ai-preauth-platform:latest
```

### 1.3 Test Your App

Open your browser and go to:
```
http://localhost:8080
```

You should see your app running! 🎉

### 1.4 Stop the Container (when done testing)

```powershell
# Stop the container
docker stop ai-preauth-app

# Remove the container
docker rm ai-preauth-app
```

---

## ☁️ Step 2: Deploy to Google Cloud Run

### 2.1 Set Up Google Cloud

```powershell
# Login to Google Cloud
gcloud auth login

# Set your project (replace YOUR_PROJECT_ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2.2 Build and Push to Google Container Registry

```powershell
# Set variables (replace YOUR_PROJECT_ID)
$PROJECT_ID = "YOUR_PROJECT_ID"
$IMAGE_NAME = "ai-preauth-platform"

# Build and push the image to Google Container Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME

# This will:
# - Build your Docker image in the cloud
# - Push it to Google Container Registry
# - Take 3-5 minutes
```

### 2.3 Deploy to Cloud Run

```powershell
# Deploy the container to Cloud Run
gcloud run deploy ai-preauth-platform `
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10
```

**What this does:**
- `--platform managed`: Fully managed by Google
- `--allow-unauthenticated`: Makes it publicly accessible
- `--set-env-vars`: Sets your API key as environment variable
- `--port 8080`: Cloud Run expects port 8080
- `--memory 512Mi`: Memory allocation
- `--min-instances 0`: Scales to zero when not in use (saves money!)
- `--max-instances 10`: Maximum concurrent instances

### 2.4 Get Your Deployment URL

After deployment, you'll see output like:

```
Service [ai-preauth-platform] revision [ai-preauth-platform-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://ai-preauth-platform-xxxxx-uc.a.run.app
```

**Open that URL in your browser!** 🚀

---

## 🔄 Step 3: Update Your Deployment

When you make changes to your code:

```powershell
# 1. Rebuild and push the image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME

# 2. Redeploy (Cloud Run will use the new image)
gcloud run deploy ai-preauth-platform `
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME `
  --region us-central1
```

---

## 🔐 Step 4: Use Secret Manager (Recommended for Production)

Instead of passing API key in the command, use Google Secret Manager:

### 4.1 Create a Secret

```powershell
# Create the secret (replace YOUR_API_KEY)
echo -n "YOUR_API_KEY" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run access to the secret
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
gcloud secrets add-iam-policy-binding gemini-api-key `
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"
```

### 4.2 Deploy with Secret

```powershell
gcloud run deploy ai-preauth-platform `
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest `
  --port 8080 `
  --memory 512Mi
```

---

## 📊 Step 5: Monitor Your Deployment

### View Logs

```powershell
# View recent logs
gcloud run services logs read ai-preauth-platform --region us-central1

# Follow logs in real-time
gcloud run services logs tail ai-preauth-platform --region us-central1
```

### View Service Details

```powershell
gcloud run services describe ai-preauth-platform --region us-central1
```

### View in Cloud Console

Go to: https://console.cloud.google.com/run

---

## 🐳 Docker Commands Cheat Sheet

```powershell
# Build image
docker build -t ai-preauth-platform:latest .

# Run container locally
docker run -p 8080:8080 -e GEMINI_API_KEY=YOUR_KEY ai-preauth-platform:latest

# List running containers
docker ps

# Stop container
docker stop CONTAINER_ID

# Remove container
docker rm CONTAINER_ID

# View container logs
docker logs CONTAINER_ID

# Remove image
docker rmi ai-preauth-platform:latest

# List all images
docker images
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to Docker daemon"
**Solution:** Make sure Docker Desktop is running

### Issue: "Build failed" during Docker build
**Solution:**
- Check that `npm install` works locally
- Verify Node.js version compatibility
- Check Dockerfile syntax

### Issue: "Permission denied" in Cloud Run
**Solution:** Make sure you've enabled the required APIs (Step 2.1)

### Issue: "API key not working" in deployed app
**Solution:**
- Verify environment variable is set: `gcloud run services describe SERVICE_NAME --region REGION`
- Check logs for errors
- Make sure API key is correct

### Issue: "Port 8080 already in use" locally
**Solution:**
```powershell
# Use a different port
docker run -p 3000:8080 -e GEMINI_API_KEY=YOUR_KEY ai-preauth-platform:latest
# Then access at http://localhost:3000
```

---

## 📝 Dockerfile Explanation

Our Dockerfile uses a **multi-stage build**:

1. **Builder stage**: Uses Node.js to install dependencies and build the React app
2. **Production stage**: Uses lightweight nginx to serve the built static files

**Benefits:**
- Smaller final image (no Node.js in production)
- Faster deployments
- Better security (fewer dependencies)

---

## 🚀 Quick Deploy Script

I've created `deploy-docker.ps1` for automated deployment. Run:

```powershell
.\deploy-docker.ps1
```

---

## 💰 Cost Estimate

- **Cloud Run**: 
  - Free tier: 2M requests/month, 360K GB-seconds
  - After free tier: ~$0.40 per million requests
- **Container Registry**: 
  - Free: 0.5 GB storage
  - After: $0.026 per GB/month

**For low-medium traffic, you'll likely stay within free tier!**

---

## 🎯 Next Steps

1. ✅ Test locally with Docker
2. ✅ Deploy to Cloud Run
3. 🔄 Set up CI/CD for automatic deployments
4. 🌐 Add custom domain
5. 📈 Set up monitoring and alerts

---

## 📞 Need Help?

- Docker docs: https://docs.docker.com
- Cloud Run docs: https://cloud.google.com/run/docs
- Check logs: `gcloud run services logs read SERVICE_NAME --region REGION`
