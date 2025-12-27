import React from 'react'
import { motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'

interface RICInterestFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  email: string
  phone: string
  organization: string
  role: string
  interestArea: string
  message: string
}

export function RICInterestForm({ isOpen, onClose }: RICInterestFormProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  const onSubmit = async (data: FormData) => {
    try {
      await supabase
        .from('ric_interest_submissions')
        .insert([
          {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            organization: data.organization,
            role: data.role,
            interest_area: data.interestArea,
            message: data.message,
            created_at: new Date().toISOString(),
          }
        ])

      setSubmitSuccess(true)
      reset()

      setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your information. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Share your thoughts and contributions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-4">✓</div>
            <p className="text-white font-semibold mb-2">Thank you!</p>
            <p className="text-gray-400">We'll be in touch soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Full Name</label>
              <input
                {...register('fullName', { required: true })}
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Email</label>
              <input
                {...register('email', { required: true, type: 'email' })}
                type="email"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Phone</label>
              <input
                {...register('phone', { required: true })}
                type="tel"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="+234..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Organization</label>
              <input
                {...register('organization', { required: true })}
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Your organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Your Role</label>
              <input
                {...register('role', { required: true })}
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g., Director, Researcher"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Area of Interest</label>
              <select
                {...register('interestArea', { required: true })}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Select an area</option>
                <option value="collaboration">Research Collaboration</option>
                <option value="industry">Industry Partnership</option>
                <option value="funding">Funding & Investment</option>
                <option value="talent">Talent & HR</option>
                <option value="advisory">Advisory & Mentorship</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">Message (Optional)</label>
              <textarea
                {...register('message')}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="Tell us more about your interest..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
