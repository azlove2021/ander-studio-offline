import {simulate} from './physiology.js';
import {buildTeachingTrace} from './presentation.js';
self.onmessage=()=>{
 try{const traces={standard:buildTeachingTrace(simulate('standard')),weak:simulate('weak')};self.postMessage({traces},[traces.standard.values.buffer,traces.weak.values.buffer]);}
 catch(error){self.postMessage({error:error.message});}
};
