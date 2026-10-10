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
                About Kelechi
              </h2>

              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Kelechi Ekpemiro</strong> is a Nigerian engineer, project manager, and media producer based in Moscow. Since arriving in Russia in 2018 on a full scholarship, he has built a multi-disciplinary career spanning IT project management, AI and robotics research, media production, and business development across international markets.
                </p>

                <p>
                  He graduated with honors in Information Science &amp; Computer Engineering from Kazan National Research Technological University (GPA 3.8/4.0), including an exchange semester at VSB – Technical University of Ostrava in the Czech Republic. He later completed his M.Sc. in Engineering Systems at the Skolkovo Institute of Science and Technology (Skoltech), where his research centered on computer vision, autonomous UAV systems, and AI-driven inspection platforms.
                </p>

                <p>
                  Kelechi is an active member of the Project Management Institute (PMI) and a Google-certified Project Management Professional. He is a co-founder of <strong className="text-white">StraightenUp</strong>, an AI and wearables startup focused on posture monitoring and correction, admitted to the Skolkovo Foundation ecosystem. He also founded and runs <strong className="text-white">Focus Films</strong>, a media production brand delivering videography, live broadcasting, and post-production services for commercial, creative, and social projects.
                </p>

                <p>
                  His professional experience spans roles in fintech and SME systems integration — including sales and integrations management for an automated accounting platform serving the UAE market — as well as marketing and data analytics work in Nigeria. He has led research on information flow in automated control systems, developed simulation frameworks for technology development programs, and contributed to projects ranging from aerial search-and-rescue AI to automated aircraft inspection systems.
                </p>

                <p>
                  A Christian, Kelechi is driven by the quiet conviction that it is possible to build meaningfully at any scale — and to create abundance ethically, without compromise.
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
                  <Award className="w-5 h-5 text-blue-400" />
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
