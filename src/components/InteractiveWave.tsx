import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/InteractiveWave.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_052448_43259007-b7c4-4269-90bd-e3ab14e80075.mp4";

interface WindFoliageParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  type: "leaf" | "petal" | "spore" | "firefly";
  oscSpeed: number;
  oscRadius: number;
  baseX: number;
  flapPhase: number;
  flapSpeed: number;
}

const InteractiveWave = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    let targetTime = 0;
    let isSeeking = false;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const onMeta = () => {
      video.pause();
      setIsVideoReady(true);
      ScrollTrigger.refresh();
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) {
      onMeta();
    }

    // High-performance smooth seek mechanism:
    // Only seek when hardware decoder has finished the previous frame
    const performSeek = () => {
      if (!video || !video.duration || isNaN(video.duration)) return;
      if (isSeeking || video.seeking) return;

      const current = video.currentTime;
      const diff = targetTime - current;

      if (Math.abs(diff) > 0.02) {
        isSeeking = true;
        // Apply smooth dampening for cinematic feel
        const nextTime = Math.min(
          video.duration - 0.01,
          Math.max(0, current + diff * 0.5)
        );
        video.currentTime = nextTime;
      }
    };

    const onSeeked = () => {
      isSeeking = false;
      if (video && video.duration && !isNaN(video.duration)) {
        const diff = Math.abs(video.currentTime - targetTime);
        if (diff > 0.03) {
          requestAnimationFrame(performSeek);
        }
      }
    };

    video.addEventListener("seeked", onSeeked);

    // ScrollTrigger to drive target video time purely by scrollbar position
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (!video || !video.duration || isNaN(video.duration)) return;
        targetTime = Math.min(
          video.duration - 0.01,
          Math.max(0, self.progress * video.duration)
        );
        performSeek();

        const currentY = window.scrollY;
        const delta = Math.abs(currentY - lastScrollY);
        lastScrollY = currentY;
        scrollVelocity = Math.min(delta / 10, 3.0);

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          scrollVelocity = 0;
        }, 100);
      },
    });

    // --- CONTINUOUS LIVING WIND & SWAYING FOLIAGE PARTICLES CANVAS ---
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: WindFoliageParticle[] = [];
    const colors = [
      "rgba(192, 132, 252, ", // Mystic purple
      "rgba(244, 114, 182, ", // Glowing magenta/pink
      "rgba(168, 85, 247, ",  // Violet
      "rgba(56, 189, 248, ",  // Cyan bioluminescent
      "rgba(134, 239, 172, ", // Vibrant foliage green
      "rgba(255, 255, 255, ", // Pure starlight
    ];

    const particleCount = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      const type: WindFoliageParticle["type"] =
        rand > 0.65 ? "leaf" : rand > 0.35 ? "petal" : rand > 0.15 ? "spore" : "firefly";

      const size =
        type === "leaf"
          ? 6 + Math.random() * 7
          : type === "petal"
          ? 4 + Math.random() * 5
          : type === "firefly"
          ? 3 + Math.random() * 3
          : 1.5 + Math.random() * 2.5;

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      particles.push({
        x,
        baseX: x,
        y,
        vx: 0.6 + Math.random() * 1.2,
        vy: -0.3 + (Math.random() - 0.5) * 0.8,
        size,
        alpha: 0.4 + Math.random() * 0.55,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        type,
        oscSpeed: 0.015 + Math.random() * 0.025,
        oscRadius: 18 + Math.random() * 32,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.04 + Math.random() * 0.06,
      });
    }

    let time = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      time += 0.02;

      // Keep seeking smoothly if there is remaining target diff
      performSeek();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ambientBreeze = Math.sin(time * 1.2) * 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.flapPhase += p.flapSpeed;
        const currentWind = p.vx + ambientBreeze + scrollVelocity * 1.5;

        p.baseX += currentWind;
        p.x = p.baseX + Math.sin(time * p.oscSpeed * 40 + i) * p.oscRadius;
        p.y += p.vy + Math.cos(time * p.oscSpeed * 30 + i) * 0.8 - scrollVelocity * 0.6;
        p.rotation += p.rotSpeed + (scrollVelocity > 0 ? 0.02 : 0);

        if (p.x > canvas.width + 40) {
          p.x = -30;
          p.baseX = -30;
          p.y = Math.random() * canvas.height;
        }
        if (p.y < -30) p.y = canvas.height + 20;
        if (p.y > canvas.height + 30) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const flutter = Math.sin(p.flapPhase);

        if (p.type === "leaf") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * (0.6 + 0.4 * flutter), p.size * 1.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.75})`;
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.4);
          ctx.lineTo(0, p.size * 1.4);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.type === "petal") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * (0.8 + 0.2 * flutter), p.size * 1.5, 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.8})`;
          ctx.shadowColor = "#c084fc";
          ctx.shadowBlur = 10;
          ctx.fill();
        } else if (p.type === "firefly") {
          const pulse = 0.5 + 0.5 * Math.sin(time * 3 + i);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          grad.addColorStop(0, `${p.color}${p.alpha * pulse})`);
          grad.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowColor = "#f472b6";
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      trigger.kill();
      clearTimeout(scrollTimeout);
      window.removeEventListener("resize", resizeCanvas);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <div className="site-video-background-container">
      <div className="site-video-wind-wrapper">
        <video
          ref={videoRef}
          className="site-video-background"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
        >
          <source src="/reference_video.mp4" type="video/mp4" />
          <source
            src="/hf_20260624_052448_43259007-b7c4-4269-90bd-e3ab14e80075.mp4"
            type="video/mp4"
          />
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      <canvas ref={canvasRef} className="site-video-blast-canvas" />
      <div className="site-video-overlay" />
    </div>
  );
};

export default InteractiveWave;
