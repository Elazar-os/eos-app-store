# GitHub OAuth Setup Guide

This guide walks you through setting up GitHub OAuth authentication for the EOS App Store.

## Overview

The authentication flow works as follows:

1. **Login Initiation**: User clicks "Sign in with GitHub" → redirected to `/api/auth/login`
2. **GitHub Authorization**: Redirects to GitHub's OAuth authorization page
3. **GitHub Callback**: User authorizes → GitHub redirects back to `/auth/postback/tunnel?code=...`
4. **Token Exchange**: Backend exchanges authorization code for access token
5. **Session Creation**: User info stored in secure cookies, redirected to dashboard

## Prerequisites

- GitHub account (for creating OAuth app)
- Local development environment with Node.js 18+
- The app running on `http://localhost:3000` for local development

## Step 1: Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** in the left sidebar
3. Click **New OAuth App**
4. Fill in the form:

   | Field | Value |
   |-------|-------|
   | Application name | `EOS App Store` (or your app name) |
   | Homepage URL | `http://localhost:3000` |
   | Application description | `App store for EOS community` (optional) |
   | Authorization callback URL | `http://localhost:3000/auth/postback/tunnel` |

5. Click **Register application**

## Step 2: Get Your Credentials

On the OAuth app page, you'll see:
- **Client ID** - Copy this value
- **Client Secret** - Click "Generate a new client secret" and copy it

⚠️ **Important**: Keep your Client Secret safe! Never commit it to version control.

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your GitHub credentials:
   ```env
   GITHUB_OAUTH_CLIENT_ID=your_client_id_here
   GITHUB_OAUTH_CLIENT_SECRET=your_client_secret_here
   GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/auth/postback/tunnel
   ```

3. Also add your Supabase credentials if not already set:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Step 4: Test the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Click "Sign in with GitHub"

4. You should be redirected to GitHub's authorization page

5. Click "Authorize" to approve the app

6. You should be redirected to the dashboard with your session active

## API Endpoints

### `/api/auth/login`
- **Method**: GET
- **Purpose**: Initiates GitHub OAuth flow
- **Redirects to**: GitHub authorization page

### `/auth/postback/tunnel`
- **Method**: GET/POST
- **Purpose**: OAuth callback endpoint - exchanges code for token
- **Parameters**:
  - `code` - Authorization code from GitHub
  - `state` - CSRF protection token
- **On success**: Sets secure cookies and redirects to `/dashboard`
- **On error**: Redirects to `/auth/error` with error details

### `/api/auth/logout`
- **Method**: GET
- **Purpose**: Clears session and logs out user
- **Redirects to**: Home page

### `/auth/login`
- **Method**: GET
- **Purpose**: Login page with GitHub sign-in button
- **Route**: Client-side page at `/app/auth/login/page.tsx`

### `/auth/error`
- **Method**: GET
- **Purpose**: Error page for authentication failures
- **Route**: Client-side page at `/app/auth/error/page.tsx`

## Session Management

User sessions are managed using secure HTTP-only cookies:

- **`github_access_token`**: Stores the GitHub access token (server-side only)
- **`user`**: Stores user profile information (accessible to client)

Both cookies expire after 30 days.

## Protecting Routes

To require authentication on a route, check for the `github_access_token` cookie. Example middleware:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('github_access_token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
```

## Production Deployment

For production deployment:

1. **Update GitHub OAuth App settings**:
   - Change Authorization callback URL to your production domain:
     ```
     https://your-domain.com/auth/postback/tunnel
     ```
   - Update Homepage URL to your production domain

2. **Update environment variables** on your hosting platform:
   ```
   GITHUB_OAUTH_CLIENT_ID=prod_client_id
   GITHUB_OAUTH_CLIENT_SECRET=prod_client_secret
   GITHUB_OAUTH_REDIRECT_URI=https://your-domain.com/auth/postback/tunnel
   ```

3. **Ensure cookies are secure**:
   - The code automatically uses `secure: true` in production
   - Requires HTTPS in production

## Troubleshooting

### "GitHub OAuth is not properly configured"
- Missing `GITHUB_OAUTH_CLIENT_ID` or `GITHUB_OAUTH_REDIRECT_URI` environment variables
- Check `.env.local` has correct values
- Restart the development server after changing env variables

### "Redirect URI mismatch"
- The `GITHUB_OAUTH_REDIRECT_URI` must match exactly what's configured in GitHub OAuth settings
- Common issue: `http://` vs `https://`, trailing slashes, or different domains
- Update either GitHub settings or environment variable to match

### Getting redirected to error page
- Check browser console and terminal logs for error details
- Verify GitHub credentials are correct
- Ensure the GitHub app hasn't been deleted or regenerated

### User not persisting after refresh
- Check that cookies are being sent in requests
- In dev tools Network tab, verify `github_access_token` and `user` cookies are present
- Check that cookies are set to HttpOnly and Secure (appropriate for environment)

## Next Steps

1. **Store user data in Supabase**: Currently user info is only in cookies. Consider syncing to database.
2. **Add CSRF state validation**: The `oauth_state` cookie is set but not currently validated in the callback.
3. **Add rate limiting**: Protect `/api/auth` endpoints from abuse.
4. **Add user roles/permissions**: Implement authorization logic beyond authentication.
