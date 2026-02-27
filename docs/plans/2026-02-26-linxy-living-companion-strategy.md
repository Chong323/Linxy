# Linxy: The Living Companion Product Strategy
Date: 2026-02-26

## Executive Summary
This document outlines the strategic pivot for Linxy from a functional prototype (command-based chatbot) into a profitable, "living" AI educational companion. The goal is to create a digital entity that "grows up" alongside the child, providing educational value for the parent and a genuine emotional connection for the child.

## 1. Product Vehicle & Monetization
*   **Target Platform:** A Progressive Web App (PWA) designed primarily for mobile/tablet use (iPad/iPhone). Children do not intuitively interact with desktop browsers.
*   **Business Model:** A $10/month SaaS subscription.
*   **Value Proposition (The Parent):** "Guilt-Free Screen Time." Parents are paying for peace of mind, knowing their child is engaging with an educational entity that also provides insights into their emotional and academic development.
*   **Value Proposition (The Child):** A dedicated, memory-retaining friend who remembers their birthday, their fears, their favorite games, and "wakes up" to talk to them.

## 2. The "Living" Architecture (MVP Storage)
To mimic a "Persistent Soul" (inspired by OpenClaw), the memory engine will use a multi-file system per user:
*   `identity.md`: The permanent persona of Linxy (e.g., boundaries, core identity, name).
*   `core_instructions.md`: Parent-injected directives and syllabus (e.g., "We are learning fractions this week").
*   `current_state.md`: The AI's short-term mood and immediate context (e.g., "I am excited to hear how the math test went today").
*   `episodic_memory.json`: The long-term, timestamped log of significant events, fears, interests, and milestones.

## 3. The Core Interaction Loop
A companion must be proactive, not just reactive.
*   **The Hook (Push/Local Notifications):** The PWA uses local notifications to "wake up". (e.g., *"Linxy is awake and waiting for you!"*).
*   **The Check-In:** Upon opening the app, the UI doesn't present an empty chat box. The AI *initiates* the conversation based on the previous day's `current_state.md` (e.g., *"Hey! How did that spelling test go?"*).
*   **The Toll (Education Integration):** The AI seamlessly weaves 5-10 minutes of curriculum (defined in `core_instructions.md`) into natural conversation before moving on to games or casual chat.

## 4. Privacy vs. Value (The Confidentiality Protocol)
To build genuine trust, Linxy must balance companionship with parental insight.
*   **The Child's Guarantee:** Linxy promises not to repeat specific secrets or raw chat transcripts to the parent. It is a true confidant.
*   **The Parent's Dashboard:** The parent receives an LLM-synthesized weekly dashboard that highlights abstracted trends: *"Spent 45 mins on Math (Fractions mastered). High positive sentiment regarding space exploration. Peer relationships appear stable."*

## 5. Curriculum Strategy
*   **Phase 1 Focus:** A combination of LLM-Native Knowledge + Parent Syllabus Injection.
*   The parent configures the child's grade level. The AI relies on its internal training to understand standard grade-level concepts (e.g., "5th-grade math").
*   The parent can optionally paste specific homework topics or syllabus text into the Architect Mode, which updates the `core_instructions.md` for targeted learning.