// Atlas drawing geometry. Scientific identities and products remain in science.js.
import {clamp,mix,unit,smooth} from './science.js';
const smoother=p=>p*p*p*(p*(6*p-15)+10);
const point=p=>`${p.x.toFixed(4)} ${p.y.toFixed(4)}`;
const poly=pts=>pts.map((p,i)=>(i?'L':'M')+point(p)).join(' ')+' Z';

// A single contour family pinches at q=1 and becomes two closed loops.
// No parent/daughter crossfade; quintic timing removes a sudden opening speed.
export function cellFrame(cx,cy,rx,ry,progress=0,vertical=false){
  const p=clamp(progress,0,1),split=.72,post=p>split?smoother((p-split)/(1-split)):0;
  const q=p<=split?smoother(p/split):1+.03*post;
  const outer=Math.sqrt(q*q+1),inner=q>1?Math.sqrt(q*q-1):0;
  const normal=q<=Math.SQRT1_2?Math.sqrt(1-q*q):1/(2*q);
  const peak=q<=Math.SQRT1_2?0:Math.sqrt(q*q-1/(4*q*q))/outer;
  const offset=q<=1?Math.max(.42,peak):mix(peak,(outer+inner)/(2*outer),post);
  const domains=q<1?[[-outer,outer]]:[[-outer,-inner],[inner,outer]];
  const contours=domains.map(([lo,hi])=>Array.from({length:192},(_,i)=>{
    const theta=2*Math.PI*i/192,x=(hi+lo)/2+(hi-lo)*Math.cos(theta)/2;
    const y=(Math.sin(theta)>=0?1:-1)*Math.sqrt(Math.max(0,Math.sqrt(1+4*q*q*x*x)-q*q-x*x))/normal;
    const u=x/outer,v=mix(y,Math.sin(theta),post);
    return{x:cx+(vertical?v:u)*rx,y:cy+(vertical?u:v)*ry};
  }));
  const centers=[-1,1].map(sign=>({x:cx+(vertical?0:sign*offset*rx),y:cy+(vertical?sign*offset*ry:0)}));
  return{contours,path:contours.map(poly).join(' '),centers,rx,ry,childRadius:(outer-inner)/(2*outer),q};
}

function rodShape(at,h,width){
  const girth=u=>width*(.46-.23*Math.exp(-((u-.33)**2)/.006));
  const cut=.64,radius=girth(0),u0=radius/h;
  const samples=(a,b,n=18)=>Array.from({length:n+1},(_,i)=>{const u=mix(a,b,i/n),p=at(u);return{...p,w:girth(u)};});
  const near=samples(u0,cut),far=samples(cut,1-u0);
  const edge=(ps,sign)=>ps.map(p=>({x:p.x+sign*p.w,y:p.y}));
  const cap=(p,top)=>Array.from({length:9},(_,i)=>{const a=(top?Math.PI:0)+Math.PI*i/8;return{x:p.x+p.w*Math.cos(a),y:p.y+radius*Math.sin(a)};});
  const proximal=poly([...edge(near,1),...edge([...near].reverse(),-1),...cap(near[0],true)]);
  const distal=poly([...edge(far,1),...cap(far.at(-1),false),...edge([...far].reverse(),-1)]);
  const bands=[.10,.21,.49,.58,.77,.91].map(u=>{const p=at(u),w=girth(u);return{u,path:`M${point({x:p.x-w*.84,y:p.y-1})} L${point({x:p.x+w*.84,y:p.y+1})}`};});
  return{proximal,distal,proximalBands:bands.filter(b=>b.u<cut).map(b=>b.path).join(' '),distalBands:bands.filter(b=>b.u>cut).map(b=>b.path).join(' ')};
}

