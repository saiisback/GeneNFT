'use client';

import { useWallet } from '../contexts/WalletContext';

export default function WalletConnection() {
  const { address, isConnected, ConnectWalletButton, disconnect } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Connected</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="text-sm font-mono text-gray-700">
              {truncateAddress(address!)}
            </span>
            <button
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy address"
            >
              📋
            </button>
          </div>
          <button
            onClick={disconnect}
            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
}
