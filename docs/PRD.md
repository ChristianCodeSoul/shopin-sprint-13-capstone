# ShopIn : Product Requirements Document

## 1. Product Overview

### Product Name : ShopIn

### Product Type : Full-stack e-commerce platform

### Purpose

ShopIn is a full-featured e-commerce platform where users can browse products, manage their cart, check out, and track past orders.

It includes secure authentication and user profiles out of the box.

On the backend, admins get a dedicated dashboard to monitor overall sales revenue alongside product, user, and order management.

There's also an AI shopping assistant built right into the storefront to help answer customer questions and guide purchases in real time.

# 2. Product Goals

ShopIn is designed around the following goals:

1. Provide a responsive and accessible shopping experience.
2. Support secure user authentication.
3. Provide persistent product and order data.
4. Provide a complete cart-to-checkout workflow.
5. Preserve historical order pricing.
6. Provide user profile management.
7. Provide administrative analytics and visibility.
8. Integrate an AI-powered customer assistant.
9. Maintain a consistent light/dark visual system.
10. Provide a production-ready full-stack architecture.

# 3. Target Users

## 3.1 Customer

A customer can:

* Browse products.
* View product information.
* Add products to the cart.
* Modify cart quantities.
* Remove products.
* Authenticate with the platform.
* Update profile information.
* Change their password.
* Complete checkout.
* Place orders.
* View previous orders.
* Use the AI assistant.

## 3.2 Administrator

An administrator can access platform-level information including:

* Product inventory.
* Registered users.
* Orders.
* Revenue overview.
* Recent platform activity.

Administrative functionality is separated from the normal customer shopping flow.

# 4. Core User Flows

## 4.1 Registration

```text
Landing Page
     ↓
Register
     ↓
Enter account information
     ↓
Validate input
     ↓
Submit registration
     ↓
Backend creates User
     ↓
Registration successful
     ↓
User can log in
```

### Registration Requirements

The registration form should collect:

* First name
* Last name
* Username
* Email
* Password

The backend validates the submitted information before creating the account.

Usernames and email addresses must be unique.

Passwords must not be stored as plain text.

### Registration Edge Cases

* Required field is empty.
* Username already exists.
* Email already exists.
* Invalid email format.
* Password does not satisfy validation rules.
* Network request fails.
* Backend validation fails.
* Database operation fails.

The user should receive a clear error message without exposing internal server details.

## 4.2 Login

```text
Landing Page
     ↓
Login
     ↓
Enter username/email and password
     ↓
Submit credentials
     ↓
Backend validates credentials
     ↓
Authentication token generated
     ↓
Authenticated user state updated
     ↓
User accesses protected features
```

### Login Requirements

The system must:

* Validate credentials.
* Reject invalid credentials.
* Generate an authentication token after successful authentication.
* Maintain authenticated user state.
* Attach the token to protected API requests.

### Login Edge Cases

* Incorrect username.
* Incorrect password.
* Missing credentials.
* Invalid account.
* Network failure.
* Backend unavailable.
* Expired or invalid authentication token.

# 5. Product Browsing

The storefront is the primary customer-facing page.

Customers can browse the available product catalogue.

Each product can display:

* Product image.
* Product title.
* Current price.
* Original price where applicable.
* Discount percentage where applicable.
* Category.
* Stock availability.

### Product Requirements

Products are retrieved from the backend API.

The storefront should handle:

* Loading state.
* Successful product response.
* Empty product catalogue.
* API failure.

### Product Edge Cases

* Product has no image.
* Product has no description.
* Product has zero stock.
* Product price is unavailable.
* Backend cannot be reached.
* Product data is malformed.

# 6. Cart Management

Customers can add products to a shopping cart.

The cart supports:

* Adding products.
* Increasing quantity.
* Decreasing quantity.
* Removing products.
* Clearing the cart.
* Calculating subtotal.
* Calculating total amount.
* Navigating to checkout.

### Cart Rules

A product should not be added with an invalid quantity.

The cart should update the displayed total when quantities change.

A customer should not be able to proceed with an empty cart.

### Cart Edge Cases

* Cart is empty.
* Product quantity becomes zero.
* Product is removed.
* Product is no longer available.
* Product stock changes.
* Invalid product data is received.
* Customer attempts checkout without items.

# 7. Checkout

Checkout converts the customer's cart into an order.

The checkout process collects:

* Customer information.
* Shipping information.
* Payment method selection.

The current Sprint 13 implementation represents the payment selection as part of the checkout interface. A real payment gateway can be integrated as a future extension.

### Checkout Flow

```text
Cart
  ↓
Checkout
  ↓
Validate customer information
  ↓
Validate shipping information
  ↓
Select payment method
  ↓
Review order
  ↓
Place order
  ↓
Backend creates order
  ↓
Cart cleared
  ↓
Order confirmation
```

