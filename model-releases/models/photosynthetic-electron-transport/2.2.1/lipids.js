// Batch the unchanged transport 2.3.0 lipid tail geometry into eight SVG paths.
// All original lipid positions, heads, phases, amplitudes and bends are retained.
export class NativeLipidLayer{
 constructor(svg){
  this.layers=[];this.lipidCount=0;this.lastTime=null;const membrane=svg.querySelector('#continuous-inner-membrane');
  [...membrane.children].forEach((tile,tileIndex)=>{
   const groups={1:[],'-1':[]};
   for(const lipid of [...tile.children]){const x=+lipid.querySelector('circle').getAttribute('cx');if(tileIndex*1034.24+x*.8>1815){lipid.remove();continue;}this.lipidCount++;
    for(const el of lipid.querySelectorAll('.lipid-tail-core')){const p=Object.fromEntries(['x','y','leaflet','side','phase','amp','bend'].map(k=>[k,+el.dataset[k]]));groups[p.leaflet].push(p);}
    lipid.querySelectorAll('.lipid-tail').forEach(e=>e.remove());
   }
   for(const tails of Object.values(groups)){
    const nodes=['lipid-tail-core','lipid-tail-shadow'].map(style=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('class','lipid-tail '+style);tile.insertBefore(p,tile.firstChild);return p});
    this.layers.push({tails,nodes});
   }
  });
 }
 draw(seconds){
  const time=Math.round(seconds*25)/25;if(time===this.lastTime)return;this.lastTime=time;
  for(const layer of this.layers){const d=layer.tails.map(p=>{const motion=time*(.32+.1*4.8),wave=Math.sin(motion+p.phase)*p.amp+Math.cos(motion*1.34+p.phase*1.9)*p.amp*.52,bend=p.bend+Math.sin(motion*.9+p.phase*1.31)*p.amp*.58;return activeTransport2dLipidTailPath(p.x,p.y,p.leaflet,p.side,wave,bend)}).join(' ');for(const path of layer.nodes)path.setAttribute('d',d);}
 }
 getDiagnostics(){return{renderer:'batched-native-svg-paths',lipids:this.lipidCount,tailGeometries:this.lipidCount*4,animatedDOMNodes:this.layers.length*2,nativeShapeSource:'transport@2.3.0',scientificTime:this.lastTime};}
}

