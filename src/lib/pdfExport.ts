export async function downloadPageAsPDF(filename: string = 'document.pdf') {
  try {
    const element = document.documentElement
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => {
      const html2pdf = (window as any).html2pdf
      html2pdf().set(opt).from(element).save()
    }
    document.head.appendChild(script)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to download PDF. Please try again.')
  }
}
