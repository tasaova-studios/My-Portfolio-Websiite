import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import FreelancePerks from "./FreelancePerks";
import Contact from "./Contact";
import ThankYouNote from "./ThankYouNote";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import setSplitText from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth > 1024 : true
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />

      {/* Interactive 3D Wave Canvas in background */}
      {children}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            {/* 1. Hero / Landing */}
            <Landing />

            {/* 2. About Me */}
            <About />

            {/* 3. Services / What I Do */}
            <WhatIDo />

            {/* 4. Freelance Client Perks & Value */}
            <FreelancePerks />

            {/* 5. Skills Balls & Revolving Social Circle Contact */}
            <Contact />

            {/* 6. Outro Animated Thank You Note in the Enchanted Tree Finale */}
            <ThankYouNote />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
