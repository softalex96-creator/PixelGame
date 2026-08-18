# PixelGame Loadout Console — redesign brief

## Product focus

PixelGame is a bilingual local-preview marketplace for fictional game-currency bundles. Its audience is a player comparing a few relevant packs quickly. The home page has one job: move that player from a recognised game world to a transparent local-preview cart without implying real payment, official partnership, stock, or delivery.

## Original direction

The design takes only the **information pattern** observed in the reference: intent-first navigation, a prominent fast-selection panel, compact discovery cards, and grouped product rails. It does not reproduce its typography, tiles, artwork, service logos, branding, price claims, or visual geometry.

| Design token | Choice | Purpose |
| --- | --- | --- |
| `midnight` | `#090B19` | Quiet baseline behind commerce decisions. |
| `console` | `#12172B` | Raised control surfaces and cards. |
| `volt` | `#51F2E8` | Primary action and active game signal. |
| `ion` | `#8B6CFF` | Secondary emphasis and Arcane world. |
| `flare` | `#FF8B68` | Neon Circuit emphasis and offer metadata. |
| `cloud` | `#F6F8FF` | High-contrast reading colour. |

The typography retains Space Grotesk for display but uses it in tighter, wide labels; DM Sans remains the body face. The signature is an original **Loadout Console**: a selected fictional world, a bundle selector, a non-payment local-preview action, and clearly declared simulated flow in one composed control surface.

## Homepage composition

```text
  intent rail / search / account controls
  [original loadout-console hero] [original abstract 3D game-world art]
  world directory: NovaVerse / Arcane Realms / Neon Circuit
  “popular loadouts” compact cards + catalog controls
  full catalog with filters, favourite controls, and local-cart actions
  trust/preview facts + featured worlds
```

The interaction hierarchy is game world → bundle → local cart. The hero uses no sales discount, provider logo, or real-payment statement. Catalogue images will be newly generated abstract world art, with no third-party characters, icons, or game assets.

## Self-critique

The risk of a generic neon marketplace is countered by treating the module as a console rather than a hero illustration with floating cards. The remainder of the page stays structured and restrained: the selected world drives the product choices, and the separate local-preview disclosure remains visible at the point of action.

## Assets

- Hero: `/manus-storage/pixelgame-arcade-loadout-hero_bdf826df.png`
- NovaVerse: `/manus-storage/pixelgame-world-novaverse-v2_89f75f77.png`
- Arcane Realms: `/manus-storage/pixelgame-world-arcane-v2_d0db31c9.png`
- Neon Circuit: `/manus-storage/pixelgame-world-neon-v2_f2a96e53.png`

## Visual verification

The revised home page was reviewed at 1280×720 and 375×812. The desktop composition preserves a readable hero, elevated Loadout Console, three-world directory, compact recommendation rail, full nine-item catalogue, and account/cart paths. At 375px the console collapses to a single column, the three game-world controls wrap without horizontal overflow, and each catalogue card remains readable in a one-column sequence. The first batch of individual card illustrations returned failure placeholders; the final catalogue replaces that temporary shared-art fallback with three newly generated original, world-specific assets. The final responsive pass confirmed distinct NovaVerse crystal, Arcane Realms moonstone, and Neon Circuit energy-cell imagery across the desktop and mobile world directory and product cards.

The final NovaVerse and Arcane Realms source files were individually verified as non-placeholder PNGs at 2176×1632. They are visually distinct: NovaVerse uses an aqua crystalline power core in an orbital chamber, while Arcane Realms uses a violet moonstone coin cache inside an abstract archive. The rendered desktop and mobile checks show these distinct assets resolving in the catalogue rather than temporary loading tiles.

The Neon Circuit source file was also individually verified as a non-placeholder 2176×1632 PNG. It depicts an original coral-orange energy cell within a cyan circuit ring, making it visibly distinct from the NovaVerse crystal and Arcane Realms coin cache. Together with the rendered desktop/mobile checks, this confirms all three production asset URLs resolve to final original artwork.

The repeatable `pnpm verify:loadout-assets` browser smoke test passed for both 1280×720 and 375×812. It asserts the exact three final asset filenames and their order in the world directory, verifies that all three URLs are distinct and have completed with non-zero intrinsic dimensions, and confirms each directory asset also appears in the product cards.
