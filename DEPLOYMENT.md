# Deployment Guide

This document provides instructions for deploying the LeFlux PWA to various hosting platforms.

## Prerequisites

Before deploying, ensure that:
- The project builds successfully: `npm run build`
- All dependencies are installed: `npm install`
- You have access to the deployment platform of your choice

## Build Command

To build the project for production:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment Options

### 1. GitHub Pages (Recommended for GitHub repositories)

GitHub Pages deployment is automated via GitHub Actions.

#### Setup Steps:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", select:
   - **Source**: GitHub Actions
4. Push to the `main` branch to trigger automatic deployment

The workflow file is located at `.github/workflows/deploy.yml` and will automatically:
- Build the project
- Deploy to GitHub Pages
- Make the site available at: `https://netojmateus-droid.github.io/learnleflux`

#### Manual Deployment (Alternative):

If you prefer manual deployment:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### 2. Vercel

Vercel offers excellent support for React applications with automatic deployments.

#### Deployment Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```

3. **Or connect via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will automatically detect the build settings from `vercel.json`
   - Click "Deploy"

The `vercel.json` configuration file is already set up with:
- Build command: `npm run build`
- Output directory: `build`
- SPA routing support

### 3. Netlify

Netlify is another excellent platform for deploying React applications.

#### Deployment Steps:

1. **Via Netlify CLI**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Build the project
   npm run build

   # Deploy
   netlify deploy --prod
   ```

2. **Via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will automatically detect settings from `netlify.toml`
   - Click "Deploy site"

The `netlify.toml` configuration file is already set up with:
- Build command: `npm run build`
- Publish directory: `build`
- SPA routing redirects

### 4. Firebase Hosting

Firebase Hosting is great for PWAs with potential backend integration.

#### Deployment Steps:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project" or create a new one
   - Set public directory to: `build`
   - Configure as single-page app: `Yes`
   - Don't overwrite `build/index.html`

4. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

### 5. Other Platforms

The production build in the `build` folder is a standard static site that can be deployed to:

- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **Google Cloud Storage**
- **DigitalOcean App Platform**
- **Render**
- **Railway**

For these platforms, use:
- **Build directory**: `build`
- **Build command**: `npm run build`
- **Install command**: `npm install`

## Environment Variables

If you need to use environment variables:

1. Create a `.env` file in the root directory
2. Add variables with the `REACT_APP_` prefix:
   ```
   REACT_APP_API_URL=https://api.example.com
   ```
3. Access in code: `process.env.REACT_APP_API_URL`
4. Configure the same variables in your deployment platform

## Post-Deployment

After deployment:

1. **Test the deployed application**:
   - Verify all pages load correctly
   - Test dark mode functionality
   - Test offline capabilities (PWA features)
   - Verify responsive design on different devices

2. **Configure custom domain** (optional):
   - Most platforms allow custom domain configuration
   - Update DNS settings to point to your deployment
   - Enable HTTPS (usually automatic)

3. **Monitor performance**:
   - Use browser DevTools to check performance
   - Verify PWA installability
   - Test on different networks

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Routing Issues

If client-side routing doesn't work after deployment:
- Ensure your hosting platform is configured for SPA routing
- All platforms above have this configured in their respective config files
- For custom setups, ensure all routes redirect to `index.html`

### Asset Loading Issues

If assets don't load:
- Verify the `homepage` field in `package.json` matches your deployment URL
- For GitHub Pages: `https://netojmateus-droid.github.io/learnleflux`
- For custom domains or root deployments, you may need to update this field

## Continuous Deployment

For automated deployments:

- **GitHub Actions** (GitHub Pages): Already configured - pushes to `main` trigger deployment
- **Vercel**: Automatically deploys on every push to the connected branch
- **Netlify**: Automatically deploys on every push to the connected branch
- **Firebase**: Can be configured with GitHub Actions or other CI/CD tools

## Support

For deployment issues specific to a platform, refer to their documentation:
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
