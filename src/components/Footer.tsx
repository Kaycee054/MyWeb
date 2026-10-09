import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Linkedin, Github, Instagram, MessageCircle, Youtube, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/kelechi-ekpemiro',
      color: 'hover:text-blue-400',
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/kcekpemiro',
      color: 'hover:text-gray-300',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/kcekpemiro',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      url: 'https://t.me/kcekpemiro',
      color: 'hover:text-blue-500',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@kcekpemiro',
      color: 'hover:text-red-500',
    },
  ]

  const quickLinks = [
    { name: 'IT Project Manager', href: '/resume/it-project-manager' },
    { name: 'Media Producer', href: '/resume/media-producer' },
    { name: 'Business Development', href: '/resume/business-development' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Kelechi Ekpemiro</h3>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Moscow, Russia</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:ekpemirokelechi@gmail.com" className="hover:text-white transition-colors">
                    ekpemirokelechi@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative text-gray-400 ${social.color} transition-all duration-200 p-2 rounded-lg hover:bg-gray-800 hover:scale-110`}
                      title={social.name}
                      aria-label={`Follow Kelechi on ${social.name}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">Expertise Areas</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-1 group"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-default">Project Management</li>
                <li className="hover:text-white transition-colors cursor-default">Systems Integration</li>
                <li className="hover:text-white transition-colors cursor-default">Media Production</li>
                <li className="hover:text-white transition-colors cursor-default">Business Development</li>
                <li className="hover:text-white transition-colors cursor-default">AI & Automation</li>
                <li className="hover:text-white transition-colors cursor-default">Technical Consulting</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {currentYear} Kelechi Ekpemiro. All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-6 text-sm text-gray-400"
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors"
              >
                Back to Top
              </button>
              <a href="mailto:ekpemirokelechi@gmail.com" className="hover:text-white transition-colors">
                Quick Contact
              </a>
              <a href="/Kelechi_Ekpemiro_CV2025.pdf" target="_blank" className="hover:text-white transition-colors">
                Download CV
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
