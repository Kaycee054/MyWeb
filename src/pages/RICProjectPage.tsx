import React from 'react'
import { motion } from 'framer-motion'
import { Layout } from '../components/Layout'
import { ArrowRight, Zap, Briefcase, Users, Globe, Target, FileText, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RICProjectPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dgifshcbo/image/upload/v1765149317/20251109_0859_New_Video_simple_compose_01k9kk5dtpedza51t67bdakyd9_pomsmh.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider"
              >
                Nigeria's Next-Generation Innovation Ecosystem
              </motion.p>
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
                Research & Innovation City
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                RIC is a next-generation ecosystem and mini-city dedicated to applied research, deep industry collaboration, and entrepreneurship. Our goal is to help Nigeria and Africa develop custom, high-impact solutions for real-world challenges, drive technological and industrial advancement, and build a resilient, knowledge-based economy anchored in strong intellectual property.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center sm:justify-start space-x-2">
                <FileText className="w-5 h-5" />
                <span>Download Concept Note</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#partnership"
                className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center justify-center sm:justify-start space-x-2"
              >
                <span>Partner With Us</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/20">
              <div className="relative rounded-lg overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dgifshcbo/image/upload/v1765149283/Screenshot_2025-11-08_at_12.36.09_yktqxp.png"
                  alt="RIC Concept"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Vision & Mission
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div
              {...fadeInUp}
              className="lg:col-span-2"
            >
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  RIC is designed as an integrated research and innovation cluster that sits at the intersection of academia, industry, and government. We are not just building solutions; we are building and empowering <span className="text-white font-semibold">new and existing industries</span> with cutting-edge knowledge, technology, and talent.
                </p>
                <div className="space-y-4">
                  <p className="font-semibold text-white">Our mission is to:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 font-bold mt-1">•</span>
                      <span>Enable Nigeria and Africa to develop <span className="text-white font-semibold">custom, innovative solutions</span> to local and global challenges.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 font-bold mt-1">•</span>
                      <span>Drive <span className="text-white font-semibold">technological and industrial advancement</span> across strategic sectors.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 font-bold mt-1">•</span>
                      <span>Build a <span className="text-white font-semibold">knowledge-based economy</span> with IP-driven value creation at its core.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-400 font-bold mt-1">•</span>
                      <span>Create a pipeline of <span className="text-white font-semibold">world-class researchers, founders, and operators</span> who can compete and collaborate globally.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="space-y-4"
            >
              {[
                { title: 'Reverse Brain Drain', desc: 'Retain and attract top African talent with meaningful research, career, and venture opportunities.' },
                { title: 'IP-First Value Creation', desc: 'Treat knowledge, patents, and deep tech as primary export products, not afterthoughts.' },
                { title: 'Global Yet Local', desc: 'Designed to meet African realities while seamlessly interfacing with global research and industry networks.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-blue-900/30 to-transparent border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/50 transition-all"
                >
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes RIC Different */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            What Makes RIC Different
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Applied Research at Scale',
                desc: 'RIC focuses on applied, problem-driven research, not research for its own sake. Every center and lab is aligned with industry needs and national priorities, with clear pathways to pilots, products, and deployment.',
                icon: Zap,
              },
              {
                title: 'Deep Industry Integration',
                desc: 'From day one, RIC is built to co-design projects with local and international companies, government agencies, and development partners. We aim to de-risk R&D for industry and accelerate technology transfer into the real economy.',
                icon: Briefcase,
              },
              {
                title: 'Entrepreneurship as a Default',
                desc: 'Spin-outs and startups are not side effects; they are core outputs. RIC will host incubators, accelerators, and venture-building programs to turn research into new enterprises, jobs, and exportable technologies.',
                icon: Target,
              },
            ].map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <Icon className="w-12 h-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Strategic Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-6 text-center"
          >
            Strategic Impact for Nigeria & Africa
          </motion.h2>

          <motion.p
            {...fadeInUp}
            className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            RIC aims to position Nigeria—and by extension Africa—as a <span className="text-white font-semibold">serious stakeholder on the global innovation stage</span>, while strengthening local industrial capacity and social resilience.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                title: 'Economic & Industrial Impact',
                icon: Globe,
                points: [
                  'Support the growth of advanced manufacturing, energy, health, agro-tech, and digital industries.',
                  'Improve national investment attractiveness and unlock new FDI channels focused on knowledge and IP.',
                ]
              },
              {
                title: 'Human Capital & Talent',
                icon: Users,
                points: [
                  'Retain top Nigerian and African MSc and PhD talent by offering world-class labs, supervisors, and projects without forcing them to leave the continent.',
                  'Partner with top African universities through joint programs, where RIC faculty and industry experts co-supervise applied research.',
                ]
              },
              {
                title: 'Geopolitics & Global Positioning',
                icon: Target,
                points: [
                  'Leverage frameworks like BRICS and broader South-South cooperation to connect African innovation to Russian and global ecosystems.',
                  'Build a corridor for technology, IP, and venture collaboration between Nigeria, Africa, Skoltech, and other international partners.',
                ]
              },
            ].map((section, idx) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <Icon className="w-10 h-10 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.points.map((point, pidx) => (
                          <li key={pidx} className="flex items-start space-x-3">
                            <span className="text-blue-400 font-bold mt-1">▸</span>
                            <span className="text-gray-300 leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How the Ecosystem Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            How the RIC Ecosystem Works
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { num: '01', title: 'Identify Real Problems', desc: 'Work with government, communities, and industry to define clear, high-impact challenges.' },
              { num: '02', title: 'Design Applied Research Programs', desc: 'Multi-disciplinary teams from partner universities, RIC centers, and industry co-create research projects with measurable outcomes.' },
              { num: '03', title: 'Build & Test Solutions', desc: 'Use RIC labs, prototyping facilities, and data infrastructure to build, simulate, and test solutions quickly and safely.' },
              { num: '04', title: 'Transfer & Scale', desc: 'License IP, create spin-off companies, or integrate solutions directly into existing enterprises and public systems.' },
              { num: '05', title: 'Measure Social & Economic Value', desc: 'Track not only financial returns, but also job creation, social impact, climate resilience, and knowledge spillovers.' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative flex gap-8 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  {idx < 4 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                  )}
                </div>
                <div className="flex-grow pt-2 pb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who RIC Serves */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Who RIC Serves
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Researchers & Postgraduates',
                desc: 'Access to serious, well-funded applied research opportunities, joint supervision, and pathways into industry and startups.',
                icon: Users,
              },
              {
                title: 'Industry & Corporates',
                desc: 'A single entry point to top African technical talent, tailored R&D, and co-development of IP.',
                icon: Briefcase,
              },
              {
                title: 'Government & Public Sector',
                desc: 'Evidence-based policy support, national tech capacity building, and pilots that can scale.',
                icon: Globe,
              },
              {
                title: 'Investors & Development Partners',
                desc: 'Curated deal flow in deep tech, with de-risked ventures emerging from structured research pipelines.',
                icon: Target,
              },
            ].map((stakeholder, idx) => {
              const Icon = stakeholder.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                >
                  <Icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-3">{stakeholder.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{stakeholder.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="partnership" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            {...fadeInUp}
            className="text-4xl font-bold text-white mb-8"
          >
            Let's Build the Future from Nigeria
          </motion.h2>

          <motion.div
            {...fadeInUp}
            className="mb-12 space-y-6 text-gray-300 text-lg leading-relaxed"
          >
            <p>
              RIC is still in its <span className="text-white font-semibold">ideation and early formulation</span> phase, but the vision is clear: a world-class, African-rooted research and innovation city that creates real economic and social value.
            </p>
            <p>
              We are actively seeking <span className="text-white font-semibold">strategic partners, advisors, industry collaborators, and early champions</span> who share this ambition.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/contact"
              className="group bg-white text-black px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Express Interest / Contact Us</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Request Concept Deck</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
