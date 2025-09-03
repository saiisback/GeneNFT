'use client';

import { useState } from 'react';
import { XMLUploadRequest } from '../types';
import { nftApi } from '../api';

interface XMLUploadFormProps {
  onUploadSuccess: () => void;
}

export default function XMLUploadForm({ onUploadSuccess }: XMLUploadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    external_url: '',
    license: 'MIT',
    wallet_address: '0x1234567890123456789012345678901234567890' // Mock wallet for showcase
  });
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setXmlFile(e.target.files[0]);
    }
  };

  const generateMockData = () => {
    setFormData({
      name: 'Sample Gene NFT',
      description: 'A unique genetic sequence NFT with rare traits',
      external_url: 'https://example.com/gene-nft',
      license: 'MIT',
      wallet_address: '0x1234567890123456789012345678901234567890'
    });
    
    // Create a mock XML file
    const mockXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<gene>
  <name>Sample Gene</name>
  <sequence>ATCGATCGATCG</sequence>
  <traits>
    <trait>Rare</trait>
    <trait>Unique</trait>
  </traits>
</gene>`;
    
    const mockFile = new File([mockXmlContent], 'sample-gene.xml', { type: 'application/xml' });
    setXmlFile(mockFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!xmlFile) {
      setError('Please select an XML file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const request: XMLUploadRequest = {
        name: formData.name,
        description: formData.description,
        external_url: formData.external_url,
        license: formData.license,
        xml_file: xmlFile,
        wallet_address: formData.wallet_address
      };

      await nftApi.uploadXML(request);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        external_url: '',
        license: 'MIT',
        wallet_address: '0x1234567890123456789012345678901234567890'
      });
      setXmlFile(null);
      
      onUploadSuccess();
    } catch (err) {
      setError('Failed to upload XML file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload XML & Mint NFT</h3>
      
      <div className="mb-4">
        <button
          type="button"
          onClick={generateMockData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          🎲 Generate Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NFT Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter NFT name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your NFT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            External URL
          </label>
          <input
            type="url"
            name="external_url"
            value={formData.external_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License
          </label>
          <select
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MIT">MIT License</option>
            <option value="CC0">Creative Commons Zero</option>
            <option value="Custom">Custom License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            XML File *
          </label>
          <input
            type="file"
            accept=".xml"
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {xmlFile && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {xmlFile.name} ({(xmlFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Address (Mock)
          </label>
          <input
            type="text"
            name="wallet_address"
            value={formData.wallet_address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="0x..."
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Using mock wallet address for showcase purposes
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload XML & Mint NFT'}
        </button>
      </form>
    </div>
  );
}
