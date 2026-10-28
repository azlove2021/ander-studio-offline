import {WORLD,ROUTES,FLOW_LANES,LIGHT_ROUTES,RETURN_EVENTS,FLOW_STYLE,progress,smooth,lerp,point} from './engine.js';
import {arrowMarker} from './path-utils.js';
import {PROTEIN_ASSETS} from './protein-assets.js';
import {NativeLipidLayer} from './lipids.js';
import {molecularDefs,bead,electronGlyph,protonGlyph,nucleotideGlyph} from './molecules.js';
const NS='http://www.w3.org/2000/svg';
const add=(p,html)=>{const n=document.createElementNS(NS,'g');n.innerHTML=html;p.append(n);return n;};
const attr=(n,k,v)=>{if(n&&n.getAttribute(k)!==String(v))n.setAttribute(k,v);};
const put=(n,t)=>{if(n&&n.textContent!==t)n.textContent=t;};
const move=(n,xy,scale=1)=>attr(n,'transform','translate('+xy.map(v=>v.toFixed(3)).join(' ')+') scale('+scale+')');
const show=(n,on)=>attr(n,'visibility',on?'visible':'hidden');
// The wave phase belongs to the teaching clock, so pause and reverse seek freeze it exactly.
function photonWave(key,phase){
 const a=LIGHT_ROUTES[key].at(0),b=LIGHT_ROUTES[key].at(1),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
 let d='';for(let i=0;i<=56;i++){const u=i/56,offset=11*Math.sin(2*Math.PI*(u*length-phase)/64)*Math.sin(Math.PI*u)**2;
  d+=(i?'L':'M')+(a[0]+u*dx-dy/length*offset).toFixed(2)+' '+(a[1]+u*dy+dx/length*offset).toFixed(2);}
 return d;
}
function label(x,y,title,sub,color){return '<text class="label" x="'+x+'" y="'+y+'" text-anchor="middle" style="fill:'+color+'">'+title+'</text><text class="sub detail" x="'+x+'" y="'+(y+27)+'" text-anchor="middle">'+sub+'</text>';}
// Functional surfaces are independent imagegen assets; optical bounds preserve native aspect ratio.
function lobe(cx,cy,rx,ry,color,phase=0){
 let d='';const n=36;
 for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=1+.037*Math.sin(a*7+phase)+.025*Math.cos(a*11);d+=(i?'L':'M')+(cx+rx*Math.cos(a)*r).toFixed(2)+' '+(cy+ry*Math.sin(a)*r).toFixed(2);}
 return '<path class="protein-lobe" d="'+d+'Z" fill="url(#protein-'+color+')"/>';
}
function proteinSprite(id,x,y,width){
 const a=PROTEIN_ASSETS[id],b=a.opticalBounds,h=width*(b[3]-b[1])/(b[2]-b[0]);
 return '<svg class="protein-surface" x="'+x+'" y="'+y+'" width="'+width+'" height="'+h+'" viewBox="'+[b[0],b[1],b[2]-b[0],b[3]-b[1]].join(' ')+'" overflow="hidden"><image href="assets/'+a.file+'" width="'+a.width+'" height="'+a.height+'"/></svg>';
}
function membraneProtein(id,x){
 const box=id==='psii'?[x-150,265,300]:id==='psi'?[x-150,260,300]:[x-92.5,270,185];
 return '<g class="protein" data-object="'+id+'">'+proteinSprite(id,...box)+'<ellipse cx="'+x+'" cy="358" rx="37" ry="25" fill="#fffdf6" fill-opacity=".92"/><text class="protein-badge" x="'+x+'" y="366" text-anchor="middle">'+(id==='b6f'?'b₆f':id.toUpperCase())+'</text></g>';
}
function pqGlyph(){return '<path class="molecule-bond" d="M-16 11l-13 6-11-7-11 6-10-7-10 6"/>'+
 '<polygon class="molecular-ring" points="-18,-10 0,-20 18,-10 18,10 0,20 -18,10" fill="url(#mol-adenine)"/>'+
 '<path class="molecule-bond" d="M-18 -10l-9-6M18 -10l9-6"/><text class="atom-detail" x="-41" y="-16">CH₃</text><text class="atom-detail" x="26" y="-16">CH₃</text>'+
 bead('oxygen',0,-24,6)+bead('oxygen',0,24,6)+'<g class="pq-h">'+bead('hydrogen',-9,-29,4)+bead('hydrogen',9,29,4)+'</g><text class="species-symbol" text-anchor="middle" y="5">PQ</text>';}
