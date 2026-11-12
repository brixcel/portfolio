"use client";
/* eslint-disable react-hooks/immutability, react-hooks/refs -- R3F: three.js objects are mutated imperatively per frame, outside React state */

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getGsap } from "../lib/motion";

const MODEL = "/models/desk.glb";
const DRACO = "/draco/"; // self-hosted decoder, copied from three/examples/jsm/libs/draco/gltf

// Same camera as the Blender poster render (desk-poster-*.webp), converted from Blender Z-up to glTF Y-up.
const CAM_POS = new THREE.Vector3(8.6, 8.4, 12.6);
const CAM_AIM = new THREE.Vector3(0.35, 0.4, 0.05);
const LAMP_TARGET = new THREE.Vector3(0.2, 0, 0.35);
const FOV = 30; // vertical; Blender poster lens = 12 / tan(FOV / 2) mm on a 24 mm vertical sensor
const PORTRAIT_KEY = new THREE.Vector3(4.15, 2.0, 0.75);

export const HOTSPOTS = {
  Laptop: { label: "Synctask", href: "#synctask" },
  Notebook: { label: "Egoist Labs CI/CD", href: "#egoist-cicd" },
  RC_car: { label: "IoT RC car", href: "#projects" },
} as const;
type Hotspot = keyof typeof HOTSPOTS;

function hotspotOf(o: THREE.Object3D | null): Hotspot | null {
  for (let n = o; n; n = n.parent) if (n.name in HOTSPOTS) return n.name as Hotspot;
  return null;
}

type Look = { pos: THREE.Vector3; aim: THREE.Vector3 };

function Desk({ dark, mobile, power, look }: { dark: boolean; mobile: boolean; power: { v: number }; look: Look }) {
  const { scene } = useGLTF(MODEL, DRACO);
  const [hovered, setHovered] = useState<Hotspot | null>(null);
  const busy = useRef(false);

  const parts = useMemo(() => {
    const groups = {} as Record<Hotspot, { obj: THREE.Object3D; baseY: number; top: THREE.Vector3; center: THREE.Vector3 }>;
    for (const name of Object.keys(HOTSPOTS) as Hotspot[]) {
      const obj = scene.getObjectByName(name)!;
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      groups[name] = { obj, baseY: obj.position.y, top: new THREE.Vector3(center.x, box.max.y + 0.35, center.z), center };
    }
    const mats: Record<string, THREE.MeshStandardMaterial> = {};
    const lamp = scene.getObjectByName("Lamp");
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.receiveShadow = !mobile;
      // The spot sits inside the bulb and shade: lamp parts must not shadow their own light.
      let inLamp = false;
      for (let n: THREE.Object3D | null = m; n; n = n.parent) if (n === lamp) inLamp = true;
      m.castShadow = !mobile && !inLamp;
      const mat = m.material as THREE.MeshStandardMaterial;
      mats[mat.name] = mat;
    });
    const bulb = scene.getObjectByName("Lamp_bulb")!.getWorldPosition(new THREE.Vector3());
    return { groups, mats, bulb };
  }, [scene, mobile]);

  const spot = useRef<THREE.SpotLight>(null);
  const glow = useRef<THREE.PointLight>(null);
  const target = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.copy(LAMP_TARGET);
    return t;
  }, []);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 10);
    for (const name of Object.keys(parts.groups) as Hotspot[]) {
      const g = parts.groups[name];
      const y = g.baseY + (hovered === name ? 0.14 : 0);
      g.obj.position.y += (y - g.obj.position.y) * k;
    }
    const p = power.v;
    if (spot.current) spot.current.intensity = (dark ? 160 : 130) * p;
    if (glow.current) glow.current.intensity = (dark ? 2.2 : 1) * p;
    const { screen, photo, bulb } = parts.mats;
    if (bulb) bulb.emissiveIntensity = 40 * p;
    if (screen) screen.emissiveIntensity = dark ? 1.3 : 0.9;
    if (photo) photo.emissiveIntensity = dark ? 0.55 : 0.12;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const h = hotspotOf(e.object);
    setHovered(h);
    document.body.style.cursor = h ? "pointer" : "";
  };
  const out = () => {
    setHovered(null);
    document.body.style.cursor = "";
  };
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  const click = (e: ThreeEvent<MouseEvent>) => {
    const h = hotspotOf(e.object);
    if (!h || busy.current) return;
    e.stopPropagation();
    busy.current = true;
    const { gsap } = getGsap();
    const c = parts.groups[h].center;
    const to = CAM_POS.clone().lerp(c, 0.55);
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .to(look.pos, { x: to.x, y: to.y, z: to.z, duration: 0.8, ease: "power3.inOut" }, 0)
      .to(look.aim, { x: c.x, y: c.y, z: c.z, duration: 0.8, ease: "power3.inOut" }, 0)
      .add(() => document.querySelector(HOTSPOTS[h].href)?.scrollIntoView({ behavior: "smooth" }))
      .to(look.pos, { x: CAM_POS.x, y: CAM_POS.y, z: CAM_POS.z, duration: 1.2, ease: "power2.out" }, "+=0.6")
      .to(look.aim, { x: CAM_AIM.x, y: CAM_AIM.y, z: CAM_AIM.z, duration: 1.2, ease: "power2.out" }, "<");
  };

  return (
    <>
      <primitive object={scene} onPointerOver={over} onPointerOut={out} onClick={click} />
      <primitive object={target} />
      <spotLight
        ref={spot}
        position={parts.bulb}
        target={target}
        angle={0.77}
        penumbra={0.6}
        decay={2}
        color="#ffd194"
        castShadow={!mobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight ref={glow} position={parts.bulb} color="#ffcc8c" distance={4} decay={2} />
      {hovered && (
        <Html position={parts.groups[hovered].top} center zIndexRange={[5, 0]} pointerEvents="none">
          <span className="desk3d-label">{HOTSPOTS[hovered].label}</span>
        </Html>
      )}
    </>
  );
}

