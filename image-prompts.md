# Image Generation Prompts — Project Card Set

Target: 16:9 landscape, ~1600px wide. Works with Midjourney, DALL-E, Ideogram,
or Gemini. After generating: save into `src/images/`, convert to WebP, and wire
the import in `src/components/config.ts`.

## Status

| imageKey            | Project                              | Image      |
| ------------------- | ------------------------------------ | ---------- |
| `clinical_llm`      | Fine-Tuning a 3B Clinical LLM        | ✅ done     |
| `systematic_review` | Streamlining Paper Selection         | ✅ done     |
| `breast_cancer`     | Breast Cancer Detection (MDST)       | ✅ done     |
| `bfp_vision`        | Image-to-Item Identification         | ✅ done     |
| `bfp_pricing`       | Automated Item Pricing               | ✅ done     |
| `blueprints`        | Inventory Analytics Dashboard        | ✅ done     |
| `pop_health`        | Population Health Web Scraping       | ✅ done     |

---

## 1. `breast_cancer` — Breast Cancer Detection

Two style options. **Option A** matches the six existing card images (navy +
violet/cyan) so the grid stays uniform today. **Option B** matches the site's
new design system (near-black + teal) — only use it if you plan to regenerate
the whole set (see below), otherwise one card will look off.

### Option A — match existing set (recommended for now)

> A stylized microscope slide tile splitting into a small grid of glowing tissue
> patch squares, flowing through a translucent neural network layer and branching
> into two paths - first into four subtype nodes, then converging into a final
> highlighted classification node with a checkmark. Minimalist isometric digital
> illustration on a deep navy background (#0a0d1a), accent colors of soft violet
> (#9b72cf) and bright cyan (#00d4ff), one soft pink accent on the tissue
> patches, subtle glow, clean geometry, generous negative space, single focal
> point, no text, no words, no letters, no numbers anywhere in the image.

### Option B — match new site theme

> A stylized microscope slide tile splitting into a small grid of softly glowing
> tissue patch squares, flowing through a translucent neural network layer and
> branching into two paths - first into four subtype nodes, then converging into
> a final highlighted classification node with a checkmark. Minimalist isometric
> digital illustration on a near-black blue-grey background (#0b0e13), single
> accent color of soft teal (#2dd4bf) with muted slate-grey (#8b96a8) secondary
> elements, one desaturated rose accent on the tissue patches, matte surfaces
> with faint glow, clean geometry, generous negative space, single focal point,
> no text, no words, no letters, no numbers anywhere in the image.

Current asset: `src/images/breast_cancer.webp`, wired through the
`breast_cancer` image key.

---

## 2. `clinical_llm` — Fine-Tuning a 3B Clinical LLM

The paper-ring artwork is used by the **Streamlining Paper Selection** project.
These prompts depict fine-tuning instead. Same two style options: **Option A** keeps the current
navy/violet set uniform, **Option B** matches the new site theme (use only with
a full-set refresh).

### Option A — match existing set

> A large faceted crystal core representing a language model, wrapped in thin
> translucent adapter layers glowing brighter than the core, a stream of
> stylized clinical documents and medical chart tiles flowing into it from the
> left, small glowing tuning dials and a descending loss-curve line etched in
> light beside it, the refined output emerging on the right as a single compact
> brighter crystal. Minimalist isometric digital illustration on a deep navy
> background (#0a0d1a), accent colors of soft violet (#9b72cf) and bright cyan
> (#00d4ff), subtle glow, clean geometry, generous negative space, single focal
> point, no text, no words, no letters, no numbers anywhere in the image.

### Option B — match new site theme

> A large faceted crystal core representing a language model, wrapped in thin
> translucent adapter layers glowing brighter than the core, a stream of
> stylized clinical documents and medical chart tiles flowing into it from the
> left, small glowing tuning dials and a descending loss-curve line etched in
> light beside it, the refined output emerging on the right as a single compact
> brighter crystal. Minimalist isometric digital illustration on a near-black
> blue-grey background (#0b0e13), single accent color of soft teal (#2dd4bf)
> with muted slate-grey (#8b96a8) secondary elements, matte surfaces with faint
> glow, clean geometry, generous negative space, single focal point, no text,
> no words, no letters, no numbers anywhere in the image.

Current asset: `src/images/clinical_llm.webp`, wired through the `clinical_llm`
image key.

---

## Optional — full-set refresh to match the redesign

The site now uses a teal-on-near-black dark theme and a clinical white light
theme; the existing navy/violet images read slightly off-palette, especially on
the light theme. If you want a matching set, regenerate all seven with this
shared style block appended to every prompt:

> Minimalist isometric digital illustration on a near-black blue-grey background
> (#0b0e13), single accent color of soft teal (#2dd4bf), secondary elements in
> muted slate-grey (#8b96a8), matte surfaces with faint glow, clean geometry,
> generous negative space, single focal point, no text, no words, no letters,
> no numbers anywhere in the image.

Subject lines (same as the originals):

1. `clinical_llm` — Option B prompt in section 2 above (fine-tuning
   subject).
2. `systematic_review` — A stream of stylized research papers flowing through a
   translucent sorting gate, accepted papers stacking into a neat glowing pile
   on one side, rejected ones drifting dimly to the other, thin decision-path
   lines.
3. `breast_cancer` — Option B prompt above.
4. `bfp_vision` — An open cardboard donation box containing stylized medical
   supplies (gauze roll, stethoscope, packaged syringe), a translucent scanning
   plane passing over the box, glowing bounding-box outlines snapping onto each
   item, thin lines connecting them to neat blank inventory cards floating to
   the right.
5. `bfp_pricing` — A single stylized medical supply item on a small glowing
   pedestal, three translucent marketplace result cards floating around it,
   their light beams converging into one bright price tag with a checkmark,
   faint rising graph line in the background.
6. `blueprints` — An isometric warehouse of small glowing shelves and boxes
   transforming on the right side into floating translucent dashboard panels
   with bar charts, a flowing supply route line connecting warehouse to
   destination markers.
7. `pop_health` — A stylized map of scattered glowing hospital building icons
   connected by thin light lines converging into a single organized database
   cylinder, small spider-web threads sweeping across the map suggesting
   automated collection.

---

## Tips

- Generate all images in one session with the same tool so the style stays
  consistent; keep the same aspect ratio so the grid crops uniformly.
- Generate 2–4 variants per prompt, pick the most minimal one.
- If a result is too busy: append "extremely minimal composition, fewer objects".
- If text sneaks in anyway, regenerate — generators mangle words; the site
  supplies real labels.
