# PWA Network and Environment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable the Linxy frontend to communicate with the backend from external devices (like an iPhone PWA) by abstracting the API URL into environment variables.

**Architecture:** We will replace the hardcoded `localhost:8000` string in the frontend `api-client.ts` with a `NEXT_PUBLIC_API_URL` environment variable. We will also create `.env.local` for the local machine and `.env.example` for the repository.

**Tech Stack:** Next.js Environment Variables (`NEXT_PUBLIC_`)

---

### Task 1: Update API Client

**Files:**
- Modify: `frontend/src/lib/api-client.ts`

**Step 1: Refactor the apiClient to use process.env**

Currently, `apiClient` hardcodes `http://localhost:8000`. We need to extract this into a constant that reads from `process.env`.

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = {
  async get(endpoint: string, options: RequestInit = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  },

  async post(endpoint: string, data: any, options: RequestInit = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  },
}
```

**Step 2: Commit changes**

```bash
git add frontend/src/lib/api-client.ts
git commit -m "refactor: abstract API_BASE_URL to environment variable"
```

---

### Task 2: Create Environment Configurations

**Files:**
- Modify: `frontend/.gitignore`
- Create: `frontend/.env.example`
- Create: `frontend/.env.local`

**Step 1: Ensure .env.local is in .gitignore**

Verify `.env.local` is in `frontend/.gitignore` (Next.js default, but good to check). If it isn't, add it.

**Step 2: Create .env.example**

This file goes into source control to show other developers what variables they need.

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Step 3: Create .env.local**

This file is local to the machine and contains the actual local network IP. Note: Using the specific IP `192.168.1.227` based on previous bash output.

```env
# Point to your local machine's IP for mobile PWA testing
NEXT_PUBLIC_API_URL=http://192.168.1.227:8000
```

**Step 4: Commit the example and gitignore (NOT .env.local)**

```bash
git add frontend/.env.example frontend/.gitignore
git commit -m "chore: add frontend environment variable configuration"
```