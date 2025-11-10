import React from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { Mail, MapPin, Linkedin } from 'lucide-react'
import { Layout } from '../components/Layout'
import { ContactForm } from '../components/ContactForm'

export function ContactPage() {
  // SEO optimization
  useSEO({
    title: 'Contact Kelechi Ekpemiro | Project Manager & Business Consultant',
    description: 'Get in touch with Kelechi Ekpemiro for project management, media production, or business development opportunities. Based in Moscow, available for global projects.',
    keywords: ['contact', 'Kelechi Ekpemiro', 'project manager', 'business consultant', 'media producer', 'Moscow', 'collaboration', 'opportunities'],
    ogImage: '/IMG_2331.jpg',
    canonicalUrl: `${window.location.origin}/contact`
  })

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ekpemirokelechi@gmail.com',
      href: 'mailto:ekpemirokelechi@gmail.com'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Moscow, Russia',
      href: null
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/kelechi-ekpemiro-a78512154',
      href: 'https://linkedin.com/in/kelechi-ekpemiro-a78512154'
    }
  ]

  return (
    <Layout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Let's Work Together
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to discuss your next project or explore collaboration opportunities? 
              I'm always interested in connecting with like-minded professionals and innovative companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  )

                  return item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  )
                })}
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Availability</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Project Consulting</span>
                    <span className="text-green-400">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full-time Opportunities</span>
                    <span className="text-yellow-400">Selective</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speaking Engagements</span>
                    <span className="text-green-400">Available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}