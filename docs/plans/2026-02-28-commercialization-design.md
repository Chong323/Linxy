# Commercialization and Scale Design (B2C Native App)
Date: 2026-02-28

## Overview
Linxy is transitioning from a web-based MVP to a profitable, B2C subscription-based native mobile application targeted at parents of children aged 5-10. 

This design outlines the architecture and product strategy to scale the "Digital Bridge" concept securely, concurrently, and profitably.

## 1. Business Model & Monetization Strategy
- **Target Audience:** Parents of children (ages ~5-10) who want safe, educational screen time and actionable parenting insights.
- **Model:** Freemium B2C Subscription.
  - **Free Tier:** Basic child companion chat, limited history, standard avatar.
  - **Premium Tier (Subscription):** Architect Mode insights, weekly growth reports, advanced educational curriculum integration (grade-level specificity), premium voice models, and advanced gamification.
- **Payment Infrastructure:** Apple App Store and Google Play subscriptions managed via **RevenueCat**.

## 2. Backend & Scalability Architecture
The current local file system (`aiofiles`) is insufficient for production concurrency and data integrity.

- **Database Migration:** We will migrate to **Supabase PostgreSQL**.
  - **Users Table:** Managed via Supabase Auth (Parent accounts).
  - **Profiles Table:** Child profiles linked to parents (PIN-protected).
  - **Memories Table:** `identity`, `core_instructions`, and `episodic_memory` will be stored as structured JSONB columns, allowing for safe concurrent read/writes.
- **API Layer:** The existing FastAPI backend will:
  - Verify Supabase JWTs for authentication.
  - Handle RevenueCat webhooks to grant premium access.
  - Continue to orchestrate the LLM (Gemini) interactions using structured outputs.

## 3. Frontend Architecture (Full Native)
To maximize child engagement and parental perceived value, we are moving away from the Next.js PWA.

- **Framework:** **React Native (Expo)** in a new `/mobile` directory.
- **Voice Integration (Critical):** Integration of native Speech-to-Text (device OS or Whisper) and low-latency Text-to-Speech (e.g., ElevenLabs or OpenAI TTS). Voice is the primary interface for younger children.
- **State Management:** Zustand for managing the Dual-Mode (Child vs. Parent PIN entry).

## 4. Engagement & Gamification Loop
A sticky loop is required to justify the parent's subscription.
- **Proactive Wake-Up:** The `/chat/wakeup` endpoint will trigger push notifications or visual cues on the app.
- **Sticker Books & Streaks:** As the child hits learning milestones detected by the Reflection Agent, animated stickers will unlock in their digital "Sticker Book."

## 5. Implementation Phases
1. **Phase 5: Backend Hardening:** Supabase integration, Auth, and DB migration.
2. **Phase 6: Native Client:** Expo app initialization, UI replication, and Voice (STT/TTS) integration.
3. **Phase 7: Monetization:** RevenueCat integration, Paywalls, and App Store submission.