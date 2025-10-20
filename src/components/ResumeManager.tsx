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
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Upload, X, Save, Calendar, Building, FileText, GraduationCap, Award, User, Briefcase, Star, CheckSquare, Square } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { RichTextEditor } from './RichTextEditor'
import { supabase } from '../lib/supabase'

interface Resume {
  id: string
  slug: string
  title: string
  description: string
  image_url: string | null
  intro_text: string | null
  education: any | null
  skills: string[] | null
  certifications: any | null
  created_at: string
  display_order: number
}

interface ResumeForm {
  slug: string
  title: string
  description: string
  image_url?: string
  intro_text?: string
  skills?: string
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[] | null
  is_featured: boolean
}

interface ExperienceForm {
  title: string
  company: string
  description: string
  start_date: string
  end_date?: string
  location?: string
  employment_type?: string
  achievements?: string
  is_visible: boolean
}

interface Experience {
  id: string
  resume_id: string
  title: string
  company: string
  description: string
  start_date: string
  end_date: string | null
  location: string | null
  employment_type: string | null
  achievements: string[] | null
  is_visible: boolean
}

interface SortableResumeCardProps {
  resume: Resume
  onEdit: (resume: Resume) => void
  onDelete: (id: string) => void
  renderIntroContent: (introText: string | null) => React.ReactNode
}

