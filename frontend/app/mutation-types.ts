// Gene mutation playground types and data

export interface GeneData {
  species: string;
  dna: string;
  traits: {
    respiration: string;
    climate_tolerance: string;
    disease_resistance: string;
    special_ability: string;
    appearance: string;
  };
  description: string;
  image?: string;
}

export type MutationType = 'substitution' | 'insertion' | 'deletion';

export interface TraitRule {
  positions: number[];
  mutations: string[];
  description: string;
}

export interface TraitRules {
  [key: string]: TraitRule;
}

// Comprehensive trait mapping rules
export const traitRules: TraitRules = {
  respiration: {
    positions: [0, 1, 2, 3, 4],
    mutations: [
      'Air Breathing',
      'Underwater Breathing',
      'Photosynthesis',
      'Anaerobic',
      'Universal Respiration',
      'Energy Absorption',
      'Quantum Respiration'
    ],
    description: 'How the organism processes oxygen and energy'
  },
  climate_tolerance: {
    positions: [5, 6, 7, 8, 9],
    mutations: [
      'Tropical',
      'Arctic',
      'Desert',
      'Aquatic',
      'Universal Adaptation',
      'Space Survival',
      'Dimensional Travel'
    ],
    description: 'Environmental conditions the organism can survive in'
  },
  disease_resistance: {
    positions: [10, 11, 12, 13, 14],
    mutations: [
      'Low',
      'Medium',
      'High',
      'Extreme',
      'Immune',
      'Disease Absorption',
      'Reality Immunity'
    ],
    description: 'Resistance to diseases and harmful agents'
  },
  special_ability: {
    positions: [15, 16, 17, 18, 19],
    mutations: [
      'None',
      'Night Vision',
      'Regeneration',
      'Telepathy',
      'Reality Manipulation',
      'Time Control',
      'Omnipotence'
    ],
    description: 'Unique abilities beyond normal biological functions'
  },
  appearance: {
    positions: [20, 21, 22, 23, 24],
    mutations: [
      'Normal',
      'Glowing',
      'Transparent',
      'Metallic',
      'Ethereal',
      'Holographic',
      'Beyond Reality'
    ],
    description: 'Visual characteristics and physical form'
  }
};

// Sample gene data with more variety
export const sampleGenes: GeneData[] = [
  {
    species: "Tiger",
    dna: "ATGCTGACGTACGTACGTACGTA",
    traits: {
      respiration: "Air Breathing",
      climate_tolerance: "Tropical",
      disease_resistance: "Low",
      special_ability: "None",
      appearance: "Normal"
    },
    description: "A majestic apex predator with powerful hunting abilities"
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
    },
    description: "Intelligent marine mammal with advanced communication"
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
    },
    description: "Master of the skies with incredible eyesight"
  },
  {
    species: "Dragon",
    dna: "CGTACGTACGTACGTACGTACG",
    traits: {
      respiration: "Fire Breathing",
      climate_tolerance: "Volcanic",
      disease_resistance: "Extreme",
      special_ability: "Flight & Fire",
      appearance: "Scales & Wings"
    },
    description: "Mythical creature with legendary powers"
  },
  {
    species: "Phoenix",
    dna: "ACGTACGTACGTACGTACGTAC",
    traits: {
      respiration: "Phoenix Fire",
      climate_tolerance: "Solar",
      disease_resistance: "Immune",
      special_ability: "Rebirth",
      appearance: "Ethereal Fire"
    },
    description: "Immortal bird that rises from its own ashes"
  }
];

// DNA base colors for visualization
export const dnaBaseColors = {
  'A': 'bg-red-500/80',
  'T': 'bg-green-500/80',
  'G': 'bg-blue-500/80',
  'C': 'bg-yellow-500/80'
};

// Mutation effects and descriptions
export const mutationEffects = {
  substitution: {
    name: "Base Substitution",
    description: "One DNA base is replaced with another",
    icon: "🔄",
    probability: 0.6
  },
  insertion: {
    name: "Base Insertion", 
    description: "A new DNA base is added to the sequence",
    icon: "➕",
    probability: 0.2
  },
  deletion: {
    name: "Base Deletion",
    description: "A DNA base is removed from the sequence", 
    icon: "➖",
    probability: 0.2
  }
};
