# Quick Visual Reference

## Wallet Address Format

### ✅ CORRECT Format

```typescript
"0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1
```

**What makes it correct:**

- Starts with `0x` prefix
- Followed by 40 hexadecimal characters
- Lowercase (due to `.toLowerCase()`)
- Quotes around the address
- Colon after address
- Role number after colon (1, 2, or 3)

### ❌ WRONG Formats

```typescript
// ❌ Missing 0x
"742d35cc6634c0532925a3b844bc0e7595f6beb1": 1

// ❌ Not lowercase (will still work due to .toLowerCase(), but inconsistent)
"0x742D35Cc6634C0532925a3b844Bc0e7595f6bEb1": 1

// ❌ Has spaces
"  0x742d35cc6634c0532925a3b844bc0e7595f6beb1  ": 1

// ❌ Too short
"0x742d35cc": 1

// ❌ Invalid characters
"0x742d35cc6634c0532925a3b844bc0e7595f6zzzz": 1
```

---

## Where to Find Your Address

### In MetaMask:

1. Click MetaMask icon (top-right of browser)
2. Your address shows under the account name
3. Click the address to copy it
4. Paste into `walletConfig.ts`

### Example:

```
┌─────────────────────────┐
│  MetaMask Extension     │
├─────────────────────────┤
│  Account 1              │
│  0x742d35cc...f6beb1    │ ← Click to copy
│  15 ETH                 │
└─────────────────────────┘
```

---

## Configuration Example

### Single Wallet (One Role)

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,
};
```

### Multiple Wallets (Testing)

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,  // Manufacturer
  "0x8ba1f109551bd432803012645ac136ddd64dba72".toLowerCase(): 2,  // Distributor
  "0x1234567890123456789012345678901234567890".toLowerCase(): 3,  // Retailer
};
```

---

## Console Output Guide

### When Connected Successfully:

```
🚀 Initializing app... 0x742d35cc6634c0532925a3b844bc0e7595f6beb1
📍 Found existing wallet connection: 0x742d35cc6634c0532925a3b844bc0e7595f6beb1
🔍 Looking up role for address: 0x742d35cc6634c0532925a3b844bc0e7595f6beb1
Configured roles: ["0x742d35cc6634c0532925a3b844bc0e7595f6beb1"]
✅ Detected role: 1
```

**What it means:**

- 🚀 App starting up
- 📍 Found saved MetaMask connection
- 🔍 Looking up role for your address
- Configured roles list shows addresses in `walletConfig.ts`
- ✅ Your role was found: 1 = Manufacturer

### When Not Connected:

```
🚀 Initializing app... undefined
📭 No wallet currently connected
```

**What it means:**

- No wallet was previously connected
- User needs to click "Connect Wallet" button

### When Role Not Found:

```
🚀 Initializing app... 0xAAA...
📍 Found existing wallet connection: 0xAAA...
🔍 Looking up role for address: 0xaaa... (lowercase)
Configured roles: ["0xbbb...", "0xccc..."]
✅ Detected role: 0
```

**What it means:**

- App found wallet `0xAAA...`
- But your address `0xaaa...` (in lowercase) isn't in the configured roles
- You need to add it to `walletConfig.ts`

---

## Role Reference

### Role 1: Manufacturer 🏭

- Create new products
- Transfer to distributors
- Dashboard: Product creation form, list

### Role 2: Distributor 🚚

- Receive products from manufacturers
- Redistribute to retailers
- Dashboard: Received products, transfer options

### Role 3: Retailer 🏪

- Receive products from distributors
- Track and verify authenticity
- Dashboard: Product search, timeline view

### Role 0: None ❓

- No access to dashboards
- Shows "Role Not Assigned" message
- Need to add to `walletConfig.ts`

---

## File Locations

```
frontend/
├── src/
│   ├── App.tsx                          ← Main app logic
│   ├── components/
│   │   └── Navbar.tsx                   ← Wallet controls
│   ├── config/
│   │   └── walletConfig.ts              ← ⭐ ADD YOUR ADDRESS HERE
│   ├── pages/
│   │   ├── Login.tsx                    ← Landing page
│   │   ├── Manufacturer.tsx             ← Role 1 dashboard
│   │   ├── Distributor.tsx              ← Role 2 dashboard
│   │   └── Retailer.tsx                 ← Role 3 dashboard
│   └── utils/
│       └── blockchain.ts                ← Wallet connection logic
├── SETUP_DEBUGGING.md                   ← Debugging guide
└── UI_UX_IMPROVEMENTS.md                ← This file
```