export function atlasGeometry(state,width,options={}){
  const W=Math.max(80,width),cx=W/2,cy=state.centerY,t=state.time,index=state.index;
  const copied=smooth(state.replicated),pro=smooth(unit(t,4,7)),align=smooth(unit(t,13,15));
  const first=unit(t,15,20),preII=smooth(unit(t,20,22)),second=smooth(unit(t,22,29));
  const midSplit=smooth(unit(t,22,24)),rx=W*.46,ry=96;
  const firstFrame=cellFrame(cx,cy,rx,ry,first),endFrame=cellFrame(cx,cy,rx,ry,1);
  const childRx=rx*endFrame.childRadius;
  const horizontal=Boolean(options.horizontalProducts);
  const secondFrames=endFrame.centers.map(c=>cellFrame(c.x,cy,childRx,ry,unit(t,22,29),!horizontal));
  const cells=t<=20?firstFrame.contours:secondFrames.flatMap(f=>f.contours);
  const productCenters=secondFrames.flatMap(f=>f.centers);
  const gap=Math.min(24,W*.087),bodyWidth=Math.min(14,W*.060);
  const pairedGap=index===2?(options.compact?1.75:1.4):2.15;
  const baseSpread=rx*.42,pairedSpread=Math.min(baseSpread,gap*pairedGap);
  const spread=t<13?mix(baseSpread,pairedSpread,pro):mix(pairedSpread,baseSpread,align);
  const rods=state.chromatids.map(d=>{
    const sign=d.sister===0?-1:1,side=d.origin===1?-1:1;
    let orientation=side,rotationY=0;
    if(index===1&&d.pair===1&&state.conditions.arrangement==='repulsion'){
      orientation=side*Math.cos(Math.PI*align);rotationY=side*Math.sin(Math.PI*align)*23;
    }
    const initialX=cx+orientation*spread;
    let x=mix(initialX,firstFrame.centers[d.pole].x,smooth(first));
    if(t>=20)x=endFrame.centers[d.pole].x;
    const productRx=horizontal?childRx*endFrame.childRadius:childRx;
    const pairX=index===1?(d.pair===0?-1:1)*productRx*.42*preII:0;
    const pairY=index===1?(d.pair===0?-33:35):0;
    const end=productCenters[d.pole*2+d.sister];
    const y=cy+(pairY+rotationY)*(1-preII)+second*(end.y-cy);
    x+=pairX+second*(end.x-endFrame.centers[d.pole].x);
    const sisterLane=sign*gap*.65*preII*(1-smooth(unit(second,.35,.75)));
    x+=sisterLane;
    const fullH=index===1?(d.pair===0?76:54):138;
    const h=fullH*mix(1,horizontal?.88:index===1?.58:.48,preII),top=y-h/2;
    const armGap=gap*copied*(1-preII);
    const baseAt=u=>{
      const dist=Math.abs(u-.33)/(u<.33?.33:.67);
      return{x:x+sign*armGap*(.13+.87*Math.pow(dist,.82)),y:top+h*u};
    };
    const at=u=>{
      const pt=baseAt(u);
      const crossing=index===2&&state.exchange>0&&state.exchange<1&&((d.origin===1&&d.sister===1)||(d.origin===2&&d.sister===0));
      if(crossing){
        const approach=smooth(unit(state.exchange,0,.35)),release=smooth(unit(state.exchange,.65,1)),amount=approach*(1-release);
        if(u<=.64)pt.x=mix(pt.x,cx,amount*smooth(unit(u,.49,.64)));
        else{
          const target=state.reconnected?mix(2*cx-pt.x,pt.x,release):pt.x,distal=smooth(unit(u,.64,.83));
          pt.x=mix(mix(pt.x,cx,amount),target,distal);
          // The two reconnected ends follow small opposite arcs as they relax,
          // instead of sweeping through the same point and obscuring B/b.
          const arc=d.distalOrigin===1?-(options.compact?16:10):(options.compact?24:10);
          const clearance=smooth(unit(release,0,.2))*(1-smooth(unit(release,.8,1)));
          pt.y+=arc*clearance*distal;
        }
      }
      return pt;
    };
    const locus=u=>{const a=at(u-.001),b=at(u+.001);return{...at(u),u,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI-90};};
    return{...d,x,y,h,fullH,top,bottom:top+h,terminal:top+h,width:bodyWidth,armGap,labelColumnX:x-sisterLane,
      ...rodShape(at,h,bodyWidth*mix(1,.83,preII)),
      proximalLabel:locus(.43),distalLabel:locus(index===2?.83:.68),centromere:at(.33)};
  });
  return{width:W,centerY:cy,rods,cells,cellPath:cells.map(poly).join(' '),first,second,copied,midSplit,preII,productCenters,childCenters:endFrame.centers};
}
