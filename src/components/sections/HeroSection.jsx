export function HeroSection({ isArrowVisible, scrollToStudio }) {
  return (
    <section className="hero section-pad" id="home" aria-labelledby="hero-title">
      <div className="hero-top">
        <p className="eyebrow">
          MALIEQW / INDEPENDENT 3D ARTIST
          <span>AVAILABLE FOR CLIENT WORK · WORLDWIDE</span>
        </p>
      </div>
      <h1 id="hero-title">
        I model ideas<br />
        <span>you can almost touch.</span>
      </h1>
      <div className="hero-bottom">
        <button
          className={isArrowVisible ? "round-button" : "round-button arrow-hidden"}
          onClick={scrollToStudio}
          aria-label="Explore services"
        >
          <span>↓</span><span>↓</span><span>↓</span>
        </button>
        <div className="hero-doodle" aria-hidden="true">
          <div className="doodle-face"><i /><i /><b /></div>
          <span>built to hold up<br />from every angle</span>
        </div>
      </div>
    </section>
  );
}
