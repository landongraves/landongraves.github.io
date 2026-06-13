import { HOME_SECTIONS } from "../../config/site";

export function SectionRail({ activeSection, scrollToSection }) {
  return (
    <aside className="section-rail" aria-label="Home sections">
      {HOME_SECTIONS.map((section) => (
        <button
          className={activeSection === section.id ? "active" : ""}
          aria-current={activeSection === section.id ? "location" : undefined}
          key={section.id}
          onClick={() => scrollToSection(section.id)}
        >
          <i aria-hidden="true" /><b>{section.label}</b>
        </button>
      ))}
    </aside>
  );
}
