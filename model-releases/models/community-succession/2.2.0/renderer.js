import{clamp,mix,smooth,seededRandom,vegetationObjects}from'./engine.js?v=2.1.1';
const initialAssets=['landscape-base','soil-base','fire-remnants-atlas','fauna-atlas'];
const laterAssets=['groundcover-atlas','woody-atlas','meadow-base'];
export async function loadAssets(onInitial=()=>{},retryKey=''){
 const images={},pending=new Map();
 const map=await fetch(new URL('assets/atlas-map.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('素材表配置未载入');return r.json()});
 function load(name,priority){
  if(images[name])return Promise.resolve(images[name]);
  if(pending.has(name))return pending.get(name);
  const img=new Image();img.decoding='async';img.fetchPriority=priority;
  const url=new URL('assets/'+name+'.webp',import.meta.url);
  // A requested retry bypasses an image failure retained by a browser preload.
  // Ordinary loads retain the original URL and preload/request deduplication.
  if(retryKey)url.searchParams.set('retry',retryKey);
  img.src=url;
  const task=img.decode().then(()=>{images[name]=img;return img}).finally(()=>pending.delete(name));
  pending.set(name,task);return task;
 }
 const assets={images,map,ensure:(names,priority='high')=>Promise.all(names.map(name=>load(name,priority)))};
 // Show the actual two starting habitats before downloading later vegetation.
 await assets.ensure(initialAssets);await onInitial(assets);
 // Controls become ready only when any stage can be shown completely.
 // The optional soil atlas is deliberately absent from this startup path.
 await assets.ensure(laterAssets,'low');return assets;
}
function round(ctx,x,y,w,h,r=16){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function pill(ctx,txt,x,y,color='#356755',size=11){ctx.font=`500 ${size}px "Microsoft YaHei",sans-serif`;const w=ctx.measureText(txt).width+16;ctx.fillStyle='#fffffff0';round(ctx,x,y,w,size+13,6);ctx.fill();ctx.fillStyle=color;ctx.textBaseline='middle';ctx.fillText(txt,x+8,y+(size+13)/2);return w}
export class SuccessionRenderer{
 constructor(background,foreground,scroll,world,assets){
  this.back=background;this.front=foreground;this.bg=background.getContext('2d');this.ctx=foreground.getContext('2d');
  this.scroll=scroll;this.world=world;this.assets=assets;this.objects={primary:vegetationObjects('primary'),secondary:vegetationObjects('secondary')};
  this.layouts=[];this.width=0;this.height=0;this.key='';this.frames=0;this.lastSceneMeta=[];
  this.headings=Object.fromEntries([...document.querySelectorAll('.scene-heading')].map(e=>[e.dataset.kind,e]));
 }
 resize(soil=false){
  // Only the viewport mapping changes. The original 1000 x 660 scene, atlas
  // anchors and independent scientific times remain the drawing inputs.
  const width=this.scroll.clientWidth,avail=Math.floor(this.scroll.getBoundingClientRect().height),single=this.world.dataset.ecoLayout==='single',selected=this.world.dataset.ecoSelected||'primary',narrow=this.world.dataset.ecoOrientation==='portrait',short=innerHeight<=550,ratio=Math.min(2,devicePixelRatio||1),key=[width,avail,soil,ratio,short,single,selected,narrow].join('/');
  if(key===this.key)return false;this.key=key;this.width=width;
  const margin=width<720?8:16,gap=narrow?8:18,count=single?1:2,stacked=narrow&&!single,w=(width-2*margin-(!stacked&&count===2?gap:0))/(!stacked?count:1),header=width<=1050?30:42,foot=width<=1050?43:46,section=soil?(short?38:width<720?48:60):0;
  const availablePanel=(avail-12-(stacked?gap:0))/(stacked?2:1),minimum=header+foot+section+(short?75:125)+4;
  const panelH=Math.max(minimum,Math.min(availablePanel,header+foot+section+w*.66+4)),sceneH=panelH-header-section-foot-4;
  const contentH=panelH*(stacked?2:1)+(stacked?gap:0),offset=Math.max(6,(avail-contentH)/2);
  this.height=Math.max(avail,contentH+12);
  this.world.style.height=this.height+'px';
  for(const canvas of[this.back,this.front]){canvas.width=Math.round(width*ratio);canvas.height=Math.round(this.height*ratio);canvas.style.height=this.height+'px'}
  this.bg.setTransform(ratio,0,0,ratio,0,0);this.ctx.setTransform(ratio,0,0,ratio,0,0);
  for(const[k,heading]of Object.entries(this.headings))heading.hidden=single&&k!==selected;
  this.layouts=(single?[selected]:['primary','secondary']).map((kind,i)=>{
   const x=margin+(stacked?0:i*(w+gap)),y=offset+(stacked?i*(panelH+gap):0),scene={x,y:y+header,w,h:sceneH};
   const scale=Math.min(w/1000,sceneH/650),origin={x:x+(w-1000*scale)/2,y:scene.y+sceneH-660*scale};
   const layout={kind,x,y,w,h:panelH,scene,soil:soil?{x,y:scene.y+scene.h,w,h:section}:null,scale,origin};
   const heading=this.headings[kind];Object.assign(heading.style,{left:x+'px',top:y+'px',width:w+'px',height:panelH+'px'});return layout;
  });
  return true;
 }
 drawBackground(science){
  const c=this.bg;c.clearRect(0,0,this.width,this.height);
  for(const{kind,scene,soil}of this.layouts){
   const s=science[kind];c.save();round(c,scene.x,scene.y,scene.w,scene.h+(soil?soil.h:0),17);c.clip();
   const draw=(name,alpha)=>{if(alpha<=0)return;const im=this.assets.images[name],scale=Math.max(scene.w/im.width,scene.h/im.height),dw=im.width*scale,dh=im.height*scale;c.globalAlpha=alpha;c.drawImage(im,scene.x+(scene.w-dw)/2,scene.y+scene.h-dh,dw,dh)};
   draw('landscape-base',1);draw('soil-base',kind==='secondary'?1:s.soil);
   draw('meadow-base',kind==='primary'?smooth(1.85,3.5,s.phase):smooth(.12,2.4,s.phase));
   c.globalAlpha=1;if(soil){c.fillStyle='#a1a6a0';c.fillRect(soil.x,soil.y,soil.w,soil.h)}c.restore();
  }
 }
 sprite(name,x,y,width,{alpha=1,skew=0,flip=1,angle=0}={}){
  if(alpha<.002||width<.3)return;
  const spec=this.assets.map.sprites[name];if(!spec)throw Error('缺少素材 '+name);
  const img=this.assets.images[spec.asset],r=spec.rect,h=width*r[3]/r[2],a=spec.anchor||[.5,1],c=this.ctx;
  c.save();c.globalAlpha=alpha;c.translate(x,y);c.rotate(angle);c.transform(flip,0,skew,1,0,0);
  c.drawImage(img,r[0],r[1],r[2],r[3],-width*a[0],-h*a[1],width,h);c.restore();
 }
 drawPlants(s,t,motion){
  const c=this.ctx,meta=[];const xx=v=>this.viewLeft+v*this.viewWidth/1000;
  // Ground-hugging pioneer layers are underneath upright vascular plants.
  for(const o of this.objects[s.kind].filter(o=>['lichen','moss'].includes(o.type))){
   const a=s[o.type];this.sprite(o.type,xx(o.x),o.y,o.width,{alpha:a,flip:o.flip});if(a>.05)meta.push({id:o.id,type:o.type,x:o.x,y:o.y,alpha:a});
  }
  if(s.deadwood>.01){
   this.sprite('snag',xx(200),501,170,{alpha:s.deadwood});this.sprite('snag',xx(765),493,150,{alpha:s.deadwood*.8,flip:-1});
   this.sprite('stump',xx(857),604,120,{alpha:.7+.3*s.deadwood});this.sprite('log',xx(345),637,195,{alpha:.45+.55*s.deadwood});
  }
  for(const o of this.objects[s.kind].filter(o=>!['lichen','moss'].includes(o.type))){
   const weight=s[o.type],phase=weight;if(weight<.002)continue;
   const tree=o.type==='trees',size=tree?mix(.18,1,smooth(0,1,phase)):mix(.7,1,smooth(0,.6,weight));
   const alpha=tree?smooth(0,.075,phase):clamp(weight),skew=motion?(Math.sin(t*1.15+o.seed)+.35*Math.sin(t*2.1+o.seed))* (tree?.008:o.type.includes('Shrub')||o.type==='shrub'?.012:.025):0;
   if(tree){
    const adult=smooth(.2,.8,phase);this.sprite('sapling',xx(o.x),o.y,o.width*size*.75,{alpha:alpha*(1-adult),skew,flip:o.flip});
    this.sprite('tree',xx(o.x),o.y,o.width*size*1.28,{alpha:alpha*adult,skew,flip:o.flip});
   }else this.sprite(o.type,xx(o.x),o.y,o.width*size,{alpha,skew,flip:o.flip});
   meta.push({id:o.id,type:o.type,x:o.x,y:o.y,alpha,size,skew});
  }
  // A low front edge retains understory even after the canopy closes.
  if(s.phase>3){for(let i=0;i<6;i++)this.sprite(i%2?'grass':'moss',xx(90+i*170),651,110,{alpha:(i%2?s.grass:s.moss)*.75,skew:motion?.016*Math.sin(t+i):0})}
  return meta;
 }
 drawAnimals(s,t,motion){
  const tt=motion?t:0,base=s.kind==='primary'?0:7;
  const cycle=((tt+base)%24)/24,fade=smooth(0,.07,cycle)*(1-smooth(.93,1,cycle));
  this.sprite('bird',-45+1090*cycle,160+25*Math.sin(cycle*Math.PI*2),46,{alpha:s.bird*fade,angle:motion?.045*Math.sin(tt*5):0});
  this.sprite('butterfly',500+65*Math.sin(tt*.6+base),480+25*Math.cos(tt*.85+base),26,{alpha:s.butterfly,angle:motion?.18*Math.sin(tt*3):0});
  const m=((tt+base)%32)/32;this.sprite('mouse',70+860*m,641-1.3*Math.abs(Math.sin(tt*8)),51,{alpha:s.mouse*smooth(0,.07,m)*(1-smooth(.93,1,m)),flip:1});
  this.sprite('insect',700+15*Math.sin(tt*.55),607,25,{alpha:s.insect,angle:motion?.025*Math.sin(tt*4):0});
 }
 drawSmoke(s,t){
  if(s.smoke<.001)return;const c=this.ctx;c.save();c.globalAlpha=s.smoke*.12;
  for(let i=0;i<3;i++){const x=180+i*260+8*Math.sin(t+i),y=420-t*16-i*25;const gr=c.createRadialGradient(x,y,0,x,y,46);gr.addColorStop(0,'#6d7779');gr.addColorStop(1,'#87979b00');c.fillStyle=gr;c.fillRect(x-46,y-46,92,92)}c.restore();
 }
 drawSection(l,s,labels){
  if(!l.soil)return;const{soil:b}=l,c=this.ctx,img=this.assets.images['soil-profiles-atlas'],profiles=this.assets.map.soilProfiles;
  c.save();round(c,b.x,b.y-16,b.w,b.h+16,16);c.clip();
  const layer=(name,alpha)=>{if(alpha<=0)return;const r=profiles[name];c.globalAlpha=alpha;c.drawImage(img,...r,b.x,b.y,b.w,b.h)};
  if(s.kind==='primary'){layer('bare',1);layer('forming',smooth(.1,2,s.phase));layer('developed',smooth(2,4.7,s.phase));}
  else{layer('postfire',1);layer('developed',smooth(1.5,5,s.phase));}
  c.restore();c.strokeStyle='#78684d80';c.lineWidth=.8;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.x+b.w,b.y);c.stroke();
  if(labels){const size=b.w<380?10:11;const title=s.kind==='primary'?(s.soil<.03?'基岩 · 缺乏土壤':s.soil<.3?'风化物与有机质积累':'土层与根系逐步发展'):(s.phase<1?'保留土壤与部分地下结构':'原有土壤基础 · 根系发展');pill(c,title,b.x+10,b.y+b.h-27,'#65543d',size)}
 }
 drawLabels(l,s){
  const c=this.ctx,objects=this.objects[s.kind],type=s.stage===0?null:s.stage===1?'lichen':s.stage===2?'moss':s.stage===3?'annual':s.stage===4?'shrub':'grass';
  const secondaryType=s.stage===1?'annual':s.stage===2?'grass':s.stage===3?'smallShrub':s.stage===4?'shrub':'grass';
  const target=objects.find(o=>o.type===(s.kind==='secondary'?secondaryType:type)&&o.x>360);
  let txt,wx,wy;if(s.stage===0){txt=s.kind==='primary'?'裸露岩面':'火后枯木与灰烬';wx=s.kind==='primary'?550:215;wy=s.kind==='primary'?570:445}
  else{const labels={lichen:'地衣',moss:'苔藓',annual:'草本植物',grass:'草本植物',smallShrub:'正在建立的灌木',shrub:'灌木与幼树'};txt=s.stage===5?'林下植被保留':labels[s.kind==='secondary'?secondaryType:type];wx=target?.x||550;wy=(target?.y||600)-25}
  const px=l.scene.x+wx*l.scene.w/1000,py=l.origin.y+wy*l.scale,size=l.w<370?10:11;c.font=`500 ${size}px "Microsoft YaHei",sans-serif`;
  const bw=c.measureText(txt).width+16,bx=clamp(px+22,l.scene.x+10,l.scene.x+l.scene.w-bw-10),by=clamp(py-32,l.scene.y+12,l.scene.y+l.scene.h-30);
  c.strokeStyle='#f9fff4d9';c.lineWidth=2.5;c.beginPath();c.moveTo(px,py);c.lineTo(bx,by+12);c.stroke();c.strokeStyle='#55785c';c.lineWidth=.8;c.stroke();
  pill(c,txt,bx,by,'#355c48',size);
 }
 draw(science,options={labels:true,soil:false,reduced:false}){
  this.resize(options.soil);this.drawBackground(science);const c=this.ctx;c.clearRect(0,0,this.width,this.height);this.lastSceneMeta=[];
  for(const l of this.layouts){
   const s=science[l.kind];c.save();round(c,l.scene.x,l.scene.y,l.scene.w,l.scene.h,options.soil?[16,16,0,0]:16);c.clip();
   c.translate(l.origin.x,l.origin.y);c.scale(l.scale,l.scale);this.viewLeft=(l.scene.x-l.origin.x)/l.scale;this.viewWidth=l.scene.w/l.scale;
   const objects=this.drawPlants(s,science.times[l.kind],!options.reduced);this.drawAnimals(s,science.times[l.kind],!options.reduced);this.drawSmoke(s,science.times[l.kind]);c.restore();
   this.drawSection(l,s,options.labels);if(options.labels)this.drawLabels(l,s);
   c.strokeStyle='#bdcdbd';c.lineWidth=.8;round(c,l.scene.x,l.scene.y,l.scene.w,l.scene.h+(l.soil?l.soil.h:0),16);c.stroke();
   this.lastSceneMeta.push({kind:l.kind,visibleObjects:objects,scene:{...l.scene},origin:{...l.origin},scale:l.scale,soil:l.soil?{...l.soil}:null});
  }
  this.frames++;this.front.dataset.ready='true';this.front.dataset.phase=science.phase.toFixed(5);
 }
 inspect(){return{width:this.width,height:this.height,frames:this.frames,objects:this.lastSceneMeta,assetCount:Object.keys(this.assets.images).length}}
}
