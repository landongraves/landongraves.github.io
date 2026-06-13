import { useEffect, useMemo, useRef, useState } from "react";

const services = [
  ["01", "Hard Surface", "Production-minded props and product models with clean, intentional forms."],
  ["02", "Materials", "Detailed textures and material studies built to sell the surface and story."],
  ["03", "Presentation", "Lighting, turntables, and interactive showcases that make the model land."],
];

const options = {
  type: [
    { label: "1 small item", price: 600 },
    { label: "1 medium item", price: 1200 },
    { label: "1 large item", price: 2200 },
    { label: "3-item set", price: 3200 },
  ],
  pages: [
    { label: "Low poly", price: 0 },
    { label: "Medium poly", price: 700 },
    { label: "High poly", price: 1800 },
  ],
  timeline: [
    { label: "2 weeks", price: 0 },
    { label: "1 week", price: 900 },
    { label: "4 days", price: 2200 },
  ],
};

function Arrow({ down = false }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function TiltCard({ className, children }) {
  const handleMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = ((y / rect.height) - 0.5) * -5;

    card.style.setProperty("--cursor-x", `${x}px`);
    card.style.setProperty("--cursor-y", `${y}px`);
    card.style.setProperty("--glow-opacity", "1");
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const handleLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--glow-opacity", "0");
    card.style.transform = "";
  };

  return (
    <article
      className={`${className} tilt-card`}
      data-reveal
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="tilt-card-content">{children}</div>
    </article>
  );
}

