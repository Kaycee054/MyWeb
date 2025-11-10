import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, User, Briefcase, MessageSquare, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [navItems, setNavItems] = React.useState([
    { path: '/', icon: Home, label: 'Home' },
    { path: '/resume/it-project-manager', icon: Briefcase, label: 'IT Project Manager' },
    { path: '/resume/media-producer', icon: User, label: 'Media Producer' },
    { path: '/resume/business-development', icon: Briefcase, label: 'Business Development' },
    { path: '/contact', icon: MessageSquare, label: 'Contact' },
  ])
  const location = useLocation()
  const { user } = useAuth()

  React.useEffect(() => {
    const fetchResumeOrder = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data: resumes } = await supabase
          .from('resumes')
          .select('slug, title, display_order')
          .order('display_order', { ascending: true, nullsLast: true })

        if (resumes && resumes.length > 0) {
          const dynamicNavItems = [
            { path: '/', icon: Home, label: 'Home' },
            ...resumes.map(resume => ({
              path: `/resume/${resume.slug}`,
              icon: Briefcase,
              label: resume.title
            })),
            { path: '/contact', icon: MessageSquare, label: 'Contact' },
          ]
          setNavItems(dynamicNavItems)
        }
      } catch (error) {
        console.log('Using default navigation order')
      }
    }

    fetchResumeOrder()
    
    // Listen for resume order changes
    const handleResumeOrderChange = () => {
      fetchResumeOrder()
    }
    
    window.addEventListener('resumeOrderChanged', handleResumeOrderChange)
    
    return () => {
      window.removeEventListener('resumeOrderChanged', handleResumeOrderChange)
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-xl font-bold text-white hover:text-gray-300 transition-colors z-50"
            onDoubleClick={() => window.location.href = '/admin'}
            aria-label="Kelechi Ekpemiro - Home"
          >
            Kelechi Ekpemiro
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Hidden admin access for authenticated users */}
          {user && (
            <Link
              to="/admin"
              className="hidden md:block text-xs text-gray-500 hover:text-gray-400 transition-colors"
              title="Admin Dashboard"
            >
              ⚙️
            </Link>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10 border border-white/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {user && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span>⚙️</span>
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}