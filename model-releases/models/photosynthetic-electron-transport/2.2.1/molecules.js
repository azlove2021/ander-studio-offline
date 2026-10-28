import {FLOW_STYLE} from './engine.js';
// One visual vocabulary for every small species: shared light, stroke, bonds and labels.
// ATP topology: fused 6+5 adenine rings, a five-member ribose, C5'-O-phosphate chain.
// References: ChEBI CHEBI:15422 and wwPDB ATP chemical component; simplified groups, not an atom-complete formula.
export const molecularDefs=()=>'<defs>'+[
 ['oxygen','#ffe1d4','#df947d','#b76553'],['hydrogen','#ffffff','#e9f0ee','#bdccca'],['proton','#f0fbff','#a7d3e4','#538eaa'],['electron','#fff4df','#e39782','#b94e43'],['phosphate','#e7f3fc','#a8c9db','#658caa'],['terminal','#e5fff4','#55c5b6','#188b88'],['adenine','#e9f2d8','#b8cd92','#788b55'],['ribose','#fff0d6','#eac292','#ad865e'],['carbon','#f2eee7','#c4bcaf','#8f8b81'],['carrier','#f5ead2','#d1b18a','#9e785e']
].map(([id,a,b,c])=>'<radialGradient id="mol-'+id+'" cx="29%" cy="23%" r="85%"><stop stop-color="'+a+'"/><stop offset=".6" stop-color="'+b+'"/><stop offset="1" stop-color="'+c+'"/></radialGradient>').join('')+'<filter id="electron-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>'+Object.entries(FLOW_STYLE).map(([kind,style])=>'<marker id="'+kind+'-flow-arrow" viewBox="0 0 32 28" refX="28" refY="14" markerWidth="'+style.head+'" markerHeight="'+(style.head*28/32)+'" markerUnits="userSpaceOnUse" orient="auto"><path d="M2 2L28 14 2 26 7 14Z" fill="'+style.color+'" stroke="#fffdf8" stroke-width="1.3" stroke-linejoin="round"/></marker>').join('')+'</defs>';
export function bead(kind,x=0,y=0,r=12,label=''){return'<g class="molecular-bead" transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="url(#mol-'+kind+')" class="bead-'+kind+'"/>'+(label?'<text y="5" text-anchor="middle" class="species-symbol">'+label+'</text>':'')+'</g>';}
export const electronGlyph=()=>'<g class="electron-glyph"><circle class="electron-aura" r="23" fill="#d78b76" opacity=".26" filter="url(#electron-glow)"/><circle class="electron-rim" r="18.5" fill="#fff"/><circle class="electron-core" r="16" fill="url(#mol-electron)"/><text y="6" text-anchor="middle" class="electron-symbol">e⁻</text></g>';
export const protonGlyph=()=>bead('proton',0,0,12,'H⁺');
export function phosphateGlyph(label='P'){return'<g class="phosphate-group">'+bead('phosphate',0,0,11,label)+'</g>';}
export function nucleotideGlyph(){
 // The adenine five-ring shares exactly the C4-C5 edge with its six-ring.
 // N9 is the lower-right corner of the five-ring; it bonds to ribose C1'.
 return '<g class="nucleotide" data-topology="adenine-6-5/ribose-5/5prime-triphosphate">'+
 '<g class="nucleoside" transform="scale(.75)"><g class="adenine"><polygon data-ring="adenine-six" points="-103,-23 -88,-32 -73,-23 -73,-5 -88,4 -103,-5" fill="url(#mol-adenine)"/>'+
 '<polygon data-ring="adenine-five" points="-73,-23 -56,-29 -46,-14 -56,1 -73,-5" fill="url(#mol-adenine)"/>'+
 '<path class="molecule-bond" d="M-88 -32v-10"/><text x="-88" y="-46" text-anchor="middle" class="atom-detail">NH₂</text></g>'+
 '<path data-bond="N9-C1prime" class="molecule-bond" d="M-56 1L-49 10"/>'+
 '<polygon data-ring="ribose-five" points="-49,10 -31,2 -13,15 -20,37 -43,35" fill="url(#mol-ribose)"/>'+
 '<text x="-31" y="8" text-anchor="middle" class="atom-detail">O</text>'+
 '<path class="molecule-bond" data-bond="C4prime-C5prime-O5prime" d="M-13 15L-4 8H4"/>'+
 '<path class="molecule-bond" d="M-43 35l-3 7M-20 37l3 7"/><text x="-47" y="55" text-anchor="middle" class="atom-detail">OH</text><text x="-14" y="57" text-anchor="middle" class="atom-detail">OH</text></g>'+
 '<path class="molecule-bond" d="M25 5H26"/><g data-phosphate="alpha" transform="translate(14 5)">'+phosphateGlyph()+'</g>'+
 '<g data-phosphate="beta" transform="translate(37 5)">'+phosphateGlyph()+'</g>'+
 '<path class="molecule-bond terminal-bond" data-bond="beta-gamma" d="M48 5H49"/>'+
 '<g class="terminal-phosphate" data-phosphate="gamma" transform="translate(60 5)"><circle class="phosphate-halo" r="16" fill="#63d2c5" opacity=".25"/>'+phosphateGlyph('Pi')+'</g>'+
 '<g class="phosphate-indices"><text x="14" y="28" text-anchor="middle">α</text><text x="37" y="28" text-anchor="middle">β</text><text class="gamma-index" x="60" y="28" text-anchor="middle">γ</text></g></g>';
}
export function quinoneGlyph(){return'<path class="molecule-bond q-tail" d="M-18 10l-15 6-9-7-12 5-10-7"/>'+
 '<polygon points="-18,-10 0,-20 18,-10 18,10 0,20 -18,10" fill="url(#mol-adenine)" class="molecular-ring"/>'+
 bead('oxygen',0,-23,6)+bead('oxygen',0,23,6)+
 '<g class="q-h q-h-0">'+bead('hydrogen',-9,-29,4)+'</g><g class="q-h q-h-1">'+bead('hydrogen',9,29,4)+'</g>'+
 '<text class="species-symbol q-name" y="5" text-anchor="middle">Q</text>'+
 '<g class="q-electron q-e-0" transform="translate(-20 -36) scale(.86)">'+electronGlyph()+'</g><g class="q-electron q-e-1" transform="translate(20 -36) scale(.86)">'+electronGlyph()+'</g>';}
