import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToast()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        title: 'Profile updated!',
        description: 'Your profile has been saved successfully.',
        type: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to update profile.',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} size="lg" />
          <div>
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />

          <Button type="submit" loading={isSaving} disabled={isSaving}>
            Save Changes
          </Button>
        </form>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-4 animate-slide-up">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Once you sign out, you'll need to sign in again to access your account.
        </p>
        <Button variant="destructive" onClick={logout}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
