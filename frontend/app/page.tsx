'use client';

import { useState, useEffect } from 'react';
import { NFT } from './types';
import { nftApi } from './api';
import NFTCard from './components/NFTCard';
import XMLUploadForm from './components/XMLUploadForm';
import Connect from './components/Connect';

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

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

  useEffect(() => {
    fetchNFTs();
  }, []);

  const handleUploadSuccess = () => {
    fetchNFTs(); // Refresh the NFT list
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧬 GeneNFT</h1>
              <p className="text-gray-600">XML-Based NFT Metadata Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Connect />
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showUploadForm ? 'Hide Upload Form' : 'Upload XML & Mint NFT'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-8">
            <XMLUploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{nfts.length}</div>
            <div className="text-gray-600">Total NFTs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {nfts.filter(nft => nft.rarity === 'Legendary').length}
            </div>
            <div className="text-gray-600">Legendary</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {nfts.filter(nft => nft.rarity === 'Epic').length}
            </div>
            <div className="text-gray-600">Epic</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-cyan-600">
              {nfts.filter(nft => nft.rarity === 'Rare').length}
            </div>
            <div className="text-gray-600">Rare</div>
          </div>
        </div>

        {/* NFT Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">XML NFT Collection</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading NFTs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchNFTs}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No NFTs found. Upload your first XML file!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
