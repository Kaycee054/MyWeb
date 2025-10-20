import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Plus, Settings, MessageSquare, Briefcase, BarChart3, FolderOpen, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ResumeManager } from './ResumeManager'
import { ProjectManager } from './ProjectManager'
import { KanbanBoard } from './KanbanBoard'
import { Analytics } from './Analytics'
import { DataMigration } from './DataMigration'

type TabType = 'import' | 'resumes' | 'projects' | 'messages' | 'analytics'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('import')
  const { signOut } = useAuth()

  const tabs = [
    { id: 'import' as TabType, label: 'Import CV', icon: Upload },
    { id: 'resumes' as TabType, label: 'Resumes', icon: Briefcase },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderOpen },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      // Don't redirect, let the auth context handle navigation
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'import' && <DataMigration />}
        {activeTab === 'resumes' && <ResumeManager />}
        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'messages' && <KanbanBoard />}
        {activeTab === 'analytics' && <Analytics />}
      </motion.div>
    </div>
  )
}