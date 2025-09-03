'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Sparkles, Dna, Brain, Code, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import Connect from '@/components/Connect';
import { useActiveAccount } from 'thirdweb/react';

export default function UploadPage() {
  const activeAccount = useActiveAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    external_url: '',
    license: 'MIT',
    wallet_address: ''
  });
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Update wallet address when account changes
  useEffect(() => {
    if (activeAccount?.address) {
      setFormData(prev => ({
        ...prev,
        wallet_address: activeAccount.address
      }));
    }
  }, [activeAccount?.address]);


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
      wallet_address: activeAccount?.address || formData.wallet_address
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

    if (!formData.wallet_address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('xml_file', xmlFile);
      uploadData.append('name', formData.name);
      uploadData.append('description', formData.description);
      uploadData.append('external_url', formData.external_url);
      uploadData.append('license', formData.license);
      uploadData.append('wallet_address', formData.wallet_address);

      console.log('Uploading data:', {
        name: formData.name,
        description: formData.description,
        external_url: formData.external_url,
        license: formData.license,
        wallet_address: formData.wallet_address,
        fileName: xmlFile.name,
        fileSize: xmlFile.size
      });
      
      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of uploadData.entries()) {
        console.log(`${key}:`, value);
      }

              // Upload to Rust backend
        const response = await fetch('http://localhost:3001/api/nft/upload-xml', {
          method: 'POST',
          body: uploadData,
        });

              console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          console.error('Response status:', response.status);
          console.error('Response status text:', response.statusText);
          throw new Error(`Upload failed: ${response.status} - ${response.statusText}`);
        }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      setUploadSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          external_url: '',
          license: 'MIT',
          wallet_address: activeAccount?.address || ''
        });
        setXmlFile(null);
        setUploadSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Upload error details:', err);
      if (err instanceof Error) {
        setError(`Upload failed: ${err.message}. Please make sure the Rust backend is running on port 3001 and try again.`);
      } else {
        setError('Failed to upload XML file. Please make sure the Rust backend is running and try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
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
              <Link href="/collection">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Success Content */}
        <main className="pt-24 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-elegant font-black text-white mb-6">
                <span className="gradient-text">Upload</span>{' '}
                <span className="gradient-text-accent">Successful!</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto font-cursive">
                Your genetic NFT has been successfully minted and added to the blockchain. 
                You can now view it in your collection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/collection">
                <Button size="xl" className="group elegant-border px-8 py-4 text-lg font-cursive font-semibold bg-white/5 hover:bg-white/10">
                  View Collection
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="xl" className="px-8 py-4 text-lg font-cursive font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  Upload Another
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
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
            <div className="flex items-center space-x-4">
              <Connect />
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-elegant font-black text-white mb-6">
              <span className="gradient-text">Upload</span>{' '}
              <span className="gradient-text-accent">&</span>{' '}
              <span className="gradient-text-gold">Mint</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-cursive">
              Transform your genetic research data into unique, verifiable NFTs. 
              Each upload creates a one-of-a-kind digital asset with AI-generated visual art.
            </p>
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white flex items-center justify-center font-elegant">
                  <Upload className="w-6 h-6 mr-2 text-white/80" />
                  Create Your Genetic NFT
                </CardTitle>
                <p className="text-white/70 font-cursive">
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
                    className="group border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Generate Sample Data
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                        NFT Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/30 font-cursive"
                        placeholder="Enter NFT name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                        License
                      </label>
                      <select
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white font-cursive"
                      >
                        <option value="MIT">MIT License</option>
                        <option value="CC0">Creative Commons Zero</option>
                        <option value="Custom">Custom License</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/30 font-cursive"
                      placeholder="Describe your genetic data"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                      External URL
                    </label>
                    <input
                      type="url"
                      name="external_url"
                      value={formData.external_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/30 font-cursive"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                      XML File *
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors">
                      <input
                        type="file"
                        accept=".xml"
                        onChange={handleFileChange}
                        required
                        className="hidden"
                        id="xml-file"
                      />
                      <label htmlFor="xml-file" className="cursor-pointer">
                        <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/80 mb-2 font-cursive">
                          {xmlFile ? `Selected: ${xmlFile.name}` : 'Click to select XML file'}
                        </p>
                        <p className="text-white/50 text-sm font-cursive">
                          Supports .xml files up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                 
                    
                    <label className="block text-sm font-medium text-white/80 mb-2 font-cursive">
                      Wallet Address *
                    </label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-mono">
                      {formData.wallet_address
                        ? formData.wallet_address
                        : (
                          <span className="text-white/40">
                            {activeAccount?.address
                              ? activeAccount.address
                              : "Connect wallet to auto-fill"}
                          </span>
                        )
                      }
                    </div>
                    
                  </div>

                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-400 text-sm font-cursive">{error}</p>

                    </div>
                  )}


                  <Button
                    type="submit"
                    disabled={isUploading}
                    size="xl"
                    className="w-full group elegant-border bg-white/5 hover:bg-white/10 text-white font-cursive font-semibold"
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20">
              <Dna className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-elegant">Genetic Data</h3>
              <p className="text-white/60 font-cursive">Upload XML files containing genetic sequences and research data</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20">
              <Brain className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-elegant">AI Generation</h3>
              <p className="text-white/60 font-cursive">Automatic visual art generation based on your data content</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20">
              <Code className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-elegant">Blockchain</h3>
              <p className="text-white/60 font-cursive">Immutable NFT storage with verifiable ownership</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
