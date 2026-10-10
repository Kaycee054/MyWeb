import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, GraduationCap, Briefcase, Award, ChevronDown } from 'lucide-react'

export function AboutMe() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section id="about-me" className="py-24 px-4 sm:px-6 lg:px-8 bg-apple-gray-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Photo */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
              className="relative"
            >
              <img
                src="https://res.cloudinary.com/dgifshcbo/image/upload/f_auto,q_auto,w_800/v1762684765/IMG_2331_2_nfpo8z.jpg"
                alt="Kelechi Ekpemiro"
                className="w-full max-w-md mx-auto rounded-apple-lg shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 rounded-apple-lg bg-gradient-to-t from-black/10 to-transparent" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.42, 0, 0.58, 1] }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 tracking-tight">
                About Kelechi
              </h2>

              <div className="space-y-5 text-apple-gray-300 leading-relaxed text-base sm:text-lg">
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
                  className="group inline-flex items-center gap-2 text-apple-gray-500 hover:text-apple-gray-300 font-medium transition-colors text-sm"
                >
                  <span>{showDetails ? 'Show Less' : 'View More'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
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
                    transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-8 border-t border-apple-gray-800 space-y-5 text-apple-gray-400 leading-relaxed text-sm">
                      <p>
                        A Nigerian engineer and project manager based in Moscow, Kelechi arrived in Russia in 2018 on a full scholarship. He graduated with honors in Information Science &amp; Computer Engineering from Kazan National Research Technological University (GPA 3.8/4.0), including an exchange semester at VSB Technical University of Ostrava in the Czech Republic. He completed his M.Sc. in Engineering Systems at the Skolkovo Institute of Science and Technology, where his research centered on computer vision, autonomous UAV systems, and AI-driven inspection platforms.
                      </p>

                      <p>
                        He is an active member of the Project Management Institute (PMI) and a Google-certified Project Management Professional. He co-founded <strong className="text-apple-gray-200">StraightenUp</strong>, an AI and wearables startup admitted to the Skolkovo Foundation ecosystem, and founded <strong className="text-apple-gray-200">Focus Films</strong>, a media production brand delivering videography, live broadcasting, and post-production for commercial and social projects. He is also involved with the <strong className="text-apple-gray-200">Polaris Innovation Network</strong> and works on telemedicine initiatives aimed at expanding access to care through technology.
                      </p>

                      <p>
                        His professional experience spans fintech and SME systems integration, including sales and integrations management for an automated accounting platform serving the UAE market, as well as marketing and data analytics work in Nigeria. He has led research on information flow in automated control systems, developed simulation frameworks for technology development programs, and contributed to projects from aerial search-and-rescue AI to automated aircraft inspection.
                      </p>

                      <div className="mt-8 grid grid-cols-2 gap-5">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-apple-blue" />
                          <span className="text-apple-gray-300">Moscow, Russia</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-apple-green" />
                          <span className="text-apple-gray-300">Skoltech M.Sc.</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-apple-blue" />
                          <span className="text-apple-gray-300">PMI Member</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-apple-gray-400" />
                          <span className="text-apple-gray-300">Skolkovo Founder</span>
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
