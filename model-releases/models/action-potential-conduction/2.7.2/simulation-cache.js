import {P} from './physiology.js';
import {recoveryPresentation} from './presentation.js';

// Prepared from the unchanged solver during model production, without rounding
// or dropping spatial/time samples. Gzip is only a lossless transport encoding.
let pending;
export function loadTeachingTraces(){
 if(!pending)pending=(typeof DecompressionStream==='function'?readPackageCache():computeInWorker()).catch(error=>{pending=null;throw error;});
 return pending;
}
async function readPackageCache(){
 const response=await fetch(new URL('./assets/teaching-traces.json',import.meta.url));
 if(!response.ok)throw Error('电位数据加载失败');
 const data=await response.json();
 if(data.format!=='conduction-traces-f32le-gzip-v1'||JSON.stringify(data.parameters)!==JSON.stringify(P)||JSON.stringify(data.recovery)!==JSON.stringify(recoveryPresentation))throw Error('电位数据与模型版本不一致');
 const encoded=atob(data.payload),packed=new Uint8Array(encoded.length);
 for(let i=0;i<encoded.length;i++)packed[i]=encoded.charCodeAt(i);
 const bytes=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 if(bytes.byteLength!==data.floatCount*4)throw Error('电位数据不完整');
 let values=new Float32Array(bytes);
 if(new Uint8Array(new Uint32Array([0x01020304]).buffer)[0]!==4){const view=new DataView(bytes);values=Float32Array.from({length:data.floatCount},(_,i)=>view.getFloat32(i*4,true));}
 const traces={};
 for(const meta of data.traces){
  const {offset,length,...trace}=meta;
  if(length!==trace.N*trace.count*4||trace.N!==201||trace.count!==1001||offset+length>values.length)throw Error('电位数据维度异常');
  trace.p={...P};trace.values=values.subarray(offset,offset+length);
  if(trace.recoveryPresentation)trace.recoveryPresentation.starts=Float64Array.from(trace.recoveryPresentation.starts,v=>v===null?Infinity:v);
  traces[trace.kind]=trace;
 }
 if(!traces.standard||!traces.weak)throw Error('电位情境不完整');
 document.documentElement.dataset.conductionData='package-cache';return traces;
}
function computeInWorker(){
 // Older engines without streaming decompression retain the original solver,
 // off the UI thread. No lowered integration accuracy or simplified equation.
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./simulation-worker.js',import.meta.url),{type:'module'});
  const finish=(callback,value)=>{worker.terminate();callback(value);};
  worker.onmessage=({data})=>{if(data.error)finish(reject,Error(data.error));else{document.documentElement.dataset.conductionData='worker';finish(resolve,data.traces);}};
  worker.onerror=()=>finish(reject,Error('电位计算未完成，请重新加载'));worker.postMessage('compute');
 });
}
