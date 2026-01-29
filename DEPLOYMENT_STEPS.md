# Step-by-Step GCP Deployment Guide

Follow these steps in order to deploy your AI Preauthorization Platform to Google Cloud Platform.

---

## 📋 Step 1: Install Google Cloud SDK

**You need to install gcloud CLI first.**

### For Windows:

1. **Download the installer:**
   - Go to: https://cloud.google.com/sdk/docs/install
   - Download the Windows installer
   - Or use PowerShell:

```powershell
# Download and install Google Cloud SDK
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

2. **After installation, restart your terminal/PowerShell**

3. **Verify installation:**
```powershell
gcloud --version
```

---

## 📋 Step 2: Set Up Google Cloud Account

1. **Create/Login to Google Cloud Account:**
   - Go to: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create a New Project:**
   - Click on the project dropdown (top left)
   - Click "New Project"
   - Name it: `ai-preauth-platform` (or your preferred name)
   - Click "Create"
   - Note your **Project ID** (shown in the project dropdown)

3. **Enable Billing:**
   - Go to: https://console.cloud.google.com/billing
   - Link a billing account (you'll get $300 free credit for new accounts!)

---

## 📋 Step 3: Authenticate and Configure gcloud

Open PowerShell in your project directory and run:

```powershell
# Login to Google Cloud
gcloud auth login

# This will open a browser - sign in with your Google account

# Set your project (replace YOUR_PROJECT_ID with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# Verify it's set correctly
gcloud config get-value project
```

---

## 📋 Step 4: Enable Required APIs

Run these commands to enable the services we need:

```powershell
# Enable Cloud Build (for building Docker images)
gcloud services enable cloudbuild.googleapis.com

# Enable Cloud Run (for hosting the app)
gcloud services enable run.googleapis.com

# Enable Container Registry (for storing Docker images)
gcloud services enable containerregistry.googleapis.com
```

---

## 📋 Step 5: Prepare Your Application

1. **Make sure dependencies are installed:**
```powershell
npm install
```

2. **Test the build locally (optional but recommended):**
```powershell
npm run build
```

This creates a `dist` folder with your production-ready files.

---

## 📋 Step 6: Deploy to Cloud Run

**Option A: Using the automated script (Easiest)**

```powershell
# Run the deployment script
.\deploy.ps1 cloud-run
```

The script will:
- Build your app
- Create a Docker container
- Deploy to Cloud Run
- Give you a URL to access your app

**Option B: Manual deployment**

```powershell
# Set your project ID (replace with yours)
$PROJECT_ID = "your-project-id"
$SERVICE_NAME = "ai-preauth-platform"
$REGION = "us-central1"

# Build the Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run (replace YOUR_API_KEY with your actual Gemini API key)
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY=AIzaSyAkualxs-RiLh4EATg21CTisdfaA1rvfYg `
  --port 8080 `
  --memory 512Mi `
  --cpu 1
```

---

## 📋 Step 7: Access Your Deployed App

After deployment completes, you'll see output like:

```
Service [ai-preauth-platform] revision [ai-preauth-platform-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://ai-preauth-platform-xxxxx-uc.a.run.app
```

**Open that URL in your browser!** 🎉

---

## 🔧 Troubleshooting

### Issue: "gcloud: command not found"
**Solution:** Make sure Google Cloud SDK is installed and restart your terminal.

### Issue: "Permission denied" or "API not enabled"
**Solution:** Run the enable commands from Step 4 again.

### Issue: "Build failed"
**Solution:** 
- Check that `npm install` completed successfully
- Verify Node.js version (should be 18+)
- Check the build logs: `gcloud builds list`

### Issue: "API key not working"
**Solution:**
- Verify your API key is correct in the `.env` file
- Make sure you set it in the deployment command
- Check Cloud Run logs: `gcloud run services logs read $SERVICE_NAME --region $REGION`

---

## 🔐 Security Best Practices (For Production)

**Important:** Your API key is currently in the frontend code. For production:

1. **Use Secret Manager:**
```powershell
# Create a secret
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-

# Update Cloud Run to use the secret
gcloud run services update $SERVICE_NAME `
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest `
  --region $REGION
```

2. **Consider moving API calls to a backend** (Cloud Functions or separate Cloud Run service)

---

## 📊 Monitoring Your Deployment

### View logs:
```powershell
gcloud run services logs read $SERVICE_NAME --region $REGION
```

### View service details:
```powershell
gcloud run services describe $SERVICE_NAME --region $REGION
```

### View in Cloud Console:
- Go to: https://console.cloud.google.com/run
- Click on your service name

---

## 💰 Cost Estimate

- **Cloud Run**: Free tier includes:
  - 2 million requests/month
  - 360,000 GB-seconds memory
  - 180,000 vCPU-seconds
- **After free tier**: ~$0.40 per million requests
- **Storage**: ~$0.02/month for Docker images

**For low-medium traffic, you'll likely stay within the free tier!**

---

## 🎯 Next Steps After Deployment

1. ✅ Test your deployed app
2. 🔄 Set up automatic deployments (CI/CD)
3. 🌐 Add a custom domain
4. 📈 Set up monitoring and alerts
5. 🔒 Implement proper secret management

---

## 📞 Need Help?

- Check the full guide: `GCP_DEPLOYMENT.md`
- Google Cloud Docs: https://cloud.google.com/run/docs
- Cloud Run pricing: https://cloud.google.com/run/pricing
