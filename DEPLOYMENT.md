# Deployment & Testing Documentation

## Project: Next.js App with Integrated Backend (Socket Server)

---

# 1. Project Structure

This project uses a **single Next.js application** where both frontend and backend logic coexist inside the same folder.

Typical structure:

```
next_js/
│
├── src/            → Next.js frontend (pages/app/components)
├── backend/        → Custom backend/socket server
├── public/
├── package.json
├── .env.example
└── next.config.js
```

There is **no Firebase integration** — authentication, APIs, or sockets are handled internally.

---

# 2. Environment Variables Setup

Environment variables are defined in:

```
.env.example
```

## Setup Steps

1. Copy example file:

```
cp .env.example .env
```

(backend has separate .env.example file)
---

# 3. Local Development & Testing

## Install Dependencies

```
npm install

cd backednd
npm install

```

---

## Run Development Server

```
npm run dev
```

```
http://localhost:3000
```

This runs:

* Next.js frontend
* Backend APIs

```
cd backend
npm run dev
```

```
http://localhost:10000
```

This runs:

* Socket server (if integrated in dev script)

---

## Testing Backend / Socket

### API Testing

* Postman / Thunder Client

```
http://localhost:10000/ping
```

### Socket Testing

* Go to the backend Terminal

Confirm:

* Socket connection established
* Events emitted correctly
* Real-time updates working

---

## Production Build Testing (Local)

Always test before deployment:

```
npm run build
npm start
```

This simulates production behavior.

---

# 4. Deployment Overview

Because frontend and backend live together:

✅ Single deployment
✅ Same environment variables
✅ Same hosting service

Recommended platforms:

* Vercel (for Next.js)
* Render (for backend)

---

# 5. Deployment Option A — Vercel (Recommended)

## Steps

1. Push repository to GitHub.
2. Import project into Vercel.
3. Configure:



**Framework**

```
Next.js
```

**Build Command**

```
npm run build
```

**Output**
(Default Next.js settings)

---

## Environment Variables

Add all variables from:

```
.env.example
```

into Vercel dashboard.

---


# 6. Backend Deployment — Render (Socket-Friendly)

## Render Deployment Steps

1. Create Web Service.
2. Connect GitHub repo.
3. Set:

**Root Directory**

```
backend
```

**Build Command**

```
npm install && npm run build
```

**Start Command**

```
npm start
```

4. Add environment variables.
5. Deploy.

---

# 7. Post-Deployment Testing

## Frontend

* Page loads correctly
* Navigation works
* Production build assets load

## Backend APIs

* API endpoints respond
* Auth/session working
* Database connections active

## Socket Server

* Connection successful
* Events emit/receive
* No timeout/disconnect issues

---


# 8. Command Summary

## Development

```
npm install
npm run dev
```

```
cd backend
npm install
npm run dev
```

---

# 9. Final Deployment Flow

1. Configure `.env` for both backend and next_app.
2. Run local production build test.
3. Deploy to hosting platform.
4. Add environment variables.
5. Test frontend.
6. Test backend APIs.
7. Verify socket functionality.
8. Monitor logs after release.

---

**Documentation Version:** 1.0
**Project Type:** Next.js Fullstack App with Socket Backend
**Last Updated:** February 2026