### Checkout Edge Cases

* Customer is not authenticated.
* Cart is empty.
* Missing shipping information.
* Missing payment selection.
* Invalid cart data.
* Order API fails.
* Database fails.
* Network request times out.
* Order creation succeeds but frontend response handling fails.

The customer should not lose their cart unnecessarily when order creation fails.

# 8. Order Management

Every successful order is associated with the authenticated customer.

An order contains:

* Customer reference.
* Product references.
* Product quantities.
* Product prices at the time of purchase.
* Total amount.
* Order status.
* Payment status.
* Creation timestamp.
* Update timestamp.

### Order Status

Supported order states are:

```text
pending
paid
shipped
delivered
cancelled
```

### Payment Status

Supported payment states are:

```text
pending
paid
failed
```

### Order History

Authenticated customers can view their previous orders.

Orders are displayed with:

* Order identifier.
* Order date.
* Products.
* Quantities.
* Prices.
* Total amount.
* Order status.

### Order Edge Cases

* Customer has no previous orders.
* Order does not exist.
* Invalid order ID.
* Customer attempts to access another customer's order.
* API request fails.
* Authentication expires while viewing orders.

# 9. User Profile

Authenticated users can access their profile.

The profile displays:

* First name.
* Last name.
* Username.
* Email.

Users can update supported profile information.

### Profile Requirements

Users can:

* Update their first name.
* Update their last name.
* Change their password.

Sensitive account information should only be accessible to the authenticated user.

### Profile Edge Cases

* User is not authenticated.
* Invalid profile data.
* Password change fails.
* Incorrect current password.
* Network failure.
* Backend validation failure.

---

# 10. Admin Dashboard

The administrator dashboard provides platform-level visibility.

The dashboard displays:

* Total products.
* Total users.
* Total orders.
* Revenue overview.
* Recent orders.
* Product inventory.

### Admin Dashboard Requirements

The dashboard should provide a centralized overview of platform activity.

Administrative functionality should be separated from the normal customer experience.

### Admin Edge Cases

* Unauthorized user attempts to access the dashboard.
* Authentication token is invalid.
* Product API fails.
* User API fails.
* Order API fails.
* No orders exist.
* No products exist.
* Revenue data is unavailable.

# 11. AI Shopping Assistant

ShopIn includes an AI-powered shopping assistant on the storefront.

Customers can submit questions and receive AI-generated responses.

Potential use cases include:

* Product-related questions.
* Shopping guidance.
* General catalogue assistance.
* Product comparison guidance.
* Basic purchase-related questions.

### AI Request Flow

```text
Customer
   ↓
AI Assistant
   ↓
Frontend
   ↓
Backend AI Endpoint
   ↓
AI Service
   ↓
External AI Provider
   ↓
Generated Response
   ↓
Frontend
   ↓
Customer
```

The frontend does not directly communicate with the external AI provider.

### AI Edge Cases

* AI provider is unavailable.
* Request times out.
* Empty message submitted.
* Invalid request.
* Backend AI endpoint fails.
* AI provider returns an error.
* Generated response is unavailable.

The interface should show a controlled error message rather than exposing provider or server implementation details.

# 12. Theme System

ShopIn supports light and dark visual themes.

The theme applies consistently across the application.

The system should maintain the selected theme while navigating between supported pages.

### Theme Requirements

* Light theme.
* Dark theme.
* Theme toggle.
* Persistent theme preference.
* Consistent contrast.
* Readable text and controls in both modes.

# 13. Responsive Design

ShopIn is designed for multiple viewport sizes.

The interface should support:

* Desktop.
* Tablet.
* Mobile.

Responsive behavior includes:

* Adaptive navigation.
* Responsive product grid.
* Mobile-friendly cart.
* Responsive checkout.
* Responsive dashboard.
* Readable typography.
* Touch-friendly controls.

The application should be tested across multiple viewport sizes before production submission.

# 14. Accessibility Requirements

The interface should follow basic accessibility practices.

Requirements include:

* Semantic HTML where appropriate.
* Accessible button labels.
* Sufficient text contrast.
* Keyboard-accessible interactive elements.
* Form labels.
* Clear validation messages.
* Meaningful loading and error states.
* Responsive layouts.

# 15. API Requirements

The backend exposes domain-specific API routes.

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Products

