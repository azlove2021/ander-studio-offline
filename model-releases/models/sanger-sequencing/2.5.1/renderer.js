import {G,BASES,DYES,SIGNALS,SEQUENCE,TEMPLATE,PRIMER,COMPLEMENT,FRAGMENTS,sourceOf,ntX,rowY,bandY,frameAt,clamp,mix,ease} from './engine.js';
const NS='http://www.w3.org/2000/svg';
export function el(tag,attrs={},parent,value){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(value!==undefined)n.textContent=value;if(parent)parent.appendChild(n);return n;}
const cache=new WeakMap();
export function attr(n,k,v){const str=String(v);let c=cache.get(n);if(!c){c=new Map();cache.set(n,c);}if(c.get(k)!==str){n.setAttribute(k,str);c.set(k,str);}}
export function text(n,value){if(n.textContent!==String(value))n.textContent=value;}
const show=(n,on)=>attr(n,'display',on?'inline':'none');
// PCR residue geometry is retained; lighter role colors keep bases in focus.
const colors={template:'#c77586',chain:'#76aa91',primer:'#c9a16b'};
const fills={template:'#f8e8dc',chain:'#fff0d7',primer:'#fff0d7',dd:'#ddc8f1'};
const DD_SUGAR_EDGE='#9370af';
const baseColors={A:'#ef6f84',T:'#35b98a',C:'#3186c7',G:'#f1bd45'};
const FREE_SCALE=1.85;
const LOCAL_DYE_Y=G.dyeOffset/G.productScale;
const sugarPoints=[[0,-9],[8.5595,-2.7812],[5.2901,7.2812],[-5.2901,7.2812],[-8.5595,-2.7812]];
// Vertex order: O4′, C1′, C2′, C3′, C4′. C5′ is outside the ring.
const boundSugarPoints=[[-4,-3],[1,-5],[5,-1],[3,4],[-3,4]];
const primerPositions=()=>[G.left+18,G.left+43,G.x0-43,G.x0-18];
const primerIndices=[0,1,16,17];
function label(p,x,y,value,size=18,fill='#224e5b',anchor='start',optional=false){return el('text',{x,y,'font-size':size,fill,'text-anchor':anchor,class:optional?'optional-label':''},p,value);}
const path=(p,d,stroke,width=1,extra={})=>el('path',{d,stroke,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round',fill:'none',...extra},p);
const line=(p,x1,y1,x2,y2,color,width=1,extra={})=>path(p,`M${x1} ${y1}L${x2} ${y2}`,color,width,extra);
function dye(p,base,x=14,y=LOCAL_DYE_Y){const g=el('g',{'data-dye':base},p);line(g,5,-11.25,x,y,DYES[base],1.1);el('circle',{cx:x,cy:y,r:11,fill:`url(#fluor-halo-${base})`},g);el('circle',{cx:x,cy:y,r:5.8,fill:DYES[base],opacity:.4},g);el('circle',{cx:x,cy:y,r:4,fill:`url(#fluor-core-${base})`,stroke:DYES[base],'stroke-width':.8},g);el('circle',{cx:x-1,cy:y-1.2,r:1.25,fill:'#fff',opacity:.95},g);return g;}
function colorMix(a,b,p){return '#'+[1,3,5].map(i=>Math.round(mix(parseInt(a.slice(i,i+2),16),parseInt(b.slice(i,i+2),16),p)).toString(16).padStart(2,'0')).join('');}
function monomer(parent,base,dd,attrs={}){
  const g=el('g',{'data-reagent':`${dd?'dd':'d'}${base}TP`,...attrs},parent);
  const body=el('g',{'data-molecular-body':dd?'dd':'d',...(dd?{filter:`url(#dd-molecule-glow-${base})`}:{})},g);
  const phosphateBond=path(body,'','#78a5a3',1.1,{'data-phosphate-connection':''}),stem=path(body,'','#9eaeaf',1,{'data-base-connection':''});
  const phosphates=['gamma','beta','alpha'].map(kind=>({circle:el('circle',{r:3.2,fill:'url(#phosphate)',stroke:'#6d9fa4','stroke-width':.5,'data-phosphate':kind},body),letter:label(body,0,0,'P',3.7,'#255a6a','middle')}));
  const sugar=el('path',{'data-sugar':'pentagon',fill:'url(#sugar)',stroke:dd?DD_SUGAR_EDGE:colors.chain,'stroke-width':.9},body);
  const carbonFive=el('g',{'data-carbon-five':'C5'},body),carbonDot=el('circle',{r:.75,fill:dd?DD_SUGAR_EDGE:colors.chain},carbonFive),carbonLabel=el('g',{'data-carbon-five-label':''},carbonFive);
  el('rect',{x:-7,y:-5,width:14,height:10,rx:2,fill:dd?fills.dd:'#fff6e1'},carbonLabel);const carbonText=label(carbonLabel,0,0,'C5′',6.4,'#446c70','middle');attr(carbonText,'dominant-baseline','central');attr(carbonText,'font-weight',600);
  const oxygen=el('g',{'data-ring-oxygen':'O4'},body),oxygenMask=el('circle',{r:4.8,fill:dd?'#eee3f8':'#fff6e1'},oxygen),oxygenLetter=label(oxygen,0,0,'O',8.5,'#ae4e59','middle');attr(oxygenLetter,'dominant-baseline','central');attr(oxygenLetter,'font-weight',650);
  const baseGroup=el('g',{'data-base-block':base},body);
  const box=el('rect',{x:-6.5,y:-6.5,width:13,height:13,rx:2,fill:baseColors[base]},baseGroup);
  const letter=label(baseGroup,0,3,base,9,base==='G'?'#63531f':'white','middle');attr(letter,'font-weight',650);
  const groups=el('g',{'data-substituents':''},body);
  path(groups,'M-5.2901 7.2812L-12 16','#7b9285',.9,{'data-carbon-branch':'3'});
  path(groups,'M5.2901 7.2812L12 16','#7b9285',.9,{'data-carbon-branch':'2'});
  const three=label(groups,-12,24,dd?'3′—H':'3′—OH',7.2,dd?'#a23b5a':'#1c7457','end');attr(three,'data-carbon-group','3');
  const two=label(groups,12,24,'2′—H',7.2,'#526f67');attr(two,'data-carbon-group','2');
  const fluorescent=dd?dye(body,base):null;
  const n={g,body,base,dd,phosphateBond,stem,phosphates,sugar,carbonFive,carbonDot,carbonLabel,oxygen,oxygenMask,oxygenLetter,baseGroup,box,letter,groups,fluorescent};poseMonomer(n,0);return n;
}
function poseMonomer(n,p){
  if(n.pose===p)return;n.pose=p;
  // One molecule changes schematic pose on approach; its sugar origin remains
  // the same landing anchor. O4′ remains between C4′ and C1′ in both poses.
  const points=sugarPoints.map((v,i)=>v.map((a,k)=>mix(a,boundSugarPoints[i][k],p)));
  attr(n.sugar,'d','M'+points.map(v=>v.join(' ')).join('L')+'Z');
  attr(n.sugar,'fill',n.dd?fills.dd:colorMix('#f9e5b9',fills.chain,p));
  attr(n.oxygen,'transform',`translate(${points[0][0]} ${points[0][1]})`);attr(n.oxygenMask,'r',mix(4.8,2.4,p));attr(n.oxygenLetter,'font-size',mix(8.5,4.2,p));
  const phosphatePoints=[[-35,-29],[-32,-20],[-29,-11]].map((v,i)=>[mix(v[0],[-27,-17,-7][i],p),mix(v[1],0,p)]);
  const c5=[mix(-18,-5.5,p),mix(-6,2,p)];
  attr(n.phosphateBond,'d',`M${phosphatePoints.map(v=>v.join(' ')).join('L')}L${c5.join(' ')}L${points[4].join(' ')}`);
  attr(n.carbonFive,'transform',`translate(${c5.join(' ')})`);attr(n.carbonLabel,'opacity',1-p);attr(n.carbonDot,'opacity',p);
  n.phosphates.forEach((v,i)=>{const [px,py]=phosphatePoints[i];attr(v.circle,'cx',px);attr(v.circle,'cy',py);attr(v.circle,'r',mix(3.2,i===2?2.4:3.1,p));attr(v.letter,'x',px);attr(v.letter,'y',py+1.3);attr(v.letter,'opacity',1-p);if(i===2){attr(v.circle,'fill',p>.98?colors.chain:'url(#phosphate)');attr(v.circle,'stroke',p>.98?'#fff':'#6d9fa4');}});
  const bx=mix(22,0,p),by=mix(-2.7812,-11.25,p);
  attr(n.baseGroup,'transform',`translate(${bx} ${by})`);
  const w=mix(13,11.6,p),h=mix(13,10.5,p);attr(n.box,'x',-w/2);attr(n.box,'y',-h/2);attr(n.box,'width',w);attr(n.box,'height',h);attr(n.letter,'font-size',mix(9,8.5,p));attr(n.letter,'y',3);
  attr(n.stem,'d',`M${points[1].join(' ')}L${mix(15.5,0,p)} ${mix(-2.7812,-7,p)}`);
  attr(n.groups,'opacity',1-p);
  if(n.fluorescent){const dx=mix(34,14,p),dy=mix(-17.6,LOCAL_DYE_Y,p);attr(n.fluorescent,'transform',`translate(${dx-14} ${dy-LOCAL_DYE_Y})`);attr(n.fluorescent.firstElementChild,'d',`M${mix(27,5,p)-(dx-14)} ${mix(-5,-11.25,p)-(dy-LOCAL_DYE_Y)}L14 ${LOCAL_DYE_Y}`);}
  attr(n.g,'data-pose',p.toFixed(5));
}
function primerGlyphs(parent,role,scale=1){
  return primerIndices.map((i,j)=>{const b=PRIMER[i];return el('use',{href:`#residue-${role}-${role==='template'?COMPLEMENT[b]:b}`,transform:`translate(${primerPositions()[j]} 0) scale(${scale})`,'data-primer-position':i+1},parent);});
}
function compressionMark(parent){const mid=(G.left+G.x0)/2;return path(parent,`M${mid-10} -10L${mid} 10M${mid+1} -10L${mid+11} 10`,'#fcfffc',3,{'data-primer-compression':'18-nt'});
}
function definitions(defs){
  const gradient=(id,stops,radial=false)=>{const g=el(radial?'radialGradient':'linearGradient',{id,...(radial?{cx:'35%',cy:'30%',r:'70%'}:{x1:'0%',x2:'100%',y1:'0%',y2:'0%'})},defs);for(const [offset,color,opacity=1]of stops)el('stop',{offset,'stop-color':color,'stop-opacity':opacity},g);return g;};
  for(const base of BASES){gradient(`fluor-halo-${base}`,[['0%',SIGNALS[base],.8],['45%',DYES[base],.48],['75%',DYES[base],.14],['100%',DYES[base],0]],true);gradient(`fluor-core-${base}`,[['0%','#fff'],['35%',SIGNALS[base]],['100%',DYES[base]]],true);const glow=el('filter',{id:`dd-molecule-glow-${base}`,x:'-35%',y:'-35%',width:'170%',height:'170%','color-interpolation-filters':'sRGB'},defs);el('feDropShadow',{dx:0,dy:0,stdDeviation:1.7,'flood-color':DYES[base],'flood-opacity':.72},glow);el('feDropShadow',{dx:0,dy:0,stdDeviation:.55,'flood-color':SIGNALS[base],'flood-opacity':.85},glow);}
  gradient('phosphate',[['0%','#f7feff'],['28%','#8ed6e5'],['100%','#408ca2']],true);
  gradient('sugar',[['0%','#fff9e8'],['65%','#f9e5b9'],['100%','#dcc68f']]);
  gradient('tube-glass',[['0%','#789f9f',.58],['8%','#d7f0ef',.65],['19%','#ffffff',.96],['35%','#e4f4ef',.3],['75%','#d9ede8',.25],['94%','#91b9b4',.58],['100%','#658d90',.7]]);
  gradient('tube-liquid',[['0%','#8ec9b9',.6],['28%','#d9eee4',.8],['72%','#b6dcd0',.68],['100%','#6fa997',.65]]);
  gradient('glass-lip',[['0%','#94b8b5'],['20%','#f8ffff'],['52%','#d4eae3'],['82%','#fdffff'],['100%','#86aca6']]);
  gradient('gel-slab',[['0%','#91b5bb'],['5%','#f0ffff'],['12%','#a3c3cb'],['40%','#99bbc5'],['80%','#86afbc'],['97%','#a3c3ca'],['100%','#e2f2f3']]);
  const gelBody=gradient('gel-body',[['0%','#93b8c5'],['35%','#7da5b5'],['74%','#739dac'],['100%','#a2c3cc']]);attr(gelBody,'x2','14%');attr(gelBody,'y2','100%');
  const texture=el('pattern',{id:'gel-texture',width:13,height:17,patternUnits:'userSpaceOnUse'},defs);for(const[cx,cy,r]of [[2,3,.45],[9,11,.4],[6,15,.25]])el('circle',{cx,cy,r,fill:'#a8d5d9',opacity:.18},texture);
  // Copied from the accepted PCR renderer: phosphate, sugar polygon, base/stem.
  // The template mirrors the structural frame (not the printed base letter).
  for(const role of['template','chain','primer','dd'])for(const base of BASES){const dir=role==='template'?1:-1,g=el('g',{id:`residue-${role}-${base}`,'data-copied-from':'pcr-primer-engineering@2.1.0'},defs),c=colors[role]||colors.chain,structure=el('g',{transform:dir===1?'rotate(180)':'rotate(0)'},g);path(structure,'M-7 0L-5.5 2L-3 4','#78a5a3',1.1);el('circle',{cx:-7,cy:0,r:2.4,fill:c,stroke:'#fff','stroke-width':.5},structure);el('path',{d:'M-4 -3 1 -5 5 -1 3 4 -3 4Z',fill:fills[role],stroke:role==='dd'?DD_SUGAR_EDGE:c,'stroke-width':.9,'data-sugar':'pentagon'},structure);el('circle',{cx:-5.5,cy:2,r:.75,fill:role==='dd'?DD_SUGAR_EDGE:c,'data-carbon-five':'C5'},structure);path(structure,'M1 -5L0 -7','#9eaeaf',1);const ox=el('g',{transform:`translate(${dir===1?4:-4} ${dir===1?3:-3})`,'data-ring-oxygen':'O4'},g);el('circle',{r:2.4,fill:role==='dd'?'#eee3f8':'#fff6e1'},ox);const o=label(ox,0,0,'O',4.2,'#ae4e59','middle');attr(o,'dominant-baseline','central');attr(o,'font-weight',650);el('rect',{x:-5.8,y:dir===1?6:-16.5,width:11.6,height:10.5,rx:2,fill:baseColors[base]},g);const t=label(g,0,(dir===1?11.25:-11.25)+3,base,8.5,base==='G'?'#63531f':'white','middle');attr(t,'font-weight',650);}
  for(const base of BASES)for(const dd of[false,true])monomer(defs,base,dd,{id:`incoming-${dd?'dd':'d'}-${base}`});
}
function tube(svg){const group=el('g',{'data-tube':'glass',transform:'translate(0 105)'},svg),g=el('g',{'data-tube-body':'glass',transform:'translate(-42 0)'},group);label(group,5,190,'单管测序体系',16);
  el('ellipse',{cx:205,cy:603,rx:48,ry:8,fill:'#bed4cd',opacity:.23},g);
  el('path',{d:'M153 196H256V548Q256 593 205 602Q153 593 153 548Z',fill:'url(#tube-glass)',stroke:'#739999','stroke-width':1.5},g);
  el('path',{d:'M161 254H248V546Q248 585 205 593Q161 585 161 546Z',fill:'url(#tube-liquid)'},g);el('ellipse',{cx:204.5,cy:254,rx:43.5,ry:6.5,fill:'#aad6c9',stroke:'#e4f9ef','stroke-width':1},g);
  el('path',{d:'M161 208V544Q161 582 202 592',fill:'none',stroke:'#fff','stroke-width':4,opacity:.84,'stroke-linecap':'round'},g);el('path',{d:'M247 214V547Q247 580 218 590',fill:'none',stroke:'#6f9e98','stroke-width':2,opacity:.46},g);line(g,170,221,170,472,'#fff',2,{opacity:.42});
  el('rect',{x:148,y:188,width:113,height:17,rx:5,fill:'url(#glass-lip)',stroke:'#759d99','stroke-width':1.5},g);el('ellipse',{cx:204.5,cy:189,rx:54,ry:4.5,fill:'#e6f5ee',stroke:'#bad4cb','stroke-width':1},g);
  for(const y of[295,307])line(g,173,y,237,y,colors.template,3.5);for(let i=0;i<8;i++)line(g,177+i*8,297,177+i*8,305,'#83a79a',1);line(g,175,350,199,350,colors.primer,5);line(g,215,359,236,359,colors.primer,5);
  for(let i=0;i<4;i++){const x=181+(i%2)*43,y=398+Math.floor(i/2)*24;el('use',{href:`#incoming-d-${BASES[i]}`,transform:`translate(${x} ${y}) scale(.4)`},g);el('use',{href:`#incoming-dd-${BASES[i]}`,transform:`translate(${x} ${y+68}) scale(.4)`},g);}
  el('image',{href:'assets/polymerase.webp',x:177,y:525,width:60,height:55},g);
  const entries=[{y:294,a:'同序列模板',b:'多份拷贝'},{y:349,a:'测序引物',b:'同一种'},{y:403,a:'四种 dNTP'},{y:470,a:'四种荧光',b:'ddNTP'},{y:548,a:'DNA 聚合酶'}];for(const e of entries){label(group,5,e.y,e.a,14,'#527781');if(e.b)label(group,5,e.y+20,e.b,13,'#78918e');line(group,103,e.y-5,109,e.y-5,'#c1d7cd',1);}
  label(group,10,604,'含缓冲体系',15,'#79938e',undefined,true);label(group,10,626,'模板已制备、纯化',14,'#79938e',undefined,true);
}
function makeStrand(parent,f){const group=el('g',{'data-fragment':f.id,'data-pick-fragment':f.k,'data-k':f.k,'data-length':f.length},parent),shape=el('g',{id:`shape-${f.id}`},group);const primer=line(shape,G.left,0,G.x0,0,colors.primer,9),backbone=line(shape,G.x0,0,G.x0,0,colors.chain,9);const primerNodes=primerGlyphs(shape,'primer');compressionMark(shape);const nodes=[];
  for(let j=0;j<f.k;j++){const terminal=j===f.k-1,nt=el('g',{transform:`translate(${ntX(j)} 0)`,'data-nt-id':`${f.id}-nt-${j+1}`,...(terminal?{filter:`url(#dd-molecule-glow-${f.base})`,'data-terminal-material':'dd'}:{})},shape),use=el('use',{href:`#residue-${terminal?'dd':'chain'}-${SEQUENCE[j]}`},nt);let fluorescent=null;if(terminal)fluorescent=dye(nt,f.base);nodes.push({nt,use,fluorescent});}
  const left=label(group,G.left-23,6,'5′',18,'#325b61','end'),right=label(group,G.x0+17,6,'3′',18),length=label(parent,1284,bandY(f.k)+5,`${f.length} nt`,18,'#6c878b','end');attr(length,'data-length-label',f.k);const number=label(parent,269,bandY(f.k)+5,`＋${f.k}`,16,'#729093');const hit=el('rect',{x:264,y:rowY(f.k)-31,width:1040,height:34,fill:'transparent','data-pick-fragment':f.k,class:'fragment-hit'},parent);return{group,shape,primer,backbone,primerNodes,nodes,left,right,length,number,hit,f};
}
export function createRenderer(svg){svg.setAttribute('viewBox',`0 0 ${G.width} ${G.height}`);const defs=el('defs',{},svg);definitions(defs);tube(svg);
  el('rect',{x:279,y:192,width:1031,height:555,rx:17,fill:'#f3f9f5',stroke:'#d5e5df'},svg);
  line(svg,G.x0,192,G.x0,747,'#63928f',1.5,{'stroke-dasharray':'5 6','data-extension-start':'primer-3-prime','pointer-events':'none',opacity:.8});
  label(svg,590,18,'四种 dNTP',18,'#224e5b','middle');label(svg,1255,18,'四种荧光 ddNTP',18,'#224e5b','middle');
  line(svg,924,32,924,164,'#90b2ad',1.4,{'stroke-dasharray':'5 7','data-reagent-divider':'d-versus-dd'});
  const pools=[];for(const dd of[false,true])for(const base of BASES){const pos=sourceOf(base,dd),g=el('g',{'data-source':`${dd?'dd':'d'}${base}`,transform:`translate(${pos.x} ${pos.y})`},svg),bg=el('rect',{x:-62,y:-68,width:152,height:136,rx:11,fill:'#e0eee6',opacity:0},g);el('use',{href:`#incoming-${dd?'dd':'d'}-${base}`,transform:`scale(${FREE_SCALE})`},g);label(g,0,63,`${dd?'dd':'d'}${base}TP`,14,'#365c69','middle');pools.push({g,bg,base,dd});}
  const templateGroup=el('g',{'data-template':'common-template-view'},svg);label(templateGroup,G.left-25,184,'模板',14,'#597c80','end',true);label(templateGroup,G.left,184,'引物18 nt（压缩显示）',14,'#597c80',undefined,true);label(templateGroup,G.x0+12,184,'延伸起点',14,'#527f7d',undefined,true);line(templateGroup,G.left,G.templateY,G.x0+12*G.step,G.templateY,colors.template,9*G.liveScale);label(templateGroup,G.left-25,G.templateY+5,'3′',22,'#315660','end');label(templateGroup,G.x0+12*G.step+18,G.templateY+5,'5′',22);for(let j=0;j<12;j++)el('use',{href:`#residue-template-${TEMPLATE[j]}`,transform:`translate(${ntX(j)} ${G.templateY}) scale(${G.liveScale})`},templateGroup);
  const knownTemplate=el('g',{transform:`translate(0 ${G.templateY})`},templateGroup);primerGlyphs(knownTemplate,'template',G.liveScale);compressionMark(knownTemplate);
  const bonds=Array.from({length:12},(_,j)=>line(templateGroup,ntX(j),G.templateY+16.5*G.liveScale,ntX(j),G.liveY-16.5*G.liveScale,'#81a996',1.5));const primerBonds=primerPositions().map(x=>line(templateGroup,x,G.templateY+16.5*G.liveScale,x,G.liveY-16.5*G.liveScale,'#aec8bb',1.3));
  const rowHeading=label(svg,301,300,'逐条合成 · 按长度整理',16),rowNote=label(svg,1284,184,'相邻差 1 nt · 含18 nt引物',16,'#6d878c','end');
  const selectedBackground=el('rect',{x:280,y:306,width:1034,height:34,rx:6,fill:'#dbeee3',opacity:0},svg);
  const strandLayer=el('g',{},svg),strands=FRAGMENTS.map(f=>makeStrand(strandLayer,f));
  const enzyme=el('image',{href:'assets/polymerase.webp',width:86,height:76,opacity:.52,'data-polymerase':'sequencing-polymerase'},svg);
  const reactionLabel=label(svg,1277,779,'引物已结合',16,'#317d69','end');
  label(svg,301,779,'不同模板拷贝的代表产物；真实反应随机终止。',17,'#6a848a',undefined,true);
  const gel=el('g',{'data-gel':'single-lane'},svg);label(gel,1323,184,'单泳道荧光检测',21);const selectedDetail=label(gel,1480,235,'等待荧光条带分离',16,'#618b7d','middle');attr(selectedDetail,'id','selected-detail');label(gel,G.gelX,280,'＋ 正极',20,'#237962','middle');
  el('rect',{x:1319,y:299,width:124,height:485,rx:12,fill:'#46767d',opacity:.14},gel);
  el('path',{d:'M1313 301Q1313 291 1324 291H1427L1439 299V770Q1439 780 1428 780H1325Q1313 780 1313 769Z',fill:'url(#gel-slab)',stroke:'#87aaa9','stroke-width':1.3,'data-gel-material':'hydrated-slab'},gel);
  el('rect',{x:1321,y:298,width:111,height:474,rx:5,fill:'url(#gel-body)'},gel);el('rect',{x:1321,y:298,width:111,height:474,rx:5,fill:'url(#gel-texture)'},gel);
  el('rect',{x:1336,y:300,width:78,height:470,rx:3,fill:'#b1e0e1',opacity:.16},gel);line(gel,1317,303,1317,764,'#f0ffff',1.6,{opacity:.76});line(gel,1429,305,1429,766,'#d4eded',1,{opacity:.5});line(gel,1325,295,1425,295,'#f6ffff',1.8,{opacity:.76});line(gel,1323,776,1425,776,'#e7f7f4',1.4,{opacity:.8});
  el('rect',{x:G.gelX-33,y:G.wellY-6,width:66,height:11,rx:2,fill:'#547a87',stroke:'#b1d3d8','stroke-width':1,'data-well-y':G.wellY},gel);line(gel,G.gelX-30,G.wellY+3,G.gelX+30,G.wellY+3,'#e1f3ee',1.6);label(gel,1304,G.wellY+6,'同孔上样',16,'#70868c','end');label(gel,G.gelX,800,'− 负极',20,'#335e69','middle');
  line(gel,1491,735,1491,310,'#5e9196',2);path(gel,'M1485 320L1491 310L1497 320','#5e9196',2);label(gel,1491,761,'向上',16,'#5e7e84','middle');label(gel,1511,315,'短',16,'#5e7e84');label(gel,1511,720,'长',16,'#5e7e84');label(gel,1460,290,'nt',16,'#728e92','middle');
  label(gel,G.sequenceX,265,'新生链序列',19,'#2c5f60','middle');label(gel,G.sequenceX,292,'5′',20,'#426e64','middle');label(gel,G.sequenceX,736,'3′',20,'#426e64','middle');line(gel,1613,310,1613,707,'#8fae9c',1.4);path(gel,'M1608 699L1613 707L1618 699','#8fae9c',1.4);label(gel,1635,498,'读',16,'#739082','middle');label(gel,1635,520,'序',16,'#739082','middle');
  const scienceNote=el('g',{id:'science-note'},gel);['荧光检测伪彩图','变性聚丙烯酰胺凝胶示意','现代仪器常用毛细管电泳'].forEach((s,i)=>label(scienceNote,1480,814+i*14,s,13,'#769194','middle'));
  const bands=FRAGMENTS.map(f=>{const g=el('g',{'data-band-id':f.id,'data-k':f.k,'data-base':f.base},gel),halo=el('rect',{x:G.gelX-39,y:-9,width:78,height:18,rx:6,fill:SIGNALS[f.base],opacity:.24},g),glow=el('rect',{x:G.gelX-35,y:-5,width:70,height:10,rx:3,fill:DYES[f.base],opacity:.65},g),bar=el('rect',{x:G.gelX-31,y:-2.6,width:62,height:5.2,rx:1.3,fill:SIGNALS[f.base]},g),outline=el('rect',{x:G.gelX-41,y:-13,width:82,height:26,rx:4,fill:'none',stroke:'#f0fffa','stroke-width':1.5,opacity:0},g),b=label(gel,1460,bandY(f.k)+5,String(f.length),18,'#789293','middle'),hit=el('rect',{x:1327,y:bandY(f.k)-14,width:109,height:28,fill:'transparent','data-pick-fragment':f.k,class:'fragment-hit'},gel);return{g,outline,b,hit,f};});
  const guide=line(svg,950,315,G.gelX-43,315,'#77aa95',1.5,{'stroke-dasharray':'5 6',opacity:0,'data-correspondence':'horizontal'});
  const loads=FRAGMENTS.map(f=>{const g=el('g',{'data-loading-fragment':f.id},svg);el('use',{href:`#shape-${f.id}`,transform:`translate(${-G.left} 0)`},g);return{g,f};});
  const incoming=el('g',{'data-incoming':'active'},svg),incomingVariants=[];for(const dd of[false,true])for(const base of BASES){const molecule=monomer(incoming,base,dd);incomingVariants.push({use:molecule.g,molecule,base,dd});}const incomingName=label(incoming,36,26,'dATP',18,'#286851');
  const ppi=el('g',{'data-byproduct':'pyrophosphate'},svg);line(ppi,-5*G.liveScale,0,5*G.liveScale,0,'#8badaa',2);for(const x of[-5,5])el('circle',{cx:x*G.liveScale,cy:0,r:3.1*G.liveScale,fill:'url(#phosphate)',stroke:'#fff'},ppi);label(ppi,0,-14,'PPi',15,'#6b9296','middle',true);
  let lastFrame=null;
  function draw(time,{labels=true,highlight=true,manual=null}={}){const frame=frameAt(time,manual),s=frame.state;lastFrame=frame;svg.classList.toggle('hide-labels',!labels);attr(svg,'data-phase',s.phase);attr(svg,'data-time',s.time.toFixed(4));attr(svg,'data-active-fragment',s.activeK??'');
    for(let i=0;i<strands.length;i++){const n=strands[i],f=frame.rows[i];attr(n.group,'transform',`translate(0 ${f.y.toFixed(3)})`);attr(n.group,'opacity',f.opacity*(highlight&&s.stage===1&&!f.active?.64:1));show(n.group,f.visible);attr(n.group,'data-formed',f.formed.toFixed(5));attr(n.group,'data-terminal-visible',f.terminalVisible);attr(n.group,'data-stored',f.stored);attr(n.primer,'stroke-width',9*f.scale);attr(n.backbone,'stroke-width',9*f.scale);attr(n.backbone,'d',`M${G.x0} 0H${f.frontX.toFixed(3)}`);attr(n.right,'x',f.frontX+17);
      for(let j=0;j<n.nodes.length;j++){const nt=n.nodes[j],fraction=clamp(f.formed-j);attr(nt.nt,'transform',`translate(${ntX(j)} 0) scale(${f.scale.toFixed(3)})`);show(nt.nt,fraction>0);attr(nt.nt,'opacity',Math.min(1,fraction*5));if(nt.fluorescent)show(nt.fluorescent,fraction>0);}
      n.primerNodes.forEach((node,j)=>attr(node,'transform',`translate(${primerPositions()[j]} 0) scale(${f.scale.toFixed(3)})`));
      show(n.length,f.stored);show(n.number,false);attr(n.hit,'pointer-events',f.stored?'all':'none');
    }
    for(const bond of primerBonds)show(bond,s.activeK!==null&&s.phase!=='collect');
    for(let j=0;j<bonds.length;j++)show(bonds[j],s.activeK!==null&&s.formed>j&&s.phase!=='collect');
    const active=frame.rows.find(f=>f.active);const acting=Boolean(active&&['new-copy','incorporate','terminated'].includes(s.phase));show(enzyme,acting);if(active){attr(enzyme,'x',active.frontX-58);attr(enzyme,'y',G.liveY-41);attr(enzyme,'data-contact-x',active.frontX);attr(enzyme,'data-contact-y',G.liveY);attr(enzyme,'opacity',s.phase==='terminated'?.5*(1-ease((s.p-.5)/.5)):.5);}
    for(const pool of pools)attr(pool.bg,'opacity',s.flight&&pool.base===s.flight.base&&pool.dd===s.flight.dd&&highlight?.8:0);
    show(incoming,Boolean(s.flight?.visible));for(const v of incomingVariants){const active=Boolean(s.flight&&v.base===s.flight.base&&v.dd===s.flight.dd);show(v.use,active);poseMonomer(v.molecule,active?ease((s.p-.12)/.5):0);attr(v.use,'transform',`scale(${active?mix(FREE_SCALE,G.liveScale,ease(s.p/.62)):FREE_SCALE})`);}if(s.flight){const n=s.flight;attr(incoming,'transform',`translate(${n.x.toFixed(3)} ${n.y.toFixed(3)})`);attr(incoming,'data-base',n.base);attr(incoming,'data-dd',n.dd);attr(incoming,'data-monomer-id',n.monomerId);text(incomingName,`${n.dd?'dd':'d'}${n.base}TP`);show(ppi,n.arrival&&n.ppi<1);attr(ppi,'transform',`translate(${n.target.x-22*G.liveScale-22*n.ppi} ${G.liveY-46*n.ppi})`);attr(ppi,'opacity',1-n.ppi);}else show(ppi,false);
    for(let i=0;i<bands.length;i++){const n=bands[i],f=frame.bands[i];show(n.g,f.visible);attr(n.g,'transform',`translate(0 ${f.y.toFixed(3)})`);attr(n.g,'data-y',f.y.toFixed(3));attr(n.g,'data-length',f.length);attr(n.outline,'opacity',highlight&&frame.selected===f.k?1:0);show(n.b,s.separation===1);attr(n.hit,'pointer-events',s.separation===1?'all':'none');}
    for(let i=0;i<loads.length;i++){const n=loads[i],f=frame.loads[i];show(n.g,f.visible);attr(n.g,'transform',`translate(${f.x.toFixed(3)} ${f.y.toFixed(3)}) scale(${f.scale.toFixed(5)})`);}
    const selected=frame.rows[frame.selected-1],aligned=s.separation===1&&selected.stored;attr(selectedBackground,'y',rowY(frame.selected)-31);attr(selectedBackground,'opacity',highlight&&selected.stored?.75:0);attr(guide,'opacity',highlight&&aligned?.8:0);attr(guide,'d',`M${ntX(frame.selected-1)+14*G.productScale+13} ${bandY(frame.selected)}H${G.gelX-43}`);
    text(rowHeading,s.records?'终止片段 · 合成记录':'逐条合成 · 按长度整理');text(reactionLabel,s.phase==='prepare'?'引物已结合':s.phase==='new-copy'?`模板拷贝 ${s.k} · 引物结合`:s.phase==='incorporate'?`${s.flight.dd?'荧光 dd':'d'}${s.flight.base}TP → 子链`:(s.phase==='terminated'||s.phase==='collect')?'3′端缺少 OH · 延伸终止':'12种长度 · 完成合成');
    return frame;
  }
  return{draw,getFrame:()=>lastFrame,nodes:{strands,bands,incoming,enzyme,guide}};
}