function Rig({ look, parallax }: { look: Look; parallax: boolean }) {
  const { camera, pointer } = useThree();
  const off = useRef(new THREE.Vector2());
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 3);
    off.current.x += ((parallax ? pointer.x : 0) * 0.6 - off.current.x) * k;
    off.current.y += ((parallax ? pointer.y : 0) * 0.35 - off.current.y) * k;
    camera.position.set(look.pos.x + off.current.x, look.pos.y + off.current.y, look.pos.z - off.current.x * 0.4);
    camera.lookAt(look.aim);
  });
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

function useDarkTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.getAttribute("data-theme") === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

export default function DeskScene({ onReady }: { onReady: () => void }) {
  const dark = useDarkTheme();
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [mobile] = useState(() => window.matchMedia("(max-width: 900px), (pointer: coarse)").matches);
  const power = useRef({ v: 0 }).current;
  const look = useRef<Look>({ pos: CAM_POS.clone(), aim: CAM_AIM.clone() }).current;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const handleReady = useMemo(
    () => () => {
      onReady();
      // The one authored moment: the lamp flickers on and lights the desk.
      getGsap().gsap.to(power, { keyframes: { v: [0, 0.7, 0.25, 1] }, duration: 0.6, ease: "none", delay: 0.2 });
    },
    [onReady, power],
  );

  return (
    <div ref={wrap} className="desk3d-canvas">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        shadows={!mobile}
        gl={{ antialias: !mobile, alpha: true, toneMapping: THREE.AgXToneMapping, powerPreference: "high-performance" }}
        camera={{ fov: FOV, near: 0.5, far: 60, position: CAM_POS.toArray() }}
      >
        <hemisphereLight args={[dark ? "#5b6a8f" : "#fff6ea", dark ? "#1e1915" : "#7a6650", dark ? 0.2 : 0.75]} />
        <directionalLight
          position={[9, 10, 7]}
          intensity={dark ? 0.2 : 0.9}
          color={dark ? "#9fb3f2" : "#fffaf2"}
        />
        <pointLight position={PORTRAIT_KEY} intensity={dark ? 5 : 3} distance={6} decay={2} color="#ffe6c7" />
        <Suspense fallback={null}>
          <Desk dark={dark} mobile={mobile} power={power} look={look} />
          <Ready onReady={handleReady} />
        </Suspense>
        <Rig look={look} parallax={!mobile} />
      </Canvas>
    </div>
  );
}
