# Sasha — Portfolio

Personal site for **Alexandra "Sasha" Petrovicheva**: an editorial portfolio built
around her path from AI governance and business strategy to an MBA, consulting, and law.
Static site, no build step, deployed to GitHub Pages by GitHub Actions.

## The chapters

| # | Page | File | What's on it |
| - | ---- | ---- | ------------ |
| — | Cover | `index.html` | Name, focus areas, résumé download, framed portrait with the research chip, degree/location/languages line, at-a-glance figures, featured chapters, contents, experience badges, contact |
| 1 | My Story | `pages/my-story.html` | Profile, at-a-glance band, the story in three parts (operations → Northeastern and co-ops → AI governance), the 2019 → 2027 journey chart, statement |
| 2 | AI & Governance | `pages/ai-governance.html` | Wellington co-op facts and numbers, the four-team rotation, the AI agent prototype (four stages), the control requirements, the agentic-AI research and its six lenses, skills and coursework |
| 3 | Strategy & Brand | `pages/strategy-brand.html` | TJX and UMG case cards, content and strategy projects timeline, what carries into consulting |
| 4 | Leadership & Impact | `pages/leadership-impact.html` | Leadership numbers, where she leads (role cards with promotions), the tenure chart, how she leads, where it leads |
| 5 | Community & Service | `pages/community-service.html` | Service route from Los Angeles to Boston (four organisations), campus involvement, why service |
| 6 | Law & Advocacy | `pages/law-advocacy.html` | Research and policy writing, legal and regulatory numbers, the MCIS internship and why law comes later, areas of law she wants to practice |
| 7 | The Next Chapter | `pages/next-chapter.html` | Goal statement, MBA → consulting → law school plan, what she brings to the class, target roles, contact |

The chapter strip under the masthead, the Contents menu and the previous/next links at the bottom
of every chapter are generated from the `CHAPTERS` list at the top of
[scripts/main.js](scripts/main.js). To rename or reorder a chapter, edit that list and the matching
link on the cover ([index.html](index.html)). On chapter pages, ← and → jump to the previous and
next chapter.

## Adding photos

Every photo spot is a template. Until its file exists it shows a photo icon, a short description of
the photo that belongs there, and the exact file path. Save a photo at that path and it appears
automatically; no code changes are needed.

- JPG, about 1600px on the long side, under ~500 KB. The shape column says which orientation fits.
- Portraits are straight 4:5 JPGs, at least 800×1000 px.
- Nothing confidential: no work screens, documents, badges or internal decks (Wellington especially).

| Page | Save as | What to send | Shape |
| ---- | ------- | ------------ | ----- |
| Cover | `assets/images/portrait.jpg` | A professional portrait of Alexandra, head and shoulders | vertical 4:5 |
| My Story | `assets/images/my-story/portrait.jpg` | A recent portrait of Alexandra, outdoors or on campus | vertical 4:5 |
| My Story | `assets/images/my-story/hero-los-angeles.jpg` | Alexandra in the Los Angeles area, before college | horizontal 3:2 |
| My Story | `assets/images/my-story/hero-boston.jpg` | Alexandra in Boston: on campus or a city street | horizontal 3:2 |
| AI & Governance | `assets/images/ai-governance/wellington-office.jpg` | Alexandra at Wellington Management in Boston: the lobby, the building entrance or a team moment. No screens, documents, badges or anything confidential in frame. | vertical 4:5 |
| Strategy & Brand | `assets/images/strategy-brand/tjx.jpg` | Alexandra at The TJX Companies, or a public TJ Maxx social post she worked on; nothing internal or confidential | horizontal 16:10 |
| Strategy & Brand | `assets/images/strategy-brand/umg.jpg` | Alexandra at UMG Technologies, or the company's public logo; nothing internal | horizontal 16:10 |
| Leadership & Impact | `assets/images/leadership-impact/tedx-media-team.jpg` | Alexandra with the TEDxNortheasternU media team at the event: on stage, backstage or at the media table | vertical 4:5 |
| Leadership & Impact | `assets/images/leadership-impact/nextwork-build-brew.jpg` | A NextWork Build & Brew session Alexandra is leading: students building around a table with laptops. Keep screens unreadable. | horizontal 3:2 |
| Community & Service | `assets/images/community-service/volunteering-la.jpg` | Alexandra volunteering in Los Angeles: a Heal the Bay day or an SCV Food Bank shift | horizontal 3:2 |
| The Next Chapter | `assets/images/next-chapter/headshot.jpg` | A professional headshot of Alexandra: natural light, simple background | vertical 4:5 |

The organisation badges (WM, TJX, HB, SCV, IINE, KKΓ…) are typeset initials, not logo files.

## Before sending to programs: confirm with Sasha

Most of these are also marked in the HTML (`grep -rn "DRAFT\|EDIT:\|TEMPLATE" pages index.html`).
`<!-- TEMPLATE: … -->` blocks are hidden slots (e.g. a quote from a recommender) that stay off the
page until someone fills them in and removes the comment wrapper.

**Wellington public-disclosure check (do this first).** Ask her Wellington manager and faculty
advisor to confirm that the public description of the AI agent prototype (Excel → Microsoft
Copilot → VS Code → Snowflake), the four-team rotation and the anonymized Wellington research case
are cleared for a public website.

**My Story**
- Part 01, last sentence: "Payroll, insurance and credentialing work showed me how compliance decisions reach staff and patients." (DRAFT)
- Statement: "I want to understand AI deeply enough to help organizations adopt it responsibly, and to answer for how it is used." (DRAFT)
- Profile line "My work sits where AI, cybersecurity, privacy and business decisions meet." (paraphrased from the old site)
- Journey dates not on the résumé: Northeastern "Fall 2023", MCIS Lawyers Jun–Aug 2022, Heal the Bay / SCV Food Bank "2019 – 2022", MBA "From Fall 2027".

