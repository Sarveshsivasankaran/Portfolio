# 🌌 SYSTEM DECK // S-RANK SYSTEM DEVELOPER PORTFOLIO

Welcome to the **S-Rank Developer System Interface**. This is a premium, interactive, highly stylized web application themed after the *Solo Leveling* S-Rank Hunter System. Designed to showcase top-tier full-stack engineering, interactive 3D web graphics, and real-time API integrations.

---

## 🔮 Core System Features

### 1. **CursorLens 3D Masking Portal (Hero Portrait)**
* Custom-engineered dual-image overlay mask with a dynamic aperture clipping system (`CursorLens.tsx`).
* Utilizes a subtractive masking pipeline (`baseMaskId` and `maskId`) to cleanly isolate layers, revealing a secondary cybernetic x-ray underlay (`beard image-inner-bdr.png`) when hovered, with **zero edge-silhouette ghosting**.
* Framed by a fluid, animated liquid SVG glow boundary with responsive floating previews.

### 2. **Spline 3D WebGL & GSAP Scroll Parallax**
* Full-bleed, responsive 3D WebGL canvases lazy-loaded using React Suspense (`@splinetool/react-spline`).
* Configured with high-performance, GPU-accelerated **container wrapper parallax animations** via **GSAP ScrollTrigger**:
  * **Hero Vortex:** Slides, zooms, and orbits **30°** on scroll depth.
  * **Arsenal Torus:** Rotates **-40°** counter-directionally on section entry to create massive dimensional depth.

### 3. **Hall of Fame & 3D Interactive Record Capsules (`Wins.tsx`)**
* High-impact milestone showcase with horizontal carousel navigation, keyboard/touch support, and dynamic record counters.
* Powered by `FeaturedRecordCard.tsx` featuring:
  * **3D Card Tilt & Mouse Sheen:** Responsive gyroscope/cursor tilt with dynamic reflection highlights.
  * **Interactive Thumbnail Gallery:** Auto-cycling slides with page-flip motion transitions and direct selector buttons.
  * **Ultra High-Res Lightbox Modal:** Full-screen modal viewer with keyboard navigation and native aspect ratio adaptation (`certificate`, `photo`, `square`).
  * **Flagship Records Featured:**
    * 🌲 **World Record:** 326 students programming robots to plant the world's first robot-planted micro forest (Anna University / TIFA).
    * 👾 **TCS AI Immersion Hackathon:** Secured Rank 5 of 603 participants, Top 20 Best Solution Providers, corporate felicitation by TCS leadership, and selected for an internship opportunity at Tata Consultancy Services.
    * 🏛️ **AI Nexus 2026 EXPO:** Presented *Notezilla* full-stack platform directly to the Honourable Minister for AI of Tamil Nadu.
    * 🛡️ **Acentra Health "Build to Care" Hackathon:** Grand Finalist (Top 34 of 650+ teams across India) with *ClaimShield Nexus* FWA intelligence.
    * 📖 **Texplore Magazine 2026:** REC CSE Department Student Spotlight feature under the moniker *Solo-P-Leveller*.
    * 🏆 **SIH 2025 Winner:** Software Edition Internal Hackathon Top 50 winner with *Code-O-Philes*.
    * 👑 **Student Leadership:** Appointed Vice President (2026–2027) of Intellexa REC Club & SPOC lead for Titanium 2K26.
    * 🤖 **ICC World Cup Robotics:** National-level Cheering & Cleaning Robot project.
    * ✍️ **REC Official Website:** Featured front-page blog *"Beyond Grades"*.
    * 🎙️ **Codesapiens Tech Speaker:** Keynote speaker on productivity, purpose, and developer mastery.

### 4. **Hunter Profile & Community Leadership (`About.tsx`)**
* Cybernetic profile matrix highlighting core statistics, technical experience, and active roles.
* Interactive community cards detailing:
  * **Intellexa REC Club:** Vice President (2026–2027), Titanium 2K26 SPOC, HackRush Triple Podium Mentor, and website maintainer.
  * **CodeSapiens:** Speaker & Event Speaker Manager for Summer Fest 2026, Feb 2K26 Keynote Speaker, and D3 AI Mentorship Graduate.

