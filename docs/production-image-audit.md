# Production image audit — PixelGame

## Finding

The published storefront refers to artwork through relative paths under `/manus-storage/`. Those paths resolve within the managed local preview but are not part of the GitHub Pages deployment artifact. On 18 August 2026, both production checks returned HTTP `404`:

| Requested production asset | Result |
| --- | --- |
| `/manus-storage/pixelgame-arcade-loadout-hero_bdf826df.png` | `404` |
| `/manus-storage/pixelgame-world-novaverse-v2_89f75f77.png` | `404` |

The repeatable Playwright asset smoke test also failed on `https://pixelgame.pro/` because the image elements completed without a non-zero intrinsic image size. This matches the broken-image behaviour reported by the user.

## Remediation

The site now uses stable absolute public CDN URLs rather than paths served only by the managed preview. The generated originals were uploaded from `/home/ubuntu/webdev-static-assets/`; their absolute URLs replace every `/manus-storage/` reference in the hero and product data. The regression test now asserts the exact production CDN URLs after the GitHub Pages deployment.

## Post-deployment observation

After deployment commit `1211276`, a cache-busted browser visit to `https://pixelgame.pro/?release=1211276#/` showed the hero artwork rendered successfully. This confirms that the published page can load the new public CDN path; the automated production smoke test remains the authoritative verification for the hero and all three card-world assets across both viewports.
