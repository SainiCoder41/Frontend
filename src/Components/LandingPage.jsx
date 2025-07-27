import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold text-blue-400">Codex</div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-blue-400 transition-colors">Area</a>
          <a href="#benefits" className="hover:text-blue-400 transition-colors">Benefits</a>
          <a href="#specs" className="hover:text-blue-400 transition-colors">Specifications</a>
          <a href="#howto" className="hover:text-blue-400 transition-colors">How-to</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Contact Us</a>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Login</button>
          <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-blue-400">Browse</span> everything.
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            The ultimate coding platform for developers of all levels. 
            Learn, practice, and collaborate in one powerful environment.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Coding screen" 
            className="rounded-lg shadow-2xl border border-gray-800"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-5xl font-bold text-blue-400 mb-2">78%</div>
              <div className="text-gray-400">Efficiency Improvements</div>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-5xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-gray-400">Built-in Code Templates</div>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="text-5xl font-bold text-blue-400 mb-2">30</div>
              <div className="text-gray-400">Programming Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Growth</h2>
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {[2021, 2022, 2023, 2024].map((year) => (
            <div key={year} className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mb-2"></div>
              <div className="text-gray-400">{year}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-blue-400 mb-4 md:mb-0">Codex</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Codex Coding Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;