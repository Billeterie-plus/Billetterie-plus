"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTicketTexture(): THREE.CanvasTexture {
  // Format allongé de vrai billet à souche (pas une carte) : corps principal + souche détachable
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const stubX = 470; // séparation corps / souche

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 4, 4, 632, 232, 18);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#b8912f";
  roundRect(ctx, 4, 4, 632, 232, 18);
  ctx.stroke();

  // Souche légèrement teintée pour la distinguer du corps
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, 4, 4, 632, 232, 18);
  ctx.clip();
  ctx.fillStyle = "#faf6ea";
  ctx.fillRect(stubX, 4, 170, 232);
  ctx.restore();

  // Ligne de perforation
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "#c9b98a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(stubX, 6);
  ctx.lineTo(stubX, 234);
  ctx.stroke();
  ctx.setLineDash([]);

  // Encoches "déchirées" sur les bords, découpées réellement (transparence)
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(stubX, 4, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(stubX, 236, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Corps principal : logo + infos
  ctx.fillStyle = "#1e2749";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("Ticket", 32, 76);
  ctx.fillStyle = "#b8912f";
  const ticketWidth = ctx.measureText("Ticket").width;
  ctx.fillText("Area", 32 + ticketWidth + 6, 76);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 13px sans-serif";
  ctx.fillText("PASS D'ACCÈS", 32, 100);

  ctx.fillStyle = "#334155";
  ctx.font = "20px sans-serif";
  ctx.fillText("CONCERT · SOIRÉE · FILM", 32, 138);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "15px sans-serif";
  ctx.fillText("Accès valable ce soir", 32, 162);

  // Ligne de séparation fine + infos type "porte / place"
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(32, 182);
  ctx.lineTo(438, 182);
  ctx.stroke();

  const cols = [
    { label: "PORTE", value: "A3", x: 32 },
    { label: "RANG", value: "12", x: 170 },
    { label: "PLACE", value: "24", x: 308 },
  ];
  cols.forEach((c) => {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 11px sans-serif";
    ctx.fillText(c.label, c.x, 202);
    ctx.fillStyle = "#1e2749";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(c.value, c.x, 225);
  });

  // Souche : QR stylisé + texte vertical "ADMIT ONE"
  const qrSize = 84;
  const qx = stubX + 43;
  const qy = 34;
  const cells = 8;
  const cell = qrSize / cells;
  ctx.fillStyle = "#1e2749";
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      if ((i * 7 + j * 3) % 5 < 2) {
        ctx.fillRect(qx + i * cell, qy + j * cell, cell - 1.5, cell - 1.5);
      }
    }
  }

  ctx.save();
  ctx.translate(stubX + 30, 210);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#8f6f22";
  ctx.font = "600 13px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ADMIT ONE  ·  TICKET AREA", 0, 4);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function IntroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x10152b, 0.026);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    camera.position.set(0, 3.2, 27);
    camera.lookAt(0, 3.4, -12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x223055, 0.7));
    const point = new THREE.PointLight(0xd4af5a, 1.3, 30);
    point.position.set(0, 6, -4);
    scene.add(point);

    // Faisceaux de spots volumétriques depuis le plafond de la scène
    const beamColors = [0xd4af5a, 0x10b981, 0x8fa0e0];
    const beams: THREE.Mesh[] = [];
    beamColors.forEach((color, i) => {
      const geo = new THREE.ConeGeometry(4.4, 17, 28, 1, true);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 1) * 4.2, 11.5, -13);
      mesh.rotation.x = Math.PI;
      mesh.rotation.z = (i - 1) * 0.22;
      scene.add(mesh);
      beams.push(mesh);
    });

    // Structure de scène (rampe verticale)
    const stageGroup = new THREE.Group();
    const barGeo = new THREE.BoxGeometry(0.15, 5.5, 0.15);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x3b4a7a, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(-6.4 + i * 3.2, 5.2, -15);
      stageGroup.add(bar);
    }
    scene.add(stageGroup);

    // Billet 3D texturé : apparaît, tourne sur lui-même, s'avance vers la caméra
    const ticketTexture = makeTicketTexture();
    const ticketGeo = new THREE.PlaneGeometry(3.2, 1.2);
    const ticketMat = new THREE.MeshBasicMaterial({
      map: ticketTexture,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0,
    });
    const ticket = new THREE.Mesh(ticketGeo, ticketMat);
    ticket.position.set(0, 3.4, 4);
    scene.add(ticket);

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    let raf = 0;
    const start = performance.now();
    let disposed = false;

    function animate(now: number) {
      if (disposed) return;
      const t = (now - start) / 1000;

      const dollyT = Math.min(t / 5.2, 1);
      const eased = 1 - Math.pow(1 - dollyT, 3);
      camera.position.z = 27 - eased * 21;
      camera.position.x = Math.sin(t * 0.35) * 0.6;
      camera.position.y = 3.2 + Math.sin(t * 0.5) * 0.15;
      camera.lookAt(0, 3.4, camera.position.z - 12);

      beams.forEach((b, i) => {
        b.rotation.z = (i - 1) * 0.22 + Math.sin(t * 0.6 + i) * 0.15;
        (b.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 0.8 + i) * 0.04 + Math.min(t / 1.2, 1) * 0.08;
      });

      const ticketStart = 1.6;
      const ticketDuration = 2.4;
      const tt = Math.max(0, Math.min((t - ticketStart) / ticketDuration, 1));
      if (tt > 0) {
        ticketMat.opacity = tt < 0.85 ? Math.min(tt / 0.15, 1) : Math.max(0, (1 - tt) / 0.15);
        ticket.position.z = 4 - tt * 15;
        ticket.rotation.y = tt * Math.PI * 4;
        ticket.position.y = 3.4 + Math.sin(tt * Math.PI) * 0.4;
      } else {
        ticketMat.opacity = 0;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      beams.forEach((b) => {
        b.geometry.dispose();
        (b.material as THREE.Material).dispose();
      });
      barGeo.dispose();
      barMat.dispose();
      ticketGeo.dispose();
      ticketMat.dispose();
      ticketTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
