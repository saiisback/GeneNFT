use std::collections::HashMap;
use std::sync::Mutex;
use chrono::Utc;
use sha2::{Sha256, Digest};
use hex;
use base64::{Engine as _, engine::general_purpose};
use crate::models::NFT;

pub struct AppState {
    pub nfts: Mutex<HashMap<String, NFT>>,
}

impl AppState {
    pub fn new() -> Self {
        let mut state = AppState {
            nfts: Mutex::new(HashMap::new()),
        };
        
        // Add some mock NFTs
        state.add_mock_nfts();
        state
    }

    pub fn add_nft(&self, nft: NFT) {
        if let Ok(mut nfts) = self.nfts.lock() {
            nfts.insert(nft.id.clone(), nft);
        }
    }

    pub fn get_all_nfts(&self) -> Vec<NFT> {
        if let Ok(nfts) = self.nfts.lock() {
            nfts.values().cloned().collect()
        } else {
            Vec::new()
        }
    }

    pub fn get_nft_by_id(&self, id: &str) -> Option<NFT> {
        if let Ok(nfts) = self.nfts.lock() {
            nfts.get(id).cloned()
        } else {
            None
        }
    }

    pub fn hash_xml_content(&self, content: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(content);
        hex::encode(hasher.finalize())
    }

    pub fn generate_token_id(&self) -> String {
        if let Ok(nfts) = self.nfts.lock() {
            format!("GENE-{:08}", nfts.len() + 1)
        } else {
            format!("GENE-{:08}", 1)
        }
    }

    pub fn determine_rarity(&self, xml_hash: &str) -> String {
        // Simple rarity determination based on hash
        let hash_chars: Vec<char> = xml_hash.chars().collect();
        let rare_chars = ['a', 'b', 'c', 'd', 'e', 'f'];
        
        let rare_count = hash_chars.iter()
            .filter(|&&c| rare_chars.contains(&c))
            .count();
        
        match rare_count {
            0..=2 => "Common".to_string(),
            3..=4 => "Rare".to_string(),
            5..=6 => "Epic".to_string(),
            _ => "Legendary".to_string(),
        }
    }

    pub fn generate_xml_visualization(&self, _xml_content: &str, xml_hash: &str) -> String {
        // Generate a simple visual representation based on XML content and hash
        // This creates a basic heatmap-like pattern using the hash as seed
        
        let hash_bytes = hex::decode(xml_hash).unwrap_or_default();
        let mut visual_data = Vec::new();
        
        // Create a 16x16 grid based on hash bytes
        for i in 0..16 {
            for j in 0..16 {
                let idx = (i * 16 + j) % hash_bytes.len();
                let intensity = hash_bytes.get(idx).unwrap_or(&0);
                visual_data.push(*intensity);
            }
        }
        
        // Convert to a simple SVG representation
        let svg = self.create_svg_heatmap(&visual_data, xml_hash);
        
        // Convert SVG to base64 for storage using the new Engine API
        general_purpose::STANDARD.encode(svg.as_bytes())
    }

    fn create_svg_heatmap(&self, data: &[u8], hash: &str) -> String {
        let width = 16;
        let height = 16;
        let cell_size = 20;
        
        let mut svg = format!(
            r#"<svg width="{}" height="{}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#4ecdc4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#45b7d1;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad1)"/>
            <text x="8" y="12" font-family="monospace" font-size="8" fill="white">XML Hash: {}</text>"#,
            width * cell_size, height * cell_size, &hash[..8]
        );
        
        for (i, &intensity) in data.iter().enumerate() {
            let x = (i % width) * cell_size;
            let y = (i / height) * cell_size;
            let opacity = intensity as f32 / 255.0;
            
            svg.push_str(&format!(
                r#"<rect x="{}" y="{}" width="{}" height="{}" fill="rgba(255,255,255,{})" />"#,
                x, y, cell_size, cell_size, opacity
            ));
        }
        
        svg.push_str("</svg>");
        svg
    }

    fn add_mock_nfts(&mut self) {
        let mock_nfts = vec![
            NFT {
                id: "1".to_string(),
                token_id: "GENE-00001".to_string(),
                metadata: crate::models::NFTMetadata {
                    name: "Human Genome Sequence".to_string(),
                    description: "Complete human genome sequence data".to_string(),
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjZiIi8+PHRleHQgeD0iMTAiIHk9IjIwIiBmaWxsPSJ3aGl0ZSI+SHVtYW4gR2Vub21lPC90ZXh0Pjwvc3ZnPg==".to_string(),
                    attributes: vec![
                        crate::models::Attribute {
                            trait_type: "Species".to_string(),
                            value: "Human".to_string(),
                        },
                        crate::models::Attribute {
                            trait_type: "Complexity".to_string(),
                            value: "High".to_string(),
                        },
                    ],
                    external_url: "https://example.com/human-genome".to_string(),
                    license: "MIT".to_string(),
                    provenance: "Generated from XML data".to_string(),
                },
                xml_content: "<genome><species>human</species><complexity>high</complexity></genome>".to_string(),
                xml_hash: "a1b2c3d4e5f6".to_string(),
                owner: "0x1234567890123456789012345678901234567890".to_string(),
                rarity: "Legendary".to_string(),
                created_at: Utc::now().to_rfc3339(),
            },
            NFT {
                id: "2".to_string(),
                token_id: "GENE-00002".to_string(),
                metadata: crate::models::NFTMetadata {
                    name: "Plant DNA Analysis".to_string(),
                    description: "Genetic analysis of rare plant species".to_string(),
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGVjZGM0Ii8+PHRleHQgeD0iMTAiIHk9IjIwIiBmaWxsPSJ3aGl0ZSI+UGxhbnQgRE5BPC90ZXh0Pjwvc3ZnPg==".to_string(),
                    attributes: vec![
                        crate::models::Attribute {
                            trait_type: "Kingdom".to_string(),
                            value: "Plantae".to_string(),
                        },
                        crate::models::Attribute {
                            trait_type: "Rarity".to_string(),
                            value: "Rare".to_string(),
                        },
                    ],
                    external_url: "https://example.com/plant-dna".to_string(),
                    license: "CC0".to_string(),
                    provenance: "Generated from XML data".to_string(),
                },
                xml_content: "<dna><kingdom>plantae</kingdom><rarity>rare</rarity></dna>".to_string(),
                xml_hash: "f6e5d4c3b2a1".to_string(),
                owner: "0x0987654321098765432109876543210987654321".to_string(),
                rarity: "Epic".to_string(),
                created_at: Utc::now().to_rfc3339(),
            },
        ];

        if let Ok(mut nfts) = self.nfts.lock() {
            for nft in mock_nfts {
                nfts.insert(nft.id.clone(), nft);
            }
        }
    }
}
