import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { register } = useAuth()
  const { addToast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and privacy policy'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`
      await register(formData.email, formData.password, fullName)
      addToast({
        title: 'Account created!',
        description: 'Welcome to SynergySphere. You can now start collaborating.',
        type: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Registration failed',
        description: 'Please try again or contact support if the problem persists.',
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
              <Link to="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Sign Up Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create an account
              </h2>
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                log in instead
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={errors.firstName}
                  placeholder="First name"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={errors.lastName}
                  placeholder="Last name"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
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
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  placeholder="Password"
                  className="w-full"
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: '' }))
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agree-terms" className="text-gray-600 dark:text-gray-400">
                    By creating an account, I agree to our{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                      Terms of use
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 underline">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                loading={isLoading}
                disabled={isLoading}
              >
                Create an account
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
                <span className="text-gray-500 dark:text-gray-400 text-sm">Company's Banner</span>
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Some important Quick Links to be accessed (Optional)
              </p>
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Some quick social media links
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
