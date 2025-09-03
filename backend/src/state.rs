use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::models::NFT;
use chrono::Utc;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub nfts: Arc<RwLock<HashMap<String, NFT>>>,
}

impl AppState {
    pub fn new() -> Self {
        let mut nfts = HashMap::new();
        
        // Add some mock NFTs
        let mock_nfts = vec![
            Self::create_mock_nft(
                "Golden Eagle",
                "0x7a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
                "Aquila chrysaetos genome sequence...",
                "Legendary"
            ),
            Self::create_mock_nft(
                "Blue Whale",
                "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
                "Balaenoptera musculus genome sequence...",
                "Epic"
            ),
            Self::create_mock_nft(
                "Red Panda",
                "0x9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b",
                "Ailurus fulgens genome sequence...",
                "Rare"
            ),
            Self::create_mock_nft(
                "Snow Leopard",
                "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
                "Panthera uncia genome sequence...",
                "Epic"
            ),
            Self::create_mock_nft(
                "Monarch Butterfly",
                "0x3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d",
                "Danaus plexippus genome sequence...",
                "Common"
            ),
        ];
        
        for nft in mock_nfts {
            nfts.insert(nft.id.clone(), nft);
        }
        
        Self {
            nfts: Arc::new(RwLock::new(nfts)),
        }
    }
    
    fn create_mock_nft(species_name: &str, dna_hash: &str, genome_data: &str, rarity: &str) -> NFT {
        NFT {
            id: Uuid::new_v4().to_string(),
            species_name: species_name.to_string(),
            dna_hash: dna_hash.to_string(),
            genome_data: genome_data.to_string(),
            mint_date: Utc::now(),
            blockchain_tx: format!("0x{}", Uuid::new_v4().to_string().replace("-", "")),
            token_uri: format!("ipfs://{}", Uuid::new_v4().to_string()),
            owner: "0x1234567890abcdef1234567890abcdef12345678".to_string(),
            rarity: rarity.to_string(),
        }
    }
    
    pub async fn add_nft(&self, nft: NFT) {
        let mut nfts = self.nfts.write().await;
        nfts.insert(nft.id.clone(), nft);
    }
    
    pub async fn get_all_nfts(&self) -> Vec<NFT> {
        let nfts = self.nfts.read().await;
        nfts.values().cloned().collect()
    }
    
    pub async fn get_nft_by_id(&self, id: &str) -> Option<NFT> {
        let nfts = self.nfts.read().await;
        nfts.get(id).cloned()
    }
}
