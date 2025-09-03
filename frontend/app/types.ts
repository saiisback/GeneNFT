export interface NFT {
  id: string;
  species_name: string;
  dna_hash: string;
  genome_data: string;
  mint_date: string;
  blockchain_tx: string;
  token_uri: string;
  owner: string;
  rarity: string;
}

export interface MintRequest {
  species_name: string;
  dna_hash: string;
  genome_data: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface MintResponse {
  success: boolean;
  nft: NFT;
  message: string;
}
