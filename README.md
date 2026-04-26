# npgovintarajan.github.io

GitHub Pages site for Govindaraj Palanisamy's profile and contributions.

## Publish-ready structure

- `index.html`: Primary GitHub Pages entry point.
- `home.html`: Local/deep-link compatible copy of the main page.
- `assets/css/styles.css`: Shared site styles.
- `assets/js/app.js`: Shared client-side rendering and chart logic.
- `assets/images/profile-photo.png`: Profile image shown in the hero section.
- `data/career-phases.json`: Timeline phases, narratives, and radar chart values.
- `data/contributions.json`: Profile summary, skills, contributions, references, and embedded videos.

## GitHub Pages setup

For this repository name (`npgovintarajan.github.io`), GitHub Pages serves from the repository root.

1. Push changes to the `main` branch.
2. Open repository `Settings` -> `Pages`.
3. Set `Build and deployment` source to `Deploy from a branch`.
4. Select branch `main` and folder `/ (root)`.
5. Save and wait for deployment.

The site URL is:

- `https://npgovintarajan.github.io/`

## Content updates via JSON

The site is data-driven. Update content in JSON and refresh the page.

### Career journey data

File: `data/career-phases.json`

- `role`: Role title per period.
- `story`: Key events and narrative.
- `tech`: Technology adoption summary.
- `challenges`: Challenges overcome summary.
- `skills`: Radar values in this exact order:

1. Infrastructure & Systems
2. Product and Software Engineering
3. Cybersecurity
4. Enterprise Architecture
5. Strategic Leadership
6. FinOps

### Profile and contributions data

File: `data/contributions.json`

- Update profile title/description/linkedin URL in `profile`.
- Maintain alphabetical ordering in `profile.skills`.
- Update contribution cards in `categories`.
- Manage grouped references in `references.groups` (`Publications`, `Embedded Videos`, `GitHub Repositories`).

## Local preview

From repository root:

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/`
- `http://localhost:8000/home.html#contributions`
