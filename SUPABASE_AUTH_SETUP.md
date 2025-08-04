# Supabase Authentication Setup

## Disable Email Confirmation

To allow users to sign up without email confirmation, you need to configure your Supabase project settings:

### 1. Go to Supabase Dashboard
- Navigate to your Supabase project dashboard
- Go to **Authentication** → **Settings**

### 2. Disable Email Confirmation
- Find the **Email Auth** section
- **Uncheck** "Enable email confirmations"
- Save the changes

### 3. Alternative: Enable Auto-Confirm (Recommended)
If you want to keep email confirmation as a backup but auto-confirm users:

1. Go to **Authentication** → **Settings**
2. In the **Email Auth** section:
   - Keep "Enable email confirmations" **checked**
   - Check "Enable auto-confirm"
   - This will automatically confirm users without requiring email verification

### 4. OAuth Provider Setup

#### Google OAuth:
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials
4. Add redirect URLs:
   - Development: `http://localhost:8080/auth/callback`
   - Production: `https://your-domain.vercel.app/auth/callback`

#### GitHub OAuth:
1. Go to **Authentication** → **Providers**
2. Enable **GitHub**
3. Add your GitHub OAuth credentials
4. Add redirect URLs:
   - Development: `http://localhost:8080/auth/callback`
   - Production: `https://your-domain.vercel.app/auth/callback`

### 5. Site URL Configuration

#### For Development:
- Site URL: `http://localhost:8080`
- Redirect URLs: `http://localhost:8080/auth/callback`

#### For Production:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

### 6. Environment Variables

Make sure you have these environment variables set:

#### Development (.env.local):
```
VITE_SUPABASE_DEV_URL=your_dev_project_url
VITE_SUPABASE_DEV_ANON_KEY=your_dev_anon_key
```

#### Production (Vercel):
```
VITE_SUPABASE_URL=your_prod_project_url
VITE_SUPABASE_ANON_KEY=your_prod_anon_key
```

## Security Considerations

1. **Captcha Protection**: The custom auth component includes a simple math captcha to prevent automated signups
2. **Password Requirements**: Minimum 6 characters required
3. **Rate Limiting**: Consider implementing rate limiting for signup attempts
4. **Email Validation**: Basic email format validation is included

## Testing

1. Test signup with email/password
2. Test OAuth sign-in with Google and GitHub
3. Verify users can access the dashboard immediately after signup
4. Test the captcha functionality

## Troubleshooting

### "Email confirmation required" error:
- Make sure email confirmation is disabled in Supabase settings
- Or enable auto-confirm in the settings

### OAuth redirect errors:
- Verify redirect URLs are correctly configured
- Check that the URLs match exactly (including http/https)

### Session not persisting:
- Check that `persistSession: true` is set in the Supabase client config
- Verify cookies are enabled in the browser