// NADP(H): adenosine 2'-phosphate stays in place; the redox end is nicotinamide C4.
function nadpGlyph(){return '<g data-topology="NADP:adenosine2primeP-pyrophosphate-ribose-nicotinamide">'+
 '<polygon class="molecular-ring" points="-130,-23 -115,-32 -100,-23 -100,-5 -115,4 -130,-5" fill="url(#mol-adenine)"/>'+
 '<polygon class="molecular-ring" points="-100,-23 -83,-29 -73,-14 -84,1 -100,-5" fill="url(#mol-adenine)"/>'+
 '<path class="molecule-bond" d="M-84 1L-77 20M-39 20L-25 10H-11M11 10H14M36 10H44L55 20M94 20L113 13M147 13l13 8M-68 43v15"/>'+
 '<polygon class="molecular-ring" points="-77,20 -57,8 -39,20 -44,43 -68,43" fill="url(#mol-ribose)"/>'+
 '<polygon class="molecular-ring" points="55,20 74,8 94,20 85,43 62,43" fill="url(#mol-ribose)"/>'+
 '<text class="atom-detail" x="-60" y="15">O</text><text class="atom-detail" x="71" y="15">O</text>'+
 bead('phosphate',0,10,11,'P')+bead('phosphate',25,10,11,'P')+
 '<g data-nadp-2prime-phosphate>'+bead('phosphate',-68,70,11,'P')+'<text class="atom-detail" x="-91" y="77">2′</text></g>'+
 '<polygon class="molecular-ring nicotinamide" points="113,13 113,-7 130,-17 147,-7 147,13 130,23" fill="url(#mol-ribose)"/>'+
 '<text class="atom-detail" x="156" y="32">CONH₂</text><text class="atom-detail" x="111" y="18">N</text>'+
 '<g class="nadp-redox-h"><path class="molecule-bond" d="M147 -7l10-13"/>'+bead('hydrogen',160,-26,8,'H')+'</g>'+
 '<text class="nadp-charge" x="102" y="12">+</text></g>';}
const palette={psii:['#e4efd8','#95b293','#607f6d'],b6f:['#f7e7be','#d1b16a','#9f8147'],psi:['#dcf0ed','#7db8b0','#477f7e'],atp:['#fae1cc','#dba279','#a97755'],fnr:['#ece2f1','#b7a2bf','#86748f']};
function definitions(){return transport2dDefs()+molecularDefs()+'<defs>'+Object.entries(palette).map(([id,c])=>'<radialGradient id="protein-'+id+'" cx="28%" cy="20%" r="90%"><stop stop-color="'+c[0]+'"/><stop offset=".55" stop-color="'+c[1]+'"/><stop offset="1" stop-color="'+c[2]+'"/></radialGradient>').join('')+
 '<linearGradient id="stroma-wash" x2="0" y2="1"><stop stop-color="#fffdf5"/><stop offset="1" stop-color="#faf9ee"/></linearGradient><linearGradient id="lumen-wash" x2="0" y2="1"><stop stop-color="#edf8f8"/><stop offset="1" stop-color="#f6fbf8"/></linearGradient>'+
 '<clipPath id="membrane-clip"><rect x="-10" y="295" width="1820" height="141"/></clipPath>'+
 '<linearGradient id="rotor-copper"><stop stop-color="#bd8159"/><stop offset=".35" stop-color="#efb587"/><stop offset=".62" stop-color="#d9996e"/><stop offset="1" stop-color="#a56646"/></linearGradient>'+
 '<linearGradient id="shaft-copper"><stop stop-color="#b47551"/><stop offset=".4" stop-color="#f5c695"/><stop offset="1" stop-color="#bd815b"/></linearGradient>'+
 '<radialGradient id="binding-soft-wash"><stop offset="0" stop-color="#fffdf6" stop-opacity=".80"/><stop offset=".62" stop-color="#fffdf6" stop-opacity=".70"/><stop offset=".85" stop-color="#fffdf6" stop-opacity=".36"/><stop offset="1" stop-color="#fffdf6" stop-opacity="0"/></radialGradient></defs>';}
