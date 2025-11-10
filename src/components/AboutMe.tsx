import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, GraduationCap, Briefcase, Award } from 'lucide-react'

export function AboutMe() {
  return (
    <section id="about-me" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Photo */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762684765/IMG_2331_2_nfpo8z.jpg"
                alt="Kelechi Ekpemiro"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                About Me
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  I'm <strong className="text-white">Kelechi Ekpemiro</strong>, a 25-year-old Nigerian engineer and project manager based in Moscow. Since 2018, I've pursued higher education in Russia on full scholarships, graduating with honors in Information Science & Computer Engineering and completing my M.Sc. in Engineering Systems at Skoltech.
                </p>
                
                <p>
                  I'm an active PMI member, cofounder of <strong className="text-white">StraightenUp</strong> (AI + wearables, Skolkovo Foundation), and I run a personal media brand delivering commercial, creative, and social projects. I've also worked in fintech and tourism startups, driving growth through technology and business development.
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Moscow, Russia</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <GraduationCap className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Skoltech M.Sc.</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">PMI Member</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center space-x-3"
                >
                  <Briefcase className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Skolkovo Founder</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}