import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { Github, Mail } from 'lucide-react'

interface CustomAuthProps {
  onSuccess?: () => void
}

const CustomAuth = ({ onSuccess }: CustomAuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Simple captcha - user needs to solve a basic math problem
  // Use useMemo to keep the captcha stable during form interactions
  const captchaNumbers = useMemo(() => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    return { num1, num2, answer: num1 + num2 }
  }, [isSignUp]) // Only regenerate when switching between signup/signin

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate captcha only for signup
    if (isSignUp && parseInt(captchaAnswer) !== captchaNumbers.answer) {
      setError('Please solve the captcha correctly')
      return
    }

    // Validate email and password
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        // Sign up without email confirmation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              // You can add additional user metadata here
            }
          }
        })

        if (error) {
          throw error
        }

        // Auto-confirm the user (bypass email confirmation)
        if (data.user) {
          // Try to sign in immediately after signup
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (signInError) {
            // If auto-signin fails, show success message and switch to sign in
            setSuccess('Account created successfully! You can now sign in.')
            setIsSignUp(false)
            setEmail('')
            setPassword('')
          } else if (signInData.user) {
            // Auto-signin successful
            setSuccess('Account created and signed in successfully!')
            onSuccess?.()
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          throw error
        }

        if (data.user) {
          setSuccess('Signed in successfully!')
          onSuccess?.()
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
            } finally {
          setLoading(false)
          // Only clear captcha answer if we're on signup mode
          if (isSignUp) {
            setCaptchaAnswer('')
          }
        }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignIn('github')}
          disabled={loading}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        {/* Simple Captcha - Only show on signup */}
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="captcha">
              Verify you're human: What is {captchaNumbers.num1} + {captchaNumbers.num2}?
            </Label>
            <Input
              id="captcha"
              type="number"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Enter the answer"
              required
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
            setSuccess(null)
            setEmail('')
            setPassword('')
            setCaptchaAnswer('')
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

export default CustomAuth 