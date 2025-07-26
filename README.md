
# 📌 Full-Stack MEAN App (Nx Monorepo)

## 🚀 Task Goal
Build an **end-to-end responsive web application** that:
- Consumes a backend API.
- Lists data from a database.
- Includes a web form that sends data via a **POST request**.

---

## 🛠️ Technology Stack
- **Frontend:** Angular + NgRx (state management)
- **Backend:** NestJS (API)
- **Database:** MongoDB (Atlas for cloud hosting)
- **Monorepo:** Nx.dev
- **Authentication:** JWT-based with 8-hour session persistence

---

## ✅ Core Features
- **Signup / Sign In / Sign Out** functionality.
- **Session Management:**  
  Users stay signed in for **8 hours** unless they log out.
- **Protected Routes:**  
  Backend routes secured with JWT authentication.
- **NgRx Store:**  
  Centralized state management for authentication and user data.
- **Responsive UI:**  
  Mobile-friendly Angular frontend.
- **User Posts:**  
  Logged-in users can create and view posts. Posts are saved in MongoDB and fetched from the backend.
- **Display Posts:**  
  A live feed displays all posts from the database in reverse chronological order.

---

## ⭐ Optional Enhancements (Bounty Points) ✅ *Implemented*
- **Forgot Password:** ✅ Email-based password reset flow with secure token link.
- **Atlas MongoDB:** ✅ Database hosted on MongoDB Atlas for online access.
- **List data for logged in user:** ✅ Listing users posts in the home page.

---

## 📂 Project Structure
```
my-fullstack-app/
│── apps/
│   ├── api/         # NestJS backend
│   │   └── src/
│   │       ├── auth/        # Authentication module
│   │       ├── posts/       # Posts module (create & fetch posts)
│   │       ├── app.module.ts
│   │       ├── main.ts
│   └── frontend/    # Angular frontend
│       └── src/
│           ├── app/
│           │   ├── components/  # Dashboard, Login, Signup, Forgot Password
│           │   ├── guards/
│           │   ├── store/       # NgRx actions, reducers, selectors
│           │   ├── services/
│           │   └── interceptors/
│
├── libs/            # Shared libs (if any)
├── nx.json
├── package.json
└── tsconfig.json
```

---

## ⚡ Installation & Setup

### 🔧 1. Clone the repository:
```bash
git clone https://github.com/Ananny1/my-fullstack-app.git
cd my-fullstack-app
```

### 🔧 2. Install dependencies:
```bash
npx nx@latest init
npm install
```

### 🔧 3. Run the app:
Start both frontend & backend via Nx:
```bash
# Start NestJS backend
npx nx serve api

# Start Angular frontend
npx nx serve frontend
```

---

## 📌 API Endpoints

### **Authentication**
- `POST /api/auth/signup` → Register a new user.
- `POST /api/auth/login` → Login and receive a JWT token.
- `GET /api/auth/profile` → Get current user info (requires token).
- `POST /api/auth/forgot-password` → Send password reset email.
- `POST /api/auth/reset-password` → Reset password with token.

### **Posts**
- `GET /api/posts` → Fetch all posts (requires token).
- `POST /api/posts` → Create a new post (requires token).  
  **Body:**  
  ```json
  {
    "content": "My first post!"
  }
  ```

---

## 🖊️ User Post Flow
1. A logged-in user types content into the post form on the dashboard.
2. The Angular frontend sends a **POST request** to `/api/posts` with the content.
3. The NestJS backend saves the post in MongoDB with the user’s ID.
4. The frontend calls **GET /api/posts** and displays the list of posts in real-time.
