import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  // Animation controls
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

  // Stats items with animation variants
  const stats = [
    { value: '78%', label: 'Efficiency Improvements' },
    { value: '100+', label: 'Built-in Templates' },
    { value: '30', label: 'Languages Supported' }
  ];

  // Timeline years
  const years = [2021, 2022, 2023, 2024];

  // Helper functions for timeline content
  const getMilestoneTitle = (index) => {
    const titles = [
      "Platform Launch",
      "First Major Update",
      "Community Milestone",
      "Current Version"
    ];
    return titles[index] || `Milestone ${index + 1}`;
  };

  const getMilestoneDescription = (index) => {
    const descriptions = [
      "Initial release with 10 supported languages",
      "Added collaborative features and 15 new languages",
      "Reached 100,000 active developers",
      "Most powerful version with AI-assisted coding"
    ];
    return descriptions[index] || `Significant achievement in ${2021 + index}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-900 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

<div>
  {/* Navigation */}
  <motion.nav 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-between items-center p-6 border-b border-gray-800 backdrop-blur-sm bg-gray-900/80 fixed w-full top-0 z-50"
  >
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
    >
      Codex
    </motion.div>
   
    <div className="flex space-x-4">
      <NavLink to="/login">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-md hover:bg-gray-800 transition-all border border-gray-700 hover:border-blue-400"
      >
        Login
      </motion.button>
      </NavLink>


      <NavLink to="/signup">
  <motion.button 
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
        }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md transition-all hover:shadow-lg hover:shadow-blue-500/30"
      >
        Sign Up
      </motion.button>
      </NavLink>
    
    </div>
  </motion.nav>

  {/* Add padding to the first element after nav to prevent content hiding */}
  <div className="pt-24"> {/* Adjust this value based on your nav height */}
    {/* Your page content goes here */}
  </div>
</div>
     

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2 mb-16 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Codex
            </span> 
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-lg"
          >
            The ultimate coding platform for developers of all levels. 
            Learn, practice, and collaborate in one powerful environment.
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
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/40 font-medium"
            >
              Get Started
            </motion.button>
            </NavLink>
       
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(156, 163, 175, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all font-medium"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:w-1/2 relative"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Coding screen" 
            className="relative z-10 rounded-xl shadow-2xl border border-gray-800 transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-blue-500 rounded-lg filter blur-xl opacity-30 animate-pulse"></div>
        </motion.div>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Growth</span>
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
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
            <div className="absolute top-0 left-1/2 h-full w-0.5 bg-gradient-to-b from-gray-800 via-blue-500 to-gray-800 transform -translate-x-1/2 z-0"></div>
            
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
                        scale: 1.05,
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                      }}
                      className={`relative mb-16 last:mb-0  flex ${isEven ? 'justify-start' : 'justify-end'}`}
                    >
                      {/* Content container */}
                      <div className={`w-full md:w-1/2 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-400/50 transition-all ${isEven ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}>
                        {/* Connecting line */}
                        <div className={`absolute top-1/2 ${isEven ? 'right-0 md:right-auto md:left-full' : 'left-0 md:left-auto md:right-full'} h-0.5 w-8 md:w-16 bg-gradient-to-r ${isEven ? 'from-blue-500 to-gray-700 md:from-gray-700 md:to-blue-500' : 'from-gray-700 to-blue-500 md:from-blue-500 md:to-gray-700'}`}></div>
                        
                        {/* Year indicator */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 ${isEven ? '-right-4 md:-right-8' : '-left-4 md:-left-8'} w-8 h-8 flex items-center justify-center`}>
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                            {year}
                          </div>
                          <div className="text-gray-400 mb-4">
                            {getMilestoneTitle(index)}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {getMilestoneDescription(index)}
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-4 relative h-2 bg-gray-700 rounded-full overflow-hidden">
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
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30"
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </motion.div>
              </div>
              
              {/* Final CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: years.length * 0.2 + 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-16"
              >
                
                
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">elevate</span> your coding journey?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Join thousands of developers who are already building amazing projects with Codex.
          </motion.p>
          
          <NavLink to="/signup">
 <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.7)'
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/40 relative overflow-hidden"
            >
              <span className="relative z-10">Start Coding Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
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
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 md:mb-0"
            >
              Codex
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6"
            >
              {['Terms', 'Privacy', 'Docs', 'Support', 'Careers', 'Blog'].map((item) => (
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
            className="mt-12 text-center text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} Codex Coding Platform. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;