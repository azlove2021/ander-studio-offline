// Exact mature noise, reflection and motion helpers from transport@2.2.2.
const activeTransport2dMixNumber=(a,b,t)=>a+(b-a)*t;
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


export {activeTransport2dParticleTransform as brownianTransform};
