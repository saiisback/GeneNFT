'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Connect from './Connect';
import { Home, FolderOpen, Upload, Eye, Zap, Store } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/collection', label: 'Collection', icon: FolderOpen },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/gene-view', label: 'Gene View', icon: Eye },
    { href: '/mutation', label: 'Mutation', icon: Zap },
    { href: '/marketplace', label: 'Marketplace', icon: Store },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-elegant">
            GeneNFT
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-cursive ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ThirdWeb Connect Button */}
          <div className="flex items-center space-x-4">
            <Connect />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-300 text-center ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-cursive">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
