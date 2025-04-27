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

## My Approach

### API First
I started by designing all the backend endpoints before developing the frontend. This allowed me to establish a clear API structure and ensure the frontend would have all the data it needed. 

### Schema Design
I modeled the database tables for clients, programs, and enrollments using **Drizzle ORM**. This provided a clear structure for data relationships and helped me keep track of entities like users, health programs, and their enrollments.

### Authentication
For secure API access, I implemented **JWT authentication**. This ensures that only authenticated users can access sensitive endpoints, keeping the system secure.

### Clean Architecture
I focused on a clean and maintainable architecture by separating concerns between routes, services, and database logic. This helps in scaling the project and keeping the codebase easy to navigate.

### Responsive UI
I used **TailwindCSS** to create a simple, mobile-friendly, and clean user interface. This approach allowed me to quickly style the app with minimal overhead while ensuring it would be responsive across devices.

### Documentation
I made sure to write clear comments and keep the codebase clean to make it easy for others to understand and contribute.

### The Process
Here’s my step-by-step approach:
1. **Backend Development:** I began by designing my schemas and setting up the database. I created models for users, health programs, and their enrollments.
2. **Controllers:** I wrote controllers for each model and designed API endpoints to handle client requests (e.g., client registration, health program enrollment).
3. **Testing:** I used **Postman** to test all the API endpoints and ensure they were working correctly before moving to the frontend.
4. **Frontend Setup:** Once the backend was ready, I set up the frontend using **React** with **TypeScript** and **TailwindCSS** for styling.
5. **Redux for Authentication:** I implemented **Redux** to manage authentication state across the app, allowing users to log in, register, and manage their sessions.
6. **Pages and Components:** I set up pages for different sections of the app, such as client registration, program management, and user profiles, ensuring a smooth and intuitive UI/UX.

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



