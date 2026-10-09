import * as THREE from "three";
import type { PanelModel } from "../../data/products";

export type BuiltPanel = {
  group: THREE.Group;
  doors: THREE.Object3D[];
  interior: THREE.Group;
  lamps: THREE.MeshStandardMaterial[];
  size: THREE.Vector3;
};

type Mats = ReturnType<typeof createMaterials>;

function createMaterials(finish: PanelModel["finish"]) {
  const body = finish === "light" ? "#c4cad0" : "#2b3644";
  return {
    body: new THREE.MeshPhysicalMaterial({ color: body, metalness: 0.35, roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    bodyInner: new THREE.MeshStandardMaterial({ color: finish === "light" ? "#aeb5bc" : "#222b37", metalness: 0.3, roughness: 0.6, side: THREE.DoubleSide }),
    plinth: new THREE.MeshStandardMaterial({ color: "#14181e", metalness: 0.4, roughness: 0.55 }),
    plate: new THREE.MeshStandardMaterial({ color: "#9aa3ab", metalness: 0.85, roughness: 0.35 }),
    copper: new THREE.MeshStandardMaterial({ color: "#d07a45", metalness: 1, roughness: 0.28 }),
    black: new THREE.MeshStandardMaterial({ color: "#16191d", metalness: 0.2, roughness: 0.55 }),
    darkGrey: new THREE.MeshStandardMaterial({ color: "#33383f", metalness: 0.3, roughness: 0.5 }),
    white: new THREE.MeshStandardMaterial({ color: "#e9ebee", metalness: 0.05, roughness: 0.45 }),
    duct: new THREE.MeshStandardMaterial({ color: "#7d848c", metalness: 0.1, roughness: 0.7 }),
    steel: new THREE.MeshStandardMaterial({ color: "#d9dee3", metalness: 1, roughness: 0.2 }),
    orange: new THREE.MeshStandardMaterial({ color: "#ff6b1a", metalness: 0.3, roughness: 0.35, emissive: "#ff6b1a", emissiveIntensity: 0.15 }),
    red: new THREE.MeshStandardMaterial({ color: "#d42a2a", metalness: 0.2, roughness: 0.35 }),
    green: new THREE.MeshStandardMaterial({ color: "#1f9d55", metalness: 0.2, roughness: 0.35 }),
    blueCap: new THREE.MeshStandardMaterial({ color: "#8d97a3", metalness: 0.9, roughness: 0.25 }),
    coil: new THREE.MeshStandardMaterial({ color: "#b8642f", metalness: 0.9, roughness: 0.4 }),
  };
}

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(r: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function meterFace(label: string) {
  return canvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 240, 240);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(128, 170, 92, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    for (let i = 0; i <= 10; i += 1) {
      const a = Math.PI * 1.15 + (Math.PI * 0.7 * i) / 10;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(a) * 92, 170 + Math.sin(a) * 92);
      ctx.lineTo(128 + Math.cos(a) * (i % 5 ? 80 : 70), 170 + Math.sin(a) * (i % 5 ? 80 : 70));
      ctx.stroke();
    }
    ctx.strokeStyle = "#d42a2a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 170);
    ctx.lineTo(128 + Math.cos(Math.PI * 1.62) * 86, 170 + Math.sin(Math.PI * 1.62) * 86);
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, 128, 225);
  });
}

function hmiScreen() {
  return canvasTexture(512, 320, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 320);
    g.addColorStop(0, "#0b2238");
    g.addColorStop(1, "#06121f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "#ff6b1a";
    ctx.fillRect(0, 0, 512, 38);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("POWERTECH · SCADA", 16, 27);
    const vals = [0.72, 0.5, 0.86, 0.64, 0.4, 0.78];
    vals.forEach((v, i) => {
      ctx.fillStyle = "#13324f";
      ctx.fillRect(24 + i * 50, 70, 32, 180);
      ctx.fillStyle = i % 2 ? "#3dd6ff" : "#33d17a";
      ctx.fillRect(24 + i * 50, 70 + 180 * (1 - v), 32, 180 * v);
    });
    ctx.strokeStyle = "#3dd6ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 170; x += 5) ctx.lineTo(330 + x, 160 - Math.sin(x / 18) * 40 - x * 0.15);
    ctx.stroke();
    ctx.fillStyle = "#9fb6cc";
    ctx.font = "18px sans-serif";
    ctx.fillText("415.2 V", 340, 230);
    ctx.fillText("PF 0.99", 340, 258);
    ctx.fillText("50.0 Hz", 430, 230);
  });
}

