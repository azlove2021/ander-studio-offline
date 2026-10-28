// Geometry retained from the user-approved visual prototype v2.
export function route(points,radius=12){
 const xy=p=>p.map(v=>Number(v.toFixed(2))).join(' ');let path='M'+xy(points[0]);
 for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],ab=Math.hypot(a[0]-b[0],a[1]-b[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);const r=Math.min(radius,ab/2,bc/2);path+='L'+xy([b[0]+(a[0]-b[0])*r/ab,b[1]+(a[1]-b[1])*r/ab])+'Q'+xy(b)+' '+xy([b[0]+(c[0]-b[0])*r/bc,b[1]+(c[1]-b[1])*r/bc]);}
 return path+'L'+xy(points.at(-1));
}
const show=(id,a,b,content)=>`<g id="${id}" data-reveal="${a},${b}">${content}</g>`;
const molecule=(x,y,w,formula,name,kind='')=>`<g class="molecule ${kind}"><rect class="molecule-box" x="${x}" y="${y}" width="${w}" height="77" rx="16"/><text class="formula" x="${x+w/2}" y="${y+34}" text-anchor="middle">${formula}</text><text class="molecule-name" x="${x+w/2}" y="${y+61}" text-anchor="middle">${name}</text></g>`;
const badge=(x,y,n,title,location)=>`<circle cx="${x+15}" cy="${y-7}" r="16" fill="#4a9680"/><text x="${x+15}" y="${y-1}" text-anchor="middle" class="stage-number">${n}</text><text x="${x+44}" y="${y}" class="reaction-title">${title}</text><text x="${x+44}" y="${y+28}" class="reaction-location">${location}</text>`;
const line=(id,points,a,b,type='reaction')=>`<path id="${id}" d="${route(points)}" class="${type}-arrow" data-draw="${a},${b}"/>`;
const stem=(points)=>`<path d="${route(points)}" class="branch-stem"/>`;
const junction=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.8" class="junction"/>`;
const energy=(x,y,w,title,h=66)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" class="energy-pill"/><text x="${x+w/2}" y="${y+(h===77?34:28)}" text-anchor="middle" class="energy-title">${title}</text><text x="${x+w/2}" y="${y+(h===77?61:51)}" text-anchor="middle" class="energy-sub">ADP + Pi → ATP</text></g>`;

// These are trajectories of the original card centers, not extra molecule sprites.
export const MOTION={
 pyruvate:{origin:[596,342.5],aerobic:[[596,342.5],[725,342.5],[725,250],[900,250],[900,454.5],[1031,454.5]],lactate:[[596,342.5],[760,342.5],[760,574],[458,574],[458,660.5]],ethanol:[[596,342.5],[760,342.5],[760,574],[382,574],[382,660.5]]},
 cytoH:{origin:[596,470.5],aerobic:[[596,470.5],[596,681],[830,681],[830,783],[914,783]],lactate:[[596,470.5],[596,558],[513,558],[513,594]],ethanol:[[596,470.5],[596,558],[448,558],[448,594]]},
 matrixH:{origin:[1373,581.5],aerobic:[[1373,581.5],[1373,681],[1005,681],[1005,783]]}
};
function motionGuides(){return `<g id="motion-guides" fill="none" stroke="none" aria-hidden="true">${Object.entries(MOTION).flatMap(([key,value])=>Object.entries(value).filter(([name])=>name!=='origin').map(([mode,points])=>`<path id="motion-${key}-${mode}" d="${route(points)}"/>`)).join('')}</g>`}

function glycolysis(){return `<g data-stage-group="0">
 ${badge(230,236,1,'糖酵解','细胞质基质')}
 <g id="g-glucose">${molecule(220,304,202,'C₆H₁₂O₆','葡萄糖','carbon')}</g>
 ${line('g-reaction',[[431,342.5],[484,342.5]],2,5)}
 ${show('g-enzyme',1,1.5,'<text x="458" y="325" text-anchor="middle" class="enzyme">酶</text>')}
 ${show('g-branch',4,4.6,stem([[458,342.5],[458,395]])+junction(458,342.5)+junction(458,395))}
 ${line('g-atp-route',[[458,395],[321,395],[321,422]],5,7,'energy')}
 ${show('g-atp',6.4,8.2,energy(220,432,202,'净得 2 ATP',77))}
 ${line('g-h-route',[[458,395],[596,395],[596,422]],5,7,'cofactor')}
 ${show('g-heat',7,8.5,'<text x="321" y="531" text-anchor="middle" class="heat-note">部分能量散失为热</text>')}
 </g>`}

function aerobicSecond(){return `<g data-mode-group="aerobic" data-stage-group="1">
 ${show('a2-badge',11,11.8,badge(1000,370,2,'彻底氧化','线粒体基质 · 丙酮酸氧化与三羧酸循环'))}
 ${line('a2-transport',[[708,342.5],[725,342.5],[725,250],[900,250],[900,454.5],[920,454.5]],11,15.6)}
 ${show('a2-transport-label',11,12,'<text x="826" y="232" text-anchor="middle" class="arrow-note">丙酮酸转入基质</text>')}
 ${show('a2-water',16,17,'<text x="1200" y="423" text-anchor="middle" class="formula" style="font-size:25px">6 H₂O</text>')}
 ${line('a2-water-route',[[1200,430],[1200,450]],17,18)}
 ${line('a2-reaction',[[1141,455],[1272,455]],17.5,21)}
 ${show('a2-enzyme',16.5,17.5,'<text x="1219" y="484" class="enzyme">酶</text>')}
 ${show('a2-co2',20,22,molecule(1282,416,170,'6 CO₂','释放二氧化碳','gas'))}
 ${show('a2-branch',19,20,stem([[1200,455],[1200,515]])+junction(1200,455)+junction(1200,515))}
 ${line('a2-h-route',[[1200,515],[1373,515],[1373,533]],20,22,'cofactor')}
 ${line('a2-atp-route',[[1200,515],[1035,515],[1035,533]],20,22,'energy')}
 ${show('a2-atp',21.5,23.5,energy(920,543,230,'少量 ATP'))}
 </g>`}