### 5. **Live GitHub Stats Scanning (Arsenal & Skills)**
* Integrates GitHub REST API (`useGitHubRepos.ts`) using `@tanstack/react-query` to pull real-time developer metrics.
* Dynamically calculates repository stats and boosts skill proficiency bars (`+2%` per matching repository, capped at `95%`) with animated glow meters and category filters.

### 6. **Supabase Realtime Activity Stream (`WinsGallery.tsx`)**
* Real-time activity feed pulling authenticated accomplishments and media from **Supabase PostgreSQL** via Realtime subscriptions.
* Features multi-image collages, badge tags, external LinkedIn links, and fallback to pre-cached data (`linkedinPosts.ts`).
* Includes a protected admin management portal (`/admin/activities`) for adding, editing, and managing posts on the fly.

### 7. **Recursive Google Drive Synchronization (Field Operations)**
* Streams dynamic photo galleries for college events, hackathons, and workshops (`Events.tsx`).
* Implements an iterative **Breadth-First Search (BFS)** discoverer (`useDriveImages.ts`) that traverses nested Google Drive directories in batch chunks, complete with 15-second cache invalidation and offline fallbacks.

### 8. **Silent Quest Transmission (Contact Form)**
* Integrated with **Web3Forms** silent background mailing protocols (`Contact.tsx`).
* Emits a reactive **SystemQuest Success Portal** on completed submission, with automatic offline queuing and seamless `mailto:` fallback.

---

## 🛠️ Quest Log (Tech Stack)

