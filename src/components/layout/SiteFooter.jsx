import { useState } from "react";
import { ROUTES, SITE } from "../../config/site";
import { Arrow } from "../ui/Arrow";

export function SiteFooter({ navigate }) {
  const [discordStatus, setDiscordStatus] = useState("");

  const copyDiscord = async () => {
    if (!navigator.clipboard) {
      setDiscordStatus(`Discord username: ${SITE.discord}`);
      return;
    }
    try {
      await navigator.clipboard.writeText(SITE.discord);
      setDiscordStatus("Discord username copied");
    } catch {
      setDiscordStatus(`Discord username: ${SITE.discord}`);
    }
  };

  return (
    <footer className="footer section-pad" data-reveal>
      <div className="footer-top">
        <div>
          <span>NEED A 3D ASSET?</span>
          <p>Send the reference, intended use, and deadline. MALIEQW will map the right production path.</p>
        </div>
        <h2>Build<br /><em>something real.</em></h2>
        <div className="footer-contact">
          <a href={`mailto:${SITE.email}`}><span>Email</span>{SITE.email}<Arrow /></a>
          <button type="button" onClick={copyDiscord}>
            <span>Discord · click to copy</span>{SITE.discord}<Arrow />
          </button>
          <span className="sr-only" aria-live="polite">{discordStatus}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-credit">
          <span>Made by</span><strong>{SITE.creator}</strong><small>on Discord</small>
        </div>
        <div>
          {ROUTES.slice(1).map((route) => (
            <button onClick={() => navigate(route.id)} key={route.id}>{route.label}</button>
          ))}
        </div>
        <span>{SITE.name}® · © {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
