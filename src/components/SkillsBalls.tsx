import { useEffect, useRef } from "react";
import "./styles/SkillsBalls.css";

interface SkillBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color1: string;
  color2: string;
  textColor: string;
  mass: number;
}

const SKILLS_DATA = [
  { label: "Blender", color1: "#ea7600", color2: "#221400", textColor: "#ffffff", radius: 46 },
  { label: "Unity", color1: "#ffffff", color2: "#222222", textColor: "#000000", radius: 45 },
  { label: "C#", color1: "#9b4f96", color2: "#2d1230", textColor: "#ffffff", radius: 42 },
  { label: "Product Viz", color1: "#38bdf8", color2: "#0c4a6e", textColor: "#ffffff", radius: 46 },
  { label: "3D Renders", color1: "#f43f5e", color2: "#4c0519", textColor: "#ffffff", radius: 44 },
  { label: "AI Workflow", color1: "#00dfd8", color2: "#003240", textColor: "#ffffff", radius: 45 },
  { label: "Game Assets", color1: "#f59e0b", color2: "#451a03", textColor: "#ffffff", radius: 44 },
  { label: "Low-Poly", color1: "#8b5cf6", color2: "#2e1065", textColor: "#ffffff", radius: 42 },
  { label: "3D Anime", color1: "#ec4899", color2: "#500724", textColor: "#ffffff", radius: 42 },
  { label: "Optimized", color1: "#10b981", color2: "#064e3b", textColor: "#ffffff", radius: 42 },
];

