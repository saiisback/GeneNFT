import { NFT, XMLUploadRequest, XMLUploadResponse, NFTListing, Transaction, UserCollection, MarketplaceStats, ListNFTRequest, BuyNFTRequest } from './types';

const API_BASE_URL = 'http://127.0.0.1:3001/api';

// Existing NFT functions
export async function getAllNFTs(): Promise<NFT[]> {
  const response = await fetch(`${API_BASE_URL}/nfts`);
  if (!response.ok) throw new Error('Failed to fetch NFTs');
  return response.json();
}

export async function getNFTById(id: string): Promise<NFT> {
  const response = await fetch(`${API_BASE_URL}/nft/${id}`);
  if (!response.ok) throw new Error('Failed to fetch NFT');
  return response.json();
}

export async function uploadXML(request: XMLUploadRequest): Promise<XMLUploadResponse> {
  const formData = new FormData();
  formData.append('name', request.name);
  formData.append('description', request.description);
  formData.append('external_url', request.external_url);
  formData.append('license', request.license);
  formData.append('xml_file', request.xml_file);
  formData.append('wallet_address', request.wallet_address);

  const response = await fetch(`${API_BASE_URL}/nft/upload-xml`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload XML');
  return response.json();
}

// New marketplace functions
export async function getActiveListings(): Promise<NFTListing[]> {
  const response = await fetch(`${API_BASE_URL}/marketplace/listings`);
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
}

export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  const response = await fetch(`${API_BASE_URL}/marketplace/stats`);
  if (!response.ok) throw new Error('Failed to fetch marketplace stats');
  return response.json();
}

export async function listNFT(request: ListNFTRequest): Promise<{ message: string; listing: NFTListing }> {
  const response = await fetch(`${API_BASE_URL}/marketplace/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to list NFT');
  return response.json();
}

export async function buyNFT(request: BuyNFTRequest): Promise<{ message: string; transaction: Transaction }> {
  const response = await fetch(`${API_BASE_URL}/marketplace/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to buy NFT');
  return response.json();
}

export async function cancelListing(request: ListNFTRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/marketplace/cancel`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to cancel listing');
  return response.json();
}

export async function getUserCollection(walletAddress: string): Promise<UserCollection> {
  const response = await fetch(`${API_BASE_URL}/collection/${walletAddress}`);
  if (!response.ok) throw new Error('Failed to fetch user collection');
  return response.json();
}
