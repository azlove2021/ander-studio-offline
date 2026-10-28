// The bundle and source somata develop the approved layout-v2 object geometry.
// All positions below belong to one model coordinate frame, not screen pixels.
import {PARAMETERS,VISIBLE_SPEEDS} from './signal.js';
import {stimulatorBody} from './circuit-assets.js';
export const SPACE=Object.freeze({width:1000,height:560,left:150,right:855,top:338,bottom:450,xMin:-8,xMax:95,axisLeft:170,axisRight:850});
export const axonX=x=>SPACE.axisLeft+(x-SPACE.xMin)/(SPACE.xMax-SPACE.xMin)*(SPACE.axisRight-SPACE.axisLeft);
export const fiberY=i=>355+i*15.6;
export const localScale=(SPACE.axisRight-SPACE.axisLeft)/(SPACE.xMax-SPACE.xMin);
export const chamberX=x=>338+(x+8)/103*610;
export const CHAMBER_POSTS=[-6,0,12,20,28,38,48,58,60,68,82,94];
export const IMAGE_ASSETS=['assets/frog.webp','assets/frog-detail.webp','assets/neuron-soma.webp','assets/axon-terminal.webp'];
const text=(x,y,t,cls='small',extra='')=>`<text x="${x}" y="${y}" class="${cls}" ${extra}>${t}</text>`;
const line=(d,cls='',extra='')=>`<path d="${d}" class="${cls}" fill="none" ${extra}/>`;
const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
export function terminalGeometry(i){
  const y=fiberY(i),x=884,w=57,h=38,ix=886+(i%2)*32,iy=y+(i-2.5)*4.4-h*.504;
  return {root:{x,y},image:{x:ix,y:iy,width:w,height:h},join:{x:ix,y:iy+h*.504},
    path:`M${x} ${y}C${x+12} ${y} ${ix-9} ${iy+h*.504} ${ix+4} ${iy+h*.504}`};
}
function sourceSoma(i){
  const y=fiberY(i),ix=i%2?53:11,iy=329+i*18.8,w=75,h=50,joinX=ix+w*.973,joinY=iy+h*.520;
  const d=`M${joinX-3} ${joinY}C${Math.max(joinX+5,106)} ${joinY} 116 ${y} 133 ${y}`;
  return `<g class="soma-source" data-source-soma="${i}">${line(d,'source-fiber')}${line(d,'fiber-highlight')}<image href="assets/neuron-soma.webp" x="${ix}" y="${iy}" width="${w}" height="${h}"/></g>`;
}
function fiber(i){
  const y=fiberY(i),terminal=terminalGeometry(i);
  return `<g data-fiber="${i}" data-speed="${VISIBLE_SPEEDS[i]}">${sourceSoma(i)}
    ${line(`M141 ${y}H${SPACE.right+3}`,'axon-base')}
    <g clip-path="url(#bundle-clip)">
      ${line(`M${SPACE.left} ${y}H${SPACE.right+6}`,'recovery-wave',`stroke="url(#recovery-${i})"`)}
      ${line(`M${SPACE.left} ${y}H${SPACE.right+6}`,'excitation-wave',`stroke="url(#pulse-${i})" data-forward-wave`)}
      ${line(`M${SPACE.left} ${y}H${axonX(0)}`,'excitation-wave',`stroke="url(#backward-${i})"`)}
    </g>
    <g class="terminal-source" data-terminal="${i}">${line(`M${SPACE.right} ${y}H${terminal.root.x}`,'source-fiber')}${line(terminal.path,'source-fiber')}${line(terminal.path,'fiber-highlight')}<image href="assets/axon-terminal.webp" x="${terminal.image.x}" y="${terminal.image.y}" width="${terminal.image.width}" height="${terminal.image.height}"/></g>
  </g>`;
}
function defs(){return `<defs>
  <linearGradient id="metal-probe"><stop stop-color="#607987"/><stop offset=".24" stop-color="#c7d9df"/><stop offset=".43" stop-color="#f5fbfd"/><stop offset=".70" stop-color="#b4c9d2"/><stop offset="1" stop-color="#75929e"/></linearGradient>
  <linearGradient id="post-steel"><stop stop-color="#8aa1a4"/><stop offset=".45" stop-color="#ebf3f3"/><stop offset="1" stop-color="#9aafb0"/></linearGradient>
  <linearGradient id="gold-contact"><stop stop-color="#946521"/><stop offset=".43" stop-color="#ecc987"/><stop offset="1" stop-color="#b88432"/></linearGradient>
  <linearGradient id="instrument-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#edf5f5"/></linearGradient>
  <clipPath id="frog-magnifier"><circle cx="213" cy="87" r="60"/></clipPath>
  <filter id="instrument-shadow" x="-15%" y="-15%" width="130%" height="145%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#55727a" flood-opacity=".13"/></filter>
  <linearGradient id="sheath-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#90bdab" stop-opacity=".35"/><stop offset=".3" stop-color="#e2f0e5" stop-opacity=".10"/><stop offset=".7" stop-color="#e2f0e5" stop-opacity=".08"/><stop offset="1" stop-color="#8cbdad" stop-opacity=".30"/></linearGradient>
  <clipPath id="bundle-clip"><rect x="${SPACE.left-8}" y="${SPACE.top+3}" width="${SPACE.right-SPACE.left+20}" height="${SPACE.bottom-SPACE.top-6}" rx="10"/></clipPath>
  ${VISIBLE_SPEEDS.map((v,i)=>['pulse','backward','recovery'].map(kind=>`<linearGradient id="${kind}-${i}" data-gradient="${kind}" data-index="${i}" gradientUnits="userSpaceOnUse" x1="0" x2="1" y1="0" y2="0">${(kind==='recovery'?[[0,0],[.25,.65],[.72,.65],[1,0]]:[[0,0],[.18,.10],[.35,.55],[.5,1],[.65,.55],[.82,.10],[1,0]]).map(([offset,opacity])=>`<stop offset="${offset}" stop-color="${kind==='recovery'?'#82a6bc':'#de485e'}" stop-opacity="${opacity}"/>`).join('')}</linearGradient>`).join('')).join('')}
  <linearGradient id="record-response" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#eeacb0" stop-opacity="0"/><stop offset=".5" stop-color="#eeacb0" stop-opacity=".55"/><stop offset="1" stop-color="#eeacb0" stop-opacity="0"/></linearGradient>
  <marker id="conduction-direction" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M1 1L7 3.5L1 6" fill="none" stroke="#719d9a" stroke-width="1.3"/></marker>
  </defs>`;}
