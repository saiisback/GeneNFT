use axum::{
    extract::{State, Multipart},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use std::sync::Arc;
use crate::{models::*, state::AppState};

pub fn create_router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/nfts", get(get_all_nfts))
        .route("/nft/:id", get(get_nft_by_id))
        .route("/nft/upload-xml", post(upload_xml))
        .with_state(state)
}

async fn get_all_nfts(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<NFT>> {
    let nfts = state.get_all_nfts();
    Json(nfts)
}

async fn get_nft_by_id(
    State(state): State<Arc<AppState>>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<NFT>, StatusCode> {
    if let Some(nft) = state.get_nft_by_id(&id) {
        Ok(Json(nft.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn upload_xml(
    State(state): State<Arc<AppState>>,
    mut multipart: Multipart,
) -> Result<Json<XMLUploadResponse>, StatusCode> {
    let mut name = String::new();
    let mut description = String::new();
    let mut external_url = String::new();
    let mut license = String::new();
    let mut xml_content = Vec::new();
    let mut wallet_address = String::new();

    while let Some(field) = multipart.next_field().await.map_err(|_| StatusCode::BAD_REQUEST)? {
        let field_name = field.name().unwrap_or("").to_string();
        
        match field_name.as_str() {
            "name" => {
                name = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
            }
            "description" => {
                description = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
            }
            "external_url" => {
                external_url = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
            }
            "license" => {
                license = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
            }
            "xml_file" => {
                let bytes = field.bytes().await.map_err(|_| StatusCode::BAD_REQUEST)?;
                xml_content = bytes.to_vec();
            }
            "wallet_address" => {
                wallet_address = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
            }
            _ => {}
        }
    }

    // Validate required fields
    if name.is_empty() || description.is_empty() || xml_content.is_empty() || wallet_address.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Generate XML hash
    let xml_hash = state.hash_xml_content(&xml_content);
    
    // Generate visual representation from XML
    let xml_content_str = String::from_utf8_lossy(&xml_content);
    let image_data = state.generate_xml_visualization(&xml_content_str, &xml_hash);
    
    // Generate token ID
    let token_id = state.generate_token_id();
    
    // Determine rarity
    let rarity = state.determine_rarity(&xml_hash);
    
    // Create NFT metadata
    let metadata = NFTMetadata {
        name: name.clone(),
        description: description.clone(),
        image: format!("data:image/svg+xml;base64,{}", image_data),
        attributes: vec![
            Attribute {
                trait_type: "XML Hash".to_string(),
                value: xml_hash.clone(),
            },
            Attribute {
                trait_type: "Rarity".to_string(),
                value: rarity.clone(),
            },
            Attribute {
                trait_type: "File Size".to_string(),
                value: format!("{} bytes", xml_content.len()),
            },
        ],
        external_url,
        license,
        provenance: "Generated from XML upload".to_string(),
    };

    // Create NFT
    let nft = NFT {
        id: uuid::Uuid::new_v4().to_string(),
        token_id,
        metadata,
        xml_content: xml_content_str.to_string(),
        xml_hash,
        owner: wallet_address,
        rarity,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    // Add to state
    state.add_nft(nft.clone());

    Ok(Json(XMLUploadResponse {
        message: "XML uploaded and NFT minted successfully!".to_string(),
        nft,
    }))
}
