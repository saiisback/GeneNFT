'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Dna, Brain, Code, ArrowLeft, Loader2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import Connect from '@/components/Connect';

// IGV.js types
declare global {
  interface Window {
    igv: any;
  }
}

export default function GeneViewPage() {
  const [searchQuery, setSearchQuery] = useState('human');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [genomeInfo, setGenomeInfo] = useState<any>(null);
  const [browser, setBrowser] = useState<any>(null);
  const igvContainerRef = useRef<HTMLDivElement>(null);

  // Common animal genomes with their references
  const genomeReferences = {
    human: {
      id: "hg38",
      name: "Human (GRCh38/hg38)",
      fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/hg38/hg38.fa",
      indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/hg38/hg38.fa.fai"
    },
    mouse: {
      id: "mm10",
      name: "Mouse (mm10)",
      fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/mm10/mm10.fa",
      indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/mm10/mm10.fa.fai"
    },
    rat: {
      id: "rn6",
      name: "Rat (rn6)",
      fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/rn6/rn6.fa",
      indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/rn6/rn6.fa.fai"
    },
    zebrafish: {
      id: "danRer10",
      name: "Zebrafish (danRer10)",
      fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/danRer10/danRer10.fa",
      indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/danRer10/danRer10.fa.fai"
    },
    fruitfly: {
      id: "dm6",
      name: "Fruit Fly (dm6)",
      fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/dm6/dm6.fa",
      indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/dm6/dm6.fa.fai"
    }
  };

  // Load IGV.js script
  useEffect(() => {
    const loadIGVScript = async () => {
      if (typeof window !== 'undefined' && !window.igv) {
        // Load IGV.js CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/igv@2.15.5/dist/igv.min.css';
        document.head.appendChild(link);

        // Load IGV.js script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/igv@2.15.5/dist/igv.min.js';
        script.onload = () => {
          console.log('IGV.js loaded successfully');
          // Initialize with human genome by default
          handleSearch();
        };
        script.onerror = () => {
          setError('Failed to load IGV.js genome viewer');
        };
        document.head.appendChild(script);
      } else if (window.igv) {
        // IGV already loaded, initialize
        handleSearch();
      }
    };

    loadIGVScript();

    // Cleanup function
    return () => {
      if (browser) {
        try {
          browser.removeAllTracks();
        } catch (error) {
          console.log('Error during cleanup:', error);
        }
      }
      if (igvContainerRef.current) {
        igvContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleSearch = async () => {
    const animal = searchQuery.trim().toLowerCase();
    
    if (!animal) {
      setError('Please enter an animal name');
      return;
    }

    setIsLoading(true);
    setError('');
    setGenomeInfo(null);

    // Clear previous browser
    if (browser && igvContainerRef.current) {
      igvContainerRef.current.innerHTML = '';
      setBrowser(null);
    }

    try {
      // Check if we have a reference for this animal
      if (genomeReferences[animal as keyof typeof genomeReferences]) {
        await initializeIGV(genomeReferences[animal as keyof typeof genomeReferences]);
      } else {
        // For unknown animals, try to fetch from API
        await fetchGenomeFromAPI(animal);
      }
    } catch (err) {
      console.error('Error loading genome:', err);
      setError(`Failed to load genome for "${animal}"`);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeIGV = async (genomeConfig: any) => {
    if (!window.igv || !igvContainerRef.current) {
      throw new Error('IGV.js not loaded or container not ready');
    }

    // Clear any existing content and browser
    if (browser) {
      try {
        browser.removeAllTracks();
        setBrowser(null);
      } catch (error) {
        console.log('Error cleaning up previous browser:', error);
      }
    }

    // Clear the container completely
    if (igvContainerRef.current) {
      igvContainerRef.current.innerHTML = '';
    }

    // Wait a bit for DOM cleanup
    await new Promise(resolve => setTimeout(resolve, 100));

    // Double-check container is still valid
    if (!igvContainerRef.current) {
      throw new Error('Container reference lost during cleanup');
    }

    setGenomeInfo({
      name: genomeConfig.name,
      id: genomeConfig.id,
      source: genomeConfig.source || 'Unknown'
    });

    // Check if this genome has direct FASTA URLs (IGV.org genomes)
    if (genomeConfig.fastaURL && genomeConfig.indexURL) {
      // Use the direct URLs for IGV.org genomes
      const options = {
        genome: genomeConfig.id,
        locus: 'chr7:55,000,000-55,500,000', // Larger region around EGFR for more context
        tracks: [
          // Reference sequence track
          {
            name: 'Reference Sequence',
            type: 'sequence',
            format: 'fasta',
            url: genomeConfig.fastaURL,
            indexURL: genomeConfig.indexURL,
            height: 50
          },
          // Gene annotations - this is the main track that should work
          {
            name: 'Refseq Genes',
            type: 'annotation',
            format: 'gff3',
            url: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/refGene.gff3.gz`,
            indexURL: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/refGene.gff3.gz.tbi`,
            displayMode: 'EXPANDED',
            height: 120
          },
          // Simple repeat regions - more likely to be accessible
          {
            name: 'Simple Repeats',
            type: 'annotation',
            format: 'gff3',
            url: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/simpleRepeat.gff3.gz`,
            indexURL: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/simpleRepeat.gff3.gz.tbi`,
            displayMode: 'COLLAPSED',
            height: 60
          }
        ]
      };

      try {
        // First check which tracks are accessible
        const accessibleTracks = await checkTrackAccessibility(options.tracks);
        console.log(`Found ${accessibleTracks.length} accessible tracks out of ${options.tracks.length}`);
        
        // Ensure we have at least the reference sequence
        if (accessibleTracks.length === 0) {
          throw new Error('No accessible tracks found');
        }
        
        // Update options with only accessible tracks
        const filteredOptions = {
          ...options,
          tracks: accessibleTracks
        };
        
        // Final container check
        if (!igvContainerRef.current) {
          throw new Error('Container reference lost before browser creation');
        }
        
        const newBrowser = await window.igv.createBrowser(igvContainerRef.current, filteredOptions);
        setBrowser(newBrowser);
        console.log('IGV.js browser created successfully with accessible tracks');
        
        // Add event listeners for track loading
        newBrowser.on('trackloaded', (track: any) => {
          console.log(`Track loaded: ${track.name}`);
          // Update loading state when tracks are loaded
          if (newBrowser.trackViews && newBrowser.trackViews.length > 0) {
            setIsLoading(false);
          }
        });
        
        newBrowser.on('trackloadfailed', (track: any) => {
          console.log(`Track failed to load: ${track.name}`);
          // Log which specific track failed
          console.warn(`Failed to load track: ${track.name} - this is normal for some tracks`);
        });
        
        // Set a timeout to check if tracks are loading
        setTimeout(() => {
          if (newBrowser.trackViews && newBrowser.trackViews.length === 0) {
            console.log('No tracks loaded, trying fallback configuration...');
            loadFallbackTracks(newBrowser, genomeConfig);
          }
        }, 3000);
        
        // Also check track loading status more frequently
        const trackCheckInterval = setInterval(() => {
          if (newBrowser.trackViews && newBrowser.trackViews.length > 0) {
            console.log(`Tracks loaded: ${newBrowser.trackViews.length}`);
            clearInterval(trackCheckInterval);
            setIsLoading(false);
          }
        }, 1000);
        
        // Clear interval after 10 seconds
        setTimeout(() => clearInterval(trackCheckInterval), 10000);
        
      } catch (error) {
        console.error('Error creating IGV browser:', error);
        console.log('Trying fallback configuration...');
        try {
          await loadFallbackTracks(null, genomeConfig);
        } catch (fallbackError) {
          throw new Error('Failed to initialize genome browser with fallback');
        }
      }
    } else {
      // For genomes from other sources (Ensembl, UCSC), show info but note IGV limitation
      console.log('Genome found but no direct FASTA URLs available for IGV.js');
      setError(`Genome "${genomeConfig.name}" found in ${genomeConfig.source}, but IGV.js visualization requires direct genome files. This genome can be viewed in the ${genomeConfig.source} browser.`);
      
      // Clear the container
      if (igvContainerRef.current) {
        igvContainerRef.current.innerHTML = `
          <div class="p-8 text-center">
            <h3 class="text-xl font-semibold text-white mb-4">Genome Found!</h3>
            <p class="text-white/70 mb-4">${genomeConfig.name}</p>
            <p class="text-white/60 text-sm mb-4">Source: ${genomeConfig.source}</p>
            <p class="text-white/60 text-sm">${genomeConfig.description || ''}</p>
            <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p class="text-blue-300 text-sm">
                ℹ️ This genome is available in the ${genomeConfig.source} database but cannot be visualized in IGV.js without direct genome files.
              </p>
            </div>
          </div>
        `;
      }
    }
  };

  const fetchGenomeFromAPI = async (animal: string) => {
    try {
      // Call your Next.js API endpoint
      const response = await fetch('/api/genome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animal }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Invalid response from genome API');
      }

      const genomeData = result.data;
      console.log('Genome data from API:', genomeData);

      // Initialize IGV with the fetched genome data
      await initializeIGV(genomeData);
    } catch (error) {
      console.error('API error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Genome data for "${animal}" is not available. Try human, mouse, rat, zebrafish, or fruitfly.`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Check which tracks are accessible before loading
  const checkTrackAccessibility = async (tracks: any[]) => {
    const accessibleTracks = [];
    
    for (const track of tracks) {
      try {
        // Test if the track URL is accessible
        const response = await fetch(track.url, { method: 'HEAD' });
        if (response.ok) {
          accessibleTracks.push(track);
          console.log(`Track accessible: ${track.name}`);
        } else {
          console.log(`Track not accessible: ${track.name} (${response.status})`);
        }
      } catch (error) {
        console.log(`Track failed accessibility check: ${track.name}`);
      }
    }
    
    return accessibleTracks;
  };

  // Fallback function to load basic tracks if the main configuration fails
  const loadFallbackTracks = async (existingBrowser: any, genomeConfig: any) => {
    try {
      console.log('Loading fallback tracks...');
      
      // Create a minimal browser with just essential tracks
      const fallbackOptions = {
        genome: genomeConfig.id,
        locus: 'chr7:55,000,000-55,500,000',
        tracks: [
          // Just the reference sequence and genes
          {
            name: 'Reference Sequence',
            type: 'sequence',
            format: 'fasta',
            url: genomeConfig.fastaURL,
            indexURL: genomeConfig.indexURL,
            height: 50
          },
          {
            name: 'Refseq Genes',
            type: 'annotation',
            format: 'gff3',
            url: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/refGene.gff3.gz`,
            indexURL: `https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/${genomeConfig.id}/refGene.gff3.gz.tbi`,
            displayMode: 'EXPANDED',
            height: 120
          }
        ]
      };

      if (existingBrowser) {
        // Clear existing tracks and add fallback ones
        try {
          existingBrowser.removeAllTracks();
          for (const track of fallbackOptions.tracks) {
            try {
              await existingBrowser.loadTrack(track);
            } catch (trackError) {
              console.log(`Failed to load fallback track ${track.name}:`, trackError);
            }
          }
        } catch (error) {
          console.log('Error updating existing browser, creating new one...');
          // If updating fails, create a new browser
          if (igvContainerRef.current) {
            // Clear container first
            igvContainerRef.current.innerHTML = '';
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (igvContainerRef.current) {
              const newBrowser = await window.igv.createBrowser(igvContainerRef.current, fallbackOptions);
              setBrowser(newBrowser);
              console.log('New fallback IGV browser created successfully');
            }
          }
        }
      } else {
        // Create new browser with fallback configuration
        if (igvContainerRef.current) {
          // Ensure container is clean
          igvContainerRef.current.innerHTML = '';
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (igvContainerRef.current) {
            const newBrowser = await window.igv.createBrowser(igvContainerRef.current, fallbackOptions);
            setBrowser(newBrowser);
            console.log('Fallback IGV browser created successfully');
          }
        }
      }
    } catch (error) {
      console.error('Fallback track loading failed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen  text-white">
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
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-elegant font-black text-white mb-6">
              <span className="gradient-text">Genome</span>{' '}
              <span className="gradient-text-accent">Explorer</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-cursive">
              Visualize animal genome sequences with IGV.js. Explore genetic data, 
              navigate chromosomes, and analyze genomic features in real-time.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="border-white/20 bg-black/60 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white flex items-center justify-center font-elegant">
                  <Search className="w-6 h-6 mr-2 text-white/80" />
                  Search Genome Database
                </CardTitle>
                <p className="text-white/70 font-cursive">
                  Enter an animal name to load and visualize its genome
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter animal name (e.g., human, mouse, rat)"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/30 font-cursive"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    size="lg"
                    className="group elegant-border bg-white/5 hover:bg-white/10 text-white font-cursive font-semibold px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Search Genome
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/20 rounded-lg px-6 py-4">
                <Loader2 className="w-6 h-6 animate-spin text-white/80" />
                <span className="text-white/80 font-cursive">Loading genome data...</span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-red-500/30 bg-red-900/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-cursive">{error}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Genome Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
                        <Card className="border-gray-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-elegant">
                  <Dna className="w-5 h-5 inline mr-2 text-gray-600" />
                  Genome Browser
                </CardTitle>
                {genomeInfo && (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700 font-cursive bg-gray-50 border border-gray-200 rounded-lg p-2">
                      Viewing: {genomeInfo.name} ({genomeInfo.id}) - Source: {genomeInfo.source}
                    </p>
                    <Button
                      onClick={() => browser && loadFallbackTracks(browser, genomeInfo)}
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      Refresh Tracks
                    </Button>
                  </div>
                )}
              </CardHeader>
                                <CardContent>
                    <div 
                      ref={igvContainerRef}
                      className="w-full h-[600px] border border-gray-200 rounded-lg bg-white relative"
                      style={{ minHeight: '600px' }}
                    >
                      {/* Loading overlay */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                            <p className="text-gray-700 font-cursive">Loading genome tracks...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Track loading status */}
                      {browser && !isLoading && (
                        <div className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs p-2 rounded border border-gray-200 shadow-sm z-10 max-w-xs">
                          <p className="font-semibold">Browser: {genomeInfo?.id}</p>
                          <p>Tracks loaded: {browser.trackViews?.length || 0}</p>
                          {browser.trackViews && browser.trackViews.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-600">Loaded tracks:</p>
                              {browser.trackViews.slice(0, 3).map((track: any, index: number) => (
                                <p key={index} className="text-xs text-green-600">✓ {track.track.name}</p>
                              ))}
                              {browser.trackViews.length > 3 && (
                                <p className="text-xs text-gray-500">+{browser.trackViews.length - 3} more</p>
                              )}
                            </div>
                          )}
                          {browser.trackViews?.length === 0 && (
                            <p className="text-yellow-600 text-xs">⚠️ No tracks visible - try Refresh Tracks</p>
                          )}
                        </div>
                      )}
                      
                      {/* Error state */}
                      {error && !browser && !isLoading && (
                        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                          <div className="text-center p-6">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Browser Error</h3>
                            <p className="text-red-600 text-sm mb-4">{error}</p>
                            <Button
                              onClick={() => {
                                setError('');
                                handleSearch();
                              }}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="border-gray-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-elegant flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  How to Use the Genome Viewer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-3 font-cursive">Navigation</h4>
                    <ul className="space-y-2 text-gray-700 font-cursive">
                      <li>• Use the navigation controls to move along the genome</li>
                      <li>• Zoom in/out using the mouse wheel or zoom buttons</li>
                      <li>• Drag to pan across the genome</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-3 font-cursive">Features</h4>
                    <ul className="space-y-2 text-gray-700 font-cursive">
                      <li>• Click on features to get detailed information</li>
                      <li>• View gene annotations and sequences</li>
                      <li>• Explore different genomic regions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Available Genomes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="border-gray-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-elegant">
                  <Brain className="w-5 h-5 inline mr-2 text-gray-600" />
                  Available Genomes
                </CardTitle>
                <p className="text-gray-700 font-cursive">
                  Pre-configured genomes ready for exploration
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(genomeReferences).map(([key, genome]) => (
                    <div
                      key={key}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSearchQuery(key);
                        handleSearch();
                      }}
                    >
                      <h4 className="text-gray-900 font-semibold font-cursive mb-2">
                        {genome.name}
                      </h4>
                      <p className="text-gray-600 text-sm font-cursive">
                        ID: {genome.id}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
