import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { Hero } from '../components/Hero'
import { ResumeCard } from '../components/ResumeCard'
import { AboutMe } from '../components/AboutMe'
import { Layout } from '../components/Layout'
import { supabase } from '../lib/supabase'

interface Resume {
  id: string
  slug: string
  title: string
  description: string
  image_url: string | null
}

export function HomePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // SEO optimization
  useSEO({
    title: 'Kelechi Ekpemiro | Project Manager | Media Producer | Business Development Consultant',
    description: 'Official website of Kelechi Ekpemiro — Engineer, Project Manager, and Innovator. Explore resumes in Project Management, Media Production, and Business Development. Based in Moscow, open to global opportunities.',
    keywords: ['Kelechi Ekpemiro', 'IT Project Manager', 'Business Development Consultant', 'Media Producer', 'Skoltech', 'Skolkovo', 'Moscow', 'Innovation', 'Engineering Systems', 'StraightenUp AI', 'agile', 'risk management', 'wedding', 'event', 'live stream', 'tech startups', 'SMEs', 'sales systems', 'ERP', '1C', 'integrations'],
    ogImage: '/IMG_2331.jpg',
    canonicalUrl: window.location.origin,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Kelechi Ekpemiro",
      "givenName": "Kelechi",
      "familyName": "Ekpemiro",
      "age": 25,
      "nationality": "Nigerian",
      "jobTitle": ["IT Project Manager", "Media Producer", "Business Development Consultant"],
      "description": "Engineer, Project Manager, and Innovator specializing in agile methodologies, risk management, media production, and business development consulting",
      "url": window.location.origin,
      "image": "/IMG_2331.jpg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Moscow",
        "addressCountry": "RU"
      },
      "alumniOf": [
        {
          "@type": "EducationalOrganization",
          "name": "Skolkovo Institute of Science and Technology",
          "alternateName": "Skoltech"
        }
      ],
      "memberOf": {
        "@type": "Organization",
        "name": "Project Management Institute",
        "alternateName": "PMI"
      },
      "founder": {
        "@type": "Organization",
        "name": "StraightenUp",
        "description": "AI + wearables startup, Skolkovo Foundation"
      },
      "knowsAbout": ["Project Management", "Agile Methodologies", "Risk Management", "Media Production", "Business Development", "Tech Startups", "SMEs", "Sales Systems", "ERP", "1C", "Integrations", "Engineering Systems", "AI", "Wearables"]
    }
  })
  useEffect(() => {
    fetchResumes()
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = '/IMG_2331.jpg'
    document.head.appendChild(link)
  }, [])

  const fetchResumes = async () => {
    try {
      setError(null)
      
      // Always show the three main resume areas
      const defaultResumes = [
        {
          id: 'default-it',
          slug: 'it-project-manager',
          title: 'IT Project Manager',
          description: 'Leading technical, analytical, and applied projects from inception to delivery. Expertise in cross-functional global teams, helping enterprises curate and manage IT, PLM, Process, and operations initiatives.',
          image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762779314/IMG_2330_ybo9na.jpg'
        },
        {
          id: 'default-media',
          slug: 'media-producer',
          title: 'Media Producer & Content Creator',
          description: 'Creative visual storytelling through videography, live streaming, and post-production. Expertise in Adobe Creative Suite, live broadcasting, and event coverage.',
          image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762684768/IMG_4520_qyxzpv.jpg'
        },
        {
          id: 'default-biz',
          slug: 'business-development',
          title: 'Business Development & Systems Integration',
          description: 'Strategic business consultant focused on tech startups and SMEs, with expertise in sales systems optimization, CRM integration, and automated accounting solutions.',
          image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762777946/IMG_5936_arqatm.jpg'
        }
      ]

      setResumes(defaultResumes)
      setLoading(false)

      setTimeout(async () => {
        try {
          const { data } = await supabase
            .from('resumes')
            .select('id, slug, title, description, image_url, created_at')
            .order('display_order', { ascending: true, nullsLast: true })

          if (data && data.length > 0) {
            setResumes(data)
          }
        } catch (dbError) {
          console.log('Using default resumes')
        }
      }, 100)
    } catch (error) {
      console.error('Error fetching resumes:', error)
      // Fallback content already set above
    }
  }

  return (
    <Layout>
      <Hero />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Areas of Expertise
            </h2>
          </motion.div>

          {error && (
            <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-8">
              <p className="text-sm">{error} - Showing default content</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900/50 rounded-2xl p-8 animate-pulse backdrop-blur-sm">
                  <div className="h-32 bg-gray-800 rounded-lg mb-6" />
                  <div className="h-6 bg-gray-800 rounded mb-3" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resumes.map((resume, index) => (
                <ResumeCard
                  key={resume.id}
                  slug={resume.slug}
                  title={resume.title}
                  description={resume.description}
                  image={resume.image_url || undefined}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <AboutMe />
    </Layout>
  )
}