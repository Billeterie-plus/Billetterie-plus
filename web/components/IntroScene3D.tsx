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
  // Format allongé de vrai billet de concert à souche (pas une carte) : corps principal + souche détachable
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

  // Corps principal : logo + infos du concert
  ctx.fillStyle = "#1e2749";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("Ticket", 32, 76);
  ctx.fillStyle = "#b8912f";
  const ticketWidth = ctx.measureText("Ticket").width;
  ctx.fillText("Area", 32 + ticketWidth + 6, 76);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 13px sans-serif";
  ctx.fillText("PASS CONCERT", 32, 100);

  ctx.fillStyle = "#334155";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("CONCERT LIVE — CE SOIR", 32, 138);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "15px sans-serif";
  ctx.fillText("Scène Tamil · Ouverture des portes 20h", 32, 162);

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

function makeGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const gradient = ctx.createRadialGradient(256, 130, 10, 256, 130, 260);
  gradient.addColorStop(0, "rgba(212,175,90,0.55)");
  gradient.addColorStop(0.5, "rgba(59,74,122,0.25)");
  gradient.addColorStop(1, "rgba(16,21,43,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);
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
    scene.fog = new THREE.FogExp2(0x10152b, 0.022);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    camera.position.set(0, 3.2, 27);
    camera.lookAt(0, 3.4, -12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x223055, 0.7));

    // --- Salle de concert : murs, sol et rangées de sièges pour donner du volume ---
    const wallMat = new THREE.MeshBasicMaterial({ color: 0x141b3a, transparent: true, opacity: 0.55, side: THREE.DoubleSide });

    const backWallGeo = new THREE.PlaneGeometry(34, 18);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 7, -22);
    scene.add(backWall);

    const sideWallGeo = new THREE.PlaneGeometry(40, 16);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-14, 6, -6);
    leftWall.rotation.y = Math.PI / 7;
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(14, 6, -6);
    rightWall.rotation.y = -Math.PI / 7;
    scene.add(rightWall);

    const floorGeo = new THREE.PlaneGeometry(40, 44);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x0b0f22, transparent: true, opacity: 0.7 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.02, 4);
    scene.add(floor);

    // Lueur douce sur le mur du fond, derrière la scène
    const glowTexture = makeGlowTexture();
    const glowGeo = new THREE.PlaneGeometry(26, 13);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 8, -21.8);
    scene.add(glow);

    // Structure de scène (rampe verticale) devant le mur du fond
    const stageGroup = new THREE.Group();
    const barGeo = new THREE.BoxGeometry(0.15, 5.5, 0.15);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x3b4a7a, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(-6.4 + i * 3.2, 5.2, -15);
      stageGroup.add(bar);
    }
    scene.add(stageGroup);

    // Rangées de sièges (public), en instanced mesh pour un seul draw call
    const seatGeo = new THREE.BoxGeometry(0.55, 0.5, 0.5);
    const seatMat = new THREE.MeshBasicMaterial({ color: 0x1a2148, transparent: true, opacity: 0.75 });
    const rows = 6;
    const cols = 13;
    const seats = new THREE.InstancedMesh(seatGeo, seatMat, rows * cols);
    const dummy = new THREE.Object3D();
    let seatIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dummy.position.set((c - (cols - 1) / 2) * 0.95, 0.25, 5.5 - r * 1.15);
        dummy.updateMatrix();
        seats.setMatrixAt(seatIdx++, dummy.matrix);
      }
    }
    scene.add(seats);

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
      backWallGeo.dispose();
      sideWallGeo.dispose();
      wallMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      glowTexture.dispose();
      barGeo.dispose();
      barMat.dispose();
      seatGeo.dispose();
      seatMat.dispose();
      ticketGeo.dispose();
      ticketMat.dispose();
      ticketTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
