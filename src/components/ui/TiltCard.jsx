export function TiltCard({ as: Element = "article", className = "", children }) {
  const handlePointerMove = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const rotateY = (pointerX / bounds.width - 0.5) * 5;
    const rotateX = (pointerY / bounds.height - 0.5) * -5;

    card.style.setProperty("--cursor-x", `${pointerX}px`);
    card.style.setProperty("--cursor-y", `${pointerY}px`);
    card.style.setProperty("--glow-opacity", "1");
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const resetCard = (event) => {
    event.currentTarget.style.setProperty("--glow-opacity", "0");
    event.currentTarget.style.transform = "";
  };

  return (
    <Element
      className={`${className} tilt-card`}
      data-reveal
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCard}
    >
      <div className="tilt-card-content">{children}</div>
    </Element>
  );
}
