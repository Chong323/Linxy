# PWA Network and Environment Configuration Design

**Goal**: Enable frontend testing on local network devices (e.g., iPhone PWA) by abstracting the backend URL into environment variables, avoiding hardcoded `localhost`.

**Architecture**: 
- Abstract API fetching logic in `api-client.ts` to use Next.js public environment variables (`NEXT_PUBLIC_API_URL`).
- Provide an `.env.example` in the frontend for developers to clone.
- Maintain a local `.env.local` containing the developer's current local IP (e.g. `192.168.1.x`) to point the frontend to the backend over the local network.
- Ensure `.env.local` is ignored by Git to avoid checking in personal IP addresses.

**Data Flow**:
1. Frontend makes API call using `apiClient.get('/path')`.
2. `api-client.ts` constructs full URL by reading `process.env.NEXT_PUBLIC_API_URL` (falling back to `http://localhost:8000` if undefined).
3. Request successfully routes to the backend on the host machine.
4. FastAPI backend accepts the request due to existing wildcard CORS configuration.