function frog(){return `<g data-frog-inset aria-label="青蛙腹面与一侧后肢解剖示意">
    <image href="assets/frog.webp" x="13" y="30" width="135" height="135" preserveAspectRatio="xMidYMid meet"/>
    <circle cx="112" cy="120" r="15" class="magnifier-source"/>
    ${line('M125 111L158 94M123 131L174 135','magnifier-link')}
    <path d="M255 130L277 152" class="magnifier-handle"/><path d="M255 129L275 148" class="magnifier-handle-highlight"/>
    <circle cx="213" cy="87" r="64" class="magnifier-rim"/>
    <circle cx="213" cy="87" r="61" fill="#fffef8"/>
    <g clip-path="url(#frog-magnifier)"><image href="assets/frog-detail.webp" x="144" y="18" width="147" height="147"/></g>
    <circle cx="213" cy="87" r="60" fill="none" stroke="#c5d5cc" stroke-width=".8"/>
    <g class="optional-label">${text(23,16,'标本来源 · 青蛙腹面','section-label')}
    ${line('M196 66L137 176H146','nerve-leader')}${circle(196,66,2.1,'#b89d35')}${text(150,182,'坐骨神经','detail-label')}
    ${line('M225 98L241 176H248','muscle-leader')}${circle(225,98,2.1,'#b97780')}${text(252,182,'腓肠肌','detail-label')}
    </g></g>`;}
