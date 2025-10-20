export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
  structuredData?: any
}

export class SEOManager {
  private static instance: SEOManager

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager()
    }
    return SEOManager.instance
  }

  updatePageSEO(seoData: SEOData): void {
    // Update title
    document.title = seoData.title

    // Update meta description
    this.updateMetaTag('description', seoData.description)

    // Update keywords
    this.updateMetaTag('keywords', seoData.keywords.join(', '))

    // Update Open Graph tags
    this.updateMetaProperty('og:title', seoData.title)
    this.updateMetaProperty('og:description', seoData.description)
    this.updateMetaProperty('og:type', 'website')
    
    if (seoData.ogImage) {
      this.updateMetaProperty('og:image', seoData.ogImage)
    }

    // Update Twitter Card tags
    this.updateMetaName('twitter:card', 'summary_large_image')
    this.updateMetaName('twitter:title', seoData.title)
    this.updateMetaName('twitter:description', seoData.description)
    
    if (seoData.ogImage) {
      this.updateMetaName('twitter:image', seoData.ogImage)
    }

    // Update canonical URL
    if (seoData.canonicalUrl) {
      this.updateCanonicalUrl(seoData.canonicalUrl)
    }

    // Update structured data
    if (seoData.structuredData) {
      this.updateStructuredData(seoData.structuredData)
    }
  }

  private updateMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  private updateMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  private updateMetaName(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  private updateCanonicalUrl(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }

  private updateStructuredData(data: any): void {
    let script = document.querySelector('script[type="application/ld+json"]')
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)
  }

  generateResumeStructuredData(resume: any, experiences: any[], projects: any[]): any {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Kelechi Ekpemiro",
      "givenName": "Kelechi",
      "familyName": "Ekpemiro",
      "jobTitle": resume.title,
      "description": resume.description,
      "url": window.location.href,
      "image": resume.image_url || "/IMG_2331.jpg",
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
      "worksFor": experiences.map(exp => ({
        "@type": "Organization",
        "name": exp.company,
        "jobTitle": exp.title,
        "startDate": exp.start_date,
        "endDate": exp.end_date
      })),
      "knowsAbout": resume.skills || [],
      "hasCredential": projects.map(project => ({
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "keywords": project.technologies
      }))
    }
  }
}

export const seoManager = SEOManager.getInstance()