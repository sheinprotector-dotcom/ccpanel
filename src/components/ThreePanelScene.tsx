import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import type { PanelModel } from "../data/products";
import { buildPanel, disposeObject, type BuiltPanel } from "./three/buildPanel";

export type PanelSceneState = { open: number; explode: number; spin: number };

type Props = {
  model: PanelModel;
  code?: string;
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  open?: boolean;
  stateRef?: MutableRefObject<PanelSceneState>;
  label?: string;
};

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.75)");
  g.addColorStop(0.55, "rgba(0,0,0,0.3)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export default function ThreePanelScene({ model, code = "PT", className = "", interactive = false, autoRotate = false, open, stateRef, label }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const internalState = useRef<PanelSceneState>({ open: 0, explode: 0, spin: 0 });
  const state = stateRef ?? internalState;
  const api = useRef<{ setModel: (m: PanelModel, code: string) => void } | null>(null);
  const loadedModel = useRef<PanelModel | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarse ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isCoarse;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const target = new THREE.Vector3(0, 1.2, 0);

    scene.add(new THREE.HemisphereLight("#dbe8ff", "#0a0f18", 0.6));
    const key = new THREE.DirectionalLight("#ffffff", 2.4);
    key.position.set(4, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.0005;
    scene.add(key);
    const rim = new THREE.PointLight("#ff6b1a", 18, 14, 1.6);
    rim.position.set(-3.5, 2.5, -1.5);
    scene.add(rim);
    const fill = new THREE.PointLight("#3d8bff", 10, 12, 1.6);
    fill.position.set(3.5, 1.2, 2.5);
    scene.add(fill);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.35 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.002;
    scene.add(blob);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 96), new THREE.MeshBasicMaterial({ color: "#ff6b1a", transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.004;
    scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.18, 1.185, 96), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.004;
    scene.add(ring2);

    const sparkCount = isCoarse ? 40 : 90;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i += 1) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 7;
      sparkPositions[i * 3 + 1] = Math.random() * 4;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: "#ff8a3d", size: 0.022, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(sparks);

    const holder = new THREE.Group();
    holder.rotation.y = -0.5;
    scene.add(holder);

    let controls: OrbitControls | null = null;
    if (interactive) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enablePan = false;
      controls.enableZoom = !isCoarse;
      controls.minPolarAngle = Math.PI * 0.22;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.rotateSpeed = 0.7;
      controls.autoRotate = autoRotate && !reducedMotion;
      controls.autoRotateSpeed = 0.8;
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.style.cursor = "grab";
    }

    let current: BuiltPanel | null = null;
    let distance = 6;
    const fit = { distance: 6, targetY: 1.2 };

    const updateCamera = () => {
      const dir = new THREE.Vector3(0, 0.16, 1).normalize();
      camera.position.copy(target).addScaledVector(dir, fit.distance);
      camera.lookAt(target);
    };

    const computeFit = (built: BuiltPanel) => {
      const s = built.size;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const pad = 1.35;
      const distH = (s.y * 0.5 * pad) / Math.tan(vFov / 2);
      const span = Math.max(s.x, s.z) * 0.92;
      const distW = (span * 0.5 * pad) / (Math.tan(vFov / 2) * camera.aspect);
      return { distance: Math.max(distH, distW) + s.z * 0.6, targetY: s.y * 0.48 };
    };

    const setModel = (m: PanelModel, c: string) => {
      loadedModel.current = m;
      const next = buildPanel(m, c);
      const previous = current;
      current = next;
      const radius = Math.max(next.size.x, next.size.z) * 0.72;
      gsap.to(ring.scale, { x: radius, y: radius, z: radius, duration: 0.9, ease: "power3.out" });
      gsap.to(ring2.scale, { x: radius, y: radius, z: radius, duration: 1.1, ease: "power3.out" });
      blob.scale.set(next.size.x * 1.6, next.size.z * 2.4, 1);
      const nextFit = computeFit(next);
      distance = nextFit.distance;

      if (previous) {
        const old = previous.group;
        gsap.to(old.position, { y: -0.3, duration: 0.45, ease: "power2.in" });
        gsap.to(old.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.45, ease: "power2.in", onComplete: () => { holder.remove(old); disposeObject(old); } });
      }
      next.group.scale.setScalar(0.001);
      next.group.rotation.y = -0.9;
      holder.add(next.group);
      gsap.to(next.group.scale, { x: 1, y: 1, z: 1, duration: 1.1, delay: previous ? 0.3 : 0, ease: "expo.out" });
      gsap.to(next.group.rotation, { y: 0, duration: 1.4, delay: previous ? 0.3 : 0, ease: "expo.out" });
      gsap.to(fit, { distance: nextFit.distance, targetY: nextFit.targetY, duration: previous ? 1.1 : 0, ease: "power3.inOut", onUpdate: () => {
        target.y = fit.targetY;
        if (!controls) updateCamera();
        else camera.position.copy(controls.target).add(camera.position.clone().sub(controls.target).setLength(fit.distance));
      } });
      target.y = previous ? target.y : nextFit.targetY;
      if (!previous) { fit.distance = nextFit.distance; fit.targetY = nextFit.targetY; target.y = nextFit.targetY; updateCamera(); controls?.target.copy(target); }
      next.doors.forEach((d) => d.traverse((o) => { (o as THREE.Mesh).castShadow = true; }));
    };
    api.current = { setModel };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (current) {
        const f = computeFit(current);
        fit.distance = f.distance;
        distance = f.distance;
        if (!controls) updateCamera();
        else camera.position.copy(target).add(camera.position.clone().sub(controls.target).setLength(distance));
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    setModel(model, code);
    resize();

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (!interactive) window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "120px" });
    io.observe(mount);

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const s = state.current;

      if (current) {
        current.doors.forEach((d, i) => {
          const stagger = Math.min(1, Math.max(0, s.open * 1.25 - i * 0.06));
          d.rotation.y = -stagger * 1.85;
        });
        current.interior.position.z = s.explode * current.size.z * 0.7;
        current.lamps.forEach((mat, i) => { mat.emissiveIntensity = 1.1 + Math.sin(t * 3 + i * 1.3) * 0.5; });
      }
      if (!reducedMotion) {
        holder.position.y = Math.sin(t * 0.9) * 0.025;
        sparks.rotation.y = t * 0.03;
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 2) * 0.15;
      }
      if (controls) {
        holder.rotation.y = -0.5 + s.spin;
        controls.target.lerp(target, 0.1);
        controls.update();
      } else {
        const px = reducedMotion ? 0 : pointer.x;
        const py = reducedMotion ? 0 : pointer.y;
        holder.rotation.y += (-0.5 + s.spin + px * 0.28 - holder.rotation.y) * 0.05;
        holder.rotation.x += (py * 0.04 - holder.rotation.x) * 0.05;
        updateCamera();
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      controls?.dispose();
      gsap.killTweensOf([ring.scale, ring2.scale, fit]);
      disposeObject(scene);
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, autoRotate]);

  useEffect(() => {
    if (loadedModel.current !== model) api.current?.setModel(model, code);
  }, [model, code]);

  useEffect(() => {
    if (open === undefined) return;
    gsap.to(state.current, { open: open ? 1 : 0, explode: open ? 0.35 : 0, duration: 1.4, ease: "power3.inOut" });
  }, [open, state]);

  return (
    <div ref={mountRef} className={className} role="img" aria-label={label ?? "Interactive 3D model of an industrial electrical panel"} />
  );
}
