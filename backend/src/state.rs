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
        // Use hash to determine art style, colors, and layout
        let hash_bytes = hex::decode(xml_hash).unwrap_or_default();
        
        // Determine art style based on first byte
        let style_choice = hash_bytes.get(0).unwrap_or(&0) % 4;
        
        // Determine color scheme based on second byte
        let color_choice = hash_bytes.get(1).unwrap_or(&0) % 5;
        
        // Determine layout based on third byte
        let layout_choice = hash_bytes.get(2).unwrap_or(&0) % 3;
        
        match style_choice {
            0 => self.create_heatmap_art(hash_bytes, color_choice, layout_choice),
            1 => self.create_geometric_art(hash_bytes, color_choice, layout_choice),
            2 => self.create_dna_helix_art(hash_bytes, color_choice, layout_choice),
            3 => self.create_fractal_art(hash_bytes, color_choice, layout_choice),
            _ => self.create_heatmap_art(hash_bytes, color_choice, layout_choice),
        }
    }

    fn create_heatmap_art(&self, hash_bytes: Vec<u8>, color_choice: u8, layout_choice: u8) -> String {
        let (width, height) = match layout_choice {
            0 => (16, 16),   // Square grid
            1 => (32, 8),    // Wide grid
            _ => (8, 32),    // Tall grid
        };
        
        let cell_size = 20;
        let visual_data = self.generate_visual_data(hash_bytes, width, height);
        let svg = self.create_svg_heatmap(&visual_data, hash_bytes, color_choice, width, height, cell_size);
        general_purpose::STANDARD.encode(svg.as_bytes())
    }

    fn create_geometric_art(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let svg = self.create_svg_geometric(hash_bytes, color_choice);
        general_purpose::STANDARD.encode(svg.as_bytes())
    }

    fn create_dna_helix_art(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let svg = self.create_svg_dna_helix(hash_bytes, color_choice);
        general_purpose::STANDARD.encode(svg.as_bytes())
    }

    fn create_fractal_art(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let svg = self.create_svg_fractal(hash_bytes, color_choice);
        general_purpose::STANDARD.encode(svg.as_bytes())
    }

    fn generate_visual_data(&self, hash_bytes: Vec<u8>, width: usize, height: usize) -> Vec<u8> {
        let mut visual_data = Vec::new();
        for i in 0..height {
            for j in 0..width {
                let idx = (i * width + j) % hash_bytes.len();
                let intensity = hash_bytes.get(idx).unwrap_or(&0);
                visual_data.push(*intensity);
            }
        }
        visual_data
    }

    fn create_svg_heatmap(&self, data: &[u8], hash_bytes: Vec<u8>, color_choice: u8, width: usize, height: usize, cell_size: usize) -> String {
        let (colors, gradient_id) = self.get_color_scheme(color_choice);
        
        let mut svg = format!(
            r#"<svg width="{}" height="{}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="{}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:{};stop-opacity:1" />
                    <stop offset="50%" style="stop-color:{};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:{};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#{})"/>
            <text x="8" y="12" font-family="monospace" font-size="8" fill="white">XML Hash: {}</text>"#,
            width * cell_size, height * cell_size, 
            gradient_id, colors.0, colors.1, colors.2, gradient_id,
            &hash_bytes.iter().take(8).map(|b| format!("{:02x}", b)).collect::<String>()
        );
        
        for (i, &intensity) in data.iter().enumerate() {
            let x = (i % width) * cell_size;
            let y = (i / width) * cell_size;
            let opacity = intensity as f32 / 255.0;
            
            svg.push_str(&format!(
                r#"<rect x="{}" y="{}" width="{}" height="{}" fill="rgba(255,255,255,{})" />"#,
                x, y, cell_size, cell_size, opacity
            ));
        }
        
        svg.push_str("</svg>");
        svg
    }

    fn create_svg_geometric(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let (colors, _) = self.get_color_scheme(color_choice);
        let mut svg = format!(
            r#"<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="{}"/>
            <text x="8" y="12" font-family="monospace" font-size="8" fill="white">Geometric Art</text>"#,
            colors.0
        );
        
        // Create geometric patterns based on hash
        for (i, &byte) in hash_bytes.iter().enumerate() {
            if i < 16 {
                let x = (i % 4) * 80;
                let y = (i / 4) * 80;
                let size = (byte as f32 / 255.0 * 60.0) + 10.0;
                let rotation = (byte as f32 / 255.0 * 360.0);
                
                svg.push_str(&format!(
                    r#"<rect x="{}" y="{}" width="{}" height="{}" fill="{}" transform="rotate({} {} {})" />"#,
                    x + 10, y + 10, size, size, colors.1, rotation, x + 10 + size/2, y + 10 + size/2
                ));
            }
        }
        
        svg.push_str("</svg>");
        svg
    }

    fn create_svg_dna_helix(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let (colors, _) = self.get_color_scheme(color_choice);
        let mut svg = format!(
            r#"<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="{}"/>
            <text x="8" y="12" font-family="monospace" font-size="8" fill="white">DNA Helix</text>"#,
            colors.2
        );
        
        // Create DNA helix pattern
        for i in 0..20 {
            let angle = (i as f32 * 18.0) * std::f32::consts::PI / 180.0;
            let x1 = 160.0 + 60.0 * angle.cos();
            let y1 = 160.0 + 60.0 * angle.sin();
            let x2 = 160.0 + 60.0 * (angle + std::f32::consts::PI).cos();
            let y2 = 160.0 + 60.0 * (angle + std::f32::consts::PI).sin();
            
            let color = if i % 2 == 0 { colors.0 } else { colors.1 };
            svg.push_str(&format!(
                r#"<circle cx="{}" cy="{}" r="3" fill="{}"/><circle cx="{}" cy="{}" r="3" fill="{}"/>"#,
                x1, y1, color, x2, y2, color
            ));
        }
        
        svg.push_str("</svg>");
        svg
    }

    fn create_svg_fractal(&self, hash_bytes: Vec<u8>, color_choice: u8) -> String {
        let (colors, _) = self.get_color_scheme(color_choice);
        let mut svg = format!(
            r#"<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="{}"/>
            <text x="8" y="12" font-family="monospace" font-size="8" fill="white">Fractal Art</text>"#,
            colors.2
        );
        
        // Create fractal-like branching pattern
        for i in 0..8 {
            let start_x = 160.0;
            let start_y = 300.0;
            let length = 80.0;
            let angle = (hash_bytes.get(i).unwrap_or(&0) as f32 / 255.0 * 180.0) - 90.0;
            
            let end_x = start_x + length * (angle * std::f32::consts::PI / 180.0).cos();
            let end_y = start_y + length * (angle * std::f32::consts::PI / 180.0).sin();
            
            let color = if i % 2 == 0 { colors.0 } else { colors.1 };
            svg.push_str(&format!(
                r#"<line x1="{}" y1="{}" x2="{}" y2="{}" stroke="{}" stroke-width="3"/>"#,
                start_x, start_y, end_x, end_y, color
            ));
        }
        
        svg.push_str("</svg>");
        svg
    }

    fn get_color_scheme(&self, choice: u8) -> ((String, String, String), String) {
        match choice {
            0 => (("#ff6b6b".to_string(), "#4ecdc4".to_string(), "#45b7d1".to_string()), "grad1".to_string()),
            1 => (("#a8e6cf".to_string(), "#dcedc1".to_string(), "#ffd3b6".to_string()), "grad2".to_string()),
            2 => (("#ff9a9e".to_string(), "#fecfef".to_string(), "#fecfef".to_string()), "grad3".to_string()),
            3 => (("#d299c2".to_string(), "#fef9d7".to_string(), "#a8e6cf".to_string()), "grad4".to_string()),
            _ => (("#ff6b6b".to_string(), "#4ecdc4".to_string(), "#45b7d1".to_string()), "grad5".to_string()),
        }
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