function nameplate(text: string, dark: boolean) {
  return canvasTexture(512, 96, (ctx) => {
    ctx.fillStyle = dark ? "#0d1117" : "#1b1f24";
    ctx.fillRect(0, 0, 512, 96);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 50);
  });
}

function warning() {
  return canvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = "#ffd21f";
    ctx.beginPath();
    ctx.moveTo(64, 8);
    ctx.lineTo(122, 116);
    ctx.lineTo(6, 116);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#111";
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(70, 40);
    ctx.lineTo(50, 78);
    ctx.lineTo(64, 78);
    ctx.lineTo(56, 104);
    ctx.lineTo(80, 66);
    ctx.lineTo(66, 66);
    ctx.closePath();
    ctx.fill();
  });
}

function plane(w: number, h: number, map: THREE.Texture, x = 0, y = 0, z = 0, emissive = false) {
  const mat = emissive
    ? new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: "#ffffff", emissiveIntensity: 0.9, roughness: 0.2 })
    : new THREE.MeshStandardMaterial({ map, roughness: 0.5, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  return mesh;
}

function addLamps(target: THREE.Object3D, lamps: THREE.MeshStandardMaterial[], x: number, y: number, z: number, gap = 0.1) {
  ["#ff3b30", "#ffcc00", "#2f7bff"].forEach((color, i) => {
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, roughness: 0.2 });
    lamps.push(mat);
    const bezel = cyl(0.032, 0.02, new THREE.MeshStandardMaterial({ color: "#222", metalness: 0.6, roughness: 0.3 }), x + i * gap, y, z);
    bezel.rotation.x = Math.PI / 2;
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x + i * gap, y, z + 0.01);
    target.add(bezel, lens);
  });
}

function addVents(target: THREE.Object3D, m: Mats, w: number, y: number, z: number, rows = 6) {
  for (let i = 0; i < rows; i += 1) target.add(box(w, 0.012, 0.012, m.black, 0, y + i * 0.032, z));
}

function addHandle(target: THREE.Object3D, m: Mats, x: number, y: number, z: number) {
  target.add(box(0.035, 0.22, 0.03, m.black, x, y, z + 0.015));
  target.add(box(0.05, 0.05, 0.035, m.orange, x, y + 0.13, z + 0.018));
}

function mcbRow(target: THREE.Object3D, m: Mats, width: number, y: number, z: number) {
  target.add(box(width, 0.035, 0.02, m.steel, 0, y, z));
  const count = Math.floor(width / 0.05);
  for (let i = 0; i < count; i += 1) {
    const x = -width / 2 + 0.025 + i * 0.05;
    target.add(box(0.044, 0.15, 0.08, m.white, x, y, z + 0.05));
    target.add(box(0.016, 0.03, 0.02, i % 4 === 0 ? m.red : m.black, x, y + 0.01, z + 0.1));
  }
}

function contactor(target: THREE.Object3D, m: Mats, x: number, y: number, z: number, s = 1) {
  target.add(box(0.11 * s, 0.14 * s, 0.1 * s, m.darkGrey, x, y, z + 0.05 * s));
  target.add(box(0.08 * s, 0.04 * s, 0.02 * s, m.white, x, y + 0.03 * s, z + 0.11 * s));
  target.add(box(0.03 * s, 0.03 * s, 0.02 * s, m.green, x, y - 0.035 * s, z + 0.11 * s));
}

function ducts(target: THREE.Object3D, m: Mats, w: number, h: number, z: number) {
  target.add(box(w * 0.92, 0.06, 0.07, m.duct, 0, h / 2 - 0.12, z + 0.035));
  target.add(box(w * 0.92, 0.06, 0.07, m.duct, 0, -h / 2 + 0.12, z + 0.035));
  target.add(box(0.06, h - 0.3, 0.07, m.duct, -w / 2 + 0.07, 0, z + 0.035));
  target.add(box(0.06, h - 0.3, 0.07, m.duct, w / 2 - 0.07, 0, z + 0.035));
}

