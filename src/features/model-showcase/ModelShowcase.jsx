import { useEffect, useRef, useState } from "react";
import { SITE } from "../../config/site";

let modelTemplatePromise;

async function loadModelTemplate() {
  // Cache the parsed GLB template so the textured and wireframe studies share one fetch.
  if (!modelTemplatePromise) {
    modelTemplatePromise = Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
    ]).then(async ([THREE, { GLTFLoader }]) => ({
      THREE,
      scene: (await new GLTFLoader().loadAsync(SITE.modelPath)).scene,
    }));
  }
  return modelTemplatePromise;
}

export function ModelShowcase({ study }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const inspectionRef = useRef({
    active: false,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    startX: 0,
    startY: 0,
  });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("loading");
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;

    let renderer;
    let animationFrame;
    let resizeHandler;
    let disposed = false;
    let scrollFrame;

    const updateProgress = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = undefined;
        const section = sectionRef.current;
        if (!section) return;

        const bounds = section.getBoundingClientRect();
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const nextProgress = Math.min(Math.max(-bounds.top / travel, 0), 1);
        progressRef.current = nextProgress;
        setProgress(nextProgress);

        const inspection = inspectionRef.current;
        inspection.active = false;
        inspection.targetX = 0;
        inspection.targetY = 0;
      });
    };

    const initializeScene = async () => {
      const { THREE, scene: template } = await loadModelTemplate();
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
      renderer.toneMappingExposure = study.mode === "wireframe" ? 1.8 : 1.15;

      scene.add(new THREE.HemisphereLight(0xf1f3df, 0x35413a, 3));
      const keyLight = new THREE.DirectionalLight(0xffffff, 5);
      keyLight.position.set(4, 5, 5);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(
        study.mode === "wireframe" ? 0xdce8ad : 0xb7c8d0,
        4,
      );
      rimLight.position.set(-5, 2, -3);
      scene.add(rimLight);

      const model = template.clone(true);
      model.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const fittedScale = 4.6 / Math.max(size.x, size.y, size.z);

      model.traverse((child) => {
        if (!child.isMesh) return;
        child.material =
          study.mode === "wireframe"
            ? new THREE.MeshStandardMaterial({
                color: 0xdce8ad,
                wireframe: true,
                roughness: 0.4,
                metalness: 0.3,
              })
            : child.material.clone();
        child.material.side = THREE.DoubleSide;
      });

      const pivot = new THREE.Group();
      pivot.add(model);
      model.position.sub(center);
      pivot.scale.setScalar(fittedScale);
      scene.add(pivot);
      setStatus("ready");

      resizeHandler = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const { width, height } = parent.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const render = () => {
        const orbitProgress = progressRef.current;
        const inspection = inspectionRef.current;
        inspection.currentX += (inspection.targetX - inspection.currentX) * 0.09;
        inspection.currentY += (inspection.targetY - inspection.currentY) * 0.09;

        pivot.rotation.y =
          (study.mode === "wireframe" ? Math.PI * 0.3 : -Math.PI * 0.15) +
          orbitProgress * Math.PI * 2 +
          inspection.currentX;
        pivot.rotation.x =
          Math.sin(orbitProgress * Math.PI * 2) * 0.12 + inspection.currentY;
        pivot.scale.setScalar(fittedScale * (0.82 + orbitProgress * 0.18));

        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(render);
      };

      resizeHandler();
      render();
      window.addEventListener("resize", resizeHandler);
    };

    updateProgress();
    initializeScene().catch((error) => {
      console.error("Unable to initialize the 3D model showcase.", error);
      setStatus("error");
    });
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateProgress);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(animationFrame);
      renderer?.dispose();
    };
  }, [shouldLoad, study.mode]);

  const beginInspection = (event) => {
    const inspection = inspectionRef.current;
    inspection.active = true;
    inspection.startX = event.clientX;
    inspection.startY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("inspecting");
  };

  const updateInspection = (event) => {
    const inspection = inspectionRef.current;
    if (!inspection.active) return;
    inspection.targetX = (event.clientX - inspection.startX) * 0.008;
    inspection.targetY = (event.clientY - inspection.startY) * 0.006;
  };

  const endInspection = (event) => {
    const inspection = inspectionRef.current;
    inspection.active = false;
    inspection.targetX = 0;
    inspection.targetY = 0;
    event.currentTarget.classList.remove("inspecting");
  };

  const handleKeyboardInspection = (event) => {
    const inspection = inspectionRef.current;
    const keyOffsets = {
      ArrowLeft: [-0.2, 0],
      ArrowRight: [0.2, 0],
      ArrowUp: [0, -0.15],
      ArrowDown: [0, 0.15],
    };
    if (!keyOffsets[event.key]) return;
    event.preventDefault();
    const [x, y] = keyOffsets[event.key];
    inspection.targetX += x;
    inspection.targetY += y;
  };

  const copyOpacity = Math.max(0, 1 - progress * 3);

  return (
    <article className={`model-showcase ${study.mode}`} ref={sectionRef}>
      <div className="model-sticky">
        <canvas
          ref={canvasRef}
          tabIndex="0"
          role="img"
          aria-label={`${study.title}. Drag or use arrow keys to inspect the model.`}
          onKeyDown={handleKeyboardInspection}
          onPointerDown={beginInspection}
          onPointerMove={updateInspection}
          onPointerUp={endInspection}
          onPointerCancel={endInspection}
          onPointerLeave={endInspection}
        />
        <div className={`model-status ${status}`} role="status">
          {status === "loading" ? "LOADING 3D MODEL" : "MODEL UNAVAILABLE"}
        </div>
        <div
          className="model-meta"
          style={{ opacity: copyOpacity, transform: `translateY(${-progress * 40}px)` }}
        >
          <h3>{study.title}</h3>
          <p>{study.description}</p>
        </div>
        <div className={progress < 0.98 ? "orbit-hud" : "orbit-hud complete"}>
          <div className="orbit-dial" style={{ "--orbit-progress": `${progress * 360}deg` }}>
            <span>{Math.round(progress * 100)}</span>
          </div>
          <div>
            <strong>{progress < 0.98 ? "ORBITING MODEL" : "ORBIT COMPLETE"}</strong>
            <span>{progress < 0.98 ? "Scroll, drag, or use arrow keys" : "Continue to next section"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
