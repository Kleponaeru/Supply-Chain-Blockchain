# Setup & Debugging Guide

## Quick Setup (2 minutes)

### Step 1: Add Your Wallet Address

Edit `src/config/walletConfig.ts`:

```typescript
export const WALLET_ROLES: { [key: string]: number } = {
  "0xYourAddressHere".toLowerCase(): 1,  // Replace with your address
};
```

**To get your address from MetaMask:**
1. Click MetaMask icon (top-right browser)
2. Click your account name
3. Click "Copy to clipboard"
4. Paste it in the config file

### Step 2: Start the App

```bash
cd frontend
npm run dev
```

### Step 3: Connect Wallet

1. Click "Connect Wallet" button (top-right navbar)
2. Select your account in MetaMask popup
3. Click "Connect"
4. Your role should auto-detect!

---

## Debugging: Role Not Detected

### Problem: "No Role Assigned" message

**Check 1: Open Browser Console**
- Press `F12` → Click "Console" tab
- Look for logs starting with 🔍

**Expected Output:**
```
🔍 Looking up role for address: 0xabc123...
Configured roles: ["0xabc123..."]
✅ Detected role: 1
```

**Check 2: Verify Address Format**

In `walletConfig.ts`, make sure:
```typescript
// ✅ CORRECT
export const WALLET_ROLES: { [key: string]: number } = {
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,
};

// ❌ WRONG - Missing 0x
"742d35cc6634c0532925a3b844bc0e7595f6beb1": 1

// ❌ WRONG - Not lowercase
"0x742D35Cc6634C0532925a3b844Bc0e7595f6bEb1": 1

// ❌ WRONG - Has spaces
"  0x742d35cc6634c0532925a3b844bc0e7595f6beb1  ": 1
```

**Check 3: Clear Browser Cache**
1. Press `CTRL+SHIFT+R` (Windows) or `CMD+SHIFT+R` (Mac)
2. This forces reload of all files

**Check 4: Verify MetaMask Connected Correctly**
1. Click navbar wallet button
2. Check the dropdown shows your full address
3. Copy it and paste in config
4. Refresh page

---

## Debugging: MetaMask Won't Open on Reconnect

### Problem: Click "Connect Wallet" → Nothing happens

**Solution: This should be fixed!**

The wallet reconnection issue was caused by reusing the same provider. Now it:
1. Creates a fresh provider each time
2. Always calls `eth_requestAccounts` (shows MetaMask dialog)
3. Handles errors properly

If still not working:

**Check 1: MetaMask is Unlocked**
- Click MetaMask icon
- If locked, unlock it with your password
- Try connecting again

**Check 2: MetaMask is not in Popup**
- Make sure you don't have MetaMask in popup mode
- Use the extension icon, not the popup window

**Check 3: Browser Console for Errors**
- Press `F12` → Console tab
- Look for red errors
- Screenshot and check what it says

---

## Role Numbers Reference

| Number | Role | Emoji | Duties |
|--------|------|-------|--------|
| 0 | None | ❓ | No access (not assigned) |
| 1 | Manufacturer | 🏭 | Create products |
| 2 | Distributor | 🚚 | Receive & redistribute |
| 3 | Retailer | 🏪 | Track & verify |

---

## Testing with Multiple Wallets

To test all roles:

1. **Create test accounts in MetaMask:**
   - Click account name in MetaMask
   - Click "+ Create Account"
   - Name it (e.g., "Manufacturer")
   - Repeat 3 times

2. **Add all addresses to config:**
   ```typescript
   export const WALLET_ROLES: { [key: string]: number } = {
     "0xaddress1".toLowerCase(): 1,  // Manufacturer
     "0xaddress2".toLowerCase(): 2,  // Distributor
     "0xaddress3".toLowerCase(): 3,  // Retailer
   };
   ```

3. **Test switching:**
   - Click navbar wallet button
   - Click "Switch Wallet"
   - Select different account
   - App auto-updates role!

---

## Browser Console Logging

When you connect a wallet, you should see:

```
🚀 Initializing app... <address>
📍 Found existing wallet connection: 0x742d...
🔍 Looking up role for address: 0x742d...
Configured roles: ["0x742d..."]
✅ Detected role: 1
```

When you click "Switch Wallet":
```
🔄 Address changed: 0x8ba1...
👤 New role detected: 2
```

When you logout:
```
🚪 Logging out...
```

---

## Common Issues & Solutions

### Issue: Address shows lowercase in dropdown but config has mixed case

**Solution:** Don't worry! The `.toLowerCase()` in walletConfig.ts handles this automatically.

### Issue: Different address in wallet shows different role

**Solution:** You have multiple accounts in MetaMask. Either:
1. Switch to the right account in MetaMask
2. Add that address to config with role 0 to block it

### Issue: Changing roles but dashboard doesn't update

**Solution:**
1. Try refreshing page (`F5`)
2. Check browser console for errors (`F12`)
3. Verify address is in walletConfig.ts

### Issue: "No Role Assigned" but wallet is in config

**Solution:**
1. Copy the exact address shown in the dropdown
2. Open `walletConfig.ts`
3. Make sure it matches exactly (including 0x prefix, all lowercase)
4. Save file and refresh browser

---

## Example Complete Config

```typescript
// src/config/walletConfig.ts

export const WALLET_ROLES: { [key: string]: number } = {
  // Test with these addresses
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,
  "0x8ba1f109551bd432803012645ac136ddd64dba72".toLowerCase(): 2,
  "0x1111111111111111111111111111111111111111".toLowerCase(): 3,
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
  if (!address) {
    console.warn("getRoleFromAddress: address is empty");
    return 0;
  }

  const normalizedAddress = address.toLowerCase();
  console.log(
    "🔍 Looking up role for address:",
    normalizedAddress,
    "Configured roles:",
    Object.keys(WALLET_ROLES).map((a) => a.toLowerCase())
  );

  const role = WALLET_ROLES[normalizedAddress] || 0;
  console.log("✅ Detected role:", role);
  return role;
}
```

---

## Testing Checklist

- [ ] MetaMask installed and unlocked
- [ ] Wallet address added to `walletConfig.ts` (with `0x` prefix, lowercase)
- [ ] App running with `npm run dev`
- [ ] Click "Connect Wallet" button
- [ ] MetaMask popup appears
- [ ] After connecting, role displays in navbar
- [ ] Console shows correct role detection
- [ ] Correct dashboard loads (Manufacturer/Distributor/Retailer)

---

## If All Else Fails

1. **Delete node_modules and reinstall:**
   ```bash
   cd frontend
   rm -r node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Clear browser cache completely:**
   - Press `CTRL+SHIFT+DELETE` (Windows) or `CMD+SHIFT+DELETE` (Mac)
   - Select "All time"
   - Check only "Cookies and other site data"
   - Clear

3. **Hard refresh:**
   - Press `CTRL+SHIFT+R` (Windows) or `CMD+SHIFT+R` (Mac)

4. **Check console for actual errors:**
   - Press `F12` → Console
   - Screenshot any red errors
   - These will help fix the issue

---

**Questions?** Check the browser console first! It shows exactly what's happening. 🔍
