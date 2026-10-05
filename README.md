# pixels-to-products-cloudinary-ai-hackathon-2026-shadow
Hackathon team repository for Shadow - [hackindia-team:pixels-to-products-cloudinary-ai-hackathon-2026:shadow]
# Dukaan Studio

**One phone photo in. A studio-quality, multi-platform, tagged, searchable, video-ready product listing out — powered end to end by Cloudinary.**

Built for *Pixels to Products — Cloudinary AI Hackathon 2026* (HackIndia × Cloudinary), track: **Your Media-Savvy Startup**.

# Live Demo URL
dukaan-studio.vercel.app

## The problem

India's home-based sellers — boutique resellers, home bakers, jewellery makers,
tailors — sell through WhatsApp Status and Instagram, not a storefront app.
They take one so-so photo on a budget phone and post the same image
everywhere. No photographer, no Photoshop, no time.

## What this does

Upload one raw product photo and Cloudinary does the rest:

| Step | Cloudinary capability |
|---|---|
| Upload from a phone | Upload Widget (unsigned, direct-to-cloud) |
| Studio background pass | `e_improve` / `e_background_removal` (AI add-on) |
| Multi-platform crop pack | `c_fill,g_auto` content-aware cropping |
| Fast delivery on cheap data | `f_auto,q_auto` automatic format & quality |
| Auto tags & structured metadata | Auto-tagging add-on + `context` metadata |
| Searchable catalog | Client-side search over real Cloudinary-returned tags |
| Shareable reel | In-browser slideshow built from Cloudinary-delivered images |

Nothing here is mocked — every image on screen is a real Cloudinary delivery
URL, generated live.

## Run it (5 minutes)

### 1. Create a free Cloudinary account
No card required: https://cloudinary.com

### 2. Create an unsigned upload preset
Console → **Settings → Upload → Upload presets → Add upload preset**
- Signing Mode: **Unsigned** (required — this app never touches your API
  secret; uploads go straight from the browser to Cloudinary)
- Optional, to unlock the AI features: in the same preset, turn on
  **Auto-tagging** and add a **Categorization** add-on, and set default
  **Context** metadata if you want it applied automatically. Unsigned
  uploads only honor settings baked into the preset, by design — the
  browser is never trusted with anything that costs money.

### 3. (Optional) Enable AI Background Removal
Console → **Add-ons → AI Background Removal** → Enable. If you skip this,
the app still works — the background-removal toggle gracefully falls back
to the enhance-only pass and tells the seller why.

### 4. Install and run

```bash
npm install
npm run dev
```

Open the app, click the gear icon (top right), paste in your **cloud name**
and **upload preset**, and start uploading. Settings are saved to
`localStorage`, so this is a one-time step per browser.

### 5. Build & deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages — it's a
static site, no backend required.

## Architecture

Deliberately backend-free: the browser talks to Cloudinary directly via an
**unsigned** upload preset (safe by design — no API secret is ever shipped
to the client), and the "database" is just Cloudinary public IDs plus
seller-entered metadata, cached in `localStorage` so the catalog survives a
refresh. There is nowhere to hide — every feature is either a Cloudinary
transformation URL or a few lines of plain React state.

```
src/
├── App.jsx                 tab shell + upload orchestration
├── config.js                Cloudinary cloud name / preset (localStorage)
├── lib/cloudinary.js        upload widget wiring + transformation URL builders + catalog store
└── components/
    ├── Hero.jsx              landing state (CSS/SVG illustration, no stock imagery)
    ├── StudioResult.jsx       before/after, background-removal toggle, crop pack, tag form
    ├── Catalog.jsx            search + filter over saved listings
    ├── ReelMaker.jsx          crossfade slideshow from selected listings
    ├── SettingsPanel.jsx      Cloudinary account config
    └── icons.jsx              hand-rolled SVG icon set (no emoji, no icon-library dependency)
```
## Pitch line

> Dukaan Studio turns one phone photo from a home-based seller into a
> complete, platform-ready listing — studio background, a crop pack sized
> for WhatsApp Status, Instagram, and Facebook Marketplace, an auto-tagged
> searchable catalog entry, and a short shareable video reel — in under a
> minute, entirely powered by Cloudinary's upload, AI, transformation, and
> delivery pipeline.
