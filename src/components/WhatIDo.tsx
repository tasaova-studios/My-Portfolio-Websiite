import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }

    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO" id="what-i-do" ref={sectionRef}>
      <div className="what-box">
        <div className="what-title-wrap">
          <div className="what-subtitle">
            <span className="what-badge-dot"></span>
            SERVICES &amp; EXPERTISE
          </div>
          <h2 className="title">
            W<span className="hat-h2">HAT</span>
            <div>
              I<span className="do-h2"> DO</span>
            </div>
          </h2>
          <div className="what-title-underline"></div>
        </div>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>3D PRODUCT VIZ &amp; RENDERING</h3>
              <h4>Photorealistic Product Imagery in Blender</h4>
              <p>
                Crafting high-end photorealistic 3D product visualizations in
                Blender (Cycles/Eevee) for e-commerce, hardware brands, and
                commercial showcases—complete with precision studio lighting,
                realistic PBR materials, and clean image renders.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Blender</div>
                <div className="what-tags">Product Viz</div>
                <div className="what-tags">3D Renders</div>
                <div className="what-tags">Cycles / Eevee</div>
                <div className="what-tags">PBR Materials</div>
                <div className="what-tags">Studio Lighting</div>
                <div className="what-tags">Photorealism</div>
                <div className="what-tags">High-Res Export</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>UNITY GAME DEV &amp; ASSETS</h3>
              <h4>C# Mechanics &amp; Optimized 3D Game Assets</h4>
              <p>
                Developing indie game mechanics in Unity with clean C#, and
                crafting game-ready 3D assets (low-poly props, modular
                environments) built with optimized topology, efficient draw-calls,
                and LODs for high 60+ FPS performance.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Unity</div>
                <div className="what-tags">C#</div>
                <div className="what-tags">Game Assets</div>
                <div className="what-tags">Optimization</div>
                <div className="what-tags">Low-Poly</div>
                <div className="what-tags">Physics</div>
                <div className="what-tags">Modular Design</div>
                <div className="what-tags">Clean Topology</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 2)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>AI WORKFLOW &amp; RAPID SITES</h3>
              <h4>AI-Accelerated Web Creation &amp; 10x Pipeline</h4>
              <p>
                Harnessing state-of-the-art AI workflows to rapidly design and
                construct modern web experiences, fast-track concept ideation, and
                streamline the creative pipeline—delivering polished client
                results with extreme speed and cost efficiency.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">AI Workflow</div>
                <div className="what-tags">Rapid Websites</div>
                <div className="what-tags">Fast Turnaround</div>
                <div className="what-tags">Pipeline Speed</div>
                <div className="what-tags">Prototyping</div>
                <div className="what-tags">Modern Web</div>
                <div className="what-tags">Productivity 10x</div>
                <div className="what-tags">Automation</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
