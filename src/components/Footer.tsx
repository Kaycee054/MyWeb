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
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/kcekpemiro',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/kcekpemiro',
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      url: 'https://t.me/kcekpemiro',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@kcekpemiro',
    },
  ]

  const quickLinks = [
    { name: 'IT Project Manager', href: '/resume/it-project-manager' },
    { name: 'Media Producer', href: '/resume/media-producer' },
    { name: 'Business Development', href: '/resume/business-development' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <footer className="bg-apple-gray-950 border-t border-apple-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
            >
              <h3 className="text-xl font-bold text-white mb-5 tracking-tight">Kelechi Ekpemiro</h3>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-3 text-apple-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Moscow, Russia</span>
                </div>
                <div className="flex items-center space-x-3 text-apple-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:ekpemirokelechi@gmail.com" className="hover:text-white transition-colors">
                    ekpemirokelechi@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-apple-gray-500 hover:text-white transition-colors p-2.5 rounded-apple-sm hover:bg-apple-gray-800/60"
                      title={social.name}
                      aria-label={`Follow Kelechi on ${social.name}`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
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
              transition={{ duration: 0.6, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
            >
              <h4 className="text-white font-semibold mb-4 text-sm tracking-tight">Expertise Areas</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-apple-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-1 group"
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
              transition={{ duration: 0.6, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
            >
              <h4 className="text-white font-semibold mb-4 text-sm tracking-tight">Services</h4>
              <ul className="space-y-2.5 text-sm text-apple-gray-400">
                <li className="hover:text-white transition-colors cursor-default">Project Management</li>
                <li className="hover:text-white transition-colors cursor-default">Systems Integration</li>
                <li className="hover:text-white transition-colors cursor-default">Media Production</li>
                <li className="hover:text-white transition-colors cursor-default">Business Development</li>
                <li className="hover:text-white transition-colors cursor-default">AI &amp; Automation</li>
                <li className="hover:text-white transition-colors cursor-default">Technical Consulting</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-apple-gray-800/60 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-apple-gray-500 text-xs mb-4 md:mb-0"
            >
              © {currentYear} Kelechi Ekpemiro. All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-6 text-xs text-apple-gray-500"
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
