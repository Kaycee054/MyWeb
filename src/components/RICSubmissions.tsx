import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Building2, User, MessageSquare, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Submission {
  id: string
  full_name: string
  email: string
  phone: string
  organization: string
  role: string
  interest_area: string
  message: string
  created_at: string
}

export function RICSubmissions() {
  const [submissions, setSubmissions] = React.useState<Submission[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('ric_interest_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInterestAreaLabel = (area: string) => {
    const labels: Record<string, string> = {
      'collaboration': 'Research Collaboration',
      'industry': 'Industry Partnership',
      'funding': 'Funding & Investment',
      'talent': 'Talent & HR',
      'advisory': 'Advisory & Mentorship',
      'other': 'Other'
    }
    return labels[area] || area
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No submissions yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">RIC Interest Submissions</h2>
        <div className="text-sm text-gray-400">
          Total: {submissions.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((submission) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{submission.full_name}</h3>
                <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium">
                  {getInterestAreaLabel(submission.interest_area)}
                </div>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(submission.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <a href={`mailto:${submission.email}`} className="hover:text-blue-400 transition-colors">
                  {submission.email}
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <a href={`tel:${submission.phone}`} className="hover:text-blue-400 transition-colors">
                  {submission.phone}
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                {submission.organization}
              </div>
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2 text-blue-400" />
                {submission.role}
              </div>
            </div>

            {submission.message && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-start text-gray-300">
                  <MessageSquare className="w-4 h-4 mr-2 text-amber-400 mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{submission.message}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
