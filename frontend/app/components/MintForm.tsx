'use client';

import { useState } from 'react';
import { MintRequest } from '../types';
import { nftApi } from '../api';

interface MintFormProps {
  onMintSuccess: () => void;
}

export default function MintForm({ onMintSuccess }: MintFormProps) {
  const [formData, setFormData] = useState<MintRequest>({
    species_name: '',
    dna_hash: '',
    genome_data: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await nftApi.mint(formData);
      setMessage(`✅ ${response.message}`);
      setFormData({ species_name: '', dna_hash: '', genome_data: '' });
      onMintSuccess();
    } catch (error) {
      setMessage('❌ Failed to mint NFT. Please try again.');
      console.error('Mint error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMockData = () => {
    const species = ['Tiger', 'Elephant', 'Dolphin', 'Eagle', 'Butterfly'];
    const randomSpecies = species[Math.floor(Math.random() * species.length)];
    const randomHash = '0x' + Math.random().toString(16).substring(2, 34);
    const randomGenome = `${randomSpecies} genome sequence ${Math.random().toString(36).substring(2, 15)}...`;
    
    setFormData({
      species_name: randomSpecies,
      dna_hash: randomHash,
      genome_data: randomGenome,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mint New NFT</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="species_name" className="block text-sm font-medium text-gray-700 mb-2">
            Species Name
          </label>
          <input
            type="text"
            id="species_name"
            name="species_name"
            value={formData.species_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Golden Eagle"
          />
        </div>

        <div>
          <label htmlFor="dna_hash" className="block text-sm font-medium text-gray-700 mb-2">
            DNA Hash
          </label>
          <input
            type="text"
            id="dna_hash"
            name="dna_hash"
            value={formData.dna_hash}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x..."
          />
        </div>

        <div>
          <label htmlFor="genome_data" className="block text-sm font-medium text-gray-700 mb-2">
            Genome Data
          </label>
          <textarea
            id="genome_data"
            name="genome_data"
            value={formData.genome_data}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter genome sequence or description..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Minting...' : 'Mint NFT'}
          </button>
          
          <button
            type="button"
            onClick={generateMockData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            🎲 Mock Data
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
