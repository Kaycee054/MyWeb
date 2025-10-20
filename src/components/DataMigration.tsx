import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, AlertCircle, Loader, FileText, Download } from 'lucide-react'
import { fileStorage } from '../lib/fileStorage'
import { sampleResumes, sampleProjects, sampleExperiences } from '../data/sampleData'
import { supabase } from '../lib/supabase'

export function DataMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    resumes: 'pending' | 'loading' | 'success' | 'error'
    projects: 'pending' | 'loading' | 'success' | 'error'
    experiences: 'pending' | 'loading' | 'success' | 'error'
  }>({
    resumes: 'pending',
    projects: 'pending',
    experiences: 'pending'
  })
  
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)

  const migrateResumes = async () => {
    setMigrationStatus(prev => ({ ...prev, resumes: 'loading' }))
    try {
      for (const resume of sampleResumes) {
        // Check if resume already exists
        const { data: existing } = await supabase
          .from('resumes')
          .select('id')
          .eq('slug', resume.slug)
          .single()

        if (existing) {
          // Update existing resume
          const { error } = await supabase
            .from('resumes')
            .update(resume)
            .eq('slug', resume.slug)
          if (error) throw error
        } else {
          // Insert new resume
          const { error } = await supabase
            .from('resumes')
            .insert(resume)
          if (error) throw error
        }
      }
      setMigrationStatus(prev => ({ ...prev, resumes: 'success' }))
    } catch (err: any) {
      console.error('Error migrating resumes:', err)
      setError(err.message)
      setMigrationStatus(prev => ({ ...prev, resumes: 'error' }))
    }
  }

  const migrateProjects = async () => {
    setMigrationStatus(prev => ({ ...prev, projects: 'loading' }))
    try {
      for (const project of sampleProjects) {
        const { error } = await supabase
          .from('projects')
          .upsert(project)
        
        if (error) throw error
      }
      setMigrationStatus(prev => ({ ...prev, projects: 'success' }))
    } catch (err: any) {
      console.error('Error migrating projects:', err)
      setError(err.message)
      setMigrationStatus(prev => ({ ...prev, projects: 'error' }))
    }
  }

  const migrateExperiences = async () => {
    setMigrationStatus(prev => ({ ...prev, experiences: 'loading' }))
    try {
      // First get resume IDs
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id, slug')

      if (!resumes) throw new Error('No resumes found')

      const resumeMap = resumes.reduce((acc: any, resume) => {
        acc[resume.slug] = resume.id
        return acc
      }, {})

      for (const experience of sampleExperiences) {
        const resumeId = resumeMap[experience.resume_type]
        if (!resumeId) continue

        const { resume_type, ...experienceData } = experience
        const { error } = await supabase
          .from('experiences')
          .upsert({
            ...experienceData,
            resume_id: resumeId
          })
        
        if (error) throw error
      }
      setMigrationStatus(prev => ({ ...prev, experiences: 'success' }))
    } catch (err: any) {
      console.error('Error migrating experiences:', err)
      setError(err.message)
      setMigrationStatus(prev => ({ ...prev, experiences: 'error' }))
    }
  }

  const migrateAll = async () => {
    setError(null)
    await migrateResumes()
    await migrateProjects()
    await migrateExperiences()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setIsProcessingFile(true)

    try {
      const result = await fileStorage.uploadFile(file, 'cv')
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setError(null)
    } catch (err: any) {
      console.error('Error uploading file:', err)
      setError(`File upload failed: ${err.message || 'Unknown error'}`)
    } finally {
      setIsProcessingFile(false)
    }
  }

  const downloadSampleCV = () => {
    const link = document.createElement('a')
    link.href = '/Kelechi_Ekpemiro_CV2025.pdf'
    link.download = 'Kelechi_Ekpemiro_CV2025.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader className="w-5 h-5 animate-spin text-blue-400" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Upload className="w-5 h-5 text-gray-400" />
    }
  }

  const allComplete = Object.values(migrationStatus).every(status => status === 'success')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Import Your CV Data</h3>
        <p className="text-gray-400">
          Import your resume content, projects, and experience from your CV into the platform. You can also upload an updated CV file.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">Upload Updated CV</h4>
          <p className="text-gray-400 text-sm mb-4">
            Upload your latest CV file (PDF, DOC, DOCX) to keep your content current
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessingFile}
              />
              {isProcessingFile ? (
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </div>
              )}
            </label>
            
            <button
              onClick={downloadSampleCV}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Current CV</span>
            </button>
          </div>
          
          {uploadedFile && (
            <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Migration Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(migrationStatus.resumes)}
            <div>
              <h4 className="text-white font-medium">Resume Profiles</h4>
              <p className="text-gray-400 text-sm">3 resume types: IT Project Manager, Media Producer, Business Development</p>
            </div>
          </div>
          <button
            onClick={migrateResumes}
            disabled={migrationStatus.resumes === 'loading' || migrationStatus.resumes === 'success'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationStatus.resumes === 'success' ? 'Imported' : 'Import'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(migrationStatus.projects)}
            <div>
              <h4 className="text-white font-medium">Projects Portfolio</h4>
              <p className="text-gray-400 text-sm">6 projects: StraightenUp AI, ResQ, QuadInspect, Focus Films, SOL, IoT Robot</p>
            </div>
          </div>
          <button
            onClick={migrateProjects}
            disabled={migrationStatus.projects === 'loading' || migrationStatus.projects === 'success'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationStatus.projects === 'success' ? 'Imported' : 'Import'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(migrationStatus.experiences)}
            <div>
              <h4 className="text-white font-medium">Work Experience</h4>
              <p className="text-gray-400 text-sm">6 positions across research, media, and business development</p>
            </div>
          </div>
          <button
            onClick={migrateExperiences}
            disabled={migrationStatus.experiences === 'loading' || migrationStatus.experiences === 'success'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrationStatus.experiences === 'success' ? 'Imported' : 'Import'}
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={migrateAll}
          disabled={allComplete}
          className="flex-1 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {allComplete ? 'All Data Imported!' : 'Import All Data'}
        </button>
      </div>

      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h4 className="text-green-400 font-semibold">Migration Complete!</h4>
              <p className="text-green-300 text-sm">
                Your CV data has been successfully imported. You can now manage your resumes, projects, and experiences through the admin dashboard.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}