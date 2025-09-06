import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'
import { Task, TaskStatus } from '@/types'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for user's assigned tasks
const mockMyTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Optimise Website Controllers',
    description: 'Improve performance and efficiency of website controllers',
    assigneeId: '1', // Current user
    dueDate: '2024-03-21T00:00:00Z',
    status: 'in_progress',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['Feedback', 'Bug']
  }
]

const mockProjects = [
  { id: '1', name: 'RD Sales' },
  { id: '2', name: 'Marketing Platform' },
  { id: '3', name: 'Customer Portal' }
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: '' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: '' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatarUrl: '' }
]

export function MyTasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    status: 'todo' as TaskStatus
  })
  const [isCreating, setIsCreating] = useState(false)
  const { addToast } = useToast()

  const handleEditTask = (taskId: string) => {
    console.log('Editing task:', taskId)
    addToast({
      title: 'Edit Task',
      description: 'Edit functionality will be implemented soon.',
      type: 'default'
    })
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Deleting task:', taskId)
    addToast({
      title: 'Delete Task',
      description: 'Delete functionality will be implemented soon.',
      type: 'default'
    })
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    setIsCreating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        title: 'Task created!',
        description: `${newTask.title} has been created successfully.`,
        type: 'success'
      })
      
      setShowCreateModal(false)
      setNewTask({
        title: '',
        description: '',
        assigneeId: '',
        dueDate: '',
        status: 'todo'
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        type: 'error'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const getAssignee = (assigneeId?: string) => {
    return mockUsers.find(user => user.id === assigneeId)
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = getAssignee(task.assigneeId)

    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in max-w-sm"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {task.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant={tag === 'Feedback' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    tag === 'Feedback' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Project:</span> {mockProjects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
            </p>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {task.title}
            </h3>
          </div>
        </div>

        {/* Task Preview Image */}
        <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
          <div className="absolute top-1 left-1 w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="absolute top-1 right-1 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-8 h-2 bg-white/20 rounded"></div>
          <div className="absolute bottom-1 right-1 w-6 h-2 bg-white/20 rounded"></div>
          <div className="text-white/60 text-xs">Task Preview</div>
        </div>

        {/* Task Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : 'No date'}
          </div>
          
          {assignee && (
            <Avatar name={assignee.name} src={assignee.avatarUrl} size="sm" className="border-2 border-blue-500" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb and New Task button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>&gt;</span>
          <span className="font-medium text-foreground">My Tasks</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </div>
      </div>

      {/* Single Task Display */}
      <div className="flex justify-start">
        {mockMyTasks.length > 0 ? (
          <TaskCard task={mockMyTasks[0]} />
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any tasks assigned to you yet
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Task
            </Button>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        className="max-w-lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title"
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <select
                value={newTask.assigneeId}
                onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Unassigned</option>
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
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
              disabled={!newTask.title.trim() || isCreating}
              className="flex-1"
            >
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={selectedTask.title}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            {selectedTask.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge variant="default">In Progress</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Assignee</h4>
                <div className="flex items-center gap-2">
                  {selectedTask.assigneeId ? (
                    <>
                      <Avatar name={getAssignee(selectedTask.assigneeId)?.name || ''} size="sm" />
                      <span className="text-sm">{getAssignee(selectedTask.assigneeId)?.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
            
            {selectedTask.dueDate && (
              <div>
                <h4 className="font-medium mb-2">Due Date</h4>
                <Badge variant="secondary">
                  {new Date(selectedTask.dueDate).toLocaleDateString('en-GB')}
                </Badge>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