function SortableResumeCard({ resume, onEdit, onDelete, renderIntroContent }: SortableResumeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resume.id })

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
      className={`bg-gray-900 rounded-xl p-6 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:bg-gray-800'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{resume.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{resume.description}</p>
          
          {resume.intro_text && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Introduction</h4>
              <div className="text-gray-400 text-sm max-h-32 overflow-y-auto">
                {renderIntroContent(resume.intro_text)}
              </div>
            </div>
          )}
          
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {resume.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30"
                  >
                    {skill}
                  </span>
                ))}
                {resume.skills.length > 6 && (
                  <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded border border-gray-600/30">
                    +{resume.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onEdit(resume)
            }}
            className="text-gray-400 hover:text-white hover:bg-gray-700/20 p-2 rounded-lg transition-colors"
            title="Edit Resume"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onDelete(resume.id)
            }}
            className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [resumeProjects, setResumeProjects] = useState<string[]>([])
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResumeForm, setShowResumeForm] = useState(false)
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [showEducationForm, setShowEducationForm] = useState(false)
  const [showProjectSelector, setShowProjectSelector] = useState(false)
  const [editingResume, setEditingResume] = useState<Resume | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null)
  const [activeResume, setActiveResume] = useState<Resume | null>(null)
  const [resumeContent, setResumeContent] = useState<any>({ blocks: [] })
  const [educationData, setEducationData] = useState<any>({ entries: [] })
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)

  const resumeForm = useForm<ResumeForm>()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  const experienceForm = useForm<ExperienceForm>()

  const renderIntroContent = (introText: string | null) => {
    if (!introText) return null

    try {
      const content = JSON.parse(introText)
      if (!content?.blocks) return null

      return content.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={index} className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                {block.content}
              </p>
            )
          default:
            return null
        }
      })
    } catch (error) {
      return <p className="text-gray-300 mb-4 leading-relaxed">{introText}</p>
    }
  }

  useEffect(() => {
    fetchResumes()
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedResume) {
      fetchExperiences(selectedResume)
      fetchResumeProjects(selectedResume)
    }
  }, [selectedResume])

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setResumes(data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, technologies, is_featured')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchResumeProjects = async (resumeId: string) => {
    try {
      const { data, error } = await supabase
        .from('resume_projects')
        .select('project_id')
        .eq('resume_id', resumeId)

      if (error) throw error
      setResumeProjects(data?.map(rp => rp.project_id) || [])
    } catch (error) {
      console.error('Error fetching resume projects:', error)
    }
  }

  const fetchExperiences = async (resumeId: string) => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('resume_id', resumeId)
        .order('start_date', { ascending: false })

      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    }
  }

  const handleProjectSelection = async (projectId: string, selected: boolean) => {
    if (!selectedResume) return

    try {
      if (selected) {
        const { error } = await supabase
          .from('resume_projects')
          .insert({
            resume_id: selectedResume,
            project_id: projectId,
            order_index: resumeProjects.length
          })
        if (error) throw error
        setResumeProjects([...resumeProjects, projectId])
      } else {
        const { error } = await supabase
          .from('resume_projects')
          .delete()
          .eq('resume_id', selectedResume)
          .eq('project_id', projectId)
        if (error) throw error
        setResumeProjects(resumeProjects.filter(id => id !== projectId))
      }
    } catch (error) {
      console.error('Error updating resume projects:', error)
    }
  }

  const toggleExperienceVisibility = async (experienceId: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ is_visible: !isVisible })
        .eq('id', experienceId)

      if (error) throw error
      
      setExperiences(experiences.map(exp => 
        exp.id === experienceId ? { ...exp, is_visible: !isVisible } : exp
      ))
    } catch (error) {
      console.error('Error updating experience visibility:', error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const resume = resumes.find(r => r.id === active.id)
    setActiveResume(resume || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveResume(null)

    if (!over || active.id === over.id) return

    const oldIndex = resumes.findIndex(r => r.id === active.id)
    const newIndex = resumes.findIndex(r => r.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newResumes = arrayMove(resumes, oldIndex, newIndex)
    
    // Update local state immediately for UI responsiveness
    setResumes(newResumes)
    
    // Update display_order in database
    try {
      const updatePromises = newResumes.map((resume, index) => 
        supabase
          .from('resumes')
          .update({ display_order: index })
          .eq('id', resume.id)
      )
      
      await Promise.all(updatePromises)
      
      // Trigger navigation update by dispatching a custom event
      window.dispatchEvent(new CustomEvent('resumeOrderChanged'))
      
    } catch (error) {
      console.error('Error updating resume order:', error)
      // Revert local state on error
      fetchResumes()
    }
  }

  const handleCreateResume = async (data: ResumeForm) => {
    setSubmitting(true)
    try {
      // Get the next display order
      const maxOrder = Math.max(...resumes.map(r => r.display_order || 0), -1)
      
      const { data: newResume, error } = await supabase
        .from('resumes')
        .insert({
          slug: data.slug,
          title: data.title,
          description: data.description,
          image_url: data.image_url || null,
          intro_text: data.intro_text || null,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : null,
          display_order: maxOrder + 1
        })
        .select()
        .single()

      if (error) throw error

      setResumes([...resumes, newResume])
      setShowResumeForm(false)
      resumeForm.reset()
    } catch (error) {
      console.error('Error creating resume:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateExperience = async (data: ExperienceForm) => {
    if (!selectedResume) return
    
    setSubmitting(true)
    try {
      const { data: newExperience, error } = await supabase
        .from('experiences')
        .insert({
          resume_id: selectedResume,
          title: data.title,
          company: data.company,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date || null,
          location: data.location || null,
          employment_type: data.employment_type || null,
          achievements: data.achievements ? data.achievements.split('\n').filter(a => a.trim()) : null,
          is_visible: data.is_visible
        })
        .select()
        .single()

      if (error) throw error

      setExperiences([...experiences, newExperience])
      setShowExperienceForm(false)
      experienceForm.reset()
    } catch (error) {
      console.error('Error creating experience:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume)
    setResumeContent(resume.intro_text ? JSON.parse(resume.intro_text) : { blocks: [] })
    setEducationData(resume.education || { entries: [] })
    resumeForm.reset({
      slug: resume.slug,
      title: resume.title,
      description: resume.description,
      image_url: resume.image_url || '',
      intro_text: resume.intro_text || '',
      skills: resume.skills?.join(', ') || ''
    })
    setShowResumeForm(true)
  }

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience)
    experienceForm.reset({
      title: experience.title,
      company: experience.company,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      location: experience.location || '',
      employment_type: experience.employment_type || '',
      achievements: experience.achievements?.join('\n') || '',
      is_visible: experience.is_visible
    })
    setShowExperienceForm(true)
  }

  const handleUpdateResume = async (data: ResumeForm) => {
    if (!editingResume) return
    
    setSubmitting(true)
    try {
      const { data: updatedResume, error } = await supabase
        .from('resumes')
        .update({
          slug: data.slug,
          title: data.title,
          description: data.description,
          image_url: data.image_url || null,
          intro_text: JSON.stringify(resumeContent),
          education: educationData,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingResume.id)
        .select()
        .single()

      if (error) throw error

      setResumes(resumes.map(r => r.id === editingResume.id ? updatedResume : r))
      setShowResumeForm(false)
      setEditingResume(null)
      resumeForm.reset()
    } catch (error) {
      console.error('Error updating resume:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateExperience = async (data: ExperienceForm) => {
    if (!editingExperience) return
    
    setSubmitting(true)
    try {
      const { data: updatedExperience, error } = await supabase
        .from('experiences')
        .update({
          title: data.title,
          company: data.company,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date || null,
          location: data.location || null,
          employment_type: data.employment_type || null,
          achievements: data.achievements ? data.achievements.split('\n').filter(a => a.trim()) : null,
          is_visible: data.is_visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingExperience.id)
        .select()
        .single()

      if (error) throw error

      setExperiences(experiences.map(e => e.id === editingExperience.id ? updatedExperience : e))
      setShowExperienceForm(false)
      setEditingExperience(null)
      experienceForm.reset()
    } catch (error) {
      console.error('Error updating experience:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume? This will also delete all associated experiences.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)

      if (error) throw error

      setResumes(resumes.filter(r => r.id !== resumeId))
      if (selectedResume === resumeId) {
        setSelectedResume(null)
        setExperiences([])
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const handleDeleteExperience = async (experienceId: string) => {
    if (!selectedResume) return
    
    if (!confirm('Are you sure you want to delete this experience?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId)

      if (error) throw error

      setExperiences(experiences.filter(e => e.id !== experienceId))
      // Don't change selected resume - stay on current page
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleBulkDeleteExperiences = async () => {
    if (selectedExperiences.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedExperiences.length} experience(s)?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .in('id', selectedExperiences)

      if (error) throw error

      setExperiences(experiences.filter(e => !selectedExperiences.includes(e.id)))
      setSelectedExperiences([])
      setIsMultiSelectMode(false)
    } catch (error) {
      console.error('Error bulk deleting experiences:', error)
    }
  }

  const handleBulkToggleVisibility = async (visible: boolean) => {
    if (selectedExperiences.length === 0) return

    try {
      const { error } = await supabase
        .from('experiences')
        .update({ is_visible: visible })
        .in('id', selectedExperiences)

      if (error) throw error

      setExperiences(experiences.map(exp => 
        selectedExperiences.includes(exp.id) ? { ...exp, is_visible: visible } : exp
      ))
      setSelectedExperiences([])
      setIsMultiSelectMode(false)
    } catch (error) {
      console.error('Error bulk updating visibility:', error)
    }
  }

  const toggleExperienceSelection = (experienceId: string) => {
    setSelectedExperiences(prev => 
      prev.includes(experienceId) 
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    )
  }

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  // Sortable Resume Card Component
  function SortableResumeCard({ resume }: { resume: Resume }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: resume.id })

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
        className={`bg-gray-900 rounded-xl p-6 cursor-grab active:cursor-grabbing transition-all ${
          selectedResume === resume.id ? 'ring-2 ring-white' : 'hover:bg-gray-800'
        } ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}`}
        onClick={() => setSelectedResume(resume.id)}
      >
        {resume.image_url && (
          <img
            src={resume.image_url}
            alt={resume.title}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
        )}
        <h3 className="text-xl font-bold text-white mb-2">{resume.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{resume.description}</p>
        
        {resume.skills && resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resume.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30"
              >
                {skill}
              </span>
            ))}
            {resume.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded border border-gray-600/30">
                +{resume.skills.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date(resume.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleEditResume(resume)
              }}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="Edit Resume"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteResume(resume.id)
              }}
              className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
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
      {/* Resumes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Resumes</h2>
          <button
            onClick={() => setShowResumeForm(true)}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resume</span>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={resumes.map(r => r.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <SortableResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEditResume}
                  onDelete={handleDeleteResume}
                  renderIntroContent={renderIntroContent}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeResume ? (
              <div className="bg-gray-900 rounded-xl p-6 opacity-90 rotate-2 scale-105 cursor-grabbing">
                <h3 className="text-xl font-bold text-white mb-2">{activeResume.title}</h3>
                <p className="text-gray-400 text-sm">{activeResume.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
          {/* Multi-Select Actions */}
          {isMultiSelectMode && selectedExperiences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-medium">
                  {selectedExperiences.length} experience(s) selected
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleBulkToggleVisibility(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Show All</span>
                  </button>
                  <button
                    onClick={() => handleBulkToggleVisibility(false)}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Hide All</span>
                  </button>
                  <button
                    onClick={handleBulkDeleteExperiences}
                    className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete All</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {/* Selected Projects */}
          {resumeProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Featured Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects
                  .filter(project => resumeProjects.includes(project.id))
                  .map((project) => (
                    <div key={project.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-2">{project.title}</h4>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleProjectSelection(project.id, false)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors ml-2"
                          title="Remove from resume"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

      {/* Experiences Section */}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Work Experience</h3>
            {experiences.map((experience) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900 rounded-xl overflow-hidden transition-all ${
                  selectedExperiences.includes(experience.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {isMultiSelectMode && (
                      <button
                        onClick={() => toggleExperienceSelection(experience.id)}
                        className="mr-4 mt-1 text-gray-400 hover:text-white transition-colors"
                      >
                        {selectedExperiences.includes(experience.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{experience.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          experience.is_visible 
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                            : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                        }`}>
                          {experience.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{experience.company}</span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{experience.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(experience.start_date).toLocaleDateString()} - {
                              experience.end_date ? new Date(experience.end_date).toLocaleDateString() : 'Present'
                            }
                          </span>
                        </div>
                        {experience.employment_type && (
                          <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded border border-gray-600/30">
                            {experience.employment_type}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-gray-300 text-sm">
                        {expandedExperience === experience.id ? (
                          <div>
                            <p className="mb-4 leading-relaxed">{experience.description}</p>
                            {experience.achievements && experience.achievements.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-white font-semibold mb-2">Key Achievements:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {experience.achievements.map((achievement, index) => (
                                    <li key={index} className="text-gray-300">{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <button
                              onClick={() => setExpandedExperience(null)}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                            >
                              Show less
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="line-clamp-2 mb-2">{experience.description}</p>
                            <button
                              onClick={() => setExpandedExperience(experience.id)}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                            >
                              Read more
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => toggleExperienceVisibility(experience.id, experience.is_visible)}
                        className={`p-2 rounded-lg transition-colors ${
                          experience.is_visible
                            ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/20'
                        }`}
                        title={experience.is_visible ? 'Hide from public' : 'Show to public'}
                      >
                        {experience.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEditExperience(experience)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700/20 p-2 rounded-lg transition-colors"
                        title="Edit Experience"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExperience(experience.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-white hover:bg-gray-700/20 p-2 rounded-lg transition-colors"
                        title="Manage Files"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Form Modal */}
      {showResumeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingResume ? 'Edit Resume' : 'Add New Resume'}
              </h3>
              <button
                onClick={() => {
                  setShowResumeForm(false)
                  setEditingResume(null)
                  resumeForm.reset()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={resumeForm.handleSubmit(editingResume ? handleUpdateResume : handleCreateResume)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  {...resumeForm.register('slug', { 
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Slug must contain only lowercase letters, numbers, and hyphens'
                    }
                  })}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="e.g., project-management"
                />
                {resumeForm.formState.errors.slug && (
                  <p className="mt-1 text-sm text-red-400">{resumeForm.formState.errors.slug.message}</p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  {...resumeForm.register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="e.g., Project Management"
                />
                {resumeForm.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-400">{resumeForm.formState.errors.title.message}</p>
                )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...resumeForm.register('description', { required: 'Description is required' })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  placeholder="Brief description of this expertise area..."
                />
                {resumeForm.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-400">{resumeForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  {...resumeForm.register('image_url')}
                  type="url"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    {...resumeForm.register('skills')}
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="e.g., Project Management, Agile, Risk Assessment"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Introduction / Summary
                </label>
                <RichTextEditor
                  content={resumeContent}
                  onChange={setResumeContent}
                  placeholder="Add a professional summary, introduction, or overview..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResumeForm(false)
                    setEditingResume(null)
                    resumeForm.reset()
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
                  {submitting ? (editingResume ? 'Updating...' : 'Creating...') : (editingResume ? 'Update Resume' : 'Create Resume')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Experience Form Modal */}
      {showExperienceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                onClick={() => {
                  setShowExperienceForm(false)
                  setEditingExperience(null)
                  experienceForm.reset()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={experienceForm.handleSubmit(editingExperience ? handleUpdateExperience : handleCreateExperience)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  {...experienceForm.register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="e.g., Senior Project Manager"
                />
                {experienceForm.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-400">{experienceForm.formState.errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  {...experienceForm.register('company', { required: 'Company is required' })}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="e.g., Tech Solutions Inc."
                />
                {experienceForm.formState.errors.company && (
                  <p className="mt-1 text-sm text-red-400">{experienceForm.formState.errors.company.message}</p>
                )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    {...experienceForm.register('location')}
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...experienceForm.register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  placeholder="Describe your role, achievements, and responsibilities..."
                />
                {experienceForm.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-400">{experienceForm.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Achievements (one per line)
                </label>
                <textarea
                  {...experienceForm.register('achievements')}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  placeholder="• Increased team productivity by 40%&#10;• Led successful migration of legacy systems&#10;• Managed $2M+ project budgets"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    {...experienceForm.register('start_date', { required: 'Start date is required' })}
                    type="date"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  {experienceForm.formState.errors.start_date && (
                    <p className="mt-1 text-sm text-red-400">{experienceForm.formState.errors.start_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    {...experienceForm.register('end_date')}
                    type="date"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employment Type
                </label>
                <select
                  {...experienceForm.register('employment_type')}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  {...experienceForm.register('is_visible')}
                  type="checkbox"
                  id="is_visible"
                  defaultChecked={true}
                  className="w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white focus:ring-2"
                />
                <label htmlFor="is_visible" className="text-sm text-gray-300">
                  Visible on public resume
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowExperienceForm(false)
                    setEditingExperience(null)
                    experienceForm.reset()
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
                  {submitting ? (editingExperience ? 'Updating...' : 'Creating...') : (editingExperience ? 'Update Experience' : 'Create Experience')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Project Selector Modal */}
      {showProjectSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Select Projects for Resume</h3>
              <button
                onClick={() => setShowProjectSelector(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    resumeProjects.includes(project.id)
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                  onClick={() => handleProjectSelection(project.id, !resumeProjects.includes(project.id))}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-semibold">{project.title}</h4>
                    <div className="flex items-center space-x-2">
                      {project.is_featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      <input
                        type="checkbox"
                        checked={resumeProjects.includes(project.id)}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => setShowProjectSelector(false)}
                className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}