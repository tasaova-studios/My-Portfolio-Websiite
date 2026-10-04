import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Landing = ({ children }: PropsWithChildren) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const backTrackRef = useRef<HTMLDivElement>(null);
  const frontTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    const backTrack = backTrackRef.current;
    const frontTrack = frontTrackRef.current;

    const ctx = gsap.context(() => {
      // 1. Subtle scroll-driven letter animation for title
      if (el) {
        const chars = el.querySelectorAll<HTMLSpanElement>(".landing-char");
        if (chars.length) {
          gsap.to(chars, {
            opacity: 0,
            y: -30,
            filter: "blur(4px)",
            stagger: 0.02,
            ease: "power2.in",
            scrollTrigger: {
              trigger: ".landing-section",
              start: "top top",
              end: "bottom 40%",
              scrub: 1,
            },
          });
        }
      }

      // 2. Exact reference layered text animation loop
      if (backTrack && frontTrack) {
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 2.2,
        });

        tl.to([backTrack, frontTrack], {
          yPercent: -50,
          duration: 0.7,
          ease: "power3.inOut",
        }).to([backTrack, frontTrack], {
          yPercent: 0,
          duration: 0.7,
          delay: 2.2,
          ease: "power3.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="landing-section" id="landing">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1
              ref={titleRef}
              className="main-title"
              aria-label="SAHARIAR UTSHAB"
            >
              <span className="first-name">
                {"SAHARIAR".split("").map((c, i) => (
                  <span
                    key={`f-${i}`}
                    className="landing-char inline-block"
                    style={{ display: "inline-block" }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <br />
              <span className="last-name">
                {"UTSHAB".split("").map((c, i) => (
                  <span
                    key={`l-${i}`}
                    className="landing-char inline-block"
                    style={{ display: "inline-block" }}
                  >
                    {c}
                  </span>
                ))}
              </span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            
            {/* Top layered word: purple, submerged fade behind the front text */}
            <div className="landing-h2-back">
              <div className="landing-back-track" ref={backTrackRef}>
                <div className="landing-word">DESIGNER</div>
                <div className="landing-word">DEVELOPER</div>
              </div>
            </div>

            {/* Front layered word: solid white, overlapping foreground */}
            <div className="landing-h2-front">
              <div className="landing-front-track" ref={frontTrackRef}>
                <div className="landing-word">DEVELOPER</div>
                <div className="landing-word">DESIGNER</div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
