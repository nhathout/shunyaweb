# Sasha — Portfolio

Static site. No build step. Deployed via GitHub Actions to GitHub Pages.

## Where to drop files

| What                          | Where                            | Notes                                                   |
| ----------------------------- | -------------------------------- | ------------------------------------------------------- |
| Portrait (transparent PNG)    | `assets/images/portrait.png`     | Used on the landing page; full-height, no background.   |
| Instagram tile 1–6            | `assets/images/insta-1.jpg` … `insta-6.jpg` | Square crops; bottom-left 3×2 grid.       |
| Resume PDF                    | `assets/resume/resume.pdf`       | Linked from "download my resume" button.                |
| Favicon                       | `assets/images/favicon.png`      | Linked from every HTML page. |

The section pages are intentionally built with styled placeholders so Sasha can
replace text and imagery gradually without breaking the layout:

| Page | Best content to gather |
| ---- | ---------------------- |
| My Story | 2–3 personal photos, a pull quote, and a long-form bio/story draft. |
| Finance & Tech | Project names, classes, venture/analytics examples, screenshots, and the final numbers for the dashboard cards. |
| Brand & Content | Campaign images, video thumbnails, TJX/content samples, press links, and short ownership notes. |
| Leadership & Impact | Leadership roles, outcomes, metrics, organization names, and collaborator quotes. |
| Community & Influence | Volunteer work, partner names/logos, press/community links, audience numbers, and testimonials. |
| Law & Advocacy | Law firm name/role/dates, practice area, responsibilities, writing sample themes, recommendation quotes, and law school positioning. |

If you want different filenames, just update the `src` in [index.html](index.html) to match.

## Where to put real social URLs

In [index.html](index.html), the four social tiles in the top-right are placeholder links. Update the `href` on each:

- Instagram tile — `<a href="https://instagram.com/...">`
- LinkedIn tile — `<a href="https://linkedin.com/in/...">`
- TikTok tile — `<a href="https://tiktok.com/@...">`
- Email tile — `<a href="mailto:sasha@example.com">`

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
├── index.html              # landing page (non-scrollable)
├── pages/                  # sub-pages, one per section
│   ├── my-story.html
│   ├── finance-tech.html
│   ├── brand-content.html
│   ├── leadership-impact.html
│   ├── community-influence.html
│   └── law-advocacy.html
├── styles/
│   ├── base.css            # variables, fonts, reset, reveal primitives
│   ├── landing.css         # landing page layout + animations
│   └── page.css            # sub-page magazine template
├── scripts/
│   └── main.js             # reveal-on-load triggers
├── assets/
│   ├── images/             # portrait + insta tiles go here
│   └── resume/             # resume.pdf goes here
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
└── .nojekyll               # tells Pages not to run Jekyll
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
