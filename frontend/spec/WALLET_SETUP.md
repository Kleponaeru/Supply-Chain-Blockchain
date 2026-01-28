# Wallet Configuration Guide

## Setup Instructions

To set up your supply chain dApp with wallet-to-role mapping, follow these steps:

### Step 1: Edit the Wallet Configuration

Open `src/config/walletConfig.ts` and add your wallet addresses mapped to roles:

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0x1234567890123456789012345678901234567890": 1, // Manufacturer
  "0x0987654321098765432109876543210987654321": 2, // Distributor
  "0x1111111111111111111111111111111111111111": 3, // Retailer
};
```

### Step 2: Get Your Wallet Address

1. Open MetaMask
2. Click on your account name/address at the top
3. Click "Copy to clipboard" - this is your wallet address

### Step 3: Determine Your Role

- **Manufacturer (Role 1)**: Creates products
- **Distributor (Role 2)**: Receives and distributes products
- **Retailer (Role 3)**: Tracks products

### Step 4: Add Your Address

In `walletConfig.ts`, add your address with the correct role (1, 2, or 3):

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0xYourAddressHere".toLowerCase(): 1,  // Your role here
};
```

**Note:** Addresses are case-insensitive, so we use `.toLowerCase()` for consistency.

### Step 5: Test the Connection

1. Start the app with `npm run dev`
2. Click "Connect Wallet" in the navbar
3. Your role should be automatically detected
4. If no role is assigned, you'll see "No Role Assigned" message

---

## How It Works

### 1. Wallet Connection Flow

```
User Clicks "Connect Wallet"
    ↓
MetaMask Opens
    ↓
User Selects Account & Confirms
    ↓
App Receives Address
    ↓
App Looks Up Role in WALLET_ROLES
    ↓
Dashboard Loads with Correct Role
```

### 2. Role Detection

The app automatically detects your role by:

1. Getting your wallet address after MetaMask connection
2. Looking it up in the `WALLET_ROLES` object
3. If found, setting that role
4. If not found, showing "No Role Assigned"

### 3. Navbar Features

The navbar always shows:

- **Connect Wallet** button (when not connected)
- **Connected address** (when connected)
- **Role badge** (when role is assigned)
- **Switch Wallet** button (to change accounts)
- **Logout** button (to disconnect)

---

## Example Configuration

Here's a complete example with multiple wallets:

```typescript
// src/config/walletConfig.ts

export const WALLET_ROLES: { [key: string]: number } = {
  // Manufacturers
  "0x742d35cc6634C0532925a3b844Bc0e7595f6bEb1".toLowerCase(): 1,
  "0x8ba1f109551bD432803012645Ac136ddd64DBA72".toLowerCase(): 1,

  // Distributors
  "0x1234567890123456789012345678901234567890".toLowerCase(): 2,
  "0xAbCdEf0123456789abCDEF0123456789abCDEF01".toLowerCase(): 2,

  // Retailers
  "0xFEDCBA9876543210fedcba9876543210fedcba98".toLowerCase(): 3,
  "0x9876543210987654321098765432109876543210".toLowerCase(): 3,
};
```

---

## Testing Different Roles

### To Test Multiple Roles

1. **Create Multiple MetaMask Accounts:**
   - Click profile icon in MetaMask
   - Click "+ Create Account"
   - Name it (e.g., "Manufacturer", "Distributor", "Retailer")

2. **Add Each to walletConfig.ts:**

   ```typescript
   "0xYourManufacturerAddress".toLowerCase(): 1,
   "0xYourDistributorAddress".toLowerCase(): 2,
   "0xYourRetailerAddress".toLowerCase(): 3,
   ```

3. **Switch Between Accounts in MetaMask:**
   - Click account name → Select account
   - App will auto-update role

---

## Troubleshooting

### Role Not Detected

**Problem:** Address connected but "No Role Assigned" shows

**Solutions:**

1. Check address is in `WALLET_ROLES`
2. Verify address format (should match exactly)
3. Ensure address is lowercase
4. Try refreshing the page

### Wrong Role Showing

**Problem:** Showing wrong role for wallet

**Solutions:**

1. Double-check the role number (1, 2, or 3)
2. Verify you added the correct address
3. Clear browser cache and refresh
4. Check for typos in address

### MetaMask Won't Connect

**Problem:** Connect button does nothing

**Solutions:**

1. Ensure MetaMask is installed
2. Check if MetaMask is unlocked
3. Try refreshing the page
4. Check browser console for errors

### Address Mismatch

**Problem:** Address in config doesn't match MetaMask

**Solutions:**

1. Copy address directly from MetaMask (click to copy)
2. Don't manually type the address
3. Ensure you're using the same MetaMask account
4. Check for leading/trailing spaces

---

## Production Setup

For production, you might want to:

1. **Load from Smart Contract:**

   ```typescript
   // Instead of hardcoded mapping
   const userRole = await contract.roles(userAddress);
   ```

2. **Use Environment Variables:**

   ```typescript
   const WALLET_ROLES = JSON.parse(process.env.VITE_WALLET_ROLES || "{}");
   ```

3. **Fetch from Database/API:**
   ```typescript
   const userRole = await fetch(`/api/roles/${userAddress}`);
   ```

---

## API Reference

### getRoleFromAddress(address)

Get role for a wallet address.

```typescript
import { getRoleFromAddress } from "../config/walletConfig";

const role = getRoleFromAddress("0x1234...");
// Returns: 1, 2, 3, or 0 (if not found)
```

### Role Numbers

- `0` - No role assigned
- `1` - Manufacturer
- `2` - Distributor
- `3` - Retailer

### WALLET_ROLES

The mapping object containing all wallet-to-role assignments.

```typescript
{
  "0xaddress1": 1,
  "0xaddress2": 2,
  "0xaddress3": 3,
}
```

---

## Next Steps

1. ✅ Add wallet addresses to `walletConfig.ts`
2. ✅ Start the app
3. ✅ Connect wallet
4. ✅ Access dashboard
5. ✅ Test role-specific features

---

**Questions?** Check the code comments in `src/config/walletConfig.ts` or the main `README.md`.
