# Instagram Integration Setup Instructions

## Overview
This website includes an Instagram section that displays your latest posts using the Instagram Basic Display API.

## Current Status
✅ Instagram section component created
✅ Instagram service with API integration
✅ Mock data for development testing
✅ Navigation menu updated
✅ Translations added (DE/EN)

## What You See Now
The Instagram section is currently displaying **mock data** (sample images from your location folder) because the API token is not configured yet.

## How to Get Instagram API Access

### Step 1: Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as app type
4. Fill in app details (name, contact email)
5. Click "Create App"

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Scroll to "Basic Display" section
4. Click "Create New App"
5. Fill in required fields:
   - **Display Name**: Your website name
   - **Valid OAuth Redirect URIs**: `https://yourdomain.com/`
   - **Deauthorize Callback URL**: `https://yourdomain.com/`
   - **Data Deletion Request URL**: `https://yourdomain.com/`
6. Save changes

### Step 3: Add Instagram Tester
1. In "Basic Display" settings, scroll to "User Token Generator"
2. Click "Add or Remove Instagram Testers"
3. Click "Add Instagram Testers"
4. Enter your Instagram username (@taekwondo_ailingen)
5. The account owner must accept the invite:
   - Open Instagram app
   - Go to Settings → Apps and Websites → Tester Invites
   - Accept the invite

### Step 4: Generate Access Token
1. Back in "User Token Generator" section
2. Click "Generate Token" next to your Instagram account
3. Log in with your Instagram account
4. Authorize the app
5. **Copy the Access Token** (long string of characters)

### Step 5: Configure the Website
1. Open `src/environments/environment.ts`
2. Replace `YOUR_INSTAGRAM_ACCESS_TOKEN` with your token:
   ```typescript
   export const environment = {
     production: false,
     instagram: {
       accessToken: 'IGQWRN...' // Paste your token here
     }
   };
   ```
3. Do the same for `src/environments/environment.prod.ts`

### Step 6: Refresh Token (Important!)
Instagram access tokens expire after 60 days. You can:

**Option A: Manual Refresh** (Simple, but requires action every 60 days)
- Repeat Step 4 every 60 days
- Update token in environment files

**Option B: Long-Lived Tokens** (90 days, can auto-refresh)
1. Exchange short-lived token for long-lived:
   ```
   https://graph.instagram.com/refresh_access_token
     ?grant_type=ig_exchange_token
     &client_secret=YOUR_APP_SECRET
     &access_token=YOUR_SHORT_LIVED_TOKEN
   ```
2. Token valid for 60 days
3. Can be refreshed before expiration

**Option C: Backend Solution** (Best for production)
- Store token securely in backend
- Implement auto-refresh logic
- Serve token via API endpoint
- Update `instagram.service.ts` to fetch from backend

## Testing
1. After adding the token, restart the dev server
2. Navigate to the Instagram section
3. You should see your real Instagram posts
4. Click on any post to open it on Instagram

## Troubleshooting

### "Loading Instagram posts..." never completes
- Check browser console for errors
- Verify token is correctly pasted (no extra spaces)
- Ensure Instagram account accepted tester invite

### "Failed to load Instagram posts"
- Token might be expired (regenerate)
- Instagram account not authorized
- API rate limit reached (wait 1 hour)

### No posts visible
- Make sure Instagram account has public posts
- Check that account is not private
- Verify account has at least one post

## Security Notes
⚠️ **Important**: Access tokens in client-side code can be extracted by users

For production:
- Consider using a backend proxy
- Implement token refresh logic
- Monitor API usage
- Never commit real tokens to Git

## Rate Limits
- 200 requests per hour per user
- Should be sufficient for normal usage
- Consider caching responses if needed

## Alternative Options
If Instagram API setup is too complex:
1. Use third-party services (EmbedSocial, Juicer.io)
2. Manually embed individual posts
3. Link directly to Instagram profile

## Support
- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Token Management](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens)
- [Common Issues](https://developers.facebook.com/docs/instagram-basic-display-api/overview#requirements)
