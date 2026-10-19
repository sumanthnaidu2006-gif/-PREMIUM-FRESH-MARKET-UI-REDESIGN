# Fresh Market — Premium Multi-Category Delivery Platform 🌿🛒

An original, premium, and clean multi-category grocery and lifestyle delivery platform inspired by the operational usability of Amazon and Flipkart, merged with the visual simplicity and calm aesthetics of modern artisanal markets.

Built directly on top of the **AWS Serverless Architecture** (Amazon Cognito, AWS API Gateway, AWS Lambda, Amazon DynamoDB), with **React 18**, **TypeScript**, **Tailwind CSS v4**, and **Lucide Icons**.

---

## 🎨 Color System & Design Tokens

Designed in accordance with the Fresh Market design specifications — **zero blue, indigo, or purple brand tones**:

- **Primary Forest Green**: `#285943` — Navigation bar, brand marks, primary department headers
- **Dark Forest Green**: `#1D4232` — Deep typography, contrasting surfaces
- **Warm Ivory Background**: `#F8F7F0` — Calming workspace and page background
- **Soft Sage Surfaces**: `#E9F0E7` — Category pills, announcement banners, subtle containers
- **Muted Orange Shopping Actions**: `#EFA36B` — Add to Cart, checkout buttons, shopping actions
- **Main Text**: `#252D27` — High-contrast readable typography
- **Secondary Text**: `#667168` — Specifications, reviews, timestamps
- **White Cards**: `#FFFFFF` — Product cards, modal dialogs, checkout steps
- **Borders**: `#E5E3D9` — Restrained borders and dividers
- **Sale Badges**: `#B94A40` — Discount tags and promotional highlights
- **Semantic States**: Success (`#28734D`), Warning (`#94651C`), Error (`#B83D32`)

---

## 🧭 Application Structure & Routes

| Route | View | Description |
|---|---|---|
| `/` | **Fresh Market Home** | Editorial hero, 7 department tiles, Bestsellers, Trending Deals, New Harvest, Kitchen, Beauty, and Recommended shelves |
| `/details/:id` | **Product Details** | Image gallery, live price & discounts, quantity selector, technical specs, related products, DynamoDB admin controls |
| `/cart` | **Shopping Cart** | Interactive rows, free delivery progress meter, save for later, order breakdown, guest cart merging |
| `/checkout` | **5-Step Checkout** | 1. Delivery Address • 2. Shipping Speed • 3. Review • 4. Demo Payment (simulated authorization) • 5. Order Confirmation |
| `/orders` | **Order History** | Real-time tracking status (Processing, Shipped, Delivered), order line items, address summary |
| `/wishlist` | **Wishlist** | Bookmarked favorites, quick "Move to Cart" action |
| `/profile` | **Profile & Addresses** | Customer profile, address book CRUD, Amazon Cognito authentication management |
| `/admin` | **Retail Operations** | Real-time KPI metrics, weekly revenue chart, DynamoDB product CRUD, order status controller |

---

## ⚡ AWS Serverless Architecture

- **Amazon DynamoDB**: Key-value and document database storing product catalog, inventory levels, and order transactions (`CanopyEcommerceTable`).
- **AWS API Gateway**: High-throughput HTTP API exposing `/api/products` and backend routes.
- **AWS Lambda**: Node.js serverless functions handling CRUD operations for catalog items and order lifecycle.
- **Amazon Cognito**: User Pool authentication supporting registration, login, and secure session management.
- **Frontend Dual-Adapter Client**: Seamlessly pulls live DynamoDB items through API Gateway, with automatic fallback and guest persistence so the UI remains fast, resilient, and responsive.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Development

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Building for Production

```bash
cd frontend
npm run build
```

---

## 🌐 Live Website (GitHub Pages)

The platform is configured for automatic deployment via GitHub Actions:
- **Live URL**: [https://sumanthnaidu2006-gif.github.io/-PREMIUM-FRESH-MARKET-UI-REDESIGN/](https://sumanthnaidu2006-gif.github.io/-PREMIUM-FRESH-MARKET-UI-REDESIGN/)

> **GitHub Pages Configuration**:
> In your repository settings (`Settings -> Pages`):
> Set **Build and deployment Source** to **GitHub Actions** (or Deploy from branch `gh-pages` / `main`). The repository includes an automated workflow `.github/workflows/deploy.yml` that builds and publishes the production site automatically on every push.

---

## 📂 Repository Structure

```
.
├── frontend/                     # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/           # Common, Home, Cart, Checkout UI components
│   │   ├── context/              # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── data/                 # Fresh Market curated catalog
│   │   ├── pages/                # CartPage, CheckoutPage, OrdersPage, AdminPage, etc.
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # API Gateway dual-adapter client
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── lambda/                       # Standalone AWS Lambda functions (get, post, update, delete)
├── LambdaWithLayer/              # AWS Lambda functions with shared nodejs layer
├── package.json                  # Root package definition
└── README.md
```

---

## 📄 License
ISC
