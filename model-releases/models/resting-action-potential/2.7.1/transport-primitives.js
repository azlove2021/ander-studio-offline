// Derived from transport@2.1.10; see provenance.json. No runtime dependency.
// ATP ring topology corrected locally in 2.2.0 using the PDBe ATP definition.
function activeTransport2dLipidTailPath(x, y, leaflet, side, wave, bend = 0) {
  const midY = y + leaflet * 19;
  const endY = y + leaflet * (41.5 - Math.min(5, Math.abs(wave) * 0.9));
  const midX = x + side * (5.1 + wave * 1.25) + bend * 0.66;
  const endX = x + side * (8.2 + wave * 2.15) + bend * 0.92;
  return `M${x} ${y} C${midX} ${midY - leaflet * 9.4} ${midX - side * (2.2 + Math.abs(bend) * 0.24)} ${midY + leaflet * 8.2} ${endX} ${endY}`;
}

function activeTransport2dNoise(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function activeTransport2dValueNoise(seed, t) {
  const index = Math.floor(t);
  const fraction = t - index;
  const eased = fraction * fraction * (3 - 2 * fraction);
  const a = activeTransport2dNoise(seed + index * 17.17);
  const b = activeTransport2dNoise(seed + (index + 1) * 17.17);
  return activeTransport2dMixNumber(a, b, eased) * 2 - 1;
}

function activeTransport2dBrownianNoise(seed, t) {
  const slow = activeTransport2dValueNoise(seed, t);
  const middle = activeTransport2dValueNoise(seed + 19.31, t * 2.17 + 3.7) * 0.48;
  const fine = activeTransport2dValueNoise(seed + 43.83, t * 4.33 + 8.9) * 0.18;
  return (slow + middle + fine) / 1.66;
}

function activeTransport2dReflect(value, min, max) {
  const span = max - min;
  if (span <= 0) return min;
  const wrapped = ((value - min) % (span * 2) + span * 2) % (span * 2);
  return wrapped > span ? max - (wrapped - span) : min + wrapped;
}

function activeTransport2dParticleTransform(particle, time, particleSpeed) {
  const baseX = Number(particle.dataset.baseX);
  const baseY = Number(particle.dataset.baseY);
  const phase = Number(particle.dataset.phase);
  const phaseB = Number(particle.dataset.phaseB) || phase * 1.73;
  const speed = Number(particle.dataset.speed) || 0.1;
  const rangeX = Number(particle.dataset.rangeX) || 80;
  const rangeY = Number(particle.dataset.rangeY) || 24;
  const laneY = Number(particle.dataset.laneY) || baseY;
  const jitter = Number(particle.dataset.jitter) || 0.3;
  const side = particle.dataset.side;
  const minX = Number(particle.dataset.minX || 24);
  const maxX = Number(particle.dataset.maxX || 936);
  const minY = Number(particle.dataset.minY || (side === "outside" ? 28 : 368));
  const maxY = Number(particle.dataset.maxY || (side === "outside" ? 192 : 532));
  const direction = Number(particle.dataset.direction) || 1;
  const seed = phase * 97 + phaseB * 31 + direction * 11;
  const motion = time * (0.32 + speed * 2.4) * (0.7 + particleSpeed * 5);
  const driftX = activeTransport2dBrownianNoise(seed, motion) * rangeX
    + activeTransport2dBrownianNoise(seed + 71.9, motion * 1.7) * rangeX * jitter * 0.32;
  const driftY = activeTransport2dBrownianNoise(seed + 137.5, motion * 1.08) * rangeY
    + activeTransport2dBrownianNoise(seed + 211.2, motion * 2.1) * rangeY * jitter * 0.28;
  const x = activeTransport2dReflect(baseX + driftX, minX, maxX);
  const y = activeTransport2dReflect(laneY + driftY, minY, maxY);
  const spin = Number(particle.dataset.spin || 0);
  const rotation = spin ? (time * spin * 42 + phase * 30) % 360 : 0;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})`;
}

function activeTransport2dUpdateLipidTail(tail, time, particleSpeed) {
  const x = Number(tail.dataset.x);
  const y = Number(tail.dataset.y);
  const leaflet = Number(tail.dataset.leaflet);
  const side = Number(tail.dataset.side);
  const phase = Number(tail.dataset.phase);
  const amp = Number(tail.dataset.amp) || 0.8;
  const bend = Number(tail.dataset.bend) || 0;
  const tailMotion = time * (0.32 + particleSpeed * 4.8);
  const wave = Math.sin(tailMotion + phase) * amp
    + Math.cos(tailMotion * 1.34 + phase * 1.9) * amp * 0.52;
  const liveBend = bend + Math.sin(tailMotion * 0.9 + phase * 1.31) * amp * 0.58;
  tail.setAttribute("d", activeTransport2dLipidTailPath(x, y, leaflet, side, wave, liveBend));
}

function activeTransport2dNucleotide(label, phosphateCount) {
  if (label === "Pi") {
    return `
      <g class="active-transport-2d-pi">
        ${activeTransport2dPhosphateGroup(0, 0, "Pi")}
      </g>
    `;
  }
  const phosphates = [];
  for (let i = 0; i < phosphateCount; i += 1) {
    const x = 17 + i * 19;
    const terminal = i === phosphateCount - 1 && label === "ATP";
    phosphates.push(activeTransport2dPhosphateGroup(x, 0, terminal ? "P" : "", terminal));
    if (i > 0) phosphates.push(`<path class="phosphate-bond" d="M${x - 12} 0 L${x - 8} 0" />`);
  }
  return `
    <g class="active-transport-2d-nucleotide">
      <g class="active-transport-2d-nucleotide-body" data-nucleotide-body>
        <g class="active-transport-2d-adenosine" aria-label="腺嘌呤 N9 与核糖 1′ 位相连，三磷酸连接核糖 5′ 位">
          <!-- Purine: six and five membered rings share only the C5-C4 edge. -->
          <polygon class="adenine-ring" data-adenine-six points="-81,-22 -81,-6 -95,2 -109,-6 -109,-22 -95,-30" />
          <polygon class="adenine-ring adenine-ring-small" data-adenine-five points="-81,-22 -65,-27 -55,-14 -65,-1 -81,-6" />
          <path class="nucleotide-bond" data-glycosidic-bond d="M-65 -1 L-46 8" />
          <polygon class="ribose-ring" data-ribose-ring points="-46,8 -32,-3 -18,8 -23,26 -41,26" />
          <path class="nucleotide-bond" data-five-prime-link d="M-18 8 L-7 -4 L4 -4 L8 0" />
          <text class="nucleotide-atom" x="-65" y="2">N</text>
          <text class="nucleotide-atom" x="-32" y="0">O</text>
          <text class="nucleotide-atom" x="4" y="-1">O</text>
          <text class="nucleotide-position" x="-48" y="18">1′</text>
          <text class="nucleotide-position" x="-9" y="-10">5′</text>
        </g>
        ${phosphates.join("")}
        <text x="22" y="-22" data-atp-label>${label}</text>
        <text x="22" y="-22" data-adp-label opacity="0">ADP</text>
      </g>
    </g>
  `;
}

function activeTransport2dPhosphateGroup(x, y, label = "", terminal = false) {
  return `
    <g class="active-transport-2d-phosphate" transform="translate(${x} ${y})" ${terminal ? `data-terminal-phosphate data-home-x="${x}" data-home-y="${y}"` : ""}>
      <circle cx="0" cy="0" r="9.2" fill="url(#phosphate2d)" stroke="#0891B2" stroke-width="1.7" />
      <circle cx="-3.2" cy="-3.6" r="3.1" fill="#ECFEFF" opacity="0.46" />
      <text x="0" y="4">${label}</text>
    </g>
  `;
}

function activeTransport2dMixNumber(from, to, progress) {
  return from + (to - from) * progress;
}

const ACTIVE_TRANSPORT_PART_LABELS = {
  membrane: "磷脂双分子层 / Phospholipid Bilayer",
  carrier: "载体蛋白跨膜螺旋束 / Carrier Protein",
  domain: "ATPase 胞质结构域 / ATPase Domain",
  ion: "被运输离子 / Transported Ion",
  atp: "ATP 结合与水解 / ATP Hydrolysis",
  adp: "ADP / Pi 释放",
  gradient: "膜两侧浓度差 / Concentration Gradient",
};

function transportIntegratedLipids() {
  const pieces = [];
  const lipidXs = [];
  for (let i = 0; i < 64; i += 1) lipidXs.push(4 + i * 20.2);
  lipidXs
    .forEach((x, i) => {
      const phase = (i * 0.63).toFixed(2);
      const ampA = (3.4 + (i % 5) * 0.62).toFixed(2);
      const ampB = (3.75 + ((i + 2) % 5) * 0.58).toFixed(2);
      const bendA = (((i % 7) - 3) * 1.08).toFixed(2);
      const bendB = ((((i + 3) % 7) - 3) * 1.02).toFixed(2);
      const topLeft = activeTransport2dLipidTailPath(x - 4.8, 229, 1, -1, Math.sin(Number(phase)) * Number(ampA), Number(bendA));
      const topRight = activeTransport2dLipidTailPath(x + 4.8, 229, 1, 1, Math.sin(Number(phase) + 1.5) * Number(ampB), Number(bendB));
      const bottomLeft = activeTransport2dLipidTailPath(x - 4.8, 329, -1, -1, Math.sin(Number(phase) + 0.8) * Number(ampB), -Number(bendB));
      const bottomRight = activeTransport2dLipidTailPath(x + 4.8, 329, -1, 1, Math.sin(Number(phase) + 2.3) * Number(ampA), -Number(bendA));
      pieces.push(`
        <g class="active-lipid">
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x - 4.8}" data-y="229" data-leaflet="1" data-side="-1" data-phase="${phase}" data-amp="${ampA}" data-bend="${bendA}" d="${topLeft}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x - 4.8}" data-y="229" data-leaflet="1" data-side="-1" data-phase="${phase}" data-amp="${ampA}" data-bend="${bendA}" d="${topLeft}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x + 4.8}" data-y="229" data-leaflet="1" data-side="1" data-phase="${Number(phase) + 1.5}" data-amp="${ampB}" data-bend="${bendB}" d="${topRight}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x + 4.8}" data-y="229" data-leaflet="1" data-side="1" data-phase="${Number(phase) + 1.5}" data-amp="${ampB}" data-bend="${bendB}" d="${topRight}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x - 4.8}" data-y="329" data-leaflet="-1" data-side="-1" data-phase="${Number(phase) + 0.8}" data-amp="${ampB}" data-bend="${-Number(bendB)}" d="${bottomLeft}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x - 4.8}" data-y="329" data-leaflet="-1" data-side="-1" data-phase="${Number(phase) + 0.8}" data-amp="${ampB}" data-bend="${-Number(bendB)}" d="${bottomLeft}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x + 4.8}" data-y="329" data-leaflet="-1" data-side="1" data-phase="${Number(phase) + 2.3}" data-amp="${ampA}" data-bend="${-Number(bendA)}" d="${bottomRight}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x + 4.8}" data-y="329" data-leaflet="-1" data-side="1" data-phase="${Number(phase) + 2.3}" data-amp="${ampA}" data-bend="${-Number(bendA)}" d="${bottomRight}" />
          <circle cx="${x}" cy="216" r="11.8" fill="url(#lipidHead2d)" stroke="rgba(14,165,233,0.38)" stroke-width="0.65" />
          <ellipse cx="${x - 3.7}" cy="211.7" rx="4.4" ry="3.2" fill="#FFFFFF" opacity="0.38" />
          <circle cx="${x}" cy="342" r="11.8" fill="url(#lipidHead2d)" stroke="rgba(14,165,233,0.38)" stroke-width="0.65" />
          <ellipse cx="${x - 3.7}" cy="337.7" rx="4.4" ry="3.2" fill="#FFFFFF" opacity="0.34" />
        </g>
      `);
    });
  return pieces.join("");
}