```text
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

### Users

```text
GET    /users
GET    /users/:id
GET    /users/me
PUT    /users/me
PUT    /users/me/password
POST   /users
PUT    /users/:id
DELETE /users/:id
```

### Orders

```text
GET    /orders
GET    /orders/:id
POST   /orders
PUT    /orders/:id
DELETE /orders/:id
```

### AI

```text
POST /ai/chat
```

Protected endpoints require authentication where applicable.

# 16. Data Requirements

The application uses MongoDB with Mongoose.

### User Data

The User entity stores:

* Identity information.
* Authentication information.
* Profile information.
* Role.
* Timestamps.

### Product Data

The Product entity stores:

* Product information.
* Pricing.
* Discount information.
* Category.
* Inventory.
* Timestamps.

### Order Data

The Order entity stores:

* Customer reference.
* Purchased products.
* Quantity.
* Historical product price.
* Total amount.
* Order status.
* Payment status.
* Timestamps.

Historical product prices are stored within order items so that later product price changes do not alter previously created orders.

# 17. Security Requirements

The system should follow basic application security principles.

### Authentication

Protected resources require valid authentication.

### Authorization

The application distinguishes between normal users and administrators through user roles.

### Password Protection

Passwords are stored as hashes rather than plain-text values.

### Environment Variables

Sensitive configuration must be stored through environment variables.

Examples include:

* MongoDB connection strings.
* Authentication secrets.
* AI provider credentials.
* Deployment configuration.

### API Security

The backend should validate incoming requests and avoid exposing internal errors to clients.

# 18. Error Handling

The application must provide predictable handling for common errors.

### Client Errors

Examples:

* Invalid input.
* Missing required fields.
* Unauthorized request.
* Resource not found.

### Server Errors

Examples:

* Database failure.
* External service failure.
* Unexpected backend exception.

The frontend should display user-friendly error states.

Internal stack traces, database errors, and sensitive implementation information should not be displayed to customers.

# 19. Performance Requirements

The application should provide a responsive experience during normal usage.

Performance considerations include:

* Efficient API requests.
* RTK Query caching.
* Optimized product rendering.
* Optimized images.
* Responsive layouts.
* CDN-based frontend delivery.
* Database query optimization.

The production build should be tested before deployment.

# 20. Observability and Maintainability

The backend should provide useful server-side logging for:

* Authentication errors.
* Database errors.
* Order failures.
* AI service failures.
* Unexpected server errors.

The frontend should expose appropriate loading and error states.

The codebase should maintain separation between:

* UI components.
* Application state.
* API communication.
* Backend routes.
* Controllers.
* Database models.
* Middleware.

# 21. Deployment Requirements

The application consists of separate frontend and backend environments.

### Frontend

The Next.js application can be deployed using a production edge platform such as Vercel.

### Backend

The Express API can be deployed using a backend hosting platform such as Render.

### Database

MongoDB provides persistent production data storage.

### Environment Configuration

Production environment variables must be configured separately from local development variables.

# 22. Non-Functional Requirements

### Reliability

The system should handle expected user and API errors without crashing the application.

### Security

Authentication, authorization, password protection, and environment-variable management must be implemented.

### Scalability

The architecture should allow backend functionality to evolve into independently deployable services.

### Maintainability

The codebase should use modular components and clearly separated application responsibilities.

### Usability

Users should be able to complete the primary shopping flow without unnecessary steps.

### Responsiveness

The application must remain usable across desktop, tablet, and mobile viewport sizes.

# 23. Future Enhancements

Potential future improvements include:

* Real payment gateway integration.
* Product search and filtering.
* Product reviews and ratings.
* Wishlist functionality.
* Inventory management.
* Email order notifications.
* Advanced admin analytics.
* Order status notifications.
* AI-powered product recommendations.
* Redis caching.
* Background job processing.
* Independent microservice deployment.
* Container orchestration.

These features are outside the minimum Sprint 13 implementation scope but are compatible with the proposed architecture.

# 24. Acceptance Criteria

The Sprint 13 implementation is considered complete when:

* Users can register.
* Users can log in.
* Users can browse products.
* Users can add products to their cart.
* Users can modify cart quantities.
* Users can remove cart items.
* Users can complete checkout.
* Users can create orders.
* Users can view their order history.
* Users can update their profile.
* Users can change their password.
* The admin dashboard displays platform information.
* The AI shopping assistant is available.
* Light and dark themes work consistently.
* The application is responsive.
* Protected resources require authentication.
* Sensitive configuration is stored through environment variables.
* The production build completes successfully.
* The project documentation includes the PRD, ERD, and system architecture.

# 25. Project Documentation

The ShopIn documentation is divided into three primary architecture documents:

```text
docs/
├── PRD.md
├── ERD.md
└── architecture.md
```

`PRD.md` defines product requirements, user flows, functional requirements, edge cases, and acceptance criteria.

`ERD.md` defines the database entities and their relationships.

`architecture.md` defines the application architecture, service boundaries, deployment model, and system communication flows.
