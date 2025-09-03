'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { NFT } from '@/app/types';
import { getNFTById } from '@/app/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Copy, Dna, Hash, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';

export default function NFTPage() {
  const params = useParams();
  const [nft, setNft] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        setIsLoading(true);
        const data = await getNFTById(params.slug as string);
        setNft(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch NFT. Make sure the backend is running.');
        console.error('Error fetching NFT:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchNFT();
    }
  }, [params.slug]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
          <p className="mt-4 text-white/70 text-lg font-cursive">Loading NFT Data...</p>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ParticleBackground />
        <div className="text-center relative z-10">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md">
            <p className="text-red-400 text-lg font-cursive">{error || 'NFT not found'}</p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* NFT Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white shadow-lg font-cursive`}>
                {getRarityLabel(nft.rarity)}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-elegant font-black mb-4">
              <span className="gradient-text">{nft.metadata.name}</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-cursive">
              {nft.metadata.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* NFT Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="overflow-hidden border-white/20 bg-black/60 backdrop-blur-sm">
                <div className="relative h-96 overflow-hidden">
                  {nft.metadata.image ? (
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                      <Dna className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  
                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 subtle-pattern opacity-20" />
                </div>
              </Card>

              {/* External Links */}
              {nft.metadata.external_url && (
                <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 font-elegant">External Reference</h3>
                        <p className="text-white/70 text-sm font-cursive">{nft.metadata.external_url}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                        <a href={nft.metadata.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* NFT Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-elegant flex items-center">
                    <Zap className="w-6 h-6 text-white/80 mr-3" />
                    NFT Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/20">
                    <span className="text-white/80 font-cursive">Token ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white/80">{nft.token_id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nft.token_id, 'token')}
                        className="text-white/60 hover:text-white/80"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/20">
                    <span className="text-white/80 font-cursive">Owner:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white/80 text-sm">
                        {nft.owner.slice(0, 8)}...{nft.owner.slice(-6)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nft.owner, 'owner')}
                        className="text-white/60 hover:text-white/80"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/20">
                    <span className="text-white/80 font-cursive">Created:</span>
                    <span className="text-white/80 font-cursive">
                      {new Date(nft.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* XML Hash */}
              <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-elegant flex items-center">
                    <Hash className="w-6 h-6 text-white/80 mr-3" />
                    Data Hash
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-white/80 text-sm break-all">
                        {nft.xml_hash}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nft.xml_hash, 'hash')}
                        className="text-white/60 hover:text-white/80 ml-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mt-2 font-cursive">
                    This hash uniquely identifies the XML data content
                  </p>
                </CardContent>
              </Card>

              {/* Attributes */}
              <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-elegant flex items-center">
                    <Shield className="w-6 h-6 text-white/80 mr-3" />
                    Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nft.metadata.attributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/5 border border-white/20 rounded-lg"
                      >
                        <div className="text-white/80 font-semibold text-sm font-cursive">
                          {attr.trait_type}
                        </div>
                        <div className="text-white/60 text-sm font-cursive">
                          {attr.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* License & Provenance */}
              <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-elegant flex items-center">
                    <Shield className="w-6 h-6 text-white/80 mr-3" />
                    Legal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                    <div className="text-white/80 font-semibold text-sm font-cursive mb-1">License</div>
                    <div className="text-white/60 text-sm font-cursive">{nft.metadata.license}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                    <div className="text-white/80 font-semibold text-sm font-cursive mb-1">Provenance</div>
                    <div className="text-white/60 text-sm font-cursive">{nft.metadata.provenance}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Copy Success Message */}
          {copiedField && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 right-8 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm"
            >
              {copiedField === 'token' && 'Token ID copied!'}
              {copiedField === 'owner' && 'Owner address copied!'}
              {copiedField === 'hash' && 'Hash copied!'}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
