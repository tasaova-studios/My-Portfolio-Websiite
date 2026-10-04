import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | null = null;

const Navbar = () => {
  useEffect(() => {
    const isDesktop =
      typeof window !== "undefined" &&
      window.innerWidth > 1024 &&
      !("ontouchstart" in window);

    if (isDesktop) {
      try {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.4,
          speed: 1.4,
          effects: true,
          autoResize: true,
          ignoreMobileResize: true,
        });

        if (smoother) {
          smoother.scrollTop(0);
          if (typeof smoother.paused === "function") {
            smoother.paused(false);
          }
          ScrollTrigger.refresh();
        }
      } catch {
        // Fallback to native scroll
      }
    }

    const links = document.querySelectorAll(".header ul a, .navbar-title");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const currentElem = e.currentTarget as HTMLAnchorElement;
        const section = currentElem.getAttribute("data-href") || currentElem.getAttribute("href");

        if (section === "#landing" || section === "#" || section === "/#" || section === "#landingDiv") {
          if (smoother && typeof smoother.scrollTo === "function") {
            smoother.scrollTo(0, true);
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          return;
        }

        if (smoother && typeof smoother.scrollTo === "function" && section) {
          smoother.scrollTo(section, true, "top top");
        } else if (section) {
          const target = document.querySelector(section);
          target?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    const onResize = () => {
      if (smoother && typeof ScrollSmoother !== "undefined" && ScrollSmoother.refresh) {
        ScrollSmoother.refresh(true);
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className="header">
        <a
          href="/#"
          className="navbar-title"
          data-cursor="disable"
          title="TASAOVA STUDIOS"
        >
          <img
            src="/tasaova_logo.jpg"
            alt="TASAOVA STUDIOS Logo"
            className="navbar-logo-img"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + "/images/tasaova_logo.jpg") {
                target.src = "/images/tasaova_logo.jpg";
              }
            }}
          />
          <span className="navbar-logo-text">TASAOVA STUDIOS</span>
        </a>

        {/* Center Pill Nav Bar */}
        <nav className="header-nav-pill">
          <ul className="header-links">
            <li>
              <a data-href="#landing" href="#landing">
                <HoverLinks text="HOME" />
              </a>
            </li>
            <li>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#what-i-do" href="#what-i-do">
                <HoverLinks text="SERVICES" />
              </a>
            </li>
            <li>
              <a data-href="#freelance-perks" href="#freelance-perks">
                <HoverLinks text="WHY ME" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Email Capsule Button with Glowing Green Online Indicator */}
        <a
          href="mailto:tasaovastudios.official@gmail.com"
          className="navbar-connect-btn"
          data-cursor="disable"
          title="Contact via Email"
        >
          <span className="online-indicator">
            <span className="online-ping"></span>
            <span className="online-dot"></span>
          </span>
          <span className="navbar-email-text">tasaovastudios.official@gmail.com</span>
        </a>
      </div>
    </>
  );
};

export default Navbar;
