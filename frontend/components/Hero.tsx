'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Dna, Brain, Code } from 'lucide-react';
import AnimatedBlob from './AnimatedBlob';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Elements */}
      <AnimatedBlob />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-cyan-900/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent">
              GeneNFT
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300/80 max-w-3xl mx-auto leading-relaxed">
            The future of genetic research meets blockchain technology. 
            Transform your XML data into unique, verifiable NFTs with AI-generated visual art.
          </p>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center space-x-8 mb-12"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30">
              <Dna className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-sm text-cyan-300/60">Genetic Data</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-purple-300/60">AI Generation</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-magenta-500/20 border border-magenta-500/30">
              <Code className="w-6 h-6 text-magenta-400" />
            </div>
            <span className="text-sm text-magenta-300/60">Blockchain</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="xl" className="group">
            Explore Collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="xl">
            Upload XML
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">1000+</div>
            <div className="text-cyan-300/60">Genetic Sequences</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-purple-300/60">Researchers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-magenta-400 mb-2">50+</div>
            <div className="text-magenta-300/60">Institutions</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
