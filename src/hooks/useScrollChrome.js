import { useEffect, useState } from "react";
import { HOME_SECTIONS } from "../config/site";

const DIRECTION_THRESHOLD = 10;

export function useScrollChrome(isHomePage) {
  const [isNavigationHidden, setNavigationHidden] = useState(false);
  const [isHeroArrowVisible, setHeroArrowVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let directionDistance = 0;
    let previousDirection = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;
      const direction = Math.sign(delta);

      setHeroArrowVisible(currentScrollY < window.innerHeight * 0.38);

      if (direction !== 0) {
        directionDistance =
          direction === previousDirection
            ? directionDistance + Math.abs(delta)
            : Math.abs(delta);
        previousDirection = direction;
      }

      if (directionDistance >= DIRECTION_THRESHOLD) {
        setNavigationHidden(direction > 0 && currentScrollY > DIRECTION_THRESHOLD);
        directionDistance = 0;
      }

      previousScrollY = currentScrollY;

      if (!isHomePage) return;
      const currentSection = HOME_SECTIONS.findLast((section) => {
        const element = document.getElementById(section.id);
        return element?.getBoundingClientRect().top <= window.innerHeight * 0.45;
      });
      if (currentSection) setActiveSection(currentSection.id);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return { activeSection, isHeroArrowVisible, isNavigationHidden, setNavigationHidden };
}