export function donorGlyph(type){
 if(type==='succinate')return'<g class="substrate-succinate"><path class="molecule-bond" d="M-39 0L-13 -6 13 6 39 0M-39 0l-10-17m10 17-10 17M39 0l10-17m-10 17 10 17"/><path class="molecule-bond oxidation-bond" d="M-13 -1L12 11"/>'+
 [-39,-13,13,39].map((x,i)=>bead('carbon',x,[0,-6,6,0][i],7)).join('')+
 [[-50,-18],[-50,18],[50,-18],[50,18]].map(([x,y])=>bead('oxygen',x,y,7)).join('')+'</g>';
 return'<g class="substrate-nadh"><path class="molecule-bond" d="M-53 0H51"/>'+
 '<polygon class="molecular-ring" points="-65,-8 -55,-14 -45,-8 -45,4 -55,10 -65,4" fill="url(#mol-adenine)"/>'+
 '<polygon class="molecular-ring" points="-45,-8 -34,-12 -28,-2 -35,8 -45,4" fill="url(#mol-adenine)"/>'+
 '<polygon class="molecular-ring" points="-24,-9 -14,-5 -16,7 -29,9 -34,-2" fill="url(#mol-ribose)"/>'+
 '<g transform="scale(.65)">'+bead('phosphate',0,0,10,'P')+bead('phosphate',27,0,10,'P')+'</g>'+
 '<polygon class="molecular-ring" points="34,-9 44,-5 42,7 29,9 24,-2" fill="url(#mol-ribose)"/>'+
 '<polygon class="molecular-ring" points="49,-8 60,-14 71,-8 71,5 60,11 49,5" fill="url(#mol-adenine)"/>'+
 '<g class="donor-charge"><path class="molecule-bond" d="M60 -14v-8"/>'+bead('hydrogen',60,-24,5)+'</g></g>';
}
