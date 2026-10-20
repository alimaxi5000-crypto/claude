(()=>{var zt=Math.PI/180,wa=1e-9;var Ut=(n,t)=>[n[0]+t[0],n[1]+t[1],n[2]+t[2]],Ot=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],ue=(n,t)=>[n[0]*t,n[1]*t,n[2]*t],an=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],Pe=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]],Te=n=>Math.hypot(n[0],n[1],n[2]);function Xt(n){let t=Te(n);return t>wa?[n[0]/t,n[1]/t,n[2]/t]:[0,0,0]}var Ea=(n,t,e)=>[n[0]+(t[0]-n[0])*e,n[1]+(t[1]-n[1])*e,n[2]+(t[2]-n[2])*e];var ui=(n,t)=>Ot(n,ue(t,an(n,t)));function Ir(n){let t=Xt(n),e=Math.abs(t[2])<.9?[0,0,1]:[1,0,0];return Xt(Pe(t,e))}var Re=()=>[0,0,0,1];function Rt(n,t){let[e,i,s,r]=n,[a,o,c,h]=t;return[r*a+e*h+i*c-s*o,r*o-e*c+i*h+s*a,r*c+e*o-i*a+s*h,r*h-e*a-i*o-s*c]}var he=n=>[-n[0],-n[1],-n[2],n[3]];function Et(n){let t=Math.hypot(n[0],n[1],n[2],n[3]);return t>wa?[n[0]/t,n[1]/t,n[2]/t,n[3]/t]:[0,0,0,1]}var Dr=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3],Hf=n=>[-n[0],-n[1],-n[2],-n[3]];function de(n,t){let e=Xt(n),i=Math.sin(t/2);return[e[0]*i,e[1]*i,e[2]*i,Math.cos(t/2)]}function kt(n,t){let[e,i,s,r]=n,a=r*t[0]+i*t[2]-s*t[1],o=r*t[1]+s*t[0]-e*t[2],c=r*t[2]+e*t[1]-i*t[0],h=-e*t[0]-i*t[1]-s*t[2];return[a*r+h*-e+o*-s-c*-i,o*r+h*-i+c*-e-a*-s,c*r+h*-s+a*-i-o*-e]}function Vf(n){let t=n[0][0],e=n[1][0],i=n[2][0],s=n[0][1],r=n[1][1],a=n[2][1],o=n[0][2],c=n[1][2],h=n[2][2],l=t+r+h,u,d,p,g;if(l>0){let _=Math.sqrt(l+1)*2;g=.25*_,u=(c-a)/_,d=(i-o)/_,p=(s-e)/_}else if(t>r&&t>h){let _=Math.sqrt(1+t-r-h)*2;g=(c-a)/_,u=.25*_,d=(e+s)/_,p=(i+o)/_}else if(r>h){let _=Math.sqrt(1+r-t-h)*2;g=(i-o)/_,u=(e+s)/_,d=.25*_,p=(a+c)/_}else{let _=Math.sqrt(1+h-t-r)*2;g=(s-e)/_,u=(i+o)/_,d=(a+c)/_,p=.25*_}return Et([u,d,p,g])}function Tn(n,t){let e=Xt(n),i=ui(t,e);Te(i)<1e-6&&(i=Ir(e)),i=Xt(i);let s=Pe(e,i);return Vf([e,i,s])}function Aa(n,t,e){let i=t,s=Dr(n,t);if(s<0&&(i=Hf(t),s=-s),s>.9995)return Et([n[0]+(i[0]-n[0])*e,n[1]+(i[1]-n[1])*e,n[2]+(i[2]-n[2])*e,n[3]+(i[3]-n[3])*e]);let r=Math.acos(s),a=Math.sin(r),o=Math.sin((1-e)*r)/a,c=Math.sin(e*r)/a;return[n[0]*o+i[0]*c,n[1]*o+i[1]*c,n[2]*o+i[2]*c,n[3]*o+i[3]*c]}function as(n,t){let e=Math.abs(Dr(Et(n),Et(t)));return 2*Math.acos(Math.min(1,e))}function Fh(n){let t=Te(n);return t<wa?Re():de(n,t)}function Oh(n,t){let e=ue(t,an([n[0],n[1],n[2]],t));return Et([e[0],e[1],e[2],n[3]])}function di(n){let t=kt(n,[0,1,0]);return Math.atan2(-t[0],t[1])}var Me=(n,t,e)=>n<t?t:n>e?e:n;var kr=n=>n*n*(3-2*n),Gf=n=>n*n*n*(n*(n*6-15)+10);var ki={linear:n=>n,in:n=>n*n,out:n=>1-(1-n)*(1-n),inOut:kr,in3:n=>n*n*n,out3:n=>1-Math.pow(1-n,3),inOut3:Gf,out5:n=>1-Math.pow(1-n,5),in5:n=>Math.pow(n,5),strike:n=>n<.35?.15*(n/.35)**2:.15+.85*(1-Math.pow(1-(n-.35)/.65,4)),back:n=>1+2.70158*Math.pow(n-1,3)+1.70158*Math.pow(n-1,2),elastic:n=>n===0||n===1?n:Math.pow(2,-9*n)*Math.sin((n*10-.75)*(2*Math.PI)/3)+1,hold:()=>0,step:n=>n<1?0:1};var Nt={root:"SKEL_ROOT",pelvis:"SKEL_Pelvis",spineRoot:"SKEL_Spine_Root",spine:["SKEL_Spine0","SKEL_Spine1","SKEL_Spine2","SKEL_Spine3"],neck:"SKEL_Neck_1",head:"SKEL_Head",side:{L:{clav:"SKEL_L_Clavicle",upper:"SKEL_L_UpperArm",lower:"SKEL_L_Forearm",hand:"SKEL_L_Hand",thigh:"SKEL_L_Thigh",calf:"SKEL_L_Calf",foot:"SKEL_L_Foot",toe:"SKEL_L_Toe0",fingers:[["SKEL_L_Finger00","SKEL_L_Finger01","SKEL_L_Finger02"],["SKEL_L_Finger10","SKEL_L_Finger11","SKEL_L_Finger12"],["SKEL_L_Finger20","SKEL_L_Finger21","SKEL_L_Finger22"],["SKEL_L_Finger30","SKEL_L_Finger31","SKEL_L_Finger32"],["SKEL_L_Finger40","SKEL_L_Finger41","SKEL_L_Finger42"]]},R:{clav:"SKEL_R_Clavicle",upper:"SKEL_R_UpperArm",lower:"SKEL_R_Forearm",hand:"SKEL_R_Hand",thigh:"SKEL_R_Thigh",calf:"SKEL_R_Calf",foot:"SKEL_R_Foot",toe:"SKEL_R_Toe0",fingers:[["SKEL_R_Finger00","SKEL_R_Finger01","SKEL_R_Finger02"],["SKEL_R_Finger10","SKEL_R_Finger11","SKEL_R_Finger12"],["SKEL_R_Finger20","SKEL_R_Finger21","SKEL_R_Finger22"],["SKEL_R_Finger30","SKEL_R_Finger31","SKEL_R_Finger32"],["SKEL_R_Finger40","SKEL_R_Finger41","SKEL_R_Finger42"]]}}};var Ur=class{constructor(t){this.id=t.id||"unnamed",this.model=t.model||"",this.source=t.source||"unknown",this.calib=t.calib||{},this.bones=t.bones.map((s,r)=>({index:r,name:s.name,tag:s.tag,parentName:s.parent??null,t:s.t.slice(),r:Et(s.r)})),this.byName=new Map(this.bones.map(s=>[s.name,s])),this.byTag=new Map(this.bones.map(s=>[s.tag,s]));for(let s of this.bones)if(s.parent=s.parentName==null?-1:typeof s.parentName=="number"?s.parentName:this.byName.get(s.parentName)?.index??-1,s.parentName!=null&&s.parent<0)throw new Error(`skeleton ${this.id}: parent '${s.parentName}' of ${s.name} not found`);this.order=[];let e=new Set,i=s=>{e.has(s.index)||(s.parent>=0&&i(this.bones[s.parent]),e.add(s.index),this.order.push(s.index))};this.bones.forEach(i),this.children=this.bones.map(()=>[]);for(let s of this.bones)s.parent>=0&&this.children[s.parent].push(s.index);this.restP=new Array(this.bones.length),this.restQ=new Array(this.bones.length);for(let s of this.order){let r=this.bones[s];r.parent<0?(this.restP[s]=r.t.slice(),this.restQ[s]=r.r.slice()):(this.restP[s]=Ut(this.restP[r.parent],kt(this.restQ[r.parent],r.t)),this.restQ[s]=Et(Rt(this.restQ[r.parent],r.r)))}this.groundZ=this.calib.groundZ??this._inferGroundZ(),this.limbs={};for(let s of["L","R"]){let r=Nt.side[s];this.limbs["arm"+s]=this._limb(s,r.upper,r.lower,r.hand,"arm"),this.limbs["leg"+s]=this._limb(s,r.thigh,r.calf,r.foot,"leg"),this.limbs["hand"+s]=this._handFrame(s)}}has(t){return this.byName.has(t)}idx(t){let e=this.byName.get(t);if(!e)throw new Error(`skeleton ${this.id}: bone '${t}' missing`);return e.index}restPos(t){return this.restP[this.idx(t)]}restRot(t){return this.restQ[this.idx(t)]}len(t,e){return Te(Ot(this.restPos(e),this.restPos(t)))}height(){return this.restPos(Nt.head)[2]+.12-this.groundZ}_inferGroundZ(){let t=1/0;for(let e of["SKEL_L_Toe0","SKEL_R_Toe0","SKEL_L_Foot","SKEL_R_Foot"])this.has(e)&&(t=Math.min(t,this.restPos(e)[2]-(e.includes("Toe")?.025:.085)));return Number.isFinite(t)?t:-1}_limb(t,e,i,s,r){if(!this.has(e)||!this.has(i)||!this.has(s))return null;let a=this.restPos(e),o=this.restPos(i),c=this.restPos(s),h=Xt(Ot(o,a)),l=Xt(Ot(c,o)),u=Te(Ot(o,a)),d=Te(Ot(c,o)),p=null,g=this.calib.hinges?.[e];if(g&&(p=Xt(kt(this.restRot(e),g))),!p){let f=Pe(h,l);Te(f)>Math.sin(3*Math.PI/180)&&(p=Xt(f))}p||(p=Xt(Pe(r==="arm"?[0,-1,0]:[0,1,0],h)),Te(p)<1e-6&&(p=Ir(h)));let _=Xt(ui(p,h)),m=Xt(ui(p,l));return{side:t,kind:r,upper:e,lower:i,end:s,l1:u,l2:d,dirU:h,dirL:l,hingeU:_,hingeL:m}}_handFrame(t){let e=Nt.side[t];if(!this.has(e.hand))return null;let i=this.restPos(e.hand),s=g=>this.has(e.fingers[g][0])?this.restPos(e.fingers[g][0]):null,r=s(1),a=s(2),o=s(4),c=a?Xt(Ot(a,i)):this.limbs["arm"+t]?.dirL??[t==="L"?-1:1,0,0],h=r&&o?Xt(Ot(r,o)):Ir(c);h=Xt(ui(h,c));let l=t==="R"?1:-1,u=ue(Xt(Pe(c,h)),l),d=ue(u,-1),p=Xt(Pe(c,d));return{side:t,fwd:c,across:h,back:u,palm:d,flexAxis:p,wrist:i}}fingerAxis(t,e){let i=this.limbs["hand"+t],s=this.idx(e),r=this.children[s],a=r.length?this.restP[r[0]]:Ut(this.restP[s],Ot(this.restP[s],this.restP[this.bones[s].parent])),o=Xt(Ot(a,this.restP[s])),c=Pe(o,i.palm);return Te(c)<1e-6&&(c=i.flexAxis),Xt(c)}toJSON(){return{id:this.id,model:this.model,source:this.source,calib:this.calib,bones:this.bones.map(t=>({name:t.name,tag:t.tag,parent:t.parentName,t:t.t,r:t.r}))}}};function Bh(n,t){let e=new Array(n.bones.length);for(let i of n.order){let s=n.bones[i].parent;e[i]=s<0?t[i].slice():Et(Rt(he(t[s]),t[i]))}return e}var Wf={SKEL_ROOT:0,SKEL_Pelvis:11816,SKEL_Spine_Root:57597,SKEL_L_Thigh:58271,SKEL_L_Calf:63931,SKEL_L_Foot:14201,SKEL_L_Toe0:2108,SKEL_R_Thigh:51826,SKEL_R_Calf:36864,SKEL_R_Foot:52301,SKEL_R_Toe0:20781,SKEL_Spine0:23553,SKEL_Spine1:24816,SKEL_Spine2:24817,SKEL_Spine3:24818,SKEL_L_Clavicle:64729,SKEL_L_UpperArm:45509,SKEL_L_Forearm:61163,SKEL_L_Hand:18905,SKEL_L_Finger00:26610,SKEL_L_Finger01:4089,SKEL_L_Finger02:4090,SKEL_L_Finger10:26611,SKEL_L_Finger11:4169,SKEL_L_Finger12:4170,SKEL_L_Finger20:26612,SKEL_L_Finger21:4185,SKEL_L_Finger22:4186,SKEL_L_Finger30:26613,SKEL_L_Finger31:4137,SKEL_L_Finger32:4138,SKEL_L_Finger40:26614,SKEL_L_Finger41:4153,SKEL_L_Finger42:4154,SKEL_R_Clavicle:10706,SKEL_R_UpperArm:40269,SKEL_R_Forearm:28252,SKEL_R_Hand:57005,SKEL_R_Finger00:58866,SKEL_R_Finger01:64016,SKEL_R_Finger02:64017,SKEL_R_Finger10:58867,SKEL_R_Finger11:64096,SKEL_R_Finger12:64097,SKEL_R_Finger20:58868,SKEL_R_Finger21:64112,SKEL_R_Finger22:64113,SKEL_R_Finger30:58869,SKEL_R_Finger31:64064,SKEL_R_Finger32:64065,SKEL_R_Finger40:58870,SKEL_R_Finger41:64080,SKEL_R_Finger42:64081,SKEL_Neck_1:39317,SKEL_Head:31086};function Kf(n){let t={},e=(r,a,o)=>{t[r]={parent:a,pos:o}},i=n.scale;e("SKEL_ROOT",null,[0,0,0]),e("SKEL_Pelvis","SKEL_ROOT",[0,0,n.pelvisZ]),e("SKEL_Spine_Root","SKEL_ROOT",[0,0,n.pelvisZ]);let s=[.05,.16,.28,.41].map(r=>r*i+n.pelvisZ);e("SKEL_Spine0","SKEL_Spine_Root",[0,-.005,s[0]]),e("SKEL_Spine1","SKEL_Spine0",[0,-.012,s[1]]),e("SKEL_Spine2","SKEL_Spine1",[0,-.01,s[2]]),e("SKEL_Spine3","SKEL_Spine2",[0,0,s[3]]),e("SKEL_Neck_1","SKEL_Spine3",[0,.012,n.pelvisZ+.545*i]),e("SKEL_Head","SKEL_Neck_1",[0,.022,n.pelvisZ+.645*i]);for(let r of["L","R"]){let a=r==="R"?1:-1,o=[a*n.hipW,0,n.pelvisZ-.06*i],c=o[2]-n.thigh,h=[a*(n.hipW-.005),.012,c],l=[a*(n.hipW-.01),-.01,c-n.shin];e(`SKEL_${r}_Thigh`,"SKEL_Pelvis",o),e(`SKEL_${r}_Calf`,`SKEL_${r}_Thigh`,h),e(`SKEL_${r}_Foot`,`SKEL_${r}_Calf`,l),e(`SKEL_${r}_Toe0`,`SKEL_${r}_Foot`,[l[0]+a*.01,l[1]+n.foot,n.groundZ+.025]);let u=[a*.03,.035,n.pelvisZ+.5*i],d=[a*n.shoulderW,-.005,n.pelvisZ+.475*i],p=n.armDown*zt,g=[a*Math.cos(p),0,-Math.sin(p)],_=Xt(Pe([0,-1,0],g)),m=kt(de(_,6*zt),g),f=Ut(d,ue(g,n.upperArm)),S=Ut(f,ue(m,n.foreArm));e(`SKEL_${r}_Clavicle`,"SKEL_Spine3",u),e(`SKEL_${r}_UpperArm`,`SKEL_${r}_Clavicle`,d),e(`SKEL_${r}_Forearm`,`SKEL_${r}_UpperArm`,f),e(`SKEL_${r}_Hand`,`SKEL_${r}_Forearm`,S);let v=Xt([-a*Math.sin(p),0,-Math.cos(p)]),M=[0,1,0],E=[{k:0,along:.025,acr:.028,pal:.012,segs:[.042,.032,.028],thumb:!0},{k:1,along:.088,acr:.022,pal:0,segs:[.044,.026,.021]},{k:2,along:.092,acr:.003,pal:0,segs:[.048,.03,.022]},{k:3,along:.088,acr:-.016,pal:0,segs:[.044,.028,.021]},{k:4,along:.08,acr:-.032,pal:.002,segs:[.034,.021,.019]}];for(let C of E){let R=n.handScale,P=Ut(S,Ut(ue(m,C.along*R),Ut(ue(M,C.acr*R),ue(v,C.pal*R)))),N=C.thumb?Xt(Ut(ue(m,.55),Ut(ue(M,.75),ue(v,.35)))):m,y=`SKEL_${r}_Hand`;for(let w=0;w<3;w++){let F=`SKEL_${r}_Finger${C.k}${w}`;e(F,y,P),y=F,P=Ut(P,ue(N,C.segs[w]*R))}}}return t}function $f(n,t,e,i,s=()=>[0,0,0,1]){let r=[],a={};for(let[o,c]of Object.entries(e))a[o]=Et(s(o));for(let[o,c]of Object.entries(e)){let h,l;if(!c.parent)h=c.pos.slice(),l=a[o];else{let u=a[c.parent];h=kt(he(u),Ot(c.pos,e[c.parent].pos)),l=Et(Rt(he(u),a[o]))}r.push({name:o,tag:Wf[o],parent:c.parent,t:h.map(u=>+u.toFixed(6)),r:l.map(u=>+u.toFixed(7))})}return{id:n,model:t,source:"placeholder",note:"PLACEHOLDER: approximate proportions, not the GTA rest pose. Replace via animkit import-skeleton.",calib:{groundZ:i},bones:r}}var Js={male:{scale:1,pelvisZ:0,hipW:.095,thigh:.44,shin:.43,foot:.135,shoulderW:.185,upperArm:.29,foreArm:.255,handScale:1,armDown:42,groundZ:-.98},female:{scale:.94,pelvisZ:-.045,hipW:.098,thigh:.415,shin:.405,foot:.12,shoulderW:.165,upperArm:.265,foreArm:.235,handScale:.9,armDown:42,groundZ:-.98}};Js.female.pelvisZ=Js.female.groundZ+.08+.405+.415+.06*.94;Js.male.pelvisZ=Js.male.groundZ+.08+.43+.44+.06;function zh(n,t){let e=Js[n==="female"?"female":"male"],i=Kf(e),s=n==="female"?"mp_f_freemode_01":n==="zombie"?"u_m_y_zombie_01":"mp_m_freemode_01";return $f(`placeholder_${n}`,s,i,e.groundZ,t)}var Xf=n=>n===null?"null":Array.isArray(n)?"array":typeof n=="number"?Number.isInteger(n)?"integer":"number":typeof n,qf=(n,t)=>t==="number"?typeof n=="number"&&Number.isFinite(n):t==="integer"?Number.isInteger(n):Xf(n)===t;function Hh(n,t,{max:e=50}={}){let i=[],s=new Map,r=h=>(s.has(h)||s.set(h,new RegExp(h,"u")),s.get(h)),a=h=>{if(!h.startsWith("#/"))throw new Error(`unsupported $ref ${h}`);return h.slice(2).split("/").reduce((l,u)=>l[u],n)},o=(h,l,u)=>{i.length<e&&i.push({path:h,keyword:l,message:u})},c=(h,l,u)=>{if(!(i.length>=e||h===!0||h==null)){if(h===!1){o(u,"false","not allowed");return}if(h.$ref){c(a(h.$ref),l,u);return}if("const"in h&&l!==h.const){o(u,"const",`must be ${JSON.stringify(h.const)}`);return}if(h.enum&&!h.enum.includes(l)){o(u,"enum",`must be one of ${h.enum.join(", ")}`);return}if(h.type){let d=[].concat(h.type);if(!d.some(p=>qf(l,p))){o(u,"type",`must be ${d.join("|")}`);return}}if(typeof l=="number"&&(h.minimum!=null&&l<h.minimum&&o(u,"minimum",`must be >= ${h.minimum}`),h.maximum!=null&&l>h.maximum&&o(u,"maximum",`must be <= ${h.maximum}`)),typeof l=="string"&&(h.minLength!=null&&l.length<h.minLength&&o(u,"minLength","too short"),h.maxLength!=null&&l.length>h.maxLength&&o(u,"maxLength",`longer than ${h.maxLength}`),h.pattern&&!r(h.pattern).test(l)&&o(u,"pattern",`does not match ${h.pattern}`)),Array.isArray(l)){if(h.minItems!=null&&l.length<h.minItems&&o(u,"minItems",`needs at least ${h.minItems} items`),h.maxItems!=null&&l.length>h.maxItems){o(u,"maxItems",`more than ${h.maxItems} items`);return}h.items&&l.forEach((d,p)=>c(h.items,d,`${u}[${p}]`))}if(l&&typeof l=="object"&&!Array.isArray(l)){let d=Object.keys(l);if(h.minProperties!=null&&d.length<h.minProperties&&o(u,"minProperties",`needs at least ${h.minProperties} entries`),h.maxProperties!=null&&d.length>h.maxProperties){o(u,"maxProperties",`more than ${h.maxProperties} entries`);return}for(let p of h.required||[])p in l||o(u,"required",`missing '${p}'`);for(let p of d){let g=u?`${u}.${p}`:p;h.propertyNames&&c(h.propertyNames,p,`${g} (name)`),h.properties&&p in h.properties?c(h.properties[p],l[p],g):h.additionalProperties===!1?o(g,"additionalProperties","unknown field"):h.additionalProperties&&typeof h.additionalProperties=="object"&&c(h.additionalProperties,l[p],g)}}}};return c(n,t,""),i}var Vh={$schema:"https://json-schema.org/draft/2020-12/schema",$id:"https://jj-scripts.local/schema/jj-anim-1.schema.json",title:"jj-anim/1 clip document",description:"One animation (single actor or pair) as keyframes. Written by the in-game studio (jj_animstudio) and by hand/code; converted by animkit into a GTA V .ycd. See jj_animstudio/docs/FORMAT.md.",type:"object",required:["format","name","type","duration","actors","tracks"],additionalProperties:!1,properties:{format:{const:"jj-anim/1"},name:{$ref:"#/$defs/name"},title:{type:"string",maxLength:80},type:{enum:["single","pair"]},dict:{$ref:"#/$defs/name"},fps:{const:30},duration:{type:"number",minimum:.1,maximum:30},loop:{type:"boolean"},loopMover:{enum:["closed","travel"]},notes:{type:"string",maxLength:4e3},targetResource:{type:"string",pattern:"^[A-Za-z0-9_\\-]{0,64}$"},actors:{type:"object",minProperties:1,maxProperties:2,propertyNames:{$ref:"#/$defs/actorId"},additionalProperties:{$ref:"#/$defs/actor"}},tracks:{type:"object",maxProperties:2,propertyNames:{$ref:"#/$defs/actorId"},additionalProperties:{$ref:"#/$defs/actorTracks"}},contacts:{type:"array",maxItems:16,items:{$ref:"#/$defs/contact"}},events:{type:"array",maxItems:32,items:{$ref:"#/$defs/event"}},limits:{type:"object",maxProperties:32,additionalProperties:{type:"number",minimum:0,maximum:1e5}},editor:{type:"object"}},$defs:{name:{type:"string",pattern:"^[a-z0-9_]{1,40}$"},actorId:{type:"string",pattern:"^[a-z][a-z0-9_]{0,15}$"},num:{type:"number",minimum:-1e3,maximum:1e3},vec3:{type:"array",minItems:3,maxItems:3,items:{$ref:"#/$defs/num"}},time:{type:"number",minimum:0,maximum:30},ease:{enum:["smooth","fastIn","fastOut","linear","spring","step"]},weight:{type:"number",minimum:0,maximum:1},actor:{type:"object",additionalProperties:!1,required:["model"],properties:{model:{type:"string",pattern:"^[a-z0-9_]{1,40}$"},skeleton:{enum:["male","female","zombie"]},label:{type:"string",maxLength:32}}},moverKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},p:{$ref:"#/$defs/vec3"},yaw:{$ref:"#/$defs/num"}}},rootKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},p:{$ref:"#/$defs/vec3"},rot:{$ref:"#/$defs/vec3"}}},boneKey:{type:"object",additionalProperties:!1,required:["t","rot"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},rot:{$ref:"#/$defs/vec3"}}},ikKey:{type:"object",additionalProperties:!1,required:["t","target"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},target:{$ref:"#/$defs/vec3"},space:{enum:["body","scene"]},pole:{$ref:"#/$defs/vec3"},weight:{$ref:"#/$defs/weight"},yaw:{$ref:"#/$defs/num"},pitch:{$ref:"#/$defs/num"},roll:{$ref:"#/$defs/num"}}},fingerKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},preset:{enum:["relaxed","fist","open","grab","point","claw"]},curl:{type:"number",minimum:0,maximum:1.5},spread:{type:"number",minimum:-1,maximum:1}}},lookKey:{type:"object",additionalProperties:!1,required:["t","target"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},target:{$ref:"#/$defs/vec3"},space:{enum:["body","scene"]},weight:{$ref:"#/$defs/weight"}}},range:{type:"array",minItems:2,maxItems:2,items:{$ref:"#/$defs/time"}},actorTracks:{type:"object",additionalProperties:!1,properties:{mover:{type:"array",maxItems:600,items:{$ref:"#/$defs/moverKey"}},root:{type:"array",maxItems:600,items:{$ref:"#/$defs/rootKey"}},bones:{type:"object",maxProperties:80,propertyNames:{type:"string",pattern:"^SKEL_[A-Za-z0-9_]{1,30}$"},additionalProperties:{type:"array",maxItems:600,items:{$ref:"#/$defs/boneKey"}}},ik:{type:"object",additionalProperties:!1,properties:{handL:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},handR:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},footL:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},footR:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}}}},fingers:{type:"object",additionalProperties:!1,properties:{L:{type:"array",maxItems:600,items:{$ref:"#/$defs/fingerKey"}},R:{type:"array",maxItems:600,items:{$ref:"#/$defs/fingerKey"}}}},look:{type:"array",maxItems:600,items:{$ref:"#/$defs/lookKey"}},feet:{type:"object",additionalProperties:!1,properties:{lock:{type:"object",additionalProperties:!1,properties:{L:{type:"array",maxItems:32,items:{$ref:"#/$defs/range"}},R:{type:"array",maxItems:32,items:{$ref:"#/$defs/range"}}}}}}}},endpoint:{type:"string",pattern:"^[a-z][a-z0-9_]{0,15}\\.(handL|handR|footL|footR|head|pelvis|SKEL_[A-Za-z0-9_]{1,30})$"},contact:{type:"object",additionalProperties:!1,required:["from","to","t"],properties:{id:{type:"string",pattern:"^[a-z0-9_]{1,24}$"},from:{$ref:"#/$defs/endpoint"},to:{$ref:"#/$defs/endpoint"},offset:{$ref:"#/$defs/vec3"},t:{$ref:"#/$defs/range"},stick:{type:"boolean"},max:{type:"number",minimum:.001,maximum:.5}}},event:{type:"object",additionalProperties:!1,required:["name","t"],properties:{name:{type:"string",pattern:"^[a-z0-9_]{1,24}$"},t:{$ref:"#/$defs/time"},duration:{type:"number",minimum:0,maximum:30}}}}};var Ta="jj-anim/1",Gh=30,My=2*1024*1024;var cn={handL:"SKEL_L_Hand",handR:"SKEL_R_Hand",footL:"SKEL_L_Foot",footR:"SKEL_R_Foot",head:"SKEL_Head",pelvis:"SKEL_Pelvis"},Zf=["handL","handR","footL","footR"];var jf={json_invalid:n=>`Die Datei ist kein g\xFCltiges JSON (${n}).`,too_large:n=>`Das Projekt ist zu gro\xDF (${n}). Erlaubt sind h\xF6chstens 2 MB.`,version_unsupported:n=>`Unbekannte Format-Version "${n}". Erwartet wird "${Ta}".`,schema:n=>`Ung\xFCltiger Eintrag: ${n}.`,name_invalid:n=>`Ung\xFCltiger Name "${n}". Erlaubt sind nur Kleinbuchstaben, Ziffern und _ (h\xF6chstens 40 Zeichen).`,actor_count:n=>`Falsche Anzahl Akteure: ${n}.`,actor_unknown:n=>`Spur f\xFCr unbekannten Akteur "${n}".`,unknown_bone:n=>`Unbekannter Knochen "${n}" (gibt es im Skelett nicht).`,time_range:n=>`Zeitpunkt au\xDFerhalb der Animation: ${n}.`,duplicate_key:n=>`Zwei Keyframes zur selben Zeit: ${n}.`,contact_invalid:n=>`Ung\xFCltiger Kontakt: ${n}.`,range_invalid:n=>`Ung\xFCltiger Bereich: ${n}.`};function Ie(n,t,e){return{code:n,path:t,msg:(jf[n]||(i=>i))(e)}}function Wh(n){if(!n||typeof n!="object"||Array.isArray(n))return{errors:[Ie("schema","","Dokument muss ein Objekt sein")]};let t=[],e=JSON.parse(JSON.stringify(n));if(e.format!==Ta)return{errors:[Ie("version_unsupported","format",String(e.format??"(fehlt)").slice(0,40))]};e.fps==null&&(e.fps=Gh),e.loop==null&&(e.loop=!1),e.type==null&&e.actors&&typeof e.actors=="object"&&(e.type=Object.keys(e.actors).length>1?"pair":"single",t.push("type"));for(let i of Object.values(e.tracks&&typeof e.tracks=="object"?e.tracks:{}))if(!(!i||typeof i!="object")&&(i.lookAt&&!i.look&&(i.look=i.lookAt,delete i.lookAt,t.push("lookAt -> look")),i.feet&&Array.isArray(i.feet.lock))){let s=i.feet.lock;i.feet.lock={L:s.map(r=>r.slice()),R:s.map(r=>r.slice())},t.push("feet.lock -> {L,R}")}for(let i of Object.values(e.actors&&typeof e.actors=="object"?e.actors:{}))i&&!i.model&&typeof i.skeleton=="string"&&/_/.test(i.skeleton)&&(i.model=i.skeleton,delete i.skeleton,t.push("actor.skeleton(model) -> model"));return{doc:e,migrated:t}}var Jf=n=>typeof n=="number"&&Number.isFinite(n);function Kh(n,{skeletonsFor:t=null}={}){let e=[];for(let o of Hh(Vh,n))o.path==="name"||/\.name$/.test(o.path)&&o.keyword==="pattern"?e.push(Ie("name_invalid",o.path,String(Qf(n,o.path)).slice(0,60))):e.push(Ie("schema",o.path,`${o.path||"Dokument"}: ${o.message}`));if(e.length)return e;let i=Object.keys(n.actors);n.type==="single"&&i.length!==1&&e.push(Ie("actor_count","actors",`Einzel-Animation braucht genau 1 Akteur, hat ${i.length}`)),n.type==="pair"&&i.length!==2&&e.push(Ie("actor_count","actors",`Paar-Animation braucht genau 2 Akteure, hat ${i.length}`));let s=n.duration+1e-6,r=(o,c)=>{(!Jf(o)||o<0||o>s)&&e.push(Ie("time_range",c,`${c} = ${o} s (Dauer ${n.duration} s)`))},a=(o,c)=>{let h=new Set;(o||[]).forEach((l,u)=>{r(l.t,`${c}[${u}].t`);let d=Math.round(l.t*1e3);h.has(d)&&e.push(Ie("duplicate_key",`${c}[${u}]`,`${c} bei ${l.t.toFixed(3)} s`)),h.add(d)})};for(let[o,c]of Object.entries(n.tracks)){if(!n.actors[o]){e.push(Ie("actor_unknown",`tracks.${o}`,o));continue}let h=t?t(o):null;a(c.mover,`tracks.${o}.mover`),a(c.root,`tracks.${o}.root`),a(c.look,`tracks.${o}.look`);for(let[l,u]of Object.entries(c.bones||{}))l==="SKEL_ROOT"?e.push(Ie("schema",`tracks.${o}.bones.SKEL_ROOT`,'SKEL_ROOT wird \xFCber die Spur "root" gedreht')):h&&!h.has(l)&&e.push(Ie("unknown_bone",`tracks.${o}.bones.${l}`,l)),a(u,`tracks.${o}.bones.${l}`);for(let[l,u]of Object.entries(c.ik||{}))a(u,`tracks.${o}.ik.${l}`);for(let[l,u]of Object.entries(c.fingers||{}))a(u,`tracks.${o}.fingers.${l}`);for(let[l,u]of Object.entries(c.feet?.lock||{})){let d=u.slice().sort((p,g)=>p[0]-g[0]);d.forEach((p,g)=>{r(p[0],`tracks.${o}.feet.lock.${l}[${g}]`),r(p[1],`tracks.${o}.feet.lock.${l}[${g}]`),p[1]>p[0]||e.push(Ie("range_invalid",`tracks.${o}.feet.lock.${l}[${g}]`,`Fu\xDF ${l}: Ende muss nach dem Anfang liegen`)),g>0&&p[0]<d[g-1][1]&&e.push(Ie("range_invalid",`tracks.${o}.feet.lock.${l}`,`Fu\xDF ${l}: Bereiche \xFCberlappen`))})}}return(n.contacts||[]).forEach((o,c)=>{let h=`contacts[${c}]`,[l,u]=o.from.split("."),[d,p]=o.to.split(".");n.actors[l]||e.push(Ie("contact_invalid",h,`unbekannter Akteur "${l}"`)),n.actors[d]||e.push(Ie("contact_invalid",h,`unbekannter Akteur "${d}"`)),o.from===o.to&&e.push(Ie("contact_invalid",h,"Start und Ziel sind gleich")),o.stick&&!Zf.includes(u)&&e.push(Ie("contact_invalid",h,"festkleben geht nur mit einer Hand oder einem Fu\xDF als Start"));for(let[g,_]of[[l,u],[d,p]]){let m=t&&n.actors[g]?t(g):null,f=cn[_]||_;m&&!m.has(f)&&e.push(Ie("unknown_bone",h,f))}r(o.t[0],`${h}.t`),r(o.t[1],`${h}.t`),o.t[1]>o.t[0]||e.push(Ie("range_invalid",`${h}.t`,"Kontakt: Ende muss nach dem Anfang liegen"))}),(n.events||[]).forEach((o,c)=>r(o.t,`events[${c}].t`)),e}function Qf(n,t){return t.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean).reduce((e,i)=>e==null?e:e[i],n)}function zn(n){let t=n.indexOf("."),e=n.slice(0,t),i=n.slice(t+1);return{actor:e,handle:i,bone:cn[i]||i}}function $h({name:n,type:t="single",duration:e=2,models:i={}}={}){let s=t==="pair"?{a:{model:i.a||"mp_m_freemode_01",label:"Akteur A"},b:{model:i.b||"mp_m_freemode_01",label:"Akteur B"}}:{a:{model:i.a||"mp_m_freemode_01",label:"Akteur A"}},r={a:{mover:[{t:0,p:[0,0,0],yaw:0}]}};return t==="pair"&&(r.b={mover:[{t:0,p:[0,.9,0],yaw:180}]}),{format:Ta,name:n,type:t,fps:Gh,duration:e,loop:!1,actors:s,tracks:r,contacts:[],events:[],notes:""}}var tp=[1,0,0],ep=[0,1,0],np=[0,0,1],ip=n=>[n[0],-n[1],-n[2]],Nr={SKEL_ROOT:null,SKEL_Pelvis:[[-30,30],[-30,30],[-40,40]],SKEL_Spine_Root:[[-25,35],[-20,20],[-25,25]],SKEL_Spine0:[[-25,35],[-20,20],[-25,25]],SKEL_Spine1:[[-25,35],[-20,20],[-25,25]],SKEL_Spine2:[[-25,35],[-20,20],[-25,25]],SKEL_Spine3:[[-25,35],[-20,20],[-25,25]],SKEL_Neck_1:[[-45,45],[-30,30],[-45,45]],SKEL_Neck_2:[[-30,30],[-20,20],[-30,30]],SKEL_Head:[[-45,45],[-35,35],[-60,60]],clav:[[-15,15],[-20,20],[-25,25]],upper:[[-120,120],[-110,110],[-110,110]],lower:[[-5,150],[-85,85],[-8,8]],hand:[[-80,80],[-60,60],[-35,35]],thigh:[[-35,125],[-50,25],[-45,45]],calf:[[-3,150],[-20,20],[-5,5]],foot:[[-50,50],[-30,30],[-35,35]],toe:[[-60,40],[-5,5],[-5,5]],finger:[[-20,110],[-15,15],[-25,25]],thumb:[[-30,90],[-40,40],[-40,40]]},Fr={centre:["Nicken","Kippen","Drehen"],limb:["Heben vor/zur\xFCck","Kippen","Drehen"],hinge:["Beugen","Verdrehen","Seitlich"],hand:["Beugen","Verdrehen","Abknicken"],finger:["Kr\xFCmmen","Verdrehen","Spreizen"]};function Ui(n){let t=/^SKEL_([LR])_/.exec(n);return t?t[1]:null}function Or(n){let t=Ui(n);return t?n.replace(`SKEL_${t}_`,`SKEL_${t==="L"?"R":"L"}_`):n}function Yh(n){if(/Finger0\d$/.test(n))return"thumb";if(/Finger\d\d$/.test(n))return"finger";let t=/^SKEL_[LR]_(\w+)$/.exec(n);return t&&{Clavicle:"clav",UpperArm:"upper",Forearm:"lower",Hand:"hand",Thigh:"thigh",Calf:"calf",Foot:"foot",Toe0:"toe"}[t[1]]||"centre"}function Xh(n,t){let e=Yh(t);if(e==="lower"||e==="calf"){let i=n.limbs[e==="lower"?"armR":"legR"];if(i){let s=i.hingeL,r=i.dirL;return{kind:"hinge",axes:[s,r,Xt(Pe(s,r))]}}}if(e==="hand"){let i=n.limbs.handR;if(i)return{kind:"hand",axes:[i.flexAxis,i.fwd,i.back]}}if((e==="finger"||e==="thumb")&&n.limbs.handR&&n.has(t)){let i=n.fingerAxis("R",t),s=n.idx(t),r=n.children[s],a=r.length?n.restP[r[0]]:Ot(ue(n.restP[s],2),n.restP[n.bones[s].parent]),o=Xt(Ot(a,n.restP[s]));return o=Xt(Ot(o,ue(i,an(o,i)))),{kind:"finger",axes:[i,o,Xt(Pe(i,o))]}}return{kind:e==="centre"?"centre":"limb",axes:[tp,ep,np]}}var qh=new WeakMap;function Ni(n,t){let e=qh.get(n);if(e||(e=new Map,qh.set(n,e)),e.has(t))return e.get(t);let i=Ui(t),s=i==="L"?Or(t):t,r=n.has(s)?Xh(n,s):Xh(n,t);i==="L"&&(r={kind:r.kind,axes:r.axes.map(ip)});let a=Yh(t),o=a==="centre"?t in Nr?Nr[t]:Nr.SKEL_Spine2:Nr[a],c={...r,limits:o||null,labels:Fr[r.kind]||Fr.centre};return e.set(t,c),c}function Ra(n,t,e){let{axes:i}=Ni(n,t),s=[0,0,0];for(let r=0;r<3;r++)for(let a=0;a<3;a++)s[a]+=i[r][a]*(e[r]||0)*zt;return Fh(s)}function Qs(n,t,e){let{limits:i}=Ni(n,t);if(!i)return{rot:e.slice(),clamped:!1};let s=!1;return{rot:e.map((a,o)=>{let c=Me(a,i[o][0],i[o][1]);return Math.abs(c-a)>1e-6&&(s=!0),c}),clamped:s}}function Zh(n,t,e){let{limits:i}=Ni(n,t);if(!i)return 0;let s=0;for(let r=0;r<3;r++)s=Math.max(s,i[r][0]-e[r],e[r]-i[r][1]);return Math.max(0,s)}function Br(n,t){return Ui(n)?t.slice():[t[0],-t[1],-t[2]]}function jh(n){let t=[Nt.root,Nt.pelvis,Nt.spineRoot,...Nt.spine,Nt.neck,"SKEL_Neck_2",Nt.head];for(let e of["L","R"]){let i=Nt.side[e];t.push(i.clav,i.upper,i.lower,i.hand,i.thigh,i.calf,i.foot,i.toe,...i.fingers.flat())}return t.filter(e=>n.has(e))}var sp=n=>JSON.parse(JSON.stringify(n)),tr=n=>+(+n).toFixed(3);function rp(n){let t=n.map(i=>i.slice()).sort((i,s)=>i[0]-s[0]),e=[];for(let i of t)e.length&&i[0]<=e[e.length-1][1]+1e-6?e[e.length-1][1]=Math.max(e[e.length-1][1],i[1]):e.push(i);return e}function Ca(n,t){let e=n.findIndex(i=>Math.abs(i.t-t.t)<.001);return e>=0?n[e]={...n[e],...t}:(n.push(t),n.sort((i,s)=>i.t-s.t)),n}function Jh(n,t){let e=n.slice().sort((l,u)=>l.t-u.t);if(!e.length)return{p:[0,0,0],rot:[0,0,0]};let i=e[0],s=e[0];if(t>=e[e.length-1].t)i=s=e[e.length-1];else for(let l=1;l<e.length;l++)if(t<=e[l].t){i=e[l-1],s=e[l];break}let r=s.t>i.t?Me((t-i.t)/(s.t-i.t),0,1):0,a=i.p||[0,0,0],o=s.p||a,c=i.rot||[0,0,0],h=s.rot||c;return{p:a.map((l,u)=>l+(o[u]-l)*r),rot:c.map((l,u)=>l+(h[u]-l)*r)}}function op(n,t){let e=n.skeletons[t],i=["L","R"].map(s=>({a:e.idx(Nt.side[s].foot),t:e.has(Nt.side[s].toe)?e.idx(Nt.side[s].toe):-1}));return n.frames[t].map(s=>{let r=e.groundZ+s.mover.p[2],a=0;for(let o of i)a=Math.max(a,-(s.world.P[o.a][2]-(r+.085))),o.t>=0&&(a=Math.max(a,-(s.world.P[o.t][2]-(r+.025))));return a})}function Qh(n,t,{sampled:e}={}){let i=sp(n),s=t.actor?i.tracks[t.actor]||={}:null;switch(t.kind){case"lockFeet":{s.feet||={},s.feet.lock||={};let r=[Me(tr(t.range[0]),0,i.duration),Me(tr(t.range[1]),0,i.duration)];r[1]-r[0]<.05&&(r[1]=Math.min(i.duration,r[0]+.1));for(let a of t.side==="both"?["L","R"]:[t.side])s.feet.lock[a]=rp([...s.feet.lock[a]||[],r]);return i}case"snapGround":{let r="foot"+t.side,a=e?.skeletons?.[t.actor],o=(a?a.groundZ:-.993)+.085;if(s.ik?.[r]?.length){for(let f of s.ik[r])(f.space||"body")==="body"&&f.target[2]<o&&(f.target[2]=+o.toFixed(4));return i}let c=e?op(e,t.actor):[];s.root||=[];let h=f=>Jh(s.root,f),l=f=>Math.max(0,Math.min(c.length-1,Math.round(f*30))),u=.004;if(!c.length){let f=Me(t.t??0,0,i.duration),S=h(f);return Ca(s.root,{t:tr(f),p:[S.p[0],S.p[1],+(S.p[2]+(t.depth||0)+u).toFixed(4)],rot:S.rot}),i}let d=0;for(let f=1;f<c.length;f++)c[f]>c[d]&&(d=f);let p=c.map(f=>f>.002);if(!s.root.length){let f=d,S=d;for(;f>0&&p[f-1];)f--;for(;S<c.length-1&&p[S+1];)S++;let v=Math.max(0,f-3)/30,M=Math.min(c.length-1,S+3)/30;for(let E of[v,M])Ca(s.root,{t:tr(E),p:[0,0,0],rot:[0,0,0]})}let g=s.root.map(f=>({...f,p:(f.p||[0,0,0]).slice()})),_=d/30,m=Jh(g,_);for(let f of s.root){let S=c[l(f.t)];S>.001&&(f.p=[(f.p||[0,0,0])[0],(f.p||[0,0,0])[1],+((f.p||[0,0,0])[2]+S+u).toFixed(4)])}return s.root.some(f=>Math.abs(f.t-_)<.05)||Ca(s.root,{t:tr(_),p:[m.p[0],m.p[1],+(m.p[2]+c[d]+u).toFixed(4)],rot:m.rot}),i}case"clampJoints":{let r=e?.skeletons?.[t.actor];if(!r)return i;for(let[a,o]of Object.entries(s.bones||{}))if(!(t.bone&&t.bone!==a&&t.all!==!0)&&r.has(a))for(let c of o)c.rot=Qs(r,a,c.rot).rot.map(h=>+h.toFixed(2));return i}case"easeSmooth":{let r=o=>Math.abs(o.t-t.t)<=.35,a=o=>{for(let c of o||[])r(c)&&(c.ease="smooth")};a(s.mover),a(s.root),a(s.look);for(let o of Object.values(s.bones||{}))a(o);for(let o of Object.values(s.ik||{}))a(o);for(let o of Object.values(s.fingers||{}))a(o);return i}case"separate":{let r=Object.keys(i.actors).find(c=>c!==t.actor),a=[0,1,0];if(e&&r){let c=Math.round((t.t||0)*30),h=e.frames[t.actor][c].world.P[e.skeletons[t.actor].idx(Nt.pelvis)],l=e.frames[r][c].world.P[e.skeletons[r].idx(Nt.pelvis)],u=[h[0]-l[0],h[1]-l[1],0],d=Math.hypot(u[0],u[1]);d>1e-4&&(a=[u[0]/d,u[1]/d,0])}let o=t.dist||.02;s.mover||=[{t:0,p:[0,0,0],yaw:0}];for(let c of s.mover){let h=c.p||[0,0,0];c.p=[+(h[0]+a[0]*o).toFixed(4),+(h[1]+a[1]*o).toFixed(4),h[2]]}return i}case"zeroStart":{let r=(s.mover||[]).slice().sort((l,u)=>l.t-u.t);if(!r.length)return i;let a=r[0].p||[0,0,0],o=r[0].yaw||0,c=Math.cos(-o*Math.PI/180),h=Math.sin(-o*Math.PI/180);for(let l of s.mover){let u=l.p||[0,0,0],d=u[0]-a[0],p=u[1]-a[1];l.p=[+(d*c-p*h).toFixed(4),+(d*h+p*c).toFixed(4),+(u[2]-a[2]).toFixed(4)],l.yaw=+((l.yaw||0)-o).toFixed(2)}return i}case"stick":return i.contacts?.[t.index]&&(i.contacts[t.index].stick=!0),i;case"closeLoop":{let r=o=>o&&o.length>1?o.filter(c=>c.t<i.duration-.001):o;(i.loopMover||"closed")==="closed"&&(s.mover=r(s.mover)),s.root=r(s.root),s.look=r(s.look);for(let o of Object.keys(s.bones||{}))s.bones[o]=r(s.bones[o]);for(let o of Object.keys(s.ik||{}))s.ik[o]=r(s.ik[o]);for(let o of Object.keys(s.fingers||{}))s.fingers[o]=r(s.fingers[o]);return i.loop=!0,i}default:return i}}var ap=[1,0,0],er=[0,1,0],Fi=[0,0,1];function Hn(n){if(!n)return Re();let t=n.bend||0,e=n.side||0,i=n.twist||0;return Et(Rt(de(Fi,i),Rt(de(ap,-t),de(er,e))))}var zr={SKEL_Spine_Root:.08,SKEL_Spine0:.2,SKEL_Spine1:.26,SKEL_Spine2:.26,SKEL_Spine3:.2},Hr={SKEL_Spine2:.45,SKEL_Spine3:.55};function Vr(n,t){return n?{bend:(n.bend||0)*t,side:(n.side||0)*t,twist:(n.twist||0)*t}:null}function La(n,t){return n?t?{bend:(n.bend||0)+(t.bend||0),side:(n.side||0)+(t.side||0),twist:(n.twist||0)+(t.twist||0)}:n:t}var fi=class{constructor(t){this.skel=t;let e=t;this.n=e.bones.length;let i=a=>e.has(a),s=0;for(let a of Object.keys(zr))i(a)&&(s+=zr[a]);this.spineW=new Map(Object.keys(zr).filter(i).map(a=>[a,zr[a]/s]));let r=0;for(let a of Object.keys(Hr))i(a)&&(r+=Hr[a]);this.chestW=new Map(Object.keys(Hr).filter(i).map(a=>[a,Hr[a]/(r||1)])),this.side={};for(let a of["L","R"]){let o=Nt.side[a],c=o.fingers.map(h=>h.filter(i).map(l=>({name:l,i:e.idx(l),axis:e.fingerAxis(a,l)})));this.side[a]={S:o,arm:e.limbs["arm"+a],leg:e.limbs["leg"+a],hand:e.limbs["hand"+a],fingers:c,clavI:i(o.clav)?e.idx(o.clav):-1,upperI:e.idx(o.upper),lowerI:e.idx(o.lower),handI:e.idx(o.hand),thighI:e.idx(o.thigh),calfI:e.idx(o.calf),footI:e.idx(o.foot),toeI:i(o.toe)?e.idx(o.toe):-1}}this.rootI=e.idx(Nt.root),this.neckI=i(Nt.neck)?e.idx(Nt.neck):-1,this.headI=e.idx(Nt.head),this.role=new Array(this.n).fill(null);for(let[a]of this.spineW)this.role[e.idx(a)]="spine";i(Nt.pelvis)&&(this.role[e.idx(Nt.pelvis)]="pelvis"),this.neckI>=0&&(this.role[this.neckI]="neck"),i("SKEL_Neck_2")&&(this.role[e.idx("SKEL_Neck_2")]="neck2"),this.role[this.headI]="head";for(let a of["L","R"]){let o=this.side[a];o.clavI>=0&&(this.role[o.clavI]="clav"+a),this.role[o.upperI]="upper"+a,this.role[o.lowerI]="lower"+a,this.role[o.handI]="hand"+a,this.role[o.thighI]="thigh"+a,this.role[o.calfI]="calf"+a,this.role[o.footI]="foot"+a,o.toeI>=0&&(this.role[o.toeI]="toe"+a),o.fingers.forEach((c,h)=>c.forEach((l,u)=>{this.role[l.i]=`finger${a}${h}${u}`}))}}solve(t={}){if(t.rootReach&&(t.rootReach.weight??1)>0){let e=t.rootReach,i=this._solve(t),s=this.skel.idx(e.bone),r=Et(Rt(i.mover.q,i.D[s])),a=Ut(Ut(i.mover.p,kt(i.mover.q,i.P[s])),kt(r,e.offset||[0,0,0])),o=ue(Ot(e.target,a),e.weight??1);e.axes&&(o=[o[0]*e.axes[0],o[1]*e.axes[1],o[2]*e.axes[2]]);let c=Te(o),h=e.max??.25;c>h&&(o=ue(o,h/c));let l=kt(he(i.mover.q),o),u=t.root||{},d=u.p||[0,0,0],p=this._solve({...t,root:{...u,p:Ut(d,l)}});return p.reachOffset=o,p}return this._solve(t)}_solve(t){let e=this.skel;this.fades=[];let i=new Array(this.n),s=new Array(this.n),r=new Array(this.n),a={p:t.mover?.p?t.mover.p.slice():[0,0,0],q:de(Fi,t.mover?.yaw||0)},o=he(a.q),c=v=>kt(o,Ot(v,a.p)),h=v=>kt(o,v),l=t.spine||null,u=t.chest||null,d=t.neck||null,p=t.head||null,g={},_=t.bones||null,m=v=>_&&_[v]||null,f=(v,M,E)=>E>=1?M:E<=0?v:Aa(v,M,E);for(let v of e.order){let M=e.bones[v],E=this.role[v],C=M.parent>=0?r[M.parent]:Re(),R;if(v===this.rootI){r[v]=Hn(t.root),m(M.name)&&(r[v]=Et(Rt(r[v],m(M.name))));let N=t.root?.p||[0,0,0];i[v]=Ut(M.t,N),s[v]=Et(Rt(r[v],e.restQ[v]));continue}if(i[v]=Ut(i[M.parent],kt(s[M.parent],M.t)),E==="spine"){let N=this.spineW.get(M.name)||0,y=this.chestW.get(M.name)||0;R=Hn(La(Vr(l,N),Vr(u,y)))}else if(E==="pelvis")R=Hn(t.pelvis);else if(E==="neck"||E==="neck2"||E==="head"){if(E==="neck"&&t.look&&t.look.target){let N=Ut(a.p,kt(a.q,i[v])),y=Ot(t.look.target,N),w=h(y),F=kt(he(C),w),B=Math.atan2(-F[0],F[1]),K=Me(B,-80*zt,80*zt),tt=Me(Math.atan2(F[2],Math.hypot(F[0],F[1])),-55*zt,45*zt),W=(t.look.weight??1)*Me((165*zt-Math.abs(B))/(45*zt),0,1),it={bend:-tt*W,twist:K*W,side:0};d=La(d,Vr(it,.45)),p=La(p,Vr(it,.55))}R=E==="head"?Hn(p):E==="neck"?Hn(d):Re()}else if(E&&E.startsWith("clav")){let N=E.slice(4),y=t.clav?.[N];if(y){let w=N==="R"?1:-1;R=Rt(de(er,-w*(y.up||0)),de(Fi,w*(y.fwd||0)))}else R=Re()}else if(E&&E.startsWith("upper")){let N=E.slice(5),y=t.arm?.[N];if(y&&y.target&&(y.weight??1)>0){this._solveArm(N,y,i,C,a,c,h,g);let w=g["_w"+N]=y.weight??1,F=w<1?this._fkD(C,y?.fk?Hn(y.fk.shoulder):Re(),m(M.name)):null;r[v]=f(F,g["upper"+N],w),s[v]=Et(Rt(r[v],e.restQ[v]));continue}R=y?.fk?Hn(y.fk.shoulder):Re()}else if(E&&E.startsWith("lower")){let N=E.slice(5),y=t.arm?.[N],w=this.side[N].arm;if(g["lower"+N]){let F=g["_w"+N],B=F<1?this._fkD(C,y?.fk?.elbow?de(w.hingeL,y.fk.elbow):Re(),m(M.name)):null;r[v]=f(B,g["lower"+N],F),s[v]=Et(Rt(r[v],e.restQ[v]));continue}R=y?.fk?.elbow?de(w.hingeL,y.fk.elbow):Re()}else if(E&&E.startsWith("hand")){let N=E.slice(4);r[v]=this._handDelta(N,t.arm?.[N],C,a),m(M.name)&&(r[v]=Et(Rt(r[v],m(M.name)))),s[v]=Et(Rt(r[v],e.restQ[v]));continue}else if(E&&E.startsWith("thigh")){let N=E.slice(5),y=t.leg?.[N];if(y&&y.target&&(y.weight??1)>0){this._solveLeg(N,y,i,C,a,c,g);let w=g["_lw"+N]=y.weight??1,F=w<1?this._fkD(C,y?.fk?Hn(y.fk.hip):Re(),m(M.name)):null;r[v]=f(F,g["thigh"+N],w),s[v]=Et(Rt(r[v],e.restQ[v]));continue}R=y?.fk?Hn(y.fk.hip):Re()}else if(E&&E.startsWith("calf")){let N=E.slice(4),y=t.leg?.[N];if(g["calf"+N]){let w=g["_lw"+N],F=w<1?this._fkD(C,y?.fk?.knee?de(this.side[N].leg.hingeL,y.fk.knee):Re(),m(M.name)):null;r[v]=f(F,g["calf"+N],w),s[v]=Et(Rt(r[v],e.restQ[v]));continue}R=y?.fk?.knee?de(this.side[N].leg.hingeL,y.fk.knee):Re()}else if(E&&E.startsWith("foot")){let N=E.slice(4),y=t.leg?.[N];if(y&&(y.target||y.foot)&&(y.weight??1)>0){let w=y.weight??1;r[v]=f(w<1?this._fkD(C,Re(),m(M.name)):null,this._footDelta(N,y,C,a),w),s[v]=Et(Rt(r[v],e.restQ[v]));continue}R=Re()}else if(E&&E.startsWith("toe")){let N=E.slice(3),y=t.leg?.[N]?.toe||0,w=Xt(Pe(this._footFwdRest(N),Fi));R=de(w,y)}else E&&E.startsWith("finger")?R=this._fingerDelta(E,t.arm?.[E[6]]?.fingers):R=Re();let P=m(M.name);r[v]=Et(Rt(C,P?Rt(R,P):R)),s[v]=Et(Rt(r[v],e.restQ[v]))}let S=Bh(e,s);return{mover:a,rootT:i[this.rootI].slice(),P:i,Q:s,D:r,local:S,fades:this.fades}}_fkD(t,e,i){return Et(Rt(t,i?Rt(e,i):e))}_footFwdRest(t){let e=this.side[t];if(e.toeI<0)return er;let i=Ot(this.skel.restP[e.toeI],this.skel.restP[e.footI]);return Xt([i[0],i[1],0])}_solveArm(t,e,i,s,r,a,o,c){let h=this.side[t],l=h.arm,u=i[h.upperI],d=(v,M)=>M==="body"?v:M==="shoulder"?Ut(u,v):a(v),p;if(e.terms&&e.terms.length){p=[0,0,0];let v=0;for(let M of e.terms){let E=d(M.target,M.space);p=Ut(p,[E[0]*M.w,E[1]*M.w,E[2]*M.w]),v+=M.w}p=[p[0]/v,p[1]/v,p[2]/v]}else p=d(e.target,e.space);e.blend&&(e.blend.w??0)>0&&(p=Ea(p,d(e.blend.target,e.blend.space),Math.min(1,e.blend.w)));let g=t==="R"?1:-1,_=e.pole?e.poleSpace==="scene"?o(e.pole):e.pole:[g*.45,-.75,-.5],m=this._twoBone(u,p,l.l1,l.l2,_,e.reach??.995);c["_armE"+t]=m.E;let f=Et(Rt(Tn(m.u,m.h),he(Tn(l.dirU,l.hingeU)))),S=Et(Rt(Tn(m.f,m.h),he(Tn(l.dirL,l.hingeL))));c["upper"+t]=f,c["lower"+t]=S}_solveLeg(t,e,i,s,r,a,o){let c=this.side[t],h=c.leg,l=i[c.thighI],u=e.space==="body"?e.target:a(e.target),d=this.skel.restP[c.footI],p=E=>{if(E==="toe"&&c.toeI>=0){let C=this.skel.restP[c.toeI];return{off:Ot(C,d),h:C[2]-this.skel.groundZ}}return{off:[0,-.05,-(d[2]-this.skel.groundZ)],h:0}},g=(E,C)=>e.space==="body"?[E,C,0]:a([E,C,0]),_=E=>this._footDelta(t,{...e,foot:E},s,r),m=(E,C,R,P)=>{let N=p(E),y=g(C,R);y[2]=d[2];let w=Ut(y,kt(_({...P,pitch:0,roll:0}),N.off));return[w[0],w[1],this.skel.groundZ+N.h]},f=(E,C,R)=>Ot(C,kt(_(R),p(E).off));if(e.pivot){let E=e.pivot,C;if(E.ax!=null)C=m(E.kind,E.ax,E.ay,E.ayaw!=null?{yaw:E.ayaw}:e.foot||{});else{let R=g(E.x,E.y);C=[R[0],R[1],this.skel.groundZ+p(E.kind).h]}C[2]+=E.z||0,u=f(E.kind,C,e.foot||{})}else if(e.swing){let E=e.swing,C=f("toe",m("toe",E.a.x,E.a.y,E.a.ayaw!=null?{yaw:E.a.ayaw}:E.a.foot),{...E.a.foot,pitch:E.a.pitch}),R=f("heel",m("heel",E.b.x,E.b.y,E.b.foot),{...E.b.foot,pitch:E.b.pitch});u=[C[0]+(R[0]-C[0])*E.h,C[1]+(R[1]-C[1])*E.h,C[2]+(R[2]-C[2])*E.v+(E.lift||0)]}let S=t==="R"?1:-1,v=e.pole;if(!v){let E=e.foot?.yawBody??this._footYawBody(t,e,r);v=[-Math.sin(E)+S*.12,Math.cos(E),.1]}let M=this._twoBone(l,u,h.l1,h.l2,v,e.reach??.998);o["_legE"+t]=M.E,o["thigh"+t]=Et(Rt(Tn(M.u,M.h),he(Tn(h.dirU,h.hingeU)))),o["calf"+t]=Et(Rt(Tn(M.f,M.h),he(Tn(h.dirL,h.hingeL))))}_footYawBody(t,e,i){let s=t==="R"?1:-1;if(e.foot?.yaw!=null){let r=Math.atan2(-kt(i.q,er)[0],kt(i.q,er)[1]);return e.foot.yaw-r}return-s*6*zt+(e.foot?.yawRel||0)}_footDelta(t,e,i,s){let r=e.foot||{};if(r.inherit){let l=Hn({bend:r.pitch||0,side:r.roll||0});return Et(Rt(i,l))}let a=this._footYawBody(t,e,s),o=kt(de(Fi,a),this._footFwdRest(t)),c=Xt(Pe(o,Fi)),h=de(Fi,a);return h=Rt(de(c,r.pitch||0),h),h=Rt(de(o,r.roll||0),h),Et(h)}_handDelta(t,e,i,s){let r=this.side[t].hand,a=e?.wrist||{},o=t==="R"?1:-1,c=Rt(de(r.fwd,(a.twist||0)*o),Rt(de(r.flexAxis,a.flex||0),de(r.back,(a.dev||0)*o))),h=Et(Rt(i,c));if(e?.palm&&(e.palm.weight??1)>0){let l=kt(he(s.q),e.palm.fingerDir),u=kt(he(s.q),e.palm.palmDir),d=Et(Rt(Tn(l,u),he(Tn(r.fwd,r.palm)))),p=2*Math.acos(Math.min(1,Math.abs(Dr(h,d)))),g=Me((175*zt-p)/(45*zt),0,1);g<1&&this.fades.push({side:t,angle:p/zt}),h=Aa(h,d,(e.palm.weight??1)*g)}return h}_fingerDelta(t,e){let i=t[6],s=+t[7],r=+t[8];if(!e)return Re();let a=this.side[i],o=a.fingers[s]?.[r];if(!o)return Re();let c=Array.isArray(e.curl)?e.curl[s]??0:e.curl??0,h=e.claw??0,l;if(s===0)l=[.35,.55,.6][r]*c;else{let d=[1.3,1.65,1][r]*c,p=[-.25,1.1,1.2][r]*h;l=d+p}let u=de(o.axis,l);if(r===0&&s>0&&e.spread){let d=a.hand,p=i==="R"?1:-1,g=(s-2.2)*.11*e.spread*p;u=Rt(de(d.back,-g),u)}return r===0&&s===0&&e.thumbOpp&&(u=Rt(de(a.hand.fwd,(i==="R"?1:-1)*e.thumbOpp),u)),u}_twoBone(t,e,i,s,r,a){let o=Ot(e,t),c=Te(o),h=(i+s)*a,l=Math.abs(i-s)+.001,u=c>1e-6?ue(o,1/c):[0,0,-1];c=Me(c,l,h);let d=Me((i*i+c*c-s*s)/(2*i*c),-1,1),p=Math.sqrt(1-d*d),g=ui(r,u);Te(g)<1e-6&&(g=ui([0,0,-1],u)),g=Xt(g);let _=Ut(t,Ut(ue(u,i*d),ue(g,i*p))),m=Ut(t,ue(u,c)),f=Xt(Ot(_,t)),S=Xt(Ot(m,_)),v=Xt(Pe(g,u));return{E:_,W:m,u:f,f:S,h:v,n:u,b:g,dist:c}}};function cs(n){let t=n.P.map(i=>Ut(n.mover.p,kt(n.mover.q,i))),e=n.Q.map(i=>Et(Rt(n.mover.q,i)));return{P:t,Q:e}}var cp=["male","female","zombie"],lp={mp_m_freemode_01:"male",mp_f_freemode_01:"female",u_m_y_zombie_01:"zombie"};function tu(n){if(cp.includes(n))return{key:n,exact:!0};let t=lp[String(n||"").toLowerCase()];return t?{key:t,exact:!0}:{key:"male",exact:!1}}var Pa=30,hp=3,Ia=class{constructor(t,e,i,s){this.scene=t,this.prev=e,this.t=i,this.v=s,this.T=t.duration,this.phase=t.duration>0?i/t.duration:0}at(t,e,i=[0,0,0]){this.used=!0;let s=this.prev?.[t],r=this.scene.skeletons[t],a=r.idx(e);if(!s)return Ut(r.restP[a],i);let o=Et(Rt(s.mover.q,s.D[a]));return Ut(s.world.P[a],kt(o,i))}moverOf(t){return this.used=!0,this.prev?.[t]?.mover??{p:[0,0,0],q:[0,0,0,1]}}body(t,e){let i=this.moverOf(t);return Ut(i.p,kt(i.q,e))}},up=null;function dp(n,t,e){let i=up?.[n];return i?i[t?.suffix||""]?.[e]??i["*"]?.[e]??null:null}function eu(n,t,e){let i=Object.keys(n.actors),s={};for(let l of i){let u=t?.skel?.[l]??n.actors[l],d=e[u];if(!d)throw new Error(`${n.name}: skeleton '${u}' for actor '${l}' not loaded`);s[l]=d}let r={name:n.name,duration:n.duration,skeletons:s},a=Object.fromEntries(i.map(l=>[l,new fi(s[l])])),o=Math.max(2,Math.round(n.duration*Pa)+1),c=Object.fromEntries(i.map(l=>[l,[]]));for(let l=0;l<o;l++){let u=l/Pa,d=null,p=null;for(let g=0;g<hp;g++){let _=new Ia(r,d,u,t||{}),m=n.pose(u,_);p={};for(let f of i){let S=i.length===1&&!m[f]?m:m[f],v=dp(n.name,t,f);if(v&&S){let E=S.mover||{p:[0,0,0],yaw:0};S={...S,mover:{p:[E.p[0]+(v.dx||0),E.p[1]+(v.dy||0),E.p[2]+(v.dz||0)],yaw:(E.yaw||0)+(v.dyaw||0)*Math.PI/180}}}let M=a[f].solve(S||{});M.world=cs(M),p[f]=M}if(d=p,!n.contacts&&i.length===1&&!_.used)break}for(let g of i)c[g].push(p[g])}let h=(o-1)/Pa;return{scene:r,actors:i,skeletons:s,frames:c,duration:h,nFrames:o}}var nu={smooth:ki.inOut,fastIn:ki.out,fastOut:ki.in,linear:ki.linear,spring:ki.back,step:ki.step},Gr=.15,nr={relaxed:{curl:[.3,.32,.38,.44,.5],spread:.15,claw:0,thumbOpp:.1},fist:{curl:[.7,1,1,1,1],spread:0,claw:0,thumbOpp:.4},open:{curl:[.05,.02,.02,.03,.05],spread:.6,claw:0,thumbOpp:0},grab:{curl:[.55,.62,.66,.7,.72],spread:.35,claw:.25,thumbOpp:.3},point:{curl:[.6,.02,1,1,1],spread:.1,claw:0,thumbOpp:.35},claw:{curl:[.35,.25,.3,.35,.4],spread:.8,claw:.55,thumbOpp:0}};function iu(n){let t=nr[n.preset]||nr.relaxed,e=n.curl??1;return[...t.curl.map(i=>Me(i*e,0,1.2)),n.spread??t.spread,t.claw*Math.min(1,e),t.thumbOpp]}var fp=n=>({curl:n.slice(0,5),spread:n[5],claw:n[6],thumbOpp:n[7]}),Oi=(n,t,e)=>n+(t-n)*e,Vn=(n,t,e)=>n.map((i,s)=>i+(t[s]-i)*e);function Bi(n,t,e){if(!n||!n.length)return[];let i=n.slice().sort((s,r)=>s.t-r.t);return e&&i.length&&Math.abs(i[i.length-1].t-t)>1e-6&&i.push({...i[0],t,ease:i[0].ease||"smooth",virtual:!0}),i}function zi(n,t){if(t<=n[0].t)return{a:n[0],b:n[0],u:0};for(let i=1;i<n.length;i++)if(t<=n[i].t){let s=n[i-1],r=n[i],a=(t-s.t)/Math.max(1e-9,r.t-s.t);return{a:s,b:r,u:(nu[r.ease]||nu.smooth)(a)}}let e=n[n.length-1];return{a:e,b:e,u:0}}function ru(n,t,e,i=!1){let s=Bi(n,e,i);if(!s.length)return null;let{a:r,b:a,u:o}=zi(s,t),c={};for(let h of new Set([...Object.keys(r),...Object.keys(a)])){if(h==="t"||h==="virtual")continue;let l=r[h]??a[h],u=a[h]??r[h];typeof l=="number"&&typeof u=="number"?c[h]=Oi(l,u,o):Array.isArray(l)&&Array.isArray(u)&&l.length===u.length&&l.every(d=>typeof d=="number")?c[h]=Vn(l,u,o):c[h]=o<.5?l:u}return c.t=t,c}function pp(n,t,e){let i=n.tracks[t]||{},s=n.duration,r=!!n.loop,a=Bi(i.mover,s,r&&(n.loopMover||"closed")==="closed"),o=Bi(i.root,s,r),c=Bi(i.look,s,r),h=Object.entries(i.bones||{}).filter(([f])=>e.has(f)).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length),l=Object.fromEntries(Object.entries(i.ik||{}).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length)),u=Object.fromEntries(Object.entries(i.fingers||{}).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length)),d=e.groundZ+.085,p=f=>{if(!a.length)return{p:[0,0,0],yaw:0};let{a:S,b:v,u:M}=zi(a,f);return{p:Vn(S.p||[0,0,0],v.p||S.p||[0,0,0],M),yaw:Oi(S.yaw||0,v.yaw??S.yaw??0,M)*zt}},g=(f,S)=>{let v=de([0,0,1],f.yaw);return Ut(f.p,kt(v,S))},_=(f,S)=>kt(de([0,0,1],-f.yaw),Ot(S,f.p)),m=(f,S)=>(f.space||"body")==="scene"?_(S,f.target):f.target;return{moverAt:p,toScene:g,toBody:_,groundAnkle:d,hasIk:f=>!!l[f],pose(f){let S=p(f),v={mover:{p:S.p,yaw:S.yaw},bones:{},arm:{},leg:{}};if(o.length){let{a:M,b:E,u:C}=zi(o,f);v.root={p:Vn(M.p||[0,0,0],E.p||M.p||[0,0,0],C)};let R=M.rot||[0,0,0],P=E.rot||M.rot||[0,0,0];(R.some(Boolean)||P.some(Boolean))&&(v.bones.SKEL_ROOT=Ra(e,"SKEL_ROOT",Vn(R,P,C)))}for(let[M,E]of h){let{a:C,b:R,u:P}=zi(E,f);v.bones[M]=Ra(e,M,Vn(C.rot,R.rot,P))}for(let[M,E]of Object.entries(l)){let{a:C,b:R,u:P}=zi(E,f),N=M.endsWith("L")?"L":"R",y=Oi(C.weight??1,R.weight??1,P),w={target:Vn(m(C,S),m(R,S),P),space:"body",weight:y},F=C.pole,B=R.pole;if((F||B)&&(w.pole=F&&B?Vn(F,B,P):F||B),M.startsWith("hand"))v.arm[N]=w;else{let K=C.yaw!=null||R.yaw!=null?Oi(C.yaw??R.yaw,R.yaw??C.yaw,P):null;w.foot={pitch:Oi(C.pitch||0,R.pitch||0,P)*zt,roll:Oi(C.roll||0,R.roll||0,P)*zt},K!=null&&(w.foot.yaw=((R.space||"body")==="scene"?0:S.yaw)+K*zt),v.leg[N]=w}}for(let[M,E]of Object.entries(u)){let{a:C,b:R,u:P}=zi(E,f),N=fp(Vn(iu(C),iu(R),P));v.arm[M]={...v.arm[M]||{},fingers:N}}if(c.length){let{a:M,b:E,u:C}=zi(c,f),R=M.space||"body",P=E.space||"body",N=R==="scene"?M.target:g(S,M.target),y=P==="scene"?E.target:g(S,E.target);v.look={target:Vn(N,y,C),weight:Oi(M.weight??1,E.weight??1,C)}}return v}}}function ou(n,t,e){return n>=t[0]&&n<=t[1]?1:n>t[1]&&n<t[1]+Gr?1-kr((n-t[1])/Gr):e&&n<t[0]&&n>t[0]-Gr?kr(1-(t[0]-n)/Gr):0}function au(n,t,e,i){return e<=0?n:i&&n&&n.target?{...n,target:Vn(n.target,t,e),space:"body"}:{...n||{},target:t,space:"body",weight:e}}function Da(n,t){let e=Object.keys(n.actors),i={},s={};for(let l of e){let u=n.actors[l],d=u.skeleton?{key:u.skeleton,exact:!0}:tu(u.model);i[l]=d.key,s[l]=d.exact}let r=Object.fromEntries(e.map(l=>[l,pp(n,l,t[i[l]])])),a={};for(let l of e){let u=t[i[l]],d=new fi(u),p=n.tracks[l]||{};a[l]=[];for(let g of["L","R"])for(let _ of(p.feet?.lock?.[g]||[]).slice().sort((m,f)=>m[0]-f[0])){let m=r[l].pose(_[0]);su(m,a[l].filter(C=>C.side===g),_[0],r[l]);let f=d.solve(m),S=cs(f),v=u.idx(cn["foot"+g]),M=S.P[v],E=di(Et(Rt(f.mover.q,f.D[v])));a[l].push({side:g,range:_,ankle:M,yaw:E})}}let o=(n.contacts||[]).filter(l=>l.stick).map(l=>{let u=zn(l.from),d=zn(l.to);return{from:u,to:d,offset:l.offset||[0,0,0],t:l.t}}),c=(n.contacts||[]).map(l=>{let u=zn(l.from),d=zn(l.to);return{actor:u.actor,bone:u.bone,from:l.t[0],to:l.t[1],max:l.max??.03,target:{actor:d.actor,bone:d.bone,offset:l.offset||[0,0,0]},id:l.id}});return{source:{name:n.name,duration:n.duration,loop:!!n.loop,actors:Object.fromEntries(e.map(l=>[l,i[l]])),contacts:c.length?c:void 0,pose(l,u){let d={};for(let p of e){let g=r[p].pose(l);su(g,a[p],l,r[p]);for(let _ of o){if(_.from.actor!==p)continue;let m=ou(l,_.t,!0);if(m<=0||!u)continue;let f=r[p].toBody(r[p].moverAt(l),u.at(_.to.actor,_.to.bone,_.offset)),S=_.from.handle.endsWith("L")?"L":"R",v=_.from.handle.startsWith("hand")?"arm":"leg";g[v][S]=au(g[v][S],f,m,r[p].hasIk(_.from.handle))}d[p]=g}return d}},skelKeys:i,skelExact:s}}function cu(n,t){let e=Da(n,t),i=eu(e.source,{},t);return Object.assign(i,e)}function su(n,t,e,i){for(let s of t){let r=ou(e,s.range,!1);if(r<=0)continue;let a=n.leg[s.side],o=au(a,i.toBody(i.moverAt(e),s.ankle),r,i.hasIk("foot"+s.side)),c=a?.foot?.yaw;o.foot={...a?.foot||{},pitch:(a?.foot?.pitch||0)*(1-r),roll:(a?.foot?.roll||0)*(1-r),yaw:c!=null?c+mp(c,s.yaw)*r:s.yaw},n.leg[s.side]=o}}var mp=(n,t)=>Math.atan2(Math.sin(t-n),Math.cos(t-n));var Wr={footSlide:.3,groundPen:.025,floatFeet:.06,angVel:1500,linVel:9,loopSeam:.6,loopMover:.01,elbowHyper:4,kneeHyper:4,neck:85,spineSeg:38,wrist:88,wristRoll:120,penetration:.035,selfPenetration:.03,contact:.07,blendAngle:6,blendMover:.03},uu={torso:["SKEL_Spine0","SKEL_Spine3",.13],chest:["SKEL_Spine2","SKEL_Neck_1",.12,[0,0,-.1]],neck:["SKEL_Neck_1","SKEL_Head",.06],head:["SKEL_Head","SKEL_Head",.1,[0,.02,.1],[0,.03,-.01]],upperL:["SKEL_L_UpperArm","SKEL_L_Forearm",.052],upperR:["SKEL_R_UpperArm","SKEL_R_Forearm",.052],foreL:["SKEL_L_Forearm","SKEL_L_Hand",.042],foreR:["SKEL_R_Forearm","SKEL_R_Hand",.042],thighL:["SKEL_L_Thigh","SKEL_L_Calf",.075],thighR:["SKEL_R_Thigh","SKEL_R_Calf",.075],shinL:["SKEL_L_Calf","SKEL_L_Foot",.052],shinR:["SKEL_R_Calf","SKEL_R_Foot",.052]},Jy=Object.keys(uu);function Kr(n,t){let e={};for(let[i,[s,r,a,o,c]]of Object.entries(uu)){if(!n.has(s)||!n.has(r))continue;let h=t.world.P[n.idx(s)],l=t.world.P[n.idx(r)];if(o){let u=Et(Rt(t.mover.q,t.D[n.idx(r)]));l=Ut(l,kt(u,o))}if(c){let u=Et(Rt(t.mover.q,t.D[n.idx(s)]));h=Ut(h,kt(u,c))}e[i]={a:h,b:l,r:a}}return e}function du(n,t,e,i){let s=Ot(t,n),r=Ot(i,e),a=Ot(n,e),o=an(s,s),c=an(r,r),h=an(r,a),l,u;if(o<=1e-12&&c<=1e-12)return Te(a);if(o<=1e-12)l=0,u=Me(h/c,0,1);else{let d=an(s,a);if(c<=1e-12)u=0,l=Me(-d/o,0,1);else{let p=an(s,r),g=o*c-p*p;l=g!==0?Me((p*h-d*c)/g,0,1):0,u=(p*l+h)/c,u<0?(u=0,l=Me(-d/o,0,1)):u>1&&(u=1,l=Me((p-d)/o,0,1))}}return Te(Ot(Ut(n,ue(s,l)),Ut(e,ue(r,u))))}var Be=()=>({value:0,frame:-1,detail:""}),ze=(n,t,e,i="")=>{t>n.value&&(n.value=t,n.frame=e,n.detail=i)},gp=[0,-.05,-.085],lu={heel:0,toe:.035};function hu(n,t,e){let i=Et(Rt(t.mover.q,t.D[e.ankle])),s={heel:Ut(t.world.P[e.ankle],kt(i,gp))};return e.toe>=0&&(s.toe=t.world.P[e.toe]),s}function fu(n,t,e={}){let i={...Wr,...e.limits||{}},s=e.fps||30,r=t.length,a={footSlide:Be(),groundPen:Be(),floatFeet:Be(),angVel:Be(),linVel:Be(),elbowHyper:Be(),kneeHyper:Be(),neck:Be(),spineSeg:Be(),wrist:Be(),wristRoll:Be(),selfPenetration:Be(),loopSeam:Be(),loopMover:Be()},o=n.groundZ,c=["L","R"].map(l=>({s:l,ankle:n.idx(Nt.side[l].foot),toe:n.has(Nt.side[l].toe)?n.idx(Nt.side[l].toe):-1})),h=e.airborne||[];for(let l=0;l<r;l++){let u=t[l],d=o+u.mover.p[2],p=1/0;for(let m of c){let f=u.world.P[m.ankle][2]-(d+.085),S=m.toe>=0?u.world.P[m.toe][2]-(d+.025):f;e.noGround||ze(a.groundPen,-Math.min(f,S),l,`${m.s} foot`),p=Math.min(p,f,S)}if(!h.some(([m,f])=>l/s>=m&&l/s<=f)&&!e.noGround&&ze(a.floatFeet,p,l,"lowest foot above ground"),l>0&&!e.noGround){let m=t[l-1];for(let f of c){let S=hu(n,u,f),v=hu(n,m,f);for(let M of Object.keys(S)){let E=S[M][2]-d-lu[M],C=v[M][2]-(o+m.mover.p[2])-lu[M];if(E<.02&&C<.02){let R=S[M][0]-v[M][0],P=S[M][1]-v[M][1];ze(a.footSlide,Math.hypot(R,P)*s,l,`${f.s} ${M}`)}}}}if(l>0){let m=t[l-1];for(let f of n.order){let S=n.bones[f].name;if(!S.startsWith("SKEL_")||S.includes("Finger"))continue;let v=as(u.world.Q[f],m.world.Q[f])/zt*s;ze(a.angVel,v,l,S);let M=Te(Ot(u.world.P[f],m.world.P[f]))*s;ze(a.linVel,M,l,S)}}for(let m of["L","R"]){let f=Nt.side[m],S=n.limbs["arm"+m],v=n.limbs["leg"+m];for(let[M,E,C,R,P]of[[S,"elbowHyper",f.upper,f.lower,f.hand],[v,"kneeHyper",f.thigh,f.calf,f.foot]]){if(!M)continue;let N=u.P[n.idx(C)],y=u.P[n.idx(R)],w=u.P[n.idx(P)],F=Xt(Ot(y,N)),B=Xt(Ot(w,y)),K=kt(u.D[n.idx(C)],M.hingeU),tt=Math.atan2(an(Pe(F,B),K),an(F,B));ze(a[E],-tt/zt,l,`${m}`)}if(S){let M=Et(Rt(he(u.D[n.idx(f.lower)]),u.D[n.idx(f.hand)])),E=Oh(M,S.dirL),C=Et(Rt(M,he(E)));ze(a.wrist,2*Math.acos(Math.min(1,Math.abs(C[3])))/zt,l,`${m} bend`),ze(a.wristRoll,2*Math.acos(Math.min(1,Math.abs(E[3])))/zt,l,`${m} roll`)}}let _=n.has("SKEL_Spine3")?n.idx("SKEL_Spine3"):n.idx(Nt.root);ze(a.neck,as(u.D[n.idx(Nt.head)],u.D[_])/zt,l,"head vs chest");for(let m of Nt.spine){if(!n.has(m))continue;let f=n.idx(m),S=n.bones[f].parent;ze(a.spineSeg,as(u.D[f],u.D[S])/zt,l,m)}if(!e.allowSelfContact){let m=Kr(n,u);for(let f of["foreL","foreR"])for(let S of["torso","thighL","thighR"]){if(!m[f]||!m[S]||f==="foreL"&&S==="thighL"||f==="foreR"&&S==="thighR")continue;let v=du(m[f].a,m[f].b,m[S].a,m[S].b);ze(a.selfPenetration,m[f].r+m[S].r-v,l,`${f} vs ${S}`)}}}if(e.loop&&r>2){let l=t[0],u=t[r-1];for(let g of n.order)ze(a.loopSeam,as(l.local[g],u.local[g])/zt,r-1,n.bones[g].name);let d=Ot(t[1].mover.p,t[0].mover.p),p=Ot(t[r-1].mover.p,t[r-2].mover.p);ze(a.loopMover,Te(Ot(d,p)),r-1,"mover velocity across seam"),ze(a.loopSeam,as(t[0].mover.q,t[r-1].mover.q)/zt,r-1,"mover rotation")}return mu(a,i)}function pu(n,t={}){let e={...Wr,...t.limits||{}},i={penetration:Be(),contact:Be()},s=n.actors,r=new Set((t.allowTouch||[]).flatMap(([u,d])=>[`${u}|${d}`,`${d}|${u}`])),a=n.nFrames,o=t.fps||30,c=t.contacts||[],h=c.map(()=>Be());for(let u=0;u<a;u++){let d={};for(let p of s)d[p]=Kr(n.skeletons[p],n.frames[p][u]);for(let p=0;p<s.length;p++)for(let g=p+1;g<s.length;g++){let _=s[p],m=s[g];for(let[f,S]of Object.entries(d[_]))for(let[v,M]of Object.entries(d[m])){if(r.has(`${_}.${f}|${m}.${v}`)||r.has(`${_}.*|${m}.${v}`)||r.has(`${_}.${f}|${m}.*`))continue;let E=du(S.a,S.b,M.a,M.b);ze(i.penetration,S.r+M.r-E,u,`${_}.${f} vs ${m}.${v}`)}}c.forEach((p,g)=>{let _=u/o;if(_<p.from||_>p.to)return;let m=n.skeletons[p.actor],f=n.frames[p.actor][u],S=m.idx(p.bone),v=Ut(f.world.P[S],kt(Et(Rt(f.mover.q,f.D[S])),p.offset||[0,0,0])),M=n.skeletons[p.target.actor],E=n.frames[p.target.actor][u],C=M.idx(p.target.bone),R=Et(Rt(E.mover.q,E.D[C])),P=Ut(E.world.P[C],kt(R,p.target.offset||[0,0,0])),N=Te(Ot(v,P)),y=`${p.actor}.${p.bone} -> ${p.target.actor}.${p.target.bone}`;ze(h[g],N,u,y),ze(i.contact,N-(p.max??e.contact),u,y)})}let l=mu(i,{...e,contact:0});return l.contacts=h.map((u,d)=>({...u,value:+u.value.toFixed(4),limit:c[d].max??e.contact,pass:u.value<=(c[d].max??e.contact)})),l}function mu(n,t){let e={ok:!0,items:{}};for(let[i,s]of Object.entries(n)){let r=t[i],a=r==null||s.value<=r+1e-9;e.items[i]={value:+s.value.toFixed(4),limit:r,pass:a,frame:s.frame,detail:s.detail},a||(e.ok=!1)}return e}var _p={contact:.03},Hi=30,Zn=n=>(n*100).toFixed(1),ka=n=>(+n).toFixed(1),Ua={L:"links",R:"rechts"},xp={heel:"Ferse",toe:"Ballen"},Na=n=>String(n||"").replace(/^SKEL_/,"").replace(/_/g," ");function Fa(n,t){let e={..._p,...n.limits||{}},i={};for(let r of t.actors)i[r]=fu(t.skeletons[r],t.frames[r],{loop:!!n.loop,limits:e});let s=null;if(t.actors.length>1||(n.contacts||[]).length){let{source:r}=t,a=[];for(let o of n.contacts||[]){let[c,h]=o.from.split("."),[l]=o.to.split(".");if(c===l)continue;let u=/^(hand|foot)([LR])$/.exec(h);if(u)for(let d of u[1]==="hand"?["fore","upper"]:["shin"])a.push([`${c}.${d}${u[2]}`,`${l}.*`])}s=pu(t,{contacts:r?.contacts||[],limits:e,allowTouch:a})}return{actors:i,scene:s,limits:{...Wr,...e}}}function vp(n,t,e,i){let s=n.idx(Nt.side[e].foot),r=c=>{let h=t[c],l=Et(Rt(h.mover.q,h.D[s]));return Ut(h.world.P[s],kt(l,[0,-.05,-.085]))[2]-(n.groundZ+h.mover.p[2])},a=i,o=i;for(;a>0&&r(a-1)<.03;)a--;for(;o<t.length-1&&r(o+1)<.03;)o++;return o-a<3&&(a=Math.max(0,i-6),o=Math.min(t.length-1,i+6)),[+(a/Hi).toFixed(3),+(o/Hi).toFixed(3)]}function yp(n,t,e=Hi){let i={L:0,R:0};for(let s of["L","R"]){let r=n.idx(Nt.side[s].foot),a=n.has(Nt.side[s].toe)?n.idx(Nt.side[s].toe):-1,o=c=>{let h=Et(Rt(c.mover.q,c.D[r])),l=[[Ut(c.world.P[r],kt(h,[0,-.05,-.085])),0]];return a>=0&&l.push([c.world.P[a],.035]),l};for(let c=1;c<t.length;c++){let h=o(t[c-1]),l=o(t[c]),u=n.groundZ+t[c-1].mover.p[2],d=n.groundZ+t[c].mover.p[2];for(let p=0;p<h.length;p++)h[p][0][2]-u-h[p][1]<.02&&l[p][0][2]-d-l[p][1]<.02&&(i[s]=Math.max(i[s],Math.hypot(l[p][0][0]-h[p][0][0],l[p][0][1]-h[p][0][1])*e))}}return i}function gu(n,t,e=Fa(n,t)){let i=[],s=o=>i.push({fix:null,actor:null,t:null,...o}),r=o=>n.actors[o]?.label||o;for(let o of t.actors){let c=e.actors[o].items,h=t.skeletons[o],l=t.actors.length>1?`${r(o)}: `:"",u=d=>d.frame>=0?+(d.frame/Hi).toFixed(3):null;{let d=c.footSlide,p=/^([LR])/.exec(d.detail)?.[1],g=/(heel|toe)/.exec(d.detail)?.[1],_=d.pass?d.value>d.limit*.8?"warn":"ok":"error",m=_!=="ok"?yp(h,t.frames[o]):null,f=m&&m.L>d.limit*.8&&m.R>d.limit*.8;s({id:`${o}.footSlide`,category:"feet",level:_,actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m/s",title:"Fu\xDFrutschen",text:_==="ok"?`${l}Die F\xFC\xDFe stehen fest.`:`${l}Fu\xDF ${Ua[p]||""} (${xp[g]||"Fu\xDF"}) rutscht mit ${d.value.toFixed(2)} m/s \xFCber den Boden (erlaubt ${d.limit} m/s).`,fix:_!=="ok"&&p?{kind:"lockFeet",actor:o,side:f?"both":p,range:vp(h,t.frames[o],p,Math.max(0,d.frame)),label:f?"Beide F\xFC\xDFe festkleben":`Fu\xDF ${Ua[p]} festkleben`}:null})}{let d=c.groundPen,p=/^([LR])/.exec(d.detail)?.[1],g=d.pass?d.value>d.limit*.6?"warn":"ok":"error";s({id:`${o}.groundPen`,category:"ground",level:g,actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Boden-Durchdringung",text:g==="ok"?`${l}Kein Fu\xDF steckt im Boden.`:`${l}Fu\xDF ${Ua[p]||""} steckt ${Zn(d.value)} cm im Boden (erlaubt ${Zn(d.limit)} cm).`,fix:g!=="ok"&&p?{kind:"snapGround",actor:o,side:p,t:u(d),depth:+d.value.toFixed(4),label:"Auf den Boden setzen"}:null})}{let d=0,p=null,g=null;for(let[S,v]of Object.entries(n.tracks[o]?.bones||{}))if(h.has(S))for(let M of v){let E=Zh(h,S,M.rot);E>d&&(d=E,p=S,g=M.t)}let _=["elbowHyper","kneeHyper","neck","spineSeg","wrist","wristRoll"].map(S=>[S,c[S]]).filter(([,S])=>!S.pass),m=d>.5||_.length?"error":"ok",f=`${l}Alle Gelenke im nat\xFCrlichen Bereich.`;if(d>.5)f=`${l}${Na(p)} ist ${ka(d)}\xB0 \xFCber der Gelenkgrenze.`;else if(_.length){let[S,v]=_[0],M={elbowHyper:"Ellbogen \xFCberstreckt",kneeHyper:"Knie \xFCberstreckt",neck:"Kopf zu stark verdreht",spineSeg:"Wirbels\xE4ule zu stark gebogen",wrist:"Handgelenk zu stark abgeknickt",wristRoll:"Handgelenk zu stark verdreht"}[S];f=`${l}${M}: ${ka(v.value)}\xB0 (erlaubt ${v.limit}\xB0, ${v.detail}).`,g=u(v)}s({id:`${o}.joints`,category:"joints",level:m,actor:o,t:g,value:+(d||(_[0]?.[1].value??0)).toFixed(2),limit:d>.5?0:_[0]?.[1].limit??null,unit:"\xB0",title:"Gelenkgrenzen",text:f,fix:d>.5?{kind:"clampJoints",actor:o,bone:p,label:"Winkel begrenzen"}:null})}{let d=c.angVel,p=d.pass?d.value>d.limit*.8?"warn":"ok":"error";s({id:`${o}.angVel`,category:"speed",level:p,actor:o,t:u(d),value:Math.round(d.value),limit:d.limit,unit:"\xB0/s",title:"Zu schnelle Drehungen",text:p==="ok"?`${l}Alle Drehungen in normalem Tempo.`:`${l}${Na(d.detail)} dreht sich mit ${Math.round(d.value)}\xB0/s (h\xF6chstens ${d.limit}\xB0/s). Keyframes weiter auseinander ziehen oder weichere Kurve w\xE4hlen.`,fix:p!=="ok"?{kind:"easeSmooth",actor:o,t:u(d),label:"Kurven weich machen"}:null})}if(!c.selfPenetration.pass){let d=c.selfPenetration;s({id:`${o}.selfPen`,category:"self",level:"warn",actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Arm im eigenen K\xF6rper",text:`${l}${d.detail.replace("fore","Unterarm ").replace("vs","in")} (${Zn(d.value)} cm). Gewollt? Sonst Arm etwas weiter weg.`})}if(n.type==="single"){let d=(n.tracks[o]?.mover||[]).slice().sort((p,g)=>p.t-g.t)[0];d&&(Math.hypot(...d.p||[0,0,0])>.005||Math.abs(d.yaw||0)>.5)&&s({id:`${o}.startOffset`,category:"mover",level:"warn",actor:o,t:0,value:+Math.hypot(...d.p||[0,0,0]).toFixed(3),limit:0,unit:"m",title:"Startversatz",text:`${l}Der Standpunkt bei 0 s ist verschoben/gedreht. GTA ignoriert einen Startversatz im Clip, der Ped beginnt dort, wo er steht.`,fix:{kind:"zeroStart",actor:o,label:"Start auf 0 setzen"}})}if(!c.floatFeet.pass){let d=c.floatFeet;s({id:`${o}.floatFeet`,category:"ground",level:"warn",actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Beide F\xFC\xDFe in der Luft",text:`${l}Beide F\xFC\xDFe sind ${Zn(d.value)} cm \xFCber dem Boden. Bei einem Sprung ist das richtig, sonst Becken absenken.`})}if(n.loop){let d=c.loopSeam,p=c.loopMover,g=!d.pass||!p.pass;s({id:`${o}.loop`,category:"loop",level:g?"error":"ok",actor:o,t:n.duration,value:+d.value.toFixed(2),limit:d.limit,unit:"\xB0",title:"Loop-Naht",text:g?`${l}Ende und Anfang passen nicht zusammen (${d.pass?`Bewegung springt um ${Zn(p.value)} cm`:`${Na(d.detail)} springt um ${ka(d.value)}\xB0`}).`:`${l}Ende = Anfang, die Naht ist sauber.`,fix:g?{kind:"closeLoop",actor:o,label:"Naht schlie\xDFen"}:null})}}let a=e.scene;if(a){if(t.actors.length>1){let o=a.items.penetration,c=o.pass?o.value>o.limit*.7?"warn":"ok":"error",h=t.actors[1];s({id:"scene.penetration",category:"actors",level:c,t:o.frame>=0?+(o.frame/Hi).toFixed(3):null,value:+o.value.toFixed(3),limit:o.limit,unit:"m",title:"Durchdringung zwischen Akteuren",text:c==="ok"?"Die Akteure stecken nicht ineinander.":`Die K\xF6rper stecken ${Zn(o.value)} cm ineinander (${o.detail.replace(/\./g," ")}).`,fix:c==="error"?{kind:"separate",actor:h,t:+(o.frame/Hi).toFixed(3),dist:+(o.value-o.limit+.01).toFixed(3),label:`${r(h)} wegschieben`}:null})}(a.contacts||[]).forEach((o,c)=>{let h=n.contacts[c];s({id:`contact.${c}`,category:"contacts",level:o.pass?"ok":"error",t:o.frame>=0?+(o.frame/Hi).toFixed(3):h.t[0],value:o.value,limit:o.limit,unit:"m",title:"Kontakt",text:o.pass?`Kontakt ${h.from} \u2192 ${h.to} h\xE4lt (${Zn(o.value)} cm).`:`Kontakt ${h.from} \u2192 ${h.to} ist offen: ${Zn(o.value)} cm Abstand (erlaubt ${Zn(o.limit)} cm).`,fix:!o.pass&&!h.stick?{kind:"stick",index:c,label:"Festkleben"}:null})})}return i}function _u(n){return n.some(t=>t.level==="error")?"error":n.some(t=>t.level==="warn")?"warn":"ok"}var ln=30,Ue=n=>+(Math.round(n*ln)/ln).toFixed(4),ls=n=>Array.isArray(n)?n.map(t=>+(+t).toFixed(4)):+(+n).toFixed(4),Oa=n=>Array.isArray(n)?n.map(t=>+(+t).toFixed(2)):+(+n).toFixed(2),xu=["pos","torso","head","armL","armR","handL","handR","legL","legR"],vu={pos:"group_pos",torso:"group_torso",head:"group_head",armL:"group_armL",armR:"group_armR",handL:"group_handL",handR:"group_handR",legL:"group_legL",legR:"group_legR"};function Ba(n){if(/Neck|Head/.test(n))return"head";if(/Pelvis|Spine|ROOT/.test(n))return"torso";let t=Ui(n);return t?/Clavicle|UpperArm|Forearm/.test(n)?"arm"+t:/Hand|Finger/.test(n)?"hand"+t:"leg"+t:"torso"}function za(n){switch(n.kind){case"mover":case"root":return"pos";case"look":return"head";case"bone":return Ba(n.id);case"ik":return(n.id.startsWith("hand")?"arm":"leg")+n.id.slice(-1);case"fingers":return"hand"+n.id;default:return"pos"}}function Rn(n,t){let e=n.tracks[t.actor];if(!e)return null;switch(t.kind){case"mover":return e.mover||null;case"root":return e.root||null;case"look":return e.look||null;case"bone":return e.bones?.[t.id]||null;case"ik":return e.ik?.[t.id]||null;case"fingers":return e.fingers?.[t.id]||null;default:return null}}function Sp(n,t){let e=n.tracks[t.actor]||={};switch(t.kind){case"mover":return e.mover||=[];case"root":return e.root||=[];case"look":return e.look||=[];case"bone":return(e.bones||={})[t.id]||=[];case"ik":return(e.ik||={})[t.id]||=[];case"fingers":return(e.fingers||={})[t.id]||=[];default:throw new Error("bad ref")}}function Ha(n,t,e){let i=n.tracks[t.actor];if(!i)return;let s=(r,a)=>e.length?(r[a]=e,!1):(delete r[a],!0);switch(t.kind){case"mover":case"root":case"look":s(i,t.kind);break;case"bone":i.bones&&(s(i.bones,t.id),Object.keys(i.bones).length||delete i.bones);break;case"ik":i.ik&&(s(i.ik,t.id),Object.keys(i.ik).length||delete i.ik);break;case"fingers":i.fingers&&(s(i.fingers,t.id),Object.keys(i.fingers).length||delete i.fingers);break}}function Va(n,t){let e=n.tracks[t]||{},i=[];e.mover?.length&&i.push({actor:t,kind:"mover"}),e.root?.length&&i.push({actor:t,kind:"root"}),e.look?.length&&i.push({actor:t,kind:"look"});for(let[s,r]of Object.entries(e.bones||{}))r.length&&i.push({actor:t,kind:"bone",id:s});for(let[s,r]of Object.entries(e.ik||{}))r.length&&i.push({actor:t,kind:"ik",id:s});for(let[s,r]of Object.entries(e.fingers||{}))r.length&&i.push({actor:t,kind:"fingers",id:s});return i}var ir=(n,t,e)=>Va(n,t).filter(i=>za(i)===e);function sr(n,t,e){let i=new Set;for(let s of e?ir(n,t,e):Va(n,t))for(let r of Rn(n,s))i.add(Ue(r.t));return[...i].sort((s,r)=>s-r)}var Mp=(n,t)=>!!n.loop&&!(t.kind==="mover"&&(n.loopMover||"closed")==="travel");function Ne(n,t,e){let i=Rn(n,t);return i&&i.length?ru(i,e,n.duration,Mp(n,t)):null}function ye(n,t,e,i){let s=Sp(n,t),r=Math.min(n.duration,Math.max(0,Ue(e))),a={};for(let[c,h]of Object.entries(i))h!==void 0&&(c==="rot"||c==="yaw"||c==="pitch"||c==="roll"?a[c]=Oa(h):c==="p"||c==="target"||c==="pole"?a[c]=ls(h):c==="weight"||c==="curl"||c==="spread"?a[c]=+(+h).toFixed(3):a[c]=h);let o=s.findIndex(c=>Math.abs(c.t-r)<.5/ln);return o>=0?s[o]={...s[o],...a,t:r}:(s.push({t:r,...a}),s.sort((c,h)=>c.t-h.t)),s}function yu(n,t,e,i){for(let s of ir(n,t,e))Ha(n,s,Rn(n,s).filter(r=>Math.abs(r.t-i)>.5/ln))}function Su(n,t,e,i,s){let r=Math.min(n.duration,Math.max(0,Ue(s)));for(let a of ir(n,t,e)){let o=Rn(n,a),c=o.filter(l=>Math.abs(l.t-i)<.5/ln);if(!c.length)continue;let h=o.filter(l=>Math.abs(l.t-i)>=.5/ln&&Math.abs(l.t-r)>=.5/ln);Ha(n,a,[...h,...c.map(l=>({...l,t:r}))].sort((l,u)=>l.t-u.t))}}function Mu(n,t,e,i,s){for(let r of ir(n,t,e))for(let a of Rn(n,r))Math.abs(a.t-i)<.5/ln&&(a.ease=s)}function bu(n,t,e,i){let s=[];for(let r of ir(n,t,e))for(let a of Rn(n,r))Math.abs(a.t-i)<.5/ln&&s.push({ref:r,key:JSON.parse(JSON.stringify(a))});return s}function wu(n,t,e,i=null){for(let{ref:s,key:r}of t)ye(n,i?{...s,actor:i}:s,e,{...r,t:void 0})}function Ga(n,t){Ha(n,t,[])}function Xr(n,t,e){let i={bones:{},ik:{},fingers:{}};for(let s of Va(n,t)){let r=Ne(n,s,e);r&&(s.kind==="root"?i.root={p:ls(r.p||[0,0,0]),rot:Oa(r.rot||[0,0,0])}:s.kind==="bone"?i.bones[s.id]=Oa(r.rot):s.kind==="ik"?i.ik[s.id]={target:ls(r.target),pole:r.pole?ls(r.pole):void 0,weight:r.weight??1,space:r.space||"body",yaw:r.yaw,pitch:r.pitch,roll:r.roll}:s.kind==="fingers"?i.fingers[s.id]={preset:r.preset||"relaxed",curl:r.curl??1,spread:r.spread}:s.kind==="look"&&(i.look={target:ls(r.target),weight:r.weight??1,space:r.space||"body"}))}return i}function hs(n,t,e,i){let s=o=>o&&Object.keys(o).length;ye(n,{actor:t,kind:"root"},e,{p:i.root?.p||[0,0,0],rot:i.root?.rot||[0,0,0]});let r=new Set([...Object.keys(n.tracks[t]?.bones||{}),...Object.keys(i.bones||{})]);for(let o of r)ye(n,{actor:t,kind:"bone",id:o},e,{rot:i.bones?.[o]||[0,0,0]});let a=new Set([...Object.keys(n.tracks[t]?.ik||{}),...Object.keys(i.ik||{})]);for(let o of a){let c=i.ik?.[o],h={actor:t,kind:"ik",id:o};if(c)ye(n,h,e,{...c,weight:c.weight??1});else{let l=Ne(n,h,e);l&&ye(n,h,e,{target:l.target,space:l.space,weight:0})}}if(s(i.fingers))for(let[o,c]of Object.entries(i.fingers))ye(n,{actor:t,kind:"fingers",id:o},e,c);i.look&&ye(n,{actor:t,kind:"look"},e,i.look)}var $r=n=>n&&[-n[0],n[1],n[2]];function Eu(n){let t={bones:{},ik:{},fingers:{}};n.root&&(t.root={p:$r(n.root.p),rot:Br("SKEL_ROOT",n.root.rot)});for(let[e,i]of Object.entries(n.bones||{}))t.bones[Or(e)]=Br(e,i);for(let[e,i]of Object.entries(n.ik||{})){let s=e.endsWith("L")?e.slice(0,-1)+"R":e.slice(0,-1)+"L";t.ik[s]={...i,target:$r(i.target),pole:$r(i.pole),yaw:i.yaw!=null?-i.yaw:i.yaw,roll:i.roll!=null?-i.roll:i.roll}}for(let[e,i]of Object.entries(n.fingers||{}))t.fingers[e==="L"?"R":"L"]={...i};return n.look&&(t.look={...n.look,target:$r(n.look.target)}),t}function Au(n,t,e,i){let s=Ne(n,{actor:t,kind:"bone",id:e},i),r=Or(e);return!s||r===e?!1:(ye(n,{actor:t,kind:"bone",id:r},i,{rot:Br(e,s.rot)}),!0)}function Tu(n,t,e,i){n.events||=[],n.events.push({name:t,t:Ue(e),...i?{duration:+(+i).toFixed(3)}:{}}),n.events.sort((s,r)=>s.t-r.t)}function Ru(n,t){n.events.splice(t,1)}function Cu(n,t,e,i){let s=n.tracks[t]||={};s.feet||={},s.feet.lock||={};for(let r of e==="both"?["L","R"]:[e]){let a=[...s.feet.lock[r]||[],[Ue(i[0]),Ue(i[1])]].sort((c,h)=>c[0]-h[0]),o=[];for(let c of a)o.length&&c[0]<=o[o.length-1][1]?o[o.length-1][1]=Math.max(o[o.length-1][1],c[1]):o.push(c.slice());s.feet.lock[r]=o}}function Lu(n,t,e,i){let s=n.tracks[t]?.feet?.lock?.[e];s&&s.splice(i,1)}function Pu(n,t,e,i,s){n.contacts||=[];let r=`c${n.contacts.length+1}_${Math.floor(Date.now()%1e5)}`.slice(0,24);n.contacts.push({id:r,from:t,to:e,offset:ls(i),t:[Ue(s[0]),Ue(s[1])],stick:!0,max:.03})}function Wa(n,t){n.contacts.splice(t,1)}function Cn(n){let{format:t,name:e,...i}=n;return JSON.stringify({format:t,name:e,...i})}var x={doc:null,name:null,dirty:!1,savedAt:null,version:0,t:0,playing:!1,speed:1,onion:!1,limitsOn:!0,overlay:!0,actor:"a",selBone:null,selHandle:null,selKeys:[],range:null,history:[],future:[],undoMax:150,skeletons:{},skeletonSource:"none",config:{},frame:null,partners:[],clipboardPose:null,clipboardKeys:null,findings:[],light:"ok",checking:!1,checkError:null,poses:{},projects:[],watch:{alive:!1},test:null,lastResult:null},qr=new Map;function pi(n,t){qr.has(n)||qr.set(n,[]),qr.get(n).push(t)}function pn(...n){for(let t of[...n,"*"])for(let e of qr.get(t)||[])try{e(t)}catch(i){console.error(t,i)}}var us=null;function Iu(n,t){x.doc=n,x.name=t,x.dirty=!1,x.history=[],x.future=[],x.version++,x.t=Math.min(x.t,n.duration),x.selKeys=[],x.range=null,Zr(),pn("doc","time","history","selection","project")}function $a(n,{commit:t=!0}={}){t&&!us&&Du(Cn(x.doc)),x.doc=n,x.dirty=!0,x.version++,Zr(),pn("doc","history")}function jt(n,t){let e=structuredClone(x.doc);n(e),$a(e,t)}function Du(n){x.history.push(n),x.history.length>x.undoMax&&x.history.shift(),x.future=[]}function Gn(){us||(us=Cn(x.doc))}function jn(){if(!us)return;let n=us;us=null,n!==Cn(x.doc)&&(Du(n),pn("history"))}function Xa(){x.history.length&&(x.future.push(Cn(x.doc)),x.doc=JSON.parse(x.history.pop()),x.dirty=!0,x.version++,Zr(),pn("doc","history"))}function qa(){x.future.length&&(x.history.push(Cn(x.doc)),x.doc=JSON.parse(x.future.pop()),x.dirty=!0,x.version++,Zr(),pn("doc","history"))}var Yr={version:-1,source:null,rigs:null};function Zr(){Yr.version=-1,bp()}function ku(){if(Yr.version!==x.version){let n=Da(x.doc,x.skeletons),t={};for(let e of Object.keys(x.doc.actors))t[e]=new fi(x.skeletons[n.skelKeys[e]]);Yr={version:x.version,source:n.source,skelKeys:n.skelKeys,rigs:t,frames:new Map}}return Yr}function Ce(n){let t=ku();return x.skeletons[t.skelKeys[n]]}function mn(n){let t=ku(),e=Math.round(n*1e3);if(t.frames.has(e))return t.frames.get(e);let i=Object.keys(x.doc.actors),s=t.source.contacts?3:1,r=null,a=null;for(let o=0;o<s;o++){let c={at(l,u,d=[0,0,0]){let p=Ce(l),g=p.idx(u),_=r?.[l];return _?Ut(_.world.P[g],kt(Et(Rt(_.mover.q,_.D[g])),d)):Ut(p.restP[g],d)}},h=t.source.pose(n,c);a={};for(let l of i){let u=t.rigs[l].solve(h[l]||{});u.world=cs(u),u.pose=h[l],a[l]=u}r=a}return t.frames.size>400&&t.frames.clear(),t.frames.set(e,a),a}var Ka=null,Ya=null;function bp(){clearTimeout(Ka),x.doc&&(x.checking=!0,Ka=setTimeout(jr,350))}function jr(){if(clearTimeout(Ka),!!x.doc){try{let n=cu(x.doc,x.skeletons);Ya=n,x.findings=gu(x.doc,n,Fa(x.doc,n)),x.light=_u(x.findings),x.checkError=null}catch(n){x.findings=[],x.light="error",x.checkError=n.message,console.error("checks",n)}x.checking=!1,pn("checks")}}function gn(n){let t=x.doc?x.doc.duration:0;x.t=Math.max(0,Math.min(t,n)),pn("time")}function He(n){Object.assign(x,n),pn("selection")}var nh="169";var wp=0,Uu=1,Ep=2;var Hd=1,Ap=2,ii=3,wi=0,en=1,si=2,Mi=0,Ts=1,Nu=2,Fu=3,Ou=4,Tp=5,Yi=100,Rp=101,Cp=102,Lp=103,Pp=104,Ip=200,Dp=201,kp=202,Up=203,Ic=204,Dc=205,Np=206,Fp=207,Op=208,Bp=209,zp=210,Hp=211,Vp=212,Gp=213,Wp=214,kc=0,Uc=1,Nc=2,Ps=3,Fc=4,Oc=5,Bc=6,zc=7,Vd=0,Kp=1,$p=2,bi=0,Xp=1,qp=2,Yp=3,Zp=4,jp=5,Jp=6,Qp=7;var Gd=300,Is=301,Ds=302,Hc=303,Vc=304,aa=306,Gc=1e3,Ji=1001,Wc=1002,xn=1003,tm=1004;var Jr=1005;var kn=1006,Za=1007;var Qi=1008;var ai=1009,Wd=1010,Kd=1011,gr=1012,ih=1013,ts=1014,ri=1015,wr=1016,sh=1017,rh=1018,ks=1020,$d=35902,Xd=1021,qd=1022,Un=1023,Yd=1024,Zd=1025,Rs=1026,Us=1027,jd=1028,oh=1029,Jd=1030,ah=1031;var ch=1033,wo=33776,Eo=33777,Ao=33778,To=33779,Kc=35840,$c=35841,Xc=35842,qc=35843,Yc=36196,Zc=37492,jc=37496,Jc=37808,Qc=37809,tl=37810,el=37811,nl=37812,il=37813,sl=37814,rl=37815,ol=37816,al=37817,cl=37818,ll=37819,hl=37820,ul=37821,Ro=36492,dl=36494,fl=36495,Qd=36283,pl=36284,ml=36285,gl=36286;var Lo=2300,_l=2301,ja=2302,Bu=2400,zu=2401,Hu=2402;var em=3200,nm=3201;var tf=0,im=1,Si="",Wn="srgb",Li="srgb-linear",lh="display-p3",ca="display-p3-linear",Po="linear",ge="srgb",Io="rec709",Do="p3";var ds=7680;var Vu=519,sm=512,rm=513,om=514,ef=515,am=516,cm=517,lm=518,hm=519,Gu=35044;var Wu="300 es",oi=2e3,ko=2001,Ei=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Ja=Math.PI/180,xl=180/Math.PI;function Er(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function Ve(n,t,e){return Math.max(t,Math.min(e,n))}function um(n,t){return(n%t+t)%t}function Qa(n,t,e){return(1-e)*n+e*t}function rr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function tn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Ct=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Ve(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Yt=class n{constructor(t,e,i,s,r,a,o,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,h)}set(t,e,i,s,r,a,o,c,h){let l=this.elements;return l[0]=t,l[1]=s,l[2]=o,l[3]=e,l[4]=r,l[5]=c,l[6]=i,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],l=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],S=s[1],v=s[4],M=s[7],E=s[2],C=s[5],R=s[8];return r[0]=a*_+o*S+c*E,r[3]=a*m+o*v+c*C,r[6]=a*f+o*M+c*R,r[1]=h*_+l*S+u*E,r[4]=h*m+l*v+u*C,r[7]=h*f+l*M+u*R,r[2]=d*_+p*S+g*E,r[5]=d*m+p*v+g*C,r[8]=d*f+p*M+g*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8];return e*a*l-e*o*h-i*r*l+i*o*c+s*r*h-s*a*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=l*a-o*h,d=o*c-l*r,p=h*r-a*c,g=e*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*h-l*i)*_,t[2]=(o*i-s*a)*_,t[3]=d*_,t[4]=(l*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(i*c-h*e)*_,t[8]=(a*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+t,-s*h,s*c,-s*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(tc.makeScale(t,e)),this}rotate(t){return this.premultiply(tc.makeRotation(-t)),this}translate(t,e){return this.premultiply(tc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},tc=new Yt;function nf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Uo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function dm(){let n=Uo("canvas");return n.style.display="block",n}var Ku={};function Co(n){n in Ku||(Ku[n]=!0,console.warn(n))}function fm(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}function pm(n){let t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function mm(n){let t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var $u=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Xu=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),or={[Li]:{transfer:Po,primaries:Io,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[Wn]:{transfer:ge,primaries:Io,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[ca]:{transfer:Po,primaries:Do,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Xu),fromReference:n=>n.applyMatrix3($u)},[lh]:{transfer:ge,primaries:Do,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Xu),fromReference:n=>n.applyMatrix3($u).convertLinearToSRGB()}},gm=new Set([Li,ca]),ce={enabled:!0,_workingColorSpace:Li,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!gm.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;let i=or[t].toReference,s=or[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return or[n].primaries},getTransfer:function(n){return n===Si?Po:or[n].transfer},getLuminanceCoefficients:function(n,t=this._workingColorSpace){return n.fromArray(or[t].luminanceCoefficients)}};function Cs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ec(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var fs,vl=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{fs===void 0&&(fs=Uo("canvas")),fs.width=t.width,fs.height=t.height;let i=fs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=fs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Uo("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Cs(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Cs(e[i]/255)*255):e[i]=Cs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},_m=0,No=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Er(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(nc(s[a].image)):r.push(nc(s[a]))}else r=nc(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function nc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?vl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var xm=0,vn=class n extends Ei{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Ji,s=Ji,r=kn,a=Qi,o=Un,c=ai,h=n.DEFAULT_ANISOTROPY,l=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Er(),this.name="",this.source=new No(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Gd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Gc:t.x=t.x-Math.floor(t.x);break;case Ji:t.x=t.x<0?0:1;break;case Wc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Gc:t.y=t.y-Math.floor(t.y);break;case Ji:t.y=t.y<0?0:1;break;case Wc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=Gd;vn.DEFAULT_ANISOTROPY=1;var be=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,h=c[0],l=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(l-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(h+1)/2,M=(p+1)/2,E=(f+1)/2,C=(l+d)/4,R=(u+_)/4,P=(g+m)/4;return v>M&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=C/i,r=R/i):M>E?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=C/s,r=P/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=R/r,s=P/r),this.set(i,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-l)*(d-l));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-_)/S,this.z=(d-l)/S,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},yl=class extends Ei{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e);let s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new vn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new No(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ci=class extends yl{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Fo=class extends vn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=xn,this.minFilter=xn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Sl=class extends vn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=xn,this.minFilter=xn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ai=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||h!==p||l!==g){let m=1-o,f=c*d+h*p+l*g+u*_,S=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let E=Math.sqrt(v),C=Math.atan2(E,f*S);m=Math.sin(m*C)/E,o=Math.sin(o*C)/E}let M=o*S;if(c=c*m+d*M,h=h*m+p*M,l=l*m+g*M,u=u*m+_*M,m===1-o){let E=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=E,h*=E,l*=E,u*=E}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){let o=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+l*u+c*p-h*d,t[e+1]=c*g+l*d+h*u-o*p,t[e+2]=h*g+l*p+o*d-c*u,t[e+3]=l*g-o*u-c*d-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(i/2),l=o(s/2),u=o(r/2),d=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"YXZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"ZXY":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"ZYX":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"YZX":this._x=d*l*u+h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u-d*p*g;break;case"XZY":this._x=d*l*u-h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],h=e[2],l=e[6],u=e[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ve(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,h=e._z,l=e._w;return this._x=i*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-i*h,this._z=r*l+a*h+i*c-s*o,this._w=a*l-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-e)*l)/h,d=Math.sin(e*l)/h;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*s-o*i),l=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*h+a*u-o*l,this.y=i+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ic.copy(this).projectOnVector(t),this.sub(ic)}reflect(t){return this.sub(ic.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Ve(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ic=new I,qu=new Ai,es=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ln):Ln.fromBufferAttribute(r,a),Ln.applyMatrix4(t.matrixWorld),this.expandByPoint(Ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Qr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qr.copy(i.boundingBox)),Qr.applyMatrix4(t.matrixWorld),this.union(Qr)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ln),Ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ar),to.subVectors(this.max,ar),ps.subVectors(t.a,ar),ms.subVectors(t.b,ar),gs.subVectors(t.c,ar),mi.subVectors(ms,ps),gi.subVectors(gs,ms),Vi.subVectors(ps,gs);let e=[0,-mi.z,mi.y,0,-gi.z,gi.y,0,-Vi.z,Vi.y,mi.z,0,-mi.x,gi.z,0,-gi.x,Vi.z,0,-Vi.x,-mi.y,mi.x,0,-gi.y,gi.x,0,-Vi.y,Vi.x,0];return!sc(e,ps,ms,gs,to)||(e=[1,0,0,0,1,0,0,0,1],!sc(e,ps,ms,gs,to))?!1:(eo.crossVectors(mi,gi),e=[eo.x,eo.y,eo.z],sc(e,ps,ms,gs,to))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Jn=[new I,new I,new I,new I,new I,new I,new I,new I],Ln=new I,Qr=new es,ps=new I,ms=new I,gs=new I,mi=new I,gi=new I,Vi=new I,ar=new I,to=new I,eo=new I,Gi=new I;function sc(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Gi.fromArray(n,r);let o=s.x*Math.abs(Gi.x)+s.y*Math.abs(Gi.y)+s.z*Math.abs(Gi.z),c=t.dot(Gi),h=e.dot(Gi),l=i.dot(Gi);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}var vm=new es,cr=new I,rc=new I,Ns=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):vm.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;cr.subVectors(t,this.center);let e=cr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(cr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(cr.copy(t.center).add(rc)),this.expandByPoint(cr.copy(t.center).sub(rc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Qn=new I,oc=new I,no=new I,_i=new I,ac=new I,io=new I,cc=new I,_r=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Qn.copy(this.origin).addScaledVector(this.direction,e),Qn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){oc.copy(t).add(e).multiplyScalar(.5),no.copy(e).sub(t).normalize(),_i.copy(this.origin).sub(oc);let r=t.distanceTo(e)*.5,a=-this.direction.dot(no),o=_i.dot(this.direction),c=-_i.dot(no),h=_i.lengthSq(),l=Math.abs(1-a*a),u,d,p,g;if(l>0)if(u=a*c-o,d=a*o-c,g=r*l,u>=0)if(d>=-g)if(d<=g){let _=1/l;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+h}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+h):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(oc).addScaledVector(no,d),p}intersectSphere(t,e){Qn.subVectors(t.center,this.origin);let i=Qn.dot(this.direction),s=Qn.dot(Qn)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(i=(t.min.x-d.x)*h,s=(t.max.x-d.x)*h):(i=(t.max.x-d.x)*h,s=(t.min.x-d.x)*h),l>=0?(r=(t.min.y-d.y)*l,a=(t.max.y-d.y)*l):(r=(t.max.y-d.y)*l,a=(t.min.y-d.y)*l),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Qn)!==null}intersectTriangle(t,e,i,s,r){ac.subVectors(e,t),io.subVectors(i,t),cc.crossVectors(ac,io);let a=this.direction.dot(cc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_i.subVectors(this.origin,t);let c=o*this.direction.dot(io.crossVectors(_i,io));if(c<0)return null;let h=o*this.direction.dot(ac.cross(_i));if(h<0||c+h>a)return null;let l=-o*_i.dot(cc);return l<0?null:this.at(l/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ve=class n{constructor(t,e,i,s,r,a,o,c,h,l,u,d,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,h,l,u,d,p,g,_,m)}set(t,e,i,s,r,a,o,c,h,l,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=h,f[6]=l,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/_s.setFromMatrixColumn(t,0).length(),r=1/_s.setFromMatrixColumn(t,1).length(),a=1/_s.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*l,p=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=p+g*h,e[5]=d-_*h,e[9]=-o*c,e[2]=_-d*h,e[6]=g+p*h,e[10]=a*c}else if(t.order==="YXZ"){let d=c*l,p=c*u,g=h*l,_=h*u;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*h,e[1]=a*u,e[5]=a*l,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){let d=c*l,p=c*u,g=h*l,_=h*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*l,e[9]=_-d*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let d=a*l,p=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=g*h-p,e[8]=d*h+_,e[1]=c*u,e[5]=_*h+d,e[9]=p*h-g,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let d=a*c,p=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*l,e[9]=-o*l,e[2]=-h*l,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=a*c,p=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=d*u+_,e[5]=a*l,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*l,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ym,t,Sm)}lookAt(t,e,i){let s=this.elements;return hn.subVectors(t,e),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),xi.crossVectors(i,hn),xi.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),xi.crossVectors(i,hn)),xi.normalize(),so.crossVectors(hn,xi),s[0]=xi.x,s[4]=so.x,s[8]=hn.x,s[1]=xi.y,s[5]=so.y,s[9]=hn.y,s[2]=xi.z,s[6]=so.z,s[10]=hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],l=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],S=i[3],v=i[7],M=i[11],E=i[15],C=s[0],R=s[4],P=s[8],N=s[12],y=s[1],w=s[5],F=s[9],B=s[13],K=s[2],tt=s[6],W=s[10],it=s[14],q=s[3],dt=s[7],xt=s[11],yt=s[15];return r[0]=a*C+o*y+c*K+h*q,r[4]=a*R+o*w+c*tt+h*dt,r[8]=a*P+o*F+c*W+h*xt,r[12]=a*N+o*B+c*it+h*yt,r[1]=l*C+u*y+d*K+p*q,r[5]=l*R+u*w+d*tt+p*dt,r[9]=l*P+u*F+d*W+p*xt,r[13]=l*N+u*B+d*it+p*yt,r[2]=g*C+_*y+m*K+f*q,r[6]=g*R+_*w+m*tt+f*dt,r[10]=g*P+_*F+m*W+f*xt,r[14]=g*N+_*B+m*it+f*yt,r[3]=S*C+v*y+M*K+E*q,r[7]=S*R+v*w+M*tt+E*dt,r[11]=S*P+v*F+M*W+E*xt,r[15]=S*N+v*B+M*it+E*yt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],h=t[13],l=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*u-s*h*u-r*o*d+i*h*d+s*o*p-i*c*p)+_*(+e*c*p-e*h*d+r*a*d-s*a*p+s*h*l-r*c*l)+m*(+e*h*u-e*o*p-r*a*u+i*a*p+r*o*l-i*h*l)+f*(-s*o*l-e*c*u+e*o*d+s*a*u-i*a*d+i*c*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],S=u*m*h-_*d*h+_*c*p-o*m*p-u*c*f+o*d*f,v=g*d*h-l*m*h-g*c*p+a*m*p+l*c*f-a*d*f,M=l*_*h-g*u*h+g*o*p-a*_*p-l*o*f+a*u*f,E=g*u*c-l*_*c-g*o*d+a*_*d+l*o*m-a*u*m,C=e*S+i*v+s*M+r*E;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/C;return t[0]=S*R,t[1]=(_*d*r-u*m*r-_*s*p+i*m*p+u*s*f-i*d*f)*R,t[2]=(o*m*r-_*c*r+_*s*h-i*m*h-o*s*f+i*c*f)*R,t[3]=(u*c*r-o*d*r-u*s*h+i*d*h+o*s*p-i*c*p)*R,t[4]=v*R,t[5]=(l*m*r-g*d*r+g*s*p-e*m*p-l*s*f+e*d*f)*R,t[6]=(g*c*r-a*m*r-g*s*h+e*m*h+a*s*f-e*c*f)*R,t[7]=(a*d*r-l*c*r+l*s*h-e*d*h-a*s*p+e*c*p)*R,t[8]=M*R,t[9]=(g*u*r-l*_*r-g*i*p+e*_*p+l*i*f-e*u*f)*R,t[10]=(a*_*r-g*o*r+g*i*h-e*_*h-a*i*f+e*o*f)*R,t[11]=(l*o*r-a*u*r-l*i*h+e*u*h+a*i*p-e*o*p)*R,t[12]=E*R,t[13]=(l*_*s-g*u*s+g*i*d-e*_*d-l*i*m+e*u*m)*R,t[14]=(g*o*s-a*_*s-g*i*c+e*_*c+a*i*m-e*o*m)*R,t[15]=(a*u*s-l*o*s+l*i*c-e*u*c-a*i*d+e*o*d)*R,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,h=r*a,l=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+i,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,h=r+r,l=a+a,u=o+o,d=r*h,p=r*l,g=r*u,_=a*l,m=a*u,f=o*u,S=c*h,v=c*l,M=c*u,E=i.x,C=i.y,R=i.z;return s[0]=(1-(_+f))*E,s[1]=(p+M)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(p-M)*C,s[5]=(1-(d+f))*C,s[6]=(m+S)*C,s[7]=0,s[8]=(g+v)*R,s[9]=(m-S)*R,s[10]=(1-(d+_))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=_s.set(s[0],s[1],s[2]).length(),a=_s.set(s[4],s[5],s[6]).length(),o=_s.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Pn.copy(this);let h=1/r,l=1/a,u=1/o;return Pn.elements[0]*=h,Pn.elements[1]*=h,Pn.elements[2]*=h,Pn.elements[4]*=l,Pn.elements[5]*=l,Pn.elements[6]*=l,Pn.elements[8]*=u,Pn.elements[9]*=u,Pn.elements[10]*=u,e.setFromRotationMatrix(Pn),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=oi){let c=this.elements,h=2*r/(e-t),l=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s),p,g;if(o===oi)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ko)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=oi){let c=this.elements,h=1/(e-t),l=1/(i-s),u=1/(a-r),d=(e+t)*h,p=(i+s)*l,g,_;if(o===oi)g=(a+r)*u,_=-2*u;else if(o===ko)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},_s=new I,Pn=new ve,ym=new I(0,0,0),Sm=new I(1,1,1),xi=new I,so=new I,hn=new I,Yu=new ve,Zu=new Ai,$n=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ve(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Yu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Yu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zu.setFromEuler(this),this.setFromQuaternion(Zu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$n.DEFAULT_ORDER="XYZ";var xr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Mm=0,ju=new I,xs=new Ai,ti=new ve,ro=new I,lr=new I,bm=new I,wm=new Ai,Ju=new I(1,0,0),Qu=new I(0,1,0),td=new I(0,0,1),ed={type:"added"},Em={type:"removed"},vs={type:"childadded",child:null},lc={type:"childremoved",child:null},$e=class n extends Ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=Er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new I,e=new $n,i=new Ai,s=new I(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ve},normalMatrix:{value:new Yt}}),this.matrix=new ve,this.matrixWorld=new ve,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.multiply(xs),this}rotateOnWorldAxis(t,e){return xs.setFromAxisAngle(t,e),this.quaternion.premultiply(xs),this}rotateX(t){return this.rotateOnAxis(Ju,t)}rotateY(t){return this.rotateOnAxis(Qu,t)}rotateZ(t){return this.rotateOnAxis(td,t)}translateOnAxis(t,e){return ju.copy(t).applyQuaternion(this.quaternion),this.position.add(ju.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ju,t)}translateY(t){return this.translateOnAxis(Qu,t)}translateZ(t){return this.translateOnAxis(td,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ro.copy(t):ro.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(lr,ro,this.up):ti.lookAt(ro,lr,this.up),this.quaternion.setFromRotationMatrix(ti),s&&(ti.extractRotation(s.matrixWorld),xs.setFromRotationMatrix(ti),this.quaternion.premultiply(xs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ed),vs.child=t,this.dispatchEvent(vs),vs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Em),lc.child=t,this.dispatchEvent(lc),lc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ti.multiply(t.parent.matrixWorld)),t.applyMatrix4(ti),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ed),vs.child=t,this.dispatchEvent(vs),vs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,t,bm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,wm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),h=a(t.textures),l=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let h in o){let l=o[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};$e.DEFAULT_UP=new I(0,1,0);$e.DEFAULT_MATRIX_AUTO_UPDATE=!0;$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var In=new I,ei=new I,hc=new I,ni=new I,ys=new I,Ss=new I,nd=new I,uc=new I,dc=new I,fc=new I,pc=new be,mc=new be,gc=new be,Zi=class n{constructor(t=new I,e=new I,i=new I){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),In.subVectors(t,e),s.cross(In);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){In.subVectors(s,e),ei.subVectors(i,e),hc.subVectors(t,e);let a=In.dot(In),o=In.dot(ei),c=In.dot(hc),h=ei.dot(ei),l=ei.dot(hc),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(h*c-o*l)*d,g=(a*l-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,ni)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ni.x),c.addScaledVector(a,ni.y),c.addScaledVector(o,ni.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return pc.setScalar(0),mc.setScalar(0),gc.setScalar(0),pc.fromBufferAttribute(t,e),mc.fromBufferAttribute(t,i),gc.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(pc,r.x),a.addScaledVector(mc,r.y),a.addScaledVector(gc,r.z),a}static isFrontFacing(t,e,i,s){return In.subVectors(i,e),ei.subVectors(t,e),In.cross(ei).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),In.cross(ei).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,a,o;ys.subVectors(s,i),Ss.subVectors(r,i),uc.subVectors(t,i);let c=ys.dot(uc),h=Ss.dot(uc);if(c<=0&&h<=0)return e.copy(i);dc.subVectors(t,s);let l=ys.dot(dc),u=Ss.dot(dc);if(l>=0&&u<=l)return e.copy(s);let d=c*u-l*h;if(d<=0&&c>=0&&l<=0)return a=c/(c-l),e.copy(i).addScaledVector(ys,a);fc.subVectors(t,r);let p=ys.dot(fc),g=Ss.dot(fc);if(g>=0&&p<=g)return e.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),e.copy(i).addScaledVector(Ss,o);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return nd.subVectors(r,s),o=(u-l)/(u-l+(p-g)),e.copy(s).addScaledVector(nd,o);let f=1/(m+_+d);return a=_*f,o=d*f,e.copy(i).addScaledVector(ys,a).addScaledVector(Ss,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},sf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vi={h:0,s:0,l:0},oo={h:0,s:0,l:0};function _c(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Zt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Wn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ce.workingColorSpace){return this.r=t,this.g=e,this.b=i,ce.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ce.workingColorSpace){if(t=um(t,1),e=Ve(e,0,1),i=Ve(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=_c(a,r,t+1/3),this.g=_c(a,r,t),this.b=_c(a,r,t-1/3)}return ce.toWorkingColorSpace(this,s),this}setStyle(t,e=Wn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Wn){let i=sf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Cs(t.r),this.g=Cs(t.g),this.b=Cs(t.b),this}copyLinearToSRGB(t){return this.r=ec(t.r),this.g=ec(t.g),this.b=ec(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Wn){return ce.fromWorkingColorSpace(Ke.copy(this),t),Math.round(Ve(Ke.r*255,0,255))*65536+Math.round(Ve(Ke.g*255,0,255))*256+Math.round(Ve(Ke.b*255,0,255))}getHexString(t=Wn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.fromWorkingColorSpace(Ke.copy(this),e);let i=Ke.r,s=Ke.g,r=Ke.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,h,l=(o+a)/2;if(o===a)c=0,h=0;else{let u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=ce.workingColorSpace){return ce.fromWorkingColorSpace(Ke.copy(this),e),t.r=Ke.r,t.g=Ke.g,t.b=Ke.b,t}getStyle(t=Wn){ce.fromWorkingColorSpace(Ke.copy(this),t);let e=Ke.r,i=Ke.g,s=Ke.b;return t!==Wn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(vi),this.setHSL(vi.h+t,vi.s+e,vi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(vi),t.getHSL(oo);let i=Qa(vi.h,oo.h,e),s=Qa(vi.s,oo.s,e),r=Qa(vi.l,oo.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ke=new Zt;Zt.NAMES=sf;var Am=0,Ti=class extends Ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=Er(),this.name="",this.type="Material",this.blending=Ts,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ic,this.blendDst=Dc,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(i.blending=this.blending),this.side!==wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ic&&(i.blendSrc=this.blendSrc),this.blendDst!==Dc&&(i.blendDst=this.blendDst),this.blendEquation!==Yi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ps&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Nn=class extends Ti{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=Vd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Le=new I,ao=new Ct,nn=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Gu,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ao.fromBufferAttribute(this,e),ao.applyMatrix3(t),this.setXY(e,ao.x,ao.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=rr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=tn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=rr(e,this.array)),e}setX(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=rr(e,this.array)),e}setY(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=rr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=rr(e,this.array)),e}setW(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),i=tn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),i=tn(i,this.array),s=tn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),i=tn(i,this.array),s=tn(s,this.array),r=tn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gu&&(t.usage=this.usage),t}};var Oo=class extends nn{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Bo=class extends nn{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var _e=class extends nn{constructor(t,e,i){super(new Float32Array(t),e,i)}},Tm=0,_n=new ve,xc=new $e,Ms=new I,un=new es,hr=new es,Fe=new I,Xe=class n extends Ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=Er(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(nf(t)?Bo:Oo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Yt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return _n.makeRotationFromQuaternion(t),this.applyMatrix4(_n),this}rotateX(t){return _n.makeRotationX(t),this.applyMatrix4(_n),this}rotateY(t){return _n.makeRotationY(t),this.applyMatrix4(_n),this}rotateZ(t){return _n.makeRotationZ(t),this.applyMatrix4(_n),this}translate(t,e,i){return _n.makeTranslation(t,e,i),this.applyMatrix4(_n),this}scale(t,e,i){return _n.makeScale(t,e,i),this.applyMatrix4(_n),this}lookAt(t){return xc.lookAt(t),xc.updateMatrix(),this.applyMatrix4(xc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ms).negate(),this.translate(Ms.x,Ms.y,Ms.z),this}setFromPoints(t){let e=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new _e(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];un.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ns);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let i=this.boundingSphere.center;if(un.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];hr.setFromBufferAttribute(o),this.morphTargetsRelative?(Fe.addVectors(un.min,hr.min),un.expandByPoint(Fe),Fe.addVectors(un.max,hr.max),un.expandByPoint(Fe)):(un.expandByPoint(hr.min),un.expandByPoint(hr.max))}un.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Fe.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Fe));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Fe.fromBufferAttribute(o,h),c&&(Ms.fromBufferAttribute(t,h),Fe.add(Ms)),s=Math.max(s,i.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<i.count;P++)o[P]=new I,c[P]=new I;let h=new I,l=new I,u=new I,d=new Ct,p=new Ct,g=new Ct,_=new I,m=new I;function f(P,N,y){h.fromBufferAttribute(i,P),l.fromBufferAttribute(i,N),u.fromBufferAttribute(i,y),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,N),g.fromBufferAttribute(r,y),l.sub(h),u.sub(h),p.sub(d),g.sub(d);let w=1/(p.x*g.y-g.x*p.y);isFinite(w)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(w),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(w),o[P].add(_),o[N].add(_),o[y].add(_),c[P].add(m),c[N].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,N=S.length;P<N;++P){let y=S[P],w=y.start,F=y.count;for(let B=w,K=w+F;B<K;B+=3)f(t.getX(B+0),t.getX(B+1),t.getX(B+2))}let v=new I,M=new I,E=new I,C=new I;function R(P){E.fromBufferAttribute(s,P),C.copy(E);let N=o[P];v.copy(N),v.sub(E.multiplyScalar(E.dot(N))).normalize(),M.crossVectors(C,N);let w=M.dot(c[P])<0?-1:1;a.setXYZW(P,v.x,v.y,v.z,w)}for(let P=0,N=S.length;P<N;++P){let y=S[P],w=y.start,F=y.count;for(let B=w,K=w+F;B<K;B+=3)R(t.getX(B+0)),R(t.getX(B+1)),R(t.getX(B+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new nn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new I,r=new I,a=new I,o=new I,c=new I,h=new I,l=new I,u=new I;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),o.add(l),c.add(l),h.add(l),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),i.setXYZ(d+0,l.x,l.y,l.z),i.setXYZ(d+1,l.x,l.y,l.z),i.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(o,c){let h=o.array,l=o.itemSize,u=o.normalized,d=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*l;for(let f=0;f<l;f++)d[g++]=h[p++]}return new nn(d,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=t(c,i);e.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){let d=h[l],p=t(d,i);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let h=i[c];t.data.attributes[c]=h.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,d=h.length;u<d;u++){let p=h[u];l.push(p.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let s=t.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(e))}let r=t.morphAttributes;for(let h in r){let l=[],u=r[h];for(let d=0,p=u.length;d<p;d++)l.push(u[d].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let h=0,l=a.length;h<l;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},id=new ve,Wi=new _r,co=new Ns,sd=new I,lo=new I,ho=new I,uo=new I,vc=new I,fo=new I,rd=new I,po=new I,we=class extends $e{constructor(t=new Xe,e=new Nn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){fo.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=o[c],u=r[c];l!==0&&(vc.fromBufferAttribute(u,t),a?fo.addScaledVector(vc,l):fo.addScaledVector(vc.sub(e),l))}e.add(fo)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),co.copy(i.boundingSphere),co.applyMatrix4(r),Wi.copy(t.ray).recast(t.near),!(co.containsPoint(Wi.origin)===!1&&(Wi.intersectSphere(co,sd)===null||Wi.origin.distanceToSquared(sd)>(t.far-t.near)**2))&&(id.copy(r).invert(),Wi.copy(t.ray).applyMatrix4(id),!(i.boundingBox!==null&&Wi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Wi)))}_computeIntersections(t,e,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,E=v;M<E;M+=3){let C=o.getX(M),R=o.getX(M+1),P=o.getX(M+2);s=mo(this,f,t,i,h,l,u,C,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=o.getX(m),v=o.getX(m+1),M=o.getX(m+2);s=mo(this,a,t,i,h,l,u,S,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,E=v;M<E;M+=3){let C=M,R=M+1,P=M+2;s=mo(this,f,t,i,h,l,u,C,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=m,v=m+1,M=m+2;s=mo(this,a,t,i,h,l,u,S,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Rm(n,t,e,i,s,r,a,o){let c;if(t.side===en?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===wi,o),c===null)return null;po.copy(o),po.applyMatrix4(n.matrixWorld);let h=e.ray.origin.distanceTo(po);return h<e.near||h>e.far?null:{distance:h,point:po.clone(),object:n}}function mo(n,t,e,i,s,r,a,o,c,h){n.getVertexPosition(o,lo),n.getVertexPosition(c,ho),n.getVertexPosition(h,uo);let l=Rm(n,t,e,i,lo,ho,uo,rd);if(l){let u=new I;Zi.getBarycoord(rd,lo,ho,uo,u),s&&(l.uv=Zi.getInterpolatedAttribute(s,o,c,h,u,new Ct)),r&&(l.uv1=Zi.getInterpolatedAttribute(r,o,c,h,u,new Ct)),a&&(l.normal=Zi.getInterpolatedAttribute(a,o,c,h,u,new I),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let d={a:o,b:c,c:h,normal:new I,materialIndex:0};Zi.getNormal(lo,ho,uo,d.normal),l.face=d,l.barycoord=u}return l}var vr=class n extends Xe{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],l=[],u=[],d=0,p=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new _e(h,3)),this.setAttribute("normal",new _e(l,3)),this.setAttribute("uv",new _e(u,2));function g(_,m,f,S,v,M,E,C,R,P,N){let y=M/R,w=E/P,F=M/2,B=E/2,K=C/2,tt=R+1,W=P+1,it=0,q=0,dt=new I;for(let xt=0;xt<W;xt++){let yt=xt*w-B;for(let te=0;te<tt;te++){let ie=te*y-F;dt[_]=ie*S,dt[m]=yt*v,dt[f]=K,h.push(dt.x,dt.y,dt.z),dt[_]=0,dt[m]=0,dt[f]=C>0?1:-1,l.push(dt.x,dt.y,dt.z),u.push(te/R),u.push(1-xt/P),it+=1}}for(let xt=0;xt<P;xt++)for(let yt=0;yt<R;yt++){let te=d+yt+tt*xt,ie=d+yt+tt*(xt+1),j=d+(yt+1)+tt*(xt+1),st=d+(yt+1)+tt*xt;c.push(te,ie,st),c.push(ie,j,st),q+=6}o.addGroup(p,q,N),p+=q,d+=it}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Fs(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ye(n){let t={};for(let e=0;e<n.length;e++){let i=Fs(n[e]);for(let s in i)t[s]=i[s]}return t}function Cm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function rf(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}var Lm={clone:Fs,merge:Ye},Pm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Im=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xn=class extends Ti{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pm,this.fragmentShader=Im,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fs(t.uniforms),this.uniformsGroups=Cm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},zo=class extends $e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ve,this.projectionMatrix=new ve,this.projectionMatrixInverse=new ve,this.coordinateSystem=oi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},yi=new I,od=new Ct,ad=new Ct,Ze=class extends zo{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=xl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ja*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return xl*2*Math.atan(Math.tan(Ja*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(yi.x,yi.y).multiplyScalar(-t/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(yi.x,yi.y).multiplyScalar(-t/yi.z)}getViewSize(t,e){return this.getViewBounds(t,od,ad),e.subVectors(ad,od)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ja*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},bs=-90,ws=1,Ml=class extends $e{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ze(bs,ws,t,e);s.layers=this.layers,this.add(s);let r=new Ze(bs,ws,t,e);r.layers=this.layers,this.add(r);let a=new Ze(bs,ws,t,e);a.layers=this.layers,this.add(a);let o=new Ze(bs,ws,t,e);o.layers=this.layers,this.add(o);let c=new Ze(bs,ws,t,e);c.layers=this.layers,this.add(c);let h=new Ze(bs,ws,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(let h of e)this.remove(h);if(t===oi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,l]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,h),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,l),t.setRenderTarget(u,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Ho=class extends vn{constructor(t,e,i,s,r,a,o,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Is,super(t,e,i,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},bl=class extends ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ho(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:kn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new vr(5,5,5),r=new Xn({name:"CubemapFromEquirect",uniforms:Fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:en,blending:Mi});r.uniforms.tEquirect.value=e;let a=new we(s,r),o=e.minFilter;return e.minFilter===Qi&&(e.minFilter=kn),new Ml(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}},yc=new I,Dm=new I,km=new Yt,Dn=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=yc.subVectors(i,e).cross(Dm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(yc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||km.getNormalMatrix(t),s=this.coplanarPoint(yc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ki=new Ns,go=new I,yr=class{constructor(t=new Dn,e=new Dn,i=new Dn,s=new Dn,r=new Dn,a=new Dn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=oi){let i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],S=s[13],v=s[14],M=s[15];if(i[0].setComponents(c-r,d-h,m-p,M-f).normalize(),i[1].setComponents(c+r,d+h,m+p,M+f).normalize(),i[2].setComponents(c+a,d+l,m+g,M+S).normalize(),i[3].setComponents(c-a,d-l,m-g,M-S).normalize(),i[4].setComponents(c-o,d-u,m-_,M-v).normalize(),e===oi)i[5].setComponents(c+o,d+u,m+_,M+v).normalize();else if(e===ko)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ki.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ki.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ki)}intersectsSprite(t){return Ki.center.set(0,0,0),Ki.radius=.7071067811865476,Ki.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ki)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(go.x=s.normal.x>0?t.max.x:t.min.x,go.y=s.normal.y>0?t.max.y:t.min.y,go.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(go)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function of(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Um(n){let t=new WeakMap;function e(o,c){let h=o.array,l=o.usage,u=h.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,h,l),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let l=t.get(o);(!l||l.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=t.get(o);if(h===void 0)t.set(o,e(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Os=class n extends Xe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),h=o+1,l=c+1,u=t/o,d=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<l;f++){let S=f*d-a;for(let v=0;v<h;v++){let M=v*u-r;g.push(M,-S,0),_.push(0,0,1),m.push(v/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<o;S++){let v=S+h*f,M=S+h*(f+1),E=S+1+h*(f+1),C=S+1+h*f;p.push(v,M,C),p.push(M,E,C)}this.setIndex(p),this.setAttribute("position",new _e(g,3)),this.setAttribute("normal",new _e(_,3)),this.setAttribute("uv",new _e(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Nm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Om=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Gm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Km=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$m=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ym=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ng=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ig=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,sg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,rg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,og=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ag=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ug=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dg="gl_FragColor = linearToOutputTexel( gl_FragColor );",fg=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,mg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_g=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,wg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Eg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ag=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Rg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Cg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ig=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ug=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ng=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Fg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Og=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Wg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Kg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$g=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Yg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Jg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,t0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,e0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,s0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,r0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,o0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,a0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,l0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,h0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,u0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,d0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,f0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,p0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,m0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,g0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,x0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,v0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,y0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,S0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,M0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,b0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,w0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,E0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,T0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,R0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,C0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,L0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,P0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,I0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,k0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,U0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,N0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,z0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,V0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,G0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,W0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,q0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Y0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Z0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,J0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Q0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,t_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,n_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,i_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,s_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,o_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,h_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,u_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,f_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,p_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:Nm,alphahash_pars_fragment:Fm,alphamap_fragment:Om,alphamap_pars_fragment:Bm,alphatest_fragment:zm,alphatest_pars_fragment:Hm,aomap_fragment:Vm,aomap_pars_fragment:Gm,batching_pars_vertex:Wm,batching_vertex:Km,begin_vertex:$m,beginnormal_vertex:Xm,bsdfs:qm,iridescence_fragment:Ym,bumpmap_pars_fragment:Zm,clipping_planes_fragment:jm,clipping_planes_pars_fragment:Jm,clipping_planes_pars_vertex:Qm,clipping_planes_vertex:tg,color_fragment:eg,color_pars_fragment:ng,color_pars_vertex:ig,color_vertex:sg,common:rg,cube_uv_reflection_fragment:og,defaultnormal_vertex:ag,displacementmap_pars_vertex:cg,displacementmap_vertex:lg,emissivemap_fragment:hg,emissivemap_pars_fragment:ug,colorspace_fragment:dg,colorspace_pars_fragment:fg,envmap_fragment:pg,envmap_common_pars_fragment:mg,envmap_pars_fragment:gg,envmap_pars_vertex:_g,envmap_physical_pars_fragment:Rg,envmap_vertex:xg,fog_vertex:vg,fog_pars_vertex:yg,fog_fragment:Sg,fog_pars_fragment:Mg,gradientmap_pars_fragment:bg,lightmap_pars_fragment:wg,lights_lambert_fragment:Eg,lights_lambert_pars_fragment:Ag,lights_pars_begin:Tg,lights_toon_fragment:Cg,lights_toon_pars_fragment:Lg,lights_phong_fragment:Pg,lights_phong_pars_fragment:Ig,lights_physical_fragment:Dg,lights_physical_pars_fragment:kg,lights_fragment_begin:Ug,lights_fragment_maps:Ng,lights_fragment_end:Fg,logdepthbuf_fragment:Og,logdepthbuf_pars_fragment:Bg,logdepthbuf_pars_vertex:zg,logdepthbuf_vertex:Hg,map_fragment:Vg,map_pars_fragment:Gg,map_particle_fragment:Wg,map_particle_pars_fragment:Kg,metalnessmap_fragment:$g,metalnessmap_pars_fragment:Xg,morphinstance_vertex:qg,morphcolor_vertex:Yg,morphnormal_vertex:Zg,morphtarget_pars_vertex:jg,morphtarget_vertex:Jg,normal_fragment_begin:Qg,normal_fragment_maps:t0,normal_pars_fragment:e0,normal_pars_vertex:n0,normal_vertex:i0,normalmap_pars_fragment:s0,clearcoat_normal_fragment_begin:r0,clearcoat_normal_fragment_maps:o0,clearcoat_pars_fragment:a0,iridescence_pars_fragment:c0,opaque_fragment:l0,packing:h0,premultiplied_alpha_fragment:u0,project_vertex:d0,dithering_fragment:f0,dithering_pars_fragment:p0,roughnessmap_fragment:m0,roughnessmap_pars_fragment:g0,shadowmap_pars_fragment:_0,shadowmap_pars_vertex:x0,shadowmap_vertex:v0,shadowmask_pars_fragment:y0,skinbase_vertex:S0,skinning_pars_vertex:M0,skinning_vertex:b0,skinnormal_vertex:w0,specularmap_fragment:E0,specularmap_pars_fragment:A0,tonemapping_fragment:T0,tonemapping_pars_fragment:R0,transmission_fragment:C0,transmission_pars_fragment:L0,uv_pars_fragment:P0,uv_pars_vertex:I0,uv_vertex:D0,worldpos_vertex:k0,background_vert:U0,background_frag:N0,backgroundCube_vert:F0,backgroundCube_frag:O0,cube_vert:B0,cube_frag:z0,depth_vert:H0,depth_frag:V0,distanceRGBA_vert:G0,distanceRGBA_frag:W0,equirect_vert:K0,equirect_frag:$0,linedashed_vert:X0,linedashed_frag:q0,meshbasic_vert:Y0,meshbasic_frag:Z0,meshlambert_vert:j0,meshlambert_frag:J0,meshmatcap_vert:Q0,meshmatcap_frag:t_,meshnormal_vert:e_,meshnormal_frag:n_,meshphong_vert:i_,meshphong_frag:s_,meshphysical_vert:r_,meshphysical_frag:o_,meshtoon_vert:a_,meshtoon_frag:c_,points_vert:l_,points_frag:h_,shadow_vert:u_,shadow_frag:d_,sprite_vert:f_,sprite_frag:p_},ht={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Kn={basic:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Zt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:Ye([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:Ye([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Zt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:Ye([ht.points,ht.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:Ye([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:Ye([ht.common,ht.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:Ye([ht.sprite,ht.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:Ye([ht.common,ht.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:Ye([ht.lights,ht.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};Kn.physical={uniforms:Ye([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};var _o={r:0,b:0,g:0},$i=new $n,m_=new ve;function g_(n,t,e,i,s,r,a){let o=new Zt(0),c=r===!0?0:1,h,l,u=null,d=0,p=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?e:t).get(v)),v}function _(S){let v=!1,M=g(S);M===null?f(o,c):M&&M.isColor&&(f(M,1),v=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,v){let M=g(v);M&&(M.isCubeTexture||M.mapping===aa)?(l===void 0&&(l=new we(new vr(1,1,1),new Xn({name:"BackgroundCubeMaterial",uniforms:Fs(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),$i.copy(v.backgroundRotation),$i.x*=-1,$i.y*=-1,$i.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(m_.makeRotationFromEuler($i)),l.material.toneMapped=ce.getTransfer(M.colorSpace)!==ge,(u!==M||d!==M.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,p=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new we(new Os(2,2),new Xn({name:"BackgroundMaterial",uniforms:Fs(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=ce.getTransfer(M.colorSpace)!==ge,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=M,d=M.version,p=n.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null))}function f(S,v){S.getRGB(_o,rf(n)),i.buffers.color.setClear(_o.r,_o.g,_o.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(S,v=1){o.set(S),c=v,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,f(o,c)},render:_,addToRenderList:m}}function __(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,a=!1;function o(y,w,F,B,K){let tt=!1,W=u(B,F,w);r!==W&&(r=W,h(r.object)),tt=p(y,B,F,K),tt&&g(y,B,F,K),K!==null&&t.update(K,n.ELEMENT_ARRAY_BUFFER),(tt||a)&&(a=!1,M(y,w,F,B),K!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function c(){return n.createVertexArray()}function h(y){return n.bindVertexArray(y)}function l(y){return n.deleteVertexArray(y)}function u(y,w,F){let B=F.wireframe===!0,K=i[y.id];K===void 0&&(K={},i[y.id]=K);let tt=K[w.id];tt===void 0&&(tt={},K[w.id]=tt);let W=tt[B];return W===void 0&&(W=d(c()),tt[B]=W),W}function d(y){let w=[],F=[],B=[];for(let K=0;K<e;K++)w[K]=0,F[K]=0,B[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:F,attributeDivisors:B,object:y,attributes:{},index:null}}function p(y,w,F,B){let K=r.attributes,tt=w.attributes,W=0,it=F.getAttributes();for(let q in it)if(it[q].location>=0){let xt=K[q],yt=tt[q];if(yt===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(yt=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(yt=y.instanceColor)),xt===void 0||xt.attribute!==yt||yt&&xt.data!==yt.data)return!0;W++}return r.attributesNum!==W||r.index!==B}function g(y,w,F,B){let K={},tt=w.attributes,W=0,it=F.getAttributes();for(let q in it)if(it[q].location>=0){let xt=tt[q];xt===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(xt=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(xt=y.instanceColor));let yt={};yt.attribute=xt,xt&&xt.data&&(yt.data=xt.data),K[q]=yt,W++}r.attributes=K,r.attributesNum=W,r.index=B}function _(){let y=r.newAttributes;for(let w=0,F=y.length;w<F;w++)y[w]=0}function m(y){f(y,0)}function f(y,w){let F=r.newAttributes,B=r.enabledAttributes,K=r.attributeDivisors;F[y]=1,B[y]===0&&(n.enableVertexAttribArray(y),B[y]=1),K[y]!==w&&(n.vertexAttribDivisor(y,w),K[y]=w)}function S(){let y=r.newAttributes,w=r.enabledAttributes;for(let F=0,B=w.length;F<B;F++)w[F]!==y[F]&&(n.disableVertexAttribArray(F),w[F]=0)}function v(y,w,F,B,K,tt,W){W===!0?n.vertexAttribIPointer(y,w,F,K,tt):n.vertexAttribPointer(y,w,F,B,K,tt)}function M(y,w,F,B){_();let K=B.attributes,tt=F.getAttributes(),W=w.defaultAttributeValues;for(let it in tt){let q=tt[it];if(q.location>=0){let dt=K[it];if(dt===void 0&&(it==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),it==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor)),dt!==void 0){let xt=dt.normalized,yt=dt.itemSize,te=t.get(dt);if(te===void 0)continue;let ie=te.buffer,j=te.type,st=te.bytesPerElement,wt=j===n.INT||j===n.UNSIGNED_INT||dt.gpuType===ih;if(dt.isInterleavedBufferAttribute){let vt=dt.data,Wt=vt.stride,Ft=dt.offset;if(vt.isInstancedInterleavedBuffer){for(let Kt=0;Kt<q.locationSize;Kt++)f(q.location+Kt,vt.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=vt.meshPerAttribute*vt.count)}else for(let Kt=0;Kt<q.locationSize;Kt++)m(q.location+Kt);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let Kt=0;Kt<q.locationSize;Kt++)v(q.location+Kt,yt/q.locationSize,j,xt,Wt*st,(Ft+yt/q.locationSize*Kt)*st,wt)}else{if(dt.isInstancedBufferAttribute){for(let vt=0;vt<q.locationSize;vt++)f(q.location+vt,dt.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let vt=0;vt<q.locationSize;vt++)m(q.location+vt);n.bindBuffer(n.ARRAY_BUFFER,ie);for(let vt=0;vt<q.locationSize;vt++)v(q.location+vt,yt/q.locationSize,j,xt,yt*st,yt/q.locationSize*vt*st,wt)}}else if(W!==void 0){let xt=W[it];if(xt!==void 0)switch(xt.length){case 2:n.vertexAttrib2fv(q.location,xt);break;case 3:n.vertexAttrib3fv(q.location,xt);break;case 4:n.vertexAttrib4fv(q.location,xt);break;default:n.vertexAttrib1fv(q.location,xt)}}}}S()}function E(){P();for(let y in i){let w=i[y];for(let F in w){let B=w[F];for(let K in B)l(B[K].object),delete B[K];delete w[F]}delete i[y]}}function C(y){if(i[y.id]===void 0)return;let w=i[y.id];for(let F in w){let B=w[F];for(let K in B)l(B[K].object),delete B[K];delete w[F]}delete i[y.id]}function R(y){for(let w in i){let F=i[w];if(F[y.id]===void 0)continue;let B=F[y.id];for(let K in B)l(B[K].object),delete B[K];delete F[y.id]}}function P(){N(),a=!0,r!==s&&(r=s,h(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:N,dispose:E,releaseStatesOfGeometry:C,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function x_(n,t,e){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),e.update(l,i,1)}function a(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),e.update(l,i,u))}function o(h,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];e.update(p,i,1)}function c(h,l,u,d){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)a(h[g],l[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_];for(let _=0;_<d.length;_++)e.update(g,i,d[_])}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function v_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Un&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let P=R===wr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==ai&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ri&&!P)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){let R=t.get("EXT_clip_control");R.clipControlEXT(R.LOWER_LEFT_EXT,R.ZERO_TO_ONE_EXT)}let p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:E,maxSamples:C}}function y_(n){let t=this,e=null,i=0,s=!1,r=!1,a=new Dn,o=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=l(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let S=r?0:i,v=S*4,M=f.clippingState||null;c.value=M,M=l(g,d,v,p);for(let E=0;E!==v;++E)M[E]=e[E];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function l(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,M=p;v!==_;++v,M+=4)a.copy(u[v]).applyMatrix4(S,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function S_(n){let t=new WeakMap;function e(a,o){return o===Hc?a.mapping=Is:o===Vc&&(a.mapping=Ds),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Hc||o===Vc)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new bl(c.height);return h.fromEquirectangularTexture(n,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var Vo=class extends zo{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},As=4,cd=[.125,.215,.35,.446,.526,.582],ji=20,Sc=new Vo,ld=new Zt,Mc=null,bc=0,wc=0,Ec=!1,qi=(1+Math.sqrt(5))/2,Es=1/qi,hd=[new I(-qi,Es,0),new I(qi,Es,0),new I(-Es,0,qi),new I(Es,0,qi),new I(0,qi,-Es),new I(0,qi,Es),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Go=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Mc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Ec=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Mc,bc,wc),this._renderer.xr.enabled=Ec,t.scissorTest=!1,xo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Is||t.mapping===Ds?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Mc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Ec=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:kn,minFilter:kn,generateMipmaps:!1,type:wr,format:Un,colorSpace:Li,depthBuffer:!1},s=ud(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ud(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=M_(r)),this._blurMaterial=b_(r,t,e)}return s}_compileMaterial(t){let e=new we(this._lodPlanes[0],t);this._renderer.compile(e,Sc)}_sceneToCubeUV(t,e,i,s){let o=new Ze(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,d=l.toneMapping;l.getClearColor(ld),l.toneMapping=bi,l.autoClear=!1;let p=new Nn({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new we(new vr,p),_=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(ld),_=!0);for(let f=0;f<6;f++){let S=f%3;S===0?(o.up.set(0,c[f],0),o.lookAt(h[f],0,0)):S===1?(o.up.set(0,0,c[f]),o.lookAt(0,h[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,h[f]));let v=this._cubeSize;xo(s,S*v,f>2?v:0,v,v),l.setRenderTarget(s),_&&l.render(g,o),l.render(t,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=d,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Is||t.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new we(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;xo(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Sc)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=hd[(s-r-1)%hd.length];this._blur(t,r-1,r,a,o)}e.autoClear=i}_blur(t,e,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new we(this._lodPlanes[s],h),d=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ji-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):ji;m>ji&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ji}`);let f=[],S=0;for(let R=0;R<ji;++R){let P=R/_,N=Math.exp(-P*P/2);f.push(N),R===0?S+=N:R<m&&(S+=2*N)}for(let R=0;R<f.length;R++)f[R]=f[R]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-i;let M=this._sizeLods[s],E=3*M*(s>v-As?s-v+As:0),C=4*(this._cubeSize-M);xo(e,E,C,3*M,2*M),c.setRenderTarget(e),c.render(u,Sc)}};function M_(n){let t=[],e=[],i=[],s=n,r=n-As+1+cd.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>n-As?c=cd[a-n+As-1]:a===0&&(c=0),i.push(c);let h=1/(o-2),l=-h,u=1+h,d=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,f=1,S=new Float32Array(_*g*p),v=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let C=0;C<p;C++){let R=C%3*2/3-1,P=C>2?0:-1,N=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];S.set(N,_*g*C),v.set(d,m*g*C);let y=[C,C,C,C,C,C];M.set(y,f*g*C)}let E=new Xe;E.setAttribute("position",new nn(S,_)),E.setAttribute("uv",new nn(v,m)),E.setAttribute("faceIndex",new nn(M,f)),t.push(E),s>As&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function ud(n,t,e){let i=new ci(n,t,e);return i.texture.mapping=aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function xo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function b_(n,t,e){let i=new Float32Array(ji),s=new I(0,1,0);return new Xn({name:"SphericalGaussianBlur",defines:{n:ji,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function dd(){return new Xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function fd(){return new Xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function hh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function w_(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){let c=o.mapping,h=c===Hc||c===Vc,l=c===Is||c===Ds;if(h||l){let u=t.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Go(n)),u=h?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return h&&p&&p.height>0||l&&p&&s(p)?(e===null&&(e=new Go(n)),u=h?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function E_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Co("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function A_(n,t,e,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)t.update(d[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],n.ARRAY_BUFFER)}}function h(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let S=p.array;_=p.version;for(let v=0,M=S.length;v<M;v+=3){let E=S[v+0],C=S[v+1],R=S[v+2];d.push(E,C,C,R,R,E)}}else if(g!==void 0){let S=g.array;_=g.version;for(let v=0,M=S.length/3-1;v<M;v+=3){let E=v+0,C=v+1,R=v+2;d.push(E,C,C,R,R,E)}}else return;let m=new(nf(d)?Bo:Oo)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function l(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function T_(n,t,e){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,r,d*a),e.update(p,i,1)}function h(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,d*a,g),e.update(p,i,g))}function l(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function u(d,p,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)h(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,d,0,_,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S];for(let S=0;S<_.length;S++)e.update(f,i,_[S])}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function R_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function C_(n,t,e){let i=new WeakMap,s=new be;function r(a,o,c){let h=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l!==void 0?l.length:0,d=i.get(o);if(d===void 0||d.count!==u){let N=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",N)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let M=o.attributes.position.count*v,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let C=new Float32Array(M*E*4*u),R=new Fo(C,M,E,u);R.type=ri,R.needsUpdate=!0;let P=v*4;for(let y=0;y<u;y++){let w=m[y],F=f[y],B=S[y],K=M*E*4*y;for(let tt=0;tt<w.count;tt++){let W=tt*P;p===!0&&(s.fromBufferAttribute(w,tt),C[K+W+0]=s.x,C[K+W+1]=s.y,C[K+W+2]=s.z,C[K+W+3]=0),g===!0&&(s.fromBufferAttribute(F,tt),C[K+W+4]=s.x,C[K+W+5]=s.y,C[K+W+6]=s.z,C[K+W+7]=0),_===!0&&(s.fromBufferAttribute(B,tt),C[K+W+8]=s.x,C[K+W+9]=s.y,C[K+W+10]=s.z,C[K+W+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new Ct(M,E)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function L_(n,t,e,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return u}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}var Wo=class extends vn{constructor(t,e,i,s,r,a,o,c,h,l=Rs){if(l!==Rs&&l!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Rs&&(i=ts),i===void 0&&l===Us&&(i=ks),super(null,s,r,a,o,c,l,i,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:xn,this.minFilter=c!==void 0?c:xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},af=new vn,pd=new Wo(1,1),cf=new Fo,lf=new Sl,hf=new Ho,md=[],gd=[],_d=new Float32Array(16),xd=new Float32Array(9),vd=new Float32Array(4);function Hs(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=md[s];if(r===void 0&&(r=new Float32Array(s),md[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function De(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ke(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function la(n,t){let e=gd[t];e===void 0&&(e=new Int32Array(t),gd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function P_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function I_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2fv(this.addr,t),ke(e,t)}}function D_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;n.uniform3fv(this.addr,t),ke(e,t)}}function k_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4fv(this.addr,t),ke(e,t)}}function U_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(De(e,i))return;vd.set(i),n.uniformMatrix2fv(this.addr,!1,vd),ke(e,i)}}function N_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(De(e,i))return;xd.set(i),n.uniformMatrix3fv(this.addr,!1,xd),ke(e,i)}}function F_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(De(e,i))return;_d.set(i),n.uniformMatrix4fv(this.addr,!1,_d),ke(e,i)}}function O_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function B_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2iv(this.addr,t),ke(e,t)}}function z_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;n.uniform3iv(this.addr,t),ke(e,t)}}function H_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4iv(this.addr,t),ke(e,t)}}function V_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function G_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2uiv(this.addr,t),ke(e,t)}}function W_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;n.uniform3uiv(this.addr,t),ke(e,t)}}function K_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4uiv(this.addr,t),ke(e,t)}}function $_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(pd.compareFunction=ef,r=pd):r=af,e.setTexture2D(t||r,s)}function X_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||lf,s)}function q_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||hf,s)}function Y_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||cf,s)}function Z_(n){switch(n){case 5126:return P_;case 35664:return I_;case 35665:return D_;case 35666:return k_;case 35674:return U_;case 35675:return N_;case 35676:return F_;case 5124:case 35670:return O_;case 35667:case 35671:return B_;case 35668:case 35672:return z_;case 35669:case 35673:return H_;case 5125:return V_;case 36294:return G_;case 36295:return W_;case 36296:return K_;case 35678:case 36198:case 36298:case 36306:case 35682:return $_;case 35679:case 36299:case 36307:return X_;case 35680:case 36300:case 36308:case 36293:return q_;case 36289:case 36303:case 36311:case 36292:return Y_}}function j_(n,t){n.uniform1fv(this.addr,t)}function J_(n,t){let e=Hs(t,this.size,2);n.uniform2fv(this.addr,e)}function Q_(n,t){let e=Hs(t,this.size,3);n.uniform3fv(this.addr,e)}function tx(n,t){let e=Hs(t,this.size,4);n.uniform4fv(this.addr,e)}function ex(n,t){let e=Hs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function nx(n,t){let e=Hs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function ix(n,t){let e=Hs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function sx(n,t){n.uniform1iv(this.addr,t)}function rx(n,t){n.uniform2iv(this.addr,t)}function ox(n,t){n.uniform3iv(this.addr,t)}function ax(n,t){n.uniform4iv(this.addr,t)}function cx(n,t){n.uniform1uiv(this.addr,t)}function lx(n,t){n.uniform2uiv(this.addr,t)}function hx(n,t){n.uniform3uiv(this.addr,t)}function ux(n,t){n.uniform4uiv(this.addr,t)}function dx(n,t,e){let i=this.cache,s=t.length,r=la(e,s);De(i,r)||(n.uniform1iv(this.addr,r),ke(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||af,r[a])}function fx(n,t,e){let i=this.cache,s=t.length,r=la(e,s);De(i,r)||(n.uniform1iv(this.addr,r),ke(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||lf,r[a])}function px(n,t,e){let i=this.cache,s=t.length,r=la(e,s);De(i,r)||(n.uniform1iv(this.addr,r),ke(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||hf,r[a])}function mx(n,t,e){let i=this.cache,s=t.length,r=la(e,s);De(i,r)||(n.uniform1iv(this.addr,r),ke(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||cf,r[a])}function gx(n){switch(n){case 5126:return j_;case 35664:return J_;case 35665:return Q_;case 35666:return tx;case 35674:return ex;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return rx;case 35668:case 35672:return ox;case 35669:case 35673:return ax;case 5125:return cx;case 36294:return lx;case 36295:return hx;case 36296:return ux;case 35678:case 36198:case 36298:case 36306:case 35682:return dx;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}var wl=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Z_(e.type)}},El=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gx(e.type)}},Al=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],i)}}},Ac=/(\w+)(\])?(\[|\.)?/g;function yd(n,t){n.seq.push(t),n.map[t.id]=t}function _x(n,t,e){let i=n.name,s=i.length;for(Ac.lastIndex=0;;){let r=Ac.exec(i),a=Ac.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){yd(e,h===void 0?new wl(o,n,t):new El(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new Al(o),yd(e,u)),e=u}}}var Ls=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);_x(r,a,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&i.push(a)}return i}};function Sd(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var xx=37297,vx=0;function yx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function Sx(n){let t=ce.getPrimaries(ce.workingColorSpace),e=ce.getPrimaries(n),i;switch(t===e?i="":t===Do&&e===Io?i="LinearDisplayP3ToLinearSRGB":t===Io&&e===Do&&(i="LinearSRGBToLinearDisplayP3"),n){case Li:case ca:return[i,"LinearTransferOETF"];case Wn:case lh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Md(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+yx(n.getShaderSource(t),a)}else return s}function Mx(n,t){let e=Sx(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function bx(n,t){let e;switch(t){case Xp:e="Linear";break;case qp:e="Reinhard";break;case Yp:e="Cineon";break;case Zp:e="ACESFilmic";break;case Jp:e="AgX";break;case Qp:e="Neutral";break;case jp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var vo=new I;function wx(){ce.getLuminanceCoefficients(vo);let n=vo.x.toFixed(4),t=vo.y.toFixed(4),e=vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ex(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dr).join(`
`)}function Ax(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Tx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function dr(n){return n!==""}function bd(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Rx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Tl(n){return n.replace(Rx,Lx)}var Cx=new Map;function Lx(n,t){let e=qt[t];if(e===void 0){let i=Cx.get(t);if(i!==void 0)e=qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Tl(e)}var Px=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ed(n){return n.replace(Px,Ix)}function Ix(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ad(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Dx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Hd?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ap?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ii&&(t="SHADOWMAP_TYPE_VSM"),t}function kx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case Ds:t="ENVMAP_TYPE_CUBE";break;case aa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ux(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ds:t="ENVMAP_MODE_REFRACTION";break}return t}function Nx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Vd:t="ENVMAP_BLENDING_MULTIPLY";break;case Kp:t="ENVMAP_BLENDING_MIX";break;case $p:t="ENVMAP_BLENDING_ADD";break}return t}function Fx(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Ox(n,t,e,i){let s=n.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=Dx(e),h=kx(e),l=Ux(e),u=Nx(e),d=Fx(e),p=Ex(e),g=Ax(r),_=s.createProgram(),m,f,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(dr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(dr).join(`
`),f.length>0&&(f+=`
`)):(m=[Ad(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dr).join(`
`),f=[Ad(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==bi?"#define TONE_MAPPING":"",e.toneMapping!==bi?qt.tonemapping_pars_fragment:"",e.toneMapping!==bi?bx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Mx("linearToOutputTexel",e.outputColorSpace),wx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(dr).join(`
`)),a=Tl(a),a=bd(a,e),a=wd(a,e),o=Tl(o),o=bd(o,e),o=wd(o,e),a=Ed(a),o=Ed(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Wu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let v=S+m+a,M=S+f+o,E=Sd(s,s.VERTEX_SHADER,v),C=Sd(s,s.FRAGMENT_SHADER,M);s.attachShader(_,E),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(w){if(n.debug.checkShaderErrors){let F=s.getProgramInfoLog(_).trim(),B=s.getShaderInfoLog(E).trim(),K=s.getShaderInfoLog(C).trim(),tt=!0,W=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(tt=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,E,C);else{let it=Md(s,E,"vertex"),q=Md(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+F+`
`+it+`
`+q)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(B===""||K==="")&&(W=!1);W&&(w.diagnostics={runnable:tt,programLog:F,vertexShader:{log:B,prefix:m},fragmentShader:{log:K,prefix:f}})}s.deleteShader(E),s.deleteShader(C),P=new Ls(s,_),N=Tx(s,_)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let N;this.getAttributes=function(){return N===void 0&&R(this),N};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,xx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=C,this}var Bx=0,Rl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Cl(t),e.set(t,i)),i}},Cl=class{constructor(t){this.id=Bx++,this.code=t,this.usedTimes=0}};function zx(n,t,e,i,s,r,a){let o=new xr,c=new Rl,h=new Set,l=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,p=s.vertexTextures,g=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return h.add(y),y===0?"uv":`uv${y}`}function f(y,w,F,B,K){let tt=B.fog,W=K.geometry,it=y.isMeshStandardMaterial?B.environment:null,q=(y.isMeshStandardMaterial?e:t).get(y.envMap||it),dt=q&&q.mapping===aa?q.image.height:null,xt=_[y.type];y.precision!==null&&(g=s.getMaxPrecision(y.precision),g!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",g,"instead."));let yt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,te=yt!==void 0?yt.length:0,ie=0;W.morphAttributes.position!==void 0&&(ie=1),W.morphAttributes.normal!==void 0&&(ie=2),W.morphAttributes.color!==void 0&&(ie=3);let j,st,wt,vt;if(xt){let Qe=Kn[xt];j=Qe.vertexShader,st=Qe.fragmentShader}else j=y.vertexShader,st=y.fragmentShader,c.update(y),wt=c.getVertexShaderID(y),vt=c.getFragmentShaderID(y);let Wt=n.getRenderTarget(),Ft=K.isInstancedMesh===!0,Kt=K.isBatchedMesh===!0,se=!!y.map,Qt=!!y.matcap,T=!!q,et=!!y.aoMap,Z=!!y.lightMap,at=!!y.bumpMap,rt=!!y.normalMap,ut=!!y.displacementMap,nt=!!y.emissiveMap,L=!!y.metalnessMap,b=!!y.roughnessMap,O=y.anisotropy>0,X=y.clearcoat>0,J=y.dispersion>0,Y=y.iridescence>0,At=y.sheen>0,lt=y.transmission>0,ft=O&&!!y.anisotropyMap,Jt=X&&!!y.clearcoatMap,ot=X&&!!y.clearcoatNormalMap,Mt=X&&!!y.clearcoatRoughnessMap,Vt=Y&&!!y.iridescenceMap,Gt=Y&&!!y.iridescenceThicknessMap,bt=At&&!!y.sheenColorMap,ee=At&&!!y.sheenRoughnessMap,$t=!!y.specularMap,pe=!!y.specularColorMap,D=!!y.specularIntensityMap,gt=lt&&!!y.transmissionMap,$=lt&&!!y.thicknessMap,Q=!!y.gradientMap,pt=!!y.alphaMap,_t=y.alphaTest>0,ne=!!y.alphaHash,Ae=!!y.extensions,Je=bi;y.toneMapped&&(Wt===null||Wt.isXRRenderTarget===!0)&&(Je=n.toneMapping);let re={shaderID:xt,shaderType:y.type,shaderName:y.name,vertexShader:j,fragmentShader:st,defines:y.defines,customVertexShaderID:wt,customFragmentShaderID:vt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:g,batching:Kt,batchingColor:Kt&&K._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&K.instanceColor!==null,instancingMorph:Ft&&K.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Wt===null?n.outputColorSpace:Wt.isXRRenderTarget===!0?Wt.texture.colorSpace:Li,alphaToCoverage:!!y.alphaToCoverage,map:se,matcap:Qt,envMap:T,envMapMode:T&&q.mapping,envMapCubeUVHeight:dt,aoMap:et,lightMap:Z,bumpMap:at,normalMap:rt,displacementMap:p&&ut,emissiveMap:nt,normalMapObjectSpace:rt&&y.normalMapType===im,normalMapTangentSpace:rt&&y.normalMapType===tf,metalnessMap:L,roughnessMap:b,anisotropy:O,anisotropyMap:ft,clearcoat:X,clearcoatMap:Jt,clearcoatNormalMap:ot,clearcoatRoughnessMap:Mt,dispersion:J,iridescence:Y,iridescenceMap:Vt,iridescenceThicknessMap:Gt,sheen:At,sheenColorMap:bt,sheenRoughnessMap:ee,specularMap:$t,specularColorMap:pe,specularIntensityMap:D,transmission:lt,transmissionMap:gt,thicknessMap:$,gradientMap:Q,opaque:y.transparent===!1&&y.blending===Ts&&y.alphaToCoverage===!1,alphaMap:pt,alphaTest:_t,alphaHash:ne,combine:y.combine,mapUv:se&&m(y.map.channel),aoMapUv:et&&m(y.aoMap.channel),lightMapUv:Z&&m(y.lightMap.channel),bumpMapUv:at&&m(y.bumpMap.channel),normalMapUv:rt&&m(y.normalMap.channel),displacementMapUv:ut&&m(y.displacementMap.channel),emissiveMapUv:nt&&m(y.emissiveMap.channel),metalnessMapUv:L&&m(y.metalnessMap.channel),roughnessMapUv:b&&m(y.roughnessMap.channel),anisotropyMapUv:ft&&m(y.anisotropyMap.channel),clearcoatMapUv:Jt&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:ot&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Mt&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Vt&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:Gt&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:bt&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:ee&&m(y.sheenRoughnessMap.channel),specularMapUv:$t&&m(y.specularMap.channel),specularColorMapUv:pe&&m(y.specularColorMap.channel),specularIntensityMapUv:D&&m(y.specularIntensityMap.channel),transmissionMapUv:gt&&m(y.transmissionMap.channel),thicknessMapUv:$&&m(y.thicknessMap.channel),alphaMapUv:pt&&m(y.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(rt||O),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!W.attributes.uv&&(se||pt),fog:!!tt,useFog:y.fog===!0,fogExp2:!!tt&&tt.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:K.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:ie,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&F.length>0,shadowMapType:n.shadowMap.type,toneMapping:Je,decodeVideoTexture:se&&y.map.isVideoTexture===!0&&ce.getTransfer(y.map.colorSpace)===ge,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===si,flipSided:y.side===en,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ae&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&y.extensions.multiDraw===!0||Kt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return re.vertexUv1s=h.has(1),re.vertexUv2s=h.has(2),re.vertexUv3s=h.has(3),h.clear(),re}function S(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let F in y.defines)w.push(F),w.push(y.defines[F]);return y.isRawShaderMaterial===!1&&(v(w,y),M(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function v(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function M(y,w){o.disableAll(),w.supportsVertexTextures&&o.enable(0),w.instancing&&o.enable(1),w.instancingColor&&o.enable(2),w.instancingMorph&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),w.dispersion&&o.enable(20),w.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reverseDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.alphaToCoverage&&o.enable(20),y.push(o.mask)}function E(y){let w=_[y.type],F;if(w){let B=Kn[w];F=Lm.clone(B.uniforms)}else F=y.uniforms;return F}function C(y,w){let F;for(let B=0,K=l.length;B<K;B++){let tt=l[B];if(tt.cacheKey===w){F=tt,++F.usedTimes;break}}return F===void 0&&(F=new Ox(n,w,y,r),l.push(F)),F}function R(y){if(--y.usedTimes===0){let w=l.indexOf(y);l[w]=l[l.length-1],l.pop(),y.destroy()}}function P(y){c.remove(y)}function N(){c.dispose()}return{getParameters:f,getProgramCacheKey:S,getUniforms:E,acquireProgram:C,releaseProgram:R,releaseShaderCache:P,programs:l,dispose:N}}function Hx(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Vx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Td(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Rd(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,p,g,_,m){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function h(u,d){e.length>1&&e.sort(u||Vx),i.length>1&&i.sort(d||Td),s.length>1&&s.sort(d||Td)}function l(){for(let u=t,d=n.length;u<d;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Gx(){let n=new WeakMap;function t(i,s){let r=n.get(i),a;return r===void 0?(a=new Rd,n.set(i,[a])):s>=r.length?(a=new Rd,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Wx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Zt};break;case"SpotLight":e={position:new I,direction:new I,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new I,halfWidth:new I,halfHeight:new I};break}return n[t.id]=e,e}}}function Kx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var $x=0;function Xx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function qx(n){let t=new Wx,e=Kx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);let s=new I,r=new ve,a=new ve;function o(h){let l=0,u=0,d=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,S=0,v=0,M=0,E=0,C=0,R=0;h.sort(Xx);for(let N=0,y=h.length;N<y;N++){let w=h[N],F=w.color,B=w.intensity,K=w.distance,tt=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)l+=F.r*B,u+=F.g*B,d+=F.b*B;else if(w.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(w.sh.coefficients[W],B);R++}else if(w.isDirectionalLight){let W=t.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let it=w.shadow,q=e.get(w);q.shadowIntensity=it.intensity,q.shadowBias=it.bias,q.shadowNormalBias=it.normalBias,q.shadowRadius=it.radius,q.shadowMapSize=it.mapSize,i.directionalShadow[p]=q,i.directionalShadowMap[p]=tt,i.directionalShadowMatrix[p]=w.shadow.matrix,S++}i.directional[p]=W,p++}else if(w.isSpotLight){let W=t.get(w);W.position.setFromMatrixPosition(w.matrixWorld),W.color.copy(F).multiplyScalar(B),W.distance=K,W.coneCos=Math.cos(w.angle),W.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),W.decay=w.decay,i.spot[_]=W;let it=w.shadow;if(w.map&&(i.spotLightMap[E]=w.map,E++,it.updateMatrices(w),w.castShadow&&C++),i.spotLightMatrix[_]=it.matrix,w.castShadow){let q=e.get(w);q.shadowIntensity=it.intensity,q.shadowBias=it.bias,q.shadowNormalBias=it.normalBias,q.shadowRadius=it.radius,q.shadowMapSize=it.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=tt,M++}_++}else if(w.isRectAreaLight){let W=t.get(w);W.color.copy(F).multiplyScalar(B),W.halfWidth.set(w.width*.5,0,0),W.halfHeight.set(0,w.height*.5,0),i.rectArea[m]=W,m++}else if(w.isPointLight){let W=t.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),W.distance=w.distance,W.decay=w.decay,w.castShadow){let it=w.shadow,q=e.get(w);q.shadowIntensity=it.intensity,q.shadowBias=it.bias,q.shadowNormalBias=it.normalBias,q.shadowRadius=it.radius,q.shadowMapSize=it.mapSize,q.shadowCameraNear=it.camera.near,q.shadowCameraFar=it.camera.far,i.pointShadow[g]=q,i.pointShadowMap[g]=tt,i.pointShadowMatrix[g]=w.shadow.matrix,v++}i.point[g]=W,g++}else if(w.isHemisphereLight){let W=t.get(w);W.skyColor.copy(w.color).multiplyScalar(B),W.groundColor.copy(w.groundColor).multiplyScalar(B),i.hemi[f]=W,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=d;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==f||P.numDirectionalShadows!==S||P.numPointShadows!==v||P.numSpotShadows!==M||P.numSpotMaps!==E||P.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+E-C,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=R,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=f,P.numDirectionalShadows=S,P.numPointShadows=v,P.numSpotShadows=M,P.numSpotMaps=E,P.numLightProbes=R,i.version=$x++)}function c(h,l){let u=0,d=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let f=0,S=h.length;f<S;f++){let v=h[f];if(v.isDirectionalLight){let M=i.directional[u];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(v.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let M=i.rectArea[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){let M=i.point[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){let M=i.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function Cd(n){let t=new qx(n),e=[],i=[];function s(l){h.camera=l,e.length=0,i.length=0}function r(l){e.push(l)}function a(l){i.push(l)}function o(){t.setup(e)}function c(l){t.setupView(e,l)}let h={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Yx(n){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new Cd(n),t.set(s,[o])):r>=a.length?(o=new Cd(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}var Ll=class extends Ti{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=em,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Pl=class extends Ti{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Zx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Jx(n,t,e){let i=new yr,s=new Ct,r=new Ct,a=new be,o=new Ll({depthPacking:nm}),c=new Pl,h={},l=e.maxTextureSize,u={[wi]:en,[en]:wi,[si]:si},d=new Xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Zx,fragmentShader:jx}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new Xe;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new we(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hd;let f=this.type;this.render=function(C,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;let N=n.getRenderTarget(),y=n.getActiveCubeFace(),w=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Mi),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let B=f!==ii&&this.type===ii,K=f===ii&&this.type!==ii;for(let tt=0,W=C.length;tt<W;tt++){let it=C[tt],q=it.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",it,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let dt=q.getFrameExtents();if(s.multiply(dt),r.copy(q.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/dt.x),s.x=r.x*dt.x,q.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/dt.y),s.y=r.y*dt.y,q.mapSize.y=r.y)),q.map===null||B===!0||K===!0){let yt=this.type!==ii?{minFilter:xn,magFilter:xn}:{};q.map!==null&&q.map.dispose(),q.map=new ci(s.x,s.y,yt),q.map.texture.name=it.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let xt=q.getViewportCount();for(let yt=0;yt<xt;yt++){let te=q.getViewport(yt);a.set(r.x*te.x,r.y*te.y,r.x*te.z,r.y*te.w),F.viewport(a),q.updateMatrices(it,yt),i=q.getFrustum(),M(R,P,q.camera,it,this.type)}q.isPointLightShadow!==!0&&this.type===ii&&S(q,P),q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(N,y,w)};function S(C,R){let P=t.update(_);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ci(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(R,null,P,d,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(R,null,P,p,_,null)}function v(C,R,P,N){let y=null,w=P.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(w!==void 0)y=w;else if(y=P.isPointLight===!0?c:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let F=y.uuid,B=R.uuid,K=h[F];K===void 0&&(K={},h[F]=K);let tt=K[B];tt===void 0&&(tt=y.clone(),K[B]=tt,R.addEventListener("dispose",E)),y=tt}if(y.visible=R.visible,y.wireframe=R.wireframe,N===ii?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:u[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let F=n.properties.get(y);F.light=P}return y}function M(C,R,P,N,y){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&y===ii)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,C.matrixWorld);let B=t.update(C),K=C.material;if(Array.isArray(K)){let tt=B.groups;for(let W=0,it=tt.length;W<it;W++){let q=tt[W],dt=K[q.materialIndex];if(dt&&dt.visible){let xt=v(C,dt,N,y);C.onBeforeShadow(n,C,R,P,B,xt,q),n.renderBufferDirect(P,null,B,xt,C,q),C.onAfterShadow(n,C,R,P,B,xt,q)}}}else if(K.visible){let tt=v(C,K,N,y);C.onBeforeShadow(n,C,R,P,B,tt,null),n.renderBufferDirect(P,null,B,tt,C,null),C.onAfterShadow(n,C,R,P,B,tt,null)}}let F=C.children;for(let B=0,K=F.length;B<K;B++)M(F[B],R,P,N,y)}function E(C){C.target.removeEventListener("dispose",E);for(let P in h){let N=h[P],y=C.target.uuid;y in N&&(N[y].dispose(),delete N[y])}}}var Qx={[kc]:Uc,[Nc]:Bc,[Fc]:zc,[Ps]:Oc,[Uc]:kc,[Bc]:Nc,[zc]:Fc,[Oc]:Ps};function tv(n){function t(){let D=!1,gt=new be,$=null,Q=new be(0,0,0,0);return{setMask:function(pt){$!==pt&&!D&&(n.colorMask(pt,pt,pt,pt),$=pt)},setLocked:function(pt){D=pt},setClear:function(pt,_t,ne,Ae,Je){Je===!0&&(pt*=Ae,_t*=Ae,ne*=Ae),gt.set(pt,_t,ne,Ae),Q.equals(gt)===!1&&(n.clearColor(pt,_t,ne,Ae),Q.copy(gt))},reset:function(){D=!1,$=null,Q.set(-1,0,0,0)}}}function e(){let D=!1,gt=!1,$=null,Q=null,pt=null;return{setReversed:function(_t){gt=_t},setTest:function(_t){_t?wt(n.DEPTH_TEST):vt(n.DEPTH_TEST)},setMask:function(_t){$!==_t&&!D&&(n.depthMask(_t),$=_t)},setFunc:function(_t){if(gt&&(_t=Qx[_t]),Q!==_t){switch(_t){case kc:n.depthFunc(n.NEVER);break;case Uc:n.depthFunc(n.ALWAYS);break;case Nc:n.depthFunc(n.LESS);break;case Ps:n.depthFunc(n.LEQUAL);break;case Fc:n.depthFunc(n.EQUAL);break;case Oc:n.depthFunc(n.GEQUAL);break;case Bc:n.depthFunc(n.GREATER);break;case zc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=_t}},setLocked:function(_t){D=_t},setClear:function(_t){pt!==_t&&(n.clearDepth(_t),pt=_t)},reset:function(){D=!1,$=null,Q=null,pt=null}}}function i(){let D=!1,gt=null,$=null,Q=null,pt=null,_t=null,ne=null,Ae=null,Je=null;return{setTest:function(re){D||(re?wt(n.STENCIL_TEST):vt(n.STENCIL_TEST))},setMask:function(re){gt!==re&&!D&&(n.stencilMask(re),gt=re)},setFunc:function(re,Qe,Yn){($!==re||Q!==Qe||pt!==Yn)&&(n.stencilFunc(re,Qe,Yn),$=re,Q=Qe,pt=Yn)},setOp:function(re,Qe,Yn){(_t!==re||ne!==Qe||Ae!==Yn)&&(n.stencilOp(re,Qe,Yn),_t=re,ne=Qe,Ae=Yn)},setLocked:function(re){D=re},setClear:function(re){Je!==re&&(n.clearStencil(re),Je=re)},reset:function(){D=!1,gt=null,$=null,Q=null,pt=null,_t=null,ne=null,Ae=null,Je=null}}}let s=new t,r=new e,a=new i,o=new WeakMap,c=new WeakMap,h={},l={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,S=null,v=null,M=null,E=null,C=new Zt(0,0,0),R=0,P=!1,N=null,y=null,w=null,F=null,B=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),tt=!1,W=0,it=n.getParameter(n.VERSION);it.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(it)[1]),tt=W>=1):it.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(it)[1]),tt=W>=2);let q=null,dt={},xt=n.getParameter(n.SCISSOR_BOX),yt=n.getParameter(n.VIEWPORT),te=new be().fromArray(xt),ie=new be().fromArray(yt);function j(D,gt,$,Q){let pt=new Uint8Array(4),_t=n.createTexture();n.bindTexture(D,_t),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ne=0;ne<$;ne++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(gt,0,n.RGBA,1,1,Q,0,n.RGBA,n.UNSIGNED_BYTE,pt):n.texImage2D(gt+ne,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pt);return _t}let st={};st[n.TEXTURE_2D]=j(n.TEXTURE_2D,n.TEXTURE_2D,1),st[n.TEXTURE_CUBE_MAP]=j(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[n.TEXTURE_2D_ARRAY]=j(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),st[n.TEXTURE_3D]=j(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),a.setClear(0),wt(n.DEPTH_TEST),r.setFunc(Ps),Z(!1),at(Uu),wt(n.CULL_FACE),T(Mi);function wt(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function vt(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function Wt(D,gt){return l[D]!==gt?(n.bindFramebuffer(D,gt),l[D]=gt,D===n.DRAW_FRAMEBUFFER&&(l[n.FRAMEBUFFER]=gt),D===n.FRAMEBUFFER&&(l[n.DRAW_FRAMEBUFFER]=gt),!0):!1}function Ft(D,gt){let $=d,Q=!1;if(D){$=u.get(gt),$===void 0&&($=[],u.set(gt,$));let pt=D.textures;if($.length!==pt.length||$[0]!==n.COLOR_ATTACHMENT0){for(let _t=0,ne=pt.length;_t<ne;_t++)$[_t]=n.COLOR_ATTACHMENT0+_t;$.length=pt.length,Q=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,Q=!0);Q&&n.drawBuffers($)}function Kt(D){return p!==D?(n.useProgram(D),p=D,!0):!1}let se={[Yi]:n.FUNC_ADD,[Rp]:n.FUNC_SUBTRACT,[Cp]:n.FUNC_REVERSE_SUBTRACT};se[Lp]=n.MIN,se[Pp]=n.MAX;let Qt={[Ip]:n.ZERO,[Dp]:n.ONE,[kp]:n.SRC_COLOR,[Ic]:n.SRC_ALPHA,[zp]:n.SRC_ALPHA_SATURATE,[Op]:n.DST_COLOR,[Np]:n.DST_ALPHA,[Up]:n.ONE_MINUS_SRC_COLOR,[Dc]:n.ONE_MINUS_SRC_ALPHA,[Bp]:n.ONE_MINUS_DST_COLOR,[Fp]:n.ONE_MINUS_DST_ALPHA,[Hp]:n.CONSTANT_COLOR,[Vp]:n.ONE_MINUS_CONSTANT_COLOR,[Gp]:n.CONSTANT_ALPHA,[Wp]:n.ONE_MINUS_CONSTANT_ALPHA};function T(D,gt,$,Q,pt,_t,ne,Ae,Je,re){if(D===Mi){g===!0&&(vt(n.BLEND),g=!1);return}if(g===!1&&(wt(n.BLEND),g=!0),D!==Tp){if(D!==_||re!==P){if((m!==Yi||v!==Yi)&&(n.blendEquation(n.FUNC_ADD),m=Yi,v=Yi),re)switch(D){case Ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nu:n.blendFunc(n.ONE,n.ONE);break;case Fu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ou:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Nu:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Fu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ou:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}f=null,S=null,M=null,E=null,C.set(0,0,0),R=0,_=D,P=re}return}pt=pt||gt,_t=_t||$,ne=ne||Q,(gt!==m||pt!==v)&&(n.blendEquationSeparate(se[gt],se[pt]),m=gt,v=pt),($!==f||Q!==S||_t!==M||ne!==E)&&(n.blendFuncSeparate(Qt[$],Qt[Q],Qt[_t],Qt[ne]),f=$,S=Q,M=_t,E=ne),(Ae.equals(C)===!1||Je!==R)&&(n.blendColor(Ae.r,Ae.g,Ae.b,Je),C.copy(Ae),R=Je),_=D,P=!1}function et(D,gt){D.side===si?vt(n.CULL_FACE):wt(n.CULL_FACE);let $=D.side===en;gt&&($=!$),Z($),D.blending===Ts&&D.transparent===!1?T(Mi):T(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),s.setMask(D.colorWrite);let Q=D.stencilWrite;a.setTest(Q),Q&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ut(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?wt(n.SAMPLE_ALPHA_TO_COVERAGE):vt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Z(D){N!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),N=D)}function at(D){D!==wp?(wt(n.CULL_FACE),D!==y&&(D===Uu?n.cullFace(n.BACK):D===Ep?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):vt(n.CULL_FACE),y=D}function rt(D){D!==w&&(tt&&n.lineWidth(D),w=D)}function ut(D,gt,$){D?(wt(n.POLYGON_OFFSET_FILL),(F!==gt||B!==$)&&(n.polygonOffset(gt,$),F=gt,B=$)):vt(n.POLYGON_OFFSET_FILL)}function nt(D){D?wt(n.SCISSOR_TEST):vt(n.SCISSOR_TEST)}function L(D){D===void 0&&(D=n.TEXTURE0+K-1),q!==D&&(n.activeTexture(D),q=D)}function b(D,gt,$){$===void 0&&(q===null?$=n.TEXTURE0+K-1:$=q);let Q=dt[$];Q===void 0&&(Q={type:void 0,texture:void 0},dt[$]=Q),(Q.type!==D||Q.texture!==gt)&&(q!==$&&(n.activeTexture($),q=$),n.bindTexture(D,gt||st[D]),Q.type=D,Q.texture=gt)}function O(){let D=dt[q];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function X(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function At(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function lt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ft(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Jt(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ot(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Mt(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Vt(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Gt(D){te.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),te.copy(D))}function bt(D){ie.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),ie.copy(D))}function ee(D,gt){let $=c.get(gt);$===void 0&&($=new WeakMap,c.set(gt,$));let Q=$.get(D);Q===void 0&&(Q=n.getUniformBlockIndex(gt,D.name),$.set(D,Q))}function $t(D,gt){let Q=c.get(gt).get(D);o.get(gt)!==Q&&(n.uniformBlockBinding(gt,Q,D.__bindingPointIndex),o.set(gt,Q))}function pe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},q=null,dt={},l={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,S=null,v=null,M=null,E=null,C=new Zt(0,0,0),R=0,P=!1,N=null,y=null,w=null,F=null,B=null,te.set(0,0,n.canvas.width,n.canvas.height),ie.set(0,0,n.canvas.width,n.canvas.height),s.reset(),r.reset(),a.reset()}return{buffers:{color:s,depth:r,stencil:a},enable:wt,disable:vt,bindFramebuffer:Wt,drawBuffers:Ft,useProgram:Kt,setBlending:T,setMaterial:et,setFlipSided:Z,setCullFace:at,setLineWidth:rt,setPolygonOffset:ut,setScissorTest:nt,activeTexture:L,bindTexture:b,unbindTexture:O,compressedTexImage2D:X,compressedTexImage3D:J,texImage2D:Mt,texImage3D:Vt,updateUBOMapping:ee,uniformBlockBinding:$t,texStorage2D:Jt,texStorage3D:ot,texSubImage2D:Y,texSubImage3D:At,compressedTexSubImage2D:lt,compressedTexSubImage3D:ft,scissor:Gt,viewport:bt,reset:pe}}function Ld(n,t,e,i){let s=ev(i);switch(e){case Xd:return n*t;case Yd:return n*t;case Zd:return n*t*2;case jd:return n*t/s.components*s.byteLength;case oh:return n*t/s.components*s.byteLength;case Jd:return n*t*2/s.components*s.byteLength;case ah:return n*t*2/s.components*s.byteLength;case qd:return n*t*3/s.components*s.byteLength;case Un:return n*t*4/s.components*s.byteLength;case ch:return n*t*4/s.components*s.byteLength;case wo:case Eo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ao:case To:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case $c:case qc:return Math.max(n,16)*Math.max(t,8)/4;case Kc:case Xc:return Math.max(n,8)*Math.max(t,8)/2;case Yc:case Zc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case jc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Jc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Qc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case tl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case el:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case nl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case il:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case sl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case rl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case ol:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case al:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case cl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case ll:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case hl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ul:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ro:case dl:case fl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Qd:case pl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case ml:case gl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ev(n){switch(n){case ai:case Wd:return{byteLength:1,components:1};case gr:case Kd:case wr:return{byteLength:2,components:1};case sh:case rh:return{byteLength:2,components:4};case ts:case ih:case ri:return{byteLength:4,components:1};case $d:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function nv(n,t,e,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ct,l=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,b){return p?new OffscreenCanvas(L,b):Uo("canvas")}function _(L,b,O){let X=1,J=nt(L);if((J.width>O||J.height>O)&&(X=O/Math.max(J.width,J.height)),X<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let Y=Math.floor(X*J.width),At=Math.floor(X*J.height);u===void 0&&(u=g(Y,At));let lt=b?g(Y,At):u;return lt.width=Y,lt.height=At,lt.getContext("2d").drawImage(L,0,0,Y,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+At+")."),lt}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),L;return L}function m(L){return L.generateMipmaps&&L.minFilter!==xn&&L.minFilter!==kn}function f(L){n.generateMipmap(L)}function S(L,b,O,X,J=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Y=b;if(b===n.RED&&(O===n.FLOAT&&(Y=n.R32F),O===n.HALF_FLOAT&&(Y=n.R16F),O===n.UNSIGNED_BYTE&&(Y=n.R8)),b===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.R8UI),O===n.UNSIGNED_SHORT&&(Y=n.R16UI),O===n.UNSIGNED_INT&&(Y=n.R32UI),O===n.BYTE&&(Y=n.R8I),O===n.SHORT&&(Y=n.R16I),O===n.INT&&(Y=n.R32I)),b===n.RG&&(O===n.FLOAT&&(Y=n.RG32F),O===n.HALF_FLOAT&&(Y=n.RG16F),O===n.UNSIGNED_BYTE&&(Y=n.RG8)),b===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RG8UI),O===n.UNSIGNED_SHORT&&(Y=n.RG16UI),O===n.UNSIGNED_INT&&(Y=n.RG32UI),O===n.BYTE&&(Y=n.RG8I),O===n.SHORT&&(Y=n.RG16I),O===n.INT&&(Y=n.RG32I)),b===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),O===n.UNSIGNED_INT&&(Y=n.RGB32UI),O===n.BYTE&&(Y=n.RGB8I),O===n.SHORT&&(Y=n.RGB16I),O===n.INT&&(Y=n.RGB32I)),b===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),O===n.UNSIGNED_INT&&(Y=n.RGBA32UI),O===n.BYTE&&(Y=n.RGBA8I),O===n.SHORT&&(Y=n.RGBA16I),O===n.INT&&(Y=n.RGBA32I)),b===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),b===n.RGBA){let At=J?Po:ce.getTransfer(X);O===n.FLOAT&&(Y=n.RGBA32F),O===n.HALF_FLOAT&&(Y=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Y=At===ge?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function v(L,b){let O;return L?b===null||b===ts||b===ks?O=n.DEPTH24_STENCIL8:b===ri?O=n.DEPTH32F_STENCIL8:b===gr&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===ts||b===ks?O=n.DEPTH_COMPONENT24:b===ri?O=n.DEPTH_COMPONENT32F:b===gr&&(O=n.DEPTH_COMPONENT16),O}function M(L,b){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==xn&&L.minFilter!==kn?Math.log2(Math.max(b.width,b.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?b.mipmaps.length:1}function E(L){let b=L.target;b.removeEventListener("dispose",E),R(b),b.isVideoTexture&&l.delete(b)}function C(L){let b=L.target;b.removeEventListener("dispose",C),N(b)}function R(L){let b=i.get(L);if(b.__webglInit===void 0)return;let O=L.source,X=d.get(O);if(X){let J=X[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&P(L),Object.keys(X).length===0&&d.delete(O)}i.remove(L)}function P(L){let b=i.get(L);n.deleteTexture(b.__webglTexture);let O=L.source,X=d.get(O);delete X[b.__cacheKey],a.memory.textures--}function N(L){let b=i.get(L);if(L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(b.__webglFramebuffer[X]))for(let J=0;J<b.__webglFramebuffer[X].length;J++)n.deleteFramebuffer(b.__webglFramebuffer[X][J]);else n.deleteFramebuffer(b.__webglFramebuffer[X]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[X])}else{if(Array.isArray(b.__webglFramebuffer))for(let X=0;X<b.__webglFramebuffer.length;X++)n.deleteFramebuffer(b.__webglFramebuffer[X]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let X=0;X<b.__webglColorRenderbuffer.length;X++)b.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[X]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let O=L.textures;for(let X=0,J=O.length;X<J;X++){let Y=i.get(O[X]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),a.memory.textures--),i.remove(O[X])}i.remove(L)}let y=0;function w(){y=0}function F(){let L=y;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),y+=1,L}function B(L){let b=[];return b.push(L.wrapS),b.push(L.wrapT),b.push(L.wrapR||0),b.push(L.magFilter),b.push(L.minFilter),b.push(L.anisotropy),b.push(L.internalFormat),b.push(L.format),b.push(L.type),b.push(L.generateMipmaps),b.push(L.premultiplyAlpha),b.push(L.flipY),b.push(L.unpackAlignment),b.push(L.colorSpace),b.join()}function K(L,b){let O=i.get(L);if(L.isVideoTexture&&rt(L),L.isRenderTargetTexture===!1&&L.version>0&&O.__version!==L.version){let X=L.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ie(O,L,b);return}}e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+b)}function tt(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){ie(O,L,b);return}e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+b)}function W(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){ie(O,L,b);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+b)}function it(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){j(O,L,b);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+b)}let q={[Gc]:n.REPEAT,[Ji]:n.CLAMP_TO_EDGE,[Wc]:n.MIRRORED_REPEAT},dt={[xn]:n.NEAREST,[tm]:n.NEAREST_MIPMAP_NEAREST,[Jr]:n.NEAREST_MIPMAP_LINEAR,[kn]:n.LINEAR,[Za]:n.LINEAR_MIPMAP_NEAREST,[Qi]:n.LINEAR_MIPMAP_LINEAR},xt={[sm]:n.NEVER,[hm]:n.ALWAYS,[rm]:n.LESS,[ef]:n.LEQUAL,[om]:n.EQUAL,[lm]:n.GEQUAL,[am]:n.GREATER,[cm]:n.NOTEQUAL};function yt(L,b){if(b.type===ri&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===kn||b.magFilter===Za||b.magFilter===Jr||b.magFilter===Qi||b.minFilter===kn||b.minFilter===Za||b.minFilter===Jr||b.minFilter===Qi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,q[b.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,q[b.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,q[b.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,dt[b.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,dt[b.minFilter]),b.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,xt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===xn||b.minFilter!==Jr&&b.minFilter!==Qi||b.type===ri&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function te(L,b){let O=!1;L.__webglInit===void 0&&(L.__webglInit=!0,b.addEventListener("dispose",E));let X=b.source,J=d.get(X);J===void 0&&(J={},d.set(X,J));let Y=B(b);if(Y!==L.__cacheKey){J[Y]===void 0&&(J[Y]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),J[Y].usedTimes++;let At=J[L.__cacheKey];At!==void 0&&(J[L.__cacheKey].usedTimes--,At.usedTimes===0&&P(b)),L.__cacheKey=Y,L.__webglTexture=J[Y].texture}return O}function ie(L,b,O){let X=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(X=n.TEXTURE_3D);let J=te(L,b),Y=b.source;e.bindTexture(X,L.__webglTexture,n.TEXTURE0+O);let At=i.get(Y);if(Y.version!==At.__version||J===!0){e.activeTexture(n.TEXTURE0+O);let lt=ce.getPrimaries(ce.workingColorSpace),ft=b.colorSpace===Si?null:ce.getPrimaries(b.colorSpace),Jt=b.colorSpace===Si||lt===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Jt);let ot=_(b.image,!1,s.maxTextureSize);ot=ut(b,ot);let Mt=r.convert(b.format,b.colorSpace),Vt=r.convert(b.type),Gt=S(b.internalFormat,Mt,Vt,b.colorSpace,b.isVideoTexture);yt(X,b);let bt,ee=b.mipmaps,$t=b.isVideoTexture!==!0,pe=At.__version===void 0||J===!0,D=Y.dataReady,gt=M(b,ot);if(b.isDepthTexture)Gt=v(b.format===Us,b.type),pe&&($t?e.texStorage2D(n.TEXTURE_2D,1,Gt,ot.width,ot.height):e.texImage2D(n.TEXTURE_2D,0,Gt,ot.width,ot.height,0,Mt,Vt,null));else if(b.isDataTexture)if(ee.length>0){$t&&pe&&e.texStorage2D(n.TEXTURE_2D,gt,Gt,ee[0].width,ee[0].height);for(let $=0,Q=ee.length;$<Q;$++)bt=ee[$],$t?D&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,bt.width,bt.height,Mt,Vt,bt.data):e.texImage2D(n.TEXTURE_2D,$,Gt,bt.width,bt.height,0,Mt,Vt,bt.data);b.generateMipmaps=!1}else $t?(pe&&e.texStorage2D(n.TEXTURE_2D,gt,Gt,ot.width,ot.height),D&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ot.width,ot.height,Mt,Vt,ot.data)):e.texImage2D(n.TEXTURE_2D,0,Gt,ot.width,ot.height,0,Mt,Vt,ot.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){$t&&pe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,Gt,ee[0].width,ee[0].height,ot.depth);for(let $=0,Q=ee.length;$<Q;$++)if(bt=ee[$],b.format!==Un)if(Mt!==null)if($t){if(D)if(b.layerUpdates.size>0){let pt=Ld(bt.width,bt.height,b.format,b.type);for(let _t of b.layerUpdates){let ne=bt.data.subarray(_t*pt/bt.data.BYTES_PER_ELEMENT,(_t+1)*pt/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,_t,bt.width,bt.height,1,Mt,ne,0,0)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,bt.width,bt.height,ot.depth,Mt,bt.data,0,0)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Gt,bt.width,bt.height,ot.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $t?D&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,bt.width,bt.height,ot.depth,Mt,Vt,bt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,$,Gt,bt.width,bt.height,ot.depth,0,Mt,Vt,bt.data)}else{$t&&pe&&e.texStorage2D(n.TEXTURE_2D,gt,Gt,ee[0].width,ee[0].height);for(let $=0,Q=ee.length;$<Q;$++)bt=ee[$],b.format!==Un?Mt!==null?$t?D&&e.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,bt.width,bt.height,Mt,bt.data):e.compressedTexImage2D(n.TEXTURE_2D,$,Gt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?D&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,bt.width,bt.height,Mt,Vt,bt.data):e.texImage2D(n.TEXTURE_2D,$,Gt,bt.width,bt.height,0,Mt,Vt,bt.data)}else if(b.isDataArrayTexture)if($t){if(pe&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,Gt,ot.width,ot.height,ot.depth),D)if(b.layerUpdates.size>0){let $=Ld(ot.width,ot.height,b.format,b.type);for(let Q of b.layerUpdates){let pt=ot.data.subarray(Q*$/ot.data.BYTES_PER_ELEMENT,(Q+1)*$/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,ot.width,ot.height,1,Mt,Vt,pt)}b.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,Mt,Vt,ot.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Gt,ot.width,ot.height,ot.depth,0,Mt,Vt,ot.data);else if(b.isData3DTexture)$t?(pe&&e.texStorage3D(n.TEXTURE_3D,gt,Gt,ot.width,ot.height,ot.depth),D&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,Mt,Vt,ot.data)):e.texImage3D(n.TEXTURE_3D,0,Gt,ot.width,ot.height,ot.depth,0,Mt,Vt,ot.data);else if(b.isFramebufferTexture){if(pe)if($t)e.texStorage2D(n.TEXTURE_2D,gt,Gt,ot.width,ot.height);else{let $=ot.width,Q=ot.height;for(let pt=0;pt<gt;pt++)e.texImage2D(n.TEXTURE_2D,pt,Gt,$,Q,0,Mt,Vt,null),$>>=1,Q>>=1}}else if(ee.length>0){if($t&&pe){let $=nt(ee[0]);e.texStorage2D(n.TEXTURE_2D,gt,Gt,$.width,$.height)}for(let $=0,Q=ee.length;$<Q;$++)bt=ee[$],$t?D&&e.texSubImage2D(n.TEXTURE_2D,$,0,0,Mt,Vt,bt):e.texImage2D(n.TEXTURE_2D,$,Gt,Mt,Vt,bt);b.generateMipmaps=!1}else if($t){if(pe){let $=nt(ot);e.texStorage2D(n.TEXTURE_2D,gt,Gt,$.width,$.height)}D&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,Vt,ot)}else e.texImage2D(n.TEXTURE_2D,0,Gt,Mt,Vt,ot);m(b)&&f(X),At.__version=Y.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function j(L,b,O){if(b.image.length!==6)return;let X=te(L,b),J=b.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+O);let Y=i.get(J);if(J.version!==Y.__version||X===!0){e.activeTexture(n.TEXTURE0+O);let At=ce.getPrimaries(ce.workingColorSpace),lt=b.colorSpace===Si?null:ce.getPrimaries(b.colorSpace),ft=b.colorSpace===Si||At===lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);let Jt=b.isCompressedTexture||b.image[0].isCompressedTexture,ot=b.image[0]&&b.image[0].isDataTexture,Mt=[];for(let Q=0;Q<6;Q++)!Jt&&!ot?Mt[Q]=_(b.image[Q],!0,s.maxCubemapSize):Mt[Q]=ot?b.image[Q].image:b.image[Q],Mt[Q]=ut(b,Mt[Q]);let Vt=Mt[0],Gt=r.convert(b.format,b.colorSpace),bt=r.convert(b.type),ee=S(b.internalFormat,Gt,bt,b.colorSpace),$t=b.isVideoTexture!==!0,pe=Y.__version===void 0||X===!0,D=J.dataReady,gt=M(b,Vt);yt(n.TEXTURE_CUBE_MAP,b);let $;if(Jt){$t&&pe&&e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,ee,Vt.width,Vt.height);for(let Q=0;Q<6;Q++){$=Mt[Q].mipmaps;for(let pt=0;pt<$.length;pt++){let _t=$[pt];b.format!==Un?Gt!==null?$t?D&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt,0,0,_t.width,_t.height,Gt,_t.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt,ee,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$t?D&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt,0,0,_t.width,_t.height,Gt,bt,_t.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt,ee,_t.width,_t.height,0,Gt,bt,_t.data)}}}else{if($=b.mipmaps,$t&&pe){$.length>0&&gt++;let Q=nt(Mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,ee,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ot){$t?D&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Mt[Q].width,Mt[Q].height,Gt,bt,Mt[Q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ee,Mt[Q].width,Mt[Q].height,0,Gt,bt,Mt[Q].data);for(let pt=0;pt<$.length;pt++){let ne=$[pt].image[Q].image;$t?D&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt+1,0,0,ne.width,ne.height,Gt,bt,ne.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt+1,ee,ne.width,ne.height,0,Gt,bt,ne.data)}}else{$t?D&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Gt,bt,Mt[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ee,Gt,bt,Mt[Q]);for(let pt=0;pt<$.length;pt++){let _t=$[pt];$t?D&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt+1,0,0,Gt,bt,_t.image[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt+1,ee,Gt,bt,_t.image[Q])}}}m(b)&&f(n.TEXTURE_CUBE_MAP),Y.__version=J.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function st(L,b,O,X,J,Y){let At=r.convert(O.format,O.colorSpace),lt=r.convert(O.type),ft=S(O.internalFormat,At,lt,O.colorSpace);if(!i.get(b).__hasExternalTextures){let ot=Math.max(1,b.width>>Y),Mt=Math.max(1,b.height>>Y);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,Y,ft,ot,Mt,b.depth,0,At,lt,null):e.texImage2D(J,Y,ft,ot,Mt,0,At,lt,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),at(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,J,i.get(O).__webglTexture,0,Z(b)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,J,i.get(O).__webglTexture,Y),e.bindFramebuffer(n.FRAMEBUFFER,null)}function wt(L,b,O){if(n.bindRenderbuffer(n.RENDERBUFFER,L),b.depthBuffer){let X=b.depthTexture,J=X&&X.isDepthTexture?X.type:null,Y=v(b.stencilBuffer,J),At=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=Z(b);at(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,lt,Y,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,lt,Y,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,Y,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,At,n.RENDERBUFFER,L)}else{let X=b.textures;for(let J=0;J<X.length;J++){let Y=X[J],At=r.convert(Y.format,Y.colorSpace),lt=r.convert(Y.type),ft=S(Y.internalFormat,At,lt,Y.colorSpace),Jt=Z(b);O&&at(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Jt,ft,b.width,b.height):at(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Jt,ft,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ft,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function vt(L,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),K(b.depthTexture,0);let X=i.get(b.depthTexture).__webglTexture,J=Z(b);if(b.depthTexture.format===Rs)at(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,X,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,X,0);else if(b.depthTexture.format===Us)at(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,X,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,X,0);else throw new Error("Unknown depthTexture format")}function Wt(L){let b=i.get(L),O=L.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==L.depthTexture){let X=L.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),X){let J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,X.removeEventListener("dispose",J)};X.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=X}if(L.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");vt(b.__webglFramebuffer,L)}else if(O){b.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[X]),b.__webglDepthbuffer[X]===void 0)b.__webglDepthbuffer[X]=n.createRenderbuffer(),wt(b.__webglDepthbuffer[X],L,!1);else{let J=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=b.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),wt(b.__webglDepthbuffer,L,!1);else{let X=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,X,n.RENDERBUFFER,J)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(L,b,O){let X=i.get(L);b!==void 0&&st(X.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Wt(L)}function Kt(L){let b=L.texture,O=i.get(L),X=i.get(b);L.addEventListener("dispose",C);let J=L.textures,Y=L.isWebGLCubeRenderTarget===!0,At=J.length>1;if(At||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=b.version,a.memory.textures++),Y){O.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[lt]=[];for(let ft=0;ft<b.mipmaps.length;ft++)O.__webglFramebuffer[lt][ft]=n.createFramebuffer()}else O.__webglFramebuffer[lt]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let lt=0;lt<b.mipmaps.length;lt++)O.__webglFramebuffer[lt]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(At)for(let lt=0,ft=J.length;lt<ft;lt++){let Jt=i.get(J[lt]);Jt.__webglTexture===void 0&&(Jt.__webglTexture=n.createTexture(),a.memory.textures++)}if(L.samples>0&&at(L)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let lt=0;lt<J.length;lt++){let ft=J[lt];O.__webglColorRenderbuffer[lt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[lt]);let Jt=r.convert(ft.format,ft.colorSpace),ot=r.convert(ft.type),Mt=S(ft.internalFormat,Jt,ot,ft.colorSpace,L.isXRRenderTarget===!0),Vt=Z(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,Vt,Mt,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+lt,n.RENDERBUFFER,O.__webglColorRenderbuffer[lt])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),wt(O.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),yt(n.TEXTURE_CUBE_MAP,b);for(let lt=0;lt<6;lt++)if(b.mipmaps&&b.mipmaps.length>0)for(let ft=0;ft<b.mipmaps.length;ft++)st(O.__webglFramebuffer[lt][ft],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,ft);else st(O.__webglFramebuffer[lt],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(b)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(At){for(let lt=0,ft=J.length;lt<ft;lt++){let Jt=J[lt],ot=i.get(Jt);e.bindTexture(n.TEXTURE_2D,ot.__webglTexture),yt(n.TEXTURE_2D,Jt),st(O.__webglFramebuffer,L,Jt,n.COLOR_ATTACHMENT0+lt,n.TEXTURE_2D,0),m(Jt)&&f(n.TEXTURE_2D)}e.unbindTexture()}else{let lt=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(lt=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(lt,X.__webglTexture),yt(lt,b),b.mipmaps&&b.mipmaps.length>0)for(let ft=0;ft<b.mipmaps.length;ft++)st(O.__webglFramebuffer[ft],L,b,n.COLOR_ATTACHMENT0,lt,ft);else st(O.__webglFramebuffer,L,b,n.COLOR_ATTACHMENT0,lt,0);m(b)&&f(lt),e.unbindTexture()}L.depthBuffer&&Wt(L)}function se(L){let b=L.textures;for(let O=0,X=b.length;O<X;O++){let J=b[O];if(m(J)){let Y=L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,At=i.get(J).__webglTexture;e.bindTexture(Y,At),f(Y),e.unbindTexture()}}}let Qt=[],T=[];function et(L){if(L.samples>0){if(at(L)===!1){let b=L.textures,O=L.width,X=L.height,J=n.COLOR_BUFFER_BIT,Y=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,At=i.get(L),lt=b.length>1;if(lt)for(let ft=0;ft<b.length;ft++)e.bindFramebuffer(n.FRAMEBUFFER,At.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,At.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let ft=0;ft<b.length;ft++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),lt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,At.__webglColorRenderbuffer[ft]);let Jt=i.get(b[ft]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Jt,0)}n.blitFramebuffer(0,0,O,X,0,0,O,X,J,n.NEAREST),c===!0&&(Qt.length=0,T.length=0,Qt.push(n.COLOR_ATTACHMENT0+ft),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Qt.push(Y),T.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,T)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Qt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),lt)for(let ft=0;ft<b.length;ft++){e.bindFramebuffer(n.FRAMEBUFFER,At.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,At.__webglColorRenderbuffer[ft]);let Jt=i.get(b[ft]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,At.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,Jt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let b=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function Z(L){return Math.min(s.maxSamples,L.samples)}function at(L){let b=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function rt(L){let b=a.render.frame;l.get(L)!==b&&(l.set(L,b),L.update())}function ut(L,b){let O=L.colorSpace,X=L.format,J=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||O!==Li&&O!==Si&&(ce.getTransfer(O)===ge?(X!==Un||J!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}function nt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(h.width=L.naturalWidth||L.width,h.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(h.width=L.displayWidth,h.height=L.displayHeight):(h.width=L.width,h.height=L.height),h}this.allocateTextureUnit=F,this.resetTextureUnits=w,this.setTexture2D=K,this.setTexture2DArray=tt,this.setTexture3D=W,this.setTextureCube=it,this.rebindTextures=Ft,this.setupRenderTarget=Kt,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=et,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=st,this.useMultisampledRTT=at}function iv(n,t){function e(i,s=Si){let r,a=ce.getTransfer(s);if(i===ai)return n.UNSIGNED_BYTE;if(i===sh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===rh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===$d)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Wd)return n.BYTE;if(i===Kd)return n.SHORT;if(i===gr)return n.UNSIGNED_SHORT;if(i===ih)return n.INT;if(i===ts)return n.UNSIGNED_INT;if(i===ri)return n.FLOAT;if(i===wr)return n.HALF_FLOAT;if(i===Xd)return n.ALPHA;if(i===qd)return n.RGB;if(i===Un)return n.RGBA;if(i===Yd)return n.LUMINANCE;if(i===Zd)return n.LUMINANCE_ALPHA;if(i===Rs)return n.DEPTH_COMPONENT;if(i===Us)return n.DEPTH_STENCIL;if(i===jd)return n.RED;if(i===oh)return n.RED_INTEGER;if(i===Jd)return n.RG;if(i===ah)return n.RG_INTEGER;if(i===ch)return n.RGBA_INTEGER;if(i===wo||i===Eo||i===Ao||i===To)if(a===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===wo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===wo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Eo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ao)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===To)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Kc||i===$c||i===Xc||i===qc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Kc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===$c)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Xc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===qc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Yc||i===Zc||i===jc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Yc||i===Zc)return a===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===jc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Jc||i===Qc||i===tl||i===el||i===nl||i===il||i===sl||i===rl||i===ol||i===al||i===cl||i===ll||i===hl||i===ul)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Jc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Qc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===tl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===el)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===nl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===il)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===sl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===rl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ol)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===al)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===cl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ll)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===hl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ul)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ro||i===dl||i===fl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Ro)return a===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===dl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Qd||i===pl||i===ml||i===gl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ro)return r.COMPRESSED_RED_RGTC1_EXT;if(i===pl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ml)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===gl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ks?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var Il=class extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},dn=class extends $e{constructor(){super(),this.isGroup=!0,this.type="Group"}},sv={type:"move"},fr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,i),f=this._getHandJoint(h,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&d>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new dn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},rv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ov=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Dl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){let s=new vn,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Xn({vertexShader:rv,fragmentShader:ov,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new we(new Os(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},kl=class extends Ei{constructor(t,e){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,d=null,p=null,g=null,_=new Dl,m=e.getContextAttributes(),f=null,S=null,v=[],M=[],E=new Ct,C=null,R=new Ze;R.layers.enable(1),R.viewport=new be;let P=new Ze;P.layers.enable(2),P.viewport=new be;let N=[R,P],y=new Il;y.layers.enable(1),y.layers.enable(2);let w=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let st=v[j];return st===void 0&&(st=new fr,v[j]=st),st.getTargetRaySpace()},this.getControllerGrip=function(j){let st=v[j];return st===void 0&&(st=new fr,v[j]=st),st.getGripSpace()},this.getHand=function(j){let st=v[j];return st===void 0&&(st=new fr,v[j]=st),st.getHandSpace()};function B(j){let st=M.indexOf(j.inputSource);if(st===-1)return;let wt=v[st];wt!==void 0&&(wt.update(j.inputSource,j.frame,h||a),wt.dispatchEvent({type:j.type,data:j.inputSource}))}function K(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",tt);for(let j=0;j<v.length;j++){let st=M[j];st!==null&&(M[j]=null,v[j].disconnect(st))}w=null,F=null,_.reset(),t.setRenderTarget(f),p=null,d=null,u=null,s=null,S=null,ie.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(E.width,E.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(j){h=j},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",K),s.addEventListener("inputsourceschange",tt),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(E),s.renderState.layers===void 0){let st={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new ci(p.framebufferWidth,p.framebufferHeight,{format:Un,type:ai,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let st=null,wt=null,vt=null;m.depth&&(vt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=m.stencil?Us:Rs,wt=m.stencil?ks:ts);let Wt={colorFormat:e.RGBA8,depthFormat:vt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Wt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new ci(d.textureWidth,d.textureHeight,{format:Un,type:ai,depthTexture:new Wo(d.textureWidth,d.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),ie.setContext(s),ie.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function tt(j){for(let st=0;st<j.removed.length;st++){let wt=j.removed[st],vt=M.indexOf(wt);vt>=0&&(M[vt]=null,v[vt].disconnect(wt))}for(let st=0;st<j.added.length;st++){let wt=j.added[st],vt=M.indexOf(wt);if(vt===-1){for(let Ft=0;Ft<v.length;Ft++)if(Ft>=M.length){M.push(wt),vt=Ft;break}else if(M[Ft]===null){M[Ft]=wt,vt=Ft;break}if(vt===-1)break}let Wt=v[vt];Wt&&Wt.connect(wt)}}let W=new I,it=new I;function q(j,st,wt){W.setFromMatrixPosition(st.matrixWorld),it.setFromMatrixPosition(wt.matrixWorld);let vt=W.distanceTo(it),Wt=st.projectionMatrix.elements,Ft=wt.projectionMatrix.elements,Kt=Wt[14]/(Wt[10]-1),se=Wt[14]/(Wt[10]+1),Qt=(Wt[9]+1)/Wt[5],T=(Wt[9]-1)/Wt[5],et=(Wt[8]-1)/Wt[0],Z=(Ft[8]+1)/Ft[0],at=Kt*et,rt=Kt*Z,ut=vt/(-et+Z),nt=ut*-et;if(st.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(nt),j.translateZ(ut),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Wt[10]===-1)j.projectionMatrix.copy(st.projectionMatrix),j.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{let L=Kt+ut,b=se+ut,O=at-nt,X=rt+(vt-nt),J=Qt*se/b*L,Y=T*se/b*L;j.projectionMatrix.makePerspective(O,X,J,Y,L,b),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function dt(j,st){st===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(st.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let st=j.near,wt=j.far;_.texture!==null&&(_.depthNear>0&&(st=_.depthNear),_.depthFar>0&&(wt=_.depthFar)),y.near=P.near=R.near=st,y.far=P.far=R.far=wt,(w!==y.near||F!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,F=y.far);let vt=j.parent,Wt=y.cameras;dt(y,vt);for(let Ft=0;Ft<Wt.length;Ft++)dt(Wt[Ft],vt);Wt.length===2?q(y,R,P):y.projectionMatrix.copy(R.projectionMatrix),xt(j,y,vt)};function xt(j,st,wt){wt===null?j.matrix.copy(st.matrixWorld):(j.matrix.copy(wt.matrixWorld),j.matrix.invert(),j.matrix.multiply(st.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(st.projectionMatrix),j.projectionMatrixInverse.copy(st.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=xl*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let yt=null;function te(j,st){if(l=st.getViewerPose(h||a),g=st,l!==null){let wt=l.views;p!==null&&(t.setRenderTargetFramebuffer(S,p.framebuffer),t.setRenderTarget(S));let vt=!1;wt.length!==y.cameras.length&&(y.cameras.length=0,vt=!0);for(let Ft=0;Ft<wt.length;Ft++){let Kt=wt[Ft],se=null;if(p!==null)se=p.getViewport(Kt);else{let T=u.getViewSubImage(d,Kt);se=T.viewport,Ft===0&&(t.setRenderTargetTextures(S,T.colorTexture,d.ignoreDepthValues?void 0:T.depthStencilTexture),t.setRenderTarget(S))}let Qt=N[Ft];Qt===void 0&&(Qt=new Ze,Qt.layers.enable(Ft),Qt.viewport=new be,N[Ft]=Qt),Qt.matrix.fromArray(Kt.transform.matrix),Qt.matrix.decompose(Qt.position,Qt.quaternion,Qt.scale),Qt.projectionMatrix.fromArray(Kt.projectionMatrix),Qt.projectionMatrixInverse.copy(Qt.projectionMatrix).invert(),Qt.viewport.set(se.x,se.y,se.width,se.height),Ft===0&&(y.matrix.copy(Qt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),vt===!0&&y.cameras.push(Qt)}let Wt=s.enabledFeatures;if(Wt&&Wt.includes("depth-sensing")){let Ft=u.getDepthInformation(wt[0]);Ft&&Ft.isValid&&Ft.texture&&_.init(t,Ft,s.renderState)}}for(let wt=0;wt<v.length;wt++){let vt=M[wt],Wt=v[wt];vt!==null&&Wt!==void 0&&Wt.update(vt,st,h||a)}yt&&yt(j,st),st.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:st}),g=null}let ie=new of;ie.setAnimationLoop(te),this.setAnimationLoop=function(j){yt=j},this.dispose=function(){}}},Xi=new $n,av=new ve;function cv(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,rf(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),l(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,S,v):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===en&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===en&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let S=t.get(f),v=S.envMap,M=S.envMapRotation;v&&(m.envMap.value=v,Xi.copy(M),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),m.envMapRotation.value.setFromMatrix4(av.makeRotationFromEuler(Xi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=v*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===en&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let S=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function lv(n,t,e,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,v){let M=v.program;i.uniformBlockBinding(S,M)}function h(S,v){let M=s[S.id];M===void 0&&(g(S),M=l(S),s[S.id]=M,S.addEventListener("dispose",m));let E=v.program;i.updateUBOMapping(S,E);let C=t.render.frame;r[S.id]!==C&&(d(S),r[S.id]=C)}function l(S){let v=u();S.__bindingPointIndex=v;let M=n.createBuffer(),E=S.__size,C=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,E,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let v=s[S.id],M=S.uniforms,E=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let C=0,R=M.length;C<R;C++){let P=Array.isArray(M[C])?M[C]:[M[C]];for(let N=0,y=P.length;N<y;N++){let w=P[N];if(p(w,C,N,E)===!0){let F=w.__offset,B=Array.isArray(w.value)?w.value:[w.value],K=0;for(let tt=0;tt<B.length;tt++){let W=B[tt],it=_(W);typeof W=="number"||typeof W=="boolean"?(w.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,F+K,w.__data)):W.isMatrix3?(w.__data[0]=W.elements[0],w.__data[1]=W.elements[1],w.__data[2]=W.elements[2],w.__data[3]=0,w.__data[4]=W.elements[3],w.__data[5]=W.elements[4],w.__data[6]=W.elements[5],w.__data[7]=0,w.__data[8]=W.elements[6],w.__data[9]=W.elements[7],w.__data[10]=W.elements[8],w.__data[11]=0):(W.toArray(w.__data,K),K+=it.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,w.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,v,M,E){let C=S.value,R=v+"_"+M;if(E[R]===void 0)return typeof C=="number"||typeof C=="boolean"?E[R]=C:E[R]=C.clone(),!0;{let P=E[R];if(typeof C=="number"||typeof C=="boolean"){if(P!==C)return E[R]=C,!0}else if(P.equals(C)===!1)return P.copy(C),!0}return!1}function g(S){let v=S.uniforms,M=0,E=16;for(let R=0,P=v.length;R<P;R++){let N=Array.isArray(v[R])?v[R]:[v[R]];for(let y=0,w=N.length;y<w;y++){let F=N[y],B=Array.isArray(F.value)?F.value:[F.value];for(let K=0,tt=B.length;K<tt;K++){let W=B[K],it=_(W),q=M%E,dt=q%it.boundary,xt=q+dt;M+=dt,xt!==0&&E-xt<it.storage&&(M+=E-xt),F.__data=new Float32Array(it.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=it.storage}}}let C=M%E;return C>0&&(M+=E-C),S.__size=M,S.__cache={},this}function _(S){let v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function m(S){let v=S.target;v.removeEventListener("dispose",m);let M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(let S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}var Ko=class{constructor(t={}){let{canvas:e=dm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Wn,this.toneMapping=bi,this.toneMappingExposure=1;let v=this,M=!1,E=0,C=0,R=null,P=-1,N=null,y=new be,w=new be,F=null,B=new Zt(0),K=0,tt=e.width,W=e.height,it=1,q=null,dt=null,xt=new be(0,0,tt,W),yt=new be(0,0,tt,W),te=!1,ie=new yr,j=!1,st=!1,wt=new ve,vt=new ve,Wt=new I,Ft=new be,Kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},se=!1;function Qt(){return R===null?it:1}let T=i;function et(A,k){return e.getContext(A,k)}try{let A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${nh}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",pt,!1),e.addEventListener("webglcontextcreationerror",_t,!1),T===null){let k="webgl2";if(T=et(k,A),T===null)throw et(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Z,at,rt,ut,nt,L,b,O,X,J,Y,At,lt,ft,Jt,ot,Mt,Vt,Gt,bt,ee,$t,pe,D;function gt(){Z=new E_(T),Z.init(),$t=new iv(T,Z),at=new v_(T,Z,t,$t),rt=new tv(T),at.reverseDepthBuffer&&rt.buffers.depth.setReversed(!0),ut=new R_(T),nt=new Hx,L=new nv(T,Z,rt,nt,at,$t,ut),b=new S_(v),O=new w_(v),X=new Um(T),pe=new __(T,X),J=new A_(T,X,ut,pe),Y=new L_(T,J,X,ut),Gt=new C_(T,at,L),ot=new y_(nt),At=new zx(v,b,O,Z,at,pe,ot),lt=new cv(v,nt),ft=new Gx,Jt=new Yx(Z),Vt=new g_(v,b,O,rt,Y,d,c),Mt=new Jx(v,Y,at),D=new lv(T,ut,at,rt),bt=new x_(T,Z,ut),ee=new T_(T,Z,ut),ut.programs=At.programs,v.capabilities=at,v.extensions=Z,v.properties=nt,v.renderLists=ft,v.shadowMap=Mt,v.state=rt,v.info=ut}gt();let $=new kl(v,T);this.xr=$,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){let A=Z.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Z.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return it},this.setPixelRatio=function(A){A!==void 0&&(it=A,this.setSize(tt,W,!1))},this.getSize=function(A){return A.set(tt,W)},this.setSize=function(A,k,z=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}tt=A,W=k,e.width=Math.floor(A*it),e.height=Math.floor(k*it),z===!0&&(e.style.width=A+"px",e.style.height=k+"px"),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(tt*it,W*it).floor()},this.setDrawingBufferSize=function(A,k,z){tt=A,W=k,it=z,e.width=Math.floor(A*z),e.height=Math.floor(k*z),this.setViewport(0,0,A,k)},this.getCurrentViewport=function(A){return A.copy(y)},this.getViewport=function(A){return A.copy(xt)},this.setViewport=function(A,k,z,V){A.isVector4?xt.set(A.x,A.y,A.z,A.w):xt.set(A,k,z,V),rt.viewport(y.copy(xt).multiplyScalar(it).round())},this.getScissor=function(A){return A.copy(yt)},this.setScissor=function(A,k,z,V){A.isVector4?yt.set(A.x,A.y,A.z,A.w):yt.set(A,k,z,V),rt.scissor(w.copy(yt).multiplyScalar(it).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(A){rt.setScissorTest(te=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){dt=A},this.getClearColor=function(A){return A.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(A=!0,k=!0,z=!0){let V=0;if(A){let U=!1;if(R!==null){let ct=R.texture.format;U=ct===ch||ct===ah||ct===oh}if(U){let ct=R.texture.type,mt=ct===ai||ct===ts||ct===gr||ct===ks||ct===sh||ct===rh,Tt=Vt.getClearColor(),Lt=Vt.getClearAlpha(),Bt=Tt.r,Ht=Tt.g,It=Tt.b;mt?(p[0]=Bt,p[1]=Ht,p[2]=It,p[3]=Lt,T.clearBufferuiv(T.COLOR,0,p)):(g[0]=Bt,g[1]=Ht,g[2]=It,g[3]=Lt,T.clearBufferiv(T.COLOR,0,g))}else V|=T.COLOR_BUFFER_BIT}k&&(V|=T.DEPTH_BUFFER_BIT,T.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),z&&(V|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",pt,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),ft.dispose(),Jt.dispose(),nt.dispose(),b.dispose(),O.dispose(),Y.dispose(),pe.dispose(),D.dispose(),At.dispose(),$.dispose(),$.removeEventListener("sessionstart",Ch),$.removeEventListener("sessionend",Lh),Di.stop()};function Q(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function pt(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;let A=ut.autoReset,k=Mt.enabled,z=Mt.autoUpdate,V=Mt.needsUpdate,U=Mt.type;gt(),ut.autoReset=A,Mt.enabled=k,Mt.autoUpdate=z,Mt.needsUpdate=V,Mt.type=U}function _t(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ne(A){let k=A.target;k.removeEventListener("dispose",ne),Ae(k)}function Ae(A){Je(A),nt.remove(A)}function Je(A){let k=nt.get(A).programs;k!==void 0&&(k.forEach(function(z){At.releaseProgram(z)}),A.isShaderMaterial&&At.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,z,V,U,ct){k===null&&(k=Kt);let mt=U.isMesh&&U.matrixWorld.determinant()<0,Tt=Ff(A,k,z,V,U);rt.setMaterial(V,mt);let Lt=z.index,Bt=1;if(V.wireframe===!0){if(Lt=J.getWireframeAttribute(z),Lt===void 0)return;Bt=2}let Ht=z.drawRange,It=z.attributes.position,le=Ht.start*Bt,me=(Ht.start+Ht.count)*Bt;ct!==null&&(le=Math.max(le,ct.start*Bt),me=Math.min(me,(ct.start+ct.count)*Bt)),Lt!==null?(le=Math.max(le,0),me=Math.min(me,Lt.count)):It!=null&&(le=Math.max(le,0),me=Math.min(me,It.count));let Se=me-le;if(Se<0||Se===1/0)return;pe.setup(U,V,Tt,z,Lt);let rn,oe=bt;if(Lt!==null&&(rn=X.get(Lt),oe=ee,oe.setIndex(rn)),U.isMesh)V.wireframe===!0?(rt.setLineWidth(V.wireframeLinewidth*Qt()),oe.setMode(T.LINES)):oe.setMode(T.TRIANGLES);else if(U.isLine){let Dt=V.linewidth;Dt===void 0&&(Dt=1),rt.setLineWidth(Dt*Qt()),U.isLineSegments?oe.setMode(T.LINES):U.isLineLoop?oe.setMode(T.LINE_LOOP):oe.setMode(T.LINE_STRIP)}else U.isPoints?oe.setMode(T.POINTS):U.isSprite&&oe.setMode(T.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)oe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Z.get("WEBGL_multi_draw"))oe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Dt=U._multiDrawStarts,Oe=U._multiDrawCounts,ae=U._multiDrawCount,An=Lt?X.get(Lt).bytesPerElement:1,os=nt.get(V).currentProgram.getUniforms();for(let on=0;on<ae;on++)os.setValue(T,"_gl_DrawID",on),oe.render(Dt[on]/An,Oe[on])}else if(U.isInstancedMesh)oe.renderInstances(le,Se,U.count);else if(z.isInstancedBufferGeometry){let Dt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Oe=Math.min(z.instanceCount,Dt);oe.renderInstances(le,Se,Oe)}else oe.render(le,Se)};function re(A,k,z){A.transparent===!0&&A.side===si&&A.forceSinglePass===!1?(A.side=en,A.needsUpdate=!0,Pr(A,k,z),A.side=wi,A.needsUpdate=!0,Pr(A,k,z),A.side=si):Pr(A,k,z)}this.compile=function(A,k,z=null){z===null&&(z=A),m=Jt.get(z),m.init(k),S.push(m),z.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),A!==z&&A.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();let V=new Set;return A.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let ct=U.material;if(ct)if(Array.isArray(ct))for(let mt=0;mt<ct.length;mt++){let Tt=ct[mt];re(Tt,z,U),V.add(Tt)}else re(ct,z,U),V.add(ct)}),S.pop(),m=null,V},this.compileAsync=function(A,k,z=null){let V=this.compile(A,k,z);return new Promise(U=>{function ct(){if(V.forEach(function(mt){nt.get(mt).currentProgram.isReady()&&V.delete(mt)}),V.size===0){U(A);return}setTimeout(ct,10)}Z.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let Qe=null;function Yn(A){Qe&&Qe(A)}function Ch(){Di.stop()}function Lh(){Di.start()}let Di=new of;Di.setAnimationLoop(Yn),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(A){Qe=A,$.setAnimationLoop(A),A===null?Di.stop():Di.start()},$.addEventListener("sessionstart",Ch),$.addEventListener("sessionend",Lh),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(k),k=$.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,k,R),m=Jt.get(A,S.length),m.init(k),S.push(m),vt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ie.setFromProjectionMatrix(vt),st=this.localClippingEnabled,j=ot.init(this.clippingPlanes,st),_=ft.get(A,f.length),_.init(),f.push(_),$.enabled===!0&&$.isPresenting===!0){let ct=v.xr.getDepthSensingMesh();ct!==null&&ya(ct,k,-1/0,v.sortObjects)}ya(A,k,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(q,dt),se=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,se&&Vt.addToRenderList(_,A),this.info.render.frame++,j===!0&&ot.beginShadows();let z=m.state.shadowsArray;Mt.render(z,A,k),j===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();let V=_.opaque,U=_.transmissive;if(m.setupLights(),k.isArrayCamera){let ct=k.cameras;if(U.length>0)for(let mt=0,Tt=ct.length;mt<Tt;mt++){let Lt=ct[mt];Ih(V,U,A,Lt)}se&&Vt.render(A);for(let mt=0,Tt=ct.length;mt<Tt;mt++){let Lt=ct[mt];Ph(_,A,Lt,Lt.viewport)}}else U.length>0&&Ih(V,U,A,k),se&&Vt.render(A),Ph(_,A,k);R!==null&&(L.updateMultisampleRenderTarget(R),L.updateRenderTargetMipmap(R)),A.isScene===!0&&A.onAfterRender(v,A,k),pe.resetDefaultState(),P=-1,N=null,S.pop(),S.length>0?(m=S[S.length-1],j===!0&&ot.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function ya(A,k,z,V){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ie.intersectsSprite(A)){V&&Ft.setFromMatrixPosition(A.matrixWorld).applyMatrix4(vt);let mt=Y.update(A),Tt=A.material;Tt.visible&&_.push(A,mt,Tt,z,Ft.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ie.intersectsObject(A))){let mt=Y.update(A),Tt=A.material;if(V&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ft.copy(A.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Ft.copy(mt.boundingSphere.center)),Ft.applyMatrix4(A.matrixWorld).applyMatrix4(vt)),Array.isArray(Tt)){let Lt=mt.groups;for(let Bt=0,Ht=Lt.length;Bt<Ht;Bt++){let It=Lt[Bt],le=Tt[It.materialIndex];le&&le.visible&&_.push(A,mt,le,z,Ft.z,It)}}else Tt.visible&&_.push(A,mt,Tt,z,Ft.z,null)}}let ct=A.children;for(let mt=0,Tt=ct.length;mt<Tt;mt++)ya(ct[mt],k,z,V)}function Ph(A,k,z,V){let U=A.opaque,ct=A.transmissive,mt=A.transparent;m.setupLightsView(z),j===!0&&ot.setGlobalState(v.clippingPlanes,z),V&&rt.viewport(y.copy(V)),U.length>0&&Lr(U,k,z),ct.length>0&&Lr(ct,k,z),mt.length>0&&Lr(mt,k,z),rt.buffers.depth.setTest(!0),rt.buffers.depth.setMask(!0),rt.buffers.color.setMask(!0),rt.setPolygonOffset(!1)}function Ih(A,k,z,V){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new ci(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")||Z.has("EXT_color_buffer_float")?wr:ai,minFilter:Qi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));let ct=m.state.transmissionRenderTarget[V.id],mt=V.viewport||y;ct.setSize(mt.z,mt.w);let Tt=v.getRenderTarget();v.setRenderTarget(ct),v.getClearColor(B),K=v.getClearAlpha(),K<1&&v.setClearColor(16777215,.5),v.clear(),se&&Vt.render(z);let Lt=v.toneMapping;v.toneMapping=bi;let Bt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),j===!0&&ot.setGlobalState(v.clippingPlanes,V),Lr(A,z,V),L.updateMultisampleRenderTarget(ct),L.updateRenderTargetMipmap(ct),Z.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let It=0,le=k.length;It<le;It++){let me=k[It],Se=me.object,rn=me.geometry,oe=me.material,Dt=me.group;if(oe.side===si&&Se.layers.test(V.layers)){let Oe=oe.side;oe.side=en,oe.needsUpdate=!0,Dh(Se,z,V,rn,oe,Dt),oe.side=Oe,oe.needsUpdate=!0,Ht=!0}}Ht===!0&&(L.updateMultisampleRenderTarget(ct),L.updateRenderTargetMipmap(ct))}v.setRenderTarget(Tt),v.setClearColor(B,K),Bt!==void 0&&(V.viewport=Bt),v.toneMapping=Lt}function Lr(A,k,z){let V=k.isScene===!0?k.overrideMaterial:null;for(let U=0,ct=A.length;U<ct;U++){let mt=A[U],Tt=mt.object,Lt=mt.geometry,Bt=V===null?mt.material:V,Ht=mt.group;Tt.layers.test(z.layers)&&Dh(Tt,k,z,Lt,Bt,Ht)}}function Dh(A,k,z,V,U,ct){A.onBeforeRender(v,k,z,V,U,ct),A.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),U.onBeforeRender(v,k,z,V,A,ct),U.transparent===!0&&U.side===si&&U.forceSinglePass===!1?(U.side=en,U.needsUpdate=!0,v.renderBufferDirect(z,k,V,U,A,ct),U.side=wi,U.needsUpdate=!0,v.renderBufferDirect(z,k,V,U,A,ct),U.side=si):v.renderBufferDirect(z,k,V,U,A,ct),A.onAfterRender(v,k,z,V,U,ct)}function Pr(A,k,z){k.isScene!==!0&&(k=Kt);let V=nt.get(A),U=m.state.lights,ct=m.state.shadowsArray,mt=U.state.version,Tt=At.getParameters(A,U.state,ct,k,z),Lt=At.getProgramCacheKey(Tt),Bt=V.programs;V.environment=A.isMeshStandardMaterial?k.environment:null,V.fog=k.fog,V.envMap=(A.isMeshStandardMaterial?O:b).get(A.envMap||V.environment),V.envMapRotation=V.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,Bt===void 0&&(A.addEventListener("dispose",ne),Bt=new Map,V.programs=Bt);let Ht=Bt.get(Lt);if(Ht!==void 0){if(V.currentProgram===Ht&&V.lightsStateVersion===mt)return Uh(A,Tt),Ht}else Tt.uniforms=At.getUniforms(A),A.onBeforeCompile(Tt,v),Ht=At.acquireProgram(Tt,Lt),Bt.set(Lt,Ht),V.uniforms=Tt.uniforms;let It=V.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(It.clippingPlanes=ot.uniform),Uh(A,Tt),V.needsLights=Bf(A),V.lightsStateVersion=mt,V.needsLights&&(It.ambientLightColor.value=U.state.ambient,It.lightProbe.value=U.state.probe,It.directionalLights.value=U.state.directional,It.directionalLightShadows.value=U.state.directionalShadow,It.spotLights.value=U.state.spot,It.spotLightShadows.value=U.state.spotShadow,It.rectAreaLights.value=U.state.rectArea,It.ltc_1.value=U.state.rectAreaLTC1,It.ltc_2.value=U.state.rectAreaLTC2,It.pointLights.value=U.state.point,It.pointLightShadows.value=U.state.pointShadow,It.hemisphereLights.value=U.state.hemi,It.directionalShadowMap.value=U.state.directionalShadowMap,It.directionalShadowMatrix.value=U.state.directionalShadowMatrix,It.spotShadowMap.value=U.state.spotShadowMap,It.spotLightMatrix.value=U.state.spotLightMatrix,It.spotLightMap.value=U.state.spotLightMap,It.pointShadowMap.value=U.state.pointShadowMap,It.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=Ht,V.uniformsList=null,Ht}function kh(A){if(A.uniformsList===null){let k=A.currentProgram.getUniforms();A.uniformsList=Ls.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function Uh(A,k){let z=nt.get(A);z.outputColorSpace=k.outputColorSpace,z.batching=k.batching,z.batchingColor=k.batchingColor,z.instancing=k.instancing,z.instancingColor=k.instancingColor,z.instancingMorph=k.instancingMorph,z.skinning=k.skinning,z.morphTargets=k.morphTargets,z.morphNormals=k.morphNormals,z.morphColors=k.morphColors,z.morphTargetsCount=k.morphTargetsCount,z.numClippingPlanes=k.numClippingPlanes,z.numIntersection=k.numClipIntersection,z.vertexAlphas=k.vertexAlphas,z.vertexTangents=k.vertexTangents,z.toneMapping=k.toneMapping}function Ff(A,k,z,V,U){k.isScene!==!0&&(k=Kt),L.resetTextureUnits();let ct=k.fog,mt=V.isMeshStandardMaterial?k.environment:null,Tt=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Li,Lt=(V.isMeshStandardMaterial?O:b).get(V.envMap||mt),Bt=V.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ht=!!z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),It=!!z.morphAttributes.position,le=!!z.morphAttributes.normal,me=!!z.morphAttributes.color,Se=bi;V.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Se=v.toneMapping);let rn=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,oe=rn!==void 0?rn.length:0,Dt=nt.get(V),Oe=m.state.lights;if(j===!0&&(st===!0||A!==N)){let fn=A===N&&V.id===P;ot.setState(V,A,fn)}let ae=!1;V.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==Oe.state.version||Dt.outputColorSpace!==Tt||U.isBatchedMesh&&Dt.batching===!1||!U.isBatchedMesh&&Dt.batching===!0||U.isBatchedMesh&&Dt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Dt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Dt.instancing===!1||!U.isInstancedMesh&&Dt.instancing===!0||U.isSkinnedMesh&&Dt.skinning===!1||!U.isSkinnedMesh&&Dt.skinning===!0||U.isInstancedMesh&&Dt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Dt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Dt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Dt.instancingMorph===!1&&U.morphTexture!==null||Dt.envMap!==Lt||V.fog===!0&&Dt.fog!==ct||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==ot.numPlanes||Dt.numIntersection!==ot.numIntersection)||Dt.vertexAlphas!==Bt||Dt.vertexTangents!==Ht||Dt.morphTargets!==It||Dt.morphNormals!==le||Dt.morphColors!==me||Dt.toneMapping!==Se||Dt.morphTargetsCount!==oe)&&(ae=!0):(ae=!0,Dt.__version=V.version);let An=Dt.currentProgram;ae===!0&&(An=Pr(V,k,U));let os=!1,on=!1,Sa=!1,Ee=An.getUniforms(),hi=Dt.uniforms;if(rt.useProgram(An.program)&&(os=!0,on=!0,Sa=!0),V.id!==P&&(P=V.id,on=!0),os||N!==A){at.reverseDepthBuffer?(wt.copy(A.projectionMatrix),pm(wt),mm(wt),Ee.setValue(T,"projectionMatrix",wt)):Ee.setValue(T,"projectionMatrix",A.projectionMatrix),Ee.setValue(T,"viewMatrix",A.matrixWorldInverse);let fn=Ee.map.cameraPosition;fn!==void 0&&fn.setValue(T,Wt.setFromMatrixPosition(A.matrixWorld)),at.logarithmicDepthBuffer&&Ee.setValue(T,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Ee.setValue(T,"isOrthographic",A.isOrthographicCamera===!0),N!==A&&(N=A,on=!0,Sa=!0)}if(U.isSkinnedMesh){Ee.setOptional(T,U,"bindMatrix"),Ee.setOptional(T,U,"bindMatrixInverse");let fn=U.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),Ee.setValue(T,"boneTexture",fn.boneTexture,L))}U.isBatchedMesh&&(Ee.setOptional(T,U,"batchingTexture"),Ee.setValue(T,"batchingTexture",U._matricesTexture,L),Ee.setOptional(T,U,"batchingIdTexture"),Ee.setValue(T,"batchingIdTexture",U._indirectTexture,L),Ee.setOptional(T,U,"batchingColorTexture"),U._colorsTexture!==null&&Ee.setValue(T,"batchingColorTexture",U._colorsTexture,L));let Ma=z.morphAttributes;if((Ma.position!==void 0||Ma.normal!==void 0||Ma.color!==void 0)&&Gt.update(U,z,An),(on||Dt.receiveShadow!==U.receiveShadow)&&(Dt.receiveShadow=U.receiveShadow,Ee.setValue(T,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(hi.envMap.value=Lt,hi.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&k.environment!==null&&(hi.envMapIntensity.value=k.environmentIntensity),on&&(Ee.setValue(T,"toneMappingExposure",v.toneMappingExposure),Dt.needsLights&&Of(hi,Sa),ct&&V.fog===!0&&lt.refreshFogUniforms(hi,ct),lt.refreshMaterialUniforms(hi,V,it,W,m.state.transmissionRenderTarget[A.id]),Ls.upload(T,kh(Dt),hi,L)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Ls.upload(T,kh(Dt),hi,L),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Ee.setValue(T,"center",U.center),Ee.setValue(T,"modelViewMatrix",U.modelViewMatrix),Ee.setValue(T,"normalMatrix",U.normalMatrix),Ee.setValue(T,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){let fn=V.uniformsGroups;for(let ba=0,zf=fn.length;ba<zf;ba++){let Nh=fn[ba];D.update(Nh,An),D.bind(Nh,An)}}return An}function Of(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function Bf(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(A,k,z){nt.get(A.texture).__webglTexture=k,nt.get(A.depthTexture).__webglTexture=z;let V=nt.get(A);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=z===void 0,V.__autoAllocateDepthBuffer||Z.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,k){let z=nt.get(A);z.__webglFramebuffer=k,z.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,z=0){R=A,E=k,C=z;let V=!0,U=null,ct=!1,mt=!1;if(A){let Lt=nt.get(A);if(Lt.__useDefaultFramebuffer!==void 0)rt.bindFramebuffer(T.FRAMEBUFFER,null),V=!1;else if(Lt.__webglFramebuffer===void 0)L.setupRenderTarget(A);else if(Lt.__hasExternalTextures)L.rebindTextures(A,nt.get(A.texture).__webglTexture,nt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let It=A.depthTexture;if(Lt.__boundDepthTexture!==It){if(It!==null&&nt.has(It)&&(A.width!==It.image.width||A.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(A)}}let Bt=A.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(mt=!0);let Ht=nt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ht[k])?U=Ht[k][z]:U=Ht[k],ct=!0):A.samples>0&&L.useMultisampledRTT(A)===!1?U=nt.get(A).__webglMultisampledFramebuffer:Array.isArray(Ht)?U=Ht[z]:U=Ht,y.copy(A.viewport),w.copy(A.scissor),F=A.scissorTest}else y.copy(xt).multiplyScalar(it).floor(),w.copy(yt).multiplyScalar(it).floor(),F=te;if(rt.bindFramebuffer(T.FRAMEBUFFER,U)&&V&&rt.drawBuffers(A,U),rt.viewport(y),rt.scissor(w),rt.setScissorTest(F),ct){let Lt=nt.get(A.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+k,Lt.__webglTexture,z)}else if(mt){let Lt=nt.get(A.texture),Bt=k||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,Lt.__webglTexture,z||0,Bt)}P=-1},this.readRenderTargetPixels=function(A,k,z,V,U,ct,mt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=nt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&mt!==void 0&&(Tt=Tt[mt]),Tt){rt.bindFramebuffer(T.FRAMEBUFFER,Tt);try{let Lt=A.texture,Bt=Lt.format,Ht=Lt.type;if(!at.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!at.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-V&&z>=0&&z<=A.height-U&&T.readPixels(k,z,V,U,$t.convert(Bt),$t.convert(Ht),ct)}finally{let Lt=R!==null?nt.get(R).__webglFramebuffer:null;rt.bindFramebuffer(T.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(A,k,z,V,U,ct,mt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=nt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&mt!==void 0&&(Tt=Tt[mt]),Tt){let Lt=A.texture,Bt=Lt.format,Ht=Lt.type;if(!at.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!at.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=A.width-V&&z>=0&&z<=A.height-U){rt.bindFramebuffer(T.FRAMEBUFFER,Tt);let It=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,It),T.bufferData(T.PIXEL_PACK_BUFFER,ct.byteLength,T.STREAM_READ),T.readPixels(k,z,V,U,$t.convert(Bt),$t.convert(Ht),0);let le=R!==null?nt.get(R).__webglFramebuffer:null;rt.bindFramebuffer(T.FRAMEBUFFER,le);let me=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await fm(T,me,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,It),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,ct),T.deleteBuffer(It),T.deleteSync(me),ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,k=null,z=0){A.isTexture!==!0&&(Co("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,A=arguments[1]);let V=Math.pow(2,-z),U=Math.floor(A.image.width*V),ct=Math.floor(A.image.height*V),mt=k!==null?k.x:0,Tt=k!==null?k.y:0;L.setTexture2D(A,0),T.copyTexSubImage2D(T.TEXTURE_2D,z,0,0,mt,Tt,U,ct),rt.unbindTexture()},this.copyTextureToTexture=function(A,k,z=null,V=null,U=0){A.isTexture!==!0&&(Co("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,A=arguments[1],k=arguments[2],U=arguments[3]||0,z=null);let ct,mt,Tt,Lt,Bt,Ht;z!==null?(ct=z.max.x-z.min.x,mt=z.max.y-z.min.y,Tt=z.min.x,Lt=z.min.y):(ct=A.image.width,mt=A.image.height,Tt=0,Lt=0),V!==null?(Bt=V.x,Ht=V.y):(Bt=0,Ht=0);let It=$t.convert(k.format),le=$t.convert(k.type);L.setTexture2D(k,0),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,k.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,k.unpackAlignment);let me=T.getParameter(T.UNPACK_ROW_LENGTH),Se=T.getParameter(T.UNPACK_IMAGE_HEIGHT),rn=T.getParameter(T.UNPACK_SKIP_PIXELS),oe=T.getParameter(T.UNPACK_SKIP_ROWS),Dt=T.getParameter(T.UNPACK_SKIP_IMAGES),Oe=A.isCompressedTexture?A.mipmaps[U]:A.image;T.pixelStorei(T.UNPACK_ROW_LENGTH,Oe.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Oe.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Tt),T.pixelStorei(T.UNPACK_SKIP_ROWS,Lt),A.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,U,Bt,Ht,ct,mt,It,le,Oe.data):A.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,U,Bt,Ht,Oe.width,Oe.height,It,Oe.data):T.texSubImage2D(T.TEXTURE_2D,U,Bt,Ht,ct,mt,It,le,Oe),T.pixelStorei(T.UNPACK_ROW_LENGTH,me),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Se),T.pixelStorei(T.UNPACK_SKIP_PIXELS,rn),T.pixelStorei(T.UNPACK_SKIP_ROWS,oe),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Dt),U===0&&k.generateMipmaps&&T.generateMipmap(T.TEXTURE_2D),rt.unbindTexture()},this.copyTextureToTexture3D=function(A,k,z=null,V=null,U=0){A.isTexture!==!0&&(Co("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,V=arguments[1]||null,A=arguments[2],k=arguments[3],U=arguments[4]||0);let ct,mt,Tt,Lt,Bt,Ht,It,le,me,Se=A.isCompressedTexture?A.mipmaps[U]:A.image;z!==null?(ct=z.max.x-z.min.x,mt=z.max.y-z.min.y,Tt=z.max.z-z.min.z,Lt=z.min.x,Bt=z.min.y,Ht=z.min.z):(ct=Se.width,mt=Se.height,Tt=Se.depth,Lt=0,Bt=0,Ht=0),V!==null?(It=V.x,le=V.y,me=V.z):(It=0,le=0,me=0);let rn=$t.convert(k.format),oe=$t.convert(k.type),Dt;if(k.isData3DTexture)L.setTexture3D(k,0),Dt=T.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)L.setTexture2DArray(k,0),Dt=T.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,k.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,k.unpackAlignment);let Oe=T.getParameter(T.UNPACK_ROW_LENGTH),ae=T.getParameter(T.UNPACK_IMAGE_HEIGHT),An=T.getParameter(T.UNPACK_SKIP_PIXELS),os=T.getParameter(T.UNPACK_SKIP_ROWS),on=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,Se.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Se.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Lt),T.pixelStorei(T.UNPACK_SKIP_ROWS,Bt),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ht),A.isDataTexture||A.isData3DTexture?T.texSubImage3D(Dt,U,It,le,me,ct,mt,Tt,rn,oe,Se.data):k.isCompressedArrayTexture?T.compressedTexSubImage3D(Dt,U,It,le,me,ct,mt,Tt,rn,Se.data):T.texSubImage3D(Dt,U,It,le,me,ct,mt,Tt,rn,oe,Se),T.pixelStorei(T.UNPACK_ROW_LENGTH,Oe),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,ae),T.pixelStorei(T.UNPACK_SKIP_PIXELS,An),T.pixelStorei(T.UNPACK_SKIP_ROWS,os),T.pixelStorei(T.UNPACK_SKIP_IMAGES,on),U===0&&k.generateMipmaps&&T.generateMipmap(Dt),rt.unbindTexture()},this.initRenderTarget=function(A){nt.get(A).__webglFramebuffer===void 0&&L.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?L.setTextureCube(A,0):A.isData3DTexture?L.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?L.setTexture2DArray(A,0):L.setTexture2D(A,0),rt.unbindTexture()},this.resetState=function(){E=0,C=0,R=null,rt.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===lh?"display-p3":"srgb",e.unpackColorSpace=ce.workingColorSpace===ca?"display-p3":"srgb"}};var $o=class extends $e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var ns=class extends Ti{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Xo=new I,qo=new I,Pd=new ve,ur=new _r,yo=new Ns,Tc=new I,Id=new I,Sr=class extends $e{constructor(t=new Xe,e=new ns){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)Xo.fromBufferAttribute(e,s-1),qo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Xo.distanceTo(qo);t.setAttribute("lineDistance",new _e(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),yo.copy(i.boundingSphere),yo.applyMatrix4(s),yo.radius+=r,t.ray.intersectsSphere(yo)===!1)return;Pd.copy(s).invert(),ur.copy(t.ray).applyMatrix4(Pd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,l=i.index,d=i.attributes.position;if(l!==null){let p=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=l.getX(_),S=l.getX(_+1),v=So(this,t,ur,c,f,S);v&&e.push(v)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),f=So(this,t,ur,c,_,m);f&&e.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=So(this,t,ur,c,_,_+1);f&&e.push(f)}if(this.isLineLoop){let _=So(this,t,ur,c,g-1,p);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function So(n,t,e,i,s,r){let a=n.geometry.attributes.position;if(Xo.fromBufferAttribute(a,s),qo.fromBufferAttribute(a,r),e.distanceSqToSegment(Xo,qo,Tc,Id)>i)return;Tc.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(Tc);if(!(c<t.near||c>t.far))return{distance:c,point:Id.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Dd=new I,kd=new I,Mr=class extends Sr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)Dd.fromBufferAttribute(e,s),kd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Dd.distanceTo(kd);t.setAttribute("lineDistance",new _e(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var yn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let i=this.getLengths(),s=0,r=i.length,a;e?a=e:a=t*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);let l=i[s],d=i[s+1]-l,p=(a-l)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new Ct:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){let i=new I,s=[],r=[],a=[],o=new I,c=new ve;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),d<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Ve(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Ve(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},br=class extends yn{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new Ct){let i=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=h-this.aY;c=d*l-p*u+this.aX,h=d*u+p*l+this.aY}return i.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ul=class extends br{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function uh(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let d=(a-r)/h-(o-r)/(h+l)+(o-a)/l,p=(o-a)/l-(c-a)/(l+u)+(c-o)/u;d*=l,p*=l,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return n+t*r+e*a+i*o}}}var Mo=new I,Rc=new uh,Cc=new uh,Lc=new uh,Nl=class extends yn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new I){let i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(Mo.subVectors(s[0],s[1]).add(s[0]),h=Mo);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(Mo.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Mo),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Rc.initNonuniformCatmullRom(h.x,u.x,d.x,l.x,g,_,m),Cc.initNonuniformCatmullRom(h.y,u.y,d.y,l.y,g,_,m),Lc.initNonuniformCatmullRom(h.z,u.z,d.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(Rc.initCatmullRom(h.x,u.x,d.x,l.x,this.tension),Cc.initCatmullRom(h.y,u.y,d.y,l.y,this.tension),Lc.initCatmullRom(h.z,u.z,d.z,l.z,this.tension));return i.set(Rc.calc(c),Cc.calc(c),Lc.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Ud(n,t,e,i,s){let r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function hv(n,t){let e=1-n;return e*e*t}function uv(n,t){return 2*(1-n)*n*t}function dv(n,t){return n*n*t}function pr(n,t,e,i){return hv(n,t)+uv(n,e)+dv(n,i)}function fv(n,t){let e=1-n;return e*e*e*t}function pv(n,t){let e=1-n;return 3*e*e*n*t}function mv(n,t){return 3*(1-n)*n*n*t}function gv(n,t){return n*n*n*t}function mr(n,t,e,i,s){return fv(n,t)+pv(n,e)+mv(n,i)+gv(n,s)}var Yo=class extends yn{constructor(t=new Ct,e=new Ct,i=new Ct,s=new Ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Ct){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(mr(t,s.x,r.x,a.x,o.x),mr(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Fl=class extends yn{constructor(t=new I,e=new I,i=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new I){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(mr(t,s.x,r.x,a.x,o.x),mr(t,s.y,r.y,a.y,o.y),mr(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Zo=class extends yn{constructor(t=new Ct,e=new Ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Ct){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ol=class extends yn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},jo=class extends yn{constructor(t=new Ct,e=new Ct,i=new Ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Ct){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(pr(t,s.x,r.x,a.x),pr(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Bl=class extends yn{constructor(t=new I,e=new I,i=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new I){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(pr(t,s.x,r.x,a.x),pr(t,s.y,r.y,a.y),pr(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Jo=class extends yn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Ct){let i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],l=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Ud(o,c.x,h.x,l.x,u.x),Ud(o,c.y,h.y,l.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new Ct().fromArray(s))}return this}},Nd=Object.freeze({__proto__:null,ArcCurve:Ul,CatmullRomCurve3:Nl,CubicBezierCurve:Yo,CubicBezierCurve3:Fl,EllipseCurve:br,LineCurve:Zo,LineCurve3:Ol,QuadraticBezierCurve:jo,QuadraticBezierCurve3:Bl,SplineCurve:Jo}),zl=class extends yn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nd[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let a=s[r]-i,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let h=0;h<c.length;h++){let l=c[h];i&&i.equals(l)||(e.push(l),i=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(new Nd[s.type]().fromJSON(s))}return this}},Hl=class extends zl{constructor(t){super(),this.type="Path",this.currentPoint=new Ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new Zo(this.currentPoint.clone(),new Ct(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){let r=new jo(this.currentPoint.clone(),new Ct(t,e),new Ct(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){let o=new Yo(this.currentPoint.clone(),new Ct(t,e),new Ct(i,s),new Ct(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new Jo(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){let h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){let h=new br(t,e,i,s,r,a,o,c);if(this.curves.length>0){let u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);let l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Vl=class n extends Xe{constructor(t=[new Ct(0,-.5),new Ct(.5,0),new Ct(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=Ve(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],h=[],l=1/e,u=new I,d=new Ct,p=new I,g=new I,_=new I,m=0,f=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:m=t[S+1].x-t[S].x,f=t[S+1].y-t[S].y,p.x=f*1,p.y=-m,p.z=f*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[S+1].x-t[S].x,f=t[S+1].y-t[S].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let S=0;S<=e;S++){let v=i+S*l*s,M=Math.sin(v),E=Math.cos(v);for(let C=0;C<=t.length-1;C++){u.x=t[C].x*M,u.y=t[C].y,u.z=t[C].x*E,a.push(u.x,u.y,u.z),d.x=S/e,d.y=C/(t.length-1),o.push(d.x,d.y);let R=c[3*C+0]*M,P=c[3*C+1],N=c[3*C+0]*E;h.push(R,P,N)}}for(let S=0;S<e;S++)for(let v=0;v<t.length-1;v++){let M=v+S*t.length,E=M,C=M+t.length,R=M+t.length+1,P=M+1;r.push(E,C,P),r.push(R,P,C)}this.setIndex(r),this.setAttribute("position",new _e(a,3)),this.setAttribute("uv",new _e(o,2)),this.setAttribute("normal",new _e(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.points,t.segments,t.phiStart,t.phiLength)}},Qo=class n extends Vl{constructor(t=1,e=1,i=4,s=8){let r=new Hl;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(i),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:i,radialSegments:s}}static fromJSON(t){return new n(t.radius,t.length,t.capSegments,t.radialSegments)}};var ta=class n extends Xe{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],d=[],p=[],g=0,_=[],m=i/2,f=0;S(),a===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new _e(u,3)),this.setAttribute("normal",new _e(d,3)),this.setAttribute("uv",new _e(p,2));function S(){let M=new I,E=new I,C=0,R=(e-t)/i;for(let P=0;P<=r;P++){let N=[],y=P/r,w=y*(e-t)+t;for(let F=0;F<=s;F++){let B=F/s,K=B*c+o,tt=Math.sin(K),W=Math.cos(K);E.x=w*tt,E.y=-y*i+m,E.z=w*W,u.push(E.x,E.y,E.z),M.set(tt,R,W).normalize(),d.push(M.x,M.y,M.z),p.push(B,1-y),N.push(g++)}_.push(N)}for(let P=0;P<s;P++)for(let N=0;N<r;N++){let y=_[N][P],w=_[N+1][P],F=_[N+1][P+1],B=_[N][P+1];t>0&&(l.push(y,w,B),C+=3),e>0&&(l.push(w,F,B),C+=3)}h.addGroup(f,C,0),f+=C}function v(M){let E=g,C=new Ct,R=new I,P=0,N=M===!0?t:e,y=M===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*y,0),d.push(0,y,0),p.push(.5,.5),g++;let w=g;for(let F=0;F<=s;F++){let K=F/s*c+o,tt=Math.cos(K),W=Math.sin(K);R.x=N*W,R.y=m*y,R.z=N*tt,u.push(R.x,R.y,R.z),d.push(0,y,0),C.x=tt*.5+.5,C.y=W*.5*y+.5,p.push(C.x,C.y),g++}for(let F=0;F<s;F++){let B=E+F,K=w+F;M===!0?l.push(K,K+1,B):l.push(K+1,K,B),P+=3}h.addGroup(f,P,M===!0?1:2),f+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Bs=class n extends Xe{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),h=0,l=[],u=new I,d=new I,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let S=[],v=f/i,M=0;f===0&&a===0?M=.5/e:f===i&&c===Math.PI&&(M=-.5/e);for(let E=0;E<=e;E++){let C=E/e;u.x=-t*Math.cos(s+C*r)*Math.sin(a+v*o),u.y=t*Math.cos(a+v*o),u.z=t*Math.sin(s+C*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(C+M,1-v),S.push(h++)}l.push(S)}for(let f=0;f<i;f++)for(let S=0;S<e;S++){let v=l[f][S+1],M=l[f][S],E=l[f+1][S],C=l[f+1][S+1];(f!==0||a>0)&&p.push(v,M,C),(f!==i-1||c<Math.PI)&&p.push(M,E,C)}this.setIndex(p),this.setAttribute("position",new _e(g,3)),this.setAttribute("normal",new _e(_,3)),this.setAttribute("uv",new _e(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Ri=class n extends Xe{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],h=[],l=new I,u=new I,d=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),l.x=t*Math.cos(_),l.y=t*Math.sin(_),d.subVectors(u,l).normalize(),c.push(d.x,d.y,d.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(_,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new _e(o,3)),this.setAttribute("normal",new _e(c,3)),this.setAttribute("uv",new _e(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ci=class extends Ti{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tf,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function bo(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function _v(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var zs=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=e[++i],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break n}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Gl=class extends zs{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Bu,endingEnd:Bu}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case zu:r=t,o=2*e-i;break;case Hu:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case zu:a=t,c=2*i-e;break;case Hu:a=1,c=i+s[1]-s[0];break;default:a=t-1,c=e}let h=(i-e)*.5,l=this.valueSize;this._weightPrev=h/(e-o),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=a*l}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,h=c-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,S=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,M=p*m-p*_;for(let E=0;E!==o;++E)r[E]=f*a[l+E]+S*a[h+E]+v*a[c+E]+M*a[u+E];return r}},Wl=class extends zs{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,h=c-o,l=(i-e)/(s-e),u=1-l;for(let d=0;d!==o;++d)r[d]=a[h+d]*u+a[c+d]*l;return r}},Kl=class extends zs{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Fn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=bo(e,this.TimeBufferType),this.values=bo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:bo(t.times,Array),values:bo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Kl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Wl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Gl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Lo:e=this.InterpolantFactoryMethodDiscrete;break;case _l:e=this.InterpolantFactoryMethodLinear;break;case ja:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Lo;case this.InterpolantFactoryMethodLinear:return _l;case this.InterpolantFactoryMethodSmooth:return ja}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&_v(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ja,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=t[o],l=t[o+1];if(h!==l&&(o!==1||h!==t[0]))if(s)c=!0;else{let u=o*i,d=u-i,p=u+i;for(let g=0;g!==i;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let u=o*i,d=a*i;for(let p=0;p!==i;++p)e[d+p]=e[u+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,c=a*i,h=0;h!==i;++h)e[c+h]=e[o+h];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Fn.prototype.TimeBufferType=Float32Array;Fn.prototype.ValueBufferType=Float32Array;Fn.prototype.DefaultInterpolation=_l;var is=class extends Fn{constructor(t,e,i){super(t,e,i)}};is.prototype.ValueTypeName="bool";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=Lo;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var $l=class extends Fn{};$l.prototype.ValueTypeName="color";var Xl=class extends Fn{};Xl.prototype.ValueTypeName="number";var ql=class extends zs{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-e)/(s-e),h=t*o;for(let l=h+o;h!==l;h+=4)Ai.slerpFlat(r,0,a,h-o,a,h,c);return r}},ea=class extends Fn{InterpolantFactoryMethodLinear(t){return new ql(this.times,this.values,this.getValueSize(),t)}};ea.prototype.ValueTypeName="quaternion";ea.prototype.InterpolantFactoryMethodSmooth=void 0;var ss=class extends Fn{constructor(t,e,i){super(t,e,i)}};ss.prototype.ValueTypeName="string";ss.prototype.ValueBufferType=Array;ss.prototype.DefaultInterpolation=Lo;ss.prototype.InterpolantFactoryMethodLinear=void 0;ss.prototype.InterpolantFactoryMethodSmooth=void 0;var Yl=class extends Fn{};Yl.prototype.ValueTypeName="vector";var Zl=class{constructor(t,e,i){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(l){o++,r===!1&&s.onStart!==void 0&&s.onStart(l,a,o),r=!0},this.itemEnd=function(l){a++,s.onProgress!==void 0&&s.onProgress(l,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,d=h.length;u<d;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},xv=new Zl,jl=class{constructor(t){this.manager=t!==void 0?t:xv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};jl.DEFAULT_MATERIAL_NAME="__DEFAULT";var na=class extends $e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ia=class extends na{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Pc=new ve,Fd=new I,Od=new I,Jl=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.map=null,this.mapPass=null,this.matrix=new ve,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yr,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;Fd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fd),Od.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Od),e.updateMatrixWorld(),Pc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Pc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Ql=class extends Jl{constructor(){super(new Vo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},sa=class extends na{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($e.DEFAULT_UP),this.updateMatrix(),this.target=new $e,this.shadow=new Ql}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var dh="\\[\\]\\.:\\/",vv=new RegExp("["+dh+"]","g"),fh="[^"+dh+"]",yv="[^"+dh.replace("\\.","")+"]",Sv=/((?:WC+[\/:])*)/.source.replace("WC",fh),Mv=/(WCOD+)?/.source.replace("WCOD",yv),bv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",fh),wv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",fh),Ev=new RegExp("^"+Sv+Mv+bv+wv+"$"),Av=["material","materials","bones","map"],th=class{constructor(t,e,i){let s=i||xe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},xe=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(vv,"")}static parseTrackName(t){let e=Ev.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Av.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=i(o.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let l=0;l<t.length;l++)if(t[l].name===h){h=l;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(h!==void 0){if(t[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let a=t[s];if(a===void 0){let h=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xe.Composite=th;xe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xe.prototype.GetterByBindingType=[xe.prototype._getValue_direct,xe.prototype._getValue_array,xe.prototype._getValue_arrayElement,xe.prototype._getValue_toArray];xe.prototype.SetterByBindingTypeAndVersioning=[[xe.prototype._setValue_direct,xe.prototype._setValue_direct_setNeedsUpdate,xe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_array,xe.prototype._setValue_array_setNeedsUpdate,xe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_arrayElement,xe.prototype._setValue_arrayElement_setNeedsUpdate,xe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_fromArray,xe.prototype._setValue_fromArray_setNeedsUpdate,xe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var pS=new Float32Array(1);var Bd=new ve,ra=class{constructor(t,e,i=0,s=1/0){this.ray=new _r(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new xr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bd),this}intersectObject(t,e=!0,i=[]){return eh(t,this,i,e),i.sort(zd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)eh(t[s],this,i,e);return i.sort(zd),i}};function zd(n,t){return n.distance-t.distance}function eh(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let a=0,o=r.length;a<o;a++)eh(r[a],t,e,!0)}}var oa=class extends Mr{constructor(t=10,e=10,i=4473924,s=8947848){i=new Zt(i),s=new Zt(s);let r=e/2,a=t/e,o=t/2,c=[],h=[];for(let d=0,p=0,g=-o;d<=e;d++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);let _=d===r?i:s;_.toArray(h,p),p+=3,_.toArray(h,p),p+=3,_.toArray(h,p),p+=3,_.toArray(h,p),p+=3}let l=new Xe;l.setAttribute("position",new _e(c,3)),l.setAttribute("color",new _e(h,3));let u=new ns({vertexColors:!0,toneMapped:!1});super(l,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nh);var Rv={a:5217791,b:16751164},uf=[16731469,5111658,5082623],Cv={hand:16769357,foot:4645060,root:16735457,look:16777215,pole:11766015,mover:10215773},df=new I(0,0,1),Pi=new I,Ii=new I,ph=n=>new I(n[0],n[1],n[2]);function ff(n,{inGame:t,onCamera:e}){let i=new Ko({antialias:!0,alpha:!0,preserveDrawingBuffer:!t});i.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),i.setClearColor(0,0),n.append(i.domElement);let s=new $o;t||(s.background=new Zt(2106154));let r=new dn;r.rotation.x=-Math.PI/2,s.add(r),s.add(new ia(15660031,4210760,1.4));let a=new sa(16777215,1.1);a.position.set(2,5,3),s.add(a);let o=new Ze(45,1,.05,200),c=-.993,h=new oa(8,32,8029076,4870236);if(h.rotation.x=Math.PI/2,h.position.z=c+.001,h.material.transparent=!0,h.material.opacity=t?.25:.6,r.add(h),!t){let T=new we(new Os(30,30),new Ci({color:2830135,roughness:1}));T.position.z=c-.002,r.add(T)}let l={target:[0,0,.1],yaw:180,pitch:-6,dist:3.2,fov:45},u={min:.4,max:12};function d(){let T=l.yaw*zt,et=l.pitch*zt,Z=[-Math.sin(T)*Math.cos(et),Math.cos(T)*Math.cos(et),Math.sin(et)];return[l.target[0]-Z[0]*l.dist,l.target[1]-Z[1]*l.dist,l.target[2]-Z[2]*l.dist]}function p(){let T=d();o.position.set(T[0],T[2],-T[1]),o.up.set(0,1,0),o.lookAt(l.target[0],l.target[2],-l.target[1]),o.fov=l.fov,o.updateProjectionMatrix(),e?.({p:T,yaw:l.yaw,pitch:l.pitch,fov:l.fov})}function g(T,et=[0,0,.1]){let Z={front:[180,-6,3.2],side:[90,-6,3.2],top:[180,-88,4.2],shoulder:[0,-14,1.3],back:[0,-6,3.2]}[T];Z&&(l.yaw=Z[0],l.pitch=Z[1],l.dist=Z[2],l.target=T==="shoulder"?[et[0]+.35,et[1]+.9,et[2]+.35]:et.slice(),p())}function _(T,et=1.2){l.target=T.slice(),l.dist=Math.max(u.min,et),p()}function m(){let T=n.getBoundingClientRect();i.setSize(T.width,T.height,!1);let et=Math.max(1,window.innerWidth),Z=Math.max(1,window.innerHeight);o.aspect=et/Z,o.setViewOffset(et,Z,T.left,T.top,Math.max(1,T.width),Math.max(1,T.height)),o.updateProjectionMatrix()}window.addEventListener("resize",m);let f={},S=new ta(1,1,1,8,1);S.rotateX(Math.PI/2);let v=new Bs(1,8,6);function M(T,et){f[T]&&(r.remove(f[T].group),r.remove(f[T].onion[0]),r.remove(f[T].onion[1]));let Z=Rv[T]??13421772,at=new dn,rt=new Ci({color:Z,roughness:.5,depthTest:!0}),ut=new Ci({color:16769357,emissive:5587968,roughness:.4}),nt=new Ci({color:Z,roughness:.7,transparent:!0,opacity:.22,depthWrite:!1}),L=new Ci({color:16777215,roughness:.4}),b=new Nn({visible:!1}),O={id:T,skel:et,group:at,segs:[],joints:[],picks:[],caps:{},mat:rt,selMat:ut,jointMat:L};for(let X of et.bones){if(X.parent<0||!X.name.startsWith("SKEL_"))continue;let J=et.bones[X.parent].name,Y=X.name.includes("Finger");if(J.startsWith("SKEL_")&&J!=="SKEL_ROOT"){let Jt=new we(S,rt);Jt.userData={a:X.parent,b:X.index,r:Y?.004:.012},at.add(Jt),O.segs.push(Jt)}let At=new we(v,L),lt=Y?.006:.018;At.scale.setScalar(lt),At.userData={i:X.index,name:X.name,r:lt},at.add(At),O.joints.push(At);let ft=new we(v,b);ft.scale.setScalar(Y?.012:.04),ft.userData={pick:"bone",actor:T,bone:X.name,i:X.index},at.add(ft),O.picks.push(ft)}for(let X of["torso","chest","neck","head","upperL","upperR","foreL","foreR","thighL","thighR","shinL","shinR"]){let J=new we(new Qo(1,1,4,12),nt);J.userData.k=X,at.add(J),O.caps[X]=J}return r.add(at),O.onion=[9417727,16762255].map(X=>{let J=new Xe;J.setAttribute("position",new nn(new Float32Array(et.bones.length*6),3));let Y=new Mr(J,new ns({color:X,transparent:!0,opacity:.55}));return Y.visible=!1,r.add(Y),Y}),f[T]=O,O}function E(T,et,Z,at){Pi.set(et[0],et[1],et[2]),Ii.set(Z[0],Z[1],Z[2]);let rt=Pi.distanceTo(Ii);T.position.copy(Pi).add(Ii).multiplyScalar(.5),T.scale.set(at,at,Math.max(rt,1e-4)),T.quaternion.setFromUnitVectors(df,Ii.sub(Pi).normalize())}let C=new I(0,1,0);function R(T,et){Pi.set(et.a[0],et.a[1],et.a[2]),Ii.set(et.b[0],et.b[1],et.b[2]);let Z=Math.max(.001,Pi.distanceTo(Ii));T.position.copy(Pi).add(Ii).multiplyScalar(.5),T.scale.set(et.r,(Z+2*et.r)/3,et.r),T.quaternion.setFromUnitVectors(C,Ii.sub(Pi).normalize())}function P(T,et,Z){let at=f[T];if(!at)return;let rt=et.world.P;for(let nt of at.segs)E(nt,rt[nt.userData.a],rt[nt.userData.b],nt.userData.r);for(let nt of at.joints)nt.position.set(...rt[nt.userData.i]),nt.material=nt.userData.name===Z?at.selMat:at.jointMat,nt.scale.setScalar(nt.userData.name===Z?nt.userData.r*1.6:nt.userData.r);for(let nt of at.picks)nt.position.set(...rt[nt.userData.i]);let ut=Kr(at.skel,et);for(let[nt,L]of Object.entries(at.caps)){let b=ut[nt];L.visible=!!b&&y,b&&R(L,b)}}function N(T,et,Z){let at=f[T];if(!at)return;let rt=at.onion[et];if(!Z){rt.visible=!1;return}let ut=rt.geometry.attributes.position.array,nt=0;for(let L of at.skel.bones){if(L.parent<0||at.skel.bones[L.parent].name==="SKEL_ROOT"){ut.fill(0,nt,nt+6),nt+=6;continue}let b=Z.world.P[L.parent],O=Z.world.P[L.index];ut[nt++]=b[0],ut[nt++]=b[1],ut[nt++]=b[2],ut[nt++]=O[0],ut[nt++]=O[1],ut[nt++]=O[2]}rt.geometry.attributes.position.needsUpdate=!0,rt.visible=!0}let y=!0,w=new dn;w.visible=!1,r.add(w);let F=[0,1,2].map(T=>{let et=new dn,Z=new we(new Ri(1,.018,8,64),new Nn({color:uf[T],depthTest:!1,transparent:!0,opacity:.9})),at=new we(new Ri(1,.09,6,48),new Nn({visible:!1}));at.userData={pick:"ring",k:T};let rt=new we(new Ri(1,.045,6,48,Math.PI),new Nn({color:uf[T],depthTest:!1,transparent:!0,opacity:.35})),ut=new we(new Bs(.06,10,8),new Nn({color:16777215,depthTest:!1}));return ut.position.set(1,0,0),Z.renderOrder=rt.renderOrder=ut.renderOrder=10,et.add(Z,at,rt,ut),w.add(et),{g:et,ring:Z,pick:at,arc:rt,marker:ut,k:T}});function B(T,et,Z,at,rt){w.visible=!0,w.position.set(T[0],T[1],T[2]),w.scale.setScalar(rt);for(let ut of F){let nt=ph(et[ut.k]).normalize();if(ut.g.quaternion.setFromUnitVectors(df,nt),at){let[L,b]=at[ut.k],O=Math.max(1,b-L)*zt;ut.arc.geometry.dispose(),ut.arc.geometry=new Ri(1,.045,6,48,Math.min(O,Math.PI*2)),ut.arc.rotation.z=(L-Z[ut.k])*zt,ut.arc.visible=!0}else ut.arc.visible=!1}}function K(){w.visible=!1}let tt=new dn;r.add(tt);let W=new Map;function it(T,et){let Z=W.get(T);if(!Z){let at=et==="mover"?new Ri(.28,.012,6,40):new Bs(et==="pole"?.022:.035,14,10);Z=new we(at,new Nn({color:Cv[et],depthTest:!1,transparent:!0,opacity:.85})),Z.renderOrder=11;let[rt,ut]=T.split(".");Z.userData={pick:"handle",actor:rt,name:ut,kind:et},tt.add(Z),W.set(T,Z)}return Z}function q(T){let et=new Set;for(let Z of T){let at=`${Z.actor}.${Z.name}`;et.add(at);let rt=it(at,Z.kind);rt.position.set(Z.p[0],Z.p[1],Z.p[2]),rt.material.opacity=Z.active?1:.55,rt.scale.setScalar(Z.selected?1.5:1),rt.visible=!0}for(let[Z,at]of W)et.has(Z)||(at.visible=!1)}let dt=new dn;r.add(dt);function xt(T){for(;dt.children.length;)dt.children.pop().geometry.dispose();for(let et of T){let Z=new Xe().setFromPoints([ph(et.a),ph(et.b)]),at=new Sr(Z,new ns({color:et.color??16777215,depthTest:!1}));at.renderOrder=12,dt.add(at)}}let yt=new ra,te=new Ct;function ie(T,et){let Z=i.domElement.getBoundingClientRect();return te.set((T-Z.left)/Z.width*2-1,-((et-Z.top)/Z.height)*2+1),yt.setFromCamera(te,o),yt}function j(T,et){if(ie(T,et),w.visible){let ut=yt.intersectObjects(F.map(nt=>nt.pick),!1)[0];if(ut)return ut.object.userData}let Z=yt.intersectObjects([...W.values()].filter(ut=>ut.visible),!1)[0];if(Z)return Z.object.userData;let at=Object.values(f).flatMap(ut=>ut.group.visible?ut.picks:[]),rt=yt.intersectObjects(at,!1);return rt.length?(rt.sort((ut,nt)=>ut.distance-nt.distance),rt[0].object.userData):null}let st=T=>[T.x,-T.z,T.y];function wt(T,et,Z,at){ie(T,et);let rt=new I(at[0],at[2],-at[1]).normalize(),ut=new I(Z[0],Z[2],-Z[1]),nt=new Dn().setFromNormalAndCoplanarPoint(rt,ut),L=new I;return yt.ray.intersectPlane(nt,L)?st(L):null}function vt(){let T=l.yaw*zt,et=l.pitch*zt;return[-Math.sin(T)*Math.cos(et),Math.cos(T)*Math.cos(et),Math.sin(et)]}function Wt(T){let et=new I(T[0],T[2],-T[1]).project(o),Z=i.domElement.getBoundingClientRect();return{x:(et.x*.5+.5)*Z.width,y:(-et.y*.5+.5)*Z.height,behind:et.z>1}}function Ft(T){let et=d();return Math.hypot(T[0]-et[0],T[1]-et[1],T[2]-et[2])}let Kt=null,se=i.domElement;se.addEventListener("contextmenu",T=>T.preventDefault()),se.addEventListener("wheel",T=>{T.preventDefault(),l.dist=Math.min(u.max,Math.max(u.min,l.dist*Math.pow(1.0015,T.deltaY))),p()},{passive:!1});let Qt={renderer:i,camera:o,cam:l,limits:u,actors:f,setPreset:g,focusOn:_,applyCamera:p,resize:m,buildActor:M,updateActor:P,updateOnion:N,showGizmo:B,hideGizmo:K,setHandles:q,setLines:xt,pick:j,planePoint:wt,viewDir:vt,project:Wt,camDistanceTo:Ft,rings:F,setBodyVisible(T){y=T},setVisible(T,et){f[T]&&(f[T].group.visible=et)},removeActor(T){let et=f[T];et&&(r.remove(et.group),et.onion.forEach(Z=>r.remove(Z)),delete f[T])},beginOrbit(T,et,Z){Kt={x:T,y:et,mode:Z}},moveOrbit(T,et){if(!Kt)return;let Z=T-Kt.x,at=et-Kt.y;if(Kt.x=T,Kt.y=et,Kt.mode==="orbit")l.yaw=(l.yaw-Z*.3+360)%360,l.pitch=Math.max(-89,Math.min(89,l.pitch+at*.25));else{let rt=l.yaw*zt,ut=[Math.cos(rt),Math.sin(rt),0],nt=l.dist*.0016;l.target=[l.target[0]-ut[0]*Z*nt,l.target[1]-ut[1]*Z*nt,l.target[2]+at*nt]}p()},endOrbit(){Kt=null},render(){i.render(s,o)},boneAxes(T,et,Z){let at=T.idx(Z),rt=T.bones[at].parent,ut=Et(Rt(et.mover.q,rt>=0?et.D[rt]:[0,0,0,1])),nt=Ni(T,Z);return{axes:nt.axes.map(L=>kt(ut,L)),basis:nt}}};return m(),p(),Qt}var ha={app_title:"Animations-Studio",saved_at:"Gespeichert {0}",unsaved:"Ungespeicherte \xC4nderungen",saving:"Speichere \u2026",no_project:"Kein Projekt",projects:"Projekte",new_project:"Neu",open:"\xD6ffnen",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",single:"Einzel-Animation",pair:"Paar-Animation",partner_model:"Partner-Modell",name:"Name",duration_s:"Dauer (s)",create:"Anlegen",cancel:"Abbrechen",ok:"OK",close:"Schlie\xDFen",yes:"Ja",no:"Nein",confirm_close:"Studio schlie\xDFen? Ungespeicherte \xC4nderungen werden vorher gespeichert.",confirm_delete:"Projekt \u201E{0}\u201C wirklich l\xF6schen? Eine Sicherung bleibt auf dem Server.",name_hint:"Nur Kleinbuchstaben, Ziffern und _ (z. B. winken_01).",undo:"R\xFCckg\xE4ngig",redo:"Wiederholen",save:"Speichern",test:"Im Spiel testen",finish:"Fertigstellen",help:"Hilfe",tip_undo:"Letzten Schritt zur\xFCcknehmen (Strg+Z).",tip_redo:"Zur\xFCckgenommenen Schritt wiederholen (Strg+Y).",tip_save:"Projekt jetzt auf dem Server speichern (Strg+S). Automatisch alle 30 s.",tip_test:"Wandelt die Animation in eine echte .ycd um und spielt sie am echten Ped ab.",tip_finish:"Endg\xFCltige .ycd, Registry-Eintrag und Bericht f\xFCr Claude erzeugen.",tip_help:"Einstiegs-Tutorial nochmal zeigen.",view:"Ansicht",cam_front:"Vorn",cam_side:"Seite",cam_top:"Oben",cam_shoulder:"Schulter",cam_focus:"Auswahl",tip_cam_front:"Kamera von vorn auf die Figur (Taste 1).",tip_cam_side:"Kamera von der Seite (Taste 2).",tip_cam_top:"Kamera von oben (Taste 3).",tip_cam_shoulder:"Kamera \xFCber die Schulter (Taste 4).",tip_cam_focus:"Kamera auf das ausgew\xE4hlte K\xF6rperteil (F).",bones:"Knochen",actor:"Akteur",selected:"Ausgew\xE4hlt",none_selected:"Klicke ein Gelenk an oder w\xE4hle links einen Knochen.",limits:"Gelenkgrenzen",tip_limits:"Begrenzt Drehungen auf nat\xFCrliche Winkel (Taste L).",ik_controlled:"Dieser Arm/dieses Bein folgt dem IK-Griff. Ziehe den Griff oder entferne die IK.",remove_ik:"IK entfernen",tip_remove_ik:"Der Arm/das Bein wird wieder \xFCber die Drehringe gesteuert.",reset_bone:"Zur\xFCcksetzen",tip_reset_bone:"Setzt die Drehung dieses Knochens zur aktuellen Zeit auf 0.",fingers:"Finger",hand_l:"Hand links",hand_r:"Hand rechts",curl:"Beugung",spread:"Spreizung",single_joints:"Einzelne Glieder",tip_single_joints:"Zeigt jedes Fingerglied im Knochenbaum, dort einzeln drehen.",preset_relaxed:"Entspannt",preset_fist:"Faust",preset_open:"Offen",preset_grab:"Greifen",preset_point:"Zeigen",preset_claw:"Klaue",helpers:"Hilfen",mirror_all:"Ganze Pose spiegeln",mirror_sel:"Auswahl spiegeln",copy_pose:"Pose kopieren",paste_pose:"Pose einf\xFCgen",snap_ground:"Auf den Boden",lock_feet:"F\xFC\xDFe festkleben",stick_hand:"Hand festkleben an \u2026",unstick:"Kontakt l\xF6sen",tip_mirror_all:"Spiegelt die ganze Pose links \u2194 rechts zur aktuellen Zeit (M).",tip_mirror_sel:"\xDCbertr\xE4gt die Drehung des gew\xE4hlten Knochens auf die andere Seite.",tip_copy_pose:"Merkt sich die Pose zur aktuellen Zeit (Strg+C).",tip_paste_pose:"Setzt die gemerkte Pose zur aktuellen Zeit (Strg+V).",tip_snap_ground:"Setzt den gew\xE4hlten Fu\xDF (oder beide) genau auf den Boden.",tip_lock_feet:"F\xFC\xDFe bleiben im markierten Zeitbereich an ihrer Stelle (Bereich mit Alt+Ziehen in der Zeitleiste w\xE4hlen).",tip_stick_hand:"Die gew\xE4hlte Hand bleibt am K\xF6rperteil des Partners, auch wenn du weiter bearbeitest.",pose_library:"Posen-Bibliothek",builtin:"Grundposen",my_poses:"Eigene Posen",save_pose:"Pose speichern",apply:"Anwenden",tip_save_pose:"Speichert die Pose zur aktuellen Zeit unter einem Namen.",pose_stand:"Stand",pose_crouch:"Hocke",pose_fight:"Kampfstellung",pose_reach:"Greifen",checks:"Pr\xFCfung",check_running:"Pr\xFCfe \u2026",fix:"Beheben",jump:"Hinspringen",all_ok:"Alles gr\xFCn.",timeline:"Zeitleiste",play:"Abspielen",pause:"Pause",loop:"Loop",speed:"Tempo",onion:"Onion-Skin",events:"Events",tip_play:"Abspielen / anhalten (Leertaste).",tip_loop:"Loop: Ende = Anfang, die Naht wird automatisch geschlossen.",tip_onion:"Zeigt die vorige und n\xE4chste Pose als Schatten (O).",tip_speed:"Abspieltempo im Editor (0,1\u20132\xD7).",add_event:"Event",tip_add_event:"Setzt einen Event-Marker zur aktuellen Zeit (z. B. impact).",event_name:"Event-Name",event_duration:"Dauer (s)",ease_smooth:"Weich",ease_fastIn:"Schnell rein",ease_fastOut:"Schnell raus",ease_linear:"Gleichm\xE4\xDFig",ease_spring:"Federnd",tip_ease_smooth:"Langsam los, langsam an.",tip_ease_fastIn:"Startet schnell und bremst zum Keyframe ab.",tip_ease_fastOut:"Startet langsam und kommt schnell am Keyframe an.",tip_ease_linear:"Gleichm\xE4\xDFiges Tempo.",tip_ease_spring:"Schwingt etwas \xFCber und federt zur\xFCck.",key_delete:"Keyframe l\xF6schen",key_copy:"Keyframes kopieren",key_paste:"Keyframes einf\xFCgen",duration:"Dauer",range:"Bereich",no_range:"Kein Bereich gew\xE4hlt (Alt + Ziehen in der Zeitleiste).",test_title:"Im Spiel testen",test_notice:"Beim Testen wird die Stream-Resource neu gestartet. Alle Spieler laden die neue Animation kurz nach. Fortfahren?",test_converting:"Wandle um \u2026",test_restarting:"Verteile an die Spieler \u2026",test_loading:"Lade Animation \u2026",test_playing:"L\xE4uft ({0} s bis zur Wiedergabe)",test_failed:"Test fehlgeschlagen",stop:"Stopp",phase:"Phase",contacts:"Kontakte",overlay:"Overlay zeigen",calibrate:"Abgleich messen",tip_calibrate:"Vergleicht das Overlay-Skelett mit den echten Knochen des Peds (Ziel \u2264 1 cm).",calib_result:"Abweichung Overlay \u2194 echter Ped: max {0} cm, Mittel {1} cm ({2} Knochen)",calib_need_test:"Erst \u201EIm Spiel testen\u201C, dann messen (der Ped muss die Animation spielen).",finish_title:"Fertigstellen",target_resource:"Ziel-Resource",dict_name:"Dict-Name",convert:"Umwandeln",report:"Bericht f\xFCr Claude",copy:"Kopieren",copied:"Kopiert.",copy_failed:"Kopieren ging nicht, bitte Text markieren und Strg+C dr\xFCcken.",report_files:"Dateien auf dem Server: {0}",notes:"Notizen",notes_hint:"Notizen f\xFCr Claude (z. B. \u201EZombie soll am Ende knurren\u201C).",tutorial_skip:"\xDCberspringen",tutorial_next:"Weiter",tutorial_done:"Los geht\u2019s",tut1:"Kamera: linke Maustaste ziehen = drehen, Mausrad = zoomen, rechte Maustaste ziehen = verschieben. Feste Ansichten oben rechts.",tut2:"Klicke ein Gelenk an. Es erscheinen drei farbige Drehringe. Ring ziehen = K\xF6rperteil drehen. Grenzen verhindern unnat\xFCrliche Winkel.",tut3:"Die Kugeln an H\xE4nden, F\xFC\xDFen, Becken und vor dem Kopf sind Griffe. Ziehen bewegt die ganze Kette nat\xFCrlich (IK).",tut4:"Jede \xC4nderung setzt einen Keyframe zur aktuellen Zeit (Raute in der Zeitleiste). Zeit verschieben, n\xE4chste Pose einstellen, abspielen.",tut5:"Rechts pr\xFCft die Ampel live (Fu\xDFrutschen, Boden, Gelenke \u2026). \u201EIm Spiel testen\u201C zeigt die echte Animation am Ped.",warn_no_skeleton:"Kein Skelett vom Konverter: Platzhalter-Skelett, das Overlay ist ungenau. Starte animkit watch.",watch_down:"Der Konverter (animkit watch) l\xE4uft nicht. Testen und Fertigstellen gehen erst, wenn er l\xE4uft.",stream_restarted:"Stream-Resource neu gestartet.",err:"Fehler",loading:"Lade \u2026",new_name_prompt:"Neuer Name",pose_name_prompt:"Name der Pose",stick_target:"K\xF6rperteil des Partners",part_head:"Kopf",part_neck:"Hals",part_chest:"Brust",part_pelvis:"H\xFCfte",part_shoulderL:"Schulter links",part_shoulderR:"Schulter rechts",part_armL:"Oberarm links",part_armR:"Oberarm rechts",part_handL:"Hand links",part_handR:"Hand rechts",select_hand_first:"W\xE4hle zuerst eine Hand (oder einen Fu\xDF) aus.",pair_only:"Nur bei Paar-Animationen.",frame:"Bild {0}/{1}",seconds:"{0} s",light_ok:"Gr\xFCn",light_warn:"Gelb",light_error:"Rot",mover:"Standpunkt",root:"Becken",look:"Blick",group_pos:"Position",group_head:"Kopf",group_torso:"Rumpf",group_armL:"Arm L",group_armR:"Arm R",group_handL:"Hand L",group_handR:"Hand R",group_legL:"Bein L",group_legR:"Bein R",feet_locks:"F\xFC\xDFe fest",contacts_row:"Kontakte",partner_spawn_failed:"Partner-Ped konnte nicht erstellt werden: {0}",loop_on:"Loop an",loop_off:"Loop aus",rotation_deg:"Drehung (\xB0)",project_invalid:"Projekt besch\xE4digt",dict_invalid:"Ung\xFCltiger Dict-Name: nur a-z, 0-9 und _, nicht mit jjs_ beginnen.",target_invalid:"Ung\xFCltiger Resource-Name.",pose_invalid:"Ung\xFCltige Pose.",ik_weight:"IK-Gewicht",look_weight:"Blick-Gewicht",foot_l:"Fu\xDF links",foot_r:"Fu\xDF rechts",elbow_dir:"Ellbogen-Richtung",knee_dir:"Knie-Richtung",all_rows:"Alle Zeilen"},Lv={app_title:"Animation Studio",saved_at:"Saved {0}",unsaved:"Unsaved changes",saving:"Saving \u2026",no_project:"No project",projects:"Projects",new_project:"New",open:"Open",rename:"Rename",duplicate:"Duplicate",delete:"Delete",single:"Single animation",pair:"Pair animation",partner_model:"Partner model",name:"Name",duration_s:"Duration (s)",create:"Create",cancel:"Cancel",ok:"OK",close:"Close",yes:"Yes",no:"No",confirm_close:"Close the studio? Unsaved changes are saved first.",confirm_delete:"Really delete project \u201C{0}\u201D? A backup stays on the server.",name_hint:"Only lowercase letters, digits and _ (e.g. wave_01).",undo:"Undo",redo:"Redo",save:"Save",test:"Test in game",finish:"Finish",help:"Help",test_notice:"Testing restarts the stream resource. All players download the new animation shortly. Continue?"},pf=ha;function mf(n){pf=n==="en"?{...ha,...Lv}:ha}function G(n,...t){let e=pf[n]??ha[n]??n;return t.length?e.replace(/\{(\d+)\}/g,(i,s)=>String(t[+s]??"")):e}var rs=20,Vs=24,ua=118,sn={bg:"#14171c",row:"#1b1f26",rowAlt:"#181b21",text:"#c9d1dc",dim:"#7c8796",key:"#ffd34d",keySel:"#ffffff",head:"#4f9dff",headB:"#ff9a3c",range:"rgba(79,157,255,0.16)",lock:"#46e0c4",contact:"#b388ff",event:"#ff6b6b",play:"#ff4d4d"};function gf(n,{onEdit:t}){let e=n.getContext("2d"),i=[],s=null,r=!1,a=()=>Math.min(2,window.devicePixelRatio||1),o=()=>n.clientWidth,c=_=>ua+_/Math.max(1e-6,x.doc.duration)*(o()-ua-12),h=_=>Math.max(0,Math.min(x.doc.duration,(_-ua)/Math.max(1,o()-ua-12)*x.doc.duration));function l(){if(i=[],!x.doc)return;let _=Object.keys(x.doc.actors);for(let m of _){_.length>1&&i.push({kind:"header",actor:m,label:x.doc.actors[m].label||m});let f=x.selGroup&&x.actor===m?x.selGroup:null;for(let v of xu){let M=sr(x.doc,m,v);(r||M.length||v==="pos"||v===f)&&i.push({kind:"group",actor:m,group:v,label:G(vu[v]),times:M})}let S=x.doc.tracks[m]?.feet?.lock||{};Object.values(S).some(v=>v.length)&&i.push({kind:"locks",actor:m,label:G("feet_locks"),locks:S})}(x.doc.contacts||[]).length&&i.push({kind:"contacts",label:G("contacts_row")}),i.push({kind:"events",label:G("events")})}function u(){return Vs+i.length*rs+4}function d(){if(!x.doc)return;l();let _=o(),m=u();n.style.height=`${m}px`;let f=a();(n.width!==Math.round(_*f)||n.height!==Math.round(m*f))&&(n.width=Math.round(_*f),n.height=Math.round(m*f)),e.setTransform(f,0,0,f,0,0),e.fillStyle=sn.bg,e.fillRect(0,0,_,m),e.font="12px system-ui, sans-serif";let S=x.doc.duration,v=S<=2?.1:S<=6?.25:S<=15?.5:1;e.fillStyle=sn.dim,e.strokeStyle="#2a2f38";for(let E=0;E<=S+1e-6;E+=v){let C=c(E),R=Math.abs(E/(v*4)-Math.round(E/(v*4)))<1e-6;e.beginPath(),e.moveTo(C,R?4:12),e.lineTo(C,Vs),e.stroke(),R&&e.fillText(`${(+E.toFixed(2)).toString()}s`,C+2,12)}x.range&&(e.fillStyle=sn.range,e.fillRect(c(x.range[0]),0,c(x.range[1])-c(x.range[0]),m)),i.forEach((E,C)=>{let R=Vs+C*rs;if(e.fillStyle=E.kind==="header"?"#222833":C%2?sn.row:sn.rowAlt,e.fillRect(0,R,_,rs),e.fillStyle=E.kind==="header"?E.actor==="b"?sn.headB:sn.head:sn.text,e.fillText(E.label,8,R+14),E.kind==="group")for(let P of E.times){let N=x.selKeys.some(w=>w.actor===E.actor&&w.group===E.group&&Math.abs(w.t-P)<.001),y=s?.kind==="key"&&s.moved&&N?c(Ue(P+s.dt)):c(P);p(y,R+rs/2,N?sn.keySel:sn.key)}else if(E.kind==="locks")for(let[P,N]of Object.entries(E.locks))N.forEach(y=>{e.fillStyle=sn.lock,e.globalAlpha=.75;let w=R+(P==="L"?3:11);e.fillRect(c(y[0]),w,Math.max(2,c(y[1])-c(y[0])),6),e.globalAlpha=1});else E.kind==="contacts"?(x.doc.contacts||[]).forEach((P,N)=>{e.fillStyle=x.selContact===N?"#fff":sn.contact,e.globalAlpha=.8,e.fillRect(c(P.t[0]),R+5,Math.max(2,c(P.t[1])-c(P.t[0])),10),e.globalAlpha=1}):E.kind==="events"&&(x.doc.events||[]).forEach((P,N)=>{let y=c(P.t);e.fillStyle=x.selEvent===N?"#fff":sn.event,e.beginPath(),e.moveTo(y,R+3),e.lineTo(y+6,R+9),e.lineTo(y,R+15),e.closePath(),e.fill(),P.duration&&e.fillRect(y,R+15,c(P.t+P.duration)-y,2),e.fillText(P.name,y+8,R+14)})});let M=c(x.t);if(e.strokeStyle=sn.play,e.lineWidth=2,e.beginPath(),e.moveTo(M,0),e.lineTo(M,m),e.stroke(),e.lineWidth=1,x.test?.phase!=null){let E=c(x.test.phase*x.doc.duration);e.strokeStyle="#46e0c4",e.setLineDash([4,3]),e.beginPath(),e.moveTo(E,0),e.lineTo(E,m),e.stroke(),e.setLineDash([])}}function p(_,m,f){e.fillStyle=f,e.beginPath(),e.moveTo(_,m-6),e.lineTo(_+6,m),e.lineTo(_,m+6),e.lineTo(_-6,m),e.closePath(),e.fill(),e.strokeStyle="#000",e.stroke()}function g(_,m){if(m<Vs)return{kind:"ruler"};let f=Math.floor((m-Vs)/rs),S=i[f];if(!S)return null;if(S.kind==="group"){for(let v of S.times)if(Math.abs(c(v)-_)<=7)return{kind:"key",row:S,t:v};return{kind:"row",row:S}}if(S.kind==="events"){let v=(x.doc.events||[]).findIndex(M=>Math.abs(c(M.t)-_)<=7);return v>=0?{kind:"event",index:v}:{kind:"row",row:S}}if(S.kind==="contacts"){let v=(x.doc.contacts||[]).findIndex(M=>_>=c(M.t[0])-3&&_<=c(M.t[1])+3);return v>=0?{kind:"contact",index:v}:{kind:"row",row:S}}if(S.kind==="locks"){let v=m-(Vs+f*rs)<rs/2?"L":"R",M=(S.locks[v]||[]).findIndex(E=>_>=c(E[0])-3&&_<=c(E[1])+3);return M>=0?{kind:"lock",actor:S.actor,side:v,index:M}:{kind:"row",row:S}}return{kind:"row",row:S}}return n.addEventListener("mousedown",_=>{if(!x.doc)return;let m=n.getBoundingClientRect(),f=_.clientX-m.left,S=_.clientY-m.top,v=g(f,S);if(v){if(v.kind==="ruler"||v.kind==="row"&&!_.shiftKey){_.altKey?(s={kind:"range",t0:Ue(h(f))},x.range=[s.t0,s.t0],pn("range")):(s={kind:"scrub"},gn(Ue(h(f)))),v.kind==="row"&&v.row.kind==="group"&&He({selKeys:[],selEvent:null,selContact:null,selLock:null});return}if(v.kind==="key"){let M={actor:v.row.actor,group:v.row.group,t:v.t},E=x.selKeys.some(R=>R.actor===M.actor&&R.group===M.group&&Math.abs(R.t-M.t)<.001),C=_.shiftKey?E?x.selKeys.filter(R=>!(R.actor===M.actor&&R.group===M.group&&Math.abs(R.t-M.t)<.001)):[...x.selKeys,M]:E?x.selKeys:[M];He({selKeys:C,selEvent:null,selContact:null,selLock:null,actor:M.actor,selGroup:M.group}),s={kind:"key",x0:f,dt:0,moved:!1},_.shiftKey||gn(v.t);return}if(v.kind==="event"){He({selEvent:v.index,selKeys:[],selContact:null,selLock:null}),s={kind:"event",index:v.index,x0:f,t0:x.doc.events[v.index].t},gn(x.doc.events[v.index].t);return}if(v.kind==="contact"){He({selContact:v.index,selKeys:[],selEvent:null,selLock:null});return}v.kind==="lock"&&He({selLock:{actor:v.actor,side:v.side,index:v.index},selKeys:[],selEvent:null,selContact:null})}}),window.addEventListener("mousemove",_=>{if(!s||!x.doc)return;let m=n.getBoundingClientRect(),f=_.clientX-m.left;if(s.kind==="scrub")gn(Ue(h(f)));else if(s.kind==="range"){let S=Ue(h(f));x.range=[Math.min(s.t0,S),Math.max(s.t0,S)],pn("range"),d()}else if(s.kind==="key"){let S=h(f)-h(s.x0);Math.abs(f-s.x0)>3&&(s.moved=!0),s.dt=S,d()}else if(s.kind==="event"){let S=Ue(Math.max(0,Math.min(x.doc.duration,s.t0+h(f)-h(s.x0))));s.started||(Gn(),s.started=!0),jt(v=>{v.events[s.index].t=S},{commit:!1}),gn(S)}}),window.addEventListener("mouseup",()=>{if(!s)return;let _=s;if(s=null,_.kind==="key"&&_.moved&&x.selKeys.length){let m=x.selKeys.map(f=>({...f,to:Ue(Math.max(0,Math.min(x.doc.duration,f.t+_.dt)))}));jt(f=>{let S=_.dt>0?m.slice().sort((v,M)=>M.t-v.t):m.slice().sort((v,M)=>v.t-M.t);for(let v of S)Su(f,v.actor,v.group,v.t,v.to)}),He({selKeys:m.map(f=>({actor:f.actor,group:f.group,t:f.to}))}),t?.()}_.kind==="event"&&_.started&&(jn(),t?.()),_.kind==="range"&&x.range&&x.range[1]-x.range[0]<1/30&&(x.range=null,pn("range")),d()}),{draw:d,setShowAll(_){r=_,d()},get showAll(){return r},tToX:c,xToT:h}}var da={pose_stand:{root:{p:[0,0,0],rot:[0,0,0]},bones:{SKEL_L_UpperArm:[4,36,0],SKEL_R_UpperArm:[4,36,0],SKEL_L_Forearm:[12,0,0],SKEL_R_Forearm:[12,0,0]},ik:{},fingers:{L:{preset:"relaxed"},R:{preset:"relaxed"}}},pose_crouch:{root:{p:[0,-.1,-.42],rot:[0,0,0]},bones:{SKEL_Spine0:[-14,0,0],SKEL_Spine2:[-10,0,0],SKEL_Head:[16,0,0],SKEL_L_UpperArm:[28,0,0],SKEL_R_UpperArm:[28,0,0],SKEL_L_Forearm:[35,0,0],SKEL_R_Forearm:[35,0,0]},ik:{footL:{target:[-.13,.06,-.908],space:"body",pole:[-.2,1,.2]},footR:{target:[.13,.06,-.908],space:"body",pole:[.2,1,.2]}},fingers:{L:{preset:"relaxed"},R:{preset:"relaxed"}}},pose_fight:{root:{p:[0,0,-.08],rot:[0,0,-18]},bones:{SKEL_Spine2:[-6,0,10],SKEL_Head:[6,0,14]},ik:{footL:{target:[-.14,.2,-.908],space:"body",yaw:10},footR:{target:[.17,-.16,-.908],space:"body",yaw:-25},handL:{target:[-.1,.33,.42],space:"body",pole:[-.7,-.3,-.7]},handR:{target:[.1,.24,.38],space:"body",pole:[.7,-.3,-.7]}},fingers:{L:{preset:"fist"},R:{preset:"fist"}}},pose_reach:{root:{p:[0,.03,-.03],rot:[0,0,0]},bones:{SKEL_Spine1:[-8,0,0],SKEL_Spine2:[-6,0,0],SKEL_Head:[-4,0,0]},ik:{handL:{target:[-.17,.55,.22],space:"body",pole:[-.8,-.2,-.6]},handR:{target:[.17,.55,.22],space:"body",pole:[.8,-.2,-.6]}},fingers:{L:{preset:"grab"},R:{preset:"grab"}}}};var fa=new Map,Ar=typeof window.GetParentResourceName=="function",Pv=Ar?window.GetParentResourceName():"jj_animstudio";function Sn(n,t){fa.has(n)||fa.set(n,[]),fa.get(n).push(t)}function pa(n){for(let t of fa.get(n?.type)||[])try{t(n)}catch(e){console.error("handler",n.type,e)}}window.addEventListener("message",n=>{n.data&&typeof n.data=="object"&&pa(n.data)});async function qe(n,t={}){if(!Ar)return Iv(n,t);try{return await(await fetch(`https://${Pv}/${n}`,{method:"POST",headers:{"Content-Type":"application/json; charset=UTF-8"},body:JSON.stringify(t)})).json()}catch(e){return{ok:!1,error:String(e)}}}var Ge={projects:{},poses:{},calls:[],preview:0};window.JJS_MOCK_STATE=Ge;var On=(n,t=30)=>setTimeout(()=>pa(n),t);function mh(){return Object.entries(Ge.projects).map(([n,t])=>({name:n,title:t.title,type:t.type,updated:t.updated,size:t.text.length})).sort((n,t)=>t.updated-n.updated)}function Iv(n,t){if(Ge.calls.push({name:n,data:t}),n==="server"){let[e,i,s,r]=t.args||[],a=(o,c,h={})=>On({type:"reply",data:{op:o,ok:c,...h}});switch(t.op){case"list":On({type:"projects",list:mh()});break;case"load":Ge.projects[e]?On({type:"project",name:e,text:Ge.projects[e].text}):a("load",!1,{msg:"missing"});break;case"save":{let o=JSON.parse(i);Ge.projects[e]={text:i,title:o.title||e,type:o.type,updated:Date.now()/1e3},a("save",!0,{name:e,msg:"Gespeichert."});break}case"rename":case"duplicate":{let o=Ge.projects[e];if(!o||Ge.projects[i]){a(t.op,!1,{msg:"exists/missing"});break}Ge.projects[i]={...o,text:o.text.replace(`"name":"${e}"`,`"name":"${i}"`)},t.op==="rename"&&delete Ge.projects[e],a(t.op,!0,{name:i,from:e}),On({type:"projects",list:mh()});break}case"delete":delete Ge.projects[e],a("delete",!0,{name:e}),On({type:"projects",list:mh()});break;case"preview":case"finalize":{let o=JSON.parse(i);Ge.projects[e]={text:i,title:o.title||e,type:o.type,updated:Date.now()/1e3};let c=++Ge.preview,h=t.op==="preview"?`jjs_${e}_v${c}`:s;a(t.op,!0,{job:`${e}_v${c}`,dict:h,name:e});let l=Object.keys(o.actors),u=Object.fromEntries(l.map(d=>[d,o.type==="pair"?`${o.name}_${d}`:o.name]));On({type:"job",kind:"result",result:{ok:!0,job:`${e}_v${c}`,kind:t.op==="preview"?"preview":"final",dict:h,clips:u,duration:o.duration,loop:!!o.loop,type:o.type,origins:o.type==="pair"?Object.fromEntries(l.map(d=>[d,{x:o.tracks[d]?.mover?.[0]?.p?.[0]||0,y:o.tracks[d]?.mover?.[0]?.p?.[1]||0,z:0,yaw:o.tracks[d]?.mover?.[0]?.yaw||0}])):{},restarted:!0,waitMs:400,findings:[],report:t.op==="finalize"?{md:`data/outbox/${e}.report.md`,json:`data/outbox/${e}.report.json`,ycd:`data/outbox/final/${h}.ycd`,text:`# Animation \u201E${o.title||e}\u201C (${e})

(Bericht aus dem Browser-Test, kein echter Build)
`}:void 0}},200);break}case"poseSave":Ge.poses[e]=i,a("poseSave",!0,{name:e}),On({type:"poses",poses:{...Ge.poses}});break;case"poseDelete":delete Ge.poses[e],a("poseDelete",!0,{name:e}),On({type:"poses",poses:{...Ge.poses}});break;default:break}return Promise.resolve({ok:!0})}return n==="test"&&t.action==="start"&&On({type:"test:started",ok:!0,dict:t.result?.dict},50),n==="test"&&t.action==="stop"&&On({type:"test:stopped"},10),n==="bones"?Promise.resolve({ok:!0,bones:window.JJS_MOCK?.bones?.(t)||[]}):(n==="close"&&On({type:"close"},10),Promise.resolve({ok:!0}))}var St=n=>document.querySelector(n),H=(n,t={},...e)=>{let i=document.createElement(n);for(let[s,r]of Object.entries(t||{}))r==null||r===!1||(s==="class"?i.className=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):s==="html"?i.innerHTML=r:i.setAttribute(s,r===!0?"":r));for(let s of e.flat())s!=null&&s!==!1&&i.append(s);return i},je=(n,t=2)=>(+n).toFixed(t).replace(".",","),li=()=>Object.keys(x.doc?.actors||{}),Dv=n=>Ce(n).groundZ+.085;function fe(n,t="info",e=3800){if(!n)return;let i=H("div",{class:`toast ${t}`},n);St("#toasts").append(i),setTimeout(()=>i.remove(),e)}function kv(){let n=St("#tooltip");document.addEventListener("mouseover",t=>{let e=t.target.closest?.("[data-tip]");if(!e){n.classList.add("hidden");return}n.textContent=G(e.dataset.tip),n.classList.remove("hidden");let i=e.getBoundingClientRect();n.style.left=`${Math.min(window.innerWidth-n.offsetWidth-8,Math.max(8,i.left))}px`,n.style.top=`${i.bottom+6+n.offsetHeight>window.innerHeight?i.top-n.offsetHeight-6:i.bottom+6}px`})}function Uv(){for(let n of document.querySelectorAll("[data-t]"))n.textContent=G(n.dataset.t)}var _h=null,bh=!1;function Zs(n,t,e=[],{onClose:i}={}){let s=St("#dialog");s.innerHTML="",s.append(H("h2",{},n),t,H("div",{class:"row end"},e)),St("#modal").classList.remove("hidden"),_h=i||null;let r=s.querySelector("input,select,textarea");r&&setTimeout(()=>r.focus(),30)}function En(n=!0){St("#modal").classList.add("hidden"),bh=!1;let t=_h;_h=null,n&&t?.()}var xh=()=>!St("#modal").classList.contains("hidden");function wh(n){return new Promise(t=>Zs(G("app_title"),H("p",{},n),[H("button",{class:"btn",onclick:()=>{En(!1),t(!1)}},G("no")),H("button",{class:"btn accent",onclick:()=>{En(!1),t(!0)}},G("yes"))],{onClose:()=>t(!1)}))}function vh(n,t="",e=""){return new Promise(i=>{let s=H("input",{type:"text",value:t,style:"width:100%"}),r=()=>{let a=s.value.trim();En(!1),i(a||null)};s.addEventListener("keydown",a=>{a.key==="Enter"&&r()}),Zs(n,H("div",{},s,e?H("div",{class:"hint"},e):null),[H("button",{class:"btn",onclick:()=>{En(!1),i(null)}},G("cancel")),H("button",{class:"btn accent",onclick:r},G("ok"))],{onClose:()=>i(null)})})}var Pt,Eh;function Nv(n){let t={},e=0;for(let i of["male","female","zombie"]){let s=null,r=n?.skeletons?.[i];if(r)try{s=typeof r=="string"?JSON.parse(r):r}catch{s=null}!s&&window.JJS_MOCK?.skeletons?.[i]&&(s=window.JJS_MOCK.skeletons[i]),s||(s=zh(i),e++),t[i]=new Ur(s)}return x.skeletonSource=e?"placeholder":"server",t}function Fv(n){if(mf(n.locale),Uv(),x.config=n.config||{},x.undoMax=Math.max(100,x.config.undo||150),x.frame=n.frame,x.partners=x.config.partners||[],x.skeletons=Nv(n.server),x.projects=n.server?.projects||[],x.poses=n.server?.poses||{},x.watch=n.server?.watch||{alive:!1},St("#app").classList.remove("hidden"),!Pt){Pt=ff(St("#view"),{inGame:Ar,onCamera:Ov});let e=x.config.camera||{};Pt.limits.min=e.MinDistance||.4,Pt.limits.max=e.MaxDistance||12,Pt.cam.fov=e.Fov||45,Eh=gf(St("#timeline"),{onEdit:()=>{}}),Kv(),cy()}Pt.resize(),Pt.setPreset("front");let t=[];x.skeletonSource==="placeholder"&&t.push(G("warn_no_skeleton")),x.watch.alive||t.push(G("watch_down")),St("#warn").textContent=t.join(" "),St("#warn").classList.toggle("hidden",!t.length),setTimeout(()=>St("#warn").classList.add("hidden"),12e3),$s(),Df()}Sn("open",n=>{Fv(n.data||{}),zv()});Sn("close",()=>{St("#app").classList.add("hidden"),x.doc=null,x.test=null,Xs=!1});var ma=0,Gs=null;function Ov(n){Gs=n;let t=1e3/Math.min(30,x.config.camera?.UpdatesPerSecond||30),e=performance.now();e-ma>=t&&(ma=e,qe("camera",Gs),Gs=null)}var _f=0,ga="";function Bv(n){if(x.test)return;let t=performance.now();if(t-_f<100)return;let e={};for(let s of li()){let r=n[s].mover;e[s]={p:r.p.map(a=>+a.toFixed(4)),yaw:+(di(r.q)/zt).toFixed(2)}}let i=JSON.stringify(e);i!==ga&&(_f=t,ga=i,qe("place",{actors:e}))}var yh=performance.now(),Ws=!0,Xs=!1;pi("*",()=>{Ws=!0});function zv(){Xs||(Xs=!0,yh=performance.now(),requestAnimationFrame(Mf))}function Mf(n){if(!Xs)return;requestAnimationFrame(Mf);let t=Math.min(.1,(n-yh)/1e3);if(yh=n,Gs&&n-ma>34&&(ma=n,qe("camera",Gs),Gs=null),!x.doc||!Pt){Pt?.render();return}if(x.playing){let i=x.t+t*x.speed;i>=x.doc.duration&&(x.doc.loop?i%=x.doc.duration:(i=x.doc.duration,x.playing=!1,Ks())),x.t=i,Ws=!0,Th()}x.test?.follow&&x.test.phase!=null&&(x.t=x.test.phase*x.doc.duration);let e;try{e=mn(x.t)}catch(i){console.error(i),Pt.render();return}for(let i of li())Pt.updateActor(i,e[i],x.actor===i?x.selBone:null),Pt.setVisible(i,x.overlay);Hv(),Vv(e),Gv(e),Wv(e),Bv(e),Pt.render(),Ws&&(Eh.draw(),Ws=!1)}function Hv(){for(let n of li()){if(!x.onion||x.playing){Pt.updateOnion(n,0,null),Pt.updateOnion(n,1,null);continue}let t=sr(x.doc,n,null),e=t.filter(s=>s<x.t-.001).pop(),i=t.find(s=>s>x.t+.001);Pt.updateOnion(n,0,e!=null?mn(e)[n]:null),Pt.updateOnion(n,1,i!=null?mn(i)[n]:null)}}function bf(n){let t=/^SKEL_([LR])_(UpperArm|Forearm|Thigh|Calf)$/.exec(n);return t?(t[2]==="UpperArm"||t[2]==="Forearm"?"hand":"foot")+t[1]:null}function _a(n,t,e=x.t){let i=Ne(x.doc,{actor:n,kind:"ik",id:t},e);return i?i.weight??1:0}function wf(n,t){return t==="SKEL_ROOT"?Ne(x.doc,{actor:n,kind:"root"},x.t)?.rot||[0,0,0]:Ne(x.doc,{actor:n,kind:"bone",id:t},x.t)?.rot||[0,0,0]}function Sh(n,t,e,i){if(e==="SKEL_ROOT"){let s=Ne(n,{actor:t,kind:"root"},x.t);ye(n,{actor:t,kind:"root"},x.t,{p:s?.p||[0,0,0],rot:i})}else ye(n,{actor:t,kind:"bone",id:e},x.t,{rot:i})}function Tr(n,t){He({actor:n,selBone:t,selHandle:null,selGroup:t?Ba(t):null}),qs(),wn()}var Mn=null;function Vv(n){let t=x.selBone,e=x.actor;if(!t||!n[e]||x.test||x.playing){Pt.hideGizmo(),Mn=null;return}let i=Ce(e);if(!i.has(t)){Pt.hideGizmo();return}let s=bf(t);if(s&&_a(e,s)>0){Pt.hideGizmo(),Mn=null;return}let r=n[e],a=r.world.P[i.idx(t)],{axes:o,basis:c}=Pt.boneAxes(i,r,t),h=wf(e,t),l=Math.max(.05,Pt.camDistanceTo(a)*.11);Pt.showGizmo(a,o,h,x.limitsOn?c.limits:null,l),Mn={actor:e,bone:t,p:a,axes:o,rot:h,basis:c}}function Ah(n){let t=[];if(x.test)return t;for(let e of li()){let i=Ce(e),s=n[e],r=l=>s.world.P[i.idx(l)],a=l=>x.selHandle&&x.selHandle.actor===e&&x.selHandle.name===l;for(let l of["handL","handR","footL","footR"]){let u=_a(e,l)>0;if(t.push({actor:e,name:l,kind:l.startsWith("hand")?"hand":"foot",p:r(cn[l]),active:u,selected:a(l)}),u){let d=l.slice(-1),p=l.startsWith("hand")?Nt.side[d].lower:Nt.side[d].calf;t.push({actor:e,name:"pole"+l,kind:"pole",p:r(p),active:!0,selected:a("pole"+l)})}}t.push({actor:e,name:"root",kind:"root",p:r("SKEL_ROOT"),active:!!Rn(x.doc,{actor:e,kind:"root"})?.length,selected:a("root")});let o=r("SKEL_Head"),c=s.pose?.look,h=kt(Et(Rt(s.mover.q,s.D[i.idx("SKEL_Head")])),[0,.8,0]);t.push({actor:e,name:"look",kind:"look",p:c?c.target:Ut(o,h),active:!!c,selected:a("look")}),t.push({actor:e,name:"mover",kind:"mover",p:[s.mover.p[0],s.mover.p[1],i.groundZ+s.mover.p[2]+.005],active:!0,selected:a("mover")})}return t}function Gv(n){Pt.setHandles(x.overlay?Ah(n):[])}var gh=[],xf="";function Wv(n){let t=[],e=[];if(x.test?.points?.length)for(let s of x.test.points)t.push({p:[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2,(s.a[2]+s.b[2])/2],text:`${je(s.cm,1)} cm`,red:s.red});else if(!x.test){for(let r of x.doc.contacts||[]){if(x.t<r.t[0]-.001||x.t>r.t[1]+.001)continue;let a=zn(r.from),o=zn(r.to),c=n[a.actor],h=n[o.actor];if(!c||!h)continue;let l=Ce(a.actor),u=Ce(o.actor);if(!l.has(a.bone)||!u.has(o.bone))continue;let d=c.world.P[l.idx(a.bone)],p=u.idx(o.bone),g=Ut(h.world.P[p],kt(Et(Rt(h.mover.q,h.D[p])),r.offset||[0,0,0])),_=Math.hypot(d[0]-g[0],d[1]-g[1],d[2]-g[2])*100,m=_>(x.config.contactRedCm||3);t.push({p:[(d[0]+g[0])/2,(d[1]+g[1])/2,(d[2]+g[2])/2],text:`${je(_,1)} cm`,red:m}),e.push({a:d,b:g,color:m?16730955:11766015})}let s=JSON.stringify(e.map(r=>[r.a,r.b,r.color].flat().map(a=>+(+a).toFixed(3))));s!==xf&&(xf=s,Pt.setLines(e))}let i=St("#labels");for(;gh.length<t.length;){let s=H("div",{class:"mlabel"});i.append(s),gh.push(s)}gh.forEach((s,r)=>{let a=t[r];if(!a){s.style.display="none";return}let o=Pt.project(a.p);s.style.display=o.behind?"none":"block",s.style.left=`${o.x}px`,s.style.top=`${o.y}px`,s.textContent=a.text,s.className=`mlabel ${a.red?"red":""}`})}function Kv(){let n=Pt.renderer.domElement,t=null;n.addEventListener("mousedown",e=>{if(!x.doc)return;let i=e.button===0?Pt.pick(e.clientX,e.clientY):null;if(e.button!==0){Pt.beginOrbit(e.clientX,e.clientY,e.button===2&&!e.shiftKey?"pan":"orbit"),t={kind:"cam"};return}if(i?.pick==="ring"&&Mn){Gn();let s=Pt.project(Mn.p),r=n.getBoundingClientRect();t={kind:"ring",k:i.k,cx:s.x+r.left,cy:s.y+r.top,a0:Math.atan2(-(e.clientY-(s.y+r.top)),e.clientX-(s.x+r.left)),rot0:Mn.rot.slice(),g:{...Mn}};let a=Pt.viewDir();t.sign=Mn.axes[i.k][0]*-a[0]+Mn.axes[i.k][1]*-a[1]+Mn.axes[i.k][2]*-a[2]>=0?1:-1;return}if(i?.pick==="handle"){Gn();let s=mn(x.t),r=s[i.actor],a=Ah(s).find(c=>c.actor===i.actor&&c.name===i.name);He({selHandle:{actor:i.actor,name:i.name},actor:i.actor,selBone:null,selGroup:i.name.startsWith("hand")||i.name.startsWith("polehand")?"arm"+i.name.slice(-1):i.name.includes("foot")?"leg"+i.name.slice(-1):i.name==="look"?"head":"pos"}),wn(),qs();let o=Pt.viewDir();t={kind:"handle",actor:i.actor,name:i.name,start:a.p.slice(),normal:i.name==="mover"||e.shiftKey?[0,0,1]:[-o[0],-o[1],-o[2]],vertical:e.altKey,rotate:i.name==="mover"&&e.shiftKey,mover0:{p:r.mover.p.slice(),yaw:di(r.mover.q)/zt},root0:(Ne(x.doc,{actor:i.actor,kind:"root"},x.t)?.p||[0,0,0]).slice(),sol:r},t.vertical&&(t.normal=[o[0],o[1],0]);return}if(i?.pick==="bone"){t={kind:"click",hit:i,x:e.clientX,y:e.clientY};return}Pt.beginOrbit(e.clientX,e.clientY,"orbit"),t={kind:"cam",click:!0,x:e.clientX,y:e.clientY}}),window.addEventListener("mousemove",e=>{if(t){if(t.kind==="cam"){Pt.moveOrbit(e.clientX,e.clientY);return}if(t.kind==="click"&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>4){Pt.beginOrbit(t.x,t.y,"orbit"),t={kind:"cam"};return}if(t.kind==="ring"){let i=Math.atan2(-(e.clientY-t.cy),e.clientX-t.cx),s=(i-t.a0)/zt;s=(s+540)%360-180,t.a0=i,t.acc=(t.acc||0)+s*t.sign;let r=t.rot0.slice();r[t.k]=t.rot0[t.k]+t.acc;let a=x.limitsOn?Qs(Ce(t.g.actor),t.g.bone,r).rot:r;jt(o=>Sh(o,t.g.actor,t.g.bone,a),{commit:!1}),wn();return}t.kind==="handle"&&$v(t,e)}}),window.addEventListener("mouseup",()=>{if(!t)return;let e=t;if(t=null,e.kind==="cam"){Pt.endOrbit(),e.click&&Tr(x.actor,null);return}if(e.kind==="click"){Tr(e.hit.actor,e.hit.bone);return}jn(),wn(),qs()})}function Mh(n,t){return kt(he(n.mover.q),Ot(t,n.mover.p))}function $v(n,t){let e=Pt.planePoint(t.clientX,t.clientY,n.start,n.normal);if(!e)return;let i=e;n.vertical&&(i=[n.start[0],n.start[1],e[2]]);let{actor:s,name:r}=n;jt(a=>{let o=n.sol;if(r==="mover"){let u={actor:s,kind:"mover"};if(n.rotate){let d=Math.atan2(n.start[1]-n.mover0.p[1],n.start[0]-n.mover0.p[0]),p=Math.atan2(e[1]-n.mover0.p[1],e[0]-n.mover0.p[0]);ye(a,u,x.t,{p:n.mover0.p,yaw:n.mover0.yaw+(p-d)/zt})}else ye(a,u,x.t,{p:[n.mover0.p[0]+e[0]-n.start[0],n.mover0.p[1]+e[1]-n.start[1],n.mover0.p[2]],yaw:n.mover0.yaw});return}if(r==="root"){let u=kt(he(o.mover.q),Ot(i,n.start)),d=Ne(a,{actor:s,kind:"root"},x.t);ye(a,{actor:s,kind:"root"},x.t,{p:[n.root0[0]+u[0],n.root0[1]+u[1],n.root0[2]+u[2]],rot:d?.rot||[0,0,0]});return}if(r==="look"){ye(a,{actor:s,kind:"look"},x.t,{target:Mh(o,i),space:"body",weight:Ne(a,{actor:s,kind:"look"},x.t)?.weight??1});return}if(r.startsWith("pole")){let u=r.slice(4),d=u.slice(-1),p=Ce(s),g=o.world.P[p.idx(u.startsWith("hand")?Nt.side[d].upper:Nt.side[d].thigh)],_=o.world.P[p.idx(cn[u])],m=[(g[0]+_[0])/2,(g[1]+_[1])/2,(g[2]+_[2])/2],f=kt(he(o.mover.q),Ot(i,m)),S=Ne(a,{actor:s,kind:"ik",id:u},x.t);ye(a,{actor:s,kind:"ik",id:u},x.t,{target:S?.target,space:"body",weight:S?.weight??1,pole:f});return}let c={actor:s,kind:"ik",id:r},h=Ne(a,c,x.t),l={target:Mh(o,i),space:"body",weight:1};if(!h||(h.weight??1)<=0){let u=Ce(s),d=r.slice(-1),p=o.world.P[u.idx(r.startsWith("hand")?Nt.side[d].upper:Nt.side[d].thigh)],g=o.world.P[u.idx(r.startsWith("hand")?Nt.side[d].lower:Nt.side[d].calf)],_=o.world.P[u.idx(cn[r])];l.pole=kt(he(o.mover.q),Ot(g,[(p[0]+_[0])/2,(p[1]+_[1])/2,(p[2]+_[2])/2])),r.startsWith("foot")&&(l.yaw=di(Et(o.D[u.idx(cn[r])]))/zt)}else h.pole&&(l.pole=h.pole);r.startsWith("foot")&&h?.yaw!=null&&(l.yaw=h.yaw),ye(a,c,x.t,l)},{commit:!1})}var Xv=[["group_pos",["SKEL_ROOT"]],["group_torso",["SKEL_Pelvis","SKEL_Spine_Root","SKEL_Spine0","SKEL_Spine1","SKEL_Spine2","SKEL_Spine3"]],["group_head",["SKEL_Neck_1","SKEL_Neck_2","SKEL_Head"]],["group_armL",["SKEL_L_Clavicle","SKEL_L_UpperArm","SKEL_L_Forearm","SKEL_L_Hand"]],["group_armR",["SKEL_R_Clavicle","SKEL_R_UpperArm","SKEL_R_Forearm","SKEL_R_Hand"]],["group_legL",["SKEL_L_Thigh","SKEL_L_Calf","SKEL_L_Foot","SKEL_L_Toe0"]],["group_legR",["SKEL_R_Thigh","SKEL_R_Calf","SKEL_R_Foot","SKEL_R_Toe0"]]],Ef=n=>n.replace(/^SKEL_/,"").replace(/_/g," ");function qs(){if(!x.doc)return;let n=St("#actor-tabs");n.innerHTML="";for(let o of li())n.append(H("button",{class:`btn ${x.actor===o?"on":""}`,onclick:()=>{Tr(o,null)}},x.doc.actors[o].label||o));St("#partner-row").classList.toggle("hidden",x.doc.type!=="pair");let e=St("#partner-model");if(x.doc.type==="pair"&&e.options.length!==x.partners.length){e.innerHTML="";for(let o of x.partners)e.append(H("option",{value:o.model},o.label||o.model))}x.doc.type==="pair"&&(e.value=x.doc.actors.b.model);let i=St("#bone-tree");i.innerHTML="";let s=Ce(x.actor),r=St("#chk-fingers").checked,a=Xv.map(([o,c])=>[o,c]);r&&(a.push(["hand_l",Nt.side.L.fingers.flat()]),a.push(["hand_r",Nt.side.R.fingers.flat()]));for(let[o,c]of a){let h=H("div",{class:"tree-group"},H("div",{class:"tg-title"},G(o)));for(let l of c){if(!s.has(l))continue;let u=l==="SKEL_ROOT"?!!Rn(x.doc,{actor:x.actor,kind:"root"})?.length:!!Rn(x.doc,{actor:x.actor,kind:"bone",id:l})?.length;h.append(H("button",{class:`bone ${x.selBone===l?"sel":""} ${u?"keyed":""}`,onclick:()=>Tr(x.actor,l)},l==="SKEL_ROOT"?G("root"):Ef(l)))}i.append(h)}}function wn(){let n=St("#inspector");if(n.innerHTML="",!x.doc)return;if(x.selHandle){let{actor:o,name:c}=x.selHandle;if(n.append(H("div",{},H("b",{},`${x.doc.actors[o].label||o}: ${qv(c)}`))),/^(hand|foot)[LR]$/.test(c)&&_a(o,c)>0){let h=Ne(x.doc,{actor:o,kind:"ik",id:c},x.t);n.append(H("div",{class:"info"},`IK ${h.target.map(l=>je(l,3)).join(" / ")} m`)),n.append(Ys("IK-Gewicht",h.weight??1,0,1,.05,l=>jt(u=>ye(u,{actor:o,kind:"ik",id:c},x.t,{target:h.target,space:"body",weight:l}),{commit:!1}),()=>jn(),()=>Gn())),n.append(H("button",{class:"btn block","data-tip":"tip_remove_ik",onclick:()=>{jt(l=>Ga(l,{actor:o,kind:"ik",id:c})),wn()}},G("remove_ik")))}if(c==="look"&&Rn(x.doc,{actor:o,kind:"look"})?.length){let h=Ne(x.doc,{actor:o,kind:"look"},x.t);n.append(Ys("Blick-Gewicht",h.weight??1,0,1,.05,l=>jt(u=>ye(u,{actor:o,kind:"look"},x.t,{target:h.target,space:h.space||"body",weight:l}),{commit:!1}),()=>jn(),()=>Gn()))}return}if(!x.selBone){n.append(H("div",{class:"info"},G("none_selected")));return}let t=x.actor,e=x.selBone,i=Ce(t);n.append(H("div",{},H("b",{},e==="SKEL_ROOT"?G("root"):Ef(e))));let s=bf(e);if(s&&_a(t,s)>0){n.append(H("div",{class:"info"},G("ik_controlled"))),n.append(H("button",{class:"btn block","data-tip":"tip_remove_ik",onclick:()=>{jt(o=>Ga(o,{actor:t,kind:"ik",id:s})),wn()}},G("remove_ik")));return}let r=Ni(i,e),a=wf(t,e);r.labels.forEach((o,c)=>{let h=x.limitsOn&&r.limits?r.limits[c]:[-180,180],l=p=>{let g=a.slice();g[c]=+p;let _=x.limitsOn?Qs(i,e,g).rot:g;jt(m=>Sh(m,t,e,_),{commit:!1})},u=H("input",{type:"range",min:h[0],max:h[1],step:.5,value:a[c]}),d=H("input",{type:"number",min:h[0],max:h[1],step:1,value:(+a[c]).toFixed(1)});u.addEventListener("pointerdown",()=>Gn()),u.addEventListener("input",()=>{d.value=u.value,l(u.value)}),u.addEventListener("change",()=>jn()),d.addEventListener("change",()=>{l(d.value),wn()}),n.append(H("div",{class:`axis ax${c}`},H("span",{class:"nm"},o||Fr.centre[c]),u,d))}),n.append(H("div",{class:"row"},H("label",{class:"check","data-tip":"tip_limits"},H("input",{type:"checkbox",checked:x.limitsOn,onchange:o=>{x.limitsOn=o.target.checked,wn()}}),G("limits")),H("button",{class:"btn small","data-tip":"tip_reset_bone",onclick:()=>jt(o=>Sh(o,t,e,[0,0,0]))},G("reset_bone"))))}function qv(n){return{handL:G("hand_l"),handR:G("hand_r"),footL:"Fu\xDF links",footR:"Fu\xDF rechts",root:G("root"),look:G("look"),mover:G("mover")}[n]||(n.startsWith("pole")?n.includes("hand")?"Ellbogen-Richtung":"Knie-Richtung":n)}function Ys(n,t,e,i,s,r,a,o){let c=H("input",{type:"range",min:e,max:i,step:s,value:t}),h=H("output",{},je(t));return c.addEventListener("pointerdown",()=>o?.()),c.addEventListener("input",()=>{h.textContent=je(c.value),r(+c.value)}),c.addEventListener("change",()=>a?.()),H("label",{class:"slider row"},H("span",{},n),c,h)}function va(){let n=St("#fingers");if(n.innerHTML="",!!x.doc)for(let t of["L","R"]){let e={actor:x.actor,kind:"fingers",id:t},i=Ne(x.doc,e,x.t)||{preset:"relaxed",curl:1},s=i.preset||"relaxed";n.append(H("div",{class:"tg-title"},G(t==="L"?"hand_l":"hand_r"))),n.append(H("div",{class:"presets"},Object.keys(nr).map(r=>H("button",{class:`btn small ${s===r?"on":""}`,onclick:()=>{jt(a=>ye(a,e,x.t,{preset:r,curl:i.curl??1,spread:void 0})),va()}},G(`preset_${r}`))))),n.append(Ys(G("curl"),i.curl??1,0,1.5,.05,r=>jt(a=>ye(a,e,x.t,{preset:s,curl:r,spread:i.spread}),{commit:!1}),()=>jn(),()=>Gn())),n.append(Ys(G("spread"),i.spread??nr[s].spread,-1,1,.05,r=>jt(a=>ye(a,e,x.t,{preset:s,curl:i.curl??1,spread:r}),{commit:!1}),()=>jn(),()=>Gn()))}}function xa(){let n=St("#helpers");if(n.innerHTML="",!x.doc)return;let t=(i,s,r,a={})=>H("button",{class:"btn block","data-tip":s,onclick:r,...a},G(i));n.append(t("mirror_all","tip_mirror_all",Af),t("mirror_sel","tip_mirror_sel",()=>{x.selBone&&jt(i=>Au(i,x.actor,x.selBone,x.t))},{disabled:!x.selBone||!Ui(x.selBone||"")}),H("div",{class:"row"},t("copy_pose","tip_copy_pose",Tf),t("paste_pose","tip_paste_pose",Rf,{disabled:!x.clipboardPose})),t("snap_ground","tip_snap_ground",Yv),t("lock_feet","tip_lock_feet",Zv)),x.doc.type==="pair"&&n.append(t("stick_hand","tip_stick_hand",Jv)),x.selContact!=null&&x.doc.contacts?.[x.selContact]&&n.append(t("unstick","tip_stick_hand",()=>{jt(i=>Wa(i,x.selContact)),He({selContact:null})})),n.append(H("div",{class:"hint"},x.range?`${G("range")}: ${je(x.range[0])}\u2013${je(x.range[1])} s`:G("no_range"))),n.append(H("div",{class:"tg-title"},G("notes")));let e=H("textarea",{rows:3,placeholder:G("notes_hint")},x.doc.notes||"");e.addEventListener("change",()=>jt(i=>{i.notes=e.value.slice(0,4e3)})),n.append(e)}function Af(){jt(n=>hs(n,x.actor,x.t,Eu(Xr(n,x.actor,x.t)))),fe(G("mirror_all"),"ok",1500)}function Tf(){x.clipboardPose=Xr(x.doc,x.actor,x.t),xa(),fe(G("copy_pose"),"ok",1500)}function Rf(){x.clipboardPose&&jt(n=>hs(n,x.actor,x.t,x.clipboardPose))}function Yv(){let n=x.actor,t=mn(x.t),e=t[n],i=Ce(n),s=x.selHandle?.name==="footL"?["L"]:x.selHandle?.name==="footR"?["R"]:["L","R"];jt(r=>{for(let a of s){let o={actor:n,kind:"ik",id:"foot"+a},c=Ne(r,o,x.t),h=Mh(e,e.world.P[i.idx(cn["foot"+a])]),l=[c&&(c.weight??1)>0?c.target[0]:h[0],c&&(c.weight??1)>0?c.target[1]:h[1],Dv(n)];ye(r,o,x.t,{target:l,space:"body",weight:1,pitch:0,roll:0,yaw:c?.yaw??di(Et(e.D[i.idx(cn["foot"+a])]))/zt,pole:c?.pole})}})}function Zv(){if(!x.range)return fe(G("no_range"),"warn");let n=x.selHandle?.name==="footL"?"L":x.selHandle?.name==="footR"?"R":"both";jt(t=>Cu(t,x.actor,n,x.range)),fe(G("lock_feet"),"ok",1500)}var jv={part_head:"SKEL_Head",part_neck:"SKEL_Neck_1",part_chest:"SKEL_Spine3",part_pelvis:"SKEL_Pelvis",part_shoulderL:"SKEL_L_UpperArm",part_shoulderR:"SKEL_R_UpperArm",part_armL:"SKEL_L_Forearm",part_armR:"SKEL_R_Forearm",part_handL:"SKEL_L_Hand",part_handR:"SKEL_R_Hand"};function Jv(){if(x.doc.type!=="pair")return fe(G("pair_only"),"warn");let n=x.selHandle&&/^(hand|foot)[LR]$/.test(x.selHandle.name)?x.selHandle:null;if(!n)return fe(G("select_hand_first"),"warn");let t=li().find(i=>i!==n.actor),e=H("select",{},Object.entries(jv).map(([i,s])=>H("option",{value:s},G(i))));Zs(G("stick_hand"),H("div",{},H("label",{},G("stick_target")),e),[H("button",{class:"btn",onclick:En},G("cancel")),H("button",{class:"btn accent",onclick:()=>{let i=e.value,s=mn(x.t),r=s[t],a=Ce(t),o=a.idx(i),c=s[n.actor].world.P[Ce(n.actor).idx(cn[n.name])],h=kt(he(Et(Rt(r.mover.q,r.D[o]))),Ot(c,r.world.P[o])),l=x.range||[x.t,x.doc.duration];jt(u=>Pu(u,`${n.actor}.${n.name}`,`${t}.${i}`,h,l)),En()}},G("ok"))])}function Cf(){let n=St("#poses");if(n.innerHTML="",!x.doc)return;n.append(H("div",{class:"tg-title"},G("builtin"))),n.append(H("div",{class:"presets"},Object.keys(da).map(e=>H("button",{class:"btn small",onclick:()=>jt(i=>hs(i,x.actor,x.t,da[e]))},G(e))))),n.append(H("div",{class:"tg-title"},G("my_poses")));let t=Object.keys(x.poses).sort();for(let e of t)n.append(H("div",{class:"row"},H("button",{class:"btn small",style:"flex:1;text-align:left",onclick:()=>{try{let i=JSON.parse(x.poses[e]);jt(s=>hs(s,x.actor,x.t,i))}catch{fe(G("pose_invalid"),"error")}}},e),H("button",{class:"btn small danger",onclick:()=>bn("poseDelete",[e])},"\u2715")));n.append(H("button",{class:"btn block","data-tip":"tip_save_pose",onclick:async()=>{let e=await vh(G("pose_name_prompt"),"",G("name_hint"));if(e){if(!/^[a-z0-9_]{1,32}$/.test(e))return fe(G("name_hint"),"error");bn("poseSave",[e,JSON.stringify(Xr(x.doc,x.actor,x.t))])}}},G("save_pose")))}function Lf(){let n=St("#checks"),t=St("#light");t.className=`light ${x.light}`,t.textContent=x.checking?G("check_running"):G(`light_${x.light}`),n.innerHTML="",x.checkError&&n.append(H("div",{class:"err"},x.checkError));let e=x.findings.slice().sort((i,s)=>({error:0,warn:1,ok:2})[i.level]-{error:0,warn:1,ok:2}[s.level]);for(let i of e){let s=H("div",{class:`finding ${i.level}`},H("div",{class:"ft"},i.title),H("div",{class:"fx"},i.text)),r=H("div",{class:"row"});i.level!=="ok"&&i.t!=null&&r.append(H("button",{class:"btn small",onclick:()=>{gn(i.t),i.actor&&He({actor:i.actor})}},G("jump"))),i.fix&&r.append(H("button",{class:"btn small accent",onclick:()=>{let a=Qh(x.doc,i.fix,{sampled:Ya});$a(a),fe(`${G("fix")}: ${i.fix.label||i.title}`,"ok",1800)}},i.fix.label||G("fix"))),r.children.length&&s.append(r),n.append(s)}}function Th(){if(!x.doc)return;let n=Math.round(x.t*ln),t=Math.round(x.doc.duration*ln);St("#time-out").textContent=`${je(x.t)} s \xB7 ${G("frame",n,t)}`}function Ks(){St("#btn-play").textContent=x.playing?"\u275A\u275A":"\u25B6",x.doc&&(St("#chk-loop").checked=!!x.doc.loop,St("#duration").value=x.doc.duration,St("#range-out").textContent=x.range?`${G("range")} ${je(x.range[0])}\u2013${je(x.range[1])} s`:"",St("#btn-undo").disabled=!x.history.length,St("#btn-redo").disabled=!x.future.length)}function js(){St("#project-name").textContent=x.doc?`${x.doc.title||x.name} (${x.doc.type==="pair"?G("pair"):G("single")})`:G("no_project"),St("#save-state").textContent=x.doc?x.saving?G("saving"):x.dirty?G("unsaved"):x.savedAt?G("saved_at",new Date(x.savedAt).toLocaleTimeString().slice(0,5)):"":""}function bn(n,t){return qe("server",{op:n,args:t})}function Rr(){!x.doc||!x.name||x.saving||(x.saving=!0,x.saveVersion=x.version,js(),bn("save",[x.name,Cn(x.doc)]))}Sn("reply",({data:n})=>{if(n){if(n.op==="save"){x.saving=!1,n.ok?(x.saveVersion===x.version&&(x.dirty=!1),x.savedAt=Date.now()):fe(n.msg,"error"),js();return}if(n.op==="preview"||n.op==="finalize"){n.ok||(fe(n.msg,"error",6e3),n.op==="preview"?(x.test=null,qn()):sy(n.msg));return}n.op==="rename"&&n.ok&&x.name===n.from&&(x.name=n.name,jt(t=>{t.name=n.name})),n.msg&&fe(n.msg,n.ok?"ok":"error")}});Sn("projects",({list:n})=>{x.projects=n||[],xh()&&bh&&$s()});Sn("poses",({poses:n})=>{x.poses=n||{},Cf()});Sn("notice",({key:n,text:t})=>fe(t||G(n),"warn",3e3));Sn("project",({name:n,text:t})=>{let e;try{let s=Wh(JSON.parse(t));if(s.errors)throw new Error(s.errors[0].msg);e=s.doc}catch(s){return fe(`${G("project_invalid")||G("err")}: ${s.message}`,"error")}let i=Kh(e);i.length&&fe(i[0].msg,"warn",6e3),Rh(e,n)});function Rh(n,t){x.t=0,x.playing=!1;for(let e of Object.keys(Pt.actors))Pt.removeActor(e);Iu(n,t);for(let e of li())Pt.buildActor(e,Ce(e));He({actor:"a",selBone:null,selHandle:null}),n.type==="pair"?Pf():qe("partner",{model:null}),En(),Cr(n.type==="pair"?"side":"front"),ay(),jr()}async function Pf(){let n=Ne(x.doc,{actor:"b",kind:"mover"},0)||{p:[0,.9,0],yaw:180},t=await qe("partner",{model:x.doc.actors.b.model,p:n.p,yaw:n.yaw});t&&t.ok===!1&&t.error&&fe(G("partner_spawn_failed",t.error),"error")}function $s(){bh=!0;let n=x.name,t=H("div",{class:"plist"}),e=()=>{t.innerHTML="",x.projects.length||t.append(H("div",{class:"pitem"},H("span",{class:"pm"},"\u2014")));for(let u of x.projects)t.append(H("div",{class:`pitem ${u.name===n?"sel":""}`,onclick:()=>{n=u.name,e()},ondblclick:()=>bn("load",[u.name])},H("span",{class:"pn"},u.title&&u.title!==u.name?`${u.title} (${u.name})`:u.name),H("span",{class:"pm"},u.type==="pair"?G("pair"):G("single")),H("span",{class:"pm"},u.updated?new Date(u.updated*1e3).toLocaleString().slice(0,16):"")))};e();let i=H("input",{type:"text",placeholder:"winken_01"}),s=H("select",{},H("option",{value:"single"},G("single")),H("option",{value:"pair"},G("pair"))),r=H("select",{},x.partners.map(u=>H("option",{value:u.model},u.label||u.model))),a=H("input",{type:"number",min:.2,max:30,step:.1,value:x.config.duration||2}),o=H("div",{class:"row hidden"},H("label",{},G("partner_model")),r);s.addEventListener("change",()=>o.classList.toggle("hidden",s.value!=="pair"));let c=()=>{let u=i.value.trim();if(!/^[a-z0-9_]{1,40}$/.test(u))return fe(G("name_hint"),"error");if(x.projects.some(p=>p.name===u))return fe(`${u}: existiert schon`,"error");let d=$h({name:u,type:s.value,duration:Math.max(.2,Math.min(30,+a.value||2)),models:{a:"mp_m_freemode_01",b:r.value}});d.title=u;for(let p of Object.keys(d.actors))hs(d,p,0,da.pose_stand);Rh(d,u),x.dirty=!0,Rr(),bn("list",[])},h=u=>()=>{if(!n)return fe(G("none_selected"),"warn");u(n)},l=H("div",{},t,H("div",{class:"row"},H("button",{class:"btn accent",onclick:h(u=>bn("load",[u]))},G("open")),H("button",{class:"btn",onclick:h(async u=>{let d=await vh(G("new_name_prompt"),u,G("name_hint"));d&&bn("rename",[u,d]),setTimeout($s,200)})},G("rename")),H("button",{class:"btn",onclick:h(async u=>{let d=await vh(G("new_name_prompt"),`${u}_kopie`,G("name_hint"));d&&bn("duplicate",[u,d]),setTimeout($s,200)})},G("duplicate")),H("button",{class:"btn danger",onclick:h(async u=>{await wh(G("confirm_delete",u))&&bn("delete",[u]),setTimeout($s,200)})},G("delete"))),H("h3",{},G("new_project")),H("div",{class:"row"},H("label",{},G("name")),i),H("div",{class:"hint"},G("name_hint")),H("div",{class:"row"},s,H("label",{},G("duration_s")),a),o);Zs(G("projects"),l,[x.doc?H("button",{class:"btn",onclick:En},G("close")):null,H("button",{class:"btn accent",onclick:c},G("create"))])}function Qv(){let n=(t,e)=>{let i=Ce(t);return i.has(e)?i.bones[i.idx(e)].tag:null};return(x.doc.contacts||[]).map(t=>{let e=zn(t.from),i=zn(t.to),s=Ce(i.actor),r=s.has(i.bone)?kt(he(s.restQ[s.idx(i.bone)]),t.offset||[0,0,0]):[0,0,0];return{id:t.id||`${t.from}>${t.to}`,a:{actor:e.actor,tag:n(e.actor,e.bone),offset:[0,0,0]},b:{actor:i.actor,tag:n(i.actor,i.bone),offset:r}}}).filter(t=>t.a.tag!=null&&t.b.tag!=null)}var vf=!1;async function ty(){if(!(!x.doc||!x.name)){if(!vf){if(!await wh(G("test_notice")))return;vf=!0}x.playing=!1,x.test={stage:"converting",t0:performance.now(),points:[],follow:!0},qn(),bn("preview",[x.name,Cn(x.doc)]),x.dirty=!1,x.savedAt=Date.now(),js()}}Sn("job",({result:n})=>{if(n){if(n.kind==="final")return ry(n);if(x.test){if(!n.ok){x.test={...x.test,stage:"failed",errors:n.errors||[]},qn();return}x.test.stage="loading",x.test.result=n,x.lastResult=n,qn(),qe("test",{action:"start",result:{dict:n.dict,clips:n.clips,origins:n.origins,duration:n.duration},loop:!!x.doc.loop,rate:1,phase:0,contacts:Qv()})}}});Sn("test:started",({ok:n,error:t})=>{if(x.test){if(!n){x.test.stage="failed",x.test.errors=[{msg:t}],qn();return}x.test.stage="playing",x.test.elapsed=(performance.now()-x.test.t0)/1e3,qn()}});Sn("test:state",n=>{x.test&&(x.test.phase=n.phase,x.test.points=n.points||[],Ws=!0,If())});Sn("test:stopped",()=>{x.test=null,ga="",qn(),Pt?.setLines([])});function ey(){qe("test",{action:"stop"}),x.test=null,ga="",qn(),Pt.setLines([])}function qn(){let n=St("#sec-test"),t=St("#test");if(n.classList.toggle("hidden",!x.test),t.innerHTML="",!x.test)return;let e=x.test,i={converting:G("test_converting"),loading:G("test_loading"),playing:G("test_playing",je(e.elapsed||0,1)),failed:G("test_failed")}[e.stage];t.append(H("div",{class:`stage ${e.stage==="failed"?"err":""}`},i));for(let s of e.errors||[])t.append(H("div",{class:"err"},s.msg||String(s)));e.stage==="playing"&&(t.append(H("div",{class:"row"},H("label",{class:"check"},H("input",{type:"checkbox",checked:!!x.doc.loop,onchange:s=>qe("test",{action:"loop",loop:s.target.checked})}),G("loop")),H("label",{class:"check"},H("input",{type:"checkbox",checked:x.overlay,onchange:s=>{x.overlay=s.target.checked}}),G("overlay")))),t.append(Ys(G("speed"),1,0,2,.05,s=>qe("test",{action:"rate",rate:s}))),t.append(Ys(G("phase"),e.phase||0,0,.999,.001,s=>{qe("test",{action:"rate",rate:0}),qe("test",{action:"phase",phase:s})})),t.append(H("button",{class:"btn block","data-tip":"tip_calibrate",onclick:ny},G("calibrate"))),e.calib&&t.append(H("div",{class:e.calib.max<=1?"info":"err"},G("calib_result",je(e.calib.max,1),je(e.calib.mean,1),e.calib.n))),t.append(H("div",{class:"tg-title"},G("contacts")),H("table",{class:"mtable",id:"measure"})),If()),t.append(H("button",{class:"btn block",onclick:ey},G("stop")))}function If(){let n=document.getElementById("measure");if(!(!n||!x.test)){n.innerHTML="";for(let t of x.test.points||[])n.append(H("tr",{},H("td",{},t.id),H("td",{class:t.red?"red":""},`${je(t.cm,1)} cm`)));Pt.setLines((x.test.points||[]).map(t=>({a:t.a,b:t.b,color:t.red?16730955:4645060})))}}async function ny(){if(!x.test||x.test.stage!=="playing")return fe(G("calib_need_test"),"warn");qe("test",{action:"rate",rate:0}),await new Promise(r=>setTimeout(r,300));let n=(x.test.phase||0)*x.doc.duration,t=mn(n),e=0,i=0,s=0;for(let r of li()){let a=Ce(r),o=jh(a).filter(h=>!h.includes("Finger")&&h!=="SKEL_ROOT"),c=await qe("bones",{actor:r,list:o.map(h=>({tag:a.bones[a.idx(h)].tag,id:h}))});for(let h of c?.bones||[]){let l=t[r].world.P[a.idx(h.id)],u=Math.hypot(h.p[0]-l[0],h.p[1]-l[1],h.p[2]-l[2])*100;e=Math.max(e,u),i+=u,s++}}x.test.calib={max:e,mean:s?i/s:0,n:s},qn()}var Bn=null;function iy(){if(!x.doc||!x.name)return;let n=H("input",{type:"text",value:x.doc.title||x.name,style:"width:100%"}),t=H("input",{type:"text",value:x.doc.targetResource||"",placeholder:"jj_emotes"}),e=H("input",{type:"text",value:x.doc.dict||`jj_${x.name}`.slice(0,48)}),i=H("textarea",{rows:3,placeholder:G("notes_hint")},x.doc.notes||"");Bn=H("div",{id:"finish-out"});let s=()=>{let r=e.value.trim(),a=t.value.trim();if(!/^[a-z0-9_]{1,48}$/.test(r)||r.startsWith("jjs_"))return fe(G("dict_invalid")||G("name_hint"),"error");if(a&&!/^[A-Za-z0-9_-]{1,64}$/.test(a))return fe(G("target_invalid")||G("err"),"error");jt(o=>{o.title=n.value.slice(0,80),o.notes=i.value.slice(0,4e3),o.dict=r,a?o.targetResource=a:delete o.targetResource}),Bn.innerHTML="",Bn.append(H("div",{class:"stage"},G("test_converting"))),bn("finalize",[x.name,Cn(x.doc),r,a]),x.dirty=!1,x.savedAt=Date.now(),js()};Zs(G("finish_title"),H("div",{},H("div",{class:"row"},H("label",{},G("name")),n),H("div",{class:"row"},H("label",{},G("target_resource")),t,H("label",{},G("dict_name")),e),H("div",{class:"tg-title"},G("notes")),i,Bn),[H("button",{class:"btn",onclick:En},G("close")),H("button",{class:"btn accent",onclick:s},G("convert"))])}function sy(n){Bn&&(Bn.innerHTML="",Bn.append(H("div",{class:"err"},n)))}function ry(n){if(!Bn)return;if(Bn.innerHTML="",!n.ok){for(let e of n.errors||[])Bn.append(H("div",{class:"err"},e.msg));return}let t=H("textarea",{class:"report",readonly:!0},n.report?.text||"");Bn.append(H("div",{class:"tg-title"},G("report")),t,H("div",{class:"row"},H("button",{class:"btn accent",onclick:()=>oy(t)},G("copy")),H("span",{class:"hint"},G("report_files",[n.report?.md,n.report?.json,n.report?.ycd].filter(Boolean).join(", ")))))}function oy(n){n.removeAttribute("readonly"),n.select();let t=!1;try{t=document.execCommand("copy")}catch{t=!1}n.setAttribute("readonly",""),!t&&navigator.clipboard?navigator.clipboard.writeText(n.value).then(()=>fe(G("copied"),"ok"),()=>fe(G("copy_failed"),"warn")):fe(t?G("copied"):G("copy_failed"),t?"ok":"warn")}function Df(n=!1){let t=!1;try{t=localStorage.getItem("jjs_tutorial_done")==="1"}catch{t=!1}if(!n&&(t||x.config.tutorial===!1))return;let e=0,i=()=>{St("#tutorial").classList.remove("hidden"),St("#tut-step").textContent=`${e+1} / 5`,St("#tut-text").textContent=G(`tut${e+1}`),St("#tut-next").textContent=e===4?G("tutorial_done"):G("tutorial_next")},s=()=>{St("#tutorial").classList.add("hidden");try{localStorage.setItem("jjs_tutorial_done","1")}catch{}};St("#tut-next").onclick=()=>{e>=4?s():(e++,i())},St("#tut-skip").onclick=s,i()}function ay(){qs(),wn(),va(),xa(),Cf(),Lf(),qn(),Ks(),Th(),js()}function cy(){kv(),pi("doc",()=>{wn(),va(),Ks(),js(),hy()}),pi("time",()=>{Th(),uy()}),pi("selection",()=>{xa(),Ws=!0}),pi("history",Ks),pi("range",()=>{Ks(),xa()}),pi("checks",Lf),St("#btn-projects").onclick=()=>{bn("list",[]),$s()},St("#btn-undo").onclick=Xa,St("#btn-redo").onclick=qa,St("#btn-save").onclick=Rr,St("#btn-test").onclick=ty,St("#btn-finish").onclick=iy,St("#btn-help").onclick=()=>Df(!0),St("#btn-close").onclick=Nf;for(let n of document.querySelectorAll("[data-cam]"))n.onclick=()=>Cr(n.dataset.cam);St("#btn-play").onclick=kf,St("#chk-loop").onchange=n=>jt(t=>{t.loop=n.target.checked}),St("#speed").oninput=n=>{x.speed=+n.target.value,St("#speed-out").textContent=`${je(x.speed,1)}\xD7`},St("#chk-onion").onchange=n=>{x.onion=n.target.checked},St("#chk-allrows").onchange=n=>Eh.setShowAll(n.target.checked),St("#chk-fingers").onchange=qs,St("#partner-model").onchange=n=>{jt(t=>{t.actors.b.model=n.target.value}),Pf()},St("#duration").onchange=n=>{let t=Math.max(.2,Math.min(30,+n.target.value||2));jt(e=>{e.duration=+t.toFixed(3);let i=s=>{for(let r of s||[])r.t=Math.min(r.t,e.duration)};for(let s of Object.values(e.tracks)){i(s.mover),i(s.root),i(s.look);for(let r of Object.values(s.bones||{}))i(r);for(let r of Object.values(s.ik||{}))i(r);for(let r of Object.values(s.fingers||{}))i(r);for(let r of Object.values(s.feet?.lock||{}))for(let a of r)a[0]=Math.min(a[0],e.duration),a[1]=Math.min(a[1],e.duration);for(let[r,a]of Object.entries(s.bones||{}))s.bones[r]=ly(a)}for(let s of e.contacts||[])s.t[0]=Math.min(s.t[0],e.duration),s.t[1]=Math.min(s.t[1],e.duration);for(let s of e.events||[])s.t=Math.min(s.t,e.duration)}),gn(Math.min(x.t,t))};for(let n of document.querySelectorAll("[data-ease]"))n.onclick=()=>{if(!x.selKeys.length)return fe(G("none_selected"),"warn",1500);jt(t=>{for(let e of x.selKeys)Mu(t,e.actor,e.group,e.t,n.dataset.ease)})};St("#btn-key-del").onclick=Uf,St("#btn-event").onclick=()=>{let n=H("input",{type:"text",value:"impact"}),t=H("input",{type:"number",min:0,max:30,step:.05,value:0});Zs(G("add_event"),H("div",{},H("div",{class:"row"},H("label",{},G("event_name")),n),H("div",{class:"hint"},G("name_hint")),H("div",{class:"row"},H("label",{},G("event_duration")),t)),[H("button",{class:"btn",onclick:()=>En(!1)},G("cancel")),H("button",{class:"btn accent",onclick:()=>{let e=n.value.trim();if(!/^[a-z0-9_]{1,24}$/.test(e))return fe(G("name_hint"),"error");let i=Math.max(0,Math.min(x.doc.duration-x.t,+t.value||0));jt(s=>Tu(s,e,x.t,i>0?i:void 0)),En(!1)}},G("ok"))])},window.addEventListener("keydown",dy),setInterval(()=>{Xs&&x.dirty&&!x.test&&Rr()},Math.max(10,x.config.autosave||30)*1e3)}var ly=n=>{let t=new Set;return n.filter(e=>{let i=Math.round(e.t*1e3);return t.has(i)?!1:(t.add(i),!0)})},yf=0,Sf=0;function hy(){clearTimeout(yf),yf=setTimeout(qs,120)}function uy(){clearTimeout(Sf),Sf=setTimeout(()=>{wn(),va()},60)}function kf(){x.doc&&(!x.playing&&x.t>=x.doc.duration-.001&&!x.doc.loop&&(x.t=0),x.playing=!x.playing,Ks())}function Cr(n){if(!x.doc)return Pt.setPreset(n);let e=mn(x.t)[x.actor],i=Ce(x.actor),s=e.world.P[i.idx("SKEL_Spine2")];if(n==="focus"){let r=x.selBone||(x.selHandle?cn[x.selHandle.name]:null);return Pt.focusOn(r&&i.has(r)?e.world.P[i.idx(r)]:s,1.1)}Pt.setPreset(n,s)}function Uf(){if(x.selKeys.length){jt(n=>{for(let t of x.selKeys)yu(n,t.actor,t.group,t.t)}),He({selKeys:[]});return}if(x.selEvent!=null){jt(n=>Ru(n,x.selEvent)),He({selEvent:null});return}if(x.selContact!=null){jt(n=>Wa(n,x.selContact)),He({selContact:null});return}if(x.selLock){let n=x.selLock;jt(t=>Lu(t,n.actor,n.side,n.index)),He({selLock:null})}}async function Nf(){await wh(G("confirm_close"))&&(x.dirty&&Rr(),setTimeout(()=>qe("close"),x.dirty?300:0))}function dy(n){if(n.key==="Escape"){if(n.preventDefault(),!St("#tutorial").classList.contains("hidden")){St("#tut-skip").click();return}if(xh()){x.doc&&En();return}Nf();return}if(xh()||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)||!x.doc)return;let t=n.key.toLowerCase();if(n.ctrlKey&&t==="z"){n.preventDefault(),Xa();return}if(n.ctrlKey&&(t==="y"||n.shiftKey&&t==="z")){n.preventDefault(),qa();return}if(n.ctrlKey&&t==="s"){n.preventDefault(),Rr();return}if(n.ctrlKey&&t==="c"){x.selKeys.length?x.clipboardKeys=x.selKeys.flatMap(e=>bu(x.doc,e.actor,e.group,e.t).map(i=>({...i,dt:e.t-x.selKeys[0].t}))):Tf();return}if(n.ctrlKey&&t==="v"){x.clipboardKeys?.length?jt(e=>{for(let i of x.clipboardKeys)wu(e,[i],x.t+i.dt)}):Rf();return}if(t===" "){n.preventDefault(),kf();return}if(t==="delete"||t==="backspace"){Uf();return}if(t==="m"){Af();return}if(t==="o"){x.onion=!x.onion,St("#chk-onion").checked=x.onion;return}if(t==="l"){x.limitsOn=!x.limitsOn,wn();return}if(t==="f"){Cr("focus");return}if(["1","2","3","4"].includes(t)){Cr(["front","side","top","shoulder"][+t-1]);return}if(t==="arrowleft"||t==="arrowright"){let e=t==="arrowright"?1:-1;if(n.shiftKey){let i=sr(x.doc,x.actor,null),s=e>0?i.find(r=>r>x.t+.001):i.filter(r=>r<x.t-.001).pop();s!=null&&gn(s)}else gn(Ue(x.t+e/ln));n.preventDefault()}}Ar||window.addEventListener("DOMContentLoaded",()=>{let n=window.JJS_MOCK||{};n.autoOpen!==!1&&pa({type:"open",data:{locale:"de",frame:{x:0,y:0,z:0,heading:0},config:{autosave:30,undo:150,duration:2,tutorial:n.tutorial??!0,partners:[{model:"mp_m_freemode_01",label:"Mann (Freemode)"},{model:"mp_f_freemode_01",label:"Frau (Freemode)"},{model:"u_m_y_zombie_01",label:"Zombie"}],camera:{Fov:45,MinDistance:.4,MaxDistance:12,UpdatesPerSecond:30}},server:{projects:[],skeletons:n.skeletons||{},poses:{},watch:{alive:!0}}}})});window.JJS_STUDIO={S:x,solveAt:mn,runChecks:jr,serialize:()=>Cn(x.doc),setTime:gn,select:Tr,view:()=>Pt,groupOf:za,screenOf(n){let t=Pt.project(n),e=Pt.renderer.domElement.getBoundingClientRect();return{x:t.x+e.left,y:t.y+e.top}},handleScreen(n,t){let e=Ah(mn(x.t)).find(i=>i.actor===n&&i.name===t);return e?this.screenOf(e.p):null},ringScreen(n,t){let e=Mn;if(!e)return null;let i=e.axes[n],s=Math.abs(i[2])<.9?[0,0,1]:[1,0,0],r=[i[1]*s[2]-i[2]*s[1],i[2]*s[0]-i[0]*s[2],i[0]*s[1]-i[1]*s[0]],a=Math.hypot(...r),o=r.map(u=>u/a),c=[i[1]*o[2]-i[2]*o[1],i[2]*o[0]-i[0]*o[2],i[0]*o[1]-i[1]*o[0]],h=Math.max(.05,Pt.camDistanceTo(e.p)*.11),l=t*zt;return this.screenOf(e.p.map((u,d)=>u+h*(Math.cos(l)*o[d]+Math.sin(l)*c[d])))},gizmo:()=>Mn,async contactSheet({cols:n=4,rows:t=2,cam:e="side",width:i=360,height:s=300,t0:r=0,t1:a=null}={}){let o=document.getElementById("app");o.classList.add("sheet"),Pt.resize();let c=document.createElement("canvas");c.width=n*i,c.height=t*s;let h=c.getContext("2d");h.fillStyle="#20232a",h.fillRect(0,0,c.width,c.height);let l=n*t,u=a??x.doc.duration;for(let d=0;d<l;d++){let p=r+(u-r)*(l>1?d/(l-1):0);x.t=p,x.selBone=null,x.selHandle=null,Cr(e);let g=mn(p);for(let f of li())Pt.updateActor(f,g[f],null);Pt.setHandles([]),Pt.hideGizmo(),Pt.render();let _=Pt.renderer.domElement,m=Math.min(i/_.width,s/_.height);h.drawImage(_,d%n*i+(i-_.width*m)/2,Math.floor(d/n)*s+(s-_.height*m)/2,_.width*m,_.height*m),h.fillStyle="#ffffff",h.font="16px sans-serif",h.fillText(`${p.toFixed(2)} s`,d%n*i+8,Math.floor(d/n)*s+20)}return o.classList.remove("sheet"),Pt.resize(),c.toDataURL("image/png")},openDocument(n,t){Rh(n,t)},running:()=>Xs};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
