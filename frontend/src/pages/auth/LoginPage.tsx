import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  
  const { login } = useAuth()
  const { addToast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      await login(email, password)
      addToast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        type: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Title of the Project
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/solutions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Solutions
              </Link>
              <Link to="/work" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Work
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link to="/login" className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Login into account
              </h2>
              <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                signup instead
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }))
                    }
                  }}
                  error={errors.email}
                  placeholder="Email"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }))
                    }
                  }}
                  error={errors.password}
                  placeholder="Password"
                  className="w-full"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400 dark:text-orange-400">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-full py-3"
                loading={isLoading}
                disabled={isLoading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Banner */}
            <div className="md:col-span-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 h-32 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Cute Oyster</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
              </ul>
            </div>

            {/* Connect with us */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Connect with us
              </h3>
              <ul className="space-y-2">
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
                <li><div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
