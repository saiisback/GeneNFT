import axios from 'axios';
import { NFT, XMLUploadRequest, XMLUploadResponse } from './types';

// Create axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:3001/api',
  timeout: 10000,
});

// API service
export const nftApi = {
  // Get all NFTs
  getAll: async (): Promise<NFT[]> => {
    const response = await api.get<NFT[]>('/nfts');
    return response.data;
  },

  // Get NFT by ID
  getById: async (id: string): Promise<NFT> => {
    const response = await api.get<NFT>(`/nft/${id}`);
    return response.data;
  },

  // Upload XML and mint NFT
  uploadXML: async (request: XMLUploadRequest): Promise<XMLUploadResponse> => {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('external_url', request.external_url);
    formData.append('license', request.license);
    formData.append('xml_file', request.xml_file);
    formData.append('wallet_address', request.wallet_address);

    const response = await api.post<XMLUploadResponse>('/nft/upload-xml', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
