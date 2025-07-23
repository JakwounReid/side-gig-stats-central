# Supabase Database Setup for Sessions

This guide will help you set up the database table and security policies for storing user sessions in Supabase.

## 1. Create the Sessions Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  earnings DECIMAL(10,2) NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  miles DECIMAL(8,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
```

## 2. Set Up Row Level Security Policies

Run these SQL commands to ensure users can only access their own data:

```sql
-- Policy for users to view their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own sessions
CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own sessions
CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own sessions
CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id);
```

## 3. Verify the Setup

You can test the setup by running this query in the SQL Editor:

```sql
-- Check if the table was created
SELECT * FROM information_schema.tables 
WHERE table_name = 'sessions';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'sessions';

-- Check if policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'sessions';
```

## 4. Optional: Add Some Sample Data (for testing)

If you want to test with some sample data:

```sql
-- Insert sample data (replace 'your-user-id' with an actual user ID from auth.users)
INSERT INTO sessions (user_id, platform, earnings, hours, miles, date, notes)
VALUES 
  ('your-user-id', 'Uber', 85.50, 2.5, 45.2, CURRENT_DATE, 'Morning shift'),
  ('your-user-id', 'DoorDash', 62.30, 1.8, 28.5, CURRENT_DATE, 'Lunch rush'),
  ('your-user-id', 'Lyft', 45.20, 1.2, 22.1, CURRENT_DATE - INTERVAL '1 day', 'Evening rides');
```

## 5. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Testing the Integration

After setting up the database:

1. Start your development server: `npm run dev`
2. Log in to your application
3. Try logging a new session
4. Check that the data appears in your Supabase dashboard
5. Log out and log back in to verify data persistence

## Troubleshooting

### Common Issues:

1. **"relation 'sessions' does not exist"**
   - Make sure you ran the CREATE TABLE command in the correct database

2. **"permission denied"**
   - Verify that RLS policies are correctly set up
   - Check that the user is authenticated

3. **"foreign key violation"**
   - Ensure the user_id references a valid user in auth.users

4. **Data not persisting**
   - Check your environment variables
   - Verify the Supabase client is properly configured

### Useful Queries for Debugging:

```sql
-- Check all sessions for a specific user
SELECT * FROM sessions WHERE user_id = 'your-user-id';

-- Check recent sessions
SELECT * FROM sessions ORDER BY created_at DESC LIMIT 10;

-- Check session count by platform
SELECT platform, COUNT(*) as session_count 
FROM sessions 
GROUP BY platform;
```

## Security Notes

- Row Level Security ensures users can only access their own data
- The `user_id` foreign key with CASCADE DELETE ensures data cleanup when users are deleted
- All database operations are validated against the authenticated user
- No sensitive data is exposed through the API

Your sessions data is now securely stored and will persist across logins! 