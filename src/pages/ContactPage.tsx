import React from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { Mail, MapPin, Linkedin, MessageCircle, Instagram, Youtube, Github } from 'lucide-react'
import { Layout } from '../components/Layout'
import { ContactForm } from '../components/ContactForm'

export function ContactPage() {
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
      icon: MessageCircle,
      label: 'Telegram',
      value: '@kcekpemiro',
      href: 'https://t.me/kcekpemiro'
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
      value: 'linkedin.com/in/kelechi-ekpemiro',
      href: 'https://linkedin.com/in/kelechi-ekpemiro'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@kcekpemiro',
      href: 'https://instagram.com/kcekpemiro'
    },
    {
      icon: Youtube,
      label: 'YouTube',
      value: '@kcekpemiro',
      href: 'https://youtube.com/@kcekpemiro'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/kcekpemiro',
      href: 'https://github.com/kcekpemiro'
    }
  ]

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              Let's Work Together
            </h1>
            <p className="text-lg sm:text-xl text-apple-gray-400 max-w-2xl mx-auto font-light">
              Ready to discuss your next project or explore collaboration opportunities? Always interested in connecting with like-minded professionals and innovative companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Get In Touch</h2>

              <div className="space-y-3 mb-10">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-center space-x-4 p-4 bg-apple-gray-900 rounded-apple-sm hover:bg-apple-gray-800 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <Icon className="w-5 h-5 text-apple-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-apple-gray-500">{item.label}</p>
                        <p className="text-white font-medium text-sm">{item.value}</p>
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

              <div className="bg-apple-gray-900 rounded-apple p-6">
                <h3 className="text-lg font-bold text-white mb-5 tracking-tight">Availability</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray-300 text-sm">Project Consulting</span>
                    <span className="text-apple-green text-sm font-medium">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray-300 text-sm">Full-time Opportunities</span>
                    <span className="text-yellow-500 text-sm font-medium">Selective</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-apple-gray-300 text-sm">Speaking Engagements</span>
                    <span className="text-apple-green text-sm font-medium">Available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.42, 0, 0.58, 1] }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
