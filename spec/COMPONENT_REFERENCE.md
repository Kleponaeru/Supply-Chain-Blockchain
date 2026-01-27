# 🎨 UI/UX Component Reference

## Component Library Overview

### 1. StatusBadge Component

Used throughout the app to show product status.

```tsx
<StatusBadge status={0} size="md" />
// Output: 📦 Created (blue)

<StatusBadge status={1} size="md" />
// Output: 🚚 In Transit (yellow)

<StatusBadge status={2} size="md" />
// Output: ✅ Delivered (green)
```

**Sizes:**

- `sm` - Small badge (12px)
- `md` - Medium badge (14px) ← Most common
- `lg` - Large badge (16px)

**Usage:**

```tsx
import StatusBadge from "../components/StatusBadge";

<StatusBadge status={product.status} size="md" />;
```

---

### 2. LoadingSpinner Component

Shows while data is being fetched.

```tsx
<LoadingSpinner text="Loading products..." />
```

**Features:**

- Animated spinner
- Custom text below
- Centered layout
- Gray color

**Usage:**

```tsx
import LoadingSpinner from "../components/LoadingSpinner";

{
  loading ? <LoadingSpinner text="Processing..." /> : <ProductList />;
}
```

---

### 3. Modal Component

Reusable dialog for forms and details.

```tsx
<Modal
  isOpen={showModal}
  title="Create New Product"
  onClose={() => setShowModal(false)}
>
  <form>{/* Form content here */}</form>
</Modal>
```

**Features:**

- Backdrop overlay
- Close button (X)
- Title header
- Centered on screen
- Click outside to close (via onClose)

**Usage:**

```tsx
const [showModal, setShowModal] = useState(false);

return (
  <>
    <button onClick={() => setShowModal(true)}>Open</button>

    <Modal
      isOpen={showModal}
      title="My Modal"
      onClose={() => setShowModal(false)}
    >
      Modal content here
    </Modal>
  </>
);
```

---

### 4. Alert Component

Shows success, error, warning, or info messages.

```tsx
<Alert type="success" message="Product created!" />
<Alert type="error" message="Failed to create product" />
<Alert type="warning" message="High gas fees detected" />
<Alert type="info" message="Tip: Always verify addresses" />
```

**Features:**

- Color-coded by type
- Icons (✓ ✕ ⚠ ℹ)
- Optional close button
- Border styling

**Usage:**

```tsx
import Alert from "../components/Alert";

const [error, setError] = useState(null);

{
  error && (
    <Alert type="error" message={error} onClose={() => setError(null)} />
  );
}
```

---

### 5. ProductCard Component

Displays product information.

```tsx
<ProductCard
  product={product}
  onAction={() => handleTransfer()}
  actionLabel="Transfer"
  actionColor="green"
/>
```

**Features:**

- Product name and ID
- Batch ID
- Owner address
- Status badge
- Creation date
- Action button (optional)

**Action Colors:**

- `blue` - Default actions
- `green` - Positive actions (transfer, accept)
- `purple` - Secondary actions
- `red` - Destructive actions

**Usage:**

```tsx
import ProductCard from "../components/ProductCard";

{
  products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      onAction={() => handleClick(product)}
      actionLabel="View Details"
      actionColor="blue"
    />
  ));
}
```

---

### 6. Navbar Component

Navigation bar with wallet info.

```tsx
<Navbar
  address="0x1234...5678"
  role={Role.Manufacturer}
  onLogout={() => handleLogout()}
/>
```

**Features:**

- Logo and branding
- Role badge
- Wallet address
- Dropdown menu
- Copy to clipboard
- Logout button

**Usage:**

```tsx
<Navbar
  address={address}
  role={role}
  onLogout={() => {
    setRole(0);
    setAddress("");
  }}
/>
```

---

### 7. RoleSelector Component

Beautiful role selection buttons.

```tsx
<RoleSelector
  selectedRole={selectedRole}
  onSelectRole={(role) => handleRoleSelect(role)}
  isLoading={loading}
/>
```

**Features:**

- 3 role buttons (Manufacturer, Distributor, Retailer)
- Icons for each role
- Descriptions
- Gradient backgrounds
- Selection ring
- Responsive grid

**Usage:**

```tsx
import RoleSelector from "../components/RoleSelector";

<RoleSelector
  selectedRole={selectedRole}
  onSelectRole={handleSelectRole}
  isLoading={isLoading}
/>;
```

---

## Color Palette

### Primary Colors

