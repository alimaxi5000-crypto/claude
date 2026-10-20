(()=>{var ze=Math.PI/180,Ma=1e-9;var Ue=(n,e)=>[n[0]+e[0],n[1]+e[1],n[2]+e[2]],Ne=(n,e)=>[n[0]-e[0],n[1]-e[1],n[2]-e[2]],ut=(n,e)=>[n[0]*e,n[1]*e,n[2]*e],an=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2],Pt=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],Tt=n=>Math.hypot(n[0],n[1],n[2]);function Xe(n){let e=Tt(n);return e>Ma?[n[0]/e,n[1]/e,n[2]/e]:[0,0,0]}var ba=(n,e,t)=>[n[0]+(e[0]-n[0])*t,n[1]+(e[1]-n[1])*t,n[2]+(e[2]-n[2])*t];var hi=(n,e)=>Ne(n,ut(e,an(n,e)));function Lr(n){let e=Xe(n),t=Math.abs(e[2])<.9?[0,0,1]:[1,0,0];return Xe(Pt(e,t))}var Rt=()=>[0,0,0,1];function Ce(n,e){let[t,i,s,r]=n,[a,o,c,h]=e;return[r*a+t*h+i*c-s*o,r*o-t*c+i*h+s*a,r*c+t*o-i*a+s*h,r*h-t*a-i*o-s*c]}var ht=n=>[-n[0],-n[1],-n[2],n[3]];function Te(n){let e=Math.hypot(n[0],n[1],n[2],n[3]);return e>Ma?[n[0]/e,n[1]/e,n[2]/e,n[3]/e]:[0,0,0,1]}var Pr=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2]+n[3]*e[3],zf=n=>[-n[0],-n[1],-n[2],-n[3]];function dt(n,e){let t=Xe(n),i=Math.sin(e/2);return[t[0]*i,t[1]*i,t[2]*i,Math.cos(e/2)]}function De(n,e){let[t,i,s,r]=n,a=r*e[0]+i*e[2]-s*e[1],o=r*e[1]+s*e[0]-t*e[2],c=r*e[2]+t*e[1]-i*e[0],h=-t*e[0]-i*e[1]-s*e[2];return[a*r+h*-t+o*-s-c*-i,o*r+h*-i+c*-t-a*-s,c*r+h*-s+a*-i-o*-t]}function Hf(n){let e=n[0][0],t=n[1][0],i=n[2][0],s=n[0][1],r=n[1][1],a=n[2][1],o=n[0][2],c=n[1][2],h=n[2][2],l=e+r+h,u,d,p,g;if(l>0){let _=Math.sqrt(l+1)*2;g=.25*_,u=(c-a)/_,d=(i-o)/_,p=(s-t)/_}else if(e>r&&e>h){let _=Math.sqrt(1+e-r-h)*2;g=(c-a)/_,u=.25*_,d=(t+s)/_,p=(i+o)/_}else if(r>h){let _=Math.sqrt(1+r-e-h)*2;g=(i-o)/_,u=(t+s)/_,d=.25*_,p=(a+c)/_}else{let _=Math.sqrt(1+h-e-r)*2;g=(s-t)/_,u=(i+o)/_,d=(a+c)/_,p=.25*_}return Te([u,d,p,g])}function wn(n,e){let t=Xe(n),i=hi(e,t);Tt(i)<1e-6&&(i=Lr(t)),i=Xe(i);let s=Pt(t,i);return Hf([t,i,s])}function wa(n,e,t){let i=e,s=Pr(n,e);if(s<0&&(i=zf(e),s=-s),s>.9995)return Te([n[0]+(i[0]-n[0])*t,n[1]+(i[1]-n[1])*t,n[2]+(i[2]-n[2])*t,n[3]+(i[3]-n[3])*t]);let r=Math.acos(s),a=Math.sin(r),o=Math.sin((1-t)*r)/a,c=Math.sin(t*r)/a;return[n[0]*o+i[0]*c,n[1]*o+i[1]*c,n[2]*o+i[2]*c,n[3]*o+i[3]*c]}function os(n,e){let t=Math.abs(Pr(Te(n),Te(e)));return 2*Math.acos(Math.min(1,t))}function Dh(n){let e=Tt(n);return e<Ma?Rt():dt(n,e)}function kh(n,e){let t=ut(e,an([n[0],n[1],n[2]],e));return Te([t[0],t[1],t[2],n[3]])}function ui(n){let e=De(n,[0,1,0]);return Math.atan2(-e[0],e[1])}var Mt=(n,e,t)=>n<e?e:n>t?t:n;var Ir=n=>n*n*(3-2*n),Vf=n=>n*n*n*(n*(n*6-15)+10);var ki={linear:n=>n,in:n=>n*n,out:n=>1-(1-n)*(1-n),inOut:Ir,in3:n=>n*n*n,out3:n=>1-Math.pow(1-n,3),inOut3:Vf,out5:n=>1-Math.pow(1-n,5),in5:n=>Math.pow(n,5),strike:n=>n<.35?.15*(n/.35)**2:.15+.85*(1-Math.pow(1-(n-.35)/.65,4)),back:n=>1+2.70158*Math.pow(n-1,3)+1.70158*Math.pow(n-1,2),elastic:n=>n===0||n===1?n:Math.pow(2,-9*n)*Math.sin((n*10-.75)*(2*Math.PI)/3)+1,hold:()=>0,step:n=>n<1?0:1};var He={root:"SKEL_ROOT",pelvis:"SKEL_Pelvis",spineRoot:"SKEL_Spine_Root",spine:["SKEL_Spine0","SKEL_Spine1","SKEL_Spine2","SKEL_Spine3"],neck:"SKEL_Neck_1",head:"SKEL_Head",side:{L:{clav:"SKEL_L_Clavicle",upper:"SKEL_L_UpperArm",lower:"SKEL_L_Forearm",hand:"SKEL_L_Hand",thigh:"SKEL_L_Thigh",calf:"SKEL_L_Calf",foot:"SKEL_L_Foot",toe:"SKEL_L_Toe0",fingers:[["SKEL_L_Finger00","SKEL_L_Finger01","SKEL_L_Finger02"],["SKEL_L_Finger10","SKEL_L_Finger11","SKEL_L_Finger12"],["SKEL_L_Finger20","SKEL_L_Finger21","SKEL_L_Finger22"],["SKEL_L_Finger30","SKEL_L_Finger31","SKEL_L_Finger32"],["SKEL_L_Finger40","SKEL_L_Finger41","SKEL_L_Finger42"]]},R:{clav:"SKEL_R_Clavicle",upper:"SKEL_R_UpperArm",lower:"SKEL_R_Forearm",hand:"SKEL_R_Hand",thigh:"SKEL_R_Thigh",calf:"SKEL_R_Calf",foot:"SKEL_R_Foot",toe:"SKEL_R_Toe0",fingers:[["SKEL_R_Finger00","SKEL_R_Finger01","SKEL_R_Finger02"],["SKEL_R_Finger10","SKEL_R_Finger11","SKEL_R_Finger12"],["SKEL_R_Finger20","SKEL_R_Finger21","SKEL_R_Finger22"],["SKEL_R_Finger30","SKEL_R_Finger31","SKEL_R_Finger32"],["SKEL_R_Finger40","SKEL_R_Finger41","SKEL_R_Finger42"]]}}};var Dr=class{constructor(e){this.id=e.id||"unnamed",this.model=e.model||"",this.source=e.source||"unknown",this.calib=e.calib||{},this.bones=e.bones.map((s,r)=>({index:r,name:s.name,tag:s.tag,parentName:s.parent??null,t:s.t.slice(),r:Te(s.r)})),this.byName=new Map(this.bones.map(s=>[s.name,s])),this.byTag=new Map(this.bones.map(s=>[s.tag,s]));for(let s of this.bones)if(s.parent=s.parentName==null?-1:typeof s.parentName=="number"?s.parentName:this.byName.get(s.parentName)?.index??-1,s.parentName!=null&&s.parent<0)throw new Error(`skeleton ${this.id}: parent '${s.parentName}' of ${s.name} not found`);this.order=[];let t=new Set,i=s=>{t.has(s.index)||(s.parent>=0&&i(this.bones[s.parent]),t.add(s.index),this.order.push(s.index))};this.bones.forEach(i),this.children=this.bones.map(()=>[]);for(let s of this.bones)s.parent>=0&&this.children[s.parent].push(s.index);this.restP=new Array(this.bones.length),this.restQ=new Array(this.bones.length);for(let s of this.order){let r=this.bones[s];r.parent<0?(this.restP[s]=r.t.slice(),this.restQ[s]=r.r.slice()):(this.restP[s]=Ue(this.restP[r.parent],De(this.restQ[r.parent],r.t)),this.restQ[s]=Te(Ce(this.restQ[r.parent],r.r)))}this.groundZ=this.calib.groundZ??this._inferGroundZ(),this.limbs={};for(let s of["L","R"]){let r=He.side[s];this.limbs["arm"+s]=this._limb(s,r.upper,r.lower,r.hand,"arm"),this.limbs["leg"+s]=this._limb(s,r.thigh,r.calf,r.foot,"leg"),this.limbs["hand"+s]=this._handFrame(s)}}has(e){return this.byName.has(e)}idx(e){let t=this.byName.get(e);if(!t)throw new Error(`skeleton ${this.id}: bone '${e}' missing`);return t.index}restPos(e){return this.restP[this.idx(e)]}restRot(e){return this.restQ[this.idx(e)]}len(e,t){return Tt(Ne(this.restPos(t),this.restPos(e)))}height(){return this.restPos(He.head)[2]+.12-this.groundZ}_inferGroundZ(){let e=1/0;for(let t of["SKEL_L_Toe0","SKEL_R_Toe0","SKEL_L_Foot","SKEL_R_Foot"])this.has(t)&&(e=Math.min(e,this.restPos(t)[2]-(t.includes("Toe")?.025:.085)));return Number.isFinite(e)?e:-1}_limb(e,t,i,s,r){if(!this.has(t)||!this.has(i)||!this.has(s))return null;let a=this.restPos(t),o=this.restPos(i),c=this.restPos(s),h=Xe(Ne(o,a)),l=Xe(Ne(c,o)),u=Tt(Ne(o,a)),d=Tt(Ne(c,o)),p=null,g=this.calib.hinges?.[t];if(g&&(p=Xe(De(this.restRot(t),g))),!p){let f=Pt(h,l);Tt(f)>Math.sin(3*Math.PI/180)&&(p=Xe(f))}p||(p=Xe(Pt(r==="arm"?[0,-1,0]:[0,1,0],h)),Tt(p)<1e-6&&(p=Lr(h)));let _=Xe(hi(p,h)),m=Xe(hi(p,l));return{side:e,kind:r,upper:t,lower:i,end:s,l1:u,l2:d,dirU:h,dirL:l,hingeU:_,hingeL:m}}_handFrame(e){let t=He.side[e];if(!this.has(t.hand))return null;let i=this.restPos(t.hand),s=g=>this.has(t.fingers[g][0])?this.restPos(t.fingers[g][0]):null,r=s(1),a=s(2),o=s(4),c=a?Xe(Ne(a,i)):this.limbs["arm"+e]?.dirL??[e==="L"?-1:1,0,0],h=r&&o?Xe(Ne(r,o)):Lr(c);h=Xe(hi(h,c));let l=e==="R"?1:-1,u=ut(Xe(Pt(c,h)),l),d=ut(u,-1),p=Xe(Pt(c,d));return{side:e,fwd:c,across:h,back:u,palm:d,flexAxis:p,wrist:i}}fingerAxis(e,t){let i=this.limbs["hand"+e],s=this.idx(t),r=this.children[s],a=r.length?this.restP[r[0]]:Ue(this.restP[s],Ne(this.restP[s],this.restP[this.bones[s].parent])),o=Xe(Ne(a,this.restP[s])),c=Pt(o,i.palm);return Tt(c)<1e-6&&(c=i.flexAxis),Xe(c)}toJSON(){return{id:this.id,model:this.model,source:this.source,calib:this.calib,bones:this.bones.map(e=>({name:e.name,tag:e.tag,parent:e.parentName,t:e.t,r:e.r}))}}};function Uh(n,e){let t=new Array(n.bones.length);for(let i of n.order){let s=n.bones[i].parent;t[i]=s<0?e[i].slice():Te(Ce(ht(e[s]),e[i]))}return t}var Gf={SKEL_ROOT:0,SKEL_Pelvis:11816,SKEL_Spine_Root:57597,SKEL_L_Thigh:58271,SKEL_L_Calf:63931,SKEL_L_Foot:14201,SKEL_L_Toe0:2108,SKEL_R_Thigh:51826,SKEL_R_Calf:36864,SKEL_R_Foot:52301,SKEL_R_Toe0:20781,SKEL_Spine0:23553,SKEL_Spine1:24816,SKEL_Spine2:24817,SKEL_Spine3:24818,SKEL_L_Clavicle:64729,SKEL_L_UpperArm:45509,SKEL_L_Forearm:61163,SKEL_L_Hand:18905,SKEL_L_Finger00:26610,SKEL_L_Finger01:4089,SKEL_L_Finger02:4090,SKEL_L_Finger10:26611,SKEL_L_Finger11:4169,SKEL_L_Finger12:4170,SKEL_L_Finger20:26612,SKEL_L_Finger21:4185,SKEL_L_Finger22:4186,SKEL_L_Finger30:26613,SKEL_L_Finger31:4137,SKEL_L_Finger32:4138,SKEL_L_Finger40:26614,SKEL_L_Finger41:4153,SKEL_L_Finger42:4154,SKEL_R_Clavicle:10706,SKEL_R_UpperArm:40269,SKEL_R_Forearm:28252,SKEL_R_Hand:57005,SKEL_R_Finger00:58866,SKEL_R_Finger01:64016,SKEL_R_Finger02:64017,SKEL_R_Finger10:58867,SKEL_R_Finger11:64096,SKEL_R_Finger12:64097,SKEL_R_Finger20:58868,SKEL_R_Finger21:64112,SKEL_R_Finger22:64113,SKEL_R_Finger30:58869,SKEL_R_Finger31:64064,SKEL_R_Finger32:64065,SKEL_R_Finger40:58870,SKEL_R_Finger41:64080,SKEL_R_Finger42:64081,SKEL_Neck_1:39317,SKEL_Head:31086};function Wf(n){let e={},t=(r,a,o)=>{e[r]={parent:a,pos:o}},i=n.scale;t("SKEL_ROOT",null,[0,0,0]),t("SKEL_Pelvis","SKEL_ROOT",[0,0,n.pelvisZ]),t("SKEL_Spine_Root","SKEL_ROOT",[0,0,n.pelvisZ]);let s=[.05,.16,.28,.41].map(r=>r*i+n.pelvisZ);t("SKEL_Spine0","SKEL_Spine_Root",[0,-.005,s[0]]),t("SKEL_Spine1","SKEL_Spine0",[0,-.012,s[1]]),t("SKEL_Spine2","SKEL_Spine1",[0,-.01,s[2]]),t("SKEL_Spine3","SKEL_Spine2",[0,0,s[3]]),t("SKEL_Neck_1","SKEL_Spine3",[0,.012,n.pelvisZ+.545*i]),t("SKEL_Head","SKEL_Neck_1",[0,.022,n.pelvisZ+.645*i]);for(let r of["L","R"]){let a=r==="R"?1:-1,o=[a*n.hipW,0,n.pelvisZ-.06*i],c=o[2]-n.thigh,h=[a*(n.hipW-.005),.012,c],l=[a*(n.hipW-.01),-.01,c-n.shin];t(`SKEL_${r}_Thigh`,"SKEL_Pelvis",o),t(`SKEL_${r}_Calf`,`SKEL_${r}_Thigh`,h),t(`SKEL_${r}_Foot`,`SKEL_${r}_Calf`,l),t(`SKEL_${r}_Toe0`,`SKEL_${r}_Foot`,[l[0]+a*.01,l[1]+n.foot,n.groundZ+.025]);let u=[a*.03,.035,n.pelvisZ+.5*i],d=[a*n.shoulderW,-.005,n.pelvisZ+.475*i],p=n.armDown*ze,g=[a*Math.cos(p),0,-Math.sin(p)],_=Xe(Pt([0,-1,0],g)),m=De(dt(_,6*ze),g),f=Ue(d,ut(g,n.upperArm)),S=Ue(f,ut(m,n.foreArm));t(`SKEL_${r}_Clavicle`,"SKEL_Spine3",u),t(`SKEL_${r}_UpperArm`,`SKEL_${r}_Clavicle`,d),t(`SKEL_${r}_Forearm`,`SKEL_${r}_UpperArm`,f),t(`SKEL_${r}_Hand`,`SKEL_${r}_Forearm`,S);let v=Xe([-a*Math.sin(p),0,-Math.cos(p)]),M=[0,1,0],E=[{k:0,along:.025,acr:.028,pal:.012,segs:[.042,.032,.028],thumb:!0},{k:1,along:.088,acr:.022,pal:0,segs:[.044,.026,.021]},{k:2,along:.092,acr:.003,pal:0,segs:[.048,.03,.022]},{k:3,along:.088,acr:-.016,pal:0,segs:[.044,.028,.021]},{k:4,along:.08,acr:-.032,pal:.002,segs:[.034,.021,.019]}];for(let C of E){let R=n.handScale,P=Ue(S,Ue(ut(m,C.along*R),Ue(ut(M,C.acr*R),ut(v,C.pal*R)))),N=C.thumb?Xe(Ue(ut(m,.55),Ue(ut(M,.75),ut(v,.35)))):m,y=`SKEL_${r}_Hand`;for(let w=0;w<3;w++){let F=`SKEL_${r}_Finger${C.k}${w}`;t(F,y,P),y=F,P=Ue(P,ut(N,C.segs[w]*R))}}}return e}function Kf(n,e,t,i,s=()=>[0,0,0,1]){let r=[],a={};for(let[o,c]of Object.entries(t))a[o]=Te(s(o));for(let[o,c]of Object.entries(t)){let h,l;if(!c.parent)h=c.pos.slice(),l=a[o];else{let u=a[c.parent];h=De(ht(u),Ne(c.pos,t[c.parent].pos)),l=Te(Ce(ht(u),a[o]))}r.push({name:o,tag:Gf[o],parent:c.parent,t:h.map(u=>+u.toFixed(6)),r:l.map(u=>+u.toFixed(7))})}return{id:n,model:e,source:"placeholder",note:"PLACEHOLDER: approximate proportions, not the GTA rest pose. Replace via animkit import-skeleton.",calib:{groundZ:i},bones:r}}var Zs={male:{scale:1,pelvisZ:0,hipW:.095,thigh:.44,shin:.43,foot:.135,shoulderW:.185,upperArm:.29,foreArm:.255,handScale:1,armDown:42,groundZ:-.98},female:{scale:.94,pelvisZ:-.045,hipW:.098,thigh:.415,shin:.405,foot:.12,shoulderW:.165,upperArm:.265,foreArm:.235,handScale:.9,armDown:42,groundZ:-.98}};Zs.female.pelvisZ=Zs.female.groundZ+.08+.405+.415+.06*.94;Zs.male.pelvisZ=Zs.male.groundZ+.08+.43+.44+.06;function Nh(n,e){let t=Zs[n==="female"?"female":"male"],i=Wf(t),s=n==="female"?"mp_f_freemode_01":n==="zombie"?"u_m_y_zombie_01":"mp_m_freemode_01";return Kf(`placeholder_${n}`,s,i,t.groundZ,e)}var $f=n=>n===null?"null":Array.isArray(n)?"array":typeof n=="number"?Number.isInteger(n)?"integer":"number":typeof n,Xf=(n,e)=>e==="number"?typeof n=="number"&&Number.isFinite(n):e==="integer"?Number.isInteger(n):$f(n)===e;function Fh(n,e,{max:t=50}={}){let i=[],s=new Map,r=h=>(s.has(h)||s.set(h,new RegExp(h,"u")),s.get(h)),a=h=>{if(!h.startsWith("#/"))throw new Error(`unsupported $ref ${h}`);return h.slice(2).split("/").reduce((l,u)=>l[u],n)},o=(h,l,u)=>{i.length<t&&i.push({path:h,keyword:l,message:u})},c=(h,l,u)=>{if(!(i.length>=t||h===!0||h==null)){if(h===!1){o(u,"false","not allowed");return}if(h.$ref){c(a(h.$ref),l,u);return}if("const"in h&&l!==h.const){o(u,"const",`must be ${JSON.stringify(h.const)}`);return}if(h.enum&&!h.enum.includes(l)){o(u,"enum",`must be one of ${h.enum.join(", ")}`);return}if(h.type){let d=[].concat(h.type);if(!d.some(p=>Xf(l,p))){o(u,"type",`must be ${d.join("|")}`);return}}if(typeof l=="number"&&(h.minimum!=null&&l<h.minimum&&o(u,"minimum",`must be >= ${h.minimum}`),h.maximum!=null&&l>h.maximum&&o(u,"maximum",`must be <= ${h.maximum}`)),typeof l=="string"&&(h.minLength!=null&&l.length<h.minLength&&o(u,"minLength","too short"),h.maxLength!=null&&l.length>h.maxLength&&o(u,"maxLength",`longer than ${h.maxLength}`),h.pattern&&!r(h.pattern).test(l)&&o(u,"pattern",`does not match ${h.pattern}`)),Array.isArray(l)){if(h.minItems!=null&&l.length<h.minItems&&o(u,"minItems",`needs at least ${h.minItems} items`),h.maxItems!=null&&l.length>h.maxItems){o(u,"maxItems",`more than ${h.maxItems} items`);return}h.items&&l.forEach((d,p)=>c(h.items,d,`${u}[${p}]`))}if(l&&typeof l=="object"&&!Array.isArray(l)){let d=Object.keys(l);if(h.minProperties!=null&&d.length<h.minProperties&&o(u,"minProperties",`needs at least ${h.minProperties} entries`),h.maxProperties!=null&&d.length>h.maxProperties){o(u,"maxProperties",`more than ${h.maxProperties} entries`);return}for(let p of h.required||[])p in l||o(u,"required",`missing '${p}'`);for(let p of d){let g=u?`${u}.${p}`:p;h.propertyNames&&c(h.propertyNames,p,`${g} (name)`),h.properties&&p in h.properties?c(h.properties[p],l[p],g):h.additionalProperties===!1?o(g,"additionalProperties","unknown field"):h.additionalProperties&&typeof h.additionalProperties=="object"&&c(h.additionalProperties,l[p],g)}}}};return c(n,e,""),i}var Oh={$schema:"https://json-schema.org/draft/2020-12/schema",$id:"https://jj-scripts.local/schema/jj-anim-1.schema.json",title:"jj-anim/1 clip document",description:"One animation (single actor or pair) as keyframes. Written by the in-game studio (jj_animstudio) and by hand/code; converted by animkit into a GTA V .ycd. See jj_animstudio/docs/FORMAT.md.",type:"object",required:["format","name","type","duration","actors","tracks"],additionalProperties:!1,properties:{format:{const:"jj-anim/1"},name:{$ref:"#/$defs/name"},title:{type:"string",maxLength:80},type:{enum:["single","pair"]},dict:{$ref:"#/$defs/name"},fps:{const:30},duration:{type:"number",minimum:.1,maximum:30},loop:{type:"boolean"},loopMover:{enum:["closed","travel"]},notes:{type:"string",maxLength:4e3},targetResource:{type:"string",pattern:"^[A-Za-z0-9_\\-]{0,64}$"},actors:{type:"object",minProperties:1,maxProperties:2,propertyNames:{$ref:"#/$defs/actorId"},additionalProperties:{$ref:"#/$defs/actor"}},tracks:{type:"object",maxProperties:2,propertyNames:{$ref:"#/$defs/actorId"},additionalProperties:{$ref:"#/$defs/actorTracks"}},contacts:{type:"array",maxItems:16,items:{$ref:"#/$defs/contact"}},events:{type:"array",maxItems:32,items:{$ref:"#/$defs/event"}},limits:{type:"object",maxProperties:32,additionalProperties:{type:"number",minimum:0,maximum:1e5}},editor:{type:"object"}},$defs:{name:{type:"string",pattern:"^[a-z0-9_]{1,40}$"},actorId:{type:"string",pattern:"^[a-z][a-z0-9_]{0,15}$"},num:{type:"number",minimum:-1e3,maximum:1e3},vec3:{type:"array",minItems:3,maxItems:3,items:{$ref:"#/$defs/num"}},time:{type:"number",minimum:0,maximum:30},ease:{enum:["smooth","fastIn","fastOut","linear","spring","step"]},weight:{type:"number",minimum:0,maximum:1},actor:{type:"object",additionalProperties:!1,required:["model"],properties:{model:{type:"string",pattern:"^[a-z0-9_]{1,40}$"},skeleton:{enum:["male","female","zombie"]},label:{type:"string",maxLength:32}}},moverKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},p:{$ref:"#/$defs/vec3"},yaw:{$ref:"#/$defs/num"}}},rootKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},p:{$ref:"#/$defs/vec3"},rot:{$ref:"#/$defs/vec3"}}},boneKey:{type:"object",additionalProperties:!1,required:["t","rot"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},rot:{$ref:"#/$defs/vec3"}}},ikKey:{type:"object",additionalProperties:!1,required:["t","target"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},target:{$ref:"#/$defs/vec3"},space:{enum:["body","scene"]},pole:{$ref:"#/$defs/vec3"},weight:{$ref:"#/$defs/weight"},yaw:{$ref:"#/$defs/num"},pitch:{$ref:"#/$defs/num"},roll:{$ref:"#/$defs/num"}}},fingerKey:{type:"object",additionalProperties:!1,required:["t"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},preset:{enum:["relaxed","fist","open","grab","point","claw"]},curl:{type:"number",minimum:0,maximum:1.5},spread:{type:"number",minimum:-1,maximum:1}}},lookKey:{type:"object",additionalProperties:!1,required:["t","target"],properties:{t:{$ref:"#/$defs/time"},ease:{$ref:"#/$defs/ease"},target:{$ref:"#/$defs/vec3"},space:{enum:["body","scene"]},weight:{$ref:"#/$defs/weight"}}},range:{type:"array",minItems:2,maxItems:2,items:{$ref:"#/$defs/time"}},actorTracks:{type:"object",additionalProperties:!1,properties:{mover:{type:"array",maxItems:600,items:{$ref:"#/$defs/moverKey"}},root:{type:"array",maxItems:600,items:{$ref:"#/$defs/rootKey"}},bones:{type:"object",maxProperties:80,propertyNames:{type:"string",pattern:"^SKEL_[A-Za-z0-9_]{1,30}$"},additionalProperties:{type:"array",maxItems:600,items:{$ref:"#/$defs/boneKey"}}},ik:{type:"object",additionalProperties:!1,properties:{handL:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},handR:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},footL:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}},footR:{type:"array",maxItems:600,items:{$ref:"#/$defs/ikKey"}}}},fingers:{type:"object",additionalProperties:!1,properties:{L:{type:"array",maxItems:600,items:{$ref:"#/$defs/fingerKey"}},R:{type:"array",maxItems:600,items:{$ref:"#/$defs/fingerKey"}}}},look:{type:"array",maxItems:600,items:{$ref:"#/$defs/lookKey"}},feet:{type:"object",additionalProperties:!1,properties:{lock:{type:"object",additionalProperties:!1,properties:{L:{type:"array",maxItems:32,items:{$ref:"#/$defs/range"}},R:{type:"array",maxItems:32,items:{$ref:"#/$defs/range"}}}}}}}},endpoint:{type:"string",pattern:"^[a-z][a-z0-9_]{0,15}\\.(handL|handR|footL|footR|head|pelvis|SKEL_[A-Za-z0-9_]{1,30})$"},contact:{type:"object",additionalProperties:!1,required:["from","to","t"],properties:{id:{type:"string",pattern:"^[a-z0-9_]{1,24}$"},from:{$ref:"#/$defs/endpoint"},to:{$ref:"#/$defs/endpoint"},offset:{$ref:"#/$defs/vec3"},t:{$ref:"#/$defs/range"},stick:{type:"boolean"},max:{type:"number",minimum:.001,maximum:.5}}},event:{type:"object",additionalProperties:!1,required:["name","t"],properties:{name:{type:"string",pattern:"^[a-z0-9_]{1,24}$"},t:{$ref:"#/$defs/time"},duration:{type:"number",minimum:0,maximum:30}}}}};var Ea="jj-anim/1",Bh=30,vy=2*1024*1024;var cn={handL:"SKEL_L_Hand",handR:"SKEL_R_Hand",footL:"SKEL_L_Foot",footR:"SKEL_R_Foot",head:"SKEL_Head",pelvis:"SKEL_Pelvis"},Yf=["handL","handR","footL","footR"];var Zf={json_invalid:n=>`Die Datei ist kein g\xFCltiges JSON (${n}).`,too_large:n=>`Das Projekt ist zu gro\xDF (${n}). Erlaubt sind h\xF6chstens 2 MB.`,version_unsupported:n=>`Unbekannte Format-Version "${n}". Erwartet wird "${Ea}".`,schema:n=>`Ung\xFCltiger Eintrag: ${n}.`,name_invalid:n=>`Ung\xFCltiger Name "${n}". Erlaubt sind nur Kleinbuchstaben, Ziffern und _ (h\xF6chstens 40 Zeichen).`,actor_count:n=>`Falsche Anzahl Akteure: ${n}.`,actor_unknown:n=>`Spur f\xFCr unbekannten Akteur "${n}".`,unknown_bone:n=>`Unbekannter Knochen "${n}" (gibt es im Skelett nicht).`,time_range:n=>`Zeitpunkt au\xDFerhalb der Animation: ${n}.`,duplicate_key:n=>`Zwei Keyframes zur selben Zeit: ${n}.`,contact_invalid:n=>`Ung\xFCltiger Kontakt: ${n}.`,range_invalid:n=>`Ung\xFCltiger Bereich: ${n}.`};function It(n,e,t){return{code:n,path:e,msg:(Zf[n]||(i=>i))(t)}}function zh(n){if(!n||typeof n!="object"||Array.isArray(n))return{errors:[It("schema","","Dokument muss ein Objekt sein")]};let e=[],t=JSON.parse(JSON.stringify(n));if(t.format!==Ea)return{errors:[It("version_unsupported","format",String(t.format??"(fehlt)").slice(0,40))]};t.fps==null&&(t.fps=Bh),t.loop==null&&(t.loop=!1),t.type==null&&t.actors&&typeof t.actors=="object"&&(t.type=Object.keys(t.actors).length>1?"pair":"single",e.push("type"));for(let i of Object.values(t.tracks&&typeof t.tracks=="object"?t.tracks:{}))if(!(!i||typeof i!="object")&&(i.lookAt&&!i.look&&(i.look=i.lookAt,delete i.lookAt,e.push("lookAt -> look")),i.feet&&Array.isArray(i.feet.lock))){let s=i.feet.lock;i.feet.lock={L:s.map(r=>r.slice()),R:s.map(r=>r.slice())},e.push("feet.lock -> {L,R}")}for(let i of Object.values(t.actors&&typeof t.actors=="object"?t.actors:{}))i&&!i.model&&typeof i.skeleton=="string"&&/_/.test(i.skeleton)&&(i.model=i.skeleton,delete i.skeleton,e.push("actor.skeleton(model) -> model"));return{doc:t,migrated:e}}var jf=n=>typeof n=="number"&&Number.isFinite(n);function Hh(n,{skeletonsFor:e=null}={}){let t=[];for(let o of Fh(Oh,n))o.path==="name"||/\.name$/.test(o.path)&&o.keyword==="pattern"?t.push(It("name_invalid",o.path,String(Jf(n,o.path)).slice(0,60))):t.push(It("schema",o.path,`${o.path||"Dokument"}: ${o.message}`));if(t.length)return t;let i=Object.keys(n.actors);n.type==="single"&&i.length!==1&&t.push(It("actor_count","actors",`Einzel-Animation braucht genau 1 Akteur, hat ${i.length}`)),n.type==="pair"&&i.length!==2&&t.push(It("actor_count","actors",`Paar-Animation braucht genau 2 Akteure, hat ${i.length}`));let s=n.duration+1e-6,r=(o,c)=>{(!jf(o)||o<0||o>s)&&t.push(It("time_range",c,`${c} = ${o} s (Dauer ${n.duration} s)`))},a=(o,c)=>{let h=new Set;(o||[]).forEach((l,u)=>{r(l.t,`${c}[${u}].t`);let d=Math.round(l.t*1e3);h.has(d)&&t.push(It("duplicate_key",`${c}[${u}]`,`${c} bei ${l.t.toFixed(3)} s`)),h.add(d)})};for(let[o,c]of Object.entries(n.tracks)){if(!n.actors[o]){t.push(It("actor_unknown",`tracks.${o}`,o));continue}let h=e?e(o):null;a(c.mover,`tracks.${o}.mover`),a(c.root,`tracks.${o}.root`),a(c.look,`tracks.${o}.look`);for(let[l,u]of Object.entries(c.bones||{}))l==="SKEL_ROOT"?t.push(It("schema",`tracks.${o}.bones.SKEL_ROOT`,'SKEL_ROOT wird \xFCber die Spur "root" gedreht')):h&&!h.has(l)&&t.push(It("unknown_bone",`tracks.${o}.bones.${l}`,l)),a(u,`tracks.${o}.bones.${l}`);for(let[l,u]of Object.entries(c.ik||{}))a(u,`tracks.${o}.ik.${l}`);for(let[l,u]of Object.entries(c.fingers||{}))a(u,`tracks.${o}.fingers.${l}`);for(let[l,u]of Object.entries(c.feet?.lock||{})){let d=u.slice().sort((p,g)=>p[0]-g[0]);d.forEach((p,g)=>{r(p[0],`tracks.${o}.feet.lock.${l}[${g}]`),r(p[1],`tracks.${o}.feet.lock.${l}[${g}]`),p[1]>p[0]||t.push(It("range_invalid",`tracks.${o}.feet.lock.${l}[${g}]`,`Fu\xDF ${l}: Ende muss nach dem Anfang liegen`)),g>0&&p[0]<d[g-1][1]&&t.push(It("range_invalid",`tracks.${o}.feet.lock.${l}`,`Fu\xDF ${l}: Bereiche \xFCberlappen`))})}}return(n.contacts||[]).forEach((o,c)=>{let h=`contacts[${c}]`,[l,u]=o.from.split("."),[d,p]=o.to.split(".");n.actors[l]||t.push(It("contact_invalid",h,`unbekannter Akteur "${l}"`)),n.actors[d]||t.push(It("contact_invalid",h,`unbekannter Akteur "${d}"`)),o.from===o.to&&t.push(It("contact_invalid",h,"Start und Ziel sind gleich")),o.stick&&!Yf.includes(u)&&t.push(It("contact_invalid",h,"festkleben geht nur mit einer Hand oder einem Fu\xDF als Start"));for(let[g,_]of[[l,u],[d,p]]){let m=e&&n.actors[g]?e(g):null,f=cn[_]||_;m&&!m.has(f)&&t.push(It("unknown_bone",h,f))}r(o.t[0],`${h}.t`),r(o.t[1],`${h}.t`),o.t[1]>o.t[0]||t.push(It("range_invalid",`${h}.t`,"Kontakt: Ende muss nach dem Anfang liegen"))}),(n.events||[]).forEach((o,c)=>r(o.t,`events[${c}].t`)),t}function Jf(n,e){return e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean).reduce((t,i)=>t==null?t:t[i],n)}function On(n){let e=n.indexOf("."),t=n.slice(0,e),i=n.slice(e+1);return{actor:t,handle:i,bone:cn[i]||i}}function Vh({name:n,type:e="single",duration:t=2,models:i={}}={}){let s=e==="pair"?{a:{model:i.a||"mp_m_freemode_01",label:"Akteur A"},b:{model:i.b||"mp_m_freemode_01",label:"Akteur B"}}:{a:{model:i.a||"mp_m_freemode_01",label:"Akteur A"}},r={a:{mover:[{t:0,p:[0,0,0],yaw:0}]}};return e==="pair"&&(r.b={mover:[{t:0,p:[0,.9,0],yaw:180}]}),{format:Ea,name:n,type:e,fps:Bh,duration:t,loop:!1,actors:s,tracks:r,contacts:[],events:[],notes:""}}var Qf=[1,0,0],ep=[0,1,0],tp=[0,0,1],np=n=>[n[0],-n[1],-n[2]],kr={SKEL_ROOT:null,SKEL_Pelvis:[[-30,30],[-30,30],[-40,40]],SKEL_Spine_Root:[[-25,35],[-20,20],[-25,25]],SKEL_Spine0:[[-25,35],[-20,20],[-25,25]],SKEL_Spine1:[[-25,35],[-20,20],[-25,25]],SKEL_Spine2:[[-25,35],[-20,20],[-25,25]],SKEL_Spine3:[[-25,35],[-20,20],[-25,25]],SKEL_Neck_1:[[-45,45],[-30,30],[-45,45]],SKEL_Neck_2:[[-30,30],[-20,20],[-30,30]],SKEL_Head:[[-45,45],[-35,35],[-60,60]],clav:[[-15,15],[-20,20],[-25,25]],upper:[[-120,120],[-110,110],[-110,110]],lower:[[-5,150],[-85,85],[-8,8]],hand:[[-80,80],[-60,60],[-35,35]],thigh:[[-35,125],[-50,25],[-45,45]],calf:[[-3,150],[-20,20],[-5,5]],foot:[[-50,50],[-30,30],[-35,35]],toe:[[-60,40],[-5,5],[-5,5]],finger:[[-20,110],[-15,15],[-25,25]],thumb:[[-30,90],[-40,40],[-40,40]]},Ur={centre:["Nicken","Kippen","Drehen"],limb:["Heben vor/zur\xFCck","Kippen","Drehen"],hinge:["Beugen","Verdrehen","Seitlich"],hand:["Beugen","Verdrehen","Abknicken"],finger:["Kr\xFCmmen","Verdrehen","Spreizen"]};function Ui(n){let e=/^SKEL_([LR])_/.exec(n);return e?e[1]:null}function Nr(n){let e=Ui(n);return e?n.replace(`SKEL_${e}_`,`SKEL_${e==="L"?"R":"L"}_`):n}function Kh(n){if(/Finger0\d$/.test(n))return"thumb";if(/Finger\d\d$/.test(n))return"finger";let e=/^SKEL_[LR]_(\w+)$/.exec(n);return e&&{Clavicle:"clav",UpperArm:"upper",Forearm:"lower",Hand:"hand",Thigh:"thigh",Calf:"calf",Foot:"foot",Toe0:"toe"}[e[1]]||"centre"}function Gh(n,e){let t=Kh(e);if(t==="lower"||t==="calf"){let i=n.limbs[t==="lower"?"armR":"legR"];if(i){let s=i.hingeL,r=i.dirL;return{kind:"hinge",axes:[s,r,Xe(Pt(s,r))]}}}if(t==="hand"){let i=n.limbs.handR;if(i)return{kind:"hand",axes:[i.flexAxis,i.fwd,i.back]}}if((t==="finger"||t==="thumb")&&n.limbs.handR&&n.has(e)){let i=n.fingerAxis("R",e),s=n.idx(e),r=n.children[s],a=r.length?n.restP[r[0]]:Ne(ut(n.restP[s],2),n.restP[n.bones[s].parent]),o=Xe(Ne(a,n.restP[s]));return o=Xe(Ne(o,ut(i,an(o,i)))),{kind:"finger",axes:[i,o,Xe(Pt(i,o))]}}return{kind:t==="centre"?"centre":"limb",axes:[Qf,ep,tp]}}var Wh=new WeakMap;function Ni(n,e){let t=Wh.get(n);if(t||(t=new Map,Wh.set(n,t)),t.has(e))return t.get(e);let i=Ui(e),s=i==="L"?Nr(e):e,r=n.has(s)?Gh(n,s):Gh(n,e);i==="L"&&(r={kind:r.kind,axes:r.axes.map(np)});let a=Kh(e),o=a==="centre"?e in kr?kr[e]:kr.SKEL_Spine2:kr[a],c={...r,limits:o||null,labels:Ur[r.kind]||Ur.centre};return t.set(e,c),c}function Aa(n,e,t){let{axes:i}=Ni(n,e),s=[0,0,0];for(let r=0;r<3;r++)for(let a=0;a<3;a++)s[a]+=i[r][a]*(t[r]||0)*ze;return Dh(s)}function js(n,e,t){let{limits:i}=Ni(n,e);if(!i)return{rot:t.slice(),clamped:!1};let s=!1;return{rot:t.map((a,o)=>{let c=Mt(a,i[o][0],i[o][1]);return Math.abs(c-a)>1e-6&&(s=!0),c}),clamped:s}}function $h(n,e,t){let{limits:i}=Ni(n,e);if(!i)return 0;let s=0;for(let r=0;r<3;r++)s=Math.max(s,i[r][0]-t[r],t[r]-i[r][1]);return Math.max(0,s)}function Fr(n,e){return Ui(n)?e.slice():[e[0],-e[1],-e[2]]}function Xh(n){let e=[He.root,He.pelvis,He.spineRoot,...He.spine,He.neck,"SKEL_Neck_2",He.head];for(let t of["L","R"]){let i=He.side[t];e.push(i.clav,i.upper,i.lower,i.hand,i.thigh,i.calf,i.foot,i.toe,...i.fingers.flat())}return e.filter(t=>n.has(t))}var ip=n=>JSON.parse(JSON.stringify(n)),Js=n=>+(+n).toFixed(3);function sp(n){let e=n.map(i=>i.slice()).sort((i,s)=>i[0]-s[0]),t=[];for(let i of e)t.length&&i[0]<=t[t.length-1][1]+1e-6?t[t.length-1][1]=Math.max(t[t.length-1][1],i[1]):t.push(i);return t}function Ta(n,e){let t=n.findIndex(i=>Math.abs(i.t-e.t)<.001);return t>=0?n[t]={...n[t],...e}:(n.push(e),n.sort((i,s)=>i.t-s.t)),n}function qh(n,e){let t=n.slice().sort((l,u)=>l.t-u.t);if(!t.length)return{p:[0,0,0],rot:[0,0,0]};let i=t[0],s=t[0];if(e>=t[t.length-1].t)i=s=t[t.length-1];else for(let l=1;l<t.length;l++)if(e<=t[l].t){i=t[l-1],s=t[l];break}let r=s.t>i.t?Mt((e-i.t)/(s.t-i.t),0,1):0,a=i.p||[0,0,0],o=s.p||a,c=i.rot||[0,0,0],h=s.rot||c;return{p:a.map((l,u)=>l+(o[u]-l)*r),rot:c.map((l,u)=>l+(h[u]-l)*r)}}function rp(n,e){let t=n.skeletons[e],i=["L","R"].map(s=>({a:t.idx(He.side[s].foot),t:t.has(He.side[s].toe)?t.idx(He.side[s].toe):-1}));return n.frames[e].map(s=>{let r=t.groundZ+s.mover.p[2],a=0;for(let o of i)a=Math.max(a,-(s.world.P[o.a][2]-(r+.085))),o.t>=0&&(a=Math.max(a,-(s.world.P[o.t][2]-(r+.025))));return a})}function Yh(n,e,{sampled:t}={}){let i=ip(n),s=e.actor?i.tracks[e.actor]||={}:null;switch(e.kind){case"lockFeet":{s.feet||={},s.feet.lock||={};let r=[Mt(Js(e.range[0]),0,i.duration),Mt(Js(e.range[1]),0,i.duration)];return r[1]-r[0]<.05&&(r[1]=Math.min(i.duration,r[0]+.1)),s.feet.lock[e.side]=sp([...s.feet.lock[e.side]||[],r]),i}case"snapGround":{let r="foot"+e.side,a=t?.skeletons?.[e.actor],o=(a?a.groundZ:-.993)+.085;if(s.ik?.[r]?.length){for(let f of s.ik[r])(f.space||"body")==="body"&&f.target[2]<o&&(f.target[2]=+o.toFixed(4));return i}let c=t?rp(t,e.actor):[];s.root||=[];let h=f=>qh(s.root,f),l=f=>Math.max(0,Math.min(c.length-1,Math.round(f*30))),u=.004;if(!c.length){let f=Mt(e.t??0,0,i.duration),S=h(f);return Ta(s.root,{t:Js(f),p:[S.p[0],S.p[1],+(S.p[2]+(e.depth||0)+u).toFixed(4)],rot:S.rot}),i}let d=0;for(let f=1;f<c.length;f++)c[f]>c[d]&&(d=f);let p=c.map(f=>f>.002);if(!s.root.length){let f=d,S=d;for(;f>0&&p[f-1];)f--;for(;S<c.length-1&&p[S+1];)S++;let v=Math.max(0,f-3)/30,M=Math.min(c.length-1,S+3)/30;for(let E of[v,M])Ta(s.root,{t:Js(E),p:[0,0,0],rot:[0,0,0]})}let g=s.root.map(f=>({...f,p:(f.p||[0,0,0]).slice()})),_=d/30,m=qh(g,_);for(let f of s.root){let S=c[l(f.t)];S>.001&&(f.p=[(f.p||[0,0,0])[0],(f.p||[0,0,0])[1],+((f.p||[0,0,0])[2]+S+u).toFixed(4)])}return s.root.some(f=>Math.abs(f.t-_)<.05)||Ta(s.root,{t:Js(_),p:[m.p[0],m.p[1],+(m.p[2]+c[d]+u).toFixed(4)],rot:m.rot}),i}case"clampJoints":{let r=t?.skeletons?.[e.actor];if(!r)return i;for(let[a,o]of Object.entries(s.bones||{}))if(!(e.bone&&e.bone!==a&&e.all!==!0)&&r.has(a))for(let c of o)c.rot=js(r,a,c.rot).rot.map(h=>+h.toFixed(2));return i}case"easeSmooth":{let r=o=>Math.abs(o.t-e.t)<=.35,a=o=>{for(let c of o||[])r(c)&&(c.ease="smooth")};a(s.mover),a(s.root),a(s.look);for(let o of Object.values(s.bones||{}))a(o);for(let o of Object.values(s.ik||{}))a(o);for(let o of Object.values(s.fingers||{}))a(o);return i}case"separate":{let r=Object.keys(i.actors).find(c=>c!==e.actor),a=[0,1,0];if(t&&r){let c=Math.round((e.t||0)*30),h=t.frames[e.actor][c].world.P[t.skeletons[e.actor].idx(He.pelvis)],l=t.frames[r][c].world.P[t.skeletons[r].idx(He.pelvis)],u=[h[0]-l[0],h[1]-l[1],0],d=Math.hypot(u[0],u[1]);d>1e-4&&(a=[u[0]/d,u[1]/d,0])}let o=e.dist||.02;s.mover||=[{t:0,p:[0,0,0],yaw:0}];for(let c of s.mover){let h=c.p||[0,0,0];c.p=[+(h[0]+a[0]*o).toFixed(4),+(h[1]+a[1]*o).toFixed(4),h[2]]}return i}case"stick":return i.contacts?.[e.index]&&(i.contacts[e.index].stick=!0),i;case"closeLoop":{let r=o=>o&&o.length>1?o.filter(c=>c.t<i.duration-.001):o;(i.loopMover||"closed")==="closed"&&(s.mover=r(s.mover)),s.root=r(s.root),s.look=r(s.look);for(let o of Object.keys(s.bones||{}))s.bones[o]=r(s.bones[o]);for(let o of Object.keys(s.ik||{}))s.ik[o]=r(s.ik[o]);for(let o of Object.keys(s.fingers||{}))s.fingers[o]=r(s.fingers[o]);return i.loop=!0,i}default:return i}}var op=[1,0,0],Qs=[0,1,0],Fi=[0,0,1];function Bn(n){if(!n)return Rt();let e=n.bend||0,t=n.side||0,i=n.twist||0;return Te(Ce(dt(Fi,i),Ce(dt(op,-e),dt(Qs,t))))}var Or={SKEL_Spine_Root:.08,SKEL_Spine0:.2,SKEL_Spine1:.26,SKEL_Spine2:.26,SKEL_Spine3:.2},Br={SKEL_Spine2:.45,SKEL_Spine3:.55};function zr(n,e){return n?{bend:(n.bend||0)*e,side:(n.side||0)*e,twist:(n.twist||0)*e}:null}function Ra(n,e){return n?e?{bend:(n.bend||0)+(e.bend||0),side:(n.side||0)+(e.side||0),twist:(n.twist||0)+(e.twist||0)}:n:e}var di=class{constructor(e){this.skel=e;let t=e;this.n=t.bones.length;let i=a=>t.has(a),s=0;for(let a of Object.keys(Or))i(a)&&(s+=Or[a]);this.spineW=new Map(Object.keys(Or).filter(i).map(a=>[a,Or[a]/s]));let r=0;for(let a of Object.keys(Br))i(a)&&(r+=Br[a]);this.chestW=new Map(Object.keys(Br).filter(i).map(a=>[a,Br[a]/(r||1)])),this.side={};for(let a of["L","R"]){let o=He.side[a],c=o.fingers.map(h=>h.filter(i).map(l=>({name:l,i:t.idx(l),axis:t.fingerAxis(a,l)})));this.side[a]={S:o,arm:t.limbs["arm"+a],leg:t.limbs["leg"+a],hand:t.limbs["hand"+a],fingers:c,clavI:i(o.clav)?t.idx(o.clav):-1,upperI:t.idx(o.upper),lowerI:t.idx(o.lower),handI:t.idx(o.hand),thighI:t.idx(o.thigh),calfI:t.idx(o.calf),footI:t.idx(o.foot),toeI:i(o.toe)?t.idx(o.toe):-1}}this.rootI=t.idx(He.root),this.neckI=i(He.neck)?t.idx(He.neck):-1,this.headI=t.idx(He.head),this.role=new Array(this.n).fill(null);for(let[a]of this.spineW)this.role[t.idx(a)]="spine";i(He.pelvis)&&(this.role[t.idx(He.pelvis)]="pelvis"),this.neckI>=0&&(this.role[this.neckI]="neck"),i("SKEL_Neck_2")&&(this.role[t.idx("SKEL_Neck_2")]="neck2"),this.role[this.headI]="head";for(let a of["L","R"]){let o=this.side[a];o.clavI>=0&&(this.role[o.clavI]="clav"+a),this.role[o.upperI]="upper"+a,this.role[o.lowerI]="lower"+a,this.role[o.handI]="hand"+a,this.role[o.thighI]="thigh"+a,this.role[o.calfI]="calf"+a,this.role[o.footI]="foot"+a,o.toeI>=0&&(this.role[o.toeI]="toe"+a),o.fingers.forEach((c,h)=>c.forEach((l,u)=>{this.role[l.i]=`finger${a}${h}${u}`}))}}solve(e={}){if(e.rootReach&&(e.rootReach.weight??1)>0){let t=e.rootReach,i=this._solve(e),s=this.skel.idx(t.bone),r=Te(Ce(i.mover.q,i.D[s])),a=Ue(Ue(i.mover.p,De(i.mover.q,i.P[s])),De(r,t.offset||[0,0,0])),o=ut(Ne(t.target,a),t.weight??1);t.axes&&(o=[o[0]*t.axes[0],o[1]*t.axes[1],o[2]*t.axes[2]]);let c=Tt(o),h=t.max??.25;c>h&&(o=ut(o,h/c));let l=De(ht(i.mover.q),o),u=e.root||{},d=u.p||[0,0,0],p=this._solve({...e,root:{...u,p:Ue(d,l)}});return p.reachOffset=o,p}return this._solve(e)}_solve(e){let t=this.skel;this.fades=[];let i=new Array(this.n),s=new Array(this.n),r=new Array(this.n),a={p:e.mover?.p?e.mover.p.slice():[0,0,0],q:dt(Fi,e.mover?.yaw||0)},o=ht(a.q),c=v=>De(o,Ne(v,a.p)),h=v=>De(o,v),l=e.spine||null,u=e.chest||null,d=e.neck||null,p=e.head||null,g={},_=e.bones||null,m=v=>_&&_[v]||null,f=(v,M,E)=>E>=1?M:E<=0?v:wa(v,M,E);for(let v of t.order){let M=t.bones[v],E=this.role[v],C=M.parent>=0?r[M.parent]:Rt(),R;if(v===this.rootI){r[v]=Bn(e.root),m(M.name)&&(r[v]=Te(Ce(r[v],m(M.name))));let N=e.root?.p||[0,0,0];i[v]=Ue(M.t,N),s[v]=Te(Ce(r[v],t.restQ[v]));continue}if(i[v]=Ue(i[M.parent],De(s[M.parent],M.t)),E==="spine"){let N=this.spineW.get(M.name)||0,y=this.chestW.get(M.name)||0;R=Bn(Ra(zr(l,N),zr(u,y)))}else if(E==="pelvis")R=Bn(e.pelvis);else if(E==="neck"||E==="neck2"||E==="head"){if(E==="neck"&&e.look&&e.look.target){let N=Ue(a.p,De(a.q,i[v])),y=Ne(e.look.target,N),w=h(y),F=De(ht(C),w),B=Math.atan2(-F[0],F[1]),W=Mt(B,-80*ze,80*ze),ee=Mt(Math.atan2(F[2],Math.hypot(F[0],F[1])),-55*ze,45*ze),V=(e.look.weight??1)*Mt((165*ze-Math.abs(B))/(45*ze),0,1),ie={bend:-ee*V,twist:W*V,side:0};d=Ra(d,zr(ie,.45)),p=Ra(p,zr(ie,.55))}R=E==="head"?Bn(p):E==="neck"?Bn(d):Rt()}else if(E&&E.startsWith("clav")){let N=E.slice(4),y=e.clav?.[N];if(y){let w=N==="R"?1:-1;R=Ce(dt(Qs,-w*(y.up||0)),dt(Fi,w*(y.fwd||0)))}else R=Rt()}else if(E&&E.startsWith("upper")){let N=E.slice(5),y=e.arm?.[N];if(y&&y.target&&(y.weight??1)>0){this._solveArm(N,y,i,C,a,c,h,g);let w=g["_w"+N]=y.weight??1,F=w<1?this._fkD(C,y?.fk?Bn(y.fk.shoulder):Rt(),m(M.name)):null;r[v]=f(F,g["upper"+N],w),s[v]=Te(Ce(r[v],t.restQ[v]));continue}R=y?.fk?Bn(y.fk.shoulder):Rt()}else if(E&&E.startsWith("lower")){let N=E.slice(5),y=e.arm?.[N],w=this.side[N].arm;if(g["lower"+N]){let F=g["_w"+N],B=F<1?this._fkD(C,y?.fk?.elbow?dt(w.hingeL,y.fk.elbow):Rt(),m(M.name)):null;r[v]=f(B,g["lower"+N],F),s[v]=Te(Ce(r[v],t.restQ[v]));continue}R=y?.fk?.elbow?dt(w.hingeL,y.fk.elbow):Rt()}else if(E&&E.startsWith("hand")){let N=E.slice(4);r[v]=this._handDelta(N,e.arm?.[N],C,a),m(M.name)&&(r[v]=Te(Ce(r[v],m(M.name)))),s[v]=Te(Ce(r[v],t.restQ[v]));continue}else if(E&&E.startsWith("thigh")){let N=E.slice(5),y=e.leg?.[N];if(y&&y.target&&(y.weight??1)>0){this._solveLeg(N,y,i,C,a,c,g);let w=g["_lw"+N]=y.weight??1,F=w<1?this._fkD(C,y?.fk?Bn(y.fk.hip):Rt(),m(M.name)):null;r[v]=f(F,g["thigh"+N],w),s[v]=Te(Ce(r[v],t.restQ[v]));continue}R=y?.fk?Bn(y.fk.hip):Rt()}else if(E&&E.startsWith("calf")){let N=E.slice(4),y=e.leg?.[N];if(g["calf"+N]){let w=g["_lw"+N],F=w<1?this._fkD(C,y?.fk?.knee?dt(this.side[N].leg.hingeL,y.fk.knee):Rt(),m(M.name)):null;r[v]=f(F,g["calf"+N],w),s[v]=Te(Ce(r[v],t.restQ[v]));continue}R=y?.fk?.knee?dt(this.side[N].leg.hingeL,y.fk.knee):Rt()}else if(E&&E.startsWith("foot")){let N=E.slice(4),y=e.leg?.[N];if(y&&(y.target||y.foot)&&(y.weight??1)>0){let w=y.weight??1;r[v]=f(w<1?this._fkD(C,Rt(),m(M.name)):null,this._footDelta(N,y,C,a),w),s[v]=Te(Ce(r[v],t.restQ[v]));continue}R=Rt()}else if(E&&E.startsWith("toe")){let N=E.slice(3),y=e.leg?.[N]?.toe||0,w=Xe(Pt(this._footFwdRest(N),Fi));R=dt(w,y)}else E&&E.startsWith("finger")?R=this._fingerDelta(E,e.arm?.[E[6]]?.fingers):R=Rt();let P=m(M.name);r[v]=Te(Ce(C,P?Ce(R,P):R)),s[v]=Te(Ce(r[v],t.restQ[v]))}let S=Uh(t,s);return{mover:a,rootT:i[this.rootI].slice(),P:i,Q:s,D:r,local:S,fades:this.fades}}_fkD(e,t,i){return Te(Ce(e,i?Ce(t,i):t))}_footFwdRest(e){let t=this.side[e];if(t.toeI<0)return Qs;let i=Ne(this.skel.restP[t.toeI],this.skel.restP[t.footI]);return Xe([i[0],i[1],0])}_solveArm(e,t,i,s,r,a,o,c){let h=this.side[e],l=h.arm,u=i[h.upperI],d=(v,M)=>M==="body"?v:M==="shoulder"?Ue(u,v):a(v),p;if(t.terms&&t.terms.length){p=[0,0,0];let v=0;for(let M of t.terms){let E=d(M.target,M.space);p=Ue(p,[E[0]*M.w,E[1]*M.w,E[2]*M.w]),v+=M.w}p=[p[0]/v,p[1]/v,p[2]/v]}else p=d(t.target,t.space);t.blend&&(t.blend.w??0)>0&&(p=ba(p,d(t.blend.target,t.blend.space),Math.min(1,t.blend.w)));let g=e==="R"?1:-1,_=t.pole?t.poleSpace==="scene"?o(t.pole):t.pole:[g*.45,-.75,-.5],m=this._twoBone(u,p,l.l1,l.l2,_,t.reach??.995);c["_armE"+e]=m.E;let f=Te(Ce(wn(m.u,m.h),ht(wn(l.dirU,l.hingeU)))),S=Te(Ce(wn(m.f,m.h),ht(wn(l.dirL,l.hingeL))));c["upper"+e]=f,c["lower"+e]=S}_solveLeg(e,t,i,s,r,a,o){let c=this.side[e],h=c.leg,l=i[c.thighI],u=t.space==="body"?t.target:a(t.target),d=this.skel.restP[c.footI],p=E=>{if(E==="toe"&&c.toeI>=0){let C=this.skel.restP[c.toeI];return{off:Ne(C,d),h:C[2]-this.skel.groundZ}}return{off:[0,-.05,-(d[2]-this.skel.groundZ)],h:0}},g=(E,C)=>t.space==="body"?[E,C,0]:a([E,C,0]),_=E=>this._footDelta(e,{...t,foot:E},s,r),m=(E,C,R,P)=>{let N=p(E),y=g(C,R);y[2]=d[2];let w=Ue(y,De(_({...P,pitch:0,roll:0}),N.off));return[w[0],w[1],this.skel.groundZ+N.h]},f=(E,C,R)=>Ne(C,De(_(R),p(E).off));if(t.pivot){let E=t.pivot,C;if(E.ax!=null)C=m(E.kind,E.ax,E.ay,E.ayaw!=null?{yaw:E.ayaw}:t.foot||{});else{let R=g(E.x,E.y);C=[R[0],R[1],this.skel.groundZ+p(E.kind).h]}C[2]+=E.z||0,u=f(E.kind,C,t.foot||{})}else if(t.swing){let E=t.swing,C=f("toe",m("toe",E.a.x,E.a.y,E.a.ayaw!=null?{yaw:E.a.ayaw}:E.a.foot),{...E.a.foot,pitch:E.a.pitch}),R=f("heel",m("heel",E.b.x,E.b.y,E.b.foot),{...E.b.foot,pitch:E.b.pitch});u=[C[0]+(R[0]-C[0])*E.h,C[1]+(R[1]-C[1])*E.h,C[2]+(R[2]-C[2])*E.v+(E.lift||0)]}let S=e==="R"?1:-1,v=t.pole;if(!v){let E=t.foot?.yawBody??this._footYawBody(e,t,r);v=[-Math.sin(E)+S*.12,Math.cos(E),.1]}let M=this._twoBone(l,u,h.l1,h.l2,v,t.reach??.998);o["_legE"+e]=M.E,o["thigh"+e]=Te(Ce(wn(M.u,M.h),ht(wn(h.dirU,h.hingeU)))),o["calf"+e]=Te(Ce(wn(M.f,M.h),ht(wn(h.dirL,h.hingeL))))}_footYawBody(e,t,i){let s=e==="R"?1:-1;if(t.foot?.yaw!=null){let r=Math.atan2(-De(i.q,Qs)[0],De(i.q,Qs)[1]);return t.foot.yaw-r}return-s*6*ze+(t.foot?.yawRel||0)}_footDelta(e,t,i,s){let r=t.foot||{};if(r.inherit){let l=Bn({bend:r.pitch||0,side:r.roll||0});return Te(Ce(i,l))}let a=this._footYawBody(e,t,s),o=De(dt(Fi,a),this._footFwdRest(e)),c=Xe(Pt(o,Fi)),h=dt(Fi,a);return h=Ce(dt(c,r.pitch||0),h),h=Ce(dt(o,r.roll||0),h),Te(h)}_handDelta(e,t,i,s){let r=this.side[e].hand,a=t?.wrist||{},o=e==="R"?1:-1,c=Ce(dt(r.fwd,(a.twist||0)*o),Ce(dt(r.flexAxis,a.flex||0),dt(r.back,(a.dev||0)*o))),h=Te(Ce(i,c));if(t?.palm&&(t.palm.weight??1)>0){let l=De(ht(s.q),t.palm.fingerDir),u=De(ht(s.q),t.palm.palmDir),d=Te(Ce(wn(l,u),ht(wn(r.fwd,r.palm)))),p=2*Math.acos(Math.min(1,Math.abs(Pr(h,d)))),g=Mt((175*ze-p)/(45*ze),0,1);g<1&&this.fades.push({side:e,angle:p/ze}),h=wa(h,d,(t.palm.weight??1)*g)}return h}_fingerDelta(e,t){let i=e[6],s=+e[7],r=+e[8];if(!t)return Rt();let a=this.side[i],o=a.fingers[s]?.[r];if(!o)return Rt();let c=Array.isArray(t.curl)?t.curl[s]??0:t.curl??0,h=t.claw??0,l;if(s===0)l=[.35,.55,.6][r]*c;else{let d=[1.3,1.65,1][r]*c,p=[-.25,1.1,1.2][r]*h;l=d+p}let u=dt(o.axis,l);if(r===0&&s>0&&t.spread){let d=a.hand,p=i==="R"?1:-1,g=(s-2.2)*.11*t.spread*p;u=Ce(dt(d.back,-g),u)}return r===0&&s===0&&t.thumbOpp&&(u=Ce(dt(a.hand.fwd,(i==="R"?1:-1)*t.thumbOpp),u)),u}_twoBone(e,t,i,s,r,a){let o=Ne(t,e),c=Tt(o),h=(i+s)*a,l=Math.abs(i-s)+.001,u=c>1e-6?ut(o,1/c):[0,0,-1];c=Mt(c,l,h);let d=Mt((i*i+c*c-s*s)/(2*i*c),-1,1),p=Math.sqrt(1-d*d),g=hi(r,u);Tt(g)<1e-6&&(g=hi([0,0,-1],u)),g=Xe(g);let _=Ue(e,Ue(ut(u,i*d),ut(g,i*p))),m=Ue(e,ut(u,c)),f=Xe(Ne(_,e)),S=Xe(Ne(m,_)),v=Xe(Pt(g,u));return{E:_,W:m,u:f,f:S,h:v,n:u,b:g,dist:c}}};function as(n){let e=n.P.map(i=>Ue(n.mover.p,De(n.mover.q,i))),t=n.Q.map(i=>Te(Ce(n.mover.q,i)));return{P:e,Q:t}}var ap=["male","female","zombie"],cp={mp_m_freemode_01:"male",mp_f_freemode_01:"female",u_m_y_zombie_01:"zombie"};function Zh(n){if(ap.includes(n))return{key:n,exact:!0};let e=cp[String(n||"").toLowerCase()];return e?{key:e,exact:!0}:{key:"male",exact:!1}}var Ca=30,lp=3,La=class{constructor(e,t,i,s){this.scene=e,this.prev=t,this.t=i,this.v=s,this.T=e.duration,this.phase=e.duration>0?i/e.duration:0}at(e,t,i=[0,0,0]){this.used=!0;let s=this.prev?.[e],r=this.scene.skeletons[e],a=r.idx(t);if(!s)return Ue(r.restP[a],i);let o=Te(Ce(s.mover.q,s.D[a]));return Ue(s.world.P[a],De(o,i))}moverOf(e){return this.used=!0,this.prev?.[e]?.mover??{p:[0,0,0],q:[0,0,0,1]}}body(e,t){let i=this.moverOf(e);return Ue(i.p,De(i.q,t))}},hp=null;function up(n,e,t){let i=hp?.[n];return i?i[e?.suffix||""]?.[t]??i["*"]?.[t]??null:null}function jh(n,e,t){let i=Object.keys(n.actors),s={};for(let l of i){let u=e?.skel?.[l]??n.actors[l],d=t[u];if(!d)throw new Error(`${n.name}: skeleton '${u}' for actor '${l}' not loaded`);s[l]=d}let r={name:n.name,duration:n.duration,skeletons:s},a=Object.fromEntries(i.map(l=>[l,new di(s[l])])),o=Math.max(2,Math.round(n.duration*Ca)+1),c=Object.fromEntries(i.map(l=>[l,[]]));for(let l=0;l<o;l++){let u=l/Ca,d=null,p=null;for(let g=0;g<lp;g++){let _=new La(r,d,u,e||{}),m=n.pose(u,_);p={};for(let f of i){let S=i.length===1&&!m[f]?m:m[f],v=up(n.name,e,f);if(v&&S){let E=S.mover||{p:[0,0,0],yaw:0};S={...S,mover:{p:[E.p[0]+(v.dx||0),E.p[1]+(v.dy||0),E.p[2]+(v.dz||0)],yaw:(E.yaw||0)+(v.dyaw||0)*Math.PI/180}}}let M=a[f].solve(S||{});M.world=as(M),p[f]=M}if(d=p,!n.contacts&&i.length===1&&!_.used)break}for(let g of i)c[g].push(p[g])}let h=(o-1)/Ca;return{scene:r,actors:i,skeletons:s,frames:c,duration:h,nFrames:o}}var Jh={smooth:ki.inOut,fastIn:ki.out,fastOut:ki.in,linear:ki.linear,spring:ki.back,step:ki.step},Hr=.15,er={relaxed:{curl:[.3,.32,.38,.44,.5],spread:.15,claw:0,thumbOpp:.1},fist:{curl:[.7,1,1,1,1],spread:0,claw:0,thumbOpp:.4},open:{curl:[.05,.02,.02,.03,.05],spread:.6,claw:0,thumbOpp:0},grab:{curl:[.55,.62,.66,.7,.72],spread:.35,claw:.25,thumbOpp:.3},point:{curl:[.6,.02,1,1,1],spread:.1,claw:0,thumbOpp:.35},claw:{curl:[.35,.25,.3,.35,.4],spread:.8,claw:.55,thumbOpp:0}};function Qh(n){let e=er[n.preset]||er.relaxed,t=n.curl??1;return[...e.curl.map(i=>Mt(i*t,0,1.2)),n.spread??e.spread,e.claw*Math.min(1,t),e.thumbOpp]}var dp=n=>({curl:n.slice(0,5),spread:n[5],claw:n[6],thumbOpp:n[7]}),Oi=(n,e,t)=>n+(e-n)*t,zn=(n,e,t)=>n.map((i,s)=>i+(e[s]-i)*t);function Bi(n,e,t){if(!n||!n.length)return[];let i=n.slice().sort((s,r)=>s.t-r.t);return t&&i.length&&Math.abs(i[i.length-1].t-e)>1e-6&&i.push({...i[0],t:e,ease:i[0].ease||"smooth",virtual:!0}),i}function zi(n,e){if(e<=n[0].t)return{a:n[0],b:n[0],u:0};for(let i=1;i<n.length;i++)if(e<=n[i].t){let s=n[i-1],r=n[i],a=(e-s.t)/Math.max(1e-9,r.t-s.t);return{a:s,b:r,u:(Jh[r.ease]||Jh.smooth)(a)}}let t=n[n.length-1];return{a:t,b:t,u:0}}function tu(n,e,t,i=!1){let s=Bi(n,t,i);if(!s.length)return null;let{a:r,b:a,u:o}=zi(s,e),c={};for(let h of new Set([...Object.keys(r),...Object.keys(a)])){if(h==="t"||h==="virtual")continue;let l=r[h]??a[h],u=a[h]??r[h];typeof l=="number"&&typeof u=="number"?c[h]=Oi(l,u,o):Array.isArray(l)&&Array.isArray(u)&&l.length===u.length&&l.every(d=>typeof d=="number")?c[h]=zn(l,u,o):c[h]=o<.5?l:u}return c.t=e,c}function fp(n,e,t){let i=n.tracks[e]||{},s=n.duration,r=!!n.loop,a=Bi(i.mover,s,r&&(n.loopMover||"closed")==="closed"),o=Bi(i.root,s,r),c=Bi(i.look,s,r),h=Object.entries(i.bones||{}).filter(([f])=>t.has(f)).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length),l=Object.fromEntries(Object.entries(i.ik||{}).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length)),u=Object.fromEntries(Object.entries(i.fingers||{}).map(([f,S])=>[f,Bi(S,s,r)]).filter(([,f])=>f.length)),d=t.groundZ+.085,p=f=>{if(!a.length)return{p:[0,0,0],yaw:0};let{a:S,b:v,u:M}=zi(a,f);return{p:zn(S.p||[0,0,0],v.p||S.p||[0,0,0],M),yaw:Oi(S.yaw||0,v.yaw??S.yaw??0,M)*ze}},g=(f,S)=>{let v=dt([0,0,1],f.yaw);return Ue(f.p,De(v,S))},_=(f,S)=>De(dt([0,0,1],-f.yaw),Ne(S,f.p)),m=(f,S)=>(f.space||"body")==="scene"?_(S,f.target):f.target;return{moverAt:p,toScene:g,toBody:_,groundAnkle:d,hasIk:f=>!!l[f],pose(f){let S=p(f),v={mover:{p:S.p,yaw:S.yaw},bones:{},arm:{},leg:{}};if(o.length){let{a:M,b:E,u:C}=zi(o,f);v.root={p:zn(M.p||[0,0,0],E.p||M.p||[0,0,0],C)};let R=M.rot||[0,0,0],P=E.rot||M.rot||[0,0,0];(R.some(Boolean)||P.some(Boolean))&&(v.bones.SKEL_ROOT=Aa(t,"SKEL_ROOT",zn(R,P,C)))}for(let[M,E]of h){let{a:C,b:R,u:P}=zi(E,f);v.bones[M]=Aa(t,M,zn(C.rot,R.rot,P))}for(let[M,E]of Object.entries(l)){let{a:C,b:R,u:P}=zi(E,f),N=M.endsWith("L")?"L":"R",y=Oi(C.weight??1,R.weight??1,P),w={target:zn(m(C,S),m(R,S),P),space:"body",weight:y},F=C.pole,B=R.pole;if((F||B)&&(w.pole=F&&B?zn(F,B,P):F||B),M.startsWith("hand"))v.arm[N]=w;else{let W=C.yaw!=null||R.yaw!=null?Oi(C.yaw??R.yaw,R.yaw??C.yaw,P):null;w.foot={pitch:Oi(C.pitch||0,R.pitch||0,P)*ze,roll:Oi(C.roll||0,R.roll||0,P)*ze},W!=null&&(w.foot.yaw=((R.space||"body")==="scene"?0:S.yaw)+W*ze),v.leg[N]=w}}for(let[M,E]of Object.entries(u)){let{a:C,b:R,u:P}=zi(E,f),N=dp(zn(Qh(C),Qh(R),P));v.arm[M]={...v.arm[M]||{},fingers:N}}if(c.length){let{a:M,b:E,u:C}=zi(c,f),R=M.space||"body",P=E.space||"body",N=R==="scene"?M.target:g(S,M.target),y=P==="scene"?E.target:g(S,E.target);v.look={target:zn(N,y,C),weight:Oi(M.weight??1,E.weight??1,C)}}return v}}}function nu(n,e,t){return n>=e[0]&&n<=e[1]?1:n>e[1]&&n<e[1]+Hr?1-Ir((n-e[1])/Hr):t&&n<e[0]&&n>e[0]-Hr?Ir(1-(e[0]-n)/Hr):0}function iu(n,e,t,i){return t<=0?n:i&&n&&n.target?{...n,target:zn(n.target,e,t),space:"body"}:{...n||{},target:e,space:"body",weight:t}}function Pa(n,e){let t=Object.keys(n.actors),i={},s={};for(let l of t){let u=n.actors[l],d=u.skeleton?{key:u.skeleton,exact:!0}:Zh(u.model);i[l]=d.key,s[l]=d.exact}let r=Object.fromEntries(t.map(l=>[l,fp(n,l,e[i[l]])])),a={};for(let l of t){let u=e[i[l]],d=new di(u),p=n.tracks[l]||{};a[l]=[];for(let g of["L","R"])for(let _ of(p.feet?.lock?.[g]||[]).slice().sort((m,f)=>m[0]-f[0])){let m=r[l].pose(_[0]);eu(m,a[l].filter(C=>C.side===g),_[0],r[l]);let f=d.solve(m),S=as(f),v=u.idx(cn["foot"+g]),M=S.P[v],E=ui(Te(Ce(f.mover.q,f.D[v])));a[l].push({side:g,range:_,ankle:M,yaw:E})}}let o=(n.contacts||[]).filter(l=>l.stick).map(l=>{let u=On(l.from),d=On(l.to);return{from:u,to:d,offset:l.offset||[0,0,0],t:l.t}}),c=(n.contacts||[]).map(l=>{let u=On(l.from),d=On(l.to);return{actor:u.actor,bone:u.bone,from:l.t[0],to:l.t[1],max:l.max??.03,target:{actor:d.actor,bone:d.bone,offset:l.offset||[0,0,0]},id:l.id}});return{source:{name:n.name,duration:n.duration,loop:!!n.loop,actors:Object.fromEntries(t.map(l=>[l,i[l]])),contacts:c.length?c:void 0,pose(l,u){let d={};for(let p of t){let g=r[p].pose(l);eu(g,a[p],l,r[p]);for(let _ of o){if(_.from.actor!==p)continue;let m=nu(l,_.t,!0);if(m<=0||!u)continue;let f=r[p].toBody(r[p].moverAt(l),u.at(_.to.actor,_.to.bone,_.offset)),S=_.from.handle.endsWith("L")?"L":"R",v=_.from.handle.startsWith("hand")?"arm":"leg";g[v][S]=iu(g[v][S],f,m,r[p].hasIk(_.from.handle))}d[p]=g}return d}},skelKeys:i,skelExact:s}}function su(n,e){let t=Pa(n,e),i=jh(t.source,{},e);return Object.assign(i,t)}function eu(n,e,t,i){for(let s of e){let r=nu(t,s.range,!1);if(r<=0)continue;let a=n.leg[s.side],o=iu(a,i.toBody(i.moverAt(t),s.ankle),r,i.hasIk("foot"+s.side)),c=a?.foot?.yaw;o.foot={...a?.foot||{},pitch:(a?.foot?.pitch||0)*(1-r),roll:(a?.foot?.roll||0)*(1-r),yaw:c!=null?c+pp(c,s.yaw)*r:s.yaw},n.leg[s.side]=o}}var pp=(n,e)=>Math.atan2(Math.sin(e-n),Math.cos(e-n));var Vr={footSlide:.3,groundPen:.025,floatFeet:.06,angVel:1500,linVel:9,loopSeam:.6,loopMover:.01,elbowHyper:4,kneeHyper:4,neck:85,spineSeg:38,wrist:88,wristRoll:120,penetration:.035,selfPenetration:.03,contact:.07,blendAngle:6,blendMover:.03},au={torso:["SKEL_Spine0","SKEL_Spine3",.13],chest:["SKEL_Spine2","SKEL_Neck_1",.12,[0,0,-.1]],neck:["SKEL_Neck_1","SKEL_Head",.06],head:["SKEL_Head","SKEL_Head",.1,[0,.02,.1],[0,.03,-.01]],upperL:["SKEL_L_UpperArm","SKEL_L_Forearm",.052],upperR:["SKEL_R_UpperArm","SKEL_R_Forearm",.052],foreL:["SKEL_L_Forearm","SKEL_L_Hand",.042],foreR:["SKEL_R_Forearm","SKEL_R_Hand",.042],thighL:["SKEL_L_Thigh","SKEL_L_Calf",.075],thighR:["SKEL_R_Thigh","SKEL_R_Calf",.075],shinL:["SKEL_L_Calf","SKEL_L_Foot",.052],shinR:["SKEL_R_Calf","SKEL_R_Foot",.052]},Yy=Object.keys(au);function Gr(n,e){let t={};for(let[i,[s,r,a,o,c]]of Object.entries(au)){if(!n.has(s)||!n.has(r))continue;let h=e.world.P[n.idx(s)],l=e.world.P[n.idx(r)];if(o){let u=Te(Ce(e.mover.q,e.D[n.idx(r)]));l=Ue(l,De(u,o))}if(c){let u=Te(Ce(e.mover.q,e.D[n.idx(s)]));h=Ue(h,De(u,c))}t[i]={a:h,b:l,r:a}}return t}function cu(n,e,t,i){let s=Ne(e,n),r=Ne(i,t),a=Ne(n,t),o=an(s,s),c=an(r,r),h=an(r,a),l,u;if(o<=1e-12&&c<=1e-12)return Tt(a);if(o<=1e-12)l=0,u=Mt(h/c,0,1);else{let d=an(s,a);if(c<=1e-12)u=0,l=Mt(-d/o,0,1);else{let p=an(s,r),g=o*c-p*p;l=g!==0?Mt((p*h-d*c)/g,0,1):0,u=(p*l+h)/c,u<0?(u=0,l=Mt(-d/o,0,1)):u>1&&(u=1,l=Mt((p-d)/o,0,1))}}return Tt(Ne(Ue(n,ut(s,l)),Ue(t,ut(r,u))))}var Bt=()=>({value:0,frame:-1,detail:""}),zt=(n,e,t,i="")=>{e>n.value&&(n.value=e,n.frame=t,n.detail=i)},mp=[0,-.05,-.085],ru={heel:0,toe:.035};function ou(n,e,t){let i=Te(Ce(e.mover.q,e.D[t.ankle])),s={heel:Ue(e.world.P[t.ankle],De(i,mp))};return t.toe>=0&&(s.toe=e.world.P[t.toe]),s}function lu(n,e,t={}){let i={...Vr,...t.limits||{}},s=t.fps||30,r=e.length,a={footSlide:Bt(),groundPen:Bt(),floatFeet:Bt(),angVel:Bt(),linVel:Bt(),elbowHyper:Bt(),kneeHyper:Bt(),neck:Bt(),spineSeg:Bt(),wrist:Bt(),wristRoll:Bt(),selfPenetration:Bt(),loopSeam:Bt(),loopMover:Bt()},o=n.groundZ,c=["L","R"].map(l=>({s:l,ankle:n.idx(He.side[l].foot),toe:n.has(He.side[l].toe)?n.idx(He.side[l].toe):-1})),h=t.airborne||[];for(let l=0;l<r;l++){let u=e[l],d=o+u.mover.p[2],p=1/0;for(let m of c){let f=u.world.P[m.ankle][2]-(d+.085),S=m.toe>=0?u.world.P[m.toe][2]-(d+.025):f;t.noGround||zt(a.groundPen,-Math.min(f,S),l,`${m.s} foot`),p=Math.min(p,f,S)}if(!h.some(([m,f])=>l/s>=m&&l/s<=f)&&!t.noGround&&zt(a.floatFeet,p,l,"lowest foot above ground"),l>0&&!t.noGround){let m=e[l-1];for(let f of c){let S=ou(n,u,f),v=ou(n,m,f);for(let M of Object.keys(S)){let E=S[M][2]-d-ru[M],C=v[M][2]-(o+m.mover.p[2])-ru[M];if(E<.02&&C<.02){let R=S[M][0]-v[M][0],P=S[M][1]-v[M][1];zt(a.footSlide,Math.hypot(R,P)*s,l,`${f.s} ${M}`)}}}}if(l>0){let m=e[l-1];for(let f of n.order){let S=n.bones[f].name;if(!S.startsWith("SKEL_")||S.includes("Finger"))continue;let v=os(u.world.Q[f],m.world.Q[f])/ze*s;zt(a.angVel,v,l,S);let M=Tt(Ne(u.world.P[f],m.world.P[f]))*s;zt(a.linVel,M,l,S)}}for(let m of["L","R"]){let f=He.side[m],S=n.limbs["arm"+m],v=n.limbs["leg"+m];for(let[M,E,C,R,P]of[[S,"elbowHyper",f.upper,f.lower,f.hand],[v,"kneeHyper",f.thigh,f.calf,f.foot]]){if(!M)continue;let N=u.P[n.idx(C)],y=u.P[n.idx(R)],w=u.P[n.idx(P)],F=Xe(Ne(y,N)),B=Xe(Ne(w,y)),W=De(u.D[n.idx(C)],M.hingeU),ee=Math.atan2(an(Pt(F,B),W),an(F,B));zt(a[E],-ee/ze,l,`${m}`)}if(S){let M=Te(Ce(ht(u.D[n.idx(f.lower)]),u.D[n.idx(f.hand)])),E=kh(M,S.dirL),C=Te(Ce(M,ht(E)));zt(a.wrist,2*Math.acos(Math.min(1,Math.abs(C[3])))/ze,l,`${m} bend`),zt(a.wristRoll,2*Math.acos(Math.min(1,Math.abs(E[3])))/ze,l,`${m} roll`)}}let _=n.has("SKEL_Spine3")?n.idx("SKEL_Spine3"):n.idx(He.root);zt(a.neck,os(u.D[n.idx(He.head)],u.D[_])/ze,l,"head vs chest");for(let m of He.spine){if(!n.has(m))continue;let f=n.idx(m),S=n.bones[f].parent;zt(a.spineSeg,os(u.D[f],u.D[S])/ze,l,m)}if(!t.allowSelfContact){let m=Gr(n,u);for(let f of["foreL","foreR"])for(let S of["torso","thighL","thighR"]){if(!m[f]||!m[S]||f==="foreL"&&S==="thighL"||f==="foreR"&&S==="thighR")continue;let v=cu(m[f].a,m[f].b,m[S].a,m[S].b);zt(a.selfPenetration,m[f].r+m[S].r-v,l,`${f} vs ${S}`)}}}if(t.loop&&r>2){let l=e[0],u=e[r-1];for(let g of n.order)zt(a.loopSeam,os(l.local[g],u.local[g])/ze,r-1,n.bones[g].name);let d=Ne(e[1].mover.p,e[0].mover.p),p=Ne(e[r-1].mover.p,e[r-2].mover.p);zt(a.loopMover,Tt(Ne(d,p)),r-1,"mover velocity across seam"),zt(a.loopSeam,os(e[0].mover.q,e[r-1].mover.q)/ze,r-1,"mover rotation")}return uu(a,i)}function hu(n,e={}){let t={...Vr,...e.limits||{}},i={penetration:Bt(),contact:Bt()},s=n.actors,r=new Set((e.allowTouch||[]).flatMap(([u,d])=>[`${u}|${d}`,`${d}|${u}`])),a=n.nFrames,o=e.fps||30,c=e.contacts||[],h=c.map(()=>Bt());for(let u=0;u<a;u++){let d={};for(let p of s)d[p]=Gr(n.skeletons[p],n.frames[p][u]);for(let p=0;p<s.length;p++)for(let g=p+1;g<s.length;g++){let _=s[p],m=s[g];for(let[f,S]of Object.entries(d[_]))for(let[v,M]of Object.entries(d[m])){if(r.has(`${_}.${f}|${m}.${v}`)||r.has(`${_}.*|${m}.${v}`)||r.has(`${_}.${f}|${m}.*`))continue;let E=cu(S.a,S.b,M.a,M.b);zt(i.penetration,S.r+M.r-E,u,`${_}.${f} vs ${m}.${v}`)}}c.forEach((p,g)=>{let _=u/o;if(_<p.from||_>p.to)return;let m=n.skeletons[p.actor],f=n.frames[p.actor][u],S=m.idx(p.bone),v=Ue(f.world.P[S],De(Te(Ce(f.mover.q,f.D[S])),p.offset||[0,0,0])),M=n.skeletons[p.target.actor],E=n.frames[p.target.actor][u],C=M.idx(p.target.bone),R=Te(Ce(E.mover.q,E.D[C])),P=Ue(E.world.P[C],De(R,p.target.offset||[0,0,0])),N=Tt(Ne(v,P)),y=`${p.actor}.${p.bone} -> ${p.target.actor}.${p.target.bone}`;zt(h[g],N,u,y),zt(i.contact,N-(p.max??t.contact),u,y)})}let l=uu(i,{...t,contact:0});return l.contacts=h.map((u,d)=>({...u,value:+u.value.toFixed(4),limit:c[d].max??t.contact,pass:u.value<=(c[d].max??t.contact)})),l}function uu(n,e){let t={ok:!0,items:{}};for(let[i,s]of Object.entries(n)){let r=e[i],a=r==null||s.value<=r+1e-9;t.items[i]={value:+s.value.toFixed(4),limit:r,pass:a,frame:s.frame,detail:s.detail},a||(t.ok=!1)}return t}var gp={contact:.03},cs=30,Zn=n=>(n*100).toFixed(1),Ia=n=>(+n).toFixed(1),Da={L:"links",R:"rechts"},_p={heel:"Ferse",toe:"Ballen"},ka=n=>String(n||"").replace(/^SKEL_/,"").replace(/_/g," ");function Ua(n,e){let t={...gp,...n.limits||{}},i={};for(let r of e.actors)i[r]=lu(e.skeletons[r],e.frames[r],{loop:!!n.loop,limits:t});let s=null;if(e.actors.length>1||(n.contacts||[]).length){let{source:r}=e,a=[];for(let o of n.contacts||[]){let[c,h]=o.from.split("."),[l]=o.to.split(".");if(c===l)continue;let u=/^(hand|foot)([LR])$/.exec(h);if(u)for(let d of u[1]==="hand"?["fore","upper"]:["shin"])a.push([`${c}.${d}${u[2]}`,`${l}.*`])}s=hu(e,{contacts:r?.contacts||[],limits:t,allowTouch:a})}return{actors:i,scene:s,limits:{...Vr,...t}}}function xp(n,e,t,i){let s=n.idx(He.side[t].foot),r=c=>{let h=e[c],l=Te(Ce(h.mover.q,h.D[s]));return Ue(h.world.P[s],De(l,[0,-.05,-.085]))[2]-(n.groundZ+h.mover.p[2])},a=i,o=i;for(;a>0&&r(a-1)<.03;)a--;for(;o<e.length-1&&r(o+1)<.03;)o++;return o-a<3&&(a=Math.max(0,i-6),o=Math.min(e.length-1,i+6)),[+(a/cs).toFixed(3),+(o/cs).toFixed(3)]}function du(n,e,t=Ua(n,e)){let i=[],s=o=>i.push({fix:null,actor:null,t:null,...o}),r=o=>n.actors[o]?.label||o;for(let o of e.actors){let c=t.actors[o].items,h=e.skeletons[o],l=e.actors.length>1?`${r(o)}: `:"",u=d=>d.frame>=0?+(d.frame/cs).toFixed(3):null;{let d=c.footSlide,p=/^([LR])/.exec(d.detail)?.[1],g=/(heel|toe)/.exec(d.detail)?.[1],_=d.pass?d.value>d.limit*.8?"warn":"ok":"error";s({id:`${o}.footSlide`,category:"feet",level:_,actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m/s",title:"Fu\xDFrutschen",text:_==="ok"?`${l}Die F\xFC\xDFe stehen fest.`:`${l}Fu\xDF ${Da[p]||""} (${_p[g]||"Fu\xDF"}) rutscht mit ${d.value.toFixed(2)} m/s \xFCber den Boden (erlaubt ${d.limit} m/s).`,fix:_!=="ok"&&p?{kind:"lockFeet",actor:o,side:p,range:xp(h,e.frames[o],p,Math.max(0,d.frame)),label:`Fu\xDF ${Da[p]} festkleben`}:null})}{let d=c.groundPen,p=/^([LR])/.exec(d.detail)?.[1],g=d.pass?d.value>d.limit*.6?"warn":"ok":"error";s({id:`${o}.groundPen`,category:"ground",level:g,actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Boden-Durchdringung",text:g==="ok"?`${l}Kein Fu\xDF steckt im Boden.`:`${l}Fu\xDF ${Da[p]||""} steckt ${Zn(d.value)} cm im Boden (erlaubt ${Zn(d.limit)} cm).`,fix:g!=="ok"&&p?{kind:"snapGround",actor:o,side:p,t:u(d),depth:+d.value.toFixed(4),label:"Auf den Boden setzen"}:null})}{let d=0,p=null,g=null;for(let[S,v]of Object.entries(n.tracks[o]?.bones||{}))if(h.has(S))for(let M of v){let E=$h(h,S,M.rot);E>d&&(d=E,p=S,g=M.t)}let _=["elbowHyper","kneeHyper","neck","spineSeg","wrist","wristRoll"].map(S=>[S,c[S]]).filter(([,S])=>!S.pass),m=d>.5||_.length?"error":"ok",f=`${l}Alle Gelenke im nat\xFCrlichen Bereich.`;if(d>.5)f=`${l}${ka(p)} ist ${Ia(d)}\xB0 \xFCber der Gelenkgrenze.`;else if(_.length){let[S,v]=_[0],M={elbowHyper:"Ellbogen \xFCberstreckt",kneeHyper:"Knie \xFCberstreckt",neck:"Kopf zu stark verdreht",spineSeg:"Wirbels\xE4ule zu stark gebogen",wrist:"Handgelenk zu stark abgeknickt",wristRoll:"Handgelenk zu stark verdreht"}[S];f=`${l}${M}: ${Ia(v.value)}\xB0 (erlaubt ${v.limit}\xB0, ${v.detail}).`,g=u(v)}s({id:`${o}.joints`,category:"joints",level:m,actor:o,t:g,value:+(d||(_[0]?.[1].value??0)).toFixed(2),limit:d>.5?0:_[0]?.[1].limit??null,unit:"\xB0",title:"Gelenkgrenzen",text:f,fix:d>.5?{kind:"clampJoints",actor:o,bone:p,label:"Winkel begrenzen"}:null})}{let d=c.angVel,p=d.pass?d.value>d.limit*.8?"warn":"ok":"error";s({id:`${o}.angVel`,category:"speed",level:p,actor:o,t:u(d),value:Math.round(d.value),limit:d.limit,unit:"\xB0/s",title:"Zu schnelle Drehungen",text:p==="ok"?`${l}Alle Drehungen in normalem Tempo.`:`${l}${ka(d.detail)} dreht sich mit ${Math.round(d.value)}\xB0/s (h\xF6chstens ${d.limit}\xB0/s). Keyframes weiter auseinander ziehen oder weichere Kurve w\xE4hlen.`,fix:p!=="ok"?{kind:"easeSmooth",actor:o,t:u(d),label:"Kurven weich machen"}:null})}if(!c.selfPenetration.pass){let d=c.selfPenetration;s({id:`${o}.selfPen`,category:"self",level:"warn",actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Arm im eigenen K\xF6rper",text:`${l}${d.detail.replace("fore","Unterarm ").replace("vs","in")} (${Zn(d.value)} cm). Gewollt? Sonst Arm etwas weiter weg.`})}if(!c.floatFeet.pass){let d=c.floatFeet;s({id:`${o}.floatFeet`,category:"ground",level:"warn",actor:o,t:u(d),value:+d.value.toFixed(3),limit:d.limit,unit:"m",title:"Beide F\xFC\xDFe in der Luft",text:`${l}Beide F\xFC\xDFe sind ${Zn(d.value)} cm \xFCber dem Boden. Bei einem Sprung ist das richtig, sonst Becken absenken.`})}if(n.loop){let d=c.loopSeam,p=c.loopMover,g=!d.pass||!p.pass;s({id:`${o}.loop`,category:"loop",level:g?"error":"ok",actor:o,t:n.duration,value:+d.value.toFixed(2),limit:d.limit,unit:"\xB0",title:"Loop-Naht",text:g?`${l}Ende und Anfang passen nicht zusammen (${d.pass?`Bewegung springt um ${Zn(p.value)} cm`:`${ka(d.detail)} springt um ${Ia(d.value)}\xB0`}).`:`${l}Ende = Anfang, die Naht ist sauber.`,fix:g?{kind:"closeLoop",actor:o,label:"Naht schlie\xDFen"}:null})}}let a=t.scene;if(a){if(e.actors.length>1){let o=a.items.penetration,c=o.pass?o.value>o.limit*.7?"warn":"ok":"error",h=e.actors[1];s({id:"scene.penetration",category:"actors",level:c,t:o.frame>=0?+(o.frame/cs).toFixed(3):null,value:+o.value.toFixed(3),limit:o.limit,unit:"m",title:"Durchdringung zwischen Akteuren",text:c==="ok"?"Die Akteure stecken nicht ineinander.":`Die K\xF6rper stecken ${Zn(o.value)} cm ineinander (${o.detail.replace(/\./g," ")}).`,fix:c==="error"?{kind:"separate",actor:h,t:+(o.frame/cs).toFixed(3),dist:+(o.value-o.limit+.01).toFixed(3),label:`${r(h)} wegschieben`}:null})}(a.contacts||[]).forEach((o,c)=>{let h=n.contacts[c];s({id:`contact.${c}`,category:"contacts",level:o.pass?"ok":"error",t:o.frame>=0?+(o.frame/cs).toFixed(3):h.t[0],value:o.value,limit:o.limit,unit:"m",title:"Kontakt",text:o.pass?`Kontakt ${h.from} \u2192 ${h.to} h\xE4lt (${Zn(o.value)} cm).`:`Kontakt ${h.from} \u2192 ${h.to} ist offen: ${Zn(o.value)} cm Abstand (erlaubt ${Zn(o.limit)} cm).`,fix:!o.pass&&!h.stick?{kind:"stick",index:c,label:"Festkleben"}:null})})}return i}function fu(n){return n.some(e=>e.level==="error")?"error":n.some(e=>e.level==="warn")?"warn":"ok"}var ln=30,Ut=n=>+(Math.round(n*ln)/ln).toFixed(4),ls=n=>Array.isArray(n)?n.map(e=>+(+e).toFixed(4)):+(+n).toFixed(4),Na=n=>Array.isArray(n)?n.map(e=>+(+e).toFixed(2)):+(+n).toFixed(2),pu=["pos","torso","head","armL","armR","handL","handR","legL","legR"],mu={pos:"group_pos",torso:"group_torso",head:"group_head",armL:"group_armL",armR:"group_armR",handL:"group_handL",handR:"group_handR",legL:"group_legL",legR:"group_legR"};function Fa(n){if(/Neck|Head/.test(n))return"head";if(/Pelvis|Spine|ROOT/.test(n))return"torso";let e=Ui(n);return e?/Clavicle|UpperArm|Forearm/.test(n)?"arm"+e:/Hand|Finger/.test(n)?"hand"+e:"leg"+e:"torso"}function Oa(n){switch(n.kind){case"mover":case"root":return"pos";case"look":return"head";case"bone":return Fa(n.id);case"ik":return(n.id.startsWith("hand")?"arm":"leg")+n.id.slice(-1);case"fingers":return"hand"+n.id;default:return"pos"}}function En(n,e){let t=n.tracks[e.actor];if(!t)return null;switch(e.kind){case"mover":return t.mover||null;case"root":return t.root||null;case"look":return t.look||null;case"bone":return t.bones?.[e.id]||null;case"ik":return t.ik?.[e.id]||null;case"fingers":return t.fingers?.[e.id]||null;default:return null}}function vp(n,e){let t=n.tracks[e.actor]||={};switch(e.kind){case"mover":return t.mover||=[];case"root":return t.root||=[];case"look":return t.look||=[];case"bone":return(t.bones||={})[e.id]||=[];case"ik":return(t.ik||={})[e.id]||=[];case"fingers":return(t.fingers||={})[e.id]||=[];default:throw new Error("bad ref")}}function Ba(n,e,t){let i=n.tracks[e.actor];if(!i)return;let s=(r,a)=>t.length?(r[a]=t,!1):(delete r[a],!0);switch(e.kind){case"mover":case"root":case"look":s(i,e.kind);break;case"bone":i.bones&&(s(i.bones,e.id),Object.keys(i.bones).length||delete i.bones);break;case"ik":i.ik&&(s(i.ik,e.id),Object.keys(i.ik).length||delete i.ik);break;case"fingers":i.fingers&&(s(i.fingers,e.id),Object.keys(i.fingers).length||delete i.fingers);break}}function za(n,e){let t=n.tracks[e]||{},i=[];t.mover?.length&&i.push({actor:e,kind:"mover"}),t.root?.length&&i.push({actor:e,kind:"root"}),t.look?.length&&i.push({actor:e,kind:"look"});for(let[s,r]of Object.entries(t.bones||{}))r.length&&i.push({actor:e,kind:"bone",id:s});for(let[s,r]of Object.entries(t.ik||{}))r.length&&i.push({actor:e,kind:"ik",id:s});for(let[s,r]of Object.entries(t.fingers||{}))r.length&&i.push({actor:e,kind:"fingers",id:s});return i}var tr=(n,e,t)=>za(n,e).filter(i=>Oa(i)===t);function nr(n,e,t){let i=new Set;for(let s of t?tr(n,e,t):za(n,e))for(let r of En(n,s))i.add(Ut(r.t));return[...i].sort((s,r)=>s-r)}var yp=(n,e)=>!!n.loop&&!(e.kind==="mover"&&(n.loopMover||"closed")==="travel");function Nt(n,e,t){let i=En(n,e);return i&&i.length?tu(i,t,n.duration,yp(n,e)):null}function yt(n,e,t,i){let s=vp(n,e),r=Math.min(n.duration,Math.max(0,Ut(t))),a={};for(let[c,h]of Object.entries(i))h!==void 0&&(c==="rot"||c==="yaw"||c==="pitch"||c==="roll"?a[c]=Na(h):c==="p"||c==="target"||c==="pole"?a[c]=ls(h):c==="weight"||c==="curl"||c==="spread"?a[c]=+(+h).toFixed(3):a[c]=h);let o=s.findIndex(c=>Math.abs(c.t-r)<.5/ln);return o>=0?s[o]={...s[o],...a,t:r}:(s.push({t:r,...a}),s.sort((c,h)=>c.t-h.t)),s}function gu(n,e,t,i){for(let s of tr(n,e,t))Ba(n,s,En(n,s).filter(r=>Math.abs(r.t-i)>.5/ln))}function _u(n,e,t,i,s){let r=Math.min(n.duration,Math.max(0,Ut(s)));for(let a of tr(n,e,t)){let o=En(n,a),c=o.filter(l=>Math.abs(l.t-i)<.5/ln);if(!c.length)continue;let h=o.filter(l=>Math.abs(l.t-i)>=.5/ln&&Math.abs(l.t-r)>=.5/ln);Ba(n,a,[...h,...c.map(l=>({...l,t:r}))].sort((l,u)=>l.t-u.t))}}function xu(n,e,t,i,s){for(let r of tr(n,e,t))for(let a of En(n,r))Math.abs(a.t-i)<.5/ln&&(a.ease=s)}function vu(n,e,t,i){let s=[];for(let r of tr(n,e,t))for(let a of En(n,r))Math.abs(a.t-i)<.5/ln&&s.push({ref:r,key:JSON.parse(JSON.stringify(a))});return s}function yu(n,e,t,i=null){for(let{ref:s,key:r}of e)yt(n,i?{...s,actor:i}:s,t,{...r,t:void 0})}function Ha(n,e){Ba(n,e,[])}function Kr(n,e,t){let i={bones:{},ik:{},fingers:{}};for(let s of za(n,e)){let r=Nt(n,s,t);r&&(s.kind==="root"?i.root={p:ls(r.p||[0,0,0]),rot:Na(r.rot||[0,0,0])}:s.kind==="bone"?i.bones[s.id]=Na(r.rot):s.kind==="ik"?i.ik[s.id]={target:ls(r.target),pole:r.pole?ls(r.pole):void 0,weight:r.weight??1,space:r.space||"body",yaw:r.yaw,pitch:r.pitch,roll:r.roll}:s.kind==="fingers"?i.fingers[s.id]={preset:r.preset||"relaxed",curl:r.curl??1,spread:r.spread}:s.kind==="look"&&(i.look={target:ls(r.target),weight:r.weight??1,space:r.space||"body"}))}return i}function hs(n,e,t,i){let s=o=>o&&Object.keys(o).length;yt(n,{actor:e,kind:"root"},t,{p:i.root?.p||[0,0,0],rot:i.root?.rot||[0,0,0]});let r=new Set([...Object.keys(n.tracks[e]?.bones||{}),...Object.keys(i.bones||{})]);for(let o of r)yt(n,{actor:e,kind:"bone",id:o},t,{rot:i.bones?.[o]||[0,0,0]});let a=new Set([...Object.keys(n.tracks[e]?.ik||{}),...Object.keys(i.ik||{})]);for(let o of a){let c=i.ik?.[o],h={actor:e,kind:"ik",id:o};if(c)yt(n,h,t,{...c,weight:c.weight??1});else{let l=Nt(n,h,t);l&&yt(n,h,t,{target:l.target,space:l.space,weight:0})}}if(s(i.fingers))for(let[o,c]of Object.entries(i.fingers))yt(n,{actor:e,kind:"fingers",id:o},t,c);i.look&&yt(n,{actor:e,kind:"look"},t,i.look)}var Wr=n=>n&&[-n[0],n[1],n[2]];function Su(n){let e={bones:{},ik:{},fingers:{}};n.root&&(e.root={p:Wr(n.root.p),rot:Fr("SKEL_ROOT",n.root.rot)});for(let[t,i]of Object.entries(n.bones||{}))e.bones[Nr(t)]=Fr(t,i);for(let[t,i]of Object.entries(n.ik||{})){let s=t.endsWith("L")?t.slice(0,-1)+"R":t.slice(0,-1)+"L";e.ik[s]={...i,target:Wr(i.target),pole:Wr(i.pole),yaw:i.yaw!=null?-i.yaw:i.yaw,roll:i.roll!=null?-i.roll:i.roll}}for(let[t,i]of Object.entries(n.fingers||{}))e.fingers[t==="L"?"R":"L"]={...i};return n.look&&(e.look={...n.look,target:Wr(n.look.target)}),e}function Mu(n,e,t,i){let s=Nt(n,{actor:e,kind:"bone",id:t},i),r=Nr(t);return!s||r===t?!1:(yt(n,{actor:e,kind:"bone",id:r},i,{rot:Fr(t,s.rot)}),!0)}function bu(n,e,t,i){n.events||=[],n.events.push({name:e,t:Ut(t),...i?{duration:+(+i).toFixed(3)}:{}}),n.events.sort((s,r)=>s.t-r.t)}function wu(n,e){n.events.splice(e,1)}function Eu(n,e,t,i){let s=n.tracks[e]||={};s.feet||={},s.feet.lock||={};for(let r of t==="both"?["L","R"]:[t]){let a=[...s.feet.lock[r]||[],[Ut(i[0]),Ut(i[1])]].sort((c,h)=>c[0]-h[0]),o=[];for(let c of a)o.length&&c[0]<=o[o.length-1][1]?o[o.length-1][1]=Math.max(o[o.length-1][1],c[1]):o.push(c.slice());s.feet.lock[r]=o}}function Au(n,e,t,i){let s=n.tracks[e]?.feet?.lock?.[t];s&&s.splice(i,1)}function Tu(n,e,t,i,s){n.contacts||=[];let r=`c${n.contacts.length+1}_${Math.floor(Date.now()%1e5)}`.slice(0,24);n.contacts.push({id:r,from:e,to:t,offset:ls(i),t:[Ut(s[0]),Ut(s[1])],stick:!0,max:.03})}function Va(n,e){n.contacts.splice(e,1)}function An(n){let{format:e,name:t,...i}=n;return JSON.stringify({format:e,name:t,...i})}var x={doc:null,name:null,dirty:!1,savedAt:null,version:0,t:0,playing:!1,speed:1,onion:!1,limitsOn:!0,overlay:!0,actor:"a",selBone:null,selHandle:null,selKeys:[],range:null,history:[],future:[],undoMax:150,skeletons:{},skeletonSource:"none",config:{},frame:null,partners:[],clipboardPose:null,clipboardKeys:null,findings:[],light:"ok",checking:!1,checkError:null,poses:{},projects:[],watch:{alive:!1},test:null,lastResult:null},$r=new Map;function fi(n,e){$r.has(n)||$r.set(n,[]),$r.get(n).push(e)}function pn(...n){for(let e of[...n,"*"])for(let t of $r.get(e)||[])try{t(e)}catch(i){console.error(e,i)}}var us=null;function Ru(n,e){x.doc=n,x.name=e,x.dirty=!1,x.history=[],x.future=[],x.version++,x.t=Math.min(x.t,n.duration),x.selKeys=[],x.range=null,qr(),pn("doc","time","history","selection","project")}function Wa(n,{commit:e=!0}={}){e&&!us&&Cu(An(x.doc)),x.doc=n,x.dirty=!0,x.version++,qr(),pn("doc","history")}function je(n,e){let t=structuredClone(x.doc);n(t),Wa(t,e)}function Cu(n){x.history.push(n),x.history.length>x.undoMax&&x.history.shift(),x.future=[]}function Hn(){us||(us=An(x.doc))}function jn(){if(!us)return;let n=us;us=null,n!==An(x.doc)&&(Cu(n),pn("history"))}function Ka(){x.history.length&&(x.future.push(An(x.doc)),x.doc=JSON.parse(x.history.pop()),x.dirty=!0,x.version++,qr(),pn("doc","history"))}function $a(){x.future.length&&(x.history.push(An(x.doc)),x.doc=JSON.parse(x.future.pop()),x.dirty=!0,x.version++,qr(),pn("doc","history"))}var Xr={version:-1,source:null,rigs:null};function qr(){Xr.version=-1,Sp()}function Lu(){if(Xr.version!==x.version){let n=Pa(x.doc,x.skeletons),e={};for(let t of Object.keys(x.doc.actors))e[t]=new di(x.skeletons[n.skelKeys[t]]);Xr={version:x.version,source:n.source,skelKeys:n.skelKeys,rigs:e,frames:new Map}}return Xr}function Ct(n){let e=Lu();return x.skeletons[e.skelKeys[n]]}function Tn(n){let e=Lu(),t=Math.round(n*1e3);if(e.frames.has(t))return e.frames.get(t);let i=Object.keys(x.doc.actors),s=e.source.contacts?3:1,r=null,a=null;for(let o=0;o<s;o++){let c={at(l,u,d=[0,0,0]){let p=Ct(l),g=p.idx(u),_=r?.[l];return _?Ue(_.world.P[g],De(Te(Ce(_.mover.q,_.D[g])),d)):Ue(p.restP[g],d)}},h=e.source.pose(n,c);a={};for(let l of i){let u=e.rigs[l].solve(h[l]||{});u.world=as(u),u.pose=h[l],a[l]=u}r=a}return e.frames.size>400&&e.frames.clear(),e.frames.set(t,a),a}var Ga=null,Xa=null;function Sp(){clearTimeout(Ga),x.doc&&(x.checking=!0,Ga=setTimeout(Yr,350))}function Yr(){if(clearTimeout(Ga),!!x.doc){try{let n=su(x.doc,x.skeletons);Xa=n,x.findings=du(x.doc,n,Ua(x.doc,n)),x.light=fu(x.findings),x.checkError=null}catch(n){x.findings=[],x.light="error",x.checkError=n.message,console.error("checks",n)}x.checking=!1,pn("checks")}}function mn(n){let e=x.doc?x.doc.duration:0;x.t=Math.max(0,Math.min(e,n)),pn("time")}function Ht(n){Object.assign(x,n),pn("selection")}var eh="169";var Mp=0,Pu=1,bp=2;var Fd=1,wp=2,ii=3,bi=0,tn=1,si=2,Si=0,Ts=1,Iu=2,Du=3,ku=4,Ep=5,qi=100,Ap=101,Tp=102,Rp=103,Cp=104,Lp=200,Pp=201,Ip=202,Dp=203,Lc=204,Pc=205,kp=206,Up=207,Np=208,Fp=209,Op=210,Bp=211,zp=212,Hp=213,Vp=214,Ic=0,Dc=1,kc=2,Ps=3,Uc=4,Nc=5,Fc=6,Oc=7,Od=0,Gp=1,Wp=2,Mi=0,Kp=1,$p=2,Xp=3,qp=4,Yp=5,Zp=6,jp=7;var Bd=300,Is=301,Ds=302,Bc=303,zc=304,ra=306,Hc=1e3,ji=1001,Vc=1002,_n=1003,Jp=1004;var Zr=1005;var In=1006,qa=1007;var Ji=1008;var ai=1009,zd=1010,Hd=1011,pr=1012,th=1013,Qi=1014,ri=1015,Mr=1016,nh=1017,ih=1018,ks=1020,Vd=35902,Gd=1021,Wd=1022,Dn=1023,Kd=1024,$d=1025,Rs=1026,Us=1027,Xd=1028,sh=1029,qd=1030,rh=1031;var oh=1033,Mo=33776,bo=33777,wo=33778,Eo=33779,Gc=35840,Wc=35841,Kc=35842,$c=35843,Xc=36196,qc=37492,Yc=37496,Zc=37808,jc=37809,Jc=37810,Qc=37811,el=37812,tl=37813,nl=37814,il=37815,sl=37816,rl=37817,ol=37818,al=37819,cl=37820,ll=37821,Ao=36492,hl=36494,ul=36495,Yd=36283,dl=36284,fl=36285,pl=36286;var Ro=2300,ml=2301,Ya=2302,Uu=2400,Nu=2401,Fu=2402;var Qp=3200,em=3201;var Zd=0,tm=1,yi="",Vn="srgb",Ci="srgb-linear",ah="display-p3",oa="display-p3-linear",Co="linear",gt="srgb",Lo="rec709",Po="p3";var ds=7680;var Ou=519,nm=512,im=513,sm=514,jd=515,rm=516,om=517,am=518,cm=519,Bu=35044;var zu="300 es",oi=2e3,Io=2001,wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Za=Math.PI/180,gl=180/Math.PI;function br(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Vt(n,e,t){return Math.max(e,Math.min(t,n))}function lm(n,e){return(n%e+e)%e}function ja(n,e,t){return(1-t)*n+t*e}function ir(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function en(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Re=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ye=class n{constructor(e,t,i,s,r,a,o,c,h){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h)}set(e,t,i,s,r,a,o,c,h){let l=this.elements;return l[0]=e,l[1]=s,l[2]=o,l[3]=t,l[4]=r,l[5]=c,l[6]=i,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],l=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],S=s[1],v=s[4],M=s[7],E=s[2],C=s[5],R=s[8];return r[0]=a*_+o*S+c*E,r[3]=a*m+o*v+c*C,r[6]=a*f+o*M+c*R,r[1]=h*_+l*S+u*E,r[4]=h*m+l*v+u*C,r[7]=h*f+l*M+u*R,r[2]=d*_+p*S+g*E,r[5]=d*m+p*v+g*C,r[8]=d*f+p*M+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8];return t*a*l-t*o*h-i*r*l+i*o*c+s*r*h-s*a*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=l*a-o*h,d=o*c-l*r,p=h*r-a*c,g=t*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*h-l*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(l*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(i*c-h*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ja.makeScale(e,t)),this}rotate(e){return this.premultiply(Ja.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ja.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ja=new Ye;function Jd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Do(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function hm(){let n=Do("canvas");return n.style.display="block",n}var Hu={};function To(n){n in Hu||(Hu[n]=!0,console.warn(n))}function um(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function dm(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function fm(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Vu=new Ye().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Gu=new Ye().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),sr={[Ci]:{transfer:Co,primaries:Lo,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[Vn]:{transfer:gt,primaries:Lo,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[oa]:{transfer:Co,primaries:Po,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Gu),fromReference:n=>n.applyMatrix3(Vu)},[ah]:{transfer:gt,primaries:Po,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Gu),fromReference:n=>n.applyMatrix3(Vu).convertLinearToSRGB()}},pm=new Set([Ci,oa]),ct={enabled:!0,_workingColorSpace:Ci,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!pm.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;let i=sr[e].toReference,s=sr[t].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return sr[n].primaries},getTransfer:function(n){return n===yi?Co:sr[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(sr[e].luminanceCoefficients)}};function Cs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Qa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var fs,_l=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fs===void 0&&(fs=Do("canvas")),fs.width=e.width,fs.height=e.height;let i=fs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=fs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Do("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Cs(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Cs(t[i]/255)*255):t[i]=Cs(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},mm=0,ko=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=br(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ec(s[a].image)):r.push(ec(s[a]))}else r=ec(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function ec(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_l.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var gm=0,xn=class n extends wi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=ji,s=ji,r=In,a=Ji,o=Dn,c=ai,h=n.DEFAULT_ANISOTROPY,l=yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=br(),this.name="",this.source=new ko(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Re(0,0),this.repeat=new Re(1,1),this.center=new Re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hc:e.x=e.x-Math.floor(e.x);break;case ji:e.x=e.x<0?0:1;break;case Vc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hc:e.y=e.y-Math.floor(e.y);break;case ji:e.y=e.y<0?0:1;break;case Vc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=Bd;xn.DEFAULT_ANISOTROPY=1;var bt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,h=c[0],l=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(l-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(h+1)/2,M=(p+1)/2,E=(f+1)/2,C=(l+d)/4,R=(u+_)/4,P=(g+m)/4;return v>M&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=C/i,r=R/i):M>E?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=C/s,r=P/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=R/r,s=P/r),this.set(i,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-l)*(d-l));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-_)/S,this.z=(d-l)/S,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},xl=class extends wi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:In,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new xn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new ko(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ci=class extends xl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Uo=class extends xn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var vl=class extends xn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ei=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],h=i[s+1],l=i[s+2],u=i[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==d||h!==p||l!==g){let m=1-o,f=c*d+h*p+l*g+u*_,S=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){let E=Math.sqrt(v),C=Math.atan2(E,f*S);m=Math.sin(m*C)/E,o=Math.sin(o*C)/E}let M=o*S;if(c=c*m+d*M,h=h*m+p*M,l=l*m+g*M,u=u*m+_*M,m===1-o){let E=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=E,h*=E,l*=E,u*=E}}e[t]=c,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],c=i[s+1],h=i[s+2],l=i[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+l*u+c*p-h*d,e[t+1]=c*g+l*d+h*u-o*p,e[t+2]=h*g+l*p+o*d-c*u,e[t+3]=l*g-o*u-c*d-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),l=o(s/2),u=o(r/2),d=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"YXZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"ZXY":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"ZYX":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"YZX":this._x=d*l*u+h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u-d*p*g;break;case"XZY":this._x=d*l*u-h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],l=t[6],u=t[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+l)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Vt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,l=t._w;return this._x=i*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-i*h,this._z=r*l+a*h+i*c-s*o,this._w=a*l-i*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-t)*l)/h,d=Math.sin(t*l)/h;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*i),l=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+c*h+a*u-o*l,this.y=i+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return tc.copy(this).projectOnVector(e),this.sub(tc)}reflect(e){return this.sub(tc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},tc=new I,Wu=new Ei,es=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Rn):Rn.fromBufferAttribute(r,a),Rn.applyMatrix4(e.matrixWorld),this.expandByPoint(Rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),jr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),jr.copy(i.boundingBox)),jr.applyMatrix4(e.matrixWorld),this.union(jr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rr),Jr.subVectors(this.max,rr),ps.subVectors(e.a,rr),ms.subVectors(e.b,rr),gs.subVectors(e.c,rr),pi.subVectors(ms,ps),mi.subVectors(gs,ms),Hi.subVectors(ps,gs);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Hi.z,Hi.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Hi.z,0,-Hi.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Hi.y,Hi.x,0];return!nc(t,ps,ms,gs,Jr)||(t=[1,0,0,0,1,0,0,0,1],!nc(t,ps,ms,gs,Jr))?!1:(Qr.crossVectors(pi,mi),t=[Qr.x,Qr.y,Qr.z],nc(t,ps,ms,gs,Jr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Jn=[new I,new I,new I,new I,new I,new I,new I,new I],Rn=new I,jr=new es,ps=new I,ms=new I,gs=new I,pi=new I,mi=new I,Hi=new I,rr=new I,Jr=new I,Qr=new I,Vi=new I;function nc(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Vi.fromArray(n,r);let o=s.x*Math.abs(Vi.x)+s.y*Math.abs(Vi.y)+s.z*Math.abs(Vi.z),c=e.dot(Vi),h=t.dot(Vi),l=i.dot(Vi);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}var _m=new es,or=new I,ic=new I,Ns=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):_m.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;or.subVectors(e,this.center);let t=or.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(or,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ic.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(or.copy(e.center).add(ic)),this.expandByPoint(or.copy(e.center).sub(ic))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Qn=new I,sc=new I,eo=new I,gi=new I,rc=new I,to=new I,oc=new I,mr=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qn.copy(this.origin).addScaledVector(this.direction,t),Qn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){sc.copy(e).add(t).multiplyScalar(.5),eo.copy(t).sub(e).normalize(),gi.copy(this.origin).sub(sc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(eo),o=gi.dot(this.direction),c=-gi.dot(eo),h=gi.lengthSq(),l=Math.abs(1-a*a),u,d,p,g;if(l>0)if(u=a*c-o,d=a*o-c,g=r*l,u>=0)if(d>=-g)if(d<=g){let _=1/l;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+h}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+h):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+h);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(sc).addScaledVector(eo,d),p}intersectSphere(e,t){Qn.subVectors(e.center,this.origin);let i=Qn.dot(this.direction),s=Qn.dot(Qn)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(i=(e.min.x-d.x)*h,s=(e.max.x-d.x)*h):(i=(e.max.x-d.x)*h,s=(e.min.x-d.x)*h),l>=0?(r=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(r=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Qn)!==null}intersectTriangle(e,t,i,s,r){rc.subVectors(t,e),to.subVectors(i,e),oc.crossVectors(rc,to);let a=this.direction.dot(oc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;gi.subVectors(this.origin,e);let c=o*this.direction.dot(to.crossVectors(gi,to));if(c<0)return null;let h=o*this.direction.dot(rc.cross(gi));if(h<0||c+h>a)return null;let l=-o*gi.dot(oc);return l<0?null:this.at(l/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vt=class n{constructor(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m)}set(e,t,i,s,r,a,o,c,h,l,u,d,p,g,_,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=h,f[6]=l,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/_s.setFromMatrixColumn(e,0).length(),r=1/_s.setFromMatrixColumn(e,1).length(),a=1/_s.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=-c*u,t[8]=h,t[1]=p+g*h,t[5]=d-_*h,t[9]=-o*c,t[2]=_-d*h,t[6]=g+p*h,t[10]=a*c}else if(e.order==="YXZ"){let d=c*l,p=c*u,g=h*l,_=h*u;t[0]=d+_*o,t[4]=g*o-p,t[8]=a*h,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=p*o-g,t[6]=_+d*o,t[10]=a*c}else if(e.order==="ZXY"){let d=c*l,p=c*u,g=h*l,_=h*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*l,t[9]=_-d*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let d=a*l,p=a*u,g=o*l,_=o*u;t[0]=c*l,t[4]=g*h-p,t[8]=d*h+_,t[1]=c*u,t[5]=_*h+d,t[9]=p*h-g,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let d=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=_-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-h*l,t[6]=p*u+g,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*c,p=a*h,g=o*c,_=o*h;t[0]=c*l,t[4]=-u,t[8]=h*l,t[1]=d*u+_,t[5]=a*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*l,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(xm,e,vm)}lookAt(e,t,i){let s=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),_i.crossVectors(i,hn),_i.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),_i.crossVectors(i,hn)),_i.normalize(),no.crossVectors(hn,_i),s[0]=_i.x,s[4]=no.x,s[8]=hn.x,s[1]=_i.y,s[5]=no.y,s[9]=hn.y,s[2]=_i.z,s[6]=no.z,s[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],l=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],S=i[3],v=i[7],M=i[11],E=i[15],C=s[0],R=s[4],P=s[8],N=s[12],y=s[1],w=s[5],F=s[9],B=s[13],W=s[2],ee=s[6],V=s[10],ie=s[14],q=s[3],de=s[7],xe=s[11],ye=s[15];return r[0]=a*C+o*y+c*W+h*q,r[4]=a*R+o*w+c*ee+h*de,r[8]=a*P+o*F+c*V+h*xe,r[12]=a*N+o*B+c*ie+h*ye,r[1]=l*C+u*y+d*W+p*q,r[5]=l*R+u*w+d*ee+p*de,r[9]=l*P+u*F+d*V+p*xe,r[13]=l*N+u*B+d*ie+p*ye,r[2]=g*C+_*y+m*W+f*q,r[6]=g*R+_*w+m*ee+f*de,r[10]=g*P+_*F+m*V+f*xe,r[14]=g*N+_*B+m*ie+f*ye,r[3]=S*C+v*y+M*W+E*q,r[7]=S*R+v*w+M*ee+E*de,r[11]=S*P+v*F+M*V+E*xe,r[15]=S*N+v*B+M*ie+E*ye,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],l=e[2],u=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*c*u-s*h*u-r*o*d+i*h*d+s*o*p-i*c*p)+_*(+t*c*p-t*h*d+r*a*d-s*a*p+s*h*l-r*c*l)+m*(+t*h*u-t*o*p-r*a*u+i*a*p+r*o*l-i*h*l)+f*(-s*o*l-t*c*u+t*o*d+s*a*u-i*a*d+i*c*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],l=e[8],u=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],S=u*m*h-_*d*h+_*c*p-o*m*p-u*c*f+o*d*f,v=g*d*h-l*m*h-g*c*p+a*m*p+l*c*f-a*d*f,M=l*_*h-g*u*h+g*o*p-a*_*p-l*o*f+a*u*f,E=g*u*c-l*_*c-g*o*d+a*_*d+l*o*m-a*u*m,C=t*S+i*v+s*M+r*E;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/C;return e[0]=S*R,e[1]=(_*d*r-u*m*r-_*s*p+i*m*p+u*s*f-i*d*f)*R,e[2]=(o*m*r-_*c*r+_*s*h-i*m*h-o*s*f+i*c*f)*R,e[3]=(u*c*r-o*d*r-u*s*h+i*d*h+o*s*p-i*c*p)*R,e[4]=v*R,e[5]=(l*m*r-g*d*r+g*s*p-t*m*p-l*s*f+t*d*f)*R,e[6]=(g*c*r-a*m*r-g*s*h+t*m*h+a*s*f-t*c*f)*R,e[7]=(a*d*r-l*c*r+l*s*h-t*d*h-a*s*p+t*c*p)*R,e[8]=M*R,e[9]=(g*u*r-l*_*r-g*i*p+t*_*p+l*i*f-t*u*f)*R,e[10]=(a*_*r-g*o*r+g*i*h-t*_*h-a*i*f+t*o*f)*R,e[11]=(l*o*r-a*u*r-l*i*h+t*u*h+a*i*p-t*o*p)*R,e[12]=E*R,e[13]=(l*_*s-g*u*s+g*i*d-t*_*d-l*i*m+t*u*m)*R,e[14]=(g*o*s-a*_*s-g*i*c+t*_*c+a*i*m-t*o*m)*R,e[15]=(a*u*s-l*o*s+l*i*c-t*u*c-a*i*d+t*o*d)*R,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,h=r*a,l=r*o;return this.set(h*a+i,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+i,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,l=a+a,u=o+o,d=r*h,p=r*l,g=r*u,_=a*l,m=a*u,f=o*u,S=c*h,v=c*l,M=c*u,E=i.x,C=i.y,R=i.z;return s[0]=(1-(_+f))*E,s[1]=(p+M)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(p-M)*C,s[5]=(1-(d+f))*C,s[6]=(m+S)*C,s[7]=0,s[8]=(g+v)*R,s[9]=(m-S)*R,s[10]=(1-(d+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=_s.set(s[0],s[1],s[2]).length(),a=_s.set(s[4],s[5],s[6]).length(),o=_s.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Cn.copy(this);let h=1/r,l=1/a,u=1/o;return Cn.elements[0]*=h,Cn.elements[1]*=h,Cn.elements[2]*=h,Cn.elements[4]*=l,Cn.elements[5]*=l,Cn.elements[6]*=l,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,t.setFromRotationMatrix(Cn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=oi){let c=this.elements,h=2*r/(t-e),l=2*r/(i-s),u=(t+e)/(t-e),d=(i+s)/(i-s),p,g;if(o===oi)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Io)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=oi){let c=this.elements,h=1/(t-e),l=1/(i-s),u=1/(a-r),d=(t+e)*h,p=(i+s)*l,g,_;if(o===oi)g=(a+r)*u,_=-2*u;else if(o===Io)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},_s=new I,Cn=new vt,xm=new I(0,0,0),vm=new I(1,1,1),_i=new I,no=new I,hn=new I,Ku=new vt,$u=new Ei,Wn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Vt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Vt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Vt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ku.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ku,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return $u.setFromEuler(this),this.setFromQuaternion($u,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Wn.DEFAULT_ORDER="XYZ";var gr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},ym=0,Xu=new I,xs=new Ei,ei=new vt,io=new I,ar=new I,Sm=new I,Mm=new Ei,qu=new I(1,0,0),Yu=new I(0,1,0),Zu=new I(0,0,1),ju={type:"added"},bm={type:"removed"},vs={type:"childadded",child:null},ac={type:"childremoved",child:null},$t=class n extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ym++}),this.uuid=br(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new Wn,i=new Ei,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new vt},normalMatrix:{value:new Ye}}),this.matrix=new vt,this.matrixWorld=new vt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xs.setFromAxisAngle(e,t),this.quaternion.multiply(xs),this}rotateOnWorldAxis(e,t){return xs.setFromAxisAngle(e,t),this.quaternion.premultiply(xs),this}rotateX(e){return this.rotateOnAxis(qu,e)}rotateY(e){return this.rotateOnAxis(Yu,e)}rotateZ(e){return this.rotateOnAxis(Zu,e)}translateOnAxis(e,t){return Xu.copy(e).applyQuaternion(this.quaternion),this.position.add(Xu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(qu,e)}translateY(e){return this.translateOnAxis(Yu,e)}translateZ(e){return this.translateOnAxis(Zu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?io.copy(e):io.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(ar,io,this.up):ei.lookAt(io,ar,this.up),this.quaternion.setFromRotationMatrix(ei),s&&(ei.extractRotation(s.matrixWorld),xs.setFromRotationMatrix(ei),this.quaternion.premultiply(xs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ju),vs.child=e,this.dispatchEvent(vs),vs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bm),ac.child=e,this.dispatchEvent(ac),ac.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ju),vs.child=e,this.dispatchEvent(vs),vs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,e,Sm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,Mm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){let u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),h=a(e.textures),l=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let h in o){let l=o[h];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};$t.DEFAULT_UP=new I(0,1,0);$t.DEFAULT_MATRIX_AUTO_UPDATE=!0;$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ln=new I,ti=new I,cc=new I,ni=new I,ys=new I,Ss=new I,Ju=new I,lc=new I,hc=new I,uc=new I,dc=new bt,fc=new bt,pc=new bt,Yi=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Ln.subVectors(e,t),s.cross(Ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Ln.subVectors(s,t),ti.subVectors(i,t),cc.subVectors(e,t);let a=Ln.dot(Ln),o=Ln.dot(ti),c=Ln.dot(cc),h=ti.dot(ti),l=ti.dot(cc),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(h*c-o*l)*d,g=(a*l-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,ni)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ni.x),c.addScaledVector(a,ni.y),c.addScaledVector(o,ni.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return dc.setScalar(0),fc.setScalar(0),pc.setScalar(0),dc.fromBufferAttribute(e,t),fc.fromBufferAttribute(e,i),pc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(dc,r.x),a.addScaledVector(fc,r.y),a.addScaledVector(pc,r.z),a}static isFrontFacing(e,t,i,s){return Ln.subVectors(i,t),ti.subVectors(e,t),Ln.cross(ti).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Ln.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;ys.subVectors(s,i),Ss.subVectors(r,i),lc.subVectors(e,i);let c=ys.dot(lc),h=Ss.dot(lc);if(c<=0&&h<=0)return t.copy(i);hc.subVectors(e,s);let l=ys.dot(hc),u=Ss.dot(hc);if(l>=0&&u<=l)return t.copy(s);let d=c*u-l*h;if(d<=0&&c>=0&&l<=0)return a=c/(c-l),t.copy(i).addScaledVector(ys,a);uc.subVectors(e,r);let p=ys.dot(uc),g=Ss.dot(uc);if(g>=0&&p<=g)return t.copy(r);let _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),t.copy(i).addScaledVector(Ss,o);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return Ju.subVectors(r,s),o=(u-l)/(u-l+(p-g)),t.copy(s).addScaledVector(Ju,o);let f=1/(m+_+d);return a=_*f,o=d*f,t.copy(i).addScaledVector(ys,a).addScaledVector(Ss,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xi={h:0,s:0,l:0},so={h:0,s:0,l:0};function mc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ze=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Vn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=ct.workingColorSpace){return this.r=e,this.g=t,this.b=i,ct.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=ct.workingColorSpace){if(e=lm(e,1),t=Vt(t,0,1),i=Vt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=mc(a,r,e+1/3),this.g=mc(a,r,e),this.b=mc(a,r,e-1/3)}return ct.toWorkingColorSpace(this,s),this}setStyle(e,t=Vn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Vn){let i=Qd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}copyLinearToSRGB(e){return this.r=Qa(e.r),this.g=Qa(e.g),this.b=Qa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vn){return ct.fromWorkingColorSpace(Kt.copy(this),e),Math.round(Vt(Kt.r*255,0,255))*65536+Math.round(Vt(Kt.g*255,0,255))*256+Math.round(Vt(Kt.b*255,0,255))}getHexString(e=Vn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ct.workingColorSpace){ct.fromWorkingColorSpace(Kt.copy(this),t);let i=Kt.r,s=Kt.g,r=Kt.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,h,l=(o+a)/2;if(o===a)c=0,h=0;else{let u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=l,e}getRGB(e,t=ct.workingColorSpace){return ct.fromWorkingColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=Vn){ct.fromWorkingColorSpace(Kt.copy(this),e);let t=Kt.r,i=Kt.g,s=Kt.b;return e!==Vn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(xi),this.setHSL(xi.h+e,xi.s+t,xi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(xi),e.getHSL(so);let i=ja(xi.h,so.h,t),s=ja(xi.s,so.s,t),r=ja(xi.l,so.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new Ze;Ze.NAMES=Qd;var wm=0,Ai=class extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=br(),this.name="",this.type="Material",this.blending=Ts,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lc,this.blendDst=Pc,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ou,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(i.blending=this.blending),this.side!==bi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Lc&&(i.blendSrc=this.blendSrc),this.blendDst!==Pc&&(i.blendDst=this.blendDst),this.blendEquation!==qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ps&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ou&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},kn=class extends Ai{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.combine=Od,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Lt=new I,ro=new Re,nn=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Bu,this.updateRanges=[],this.gpuType=ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ro.fromBufferAttribute(this,t),ro.applyMatrix3(e),this.setXY(t,ro.x,ro.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ir(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=en(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ir(t,this.array)),t}setX(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ir(t,this.array)),t}setY(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ir(t,this.array)),t}setZ(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ir(t,this.array)),t}setW(e,t){return this.normalized&&(t=en(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array),s=en(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=en(t,this.array),i=en(i,this.array),s=en(s,this.array),r=en(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Bu&&(e.usage=this.usage),e}};var No=class extends nn{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Fo=class extends nn{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var _t=class extends nn{constructor(e,t,i){super(new Float32Array(e),t,i)}},Em=0,gn=new vt,gc=new $t,Ms=new I,un=new es,cr=new es,Ft=new I,Xt=class n extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=br(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jd(e)?Fo:No)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Ye().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return gn.makeRotationFromQuaternion(e),this.applyMatrix4(gn),this}rotateX(e){return gn.makeRotationX(e),this.applyMatrix4(gn),this}rotateY(e){return gn.makeRotationY(e),this.applyMatrix4(gn),this}rotateZ(e){return gn.makeRotationZ(e),this.applyMatrix4(gn),this}translate(e,t,i){return gn.makeTranslation(e,t,i),this.applyMatrix4(gn),this}scale(e,t,i){return gn.makeScale(e,t,i),this.applyMatrix4(gn),this}lookAt(e){return gc.lookAt(e),gc.updateMatrix(),this.applyMatrix4(gc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ms).negate(),this.translate(Ms.x,Ms.y,Ms.z),this}setFromPoints(e){let t=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new _t(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];un.setFromBufferAttribute(r),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ns);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];cr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(un.min,cr.min),un.expandByPoint(Ft),Ft.addVectors(un.max,cr.max),un.expandByPoint(Ft)):(un.expandByPoint(cr.min),un.expandByPoint(cr.max))}un.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ft.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ft));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Ft.fromBufferAttribute(o,h),c&&(Ms.fromBufferAttribute(e,h),Ft.add(Ms)),s=Math.max(s,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<i.count;P++)o[P]=new I,c[P]=new I;let h=new I,l=new I,u=new I,d=new Re,p=new Re,g=new Re,_=new I,m=new I;function f(P,N,y){h.fromBufferAttribute(i,P),l.fromBufferAttribute(i,N),u.fromBufferAttribute(i,y),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,N),g.fromBufferAttribute(r,y),l.sub(h),u.sub(h),p.sub(d),g.sub(d);let w=1/(p.x*g.y-g.x*p.y);isFinite(w)&&(_.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(w),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(w),o[P].add(_),o[N].add(_),o[y].add(_),c[P].add(m),c[N].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let P=0,N=S.length;P<N;++P){let y=S[P],w=y.start,F=y.count;for(let B=w,W=w+F;B<W;B+=3)f(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let v=new I,M=new I,E=new I,C=new I;function R(P){E.fromBufferAttribute(s,P),C.copy(E);let N=o[P];v.copy(N),v.sub(E.multiplyScalar(E.dot(N))).normalize(),M.crossVectors(C,N);let w=M.dot(c[P])<0?-1:1;a.setXYZW(P,v.x,v.y,v.z,w)}for(let P=0,N=S.length;P<N;++P){let y=S[P],w=y.start,F=y.count;for(let B=w,W=w+F;B<W;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new nn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new I,r=new I,a=new I,o=new I,c=new I,h=new I,l=new I,u=new I;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,m),o.add(l),c.add(l),h.add(l),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),i.setXYZ(d+0,l.x,l.y,l.z),i.setXYZ(d+1,l.x,l.y,l.z),i.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,c){let h=o.array,l=o.itemSize,u=o.normalized,d=new h.constructor(c.length*l),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*l;for(let f=0;f<l;f++)d[g++]=h[p++]}return new nn(d,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=e(c,i);t.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){let d=h[l],p=e(d,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let h=i[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],l=[];for(let u=0,d=h.length;u<d;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(s[c]=l,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let h in s){let l=s[h];this.setAttribute(h,l.clone(t))}let r=e.morphAttributes;for(let h in r){let l=[],u=r[h];for(let d=0,p=u.length;d<p;d++)l.push(u[d].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,l=a.length;h<l;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qu=new vt,Gi=new mr,oo=new Ns,ed=new I,ao=new I,co=new I,lo=new I,_c=new I,ho=new I,td=new I,uo=new I,wt=class extends $t{constructor(e=new Xt,t=new kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){ho.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let l=o[c],u=r[c];l!==0&&(_c.fromBufferAttribute(u,e),a?ho.addScaledVector(_c,l):ho.addScaledVector(_c.sub(t),l))}t.add(ho)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),oo.copy(i.boundingSphere),oo.applyMatrix4(r),Gi.copy(e.ray).recast(e.near),!(oo.containsPoint(Gi.origin)===!1&&(Gi.intersectSphere(oo,ed)===null||Gi.origin.distanceToSquared(ed)>(e.far-e.near)**2))&&(Qu.copy(r).invert(),Gi.copy(e.ray).applyMatrix4(Qu),!(i.boundingBox!==null&&Gi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Gi)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,E=v;M<E;M+=3){let C=o.getX(M),R=o.getX(M+1),P=o.getX(M+2);s=fo(this,f,e,i,h,l,u,C,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=o.getX(m),v=o.getX(m+1),M=o.getX(m+2);s=fo(this,a,e,i,h,l,u,S,v,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=S,E=v;M<E;M+=3){let C=M,R=M+1,P=M+2;s=fo(this,f,e,i,h,l,u,C,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let S=m,v=m+1,M=m+2;s=fo(this,a,e,i,h,l,u,S,v,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Am(n,e,t,i,s,r,a,o){let c;if(e.side===tn?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===bi,o),c===null)return null;uo.copy(o),uo.applyMatrix4(n.matrixWorld);let h=t.ray.origin.distanceTo(uo);return h<t.near||h>t.far?null:{distance:h,point:uo.clone(),object:n}}function fo(n,e,t,i,s,r,a,o,c,h){n.getVertexPosition(o,ao),n.getVertexPosition(c,co),n.getVertexPosition(h,lo);let l=Am(n,e,t,i,ao,co,lo,td);if(l){let u=new I;Yi.getBarycoord(td,ao,co,lo,u),s&&(l.uv=Yi.getInterpolatedAttribute(s,o,c,h,u,new Re)),r&&(l.uv1=Yi.getInterpolatedAttribute(r,o,c,h,u,new Re)),a&&(l.normal=Yi.getInterpolatedAttribute(a,o,c,h,u,new I),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));let d={a:o,b:c,c:h,normal:new I,materialIndex:0};Yi.getNormal(ao,co,lo,d.normal),l.face=d,l.barycoord=u}return l}var _r=class n extends Xt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],l=[],u=[],d=0,p=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new _t(h,3)),this.setAttribute("normal",new _t(l,3)),this.setAttribute("uv",new _t(u,2));function g(_,m,f,S,v,M,E,C,R,P,N){let y=M/R,w=E/P,F=M/2,B=E/2,W=C/2,ee=R+1,V=P+1,ie=0,q=0,de=new I;for(let xe=0;xe<V;xe++){let ye=xe*w-B;for(let et=0;et<ee;et++){let it=et*y-F;de[_]=it*S,de[m]=ye*v,de[f]=W,h.push(de.x,de.y,de.z),de[_]=0,de[m]=0,de[f]=C>0?1:-1,l.push(de.x,de.y,de.z),u.push(et/R),u.push(1-xe/P),ie+=1}}for(let xe=0;xe<P;xe++)for(let ye=0;ye<R;ye++){let et=d+ye+ee*xe,it=d+ye+ee*(xe+1),Z=d+(ye+1)+ee*(xe+1),se=d+(ye+1)+ee*xe;c.push(et,it,se),c.push(it,Z,se),q+=6}o.addGroup(p,q,N),p+=q,d+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Fs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Yt(n){let e={};for(let t=0;t<n.length;t++){let i=Fs(n[t]);for(let s in i)e[s]=i[s]}return e}function Tm(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ef(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}var Rm={clone:Fs,merge:Yt},Cm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Kn=class extends Ai{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cm,this.fragmentShader=Lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fs(e.uniforms),this.uniformsGroups=Tm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Oo=class extends $t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new vt,this.projectionMatrix=new vt,this.projectionMatrixInverse=new vt,this.coordinateSystem=oi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},vi=new I,nd=new Re,id=new Re,Zt=class extends Oo{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=gl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Za*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gl*2*Math.atan(Math.tan(Za*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vi.x,vi.y).multiplyScalar(-e/vi.z),vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(vi.x,vi.y).multiplyScalar(-e/vi.z)}getViewSize(e,t){return this.getViewBounds(e,nd,id),t.subVectors(id,nd)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Za*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/h,s*=a.width/c,i*=a.height/h}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},bs=-90,ws=1,yl=class extends $t{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Zt(bs,ws,e,t);s.layers=this.layers,this.add(s);let r=new Zt(bs,ws,e,t);r.layers=this.layers,this.add(r);let a=new Zt(bs,ws,e,t);a.layers=this.layers,this.add(a);let o=new Zt(bs,ws,e,t);o.layers=this.layers,this.add(o);let c=new Zt(bs,ws,e,t);c.layers=this.layers,this.add(c);let h=new Zt(bs,ws,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(let h of t)this.remove(h);if(e===oi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Io)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(u,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Bo=class extends xn{constructor(e,t,i,s,r,a,o,c,h,l){e=e!==void 0?e:[],t=t!==void 0?t:Is,super(e,t,i,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Sl=class extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bo(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:In}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new _r(5,5,5),r=new Kn({name:"CubemapFromEquirect",uniforms:Fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:tn,blending:Si});r.uniforms.tEquirect.value=t;let a=new wt(s,r),o=t.minFilter;return t.minFilter===Ji&&(t.minFilter=In),new yl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},xc=new I,Pm=new I,Im=new Ye,Pn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=xc.subVectors(i,t).cross(Pm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(xc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Im.getNormalMatrix(e),s=this.coplanarPoint(xc).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Wi=new Ns,po=new I,xr=class{constructor(e=new Pn,t=new Pn,i=new Pn,s=new Pn,r=new Pn,a=new Pn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=oi){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],S=s[13],v=s[14],M=s[15];if(i[0].setComponents(c-r,d-h,m-p,M-f).normalize(),i[1].setComponents(c+r,d+h,m+p,M+f).normalize(),i[2].setComponents(c+a,d+l,m+g,M+S).normalize(),i[3].setComponents(c-a,d-l,m-g,M-S).normalize(),i[4].setComponents(c-o,d-u,m-_,M-v).normalize(),t===oi)i[5].setComponents(c+o,d+u,m+_,M+v).normalize();else if(t===Io)i[5].setComponents(o,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Wi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Wi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Wi)}intersectsSprite(e){return Wi.center.set(0,0,0),Wi.radius=.7071067811865476,Wi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Wi)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(po.x=s.normal.x>0?e.max.x:e.min.x,po.y=s.normal.y>0?e.max.y:e.min.y,po.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(po)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function tf(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Dm(n){let e=new WeakMap;function t(o,c){let h=o.array,l=o.usage,u=h.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,h,l),o.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,h){let l=c.array,u=c.updateRanges;if(n.bindBuffer(h,o),u.length===0)n.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let _=u[p];n.bufferSubData(h,_.start*l.BYTES_PER_ELEMENT,l,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let l=e.get(o);(!l||l.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Os=class n extends Xt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),h=o+1,l=c+1,u=e/o,d=t/c,p=[],g=[],_=[],m=[];for(let f=0;f<l;f++){let S=f*d-a;for(let v=0;v<h;v++){let M=v*u-r;g.push(M,-S,0),_.push(0,0,1),m.push(v/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<o;S++){let v=S+h*f,M=S+h*(f+1),E=S+1+h*(f+1),C=S+1+h*f;p.push(v,M,C),p.push(M,E,C)}this.setIndex(p),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(_,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},km=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Um=`#ifdef USE_ALPHAHASH
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
#endif`,Nm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zm=`#ifdef USE_AOMAP
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
#endif`,Hm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vm=`#ifdef USE_BATCHING
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
#endif`,Gm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$m=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Xm=`#ifdef USE_IRIDESCENCE
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
#endif`,qm=`#ifdef USE_BUMPMAP
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
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ng=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ig=`#define PI 3.141592653589793
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
} // validated`,sg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rg=`vec3 transformedNormal = objectNormal;
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
#endif`,og=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ag=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hg="gl_FragColor = linearToOutputTexel( gl_FragColor );",ug=`
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
}`,dg=`#ifdef USE_ENVMAP
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
#endif`,fg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,pg=`#ifdef USE_ENVMAP
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
#endif`,mg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gg=`#ifdef USE_ENVMAP
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
#endif`,_g=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sg=`#ifdef USE_GRADIENTMAP
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
}`,Mg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Eg=`uniform bool receiveShadow;
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
#endif`,Ag=`#ifdef USE_ENVMAP
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
#endif`,Tg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pg=`PhysicalMaterial material;
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
#endif`,Ig=`struct PhysicalMaterial {
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
}`,Dg=`
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
#endif`,kg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ug=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ng=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,zg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gg=`#if defined( USE_POINTS_UV )
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
#endif`,Wg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$g=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yg=`#ifdef USE_MORPHTARGETS
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
#endif`,Zg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Jg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Qg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,e0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,t0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,n0=`#ifdef USE_NORMALMAP
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
#endif`,i0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,s0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,r0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,a0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,c0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,l0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,h0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,u0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,d0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,f0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,p0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,m0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,g0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,x0=`float getShadowMask() {
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
}`,v0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,y0=`#ifdef USE_SKINNING
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
#endif`,S0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,M0=`#ifdef USE_SKINNING
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
#endif`,b0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,w0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,E0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,A0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,T0=`#ifdef USE_TRANSMISSION
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
#endif`,R0=`#ifdef USE_TRANSMISSION
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
#endif`,C0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,L0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,D0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,k0=`uniform sampler2D t2D;
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
}`,U0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,F0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`#include <common>
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
}`,z0=`#if DEPTH_PACKING == 3200
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
}`,H0=`#define DISTANCE
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
}`,V0=`#define DISTANCE
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
}`,G0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,W0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`uniform float scale;
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
}`,$0=`uniform vec3 diffuse;
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
}`,X0=`#include <common>
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
}`,q0=`uniform vec3 diffuse;
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
}`,Y0=`#define LAMBERT
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
}`,Z0=`#define LAMBERT
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
}`,j0=`#define MATCAP
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
}`,J0=`#define MATCAP
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
}`,Q0=`#define NORMAL
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
}`,e_=`#define NORMAL
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
}`,t_=`#define PHONG
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
}`,n_=`#define PHONG
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
}`,i_=`#define STANDARD
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
}`,s_=`#define STANDARD
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
}`,r_=`#define TOON
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
}`,o_=`#define TOON
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
}`,a_=`uniform float size;
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
}`,c_=`uniform vec3 diffuse;
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
}`,l_=`#include <common>
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
}`,h_=`uniform vec3 color;
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
}`,u_=`uniform float rotation;
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
}`,d_=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:km,alphahash_pars_fragment:Um,alphamap_fragment:Nm,alphamap_pars_fragment:Fm,alphatest_fragment:Om,alphatest_pars_fragment:Bm,aomap_fragment:zm,aomap_pars_fragment:Hm,batching_pars_vertex:Vm,batching_vertex:Gm,begin_vertex:Wm,beginnormal_vertex:Km,bsdfs:$m,iridescence_fragment:Xm,bumpmap_pars_fragment:qm,clipping_planes_fragment:Ym,clipping_planes_pars_fragment:Zm,clipping_planes_pars_vertex:jm,clipping_planes_vertex:Jm,color_fragment:Qm,color_pars_fragment:eg,color_pars_vertex:tg,color_vertex:ng,common:ig,cube_uv_reflection_fragment:sg,defaultnormal_vertex:rg,displacementmap_pars_vertex:og,displacementmap_vertex:ag,emissivemap_fragment:cg,emissivemap_pars_fragment:lg,colorspace_fragment:hg,colorspace_pars_fragment:ug,envmap_fragment:dg,envmap_common_pars_fragment:fg,envmap_pars_fragment:pg,envmap_pars_vertex:mg,envmap_physical_pars_fragment:Ag,envmap_vertex:gg,fog_vertex:_g,fog_pars_vertex:xg,fog_fragment:vg,fog_pars_fragment:yg,gradientmap_pars_fragment:Sg,lightmap_pars_fragment:Mg,lights_lambert_fragment:bg,lights_lambert_pars_fragment:wg,lights_pars_begin:Eg,lights_toon_fragment:Tg,lights_toon_pars_fragment:Rg,lights_phong_fragment:Cg,lights_phong_pars_fragment:Lg,lights_physical_fragment:Pg,lights_physical_pars_fragment:Ig,lights_fragment_begin:Dg,lights_fragment_maps:kg,lights_fragment_end:Ug,logdepthbuf_fragment:Ng,logdepthbuf_pars_fragment:Fg,logdepthbuf_pars_vertex:Og,logdepthbuf_vertex:Bg,map_fragment:zg,map_pars_fragment:Hg,map_particle_fragment:Vg,map_particle_pars_fragment:Gg,metalnessmap_fragment:Wg,metalnessmap_pars_fragment:Kg,morphinstance_vertex:$g,morphcolor_vertex:Xg,morphnormal_vertex:qg,morphtarget_pars_vertex:Yg,morphtarget_vertex:Zg,normal_fragment_begin:jg,normal_fragment_maps:Jg,normal_pars_fragment:Qg,normal_pars_vertex:e0,normal_vertex:t0,normalmap_pars_fragment:n0,clearcoat_normal_fragment_begin:i0,clearcoat_normal_fragment_maps:s0,clearcoat_pars_fragment:r0,iridescence_pars_fragment:o0,opaque_fragment:a0,packing:c0,premultiplied_alpha_fragment:l0,project_vertex:h0,dithering_fragment:u0,dithering_pars_fragment:d0,roughnessmap_fragment:f0,roughnessmap_pars_fragment:p0,shadowmap_pars_fragment:m0,shadowmap_pars_vertex:g0,shadowmap_vertex:_0,shadowmask_pars_fragment:x0,skinbase_vertex:v0,skinning_pars_vertex:y0,skinning_vertex:S0,skinnormal_vertex:M0,specularmap_fragment:b0,specularmap_pars_fragment:w0,tonemapping_fragment:E0,tonemapping_pars_fragment:A0,transmission_fragment:T0,transmission_pars_fragment:R0,uv_pars_fragment:C0,uv_pars_vertex:L0,uv_vertex:P0,worldpos_vertex:I0,background_vert:D0,background_frag:k0,backgroundCube_vert:U0,backgroundCube_frag:N0,cube_vert:F0,cube_frag:O0,depth_vert:B0,depth_frag:z0,distanceRGBA_vert:H0,distanceRGBA_frag:V0,equirect_vert:G0,equirect_frag:W0,linedashed_vert:K0,linedashed_frag:$0,meshbasic_vert:X0,meshbasic_frag:q0,meshlambert_vert:Y0,meshlambert_frag:Z0,meshmatcap_vert:j0,meshmatcap_frag:J0,meshnormal_vert:Q0,meshnormal_frag:e_,meshphong_vert:t_,meshphong_frag:n_,meshphysical_vert:i_,meshphysical_frag:s_,meshtoon_vert:r_,meshtoon_frag:o_,points_vert:a_,points_frag:c_,shadow_vert:l_,shadow_frag:h_,sprite_vert:u_,sprite_frag:d_},he={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new Re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Gn={basic:{uniforms:Yt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Yt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ze(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Yt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Yt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Yt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ze(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Yt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Yt([he.points,he.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Yt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Yt([he.common,he.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Yt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Yt([he.sprite,he.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Yt([he.common,he.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Yt([he.lights,he.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};Gn.physical={uniforms:Yt([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new Re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new Re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new Re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};var mo={r:0,b:0,g:0},Ki=new Wn,f_=new vt;function p_(n,e,t,i,s,r,a){let o=new Ze(0),c=r===!0?0:1,h,l,u=null,d=0,p=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function _(S){let v=!1,M=g(S);M===null?f(o,c):M&&M.isColor&&(f(M,1),v=!0);let E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,v){let M=g(v);M&&(M.isCubeTexture||M.mapping===ra)?(l===void 0&&(l=new wt(new _r(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:Fs(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),Ki.copy(v.backgroundRotation),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(f_.makeRotationFromEuler(Ki)),l.material.toneMapped=ct.getTransfer(M.colorSpace)!==gt,(u!==M||d!==M.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,p=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new wt(new Os(2,2),new Kn({name:"BackgroundMaterial",uniforms:Fs(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=ct.getTransfer(M.colorSpace)!==gt,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=M,d=M.version,p=n.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null))}function f(S,v){S.getRGB(mo,ef(n)),i.buffers.color.setClear(mo.r,mo.g,mo.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(S,v=1){o.set(S),c=v,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,f(o,c)},render:_,addToRenderList:m}}function m_(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,a=!1;function o(y,w,F,B,W){let ee=!1,V=u(B,F,w);r!==V&&(r=V,h(r.object)),ee=p(y,B,F,W),ee&&g(y,B,F,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),(ee||a)&&(a=!1,M(y,w,F,B),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return n.createVertexArray()}function h(y){return n.bindVertexArray(y)}function l(y){return n.deleteVertexArray(y)}function u(y,w,F){let B=F.wireframe===!0,W=i[y.id];W===void 0&&(W={},i[y.id]=W);let ee=W[w.id];ee===void 0&&(ee={},W[w.id]=ee);let V=ee[B];return V===void 0&&(V=d(c()),ee[B]=V),V}function d(y){let w=[],F=[],B=[];for(let W=0;W<t;W++)w[W]=0,F[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:F,attributeDivisors:B,object:y,attributes:{},index:null}}function p(y,w,F,B){let W=r.attributes,ee=w.attributes,V=0,ie=F.getAttributes();for(let q in ie)if(ie[q].location>=0){let xe=W[q],ye=ee[q];if(ye===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(ye=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(ye=y.instanceColor)),xe===void 0||xe.attribute!==ye||ye&&xe.data!==ye.data)return!0;V++}return r.attributesNum!==V||r.index!==B}function g(y,w,F,B){let W={},ee=w.attributes,V=0,ie=F.getAttributes();for(let q in ie)if(ie[q].location>=0){let xe=ee[q];xe===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(xe=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(xe=y.instanceColor));let ye={};ye.attribute=xe,xe&&xe.data&&(ye.data=xe.data),W[q]=ye,V++}r.attributes=W,r.attributesNum=V,r.index=B}function _(){let y=r.newAttributes;for(let w=0,F=y.length;w<F;w++)y[w]=0}function m(y){f(y,0)}function f(y,w){let F=r.newAttributes,B=r.enabledAttributes,W=r.attributeDivisors;F[y]=1,B[y]===0&&(n.enableVertexAttribArray(y),B[y]=1),W[y]!==w&&(n.vertexAttribDivisor(y,w),W[y]=w)}function S(){let y=r.newAttributes,w=r.enabledAttributes;for(let F=0,B=w.length;F<B;F++)w[F]!==y[F]&&(n.disableVertexAttribArray(F),w[F]=0)}function v(y,w,F,B,W,ee,V){V===!0?n.vertexAttribIPointer(y,w,F,W,ee):n.vertexAttribPointer(y,w,F,B,W,ee)}function M(y,w,F,B){_();let W=B.attributes,ee=F.getAttributes(),V=w.defaultAttributeValues;for(let ie in ee){let q=ee[ie];if(q.location>=0){let de=W[ie];if(de===void 0&&(ie==="instanceMatrix"&&y.instanceMatrix&&(de=y.instanceMatrix),ie==="instanceColor"&&y.instanceColor&&(de=y.instanceColor)),de!==void 0){let xe=de.normalized,ye=de.itemSize,et=e.get(de);if(et===void 0)continue;let it=et.buffer,Z=et.type,se=et.bytesPerElement,we=Z===n.INT||Z===n.UNSIGNED_INT||de.gpuType===th;if(de.isInterleavedBufferAttribute){let ve=de.data,We=ve.stride,ke=de.offset;if(ve.isInstancedInterleavedBuffer){for(let Ke=0;Ke<q.locationSize;Ke++)f(q.location+Ke,ve.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let Ke=0;Ke<q.locationSize;Ke++)m(q.location+Ke);n.bindBuffer(n.ARRAY_BUFFER,it);for(let Ke=0;Ke<q.locationSize;Ke++)v(q.location+Ke,ye/q.locationSize,Z,xe,We*se,(ke+ye/q.locationSize*Ke)*se,we)}else{if(de.isInstancedBufferAttribute){for(let ve=0;ve<q.locationSize;ve++)f(q.location+ve,de.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let ve=0;ve<q.locationSize;ve++)m(q.location+ve);n.bindBuffer(n.ARRAY_BUFFER,it);for(let ve=0;ve<q.locationSize;ve++)v(q.location+ve,ye/q.locationSize,Z,xe,ye*se,ye/q.locationSize*ve*se,we)}}else if(V!==void 0){let xe=V[ie];if(xe!==void 0)switch(xe.length){case 2:n.vertexAttrib2fv(q.location,xe);break;case 3:n.vertexAttrib3fv(q.location,xe);break;case 4:n.vertexAttrib4fv(q.location,xe);break;default:n.vertexAttrib1fv(q.location,xe)}}}}S()}function E(){P();for(let y in i){let w=i[y];for(let F in w){let B=w[F];for(let W in B)l(B[W].object),delete B[W];delete w[F]}delete i[y]}}function C(y){if(i[y.id]===void 0)return;let w=i[y.id];for(let F in w){let B=w[F];for(let W in B)l(B[W].object),delete B[W];delete w[F]}delete i[y.id]}function R(y){for(let w in i){let F=i[w];if(F[y.id]===void 0)continue;let B=F[y.id];for(let W in B)l(B[W].object),delete B[W];delete F[y.id]}}function P(){N(),a=!0,r!==s&&(r=s,h(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:N,dispose:E,releaseStatesOfGeometry:C,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function g_(n,e,t){let i;function s(h){i=h}function r(h,l){n.drawArrays(i,h,l),t.update(l,i,1)}function a(h,l,u){u!==0&&(n.drawArraysInstanced(i,h,l,u),t.update(l,i,u))}function o(h,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,i,1)}function c(h,l,u,d){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<h.length;g++)a(h[g],l[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,l,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=l[_];for(let _=0;_<d.length;_++)t.update(g,i,d[_])}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function __(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Dn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let P=R===Mr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==ai&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ri&&!P)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=c(h);l!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){let R=e.get("EXT_clip_control");R.clipControlEXT(R.LOWER_LEFT_EXT,R.ZERO_TO_ONE_EXT)}let p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:E,maxSamples:C}}function x_(n){let e=this,t=null,i=0,s=!1,r=!1,a=new Pn,o=new Ye,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=l(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{let S=r?0:i,v=S*4,M=f.clippingState||null;c.value=M,M=l(g,d,v,p);for(let E=0;E!==v;++E)M[E]=t[E];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,M=p;v!==_;++v,M+=4)a.copy(u[v]).applyMatrix4(S,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function v_(n){let e=new WeakMap;function t(a,o){return o===Bc?a.mapping=Is:o===zc&&(a.mapping=Ds),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Bc||o===zc)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new Sl(c.height);return h.fromEquirectangularTexture(n,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var zo=class extends Oo{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},As=4,sd=[.125,.215,.35,.446,.526,.582],Zi=20,vc=new zo,rd=new Ze,yc=null,Sc=0,Mc=0,bc=!1,Xi=(1+Math.sqrt(5))/2,Es=1/Xi,od=[new I(-Xi,Es,0),new I(Xi,Es,0),new I(-Es,0,Xi),new I(Es,0,Xi),new I(0,Xi,-Es),new I(0,Xi,Es),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Ho=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){yc=this._renderer.getRenderTarget(),Sc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),bc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ld(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(yc,Sc,Mc),this._renderer.xr.enabled=bc,e.scissorTest=!1,go(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Is||e.mapping===Ds?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yc=this._renderer.getRenderTarget(),Sc=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),bc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:In,minFilter:In,generateMipmaps:!1,type:Mr,format:Dn,colorSpace:Ci,depthBuffer:!1},s=ad(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ad(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=y_(r)),this._blurMaterial=S_(r,e,t)}return s}_compileMaterial(e){let t=new wt(this._lodPlanes[0],e);this._renderer.compile(t,vc)}_sceneToCubeUV(e,t,i,s){let o=new Zt(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,d=l.toneMapping;l.getClearColor(rd),l.toneMapping=Mi,l.autoClear=!1;let p=new kn({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),g=new wt(new _r,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(rd),_=!0);for(let f=0;f<6;f++){let S=f%3;S===0?(o.up.set(0,c[f],0),o.lookAt(h[f],0,0)):S===1?(o.up.set(0,0,c[f]),o.lookAt(0,h[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,h[f]));let v=this._cubeSize;go(s,S*v,f>2?v:0,v,v),l.setRenderTarget(s),_&&l.render(g,o),l.render(e,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=d,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Is||e.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ld()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new wt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;go(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,vc)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=od[(s-r-1)%od.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new wt(this._lodPlanes[s],h),d=h.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Zi-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):Zi;m>Zi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zi}`);let f=[],S=0;for(let R=0;R<Zi;++R){let P=R/_,N=Math.exp(-P*P/2);f.push(N),R===0?S+=N:R<m&&(S+=2*N)}for(let R=0;R<f.length;R++)f[R]=f[R]/S;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-i;let M=this._sizeLods[s],E=3*M*(s>v-As?s-v+As:0),C=4*(this._cubeSize-M);go(t,E,C,3*M,2*M),c.setRenderTarget(t),c.render(u,vc)}};function y_(n){let e=[],t=[],i=[],s=n,r=n-As+1+sd.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>n-As?c=sd[a-n+As-1]:a===0&&(c=0),i.push(c);let h=1/(o-2),l=-h,u=1+h,d=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,f=1,S=new Float32Array(_*g*p),v=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let C=0;C<p;C++){let R=C%3*2/3-1,P=C>2?0:-1,N=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];S.set(N,_*g*C),v.set(d,m*g*C);let y=[C,C,C,C,C,C];M.set(y,f*g*C)}let E=new Xt;E.setAttribute("position",new nn(S,_)),E.setAttribute("uv",new nn(v,m)),E.setAttribute("faceIndex",new nn(M,f)),e.push(E),s>As&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function ad(n,e,t){let i=new ci(n,e,t);return i.texture.mapping=ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function go(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function S_(n,e,t){let i=new Float32Array(Zi),s=new I(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:Zi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ch(),fragmentShader:`

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
		`,blending:Si,depthTest:!1,depthWrite:!1})}function cd(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ch(),fragmentShader:`

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
		`,blending:Si,depthTest:!1,depthWrite:!1})}function ld(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ch(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function ch(){return`

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
	`}function M_(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let c=o.mapping,h=c===Bc||c===zc,l=c===Is||c===Ds;if(h||l){let u=e.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Ho(n)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return h&&p&&p.height>0||l&&p&&s(p)?(t===null&&(t=new Ho(n)),u=h?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function b_(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&To("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function w_(n,e,t,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)e.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)e.update(d[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)e.update(_[m],n.ARRAY_BUFFER)}}function h(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let S=p.array;_=p.version;for(let v=0,M=S.length;v<M;v+=3){let E=S[v+0],C=S[v+1],R=S[v+2];d.push(E,C,C,R,R,E)}}else if(g!==void 0){let S=g.array;_=g.version;for(let v=0,M=S.length/3-1;v<M;v+=3){let E=v+0,C=v+1,R=v+2;d.push(E,C,C,R,R,E)}}else return;let m=new(Jd(d)?Fo:No)(d,1);m.version=_;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function l(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function E_(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,r,d*a),t.update(p,i,1)}function h(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,d*a,g),t.update(p,i,g))}function l(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,i,1)}function u(d,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)h(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,d,0,_,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S];for(let S=0;S<_.length;S++)t.update(f,i,_[S])}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function A_(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function T_(n,e,t){let i=new WeakMap,s=new bt;function r(a,o,c){let h=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l!==void 0?l.length:0,d=i.get(o);if(d===void 0||d.count!==u){let N=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",N)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],v=0;p===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let M=o.attributes.position.count*v,E=1;M>e.maxTextureSize&&(E=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let C=new Float32Array(M*E*4*u),R=new Uo(C,M,E,u);R.type=ri,R.needsUpdate=!0;let P=v*4;for(let y=0;y<u;y++){let w=m[y],F=f[y],B=S[y],W=M*E*4*y;for(let ee=0;ee<w.count;ee++){let V=ee*P;p===!0&&(s.fromBufferAttribute(w,ee),C[W+V+0]=s.x,C[W+V+1]=s.y,C[W+V+2]=s.z,C[W+V+3]=0),g===!0&&(s.fromBufferAttribute(F,ee),C[W+V+4]=s.x,C[W+V+5]=s.y,C[W+V+6]=s.z,C[W+V+7]=0),_===!0&&(s.fromBufferAttribute(B,ee),C[W+V+8]=s.x,C[W+V+9]=s.y,C[W+V+10]=s.z,C[W+V+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new Re(M,E)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let _=0;_<h.length;_++)p+=h[_];let g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function R_(n,e,t,i){let s=new WeakMap;function r(c){let h=i.render.frame,l=c.geometry,u=e.get(c,l);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return u}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}var Vo=class extends xn{constructor(e,t,i,s,r,a,o,c,h,l=Rs){if(l!==Rs&&l!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Rs&&(i=Qi),i===void 0&&l===Us&&(i=ks),super(null,s,r,a,o,c,l,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:_n,this.minFilter=c!==void 0?c:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},nf=new xn,hd=new Vo(1,1),sf=new Uo,rf=new vl,of=new Bo,ud=[],dd=[],fd=new Float32Array(16),pd=new Float32Array(9),md=new Float32Array(4);function Hs(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=ud[s];if(r===void 0&&(r=new Float32Array(s),ud[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function kt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function aa(n,e){let t=dd[e];t===void 0&&(t=new Int32Array(e),dd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function C_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function L_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),kt(t,e)}}function P_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),kt(t,e)}}function I_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),kt(t,e)}}function D_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(Dt(t,i))return;md.set(i),n.uniformMatrix2fv(this.addr,!1,md),kt(t,i)}}function k_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(Dt(t,i))return;pd.set(i),n.uniformMatrix3fv(this.addr,!1,pd),kt(t,i)}}function U_(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(Dt(t,i))return;fd.set(i),n.uniformMatrix4fv(this.addr,!1,fd),kt(t,i)}}function N_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function F_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),kt(t,e)}}function O_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),kt(t,e)}}function B_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),kt(t,e)}}function z_(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function H_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),kt(t,e)}}function V_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),kt(t,e)}}function G_(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),kt(t,e)}}function W_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(hd.compareFunction=jd,r=hd):r=nf,t.setTexture2D(e||r,s)}function K_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||rf,s)}function $_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||of,s)}function X_(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||sf,s)}function q_(n){switch(n){case 5126:return C_;case 35664:return L_;case 35665:return P_;case 35666:return I_;case 35674:return D_;case 35675:return k_;case 35676:return U_;case 5124:case 35670:return N_;case 35667:case 35671:return F_;case 35668:case 35672:return O_;case 35669:case 35673:return B_;case 5125:return z_;case 36294:return H_;case 36295:return V_;case 36296:return G_;case 35678:case 36198:case 36298:case 36306:case 35682:return W_;case 35679:case 36299:case 36307:return K_;case 35680:case 36300:case 36308:case 36293:return $_;case 36289:case 36303:case 36311:case 36292:return X_}}function Y_(n,e){n.uniform1fv(this.addr,e)}function Z_(n,e){let t=Hs(e,this.size,2);n.uniform2fv(this.addr,t)}function j_(n,e){let t=Hs(e,this.size,3);n.uniform3fv(this.addr,t)}function J_(n,e){let t=Hs(e,this.size,4);n.uniform4fv(this.addr,t)}function Q_(n,e){let t=Hs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function ex(n,e){let t=Hs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function tx(n,e){let t=Hs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function nx(n,e){n.uniform1iv(this.addr,e)}function ix(n,e){n.uniform2iv(this.addr,e)}function sx(n,e){n.uniform3iv(this.addr,e)}function rx(n,e){n.uniform4iv(this.addr,e)}function ox(n,e){n.uniform1uiv(this.addr,e)}function ax(n,e){n.uniform2uiv(this.addr,e)}function cx(n,e){n.uniform3uiv(this.addr,e)}function lx(n,e){n.uniform4uiv(this.addr,e)}function hx(n,e,t){let i=this.cache,s=e.length,r=aa(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),kt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||nf,r[a])}function ux(n,e,t){let i=this.cache,s=e.length,r=aa(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),kt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||rf,r[a])}function dx(n,e,t){let i=this.cache,s=e.length,r=aa(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),kt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||of,r[a])}function fx(n,e,t){let i=this.cache,s=e.length,r=aa(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),kt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||sf,r[a])}function px(n){switch(n){case 5126:return Y_;case 35664:return Z_;case 35665:return j_;case 35666:return J_;case 35674:return Q_;case 35675:return ex;case 35676:return tx;case 5124:case 35670:return nx;case 35667:case 35671:return ix;case 35668:case 35672:return sx;case 35669:case 35673:return rx;case 5125:return ox;case 36294:return ax;case 36295:return cx;case 36296:return lx;case 35678:case 36198:case 36298:case 36306:case 35682:return hx;case 35679:case 36299:case 36307:return ux;case 35680:case 36300:case 36308:case 36293:return dx;case 36289:case 36303:case 36311:case 36292:return fx}}var Ml=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=q_(t.type)}},bl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=px(t.type)}},wl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},wc=/(\w+)(\])?(\[|\.)?/g;function gd(n,e){n.seq.push(e),n.map[e.id]=e}function mx(n,e,t){let i=n.name,s=i.length;for(wc.lastIndex=0;;){let r=wc.exec(i),a=wc.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){gd(t,h===void 0?new Ml(o,n,e):new bl(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new wl(o),gd(t,u)),t=u}}}var Ls=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);mx(r,a,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function _d(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var gx=37297,_x=0;function xx(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function vx(n){let e=ct.getPrimaries(ct.workingColorSpace),t=ct.getPrimaries(n),i;switch(e===t?i="":e===Po&&t===Lo?i="LinearDisplayP3ToLinearSRGB":e===Lo&&t===Po&&(i="LinearSRGBToLinearDisplayP3"),n){case Ci:case oa:return[i,"LinearTransferOETF"];case Vn:case ah:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function xd(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+xx(n.getShaderSource(e),a)}else return s}function yx(n,e){let t=vx(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Sx(n,e){let t;switch(e){case Kp:t="Linear";break;case $p:t="Reinhard";break;case Xp:t="Cineon";break;case qp:t="ACESFilmic";break;case Zp:t="AgX";break;case jp:t="Neutral";break;case Yp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var _o=new I;function Mx(){ct.getLuminanceCoefficients(_o);let n=_o.x.toFixed(4),e=_o.y.toFixed(4),t=_o.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)}function wx(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ex(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function hr(n){return n!==""}function vd(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function yd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ax=/^[ \t]*#include +<([\w\d./]+)>/gm;function El(n){return n.replace(Ax,Rx)}var Tx=new Map;function Rx(n,e){let t=qe[e];if(t===void 0){let i=Tx.get(e);if(i!==void 0)t=qe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return El(t)}var Cx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sd(n){return n.replace(Cx,Lx)}function Lx(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Md(n){let e=`precision ${n.precision} float;
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
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Px(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Fd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===wp?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ii&&(e="SHADOWMAP_TYPE_VSM"),e}function Ix(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case Ds:e="ENVMAP_TYPE_CUBE";break;case ra:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Dx(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ds:e="ENVMAP_MODE_REFRACTION";break}return e}function kx(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Od:e="ENVMAP_BLENDING_MULTIPLY";break;case Gp:e="ENVMAP_BLENDING_MIX";break;case Wp:e="ENVMAP_BLENDING_ADD";break}return e}function Ux(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Nx(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=Px(t),h=Ix(t),l=Dx(t),u=kx(t),d=Ux(t),p=bx(t),g=wx(r),_=s.createProgram(),m,f,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hr).join(`
`),f.length>0&&(f+=`
`)):(m=[Md(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),f=[Md(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?qe.tonemapping_pars_fragment:"",t.toneMapping!==Mi?Sx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,yx("linearToOutputTexel",t.outputColorSpace),Mx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hr).join(`
`)),a=El(a),a=vd(a,t),a=yd(a,t),o=El(o),o=vd(o,t),o=yd(o,t),a=Sd(a),o=Sd(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===zu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let v=S+m+a,M=S+f+o,E=_d(s,s.VERTEX_SHADER,v),C=_d(s,s.FRAGMENT_SHADER,M);s.attachShader(_,E),s.attachShader(_,C),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(w){if(n.debug.checkShaderErrors){let F=s.getProgramInfoLog(_).trim(),B=s.getShaderInfoLog(E).trim(),W=s.getShaderInfoLog(C).trim(),ee=!0,V=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ee=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,E,C);else{let ie=xd(s,E,"vertex"),q=xd(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+F+`
`+ie+`
`+q)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(B===""||W==="")&&(V=!1);V&&(w.diagnostics={runnable:ee,programLog:F,vertexShader:{log:B,prefix:m},fragmentShader:{log:W,prefix:f}})}s.deleteShader(E),s.deleteShader(C),P=new Ls(s,_),N=Ex(s,_)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let N;this.getAttributes=function(){return N===void 0&&R(this),N};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,gx)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_x++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=C,this}var Fx=0,Al=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Tl(e),t.set(e,i)),i}},Tl=class{constructor(e){this.id=Fx++,this.code=e,this.usedTimes=0}};function Ox(n,e,t,i,s,r,a){let o=new gr,c=new Al,h=new Set,l=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,p=s.vertexTextures,g=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return h.add(y),y===0?"uv":`uv${y}`}function f(y,w,F,B,W){let ee=B.fog,V=W.geometry,ie=y.isMeshStandardMaterial?B.environment:null,q=(y.isMeshStandardMaterial?t:e).get(y.envMap||ie),de=q&&q.mapping===ra?q.image.height:null,xe=_[y.type];y.precision!==null&&(g=s.getMaxPrecision(y.precision),g!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",g,"instead."));let ye=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,et=ye!==void 0?ye.length:0,it=0;V.morphAttributes.position!==void 0&&(it=1),V.morphAttributes.normal!==void 0&&(it=2),V.morphAttributes.color!==void 0&&(it=3);let Z,se,we,ve;if(xe){let Qt=Gn[xe];Z=Qt.vertexShader,se=Qt.fragmentShader}else Z=y.vertexShader,se=y.fragmentShader,c.update(y),we=c.getVertexShaderID(y),ve=c.getFragmentShaderID(y);let We=n.getRenderTarget(),ke=W.isInstancedMesh===!0,Ke=W.isBatchedMesh===!0,st=!!y.map,Qe=!!y.matcap,T=!!q,te=!!y.aoMap,j=!!y.lightMap,ae=!!y.bumpMap,re=!!y.normalMap,ue=!!y.displacementMap,ne=!!y.emissiveMap,L=!!y.metalnessMap,b=!!y.roughnessMap,O=y.anisotropy>0,X=y.clearcoat>0,J=y.dispersion>0,Y=y.iridescence>0,Ee=y.sheen>0,le=y.transmission>0,fe=O&&!!y.anisotropyMap,Je=X&&!!y.clearcoatMap,oe=X&&!!y.clearcoatNormalMap,Me=X&&!!y.clearcoatRoughnessMap,Ve=Y&&!!y.iridescenceMap,Ge=Y&&!!y.iridescenceThicknessMap,be=Ee&&!!y.sheenColorMap,tt=Ee&&!!y.sheenRoughnessMap,$e=!!y.specularMap,pt=!!y.specularColorMap,D=!!y.specularIntensityMap,ge=le&&!!y.transmissionMap,$=le&&!!y.thicknessMap,Q=!!y.gradientMap,pe=!!y.alphaMap,_e=y.alphaTest>0,nt=!!y.alphaHash,At=!!y.extensions,Jt=Mi;y.toneMapped&&(We===null||We.isXRRenderTarget===!0)&&(Jt=n.toneMapping);let rt={shaderID:xe,shaderType:y.type,shaderName:y.name,vertexShader:Z,fragmentShader:se,defines:y.defines,customVertexShaderID:we,customFragmentShaderID:ve,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:g,batching:Ke,batchingColor:Ke&&W._colorsTexture!==null,instancing:ke,instancingColor:ke&&W.instanceColor!==null,instancingMorph:ke&&W.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:We===null?n.outputColorSpace:We.isXRRenderTarget===!0?We.texture.colorSpace:Ci,alphaToCoverage:!!y.alphaToCoverage,map:st,matcap:Qe,envMap:T,envMapMode:T&&q.mapping,envMapCubeUVHeight:de,aoMap:te,lightMap:j,bumpMap:ae,normalMap:re,displacementMap:p&&ue,emissiveMap:ne,normalMapObjectSpace:re&&y.normalMapType===tm,normalMapTangentSpace:re&&y.normalMapType===Zd,metalnessMap:L,roughnessMap:b,anisotropy:O,anisotropyMap:fe,clearcoat:X,clearcoatMap:Je,clearcoatNormalMap:oe,clearcoatRoughnessMap:Me,dispersion:J,iridescence:Y,iridescenceMap:Ve,iridescenceThicknessMap:Ge,sheen:Ee,sheenColorMap:be,sheenRoughnessMap:tt,specularMap:$e,specularColorMap:pt,specularIntensityMap:D,transmission:le,transmissionMap:ge,thicknessMap:$,gradientMap:Q,opaque:y.transparent===!1&&y.blending===Ts&&y.alphaToCoverage===!1,alphaMap:pe,alphaTest:_e,alphaHash:nt,combine:y.combine,mapUv:st&&m(y.map.channel),aoMapUv:te&&m(y.aoMap.channel),lightMapUv:j&&m(y.lightMap.channel),bumpMapUv:ae&&m(y.bumpMap.channel),normalMapUv:re&&m(y.normalMap.channel),displacementMapUv:ue&&m(y.displacementMap.channel),emissiveMapUv:ne&&m(y.emissiveMap.channel),metalnessMapUv:L&&m(y.metalnessMap.channel),roughnessMapUv:b&&m(y.roughnessMap.channel),anisotropyMapUv:fe&&m(y.anisotropyMap.channel),clearcoatMapUv:Je&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:oe&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Me&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:Ge&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:be&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:tt&&m(y.sheenRoughnessMap.channel),specularMapUv:$e&&m(y.specularMap.channel),specularColorMapUv:pt&&m(y.specularColorMap.channel),specularIntensityMapUv:D&&m(y.specularIntensityMap.channel),transmissionMapUv:ge&&m(y.transmissionMap.channel),thicknessMapUv:$&&m(y.thicknessMap.channel),alphaMapUv:pe&&m(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(re||O),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!V.attributes.uv&&(st||pe),fog:!!ee,useFog:y.fog===!0,fogExp2:!!ee&&ee.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:W.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:it,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&F.length>0,shadowMapType:n.shadowMap.type,toneMapping:Jt,decodeVideoTexture:st&&y.map.isVideoTexture===!0&&ct.getTransfer(y.map.colorSpace)===gt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===si,flipSided:y.side===tn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:At&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&y.extensions.multiDraw===!0||Ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return rt.vertexUv1s=h.has(1),rt.vertexUv2s=h.has(2),rt.vertexUv3s=h.has(3),h.clear(),rt}function S(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let F in y.defines)w.push(F),w.push(y.defines[F]);return y.isRawShaderMaterial===!1&&(v(w,y),M(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function v(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function M(y,w){o.disableAll(),w.supportsVertexTextures&&o.enable(0),w.instancing&&o.enable(1),w.instancingColor&&o.enable(2),w.instancingMorph&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),w.dispersion&&o.enable(20),w.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reverseDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.alphaToCoverage&&o.enable(20),y.push(o.mask)}function E(y){let w=_[y.type],F;if(w){let B=Gn[w];F=Rm.clone(B.uniforms)}else F=y.uniforms;return F}function C(y,w){let F;for(let B=0,W=l.length;B<W;B++){let ee=l[B];if(ee.cacheKey===w){F=ee,++F.usedTimes;break}}return F===void 0&&(F=new Nx(n,w,y,r),l.push(F)),F}function R(y){if(--y.usedTimes===0){let w=l.indexOf(y);l[w]=l[l.length-1],l.pop(),y.destroy()}}function P(y){c.remove(y)}function N(){c.dispose()}return{getParameters:f,getProgramCacheKey:S,getUniforms:E,acquireProgram:C,releaseProgram:R,releaseShaderCache:P,programs:l,dispose:N}}function Bx(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function zx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function bd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function wd(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,d,p,g,_,m){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),e++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function h(u,d){t.length>1&&t.sort(u||zx),i.length>1&&i.sort(d||bd),s.length>1&&s.sort(d||bd)}function l(){for(let u=e,d=n.length;u<d;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Hx(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new wd,n.set(i,[a])):s>=r.length?(a=new wd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Vx(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ze};break;case"SpotLight":t={position:new I,direction:new I,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function Gx(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Wx=0;function Kx(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function $x(n){let e=new Vx,t=Gx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new I);let s=new I,r=new vt,a=new vt;function o(h){let l=0,u=0,d=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,S=0,v=0,M=0,E=0,C=0,R=0;h.sort(Kx);for(let N=0,y=h.length;N<y;N++){let w=h[N],F=w.color,B=w.intensity,W=w.distance,ee=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)l+=F.r*B,u+=F.g*B,d+=F.b*B;else if(w.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(w.sh.coefficients[V],B);R++}else if(w.isDirectionalLight){let V=e.get(w);if(V.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let ie=w.shadow,q=t.get(w);q.shadowIntensity=ie.intensity,q.shadowBias=ie.bias,q.shadowNormalBias=ie.normalBias,q.shadowRadius=ie.radius,q.shadowMapSize=ie.mapSize,i.directionalShadow[p]=q,i.directionalShadowMap[p]=ee,i.directionalShadowMatrix[p]=w.shadow.matrix,S++}i.directional[p]=V,p++}else if(w.isSpotLight){let V=e.get(w);V.position.setFromMatrixPosition(w.matrixWorld),V.color.copy(F).multiplyScalar(B),V.distance=W,V.coneCos=Math.cos(w.angle),V.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),V.decay=w.decay,i.spot[_]=V;let ie=w.shadow;if(w.map&&(i.spotLightMap[E]=w.map,E++,ie.updateMatrices(w),w.castShadow&&C++),i.spotLightMatrix[_]=ie.matrix,w.castShadow){let q=t.get(w);q.shadowIntensity=ie.intensity,q.shadowBias=ie.bias,q.shadowNormalBias=ie.normalBias,q.shadowRadius=ie.radius,q.shadowMapSize=ie.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=ee,M++}_++}else if(w.isRectAreaLight){let V=e.get(w);V.color.copy(F).multiplyScalar(B),V.halfWidth.set(w.width*.5,0,0),V.halfHeight.set(0,w.height*.5,0),i.rectArea[m]=V,m++}else if(w.isPointLight){let V=e.get(w);if(V.color.copy(w.color).multiplyScalar(w.intensity),V.distance=w.distance,V.decay=w.decay,w.castShadow){let ie=w.shadow,q=t.get(w);q.shadowIntensity=ie.intensity,q.shadowBias=ie.bias,q.shadowNormalBias=ie.normalBias,q.shadowRadius=ie.radius,q.shadowMapSize=ie.mapSize,q.shadowCameraNear=ie.camera.near,q.shadowCameraFar=ie.camera.far,i.pointShadow[g]=q,i.pointShadowMap[g]=ee,i.pointShadowMatrix[g]=w.shadow.matrix,v++}i.point[g]=V,g++}else if(w.isHemisphereLight){let V=e.get(w);V.skyColor.copy(w.color).multiplyScalar(B),V.groundColor.copy(w.groundColor).multiplyScalar(B),i.hemi[f]=V,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=u,i.ambient[2]=d;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==f||P.numDirectionalShadows!==S||P.numPointShadows!==v||P.numSpotShadows!==M||P.numSpotMaps!==E||P.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+E-C,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=R,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=f,P.numDirectionalShadows=S,P.numPointShadows=v,P.numSpotShadows=M,P.numSpotMaps=E,P.numLightProbes=R,i.version=Wx++)}function c(h,l){let u=0,d=0,p=0,g=0,_=0,m=l.matrixWorldInverse;for(let f=0,S=h.length;f<S;f++){let v=h[f];if(v.isDirectionalLight){let M=i.directional[u];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(v.isSpotLight){let M=i.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(v.isRectAreaLight){let M=i.rectArea[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){let M=i.point[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){let M=i.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function Ed(n){let e=new $x(n),t=[],i=[];function s(l){h.camera=l,t.length=0,i.length=0}function r(l){t.push(l)}function a(l){i.push(l)}function o(){e.setup(t)}function c(l){e.setupView(t,l)}let h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Xx(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Ed(n),e.set(s,[o])):r>=a.length?(o=new Ed(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var Rl=class extends Ai{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Cl=class extends Ai{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},qx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yx=`uniform sampler2D shadow_pass;
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
}`;function Zx(n,e,t){let i=new xr,s=new Re,r=new Re,a=new bt,o=new Rl({depthPacking:em}),c=new Cl,h={},l=t.maxTextureSize,u={[bi]:tn,[tn]:bi,[si]:si},d=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Re},radius:{value:4}},vertexShader:qx,fragmentShader:Yx}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new Xt;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new wt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fd;let f=this.type;this.render=function(C,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;let N=n.getRenderTarget(),y=n.getActiveCubeFace(),w=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Si),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let B=f!==ii&&this.type===ii,W=f===ii&&this.type!==ii;for(let ee=0,V=C.length;ee<V;ee++){let ie=C[ee],q=ie.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let de=q.getFrameExtents();if(s.multiply(de),r.copy(q.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/de.x),s.x=r.x*de.x,q.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/de.y),s.y=r.y*de.y,q.mapSize.y=r.y)),q.map===null||B===!0||W===!0){let ye=this.type!==ii?{minFilter:_n,magFilter:_n}:{};q.map!==null&&q.map.dispose(),q.map=new ci(s.x,s.y,ye),q.map.texture.name=ie.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let xe=q.getViewportCount();for(let ye=0;ye<xe;ye++){let et=q.getViewport(ye);a.set(r.x*et.x,r.y*et.y,r.x*et.z,r.y*et.w),F.viewport(a),q.updateMatrices(ie,ye),i=q.getFrustum(),M(R,P,q.camera,ie,this.type)}q.isPointLightShadow!==!0&&this.type===ii&&S(q,P),q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(N,y,w)};function S(C,R){let P=e.update(_);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ci(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(R,null,P,d,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(R,null,P,p,_,null)}function v(C,R,P,N){let y=null,w=P.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(w!==void 0)y=w;else if(y=P.isPointLight===!0?c:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let F=y.uuid,B=R.uuid,W=h[F];W===void 0&&(W={},h[F]=W);let ee=W[B];ee===void 0&&(ee=y.clone(),W[B]=ee,R.addEventListener("dispose",E)),y=ee}if(y.visible=R.visible,y.wireframe=R.wireframe,N===ii?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:u[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let F=n.properties.get(y);F.light=P}return y}function M(C,R,P,N,y){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&y===ii)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,C.matrixWorld);let B=e.update(C),W=C.material;if(Array.isArray(W)){let ee=B.groups;for(let V=0,ie=ee.length;V<ie;V++){let q=ee[V],de=W[q.materialIndex];if(de&&de.visible){let xe=v(C,de,N,y);C.onBeforeShadow(n,C,R,P,B,xe,q),n.renderBufferDirect(P,null,B,xe,C,q),C.onAfterShadow(n,C,R,P,B,xe,q)}}}else if(W.visible){let ee=v(C,W,N,y);C.onBeforeShadow(n,C,R,P,B,ee,null),n.renderBufferDirect(P,null,B,ee,C,null),C.onAfterShadow(n,C,R,P,B,ee,null)}}let F=C.children;for(let B=0,W=F.length;B<W;B++)M(F[B],R,P,N,y)}function E(C){C.target.removeEventListener("dispose",E);for(let P in h){let N=h[P],y=C.target.uuid;y in N&&(N[y].dispose(),delete N[y])}}}var jx={[Ic]:Dc,[kc]:Fc,[Uc]:Oc,[Ps]:Nc,[Dc]:Ic,[Fc]:kc,[Oc]:Uc,[Nc]:Ps};function Jx(n){function e(){let D=!1,ge=new bt,$=null,Q=new bt(0,0,0,0);return{setMask:function(pe){$!==pe&&!D&&(n.colorMask(pe,pe,pe,pe),$=pe)},setLocked:function(pe){D=pe},setClear:function(pe,_e,nt,At,Jt){Jt===!0&&(pe*=At,_e*=At,nt*=At),ge.set(pe,_e,nt,At),Q.equals(ge)===!1&&(n.clearColor(pe,_e,nt,At),Q.copy(ge))},reset:function(){D=!1,$=null,Q.set(-1,0,0,0)}}}function t(){let D=!1,ge=!1,$=null,Q=null,pe=null;return{setReversed:function(_e){ge=_e},setTest:function(_e){_e?we(n.DEPTH_TEST):ve(n.DEPTH_TEST)},setMask:function(_e){$!==_e&&!D&&(n.depthMask(_e),$=_e)},setFunc:function(_e){if(ge&&(_e=jx[_e]),Q!==_e){switch(_e){case Ic:n.depthFunc(n.NEVER);break;case Dc:n.depthFunc(n.ALWAYS);break;case kc:n.depthFunc(n.LESS);break;case Ps:n.depthFunc(n.LEQUAL);break;case Uc:n.depthFunc(n.EQUAL);break;case Nc:n.depthFunc(n.GEQUAL);break;case Fc:n.depthFunc(n.GREATER);break;case Oc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Q=_e}},setLocked:function(_e){D=_e},setClear:function(_e){pe!==_e&&(n.clearDepth(_e),pe=_e)},reset:function(){D=!1,$=null,Q=null,pe=null}}}function i(){let D=!1,ge=null,$=null,Q=null,pe=null,_e=null,nt=null,At=null,Jt=null;return{setTest:function(rt){D||(rt?we(n.STENCIL_TEST):ve(n.STENCIL_TEST))},setMask:function(rt){ge!==rt&&!D&&(n.stencilMask(rt),ge=rt)},setFunc:function(rt,Qt,Yn){($!==rt||Q!==Qt||pe!==Yn)&&(n.stencilFunc(rt,Qt,Yn),$=rt,Q=Qt,pe=Yn)},setOp:function(rt,Qt,Yn){(_e!==rt||nt!==Qt||At!==Yn)&&(n.stencilOp(rt,Qt,Yn),_e=rt,nt=Qt,At=Yn)},setLocked:function(rt){D=rt},setClear:function(rt){Jt!==rt&&(n.clearStencil(rt),Jt=rt)},reset:function(){D=!1,ge=null,$=null,Q=null,pe=null,_e=null,nt=null,At=null,Jt=null}}}let s=new e,r=new t,a=new i,o=new WeakMap,c=new WeakMap,h={},l={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,S=null,v=null,M=null,E=null,C=new Ze(0,0,0),R=0,P=!1,N=null,y=null,w=null,F=null,B=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ee=!1,V=0,ie=n.getParameter(n.VERSION);ie.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(ie)[1]),ee=V>=1):ie.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),ee=V>=2);let q=null,de={},xe=n.getParameter(n.SCISSOR_BOX),ye=n.getParameter(n.VIEWPORT),et=new bt().fromArray(xe),it=new bt().fromArray(ye);function Z(D,ge,$,Q){let pe=new Uint8Array(4),_e=n.createTexture();n.bindTexture(D,_e),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let nt=0;nt<$;nt++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(ge,0,n.RGBA,1,1,Q,0,n.RGBA,n.UNSIGNED_BYTE,pe):n.texImage2D(ge+nt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pe);return _e}let se={};se[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),se[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),se[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),a.setClear(0),we(n.DEPTH_TEST),r.setFunc(Ps),j(!1),ae(Pu),we(n.CULL_FACE),T(Si);function we(D){h[D]!==!0&&(n.enable(D),h[D]=!0)}function ve(D){h[D]!==!1&&(n.disable(D),h[D]=!1)}function We(D,ge){return l[D]!==ge?(n.bindFramebuffer(D,ge),l[D]=ge,D===n.DRAW_FRAMEBUFFER&&(l[n.FRAMEBUFFER]=ge),D===n.FRAMEBUFFER&&(l[n.DRAW_FRAMEBUFFER]=ge),!0):!1}function ke(D,ge){let $=d,Q=!1;if(D){$=u.get(ge),$===void 0&&($=[],u.set(ge,$));let pe=D.textures;if($.length!==pe.length||$[0]!==n.COLOR_ATTACHMENT0){for(let _e=0,nt=pe.length;_e<nt;_e++)$[_e]=n.COLOR_ATTACHMENT0+_e;$.length=pe.length,Q=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,Q=!0);Q&&n.drawBuffers($)}function Ke(D){return p!==D?(n.useProgram(D),p=D,!0):!1}let st={[qi]:n.FUNC_ADD,[Ap]:n.FUNC_SUBTRACT,[Tp]:n.FUNC_REVERSE_SUBTRACT};st[Rp]=n.MIN,st[Cp]=n.MAX;let Qe={[Lp]:n.ZERO,[Pp]:n.ONE,[Ip]:n.SRC_COLOR,[Lc]:n.SRC_ALPHA,[Op]:n.SRC_ALPHA_SATURATE,[Np]:n.DST_COLOR,[kp]:n.DST_ALPHA,[Dp]:n.ONE_MINUS_SRC_COLOR,[Pc]:n.ONE_MINUS_SRC_ALPHA,[Fp]:n.ONE_MINUS_DST_COLOR,[Up]:n.ONE_MINUS_DST_ALPHA,[Bp]:n.CONSTANT_COLOR,[zp]:n.ONE_MINUS_CONSTANT_COLOR,[Hp]:n.CONSTANT_ALPHA,[Vp]:n.ONE_MINUS_CONSTANT_ALPHA};function T(D,ge,$,Q,pe,_e,nt,At,Jt,rt){if(D===Si){g===!0&&(ve(n.BLEND),g=!1);return}if(g===!1&&(we(n.BLEND),g=!0),D!==Ep){if(D!==_||rt!==P){if((m!==qi||v!==qi)&&(n.blendEquation(n.FUNC_ADD),m=qi,v=qi),rt)switch(D){case Ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Iu:n.blendFunc(n.ONE,n.ONE);break;case Du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ku:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Iu:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ku:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}f=null,S=null,M=null,E=null,C.set(0,0,0),R=0,_=D,P=rt}return}pe=pe||ge,_e=_e||$,nt=nt||Q,(ge!==m||pe!==v)&&(n.blendEquationSeparate(st[ge],st[pe]),m=ge,v=pe),($!==f||Q!==S||_e!==M||nt!==E)&&(n.blendFuncSeparate(Qe[$],Qe[Q],Qe[_e],Qe[nt]),f=$,S=Q,M=_e,E=nt),(At.equals(C)===!1||Jt!==R)&&(n.blendColor(At.r,At.g,At.b,Jt),C.copy(At),R=Jt),_=D,P=!1}function te(D,ge){D.side===si?ve(n.CULL_FACE):we(n.CULL_FACE);let $=D.side===tn;ge&&($=!$),j($),D.blending===Ts&&D.transparent===!1?T(Si):T(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),s.setMask(D.colorWrite);let Q=D.stencilWrite;a.setTest(Q),Q&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ue(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?we(n.SAMPLE_ALPHA_TO_COVERAGE):ve(n.SAMPLE_ALPHA_TO_COVERAGE)}function j(D){N!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),N=D)}function ae(D){D!==Mp?(we(n.CULL_FACE),D!==y&&(D===Pu?n.cullFace(n.BACK):D===bp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ve(n.CULL_FACE),y=D}function re(D){D!==w&&(ee&&n.lineWidth(D),w=D)}function ue(D,ge,$){D?(we(n.POLYGON_OFFSET_FILL),(F!==ge||B!==$)&&(n.polygonOffset(ge,$),F=ge,B=$)):ve(n.POLYGON_OFFSET_FILL)}function ne(D){D?we(n.SCISSOR_TEST):ve(n.SCISSOR_TEST)}function L(D){D===void 0&&(D=n.TEXTURE0+W-1),q!==D&&(n.activeTexture(D),q=D)}function b(D,ge,$){$===void 0&&(q===null?$=n.TEXTURE0+W-1:$=q);let Q=de[$];Q===void 0&&(Q={type:void 0,texture:void 0},de[$]=Q),(Q.type!==D||Q.texture!==ge)&&(q!==$&&(n.activeTexture($),q=$),n.bindTexture(D,ge||se[D]),Q.type=D,Q.texture=ge)}function O(){let D=de[q];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function X(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function le(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function fe(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Je(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Me(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ve(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ge(D){et.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),et.copy(D))}function be(D){it.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),it.copy(D))}function tt(D,ge){let $=c.get(ge);$===void 0&&($=new WeakMap,c.set(ge,$));let Q=$.get(D);Q===void 0&&(Q=n.getUniformBlockIndex(ge,D.name),$.set(D,Q))}function $e(D,ge){let Q=c.get(ge).get(D);o.get(ge)!==Q&&(n.uniformBlockBinding(ge,Q,D.__bindingPointIndex),o.set(ge,Q))}function pt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},q=null,de={},l={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,S=null,v=null,M=null,E=null,C=new Ze(0,0,0),R=0,P=!1,N=null,y=null,w=null,F=null,B=null,et.set(0,0,n.canvas.width,n.canvas.height),it.set(0,0,n.canvas.width,n.canvas.height),s.reset(),r.reset(),a.reset()}return{buffers:{color:s,depth:r,stencil:a},enable:we,disable:ve,bindFramebuffer:We,drawBuffers:ke,useProgram:Ke,setBlending:T,setMaterial:te,setFlipSided:j,setCullFace:ae,setLineWidth:re,setPolygonOffset:ue,setScissorTest:ne,activeTexture:L,bindTexture:b,unbindTexture:O,compressedTexImage2D:X,compressedTexImage3D:J,texImage2D:Me,texImage3D:Ve,updateUBOMapping:tt,uniformBlockBinding:$e,texStorage2D:Je,texStorage3D:oe,texSubImage2D:Y,texSubImage3D:Ee,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Ge,viewport:be,reset:pt}}function Ad(n,e,t,i){let s=Qx(i);switch(t){case Gd:return n*e;case Kd:return n*e;case $d:return n*e*2;case Xd:return n*e/s.components*s.byteLength;case sh:return n*e/s.components*s.byteLength;case qd:return n*e*2/s.components*s.byteLength;case rh:return n*e*2/s.components*s.byteLength;case Wd:return n*e*3/s.components*s.byteLength;case Dn:return n*e*4/s.components*s.byteLength;case oh:return n*e*4/s.components*s.byteLength;case Mo:case bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case wo:case Eo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wc:case $c:return Math.max(n,16)*Math.max(e,8)/4;case Gc:case Kc:return Math.max(n,8)*Math.max(e,8)/2;case Xc:case qc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Yc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case jc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Qc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case el:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case tl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case nl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case il:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case sl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case rl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ol:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case al:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case cl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ll:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ao:case hl:case ul:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Yd:case dl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case fl:case pl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Qx(n){switch(n){case ai:case zd:return{byteLength:1,components:1};case pr:case Hd:case Mr:return{byteLength:2,components:1};case nh:case ih:return{byteLength:2,components:4};case Qi:case th:case ri:return{byteLength:4,components:1};case Vd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function ev(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Re,l=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,b){return p?new OffscreenCanvas(L,b):Do("canvas")}function _(L,b,O){let X=1,J=ne(L);if((J.width>O||J.height>O)&&(X=O/Math.max(J.width,J.height)),X<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let Y=Math.floor(X*J.width),Ee=Math.floor(X*J.height);u===void 0&&(u=g(Y,Ee));let le=b?g(Y,Ee):u;return le.width=Y,le.height=Ee,le.getContext("2d").drawImage(L,0,0,Y,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+Ee+")."),le}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),L;return L}function m(L){return L.generateMipmaps&&L.minFilter!==_n&&L.minFilter!==In}function f(L){n.generateMipmap(L)}function S(L,b,O,X,J=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Y=b;if(b===n.RED&&(O===n.FLOAT&&(Y=n.R32F),O===n.HALF_FLOAT&&(Y=n.R16F),O===n.UNSIGNED_BYTE&&(Y=n.R8)),b===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.R8UI),O===n.UNSIGNED_SHORT&&(Y=n.R16UI),O===n.UNSIGNED_INT&&(Y=n.R32UI),O===n.BYTE&&(Y=n.R8I),O===n.SHORT&&(Y=n.R16I),O===n.INT&&(Y=n.R32I)),b===n.RG&&(O===n.FLOAT&&(Y=n.RG32F),O===n.HALF_FLOAT&&(Y=n.RG16F),O===n.UNSIGNED_BYTE&&(Y=n.RG8)),b===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RG8UI),O===n.UNSIGNED_SHORT&&(Y=n.RG16UI),O===n.UNSIGNED_INT&&(Y=n.RG32UI),O===n.BYTE&&(Y=n.RG8I),O===n.SHORT&&(Y=n.RG16I),O===n.INT&&(Y=n.RG32I)),b===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),O===n.UNSIGNED_INT&&(Y=n.RGB32UI),O===n.BYTE&&(Y=n.RGB8I),O===n.SHORT&&(Y=n.RGB16I),O===n.INT&&(Y=n.RGB32I)),b===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),O===n.UNSIGNED_INT&&(Y=n.RGBA32UI),O===n.BYTE&&(Y=n.RGBA8I),O===n.SHORT&&(Y=n.RGBA16I),O===n.INT&&(Y=n.RGBA32I)),b===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),b===n.RGBA){let Ee=J?Co:ct.getTransfer(X);O===n.FLOAT&&(Y=n.RGBA32F),O===n.HALF_FLOAT&&(Y=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Y=Ee===gt?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function v(L,b){let O;return L?b===null||b===Qi||b===ks?O=n.DEPTH24_STENCIL8:b===ri?O=n.DEPTH32F_STENCIL8:b===pr&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Qi||b===ks?O=n.DEPTH_COMPONENT24:b===ri?O=n.DEPTH_COMPONENT32F:b===pr&&(O=n.DEPTH_COMPONENT16),O}function M(L,b){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==_n&&L.minFilter!==In?Math.log2(Math.max(b.width,b.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?b.mipmaps.length:1}function E(L){let b=L.target;b.removeEventListener("dispose",E),R(b),b.isVideoTexture&&l.delete(b)}function C(L){let b=L.target;b.removeEventListener("dispose",C),N(b)}function R(L){let b=i.get(L);if(b.__webglInit===void 0)return;let O=L.source,X=d.get(O);if(X){let J=X[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&P(L),Object.keys(X).length===0&&d.delete(O)}i.remove(L)}function P(L){let b=i.get(L);n.deleteTexture(b.__webglTexture);let O=L.source,X=d.get(O);delete X[b.__cacheKey],a.memory.textures--}function N(L){let b=i.get(L);if(L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(b.__webglFramebuffer[X]))for(let J=0;J<b.__webglFramebuffer[X].length;J++)n.deleteFramebuffer(b.__webglFramebuffer[X][J]);else n.deleteFramebuffer(b.__webglFramebuffer[X]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[X])}else{if(Array.isArray(b.__webglFramebuffer))for(let X=0;X<b.__webglFramebuffer.length;X++)n.deleteFramebuffer(b.__webglFramebuffer[X]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let X=0;X<b.__webglColorRenderbuffer.length;X++)b.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[X]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let O=L.textures;for(let X=0,J=O.length;X<J;X++){let Y=i.get(O[X]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),a.memory.textures--),i.remove(O[X])}i.remove(L)}let y=0;function w(){y=0}function F(){let L=y;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),y+=1,L}function B(L){let b=[];return b.push(L.wrapS),b.push(L.wrapT),b.push(L.wrapR||0),b.push(L.magFilter),b.push(L.minFilter),b.push(L.anisotropy),b.push(L.internalFormat),b.push(L.format),b.push(L.type),b.push(L.generateMipmaps),b.push(L.premultiplyAlpha),b.push(L.flipY),b.push(L.unpackAlignment),b.push(L.colorSpace),b.join()}function W(L,b){let O=i.get(L);if(L.isVideoTexture&&re(L),L.isRenderTargetTexture===!1&&L.version>0&&O.__version!==L.version){let X=L.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{it(O,L,b);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+b)}function ee(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){it(O,L,b);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+b)}function V(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){it(O,L,b);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+b)}function ie(L,b){let O=i.get(L);if(L.version>0&&O.__version!==L.version){Z(O,L,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+b)}let q={[Hc]:n.REPEAT,[ji]:n.CLAMP_TO_EDGE,[Vc]:n.MIRRORED_REPEAT},de={[_n]:n.NEAREST,[Jp]:n.NEAREST_MIPMAP_NEAREST,[Zr]:n.NEAREST_MIPMAP_LINEAR,[In]:n.LINEAR,[qa]:n.LINEAR_MIPMAP_NEAREST,[Ji]:n.LINEAR_MIPMAP_LINEAR},xe={[nm]:n.NEVER,[cm]:n.ALWAYS,[im]:n.LESS,[jd]:n.LEQUAL,[sm]:n.EQUAL,[am]:n.GEQUAL,[rm]:n.GREATER,[om]:n.NOTEQUAL};function ye(L,b){if(b.type===ri&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===In||b.magFilter===qa||b.magFilter===Zr||b.magFilter===Ji||b.minFilter===In||b.minFilter===qa||b.minFilter===Zr||b.minFilter===Ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,q[b.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,q[b.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,q[b.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,de[b.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,de[b.minFilter]),b.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,xe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===_n||b.minFilter!==Zr&&b.minFilter!==Ji||b.type===ri&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(L,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function et(L,b){let O=!1;L.__webglInit===void 0&&(L.__webglInit=!0,b.addEventListener("dispose",E));let X=b.source,J=d.get(X);J===void 0&&(J={},d.set(X,J));let Y=B(b);if(Y!==L.__cacheKey){J[Y]===void 0&&(J[Y]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),J[Y].usedTimes++;let Ee=J[L.__cacheKey];Ee!==void 0&&(J[L.__cacheKey].usedTimes--,Ee.usedTimes===0&&P(b)),L.__cacheKey=Y,L.__webglTexture=J[Y].texture}return O}function it(L,b,O){let X=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(X=n.TEXTURE_3D);let J=et(L,b),Y=b.source;t.bindTexture(X,L.__webglTexture,n.TEXTURE0+O);let Ee=i.get(Y);if(Y.version!==Ee.__version||J===!0){t.activeTexture(n.TEXTURE0+O);let le=ct.getPrimaries(ct.workingColorSpace),fe=b.colorSpace===yi?null:ct.getPrimaries(b.colorSpace),Je=b.colorSpace===yi||le===fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let oe=_(b.image,!1,s.maxTextureSize);oe=ue(b,oe);let Me=r.convert(b.format,b.colorSpace),Ve=r.convert(b.type),Ge=S(b.internalFormat,Me,Ve,b.colorSpace,b.isVideoTexture);ye(X,b);let be,tt=b.mipmaps,$e=b.isVideoTexture!==!0,pt=Ee.__version===void 0||J===!0,D=Y.dataReady,ge=M(b,oe);if(b.isDepthTexture)Ge=v(b.format===Us,b.type),pt&&($e?t.texStorage2D(n.TEXTURE_2D,1,Ge,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,Ge,oe.width,oe.height,0,Me,Ve,null));else if(b.isDataTexture)if(tt.length>0){$e&&pt&&t.texStorage2D(n.TEXTURE_2D,ge,Ge,tt[0].width,tt[0].height);for(let $=0,Q=tt.length;$<Q;$++)be=tt[$],$e?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,be.width,be.height,Me,Ve,be.data):t.texImage2D(n.TEXTURE_2D,$,Ge,be.width,be.height,0,Me,Ve,be.data);b.generateMipmaps=!1}else $e?(pt&&t.texStorage2D(n.TEXTURE_2D,ge,Ge,oe.width,oe.height),D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,oe.width,oe.height,Me,Ve,oe.data)):t.texImage2D(n.TEXTURE_2D,0,Ge,oe.width,oe.height,0,Me,Ve,oe.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){$e&&pt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ge,Ge,tt[0].width,tt[0].height,oe.depth);for(let $=0,Q=tt.length;$<Q;$++)if(be=tt[$],b.format!==Dn)if(Me!==null)if($e){if(D)if(b.layerUpdates.size>0){let pe=Ad(be.width,be.height,b.format,b.type);for(let _e of b.layerUpdates){let nt=be.data.subarray(_e*pe/be.data.BYTES_PER_ELEMENT,(_e+1)*pe/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,_e,be.width,be.height,1,Me,nt,0,0)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,be.width,be.height,oe.depth,Me,be.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Ge,be.width,be.height,oe.depth,0,be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $e?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,be.width,be.height,oe.depth,Me,Ve,be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,Ge,be.width,be.height,oe.depth,0,Me,Ve,be.data)}else{$e&&pt&&t.texStorage2D(n.TEXTURE_2D,ge,Ge,tt[0].width,tt[0].height);for(let $=0,Q=tt.length;$<Q;$++)be=tt[$],b.format!==Dn?Me!==null?$e?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,be.width,be.height,Me,be.data):t.compressedTexImage2D(n.TEXTURE_2D,$,Ge,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$e?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,be.width,be.height,Me,Ve,be.data):t.texImage2D(n.TEXTURE_2D,$,Ge,be.width,be.height,0,Me,Ve,be.data)}else if(b.isDataArrayTexture)if($e){if(pt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ge,Ge,oe.width,oe.height,oe.depth),D)if(b.layerUpdates.size>0){let $=Ad(oe.width,oe.height,b.format,b.type);for(let Q of b.layerUpdates){let pe=oe.data.subarray(Q*$/oe.data.BYTES_PER_ELEMENT,(Q+1)*$/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,oe.width,oe.height,1,Me,Ve,pe)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Me,Ve,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ge,oe.width,oe.height,oe.depth,0,Me,Ve,oe.data);else if(b.isData3DTexture)$e?(pt&&t.texStorage3D(n.TEXTURE_3D,ge,Ge,oe.width,oe.height,oe.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Me,Ve,oe.data)):t.texImage3D(n.TEXTURE_3D,0,Ge,oe.width,oe.height,oe.depth,0,Me,Ve,oe.data);else if(b.isFramebufferTexture){if(pt)if($e)t.texStorage2D(n.TEXTURE_2D,ge,Ge,oe.width,oe.height);else{let $=oe.width,Q=oe.height;for(let pe=0;pe<ge;pe++)t.texImage2D(n.TEXTURE_2D,pe,Ge,$,Q,0,Me,Ve,null),$>>=1,Q>>=1}}else if(tt.length>0){if($e&&pt){let $=ne(tt[0]);t.texStorage2D(n.TEXTURE_2D,ge,Ge,$.width,$.height)}for(let $=0,Q=tt.length;$<Q;$++)be=tt[$],$e?D&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,Me,Ve,be):t.texImage2D(n.TEXTURE_2D,$,Ge,Me,Ve,be);b.generateMipmaps=!1}else if($e){if(pt){let $=ne(oe);t.texStorage2D(n.TEXTURE_2D,ge,Ge,$.width,$.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Me,Ve,oe)}else t.texImage2D(n.TEXTURE_2D,0,Ge,Me,Ve,oe);m(b)&&f(X),Ee.__version=Y.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function Z(L,b,O){if(b.image.length!==6)return;let X=et(L,b),J=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+O);let Y=i.get(J);if(J.version!==Y.__version||X===!0){t.activeTexture(n.TEXTURE0+O);let Ee=ct.getPrimaries(ct.workingColorSpace),le=b.colorSpace===yi?null:ct.getPrimaries(b.colorSpace),fe=b.colorSpace===yi||Ee===le?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);let Je=b.isCompressedTexture||b.image[0].isCompressedTexture,oe=b.image[0]&&b.image[0].isDataTexture,Me=[];for(let Q=0;Q<6;Q++)!Je&&!oe?Me[Q]=_(b.image[Q],!0,s.maxCubemapSize):Me[Q]=oe?b.image[Q].image:b.image[Q],Me[Q]=ue(b,Me[Q]);let Ve=Me[0],Ge=r.convert(b.format,b.colorSpace),be=r.convert(b.type),tt=S(b.internalFormat,Ge,be,b.colorSpace),$e=b.isVideoTexture!==!0,pt=Y.__version===void 0||X===!0,D=J.dataReady,ge=M(b,Ve);ye(n.TEXTURE_CUBE_MAP,b);let $;if(Je){$e&&pt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,tt,Ve.width,Ve.height);for(let Q=0;Q<6;Q++){$=Me[Q].mipmaps;for(let pe=0;pe<$.length;pe++){let _e=$[pe];b.format!==Dn?Ge!==null?$e?D&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,_e.width,_e.height,Ge,_e.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,tt,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,_e.width,_e.height,Ge,be,_e.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,tt,_e.width,_e.height,0,Ge,be,_e.data)}}}else{if($=b.mipmaps,$e&&pt){$.length>0&&ge++;let Q=ne(Me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,tt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(oe){$e?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Me[Q].width,Me[Q].height,Ge,be,Me[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,tt,Me[Q].width,Me[Q].height,0,Ge,be,Me[Q].data);for(let pe=0;pe<$.length;pe++){let nt=$[pe].image[Q].image;$e?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,nt.width,nt.height,Ge,be,nt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,tt,nt.width,nt.height,0,Ge,be,nt.data)}}else{$e?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ge,be,Me[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,tt,Ge,be,Me[Q]);for(let pe=0;pe<$.length;pe++){let _e=$[pe];$e?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,Ge,be,_e.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,tt,Ge,be,_e.image[Q])}}}m(b)&&f(n.TEXTURE_CUBE_MAP),Y.__version=J.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function se(L,b,O,X,J,Y){let Ee=r.convert(O.format,O.colorSpace),le=r.convert(O.type),fe=S(O.internalFormat,Ee,le,O.colorSpace);if(!i.get(b).__hasExternalTextures){let oe=Math.max(1,b.width>>Y),Me=Math.max(1,b.height>>Y);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,Y,fe,oe,Me,b.depth,0,Ee,le,null):t.texImage2D(J,Y,fe,oe,Me,0,Ee,le,null)}t.bindFramebuffer(n.FRAMEBUFFER,L),ae(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,J,i.get(O).__webglTexture,0,j(b)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,J,i.get(O).__webglTexture,Y),t.bindFramebuffer(n.FRAMEBUFFER,null)}function we(L,b,O){if(n.bindRenderbuffer(n.RENDERBUFFER,L),b.depthBuffer){let X=b.depthTexture,J=X&&X.isDepthTexture?X.type:null,Y=v(b.stencilBuffer,J),Ee=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=j(b);ae(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,le,Y,b.width,b.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,le,Y,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,Y,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ee,n.RENDERBUFFER,L)}else{let X=b.textures;for(let J=0;J<X.length;J++){let Y=X[J],Ee=r.convert(Y.format,Y.colorSpace),le=r.convert(Y.type),fe=S(Y.internalFormat,Ee,le,Y.colorSpace),Je=j(b);O&&ae(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Je,fe,b.width,b.height):ae(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Je,fe,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,fe,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ve(L,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),W(b.depthTexture,0);let X=i.get(b.depthTexture).__webglTexture,J=j(b);if(b.depthTexture.format===Rs)ae(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,X,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,X,0);else if(b.depthTexture.format===Us)ae(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,X,0,J):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,X,0);else throw new Error("Unknown depthTexture format")}function We(L){let b=i.get(L),O=L.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==L.depthTexture){let X=L.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),X){let J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,X.removeEventListener("dispose",J)};X.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=X}if(L.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ve(b.__webglFramebuffer,L)}else if(O){b.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[X]),b.__webglDepthbuffer[X]===void 0)b.__webglDepthbuffer[X]=n.createRenderbuffer(),we(b.__webglDepthbuffer[X],L,!1);else{let J=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=b.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,Y)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),we(b.__webglDepthbuffer,L,!1);else{let X=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,X,n.RENDERBUFFER,J)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ke(L,b,O){let X=i.get(L);b!==void 0&&se(X.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&We(L)}function Ke(L){let b=L.texture,O=i.get(L),X=i.get(b);L.addEventListener("dispose",C);let J=L.textures,Y=L.isWebGLCubeRenderTarget===!0,Ee=J.length>1;if(Ee||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=b.version,a.memory.textures++),Y){O.__webglFramebuffer=[];for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[le]=[];for(let fe=0;fe<b.mipmaps.length;fe++)O.__webglFramebuffer[le][fe]=n.createFramebuffer()}else O.__webglFramebuffer[le]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let le=0;le<b.mipmaps.length;le++)O.__webglFramebuffer[le]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(Ee)for(let le=0,fe=J.length;le<fe;le++){let Je=i.get(J[le]);Je.__webglTexture===void 0&&(Je.__webglTexture=n.createTexture(),a.memory.textures++)}if(L.samples>0&&ae(L)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let le=0;le<J.length;le++){let fe=J[le];O.__webglColorRenderbuffer[le]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[le]);let Je=r.convert(fe.format,fe.colorSpace),oe=r.convert(fe.type),Me=S(fe.internalFormat,Je,oe,fe.colorSpace,L.isXRRenderTarget===!0),Ve=j(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,Me,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,O.__webglColorRenderbuffer[le])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),we(O.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),ye(n.TEXTURE_CUBE_MAP,b);for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)se(O.__webglFramebuffer[le][fe],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+le,fe);else se(O.__webglFramebuffer[le],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(b)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let le=0,fe=J.length;le<fe;le++){let Je=J[le],oe=i.get(Je);t.bindTexture(n.TEXTURE_2D,oe.__webglTexture),ye(n.TEXTURE_2D,Je),se(O.__webglFramebuffer,L,Je,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,0),m(Je)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let le=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(le=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(le,X.__webglTexture),ye(le,b),b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)se(O.__webglFramebuffer[fe],L,b,n.COLOR_ATTACHMENT0,le,fe);else se(O.__webglFramebuffer,L,b,n.COLOR_ATTACHMENT0,le,0);m(b)&&f(le),t.unbindTexture()}L.depthBuffer&&We(L)}function st(L){let b=L.textures;for(let O=0,X=b.length;O<X;O++){let J=b[O];if(m(J)){let Y=L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Ee=i.get(J).__webglTexture;t.bindTexture(Y,Ee),f(Y),t.unbindTexture()}}}let Qe=[],T=[];function te(L){if(L.samples>0){if(ae(L)===!1){let b=L.textures,O=L.width,X=L.height,J=n.COLOR_BUFFER_BIT,Y=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=i.get(L),le=b.length>1;if(le)for(let fe=0;fe<b.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let fe=0;fe<b.length;fe++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),le){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[fe]);let Je=i.get(b[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Je,0)}n.blitFramebuffer(0,0,O,X,0,0,O,X,J,n.NEAREST),c===!0&&(Qe.length=0,T.length=0,Qe.push(n.COLOR_ATTACHMENT0+fe),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Qe.push(Y),T.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,T)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Qe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),le)for(let fe=0;fe<b.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[fe]);let Je=i.get(b[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,Je,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let b=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function j(L){return Math.min(s.maxSamples,L.samples)}function ae(L){let b=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function re(L){let b=a.render.frame;l.get(L)!==b&&(l.set(L,b),L.update())}function ue(L,b){let O=L.colorSpace,X=L.format,J=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||O!==Ci&&O!==yi&&(ct.getTransfer(O)===gt?(X!==Dn||J!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}function ne(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(h.width=L.naturalWidth||L.width,h.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(h.width=L.displayWidth,h.height=L.displayHeight):(h.width=L.width,h.height=L.height),h}this.allocateTextureUnit=F,this.resetTextureUnits=w,this.setTexture2D=W,this.setTexture2DArray=ee,this.setTexture3D=V,this.setTextureCube=ie,this.rebindTextures=ke,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=se,this.useMultisampledRTT=ae}function tv(n,e){function t(i,s=yi){let r,a=ct.getTransfer(s);if(i===ai)return n.UNSIGNED_BYTE;if(i===nh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ih)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Vd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zd)return n.BYTE;if(i===Hd)return n.SHORT;if(i===pr)return n.UNSIGNED_SHORT;if(i===th)return n.INT;if(i===Qi)return n.UNSIGNED_INT;if(i===ri)return n.FLOAT;if(i===Mr)return n.HALF_FLOAT;if(i===Gd)return n.ALPHA;if(i===Wd)return n.RGB;if(i===Dn)return n.RGBA;if(i===Kd)return n.LUMINANCE;if(i===$d)return n.LUMINANCE_ALPHA;if(i===Rs)return n.DEPTH_COMPONENT;if(i===Us)return n.DEPTH_STENCIL;if(i===Xd)return n.RED;if(i===sh)return n.RED_INTEGER;if(i===qd)return n.RG;if(i===rh)return n.RG_INTEGER;if(i===oh)return n.RGBA_INTEGER;if(i===Mo||i===bo||i===wo||i===Eo)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Mo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Mo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Gc||i===Wc||i===Kc||i===$c)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Gc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Wc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Kc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===$c)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Xc||i===qc||i===Yc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Xc||i===qc)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Yc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Zc||i===jc||i===Jc||i===Qc||i===el||i===tl||i===nl||i===il||i===sl||i===rl||i===ol||i===al||i===cl||i===ll)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Zc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Jc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Qc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===el)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===tl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===nl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===il)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===sl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===rl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ol)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===al)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===cl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ll)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ao||i===hl||i===ul)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ao)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===hl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ul)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yd||i===dl||i===fl||i===pl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ao)return r.COMPRESSED_RED_RGTC1_EXT;if(i===dl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===fl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===pl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ks?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Ll=class extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},dn=class extends $t{constructor(){super(),this.isGroup=!0,this.type="Group"}},nv={type:"move"},ur=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),f=this._getHandJoint(h,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&d>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&d<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new dn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sv=`
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

}`,Pl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new xn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Kn({vertexShader:iv,fragmentShader:sv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new wt(new Os(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Il=class extends wi{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,d=null,p=null,g=null,_=new Pl,m=t.getContextAttributes(),f=null,S=null,v=[],M=[],E=new Re,C=null,R=new Zt;R.layers.enable(1),R.viewport=new bt;let P=new Zt;P.layers.enable(2),P.viewport=new bt;let N=[R,P],y=new Ll;y.layers.enable(1),y.layers.enable(2);let w=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let se=v[Z];return se===void 0&&(se=new ur,v[Z]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Z){let se=v[Z];return se===void 0&&(se=new ur,v[Z]=se),se.getGripSpace()},this.getHand=function(Z){let se=v[Z];return se===void 0&&(se=new ur,v[Z]=se),se.getHandSpace()};function B(Z){let se=M.indexOf(Z.inputSource);if(se===-1)return;let we=v[se];we!==void 0&&(we.update(Z.inputSource,Z.frame,h||a),we.dispatchEvent({type:Z.type,data:Z.inputSource}))}function W(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",ee);for(let Z=0;Z<v.length;Z++){let se=M[Z];se!==null&&(M[Z]=null,v[Z].disconnect(se))}w=null,F=null,_.reset(),e.setRenderTarget(f),p=null,d=null,u=null,s=null,S=null,it.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(E.width,E.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Z){h=Z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",W),s.addEventListener("inputsourceschange",ee),m.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(E),s.renderState.layers===void 0){let se={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,se),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new ci(p.framebufferWidth,p.framebufferHeight,{format:Dn,type:ai,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let se=null,we=null,ve=null;m.depth&&(ve=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=m.stencil?Us:Rs,we=m.stencil?ks:Qi);let We={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(We),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new ci(d.textureWidth,d.textureHeight,{format:Dn,type:ai,depthTexture:new Vo(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),it.setContext(s),it.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ee(Z){for(let se=0;se<Z.removed.length;se++){let we=Z.removed[se],ve=M.indexOf(we);ve>=0&&(M[ve]=null,v[ve].disconnect(we))}for(let se=0;se<Z.added.length;se++){let we=Z.added[se],ve=M.indexOf(we);if(ve===-1){for(let ke=0;ke<v.length;ke++)if(ke>=M.length){M.push(we),ve=ke;break}else if(M[ke]===null){M[ke]=we,ve=ke;break}if(ve===-1)break}let We=v[ve];We&&We.connect(we)}}let V=new I,ie=new I;function q(Z,se,we){V.setFromMatrixPosition(se.matrixWorld),ie.setFromMatrixPosition(we.matrixWorld);let ve=V.distanceTo(ie),We=se.projectionMatrix.elements,ke=we.projectionMatrix.elements,Ke=We[14]/(We[10]-1),st=We[14]/(We[10]+1),Qe=(We[9]+1)/We[5],T=(We[9]-1)/We[5],te=(We[8]-1)/We[0],j=(ke[8]+1)/ke[0],ae=Ke*te,re=Ke*j,ue=ve/(-te+j),ne=ue*-te;if(se.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ne),Z.translateZ(ue),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),We[10]===-1)Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let L=Ke+ue,b=st+ue,O=ae-ne,X=re+(ve-ne),J=Qe*st/b*L,Y=T*st/b*L;Z.projectionMatrix.makePerspective(O,X,J,Y,L,b),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function de(Z,se){se===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(se.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let se=Z.near,we=Z.far;_.texture!==null&&(_.depthNear>0&&(se=_.depthNear),_.depthFar>0&&(we=_.depthFar)),y.near=P.near=R.near=se,y.far=P.far=R.far=we,(w!==y.near||F!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,F=y.far);let ve=Z.parent,We=y.cameras;de(y,ve);for(let ke=0;ke<We.length;ke++)de(We[ke],ve);We.length===2?q(y,R,P):y.projectionMatrix.copy(R.projectionMatrix),xe(Z,y,ve)};function xe(Z,se,we){we===null?Z.matrix.copy(se.matrixWorld):(Z.matrix.copy(we.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(se.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=gl*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let ye=null;function et(Z,se){if(l=se.getViewerPose(h||a),g=se,l!==null){let we=l.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let ve=!1;we.length!==y.cameras.length&&(y.cameras.length=0,ve=!0);for(let ke=0;ke<we.length;ke++){let Ke=we[ke],st=null;if(p!==null)st=p.getViewport(Ke);else{let T=u.getViewSubImage(d,Ke);st=T.viewport,ke===0&&(e.setRenderTargetTextures(S,T.colorTexture,d.ignoreDepthValues?void 0:T.depthStencilTexture),e.setRenderTarget(S))}let Qe=N[ke];Qe===void 0&&(Qe=new Zt,Qe.layers.enable(ke),Qe.viewport=new bt,N[ke]=Qe),Qe.matrix.fromArray(Ke.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(Ke.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set(st.x,st.y,st.width,st.height),ke===0&&(y.matrix.copy(Qe.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ve===!0&&y.cameras.push(Qe)}let We=s.enabledFeatures;if(We&&We.includes("depth-sensing")){let ke=u.getDepthInformation(we[0]);ke&&ke.isValid&&ke.texture&&_.init(e,ke,s.renderState)}}for(let we=0;we<v.length;we++){let ve=M[we],We=v[we];ve!==null&&We!==void 0&&We.update(ve,se,h||a)}ye&&ye(Z,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),g=null}let it=new tf;it.setAnimationLoop(et),this.setAnimationLoop=function(Z){ye=Z},this.dispose=function(){}}},$i=new Wn,rv=new vt;function ov(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,ef(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),l(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,S,v):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===tn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===tn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let S=e.get(f),v=S.envMap,M=S.envMapRotation;v&&(m.envMap.value=v,$i.copy(M),$i.x*=-1,$i.y*=-1,$i.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),m.envMapRotation.value.setFromMatrix4(rv.makeRotationFromEuler($i)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=v*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===tn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let S=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function av(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,v){let M=v.program;i.uniformBlockBinding(S,M)}function h(S,v){let M=s[S.id];M===void 0&&(g(S),M=l(S),s[S.id]=M,S.addEventListener("dispose",m));let E=v.program;i.updateUBOMapping(S,E);let C=e.render.frame;r[S.id]!==C&&(d(S),r[S.id]=C)}function l(S){let v=u();S.__bindingPointIndex=v;let M=n.createBuffer(),E=S.__size,C=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,E,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,M),M}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){let v=s[S.id],M=S.uniforms,E=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let C=0,R=M.length;C<R;C++){let P=Array.isArray(M[C])?M[C]:[M[C]];for(let N=0,y=P.length;N<y;N++){let w=P[N];if(p(w,C,N,E)===!0){let F=w.__offset,B=Array.isArray(w.value)?w.value:[w.value],W=0;for(let ee=0;ee<B.length;ee++){let V=B[ee],ie=_(V);typeof V=="number"||typeof V=="boolean"?(w.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,F+W,w.__data)):V.isMatrix3?(w.__data[0]=V.elements[0],w.__data[1]=V.elements[1],w.__data[2]=V.elements[2],w.__data[3]=0,w.__data[4]=V.elements[3],w.__data[5]=V.elements[4],w.__data[6]=V.elements[5],w.__data[7]=0,w.__data[8]=V.elements[6],w.__data[9]=V.elements[7],w.__data[10]=V.elements[8],w.__data[11]=0):(V.toArray(w.__data,W),W+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,w.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,v,M,E){let C=S.value,R=v+"_"+M;if(E[R]===void 0)return typeof C=="number"||typeof C=="boolean"?E[R]=C:E[R]=C.clone(),!0;{let P=E[R];if(typeof C=="number"||typeof C=="boolean"){if(P!==C)return E[R]=C,!0}else if(P.equals(C)===!1)return P.copy(C),!0}return!1}function g(S){let v=S.uniforms,M=0,E=16;for(let R=0,P=v.length;R<P;R++){let N=Array.isArray(v[R])?v[R]:[v[R]];for(let y=0,w=N.length;y<w;y++){let F=N[y],B=Array.isArray(F.value)?F.value:[F.value];for(let W=0,ee=B.length;W<ee;W++){let V=B[W],ie=_(V),q=M%E,de=q%ie.boundary,xe=q+de;M+=de,xe!==0&&E-xe<ie.storage&&(M+=E-xe),F.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=ie.storage}}}let C=M%E;return C>0&&(M+=E-C),S.__size=M,S.__cache={},this}function _(S){let v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function m(S){let v=S.target;v.removeEventListener("dispose",m);let M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(let S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:h,dispose:f}}var Go=class{constructor(e={}){let{canvas:t=hm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Vn,this.toneMapping=Mi,this.toneMappingExposure=1;let v=this,M=!1,E=0,C=0,R=null,P=-1,N=null,y=new bt,w=new bt,F=null,B=new Ze(0),W=0,ee=t.width,V=t.height,ie=1,q=null,de=null,xe=new bt(0,0,ee,V),ye=new bt(0,0,ee,V),et=!1,it=new xr,Z=!1,se=!1,we=new vt,ve=new vt,We=new I,ke=new bt,Ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},st=!1;function Qe(){return R===null?ie:1}let T=i;function te(A,k){return t.getContext(A,k)}try{let A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${eh}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",_e,!1),T===null){let k="webgl2";if(T=te(k,A),T===null)throw te(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let j,ae,re,ue,ne,L,b,O,X,J,Y,Ee,le,fe,Je,oe,Me,Ve,Ge,be,tt,$e,pt,D;function ge(){j=new b_(T),j.init(),$e=new tv(T,j),ae=new __(T,j,e,$e),re=new Jx(T),ae.reverseDepthBuffer&&re.buffers.depth.setReversed(!0),ue=new A_(T),ne=new Bx,L=new ev(T,j,re,ne,ae,$e,ue),b=new v_(v),O=new M_(v),X=new Dm(T),pt=new m_(T,X),J=new w_(T,X,ue,pt),Y=new R_(T,J,X,ue),Ge=new T_(T,ae,L),oe=new x_(ne),Ee=new Ox(v,b,O,j,ae,pt,oe),le=new ov(v,ne),fe=new Hx,Je=new Xx(j),Ve=new p_(v,b,O,re,Y,d,c),Me=new Zx(v,Y,ae),D=new av(T,ue,ae,re),be=new g_(T,j,ue),tt=new E_(T,j,ue),ue.programs=Ee.programs,v.capabilities=ae,v.extensions=j,v.properties=ne,v.renderLists=fe,v.shadowMap=Me,v.state=re,v.info=ue}ge();let $=new Il(v,T);this.xr=$,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){let A=j.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=j.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(A){A!==void 0&&(ie=A,this.setSize(ee,V,!1))},this.getSize=function(A){return A.set(ee,V)},this.setSize=function(A,k,z=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ee=A,V=k,t.width=Math.floor(A*ie),t.height=Math.floor(k*ie),z===!0&&(t.style.width=A+"px",t.style.height=k+"px"),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(ee*ie,V*ie).floor()},this.setDrawingBufferSize=function(A,k,z){ee=A,V=k,ie=z,t.width=Math.floor(A*z),t.height=Math.floor(k*z),this.setViewport(0,0,A,k)},this.getCurrentViewport=function(A){return A.copy(y)},this.getViewport=function(A){return A.copy(xe)},this.setViewport=function(A,k,z,H){A.isVector4?xe.set(A.x,A.y,A.z,A.w):xe.set(A,k,z,H),re.viewport(y.copy(xe).multiplyScalar(ie).round())},this.getScissor=function(A){return A.copy(ye)},this.setScissor=function(A,k,z,H){A.isVector4?ye.set(A.x,A.y,A.z,A.w):ye.set(A,k,z,H),re.scissor(w.copy(ye).multiplyScalar(ie).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(A){re.setScissorTest(et=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){de=A},this.getClearColor=function(A){return A.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor.apply(Ve,arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha.apply(Ve,arguments)},this.clear=function(A=!0,k=!0,z=!0){let H=0;if(A){let U=!1;if(R!==null){let ce=R.texture.format;U=ce===oh||ce===rh||ce===sh}if(U){let ce=R.texture.type,me=ce===ai||ce===Qi||ce===pr||ce===ks||ce===nh||ce===ih,Ae=Ve.getClearColor(),Le=Ve.getClearAlpha(),Fe=Ae.r,Be=Ae.g,Pe=Ae.b;me?(p[0]=Fe,p[1]=Be,p[2]=Pe,p[3]=Le,T.clearBufferuiv(T.COLOR,0,p)):(g[0]=Fe,g[1]=Be,g[2]=Pe,g[3]=Le,T.clearBufferiv(T.COLOR,0,g))}else H|=T.COLOR_BUFFER_BIT}k&&(H|=T.DEPTH_BUFFER_BIT,T.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),z&&(H|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),fe.dispose(),Je.dispose(),ne.dispose(),b.dispose(),O.dispose(),Y.dispose(),pt.dispose(),D.dispose(),Ee.dispose(),$.dispose(),$.removeEventListener("sessionstart",Eh),$.removeEventListener("sessionend",Ah),Di.stop()};function Q(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;let A=ue.autoReset,k=Me.enabled,z=Me.autoUpdate,H=Me.needsUpdate,U=Me.type;ge(),ue.autoReset=A,Me.enabled=k,Me.autoUpdate=z,Me.needsUpdate=H,Me.type=U}function _e(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function nt(A){let k=A.target;k.removeEventListener("dispose",nt),At(k)}function At(A){Jt(A),ne.remove(A)}function Jt(A){let k=ne.get(A).programs;k!==void 0&&(k.forEach(function(z){Ee.releaseProgram(z)}),A.isShaderMaterial&&Ee.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,z,H,U,ce){k===null&&(k=Ke);let me=U.isMesh&&U.matrixWorld.determinant()<0,Ae=Nf(A,k,z,H,U);re.setMaterial(H,me);let Le=z.index,Fe=1;if(H.wireframe===!0){if(Le=J.getWireframeAttribute(z),Le===void 0)return;Fe=2}let Be=z.drawRange,Pe=z.attributes.position,lt=Be.start*Fe,mt=(Be.start+Be.count)*Fe;ce!==null&&(lt=Math.max(lt,ce.start*Fe),mt=Math.min(mt,(ce.start+ce.count)*Fe)),Le!==null?(lt=Math.max(lt,0),mt=Math.min(mt,Le.count)):Pe!=null&&(lt=Math.max(lt,0),mt=Math.min(mt,Pe.count));let St=mt-lt;if(St<0||St===1/0)return;pt.setup(U,H,Ae,z,Le);let rn,ot=be;if(Le!==null&&(rn=X.get(Le),ot=tt,ot.setIndex(rn)),U.isMesh)H.wireframe===!0?(re.setLineWidth(H.wireframeLinewidth*Qe()),ot.setMode(T.LINES)):ot.setMode(T.TRIANGLES);else if(U.isLine){let Ie=H.linewidth;Ie===void 0&&(Ie=1),re.setLineWidth(Ie*Qe()),U.isLineSegments?ot.setMode(T.LINES):U.isLineLoop?ot.setMode(T.LINE_LOOP):ot.setMode(T.LINE_STRIP)}else U.isPoints?ot.setMode(T.POINTS):U.isSprite&&ot.setMode(T.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ot.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(j.get("WEBGL_multi_draw"))ot.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{let Ie=U._multiDrawStarts,Ot=U._multiDrawCounts,at=U._multiDrawCount,bn=Le?X.get(Le).bytesPerElement:1,rs=ne.get(H).currentProgram.getUniforms();for(let on=0;on<at;on++)rs.setValue(T,"_gl_DrawID",on),ot.render(Ie[on]/bn,Ot[on])}else if(U.isInstancedMesh)ot.renderInstances(lt,St,U.count);else if(z.isInstancedBufferGeometry){let Ie=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Ot=Math.min(z.instanceCount,Ie);ot.renderInstances(lt,St,Ot)}else ot.render(lt,St)};function rt(A,k,z){A.transparent===!0&&A.side===si&&A.forceSinglePass===!1?(A.side=tn,A.needsUpdate=!0,Cr(A,k,z),A.side=bi,A.needsUpdate=!0,Cr(A,k,z),A.side=si):Cr(A,k,z)}this.compile=function(A,k,z=null){z===null&&(z=A),m=Je.get(z),m.init(k),S.push(m),z.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),A!==z&&A.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();let H=new Set;return A.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;let ce=U.material;if(ce)if(Array.isArray(ce))for(let me=0;me<ce.length;me++){let Ae=ce[me];rt(Ae,z,U),H.add(Ae)}else rt(ce,z,U),H.add(ce)}),S.pop(),m=null,H},this.compileAsync=function(A,k,z=null){let H=this.compile(A,k,z);return new Promise(U=>{function ce(){if(H.forEach(function(me){ne.get(me).currentProgram.isReady()&&H.delete(me)}),H.size===0){U(A);return}setTimeout(ce,10)}j.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Qt=null;function Yn(A){Qt&&Qt(A)}function Eh(){Di.stop()}function Ah(){Di.start()}let Di=new tf;Di.setAnimationLoop(Yn),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(A){Qt=A,$.setAnimationLoop(A),A===null?Di.stop():Di.start()},$.addEventListener("sessionstart",Eh),$.addEventListener("sessionend",Ah),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(k),k=$.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,k,R),m=Je.get(A,S.length),m.init(k),S.push(m),ve.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),it.setFromProjectionMatrix(ve),se=this.localClippingEnabled,Z=oe.init(this.clippingPlanes,se),_=fe.get(A,f.length),_.init(),f.push(_),$.enabled===!0&&$.isPresenting===!0){let ce=v.xr.getDepthSensingMesh();ce!==null&&xa(ce,k,-1/0,v.sortObjects)}xa(A,k,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(q,de),st=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,st&&Ve.addToRenderList(_,A),this.info.render.frame++,Z===!0&&oe.beginShadows();let z=m.state.shadowsArray;Me.render(z,A,k),Z===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=_.opaque,U=_.transmissive;if(m.setupLights(),k.isArrayCamera){let ce=k.cameras;if(U.length>0)for(let me=0,Ae=ce.length;me<Ae;me++){let Le=ce[me];Rh(H,U,A,Le)}st&&Ve.render(A);for(let me=0,Ae=ce.length;me<Ae;me++){let Le=ce[me];Th(_,A,Le,Le.viewport)}}else U.length>0&&Rh(H,U,A,k),st&&Ve.render(A),Th(_,A,k);R!==null&&(L.updateMultisampleRenderTarget(R),L.updateRenderTargetMipmap(R)),A.isScene===!0&&A.onAfterRender(v,A,k),pt.resetDefaultState(),P=-1,N=null,S.pop(),S.length>0?(m=S[S.length-1],Z===!0&&oe.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function xa(A,k,z,H){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||it.intersectsSprite(A)){H&&ke.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ve);let me=Y.update(A),Ae=A.material;Ae.visible&&_.push(A,me,Ae,z,ke.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||it.intersectsObject(A))){let me=Y.update(A),Ae=A.material;if(H&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ke.copy(A.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),ke.copy(me.boundingSphere.center)),ke.applyMatrix4(A.matrixWorld).applyMatrix4(ve)),Array.isArray(Ae)){let Le=me.groups;for(let Fe=0,Be=Le.length;Fe<Be;Fe++){let Pe=Le[Fe],lt=Ae[Pe.materialIndex];lt&&lt.visible&&_.push(A,me,lt,z,ke.z,Pe)}}else Ae.visible&&_.push(A,me,Ae,z,ke.z,null)}}let ce=A.children;for(let me=0,Ae=ce.length;me<Ae;me++)xa(ce[me],k,z,H)}function Th(A,k,z,H){let U=A.opaque,ce=A.transmissive,me=A.transparent;m.setupLightsView(z),Z===!0&&oe.setGlobalState(v.clippingPlanes,z),H&&re.viewport(y.copy(H)),U.length>0&&Rr(U,k,z),ce.length>0&&Rr(ce,k,z),me.length>0&&Rr(me,k,z),re.buffers.depth.setTest(!0),re.buffers.depth.setMask(!0),re.buffers.color.setMask(!0),re.setPolygonOffset(!1)}function Rh(A,k,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[H.id]===void 0&&(m.state.transmissionRenderTarget[H.id]=new ci(1,1,{generateMipmaps:!0,type:j.has("EXT_color_buffer_half_float")||j.has("EXT_color_buffer_float")?Mr:ai,minFilter:Ji,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace}));let ce=m.state.transmissionRenderTarget[H.id],me=H.viewport||y;ce.setSize(me.z,me.w);let Ae=v.getRenderTarget();v.setRenderTarget(ce),v.getClearColor(B),W=v.getClearAlpha(),W<1&&v.setClearColor(16777215,.5),v.clear(),st&&Ve.render(z);let Le=v.toneMapping;v.toneMapping=Mi;let Fe=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),m.setupLightsView(H),Z===!0&&oe.setGlobalState(v.clippingPlanes,H),Rr(A,z,H),L.updateMultisampleRenderTarget(ce),L.updateRenderTargetMipmap(ce),j.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Pe=0,lt=k.length;Pe<lt;Pe++){let mt=k[Pe],St=mt.object,rn=mt.geometry,ot=mt.material,Ie=mt.group;if(ot.side===si&&St.layers.test(H.layers)){let Ot=ot.side;ot.side=tn,ot.needsUpdate=!0,Ch(St,z,H,rn,ot,Ie),ot.side=Ot,ot.needsUpdate=!0,Be=!0}}Be===!0&&(L.updateMultisampleRenderTarget(ce),L.updateRenderTargetMipmap(ce))}v.setRenderTarget(Ae),v.setClearColor(B,W),Fe!==void 0&&(H.viewport=Fe),v.toneMapping=Le}function Rr(A,k,z){let H=k.isScene===!0?k.overrideMaterial:null;for(let U=0,ce=A.length;U<ce;U++){let me=A[U],Ae=me.object,Le=me.geometry,Fe=H===null?me.material:H,Be=me.group;Ae.layers.test(z.layers)&&Ch(Ae,k,z,Le,Fe,Be)}}function Ch(A,k,z,H,U,ce){A.onBeforeRender(v,k,z,H,U,ce),A.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),U.onBeforeRender(v,k,z,H,A,ce),U.transparent===!0&&U.side===si&&U.forceSinglePass===!1?(U.side=tn,U.needsUpdate=!0,v.renderBufferDirect(z,k,H,U,A,ce),U.side=bi,U.needsUpdate=!0,v.renderBufferDirect(z,k,H,U,A,ce),U.side=si):v.renderBufferDirect(z,k,H,U,A,ce),A.onAfterRender(v,k,z,H,U,ce)}function Cr(A,k,z){k.isScene!==!0&&(k=Ke);let H=ne.get(A),U=m.state.lights,ce=m.state.shadowsArray,me=U.state.version,Ae=Ee.getParameters(A,U.state,ce,k,z),Le=Ee.getProgramCacheKey(Ae),Fe=H.programs;H.environment=A.isMeshStandardMaterial?k.environment:null,H.fog=k.fog,H.envMap=(A.isMeshStandardMaterial?O:b).get(A.envMap||H.environment),H.envMapRotation=H.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,Fe===void 0&&(A.addEventListener("dispose",nt),Fe=new Map,H.programs=Fe);let Be=Fe.get(Le);if(Be!==void 0){if(H.currentProgram===Be&&H.lightsStateVersion===me)return Ph(A,Ae),Be}else Ae.uniforms=Ee.getUniforms(A),A.onBeforeCompile(Ae,v),Be=Ee.acquireProgram(Ae,Le),Fe.set(Le,Be),H.uniforms=Ae.uniforms;let Pe=H.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Pe.clippingPlanes=oe.uniform),Ph(A,Ae),H.needsLights=Of(A),H.lightsStateVersion=me,H.needsLights&&(Pe.ambientLightColor.value=U.state.ambient,Pe.lightProbe.value=U.state.probe,Pe.directionalLights.value=U.state.directional,Pe.directionalLightShadows.value=U.state.directionalShadow,Pe.spotLights.value=U.state.spot,Pe.spotLightShadows.value=U.state.spotShadow,Pe.rectAreaLights.value=U.state.rectArea,Pe.ltc_1.value=U.state.rectAreaLTC1,Pe.ltc_2.value=U.state.rectAreaLTC2,Pe.pointLights.value=U.state.point,Pe.pointLightShadows.value=U.state.pointShadow,Pe.hemisphereLights.value=U.state.hemi,Pe.directionalShadowMap.value=U.state.directionalShadowMap,Pe.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Pe.spotShadowMap.value=U.state.spotShadowMap,Pe.spotLightMatrix.value=U.state.spotLightMatrix,Pe.spotLightMap.value=U.state.spotLightMap,Pe.pointShadowMap.value=U.state.pointShadowMap,Pe.pointShadowMatrix.value=U.state.pointShadowMatrix),H.currentProgram=Be,H.uniformsList=null,Be}function Lh(A){if(A.uniformsList===null){let k=A.currentProgram.getUniforms();A.uniformsList=Ls.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function Ph(A,k){let z=ne.get(A);z.outputColorSpace=k.outputColorSpace,z.batching=k.batching,z.batchingColor=k.batchingColor,z.instancing=k.instancing,z.instancingColor=k.instancingColor,z.instancingMorph=k.instancingMorph,z.skinning=k.skinning,z.morphTargets=k.morphTargets,z.morphNormals=k.morphNormals,z.morphColors=k.morphColors,z.morphTargetsCount=k.morphTargetsCount,z.numClippingPlanes=k.numClippingPlanes,z.numIntersection=k.numClipIntersection,z.vertexAlphas=k.vertexAlphas,z.vertexTangents=k.vertexTangents,z.toneMapping=k.toneMapping}function Nf(A,k,z,H,U){k.isScene!==!0&&(k=Ke),L.resetTextureUnits();let ce=k.fog,me=H.isMeshStandardMaterial?k.environment:null,Ae=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Ci,Le=(H.isMeshStandardMaterial?O:b).get(H.envMap||me),Fe=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Be=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pe=!!z.morphAttributes.position,lt=!!z.morphAttributes.normal,mt=!!z.morphAttributes.color,St=Mi;H.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(St=v.toneMapping);let rn=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ot=rn!==void 0?rn.length:0,Ie=ne.get(H),Ot=m.state.lights;if(Z===!0&&(se===!0||A!==N)){let fn=A===N&&H.id===P;oe.setState(H,A,fn)}let at=!1;H.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==Ot.state.version||Ie.outputColorSpace!==Ae||U.isBatchedMesh&&Ie.batching===!1||!U.isBatchedMesh&&Ie.batching===!0||U.isBatchedMesh&&Ie.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ie.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ie.instancing===!1||!U.isInstancedMesh&&Ie.instancing===!0||U.isSkinnedMesh&&Ie.skinning===!1||!U.isSkinnedMesh&&Ie.skinning===!0||U.isInstancedMesh&&Ie.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ie.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ie.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ie.instancingMorph===!1&&U.morphTexture!==null||Ie.envMap!==Le||H.fog===!0&&Ie.fog!==ce||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==oe.numPlanes||Ie.numIntersection!==oe.numIntersection)||Ie.vertexAlphas!==Fe||Ie.vertexTangents!==Be||Ie.morphTargets!==Pe||Ie.morphNormals!==lt||Ie.morphColors!==mt||Ie.toneMapping!==St||Ie.morphTargetsCount!==ot)&&(at=!0):(at=!0,Ie.__version=H.version);let bn=Ie.currentProgram;at===!0&&(bn=Cr(H,k,U));let rs=!1,on=!1,va=!1,Et=bn.getUniforms(),li=Ie.uniforms;if(re.useProgram(bn.program)&&(rs=!0,on=!0,va=!0),H.id!==P&&(P=H.id,on=!0),rs||N!==A){ae.reverseDepthBuffer?(we.copy(A.projectionMatrix),dm(we),fm(we),Et.setValue(T,"projectionMatrix",we)):Et.setValue(T,"projectionMatrix",A.projectionMatrix),Et.setValue(T,"viewMatrix",A.matrixWorldInverse);let fn=Et.map.cameraPosition;fn!==void 0&&fn.setValue(T,We.setFromMatrixPosition(A.matrixWorld)),ae.logarithmicDepthBuffer&&Et.setValue(T,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Et.setValue(T,"isOrthographic",A.isOrthographicCamera===!0),N!==A&&(N=A,on=!0,va=!0)}if(U.isSkinnedMesh){Et.setOptional(T,U,"bindMatrix"),Et.setOptional(T,U,"bindMatrixInverse");let fn=U.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),Et.setValue(T,"boneTexture",fn.boneTexture,L))}U.isBatchedMesh&&(Et.setOptional(T,U,"batchingTexture"),Et.setValue(T,"batchingTexture",U._matricesTexture,L),Et.setOptional(T,U,"batchingIdTexture"),Et.setValue(T,"batchingIdTexture",U._indirectTexture,L),Et.setOptional(T,U,"batchingColorTexture"),U._colorsTexture!==null&&Et.setValue(T,"batchingColorTexture",U._colorsTexture,L));let ya=z.morphAttributes;if((ya.position!==void 0||ya.normal!==void 0||ya.color!==void 0)&&Ge.update(U,z,bn),(on||Ie.receiveShadow!==U.receiveShadow)&&(Ie.receiveShadow=U.receiveShadow,Et.setValue(T,"receiveShadow",U.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(li.envMap.value=Le,li.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&k.environment!==null&&(li.envMapIntensity.value=k.environmentIntensity),on&&(Et.setValue(T,"toneMappingExposure",v.toneMappingExposure),Ie.needsLights&&Ff(li,va),ce&&H.fog===!0&&le.refreshFogUniforms(li,ce),le.refreshMaterialUniforms(li,H,ie,V,m.state.transmissionRenderTarget[A.id]),Ls.upload(T,Lh(Ie),li,L)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ls.upload(T,Lh(Ie),li,L),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Et.setValue(T,"center",U.center),Et.setValue(T,"modelViewMatrix",U.modelViewMatrix),Et.setValue(T,"normalMatrix",U.normalMatrix),Et.setValue(T,"modelMatrix",U.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let fn=H.uniformsGroups;for(let Sa=0,Bf=fn.length;Sa<Bf;Sa++){let Ih=fn[Sa];D.update(Ih,bn),D.bind(Ih,bn)}}return bn}function Ff(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function Of(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(A,k,z){ne.get(A.texture).__webglTexture=k,ne.get(A.depthTexture).__webglTexture=z;let H=ne.get(A);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=z===void 0,H.__autoAllocateDepthBuffer||j.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,k){let z=ne.get(A);z.__webglFramebuffer=k,z.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,z=0){R=A,E=k,C=z;let H=!0,U=null,ce=!1,me=!1;if(A){let Le=ne.get(A);if(Le.__useDefaultFramebuffer!==void 0)re.bindFramebuffer(T.FRAMEBUFFER,null),H=!1;else if(Le.__webglFramebuffer===void 0)L.setupRenderTarget(A);else if(Le.__hasExternalTextures)L.rebindTextures(A,ne.get(A.texture).__webglTexture,ne.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Pe=A.depthTexture;if(Le.__boundDepthTexture!==Pe){if(Pe!==null&&ne.has(Pe)&&(A.width!==Pe.image.width||A.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(A)}}let Fe=A.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(me=!0);let Be=ne.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Be[k])?U=Be[k][z]:U=Be[k],ce=!0):A.samples>0&&L.useMultisampledRTT(A)===!1?U=ne.get(A).__webglMultisampledFramebuffer:Array.isArray(Be)?U=Be[z]:U=Be,y.copy(A.viewport),w.copy(A.scissor),F=A.scissorTest}else y.copy(xe).multiplyScalar(ie).floor(),w.copy(ye).multiplyScalar(ie).floor(),F=et;if(re.bindFramebuffer(T.FRAMEBUFFER,U)&&H&&re.drawBuffers(A,U),re.viewport(y),re.scissor(w),re.setScissorTest(F),ce){let Le=ne.get(A.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+k,Le.__webglTexture,z)}else if(me){let Le=ne.get(A.texture),Fe=k||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,Le.__webglTexture,z||0,Fe)}P=-1},this.readRenderTargetPixels=function(A,k,z,H,U,ce,me){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=ne.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&me!==void 0&&(Ae=Ae[me]),Ae){re.bindFramebuffer(T.FRAMEBUFFER,Ae);try{let Le=A.texture,Fe=Le.format,Be=Le.type;if(!ae.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-H&&z>=0&&z<=A.height-U&&T.readPixels(k,z,H,U,$e.convert(Fe),$e.convert(Be),ce)}finally{let Le=R!==null?ne.get(R).__webglFramebuffer:null;re.bindFramebuffer(T.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(A,k,z,H,U,ce,me){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=ne.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&me!==void 0&&(Ae=Ae[me]),Ae){let Le=A.texture,Fe=Le.format,Be=Le.type;if(!ae.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=A.width-H&&z>=0&&z<=A.height-U){re.bindFramebuffer(T.FRAMEBUFFER,Ae);let Pe=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,Pe),T.bufferData(T.PIXEL_PACK_BUFFER,ce.byteLength,T.STREAM_READ),T.readPixels(k,z,H,U,$e.convert(Fe),$e.convert(Be),0);let lt=R!==null?ne.get(R).__webglFramebuffer:null;re.bindFramebuffer(T.FRAMEBUFFER,lt);let mt=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await um(T,mt,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,Pe),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,ce),T.deleteBuffer(Pe),T.deleteSync(mt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,k=null,z=0){A.isTexture!==!0&&(To("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,A=arguments[1]);let H=Math.pow(2,-z),U=Math.floor(A.image.width*H),ce=Math.floor(A.image.height*H),me=k!==null?k.x:0,Ae=k!==null?k.y:0;L.setTexture2D(A,0),T.copyTexSubImage2D(T.TEXTURE_2D,z,0,0,me,Ae,U,ce),re.unbindTexture()},this.copyTextureToTexture=function(A,k,z=null,H=null,U=0){A.isTexture!==!0&&(To("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,A=arguments[1],k=arguments[2],U=arguments[3]||0,z=null);let ce,me,Ae,Le,Fe,Be;z!==null?(ce=z.max.x-z.min.x,me=z.max.y-z.min.y,Ae=z.min.x,Le=z.min.y):(ce=A.image.width,me=A.image.height,Ae=0,Le=0),H!==null?(Fe=H.x,Be=H.y):(Fe=0,Be=0);let Pe=$e.convert(k.format),lt=$e.convert(k.type);L.setTexture2D(k,0),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,k.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,k.unpackAlignment);let mt=T.getParameter(T.UNPACK_ROW_LENGTH),St=T.getParameter(T.UNPACK_IMAGE_HEIGHT),rn=T.getParameter(T.UNPACK_SKIP_PIXELS),ot=T.getParameter(T.UNPACK_SKIP_ROWS),Ie=T.getParameter(T.UNPACK_SKIP_IMAGES),Ot=A.isCompressedTexture?A.mipmaps[U]:A.image;T.pixelStorei(T.UNPACK_ROW_LENGTH,Ot.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Ot.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Ae),T.pixelStorei(T.UNPACK_SKIP_ROWS,Le),A.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,U,Fe,Be,ce,me,Pe,lt,Ot.data):A.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,U,Fe,Be,Ot.width,Ot.height,Pe,Ot.data):T.texSubImage2D(T.TEXTURE_2D,U,Fe,Be,ce,me,Pe,lt,Ot),T.pixelStorei(T.UNPACK_ROW_LENGTH,mt),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,St),T.pixelStorei(T.UNPACK_SKIP_PIXELS,rn),T.pixelStorei(T.UNPACK_SKIP_ROWS,ot),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ie),U===0&&k.generateMipmaps&&T.generateMipmap(T.TEXTURE_2D),re.unbindTexture()},this.copyTextureToTexture3D=function(A,k,z=null,H=null,U=0){A.isTexture!==!0&&(To("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,H=arguments[1]||null,A=arguments[2],k=arguments[3],U=arguments[4]||0);let ce,me,Ae,Le,Fe,Be,Pe,lt,mt,St=A.isCompressedTexture?A.mipmaps[U]:A.image;z!==null?(ce=z.max.x-z.min.x,me=z.max.y-z.min.y,Ae=z.max.z-z.min.z,Le=z.min.x,Fe=z.min.y,Be=z.min.z):(ce=St.width,me=St.height,Ae=St.depth,Le=0,Fe=0,Be=0),H!==null?(Pe=H.x,lt=H.y,mt=H.z):(Pe=0,lt=0,mt=0);let rn=$e.convert(k.format),ot=$e.convert(k.type),Ie;if(k.isData3DTexture)L.setTexture3D(k,0),Ie=T.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)L.setTexture2DArray(k,0),Ie=T.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,k.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,k.unpackAlignment);let Ot=T.getParameter(T.UNPACK_ROW_LENGTH),at=T.getParameter(T.UNPACK_IMAGE_HEIGHT),bn=T.getParameter(T.UNPACK_SKIP_PIXELS),rs=T.getParameter(T.UNPACK_SKIP_ROWS),on=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,St.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,St.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Le),T.pixelStorei(T.UNPACK_SKIP_ROWS,Fe),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Be),A.isDataTexture||A.isData3DTexture?T.texSubImage3D(Ie,U,Pe,lt,mt,ce,me,Ae,rn,ot,St.data):k.isCompressedArrayTexture?T.compressedTexSubImage3D(Ie,U,Pe,lt,mt,ce,me,Ae,rn,St.data):T.texSubImage3D(Ie,U,Pe,lt,mt,ce,me,Ae,rn,ot,St),T.pixelStorei(T.UNPACK_ROW_LENGTH,Ot),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,at),T.pixelStorei(T.UNPACK_SKIP_PIXELS,bn),T.pixelStorei(T.UNPACK_SKIP_ROWS,rs),T.pixelStorei(T.UNPACK_SKIP_IMAGES,on),U===0&&k.generateMipmaps&&T.generateMipmap(Ie),re.unbindTexture()},this.initRenderTarget=function(A){ne.get(A).__webglFramebuffer===void 0&&L.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?L.setTextureCube(A,0):A.isData3DTexture?L.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?L.setTexture2DArray(A,0):L.setTexture2D(A,0),re.unbindTexture()},this.resetState=function(){E=0,C=0,R=null,re.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===ah?"display-p3":"srgb",t.unpackColorSpace=ct.workingColorSpace===oa?"display-p3":"srgb"}};var Wo=class extends $t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wn,this.environmentIntensity=1,this.environmentRotation=new Wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var ts=class extends Ai{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ko=new I,$o=new I,Td=new vt,lr=new mr,xo=new Ns,Ec=new I,Rd=new I,vr=class extends $t{constructor(e=new Xt,t=new ts){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Ko.fromBufferAttribute(t,s-1),$o.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Ko.distanceTo($o);e.setAttribute("lineDistance",new _t(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),xo.copy(i.boundingSphere),xo.applyMatrix4(s),xo.radius+=r,e.ray.intersectsSphere(xo)===!1)return;Td.copy(s).invert(),lr.copy(e.ray).applyMatrix4(Td);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,l=i.index,d=i.attributes.position;if(l!==null){let p=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=l.getX(_),S=l.getX(_+1),v=vo(this,e,lr,c,f,S);v&&t.push(v)}if(this.isLineLoop){let _=l.getX(g-1),m=l.getX(p),f=vo(this,e,lr,c,_,m);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=h){let f=vo(this,e,lr,c,_,_+1);f&&t.push(f)}if(this.isLineLoop){let _=vo(this,e,lr,c,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function vo(n,e,t,i,s,r){let a=n.geometry.attributes.position;if(Ko.fromBufferAttribute(a,s),$o.fromBufferAttribute(a,r),t.distanceSqToSegment(Ko,$o,Ec,Rd)>i)return;Ec.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Ec);if(!(c<e.near||c>e.far))return{distance:c,point:Rd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}var Cd=new I,Ld=new I,yr=class extends vr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Cd.fromBufferAttribute(t,s),Ld.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Cd.distanceTo(Ld);e.setAttribute("lineDistance",new _t(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,a;t?a=t:a=e*i[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=i[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);let l=i[s],d=i[s+1]-l,p=(a-l)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Re:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new I,s=[],r=[],a=[],o=new I,c=new vt;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let h=Number.MAX_VALUE,l=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);l<=h&&(h=l,i.set(1,0,0)),u<=h&&(h=u,i.set(0,1,0)),d<=h&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Vt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Vt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Sr=class extends vn{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Re){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=h-this.aY;c=d*l-p*u+this.aX,h=d*u+p*l+this.aY}return i.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Dl=class extends Sr{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function lh(){let n=0,e=0,t=0,i=0;function s(r,a,o,c){n=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let d=(a-r)/h-(o-r)/(h+l)+(o-a)/l,p=(o-a)/l-(c-a)/(l+u)+(c-o)/u;d*=l,p*=l,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return n+e*r+t*a+i*o}}}var yo=new I,Ac=new lh,Tc=new lh,Rc=new lh,kl=class extends vn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new I){let i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(yo.subVectors(s[0],s[1]).add(s[0]),h=yo);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(yo.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=yo),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ac.initNonuniformCatmullRom(h.x,u.x,d.x,l.x,g,_,m),Tc.initNonuniformCatmullRom(h.y,u.y,d.y,l.y,g,_,m),Rc.initNonuniformCatmullRom(h.z,u.z,d.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(Ac.initCatmullRom(h.x,u.x,d.x,l.x,this.tension),Tc.initCatmullRom(h.y,u.y,d.y,l.y,this.tension),Rc.initCatmullRom(h.z,u.z,d.z,l.z,this.tension));return i.set(Ac.calc(c),Tc.calc(c),Rc.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Pd(n,e,t,i,s){let r=(i-e)*.5,a=(s-t)*.5,o=n*n,c=n*o;return(2*t-2*i+r+a)*c+(-3*t+3*i-2*r-a)*o+r*n+t}function cv(n,e){let t=1-n;return t*t*e}function lv(n,e){return 2*(1-n)*n*e}function hv(n,e){return n*n*e}function dr(n,e,t,i){return cv(n,e)+lv(n,t)+hv(n,i)}function uv(n,e){let t=1-n;return t*t*t*e}function dv(n,e){let t=1-n;return 3*t*t*n*e}function fv(n,e){return 3*(1-n)*n*n*e}function pv(n,e){return n*n*n*e}function fr(n,e,t,i,s){return uv(n,e)+dv(n,t)+fv(n,i)+pv(n,s)}var Xo=class extends vn{constructor(e=new Re,t=new Re,i=new Re,s=new Re){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new Re){let i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(fr(e,s.x,r.x,a.x,o.x),fr(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ul=class extends vn{constructor(e=new I,t=new I,i=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new I){let i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(fr(e,s.x,r.x,a.x,o.x),fr(e,s.y,r.y,a.y,o.y),fr(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qo=class extends vn{constructor(e=new Re,t=new Re){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Re){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Re){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Nl=class extends vn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yo=class extends vn{constructor(e=new Re,t=new Re,i=new Re){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Re){let i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(dr(e,s.x,r.x,a.x),dr(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fl=class extends vn{constructor(e=new I,t=new I,i=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new I){let i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(dr(e,s.x,r.x,a.x),dr(e,s.y,r.y,a.y),dr(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zo=class extends vn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Re){let i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],l=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Pd(o,c.x,h.x,l.x,u.x),Pd(o,c.y,h.y,l.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new Re().fromArray(s))}return this}},Id=Object.freeze({__proto__:null,ArcCurve:Dl,CatmullRomCurve3:kl,CubicBezierCurve:Xo,CubicBezierCurve3:Ul,EllipseCurve:Sr,LineCurve:qo,LineCurve3:Nl,QuadraticBezierCurve:Yo,QuadraticBezierCurve3:Fl,SplineCurve:Zo}),Ol=class extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Id[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let a=s[r]-i,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let h=0;h<c.length;h++){let l=c[h];i&&i.equals(l)||(t.push(l),i=l)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new Id[s.type]().fromJSON(s))}return this}},Bl=class extends Ol{constructor(e){super(),this.type="Path",this.currentPoint=new Re,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new qo(this.currentPoint.clone(),new Re(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new Yo(this.currentPoint.clone(),new Re(e,t),new Re(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){let o=new Xo(this.currentPoint.clone(),new Re(e,t),new Re(i,s),new Re(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Zo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,c){let h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+h,t+l,i,s,r,a,o,c),this}absellipse(e,t,i,s,r,a,o,c){let h=new Sr(e,t,i,s,r,a,o,c);if(this.curves.length>0){let u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);let l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},zl=class n extends Xt{constructor(e=[new Re(0,-.5),new Re(.5,0),new Re(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=Vt(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],h=[],l=1/t,u=new I,d=new Re,p=new I,g=new I,_=new I,m=0,f=0;for(let S=0;S<=e.length-1;S++)switch(S){case 0:m=e[S+1].x-e[S].x,f=e[S+1].y-e[S].y,p.x=f*1,p.y=-m,p.z=f*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[S+1].x-e[S].x,f=e[S+1].y-e[S].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let S=0;S<=t;S++){let v=i+S*l*s,M=Math.sin(v),E=Math.cos(v);for(let C=0;C<=e.length-1;C++){u.x=e[C].x*M,u.y=e[C].y,u.z=e[C].x*E,a.push(u.x,u.y,u.z),d.x=S/t,d.y=C/(e.length-1),o.push(d.x,d.y);let R=c[3*C+0]*M,P=c[3*C+1],N=c[3*C+0]*E;h.push(R,P,N)}}for(let S=0;S<t;S++)for(let v=0;v<e.length-1;v++){let M=v+S*e.length,E=M,C=M+e.length,R=M+e.length+1,P=M+1;r.push(E,C,P),r.push(R,P,C)}this.setIndex(r),this.setAttribute("position",new _t(a,3)),this.setAttribute("uv",new _t(o,2)),this.setAttribute("normal",new _t(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.points,e.segments,e.phiStart,e.phiLength)}},jo=class n extends zl{constructor(e=1,t=1,i=4,s=8){let r=new Bl;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(i),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:s}}static fromJSON(e){return new n(e.radius,e.length,e.capSegments,e.radialSegments)}};var Jo=class n extends Xt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let l=[],u=[],d=[],p=[],g=0,_=[],m=i/2,f=0;S(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new _t(u,3)),this.setAttribute("normal",new _t(d,3)),this.setAttribute("uv",new _t(p,2));function S(){let M=new I,E=new I,C=0,R=(t-e)/i;for(let P=0;P<=r;P++){let N=[],y=P/r,w=y*(t-e)+e;for(let F=0;F<=s;F++){let B=F/s,W=B*c+o,ee=Math.sin(W),V=Math.cos(W);E.x=w*ee,E.y=-y*i+m,E.z=w*V,u.push(E.x,E.y,E.z),M.set(ee,R,V).normalize(),d.push(M.x,M.y,M.z),p.push(B,1-y),N.push(g++)}_.push(N)}for(let P=0;P<s;P++)for(let N=0;N<r;N++){let y=_[N][P],w=_[N+1][P],F=_[N+1][P+1],B=_[N][P+1];e>0&&(l.push(y,w,B),C+=3),t>0&&(l.push(w,F,B),C+=3)}h.addGroup(f,C,0),f+=C}function v(M){let E=g,C=new Re,R=new I,P=0,N=M===!0?e:t,y=M===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*y,0),d.push(0,y,0),p.push(.5,.5),g++;let w=g;for(let F=0;F<=s;F++){let W=F/s*c+o,ee=Math.cos(W),V=Math.sin(W);R.x=N*V,R.y=m*y,R.z=N*ee,u.push(R.x,R.y,R.z),d.push(0,y,0),C.x=ee*.5+.5,C.y=V*.5*y+.5,p.push(C.x,C.y),g++}for(let F=0;F<s;F++){let B=E+F,W=w+F;M===!0?l.push(W,W+1,B):l.push(W+1,W,B),P+=3}h.addGroup(f,P,M===!0?1:2),f+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Bs=class n extends Xt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),h=0,l=[],u=new I,d=new I,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let S=[],v=f/i,M=0;f===0&&a===0?M=.5/t:f===i&&c===Math.PI&&(M=-.5/t);for(let E=0;E<=t;E++){let C=E/t;u.x=-e*Math.cos(s+C*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+C*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(C+M,1-v),S.push(h++)}l.push(S)}for(let f=0;f<i;f++)for(let S=0;S<t;S++){let v=l[f][S+1],M=l[f][S],E=l[f+1][S],C=l[f+1][S+1];(f!==0||a>0)&&p.push(v,M,C),(f!==i-1||c<Math.PI)&&p.push(M,E,C)}this.setIndex(p),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(_,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ti=class n extends Xt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],h=[],l=new I,u=new I,d=new I;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(_),l.y=e*Math.sin(_),d.subVectors(u,l).normalize(),c.push(d.x,d.y,d.z),h.push(g/s),h.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(_,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new _t(o,3)),this.setAttribute("normal",new _t(c,3)),this.setAttribute("uv",new _t(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ri=class extends Ai{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zd,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function So(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function mv(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var zs=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Hl=class extends zs{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Uu,endingEnd:Uu}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Nu:r=e,o=2*t-i;break;case Fu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Nu:a=e,c=2*i-t;break;case Fu:a=1,c=i+s[1]-s[0];break;default:a=e-1,c=t}let h=(i-t)*.5,l=this.valueSize;this._weightPrev=h/(t-o),this._weightNext=h/(c-i),this._offsetPrev=r*l,this._offsetNext=a*l}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,S=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,M=p*m-p*_;for(let E=0;E!==o;++E)r[E]=f*a[l+E]+S*a[h+E]+v*a[c+E]+M*a[u+E];return r}},Vl=class extends zs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,l=(i-t)/(s-t),u=1-l;for(let d=0;d!==o;++d)r[d]=a[h+d]*u+a[c+d]*l;return r}},Gl=class extends zs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Un=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=So(t,this.TimeBufferType),this.values=So(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:So(e.times,Array),values:So(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Gl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Hl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ro:t=this.InterpolantFactoryMethodDiscrete;break;case ml:t=this.InterpolantFactoryMethodLinear;break;case Ya:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ro;case this.InterpolantFactoryMethodLinear:return ml;case this.InterpolantFactoryMethodSmooth:return Ya}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&mv(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ya,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=e[o],l=e[o+1];if(h!==l&&(o!==1||h!==e[0]))if(s)c=!0;else{let u=o*i,d=u-i,p=u+i;for(let g=0;g!==i;++g){let _=t[u+g];if(_!==t[d+g]||_!==t[p+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*i,d=a*i;for(let p=0;p!==i;++p)t[d+p]=t[u+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,c=a*i,h=0;h!==i;++h)t[c+h]=t[o+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=ml;var ns=class extends Un{constructor(e,t,i){super(e,t,i)}};ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Ro;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Wl=class extends Un{};Wl.prototype.ValueTypeName="color";var Kl=class extends Un{};Kl.prototype.ValueTypeName="number";var $l=class extends zs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-t)/(s-t),h=e*o;for(let l=h+o;h!==l;h+=4)Ei.slerpFlat(r,0,a,h-o,a,h,c);return r}},Qo=class extends Un{InterpolantFactoryMethodLinear(e){return new $l(this.times,this.values,this.getValueSize(),e)}};Qo.prototype.ValueTypeName="quaternion";Qo.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Un{constructor(e,t,i){super(e,t,i)}};is.prototype.ValueTypeName="string";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=Ro;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var Xl=class extends Un{};Xl.prototype.ValueTypeName="vector";var ql=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){o++,r===!1&&s.onStart!==void 0&&s.onStart(l,a,o),r=!0},this.itemEnd=function(l){a++,s.onProgress!==void 0&&s.onProgress(l,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,d=h.length;u<d;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null}}},gv=new ql,Yl=class{constructor(e){this.manager=e!==void 0?e:gv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Yl.DEFAULT_MATERIAL_NAME="__DEFAULT";var ea=class extends $t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ta=class extends ea{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Cc=new vt,Dd=new I,kd=new I,Zl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Re(512,512),this.map=null,this.mapPass=null,this.matrix=new vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xr,this._frameExtents=new Re(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Dd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Dd),kd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kd),t.updateMatrixWorld(),Cc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Cc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var jl=class extends Zl{constructor(){super(new zo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},na=class extends ea{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.target=new $t,this.shadow=new jl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var hh="\\[\\]\\.:\\/",_v=new RegExp("["+hh+"]","g"),uh="[^"+hh+"]",xv="[^"+hh.replace("\\.","")+"]",vv=/((?:WC+[\/:])*)/.source.replace("WC",uh),yv=/(WCOD+)?/.source.replace("WCOD",xv),Sv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",uh),Mv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",uh),bv=new RegExp("^"+vv+yv+Sv+Mv+"$"),wv=["material","materials","bones","map"],Jl=class{constructor(e,t,i){let s=i||xt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},xt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(_v,"")}static parseTrackName(e){let t=bv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);wv.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=i(o.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[s];if(a===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xt.Composite=Jl;xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xt.prototype.GetterByBindingType=[xt.prototype._getValue_direct,xt.prototype._getValue_array,xt.prototype._getValue_arrayElement,xt.prototype._getValue_toArray];xt.prototype.SetterByBindingTypeAndVersioning=[[xt.prototype._setValue_direct,xt.prototype._setValue_direct_setNeedsUpdate,xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_array,xt.prototype._setValue_array_setNeedsUpdate,xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_arrayElement,xt.prototype._setValue_arrayElement_setNeedsUpdate,xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_fromArray,xt.prototype._setValue_fromArray_setNeedsUpdate,xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var uS=new Float32Array(1);var Ud=new vt,ia=class{constructor(e,t,i=0,s=1/0){this.ray=new mr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new gr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ud.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ud),this}intersectObject(e,t=!0,i=[]){return Ql(e,this,i,t),i.sort(Nd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Ql(e[s],this,i,t);return i.sort(Nd),i}};function Nd(n,e){return n.distance-e.distance}function Ql(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let a=0,o=r.length;a<o;a++)Ql(r[a],e,t,!0)}}var sa=class extends yr{constructor(e=10,t=10,i=4473924,s=8947848){i=new Ze(i),s=new Ze(s);let r=t/2,a=e/t,o=e/2,c=[],h=[];for(let d=0,p=0,g=-o;d<=t;d++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);let _=d===r?i:s;_.toArray(h,p),p+=3,_.toArray(h,p),p+=3,_.toArray(h,p),p+=3,_.toArray(h,p),p+=3}let l=new Xt;l.setAttribute("position",new _t(c,3)),l.setAttribute("color",new _t(h,3));let u=new ts({vertexColors:!0,toneMapped:!1});super(l,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:eh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=eh);var Av={a:5217791,b:16751164},af=[16731469,5111658,5082623],Tv={hand:16769357,foot:4645060,root:16735457,look:16777215,pole:11766015,mover:10215773},cf=new I(0,0,1),Li=new I,Pi=new I,dh=n=>new I(n[0],n[1],n[2]);function lf(n,{inGame:e,onCamera:t}){let i=new Go({antialias:!0,alpha:!0,preserveDrawingBuffer:!e});i.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),i.setClearColor(0,0),n.append(i.domElement);let s=new Wo;e||(s.background=new Ze(2106154));let r=new dn;r.rotation.x=-Math.PI/2,s.add(r),s.add(new ta(15660031,4210760,1.4));let a=new na(16777215,1.1);a.position.set(2,5,3),s.add(a);let o=new Zt(45,1,.05,200),c=-.993,h=new sa(8,32,8029076,4870236);if(h.rotation.x=Math.PI/2,h.position.z=c+.001,h.material.transparent=!0,h.material.opacity=e?.25:.6,r.add(h),!e){let T=new wt(new Os(30,30),new Ri({color:2830135,roughness:1}));T.position.z=c-.002,r.add(T)}let l={target:[0,0,.1],yaw:180,pitch:-6,dist:3.2,fov:45},u={min:.4,max:12};function d(){let T=l.yaw*ze,te=l.pitch*ze,j=[-Math.sin(T)*Math.cos(te),Math.cos(T)*Math.cos(te),Math.sin(te)];return[l.target[0]-j[0]*l.dist,l.target[1]-j[1]*l.dist,l.target[2]-j[2]*l.dist]}function p(){let T=d();o.position.set(T[0],T[2],-T[1]),o.up.set(0,1,0),o.lookAt(l.target[0],l.target[2],-l.target[1]),o.fov=l.fov,o.updateProjectionMatrix(),t?.({p:T,yaw:l.yaw,pitch:l.pitch,fov:l.fov})}function g(T,te=[0,0,.1]){let j={front:[180,-6,3.2],side:[90,-6,3.2],top:[180,-88,4.2],shoulder:[0,-14,1.3],back:[0,-6,3.2]}[T];j&&(l.yaw=j[0],l.pitch=j[1],l.dist=j[2],l.target=T==="shoulder"?[te[0]+.35,te[1]+.9,te[2]+.35]:te.slice(),p())}function _(T,te=1.2){l.target=T.slice(),l.dist=Math.max(u.min,te),p()}function m(){let T=n.getBoundingClientRect();i.setSize(T.width,T.height,!1),o.aspect=T.width/Math.max(1,T.height),o.updateProjectionMatrix()}window.addEventListener("resize",m);let f={},S=new Jo(1,1,1,8,1);S.rotateX(Math.PI/2);let v=new Bs(1,8,6);function M(T,te){f[T]&&(r.remove(f[T].group),r.remove(f[T].onion[0]),r.remove(f[T].onion[1]));let j=Av[T]??13421772,ae=new dn,re=new Ri({color:j,roughness:.5,depthTest:!0}),ue=new Ri({color:16769357,emissive:5587968,roughness:.4}),ne=new Ri({color:j,roughness:.7,transparent:!0,opacity:.22,depthWrite:!1}),L=new Ri({color:16777215,roughness:.4}),b=new kn({visible:!1}),O={id:T,skel:te,group:ae,segs:[],joints:[],picks:[],caps:{},mat:re,selMat:ue,jointMat:L};for(let X of te.bones){if(X.parent<0||!X.name.startsWith("SKEL_"))continue;let J=te.bones[X.parent].name,Y=X.name.includes("Finger");if(J.startsWith("SKEL_")&&J!=="SKEL_ROOT"){let Je=new wt(S,re);Je.userData={a:X.parent,b:X.index,r:Y?.004:.012},ae.add(Je),O.segs.push(Je)}let Ee=new wt(v,L),le=Y?.006:.018;Ee.scale.setScalar(le),Ee.userData={i:X.index,name:X.name,r:le},ae.add(Ee),O.joints.push(Ee);let fe=new wt(v,b);fe.scale.setScalar(Y?.012:.04),fe.userData={pick:"bone",actor:T,bone:X.name,i:X.index},ae.add(fe),O.picks.push(fe)}for(let X of["torso","chest","neck","head","upperL","upperR","foreL","foreR","thighL","thighR","shinL","shinR"]){let J=new wt(new jo(1,1,4,12),ne);J.userData.k=X,ae.add(J),O.caps[X]=J}return r.add(ae),O.onion=[9417727,16762255].map(X=>{let J=new Xt;J.setAttribute("position",new nn(new Float32Array(te.bones.length*6),3));let Y=new yr(J,new ts({color:X,transparent:!0,opacity:.55}));return Y.visible=!1,r.add(Y),Y}),f[T]=O,O}function E(T,te,j,ae){Li.set(te[0],te[1],te[2]),Pi.set(j[0],j[1],j[2]);let re=Li.distanceTo(Pi);T.position.copy(Li).add(Pi).multiplyScalar(.5),T.scale.set(ae,ae,Math.max(re,1e-4)),T.quaternion.setFromUnitVectors(cf,Pi.sub(Li).normalize())}let C=new I(0,1,0);function R(T,te){Li.set(te.a[0],te.a[1],te.a[2]),Pi.set(te.b[0],te.b[1],te.b[2]);let j=Math.max(.001,Li.distanceTo(Pi));T.position.copy(Li).add(Pi).multiplyScalar(.5),T.scale.set(te.r,(j+2*te.r)/3,te.r),T.quaternion.setFromUnitVectors(C,Pi.sub(Li).normalize())}function P(T,te,j){let ae=f[T];if(!ae)return;let re=te.world.P;for(let ne of ae.segs)E(ne,re[ne.userData.a],re[ne.userData.b],ne.userData.r);for(let ne of ae.joints)ne.position.set(...re[ne.userData.i]),ne.material=ne.userData.name===j?ae.selMat:ae.jointMat,ne.scale.setScalar(ne.userData.name===j?ne.userData.r*1.6:ne.userData.r);for(let ne of ae.picks)ne.position.set(...re[ne.userData.i]);let ue=Gr(ae.skel,te);for(let[ne,L]of Object.entries(ae.caps)){let b=ue[ne];L.visible=!!b&&y,b&&R(L,b)}}function N(T,te,j){let ae=f[T];if(!ae)return;let re=ae.onion[te];if(!j){re.visible=!1;return}let ue=re.geometry.attributes.position.array,ne=0;for(let L of ae.skel.bones){if(L.parent<0||ae.skel.bones[L.parent].name==="SKEL_ROOT"){ue.fill(0,ne,ne+6),ne+=6;continue}let b=j.world.P[L.parent],O=j.world.P[L.index];ue[ne++]=b[0],ue[ne++]=b[1],ue[ne++]=b[2],ue[ne++]=O[0],ue[ne++]=O[1],ue[ne++]=O[2]}re.geometry.attributes.position.needsUpdate=!0,re.visible=!0}let y=!0,w=new dn;w.visible=!1,r.add(w);let F=[0,1,2].map(T=>{let te=new dn,j=new wt(new Ti(1,.018,8,64),new kn({color:af[T],depthTest:!1,transparent:!0,opacity:.9})),ae=new wt(new Ti(1,.09,6,48),new kn({visible:!1}));ae.userData={pick:"ring",k:T};let re=new wt(new Ti(1,.045,6,48,Math.PI),new kn({color:af[T],depthTest:!1,transparent:!0,opacity:.35})),ue=new wt(new Bs(.06,10,8),new kn({color:16777215,depthTest:!1}));return ue.position.set(1,0,0),j.renderOrder=re.renderOrder=ue.renderOrder=10,te.add(j,ae,re,ue),w.add(te),{g:te,ring:j,pick:ae,arc:re,marker:ue,k:T}});function B(T,te,j,ae,re){w.visible=!0,w.position.set(T[0],T[1],T[2]),w.scale.setScalar(re);for(let ue of F){let ne=dh(te[ue.k]).normalize();if(ue.g.quaternion.setFromUnitVectors(cf,ne),ae){let[L,b]=ae[ue.k],O=Math.max(1,b-L)*ze;ue.arc.geometry.dispose(),ue.arc.geometry=new Ti(1,.045,6,48,Math.min(O,Math.PI*2)),ue.arc.rotation.z=(L-j[ue.k])*ze,ue.arc.visible=!0}else ue.arc.visible=!1}}function W(){w.visible=!1}let ee=new dn;r.add(ee);let V=new Map;function ie(T,te){let j=V.get(T);if(!j){let ae=te==="mover"?new Ti(.28,.012,6,40):new Bs(te==="pole"?.022:.035,14,10);j=new wt(ae,new kn({color:Tv[te],depthTest:!1,transparent:!0,opacity:.85})),j.renderOrder=11;let[re,ue]=T.split(".");j.userData={pick:"handle",actor:re,name:ue,kind:te},ee.add(j),V.set(T,j)}return j}function q(T){let te=new Set;for(let j of T){let ae=`${j.actor}.${j.name}`;te.add(ae);let re=ie(ae,j.kind);re.position.set(j.p[0],j.p[1],j.p[2]),re.material.opacity=j.active?1:.55,re.scale.setScalar(j.selected?1.5:1),re.visible=!0}for(let[j,ae]of V)te.has(j)||(ae.visible=!1)}let de=new dn;r.add(de);function xe(T){for(;de.children.length;)de.children.pop().geometry.dispose();for(let te of T){let j=new Xt().setFromPoints([dh(te.a),dh(te.b)]),ae=new vr(j,new ts({color:te.color??16777215,depthTest:!1}));ae.renderOrder=12,de.add(ae)}}let ye=new ia,et=new Re;function it(T,te){let j=i.domElement.getBoundingClientRect();return et.set((T-j.left)/j.width*2-1,-((te-j.top)/j.height)*2+1),ye.setFromCamera(et,o),ye}function Z(T,te){if(it(T,te),w.visible){let ue=ye.intersectObjects(F.map(ne=>ne.pick),!1)[0];if(ue)return ue.object.userData}let j=ye.intersectObjects([...V.values()].filter(ue=>ue.visible),!1)[0];if(j)return j.object.userData;let ae=Object.values(f).flatMap(ue=>ue.group.visible?ue.picks:[]),re=ye.intersectObjects(ae,!1);return re.length?(re.sort((ue,ne)=>ue.distance-ne.distance),re[0].object.userData):null}let se=T=>[T.x,-T.z,T.y];function we(T,te,j,ae){it(T,te);let re=new I(ae[0],ae[2],-ae[1]).normalize(),ue=new I(j[0],j[2],-j[1]),ne=new Pn().setFromNormalAndCoplanarPoint(re,ue),L=new I;return ye.ray.intersectPlane(ne,L)?se(L):null}function ve(){let T=l.yaw*ze,te=l.pitch*ze;return[-Math.sin(T)*Math.cos(te),Math.cos(T)*Math.cos(te),Math.sin(te)]}function We(T){let te=new I(T[0],T[2],-T[1]).project(o),j=i.domElement.getBoundingClientRect();return{x:(te.x*.5+.5)*j.width,y:(-te.y*.5+.5)*j.height,behind:te.z>1}}function ke(T){let te=d();return Math.hypot(T[0]-te[0],T[1]-te[1],T[2]-te[2])}let Ke=null,st=i.domElement;st.addEventListener("contextmenu",T=>T.preventDefault()),st.addEventListener("wheel",T=>{T.preventDefault(),l.dist=Math.min(u.max,Math.max(u.min,l.dist*Math.pow(1.0015,T.deltaY))),p()},{passive:!1});let Qe={renderer:i,camera:o,cam:l,limits:u,actors:f,setPreset:g,focusOn:_,applyCamera:p,resize:m,buildActor:M,updateActor:P,updateOnion:N,showGizmo:B,hideGizmo:W,setHandles:q,setLines:xe,pick:Z,planePoint:we,viewDir:ve,project:We,camDistanceTo:ke,rings:F,setBodyVisible(T){y=T},setVisible(T,te){f[T]&&(f[T].group.visible=te)},removeActor(T){let te=f[T];te&&(r.remove(te.group),te.onion.forEach(j=>r.remove(j)),delete f[T])},beginOrbit(T,te,j){Ke={x:T,y:te,mode:j}},moveOrbit(T,te){if(!Ke)return;let j=T-Ke.x,ae=te-Ke.y;if(Ke.x=T,Ke.y=te,Ke.mode==="orbit")l.yaw=(l.yaw-j*.3+360)%360,l.pitch=Math.max(-89,Math.min(89,l.pitch+ae*.25));else{let re=l.yaw*ze,ue=[Math.cos(re),Math.sin(re),0],ne=l.dist*.0016;l.target=[l.target[0]-ue[0]*j*ne,l.target[1]-ue[1]*j*ne,l.target[2]+ae*ne]}p()},endOrbit(){Ke=null},render(){i.render(s,o)},boneAxes(T,te,j){let ae=T.idx(j),re=T.bones[ae].parent,ue=Te(Ce(te.mover.q,re>=0?te.D[re]:[0,0,0,1])),ne=Ni(T,j);return{axes:ne.axes.map(L=>De(ue,L)),basis:ne}}};return m(),p(),Qe}var ca={app_title:"Animations-Studio",saved_at:"Gespeichert {0}",unsaved:"Ungespeicherte \xC4nderungen",saving:"Speichere \u2026",no_project:"Kein Projekt",projects:"Projekte",new_project:"Neu",open:"\xD6ffnen",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",single:"Einzel-Animation",pair:"Paar-Animation",partner_model:"Partner-Modell",name:"Name",duration_s:"Dauer (s)",create:"Anlegen",cancel:"Abbrechen",ok:"OK",close:"Schlie\xDFen",yes:"Ja",no:"Nein",confirm_close:"Studio schlie\xDFen? Ungespeicherte \xC4nderungen werden vorher gespeichert.",confirm_delete:"Projekt \u201E{0}\u201C wirklich l\xF6schen? Eine Sicherung bleibt auf dem Server.",name_hint:"Nur Kleinbuchstaben, Ziffern und _ (z. B. winken_01).",undo:"R\xFCckg\xE4ngig",redo:"Wiederholen",save:"Speichern",test:"Im Spiel testen",finish:"Fertigstellen",help:"Hilfe",tip_undo:"Letzten Schritt zur\xFCcknehmen (Strg+Z).",tip_redo:"Zur\xFCckgenommenen Schritt wiederholen (Strg+Y).",tip_save:"Projekt jetzt auf dem Server speichern (Strg+S). Automatisch alle 30 s.",tip_test:"Wandelt die Animation in eine echte .ycd um und spielt sie am echten Ped ab.",tip_finish:"Endg\xFCltige .ycd, Registry-Eintrag und Bericht f\xFCr Claude erzeugen.",tip_help:"Einstiegs-Tutorial nochmal zeigen.",view:"Ansicht",cam_front:"Vorn",cam_side:"Seite",cam_top:"Oben",cam_shoulder:"Schulter",cam_focus:"Auswahl",tip_cam_front:"Kamera von vorn auf die Figur (Taste 1).",tip_cam_side:"Kamera von der Seite (Taste 2).",tip_cam_top:"Kamera von oben (Taste 3).",tip_cam_shoulder:"Kamera \xFCber die Schulter (Taste 4).",tip_cam_focus:"Kamera auf das ausgew\xE4hlte K\xF6rperteil (F).",bones:"Knochen",actor:"Akteur",selected:"Ausgew\xE4hlt",none_selected:"Klicke ein Gelenk an oder w\xE4hle links einen Knochen.",limits:"Gelenkgrenzen",tip_limits:"Begrenzt Drehungen auf nat\xFCrliche Winkel (Taste L).",ik_controlled:"Dieser Arm/dieses Bein folgt dem IK-Griff. Ziehe den Griff oder entferne die IK.",remove_ik:"IK entfernen",tip_remove_ik:"Der Arm/das Bein wird wieder \xFCber die Drehringe gesteuert.",reset_bone:"Zur\xFCcksetzen",tip_reset_bone:"Setzt die Drehung dieses Knochens zur aktuellen Zeit auf 0.",fingers:"Finger",hand_l:"Hand links",hand_r:"Hand rechts",curl:"Beugung",spread:"Spreizung",single_joints:"Einzelne Glieder",tip_single_joints:"Zeigt jedes Fingerglied im Knochenbaum, dort einzeln drehen.",preset_relaxed:"Entspannt",preset_fist:"Faust",preset_open:"Offen",preset_grab:"Greifen",preset_point:"Zeigen",preset_claw:"Klaue",helpers:"Hilfen",mirror_all:"Ganze Pose spiegeln",mirror_sel:"Auswahl spiegeln",copy_pose:"Pose kopieren",paste_pose:"Pose einf\xFCgen",snap_ground:"Auf den Boden",lock_feet:"F\xFC\xDFe festkleben",stick_hand:"Hand festkleben an \u2026",unstick:"Kontakt l\xF6sen",tip_mirror_all:"Spiegelt die ganze Pose links \u2194 rechts zur aktuellen Zeit (M).",tip_mirror_sel:"\xDCbertr\xE4gt die Drehung des gew\xE4hlten Knochens auf die andere Seite.",tip_copy_pose:"Merkt sich die Pose zur aktuellen Zeit (Strg+C).",tip_paste_pose:"Setzt die gemerkte Pose zur aktuellen Zeit (Strg+V).",tip_snap_ground:"Setzt den gew\xE4hlten Fu\xDF (oder beide) genau auf den Boden.",tip_lock_feet:"F\xFC\xDFe bleiben im markierten Zeitbereich an ihrer Stelle (Bereich mit Alt+Ziehen in der Zeitleiste w\xE4hlen).",tip_stick_hand:"Die gew\xE4hlte Hand bleibt am K\xF6rperteil des Partners, auch wenn du weiter bearbeitest.",pose_library:"Posen-Bibliothek",builtin:"Grundposen",my_poses:"Eigene Posen",save_pose:"Pose speichern",apply:"Anwenden",tip_save_pose:"Speichert die Pose zur aktuellen Zeit unter einem Namen.",pose_stand:"Stand",pose_crouch:"Hocke",pose_fight:"Kampfstellung",pose_reach:"Greifen",checks:"Pr\xFCfung",check_running:"Pr\xFCfe \u2026",fix:"Beheben",jump:"Hinspringen",all_ok:"Alles gr\xFCn.",timeline:"Zeitleiste",play:"Abspielen",pause:"Pause",loop:"Loop",speed:"Tempo",onion:"Onion-Skin",events:"Events",tip_play:"Abspielen / anhalten (Leertaste).",tip_loop:"Loop: Ende = Anfang, die Naht wird automatisch geschlossen.",tip_onion:"Zeigt die vorige und n\xE4chste Pose als Schatten (O).",tip_speed:"Abspieltempo im Editor (0,1\u20132\xD7).",add_event:"Event",tip_add_event:"Setzt einen Event-Marker zur aktuellen Zeit (z. B. impact).",event_name:"Event-Name",event_duration:"Dauer (s)",ease_smooth:"Weich",ease_fastIn:"Schnell rein",ease_fastOut:"Schnell raus",ease_linear:"Gleichm\xE4\xDFig",ease_spring:"Federnd",tip_ease_smooth:"Langsam los, langsam an.",tip_ease_fastIn:"Startet schnell und bremst zum Keyframe ab.",tip_ease_fastOut:"Startet langsam und kommt schnell am Keyframe an.",tip_ease_linear:"Gleichm\xE4\xDFiges Tempo.",tip_ease_spring:"Schwingt etwas \xFCber und federt zur\xFCck.",key_delete:"Keyframe l\xF6schen",key_copy:"Keyframes kopieren",key_paste:"Keyframes einf\xFCgen",duration:"Dauer",range:"Bereich",no_range:"Kein Bereich gew\xE4hlt (Alt + Ziehen in der Zeitleiste).",test_title:"Im Spiel testen",test_notice:"Beim Testen wird die Stream-Resource neu gestartet. Alle Spieler laden die neue Animation kurz nach. Fortfahren?",test_converting:"Wandle um \u2026",test_restarting:"Verteile an die Spieler \u2026",test_loading:"Lade Animation \u2026",test_playing:"L\xE4uft ({0} s bis zur Wiedergabe)",test_failed:"Test fehlgeschlagen",stop:"Stopp",phase:"Phase",contacts:"Kontakte",overlay:"Overlay zeigen",calibrate:"Abgleich messen",tip_calibrate:"Vergleicht das Overlay-Skelett mit den echten Knochen des Peds (Ziel \u2264 1 cm).",calib_result:"Abweichung Overlay \u2194 echter Ped: max {0} cm, Mittel {1} cm ({2} Knochen)",calib_need_test:"Erst \u201EIm Spiel testen\u201C, dann messen (der Ped muss die Animation spielen).",finish_title:"Fertigstellen",target_resource:"Ziel-Resource",dict_name:"Dict-Name",convert:"Umwandeln",report:"Bericht f\xFCr Claude",copy:"Kopieren",copied:"Kopiert.",copy_failed:"Kopieren ging nicht, bitte Text markieren und Strg+C dr\xFCcken.",report_files:"Dateien auf dem Server: {0}",notes:"Notizen",notes_hint:"Notizen f\xFCr Claude (z. B. \u201EZombie soll am Ende knurren\u201C).",tutorial_skip:"\xDCberspringen",tutorial_next:"Weiter",tutorial_done:"Los geht\u2019s",tut1:"Kamera: linke Maustaste ziehen = drehen, Mausrad = zoomen, rechte Maustaste ziehen = verschieben. Feste Ansichten oben rechts.",tut2:"Klicke ein Gelenk an. Es erscheinen drei farbige Drehringe. Ring ziehen = K\xF6rperteil drehen. Grenzen verhindern unnat\xFCrliche Winkel.",tut3:"Die Kugeln an H\xE4nden, F\xFC\xDFen, Becken und vor dem Kopf sind Griffe. Ziehen bewegt die ganze Kette nat\xFCrlich (IK).",tut4:"Jede \xC4nderung setzt einen Keyframe zur aktuellen Zeit (Raute in der Zeitleiste). Zeit verschieben, n\xE4chste Pose einstellen, abspielen.",tut5:"Rechts pr\xFCft die Ampel live (Fu\xDFrutschen, Boden, Gelenke \u2026). \u201EIm Spiel testen\u201C zeigt die echte Animation am Ped.",warn_no_skeleton:"Kein Skelett vom Konverter: Platzhalter-Skelett, das Overlay ist ungenau. Starte animkit watch.",watch_down:"Der Konverter (animkit watch) l\xE4uft nicht. Testen und Fertigstellen gehen erst, wenn er l\xE4uft.",stream_restarted:"Stream-Resource neu gestartet.",err:"Fehler",loading:"Lade \u2026",new_name_prompt:"Neuer Name",pose_name_prompt:"Name der Pose",stick_target:"K\xF6rperteil des Partners",part_head:"Kopf",part_neck:"Hals",part_chest:"Brust",part_pelvis:"H\xFCfte",part_shoulderL:"Schulter links",part_shoulderR:"Schulter rechts",part_armL:"Oberarm links",part_armR:"Oberarm rechts",part_handL:"Hand links",part_handR:"Hand rechts",select_hand_first:"W\xE4hle zuerst eine Hand (oder einen Fu\xDF) aus.",pair_only:"Nur bei Paar-Animationen.",frame:"Bild {0}/{1}",seconds:"{0} s",light_ok:"Gr\xFCn",light_warn:"Gelb",light_error:"Rot",mover:"Standpunkt",root:"Becken",look:"Blick",group_pos:"Position",group_head:"Kopf",group_torso:"Rumpf",group_armL:"Arm L",group_armR:"Arm R",group_handL:"Hand L",group_handR:"Hand R",group_legL:"Bein L",group_legR:"Bein R",feet_locks:"F\xFC\xDFe fest",contacts_row:"Kontakte",partner_spawn_failed:"Partner-Ped konnte nicht erstellt werden: {0}",loop_on:"Loop an",loop_off:"Loop aus",rotation_deg:"Drehung (\xB0)",project_invalid:"Projekt besch\xE4digt",dict_invalid:"Ung\xFCltiger Dict-Name: nur a-z, 0-9 und _, nicht mit jjs_ beginnen.",target_invalid:"Ung\xFCltiger Resource-Name.",pose_invalid:"Ung\xFCltige Pose.",ik_weight:"IK-Gewicht",look_weight:"Blick-Gewicht",foot_l:"Fu\xDF links",foot_r:"Fu\xDF rechts",elbow_dir:"Ellbogen-Richtung",knee_dir:"Knie-Richtung",all_rows:"Alle Zeilen"},Rv={app_title:"Animation Studio",saved_at:"Saved {0}",unsaved:"Unsaved changes",saving:"Saving \u2026",no_project:"No project",projects:"Projects",new_project:"New",open:"Open",rename:"Rename",duplicate:"Duplicate",delete:"Delete",single:"Single animation",pair:"Pair animation",partner_model:"Partner model",name:"Name",duration_s:"Duration (s)",create:"Create",cancel:"Cancel",ok:"OK",close:"Close",yes:"Yes",no:"No",confirm_close:"Close the studio? Unsaved changes are saved first.",confirm_delete:"Really delete project \u201C{0}\u201D? A backup stays on the server.",name_hint:"Only lowercase letters, digits and _ (e.g. wave_01).",undo:"Undo",redo:"Redo",save:"Save",test:"Test in game",finish:"Finish",help:"Help",test_notice:"Testing restarts the stream resource. All players download the new animation shortly. Continue?"},hf=ca;function uf(n){hf=n==="en"?{...ca,...Rv}:ca}function G(n,...e){let t=hf[n]??ca[n]??n;return e.length?t.replace(/\{(\d+)\}/g,(i,s)=>String(e[+s]??"")):t}var ss=20,Vs=24,la=118,sn={bg:"#14171c",row:"#1b1f26",rowAlt:"#181b21",text:"#c9d1dc",dim:"#7c8796",key:"#ffd34d",keySel:"#ffffff",head:"#4f9dff",headB:"#ff9a3c",range:"rgba(79,157,255,0.16)",lock:"#46e0c4",contact:"#b388ff",event:"#ff6b6b",play:"#ff4d4d"};function df(n,{onEdit:e}){let t=n.getContext("2d"),i=[],s=null,r=!1,a=()=>Math.min(2,window.devicePixelRatio||1),o=()=>n.clientWidth,c=_=>la+_/Math.max(1e-6,x.doc.duration)*(o()-la-12),h=_=>Math.max(0,Math.min(x.doc.duration,(_-la)/Math.max(1,o()-la-12)*x.doc.duration));function l(){if(i=[],!x.doc)return;let _=Object.keys(x.doc.actors);for(let m of _){_.length>1&&i.push({kind:"header",actor:m,label:x.doc.actors[m].label||m});let f=x.selGroup&&x.actor===m?x.selGroup:null;for(let v of pu){let M=nr(x.doc,m,v);(r||M.length||v==="pos"||v===f)&&i.push({kind:"group",actor:m,group:v,label:G(mu[v]),times:M})}let S=x.doc.tracks[m]?.feet?.lock||{};Object.values(S).some(v=>v.length)&&i.push({kind:"locks",actor:m,label:G("feet_locks"),locks:S})}(x.doc.contacts||[]).length&&i.push({kind:"contacts",label:G("contacts_row")}),i.push({kind:"events",label:G("events")})}function u(){return Vs+i.length*ss+4}function d(){if(!x.doc)return;l();let _=o(),m=u();n.style.height=`${m}px`;let f=a();(n.width!==Math.round(_*f)||n.height!==Math.round(m*f))&&(n.width=Math.round(_*f),n.height=Math.round(m*f)),t.setTransform(f,0,0,f,0,0),t.fillStyle=sn.bg,t.fillRect(0,0,_,m),t.font="12px system-ui, sans-serif";let S=x.doc.duration,v=S<=2?.1:S<=6?.25:S<=15?.5:1;t.fillStyle=sn.dim,t.strokeStyle="#2a2f38";for(let E=0;E<=S+1e-6;E+=v){let C=c(E),R=Math.abs(E/(v*4)-Math.round(E/(v*4)))<1e-6;t.beginPath(),t.moveTo(C,R?4:12),t.lineTo(C,Vs),t.stroke(),R&&t.fillText(`${(+E.toFixed(2)).toString()}s`,C+2,12)}x.range&&(t.fillStyle=sn.range,t.fillRect(c(x.range[0]),0,c(x.range[1])-c(x.range[0]),m)),i.forEach((E,C)=>{let R=Vs+C*ss;if(t.fillStyle=E.kind==="header"?"#222833":C%2?sn.row:sn.rowAlt,t.fillRect(0,R,_,ss),t.fillStyle=E.kind==="header"?E.actor==="b"?sn.headB:sn.head:sn.text,t.fillText(E.label,8,R+14),E.kind==="group")for(let P of E.times){let N=x.selKeys.some(w=>w.actor===E.actor&&w.group===E.group&&Math.abs(w.t-P)<.001),y=s?.kind==="key"&&s.moved&&N?c(Ut(P+s.dt)):c(P);p(y,R+ss/2,N?sn.keySel:sn.key)}else if(E.kind==="locks")for(let[P,N]of Object.entries(E.locks))N.forEach(y=>{t.fillStyle=sn.lock,t.globalAlpha=.75;let w=R+(P==="L"?3:11);t.fillRect(c(y[0]),w,Math.max(2,c(y[1])-c(y[0])),6),t.globalAlpha=1});else E.kind==="contacts"?(x.doc.contacts||[]).forEach((P,N)=>{t.fillStyle=x.selContact===N?"#fff":sn.contact,t.globalAlpha=.8,t.fillRect(c(P.t[0]),R+5,Math.max(2,c(P.t[1])-c(P.t[0])),10),t.globalAlpha=1}):E.kind==="events"&&(x.doc.events||[]).forEach((P,N)=>{let y=c(P.t);t.fillStyle=x.selEvent===N?"#fff":sn.event,t.beginPath(),t.moveTo(y,R+3),t.lineTo(y+6,R+9),t.lineTo(y,R+15),t.closePath(),t.fill(),P.duration&&t.fillRect(y,R+15,c(P.t+P.duration)-y,2),t.fillText(P.name,y+8,R+14)})});let M=c(x.t);if(t.strokeStyle=sn.play,t.lineWidth=2,t.beginPath(),t.moveTo(M,0),t.lineTo(M,m),t.stroke(),t.lineWidth=1,x.test?.phase!=null){let E=c(x.test.phase*x.doc.duration);t.strokeStyle="#46e0c4",t.setLineDash([4,3]),t.beginPath(),t.moveTo(E,0),t.lineTo(E,m),t.stroke(),t.setLineDash([])}}function p(_,m,f){t.fillStyle=f,t.beginPath(),t.moveTo(_,m-6),t.lineTo(_+6,m),t.lineTo(_,m+6),t.lineTo(_-6,m),t.closePath(),t.fill(),t.strokeStyle="#000",t.stroke()}function g(_,m){if(m<Vs)return{kind:"ruler"};let f=Math.floor((m-Vs)/ss),S=i[f];if(!S)return null;if(S.kind==="group"){for(let v of S.times)if(Math.abs(c(v)-_)<=7)return{kind:"key",row:S,t:v};return{kind:"row",row:S}}if(S.kind==="events"){let v=(x.doc.events||[]).findIndex(M=>Math.abs(c(M.t)-_)<=7);return v>=0?{kind:"event",index:v}:{kind:"row",row:S}}if(S.kind==="contacts"){let v=(x.doc.contacts||[]).findIndex(M=>_>=c(M.t[0])-3&&_<=c(M.t[1])+3);return v>=0?{kind:"contact",index:v}:{kind:"row",row:S}}if(S.kind==="locks"){let v=m-(Vs+f*ss)<ss/2?"L":"R",M=(S.locks[v]||[]).findIndex(E=>_>=c(E[0])-3&&_<=c(E[1])+3);return M>=0?{kind:"lock",actor:S.actor,side:v,index:M}:{kind:"row",row:S}}return{kind:"row",row:S}}return n.addEventListener("mousedown",_=>{if(!x.doc)return;let m=n.getBoundingClientRect(),f=_.clientX-m.left,S=_.clientY-m.top,v=g(f,S);if(v){if(v.kind==="ruler"||v.kind==="row"&&!_.shiftKey){_.altKey?(s={kind:"range",t0:Ut(h(f))},x.range=[s.t0,s.t0],pn("range")):(s={kind:"scrub"},mn(Ut(h(f)))),v.kind==="row"&&v.row.kind==="group"&&Ht({selKeys:[],selEvent:null,selContact:null,selLock:null});return}if(v.kind==="key"){let M={actor:v.row.actor,group:v.row.group,t:v.t},E=x.selKeys.some(R=>R.actor===M.actor&&R.group===M.group&&Math.abs(R.t-M.t)<.001),C=_.shiftKey?E?x.selKeys.filter(R=>!(R.actor===M.actor&&R.group===M.group&&Math.abs(R.t-M.t)<.001)):[...x.selKeys,M]:E?x.selKeys:[M];Ht({selKeys:C,selEvent:null,selContact:null,selLock:null,actor:M.actor,selGroup:M.group}),s={kind:"key",x0:f,dt:0,moved:!1},_.shiftKey||mn(v.t);return}if(v.kind==="event"){Ht({selEvent:v.index,selKeys:[],selContact:null,selLock:null}),s={kind:"event",index:v.index,x0:f,t0:x.doc.events[v.index].t},mn(x.doc.events[v.index].t);return}if(v.kind==="contact"){Ht({selContact:v.index,selKeys:[],selEvent:null,selLock:null});return}v.kind==="lock"&&Ht({selLock:{actor:v.actor,side:v.side,index:v.index},selKeys:[],selEvent:null,selContact:null})}}),window.addEventListener("mousemove",_=>{if(!s||!x.doc)return;let m=n.getBoundingClientRect(),f=_.clientX-m.left;if(s.kind==="scrub")mn(Ut(h(f)));else if(s.kind==="range"){let S=Ut(h(f));x.range=[Math.min(s.t0,S),Math.max(s.t0,S)],pn("range"),d()}else if(s.kind==="key"){let S=h(f)-h(s.x0);Math.abs(f-s.x0)>3&&(s.moved=!0),s.dt=S,d()}else if(s.kind==="event"){let S=Ut(Math.max(0,Math.min(x.doc.duration,s.t0+h(f)-h(s.x0))));s.started||(Hn(),s.started=!0),je(v=>{v.events[s.index].t=S},{commit:!1}),mn(S)}}),window.addEventListener("mouseup",()=>{if(!s)return;let _=s;if(s=null,_.kind==="key"&&_.moved&&x.selKeys.length){let m=x.selKeys.map(f=>({...f,to:Ut(Math.max(0,Math.min(x.doc.duration,f.t+_.dt)))}));je(f=>{let S=_.dt>0?m.slice().sort((v,M)=>M.t-v.t):m.slice().sort((v,M)=>v.t-M.t);for(let v of S)_u(f,v.actor,v.group,v.t,v.to)}),Ht({selKeys:m.map(f=>({actor:f.actor,group:f.group,t:f.to}))}),e?.()}_.kind==="event"&&_.started&&(jn(),e?.()),_.kind==="range"&&x.range&&x.range[1]-x.range[0]<1/30&&(x.range=null,pn("range")),d()}),{draw:d,setShowAll(_){r=_,d()},get showAll(){return r},tToX:c,xToT:h}}var ha={pose_stand:{root:{p:[0,0,0],rot:[0,0,0]},bones:{SKEL_L_UpperArm:[4,36,0],SKEL_R_UpperArm:[4,36,0],SKEL_L_Forearm:[12,0,0],SKEL_R_Forearm:[12,0,0]},ik:{},fingers:{L:{preset:"relaxed"},R:{preset:"relaxed"}}},pose_crouch:{root:{p:[0,-.1,-.42],rot:[0,0,0]},bones:{SKEL_Spine0:[-14,0,0],SKEL_Spine2:[-10,0,0],SKEL_Head:[16,0,0],SKEL_L_UpperArm:[28,0,0],SKEL_R_UpperArm:[28,0,0],SKEL_L_Forearm:[35,0,0],SKEL_R_Forearm:[35,0,0]},ik:{footL:{target:[-.13,.06,-.908],space:"body",pole:[-.2,1,.2]},footR:{target:[.13,.06,-.908],space:"body",pole:[.2,1,.2]}},fingers:{L:{preset:"relaxed"},R:{preset:"relaxed"}}},pose_fight:{root:{p:[0,0,-.08],rot:[0,0,-18]},bones:{SKEL_Spine2:[-6,0,10],SKEL_Head:[6,0,14]},ik:{footL:{target:[-.14,.2,-.908],space:"body",yaw:10},footR:{target:[.17,-.16,-.908],space:"body",yaw:-25},handL:{target:[-.1,.33,.42],space:"body",pole:[-.7,-.3,-.7]},handR:{target:[.1,.24,.38],space:"body",pole:[.7,-.3,-.7]}},fingers:{L:{preset:"fist"},R:{preset:"fist"}}},pose_reach:{root:{p:[0,.03,-.03],rot:[0,0,0]},bones:{SKEL_Spine1:[-8,0,0],SKEL_Spine2:[-6,0,0],SKEL_Head:[-4,0,0]},ik:{handL:{target:[-.17,.55,.22],space:"body",pole:[-.8,-.2,-.6]},handR:{target:[.17,.55,.22],space:"body",pole:[.8,-.2,-.6]}},fingers:{L:{preset:"grab"},R:{preset:"grab"}}}};var ua=new Map,wr=typeof window.GetParentResourceName=="function",Cv=wr?window.GetParentResourceName():"jj_animstudio";function yn(n,e){ua.has(n)||ua.set(n,[]),ua.get(n).push(e)}function da(n){for(let e of ua.get(n?.type)||[])try{e(n)}catch(t){console.error("handler",n.type,t)}}window.addEventListener("message",n=>{n.data&&typeof n.data=="object"&&da(n.data)});async function qt(n,e={}){if(!wr)return Lv(n,e);try{return await(await fetch(`https://${Cv}/${n}`,{method:"POST",headers:{"Content-Type":"application/json; charset=UTF-8"},body:JSON.stringify(e)})).json()}catch(t){return{ok:!1,error:String(t)}}}var Gt={projects:{},poses:{},calls:[],preview:0};window.JJS_MOCK_STATE=Gt;var Nn=(n,e=30)=>setTimeout(()=>da(n),e);function fh(){return Object.entries(Gt.projects).map(([n,e])=>({name:n,title:e.title,type:e.type,updated:e.updated,size:e.text.length})).sort((n,e)=>e.updated-n.updated)}function Lv(n,e){if(Gt.calls.push({name:n,data:e}),n==="server"){let[t,i,s,r]=e.args||[],a=(o,c,h={})=>Nn({type:"reply",data:{op:o,ok:c,...h}});switch(e.op){case"list":Nn({type:"projects",list:fh()});break;case"load":Gt.projects[t]?Nn({type:"project",name:t,text:Gt.projects[t].text}):a("load",!1,{msg:"missing"});break;case"save":{let o=JSON.parse(i);Gt.projects[t]={text:i,title:o.title||t,type:o.type,updated:Date.now()/1e3},a("save",!0,{name:t,msg:"Gespeichert."});break}case"rename":case"duplicate":{let o=Gt.projects[t];if(!o||Gt.projects[i]){a(e.op,!1,{msg:"exists/missing"});break}Gt.projects[i]={...o,text:o.text.replace(`"name":"${t}"`,`"name":"${i}"`)},e.op==="rename"&&delete Gt.projects[t],a(e.op,!0,{name:i,from:t}),Nn({type:"projects",list:fh()});break}case"delete":delete Gt.projects[t],a("delete",!0,{name:t}),Nn({type:"projects",list:fh()});break;case"preview":case"finalize":{let o=JSON.parse(i);Gt.projects[t]={text:i,title:o.title||t,type:o.type,updated:Date.now()/1e3};let c=++Gt.preview,h=e.op==="preview"?`jjs_${t}_v${c}`:s;a(e.op,!0,{job:`${t}_v${c}`,dict:h,name:t});let l=Object.keys(o.actors),u=Object.fromEntries(l.map(d=>[d,o.type==="pair"?`${o.name}_${d}`:o.name]));Nn({type:"job",kind:"result",result:{ok:!0,job:`${t}_v${c}`,kind:e.op==="preview"?"preview":"final",dict:h,clips:u,duration:o.duration,loop:!!o.loop,type:o.type,origins:o.type==="pair"?Object.fromEntries(l.map(d=>[d,{x:o.tracks[d]?.mover?.[0]?.p?.[0]||0,y:o.tracks[d]?.mover?.[0]?.p?.[1]||0,z:0,yaw:o.tracks[d]?.mover?.[0]?.yaw||0}])):{},restarted:!0,waitMs:400,findings:[],report:e.op==="finalize"?{md:`data/outbox/${t}.report.md`,json:`data/outbox/${t}.report.json`,ycd:`data/outbox/final/${h}.ycd`,text:`# Animation \u201E${o.title||t}\u201C (${t})

(Bericht aus dem Browser-Test, kein echter Build)
`}:void 0}},200);break}case"poseSave":Gt.poses[t]=i,a("poseSave",!0,{name:t}),Nn({type:"poses",poses:{...Gt.poses}});break;case"poseDelete":delete Gt.poses[t],a("poseDelete",!0,{name:t}),Nn({type:"poses",poses:{...Gt.poses}});break;default:break}return Promise.resolve({ok:!0})}return n==="test"&&e.action==="start"&&Nn({type:"test:started",ok:!0,dict:e.result?.dict},50),n==="test"&&e.action==="stop"&&Nn({type:"test:stopped"},10),n==="bones"?Promise.resolve({ok:!0,bones:window.JJS_MOCK?.bones?.(e)||[]}):(n==="close"&&Nn({type:"close"},10),Promise.resolve({ok:!0}))}var Se=n=>document.querySelector(n),K=(n,e={},...t)=>{let i=document.createElement(n);for(let[s,r]of Object.entries(e||{}))r==null||r===!1||(s==="class"?i.className=r:s.startsWith("on")?i.addEventListener(s.slice(2),r):s==="html"?i.innerHTML=r:i.setAttribute(s,r===!0?"":r));for(let s of t.flat())s!=null&&s!==!1&&i.append(s);return i},jt=(n,e=2)=>(+n).toFixed(e).replace(".",","),Ii=()=>Object.keys(x.doc?.actors||{}),Pv=n=>Ct(n).groundZ+.085;function ft(n,e="info",t=3800){if(!n)return;let i=K("div",{class:`toast ${e}`},n);Se("#toasts").append(i),setTimeout(()=>i.remove(),t)}function Iv(){let n=Se("#tooltip");document.addEventListener("mouseover",e=>{let t=e.target.closest?.("[data-tip]");if(!t){n.classList.add("hidden");return}n.textContent=G(t.dataset.tip),n.classList.remove("hidden");let i=t.getBoundingClientRect();n.style.left=`${Math.min(window.innerWidth-n.offsetWidth-8,Math.max(8,i.left))}px`,n.style.top=`${i.bottom+6+n.offsetHeight>window.innerHeight?i.top-n.offsetHeight-6:i.bottom+6}px`})}function Dv(){for(let n of document.querySelectorAll("[data-t]"))n.textContent=G(n.dataset.t)}var mh=null;function Tr(n,e,t=[],{onClose:i}={}){let s=Se("#dialog");s.innerHTML="",s.append(K("h2",{},n),e,K("div",{class:"row end"},t)),Se("#modal").classList.remove("hidden"),mh=i||null;let r=s.querySelector("input,select,textarea");r&&setTimeout(()=>r.focus(),30)}function Xn(){Se("#modal").classList.add("hidden");let n=mh;mh=null,n?.()}var gh=()=>!Se("#modal").classList.contains("hidden");function Sh(n){return new Promise(e=>Tr(G("app_title"),K("p",{},n),[K("button",{class:"btn",onclick:()=>{Xn(),e(!1)}},G("no")),K("button",{class:"btn accent",onclick:()=>{Xn(),e(!0)}},G("yes"))],{onClose:()=>e(!1)}))}function fa(n,e="",t=""){return new Promise(i=>{let s=K("input",{type:"text",value:e,style:"width:100%"}),r=()=>{let a=s.value.trim();Xn(),i(a||null)};s.addEventListener("keydown",a=>{a.key==="Enter"&&r()}),Tr(n,K("div",{},s,t?K("div",{class:"hint"},t):null),[K("button",{class:"btn",onclick:()=>{Xn(),i(null)}},G("cancel")),K("button",{class:"btn accent",onclick:r},G("ok"))],{onClose:()=>i(null)})})}var Oe,Mh;function kv(n){let e={},t=0;for(let i of["male","female","zombie"]){let s=null,r=n?.skeletons?.[i];if(r)try{s=typeof r=="string"?JSON.parse(r):r}catch{s=null}!s&&window.JJS_MOCK?.skeletons?.[i]&&(s=window.JJS_MOCK.skeletons[i]),s||(s=Nh(i),t++),e[i]=new Dr(s)}return x.skeletonSource=t?"placeholder":"server",e}function Uv(n){if(uf(n.locale),Dv(),x.config=n.config||{},x.undoMax=Math.max(100,x.config.undo||150),x.frame=n.frame,x.partners=x.config.partners||[],x.skeletons=kv(n.server),x.projects=n.server?.projects||[],x.poses=n.server?.poses||{},x.watch=n.server?.watch||{alive:!1},Se("#app").classList.remove("hidden"),!Oe){Oe=lf(Se("#view"),{inGame:wr,onCamera:Nv});let t=x.config.camera||{};Oe.limits.min=t.MinDistance||.4,Oe.limits.max=t.MaxDistance||12,Oe.cam.fov=t.Fov||45,Mh=df(Se("#timeline"),{onEdit:()=>{}}),Vv(),ry(),requestAnimationFrame(yf)}Oe.resize(),Oe.setPreset("front");let e=[];x.skeletonSource==="placeholder"&&e.push(G("warn_no_skeleton")),x.watch.alive||e.push(G("watch_down")),Se("#warn").textContent=e.join(" "),Se("#warn").classList.toggle("hidden",!e.length),setTimeout(()=>Se("#warn").classList.add("hidden"),12e3),$s(),If()}yn("open",n=>Uv(n.data||{}));yn("close",()=>{Se("#app").classList.add("hidden"),x.doc=null});var pa=0,Gs=null;function Nv(n){Gs=n;let e=1e3/Math.min(30,x.config.camera?.UpdatesPerSecond||30),t=performance.now();t-pa>=e&&(pa=t,qt("camera",Gs),Gs=null)}var ff=0,pf="";function Fv(n){if(x.test)return;let e=performance.now();if(e-ff<100)return;let t={};for(let s of Ii()){let r=n[s].mover;t[s]={p:r.p.map(a=>+a.toFixed(4)),yaw:+(ui(r.q)/ze).toFixed(2)}}let i=JSON.stringify(t);i!==pf&&(ff=e,pf=i,qt("place",{actors:t}))}var mf=performance.now(),Ws=!0;fi("*",()=>{Ws=!0});function yf(n){requestAnimationFrame(yf);let e=Math.min(.1,(n-mf)/1e3);if(mf=n,Gs&&n-pa>34&&(pa=n,qt("camera",Gs),Gs=null),!x.doc||!Oe){Oe?.render();return}if(x.playing){let i=x.t+e*x.speed;i>=x.doc.duration&&(x.doc.loop?i%=x.doc.duration:(i=x.doc.duration,x.playing=!1,Ks())),x.t=i,Ws=!0,wh()}x.test?.follow&&x.test.phase!=null&&(x.t=x.test.phase*x.doc.duration);let t;try{t=Tn(x.t)}catch(i){console.error(i),Oe.render();return}for(let i of Ii())Oe.updateActor(i,t[i],x.actor===i?x.selBone:null),Oe.setVisible(i,x.overlay);Ov(),Bv(t),zv(t),Hv(t),Fv(t),Oe.render(),Ws&&(Mh.draw(),Ws=!1)}function Ov(){for(let n of Ii()){if(!x.onion||x.playing){Oe.updateOnion(n,0,null),Oe.updateOnion(n,1,null);continue}let e=nr(x.doc,n,null),t=e.filter(s=>s<x.t-.001).pop(),i=e.find(s=>s>x.t+.001);Oe.updateOnion(n,0,t!=null?Tn(t)[n]:null),Oe.updateOnion(n,1,i!=null?Tn(i)[n]:null)}}function Sf(n){let e=/^SKEL_([LR])_(UpperArm|Forearm|Thigh|Calf)$/.exec(n);return e?(e[2]==="UpperArm"||e[2]==="Forearm"?"hand":"foot")+e[1]:null}function ma(n,e,t=x.t){let i=Nt(x.doc,{actor:n,kind:"ik",id:e},t);return i?i.weight??1:0}function Mf(n,e){return e==="SKEL_ROOT"?Nt(x.doc,{actor:n,kind:"root"},x.t)?.rot||[0,0,0]:Nt(x.doc,{actor:n,kind:"bone",id:e},x.t)?.rot||[0,0,0]}function _h(n,e,t,i){if(t==="SKEL_ROOT"){let s=Nt(n,{actor:e,kind:"root"},x.t);yt(n,{actor:e,kind:"root"},x.t,{p:s?.p||[0,0,0],rot:i})}else yt(n,{actor:e,kind:"bone",id:t},x.t,{rot:i})}function Er(n,e){Ht({actor:n,selBone:e,selHandle:null,selGroup:e?Fa(e):null}),Xs(),Mn()}var $n=null;function Bv(n){let e=x.selBone,t=x.actor;if(!e||!n[t]||x.test||x.playing){Oe.hideGizmo(),$n=null;return}let i=Ct(t);if(!i.has(e)){Oe.hideGizmo();return}let s=Sf(e);if(s&&ma(t,s)>0){Oe.hideGizmo(),$n=null;return}let r=n[t],a=r.world.P[i.idx(e)],{axes:o,basis:c}=Oe.boneAxes(i,r,e),h=Mf(t,e),l=Math.max(.05,Oe.camDistanceTo(a)*.11);Oe.showGizmo(a,o,h,x.limitsOn?c.limits:null,l),$n={actor:t,bone:e,p:a,axes:o,rot:h,basis:c}}function bh(n){let e=[];if(x.test)return e;for(let t of Ii()){let i=Ct(t),s=n[t],r=l=>s.world.P[i.idx(l)],a=l=>x.selHandle&&x.selHandle.actor===t&&x.selHandle.name===l;for(let l of["handL","handR","footL","footR"]){let u=ma(t,l)>0;if(e.push({actor:t,name:l,kind:l.startsWith("hand")?"hand":"foot",p:r(cn[l]),active:u,selected:a(l)}),u){let d=l.slice(-1),p=l.startsWith("hand")?He.side[d].lower:He.side[d].calf;e.push({actor:t,name:"pole"+l,kind:"pole",p:r(p),active:!0,selected:a("pole"+l)})}}e.push({actor:t,name:"root",kind:"root",p:r("SKEL_ROOT"),active:!!En(x.doc,{actor:t,kind:"root"})?.length,selected:a("root")});let o=r("SKEL_Head"),c=s.pose?.look,h=De(Te(Ce(s.mover.q,s.D[i.idx("SKEL_Head")])),[0,.8,0]);e.push({actor:t,name:"look",kind:"look",p:c?c.target:Ue(o,h),active:!!c,selected:a("look")}),e.push({actor:t,name:"mover",kind:"mover",p:[s.mover.p[0],s.mover.p[1],i.groundZ+s.mover.p[2]+.005],active:!0,selected:a("mover")})}return e}function zv(n){Oe.setHandles(x.overlay?bh(n):[])}var ph=[],gf="";function Hv(n){let e=[],t=[];if(x.test?.points?.length)for(let s of x.test.points)e.push({p:[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2,(s.a[2]+s.b[2])/2],text:`${jt(s.cm,1)} cm`,red:s.red});else if(!x.test){for(let r of x.doc.contacts||[]){if(x.t<r.t[0]-.001||x.t>r.t[1]+.001)continue;let a=On(r.from),o=On(r.to),c=n[a.actor],h=n[o.actor];if(!c||!h)continue;let l=Ct(a.actor),u=Ct(o.actor);if(!l.has(a.bone)||!u.has(o.bone))continue;let d=c.world.P[l.idx(a.bone)],p=u.idx(o.bone),g=Ue(h.world.P[p],De(Te(Ce(h.mover.q,h.D[p])),r.offset||[0,0,0])),_=Math.hypot(d[0]-g[0],d[1]-g[1],d[2]-g[2])*100,m=_>(x.config.contactRedCm||3);e.push({p:[(d[0]+g[0])/2,(d[1]+g[1])/2,(d[2]+g[2])/2],text:`${jt(_,1)} cm`,red:m}),t.push({a:d,b:g,color:m?16730955:11766015})}let s=JSON.stringify(t.map(r=>[r.a,r.b,r.color].flat().map(a=>+(+a).toFixed(3))));s!==gf&&(gf=s,Oe.setLines(t))}let i=Se("#labels");for(;ph.length<e.length;){let s=K("div",{class:"mlabel"});i.append(s),ph.push(s)}ph.forEach((s,r)=>{let a=e[r];if(!a){s.style.display="none";return}let o=Oe.project(a.p);s.style.display=o.behind?"none":"block",s.style.left=`${o.x}px`,s.style.top=`${o.y}px`,s.textContent=a.text,s.className=`mlabel ${a.red?"red":""}`})}function Vv(){let n=Oe.renderer.domElement,e=null;n.addEventListener("mousedown",t=>{if(!x.doc)return;let i=t.button===0?Oe.pick(t.clientX,t.clientY):null;if(t.button!==0){Oe.beginOrbit(t.clientX,t.clientY,t.button===2&&!t.shiftKey?"pan":"orbit"),e={kind:"cam"};return}if(i?.pick==="ring"&&$n){Hn();let s=Oe.project($n.p),r=n.getBoundingClientRect();e={kind:"ring",k:i.k,cx:s.x+r.left,cy:s.y+r.top,a0:Math.atan2(-(t.clientY-(s.y+r.top)),t.clientX-(s.x+r.left)),rot0:$n.rot.slice(),g:{...$n}};let a=Oe.viewDir();e.sign=$n.axes[i.k][0]*-a[0]+$n.axes[i.k][1]*-a[1]+$n.axes[i.k][2]*-a[2]>=0?1:-1;return}if(i?.pick==="handle"){Hn();let s=Tn(x.t),r=s[i.actor],a=bh(s).find(c=>c.actor===i.actor&&c.name===i.name);Ht({selHandle:{actor:i.actor,name:i.name},actor:i.actor,selBone:null,selGroup:i.name.startsWith("hand")||i.name.startsWith("polehand")?"arm"+i.name.slice(-1):i.name.includes("foot")?"leg"+i.name.slice(-1):i.name==="look"?"head":"pos"}),Mn(),Xs();let o=Oe.viewDir();e={kind:"handle",actor:i.actor,name:i.name,start:a.p.slice(),normal:i.name==="mover"||t.shiftKey?[0,0,1]:[-o[0],-o[1],-o[2]],vertical:t.altKey,rotate:i.name==="mover"&&t.shiftKey,mover0:{p:r.mover.p.slice(),yaw:ui(r.mover.q)/ze},root0:(Nt(x.doc,{actor:i.actor,kind:"root"},x.t)?.p||[0,0,0]).slice(),sol:r},e.vertical&&(e.normal=[o[0],o[1],0]);return}if(i?.pick==="bone"){e={kind:"click",hit:i,x:t.clientX,y:t.clientY};return}Oe.beginOrbit(t.clientX,t.clientY,"orbit"),e={kind:"cam",click:!0,x:t.clientX,y:t.clientY}}),window.addEventListener("mousemove",t=>{if(e){if(e.kind==="cam"){Oe.moveOrbit(t.clientX,t.clientY);return}if(e.kind==="click"&&Math.hypot(t.clientX-e.x,t.clientY-e.y)>4){Oe.beginOrbit(e.x,e.y,"orbit"),e={kind:"cam"};return}if(e.kind==="ring"){let i=Math.atan2(-(t.clientY-e.cy),t.clientX-e.cx),s=(i-e.a0)/ze;s=(s+540)%360-180,e.a0=i,e.acc=(e.acc||0)+s*e.sign;let r=e.rot0.slice();r[e.k]=e.rot0[e.k]+e.acc;let a=x.limitsOn?js(Ct(e.g.actor),e.g.bone,r).rot:r;je(o=>_h(o,e.g.actor,e.g.bone,a),{commit:!1}),Mn();return}e.kind==="handle"&&Gv(e,t)}}),window.addEventListener("mouseup",()=>{if(!e)return;let t=e;if(e=null,t.kind==="cam"){Oe.endOrbit(),t.click&&Er(x.actor,null);return}if(t.kind==="click"){Er(t.hit.actor,t.hit.bone);return}jn(),Mn(),Xs()})}function xh(n,e){return De(ht(n.mover.q),Ne(e,n.mover.p))}function Gv(n,e){let t=Oe.planePoint(e.clientX,e.clientY,n.start,n.normal);if(!t)return;let i=t;n.vertical&&(i=[n.start[0],n.start[1],t[2]]);let{actor:s,name:r}=n;je(a=>{let o=n.sol;if(r==="mover"){let u={actor:s,kind:"mover"};if(n.rotate){let d=Math.atan2(n.start[1]-n.mover0.p[1],n.start[0]-n.mover0.p[0]),p=Math.atan2(t[1]-n.mover0.p[1],t[0]-n.mover0.p[0]);yt(a,u,x.t,{p:n.mover0.p,yaw:n.mover0.yaw+(p-d)/ze})}else yt(a,u,x.t,{p:[n.mover0.p[0]+t[0]-n.start[0],n.mover0.p[1]+t[1]-n.start[1],n.mover0.p[2]],yaw:n.mover0.yaw});return}if(r==="root"){let u=De(ht(o.mover.q),Ne(i,n.start)),d=Nt(a,{actor:s,kind:"root"},x.t);yt(a,{actor:s,kind:"root"},x.t,{p:[n.root0[0]+u[0],n.root0[1]+u[1],n.root0[2]+u[2]],rot:d?.rot||[0,0,0]});return}if(r==="look"){yt(a,{actor:s,kind:"look"},x.t,{target:xh(o,i),space:"body",weight:Nt(a,{actor:s,kind:"look"},x.t)?.weight??1});return}if(r.startsWith("pole")){let u=r.slice(4),d=u.slice(-1),p=Ct(s),g=o.world.P[p.idx(u.startsWith("hand")?He.side[d].upper:He.side[d].thigh)],_=o.world.P[p.idx(cn[u])],m=[(g[0]+_[0])/2,(g[1]+_[1])/2,(g[2]+_[2])/2],f=De(ht(o.mover.q),Ne(i,m)),S=Nt(a,{actor:s,kind:"ik",id:u},x.t);yt(a,{actor:s,kind:"ik",id:u},x.t,{target:S?.target,space:"body",weight:S?.weight??1,pole:f});return}let c={actor:s,kind:"ik",id:r},h=Nt(a,c,x.t),l={target:xh(o,i),space:"body",weight:1};if(!h||(h.weight??1)<=0){let u=Ct(s),d=r.slice(-1),p=o.world.P[u.idx(r.startsWith("hand")?He.side[d].upper:He.side[d].thigh)],g=o.world.P[u.idx(r.startsWith("hand")?He.side[d].lower:He.side[d].calf)],_=o.world.P[u.idx(cn[r])];l.pole=De(ht(o.mover.q),Ne(g,[(p[0]+_[0])/2,(p[1]+_[1])/2,(p[2]+_[2])/2])),r.startsWith("foot")&&(l.yaw=ui(Te(o.D[u.idx(cn[r])]))/ze)}else h.pole&&(l.pole=h.pole);r.startsWith("foot")&&h?.yaw!=null&&(l.yaw=h.yaw),yt(a,c,x.t,l)},{commit:!1})}var Wv=[["group_pos",["SKEL_ROOT"]],["group_torso",["SKEL_Pelvis","SKEL_Spine_Root","SKEL_Spine0","SKEL_Spine1","SKEL_Spine2","SKEL_Spine3"]],["group_head",["SKEL_Neck_1","SKEL_Neck_2","SKEL_Head"]],["group_armL",["SKEL_L_Clavicle","SKEL_L_UpperArm","SKEL_L_Forearm","SKEL_L_Hand"]],["group_armR",["SKEL_R_Clavicle","SKEL_R_UpperArm","SKEL_R_Forearm","SKEL_R_Hand"]],["group_legL",["SKEL_L_Thigh","SKEL_L_Calf","SKEL_L_Foot","SKEL_L_Toe0"]],["group_legR",["SKEL_R_Thigh","SKEL_R_Calf","SKEL_R_Foot","SKEL_R_Toe0"]]],bf=n=>n.replace(/^SKEL_/,"").replace(/_/g," ");function Xs(){if(!x.doc)return;let n=Se("#actor-tabs");n.innerHTML="";for(let o of Ii())n.append(K("button",{class:`btn ${x.actor===o?"on":""}`,onclick:()=>{Er(o,null)}},x.doc.actors[o].label||o));Se("#partner-row").classList.toggle("hidden",x.doc.type!=="pair");let t=Se("#partner-model");if(x.doc.type==="pair"&&t.options.length!==x.partners.length){t.innerHTML="";for(let o of x.partners)t.append(K("option",{value:o.model},o.label||o.model))}x.doc.type==="pair"&&(t.value=x.doc.actors.b.model);let i=Se("#bone-tree");i.innerHTML="";let s=Ct(x.actor),r=Se("#chk-fingers").checked,a=Wv.map(([o,c])=>[o,c]);r&&(a.push(["hand_l",He.side.L.fingers.flat()]),a.push(["hand_r",He.side.R.fingers.flat()]));for(let[o,c]of a){let h=K("div",{class:"tree-group"},K("div",{class:"tg-title"},G(o)));for(let l of c){if(!s.has(l))continue;let u=l==="SKEL_ROOT"?!!En(x.doc,{actor:x.actor,kind:"root"})?.length:!!En(x.doc,{actor:x.actor,kind:"bone",id:l})?.length;h.append(K("button",{class:`bone ${x.selBone===l?"sel":""} ${u?"keyed":""}`,onclick:()=>Er(x.actor,l)},l==="SKEL_ROOT"?G("root"):bf(l)))}i.append(h)}}function Mn(){let n=Se("#inspector");if(n.innerHTML="",!x.doc)return;if(x.selHandle){let{actor:o,name:c}=x.selHandle;if(n.append(K("div",{},K("b",{},`${x.doc.actors[o].label||o}: ${Kv(c)}`))),/^(hand|foot)[LR]$/.test(c)&&ma(o,c)>0){let h=Nt(x.doc,{actor:o,kind:"ik",id:c},x.t);n.append(K("div",{class:"info"},`IK ${h.target.map(l=>jt(l,3)).join(" / ")} m`)),n.append(qs("IK-Gewicht",h.weight??1,0,1,.05,l=>je(u=>yt(u,{actor:o,kind:"ik",id:c},x.t,{target:h.target,space:"body",weight:l}),{commit:!1}),()=>jn(),()=>Hn())),n.append(K("button",{class:"btn block","data-tip":"tip_remove_ik",onclick:()=>{je(l=>Ha(l,{actor:o,kind:"ik",id:c})),Mn()}},G("remove_ik")))}if(c==="look"&&En(x.doc,{actor:o,kind:"look"})?.length){let h=Nt(x.doc,{actor:o,kind:"look"},x.t);n.append(qs("Blick-Gewicht",h.weight??1,0,1,.05,l=>je(u=>yt(u,{actor:o,kind:"look"},x.t,{target:h.target,space:h.space||"body",weight:l}),{commit:!1}),()=>jn(),()=>Hn()))}return}if(!x.selBone){n.append(K("div",{class:"info"},G("none_selected")));return}let e=x.actor,t=x.selBone,i=Ct(e);n.append(K("div",{},K("b",{},t==="SKEL_ROOT"?G("root"):bf(t))));let s=Sf(t);if(s&&ma(e,s)>0){n.append(K("div",{class:"info"},G("ik_controlled"))),n.append(K("button",{class:"btn block","data-tip":"tip_remove_ik",onclick:()=>{je(o=>Ha(o,{actor:e,kind:"ik",id:s})),Mn()}},G("remove_ik")));return}let r=Ni(i,t),a=Mf(e,t);r.labels.forEach((o,c)=>{let h=x.limitsOn&&r.limits?r.limits[c]:[-180,180],l=p=>{let g=a.slice();g[c]=+p;let _=x.limitsOn?js(i,t,g).rot:g;je(m=>_h(m,e,t,_),{commit:!1})},u=K("input",{type:"range",min:h[0],max:h[1],step:.5,value:a[c]}),d=K("input",{type:"number",min:h[0],max:h[1],step:1,value:(+a[c]).toFixed(1)});u.addEventListener("pointerdown",()=>Hn()),u.addEventListener("input",()=>{d.value=u.value,l(u.value)}),u.addEventListener("change",()=>jn()),d.addEventListener("change",()=>{l(d.value),Mn()}),n.append(K("div",{class:`axis ax${c}`},K("span",{class:"nm"},o||Ur.centre[c]),u,d))}),n.append(K("div",{class:"row"},K("label",{class:"check","data-tip":"tip_limits"},K("input",{type:"checkbox",checked:x.limitsOn,onchange:o=>{x.limitsOn=o.target.checked,Mn()}}),G("limits")),K("button",{class:"btn small","data-tip":"tip_reset_bone",onclick:()=>je(o=>_h(o,e,t,[0,0,0]))},G("reset_bone"))))}function Kv(n){return{handL:G("hand_l"),handR:G("hand_r"),footL:"Fu\xDF links",footR:"Fu\xDF rechts",root:G("root"),look:G("look"),mover:G("mover")}[n]||(n.startsWith("pole")?n.includes("hand")?"Ellbogen-Richtung":"Knie-Richtung":n)}function qs(n,e,t,i,s,r,a,o){let c=K("input",{type:"range",min:t,max:i,step:s,value:e}),h=K("output",{},jt(e));return c.addEventListener("pointerdown",()=>o?.()),c.addEventListener("input",()=>{h.textContent=jt(c.value),r(+c.value)}),c.addEventListener("change",()=>a?.()),K("label",{class:"slider row"},K("span",{},n),c,h)}function _a(){let n=Se("#fingers");if(n.innerHTML="",!!x.doc)for(let e of["L","R"]){let t={actor:x.actor,kind:"fingers",id:e},i=Nt(x.doc,t,x.t)||{preset:"relaxed",curl:1},s=i.preset||"relaxed";n.append(K("div",{class:"tg-title"},G(e==="L"?"hand_l":"hand_r"))),n.append(K("div",{class:"presets"},Object.keys(er).map(r=>K("button",{class:`btn small ${s===r?"on":""}`,onclick:()=>{je(a=>yt(a,t,x.t,{preset:r,curl:i.curl??1,spread:void 0})),_a()}},G(`preset_${r}`))))),n.append(qs(G("curl"),i.curl??1,0,1.5,.05,r=>je(a=>yt(a,t,x.t,{preset:s,curl:r,spread:i.spread}),{commit:!1}),()=>jn(),()=>Hn())),n.append(qs(G("spread"),i.spread??er[s].spread,-1,1,.05,r=>je(a=>yt(a,t,x.t,{preset:s,curl:i.curl??1,spread:r}),{commit:!1}),()=>jn(),()=>Hn()))}}function ga(){let n=Se("#helpers");if(n.innerHTML="",!x.doc)return;let e=(i,s,r,a={})=>K("button",{class:"btn block","data-tip":s,onclick:r,...a},G(i));n.append(e("mirror_all","tip_mirror_all",wf),e("mirror_sel","tip_mirror_sel",()=>{x.selBone&&je(i=>Mu(i,x.actor,x.selBone,x.t))},{disabled:!x.selBone||!Ui(x.selBone||"")}),K("div",{class:"row"},e("copy_pose","tip_copy_pose",Ef),e("paste_pose","tip_paste_pose",Af,{disabled:!x.clipboardPose})),e("snap_ground","tip_snap_ground",$v),e("lock_feet","tip_lock_feet",Xv)),x.doc.type==="pair"&&n.append(e("stick_hand","tip_stick_hand",Yv)),x.selContact!=null&&x.doc.contacts?.[x.selContact]&&n.append(e("unstick","tip_stick_hand",()=>{je(i=>Va(i,x.selContact)),Ht({selContact:null})})),n.append(K("div",{class:"hint"},x.range?`${G("range")}: ${jt(x.range[0])}\u2013${jt(x.range[1])} s`:G("no_range"))),n.append(K("div",{class:"tg-title"},G("notes")));let t=K("textarea",{rows:3,placeholder:G("notes_hint")},x.doc.notes||"");t.addEventListener("change",()=>je(i=>{i.notes=t.value.slice(0,4e3)})),n.append(t)}function wf(){je(n=>hs(n,x.actor,x.t,Su(Kr(n,x.actor,x.t)))),ft(G("mirror_all"),"ok",1500)}function Ef(){x.clipboardPose=Kr(x.doc,x.actor,x.t),ga(),ft(G("copy_pose"),"ok",1500)}function Af(){x.clipboardPose&&je(n=>hs(n,x.actor,x.t,x.clipboardPose))}function $v(){let n=x.actor,e=Tn(x.t),t=e[n],i=Ct(n),s=x.selHandle?.name==="footL"?["L"]:x.selHandle?.name==="footR"?["R"]:["L","R"];je(r=>{for(let a of s){let o={actor:n,kind:"ik",id:"foot"+a},c=Nt(r,o,x.t),h=xh(t,t.world.P[i.idx(cn["foot"+a])]),l=[c&&(c.weight??1)>0?c.target[0]:h[0],c&&(c.weight??1)>0?c.target[1]:h[1],Pv(n)];yt(r,o,x.t,{target:l,space:"body",weight:1,pitch:0,roll:0,yaw:c?.yaw??ui(Te(t.D[i.idx(cn["foot"+a])]))/ze,pole:c?.pole})}})}function Xv(){if(!x.range)return ft(G("no_range"),"warn");let n=x.selHandle?.name==="footL"?"L":x.selHandle?.name==="footR"?"R":"both";je(e=>Eu(e,x.actor,n,x.range)),ft(G("lock_feet"),"ok",1500)}var qv={part_head:"SKEL_Head",part_neck:"SKEL_Neck_1",part_chest:"SKEL_Spine3",part_pelvis:"SKEL_Pelvis",part_shoulderL:"SKEL_L_UpperArm",part_shoulderR:"SKEL_R_UpperArm",part_armL:"SKEL_L_Forearm",part_armR:"SKEL_R_Forearm",part_handL:"SKEL_L_Hand",part_handR:"SKEL_R_Hand"};function Yv(){if(x.doc.type!=="pair")return ft(G("pair_only"),"warn");let n=x.selHandle&&/^(hand|foot)[LR]$/.test(x.selHandle.name)?x.selHandle:null;if(!n)return ft(G("select_hand_first"),"warn");let e=Ii().find(i=>i!==n.actor),t=K("select",{},Object.entries(qv).map(([i,s])=>K("option",{value:s},G(i))));Tr(G("stick_hand"),K("div",{},K("label",{},G("stick_target")),t),[K("button",{class:"btn",onclick:Xn},G("cancel")),K("button",{class:"btn accent",onclick:()=>{let i=t.value,s=Tn(x.t),r=s[e],a=Ct(e),o=a.idx(i),c=s[n.actor].world.P[Ct(n.actor).idx(cn[n.name])],h=De(ht(Te(Ce(r.mover.q,r.D[o]))),Ne(c,r.world.P[o])),l=x.range||[x.t,x.doc.duration];je(u=>Tu(u,`${n.actor}.${n.name}`,`${e}.${i}`,h,l)),Xn()}},G("ok"))])}function Tf(){let n=Se("#poses");if(n.innerHTML="",!x.doc)return;n.append(K("div",{class:"tg-title"},G("builtin"))),n.append(K("div",{class:"presets"},Object.keys(ha).map(t=>K("button",{class:"btn small",onclick:()=>je(i=>hs(i,x.actor,x.t,ha[t]))},G(t))))),n.append(K("div",{class:"tg-title"},G("my_poses")));let e=Object.keys(x.poses).sort();for(let t of e)n.append(K("div",{class:"row"},K("button",{class:"btn small",style:"flex:1;text-align:left",onclick:()=>{try{let i=JSON.parse(x.poses[t]);je(s=>hs(s,x.actor,x.t,i))}catch{ft(G("pose_invalid"),"error")}}},t),K("button",{class:"btn small danger",onclick:()=>Sn("poseDelete",[t])},"\u2715")));n.append(K("button",{class:"btn block","data-tip":"tip_save_pose",onclick:async()=>{let t=await fa(G("pose_name_prompt"),"",G("name_hint"));if(t){if(!/^[a-z0-9_]{1,32}$/.test(t))return ft(G("name_hint"),"error");Sn("poseSave",[t,JSON.stringify(Kr(x.doc,x.actor,x.t))])}}},G("save_pose")))}function Rf(){let n=Se("#checks"),e=Se("#light");e.className=`light ${x.light}`,e.textContent=x.checking?G("check_running"):G(`light_${x.light}`),n.innerHTML="",x.checkError&&n.append(K("div",{class:"err"},x.checkError));let t=x.findings.slice().sort((i,s)=>({error:0,warn:1,ok:2})[i.level]-{error:0,warn:1,ok:2}[s.level]);for(let i of t){let s=K("div",{class:`finding ${i.level}`},K("div",{class:"ft"},i.title),K("div",{class:"fx"},i.text)),r=K("div",{class:"row"});i.level!=="ok"&&i.t!=null&&r.append(K("button",{class:"btn small",onclick:()=>{mn(i.t),i.actor&&Ht({actor:i.actor})}},G("jump"))),i.fix&&r.append(K("button",{class:"btn small accent",onclick:()=>{let a=Yh(x.doc,i.fix,{sampled:Xa});Wa(a),ft(`${G("fix")}: ${i.fix.label||i.title}`,"ok",1800)}},i.fix.label||G("fix"))),r.children.length&&s.append(r),n.append(s)}}function wh(){if(!x.doc)return;let n=Math.round(x.t*ln),e=Math.round(x.doc.duration*ln);Se("#time-out").textContent=`${jt(x.t)} s \xB7 ${G("frame",n,e)}`}function Ks(){Se("#btn-play").textContent=x.playing?"\u275A\u275A":"\u25B6",x.doc&&(Se("#chk-loop").checked=!!x.doc.loop,Se("#duration").value=x.doc.duration,Se("#range-out").textContent=x.range?`${G("range")} ${jt(x.range[0])}\u2013${jt(x.range[1])} s`:"",Se("#btn-undo").disabled=!x.history.length,Se("#btn-redo").disabled=!x.future.length)}function Ys(){Se("#project-name").textContent=x.doc?`${x.doc.title||x.name} (${x.doc.type==="pair"?G("pair"):G("single")})`:G("no_project"),Se("#save-state").textContent=x.doc?x.saving?G("saving"):x.dirty?G("unsaved"):x.savedAt?G("saved_at",new Date(x.savedAt).toLocaleTimeString().slice(0,5)):"":""}function Sn(n,e){return qt("server",{op:n,args:e})}function Ar(){!x.doc||!x.name||x.saving||(x.saving=!0,x.saveVersion=x.version,Ys(),Sn("save",[x.name,An(x.doc)]))}yn("reply",({data:n})=>{if(n){if(n.op==="save"){x.saving=!1,n.ok?(x.saveVersion===x.version&&(x.dirty=!1),x.savedAt=Date.now()):ft(n.msg,"error"),Ys();return}if(n.op==="preview"||n.op==="finalize"){n.ok||(ft(n.msg,"error",6e3),n.op==="preview"?(x.test=null,qn()):ty(n.msg));return}n.op==="rename"&&n.ok&&x.name===n.from&&(x.name=n.name,je(e=>{e.name=n.name})),n.msg&&ft(n.msg,n.ok?"ok":"error")}});yn("projects",({list:n})=>{x.projects=n||[],gh()&&vh&&$s()});yn("poses",({poses:n})=>{x.poses=n||{},Tf()});yn("notice",({key:n,text:e})=>ft(e||G(n),"warn",3e3));yn("project",({name:n,text:e})=>{let t;try{let s=zh(JSON.parse(e));if(s.errors)throw new Error(s.errors[0].msg);t=s.doc}catch(s){return ft(`${G("project_invalid")||G("err")}: ${s.message}`,"error")}let i=Hh(t);i.length&&ft(i[0].msg,"warn",6e3),Cf(t,n)});function Cf(n,e){x.t=0,x.playing=!1;for(let t of Object.keys(Oe.actors))Oe.removeActor(t);Ru(n,e);for(let t of Ii())Oe.buildActor(t,Ct(t));Ht({actor:"a",selBone:null,selHandle:null}),n.type==="pair"?Lf():qt("partner",{model:null}),Xn(),sy(),Yr()}async function Lf(){let n=Nt(x.doc,{actor:"b",kind:"mover"},0)||{p:[0,.9,0],yaw:180},e=await qt("partner",{model:x.doc.actors.b.model,p:n.p,yaw:n.yaw});e&&e.ok===!1&&e.error&&ft(G("partner_spawn_failed",e.error),"error")}var vh=!1;function $s(){vh=!0;let n=x.name,e=K("div",{class:"plist"}),t=()=>{e.innerHTML="",x.projects.length||e.append(K("div",{class:"pitem"},K("span",{class:"pm"},"\u2014")));for(let u of x.projects)e.append(K("div",{class:`pitem ${u.name===n?"sel":""}`,onclick:()=>{n=u.name,t()},ondblclick:()=>Sn("load",[u.name])},K("span",{class:"pn"},u.title&&u.title!==u.name?`${u.title} (${u.name})`:u.name),K("span",{class:"pm"},u.type==="pair"?G("pair"):G("single")),K("span",{class:"pm"},u.updated?new Date(u.updated*1e3).toLocaleString().slice(0,16):"")))};t();let i=K("input",{type:"text",placeholder:"winken_01"}),s=K("select",{},K("option",{value:"single"},G("single")),K("option",{value:"pair"},G("pair"))),r=K("select",{},x.partners.map(u=>K("option",{value:u.model},u.label||u.model))),a=K("input",{type:"number",min:.2,max:30,step:.1,value:x.config.duration||2}),o=K("div",{class:"row hidden"},K("label",{},G("partner_model")),r);s.addEventListener("change",()=>o.classList.toggle("hidden",s.value!=="pair"));let c=()=>{let u=i.value.trim();if(!/^[a-z0-9_]{1,40}$/.test(u))return ft(G("name_hint"),"error");if(x.projects.some(p=>p.name===u))return ft(`${u}: existiert schon`,"error");let d=Vh({name:u,type:s.value,duration:Math.max(.2,Math.min(30,+a.value||2)),models:{a:"mp_m_freemode_01",b:r.value}});d.title=u;for(let p of Object.keys(d.actors))hs(d,p,0,ha.pose_stand);Cf(d,u),x.dirty=!0,Ar(),Sn("list",[])},h=u=>()=>{if(!n)return ft(G("none_selected"),"warn");u(n)},l=K("div",{},e,K("div",{class:"row"},K("button",{class:"btn accent",onclick:h(u=>Sn("load",[u]))},G("open")),K("button",{class:"btn",onclick:h(async u=>{let d=await fa(G("new_name_prompt"),u,G("name_hint"));d&&Sn("rename",[u,d]),setTimeout($s,200)})},G("rename")),K("button",{class:"btn",onclick:h(async u=>{let d=await fa(G("new_name_prompt"),`${u}_kopie`,G("name_hint"));d&&Sn("duplicate",[u,d]),setTimeout($s,200)})},G("duplicate")),K("button",{class:"btn danger",onclick:h(async u=>{await Sh(G("confirm_delete",u))&&Sn("delete",[u]),setTimeout($s,200)})},G("delete"))),K("h3",{},G("new_project")),K("div",{class:"row"},K("label",{},G("name")),i),K("div",{class:"hint"},G("name_hint")),K("div",{class:"row"},s,K("label",{},G("duration_s")),a),o);Tr(G("projects"),l,[x.doc?K("button",{class:"btn",onclick:Xn},G("close")):null,K("button",{class:"btn accent",onclick:c},G("create"))],{onClose:()=>{vh=!1}})}function Zv(){let n=(e,t)=>{let i=Ct(e);return i.has(t)?i.bones[i.idx(t)].tag:null};return(x.doc.contacts||[]).map(e=>{let t=On(e.from),i=On(e.to),s=Ct(i.actor),r=s.has(i.bone)?De(ht(s.restQ[s.idx(i.bone)]),e.offset||[0,0,0]):[0,0,0];return{id:e.id||`${e.from}>${e.to}`,a:{actor:t.actor,tag:n(t.actor,t.bone),offset:[0,0,0]},b:{actor:i.actor,tag:n(i.actor,i.bone),offset:r}}}).filter(e=>e.a.tag!=null&&e.b.tag!=null)}var _f=!1;async function jv(){if(!(!x.doc||!x.name)){if(!_f){if(!await Sh(G("test_notice")))return;_f=!0}x.playing=!1,x.test={stage:"converting",t0:performance.now(),points:[],follow:!0},qn(),Sn("preview",[x.name,An(x.doc)]),x.dirty=!1,x.savedAt=Date.now(),Ys()}}yn("job",({result:n})=>{if(n){if(n.kind==="final")return ny(n);if(x.test){if(!n.ok){x.test={...x.test,stage:"failed",errors:n.errors||[]},qn();return}x.test.stage="loading",x.test.result=n,x.lastResult=n,qn(),qt("test",{action:"start",result:{dict:n.dict,clips:n.clips,origins:n.origins,duration:n.duration},loop:!!x.doc.loop,rate:1,phase:0,contacts:Zv()})}}});yn("test:started",({ok:n,error:e})=>{if(x.test){if(!n){x.test.stage="failed",x.test.errors=[{msg:e}],qn();return}x.test.stage="playing",x.test.elapsed=(performance.now()-x.test.t0)/1e3,qn()}});yn("test:state",n=>{x.test&&(x.test.phase=n.phase,x.test.points=n.points||[],Ws=!0,Pf())});yn("test:stopped",()=>{x.test=null,qn(),Oe?.setLines([])});function Jv(){qt("test",{action:"stop"}),x.test=null,qn(),Oe.setLines([])}function qn(){let n=Se("#sec-test"),e=Se("#test");if(n.classList.toggle("hidden",!x.test),e.innerHTML="",!x.test)return;let t=x.test,i={converting:G("test_converting"),loading:G("test_loading"),playing:G("test_playing",jt(t.elapsed||0,1)),failed:G("test_failed")}[t.stage];e.append(K("div",{class:`stage ${t.stage==="failed"?"err":""}`},i));for(let s of t.errors||[])e.append(K("div",{class:"err"},s.msg||String(s)));t.stage==="playing"&&(e.append(K("div",{class:"row"},K("label",{class:"check"},K("input",{type:"checkbox",checked:!!x.doc.loop,onchange:s=>qt("test",{action:"loop",loop:s.target.checked})}),G("loop")),K("label",{class:"check"},K("input",{type:"checkbox",checked:x.overlay,onchange:s=>{x.overlay=s.target.checked}}),G("overlay")))),e.append(qs(G("speed"),1,0,2,.05,s=>qt("test",{action:"rate",rate:s}))),e.append(qs(G("phase"),t.phase||0,0,.999,.001,s=>{qt("test",{action:"rate",rate:0}),qt("test",{action:"phase",phase:s})})),e.append(K("button",{class:"btn block","data-tip":"tip_calibrate",onclick:Qv},G("calibrate"))),t.calib&&e.append(K("div",{class:t.calib.max<=1?"info":"err"},G("calib_result",jt(t.calib.max,1),jt(t.calib.mean,1),t.calib.n))),e.append(K("div",{class:"tg-title"},G("contacts")),K("table",{class:"mtable",id:"measure"})),Pf()),e.append(K("button",{class:"btn block",onclick:Jv},G("stop")))}function Pf(){let n=document.getElementById("measure");if(!(!n||!x.test)){n.innerHTML="";for(let e of x.test.points||[])n.append(K("tr",{},K("td",{},e.id),K("td",{class:e.red?"red":""},`${jt(e.cm,1)} cm`)));Oe.setLines((x.test.points||[]).map(e=>({a:e.a,b:e.b,color:e.red?16730955:4645060})))}}async function Qv(){if(!x.test||x.test.stage!=="playing")return ft(G("calib_need_test"),"warn");qt("test",{action:"rate",rate:0}),await new Promise(r=>setTimeout(r,300));let n=(x.test.phase||0)*x.doc.duration,e=Tn(n),t=0,i=0,s=0;for(let r of Ii()){let a=Ct(r),o=Xh(a).filter(h=>!h.includes("Finger")&&h!=="SKEL_ROOT"),c=await qt("bones",{actor:r,list:o.map(h=>({tag:a.bones[a.idx(h)].tag,id:h}))});for(let h of c?.bones||[]){let l=e[r].world.P[a.idx(h.id)],u=Math.hypot(h.p[0]-l[0],h.p[1]-l[1],h.p[2]-l[2])*100;t=Math.max(t,u),i+=u,s++}}x.test.calib={max:t,mean:s?i/s:0,n:s},qn()}var Fn=null;function ey(){if(!x.doc||!x.name)return;let n=K("input",{type:"text",value:x.doc.title||x.name,style:"width:100%"}),e=K("input",{type:"text",value:x.doc.targetResource||"",placeholder:"jj_emotes"}),t=K("input",{type:"text",value:x.doc.dict||`jj_${x.name}`.slice(0,48)}),i=K("textarea",{rows:3,placeholder:G("notes_hint")},x.doc.notes||"");Fn=K("div",{id:"finish-out"});let s=()=>{let r=t.value.trim(),a=e.value.trim();if(!/^[a-z0-9_]{1,48}$/.test(r)||r.startsWith("jjs_"))return ft(G("dict_invalid")||G("name_hint"),"error");if(a&&!/^[A-Za-z0-9_-]{1,64}$/.test(a))return ft(G("target_invalid")||G("err"),"error");je(o=>{o.title=n.value.slice(0,80),o.notes=i.value.slice(0,4e3),o.dict=r,a?o.targetResource=a:delete o.targetResource}),Fn.innerHTML="",Fn.append(K("div",{class:"stage"},G("test_converting"))),Sn("finalize",[x.name,An(x.doc),r,a]),x.dirty=!1,x.savedAt=Date.now(),Ys()};Tr(G("finish_title"),K("div",{},K("div",{class:"row"},K("label",{},G("name")),n),K("div",{class:"row"},K("label",{},G("target_resource")),e,K("label",{},G("dict_name")),t),K("div",{class:"tg-title"},G("notes")),i,Fn),[K("button",{class:"btn",onclick:Xn},G("close")),K("button",{class:"btn accent",onclick:s},G("convert"))])}function ty(n){Fn&&(Fn.innerHTML="",Fn.append(K("div",{class:"err"},n)))}function ny(n){if(!Fn)return;if(Fn.innerHTML="",!n.ok){for(let t of n.errors||[])Fn.append(K("div",{class:"err"},t.msg));return}let e=K("textarea",{class:"report",readonly:!0},n.report?.text||"");Fn.append(K("div",{class:"tg-title"},G("report")),e,K("div",{class:"row"},K("button",{class:"btn accent",onclick:()=>iy(e)},G("copy")),K("span",{class:"hint"},G("report_files",[n.report?.md,n.report?.json,n.report?.ycd].filter(Boolean).join(", ")))))}function iy(n){n.removeAttribute("readonly"),n.select();let e=!1;try{e=document.execCommand("copy")}catch{e=!1}n.setAttribute("readonly",""),!e&&navigator.clipboard?navigator.clipboard.writeText(n.value).then(()=>ft(G("copied"),"ok"),()=>ft(G("copy_failed"),"warn")):ft(e?G("copied"):G("copy_failed"),e?"ok":"warn")}function If(n=!1){let e=!1;try{e=localStorage.getItem("jjs_tutorial_done")==="1"}catch{e=!1}if(!n&&(e||x.config.tutorial===!1))return;let t=0,i=()=>{Se("#tutorial").classList.remove("hidden"),Se("#tut-step").textContent=`${t+1} / 5`,Se("#tut-text").textContent=G(`tut${t+1}`),Se("#tut-next").textContent=t===4?G("tutorial_done"):G("tutorial_next")},s=()=>{Se("#tutorial").classList.add("hidden");try{localStorage.setItem("jjs_tutorial_done","1")}catch{}};Se("#tut-next").onclick=()=>{t>=4?s():(t++,i())},Se("#tut-skip").onclick=s,i()}function sy(){Xs(),Mn(),_a(),ga(),Tf(),Rf(),qn(),Ks(),wh(),Ys()}function ry(){Iv(),fi("doc",()=>{Mn(),_a(),Ks(),Ys(),ay()}),fi("time",()=>{wh(),cy()}),fi("selection",()=>{ga(),Ws=!0}),fi("history",Ks),fi("range",()=>{Ks(),ga()}),fi("checks",Rf),Se("#btn-projects").onclick=()=>{Sn("list",[]),$s()},Se("#btn-undo").onclick=Ka,Se("#btn-redo").onclick=$a,Se("#btn-save").onclick=Ar,Se("#btn-test").onclick=jv,Se("#btn-finish").onclick=ey,Se("#btn-help").onclick=()=>If(!0),Se("#btn-close").onclick=Uf;for(let n of document.querySelectorAll("[data-cam]"))n.onclick=()=>yh(n.dataset.cam);Se("#btn-play").onclick=Df,Se("#chk-loop").onchange=n=>je(e=>{e.loop=n.target.checked}),Se("#speed").oninput=n=>{x.speed=+n.target.value,Se("#speed-out").textContent=`${jt(x.speed,1)}\xD7`},Se("#chk-onion").onchange=n=>{x.onion=n.target.checked},Se("#chk-allrows").onchange=n=>Mh.setShowAll(n.target.checked),Se("#chk-fingers").onchange=Xs,Se("#partner-model").onchange=n=>{je(e=>{e.actors.b.model=n.target.value}),Lf()},Se("#duration").onchange=n=>{let e=Math.max(.2,Math.min(30,+n.target.value||2));je(t=>{t.duration=+e.toFixed(3);let i=s=>{for(let r of s||[])r.t=Math.min(r.t,t.duration)};for(let s of Object.values(t.tracks)){i(s.mover),i(s.root),i(s.look);for(let r of Object.values(s.bones||{}))i(r);for(let r of Object.values(s.ik||{}))i(r);for(let r of Object.values(s.fingers||{}))i(r);for(let r of Object.values(s.feet?.lock||{}))for(let a of r)a[0]=Math.min(a[0],t.duration),a[1]=Math.min(a[1],t.duration);for(let[r,a]of Object.entries(s.bones||{}))s.bones[r]=oy(a)}for(let s of t.contacts||[])s.t[0]=Math.min(s.t[0],t.duration),s.t[1]=Math.min(s.t[1],t.duration);for(let s of t.events||[])s.t=Math.min(s.t,t.duration)}),mn(Math.min(x.t,e))};for(let n of document.querySelectorAll("[data-ease]"))n.onclick=()=>{if(!x.selKeys.length)return ft(G("none_selected"),"warn",1500);je(e=>{for(let t of x.selKeys)xu(e,t.actor,t.group,t.t,n.dataset.ease)})};Se("#btn-key-del").onclick=kf,Se("#btn-event").onclick=async()=>{let n=await fa(G("event_name"),"impact",G("name_hint"));if(n){if(!/^[a-z0-9_]{1,24}$/.test(n))return ft(G("name_hint"),"error");je(e=>bu(e,n,x.t))}},window.addEventListener("keydown",ly),setInterval(()=>{x.dirty&&!x.test&&Ar()},Math.max(10,x.config.autosave||30)*1e3)}var oy=n=>{let e=new Set;return n.filter(t=>{let i=Math.round(t.t*1e3);return e.has(i)?!1:(e.add(i),!0)})},xf=0,vf=0;function ay(){clearTimeout(xf),xf=setTimeout(Xs,120)}function cy(){clearTimeout(vf),vf=setTimeout(()=>{Mn(),_a()},60)}function Df(){x.doc&&(!x.playing&&x.t>=x.doc.duration-.001&&!x.doc.loop&&(x.t=0),x.playing=!x.playing,Ks())}function yh(n){if(!x.doc)return Oe.setPreset(n);let t=Tn(x.t)[x.actor],i=Ct(x.actor),s=t.world.P[i.idx("SKEL_Spine2")];if(n==="focus"){let r=x.selBone||(x.selHandle?cn[x.selHandle.name]:null);return Oe.focusOn(r&&i.has(r)?t.world.P[i.idx(r)]:s,1.1)}Oe.setPreset(n,s)}function kf(){if(x.selKeys.length){je(n=>{for(let e of x.selKeys)gu(n,e.actor,e.group,e.t)}),Ht({selKeys:[]});return}if(x.selEvent!=null){je(n=>wu(n,x.selEvent)),Ht({selEvent:null});return}if(x.selContact!=null){je(n=>Va(n,x.selContact)),Ht({selContact:null});return}if(x.selLock){let n=x.selLock;je(e=>Au(e,n.actor,n.side,n.index)),Ht({selLock:null})}}async function Uf(){await Sh(G("confirm_close"))&&(x.dirty&&Ar(),setTimeout(()=>qt("close"),x.dirty?300:0))}function ly(n){if(n.key==="Escape"){if(n.preventDefault(),!Se("#tutorial").classList.contains("hidden")){Se("#tut-skip").click();return}if(gh()){x.doc&&Xn();return}Uf();return}if(gh()||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)||!x.doc)return;let e=n.key.toLowerCase();if(n.ctrlKey&&e==="z"){n.preventDefault(),Ka();return}if(n.ctrlKey&&(e==="y"||n.shiftKey&&e==="z")){n.preventDefault(),$a();return}if(n.ctrlKey&&e==="s"){n.preventDefault(),Ar();return}if(n.ctrlKey&&e==="c"){x.selKeys.length?x.clipboardKeys=x.selKeys.flatMap(t=>vu(x.doc,t.actor,t.group,t.t).map(i=>({...i,dt:t.t-x.selKeys[0].t}))):Ef();return}if(n.ctrlKey&&e==="v"){x.clipboardKeys?.length?je(t=>{for(let i of x.clipboardKeys)yu(t,[i],x.t+i.dt)}):Af();return}if(e===" "){n.preventDefault(),Df();return}if(e==="delete"||e==="backspace"){kf();return}if(e==="m"){wf();return}if(e==="o"){x.onion=!x.onion,Se("#chk-onion").checked=x.onion;return}if(e==="l"){x.limitsOn=!x.limitsOn,Mn();return}if(e==="f"){yh("focus");return}if(["1","2","3","4"].includes(e)){yh(["front","side","top","shoulder"][+e-1]);return}if(e==="arrowleft"||e==="arrowright"){let t=e==="arrowright"?1:-1;if(n.shiftKey){let i=nr(x.doc,x.actor,null),s=t>0?i.find(r=>r>x.t+.001):i.filter(r=>r<x.t-.001).pop();s!=null&&mn(s)}else mn(Ut(x.t+t/ln));n.preventDefault()}}wr||window.addEventListener("DOMContentLoaded",()=>{let n=window.JJS_MOCK||{};n.autoOpen!==!1&&da({type:"open",data:{locale:"de",frame:{x:0,y:0,z:0,heading:0},config:{autosave:30,undo:150,duration:2,tutorial:n.tutorial??!0,partners:[{model:"mp_m_freemode_01",label:"Mann (Freemode)"},{model:"mp_f_freemode_01",label:"Frau (Freemode)"},{model:"u_m_y_zombie_01",label:"Zombie"}],camera:{Fov:45,MinDistance:.4,MaxDistance:12,UpdatesPerSecond:30}},server:{projects:[],skeletons:n.skeletons||{},poses:{},watch:{alive:!0}}}})});window.JJS_STUDIO={S:x,solveAt:Tn,runChecks:Yr,serialize:()=>An(x.doc),setTime:mn,select:Er,view:()=>Oe,handleList:()=>bh(Tn(x.t)),groupOf:Oa};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
