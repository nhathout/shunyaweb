# Sasha — Portfolio

Personal site for **Alexandra "Sasha" Petrovicheva**: an editorial "magazine" portfolio built
around her path from AI governance and business strategy to an MBA, consulting, and law.
Static site, no build step, deployed to GitHub Pages by GitHub Actions.

## The chapters

| # | Page | File | What's on it |
| - | ---- | ---- | ------------ |
| — | Cover | `index.html` | Title, full name, cover lines, chapter links, résumé download, socials, insta grid, portrait |
| 1 | My Story | `pages/my-story.html` | Profile, at-a-glance facts, three story sections, the 2019 → 2027 timeline |
| 2 | AI & Governance | `pages/ai-governance.html` | Wellington co-op (rotation, prototype, controls), agentic-AI research, toolkit |
| 3 | Strategy & Brand | `pages/strategy-brand.html` | Flip-card board of strategy, brand and content work, with filters |
| 4 | Leadership & Impact | `pages/leadership-impact.html` | Leadership map (six roles), how she leads, where it leads |
| 5 | Community & Service | `pages/community-service.html` | Service map, campus circles, notes on service |
| 6 | Law & Advocacy | `pages/law-advocacy.html` | Legal internship, policy research, why law (and why later) |
| 7 | The Next Chapter | `pages/next-chapter.html` | MBA → consulting → law roadmap, the five-way intersection, contact |

The "contents" menu and the previous/next links at the bottom of every chapter are generated from
the `CHAPTERS` list at the top of [scripts/main.js](scripts/main.js). To rename or reorder a
chapter, edit that list and the matching link on the cover ([index.html](index.html)).

## Adding photos

Every photo spot is a template. Until its file exists it shows **"✦ photo to add"**, a short
description of the photo that belongs there, and the exact file path. Save a photo at that path
and it appears automatically; no code changes are needed.

- JPG, about 1600px on the long side, under ~500 KB. The shape column says which orientation fits.
- The cover portrait is a PNG cut-out with a transparent background.
- Nothing confidential: no work screens, documents, badges or internal decks (Wellington especially).

