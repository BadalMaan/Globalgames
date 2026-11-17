import { useEffect, useRef } from 'react'

declare global { interface Window { THREE?: any } }
type Side = 'blue' | 'red'
type Props = { blueName:string; redName:string; blueImage:string; redImage:string; bluePower:string|null; redPower:string|null; phase:'idle'|'charging'|'collision'|'hit-blue'|'hit-red'|'draw'; eventId:number }

function makeFighter(T:any, color:number, accent:number, side:Side) {
  const root = new T.Group();
  const body = new T.Group(); root.add(body);
  const mat = (c:number, metal=0.35, rough=0.38) => new T.MeshStandardMaterial({color:c, metalness:metal, roughness:rough});
  const main=mat(color,0.62,0.28), trim=mat(accent,0.7,0.23), dark=mat(0x111827,0.35,0.5), skin=mat(side==='blue'?0x9bb9d3:0xd9a68d,0.12,0.65), glow=new T.MeshBasicMaterial({color:accent});
  const sphere=(r:number,m:any,x:number,y:number,z:number, sx=1,sy=1,sz=1)=>{const o=new T.Mesh(new T.SphereGeometry(r,18,14),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);body.add(o);return o};
  const box=(w:number,h:number,d:number,m:any,x:number,y:number,z:number)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);body.add(o);return o};
  const limb=(a:any,b:any,r:number,m:any)=>{const dir=new T.Vector3().subVectors(b,a);const mesh=new T.Mesh(new T.CylinderGeometry(r*.78,r,dir.length(),12),m);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());body.add(mesh);return mesh};
  // stylized armored humanoid with articulated limb groups
  sphere(.34,main,0,1.55,0,.82,1.08,.62); box(.42,.16,.68,trim,0,1.65,.02);
  sphere(.25,skin,0,2.08,0,1,.95,.9); sphere(.28,dark,0,2.16,.02,1.04,.36,.96);
  sphere(.08,glow,-.105,2.13,.235); sphere(.08,glow,.105,2.13,.235);
  // shoulder armor
  sphere(.2,trim,-.43,1.78,0,1.1,.8,1); sphere(.2,trim,.43,1.78,0,1.1,.8,1);
  // legs / boots
  const legs:any[]=[]; for(const x of [-.19,.19]){const g=new T.Group();g.position.set(x,1.18,0);body.add(g);const thigh=new T.Mesh(new T.CylinderGeometry(.13,.16,.52,12),main);thigh.position.y=-.28;g.add(thigh);const knee=new T.Mesh(new T.SphereGeometry(.14,12,10),trim);knee.position.y=-.55;g.add(knee);const shin=new T.Mesh(new T.CylinderGeometry(.1,.13,.48,12),main);shin.position.y=-.79;g.add(shin);const boot=new T.Mesh(new T.BoxGeometry(.27,.16,.42),dark);boot.position.set(0,-1.05,.1);g.add(boot);legs.push(g)}
  // arms
  const arms:any[]=[]; for(const x of [-.48,.48]){const g=new T.Group();g.position.set(x,1.82,0);body.add(g);const upper=new T.Mesh(new T.CylinderGeometry(.105,.14,.42,12),main);upper.position.y=-.22;g.add(upper);const elbow=new T.Mesh(new T.SphereGeometry(.11,12,10),trim);elbow.position.y=-.43;g.add(elbow);const fore=new T.Mesh(new T.CylinderGeometry(.085,.11,.38,12),main);fore.position.y=-.62;g.add(fore);const fist=new T.Mesh(new T.SphereGeometry(.14,14,12),trim);fist.position.set(0,-.84,.05);g.add(fist);arms.push(g)}
  // chest crest + short cape
  const crest=new T.Mesh(new T.OctahedronGeometry(.15),glow);crest.position.set(0,1.57,.34);body.add(crest);
  const cape=new T.Mesh(new T.ConeGeometry(.42,.9,4),mat(accent,.45,.45));cape.position.set(0,1.42,-.38);cape.rotation.x=Math.PI;body.add(cape);
  root.userData={body,arms,legs,cape,crest,side};
  root.scale.setScalar(1.02); root.rotation.y=side==='blue' ? Math.PI*.5 : -Math.PI*.5;
  return root;
}

