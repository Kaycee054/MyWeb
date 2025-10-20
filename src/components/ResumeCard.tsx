import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Printer } from 'lucide-react'
import { fileStorage } from '../lib/fileStorage'

interface ResumeCardProps {
  slug: string
  title: string
  description: string
  image?: string
  index: number
}

export function ResumeCard({ slug, title, description, image, index }: ResumeCardProps) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Try to get specific resume PDF from storage
      const storageResult = await fileStorage.listFiles('resume')
      
      if (storageResult.success && storageResult.files) {
        const resumeFile = storageResult.files.find(file => 
          file.name.includes(slug) || file.name.includes(title.toLowerCase().replace(/\s+/g, '-'))
        )
        
        if (resumeFile) {
          const downloadResult = await fileStorage.downloadFile(`resume/${resumeFile.name}`)
          if (downloadResult.success && downloadResult.url) {
            const link = document.createElement('a')
            link.href = downloadResult.url
            link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
          }
        }
      }
      
      // Fallback to general CV
      const link = document.createElement('a')
      link.href = '/Kelechi_Ekpemiro_CV2025.pdf'
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      // Final fallback
      const link = document.createElement('a')
      link.href = '/Kelechi_Ekpemiro_CV2025.pdf'
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/90 hover:scale-105 transition-all duration-300 group cursor-pointer border border-gray-700/50 hover:border-gray-600/50 shadow-xl"
    >
      <Link to={`/resume/${slug}`} className="block">
        <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={title}
           className="w-full h-full object-cover object-[center_20%] group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      
      <div className="p-8">
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gray-200 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed text-sm line-clamp-4">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white group-hover:text-gray-300 transition-colors">
            <span className="font-semibold">View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 px-2 py-1 rounded"
            title="Download Resume PDF"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
      </Link>
    </motion.div>
  )
}