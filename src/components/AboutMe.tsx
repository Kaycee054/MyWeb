import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, GraduationCap, Briefcase, Award, ChevronDown, Quote } from 'lucide-react'

export function AboutMe() {
  const [showDetails, setShowDetails] = useState(false)

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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                About Kelechi
              </h2>

              <div className="space-y-5 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Kelechi Ekpemiro</strong> believes that the most meaningful work happens at the intersection of technology, systems thinking, and real human need. He builds products and ventures that are not just clever but consequential: things that move the needle on how people live, work, and organize themselves.
                </p>

                <p>
                  His worldview is simple. Innovation without impact is a hobby. Systems without efficiency are debt. Ventures without social and economic value are noise. He is drawn to problems where designing the right system can compress months of effort into minutes, where a well-built product can open doors for thousands of people, and where a thoughtfully structured venture can create abundance without cutting corners on ethics.
                </p>

                <p>
                  Whether it is an AI platform that keeps people healthier, a research ecosystem that positions an entire continent as a serious player in global innovation, or a media brand that helps founders tell their story, Kelechi's work is rooted in the same conviction: it is possible to build meaningfully at any scale, and to do so ethically and without compromise. A Christian, he carries that quiet conviction into every project, every team, and every venture he touches.
                </p>
              </div>

              {/* View More Button */}
              <div className="mt-8">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="group inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  <span>{showDetails ? 'Show Less' : 'View Qualifications'}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {/* Expandable Qualifications */}
              <AnimatePresence initial={false}>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-5 text-gray-400 leading-relaxed text-sm">
                      <p>
                        A Nigerian engineer and project manager based in Moscow, Kelechi arrived in Russia in 2018 on a full scholarship. He graduated with honors in Information Science &amp; Computer Engineering from Kazan National Research Technological University (GPA 3.8/4.0), including an exchange semester at VSB Technical University of Ostrava in the Czech Republic. He completed his M.Sc. in Engineering Systems at the Skolkovo Institute of Science and Technology, where his research centered on computer vision, autonomous UAV systems, and AI-driven inspection platforms.
                      </p>

                      <p>
                        He is an active member of the Project Management Institute (PMI) and a Google-certified Project Management Professional. He co-founded <strong className="text-gray-200">StraightenUp</strong>, an AI and wearables startup admitted to the Skolkovo Foundation ecosystem, and founded <strong className="text-gray-200">Focus Films</strong>, a media production brand delivering videography, live broadcasting, and post-production for commercial and social projects.
                      </p>

                      <p>
                        His professional experience spans fintech and SME systems integration, including sales and integrations management for an automated accounting platform serving the UAE market, as well as marketing and data analytics work in Nigeria. He has led research on information flow in automated control systems, developed simulation frameworks for technology development programs, and contributed to projects from aerial search-and-rescue AI to automated aircraft inspection.
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300">Moscow, Russia</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Skoltech M.Sc.</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300">PMI Member</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-300">Skolkovo Founder</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
