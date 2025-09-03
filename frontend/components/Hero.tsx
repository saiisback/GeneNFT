'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Dna, Brain, Code, Rocket, Upload } from 'lucide-react';
import Link from 'next/link';
import AnimatedBlob from './AnimatedBlob';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-brsubtle-pattern">
      {/* Background Elements */}
      <AnimatedBlob />
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black z-10" />
      
      {/* Floating Elegant Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -2, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-32 w-24 h-24 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-1/4 w-20 h-20 border border-white/10 rounded-full"
        />
      </div>
      
      {/* Main Hero Content Container */}
      <div className="relative z-20 pt-24  min-h-screen flex flex-col justify-center items-center px-4">
        {/* Main Hero Content */}
        <div className="text-center max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Main Title with Enhanced Typography */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-elegant font-black text-white mb-8 tracking-wider">
              <span className="gradient-text">GENE</span>
              <span className="gradient-text-accent">NFT</span>
            </h1>
            
            {/* Subtitle with Cursive Font */}
            <p className="text-lg md:text-xl lg:text-2xl font-cursive text-white/90 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
              <span className="text-white/70">The future of genetic research meets</span>{' '}
              <span className="gradient-text-accent">blockchain technology</span>. 
              Transform your XML data into unique, verifiable NFTs with 
              <span className="gradient-text-gold"> AI-generated visual art</span>.
            </p>
          </motion.div>

          {/* Enhanced Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12"
          >
            <motion.div 
              className="flex flex-col items-center space-y-3 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/20 elegant-glow group-hover:elegant-glow transition-all duration-300">
                <Dna className="w-8 h-8 text-white/80" />
              </div>
              <span className="text-sm font-cursive text-white/70 font-medium">Genetic Data</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-3 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/20 elegant-glow group-hover:elegant-glow transition-all duration-300">
                <Brain className="w-8 h-8 text-white/80" />
              </div>
              <span className="text-sm font-cursive text-white/70 font-medium">AI Generation</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-3 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/20 elegant-glow group-hover:elegant-glow transition-all duration-300">
                <Code className="w-8 h-8 text-white/80" />
              </div>
              <span className="text-sm font-cursive text-white/70 font-medium">Blockchain</span>
            </motion.div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/collection">
                <Button 
                  size="xl" 
                  className="group elegant-border px-8 py-4 text-lg font-cursive font-semibold bg-white/5 hover:bg-white/10"
                >
                  <Rocket className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Collection
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/upload">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="px-8 py-4 text-lg font-cursive font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50 elegant-glow hover:elegant-glow transition-all duration-300"
                >
                  <Upload className="mr-3 w-6 h-6" />
                  Upload XML
                </Button>
              </Link>
            </motion.div>
            

          </motion.div>
        </div>

        {/* Enhanced Stats with UK Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-6xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-6 rounded-lg glass-effect scan-line"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl md:text-4xl font-elegant font-bold gradient-text mb-2">1000+</div>
              <div className="text-white/70 font-cursive font-medium">Genetic Sequences</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 rounded-lg glass-effect-accent scan-line"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl md:text-4xl font-elegant font-bold gradient-text-accent mb-2">500+</div>
              <div className="text-white/70 font-cursive font-medium">Researchers</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 rounded-lg glass-effect scan-line"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl md:text-4xl font-elegant font-bold gradient-text-gold mb-2">50+</div>
              <div className="text-white/70 font-cursive font-medium">Institutions</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center elegant-glow">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-4 bg-white/60 rounded-full mt-2"
          />
        </div>
        <p className="text-center text-white/50 font-cursive text-sm mt-2">Scroll to explore</p>
      </motion.div>
    </section>
  );
}
