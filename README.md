# 🌌 SYSTEM DECK // S-RANK SYSTEM DEVELOPER PORTFOLIO

Welcome to the **S-Rank Developer System Interface**. This is a premium, interactive, highly stylized web application themed after the *Solo Leveling* S-Rank Hunter System. Designed to showcase top-tier full-stack engineering, interactive 3D web graphics, and real-time API integrations.

---

## 🔮 Core System Features

### 1. **CursorLens 3D Masking Portal (Hero Portrait)**
*   A premium, custom-engineered dual-image overlay mask with a dynamic aperture clipping system (`CursorLens.tsx`).
*   Utilizes a subtractive masking pipeline (`baseMaskId` and `maskId`) to perfectly isolate layers, revealing a secondary cybernetic x-ray underlay (`beard image-inner-bdr.png`) when hovered, with **zero edge-silhouette ghosting**.
*   Bounded by a fluid, animated liquid SVG glow boundary with a floating responsive preview path.

### 2. **Spline 3D Scroll Parallax System (`gsap-scrolltrigger`)**
*   Full-bleed, responsive 3D WebGL canvases lazy-loaded using React Suspense (`@splinetool/react-spline`).
*   Configured with high-performance, GPU-accelerated **container wrapper parallax animations** via **GSAP ScrollTrigger**:
    *   **Hero Vortex:** Slides, zooms, and orbits **30°** on scroll depth.
    *   **Arsenal Torus:** Rotates **-40°** in the opposite direction on section entry to create massive dimensional depth.

### 3. **Live GitHub stats scanning (Arsenal)**
*   Integrates the GitHub Repositories API (`useGitHubRepos.ts`) using `@tanstack/react-query` to pull real-time developer statistics.
*   Dynamically boosts skill cards' proficiency bars (`+2%` per matching repository, capped at `95%`) with interactive loading indicators and custom category filtering.

### 4. **Recursive Google Drive Synchronization (Field Operations)**
*   Queries your Google Drive folder dynamically to populate the double-column event marquee (`Events.tsx`).
*   Implements an iterative **Breadth-First Search (BFS)** discoverer that crawls the root directory and discovers all subfolder IDs.
*   Fetches images from all nested subfolders using batch-chunk queries (`useDriveImages.ts`), continuously syncing in the background with a 15-second cache invalidation.

### 5. **Silent Quest Transmission (Contact Form)**
*   Wired with **Web3Forms** silent background mailing protocols (`Contact.tsx`).
*   Detects environment settings instantly: delivers a seamless, serverless green **SystemQuest Success Portal** in the background when active, with an elegant, stashed queue fallback to a `mailto:` launcher if offline.

---

## 🛠️ Quest Log (Tech Stack)

*   **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 5](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Interactivity & 3D:** [@splinetool/react-spline](https://github.com/splinetool/react-spline) + [GSAP 3](https://gsap.com/) (ScrollTrigger) + [Framer Motion 11](https://www.framer.com/motion/)
*   **Querying & APIs:** [@tanstack/react-query 5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

---

## 🧬 Project Directory Structure

```
├── .env                  # Secure environment variable keys
├── index.html            # Entrypoint & custom logo favicon config
├── package.json          # Dependency manifest
├── vite.config.ts        # Vite compiler & Tailwind v4 plugin bundler
├── public/
│   ├── logo.png          # Premium logo (Favicon & Footer image)
│   ├── outer image-bgr.png     # Portrait base cutout
│   └── beard image-inner-bdr.png  # Portrait reveal x-ray
├── src/
│   ├── App.tsx           # Global routing & React Query client wrapper
│   ├── main.tsx          # Virtual DOM renderer
│   ├── index.css         # Global variables, color palettes & animations
│   ├── data/
│   │   ├── driveImages.ts     # Pre-fetched offline fallback asset list
│   │   └── linkedinPosts.ts   # Core achievements activity deck
│   ├── hooks/
│   │   ├── useGitHubRepos.ts  # Live GitHub integration
│   │   └── useDriveImages.ts  # BFS Google Drive recursive scraper
│   └── components/
│       ├── Navbar.tsx     # Left-side retractable sidebar quest menu
│       ├── Hero.tsx       # Pad-optimized 3D landing screen & layout
│       ├── CursorLens.tsx # Custom aperture portal mask
│       ├── Skills.tsx     # Parallax Arsenal & dynamic progress bars
│       ├── Projects.tsx   # Project cards & scroll trigger decks
│       ├── Wins.tsx       # 3D Stack Carousel LinkedIn deck
│       ├── Events.tsx     # Marquee double-column field gallery
│       ├── Contact.tsx    # S-Rank quest submission & stashing console
│       └── Footer.tsx     # Height-optimized logo credit footer
```

---

## 🔑 Setup & Environment Configuration

Create a [`.env`](file:///h:/Program%20files/Portfolio/.env) file at the root of the project to initialize the System coordinates:

```env
# S-Rank System Environment Keys
VITE_GITHUB_TOKEN=your_github_personal_access_token
VITE_GOOGLE_API_KEY=your_google_cloud_api_key
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

### Unlocking Key Features:
*   **Web3Forms Access Key:** Set to your Web3Forms access key. Enables silent background form submissions with instant success alerts.
*   **Google API Key:** Required for recursive background synchronization with Google Drive folder `1ULYV5aIjArhpxQP_0V8slDRYkBNdBop2`. Falls back to a beautiful pre-cached offline grid (`driveImages.ts`) if inactive.
*   **GitHub Token:** Used to pull real-time statistics for projects and language counts. Falls back to default system values if inactive to prevent API rate limiting.

---

## 🏃 Local System Execution

Follow these commands in your shell to bootstrap and execute the system:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server (HMR Active)
```bash
npm run dev
```
The server will bind and hot-reload. Access the interface at **`http://localhost:3000`** (or Vite's designated active port).

### 3. Compile Production Bundle
```bash
npm run build
```
Generates a highly optimized, minified bundle inside the `dist/` directory with code splitting.

### 4. Local Production Preview
```bash
npm run preview
```
Runs a local web server to preview the built production bundle exactly as it will render on hosting platforms.

---

**Quest Status: ACTIVE // Ready for Guild Deployment.** 🛡️

## LinkedIn activity management

Wins & Activity now supports Supabase, Realtime, multi-image posts, and an authenticated `/admin/activities` editor. See [the setup and verification guide](docs/linkedin-activity-feed.md) for the migration, public environment variables, administrator allowlist, Storage policies, importing existing posts, and adding future activities without redeploying.
