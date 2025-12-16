# AGIT To-Do List Application

A full-stack To-Do List application developed as part of the AGIT Internship Technical Assessment.

This project demonstrates basic CRUD operations, a clean API structure using the Next.js App Router, form validation, and database integration with Prisma.

---

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Database: SQLite
- ORM: Prisma
- Styling: Tailwind CSS
- Data Fetching: SWR
- Form Handling: React Hook Form
- Validation: Zod

---

## Features

- Create, read, update, and delete tasks
- Soft delete implementation
- Filter tasks by status (pending, in_progress, completed)
- Sort tasks by title, created date, or updated date
- Responsive layout
- Loading and error handling states
- Client-side form validation

---

## Project Structure

```text
agit-todo-app/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── favicon.ico
├── components/
│   ├── TaskForm.tsx
│   ├── TaskList.tsx
│   └── TaskItem.tsx
├── hooks/
│   └── useTasks.ts
├── lib/
│   ├── prisma.ts
│   └── validations.ts
├── prisma/
│   ├── app.db
│   ├── schema.prisma
│   └── migrations/
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md

## Setup Instructions

1. Clone the repository
git clone <repository-url>
cd agit-todo-app

2. Install dependencies
npm install

3. Set up the database
npx prisma generate
npx prisma db push

4. Run the development server
npm run dev

5. Open your browser at http://localhost:3000

---

## API Endpoints

- GET /api/tasks : Get all tasks (with optional filtering and sorting)
- POST /api/tasks : Create a new task
- GET /api/tasks/[id] : Get a single task by ID
- PUT /api/tasks/[id] : Update a task
- DELETE /api/tasks/[id] : Soft delete a task

---

## Database Schema

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("pending")
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  deleted_at  DateTime?

  @@map("tasks")
}

---

## Development Notes

- Uses SQLite for simplicity and portability
- Implements soft delete
- Uses SWR for efficient data fetching
- Form validation with Zod and React Hook Form
- Responsive design with Tailwind CSS

---

## License

Developed for AGIT Internship Technical Assessment

---

## Changes Made

1. Database location moved from prisma/dev.db to app.db in root
2. Added app.db-journal for SQLite journaling
3. Removed duplicate prisma/prisma structure
4. Simplified setup instructions
5. Fixed feature list to include all status filters

---

## Project Status

- Database running properly in app.db
- Clean and organized project structure
- Accurate and informative README
- Full CRUD operations functional
- Ready for submission or deployment
