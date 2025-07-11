# Supabase Authentication Setup

This project now includes Supabase authentication with the following features:

## Features

- ✅ Email/Password authentication
- ✅ Social login (Google, GitHub)
- ✅ Protected routes
- ✅ User session management
- ✅ Auto-redirect on login/logout
- ✅ User profile display
- ✅ Beautiful UI with shadcn/ui components

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for the project to be set up

### 2. Get Your Supabase Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key

### 3. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Configure Authentication Providers (Optional)

If you want to enable social login:

1. Go to Authentication > Providers in your Supabase dashboard
2. Configure Google, GitHub, or other providers
3. Add your OAuth credentials

### 5. Set Up Site URL

1. Go to Authentication > URL Configuration
2. Add your site URL (e.g., `http://localhost:5173` for development)

### 6. Start the Development Server

```bash
npm run dev
```

## Usage

### Authentication Flow

1. **Unauthenticated users** are redirected to `/auth`
2. **Authenticated users** can access the protected dashboard at `/`
3. Users can sign out from the dashboard

### Available Routes

- `/auth` - Authentication page (login/signup)
- `/` - Protected dashboard (requires authentication)

### Authentication Context

The `AuthProvider` provides the following:

- `session` - Current user session
- `user` - Current user object
- `loading` - Loading state
- `signOut()` - Sign out function

### Using Auth in Components

```tsx
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { user, session, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!session) return <div>Please login</div>
  
  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## Components

### AuthProvider
Manages authentication state and provides it to the app.

### ProtectedRoute
Wraps components that require authentication.

### Dashboard
Main dashboard component showing user information.

### AuthPage
Login/signup page using Supabase Auth UI.

## Security Notes

- Never commit your `.env` file
- Use environment-specific configurations
- Enable Row Level Security (RLS) in Supabase for your tables
- Consider implementing proper error handling and validation

## Next Steps

1. Set up your database schema
2. Implement Row Level Security policies
3. Add more authentication providers if needed
4. Customize the UI to match your brand
5. Add profile management features

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Check that your `.env` file exists and has the correct variables
- Restart your development server after adding environment variables

**Authentication not working:**
- Verify your Supabase project URL and keys
- Check that your site URL is configured in Supabase
- Ensure OAuth providers are properly configured

**Redirects not working:**
- Check that your redirect URLs are configured in Supabase
- Verify that the `redirectTo` parameter matches your site URL