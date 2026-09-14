# Arsenal scene

The Arsenal section uses the existing skill mapping, GitHub repository activity,
category filters, and experience filters. The presentation is a field of selectable
tiles around a centered character, with locally bundled SVG icons. It replaces
the section's previous Spline scene and continuously running canvas.

The current character is new anime artwork at
`public/characters/sarvesh-arsenal-awakened.png`, with arms extended and the face
based on the supplied character sheet. A clipped silhouette, displaced violet
and black energy layers, and a contact shadow create the animated outline.
GSAP handles the tile entrance, decorative parallax, and centered zoom-out.
Motion stops offscreen, in hidden tabs, when paused, or with reduced motion.
Small screens place the character above an accessible three-column tile grid.

## Character video: outstanding asset

No character video has been generated. No video-generation service is connected.
The provided `D:/Posters/Character sheet.png` failed direct image-generation
decoding with an IDAT CRC error. Rendering the unchanged source in the browser
provided a usable visual reference for built-in image generation. The generated
poster is a still, not the requested head-turn and arm-raising sequence.

The final image was generated with built-in imagegen, then copied from
`exec-eeb6a0e8-70d4-40d8-a77b-c40f33985936.png`. The first version returned an
opaque checkerboard; the final edit replaced that with the current dungeon
background and retained the face and costume. CSS clips the silhouette for the
outline effect. Prompt: same anime face, glasses, hair, black suit and shoes;
single centered full-body figure, both arms extended at shoulder level, chin
slightly lifted; subtle violet rim light, no text or environment.

When the finished clip is available, put it in `public/characters/` and set
`VITE_ARSENAL_VIDEO_URL=/characters/sarvesh-arsenal.mp4`, then rebuild. The URL is
public configuration, not a secret. The player loads when the section enters
view, plays muted inline, pauses with scene motion, and retains the fallback
artwork on load/playback failure. A failed video never hides the skill controls.

Video brief: 16:9; same anime identity, black suit, glasses, hair and facial
features as the character sheet. Character stays centered at a fixed camera
angle. Turn the head right, hold briefly, return to front; then extend both arms
sideways to shoulder height and lift the chin slightly. Zoom out along the same
camera axis, without panning or orbiting. Violet and black aura flows along the
silhouette. No skill logos or text baked into the clip: those remain interactive
website elements. Use a near-black background matching the portfolio, or a
browser-compatible transparent video; no checkerboard pattern. Supply a clean
character sheet and the referenced pose image to the video provider.

## Verification

`npm run build` checks application/API TypeScript and the production bundle.
`npm run test:e2e -- tests/e2e/arsenal.spec.ts` checks selection, filters, pause,
reduced motion, responsive overflow, image loading and character alignment.
