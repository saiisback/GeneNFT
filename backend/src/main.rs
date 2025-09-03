
use axum::Router;
use std::sync::Arc;
use tower_http::cors::CorsLayer;

mod models;
mod routes;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {
    println!("🧬 Starting GeneNFT Backend Server...");
    
    // Create app state
    let app_state = Arc::new(AppState::new());
    
    // Create router
    let app = Router::new()
        .nest("/api", routes::create_router(app_state))
        .layer(CorsLayer::permissive());

    println!("🚀 Server starting on http://127.0.0.1:3001");
    println!("📡 Available endpoints:");
    println!("   GET  /api/nfts - Get all NFTs");
    println!("   GET  /api/nft/:id - Get NFT by ID");
    println!("   POST /api/nft/upload-xml - Upload XML and mint NFT");

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await.unwrap();
    println!("✅ Server running on http://127.0.0.1:3001");
    
    axum::serve(listener, app).await.unwrap();
}
