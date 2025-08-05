import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CustomAuth from '../components/CustomAuth'

const AuthPage = () => {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate('/dashboard')
    }
  }, [session, navigate])

  const handleAuthSuccess = () => {
    // The session will be updated automatically, triggering the redirect
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Gig Dash
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Track your side hustle earnings and boost your income
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <CustomAuth onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage