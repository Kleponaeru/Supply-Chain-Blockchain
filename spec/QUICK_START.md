# 🚀 Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- MetaMask browser extension
- Hardhat local node running (or testnet RPC)

---

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

**What gets installed:**

- React 18 - UI framework
- React Router - Navigation
- Ethers.js - Blockchain interaction
- TailwindCSS - Styling

---

## Step 2: Start Hardhat Node

```bash
cd .. # Go to project root
npx hardhat node
```

Keep this terminal open. This creates a local Ethereum network.

---

## Step 3: Deploy Smart Contract

In a new terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**

```
SupplyChain deployed to: 0x5FbDB2315678afccb333f8a9c36b1d19D82E90cE
```

Copy this address!

---

## Step 4: Update Contract Address

Open `frontend/src/utils/blockchain.ts` and update:

```typescript
const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c36b1d19D82E90cE"; // Your address
```

---

## Step 5: Assign Roles (Optional)

```bash
npx hardhat run scripts/interact.js --network localhost
```

This script assigns roles to test addresses.

---

## Step 6: Start Frontend

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## Step 7: Setup MetaMask

1. Click MetaMask icon in browser
2. Click your profile → Settings
3. Go to Networks → Add Network
4. Enter:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
5. Click Save
6. Switch to "Hardhat Local" network

---

## Step 8: Import Test Account

1. In Hardhat terminal, copy the first account's private key
2. In MetaMask: Click profile → Import Account
3. Paste the private key
4. You now have ETH for testing!

---

## Step 9: Test the App

### As Manufacturer:

1. Click "🦊 Connect MetaMask"
2. Select "🏭 Manufacturer"
3. Click "📦 Create New Product"
4. Fill in Product Name & Batch ID
5. Click "Create Product"
6. ✅ Success!

### As Distributor:

1. Create new MetaMask account (or use different account)
2. Assign Distributor role in hardhat script
3. Select "🚚 Distributor" role
4. View received products
5. Transfer to retailers

### As Retailer:

1. Create another MetaMask account
2. Select "🏪 Retailer" role
3. Enter product ID
4. 🔍 Search
5. View complete supply chain journey!

---

## 🎨 UI Overview

### Login Page

```
┌─────────────────────────────────┐
│  🔗 Supply Chain Blockchain     │
│                                 │
│  [🦊 Connect MetaMask]          │
│                                 │
│  ┌────┬────┬────┐              │
│  │ 🏭 │ 🚚 │ 🏪 │  [After connect] │
│  └────┴────┴────┘              │
└─────────────────────────────────┘
```

### Dashboard Pages

```
┌─────────────────────────────────┐
│ 🔗 Supply Chain [User] [Logout] │
├─────────────────────────────────┤
│                                 │
│  Role: 🏭 Manufacturer          │
│                                 │
│  [Action Button 1] [Action 2]   │
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Card 1│ │Card 2│ │Card 3│    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Product Lifecycle

```
Manufacturer Creates Product
           ↓
    📦 Created
           ↓
Distributor Receives & Transfers
           ↓
    🚚 In Transit
           ↓
Retailer Receives
           ↓
    ✅ Delivered
```

---

## 📋 Testing Checklist

- [ ] MetaMask connects successfully
- [ ] Can select different roles
- [ ] Manufacturer can create products
- [ ] Products display in list
- [ ] Can transfer products
- [ ] Can view product details
- [ ] Timeline shows correctly
- [ ] All buttons work
- [ ] Modals open/close
- [ ] Error messages appear
- [ ] Success notifications work

---

## 🚨 Troubleshooting

### "MetaMask is not installed!"

- Install MetaMask extension
- Refresh the page

### "Contract address not found"

- Update CONTRACT_ADDRESS in blockchain.ts
- Make sure Hardhat node is running
- Redeploy contract

### Network Errors

- Check Hardhat node is running
- Verify MetaMask is on localhost:8545
- Check console for error details

### Transactions Fail

- Ensure wallet has ETH
- Verify you have correct role
- Check gas is sufficient
- Look at contract error message

### Styling Issues

- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Restart `npm run dev`

---

## 📞 Quick Commands

```bash
# Terminal 1: Start Hardhat Node
npx hardhat node

# Terminal 2: Deploy Contract
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start Frontend
cd frontend
npm run dev

# Build for production
npm run build
```

---

## 🎯 Next Steps

1. ✅ Frontend is running
2. ✅ Can create products
3. ✅ Can transfer products
4. Next: Add more features!

---

## 📚 File Locations

```
supplychain-blockchain/
├── contracts/           ← Smart contracts
├── scripts/            ← Deploy & interact scripts
├── frontend/           ← React app (THIS FOLDER)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
└── hardhat.config.js   ← Hardhat settings
```

---

## 💡 Tips & Tricks

- **Copy Address**: Hover over address in navbar, click to copy
- **Switch Roles**: Click "Switch Wallet" button to change accounts
- **View History**: Click info icon (ℹ️) on product card
- **Timeline**: Scroll through timeline to see all transactions
- **Status Colors**: Blue = Created, Yellow = Transit, Green = Delivered

---

## 📱 Mobile Testing

```bash
# Get your machine IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Access from phone on same network
http://<YOUR_IP>:5173
```

---

## 🎓 Learning Resources

- **React**: https://react.dev/learn
- **TailwindCSS**: https://tailwindcss.com/docs
- **Ethers.js**: https://docs.ethers.org
- **Solidity**: https://docs.soliditylang.org
- **MetaMask**: https://docs.metamask.io

---

## ✅ All Set!

You now have a fully functional supply chain blockchain dApp! 🎉

**Happy coding!**

Questions? Check FRONTEND_IMPROVEMENTS.md for detailed documentation.
