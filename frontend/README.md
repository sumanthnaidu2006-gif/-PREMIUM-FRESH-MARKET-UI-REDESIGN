# Fresh Market — Premium Multi-Category Delivery Platform

An original, premium, and clean multi-category grocery and lifestyle delivery platform inspired by the operational usability of Amazon and Flipkart, merged with the calm, fresh aesthetics of modern artisanal markets.

Built directly on top of the AWS Serverless Architecture (Amazon Cognito, AWS API Gateway, AWS Lambda, Amazon DynamoDB), with React, Vite, Tailwind CSS v4, and Lucide icons.

---

## 🎨 Color System & Design Tokens

- **Primary Forest Green**: `#285943` (Brand headers, navigation, badges)
- **Dark Forest Green**: `#1D4232` (Primary typography, deep surfaces, logo)
- **Warm Ivory Background**: `#F8F7F0` (Global workspace background)
- **Soft Sage Surfaces**: `#E9F0E7` (Pills, announcement strip, subtle cards)
- **Muted Orange Shopping Actions**: `#EFA36B` (Add to Cart, Primary CTAs)
- **Main Text**: `#252D27`
- **Secondary Text**: `#667168`
- **White Cards**: `#FFFFFF`
- **Subtle Borders**: `#E5E3D9`
- **Sale Badges**: `#B94A40`
- **Success State**: `#28734D`
- **Warning State**: `#94651C`
- **Error State**: `#B83D32`

---

## 🧭 Routes & Features

| Route | View | Description |
|---|---|---|
| `/` | **Fresh Market Home** | Editorial hero, 7 department tiles, Bestsellers, Trending Deals, New Harvest, Kitchen, Beauty, Recommended shelves |
| `/details/:id` | **Product Detail** | High-res gallery, specs, quantity controller, wishlist toggle, related products shelf, plus DynamoDB admin edit mode |
| `/cart` | **Shopping Cart** | Item rows, free shipping progress bar, save for later, order summary, guest cart merging |
| `/checkout` | **5-Step Checkout** | Address picker, delivery window, order review, Demo Payment with simulated test authorization, receipt confirmation |
| `/orders` | **Customer Orders** | Order history, tracking status (Processing, Shipped, Delivered), item list, destination summary |
| `/wishlist` | **Saved Wishlist** | Saved items, quick Add All to Cart, single-click bookmarks |
| `/profile` | **Profile & Addresses** | Customer profile, address book CRUD, Amazon Cognito authentication management |
| `/admin` | **Retail Operations** | KPI cards (revenue, orders, inventory count, low-stock), weekly sales chart, DynamoDB product CRUD, order status controller |

---

## ⚡ Architecture & Backend Integration

- **Authentication**: Amazon Cognito User Pool via `react-oidc-context`.
- **API Gateway**: `GET /coffee`, `POST /coffee`, `PUT /coffee/{id}`, `DELETE /coffee/{id}` preserved in `src/utils/apis.js`.
- **Persistence**: Cart, wishlist, custom products, delivery destinations, and order receipts persist across sessions with guest-to-authenticated merging.
- **Zero Broken Images**: `ImageWithFallback` provides graceful SVG placeholders if remote assets encounter latency.
