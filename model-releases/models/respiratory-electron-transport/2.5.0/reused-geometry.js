// Exact source function copies from transport 2.3.0. This file is local to this sketch.
function activeTransport2dLipidTailPath(x, y, leaflet, side, wave, bend = 0) {
  const midY = y + leaflet * 19;
  const endY = y + leaflet * (41.5 - Math.min(5, Math.abs(wave) * 0.9));
  const midX = x + side * (5.1 + wave * 1.25) + bend * 0.66;
  const endX = x + side * (8.2 + wave * 2.15) + bend * 0.92;
  return `M${x} ${y} C${midX} ${midY - leaflet * 9.4} ${midX - side * (2.2 + Math.abs(bend) * 0.24)} ${midY + leaflet * 8.2} ${endX} ${endY}`;
}

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

function transport2dDefs() {
  return `
    <defs>
      <radialGradient id="transportWaterGlow" cx="50%" cy="18%" r="70%">
        <stop offset="0%" stop-color="#BFF6FF" />
        <stop offset="52%" stop-color="#7DD3FC" />
        <stop offset="100%" stop-color="#E0F2FE" />
      </radialGradient>
      <linearGradient id="transportCytoplasm" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.72" />
        <stop offset="100%" stop-color="#B45309" stop-opacity="0.34" />
      </linearGradient>
      <linearGradient id="transportCore" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.42" />
        <stop offset="50%" stop-color="#0F172A" stop-opacity="0.34" />
        <stop offset="100%" stop-color="#EFF6FF" stop-opacity="0.42" />
      </linearGradient>
      <radialGradient id="lipidHead2d" cx="38%" cy="26%" r="68%">
        <stop offset="0%" stop-color="#F0FDFF" />
        <stop offset="54%" stop-color="#7DD3FC" />
        <stop offset="100%" stop-color="#0284C7" />
      </radialGradient>
      <linearGradient id="lipidTail2d" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#F0FDFF" />
        <stop offset="54%" stop-color="#BAE6FD" />
        <stop offset="100%" stop-color="#7DD3FC" />
      </linearGradient>
      <linearGradient id="carrierLeft2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#C4B5FD" />
        <stop offset="48%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </linearGradient>
      <linearGradient id="carrierRight2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#93C5FD" />
        <stop offset="46%" stop-color="#2563EB" />
        <stop offset="100%" stop-color="#1D4ED8" />
      </linearGradient>
      <linearGradient id="channelProtein2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#E0F2FE" />
        <stop offset="48%" stop-color="#38BDF8" />
        <stop offset="100%" stop-color="#0E7490" />
      </linearGradient>
      <linearGradient id="carrierAssist2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#F5F3FF" />
        <stop offset="50%" stop-color="#C4B5FD" />
        <stop offset="100%" stop-color="#7C3AED" />
      </linearGradient>
      <linearGradient id="cotransport2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#DCFCE7" />
        <stop offset="54%" stop-color="#4ADE80" />
        <stop offset="100%" stop-color="#15803D" />
      </linearGradient>
      <linearGradient id="proteinChannelUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ECFEFF" />
        <stop offset="48%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0891B2" />
      </linearGradient>
      <linearGradient id="proteinCarrierUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#DCFCE7" />
        <stop offset="48%" stop-color="#22C55E" />
        <stop offset="100%" stop-color="#15803D" />
      </linearGradient>
      <linearGradient id="proteinActiveUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#F3E8FF" />
        <stop offset="48%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </linearGradient>
      <linearGradient id="proteinCotransportUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#FFEDD5" />
        <stop offset="48%" stop-color="#F97316" />
        <stop offset="100%" stop-color="#C2410C" />
      </linearGradient>
      <radialGradient id="carrierCavity2d" cx="50%" cy="52%" r="66%">
        <stop offset="0%" stop-color="#F0F9FF" stop-opacity="0.72" />
        <stop offset="58%" stop-color="#BAE6FD" stop-opacity="0.36" />
        <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.18" />
      </radialGradient>
      <linearGradient id="carrierChannelShadow2d" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#0F172A" stop-opacity="0.2" />
        <stop offset="48%" stop-color="#0F172A" stop-opacity="0.42" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.24" />
      </linearGradient>
      <radialGradient id="carrierPocketDepth2d" cx="50%" cy="52%" r="70%">
        <stop offset="0%" stop-color="#0F172A" stop-opacity="0.34" />
        <stop offset="68%" stop-color="#1E3A8A" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.06" />
      </radialGradient>
      <radialGradient id="carrierPocketFloor2d" cx="42%" cy="30%" r="76%">
        <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.9" />
        <stop offset="58%" stop-color="#BAE6FD" stop-opacity="0.56" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.16" />
      </radialGradient>
      <radialGradient id="atpaseDomain2d" cx="44%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </radialGradient>
      <radialGradient id="phosphate2d" cx="36%" cy="28%" r="68%">
        <stop offset="0%" stop-color="#CFFAFE" />
        <stop offset="56%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0891B2" />
      </radialGradient>
      <radialGradient id="ion2d" cx="35%" cy="28%" r="65%">
        <stop offset="0%" stop-color="#F5D0FE" />
        <stop offset="54%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </radialGradient>
      <radialGradient id="smallMolecule2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FCA5A5" />
        <stop offset="100%" stop-color="#DC2626" />
      </radialGradient>
      <radialGradient id="moleculeGreen2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#BBF7D0" />
        <stop offset="100%" stop-color="#16A34A" />
      </radialGradient>
      <radialGradient id="moleculeGold2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="100%" stop-color="#D97706" />
      </radialGradient>
      <radialGradient id="moleculeBlue2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#BFDBFE" />
        <stop offset="100%" stop-color="#2563EB" />
      </radialGradient>
      <filter id="softShadow2d" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#0F172A" flood-opacity="0.22" />
      </filter>
      <filter id="glow2d" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <marker id="transport2dArrow" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
        <path d="M0 0 L14 7 L0 14 Z" fill="#2563EB" opacity="0.72" />
      </marker>
      <marker id="transport2dArrowRed" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
        <path d="M0 0 L14 7 L0 14 Z" fill="#DC2626" opacity="0.78" />
      </marker>
    </defs>
  `;
}
