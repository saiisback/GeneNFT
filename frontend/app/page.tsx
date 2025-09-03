'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import NFTCollection from '@/components/NFTCollection';
import UploadForm from '@/components/UploadForm';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    // You could add a success notification here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              GeneNFT
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-cyan-300 hover:text-cyan-400 transition-colors"
              >
                Collection
              </button>
              <button
                onClick={() => setShowUploadForm(true)}
                className="text-cyan-300 hover:text-cyan-400 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        {showUploadForm ? (
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        ) : (
          <NFTCollection />
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-black/60 border-t border-cyan-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">GeneNFT</h3>
              <p className="text-cyan-300/60">
                Revolutionizing genetic research through blockchain technology and AI-generated art.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Technology</h3>
              <ul className="text-cyan-300/60 space-y-2">
                <li>Blockchain NFTs</li>
                <li>AI Art Generation</li>
                <li>Genetic Data Processing</li>
                <li>Research Collaboration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
              <ul className="text-cyan-300/60 space-y-2">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyan-500/20 pt-8">
            <p className="text-cyan-300/40">
              © 2024 GeneNFT. Built for the future of genetic research.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
