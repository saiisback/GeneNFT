
use tower_http::cors::{Any, CorsLayer};
use crate::{routes::create_router, state::AppState};

mod models;
mod routes;
mod state;

#[tokio::main]
async fn main() {
    println!("🚀 Starting GeneNFT Backend Server...");
    
    // Initialize app state with mock data
    let state = AppState::new();
    
    // Create router with CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);
    
    let app = create_router(state)
        .layer(cors);
    
    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await.unwrap();
    println!("✅ Server running on http://127.0.0.1:3001");
    println!("📚 Available endpoints:");
    println!("   GET  /nfts - Get all NFTs");
    println!("   GET  /nft/:id - Get NFT by ID");
    println!("   POST /nft/mint - Mint new NFT");
    
    axum::serve(listener, app).await.unwrap();
}
