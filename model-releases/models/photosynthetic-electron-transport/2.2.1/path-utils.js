// Adapted path helpers and flow palette from respiratory-electron-transport@2.4.1; no respiratory science.
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const progress=(t,a,b)=>clamp((t-a)/(b-a));
export const smooth=v=>v*v*(3-2*v);
export const lerp=(a,b,p)=>a+(b-a)*p;
export function point(points,p){const n=points.length-1,k=clamp(p)*n,i=Math.min(n-1,Math.floor(k)),q=k-i;return[lerp(points[i][0],points[i+1][0],q),lerp(points[i][1],points[i+1][1],q)];}
// Rendered curves and moving particles use the same cached geometry and arc-length table.
export function route(segments){
 const samples=[{xy:segments[0][0],length:0}];let length=0;
 for(const [a,b,c,d] of segments)for(let i=1;i<=48;i++){
  const t=i/48,u=1-t,xy=[0,1].map(k=>u*u*u*a[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t*t*t*d[k]);
  const last=samples.at(-1).xy;length+=Math.hypot(xy[0]-last[0],xy[1]-last[1]);samples.push({xy,length});
 }
 const d='M'+segments[0][0].join(' ')+segments.map(s=>'C'+s.slice(1).flat().join(' ')).join('');
 return{d,length,segments,at(p){const target=clamp(p)*length;let lo=0,hi=samples.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(samples[mid].length<target)lo=mid;else hi=mid;}const a=samples[lo],b=samples[hi],q=(target-a.length)/(b.length-a.length||1);return[lerp(a.xy[0],b.xy[0],q),lerp(a.xy[1],b.xy[1],q)];}};
}
export function joinRoutes(parts){
 for(let i=1;i<parts.length;i++){const a=parts[i-1].at(1),b=parts[i].at(0);if(Math.hypot(a[0]-b[0],a[1]-b[1])>.001)throw Error('Disconnected flow route');}
 return route(parts.flatMap(p=>p.segments));
}
export const FLOW_STYLE={electron:{color:'#bd6256',width:5.2,head:30,idle:.24},proton:{color:'#7795a4',width:5,head:28,idle:.23},carrier:{color:'#91a185',width:3.2,head:24,idle:.23},material:{color:'#b08a74',width:3.2,head:25,idle:.23},light:{color:'#b38a2e',width:6.4,head:32,idle:.30}};
export function arrowMarker(id,kind,head=FLOW_STYLE[kind].head){const style=FLOW_STYLE[kind];return '<marker id="'+id+'" viewBox="0 0 32 28" refX="22" refY="14" markerWidth="'+head+'" markerHeight="'+(head*28/32)+'" markerUnits="userSpaceOnUse" orient="auto"><path d="M2 2L28 14 2 26 7 14Z" fill="'+style.color+'" stroke="#fffdf8" stroke-width="1.3" stroke-linejoin="round"/></marker>';}