export class PhotosyntheticScene{
 constructor(svg,energy){
  this.svg=svg;this.energy=energy;this.lanes=[];this.rotor=[];this.pockets=[];
  svg.innerHTML=definitions()+'<g id="scene-foreground">'+
   '<g id="continuous-inner-membrane" clip-path="url(#membrane-clip)"><g transform="translate(0 142.2) scale(.8)">'+transportIntegratedLipids()+'</g><g transform="translate(1034.24 142.2) scale(.8)">'+transportIntegratedLipids()+'</g></g>'+
   '<g id="proteins">'+membraneProtein('psii',235,'psii','psii')+membraneProtein('b6f',620,'b6f','b6f')+membraneProtein('psi',975,'psi','psi')+
   '<g data-object="fnr" class="protein">'+proteinSprite('fnr',1152.5,133,115)+'<text class="protein-badge" x="1210" y="181" text-anchor="middle">FNR</text></g>'+
   '<g data-object="oec">'+'<ellipse cx="225" cy="470" rx="38" ry="23" fill="#fffdf6" fill-opacity=".62"/>'+'<text class="species-symbol" x="225" y="476" text-anchor="middle">OEC</text></g></g>'+
   '<g id="flow-paths"></g><g id="structural-labels">'+
   label(235,182,'光系统 Ⅱ','第一次光激发','#5e8067')+label(620,182,'细胞色素 b₆f','Q 循环 · 净效应','#9c8046')+
   label(975,182,'光系统 Ⅰ','第二次光激发','#4e8581')+
   '<text x="490" y="285" text-anchor="middle" class="label" style="fill:#7d8c55">PQ / PQH₂</text><text x="490" y="310" text-anchor="middle" class="tiny detail">膜内载体 · 2e⁻ / 次</text>'+
   '<text x="820" y="583" text-anchor="middle" class="label" style="fill:#a58e65">PC</text><text x="820" y="609" text-anchor="middle" class="sub detail">腔侧 · 1e⁻ / 次</text>'+
   '<text x="1090" y="88" text-anchor="middle" class="label" style="fill:#7b8b9a">Fd</text><text x="1090" y="113" text-anchor="middle" class="tiny detail">基质侧 · 1e⁻ / 次</text>'+
   '<text x="1200" y="582" text-anchor="middle" class="sub detail">FNR · 2e⁻ → NADPH</text><text x="1200" y="609" text-anchor="middle" class="tiny detail">消耗基质侧 H⁺</text>'+
   '<text x="1740" y="365" text-anchor="end" class="tiny detail">类囊体膜</text>'+
   '<text x="385" y="218" text-anchor="middle" class="tiny h-label detail">取 2H⁺</text><text x="695" y="248" text-anchor="start" class="tiny h-label detail">另取 2H⁺</text>'+
   '<text x="620" y="582" text-anchor="middle" class="sub h-label detail">净 4H⁺ / 2e⁻</text><text x="620" y="607" text-anchor="middle" class="tiny detail">含 PQH₂ 携带的 H⁺</text>'+
   '<text x="1600" y="595" text-anchor="middle" class="label" style="fill:#a77857">ATP 合酶</text><text x="1600" y="622" text-anchor="middle" class="sub detail">H⁺ 回流 → 转动 → 催化</text>'+
   '<text x="1600" y="650" text-anchor="middle" class="tiny detail">示踪粒子不换算 ATP 产量</text>'+
   '<text id="q-status" x="490" y="453" text-anchor="middle" class="tiny"></text>'+
   '<text id="oec-status" x="225" y="705" text-anchor="middle" class="tiny"></text>'+
   '</g><g id="photons"></g><g id="movers"></g></g>';
  // Anchor the stroke inside the head so its square end cannot poke through the tip.
  svg.querySelectorAll('marker[id$="-flow-arrow"]').forEach(n=>attr(n,'refX',22));
  this.background=document.createElementNS(NS,'svg');this.background.id='science-background';this.background.setAttribute('viewBox','0 0 1800 720');
  this.background.innerHTML='<rect x="-10000" y="-10000" width="21800" height="20720" fill="#fffdf8"/><rect x="-10000" y="-10000" width="21800" height="10315" fill="#faf9f0"/><rect x="-10000" y="415" width="21800" height="10305" fill="#edf8f6"/><rect y="314" width="1800" height="103" fill="#eef4df"/><rect id="gradient-wash" x="-10000" y="416" width="21800" height="10304" fill="#b8dddb" opacity="0"/>';
  svg.before(this.background);
  this.lipids=new NativeLipidLayer(svg);const front=svg.querySelector('#scene-foreground'),paths=svg.querySelector('#flow-paths'),movers=svg.querySelector('#movers');
  FLOW_LANES.forEach(lane=>{const style=FLOW_STYLE[lane.kind],marker=' marker-end="url(#'+lane.kind+'-flow-arrow)"';
   // One continuous casing per lane prevents inactive segments from cutting active junctions.
   const el=add(paths,'<path class="flow-casing" opacity=".45" d="'+lane.curve.d+'"/><path class="flow-line flow-base" opacity="'+style.idle+'" d="'+lane.curve.d+'"'+marker+'/>'+
    (lane.segmented?lane.ids.map((id,i)=>'<path class="flow-line flow-active" data-segment="'+id+'" opacity="0" d="'+ROUTES[id].d+'"'+(i===lane.ids.length-1?marker:'')+'/>').join(''):'<path class="flow-line flow-active" opacity="0" d="'+lane.curve.d+'"'+marker+'/>'));
   attr(el,'class','flow-route');attr(el,'data-lane',lane.id);attr(el,'data-kind',lane.kind);attr(el,'style','--flow-color:'+style.color+';--flow-width:'+style.width+';--flow-casing:'+(style.width+4));
   if(lane.offset)attr(el,'transform','translate('+lane.offset.join(' ')+')');
   this.lanes.push({lane,el,active:[...el.querySelectorAll('.flow-active')]});
  });
  this.pq=add(movers,pqGlyph());attr(this.pq,'data-object','pq');
  this.pc=add(movers,'<ellipse rx="26" ry="19" fill="url(#mol-carrier)" stroke="#ad9679"/><text y="5" text-anchor="middle" class="species-symbol">PC</text>');attr(this.pc,'data-object','pc');this.pc2=this.pc.cloneNode(true);movers.append(this.pc2);
  this.fd=add(movers,'<path d="M-25-5Q-14-26 10-20Q31-13 26 9Q10 25-10 17Q-27 11-25-5Z" fill="#a8bdc3" stroke="#7e9aa3"/><text y="5" text-anchor="middle" class="species-symbol">Fd</text>');attr(this.fd,'data-object','fd');
  this.electrons=Array.from({length:4},(_,i)=>{const n=add(movers,electronGlyph()+'<text class="electron-id" y="-23" text-anchor="middle">'+(i+1)+'</text>');attr(n,'data-electron','e'+(i+1));return n;});
  this.replacements=Array.from({length:4},()=>add(movers,electronGlyph()));
  this.protons=Array.from({length:12},()=>add(movers,protonGlyph()+'<text class="h-packet-count" x="0" y="-18" text-anchor="middle"></text>'));
  this.returns=Array.from({length:RETURN_EVENTS.length},()=>add(movers,protonGlyph()));
  this.waters=[0,1].map(i=>{const n=add(movers,bead('oxygen',0,0,17)+'<g class="water-h"><path class="molecule-bond" d="M-6 7l-12 10M6 7l12 10"/>'+bead('hydrogen',-19,18,9)+bead('hydrogen',19,18,9)+'</g>');attr(n,'data-source-oxygen',String(i));return n;});
  this.oxygenBond=add(movers,'<path d="M-7-4H7M-7 4H7" class="molecule-bond"/>');
  this.waterLabel=add(movers,'<text class="sub" text-anchor="middle">2 H₂O</text>');this.oxygenLabel=add(movers,'<text class="label" text-anchor="middle">O₂</text>');
  this.nadp=[0,1].map(i=>{const n=add(movers,nadpGlyph()+'<text class="nadp-name species-name" x="0" y="116" text-anchor="middle">NADP⁺</text>');attr(n,'data-object','nadp');attr(n,'data-nadp-id',String(i));return n;});
  const photonParent=svg.querySelector('#photons');
  this.photons=['psii','psi'].map((key,i)=>{
   const d=photonWave(key,0),node=add(photonParent,'<path class="photon-beam" d="'+d+'" marker-end="url(#light-flow-arrow)"/>'+[0,1].map(()=>'<path class="photon-front" d="'+d+'" pathLength="100" stroke-dasharray="18 182"/>').join('')+'<circle class="flash-halo" cx="'+(i?975:235)+'" cy="350" r="65"/><text class="tiny photon-label" x="'+(i?832:87)+'" y="'+(i?55:65)+'">光</text>');
   attr(node,'data-light',key);return{key,node,beam:node.querySelector('.photon-beam'),fronts:[...node.querySelectorAll('.photon-front')],halo:node.querySelector('.flash-halo')};
  });
  this.makeSynthase(front);this.makeEnergy();this.qStatus=svg.querySelector('#q-status');this.oecStatus=svg.querySelector('#oec-status');
 }
 makeSynthase(parent){
  // Reused Fo rotor, shaft, three pocket objects and nucleotide-binding mechanism from respiratory 2.4.1.
  // Only anchors/orientation and chloroplast functional outline are new. Ridges are decorative, not c-subunit counts.
  const p=add(parent,'<g class="protein" data-object="atp">'+proteinSprite('f1',1485,160,190)+
   '<path d="M1642 218Q1691 239 1680 350V402" fill="none" stroke="#b58664" stroke-width="13" stroke-linecap="round"/>'+
   '<path id="central-shaft" fill="none" stroke="url(#shaft-copper)" stroke-width="13" stroke-linecap="round"/>'+
   '<g id="fo-rotor"><path d="M1527 326Q1580 309 1633 325V390Q1580 409 1527 390Z" fill="url(#rotor-copper)" stroke="#b47b55"/><ellipse cx="1580" cy="324" rx="53" ry="10" fill="#e8ae7e"/></g>'+
   '<g id="catalytic-sites"></g><text x="1712" y="235" class="sub detail">F₁</text><text x="1712" y="380" class="sub detail">Fₒ</text></g>');
  this.shaft=p.querySelector('#central-shaft');this.rotorParent=p.querySelector('#fo-rotor');
  for(let i=0;i<12;i++){const rib=add(this.rotorParent,'<path d="M0 0Q-4 10 0 18T0 36T0 54T0 69" fill="none" stroke="url(#rotor-copper)" stroke-width="11" stroke-linecap="round"/>'+Array.from({length:7},(_,k)=>'<ellipse cx="'+(k%2?-1.8:1.8)+'" cy="'+(k*10+4)+'" rx="5.7" ry="5" fill="url(#rotor-copper)"/>').join(''));this.rotor.push(rib);}
  for(const xy of [[1530,215],[1620,215],[1580,275]]){const el=add(p.querySelector('#catalytic-sites'),'<path class="site-pocket" d="'+activeTransport2dPocketRecessPath({x:0,y:0,halfWidth:25,halfHeight:16})+'"/>');move(el,xy);this.pockets.push(el.firstChild);}
  const cat=add(p,'<ellipse class="binding-pocket-window" cx="1580" cy="235" rx="100" ry="62"/>'+[0,1].map(i=>'<g class="nucleotide-detail" data-nucleotide-slot="'+i+'">'+nucleotideGlyph()+'</g>').join('')+'<text class="nucleotide-state sub" x="1580" y="147" text-anchor="middle"></text>');
  this.nucleotides=[...cat.querySelectorAll('.nucleotide-detail')].map(node=>({node,terminal:node.querySelector('.terminal-phosphate'),bond:node.querySelector('.terminal-bond'),gamma:node.querySelector('.gamma-index')}));
  this.nucLabel=cat.querySelector('.nucleotide-state');this.bindingWindow=cat.querySelector('.binding-pocket-window');
  // Protein surfaces sit below the uninterrupted transport overlay and its tracers.
  attr(p,'id','atp-structure');parent.insertBefore(p,parent.querySelector('#flow-paths'));
  attr(cat,'data-object','atp');parent.append(cat);
 }
 makeEnergy(){
  this.energy.innerHTML='<defs>'+arrowMarker('z-arrow','electron',24)+arrowMarker('z-coupling-arrow','proton',22)+'</defs><g class="energy-wide">'+
   '<text x="16" y="37" class="energy-axis">还原能力 ↑</text><text x="16" y="61" class="energy-small">定性示意</text>'+
   '<path d="M178 146H265V36L480 92 610 112 735 138 790 146V26L975 65 1140 91" class="z-path" marker-end="url(#z-arrow)"/>'+
   '<path d="M645 122V167Q645 177 655 177H1300Q1310 177 1310 167V124" class="coupling-path" marker-end="url(#z-coupling-arrow)"/>'+
   '<rect class="coupling-box" x="1215" y="36" width="172" height="88" rx="14"/><text x="1301" y="65" text-anchor="middle" class="energy-name">H⁺ 电化学势</text><text x="1301" y="92" text-anchor="middle" class="energy-small">回流 → ATP</text>'+
   '<text x="280" y="29" class="energy-light">光 ①</text><text x="805" y="24" class="energy-light">光 ②</text>'+
   '<text x="205" y="205" class="energy-name" data-object="psii">PSII</text><text x="475" y="205" class="energy-name" data-object="pq">PQ</text><text x="605" y="205" class="energy-name" data-object="b6f">b₆f</text><text x="713" y="205" class="energy-name" data-object="pc">PC</text><text x="777" y="205" class="energy-name" data-object="psi">PSI</text><text x="963" y="205" class="energy-name" data-object="fd">Fd</text><text x="1080" y="205" class="energy-name" data-object="fnr">NADPH</text>'+
   '<g id="z-dots"></g><text x="960" y="174" class="energy-small">能量图与膜图：同一示踪</text></g>';
  this.zdots=Array.from({length:4},(_,i)=>add(this.energy.querySelector('#z-dots'),'<circle r="12" fill="#bd6256" stroke="#fffdf8" stroke-width="3"/><text y="4" text-anchor="middle" style="font-size:11px;fill:#fff">'+(i+1)+'</text>'));
  const vertices=[[178,146],[265,146],[265,36],[480,92],[610,112],[735,138],[790,146],[790,26],[975,65],[1140,91]];
  this.energyVariants=[];
  for(const compact of [false,true]){
   const map=xy=>[65+(xy[0]-178)*.59,compact?80+(xy[1]-26)*1.18:26+(xy[1]-26)*.48],pts=vertices.map(map),path='M'+pts.map(p=>p.join(' ')).join('L');
   const group=add(this.energy,'<path class="z-path" d="'+path+'" marker-end="url(#z-arrow)"/>'+
    '<text class="energy-light" x="128" y="'+(compact?78:24)+'">光 ①</text><text class="energy-light" x="438" y="'+(compact?66:20)+'">光 ②</text>'+
    '<text class="energy-name" x="78" y="'+(compact?264:132)+'">PSII</text><text class="energy-name" x="410" y="'+(compact?264:132)+'">PSI</text><text class="energy-name" x="577" y="'+(compact?264:132)+'">NADPH</text>'+
    (compact?'<text class="energy-axis" x="28" y="30">电子还原能力 ↑ · 定性图</text><text class="energy-small" style="font-size:22px" x="195" y="290">PQ → b₆f → PC</text><text class="energy-small" x="518" y="181">Fd</text><path class="coupling-path" d="M330 194V310Q330 320 340 320H370" marker-end="url(#z-coupling-arrow)"/><rect class="coupling-box" x="370" y="295" width="300" height="105" rx="16"/><text class="energy-name" x="520" y="335" text-anchor="middle">H⁺ 电化学势</text><text class="energy-small" x="520" y="371" text-anchor="middle">经 ATP 合酶回流 → ATP</text>':'<text class="energy-small" x="238" y="132">接力与梯度</text>'));
   attr(group,'class',compact?'energy-compact':'energy-summary');const dots=Array.from({length:4},(_,i)=>add(group,'<circle r="8" fill="#bd6256" stroke="#fffdf8" stroke-width="2"/><text y="3" text-anchor="middle" style="font-size:9px;fill:#fff">'+(i+1)+'</text>'));
   this.energyVariants.push({group,map,dots});
  }
  this.energyObserver=new ResizeObserver(()=>this.layoutEnergy());this.energyObserver.observe(this.energy.parentElement);this.layoutEnergy();
 }
 layoutEnergy(){
  const b=this.energy.getBoundingClientRect(),small=b.width<700,compact=small&&b.height>180;
  attr(this.energy,'viewBox',small?(compact?'0 0 720 440':'0 0 720 160'):'0 0 1410 220');
  attr(this.energy.querySelector('.energy-wide'),'display',!small?'inline':'none');attr(this.energyVariants[0].group,'display',small&&!compact?'inline':'none');attr(this.energyVariants[1].group,'display',compact?'inline':'none');
  attr(this.energy,'data-layout',small?(compact?'compact':'summary'):'wide');
 }
 draw(s,{labels=true}={}){
  this.state=s;attr(this.svg,'data-chapter',s.stageId);attr(this.svg,'data-labels',String(labels));this.lipids.draw(s.t);
  attr(this.background.querySelector('#gradient-wash'),'opacity',.20*s.gradientProgress);
  for(const {lane,el,active} of this.lanes){const on=lane.ids.some(id=>s.active.includes(id));attr(el,'data-active',on);
   active.forEach((n,i)=>{const lit=lane.segmented?s.active.includes(lane.ids[i]):on;attr(n,'opacity',lit?1:0);attr(n,'data-active',lit);});}
  move(this.pq,s.q.xy);show(this.pq,s.q.mode!=='net-cycle');show(this.pq.querySelector('.pq-h'),s.q.H===2);put(this.pq.querySelector('.species-symbol'),s.q.reduced?'PQH₂':'PQ');
  s.pcs.forEach((p,i)=>{const node=i?this.pc2:this.pc;move(node,[p.xy[0],p.xy[1]+25]);show(node,p.visible);});move(this.fd,[s.fd.xy[0],s.fd.xy[1]+22]);
  s.electrons.forEach((e,i)=>{move(this.electrons[i],e.xy,.85);show(this.electrons[i],e.visible);attr(this.electrons[i],'data-site',e.site);move(this.zdots[i],e.z);show(this.zdots[i],e.visible);});
  this.energyVariants.forEach(v=>s.electrons.forEach((e,i)=>{move(v.dots[i],v.map(e.z));show(v.dots[i],e.visible);}));
  this.replacements.forEach((n,i)=>{move(n,s.replacements[i].xy,.68);show(n,s.replacements[i].visible);});
  this.protons.forEach((n,i)=>{const e=s.protons[i];if(!e){show(n,false);return;}move(n,e.xy);show(n,e.visible);put(n.querySelector('.h-packet-count'),e.quantity===1?'':e.quantity+'H⁺');});
  this.returns.forEach((n,i)=>{move(n,s.returns[i].xy);show(n,s.returns[i].visible);});
  this.waters.forEach((n,i)=>{const w=s.waters[i];move(n,w.xy);show(n.querySelector('.water-h'),w.hydrogenVisible);show(n,w.visible);});
  move(this.waterLabel,[225,680]);show(this.waterLabel,s.waterVisible);move(this.oxygenBond,[225,lerp(470,625,s.oxygenProgress)]);show(this.oxygenBond,s.oxygenVisible);
  move(this.oxygenLabel,[225,669]);show(this.oxygenLabel,s.oxygen===1);
  s.nadp.forEach((v,i)=>{const n=this.nadp[i];move(n,v.xy,.5);show(n.querySelector('.nadp-redox-h'),v.reduced);show(n.querySelector('.nadp-charge'),!v.reduced);put(n.querySelector('.nadp-name'),v.reduced?'NADPH':'NADP⁺');attr(n,'data-reduced',v.reduced);});
  this.photons.forEach(({key,node,beam,fronts,halo})=>{const light=s.lights[key],d=photonWave(key,light.phase);attr(node,'data-active',light.active);attr(beam,'d',d);attr(beam,'opacity',light.active?1:.30);
   fronts.forEach((front,i)=>{const packet=light.packets[i];show(front,!!packet);if(packet){attr(front,'d',d);attr(front,'stroke-dashoffset',18-packet.progress*100);}});attr(halo,'opacity',light.absorption*.38);
  });
  put(this.qStatus,(s.q.pair?'第 2 组':'第 1 组')+' · '+({ready:'PQ 等待',loaded:'PQH₂ 已装载 · 等待递送',loading:'PQ 装载 '+s.q.loaded+'/2e⁻',delivery:'PQH₂ 递送', 'net-cycle':'Q 循环净交接',return:'空载 PQ 返回'}[s.q.mode]));
  put(this.oecStatus,'水氧化当量 '+s.oec+' / 4'+(s.oxygen===1?' · O₂ 已形成':''));
  const syn=s.synthesis,theta=syn.angle*Math.PI/180;
  this.rotor.forEach((n,i)=>{const a=theta+i*Math.PI/6,z=Math.cos(a);show(n,z>=0);attr(n,'transform','translate('+(1580+49*Math.sin(a)).toFixed(2)+' '+(324+(1-z)*6).toFixed(2)+') scale('+(0.5+Math.max(0,z)*.5).toFixed(3)+' 1)');});
  attr(this.shaft,'d','M1580 325C'+(1580+6*Math.cos(theta)).toFixed(2)+' 308 '+(1580-6*Math.cos(theta)).toFixed(2)+' 292 1580 278S'+(1580+5*Math.cos(theta)).toFixed(2)+' 251 1580 242');
  this.pockets.forEach((n,i)=>{const phase=(syn.phase+i/3)%1,v=syn.active?Math.sin(phase*Math.PI):0;attr(n,'transform','scale('+(1-v*.13).toFixed(3)+' '+(1+v*.12).toFixed(3)+')');});
  this.nucleotides.forEach(({node,terminal,bond,gamma},i)=>{const n=syn.nucleotides[i];move(node,n.xy,.98);show(node,n.visible);attr(node,'opacity',n.opacity);attr(node,'data-bound',n.bound);attr(node,'data-formed',n.formed);
   attr(terminal,'transform','translate('+(60+(1-n.join)*18).toFixed(2)+' '+(5-(1-n.join)*22).toFixed(2)+')');attr(bond,'opacity',n.formed?1:0);put(terminal.querySelector('text'),n.formed?'P':'Pi');show(gamma,n.formed);
  });
  attr(this.bindingWindow,'opacity',syn.bind*(1-syn.release)*.94);put(this.nucLabel,syn.label);
  this.energy.querySelectorAll('.coupling-box').forEach(n=>attr(n,'data-active',s.synthesis.active));this.energy.querySelectorAll('.coupling-path').forEach(n=>attr(n,'opacity',s.synthesis.active?1:.25));
 }
 select(id){this.svg.querySelectorAll('[data-object]').forEach(n=>attr(n,'data-selected',n.dataset.object===id));}
 destroy(){this.energyObserver.disconnect();}
 diagnostics(){return{nodes:this.svg.querySelectorAll('*').length,energyNodes:this.energy.querySelectorAll('*').length,lipids:this.lipids.getDiagnostics(),scientificTime:this.state?.t,viewBox:this.svg.getAttribute('viewBox'),backgroundViewBox:this.background.getAttribute('viewBox'),electronPool:4,returnTracePool:RETURN_EVENTS.length,ATPTopology:'adenine6+5-ribose5-5prime-phosphates',NADPTopology:'adenosine2primeP-retained',maturity:'formal-visual-candidate'};}
}
