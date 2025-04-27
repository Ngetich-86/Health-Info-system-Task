# 🏥 Health Information System

A basic Health Information System that allows doctors to manage clients and enroll them in various health programs.  
Built with **React**, **TypeScript**, **Node.js**, **Hono.js**, **Drizzle ORM**, **PostgreSQL**, and **TailwindCSS**.

---
## 📸 Demo


## ✨ Features

- Create health programs (e.g., TB, Malaria, HIV, etc.)
- Register and manage clients
- Enroll clients into multiple health programs
- Search for registered clients
- View client profiles with enrollment information
- Expose client profiles via a clean API
- Modern, responsive UI design

---

## 🛠️ Technologies Used

### Frontend
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/) (for icons)
- [React Router DOM](https://reactrouter.com/) (for navigation)

### Backend
- [Node.js](https://nodejs.org/)
- [Hono.js](https://hono.dev/) (super fast server framework)
- [Drizzle ORM](https://orm.drizzle.team/) (for database interaction)
- [PostgreSQL](https://www.postgresql.org/) (for database)
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) (for token-based authentication)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) (for password hashing)

---

## 🧠 My Approach

- **API First:** I designed all backend endpoints before developing the frontend.
- **Schema Design:** I modeled the database tables for `clients`, `programs`, and `enrollments` using **Drizzle ORM**.
- **Authentication:** Basic authentication is implemented with **JWT** for secure API access.
- **Clean Architecture:** I separated concerns between routes, services, and database logic.
- **Responsive UI:** I used **TailwindCSS** to create a simple, mobile-friendly and clean user interface.
- **Documentation:** I wrote clear comments and kept the codebase clean for easy understanding.

---

## 📂 Project Structure

```bash
Frontend/
 └── src/
      ├── components/
      ├── pages/
      ├── services/
      └── App.tsx

Backend/
 ├── src/
      ├── routes/
      ├── controllers/
      ├── db/
      ├── drizzle/
      └── server.ts
```
## 🚀 Running Locally

### Clone the repository:

```bash
git clone https://github.com/Ngetich-86/Health-Info-system-Task
```

### Configure Environment Variables

## Start the Backend Server

## Start the Frontend App



