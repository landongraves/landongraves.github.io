import { EXPERIENCE } from "../../constants/content";
import { Arrow } from "../ui/Arrow";

export function ResumeSection({ showIntroduction = false }) {
  return (
    <section className="resume section-pad" id="resume" aria-labelledby="resume-title">
      <div className="resume-top" data-reveal>
        <span className="mini-label">{showIntroduction ? "CAPABILITIES AND DELIVERY" : "EXPERIENCE"}</span>
        <h2 id="resume-title">A focused<br /><em>3D practice.</em></h2>
        <a className="download" href="/malieqw-resume.txt" download>
          Download capability sheet <Arrow />
        </a>
      </div>
      <div className="resume-list">
        {EXPERIENCE.map((item) => (
          <article data-reveal key={item.label}>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <strong>{item.skill}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
