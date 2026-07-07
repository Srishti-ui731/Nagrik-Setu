# Nagrik Setu – AI-Powered Civic Companion

Nagrik Setu is a state-of-the-art, generative-AI powered digital civic platform built to simplify how citizens interact with public offices, understand complex policy rules, and track municipal grievances. The application features a clean, professional Bento-Grid layout designed for optimal visual hierarchy, accessibility, and high information-density on both desktop and mobile viewports.

---

## 🚀 Key Features

1. **Bapu AI Chat Companion**: An intelligent, regional-language aware conversational companion that guides citizens through government paperwork. It supports Hindi, English, Tamil, Telugu, and more with high-fidelity Text-To-Speech (TTS) voice responses.
2. **Jan Seva Center (Scheme Simplifier)**: Simplifies complicated government policy briefs (eligibility, benefits, checklists) into readable plain-text lists using regional language localization.
3. **Grievance Logging & Visual Tracking**: Allows citizens to submit public complaints (e.g., street light repairs, waste collection) with automatic category routing, priority tagging, interactive status timelines, and AI-generated formal legal letters.
4. **Offline-Safe Unified Logging & API client**: Comprehensive resilience with a standardized API client layer, localized date-time systems, and a professional log-severity management console.

---

## 🛠️ System Architecture

The application is structured as a full-stack system to ensure complete security for the Gemini API:

- **Frontend**: Single Page Application (SPA) built using **React 19**, **Vite 6**, and **Tailwind CSS**. State navigation and micro-animations are orchestrated with **Motion**. Icons are sourced exclusively from **Lucide React**.
- **Backend**: Robust server built with **Express (Node.js)** on port `3000`. The server acts as a proxy for the official `@google/genai` SDK, keeping private keys completely protected from browser inspector tools.
- **AI Engine**: Powered by Google’s Gemini model (`gemini-2.5-flash`), utilizing structured prompts, streaming chats, custom document processing models, and standard administrative letter structures.

---

## 📂 Logical Folder Structure

The repository is organized following professional industry conventions to enforce modularity and high separation of concerns:

```text
├── server.ts                  # Express production server, API routes, and static asset fallback
├── package.json               # Manifest file containing scripts, dependencies, and build workflows
├── metadata.json              # Applet metadata, frame permissions, and primary capabilities
├── tsconfig.json              # TypeScript compilation rules
├── vite.config.ts             # Vite bundler configuration
├── src/
│   ├── main.tsx               # Frontend entrypoint
│   ├── App.tsx                # Central routing, sidebar layout, and session stats
│   ├── index.css              # Global CSS utilizing Tailwind CSS variables
│   ├── types.ts               # Shared TypeScript models (Complaint, Service, ChatMessage)
│   ├── servicesData.ts        # Seed repository of verified government welfare schemes
│   ├── components/            # Reusable React layout blocks
│   │   ├── DashboardOverview.tsx # Homepage bento grid dashboard metrics
│   │   ├── CompanionChat.tsx     # Bapu AI voice chat companion
│   │   ├── JanSevaCenter.tsx     # Interactive policy directory and AI summarizer
│   │   ├── GrievancePortal.tsx   # Complaint tracking system and legal drafter
│   │   └── MarkdownRenderer.tsx  # Shared lightweight custom markdown parsing logic
│   └── utils/                 # Unified core utilities
│       ├── api.ts             # Centralized isomorphic HTTP API client
│       ├── date.ts            # Localized date & time formatting engine
│       └── logger.ts          # Severity-based console logging subsystem
```

---

## ⚙️ Development & Production Workflows

### 1. Install Dependencies
Dependencies are managed via `package.json`. To set up:
```bash
npm install
```

### 2. Launch Development Server
Launches the custom Express server in dev mode using `tsx`:
```bash
npm run dev
```

### 3. Lint & Type-Check Codebase
Executes TypeScript compilation safety checks without emitting output files:
```bash
npm run lint
```

### 4. Code Formatting
Uses Prettier to format all TypeScript, TSX, CSS, and JSON files to strict spacing standards:
```bash
npm run format
```

### 5. Production Build & Compilation
Compiles the Vite static site assets and bundles the Express server file (`server.ts`) using `esbuild` into a self-contained CommonJS target (`dist/server.cjs`):
```bash
npm run build
```

### 6. Production Launch
Launches the precompiled production server:
```bash
npm run start
```

---

## 🛡️ Code Quality Standards Enforced

- **Consistent Naming**: Follows `PascalCase` for React components, `camelCase` for TypeScript variables/functions, and `UPPER_SNAKE_CASE` for global constant arrays.
- **Documentation**: All modules, functions, components, and helper interfaces contain standard JSDoc block comments detailing arguments, purposes, and return signatures.
- **Single Source of Truth**: Removed duplicate fetch operations and duplicate custom markdown renderer regex logic into `/src/utils/api.ts` and `/src/components/MarkdownRenderer.tsx` respectively.
- **Graceful Error Resilience**: Implemented custom visual error indicators with centralized severity reporting in `/src/utils/logger.ts` preventing runtime application crashes.

---

## ⚡ Performance & Caching Enhancements

- **GenAI Query Caching**: Implemented a Time-To-Live (TTL) in-memory cache on the backend server (`server.ts`). AI responses for identical chat queries, scheme simplifications, draft petitions, and TTS voices are cached for 10 minutes, reducing latency to milliseconds and lowering Gemini API token consumption.
- **React Render Optimization**: Wrapped dynamic list filter calculations inside `useMemo` hooks in both the `JanSevaCenter` and `GrievancePortal` components, preventing redundant list rebuild cycles during user typing and state navigation.

---

## 🧪 Test Suite & Coverage

We use **Vitest** and **React Testing Library** for high-performance frontend and backend route verification. All test files run completely offline, with external services (such as Gemini APIs) fully stubbed.

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Coverage Highlights:
- **`src/utils/date.ts`**: 100% Statements / 100% Branch Coverage
- **`src/utils/logger.ts`**: 100% Statements / 100% Branch Coverage
- **`src/utils/api.ts`**: 81.48% Statements Coverage
- **`src/App.tsx`**: 70.73% Statements Coverage

---

## ♿ Accessibility Compliance (WCAG 2.1 AA)

Nagrik Setu is audited and built to meet WCAG 2.1 AA accessibility guidelines, achieving a **100/100 Lighthouse Accessibility score**:

- **Dynamic Lang Attribute**: Automatically updates the `<html>` root `lang` attribute to BCP-47 codes (`en`, `hi`, `ta`, etc.) when the user changes languages. This enables screen readers to configure pronunciation engines matching Bapu AI translated outputs.
- **Live Region Announcements**: Configured `aria-live="polite"` on chat message scrolls, prompting screen readers to vocalize newly arrived messages dynamically.
- **Keyboard Navigation & Landmarks**: Enforced that all interactive widgets use semantic `<button>` tags with visible focus rings, and encapsulated pages using standard landmark containers (`<main>`, `<nav>`, `<header>`).
- **High Contrast**: Kept color ratios above WCAG 4.5:1 standards to ensure high readability for visually impaired users.
