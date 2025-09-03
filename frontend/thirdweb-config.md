# GeneNFT Configuration Guide

## Environment Variables Setup

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
# Thirdweb Client ID
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=81f0a0daeb6ca1e5bf6337d34882a318

# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

## Thirdweb Authentication Setup

The app now uses the official Thirdweb authentication system:

### Features
✅ **Official Thirdweb ConnectButton**: Uses the latest Thirdweb SDK
✅ **Sign in with Ethereum (SIWE)**: Secure web3-native authentication
✅ **Multiple Wallet Support**: Works with any thirdweb-compatible wallet
✅ **Proper Authentication Flow**: Login/logout state management

### Implementation Details

Based on the [Thirdweb documentation](https://portal.thirdweb.com/wallets/auth), the app implements:

1. **ThirdwebProvider**: Wraps the entire app for wallet context
2. **ConnectButton**: Official Thirdweb component for wallet connection
3. **Authentication Flow**: Custom auth handlers for login/logout
4. **Login Payload**: Proper SIWE message structure

### How to Use

1. **Connect Wallet**: Click the "Connect" button (Thirdweb's ConnectButton)
2. **Choose Wallet**: Select from available wallets (MetaMask, WalletConnect, etc.)
3. **Sign Message**: Approve the "Sign in to GeneNFT" message
4. **Authenticated**: You're now logged in and can use the app

### Backend Integration

The wallet address from the connected wallet can be used in:
- XML upload forms
- NFT ownership tracking
- Backend API calls

## Dependencies

- `thirdweb`: ^5.105.41 (latest version)
- `axios`: For API calls
- `next`: 15.5.2
- `react`: 19.1.0

## Backend Port
The backend runs on port 3001.

## Security Notes

- The Client ID is safe to expose in frontend code
- Authentication uses Sign in with Ethereum (SIWE) standard
- Wallet signatures are verified for security
