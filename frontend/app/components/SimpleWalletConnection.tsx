'use client';

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ 
  clientId: "81f0a0daeb6ca1e5bf6337d34882a318" 
});

export default function Connect() {
  return (
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
        },
        isLoggedIn: async (address: string) => {
          // fetch the user's login status from your server
          return false; // For now, always return false
        },
        doLogout: async () => {
          // send a logout request to your server
          console.log('Logout requested');
        },
      }}
    />
  );
}
