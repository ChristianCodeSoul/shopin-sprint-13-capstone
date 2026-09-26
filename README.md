
# ShopIn

ShopIn is a fullstack e-commerce application built as my Sprint 13 Capstone project.

The project covers the complete shopping flow from browsing products to managing a cart, checking out, and viewing previous orders. It also includes authentication, user profiles, an admin dashboard, and an AI shopping assistant.

The main goal of this sprint was not just to build the UI, but to plan the application properly through a PRD, Figma flows, database design, and a production-oriented system architecture.

## What I Built

### Customer Side

- Product browsing
- Product cards with pricing and product information
- Shopping cart
- Quantity management
- Checkout flow
- Order creation
- Order history
- User profile
- Profile information updates
- Password change
- Login and registration
- Dark/light theme
- AI shopping assistant

### Admin Side

- Admin dashboard
- Product inventory overview
- User count
- Order count
- Revenue overview
- Recent orders
- Product inventory information

### Backend

- REST API built with Express.js
- MongoDB database with Mongoose
- JWT-based authentication
- User management
- Product management
- Order management
- Protected routes
- AI assistant API integration
- Socket.IO support for real-time events
- Redis adapter support

## Tech Stack

### Frontend

- Next.js
- React
- Redux Toolkit
- RTK Query
- JavaScript
- Tailwind CSS / CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Redis

### Tools & Deployment

- Git
- GitHub
- Figma
- Vercel
- Render
- Docker architecture planning

[Figma link Click to view](https://www.figma.com/design/68Xpw1tEFfzqLsgkPUDPGj/ShopIn.---Sprint-13-Wireframes?node-id=0-1&t=SSkCi0Z6RZUOCfl3-1)

Application Flow

The main customer flow is:

```text
Home
  ↓
Browse Products
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Order Created
  ↓
Order Success
  ↓
Orders
```