export default function ThreeDuelScene({blueName,redName,blueImage,redImage,bluePower,redPower,phase,eventId}:Props){
 const host=useRef<HTMLDivElement>(null); const sceneRef=useRef<any>(null); const propsRef=useRef<Props>({blueName,redName,blueImage,redImage,bluePower,redPower,phase,eventId});
 useEffect(()=>{propsRef.current={blueName,redName,blueImage,redImage,bluePower,redPower,phase,eventId}},[blueName,redName,blueImage,redImage,bluePower,redPower,phase,eventId]);
 useEffect(()=>{
  const T=window.THREE, el=host.current; if(!el)return; if(!T){el.textContent='3D ENGINE DID NOT LOAD — refresh the page and check your internet connection.';return;}
  const scene=new T.Scene(); scene.background=new T.Color(0x101a35); scene.fog=new T.Fog(0x101a35,16,42);
  const camera=new T.PerspectiveCamera(38,1,.1,100); camera.position.set(0,5.8,16.8); camera.lookAt(0,1.35,0);
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.outputColorSpace=T.SRGBColorSpace; renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.2; el.appendChild(renderer.domElement);
  scene.add(new T.HemisphereLight(0x9fc9ff,0x20142d,2.1)); const key=new T.DirectionalLight(0xffffff,3.2);key.position.set(-5,10,8);key.castShadow=true;scene.add(key);const blueLight=new T.PointLight(0x168cff,45,12);blueLight.position.set(-4,3,1);scene.add(blueLight);const redLight=new T.PointLight(0xff3d26,45,12);redLight.position.set(4,3,1);scene.add(redLight);
  const floor=new T.Mesh(new T.CircleGeometry(11,80),new T.MeshStandardMaterial({color:0x172b49,metalness:.72,roughness:.32}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
  const ring=(r:number,t:number,color:number,y:number)=>{const m=new T.Mesh(new T.TorusGeometry(r,t,10,100),new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.55,metalness:.7}));m.rotation.x=Math.PI/2;m.position.y=y;scene.add(m)};
  ring(5.1,.055,0x3d9cff,.01);ring(3.4,.035,0x9b62ff,.015);ring(1.3,.025,0xffb44c,.02);
  // distant futuristic skyline
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2, r=13+Math.random()*2,h=2+Math.random()*7;const b=new T.Mesh(new T.BoxGeometry(1.1+Math.random(),h,1.1),new T.MeshStandardMaterial({color:i%2?0x1b2d4b:0x26385a,metalness:.55,roughness:.5}));b.position.set(Math.cos(a)*r,h/2-0.1,Math.sin(a)*r);scene.add(b);}
  const blue=makeFighter(T,0x153d78,0x24a9ff,'blue'),red=makeFighter(T,0x701f30,0xff5a34,'red');blue.position.set(-3.25,0,0);red.position.set(3.25,0,0);scene.add(blue,red);
  const projectileMat=(c:number)=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2.5,metalness:.2,roughness:.18});
  const projectiles:any[]=[]; const addShot=(from:any,to:any,color:number)=>{const g=new T.Group();const core=new T.Mesh(new T.SphereGeometry(.22,18,14),projectileMat(color));g.add(core);const halo=new T.Mesh(new T.SphereGeometry(.38,14,10),new T.MeshBasicMaterial({color,transparent:true,opacity:.24}));g.add(halo);const light=new T.PointLight(color,5,4);g.add(light);g.position.copy(from);scene.add(g);projectiles.push({g,from:from.clone(),to:to.clone(),t:0});};
  const sparks:any[]=[];const burst=(pos:any,color:number)=>{for(let i=0;i<34;i++){const m=new T.Mesh(new T.SphereGeometry(.035+Math.random()*.045,6,6),new T.MeshBasicMaterial({color,transparent:true}));m.position.copy(pos);scene.add(m);sparks.push({m,v:new T.Vector3((Math.random()-.5)*.24,Math.random()*.22,(Math.random()-.5)*.2),life:1});}};
  let lastEvent=-1, start=performance.now(), combatAt=0, hitAt=0, hitLoser:Side|null=null, raf=0; const clock=new T.Clock();
  const resize=()=>{const w=el.clientWidth||800,h=el.clientHeight||440;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const animate=()=>{raf=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),now=performance.now(),p=propsRef.current,t=(now-start)/1000;
   const b=blue.userData,r=red.userData;
   const attackProgress=combatAt?Math.max(0,Math.min(1,(now-combatAt)/1800)):0;const stepIn=Math.sin(attackProgress*Math.PI)*.92;
   [b,r].forEach((u:any,i:number)=>{u.body.position.y=.035+Math.sin(t*2.8+i)*.045;u.body.rotation.z=Math.sin(t*1.7+i)*.025;u.cape.rotation.x=Math.PI+Math.sin(t*3+i)*.13;u.crest.rotation.y=t*1.5;u.arms[0].rotation.x=-.25+Math.sin(t*2+i)*.06-attackProgress*.85;u.arms[1].rotation.x=-.25-Math.sin(t*2+i)*.06-attackProgress*.55;u.legs[0].rotation.x=attackProgress*.45;u.legs[1].rotation.x=-attackProgress*.35;});
   if(hitAt){const hp=Math.max(0,Math.min(1,(now-hitAt)/850));const loser=hitLoser==='blue'?blue:red;loser.userData.body.rotation.z=(hitLoser==='blue'?-1:1)*Math.sin(hp*Math.PI)*.9;loser.userData.body.position.y=.035+Math.sin(t*2.8)*.03+Math.sin(hp*Math.PI)*.3;}
   blue.position.x=-3.25+Math.sin(t*.7)*.08+stepIn;red.position.x=3.25-Math.sin(t*.7)*.08-stepIn;
   if(p.eventId!==lastEvent && p.eventId>0){lastEvent=p.eventId;combatAt=now;hitAt=now+520;const blueWins=p.phase==='hit-red';hitLoser=blueWins?'red':'blue';blue.userData.body.rotation.x=0;red.userData.body.rotation.x=0;
    // both fighters step forward and fire their selected signature powers
    const powerColor=(name:string|null,fallback:number)=>{const n=(name||'').toLowerCase();if(n.includes('fire')||n.includes('inferno')||n.includes('dragon')||n.includes('meteor'))return 0xff5a22;if(n.includes('solar'))return 0xffc52e;if(n.includes('frost')||n.includes('crystal'))return 0x74eaff;if(n.includes('shadow'))return 0xa34dff;if(n.includes('cosmic')||n.includes('star'))return 0xb06cff;if(n.includes('shield'))return 0x52e6a5;if(n.includes('gravity'))return 0xd04cff;return fallback};
    addShot(new T.Vector3(-1.55,1.65,.55),new T.Vector3(0,1.55,.55),powerColor(p.bluePower,0x27aaff));addShot(new T.Vector3(1.55,1.65,.55),new T.Vector3(0,1.55,.55),powerColor(p.redPower,0xff5937));
    if(p.phase==='draw'){} else {const loser=blueWins?red:blue;const winner=blueWins?blue:red;setTimeout(()=>{if(!el.isConnected)return;winner.userData.arms[0].rotation.z=-1.1;loser.userData.body.rotation.z=blueWins?-.95:.95;loser.position.y=.22;},520);setTimeout(()=>{if(!el.isConnected)return;loser.userData.body.rotation.z=0;loser.position.y=0;winner.userData.arms[0].rotation.z=0;},1450);}
   }
   for(let i=projectiles.length-1;i>=0;i--){const q=projectiles[i];q.t+=dt*1.7;q.g.position.lerpVectors(q.from,q.to,Math.min(q.t,1));q.g.scale.setScalar(1+Math.sin(q.t*25)*.18);if(q.t>=1){burst(q.to,i%2?0xff8c45:0x57c7ff);scene.remove(q.g);projectiles.splice(i,1)}}
   for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.life-=dt*1.3;s.m.position.addScaledVector(s.v,dt*12);s.m.scale.setScalar(Math.max(.001,s.life));(s.m.material as any).opacity=Math.max(0,s.life);if(s.life<=0){scene.remove(s.m);sparks.splice(i,1)}}
   camera.position.x=Math.sin(t*.18)*.16;camera.lookAt(0,1.25,0);renderer.render(scene,camera);
  };animate();sceneRef.current={scene,renderer};
  return()=>{cancelAnimationFrame(raf);ro.disconnect();projectiles.forEach(q=>scene.remove(q.g));renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
 },[]);
 return <div className="three-duel-scene"><div className="three-scene-labels"><div className="scene-fighter blue"><span>PLAYER 1</span><b>{blueName}</b><small>{bluePower||'READY'}</small></div><div className="scene-vs">VS</div><div className="scene-fighter red"><span>PLAYER 2</span><b>{redName}</b><small>{redPower||'READY'}</small></div></div><div className="three-canvas-host" ref={host}/><div className="scene-phase">{phase==='idle'?'CHOOSE YOUR POWERS':phase==='charging'?'POWER CHARGING…':phase==='collision'?'SUPERPOWER COLLISION!':phase==='draw'?'BOTH POWERS COLLIDE!':phase==='hit-blue'?`${blueName} TAKES THE HIT!`:`${redName} TAKES THE HIT!`}</div></div>
}
