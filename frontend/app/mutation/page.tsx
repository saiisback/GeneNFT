'use client';

import { motion } from 'framer-motion';
import MutationPlayground from '@/components/MutationPlayground';
import ParticleBackground from '@/components/ParticleBackground';

export default function MutationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 pb-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent font-elegant mb-6"
          >
            Gene Mutation Playground
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/70 font-cursive max-w-3xl mx-auto"
          >
            Explore the fascinating world of genetic mutations. Watch as DNA sequences transform and discover how tiny changes create entirely new traits and abilities.
          </motion.p>
        </div>
      </motion.header>

      {/* Main Playground */}
      <main className="relative z-10 pb-20">
        <MutationPlayground />
      </main>
    </div>
  );
}
