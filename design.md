# GeneNFT – Decentralized DNA Mock Platform

## Overview
GeneNFT is a **mock biodiversity NFT platform** built for hackathons.  
It simulates minting NFTs for species DNA data without requiring Solidity or real blockchain.  
The system demonstrates the flow: DNA → Genome Hash → NFT → Explorer Dashboard.

---

## System Architecture
1. **Frontend (Next.js + Tailwind)**
   - Dashboard to explore NFTs
   - Mint page to add new DNA-based NFTs
   - NFT details page

2. **Backend (Rust + Axum)**
   - Exposes REST API for DNA → NFT workflow
   - Stores data in-memory (or NeonDB extension)
   - Returns mock blockchain fields like `blockchain_tx`

3. **Mock Blockchain Layer**
   - Simulated mint transaction
   - Returns `nft_id`, `blockchain_tx`, and metadata
   - No Solidity/real chain required

---

## API Endpoints
- `POST /nft/mint` – Mint NFT from genome hash
- `GET /nfts` – Fetch all NFTs
- `GET /nft/:id` – Fetch NFT details

---

## Demo Flow
1. User inputs species & DNA hash in frontend
2. Rust API returns NFT JSON with mock blockchain_tx
3. Frontend displays NFT cards in explorer
4. Judges see end-to-end DNA → NFT → Explorer journey