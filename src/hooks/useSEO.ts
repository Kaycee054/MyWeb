import { useEffect } from 'react'
import { seoManager, SEOData } from '../lib/seo'

export function useSEO(seoData: SEOData) {
  useEffect(() => {
    seoManager.updatePageSEO(seoData)
  }, [seoData])
}