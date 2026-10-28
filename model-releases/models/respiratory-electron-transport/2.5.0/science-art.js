/* Protein appearance and placement preserved from the accepted visual sample. */
function proteinImage(id,x,y,scale,width,height){return `<image class="protein-art" data-protein="${id}" href="assets/${id}.png" x="${x}" y="${y}" width="${width*scale}" height="${height*scale}" preserveAspectRatio="xMidYMid meet"/>`;}
function romanBadge(text,x,y){return `<g transform="translate(${x} ${y})"><circle r="19" fill="#fffdf8" fill-opacity=".93" stroke="#d5dfd5"/><text y="6.5" text-anchor="middle" style="font-size:21px;font-weight:700;fill:#3b5362">${text}</text></g>`;}
function scienceDrawing(){return `${transport2dDefs()}
<defs>
 <clipPath id="camera-clip"><rect id="camera-rect" width="1600" height="720"/></clipPath>
 <clipPath id="membrane-frame"><rect x="0" y="259" width="1600" height="122"/></clipPath>
 <linearGradient id="ims-wash" x2="0" y2="1"><stop stop-color="#eef7f7"/><stop offset="1" stop-color="#f7fbf8"/></linearGradient>
 <linearGradient id="matrix-wash" x2="0" y2="1"><stop stop-color="#fffaf1"/><stop offset="1" stop-color="#fffdf8"/></linearGradient>
 <linearGradient id="membrane-core-wash" x2="0" y2="1"><stop stop-color="#f1f7ec"/><stop offset=".5" stop-color="#e6efdf"/><stop offset="1" stop-color="#f3f7eb"/></linearGradient>
</defs>
<g id="scene-background" clip-path="url(#camera-clip)"><rect width="1600" height="720" fill="#fffdf8"/><rect width="1600" height="277" fill="url(#ims-wash)"/><rect y="365" width="1600" height="355" fill="url(#matrix-wash)"/><rect y="276" width="1600" height="90" fill="url(#membrane-core-wash)"/></g>
<g id="scene-foreground" clip-path="url(#camera-clip)">
 <text x="28" y="44" class="compartment">膜间隙</text><text x="28" y="72" class="sub">H⁺ 积累侧</text>
 <g class="route-key"><path d="M30 110H70" class="electron-line"/><text x="84" y="116" class="sub">电子</text><path d="M30 146H70" class="proton-line"/><text x="84" y="152" class="sub">H⁺</text></g>
 <text x="20" y="431" class="compartment" style="font-size:22px">线粒体</text><text x="20" y="462" class="compartment" style="font-size:24px">基质</text>
 <g id="continuous-inner-membrane" class="transport-integrated-membrane" clip-path="url(#membrane-frame)" style="filter:saturate(.68)"><g transform="translate(0 119.48) scale(.72)">${transportIntegratedLipids()}</g><g transform="translate(930.816 119.48) scale(.72)">${transportIntegratedLipids()}</g></g>
 <text x="28" y="325" class="sub" style="font-size:19px;fill:#678a90">内膜</text>
 <g data-object="complex-I">${proteinImage('complex-I',60.32,204.28,.32,1312,1199)}${romanBadge('I',287,316)}
  <text x="310" y="442" class="label" style="fill:#577a63">复合体 I</text><text x="310" y="471" class="sub">NADH 的入口</text>
  <text x="246" y="143" text-anchor="middle" class="pump-label">4 H⁺ / 2e⁻</text><text x="246" y="170" text-anchor="middle" class="tiny pump-total" data-total="I"></text>
 </g>
 <g data-object="complex-II">${proteinImage('complex-II',477.46,252.425,.215,1199,1312)}${romanBadge('II',609,311)}
  <text x="602" y="551" text-anchor="middle" class="label" style="fill:#827299">复合体 II</text><text x="602" y="580" text-anchor="middle" class="sub">酶内结合型 FAD / FADH₂</text>
  <text x="602" y="607" text-anchor="middle" class="tiny" style="fill:#827299">不泵送 H⁺</text>
 </g>
 <g data-object="Q-pool"><text x="602" y="167" text-anchor="middle" class="label" style="fill:#697d46">Q / QH₂</text><text x="602" y="194" text-anchor="middle" class="sub">膜内 Q 池 · 跟踪一个代表</text></g>
 <g data-object="complex-III">${proteinImage('complex-III',765.2,214,.19,1374,1145)}${romanBadge('III',894,314)}
  <text x="883" y="143" text-anchor="middle" class="pump-label">4 H⁺ / 2e⁻</text><text x="883" y="170" text-anchor="middle" class="tiny pump-total" data-total="III"></text>
  <text x="898" y="464" text-anchor="middle" class="label" style="fill:#a1854c">复合体 III</text><text x="898" y="493" text-anchor="middle" class="sub">Q 循环 · 净转移</text>
 </g>
 <g data-object="cytochrome-c"><text x="1028" y="110" text-anchor="middle" class="label" style="font-size:22px">细胞色素 c</text><text x="1028" y="137" text-anchor="middle" class="sub">膜间隙侧 · 每次 1e⁻</text></g>
 <g data-object="complex-IV">${proteinImage('complex-IV',1061.28,210,.18,1312,1199)}${romanBadge('IV',1166,316)}
  <text x="1278" y="143" text-anchor="middle" class="pump-label">2 H⁺ / 2e⁻</text><text x="1278" y="170" text-anchor="middle" class="tiny pump-total" data-total="IV"></text>
  <text x="1169" y="464" text-anchor="middle" class="label" style="fill:#51877d">复合体 IV</text>
  <text x="1169" y="492" text-anchor="middle" class="sub">氧还原成水</text>
 </g>
 <g data-object="ATP-synthase">${proteinImage('atp-synthase',1337,250.8,.22,1024,1536)}
  <text x="1451" y="124" text-anchor="middle" class="label" style="font-size:26px;fill:#9a745b">ATP 合酶</text><text x="1451" y="155" text-anchor="middle" class="sub">H⁺ 回流 · 旋转催化</text>
  <path class="leader" d="M1561 343H1509"/><text x="1570" y="336" text-anchor="end" class="sub">Fₒ</text>
  <path class="leader" d="M1564 490H1517"/><text x="1570" y="482" text-anchor="end" class="sub">F₁</text>
 </g>
 <g data-object="science-notes"><text id="route-count-note" x="190" y="703" class="tiny">每批 2e⁻</text><text id="shape-note" x="760" y="703" class="tiny">结构为示意；能量变化为定性关系</text></g>
</g>`;}

