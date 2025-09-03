# GeneNFT Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Thirdweb
1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or use an existing one
3. Copy your Client ID
4. Create a `.env.local` file in the frontend directory:
```bash
# Thirdweb Client ID (public - safe to expose)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-actual-client-id-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:3002
```

### 3. Start Development Server
```bash
npm run dev
```

## Features
- Connect wallet using Thirdweb SDK
- Upload XML files and mint NFTs
- View NFT collection with rich metadata
- Wallet address integration with backend

## Wallet Integration
The app now includes:
- Wallet connection button in the header
- Connected wallet address display
- Wallet address sent to backend when minting NFTs
- NFT ownership tied to connected wallet

## Environment Variables

- **NEXT_PUBLIC_THIRDWEB_CLIENT_ID**: Your Thirdweb Client ID (required)
- **NEXT_PUBLIC_API_URL**: Backend API URL (defaults to port 3002)

## Backend Port
The backend runs on port 3002 to avoid conflicts with other services.
