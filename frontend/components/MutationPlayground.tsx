'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Gene data structure
interface GeneData {
  species: string;
  dna: string;
  traits: {
    respiration: string;
    climate_tolerance: string;
    disease_resistance: string;
    special_ability: string;
    appearance: string;
  };
}

// Mutation types
type MutationType = 'substitution' | 'insertion' | 'deletion';

// Trait mapping rules
const traitRules = {
  respiration: {
    positions: [0, 1, 2, 3, 4],
    mutations: [
      'Air Breathing',
      'Underwater Breathing',
      'Photosynthesis',
      'Anaerobic',
      'Universal Respiration'
    ]
  },
  climate_tolerance: {
    positions: [5, 6, 7, 8, 9],
    mutations: [
      'Tropical',
      'Arctic',
      'Desert',
      'Aquatic',
      'Universal Adaptation'
    ]
  },
  disease_resistance: {
    positions: [10, 11, 12, 13, 14],
    mutations: [
      'Low',
      'Medium',
      'High',
      'Extreme',
      'Immune'
    ]
  },
  special_ability: {
    positions: [15, 16, 17, 18, 19],
    mutations: [
      'None',
      'Night Vision',
      'Regeneration',
      'Telepathy',
      'Reality Manipulation'
    ]
  },
  appearance: {
    positions: [20, 21, 22, 23, 24],
    mutations: [
      'Normal',
      'Glowing',
      'Transparent',
      'Metallic',
      'Ethereal'
    ]
  }
};

// Sample gene data
const sampleGenes: GeneData[] = [
  {
    species: "Tiger",
    dna: "ATGCTGACGTACGTACGTACGTA",
    traits: {
      respiration: "Air Breathing",
      climate_tolerance: "Tropical",
      disease_resistance: "Low",
      special_ability: "None",
      appearance: "Normal"
    }
  },
  {
    species: "Dolphin",
    dna: "GCTACGTACGTACGTACGTACG",
    traits: {
      respiration: "Underwater Breathing",
      climate_tolerance: "Aquatic",
      disease_resistance: "Medium",
      special_ability: "Echolocation",
      appearance: "Normal"
    }
  },
  {
    species: "Eagle",
    dna: "TACGTACGTACGTACGTACGTA",
    traits: {
      respiration: "Air Breathing",
      climate_tolerance: "Universal Adaptation",
      disease_resistance: "High",
      special_ability: "Enhanced Vision",
      appearance: "Normal"
    }
  }
];

