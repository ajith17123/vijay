import React, { useEffect, useRef } from "react";
import "../assets/style/Home.css";

import img1 from "../assets/images/1.jpg";
import img2 from "../assets/images/2.jpg";
import img3 from "../assets/images/3.jpg";
import img4 from "../assets/images/4.jpg";
import img5 from "../assets/images/5.jpg";
import img6 from "../assets/images/6.jpg";
import img7 from "../assets/images/7.jpg";
import img8 from "../assets/images/8.jpg";
import img9 from "../assets/images/9.jpg";
import img10 from "../assets/images/10.jpg";
import img11 from "../assets/images/11.jpg";
import img12 from "../assets/images/12.jpg";
import img13 from "../assets/images/13.jpg";
import backgroundImage from "../assets/images/background.jpg";

const TRAIL_IMAGES = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
];


// How far (in px) the cursor must travel before a new image spawns.
const DISTANCE_THRESHOLD = 90;
// How long an image image stays alive before it's removed from the DOM.
const IMAGE_LIFETIME_MS = 900;
// Rendered image size (used to center the image on the cursor).
const IMAGE_SIZE = 140;

export default function Home() {
  const trailContainerRef = useRef(null);
  const lastPosRef = useRef({ x: null, y: null });
  const imageIndexRef = useRef(0);

  useEffect(() => {
    const container = trailContainerRef.current;
    if (!container) return;

    const handleMouseMove = (event) => {
      const { clientX: x, clientY: y } = event;
      const { x: lastX, y: lastY } = lastPosRef.current;

      // First movement: just record position, don't spawn yet.
      if (lastX === null || lastY === null) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < DISTANCE_THRESHOLD) return;

      lastPosRef.current = { x, y };
      spawnTrailImage(container, x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const spawnTrailImage = (container, x, y) => {
    const img = document.createElement("img");

    // Cycle sequentially through the image array.
    const src = TRAIL_IMAGES[imageIndexRef.current % TRAIL_IMAGES.length];
    imageIndexRef.current += 1;

    img.src = src;
    img.className = "trail-image";
    img.alt = "";
    img.draggable = false;

    // Center the image on the cursor, then clamp so it never overflows
    // past the viewport edges (e.g. when the cursor moves along the
    // top/left/right/bottom of the screen).
    const half = IMAGE_SIZE / 2;
    const maxX = window.innerWidth - IMAGE_SIZE;
    const maxY = window.innerHeight - IMAGE_SIZE;
    const clampedX = Math.min(Math.max(x - half, 0), maxX);
    const clampedY = Math.min(Math.max(y - half, 0), maxY);

    img.style.left = `${clampedX}px`;
    img.style.top = `${clampedY}px`;

    // Small random rotation/drift so the trail feels organic rather than mechanical.
    const rotation = (Math.random() - 0.5) * 30; // -15deg to 15deg
    const driftX = (Math.random() - 0.5) * 40;
    const driftY = (Math.random() - 0.5) * 40;
    img.style.setProperty("--rotate", `${rotation}deg`);
    img.style.setProperty("--drift-x", `${driftX}px`);
    img.style.setProperty("--drift-y", `${driftY}px`);

    container.appendChild(img);

    // Clean up: remove the node once its animation has finished.
    setTimeout(() => {
      if (img.parentNode === container) {
        container.removeChild(img);
      }
    }, IMAGE_LIFETIME_MS);
  };

  return (
    <section className="hero-section" style={{ "--bg-image": `url(${backgroundImage})` }}>
      <div className="trail-container" ref={trailContainerRef} aria-hidden="true" />

      <div className="title-card-container">
        <span className="thalapathy-prefix" data-text="THALAPATHY">THALAPATHY</span>
        <h1 className="thalapathy-title" data-text="VIJAY">VIJAY</h1>
      </div>
    </section>
  );
}
