'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import NFTCollection from '@/components/NFTCollection';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {

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
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-elegant">
              GeneNFT
            </div>
            <div className="flex space-x-8">
                        <Link href="/collection" className="text-white/70 hover:text-white transition-colors font-cursive">
            Collection
          </Link>
          <Link href="/upload" className="text-white/70 hover:text-white transition-colors font-cursive">
            Upload
          </Link>
          <Link href="/gene-view" className="text-white/70 hover:text-white transition-colors font-cursive">
            Gene View
          </Link>
          <Link href="/mutation" className="text-white/70 hover:text-white transition-colors font-cursive">
            Mutation
          </Link>

            </div>
            
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 relative z-10">
        <NFTCollection />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-black/60 border-t border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-elegant">GeneNFT</h3>
              <p className="text-white/60 font-cursive">
                Revolutionizing genetic research through blockchain technology and AI-generated art.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-elegant">Technology</h3>
              <ul className="text-white/60 space-y-2 font-cursive">
                <li>Blockchain NFTs</li>
                <li>AI Art Generation</li>
                <li>Genetic Data Processing</li>
                <li>Research Collaboration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-elegant">Connect</h3>
              <ul className="text-white/60 space-y-2 font-cursive">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8">
            <p className="text-white/40 font-cursive">
              © 2025 GeneNFT. Built for the future of genetic research.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
