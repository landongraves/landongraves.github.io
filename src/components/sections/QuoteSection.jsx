import { QuoteCalculator } from "../../features/quote/QuoteCalculator";

export function QuoteSection({ showIntroduction = false }) {
  return (
    <section className="quote section-pad" id="quote" aria-labelledby="quote-title">
      <div className="quote-title" data-reveal>
        {showIntroduction && <span className="mini-label">PROJECT SCOPING TOOL</span>}
        <h2 id="quote-title">Price the<br /><em>next asset.</em></h2>
      </div>
      <div className="quote-workspace" data-reveal>
        <div className="quote-copy">
          <div className="quote-stamp">ESTIMATE<br />NOT PROPOSAL</div>
          <p>
            Choose the asset scale, geometry detail, and deadline. The estimate gives
            both sides a concrete place to begin before references and deliverables are reviewed.
          </p>
          <span className="quote-reference">MALIEQW / INDEPENDENT 3D PRODUCTION</span>
        </div>
        <QuoteCalculator />
      </div>
    </section>
  );
}
