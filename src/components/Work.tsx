import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  {
    num: "01",
    title: "3D Product Visualization",
    category: "Commercial Rendering",
    tools: "Blender, Cycles, Photorealism, Studio Lighting",
    image: "/images/placeholder.webp",
  },
  {
    num: "02",
    title: "Optimized 3D Game Asset Pack",
    category: "Game-Ready 3D Assets",
    tools: "Blender, Unity, Low-Poly, Clean Topology, LODs, PBR",
    image: "/images/placeholder.webp",
  },
  {
    num: "03",
    title: "Action Indie Game Prototype",
    category: "Game Development",
    tools: "Unity 3D, C#, Physics, Character Controller, 60 FPS",
    image: "/images/placeholder.webp",
  },
  {
    num: "04",
    title: "Stylized Anime Animation Short",
    category: "Anime & Cartoon Content",
    tools: "Blender, Rigging, Stylized Shaders, YouTube/TikTok",
    image: "/images/placeholder.webp",
  },
  {
    num: "05",
    title: "Commercial Product Animation",
    category: "Motion & Branding",
    tools: "Blender, Eevee, Lighting, Camera Sequencing",
    image: "/images/placeholder.webp",
  },
  {
    num: "06",
    title: "Modular Environment Game Assets",
    category: "Game Optimization",
    tools: "Blender, Unity, Modular Pieces, Draw-Call Optimization",
    image: "/images/placeholder.webp",
  },
];

const Work = () => {
  useGSAP(() => {
    const workFlex = document.querySelector<HTMLElement>(".work-flex");
    const workSection = document.querySelector<HTMLElement>(".work-section");
    if (!workFlex || !workSection) return;

    const getScrollDistance = () => {
      if (!workFlex) return 1500;
      const totalScrollWidth = workFlex.scrollWidth;
      const viewportWidth = window.innerWidth;
      const extraPad = viewportWidth < 900 ? 40 : 80;
      return Math.max(totalScrollWidth - viewportWidth + extraPad, 600);
    };

    const getEndScroll = () => {
      const dist = getScrollDistance();
      const holdDuration = window.innerWidth < 900 ? dist * 0.7 + 250 : dist * 0.5 + 400;
      return dist + holdDuration;
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: workSection,
        start: "top top",
        end: () => `+=${getEndScroll()}`,
        scrub: window.innerWidth < 900 ? 0.3 : 0.6,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline.to(workFlex, {
      x: () => -getScrollDistance(),
      ease: "none",
    });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container">
        <h2 className="work-heading">
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {PROJECTS.map((proj) => (
            <div className="work-box" key={proj.num}>
              {/* Header with Project Number and Title */}
              <div className="work-title">
                <h3>{proj.num}</h3>
                <div>
                  <h4>{proj.title}</h4>
                  <p>{proj.category}</p>
                </div>
              </div>

              {/* 3D Image preview */}
              <WorkImage image={proj.image} alt={proj.title} />

              {/* Tools & Features info */}
              <div className="work-tools">
                <h5>Tools & Features</h5>
                <p>{proj.tools}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
