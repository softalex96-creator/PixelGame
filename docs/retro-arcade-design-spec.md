# PixelGame Retro Arcade Storefront — design specification

## Product decision

PixelGame is a **curated storefront for fictional digital game goods**, intended for players who want to locate a currency bundle, cosmetic skin, mod pack or tactical guide without navigating a seller marketplace. The single page job is to move a visitor from *“what do I need for this game?”* to a clear local-preview cart in one or two decisions. All transactions continue to be explicitly simulated.

## Original visual system

| Token | Value | Role |
| --- | --- | --- |
| CRT black | `#080814` | Primary page field and arcade-cabinet depth |
| Phosphor mint | `#21F6C3` | Primary action, active selection and positive status |
| Laser magenta | `#FF3F9E` | Skins and high-energy highlights |
| Cartridge gold | `#FFD166` | Guides, prices and attention cues |
| Cabinet indigo | `#5E4BFF` | Mods and panel elevation |
| Monitor white | `#F8F4FF` | High-contrast text and card faces |

**Typography:** `Press Start 2P` for compact Latin display labels, `Russo One` as its Cyrillic display fallback, `Chakra Petch` for readable body copy, and `IBM Plex Mono` for metadata. The chosen risk is a large interactive **Arcade Selection Deck**: four physical-looking cabinet buttons route the visitor to `Currency`, `Skins`, `Mods`, or `Guides`; the selected lane changes the hero readout and product rail, rather than merely recolouring a generic filter bar.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ PIXELGAME / SELECT A MISSION        search / language / cart │
├──────────────────────────────────────────────────────────────┤
│ NOW LOADING: YOUR NEXT UPGRADE     [original CRT arcade art] │
│ [SEARCH THE VAULT]       [OPEN ARCADE DECK]                   │
├──────────────────────────────────────────────────────────────┤
│ INSERT COIN:  [Currency] [Skins] [Mods] [Guides]              │
│ Active lane: clear product-type copy + transparent preview    │
├──────────────────────────────────────────────────────────────┤
│ FEATURED DROP: three cartridge cards                          │
├──────────────────────────────────────────────────────────────┤
│ BROWSE THE VAULT: game filters / price / original catalogue   │
│ product cards: type, game, format, delivery-preview, price   │
├──────────────────────────────────────────────────────────────┤
│ HOW THE ARCADE WORKS: 01 pick / 02 preview / 03 local order   │
└──────────────────────────────────────────────────────────────┘
```

## Catalogue taxonomy

| Product type | Buyer need | Example fictional products | Required card metadata |
| --- | --- | --- | --- |
| Currency | Start a run or refill an in-game wallet | `Neon Drift Credits`, `Star Siege Cells` | Amount, bonus, digital preview |
| Skins | Change an avatar, vehicle or loadout look | `Chromewave Helmet Skin`, `Solar Sprint Chassis` | Cosmetic slot, rarity tier, preview format |
| Mods | Alter mechanics or aesthetics in an original game world | `Turbo HUD Mod Pack`, `Dungeon Radio Expansion` | Compatibility label, version, setup guide included |
| Guides | Learn a route, build or system faster | `Boss Route Field Guide`, `Arcade Drift Manual` | Format, difficulty, last updated label |

The first release will contain sixteen original products—four in each type—spread across four fictional arcade worlds: **Neon Drift**, **Star Siege ’86**, **Ironwood Quest**, and **Circuit Brawl**. Product text will avoid claims of real delivery, official licensing, resale, or compatibility with third-party titles.

## Design constraints

The frontend should render with a deliberate CRT scanline texture only as a low-opacity decorative layer, preserve contrast and keyboard focus, and respect `prefers-reduced-motion`. Product artwork is original pixel-art-inspired imagery with **no embedded text**, no copied game logos and no reference-site assets. Shopify, remote product APIs, seller metadata and external checkout routes are removed from runtime; `LocalCartContext` and the simulated checkout remain the purchase model.

Final Neon Drift, Star Siege ’86, Ironwood Quest and Circuit Brawl artwork must each use a distinct abstract collectible-object silhouette and colour world instead of readable labels, logos, real game names or recognisable characters. The interface supplies titles, types and prices; images are decorative product-world art only. The final files must resolve from stable public CDN URLs so GitHub Pages never depends on `/manus-storage/` preview paths.

The final public CDN set is mapped as follows: Neon Drift → `rSurZwBdAuMnPVxI.png`, Star Siege ’86 → `jzjfnFcQWRiHsqZa.png`, Ironwood Quest → `xjpzxmIZbLDjppHN.png`, and Circuit Brawl → `AhhbVSAbjKvExeUl.png`. They are generated original retro-arcade artwork and have no application text overlaid into the image files.

Visual source-file verification began with Neon Drift and Star Siege ’86: the first presents an abstract chrome turbo engine over a cyan/magenta grid, and the second an abstract luminous orbital energy core. Neither contains readable text, logo treatments, legacy Loadout motifs or recognisable third-party game characters.

Ironwood Quest and Circuit Brawl were also individually inspected. Ironwood Quest uses an abstract moss-and-rune shrine around an emerald crystal; Circuit Brawl uses an abstract circuit gauntlet and floating token in an arcade frame. Neither contains readable wording, game/company logos, old Loadout artwork or recognisable third-party characters. All four source files are distinct 1920×1920 original PNGs and their public CDN URLs are covered by the desktop/mobile delivery smoke test.
