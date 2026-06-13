import { MODEL_STUDIES } from "../../constants/content";
import { ModelShowcase } from "../../features/model-showcase/ModelShowcase";

export function PortfolioSection({ showIntroduction = false }) {
  return (
    <section className="work section-pad" id="portfolio" aria-label="Selected 3D models">
      {showIntroduction && (
        <div className="page-intro section-pad" data-reveal>
          <span>SELECTED MODEL STUDIES</span>
          <h1>Inspect the<br /><em>decisions.</em></h1>
          <p>
            These studies show finished surface work and the underlying construction.
            Scroll to orbit each model, or drag it to inspect a specific angle.
          </p>
        </div>
      )}
      {MODEL_STUDIES.map((study) => <ModelShowcase study={study} key={study.id} />)}
    </section>
  );
}