| Page | Save as | What to send | Shape |
| ---- | ------- | ------------ | ----- |
| Cover | `assets/images/insta-1.jpg` | Sasha on campus in Boston (square) | square |
| Cover | `assets/images/insta-2.jpg` | TEDxNortheasternU event day (square) | square |
| Cover | `assets/images/insta-3.jpg` | Southern California, outdoors (square) | square |
| Cover | `assets/images/insta-4.jpg` | A NextWork Build & Brew session (square) | square |
| Cover | `assets/images/insta-5.jpg` | With friends in Boston (square) | square |
| Cover | `assets/images/insta-6.jpg` | A close-up detail: desk, notes or a book (square) | square |
| Cover | `assets/images/portrait.png` | A full-height portrait of Sasha (vertical), as a cut-out PNG with a transparent background | full-height cut-out PNG |
| My Story | `assets/images/my-story/hero-los-angeles.jpg` | A throwback photo of Sasha in the Los Angeles area (horizontal) | horizontal 5:4 |
| My Story | `assets/images/my-story/hero-boston.jpg` | A recent candid photo of Sasha in Boston: campus or a city street (horizontal) | horizontal 5:4 |
| My Story | `assets/images/my-story/portrait.jpg` | A portrait of Sasha outdoors in Southern California (vertical) | vertical 4:5 |
| My Story | `assets/images/my-story/detail.jpg` | A close-up detail: a keepsake, a favorite book or a corner of her desk (square) | square |
| My Story | `assets/images/my-story/boston-friends.jpg` | Sasha with friends in Boston: campus, the Charles or a city street (horizontal) | wide 16:10 |
| AI & Governance | `assets/images/ai-governance/wellington-office.jpg` | Sasha at Wellington Management in Boston — the lobby, the building entrance or a team moment (vertical). No screens, documents, badges or anything confidential in frame. | vertical 4:5 |
| Strategy & Brand | `assets/images/strategy-brand/tjx.jpg` | A public TJ Maxx social post or campaign visual Sasha contributed to, or a photo of her at TJX in Framingham — nothing internal or confidential (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/umg.jpg` | Sasha at UMG Technologies, or the company’s public logo — nothing internal (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/minted-supply.jpg` | A published Minted Supply post or product photo from May – June 2025 (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/tedx-media.jpg` | A TEDxNortheasternU media piece Sasha made: a published speaker graphic, event poster or social post (vertical) | vertical |
| Strategy & Brand | `assets/images/strategy-brand/idea.jpg` | A photo from an IDEA event or pitch night, or a public IDEA post Sasha made (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/b-plus.jpg` | A B+ Foundation post Sasha published, or a photo from a chapter event on campus (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/iv-today.jpg` | A published IV Today post or graphic from summer 2024, or the IV Today logo (horizontal) | horizontal |
| Strategy & Brand | `assets/images/strategy-brand/photography.jpg` | One of Sasha’s own photographs from her time as Head Photographer for the Business of Entertainment Club (horizontal) | horizontal |
| Leadership & Impact | `assets/images/leadership-impact/tedx-media-team.jpg` | Sasha with the TEDxNortheasternU media team at the event: on stage, backstage or at the media table (vertical) | vertical 4:5 |
| Leadership & Impact | `assets/images/leadership-impact/nextwork-build-brew.jpg` | A NextWork Build & Brew session Sasha is leading: students building around a table with laptops (horizontal). Keep screens unreadable. | horizontal 3:2 |
| Community & Service | `assets/images/community-service/volunteering-la.jpg` | Sasha volunteering in Los Angeles: a Heal the Bay day or a shift at the SCV Food Bank (horizontal) | horizontal 4:3 |
| Community & Service | `assets/images/logos/heal-the-bay.png` | Heal the Bay logo, square PNG (cream or transparent background) | square logo (PNG) |
| Community & Service | `assets/images/logos/scv-food-bank.png` | SCV Food Bank (Santa Clarita Valley Food Bank) logo, square PNG | square logo (PNG) |
| Community & Service | `assets/images/logos/warner-center-chamber.png` | West Valley Warner Center Chamber of Commerce logo, square PNG | square logo (PNG) |
| Community & Service | `assets/images/logos/iine.png` | International Institute of New England (IINE) logo, square PNG | square logo (PNG) |
| Community & Service | `assets/images/community-service/kappa-kappa-gamma.jpg` | Sasha with her Kappa Kappa Gamma sisters: a chapter event or a group photo (vertical) | vertical 4:5 |
| The Next Chapter | `assets/images/next-chapter/headshot.jpg` | A professional headshot of Sasha — natural light, simple background (vertical) | vertical 4:5 |

## Text for Sasha to confirm

Search the pages for these markers (`grep -rn "DRAFT\|EDIT:\|TEMPLATE" pages index.html`):

- `<!-- DRAFT QUOTE: Sasha to confirm wording -->` marks pull quotes paraphrased from her own
  planning notes. She should approve or rewrite each one.
- `<!-- DRAFT: Sasha to confirm -->` marks the research framing questions on AI & Governance.
- `<!-- EDIT: name the program once decided -->` marks where the MBA program can be named.
- `<!-- TEMPLATE: … -->` blocks are hidden slots (e.g. a quote from a teammate or recommender).
  They stay off the page until someone fills them in and removes the comment wrapper.

Every fact on the site comes from her résumé and grad-school plan. If a job title or date changes
on the résumé, update the site to match.

## Links, socials and the résumé

- **LinkedIn** and **email** are live on the cover and in the contact block of The Next Chapter.
- **Instagram / TikTok:** in [index.html](index.html), replace `href="#"` on those tiles with the
  profile URL. While a tile still points to `#` it is hidden automatically.
- **Résumé:** `assets/resume/resume.pdf` is what every "download résumé" link serves. The current
  file is a web copy with the phone number removed. Replace it with her final one-page PDF
  (same file name) once her edits are done.
- **Link previews** (LinkedIn, iMessage, Slack): add `assets/images/og-cover.jpg` (1200×630). Once
  the site has its final domain, update the absolute URLs noted in the `<head>` of
  [index.html](index.html).

## Local preview

Open `index.html` directly in a browser, or:

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

## Deploying to GitHub Pages

The workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) auto-deploys every push to `main`. One-time setup on GitHub:

1. Push the repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` (or click **Run workflow** on the Deploy action). The site goes live at `https://<your-user>.github.io/<repo-name>/`.

If you want a custom domain, add a `CNAME` file at the repo root containing your domain (e.g. `sasha.com`) and configure DNS per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Project structure

```
.
├── index.html                 # the cover (non-scrolling on desktop)
├── pages/                     # one file per chapter (see table above)
├── styles/
│   ├── base.css               # tokens, fonts, reset, reveal primitives, photo-slot templates
│   ├── landing.css            # the cover
│   ├── page.css               # shared chapter template: masthead, contents menu, cards, flips
│   └── pages/<chapter>.css    # page-specific styles, loaded after page.css
├── scripts/
│   ├── main.js                # chapter list, contents menu, prev/next, reveals, flips, photo fallbacks
│   ├── cursor-effects.js      # pink + gold glitter cursor
│   └── pages/<chapter>.js     # page-specific interactions (timeline, roadmap, filters…)
├── assets/
│   ├── images/                # photos (see "Adding photos"), logos, favicon
│   └── resume/resume.pdf      # the downloadable résumé
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deployment
└── .nojekyll                  # tells Pages not to run Jekyll
```

## Theme tokens

All colors and fonts are CSS variables in [styles/base.css](styles/base.css). Tweak there and they update everywhere.

```
--cream         #f6ecd6   page background
--black         #1a1a1a   primary text
--baby-pink     #f4c2c2   accent / hover sweeps
--bamboo        #c5a47e   secondary accent
--leaf          #2d4a32   dark green
```

Fonts (loaded from Google Fonts):

- **Italiana** — display / SASHA title
- **Cormorant Garamond** — body / page links
- **Parisienne** — script / "portfolio" subtitle