function aerobicThird(){return `<g data-mode-group="aerobic" data-stage-group="2">
 ${line('a3-cyto-h',[[596,519],[596,681],[830,681],[830,783],[896,783]],26,30.4,'cofactor')}
 ${show('a3-cyto-label',26,27,'<text x="670" y="653" text-anchor="middle" class="cofactor-note">还原力传递</text>')}
 ${line('a3-matrix-h',[[1373,630],[1373,681],[1005,681],[1005,758]],26.6,30.4,'cofactor')}
 ${show('a3-site',26,27,`<path d="${route([[1330,627],[1330,716]])}" class="site-link"/><circle cx="1330" cy="627" r="8" class="site-dot"/><rect x="870" y="716" width="710" height="131" rx="18" class="site-card"/><text x="1095" y="744" class="site-title">③ 第三阶段 · 内膜上的反应（引出示意）</text>`)}
 ${show('a3-h-sum',30.9,31.6,'<text x="905" y="791" class="formula" style="font-size:26px;fill:#97728a">24 [H]</text>')}
 ${show('a3-oxygen',31,32,'<text x="1020" y="791" class="formula" style="font-size:26px">+ 6 O₂</text>')}
 ${line('a3-reaction',[[1125,783],[1184,783]],32,35)}
 ${show('a3-water',34,37,'<text x="1205" y="791" class="formula" style="font-size:26px;fill:#487e97">12 H₂O</text>')}
 ${show('a3-energy-branch',33,34,stem([[1143,783],[1143,825]])+junction(1143,783))}
 ${line('a3-atp-route',[[1143,825],[1332,825],[1332,789],[1354,789]],34,37,'energy')}
 ${show('a3-energy-label',34,35,'<text x="1230" y="817" text-anchor="middle" class="energy-sub">释放能量</text>')}
 ${show('a3-atp',35.5,38.5,energy(1364,756,196,'大量 ATP'))}
 ${show('a3-net',39,40,'<text x="1222" y="878" text-anchor="middle" class="small-label">第二阶段消耗 6 H₂O，第三阶段形成 12 H₂O；全程净形成 6 H₂O</text>')}
 </g>`}

function fermentation(mode){
 const lactate=mode==='lactate',p=lactate?'l':'e',target=lactate?458:382;
 return `<g data-mode-group="${mode}" data-stage-group="1">
 ${show(p+'-badge',11,12,badge(205,563,2,lactate?'丙酮酸还原':'脱羧与还原','细胞质基质'))}
 ${line(p+'-transport',[[708,342.5],[760,342.5],[760,574],[target,574],[target,612]],11,15.8)}
 ${show(p+'-enzyme',14,15,'<text x="681" y="561" class="enzyme">酶</text>')}
 ${line(p+'-h-route',[[596,519],[596,563]],14,15.5,'cofactor')}
 ${show(p+'-junction',15,15.5,junction(596,574))}
 ${!lactate?'<g id="e-h-wait" data-window="15.5,16,21,21.5"><text x="621" y="539" class="small-label">待还原</text></g>':''}
 ${lactate?show('l-product',19,22,molecule(357,622,202,'2 C₃H₆O₃','乳酸','end-product')):`
 <g id="e-intermediate" data-window="16.5,17.5,22,24">${molecule(281,622,202,'2 C₂H₄O','乙醛（中间产物）','carbon')}</g>
 ${show('e-product',23,26,molecule(281,622,202,'2 C₂H₅OH','乙醇（酒精）','end-product'))}
 ${show('e-co2',18,20,'<text x="522" y="660" class="formula">+</text>'+molecule(570,622,159,'2 CO₂','二氧化碳','gas'))}
 ${show('e-step-note',16,17,'<text id="ethanol-step-note" x="514" y="719" text-anchor="middle" class="small-label">丙酮酸脱羧，形成乙醛并释放 CO₂</text>')}`}
 ${show(p+'-end-note',26,27,`<rect x="240" y="749" width="520" height="37" rx="18" class="no-atp"/><text x="500" y="774" text-anchor="middle" class="fermentation-note">${lactate?'再生 NAD⁺ · 不释放 CO₂ · 本阶段无 ATP':'再生 NAD⁺ · 本阶段不产生 ATP'}</text>`)}
 </g>`;
}

const MATERIAL_CARDS={pyruvate:[495,304,202,'2 C₃H₄O₃','丙酮酸','carbon'],cytoH:[495,432,202,'4 [H]','还原力','cofactor'],matrixH:[1290,543,166,'20 [H]','还原力','cofactor']};
function originalMaterials(){return `<g id="original-materials">${Object.entries({pyruvate:'g-pyruvate',cytoH:'g-h',matrixH:'a2-h'}).map(([key,id])=>`<g id="${id}" data-material="${key}">${molecule(...MATERIAL_CARDS[key])}</g>`).join('')}</g>`}
function materialRecords(){return `<g id="material-records" aria-label="原位置的反应过程记录">${Object.entries(MATERIAL_CARDS).map(([key,card])=>`<g id="record-${key}" data-material-record="${key}">${molecule(...card)}</g>`).join('')}</g>`}
export function reactionScene(){return motionGuides()+glycolysis()+aerobicSecond()+aerobicThird()+fermentation('lactate')+fermentation('ethanol')+materialRecords()+originalMaterials()}
