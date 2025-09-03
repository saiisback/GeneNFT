import axios from 'axios';
import { NFT, MintRequest, ApiResponse, MintResponse } from './types';

const API_BASE_URL = 'http://127.0.0.1:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nftApi = {
  // Get all NFTs
  getAll: async (): Promise<NFT[]> => {
    const response = await api.get<ApiResponse<NFT[]>>('/nfts');
    return response.data.data;
  },

  // Get NFT by ID
  getById: async (id: string): Promise<NFT> => {
    const response = await api.get<ApiResponse<NFT>>(`/nft/${id}`);
    return response.data.data;
  },

  // Mint new NFT
  mint: async (mintRequest: MintRequest): Promise<MintResponse> => {
    const response = await api.post<MintResponse>('/nft/mint', mintRequest);
    return response.data;
  },
};
