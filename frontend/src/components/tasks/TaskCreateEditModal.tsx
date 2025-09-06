import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, X, Upload } from 'lucide-react'

interface TaskCreateEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (taskData: any) => void
  task?: any
  mode: 'create' | 'edit'
  preselectedProjectId?: string
}

const availableTags = [
  'Frontend',
  'Backend',
  'Design',
  'Testing',
  'Bug Fix',
  'Feature',
  'Documentation',
  'Research'
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com' },
  { id: '5', name: 'David Wilson', email: 'david@example.com' }
]

const mockProjects = [
  { id: '1', name: 'RD Sales' },
  { id: '2', name: 'Marketing Platform' },
  { id: '3', name: 'Customer Portal' },
  { id: '4', name: 'Analytics Dashboard' }
]

export function TaskCreateEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  task, 
  mode,
  preselectedProjectId 
}: TaskCreateEditModalProps) {
  const [formData, setFormData] = useState({
    name: task?.title || '',
    assigneeId: task?.assigneeId || '',
    projectId: task?.projectId || preselectedProjectId || '',
    tags: task?.tags || [],
    deadline: task?.dueDate ? task.dueDate.split('T')[0] : '',
    image: task?.image || '',
    description: task?.description || ''
  })

  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || [])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)

  const handleTagToggle = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(updatedTags)
    setFormData(prev => ({ ...prev, tags: updatedTags }))
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove)
    setSelectedTags(updatedTags)
    setFormData(prev => ({ ...prev, tags: updatedTags }))
  }

  const handleAssigneeSelect = (assigneeId: string) => {
    setFormData(prev => ({ ...prev, assigneeId }))
    setShowAssigneeDropdown(false)
  }

  const handleProjectSelect = (projectId: string) => {
    setFormData(prev => ({ ...prev, projectId }))
    setShowProjectDropdown(false)
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const selectedAssignee = mockUsers.find(user => user.id === formData.assigneeId)
  const selectedProject = mockProjects.find(project => project.id === formData.projectId)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'New Task' : 'Edit Task'}>
      <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter task name"
            className="w-full"
          />
        </div>

        {/* Assignee Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</label>
          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              className="w-full justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {selectedAssignee ? selectedAssignee.name : "Single Selection Dropdown"}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showAssigneeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleAssigneeSelect(user.id)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="w-full justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={!!preselectedProjectId}
            >
              {selectedProject ? selectedProject.name : "Project must be automatically set when creating a task from Project View."}
              {!preselectedProjectId && <ChevronDown className="h-4 w-4" />}
            </Button>
            {showProjectDropdown && !preselectedProjectId && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                  {mockProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-xs font-medium">
                        {project.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {preselectedProjectId && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Project is automatically set when creating from Project View.
            </p>
          )}
        </div>

        {/* Tags Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
          <div className="space-y-2">
            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-600"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
              {selectedTags.length === 0 && (
                <span className="text-gray-500 text-sm">Select tags...</span>
              )}
            </div>
            
            {/* Tags Dropdown */}
            <div className="relative">
              <Button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="w-full justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Multi Selection Dropdown
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showTagDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleTagToggle(tag)}
                      >
                        <div className={`w-4 h-4 border rounded ${
                          selectedTags.includes(tag) 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedTags.includes(tag) && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deadline Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            className="w-full"
          />
        </div>

        {/* Image Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload Image
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: any) => {
                const file = e.target.files?.[0]
                if (file) {
                  console.log('File selected:', file.name)
                }
              }}
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter task description"
            className="w-full min-h-[100px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Discard
        </Button>
        <Button 
          onClick={handleSave} 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
        >
          Save
        </Button>
      </div>
    </Modal>
  )
}
