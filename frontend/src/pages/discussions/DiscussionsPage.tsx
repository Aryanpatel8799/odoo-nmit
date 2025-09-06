import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

const mockThreads = [
  {
    id: '1',
    projectId: '1',
    title: 'Color scheme feedback',
    authorId: '3',
    createdAt: '2024-01-20T10:45:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    replyCount: 5
  },
  {
    id: '2',
    projectId: '1',
    title: 'Sprint planning discussion',
    authorId: '1',
    createdAt: '2024-01-19T09:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    replyCount: 12
  }
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: '' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: '' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatarUrl: '' }
]

export function DiscussionsPage() {
  const { id: projectId } = useParams()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newThread, setNewThread] = useState({ title: '', body: '' })
  const [isCreating, setIsCreating] = useState(false)
  const { addToast } = useToast()

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newThread.title.trim() || !newThread.body.trim()) return

    setIsCreating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        title: 'Discussion started!',
        description: `${newThread.title} has been created.`,
        type: 'success'
      })
      
      setShowCreateModal(false)
      setNewThread({ title: '', body: '' })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create discussion.',
        type: 'error'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const getAuthor = (authorId: string) => {
    return mockUsers.find(user => user.id === authorId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
          <p className="text-muted-foreground">
            Team conversations and project discussions
          </p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} className="animate-bounce-in">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Discussion
        </Button>
      </div>

      <div className="space-y-4">
        {mockThreads.map((thread, index) => {
          const author = getAuthor(thread.authorId)
          
          return (
            <div
              key={thread.id}
              className="bg-card rounded-lg border p-6 space-y-4 cursor-pointer hover:shadow-md transition-all duration-200 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-semibold">{thread.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {author && <Avatar name={author.name} src={author.avatarUrl} size="sm" />}
                      <span>Started by {author?.name}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(thread.createdAt)}</span>
                  </div>
                </div>
                
                <Badge variant="secondary">
                  {thread.replyCount} replies
                </Badge>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Start New Discussion"
        className="max-w-lg"
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <Input
            label="Discussion Title"
            value={newThread.title}
            onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What would you like to discuss?"
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={newThread.body}
              onChange={(e) => setNewThread(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Start the conversation..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isCreating}
              disabled={!newThread.title.trim() || !newThread.body.trim() || isCreating}
              className="flex-1"
            >
              Start Discussion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