const SkillsBalls = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const getScale = (w: number) => (w < 480 ? 0.68 : w < 768 ? 0.82 : 1);

    // Initialize Balls with random positions & velocities
    const balls: SkillBall[] = SKILLS_DATA.map((item) => {
      const scale = getScale(width);
      const radius = Math.round(item.radius * scale);
      return {
        x: radius + Math.random() * (width - radius * 2),
        y: radius + Math.random() * (height - radius * 2),
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        radius,
        label: item.label,
        color1: item.color1,
        color2: item.color2,
        textColor: item.textColor,
        mass: radius,
      };
    });

    // Mouse / Touch Interaction State
    const mouse = {
      x: -1000,
      y: -1000,
      isDown: false,
      draggedBall: null as SkillBall | null,
      prevX: 0,
      prevY: 0,
    };

    const getCanvasPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      mouse.isDown = true;
      mouse.x = pos.x;
      mouse.y = pos.y;
      mouse.prevX = pos.x;
      mouse.prevY = pos.y;

      // Check if clicking inside a ball
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dist = Math.hypot(b.x - pos.x, b.y - pos.y);
        if (dist <= b.radius) {
          mouse.draggedBall = b;
          break;
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      mouse.x = pos.x;
      mouse.y = pos.y;

      if (mouse.draggedBall) {
        mouse.draggedBall.vx = (pos.x - mouse.prevX) * 0.8;
        mouse.draggedBall.vy = (pos.y - mouse.prevY) * 0.8;
        mouse.draggedBall.x = pos.x;
        mouse.draggedBall.y = pos.y;
        mouse.prevX = pos.x;
        mouse.prevY = pos.y;
      }
    };

    const onMouseUp = () => {
      mouse.isDown = false;
      mouse.draggedBall = null;
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = getCanvasPos(touch.clientX, touch.clientY);
        mouse.isDown = true;
        mouse.x = pos.x;
        mouse.y = pos.y;
        mouse.prevX = pos.x;
        mouse.prevY = pos.y;

        for (let i = balls.length - 1; i >= 0; i--) {
          const b = balls[i];
          if (Math.hypot(b.x - pos.x, b.y - pos.y) <= b.radius) {
            mouse.draggedBall = b;
            break;
          }
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = getCanvasPos(touch.clientX, touch.clientY);
        mouse.x = pos.x;
        mouse.y = pos.y;

        if (mouse.draggedBall) {
          mouse.draggedBall.vx = (pos.x - mouse.prevX) * 0.8;
          mouse.draggedBall.vy = (pos.y - mouse.prevY) * 0.8;
          mouse.draggedBall.x = pos.x;
          mouse.draggedBall.y = pos.y;
          mouse.prevX = pos.x;
          mouse.prevY = pos.y;
        }
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    const onResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
      const scale = getScale(width);
      balls.forEach((b, i) => {
        b.radius = Math.round(SKILLS_DATA[i].radius * scale);
        b.mass = b.radius;
      });
    };
    window.addEventListener("resize", onResize);

    // Physics Animation Loop
    let animId: number;
    const gravity = 0.08;
    const damping = 0.985;
    const bounce = 0.82;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      // Update positions & physics
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        if (b !== mouse.draggedBall) {
          b.vy += gravity;
          b.vx *= damping;
          b.vy *= damping;

          // Mouse gentle repulsion if hovered nearby
          if (!mouse.isDown) {
            const distMouse = Math.hypot(b.x - mouse.x, b.y - mouse.y);
            if (distMouse < b.radius + 60 && distMouse > 0) {
              const force = (1 - distMouse / (b.radius + 60)) * 2;
              b.vx += ((b.x - mouse.x) / distMouse) * force;
              b.vy += ((b.y - mouse.y) / distMouse) * force;
            }
          }

          b.x += b.vx;
          b.y += b.vy;

          // Boundary collisions
          if (b.x - b.radius < 0) {
            b.x = b.radius;
            b.vx = -b.vx * bounce;
          } else if (b.x + b.radius > width) {
            b.x = width - b.radius;
            b.vx = -b.vx * bounce;
          }

          if (b.y - b.radius < 0) {
            b.y = b.radius;
            b.vy = -b.vy * bounce;
          } else if (b.y + b.radius > height) {
            b.y = height - b.radius;
            b.vy = -b.vy * bounce;
          }
        }
      }

      // Ball-to-Ball Elastic Collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist && dist > 0) {
            // Overlap resolution
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            if (b1 !== mouse.draggedBall) {
              b1.x -= nx * overlap;
              b1.y -= ny * overlap;
            }
            if (b2 !== mouse.draggedBall) {
              b2.x += nx * overlap;
              b2.y += ny * overlap;
            }

            // Elastic impulse
            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

            if (b1 !== mouse.draggedBall) {
              b1.vx -= p * b2.mass * nx * bounce;
              b1.vy -= p * b2.mass * ny * bounce;
            }
            if (b2 !== mouse.draggedBall) {
              b2.vx += p * b1.mass * nx * bounce;
              b2.vy += p * b1.mass * ny * bounce;
            }
          }
        }
      }

      // Draw Balls with 3D spherical gradient & glowing labels
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        // 3D Sphere Radial Gradient
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        grad.addColorStop(0, b.color1);
        grad.addColorStop(0.7, b.color2);
        grad.addColorStop(1, "#050306");

        // Outer glow
        ctx.save();
        ctx.shadowColor = b.color1;
        ctx.shadowBlur = b === mouse.draggedBall ? 25 : 12;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // Subtle specular rim highlight
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius - 1, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Sphere specular glint
        ctx.beginPath();
        ctx.arc(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fill();

        // Label text inside ball
        const words = b.label.split(" ");
        if (words.length === 2) {
          const fontSize = Math.max(10, Math.floor(b.radius * 0.28));
          ctx.font = `700 ${fontSize}px Geist, sans-serif`;
          ctx.fillStyle = b.textColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(words[0], b.x, b.y - fontSize * 0.58);
          ctx.fillText(words[1], b.x, b.y + fontSize * 0.58);
        } else {
          ctx.font = `700 ${Math.max(12, Math.floor(b.radius * 0.35))}px Geist, sans-serif`;
          ctx.fillStyle = b.textColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(b.label, b.x, b.y);
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="skills-balls-wrapper">
      <div className="skills-balls-header">
        <div className="skills-balls-title">
          <span>Interactive Skills Arena</span>
        </div>
        <div className="skills-balls-hint">
          Drag, throw, or push the tech spheres
        </div>
      </div>
      <canvas ref={canvasRef} className="skills-balls-canvas" />
    </div>
  );
};

export default SkillsBalls;
