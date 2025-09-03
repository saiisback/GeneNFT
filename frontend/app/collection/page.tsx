'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

import ParticleBackground from '../../components/ParticleBackground';
import Navbar from '../../components/Navbar';
import { UserCollection, NFT } from '../types';
import { listNFT, cancelListing, getUserCollection } from '../api';
import { useActiveAccount } from 'thirdweb/react';
import Connect from '../../components/Connect';

export default function CollectionPage() {
  const activeAccount = useActiveAccount();
  const [collection, setCollection] = useState<UserCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [listingNFT, setListingNFT] = useState<string | null>(null);
  const [cancellingListing, setCancellingListing] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('0x1234567890123456789012345678901234567890'); // Fallback demo address

  // Update wallet address when account changes
  useEffect(() => {
    if (activeAccount?.address) {
      setWalletAddress(activeAccount.address);
    }
  }, [activeAccount?.address]);

  useEffect(() => {
    loadUserCollection();
  }, [walletAddress]);

  const loadUserCollection = async () => {
    try {
      setLoading(true);
      console.log('Loading collection for wallet:', walletAddress);
      const collectionData = await getUserCollection(walletAddress);
      console.log('Collection data loaded:', collectionData);
      setCollection(collectionData);
    } catch (error) {
      console.error('Failed to load collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListNFT = async (nftId: string, price: number) => {
    try {
      console.log('Starting to list NFT:', { nftId, price, walletAddress });
      setListingNFT(nftId);
      
      const result = await listNFT({
        nft_id: nftId,
        price: price,
        seller_address: walletAddress
      });
      
      console.log('Listing result:', result);
      
      // Reload collection after listing
      await loadUserCollection();
      
      alert('NFT listed successfully!');
    } catch (error) {
      console.error('Failed to list NFT:', error);
      alert(`Failed to list NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setListingNFT(null);
    }
  };

  const handleCancelListing = async (nftId: string) => {
    try {
      setCancellingListing(nftId);
      
      await cancelListing({
        nft_id: nftId,
        price: 0, // Not used for cancellation
        seller_address: walletAddress
      });
      
      // Reload collection after cancellation
      await loadUserCollection();
      
      alert('Listing cancelled successfully!');
    } catch (error) {
      console.error('Failed to cancel listing:', error);
      alert('Failed to cancel listing. Please try again.');
    } finally {
      setCancellingListing(null);
    }
  };

  const ListNFTModal = ({ nft, onClose }: { nft: NFT; onClose: () => void }) => {
    const [price, setPrice] = useState('0.01');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const numPrice = parseFloat(price);
      if (numPrice > 0) {
        setIsSubmitting(true);
        try {
          await handleListNFT(nft.id, numPrice);
          onClose();
        } catch (error) {
          console.error('Listing failed:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-elegant">List NFT for Sale</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 font-cursive">Price (ETH)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                placeholder="0.01"
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-bold py-3 rounded-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Listing...
                  </>
                ) : (
                  'List NFT'
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-cursive">Loading collection...</p>
        </div>
      </div>
    );
  }

  // Show wallet connection if no account is connected
  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ParticleBackground />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="pt-32 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 border border-white/20 rounded-2xl p-12 glass-effect"
            >
              <h1 className="text-4xl font-bold text-white mb-6 font-elegant">Connect Your Wallet</h1>
              <p className="text-white/70 text-lg mb-8 font-cursive">
                Connect your wallet to view and manage your NFT collection.
              </p>
              <Connect />
            </motion.div>
          </div>
        </main>
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
            My Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/70 font-cursive max-w-3xl mx-auto mb-6"
          >
            Manage your genetic NFT collection. List NFTs for sale or view your transaction history.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={loadUserCollection}
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Refresh Collection
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Collection Stats */}
      {collection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto px-4 mb-12"
        >

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{collection.owned_nfts.length}</h3>
              <p className="text-white/70 font-cursive">Owned NFTs</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{collection.listed_nfts.length}</h3>
              <p className="text-white/70 font-cursive">Listed for Sale</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">{collection.transaction_history.length}</h3>
              <p className="text-white/70 font-cursive">Total Transactions</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 text-center glass-effect">
              <h3 className="text-2xl font-bold text-white mb-2 font-elegant">
                {collection.transaction_history.filter(tx => tx.buyer === walletAddress).length}
              </h3>
              <p className="text-white/70 font-cursive">Purchased NFTs</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Owned NFTs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-8 font-elegant text-center">Owned NFTs</h2>
        
        {collection?.owned_nfts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">Collection</div>
            <p className="text-xl text-white/60 font-cursive">No NFTs in your collection yet</p>
            <p className="text-white/40 mt-2 font-cursive">Upload some XML files to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection?.owned_nfts.map((nft) => (
              <motion.div
                key={nft.id}
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
                
                {/* Actions */}
                <div className="border-t border-white/10 pt-4">
                  {!nft.is_listed ? (
                    <Button
                      onClick={() => setListingNFT(nft.id)}
                      className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-bold py-3 rounded-lg transition-all duration-300"
                    >
                      List for Sale
                    </Button>
                  ) : (
                    <div className="text-center">
                      <p className="text-green-400 font-semibold mb-2 font-cursive">Listed for {nft.price} ETH</p>
                      <Button
                        onClick={() => handleCancelListing(nft.id)}
                        disabled={cancellingListing === nft.id}
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                      >
                        {cancellingListing === nft.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Listing'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

             {/* Listed NFTs */}
       {collection && collection.listed_nfts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-7xl mx-auto px-4 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 font-elegant text-center">Listed for Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.listed_nfts.map((nft) => (
              <motion.div
                key={nft.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/5 border border-green-500/30 rounded-2xl p-6 glass-effect"
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
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 font-cursive">Listed Price:</span>
                    <span className="text-2xl font-bold text-green-400">{nft.price} ETH</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 font-cursive">Listed:</span>
                    <span className="text-white font-mono">{nft.listing_date}</span>
                  </div>
                </div>
                
                {/* Cancel Button */}
                <div className="border-t border-white/10 pt-4">
                  <Button
                    onClick={() => handleCancelListing(nft.id)}
                    disabled={cancellingListing === nft.id}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    {cancellingListing === nft.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Listing'
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Purchased NFTs */}
      {collection && collection.transaction_history.filter(tx => tx.buyer === walletAddress).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-7xl mx-auto px-4 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 font-elegant text-center">Purchased NFTs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.transaction_history
              .filter(tx => tx.buyer === walletAddress)
              .map((transaction) => {
                // Find the NFT details for this transaction
                const nft = collection.owned_nfts.find(n => n.id === transaction.nft_id);
                if (!nft) return null;
                
                return (
                  <motion.div
                    key={transaction.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/5 border border-blue-500/30 rounded-2xl p-6 glass-effect"
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
                    
                    {/* Purchase Details */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60 font-cursive">Purchase Price:</span>
                        <span className="text-2xl font-bold text-blue-400">{transaction.price} ETH</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60 font-cursive">Purchased:</span>
                        <span className="text-white font-mono">{new Date(transaction.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60 font-cursive">Transaction:</span>
                        <span className="text-white font-mono text-xs">{transaction.transaction_hash.slice(0, 8)}...</span>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="border-t border-white/10 pt-4">
                      <Link href={`/nft/${nft.id}`}>
                        <Button
                          className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 font-bold py-3 rounded-lg transition-all duration-300"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* List NFT Modal */}
      {listingNFT && collection && (() => {
        const nft = collection.owned_nfts.find(n => n.id === listingNFT);
        return nft ? (
          <ListNFTModal
            nft={nft}
            onClose={() => setListingNFT(null)}
          />
        ) : null;
      })()}
    </div>
  );
}