function chamber(){
  let s=`<g data-chamber aria-label="神经搭在电极柱上"><g class="optional-label">${text(338,16,'坐骨神经 · 电极槽','section-label')}</g><rect x="319" y="91" width="654" height="67" rx="8" fill="#edf2ef" stroke="#d0deda"/>`;
  s+=CHAMBER_POSTS.map(mm=>`<g data-unused-post="${mm}" transform="translate(${chamberX(mm)} 0)"><rect x="-2.3" y="80" width="4.6" height="67" rx="1.5" fill="url(#post-steel)" stroke="#a0b5b2" stroke-width=".5"/></g>`).join('');
  s+=['anode','cathode','ground','r1','r2'].map(k=>`<g data-chamber-electrode="${k}"><rect x="-3" y="80" width="6" height="69" rx="2" class="electrode-post ${k}"/><path d="M-1 83V145" class="post-highlight"/>${text(0,176,k==='anode'?'S+':k==='cathode'?'S−':k==='ground'?'G':k.toUpperCase(),'small','text-anchor="middle"')}</g>`).join('');
  s+=line('M331 99Q594 76 754 94T962 97','nerve-rope')+line('M331 97Q594 74 754 92T962 95','nerve-rope-light');
  s+=line(`M${chamberX(-6)} 82V39H${chamberX(0)}V82`,'circuit-wire')+text((chamberX(-6)+chamberX(0))/2,54,'S','small','text-anchor="middle"');
  s+=line('M0 0','chamber-lead r1','data-chamber-lead="r1"')+line('M0 0','chamber-lead r2','data-chamber-lead="r2"');
  s+=`<path d="M869 30V65L913 47.5Z" fill="#fbfefe" stroke="#62828b" stroke-width="1.4"/>${text(873,44,'−','tiny','data-chamber-sign="r1"')}${text(873,59,'+','tiny','data-chamber-sign="r2"')}${text(923,53,'U','label')}`;
  s+=text(665,176,'','tiny','data-chamber-condition text-anchor="middle"');
  return s+'</g>';}
function sheath(){
  const {left:l,right:r,top:t,bottom:b}=SPACE,mid=(t+b)/2;
  const outline=`M${l} ${t}Q${(l+r)/2} ${t-5} ${r} ${t}A12 56 0 0 1 ${r} ${b}Q${(l+r)/2} ${b+5} ${l} ${b}A12 56 0 0 1 ${l} ${t}Z`;
  return {back:`<path data-sheath-back d="${outline}" fill="#eff6ed" fill-opacity=".7" stroke="#92b6a9" stroke-width="1.3"/><ellipse cx="${l}" cy="${mid}" rx="12" ry="56" fill="#e0eee5" fill-opacity=".28" stroke="#9cbeae"/>`,
    front:`<path data-sheath-front d="${outline}" fill="url(#sheath-shade)" stroke="#8bad9f" stroke-width="1.1"/><path d="M${r} ${t}A12 56 0 0 0 ${r} ${b}" fill="none" stroke="#8eae9e" stroke-width="1.1" opacity=".75"/>`};}
