// Sample data based on Kelechi's CV for initial platform setup
export const sampleResumes = [
  {
    slug: 'it-project-manager',
    title: 'IT Project Manager',
    description: 'Leading technical, analytical, and applied projects from inception to delivery. Expertise in cross-functional global teams, helping enterprises curate and manage IT, PLM, Process, and operations initiatives.',
    image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762684765/IMG_2331_sd7mzb.jpg',
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
  {
    slug: 'media-producer',
    title: 'Media Producer & Content Creator',
    description: 'Creative visual storytelling through videography, live streaming, and post-production. Expertise in Adobe Creative Suite, live broadcasting, and event coverage.',
    image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762684768/IMG_4520_qyxzpv.jpg',
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
    ]
  },
  {
    slug: 'business-development',
    title: 'Business Development & Systems Integration',
    description: 'Strategic business consultant focused on tech startups and SMEs, with expertise in sales systems optimization, CRM integration, and automated accounting solutions.',
    image_url: 'https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762777946/IMG_5936_arqatm.jpg',
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
    ]
  }
]

export const sampleProjects = [
  {
    title: 'StraightenUp - AI Posture Monitoring',
    description: 'Active startup project in AI-enabled posture monitoring and correction, member of Skolkovo Foundation.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'StraightenUp is an innovative AI-powered wearable technology startup focused on posture monitoring and correction. As a Skolkovo Foundation member, this project combines computer vision, machine learning, and IoT sensors to provide real-time posture feedback.',
          order: 0
        },
        {
          id: '2',
          type: 'text',
          content: 'Key Features:\n• Real-time posture analysis using computer vision\n• Wearable sensor integration\n• Mobile app with personalized recommendations\n• Machine learning algorithms for posture pattern recognition\n• Integration with health tracking platforms',
          order: 1
        }
      ]
    },
    technologies: ['AI/ML', 'Computer Vision', 'IoT', 'Mobile Development', 'Python', 'TensorFlow'],
    start_date: '2019-01-01',
    end_date: null,
    status: 'in_progress',
    is_featured: true
  },
  {
    title: 'ResQ - Aerial Search and Rescue AI System',
    description: 'Computer Vision Multi-spectral AI system for aerial search and rescue operations using UAV technology.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'ResQ is an advanced computer vision system designed for aerial search and rescue operations. The system utilizes multi-spectral imaging and AI algorithms to detect and locate missing persons from UAV platforms.',
          order: 0
        },
        {
          id: '2',
          type: 'text',
          content: 'Technical Implementation:\n• Multi-spectral image processing\n• Real-time object detection and classification\n• GPS coordinate mapping\n• Automated flight path optimization\n• Emergency response integration',
          order: 1
        }
      ]
    },
    technologies: ['Computer Vision', 'UAV', 'Python', 'OpenCV', 'Machine Learning', 'GPS Integration'],
    start_date: '2023-09-01',
    end_date: '2023-09-30',
    status: 'completed',
    is_featured: true
  },
  {
    title: 'QuadInspect - Automated Aircraft Inspection',
    description: 'Automated UAV System for Single Aisle Aircraft Structural Inspection using computer vision and autonomous flight.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'QuadInspect is an automated UAV system designed for comprehensive structural inspection of single-aisle aircraft. The system combines autonomous flight capabilities with advanced computer vision for defect detection.',
          order: 0
        },
        {
          id: '2',
          type: 'text',
          content: 'System Capabilities:\n• Autonomous flight path planning\n• High-resolution imaging and analysis\n• Defect detection and classification\n• Automated reporting and documentation\n• Integration with maintenance systems',
          order: 1
        }
      ]
    },
    technologies: ['UAV', 'Computer Vision', 'Autonomous Systems', 'Image Processing', 'Python', 'ROS'],
    start_date: '2024-02-01',
    end_date: '2024-11-30',
    status: 'completed',
    is_featured: true
  },
  {
    title: 'Focus Films - Media Production Brand',
    description: 'Self-owned media brand for content creation, video production, and event coverage with comprehensive production services.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'Focus Films is a comprehensive media production brand specializing in videography, live broadcasting, and post-production services. The brand covers content creation, video production, and event coverage for various clients.',
          order: 0
        },
        {
          id: '2',
          type: 'text',
          content: 'Services Offered:\n• Wedding and event videography\n• Live streaming and broadcasting\n• Corporate video production\n• Post-production and editing\n• Content strategy and creation\n• Multi-camera setups and direction',
          order: 1
        }
      ]
    },
    technologies: ['Adobe Creative Suite', 'Live Streaming', 'Multi-camera Setup', 'Post-Production', 'Project Management'],
    start_date: '2019-01-01',
    end_date: null,
    status: 'in_progress',
    is_featured: true
  },
  {
    title: 'SOL Accounting System Integration',
    description: 'Sales and integrations management for innovative automated accounting system targeting SMEs in the UAE.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'Led sales and integrations for SOL Accounting and Booking LLC, an innovative automated accounting system designed for small and medium enterprises in the UAE. Managed Microsoft projects, CRM integration, marketing initiatives, and telephony systems.',
          order: 0
        },
        {
          id: '2',
          type: 'text',
          content: 'Key Achievements:\n• Implemented CRM and marketing automation\n• Managed Microsoft project integrations\n• Developed telephony and communication systems\n• Created social media marketing strategies\n• Streamlined business processes for SME clients',
          order: 1
        }
      ]
    },
    technologies: ['Microsoft Projects', 'CRM', 'Marketing Automation', 'Telephony Systems', 'Business Process Management'],
    start_date: '2023-08-01',
    end_date: '2024-05-31',
    status: 'completed',
    is_featured: false
  },
  {
    title: 'IoT Telepresence Mobile Robot',
    description: 'IoT-enabled mobile robot system for Skoltech Gaming Club providing remote presence and interaction capabilities.',
    content: {
      blocks: [
        {
          id: '1',
          type: 'text',
          content: 'Developed an IoT telepresence mobile robot for the Skoltech Gaming Club, enabling remote participation and interaction in gaming events and activities.',
          order: 0
        }
      ]
    },
    technologies: ['IoT', 'Robotics', 'Mobile Development', 'Telepresence', 'Real-time Communication'],
    start_date: '2025-02-01',
    end_date: '2025-03-31',
    status: 'completed',
    is_featured: false
  }
]

export const sampleExperiences = [
  // IT Project Manager experiences
  {
    resume_type: 'it-project-manager',
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
    is_visible: true
  },
  {
    resume_type: 'it-project-manager',
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
    is_visible: true
  },
  // Media Producer experiences
  {
    resume_type: 'media-producer',
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
    is_visible: true
  },
  {
    resume_type: 'media-producer',
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
    is_visible: true
  },
  // Business Development experiences
  {
    resume_type: 'business-development',
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
    is_visible: true
  },
  {
    resume_type: 'business-development',
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
    is_visible: true
  }
]