use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Attribute {
    pub trait_type: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image: String, // Base64 encoded image or URL
    pub attributes: Vec<Attribute>,
    pub external_url: String,
    pub license: String,
    pub provenance: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NFT {
    pub id: String,
    pub token_id: String,
    pub metadata: NFTMetadata,
    pub xml_content: String,
    pub xml_hash: String,
    pub owner: String,
    pub rarity: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct XMLUploadRequest {
    pub name: String,
    pub description: String,
    pub external_url: String,
    pub license: String,
    pub xml_file: Vec<u8>,
    pub wallet_address: String,
}

#[derive(Debug, Serialize)]
pub struct XMLUploadResponse {
    pub message: String,
    pub nft: NFT,
}
