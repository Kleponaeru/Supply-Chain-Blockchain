# 🎯 Quick Start Checklist

## Before You Start

- [ ] MetaMask installed in browser
- [ ] MetaMask unlocked
- [ ] You have a wallet address ready

## Setup (5 minutes)

### 1. Add Wallet Address

- [ ] Open `src/config/walletConfig.ts`
- [ ] Copy your MetaMask address
- [ ] Paste into config file:

```typescript
"0xYourAddressHere".toLowerCase(): 1,
```

- [ ] Replace `YourAddressHere` with actual address
- [ ] Save file (Ctrl+S)

### 2. Start App

- [ ] Open terminal in `frontend` folder
- [ ] Run: `npm run dev`
- [ ] App opens at http://localhost:5173

### 3. Test Connection

- [ ] Click "Connect Wallet" button (top-right)
- [ ] MetaMask popup opens
- [ ] Select your account
- [ ] Click "Connect"
- [ ] Wait 2 seconds

### 4. Verify It Works

- [ ] Your address shows in navbar
- [ ] Your role emoji shows (🏭, 🚚, or 🏪)
- [ ] Dashboard loads for your role
- [ ] No red errors in console

## If Something Doesn't Work

### MetaMask Won't Open

- [ ] MetaMask is unlocked
- [ ] MetaMask is not in popup mode
- [ ] Browser is connected to correct network
- [ ] Try hard refresh: `Ctrl+Shift+R`

### Role Not Detected

- [ ] Open browser console: `F12`
- [ ] Look for "🔍 Looking up role"
- [ ] Check address in console matches config
- [ ] Verify address is lowercase
- [ ] Verify address has 0x prefix
- [ ] Verify address is 42 characters long (0x + 40 hex)
- [ ] No extra spaces around address

### App Won't Start

- [ ] Reinstall dependencies:

```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

## Console Debugging

### Open Console

- Windows: Press `F12`
- Mac: Press `Cmd+Option+J`
- Right-click → Inspect → Console tab

### Look For These Logs

```
🚀 Initializing app...
📍 Found existing wallet connection:
🔍 Looking up role for address:
✅ Detected role: 1
```

### What Each Log Means

- 🚀 App is starting
- 📍 Wallet connected successfully
- 🔍 Looking up your role
- ✅ Role found (1, 2, or 3)
- ❓ Role not found (shows 0)

---

## File Locations

```
frontend/
├── src/
│   └── config/
│       └── walletConfig.ts          ← ADD ADDRESS HERE
```

---

## Role Numbers

| Number | Role            | Dashboard         |
| ------ | --------------- | ----------------- |
| 1      | Manufacturer 🏭 | Create products   |
| 2      | Distributor 🚚  | Transfer products |
| 3      | Retailer 🏪     | Track products    |

---

## Common Commands

### Start App

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

### Clear & Reinstall

```bash
cd frontend
rm -r node_modules package-lock.json
npm install
```

---

## What Should Happen

1. ✅ Click "Connect Wallet"
2. ✅ MetaMask opens
3. ✅ Select account
4. ✅ Click "Connect"
5. ✅ App shows your dashboard
6. ✅ Your role displays in navbar

---

## Example Config

```typescript
// src/config/walletConfig.ts

export const WALLET_ROLES: { [key: string]: number } = {
  "0x742d35cc6634c0532925a3b844bc0e7595f6beb1".toLowerCase(): 1,
};
```

**How to format:**

- Get address from MetaMask
- Wrap in quotes
- Add `.toLowerCase()`
- Colon after address
- Role number (1, 2, or 3)
- Comma after

---

## Troubleshooting Flowchart

```
Click "Connect Wallet"
        ↓
   MetaMask opens?
        ├─ NO  → Unlock MetaMask
        └─ YES ↓
        Select account + connect
                ↓
        Role shows in navbar?
        ├─ NO  → Open console (F12)
        │        → Look for 🔍 log
        │        → Check address format
        │        → Verify in walletConfig.ts
        └─ YES ✅ SUCCESS!
```

---

## Need Help?

### Can't Find Address

1. Click MetaMask icon
2. Click account name (shows full address)
3. Click address to copy
4. Paste into walletConfig.ts

### Address Format Wrong

Check that it has:

- ✅ 0x prefix
- ✅ 40 hex characters
- ✅ Lowercase
- ✅ No spaces
- ✅ Quotes around it

### Console Shows Wrong Role

1. Copy address from console
2. Paste into walletConfig.ts
3. Make sure it matches exactly
4. Save and refresh

### Still Not Working?

1. Read `SETUP_DEBUGGING.md` in root folder
2. Check browser console for errors
3. Try hard refresh: `Ctrl+Shift+R`
4. Reinstall: `rm -r node_modules && npm install`

---

## ✅ Success Indicators

✅ "Connect Wallet" button appears  
✅ MetaMask opens on click  
✅ Can select account and confirm  
✅ Address shows in navbar  
✅ Role emoji shows (🏭, 🚚, or 🏪)  
✅ Correct dashboard loads  
✅ Console shows ✅ Detected role  
✅ No red errors in console

---

## 🎉 You're Done!

When you see your dashboard, you're ready to go!

- 🏭 Manufacturer: Create products
- 🚚 Distributor: Transfer products
- 🏪 Retailer: Track products

---

**Questions?** Check the browser console first with `F12` 🔍
