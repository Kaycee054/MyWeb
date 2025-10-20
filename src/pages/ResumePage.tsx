import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { seoManager } from '../lib/seo'
import { fileStorage } from '../lib/fileStorage'
import { Calendar, MapPin, ExternalLink, Download, Play, Image as ImageIcon, FileText, Printer } from 'lucide-react'
import { Layout } from '../components/Layout'
import { ContactForm } from '../components/ContactForm'
import { supabase } from '../lib/supabase'

interface Experience {
  id: string
  title: string
  company: string
  description: string
  start_date: string
  end_date: string | null
  location: string | null
  employment_type: string | null
  achievements: string[] | null
  is_visible: boolean
  artifacts: Artifact[]
}

interface Artifact {
  id: string
  type: 'document' | 'image' | 'video'
  title: string
  url: string
  is_visible: boolean
}

interface Resume {
  id: string
  slug: string
  title: string
  description: string
  image_url: string | null
  intro_text: string | null
  skills: string[] | null
  education: any | null
  certifications: any | null
}

interface Project {
  id: string
  title: string
  description: string
  content: any
  technologies: string[] | null
  start_date: string
  end_date: string | null
  status: 'completed' | 'in_progress' | 'planned'
  featured_image: string | null
  is_featured: boolean
}

export function ResumePage() {
  const { id: slug } = useParams<{ id: string }>()
  const [resume, setResume] = useState<Resume | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dynamic SEO based on resume data
  useSEO({
    title: resume ? `${resume.title} - Kelechi Ekpemiro` : 'Resume - Kelechi Ekpemiro',
    description: resume ? resume.description : 'Professional resume and portfolio',
    keywords: resume ? [resume.title, 'Kelechi Ekpemiro', 'resume', 'portfolio', 'experience'] : ['resume', 'portfolio'],
    ogImage: resume?.image_url || '/IMG_2331.jpg',
    canonicalUrl: `${window.location.origin}/resume/${slug}`,
    structuredData: resume && experiences.length > 0 ? seoManager.generateResumeStructuredData(resume, experiences, projects) : undefined
  })

  useEffect(() => {
    if (slug) {
      fetchResumeData()
    }
  }, [slug])

  const fetchResumeData = async () => {
    try {
      setError(null)
      setLoading(true)

      // Always provide default resume data first
      const defaultResumes: Record<string, Resume> = {
        'it-project-manager': {
          id: 'default-it',
          slug: 'it-project-manager',
          title: 'IT Project Manager',
          description: 'Leading technical, analytical, and applied projects from inception to delivery. Expertise in cross-functional global teams, helping enterprises curate and manage IT, PLM, Process, and operations initiatives.',
          image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          intro_text: JSON.stringify({
            blocks: [
              {
                id: '1',
                type: 'text',
                content: 'A skilled systems and computer engineer and savvy IT project/program manager, I lead technical, analytical, and applied projects from inception to delivery. I thrive in cross-functional global teams, helping enterprises curate and manage IT, PLM, Process, and operations initiatives.',
                order: 0
              }
            ]
          }),
          skills: [
            'Project Management',
            'Agile Methodologies',
            'Cross-functional Team Leadership',
            'IT Systems Integration',
            'Risk Management',
            'Stakeholder Management',
            'Technical Documentation',
            'Process Optimization'
          ],
          education: {
            entries: [
              {
                institution: 'Skolkovo Institute of Science and Technologies (Skoltech)',
                degree: 'Master of Science, Information Systems',
                period: 'September 2023 - June 2025',
                location: 'Moscow, Russia'
              },
              {
                institution: 'VSB- Technical University Ostrava',
                degree: 'BSc. Information Science and Computer Engineering (exchange programme)',
                period: 'February 2021 - July 2021',
                location: 'Czech Republic'
              },
              {
                institution: 'Kazan National Research Technological University',
                degree: 'BSc. Information Science and Computer Engineering',
                period: 'September 2019 - June 2023',
                location: 'Kazan, Russia',
                gpa: '3.8/4.0'
              }
            ]
          },
          certifications: {
            entries: [
              {
                name: 'Google Project Management: Professional Certificate',
                issuer: 'Google',
                year: '2024'
              },
              {
                name: 'Project Management Institute Member',
                issuer: 'PMI',
                year: '2025'
              }
            ]
          }
        },
        'media-producer': {
          id: 'default-media',
          slug: 'media-producer',
          title: 'Media Producer & Content Creator',
          description: 'Creative visual storytelling through videography, live streaming, and post-production. Expertise in Adobe Creative Suite, live broadcasting, and event coverage.',
          image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
          intro_text: JSON.stringify({
            blocks: [
              {
                id: '1',
                type: 'text',
                content: 'Creative media professional with expertise in videography, production, live broadcasting, and post-editing. Owner of Focus Films, a self-owned media brand designed for content creation, video production, and event coverage.',
                order: 0
              }
            ]
          }),
          skills: [
            'Video Production',
            'Live Streaming',
            'Adobe Creative Suite',
            'Post-Production',
            'Event Coverage',
            'Content Creation',
            'Project Management',
            'Client Relations'
          ],
          education: null,
          certifications: null
        },
        'business-development': {
          id: 'default-biz',
          slug: 'business-development',
          title: 'Business Development & Systems Integration',
          description: 'Strategic business consultant focused on tech startups and SMEs, with expertise in sales systems optimization, CRM integration, and automated accounting solutions.',
          image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
          intro_text: JSON.stringify({
            blocks: [
              {
                id: '1',
                type: 'text',
                content: 'Business development professional with experience in sales and integrations management, specializing in Microsoft projects, CRM, marketing, telephony, and automated systems for SMEs.',
                order: 0
              }
            ]
          }),
          skills: [
            'Business Development',
            'Sales Management',
            'CRM Integration',
            'Microsoft Projects',
            'Marketing Strategy',
            'System Integration',
            'Client Relationship Management',
            'Process Automation'
          ],
          education: null,
          certifications: null
        }
      }

      // Set default resume immediately
      const defaultResume = defaultResumes[slug!]
      if (defaultResume) {
        setResume(defaultResume)
      }

      // Try to fetch from database to override defaults
      let resumeData = null
      try {
        const { data } = await supabase
          .from('resumes')
          .select('*')
          .eq('slug', slug)
          .single()

        resumeData = data
        if (resumeData) {
          setResume(resumeData)
        }
      } catch (dbError) {
        console.log('Using default resume data')
      }

      // Fetch experiences - try database first, then use defaults
      let experiencesData: Experience[] = []
      
      // Only query database if we have a valid UUID from database resume
      if (resumeData && resumeData.id) {
        try {
          const { data: dbExperiences } = await supabase
            .from('experiences')
            .select(`
              *,
              artifacts (*)
            `)
            .eq('resume_id', resumeData.id)
            .eq('is_visible', true)
            .order('start_date', { ascending: false })

          if (dbExperiences && dbExperiences.length > 0) {
            experiencesData = dbExperiences as Experience[]
          }
        } catch (dbError) {
          console.log('Database experiences not available, using defaults')
        }
      }

      // If no database experiences, use default experiences
      if (experiencesData.length === 0) {
        experiencesData = getDefaultExperiences(slug!)
      }

      setExperiences(experiencesData)

      // Fetch projects
      try {
        if (resumeData && resumeData.id) {
          const { data: projectsData } = await supabase
            .from('projects')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(4)

          if (projectsData && projectsData.length > 0) {
            setProjects(projectsData)
          } else {
            setProjects(getDefaultProjects())
          }
        } else {
          setProjects(getDefaultProjects())
        }
      } catch (dbError) {
        console.log('Using default projects')
        setProjects(getDefaultProjects())
      }

    } catch (error) {
      console.error('Error fetching resume data:', error)
      setError('Failed to load resume data')
    } finally {
      setLoading(false)
    }
  }

  const getDefaultExperiences = (resumeSlug: string): Experience[] => {
    const defaultExperiences: Record<string, Experience[]> = {
      'it-project-manager': [
        {
          id: '1',
          title: 'Graduate Research Student',
          company: 'Skolkovo Institute of Science and Technology',
          description: 'Advanced research in information systems with focus on AI, computer vision, and automated systems. Leading multiple high-impact projects in aerial systems and robotics.',
          start_date: '2023-09-01',
          end_date: null,
          location: 'Moscow, Russia',
          employment_type: 'Full-time',
          achievements: [
            'Led ResQ aerial search and rescue computer vision system development',
            'Designed and prototyped towing airship for UHAA-based 5G relay system',
            'Developed QuadInspect automated UAV system for aircraft inspection',
            'Created IoT telepresence mobile robot for gaming club',
            'Built AnyLogic simulation framework for technology development programs'
          ],
          is_visible: true,
          artifacts: []
        },
        {
          id: '2',
          title: 'Research Assistant - AI & Automation',
          company: 'KNRTU Faculty of Management and Automation Lab',
          description: 'Led multiple technical research projects focusing on information flow in organizations and automated control systems. Developed database solutions and information systems for various applications.',
          start_date: '2019-01-01',
          end_date: '2023-06-30',
          location: 'Kazan, Russia',
          employment_type: 'Research',
          achievements: [
            'Led information flow research for automated control system resolution under Prof. Nurgaliev R. Karlovich',
            'Designed energy-efficient tri-generation power unit with heat repurposing capabilities',
            'Developed auto dealership central information system using C# .NET',
            'Created MySQL database system for UNICS Kazan basketball team',
            'Completed bachelor\'s project on Tourism Agency information system'
          ],
          is_visible: true,
          artifacts: []
        }
      ],
      'media-producer': [
        {
          id: '3',
          title: 'Founder & Creative Director',
          company: 'Focus Films',
          description: 'Founded and operate comprehensive media production brand specializing in videography, live broadcasting, and post-production services for diverse clientele.',
          start_date: '2019-01-01',
          end_date: null,
          location: 'Kazan, Russia',
          employment_type: 'Self-employed',
          achievements: [
            'Built successful media brand from ground up',
            'Delivered 100+ video production projects',
            'Specialized in wedding and event videography',
            'Implemented live streaming solutions for events',
            'Managed end-to-end production workflows'
          ],
          is_visible: true,
          artifacts: []
        },
        {
          id: '4',
          title: 'Head of Media Team',
          company: 'SV International Kazan',
          description: 'Led international media team responsible for live streaming, broadcasting, and content creation using professional equipment and software.',
          start_date: '2021-09-01',
          end_date: '2023-06-30',
          location: 'Kazan, Russia',
          employment_type: 'Part-time',
          achievements: [
            'Managed team of media professionals',
            'Implemented WireCast and Atem suite workflows',
            'Delivered live streaming for international events',
            'Coordinated multi-camera broadcast setups',
            'Trained team members on professional equipment'
          ],
          is_visible: true,
          artifacts: []
        }
      ],
      'business-development': [
        {
          id: '5',
          title: 'Sales and Integrations Manager',
          company: 'SOL Accounting and Booking LLC',
          description: 'Managed sales and system integrations for innovative automated accounting solution targeting SMEs in the UAE market.',
          start_date: '2023-08-01',
          end_date: '2024-05-31',
          location: 'Moscow, Russia',
          employment_type: 'Full-time',
          achievements: [
            'Led Microsoft projects integration initiatives',
            'Implemented CRM and marketing automation systems',
            'Managed telephony and communication solutions',
            'Developed social media marketing strategies',
            'Streamlined business processes for SME clients'
          ],
          is_visible: true,
          artifacts: []
        },
        {
          id: '6',
          title: 'Marketing and Data Analysis Intern',
          company: 'Zeonglobal Technical Consult',
          description: 'Supported marketing initiatives and data management operations using Microsoft Office suite and sales analytics.',
          start_date: '2017-02-01',
          end_date: '2018-10-31',
          location: 'Abia State, Nigeria',
          employment_type: 'Internship',
          achievements: [
            'Conducted market research and data analysis',
            'Supported sales team with lead generation',
            'Managed client database and documentation',
            'Created marketing materials and presentations',
            'Assisted in business development activities'
          ],
          is_visible: true,
          artifacts: []
        }
      ]
    }
    return defaultExperiences[resumeSlug] || []
  }

  const getDefaultProjects = (): Project[] => {
    return [
      {
        id: 'proj-1',
        title: 'StraightenUp - AI Posture Monitoring',
        description: 'Active startup project in AI-enabled posture monitoring and correction, member of Skolkovo Foundation.',
        content: {
          blocks: [
            {
              id: '1',
              type: 'text',
              content: 'StraightenUp is an innovative AI-powered wearable technology startup focused on posture monitoring and correction. As a Skolkovo Foundation member, this project combines computer vision, machine learning, and IoT sensors to provide real-time posture feedback.',
              order: 0
            }
          ]
        },
        technologies: ['AI/ML', 'Computer Vision', 'IoT', 'Mobile Development', 'Python', 'TensorFlow'],
        start_date: '2019-01-01',
        end_date: null,
        status: 'in_progress',
        featured_image: null,
        is_featured: true
      },
      {
        id: 'proj-2',
        title: 'ResQ - Aerial Search and Rescue AI System',
        description: 'Computer Vision Multi-spectral AI system for aerial search and rescue operations using UAV technology.',
        content: {
          blocks: [
            {
              id: '1',
              type: 'text',
              content: 'ResQ is an advanced computer vision system designed for aerial search and rescue operations. The system utilizes multi-spectral imaging and AI algorithms to detect and locate missing persons from UAV platforms.',
              order: 0
            }
          ]
        },
        technologies: ['Computer Vision', 'UAV', 'Python', 'OpenCV', 'Machine Learning', 'GPS Integration'],
        start_date: '2023-09-01',
        end_date: '2023-09-30',
        status: 'completed',
        featured_image: null,
        is_featured: true
      },
      {
        id: 'proj-3',
        title: 'QuadInspect - Automated Aircraft Inspection',
        description: 'Automated UAV System for Single Aisle Aircraft Structural Inspection using computer vision and autonomous flight.',
        content: {
          blocks: [
            {
              id: '1',
              type: 'text',
              content: 'QuadInspect is an automated UAV system designed for comprehensive structural inspection of single-aisle aircraft. The system combines autonomous flight capabilities with advanced computer vision for defect detection.',
              order: 0
            }
          ]
        },
        technologies: ['UAV', 'Computer Vision', 'Autonomous Systems', 'Image Processing', 'Python', 'ROS'],
        start_date: '2024-02-01',
        end_date: '2024-11-30',
        status: 'completed',
        featured_image: null,
        is_featured: true
      },
      {
        id: 'proj-4',
        title: 'Focus Films - Media Production Brand',
        description: 'Self-owned media brand for content creation, video production, and event coverage with comprehensive production services.',
        content: {
          blocks: [
            {
              id: '1',
              type: 'text',
              content: 'Focus Films is a comprehensive media production brand specializing in videography, live broadcasting, and post-production services. The brand covers content creation, video production, and event coverage for various clients.',
              order: 0
            }
          ]
        },
        technologies: ['Adobe Creative Suite', 'Live Streaming', 'Multi-camera Setup', 'Post-Production', 'Project Management'],
        start_date: '2019-01-01',
        end_date: null,
        status: 'in_progress',
        featured_image: null,
        is_featured: true
      }
    ]
  }

  const downloadResume = async () => {
    if (!resume) return

    try {
      // Try to get specific resume PDF from storage
      const storageResult = await fileStorage.listFiles('resume')
      
      if (storageResult.success && storageResult.files) {
        const resumeFile = storageResult.files.find(file => 
          file.name.includes(resume.slug) || file.name.includes(resume.title.toLowerCase().replace(/\s+/g, '-'))
        )
        
        if (resumeFile) {
          const downloadResult = await fileStorage.downloadFile(`resume/${resumeFile.name}`)
          if (downloadResult.success && downloadResult.url) {
            const link = document.createElement('a')
            link.href = downloadResult.url
            link.download = `${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
          }
        }
      }
      
      // Fallback to general CV
      const link = document.createElement('a')
      link.href = '/Kelechi_Ekpemiro_CV2025.pdf'
      link.download = `${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading resume:', error)
      // Final fallback
      const link = document.createElement('a')
      link.href = '/Kelechi_Ekpemiro_CV2025.pdf'
      link.download = `${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const generatePDFFromPage = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resume?.title} - Kelechi Ekpemiro</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              font-size: 2.5em; 
              color: #1e40af; 
              margin-bottom: 10px; 
              font-weight: 700;
            }
            .header .subtitle { 
              font-size: 1.2em; 
              color: #6b7280; 
              font-weight: 500;
            }
            .section { 
              margin-bottom: 35px; 
              page-break-inside: avoid; 
            }
            .section h2 { 
              font-size: 1.5em; 
              color: #1e40af; 
              margin-bottom: 15px; 
              border-left: 4px solid #2563eb; 
              padding-left: 15px;
              font-weight: 600;
            }
            .experience, .project { 
              margin-bottom: 25px; 
              padding: 20px; 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              background: #f9fafb;
              page-break-inside: avoid; 
            }
            .experience h3, .project h3 { 
              font-size: 1.2em; 
              color: #111827; 
              margin-bottom: 8px; 
              font-weight: 600;
            }
            .company { 
              font-weight: 600; 
              color: #374151; 
              margin-bottom: 5px; 
            }
            .date { 
              color: #6b7280; 
              font-style: italic; 
              font-size: 0.9em; 
              margin-bottom: 10px; 
            }
            .description { 
              margin-bottom: 15px; 
              text-align: justify; 
            }
            .achievements { 
              margin-top: 10px; 
            }
            .achievements ul { 
              list-style-type: disc; 
              margin-left: 20px; 
            }
            .achievements li { 
              margin-bottom: 5px; 
            }
            .tech-tags { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 8px; 
              margin-top: 10px; 
            }
            .tech-tag { 
              background: #dbeafe; 
              color: #1e40af; 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 0.85em; 
              font-weight: 500;
            }
            .footer { 
              margin-top: 50px; 
              padding-top: 20px; 
              border-top: 2px solid #e5e7eb; 
              text-align: center; 
              color: #6b7280; 
              font-size: 0.9em; 
            }
            .contact-info { 
              margin-bottom: 30px; 
              text-align: center; 
              color: #374151; 
            }
            .contact-info div { 
              margin: 5px 0; 
            }
            @media print { 
              body { margin: 0; padding: 20px; font-size: 12pt; }
              .header h1 { font-size: 24pt; }
              .section h2 { font-size: 16pt; }
              .experience h3, .project h3 { font-size: 14pt; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resume?.title}</h1>
            <div class="subtitle">Kelechi Ekpemiro</div>
          </div>
          
          <div class="contact-info">
            <div><strong>Email:</strong> contact@kelechiekpemiro.com</div>
            <div><strong>Location:</strong> Moscow, Russia</div>
            <div><strong>LinkedIn:</strong> linkedin.com/in/kelechi-ekpemiro</div>
          </div>
          
          <div class="section">
            <h2>Professional Summary</h2>
            <p class="description">${resume?.description}</p>
          </div>
          
          ${resume?.skills && resume.skills.length > 0 ? `
            <div class="section">
              <h2>Core Skills</h2>
              <div class="tech-tags">
                ${resume.skills.map((skill: string) => `<span class="tech-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${projects.length > 0 ? `
            <div class="section">
              <h2>Featured Projects</h2>
              ${projects.map(project => `
                <div class="project">
                  <h3>${project.title}</h3>
                  <p class="description">${project.description}</p>
                  ${project.technologies ? `
                    <div class="tech-tags">
                      ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="section">
            <h2>Professional Experience</h2>
            ${experiences.map(exp => `
              <div class="experience">
                <h3>${exp.title}</h3>
                <div class="company">${exp.company}</div>
                <div class="date">${formatDate(exp.start_date)} - ${exp.end_date ? formatDate(exp.end_date) : 'Present'}</div>
                ${exp.location ? `<div class="date">${exp.location}</div>` : ''}
                <p class="description">${exp.description}</p>
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <div class="achievements">
                    <strong>Key Achievements:</strong>
                    <ul>
                      ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
          
          ${resume?.education?.entries ? `
            <div class="section">
              <h2>Education</h2>
              ${resume.education.entries.map((edu: any) => `
                <div class="experience">
                  <h3>${edu.degree}</h3>
                  <div class="company">${edu.institution}</div>
                  <div class="date">${edu.period}</div>
                  ${edu.location ? `<div class="date">${edu.location}</div>` : ''}
                  ${edu.gpa ? `<div class="date">GPA: ${edu.gpa}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resume?.certifications?.entries ? `
            <div class="section">
              <h2>Certifications</h2>
              ${resume.certifications.entries.map((cert: any) => `
                <div class="experience">
                  <h3>${cert.name}</h3>
                  <div class="company">${cert.issuer}</div>
                  <div class="date">${cert.year}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Generated from kelechiekpemiro.com • ${new Date().toLocaleDateString()}</p>
            <p>For the most up-to-date information, visit: kelechiekpemiro.com</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        setTimeout(() => printWindow.close(), 1000)
      }, 500)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText
      case 'image':
        return ImageIcon
      case 'video':
        return Play
      default:
        return FileText
    }
  }

  const renderIntroContent = (introText: string | null) => {
    if (!introText) return null

    try {
      const content = JSON.parse(introText)
      if (!content?.blocks) return null

      return content.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={index} className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                {block.content}
              </p>
            )
          default:
            return null
        }
      })
    } catch (error) {
      return <p className="text-gray-300 mb-4 leading-relaxed">{introText}</p>
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-800 rounded w-2/3 mb-8" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-6">
                    <div className="h-6 bg-gray-800 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!resume) {
    return (
      <Layout>
        <div className="pt-20 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Resume Not Found</h1>
          <p className="text-gray-400">The requested resume could not be found.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {error && (
              <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">{error} - Showing default content</p>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {resume.title}
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              {resume.description}
            </p>
            
            {/* Introduction/Summary */}
            {resume.intro_text && (
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Professional Summary</h2>
                {renderIntroContent(resume.intro_text)}
              </div>
            )}
          </motion.div>

          {/* Experiences */}
          {experiences.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Professional Experience</h2>
              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {experience.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.company}</span>
                          </div>
                          {experience.location && (
                            <div className="flex items-center space-x-1">
                              <span>📍</span>
                              <span>{experience.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                            </span>
                          </div>
                          {experience.employment_type && (
                            <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded border border-gray-600/30">
                              {experience.employment_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {experience.description}
                    </p>

                    {/* Achievements */}
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Key Achievements</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {experience.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-gray-300">{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Artifacts */}
                    {experience.artifacts && experience.artifacts.length > 0 && (
                      <div className="border-t border-gray-800 pt-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Portfolio & Documents</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {experience.artifacts
                            .filter(artifact => artifact.is_visible)
                            .map((artifact) => {
                              const Icon = getArtifactIcon(artifact.type)
                              return (
                                <a
                                  key={artifact.id}
                                  href={artifact.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                                >
                                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                  <span className="text-gray-300 group-hover:text-white truncate">
                                    {artifact.title}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white ml-auto" />
                                </a>
                              )
                            })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Core Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Core Skills</h2>
              <div className="flex flex-wrap gap-3">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-500/30 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Featured Projects */}
          {projects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-6"
                  >
                    {project.featured_image && (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education?.entries && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Education</h2>
              <div className="space-y-6">
                {resume.education.entries.map((edu: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{edu.institution}</span>
                      </div>
                      {edu.location && (
                        <div className="flex items-center space-x-1">
                          <span>📍</span>
                          <span>{edu.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.period}</span>
                      </div>
                      {edu.gpa && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/30">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications?.entries && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume.certifications.entries.map((cert: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span>{cert.issuer}</span>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30">
                        {cert.year}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Download and Print Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-8 text-center border-2 border-dashed border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Download & Print Resume</h3>
              <p className="text-gray-400 mb-6">
                Get a professionally formatted PDF version of this resume
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={downloadResume}
                  className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3 text-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF Resume</span>
                </button>
                <button 
                  onClick={generatePDFFromPage}
                  className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-3 text-lg border border-gray-600"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Resume</span>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                PDF includes all experience, projects, and contact information
              </p>
            </motion.div>

            <ContactForm resumeId={resume.id} title={resume.title} />
          </div>
        </div>
      </div>
    </Layout>
  )
}