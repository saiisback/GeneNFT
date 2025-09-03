import { NextRequest, NextResponse } from 'next/server';

// Real genome data sources
const genomeSources = {
  // Ensembl REST API
  ensembl: {
    baseUrl: 'https://rest.ensembl.org',
    endpoints: {
      info: '/info/species',
      assembly: '/info/assembly',
      genes: '/lookup/symbol'
    }
  },
  // UCSC Genome Browser API
  ucsc: {
    baseUrl: 'https://api.genome.ucsc.edu',
    endpoints: {
      genomes: '/list/ucscGenomes',
      tracks: '/list/tracks'
    }
  },
  // IGV.org pre-configured genomes
  igv: {
    baseUrl: 'https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes',
    genomes: {
      human: {
        id: "hg38",
        name: "Human (GRCh38/hg38)",
        fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/hg38/hg38.fa",
        indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/hg38/hg38.fa.fai",
        description: "Human genome assembly GRCh38 (hg38)",
        chromosomeCount: 23,
        size: "3.2 Gb"
      },
      mouse: {
        id: "mm10",
        name: "Mouse (mm10)",
        fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/mm10/mm10.fa",
        indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/mm10/mm10.fa.fai",
        description: "Mouse genome assembly mm10",
        chromosomeCount: 20,
        size: "2.8 Gb"
      },
      rat: {
        id: "rn6",
        name: "Rat (rn6)",
        fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/rn6/rn6.fa",
        indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/rn6/rn6.fa.fai",
        description: "Rat genome assembly rn6",
        chromosomeCount: 21,
        size: "2.9 Gb"
      },
      zebrafish: {
        id: "danRer10",
        name: "Zebrafish (danRer10)",
        fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/danRer10/danRer10.fa",
        indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/danRer10/danRer10.fa.fai",
        description: "Zebrafish genome assembly danRer10",
        chromosomeCount: 25,
        size: "1.4 Gb"
      },
      fruitfly: {
        id: "dm6",
        name: "Fruit Fly (dm6)",
        fastaURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/dm6/dm6.fa",
        indexURL: "https://s3.dualstack.us-east-1.amazonaws.com/igv.org.genomes/dm6/dm6.fa.fai",
        description: "Drosophila melanogaster genome assembly dm6",
        chromosomeCount: 4,
        size: "143 Mb"
      }
    }
  }
};

// Fetch genome data from Ensembl API
async function fetchFromEnsembl(animal: string) {
  try {
    // First, get species info from Ensembl
    const speciesResponse = await fetch(`${genomeSources.ensembl.baseUrl}${genomeSources.ensembl.endpoints.info}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GeneNFT/1.0'
      }
    });

    if (!speciesResponse.ok) {
      throw new Error(`Ensembl API error: ${speciesResponse.status}`);
    }

    const speciesData = await speciesResponse.json();
    
    // Find the species by name (case-insensitive)
    const species = speciesData.species?.find((s: any) => 
      s.display_name.toLowerCase().includes(animal.toLowerCase()) ||
      s.name.toLowerCase().includes(animal.toLowerCase())
    );

    if (!species) {
      throw new Error(`Species "${animal}" not found in Ensembl database`);
    }

    // Get assembly info for the species
    const assemblyResponse = await fetch(`${genomeSources.ensembl.baseUrl}${genomeSources.ensembl.endpoints.assembly}/${species.name}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GeneNFT/1.0'
      }
    });

    if (!assemblyResponse.ok) {
      throw new Error(`Assembly API error: ${assemblyResponse.status}`);
    }

    const assemblyData = await assemblyResponse.json();

    return {
      id: species.name,
      name: `${species.display_name} (${assemblyData.assembly_name || 'Unknown Assembly'})`,
      description: `Genome assembly from Ensembl for ${species.display_name}`,
      chromosomeCount: assemblyData.top_level_sequences?.length || 'Unknown',
      size: 'Variable',
      source: 'Ensembl',
      species: species.display_name,
      assembly: assemblyData.assembly_name,
      // Note: Ensembl doesn't provide direct FASTA URLs, so we'll use IGV.org if available
      useIGV: true
    };
  } catch (error) {
    console.error('Ensembl API error:', error);
    throw error;
  }
}

