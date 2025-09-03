'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NFT } from '@/app/types';
import { nftApi } from '@/app/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, Dna, Sparkles } from 'lucide-react';

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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-cyan-300 text-lg">Loading Genetic NFTs...</p>
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
            <p className="text-red-400 text-lg">{error}</p>
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent">
              Genetic NFT Collection
            </span>
          </h2>
          <p className="text-xl text-cyan-300/80 max-w-3xl mx-auto">
            Explore unique genetic sequences transformed into verifiable digital art. 
            Each NFT represents a breakthrough in genetic research.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{nfts.length}</div>
            <div className="text-cyan-300/60">Total NFTs</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {nfts.filter(nft => nft.rarity === 'Legendary').length}
            </div>
            <div className="text-purple-300/60">Legendary</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-magenta-500/10 border border-magenta-500/20">
            <div className="text-3xl font-bold text-magenta-400 mb-2">
              {nfts.filter(nft => nft.rarity === 'Epic').length}
            </div>
            <div className="text-magenta-300/60">Epic</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {nfts.filter(nft => nft.rarity === 'Rare').length}
            </div>
            <div className="text-blue-300/60">Rare</div>
          </div>
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
              <Card className="overflow-hidden border-cyan-500/20 bg-black/60 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
                {/* NFT Image */}
                <div className="relative h-64 overflow-hidden">
                  {nft.metadata.image ? (
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-purple-900/20 flex items-center justify-center">
                      <Dna className="w-16 h-16 text-cyan-400/50" />
                    </div>
                  )}
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white shadow-lg`}>
                      {nft.rarity}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* NFT Info */}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {nft.metadata.name}
                  </CardTitle>
                  <p className="text-cyan-300/70 text-sm line-clamp-2">
                    {nft.metadata.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300/60">Token ID:</span>
                      <span className="font-mono text-cyan-300">{nft.token_id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300/60">Owner:</span>
                      <span className="font-mono text-cyan-300 text-xs">
                        {truncateAddress(nft.owner)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300/60">Hash:</span>
                      <span className="font-mono text-cyan-300 text-xs">
                        {truncateAddress(nft.xml_hash)}
                      </span>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {nft.metadata.attributes.slice(0, 3).map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs rounded-md"
                      >
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
            <Sparkles className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No NFTs Found</h3>
            <p className="text-cyan-300/60 mb-6">
              Be the first to upload genetic data and create unique NFTs!
            </p>
            <Button size="lg">
              Upload Your First XML
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
