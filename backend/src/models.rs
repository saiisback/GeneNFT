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
    pub price: Option<f64>, // Price in ETH or native token
    pub is_listed: bool, // Whether NFT is listed for sale
    pub listing_date: Option<String>, // When it was listed
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

// New marketplace models
#[derive(Debug, Deserialize)]
pub struct ListNFTRequest {
    pub nft_id: String,
    pub price: f64,
    pub seller_address: String,
}

#[derive(Debug, Deserialize)]
pub struct BuyNFTRequest {
    pub nft_id: String,
    pub buyer_address: String,
    pub price: f64,
}

#[derive(Debug, Serialize)]
pub struct ListNFTResponse {
    pub message: String,
    pub listing: NFTListing,
}

#[derive(Debug, Serialize)]
pub struct BuyNFTResponse {
    pub message: String,
    pub transaction: Transaction,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NFTListing {
    pub nft_id: String,
    pub price: f64,
    pub seller: String,
    pub listed_at: String,
    pub status: ListingStatus,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ListingStatus {
    Active,
    Sold,
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub id: String,
    pub nft_id: String,
    pub seller: String,
    pub buyer: String,
    pub price: f64,
    pub transaction_hash: String,
    pub timestamp: String,
}

#[derive(Debug, Serialize)]
pub struct UserCollection {
    pub wallet_address: String,
    pub owned_nfts: Vec<NFT>,
    pub listed_nfts: Vec<NFT>,
    pub transaction_history: Vec<Transaction>,
}

#[derive(Debug, Serialize)]
pub struct MarketplaceStats {
    pub total_listings: usize,
    pub total_volume: f64,
    pub recent_transactions: Vec<Transaction>,
    pub floor_price: Option<f64>,
}
