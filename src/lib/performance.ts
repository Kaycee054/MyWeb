export class PerformanceManager {
  private static instance: PerformanceManager

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager()
    }
    return PerformanceManager.instance
  }

  // Lazy load images
  setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              observer.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    const criticalResources = [
      '/IMG_2331.jpg',
      '/Kelechi_Ekpemiro_CV2025.pdf'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.jpg') ? 'image' : 'document'
      document.head.appendChild(link)
    })
  }

  // Optimize bundle loading
  setupModulePreloading(): void {
    // Preload critical chunks
    const criticalModules = [
      '/src/pages/HomePage.tsx',
      '/src/components/Hero.tsx',
      '/src/components/Navigation.tsx'
    ]

    criticalModules.forEach(module => {
      const link = document.createElement('link')
      link.rel = 'modulepreload'
      link.href = module
      document.head.appendChild(link)
    })
  }

  // Monitor Core Web Vitals
  measureWebVitals(): void {
    if ('web-vital' in window) {
      // This would integrate with web-vitals library if added
      console.log('Web Vitals monitoring enabled')
    }
  }

  // Service Worker registration
  registerServiceWorker(): void {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration)
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }

  // Initialize all performance optimizations
  init(): void {
    this.setupLazyLoading()
    this.preloadCriticalResources()
    this.setupModulePreloading()
    this.measureWebVitals()
    this.registerServiceWorker()
  }
}

export const performanceManager = PerformanceManager.getInstance()