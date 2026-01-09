export async function downloadPageAsPDF(filename: string = 'document.pdf') {
  try {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).html2pdf) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve()
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')

    const elementsToHide = [
      ...Array.from(document.querySelectorAll('nav')),
      ...Array.from(document.querySelectorAll('[class*="Navigation"]')),
      ...Array.from(document.querySelectorAll('footer')),
      ...Array.from(document.querySelectorAll('[data-hide-in-pdf="true"]')),
    ]

    const originalDisplayValues = elementsToHide.map(el => ({
      element: el,
      display: (el as HTMLElement).style.display
    }))

    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none'
    })

    const scrollY = window.scrollY
    window.scrollTo(0, 0)

    const content = document.querySelector('main') || document.body

    const sections = content.querySelectorAll('section')
    sections.forEach((section, index) => {
      if (index > 0) {
        section.classList.add('pdf-page-break')
      }
    })

    const style = document.createElement('style')
    style.textContent = `
      .pdf-page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
    `
    document.head.appendChild(style)

    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#0f172a',
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
      },
      jsPDF: {
        unit: 'mm',
        format: [135, 240],
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.pdf-page-break',
        avoid: ['img']
      }
    }

    const html2pdf = (window as any).html2pdf
    await html2pdf().set(opt).from(content).save()

    sections.forEach((section) => {
      section.classList.remove('pdf-page-break')
    })
    document.head.removeChild(style)

    originalDisplayValues.forEach(({ element, display }) => {
      (element as HTMLElement).style.display = display
    })

    window.scrollTo(0, scrollY)

  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to download PDF. Please try again.')

    const elementsToShow = document.querySelectorAll('[data-hide-in-pdf="true"]')
    elementsToShow.forEach(el => {
      (el as HTMLElement).style.display = ''
    })
  }
}
