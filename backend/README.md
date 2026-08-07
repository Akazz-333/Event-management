# 🎟️ Event Management REST API & Web Application

A production-grade, highly scalable **Event Management REST API & Web Application** built with Node.js, Express, TypeScript, and Prisma ORM supporting **MongoDB / MongoDB Compass** & **SQLite**.

Featuring **JWT Authentication**, **Role-Based Access Control (RBAC)**, **Events CRUD**, **Ticket Tiering & Capacities**, **Ticket Booking with QR Code generation**, **Venue Check-in**, **Search, Filter & Pagination**, **Strict Input Validation**, **Global Error Handling**, **Interactive Swagger UI**, **Postman Collection**, and **Docker Deployment**.

---

## 🍃 MongoDB & MongoDB Compass Setup Guide

### 1. MongoDB Compass Connection String URL

To connect **MongoDB Compass** (GUI client) to your database, paste the following URI into MongoDB Compass:

```text
mongodb://localhost:27017/event_management_db
```

Or for IPv127 loopback:
```text
mongodb://127.0.0.1:27017/event_management_db
```

---

### 2. Connect Project to MongoDB

#### Step A: Configure `.env`
Set `DATABASE_URL` in your `.env` file to your MongoDB instance:

```env
# Local MongoDB (Default Compass Port 27017)
DATABASE_URL="mongodb://localhost:27017/event_management_db"

# Or MongoDB Atlas Cloud Cluster:
# DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/event_management_db?retryWrites=true&w=majority"
```

#### Step B: Push MongoDB Schema & Seed
Run the following npm command to push the MongoDB schema and generate the client:

```bash
# Push MongoDB schema & collections
npm run db:push:mongodb

# Seed sample data into MongoDB
npm run seed
```

---

## ⚡ Quick Start (Local Execution)

```bash
# 1. Install dependencies
npm install

# 2. Start server (Backend API + Web Dashboard)
npm run dev

# 3. Access Web App in Browser
# http://localhost:3000
```

---

## 📚 API Documentation & Tooling

- **Interactive Web App**: [http://localhost:3000](http://localhost:3000)
- **Swagger UI Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Postman Collection**: [http://localhost:3000/api/v1/postman-collection](http://localhost:3000/api/v1/postman-collection)

---

## 🧪 Automated Test Suite

```bash
npm test
```

All 23 integration tests pass 100%.

---

## 📄 License
MIT License
