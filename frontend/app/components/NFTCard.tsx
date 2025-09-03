'use client';

import { NFT } from '../types';

interface NFTCardProps {
  nft: NFT;
}

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    case 'epic':
      return 'bg-gradient-to-r from-purple-400 to-pink-500';
    case 'rare':
      return 'bg-gradient-to-r from-blue-400 to-cyan-500';
    case 'common':
      return 'bg-gradient-to-r from-gray-400 to-gray-500';
    default:
      return 'bg-gray-400';
  }
};

export default function NFTCard({ nft }: NFTCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateHash = (hash: string, length: number = 8) => {
    if (hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className={`h-2 ${getRarityColor(nft.rarity)}`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{nft.species_name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRarityColor(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">DNA Hash:</label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {truncateHash(nft.dna_hash)}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Blockchain TX:</label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {truncateHash(nft.blockchain_tx)}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Owner:</label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {truncateHash(nft.owner)}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Mint Date:</label>
            <p className="text-sm text-gray-800">{formatDate(nft.mint_date)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Token URI:</label>
            <p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {truncateHash(nft.token_uri)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            ID: {nft.id}
          </p>
        </div>
      </div>
    </div>
  );
}
