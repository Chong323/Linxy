# PWA Implementation Plan for iOS Beta

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable Linxy to be installed on iOS home screen as a native-like app for local beta testing.

**Architecture:** Create a basic PWA with manifest.json and iOS-specific meta tags. This allows "Add to Home Screen" on iOS Safari, providing full-screen native app experience.

**Tech Stack:** Next.js static generation, manifest.json, service worker (optional for offline)

---

### Task 1: Create manifest.json

**Files:**
- Create: `frontend/public/manifest.json`

**Step 1: Write the manifest file**

```json
{
  "name": "Linxy - The Digital Bridge",
  "short_name": "Linxy",
  "description": "AI-powered educational companion for children",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add frontend/public/manifest.json
git commit -m "feat: add PWA manifest.json"
```

---

### Task 2: Add iOS meta tags to layout

**Files:**
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Update layout.tsx with iOS meta tags**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linxy - The Digital Bridge",
  description: "AI-powered educational companion for children",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Linxy",
  },
  icons: {
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/src/app/layout.tsx
git commit -feat: add iOS PWA meta tags to layout
```

---

### Task 3: Create PWA icons

**Files:**
- Create: `frontend/public/icon-192.png`
- Create: `frontend/public/icon-512.png`

**Step 1: Generate simple icons**

Since we need actual PNG files, create minimal placeholder icons using a simple approach:

```bash
# Check if ImageMagick is available
which convert
```

If available, create simple icons. If not, the user can add icons manually later.

**Step 2: Commit placeholder (or skip if creating manually)**

```bash
git add frontend/public/
git commit -m "feat: add PWA icons"
```

---

### Task 4: Verify PWA works

**Step 1: Test locally**

```bash
cd frontend && npm run dev
```

**Step 2: Open Safari on iOS simulator or device**

1. Navigate to http://[your-local-ip]:3000
2. Tap Share button
3. Tap "Add to Home Screen"
4. Open from home screen - should be full screen

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: complete PWA implementation for iOS beta"
```

---

### Task 5: Update ROADMAP.md

**Files:**
- Modify: `ROADMAP.md`

**Step 1: Mark Task 6 as complete**

```bash
git add ROADMAP.md
git commit -m "docs: mark PWA implementation complete"
```
