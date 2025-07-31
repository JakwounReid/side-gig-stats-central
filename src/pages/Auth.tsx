import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate('/')
    }
  }, [session, navigate])

  const handleClearSession = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            redirectTo={import.meta.env.DEV ? 'http://localhost:8080/' : `${window.location.origin}/`}
          />
          {import.meta.env.DEV && (
            <div className="mt-4 text-center">
              <button
                onClick={handleClearSession}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear Session (Debug)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage