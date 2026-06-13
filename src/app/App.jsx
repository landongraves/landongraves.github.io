import { useEffect, useState } from "react";
import { LoadingScreen } from "../components/layout/LoadingScreen";
import { SectionRail } from "../components/layout/SectionRail";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SITE } from "../config/site";
import { useClientRouter } from "../hooks/useClientRouter";
import { useScrollChrome } from "../hooks/useScrollChrome";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { HomePage } from "../pages/HomePage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { QuotePage } from "../pages/QuotePage";
import { ResumePage } from "../pages/ResumePage";

const PAGE_COMPONENTS = {
  home: HomePage,
  portfolio: PortfolioPage,
  quote: QuotePage,
  resume: ResumePage,
};

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const { page, navigate } = useClientRouter();
  const {
    activeSection,
    isHeroArrowVisible,
    isNavigationHidden,
    setNavigationHidden,
  } = useScrollChrome(page === "home");
  const PageComponent = PAGE_COMPONENTS[page] ?? HomePage;

  useScrollReveal(page);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = page === "home" ? SITE.title : `${page[0].toUpperCase()}${page.slice(1)} — ${SITE.name}`;
  }, [page]);

  const navigateToPage = (pageId) => {
    setNavigationHidden(false);
    navigate(pageId);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <LoadingScreen isVisible={isLoading} />
      <SiteHeader
        currentPage={page}
        isHidden={isNavigationHidden}
        navigate={navigateToPage}
      />
      {page === "home" && (
        <SectionRail activeSection={activeSection} scrollToSection={scrollToSection} />
      )}
      <main id="main-content">
        <PageComponent
          isHeroArrowVisible={isHeroArrowVisible}
          scrollToStudio={() => scrollToSection("studio")}
        />
      </main>
      <SiteFooter navigate={navigateToPage} />
    </>
  );
}