| Layer | Technologies |
| :--- | :--- |
| **Core Framework** | [React 18.3](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) + [Vite 5](https://vitejs.dev/) |
| **Styling & System UI** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Cyberpunk Variables |
| **3D & Animation** | [@splinetool/react-spline](https://github.com/splinetool/react-spline) + [GSAP 3](https://gsap.com/) (ScrollTrigger) + [Framer Motion 11](https://www.framer.com/motion/) |
| **Backend & Realtime** | [Supabase](https://supabase.com/) (PostgreSQL & Realtime Client) |
| **State & Querying** | [@tanstack/react-query 5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/) |
| **Testing** | [Vitest 3](https://vitest.dev/) + [Playwright](https://playwright.dev/) + [@testing-library/react](https://testing-library.com/) |
| **Forms & Delivery** | [Web3Forms](https://web3forms.com/) |

---

## 🧬 Project Directory Structure

```
├── .env                          # Secure environment keys
├── index.html                    # Entry point & favicon config
├── package.json                  # Dependencies & execution scripts
├── vite.config.ts                # Vite bundler & Tailwind v4 compiler
├── public/                       # High-resolution media, posters & certificates
│   ├── logo.png                  # System logo & footer emblem
│   ├── outer image-bgr.png       # Hero base cutout
│   ├── beard image-inner-bdr.png # Hero cybernetic X-ray underlay
│   ├── tcs_immersion_page_*.jpg  # TCS AI Immersion Hackathon & Felicitation slides
│   └── ...                       # Event certificates, hackathon & magazine assets
├── docs/                         # Technical architecture documentation
│   ├── linkedin-activity-feed.md # Supabase feed & admin configuration
│   ├── linkedin-daily-sync.md    # Daily cron synchronization guide
│   ├── arsenal-scene.md          # 3D Arsenal graphics setup
│   └── project-universe.md       # Curated project matrix architecture
├── tests/                        # Vitest unit & integration test suites
│   ├── feed.test.tsx             # Supabase realtime feed tests
│   ├── projects.test.tsx         # Projects display & order tests
│   ├── activities.test.tsx       # Collage & activity item tests
│   └── ...                       # Admin & sync policies tests
└── src/
    ├── App.tsx                   # System router, routes & query client
    ├── main.tsx                  # Application bootstrap
    ├── index.css                 # Cyberpunk themes, variables & scanlines
    ├── data/
    │   ├── driveImages.ts        # Pre-cached Google Drive fallback photos
    │   └── linkedinPosts.ts      # Core achievements fallback dataset
    ├── hooks/
    │   ├── useGitHubRepos.ts     # Live GitHub REST API polling
    │   ├── useDriveImages.ts     # BFS Google Drive recursive scraper
    │   └── useLinkedInPosts.ts   # Supabase Realtime feed hook
    ├── lib/
    │   ├── activityAdmin.ts      # Supabase activity admin actions
    │   └── linkedinPosts.ts      # Authoritative post fetcher
    └── components/
        ├── Navbar.tsx            # Retractable quest menu sidebar
        ├── Hero.tsx              # Cyberpunk landing scene & layout
        ├── HeroNameReveal.tsx    # Glitch / reveal title typography
        ├── CursorLens.tsx        # Dynamic aperture portal mask
        ├── CustomCursor.tsx      # Hunter-themed animated crosshair
        ├── About.tsx             # Hunter profile & community leadership cards
        ├── Skills.tsx            # Arsenal progress meters & stats boost
        ├── ArsenalScene.tsx      # 3D Spline interactive tech torus
        ├── Projects.tsx          # Curated tactical project showcase
        ├── Wins.tsx              # Hall of Fame carousel & record slider
        ├── FeaturedRecordCard.tsx# 3D tilt card, thumbnail gallery & lightbox
        ├── WinsGallery.tsx       # Realtime LinkedIn activity stream
        ├── Events.tsx            # Marquee field operations gallery
        ├── Contact.tsx           # S-Rank quest transmission console
        └── Footer.tsx            # System coordinate credits footer
```

---

## 🔑 Setup & Environment Configuration

Create a [`.env`](file:///d:/Program%20files/Portfolio/.env) file at the root of the project to initialize the system coordinates:

```env
# GitHub API (stats scanning)
VITE_GITHUB_TOKEN=your_github_personal_access_token

# Google Drive API (event gallery synchronization)
VITE_GOOGLE_API_KEY=your_google_cloud_api_key

# Web3Forms API (silent contact form delivery)
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

# Supabase (realtime LinkedIn activity feed & admin)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Feature Fallback Logic:
* **Web3Forms:** Enables silent background form submissions. Automatically falls back to a stashed queue and `mailto:` launcher if unconfigured or offline.
* **Google API:** Synchronizes dynamic image folders. Gracefully falls back to bundled high-res offline image grids (`driveImages.ts`).
* **GitHub Token:** Queries repository counts and languages to dynamically scale skill proficiency bars. Falls back to default system values if rate-limited.
* **Supabase:** Subscribes to live database modifications. Falls back cleanly to authoritative static fallback posts (`linkedinPosts.ts`).

---

## 🏃 System Commands & Execution

Follow these commands in your shell to bootstrap and execute the system:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server (HMR Active)
```bash
npm run dev
```
The server will start with hot-module replacement at **`http://localhost:3000`** (or designated Vite port).

### 3. Run Test Suite
```bash
npm test
```
Executes the [Vitest](https://vitest.dev/) suite covering feed synchronization, admin policies, activities collage, and project ordering (40+ passing tests).

### 4. Compile Production Bundle
```bash
npm run build
```
Executes TypeScript type checking (`tsc && tsc -p tsconfig.api.json`) and bundles optimized production assets via Vite into `dist/`.

### 5. Local Production Preview
```bash
npm run preview
```
Serves the compiled production bundle locally to verify build performance, code-splitting, and routing.

---

## 📡 Documentation References

* [LinkedIn Activity Feed Guide](docs/linkedin-activity-feed.md) — Comprehensive guide on Supabase Realtime synchronization, Storage policies, and the `/admin/activities` dashboard.
* [LinkedIn Daily Sync Setup](docs/linkedin-daily-sync.md) — Serverless cron integration and automated feed ingestion specifications.
* [3D Arsenal Scene Architecture](docs/arsenal-scene.md) — Details on Spline runtime WebGL integration and GSAP triggers.
* [Project Universe Architecture](docs/project-universe.md) — Specifications for the 9 curated tactical projects and classification hierarchy.

---

**Quest Status: ACTIVE // Ready for Guild Deployment.** 🛡️⚡