```
Blue:      #3B82F6  (rgb(59, 130, 246))
Green:     #22C55E  (rgb(34, 197, 94))
Purple:    #A855F7  (rgb(168, 85, 247))
Yellow:    #EAB308  (rgb(234, 179, 8))
Orange:    #F97316  (rgb(249, 115, 22))
```

### Status Colors

```
Created:   Blue (#3B82F6)
Transit:   Yellow (#EAB308)
Delivered: Green (#22C55E)
```

### Neutral Colors

```
White:     #FFFFFF
Gray-50:   #F9FAFB
Gray-100:  #F3F4F6
Gray-600:  #4B5563
Gray-800:  #1F2937
Black:     #000000
```

---

## Typography Scale

### Headings

```
h1: 36px (text-3xl)  - Page titles
h2: 24px (text-2xl)  - Section titles
h3: 20px (text-xl)   - Subsections
h4: 18px (text-lg)   - Cards
p:  16px (text-base) - Body text
small: 12px (text-sm) - Helper text
```

### Font Weights

```
Regular:   400 (body text)
Semibold:  600 (labels, headings)
Bold:      700 (important text)
```

---

## Spacing Scale

Used consistently throughout the app:

```
px-1: 4px
px-2: 8px
px-3: 12px
px-4: 16px
px-6: 24px
px-8: 32px

py-1: 4px
py-2: 8px
py-3: 12px
py-4: 16px
py-6: 24px
py-8: 32px

gap-1: 4px
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-6: 24px
```

---

## Button Styles

### Primary Button

```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">
  Create Product
</button>
```

### Secondary Button

```tsx
<button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold">
  Cancel
</button>
```

### Gradient Button

```tsx
<button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg">
  Action
</button>
```

### Icon Button

```tsx
<button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center">
  ℹ
</button>
```

---

## Form Inputs

### Text Input

```tsx
<input
  type="text"
  placeholder="Enter value..."
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
```

### Number Input

```tsx
<input
  type="number"
  placeholder="Enter number..."
  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
/>
```

### Address Input (Monospace)

```tsx
<input
  type="text"
  placeholder="0x..."
  className="px-4 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
/>
```

---

## Cards & Containers

### Product Card

```
┌─────────────────────────────────┐
│ Product Name              [Badge]│
│ ID: #123                        │
│ Batch: BATCH-2024-001           │
│ Owner: 0x1234...                │
│ Created: Jan 27, 2024          │
│                                 │
│       [Action Button]           │
└─────────────────────────────────┘
```

### Info Card

```
┌─────────────────────────────────┐
│ ℹ Information Box               │
│                                 │
│ Key: Value                      │
│ Key: Value                      │
│ Key: Value                      │
└─────────────────────────────────┘
```

### Timeline Event

```
    ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐
    ║  Product Created            │
    ║  0x1234...5678              │
    ║  Jan 27, 2024 10:30 AM      │
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┘
```

---

## Responsive Breakpoints

```
Mobile:     < 768px  (single column)
Tablet:     768px-1024px (2 columns)
Desktop:    > 1024px (3 columns)

Classes:
- block (default)
- hidden md:flex (hidden on mobile)
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## Animation & Transitions

### Button Hover

```
transition-all hover:scale-105 (grows slightly)
transition-colors hover:bg-blue-700 (color change)
```

### Spinner

```
animate-spin (infinite rotation)
border-4 border-blue-200 border-t-blue-600
```

### Dropdown

```
transform rotate-180 (arrow animation)
transition-transform (smooth rotation)
```

---

## Icons Used

```
🔗 - Blockchain/Crypto
🏭 - Manufacturing
🚚 - Distribution/Shipping
🏪 - Retail/Store
📦 - Products
✅ - Success/Delivered
⚠️ - Warning/Alert
✕  - Error/Close
ℹ️  - Information
🔍 - Search
💱 - Switch/Exchange
🚪 - Logout
📋 - Copy
🦊 - MetaMask
🌐 - Network
⏱️ - Time/History
```

---

## Accessibility Features

- **Semantic HTML**: Using proper heading levels
- **Color Contrast**: High contrast for readability
- **Focus States**: Visible focus rings on inputs
- **Button States**: Disabled state with cursor-not-allowed
- **ARIA Labels**: Available on key components
- **Keyboard Navigation**: All buttons accessible via Tab

---

## Performance Tips

1. Use TailwindCSS utility classes (already compiled)
2. Avoid inline styles
3. Memoize expensive computations
4. Use React.memo for list items
5. Lazy load modals
6. Cancel API requests on unmount

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

**Last Updated**: January 2026