function ModelShowcase({ mode = "textured", title, description }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [modelStatus, setModelStatus] = useState("loading");
  const progressRef = useRef(0);
  const interactionRef = useRef({ active: false, x: 0, y: 0, targetX: 0, targetY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    let renderer;
    let frame;
    let pivot;
    let disposed = false;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const next = Math.min(Math.max(-rect.top / travel, 0), 1);
      progressRef.current = next;
      setProgress(next);
      interactionRef.current.active = false;
      interactionRef.current.targetX = 0;
      interactionRef.current.targetY = 0;
    };

    const init = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
      camera.position.set(0, 0, 5.25);
      camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = mode === "wireframe" ? 1.8 : 1.15;

      scene.add(new THREE.HemisphereLight(0xf1f3df, 0x35413a, 3));
      const key = new THREE.DirectionalLight(0xffffff, 5);
      key.position.set(4, 5, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(mode === "wireframe" ? 0xdce8ad : 0xb7c8d0, 4);
      rim.position.set(-5, 2, -3);
      scene.add(rim);

      const model = (await new GLTFLoader().loadAsync("/gun.glb")).scene;
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const fit = 4.6 / Math.max(size.x, size.y, size.z);

      if (mode === "wireframe") {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xdce8ad,
              wireframe: true,
              roughness: 0.4,
              metalness: 0.3,
            });
          }
        });
      } else {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
          }
        });
      }

      pivot = new THREE.Group();
      scene.add(pivot);
      pivot.add(model);
      model.position.sub(center);
      pivot.scale.setScalar(fit);
      setModelStatus("ready");

      const resize = () => {
        if (!canvas.parentElement) return;
        const { width, height } = canvas.parentElement.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const animate = () => {
        if (!pivot) return;
        const p = progressRef.current;
        const interaction = interactionRef.current;
        interaction.x += (interaction.targetX - interaction.x) * 0.09;
        interaction.y += (interaction.targetY - interaction.y) * 0.09;
        pivot.rotation.y = (mode === "wireframe" ? Math.PI * 0.3 : -Math.PI * 0.15) + p * Math.PI * 2 + interaction.x;
        pivot.rotation.x = Math.sin(p * Math.PI * 2) * 0.12 + interaction.y;
        const scale = fit * (0.82 + p * 0.18);
        pivot.scale.setScalar(scale);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      resize();
      animate();
      window.addEventListener("resize", resize);
      renderer.domElement._resizeHandler = resize;
    };

    updateProgress();
      init().catch((error) => {
        console.error("Unable to load 3D model", error);
        setModelStatus("error");
      });
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateProgress);
      if (renderer?.domElement?._resizeHandler) window.removeEventListener("resize", renderer.domElement._resizeHandler);
      cancelAnimationFrame(frame);
      renderer?.dispose();
    };
  }, [mode]);

  const startInspect = (event) => {
    const interaction = interactionRef.current;
    interaction.active = true;
    interaction.startX = event.clientX;
    interaction.startY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("inspecting");
  };

  const moveInspect = (event) => {
    const interaction = interactionRef.current;
    if (!interaction.active) return;
    interaction.targetX = (event.clientX - interaction.startX) * 0.008;
    interaction.targetY = (event.clientY - interaction.startY) * 0.006;
  };

  const stopInspect = (event) => {
    const interaction = interactionRef.current;
    interaction.active = false;
    interaction.targetX = 0;
    interaction.targetY = 0;
    event.currentTarget.classList.remove("inspecting");
  };

  return (
    <article className={`model-showcase ${mode}`} ref={sectionRef}>
      <div className="model-sticky">
        <canvas
          ref={canvasRef}
          onPointerDown={startInspect}
          onPointerMove={moveInspect}
          onPointerUp={stopInspect}
          onPointerCancel={stopInspect}
          onPointerLeave={stopInspect}
        />
        <div className={`model-status ${modelStatus}`}>
          {modelStatus === "loading" ? "LOADING 3D MODEL" : "MODEL UNAVAILABLE"}
        </div>
        <div
          className="model-meta"
          style={{
            opacity: Math.max(0, 1 - progress * 3),
            transform: `translateY(${-progress * 40}px)`,
          }}
        >
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className={progress < 0.98 ? "orbit-hud" : "orbit-hud complete"}>
          <div className="orbit-dial" style={{ "--orbit-progress": `${progress * 360}deg` }}>
            <span>{Math.round(progress * 100)}</span>
          </div>
          <div>
            <strong>{progress < 0.98 ? "ORBITING MODEL" : "ORBIT COMPLETE"}</strong>
            <span>{progress < 0.98 ? "Keep scrolling" : "Continue to next section"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function OptionGroup({ title, choices, value, onChange }) {
  return (
    <fieldset className="option-group">
      <legend>{title}</legend>
      <div className="option-row">
        {choices.map((choice, index) => (
          <button
            type="button"
            className={value === index ? "option active" : "option"}
            onClick={() => onChange(index)}
            key={choice.label}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeroArrow, setShowHeroArrow] = useState(true);
  const [navHidden, setNavHidden] = useState(false);
  const [page, setPage] = useState(() => window.location.pathname.replace("/", "") || "home");
  const [activeSection, setActiveSection] = useState("home");
  const [quote, setQuote] = useState({ type: 1, pages: 1, timeline: 1, brand: true });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let directionDistance = 0;
    let previousDirection = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      const direction = Math.sign(delta);
      setShowHeroArrow(currentY < window.innerHeight * 0.38);

      if (direction !== 0) {
        directionDistance = direction === previousDirection ? directionDistance + Math.abs(delta) : Math.abs(delta);
        previousDirection = direction;
      }
      if (directionDistance >= 10) {
        setNavHidden(direction > 0 && currentY > 10);
        directionDistance = 0;
      }
      previousY = currentY;

      if (page === "home") {
        const sections = ["home", "studio", "portfolio", "quote", "resume"];
        const current = sections.findLast((id) => {
          const element = document.getElementById(id);
          return element && element.getBoundingClientRect().top <= window.innerHeight * 0.45;
        });
        if (current) setActiveSection(current);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    const handlePopState = () => {
      setPage(window.location.pathname.replace("/", "") || "home");
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const total = useMemo(() => {
    return (
      options.type[quote.type].price +
      options.pages[quote.pages].price +
      options.timeline[quote.timeline].price +
      (quote.brand ? 1800 : 0)
    );
  }, [quote]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = (nextPage) => {
    setMenuOpen(false);
    setNavHidden(false);
    window.history.pushState({}, "", nextPage === "home" ? "/" : `/${nextPage}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <div className={loading ? "loader" : "loader loader-hidden"} aria-hidden={!loading}>
        <div className="loader-mark"><i /><i /><i /></div>
        <p>MAKING THINGS MAKE SENSE</p>
        <p className="loader-credit">Created by <strong>_spaze</strong><span>Discord username</span></p>
      </div>

      <header className={navHidden ? "nav-wrap nav-hidden" : "nav-wrap"}>
        <nav className="nav">
          <button className="wordmark" onClick={() => navigate("home")}>MALIEQW<span>®</span></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span />
          </button>
          <div className={menuOpen ? "nav-links open" : "nav-links"}>
            {["home", "portfolio", "quote", "resume"].map((item) => (
              <button className={page === item ? "active" : ""} onClick={() => navigate(item)} key={item}>{item}</button>
            ))}
          </div>
        </nav>
      </header>

      {page === "home" && (
        <aside className="section-rail" aria-label="Home section navigation">
          {[
            ["home", "Intro"],
            ["studio", "Services"],
            ["portfolio", "Models"],
            ["quote", "Estimate"],
            ["resume", "Experience"],
          ].map(([id, label], index) => (
            <button
              className={activeSection === id ? "active" : ""}
              key={id}
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${label}`}
            >
              <i /><b>{label}</b>
            </button>
          ))}
        </aside>
      )}

      <main>
        {page === "home" && (
        <>
        <section className="hero section-pad" id="home">
          <div className="hero-top">
            <p className="eyebrow">MALIEQW / INDEPENDENT 3D ARTIST <span>AVAILABLE FOR CLIENT WORK · WORLDWIDE</span></p>
          </div>
          <h1>
            I model ideas<br />
            <span>you can almost touch.</span>
          </h1>
          <div className="hero-bottom">
            <button className={showHeroArrow ? "round-button" : "round-button arrow-hidden"} onClick={() => scrollTo("studio")} aria-label="Explore the work">
              <span>↓</span><span>↓</span><span>↓</span>
            </button>
            <div className="hero-doodle" aria-hidden="true">
              <div className="doodle-face"><i /><i /><b /></div>
              <span>thoughtful<br />by default</span>
            </div>
          </div>
        </section>

        <section className="studio section-pad" id="studio">
          <div className="studio-manifesto" data-reveal>
            <h2>Built in 3D.<br /><em>Ready for use.</em></h2>
          </div>
          <div className="studio-board">
            <TiltCard className="studio-note">
              <span>MALIEQW / 3D ARTIST</span>
              <strong>Clean forms.<br />Convincing detail.</strong>
              <div className="scribble">↝</div>
            </TiltCard>
            <div className="service-tiles">
              {services.map(([number, title, text]) => (
                <TiltCard className="service-tile" key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <Arrow />
                </TiltCard>
              ))}
            </div>
          </div>
          <div className="marquee-shell">
            <div className="capability-marquee">
              {[0, 1].map((group) => (
                <div className="capability-group" aria-hidden={group === 1} key={group}>
                  <span>MODELING</span><i /><span>TEXTURING</span><i /><span>PRODUCT VISUALS</span><i /><span>GAME ASSETS</span><i /><span>LIGHTING</span><i />
                </div>
              ))}
            </div>
          </div>
        </section>
        </>
        )}

        {(page === "home" || page === "portfolio") && (
        <section className="work section-pad" id="portfolio">
          <ModelShowcase
            title="Precision Rifle"
            description="A complete hard-surface study with layered materials, production detail, and a presentation-ready finish."
          />
          <ModelShowcase
            title="Structure / Wire"
            mode="wireframe"
            description="The same asset stripped back to expose silhouette, construction, topology, and the thinking beneath the surface."
          />
        </section>
        )}

        {(page === "home" || page === "quote") && (
        <section className="quote section-pad" id="quote">
          <div className="quote-title" data-reveal>
            <h2>Price the<br /><em>next asset.</em></h2>
          </div>
          <div className="quote-workspace" data-reveal>
            <div className="quote-copy">
              <div className="quote-stamp">ESTIMATE<br />NOT PROPOSAL</div>
              <p>
                Choose the asset type, detail, and timeline. The estimate updates as
                you go, giving you a practical starting point for commissioning Malieqw.
              </p>
              <span className="quote-reference">REF. MQ / {new Date().getFullYear()} / WEB</span>
            </div>
            <div className="calculator">
              <OptionGroup
                title="What are we making?"
                choices={options.type}
                value={quote.type}
                onChange={(type) => setQuote({ ...quote, type })}
              />
              <OptionGroup
                title="What level of detail?"
                choices={options.pages}
                value={quote.pages}
                onChange={(pages) => setQuote({ ...quote, pages })}
              />
              <OptionGroup
                title="What’s the timeline?"
                choices={options.timeline}
                value={quote.timeline}
                onChange={(timeline) => setQuote({ ...quote, timeline })}
              />
              <button
                type="button"
                className={quote.brand ? "brand-toggle active" : "brand-toggle"}
                onClick={() => setQuote({ ...quote, brand: !quote.brand })}
              >
                <i>{quote.brand ? "✓" : ""}</i>
                <span><strong>Include textures and materials</strong><small>UV work, material setup, and presentation-ready surfaces</small></span>
                <b>+$1.8k</b>
              </button>
              <div className="estimate">
                <div><span>EXPECTED INVESTMENT</span><strong>${total.toLocaleString()}<small> USD</small></strong></div>
                <a href={`mailto:hello@malieqw.design?subject=Project enquiry — estimated $${total.toLocaleString()}`}>
                  Start a conversation <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
        )}

        {(page === "home" || page === "resume") && (
        <>
        <section className="resume section-pad" id="resume">
          <div className="resume-top" data-reveal>
            <span className="mini-label">04 / EXPERIENCE</span>
            <h2>Experience<br /><em>in motion.</em></h2>
            <a className="download" href="/malie-qw-resume.txt" download>
              Download résumé <Arrow />
            </a>
          </div>
          <div className="resume-list">
            {[
              ["NOW", "Independent", "3D Artist", "Creating detailed product, prop, and hard-surface assets for client work."],
              ["CORE", "Blender", "Modeling & Materials", "From blockout and topology through texturing, lighting, and final presentation."],
              ["DELIVERY", "Production Ready", "Flexible Outputs", "Clean deliverables prepared for games, marketing, visualization, and web."],
            ].map((row) => (
              <article data-reveal key={row[0]}>
                <span>{row[0]}</span><h3>{row[1]}</h3><strong>{row[2]}</strong><p>{row[3]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonial section-pad" data-reveal>
          <div className="testimonial-mark">“</div>
          <blockquote>
            “Malieqw turned a rough reference into an asset that felt complete
            from every angle. The detail held up wherever we put the camera.”
          </blockquote>
        </section>
        </>
        )}
      </main>

      <footer className="footer section-pad" data-reveal>
        <div className="footer-top">
          <div><span>NEED A 3D ASSET?</span><p>Send the reference, intended use, and deadline. Malieqw will shape the right approach.</p></div>
          <h2>Build<br /><em>something real.</em></h2>
          <div className="footer-contact">
            <a href="mailto:hello@malieqw.design"><span>Email</span>hello@malieqw.design <Arrow /></a>
            <a href="https://discord.com/users/_spaze" target="_blank" rel="noreferrer"><span>Discord</span>_spaze <Arrow /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-credit"><span>Made by</span><strong>_spaze</strong><small>on Discord</small></div>
          <div><button onClick={() => navigate("portfolio")}>Portfolio</button><button onClick={() => navigate("quote")}>Quote</button><button onClick={() => navigate("resume")}>Resume</button></div>
          <span>MALIEQW® · © 2026</span>
        </div>
      </footer>
    </>
  );
}

export default App;
