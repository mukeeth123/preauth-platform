# GCP Deployment Guide for AI Preauthorization Platform

This guide provides multiple deployment options for deploying your React application to Google Cloud Platform.

## ⚠️ Security Note

**IMPORTANT**: Your `GEMINI_API_KEY` is currently exposed in the frontend code. For production deployments, consider:
1. Moving API calls to a backend service (Cloud Functions or Cloud Run)
2. Using environment variables securely (not exposed in client-side code)
3. Implementing API key rotation

## Prerequisites

1. **Google Cloud Account**: Sign up at https://cloud.google.com
2. **Google Cloud SDK (gcloud)**: Install from https://cloud.google.com/sdk/docs/install
3. **Node.js**: Already installed (for building)
4. **Billing**: Enable billing on your GCP project

## Initial Setup

```bash
# Login to GCP
gcloud auth login

# Set your project (replace YOUR_PROJECT_ID)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable storage-component.googleapis.com
```

---

## Option 1: Cloud Storage + Cloud CDN (Static Hosting) ⭐ Recommended for Static Sites

**Best for**: Simple, cost-effective static hosting
**Cost**: ~$0.02-0.10/month for low traffic

### Steps:

1. **Build your application**:
```bash
npm install
npm run build
```

2. **Create a Cloud Storage bucket**:
```bash
# Set variables
export PROJECT_ID=$(gcloud config get-value project)
export BUCKET_NAME=ai-preauth-platform-$(date +%s)

# Create bucket
gsutil mb -p $PROJECT_ID -c STANDARD -l us-central1 gs://$BUCKET_NAME

# Enable static website hosting
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
```

3. **Upload your build files**:
```bash
# Upload dist folder contents
gsutil -m cp -r dist/* gs://$BUCKET_NAME/

# Make files publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
```

4. **Set up Cloud CDN (Optional but recommended)**:
```bash
# Create a load balancer with Cloud CDN
# This requires more setup - see: https://cloud.google.com/cdn/docs/setting-up-cdn-with-buckets
```

5. **Access your site**:
Your site will be available at:
```
https://storage.googleapis.com/$BUCKET_NAME/index.html
```

**Note**: For custom domain, you'll need to set up Cloud Load Balancer.

---

## Option 2: Cloud Run (Containerized) ⭐ Recommended for Production

**Best for**: Production deployments with better control
**Cost**: Pay per request, free tier available

### Steps:

1. **Create a Dockerfile** (already created in project root)

2. **Build and deploy**:
```bash
# Set variables
export PROJECT_ID=$(gcloud config get-value project)
export SERVICE_NAME=ai-preauth-platform
export REGION=us-central1

# Build container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_API_KEY_HERE \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

3. **Get your URL**:
After deployment, Cloud Run will provide a URL like:
```
https://ai-preauth-platform-xxxxx-uc.a.run.app
```

---

## Option 3: App Engine (Traditional PaaS)

**Best for**: Traditional web app deployment
**Cost**: Free tier available, then pay-as-you-go

### Steps:

1. **Create app.yaml** (already created in project root)

2. **Deploy**:
```bash
gcloud app deploy
```

3. **Access your app**:
```
https://YOUR_PROJECT_ID.appspot.com
```

---

## Environment Variables

For Cloud Run and App Engine, set environment variables:

### Cloud Run:
```bash
gcloud run services update SERVICE_NAME \
  --set-env-vars GEMINI_API_KEY=your-api-key-here \
  --region us-central1
```

### App Engine:
Add to `app.yaml`:
```yaml
env_variables:
  GEMINI_API_KEY: "your-api-key-here"
```

**⚠️ Security Warning**: For production, use Secret Manager instead:
```bash
# Create secret
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Quick Deploy Script

A deployment script is provided: `deploy.sh` (or `deploy.ps1` for Windows)

Run:
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

---

## Monitoring & Logging

1. **View logs**:
```bash
# Cloud Run
gcloud run services logs read SERVICE_NAME --region us-central1

# App Engine
gcloud app logs tail
```

2. **Set up monitoring**:
- Go to Cloud Console → Monitoring
- Create alerts for errors, latency, etc.

---

## Troubleshooting

### Build fails:
- Check Node.js version compatibility
- Ensure all dependencies are in package.json

### API key not working:
- Verify environment variable is set correctly
- Check Secret Manager permissions (if using)

### 404 errors:
- Ensure `index.html` is uploaded correctly
- Check Cloud Storage bucket permissions

### CORS issues:
- Configure CORS on Cloud Storage bucket
- Or use Cloud Run/App Engine (handles CORS better)

---

## Cost Optimization

1. **Use Cloud CDN** for caching (reduces egress costs)
2. **Set up Cloud Armor** for DDoS protection
3. **Enable Cloud Run min instances = 0** (scales to zero when not in use)
4. **Use Cloud Storage lifecycle policies** for old files

---

## Next Steps

1. **Set up CI/CD**: Use Cloud Build for automated deployments
2. **Add custom domain**: Configure DNS and SSL certificate
3. **Implement backend**: Move API calls to Cloud Functions/Cloud Run
4. **Add monitoring**: Set up alerts and dashboards
5. **Enable security**: Use Secret Manager, IAM, and Cloud Armor

---

## Support

For issues:
- GCP Documentation: https://cloud.google.com/docs
- Cloud Run: https://cloud.google.com/run/docs
- Cloud Storage: https://cloud.google.com/storage/docs