---

## Quick Commands

### Start Development Server

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

### Open Browser Console

- Windows: `F12`
- Mac: `CMD + Option + J`
- Firefox: `F12` then Console tab
- Chrome: `F12` then Console tab

### Copy Address from MetaMask

1. Click MetaMask icon
2. Click your address
3. Automatically copied!

### Clear Browser Cache

- Windows: `CTRL + SHIFT + Delete`
- Mac: `CMD + Shift + Delete`
- Select "All time" → Clear

---

## Troubleshooting Flowchart

```
App starts
    ↓
See "Connect Wallet" button?
    ├─ YES → Click it
    │    ↓
    │ MetaMask opens?
    │    ├─ YES → Select account → Confirm
    │    │        ↓
    │    │ Role shows in navbar?
    │    │    ├─ YES ✅ SUCCESS
    │    │    └─ NO → Check browser console (F12)
    │    │            See role detection logs?
    │    │            ├─ NO → Check walletConfig.ts
    │    │            └─ YES → Address in config?
    │    │                    ├─ NO → Add it
    │    │                    └─ YES → Check format (lowercase, 0x, length)
    │    │
    │    └─ NO → MetaMask locked?
    │             ├─ YES → Unlock it
    │             └─ NO → Refresh page (F5)
    │
    └─ NO → Page didn't load correctly
             ├─ Check console for errors
             └─ Try hard refresh (CTRL+SHIFT+R)
```

---

## Visual Indicators

### Connected Successfully

```
[0x742d...b1] 🏭 Manufacturer ▼
```

- Address shown in navbar
- Role emoji shows
- Dropdown arrow visible

### Not Connected

```
[🦊 Connect Wallet]
```

- MetaMask icon
- "Connect Wallet" text
- Orange button

### Loading

```
🔗 Initializing Supply Chain...
```

- Spinning emoji
- Loading text

### No Role

```
❓ Role Not Assigned
Your wallet doesn't have a role assigned...
```

- Question mark emoji
- White card with message
- Instructions to add to config

---

## Common Address Mistakes

### Case Sensitivity

```typescript
// This address:
0x742D35Cc6634C0532925a3b844Bc0e7595f6bEb1

// Gets converted to:
0x742d35cc6634c0532925a3b844bc0e7595f6beb1 (lowercase)

// So in config, use:
"0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1
```

### 0x Prefix

```typescript
// MetaMask gives you:
0x742d35cc6634c0532925a3b844bc0e7595f6beb1

// Must include 0x in config:
"0x742d35cc6634c0532925a3b844bc0e7595f6beb1": 1
```

### Trailing Spaces

```typescript
// ❌ WRONG - has spaces
"  0x742d35cc6634c0532925a3b844bc0e7595f6beb1  ": 1

// ✅ RIGHT - no spaces
"0x742d35cc6634c0532925a3b844bc0e7595f6beb1": 1
```

---

## Browser DevTools Guide

### How to Open

- Windows: `F12` or `CTRL+Shift+I`
- Mac: `CMD+Option+I`
- Right-click → Inspect

### Console Tab

1. Click "Console" tab
2. Look for logs starting with 🔍
3. See what address is being looked up
4. See what configured roles are available
5. See what role was detected

### Network Tab

- Shows API calls
- Check if things load correctly
- Can see errors

### Application Tab

- View cookies and storage
- Useful for debugging state

---

## MetaMask Tips

### Add Test Account

1. Click account icon (circle)
2. Click "Create Account"
3. Give it a name (e.g., "Manufacturer")
4. It creates a new test account
5. Copy address to walletConfig.ts

### Switch Accounts

1. Click account icon
2. Click the account name
3. Automatically switches
4. App updates role

### Get Test ETH

- Go to faucet site (depends on network)
- Paste your address
- Get free test ETH
- Check MetaMask after a few seconds

### Wrong Network?

- Click network name in MetaMask
- Select correct network (Hardhat local, Sepolia, etc.)
- App should work again

---

**Need help?** Check browser console with F12 - it will show you exactly what's happening! 🔍
