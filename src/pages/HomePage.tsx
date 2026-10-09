import React from 'react'
import { useSEO } from '../hooks/useSEO'
import { Hero } from '../components/Hero'
import { AboutMe } from '../components/AboutMe'
import { Layout } from '../components/Layout'

export function HomePage() {

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

  return (
    <Layout>
      <Hero />
      <AboutMe />
    </Layout>
  )
}