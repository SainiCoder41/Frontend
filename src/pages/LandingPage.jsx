import React, { useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import heroSection from "../image/heroSection2.webp";
import coding from "../image/coding.jpg"
const LandingPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Enhanced stats with icons
  const stats = [
    { value: '78%', label: 'Efficiency Boost', icon: '⚡' },
    { value: '100+', label: 'Smart Templates', icon: '📋' },
    { value: '30', label: 'Languages', icon: '🌐' },
    { value: '24/7', label: 'AI Support', icon: '🤖' }
  ];

  // Timeline years with more detailed milestones
  const years = [2021, 2022, 2023, 2024];

  const getMilestoneTitle = (index) => {
    const titles = [
      "Genesis Launch",
      "Collaboration Update",
      "Global Community",
      "AI Revolution"
    ];
    return titles[index] || `Milestone ${index + 1}`;
  };

  const getMilestoneDescription = (index) => {
    const descriptions = [
      "Born from developer frustration with existing tools",
      "Real-time collaboration and pair programming features",
      "500k+ developers across 100+ countries",
      "Integrated AI that learns your coding style"
    ];
    return descriptions[index] || `Significant achievement in ${2021 + index}`;
  };

  // Feature cards data
  const features = [
    {
      title: "AI Pair Programmer",
      description: "Get real-time suggestions from an AI that understands your coding style",
      icon: "💡"
    },
    {
      title: "Interactive Learning",
      description: "Built-in courses with hands-on coding challenges",
      icon: "🎓"
    },
    {
      title: "Cloud Workspaces",
      description: "Access your dev environment from anywhere, anytime",
      icon: "☁️"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Codex cut my debugging time in half. The AI suggestions are scarily accurate.",
      author: "Sarah K., Senior Developer",
      role: "Tech Lead at InnovateCo"
    },
    {
      quote: "I went from beginner to job-ready in 6 months with their interactive courses.",
      author: "Miguel T.",
      role: "Junior Developer"
    },
    {
      quote: "Our team's productivity skyrocketed after switching to Codex's collaborative environment.",
      author: "David L.",
      role: "CTO at StartupX"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {/* Particle background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0
            }}
            animate={{
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
              opacity: [0, 0.3, 0],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900 rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-900 rounded-full filter blur-[100px] opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex justify-between items-center p-6 border-b border-gray-800 backdrop-blur-sm bg-gray-900/80 fixed w-full top-0 z-50"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center"
        >
          <span className="mr-2">🚀</span> Codex
        </motion.div>
       
        <div className="flex space-x-4">
          <NavLink to="/login">
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(30, 41, 59, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-md hover:bg-gray-800/50 transition-all border border-gray-700 hover:border-blue-400"
            >
              Login
            </motion.button>
          </NavLink>

          <NavLink to="/signup">
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                background: "linear-gradient(45deg, #2563eb, #7c3aed)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md transition-all hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
              />
            </motion.button>
          </NavLink>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 flex flex-col md:flex-row items-center relative z-10 pt-24">
        <div className="md:w-1/2 mb-16 md:mb-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700 text-sm text-blue-400"
          >
            🎉 Most loved dev platform 2024
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Code Smarter, 
            </span> 
            <br />
            <span className="text-gray-300">Not Harder</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-lg"
          >
            The AI-powered coding platform that adapts to your style. 
            Write better code faster with intelligent assistance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <NavLink to="/signup">
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(59, 130, 246, 0.7)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/40 font-medium relative overflow-hidden group"
              >
                <span className="relative z-10">Start Coding Free</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                />
              </motion.button>
            </NavLink>
       
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderColor: "rgba(96, 165, 250, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center space-x-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <motion.img
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i+20}.jpg`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-800"
                />
              ))}
            </div>
            <div className="text-gray-400 text-sm">
              <span className="text-white font-medium">10,000+</span> developers building with Codex
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: 30 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:w-1/2 relative"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
          
      

       <div className="relative group max-w-4xl mx-auto my-12">
      {/* Glow effect */}
      <div className="absolute -inset-3 bg-blue-500/20 rounded-2xl blur-xl group-hover:opacity-80 transition-opacity duration-300"></div>
      
      {/* Shadow container */}
      <div className="relative rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.4)] transition-shadow duration-300">
        <video 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-xl transform group-hover:scale-[1.01] transition-transform duration-300"
        >
          <source src="/videos/demo.webm" type="video/webm" />
          <source src={heroSection} type="video/mp4" />
        </video>
      </div>
    </div>
          
          {/* Floating code snippets */}
         
          
         
        </motion.div>
      </section>

      {/* Logo Cloud */}
      <section className="py-16 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800 relative z-10">
        <div className="container mx-auto px-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-gray-400 mb-12"
          >
            Trusted by teams at
          </motion.p>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-12"
          >
            {['TechCorp', 'DevHouse', 'InnovateX', 'CodeWave', 'PixelForge'].map((company, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              >
                {company}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Supercharge
              </span> your workflow
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to code efficiently in one seamless environment
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100
                    }
                  }
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                }}
                className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-400/30 transition-all hover:bg-gray-800/70"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="mt-4 flex items-center text-blue-400 cursor-pointer"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}
                className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-1/2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Experience
                </span> the power
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                See how Codex transforms your coding workflow with intelligent suggestions and real-time collaboration.
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8"
              >
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-mono text-sm">
                  <div className="text-purple-400">function</div>
                  <div className="text-blue-400 ml-4">// AI suggests optimized code</div>
                  <div className="text-green-400 ml-4">const</div>
                  <div className="text-gray-300 ml-8">result =</div>
                </div>
              </motion.div>
              
              <NavLink to="/signup">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Try Live Demo
                </motion.button>
              </NavLink>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 z-10"></div>
                <img 
                  src={coding} 
                  alt="Codex interface" 
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-gray-300">Live collaboration</span>
                    </div>
               
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
          
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">developers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of developers who transformed their workflow
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100
                    }
                  }
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-400/30 transition-all"
              >
                <div className="text-2xl mb-4 text-yellow-400">"</div>
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-700 pt-4">
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/50 to-gray-900 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-16 text-center"
          >
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Journey</span>
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="relative py-16"
          >
            {/* Main timeline line */}
            <div className="absolute top-0 left-1/2 h-full w-1 bg-gradient-to-b from-gray-800 via-blue-500 to-gray-800 transform -translate-x-1/2 z-0"></div>
            
            <div className="container mx-auto px-6">
              {/* Timeline items */}
              <div className="relative">
                {years.map((year, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      key={year}
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 120,
                            damping: 12
                          }
                        }
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
                      }}
                      className={`relative mb-16 last:mb-0 flex ${isEven ? 'justify-start' : 'justify-end'}`}
                    >
                      {/* Content container */}
                      <div className={`w-full md:w-1/2 p-8 bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-400/50 transition-all ${isEven ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}>
                        {/* Connecting line */}
                        <div className={`absolute top-1/2 ${isEven ? 'right-0 md:right-auto md:left-full' : 'left-0 md:left-auto md:right-full'} h-0.5 w-8 md:w-16 bg-gradient-to-r ${isEven ? 'from-blue-500 to-gray-700 md:from-gray-700 md:to-blue-500' : 'from-gray-700 to-blue-500 md:from-blue-500 md:to-gray-700'}`}></div>
                        
                        {/* Year indicator */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 ${isEven ? '-right-4 md:-right-8' : '-left-4 md:-left-8'} w-10 h-10 flex items-center justify-center`}>
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30"
                          >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                            {year}
                          </div>
                          <div className="text-xl text-gray-300 mb-4">
                            {getMilestoneTitle(index)}
                          </div>
                          <div className="text-gray-500">
                            {getMilestoneDescription(index)}
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-6 relative h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(index + 1) * 25}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              viewport={{ once: true }}
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Final milestone marker */}
              <div className="relative flex justify-center mt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 10 }}
                  viewport={{ once: true }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30"
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-gray-900/30 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block mb-8 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 text-sm text-blue-400"
          >
            🚀 Ready to transform your coding?
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Start coding smarter <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">today</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Join the developer revolution with Codex. No credit card required.
          </motion.p>
          
          <NavLink to="/signup">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.7)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/40 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started Free</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                />
              </motion.button>
            </motion.div>
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 md:mb-0 flex items-center"
            >
              <span className="mr-2">🚀</span> Codex
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6"
            >
              {['Product', 'Features', 'Pricing', 'Resources', 'Blog', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ 
                    color: '#60a5fa',
                    y: -2
                  }}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Codex. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              {['twitter', 'github', 'linkedin', 'discord'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ 
                    y: -3,
                    color: '#60a5fa'
                  }}
                  className="text-gray-400 hover:text-blue-400 transition-all"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-6 h-6">
                    {/* In a real app, you would use actual icons here */}
                    {social === 'twitter' && '𝕏'}
                    {social === 'github' && '⎔'}
                    {social === 'linkedin' && 'Ⓛ'}
                    {social === 'discord' && '◈'}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;