function buildInterior(type: PanelModel["interior"], m: Mats, w: number, h: number, z: number, bayIndex: number) {
  const g = new THREE.Group();
  g.add(box(w * 0.9, h * 0.92, 0.015, m.plate, 0, 0, z));
  const fz = z + 0.01;
  const inner = w * 0.7;

  if (type === "mcb") {
    ducts(g, m, w, h, fz);
    const big = box(0.26, 0.32, 0.14, m.black, 0, h * 0.28, fz + 0.07);
    g.add(big, box(0.07, 0.1, 0.03, m.white, 0, h * 0.28, fz + 0.155));
    for (let r = 0; r < 4; r += 1) mcbRow(g, m, inner, h * 0.08 - r * 0.2, fz);
  } else if (type === "acb") {
    if (bayIndex % 2 === 0) {
      g.add(box(inner, 0.5, 0.32, m.black, 0, h * 0.1, fz + 0.16));
      g.add(box(inner * 0.8, 0.28, 0.02, m.darkGrey, 0, h * 0.12, fz + 0.33));
      g.add(plane(0.18, 0.05, nameplate("ACB 3200A", true), 0, h * 0.2, fz + 0.335));
      g.add(box(0.04, 0.04, 0.02, m.green, -0.12, h * 0.05, fz + 0.345), box(0.04, 0.04, 0.02, m.red, -0.06, h * 0.05, fz + 0.345));
    } else {
      for (let r = 0; r < 3; r += 1) {
        g.add(box(0.2, 0.26, 0.12, m.black, -0.13, h * 0.25 - r * 0.38, fz + 0.06));
        g.add(box(0.2, 0.26, 0.12, m.black, 0.13, h * 0.25 - r * 0.38, fz + 0.06));
      }
    }
    for (let i = 0; i < 3; i += 1) g.add(box(0.03, h * 0.85, 0.08, m.copper, w / 2 - 0.12 - i * 0.05, 0, fz + 0.1));
  } else if (type === "drawers") {
    for (let r = 0; r < 6; r += 1) {
      const y = h / 2 - 0.3 - r * ((h - 0.4) / 6);
      g.add(box(w * 0.86, 0.015, 0.4, m.bodyInner, 0, y + 0.18, fz + 0.2));
      contactor(g, m, -0.12, y, fz, 0.9);
      contactor(g, m, 0.02, y, fz, 0.9);
      g.add(box(0.1, 0.12, 0.08, m.white, 0.16, y, fz + 0.04));
    }
  } else if (type === "capacitors") {
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        const cap = cyl(0.065, 0.32, m.blueCap, -0.18 + c * 0.18, -h * 0.28 + r * 0.42, fz + 0.12);
        g.add(cap, cyl(0.03, 0.03, m.black, cap.position.x, cap.position.y + 0.18, cap.position.z));
      }
    }
    for (let c = 0; c < 3; c += 1) contactor(g, m, -0.18 + c * 0.18, h * 0.36, fz);
    g.add(box(w * 0.8, 0.04, 0.04, m.copper, 0, h * 0.44, fz + 0.12));
  } else if (type === "plc") {
    ducts(g, m, w, h, fz);
    g.add(box(inner, 0.035, 0.02, m.steel, 0, h * 0.28, fz));
    const colors = [m.darkGrey, m.green, m.green, m.white, m.white, m.orange, m.darkGrey];
    colors.forEach((c, i) => g.add(box(0.07, 0.22, 0.12, c, -inner / 2 + 0.05 + i * 0.08, h * 0.28, fz + 0.06)));
    g.add(box(0.18, 0.22, 0.1, m.white, inner / 2 - 0.1, h * 0.28, fz + 0.05));
    for (let r = 0; r < 2; r += 1) mcbRow(g, m, inner, -r * 0.24, fz);
    for (let i = 0; i < 18; i += 1) g.add(box(0.025, 0.09, 0.06, i % 6 === 5 ? m.orange : m.darkGrey, -inner / 2 + 0.02 + i * 0.033, -h * 0.32, fz + 0.03));
  } else if (type === "vfd") {
    const dw = w * 0.36;
    [-1, 1].forEach((s) => {
      g.add(box(dw, h * 0.48, 0.26, m.black, s * w * 0.21, h * 0.06, fz + 0.13));
      g.add(box(dw * 0.5, 0.16, 0.02, m.darkGrey, s * w * 0.21, h * 0.18, fz + 0.27));
      g.add(plane(dw * 0.4, 0.08, hmiScreen(), s * w * 0.21, h * 0.2, fz + 0.285, true));
      for (let i = 0; i < 6; i += 1) g.add(box(dw * 0.8, 0.012, 0.01, m.darkGrey, s * w * 0.21, -h * 0.1 + i * 0.03, fz + 0.265));
    });
    mcbRow(g, m, inner, -h * 0.32, fz);
  } else if (type === "controller" || type === "starter") {
    ducts(g, m, w, h, fz);
    const big = type === "controller";
    g.add(box(0.26, 0.22, 0.12, m.black, 0, h * 0.28, fz + 0.06));
    for (let c = 0; c < 3; c += 1) contactor(g, m, -0.18 + c * 0.18, big ? h * 0.02 : h * 0.04, fz, big ? 1.1 : 1.2);
    g.add(box(0.16, 0.06, 0.08, m.darkGrey, -0.1, -h * 0.16, fz + 0.04), box(0.07, 0.12, 0.08, m.white, 0.14, -h * 0.16, fz + 0.04));
    if (big) g.add(box(0.3, 0.18, 0.16, m.darkGrey, 0, -h * 0.32, fz + 0.08));
  } else if (type === "stabilizer") {
    [-0.28, 0, 0.28].forEach((x) => {
      g.add(cyl(0.11, 0.42, m.coil, x, -h * 0.1, fz + 0.2, 32));
      g.add(cyl(0.06, 0.44, m.darkGrey, x, -h * 0.1, fz + 0.2));
    });
    g.add(box(0.5, 0.14, 0.18, m.black, 0, h * 0.25, fz + 0.09));
    g.add(cyl(0.06, 0.16, m.steel, 0.36, h * 0.25, fz + 0.1));
  }
  return g;
}

