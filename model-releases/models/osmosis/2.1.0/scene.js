// Approved v2 glass, membrane binding, paths and material definitions. Built once by renderer.
import{liquidPalette,funnelHalfWidth}from'./physics.js';
export{stages}from'./physics.js';
import{stages}from'./physics.js';
const outerFunnel='M316 55 L316 338 C316 363 286 369 266 395 C247 419 249 459 263 487 L397 487 C411 459 413 419 394 395 C374 369 344 363 344 338 L344 55 Z';
const innerFunnel='M321 55 L321 339 C321 366 291 374 271 398 C254 421 255 458 268 486 L392 486 C405 458 406 421 389 398 C369 374 339 366 339 339 L339 55 Z';
const beaker='M157 210 L157 511 C157 566 523 566 523 511 L523 210';
const beakerInside='M168 214 L168 509 C168 550 512 550 512 509 L512 214 Z';
const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const use=(id,x,y,scale=1,angle=0)=>`<use href="#${id}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle}) scale(${scale})"/>`;
function particles(){
 let out='<g class="particle-region" data-side="inside"></g><g class="particle-region" data-side="outside"></g><g class="crossing-traces" fill="none" stroke-linecap="round">';
 for(const[x,dir]of [[970,'up'],[1205,'up'],[1085,'down'],[1310,'down']])out+='<path data-direction="'+dir+'" d="M'+x+(dir==='up'?' 340V270':' 262V339')+'" stroke="#489bb0" stroke-width="2" opacity=".4" marker-end="url(#arrowBlue)"/>';
 return out+'</g><g class="crossing-molecules"></g>';
}
export function scene(s,labels=true){
 const stage=s.stage,i=s.inner,o=s.outer;
 const inn=liquidPalette(s.ci),ext=liquidPalette(s.co),meniscus=funnelHalfWidth(i);
 const liquidPointerY=Math.min(466,Math.max(418,i+20)),liquidPointerX=340-funnelHalfWidth(liquidPointerY);
 const ticks=Array.from({length:9},(_,j)=>{const y=271+j*27;return`<path d="M${j%2?478:468} ${y}h26"/><path d="M${j%2?478:468} ${y+1}h26" stroke="#ffffff" opacity=".8"/>`}).join('');
 const pores=[854,914,970,1027,1085,1144,1205,1256,1310,1364].map(x=>`<rect x="${x-9}" y="279" width="18" height="37" rx="8" fill="#f2fafb" stroke="#c1c9bb" stroke-width=".85"/><path d="M${x-4} 286v24" stroke="#fff" stroke-width="2" opacity=".7"/>`).join('');
 const microscopic=particles(s);
 return `<svg xmlns="http://www.w3.org/2000/svg" class="osmosis-scene" viewBox="0 0 1440 610" role="img" aria-labelledby="scene-title scene-desc">
 <title id="scene-title">渗透作用装置与半透膜局部放大图</title>
 <desc id="scene-desc">漏斗内为${s.insideName}，漏斗外为${s.outsideName}，底部半透膜包住漏斗口并用扎带固定。放大图上方对应漏斗内，下方对应漏斗外；水可通过，蔗糖不能通过。当前为${stages[stage][0]}。</desc>
 <defs>
  <linearGradient id="glassWall" x1="0" x2="1"><stop stop-color="#b4ced0" stop-opacity=".48"/><stop offset=".018" stop-color="#ffffff" stop-opacity=".97"/><stop offset=".055" stop-color="#e8f4f4" stop-opacity=".22"/><stop offset=".17" stop-color="#ffffff" stop-opacity=".04"/><stop offset=".78" stop-color="#ffffff" stop-opacity=".015"/><stop offset=".944" stop-color="#d1e6e6" stop-opacity=".25"/><stop offset=".982" stop-color="#8eafb4" stop-opacity=".5"/><stop offset="1" stop-color="#edfafa" stop-opacity=".9"/></linearGradient>
  <linearGradient id="beakerRear" x1="0" y1="0" x2="1" y2=".25"><stop stop-color="#b9d6da" stop-opacity=".13"/><stop offset=".24" stop-color="#fff" stop-opacity=".09"/><stop offset=".8" stop-color="#d6ecea" stop-opacity=".14"/><stop offset="1" stop-color="#8faeb5" stop-opacity=".18"/></linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b7ced0" stop-opacity=".68"/><stop offset=".33" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#d4e7e7" stop-opacity=".7"/><stop offset="1" stop-color="#99b5b9" stop-opacity=".58"/></linearGradient>
  <linearGradient id="waterFill" x1="0" y1="0" x2=".15" y2="1"><stop stop-color="${ext.top}" stop-opacity=".46"/><stop offset=".52" stop-color="${ext.mid}" stop-opacity=".38"/><stop offset="1" stop-color="${ext.bottom}" stop-opacity=".58"/></linearGradient>
  <linearGradient id="waterSurface" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${ext.light}" stop-opacity=".82"/><stop offset="1" stop-color="${ext.surface}" stop-opacity=".65"/></linearGradient>
  <linearGradient id="solutionFill" x1="0" y1="0" x2=".75" y2="1"><stop stop-color="${inn.top}" stop-opacity=".64"/><stop offset=".52" stop-color="${inn.mid}" stop-opacity=".58"/><stop offset="1" stop-color="${inn.bottom}" stop-opacity=".76"/></linearGradient>
  <linearGradient id="solutionSide"><stop stop-color="#247e70" stop-opacity=".2"/><stop offset=".27" stop-color="#e7fff1" stop-opacity=".2"/><stop offset=".72" stop-color="#effff6" stop-opacity="0"/><stop offset="1" stop-color="#1c695d" stop-opacity=".22"/></linearGradient>
  <radialGradient id="floorShadow"><stop stop-color="#859e9e" stop-opacity=".16"/><stop offset=".65" stop-color="#b1c5c2" stop-opacity=".07"/><stop offset="1" stop-color="#dae8e3" stop-opacity="0"/></radialGradient>
  <radialGradient id="waterBall" cx=".3" cy=".2" r=".85"><stop stop-color="#edfaff"/><stop offset=".42" stop-color="#9bd5e5"/><stop offset="1" stop-color="#4c9db8"/></radialGradient>
  <linearGradient id="sugarFill" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="#fff0c3"/><stop offset="1" stop-color="#d7a34f"/></linearGradient>
  <linearGradient id="membraneFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#faf5e9"/><stop offset=".5" stop-color="#e5dec7"/><stop offset="1" stop-color="#c8c3a7"/></linearGradient>
  <linearGradient id="microTop" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fdfefc"/><stop offset="1" stop-color="${inn.light}"/></linearGradient>
  <linearGradient id="microBottom" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${ext.light}"/><stop offset="1" stop-color="#fbfdfa"/></linearGradient>
  <pattern id="membraneWeave" width="11" height="8" patternUnits="userSpaceOnUse"><path d="M0 4Q3 0 6 4T12 4 M3 0Q7 4 3 8" fill="none" stroke="#a8a48e" stroke-width=".7" opacity=".35"/></pattern>
  <filter id="softHighlight" x="-50%" y="-15%" width="200%" height="130%"><feGaussianBlur stdDeviation="1.2"/></filter>
  <clipPath id="beakerClip"><path d="${beakerInside}"/></clipPath>
  <clipPath id="funnelClip"><path d="${innerFunnel}"/></clipPath>
  <clipPath id="microClip"><rect x="795" y="88" width="610" height="431" rx="23"/></clipPath>
  <marker id="arrowBlue" markerWidth="7" markerHeight="7" refX="5.8" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" stroke="#489bb0" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></marker>
  <g id="water"><circle cy=".5" r="5.3" fill="url(#waterBall)" stroke="#72b4c7" stroke-width=".7"/><circle cx="-4" cy="4.1" r="2.7" fill="#eff9fc" stroke="#a3ced8" stroke-width=".5"/><circle cx="4" cy="4.1" r="2.7" fill="#eff9fc" stroke="#a3ced8" stroke-width=".5"/><ellipse cx="-1.8" cy="-2.1" rx="1.5" ry=".9" fill="#fff" opacity=".8"/></g>
  <g id="sucrose"><path d="M-15-5 L-7-10 L1-5 V5 L-7 10 L-15 5Z M4-6 L14-8 L20 0 L14 8 L4 6Z" fill="url(#sugarFill)" stroke="#b48a48" stroke-width="1.1" stroke-linejoin="round"/><path d="M-12-3 L-7-6 L-2-3 M7-3 L13-5 L16-1" fill="none" stroke="#fff" stroke-width="1.5" opacity=".76"/><path d="M1 0h3" stroke="#ae8a50" stroke-width="1.6"/></g>
 </defs>
 <g class="apparatus">
  <text x="36" y="36" class="panel-title">渗透作用装置</text><text x="36" y="61" class="panel-subtitle">漏斗内与烧杯内的液面变化</text>
  <ellipse cx="340" cy="561" rx="235" ry="29" fill="url(#floorShadow)"/>
  <path d="${beaker}" fill="url(#beakerRear)" stroke="#9fbabf" stroke-width="1.6"/>
  <path d="M157 210 C168 169 511 169 523 210" fill="none" stroke="url(#rim)" stroke-width="9"/>
  <path d="M158 209 C180 174 506 175 521 209" fill="none" stroke="#9fb9bd" stroke-width="1" opacity=".7"/>
  <g clip-path="url(#beakerClip)">
   <path d="M168 ${o} C168 ${o+31} 512 ${o+31} 512 ${o} V510 C512 550 168 550 168 510Z" fill="url(#waterFill)"/>
   <ellipse cx="340" cy="${o}" rx="172" ry="25" fill="url(#waterSurface)" stroke="${ext.edge}" stroke-opacity=".54" stroke-width="1"/>
   <path d="M175 ${o-2} C189 ${o-27} 489 ${o-27} 504 ${o-2}" fill="none" stroke="#fff" stroke-width="2" opacity=".65"/>
  </g>
  <g class="funnel">
   <path d="${outerFunnel}" fill="url(#glassWall)" stroke="#9bb7b9" stroke-width="1.5"/>
   <path d="${innerFunnel}" fill="none" stroke="#b7cfd0" stroke-width=".7" opacity=".7"/>
   <g clip-path="url(#funnelClip)">
    <rect x="238" y="${i}" width="184" height="${490-i}" fill="url(#solutionFill)"/>
    <rect x="242" y="${i}" width="179" height="${490-i}" fill="url(#solutionSide)"/>
    <ellipse class="inner-meniscus" cx="330" cy="${i}" rx="${meniscus}" ry="${Math.max(3.5,meniscus*.14)}" fill="${inn.surface}" stroke="${inn.edge}" stroke-width="1"/>
    <path d="M${331-meniscus} ${i-1} Q330 ${i+Math.max(3,meniscus*.13)} ${329+meniscus} ${i-1}" fill="none" stroke="#f5fffa" stroke-width="1.2"/>
   </g>
   <path d="M320 66 V339 C320 367 288 376 270 402 C259 420 258 445 263 460" fill="none" stroke="#fff" stroke-width="5" opacity=".72" filter="url(#softHighlight)"/>
   <path d="M320 64 V339 C320 364 290 373 273 394" fill="none" stroke="#fff" stroke-width="1.7" opacity=".9"/>
   <path d="M343 65 V339 C343 366 373 375 391 398 C402 415 405 433 402 453" fill="none" stroke="#759e9e" stroke-width="1.3" opacity=".65"/>
   <path d="M271 402 C263 418 262 436 265 448" fill="none" stroke="#f7fff8" stroke-width="6.5" stroke-linecap="round" opacity=".45"/>
   <path d="M393 431 C396 449 392 468 389 473" fill="none" stroke="#effff7" stroke-width="2" stroke-linecap="round" opacity=".56"/>
   <ellipse cx="330" cy="55" rx="17" ry="4.5" fill="url(#rim)" stroke="#a8c0c1" stroke-width="1"/>
   <ellipse cx="330" cy="55" rx="9.5" ry="2.5" fill="#e4eeee" stroke="#afc7c8" stroke-width=".65"/>
   <ellipse cx="330" cy="54.4" rx="13.5" ry="3.1" fill="none" stroke="#fff" stroke-width="1" opacity=".87"/>
   <g class="membrane-binding" aria-label="半透膜包住漏斗口，扎带固定">
    <path d="M257 474L264 478L271 473L279 479L289 475L299 481L312 477L326 481L341 477L353 481L365 477L379 480L390 475L397 479L403 474L407 498C391 514 269 514 253 498Z" fill="url(#membraneFill)" stroke="#aaa98b" stroke-width="1.1"/>
    <path d="M263 479L267 495 M278 479L281 499 M297 481L299 502 M318 481L319 504 M343 481L342 504 M364 480L362 502 M388 480L382 501 M400 480L392 497" fill="none" stroke="#b8b293" stroke-width="1" opacity=".72"/>
    <ellipse cx="330" cy="496" rx="72" ry="10" fill="url(#membraneFill)" stroke="#a7a17f" stroke-width="1"/>
    <ellipse cx="330" cy="496" rx="70" ry="8.2" fill="url(#membraneWeave)"/>
    <path d="M256 481C274 493 388 493 404 481 M255 485C277 497 386 497 405 485" fill="none" stroke="#70866d" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M257 480C278 490 387 490 402 480" fill="none" stroke="#c4d1b7" stroke-width=".9" stroke-linecap="round"/>
    <path d="M402 485C414 474 419 479 408 486C423 491 419 499 406 488L402 485 M408 488Q418 499 414 507 M405 489Q403 499 405 504" fill="none" stroke="#6b8168" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="405" cy="487" rx="3.5" ry="2.6" fill="#8f9f80" stroke="#667a60" stroke-width=".8"/>
   </g>
  </g>
  <g clip-path="url(#beakerClip)"><rect x="165" y="${o+7}" width="352" height="235" fill="#c9ecf4" opacity=".055"/><path d="M175 ${o+5} C204 ${o+30} 481 ${o+30} 505 ${o+5}" stroke="#e9fcff" fill="none" opacity=".25" stroke-width="2.2"/></g>
  <path d="${beaker}" fill="url(#glassWall)" stroke="#9fbabc" stroke-width="1.6"/>
  <path d="M163 229 V504 C163 550 517 550 517 504 V228" fill="none" stroke="#e7f4f2" stroke-width="6" opacity=".83"/>
  <path d="M170 247 V494" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" opacity=".88"/>
  <path d="M178 263 V481" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".39"/>
  <path d="M512 244 V506" fill="none" stroke="#719ba2" stroke-width="1.3" opacity=".53"/>
  <path d="M506 252 V500" fill="none" stroke="#f4fffd" stroke-width="2.5" opacity=".57"/>
  <path d="M166 517 C190 552 491 552 514 517" fill="none" stroke="#88adb0" stroke-width="2" opacity=".46"/>
  <path d="M173 532 C231 554 463 554 508 532" fill="none" stroke="#fff" stroke-width="2.5" opacity=".87"/>
  <g fill="none" stroke="#83a6ac" stroke-width="1.1" opacity=".62">${ticks}</g>
  <path d="M157 210 L138 196 Q132 193 136 204 L157 226" fill="url(#rim)" stroke="#a9c2c4" stroke-width="1.1"/>
  <path d="M158 210 C169 252 511 252 523 210" fill="none" stroke="url(#rim)" stroke-width="8.5"/>
  <path d="M158 211 C172 250 509 250 523 211" fill="none" stroke="#91b1b5" stroke-width="1.05" opacity=".72"/>
  <path d="M163 210 C177 244 505 244 518 210" fill="none" stroke="#fff" stroke-width="2.2" opacity=".92"/>
  <g class="glass-reference"><path d="M171 314H514" fill="none" stroke="#8eabb0" stroke-width="1" stroke-dasharray="4 5" opacity=".5"/></g>
  ${stage>0&&s.direction?`<g class="height-difference"><path d="M${339+meniscus} ${i}H564 M517 ${o}H564 M553 ${i}V${o}" fill="none" stroke="#5a9b8a" stroke-width="1.4"/><path d="M548 ${Math.min(i,o)+6} L553 ${Math.min(i,o)} L558 ${Math.min(i,o)+6} M548 ${Math.max(i,o)-6} L553 ${Math.max(i,o)} L558 ${Math.max(i,o)-6}" stroke="#5a9b8a" fill="none" stroke-width="1.4" stroke-linecap="round"/><text x="570" y="${(i+o)/2+7}" font-size="24" font-style="italic" fill="#3c8373">Δh</text><text x="570" y="${(i+o)/2+30}" class="small-label">液面高度差</text></g>`:''}
  <g class="labels" opacity="${labels?1:0}">
   <path d="M219 108H278L315 145" class="leader"/><text x="117" y="113" class="structure-label">长颈漏斗</text>
   <path d="M94 230H132L157 245" class="leader"/><text x="39" y="235" class="structure-label">烧杯</text>
   <path d="M142 383H206L${liquidPointerX} ${liquidPointerY}" class="leader"/><text x="35" y="379" class="structure-label" style="fill:${inn.text}">${s.insideName}</text><text x="35" y="401" class="small-label">漏斗内</text>
   <path d="M142 467H158L193 451" class="leader"/><text x="35" y="464" class="structure-label" style="fill:${ext.text}">${s.outsideName}</text><text x="35" y="486" class="small-label">漏斗外 · 烧杯内</text>
   <path d="M389 503L450 539H560" class="leader"/><text x="465" y="560" class="structure-label">半透膜</text><text x="465" y="580" class="small-label">扎带固定</text>
   <text x="538" y="320" class="small-label level-equality">初始液面齐平</text>
  </g>
  <ellipse cx="330" cy="496" rx="92" ry="21" fill="none" stroke="#76a798" stroke-width="1.2" stroke-dasharray="4 5" opacity=".8"/>
 </g>
 <g class="zoom-connector" fill="none" stroke="#a8c5bb" stroke-width="1.15" opacity=".72"><path d="M412 482L795 284"/><path d="M412 500L795 314"/></g>
 <g class="microscope">
  <text x="795" y="36" class="panel-title">半透膜局部</text><text x="795" y="61" class="panel-subtitle">上方对应漏斗内，下方对应烧杯内</text>
  ${use('water',1180,38,1.1)}<text x="1196" y="44" class="legend-label">水</text>${use('sucrose',1300,38,.72)}<text x="1321" y="44" class="legend-label">蔗糖</text>
  <g clip-path="url(#microClip)">
   <rect x="795" y="88" width="610" height="211" fill="url(#microTop)"/>
   <rect x="795" y="299" width="610" height="220" fill="url(#microBottom)"/>
   <path d="M795 282Q857 278 909 282T1027 282T1145 282T1263 282T1405 282V314Q1345 318 1285 314T1165 314T1045 314T925 314T795 314Z" fill="url(#membraneFill)" stroke="#b7b69c" stroke-width="1.15"/>
   <rect x="795" y="284" width="610" height="28" fill="url(#membraneWeave)"/>
   ${pores}${microscopic}
   <text x="817" y="117" class="region-label" fill="${inn.text}">漏斗内 · ${s.insideName}</text>
   <text x="817" y="498" class="region-label" fill="${ext.text}">漏斗外 · ${s.outsideName}</text>
   <text x="1390" y="498" text-anchor="end" class="small-label">水可通过，蔗糖不能通过</text>
  </g>
  <rect x="795" y="88" width="610" height="431" rx="23" fill="none" stroke="#cdded9" stroke-width="1.4"/>
  <g class="flux-readout">
   <text x="824" y="551" class="small-label">外 → 内</text><text x="824" y="579" class="flow-value" fill="#348873">${s.more}</text>
   <path d="M979 543V583" stroke="#dae7e1"/>
   <text x="1005" y="551" class="small-label">内 → 外</text><text x="1005" y="579" class="flow-value" fill="#68858d">${s.less}</text>
   <path d="M1160 543V583" stroke="#dae7e1"/>
   <text x="1186" y="551" class="small-label">净移动</text><text x="1186" y="579" class="flow-value" fill="#348873">${s.net}</text>
  </g>
 </g>
 </svg>`;
}
