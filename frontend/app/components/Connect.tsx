'use client';

import { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ 
  clientId: "81f0a0daeb6ca1e5bf6337d34882a318" 
});

export default function Connect() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center space-x-3">
      <ConnectButton
        client={client}
        auth={{
          getLoginPayload: async (params) => {
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
            // We'll get the address from the getLoginPayload response
            if (params.payload && params.payload.address) {
              setConnectedAddress(params.payload.address);
            }
          },
          isLoggedIn: async (address: string) => {
            // fetch the user's login status from your server
            return connectedAddress === address;
          },
          doLogout: async () => {
            // send a logout request to your server
            console.log('Logout requested');
            setConnectedAddress(null);
          },
        }}
      />
      
      {/* Show connected wallet address */}
      {connectedAddress && (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Connected</span>
          <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded border">
            <span className="text-xs font-mono text-gray-700">
              {truncateAddress(connectedAddress)}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(connectedAddress);
                // You could add a toast notification here
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy address"
            >
              📋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
