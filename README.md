# DormStay - Dormitory Management System

## Technologies Used

### Backend
- **Node.js & Express**: Building RESTful APIs.
- **Prisma**: ORM (Object-Relational Mapping) for the database.
- **PostgreSQL**: Relational database management system.
- **Bcrypt**: Password hashing.

### Frontend
- **React**: User interface library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Vite**: Build tool and development server.

## Installation & Running

### Requirements
- Docker & Docker Compose

### Step 1: Start the Database
Run the following command to start PostgreSQL and create the schema:
```bash
docker compose up --build -d
```

### Step 2: Start the Backend
```bash
cd server
npm install
npm run dev
```

### Step 3: Start the Frontend
```bash
cd client
npm install
npm run dev
```

Access the application at: [http://localhost:5173](http://localhost:5173)

## Project Structure

```
DormStay/
├── server/         # Backend code (Node.js + Express)
├── client/         # Frontend code (React + Tailwind)
├── database/       # Database configuration and scripts
└── docker-compose.yml # Docker configuration
```
