import { SITE } from "../config/site";

export function UnderConstructionPage({ pageName }) {
  return (
    <section className="construction-page section-pad" aria-labelledby="construction-title">
      <span>{SITE.name} / {pageName}</span>
      <h1 id="construction-title">In construction.</h1>
    </section>
  );
}
