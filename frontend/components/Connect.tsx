'use client';

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ 
  clientId: "81f0a0daeb6ca1e5bf6337d34882a318" 
});

export default function Connect() {
  return (
    <div className="[&_.connect-button]:!bg-white/10 [&_.connect-button]:!border-white/20 [&_.connect-button]:!text-white [&_.connect-button:hover]:!bg-white/20 [&_.connect-button]:!rounded-lg [&_.connect-button]:!px-4 [&_.connect-button]:!py-2 [&_.connect-button]:!font-cursive [&_.connect-button]:!font-medium [&_.connect-button]:!transition-all [&_.connect-button]:!duration-300 [&_.connect-button]:!backdrop-blur-sm">
      <ConnectButton client={client} />
    </div>
  );
}
