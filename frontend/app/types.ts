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
  price?: number; // Price in ETH or native token
  is_listed: boolean; // Whether NFT is listed for sale
  listing_date?: string; // When it was listed
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

// New marketplace types
export interface NFTListing {
  nft_id: string;
  price: number;
  seller: string;
  listed_at: string;
  status: 'Active' | 'Sold' | 'Cancelled';
}

export interface Transaction {
  id: string;
  nft_id: string;
  seller: string;
  buyer: string;
  price: number;
  transaction_hash: string;
  timestamp: string;
}

export interface UserCollection {
  wallet_address: string;
  owned_nfts: NFT[];
  listed_nfts: NFT[];
  transaction_history: Transaction[];
}

export interface MarketplaceStats {
  total_listings: number;
  total_volume: number;
  recent_transactions: Transaction[];
  floor_price?: number;
}

export interface ListNFTRequest {
  nft_id: string;
  price: number;
  seller_address: string;
}

export interface BuyNFTRequest {
  nft_id: string;
  buyer_address: string;
  price: number;
}
