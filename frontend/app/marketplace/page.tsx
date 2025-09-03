'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

import ParticleBackground from '../../components/ParticleBackground';
import Navbar from '../../components/Navbar';
import { NFTListing, MarketplaceStats, NFT } from '../types';
import { getAllNFTs } from '../api';
import { useActiveAccount } from 'thirdweb/react';
import Connect from '../../components/Connect';

export default function MarketplacePage() {
  const activeAccount = useActiveAccount();
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<NFTListing | null>(null);

  useEffect(() => {
    loadMarketplaceData();
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeout);
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load marketplace data...');
      
      // Load data individually to handle failures gracefully
      let listingsData: NFTListing[] = [];
      let statsData: MarketplaceStats | null = null;
      let nftsData: NFT[] = [];
      
      try {
        console.log('Loading listings...');
        const listingsResponse = await fetch('http://127.0.0.1:3001/api/marketplace/listings');
        if (listingsResponse.ok) {
          listingsData = await listingsResponse.json();
          console.log('Listings loaded:', listingsData.length);
        }
      } catch (error) {
        console.error('Failed to load listings:', error);
      }
      
      try {
        console.log('Loading stats...');
        const statsResponse = await fetch('http://127.0.0.1:3001/api/marketplace/stats');
        if (statsResponse.ok) {
          statsData = await statsResponse.json();
          console.log('Stats loaded:', statsData);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
      
      try {
        console.log('Loading NFTs...');
        nftsData = await getAllNFTs();
        console.log('NFTs loaded:', nftsData.length);
      } catch (error) {
        console.error('Failed to load NFTs:', error);
      }
      
      console.log('Setting state with:', { listings: listingsData.length, stats: !!statsData, nfts: nftsData.length });
      setListings(listingsData);
      setStats(statsData);
      setNfts(nftsData);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleBuyNFT = (listing: NFTListing) => {
    if (!listing || !activeAccount) return;
    
    setSelectedListing(listing);
    setShowBuyModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedListing || !activeAccount) return;
    
    try {
      setBuying(selectedListing.nft_id);
      
      // Call the backend API to purchase the NFT
      const purchaseResponse = await fetch('http://127.0.0.1:3001/api/marketplace/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nft_id: selectedListing.nft_id,
          buyer_address: activeAccount.address,
          price: selectedListing.price
        })
      });

      if (!purchaseResponse.ok) {
        throw new Error('Failed to purchase NFT');
      }

      const purchaseResult = await purchaseResponse.json();
      console.log('NFT purchase successful:', purchaseResult);
      
      // Remove the purchased NFT from listings
      const updatedListings = listings.filter(listing => listing.nft_id !== selectedListing.nft_id);
      setListings(updatedListings);
      
      // Update stats
      if (stats) {
        const newTransaction = {
          id: purchaseResult.transaction.id,
          nft_id: selectedListing.nft_id,
          buyer: activeAccount.address,
          seller: selectedListing.seller,
          price: selectedListing.price,
          transaction_hash: purchaseResult.transaction.transaction_hash,
          timestamp: purchaseResult.transaction.timestamp
        };
        
        const updatedStats = {
          ...stats,
          total_listings: updatedListings.length,
          total_volume: stats.total_volume + selectedListing.price,
          recent_transactions: [newTransaction, ...stats.recent_transactions].slice(0, 10)
        };
        setStats(updatedStats);
      }
      
      alert(`NFT purchased successfully!\nPrice: ${selectedListing.price} ETH\n\nTransaction: ${purchaseResult.transaction.transaction_hash}\n\nThe NFT has been transferred to your wallet.`);
      
      // Close modal
      setShowBuyModal(false);
      setSelectedListing(null);
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      alert('Failed to purchase NFT. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  const getNFTDetails = (nftId: string) => {
    return nfts.find(nft => nft.id === nftId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-cursive">Loading marketplace...</p>
          <p className="text-white/40 text-sm mt-2">If this takes too long, check the browser console for errors</p>
          <button 
            onClick={() => setLoading(false)}
            className="mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Show Marketplace Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ParticleBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 pb-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent font-elegant mb-6"
          >
            NFT Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/70 font-cursive max-w-3xl mx-auto"
          >
            Discover, buy, and sell unique genetic NFTs. Explore the marketplace for rare DNA sequences and genomic data.
          </motion.p>
        </div>
      </motion.header>

      {/* Marketplace Stats */}
      {stats ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto px-4 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{stats.total_listings}</h3>
              <p className="text-white/70 font-cursive">Active Listings</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{stats.total_volume.toFixed(2)} ETH</h3>
              <p className="text-white/70 font-cursive">Total Volume</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{stats.recent_transactions.length}</h3>
              <p className="text-white/70 font-cursive">Recent Trades</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">
                {stats.floor_price ? `${stats.floor_price.toFixed(2)} ETH` : 'N/A'}
              </h3>
              <p className="text-white/70 font-cursive">Floor Price</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto px-4 mb-12"
        >
          <div className="text-center">
            <p className="text-white/60 font-cursive">Marketplace stats loading...</p>
          </div>
        </motion.div>
      )}

      {/* Active Listings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 pb-20"
      >
        <h2 className="text-3xl font-bold text-white mb-8 font-elegant text-center">Active Listings</h2>
        
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">Store</div>
            <p className="text-xl text-white/60 font-cursive">No active listings at the moment</p>
            <p className="text-white/40 mt-2 font-cursive">Check back later for new NFTs!</p>
            <div className="mt-6">
              <p className="text-white/50 text-sm mb-4">No demo NFTs available</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const nft = getNFTDetails(listing.nft_id);
              if (!nft) return null;
              
              return (
                <motion.div
                  key={listing.nft_id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 border border-white/20 rounded-2xl p-6 glass-effect"
                >
                  {/* NFT Image */}
                  <div className="mb-4">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* NFT Info */}
                  <h3 className="text-xl font-bold text-white mb-2 font-elegant">{nft.metadata.name}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{nft.metadata.description}</p>
                  
                  {/* Attributes */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-cursive">Rarity:</span>
                      <span className="text-white font-semibold">{nft.rarity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 font-cursive">Token ID:</span>
                      <span className="text-white font-mono">{nft.token_id}</span>
                    </div>
                  </div>
                  
                  {/* Price and Buy Button */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 font-cursive">Price:</span>
                      <span className="text-2xl font-bold text-green-400">{listing.price} ETH</span>
                    </div>
                    
                    {!activeAccount ? (
                      <div className="text-center">
                        <p className="text-white/60 font-cursive mb-3">Connect wallet to buy</p>
                        <Connect />
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleBuyNFT(listing)}
                        disabled={buying === listing.nft_id}
                        className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-bold py-3 rounded-lg transition-all duration-300"
                      >
                        {buying === listing.nft_id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          'Buy Now'
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Buy NFT Modal */}
      {showBuyModal && selectedListing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">Confirm Purchase</h3>
              <p className="text-white/70 font-cursive">Review your NFT purchase details</p>
            </div>

            {(() => {
              const nft = getNFTDetails(selectedListing.nft_id);
              if (!nft) return null;
              
              return (
                <div className="space-y-4 mb-6">
                  {/* NFT Preview */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="text-lg font-bold text-white mb-1">{nft.metadata.name}</h4>
                    <p className="text-white/60 text-sm">{nft.metadata.description}</p>
                  </div>

                  {/* Purchase Details */}
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60 font-cursive">Price:</span>
                      <span className="text-xl font-bold text-green-400">{selectedListing.price} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 font-cursive">Rarity:</span>
                      <span className="text-white font-semibold">{nft.rarity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 font-cursive">Token ID:</span>
                      <span className="text-white font-mono">{nft.token_id}</span>
                    </div>
                  </div>

                  {/* Wallet Info */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-cursive">Buying with:</span>
                      <span className="text-white font-mono text-sm">
                        {activeAccount?.address?.slice(0, 6)}...{activeAccount?.address?.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setShowBuyModal(false);
                  setSelectedListing(null);
                }}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPurchase}
                disabled={buying === selectedListing.nft_id}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
              >
                {buying === selectedListing.nft_id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Purchase'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
