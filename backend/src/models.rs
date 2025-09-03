use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NFT {
    pub id: String,
    pub species_name: String,
    pub dna_hash: String,
    pub genome_data: String,
    pub mint_date: DateTime<Utc>,
    pub blockchain_tx: String,
    pub token_uri: String,
    pub owner: String,
    pub rarity: String,
}

#[derive(Debug, Deserialize)]
pub struct MintRequest {
    pub species_name: String,
    pub dna_hash: String,
    pub genome_data: String,
}

#[derive(Debug, Serialize)]
pub struct MintResponse {
    pub success: bool,
    pub nft: NFT,
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: T,
    pub message: String,
}
