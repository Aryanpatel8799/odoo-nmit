import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

// Mock data
const mockProject = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with modern design and improved user experience',
  ownerId: '1',
  members: [
    { userId: '1', role: 'owner' as const },
    { userId: '2', role: 'member' as const },
    { userId: '3', role: 'member' as const }
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  stats: {
    totalTasks: 12,
    completedTasks: 8,
    inProgressTasks: 3,
    todoTasks: 1
  }
}

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: '' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: '' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatarUrl: '' }
]

const mockRecentActivity = [
  {
    id: '1',
    type: 'task_completed',
    user: 'Sarah Chen',
    action: 'completed task',
    target: 'Design homepage mockup',
    timestamp: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    type: 'task_assigned',
    user: 'Alex Rivera',
    action: 'assigned task',
    target: 'Implement responsive navigation',
    assignee: 'Mike Johnson',
    timestamp: '2024-01-20T12:15:00Z'
  },
  {
    id: '3',
    type: 'thread_created',
    user: 'Mike Johnson',
    action: 'started discussion',
    target: 'Color scheme feedback',
    timestamp: '2024-01-20T10:45:00Z'
  }
]

export function ProjectDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)
  const { addToast } = useToast()

  const completionPercentage = mockProject.stats.totalTasks > 0 
    ? (mockProject.stats.completedTasks / mockProject.stats.totalTasks) * 100 
    : 0

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim()) return

    setIsAddingMember(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        title: 'Member added!',
        description: `${newMemberEmail} has been added to the project.`,
        type: 'success'
      })
      
      setShowAddMemberModal(false)
      setNewMemberEmail('')
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to add member. Please try again.',
        type: 'error'
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', href: `/projects/${id}` },
    { id: 'tasks', name: 'Tasks', href: `/projects/${id}/tasks` },
    { id: 'discussions', name: 'Discussions', href: `/projects/${id}/discussions` }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{mockProject.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{mockProject.name}</h1>
          <p className="text-muted-foreground max-w-2xl">
            {mockProject.description}
          </p>
        </div>
        
        <div className="flex gap-2 animate-slide-in">
          <Button variant="outline" onClick={() => setShowAddMemberModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b animate-slide-up">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.href}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progress Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
              <div className="space-y-4">
                <ProgressBar value={completionPercentage} showLabel size="lg" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {mockProject.stats.todoTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">To Do</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockProject.stats.inProgressTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {mockProject.stats.completedTasks}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-lg border p-6 animate-slide-up">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'task_completed' && (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {activity.type === 'task_assigned' && (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {activity.type === 'thread_created' && (
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}{' '}
                        <span className="font-medium">"{activity.target}"</span>
                        {activity.assignee && (
                          <>
                            {' '}to <span className="font-medium">{activity.assignee}</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 animate-bounce-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <Badge variant="secondary">{mockUsers.length}</Badge>
              </div>
              <div className="space-y-3">
                {mockUsers.map((user, index) => {
                  const member = mockProject.members.find(m => m.userId === user.id)
                  return (
                    <div key={user.id} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant={member?.role === 'owner' ? 'default' : 'secondary'}>
                        {member?.role || 'member'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border p-6 animate-slide-up">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to={`/projects/${id}/tasks`}>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </Button>
                </Link>
                <Link to={`/projects/${id}/discussions`}>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start Discussion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Team Member"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter member's email"
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="member">Member</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMemberModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isAddingMember}
              disabled={!newMemberEmail.trim() || isAddingMember}
              className="flex-1"
            >
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
