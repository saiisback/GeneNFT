'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Sparkles, Dna, Brain, Code } from 'lucide-react';
import Connect from './Connect';

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    external_url: '',
    license: 'MIT',
    wallet_address: '0x1234567890123456789012345678901234567890'
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
      // Simulate upload for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        external_url: '',
        license: 'MIT',
        wallet_address: '0x1234567890123456789012345678901234567890'
      });
      setXmlFile(null);
      
      onUploadSuccess?.();
    } catch (err) {
      setError('Failed to upload XML file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
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
              Upload & Mint
            </span>
          </h2>
          <p className="text-xl text-cyan-300/80 max-w-2xl mx-auto">
            Transform your genetic research data into unique, verifiable NFTs. 
            Each upload creates a one-of-a-kind digital asset with AI-generated visual art.
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3">
            <Connect />
          </div>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="border-cyan-500/30 bg-black/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-white flex items-center justify-center">
                <Upload className="w-6 h-6 mr-2 text-cyan-400" />
                Create Your Genetic NFT
              </CardTitle>
              <p className="text-cyan-300/70">
                Fill in the details and upload your XML file to mint a unique NFT
              </p>
            </CardHeader>

            <CardContent>
              {/* Mock Data Button */}
              <div className="mb-6 text-center">
                <Button
                  type="button"
                  onClick={generateMockData}
                  variant="outline"
                  size="sm"
                  className="group"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Generate Sample Data
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      NFT Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-white placeholder-cyan-300/30"
                      placeholder="Enter NFT name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      License
                    </label>
                    <select
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-white"
                    >
                      <option value="MIT">MIT License</option>
                      <option value="CC0">Creative Commons Zero</option>
                      <option value="Custom">Custom License</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-white placeholder-cyan-300/30"
                    placeholder="Describe your genetic data"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    External URL
                  </label>
                  <input
                    type="url"
                    name="external_url"
                    value={formData.external_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-white placeholder-cyan-300/30"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    XML File *
                  </label>
                  <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-6 text-center hover:border-cyan-400/50 transition-colors">
                    <input
                      type="file"
                      accept=".xml"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="xml-file"
                    />
                    <label htmlFor="xml-file" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                      <p className="text-cyan-300 mb-2">
                        {xmlFile ? `Selected: ${xmlFile.name}` : 'Click to select XML file'}
                      </p>
                      <p className="text-cyan-300/60 text-sm">
                        Supports .xml files up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Wallet Address (Mock)
                  </label>
                  <input
                    type="text"
                    name="wallet_address"
                    value={formData.wallet_address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-300/60 cursor-not-allowed"
                    readOnly
                  />
                  <p className="text-xs text-cyan-300/40 mt-1">
                    Using mock wallet address for showcase purposes
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading}
                  size="xl"
                  className="w-full group"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Dna className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Upload XML & Mint NFT
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Dna className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Genetic Data</h3>
            <p className="text-cyan-300/60">Upload XML files containing genetic sequences and research data</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Generation</h3>
            <p className="text-purple-300/60">Automatic visual art generation based on your data content</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-magenta-500/10 border border-magenta-500/20">
            <Code className="w-12 h-12 text-magenta-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Blockchain</h3>
            <p className="text-magenta-300/60">Immutable NFT storage with verifiable ownership</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