export function buildPanel(model: PanelModel, code = "PT-01"): BuiltPanel {
  const m = createMaterials(model.finish);
  const lamps: THREE.MeshStandardMaterial[] = [];
  const group = new THREE.Group();
  const interior = new THREE.Group();
  const doors: THREE.Object3D[] = [];

  const isFloor = model.form === "floor";
  const isWall = model.form === "wall";
  const bayW = isWall ? 1.15 : model.form === "stabilizer" ? 1.3 : 0.95;
  const H = isWall ? 1.45 : model.form === "stabilizer" ? 1.7 : 2.6;
  const D = isWall ? 0.42 : 0.85;
  const W = bayW * model.bays;
  const t = 0.03;
  const baseY = isFloor ? 0.14 : model.form === "stabilizer" ? 0.16 : 0;
  const cy = baseY + H / 2;

  const shell = new THREE.Group();
  shell.add(box(W, H, t, m.bodyInner, 0, cy, -D / 2 + t / 2));
  shell.add(box(t, H, D, m.body, -W / 2 + t / 2, cy, 0), box(t, H, D, m.body, W / 2 - t / 2, cy, 0));
  shell.add(box(W, t, D, m.body, 0, cy + H / 2 - t / 2, 0), box(W, t, D, m.body, 0, baseY + t / 2, 0));
  for (let i = 1; i < model.bays; i += 1) shell.add(box(t * 0.6, H, D - 0.02, m.bodyInner, -W / 2 + i * bayW, cy, 0));
  group.add(shell);

  if (isFloor) {
    group.add(box(W + 0.02, 0.14, D + 0.02, m.plinth, 0, 0.07, 0));
    group.add(box(W + 0.04, 0.04, D + 0.04, m.body, 0, cy + H / 2 + 0.02, 0));
    if (model.interior === "acb" || model.bays >= 3) {
      for (let i = 0; i < 4; i += 1) group.add(box(W - 0.1, 0.05, 0.02, m.copper, 0, cy + H / 2 - 0.12 - i * 0.07, D / 2 - 0.12));
    }
  }
  if (model.form === "stabilizer") {
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      const wheel = cyl(0.07, 0.05, m.black, sx * (W / 2 - 0.12), 0.07, sz * (D / 2 - 0.12));
      wheel.rotation.z = Math.PI / 2;
      group.add(wheel);
    });
  }

  for (let b = 0; b < model.bays; b += 1) {
    const left = -W / 2 + b * bayW;
    const bayCenter = left + bayW / 2;
    const bayInterior = buildInterior(model.interior, m, bayW - 0.06, H - 0.1, -D / 2 + t + 0.01, b);
    bayInterior.position.set(bayCenter, cy, 0);
    interior.add(bayInterior);

    const pivot = new THREE.Group();
    pivot.position.set(left + 0.012, cy, D / 2);
    const door = new THREE.Group();
    door.position.x = bayW / 2 - 0.012;
    const dw = bayW - 0.03;
    const dh = H - 0.05;
    door.add(box(dw, dh, 0.03, m.body, 0, 0, 0.015));
    const dz = 0.031;

    door.add(plane(dw * 0.62, 0.075, nameplate(`${code}-${String(b + 1).padStart(2, "0")}`, model.finish === "dark"), 0, dh / 2 - 0.12, dz + 0.001));

    const isPrimary = b === Math.floor(model.bays / 2) || model.bays === 1;
    const meters = model.meters ?? 0;
    if (isPrimary && model.hmi) {
      door.add(box(0.36, 0.24, 0.025, m.black, 0, dh * 0.22, dz + 0.012));
      door.add(plane(0.32, 0.2, hmiScreen(), 0, dh * 0.22, dz + 0.026, true));
    }
    if ((b === 0 || model.bays === 1) && meters > 0) {
      const my = isPrimary && model.hmi ? dh * 0.02 : dh * 0.26;
      const labels = ["A", "V", "kW"];
      for (let i = 0; i < meters; i += 1) {
        const mx = (i - (meters - 1) / 2) * 0.2;
        door.add(box(0.16, 0.16, 0.03, m.black, mx, my, dz + 0.015));
        door.add(plane(0.13, 0.13, meterFace(labels[i % 3]), mx, my, dz + 0.031));
      }
      addLamps(door, lamps, -0.1, my - 0.17, dz + 0.01);
      const knob = cyl(0.035, 0.03, m.black, 0.18, my - 0.17, dz + 0.015);
      knob.rotation.x = Math.PI / 2;
      door.add(knob, box(0.012, 0.05, 0.012, m.white, 0.18, my - 0.17, dz + 0.035));
    } else if (model.interior === "drawers") {
      for (let r = 1; r < 6; r += 1) door.add(box(dw, 0.01, 0.01, m.black, 0, dh / 2 - 0.18 - r * ((dh - 0.3) / 6), dz + 0.005));
      for (let r = 0; r < 6; r += 1) {
        const y = dh / 2 - 0.3 - r * ((dh - 0.3) / 6);
        addLamps(door, lamps, -0.25, y, dz + 0.01, 0.06);
        door.add(box(0.08, 0.025, 0.02, m.black, 0.22, y, dz + 0.01));
      }
    } else if (model.interior === "acb" && b % 2 === 0) {
      door.add(box(dw * 0.72, 0.42, 0.012, m.black, 0, dh * 0.08, dz + 0.006));
      door.add(box(dw * 0.6, 0.08, 0.02, m.orange, 0, dh * 0.21, dz + 0.012));
    } else if (model.interior === "vfd") {
      [-0.2, 0.2].forEach((x) => {
        const fan = cyl(0.11, 0.02, m.black, x, dh * 0.15, dz + 0.01, 32);
        fan.rotation.x = Math.PI / 2;
        door.add(fan);
        for (let i = 0; i < 4; i += 1) door.add(box(0.2, 0.008, 0.008, m.darkGrey, x, dh * 0.15 - 0.075 + i * 0.05, dz + 0.022));
      });
    } else if (model.interior === "starter" || model.interior === "stabilizer") {
      const btn = cyl(0.04, 0.03, m.green, -0.08, -dh * 0.05, dz + 0.015);
      const stop = cyl(0.04, 0.03, m.red, 0.08, -dh * 0.05, dz + 0.015);
      btn.rotation.x = stop.rotation.x = Math.PI / 2;
      door.add(btn, stop);
    } else {
      addLamps(door, lamps, -0.1, dh * 0.24, dz + 0.01);
    }

    door.add(plane(0.09, 0.09, warning(), -dw / 2 + 0.12, dh * 0.38, dz + 0.001));
    addVents(door, m, dw * 0.6, -dh / 2 + 0.1, dz + 0.006, model.form === "stabilizer" ? 10 : 6);
    if (model.form === "stabilizer") addVents(door, m, dw * 0.6, dh * 0.05, dz + 0.006, 10);
    addHandle(door, m, dw / 2 - 0.07, 0, dz);
    [-1, 1].forEach((s) => door.add(box(0.02, 0.1, 0.02, m.steel, -dw / 2 + 0.005, s * dh * 0.35, dz)));

    pivot.add(door);
    group.add(pivot);
    doors.push(pivot);
  }

  group.add(interior);

  const bounds = new THREE.Box3().setFromObject(group);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  group.position.set(-center.x, -bounds.min.y, -center.z);
  const wrapper = new THREE.Group();
  wrapper.add(group);

  return { group: wrapper, doors, interior, lamps, size };
}

export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const materials = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
    materials.forEach((mat) => {
      const m = mat as THREE.MeshStandardMaterial;
      m.map?.dispose();
      m.emissiveMap?.dispose();
      m.dispose();
    });
  });
}
