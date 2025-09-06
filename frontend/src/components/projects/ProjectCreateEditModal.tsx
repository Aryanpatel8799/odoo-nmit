import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { CalendarIcon, X, Upload, ChevronDown } from 'lucide-react'

interface ProjectCreateEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (projectData: any) => void
  project?: any
  mode: 'create' | 'edit'
}

const availableTags = [
  'Services',
  'Customer Care',
  'Development',
  'Marketing',
  'Design',
  'Research',
  'Testing',
  'Support'
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com' },
  { id: '5', name: 'David Wilson', email: 'david@example.com' }
]

export function ProjectCreateEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  project, 
  mode 
}: ProjectCreateEditModalProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    tags: project?.tags || [],
    managerId: project?.managerId || '',
    deadline: project?.deadline || '',
    priority: project?.priority || 'medium',
    image: project?.image || '',
    description: project?.description || ''
  })

  const [selectedTags, setSelectedTags] = useState<string[]>(project?.tags || [])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [showManagerDropdown, setShowManagerDropdown] = useState(false)

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

  const handleManagerSelect = (managerId: string) => {
    setFormData(prev => ({ ...prev, managerId }))
    setShowManagerDropdown(false)
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const selectedManager = mockUsers.find(user => user.id === formData.managerId)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'New Project' : 'Edit Project'}>
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
            placeholder="Enter project name"
            className="w-full"
          />
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

        {/* Project Manager Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Manager</label>
          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowManagerDropdown(!showManagerDropdown)}
              className="w-full justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {selectedManager ? selectedManager.name : "Single Selection Dropdown"}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showManagerDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleManagerSelect(user.id)}
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

        {/* Deadline Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
          <div className="relative">
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full"
              placeholder="Date Selection Field"
            />
          </div>
        </div>

        {/* Priority Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <div className="flex space-x-6">
            {['low', 'medium', 'high'].map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={priority}
                  name="priority"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={priority} className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
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
            placeholder="Enter project description"
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
