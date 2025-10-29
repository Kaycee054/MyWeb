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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/IMG_2331.jpg"
          alt="Professional Portrait"
          className="w-full h-full object-cover object-[center_20%] opacity-30"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1";
            target.className = "w-full h-full object-cover object-[center_20%] opacity-30";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
        >
          <span className="block">Engineer.</span>
          <span className="block">Project Manager.</span>
          <span className="block text-gray-300">Innovator.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          I turn ideas into systems, stories, and sustainable businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center items-center"
        >
          <button 
            onClick={scrollToAbout}
            className="text-gray-300 hover:text-white transition-colors italic text-lg flex items-center space-x-2 group"
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
        <ChevronDown className="w-6 h-6 text-white animate-bounce" />
      </motion.div>
    </section>
  )
}