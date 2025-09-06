import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Modal } from '@/components/ui/Modal'
import { TaskCreateEditModal } from '@/components/tasks/TaskCreateEditModal'
import { Task, TaskStatus } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

// Mock data matching wireframe
const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Optimise Website Controllers',
    description: 'Improve performance and efficiency of website controllers',
    assigneeId: '2',
    dueDate: '2024-03-21T00:00:00Z',
    status: 'in_progress',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['Feedback', 'Refactor']
  },
  {
    id: '2',
    projectId: '1',
    title: 'Fix Authentication Bug',
    description: 'Resolve login issues affecting multiple users',
    assigneeId: '1',
    dueDate: '2024-03-18T00:00:00Z',
    status: 'todo',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    tags: ['Bug', 'Critical']
  },
  {
    id: '3',
    projectId: '2',
    title: 'Update User Interface',
    description: 'Modernize the dashboard UI components',
    assigneeId: '3',
    dueDate: '2024-03-25T00:00:00Z',
    status: 'done',
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    tags: ['UI', 'Enhancement']
  }
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: '' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: '' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatarUrl: '' }
]

export function TasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { addToast } = useToast()

  const handleEditTask = (taskId: string) => {
    const task = mockTasks.find(t => t.id === taskId)
    if (task) {
      setEditingTask(task)
      setShowEditModal(true)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Deleting task:', taskId)
    addToast({
      title: 'Delete Task',
      description: 'Delete functionality will be implemented soon.',
      type: 'default'
    })
  }

  const handleCreateTask = (taskData: any) => {
    console.log('Creating task:', taskData)
    addToast({
      title: 'Task created!',
      description: `${taskData.name} has been created successfully.`,
      type: 'success'
    })
  }

  const handleUpdateTask = (taskData: any) => {
    console.log('Updating task:', taskData)
    addToast({
      title: 'Task updated!',
      description: `Task has been updated successfully.`,
      type: 'success'
    })
  }

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      addToast({
        title: 'Task updated!',
        description: 'Task status has been updated.',
        type: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to update task status.',
        type: 'error'
      })
    }
  }

  const getAssignee = (assigneeId?: string) => {
    return mockUsers.find(user => user.id === assigneeId)
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = getAssignee(task.assigneeId)

    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
        onClick={() => setSelectedTask(task)}
      >
        {/* Task Tags */}
        <div className="flex gap-2 mb-3">
          {task.tags?.map((tag: string, index: number) => (
            <Badge 
              key={index}
              variant={index === 0 ? "success" : "secondary"}
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Task Title and Menu */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm leading-tight text-gray-900 dark:text-white">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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

        {/* Task Preview Image */}
        <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
          <div className="absolute top-1 left-1 w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="absolute top-1 right-1 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-8 h-2 bg-white/20 rounded"></div>
          <div className="absolute bottom-1 right-1 w-6 h-2 bg-white/20 rounded"></div>
          <div className="text-white/60 text-xs">Task Preview</div>
        </div>

        {/* Task Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assignee && (
              <Avatar name={assignee.name} size="sm" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {assignee ? assignee.name : 'Unassigned'}
            </span>
          </div>
          
          {task.dueDate && (
            <Badge variant={isOverdue(task.dueDate) ? 'destructive' : 'secondary'} className="text-xs">
              {formatRelativeTime(task.dueDate)}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your tasks</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        <TaskCreateEditModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateTask}
          mode="create"
        />

        {/* Edit Task Modal */}
        <TaskCreateEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateTask}
          task={editingTask}
          mode="edit"
        />

        {/* Task Detail Modal */}
        {selectedTask && (
          <Modal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            title={selectedTask.title}
            className="max-w-2xl"
          >
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
              
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="flex gap-2">
                  {selectedTask.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
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
                  <Badge variant={isOverdue(selectedTask.dueDate) ? 'destructive' : 'secondary'}>
                    {formatRelativeTime(selectedTask.dueDate)}
                  </Badge>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
