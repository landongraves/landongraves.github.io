import { CAPABILITIES, SERVICES } from "../../constants/content";
import { Arrow } from "../ui/Arrow";
import { TiltCard } from "../ui/TiltCard";

export function StudioSection() {
  return (
    <section className="studio section-pad" id="studio" aria-labelledby="studio-title">
      <div className="studio-manifesto" data-reveal>
        <h2 id="studio-title">Built in 3D.<br /><em>Ready for use.</em></h2>
      </div>
      <div className="studio-board">
        <TiltCard className="studio-note">
          <span>MALIEQW / 3D ARTIST</span>
          <strong>Clean forms.<br />Convincing detail.</strong>
          <div className="scribble" aria-hidden="true">↝</div>
        </TiltCard>
        <div className="service-tiles">
          {SERVICES.map((service) => (
            <TiltCard className="service-tile" key={service.id}>
              <span>{service.id}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Arrow />
            </TiltCard>
          ))}
        </div>
      </div>
      <div className="marquee-shell" aria-label={`Capabilities: ${CAPABILITIES.join(", ")}`}>
        <div className="capability-marquee">
          {[0, 1].map((group) => (
            <div className="capability-group" aria-hidden="true" key={group}>
              {CAPABILITIES.map((capability) => (
                <span className="capability-item" key={capability}>
                  <span>{capability}</span><i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
