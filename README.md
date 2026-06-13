# MALIEQW Portfolio

A client-facing portfolio for independent 3D artist **MALIEQW**. The site presents
hard-surface modeling work through scroll-driven model studies, explains the production
practice, and gives prospective clients a practical way to estimate an asset commission.

## Product Vision

The portfolio is designed around one claim: a strong 3D asset should hold up from every
angle. Instead of relying on static beauty renders, the site lets visitors orbit and
inspect the featured rifle study, then exposes the same asset as a wireframe construction
study.

## Technology

- React 19
- Vite 8
- Three.js with `GLTFLoader`
- CSS modules organized by responsibility
- GitHub Pages deployment through GitHub Actions

## Requirements

- Node.js 20.19 or newer
- npm

## Installation

```bash
git clone https://github.com/landongraves/landongraves.github.io.git
cd landongraves.github.io
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Available Commands

```bash
npm run dev      # Start the local Vite development server
npm run build    # Create the production build in dist/
npm run build:pages # Build and add the direct-route fallback used by GitHub Pages
npm run check    # Run the production build as the repository validation check
npm run preview  # Preview the production build locally
```

## Architecture

The application uses a small client-side router because the project has four simple
routes and does not require nested layouts or data loading. Global application concerns
remain in `src/app/App.jsx`; pages only compose sections; feature directories own complex
stateful behavior.

The Three.js module and GLTF loader are dynamically imported by the model showcase. This
keeps the large rendering dependency out of quote- and résumé-only route startup. The
model template is cached after its first load, then cloned for textured and wireframe
presentations.

Project content, route definitions, contact details, and estimator pricing are
centralized so copy and business rules do not drift across components.

## Project Structure

```text
src/
  app/                    Application composition
  components/
    layout/               Header, footer, loader, section navigation
    sections/             Page sections
    ui/                   Small reusable interaction components
  config/                 Site identity and route configuration
  constants/              Portfolio content and estimator pricing
  features/
    model-showcase/       Three.js model lifecycle and inspection
    quote/                Accessible project estimator
  hooks/                  Routing, scroll chrome, and reveal behavior
  pages/                  Route-level compositions
  styles/                 Tokens, base, layout, sections, interactions
  utils/                  Shared formatting helpers
public/
  models/                 Optimized browser-ready GLB assets
  malie-qw-resume.txt     Downloadable capability sheet
```

## Development Workflow

1. Create a focused branch from `main`.
2. Update project content in `src/constants/content.js` or site configuration in
   `src/config/site.js`.
3. Keep stateful feature logic inside its feature directory.
4. Run `npm run check`.
5. Verify keyboard navigation, reduced-motion behavior, responsive layouts, and direct
   route loading before opening a pull request.

## Accessibility

- Semantic landmarks and section headings
- Skip-to-content link
- Keyboard-accessible primary navigation and estimator controls
- Native radio and checkbox inputs
- Keyboard model inspection with arrow keys
- Screen-reader labels and loading status
- Visible focus treatment
- Reduced-motion support

## Performance Notes

- Three.js and `GLTFLoader` load only when a model showcase mounts.
- The production rifle model is an optimized 8.4 MB GLB, reduced from 16.2 MB.
- The model template is fetched and parsed once per session.
- Scroll progress updates are throttled through `requestAnimationFrame`.
- Generated `dist/` and root deployment bundles are not committed.

## GitHub Pages Deployment

The workflow at `.github/workflows/deploy-pages.yml` builds the project and deploys the
`dist/` artifact. In repository settings, configure **Pages → Build and deployment →
Source** to **GitHub Actions**.

Direct routes are supported by copying `dist/index.html` to `dist/404.html` during the
deployment build.

## Content and Asset Maintenance

- Replace or add browser-ready models in `public/models/`.
- Keep source archives and unoptimized exports outside version control.
- Update `SITE.modelPath` in `src/config/site.js` when the featured model changes.
- Do not add client names, employers, testimonials, or contact details unless they are
  verified.
