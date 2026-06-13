import { useMemo, useState } from "react";
import { ESTIMATE_OPTIONS } from "../../constants/content";
import { SITE } from "../../config/site";
import { formatCurrency } from "../../utils/formatCurrency";
import { Arrow } from "../../components/ui/Arrow";
import { OptionGroup } from "./OptionGroup";

export function QuoteCalculator() {
  const [selection, setSelection] = useState({
    scope: 1,
    detail: 1,
    timeline: 0,
    includesMaterials: true,
  });

  const estimate = useMemo(
    () =>
      ESTIMATE_OPTIONS.scope[selection.scope].price +
      ESTIMATE_OPTIONS.detail[selection.detail].price +
      ESTIMATE_OPTIONS.timeline[selection.timeline].price +
      (selection.includesMaterials ? ESTIMATE_OPTIONS.materialsPrice : 0),
    [selection],
  );

  const updateSelection = (key, value) => {
    setSelection((current) => ({ ...current, [key]: value }));
  };

  const subject = encodeURIComponent(`3D project enquiry — estimated ${formatCurrency(estimate)}`);

  return (
    <div className="calculator">
      <OptionGroup
        legend="What are we making?"
        name="scope"
        choices={ESTIMATE_OPTIONS.scope}
        selectedIndex={selection.scope}
        onChange={(scope) => updateSelection("scope", scope)}
      />
      <OptionGroup
        legend="What level of detail?"
        name="detail"
        choices={ESTIMATE_OPTIONS.detail}
        selectedIndex={selection.detail}
        onChange={(detail) => updateSelection("detail", detail)}
      />
      <OptionGroup
        legend="What is the timeline?"
        name="timeline"
        choices={ESTIMATE_OPTIONS.timeline}
        selectedIndex={selection.timeline}
        onChange={(timeline) => updateSelection("timeline", timeline)}
      />
      <label className="brand-toggle">
        <input
          type="checkbox"
          checked={selection.includesMaterials}
          onChange={(event) => updateSelection("includesMaterials", event.target.checked)}
        />
        <i aria-hidden="true">{selection.includesMaterials ? "✓" : ""}</i>
        <span>
          <strong>Include textures and materials</strong>
          <small>UV work, material setup, and presentation-ready surfaces</small>
        </span>
        <b>+{formatCurrency(ESTIMATE_OPTIONS.materialsPrice)}</b>
      </label>
      <div className="estimate" aria-live="polite">
        <div>
          <span>EXPECTED INVESTMENT</span>
          <strong>{formatCurrency(estimate)}<small> USD</small></strong>
        </div>
        <a href={`mailto:${SITE.email}?subject=${subject}`}>Start a conversation <Arrow /></a>
      </div>
    </div>
  );
}
