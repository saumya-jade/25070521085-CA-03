# BlushBox - Personalized Gifting and Mystery Jar Platform

Full-stack web app: React (Vite) + Node.js/Express + MongoDB (Mongoose).

## Features
- Signup, login (JWT, bcrypt-hashed passwords), logout, protected pages
- Home, Shop (search, filters, sort, URL sync), Product Details
- Mystery Jars (filter by type, colour, size, budget; contents stay a surprise)
- Cart and Wishlist saved in MongoDB (server validates price and stock)
- Checkout with address, Cash on Delivery or UPI QR (simulated payment)
- Orders: confirmation, history, details with status tracker
- Stock reminders: "Remind me when back in stock" (in-app only, no email/SMS)

## Requirements
Node.js 18+, MongoDB Community running on 127.0.0.1:27017, MongoDB Compass (optional).

## Setup
1. Server:
   ```
   cd server
   npm install
   copy .env.example .env
   npm run seed
   node seed/updateImages.js
   npm run dev
   ```
   Server runs on http://localhost:5000
2. Client (new terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
   Open http://localhost:5173
3. Open the app, click Sign Up, create an account, then log in.

Note: run `npm run seed` only on first setup. It resets products (and their IDs).

## Pages
| Route | Page |
|---|---|
| /signup, /login | Create account, login |
| / | Home |
| /shop | Shop with filters |
| /product/:slug | Product details |
| /mystery-jars | Mystery jars |
| /cart, /wishlist | Cart, wishlist |
| /alerts | Stock reminders |
| /checkout | Checkout |
| /order-confirmation/:id | Confirmation |
| /orders, /orders/:id | Order history, details |

## API endpoints
Public: `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`,
`GET /api/products`, `GET /api/products/:idOrSlug`, `GET /api/products/filters/options`, `GET /api/categories`

Login required (Bearer token):
- `GET /api/auth/me`
- Cart: `GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:productId`, `DELETE /api/cart/items/:productId`, `DELETE /api/cart`
- Wishlist: `GET /api/wishlist`, `POST /api/wishlist/:productId`, `DELETE /api/wishlist/:productId`
- Orders: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`
- Stock alerts: `GET /api/stock-alerts`, `POST /api/stock-alerts/:productId`, `DELETE /api/stock-alerts/:productId`

## Testing checklist
- [ ] Signup with new email, then login and logout
- [ ] Visiting /shop without login redirects to /login
- [ ] Shop: search, category, price, colour, sort, Clear all
- [ ] Product details open from a card
- [ ] Add to cart, change quantity, remove; refresh keeps the cart
- [ ] Wishlist heart works and persists
- [ ] Checkout with invalid mobile (123) shows an error
- [ ] COD order placed; stock reduces; cart empties
- [ ] UPI QR (demo) order shows "Demo Paid"
- [ ] Orders list and order details open
- [ ] Out-of-stock product shows "Remind me"; /alerts shows it
- [ ] Mystery Jars filters work

## Verify in MongoDB Compass
Connect to `mongodb://127.0.0.1:27017`, open database `blushbox` and click Refresh.
- `users`: password starts with `$2b$` (hashed), role is `user`
- `products`: 33 documents (24 gifts + 9 mystery jars)
- `carts`, `wishlists`: one document per user
- `orders`: paymentMethod COD or UPI_DEMO, items with price snapshot
- `stockalerts`: user and product references

## Security notes
- Passwords hashed with bcrypt; JWT authentication
- Prices and stock are always recomputed on the server
- Nobody becomes admin through signup
- Set `NODE_ENV=production` to hide error stack traces

## Limitations (honest notes)
- Payment is simulated. The QR contains only demo text and no money moves. Razorpay is future scope.
- Stock reminders appear inside the website only. No email or SMS is sent.
- Newsletter box is UI only.
- Admin dashboard, reviews and password reset are future scope.

## Short project explanation (for submission)
BlushBox is a personalized gifting platform with a Mystery Jar feature. Users create an account, log in, browse gifts by occasion, price and colour, save favourites, add items to a cart and place orders. The Express backend validates every cart and order against MongoDB, reduces stock on purchase, and stores orders with a price snapshot. The React frontend uses Context for authentication and cart state, and React Router for protected pages.