// Fetch genome data from UCSC API
async function fetchFromUCSC(animal: string) {
  try {
    // Get available genomes from UCSC
    const genomesResponse = await fetch(`${genomeSources.ucsc.baseUrl}${genomeSources.ucsc.endpoints.genomes}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GeneNFT/1.0'
      }
    });

    if (!genomesResponse.ok) {
      throw new Error(`UCSC API error: ${genomesResponse.status}`);
    }

    const genomesData = await genomesResponse.json();
    
    // Find the genome by name (case-insensitive)
    const genome = genomesData.ucscGenomes?.find((g: any) => 
      g.description.toLowerCase().includes(animal.toLowerCase()) ||
      g.name.toLowerCase().includes(animal.toLowerCase())
    );

    if (!genome) {
      throw new Error(`Genome "${animal}" not found in UCSC database`);
    }

    return {
      id: genome.name,
      name: `${genome.description} (${genome.name})`,
      description: `Genome assembly from Ensembl for ${genome.description}`,
      chromosomeCount: 'Variable',
      size: 'Variable',
      source: 'UCSC',
      species: genome.description,
      assembly: genome.name,
      useIGV: true
    };
  } catch (error) {
    console.error('UCSC API error:', error);
    throw error;
  }
}

// Main genome search function
async function searchGenome(animal: string) {
  try {
    // First check if we have IGV.org data for this animal
    const igvGenome = genomeSources.igv.genomes[animal.toLowerCase() as keyof typeof genomeSources.igv.genomes];
    
    if (igvGenome) {
      return {
        ...igvGenome,
        source: 'IGV.org',
        useIGV: true
      };
    }

    // Try Ensembl API
    try {
      const ensemblData = await fetchFromEnsembl(animal);
      return ensemblData;
    } catch (ensemblError) {
      console.log('Ensembl search failed, trying UCSC...');
    }

    // Try UCSC API
    try {
      const ucscData = await fetchFromUCSC(animal);
      return ucscData;
    } catch (ucscError) {
      console.log('UCSC search failed...');
    }

    // If all APIs fail, throw error
    throw new Error(`Unable to find genome data for "${animal}" in any database`);
    
  } catch (error) {
    console.error('Genome search error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { animal } = await request.json();
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal name is required' },
        { status: 400 }
      );
    }
    
    console.log(`Searching for genome: ${animal}`);
    
    // Search for genome data
    const genomeData = await searchGenome(animal);
    
    console.log(`Found genome:`, genomeData);
    
    // Return the genome configuration
    return NextResponse.json({
      success: true,
      data: genomeData
    });
    
  } catch (error) {
    console.error('Error processing genome request:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          suggestions: Object.keys(genomeSources.igv.genomes),
          message: "Try one of the available genomes listed above, or check the spelling of your search term."
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process genome request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return list of available genomes from IGV.org
    const availableGenomes = Object.entries(genomeSources.igv.genomes).map(([key, genome]) => ({
      key,
      id: genome.id,
      name: genome.name,
      description: genome.description,
      chromosomeCount: genome.chromosomeCount,
      size: genome.size,
      source: 'IGV.org'
    }));
    
    return NextResponse.json({
      success: true,
      count: availableGenomes.length,
      genomes: availableGenomes,
      sources: ['IGV.org', 'Ensembl', 'UCSC'],
      note: "IGV.org genomes are pre-configured. Other sources are searched dynamically."
    });
    
  } catch (error) {
    console.error('Error fetching available genomes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available genomes' },
      { status: 500 }
    );
  }
}
