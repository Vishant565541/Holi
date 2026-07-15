"use client";

import React, { useRef, useEffect, useState } from "react";

interface Point {
  lat: number;
  lng: number;
  label: string;
}

const DESTINATIONS: Point[] = [
  { lat: 28.6139, lng: 77.209, label: "New Delhi Hub" },
  { lat: 30.7346, lng: 79.0669, label: "Kedarnath Sanctuary" },
  { lat: 34.0837, lng: 74.7973, label: "Srinagar Terminal" },
  { lat: 15.2993, lng: 74.124, label: "Goa Beachfront Heliport" },
  { lat: 9.9312, lng: 76.2673, label: "Kochi Marine Terminal" },
];

export default function GlobeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let autoRotateAngle = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Coordinate conversion
    const latLngToXYZ = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -radius * Math.sin(phi) * Math.sin(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta),
      };
    };

    // Rotate point in 3D
    const rotateX = (x: number, y: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x, y: y * cos - z * sin, z: y * sin + z * cos };
    };

    const rotateY = (x: number, y: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) * 0.38;
      const cx = width / 2;
      const cy = height / 2;

      // Update rotation
      if (!isDragging) {
        autoRotateAngle += 0.002;
      }
      const currentRotX = rotation.x;
      const currentRotY = rotation.y + autoRotateAngle;

      // Draw background ambient halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
      halo.addColorStop(0, "rgba(212, 175, 55, 0.04)");
      halo.addColorStop(0.5, "rgba(45, 212, 191, 0.02)");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw globe base circle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw latitude/longitude grid rings
      for (let i = -4; i <= 4; i++) {
        const ringLat = (i * 90) / 5;
        const ringRad = radius * Math.cos(ringLat * (Math.PI / 180));
        const ringY = radius * Math.sin(ringLat * (Math.PI / 180));

        // Projects the ring in 3D
        ctx.beginPath();
        for (let a = 0; a <= 360; a += 10) {
          const theta = a * (Math.PI / 180);
          const x3d = ringRad * Math.sin(theta);
          const z3d = ringRad * Math.cos(theta);

          const r1 = rotateX(x3d, ringY, z3d, currentRotX);
          const r2 = rotateY(r1.x, r1.y, r1.z, currentRotY);

          if (r2.z > 0) {
            if (a === 0) ctx.moveTo(cx + r2.x, cy - r2.y);
            else ctx.lineTo(cx + r2.x, cy - r2.y);
          }
        }
        ctx.strokeStyle = "rgba(255,255,255,0.02)";
        ctx.stroke();
      }

      // Draw longitude vertical loops
      for (let i = 0; i < 6; i++) {
        const ringLng = (i * 180) / 6;

        ctx.beginPath();
        for (let a = -90; a <= 90; a += 5) {
          const phi = a * (Math.PI / 180);
          const theta = ringLng * (Math.PI / 180);
          const x3d = radius * Math.cos(phi) * Math.sin(theta);
          const y3d = radius * Math.sin(phi);
          const z3d = radius * Math.cos(phi) * Math.cos(theta);

          const r1 = rotateX(x3d, y3d, z3d, currentRotX);
          const r2 = rotateY(r1.x, r1.y, r1.z, currentRotY);

          if (r2.z > 0) {
            if (a === -90) ctx.moveTo(cx + r2.x, cy - r2.y);
            else ctx.lineTo(cx + r2.x, cy - r2.y);
          }
        }
        ctx.strokeStyle = "rgba(255,255,255,0.02)";
        ctx.stroke();
      }

      // Render coordinates & markers
      const projectedPoints: { x: number; y: number; z: number; label: string }[] = [];
      DESTINATIONS.forEach((pt) => {
        const ptXYZ = latLngToXYZ(pt.lat, pt.lng, radius);
        const r1 = rotateX(ptXYZ.x, ptXYZ.y, ptXYZ.z, currentRotX);
        const r2 = rotateY(r1.x, r1.y, r1.z, currentRotY);

        if (r2.z > 0) {
          projectedPoints.push({ x: cx + r2.x, y: cy - r2.y, z: r2.z, label: pt.label });
        }
      });

      // Draw flights connecting Delhi Hub to other stations
      const delhi = projectedPoints.find((p) => p.label.includes("Delhi"));
      if (delhi) {
        projectedPoints.forEach((dest) => {
          if (dest.label === delhi.label) return;

          // Draw bezier arc between Delhi and destination
          ctx.beginPath();
          ctx.moveTo(delhi.x, delhi.y);

          // Control point pulled slightly outward to create 3D curved feeling
          const midX = (delhi.x + dest.x) / 2;
          const midY = (delhi.y + dest.y) / 2 - 50;

          ctx.quadraticCurveTo(midX, midY, dest.x, dest.y);
          ctx.strokeStyle = "rgba(214, 175, 55, 0.15)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Flight particle pulsing along path
          const time = Date.now() * 0.001;
          const progress = (time % 2) / 2; // Loop from 0 to 1 every 2 seconds
          const t = progress;

          // Bezier calculation
          const pX = (1 - t) * (1 - t) * delhi.x + 2 * (1 - t) * t * midX + t * t * dest.x;
          const pY = (1 - t) * (1 - t) * delhi.y + 2 * (1 - t) * t * midY + t * t * dest.y;

          ctx.fillStyle = "#2DD4BF";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#2DD4BF";
          ctx.beginPath();
          ctx.arc(pX, pY, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0; // reset shadow
        });
      }

      // Draw location markers
      projectedPoints.forEach((pt) => {
        // Glowing gold dot
        ctx.fillStyle = "#D4AF37";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Outer pulse circle
        const scale = 1 + (Date.now() % 1500) / 1500;
        ctx.strokeStyle = `rgba(214, 175, 55, ${1 - (scale - 1)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4 * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Label layout
        ctx.font = "10px var(--font-manrope)";
        ctx.fillStyle = "#94A3B8";
        ctx.textAlign = "center";
        ctx.fillText(pt.label, pt.x, pt.y - 10);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: rotation.x, y: rotation.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setRotation({
      x: rotationStart.current.x + deltaY * 0.005,
      y: rotationStart.current.y + deltaX * 0.005,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="block"
      />
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="font-luxury text-[10px] tracking-widest text-gold/50 uppercase">
          Drag Earth to explore helicopter pathways
        </span>
      </div>
    </div>
  );
}
