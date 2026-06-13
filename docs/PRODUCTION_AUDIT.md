# Production Readiness Audit

## Summary

The repository was refactored from a rapidly iterated prototype into a maintainable
portfolio application with explicit ownership boundaries, reproducible deployment, and
project-specific content.

## Changes and Rationale

### Architecture

- Split the monolithic `App.jsx` into pages, sections, layout components, UI components,
  hooks, features, configuration, constants, and utilities.
  - Improves discoverability, testing boundaries, and future feature ownership.
- Reduced `App` to routing and global layout coordination.
  - Prevents page presentation and renderer lifecycle logic from becoming coupled.
- Moved Three.js behavior into `features/model-showcase`.
  - Isolates the most complex and failure-prone code.
- Moved estimator behavior into `features/quote`.
  - Keeps pricing rules and form state independent from page layout.

### Content

- Removed fabricated employers, client brands, and testimonial attribution.
  - Prevents unverified claims from reaching production.
- Rewrote generic agency language around MALIEQW's actual hard-surface rifle study,
  production workflow, and deliverables.
  - Gives the portfolio a specific point of view and client purpose.
- Replaced the placeholder email with the connected project email.
  - Ensures contact actions reach a real destination.
- Centralized copy and pricing in `src/constants/content.js`.
  - Makes updates consistent and reviewable.

### Accessibility

- Added a skip-to-content link and semantic navigation labels.
- Added `aria-current` state to route and section navigation.
- Replaced button-like estimator controls with native radio and checkbox inputs.
- Added keyboard model inspection using arrow keys.
- Added model loading status and descriptive canvas labels.
- Preserved visible focus and reduced-motion behavior.

### Performance

- Replaced the 16.2 MB production GLB with an equivalent 8.4 MB optimized export.
- Dynamically import Three.js and `GLTFLoader`.
- Cache the loaded model template and clone it for each presentation.
- Throttle scroll progress updates with `requestAnimationFrame`.
- Remove committed generated bundles and duplicated model assets.

### Styling and Motion

- Replaced a 1,176-line accumulated stylesheet with layered token, base, layout, section,
  and interaction styles.
- Removed dead dashboard, editorial, legacy project-card, and obsolete navigation rules.
- Kept motion focused on orientation, model inspection, loading, and content entry.
- Added reduced-motion behavior for visitors who request it.

### Repository and Deployment

- Pinned runtime and development dependency versions.
- Removed unused `@vitejs/plugin-react`.
- Added `.editorconfig` and repository scripts.
- Added a reproducible GitHub Pages workflow.
- Removed generated root deployment artifacts from source control.
- Documented the required GitHub Pages configuration and development workflow.

## Remaining Considerations

- The featured GLB is still the largest network asset. A future export using Draco or
  Meshopt compression would reduce transfer size further, but requires validating
  material and topology fidelity.
- Automated browser-level accessibility and interaction tests are not currently present.
  Add Playwright when the portfolio gains additional models or client-facing forms.
- The client-side router is intentionally small. Adopt a routing library only if nested
  routes, loaders, or route-level error boundaries become necessary.