function circuits(){
  return `<g class="stimulator" transform="translate(169 232) scale(.86)">${stimulatorBody}</g>
    <g data-stim-wires>${line('M205.55 293.92V299H'+axonX(-6)+'V307','circuit-wire')}${line('M278.65 293.92V301H'+axonX(0)+'V307','circuit-wire')}
    ${line('M205.55 293.92V299H'+axonX(-6)+'V307M278.65 293.92V301H'+axonX(0)+'V307','wire-gloss')}
    ${line('M205.55 293.92V299H'+axonX(-6)+'V337M278.65 293.92V301H'+axonX(0)+'V337','stim-wire-pulse','data-stim-wire opacity="0"')}
    ${[-6,0].map((x,i)=>`<g transform="translate(${axonX(x)} 0)"><rect x="-5" y="306" width="10" height="22" rx="3" class="probe-body"/><path d="M0 326V339" class="probe-contact"/>${text(i?10:-10,322,i?'−':'+','tiny',`text-anchor="${i?'start':'end'}"`)}</g>`).join('')}</g>
    <g data-pulse-callout opacity="0">${line(`M${axonX(0)-8} 352l9-12-3 11 10-9`,'stim-zig')}${text(axonX(0)+19,354,'刺激','small')}</g>
    <g data-recorder-body><rect x="789" y="229" width="170" height="72" rx="8" class="instrument-box"/>${text(874,248,'差分放大器','small','text-anchor="middle"')}
    <path d="M817 256V291L856 273.5Z" class="amplifier"/>${text(822,268,'−','tiny','data-input-sign="r1"')}${text(822,284,'+','tiny','data-input-sign="r2"')}
    ${text(900,279,'R2 − R1','small','data-circuit-equation text-anchor="middle"')}
    </g>
    ${['r1','r2'].map((id,i)=>`<path data-record-wire="${id}" class="record-wire ${id}" fill="none"/><path data-record-wire="${id}" class="wire-gloss" fill="none"/><g data-probe="${id}"><rect x="-5" y="305" width="10" height="22" rx="3" class="probe-body"/><rect x="-4.8" y="308" width="9.6" height="4" rx="1" class="record-collar ${id}"/><path d="M0 326V339" class="probe-contact"/><circle cx="0" cy="338" r="2.4" class="contact-dot ${id}"/><path d="M0 344V445" class="record-projection ${id}"/><rect data-record-label-back="${id}" x="-56" y="309" width="45" height="22" rx="5" class="record-label-back"/>${text(-15,325,id.toUpperCase()+' '+(i?'+':'−'),'record-name',`data-record-label="${id}" text-anchor="end"`)}<rect data-response-band="${id}" x="-17" y="341" width="34" height="105" fill="url(#record-response)" opacity="0"/></g>`).join('')}`;
}
function axonBreak(x){
 const d=`M${x} 339C${x-6} 349 ${x+6} 359 ${x} 369S${x-6} 389 ${x} 399S${x+6} 419 ${x} 429S${x-6} 449 ${x} 458`;
 return `<g class="axon-break" aria-label="省略的一段轴突">${line(d,'break-cut')}${line(d,'break-edge')}${line(d,'break-edge break-edge-second',`transform="translate(7 0)"`)}</g>`;
}
export function sceneMarkup(){const layer=sheath();return `<svg class="nerve-scene" viewBox="0 0 ${SPACE.width} ${SPACE.height}" role="img" aria-label="双极膜外记录：紧密平行纤维被神经外膜包裹，小胞体在左，轴突末梢分支在右；刺激与记录接点位于神经表面">
  ${defs()}<g data-model-world>${frog()}${chamber()}<path d="M20 193H980" class="figure-divider"/>
  <g class="optional-label">${text(23,216,'神经干 · 纤维群传导','section-label')}${text(489,216,'电极接触神经外表面','small')}
  ${text(75,302,'胞体来源','small','text-anchor="middle"')}${text(75,319,'（示意）','small','text-anchor="middle"')}</g>
  ${layer.back}${VISIBLE_SPEEDS.map((_,i)=>fiber(i)).join('')}${layer.front}${axonBreak(134)}${axonBreak(873)}${circuits()}
  <g class="optional-label">${line('M695 452L713 474H821','sheath-leader')}${text(821,492,'神经外膜（示意）','small','text-anchor="end"')}
  ${line('M945 459L952 479','terminal-leader')}${text(977,502,'轴突末梢','small','text-anchor="end"')}
  ${line('M330 519H678','direction-line','marker-end="url(#conduction-direction)"')}${text(504,545,'兴奋沿记录方向传导','small','text-anchor="middle"')}</g>
  </g></svg>`;}
