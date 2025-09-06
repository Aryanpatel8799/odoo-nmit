import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronRight, Plus, MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ProjectCreateEditModal } from '@/components/projects/ProjectCreateEditModal'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Users, CheckSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Mock data - replace with actual API calls
const mockProjects = [
  {
    id: '1',
    name: 'RD Services',
    description: 'Research and Development services for innovative solutions',
    ownerId: '1',
    tags: ['Services', 'Customer Care'],
    image: '/api/placeholder/300/200',
    deadline: '2024-03-21T00:00:00Z',
    members: [
      { userId: '1', role: 'owner' as const },
      { userId: '2', role: 'member' as const },
      { userId: '3', role: 'member' as const }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    stats: {
      totalTasks: 10,
      completedTasks: 8,
      inProgressTasks: 2,
      todoTasks: 0
    }
  },
  {
    id: '2',
    name: 'Calm Locust',
    description: 'RD Sales platform development and optimization',
    ownerId: '1',
    tags: ['RD Sales'],
    image: '/api/placeholder/300/200',
    deadline: null,
    members: [
      { userId: '1', role: 'owner' as const },
      { userId: '4', role: 'member' as const }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    stats: {
      totalTasks: 200,
      completedTasks: 150,
      inProgressTasks: 40,
      todoTasks: 10
    }
  },
  {
    id: '3',
    name: 'RD Upgrade',
    description: 'System upgrade and migration project',
    ownerId: '2',
    tags: ['Upgrade', 'Migration'],
    image: '/api/placeholder/300/200',
    deadline: '2024-03-18T00:00:00Z',
    members: [
      { userId: '2', role: 'owner' as const },
      { userId: '1', role: 'member' as const }
    ],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    stats: {
      totalTasks: 5,
      completedTasks: 3,
      inProgressTasks: 2,
      todoTasks: 0
    }
  }
]

const mockUsers = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatarUrl: '' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: '' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatarUrl: '' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatarUrl: '' }
]

export function ProjectsPage() {
  const { addToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = () => {
    setShowCreateModal(true)
  }

  const handleEditProject = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId)
    setEditingProject(project)
  }

  const handleDeleteProject = (projectId: string) => {
    console.log('Deleting project:', projectId)
    addToast({
      title: 'Delete Project',
      description: 'Delete functionality will be implemented soon.',
      type: 'default'
    })
  }

  const handleSaveProject = (projectData: any) => {
    console.log('Saving project:', projectData)
    addToast({
      title: editingProject ? 'Project Updated' : 'Project Created',
      description: `Project has been ${editingProject ? 'updated' : 'created'} successfully.`,
      type: 'success'
    })
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingProject(null)
  }

  const handleCreateProjectForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim()) return

    setIsCreating(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        title: 'Project created!',
        description: `${newProject.name} has been created successfully.`,
        type: 'success'
      })
      
      setShowCreateModal(false)
      setNewProject({ name: '', description: '' })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        type: 'error'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const getProjectMembers = (memberIds: string[]) => {
    return memberIds.map(id => mockUsers.find(user => user.id === id)).filter(Boolean)
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb and New Project button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>&gt;</span>
          <span className="font-medium text-foreground">Projects</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </Button>
          <Button onClick={handleCreateProject} className="bg-blue-500 hover:bg-blue-600 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project, index) => {
          const projectMembers = getProjectMembers(project.members.map(m => m.userId))

          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Project Tags */}
                <div className="p-4 pb-2">
                  <div className="flex gap-2 mb-3">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant={tagIndex === 0 ? "success" : "secondary"}
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Title and Menu */}
                <div className="px-4 pb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Project Image/Preview */}
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements to match wireframe */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-12 h-3 bg-white/20 rounded"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-3 bg-white/20 rounded"></div>
                    <div className="text-white/60 text-xs">Project Preview</div>
                  </div>
                </div>

                {/* Project Footer */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(project.updatedAt)}
                    </div>

                    {/* Deadline or Task Count */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {project.deadline ? (
                        <>
                          <span className="text-red-500 dark:text-red-400 font-medium">D-{Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {project.stats.totalTasks} tasks
                        </>
                      )}
                    </div>
                  </div>

                  {/* Project Manager and Team Members */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Project Manager */}
                    <div className="flex items-center">
                      {(() => {
                        const projectOwner = mockUsers.find(user => user.id === project.ownerId)
                        return projectOwner ? (
                          <Avatar
                            name={projectOwner.name}
                            src={projectOwner.avatarUrl}
                            size="sm"
                            className="border-2 border-blue-500"
                          />
                        ) : null
                      })()}
                    </div>
                    
                    {/* Team Members */}
                    <div className="flex -space-x-2">
                      {projectMembers.slice(0, 2).map((member) => (
                        <Avatar
                          key={member.id}
                          name={member.name}
                          src={member.avatarUrl}
                          size="sm"
                          className="border-2 border-white dark:border-gray-800"
                        />
                      ))}
                      {projectMembers.length > 2 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                          +{projectMembers.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {mockProjects.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to start collaborating with your team
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Project
          </Button>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProjectForm} className="space-y-4">
          <Input
            label="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={3}
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
              disabled={!newProject.name.trim() || isCreating}
              className="flex-1"
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Create/Edit Modal */}
      <ProjectCreateEditModal
        isOpen={showCreateModal || !!editingProject}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
        mode={editingProject ? 'edit' : 'create'}
      />
    </div>
  )
}
