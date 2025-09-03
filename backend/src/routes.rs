use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use crate::{models::*, state::AppState};
use chrono::Utc;
use uuid::Uuid;

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/nfts", get(get_all_nfts))
        .route("/nft/:id", get(get_nft_by_id))
        .route("/nft/mint", post(mint_nft))
        .with_state(state)
}

async fn get_all_nfts(
    State(state): State<AppState>,
) -> Json<ApiResponse<Vec<NFT>>> {
    let nfts = state.get_all_nfts().await;
    
    Json(ApiResponse {
        success: true,
        data: nfts,
        message: "NFTs retrieved successfully".to_string(),
    })
}

async fn get_nft_by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<NFT>>, StatusCode> {
    if let Some(nft) = state.get_nft_by_id(&id).await {
        Ok(Json(ApiResponse {
            success: true,
            data: nft,
            message: "NFT retrieved successfully".to_string(),
        }))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn mint_nft(
    State(state): State<AppState>,
    Json(mint_req): Json<MintRequest>,
) -> Json<MintResponse> {
    let new_nft = NFT {
        id: Uuid::new_v4().to_string(),
        species_name: mint_req.species_name,
        dna_hash: mint_req.dna_hash,
        genome_data: mint_req.genome_data,
        mint_date: Utc::now(),
        blockchain_tx: format!("0x{}", Uuid::new_v4().to_string().replace("-", "")),
        token_uri: format!("ipfs://{}", Uuid::new_v4().to_string()),
        owner: "0x1234567890abcdef1234567890abcdef12345678".to_string(),
        rarity: "Common".to_string(), // Default rarity for new mints
    };
    
    state.add_nft(new_nft.clone()).await;
    
    Json(MintResponse {
        success: true,
        nft: new_nft,
        message: "NFT minted successfully".to_string(),
    })
}
