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
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 296;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 4, 4, 504, 288, 22);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#b8912f";
  roundRect(ctx, 4, 4, 504, 288, 22);
  ctx.stroke();

  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "#e4dcc8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(392, 12);
  ctx.lineTo(392, 284);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#1e2749";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText("Ticket", 34, 92);
  ctx.fillStyle = "#b8912f";
  const ticketWidth = ctx.measureText("Ticket").width;
  ctx.fillText("Area", 34 + ticketWidth + 6, 92);

  ctx.fillStyle = "#64748b";
  ctx.font = "19px sans-serif";
  ctx.fillText("CONCERT · SOIRÉE · FILM", 34, 132);
  ctx.fillText("Accès valable ce soir", 34, 160);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "15px sans-serif";
  ctx.fillText("N° A-2026-0719", 34, 250);

  const qx = 412;
  const qy = 72;
  const qrSize = 88;
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

    // Foule : nuage de particules lumineuses (lampes de téléphone dans le noir)
    const crowdCount = 420;
    const positions = new Float32Array(crowdCount * 3);
    const colorsArr = new Float32Array(crowdCount * 3);
    const baseColor = new THREE.Color(0xd4af5a);
    const altColor = new THREE.Color(0xffffff);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < crowdCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 9.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3.4;
      positions[i * 3 + 2] = -3 - Math.random() * 13;
      tmpColor.copy(Math.random() > 0.78 ? altColor : baseColor);
      colorsArr[i * 3] = tmpColor.r;
      colorsArr[i * 3 + 1] = tmpColor.g;
      colorsArr[i * 3 + 2] = tmpColor.b;
    }
    const crowdGeo = new THREE.BufferGeometry();
    crowdGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    crowdGeo.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));
    const crowdMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const crowd = new THREE.Points(crowdGeo, crowdMat);
    scene.add(crowd);

    // Billet 3D texturé : apparaît, tourne sur lui-même, s'avance vers la caméra
    const ticketTexture = makeTicketTexture();
    const ticketGeo = new THREE.PlaneGeometry(2.7, 1.56);
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

      crowdMat.opacity = Math.min(t / 2.2, 1) * 0.85;
      crowd.rotation.y = Math.sin(t * 0.05) * 0.05;

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
      crowdGeo.dispose();
      crowdMat.dispose();
      ticketGeo.dispose();
      ticketMat.dispose();
      ticketTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
