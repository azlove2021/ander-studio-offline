import{DURATION,clamp,progress,smooth,lerp,point,ATLAS,ROUTES,DRAWN_ROUTES,FLOW_STYLE}from'./engine.js';
import{NativeLipidLayer}from'./lipids.js';
import{molecularDefs,bead,electronGlyph,protonGlyph,nucleotideGlyph,quinoneGlyph,donorGlyph}from'./molecules.js';
const NS='http://www.w3.org/2000/svg';
const attr=(el,name,value)=>{const v=String(value);if(el.getAttribute(name)!==v)el.setAttribute(name,v)};
const text=(el,value)=>{if(el.textContent!==value)el.textContent=value};
const move=(el,xy,scale=1)=>attr(el,'transform','translate('+xy[0].toFixed(2)+' '+xy[1].toFixed(2)+') scale('+scale+')');
const show=(el,on)=>attr(el,'opacity',on?1:0);
function add(parent,markup){const holder=document.createElementNS(NS,'g');holder.innerHTML=markup;parent.append(holder);return holder;}
const line=points=>points.map((p,i)=>(i?'L':'M')+p.join(' ')).join('');
export class ETCScene{
 constructor(svg,energy){
  this.svg=svg;this.energy=energy;svg.innerHTML=scienceDrawing()+molecularDefs();energy.innerHTML=energyDrawing();
  this.fg=svg.querySelector('#scene-foreground');this.objects=Object.fromEntries([...svg.querySelectorAll('[data-object]')].map(e=>[e.dataset.object,e]));
  this.background=add(svg.querySelector('#scene-background'),'<rect id="gradient-wash" width="1600" height="275" fill="#8bc5df" opacity="0"/>');this.wash=this.background.firstElementChild;
  const backdrop=document.createElementNS(NS,'svg');backdrop.id='science-background';backdrop.setAttribute('aria-hidden','true');backdrop.setAttribute('viewBox','0 0 1600 720');
  const defs=document.createElementNS(NS,'defs');for(const id of['ims-wash','matrix-wash','membrane-core-wash']){const gradient=svg.querySelector('#'+id).cloneNode(true);gradient.id='backdrop-'+id;defs.append(gradient)}backdrop.append(defs);
  const background=svg.querySelector('#scene-background');background.removeAttribute('clip-path');for(const rect of background.querySelectorAll('rect')){const fill=rect.getAttribute('fill');if(fill?.startsWith('url(#'))rect.setAttribute('fill',fill.replace('url(#','url(#backdrop-'));}backdrop.append(background);svg.before(backdrop);
  this.charges=add(this.fg,[270,545,750,1030,1310].map(x=>'<g transform="translate('+x+' 0)"><text y="253" text-anchor="middle" class="charge">+</text><text y="400" text-anchor="middle" class="charge">−</text></g>').join(''));
  // Fixed geometry: only entry scope and activity opacity change during scrubbing.
  const routeMarkup=DRAWN_ROUTES.map(({id,kind,entry,arrow})=>{const style=FLOW_STYLE[kind];return '<g data-route="'+id+'" data-kind="'+kind+'" data-entry="'+(entry||'all')+'" class="flow-route" style="--flow-color:'+style.color+';--flow-width:'+style.width+';--flow-casing:'+(style.width+3.6)+'"><path class="flow-casing" d="'+ROUTES[id].d+'"/><path class="flow-line" d="'+ROUTES[id].d+'" marker-end="'+(arrow===false?'none':'url(#'+kind+'-flow-arrow)')+'"/></g>';}).join('');
  this.routes=add(this.fg,routeMarkup);
  this.routeNodes=Object.fromEntries([...this.routes.querySelectorAll('[data-route]')].map(e=>[e.dataset.route,e]));
  this.particles=add(this.fg,'');this.particles.id='reaction-particles';
  const qEl=add(this.particles,quinoneGlyph());qEl.classList.add('q-carrier');qEl.dataset.q='representative';
  this.q={el:qEl,label:qEl.querySelector('.q-name'),hs:[...qEl.querySelectorAll('.q-h')],es:[...qEl.querySelectorAll('.q-electron')]};
  const qInfo=add(this.objects['Q-pool'],[1,2,3,4].map((v,i)=>'<text x="'+(499+i*68)+'" y="221" text-anchor="middle" class="q-step" data-q-step="'+i+'">'+v+' '+['接收','递送','交接','返回'][i]+'</text>').join('')+'<text x="602" y="246" class="q-status" text-anchor="middle"></text>');
  this.qSteps=[...qInfo.querySelectorAll('[data-q-step]')];this.qStatus=qInfo.querySelector('.q-status');
  this.donors=[0,1].map(i=>{const el=add(this.particles,donorGlyph('nadh')+donorGlyph('succinate')+'<text class="species-name donor-name" y="44" text-anchor="middle"></text>');return{el,label:el.querySelector('.donor-name'),nadh:el.querySelector('.substrate-nadh'),succinate:el.querySelector('.substrate-succinate'),charge:el.querySelector('.donor-charge'),bond:el.querySelector('.oxidation-bond')}});
  this.electrons=Array.from({length:4},()=>{const el=add(this.particles,electronGlyph());el.classList.add('dynamic-electron');return el});
  this.passageElectrons=Array.from({length:4},()=>{const el=add(this.particles,electronGlyph());el.classList.add('dynamic-electron');return el});
  this.terminalElectrons=Array.from({length:4},()=>{const el=add(this.particles,electronGlyph());el.classList.add('dynamic-electron');return el});
  this.protons=Array.from({length:20},()=>{const el=add(this.particles,protonGlyph());el.classList.add('tracked-proton');return el});
  this.cyts=[0].map(()=>{const el=add(this.particles,'<ellipse rx="23" ry="18" fill="url(#mol-carrier)" stroke="#aa876d" stroke-width="1.5"/><path d="M-14 -6Q-4 -14 9 -7T13 8" fill="none" stroke="#fff5e9" stroke-width="2" opacity=".55"/><g class="cyt-electron">'+electronGlyph()+'</g>');return{el,e:el.querySelector('.cyt-electron')}});
  this.fad=add(this.objects['complex-II'],'<rect x="550" y="453" width="111" height="28" rx="14" fill="url(#mol-ribose)" stroke="#a99680"/><text x="605" y="472" class="species-symbol" text-anchor="middle">FAD</text>').querySelector('text');
  this.makeOxygen();this.makeSynthase();
  this.totals=Object.fromEntries([...svg.querySelectorAll('[data-total]')].map(e=>[e.dataset.total,e]));
  this.lipids=new NativeLipidLayer(svg);this.lastTailT=null;
  this.energyAreas=[...document.querySelectorAll('[data-energy]')];this.energyBlocks=[...energy.querySelectorAll('[data-energy-block]')];
  this.energyLinks=[...energy.querySelectorAll('[data-energy-link]')];this.energyTexts=[...energy.querySelectorAll('[data-energy-state]')];this.energyBar=energy.querySelector('#energy-gradient-fill');
  this.gradientLabel=document.querySelector('#gradient-state');this.routeNote=svg.querySelector('#route-count-note');this.shapeNote=svg.querySelector('#shape-note');
  this.detailLabels=[...svg.querySelectorAll('.sub,.tiny,.leader')];this.detailLabels.forEach(e=>e.setAttribute('data-detail-label',''));
  this.selected=null;
 }
 makeOxygen(){
  // The two original oxygen atoms become the two waters. No replacement O2/H2O sprites.
  this.oxygen=add(this.particles,'<g class="oxygen-bond"><path class="molecule-bond" d="M-10 -3H10M-10 3H10"/></g>');
  this.oxygenBond=this.oxygen.firstElementChild;
  this.oxygenAtoms=[0,1].map(i=>{const el=add(this.oxygen,bead('oxygen',0,0,14)+'<g class="water-h"><path class="molecule-bond" d="M0 0L-16 12.4M0 0L16 12.4"/>'+bead('hydrogen',-16,12.4,8)+bead('hydrogen',16,12.4,8)+'</g>');return{el,h:el.querySelector('.water-h')}});
  this.oxygenName=add(this.oxygen,'<text class="species-name" text-anchor="middle" y="43">O₂</text>').firstElementChild;
  this.chemical=Array.from({length:4},()=>{const el=add(this.particles,protonGlyph());el.classList.add('chemical-proton');return el});
  this.oxygenLedger=add(this.particles,'<text x="1169" y="528" class="reaction-ledger" text-anchor="middle"></text><text x="1169" y="555" class="reaction-ledger" text-anchor="middle"></text><text x="1047" y="678" class="tiny" text-anchor="middle">造水用 H⁺ · 基质侧</text>');
  this.oxygenLedgerTexts=[...this.oxygenLedger.querySelectorAll('text')];
  this.oxygenLedger.classList.add('oxygen-ledger');
 }
 makeSynthase(){
  const parent=this.objects['ATP-synthase'];parent.querySelector('image').remove();this.rotor=[];this.pockets=[];
  const part=add(parent,'<defs><clipPath id="f1-part"><rect x="1300" y="416" width="300" height="175"/></clipPath><clipPath id="stator-part"><path d="M1503 270H1580V580H1511V445L1515 387L1510 350Z"/></clipPath><linearGradient id="rotor-copper"><stop stop-color="#bd8159"/><stop offset=".35" stop-color="#efb587"/><stop offset=".62" stop-color="#d9996e"/><stop offset="1" stop-color="#a56646"/></linearGradient><linearGradient id="shaft-copper" x2="1" y2="0"><stop stop-color="#b47551"/><stop offset=".4" stop-color="#f5c695"/><stop offset="1" stop-color="#bd815b"/></linearGradient></defs>'+
   '<g clip-path="url(#stator-part)">'+proteinImage('atp-synthase',1337,250.8,.22,1024,1536)+'</g>'+
   '<g id="f1-head" clip-path="url(#f1-part)">'+proteinImage('atp-synthase',1337,250.8,.22,1024,1536)+'</g>'+
   '<g id="fo-rotor"><path d="M1402 287Q1454 270 1507 286V351Q1454 370 1402 351Z" fill="url(#rotor-copper)" stroke="#b47b55"/><ellipse cx="1455" cy="285" rx="53" ry="10" fill="#e8ae7e"/></g>'+
   '<path id="central-shaft" fill="none" stroke="url(#shaft-copper)" stroke-width="13" stroke-linecap="round"/><g id="catalytic-sites"></g>');
  parent.insertBefore(part,parent.firstElementChild);this.shaft=parent.querySelector('#central-shaft');this.rotorParent=parent.querySelector('#fo-rotor');
  for(let i=0;i<12;i++){const rib=add(this.rotorParent,'<path d="M0 0Q-4 10 0 18T0 36T0 54T0 69" fill="none" stroke="url(#rotor-copper)" stroke-width="11" stroke-linecap="round"/>'+Array.from({length:7},(_,k)=>'<ellipse cx="'+(k%2?-1.8:1.8)+'" cy="'+(k*10+4)+'" rx="5.7" ry="5" fill="url(#rotor-copper)"/>').join(''));this.rotor.push(rib);}
  const xy=[[1394,486],[1460,438],[1498,526]],sites=parent.querySelector('#catalytic-sites');
  for(let i=0;i<3;i++){const el=add(sites,'<path class="site-pocket" d="'+activeTransport2dPocketRecessPath({x:0,y:0,halfWidth:27,halfHeight:18})+'"/><text text-anchor="middle" y="5" class="site-state"></text>');move(el,xy[i]);this.pockets.push({el,pocket:el.querySelector('path'),label:el.querySelector('text')});}
  this.foMarker=add(parent,'<path id="shaft-marker" d="M1455 380h8" stroke="#8d5238" stroke-width="2.5" stroke-linecap="round"/>').firstElementChild;
  // The same compact ADP/Pi enters a visible F1 pocket, reacts there, and leaves as ATP.
  this.catalysis=add(parent,'<defs><radialGradient id="binding-soft-wash"><stop offset="0" stop-color="#fffdf6" stop-opacity=".80"/><stop offset=".62" stop-color="#fffdf6" stop-opacity=".70"/><stop offset=".85" stop-color="#fffdf6" stop-opacity=".36"/><stop offset="1" stop-color="#fffdf6" stop-opacity="0"/></radialGradient></defs><ellipse class="binding-pocket-window" cx="1450" cy="499" rx="82" ry="49"/><text x="1450" y="588" class="tiny" text-anchor="middle">F₁ 催化位点</text><g class="nucleotide-detail">'+nucleotideGlyph()+'</g><text class="nucleotide-state species-name" x="1450" y="698" text-anchor="middle"></text>');
  this.nuc=this.catalysis.querySelector('.nucleotide-detail');this.terminal=this.nuc.querySelector('.terminal-phosphate');this.terminalBond=this.nuc.querySelector('.terminal-bond');this.terminalText=this.terminal.querySelector('text');this.nucState=this.catalysis.querySelector('.nucleotide-state');this.gammaIndex=this.nuc.querySelector('.gamma-index');this.bindingWindow=this.catalysis.querySelector('.binding-pocket-window');
  this.pockets[0].label.classList.add('tracked-site-label');
 }
 draw(s,{labels=true,paths=true}={}){
  this.state=s;attr(this.svg,'data-labels',labels);attr(this.svg,'data-paths',paths);
  attr(this.wash,'opacity',(s.gradient*.15).toFixed(3));attr(this.charges,'opacity',(s.gradient*.5).toFixed(3));
  const isI=s.entry==='nadh',qp=s.qCarrier,q=this.q;move(q.el,qp.q);
  text(q.label,qp.load===2&&qp.qH===2?'QH₂':'Q');q.hs.forEach((n,k)=>show(n,qp.qH>k));q.es.forEach((n,k)=>show(n,qp.delivered>k&&qp.emitted<=k));
  text(this.qStatus,(s.t>0&&!s.complete?'第 '+(qp.id+1)+' 批 · ':'')+qp.status);
  const qStep={loading:0,loaded:0,delivery:1,handoff:2,return:3,ready:0}[qp.mode];this.qSteps.forEach((el,i)=>attr(el,'data-active',i===qStep));
  for(let i=0;i<2;i++){
   const p=s.pairs[i];
   const d=this.donors[i];move(d.el,p.donor.xy,isI?.88:.83);
   show(d.nadh,isI);show(d.succinate,!isI);show(d.charge,!p.oxidized);show(d.bond,p.oxidized);
   text(d.label,isI?(p.oxidized?'NAD⁺':'NADH'):(p.oxidized?'延胡索酸':'琥珀酸'));
   p.entryElectrons.forEach((e,k)=>{const n=this.electrons[i*2+k];move(n,e.xy);show(n,e.visible)});
  }
  text(this.fad,!isI&&s.t>0&&s.pairs.some(p=>p.active&&p.delivered<2)?'FADH₂':'FAD');
  this.passageElectrons.forEach((n,i)=>{move(n,s.passageElectrons[i].xy);show(n,s.passageElectrons[i].visible)});
  this.terminalElectrons.forEach((n,i)=>{move(n,s.terminalElectrons[i].xy);show(n,s.terminalElectrons[i].visible)});
  this.protons.forEach((n,i)=>{const p=s.transfers[i];if(p){move(n,p.xy);attr(n,'data-proton-mode',p.mode);show(n,p.visible)}else show(n,false)});
  this.cyts.forEach((n,i)=>{move(n.el,s.cyts[i].xy);show(n.e,s.cyts[i].loaded);});
  const r=s.oxygenReaction,spread=lerp(14,45,smooth(r));
  move(this.oxygen,s.oxygenXY);show(this.oxygen,true);
  this.oxygenAtoms.forEach((n,i)=>{move(n.el,[(i?-1:1)*spread,0]);attr(n.h,'opacity',r)});
  attr(this.oxygenBond,'opacity',1-r);text(this.oxygenName,s.waterFormed?'2 H₂O':r>0?'O₂ → 2H₂O':'O₂');
  this.chemical.forEach((n,i)=>{move(n,s.chemicalH[i].xy);show(n,s.chemicalH[i].visible)});
  text(this.oxygenLedgerTexts[0],'IV 已接收 '+s.electronArrivals+' / 4 e⁻');text(this.oxygenLedgerTexts[1],'造水消耗 '+s.chemicalConsumed+' / 4 H⁺');
  show(this.oxygenLedger,true);
  for(const def of DRAWN_ROUTES){const node=this.routeNodes[def.id],enabled=!def.entry||def.entry===s.entry,active=enabled&&!!s.flowActivity[def.id];attr(node,'data-enabled',enabled);attr(node,'data-active',active);attr(node,'opacity',active?1:FLOW_STYLE[def.kind].idle);}
  for(const site of ['I','III','IV'])text(this.totals[site],'累计 '+s.hOut[site]+' H⁺');
  const theta=s.synthesis.angle*Math.PI/180;
  this.rotor.forEach((n,i)=>{const a=theta+i*Math.PI/6,z=Math.cos(a);show(n,z>=0);attr(n,'transform','translate('+(1455+49*Math.sin(a)).toFixed(2)+' '+(285+(1-z)*6).toFixed(2)+') scale('+(0.5+Math.max(0,z)*.5).toFixed(3)+' 1)');});
  attr(this.shaft,'d','M1454 354C'+(1454+6*Math.cos(theta)).toFixed(2)+' 373 '+(1454-6*Math.cos(theta)).toFixed(2)+' 381 1454 392S'+(1454+5*Math.cos(theta)).toFixed(2)+' 424 1454 434');
  attr(this.foMarker,'d','M1454 387l'+(8*Math.sin(theta)).toFixed(2)+' -5');
  this.pockets.forEach((n,i)=>{const st=s.synthesis.catalytic[i],close=Math.sin(progress(st.phase,.30,.75)*Math.PI);attr(n.pocket,'transform','scale('+(1-close*.13).toFixed(3)+' '+(1+close*.12).toFixed(3)+')');text(n.label,'');attr(n.pocket,'data-catalytic-state',st.active?st.site:'waiting');});
  const syn=s.synthesis,join=syn.join,release=syn.release;
  move(this.nuc,syn.xy,.94);attr(this.nuc,'data-bound',syn.bound);attr(this.nuc,'data-formed',syn.formed);
  attr(this.terminal,'transform','translate('+(60+(1-join)*18).toFixed(2)+' '+(5-(1-join)*22).toFixed(2)+')');
  attr(this.terminalBond,'opacity',syn.formed?1:0);text(this.terminalText,syn.formed?'P':'Pi');show(this.gammaIndex,syn.formed);
  attr(this.bindingWindow,'opacity',syn.bind*(1-release)*.94);attr(this.nuc,'opacity',syn.started?1:.68);
  text(this.nucState,syn.label);
  const tailT=Math.round(s.t*25)/25;if(tailT!==this.lastTailT){this.lastTailT=tailT;this.lipids.draw(tailT);}
  const modes={transfer:s.energyMode==='transfer',gradient:s.hasGradient,synthase:s.stageId==='coupling'};
  this.energyAreas.forEach(el=>el.classList.toggle('active',modes[el.dataset.energy]));
  this.energyBlocks.forEach(el=>attr(el,'data-active',modes[el.dataset.energyBlock]));
  this.energyLinks.forEach(el=>attr(el,'opacity',modes[el.dataset.energyLink]?1:.3));
  const energyLabels=[s.t===0?'准备就绪 · 播放即传递':s.energyMode==='transfer'?'随电子传递释放自由能':'电子已交给 O₂',s.hasGradient?'浓度差 + 膜电位储能':'H⁺ 梯度尚未建立',syn.complete?'ATP 已从位点释放':syn.release>0?'ATP 正从位点释放':syn.active?'H⁺ 连续回流，驱动合成':'ADP + Pi → ATP（需能）'];
  this.energyTexts.forEach((el,i)=>text(el,energyLabels[i]));attr(this.energyBar,'width',(s.gradient*235).toFixed(2));
  text(this.gradientLabel,'梯度：'+s.gradientLabel);
  text(this.routeNote,'每 2e⁻：'+(isI?'I / III / IV = 4 / 4 / 2 H⁺':'II / III / IV = 0 / 4 / 2 H⁺'));
  text(this.shapeNote,'仅追踪部分回流 H⁺ · 不按粒子推算 ATP 产率');
 }
 select(id){this.selected=id;for(const[name,el]of Object.entries(this.objects))el.querySelector('image')?.classList.toggle('selected-art',name===id)}
 getDiagnostics(){return{nodes:this.svg.querySelectorAll('*').length,lipids:this.lipids.getDiagnostics(),selected:this.selected,particlePool:20,scientificTime:this.state?.t,viewBox:this.svg.getAttribute('viewBox'),rotorAngle:this.state?.synthesis.angle,moleculeStyle:'pearl-vector-v5-ordered-lanes-compact-atp',qRepresentatives:1,atpTopology:'adenine6+5-ribose5-threePhosphates',oxygenAtomNodes:this.oxygenAtoms.length}}
}
