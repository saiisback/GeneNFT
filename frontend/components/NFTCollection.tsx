'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NFT } from '@/app/types';
import { nftApi } from '@/app/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Dna, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function NFTCollection() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoading(true);
        const data = await nftApi.getAll();
        setNfts(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch NFTs. Make sure the backend is running.');
        console.error('Error fetching NFTs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'Legendary';
      case 'epic':
        return 'Epic';
      case 'rare':
        return 'Rare';
      default:
        return 'Common';
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/30 mx-auto"></div>
            <p className="mt-4 text-white/70 text-lg font-cursive">Loading Genetic NFTs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400 text-lg font-cursive">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-elegant font-black text-white mb-6">
            <span className="gradient-text">Genetic</span>{' '}
            <span className="gradient-text-accent">NFT</span>{' '}
            <span className="gradient-text-gold">Collection</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-cursive">
            Explore unique genetic sequences transformed into verifiable digital art. 
            Each NFT represents a breakthrough in genetic research.
          </p>
        </motion.div>

        {/* Enhanced Stats with UK Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <motion.div 
            className="text-center p-6 rounded-lg glass-effect scan-line"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-elegant font-bold gradient-text mb-2">{nfts.length}</div>
            <div className="text-white/70 font-cursive font-medium">Total NFTs</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-lg glass-effect-accent scan-line"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-elegant font-bold gradient-text-accent mb-2">
              {nfts.filter(nft => nft.rarity === 'Legendary').length}
            </div>
            <div className="text-white/70 font-cursive font-medium">Legendary</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-lg glass-effect scan-line"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-elegant font-bold gradient-text-gold mb-2">
              {nfts.filter(nft => nft.rarity === 'Epic').length}
            </div>
            <div className="text-white/70 font-cursive font-medium">Epic</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-lg glass-effect scan-line"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-elegant font-bold gradient-text mb-2">
              {nfts.filter(nft => nft.rarity === 'Rare').length}
            </div>
            <div className="text-white/70 font-cursive font-medium">Rare</div>
          </motion.div>
        </motion.div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={`/nft/${nft.id}`}>
                <Card className="overflow-hidden border-white/10 bg-black/60 backdrop-blur-sm hover:border-white/20 transition-all duration-300 cursor-pointer">
                  {/* NFT Image */}
                  <div className="relative h-64 overflow-hidden">
                    {nft.metadata.image ? (
                      <img
                        src={nft.metadata.image}
                        alt={nft.metadata.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                        <Dna className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white shadow-lg`}>
                        {getRarityLabel(nft.rarity)}
                      </span>
                    </div>

                    {/* Subtle Pattern Overlay */}
                    <div className="absolute inset-0 subtle-pattern opacity-20 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Eye className="w-12 h-12 text-white mx-auto mb-2" />
                        <p className="text-white font-cursive font-medium">View Details</p>
                      </div>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white group-hover:text-white/90 transition-colors font-elegant">
                      {nft.metadata.name}
                    </CardTitle>
                    <p className="text-white/70 text-sm line-clamp-2 font-cursive">
                      {nft.metadata.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60 font-cursive">Token ID:</span>
                        <span className="font-mono text-white/80 text-xs">{nft.token_id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60 font-cursive">Owner:</span>
                        <span className="font-mono text-white/80 text-xs">
                          {truncateAddress(nft.owner)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60 font-cursive">Hash:</span>
                        <span className="font-mono text-white/80 text-xs">
                          {truncateAddress(nft.xml_hash)}
                        </span>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {nft.metadata.attributes.slice(0, 3).map((attr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/5 border border-white/20 text-white/80 text-xs rounded-md font-cursive"
                        >
                          {attr.trait_type}: {attr.value}
                        </span>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/50 font-cursive">Click to explore</span>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {nfts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2 font-elegant">No NFTs Found</h3>
            <p className="text-white/60 mb-6 font-cursive">
              Be the first to upload genetic data and create unique NFTs!
            </p>
            <Button size="lg" className="elegant-border">
              <Zap className="w-5 h-5 mr-2" />
              Upload Your First XML
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
