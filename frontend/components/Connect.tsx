'use client';

import { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ 
  clientId: "81f0a0daeb6ca1e5bf6337d34882a318" 
});

export default function Connect() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="flex items-center space-x-3">
      <ConnectButton
        client={client}
        auth={{
          getLoginPayload: async (params) => {
            setIsConnecting(true);
            const address = params.address;
            // fetch the login payload here using address from your server
            return {
              domain: window.location.host,
              address: address,
              statement: "Sign in to GeneNFT",
              uri: window.location.origin,
              version: "1",
              chainId: params.chainId,
              nonce: Math.random().toString(36).substring(2, 15),
              issued_at: new Date().toISOString(),
              expiration_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              invalid_before: new Date().toISOString(),
            };
          },
          doLogin: async (params) => {
            // send the signed login payload (params) to your server to verify the signature
            console.log('Login params:', params);
            // Extract and store the connected address from the login payload
            if (params.payload && params.payload.address) {
              setConnectedAddress(params.payload.address);
            }
            setIsConnecting(false);
          },
          isLoggedIn: async (address: string) => {
            // fetch the user's login status from your server
            return connectedAddress === address;
          },
          doLogout: async () => {
            // send a logout request to your server
            console.log('Logout requested');
            setConnectedAddress(null);
            setIsConnecting(false);
          },
        }}
      />
      
      {/* Show connected wallet address */}
      {connectedAddress && (
        <div className="flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 px-4 py-3 rounded-xl backdrop-blur-sm">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-white font-cursive">Connected</span>
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-sm font-mono text-white font-medium">
              {truncateAddress(connectedAddress)}
            </span>
            <button
              onClick={() => copyToClipboard(connectedAddress)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              title="Copy address"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isConnecting && (
        <div className="flex items-center space-x-2 bg-white/5 border border-white/20 px-3 py-2 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60"></div>
          <span className="text-sm text-white/60 font-cursive">Connecting...</span>
        </div>
      )}
    </div>
  );
}
