'use client';

import { useState } from 'react';
import { NFT } from '../types';

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const [showFullDetails, setShowFullDetails] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* NFT Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100">
        {nft.metadata.image ? (
          <img
            src={nft.metadata.image}
            alt={nft.metadata.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${nft.metadata.image ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="text-6xl mb-2">🧬</div>
            <p className="text-gray-600 text-sm">XML Generated Art</p>
          </div>
        </div>
        
        {/* Rarity Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            nft.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-800' :
            nft.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
            nft.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {nft.rarity}
          </span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{nft.metadata.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nft.metadata.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Token ID:</span>
            <span className="font-mono text-gray-700">{nft.token_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">XML Hash:</span>
            <span className="font-mono text-gray-700 text-xs">{truncateAddress(nft.xml_hash)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Owner:</span>
            <span className="font-mono text-gray-700 text-xs">{truncateAddress(nft.owner)}</span>
          </div>
        </div>

        {/* Key Attributes */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Attributes</h4>
          <div className="flex flex-wrap gap-2">
            {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {attr.trait_type}: {attr.value}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setShowFullDetails(!showFullDetails)}
          className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {showFullDetails ? 'Hide Full Details' : 'Show Full Details'}
        </button>

        {showFullDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* All Attributes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">All Attributes</h4>
              <div className="grid grid-cols-2 gap-2">
                {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="text-xs">
                    <span className="text-gray-500">{attr.trait_type}:</span>
                    <span className="ml-1 text-gray-700 font-mono">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* XML Content Preview */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">XML Content Preview</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {nft.xml_content.length > 200 
                    ? `${nft.xml_content.substring(0, 200)}...` 
                    : nft.xml_content
                  }
                </pre>
              </div>
            </div>

            {/* External Links */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">External URL:</span>
                <a 
                  href={nft.metadata.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline break-all"
                >
                  {nft.metadata.external_url}
                </a>
              </div>
              <div>
                <span className="text-gray-500">License:</span>
                <span className="ml-2 text-gray-700">{nft.metadata.license}</span>
              </div>
            </div>

            {/* Provenance */}
            <div>
              <span className="text-gray-500 text-sm">Provenance:</span>
              <span className="ml-2 text-gray-700 text-sm">{nft.metadata.provenance}</span>
            </div>

            {/* Token URI */}
            <div>
              <span className="text-gray-500 text-sm">Created:</span>
              <span className="ml-2 text-gray-700 text-sm">{new Date(nft.created_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
