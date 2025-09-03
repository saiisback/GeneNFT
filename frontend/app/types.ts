export interface Attribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // Base64 encoded image or URL
  attributes: Attribute[];
  external_url: string;
  license: string;
  provenance: string;
}

export interface NFT {
  id: string;
  token_id: string;
  metadata: NFTMetadata;
  xml_content: string;
  xml_hash: string;
  owner: string;
  rarity: string;
  created_at: string;
}

export interface XMLUploadRequest {
  name: string;
  description: string;
  external_url: string;
  license: string;
  xml_file: File;
  wallet_address: string;
}

export interface XMLUploadResponse {
  message: string;
  nft: NFT;
}
