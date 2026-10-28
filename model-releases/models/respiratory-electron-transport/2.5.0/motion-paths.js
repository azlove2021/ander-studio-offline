// Local arc-length helpers retained from this model's 2.4.1 geometry.
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const progress=(t,a,b)=>a===b?(t>=b?1:0):clamp((t-a)/(b-a));
export const smooth=v=>v*v*(3-2*v);
export const lerp=(a,b,p)=>a+(b-a)*p;
export function point(points,p){const n=points.length-1,k=clamp(p)*n,i=Math.min(n-1,Math.floor(k)),q=k-i;return[lerp(points[i][0],points[i+1][0],q),lerp(points[i][1],points[i+1][1],q)];}
export function route(segments){
 const samples=[{xy:segments[0][0],length:0}];let length=0;
 for(const[a,b,c,d]of segments)for(let i=1;i<=48;i++){const t=i/48,u=1-t,xy=[0,1].map(k=>u*u*u*a[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t*t*t*d[k]);const last=samples.at(-1).xy;length+=Math.hypot(xy[0]-last[0],xy[1]-last[1]);samples.push({xy,length});}
 const d='M'+segments[0][0].join(' ')+segments.map(s=>'C'+s.slice(1).flat().join(' ')).join('');
 return{d,length,segments,at(p){const target=clamp(p)*length;let lo=0,hi=samples.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(samples[mid].length<target)lo=mid;else hi=mid;}const a=samples[lo],b=samples[hi],q=(target-a.length)/(b.length-a.length||1);return[lerp(a.xy[0],b.xy[0],q),lerp(a.xy[1],b.xy[1],q)];}};
}
export const straight=(a,b)=>route([[a,point([a,b],1/3),point([a,b],2/3),b]]);
export function joinRoutes(parts){for(let i=1;i<parts.length;i++){const a=parts[i-1].at(1),b=parts[i].at(0);if(Math.hypot(a[0]-b[0],a[1]-b[1])>.001)throw Error('Disconnected motion route');}return route(parts.flatMap(p=>p.segments));}