**AI & Governance**
- Hero intro: "At Wellington Management I worked on a question most firms now face: how to adopt AI without losing oversight of it."
- Photo chip "9 months" and the final prototype stage labelled "Aug 2026" (the résumé says "at co-op completion"). (DRAFT)
- The six research framing questions (DRAFT) and the statement "I treat AI and cybersecurity risks as business risks first, and increasingly as legal ones." (DRAFT)
- Tesla–Chevron Financial Analysis (not on the résumé): confirm, or give a course and term.

**Strategy & Brand**
- Hero intro, and the three through-line steps (TJX/Wellington audience insight, UMG positioning, NextWork clear messaging).
- Items not on the résumé: IV Today (Jun–Aug 2024), Head Photographer for the Business of Entertainment Club (Sep–Dec 2024), B+ Foundation (Oct 2024–May 2025), Minted Supply (May–Jun 2025), and the tools list (Canva, Photoshop, Premiere Pro, Final Cut Pro, Mailchimp).
- Chip durations "6 month co-op" (TJX) and "5 month internship" (UMG).

**Leadership & Impact**
- Hero intro, the TEDx and SGA role lines (not on the résumé), and the three "How I lead" theses with the organisations under each.
- IDEA Venture Accelerator: her exact title (shown as "Content and venture strategy", Aug 2024–Jan 2025). (EDIT)
- Girls Into VC Fellow, Sep–Dec 2024 (not on the résumé).
- The tenure chart draws "present" as ending Sep 2026; update it when dates change.

**Community & Service**
- Statement: "Service keeps me close to the people who live with the outcome of a decision, and they are who governance is for." (DRAFT)
- All four service organisations, roles and dates, and their cause labels (none are on the résumé).
- Campus items: Kappa Kappa Gamma (Sep 2023 – present), WIB & WIF Mentee (Sep 2024 – Jan 2025), BEC Head Photographer (Sep – Dec 2024).

**Law & Advocacy**
- Exact titles, years and course context for the research items (Texas SB 1029 paper, Mica Mining Policy Memo, the international relations papers), and the "5 research projects" count.
- MCIS Lawyers Legal Intern, Thousand Oaks, Jun – Aug 2022: title and description (not on the résumé).
- "Why law, and why later": "The AI and privacy questions I work on become legal questions sooner or later. I plan to study law after two to three years in consulting."

**The Next Chapter**
- The goal statement, "Why the MBA now" and "Why law comes later".
- The four target role families and their one-line descriptions.
- MBA start "Fall 2027" and "two to three years" of consulting (from the grad-school plan), and the step notes.

Every other fact comes from her résumé and grad-school plan. If a job title or date changes on the
résumé, update the site to match.

## Links, socials and the résumé

- **LinkedIn** and **email** are in the masthead and footer of every page, on the cover, in the
  Contents menu, and in the contact block of The Next Chapter. Instagram and TikTok were removed.
- **Résumé:** `assets/resume/resume.pdf` is what every "Résumé" / "Download résumé" link serves. The
  current file is a web copy with the phone number removed. Replace it with her final one-page PDF
  (same file name) once her edits are done.
- **Link previews** (LinkedIn, iMessage, Slack): add `assets/images/og-cover.jpg` (1200×630). Once
  the site has its final domain, update the absolute URLs noted in the `<head>` of
  [index.html](index.html).

## Local preview

Serve the folder over http:

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

Opening `index.html` directly (file://) mostly works, but Chrome refuses to load the icon sprite
(`assets/icons.svg`) from a file:// page, so every icon disappears. GitHub Pages serves over https,
so this only affects local previews.

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
├── index.html                 # the cover
├── pages/                     # one file per chapter (see table above)
├── styles/
│   ├── base.css               # tokens, fonts, reset, type, icons, focus, reveals, photo-slot templates
│   ├── page.css               # shared chrome + component library (see .review-tools/COMPONENTS.md)
│   ├── landing.css            # the cover (loaded after page.css)
│   └── pages/<chapter>.css    # page-specific layout, loaded after page.css
├── scripts/
│   └── main.js                # chapter list, chapter strip, contents menu, prev/next and ←/→ keys,
│                              # reveals, photo fallbacks, scroll ribbon (the only script)
├── assets/
│   ├── icons.svg              # icon sprite, used as <svg><use href="…/icons.svg#i-name">
│   ├── images/                # photos (see "Adding photos"), favicon
│   └── resume/resume.pdf      # the downloadable résumé
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deployment
└── .nojekyll                  # tells Pages not to run Jekyll
```

## Theme tokens

All colors, type sizes and spacing are CSS variables in [styles/base.css](styles/base.css). Tweak
there and they update everywhere.

```
--cream         #f6ecd6   page background
--paper         #fbf6ea   raised surfaces: cards, fact boxes
--cream-deep    #efe2c5   recessed bands
--sand          #e7d8ba   photo placeholders
--leaf          #2d4a32   primary accent: links, icons, buttons, dark bands
--ink           #1a1a1a   headings, strong rules
--text          #2b2723   body copy (--text-2, --text-3 for secondary copy and captions)
--bamboo        #c5a47e   rules and small marks only, never text (--accent-ink #74573a as text)
--blush         #f4c2c2   small highlights only: photo mats, markers
```

Fonts (one Google Fonts link per page):

- **Newsreader**: display and body serif (headings, body copy, figures)
- **Libre Franklin**: labels, navigation, buttons and data
