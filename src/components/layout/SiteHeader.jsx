import { useEffect, useRef, useState } from "react";
import { ROUTES, SITE } from "../../config/site";

export function SiteHeader({ currentPage, isHidden, navigate }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPage]);

  const navigateTo = (pageId) => {
    navigate(pageId);
    menuButtonRef.current?.focus();
  };

  return (
    <header className={isHidden ? "nav-wrap nav-hidden" : "nav-wrap"}>
      <nav className="nav" aria-label="Primary navigation">
        <button className="wordmark" onClick={() => navigateTo("home")}>
          {SITE.name}<span aria-hidden="true">®</span>
        </button>
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="primary-links"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span /><span />
        </button>
        <div id="primary-links" className={isMenuOpen ? "nav-links open" : "nav-links"}>
          {ROUTES.map((route) => (
            <button
              className={currentPage === route.id ? "active" : ""}
              aria-current={currentPage === route.id ? "page" : undefined}
              onClick={() => navigateTo(route.id)}
              key={route.id}
            >
              {route.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
