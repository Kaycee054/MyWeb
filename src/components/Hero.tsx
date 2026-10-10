import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

export function Hero() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-me')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-apple-gray-950">
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_1920/v1762684765/IMG_2331_sd7mzb.jpg"
          alt="Professional Portrait"
          className="w-full h-full object-cover object-[center_20%] opacity-50"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-apple-gray-950/70 via-apple-gray-950/50 to-apple-gray-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight"
        >
          <span className="block text-white">Engineer.</span>
          <span className="block text-white">Project Manager.</span>
          <span className="block text-apple-gray-400">Innovator.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
          className="text-xl sm:text-2xl lg:text-3xl text-apple-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-tight"
        >
          Turning ideas into systems, stories, and sustainable ventures.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.42, 0, 0.58, 1] }}
          className="flex justify-center items-center"
        >
          <button
            onClick={scrollToAbout}
            className="text-apple-gray-400 hover:text-white transition-colors text-base flex items-center space-x-2 group"
          >
            <span>Want to know more about me?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToAbout}
      >
        <ChevronDown className="w-6 h-6 text-apple-gray-500 animate-bounce" />
      </motion.div>
    </section>
  )
}
