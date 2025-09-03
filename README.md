# 🧬 GeneNFT - Decentralized DNA Mock Platform

A mock biodiversity NFT platform built for hackathons that simulates minting NFTs for species DNA data without requiring Solidity or real blockchain.

## 🚀 Quick Start

### Prerequisites
- Rust (latest stable version)
- Node.js 18+ and npm
- Git

### Backend (Rust + Axum)
```bash
cd backend
cargo run
```
The backend will start on `http://127.0.0.1:3001`

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`

## 🏗️ Architecture

- **Backend**: Rust + Axum web server with in-memory storage
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Mock Data**: Pre-populated with 5 sample NFTs
- **API**: RESTful endpoints for NFT operations

## 📡 API Endpoints

- `GET /nfts` - Fetch all NFTs
- `GET /nft/:id` - Fetch NFT by ID
- `POST /nft/mint` - Mint new NFT from DNA data

## 🎯 Features

- **NFT Explorer**: Browse existing DNA-based NFTs
- **Mint Form**: Create new NFTs with species name, DNA hash, and genome data
- **Mock Blockchain**: Simulated transaction hashes and metadata
- **Rarity System**: Legendary, Epic, Rare, and Common classifications
- **Responsive Design**: Modern UI that works on all devices

## 🧪 Mock Data

The system comes pre-loaded with sample NFTs:
- Golden Eagle (Legendary)
- Blue Whale (Epic)
- Red Panda (Rare)
- Snow Leopard (Epic)
- Monarch Butterfly (Common)

## 🔧 Development

### Backend Structure
```
backend/
├── src/
│   ├── main.rs      # Server entry point
│   ├── models.rs    # Data structures
│   ├── routes.rs    # API endpoints
│   └── state.rs     # Application state
└── Cargo.toml
```

### Frontend Structure
```
frontend/
├── app/
│   ├── components/  # React components
│   ├── types.ts     # TypeScript types
│   ├── api.ts       # API service
│   └── page.tsx     # Main page
└── package.json
```

## 🌟 Demo Flow

1. **View NFTs**: Open the frontend to see existing DNA-based NFTs
2. **Mint New NFT**: Use the mint form to create NFTs from DNA data
3. **Explore**: Browse the collection with rarity indicators and blockchain metadata
4. **Mock Blockchain**: See simulated transaction hashes and IPFS URIs

## 🎨 Customization

- Add more species and rarity levels in `backend/src/state.rs`
- Modify the NFT card design in `frontend/app/components/NFTCard.tsx`
- Extend the API with new endpoints in `backend/src/routes.rs`
- Update the mint form fields in `frontend/app/components/MintForm.tsx`

## 🚀 Deployment

This is a mock platform designed for hackathons and demonstrations. For production use, you would need to:
- Replace in-memory storage with a real database
- Implement proper authentication and authorization
- Add real blockchain integration
- Set up proper error handling and validation

## 📝 License

This project is open source and available under the MIT License.
