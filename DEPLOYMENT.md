# 🚀 Deployment Guide - Census Analytics Dashboard

Complete guide to deploy your full-stack Census Analytics Dashboard to the cloud.

## Overview

- **Backend**: Railway (API server)
- **Frontend**: Vercel (React dashboard)
- **Cost**: Free tier for both platforms
- **Features**: Automatic deployments, SSL certificates, custom domains

---

## Part 1: Deploy Backend API to Railway

### Step 1: Prepare for Railway

1. **Push to GitHub** (if not already done):
   ```bash
   # Initialize git in the main project directory
   git init
   git add .
   git commit -m "Initial commit - Census Analytics Dashboard"
   
   # Create GitHub repository and push
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/census-analyzer.git
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Go to Railway**: Visit [railway.app](https://railway.app)
2. **Sign up/Login** with your GitHub account
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `census-analyzer` repository
   - Select the **root directory** (not the frontend folder)

4. **Configure Environment Variables**:
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add these variables:
     ```
     ANTHROPIC_API_KEY=your_anthropic_api_key_here
     NODE_ENV=production
     PORT=3000
     ```

5. **Deploy**:
   - Railway automatically detects Node.js and deploys
   - Wait for deployment to complete (usually 2-3 minutes)
   - Copy your Railway app URL (e.g., `https://your-app-name.railway.app`)

### Step 3: Test Your API

```bash
# Test your deployed API
curl https://your-app-name.railway.app/health

# Should return: {"status":"healthy",...}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

1. **Update environment variables**:
   ```bash
   cd frontend
   
   # Edit .env.production with your Railway URL
   echo "VITE_API_BASE_URL=https://your-app-name.railway.app" > .env.production
   ```

2. **Update CORS in backend** (if needed):
   - Go back to your backend code
   - Update `server.js` with your Vercel domain:
   ```javascript
   origin: isProduction 
     ? [
         'https://your-vercel-app.vercel.app',  // Update this
         'https://*.vercel.app',
       ]
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com)
2. **Sign up/Login** with your GitHub account
3. **Import Project**:
   - Click "New Project"
   - Select your GitHub repository
   - **Important**: Set root directory to `frontend`
   - Vercel auto-detects it's a React app

4. **Configure Build Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Environment Variables**:
   - In deployment settings, add:
     ```
     VITE_API_BASE_URL=https://your-app-name.railway.app
     ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for build and deployment (2-3 minutes)
   - Get your Vercel URL (e.g., `https://your-app.vercel.app`)

---

## Part 3: Final Configuration & Testing

### Step 1: Update CORS Settings

1. **Update backend CORS** in `server.js`:
   ```javascript
   origin: isProduction 
     ? [
         'https://your-actual-vercel-url.vercel.app',  // Your real Vercel URL
         'https://*.vercel.app',
       ]
   ```

2. **Redeploy backend**:
   - Push changes to GitHub
   - Railway auto-deploys

### Step 2: Test Full Application

1. **Open your Vercel URL** in browser
2. **Check connections**:
   - Summary tab loads data ✅
   - Charts display properly ✅
   - API status shows "healthy" ✅
   - Export functionality works ✅

---

## Part 4: Custom Domain Setup (Optional)

### Backend Custom Domain (Railway)
1. In Railway project settings
2. Go to "Domains" tab
3. Add custom domain (requires DNS configuration)

### Frontend Custom Domain (Vercel)
1. In Vercel project settings
2. Go to "Domains" tab  
3. Add custom domain
4. Update DNS records as instructed

---

## Environment Variables Summary

### Backend (Railway)
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=production
PORT=3000
```

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-railway-app.railway.app
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check frontend URL is in backend CORS settings
   - Verify environment variables are set correctly

2. **API Not Loading**:
   - Check Railway deployment logs
   - Verify ANTHROPIC_API_KEY is set
   - Test API endpoints directly

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

### Debug Commands

```bash
# Check Railway logs
# Go to Railway dashboard -> your project -> "Deployments" tab

# Check Vercel logs  
# Go to Vercel dashboard -> your project -> "Functions" tab

# Test API endpoints
curl https://your-api.railway.app/health
curl https://your-api.railway.app/api/docs
```

---

## 🎉 Success!

Your Census Analytics Dashboard is now live:

- **API**: `https://your-app.railway.app`
- **Dashboard**: `https://your-app.vercel.app`

Both will auto-deploy when you push to GitHub!

---

## Next Steps

- **Custom Analytics**: Add Google Analytics to track usage
- **Authentication**: Add user login with Auth0 or similar
- **Database**: Store user preferences and saved reports
- **Monitoring**: Add error tracking with Sentry
- **Performance**: Add caching layers and CDN