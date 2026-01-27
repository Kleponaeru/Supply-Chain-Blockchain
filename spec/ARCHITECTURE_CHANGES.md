# Architecture Changes Summary

## Overview

Refactored the application to use **wallet-based role assignment** instead of manual role selection. The navbar now always shows and includes wallet connection/disconnect functionality.

---

## What Changed

### 1. **Removed Role Selection Screen**

- ❌ **Old:** Users selected role after connecting wallet
- ✅ **New:** Role is auto-detected based on wallet address

### 2. **Navbar Always Visible**

- ❌ **Old:** Navbar only showed after login
- ✅ **New:** Navbar visible on all pages (home and dashboards)

### 3. **Wallet Controls in Navbar**

- ❌ **Old:** Wallet connection on login page
- ✅ **New:** Connect/Switch/Logout buttons in navbar

---

## New Architecture

```
App Loads
    ↓
Check for existing MetaMask connection
    ↓
Initialize Navbar (always visible)
    ↓
User not connected?
    └→ Show Login page with info

User connected?
    ├→ Look up role in walletConfig
    ├→ Role found?
    │   └→ Show role-specific dashboard
    └→ No role?
        └→ Show "No Role Assigned" message
```

---

## File Structure

### New Files

```
src/config/
└── walletConfig.ts          # Wallet-to-role mapping
```

### Modified Files

```
src/App.tsx                  # Updated routing and navbar integration
src/pages/Login.tsx          # Simplified to just show info
src/components/Navbar.tsx    # Now handles wallet connect/switch/logout
```

---

## How to Use

### Step 1: Setup Wallet Configuration

Edit `src/config/walletConfig.ts`:

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0xYourManufacturerAddress".toLowerCase(): 1,
  "0xYourDistributorAddress".toLowerCase(): 2,
  "0xYourRetailerAddress".toLowerCase(): 3,
};
```

### Step 2: Get Wallet Address

1. Open MetaMask
2. Click account name
3. Click "Copy to clipboard"
4. Add to `walletConfig.ts`

### Step 3: Start App

```bash
npm run dev
```

### Step 4: Connect Wallet

1. Click "Connect Wallet" button in navbar
2. Select account in MetaMask
3. Role is auto-detected
4. Dashboard loads

---

## User Experience Flow

### Not Connected

```
Navbar: [🔗 Supply Chain] [Connect Wallet]
Body:   Login page with instructions
```

### Connected with Role

```
Navbar: [🔗 Supply Chain] [🏭 Manufacturer] [0x1234...5678▼]
Body:   Manufacturer dashboard
```

### Connected without Role

```
Navbar: [🔗 Supply Chain] [0x1234...5678▼]
Body:   "No Role Assigned" message
```

### Dropdown Menu

```
Connected Wallet
0x1234567890123456789012345678901234567890
🏭 Manufacturer

[📋 Copy Address]
[💱 Switch Wallet]
[🚪 Logout]
```

---

## Key Features

### ✅ Automatic Role Detection

- No manual selection needed
- Based on wallet address
- Instant dashboard access

### ✅ Persistent Navbar

- Always visible for quick access
- Shows current role
- One-click logout

### ✅ Easy Wallet Switching

- Switch between accounts
- Copy address to clipboard
- Automatic role re-detection

### ✅ No Role Handling

- Clear message if wallet not assigned
- Shows wallet address
- Instructions to contact admin

---

## Configuration Reference

### WALLET_ROLES Object

Maps wallet addresses to role numbers:

```typescript
{
  "0x...": 1,  // Manufacturer
  "0x...": 2,  // Distributor
  "0x...": 3,  // Retailer
}
```

**Address format:** lowercase with 0x prefix

### Role Numbers

- `1` = Manufacturer (🏭)
- `2` = Distributor (🚚)
- `3` = Retailer (🏪)
- `0` = No role (❓)

---

## Migration from Old System

If upgrading from role selection:

1. **Identify user roles** from your records
2. **Get their wallet addresses** from MetaMask
3. **Add to `walletConfig.ts`**
4. **Delete unused RoleSelector component** (optional)

---

## Testing Checklist

- [ ] Can connect wallet
- [ ] Role auto-detected correctly
- [ ] Dashboard loads for each role
- [ ] Can switch wallets
- [ ] Can logout
- [ ] Address displayed correctly
- [ ] Role badge shows emoji
- [ ] "No Role Assigned" shows for unknown wallet

---

## File Changes

### src/App.tsx

- Moved wallet connection logic to Navbar
- Added role auto-detection using `getRoleFromAddress()`
- Show Login page if not connected
- Show "No Role" message if no role assigned

### src/pages/Login.tsx

- Removed role selection UI
- Simplified to info-only page
- Instructions to use navbar button

### src/components/Navbar.tsx

- Added wallet connect button
- Added wallet switch functionality
- Added logout button
- Display role in navbar
- Dropdown menu in navbar

### src/config/walletConfig.ts (NEW)

- `WALLET_ROLES` - mapping object
- `getRoleFromAddress()` - lookup function
- `ROLE_NAMES` - display names
- `ROLE_EMOJIS` - role icons

---

## Customization

### Change Role Emojis

Edit `src/config/walletConfig.ts`:

```typescript
export const ROLE_EMOJIS: { [key: number]: string } = {
  1: "🏭", // Change this
  2: "🚚", // Or this
  3: "🏪", // Or this
};
```

### Change Role Names

Edit `src/config/walletConfig.ts`:

```typescript
export const ROLE_NAMES: { [key: number]: string } = {
  1: "Manufacturer", // Change this
  2: "Distributor",
  3: "Retailer",
};
```

### Load from Smart Contract

Instead of static config, query the contract:

```typescript
// In App.tsx or Navbar.tsx
const userRole = await contract.roles(userAddress);
setRole(userRole);
```

---

## Troubleshooting

**Q: Role not detected**
A: Check wallet address is in `WALLET_ROLES` and matches exactly

**Q: Connect button not working**
A: Ensure MetaMask is installed and unlocked

**Q: Wrong dashboard loaded**
A: Verify role number (1, 2, or 3) in config

**Q: "No Role Assigned" shows**
A: Add wallet address to `WALLET_ROLES` with correct role

---

## Next Steps

1. Edit `src/config/walletConfig.ts` with your addresses
2. Test each role with different wallets
3. Customize emojis/colors if needed
4. Deploy to production

See `WALLET_SETUP.md` for detailed setup instructions.
