import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/MainTitleScroll.css";

gsap.registerPlugin(ScrollTrigger);

interface MainTitleScrollProps {
  title?: string;
  subtitle?: string;
}

const MainTitleScroll = ({
  title = "MONCY YOHANNAN",
  subtitle = "CREATIVE DEVELOPER & DESIGNER CRAFTING IMMERSIVE DIGITAL EXPERIENCES",
}: MainTitleScrollProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    if (!section || !titleEl) return;

    const chars = titleEl.querySelectorAll<HTMLSpanElement>(".char");
    const subChars = subtitleEl?.querySelectorAll<HTMLSpanElement>(".sub-char");

    const ctx = gsap.context(() => {
      // Main title letter-by-letter reveal on scroll
      if (chars.length > 0) {
        gsap.fromTo(
          chars,
          {
            opacity: 0.12,
            y: 45,
            rotateX: -60,
            scale: 0.9,
            filter: "blur(5px)",
            color: "rgba(255, 255, 255, 0.15)",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            color: "#ffffff",
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 40%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Subtitle letter-by-letter reveal following the title
      if (subChars && subChars.length > 0) {
        gsap.fromTo(
          subChars,
          {
            opacity: 0.1,
            y: 25,
            color: "rgba(194, 164, 255, 0.2)",
          },
          {
            opacity: 1,
            y: 0,
            color: "#eae5ec",
            stagger: 0.02,
            ease: "power1.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [title, subtitle]);

  // Split title into words and letters for clean wrapping and animation
  const titleWords = title.split(" ");
  const subtitleWords = subtitle.split(" ");

  return (
    <section
      ref={sectionRef}
      className="main-title-scroll-section"
      id="main-title"
      aria-label={`${title} - ${subtitle}`}
    >
      <div className="main-title-scroll-badge">
        <span className="main-title-scroll-badge-dot"></span>
        <span>Creative Developer</span>
      </div>

      <h2 ref={titleRef} className="main-scroll-title">
        {titleWords.map((word, wordIdx) => (
          <span key={`w-${wordIdx}`} className="word">
            {word.split("").map((char, charIdx) => (
              <span
                key={`c-${wordIdx}-${charIdx}`}
                className="char"
                data-char={char}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </h2>

      <p ref={subtitleRef} className="main-scroll-subtitle">
        {subtitleWords.map((word, wordIdx) => (
          <span key={`sub-w-${wordIdx}`} className="sub-word">
            {word.split("").map((char, charIdx) => (
              <span
                key={`sub-c-${wordIdx}-${charIdx}`}
                className="sub-char"
                data-char={char}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </p>
    </section>
  );
};

export default MainTitleScroll;
