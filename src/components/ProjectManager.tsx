import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar, Tag, X, Save, Image, Video, FileText, CheckSquare, Square } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { RichTextEditor } from './RichTextEditor'
import { supabase } from '../lib/supabase'

interface Project {
  id: string
  title: string
  description: string
  content: any
  technologies: string[] | null
  start_date: string
  end_date: string | null
  status: 'completed' | 'in_progress' | 'planned'
  featured_image: string | null
  gallery: string[] | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

interface ProjectForm {
  title: string
  description: string
  technologies: string
  start_date: string
  end_date?: string
  status: 'completed' | 'in_progress' | 'planned'
  featured_image?: string
  is_featured: boolean
}

interface SortableProjectCardProps {
  project: Project
  isMultiSelectMode: boolean
  selectedProjects: string[]
  expandedProject: string | null
  onToggleSelection: (id: string) => void
  onToggleFeatured: (id: string, isFeatured: boolean) => void
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onExpandToggle: (id: string | null) => void
  renderProjectContent: (content: any) => React.ReactNode
  getStatusColor: (status: string) => string
}

function SortableProjectCard({
  project,
  isMultiSelectMode,
  selectedProjects,
  expandedProject,
  onToggleSelection,
  onToggleFeatured,
  onEdit,
  onDelete,
  onExpandToggle,
  renderProjectContent,
  getStatusColor
}: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
        selectedProjects.includes(project.id) ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:bg-gray-800'}`}
    >
      {isMultiSelectMode && (
        <div className="p-4 pb-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelection(project.id)
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {selectedProjects.includes(project.id) ? (
              <CheckSquare className="w-5 h-5 text-blue-500" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
      {project.featured_image && (
        <img
          src={project.featured_image}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              {project.is_featured && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(project.start_date).toLocaleDateString()} - {
                    project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'
                  }
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{project.description}</p>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {expandedProject === project.id && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-white font-semibold mb-3">Project Details</h4>
                <div className="max-h-64 overflow-y-auto">
                  {renderProjectContent(project.content)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onExpandToggle(null)
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-3"
                >
                  Show less
                </button>
              </div>
            )}

            {!expandedProject && project.content?.blocks?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onExpandToggle(project.id)
                }}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View project details
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFeatured(project.id, project.is_featured)
              }}
              className={`p-2 rounded-lg transition-colors ${
                project.is_featured
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/20'
              }`}
              title={project.is_featured ? 'Remove from featured' : 'Add to featured'}
            >
              <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onEdit(project)
              }}
              className="text-gray-400 hover:text-white hover:bg-gray-700/20 p-2 rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onDelete(project.id)
              }}
              className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [projectContent, setProjectContent] = useState<any>({ blocks: [] })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const projectForm = useForm<ProjectForm>()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const project = projects.find(p => p.id === active.id)
    setActiveProject(project || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)

    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex(p => p.id === active.id)
    const newIndex = projects.findIndex(p => p.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newProjects = arrayMove(projects, oldIndex, newIndex)
      setProjects(newProjects)

      // Update order in database
      try {
        const updates = newProjects.map((project, index) => ({
          id: project.id,
          display_order: index
        }))

        for (const update of updates) {
          await supabase
            .from('projects')
            .update({ display_order: update.display_order })
            .eq('id', update.id)
        }
      } catch (error) {
        console.error('Error updating project order:', error)
        // Revert on error
        setProjects(projects)
      }
    }
  }

  const handleCreateProject = async (data: ProjectForm) => {
    setSubmitting(true)
    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description,
          content: projectContent,
          technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : null,
          start_date: data.start_date,
          end_date: data.end_date || null,
          status: data.status,
          featured_image: data.featured_image || null,
          is_featured: data.is_featured
        })
        .select()
        .single()

      if (error) throw error

      setProjects([newProject, ...projects])
      setShowProjectForm(false)
      setProjectContent({ blocks: [] })
      projectForm.reset()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectContent(project.content || { blocks: [] })
    projectForm.reset({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      start_date: project.start_date,
      end_date: project.end_date || '',
      status: project.status,
      featured_image: project.featured_image || '',
      is_featured: project.is_featured
    })
    setShowProjectForm(true)
  }

  const handleUpdateProject = async (data: ProjectForm) => {
    if (!editingProject) return
    
    setSubmitting(true)
    try {
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update({
          title: data.title,
          description: data.description,
          content: projectContent,
          technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : null,
          start_date: data.start_date,
          end_date: data.end_date || null,
          status: data.status,
          featured_image: data.featured_image || null,
          is_featured: data.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProject.id)
        .select()
        .single()

      if (error) throw error

      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p))
      setShowProjectForm(false)
      setEditingProject(null)
      setProjectContent({ blocks: [] })
      projectForm.reset()
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      setProjects(projects.filter(p => p.id !== projectId))
      // Stay on current page, don't navigate away
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleBulkDeleteProjects = async () => {
    if (selectedProjects.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedProjects.length} project(s)?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', selectedProjects)

      if (error) throw error

      setProjects(projects.filter(p => !selectedProjects.includes(p.id)))
      setSelectedProjects([])
      setIsMultiSelectMode(false)
    } catch (error) {
      console.error('Error bulk deleting projects:', error)
    }
  }

  const handleBulkToggleFeatured = async (featured: boolean) => {
    if (selectedProjects.length === 0) return

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: featured })
        .in('id', selectedProjects)

      if (error) throw error

      setProjects(projects.map(project => 
        selectedProjects.includes(project.id) ? { ...project, is_featured: featured } : project
      ))
      setSelectedProjects([])
      setIsMultiSelectMode(false)
    } catch (error) {
      console.error('Error bulk updating featured status:', error)
    }
  }

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }
  
  const toggleFeatured = async (projectId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: !isFeatured })
        .eq('id', projectId)

      if (error) throw error
      
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, is_featured: !isFeatured } : project
      ))
    } catch (error) {
      console.error('Error updating project featured status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-500/30'
      case 'in_progress':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/30'
      case 'planned':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-700/30 text-gray-400 border-gray-600/30'
    }
  }

  const renderProjectContent = (content: any) => {
    if (!content?.blocks) return null

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case 'text':
          return (
            <p key={index} className="text-gray-300 mb-3 whitespace-pre-wrap">
              {block.content}
            </p>
          )
        case 'image':
          return (
            <div key={index} className="mb-4">
              <img
                src={block.content.url}
                alt={block.content.alt || ''}
                className="w-full max-h-64 object-cover rounded-lg"
              />
              {block.content.caption && (
                <p className="text-gray-400 text-sm mt-2 italic">{block.content.caption}</p>
              )}
            </div>
          )
        case 'youtube':
          const youtubeId = block.content.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
          return youtubeId ? (
            <div key={index} className="mb-4">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
              {block.content.caption && (
                <p className="text-gray-400 text-sm mt-2 italic">{block.content.caption}</p>
              )}
            </div>
          ) : null
        case 'list':
          const ListComponent = block.content.ordered ? 'ol' : 'ul'
          return (
            <ListComponent key={index} className={`mb-4 ${block.content.ordered ? 'list-decimal' : 'list-disc'} list-inside text-gray-300`}>
              {block.content.items?.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="mb-1">{item}</li>
              ))}
            </ListComponent>
          )
        default:
          return null
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsMultiSelectMode(!isMultiSelectMode)
                setSelectedProjects([])
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isMultiSelectMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isMultiSelectMode ? 'Exit Multi-Select' : 'Multi-Select'}</span>
            </button>
            <button
              onClick={() => setShowProjectForm(true)}
              className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Multi-Select Actions */}
        {isMultiSelectMode && selectedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-medium">
                {selectedProjects.length} project(s) selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkToggleFeatured(true)}
                  className="flex items-center space-x-2 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Feature All</span>
                </button>
                <button
                  onClick={() => handleBulkToggleFeatured(false)}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Unfeature All</span>
                </button>
                <button
                  onClick={handleBulkDeleteProjects}
                  className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  isMultiSelectMode={isMultiSelectMode}
                  selectedProjects={selectedProjects}
                  expandedProject={expandedProject}
                  onToggleSelection={toggleProjectSelection}
                  onToggleFeatured={toggleFeatured}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onExpandToggle={setExpandedProject}
                  renderProjectContent={renderProjectContent}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeProject ? (
              <div className="bg-gray-900 rounded-xl overflow-hidden opacity-90 rotate-2 scale-105 cursor-grabbing">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{activeProject.title}</h3>
                  <p className="text-gray-300 text-sm">{activeProject.description}</p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowProjectForm(false)
                  setEditingProject(null)
                  setProjectContent({ blocks: [] })
                  projectForm.reset()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={projectForm.handleSubmit(editingProject ? handleUpdateProject : handleCreateProject)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title
                  </label>
                  <input
                    {...projectForm.register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="e.g., E-commerce Platform"
                  />
                  {projectForm.formState.errors.title && (
                    <p className="mt-1 text-sm text-red-400">{projectForm.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    {...projectForm.register('status')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  >
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...projectForm.register('description', { required: 'Description is required' })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  placeholder="Brief description of the project..."
                />
                {projectForm.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-400">{projectForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    {...projectForm.register('start_date', { required: 'Start date is required' })}
                    type="date"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  {projectForm.formState.errors.start_date && (
                    <p className="mt-1 text-sm text-red-400">{projectForm.formState.errors.start_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    {...projectForm.register('end_date')}
                    type="date"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  {...projectForm.register('technologies')}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image URL (Optional)
                </label>
                <input
                  {...projectForm.register('featured_image')}
                  type="url"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  {...projectForm.register('is_featured')}
                  type="checkbox"
                  id="is_featured"
                  className="w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white focus:ring-2"
                />
                <label htmlFor="is_featured" className="text-sm text-gray-300">
                  Featured project
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Content
                </label>
                <RichTextEditor
                  content={projectContent}
                  onChange={setProjectContent}
                  placeholder="Add detailed project information, images, videos, etc..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false)
                    setEditingProject(null)
                    setProjectContent({ blocks: [] })
                    projectForm.reset()
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {submitting ? (editingProject ? 'Updating...' : 'Creating...') : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}