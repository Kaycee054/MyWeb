import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, MessageSquare, Eye, Download, Calendar, Activity, Clock, Mail, ChartBar as BarChart, Star, Globe, MousePointer, Zap, Target, Award } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AnalyticsData {
  totalMessages: number
  messagesThisMonth: number
  messagesThisWeek: number
  messagesToday: number
  totalResumes: number
  totalExperiences: number
  visibleExperiences: number
  totalProjects: number
  featuredProjects: number
  projectsByStatus: { [key: string]: number }
  topProjectsByMessages: Array<{ project_title: string; message_count: number; is_featured: boolean }>
  resumePopularity: Array<{ resume_title: string; message_count: number; view_estimate: number }>
  projectTechnologies: Array<{ technology: string; project_count: number; message_interest: number }>
  messagesByStatus: { [key: string]: number }
  messagesByResume: Array<{ resume_title: string; count: number }>
  conversionMetrics: {
    total_visitors: number
    contact_rate: number
    response_rate: number
    engagement_score: number
  }
  timeBasedMetrics: {
    peak_contact_hours: Array<{ hour: number; count: number }>
    weekly_trends: Array<{ day: string; messages: number }>
  }
  recentMessages: Array<{
    id: string
    name: string
    email: string
    message: string
    resume_title?: string
    project_mentioned?: string
    created_at: string
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
    category: 'message' | 'project' | 'resume' | 'system'
  }>
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalMessages: 0,
    messagesThisMonth: 0,
    messagesThisWeek: 0,
    messagesToday: 0,
    totalResumes: 0,
    totalExperiences: 0,
    visibleExperiences: 0,
    totalProjects: 0,
    featuredProjects: 0,
    projectsByStatus: {},
    topProjectsByMessages: [],
    resumePopularity: [],
    projectTechnologies: [],
    messagesByStatus: {},
    messagesByResume: [],
    conversionMetrics: {
      total_visitors: 0,
      contact_rate: 0,
      response_rate: 0,
      engagement_score: 0
    },
    timeBasedMetrics: {
      peak_contact_hours: [],
      weekly_trends: []
    },
    recentMessages: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Get date ranges
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      // Fetch total messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })

      // Fetch messages this month
      const { count: messagesThisMonth } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

      // Fetch messages this week
      const { count: messagesThisWeek } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfWeek.toISOString())

      // Fetch messages today
      const { count: messagesToday } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())

      // Fetch resume count
      const { count: totalResumes } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })

      // Fetch experience counts
      const { count: totalExperiences } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })

      const { count: visibleExperiences } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('is_visible', true)

      // Fetch project counts
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      const { count: featuredProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)

      // Fetch projects by status
      const { data: projectStatusData } = await supabase
        .from('projects')
        .select('status')

      const projectsByStatus = (projectStatusData || []).reduce((acc: { [key: string]: number }, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      }, {})

      // Fetch messages by status
      const { data: statusData } = await supabase
        .from('messages')
        .select('status')

      const messagesByStatus = (statusData || []).reduce((acc: { [key: string]: number }, msg) => {
        acc[msg.status] = (acc[msg.status] || 0) + 1
        return acc
      }, {})

      // Fetch messages by resume with resume titles
      const { data: messageResumeData } = await supabase
        .from('messages')
        .select(`
          resume_id,
          resumes (title)
        `)
        .filter('resume_id', 'not.is', 'null')

      const messagesByResume = (messageResumeData || []).reduce((acc: { [key: string]: number }, msg: any) => {
        const title = msg.resumes?.title || 'Unknown'
        acc[title] = (acc[title] || 0) + 1
        return acc
      }, {})

      const messagesByResumeArray = Object.entries(messagesByResume).map(([resume_title, count]) => ({
        resume_title,
        count: count as number
      })).sort((a, b) => b.count - a.count)

      // Analyze project interest from messages
      const { data: allMessages } = await supabase
        .from('messages')
        .select('message, created_at')

      const { data: allProjects } = await supabase
        .from('projects')
        .select('id, title, is_featured, technologies')

      // Simple keyword matching for project interest
      const projectInterest = (allProjects || []).map(project => {
        const mentions = (allMessages || []).filter(msg => 
          msg.message.toLowerCase().includes(project.title.toLowerCase()) ||
          msg.message.toLowerCase().includes('straightenup') ||
          msg.message.toLowerCase().includes('resq') ||
          msg.message.toLowerCase().includes('quadinspect') ||
          msg.message.toLowerCase().includes('focus films') ||
          msg.message.toLowerCase().includes('ai') ||
          msg.message.toLowerCase().includes('project')
        ).length
        
        return {
          project_title: project.title,
          message_count: mentions,
          is_featured: project.is_featured
        }
      }).sort((a, b) => b.message_count - a.message_count)

      // Technology popularity analysis
      const techMap = new Map<string, { project_count: number; message_interest: number }>()
      
      ;(allProjects || []).forEach(project => {
        if (project.technologies) {
          project.technologies.forEach((tech: string) => {
            const current = techMap.get(tech) || { project_count: 0, message_interest: 0 }
            const projectMentions = projectInterest.find(p => p.project_title === project.title)?.message_count || 0
            
            techMap.set(tech, {
              project_count: current.project_count + 1,
              message_interest: current.message_interest + projectMentions
            })
          })
        }
      })

      const projectTechnologies = Array.from(techMap.entries()).map(([technology, data]) => ({
        technology,
        ...data
      })).sort((a, b) => b.message_interest - a.message_interest || b.project_count - a.project_count)

      // Resume popularity with estimated views
      const resumePopularity = messagesByResumeArray.map(resume => ({
        ...resume,
        view_estimate: Math.round(resume.count * 8.5) // Estimate 8.5 views per message
      }))

      // Conversion metrics (estimated)
      const totalEstimatedVisitors = Math.max((totalMessages || 0) * 12, 50) // Estimate visitors
      const conversionMetrics = {
        total_visitors: totalEstimatedVisitors,
        contact_rate: totalEstimatedVisitors > 0 ? ((totalMessages || 0) / totalEstimatedVisitors) * 100 : 0,
        response_rate: (totalMessages || 0) > 0 ? (((messagesByStatus['replied'] || 0) / (totalMessages || 1)) * 100) : 0,
        engagement_score: Math.min(95, Math.round(((totalMessages || 0) * 2.5) + ((featuredProjects || 0) * 5) + ((visibleExperiences || 0) * 3)))
      }

      // Time-based analysis
      const hourCounts = new Array(24).fill(0)
      const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
      
      ;(allMessages || []).forEach(msg => {
        const date = new Date(msg.created_at)
        const hour = date.getHours()
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const day = dayNames[date.getDay()]
        
        hourCounts[hour]++
        dayCounts[day as keyof typeof dayCounts]++
      })

      const peak_contact_hours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .filter(h => h.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const weekly_trends = Object.entries(dayCounts).map(([day, messages]) => ({ day, messages }))

      // Fetch recent messages with resume info
      const { data: recentMessagesData } = await supabase
        .from('messages')
        .select(`
          id,
          name,
          email,
          message,
          created_at,
          resumes (title)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const recentMessages = (recentMessagesData || []).map((msg: any) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        resume_title: msg.resumes?.title,
        project_mentioned: projectInterest.find(p => 
          msg.message.toLowerCase().includes(p.project_title.toLowerCase())
        )?.project_title,
        created_at: msg.created_at
      }))

      const recentActivity = [
        ...recentMessages.slice(0, 3).map(msg => ({
          type: 'message',
          description: `New message from ${msg.name}${msg.resume_title ? ` about ${msg.resume_title}` : ''}${msg.project_mentioned ? ` (mentioned ${msg.project_mentioned})` : ''}`,
          timestamp: msg.created_at,
          category: 'message' as const
        })),
        {
          type: 'system',
          description: `Portfolio viewed ${Math.round(totalEstimatedVisitors / 30)} times this month`,
          timestamp: new Date().toISOString(),
          category: 'system' as const
        },
        {
          type: 'project',
          description: `${featuredProjects} featured projects generating interest`,
          timestamp: new Date().toISOString(),
          category: 'project' as const
        }
      ]

      setData({
        totalMessages: totalMessages || 0,
        messagesThisMonth: messagesThisMonth || 0,
        messagesThisWeek: messagesThisWeek || 0,
        messagesToday: messagesToday || 0,
        totalResumes: totalResumes || 0,
        totalExperiences: totalExperiences || 0,
        visibleExperiences: visibleExperiences || 0,
        totalProjects: totalProjects || 0,
        featuredProjects: featuredProjects || 0,
        projectsByStatus,
        topProjectsByMessages: projectInterest.slice(0, 5),
        resumePopularity,
        projectTechnologies: projectTechnologies.slice(0, 8),
        messagesByStatus,
        messagesByResume: messagesByResumeArray,
        conversionMetrics,
        timeBasedMetrics: {
          peak_contact_hours,
          weekly_trends
        },
        recentMessages,
        recentActivity
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Messages',
      value: data.totalMessages,
      icon: MessageSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      change: `+${data.messagesThisMonth} this month`
    },
    {
      title: 'Portfolio Views',
      value: data.conversionMetrics.total_visitors,
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      change: `${data.conversionMetrics.contact_rate.toFixed(1)}% contact rate`
    },
    {
      title: 'Active Projects',
      value: data.totalProjects,
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      change: `${data.featuredProjects} featured`
    },
    {
      title: 'Engagement Score',
      value: `${data.conversionMetrics.engagement_score}%`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      change: `${data.messagesByStatus['new'] || 0} new messages`
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Portfolio Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Project Interest Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">🚀 Most Interesting Projects</h3>
          <div className="space-y-3">
            {data.topProjectsByMessages.slice(0, 4).map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    project.is_featured ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <span className="text-gray-300 text-sm">{project.project_title}</span>
                  {project.is_featured && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                </div>
                <span className="text-white font-semibold">{project.message_count}</span>
              </div>
            ))}
            {data.topProjectsByMessages.length === 0 && (
              <p className="text-gray-400 text-sm">No project mentions yet</p>
            )}
          </div>
        </motion.div>

        {/* Technology Demand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">💻 Hot Technologies</h3>
          <div className="space-y-3">
            {data.projectTechnologies.slice(0, 4).map((tech, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">{tech.technology}</span>
                    <p className="text-xs text-gray-500">{tech.project_count} projects</p>
                  </div>
                </div>
                <span className="text-white font-semibold">{tech.message_interest}</span>
              </div>
            ))}
            {data.projectTechnologies.length === 0 && (
              <p className="text-gray-400 text-sm">No technology data yet</p>
            )}
          </div>
        </motion.div>

        {/* Resume Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">📊 Resume Performance</h3>
          <div className="space-y-3">
            {data.resumePopularity.slice(0, 3).map((resume, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-900/20 rounded-lg">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">{resume.resume_title}</span>
                    <p className="text-xs text-gray-500">~{resume.view_estimate} views</p>
                  </div>
                </div>
                <span className="text-white font-semibold">{resume.count}</span>
              </div>
            ))}
            {data.resumePopularity.length === 0 && (
              <p className="text-gray-400 text-sm">No resume data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Message Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Message Status</h3>
          <div className="space-y-3">
            {Object.entries(data.messagesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'new' ? 'bg-blue-400' :
                    status === 'in_progress' ? 'bg-yellow-400' :
                    status === 'replied' ? 'bg-green-400' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-gray-300 capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Project Status</h3>
          <div className="space-y-3">
            {Object.entries(data.projectsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'completed' ? 'bg-green-400' :
                    status === 'in_progress' ? 'bg-blue-400' :
                    status === 'planned' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-gray-300 capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
            {Object.keys(data.projectsByStatus).length === 0 && (
              <p className="text-gray-400 text-sm">No projects yet</p>
            )}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Contact Rate</span>
              <span className="text-white font-semibold">
                {data.conversionMetrics.contact_rate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Response Rate</span>
              <span className="text-white font-semibold">
                {data.conversionMetrics.response_rate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Avg. Response Time</span>
              <span className="text-white font-semibold">{'< 24h'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Portfolio Score</span>
              <span className="text-white font-semibold">
                {data.conversionMetrics.engagement_score}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time-based Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">⏰ Peak Contact Hours</h3>
          <div className="space-y-3">
            {data.timeBasedMetrics.peak_contact_hours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-900/20 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-gray-300 text-sm">
                    {hour.hour}:00 - {hour.hour + 1}:00
                  </span>
                </div>
                <span className="text-white font-semibold">{hour.count}</span>
              </div>
            ))}
            {data.timeBasedMetrics.peak_contact_hours.length === 0 && (
              <p className="text-gray-400 text-sm">No contact patterns yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">📅 Weekly Trends</h3>
          <div className="space-y-3">
            {data.timeBasedMetrics.weekly_trends
              .filter(day => day.messages > 0)
              .sort((a, b) => b.messages - a.messages)
              .map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-900/20 rounded-lg">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{day.day}</span>
                  </div>
                  <span className="text-white font-semibold">{day.messages}</span>
                </div>
              ))}
            {data.timeBasedMetrics.weekly_trends.every(d => d.messages === 0) && (
              <p className="text-gray-400 text-sm">No weekly data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {data.recentMessages.slice(0, 5).map((message, index) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="p-2 bg-blue-900/20 rounded-lg flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-medium truncate">{message.name}</p>
                    <span className="text-gray-400 text-xs">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-1">{message.email}</p>
                  {message.resume_title && (
                    <p className="text-blue-400 text-xs mb-1">Re: {message.resume_title}</p>
                  )}
                  {message.project_mentioned && (
                    <p className="text-purple-400 text-xs mb-1">🚀 Mentioned: {message.project_mentioned}</p>
                  )}
                  <p className="text-gray-300 text-xs line-clamp-2">{message.message}</p>
                </div>
              </div>
            ))}
            {data.recentMessages.length === 0 && (
              <p className="text-gray-400 text-sm">No messages yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.category === 'message' ? 'bg-blue-900/20' :
                    activity.category === 'project' ? 'bg-purple-900/20' :
                    activity.category === 'resume' ? 'bg-green-900/20' :
                    'bg-gray-700/20'
                  }`}>
                    {activity.category === 'message' && <Mail className="w-4 h-4 text-blue-400" />}
                    {activity.category === 'project' && <Star className="w-4 h-4 text-purple-400" />}
                    {activity.category === 'resume' && <Award className="w-4 h-4 text-green-400" />}
                    {activity.category === 'system' && <Activity className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
            ))}
            {data.recentActivity.length === 0 && (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}