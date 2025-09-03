'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NFT } from '@/app/types';
import { nftApi } from '@/app/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Dna, Hash, Shield, Zap, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';

export default function CollectionPage() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');

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

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.metadata.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || nft.rarity.toLowerCase() === filterRarity.toLowerCase();
    return matchesSearch && matchesRarity;
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/30 mx-auto"></div>
          <p className="mt-4 text-white/70 text-lg font-cursive">Loading Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-elegant">
              GeneNFT
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-elegant font-black mb-6">
              <span className="gradient-text">NFT</span>{' '}
              <span className="gradient-text-accent">Collection</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-cursive">
              Explore our collection of unique genetic research NFTs, each representing 
              verifiable data with AI-generated visual art.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/30 font-cursive"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white font-cursive appearance-none"
                >
                  <option value="all">All Rarities</option>
                  <option value="legendary">Legendary</option>
                  <option value="epic">Epic</option>
                  <option value="rare">Rare</option>
                  <option value="common">Common</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-400 text-lg font-cursive">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {/* NFT Grid */}
          {!error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={`/nft/${nft.id}`}>
                    <Card className="overflow-hidden border-white/20 bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        {nft.metadata.image ? (
                          <img
                            src={nft.metadata.image}
                            alt={nft.metadata.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                            <Dna className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        
                        {/* Rarity Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white shadow-lg font-cursive`}>
                            {getRarityLabel(nft.rarity)}
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2 font-elegant truncate">
                          {nft.metadata.name}
                        </h3>
                        <p className="text-white/70 text-sm font-cursive line-clamp-2 mb-3">
                          {nft.metadata.description}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-white/60 font-cursive">
                          <span>Token #{nft.token_id}</span>
                          <span>{new Date(nft.created_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!error && filteredNFTs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Dna className="w-24 h-24 text-white/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 font-elegant">No NFTs Found</h3>
              <p className="text-white/70 font-cursive mb-8">
                {searchTerm || filterRarity !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No NFTs have been minted yet. Be the first to upload and mint a genetic NFT!'
                }
              </p>
              <Link href="/">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Collection Stats */}
          {!error && filteredNFTs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center space-x-8 bg-white/5 border border-white/20 rounded-lg px-8 py-4">
                <div>
                  <div className="text-2xl font-bold text-white font-elegant">{filteredNFTs.length}</div>
                  <div className="text-white/60 text-sm font-cursive">NFTs Found</div>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div>
                  <div className="text-2xl font-bold text-white font-elegant">{nfts.length}</div>
                  <div className="text-white/60 text-sm font-cursive">Total Collection</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
