# 🧬 GeneNFT - Blockchain-Powered Genetic Research Platform

> **Revolutionizing genetic research through blockchain technology and AI-generated art**

[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ThirdWeb](https://img.shields.io/badge/ThirdWeb-000000?style=for-the-badge&logo=web3.js&logoColor=white)](https://thirdweb.com/)

## 🌟 Overview

GeneNFT is a cutting-edge platform that combines **genetic research**, **blockchain technology**, and **AI-generated visual art**. It allows researchers to:

- **Mint NFTs** from genetic data (XML files)
- **Trade genetic sequences** on a decentralized marketplace
- **Visualize DNA data** with AI-generated artwork
- **Collaborate globally** through blockchain-based ownership

## 🚀 Features

### 🧪 Core Functionality
- **XML to NFT Conversion**: Upload genetic data files and mint unique NFTs
- **AI Art Generation**: Automatic visual representation of genetic sequences
- **Rarity System**: Legendary, Epic, Rare, and Common classifications
- **Blockchain Integration**: ThirdWeb wallet connection and transaction handling

### 🏪 Marketplace
- **NFT Trading**: Buy, sell, and trade genetic NFTs
- **Real-time Stats**: Market volume, floor prices, and transaction history
- **Collection Management**: View owned, listed, and purchased NFTs
- **Secure Transactions**: Blockchain-based ownership transfer

### 🎨 User Experience
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **Particle Backgrounds**: Dynamic visual effects
- **Smooth Animations**: Framer Motion powered interactions
- **Mobile Optimized**: Works seamlessly on all devices

## 🏗️ Architecture

```
GeneNFT/
├── 🦀 Backend (Rust + Axum)
│   ├── RESTful API endpoints
│   ├── In-memory data storage
│   ├── XML processing & validation
│   └── AI art generation
├── ⚛️ Frontend (Next.js + TypeScript)
│   ├── React components
│   ├── ThirdWeb integration
│   ├── Tailwind CSS styling
│   └── Responsive design
└── 🔗 Blockchain Integration
    ├── ThirdWeb SDK
    ├── Wallet connection
    └── NFT transactions
```

## 🛠️ Technology Stack

### Backend
- **Rust**: High-performance systems programming
- **Axum**: Modern web framework for Rust
- **Serde**: Serialization/deserialization
- **Chrono**: Date and time handling
- **SHA2**: Cryptographic hashing

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **ThirdWeb**: Web3 development framework

### Blockchain
- **ThirdWeb SDK**: Wallet connection & NFT operations
- **Ethereum**: Smart contract platform
- **IPFS**: Decentralized file storage

## 📦 Installation

### Prerequisites
- **Rust** (latest stable version) - [Install Rust](https://rustup.rs/)
- **Node.js** 18+ and npm - [Install Node.js](https://nodejs.org/)
- **Git** - [Install Git](https://git-scm.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/genenft.git
   cd genenft
   ```

2. **Start the Backend**
   ```bash
   cd backend
   cargo run
   ```
   The Rust backend will start on `http://127.0.0.1:3001`

3. **Start the Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The Next.js frontend will start on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000` to start using GeneNFT!

## 🔌 API Endpoints

### Core NFT Operations
- `GET /api/nfts` - Fetch all NFTs
- `GET /api/nft/:id` - Fetch NFT by ID
- `POST /api/nft/upload-xml` - Upload XML and mint NFT

### Marketplace Operations
- `GET /api/marketplace/listings` - Get active NFT listings
- `GET /api/marketplace/stats` - Get marketplace statistics
- `POST /api/marketplace/list` - List NFT for sale
- `POST /api/marketplace/buy` - Buy listed NFT
- `DELETE /api/marketplace/cancel` - Cancel NFT listing

### User Collections
- `GET /api/collection/:wallet` - Get user's NFT collection

## 🎯 Usage Guide

### 1. Connect Your Wallet
- Click "Connect Wallet" in the top navigation
- Choose your preferred wallet (MetaMask, WalletConnect, etc.)
- Approve the connection

### 2. Upload Genetic Data
- Navigate to the Upload page
- Fill in NFT details (name, description, license)
- Upload your XML file containing genetic data
- Click "Upload XML" to mint your NFT

### 3. List NFTs for Sale
- Go to your Collection page
- Find the NFT you want to sell
- Click "List for Sale"
- Set your price in ETH
- Confirm the listing

### 4. Buy NFTs
- Browse the Marketplace
- Find an NFT you want to purchase
- Click "Buy Now"
- Confirm the transaction
- The NFT will be transferred to your wallet

### 5. Manage Your Collection
- View all your owned NFTs
- See your listed NFTs
- Track purchase history
- Cancel listings if needed

## 🧪 Development

### Project Structure
```
genenft/
├── backend/                 # Rust backend
│   ├── src/
│   │   ├── main.rs         # Server entry point
│   │   ├── models.rs        # Data structures
│   │   ├── routes.rs        # API endpoints
│   │   └── state.rs         # Application state
│   ├── Cargo.toml           # Rust dependencies
│   └── target/              # Build output
├── frontend/                # Next.js frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── package.json         # Node.js dependencies
│   └── .next/               # Build output
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

### Development Commands

#### Backend
```bash
cd backend
cargo check          # Check code without building
cargo build          # Build the project
cargo run            # Run the development server
cargo test           # Run tests
cargo clippy         # Run linter
```

#### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# ThirdWeb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_THIRDWEB_CHAIN_ID=1

# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

## 🚀 Deployment

### Backend Deployment
1. **Build the release version**
   ```bash
   cd backend
   cargo build --release
   ```

2. **Deploy the binary**
   - Copy `target/release/genenft-backend` to your server
   - Set up environment variables
   - Run with a process manager (systemd, PM2, etc.)

### Frontend Deployment
1. **Build the production version**
   ```bash
   cd frontend
   npm run build
   ```



**Made with ❤️ by the  Team TRAE**

*Revolutionizing genetic research, one NFT at a time.*