export default function MutationPlayground() {
  const [selectedGene, setSelectedGene] = useState<GeneData>(sampleGenes[0]);
  const [mutatedGene, setMutatedGene] = useState<GeneData | null>(null);
  const [mutationHistory, setMutationHistory] = useState<GeneData[]>([]);
  const [isMutating, setIsMutating] = useState(false);
  const [lastMutationType, setLastMutationType] = useState<string | null>(null);

  // Generate random mutation with enhanced logic
  const generateMutation = (gene: GeneData): GeneData => {
    const newDna = gene.dna.split('');
    const mutationType: MutationType = Math.random() < 0.6 ? 'substitution' : Math.random() < 0.8 ? 'insertion' : 'deletion';
    
    let position: number;
    let newTraits = { ...gene.traits };
    let mutationDetails = {
      type: mutationType,
      position: 0,
      oldBase: '',
      newBase: ''
    };
    
    switch (mutationType) {
      case 'substitution':
        position = Math.floor(Math.random() * newDna.length);
        const bases = ['A', 'T', 'G', 'C'];
        const newBase = bases[Math.floor(Math.random() * bases.length)];
        mutationDetails = {
          type: 'substitution',
          position,
          oldBase: newDna[position],
          newBase
        };
        newDna[position] = newBase;
        break;
      case 'insertion':
        position = Math.floor(Math.random() * newDna.length);
        const insertBase = ['A', 'T', 'G', 'C'][Math.floor(Math.random() * 4)];
        mutationDetails = {
          type: 'insertion',
          position,
          oldBase: '',
          newBase: insertBase
        };
        newDna.splice(position, 0, insertBase);
        break;
      case 'deletion':
        position = Math.floor(Math.random() * (newDna.length - 1));
        mutationDetails = {
          type: 'deletion',
          position,
          oldBase: newDna[position],
          newBase: ''
        };
        newDna.splice(position, 1);
        break;
    }
    
    // Apply trait changes based on mutation position with probability
    Object.entries(traitRules).forEach(([trait, rule]) => {
      if (rule.positions.some(pos => pos < newDna.length && pos === mutationDetails.position)) {
        // 70% chance of trait change when mutation affects trait position
        if (Math.random() < 0.7) {
          newTraits[trait as keyof typeof newTraits] = rule.mutations[Math.floor(Math.random() * rule.mutations.length)];
        }
      }
    });
    
    setLastMutationType(mutationType === 'substitution' ? 'Base Substitution' : 
                       mutationType === 'insertion' ? 'Base Insertion' : 'Base Deletion');
    
    return {
      ...gene,
      dna: newDna.join(''),
      traits: newTraits
    };
  };

  const handleMutate = async () => {
    setIsMutating(true);
    
    // Simulate mutation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMutatedGene = generateMutation(selectedGene);
    setMutatedGene(newMutatedGene);
    setMutationHistory(prev => [...prev, newMutatedGene]);
    setIsMutating(false);
  };

  const resetMutation = () => {
    setMutatedGene(null);
    setMutationHistory([]);
  };

  const selectNewGene = (gene: GeneData) => {
    setSelectedGene(gene);
    resetMutation();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Gene Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-6 font-elegant text-center">Choose Your Starting Species</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleGenes.map((gene, index) => (
            <motion.button
              key={gene.species}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectNewGene(gene)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedGene.species === gene.species
                  ? 'border-blue-400 bg-blue-400/10 elegant-glow'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-3 font-elegant">{gene.species}</h3>
              <div className="text-sm text-white/70 font-mono mb-3">
                {gene.dna.substring(0, 20)}...
              </div>
              <div className="space-y-1 text-sm text-white/80">
                <div>🫁 {gene.traits.respiration}</div>
                <div>🌍 {gene.traits.climate_tolerance}</div>
                <div>🛡️ {gene.traits.disease_resistance}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mutation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMutate}
          disabled={isMutating}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed elegant-glow"
        >
          {isMutating ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mutating...</span>
            </div>
          ) : (
            <>
              🧬 Mutate DNA
            </>
          )}
        </motion.button>
        
        {mutatedGene && (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetMutation}
              className="ml-4 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              🔄 Reset
            </motion.button>
            
            {lastMutationType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-sm font-semibold"
              >
                🧬 {lastMutationType} Applied
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Original Gene */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-white/5 border border-white/20 rounded-2xl p-8 glass-effect"
        >
          <h3 className="text-2xl font-bold text-white mb-6 font-elegant text-center">
            🧬 Original {selectedGene.species}
          </h3>
          
          {/* DNA Sequence */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white/80 mb-3">DNA Sequence</h4>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="flex flex-wrap gap-1">
                {selectedGene.dna.split('').map((base, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      base === 'A' ? 'bg-red-500/80' :
                      base === 'T' ? 'bg-green-500/80' :
                      base === 'G' ? 'bg-blue-500/80' :
                      'bg-yellow-500/80'
                    }`}
                  >
                    {base}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Traits */}
          <div>
            <h4 className="text-lg font-semibold text-white/80 mb-3">Traits</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">🫁 Respiration</span>
                <span className="text-white font-semibold">{selectedGene.traits.respiration}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">🌍 Climate</span>
                <span className="text-white font-semibold">{selectedGene.traits.climate_tolerance}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">🛡️ Disease Resistance</span>
                <span className="text-white font-semibold">{selectedGene.traits.disease_resistance}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">✨ Special Ability</span>
                <span className="text-white font-semibold">{selectedGene.traits.special_ability}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">🎨 Appearance</span>
                <span className="text-white font-semibold">{selectedGene.traits.appearance}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mutated Gene */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white/5 border border-white/20 rounded-2xl p-8 glass-effect"
        >
          <h3 className="text-2xl font-bold text-white mb-6 font-elegant text-center">
            {mutatedGene ? (
              <>
                🚀 Mutated {mutatedGene.species}
              </>
            ) : (
              <>
                ⏳ Waiting for Mutation...
              </>
            )}
          </h3>
          
          {mutatedGene ? (
            <>
              {/* DNA Sequence */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white/80 mb-3">Mutated DNA</h4>
                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="flex flex-wrap gap-1">
                    {mutatedGene.dna.split('').map((base, index) => {
                      const originalBase = selectedGene.dna[index];
                      const isChanged = base !== originalBase;
                      return (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all duration-300 ${
                            isChanged ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black scale-110' : ''
                          } ${
                            base === 'A' ? 'bg-red-500/80' :
                            base === 'T' ? 'bg-green-500/80' :
                            base === 'G' ? 'bg-blue-500/80' :
                            'bg-yellow-500/80'
                          }`}
                        >
                          {base}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Mutated Traits */}
              <div>
                <h4 className="text-lg font-semibold text-white/80 mb-3">New Traits</h4>
                <div className="space-y-3">
                  {Object.entries(mutatedGene.traits).map(([key, value]) => {
                    const originalValue = selectedGene.traits[key as keyof typeof selectedGene.traits];
                    const hasChanged = value !== originalValue;
                    return (
                      <div
                        key={key}
                        className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                          hasChanged ? 'bg-yellow-500/20 border border-yellow-500/40' : 'bg-white/5'
                        }`}
                      >
                        <span className="text-white/70">
                          {key === 'respiration' ? '🫁 Respiration' :
                           key === 'climate_tolerance' ? '🌍 Climate' :
                           key === 'disease_resistance' ? '🛡️ Disease Resistance' :
                           key === 'special_ability' ? '✨ Special Ability' :
                           '🎨 Appearance'}
                        </span>
                        <div className="text-right">
                          <div className={`text-white font-semibold ${hasChanged ? 'text-yellow-400' : ''}`}>
                            {value}
                          </div>
                          {hasChanged && (
                            <div className="text-xs text-white/50 line-through">
                              {originalValue}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-white/40">
                <div className="text-6xl mb-4">🧬</div>
                <p className="text-lg">Click "Mutate DNA" to see the transformation!</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mutation History */}
      {mutationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="bg-white/5 border border-white/20 rounded-2xl p-8 glass-effect"
        >
          <h3 className="text-2xl font-bold text-white mb-6 font-elegant text-center">
            🌳 Evolution Timeline
          </h3>
          <div className="space-y-4">
            {mutationHistory.map((mutation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
              >
                <div className="text-2xl">🔄</div>
                <div className="flex-1">
                  <div className="text-white font-semibold">
                    Generation {index + 1}
                  </div>
                  <div className="text-sm text-white/60 font-mono">
                    {mutation.dna.substring(0, 20)}...
                  </div>
                </div>
                <div className="text-right text-sm text-white/70">
                  <div>🫁 {mutation.traits.respiration}</div>
                  <div>🌍 {mutation.traits.climate_tolerance}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
