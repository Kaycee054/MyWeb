# Deployment Guide

## Environment Variables Configuration

Your application requires Supabase credentials to function properly. Without these, the site will display a black screen after the loading screen.

### For Netlify Deployment

1. **Access Environment Variables**
   - Log in to your [Netlify Dashboard](https://app.netlify.com)
   - Select your site
   - Go to **Site settings** → **Environment variables**

2. **Add Required Variables**

   Add the following environment variables:

   ```
   VITE_SUPABASE_URL=https://brfwcsmoayxvzqkaihbh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZndjc21vYXl4dnpxa2FpaGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDQ5MjksImV4cCI6MjA3Mjk4MDkyOX0.BcxQ4ULmx7l4MENAQS5PdNj9bs3J1ZAYAnWp3B40xQo
   ```

   **Important:**
   - Variable names must start with `VITE_` for Vite to include them in the build
   - Copy these values exactly from your `.env` file
   - Make sure there are no extra spaces or quotes

3. **Redeploy Your Site**
   - After adding the environment variables, trigger a new deployment
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**
   - Or push a new commit to your repository

### For Other Hosting Providers

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

#### GitHub Pages
GitHub Pages only serves static files and doesn't support server-side environment variables. You need to:
1. Build locally with environment variables set
2. Commit the built `dist` folder
3. Deploy from the `dist` folder

**Not recommended** - Use Netlify or Vercel instead.

## Troubleshooting

### Black Screen After Loading

**Symptoms:**
- Site shows loading screen
- Loading screen disappears
- Black screen appears
- Console shows Supabase configuration errors

**Solution:**
1. Open browser console (F12)
2. Look for warning: "⚠️ CONFIGURATION ERROR: Missing Supabase environment variables!"
3. Follow the instructions in the console message
4. Add environment variables to your hosting platform
5. Redeploy your site

### Local Development Works, Production Doesn't

This is the classic environment variable issue:
- Local development uses `.env` file
- Production needs environment variables configured in hosting platform
- Make sure variables are added to your hosting provider's dashboard

### Verification

After deployment, check the browser console:
- If properly configured: No Supabase errors
- If misconfigured: Clear error message with instructions

## Security Notes

- The `VITE_SUPABASE_ANON_KEY` is safe to expose in the browser
- It only allows access according to your Row Level Security (RLS) policies
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
