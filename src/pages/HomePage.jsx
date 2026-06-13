import { HeroSection } from "../components/sections/HeroSection";
import { PortfolioSection } from "../components/sections/PortfolioSection";
import { PracticeStatement } from "../components/sections/PracticeStatement";
import { QuoteSection } from "../components/sections/QuoteSection";
import { ResumeSection } from "../components/sections/ResumeSection";
import { StudioSection } from "../components/sections/StudioSection";

export function HomePage({ isHeroArrowVisible, scrollToStudio }) {
  return (
    <>
      <HeroSection isArrowVisible={isHeroArrowVisible} scrollToStudio={scrollToStudio} />
      <StudioSection />
      <PortfolioSection />
      <QuoteSection />
      <ResumeSection />
      <PracticeStatement />
    </>
  );
}
