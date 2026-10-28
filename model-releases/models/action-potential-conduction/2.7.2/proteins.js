import * as THREE from './vendor/three.module.min.js';
export async function createProteins(canvas,config){
  const response=await fetch(new URL('./assets/channels.json',import.meta.url));if(!response.ok)throw Error('通道几何加载失败');
  const data=await response.json();
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  const scene=new THREE.Scene(),world=new THREE.Group();scene.add(world);
  const camera=new THREE.OrthographicCamera(0,config.width,config.height,0,.1,3000);camera.position.set(0,0,1000);
  scene.add(new THREE.HemisphereLight(0xf5fbff,0x537582,2.0));
  const key=new THREE.DirectionalLight(0xffffff,2.1);key.position.set(-300,900,650);scene.add(key);
  const fill=new THREE.DirectionalLight(0xe9f5ff,.75);fill.position.set(1000,200,500);scene.add(fill);
  // Keep the donor pore and continuous gates; omit peripheral voltage-sensor lobes.
  const templates=data.parts.filter(p=>!p.name.includes('voltage-sensing domain')).map(p=>{
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(p.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(p.normals,3));geometry.setIndex(p.indices);
    if(p.morphPositions){geometry.morphAttributes.position=[new THREE.Float32BufferAttribute(p.morphPositions,3)];geometry.morphAttributes.normal=[new THREE.Float32BufferAttribute(p.morphNormals,3)];}
    const color=new THREE.Color().setRGB(...data.appearance[p.role==='lid'?'lid':p.kind]);
    return {p,geometry,color};
  });
  const units=[];
  for(const membrane of config.membranes.filter(m=>m.id==='upper'))for(let site=0;site<config.centres.length;site++)for(const kind of ['nav','kv']){
    const group=new THREE.Group(),x=config.centres[site]+(kind==='nav'?-config.offset:config.offset);
    group.position.set(x,config.height-membrane.y,0);group.scale.setScalar(config.proteinScale);if(membrane.normal<0)group.rotation.z=Math.PI;
    world.add(group);const pieces=[];
    for(const {p,geometry,color} of templates.filter(q=>q.p.kind===kind)){
      const material=new THREE.MeshStandardMaterial({color,roughness:.4,metalness:.05,emissive:color,emissiveIntensity:0});
      const mesh=new THREE.Mesh(geometry,material);mesh.position.fromArray(p.position);group.add(mesh);pieces.push({mesh,p});
    }
    units.push({group,pieces,site,kind,membrane:membrane.id});
  }
  function update(states,highlight){
    for(const unit of units){const q=states[unit.site],opening=unit.kind==='nav'?q.activation:q.potassium,active=unit.kind==='nav'?q.pNa>.015:q.pK>.07;
      for(const {mesh,p} of unit.pieces){
        if(p.role==='activation')mesh.position.x=p.position[0]+p.sign*.38*opening;
        if(p.role==='lid')mesh.position.set(...p.position.map((v,i)=>v+(p.closedPosition[i]-v)*q.inactivation));
        if(p.role==='tether')mesh.morphTargetInfluences[0]=q.inactivation;
        mesh.material.emissiveIntensity=highlight&&active?.24:0;
      }
    }
    renderer.render(scene,camera);
  }
  function resize(width,height){renderer.setSize(width,height,false);renderer.render(scene,camera);}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();config.onContextLost?.();});
  return {update,resize,units,source:data.source,geometryParts:templates.length,renderer};
}
