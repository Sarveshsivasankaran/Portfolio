# Project universe

The existing Projects section now presents the live GitHub repositories on three curved tiers around Sarvesh's illustrated character. All 18 current repositories fit in one scene. Additional repositories use groups of 18; the List view shows the complete filtered collection. Search, language filtering, and sorting apply to both views. Selecting a panel reveals its full title, description, repository link, and available demo link below the scene.

The layout retains the site's existing CSS color variables and fonts. The panels are designed repository illustrations, not screenshots of the websites. CSS perspective supplies depth without another Spline canvas. The character has a gentle breathing/sway animation, the floor rings shimmer, and GSAP fades in the panels. Motion stops outside the viewport, can be paused, and respects reduced-motion preferences. Arrow keys, Home, and End move between panels. On phones the panels become a two-column wall with the character at its base.

## Character asset

Saved at `public/characters/sarvesh-projects.png` using the built-in image-generation tool, derived from the user's character sheet. The final raster has a dark background; CSS clips its silhouette for integration with the scene. The original reference sheet is unchanged.

Generation prompt: “Create a single transparent-background character asset based on the supplied character reference sheet (the South Asian man with wavy dark hair, clear rectangular glasses, black tailored suit, white shirt and black shoes). Preserve the same anime illustration style and character identity. Full-body view FROM BEHIND, facing away from the camera, confidently standing with feet apart, head turned only slightly right to reveal a hint of glasses/profile, arms relaxed by sides. Show all shoes and full hair, no cropping. Cool subtle blue-violet rim lighting. Center the single character in a tall portrait canvas with modest empty margins. No floor, scenery, project cards, lettering, or other people.”

Final edit prompt: “Preserve the character, pose, full-body framing, glasses, black suit, blue-violet rim light and clean anime style unchanged. Remove all checkerboard background and its wavy artifacts. Replace it with a completely uniform flat solid very dark navy RGB(10,10,18), hex #0A0A12, edge to edge. No checkerboard, pattern, texture, gradients, floor, background shadow, glow, or text. Keep the full character from hair to both soles. This background replacement is the only change.”

## Verification

`npm test` checks filtering, paging, list completeness, keyboard selection, and safe external links alongside the existing tests. `npm run test:e2e -- tests/e2e/projects.spec.ts` verifies desktop, 390px phone, and 768px tablet interactions, no horizontal overflow, asset loading, and reduced motion. `npm run build` checks frontend and API TypeScript and builds the production assets.

An isolated preview using the real GitHub feed is available at `/tests/e2e/harness.html?view=projects` while running Vite. The complete portfolio uses the updated section at `/#projects`.
