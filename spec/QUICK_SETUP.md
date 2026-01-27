# Quick Reference - New Architecture

## In 30 Seconds

1. **Add wallet addresses** to `src/config/walletConfig.ts`
2. **Click "Connect Wallet"** in navbar (not login page!)
3. **Role auto-detects** based on address
4. **Dashboard loads** automatically

---

## Setup (Copy & Paste)

### Step 1: Edit src/config/walletConfig.ts

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0xYourAddress1".toLowerCase(): 1,  // Your manufacturer wallet
  "0xYourAddress2".toLowerCase(): 2,  // Your distributor wallet
  "0xYourAddress3".toLowerCase(): 3,  // Your retailer wallet
};
```

### Step 2: Get Address from MetaMask

- Click MetaMask icon
- Click your account name
- Click "Copy to clipboard"
- Paste into config above

### Step 3: Run App

```bash
npm run dev
```

### Step 4: Connect!

- Click "Connect Wallet" in top-right
- Select your account
- Done! 🎉

---

## Role Numbers

| Role | Number | Emoji | Duties |
|------|--------|-------|--------|
| Manufacturer | 1 | 🏭 | Create products |
| Distributor | 2 | 🚚 | Transfer products |
| Retailer | 3 | 🏪 | Track products |
| None | 0 | ❓ | Not assigned |

---

## Navbar Features

```
BEFORE                           AFTER
─────────────────────────────────────────
Login Page         →    Navbar Always
│                        ↓
Connect Wallet     →    [Connect Wallet] in Navbar
│                        ↓
Select Role        →    Auto-detect Role
│                        ↓
Disconnect from    →    [Switch/Logout] in Navbar
 Role Selection
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/config/walletConfig.ts` | Wallet→Role mapping |
| `src/App.tsx` | Main app logic |
| `src/pages/Login.tsx` | Info page |
| `src/components/Navbar.tsx` | Wallet controls |

---

## Common Tasks

### Add New Wallet

```typescript
// In src/config/walletConfig.ts
export const WALLET_ROLES: { [key: string]: number } = {
  "0xNewAddressHere".toLowerCase(): 1,  // Add this line
  // ... existing addresses
};
```

### Change Role Emoji

```typescript
// In src/config/walletConfig.ts
export const ROLE_EMOJIS: { [key: number]: string } = {
  1: "🏭",  // Change emoji here
  2: "🚚",
  3: "🏪",
};
```

### Switch Accounts

1. Click account dropdown in navbar
2. Click "Switch Wallet"
3. Select different MetaMask account
4. Role auto-updates

### Logout

1. Click account dropdown in navbar
2. Click "Logout"
3. Back to login page

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Role not detected | Check address in config matches MetaMask exactly |
| Connect not working | Unlock MetaMask, refresh page |
| Wrong dashboard | Verify role number (1, 2, or 3) |
| "No Role Assigned" | Add wallet to `WALLET_ROLES` |

---

## Address Format

✅ **CORRECT**
```typescript
"0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1
"0xabcdef0123456789abcdef0123456789abcdef01": 1
```

❌ **INCORRECT**
```typescript
"742d35cc6634c0532925a3b844bc0e7595f6beb1": 1     // Missing 0x
"0x742D35Cc6634C0532925a3b844Bc0e7595f6bEb1": 1  // Not lowercase
"  0x742d35cc...  ": 1                              // Extra spaces
```

---

## Example Complete Config

```typescript
// src/config/walletConfig.ts

export const WALLET_ROLES: { [key: string]: number } = {
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,
  "0x8ba1f109551bd432803012645ac136ddd64dba72".toLowerCase(): 2,
  "0x1234567890123456789012345678901234567890".toLowerCase(): 3,
};

export const ROLE_NAMES: { [key: number]: string } = {
  0: "None",
  1: "Manufacturer",
  2: "Distributor",
  3: "Retailer",
};

export const ROLE_EMOJIS: { [key: number]: string } = {
  0: "❓",
  1: "🏭",
  2: "🚚",
  3: "🏪",
};

export function getRoleFromAddress(address: string): number {
  const normalizedAddress = address.toLowerCase();
  return WALLET_ROLES[normalizedAddress] || 0;
}
```

---

## What's Different Now

| Old | New |
|-----|-----|
| Role selection screen | Navbar button |
| Manual role picking | Auto role detection |
| Logout only from dashboard | Logout from navbar |
| Switch role = restart | Switch wallet = auto role |
| Navbar after login | Navbar always visible |

---

## Testing Locally

### Create Multiple Accounts

1. MetaMask → Click account name
2. Click "+ Create Account"
3. Name it (Manufacturer, Distributor, etc.)
4. Add each address to config with role 1, 2, 3

### Test Each Role

1. Switch to account in MetaMask
2. App auto-updates
3. Dashboard changes
4. Test role-specific features

---

## Demo Flow

```
User Opens App
    ↓
[Connect Wallet Button visible in navbar]
    ↓
User clicks button
    ↓
MetaMask opens
    ↓
User selects account + confirms
    ↓
App looks up address in config
    ↓
Role 1, 2, or 3 detected
    ↓
Correct dashboard loads
    ↓
User sees navbar with role + address
```

---

## Keyboard Shortcuts

- `CMD/CTRL + A` in address field - Select all
- `CMD/CTRL + C` on copy button - Copy address
- `ESC` - Close dropdown menu

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Requires MetaMask extension

---

## Getting Help

1. Check `WALLET_SETUP.md` for detailed guide
2. Check `ARCHITECTURE_CHANGES.md` for full changes
3. Review `FRONTEND_IMPROVEMENTS.md` for features
4. Check browser console for errors (F12)

---

**Ready to go!** 🚀
Edit the config, start the app, connect your wallet!
