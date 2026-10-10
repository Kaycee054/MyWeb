import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { trackVisitorInfo } from '../lib/visitorTracking'

interface ContactFormProps {
  resumeId?: string
  title?: string
}

interface FormData {
  name: string
  email: string
  message: string
}

export function ContactForm({ resumeId, title }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      trackVisitorInfo(data.name, data.email)

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          name: data.name,
          email: data.email,
          message: data.message,
          resume_id: resumeId,
          status: 'new'
        })
        .select()
        .single()

      if (messageError) throw messageError

      const { data: stages } = await supabase
        .from('kanban_stages')
        .select('id')
        .order('order_index', { ascending: true })
        .limit(1)

      if (stages && stages.length > 0) {
        const { error: ticketError } = await supabase
          .from('kanban_tickets')
          .insert({
            title: `New message from ${data.name}`,
            description: data.message,
            stage_id: stages[0].id,
            message_id: messageData.id,
            order_index: 0
          })

        if (ticketError) {
          console.error('Error creating ticket:', ticketError)
        }
      }

      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitted(true)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        className="bg-apple-gray-900 rounded-apple p-10 text-center"
      >
        <CheckCircle className="w-12 h-12 text-apple-green mx-auto mb-5" />
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Message Sent</h3>
        <p className="text-apple-gray-400 text-sm">
          Thank you for reaching out. I'll get back to you within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
      className="bg-apple-gray-900 rounded-apple p-8 sm:p-10"
    >
      <h3 className="text-xl font-bold text-white mb-8 tracking-tight">
        {title ? `Contact Me About ${title}` : 'Get In Touch'}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-apple-gray-400 mb-2 uppercase tracking-wide">
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-3 bg-apple-gray-800 border border-apple-gray-700 rounded-apple-sm text-white placeholder-apple-gray-500 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-colors text-sm"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-apple-gray-400 mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-apple-gray-800 border border-apple-gray-700 rounded-apple-sm text-white placeholder-apple-gray-500 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-colors text-sm"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-apple-gray-400 mb-2 uppercase tracking-wide">
            Message
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            id="message"
            rows={5}
            className="w-full px-4 py-3 bg-apple-gray-800 border border-apple-gray-700 rounded-apple-sm text-white placeholder-apple-gray-500 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-colors text-sm resize-none"
            placeholder="Tell me about your project or opportunity..."
          />
          {errors.message && (
            <p className="mt-2 text-xs text-red-400">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-apple-blue text-white px-6 py-3.5 rounded-apple-sm font-medium text-sm hover:bg-apple-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
