window.Symbol===void 0?window.Symbol=(function(){let g=1,A=function(t){return"$__"+t+"_"+g+++"__$"};return A._sym_registry={},A.for=function(t){return t in A._sym_registry||(A._sym_registry[t]=A(t)),A._sym_registry[t]},A.keyFor=function(t){for(let i in A._sym_registry)if(A._sym_registry[i]===t)return i},A.iterator=A.for("iterator"),A.keystr=A.for("keystr"),A})():Symbol.keystr=Symbol("keystr");window.list=function(A){let t=[];if(typeof A=="string"&&(A=new String),Symbol.iterator in A)for(let i of A)t.push(i);else A.forEach(function(i){t.push(i)},this);return t};var Pi=function(g){this.array=g,this.i=0,this.ret={done:!1,value:void 0}};Pi.prototype[Symbol.iterator]=function(){return this};Pi.prototype.next=function(){let g=this.ret;return this.i>=this.array.length?(g.done=!0,g.value=void 0,g):(g.value=this.array[this.i++],g)};Math.sign===void 0&&(Math.sign=function(A){return+(A>0)*2-1});Math.fract===void 0&&(Math.fract=function(A){return A-Math.floor(A)});Math.tent===void 0&&(Math.tent=function(A){return 1-Math.abs(Math.fract(A)-.5)*2});window.time_ms=function(){return window.performance.now()};Array.prototype.clone===void 0&&(Array.prototype.clone=function(){return this.slice(0)});Array.prototype.pop_i===void 0&&(Array.prototype.pop_i=function(g){if(g<0||g>=this.length)throw new Error("Index out of range");for(;g<this.length;)this[g]=this[g+1],g++;this.length-=1});Array.prototype.remove===void 0&&(Array.prototype.remove=function(g,A){let t=this.indexOf(g);if(t<0){if(A)console.trace("Warning: item not in array",g);else throw new Error("Error: item not in array "+g);return}this.pop_i(t)});String.prototype.contains===void 0&&(String.prototype.contains=function(g){return this.search(g)>=0});String.prototype[Symbol.keystr]=function(){return this};Number.prototype[Symbol.keystr]=Boolean.prototype[Symbol.keystr]=function(){return""+this};window.tm=0;function Be(){return window.performance?window.performance.now():new Date().getMilliseconds()}var nA=class g extends Array{constructor(A,t){super(),this.cur=0;for(let i=0;i<t;i++)this.push(A())}static fromConstructor(A,t){let i=function(){return new A};return new g(i,t)}next(){let A=this[this.cur];return this.cur=(this.cur+1)%this.length,A}};var je=class g{constructor(){this._cur=1}next(){return this._cur++}max_cur(A){this._cur=Math.max(this._cur,A+1)}toJSON(){return{_cur:this._cur}}static fromJSON(A){let t=new g;return t._cur=A._cur,t}};function hn(g){if(g===void 0)try{throw new Error}catch(A){g=A}return g.stack.split(`
`)}function nt(g){let A;try{A=hn(g)}catch{console.log("Could not fetch call stack.");return}console.log("Callstack:");for(let t=0;t<A.length;t++)console.log(A[t])}function Bi(g,A){let t=location.origin+"/"+g,i=new XMLHttpRequest;return A&&(i.responseType="arraybuffer"),new Promise(function(n,o){i.open("GET",t),i.onreadystatechange=function(r){i.status===200&&i.readyState===4?n(i.response):i.status>=400&&o(i.statusText)},i.send()})}function Ht(g){return~~((1<<30)-1&~~g)}var se=class{constructor(A){this.index=624,this.mt=new Uint32Array(624),this.seed(A)}save(){let A=new Uint32Array(this.mt.length);for(let t=0;t<A.length;t++)A[t]=this.mt[t];return{index:this.index,mt:A}}load(A){return this.mt=A.mt,this.index=A.index,this}seed(A){this.index=624,this.mt.fill(0,0,this.mt.length),this.mt[0]=A;for(let t=1;t<624;t++)this.mt[t]=Ht(1812433253*(this.mt[t-1]^this.mt[t-1]>>30)+t)}extract_number(){this.index>=624&&this.twist();let A=this.mt[this.index];return A=A^A>>11,A=A^A<<7&2636928640,A=A^A<<15&4022730752,A=A^A>>18,this.index=this.index+1,Ht(A)}random(){return this.extract_number()/(1<<30)}twist(){for(let A=0;A<624;A++){let t=Ht((this.mt[A]&2147483648)+(this.mt[(A+1)%624]&2147483647));this.mt[A]=this.mt[(A+397)%624]^t>>1,t%2!==0&&(this.mt[A]=this.mt[A]^2567483615)}this.index=0}},rt=new se(0);function Ae(){return rt.extract_number()/(1<<30)}var ee=function(A){rt.seed(A)},Di=[];ee.push=function(g){Di.push(rt.save())};ee.pop=function(){rt.load(Di.pop())};window.blue_mask_file=`data:image/png;base64,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
KXemgTv0gJTkwwikcFHSTy/0SLwvqx7FYl3B7TmIiH/l8R/DeA1WYsx2UlSlPtxY66hIa3DGJ3Z7QAkBjkFjDRkt5a2cJv3SBLfbr
T4amltMV4SjTrVwrHya6238CISH3LQ/cdJPDeBx80BhJ40Jqyfkri/A0Md7jmG1uYMpLZGodX4unGxLaHH2TVXRfpTJJ7loOuzSWz
ogKdGfrGx7yfx0hnSpeXTzQFoJ24Bvw2JE0ZSSvilvh+Jnw3mfgmJDzSk5bck7pbA/1kST6+Y2xKP30KfY+KceldhfUW7B4lfV+h6
sQN4EIkfVSAKlSVdAK1LJ8XuMF5O4r0Br7Ev4qdJPNNRJkMZLe3xFLHFqynjpln8/yBx64GeSrsb6W5MEuIuoTM8PtaUytc8Q4e1P
u9K4neBPSd3AKmUxVynFYkwtDBhgUTt+IUOTxL7NXJCvWzm5Iz6WnUxvUlq3U2lb+s535Pei0isLbSVfgc7uyNAWHQxJ6BcRpynYH
tcC71v4J9J3EFoICn5tYzhaKGzDud5JNar5LvD4x2Zl+P3XBLrO9BckqmbA2i9le8YyUWPlRhtnY2VS2qSho9a7zBiR5qSPLx/1z7
VShuGtDo2ePNfg6+mstYDSfy4wlGYHUApXDQmkF1IHF5BbEnIx5PY1oA/THn1rGVQornV7/uQ2N8giyE9LSLPavkNy3NZQ9d7Olp1
Tv42iUdWyr9WVt34d5F4dYYOswPwIK7DMUcj8+KtBR7NJVBu/jHOrNKejS3kZMUpbW5qsdudSBw5A6fQyaYPeFrsAHJfz1YlnK1K+
hGJB40oyFj8wstIvK+Shtwrg+ZCRyJHiWF75MVLaAlh7k/ipzfI0rKwenyeeSBDGmN5HjE+W5RLkxaxtR4jmu0AamP6a26/1ydx7m
BxhkEprbf40mcmy2KZ05hYOfU50dfREjq1hZK0VJLjmSQ2rvwAdXNUOYDPkHiGAxElZku/z6F0VonGlr//h8TNZqCH3FfI2+l6xa3
UXjLmErMkuMOaiv9N4n+cdflwEt9N4KxyAC2NemrcpeKTwxbguai8no/9SezjrNhWMoolz1i3mDkaw1LVKViP+gNespryKdir4cvw
gnKRA6i9Sc0JN3x+8+4W5KHYWIqwB14JDmkF37AX4KokrhA4lFxY8MUk1hLgkPCxNMFoSmoN+T6JxFYzkKemW3N0BzDFgjiMxK4C4
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`.replace(/\n|\r/g,"");var Ce=2,te=3,ie=4,ZA=5,fe=6,oe=7,de=8,Qe=9,Re=10,Oe=11,Mt=12,mA=13,ke=14,O=15,hi=.6,pA={DIFFUSION:0,PATTERN:1,CMYK:2},Te=new Array(64);Te[0]=[];var DA={},IA=DA;DA.defaultConfig={DIMEN:235,HIGH_QUALITY_RASTER:!1,ANISOTROPY:!1,ANIS_W1:.6,ANIS_W2:.6,HIST_EQUALIZE:!0,DEBAND_IMAGE:!0,DEBAND_RADIUS:15,DEBAND_BLEND:1,DRAW_STICKS:!1,FANCY_STICKS:!1,STICK_ARROWS:!1,STICK_ROT:0,STICK_WIDTH:2,STICK_LENGTH:2,FILTERWID:3,ANISOTROPY_FILTERWID:2,RELAX_UPDATE_VECTORS:!1,SHOW_RAW_IMAGE:!1,SHOW_IMAGE:!1,SHOW_DVIMAGE:!1,SPECIAL_OFFSETS:!0,XLARGE_MASK:!1,SMALL_MASK:!1,SCALE_POINTS:!1,SHOW_KDTREE:!1,DRAW_RMUL:1.3,BLACK_BG:!1,SCALE:1,PANX:0,PANY:0,ACCUM_ALPHA:.3,MAKE_NOISE:!1,RELAX_SPEED:1,SHARPNESS:.5,SHARPEN_LUMINENCE:!0,SHARPEN:!0,USE_LAB:!0,RASTER_IMAGE:!1,USE_MERSENNE:!1,TRI_MODE:!1,MAX_VCELL_SIZE:32,RASTER_MODE:pA.CMYK,USE_CMYK_MASK:!1,USE_SPH_CURVE:!1,SPH_CURVE:void 0,TONE_CURVE:void 0,DENSITY_CURVE:void 0,LOW_RES_CUBE:!0,GRID_MODE:!1,DRAW_TRANSPARENT:!1,STEPS:5e3,RAND_FAC:0,DITHER_RAND_FAC:0,DITHER_BLUE:!0,DITHER_BLUE_STEPS:6,BG_PALETTE:!1,SIMPLE_PALETTE:!1,ALLOW_PURPLE:!0,ALLOW_GREY:!1,CORRECT_FOR_SPACING:!1,HEXAGON_MODE:!1,ADAPTIVE_COLOR_DENSITY:!0,NO_IMAGE_FILTER:!1,RENDERED_IMAGE_SIZE:1024,DITHER_COLORS:!0,PAL_COLORS:8,SHOW_COLORS:!0,IMAGE_PALETTE:!1,COLOR_SPACE:0};DA.DefaultCurves={TONE_CURVE:void 0,DENSITY_CURVE:void 0};DA.toJSON=function(){let g={};for(let A in DA.defaultConfig){let t=A;g[t]=c[t]}return g};DA.loadJSON=function(g){let A=c;for(let t in g)A[t]=g[t];return DA};var un={COLOR_SPACE:0,SHOW_RAW_IMAGE:!1,DIMEN:550,IMAGE_PALETTE:!1,ANISOTROPY:!0,ANIS_W1:.7,ANIS_W2:.9,DEBAND_IMAGE:!1,DRAW_STICKS:!0,STICK_ROT:0,STICK_WIDTH:3.5,STICK_LENGTH:1.5,FILTERWID:2,DEBAND_RADIUS:5,DEBAND_BLEND:1,ANISOTROPY_FILTERWID:2,RELAX_UPDATE_VECTORS:!1,SHOW_IMAGE:!1,SHOW_DVIMAGE:!1,SPECIAL_OFFSETS:!0,XLARGE_MASK:!1,SMALL_MASK:!1,SCALE_POINTS:!1,SHOW_KDTREE:!1,DRAW_RMUL:1.5,BLACK_BG:!1,SCALE:2,PANX:.22,PANY:.23,ACCUM_ALPHA:.3,MAKE_NOISE:!1,RELAX_SPEED:5.4030000000000005,SHARPNESS:.1,SHARPEN_LUMINENCE:!1,SHARPEN:!1,USE_LAB:!1,RASTER_IMAGE:!1,USE_MERSENNE:!1,TRI_MODE:!1,MAX_VCELL_SIZE:32,RASTER_MODE:0,TONE_CURVE:{is_new_curve:!0,setting_id:"ui2_bn6_More Options_General_Tone CurveTONE_CURVE",generators:[{type:1,points:[{0:0,1:0,eid:24,flag:0,deg:3,tangent:1},{0:.29374999999999996,1:0,eid:176,flag:0,deg:3,tangent:1},{0:.80625,1:1,eid:180,flag:1,deg:3,tangent:1},{0:1,1:1,eid:41,flag:0,deg:3,tangent:1}],deg:6,eidgen:{_cur:181}},{type:2,equation:"x"},{type:4,height:1,offset:1,deviation:.3}],version:.5,active_generator:0},LOW_RES_CUBE:!0,GRID_MODE:!1,DRAW_TRANSPARENT:!1,STEPS:4498,RAND_FAC:0,DITHER_RAND_FAC:.5,DITHER_BLUE:!0,DITHER_BLUE_STEPS:14,BG_PALETTE:!1,SIMPLE_PALETTE:!1,ALLOW_PURPLE:!0,CORRECT_FOR_SPACING:!1,HEXAGON_MODE:!1,ADAPTIVE_COLOR_DENSITY:!0,NO_IMAGE_FILTER:!1,RENDERED_IMAGE_SIZE:2048,DITHER_COLORS:!0,PAL_COLORS:4,SHOW_COLORS:!0},c={...DA.defaultConfig};DA.loadJSON(un);for(let g in DA.defaultConfig){let A=g;c[A]=DA.defaultConfig[A]}Math._random=Math.random;Math.random=function(){return c.USE_MERSENNE?Ae():Math._random()};var Xe=DA._spotfuncs={},zr=DA.bez4=function(A,t,i,n,o){let r=A+(t-A)*o,a=t+(i-t)*o,l=i+(n-i)*o,w=r+(a-r)*o,P=a+(l-a)*o;return w+(P-w)*o},Fr=DA.get_spotfunc=function(A,t,i){let n=A,o=A;Xe.length<=A&&(Xe.length=A+1);let r=A+","+t.toFixed(2);if(Xe[r]!==void 0)return Xe[r];i||console.trace("generate search a off of radius",A,"...");let a=[];for(let l=-o;l<=o;l++)for(let w=-o;w<=o;w++){let P=l<0?l+0:l,B=w<0?w+0:w,D=P*P+B*B;D=D!==0?Math.sqrt(D):0;let v=Math.max(Math.abs(P),Math.abs(B))*Math.sqrt(2),h=t;h=h<.4?1:0,A>1&&(D=D*(1-h)+v*h),!(D>n+1e-4)&&a.push([l,w])}return a.sort(function(l,w){return l[0]*l[0]+l[1]*l[1]-w[0]*w[0]-w[1]*w[1]}),Xe[r]=a,a},cn=DA.get_searchoff=function(A,t){let i=A,n=A;if(Te.length<=A&&(Te.length=A+1),Te[A]!==void 0)return Te[A];t||console.trace("generate search a off of radius",A,"...");let o=[];for(let r=-n;r<=n;r++)for(let a=-n;a<=n;a++){let l=r,w=a;l*l+w*w>i*i||o.push([r,a])}return o.sort(function(r,a){return r[0]*r[0]+r[1]*r[1]-a[0]*a[0]-a[1]*a[1]}),Te[A]=o,o};for(let g=0;g<32;g++)cn(g,!0);var yr=DA.spline=function(){let A=arguments[arguments.length-1];for(let t=arguments.length-3;t>=0;t-=2)if(A>=arguments[t]){let i=arguments[t],n=arguments[t<arguments.length-3?t+2:t],o=arguments[t+1],r=arguments[t<arguments.length-3?t+3:t+1];return A-=i,n!==i&&(A/=n-i),o+(r-o)*A}return 0};DA.sharpen_cache=new Array(256);var vi=-1;DA.basic_cache=new Array(256);DA.get_sharpen_filter=function(A,t){if(!c.SHARPEN){if(DA.basic_cache[A]!==void 0)return DA.basic_cache[A];let r=[],a=0;for(let l=0;l<A*A;l++){let w=A-1,P=l%A/w,B=~~(l/A)/w;P-=.5,B-=.5;let D=P*P+B*B;D=D===0?0:Math.sqrt(D),D=1-D/Math.sqrt(2),D=Math.pow(D,3),a+=D,r.push(D)}a=1/a;for(let l=0;l<r.length;l++)r[l]*=a;return DA.basic_cache[A]=r,r}if(vi!==t&&(vi=t,DA.sharpen_cache={}),DA.sharpen_cache[A]!==void 0)return DA.sharpen_cache[A];function i(r,a,l,w,P){let B=r+(a-r)*P,D=a+(l-a)*P,v=l+(w-l)*P,h=B+(D-B)*P,u=D+(v-D)*P;return h+(u-h)*P}let n=[],o=A*A;for(let r=0;r<o;r++){let a=A-1,l=r%A/a,w=~~(r/A)/a;l-=.5,w-=.5;let P=l*l+w*w;P=P===0?0:Math.sqrt(P),P=1-2*P/Math.sqrt(2);let B=1.3,D=t;P=i(0,-.75-D*2,(.95+D*2)*B,1,P),n.push(P)}return DA.sharpen_cache[A]=n,n};var De=Math.sin,ve=Math.cos,Ur=Math.abs,Sr=Math.log,Nr=Math.asin,jr=Math.exp,Xr=Math.acos,Rr=Math.fract,Or=Math.sign,Yr=Math.tent,Kr=Math.atan2,Jr=Math.atan,Vr=Math.pow,Cn=Math.sqrt,_r=Math.floor,qr=Math.ceil,Wr=Math.min,Zr=Math.max,$r=Math.PI,As=2.718281828459045,st=Math.sqrt(2),dn=222e-18,ft=1e-11,ui={zero:[[],"0.0;"],negate:[[],"-this[X];"],combine:[["b","u","v"],"this[X]*u + this[X]*v;"],interp:[["b","t"],"this[X] + (b[X] - this[X])*t;"],add:[["b"],"this[X] + b[X];"],addFac:[["b","F"],"this[X] + b[X]*F;"],fract:[[],"Math.fract(this[X]);"],sub:[["b"],"this[X] - b[X];"],mul:[["b"],"this[X] * b[X];"],div:[["b"],"this[X] / b[X];"],mulScalar:[["b"],"this[X] * b;"],divScalar:[["b"],"this[X] / b;"],addScalar:[["b"],"this[X] + b;"],subScalar:[["b"],"this[X] - b;"],ceil:[[],"Math.ceil(this[X])"],floor:[[],"Math.floor(this[X])"],abs:[[],"Math.abs(this[X])"],min:[[],"Math.min(this[X])"],max:[[],"Math.max(this[X])"],clamp:[["MIN","MAX"],"min(max(this[X], MAX), MIN)"]};function Qn(g){return g<=-1?Math.pi:g>=1?0:Math.acos(g)}function at(g){return g<=-1?-Math.pi/2:g>=1?Math.pi/2:Math.asin(g)}var ze=!1,ci=!1,Lt=class{constructor(){this.m11=0;this.m12=0;this.m13=0;this.m14=0;this.m21=0;this.m22=0;this.m23=0;this.m24=0;this.m31=0;this.m32=0;this.m33=0;this.m34=0;this.m41=0;this.m42=0;this.m43=0;this.m44=0}},ot,mn,ae=class g{constructor(A){if(ze?this.$matrix=new WebKitCSSMatrix:this.$matrix=new Lt,this.isPersp=!1,typeof A=="object"){if("length"in A&&A.length>=16){this.load(A);return}else if(A instanceof g){this.load(A);return}}this.makeIdentity()}clone(){return new g(this)}load(...A){if(arguments.length===1&&typeof arguments[0]=="object"){let t;if(arguments[0]instanceof g)return t=arguments[0].$matrix,this.isPersp=arguments[0].isPersp,this.$matrix.m11=t.m11,this.$matrix.m12=t.m12,this.$matrix.m13=t.m13,this.$matrix.m14=t.m14,this.$matrix.m21=t.m21,this.$matrix.m22=t.m22,this.$matrix.m23=t.m23,this.$matrix.m24=t.m24,this.$matrix.m31=t.m31,this.$matrix.m32=t.m32,this.$matrix.m33=t.m33,this.$matrix.m34=t.m34,this.$matrix.m41=t.m41,this.$matrix.m42=t.m42,this.$matrix.m43=t.m43,this.$matrix.m44=t.m44,this;if(t=arguments[0],"length"in t&&t.length>=16)return this.$matrix.m11=t[0],this.$matrix.m12=t[1],this.$matrix.m13=t[2],this.$matrix.m14=t[3],this.$matrix.m21=t[4],this.$matrix.m22=t[5],this.$matrix.m23=t[6],this.$matrix.m24=t[7],this.$matrix.m31=t[8],this.$matrix.m32=t[9],this.$matrix.m33=t[10],this.$matrix.m34=t[11],this.$matrix.m41=t[12],this.$matrix.m42=t[13],this.$matrix.m43=t[14],this.$matrix.m44=t[15],this}return this.makeIdentity(),this}toJSON(){return{isPersp:this.isPersp,items:this.getAsArray()}}static fromJSON(A){let t=new g;return t.load(A.items),t.isPersp=A.isPersp,t}getAsArray(){return[this.$matrix.m11,this.$matrix.m12,this.$matrix.m13,this.$matrix.m14,this.$matrix.m21,this.$matrix.m22,this.$matrix.m23,this.$matrix.m24,this.$matrix.m31,this.$matrix.m32,this.$matrix.m33,this.$matrix.m34,this.$matrix.m41,this.$matrix.m42,this.$matrix.m43,this.$matrix.m44]}getAsFloat32Array(){if(ci){let A=new Float32Array(16);return this.$matrix.copy(A),A}return new Float32Array(this.getAsArray())}setUniform(A,t,i){g.setUniformArray===void 0&&(g.setUniformWebGLArray=new Float32Array(16),g.setUniformArray=new Array(16)),ci?this.$matrix.copy(g.setUniformWebGLArray):(g.setUniformArray[0]=this.$matrix.m11,g.setUniformArray[1]=this.$matrix.m12,g.setUniformArray[2]=this.$matrix.m13,g.setUniformArray[3]=this.$matrix.m14,g.setUniformArray[4]=this.$matrix.m21,g.setUniformArray[5]=this.$matrix.m22,g.setUniformArray[6]=this.$matrix.m23,g.setUniformArray[7]=this.$matrix.m24,g.setUniformArray[8]=this.$matrix.m31,g.setUniformArray[9]=this.$matrix.m32,g.setUniformArray[10]=this.$matrix.m33,g.setUniformArray[11]=this.$matrix.m34,g.setUniformArray[12]=this.$matrix.m41,g.setUniformArray[13]=this.$matrix.m42,g.setUniformArray[14]=this.$matrix.m43,g.setUniformArray[15]=this.$matrix.m44,g.setUniformWebGLArray.set(g.setUniformArray)),A.uniformMatrix4fv(t,i,g.setUniformWebGLArray)}makeIdentity(){this.$matrix.m11=1,this.$matrix.m12=0,this.$matrix.m13=0,this.$matrix.m14=0,this.$matrix.m21=0,this.$matrix.m22=1,this.$matrix.m23=0,this.$matrix.m24=0,this.$matrix.m31=0,this.$matrix.m32=0,this.$matrix.m33=1,this.$matrix.m34=0,this.$matrix.m41=0,this.$matrix.m42=0,this.$matrix.m43=0,this.$matrix.m44=1}transpose(){let A=this.$matrix.m12;this.$matrix.m12=this.$matrix.m21,this.$matrix.m21=A,A=this.$matrix.m13,this.$matrix.m13=this.$matrix.m31,this.$matrix.m31=A,A=this.$matrix.m14,this.$matrix.m14=this.$matrix.m41,this.$matrix.m41=A,A=this.$matrix.m23,this.$matrix.m23=this.$matrix.m32,this.$matrix.m32=A,A=this.$matrix.m24,this.$matrix.m24=this.$matrix.m42,this.$matrix.m42=A,A=this.$matrix.m34,this.$matrix.m34=this.$matrix.m43,this.$matrix.m43=A}invert(){if(ze){this.$matrix=this.$matrix.inverse();return}let A=this._determinant4x4();if(Math.abs(A)<1e-8)return null;this._makeAdjoint(),this.$matrix.m11/=A,this.$matrix.m12/=A,this.$matrix.m13/=A,this.$matrix.m14/=A,this.$matrix.m21/=A,this.$matrix.m22/=A,this.$matrix.m23/=A,this.$matrix.m24/=A,this.$matrix.m31/=A,this.$matrix.m32/=A,this.$matrix.m33/=A,this.$matrix.m34/=A,this.$matrix.m41/=A,this.$matrix.m42/=A,this.$matrix.m43/=A,this.$matrix.m44/=A}translate(A,t,i){if(typeof A=="object"&&"length"in A){let o=A;A=o[0],t=o[1],i=o[2]}else A===void 0&&(A=0),t===void 0&&(t=0),i===void 0&&(i=0);if(ze){this.$matrix=this.$matrix.translate(A,t,i);return}let n=new g;n.$matrix.m41=A,n.$matrix.m42=t,n.$matrix.m43=i,this.multiply(n)}scale(A,t,i){if(typeof A=="object"&&"length"in A){let o=A;A=o[0],t=o[1],i=o[2]}else A===void 0&&(A=1),i===void 0?t===void 0?(t=A,i=A):i=1:t===void 0&&(t=A);if(ze){this.$matrix=this.$matrix.scale(A,t,i);return}let n=new g;n.$matrix.m11=A,n.$matrix.m22=t,n.$matrix.m33=i,this.multiply(n)}euler_rotate(A,t,i,n){n===void 0?n="xyz":n=n.toLowerCase();let o=new g,r=o.$matrix,a=Math.cos(A),l=Math.sin(A);r.m22=a,r.m23=l,r.m32=-l,r.m33=a;let w=new g;a=Math.cos(t),l=Math.sin(t),r=w.$matrix,r.m11=a,r.m13=l,r.m31=-l,r.m33=a,w.multiply(o);let P=new g;a=Math.cos(i),l=Math.sin(i),r=P.$matrix,r.m11=a,r.m12=-l,r.m21=l,r.m22=a,P.multiply(w),this.preMultiply(P)}toString(){let A="",t=this.$matrix;function i(n){let o=n.toFixed(3);return o[0]!=="-"&&(o=" "+o),o}return A=i(t.m11)+", "+i(t.m12)+", "+i(t.m13)+", "+i(t.m14)+`
`,A+=i(t.m21)+", "+i(t.m22)+", "+i(t.m23)+", "+i(t.m24)+`
`,A+=i(t.m31)+", "+i(t.m32)+", "+i(t.m33)+", "+i(t.m34)+`
`,A+=i(t.m41)+", "+i(t.m42)+", "+i(t.m43)+", "+i(t.m44)+`
`,A}rotate(A,t,i,n){if(typeof t=="object"&&"length"in t){let v=t;t=v[0],i=v[1],n=v[2]}else if(arguments.length===1)t=0,i=0,n=1;else if(arguments.length===3){this.rotate(A,1,0,0),this.rotate(t,0,1,0),this.rotate(i,0,0,1);return}let o=t,r=i,a=n;if(ze){this.$matrix=this.$matrix.rotateAxisAngle(o,r,a,A);return}A/=2;let l=Math.sin(A),w=Math.cos(A),P=l*l,B=Math.sqrt(o*o+r*r+a*a);B===0?(o=0,r=0,a=1):B!==1&&(o/=B,r/=B,a/=B);let D=new g;if(o===1&&r===0&&a===0)D.$matrix.m11=1,D.$matrix.m12=0,D.$matrix.m13=0,D.$matrix.m21=0,D.$matrix.m22=1-2*P,D.$matrix.m23=2*l*w,D.$matrix.m31=0,D.$matrix.m32=-2*l*w,D.$matrix.m33=1-2*P,D.$matrix.m14=D.$matrix.m24=D.$matrix.m34=0,D.$matrix.m41=D.$matrix.m42=D.$matrix.m43=0,D.$matrix.m44=1;else if(o===0&&r===1&&a===0)D.$matrix.m11=1-2*P,D.$matrix.m12=0,D.$matrix.m13=-2*l*w,D.$matrix.m21=0,D.$matrix.m22=1,D.$matrix.m23=0,D.$matrix.m31=2*l*w,D.$matrix.m32=0,D.$matrix.m33=1-2*P,D.$matrix.m14=D.$matrix.m24=D.$matrix.m34=0,D.$matrix.m41=D.$matrix.m42=D.$matrix.m43=0,D.$matrix.m44=1;else if(o===0&&r===0&&a===1)D.$matrix.m11=1-2*P,D.$matrix.m12=2*l*w,D.$matrix.m13=0,D.$matrix.m21=-2*l*w,D.$matrix.m22=1-2*P,D.$matrix.m23=0,D.$matrix.m31=0,D.$matrix.m32=0,D.$matrix.m33=1,D.$matrix.m14=D.$matrix.m24=D.$matrix.m34=0,D.$matrix.m41=D.$matrix.m42=D.$matrix.m43=0,D.$matrix.m44=1;else{let v=o*o,h=r*r,u=a*a;D.$matrix.m11=1-2*(h+u)*P,D.$matrix.m12=2*(o*r*P+a*l*w),D.$matrix.m13=2*(o*a*P-r*l*w),D.$matrix.m21=2*(r*o*P-a*l*w),D.$matrix.m22=1-2*(u+v)*P,D.$matrix.m23=2*(r*a*P+o*l*w),D.$matrix.m31=2*(a*o*P+r*l*w),D.$matrix.m32=2*(a*r*P-o*l*w),D.$matrix.m33=1-2*(v+h)*P,D.$matrix.m14=D.$matrix.m24=D.$matrix.m34=0,D.$matrix.m41=D.$matrix.m42=D.$matrix.m43=0,D.$matrix.m44=1}this.multiply(D)}preMultiply(A){let t=new g;t.multiply(this),t.multiply(A),this.load(t)}multiply(A){if(ze){this.$matrix=this.$matrix.multiply(A.$matrix);return}let t=A.$matrix.m11*this.$matrix.m11+A.$matrix.m12*this.$matrix.m21+A.$matrix.m13*this.$matrix.m31+A.$matrix.m14*this.$matrix.m41,i=A.$matrix.m11*this.$matrix.m12+A.$matrix.m12*this.$matrix.m22+A.$matrix.m13*this.$matrix.m32+A.$matrix.m14*this.$matrix.m42,n=A.$matrix.m11*this.$matrix.m13+A.$matrix.m12*this.$matrix.m23+A.$matrix.m13*this.$matrix.m33+A.$matrix.m14*this.$matrix.m43,o=A.$matrix.m11*this.$matrix.m14+A.$matrix.m12*this.$matrix.m24+A.$matrix.m13*this.$matrix.m34+A.$matrix.m14*this.$matrix.m44,r=A.$matrix.m21*this.$matrix.m11+A.$matrix.m22*this.$matrix.m21+A.$matrix.m23*this.$matrix.m31+A.$matrix.m24*this.$matrix.m41,a=A.$matrix.m21*this.$matrix.m12+A.$matrix.m22*this.$matrix.m22+A.$matrix.m23*this.$matrix.m32+A.$matrix.m24*this.$matrix.m42,l=A.$matrix.m21*this.$matrix.m13+A.$matrix.m22*this.$matrix.m23+A.$matrix.m23*this.$matrix.m33+A.$matrix.m24*this.$matrix.m43,w=A.$matrix.m21*this.$matrix.m14+A.$matrix.m22*this.$matrix.m24+A.$matrix.m23*this.$matrix.m34+A.$matrix.m24*this.$matrix.m44,P=A.$matrix.m31*this.$matrix.m11+A.$matrix.m32*this.$matrix.m21+A.$matrix.m33*this.$matrix.m31+A.$matrix.m34*this.$matrix.m41,B=A.$matrix.m31*this.$matrix.m12+A.$matrix.m32*this.$matrix.m22+A.$matrix.m33*this.$matrix.m32+A.$matrix.m34*this.$matrix.m42,D=A.$matrix.m31*this.$matrix.m13+A.$matrix.m32*this.$matrix.m23+A.$matrix.m33*this.$matrix.m33+A.$matrix.m34*this.$matrix.m43,v=A.$matrix.m31*this.$matrix.m14+A.$matrix.m32*this.$matrix.m24+A.$matrix.m33*this.$matrix.m34+A.$matrix.m34*this.$matrix.m44,h=A.$matrix.m41*this.$matrix.m11+A.$matrix.m42*this.$matrix.m21+A.$matrix.m43*this.$matrix.m31+A.$matrix.m44*this.$matrix.m41,u=A.$matrix.m41*this.$matrix.m12+A.$matrix.m42*this.$matrix.m22+A.$matrix.m43*this.$matrix.m32+A.$matrix.m44*this.$matrix.m42,m=A.$matrix.m41*this.$matrix.m13+A.$matrix.m42*this.$matrix.m23+A.$matrix.m43*this.$matrix.m33+A.$matrix.m44*this.$matrix.m43,Q=A.$matrix.m41*this.$matrix.m14+A.$matrix.m42*this.$matrix.m24+A.$matrix.m43*this.$matrix.m34+A.$matrix.m44*this.$matrix.m44;this.$matrix.m11=t,this.$matrix.m12=i,this.$matrix.m13=n,this.$matrix.m14=o,this.$matrix.m21=r,this.$matrix.m22=a,this.$matrix.m23=l,this.$matrix.m24=w,this.$matrix.m31=P,this.$matrix.m32=B,this.$matrix.m33=D,this.$matrix.m34=v,this.$matrix.m41=h,this.$matrix.m42=u,this.$matrix.m43=m,this.$matrix.m44=Q}divide(A){this.$matrix.m11/=A,this.$matrix.m12/=A,this.$matrix.m13/=A,this.$matrix.m14/=A,this.$matrix.m21/=A,this.$matrix.m22/=A,this.$matrix.m23/=A,this.$matrix.m24/=A,this.$matrix.m31/=A,this.$matrix.m32/=A,this.$matrix.m33/=A,this.$matrix.m34/=A,this.$matrix.m41/=A,this.$matrix.m42/=A,this.$matrix.m43/=A,this.$matrix.m44/=A}ortho(A,t,i,n,o,r){let a=(A+t)/(A-t),l=(n+i)/(n-i),w=(r+o)/(r-o),P=new g;P.$matrix.m11=2/(A-t),P.$matrix.m12=0,P.$matrix.m13=0,P.$matrix.m14=0,P.$matrix.m21=0,P.$matrix.m22=2/(n-i),P.$matrix.m23=0,P.$matrix.m24=0,P.$matrix.m31=0,P.$matrix.m32=0,P.$matrix.m33=-2/(r-o),P.$matrix.m34=0,P.$matrix.m41=a,P.$matrix.m42=l,P.$matrix.m43=w,P.$matrix.m44=1,this.multiply(P)}frustum(A,t,i,n,o,r){let a=new g,l=(t+A)/(t-A),w=(n+i)/(n-i),P=-(r+o)/(r-o),B=-(2*r*o)/(r-o);a.$matrix.m11=2*o/(t-A),a.$matrix.m12=0,a.$matrix.m13=0,a.$matrix.m14=0,a.$matrix.m21=0,a.$matrix.m22=2*o/(n-i),a.$matrix.m23=0,a.$matrix.m24=0,a.$matrix.m31=l,a.$matrix.m32=w,a.$matrix.m33=P,a.$matrix.m34=-1,a.$matrix.m41=0,a.$matrix.m42=0,a.$matrix.m43=B,a.$matrix.m44=0,this.isPersp=!0,this.multiply(a)}perspective(A,t,i,n){let o=Math.tan(A*Math.PI/360)*i,r=-o,a=t*r,l=t*o;this.frustum(a,l,r,o,i,n)}lookat(A,t,i){let n=new g,o=ot.next().load(A).sub(t),r=o.vectorLength();o.normalize();let a=o,l=ot.next().load(i).normalize(),w=ot.next().load(l).cross(a).normalize();n.$matrix.m11=w[0],n.$matrix.m12=l[0],n.$matrix.m13=a[0],n.$matrix.m14=0,n.$matrix.m21=w[1],n.$matrix.m22=l[1],n.$matrix.m23=a[1],n.$matrix.m24=0,n.$matrix.m31=w[2],n.$matrix.m32=l[2],n.$matrix.m33=a[2],n.translate(-A[0],-A[1],-A[2]),this.multiply(n)}makeRotationOnly(){let A=this.$matrix;return A.m41=A.m42=A.m43=0,A.m44=1,this}decompose(A,t,i,n,o){if(this.$matrix.m44===0)return!1;let r=A===void 0||!("length"in A)?new W:A,a=t===void 0||!("length"in t)?new W:t,l=i===void 0||!("length"in i)?new W:i,w=n===void 0||!("length"in n)?new W:n,P=o===void 0||!("length"in o)?new Array(4):o,B=new g(this);B.divide(B.$matrix.m44);let D=new g(B);if(D.$matrix.m14=0,D.$matrix.m24=0,D.$matrix.m34=0,D.$matrix.m44=1,D._determinant4x4()===0)return!1;if(B.$matrix.m14!==0||B.$matrix.m24!==0||B.$matrix.m34!==0){let I=[B.$matrix.m14,B.$matrix.m24,B.$matrix.m34,B.$matrix.m44],d=new g(D);d.invert();let F=new g(d);F.transpose();let p=new W(I);p.multVecMatrix(F),P[0]=p[0],P[1]=p[1],P[2]=p[2],P[3]=p[3],B.$matrix.m14=B.$matrix.m24=B.$matrix.m34=0,B.$matrix.m44=1}else P[0]=P[1]=P[2]=0,P[3]=1;r[0]=B.$matrix.m41,B.$matrix.m41=0,r[1]=B.$matrix.m42,B.$matrix.m42=0,r[2]=B.$matrix.m43,B.$matrix.m43=0;let v=new W([B.$matrix.m11,B.$matrix.m12,B.$matrix.m13]),h=new W([B.$matrix.m21,B.$matrix.m22,B.$matrix.m23]),u=new W([B.$matrix.m31,B.$matrix.m32,B.$matrix.m33]);l[0]=v.vectorLength(),v.divide(l[0]),w[0]=v.dot(h),h.combine(v,1,-w[0]),l[1]=h.vectorLength(),h.divide(l[1]),w[0]/=l[1],w[1]=h.dot(u),u.combine(v,1,-w[1]),w[2]=h.dot(u),u.combine(h,1,-w[2]),l[2]=u.vectorLength(),u.divide(l[2]),w[1]/=l[2],w[2]/=l[2];let m=new W(h);if(m.cross(u),v.dot(m)<0)for(let I=0;I<3;I++)l[I]*=-1,row[0][I]*=-1,row[1][I]*=-1,row[2][I]*=-1;a[1]=Math.asin(-v[2]),Math.cos(a[1])!==0?(a[0]=Math.atan2(h[2],u[2]),a[2]=Math.atan2(v[1],v[0])):(a[0]=Math.atan2(-u[0],h[1]),a[2]=0);let Q=180/Math.PI;return a[0]*=Q,a[1]*=Q,a[2]*=Q,!0}_determinant2x2(A,t,i,n){return A*n-t*i}_determinant3x3(A,t,i,n,o,r,a,l,w){return A*this._determinant2x2(o,r,l,w)-n*this._determinant2x2(t,i,l,w)+a*this._determinant2x2(t,i,o,r)}_determinant4x4(){let A=this.$matrix.m11,t=this.$matrix.m12,i=this.$matrix.m13,n=this.$matrix.m14,o=this.$matrix.m21,r=this.$matrix.m22,a=this.$matrix.m23,l=this.$matrix.m24,w=this.$matrix.m31,P=this.$matrix.m32,B=this.$matrix.m33,D=this.$matrix.m34,v=this.$matrix.m41,h=this.$matrix.m42,u=this.$matrix.m43,m=this.$matrix.m44;return A*this._determinant3x3(r,P,h,a,B,u,l,D,m)-t*this._determinant3x3(o,w,v,a,B,u,l,D,m)+i*this._determinant3x3(o,w,v,r,P,h,l,D,m)-n*this._determinant3x3(o,w,v,r,P,h,a,B,u)}_makeAdjoint(){let A=this.$matrix.m11,t=this.$matrix.m12,i=this.$matrix.m13,n=this.$matrix.m14,o=this.$matrix.m21,r=this.$matrix.m22,a=this.$matrix.m23,l=this.$matrix.m24,w=this.$matrix.m31,P=this.$matrix.m32,B=this.$matrix.m33,D=this.$matrix.m34,v=this.$matrix.m41,h=this.$matrix.m42,u=this.$matrix.m43,m=this.$matrix.m44;this.$matrix.m11=this._determinant3x3(r,P,h,a,B,u,l,D,m),this.$matrix.m21=-this._determinant3x3(o,w,v,a,B,u,l,D,m),this.$matrix.m31=this._determinant3x3(o,w,v,r,P,h,l,D,m),this.$matrix.m41=-this._determinant3x3(o,w,v,r,P,h,a,B,u),this.$matrix.m12=-this._determinant3x3(t,P,h,i,B,u,n,D,m),this.$matrix.m22=this._determinant3x3(A,w,v,i,B,u,n,D,m),this.$matrix.m32=-this._determinant3x3(A,w,v,t,P,h,n,D,m),this.$matrix.m42=this._determinant3x3(A,w,v,t,P,h,i,B,u),this.$matrix.m13=this._determinant3x3(t,r,h,i,a,u,n,l,m),this.$matrix.m23=-this._determinant3x3(A,o,v,i,a,u,n,l,m),this.$matrix.m33=this._determinant3x3(A,o,v,t,r,h,n,l,m),this.$matrix.m43=-this._determinant3x3(A,o,v,t,r,h,i,a,u),this.$matrix.m14=-this._determinant3x3(t,r,P,i,a,B,n,l,D),this.$matrix.m24=this._determinant3x3(A,o,w,i,a,B,n,l,D),this.$matrix.m34=-this._determinant3x3(A,o,w,t,r,P,n,l,D),this.$matrix.m44=this._determinant3x3(A,o,w,t,r,P,i,a,B)}};function En(g){let A=g.prototype.dot;g.prototype._dot=A,g.prototype.dot=function(t){let i=A.call(this,t);return i>=1-ft&&i<=1+ft?1:i>=-1-ft&&i<=-1+ft?-1:i}}var he=class extends Array{constructor(){super()}load(g){throw new Error("Implement me!")}init_swizzle(g){let A={},i=(g===4?me:g===3?W:YA).prototype;for(let n in i){let o=i[n];typeof o!="function"&&!(o instanceof Function)||(A[n]=o.bind(this))}return A}vectorLength(){return Cn(this.dot(this))}normalize(){let g=this.vectorLength();return g>1e-8&&this.mulScalar(1/g),this}static inherit(cls,vectorsize){En(cls);var f;let vectorDotDistance=`f = function vectorDistance(b) {
`;for(let g=0;g<vectorsize;g++)vectorDotDistance+="let d"+g+" = this["+g+"]-b["+g+`];
`;vectorDotDistance+="return (";for(let g=0;g<vectorsize;g++)g>0&&(vectorDotDistance+=" + "),vectorDotDistance+="d"+g+"*d"+g;vectorDotDistance+=`);
`,vectorDotDistance+="};",cls.prototype.vectorDotDistance=eval(vectorDotDistance);let vectorDistance=`f = function vectorDistance(b) {
`;for(let g=0;g<vectorsize;g++)vectorDistance+="let d"+g+" = this["+g+"]-b["+g+`];
`;vectorDistance+="return sqrt(";for(let g=0;g<vectorsize;g++)g>0&&(vectorDistance+=" + "),vectorDistance+="d"+g+"*d"+g;vectorDistance+=`);
`,vectorDistance+="};",cls.prototype.vectorDistance=eval(vectorDistance);let proto=cls.prototype;for(let k in ui){let func=ui[k],args=func[0],line=func[1];var f;let code="f = function "+k+"(";for(let g=0;g<args.length;g++)g>0&&(code+=", "),line=line.replace(args[g],args[g].toLowerCase()),code+=args[g].toLowerCase();code+=`) {
`;for(let g=0;g<vectorsize;g++){let A=line.replace(/X/g,""+g);code+="    this["+g+"] = "+A+`
`}code+="return this;",code+=`}
`,f=eval(code),proto[k]=f}}},me=class g extends he{constructor(A){if(super(),arguments.length>1)throw new Error("unexpected argument");this.length=4,this[0]=this[1]=this[2]=this[3]=0,A!==void 0&&this.load(A)}load(A){return A===void 0?this:(this[0]=A[0],this[1]=A[1],this[2]=A[2],this[3]=A[3],this)}dot(A){return this[0]*A[0]+this[1]*A[1]+this[2]*A[2]+this[3]*A[3]}mulVecQuat(A){let t=-this[1]*this[0]-this[2]*this[1]-this[3]*this[2],i=this[0]*this[0]+this[2]*this[2]-this[3]*this[1],n=this[0]*this[1]+this[3]*this[0]-this[1]*this[2];return this[2]=this[0]*this[2]+this[1]*this[1]-this[2]*this[0],this[0]=i,this[1]=n,i=t*-this[1]+this[0]*this[0]-this[1]*this[3]+this[2]*this[2],n=t*-this[2]+this[1]*this[0]-this[2]*this[1]+this[0]*this[3],this[2]=t*-this[3]+this[2]*this[0]-this[0]*this[2]+this[1]*this[1],this[0]=i,this[1]=n,this}multVecMatrix(A){let t=this[0],i=this[1],n=this[2],o=this[3];return this[0]=A.$matrix.m41+t*A.$matrix.m11+i*A.$matrix.m21+n*A.$matrix.m31+o*A.$matrix.m41,this[1]=A.$matrix.m42+t*A.$matrix.m12+i*A.$matrix.m22+n*A.$matrix.m32+o*A.$matrix.m42,this[2]=A.$matrix.m43+t*A.$matrix.m13+i*A.$matrix.m23+n*A.$matrix.m33+o*A.$matrix.m43,this[3]=o*A.$matrix.m44+t*A.$matrix.m14+i*A.$matrix.m24+n*A.$matrix.m34,o}cross(A){let t=this[1]*A[2]-this[2]*A[1],i=this[2]*A[0]-this[0]*A[2],n=this[0]*A[1]-this[1]*A[0];return this[0]=t,this[1]=i,this[2]=n,this}preNormalizedAngle(A){if(this.dot(A)<0){let t=new g;return t[0]=-A[0],t[1]=-A[1],t[2]=-A[2],t[3]=-A[3],Math.pi-2*at(t.vectorDistance(this)/2)}else return 2*at(A.vectorDistance(this)/2)}},bn,In,xn,Hn,W=class g extends he{constructor(A){if(super(),arguments.length>1)throw new Error("unexpected argument");this.length=3,this[0]=this[1]=this[2]=0,A!==void 0&&this.load(A)}initVector3(){return this.length=3,this[0]=this[1]=this[2]=0,this}load(A){return A===void 0?this:(this[0]=A[0],this[1]=A[1],this[2]=A[2],this)}dot(A){return this[0]*A[0]+this[1]*A[1]+this[2]*A[2]}normalizedDot(A){return $_v3nd_n1_normalizedDot.load(this),$_v3nd_n2_normalizedDot.load(A),$_v3nd_n1_normalizedDot.normalize(),$_v3nd_n2_normalizedDot.normalize(),$_v3nd_n1_normalizedDot.dot($_v3nd_n2_normalizedDot)}static normalizedDot4(A,t,i,n){return $_v3nd4_n1_normalizedDot4.load(t).sub(A).normalize(),$_v3nd4_n2_normalizedDot4.load(n).sub(i).normalize(),$_v3nd4_n1_normalizedDot4.dot($_v3nd4_n2_normalizedDot4)}multVecMatrix(A,t){t===void 0&&(t=!1);let i=this[0],n=this[1],o=this[2];this[0]=A.$matrix.m41+i*A.$matrix.m11+n*A.$matrix.m21+o*A.$matrix.m31,this[1]=A.$matrix.m42+i*A.$matrix.m12+n*A.$matrix.m22+o*A.$matrix.m32,this[2]=A.$matrix.m43+i*A.$matrix.m13+n*A.$matrix.m23+o*A.$matrix.m33;let r=A.$matrix.m44+i*A.$matrix.m14+n*A.$matrix.m24+o*A.$matrix.m34;return!t&&r!==1&&r!==0&&A.isPersp&&(this[0]/=r,this[1]/=r,this[2]/=r),r}cross(A){let t=this[1]*A[2]-this[2]*A[1],i=this[2]*A[0]-this[0]*A[2],n=this[0]*A[1]-this[1]*A[0];return this[0]=t,this[1]=i,this[2]=n,this}rot2d(A,t){let i=this[0],n=this[1];return t===1?(this[0]=i*ve(A)+n*De(A),this[1]=n*ve(A)-i*De(A)):(this[0]=i*ve(A)-n*De(A),this[1]=n*ve(A)+i*De(A)),this}preNormalizedAngle(A){if(this.dot(A)<0){let t=new g;return t[0]=-A[0],t[1]=-A[1],t[2]=-A[2],Math.pi-2*at(t.vectorDistance(this)/2)}else return 2*at(A.vectorDistance(this)/2)}},YA=class extends he{constructor(A){if(super(),arguments.length>1)throw new Error("unexpected argument");this.length=2,this[0]=this[1]=this[2]=0,A!==void 0&&this.load(A)}load(A){return A===void 0?this:(this[0]=A[0],this[1]=A[1],this)}rot2d(A,t){let i=this[0],n=this[1];return t===1?(this[0]=i*ve(A)+n*De(A),this[1]=n*ve(A)-i*De(A)):(this[0]=i*ve(A)-n*De(A),this[1]=n*ve(A)+i*De(A)),this}dot(A){return this[0]*A[0]+this[1]*A[1]+this[2]*A[2]}mulVecQuat(A){let t=-this[1]*this[0]-this[2]*this[1]-this[3]*this[2],i=this[0]*this[0]+this[2]*this[2]-this[3]*this[1],n=this[0]*this[1]+this[3]*this[0]-this[1]*this[2];return this[2]=this[0]*this[2]+this[1]*this[1]-this[2]*this[0],this[0]=i,this[1]=n,i=t*-this[1]+this[0]*this[0]-this[1]*this[3]+this[2]*this[2],n=t*-this[2]+this[1]*this[0]-this[2]*this[1]+this[0]*this[3],this[2]=t*-this[3]+this[2]*this[0]-this[0]*this[2]+this[1]*this[1],this[0]=i,this[1]=n,this}multVecMatrix(A){let t=this[0],i=this[1];return this[0]=A.$matrix.m41+t*A.$matrix.m11+i*A.$matrix.m21+A.$matrix.m41,this[1]=A.$matrix.m42+t*A.$matrix.m12+i*A.$matrix.m22+A.$matrix.m42,A.$matrix.m44+t*A.$matrix.m14+i*A.$matrix.m24}},pt=class g extends me{makeUnitQuat(){this[0]=1,this[1]=this[2]=this[3]=0}isZero(){return this[0]===0&&this[1]===0&&this[2]===0&&this[3]===0}mulQuat(A){let t=this[0]*A[0]-this[1]*A[1]-this[2]*A[2]-this[3]*A[3],i=this[0]*A[1]+this[1]*A[0]+this[2]*A[3]-this[3]*A[2],n=this[0]*A[2]+this[2]*A[0]+this[3]*A[1]-this[1]*A[3];this[3]=this[0]*A[3]+this[3]*A[0]+this[1]*A[2]-this[2]*A[1],this[0]=t,this[1]=i,this[2]=n}conjugate(){this[1]=-this[1],this[2]=-this[2],this[3]=-this[3]}dotWithQuat(A){return this[0]*A[0]+this[1]*A[1]+this[2]*A[2]+this[3]*A[3]}invert(){let A=this.dot(this);A!==0&&(conjugate_qt(q),this.mulscalar(1/A))}sub(A){let t=new g;t[0]=-A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],this.mul(t)}mulScalarWithFactor(A){let t=A*Qn(this[0]),i=Math.cos(t),n=Math.sin(t);this[0]=i;let o=W([this[1],this[2],this[3]]);return o.normalize(),o.mulScalar(n),this[1]=o[0],this[2]=o[1],this[3]=o[2],this}toMatrix(A){A===void 0&&(A=new ae);let t=st*this[0],i=st*this[1],n=st*this[2],o=st*this[3],r=t*i,a=t*n,l=t*o,w=i*i,P=i*n,B=i*o,D=n*n,v=n*o,h=o*o;return A.$matrix.m11=1-D-h,A.$matrix.m12=l+P,A.$matrix.m13=-a+B,A.$matrix.m14=0,A.$matrix.m21=-l+P,A.$matrix.m22=1-w-h,A.$matrix.m23=r+v,A.$matrix.m24=0,A.$matrix.m31=a+B,A.$matrix.m32=-r+v,A.$matrix.m33=1-w-D,A.$matrix.m34=0,A.$matrix.m41=A.$matrix.m42=A.$matrix.m43=0,A.$matrix.m44=1,A}matrixToQuat(A){let t=new ae(A);t.$matrix.m41=t.$matrix.m42=t.$matrix.m43=0,t.$matrix.m44=1;let i=new W([t.$matrix.m11,t.$matrix.m12,t.$matrix.m13]),n=new W([t.$matrix.m21,t.$matrix.m22,t.$matrix.m23]),o=new W([t.$matrix.m31,t.$matrix.m32,t.$matrix.m33]);i.normalize(),n.normalize(),o.normalize(),t.$matrix.m11=i[0],t.$matrix.m12=i[1],t.$matrix.m13=i[2],t.$matrix.m21=n[0],t.$matrix.m22=n[1],t.$matrix.m23=n[2],t.$matrix.m31=o[0],t.$matrix.m32=o[1],t.$matrix.m33=o[2];let r=.25*(1+t.$matrix.m11+t.$matrix.m22+t.$matrix.m33),a=0;r>dn?(a=Math.sqrt(r),this[0]=a,a=1/(4*a),this[1]=(t.$matrix.m23-t.$matrix.m32)*a,this[2]=(t.$matrix.m31-t.$matrix.m13)*a,this[3]=(t.$matrix.m12-t.$matrix.m21)*a):t.$matrix.m11>t.$matrix.m22&&t.$matrix.m11>t.$matrix.m33?(a=2*Math.sqrt(1+t.$matrix.m11-t.$matrix.m22-t.$matrix.m33),this[1]=.25*a,a=1/a,this[0]=(t.$matrix.m32-t.$matrix.m23)*a,this[2]=(t.$matrix.m21+t.$matrix.m12)*a,this[3]=(t.$matrix.m31+t.$matrix.m13)*a):t.$matrix.m22>t.$matrix.m33?(a=2*Math.sqrt(1+t.$matrix.m22-t.$matrix.m11-t.$matrix.m33),this[2]=.25*a,a=1/a,this[0]=(t.$matrix.m31-t.$matrix.m13)*a,this[1]=(t.$matrix.m21+t.$matrix.m12)*a,this[3]=(t.$matrix.m32+t.$matrix.m23)*a):(a=2*Math.sqrt(1+t.$matrix.m33-t.$matrix.m11-t.$matrix.m22),this[3]=.25*a,a=1/a,this[0]=(t.$matrix.m21-t.$matrix.m12)*a,this[1]=(t.$matrix.m31+t.$matrix.m13)*a,this[2]=(t.$matrix.m32+t.$matrix.m23)*a),this.normalize()}normalize(){let A=Math.sqrt(this.dot(this));return A!==0?this.mulScalar(1/A):(this[1]=1,this[0]=this[2]=this[3]=0),this}axisAngleToQuat(A,t){let i=new W(A);if(i.normalize()!==0){let n=t/2,o=Math.sin(n);this[0]=Math.cos(n),this[1]=i[0]*o,this[2]=i[1]*o,this[3]=i[2]*o}else this.makeUnitQuat()}rotationBetweenVecs(A,t){let i=new W(A),n=new W(t);i.normalize(),n.normalize();let o=new W(i);o.cross(n);let r=i.preNormalizedAngle(n);this.axisAngleToQuat(o,r)}quatInterp(A,t){let i=new g,n=this[0]*A[0]+this[1]*A[1]+this[2]*A[2]+this[3]*A[3];n<0?(n=-n,i[0]=-this[0],i[1]=-this[1],i[2]=-this[2],i[3]=-this[3]):(i[0]=this[0],i[1]=this[1],i[2]=this[2],i[3]=this[3]);let o,r,a,l;return 1-n>1e-4?(o=Math.acos(n),r=Math.sin(o),a=Math.sin((1-t)*o)/r,l=Math.sin(t*o)/r):(a=1-t,l=t),this[0]=a*i[0]+l*A[0],this[1]=a*i[1]+l*A[1],this[2]=a*i[2]+l*A[2],this[3]=a*i[3]+l*A[3],this}};xn=new W;Hn=new W;bn=new W;In=new W;he.inherit(me,4);he.inherit(W,3);he.inherit(YA,2);ot=nA.fromConstructor(W,64);mn=nA.fromConstructor(me,64);var N=[],Ie={XYZ:0,LAB:1,RGB:2};function bi(){return c.RASTER_IMAGE&&c.RASTER_MODE===pA.DIFFUSION?0:c.DITHER_RAND_FAC}var zt=class extends Array{constructor(A=1024*32){super();let t=new se(0);for(let i=0;i<A;i++)this.push(t.random());this.cur=0}seed(A){for(A=~~A;A<0;)A+=this.length;return this.cur=A%this.length,this}random(){let A=this[this.cur];return this.cur=(this.cur+1)%this.length,A}},Je=new zt,di=new nA(()=>[0,0,0],64);function Gt(g,A,t){let i=0,n=0,o=0;if(g==null||A==null||t==null||isNaN(g)||isNaN(A)||isNaN(t))throw new Error("Please enter numeric RGB values!");let r=Math.min(g,Math.min(A,t)),a=Math.max(g,Math.max(A,t));if(r==a){o=r;let B=di.next();return B[0]=0,B[1]=0,B[2]=o,B}let l=g==r?A-t:t==r?g-A:t-g;i=60*((g==r?3:t==r?1:5)-l/(a-r))/360,n=(a-r)/a,o=a;let P=di.next();return P[0]=i,P[1]=n,P[2]=o,P}var Mn=new nA(()=>[0,0,0],64);function Ii(g,A,t){let i=0,n=0,o=0,r=Mn.next();r[0]=r[1]=r[2]=0,g*=360,i=t*A,o=i*(1-Math.abs(g/60%2-1)),n=t-i;let a;function l(w,P,B){return r[0]=w,r[1]=P,r[2]=B,r}return g>=0&&g<60?a=l(i+n,o+n,n):g>=60&&g<120?a=l(o+n,i+n,n):g>=120&&g<180?a=l(n,i+n,o+n):g>=180&&g<240?a=l(n,o+n,i+n):g>=240&&g<300?a=l(o+n,n,i+n):g>=300&&g<360?a=l(i+n,n,o+n):a=l(n,n,n),a}var xi=void 0,Ft=void 0,Hi=void 0,Ln=nA.fromConstructor(W,512),pn=nA.fromConstructor(W,512),Tn=nA.fromConstructor(W,512),kn=nA.fromConstructor(W,512),zn=nA.fromConstructor(W,512),rs=nA.fromConstructor(W,512),ss=nA.fromConstructor(W,512),fs=nA.fromConstructor(W,512),Fn=nA.fromConstructor(W,512);function yn(g,A,t){return Mi(g,A,t)[0]}function Gn(g,A,t){let i=(g+A+t)/3,n=Math.abs(g-i),o=Math.abs(A-i),r=Math.abs(t-i);return(n+o+r)/3}function lt(g,A,t){let i=g,n=A,o=t;i>.04045?i=Math.pow((i+.055)/1.055,2.4):i=i/12.92,n>.04045?n=Math.pow((n+.055)/1.055,2.4):n=n/12.92,o>.04045?o=Math.pow((o+.055)/1.055,2.4):o=o/12.92;let r=i*.4124+n*.3576+o*.1805,a=i*.2126+n*.7152+o*.0722,l=i*.0193+n*.1192+o*.9505,w=Ln.next();return w[0]=r,w[1]=a,w[2]=l,w}var os=1/95.047;var as=1/108.08883;function gt(g,A,t){let i=g,n=A,o=t,r=i*3.240625+n*-1.53720797+o*-.498628,a=i*-.9689307+n*1.87575606+o*.04151752,l=i*.0557101+n*-.204021+o*1.05699;r>.003130807?r=1.055*Math.pow(r,1/2.4)-.055:r=12.92*r,a>.003130807?a=1.055*Math.pow(a,1/2.4)-.055:a=12.92*a,l>.003130807?l=1.055*Math.pow(l,1/2.4)-.055:l=12.92*l;let w=pn.next();return w[0]=r,w[1]=a,w[2]=l,w}function Un(g,A,t){g*=100,A*=100,t*=100;let i=(g+16)/116,n=A/500+i,o=i-t/200,r=n*n*n,a=i*i*i,l=o*o*o;a>.008856?i=a:i=(i-16/116)/7.787,r>.008856?n=r:n=(n-16/116)/7.787,l>.008856?o=l:o=(o-16/116)/7.787;let w=.95047*n,P=i,B=1.08883*o,D=kn.next();return D[0]=w,D[1]=P,D[2]=B,D}function Mi(g,A,t){let i=g/.95047,n=A,o=t/1.08883;i>.008856?i=Math.cbrt(i):i=7.787*i+16/116,n>.008856?n=Math.cbrt(n):n=7.787*n+16/116,o>.008856?o=Math.cbrt(o):o=7.787*o+16/116;let r=Tn.next(),a=1.16*n-.016,l=5*(i-n),w=2*(n-o);return r[0]=a,r[1]=l,r[2]=w,r}function Sn(g,A){let t=Math.abs(g[0]-A[0]),i=Math.abs(g[1]-A[1]),n=Math.abs(g[2]-A[2]);return Math.sqrt(t*t+i*i+n*n)/3**.5}function yt(g,A,t){g*=100,A*=100,t*=100;let i=Math.atan2(t,A);i>0?i=i/Math.PI*180:i=360-Math.abs(i)/Math.PI*180;let n=Math.sqrt(A*A+t*t),o=i,r=zn.next();return r[0]=g*.01,r[1]=n*.01,r[2]=o*.01,r}function Ve(g,A,t){let i=lt(g,A,t);return Mi(i[0],i[1],i[2])}function Ut(g,A,t){let i=Un(g,A,t);return gt(i[0],i[1],i[2])}function Nn(g,A,t){return g}function jn(g,A,t){return yt(g,A,t)[1]}function St(g,A,t){let i=Fn.next(),n=1-g,o=1-A,r=1-t,a=1;n<a&&(a=n),o<a&&(a=o),r<a&&(a=r),a===1?(n=0,o=0,r=0):(n=(n-a)/(1-a),o=(o-a)/(1-a),r=(r-a)/(1-a));let l=a;return i[0]=n,i[1]=o,i[2]=r,i[3]=l,i}function Fe(g){g===void 0&&(g=c.LOW_RES_CUBE?20:40),console.warn("generating color map of dim",""+g+"...");let A=new Int32Array(g*g*g),t=new Int32Array(g*g*g);xi=A,Ft=g,Hi=t;let i=[0,0,0],n=[0];for(let o=0;o<g;o++)for(let r=0;r<g;r++)for(let a=0;a<g;a++){let l=a*g*g+r*g+o,w=o/(g-1),P=r/(g-1),B=a/(g-1);i[0]=w,i[1]=P,i[2]=B,A[l]=ue(i,n),t[l]=n[0]}return console.log("done generating color map"),A}function ge(g,A,t=0,i=0,n=0){Ft===void 0&&Fe();let o=Ft,r=xi,a=~~(g[0]*o+.5+t),l=~~(g[1]*o+.5+i),w=~~(g[2]*o+.5+n);a=Math.min(Math.max(a,0),o-1),l=Math.min(Math.max(l,0),o-1),w=Math.min(Math.max(w,0),o-1);let P=w*o*o+l*o+a;return A!==void 0&&(A[0]=Hi[P]),r[P]}var Tt,Ke=new Array,Qi=[],mi=new se(0);function Xn(g=c.PAL_COLORS*24){N.length=0,mi.seed(0);let A=_appstate.image.data,t=A.fdata,i=512+~~(A.width*A.height*.1),n=1/255,o=new Map;for(let r=0;r<i;r++){let a=~~(mi.random()*A.width*A.height*.9999);a*=4;let l=t[a],w=t[a+1],P=t[a+2],B=l*n,D=w*n,v=P*n,h=~~(l*32*32*32+w*32*32+P*32),u=o.get(h);if(!(u===void 0&&N.length>=g))if(u===void 0)o.set(h,N.length),N.push([l,w,P,1]);else{let m=N[u];m[0]+=l,m[1]+=w,m[2]+=P,m[3]+=1}}for(let r=0;r<N.length;r++){let a=N[r];a[3]=1/(a[3]*255);for(let l=0;l<3;l++)N[r][l]*=a[3];N[r].length=3}}function _e(){Qi.length=0,c.IMAGE_PALETTE&&_appstate.image&&_appstate.image.data.fdata?Xn():Rn();for(let g=0;g<N.length;g++){let A=N[g];A=VA(A[0],A[1],A[2]);let t=Ve(A[0],A[1],A[2]);Qi.push([t[0],t[1],t[2]])}}function Rn(){if(N.length=0,(c.TRI_MODE||c.RASTER_MODE===pA.PATTERN||c.RASTER_MODE===pA.DIFFUSION)&&N.push([1,1,1]),c.BG_PALETTE){N.push([0,0,0]),Fe();return}if(c.SIMPLE_PALETTE){N.push([0,0,0]),N.push([1,0,0]),N.push([0,1,0]),N.push([0,0,1]),c.ALLOW_PURPLE&&N.push([1,0,1]),Fe();return}let g=c.PAL_COLORS;{let i=g*10,n=new se(0);for(let o=0;o<i;o++){let r=n.random(),a=n.random(),l=n.random();N.push([r,a,l])}}for(let i=0;i<g;i++){let n=[0,.7,(i+1)/g];N.push(n)}for(let i=0;i<g*2;i++){let n=[0,0,(i+1)/(g*2)];N.push(n)}let A=c.ALLOW_PURPLE?g:0;for(let i=0;i<A;i++){let n=[(i+1)/A,0,(i+1)/A];N.push(n)}for(let i=0;i<A;i++){let n=[(i+1)/A,0,1];N.push(n)}for(let i=0;i<g;i++){let n=[(i+1)/g,0,0];N.push(n)}for(let i=0;i<g;i++){let n=[(i+1)/g,.4,.25];N.push(n)}if(c.ALLOW_GREY)for(let i=0;i<g;i++){let n=[i/g,i/g,i/g];N.push(n)}for(let i=0;i<g;i++){let n=[(i+1)/g,(i+1)/g,0];N.push(n)}for(let i=0;i<g;i++){let n=[.7,(i+1)/g,0];N.push(n)}for(let i=0;i<g;i++){let n=[(i+1)/g,.7,0];N.push(n)}for(let i=0;i<g;i++){let n=(i+1)/g,o=new W([.5,.35,.25*(1-n)]),r=new W(o);o.interp([1,1,1],n),N.push(o)}for(let i=0;i<g;i++){let n=[0,(g==1?.68:1)*(i+1)/g,0];N.push(n)}for(let i=0;i<g;i++){let n=[0,(i+1)/g,(i+1)/g];N.push(n)}for(let i=0;i<N.length;i++){let n=N[i],o=xe(n[0],n[1],n[2]);n[0]=o[0],n[1]=o[1],n[2]=o[2]}let t=""+c.PAL_COLORS+","+c.ALLOW_PURPLE+","+(c.RASTER_MODE==pA.PATTERN);(Tt===void 0||Tt!==t)&&Fe(),Tt=t,Ke.length=N.length;for(let i=0;i<N.length;i++)Ke[i]=0}var kt=Math.pow(25,7);function On(g){return g>0?Math.sqrt(g):0}function Yn(g,A){{let Y=Math.abs(g[0]-A[0]),eA=Math.abs(g[1]-A[1]),J=Math.abs(g[2]-A[2]);return Math.sqrt(Y**2+eA**2+J**2)/3**.5}let t=Math.pow,i=Math.cos,n=Math.sin,o=Math.atan2,r=Math.abs,a=Math.exp,l=On,w=g,P=A,B=yt(g[0],g[1],g[2]),D=yt(A[0],A[1],A[2]);B.mulScalar(100),D.mulScalar(100);let v=1,h=1,u=1,m=B[0]-D[0],Q=(B[0]+D[0])*.5,I=(B[1]+D[1])*.5,d=t(I,7),F=w[1]+.5*w[1]*(1-l(d/(d+kt))),p=P[1]+.5*P[1]*(1-l(d/(d+kt))),H=l(B[1]*B[1]+B[2]*B[2]),b=l(D[1]*D[1]+D[2]*D[2]),L=(H+b)*.5,M=(o(w[1],w[0])/Math.PI+1)*180,T=(o(P[1],P[0])/Math.PI+1)*180,G=b-H,S,j=r(M);j<180?S=T-M:j>180&&M<T?S=T-M+360:S=T-M-360;let Z=2*l(H*b)*n(Math.PI*(S*.5)/180),R;j>180?R=(M+T+360)*.5:R=(M+T)*.5,(H===0||b===0)&&(R*=M+T);let U=1-.17*i(Math.PI*(R-30)/180);U+=.24*i(Math.PI*(2*R)/180),U+=.32*i(Math.PI*(3*R+6)/180),U+=-.2*i(Math.PI*(4*R-63)/180);let _=1+.015*(Q-50)*(Q-50)/l(20+(Q-50)*(Q-50)),fA=1+.045*I,vA=1+.015*I*U,hA=-2*l(d/(d+kt));hA*=n(Math.PI*(60*a(-(R-275)/25))/180);let sA=m/(v*_),$=G/(h*fA),C=Z/(u*vA),z=hA*(G/(h*fA))*(Z/(u*vA));return l(sA*sA+$*$+C*C+z)/360}function Nt(g,A){return le(g,A)}function Li(g,A){return le(g,A)}function Kn(g,A){let t=1,i=.8,n=.6;t=i=n=1;let o=1/(t+i+n),r=Math.abs(g[0]-A[0])*t*o,a=Math.abs(g[1]-A[1])*i*o,l=Math.abs(g[2]-A[2])*n*o;return r+a+l}var ls=new nA(function(){return[0,0,0]},256);var Ti=[0,0,0],Ee=new Array,be=new Array;function ue(g,A,t,i){let n,o,r,a,l,w,P,B,D,v;t=t===void 0?0:t;let h=t,u=-1,m=1e17;Ee.length=N.length,be.length=N.length;let Q;for(let d=0;d<N.length;d++){let F=N[d],p=i?Nt(g,F):le(g,F);p+=(Je.random()-.5)*bi()*h,p=Math.max(p,0),A!==void 0&&(Ee[d]=d,be[d]=p),(n===void 0||p<n&&p>0)&&(n=p,Q=d)}if(A===void 0)return Q;for(let d=0;d<be.length;d++)be[d]<0&&(be.pop_i(d),Ee.pop_i(d),d--);if(Ee.sort((d,F)=>be[d]-be[F]),A){let d=Math.min(A.length,Ee.length);for(let F=0;F<d;F++)A[F]=Ee[F]}return t=Math.max(Math.min(t,.999999),0),Ee[0]}Ti=[0,0,0];var Jn=new nA(function(){return[0,0,0]},32);function Vn(g,A,t,i){let n=A[0],o=A[1],r=A[2],a=t[0],l=t[1],w=t[2],P=i[0],B=i[1],D=i[2],v=g[0],h=g[1],u=g[2],m=((h*P-v*B)*w-(l*P-B*a)*u-(h*a-v*l)*D)/(1e-5+(o*P-B*n)*w-(l*P-B*a)*r-(o*a-l*n)*D),Q=(-((h*P-v*B)*r-(o*P-B*n)*u)+(h*n-v*o)*D)/(1e-5+(o*P-B*n)*w-(l*P-B*a)*r-(o*a-l*n)*D),I=((h*a-v*l)*r-(o*a-l*n)*u-(h*n-v*o)*w)/(1e-5+(o*P-B*n)*w-(l*P-B*a)*r-(o*a-l*n)*D),d=Jn.next();return d[0]=m,d[1]=Q,d[2]=I,d}function ki(g,A,t){let i=0,n=0,o=0,r=Ti,a=0,l=new Array(N.length);l.fill(0,0,l.length),r[0]=g,r[1]=A,r[2]=t;for(let D=0;D<N.length;D++){let v=(D+N.length-1)%N.length,h=D,u=(D+1)%N.length,m=N[v],Q=N[h],I=N[u],d=Vn(r,m,Q,I),p=1/(le(r,Q)+1e-4);l[h]+=p*p*p,a+=p*p*p}for(let D=0;D<N.length;D++);for(let D=0;D<N.length;D++)l[D]/=a;let w=0,P=0,B=0;for(let D=0;D<N.length;D++)w+=N[D][0]*l[D],P+=N[D][1]*l[D],B+=N[D][2]*l[D];return l}function _n(g,A,t){return(g*.4026+A*.405+t*.2022)/(.4026+.405+.2022)}var qn=nA.fromConstructor(W,512),Ei=function(g,A,t){let i=qn.next();return i[0]=g,i[1]=A,i[2]=t,i};function Wn(g,A,t){let i=1,n=.8,o=.7,r=1/(i+n+o);g*=i*r,A*=n*r,t*=o*r;let a=(g+A+t)/3,l=Math.abs(g-a),w=Math.abs(A-a),P=Math.abs(t-a);return(l+w+P)/3}var Zn=0;var xe,VA,Ye,ye,le;function jt(g){switch(Zn=g,g){case Ie.XYZ:xe=lt,VA=gt,Ye=yn,ye=Gn,le=Sn;break;case Ie.LAB:xe=Ve,VA=Ut,Ye=Nn,ye=jn,le=Yn;break;case Ie.RGB:xe=Ei,VA=Ei,Ye=_n,ye=Wn,le=Kn;break}}jt(Ie.XYZ);var Xt=class g{constructor(A){this.wrand=A[2],this.rand=A[3],this.filter=[],this.inten=0;let t=A[1];for(let i=0;i<t.length;i++){let n=[];this.filter.push(n);for(let o=0;o<t[i].length;o++)n.push([t[i][o],0])}this.get_cache=new Array(32);for(let i=0;i<this.get_cache.length;i++){let n=new Array(this.filter.length);for(let o=0;o<n.length;o++)n[o]=new Array(this.filter[o].length);this.get_cache[i]=n}this.get_cache.cur=0}copy(){let A=this.get(0),t=new g([this.inten,A,this.wrand,this.rand]);return t.inten=this.inten,t.rand=this.rand,t.wrand=this.wrand,t}get(A){let t=this.get_cache[this.get_cache.cur];this.get_cache.cur=(this.get_cache.cur+1)%this.get_cache.length;let i=0;for(let n=0;n<t.length;n++)for(let o=0;o<t[n].length;o++){let r=this.filter[n][o][0],a=this.filter[n][o][1];a!==0&&(r+=Math.random()*a),t[n][o]=r,i+=r}i=i!==0?1/i:0;for(let n=0;n<t.length;n++)for(let o=0;o<t[n].length;o++)t[n][o]*=i;return t}};function zi(){let g=[[0,0,0,7,0],[0,3,5,1,0],[0,.75,1.25,.25,0]],A=new Xt([0,g,0,0]);return A.wrand=0,A}var qe=95367431640625e-20;function Ar(g){let A=Number.POSITIVE_INFINITY,t=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY,n=Number.NEGATIVE_INFINITY,o,r,a,l,w,P;for(o=g.length;o--;)g[o][0]<A&&(A=g[o][0]),g[o][0]>i&&(i=g[o][0]),g[o][1]<t&&(t=g[o][1]),g[o][1]>n&&(n=g[o][1]);return r=i-A,a=n-t,l=Math.max(r,a),w=A+r*.5,P=t+a*.5,[[w-20*l,P-l],[w,P+20*l],[w+20*l,P-l]]}function Fi(g,A,t,i){let n=g[A][0],o=g[A][1],r=g[t][0],a=g[t][1],l=g[i][0],w=g[i][1],P=Math.abs(o-a),B=Math.abs(a-w),D,v,h,u,m,Q,I,d,F,p;if(P<qe&&B<qe)throw new Error("Eek! Coincident points!");return P<qe?(u=-((l-r)/(w-a)),Q=(r+l)/2,d=(a+w)/2,D=(r+n)/2,v=u*(D-Q)+d):B<qe?(h=-((r-n)/(a-o)),m=(n+r)/2,I=(o+a)/2,D=(l+r)/2,v=h*(D-m)+I):(h=-((r-n)/(a-o)),u=-((l-r)/(w-a)),m=(n+r)/2,Q=(r+l)/2,I=(o+a)/2,d=(a+w)/2,D=(h*m-u*Q+d-I)/(h-u),v=P>B?h*(D-m)+I:u*(D-Q)+d),F=r-D,p=a-v,{i:A,j:t,k:i,x:D,y:v,r:F*F+p*p}}function er(g){let A,t,i,n,o,r;for(t=g.length;t;)for(n=g[--t],i=g[--t],A=t;A;)if(r=g[--A],o=g[--A],i===o&&n===r||i===r&&n===o){g.splice(t,2),g.splice(A,2);break}}window.Delaunay={triangulate:function(g,A){let t=g.length,i,n,o,r,a,l,w,P,B,D,v,h,u=g;if(t<3)return[];if(u=u.slice(0),A)for(i=t;i--;)u[i]=u[i][A];for(o=new Array(t),i=t;i--;)o[i]=i;for(o.sort(function(Q,I){return u[I][0]-u[Q][0]}),r=Ar(u),u.push(r[0],r[1],r[2]),a=[Fi(u,t+0,t+1,t+2)],l=[],w=[],i=o.length;i--;w.length=0){for(h=o[i],n=a.length;n--;){if(P=u[h][0]-a[n].x,P>0&&P*P>a[n].r){l.push(a[n]),a.splice(n,1);continue}B=u[h][1]-a[n].y,!(P*P+B*B-a[n].r>qe)&&(w.push(a[n].i,a[n].j,a[n].j,a[n].k,a[n].k,a[n].i),a.splice(n,1))}for(er(w),n=w.length;n;)v=w[--n],D=w[--n],a.push(Fi(u,D,v,h))}for(i=a.length;i--;)l.push(a[i]);a.length=0;let m=[];for(i=l.length;i--;)l[i].i<t&&l[i].j<t&&l[i].k<t&&m.push(l[i].i,l[i].j,l[i].k);return m},contains:function(g,A){if(A[0]<g[0][0]&&A[0]<g[1][0]&&A[0]<g[2][0]||A[0]>g[0][0]&&A[0]>g[1][0]&&A[0]>g[2][0]||A[1]<g[0][1]&&A[1]<g[1][1]&&A[1]<g[2][1]||A[1]>g[0][1]&&A[1]>g[1][1]&&A[1]>g[2][1])return null;let t=g[1][0]-g[0][0],i=g[2][0]-g[0][0],n=g[1][1]-g[0][1],o=g[2][1]-g[0][1],r=t*o-i*n;if(r===0)return null;let a=(o*(A[0]-g[0][0])-i*(A[1]-g[0][1]))/r,l=(t*(A[1]-g[0][1])-n*(A[0]-g[0][0]))/r;return a<0||l<0||a+l>1?null:[a,l]}};var ht=16,Ui=512,yi=!1,Rt=0,Ot=1,tr=2,Yt=3,Gi=4,ir=5,Pt=6,Bt=7,yA=8,Ge=9,kA=10,Dt=11+ht*4,nr=[0,0],vt=nA.fromConstructor(W,1024),Bs=nA.fromConstructor(W,1024),Ds=nA.fromConstructor(W,1024),rr=new W,vs=new W,sr=new W,fr=new Int32Array(Ui*8),ut=class{constructor(A,t){this.min=new W(A),this.max=new W(t),this.last_warn_time=Be(),this._point_cachering=new nA(()=>({co:new W,id:void 0}),512),this._node_cachering=new nA(()=>({min:new W,max:new W,splitpos:void 0,splitplane:void 0,id:void 0}),512),this._search_cachering=nA.fromConstructor(W,64),this.usednodes=0,this.data=new Float64Array(Dt*32),this.maxdepth=Ui,this.totpoint=0,this.root=this.newNode(A,t)}clear(){return this.usednodes=this.totpoint=0,this.root=this.newNode(this.min,this.max),this}newNode(A,t){let i=this.data.length/Dt;if(this.usednodes>=i){let r=new Float64Array(this.data.length*2),a=this.data,l=a.length;for(let w=0;w<l;w++)r[w]=a[w];this.data=r}let n=this.usednodes*Dt,o=this.data;for(let r=n;r<n+Dt;r++)o[r]=0;return o[n+Rt]=A[0],o[n+Ot]=A[1],o[n+tr]=A[2],o[n+Yt]=t[0],o[n+Gi]=t[1],o[n+ir]=t[2],this.usednodes++,n}insert(A,t,i,n){return n===void 0&&(n=i,i=0),this.insert_intern(A,t,i,n,0)}insert_intern(A,t,i,n,o){let r=(a,l)=>{let w=this.data;if(l>=this.maxdepth){(yi||Be()-this.last_warn_time>500)&&(console.log(l),console.warn("Malformed data: 3 to insert point",l,A.toFixed(4),t.toFixed(4),i.toFixed(4),"id=",n),this.last_warn_time=Be());return}if(w[a+yA]!==0){let P=w[a+Pt],B=w[a+Bt],D=P===0?A:P===1?t:i;if(D===B){let v=Math.random()>.5?1:0;r(w[a+yA+v],l+1)}else D<B?r(w[a+yA],l+1):r(w[a+Ge],l+1)}else if(w[a+kA]>=ht)this.split(a,nr),this.insert_intern(A,t,i,n,l+1);else{let P=a+kA+1+w[a+kA]*4;w[P++]=A,w[P++]=t,w[P++]=i,w[P++]=n,w[a+kA]++}};r(this.root,o+1),this.totpoint++}forEachNode(A,t){let i=this._node_cachering,n=this.data,o=r=>{let a=i.next();for(var l=0;l<3;l++)a.min[l]=n[r+l],a.max[l]=n[r+3+l];a.id=r,a.splitplane=n[r+Pt],a.splitpos=n[r+Bt],t!==void 0?A.call(t,a):A(a),n[r+yA]!==0&&(o(n[r+yA]),o(n[r+Ge]))};o(this.root)}iterAllPoints(A,t){let i=this._point_cachering,n=o=>{let r=this.data;if(r[o+yA]!==0)n(r[o+yA]),n(r[o+Ge]);else{let a=r[o+kA],l=o+kA+1;for(let w=0;w<a;w++){let P=i.next();P.co[0]=r[l++],P.co[1]=r[l++],P.co[2]=r[l++],P.id=r[l++],t!==void 0?A.call(t,P):A(P)}}};n(this.root)}split(A,t){let i=this.data,n=A+kA+1,o=i[A+kA],r,a,l;o===0&&console.warn("TRIED TO SPLIT AN EMPTY NODE!");for(let u=0;u<3;u++){let m=0,Q=1e17,I=-1e17;for(let H=0,b=n;H<o;H++,b+=4)m+=i[b+u],Q=Math.min(i[b+u],Q),I=Math.max(i[b+u],I);if(I-Q<1e-4)continue;m/=o;let d=0;for(let H=0,b=n;H<o;H++,b+=4)d+=i[b+u]<m?-1:1;d=Math.abs(d);let F=0;for(let H=0;H<3;H++)F+=Math.max(i[A+3+H],i[A+H]);let p=(i[A+3+u]-i[A+u])/F;p>0&&p<1&&(p=1/p),d!==o&&p>.001&&(d+=p*7),(r===void 0||d<l)&&(l=d,a=m,r=u)}if(r===void 0){Be()-this.last_warn_time>500&&(console.warn("Failed to split node; points were probably all duplicates of each other"),this.last_warn_time=Be());return}let w=vt.next().zero(),P=vt.next().zero(),B=vt.next().zero(),D=vt.next().zero();for(let u=0;u<3;u++)w[u]=i[A+u],P[u]=i[A+Yt+u];B.load(w),D.load(P),P[r]=a,B[r]=a;let v=this.newNode(w,P),h=this.newNode(B,D);i=this.data,i[A+yA]=v,i[A+Ge]=h,i[A+Bt]=a,i[A+Pt]=r,o=i[A+kA],n=A+kA+1,i[A+kA]=0,t!==void 0&&(t[0]=v,t[1]=h);for(let u=n,m=0;m<o;m++,u+=4)this.insert(i[u],i[u+1],i[u+2],i[u+3])}forEachPoint(A,t,i,n,o){let r=rr;return r[0]=A,r[1]=t,r[2]=0,this.search(r,i,n,o)}search_2(A,t,i,n){let o=0,r=fr,a=this.data,l=sr,w=t*t;for(r[o++]=this.root;o>0&&!(o>this.maxdepth);){let P=r[--o];if(a[P+yA]!==0)for(let B=0;B<2;B++){let D=a[P+yA+B],v=0;for(let h=0;h<3;h++){let u=a[D+h],m=a[D+h+3];v+=A[h]+1.01*t>=u&&A[h]-1.01*t<=m?1:0}v===3&&(r[o++]=D)}else{let B=a[P+kA],D=P+kA+1;for(let v=0;v<B;v++,D+=4){l[0]=a[D],l[1]=a[D+1],l[2]=a[D+2];let h=l[0]-A[0],u=l[1]-A[1],m=A.length>2?l[2]-A[2]:0;if(h*h+u*u+m*m<w){let Q;if(n?Q=i.call(n,a[D+3]):Q=i(a[D+3]),Q)return}}}}}search(A,t,i,n){return this.search_2(A,t,i,n)}draw(A){let t=this.data,i=n=>{if(A.beginPath(),A.rect(t[n+Rt],t[n+Ot],t[n+Yt]-t[n+Rt],t[n+Gi]-t[n+Ot]),A.strokeStyle="orange",A.fillStyle="rgba(255, 150, 50, 0.25)",A.stroke(),t[n+yA]===0){A.fill();let o=.25*(this.max[0]-this.min[0])/Math.sqrt(this.totpoint),r=t[n+kA];A.beginPath();for(let a=0;a<r*4;a+=4){let l=n+kA+1+a,w=t[l],P=t[l+1],B=t[l+2],D=t[l+3];A.moveTo(w,P),A.arc(w,P,o,-Math.PI,Math.PI)}A.fillStyle="rgba(100, 150, 250, 0.5)",A.fill()}t[n+yA]!==0&&(i(t[n+yA]),i(t[n+Ge]))};i(this.root)}balance(){class A extends Array{constructor(w,P){super(),this.min=new W(w),this.max=new W(P),this.bestpos=void 0,this.bestaxis=void 0,this.bestfit=void 0,this.nodes=[void 0,void 0]}}let t=new W,i=new W;for(var n=0;n<3;n++)t[n]=this.data[this.root+n],i[n]=this.data[this.root+3+n];let o=new A(t,i);this.iterAllPoints(l=>{for(var w=0;w<3;w++)o.push(l.co[w]);o.push(l.id)});for(let l=0;l<o.length;l+=4){let w=~~(Math.random()*o.length/4)*4;for(let P=0;P<4;P++){let B=o[l+P];o[l+P]=o[w+P],o[w+P]=B}}this.clear();for(let l=0;l<o.length;l+=4)this.insert(o[l],o[l+1],o[l+2],o[l+3])}};var He={LINEAR:0,LINEAR_NONUNIFORM:1},Kt={FLOAT32:0,UINT16:1},ar=0,lr=1,We=2,gr=0,wr=1,Ue=2,Ze=3,Jt={[He.LINEAR]:We,[He.LINEAR_NONUNIFORM]:Ze},Si=.003,Ni=new nA(()=>[0,0],64),Vt=class extends Array{constructor(){super(),this.buffer=new ArrayBuffer(8),this.u8view=new Uint8Array(this.buffer),this.u16view=new Uint16Array(this.buffer),this.i32view=new Int32Array(this.buffer),this.f32view=new Float32Array(this.buffer),this.f64view=new Float64Array(this.buffer)}int32(A){this.i32view[0]=A;for(let t=0;t<4;t++)this.push(this.u8view[t]);return this}uint16(A){this.u16view[0]=A;for(let t=0;t<2;t++)this.push(this.u8view[t]);return this}byte(A){this.push(A)}float32(A){this.f32view[0]=A;for(let t=0;t<4;t++)this.push(this.u8view[t]);return this}float64(A){this.f64view[0]=A;for(let t=0;t<8;t++)this.push(this.u8view[t]);return this}toString(){let A="";for(let t=0;t<this.length;t++)A+=String.fromCharCode(this[t]);return btoa(A)}},_t=class{constructor(A){this.view=new DataView(A),this.i=0,this.endian=!0,this.version=0}int32(){return this.i+=4,this.view.getInt32(this.i-4,this.endian)}uint16(){return this.i+=2,this.view.getUint16(this.i-2,this.endian)}byte(){return this.i+=1,this.view.getInt8(this.i-1)}float32(){return this.i+=4,this.view.getFloat32(this.i-4,this.endian)}float64(){return this.i+=8,this.view.getFloat64(this.i-8,this.endian)}},ct=class{constructor(A,t,i,n,o,r){this.startx=A,this.starty=t,this.id=i,this.gen=n,this.r=o,this.curvetype=r===void 0?He.LINEAR:r,this.offsets=[],this.fieldlen=Jt[this.curvetype],this.min=0,this.max=0}fromBinary(A){if(A.version>=.003&&(this.startx=A.float32(),this.starty=A.float32()),this.curvetype=A.int32(),this.id=A.int32(),this.gen=A.float64(),this.r=A.float64(),this.fieldlen=Jt[this.curvetype],this.decode16(A),A.version<.003){this.startx=this.starty=0;let t=this.fieldlen,i=this.offsets.length/t;for(let n=0;n<this.offsets.length;n+=t)this.startx+=this.offsets[n],this.starty+=this.offsets[n+1];i>0&&(this.startx/=i,this.starty/=i)}return this}encode16(A){let t=1e17,i=-1e17;for(let n=0;n<this.offsets.length;n++)t=Math.min(t,this.offsets[n]),i=Math.max(i,this.offsets[n]);this.min=t,this.max=i,A.int32(this.offsets.length),A.int32(Kt.UINT16),A.float32(t),A.float32(i);for(let n=0;n<this.offsets.length;n++){let o=this.offsets[n];o=(o-t)/(i-t),o=~~(o*65535),A.uint16(o)}return this}encode32(A){A.int32(this.offsets.length),A.int32(Kt.FLOAT32);for(let t of this.offsets)A.float32(t)}decode16(A){let t=A.int32();if(A.int32()==Kt.FLOAT32){this.offsets.length=0;for(let r=0;r<t;r++)this.offsets.push(A.float32());return}let n=this.min=A.float32(),o=this.max=A.float32();this.offsets.length=0;for(let r=0;r<t;r++){let a=A.uint16()/65535;a=a*(o-n)+n,this.offsets.push(a)}return this}toBinary(A){A.float32(this.startx),A.float32(this.starty),A.int32(this.curvetype),A.int32(this.id),A.float64(this.gen),A.float64(this.r),this.encode16(A)}toJSON(){return{startx:this.startx,starty:this.starty,curvetype:this.curvetype,id:this.id,gen:this.gen,r:this.r,offsets:this.offsets}}loadJSON(A){for(let t in A)this[t]=A[t];return this.fieldlen=Jt[this.curvetype],this}compress(){let A=this.offsets,t=[],i=this.fieldlen;if(this.curvetype==He.LINEAR){for(let n=0;n<i;n++)t.push(A[n]);for(let n=i;n<A.length-i;n+=i*2)for(let o=0;o<i;o++)t.push(A[n+o]*.5+A[n+i+o]*.5);for(let n=0;n<i;n++)t.push(A[A.length-i+n]);this.offsets=t}if(this.curvetype==He.LINEAR_NONUNIFORM){for(let n=0;n<i;n++)t.push(A[n]);for(let n=i;n<A.length-i;n+=i){let o=t[t.length-i],r=t[t.length-i+1],a=A[n],l=A[n+1],w=A[n+i],P=A[n+i+1],B=w-o,D=P-r,v=a-o,h=l-r,u=B*B+D*D,m=v*v+h*h;if(u>1e-6&&(u=Math.sqrt(u),B/=u,D/=u),m>1e-6,!(Math.abs(B*h-D*v)<5e-5&&u>.001))for(let I=0;I<i;I++)t.push(A[n+I])}for(let n=0;n<i;n++)t.push(A[A.length-i+n]);this.offsets=t}}evaluate(A){switch(this.curvetype){case He.LINEAR:return this.evaluate_linear_uniform(A);case He.LINEAR_NONUNIFORM:return this.evaluate_linear_nonuniform(A);default:throw console.log(this),new Error("Bad curvetype "+this.curvetype)}}linear_nonuniform_search(A){let t=this.offsets,i=0,n=.9999999,o=(i+n)*.5;for(let a=0;a<16;a++){o=(i+n)*.5;let l=~~(i*t.length/O)*O,w=~~(o*t.length/O)*O,P=~~(n*t.length/O)*O;t[w+Ue]>A?n=o:i=o}return~~(o*t.length/O)*O}evaluate_linear_nonuniform(A){let t=this.offsets,i=Ni.next();if(t.length==0)return i[0]=i[1]=0,i;let n=this.linear_nonuniform_search(A);if(n>0&&t[n+Ue]>A&&(n-=Ze),n==t.length-Ze||t.length==Ze)return i[0]=t[n],i[1]=t[n+1],i;let o=n+Ze,r=(A-t[n+Ue])/(t[o+Ue]-t[n+Ue]);return i[0]=t[n]+(t[o]-t[n])*r,i[1]=t[n+1]+(t[o+1]-t[n+1])*r,i}evaluate_linear_uniform(A){A=Math.min(Math.max(A,0),.999999999);let t=this.offsets.length/We,i=~~(A*t)*We,n=Ni.next();if(i==0||i==this.offsets.length-We)return n[0]=this.offsets[i],n[1]=this.offsets[i+1],n;let o=i+We,r=i/this.offsets.length,a=(A-r)*t;return n[0]=this.offsets[i]+(this.offsets[o]-this.offsets[i])*a,n[1]=this.offsets[i+1]+(this.offsets[o+1]-this.offsets[i+1])*a,n}},Ct=class{constructor(A){this.blocksize=A,this.points=[],this.inverse_tone_curve=[0,1]}setInverseToneCurve(A){this.inverse_tone_curve=A.slice(0,A.length)}evalInverseTone(A){A=Math.min(Math.max(A,0),.9999999);let t=Math.floor(A*this.inverse_tone_curve.length),i=this.inverse_tone_curve;if(t<i.length-1){let n=t/this.inverse_tone_curve.length;return n=(A-n)*this.inverse_tone_curve.length,i[t]+(i[t+1]-i[t])*n}else return i[t]}fromBinary(A){A=atob(A);let t=new Uint8Array(A.length);for(let r=0;r<A.length;r++)t[r]=A.charCodeAt(r);let i=new _t(t.buffer),n=i.version=i.float64(),o=i.int32();this.blocksize=i.int32(),this.points.length=0;for(let r=0;r<o;r++){let a=new ct;a.fromBinary(i),this.points.push(a)}if(n>.001){let r=i.int32();if(i.int32(),r<=0)return console.warn("Warning: corrupted inverse toning curve data"),this;let a=this.inverse_tone_curve=[];for(let l=0;l<r;l++){let w=i.uint16()/65535;a.push(w)}}return this}toBinary(){let A=new Vt;A.float64(Si),A.int32(this.points.length),A.int32(this.blocksize);for(let i of this.points)i.toBinary(A);let t=this.inverse_tone_curve;A.int32(t.length),A.int32(0);for(let i=0;i<t.length;i++){let n=~~(Math.min(Math.max(t[i],0),1)*65535);A.uint16(n)}return A}loadJSON(A){this.points=A.points,this.blocksize=A.blocksize;for(let t=0;t<this.points;t++){let i=new ct;i.loadJSON(A),this.points[t]=i}}toJSON(){return{version:Si,points:this.points,blocksize:this.blocksize,offsets_fields:{LINEAR:{OFFX:ar,OFFY:lr},LINEAR_NONUNIFORM:{NX:gr,NY:wr,NT:Ue}}}}};var $A=class{constructor(A){this.dbname=A,this.promise=new Promise((t,i)=>{if(!("indexedDB"in window))throw new Error("This browser doesn't support IndexedDB");let n=indexedDB.open(this.dbname,5);n.onupgradeneeded=o=>{let r=n.result;r.onerror=a=>{console.warn("IndexedDBError",a),i()},r.objectStoreNames.contains(this.dbname)||(console.log("creating idb database. . ."),r.createObjectStore(this.dbname,{keyPath:"_key"}).createIndex("index","data",{}))},n.onsuccess=o=>{let a=n.result.transaction(this.dbname,"readwrite"),l=a.objectStore(this.dbname),w=l.count();w.onsuccess=P=>{w.result===0&&l.add({_key:0})},a.oncomplete=P=>{this.promise=void 0,t()},a.onerror=()=>{this.promise=void 0,i()}}})}_connect(){let A=this.promise,t=new Promise((i,n)=>{let o=()=>{let r=indexedDB.open(this.dbname,5);r.onsuccess=a=>{let l=r.result;i(l)},r.onerror=a=>{this.promise=void 0,n(r.error)}};A!==void 0?A.then(o):o()});return this.promise=t,t.then(i=>{this.promise=void 0}),t}write(A,t){return new Promise((i,n)=>{this._connect().then(o=>{let a=o.transaction(this.dbname,"readwrite").objectStore(this.dbname),l=a.getAll();l.onsuccess=w=>{let P=l.result,B;P.length===0?B={_key:0}:B=P[0],B[A]=t,a.put(B)}})})}clear(){return new Promise((A,t)=>{this._connect().then(i=>{i.transaction(this.dbname,"readwrite").objectStore(this.dbname).clear()}).catch(t)})}keys(){return new Promise((A,t)=>{this._connect().then(i=>{let r=i.transaction(this.dbname,"readwrite").objectStore(this.dbname).getAll();r.onsuccess=a=>{let l=r.result,w;l.length===0?w={_key:0}:w=l[0];let P=[];for(let B of Object.keys(w))B!=="_key"&&P.push(B);A(P)}})})}read(A,t){return new Promise((i,n)=>{this._connect().then(o=>{let l=o.transaction(this.dbname,"readwrite").objectStore(this.dbname).getAll();l.onsuccess=w=>{let P=l.result,B;P.length===0?B={_key:0}:B=P[0],i(B[A])}})})}};var $e=`SMOOTHMASK/Knx0k1iYD/3AgAAIAAAAAAAAAAAAAAAAAAAAAAAAAD7nLyMCtfFP4AAAAABAAAAjF5tPUAZsT5rCf//ww+l1ywSA9wAALHRXwyh6dMMGu3JFpvZ
7xUq3zQWsd0QGGfYTRbR2CUWdNioFmLYiRY61ygWKtoNFtnaEgnF3J8Hd95YCZ3fmRVx2SUbk93kG8ze3RvP3vQXyNkuGFzXRxjX1TUYmtSVGOTTL
RmS02gZTdNHG0TYUBqq2eoY7NqLGW3XDRjx2rgX7tprF6zaLBd12kMXmNkVF+HY5BaW2MoWcNjIFl3Y0RZT2M8WS9i2FjHYSRai2CAW1NjIFVbY9x
UP2PwVzNcFFubXGBYd2A8WN9j+FTLY6hUQ2OIV7tfWFQTYGRYw2K4WVtiOGzzbpBxQ2+AcGts/GF3aAAAAAAEAAAAAAAAAAAAAAPucvIwK18U/gAA
AAAEAAAD5h10/T5lzP///AAD9hhhUK4VHRTbBFyvW2vMMEOa2EBzrPBIb488USa3jLfal/h9csZtGorN9ST65lErZor4iWb8YBVbpART/7zcWhPUw
Fn35YReX2nwGZttRBlXZ+AWd2E0FXNiGBFXXJAXo1nkF5NcpBkvXXwfWy4UbrsqXH3DKSyHPyn4hacswIZXLRCG2y3oh88unISHMiiH7y3ghicvLI
AbKCCKWx34l8dA2EBXRWgy12SoaZN1wHPvfCh334c4ao+ObGN/ktBeJ5V8XouViF/bl9xZc57sVHOk0Fcnq8xQG7MkU3OyXFMzdERda2tkXYOV5E9
fooBJz6noStuoxEyHqTBQAAAAAAgAAAAAAAAAAAAAA+5y8jArXxT+AAAAAAQAAAM4qRD6hKc4+6MgAAP//wgwK06In0dQtJwrZsBD73FARr9tGGIf
tPyU/44kay+SrGhHyqQ5J8nIPGvCpIZzuZSM47dgm+O/ZJs7hfCWa4Ecjs93hFizcZRVN2zAUuNoHE6XaThP+2VkTztnJE0LacRTo2poVMuVBFu/n
0ha85isZU+ewGerhDhQi4W0SIOGLEXfh7hAo5XsWZOVnF2LlPheK5Y8WnOWXFmPlBRdG5SEX2eXWF4Tm3Rgr5skYpuiTE6npchLC5GsX4eJXGM7hV
BgS4QoYj+DlF17g2xdZ4N0XZ+DmF33g9BeR4AgYpuAhGLvgORjG4FcYs+CLGKHgsxia4NAYuuDqGAAAAAADAAAAAAAAAAAAAAD7nLyMCtfFP4AAAA
ABAAAANSwmPxKXZT///zshEunlDS3o1BD/7D0D2ekAAEzz3xo09hAhUfeGJCj2QSNo760PYe0CDKz3mAy96lsP++nbDq3p7g0X6xINg+veC1LtGgm
L7HsJ3+m3CbPzaxPT9VUW5/WtFqf3/BiR+KUaz/qAHXT6Ah5N+kMeOfp8Hkb6Qx5k8WEYxe/1FU/v3xSS8KcO5PBPDZrwyQxM8IYMEfBQDOzvPQzn
71QMFfB8DHjwsgzh7noOve48Dg3vLQ507y8OkO8WDpvv+w2n77MNi+8sDXXvxQwW6nQOCunMDjfpqA7X6XwOLOqwDkXqMQ9Z6n4PbOqxD3Lqxw986
rQPbOqdD57qWQ/+6goPAAAAAAQAAAAAAAAAAAAAAPucvIwK18U/gAAAAAEAAADyO/8+K1RkPwAAUvuVEvT/xgf//4AG/+wZBi7sKg8D9xYXgvumGN
f8dRDx9NIOxvXfD8P1ARX87igLle8CCgbw5gnJ7jEKYu1SClfs+wgU7M0KVO5uCx3vZhBi7wESo+8WD+zzWxD/+csR5ftlEjn8RBLQ+5cQYPY9EH/
1FhBD9QMQPfUbEFH1HQzh80ALbfTTCv/0lAp49X8K3fV9Ci32Twps9uMJh/aNCYD2PQlt9u4IXvbACFz2rQhj9jgGP/fjBaj2mAWB9j4FsPYLBTj3
SAj29NYIuvT/CK70GQml9DoJrPRQCcf0WQnf9AkLwvZIC9v2ZgvL9lgLnPamCxv2LwyX9WoMUvUAAAAABQAAAAAAAAAAAAAA+5y8jArXxT+AAAAAA
QAAAEQVIT8Q8Xk//QaD+7ER//9+DEnzFQML9gAAHfbfAMP2FQBm688A0un3DVbu3w1/8L8MTvIlDOvyMwYS+/UE+fsvBAn8MgHF88wA0vJwAhD7cQ
KJ+5wC9/sYArv8jgCy+5EAzvs/ABj8VwH2+E4IqfYRC0r2OAxY9lINQvYSB8/21QUH93MFK/dxBVX3gAXe908Ft/cHBWH35gQU99MExfbWBJr2CQW
l9rkFqPJsBVjxzgSu8DIEJvDJA6zvowOW7+cDK/AvBKPw+gGA9EgBMvX4AGH13gBi9dYAU/W9ADX1kgAE9VcA1PTtA1v3rgSn91AD3fVUA571cwOo
9X8DtfVpA5/1LwNw9QAAAAAGAAAAAAAAAAAAAAD7nLyMCtfFP4AAAAABAAAAlxsePnVYGT96Ib7q+gwR9ygNuPgAAKf3cAe0/38RyPpECkb2fQq/9
UYKavQqCeX+qwj//3EGM/pQBQj6kgWZ+toFs/pBBuH6lAsj/KYLCf1zC3j9cgdi+BMHnfjoBr74egf1+DcIO/miCDT5BQlE+WkJafm4DNr3+wYP+q
kH+Pu9By/8xwcd/NsHHfzoBxz8wgfR+3UHcfswB2v7Agdv++oGbPvhBmj7xgZu+4oGi/uNBqT7qgak+8AGk/sZB937fQds/IwHM/nUB4j4Bwg9+C0
I9ffvB+f3UQc2+OkGa/ivBpL4ogau+LQGt/jhBq34CAev+CoHtfhQB5v4fgdo+LAHP/jXBwP4AAAAAAcAAAAAAAAAAAAAAPucvIwK18U/gAAAAAEA
AACLupQ+f3tOP1v7rxT//3ICvP0AADf86wXV+bEOpPTZCWDzXwlE88AIxvROCHz6sQc8/KIHw/2LBw3+qgjJ/l0J3/oWDlX/chGH/9QRe/iaDNL3a
Qs0+BgLTPi6Co33FAp59yMKjPWxCoX12gqK9bYKsvV1CuD1Lwr59fAJDvbCCRD5+wd3+W4HmPmQB5H5wwWg+XgFUvlhCUz5IApt+ZwKpfmpCu/5YQ
oG+hoK/fn1Cfv59gkY+iEKRfpTCmX6bQp1+noKJ/pQCqf5Jwo5+TMKxPhNCor4XQp8+JEKl/jXCtz2TwyV9nQMbvZ0DFn2awxS9mkMUPZ0DE72ggw
r9l0M8fUcDNn1BQwAAAAACAAAAAAAAAAAAAAA+5y8jArXxT+AAAAAAQAAAEoqCT7xz04+nH0thwAAqU4YWCPg1WeZ3P9vcOIzK///jyjkkmBNWmr+
Rf5u1UDRbeFfP6OFZYqkgWnkopBTws+CV5nSzFSYzGdJTMRoLDmxdFRfxLpZfsLJXbjAMFxuxfJcI8YtXkDIgVuQxU5pvasja9in9GoHp5pqAabEa
UWlsGgxpP9nQaPjZHahRHxBsbmARLUqgcC3roDhuBBs0L66aCjBZWdPw+Nm3MTFZnvF5Ga4xfNmzMWlZrXFO2acxUJn78I5aW+/GWrkvUdqXLxbav
q662ryuRZs7bhLbHK41GsFuBRr2Ld5aS24rGoWuB1tNrg3a7qrNmqvq4Jp3asEadirImkIrAAAAAAJAAAAAAAAAAAAAAD7nLyMCtfFP4AAAAABAAA
AXs+vPoCS6z6T6u8pEMmrFDO/2DyczWwwYvmAQ9XynxD///QIqPAAANryhyR98u4jtvebIWrzjiJL7pMsLOziL9fr4TFV6AA0VdWEJ07UIiXI3HMO
us2iIVjNDSH16nQqSevjKvTu5S1a8RMwTfPuMRb1BjNS9o0y7fXTM3n0bzXy9/Y7K/d6O4z1+ztd8no7BO6SOszjVD6A4wM/cuQzQPHkl0Ht42NB6
eLbQPvipUCh46xAwvAMN+zyPzSR82Ez6vMSM8nyPTPs7kwr3e5eKrfupCpA7k8rle39Kx/tbizJ7Kosn+z2LMrsLS0f7T0twu3CLA/u0Cuy7WYqMu
0gKbnsIihP7GEnAAAAAAoAAAAAAAAAAAAAAPucvIwK18U/gAAAAAEAAABg+jo/I35SP3hLf/YBTP//44lCy9g2Rp3pFuqRAADZtXcoytWqMwzZETh
D2zY41dyiBy7ApwB9xlky8cC8RFed8CPZozgjYacrIjqrdx0Pqp0b0ajGH32o+x7Uyi4jsdD5I8DQZSiG1AUsMtfcJdO/uiNovEMiKrqqL53CgjMx
was18790Nt6+GDYuvoM2pL7cNtO/7kKPuVlFFrgNRtK3M0brt1FGObjXMEyyGi4WsRAuOa5cLY+rVy3Eqh0t2KtpLLWsbCtgresqB66TKo2uXyr4r
ksqrK5DKuCw3CsKsUgs1bAxIr24bCBMu+ofzbynH8e9wx+7vjQgwb/CIJ3AISFYwSQhM8IAAAAACwAAAAAAAAAAAAAA+5y8jArXxT+AAAAAAQAAAE
sP9z5qAWY/wPQAACPodgs89ggbqf51F///wRY//gUG7PHDBmHpiw/R6BYRDeutEgbsMBNb9WkSBfWvEHXzvg9B98kW7veOFsf3wRZZ+IYP2PjzD13
5uw8N+jAOt/TyC9X2OAp79uEJqPUdCgf1bgrM9I8KcfFMC3HxYQux8X8L0fGdCxjyaQt88SoPj/FqD9jxmQ9t8uAP1fLyDwnz+A9c9qcQjPZgEbf2
WxL/9g4TEfduEwT3fROZ9oATDPaWE871rBOw9cATofXRE5n14BOn9ecT1vXwE/f19BMW9gMULvYWFCD2oBP09fgSefeUD2n32A4Q93AOrfbSDb/2c
A289iINqPbiDAAAAAAMAAAAAAAAAAAAAAD7nLyMCtfFP4AAAAABAAAAlnyRPh3mPz8AAP//xgOg8qYEn+2BDnb2ThFv+C4Pp/XnFPLtMQnr6pgCDP
QCCl/yJQlv89sJWvRsCvL0vQ4w+i8PQ/uED7f74Q8S/DYQYfycDkj9uQzy940M8verBxP6tQcb+mMHNvpWCuD11gqz9M0KNfStCvHztgtS92YMyPd
wDA74jgxA+MQMY/j+DFb4NA1E+BkKTPZZDAn2pQyp9agMVvWaDA/1lQws9ZYMk/WaDM710gzr9RAN9/X1DHT06Qxz9N4MjvTrDKv08wzB9OoM3PTu
DO30/Az09AMN9/QDDPT23gsV964LIveACy33Zgsz91ILOfdBCz73KgtP9w0La/f4Cmb3AAAAAA0AAAAAAAAAAAAAAPucvIwK18U/gAAAAAEAAABEQ
Yk+ifTRPgAAur+AKx3wFzP//7dTotwLK1zU2CSs1+wmhthkOnvDlDbhxOlGINKhRBG7AUOttmpB27FnQZqvP0HNrstBJ8XfQwfJu0b9yQQ9tsKuPE
LE6SvlxtEnCcjjJ+zHNyeJx2Ym+8ixOTvINj1qxgk/c8W7QJbFjEGjxWZB6MSuP3rD9z9fwjZBvMBWRkbIiEcny29M6ceMTIbHO0w/x1pM6Ma7TLv
GykzfxrlHqM65RnvQJUY40flFBdIhRuLSVEZv0zJFlcURQ+7CVUEcwhtAlsE8PwXBmz59wCM+EsAKPri/ZDxTvrk8bb6tPJi+pTzhvhY9XL91Pc2/
xj0mwPo9KsAAAAAADgAAAAAAAAAAAAAA+5y8jArXxT+AAAAAAQAAAPwr4j6R/wk/AAA4/hIClM3lArTaIQvKqmUQnsveBNj7aQn3/egJ//8ZAYz3Q
S7w8MYwW+DlNKndKThp3k4tKtTrLorSei/u0Qso7NivA8HuxQIb+BYA7PuADSnoKw/E6IcP+ehsENjo5BBu6M8Q2Of3H73smCHB7vMhOfG0EKPrFQ
3d9AYNnfSCDIjzDgzh8Y8LmvH9CqPxpAkQ8bgH8+8eBl/vZgWN72kYMOqsG2rq2xoC6pMZdugIGSDnDRjo5aYZxtnyGcfWRhpk100altliGn7axxo
D25Ab0tqvGzza/Brf2VYaMdnRGYXYjBkX2FoZxNe+GDXYKxjb2OwXC9nUF/HYwRd02AAAAAAPAAAAAAAAAAAAAAD7nLyMCtfFP4AAAAABAAAAlzEW
Pncjej8rB3n0owj//xoB+PcAANP3sQW98g0GrPFaBebxXAhU+dMEBPeOCOv25wcE9zsGmPj3Bbv4xAI2+C0DFfgvAwz4vQPJ9BwETfR2BPTzrwQ/9
MQETvT/BBP0AwXx8xMGWPLrBSLy3weH86EGRPZTBi73XQap92wG//d8BjL4iQZY+KEGc/ixBnz4uwZu+C4FR/b2BKP10ARs9awEY/WbBGP1jgRk9Y
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
2PK9C9Pyig6Z9ggPPvc9D0X3Zw8796UPafckEFv3uRDs9jkRtPb5DgXzVw568wMOxfMiDj30+QjE9l8HevehBsb3Lwbz9/wFFPjdBTf4vAU2+KgFE
PiLBcD3dwW092UFy/dnBcb3cgW5938FrvdkBW/3MQVK9xoFQPcAAAAAIwAAAAAAAAAAAII/qv8iuqz9wz+AAAAAAQAAAPkleD4FFZE+1UjKnPcgKo
sgJ///BnaZk0ReqGEdcKCz98HNuGWo6seUm7zKUsSFZclSwWECR/pUQjbdTIwzJlNhMItY3h00SwAA/IljHfqvO1Y9lF9aY5ceXAmXdlvClt5bjpY
sXRSVsmbRvQtt2cCvchXA2HWIws96e8XSfkbHqYF1yEaDE8l1nG3OzqHyxMahRLtdkxaMm4/XgruMnoChiXSDhoWuhkiCM4hZf3eI9Xy+hvhSzY48
R0yQkEOwj4hB7I4VQTOPxEBKj6w3KowEOaaN5DkMjkQ6+Y1sOtONfjqsjYk6to2WOkaOmzpcj486LpBJQhl7E0MCfIhDEn73Qzx/MDuZmQAAAAAkA
AAAAAAAAAAAhT+unsVQ47nDP4AAAAABAAAA0VoEP855Ij+cLTHt6z1D4Ks0jc57OjDNTSLy8pccr/6EGgn30SAAy2gBRdoAAHbbzzSw7Gw7B/HRPr
Xy8y1z7zoqUu63J07ugSWE8TYlX/b0JXH5liGA+uMi+ftBJOv6TSKE964ggfMEIBrychTg8nAUJPQkE471iBH/9YITifd+FjD4xyOh6DAn8ONEKMv
g8ieu3YYoU9uJKcbmQSww64kt2+4oLhXyKS869DUw6fUXMYb3ozDx+Bo0Q/5FM3//3DL//4MyifVmMib1ZDKZ9Z0xffV8MAr1NzDB9GswWvSrMFT0
1jB59PAwp/TJMPL0ozBF9XEwqPUfMAH22i9R9rIvlPaZL7j2AAAAACUAAAAAAAAAAICHP3BsSbK5eMM/gAAAAAEAAABIrEw9rsxfP4YF2/rKA///U
AHz/M0ChPy4B/f1SAhe97YGJfgAAFX4+AUI/d8FLfuSBgX7UgYn+5MFP/xoBT38rwW/+1cGQvyyBkD8/gY7/CoHVfwdB3T81AaM/DoHAPgzB9n3Lg
Ze+s8FevpOBVz6XgPd+rQCYvtpAob7bwKj+2sCwfvUA7X6HASe+jQEofo7BKj6OQSu+isEp/oZBIL6AwRX+vsDVPoFBHX6EgSY+ioEtPo3BMv6SgT
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
kPyICZvciAmb3IgJm9yICZvciAmb3IgJm93IE7/lEAxn3qQAN9loCYvnNAWn7YwP//9oEXv7EAY721wDn9YQAl/UJAh/2GgIL9xIAnfhNCAv4TAlt
+CYJ7/cvCen3JwNL9gwCtPXSASP1zwGa9BACOfQoAj36eAKa/NkCev3hAuH93AIg/gMDHv5XBV36QgXM+fEEvfnRBH/5uARk+aQEXPk7Ann2ewEC9
jUBCPbrAP/1cQD19R4A/vUAAA72NQAm9okAM/ahADn2qgAk9q8A/vWxAAj2rgAZ9o4AD/ZQAN71KwCw9SEAgvUaAGb1FABU9RQARvUcADv1GwA29W
kAK/UAAAAAWQAAAAAAAAAAMLU/Zrebm4l+uT+AAAAAAQAAAEQqzTt3MeI+TPtUCEz7VAhM+1QITPtUCEz7VAhM+1QIEvsRDpn8vQyt/g0MO/4lDP/
/kg0C+T8FwfhlAWX4AACh97gGUfjIB2/4ggc++GIHOvgjB0f4Fgd7+TMHyvncB9r5vgc89awHAvrxCGH69AmE/DMIM/xvB9T77QaU+30GZ/siBkb7
6QUw+9UFLvvWBZr5HQgJ+oIIe/qOCIX6zAVm+l0FX/obBWH6zQRW+o8EdfpoBKv6UgTP/PoGJv09By79VwdN/YAHX/2FB3b9gQeR/akHbv3hBzD9B
AjA/GsIOPz/CPr7SwnW+20Jxft6CdP7mwkt/MALkvy7C8D8yAvf/PQL+fwnDAAAAABaAAAAAAAAAACQtT/S9dRl+Fq5P4AAAAABAAAACdSVPZJpyT
7HBhr8xwYa/McGGvzHBhr8xwYa/McGGvyOCH/8ZAdW/TUH9vxaC7T+6ArF/isLQv65C1j93gyU9qoNt/ceAwD4bAPF9vICtPb6AQP3/QJW+Q4DBvv
YAnb7vwJM+ygAK/0AAFv93QZr+toHRPpoB2n6qwYe+oQDqvUgA/bzHgPo8lsD+PGrBJf4GwVy+lAFbftCBfv7KgVj/EUIZv5HCeX94Qlc/VkK/fy3
Crr8AwuV/EILg/x2C2r8Zgwl+kgMYfqzCK3+hAe8/9oG//9OBtH/8AWN/90Frv7HBYT9iQUB/V8FwfxGBYD8ZQVV/HgFUvxyBWL8TwWt/DMF3vwZB
f/8AAAAAFsAAAAAAAAAAOC1P5DSjnH6N7k/gAAAAAEAAABEqT084XMWP0H6pwNB+qcDQfqnA0H6pwNB+qcDQfqnA676ewfW/P0EH/7nBun9bAYV/m
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
A1X90gOEfiBDpn4jQ7n+GoOC/kpDiL57A28+IINN/jkDAH4jQw1+IYHWPgDBnf4egWw+DEFAAAAAJEAAAAAAAAAAGjEP/r8d2END7Q/gAAAAAEAAA
BBfKI+pvJlP8P8NQXD/DUFw/w1BcP8NQXD/DUFw/w1BcP8NQXD/DUFw/w1BcP8NQXD/DUFB/22Awr+LQVr/rkEcP6WBer+dQXg/BEH//+gBhf8zQd
S+8UHg/q5Bwb7SgcE+0UHI/0HCZT9Ggma/ZMJff3wCVz9PAot/VAKZ/2VCrj90Arx/Q8LY/2xCjT9YgrB/WAJ+v3hCCL+uAjX/eYIQ/3pCB79ZAg2
/BYF4/vxA7H7dAOM+zEDc/sHA2P74QIl+iwC0PteAEz8AACI/fcCsP2UA6L91gPG/TQEBf6zBDz+AwVf/kIFZ/5rBWP+hwVQ/pIFNf6YBSb+owUy/
poFKf51BQr+dAUAAAAAkgAAAAAAAAAAmMQ/qv8iuqz9sz+AAAAAAQAAANyTVj4kbGM/1wU7/dcFO/3XBTv91wU7/dcFO/3XBTv91wU7/dcFO/3XBT
v91wU7/dcFO/1bBdj9fgXE/hwGEfxgBlX7rQSY+m8EY/olBHX6vQPi+uUAf/5UALr+BACS/gAAgf5iABj+1wDW/nIBZv/CBNH9OQZp/dAGgf3mBtv
96AYi/uEGVf7kBnf+6AaR/vYGsf4bB7v+Vgez/qAIHf/bCEX/9whx/wgJoP8VCc3/CAno/+wI//8KCBL9oQdI/GwHBvxNB+f7MwfS+xIHw/tNBS/8
SgUP/jwFa/4uBYD+IQWC/j4FPP4kBUP+AgVC/usEN/7NBB7+wgQT/sIECf7BBBT+pQQ3/gAAAACTAAAAAAAAAADAxD+tUB3veOyzP4AAAAABAAAA3
HahPrTSNj+l+rQDpfq0A6X6tAOl+rQDpfq0A6X6tAOl+rQDpfq0A6X6tAOl+rQDpfq0A1/9HwZ1/sgG///6Bm3+XwZB/LcJpfxqCRX7cwnu++oJDf
2WCiD9mwog+3MIDvtUCIn61QdD+okHHvp4BuP5ugWy+SMFm/m7BKT5cgTE9aMDnPWpBOn1MQXH9UwFXPVcBY/2hgTZ+RAHgPo7CPv6EgNM+2oBavv
QAG77jgBu+3UAd/uzAID7qwCq+54AyfuOANv7fQDb+20A2ftIAN/7FQDk+wAA5fktBD35UAUq+QEGWPleBp/5NwYY+tEFe/qzBcT6tgX8+sUFDfuh
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
HQuV/5gN0v0qG8T9JRKf9cUQffJ4ECrxvRFG8AAUSO+PFHfuCBTE5vgT5eRjE97jlRK44xMSU+IZEtTfkhIo3osTH91EFFTc8hTa248VqtsnFYDm0
RPL6N4Sd+kQEpTpihFc6UYRIemZETHpHhFk6XkQn+n/D8jp7g9C6noQ7eoAAAAAoQAAAAAAAAAAOMc/IjCcU4QMsz+AAAAAAQAAAH5iEz5Kjsk+Rf
mgB0X5oAdF+aAHRfmgB0X5oAdF+aAHRfmgB0X5oAdF+aAHRfmgB0X5oAdF+aAH5vQJCl/1qgnv+tAP/Po4EHj6bwvF+0UKv/1dBof+ZwVz/2UF//9
wBSj92wXg+6kGGvskCO783Qdu/boK/PsiC+n6pgvu8y8J4PHHCCPxmAd/8OkGAvCFBs/vYgZU9S8CgPcmATD4YAGr+AkBk/RzAajztAAz8wAAyvgY
AcX5cALJ+ZEDLvxQCD/8+gln+uwGdvrlBpX6UQeD+p4HVvq6B0b6ywc/+tQHPvrbB0f66wdH+vwHR/oQCE36MQhD+kcIKfpUCBn6YAgT+mwIFvp2C
AAAAACiAAAAAAAAAABgxz8xRehxoP2yP4AAAAABAAAAmY20PfW0GD9j/WwEY/1sBGP9bARj/WwEY/1sBGP9bARj/WwEY/1sBGP9bARj/WwEY/1sBG
P9bASi/boEov42BC//YwSy/KYFJ/xjBXn7fQUN+24FgfqnBBb4uALn9rQD+ff8A/L3yAT2+W0BG/pfADD9OQNa/ioE+P5aBFD/QgRN/+QDKv9gA0r
/6QKU/2QCtP8PAsD/EwDZ/xwA4v8KAP//AACZ/6cDRP9vBBj/ygTy/ukExf7qBKH+5QSK/t0EYf7gBCb+5wQR/vkEBf4IBfP9GQXo/TgFGPv+BCv6
GwW/+RsFnfzrBBz9pQQ5/YYEOf2CBDn9iQRB/ZEEPP2VBBT9ogTw/JgEAAAAAKMAAAAAAAAAAJDHP9Ib/UTf7rI/gAAAAAEAAAArRC4/U6ltP/sJp
/n7Caf5+wmn+fsJp/n7Caf5+wmn+fsJp/n7Caf5+wmn+fsJp/n7Caf5+wmn+VcLmfhyCJb8Jgbd+0EHQPo8BTH75QgH/LQII/x7CCz86QJR/swBof
7hAPT7AABo+n8AvPjTAR72KQK/9HMA/vEsAfPw5wFH62UCp+nUAtPoOgOB6PkLR+4FDh/wxQ5Z8e8OpPITD0fzUQ+d830PqfNYD2DzWQ4/8+cKafr
mCLT8rQer/fYGT/91Bqj/uAb//6sLyv+SDHr/vgxI/34MQ/9uDEf/8Qte/9ELYf/QC1z/9AtE/zUMQ/5sDED8agzt+mkMZfqrDCT65wz/+RYNy/kA
AAAApAAAAAAAAAAAuMc/k0PYRkDgsj+AAAAAAQAAAKtyjz5ezgU/6fKFBenyhQXp8oUF6fKFBenyhQXp8oUF6fKFBenyhQXp8oUF6fKFBenyhQXp8
oUFRfLaCMrtOw3X7WENfe5rDP/r1AxP6ucMee8fCuf2VwJp92sBRPhXAEf4xwAn+HAA3/dZAL73jgC9960AuPmFA1//ZQam/5gI//+FCdX5CwTF+L
EDZfidAj34yQFy+LgAZ/huADb4TAB4+AAA6PVWBxL13wmL9CYLnPDlDILwfA0b8f8NufGpDhXyJw938oUIfPLBBn/y/QWD8rkFRvJUBePx0ASw8YY
EbfF0BCrxkwTn8MQEtPDtBJTwBAWN8A0Fj/AVBZLwHwWV8CwFmvA7BQAAAAClAAAAAAAAAADoxz+EYEf0wtGyP4AAAAABAAAAAdySPtdGBj/7B8P4
+wfD+PsHw/j7B8P4+wfD+PsHw/j7B8P4+wfD+PsHw/j7B8P4+wfD+PsHw/iVCqb7Jwsx+3ILP/vADG39+Q3X/aIR///zD9D/Qg8o/5MMAP7PC7D81
QuG/L8LnPnDC1P4Dwwb+BsLhvguC0/4ogZd8m0GE/D0BHvvYQQv7yAE5u74A6fuzANw7uUDHOrbA+Pq6gOe69kDCewAAC/z3QFP+V4DVPovBJD6MA
RO+h0EEvoYBBD6vglK+I4LOfjWCyr42gtY+PMLfPgfDLz4PAz5+DEMFPkoDCv5NAxQ+b4H8PkIBy366AZJ+uoGXPr0Bm76/waA+gEHgfrYBsn6AAA
AAKYAAAAAAAAAABjIPxza1Mxmw7I/gAAAAAEAAADsTXA+FXIRPyv7WQUr+1kFK/tZBSv7WQUr+1kFK/tZBSv7WQUr+1kFK/tZBSv7WQUr+1kFK/tZ
BSv7WQWp9nUDyfWPAzz0TgNx9xQEhfepBDX4fwP5+O0AiPiKAL74AAA2+R8ClPnrAkr6tQTI+skFGftiBuj6Mgei+bYKBfkPC5T4LwsJ+PsKhfr7D
ZT7xg45/AQPqfubDZL66gwI+rgM3fmjDLH9OwwP/twL//2kC/T/Qgf//xEGlPweA6b7UQJj+xgCZfv8AZD78gGz+/IB5Pv5ASj88QFB/MIBzvtWAV
r6jwH9+ZgBufnkAYT5DwJT+SYCK/kyAgz5PQLu+EEC0fhCArX4QAIAAAAApwAAAAAAAAAAQMg/Uiu1Uiu1sj+AAAAAAQAAAP9ZWz4Y4nQ/QwIp/kM
CKf5DAin+QwIp/kMCKf5DAin+QwIp/kMCKf5DAin+QwIp/kMCKf5DAin+QwIp/moCg/3IAhT85QIw/KID8/s3BNz7uwTW+0QF+fz7BN78kgOq/WgD
cf1BA6v99QLq/ZgDa/71AZ7+rAGS/sEBi/7iAY/+/QGP/gkCkP4ZAo7+SgIn/kcC7f1aA6z8UANJ/FED//tkA9b7UwO4+z4DnvssA4j7iQLi+nQCA
PsLAXj9qgAt/pYAev6HAKT+cwCx/mAAuP5QAMf+QgDV/igA5/4VAPD+AADw/qMB//+lAtb/NQOh/4EDdf+AA1//bANC/3YDIP93Aw//gAMN/wAAAA
CoAAAAAAAAAABwyD+zzbQKEKeyP4AAAAABAAAA75THPipBND9rBoP3awaD92sGg/drBoP3awaD92sGg/drBoP3awaD92sGg/drBoP3awaD92sGg/d
rBoP3oQax91AGOPckBqb2IAZY9gYGUPbVBpb2HAi582gH1/YICmr0sAmE9JAJl/StCXv0DQpT9GoKMPSHCgX0Iws39HMF1fTLBgL5VQZ1+w8G9fzr
BSH+kgXf/qAFzP5mBQP/+QT4/qsE/v54BBX/VwRK/2wEhP+CBLr/pgT0/8oE//83BaH+dwKX+QYC4vcLAjH3YQCe+DAAs/gmAJ/4FgCT+AAAjPh0A
FL4LwH69xAD/vO1A0/zFAQ181gEOPOOBELzMAXy8zoG0PTRBkr1AAAAAKkAAAAAAAAAAJjIP5G5JnwUmbI/gAAAAAEAAAD7cRE/QFYtPxcTi+cXE4
vnFxOL5xcTi+cXE4vnFxOL5xcTi+cXE4vnFxOL5xcTi+cXE4vnFxOL5xcTi+fRIeTrZyIm6nAeKO5YHq7vICAY8HwiXvD+GlPnBBx35oIeC+X9EGb
eUBBe3dMQgN2BCTryowVb+DUDZfu+ACr+AAD//2MGYf1ZC1f9owsz/mYNHeoPDFzjVwoG4IUKbeAeC5bgbQvE4IoLY+HcCwvidAyl4jINJOP2DPXl
OQ7y6doONOsQD5fr1Bue6oUhPurUJPnpPxWb5dQRT+OCEQbijBFY4ZYR3uCfEYLgZBFU4MgQaOBCEE3gYw/w34wOat8ZDhLf0w3Z3qANpN4AAAAAq
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
twKNfuyBcT78wMP/OACufrlAfv53QCJ+QAA8v0/A///7wNI/bgI2/jdBij3xwai9ucGQvb4BuD1/AaK9f0GQ/X+Bgv1Awfg9AwHM/UuB031dQdj9b
wHg/UpCIn1mQh19fQIXPVCCVz1pwl89TAKhvWOCgAAAAC3AAAAAAAAAAAQyz/jyvQtY+GxP4AAAAABAAAAJLHYPgFYdj+EBM38hATN/IQEzfyEBM3
8hATN/IQEzfyEBM38hATN/IQEzfyEBM38hATN/IQEzfyEBM38hATN/BoEO/w5BbT7iAVv+28FS/tEBS/7SQWz+0MG6vx4B53+Cgig/goIxf5eCEL/
egea//QGPf8vBm7/zAV7/6AFbP+LBWn/gAWB/18F5v9bBf//dAKv/XIBUP3sAEz9ngAD/XMA7fxLAOL8JADW/AAAy/xhAJD8sgBv/HECmPn9Asr4S
AE4+uAAUfq+AET6rQAv+mQDWfxvBDb95gSN/fIDkf0CBKj9KgS5/UoEwP1jBMH9mgS3/aMElfu6BFz7jgTA+zgEQfwUBID8AAAAALgAAAAAAAAAAE
DLPyY/decQ1bE/gAAAAAEAAAATeEk9VF9QP8v+PQLL/j0Cy/49Asv+PQLL/j0Cy/49Asv+PQLL/j0Cy/49Asv+PQLL/j0Cy/49Asv+PQLL/j0CCP2
nAQb9uwFj/V0Dl/3IAq79vgLK/Y4C8v2pAjn/jwIe/9oCvv7EAuL+zgIP//YC6/4MAyv/+AJt/+sCn//aAsL/yAIO//8Ccv4mAwz+NQMN/jMD//03
A+39HgPb/fYCwf87Af//aQCf/gAAJf1qAb38tQF7/NkAVPzuAEH8EwFH/DYBSvxCAVD8OAFC/DIBHv4xAqX+jwLQ/rcCy/7JArn+3AKx/uoCrP72A
q3+/wK4/vkCy/7uAvT+2QIk/7ACv/+iAqb/ngIAAAAAuQAAAAAAAAAAaMs/Qvng9tfIsT+AAAAAAQAAANoIQj1+0Ts+AAxX+AAMV/gADFf4AAxX+A
AMV/gADFf4AAxX+AAMV/gADFf4AAxX+AAMV/gADFf4AAxX+AAMV/g9CPH6VAZZ+88CAvmjGfv6TRD//zgQcv+sFlv7HBeK++YWPfz0Fev8BBUa/cc
So/lXEd33NxJo9L0RvPI3Ecj0qg2O9ZwKs/QlEWP8cQ8G/I8Op/kAD6X4ZA8++LUPwfcWEAX3VhB/9loQafYiEeX2yhKr998TPPhwFJ/4vBTs+GgU
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
xLBE28CkRJO/AEYrtfBDA7JIF/Oh+BAXnYAt+7VEM0u8hDNHwvguN8ZELP/JlC6HyKgvZ8vQK+fLLCgrzmQoa8zsKNvNBCRrzHAmU+dwHH/tfBOTy
9wN08f0DS/EiBGXxYASH8ZQEovG+BJrx7wRd8SEFIvFhBRTx5AU38RIGkPFDB2fx8QfY8DMIRfCFDbfqAAAAAMoAAAAAAAAAAGDOP4ZEZBEEB7E/g
AAAAAEAAAAq0sk9RbYVP7cCu/y3Arv8twK7/LcCu/y3Arv8twK7/LcCu/y3Arv8twK7/LcCu/y3Arv8twK7/LcCu/y3Arv8twK7/LcCu/yTAv39IA
Ja/ncDpfuDAwX7rgO7+iYD6/mEBnz7mwcQ/BEIy/t2CGP79AgB+8oHkPfqBpD2KARQ+DkDM/kEAyf6/wKz+g0D/foRAxX7DQMS+/gCGvsBAyr7GgM
2+yQDQvskA037/QJr+50CqvteAtD7OgLW+8oBH/yBAez7OgGa++kAVvvFAC77ogAJ+1gA3fodAL/6AAC0+hgAJPsvAGr7YQBw+4kAi/uyAMD70ADd
+ycBw/ueAqn+JAOj/3ED//8AAAAAywAAAAAAAAAAkM4/EQV+A1/8sD+AAAAAAQAAAIT0UT4qjeM+6PbqBOj26gTo9uoE6PbqBOj26gTo9uoE6PbqB
Oj26gTo9uoE6PbqBOj26gTo9uoE6PbqBOj26gTo9uoE6PbqBC73/gN492wEsPf3A7T2BwL49W4BufUiAXX1UwIa9bICa/MCBm3yVQhd8gwKD/XuCg
P2mAqX994QUPkoEEz//gk1/7gHgv5xBhP+cwVH/qYEJv45BCv+5gMI/o4E4/ziBL/8uwXi/A4GR/3TBXj9lQX+/JoApv0AACn+NAD//7IBtf/HAWL
/xAGL+XEFW/cGBmX2Dwbe9QMGgvX4BS71+AXG9BAGZvQnBh70Ngbb804GmfNgBmbzZQY/82UGI/NkBgAAAADMAAAAAAAAAADAzj9vj33TzfGwP4AA
AAABAAAAffnePhDfej95/psCef6bAnn+mwJ5/psCef6bAnn+mwJ5/psCef6bAnn+mwJ5/psCef6bAnn+mwJ5/psCef6bAnn+mwJ5/psCQf3PAin+A
wN8/v8D+/35BPj9HAUI/ksED/4fBP39SQOJ/ikCDv4nAS7+QQD7/gAAMP+QADv/tQAr/60AC/42AJv9jgGt/d8B5P0JAi7+IgJs/jMCmf40Atr8vg
Ol/CYEEP6LBUD+zAVI/tUFTf7SBZv/rwP//2ED/P9lA97/oQPH/9EDqP/4A47/EwR+/yYEdv80BBX/GATy/hMEwP7RA3D+UQMl/ucCAv6hAvL9jQL
0/XIC/f1WAgf+RgIL/kQCAAAAAM0AAAAAAAAAAOjOP4xO40NQ57A/gAAAAAEAAAA4VxI7pXwnPt3rMRLd6zES3esxEt3rMRLd6zES3esxEt3rMRLd
6zES3esxEt3rMRLd6zES3esxEt3rMRLd6zES3esxEt3rMRJQ700KKPAPB/Lw2QP98eoDI/FQA/fxnwQZ9AAAavwFCf79sQws/kwPEP3sEqH8NhWY/
I8WU/1JFoz+1BRd/y4U//8tFMD90BQS/HsR4ff0E1X2TRNM7FkQAetdEPjqGxBG6zQQl+ttEHPrkRDP6lwQE+poEH3pYhE76GUSJ+eXEmzmLRLx5d
kRjuejEWzoUBHU6DIRCekfEf3o8hCW4dkVdd8/F83cLRBm3AwQ2dy7EdbbBBbf25cVS+TmD9DmDQ8AAAAAzgAAAAAAAAAAGM8/wek4GObcsD+AAAA
AAQAAAKYwWj5CIpk+0urTF9Lq0xfS6tMX0urTF9Lq0xfS6tMX0urTF9Lq0xfS6tMX0urTF9Lq0xfS6tMX0urTF9Lq0xfS6tMX0urTF43d7hav3oYY
MN/QBr3dDQJy3AAAM+JSBDziyATD4l4Fuvi4BRX+Vgj//8IH7Oo9DP/mDAx75aUKB+RJCTnirwd/4+0F7ebNBfbo/QX26VcFm+iuCADppA248Ooeh
/GqJRbx9Sjm7A4m3OrMJX3pURjG6WIXWuiNF+7mghjx5VYZ7OQzGjDkARiL5CQUKeWaEb3lExA85h4PquaFDgLnMA6F51wONujQDs3o9A7f6ZION+
tBDm/s5Q1s7ZENbPggCAAAAADPAAAAAAAAAABIzz8XjQsVj9KwP4AAAAABAAAAQ9QyP6LEdj9p+ZwEafmcBGn5nARp+ZwEafmcBGn5nARp+ZwEafm
cBGn5nARp+ZwEafmcBGn5nARp+ZwEafmcBGn5nARp+ZwEOvi3BbL8HQUv/DEGH/2LB2/+/ghQ+4wLKvuUCz/6Qwz4+KAJdPg7CAX4iAdp99cGvPbT
BUf2jAXm+4YHR/62Byf/Cwj//0cIlfvPBfv6CQUb+9YESftTBAf7rQSS+uUDO/rzArD5RQJQ+T0Du/gbBLb4TATR+HQEy/itBK347wQh+dIEZ/wAA
On6CgOQ+qcDW/qwAy/6mQPW+YwDcvmSA0P5pAMt+bcDIPm/Axn5wAPv+O4D+/TTAwz0XgO28wgDAAAAANAAAAAAAAAAAHDPP+xX5v9KyLA/gAAAAA
EAAADS6DE/Un1AP33fJiN93yYjfd8mI33fJiN93yYjfd8mI33fJiN93yYjfd8mI33fJiN93yYjfd8mI33fJiN93yYjfd8mI33fJiNl7JQvrNb+MWb
SnDbL3zAxrtFZA0bSAAA32PQCy9vxA0HdmQQJ2+oG+NkaCqbXfgnr10wKLtUVC5vS6AqC0NsKI8+aC9fUtgjs2O8GyNtqBVHdGAQN3rYDGd65AxDe
Ug/AyRUh5MN0JOfBYCVLwVolC9uVNVzgSjzy4DI/g+DpQb7fPkMN37BD+d75Q8nfpkSf7/YpR/NtJQ723Sbn+Dcn3fr9Jon8rif//1MpAeeYLnrhU
yzx3+Mptt75J7jc4iYAAAAA0QAAAAAAAAAAoM8/z/BMnxm+sD+AAAAAAQAAAKjoxT5ZbAI/nuvYCJ7r2Aie69gInuvYCJ7r2Aie69gInuvYCJ7r2A
ie69gInuvYCJ7r2Aie69gInuvYCJ7r2Aie69gInuvYCP7ihQ8o5VkGrusAAEbt6wVy7uMGTPc2DHL3hQy2+sYOKP1gEOT+mBHX/w4S/f+WEY3/gRH
F/SkQ//9GCif7NQ0I+CAOdOcLCz/jMAif4nkRIuF5E0Hf4RMV3vsTgddCD8vWIw/d1h4PF9coDwPZ0hDs2AcRttgfEZfYJxF72K8SLeegDO/swgp8
77gJKPCuCQjxVAmo8YIIu/G4B6fxKQdF8Y4GqvCwBTDw7wRL8KIDrPAXA/3w8wI98fUCcvEGAwAAAADSAAAAAAAAAADIzz9qPba6+rOwP4AAAAABA
AAAga5LPrnpaD9B/t4DQf7eA0H+3gNB/t4DQf7eA0H+3gNB/t4DQf7eA0H+3gNB/t4DQf7eA0H+3gNB/t4DQf7eA0H+3gNB/t4DPvxVBAH9HAVY/Z
sEcv1vBFL9bQSP/VIEHv3RBBv90AT1/PMEzvwCBa/8KAWv+74EDvt7BLn6NQR9+v4DTfrkA5n8BQL7/I4B7PwuARP97gCP/boAff1FAHP9AADd/Y4
AHf4KAa3/TALu/yQD+/+tA///CQT9/0oE8v92BEj+uQRB/lIGRv6TBlH+tAbn/YQE+P3NAyj+rgM+/skDQv7hAw/++QO7/Q8EtP0xBNj9awTy/ZEE
//2jBAb+rQQD/qgEAAAAANMAAAAAAAAAAPjPP1g9hxruqbA/gAAAAAEAAACoFPs+ySIdP4DtcAyA7XAMgO1wDIDtcAyA7XAMgO1wDIDtcAyA7XAMg
O1wDIDtcAyA7XAMgO1wDIDtcAyA7XAMgO1wDIDtcAzH7OEVfvb3FvPxCxEF7S0OSewnDAXrawzd6i8MIOrCC6vpjgsv6FUP9eajEWrrFATj6gAA1P
QqCm/5/QtK/F4M4f1RDLv+ewx7/3IM//8gDCz+hw4W+iMNvfd/CUz38Qj69lgJmPbmCXb3egoZ+H0Kp/gxCiX59gmS+ccJ9vmuCUX6mQkK+UwL/Pi
QCxv5Tgu87GQLn+olCpjpEgr46D8KuO1dDdHtiRCv6bgHOek9Bn3p+AWq6fEFYOn+BcDoMgYAAAAA1AAAAAAAAAAAFNA/7gYOiPOfsD+AAAAAAQAA
AMPzZTxKtnU/d/1rAXf9awF3/WsBd/1rAXf9awF3/WsBd/1rAXf9awF3/WsBd/1rAXf9awF3/WsBd/1rAXf9awF3/WsBd/1rAXf9awFm/bUBTP2cA
QX9HgJz/MYBUPzzAQL81gE0/HwBVfxSAWP8SQG2/OsAwPzRALH83ACT/OkAT/zcAM/9yAGE/lACxf6ZAtv+wwJ6/qsCXP6pAlH+qwJK/qkCYf6RAp
f+kAIE/2MCV/9XAp//XALG/1YC3v9aAur/jwLz/9wC//8IA8P/HgO8/1UDrv+KA53/twPB/t8BYv0wAtL8IQKR/AICa/ziAVL8yQE+/LMBLvygAQ/
8YQAb/A4AHfwAAAAAAADVAAAAAAAAAAAo0D/S5HzNCpawP4AAAAABAAAAG6OrPvMeVj+k/WkDpP1pA6T9aQOk/WkDpP1pA6T9aQOk/WkDpP1pA6T9
aQOk/WkDpP1pA6T9aQOk/WkDpP1pA6T9aQOk/WkDpP1pA9v/KAX9/c4Fbf23Bsr8eAfx/oYC6v59Asf99AQv/ZQE6fw6BM38GwS6/AoElfz1A3/83
gOl/D8Ef/wzBDr8LgQ8/xgDc/+UAtX/qwLB/+ACif8+A1D/hAMk/zUDLP+cAlz/bQKH/3QCs/+MAuL/qgL//8AC0v/lAtP8EwIO/AUCqPs3Alr7jw
Id+98C9/pQA+/6rQPU+h0EpvogBJH6EgSE+gEEf/rvA3r64QNz+tgDk/rcAKT6MQDA+gAAAAAAANYAAAAAAAAAAEDQP3yT5bUzjLA/gAAAAAEAAAC
k3Tk/iMdaPyDx+BEg8fgRIPH4ESDx+BEg8fgRIPH4ESDx+BEg8fgRIPH4ESDx+BEg8fgRIPH4ESDx+BEg8fgRIPH4ESDx+BEg8fgRgfg+C+/5xQgz
+wQH//+jGND+MxmB/h0Zj/3nGGr7exhV+vgY6PneGlP59Bv5+Pgb5PjiG5z3axvt87QWCvSQFZnrcB8P6fEgv+jWIO7ozyBq6PYgHOgMIQDoHiG17
Gwgue5eIGLvMB/W7rMfse2kHdns/ht47KAaY+ycGe/hlxN43tIRJd3jEI7cWhBo39IFiOHGAzHipQLt4mkBgOO4AOfjVQA95AAA8uY7AD/pdwDh6q
AAsvJtCnL5bgsAAAAA1wAAAAAAAAAAVNA/op00DW6CsD+AAAAAAQAAAF5THD+gFms/GAYG+xgGBvsYBgb7GAYG+xgGBvsYBgb7GAYG+xgGBvsYBgb
7GAYG+xgGBvsYBgb7GAYG+xgGBvsYBgb7GAYG+xgGBvukBo75iQbP+Y8G7vrcBZr7vwVR+7QG2fyjBzz9KwgX/I0Je/pJChn6mgsl+aoMlfjlDNL3
YA3A99cN2vdyDuD3YwjF+kAH8Pu+Bi/8OAYw/MQFE/xTBm39wAZg/l4Gr/3yBRH9WwWH/M8EEPyBBJH7xASV+1MDRP+xAv//KACZ/wAAh/8jAJL/Z
gCO/7kAdv/vAGH/CgFN/xABPP/8ATb7ugG6+kEBaPr4AFv6egXK+xIHR/zFB4L8Hgii/AAAAADYAAAAAAAAAABs0D+d1iyguXiwP4AAAAABAAAAYk
hIPiun8T5SBNr4UgTa+FIE2vhSBNr4UgTa+FIE2vhSBNr4UgTa+FIE2vhSBNr4UgTa+FIE2vhSBNr4UgTa+FIE2vhSBNr4UgTa+BAGvPVBBeL1+AX
X9P0FPvUUBlP1HQZT9ZwBFffFAHH4kgDP+q4AO/w6ADr9AAAR/LIBD/s3Avf5VQL0+AwC+/g/Atf4ewLF+AsEmf0YBCD/BwSx/x0E8P8kBP//pgO3
/4ME+/n3BMX4QwV4+GwFV/iYBQ/4SwUs91QFx/aBBZj2uAWk9n0IH/XvCAn1NAnm9GEJ1PTkCUb1xwb1+SsG1Po+Bvr6VAYB+1cG+/pSBvf6UAb1+
lgG9fpdBvD6AAAAANkAAAAAAAAAAITQP+7xYjwWb7A/gAAAAAEAAACIbdY+zN4+P4D9fwWA/X8FgP1/BYD9fwWA/X8FgP1/BYD9fwWA/X8FgP1/BY
D9fwWA/X8FgP1/BYD9fwWA/X8FgP1/BYD9fwWA/X8FuPr9BvD+fQay/8gG//8vB3D9cwRu/UUETf3yAxz9vQP8/csCLv6KAUr+5wBf/mYAiv4AABb
+gwLu/aMDof0ZBDz9aAX9+1YFhfuQBav78AWu/IAFbP1oBv76Vggn+kII0/kFCK753gee+ckHm/nGB6D5wweo+cEHpPnHB5P52QcY+lEIV/o2CHP6
ygfi910DB/f1Aa72XAGI9hkBZ/dVAb/3TwH290IBH/gyAT74HQFY+WAFBPkjBkz8XgUAAAAA2gAAAAAAAAAAmNA/Azc5sINlsD+AAAAAAQAAANlk1
ru//z4+HQwx9h0MMfYdDDH2HQwx9h0MMfYdDDH2HQwx9h0MMfYdDDH2HQwx9h0MMfYdDDH2HQwx9h0MMfYdDDH2HQwx9h0MMfaeCk/43Qdp90kHxv
ZyBaP4ZgQK+doGF/m3B6j4LwhE+PcHCvi6B9T34wZY90gGVfinBWX5BwUa+nIErPoOAeP+AAD///4E1fZOBpX05QYF9GEHzvOqB63z3gfB8wUI//M
HD/L59xEi+wMTLvt0Ewb7tRPY+ssTtfoJFA76JBTE+WQUN/qiFLr63RRY+icUwPrrEyH7ARSC+y8U1/vEFw37qxU8+5IUUvtuFLf7txR3/N8UBf0q
DuD4Kg3E9gAAAADbAAAAAAAAAACw0D9gUNvKAVywP4AAAAABAAAANwcrPpamSj8R/Y0CEf2NAhH9jQIR/Y0CEf2NAhH9jQIR/Y0CEf2NAhH9jQIR/
Y0CEf2NAhH9jQIR/Y0CEf2NAhH9jQIR/Y0CEf2NAqz9aQII/hYCUf48Aa/+MAHr/roBpP4NAhb85QPv+4ME4vuUBMv7owSH+8cESPvaBCD74ARH+9
cERPusBKn6RASR+uYDe/rKA536swL4/FMAqf0AABn+9wCj/pYB9v74AW3+BwJf/jACjv53Aqf+lQK8/qECzP6vAuL/3QP//ygE5v9SBNL/dAS//5A
Eov+TBFr/LQId/7cBC/+FAQr/agEh/1cBY/71AmL+MgOW/lIDuP5wA8P+fQPF/oYDAAAAANwAAAAAAAAAAMTQP2g1OlyQUrA/gAAAAAEAAAA10Eo+
0QlePgdqhNYHaoTWB2qE1gdqhNYHaoTWB2qE1gdqhNYHaoTWB2qE1gdqhNYHaoTWB2qE1gdqhNYHaoTWB2qE1gdqhNYHaoTWtGpVtyu34bws0gnAN
tes0M+8Z/RevbP3AcP//9ZYhPCySSrmfD7J4d80vt1EKFzXGR9h0bUZ0Mo0FtfDAAC+d6Yf5oAcM/KMZDsBk8k5H5jTNY/XyihQ5LAfRuhxGx3tBR
hC8PMTL/JzDqnxDApl7osHlekmCufbaQuI1/wLV9V5DDDSDwzmzxYMUc9eDb/Pfg5r0H0Ol9GQDUbTsgzL2TgO498OEZDiyGc01cqG7c20lCvJ4Ju
txXiUe8IAAAAA3QAAAAAAAAAA3NA//C0INS9JsD+AAAAAAQAAAJ52Dj8kOmQ/6/jwA+v48APr+PAD6/jwA+v48APr+PAD6/jwA+v48APr+PAD6/jw
A+v48APr+PAD6/jwA+v48APr+PAD6/jwA+v48ANG+mMG4PqfBzj32AZQ9gAAkPMJAuL3QgRo+EQErfhiBCH5KAT4+FQEh/gnBRD4ogUQ+NQF/ve/B
aj4+wQF+bcF1fj3Bab42QWR+NUFjvjVBYH4zgWn+B8GGvlYBnb5xQao+SUHQfn2BiT5iQbo+Z4FHfo3BSr6AAVC+tEEafqnBGD6hgRX+nEEgPpzBJ
/6mwTM+tUE+fryBH38BwFq/CwATP++Av//kwPt/+kDEvsqBRX5ngUY+L0Fffe6BQAAAADeAAAAAAAAAAD00D8o77Qm3j+wP4AAAAABAAAAtGz7PsX
GAT/xbdSS8W3UkvFt1JLxbdSS8W3UkvFt1JLxbdSS8W3UkvFt1JLxbdSS8W3UkvFt1JLxbdSS8W3UkvFt1JLxbdSS8W3UkhtAR70dEf//AwTG/jc5
PezcRGjuu0VR6/FL9elQUbHpOVOT62RieNkFPHfJYSkRvHQdKVZFhwN4H65xdjvAynFrylpuE8+YZuzS3GCR0y5Z69MrUSPFpE9UvXJRWLoGSzW1B
USplokIPJZjBRqYRQdel+kFeZvGAeydAABkqtYTDbeiGQy9shplwsoaLMjWGo9lXVwCSbF+ST97ko83op9QMsenmi7UrHseGeaDGgDuvxkx718ZeO
8IGZbvAAAAAN8AAAAAAAAAAAjRPzbQaQOdNrA/gAAAAAEAAAALwrY+vnkdP0QFZPlEBWT5RAVk+UQFZPlEBWT5RAVk+UQFZPlEBWT5RAVk+UQFZPl
EBWT5RAVk+UQFZPlEBWT5RAVk+UQFZPlEBWT5RAVk+dcBsPtNAhn8AACp/bQB5vvEAc776QLl+b0Cg/iUAkb3mAIM+bkCpfkJBIL6pAQ7+qsEk/e2
BKf3lgTM95QDgPdlA7j3PQU9+PYFSfgyBkf4XAZb+IYGjPjxBrH5OwdK+n0HwvrDC4H5Gw1g+coNMPnbDf/4Ew/f+n4P0PpFDiX6qQ3Q+WwNrPlqC
XD9gAiW/lsI3P5cCCv/bghj/4IIjv+NCLb/lAjc/5kI//9yCMr5zgfw97YDsvcAAAAA4AAAAAAAAAAAINE/ZBcGnmstsD+AAAAAAQAAAMkB1T4Oye
I+99n4I/fZ+CP32fgj99n4I/fZ+CP32fgj99n4I/fZ+CP32fgj99n4I/fZ+CP32fgj99n4I/fZ+CP32fgj99n4I/fZ+CP32fgjwMYmCZ3C+CR14+Y
lwuW6NNHlyjOd5Uc0zugQNRHtazY5+NkhjP0iFv//exIX/lkQBfddFUHvax3H6bIjM+C6KsHePzDk21U8UtonQWbZyUTD2LlIJM6ERdzLl0PezP1B
uM+6QX3kUmAu6WZg4+wnX+Dvy11T8QhdS+XpMs3bhSNs1gsb+dNMFD7SNA/Oz0wLo83NB6rLhgS5zE0C5ssAAEHNiAHEy2QE5skGB7/IXAkkyBwLK
sgrDAAAAADhAAAAAAAAAAA00T+NXRvKSSSwP4AAAAABAAAAfH4EP7xgNj80/fYHNP32BzT99gc0/fYHNP32BzT99gc0/fYHNP32BzT99gc0/fYHNP
32BzT99gc0/fYHNP32BzT99gc0/fYHNP32BzT99geE+ioKXf2zCyb9pwx8+zsOCfuVDcv6Jg20+tQMNvp1D8n8QhBD/moOR/7mCgT/6Qr//0MLCP3
iCln7Cgtv+mYL9PnKC5b5Agx++UwMQfgYCz/5ggqs+T8KePkLCvf45AmV+LAJd/hNCXb4kAhY+M0HO/g/BxT40gbZ93YGtfdqBqD2lAe59FUC2/NM
ARjzCAGb8sgAVPKEADXyNQA28gYAJvMAAHHzHwBu8x4AUvMzAIb4cwdx+p0JAAAAAOIAAAAAAAAAAEzRPzEI6ls3G7A/gAAAAAEAAACTxcE+HUQlP
2L69Qdi+vUHYvr1B2L69Qdi+vUHYvr1B2L69Qdi+vUHYvr1B2L69Qdi+vUHYvr1B2L69Qdi+vUHYvr1B2L69Qdi+vUHYvr1BwD6eQlg+ZEMMflhDa
n4UA2f+DcNSfhBDfn3Qw0r92EMIvfhC/b2Xgsm99cKNPf6CQb3PApc9xgLifeVC9v4XwuL+SQLIfrCCxD93ge+/XEHq/tDCK/70Qex+4AHpftMB6L
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
b/2HA2/9hwNv/YcDb/2HA2/9hwNv/YcDb/2HA2/9hwNv/YcDb/2HA2/9hwNv/YcDb/2HA2/9hwNv/YcDb/2HA2/9hwNv/UUCD/3KAen8AABo/AcAa
fxXAGf8MADw/EUBwvw8Alb7ygJS+t0DUv1eBBP+SwSD/kAEs/4xBNT+HATr/gkE//7vAxD/3AMd//YDQf/BA2X/iAOB/1gDnP8zA7j/PwPV/xYD//
+JAyr/lwP3/sYD//7tAwn//QMS//0DHv/fAgL9xgRB/IAF/PvcBeP7EwbY+zUGy/tQBsD7aQa9+4IGvfuYBqr7owZ5+64GUvvIBjH7jQRf+gAAAAD
tAAAAAAAAAABE0j+6/Hv8bHavP4AAAAABAAAAGg+QPhQyJT9D/IUBQ/yFAUP8hQFD/IUBQ/yFAUP8hQFD/IUBQ/yFAUP8hQFD/IUBQ/yFAUP8hQFD
/IUBQ/yFAUP8hQFD/IUBQ/yFAUP8hQFD/IUBavoPAJT65wBh+hcBefo7AXX6fwF5+gwCUfpvAiL6uAIF+vsCM/rDA4j67ANS+sEDu/sQBUb9MgVT/
hQF//7IBP//uwM4++EBlvm2Aaz4MQEL+NsAtve0AJj3nwBV+FQAWfhxACf50wAH+c8A2vjOAL/40gDD+NEAyPi7AMH4lABz+ToAW/kAAHz9/QFu/i
4Dkv7BA7L+xwPa/s4D9v7UAxH/0gMt/8oDSP/AA1j/rwNh/5sDAAAAAO4AAAAAAAAAAFjSPzgI+86gZa8/gAAAAAEAAABw+a0+S+tMP6YAavymAGr
8pgBq/KYAavymAGr8pgBq/KYAavymAGr8pgBq/KYAavymAGr8pgBq/KYAavymAGr8pgBq/KYAavymAGr8pgBq/KYAavxCAQ/7SgEH+/0AHvr8ABj6
vADT+aoBQvmwAX34ywGt9+sB1/a9AqX2PAPA9skC/PYkArv3JgG1920Ay/cAAP/3NAAU/FkACP1hAHX9awC5/XMA5/14AAr+dwAs/nYAJv6IAP79r
ADl/dcAo//fAP//6gD+/+AAt/8FAaf/FgGW/ycBVv9FASX/UAEN/1cBDf9jARP/SwEk/zIBFv8bAQL/DQHr/ggBz/7VAJ/+mACa/rIAhP4AAAAA7w
AAAAAAAAAAcNI/1fdWbO9Urz+AAAAAAQAAAOiZoD4st/Y+He8MAh3vDAId7wwCHe8MAh3vDAId7wwCHe8MAh3vDAId7wwCHe8MAh3vDAId7wwCHe8
MAh3vDAId7wwCHe8MAh3vDAId7wwCHe8MAlrw7wUS8YQGpvK8AYfy+QEx8i4C1/HBAsPxgwMD8v0DO/IrBNbyhwxD8wAOCfxjDoT9pRBP/9kRf/+t
Ef//lhG8+CUGsPZ9A832twKv9xACyvXzAurzggOu8uYDrfAXBSTwbQQY8JwEvu9UBZzvsQWY6mcED+tUA2vrwwKV64YCZut5AvHqSAKS6hkCNerwA
dzp1gGY6b8BnOmUARDqPwHi6sgAZuttALbrNADv6xMAGOwAAAAAAADwAAAAAAAAAACI0j+d2aGNWESvP4AAAAABAAAAlOEaP+Nuez8t+gMDLfoDAy
36AwMt+gMDLfoDAy36AwMt+gMDLfoDAy36AwMt+gMDLfoDAy36AwMt+gMDLfoDAy36AwMt+gMDLfoDAy36AwMt+gMDlv5VAeD/qQD//wAALv5GAe3
9EAaT/T4Hqv1qB9v9jQfp/aEH4f2cB0H9/AeN/TUHZf3xBlD9+QZ7/TAHiP35Bsn9Iwf5/WgHzP3PB/H9EQgL/jYIE/49CAz+JAg3/j4HXvuPAgz6
yQFB+cMBqvjQATP44AHV9/ABZ/UcAUX1FQFY9dcAkfXHAKz10ACk9c0Am/WrAJD1eQBP9VMALvVYAAX1twAv9VMBhPM+A5TzPwPA8yIDAAAAAPEAA
AAAAAAAAJzSP4SJ8+zbM68/gAAAAAEAAAANZAQ96IGsPl4DN/VeAzf1XgM39V4DN/VeAzf1XgM39V4DN/VeAzf1XgM39V4DN/VeAzf1XgM39V4DN/
VeAzf1XgM39V4DN/VeAzf1XgM39V4DN/V1AxX5agTs/owEef+CBFX/PQT//zIFXP+KBg/+4wch/m0Jd/6zChL+cAmm/NkHnPzVBtn81gbQ+g0Clfd
iAJz2CwA+9gAAB/YCAST2mgDs8hcBzfJ7AfDy1AH88hQCIvM9AlbzVgKB82QClvM1Anrz+wE184oB/PL+ANTy2ADj8tUAEPPoAEjz/wBr8xEBdvMK
AW7z+gBh8+4AWfMOBfzwKAYM8GoFOfIvBWvyNAVv8v0EnPIAAAAA8gAAAAAAAAAAtNI/G9xkRXkjrz+AAAAAAQAAAHCGIz+1hEM/UxHi91MR4vdTE
eL3UxHi91MR4vdTEeL3UxHi91MR4vdTEeL3UxHi91MR4vdTEeL3UxHi91MR4vdTEeL3UxHi91MR4vdTEeL3UxHi92MGifKoAcjzyAF+8eMJdvSyDV
b1hxDo9WkS+fVVE632jxO09i0R/vWaEU/1PRKX9AcTVPSbE0L08BT//6UXFvroF5L3DBjN9lsYu/bsGav2ZRmr9U4YmPURFVn0RRP98w0S0PMkEKX
06Q4j9ekNrvQXDrTzfQ5O824OJ/M1ELr0nRDW9TkFTvh/Atz5eQGx+toAKftZAHv7AAC6+yEM7vNJD3XxKRCP8IAQ+u/iEnj6OxVR/gAAAADzAAAA
AAAAAADI0j/65ApTMBOvP4AAAAABAAAAyNMSP2tJJT/58XUY+fF1GPnxdRj58XUY+fF1GPnxdRj58XUY+fF1GPnxdRj58XUY+fF1GPnxdRj58XUY+
fF1GPnxdRj58XUY+fF1GPnxdRj58XUY0e7PFSDtOROu6jgRC+v5CDTpawPF5wAAyutkAF7qhwqd8EQTSee7FWTgdBfr3WkY+t3dGFbeVhna3joZtd
/BGAngrxjo6AIa7eZzHPDz/CzI8joxD/L/MqbxITSV8SA11P1wKP//ViTz/w8ihf+2IBn/1h++/j0ffv47Hwz/NR78/vIclP2fHtX8LR+n/GQfwfx
yHwD05xLS8nEQLvQaEgH2ThOq9jcTC/cKEwz3dBP29loTAAAAAPQAAAAAAAAAAODSP1lY8tIAA68/gAAAAAEAAABkaFo+65o6Pzz9pgI8/aYCPP2m
Ajz9pgI8/aYCPP2mAjz9pgI8/aYCPP2mAjz9pgI8/aYCPP2mAjz9pgI8/aYCPP2mAjz9pgI8/aYCPP2mAjz9pgL4/GYAm/0+AML9GAC+/TAALv1sA
NL8zAHD/JsCx/wAA9D8RQMp/ZQDZv3AA33+dAON/28D6/+eA/n/pAP//6cDS/+wAyX9DAWc/CYFUvz1BCf8twQO/IkE8ftvBGD8hASS+xoCX/teAV
T7HgFU+w8BS/szAUL7SQE8+1UBNPteASz7ZgE5+zcBJvsUAej8TgA5/RgAWP0AADP+lgJ3/lIDf/6ZA4X+wgOP/uQDm/7zA6f+9gMAAAAA9QAAAAA
AAAAA+NI/8AYbg+ryrj+AAAAAAQAAACiKYz9khH0/x/ZxD8f2cQ/H9nEPx/ZxD8f2cQ/H9nEPx/ZxD8f2cQ/H9nEPx/ZxD8f2cQ/H9nEPx/ZxD8f2
cQ/H9nEPx/ZxD8f2cQ/H9nEPx/ZxD3L72Qs3/awKUvzmBfD8NAL//wAAcf1sB5T6nwtv+ZUNRvkNE133dBeX9fEYmvT0GSfsOBk/6wcX4epSFY/qG
hQY6gQTWemoES3ngA5r5dkMYeRcDEXkEQz96cMKd+nUCoTs+wtK7rYMaO8XDajwggtv8RkLtvE0CxLwOgnb724IQPGSBg/yxQey8ocIS/NZCLjylg
ij8isIKPesFpv3ehmq9xEb8fZPHOX1Rh0U9UQeVvTIHgAAAAD2AAAAAAAAAAAM0z+Gc3Mi7eKuP4AAAAABAAAAXBO4PBmWkD6aBsX7mgbF+5oGxfu
aBsX7mgbF+5oGxfuaBsX7mgbF+5oGxfuaBsX7mgbF+5oGxfuaBsX7mgbF+5oGxfuaBsX7mgbF+5oGxfuaBsX7mgbF+x8LLfv+DCL7Ew1A+2wMrfrZ
C3D6dArX+l4JWPt8DEj97g3J/EoO2vsbCV//7Qf//5oHOf9EB0v9XwYi/bcFQv1DBS39gwX8/LsFCPypBaT7pAWD+8AFi/v1BdH7IgYH/DoGJ/xBB
jH8QQYY/CsGOvwuBlL8VQZk/IoGoPymBlb9tAbT/cIGH/6yBkH+lgZH/nkGT/5/Bmz+Fga4/YgFRf1qAID8AAAL/KYAJvyBAEj8AAAAAPcAAAAAAA
AAACTTP4SB1HAI064/gAAAAAEAAACTN7E+I+fBPt1KAM3dSgDN3UoAzd1KAM3dSgDN3UoAzd1KAM3dSgDN3UoAzd1KAM3dSgDN3UoAzd1KAM3dSgD
N3UoAzd1KAM3dSgDN3UoAzd1KAM3dSgDNaCR4xQAAAdnJANPYdAHQ0XUCPs31IeHH/zS3xLs/iMR4RzPEl0uHxNo+k74MMAm9BiylvjItXb/UMYG8
LzHnu3E6ErqZPbfDGUCBy4BCJc+ZQ3TQz0IQ3tFUSvodU0b8GlNU/WFSGv60UUr/GlH///JINfeYQbL1NT9M+Cg+Y/o2Pa77zDzb/IE8zP1yPHD+z
llRy8hpsLpIRwaz7T7irfM7UatNOgqqJjlmqWY5E6cAAAAA+AAAAAAAAAAAONM/2Tv9LjzDrj+AAAAAAQAAAEmsGT0+/Zs+aP3MCGj9zAho/cwIaP
3MCGj9zAho/cwIaP3MCGj9zAho/cwIaP3MCGj9zAho/cwIaP3MCGj9zAho/cwIaP3MCGj9zAho/cwIaP3MCGj9zAgO/1EL//8YCbL+ewtf/j8LEPw
BC9z6VQjc+e8Idfl6CVv51gli+RQKlPlJCtn5egoj+qEKt/wNDPj8tQv//FMLFf79CZn+pwmM/owJaf44CU7+6ggy/rUIu/qlBWj62AT1+ZMEZfl0
BOX4QQTd/PABW/3VAEL9SQAI/QcA0PwAAJ38AgBv/AUAff0rAan+IwGW//UAYPyABbr77AZZ++oHBPvDCKf+Awtg/0IMhf//DAAAAAD5AAAAAAAAA
ABQ0z+bs44eiLOuP4AAAAABAAAA30/UPnK7Fj8kDIP1JAyD9SQMg/UkDIP1JAyD9SQMg/UkDIP1JAyD9SQMg/UkDIP1JAyD9SQMg/UkDIP1JAyD9S
QMg/UkDIP1JAyD9SQMg/UkDIP1JAyD9VIHtvO8BlXyfgZA8kMGofEPBl7xdgUS8QQGUfIwBd/xBQnb8xkLe/RrC+/zoQss81QMkfL9CDfuJQh/7Rw
INO2lB9PsKAdq7M0GbuxKBsvsTQc99iwGKPgRBSD5bgaD+SoGG/rkBVr6egAj/j8Amv8AAP//HQDt/TcAs/xNAFb8BAkC/IoLUfxpDKD81QzX/CcN
Af2FDSL90Q1J/QMOd/0aDq/9eg6P/TcP0P3cEjr8AAAAAPoAAAAAAAAAAGjTP731BwLso64/gAAAAAEAAAAtk0g/Xv9jP3gQcfR4EHH0eBBx9HgQc
fR4EHH0eBBx9HgQcfR4EHH0eBBx9HgQcfR4EHH0eBBx9HgQcfR4EHH0eBBx9HgQcfR4EHH0eBBx9HgQcfR4EHH0FBFk9f0O0vW7Dkr13Qtg9UQJHf
VuEP//JwvA8t8Oa+4tEsPsCxWD7PkWd+zcFuPvjRd07/AY8O0VGzfsMR1g60YfpOrCINvpmCEl6RYibuhTH4DrQhg460wUL+8MEe/xYA748ncLTPM
FBCz2EwJ79TIB0/SUAHv0AAA19OQJXPkyCwn7LQ6n8eEORPAiDzzwQw+g8JAOMPG7Da/xlQ3H8ZwNxPHJDbbxEQ6f8VsOg/EAAAAA+wAAAAAAAAAA
fNM/SRfCnGeUrj+AAAAAAQAAAIWU6T4QwmA/IQQm+yEEJvshBCb7IQQm+yEEJvshBCb7IQQm+yEEJvshBCb7IQQm+yEEJvshBCb7IQQm+yEEJvshB
Cb7IQQm+yEEJvshBCb7IQQm+yEEJvurAtT6VgdC/6IGEv/IBf//NQfl/t8Hqf34B8n8Twfz+0UHgPtgB0r7rwd++y0Imft2B7b7Swfz+xgH8/sIBz
H8+gZQ/fIG5/3fBib+qgY8/nsGOv5QBi7+PQYH/lcGuf2EBmf94gXX/NwFjvyqBcn8hQXj/JUFT/0UBD36PwRV+XsEBPmaBM34lgSH+JMEU/iUBC3
4mAEi+pcAv/o5AOb6GADf+gAArPh2ACH4vQDX9wAAAAD8AAAAAAAAAACU0z+GV+yy+oSuP4AAAAABAAAA16g+P8vCQT/IhiYUyIYmFMiGJhTIhiYU
yIYmFMiGJhTIhiYUyIYmFMiGJhTIhiYUyIYmFMiGJhTIhiYUyIYmFMiGJhTIhiYUyIYmFMiGJhTIhiYUyIYmFIlBXX3TJs6QyTIllQEpQqYZIC+yT
yWtePMtomevPPRbk7ArJ5bIBiARytodNrlLGluq5xjvspshqrguJBTBJBTSyP0Jr8sqBdjM4AKe1IISwuXCFvjwHBkB6VoMEOkAAHXqKycM66Y9gu
00SAnyuE8Y9mpV5fjOWUv8Wl3//1Bg+rDgY76MZHGLeth8/0p5T1JF9UdTRKNGG0XVR6dM0VNnUq1S4lV5TrFUF0s8Th9IAAAAAP0AAAAAAAAAAKj
TP4JXiAmlda4/gAAAAAEAAADdbi0/mHtXPyj0eAwo9HgMKPR4DCj0eAwo9HgMKPR4DCj0eAwo9HgMKPR4DCj0eAwo9HgMKPR4DCj0eAwo9HgMKPR4
DCj0eAwo9HgMKPR4DCj0eAwo9HgM/vc/CMb43wZC+ToHUPoVBsz67QSE+YgNJPrID9n6jBCe+44QovxNEAr5uBFs91oR2vaNES/wFA5H7x0NR++oD
IfvZgyf7yUMbe/sC5vvWwx18FwNx+/ODLLuYQx47hUMr+/mDP/v4gwa8KgMT/LBDm/zlA6j82UOFPMgDjLx7Q7t8ekL3PmfCs77Awlw/AsIsPxzB9
P8Awfu/MQGiv2pBkX+vAaL/ukG5v8FAv//AAAAAAAA/gAAAAAAAAAAwNM/ZmZmZmZmrj+AAAAAAQAAAJWK+D2zQyM/Q/4GA0P+BgND/gYDQ/4GA0P
+BgND/gYDQ/4GA0P+BgND/gYDQ/4GA0P+BgND/gYDQ/4GA0P+BgND/gYDQ/4GA0P+BgND/gYDQ/4GA0P+BgOQ/RgD2/wMAwb9GwMS/dACnvwWBPL7
yARu/OEF4/ykBoP9xAXK/U8FTfwrAx/8zAIS/JcCBvx8AuT7fwKm/ooBIf/OACL/bAAe/zgAmP9tALb/bwCp/4QASv9YACz/IAAK/w0A5/4AAAr+D
QCj/UsAdP17AGf9lgBf/agAW/27AJv+vgOF/roE2P6mBEz/iwS3/44E4/+EBPH/dQT//3IEhf+VBBX/qQTR/tUEs/4jBQAAAAD/AAAAAAAAAADY0z
8k4iGQPleuP4AAAAABAAAAxCYcPwPMYz+K+xUEivsVBIr7FQSK+xUEivsVBIr7FQSK+xUEivsVBIr7FQSK+xUEivsVBIr7FQSK+xUEivsVBIr7FQS
K+xUEivsVBIr7FQSK+xUEivsVBBD7ewMO+cgFdfkeB6r3IwmM9igKf/z/B/P9+weE/lsIvP6wCNz+1Ajv/l4HxP/zBvz/KQf//6IFn//HBET/YgQE
/zMEqv4zBDP+fQTt/bAE//3OBF7+0AR0+ZwCePikAdH4oQEi+ZcBXPmIAaP5dgH++VMBL/obAcb5tABs+AAAAfhcABn4fQBc+G0AVPudBXn7bQdb+
10IR/vOCPn6Hgn++mUJKvuwCS373wk++/gJAAAAAAABAAAAAAAAAOzTP+erHU4tSK4/gAAAAAEAAABx6Jg9JR18PxX/zQIV/80CFf/NAhX/zQIV/8
0CFf/NAhX/zQIV/80CFf/NAhX/zQIV/80CFf/NAhX/zQIV/80CFf/NAhX/zQIV/80CFf/NAhX/zQIV/80CNv59ARb+ZgFi/rQBUf7iAU3+5QFN/tU
BC/8XAqH/SgL//2sC6/+TAmT+IwKn/kYCxv4UAtH+AALT/ugBqP4MAnX+DAJO/ggCMP4KAiv+EAIn/g0C/f6hAD3/QQBh/ysAgf8jAJb/HwCo/yAA
rf8bAJn/AACU/kwAf/5/AHD+qQBn/sEA4v5JAgn/4QIh/x4DLv8qAy//GwMs/wkDSf/YAn//qwLC/90CuP/+Apb/BQMAAAAAAQEAAAAAAAAABNQ/x
q+AaDI5rj+AAAAAAQAAAIU0sT4MntA+z95AGs/eQBrP3kAaz95AGs/eQBrP3kAaz95AGs/eQBrP3kAaz95AGs/eQBrP3kAaz95AGs/eQBrP3kAaz9
5AGs/eQBrP3kAaz95AGs/eQBrP3kAaC+qEES7qjxHn7XsNPvEcCuv3VQYp/fsB//8AANX/DgIR/zgEuubvGyDhQSLH3vgknt1MJl/dEyf32t4nGtz
4KRHd0jWc3kY23t4TNf/dcDNX4Ew0jeM/NjjZ9CX611Ala9cuJ+XWrinD1ZorbdPUKffQeSddz2omDM6zJdbM7iS7y30krso3JLrJACQ20KQgl9W3
HRjhJQgV5eUD5uYiAw7o9gLt6OkCtenSAgAAAAACAQAAAAAAAAAY1D9bfzKoTSquP4AAAAABAAAAqQXnPd2Rez4G9l4OBvZeDgb2Xg4G9l4OBvZeD
gb2Xg4G9l4OBvZeDgb2Xg4G9l4OBvZeDgb2Xg4G9l4OBvZeDgb2Xg4G9l4OBvZeDgb2Xg4G9l4OBvZeDgb2Xg4A8E0L5fAxDILw0gte70UH1+mHAZ
nqPQE665YBXut+AYrsJgGK7ecAEO6nAEnuAAC08lsD3f3vCUr/1gpS/SIKkPy3CMr76we4+/MH8fuvCOD7GAnO+c8KwviLCyH4yAt/9wsM6vYxDMj
1VQw09sILwvYwCzv3rgqs90cKHfjpCZr4gAlI9UYWu/J0Ggn6DRV4/LwUz/18FbH+KBZC/6EWkP9IF8H/Mhj//9AYAAAAAAMBAAAAAAAAADDUP5z+
19Z+G64/gAAAAAEAAAB+xvA+sxVFP9D8uQjQ/LkI0Py5CND8uQjQ/LkI0Py5CND8uQjQ/LkI0Py5CND8uQjQ/LkI0Py5CND8uQjQ/LkI0Py5CND8u
QjQ/LkI0Py5CND8uQjQ/LkI0Py5CK77cgx8+b0KQfdJCqD1NAoJ920KjfmXCq/6awoe+5YJOftFCXf7owmL+2AJhvs/CX/7pQnS+vcKfvpLC2f6UA
uE/nkHef91BXX/fgVE/FcFZPvlBP/6igTE+kQEnfoDBHj6ugNZ+oADOfpVAxr6QgM++mEDTfpaABL6AACz/F8F6v3oBnf+VQe9/oEH5/6hBwD/vwc
M/8QHKv/EBwH/hAcV/8QHeP9OCP//hQgAAAAABAEAAAAAAAAASNQ/niLQvsUMrj+AAAAAAQAAAHfsBj+CyW0/y/xGBcv8RgXL/EYFy/xGBcv8RgXL
/EYFy/xGBcv8RgXL/EYFy/xGBcv8RgXL/EYFy/xGBcv8RgXL/EYFy/xGBcv8RgXL/EYFy/xGBcv8RgXL/EYFjf8QAv//8gHj/lQAy/6yAMT+HQG5/
k0BT/7kBSH+Cwf2/VEHnv1CB4X9BQfP/HcHSvyyBxf8uAcb/MkHKvzXB9H7Gwhf/KEIvPzVCAX9Lgk//bIJJ/3TCDX9dwhN/VwIlv2DCM79hQju/Y
IIC/5+CBz+dggo/mQIMv4bCCr+pgcX/lwH+/0zB739EAe0/d8GyP1tBmT9QgZU+lQEMPtyAfn6gwBt+iAA4PkAAAAAAAAFAQAAAAAAAABc1D/UwTA
rIv6tP4AAAAABAAAA3/j1PgF+Rz+zAgH5swIB+bMCAfmzAgH5swIB+bMCAfmzAgH5swIB+bMCAfmzAgH5swIB+bMCAfmzAgH5swIB+bMCAfmzAgH5
swIB+bMCAfmzAgH5swIB+bMCAfldBYX0KgI39NcAHvLDAK7x5ACX8eMAqfHNAKDxtACG8fYCg/SWBZH2RAZO95QGePdzBmP3qAGO+wAAvPwwBWT8n
Abc/M8GUP37BvT9SgeP/pkHCv/YB2b/Dgim/z4I2v9YCOf/eAj///QGQ/8SBsj+YwR2+cYDfvd3A5L2owK593YCV/dxAv32dQLF9okCrParAn/2wg
JZ9s8CU/bXAlf26gIz9u0CC/bhAvb1AAAAAAYBAAAAAAAAAHTUPzh1w+eT760/gAAAAAEAAAA3zcU+1gpQP+n8hwHp/IcB6fyHAen8hwHp/IcB6fy
HAen8hwHp/IcB6fyHAen8hwHp/IcB6fyHAen8hwHp/IcB6fyHAen8hwHp/IcB6fyHAen8hwHp/IcB6fyHAbv9DAG5/fcAPv3AAWb77wFl+toB7/my
AZf5eQEe+UsBpPgcAYv5YgHU+V4BvPkiAY37qQQF+oMD3fnCAzf6VAS2+qcE2PuLBCD/3QJS/2UBSf+fAFD/OgBi/wsAef8CAIz/AAB9/wgAD/8WA
CH/GwA8/yUAT/81AGX/QACE/zYAm/9PAKL/fQCz/58Axf+rAN7/pQDu/5UA9/+IAP//fQAt/T8DSPwHBPn7OwQAAAAABwEAAAAAAAAAjNQ/KYoCwR
rhrT+AAAAAAQAAAIebsT4UkTY/VQOU/VUDlP1VA5T9VQOU/VUDlP1VA5T9VQOU/VUDlP1VA5T9VQOU/VUDlP1VA5T9VQOU/VUDlP1VA5T9VQOU/VU
DlP1VA5T9VQOU/VUDlP1VA5T9GgDx+wAA+vsIAC/+egGO/mYClf7LAqL++gLK/iEEM/9FA///5gG//3sB7f5WAVn+SQEE/jYB7f2RAdP7AgIg+wEC
8/rkAej6ygHl+vcBDPtQAlj7ZwKG+/cC5PxuA479bgPu/LkCp/yZApX8nAKM/OcBoPyTAZr8cwGN/GABh/xQAZH8GQVV/iQGqv72A8H97wOF/RIEQ
/05BPn8XwSu/IgEdfybBCn8rwTg+wAAAAAIAQAAAAAAAACg1D9gBBaEttKtP4AAAAABAAAAfD76PIBNIz9hArj+YQK4/mECuP5hArj+YQK4/mECuP
5hArj+YQK4/mECuP5hArj+YQK4/mECuP5hArj+YQK4/mECuP5hArj+YQK4/mECuP5hArj+YQK4/mECuP4FA0X9NgMm/oYDZf6OA6P+mgPf/qUDC/+
yAjf/SQJe/7wA//8+AMT/DwB6/wAASv8DADH/SgC4/jMAgf4RAGf+GgD9/joANv9YAEf/dAAm/5oA/P64APj+GwK8/lkCw/5uArD+eAKo/nwCqf58
Aqz+ewSf/6IE0P+tBNn/rwTV/6oE0P9QBD7/KgQr/7wBZP4dAXf+2gCf/rkAwf7GAOr8QQFZ/M0BJPwWAvP7AAAAAAkBAAAAAAAAALjUP8Cv0P5mx
K0/gAAAAAEAAACFD109WixqP1sC/f1bAv39WwL9/VsC/f1bAv39WwL9/VsC/f1bAv39WwL9/VsC/f1bAv39WwL9/VsC/f1bAv39WwL9/VsC/f1bAv
39WwL9/VsC/f1bAv39WwL9/c8DU/wrBBD8kANk/AQDo/wOAmv89AHM/JMA4P1CAED+GQBg/gAAb/6WAYj/JgLU/2MC8v9+Av//hALh/3IC0/+hAk3
+rQL+/bcC6v3GAun93wLy/f8C+/0VAwP+LAMM/v8C2f3rAsT95wLD/eUCyP32Aq79+wKP/TsDZ/1NA1j9SQNT/UcDS/1iA0b9cwMm/XcDFf03A8j8
BwOw/OICrPzCArb8rwK+/DwBo/wAAAAACgEAAAAAAAAAzNQ/jkGt/yu2rT+AAAAAAQAAACiWlT5rXl4/bwIT/m8CE/5vAhP+bwIT/m8CE/5vAhP+b
wIT/m8CE/5vAhP+bwIT/m8CE/5vAhP+bwIT/m8CE/5vAhP+bwIT/m8CE/5vAhP+bwIT/m8CE/5vAhP+lAPJ/YwDhf3DA1n9yQLU/QICdf43Ajf+SQ
L//cwCLv4iA0T+rgGr/3EB//8eAdX//ADE//cAvP/oAL//zADM/94A5v/OAO3/tQDl/50A1v+JAMj/AABX/xQA8v4NANT9XAAp/ooAQv6pAEX+hQA
8/pcAUv7RAvD9VQMh/noDOf59A0j+cwND/moDG/5rA/f9agPn/V8D0f1eA4X9UQNR/UQDNv06Ayj97gT8/gAAAAALAQAAAAAAAADk1D+qiMtVBait
P4AAAAABAAAAVuhsPcFwMj83/SECN/0hAjf9IQI3/SECN/0hAjf9IQI3/SECN/0hAjf9IQI3/SECN/0hAjf9IQI3/SECN/0hAjf9IQI3/SECN/0hA
jf9IQI3/SECN/0hAjf9IQL8/ScCLv1EAhf9JQL4/LsBiP3oARP+HAKB/ogC3P66Ajb/BAN9/2oCyP/uAer/mAH//2QBQf4vBMr97QSn/QYFiv31BO
P85QQF/bkECP3jBAD9AwXu/H4EwPxQBIH8PwRP/DQEz/oyAjX6oQHf+WUBqPlPAWv5TgEv+WoBAfpfAfD6BQAv+wAATfsbAGr7LgDY+6QAXfweAZX
8MQGI/AoBd/y/AGz9HwGd/Q4BAAAAAAwBAAAAAAAAAPzUP32s7dDyma0/gAAAAAEAAACetdQ+P0dbP/gDaP34A2j9+ANo/fgDaP34A2j9+ANo/fgD
aP34A2j9+ANo/fgDaP34A2j9+ANo/fgDaP34A2j9+ANo/fgDaP34A2j9+ANo/fgDaP34A2j9+ANo/csC2PyBApL8hAHd/P0Ab/yeAML8ZgAO/RwAH
f0AACn9DQBX/ZgBOP9PAv//eAXv/f4FZf3UBS/9igVC/U4FsP1DBb/9PQWs/SUFmP0IBYT97wRx/egEWf3YBE393wQj/R0FMf06BYP8SAV3/IwFj/
wOBfT8KgSF/A0EVPwmBED8OwQx/D4EGfxBBAn8SwQD/M0DtfuJA377agNb+14DPfvWAm7+owJ9/6IC8P8AAAAADQEAAAAAAAAAENU/MHp1QfSLrT+
AAAAAAQAAAEBGHz+yvS8/wB4p7cAeKe3AHintwB4p7cAeKe3AHintwB4p7cAeKe3AHintwB4p7cAeKe3AHintwB4p7cAeKe3AHintwB4p7cAeKe3A
HintwB4p7cAeKe3AHintwB4p7Y8bT/TGHLr19x3n9sIgmPgrGZ74rBXz+EsRf/o3D4T8tRHu/qAV//9pF4f/egvR6G0JAeLtBzveAQjH3GsI6dzFC
WTZnApX2d4K7tneChnasQrN2SAIN9tDA2Ha3gCM2QAAhNi4B2vZ+gyL2VwQi9n5LPfiLDbZ5YQ4eebtOLHlSjku5bU51+S4OO/o9zfB65Yz1+yWJs
z2LST3+LQjX/m3Icj1OSB89AAAAAAOAQAAAAAAAAAo1T/0v2F4CX6tP4AAAAABAAAAAVWDPNMOQj/x/FAC8fxQAvH8UALx/FAC8fxQAvH8UALx/FA
C8fxQAvH8UALx/FAC8fxQAvH8UALx/FAC8fxQAvH8UALx/FAC8fxQAvH8UALx/FAC8fxQAvH8UALx/FAChPz3AVP8vgGN/JwA1PwAAPj7dQAQ/CwB
K/xWAdv8zwFj/QYCqv0OAsT9DgLZ/QoCPP/HAYL/qAGd/4cBrv9ZAeb/AgH//y0BR/9TAfb+dQPs/h4E2P5LBM/+UATL/lsE0/79A9f+2APV/s0D0
f7YA9z8wwI8/FcCBPwpAgT8GQIY/CYCJPw2Aiz8QwJg/HsCcvyRAnP8pQJ5/H8Ca/xuAun74gHo+9wBAAAAAA8BAAAAAAAAADzVP861S0cycK0/gA
AAAAEAAACksVE9vFwIPtLu/RLS7v0S0u79EtLu/RLS7v0S0u79EtLu/RLS7v0S0u79EtLu/RLS7v0S0u79EtLu/RLS7v0S0u79EtLu/RLS7v0S0u7
9EtLu/RLS7v0S0u79EtLu/RIN7cAMuOyEEOLr7xEy6tcScufFFGjluBY35C8YmPZmDWn7Xgv9/N0Kkv6jCgn+PQQ79wAAKvQcA5XzdQNk8ZsFM/As
BUjv4gLF73YDr/CABMTxjAWz8m0GgvNLBz/4hww4+m8QoPovDm368AzV+hoM//9bCy3/8Qpy/psKKv4XCjb+vwmI+z8OxvqTEK3qcxgY524Zg+WlG
TLkfhp04/MZJuW/I0/p3iUAAAAAEAEAAAAAAAAAVNU/0XNkgG5irT+AAAAAAQAAAN4vDj887FU/awMK92sDCvdrAwr3awMK92sDCvdrAwr3awMK92
sDCvdrAwr3awMK92sDCvdrAwr3awMK92sDCvdrAwr3awMK92sDCvdrAwr3awMK92sDCvdrAwr3awMK95wCe/g2B834WAhx+EMIt/cGCCj3Wgg+9mI
I0/VJCL71Zgj59b4IafYWCE72QQca91cGHvraBbH7vAWa/PEFSv2IAa79LQGb/j0BT/8YAaH/qADK/0cA4/8AAP//tgHt9xQCsvSuATb2+gEK9lwC
B/Z8Apn1ewJR9X8CWvWRApr1pQLF9bAC2/W1Atz1NQOy9bED3fUQBPb1JQSY9WQERfWiBAf1xQTg9AAAAAARAQAAAAAAAABs1T9XdXL2vVStP4AAA
AABAAAAyDx6Pz2Qfz+vpJ8gr6SfIK+knyCvpJ8gr6SfIK+knyCvpJ8gr6SfIK+knyCvpJ8gr6SfIK+knyCvpJ8gr6SfIK+knyCvpJ8gr6SfIK+kny
CvpJ8gr6SfIK+knyCvpJ8geqL2LjiT2i10iSgvkn+4L4J/vSyhe8Et33dTNU1zfDhMbegwc76hNuTQEzrn0hI7etBiOx7Kyj5Xy8tEu8jtS//L50/
x0EpSZ9amVGfl/Vog7hVYnfZqVf//c1Wi8DdTV+xgVOrtxlEr7bdOKaRfXdSTXV1Wj2V9ooywhb+Qo4GdmmI2oJtBFE6aagbymK4ArZc0ANWV6QBx
lAICb5QDAQGUAACEkSUAAAAAABIBAAAAAAAAAIDVP98oz3wgR60/gAAAAAEAAACELvk9ByxuP4P9lACD/ZQAg/2UAIP9lACD/ZQAg/2UAIP9lACD/
ZQAg/2UAIP9lACD/ZQAg/2UAIP9lACD/ZQAg/2UAIP9lACD/ZQAg/2UAIP9lACD/ZQAg/2UAIP9lACm/VYAFf4dAHP+CQDD/gAAd//NALn/0gDx/7
8A//+4AJz/yQBA/0cBf/5gAd/9XgFj/Q8BEf0GARP93AAx/akAVP17AHH/9gDH/9UA5v2VAZn9+AGS/ScCvf1XAuf9iQII/rgCAv41Avr9nAHk/Yw
B4/2BAeP9agHi/UYB7f1IAd79WgHL/WoBrv07AZ79JgG4/QQBwPyaAM/8gADT/LoA1PzuAMv8DAEAAAAAEwEAAAAAAAAAmNU/W4xk55U5rT+AAAAA
AQAAACV0CT9r9Fc/TvxsAk78bAJO/GwCTvxsAk78bAJO/GwCTvxsAk78bAJO/GwCTvxsAk78bAJO/GwCTvxsAk78bAJO/GwCTvxsAk78bAJO/GwCT
vxsAk78bAJO/GwCTvxsAur7aAIh+4cCZvrqAp76tgEa+wkB7vqZAQf7/wHr+gwCq/oAAvD8AABM/HsA/Pu7APT7DQEZ/CkBUfwdAbb8HAEr/eoEXP
3gBbj9sAa+/UkHhP11B1L9jgcH/bUGwvxeBpD8NgaD/AUGofzMBbz8rwXu/S8Gvv5XBkf/PQaq/ykG6f8XBv//bwX9/2sFg/o0Btn4XwZO+F4GXPr
yBfH53gWs+bsFrPmEBQAAAAAUAQAAAAAAAACs1T+h1aoKHiytP4AAAAABAAAAi10NP6L7Pz+1A373tQN+97UDfve1A373tQN+97UDfve1A373tQN+
97UDfve1A373tQN+97UDfve1A373tQN+97UDfve1A373tQN+97UDfve1A373tQN+97UDfve1A373qAKp9Z8CO/JFAr/vlQG+7xcB1e/QAKrvhQB+7
28Aae8kA1vycwbx9esIG/h0B43+mgrT/6QK//9lCsr/Tgqx/zgDf/t5AWD64QAy+pcASvpkAGr6QQCU+hMA9voJAD/7UwAw+wAAoPhCAHX4CQGT93
YBHviUAfT4YgJB+VoD6vjSA5r4CARj+CQEQPg+BCP41QO/9x4DO/fDAg33mAL99jQCCPcuAvD2AAAAABUBAAAAAAAAAMTVP6Mmpru4Hq0/gAAAAAE
AAABnuWg9KCMPP9cCRv3XAkb91wJG/dcCRv3XAkb91wJG/dcCRv3XAkb91wJG/dcCRv3XAkb91wJG/dcCRv3XAkb91wJG/dcCRv3XAkb91wJG/dcC
Rv3XAkb91wJG/dcCRv3QA7b8rQM9/ZIDtf3UA0v+RATd/vgDZ//JA8z/QQK4/GoBqfvjAL77EQHF+zkBrvtVAZX7YgGD+2ABg/sCAtr71gH5+6UBF
PyAASr8ZwE8/FMBOvxfARj8YAEW/NQA2/x/AD39OwBr/QAAfv2ZAPD86QCg/BEBbfwpAUf8OQEx/J8An/y6AFb95QCd/WkBUf6+AcD+8QH8/v8DRP
+1AgH/ygLY/+IC//8AAAAAFgEAAAAAAAAA3NU/R03kz2URrT+AAAAAAQAAAO/iCz4BeQQ/Qf3KA0H9ygNB/coDQf3KA0H9ygNB/coDQf3KA0H9ygN
B/coDQf3KA0H9ygNB/coDQf3KA0H9ygNB/coDQf3KA0H9ygNB/coDQf3KA0H9ygNB/coDQf3KA3P7KwWQ+jQGp/hGB2b4dgeC+JEI2/mhBEn5AQOJ
+tIBfPtKAf37BwHS+14A4fsVAP/7AACu+xMA+vpJAKj6fgBn/N0CEf03Axz9kQMQ/d0DA/0IBPf8CwT+/PYDKv3YA2P92AOj/eEDx/2WBO398wQ0/
uwEPP6LBCT+XATs/UQEmv0XBNP8mQNe/GYDMfxZAx/8VgML/+AEq//qBOX/3wT6/9kE///ZBAAAAAAXAQAAAAAAAADw1T9yjnodJQStP4AAAAABAA
AAPAWpPjkZfz/CAUb/wgFG/8IBRv/CAUb/wgFG/8IBRv/CAUb/wgFG/8IBRv/CAUb/wgFG/8IBRv/CAUb/wgFG/8IBRv/CAUb/wgFG/8IBRv/CAUb
/wgFG/8IBRv/CAUb/LwK4/0UC0f+NAHH/TQBN/5UAGP92AAn/TwAH/y0ACP8bACX/DgBG/wAAhP/gAKj/XgHK/6oB8//zAf//EgLn/x4CxP8jApz/
JQKB/yYCcf+FAuz+xAKL/rsCY/6zAkf+qgI3/q8CFv6lAhD+nwIf/kYCcv4tApf+IwKm/hoCr/5ZA6j/gwOt/6ADqf/NBDj+DwWX/+wCY/8SAlf/w
AFH/5sBPf+EAT3/AAAAABgBAAAAAAAAAAjWPzB8A3v29qw/gAAAAAEAAAB4/AQ+Uk//Pl4DZv5eA2b+XgNm/l4DZv5eA2b+XgNm/l4DZv5eA2b+Xg
Nm/l4DZv5eA2b+XgNm/l4DZv5eA2b+XgNm/l4DZv5eA2b+XgNm/l4DZv5eA2b+XgNm/l4DZv5eA2b+NAUZ/voFaf5gBvL+cAZV/xcGwP/3Az/+jgK
n/AgCrPu1Aqj62gJI+gMDgvoSA876ywIi/IcCrPxWAur8SQIZ/SsCRP3QAVT91gCL/JAATfxfAET8LgBJ/DMA3PhiAR75swKE+c8Du/m1BOj5mwHP
+ooA4foAAO/6SACT+2ADcfwDBMb8FQTs/FAFH/+7BbT/7gXr/xIG//9HBuX/igax/6MGf/8AAAAAGQEAAAAAAAAAHNY/kdacv9nprD+AAAAAAQAAA
F3ZDj8T7Xo/YPyIBGD8iARg/IgEYPyIBGD8iARg/IgEYPyIBGD8iARg/IgEYPyIBGD8iARg/IgEYPyIBGD8iARg/IgEYPyIBGD8iARg/IgEYPyIBG
D8iARg/IgEYPyIBGD8iATp/RACqv4WAQT/ugBR/2gA4f/BAP//uADB/lUA9/0AADr9PgAB/Q0C1vxNA7H85AOP/EoEcfybBMH5eQYh+f4G+fhIB/f
4fQcP+aAH//k4Bxr6nQUc+j8FLvoKBS769QQj+vgEGPoBBVX63QSA+vsEvfr0BPT66wQa+/AEK/sDBTL7MAXY+gwFjvrZBGL6pQSJ/ZYGRf6VB7b7
uwXW+mAFa/pyBQAAAAAaAQAAAAAAAAA01j8dd+XCztysP4AAAAABAAAAxNkTPsNIVD8J/iQBCf4kAQn+JAEJ/iQBCf4kAQn+JAEJ/iQBCf4kAQn+J
AEJ/iQBCf4kAQn+JAEJ/iQBCf4kAQn+JAEJ/iQBCf4kAQn+JAEJ/iQBCf4kAQn+JAEJ/iQBCf4kAXD+uADj/qIAK/98AOH+XgGz/g0Cpf5tAqn+oQ
K9/rcCx/7DArL+KwKM/goCbf4PAoH+/AEd/wQBd/92AO3/SwD//wAA0P/dAJf/BAGX/zQBaf+5AUj/ogE3/4oBNv99AVj/fgHW/nsBef5mATf+YgE
L/mgB4f1eAWj8VAEd/BgB+PvfAOH7rQDT+4AAU/2RAMb9vgAP/vUAQ/4RAWL+HgF1/igBAAAAABsBAAAAAAAAAEzWP4JG+1zVz6w/gAAAAAEAAAC4
H6A9p9FRP1YBpvxWAab8VgGm/FYBpvxWAab8VgGm/FYBpvxWAab8VgGm/FYBpvxWAab8VgGm/FYBpvxWAab8VgGm/FYBpvxWAab8VgGm/FYBpvxWA
ab8VgGm/FYBpvxWAab8tgGT/PQBzfxoAfv8AACq+2sBrPqnASj6LwGE+xEB0vspAZD7PgFq+0UBWvtWAXD7YAF/+1oBgvtMAXX7RQFT+0oBO/unAa
T7HQL1+8IBM/yKAVP8cwFo/FkBlfxIAer8QQEe/T4BPP1BAU/9TgFb/VIBZv1KAWf9QAFn/TwBbP1JAU79WAFQ/V4BTv01AU/9IgFZ/T8BK/9nAaj
/QwHw/y8B//8AAAAAHAEAAAAAAAAAYNY/Wjx5Zu3CrD+AAAAAAQAAADcpmD7qq1s/3fxHAd38RwHd/EcB3fxHAd38RwHd/EcB3fxHAd38RwHd/EcB
3fxHAd38RwHd/EcB3fxHAd38RwHd/EcB3fxHAd38RwHd/EcB3fxHAd38RwHd/EcB3fxHAd38RwFb/c0Aw/13ACj+VABz/lMAjP52AHL+nACP/toAJ
v8eAYT/fAG4/6YB//+OAPH/AACq/zQArv8lAVD/1gEQ//QB4/7GAQf+CQFt/Z0ADf1nANP8TQC2/EkAo/xLABn8DQD9+wUABvw9AIj5rADX+EgBe/
iwAZz3kAKB95UCRPoMBAr7dQRb+5cEjfukBLH7qQTI+68E1/u1BE/8MAR5/NwDfPypAwAAAAAdAQAAAAAAAAB41j+/aHW4FrasP4AAAAABAAAAaHQ
MPv97NT96Agf+egIH/noCB/56Agf+egIH/noCB/56Agf+egIH/noCB/56Agf+egIH/noCB/56Agf+egIH/noCB/56Agf+egIH/noCB/56Agf+egIH
/noCB/56Agf+egIH/o4CE/4MAt78lgH7+yMBaPuLABH8AACC/A0Ccf6pAun+1QIX/9gCMv+yAsz+ZQLg/lECB/9JAhv/OgIg/zYCGf87Ag//QwID/
88C+f7YAij+ugL6/b0C4P0yA7T8VAOe/E4DS/1EA5H9OgOu/eABuv98Af//VQH1/0MB5P/3AdL/fgLf/8wAHv9uAMH+ZgBd/nwADv6TAPj9owD0/a
IA8f2aACv+AAAAAB4BAAAAAAAAAIzWP3sHfyxRqaw/gAAAAAEAAAD0EAI/3ZxVP+ADMvvgAzL74AMy++ADMvvgAzL74AMy++ADMvvgAzL74AMy++A
DMvvgAzL74AMy++ADMvvgAzL74AMy++ADMvvgAzL74AMy++ADMvvgAzL74AMy++ADMvvgAzL7JgOI/CUDgf1MA+L9TgPT/cMCxftnAnz6VQIw+qIC
WPrNAoX63QK4+dYC+/lPAu36DwJR+7IC1PsFAzH81wGB/HQBcPxpAVL8YgE//EMBLfwlAR78CQEW/AAA2ftrAK37JQDq+y0AEvxiAv//7AKn/00Dd
P+DA3T/lgON/5ADnv+CA7P/cgPK/1sHVf1wCIz8xQhD/NkIGvz/CNr7JgmR+0oJX/sAAAAAHwEAAAAAAAAApNY/nJycnJycrD+AAAAAAQAAAHf8+D
2Tdns/MgGc/jIBnP4yAZz+MgGc/jIBnP4yAZz+MgGc/jIBnP4yAZz+MgGc/jIBnP4yAZz+MgGc/jIBnP4yAZz+MgGc/jIBnP4yAZz+MgGc/jIBnP4
yAZz+MgGc/jIBnP5qAVL+qQFS/hQC6/6xAUP/cQGf/z4B9P8yAe//CwH4/xEB+P89Af//VAHW/z4Bl/8tATn/SQEK/2wB6/5wAdr+ZAHG/l0Buv5d
AbX+XwGw/l4BpP5dAZj+YgJr/nUCL/5yAgf+agLn/XcC0f3BAo793QJs/esCXP32Ak/9CwM8/aMCaP21Ao39kAIn/ZcCtf6HAgP/3QA0/1AAbf8CA
Gf/AAC0/wAAAAAgAQAAAAAAAAC81j83Gkrj+I+sP4AAAAABAAAAskTtPXALsD7BBWz8wQVs/MEFbPzBBWz8wQVs/MEFbPzBBWz8wQVs/MEFbPzBBW
z8wQVs/MEFbPzBBWz8wQVs/MEFbPzBBWz8wQVs/MEFbPzBBWz8wQVs/MEFbPzBBWz8wQVs/BsEiv9CAv//NwLD/oIC7/1QAoL8uwI2/GQCifrpAz3
7KwUP+yoEPvu5B/T5GAi9+n4H9/rHBiv7OwZP+60GQvvVBxr7cQju+rQIvvrLCI/6wwhu+q4IX/oHBw36/wVc+2cFcfyEBbT6rQSk+dwDx/hIAxj4
6QKa96UCL/dVAhb2MAIw9QMCmfTZATL0xQHn87UB3POIAiv1eQDk8wAA1vOPAJ/5AAAAACEBAAAAAAAAANDWPx4Pd9tlg6w/gAAAAAEAAADkcXo+C
ybrPrgEc/m4BHP5uARz+bgEc/m4BHP5uARz+bgEc/m4BHP5uARz+bgEc/m4BHP5uARz+bgEc/m4BHP5uARz+bgEc/m4BHP5uARz+bgEc/m4BHP5uA
Rz+bgEc/m4BHP5rwL2990CPfbiA8D1ngPS9EAFsfcbBgf4kwen900Ii/eDCLL3mAk9+esJRPrkCQb7tgmk+6sHQP8SB6X/8Aap/xoG//+3AGf6lAC
B+JEA1fdUALz3CgCt9wAAxfc3AID3XQB29yUAx/cPADP4aQE7+DcC/PbAAiv2HgO39YIDcPXFCAH30AlP9xEKavdBCoz3YAq292sK8vd0Cif4igpV
+D8JxPgAAAAAIgEAAAAAAAAA6NY/Wd6EYON2rD+AAAAAAQAAABcvlj6LBCM/1AD//9QA///UAP//1AD//9QA///UAP//1AD//9QA///UAP//1AD//
9QA///UAP//1AD//9QA///UAP//1AD//9QA///UAP//1AD//9QA///UAP//1AD//9QA///hAF//LAEi/48BFP/RASv/LQJp/zcE8P7fBB//tgM9/h
YD6f29AuD9hgLj/XgDF/5OA5P+DQNx/tUCQf6tAif+jgIb/tUEc/sdBQT7HgXf+lMByvsSAaj7RQFx+3kBUvtpAVP8jwHu/KUBRv2dAXf9oAGX/Yg
Bxv02Aen90gDJ/cEAs/21ALT9tAC3/bsAsv3CAKn9yACe/XMAl/0kAI/9AAB+/QAAAAAjAQAAAAAAAAAA1z9D/0ROcWqsP4AAAAABAAAAgKKNPIMb
9z4m/zgCJv84Aib/OAIm/zgCJv84Aib/OAIm/zgCJv84Aib/OAIm/zgCJv84Aib/OAIm/zgCJv84Aib/OAIm/zgCJv84Aib/OAIm/zgCJv84Aib/O
AIm/zgCJv84Auj9FAIo/2AAGf8gAPT+AACm/lIAff54AGn+dABZ/l0ASP5RADb+XwAh/oMAO///Amj/cwNy/3QDhf/YAmf/AwIl/4MB2v45AaL+Hw
GE/h4BhP4pAUv/KAFL/+EBUP87Alv/bAIc/8QBO//gAWH/EQIe/zgCPf9dAmz/ygK4/xwDy/8sA6//KQOL/zQDbv9HA5b/kQPI/8MD4//IA/X/xgP
//8MDAAAAACQBAAAAAAAAABTXP/lF94APXqw/gAAAAAEAAACHNY67X99MP0UCd/5FAnf+RQJ3/kUCd/5FAnf+RQJ3/kUCd/5FAnf+RQJ3/kUCd/5F
Anf+RQJ3/kUCd/5FAnf+RQJ3/kUCd/5FAnf+RQJ3/kUCd/5FAnf+RQJ3/kUCd/5FAnf+RQJ3/ioC0f7aAfD+lQHq/gAA/P18AM38MwC+/AMA5/wYA
LT8IgBs/C8AO/xdAEX8XAA3/FEAPfzlAAX9/QBV/cYCBf2CApj+JgIc/xQCRv8pAk3/TgJR/3QCW/+FAmb/kQJq/50Ca//DAo//3AKa/+gCnv/vAp
v/9wKZ//YCrP/mAsT/zwL//8UCxf/HAp3/xAKD/40Ch/+AAoP/pANi/tIDOf4AAAAAJQEAAAAAAAAALNc/BTRI1b1RrD+AAAAAAQAAAOF2+z1WvRA
/iPt8BIj7fASI+3wEiPt8BIj7fASI+3wEiPt8BIj7fASI+3wEiPt8BIj7fASI+3wEiPt8BIj7fASI+3wEiPt8BIj7fASI+3wEiPt8BIj7fASI+3wE
iPt8BIj7fASI+3wEvvzqBa/9yQaZ/Q4IG/75B3D+6AYT/7sGHP9+Bj7/QAax/+ME5f8eBP//zAOW+1UCT/ovAcz5mwAf+owAyfnCAKf5rACL+Y4Ab
/ltAFb5SwBM+SwAU/kPAFT5AwBK+QAAA/q9AFX6LgGA+mQBpPqSAVv6cgIr+jEDDvqfAx/5FwX2+IAF+vidBQH5qAWi+W0F/fljBSb6ZAUz+mkFM/
puBQAAAAAmAQAAAAAAAABA1z8FUU8ofEWsP4AAAAABAAAArmLJO0ElyT5r/JIEa/ySBGv8kgRr/JIEa/ySBGv8kgRr/JIEa/ySBGv8kgRr/JIEa/y
SBGv8kgRr/JIEa/ySBGv8kgRr/JIEa/ySBGv8kgRr/JIEa/ySBGv8kgRr/JIEa/ySBGv8kgSj/AAEjfw6BKD7JgEY+7IAp/rBAFP63AAf+usA/fn8
AOv5PQFg+toBafoJAuj6PgJp+y0CaPu3AZL7HQGv+6kAuftBALz7AADX/HcASv2QAN76JwM4+m0DzflrA3b5dANa+WMDTflQA0f5fgMI+aUD0fi9A
5v4zgMC+QwEN/kkBF75KQTb+e8DUvoyBDr9fAZg/sEHHv9ECKX/eAj//5QIAAAAACcBAAAAAAAAAFjXPzyLjVdKOaw/gAAAAAEAAAAbtos+A4xGPz
MCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jMCYf4zAmH+MwJh/jM
CYf4zAmH+MwJh/ikCEP4YAjr+zwFB/oQBNv7uAmX9RwNw/esCrvyXAj/8SQL6+/wCffyLAwT9qAPG/XsEaP/TBJP/KQV//24FaP+aBW//qQWa/8EF
rf8mBsP/XwbG/40Cpv9rAZz/9ACd/7IAmf+GAIb/dgBr/40AU/+BAFH/YgBm/yAArP8BAMn/AADb/x8A8v85AP7/TgD//1oA+P9eAPX/YwDz/zgAf
P8AAAAAKAEAAAAAAAAAcNc/wZ/rQCgtrD+AAAAAAQAAAC1qWz5ePoA+uekNGLnpDRi56Q0YuekNGLnpDRi56Q0YuekNGLnpDRi56Q0YuekNGLnpDR
i56Q0YuekNGLnpDRi56Q0YuekNGLnpDRi56Q0YuekNGLnpDRi56Q0YuekNGLnpDRi56Q0YufOdIwH9EDT//wM5S+1XO7/iFz8J3Z5DDdmcSLPVmE3
b84cspftfHoz/YBex/SEJzfoAAOD7BQEn56cWBuPQGGXhaBhY3XYXqdlHFpvU4BPc1MYUxdRdFSLVtRQ81ekTbNTSExHTIxJV0eYR5NC9ER/RjBF1
0WURqtErEoXStxQ11Z0eXNhpInraeiTj510gHvGMIVT2cyN++dEk4tihBgAAAAApAQAAAAAAAACE1z8xirjCFSGsP4AAAAABAAAAiILkPcs1PD8y/
gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/gAAMv4AADL+AAAy/g
AAMv4AADL+AAAj/lgAVP53AE7+lwBD/sYATP7tAGf+DQEE/yIBOP9DATH/QgEZ/z4BG/9wASz/ZAGI/7MAvf9XAHb/lAB9/3sAZP9rAD//gAD7/lw
Abf4+AAf+SQDM/VcAcf+jAU3/NgGF/2EBnf+DAZX/ugGA/9MBhv/fAbv/7AHJ/9AByv+iAdH/gAH//9cA7f9/AOn/VAC3/pUAaP65AFj+9gBc/jMB
AAAAACoBAAAAAAAAAJzXP8P7p7sSFaw/gAAAAAEAAABCy0E+qfJIP3YDXvx2A178dgNe/HYDXvx2A178dgNe/HYDXvx2A178dgNe/HYDXvx2A178d
gNe/HYDXvx2A178dgNe/HYDXvx2A178dgNe/HYDXvx2A178dgNe/HYDXvx2A178dgNe/H4Dqv3LA/L9BgTi/UQEtv2MAsj8cALP/IMCBf11Ajz9Xg
Jy/QwCJv/GAWz/fwGd/9gA//9YACz/IgCm/gsAVP4AACL+CQAO/lADGf0mBO38jAT9/OgEOP30BGH97wRy/e0EeP3oBHb92wRx/eEE/fzRBMj8vwS
y/K8EqfylBKf8tgTK/MEEEv38BF/9GwV1/SgFd/0yBXT9mQVW/dEFbv0AAAAAKwEAAAAAAAAAsNc/hNnQCh8JrD+AAAAAAQAAAIuawT4AEWs/1QBh
/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/dUAYf3VAGH91QBh/
dUAYf3VAGH9YwBr/WkAD/3oAH38OgH6+14Brft+AZH78gGr+xYCkfuKAdP+bgHg/wkB8v/PAPD/uQD5/58A//+XAPz/lADz/5EA6f+NAN//MQP6/v
cD1f5iBL7+mgT1/kYEXP8oBIn/GgTG/+kD1/9jAbr9gQDw/DIAofwJAHb8AABC/CgADvxKAPT7WwDn+40AzvvMAIv78QBO+78AVfuwAGn7sAB8+wA
AAAAsAQAAAAAAAADI1z+UwauPOv2rP4AAAAABAAAAHlDOPfw55j63/zgDt/84A7f/OAO3/zgDt/84A7f/OAO3/zgDt/84A7f/OAO3/zgDt/84A7f/
OAO3/zgDt/84A7f/OAO3/zgDt/84A7f/OAO3/zgDt/84A7f/OAO3/zgDt/84A7f/OAMK/0IFrf6hBpL/3Afu/2gH/v8RB4T/BwXk/owEfP46BBn+0
QPF/WQDdP1QA0z9cANI/ZsDSf5UBnv6xwaC/CQDzfzMAcH8JQHc/KwAE/03AP79AAAW/2YApv+sAP//yQDe/3UB0v/VAar/sQGn/7UBqP/XAar/9Q
Gx/xUCj/8sAir/LALm/ioCyf4yAtP9/QHR/YUC7v3oAgj+KwMb/lwDAAAAAC0BAAAAAAAAAODXP1iXESpl8as/gAAAAAEAAABcbs8+I9VnP+T9IAL
k/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk/SAC5P0gAuT9IALk
/SAC5P0gAnb/agLu/4UC///LAkP/hAGr/XYBufxvAUP8ZAEa/FoBhvvxAHb7LAER/JwBCvzYAQX8+gEB/BkC8PspAn/+AAA0/mcBfv6PAcH+fwHr/
mgB1f7wAM3+qwCy/s0A/f4oARf/kwEq/+MBPP8wAkz/WwJd/28Ccv9+An//igKH/5ICg/+RAnr/jQJr/4YCU/+KAkD/hwKD/5cChf+XAo7/mAIAAA
AALgEAAAAAAAAA9Nc/WRY6up7lqz+AAAAAAQAAAB9c0TwsHSA/9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WU
B9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WUB9P1lAfT9ZQH0/WUBev2KAO3+ggGq/4sBVP+sAfD+3AGG/iQCW/5EAj3+SQIr/lEC
Jf5tArr9wgLH/YUC0v1QAtj9JALj/QMCff8AAFr/XwJm/wADZP8dA1H/FwM4/wgDK//6Ah//8AIo/wYDRP8zA2z/eQOS/7MD///vA+n/vQN8/wwD/
/6fAp3+SwJS/hwCz/0eAnD9bgJc/coCW/30Alj9/gL2/NoCAv3gAgAAAAAvAQAAAAAAAAAM2D+7a7og59mrP4AAAAABAAAA/qgUP+R3IT+FHHbihR
x24oUcduKFHHbihRx24oUcduKFHHbihRx24oUcduKFHHbihRx24oUcduKFHHbihRx24oUcduKFHHbihRx24oUcduKFHHbihRx24oUcduKFHHbihRx
24oUcduKFHHbimB8T3TkUG9uJD87qFQ119YcO+vwdEon9oxsJ/i8h//9OJ8ntdCwI5LEwa9+mP6bnkEQh54NFn+02RoLwCUay8NhFEfD/RbbvBCnu
/tEhNP/8Hnv+XB3N/e4ctPndGRv3HRdp9eQH6uHiBYnczQXJ2r4FMdqfBerZhQWg2X0EiNlVA1nZ8wJ12e8BhNn7AOrZqgBl2nAAo9oAAI7aAAAAA
DABAAAAAAAAACDYPybWgz4+zqs/gAAAAAEAAAAHhfg9Z5ZsP6UABv2lAAb9pQAG/aUABv2lAAb9pQAG/aUABv2lAAb9pQAG/aUABv2lAAb9pQAG/a
UABv2lAAb9pQAG/aUABv2lAAb9pQAG/aUABv2lAAb9pQAG/aUABv2lAAb9pQAG/aUABv3wANj8AABf/c4AAv81AYf/dgGx/6IB0f/oAer/GAL8/zM
C//8/Avf/igFi/zQBEf81Ac3+KwGX/iMBd/4eAWr+HAFp/hQBcP4CAXr+8gCD/mABMP6pAQv+0wH+/fAB9v0KAur9JQLU/UIC0P1dAtb9eALZ/ZMC
2v1mAo39VgJi/VkCOP1PAv77XALE+0oCnfs/AoX7MgKL+9ACvfsAAAAAMQEAAAAAAAAAONg/DEzi9KPCqz+AAAAAAQAAAO/DFD49Clc/rQDk/a0A5
P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P2tAOT9rQDk/a0A5P
2tAOT9rQDk/QAAtv3dAY38iAKS+2oCH/uUAoP7vgLd++ECEvwKAyv8DwNf/CYDjPw9A6P8QAO6/JMCPPyPAkX8mAJU/KsCZ/zLApH8vQKJ/ckCw/3
GAtb9wwLs/acC8f2WAun9kQLh/ZEC2v2HAsz9/wHn/cEB6v2oAef9nwHk/bAB1/3LAbf91QGn/R8C2P09AtP9ZwLd/XoCwf2BAYj/LQH//wAAAAAy
AQAAAAAAAABQ2D8LKHslGLerP4AAAAABAAAArx4MP8n6ez+qBDD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqB
DD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqBDD8qgQw/KoEMPyqBDD8TgIp+5kBUPqxAYX7pgG++3EBufsAAZr7qQCC+y4A7PsAAE
D8PQHC/M0B8fwMAgD9PAIB/XAC8vw/Aif85AGs+2cBc/suAVr7FwFT+x4BVPsjA13+VQNm/0ID//9lA8P/YgOW/2YDjP82Bc/88AXL+2UGT/uHBhT
7jQbq+nIGGfuDBvb6kwbS+oMGs/pKBiD7OAZB+z8GRfs9Bjv7AAAAADMBAAAAAAAAAGTYP2rbS7Kaq6s/gAAAAAEAAADb1oE+eGXFPlsEce1bBHHt
WwRx7VsEce1bBHHtWwRx7VsEce1bBHHtWwRx7VsEce1bBHHtWwRx7VsEce1bBHHtWwRx7VsEce1bBHHtWwRx7VsEce1bBHHtWwRx7VsEce1bBHHtW
wRx7VsEce1NAaDyAAAu93wDR/bLBHf1ogWy9AwG/fONBZfztQ1W9j0PHvmrDf//oQ+C/3gKDPN6CB3wnQea7xMHK++dBtPtewbT7DIFs+yjBDftUA
Rt7awE6e4zBTzvoQU77+8Eqe5VBavuZgUI70IFB+/tBMLukQRx7pUEIO68BiDs7wYL6yQHLeo9B5TpRAg663wIBuy5CH/sPgnn7JgJEO0AAAAANAE
AAAAAAAAAfNg/d6aofSugqz+AAAAAAQAAAAYBIj/shlg/v/wcA7/8HAO//BwDv/wcA7/8HAO//BwDv/wcA7/8HAO//BwDv/wcA7/8HAO//BwDv/wc
A7/8HAO//BwDv/wcA7/8HAO//BwDv/wcA7/8HAO//BwDv/wcA7/8HAO//BwDv/wcA1X7XgNL++0Ci/umAjH81wJd/A0D+PoLAvz5ewPj+OwD0PdFA
1H3LgPy9iEDoPYNA2P2DwMf9m4DqPYLBLr52gOJ+zgEKfs6Bfv6wAWO/TcHEP4iB0r+5AZV/zYG3f94Bfn/4ATo/6IE5v6LA63+nAKj/8EB//86AT
z/jgEm/9EADv+WAAT/kgAA/4UA//7GAAH/JwH1/nAAEf8AAAAAAAA1AQAAAAAAAACQ2D+3VjtqypSrP4AAAAABAAAAshlBP1SqWT83DZnxNw2Z8Tc
NmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcNmfE3DZnxNw2Z8TcN
mfE3DZnxIg8N9iwMHvKuCzzthQzf7/MM5PB7DU7xUwci9M0Cmva/AEP4AAAV+RsFyvpwBrn73QZj/F4HlvzWB9r8yQT//6EF8fsCCrD4Wgzi9v4Me
PUKD73zKgyE8wMLOPOaCqjyvwoJ8voKefH/DM7jjgsU4fEJXeDyCDfgjggB4vkHMuOkB7/jnAcK5NcHSeQZCJbkXwjY5KQIC+XECGzlAAAAADYBAA
AAAAAAAKjYP8QKAlt3ias/gAAAAAEAAADQvxc/QT58P2AAKv5gACr+YAAq/mAAKv5gACr+YAAq/mAAKv5gACr+YAAq/mAAKv5gACr+YAAq/mAAKv5
gACr+YAAq/mAAKv5gACr+YAAq/mAAKv5gACr+YAAq/mAAKv5gACr+YAAq/mAAKv4QA138SQTM+gsFlPqIBYb6yQNW+8IC0fs5AgT8JgI4/SICCP6U
AnT+7QKw/iEDx/5DA83+ZAPQ/mEDRP6uAFn8MgDk+w4AvPsAAK37AgCh+8YAi/vvAN779wAo/FAAxvwkADL9GwCC/ekA4P0+AS/+aAFb/nQBdP5/A
X/+JQG9/ygB9P/IAP//cQDG/1kAuP9BALD/LgCX/yEAhf8AAAAANwEAAAAAAAAAwNg/wPtNMzJ+qz+AAAAAAQAAAIrdHT0uZ9Q+jQFV+40BVfuNAV
X7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX7jQFV+40BVfuNAVX
7jQFV+/EAjvtQAN37AAAv/N8Az/0oARD/zwF9/5kCC/8uBA7+FQP6/VACu/3KAZj9ZAGN/SIBjv0OBVb+fgbx/mMHWv8XCJv/iwjI/94I7/88Cf//
qQn3/24FW/xRBMr6KgNm+oQCRPopAjL65gEh+rIBD/ouAZT5uQBo+W0AM/lEABH5PgCU+JYAwPi5ANP4wwDa+LsA6vi5APT4zgAK+QAAAAA4AQAAA
AAAAADU2D8kTMLW+nKrP4AAAAABAAAAuNsFPj+baT54DXz1eA189XgNfPV4DXz1eA189XgNfPV4DXz1eA189XgNfPV4DXz1eA189XgNfPV4DXz1eA
189XgNfPV4DXz1eA189XgNfPV4DXz1eA189XgNfPV4DXz1eA189XgNfPV4DXz1xQM88wAAVPMAADzziAAW82UBHfNGCU31wAsm+OcIM/VjDP//iRJ
h/PgTavseFL36oRK3/JIRVP3dEH79eBCy/UAQxv04EMr9MxCw/QkQXP2vD+f8hRMp7S4U/eomFSLrBxZa6sYWq+nuGYvpjhy76YAe+OmkH8HpOyBq
6XEgN+l0IRPq1yJ76wgUB+1yD7jtDA7Y7cQNr+0lDgTtAAAAADkBAAAAAAAAAOzYP/7bUinRZ6s/gAAAAAEAAABc1w4+SsuPPgr54QYK+eEGCvnhB
gr54QYK+eEGCvnhBgr54QYK+eEGCvnhBgr54QYK+eEGCvnhBgr54QYK+eEGCvnhBgr54QYK+eEGCvnhBgr54QYK+eEGCvnhBgr54QYK+eEGCvnhBg
r54QYc/XgK/f4+DSf97Q54/MMQ9PshEjb7thJZ+rsSZPr8EWn8ShL//3sUwPuTEtz0xBKA9xAPSPksBcv60gEE/JoA6PwAABj8yQBM+uoBGfloArH
3wgJt9tcCQfXjBJX0uAU69AUGCfQEBvfz5gX3880FAfTBBQ72/QU09koFh/ebBrT33Af397UITfgvCaD4WAnd+IMJGfnACVz5zAkAAAAAOgEAAAAA
AAAAANk/YCJDD7Vcqz+AAAAAAQAAAKOu3T6Bwy8/PvfQCz730As+99ALPvfQCz730As+99ALPvfQCz730As+99ALPvfQCz730As+99ALPvfQCz730
As+99ALPvfQCz730As+99ALPvfQCz730As+99ALPvfQCz730As+99ALPvfQC9D1sAni9ckDRPYvAuD2cgEM+dMAzPmjAEn6TwCc+h0AA/s5AA37mw
Ah+/AA/fvqACz6AAB398cDc/U3BXL0bgXW8z8FevP/BE3zxAQ685cEMvNxBCzzSgQo8yMEJfP/A/347QnL+kULL/tfCz/7rgpa+5cKgvuVCs77wgp
a/FwLzP1rC9v+cQuO/1sL//8/C+7/BQyz/7YLcPoODQAAAAA7AQAAAAAAAAAY2T/ZCyVtplGrP4AAAAABAAAA40c4PjaaaD+HAoH9hwKB/YcCgf2H
AoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HAoH9hwKB/YcCgf2HA
oH9hwKB/TYCeP3OAs/9LwM4/kMDjP5BA8j+PQPx/jwDEf8tAx//HwMe/0MDpf5fA1P+jgOw/44D8/94A///WwP7/0ID9v/1AsL/3QLE/1YCr/93Ar
v/lwK2/6UCsf+qAqn/qgKi/2ECzv8NAuT//gHv//4B8v/9AfD/2wDC/WgAOv0nAAz9GwDL/AAAxvwLAI78HABx/DEAZPxlAFT8AAAAADwBAAAAAAA
AADDZPxbe1yelRqs/gAAAAAEAAAACeIY+z5N1P3IB//5yAf/+cgH//nIB//5yAf/+cgH//nIB//5yAf/+cgH//nIB//5yAf/+cgH//nIB//5yAf/+
cgH//nIB//5yAf/+cgH//nIB//5yAf/+cgH//nIB//5yAf/+cgH//nIB//5yAf/+twHW/toB7v73ARf/FgJC/yECcv8sAq//MQLd/9YBdf+NAXz/s
wHK/4UB//90Af7/jgHq/6oBxP/DAZj/1QFy/4MClf1pAs78vgIr/dYCAv3eAsz84QKS/OUCW/zdAjr8wQLO/K0CIf2qAlb9qQJx/SECW/18Aln90A
JE/fMCIv21AjH9wwBI/jEAnP4HAKT+AACl/gAAsP4AAAAAPQEAAAAAAAAARNk/QyCHJLE7qz+AAAAAAQAAALpgTj8mgG0/uAX9+bgF/fm4Bf35uAX
9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9+bgF/fm4Bf35uAX9
+bgF/fkkBS38JQZM/KMGNf31BiT+KAeJ/hkFuf8/A///4AHZ/10BF/80AYP+HAFW/toAK/6AAPr9SQC9/QAAlPRjAY3zkwQ19DwDa/M3AjbzdgCt8
aMAYfI9AcfxDgIX8eACdfB/A5TvigWe8asGRfJMENHy/BH18ZsSWPEFE/bwPBF78i4Q2vNdD+j0fw7r9dkNxfZsDV/3KQ2Y9wAAAAA+AQAAAAAAAA
Bc2T9aiKlIyjCrP4AAAAABAAAAgQ7JPscYBD8IChr9CAoa/QgKGv0IChr9CAoa/QgKGv0IChr9CAoa/QgKGv0IChr9CAoa/QgKGv0IChr9CAoa/Qg
KGv0IChr9CAoa/QgKGv0IChr9CAoa/QgKGv0IChr9CAoa/QgKGv0IChr9CAoa/RkLu/7FC///Kw5V/BMK/vjUBur7ugTr+zMDufvAAd366gCz+tEA
p/rvAMT67ADe+r8AA/sxBJH9HQAE9QAA5PMDAK/zoAvL794O8+0MEOfsJBCt63kQoenkDDDuUgqS8L0IUvHODUb7mg/4/DgQbv1mENX9cxAY/msRK
/5eE/D9mBTC/UoV5f2nFSL+7hVF/hsWQf5fFjv+AAAAAD8BAAAAAAAAAHDZPx7t/3nwJas/gAAAAAEAAAALM3A9sTYPP5f/BwOX/wcDl/8HA5f/Bw
OX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwOX/wcDl/8HA5f/BwO
X/wcDtf/nA8v/nATt//IE//8sBer/TgWl/1oFXf9RBSH/YwX0/p4Fh/6EBWn+bAVl/k8FWf+ZBEL+UwQ3/hIEDf7fA+T9swPC/Y0Dr/1xA7v9gQPF
/ZcD0P2cA3X+wANr/tcDZf7cA8L+KQSH/qMDb/5PA03+HAM7/uEARv5gADb+PwAc/jcADP4kAPv9HgDw/RYA3f0LAL79AAAAAAAAQAEAAAAAAAAAi
Nk/pjyUniMbqz+AAAAAAQAAAJODIT8/OjI/rfWyGa31shmt9bIZrfWyGa31shmt9bIZrfWyGa31shmt9bIZrfWyGa31shmt9bIZrfWyGa31shmt9b
IZrfWyGa31shmt9bIZrfWyGa31shmt9bIZrfWyGa31shmt9bIZrfWyGa31shl/8coPIfBxDWfwqBK48nURivQmEFX1QA+89SQODfcMBx/47wPS+Kw
B5fkAABL9Igz//3AVI/P1I4fs+yXc6volvurNJUfwriWr87sh+PV3I8L3bCXO9YMlHfVhJUz1ESW2+UUlbPtQJob64SUK+QclkfekJLn2mCRN+G0n
M/daJgns2Rbb7f0QDOy3D4Lqaw+a6TsP+ugjDwAAAABBAQAAAAAAAACg2T+Jd7icYxCrP4AAAAABAAAAOrD1PmesLT+O+OwEjvjsBI747ASO+OwEj
vjsBI747ASO+OwEjvjsBI747ASO+OwEjvjsBI747ASO+OwEjvjsBI747ASO+OwEjvjsBI747ASO+OwEjvjsBI747ASO+OwEjvjsBI747ASO+OwEjv
jsBOb0AAec838GJvLwBRrzEQbc8xwG3vOKBcnzDAUG9DcFRvSjBX709wX49gIIDvj6B8D5Awfn+q4GQvt6Bj37QQY/+/sFTfuoBVT7TgVJ+/0EOvu
6BCr7fwQY+0QErPpuBt/6gQcy+ssG4PyEBRD99AQF/ZsE5Px0BOP8gATx/R0Fxf45BY7/OAX0/zAF//+EBbD6UgDC+AAAAAAAAEIBAAAAAAAAALTZ
P1uwBVuwBas/gAAAAAEAAABxlt09lpBYPzIByv4yAcr+MgHK/jIByv4yAcr+MgHK/jIByv4yAcr+MgHK/jIByv4yAcr+MgHK/jIByv4yAcr+MgHK/
jIByv4yAcr+MgHK/jIByv4yAcr+MgHK/jIByv4yAcr+MgHK/jIByv4yAcr+AABl/00AWf5LAC/+cgB7/oEApv7dAJ/+CwGR/hEBjP4QAZv+EAGj/g
8Blv7TAGv+wQBH/rwAL/7eAEX+BgF2/vYAtv71ANb+9gDn/u4ABP/2AAj//wAK/wUBDP8NAQ//FwER/+8AGP/PABn/wAAc/7oAI/8vAfD+RgHg/kk
B1P41ASf/MgFb/4sBrv+8Aen/ZAH//0sBz/8AAAAAQwEAAAAAAAAAzNk/nA9bwAn7qj+AAAAAAQAAANFxPj1jSs4+MPzaAjD82gIw/NoCMPzaAjD8
2gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82gIw/NoCMPzaAjD82
gI0/ZQE8P2sBYj+Wwbn/ngGNv+eBnz/twa0/7oG///tBmf/3wcd/+4HQf9CB6v6kwUv+eoEyfjSA5j4UgOC+BkDFfmBAwP5qQML/BkCE/1GAZH9zg
DS/ZIA3v1YAJ39FgBx/QAAT/0AACr9AADx/AgAsPxXAJX8jwCF/K8A/fzdACb9GQEJ/Y0CJf2nAzT9VQQ+/bcEQv3vBAAAAABEAQAAAAAAAADk2T/
X29yzb/CqP4AAAAABAAAA60eXPa1wZD91/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1
/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1/m4Bdf5uAXX+bgF1/m4Bdf5uAW3+1gGG/l4Cnf7EAqf+CQOL/jMDV/62A0j+rwM5/ooDHv5aAwn+OQME/
hwDEv4FAzP+7gIK/r4AS/+nAH3/rwCu/4YA6/9hAP//SAD5/ywA8f8iAN//FwDM/wAAj/6bART+AwL4/TAC+v1OAhb+bAIf/mcCFP5gAgH+UALw/T
wC6v0gAuD97QHV/coBtP26AaH9uwGc/b8BAAAAAEUBAAAAAAAAAPjZP/aF8xzi5ao/gAAAAAEAAAAQ/lY/YPx+P5oIxvuaCMb7mgjG+5oIxvuaCMb
7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7mgjG+5oIxvuaCMb7
XAk4/vYIEf+VCGH/owi8/xwJ//9JB3r+Igfz/YQHz/1eCKb9nAl6/Z0KT/1mCx/9WQxj/MQMrfvPDZb74xHV9CUUjfNpETP30BAg94MQsfivD9v5F
A+V+tcOxfqtDWr5jw3/+IoNs/iQDbv4uQSi90ECt/dBAdf3pwDo90QADfgUACz4AAAw+AAAOPgOAB74NQDg92kApPcAAAAARgEAAAAAAAAAENo/pr
lK42Dbqj+AAAAAAQAAAEDjNT4Pzsw+HwVO9x8FTvcfBU73HwVO9x8FTvcfBU73HwVO9x8FTvcfBU73HwVO9x8FTvcfBU73HwVO9x8FTvcfBU73HwV
O9x8FTvcfBU73HwVO9x8FTvcfBU73HwVO9x8FTvcfBU73HwVO9x8FTvcfBU738QPg9VwE7PSWBsT0sQdh9HAIwPPLA8D6xwNK/t0D//+hAqj4RQG+
9ocAkfZrANL2ggAX93EALvc2AM32GgAN9gsAgvUAADP1CAB79R4ARPVOANX04wH19d8ChvaMA8T2BQQI91sERPeiBHT3JwjR9F8Ih/SCCJf0lgit9
LUIi/StCIv0gQi29G4IKvUQCL302wdX9AAAAABHAQAAAAAAAAAk2j/IcdDu69CqP4AAAAABAAAA3nNYPjucrD7x9HoA8fR6APH0egDx9HoA8fR6AP
H0egDx9HoA8fR6APH0egDx9HoA8fR6APH0egDx9HoA8fR6APH0egDx9HoA8fR6APH0egDx9HoA8fR6APH0egDx9HoA8fR6APH0egDx9HoA8fR6APH
0egA6+1kBwf2rAUr91QFv/dABIfoBA5n5xgOo+jAE2vtWBBP6PQqQ+1UN3/yPDZH/7Az//4UMbf+lDJr/gQo1/+4KG//8CJL9LgeH958BQfW5AL3y
pwB/8eUA7fAVAEbxAACj8SAA9PFDAD7yXwCM8oQA2/K9ACTz7gB18xsBwfMyASP0JQGL9PkA9fTlAFz16wCW+OoAAAAAAEgBAAAAAAAAADzaP8IQt
CeDxqo/gAAAAAEAAAB/q8w9g2FjP6EA//6hAP/+oQD//qEA//6hAP/+oQD//qEA//6hAP/+oQD//qEA//6hAP/+oQD//qEA//6hAP/+oQD//qEA//
6hAP/+oQD//qEA//6hAP/+oQD//qEA//6hAP/+oQD//qEA//6hAP/+oQD//iEAOf8FAHT/AQC8/wAA9P9dAP//iQD4/6EA9P+pAPT/iwCw/2cAb/8
zAC7/GgD8/hoA2P4nAMv+NwDP/kgA4/5TAO3+WQDx/ksA4/5BAOP+PQDr/jsA9P5DAPf+TAD5/l8A9f5lAPv+agAH/3EAEv+kADn/qQAz/6QAK/9c
ABf/OAAi/xkAMP8KAD//CABU/8UAyf0AAAAASQEAAAAAAAAAVNo/s3xldia8qj+AAAAAAQAAAHNLBj8LjG0/pQQb/KUEG/ylBBv8pQQb/KUEG/ylB
Bv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBBv8pQQb/KUEG/ylBB
v8XgRd/G4EVfxrBFP8cwRd/JMEdfyJAsf+agJN/38CDP9KAhb/HAI8/wkCV//xAYL/qQGf/1QBo/8FAaf/ygDB/64A4f+rAP//AAB5++gA6fl4ARv
5sAGa+M4BTfiSApz4hwJs+GMCLvguA8b3sAOh9/QDm/erA2j3xAMM+NkDY/jbA4b4lgPZ+HEDSfl8A6P5hwPI+QAAAABKAQAAAAAAAABo2j90P5TD
1bGqP4AAAAABAAAAgfU6PurEAD+++ysDvvsrA777KwO++ysDvvsrA777KwO++ysDvvsrA777KwO++ysDvvsrA777KwO++ysDvvsrA777KwO++ysDv
vsrA777KwO++ysDvvsrA777KwO++ysDvvsrA777KwO++ysDvvsrA777KwNc++UF/fkSBf35kwVx+cUF1fksBfD3wAIk+DECjPgBAqj4+QGy+OgB1/
jdATv5hQL7+QgD7/knA9n5KQPY+Q0D5Pn4Ahz6FQIy+qwBO/qCAVH6aQEf+rYBzfn2Afn9NgFY/9IA2f+VAP//dQDh/0sAiP50AMH9iwBf/YgAKv1
6AA/9vQAB/Y8A9PxTAOj8IgDc/AAAAAAAAEsBAAAAAAAAAIDaPziqLviQp6o/gAAAAAEAAADMC/s+NmtuP8j9GALI/RgCyP0YAsj9GALI/RgCyP0Y
Asj9GALI/RgCyP0YAsj9GALI/RgCyP0YAsj9GALI/RgCyP0YAsj9GALI/RgCyP0YAsj9GALI/RgCyP0YAsj9GALI/RgCyP0YAsj9GALI/RgCyP0YA
i3+bwFg/kYBcP4pAWT+/gBK/tAAM/6HASr+TgFS/hsBg/7vAKT+vwDt/ToAP/4AAL7+PwBm/88Buv+yAuf/3gL//94CSP16BGD8qgT8+6sEwvu0BJ
77wQSD+8kEafvEBF/7pgRZ+28EVPtBBE37JAT/+toDx/rOA2n7kANt+34DfvvlAnr7twF5+/kAgvudAIj7fAAAAAAATAEAAAAAAAAAlNo/4vxg/Ve
dqj+AAAAAAQAAAEuW/D2bXx0/WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC
5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+WQLn/lkC5/5ZAuf+QgM7/kwCwP7RAl7/+AKL/xIDwf8kA/j/FAP//9YC4//AAtn/rgLc/6AC4
/+eAu7/mwL0/48C9f+BAvj/ggL5/3sCx/+BApv/igKc/2cCn/+2AC7/cQAV/2oA+f4vADr+IwDV/Q0Ap/0AAIb9NAB9/ZEAXv2cAan8EAJK/FUCJv
yAAhL81wLb+uMDmPuSBAH84QQF/AAAAABNAQAAAAAAAACs2j/mkJS8KpOqP4AAAAABAAAANJs5P9bUcz9AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5
AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5AAoH+QAKB/kACgf5q
AdX7AADr+mYDq/nuA+/54wNH+rEDlvr7BIP8hwbM+04Hh/vAB6H7Bwis+ywIn/sgCHP7fgVa+owCEfj7Avz4nQI5+fEBO/mZAWn5IgHn+fQAdfo7A
tP7oQJ3/IsCrfycAf79HwG4/mgAaf84AK//EgDa/wYA//8/AFL/uwAR/yABqv49AWD+VwEy/nkBBP6VAdD9AAAAAE4BAAAAAAAAAMTaP5wHbx8Jia
o/gAAAAAEAAACOi4I+iD5+P1P+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jE
BU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAVP+MQFT/jEBU/4xAQT+kQGf/fwAXP2YAOD8YwCt/E8Al/xjAHf8WgCL/MMBb/zjAWT80gEw/tEA
i/6DAJj+WQCn/j4Awf47ANf+PADk/jIA7f4kAPP+FwAK/wAAZv8DAIv/KgDG/1EA//9oAPf/EgHc/3AByv+fAbz/tQGy/74Bt//qAcn/RQLG//oBr
P/pARr/kQHU/n8Bkf6CAXb+fwEAAAAATwEAAAAAAAAA2No/EHzRD/N+qj+AAAAAAQAAAIsgDj1H1VI/GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+Gg
FS/hoBUv4aAVL+GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+GgFS/hoBUv4aAVL+igB
B/ogAAP4xAP79AAAB/gAA2P0QAM/9HwDF/S0A3P0wAPn9LgAA/mgAHf6HAB/+1wBz/kQBp/5lAQr/TAFS/zgBe/82AZD/OAGg/zcBqv85Aa//PQGz
/08BwP9eAc3/aQHV/24B3P9sAej/bAH//7YBy/7KAYX+CgJH/hkCPP4XAjj+/QEu/v8BIv4VAjv+/QE9/gAAAABQAQAAAAAAAADw2j8iuNd36HSqP
4AAAAABAAAAGH0HP82kFz9w8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGH
DyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhw8kAYcPJAGHDyQBhN+DAaFvtwGkP5mB+T98Yf0vjwHnH6ex6D/Msde/4wHP//nRr1/AoXGvYrGHr
zOgjt8tsD3/L+A3vyPQUO9P0GuvQcBJj0mwIo9YkBr/XqADv2aQDH9gAArvZWAe/2CwIK94IBC/ZSBtH4mwr8+QkMVfp2DNf6KA4r+IUPI+e9FPXl
ChXQ5r0UmedUFNznABSV5+cTAAAAAFEBAAAAAAAAAATbP/hs10Hpaqo/gAAAAAEAAACFTlo+bPUYP9UBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV
/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/3VAVf91QFX/dUBV/
3aAGD/mAFy/0cCLf+kAvv+3gLg/i0Dgv5gA4/9HQOx/ecCwv3YAs/94gLY/fEC5P0pAkP9ugEt/Z8BPP2TARz9dwH0/IEB9PwoAeX9GwHl/bIAHf5
oAEj+RQBY/jsA2f5rAHb/aADI/0wA8f8qAP3/HADt/w0A6f8EAPL/AAD//w0A9P8qAOn/QwDk/68Alv4AAAAAUgEAAAAAAAAAHNs/pG5fWPVgqj+A
AAAAAQAAAD7hcj5C0k0/OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/joBa/46A
Wv+OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/joBa/46AWv+OgFr/gwBVv0RATj94ABV/cMAbv21AH39xwC7/agAwf1xANb9TQBy/u8AY/5sAW
3+uQGB/usBmv4NArj+mwIA//QCnf/0Anz/XgLB//EB6P+zAfn/iAH//2AB/P8fAQX/4gBN/o4AXf5TAHj+HgCW/gAApv4DALD+GAC7/kAAyv5aAMv
+XgC7/l0Arf6kAJL+pADS/QAAAABTAQAAAAAAAAA02z/+8jamDFeqP4AAAAABAAAAqtNIPtpyDz+0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7
tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7tAL4+7QC+Pu0Avj7a
gK6+TcDY/mcA1/5yQNe+e8DXvkDBFX59wMY+YUCYPmeAZb5HwG4+dwAzPmvAOD5NAAA+rUAEPvJAOT6vQCn+osAc/r9ACb7XwAs+woBcfq2Adr5Ow
J4+QMDaPlUAY39ngDm/kIAZv8UAKv/BwDb/wAA7/8NAPD/MgD5/1IA//9wAPX/ngDn/9EA3f/YAIf/AAAAAFQBAAAAAAAAAEjbP5LTXBYvTao/gAA
AAAEAAACBcpY+GwIwP0wBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq
/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1MASr9TAEq/UwBKv1cAtL9owI2/ooB1/7RAC7/egBh/3IAev/1AAP/1gDf/X4BvPx4AYf8YgFn/
E0BS/wyBLb+3wRN/w0FiP8nBeT/OgX///wEWf/KBAr/qQQd/5YER/9xBF//VQR6/0sElf9EBKz/QQS9/xABTf6fAPb9eAC+/VEAiP1AAF79PwA5/U
cAF/0AADH9AgBA/RIAPf0AAAAAVQEAAAAAAAAAYNs/odIGlFxDqj+AAAAAAQAAAIQHsD5Cv3k/mf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn
/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAZn/swGZ/7MBmf+zAfL+
sQF1/qUBBv6sAbb9wwGb/T8Bnf1fAcP9mQHl/dkB/P0BAiH+VgKh/eoBdv2AAQ3+zAB2/mkAuv5DAOL+MwD5/iQAA/8RAH7/AABi/wIAQf8LACj/H
gAk/ycAK/9CADb/dgBA/6UARf/DAEf/1gBG/+AAPv/sAOL9bAHl/ZUB5P2xAdT9zQGp/7oD//+eBAAAAABWAQAAAAAAAAB02z8d46AKlTmqP4AAAA
ABAAAA+PSmPu6NDD9+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp
+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6fgSA+n4EgPp+BID6nQNs9uADHfRQA/T07AJ99agCqvVbAqL17AGC9cAGD/SGCPXzMgko9GUJUfQm
Cv709gky9IAKuvPmCl3zjgWT948Et/g5BC759QRa+pID+/a+A/32rwOY93gDEPgcA6D4RgLx+BECJPkFAlb5AgJ8+U0B3P4CAan/4QDS/9AA6f/FA
P//pQDM/14AQv8AAOL+AAAAAFcBAAAAAAAAAIzbP45zzGXYL6o/gAAAAAEAAACvo0o+G10UP2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a
4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgNg/a4DYP2uA2D9rgM1/zI
F6//fBVL/5wZM/joGo/9uBdb//QTW/8gEbP+MBMz+sgSb/roEof7EBPX+bwQ//4AEav+PBJf/XwOO/9kCxf8CAuz/3AH2/9QB8v/RAe//zQHq/9YB
7P/jAfn/7AH//+kBrv+wAQ78AADf+scBLfpIAsb5egJ8+Y4CVfmlAlb5zQJP+ewCQfkBAy/5DwMAAAAAWAEAAAAAAAAApNs/57tfkSYmqj+AAAAAA
QAAAPvXhj5seRg/pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQ
AP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/aUAD/2lAA/9pQAP/WwCGf3CAif9swLn/I4Cr/x+ApX8iwKJ/AQDYfvmAaD9EQJv/V0CJ/2dAgj9sgI
i/cAC/fy6Am/9vwLI/S0Cpf3cAcX9twHv/dUBbv7nAJr+WQCG/hYAgP4AAIj+cQAZ/7oAYf/MAIT/zACO/9UAmf/rALj/BgHU/yYB5v9FAfT/YAH/
/2wB/P9jAfX/bgHf/wAAAABZAQAAAAAAAAC42z8nDmV5fxyqP4AAAAABAAAAIhJUP+Vedz/i9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjA
eL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMB4vZjAeL2YwHi9mMBDfIoAB
TvAAAn7tsACPG8AofyJwOB8ykDIfRdA1z0EwNE9JQC+vTHAVf0ZgBC8uAMsu//EcXxbQ/B8zoO1PoLDX/9Vg2l/nsNJv8iDYT/owy+/20M9/+QDP/
/EQ3A/0wNe/9EDUv/EA0n/8oM5fqzCh/5iAn29lMEVffxAzT47gKg+K0C1fjJAprxIQcm8NgHAAAAAFoBAAAAAAAAANDbP7YpGgrjEqo/gAAAAAEA
AABzGoo+iA3zPuT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7o
QTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQTk+6EE5PuhBOT7oQRI/HkE6fshBZf8wQRB+zUEZPnwBZ34BgdE+I0HvvemBGT3zAIw+QoCQvqwAcD5dw
Ef+hgBgfrcAC76SQBl+gAAc/49BG3/GgX//2AF4f73BHr++QRa/vAEI/6MBRb+4gXe/eoFrv3cBXv9yQVF/b8FEv27Bez8rAXZ/IcF2PxLBdn8IAX
c/AEF4fzpBOb82AQAAAAAWwEAAAAAAAAA5Ns/kZHvL1EJqj+AAAAAAQAAAOeLEj+rADw/LPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzECz48xAs
+PMQLPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzECz48xAs+PMQLPjzEOL6FhFX+
1kRefuQETD6dBG5+ooRmft2ESb8ihGD/NoRAf06EtX+uhRa/rwV//91Cwf+/gfe+18GDfpeBdH4pwTJ9icDrfVNAvr00AHN8vUAnPFlAALxAABn7x
wBFPY9Czr4tA7V+AsQ5PiMELz4tBBp+isQn/vVDzv8fw+i/CwPmvxHD3b88Q6L/CIPlvmiEAAAAABcAQAAAAAAAAD82z8M5YfXyf+pP4AAAAABAAA
A+DU1Pz/fRT/5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp
+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8Pp+QvD6fkLw+n5C8PpmQUj8OwC+vP+AcL2BgFO+QAAE/uOAnP+lQYD+O0KN+q2DHro7g1r6L0PmOg0EX3oz
wse5CgNveC8Dbnegg2b3BgP0d5jD37eWxBM3ZYREdxjE0bbDhXA2qkWd9rAF0LaORfx7P0TA/OWEeT0/Q5r9P8OafSJD6P0+hCI9QwTZvirFJX76B
WT/UwXAv8pGP//AAAAAF0BAAAAAAAAABTcP0E7t+1M9qk/gAAAAAEAAABA65U9CtDDPRjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xAGOO
sQBjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xAGOOsQBjjrEAY46xA+M0X
XI7X+GyO2Ap02uMXYSjUb0v/ysJCktqJRbbhZEVD4I1FW9/GQ0vPgDONx1wjZcUyFpnGDQwTyB4FC8kAAATIagnExqYPbMBJAaC/2AFG1jUM/uzKT
eHuaFsy8etY7vM8VBP3DlMs9SZW5vK2WcnjMWQx2/xouNbXa1zT120o0jxvBfntY///LmAAAAAAXgEAAAAAAAAAKNw/C4GCX9rsqT+AAAAAAQAAAI
gs3D0luNg+RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UU
CKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP1FAij9RQIo/UUCKP3UABr+AAAT/mQAH/wHAGf7wAB//G0BZv2BAaT9oAEG/sMBRv4mAwf/IwRa/8QE
dP8iBWH/jAVo//YFeP9eBoT/dgaW/4MHKP+OByn/SwfL/7wG//8UBTX/CwSp/loDTP5CA9T91wK3/A8Dp/sOAwT7RwMY+oEDJvqkA0D6sgNS+vsCZ
vvOAvj70gJW/AAAAABfAQAAAAAAAABA3D+P2R4acuOpP4AAAAABAAAANe/hPS2wLD9YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/
5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/lgBs/5YAbP+WAGz/pkA6v6
BADP/iwBg/5cAff9yAIX/ZwCL/2EAe/9dAGj/WgBc/10AVP9eAEv/YwA//74Ag/7PABj+4QDu/fYA3v0NAaD9JwGY/ZQAzf1aANz9VgDk/QAA+P0h
AC/+LABm/ikAlv5+AIH+ggCZ/n0Aaf5ZAF3+QQBW/jcARv4FAM7/WgDv/4oA//+9Arf/AAAAAGABAAAAAAAAAFjcPzQB8QoU2qk/gAAAAAEAAAAvi
wo+HvsPPwAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG
37AABt+wAAbfsAAG37AABt+wAAbfsAAG37AABt+wAAbfsAAG37mwFo+RYCUvi4Ai74MgM9+H0DWvifA134ZQNy+B0DhPj4Aoj4+gKE+BEDh/gIA5z
4+gHJ+VsBoPoWARv7+gBg+6UBqf4jApD/lwFd/zoBbf8IAYj/vQC1/2MA//86AOv/LwDV/0EA5v9RAPv/ZADS/4MAv/+qAMf/ywDQ/woBa//ZAUD/
DQJU/xwCaf8AAAAAYQEAAAAAAAAAbNw/E7OMH8DQqT+AAAAAAQAAAPJf3T6enDE/SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7S
AWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/tIBYf7SAWH+0gFh/uhB9j5mg
UD+IAEkfcaBP72ywLz99YBofeCATr3NAAg+AAA9/gTAIj5GgDc+RAAHfoUAGX6HgCg+jMA4Po4AFr7mgAU/G4CAPqgAvP5tgIQ+hoGp/59B8X/+gf
//+AHbf/RB4H/4wej/woIwf+FCK//qgiF/7EIcf+2CGn/vAhr/+cIbf9UCVP/zAll/wAAAABiAQAAAAAAAACE3D/RELRFdsepP4AAAAABAAAAec2E
PRS7GT/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/
9ABEv/QARL/0AES/9ABEv/QARL/0AES/9ABEv/QARL/0AES/0kBHf+rAB7/TwA+/x0AV/8NAF3/HgA8/yEAJv8SACH/iQBO/7gAVf/FAFH/ywBF/8
MAMv+eACn/rgDl/pcAxv5sAOz+TAAQ/xwAHP8AACT/SQAa/2EAPv9rAGP/cgCE/3cAnP+JAKH/iQDN/9MAXv/yAKf/CwHe/yYB//9KAVP/ewE2/60
BMP/FARD/AAAAAGMBAAAAAAAAAJjcP7oMV2s2vqk/gAAAAAEAAADkvrw9sHxFP1UBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUB
sfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8VQGx/FUBsfxVAbH8XAFo/IEBL
vy3Aef77wGr+9sBjvvkAYn71wGQ+7sBlvudAY/7ggGA+4ABePsuAlf7+AM2/A0E6PsbBLf7DgS3+zQCa/2oAR7+bwFr/kkBmf4xAbf+HAHb/vcADP
/YACn/wgA5/90AZv8QAYj/FgGb/xkBqv8AAPX/AwD//5UBJv7yAUn95wHS/NUBrfwAAAAAZAEAAAAAAAAAsNw/RtaSfgC1qT+AAAAAAQAAAGOD6D5
I1RY/ePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig14
8YoNePGKDXjxig148YoNePGKDXjxig148YoNePGKDXjxig1e73sKp+8uCjrwrwqH8GgLVPA8Dt/vfQ/Q71MQtO7YEnzuLxJs7lgPrfDfDWrxJA3Y8
fsMcPNZC0z0XgrI9O8JJ/W/CX71rQnb9Z4JufaeCXb3aAtG9/EMOvfeDRn2PAzm9/ALQPm9Cyf6lgv//0wEhPX5BybwjQbY7bsEYuwQA1fruwGS6r
sA6ukAAAAAAABlAQAAAAAAAADI3D/SSLFt1KupP4AAAAABAAAAbOYsP38ieD/uBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv
57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+e4ES/nuBEv57gRL+c4Ep/fCBK/2
uQQM9rUEo/VgBOP2dwOT9igDpvYXAxj3JQN990YDxPd6A8z3zQN0+NkCbfjCAX76+QA4/GoAWP0AAGD+CQDp/i4AEf8UAfr/NAH//yMB7f/ZANv/r
AC+/3YAs/9HAI//HwB//5IBU//6AnH5gAUc9iMGvPVuBtb1vQYS9v0GFvYkB8v1AAAAAGYBAAAAAAAAANzcP4pcKCeyoqk/gAAAAAEAAAALlPk+Je
kLP1geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3WB5
491geePdYHnj3WB5491geePdYHnj3WB5491geePdYHnj3xB11+68f//+3Hn79bRye+2EcFPMzG0XvkBlj7eUTS+PhEBjeDgwh17sMrdSnGWbXayMC
2GENZuKMCPTmXQXs5rcDf+f1BiLkFwUY5JsETOVMBUzmngV25pUFUuYDBh3mJAaR6mEGEO6JBpLw0QW68vUD9vRhApD2ZQH7++IAk/5cAJz/AAD4/
wgA9v8AAAAAZwEAAAAAAAAA9Nw/mZmZmZmZqT+AAAAAAQAAAARgKz7KLt4+UPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAl
D6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgJQ+kYCUPpGAlD6RgKa9ikEsvVcBAr
13QJq9K0BKvS/ACL0BgBK9ZsAm/UlAZD1vwGm9HgCWPQPB7XzGQgQ82sIfPMlCdDzRgkk8ysI6/T5B3L2hQc+/K8Eyv41A///egLY/qsAGv86AHn/
EwDA/wQA7/8AAPz/AADm/wkA2/8WAOD/JQA6/twAhP1IAUX9jgE0/cABNP3kAQAAAABoAQAAAAAAAAAI3T9njdGzipCpP4AAAAABAAAA1eukPhp33
j6f9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08w
Kf9PMCn/TzAp/08wKf9PMCn/TzAp/08wKf9PMCn/TzAp/08wJd9QAA0/Q/Ay/1SwWu9eoFSPZeBdHzfgVB8y8Gdv0vDP//Zg13/50NI/6BDU79bw1
f/K4NvPtEDAf7Cg5Q+usOb/qoD4L4LxEp914PGvc9Dlv3+g189y8ObPeHDk/34g4g9zcP7faVD5H3KA+B+FgO//vqC4H9FAru/ZgIBf5aBwX+VAYF
/nsFAAAAAGkBAAAAAAAAACDdP/hBx2SFh6k/gAAAAAEAAAC3JKc+l1NAP0394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/
eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAk394gJN/eICTf3iAmD9XgHe/Y
QBRv7GAZP82wDo+78AjftHAdv8uAGM/Q4Clv8qAfr/fwD//zQA5f8NAM//AADH/yUBw//PAc//JQLe/1IC1P9rAqn/ewKD/4ECZf+KAlb/jQKP/70
CM/93AlT+ngIv/s8CNP7pAlD+9gJh/hIDaf4wA23+SgM+/r8CN/50Ajj+QQIAAAAAagEAAAAAAAAAON0/Zrebm4l+qT+AAAAAAQAAALpe1j5MIkM/
gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8g
AL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8gAL8/IAC/PyAAvz8BQSG/E4EYfwsBAb86gO9+w0DvfsMBOT7nwF++SYBifgRAQj4BgG79/kAj/fyAHz37g
Bx9/MAbPf6AGL3oAF694wCnvw0Am/+rAH+/jABH//wAC7/4AAq/2UAev8UAJX/AACl/x0At/+fAP//jAD9/14A7/8+AOr/KADp/3gAjv7VANf9FQG
K/QAAAABrAQAAAAAAAABM3T9RX5lHl3WpP4AAAAABAAAAVh4vPwzRaz/M+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvD
B8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwfM+8MHzPvDB8z7wwc9/D4KtvztC
FT9wQf//1AGY/5CBUD9tATK/HMEFP0nAw79rgK3/JICf/yBAkn8iwLJ+9UC7PopA7368QL++pMCLfs4Ak/74wGC+9QAP/sAAHf64QDa+p8GIftVB4
/7MAfc+wAH2vsDB837Qge9+3MHtPuUB7n7tQfM++sHcfrFB8L5+Ad9+RgIAAAAAGwBAAAAAAAAAGTdP1qaM1iubKk/gAAAAAEAAADuqHI9bMSEPpQ
FQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QF
QfuUBUH7lAVB+5QFQfuUBUH7lAVB+5QFQfuUBUH7lAVB+wkIHvvRCtT6pwzA+o4L4vsTBeH7RgPJ+6oCkvuzAkv74gLV+tICcvq6Akn65AJV+lUDq
fqeA+76vQMa+8MDLvu8Avv6QwGD+o8AOfonABP6AAD8+WYAXf1+ALr9lwAy/qQAmv6lANn+wAAg/5cAu//ZANL/3gD//60BBPlrAef3sAED+OABBf
gAAAAAbQEAAAAAAAAAeN0/lDcGvc5jqT+AAAAAAQAAALghIz5ylCk/cP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgF
w/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIBcP0CAXD9AgFw/QIB9/4YAjn/2gFg
/8ABiv+rAZj/pgG+//sB//+JAM3/LwCV/wsAd/8hAHL/GwBz/xUAIfxJAFj7WgA1+zkAQfsAABj7SAAD+2gAw/p9AJb6jAB5+pgAZ/qjAAf7pQFD+
2gCTPs2AsD78gH3+/cB5vvHAdT7xgHB+9QBgfvyAUH7AwIp+x0CKPtIAgAAAABuAQAAAAAAAACQ3T/S9dRl+FqpP4AAAAABAAAAii+nPie0WD8jAn
L8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL
8IwJy/CMCcvwjAnL8IwJy/CMCcvwjAnL8IwJy/CMCcvwWA3b8aAOX/DQDyfxUAx79jANi/ZIDX/6cA/r+mwNX/54Dlv+iA8L/pAPj/6kD//+cA/r+
kAOH/k0Dlf28AqT9fQKw/V4Cp/1+ADb8AAD4+08AWPtvAPP6hgDN+pIAxvqZAMj6pADJ+rAAzfq4AM36vwDE+tQAqvrlAJP60gCD+ssAdPrsAC/6A
AAAAG8BAAAAAAAAAKjdP+wGi0IrUqk/gAAAAAEAAAB9gL8+gzkqP9wCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63A
IL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+twCC/rcAgv63AIL+oAERvgfBcT3bAU
e+GkEuvkaBKf6YwTK+pIE0fqnBPP6ugQn+8gEZfv/BOr75ARo/L0EyfxWBef8MQXl/OQEgfzsA136EQNy+XsC3vjhAJb4kQBk+GgAO/h0AOf4ewAq
+UsBVvlAAWv5bQCi+CkAnfgUAMr4CAD0+AAAF/lTAqv9nwIj/1kC//8AAAAAcAEAAAAAAAAAvN0/05Q6Q2dJqT+AAAAAAQAAAIK+6j4/xfk+SSDo0
kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0k
kg6NJJIOjSSSDo0kkg6NJJIOjSSSDo0kkg6NJJIOjShxPx1FMWuNZmGLHYoxeb2z0Xqty3F8jeXxVY4LsT7+CYD7Te3gkV540I0+DqB2PgAAAX4XA
D6+LjBnni2Qjl4U4NltOfEGjKaCZj79staPo6MQ/+Mzv//y9AAf9XME/0Syml67YncebbJw3jtija4IspWt8VHmnjdRzX5RIcNeclHL7n2Ryk5wAA
AABxAQAAAAAAAADU3T96SBxYrECpP4AAAAABAAAA+yHAPlsB6T6aDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL
/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/WaDy/1mg8v9ZoPL/UMDUf3JQlR99kGnP
dSBQH4oQUr+YAGifrDByj7ugcx+woHivsuCer3YQqZ9AgMqfK0DSDyRRFZ9OcTbfWeFbz1khaH9T8X2PQ3CQ77iwYI/j4G//+9Aq/yAQHz7UoAuOs
AAHnqAADO6V0EsuiSBQjnkQT16Q0ETut3A8Pr6ALe628CxesiBPHsAAAAAHIBAAAAAAAAAOjdP5DSjnH6N6k/gAAAAAEAAAAv/vY+5WIyPxUDe/oV
A3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA
3v6FQN7+hUDe/oVA3v6FQN7+hUDe/oVA3v6FQN7+l4ERPmUAo39EwNF/moCaf4SAaH9EAG4/TQC3/0LAur9rQHq/TYB6P3cAAb+tQBJ/qYAlP6iAN
3+mgBE/7YAjv9AAe7+cwAL/wAAgf8OAef/wQHx/+0B//+VAOP6YwCb+VcAKfldAAL5kQDx+L0A8/jPAP34zwAE+cUAC/nLABb59QAS+TABGfkAAAA
AcwEAAAAAAAAAAN4/73UWgFEvqT+AAAAAAQAAALzrozxFW9I9aQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPv
aQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPvaQlz72kJc+9pCXPvCQyD8sMP3vQkEYvrf
RGr6gAQTen3CSbs5AU17X4Df+2cAbntlQDh7QAAGu5ABXLsagi06jQK+OlCC97pmgtD6r0LrOqWB/HnogVW5tQJdvd5CkX8pQrQ/JUI8/vRCSz8EQ
sh/foLE//GDP//jg2u/6INLP/XDsv9dQ/R/TcQMP4hDav+lA2Z/gAAAAB0AQAAAAAAAAAY3j/Wk1x0sSapP4AAAAABAAAA9zUBP8P9KT9NAhr8TQI
a/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa
/E0CGvxNAhr8TQIa/E0CGvxNAhr8TQIa/E0CGvxNAhr8ZAcD+EcKc/adDVz1Dg5o810NyfH4Dlj65A2o/GsMXf3JCoj9eglx/ZYIVf36Bz79fwdy/
VUH0v7WB73/gQj//2wB5v4AAO3+6QDt/t4Adf4DAPr9kgCN/AQB2/s8AY/7YQFw+4kBWPuzAUv7xwFH+8EBQ/uqAUT7nwFK+6MBRfu0ATH7AAAAAH
UBAAAAAAAAACzeP8c5Lz8aHqk/gAAAAAEAAAAzQBA/3jVNP5r8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr
8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FASa/BQEmvwUBJr8FAQ/+6QBTfruAKL5
pwA++XgAFPl6AAP5iQBF+5gBl/v1AvT7ZANz/B0Fj/wzBoP8rwZM/K8G9vuuAyT8RwNL/C8DZf1oAhn+9wGE/sMBtP5dAlf/vAKa/5EC0f82Av//s
QF3/nUA3/0AAEv8tACD+wkBN/sPAXX6kAdo+tYJgfqvCib+mAoAAAAAdgEAAAAAAAAARN4/HbGA0YsVqT+AAAAAAQAAAGf+nj6TLA0/YvfoAGL36A
Bi9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAGL36AB
i9+gAYvfoAGL36ABi9+gAYvfoAGL36ABi9+gAYvfoAID6sQKT+/oDmPxcAiv9tgFS/NQApfvIAK76DgHb+VoB/fqsAe771wCV/AAALfzIBFn8xAUK
/EwGB/yuBgb8zQYE/3MGsv9cBtn/zwX//24FMfuRAa35vQCD+JIA/vevAJL35wAt9zIB5vZwAbT2kwGX9qUBkPaoAZD2pgGR9qQBj/aiAQAAAAB3A
QAAAAAAAABY3j9CEGccBg2pP4AAAAABAAAAcKlEP8O5ZT+H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//
wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNh//8DYf//A2H//wNc/7dDcP9Vg6n+04
QB/mTEGn3ahCL9vkPdO4nEpzs5BGd65UQxetCEB/rug/t764MKfBcCJjwLgL18NwAafFpAN7xAAAY/CEJ+/1RDfP9vg7X/ZMP3f76D0v/qhCL/zwR
p/+MEaj/qxGg/4QRiv8bEWj/zhBq/40QaP+UEHr//xD//wISAAAAAHgBAAAAAAAAAHDeP3vNGxGJBKk/gAAAAAEAAACWFL88JsZjPzEBUf8xAVH/M
QFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQ
FR/zEBUf8xAVH/MQFR/zEBUf8xAVH/MQFR/zEBUf+/AET/ywBK/+QAWP/zAGn/8gBx/+0Aa/+gAE//ewBd/3EAhf9mAJ7/pACt/7gAs//mALb/EQH
C/xMBwP8aAbv/IgGy/ycBq/9GAUn/VgED/3IBev6CASn+iwEB/pUB4/1QAZP/KgHl/zgB5v8IAeT/2ADe/7MA3v+QAN7/gAD//wAA1v8AAAAAeQEA
AAAAAAAAiN4/UlP7oBT8qD+AAAAAAQAAAAc4wTwwoGs/5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lA
eX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lAeX9pQHl/aUB5f2lARv9mwG9/GgBjPxKAW
/8OwE6/DsBF/w0AQL8JQEK/AsBafyOADr9XAD7/RgAZP4bAKv+vwDh/hwBA/9UASn/xAE8/wACTP8dAs//wgDz/0YA/P8WAP//AQCI/0cAyv5VAD3
+UADe/UgAnv1BAHH9PQBS/TgAP/0wAAD9IwDy/A8A7/wAAAAAAAB6AQAAAAAAAACc3j+RloS9qPOoP4AAAAABAAAA7bFzPRLb/D5BAo38QQKN/EEC
jfxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo38QQKN/EECj
fxBAo38QQKN/EECjfxBAo38QQKN/EECjfxBAo382gBD/MMAnPyXAP78bQBT/TMAvf0AAAv+HQFk/WACo/0YA9f9hwP7/dADG/4QBC7+UAQz/pMEM/
5YBHD9tAMs/U8Dz/wWA3388gI9/LUCFPyNAvn7eALZ+5sC3P79AMn/+wBl/88ARf+BAXn/kQHC/6gB//9lAl7/SQKS/mMCbvxUAj78AAAAAHsBAAA
AAAAAALTeP7qtWFhF66g/gAAAAAEAAAAHBFU/i2tZPzfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA3
2W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblA32W5QN9luUDfZblC07TRtneoNeMDj737P3
T2HVN33jX7ePpNd2hCXw9f9mrHUq5sN9QyXDO+TiP//H5tB5yuO6sXgkyXGNYQT7NVQAuy8QdvnW0Vr4jJFpt0zRG/cV0J42iFNU92UU6nhmFSw5f
BUVOjsVDDQBRPYzD8HGMgbBNvGJwJTx7wA/ccAAGPIPQIAAAAAfAEAAAAAAAAAzN4/D2o6Y+riqD+AAAAAAQAAAKHNcj6Njyk/Uf3+AVH9/gFR/f4
BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4B
Uf3+AVH9/gFR/f4BUf3+AVH9/gFR/f4BUf3+AYz9tQGv/UQByv3SAM79bADl/QAADv+PAlz/NAOD/1ADp/9MA9z/VwP//2gD3//UAzj/gQOc/5wDo
f+xA4P/xwNU//EDKv8PBBD/HQQC/xwEEP/vAxL+cQO+/e8CTPz4A2f8ZgSF/KQEdvzrBGv8EAVq/BwFaPwiBWP8KQVf/CcFX/whBQAAAAB9AQAAAA
AAAADg3j8H8g3Ql9qoP4AAAAABAAAATB51PikI1D5X+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/r
nA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDV/rnA1f65wNX+ucDXPkpAtP4+gDA+GcAF/kA
AGT7gwHR/CACs/w+AST8ewFX+7UCy/qRA9X8vQKA/n8C//9WAiT6cQGR+j4A8fkAAHb63AA3+rAA7vlPAHL4rAHJ98sChfdyA1/31gND9xkEJfdRB
P/2jATb9roEwPbTBKj25wSZ9gIFkvYQBYr2EwWI9hcFAAAAAH4BAAAAAAAAAPjePztd2JBN0qg/gAAAAAEAAADgKHI/n6Z7P0Ui9dFFIvXRRSL10U
Ui9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dFFIvXRRSL10UU
i9dFFIvXRRSL10UUi9dFFIvXRRSL10UUi9dGrE93JfQvbyxYHkNDlA5jUFQHi1FgAM9UAAEzWewGj1owEz9TsCJjTBwmd3h8KRt+yF0TcUx6I28kf
qtvxNIryuTon+wg8//+dLkv7gCed+YMhq/2BIcz8rCib7a0aSthuHKbUrB4T1BggW9THIErVKSFa1lwhn9cdI5PQYSQazKkkfsoAAAAAfwEAAAAAA
AAADN8/z1G/lwvKqD+AAAAAAQAAAL/2yT7LZHs/xv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ew
LG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewLG/3sCxv97Asb/ewL8/08C//8jAur/CgL
K/wICo//7AYb/AwLy/D0B6ftsAeT9zQCS/sIA0/7GAO7+yQD4/moA9/47AGz/VgCJ/04Am/9OAKP/TwCt/0wAsv9JALL/TACr/0oAnP9GAI7/OgCH
/x4Aev8AAOD+LACH/jcAU/41ADP+LwAr/qgAJv4LAQAAAACAAQAAAAAAAAAk3z8vowjX0cGoP4AAAAABAAAA3nvEPpmYYD9GAjb/RgI2/0YCNv9GA
jb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAj
b/RgI2/0YCNv9GAjb/RgI2/0YCNv9GAjb/RgI2/5gBp/4pAXr+4QBP/qYAR/5tAHb+YACj/mUAvP5lAMz+YADV/lcA2v41AED+AAAl/uYA6/26Abj
+sAHY/p4B3/6VA7z/swP//9IDdf8UBCf/PQT4/kcE1v49BK3+PQR//kIEYv46BGj+MQRT/jAEIv40BPH9HgP3/Y4CBP5PAgz+AAAAAIEBAAAAAAAA
ADzfPzfyGUGguag/gAAAAAEAAADd/Go+I1ZfP9L+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0
v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncB0v53AdL+dwHS/ncBcv4lApP+PAKW/jcCXv
+xAf//PQHo//gA7f/7AOz/FwHt/xwB0v/zAuD/RAPo/2MD7f96A+f/igPT/4sDUv/IA7L+1gNG/tMDNf7ZA3L91gM8/UQBAf28ADz9YQBW/SoASv0
NACD9AAAH/T4A7Px+AN78kwDY/JoA1vyUANL8iwAAAAAAggEAAAAAAAAAUN8/vE54yHaxqD+AAAAAAQAAAPj7WD6WZL0+CANj+wgDY/sIA2P7CANj
+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+
wgDY/sIA2P7CANj+wgDY/sIA2P7CANj+wgDY/vvBej3tQa59eEF+/ZQBvf4OgSW+cUC7PnwARf6hAFF+ikBRvrYALv5cAAa+SgA4fgAAOz4SgGZ/g
wCpP+aAu7/JgT///UE7f8VBeL/9wSq/8EEZP+KBCP/MQaj/R8GBfvOBZ/5nAXj+JsFZPiABGj5WQTQ+ecFp/rRBg77PAc0+wAAAACDAQAAAAAAAAB
o3z9g2sdfVamoP4AAAAABAAAAT7PVPCWdFz7mBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE
6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo++YE6PvmBOj75gTo+9cCvP0AALj9/QDI+bUB7
vcFAi33LQKz9jUCXvZdAk729wKH9nwI3/atChj4DAy9+AcNBfnCDS/59w0x+RMMgvuoCx38FQyg/lQM//82Cgb/AAYr/VcFzPzMBfL8cgZq/WAHlv
wTB+r7MwbN+2cGHPxPBtf73AV5+9MDDPsKAxH8AAAAAIQBAAAAAAAAAHzfP8Jsy/k7oag/gAAAAAEAAABA3g0//oNmP04DnvxOA578TgOe/E4Dnvx
OA578TgOe/E4DnvxOA578TgOe/E4DnvxOA578TgOe/E4DnvxOA578TgOe/E4DnvxOA578TgOe/E4DnvxOA578TgOe/E4DnvxOA578TgOe/E4DnvxO
A578TgOe/E4DnvxOA578TgOe/E4DnvxOA578VgS9+nQEi/mbBDT5xAQd+fMEB/kvBeX4tQOq+dUC9fkzAvD5aQHx+bgAEPpEADL6AABU+rEBdv2+A
rn+1gMk/2oET//nBIX/mgW7//UF7P8WBv//dwbe/9YGw/8aB7f/Bwf0/iAHi/4LB1P+4QY1/roCHP2QAYD8PgEx/CABBPwAAAAAhQEAAAAAAAAAlN
8/7jhkiSqZqD+AAAAAAQAAADlZVT42Agg/Vv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4
FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgVW/i4FVv4uBVb+LgUU/+kGWv/7B17/sgjN/gUJ
OP7aCAj+kAgt/oMIFv8uBH//MQOw//ACk/98Aqb/RwJq/2wBHv/oAPz+sQD8/oUAGf83AB3/AAC6/7EA9v8cAf//RAG//1EBrf54AZf9VALi/NICc
fwGAyf8FgMB/DIDzvtFA6D7RAN6+zsDW/sxAwAAAACGAQAAAAAAAACs3z8gdJEBIZGoP4AAAAABAAAA80TzPnJrfz8Q/CUCEPwlAhD8JQIQ/CUCEP
wlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPw
lAhD8JQIQ/CUCEPwlAhD8JQIQ/CUCEPwlAj38qAFe/AYCZ/xgAmn8nQJk/McCTPysAo78JAPL/FkDIP0LBFH9WgRq/XYEdv17BHX/yAT//6cEyP/Z
BNj/+gTs/w4F7f8jBeb/OgXb/1YF0/9vBUX/AQb8/jEGs/3jAmH95QF0++cASfvUAIL7oACb+4EAn/tWAJT7JACJ+wAAAAAAAIcBAAAAAAAAAMDfP
7L9b1Ufiag/gAAAAAEAAAA8HFs+F/OBPmoQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5m
oQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmahBm5moQZuZqEGbmRxg76Coeku/wJS/ymyT/7w8
ja+42JbnzNSGd+rsdUP2vG5v+JRqW/9AY//9VDUz81AT8+QAATfAMBTLrdAcr6ZUIReg3Bm/m5wU55ikGiuagBvjmCwdT5zEHpOfsBvTnxgVA6XsF
fOq7BSTrBQk36ZEJ1+cICifmjgoC5LgJEuMAAAAAiAEAAAAAAAAA2N8/YQg6eCWBqD+AAAAAAQAAABsa6z4bWGM/F//AARf/wAEX/8ABF//AARf/w
AEX/8ABF//AARf/wAEX/8ABF//AARf/wAEX/8ABF//AARf/wAEX/8ABF//AARf/wAEX/8ABF//AARf/wAEX/8ABF//AARf/wAEX/8ABF//AARf/wA
EX/8ABF//AARf/wAEX/8ABF//AARf/wAFS/hABv/2OAGD+TwAd/hgA1/0TAI79AAAi/gUAzv/fA97/bwXm/wwG8v9DBv//TgZ4/1IGOf9EBg7/QQb
n/lwG0v6KBsL+qQa6/roGuv66BsD+uwbG/sYGxf7WBq/+tgan/m0Gqf44BbT+mgSt/kMEmv7cA5z+nwO0/pEDx/6BAwAAAACJAQAAAAAAAADs3z+r
xEZdM3moP4AAAAABAAAAqoEvPgEImz4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NB
hn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/g0GGf4NBhn+DQYZ/pwCz/0YAl79swTh/pkF//9HBu
j/rwaq/+IGsv/7Bqf/9waU/90Gdv+xBkf/0QUu/wIFHv8AAGz7aQB3+jcAgvlcB83zlwhi8coI2u+9CMvusAgr7qQI0+2cCIvtjQhE7WII+Ow9CMT
sOgi77LoEk/FxAx30pAPp9E8EQfXgBSz2AAAAAIoBAAAAAAAAAALgP3QMCvhIcag/gAAAAAEAAACKVw8+6rEYPmW7OCRluzgkZbs4JGW7OCRluzgk
Zbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JGW7OCRluzgkZ
bs4JGW7OCRluzgkZbs4JGW7OCRluzgkZbs4JBXwVw0Z1cQF3c0AAIPO1AKBt24Eda28Fsl+wW2Vf3l/ToaAhdGMK4gRj5KKv43hjEOLvo8niPKP1Z
wel0OLW41/fgiGgXoChXyDTYEdvXJp4+HeW7z2ElX//7pUZNAoXB3PO1rHx0RaTLaoPLGtCC32qGcl3KhaJFKuXSoAAAAAiwEAAAAAAAAADuA/xw8
UPGZpqD+AAAAAAQAAAPYOJz/uM2c/vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT
970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3vQRT970EU/e9BFP3eQQ+9FAFEfUHBUn2uwRH9
4cED/hbBAP5PAQi+UwEvfgMBaH5TANt+VkDJPlxA+b4AABY/PEC8v5WA///MQRD+ncExPiUBF34lwRF+IsEWPhoBHD4OgSP+B0Eq/h3BKL4fASI+G
oER/hUBCv47gTS9zoFnvdNBYX3UQV69wAAAACMAQAAAAAAAAAY4D/IAhEdi2GoP4AAAAABAAAAKgTlPtoWHj8bBpD8GwaQ/BsGkPwbBpD8GwaQ/Bs
GkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsG
kPwbBpD8GwaQ/BsGkPwbBpD8GwaQ/BsGkPzBBZH5ygUK+OAF/PZpATr1dwAf9TUAffUAAE326gHS+OoCIvo4A+n6awPZ+80CiPxuAk78ogHA/YYBA
P1wAUb8LAKJ+0cC2/smAhz8QQN0/YcDAf6LA0v+hAN//noDpP5vA8f+XgP7/kIDPv8WA47/qgOZ/5cD8f9eBP//AAAAAI0BAAAAAAAAACTgP8LMyI
63Wag/gAAAAAEAAADS28c+hZgLP+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwf
k9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB+T0cwfk9HMH5PRzB6T4Tgs1+sAN3PnlEBD1VxCM
8qYPQPHPDiX1lAQa9mwBPPY8ACr2AABZ9n8AQPYBAe31ZgGY9Z8B/PRXAtf3YALQ+ewB1/sVAqL9mwPv/skDm/9gA///FQMo/54Dbv56Ayb9jgLe/
FMC/PwHAjf9rQFo/WoBhf0uAY/9+AAAAAAAjgEAAAAAAAAALuA/UrgehetRqD+AAAAAAQAAAIrr6T2Ip0I+ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7
X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X
4ygu1+MoLtfjKC7X4ygu1+MoLtfjKC7X4Vw13+wAPGPhKD5j1yQ4U9FYJwPMTBp/ziQOX9XwCfvZzAuL2HAMn96IDWvfBA2f3mANQ9wAA0POvAjz4
YwQz+hoFffqrBaj6Kwl594wL8vp/Ciz8IQmL/N4HsfyaBib95RX//9MZ5v/+Gdf7wRqU+WYbe/g/HBz4bR3V9wAAAACPAQAAAAAAAAA64D+tJBH0J
kqoP4AAAAABAAAAAQY0PwpCYD93+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/
oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZ3+gYGd/oGBnf6BgZb+nQH2fmACLD5DQnM+UcJ+Pc
vCFr3mgc392wHuvePBp/30QVC9xEGlPYfBtH22wUk95AFb/c6BZv4RAUB+lUDqPgzAeX3OAA89/wA3vivAKb7pgHn/BoCev1MAr/9igLf/bMC+f3D
An/+hQIt/z4CQf8pAv3/IAH//wAAAAAAAJABAAAAAAAAAEbgPwA4uc9pQqg/gAAAAAEAAAApDLQ+BD1KP7D/2gKw/9oCsP/aArD/2gKw/9oCsP/aA
rD/2gKw/9oCsP/aArD/2gKw/9oCsP/aArD/2gKw/9oCsP/aArD/2gKw/9oCsP/aArD/2gKw/9oCsP/aArD/2gKw/9oCsP/aArD/2gKw/9oCsP/aAr
D/2gKw/9oCsP/aArD/2gKw/9oCsP/aAm3/KgEr/wAABP8SATD/DgJO/8ECwv/aAv//2AGw/3sBff8uAV//BQF+/w4Bm/8lAaj/OAGa/0YB2v6YAV/
+1gEe/gAC6P0oArb9RQKm/WoCi/1lAon94gKS/RoDqP0rA8L9KgPZ/SQD6P0lA+/9LAOD/jUCWv/3Ac//3AEAAAAAkQEAAAAAAAAAUOA/yZJKDLQ6
qD+AAAAAAQAAAPq+0jzP+IM+K/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7m
wMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDK/ubAyv7mwMr+5sDwPlZA9r5LAEY/GIBef2VAWD/Pw
Pu/0gE+/99BP//SwTr/xYEZv/CBbD+qQVQ/pMF+P2uBbn9sgV6+xMBnPtKAPH7EQA7/AAAcPwVAJn8LAC8/DkAbPsJAVP81gD1+ycBLPt4AeX6dQG
X+sABcPo/Ao/14ABf9AMBF/ROAQAAAACSAQAAAAAAAABc4D9cBBOeBTOoP4AAAAABAAAA5m0mP8esNz9dDbzvXQ28710NvO9dDbzvXQ28710NvO9d
DbzvXQ28710NvO9dDbzvXQ28710NvO9dDbzvXQ28710NvO9dDbzvXQ28710NvO9dDbzvXQ28710NvO9dDbzvXQ28710NvO9dDbzvXQ28710NvO9dD
bzvXQ28710NvO9dDbzvXQ28710NvO/sCvT09Qmj8W8JtO0ICYjr8Qg66zAOzOkCES7q+BBR6yYQ8+okD3XqLA4P6v4Kce3nCS3wqgmX8egKG/N5DE
H0cQ0N9V8RVvtcE6f+2Qug+ocHbfu5BFT8rgL1/HMBc/6yAP//AADm/JEAwPz4APj7SAGL+8gMs+gqEl3jAAAAAJMBAAAAAAAAAGbgP1BAenleK6g
/gAAAAAEAAAAl1hA/tpw1P1IE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4
UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+FIE8PhSBPD4UgTw+C8GpfmNCer4Cwy1+B0OEfniDzf5O
hBv9+gPfvdCD9/3gQ5G+LINnPjTDKL5yQtq+/YKbPyPCqr8gwsE/dcKdvyGCrf78ATS/8oD//+oBM3/lwTv/k8EKv4ZBKb98gNZ/c4DP/1bA+T8Ig
PU/LMCFP1nAjz90gBd/AAAxvsAAAAAlAEAAAAAAAAAcuA/BZUBk74jqD+AAAAAAQAAAP+QRD7PcT0/lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQO
D/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9lQOD
/ZUDg/2VA4P9lQOD/ZUDg/2VA4P9hwMq/aQDmf2eA7L9AANA/QoDufw1A1T8XwMP/E8DDfxhAxj8dQOT++sA+PwAAHL9kQBO/c0ANP3ZADX9ywA1/
bQAMv2YAHf9dwBS/WYAJ/1kAA79dwAI/ZAAD/3QArr+WQNp//YDi/8zBJ3/SwSs/2kEuv9/BLv/iQT//wAAAACVAQAAAAAAAAB+4D8bo0PfJRyoP4
AAAAABAAAAJRWVPV7zsT7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8
AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP7vAED+7wBA/u8AQP5XASj90wBl/lMAMP8AAJX/FwD//7wE
Lf00BnH8pwY8/M8GGfzYBvv7zwbp+70G4fs/Buf7ZAVJ+x0FC/uRAcX44AA4+NYAHfjoAC/4AQFp+CMBjPgfAXj42QAr+JwA6fd2AMX3EAFt+FUB0
Pg5AXr5rgCX+WMAd/kQAOj5AAAAAJYBAAAAAAAAAIjgP+cV9FKUFKg/gAAAAAEAAACQ2mI+XdgqPwoDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/
4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4KA7P+CgOz/goDs/4
KA7P+CgOz/goDs/4KA7P+CgOz/goDs/5QA4H/YAPm/4QCVf/yAfT+oAG+/m8Bn/5uAKn+VQCZ/mgAhf4KAO79AAAi/hcAU/49AHn+5QBk/zUB0f9d
Af//MAJr/6ICNf/oAi7/FQM3/yYDP/8fA0P/nQPr/tYDxf7zA7r+DAS0/ioEvv5LBML+ZATJ/qoE5/4AAAAAlwEAAAAAAAAAlOA/41zf4gkNqD+AA
AAAAQAAAOJhNz+wEIA/Hf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/e
wFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBR397AUd/ewFHf3sBYT71Qe/+78JFvwfC579LAqS/h0
J//93B93+NAKk/aQAMf0AAKT8awFM/PwBDvwVAtv7DgK7+/YByPvtARv8egKd/AkDufzyArv83QKt/L4CgfoNA0n6pQJd+mcCZvpCAnH6DwJz+t0B
JPqGAmX8xAfT/HkJ1vzgCQAAAACYAQAAAAAAAACg4D8LZuqDhgWoP4AAAAABAAAAowfrPvrlfT/rAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86
wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86wHG/OsBxvzrAcb86w
HG/OsBxvzrAcb86wHG/OsBxvzrAcb8VwGJ+x0B1/oEAXH6TgHP+WQBTvlkAe74YAGd+FMBY/hcAVf4cwFb+AAClvijAbL42QGE+cMBa/mXAST5eAE
e+Q0CRfriARX77gGa+90AYP5vAFD/PQCj/xwAvf8EAMX/AADO/54C//+NA/b/6QPq/wgE6f8QBOj/AAAAAJkBAAAAAAAAAKrgPypZEisK/qc/gAAA
AAEAAAAqCAI/h8o/PzgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+
zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefs4BXn7OAV5+zgFefuCBKf78gOS+68E0PmoBBj5xQK9+H
sBgfjOAGT4eABi+EkAZvguAGz4FgCG+AAAfvjUAHX4JABj+SIAyPnAAej42gLK+GwD3/hACOz88gmD/o8KOf/bCp//Dwvg/z4L//87C+//BQvq/98
K7f/SCuf/tArZ/6wK0P8AAAAAmgEAAAAAAAAAtuA/FVRszZT2pz+AAAAAAQAAAMrBxj2Q4oY+DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0I
lfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0IlfwNCJX8DQiV/A0Il
fwNCJX8DQiV/A0IlfwNCJX8DQiV/HMKP/uWC1j6GAzL+SMM0/laDNj5lgzG+a0MufnGDKf5CA2X+UYNi/lmDXf5Wg01+T0EOvsuArX7mQBW+hAAUP
kAAMj4dACg+XMAWfqJAMj6oAAD+7AAI/vHAD37EQFy/TQB1v74AIH/DwLZ/6sB//+qAe7/zAG6/wAAAACbAQAAAAAAAADA4D/FJyVgJu+nP4AAAAA
BAAAAYjtYPqAkfD9x/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx
/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcBcf43AXH+NwFx/jcB1/1HAVf9EwH2/OcAwvyPAJv8cwCO/
GwAjvxnAHX8sgCE/IYAkfxTAJr8LQCg/BMApfwAAIj+cwAM/9sAT/8JAWn/IQEk/94AFv+6AAz/rgAJ/7IADP+5APL/gwL//ygD5v9OA+D/XwPa/0
sD0v8+A8X/TwPi/0EDAAAAAJwBAAAAAAAAAMzgP2IWgdi+56c/gAAAAAEAAADDdsM9fKhWPhn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/Ec
JGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJGfxHCRn8RwkZ/EcJ
GfxHCRn8RwkZ/EcJGfxHCRn8Rwkg9zkG1/KSBfnujQUI8hIFdPTiAwz9pAG2/rsAuv5AAP39AABe/W0A6PziAIf8VQFU/MsBrvtoBJD8IAWB/SoFS
v4MBf7+7gSE/6sE//9CBKH60gPD+A0GgvcRBCz6jgcX+/0Jo/tKCwf8TQwd/HQNMPxlDpz8Jw8AAAAAnQEAAAAAAAAA2OA/IJLbK17gpz+AAAAAAQ
AAAPYUIj8i9k4/twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38two
N/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/LcKDfy3Cg38twoN/AQIovyzA2P9PgEi/gAAuv4jB/b7zghK
+/AIGvu4B7D5yge7+aAHA/pxB5/6Vwdm+i0Hafj5Cdb3yAsB+OcMLfilDZr4MA4D+R8NCfqjDLX6VAwy+xMMifviC7X7xAul+yoNl/7BDK7+Vgya/
hUMev66C3r/cAv//wAAAACeAQAAAAAAAADi4D8B/aZPBNmnP4AAAAABAAAAhIj3PFc2Nj9d/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV
3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3/WQFd/1kBXf9ZAV3
/WQFd/1kBXf9ZAV3/WQFd/1kBhf9+AZD/uwGf/9gBq//cAUL/XgEb/wMBe/9EAWn/igGQ/3IBqv9ZAav/OQGr/yEB7f/gAP//7gD9/wcB+P8lAVz/
cQEA/68BAv+kAW7/TgGI/yIBif8HAYv/+ACQ//4Akv/WAIL/xQBQ/4QAR/9cAFD/IwBE/wAAAAAAAJ8BAAAAAAAAAO7gP25pbDmx0ac/gAAAAAEAA
AB6+48+cbiwPhwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+
YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+YcAffmHAH35hwB9+aeBV3p0A4C+gcUcvepFRL3GxZC93MWlPd
LF6r3wRNj+5IGSPvbA3v7kQMY/CMIaf5GCpP/Jwv//wgHFvojA4L4nQHQ9ucAKfV+ANbzKADP8gAA8PHTAPDvsAA77bMAKezKAKHr9AFK7XcC6O8w
A0fxHgT08fgEdfIAAAAAoAEAAAAAAAAA+OA/qlvL3mTKpz+AAAAAAQAAAE9r1z4EbVc/QfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/
EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/EABQfxAAUH8QAFB/E
ABQfxAAUH8QAFB/EABQfxAAS79FAEf/kwB1f6oAWL/8QH//8MAUf0UAD78AACO+ykALvtSAPv6cgDZ+okAuvqSAKD6pQAG+msBuvnDAZT55QGJ+fE
BnvnnAU36mQGJ+n0Bmfp8AZr6igGT+pABg/qHAWr6eAFS+nQBPfpwAan6tgHp+o0BCvtxAQAAAAChAQAAAAAAAAAE4T8HjHk1H8OnP4AAAAABAAAA
2IulPma5HT9p/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGa
f3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBmn98QZp/fEGaf3xBqv9wAYf/ZcG+Py1Bpb6ZQYk+VgGZv
hvBuD3jQbm95sHrPcACIf4uglC+cQKw/lcC0z6swuU+gEM2/uZCsb8LwoD/8MJhf+5Cf//DwrY//sJ2P7PBKH+AQOD/ugBcP5FAWP+3gBY/pUASf5
cADP+KwAf/gAAAAAAAKIBAAAAAAAAABDhPwKqQjPgu6c/gAAAAAEAAADgIS8+IDy3Psb5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmN
A8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA8b5jQPG+Y0DxvmNA
8b5jQPG+Y0DxvmNA8b5jQPG+Y0DZ/o5A8r8fwJM/PMAXf0AAN78LwHp/BICR/0+AhT/zAjR/9wJ//8MCsX+LQr8/XMKsvsWCib7+wkU+9UJAPugCd
T6eAm2+mYJqfplCa36dgm9+psJ2/rHCRf78QlO+xQKe/ssCpn7NAqv+zkKxftLCv77CgoAAAAAowEAAAAAAAAAGuE/GCAIzqe0pz+AAAAAAQAAALn
Tsj5glf8+PPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3
AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AAA89wAAPPcAADz3AACY+NIC1/i6AsP5oAJY+qYC5/rEAQn7w
AEv+8MBE/syAk39EQGp/pgAeP+WAP//rAC7+ykKHvpkCWX4bwi89tQHRfR0B6LyhQei8YYH5vBnB0vwRAfQ7xYHje/HBozvhAaX7yYGke/oBYDv3g
Vl7/AFRu8PBgAAAACkAQAAAAAAAAAm4T9y2MD7da2nP4AAAAABAAAAFxgKPkzbGD9U/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQF
U/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU/lkBVP5ZAVT+WQFU
/lkBVP5ZAVT+WQFU/lkBVP5ZAcz+vgJC/m4C3f3/AeD9ygHi/ZUC6/0YA+L9ZQOf/XQDgP1sA3L9UwNl/UADLv1WA/f8cgMe/aADUv3BA3v91wOl/
eUDef0aBIr98ANG/U8DJP8CAaX/XADN/xsA2P8AAP//AQD4/wwA1P8SAKr/HwB5/zAAAAAAAKUBAAAAAAAAADDhP0UCebJKpqc/gAAAAAEAAACfBo
g+ZvmcPgUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX
/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/BSql/wUqpf8FKqX/Ry8d7iYxVeYgLwLkfSxB5QgrF+c9Kiro
4iRi5g4d4OSPF6buNxS48f8W5e1rF8rsVRcL7cAW1upCBc725QHd9ccAlPRDAI/zAAC88gIA4PFWAHvwoACk7vkAze1TAXztFCPJ9QsrtPl/LZ/7x
i6e/NQw//8AAAAApgEAAAAAAAAAPOE/CNhR6CWfpz+AAAAAAQAAAPUjrT7StkE//QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/Q
Dd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QDd/v0A3f79AN3+/QD
d/v0A3f79AN3+/QDd/v0A3f56AFn+qgDT/oQAK/9NAFb/GgBo/wAAf/8GAKL/EQCx/x4A2v8sAP//9AEP/vsBuf0VAsf9MgLb/TwC/v00Ahb+LwIU
/i8CDP4oAg3+JQJN/g0CSf5bASz+RwHX/VABj/1cAU/9aAEV/XAB3Px5Aa/8oQF0/AAAAACnAQAAAAAAAABI4T9cZoGTB5inP4AAAAABAAAA0tw5P
mcJ3T5PBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+0
8EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+08EivtPBIr7TwSK+78EJP7dA1f/ggO//5sD8f/NA///dwPA/zw
C7v1YAQr9tgC2/DgAmPwAAJz8JwAT/EcAm/t8ABL8cQCQ/G0A1/xcAE/9OgCn/S4A4f0dBMT/cgJv/o0CgP6yAw7+SQSe/ZMEYf2/BEz9BAV0/XUF
ef3ABVn9AAAAAKgBAAAAAAAAAFLhP7lTUqrvkKc/gAAAAAEAAADW2pE+BUUPP2AAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAK
vxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKvxgACr8YAAq/GAAKv
xgACr8YAAq/GAAKvxgACr8/gLP+e4Dw/g+BGr4UARO+LEEi/rgBPX83wQE/uAEeP53Ag3+DQHJ/VoAsP0LAv//sQF9/8IBC//NAdj+xgG//hcCyf4
HAvL+1wH3/q0B6/6EAdL+7wAv/6oAPP+EADb/agAw/1cALP88ABr/GAAE/wAAC/8AAAAAqQEAAAAAAAAAXuE/zagjI96Jpz+AAAAAAQAAAE0LiT4U
EUs/av+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/
6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogBq/6IAav+iAGr/ogDW/gsAlP64AfT+1wF6/58B2/9bAf//IAHv/x
QBxf88Aeb/kgHS/6wBvv+zAaX/sAGX/6cBjv+dAUX/jQEo/4oBEf+LAQ3/dAFd/50BAv63AO39WQAI/iEAKv4AAEX+AABJ/h8ARv47AED+SwA1/kk
ALv5GAAAAAACqAQAAAAAAAABo4T+amWj00oKnP4AAAAABAAAAiOu3PG/0Tz0G7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7Rca
Bu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaBu0XGgbtFxoG7RcaB
u0XGgbtFxoG7RcaBu0XGljnOwdt4gAA1eCgEave3Rtn3C0gONtOISnd/CDj4V8fQebkHdDpIR1N7u0gpfWRH1/73Rv//0wa6PpwJQPjCx8J2b8j3d
JIJuTYKycc9lo18PylN479+zj1+3w5E/kROeT2Gjl/9W45zvViOmnzSyvW8/AhAAAAAKsBAAAAAAAAAHThP0VPqBTOe6c/gAAAAAEAAACbKzU/Vt9
SPwAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP
9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2AABP9gAAT/YAAE/2HAeQ+SMJFfuLCb77Qgo2/PAKQP0aCP//ABA7+
+kPyPUXDsjyngyH8dsLVvDcC7nvHgw270oM9e5SDMDuTAy07p4LnewyDLTuRQyb7yAMvu8LCZDxJwdZ8iEGk/KzBaXyWgWZ8v8EiPLGBFrytAQ18s
MEVfIAAAAArAEAAAAAAAAAgOE/lLJ9es90pz+AAAAAAQAAABflOj4e/no/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1c
CC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cCC/9XAgv/VwIL/1cC
C/9XAgv/VwIL/1cCC/9uAiv/bwIb/1kChf4pAq3+AgLR/uoB2v7bAeL+dQGR/mwBf/7RAAr/kABo/18Ap/81AMf/EgDL/wAAz/8PAM3/HQDR/yEA4
/8iAPX/IQD//zwBHP7NAUD9JQLj/IMC7Py2AuT8gwOz/I4Do/yAA4b8egNg/AAAAACtAQAAAAAAAACK4T8cN5cc122nP4AAAAABAAAA0cHWPhrBHj
9y/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAF
y/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAFy/hgBcv4YAXL+GAHT/hoA0/4AAEH+xwAU//EAZv/gAGH/2wBw
/7oAhf+eAJL/oACL/6UAdv+aAGf/mQB8/40AiP2gBu/8DAn+/BIK+fueCMH7DAjM++kH0PtbCJ38FQhX/6AD7/+IAv//LALx/ykCtP9MAir/ZAKG/
lwCAAAAAK4BAAAAAAAAAJbhPyOntvHkZqc/gAAAAAEAAADfBw4/qZIYP68Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCG
virwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGvirwhr4q8Ia+KvCGv
irwhr4q8Ia+KvCGvirwhr4hQIn+CaB3HdjQLp8G8BgvNUAk/0TwQ+9VUJSPeaBNP5aw0q/QoNE/+kDP//KxEf968ShPIUE2Hwhg4a6aILduXiCSTk
UgmW418JkONpCXvjDwkQ5GYI7+VGB3DokAXZ6u4Dj+yTAvftTgH77gAAk+8AAAAArwEAAAAAAAAAoOE/HvCw8Phfpz+AAAAAAQAAAHu5+T7AVSE/e
gTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4eg
TC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4egTC+HoEwvh6BML4Pwaz9asHiPOTCEXyKQkh8WsKbfA0C7Pv3Qp
m8JwK7/DTA176aAG3/QAB//9CABH/AAB2/vsAMv0rAbX83QBb/PMA8/skAdT7OQHw+0QBEfxTAR/8aQEV/HMBDPxpARH8TwEo/GYBUfxqAV38qQFh
/AAAAACwAQAAAAAAAACs4T/g720QE1mnP4AAAAABAAAAXWL/Pa0ypT4a99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWC
Br31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCBr31gga99YIGvfWCB
r31gga99YIGvfWCBr31ggX+VsEHfunAz39AwMw/lkDJv+yA///2gNf96sBWPQhAOfxAAD672MADO9JAN7v3QEu8CIDU/AGBG7woAR/8A0Fi/BhBZb
wpAVq8bAGxPFFBxjyiQcZ8s4HCvIWCPvxSQj08WsI+PGeCAby5wgV8gsJAAAAALEBAAAAAAAAALjhP2tC6EczUqc/gAAAAAEAAAAG+OU+kkNIP50A
ef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Ae
f2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/Z0Aef2dAHn9nQB5/W8Aa/5nAAX/OQBZ/w4AdP8AAHP/CABr/xwAX/
85AEn/VwAt/yYBUP6hApL+ugLC/oQCxP4+AQf/IQGM/xQBtf+yAM3/kADa/4sA3v+ZAOL/0QD//9QAWP/VAAT/2gDj/t0A1P5AAYX+UgGS/lEBq/4
AAAAAsgEAAAAAAAAAwuE/YhAtjllLpz+AAAAAAQAAAGdRUD4zRyU/of5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh
/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/kgBof5IAaH+SAGh/
kgBof5IAaH+SAGh/kgBLP4JAf/9DwHo/RkB6v0eARr+HQFJ/iYBJ/6VAev9fgFS/rgAmf5PALr+QgC+/kcAxP5TANT+XgDm/mQA9/5dAOf+YwAk/1
QAgf8AAM7/ZwD//6MAQP/uANT+DAGf/hwBfP4uAV7+PAFD/kYBKv5SAQAAAACzAQAAAAAAAADO4T8d3lvahUSnP4AAAAABAAAAN3+HPniGOz8UAFr
+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+
FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv4UAFr+FABa/hQAWv6HAH7+ZACu/i0Az/4AAOb+OwBZ/2sAef+bAGn/x
wH7/+IB///TAXf/8gFN//wBUv8FAm7/CQKG/w8Cmf8vAqP/UAKo/2QCt/8AArP/5wG2/98Btf/LAar/twGf/6cBl/+ZAY//igGQ/30Biv+DAWP/AA
AAALQBAAAAAAAAANjhP1lbpiO4Pac/gAAAAAEAAAAKz4g+4qHVPgoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475Cge
O+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO+QoHjvkKB475CgeO
+QoHjvkKB475CgeO+QANgv5YEKP/GxL//9MP6vxhDtr60g0o+s4LQ/spCuD7JAki/M0IsPy5CNf8dwjD/LgB2vz/ABH9QQHt/M8BJfwqAlT7WAK++
qACXvpwA5z58gJO+cYB7vgpAan46wAs+dkAovnVAPP50gA3+gAAV/kAAAAAtQEAAAAAAAAA5OE/fzNQYfA2pz+AAAAAAQAAAJNbQz4dNEE///8nAv
//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv/
/JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycC//8nAv//JwL//ycCf//SAJf/OAB8/ywAa/8aAGf/AAA2/x4AUv/OAIv/
7gCy/xcB0f8zAfH/VwH5/wcC+v8iAun/LwLV/zMCw/85AsH/NgJs/ucBw/52Aez+KgEC//wA8P/hAHT/+wBF//YAcv9NAY3/hQGX/5EBm/+QAQAAA
AC2AQAAAAAAAADw4T+Q3q6KLjCnP4AAAAABAAAA7LdiPlbxTz/E/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aA
PE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAPE/WgDxP1oA8T9aAP
E/WgDxP1oA8T9aAPY/usB+/69ANj+JgCt/gAAdv4QAMb95AB3/U0BDf6BAWT+sgGR/ssBqv7RAb/+CgK8/iwCqf41AqP+NQKZ/jgCW/7EAb//dgPO
/3MD1/96A+j/hAP//5ID0P83BKX/mwSF/9cEbv8ABVv/GAVM/ygFAAAAALcBAAAAAAAAAPrhP5dyKZdyKac/gAAAAAEAAAB3S5g+u/MsP6790QCu/
dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/d
EArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAK790QCu/dEArv3RAKb+UwHk/m0B1v1eADv9JgD7/BAA4/wAAAv9JwC0/As
B1fyeAeD8yQHk/MQB6/ywAfT8nAEF/XEBG/0dAVv93QCd/B0Aaf5ZAPj+LAFy/0gBwv9ZAcz/kQHS/9YB4/8VAvf/TQL//3kC8P+PAuP/oAIAAAAA
uAEAAAAAAAAABuI/vXU4frwipz+AAAAAAQAAAOT3cT3j0OA+/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/
PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/PyVA/z8lQP8/JUD/P
yVA/z8lQP8/JUD/PyVAw79fAPg/OoCyvzfAcn8NQHd/L8ATf1jAIv9AABW/iIBH/9pAar/hwH//6EBzv6mASH+vQHU/coBn/3qAVz9DwIc/UYC9Py
aAtP82gK7/PUC0vwSA+z8JgMW/dkDLv0+BET9igRX/c0EY/0HBQAAAAC5AQAAAAAAAAAS4j/psGU3DBynP4AAAAABAAAASA+cPsU0zD7//zMI//8z
CP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zC
P//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMI//8zCP//Mwj//zMIvfomB4T4iQbw9k8GffX5BS/3pgbD+oQDIvwAAF
f6mQCt+58F8vxeCUH9Tgu5/PcLyvwEDDD9KgyS/XMM5/2iDCn+xwxS/ucMbP4GDYP+tQzG/lMM5f70CNT+Ige6/ngGjP5EBk/+QwYT/l0GAAAAALo
BAAAAAAAAABziP+wCTLphFac/gAAAAAEAAABG25q6rQUNP60CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0C
Nv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CNv2tAjb9rQI2/a0CN
v2tAjb9rQI2/a0CNv2cArr9mwLu/Z8CBf6zAiH+0wI1/iMDFv6KA+n9DQQN/iQEG/4VBCP+AgQo/vADKP6dA4f9ZwMv/UwD+fxDA9P8NgPY/AcD+f
wMA4r+GwMX/xIDlP8mA///qQOd/04BFf8EAa/9aQBc/QAALP0AAAAAuwEAAAAAAAAAKOI/RTSX/rwOpz+AAAAAAQAAAC/YTj1N/XI/jgH//44B//+
OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+O
Af//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//44B//+OAf//jgH//wEB3f+lAML/XwCu/yUAnf8GAJL/DQCR/xsAlP8pA
Jb/AABv/zYAh/93AKH/oACz/0kBMv9lASv/pgFM/7gBXv+5AWb/zwE7/wsCJ/86Ahn/WwIZ/wYCRP/sAWD/4wFx/9YBdv/QAWv/ggFh/wAAAAC8AQ
AAAAAAAAAy4j9uywP8HQinP4AAAAABAAAAtUaOPhX/dD9D/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0
AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0AQ/49AEP+PQBD/j0A
Q/49AEP+PQBD/j0Ai/03AEH9MAAp/R4ANf0AAE79JQBx/WkAhv2jAJT9zQCd/eoAKP4NAMz+OQA5/zsAl/8+ANj/RwDS/5sA4f+5AOL/vwDh/8AA6
v/DAPn/3gD//+0AkP+sAF//kwA5/6IAHf+rAFL/fwBS/6kAAAAAAL0BAAAAAAAAAD7iP6PhXqqEAac/gAAAAAEAAACAnDs+xbldPxcBx/8XAcf/Fw
HH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwH
H/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/8XAcf/FwHH/xcBx/+hAf//HwL1/4UC3P/VAsX/GAO2/z8D1P9TA9T/xQKl
/1ACof8RAqj/6gGu/9ABsP+4Aa//KgF7/ygA5v8CAPT/AADy/wQA6v8qAB//RQC2/lEAjf5yAH3+iQB5/p0AZ/6mAE/+vwBT/r4AIf4AAAAAvgEAA
AAAAAAASuI/TviFAfH6pj+AAAAAAQAAALbBAD8Twz0/nPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoAp
z8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz8qAKc/KgCnPyoApz
8qAKc/KgCnPyoAkj9nAIT/g4Cjf7ZAU/+jgJu/gsDr/5hA/3+mANa/6IDof+aA9n/ngP//50D9f96A+//igOs+WkCFfnfAZX4jQKF+IgCjPhRApL4
EwKa+N0BsPi8Ae/4kwEK+XYB0/hBAYz4IgEW+h0AavoAAAAAAAC/AQAAAAAAAABU4j/dzmb5YvSmP4AAAAABAAAALctCPxLGbj/7+zIH+/syB/v7M
gf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mg
f7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIH+/syB/v7Mgf7+zIHIfxcCWX9CQvZ+kIJovn2CV75Mgpv+pMJ7Pv+BrD8GgT
k/IICEf2fAUT9BwF2/wAAtv52Bdv+kwb6/nQHa/8vCM3/rAj//w0J7P9YCdH/gAm+/30JuP8+Cbb/9Qik/7YIJv/ICEv+pwiR/RQIAAAAAMABAAAA
AAAAAGDiPy45/4na7aY/gAAAAAEAAAAO5TA+5exOPsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/
CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/CsGyPwrBsj8KwbI/C
sGyPwrBsj8Kwb//xEByvkAAKD5oQna+joP5vtyESD8lBLi+s4SGPm5EmL3HxLi9ukOuPhrDSP60g0K+0kOmfvIDif8uQ9a/SQR3/3bEoz8WRVj+sM
WXfJBJ8/x5Cm/84kqovGeJFDtwyJS6vUhT+itIcnmJCAAAAAAwQEAAAAAAAAAauI/c/Zcq1fnpj+AAAAAAQAAANZrzTxl7Uc+OvQAADr0AAA69AAA
OvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAO
vQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAADr0AAA69AAAOvQAABf3vwLf+XIEv/zCAqX+6QH//4sBzvyJA2X6ZgT2+P4EGv
hbBVz3WAUb9rIEEfUzBEv01QNQ9LcDO/TbAxr0CgT88yAE1PJRA6fuxATb7IIFj/DkAh7xhAEf8cEAQPFNAQXxowKN8agDqfEZBAAAAADCAQAAAAA
AAAB24j+biJ1V2uCmP4AAAAABAAAA00YOP+7VLj86/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/
BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/BTr/fwU6/38FOv9/B
Tr/fwU6/38Fqf77Af///gLj/4cCEv8YA+r9nAPS/OADDv6FAoX+qAGX/vsAj/6rAOj9UQA7/QIAuvwAANn7KAB981MAZPSuA6P10QWk9uEGZfdqB6
j3/wWF9xkGo/faBqP3WAZi97oF8PZpBYH2BwbA9eMFAAAAAMMBAAAAAAAAAILiPzcM7oBi2qY/gAAAAAEAAAC3xz09UXC8PhwBf/wcAX/8HAF//Bw
Bf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwB
f/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8HAF//BwBf/wcAX/8vgAi/WIAsf1UADH+iwCj/r0ADf/iAG7/BQG8/xUB/
/8tAeD+SgEC/roAxv2vAJv9ugB//bkAZv2wAFf9qAAh/XwA8fxNAMf8MwCq/CsAc/yRADz8UwDt+y0AXfwAAJz8AACz/AsAyfwAAAAAxAEAAAAAAA
AAjOI/3hCLJfDTpj+AAAAAAQAAALwXtz4CIjg/6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAH
p/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp/AQB6fwEAen8BAHp
/AQB6fwEAen8BAGF/9MB/f6BAXD+MgEW/voA4/3WAKH98QBx/QgBXP0MAVf9/QBQ/eMARP3CAGf9VACm/SQAw/0AAEv+/gCd/q4Bov5gAqr+8AJd/
1oD4f/KA///FwTz/0wE2/9yBC//ewIx/xECVP+mAQAAAADFAQAAAAAAAACY4j8GcsA7g82mP4AAAAABAAAAcXTJPTJH+T7q/KMF6vyjBer8owXq/K
MF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KM
F6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBer8owXq/KMF6vyjBdL8Jwa7/YMG8P3sBun9PAfg/X0H4v2oByD+2weX/u4H
+f75B0L/9Qc1/xwIaP+9B8f/0gbm/1AG6f8eBvL/AAb//+QFt/79BQ3+8QW//eIFnv3YBfz8SQLV/PIA0vxuANT8KgDV/AAAAAAAAMYBAAAAAAAAA
KLiP2Aw6bsbx6Y/gAAAAAEAAACEbgw/6DQPP1rc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1Wt
zZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1WtzZNVrc2TVa3Nk1Wtz
ZNVrc2TVa3Nk1DceBDgWpAACBkrcAgoDzA0zGmDmcwOtDpdf6ORTnZTai8rgzSvl7Kgn9ICOl/vch//99HKn+Ixbh9P8UjfGaG2f05h3I9Ywd4/jH
Okb10U2S2Bdsks1feYPKbIAsyTWE+8dwhhXGDYgAAAAAxwEAAAAAAAAAruI/n0tvnrnApj+AAAAAAQAAAHeemT0btEg/0P7uAdD+7gHQ/u4B0P7uA
dD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAd
D+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gHQ/u4B0P7uAdD+7gGx/8EB//+YAfb/HwKq/zwDmP/MA6v9EAMD/dQCt/zEAun
84QLd/GUCzPwxArz8JgJ7/NECZ/zkAmT86QJl/OECYfzIAmL8rwJl/JkCefx+Ap380QHG/GUB0f0+AC3+AAAu/60Bx//3AQAAAADIAQAAAAAAAAC6
4j+9nMvbXLqmP4AAAAABAAAAAyQAP8rnVz/3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7E
AD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EAD3+xAA9/sQAPf7EA
D3+xAA9/sQAG/8fgB0/CABKP71AoP+YAOn/n8Dsf6GA5T+QwNU/v8CI/7XAgL+wgLm/bICz/2rAoP+SwIH//0BW//XAav/xQHr/7MB//9yAez/WwF
W/zQAXv9bAE7/gQCe/zIAnP8PAIf/DQCA/wAAAAAAAMkBAAAAAAAAAMTiP7OwhWwFtKY/gAAAAAEAAAD3bBY/SpRDPzEA//8xAP//MQD//zEA//8x
AP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xA
P//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//MQD//zEA//8xAP//2AEl/xoDVP4iBAD+qQTP/RoFlv15BV/9rwVI/b8F6/xXBS
r86QhR+AoKv/eVCkv3lgnU+NUIcfklB7X5RAbg+eQFBfq3BR/6ngUy+pMFPvqaAYf4vAAs+HsAHvh6APf3OgAR+QAAcvkAAAAAygEAAAAAAAAA0OI
/n6MzSbOtpj+AAAAAAQAAADXxCz89ECA/9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO
9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9fHbDvXx2w718dsO9
fHbDvXx2w7K+AoNsPtLDFP9/Atj/tAL8//3C///nwmZ/3UIUf+CBxz/4Ab6/lwGDP/CBVb/sgX+/ssFt/xgBQz70AVN/K8Fg/2gBUf+hQV//PoBtf
sAAGP9HREf++wV4fi8Fyf3zBjZ9EkakPMmGwAAAADLAQAAAAAAAADa4j9c/HlqZqemP4AAAAABAAAAIeoZP9l2Vj/DAnf8wwJ3/MMCd/zDAnf8wwJ
3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3
/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/MMCd/zDAnf8wwJ3/IADRf10BOz+UQX//1MEtf9DAzD/hgLd/vkBqP6qAQr+zgCz/
K0Ak/1hAFr9VQDc/FwAePxiACj8OQAL/B8ADvwTAA38CwAG/AAA6fsVAL/7tgBT/V0BGf6MAkv9SQMM/aUDHP3iA0/9AAAAAMwBAAAAAAAAAObiP4
+IC8keoaY/gAAAAAEAAAAbk847ek/XPuAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eA
A6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA6f3gAOn94ADp/eAA
6f3gAOn9EgGW/jgBif4fAsD+ngL//uoCIv8bAzH/4wOR/ksECf4dA1z+ugLf/l0CSf8SApX/4AHG/7sB5v+hAf//eQG8/04Btv8iAZP/FwGT/6gA5
/5gAKn+MwB7/hgATf4AAB/+DgAE/iMA8f0AAAAAzQEAAAAAAAAA8uI/GDmpXdyapj+AAAAAAQAAABkrPT5Qf40+V/ynBFf8pwRX/KcEV/ynBFf8pw
RX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwR
X/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwRX/KcEV/ynBFf8pwQc/q4EWf9YBf//Nway/5MFGf2+Baz6/gLS+e8B4visAQz42AGa
99ACTfexA+P2jAP99Z4CJfXAAYD0JwEN9MwAwvPSAGL0eQBu+HkBPvq3Af766gHs+0oBhvzKALr8oAC+/KsAKP0AAAAAAADOAQAAAAAAAAD84j/1/
iEhn5SmP4AAAAABAAAA1Ly0Pp5NLz82/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/n
IENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nIENv5yBDb+cgQ2/nI
ENv5yBJ78DwX/+4wFlvvCBUr70gUe+9oF8frvBeP6Bwbm+hwG7PosBvT6Mwb5+joGEPzHBXT8xgWe/PkFWPzPBin8TgcG/I8HVvwvB1n/ywP//zUC
/v9pAdb/8gCo/6QAHv9zAPX+UgDm/gAAAAAAAM8BAAAAAAAAAAjjP42oUgxnjqY/gAAAAAEAAACV9mc902YZP4v/mwCL/5sAi/+bAIv/mwCL/5sAi
/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/
+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAIv/mwCL/5sAi/+bAP//AABv/3kAE/+nAOH+tgDC/rsArv6+ALP+zADF/vEA3f4
SARj/JgEi/0gBIv9fAV3/tAFZ/2UBAf9mAd/+igH+/jYB//4uAfX+TwHM/ncBnP6WAXz+ogFl/qoBB/6hAcz9jgEAAAAA0AEAAAAAAAAAEuM/ab8l
GDSIpj+AAAAAAQAAAHay2z5mwl8/af8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cA
Wn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAWn/HAFp/xwBaf8cAW
n/HAFp/xwB2//wANr/9ADm/8EA9P+YAP//gADN/00Auf8mAKH/IwDG/5cAtP/TAJn/7gCG/wEBhf8HAbH/EgHX/xcB6/8eAfP/HQHo/woBvv+uAJD
/YABi/zIAOv8AAHD/bACP/5kAnf+gAAAAAADRAQAAAAAAAAAe4z9JZpM9BoKmP4AAAAABAAAAKsvOPtXURj9P/gAAT/4AAE/+AABP/gAAT/4AAE/+
AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+A
ABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABP/gAAT/4AAE/+AABv/nYBEf5yAeT9WwHh/U4B8P1IAQ3+SQEr/kMBPv49AST+WQ
Ei/mEBOf5WAVj+LQF4/hQB9v7XADP/9gBB/zUBRf9nAXn/cwGu/4gB1f+UAfH/lwH//4oBwf7nAXr9BQKc/XgBAAAAANIBAAAAAAAAACrjP6w3oXX
de6Y/gAAAAAEAAAAZn0o/4WJ3P/H76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx
++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx++kG8fvpBvH76Qbx+
+kG8fvpBiT7LwiE+YsJl/h+CKX4cgeM+UIGdPu8BZ/8YgUk/SAFdf3fBN393wSI/hQG4P68BhT/GgdN/0kHnP9KB9P/QAfu/4wG7v/oBf//WQTh/7
YDvP8mA1X/xgL3/hwDOPsHAIv6AAAAAAAA0wEAAAAAAAAANOM/tiRiubl1pj+AAAAAAQAAAA715j3aIGQ/mP/nAJj/5wCY/+cAmP/nAJj/5wCY/+c
AmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cA
mP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cAmP/nAJj/5wCY/+cA4v5LAZv+sAEF/vUAuf2gAFP+jQDl/nwATv9mAJv/VACw/0IA0
v8AAPL/owD2/xQB5/9dAc//jgH//0wB5P8+Ac7/LAGz/xcBnf8BAZn/uQBR/2oAQ/9AAEX/KQBR/x0AX/8XAAAAAADUAQAAAAAAAABA4z91VPYBm2
+mP4AAAAABAAAA5BfTPQ+uLD7f+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l
8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8CN/5fAjf+XwI3/l8
CN/5fAhv9gsFLvN7An/wwwAz7gAAJOx1AIDqJwGv6XgCSulpA3nwLAXb9A4HXPdcCMz5gAkC/AcKK/4GCf//Gwgx/lsI2fxtCkj6sQcl+OsHpfeqB
uH3wwQN+DMD6/dWAmP4eAJu+Y0CAAAAANUBAAAAAAAAAEzjP5UDi0iBaaY/gAAAAAEAAACVCZ0+Xp/4PgAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/g
AAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gA
Adv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/gAAdv4AAHb+AAB2/skCzP4hCYL+bAoN/t4K7/1SCZD+KQlk/0QJ///XCS/+qAlu/AAK
cv2UCaL9FQlr/bwGjP3PBZL9dgWf/VMFwP1iBfj9XQMZ+9ECgfqkAlT6jQJI+oYCSfqHAk/6igJQ+gUAoP0AAAAA1gEAAAAAAAAAVuM/Z2Rahmxjp
j+AAAAAAQAAAIH8fT7SDAY///9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//Vw
L//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL//1cC//9XAv//VwL
//1cCof/rAm3/dgNP/+0DlPzjAen7xgHN+0ICn/t1Aon7oAIM/EABjvxxAOf8AADH/UcAAv5OAAz+RAAD/lcAlf2pAFX9KwEc/Y0B7PzBAcP82AGn
/OcBovz6AZ78BQKW/AwCifwRAgAAAADXAQAAAAAAAABi4z9Mf6u0XF2mP4AAAAABAAAAiWgGPvxE2z5c/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/
VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/V
cCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwJc/VcCXP1XAlz9VwKC/DkDVPxgA078WgOg/fsCX/69AkX/EgP//9kCxv9/Am7/OQGT/vY
A6v3jAE79UgDo/BAAo/wAAHT8AABR/AYAMfwbABH8PgD7+14A8/uAANn7kwDE+9AAr/sMAaD7PQGX+2IBAAAAANgBAAAAAAAAAGzjP4MT0sxRV6Y/
gAAAAAEAAABl0Bw/mrI6P6H1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAo
fX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAofX7AKH1+wCh9fsAof
X7AFj6+ASk/N4DKP41BAv/xQT//6sEtfxEAwD7gQIm+vQBbfgbARb5iQDT+QAAsfoAAFv6YQUH+gcIv/m6CF35pQgj+ZIIZvp3Cfn65wmZ+k4I8fq
YB8T6hAc3+qsHw/n/B674OAkAAAAA2QEAAAAAAAAAeOM/SHguyEtRpj+AAAAAAQAAAIHr1z7NwAY/K/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8U
BSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UB
Sv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFK/8UBSv/FAUr/xQFQvt9CGH5YAm6+H0JZ/jnCNv4WwlR+asJh/n7Ca35Ogoi+usKJ/8dC+
v/dgv//40Lwf+5C6f/TAtQ/WQImPsxB1z6PAcE+OgEKfbaAyz1vgKg9hQBXveCAPP3MQBy+A4A2fgAAAAAAADaAQAAAAAAAACE4z9efi2gSkumP4A
AAAABAAAAXleFPdWLWT9M/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/
AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/AABM/wAATP8AAEz/A
ABM/wAAAf9sACz/GQEe/w4BjP99AIb/gwB6/5QAbP+zAGn/vwB//60ANf9yAKH/WwDg/0MA//8yAMT/GACb/yAAgv8xAG7/QwBg/1QAXP9OAFX/Lw
BW/xgAXf8MAIv/EgCL/wsAAAAAANsBAAAAAAAAAI7jP+JRSE5ORaY/gAAAAAEAAABzIoo+vo74PmQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/x
kA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xk
A9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/xkA9P8ZAPT/GQD0/zzACn8FAFk+0UBH/vxAO/6sgDO+qwA0PocAaz5XwEI+nsAQPsAA
Bb8DADI/GIBVvzzASP8HAIU/DACGfzUAnD9aALW/SYCTf4MArv+AgIX/wMCY/8KAqP/FgLV/1UB//8AAAAA3AEAAAAAAAAAmuM/hVwEzFY/pj+AAA
AAAQAAAJpDIjxY90I/ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT
+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+ywC0/ssAtP7LALT+
ywC0/vMAkf6pAHv+sQBp/toAgv4IAY7+IgGP/ioBhf4zAXn+QgFz/rgBff7pAZn+/QGh/gsCnf4XApL+pwE2/zoBpP/zAOn/0QD2/7QA6/+YANv/I
ACg/wQA//8AAMz/BQC+/wAAAADdAQAAAAAAAACk4z8UKPMSZDmmP4AAAAABAAAAdttHPw1PTz+qIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqi
Ik4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiI
k4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThqiIk4aoiJOGqIiThdiZQ2TAt+dZmC1DU4AYY1i0GHdlrBkDYsgJ2zL8Bt8MRAZi+AADt
uxYAQroYBmSxvAVTvKMFtcF3BZ3FZBIy63wWHPXwFtj3LRWX+CMUYPn1EyH6FhRN+lEUdPqkEf//AAAAAN4BAAAAAAAAALDjP11Bshx2M6Y/gAAAA
AEAAACRkvI+dSlPP2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2
H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H/RgNh/0YDYf9GA2H
/RgNM/g8E6f2MBLv91gSf/QAFgv0BBWP94QRH/c0EJ/3SBAz9zwQJ/coEev0zBGb9FgR//hQEAf8HBEP/EgRc/xcEZP8OBCb/0QM9/6ADVv9+A4T/
9AGj/+sAy/9cAP//AAAAAAAA3wEAAAAAAAAAvOM/ZRvr4owtpj+AAAAAAQAAAKhAKz8Xs0Y/mvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4I
BGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IB
Ga+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEZr4IBGa+CARmvggEcP6jRe4/dAZSP8pGv//oRm//hkbvP3aGyL9Yhxn+3gel/pWHbr5rRs
P+aUawPhRGnD7ABW5830QbfKQDRvy5gsF8gcL/fGgCv3yJwzX8g0CRfMAAI3zDQBJ8zgAm/I1AAAAAADgAQAAAAAAAADG4z/z8lJfqCemP4AAAAAB
AAAAL1q6PmUXZj///zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//
zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//zMD//8zA///MwP//z
MDmf/sAYL/JAGC/7gAhv96AIX/NgB8/wAAq/1AASX/mwJZ/xMDY/+5A1//AgRb/x4EVf86BE7/YwRM/4QEV/+hBFz/rARe/60EUf+vBDP/tQQb/7M
EYP+IBFb/mQQx/64EAAAAAOEBAAAAAAAAANLjP3KyqovIIaY/gAAAAAEAAABKgIk+oT4pP8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/
xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/x
wGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/HAaD/xwGg/8cBoP/XAbT/7wHZ/wIC//8eAsv/MAJg/w8C7f7zAZH+ywGH/qUBmv5+AaT+hw
Go/poBrf6mAbv+pQHd/vUAO/5+AOT9XACz/UQAhv0uAGf9HwBO/RYAOv0KADH9AABJ/RYAWP0AAAAA4gEAAAAAAAAA3OM/HNa+Ye0bpj+AAAAAAQA
AADO6drttBCI/+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1S
Avr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SAvr9UgL6/VIC+v1SA
pL+BQHa/msA+P4xAAX/FQAP/wAALf8MAED/IQAx/zgAHP/mABL/PgEH/2UBH/+CAUH/gQFw/0sBqv8VAer/6gD//1MBpP9/AdD9PgIz/WIC9PxjAt
n8WQKy/DoCq/w4AgAAAADjAQAAAAAAAADo4z+AUGfbFhamP4AAAAABAAAAAvjRPsM/DD+eBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54
GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54G
oPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7ngag+54GoPueBqD7zQV5+TYGtvhsBsP4pQb4+rwFsPv9BAX8AAAi+QECwvYnBMn2LgXL9rcFd
PZHB3j5rAj1+c8IXvuYCHz8ZQg7/WEIzv0rCG/+0gfn/mwHYP/8Btv/uQb//7kG9f/KBmb/AAAAAOQBAAAAAAAAAPTjP1Fvh/JEEKY/gAAAAAEAAA
AWxtU+4zxyP13/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1AB
d/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABd/9QAXf/UAF3/1ABW
/38AS/9pAEr/WgBP/04AUf8AAGT/BgBp/7oAlP8hAbb/UAHM/2kB3/+BAe//lAH//6QB9P+dAe3/nAHe/5UBtP92AYP/TgFB/0sBG/9UAQn/UAEe/
0sBHP9lAQ3/ZQEAAAAA5QEAAAAAAAAA/uM/hsANoXcKpj+AAAAAAQAAANdeTj9OCng/5QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBj
T55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT
55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+eUGNPnlBjT55QY0+VIJb/lTC5z5aQv2+pkJevzlCPj82QWv/o0Dpf8MAvL/JgH//2kAzf/sABv9
awGn/MYB2/yxAUL8MgEA++oAAvq6AEj5kgAd+XAANflWAEv5KwBf+QIAW/kAAPH4MQAP+AAAAADmAQAAAAAAAAAK5D/H9/PgrgSmP4AAAAABAAAAI
9WTPmmQsT568YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICev
GCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevGCAnrxggJ68YICevG
CAjr3xQIG/AAA///OBtP+fQn5+n0OXvr8DVP6jQ09+nQN/P58C/X+7wkZ/j8JJ/3cCFr8igi2+z8IQvvzB/j6QQd8+vUFgfkVBML5fQPW+jIDtvsH
A1f85gLx/AYDAAAAAOcBAAAAAAAAABTkPynUPqzq/qU/gAAAAAEAAACK3WE/nvlkP6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn
6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6
yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfrIuzn6yLs5+si7OfmmsGoYVq5K4hYHaz42R01C2VH6xavnCN6dWzgjvlKYBp8B+Br/i9gYb
9/H+1/Ed9d/xGezn+DHed/0xz///GcV73IY705IeSlmL8tisq68R8EznJowenygAAqcsAAAAA6AEAAAAAAAAAIOQ/LQb+/Cr5pT+AAAAAAQAAANYJ
aD+3M3A/+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWN
ir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNir61jYq+tY2KvrWNi
oJ2U4nqdi+J/XfSjEK5Bg4/utpNhf3nSGF+nAgv/yFIfz9liL//34jqfLMFgPp+Q4H5IkKwuFDBhrfkQLG3AAAv90RB8beHwmi7cQYKfAJGlTxLhn
e8cYY1PGAGQAAAADpAQAAAAAAAAAs5D8XFkzNb/OlP4AAAAABAAAAsWtAP7R+fD/jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7j
AD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jA
D7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/uMAPv7jAD7+4wA+/mYAJ/8/AJb/LgCE/yUANv8RACf/EQDO/ioAqP6aAO3+BAEW/4YBtP0RAj
79YgIO/V0Bkf6mADv/OgCJ/wAAuf9fAaT/UQLR/yYD///LA+//QATn/80EgP8JBV//AAAAAOoBAAAAAAAAADbkP4NKThe57aU/gAAAAAEAAACXkdk
9SP90P4H/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gB
gf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBgf+IAYH/iAGB/4gBD
P/HAPv+nQAU/6YAOf+1AFj/vgBt/8YAoP/KAOP/zQD0/24B+f+lAf3/wQH7/9EB0P8SArn/RAK1/2sCv/94AsH/dgLS/3IC8f/EAO7/OgD//xoA9/
8JAOf/AAAAAAAA6wEAAAAAAAAAQuQ/So801QbopT+AAAAAAQAAAOLWyDwuBlU/7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9
+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+
AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgDv/34A7/9+AO//fgD9/ycA//8AAPL/FQDn/y0A0/9SAMH/dAC6/44Avv+WAIL/iACg/zAAhv8KA
G3/AAA3/0AALP9PAB//VwAU/10ADv9lABT/aAAd/2IAJv9XADP/QwA+/yEAUv8bAAAAAADsAQAAAAAAAABM5D+oXDkBWeKlP4AAAAABAAAAQF8tPz
ETVz/oBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/Og
ENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/OgENPzoBDT86AQ0/JYE
Iv75ARf+AgEM/7QA//8AAOX3ugFc9f4Cv/S8A3T09QMR9P8D1vPuAkHzPwJb9QYCqvYGAiT3gAGb9wAB4ffPAPL3UQFT+HsBWviTAUb4tAEh+NkBG
PjhATH4AAAAAO0BAAAAAAAAAFjkP66eoZWv3KU/gAAAAAEAAAClfUQ+dU9fP///GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//Gw
H//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH
//xsB//8bAf//GwH//xsB//8bAf//GwH//xsB//8bAf//GwH//xsBw/8MAZr/GAGU/y8Bnv9AAa3/SgG7/0sBbv8KAYn+dwFz/p0BgP7BARv+sgEd
/gABZ/7+AGz+sgBn/mcAW/4vAEb+AABI/08BmP+TAa3/qQG1/7EBu/+yAbv/rwEAAAAA7gEAAAAAAAAAZOQ/+5y8jArXpT+AAAAAAQAAADJziD2r6
D4/nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAO
T+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6fAOT+nwDk/p8A5P6kAJz
+aQB//lYAjv5XAJ/+AQBZ/gAANv4GACv+BAAr/hkAMP48AEn+RwBa/kYAZv5CAHH+zQDh/+EA+P/6AOn/DQH//wYB1P8RAdj/nwBI/5IAfP+RAI//
eQCr/wAAAADvAQAAAAAAAABu5D+w4uPgadGlP4AAAAABAAAABCsfPh2Gez8J/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMAC
f6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf
6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAAn+gwAJ/oMACf6DAFT9WgH8/IEB2/x2Ac38bQHE/GkBuvxpAdf8aQF//VMB5f1xAR7+kgEx/psBMv6
aAUP+owFf/roBeP7UAcD+jAC2/ioApv4AAIH/hwDV/5oA//+gAJn/QwBG/yAAAAAAAPABAAAAAAAAAHrkP7cme4zNy6U/gAAAAAEAAABH0kI+NNcA
P6UDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/
aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9pQMn/aUDJ/2lAyf9WQR4/T
AExP3OA+T9aAPj/fID4PydAmL8lAHj+78AgvsAAEz72AMb/kADevxXAyv8eAMk/L8DYvyuAxL+egMP/2MDh/9VA8f/QQPq/zAD//8xA/3/RgPw/1k
D4P8AAAAA8QEAAAAAAAAAhuQ/PTTwiTXGpT+AAAAAAQAAAP8lpz61G7I+vRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0V
Tc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VT
c69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvRVNzr0VTc69FU3OvhHH4zANQuyvCOLv1Ai786YJKPaXCab35BED4fQbfeeWI2nwDSjO9noqpP
oMLBX9JC3W/mIu///XIEv3mhw8+X0QM+1YCV3mSgV047YC2+EdAdPgAAA64AAAAADyAQAAAAAAAACQ5D9807rTocClP4AAAAABAAAASgQePwEYbD9
z/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz
/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAdz/agHc/2oB3P9qAfh/
RMJrf08CQL+lglV/ukJif4xCrX+cQrn/o4Kev6JCnH8wgjL/K4DMf30AYz9PAHY/dEAbP+JAP3/KwD//wcAzv8AAIX/VQHT/q0C9v0rA5n9NAN9/S
ADAAAAAPMBAAAAAAAAAJzkP76yXGQSu6U/gAAAAAEAAABS+n0+WIZ8P28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX
/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/
bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/28ABf9vAAX/bwAF/+IApf7qAJX+7wDR/vYA1f7/AMv+/gBh/ucAKf7QAA7+mwAq/m0ARv5MAFv+N
QBl/gAAXv7LAGT+SQGk/kABrf4+Acn+/QCB/+cA5f/MAN//wQDt/74A//8AAAAA9AEAAAAAAAAApuQ/ok9hNoe1pT+AAAAAAQAAAMPUTT/vX1I/Hu
NpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuN
pJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knHuNpJx7jaSce42knPfLx
GX32XwwU7fIL7evHDfHuxAOr8QAAv+PzBMzhBQUl4hMEZuXhAs/h9yZJ6XY2s++aPa/72kL//2dCxfHKM5Lr9Ss36Two5ee8Jj7n8yXG5gwn6uoyM
gAAAAD1AQAAAAAAAACy5D+k4F1EALClP4AAAAABAAAASHcFPy7uBz8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//y
AF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yA
F//8gBf//IAX//yAF//8gBf//IAX//yAF//8gBf//IAX//yAF///5MDLaTjjmw6Q5iplQOjB8DEUUaxdGX2GQS7JljVCtbNNRMnBmUS9xP08vcjRZ
cKH0XhSiYGQsnqI7prd2IHvHIQpV0XsH3+G9AsztdQDx8wAABPdwAEr4AAAAAPYBAAAAAAAAAL7kP98+8Yh9qqU/gAAAAAEAAADM8jM/fC9lPwUCt
/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/
gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+AUCt/gFArf4BQK3+BIB8fm
EAPX5AADG+dsF9/1QCGX/Bgn//8IJL/8ZCuP+SArF/hcJbP9DCVf/rAdM/u0G1v2eBrD9jgae/awGOv0YB0P8mQdV+wcIxPpQCGD6fggW+qII1/kA
AAAA9wEAAAAAAAAAyOQ/EdDD/v6kpT+AAAAAAQAAALHQID5ClTE/Uv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/
e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e
4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4AUv3uAFL97gBS/e4Au/6JAD7/SgB+/yoArf8cAP//gADy/noAWP5eABH+RQDs/TIA2f0jAAr+AABZ/sw
Ag/6/AKb+qAC3/p8AOf4WAAT+HgDU/TwA1fyFAbD8xQGt/OQBsvwBAgAAAAD4AQAAAAAAAADU5D/ZcIeghJ+lP4AAAAABAAAAEYGOPR+9pz7w/nAB
8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8
P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAHw/nAB8P5wAfD+cAF+/WMBN/
3vAf76+AG/+WABOfn2AMv5RgGO+fwAU/mmACn5YAAP+TMA+/gVAOz4AADX+QsAavpZANv6ewAf/FcB8Pw3ARf9lwFi/cQBmP7nAm3/aQP//5gDAAA
AAPkBAAAAAAAAAN7kPzVf92gOmqU/gAAAAAEAAAD76w8+l96xPvz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7g
Afz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gA
fz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAfz+4AH8/uAB/P7gAf//0gDp/wAAl//zAOv73QMl+xoEB/vdA4f7xQMP/KQDcfx1A6n8RwPS/CkD8vwaA1
n9MwOr/VoD7/2DAxr+pQMt/tEDMv72Ayn+FwQm/kEENP6BBEf+lwQAAAAA+gEAAAAAAAAA6uQ/NyXYUpyUpT+AAAAAAQAAALZ9Jj41j0o/agHo/Wo
B6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB
6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9agHo/WoB6P1qAej9zwBL/qkAm
P6pAL/+swAw/7gAXv/BAHb/ygCL/9IAnP/UALT/ewBb/0EAFP8gAOn+CgDS/gAAw/4xADj/PQBu/6kA2f/EAO7/6ADt//kA//+KAZX97QG+/AAAAA
D7AQAAAAAAAAD25D/7g/dYLo+lP4AAAAABAAAApbCxPnQUbz9qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1
qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP1q
AGz9agBs/WoAbP1qAGz9agBs/WoAbP1qAGz9agBs/WoAbP0AANX9AwDl/d8AEv4BAfH94QDo/cgA4P3kAG7+0wCx/kAAQv8UALD/CADm/wMA///PA
L3/EQG0/yoBsf82AZr/hAG3/ccB7PzUAXr8uQFT/KIBQPyYATz8AAAAAPwBAAAAAAAAAADlP9FeLHbEiaU/gAAAAAEAAADtSY0+d30NP6r9BwGq/Q
cBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/Qc
Bqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HAar9BwGq/QcBqv0HART+UQFq/j4B
G/0wAmX9FAK3/egBc/6UAb7+pgHc/o0BBP+JAYT/WAD//wAAzv8DAFz/kADv/tYAf/73ACv+/ADw/fIAy/3jALj91wCu/csApf29AJv9sAAAAAAA/
QEAAAAAAAAADOU/paZWpV6EpT+AAAAAAQAAACvBpz4OcCA/+AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++A
Jc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJ
c/vgCXP74Alz++AJc/vgCXP74Alz++AJc/vgCXP74Alz++AJc/rgEAv7YBVD+mAaE/twGif7ZBlL/7wZD/5cGM/9cBjf/QwY8/78Eu//hA///OwPe
/vUCT/7FAgP+tQLn/bcC3v29Atv9xALc/bcAff2bAFf9AADP/QAAAAD+AQAAAAAAAAAW5T+bRV/h/H6lP4AAAAABAAAA2n3FPX7HUD/F/ioAxf4qA
MX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAM
X+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAxf4qAMX+KgDF/ioAnv57AJb
+vwCU/uoAs/4SAVL/nQCe/zcApP8AAKr/MgCj/1wAn/9wADn/fQAh/5gAIP+qACH/swAn/7YAPf99ABb/oQBO/4sAXv9+AMP/sAD//+UAAAAAAP8B
AAAAAAAAACLlP+wKOCWfeaU/gAAAAAEAAABipBs/Ip8eP2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwH
ktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHk
tksB5LZLAeS2SwHktksB5LZLAeS2SwHktksB5LZLAeS2SwHkuR02pXiefCZcLtEm54739zmvQ2dkP0Tnpe8SB///+9OUr9tiV99Tkku+++JBDsxiT
L6TIku8+oI3jSSyUM1HUsG7omHcGrOBGRpFsJ25+qBLCcAAAAAAAAAAIAAAAAAAAALuU/6pbba0V0pT+AAAAAAQAAABUEYT/ptHY/AADh7gAA4e4A
AOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AA
OHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7gAA4e4AAOHuAADh7i0A8vE3AE
v06gNh/BQBNv8KAtr/FAP//1wDRf/GAtb9YgKj/PkB+PuXAtDzswLR87oCVPTTArL0AANN9SkDIvZwAqn3hAIY+M8C4/fsAmD3HgP79gAAAAABAgA
AAAAAAAA45T9PR02w726lP4AAAAABAAAAGtkjP+snfj8z/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcB
M/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM
/4XATP+FwEz/hcBM/4XATP+FwEz/hcBM/4XATP+FwEz/hcBu/49AR//BgFz/8oArv+IANr/QwD//wAAUf2AA0L+BwIG/5sBdP+YAbr/nwEb/48Alv
4LALL9BgAp/QYA6fwAANP8AgCv/BwA0PyjAKj8DQF3/FMBAAAAAAICAAAAAAAAAETlP7Ajme2daaU/gAAAAAEAAAAwcLY+cE0FP40HLP+NByz/jQc
s/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs
/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP+NByz/jQcs/40HLP9BCP//rAhf/
9EIsP46CKn9fQj/+2QHP/xIBvb8dQV+/UQDoP8IAlT9HwHC+3kA0foAADD6YQi1+3QKsfw9Czf9nguI/c8Lu/3zC8r9Ggy5/ZsMw/4AAAAAAwIAAA
AAAAAATuU/MsrTHlBkpT+AAAAAAQAAAGvBxD7hCNg+Zu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2b
u/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu
/Rdm7v0XZu79F2bu/Rdm7v0XZu79F2bu/Rdm7v0XZu79FxL26h/k+swjpP3kJYn/Qyf//9QoyfL2Fa/twA3Z6hYKtujnBznnaQbr5T0FsOQLBJ3jz
AIS5wAAaOc8AEf7UQeD/gcGF/8EBS3/xAQe/9wEN//5BAAAAAAEAgAAAAAAAABa5T9qXBo/Bl+lP4AAAAABAAAAfKGAPm7kOz+l/zIApf8yAKX/Mg
Cl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgC
l/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIApf8yAKX/MgCl/zIAtP+kALT/yAC6
/80AwP/PAMb/5ADJ/+oAxv/qAMr/5QDW/+AA//8AAGT/FQBs/z0AMP9KAAz/VwAy/0UBTv/VAVL/IwJK/1MCPv9yAiv/eAIV/3gCAAAAAAUCAAAAA
AAAAGblP3hskknAWaU/gAAAAAEAAACdNWU+7IA3Pz0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89Aa
D/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD
/PQGg/z0BoP89AaD/PQGg/z0BoP89AaD/PQGg/z0BoP91AM3/AADD/wQAev8lACr/NwAZ/z0AGP86ABb/tACD//QAt/8VAcz/LAHc/yAB5/8UAf//
cgGO/1UBVv9TASH/VQEC/1gB+P5fAfP+YQHr/uwBaf8AAAAABgIAAAAAAAAAcOU/UOppOX5UpT+AAAAAAQAAACowVz9QdWw/IvZsACL2bAAi9mwAI
vZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIv
ZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsACL2bAAi9mwAIvZsAPT3lQJP/OwGffy
DBnT8EgXr+wAEWfv+A5n6NQWf+bUGn/ibB933bQjz968JR/jFCir38wtS9ucMi/ncCIr8xwWE/kwBYf8zAP//AABl/NQAgvqCAQAAAAAHAgAAAAAA
AAB85T85EdcJQE+lP4AAAAABAAAAHsyAPj6slj7//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xI
v//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEi//8xIv
//MSL//zEi//8xIv//MSL//zEi//8xIv//MSL//zEivPiTLi/42DXV8Rg4ge8xOQDviDq57pc7gedNGrjjOQ1J4fkHed9TBRfeuwMB3awCPNwBAvH
b8gGN2zEC99pBAnffJgIN4XMBUuGzADLhAAB282gMAAAAAAgCAAAAAAAAAIblP31VGLYFSqU/gAAAAAEAAAA0sno+TM7lPi7+bgAu/m4ALv5uAC7+
bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+b
gAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4ALv5uAC7+bgAu/m4Aq/4WADL/Gw
BI/zwAI/99AAv/igDu/oIAUv+YAbn/ogHp/1oB//8PAfv/1ADb/7UAq/+sAID/ogBi/4kAUf9kAEb/SgBC/zAAQv8WAEX/AAAAAAAACQIAAAAAAAA
AkuU/S1J0Oc9EpT+AAAAAAQAAAAYhUD/5LGM/R/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH
/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/
GULR/xlC0f8ZQtH/GULR/xlC0f8ZQtH/GULR/xlC0f8ZQuC9IEIZPI8BrT0bQLM9QAA5fUrAyz1JQW49CIGl/SdBi35KAqG/F8Me/5TDYD/kg3//7
4Nu/8DC2P+iwpq/eYH/fy+Bs/8kQYc/JUG3vttBwAAAAAKAgAAAAAAAACe5T/GtzmPnD+lP4AAAAABAAAAm5IbP9heTz/3+i0F9/otBff6LQX3+i0
F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F
9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBff6LQX3+i0F9/otBR38pwSU/G0Ev
vxKBP//WQLs/28Cmf+KApr/1AIy//0CHf/uAlP/CgFu/wAAxf0JAQr9bAG1/LQBwvyxARj9XAHr/cgCof7gA/f+RQSe/50EAAAAAAsCAAAAAAAAAK
jlP0o5v7JtOqU/gAAAAAEAAAAPNY89GSG9Pi7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8
IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDLv8I
Ay7/CAMu/wgDLv8IAy7/CAMu/wgDLv8IAy7/CAMu/wgDRf/cAWj/WgBP/xgAWf8FADz/AAAT/xMA6/4xAMf+UQCp/mwAi/6HAJ3+twC//gkB0f5HA
X3/hwLi/ysD//8WBLj/cwSz/54Ewf/BBM//3QQAAAAADAIAAAAAAAAAtOU/2Xtjn0I1pT+AAAAAAQAAAAHqnT4uS2k/dQHd/nUB3f51Ad3+dQHd/n
UB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nU
B3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f51Ad3+dQHd/nUB3f5AAfv+TAH//j0B
9f4kAev+YwBl/wAAs/81AMz/SwDd/10A8P9nAP//WgA2/1kAn/5zAEf+gwAO/ogAjv2aANr8gwCp/HQAl/xlAI38dgAb/QAAAAANAgAAAAAAAADA5
T/DBI1QGzClP4AAAAABAAAAd24vP41CNz8u8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEB
Qu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFC7xEBQ
u8RAULvEQFC7xEBQu8RAULvEQFC7xEBQu8RAULvEQFOXxfQtE8jEH9vLBA6TsTAs76YQQWudaE/znHRae61EZg+lSCJ7qsgKA7Y4AYPAAAIv0eQEL
99ABo/6EL///XTT7/sIzMf1gMw78IjJk+vwxAAAAAA4CAAAAAAAAAMrlP20oqsH3KqU/gAAAAAEAAAAWTc8+TO18P04CIf9OAiH/TgIh/04CIf9OA
iH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAi
H/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/TgIh/04CIf9OAiH/EANW/mgDDf5eA7H
+aAMO/3sDMv+RAz//LAPM/84C4f+dAtb/VQL3/0MC5P89As7/PAK9/1oCov/8Av//IQHC/4sAUf9JAAz/HAD0/gAA5v4AAAAADwIAAAAAAAAA1uU/
Uvkw7tclpT+AAAAAAQAAAB3D8j58HXU/xv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAx
v+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv
+gAMb/oADG/6AAxv+gAMb/oADG/6AAxv+gAMb/oAD8/wgB//8wAdv/RgG+/24BsP+XAaP/tQGY/8YBl//QAZ//1AGN/9ABfv/PAaH+zAFk/toB3/2
5AcL9igHJ/fcAAf6TACH+UgAp/iMAIv4AAAAAAAAQAgAAAAAAAADg5T8rN5/RuyClP4AAAAABAAAA3K+DPpHXFz8n/WECJ/1hAif9YQIn/WECJ/1h
Aif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hA
if9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAif9YQIn/WECJ/1hAlj+VwPj/rYDKv/vA3
L/CASZ/xwEsf8mBMn/IATn/3MD//8oA6v8YQEv+3sBrPphAY76IQGO+twAjvqjAJD6dgCU+lIAlvo0AJX6GQCS+gAAAAAAABECAAAAAAAAAOzlP0Y
+emejG6U/gAAAAAEAAABMMW4+SghsPyUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB
1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1
f4lAdX+JQHV/iUB1f4lAdX+JQHV/iUB1f4lAdX+FAHB/sQAzf6NANn+ZwDe/kwA4v40AOr+AAAN/x0AlP89AN//UQD//0MA8/9UAXr/eQE9/4MBB/
+RAdP+gQGk/pkBh/6tAXD+vAFq/scBe/4AAAAAEgIAAAAAAAAA+OU/CPdOq44WpT+AAAAAAQAAAP8WAj8OVRo/AAAM+wAADPsAAAz7AAAM+wAADPs
AAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsA
AAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPsAAAz7AAAM+wAADPt4ANX7NwAo/J0DYP5hB
WD+ywZV/lII+v0ICdH9KwmQ/YwJS/3+CWf9UQrG/aAKAf7WCjX+5gpz/t0Kv/7GCjj/kAqh/14K2P9DCvv/Sgr//wAAAAATAgAAAAAAAAAC5j+dxb
GYfRGlP4AAAAABAAAAlmb1PcvfPj9yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn
+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+
cgGZ/nIBmf5yAZn+cgGZ/nIBmf5yAZn+cgGZ/nIBmf5BAb/9AwFr/b0Acv2QAIr9dwCc/R4AT/4KAMD+CAD//gsAJP9lAJb/pADe/58A+//EAP//G
QDQ/QAAM/1yALf8+gCH/F8BefzQAa/8AAAAABQCAAAAAAAAAA7mP855PitwDKU/gAAAAAEAAACsO7E9dwR8P0UA+/5FAPv+RQD7/kUA+/5FAPv+RQ
D7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD
7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/kUA+/5FAPv+RQD7/joAp/8tAOj/IQD/
/xUA/v+TAN//mQBE/6cA/f6/ANL+2QCv/j8Bef5SAVj+YQE3/loBHv4WASz+FAES/pUA+P1GANz9GgCO/QAAzv0AAAAAFQIAAAAAAAAAGOY/Bz+YX
mYHpT+AAAAAAQAAADNFBz+rQ3Q/HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h
8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8
CH/4fAh/+HwIf/h8CH/4fAh/+HwIf/h8CH/4fAh/+JAKl/lgC+/5yAg7/XgLr/kwCwv6qAtT+YwJA/jMCDf5TAhf+KgI0/vIBSP49AYr+ywD4/n8A
S/9KAG3/AACF/yoAyv8hAO3/BAD//wAAAAAWAgAAAAAAAAAk5j+EjGkuYAKlP4AAAAABAAAABd5cPzLcbD8dBaL6HQWi+h0FovodBaL6HQWi+h0Fo
vodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0Fov
odBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovodBaL6HQWi+h0FovpmBrzuWwRG8PcCGPM
LAvD0WQHO9cIAm/VyAMr0AAAO9DAB2vHVAQPxoAHk8DUBHfGmA6718wRo9xADGfvpAQn+SgFs/9oA5P+MAP//AAAAABcCAAAAAAAAADDmP6kVZJZd
/aQ/gAAAAAEAAABIr+491nfAPtf8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/
LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/L
AD1/ywA9f8sAPX/LAD1/ywA9f8sAPX/LAD1/ywA8/+FwPI/6wCvP9fAb//qQC//2QAsv9DAKL/JwCU/xAAh/8AAJv/BgCv/xsAv/8wANv/jAD5/9Y
A//8tAef/ZgHV/4MB3/+YAe//oQEAAAAAGAIAAAAAAAAAOuY/gLpAkl74pD+AAAAAAQAAAHHMLT+JiF8/VwH//1cB//9XAf//VwH//1cB//9XAf//
VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//V
wH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//AADg/rAAg/5wAKz+2A
FH/bACkfwYAzH8YgJP/DAC6/y6ASj9QQEt/fQAQv3oADT95wAd/dkAE/3dAA79JAHa/HEBrfymAZz80AGi/AAAAAAZAgAAAAAAAABG5j9jeL8dY/O
kP4AAAAABAAAA+ZiePrbmRj/YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw
/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/
tgA8P7YAPD+2ADw/tgA8P7YAPD+2ADw/tgA8P79AE//xAB+/5EAjv9hAHX/SgBy/z8Acv86AHb/OwBe/y8AQ/8jAKj/GADV/wAA/P8RAP//KADu/z
4A1v9RALz/UgCa/1MAef+wAKP+AAAAABoCAAAAAAAAAFDmP9BapzRr7qQ/gAAAAAEAAABGekw+7uOoPq8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8
JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8J
uvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/K8JuvyvCbr8rwm6/DsGHP7RBGD/8wP///IE1
v83BIP/IAMk/0QC1/6ZAaX+EwGJ/roABf5cAPz8LAAH/AoAYvsAAPT6gQCQ/MIB3/wxBaj6Mwel+bQIjPkAAAAAGwIAAAAAAAAAXOY/W2zG0nbppD
+AAAAAAQAAALEqAT4UsQc/YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1
gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9YAOT/WADk/1g
A5P9YAOT/WADk/1gA5P9YAOT/WADk/1gA5P9UQL7/JoBKv38ADj9fAAu/SEAI/0xAMP9AAAJ/g0ALv47AGz+rAAx/80ARv/UADf/iwCn/10A4v83A
P//IgDt//kAh//2AYL/pwKG/wAAAAAcAgAAAAAAAABo5j/Sp/HzheSkP4AAAAABAAAA/kt2PlHauT7A/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1
EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1E
GwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQbA/1EGwP9RBsD/UQYe/8YBoP8AAGz+jAK8/aIE
Kv87BZP/rwWQ/xQGh/9fBoH/lgZ9/8IGe//tBnX/Dgdu/yAHYP8ZB0j/+AZk/+gGff/9Boj/KQf//6EHAAAAAB0CAAAAAAAAAHLmP4DpBJSY36Q/g
AAAAAEAAAB32sA+q25KP2YB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+Zg
HS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgH
S/mYB0v5mAdL+ZgHS/mYB0v5mAdL+ZgHS/vAB2v44Ahb/PgL//iYCJ/4IArr9+wF+/fwBRf3vAST94wEY/eUBKP3lAVT9/QGk/t0BV/+5AbD/owHc
/5kB7v/LAN7/OgDr/wAA//8AAAAAHgIAAAAAAAAAfuY/nODirq7apD+AAAAAAQAAAGiFCz+tRVw/IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/
SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/S
IF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9IgXa/SIF2v0iBdr9ogNM/+QBp/62AB3/AABU/4s
A//8xAsT/BwOs/14Dt/9/A8f/iwPW/4sD5P9wA7f/wwOZ/8gDlf/CA4H/lAOi/rcDBP4OBIn9TARB/QAAAAAfAgAAAAAAAACI5j/ZAHVAyNWkP4AA
AAABAAAAhE+wPrCabT+A/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+p
wCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAgP6nAID+pw
CA/qcAgP6nAID+pwCA/qcAgP6nAID+pwCA/qcAh/5rAM3+FADJ/gAAUf9VAKj/hADA/6oAwP/jANL/FQHk/zgB9v9PAf//WgH+/2ABmf9iAXb/XAF
p/1cBb/9IAXn+0gGU/uQBAAAAACACAAAAAAAAAJTmPx10q0Tl0KQ/gAAAAAEAAACnPR8/CYRhP3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9z
AGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zA
GP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY/9zAGP/cwBj/3MAY//wALD/TwH6/3sAlv8YAK
7/AADP/wIA6v8GAPT/AwD+/wEA//8AAP3/mgBx/vcArv06AZP9TAGt/bUB4/xiAcP8HQHS/O8A9PwAAAAAIQIAAAAAAAAAoOY/XQx9twXMpD+AAAA
AAQAAAKgH1D75+Dk/ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//
ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//ywD//8sA///LAP//y
wD//8sA///LAP//ywD//8sA///LAP//ywD//38Bov4IAlj+VwJK/gQCwf7CAbX+ogGX/q8AV/4qAD3+EABF/gAAXf4DAwH/lgMp/8IDLv/UAy3/3Q
Mr/+EDyf73A4r+/QNs/gAAAAAiAgAAAAAAAACq5j+cNeeUKcekP4AAAAABAAAADwEGPusEgz4AAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AAC
u/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu
/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78AACu/AAArvwAAK78wQOi/toE//9TBcn9TgV5/
BgF7/tYBfD7awX/+1gF6vtOBab7SAVC+zwF6fqdBRv7mwV4+5cF6P3EBlP+JAc9/lkH3/14BqX6AAAAACMCAAAAAAAAALbmPxLo7dhQwqQ/gAAAAA
EAAAAxIVI/dzNeP8sH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9Ms
H7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fTLB+30ywft9MsH
7fTLB+30ywft9MsH7fTLB+30ywft9MsH7fT1Btb5YwWM+2gDDP3aAaL+hQD//4sCJP7gAq/+2geG/U0KXPzJCwf8Xg2v/E0B8v4HAOv+BAA4/gAAC
P1zAMv7GAG9+p4BKvoAAAAAJAIAAAAAAAAAwOY/b5qbf3u9pD+AAAAAAQAAAFClbD9YPHQ/ewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ39
17Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ391
7Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3XsJ3917Cd/dewnf3ZwZrPI8INP7GCP//9ogyvs9
IE73aBZ3+msSRf2iEuTziAwl5hIKP+BSCeXdjAgC33cHvuCKB9/kHQeg5nMEHubSASrlAACa5AAAAAAlAgAAAAAAAADM5j9MNAGFqbikP4AAAAABA
AAAABjkPkftED/HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP
//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP//xwT//8cE///HBP/
/xwT//8cE///HBP//xwT//8cE///HBP//iQAK/QAAT/xiALz8TQFu/RMCA/5kA83+xQYD/XUIfvsvCZn6iQnx+bQJdvmlCSf5dAnn+PwIzPiqCNX4
lgis+JkIYPiVCZz2AAAAACYCAAAAAAAAANjmP7IANuXas6Q/gAAAAAEAAAAJaec+9vBtP1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/W
QFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQ
FF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9ZAUX/WQFF/1kBRf9jAdT+igFn/rsBFv7yAQf+lAF
n/mEBWv4zAUj+TABG/RYAHf0LABj9BwAb/QAAPf0eADf9xgCj/AgBTfwWAA//IgDH/0EA//8AAAAAJwIAAAAAAAAA4uY/y6BXnA+vpD+AAAAAAQAA
AKp/jD04Pd8+SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+
0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+0
oAAPtKAAD7SgAA+0oAAPtKAAD7SgAA+yQC2/xlAnb95gGs/nEBf//qAOz/ZQD//wEA9f8aAYf73AAE+rIAe/mkADf5OQBb+BUAEfgWABD4IAAZ+AU
AI/gAAA74JgDs9wAAAAAoAgAAAAAAAADu5j+3/ommR6qkP4AAAAABAAAA2mm1PY1PNT+s/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+
LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+L
gGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4BrP4uAaz+LgGs/i4B2v5fAZn+NwGG/iQBhP4cAVj+OQ
FR/j4Bev5dAer/YwH//0IB7f8ZAez/+QDp//8A7f8dAd//NAF3/zkAW/8AACP/pwD2/gABAAAAACkCAAAAAAAAAPjmP3lA9/+CpaQ/gAAAAAEAAAA
/3IM+cZEHP9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///T
BP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TBP//0wT//9ME///TB
P//0wT//9ME///TBP//0wT//9ME//+hA1D/BwOd/q4CSP5nAib+YQJD/igDwP4SA8v+5wK4/sECo/60Atz+eAFc/8YAl/91AK3/SwC0/zEAs/8dAK
j/DACU/wAAiv8AAAAAKgIAAAAAAAAABOc/E7vPpMGgpD+AAAAAAQAAAAJkED++gUk/rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T
+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+
rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P6sA/T+rAP0/qwD9P7gATT+XAHj/agC7/3JAlz+w
gLh/sQChf+vAuP/jQL//2oC+/9MAun/RAK3/3UBif/7ADj/pwDY/msAc/4tAFb+AABH/gAAAAArAgAAAAAAAAAQ5z+x5UmRA5ykP4AAAAABAAAAUH
eyPhukXT///3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//9
7Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97Af//ewH//3sB//97
Af//ewH//3sB//97Af//ewH//3sB//97AY//hABy/wAA2f5XAKL+SwCG/kEAev5MAGP+UgCH/sQAhv4PAXn+MgFr/kABXP5CAUz+QQE9/j8BB//gA
Bb/uwAH/6kAAAAAACwCAAAAAAAAABrnPwVNosFIl6Q/gAAAAAEAAAAuRwo/FtMrP9MAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/N
MAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NM
AZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX80wBl/NMAZfzTAGX8mgOU/UsFE/76Bkf+kwOq/rAB
Kv+iAST+ngH2/Y8BK/6GAXH+ewG3/lMB//4eASr/2gBj/44Ar/9lAP//KwD6/wAA7v8AAAAALQIAAAAAAAAAJuc/t4YbMpGSpD+AAAAAAQAAAKloy
D21g/c92g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/
PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/PaDmPz2g5j89oOY/P
aDmPz2g5j89oOY/PaDmPz2g5j89oOY/N2A5ftAABf6A8C7ufTCCH4gQ///30Zve9+GhfvRxrT790YEfKiFXTzahGZ8T0S4PGKEkHyxxIk8gET4PFA
Gfz0dBeH8QAAAAAuAgAAAAAAAAAy5z//JP7e3I2kP4AAAAABAAAARX6vPsibFD/0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0A
XX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AX
X69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+vQBdfr0AXX69AF1+h0C4PsCAsn8oAEb/UABQP0GAYT
9AACL/REAw/1MALb9iAC8/aIB6/4EAnD/IwKu/zgC2f9JAv//LgGn/oYAz/0IAJH8AAAAAC8CAAAAAAAAADznP1SqmMQriaQ/gAAAAAEAAACScnI9
tnqLPhb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAF
vwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFvwAABb8AAAW/AAAFv
wAABb8AAAW/AAAFvwAABb8AAAW/AAAT/sxAsz6WgNV+g8E5/mWBJD5CwVD+W0FAfm7BQf87AGm/h8B//+3AMH+XwHv/ZoBSv2+AcX88AHN+04GA/w
TBzH8OgcAAAAAMAIAAAAAAAAASOc/P30/332EpD+AAAAAAQAAAFuHUD7e4HE/tv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5O
Abb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OA
bb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgG2/k4Btv5OAbb+TgE7/8kAzP/QAN//jgDW/1YA//8IAN
z/AADP/wMA1f8SANr/GwB+/uMATv4YAUf+JwFb/n0BY/6sAWf+vgFg/skBUf7ZAQAAAAAxAgAAAAAAAABS5z9L3Ewr03+kP4AAAAABAAAAN6coPqm
5Hz9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B
//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B//9vAf//bwH//28B/
/9vAf//bwH//28B//9vAf//bwH//5QAov8xAHz/AABb/4oAcv7sACv+LAFI/lkBdP6FAZz+tgG8/u8B2v4fAur+PgL9/lACDf+8Alj+EQMK/mcD6P
1IA0r9AAAAADICAAAAAAAAAF7nPxrSIKUre6Q/gAAAAAEAAACB/xY+zk5DP9f/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AAD
X/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX
/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA4/+hAPr/4AD///cA+/8OAez/IAHd/
ykBQ//gAAD/pgDq/nsA5P5iAEL/UACo/m0AiP6WAOv+0QAK/50AEP91AA7/agAAAAAAMwIAAAAAAAAAauc/iCkhSYd2pD+AAAAAAQAAAH8vpT4jtA
I/t/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AA
At/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAAt/wAALf8AAC3/AAA
t/wAALf8AAC3/AAAt/wAALf8AADH/UUB7/4UAb3/qQD//0AAiv5MAJD9VgC8/FwAIPxOAKX7RQA5+0EA9vo3AOH6KwAK+yYAOPsrAFX7OQBj+00AZ
/tkAAAAAAA0AgAAAAAAAAB05z/+YbkT5nGkP4AAAAABAAAAqe8gP4ipRj///0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//
9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9
HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA///RwP//0cD//9HA3n9CgVp/KgF5/u6BcX7SQbb+8UGqfs7
Bm76owQY+ukDYPnUAxP52gPp+AIEMPsIA5v83gAL/QgAXf0AAJD9EwDT/nIDAAAAADUCAAAAAAAAAIDnP9OjWgFIbaQ/gAAAAAEAAADgGzw+QojOP
v//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAAtf7eARD/7wLE/5gDiP/FA27/lgNe/1oDU/8mA0v//QJB/+MCK//UAhr/yAIU/8ICf/4XA/v9XAOp/X0Def2KA2H9
iwMAAAAANgIAAAAAAAAAiuc/1rR7Dq1opD+AAAAAAQAAAGADzT78SfE+4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1i
hDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ih
Dg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQ4PWKEOD1ihDg9YoQIPXUDm34Sw71+vkOWPwDEJr9yxC
x/SAQGP5xEJv+NBH7/sYRAP9MEv//BxM8/SQNf/rsB5z4VARU99IBefYAAAAAAAA3AgAAAAAAAACW5z/m7Jg3FWSkP4AAAAABAAAAWr0mPxVmbj+O
ATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOA
Tf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOATf8jgE3/I4BN/yOAT
f8jgE3/I4BN/yOATf8jgE3/I4BN/wuAcr+LgGU/0IBzP9BAdr/TwHh/0UB7P9EAfL/TQH//8QBo/+pAL/+KQA2/gAAL/4nAaf+HwIS/7cCUP8HA2X
/AAAAADgCAAAAAAAAAKLnP7kqNHmAX6Q/gAAAAAEAAAAWXJw+66XTPgIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//
AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//A
gH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//wIB//8CAf//AgH//4cEZP92BjD+BghZ/TkJePygCVL7uw
li+scJtfkbCj35gQPA+sgB5vrkAPb6nQAC+7MAK/veAGf7CgGl+wAASfsAAAAAOQIAAAAAAAAArOc/q8jUz+5apD+AAAAAAQAAAH8b0T5EsuI+LBJ
46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ4
6ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46ywSeOssEnjrLBJ46
ywSeOssEnjrLBJ46ywSeOssEnjrdATs4ZgAyOIAAObkJAad5PoIMumHCuPsNgvv7sALK/CmEczzkhQQ9eAYFPq4GJb8SxfD/UwW3P64FfD/+Rb//w
AAAAA6AgAAAAAAAAC45z+2kQc4YFakP4AAAAABAAAAozfmPiZL6D4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngA
AhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAA
hJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ4AAISeAACEngAAhJ5YaoLy54n//weMVPULs9/DQMNArK60r
oGSrWBVt6fUNneojyiZpcwd3KxOGguDmjDJfUNCDoSSSR2Mn0vmlvdKAAAAADsCAAAAAAAAAMLnP4O2Xq7UUaQ/gAAAAAEAAAAfHkA/1BlgP/X7/g
j1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj
1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1+/4I9fv+CPX7/gj1
+/4I9fv+CPX7/gj1+/4I9fv+CAH4TQIF9qIA4/Q3AAL0lgDR+AAAsPnLAO75SwEn+nYBjfp4AbT6VAGq+gAB3/oWARj7awE1+94BDf6OBP//+gYAA
AAAPAIAAAAAAAAAzuc/kMJxL0xNpD+AAAAAAQAAAAr/FD64iKU+AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAK
b7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb
7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7AACm+wAApvsAAKb7tALK+6sE5/vOBTz8egaX/O0G7Pw8BzX9
cgdE/Z8HVP2wB2n9ugeO/c0Hyf3zBgb/bgb//3sGMv05Brn8owhZ/QAAAAA9AgAAAAAAAADa5z91kd23xkikP4AAAAABAAAAZcIvPqtqaD/Y/qkB2
P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P
6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6pAdj+qQHY/qkB2P6
pAdj+qQHY/qkB2P6pAdj+qQF//oYBev5fAX/+QwF7/pEAif4AAEb/PACw/4UA5P+8AND/6gDY/w8B//9KAZv/eQFo/5ABUP+kAUP/swE5/70BAAAA
AD4CAAAAAAAAAOTnP0RERERERKQ/gAAAAAEAAAATP7Y+V3lcP4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//
4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4
wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//+AAXf/eABP/xwDp/rsAz/67AMX+ugDB/rQ
Auf6vAKv+qACk/pMAqf6DAKf+igCO/pMAcv5FAG7+CgA9/gAADf4AAAAAPwIAAAAAAAAA8Oc/AzdN0cQ/pD+AAAAAAQAAAHhwcD0O5gI/Yv7XAGL+
1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1
wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1wBi/tcAYv7XAGL+1w
Bi/tcAYv7XAGL+1wBi/tcAd/9GANP/FQD//wAAUf9pAcf+XQJ2/vcCUP5hAyP+IAMm/gsDM/4TA0b+IgOL/tMC3P7PAhL/6AIz/wYDR/8eAwAAAAB
AAgAAAAAAAAD65z849qRbSDukP4AAAAABAAAApFvQPTA1vD7OArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vO
Arv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOA
rv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vOArv7zgK7+84Cu/vMApj98QLn/kUDhf+6A9D/OwT//94E9v/gA6
b+KAPX/cACaP2IAhb9pwIR/cACL/2kApD93wDR/a8AwP0AAOH+AAAAAEECAAAAAAAAAAboP500/d/ONqQ/gAAAAAEAAAA6VNY+RCEqPz4D//8+A//
/PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///
PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///PgP//z4D//8+A///P
gP//z4D//8+A///PgP//z4D//+QAUb/xwAn/2AAHv81AJz/AACe/zYAfv97AC//uQEO/nMCSf3PAtj8/QKS/BQDafyUA1f8qgP9+0sEIv4AAAAAQg
IAAAAAAAAAEug/38AMW1gypD+AAAAAAQAAADwzyD4DSxs/Ef4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4
CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4C
ARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CARH+AgER/gIBEf4CAVb+nQAD/gAANP9RAbX/TQHY/woB///PA
CH+cwPs+/oDw/lMA5T4DgMc+PICD/jYAhj4yQIe+KwCEvh/AgAAAABDAgAAAAAAAAAc6D98e4/J5C2kP4AAAAABAAAAmDLUPjT0KD+7+w4Eu/sOBL
v7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv
7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7DgS7+w4Eu/sOBLv7
DgS7+w4Eu/sOBLv7DgS7+w4Eh/xMAiP9eQFm/RgBjf0tADX9AADl/BMAFP1hApn9gAXO/gsGgv8gBtr/+wX//84FzP4sBiz+CwZN/RgFAAAAAEQCA
AAAAAAAACjoP7xMRih0KaQ/gAAAAAEAAABSaHo8ryGPPQEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//
8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8
BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8BDP//AQz//wEM//8eCAzx9gHl6wAAxukAABnphwOO6FUIJ/F5
C4j1Aw1295ANDPhVDSP4Qg2A91EO1/ZxD+z25wp2+fEIj/wAAAAARQIAAAAAAAAAMug/uRr3cwYlpD+AAAAAAQAAAB+Oojyx4Xg/dQD4/3UA+P91A
Pj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91AP
j/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj/dQD4/3UA+P91APj
/dQD4/3UA+P91APj/dQD4/yIAg/8AAFr/aAC//4cA8P+lAP//PAHl/n4BqP6YAbH+oQHB/osB4/55Afn+bwEF/2kBCP9ZAfn+NwH0/gAAAABGAgAA
AAAAAAA+6D+Pv2ypmyCkP4AAAAABAAAAkACAO7MZHz8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//F
wH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//Fw
H//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//FwH//xcB//8XAf//nAGV/vgBkv0cAur8JAKD/CICQvwWAvf7CgL
n+1kBiPviADX7pQAE+60AGPsAAGL7awBD/XkADP57AHP+AAAAAEcCAAAAAAAAAEroP5L/dsUzHKQ/gAAAAAEAAADj4Fw9DoVoPwP/CgAD/woAA/8K
AAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KA
AP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAAP/CgAD/woAA/8KAA
P/CgAD/woAA/8KAAP/CgAa/wMAIf8HACX/BQAh/wAARv8RAGD/RQB+/3AAo/+LAMf/mADp/5wA//+QAP7/egCk/3IAbv9rAEj/YAAAAAAASAIAAAA
AAAAAVOg/pH/qxM4XpD+AAAAAAQAAAPzE+z7G/k0/dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC
0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0
v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/XUC0v11AtL9dQLS/VwC4//vAfz/rQHA/6oB//96Afr/RwHe/yYByf
8cAcP/uQDo/nAAEf8yAEP/AABh//MAtP5TAXP+aQFe/gAAAABJAgAAAAAAAABg6D+nu6CkbBOkP4AAAAABAAAAZ3WVPhVBYj/v/pwC7/6cAu/+nAL
v/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv
/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/pwC7/6cAu/+nALv/
pwC7/6cAu/+nALv/pwCa/7QABr+AAAi/RcArf06Arb95AJm/u0C6f7fAj7/2AJ3/9QCm//QArL/1QLC/90C9f/WAv//xgL8/7wCAAAAAEoCAAAAAA
AAAGzoP/r8d2END6Q/gAAAAAEAAADjejo/a/JwP/f9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/Tc
C9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC
9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwL3/TcC9/03Avf9NwJ4/wAA6v6+APT+KwIr/+gCiP9LA6b/mQO8/80Dx
f/rA77/9AOu/+EDoP/GA3//vwNb/6AEpv+uBP//iAQAAAAASwIAAAAAAAAAdug/GVFT+LAKpD+AAAAAAQAAAI5UkD4zcJk+0t8SAdLfEgHS3xIB0t
8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8
SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8SAdLfEgHS3xIB0t8S
AdLfEgHS3xIB0t8SAW7nVBrX6cUgeOobIaHqUSC36mMf++qDHtHrgR2w7Agc4ux/GnzsExlf9/oKqvxQBLH+lAFr/wAA///3DgAAAABMAgAAAAAAA
ACC6D9JgBpmVwakP4AAAAABAAAAVsKEPh6VXz9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1
wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1w
Bav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1wBav9cAWr/XAFq/1MBbv+VAcz/cwHp/1EB+f8wAf//NwHq/ysB
5P8bAef/CgHn/9sAV//BABP/sgDr/qsA1P4AANH/AAAAAE0CAAAAAAAAAIzoP2IEuqcAAqQ/gAAAAAEAAAB+GDk98E2yPVTwKx9U8CsfVPArH1TwK
x9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx
9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9U8CsfVPArH1TwKx9
U8CsfVPArH1TwKx9U8CsfFfOIEI70bgiZ9CIDHvUAACb7JQFR/rwC//8hBZD8HgXt+dwFSfj9Bjb30wea9jMJO/VmCmz1iw0AAAAATgIAAAAAAAAA
mOg/qv8iuqz9oz+AAAAAAQAAAKsJ9z4kC2Y/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4A
Qz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQ
z/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP+4AQz/uAEM/7gBDP9GAbT/FgHg//cA//+2AFr/bADw/jYAtP4AAIz
+HQDG/kEAhP6HACH+sADZ/c0DPf3CBFn9DwV5/QAAAABPAgAAAAAAAACk6D/JM0uaW/mjP4AAAAABAAAABtECP9TcRD/b/FgA2/xYANv8WADb/FgA
2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2
/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/xYANv8WADb/FgA2/
xYANv8WADb/FgA2/xYAKX+ZwB5/wAA8P+1Af//FwPy/94D1f82BMn/XgSq/2QEdP9jBFD/YwQi/gME2v0VBBL+lAQG/4wDAAAAAFACAAAAAAAAAK7
oP9D4LEUN9aM/gAAAAAEAAADhMBk/ovowP+QInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie
9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9
eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ715Aie9eQInvXkCJ71YgkL/icK//9jCsn/ggo8/6IK2f7BCpL+Rgpd/r
wJTP40CC39/wMy/cMBUf29AG/9YQDg/AAAq/wAAAAAUQIAAAAAAAAAuug/VzTHt8Hwoz+AAAAAAQAAAP+fQz7Pfe8+qf1bAKn9WwCp/VsAqf1bAKn
9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9
WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9WwCp/VsAqf1bAKn9W
wCp/VsAqf1bAKn9WwA6/wAAxv83APX/dwD//6oA6v/RAFD/FgHF/mQBbv6hAT3+ywEc/swCEv5TAxH+lgMR/r8DEP7bAwAAAABSAgAAAAAAAADE6D
+tUB3veOyjP4AAAAABAAAABzgcP2Z0Jj/0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///
0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0
BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT///QE///0BP//9AT//9UPFvVWFEX2dBbM9zgX9veJF+r3sRfY9ywQ3Pk2D
H/67Qnt+S0DRPp+Ai/8IwKo/fwAzfwAAOb7AAAAAFMCAAAAAAAAANDoPyI0N+gy6KM/gAAAAAEAAAD90ys/DOR5P3v9MAB7/TAAe/0wAHv9MAB7/T
AAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TA
Ae/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAAe/0wAHv9MAB7/TAA
e/0wAHv9MAB7/TAAe/4/AWb/LALM/3EC//90Asj+UQIA/icCkP0yAln9SAI+/VICL/1XAhf8KQKB+j8A1PkAAHr5BwAAAAAAVAIAAAAAAAAA3Og/Y
DghoO/joz+AAAAAAQAAADBa/Tyjr0g/av7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav
7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7
CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgJq/sICav7CAmr+wgI8/s0CH/7fAgz+8gID/gMDD/4GAx3+/gIs/vECTv7r
Am3+vAKF/osClP4hAp/+6gF//3QA//8AAAAAAABVAgAAAAAAAADm6D/fIewTr9+jP4AAAAABAAAAI/4hPuWcLj8AAN3/AADd/wAA3f8AAN3/AADd/
wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/w
AA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wAA3f8AAN3/AADd/wA
A3f8AAN3/AADd/3oA///YAOv/EwHC/zcBlv9gAT3/cwHj/nAB8P2OAaj9rAF0/cwBO/0VAhr+DQKZ/vYB4P75APr/AAAAAFYCAAAAAAAAAPLoP2IX
rUBx26M/gAAAAAEAAACVVyk+3WP3Pq8C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C/
/+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//
+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//rwL//68C//+vAv//nQF9/pAAjf0KABv9AADM/HYBofxqAbT8XAHB/O8B+/w
CAgD9CAL7/A4C9PwmAun8VQLf/HYC1vwAAAAAVwIAAAAAAAAA/Og/l5l9IzbXoz+AAAAAAQAAAAxzzj7Xhm8/2gBH/9oAR//aAEf/2gBH/9oAR//a
AEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aA
Ef/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAEf/2gBH/9oAR//aAE
f/2gBH/9oAR/+WAJf/aADY/1MA//8AANP/BADG/xIAy/8dANX/KADZ/3kAkv+QAOv+vQCh/qoAoP6uAJz+vQCh/gAAAABYAgAAAAAAAAAI6T+7enu
5/dKjP4AAAAABAAAAsGtYPo/lBz8AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9
AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9A
AB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv0AAHb9AAB2/QAAdv02AeT96wFq/kkCxf6OAg//AAOK/zYD0P9TA/D/cg
P9/4oD//+fA/r/uQPt/9YD3f/8A8P/AAAAAFkCAAAAAAAAABTpP1/WyP/HzqM/gAAAAAEAAAAt+nQ+pklpP///AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAOX/uQDh//UAsP8wAZ//YAGb/3kBa/+uAU3/yQE+/94BK///ARb/GgIA/ysC8P4gAuP+8QEAAAAAWgIAAAAAAAAAHuk/NgmM85
TKoz+AAAAAAQAAACF7QD+mT2A/AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QA
AmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAA
mvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr5AACa+QAAmvkAAJr53QBh/JQBMP02Acr8RQGO/T0Bi/5EAWf/JwHU/xEB0
v8yAcf/VwHE/3YBzv+RAeL/qgH//wAAAABbAgAAAAAAAAAq6T/8qO+RZMajP4AAAAABAAAAsUWkO1J6Cj8x/2kAMf9pADH/aQAx/2kAMf9pADH/aQ
Ax/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQA
x/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx/2kAMf9pADH/aQAx
/2kAMf9pADH/aQAq/y4AGP8SAHf/PgCo/0wAtv8tAKj/KgCq/xwAq/8LALb/AADC/x8A1f9AAO3/VAD//14AAAAAAFwCAAAAAAAAADTpP3B8Itg2w
qM/gAAAAAEAAAASDQ0/dDo3P9n7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+x
cJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xc
J2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCdn7FwnZ+xcJ2fsXCQD74wRn/KgDuf0BA5/+VwIw/7cBt//DAOn/NQD3/yIA
//8NACv/FADl/gAAff+3A3T+DAYAAAAAXQIAAAAAAAAAQOk/WnNXwwu+oz+AAAAAAQAAACk0Yz3eOWA+2QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72
QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72Q
CG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QCG+9kAhvvZAIb72QC
G+9kAhvvZAIb7AACP+RgAvPtsAGf9pgBO/tEA0f5aASj/XwH//wUC8v+DAv7/CwJF/aABx/tvA4n9GARF/QAAAABeAgAAAAAAAABM6T+unsVQ47mj
P4AAAAABAAAAeq6qPjOOEj/W/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DA
Nb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DAN
b9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwDW/UMA1v1DANb9QwCN/1UA//8AAF3/tQD4/vMAk/7ZALD+/gDV/uoA+/62ABv
/gQA6/1YAVf86AGr/JgB9/xcAAAAAAF8CAAAAAAAAAFbpP7UoqH29taM/gAAAAAEAAABUWyc/YxlqP///CgD//woA//8KAP//CgD//woA//8KAP//
CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//C
gD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//CgD//woA//8KAP//Cg
D//woA//8KAAn+DAHt/OYAfvxvAHX8AADy/F4AZf2hAJ/9zAC9/e4Asf1qAaL9IQKe/YQCm/23Asr9zQIAAAAAYAIAAAAAAAAAYuk/VU0+R5qxoz+
AAAAAAQAAAAw2cT8fvH0/s+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z
7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7
vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOs+78DrPu/A6z7vwOw/gtFRL71BZY/DUWGft2DNb68QTo+QAA5PmKAVz6QwKZ+9
oCgv1QAyb/AQP//3QCp/88AgAAAABhAgAAAAAAAABs6T9fUsuqea2jP4AAAAABAAAAUlrEPkFY+D6GAv//hgL//4YC//+GAv//hgL//4YC//+GAv/
/hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//
hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//hgL//4YC//+GAv//h
gL//4YC//8MAeH+uAAI/qMAb/1SADf9AAAz/Y8AKfyRAJT72wA1/PQA3/zOAEz9uwCB/b8Af/3EA6T9AAAAAGICAAAAAAAAAHjpP/h/lqVbqaM/gA
AAAAEAAADgI2E+669YP3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgD
i/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi
/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/3IA4v9yAOL/cgDi/wsAwv8AAKL/EQCK/yMAef9PAE//egBC/6AAR//HAEj/2wA6/
+sALP/6ACP/cgGQ/wAB//8AAAAAYwIAAAAAAAAAhOk/DBnrNECloz+AAAAAAQAAAIl5Pj/7HUg/C+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLg
vuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgv
uWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvuWS4L7lkuC+5ZLgvu
WS4L7lkuC+5ZLsn2zSNV93ghH/f6IML9Agup/zcE///jAdL/5gBw/lQDD/6rAXT+AADU+A0JreysDwAAAABkAgAAAAAAAACO6T/aUxhWJ6GjP4AAA
AABAAAAItLlPuTMQT/x/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vg
Px/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgP
x/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D8f2+A/H9vgPx/b4D3PxGAbf8ZgDI/BwA2fwAAAr9PgAt/VoATP1WAGj9SgBw
/SEAjP6oAX3/GwL///MCAAAAAGUCAAAAAAAAAJrpP4VScQYRnaM/gAAAAAEAAAAr/8c9alAgP7/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//
vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//v
UBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vUBv/71Ab/+9QG//vU
Bv/71Ab/+9QGI/gIBGv4NAfb95wAS/4EAtv8zAPn/BgD//wAA8v8KAOD/BQDc/wAAj//kAHT/egEAAAAAZgIAAAAAAAAApuk/yhtNQ/2Yoz+AAAAA
AQAAAFkBLT/2zEE/pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///p
wf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pw
f//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf//6cH//+nB///pwf///oDhf0hAj78OAFo+0kAsPoAAHL6FwBz+tAH4fpDDGr8AQ4
l/t8OdP+nEnL/oxNG/gAAAABnAgAAAAAAAACw6T+vkwYK7JSjP4AAAAABAAAAM/dCPyGYVj/j9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VM
B+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB
+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+P1TAfj9UwH4/VMB+
P1TAfj9UwHLPerBo34qwV++LYEbfvGAmr8rgFk/M4A3PsAAHz7AwAW+xsAtPotALf4mAT//ywPAAAAAGgCAAAAAAAAALzpP1V0/FfdkKM/gAAAAAE
AAADDFvw+hEckPzL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7
CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7C
AEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAEy+wgBMvsIATL7CAFK+ykC3fpAA336KgQy+u4EpPsDBcf7ggW1/lwCgf9FAeb/hg
D//wAAFf6+AA/9QgEAAAAAaQIAAAAAAAAAxuk/zkaRKtGMoz+AAAAAAQAAAAfuhz7uq14/6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UAD
q/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq
/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/lAA6v5QAOr+UADq/
lAA6v5QAN7+GgAh/w4AoP8AAMf/BwDR/xIA2P8cAOb/MwDw/1QA8v9nAPn/XgD//0sA+f86AAAAAABqAgAAAAAAAADS6T8QXCt/x4ijP4AAAAABAA
AAcluVPpBgOD9k/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8
BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8B
ZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BZP4fAWT+HwFk/h8BaP4ZAHv+AAAT/6UAdP8JAb7/KgHm/zwB+f9GAf//RgH7/0UB6
P8rAdn/EQHO/wIBAAAAAGsCAAAAAAAAAN7pP+vFNFPAhKM/gAAAAAEAAAB8DpI9NCMfPgELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQ
vG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQv
G/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG/gELxv4BC8b+AQvG
/gELxv7EBR/8NQUl/EkGSv2RB8n+qgj//3oD4fSUAe3yrgC08jMAtvIAAH3yAgVb8/0IVPQAAAAAbAIAAAAAAAAA6Ok/FFAbpLuAoz+AAAAAAQAAA
I/3xj4LVBY/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+
ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+A
CTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM/+ACTP/gAkz/4AJM//kAsv9KAMD/GgCY/wAAbP9OAHr/pQCo/9UAzf/nAOn/6AD//6oC
z/6hA2T+tAJU+AAAAABtAgAAAAAAAAD06T9KeVBvuXyjP4AAAAABAAAAn8Q4P8jHOz8Og2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DY
uMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYu
MOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuMOg2LjDoNi4w6DYuM
Og2LjmmM002FLmMRsO169rCKMrXYVeKXeDoqhBhU1ty4HK95jAfrzAADy/LkH///XCjT/AAAAAG4CAAAAAAAAAP7pP3BsSbK5eKM/gAAAAAEAAACS
wfs+R2o6P3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yA
v//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv
//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//9yAv//cgL//3IC//+IAIn+DgAw/gAAIP4KACL+PgAp/qMAG/7ZAAT+4QDw/dYA5/3LAOH
9yADY/cIA5P0AAAAAbwIAAAAAAAAACuo/2/l+arx0oz+AAAAAAQAAADcZ9j6JwAY/qezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAM
qezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMq
ezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqezADKnswAyp7MAMqe
zADKnswAyS8jMIDPFhBPPtbQGQ5RQAVOMAAH/hkQBd+g4SlP9aGf//9hyk/0ofHf/lIAAAAABwAgAAAAAAAAAW6j+LkG2VwXCjP4AAAAABAAAAurK
LPqG+HT81/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9A
ADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AA
DX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AADX/QAA1/0AANf9AAOb/AAD//54A5v/4ANH/NAG9/2kBq/+XAZ//uQGZ/9MBlf/qAY
z//AF//wsCAAAAAHECAAAAAAAAACDqP4w3lTDJbKM/gAAAAAEAAACNgS4/1sFOP1f55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf
55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf5
5ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55ARX+eQEV/nkBFf55
ARX+eQEvflZBhf6rwY9+mYGRPrlBTH6lgWG+n0FBP9XBN//XgT//8UEav21Ae/8AAAAAAAAcgIAAAAAAAAALOo/YId5OdNooz+AAAAAAQAAAJlkUj
5QY0o///8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD
//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD/
/xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAD//xwA//8cAP//HAB2/x0AR/8SAEf/BABQ/wAAkf8YAGL/qQA///EAOf8ZAT7/NgFB/
0UBQv9OAQAAAABzAgAAAAAAAAA26j9ro6Gt32SjP4AAAAABAAAAq/VLPb4heT+//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//g
AAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gA
Av/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAAv/4AAL/+AAC//gAA
v/4AALP+NwBy/q4AM/7OAAD+0gDW/cYAtf24AJ79mQCM/YcAG/+xAM7/owD//4IAAAAAAHQCAAAAAAAAAELqP4UzmIruYKM/gAAAAAEAAADutV8/4
8p/P5YAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lg
B//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB
//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9lgB//ZYAf/2WAH/9QQLD/mUCV//rAYH/cQGB/wwBhf+8AKT/gQDs/1cA//8PAKn/AABV
/yAACP8AAAAAdQIAAAAAAAAATuo/gV3rzf9coz+AAAAAAQAAAHMUDD7MI1s/Hv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fA
h7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh
7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7/HwIe/x8CHv8fAh7
/HwJI/gICEP4pAgn+YQIH/poCB/7OAtH+LgFi/4IAqv80ANL/DwDt/wEA//8AAAAAAAB2AgAAAAAAAABY6j/avix1E1mjP4AAAAABAAAAGvZGP5Z8
az8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dc
v8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv
8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/y0Dcv8tA3L/LQNy/8sCP/97Am7/XAKl/1gC5v/eAf//agH4/w4Bx/+tAID/XAAq/yUAx/4
AAFn+AAAAAHcCAAAAAAAAAGTqP1pm8X0pVaM/gAAAAAEAAABksW09T8DqPggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4I
A3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA
3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3T+CAN0/ggDdP4IA3
T+XALI/3kB6P9HAcb/YQGh/zMBq//hANf/qAD//3YA2f9ZAIf/IwCk/gAANf4AAAAAeAIAAAAAAAAAbuo/3c3R5UFRoz+AAAAAAQAAABYNuT0Uris
///9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA
//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA/
/9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwD//3MA//9zAP//cwBc/7UA0/7wAKf+BQGh/gUBif4FAWv+BAFe/vsANP5ZAE/+AACJ/jMAi/
4bAAAAAAB5AgAAAAAAAAB66j8d1GmqXE2jP4AAAAABAAAAw5LyPjradT8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AAD
L/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL
/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/wAAy/8AAMv/AADL/
xUAtv8qAMn/RADZ/1UA4f9hAPL/dwD//7MAav+aACf/yABo/+gAl//3ALT/AAAAAHoCAAAAAAAAAIbqP4a2WMl5SaM/gAAAAAEAAAAw6cg90978Pj
YCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DY
Cx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYC
x/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DYCx/w2Asf8NgLH/DkB8f34AET+0wBY/gAA0f8YAP//QQD4/6oA4P9QAdP+wwEA/rkBq
P0AAAAAewIAAAAAAAAAkOo/JgtBQJlFoz+AAAAAAQAAAPqbZTs1ZKY8E9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAA
AT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAA
T3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT3AAAE9wAABPcAAAT
3AAACP2YDv//7RWl/IAZYvnGGwj2zB4o80shO/GZIlTwcyBJ6g4ZseQ+EwAAAAB8AgAAAAAAAACc6j+ZusgMu0GjP4AAAAABAAAAz5m7PR32gD46+
VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+V
MCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VM
COvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwI6+VMCOvlTAjr5UwLT+QAAD/wPA/79ZwL5/osCgP8OA9T/iQP//+oDCP9mBW/+IwY9/oYG
AAAAAH0CAAAAAAAAAKbqPxP6mCzfPaM/gAAAAAEAAAC5Q1Y+0yMaP1//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX
/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/
9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9WAV//VgFf/1YBX/9
WAWr/uQDa/5YA//9UANP/JwCg/w4Agf8BAHn/AABy/wwAZ/8bAFr/KgAAAAAAfgIAAAAAAAAAsuo/Z0VenQU6oz+AAAAAAQAAAM+lmz44N3o/tAHg
/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/
rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/r
QB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+tAHg/rQB4P60AeD+jwGp/54B1v+/AdT/qgGB/8kAsf9tAP//AAC+/yYAMf83AOT+OwC+/gA
AAAB/AgAAAAAAAAC+6j8qWchcLjajP4AAAAABAAAAtE0cPmVy0z5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC
9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9
P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P5IAvT+SAL0/kgC9P
7SAf//wgDn/zUA2P8pAJv+HwDW/RQAef0AAFv9CQGi/sAB6/4kAtH+AAAAAIACAAAAAAAAAMjqP9ksimhZMqM/gAAAAAEAAACjFH49auE1PwAAFP8
AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8A
ABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AA
BT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/wAAFP8AABT/AAAU/3UBA//RAdX+wwFV/5EBn/9VAaj/GQGw/+sAp//sAJr/9wCK/88A//8AAA
AAgQIAAAAAAAAA1Oo/De1ZvoYuoz+AAAAAAQAAAFeolTsYdXo/m/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wA
Am/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAA
m/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAm/8AAJv/AACb/wAAc
P94AJL/uwCz/98AyP/0AND/BQHU/xAB1P8aAf//AAH8/xIB8/8hAQAAAACCAgAAAAAAAADg6j/E9fBbtiqjP4AAAAABAAAARu4FPaZ9Mj9gAfn+YA
H5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH
5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5
/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f5gAfn+YAH5/mAB+f72AB3+/QAC/rEAOP6RAE3+fgBU/m0AU/5bAGb/dwCr/1wAxP8AAP//AAAAA
IMCAAAAAAAAAOrqP6nMCz/oJqM/gAAAAAEAAADbJGs+ZrUwP7f/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AAL
f/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf
/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AALf/AAC3/wAAt/8AAK3/
AQC//wEA0v8EAJT/WwCp/0gAvP8/AMz/TQDf/3EA7/+HAP//lAAAAAAAhAIAAAAAAAAA9uo/dRtqZRwjoz+AAAAAAQAAAF2xkz6i/FE///8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AA
D//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD
//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAAPv9mAA7/zAAE/xMBA/9IAQX/egEF/6MBA//BAff+eQHu/k0B4v46AQAAAACF
AgAAAAAAAAAA6z9Rqs7MUh+jP4AAAAABAAAAbBKlPqZXMz9BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BA
Rf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BAR
f9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/1BARf9QQEX/UEBF/2wAcX
97gFB/ikBHP7EACr+jwBV/m0AjP5SAMf+KABt/w0AxP8AAP//AAAAAIYCAAAAAAAAAAzrP1Ja/3KLG6M/gAAAAAEAAAAZNgE9vaZbPwAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AA
D//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//9LAIP/aABj/7wAh//QAJr/0QCi/84Aqv/JAKX/OQHT/3QB1/8AAAAAhwI
AAAAAAAAAGOs/8B/FVcYXoz+AAAAAAQAAAKo7KD7LzhM/mf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8A
AJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AA
Jn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAJn/AACZ/wAAmf8AAO
H/EgD0/yEA9v8tAPD/NgD1/0oA//9iAPn/fwDu/50A4P+7AAAAAACIAgAAAAAAAAAi6z+a/etyAxSjP4AAAAABAAAAAaQvPmJSfz9VAUT/VQFE/1U
BRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UB
RP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBR
P9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/VQFE/1UBRP9VAUT/qQC3/0YAj/8lACD/GwDu/gAAvv4gAbL/bQH//9oB5f8lAsb/AAAAAIkCAA
AAAAAAAC7rP0j+QshCEKM/gAAAAAEAAAAkpBY/YgVfP67+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQK
u/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu
/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQKu/l0Crv5dAq7+XQJB/
5gA//8AAMX/iwCM/5cAUP+2AHL+3AI2/hYEJ/6pBET+9AQAAAAAigIAAAAAAAAAOOs/IjCcU4QMoz+AAAAAAQAAAFm9RD8+V0c/qlbcuapW3LmqVt
y5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty
5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5
qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcuapW3LmqVty5qlbcufw7N9RdLPHflyHH484aHOUWGb3rWBjM7XsWcezdEOz0AAD//wAAAACLAgAAA
AAAAABE6z8rn8wSyAijP4AAAAABAAAA/HpJPlgrbj9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQ
D+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD
+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/RQD+/0UA/v9FAP7/HwD/
/wEAwv8AAJf/dQBU/5sALf++AAH/zgDt/toA4/7nAOT+AAAAAIwCAAAAAAAAAFDrPwNQrAMOBaM/gAAAAAEAAADHTCQ9lEFbPqT+HQKk/h0CpP4dA
qT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAq
T+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT
+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQKk/h0CpP4dAqT+HQIi/k4AbP4AAFX/mgCj/9IAsv/gAP//EgFL/90BDv94AgD/xgIAAAAAjQIAAAAA
AAAAWus/oToWJFYBoz+AAAAAAQAAAEofwz1zCA8///9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//Z
QH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQ
H//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAf//ZQH//2UB//9lAUD/xwD
v/n4Ayf5kALL+XADe/kgA4f4uANT+GQC5/goAnv4AAAAAAACOAgAAAAAAAABm6z8xRehxoP2iP4AAAAABAAAA411IuxWXAz95AsX8eQLF/HkCxfx5
AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5A
sX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5As
X8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8eQLF/HkCxfx5AsX8aQIB/k4CN/7tALX/gwD//94A9v/HAGH/2QDF/lsATv4AAP39AAAAAI8CAAAAAAA
AAHDrP+Y+A+vs+aI/gAAAAAEAAABO1rY+vUAfP///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD
//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD/
/8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwP//yMD//8jA///IwO+/98CtP
5xAbj+1gC6/p0AqP58AJP+XwB2/kAAWP4kADj+AAAAAAAAkAIAAAAAAAAAfOs/5tpKjTv2oj+AAAAAAQAAAHWGXz4ceOI+AAD//wAA//8AAP//AAD
//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD/
/wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//+AB6/3KAif9YQPt/MwD1vwOBMz8OQTM/GcE1/ylBPL8hgTT/AAAAACRAgAAAAAAAA
CI6z88q6VWjPKiP4AAAAABAAAAjOgQPqSZYD7//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAPX9F
QJK/SoDXv3RA+n9BATv/VYEpf3pBDb9ewXS/JAFAAAAAJICAAAAAAAAAJLrP9Ib/UTf7qI/gAAAAAEAAAC61ns9AAslPwAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//cABd/6oAA//DAM/+0ACp/lQBi/5zAcX+owH+/rYBgv4AAAAAkwIAAAAAAAAAn
us/fG09VjTroj+AAAAAAQAAAMVQGj9ua3I/xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAk
j+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj
+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP7HAkj+xwJI/scCSP5lAhj/
EAKQ/zgBdP/XAHP/mQD5/1cA//8uAOr/AADQ/wAAAACUAgAAAAAAAACo6z8IsVWIi+eiP4AAAAABAAAA0qXAPvc0Kz8F/QAABf0AAAX9AAAF/QAAB
f0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf
0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0
AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAX9AAAF/QAABf0AAAb+DgG5/tYBR/9UArH/pQL//9oCs/9+Aqr/XQLw/pYBAAAAAJUCAAAAAAAAALTr
P1rCN9nk46I/gAAAAAEAAACuIjA+9Rc4PzkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//
zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//z
kA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//OQD//zkA//85AP//AABt/w0
AV/8yAOz+TwDC/n0A5v6xAP/+4QD2/gMBIv8AAAAAlgIAAAAAAAAAwOs/k0PYRkDgoj+AAAAAAQAAAGlNQz4jj3g/x/99AMf/fQDH/30Ax/99AMf/
fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/f
QDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQ
DH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDH/30Ax/99AMf/fQDw/wwA//8BAPv/AAD2/yMA7v8eAOf/DwCL/y4Abf9HAAAAAACXAgAAAAAAAADK6z9
GmC7PndyiP4AAAAABAAAA2zj2Pg+fET99/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9
/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/
7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5AX3/uQF9/7kBff+5Af//AADO+4
IG5viSCXb6uwoN/OwK4PzJCiH9cQrv/AAKAAAAAJgCAAAAAAAAANbrP67gNHD92KI/gAAAAAEAAACbyK8+8g7NPmEF2/dhBdv3YQXb92EF2/dhBdv
3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3
YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3Y
QXb92EF2/dhBdv3YQXb92EF2/dhBdv3YQXb92EF2/dhBdv3EQLM+l8Br/gAAKT8SQEM/p8C1/6uA3X/hwT//ygEH/YAAAAAmQIAAAAAAAAA4Os/9f
TnJ1/Voj+AAAAAAQAAAIv5qD6ZuwM/jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD
//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD/
/4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//+MAP//jAD//4wA//8AAML+FwCR/
j4Amf5XALL+ZADK/nEAyP6MAI/+aQAw/wAAAACaAgAAAAAAAADs6z+EYEf0wtGiP4AAAAABAAAAkkPEPl4JOT+NAHX+jQB1/o0Adf6NAHX+jQB1/o
0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0
Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/o0A
df6NAHX+jQB1/o0Adf6NAHX+jQB1/o0Adf6NAHX+jQB1/ogAgf6XALX+oADp/qIAFv+eADv/fQB//zcAyv8AAP//AAAAAJsCAAAAAAAAAPjrP2BdV
dMozqI/gAAAAAEAAACxPxs/pOcpP2/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+tw
Zv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZ
v/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGb/63Bm/+twZv/rcGE/uyCEb6/wlW
948I1fraArj9oABC/wAA//8iALr/YAAAAAAAnAIAAAAAAAAAAuw/hM8Ww5DKoj+AAAAAAQAAAIib+T7rR1k/iADW/4gA1v+IANb/iADW/4gA1v+IA
Nb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IAN
b/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb
/iADW/4gA1v+IANb/iADW/4gA1v+IANb/iADW/4gA1v+IANb/IgDe/wsA7/8GAPL/AADh/8AA//8XAev/TgHT/wAAAACdAgAAAAAAAAAO7D9XQJPB
+saiP4AAAAABAAAANK5dPyPzej/49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+
PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+P
YAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AAD49gAA+PYAAPj2AABx96gBC/i
vAnb7oQIy/nsC//9oAoz/xwOR/qADAAAAAJ4CAAAAAAAAABjsPxza1Mxmw6I/gAAAAAEAAADNXS0/lbp+P3UASfx1AEn8dQBJ/HUASfx1AEn8dQBJ
/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/
HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/H
UASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/HUASfx1AEn8dQBJ/AAA6v3PA7z+UwVc/9wFu/8aBv//wQb1/gsHJv4AAAAAnwIAAAAAAAAAJOw/dmPo4tS
/oj+AAAAAAQAAANu5nDwfJfo+AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA
//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/
/8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//VwHC/8YBxv
8NAsD/+QE9/wEC4/7cASf+8gHK/QAAAACgAgAAAAAAAAAw7D/sOt0BRbyiP4AAAAABAAAAaH1bP0XzXD88B6C3PAegtzwHoLc8B6C3PAegtzwHoLc
8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8
B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B
6C3PAegtzwHoLc8B6C3PAegtzwHoLc8B6C3PAegtzwHoLdhC9HnYhn//yoI+f04BZf3NQVe9jEEyvgAAID/AAAAAKECAAAAAAAAADrsP4NSxSe3uK
I/gAAAAAEAAAAVpa89zyg/PhQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H
3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3
FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB9xQDQfcUA0H3FANB96EBW/ryAMv7A
AC2/DMA0PyMAMT8JwSN/m4F//8AAAAAogIAAAAAAAAARuw/Uiu1Uiu1oj+AAAAAAQAAAAFZmjxGhaQ++/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/
5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5
SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB+/5S
Afv+UgH7/lIB+/5SAfv+UgH7/lIB+/5SAfv+UgH7/lIB//8AAIr/TAC2/twBp/60Ai7/mAIY/84C9v4IAwAAAACjAgAAAAAAAABS7D8u0cOAobGiP
4AAAAABAAAAgbPmPmrAGz9m+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAG
b4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb
4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AABm+AAAZvgAAGb4AADy/EAAA/8QAb7/
DwL//wUD+//iA7H/jgTt/gcFAAAAAKQCAAAAAAAAAFzsP1HWCrAZrqI/gAAAAAEAAACIvAg/+RxePxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+J
QMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQ
MZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQM
Z/iUDGf4lAxn+JQMZ/iUDGf4lAxn+JQMZ/iUDGf4lAyP/ugJz/9MCRP/9Ai3/oQGQ/8YA0v9MAP//AAAAAAAApQIAAAAAAAAAaOw/FE+m3pOqoj+A
AAAAAQAAAPhJ9z0awe4+AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AA
Nf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AAN
f/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/AADX/wAA1/8AANf/rgD///8A4f8zAbz
/YQGO/7YBQP8FAuX+OQKt/gAAAACmAgAAAAAAAABy7D+zzbQKEKeiP4AAAAABAAAAM0tAPnYFNz/k//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA
5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5
P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P
/0AOT/9ADk//QA5P/0AOT/9ADk//QA5P/0AOT/9AD//0QA+f8QAPT/AADW/2QAqf+eAIj/xABy/94AAAAAAKcCAAAAAAAAAH7sPw9eVzKOo6I/gAA
AAAEAAADqWDQ9QB8gPoX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsA
AIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAA
IX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAIX7AACF+wAAhfsAAMf64AGP+nEDE/tXBR
H8Fgjm+6UJiP9jDf//dg0AAAAAqAIAAAAAAAAAiuw/gYGxUw6goj+AAAAAAQAAAC5QLD5QAVo///8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AALr/xQCQ/wEBg/8QAYf/FwGM/xwBjv8hAQAAAACpAgAAAAAAAACU7D+3KulskJyiP4AAAA
ABAAAAl1gEPnwPRT8AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0
AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0A
AGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9AABq/QAAav0AAGr9VwC4/m4AMv/9A
GP/NwGm/+sArv/SAP//AAAAAKoCAAAAAAAAAKDsP5G5JnwUmaI/gAAAAAEAAADfzwU/qs8ePz349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+P
cCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+Pc
CPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wI9+PcC
Pfj3Aj349wI9+PcCPfj3Aj349wI9+PcCPfj3Aj349wII+64ADv0gALT+AAD//wYAnf+XAJ//WwEAAAAAqwIAAAAAAAAAquw/E/eUf5qVoj+AAAAAA
QAAAGmVvz6sCcY+//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAKb9HBtf+rcgl/aQ
IInzKR8m8aAdPPK5GwAAAACsAgAAAAAAAAC27D9SEWF1IpKiP4AAAAABAAAAxEKvPupkdj8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w
AA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//JgDc/5AAg//oAJz/IwGz/0EBwv9OAdH/AAAAAK0CAAAAAAAAAMLsP3KXulusjqI/gAAAAAEA
AABBvB4/3FFGPxUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr
/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/
0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/0VBK/9FQSv/RUEr/2SAhb/dgJi/5MCZ/+
5Alf/wgD//wAAjP8AAAAArgIAAAAAAAAAzOw/qXXTMDiLoj+AAAAAAQAAADIxzzuvdaw+AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//ywANP+pAO7+RgAR/xAAIP/MAJ3+pQCc/gAAAACvAgAAAAAAAADY7D9P8d/yxYeiP4AAAAABAAA
A98InP8M7fT+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//
nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//n
QH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//nQH//50B//+dAf//cwCX/0cAdP9YAHn/bQ
CA/ygApv4AABb+AAAAALACAAAAAAAAAOLsP+ukFqBVhKI/gAAAAAEAAAAgeRE+2ZBMP///xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///
EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///E
AP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EAP//xAD//8QA///EA
P//xAD//8QA///EAP//xAD//8QA///EAP//xABN/1wAA/8AAEf/OABx/2cAhv+GAJb/oQAAAAAAsQIAAAAAAAAA7uw/V3ywNueAoj+AAAAAAQAAAK
g6KT/RLTY///8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf/
/GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//
GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFf//GRX//xkV//8ZFVH7+AzP/CYH1vyrA1/87
gEc/LEApvwAAAAAAACyAgAAAAAAAAD67D/ZsOi0en2iP4AAAAABAAAAsAYBPp+Lcj9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//
9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9
lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//ZQD//2UA//9l
AP//ZQD//2UA//9lAP//ZQD//2UA//9lAP//TADC/zsAtf8XAFz/BwBZ/wAAW/83AH7/AAAAALMCAAAAAAAAAATtP13F/BgQeqI/gAAAAAEAAABb2
S4+cxlhPgAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//IgYX/rYIovw7Cr77
bAsY+44L8foAAAAAtAIAAAAAAAAAEO0/nIIsYad2oj+AAAAAAQAAABpOCz6bBnQ/8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8
v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v
8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8
AAPL/AADy/wAA8v8AAPL/AADy/wAA8v8AAPL/AADp/30A8P+gAP//sQDo/6IAyf+OAAAAAAC1AgAAAAAAAAAa7T9f87mLQHOiP4AAAAABAAAAX/Bh
P9N5aT9h6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdD
GHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDG
HqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDGHqXQxh6l0MYepdDIL9YQT//zYB0f4AAFr
9fACN+1wBAAAAALYCAAAAAAAAACbtP75g6Zbbb6I/gAAAAAEAAADxdXU+k5mZPvEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEF
Nf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFN
f3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf
3xBTX98QU1/fEFNf3xBTX98QU1/fEFNf3xBTX95gJV/HkBrftqAd/6qAFf+gAA//8AAAAAtwIAAAAAAAAAMu0/a04BgXhsoj+AAAAAAQAAAFWCDD8
EOnM/XP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc
/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/
4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAFc/4gBXP+IAVz/iAEs/7IB///tAQ7/FAFz/m
0AHP4AAAAAAAC4AgAAAAAAAAA87T8Fd0pIF2miP4AAAAABAAAA/gkoP723KT8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//3cKdfWIFEfnuxuI2Bckw76NI9GuAAAAALkCAAAAAAAAAEjtP3LID+u3ZaI/gAAAAAEAAAAhDbo+Tw
2APwAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AAC
J/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ
/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/AACJ/wAAif8AAIn/pACX/9QAqv/tAMf/9QDm/
/cA//8AAAAAugIAAAAAAAAAUu0/PmCeZ1pioj+AAAAAAQAAAMVD3j4mdH0/AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/g
AAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gA
AcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP4AAHD+AABw/gAA
cP4AAHD+AABw/gAAcP4AAHD+AABw/gAAcP5tAL/+ogAF/7MAWf+5ALb/tQD//wAAAAC7AgAAAAAAAABe7T8DiEW8/l6iP4AAAAABAAAAcC7vPleiA
D///5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kx
T//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT
//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFP//kxT//5MU//+TFHTxlQvP6xMHO+kABLjnugHO
5gAAAAAAALwCAAAAAAAAAGrtP9mxVuekW6I/gAAAAAEAAABmhAI+gB/5Ps3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/
wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/w
AAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wAAzf8AAM3/AADN/wA
Azf8AAM3/AADN/wAAzf8AAM3/AADN/wAA/P9tAf//zQH1/9YB6v/NAd//wQEAAAAAvQIAAAAAAAAAdO0/y3Ql50xYoj+AAAAAAQAAALCCkj4XJnE/
jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//j
gD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jg
D//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//+OAP//jgD//44A//92AH3/SwAh/yoA2f4VAKb+AAC
b/gAAAAC+AgAAAAAAAACA7T9XiQe69lSiP4AAAAABAAAAJ5oyP+lMRj859wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcA
ADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAA
Dn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAADn3AAA59wAAOfcAAD
n3AAA59wAAOfcAADn3AAA59wAAOfcAAFH8SgXA/ugI//93CyP+dAtM+jsJAAAAAL8CAAAAAAAAAIztP/DFVF6iUaI/gAAAAAEAAABkuco9UH9BP//
/VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//
VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//V
wH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAf//VwH//1cB//9XAfn/oAD2/y8AoP8yAI3/AA
AAAAAAwAIAAAAAAAAAlu0/ixtn0k9Ooj+AAAAAAQAAAO4l8Dw3iA0/TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5
MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5M
AMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+TADL/kwAy/5MA
Mv+TADL/kwAy/5MAMv+TADL/kwAy/5MAMv+8gBA/6sAVP8tANv/AAD//wAAAADBAgAAAAAAAACi7T8wkpoU/0qiP4AAAAABAAAAn3AePoSjej8uAP
//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP/
/LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//
LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8uAP//LgD//y4A//8JACz/AAC+/gIATv4JAB3+A
AAAAMICAAAAAAAAAKztP5FFTSOwR6I/gAAAAAEAAAD9/wo/PANNP///NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//
80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//8
0Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80Av//NAL//zQC//80
Av//NAL//zQC//80Av//NAL//zQC//80Amv/DAGl/rMAKv6yAAf+AAAAAAAAwwIAAAAAAAAAuO0/sGHf/GJEoj+AAAAAAQAAAPgdFj+cZWc/AAAz/
wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/w
AAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wA
AM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/AAAz/wAAM/8AADP/ngCL/8sAw//pAOb/+gD//wAA
AADEAgAAAAAAAADE7T+AH7OfF0GiP4AAAAABAAAAhND3PSR6JD+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA/
/+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//
+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//gAD//4AA//+
AAP//gAD//4AA//+AAP//gAD//4AA//8VALj/IQDP/0sA+P8AAGT/AAAAAMUCAAAAAAAAAM7tP5XBLArOPaI/gAAAAAEAAAA4omc9kzmTPkAA3vtA
AN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAA
N77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN
77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+0AA3vtAAN77QADe+8wAq/4xAZ//kQH//wAA9P4AAAA
AxgIAAAAAAAAA2u0/1ZCyOoY6oj+AAAAAAQAAAPTGDj/fImk/5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA
5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5
v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v0AAOb9AADm/QAA5v
0AAOb9AADm/QAA5v0AAOb9AADm/QAAwf8xAP//oAC6/wIBfv9XAQAAAADHAgAAAAAAAADk7T802awvQDeiP4AAAAABAAAAob+ePZeoST8DARH+AwE
R/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER
/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/
gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4DARH+AwER/gMBEf4oACX/AACy/wkA4P8tAP//AAAAAM
gCAAAAAAAAAPDtP3fmhef7M6I/gAAAAAEAAAC8vAc+5/40P///UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP/
/UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//
UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//UQD//1EA//9RAP//U
QD//1EA//9RAP//UQD//1EA//9RAO7/BQCq/wAAdP8fAE3/OQAAAAAAyQIAAAAAAAAA/O0/9QCqYLkwoj+AAAAAAQAAABIjCT2HISk/PgC5/z4Auf
8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8
+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+
ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PgC5/z4Auf8+ALn/PQD4/2gA+P96AP//AAC+/wAAAADKA
gAAAAAAAAAG7j9saoeZeC2iP4AAAAABAAAA/bozPwx1fD///5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5
IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5I
A//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA//+SAP//kgD//5IA
//+SAP//kgD//5IA//+SAP//kgD//5IAuP8AAJf/PABf/3kAAAAAAMsCAAAAAAAAABLuP89ajpA5KqI/gAAAAAEAAAB1yxE+cLK3PgAAz/8AAM//A
ADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AA
DP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AAD
P/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/8AAM//AADP/wAAz/+KAGz+NAGx/qYC//8AAAAAzAIA
AAAAAAAAHO4/If0wRPwmoj+AAAAAAQAAAJLAvT7PclQ/mf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LA
Jn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJ
n+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAJn
+iwCZ/osAmf6LAJn+iwCZ/osAmf6LAKj/AADv/xgA//86AAAAAADNAgAAAAAAAAAo7j9XbOOywCOiP4AAAAABAAAAmJxHPfmMcz///wQA//8EAP//
BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//B
AD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BA
D//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA//8EAP//BAD//wQA4v4AAF/+FwA6/i8AAAAAAM4CAAA
AAAAAADTuPzywG9uGIKI/gAAAAAEAAAAJ37w9bTgOPwAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8A
AGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AA
Gn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAGn/AABp/wAAaf8AAG
n/AABp/wAAaf8AAGn/AABp/wAAaf/cAGL/jgHg/9sB//8AAAAAzwIAAAAAAAAAPu4/YbpRu04doj+AAAAAAQAAADMJ2T5dS1M/AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//zsA8P8tAOX/DgDp/wAAAADQAgAAAA
AAAABK7j8KY/9RGBqiP4AAAAABAAAA3HLrPsHPZj9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH
//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH/
/3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//3IB//9yAf//cgH//
3IB//9yAf//cgH//3IB//9yAf//mwBH/zMA0P4AAIf+AAAAANECAAAAAAAAAFTuPylmoJ3jFqI/gAAAAAEAAADIoAY9rISNPjr/GAI6/xgCOv8YAj
r/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr
/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/
GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAI6/xgCOv8YAjr/GAKA/+wAwP9TAP//AAAAAAAA0gIAAAAAA
AAAYO4/XmCynLAToj+AAAAAAQAAALO2FT+jzX4/NP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AA
A0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA
0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0/gAANP4AADT+AAA0
/gAANP4AADT+AAA0/gAANP4AAET/UAC9/1UA//9MAAAAAADTAgAAAAAAAABs7j/3y7RNfxCiP4AAAAABAAAAZk66PvdtIz8xAGL+MQBi/jEAYv4xA
GL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAG
L+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL
+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+MQBi/jEAYv4xAGL+AAA4/0oAXf+PAP//AAAAANQCAAAAAAAA
AHbuP/z9KK9PDaI/gAAAAAEAAAAL1Mk+zr86P///4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB/
//gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB//
/gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///gAf//4AH//+AB///
gAf//4AH//+AB///gAf//4AG9/x8Bq/+5ALj/AAAAAAAA1QIAAAAAAAAAgu4/QCOSvyEKoj+AAAAAAQAAADRjJT630E8/VQCJ/lUAif5VAIn+VQCJ
/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/
lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/l
UAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif5VAIn+VQCJ/lUAif4aAK//AAD//wAAAADWAgAAAAAAAAC
M7j9yPXV99QaiP4AAAAABAAAA8sKCPe/Itz00BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQE
DPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQED
PM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDPM0BAzzNAQM8zQEDP
M0BAzzNAQM8zQEDPM0BAzzNAQM8+YCT/0AAP//AAAAANcCAAAAAAAAAJjuPzwgWefKA6I/gAAAAAEAAABiEFE//YB8P7z/AAC8/wAAvP8AALz/AAC
8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8
/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/
wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAvP8AALz/AAC8/wAAyv9IAP//kgAAAAAA2AIAAAAAAAAApO
4/YW7G+6EAoj+AAAAAAQAAAIJ/Iz8Vozs/Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv
8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8
Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8Kgob/CoKG/wqChv8K
gob/CoKG/wqChv8Kgob/CoKG/wOBCH/AAD//wAAAADZAgAAAAAAAACu7j/klke5ev2hP4AAAAABAAAA0w0APyInMT///9cA///XAP//1wD//9cA//
/XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///
XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///X
AP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAP//1wD//9cA///XAMn/AACS/3wAAAAAANoCAAAAAAAAALruP
zHSaB5V+qE/gAAAAAEAAAD4Q3w9AMUFPwAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/w
AAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wA
AMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAAMP8AADD/AAAw/wAA
MP8AADD/AAAw/wAAMP8AADD/ZQCu/4EA//8AAAAA2wIAAAAAAAAAxu4/Uh+4KTH3oT+AAAAAAQAAAJBJXz0IOkU///8wAP//MAD//zAA//8wAP//M
AD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MA
D//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD
//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAD//zAA//8wAP//MAAn/xcAtf4AAAAAAADcAgAAAAAAAADQ7j8k
QcXZDvShP4AAAAABAAAAairiPKBgAT7//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w
AA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAHX5JwNv9kADAAAAAN0CAAAAAAAAANzuP467IS3u8KE/gAAAAAEAAAC4lDw9WNAoP///AAD//wAA//8AAP//AAD//wAA
//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/
/8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAAs/9+AHn/qQAAAAAA3gIAAAAAAAAA5u4/ydB
gIs/toT+AAAAAAQAAAOx0NT9+x1Q/Zf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1W
CGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WC
GX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCGX9Vghl/VYIZf1WCG
X9Vghl/VYIZf1WCGX9VghR/ZAE//8AAAAAAADfAgAAAAAAAADy7j+ifhe4seqhP4AAAAABAAAAdSKpPi9idT9A/x8BQP8fAUD/HwFA/x8BQP8fAUD
/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/
HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/H
wFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAUD/HwFA/x8BQP8fAY//cQD//wAAAAAAAOACAAAAAAAAAP7uP8R73O
yV56E/gAAAAAEAAABOI908JAZKPoUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvm
FABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmF
ABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFABL5hQAS+YUAEvmFA
BL5hQAS+YUAEvmFABL5mQBA/QAA//8AAAAA4QIAAAAAAAAACO8/DjVIv3vkoT+AAAAAAQAAACLR3j7MyDU/sP8AALD/AACw/wAAsP8AALD/AACw/w
AAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wA
AsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAA
sP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAAsP8AALD/AACw/wAA//8VAAAAAADiAgAAAAAAAAAU7z/jyvQtY
+GhP4AAAAABAAAASv64PS77aD8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//Ag
D//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD
//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD//wIA//8CAP//AgD/
/wIA//8CAP//AgD//wIA//8AAOj/AAAAAOMCAAAAAAAAAB7vP4cOfjdM3qE/gAAAAAEAAADacI8+yBVYPwAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w
AA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//9EA1v8AAAAA5AIAAAAAAAAAKu8/gH+B2jbb
oT+AAAAAAQAAANXpyT4WdRs/AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAm
fwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmf
wAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfwAAJn8AACZ/AAAmfw
AAJn8AACZ/AAAmfwAAJn8/gD//wAAAADlAgAAAAAAAAA27z/2SJ4VI9ihP4AAAAABAAAAZGOnPgwp6T6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6k
Avf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kA
vf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAv
f+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/6kAvf+pAL3/qQC9/4AAP//AAAAAOYCAAAAAAAAAEDvPyY/decQ1aE
/gAAAAAEAAAASs28+chKIPv//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA
//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/
/8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAOX9iQEAAAAA5wIAAAAAAAAATO8/wtyoTgDSoT+AAAAAAQAAAIpPPT6drCg/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD
//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD/
/wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//pAD0/wAAAADoAgAAAAAAAABW7z91QN1J8c6hP4
AAAAABAAAAIx8+P/AkUT9E/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET
/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/
AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/AABE/wAARP8AAET/A
ABE/wAARP8AAET/AAD//0ICAAAAAOkCAAAAAAAAAGLvP04quNfjy6E/gAAAAAEAAACk5rU9lbYtPwAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//6UA+v8AAAAA6gIAAAAAAAAAbu8/Qvng9tfIoT+AA
AAAAQAAAIegEj8fAUQ/5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5
gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5g
C5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC5/+YAuf/mALn/5gC
5/+YAuf/mALn/5gC//8AAAAAAADrAgAAAAAAAAB47z+xqACmzcWhP4AAAAABAAAAQlTsPRBNnz5CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//Q
gD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//Qg
D//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD
//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//9CAP//QgD//0IA//8AAID9AAAAAOwCAAAAAAAAAITvP+TNwePEwqE/gAAA
AAEAAAA3bMI+N/kPP///AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP/
/AAD//wAA//8AAP//AAAAAAAA7QIAAAAAAAAAju8/oZXQrr2/oT+AAAAAAQAAAIcToT5wsFM///8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AA
D//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAADuAgAAAAAAAACa7z+0wdoFuLyhP4AAAAA
BAAAA9U66PrPsLj8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAAAAO8CAAAAAAAAAKbvP4amj+ezuaE/gAAAAAEAAADpksk9wjqiPv//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA
//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/
/8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAAAA8AIAAAAAAAAAsO8/tyigUrG2oT+AAAAAAQ
AAAIOqLT/+jW8///8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAAAAAADxAgAAAAAAAAC87z+2ur5FsLOhP4AAAAABAAAA5Q/BPSFcGj8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w
AA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA
//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAPICAAAAAAAAAMbvP2han7+wsKE/gAAAAAEAA
AAox1k+VLlpPwAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAAAA8wIAAAAAAAAA0u8/zI73vrKtoT+AAAAAAQAAAFphpj7wTS0///8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//
wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w
AA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wA
A//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAAD0AgAAAAAAAADe7z+lZX5CtqqhP4AAAAABAAAA
OHXGPbo2aT///wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/
/8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//
8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8
AAP//AAD//wAAAAAAAPUCAAAAAAAAAOjvPypx7Ei7p6E/gAAAAAEAAAACezE+FCpQP///AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8A
AP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AA
P//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP
//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAAAA9gIAAAAAAAAA9O8/tsX70MGkoT+AAAAAAQAAAPF
DKj4M8QE///8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//
AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//A
AD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AA
D//wAA//8AAIAAAAAAAAAAAAiGC3INXg9METgTJhUSF/4Y7BrYHMYesiCeIowkeCZmKFIqPiwsLhgwBjLyM941zDe4OaY7kj1+P2xBWENGRTJHHkk
MS/hM5k7SUL5SrFSYVoZYclpeXExeOGAmYhJk/mXsZ9hpxmuybZ5vjHF4c2Z1Unc+eSx7GH0Gf/KA3oLMhLiGpoiSin6MbI5YkEaSMpQelgyY+Jnm
m9Kdvp+soZijhqVyp16pTKs4rSavErH+suy02LbGuLK6nryMvnjAZsJSxD7GLMgYygbM8s3ez8zRuNOm1ZLXftls21jdRt8y4R7jDOX45ubo0uq+7
KzumPCG8nL0XvZM+Dj6JvwS/g==`.replace(/\n|\r/g,"");function Oi(g){let A=xe,t=1/255;for(let i=0;i<g.length;i+=4){let n=A(g[i]*t,g[i+1]*t,g[i+2]*t);g[i+0]=n[0]*255,g[i+1]=n[1]*255,g[i+2]=n[2]*255}}var qt=class extends Array{constructor(A=256){super(),this.length=A,this.fill(0,0,this.length)}reset(){return this.fill(0,0,this.length),this}add(A,t=1){A=Math.min(Math.max(A,0),1)*.99999999;let i=~~(A*this.length);this[i]+=t}finish(){this.df=this.slice(0,this.length);for(let A=1;A<this.length;A++)this[A]+=this[A-1]}calcIntensity(A,t,i){return(A+t+i)/3}doImage(A){let t=A.fdata!==void 0?A.fdata:A.data;for(let o=0;o<t.length;o+=4){let r=t[o],a=t[o+1],l=t[o+2],w=t[o+3];if(w===0)continue;r/=255,a/=255,l/=255;let P=this.calcIntensity(r,a,l);this.add(P,w/255)}let i=0,n=0;for(let o=0;o<this.length;o++)i+=this[o],n=Math.max(n,this[o]);if(i>0)for(let o=0;o<this.length;o++)Math.abs(this[o]-i)>0&&(this[o]*=Math.pow(1-this[o]/i,5));this.finish()}draw(A,t){t.save();let i=20,n=140,o=500,r=200;t.strokeStyle="grey",t.beginPath(),t.rect(i,n,o,r),t.stroke();let a=this[this.length-1];if(a!==0){t.lineWidth*=2,t.strokeStyle="orange",t.beginPath();for(let l=0;l<this.length;l++){let w=i+l/this.length*o,P=n+(1-this[l]/a)*r;l===0?t.moveTo(w,P):t.lineTo(w,P)}t.stroke(),t.restore()}}};function Yi(g){for(let A=0;A<4;A++){let{image2:t,err:i}=Br(g,.4);if(g=t,Math.abs(i)<.01)break}return g}function Br(g,A){g=Object.assign({},g),g.fdata===void 0&&(g.fdata=new Float32Array(g.data)),g.fdata=new Float32Array(g.fdata);let t=1/255,i=g.fdata;for(let w=0;w<i.length;w+=4){let P=i[w]*t,B=i[w+1]*t,D=i[w+2]*t,v=VA(P,B,D);v=lt(v[0],v[1],v[2]),i[w]=v[0]*255,i[w+1]=v[1]*255,i[w+2]=v[2]*255}let n=new qt;n.reset(),n.doImage(g);let o=n[n.length-1];if(o===0)return;let r=new Float32Array(i.length);r.set(i);let a=0,l=[0,0,0];for(let w=0;w<i.length;w+=4){let P=i[w]*t,B=i[w+1]*t,D=i[w+2]*t;if(i[w+3]*t===0)continue;let h=n.calcIntensity(P,B,D);l[0]=P,l[1]=B,l[2]=D,h=Math.min(Math.max(h,0),1)*.9999999;let u=~~(h*n.length),m=n[u]/o,Q=u/n.length;Q=Q**.5;let I=m-Q;{let d=1+I*3*A*(2-u/n.length);l[0]*=d,l[1]*=d,l[2]*=d}for(let d=0;d<3;d++)l[d]=Math.min(Math.max(l[d],0),1);l=gt(l[0],l[1],l[2]),l=xe(l[0],l[1],l[2]),r[w]=l[0]*255,r[w+1]=l[1]*255,r[w+2]=l[2]*255,a+=Math.abs(I)}return a/=i.length/4,console.log("hist error:",a.toFixed(4)),{image2:{width:g.width,heigth:g.height,fdata:r},err:a}}function Wt(g,A){let t=.00392156862745098,i=VA;for(let n=0;n<g.length;n+=4){let o=(g[n+0]+(Math.random()-.5)*2)*t,r=(g[n+1]+(Math.random()-.5)*2)*t,a=(g[n+2]+(Math.random()-.5)*2)*t;if(!c.SHOW_RAW_IMAGE){let w=i(o,r,a);o=w[0],r=w[1],a=w[2]}let l=g[n+3]+(Math.random()-.5)*2;l=Math.min(Math.max(l,0),255),A[n+0]=~~(o*255),A[n+1]=~~(r*255),A[n+2]=~~(a*255),A[n+3]=~~l}return A}function Ki(g){console.log("Debanding. . .");let A=Math.floor(g.width/2048),t=g;console.log("downSteps",A),console.log("Downsampling");for(let o=0;o<A;o++)t=vr(t);console.log("Blurring"),t=hr(t),console.log("Upscaling"),A>0&&(t=Dr(t,1<<A)),console.log("Done");let i=g.fdata,n=t.fdata;for(let o=0;o<n.length;o+=4){let r=o/4,a=r%t.width,w=(~~(r/t.width)*g.width+a)*4,P=o;for(let B=0;B<4;B++){let D=i[w+B]+(n[P+B]-i[w+B])*c.DEBAND_BLEND;D/=255;let v=D*D*(3-2*D);v=v*v*(3-2*v),D=D+(v-D)*.3,D*=255,D=B===3?n[P+B]:D,i[w+B]=D}}return{width:g.width,height:g.height,fdata:g.fdata}}function Dr(g,A=2){let t=~~(g.width*A),i=~~(g.height*A),n=new Float32Array(t*i<<2),o=g.fdata,r=g.width,a=g.height;for(let l=0;l<o.length;l+=4){let w=l/4,P=w%r,B=~~(w/r),D=Math.min(P+1,r-1),v=Math.min(B,a-1),h=v*r+D<<2;D=Math.min(P,r-1),v=Math.min(B+1,a-1);let u=v*r+D<<2;D=Math.min(P+1,r-1),v=Math.min(B+1,a-1);let m=v*r+D<<2,Q=~~(A*A);for(let I=0;I<Q;I++){let d=~~(I%A),F=~~(I/A),p=~~(A*P+d),b=~~(~~(A*B+F)*t+p<<2),L=d/A,M=F/A;for(let T=0;T<4;T++){let G=o[l+T]+(o[h+T]-o[l+T])*L,S=o[u+T]+(o[m+T]-o[u+T])*L;n[b+T]=G+(S-G)*M}}}return{width:t,height:i,fdata:n}}function vr(g){let A=g.width>>1,t=g.height>>1,i=new Float32Array(A*t*4),n=g.fdata!==void 0?g.fdata:g.data;for(let o=0;o<i.length;o+=4){let r=o/4,a=r%A,l=~~(r/A);i[o]=i[o+1]=i[o+2]=i[o+3]=0;for(let w=0;w<4;w++){let P=2*a+w%2,D=((2*l+~~(w/2))*g.width+P)*4;for(let v=0;v<4;v++)i[o+v]+=n[D+v]}i[o]/=4,i[o+1]/=4,i[o+2]/=4,i[o+3]/=4}return{width:A,height:t,fdata:i}}function Ji(g){let A;return g instanceof ImageData?A=new ImageData(g.width,g.height):(A={width:g.width,height:g.height,data:void 0,fdata:void 0},A.data=new Uint8Array(g.width*g.height*4),A.data.set(g.data)),g.fdata&&(A.fdata=new Float64Array(g.width*g.height*4),A.fdata.set(g.fdata)),A.data.set(g.data),A}function hr(g){let A=new Float32Array(g.width*g.height*4),t=g.fdata!==void 0?g.fdata:g.data,i=g.width,n=g.height,o=i*n*4;for(let B=0;B<o;B++)A[B]=t[B];let r=c.DEBAND_RADIUS,a=0,l=0,w=0,P=A.slice(0,A.length);for(let B=0;B<2;B++)for(let D=0;D<2;D++){let v=B,h=v?i:n;for(let u=0;u<h;u++){let m=v?n:i;a=l=w=0;for(let Q=0;Q<m+(r>>1);Q++){let I=Math.min(Q,m-1),d;v?d=(I*i+u)*4:d=(u*i+I)*4;let F=Math.min(Q-r,m-1);if(F>=0){let H;v?H=(F*i+u)*4:H=(u*i+F)*4,a-=P[H],l-=P[H+1],w-=P[H+2]}a+=P[d],l+=P[d+1],w+=P[d+2];let p=Math.min(I,r>>1);F=Math.min(Q-p,m-1);{let H;v?H=(F*i+u)*4:H=(u*i+F)*4;let b=Math.min(Q+1,r),L=1;A[H]+=(a/b-A[H])*L,A[H+1]+=(l/b-A[H+1])*L,A[H+2]+=(w/b-A[H+2])*L}}}for(let u=0;u<A.length;u++)P[u]=A[u]}return{width:g.width,height:g.height,fdata:A}}var Xi=Math.min,Ri=Math.max;var Cs=Math.fract,ds=Math.tend;var At=1/255;var dt=new nA(()=>[0,0,0,0],512);function Vi(g,A,t,i,n,o){let r=o?window._appstate.bluenoise.dvimage:window._appstate.image.data,a,l=r.width/r.height;g=g*.5+.5,A=A*.5+.5;let w=c.SHARPEN_LUMINENCE&&VA===Ut;g=Xi(Ri(g,0),.99999999),A=Xi(Ri(A,0),.99999999),l>1?A*=l:g/=l,c.NO_IMAGE_FILTER&&(n=1);let P=r.fdata?r.fdata:r.data;if(n){let L=~~(g*r.width),M=~~(A*r.height);if(a=dt.next(),L<0||M<0||L>=r.width||M>=r.height)return a[0]=a[1]=a[2]=a[3]=-1,a;let T=~~((M*r.width+L)*4);return P[T+3]*At<.05?(a[0]=a[1]=a[2]=a[3]=-1,a):(a[0]=P[T]*At,a[1]=P[T+1]*At,a[2]=P[T+2]*At,a[3]=P[T+3]*At,c.TONE_CURVE!==void 0&&(a[0]=c.TONE_CURVE.evaluate(a[0]),a[1]=c.TONE_CURVE.evaluate(a[1]),a[2]=c.TONE_CURVE.evaluate(a[2])),a)}let B=r.width/window._appstate.bluenoise.gridsize,D=r.height/window._appstate.bluenoise.gridsize,v=Math.max(B*.5,D*.5)*1.5+2;isNaN(v)&&console.log("EEEK! 'filter' was NaN in sampler!",r.width,r.height,window._appstate.bluenoise.gridsize);let h=Math.ceil(v);h=Math.max(h,4),n?(h=1,v=1):c.SHARPEN||(h=1,v=1);let u=h*h,m=0,Q=0,I=0,d=0,F=0;window._totsample=u;let p=IA.get_sharpen_filter(h,c.SHARPNESS),H;w&&(H=IA.get_sharpen_filter(h,.45));for(var b=0;b<u;b++){let L=h===1?1:h-1,M=b%h/L,T=~~(b/h)/L;M-=.5,T-=.5;let G=p[b];M*=v*(1/r.width),T*=v*(1/r.height);let S=g+M,j=A+T;S=Math.min(Math.max(S,0),.99999),j=Math.min(Math.max(j,0),.99999),m++;let Z=~~(S*r.width),U=(~~(j*r.height)*r.width+Z)*4,_=P[U]/255,fA=P[U+1]/255,vA=P[U+2]/255,hA=1-P[U+3]/255;if(c.TONE_CURVE!==void 0&&(_=c.TONE_CURVE.evaluate(_),fA=c.TONE_CURVE.evaluate(fA),vA=c.TONE_CURVE.evaluate(vA)),_*=1-hA,c.USE_LAB||(fA*=1-hA,vA*=1-hA),hA>.05)return a=dt.next(),a[0]=-1,a;u===1&&(G=1);let sA=w?H[b]:G;Q+=_*G,I+=fA*sA,d+=vA*sA,F+=hA*sA}return m?(a=dt.next(),a[0]=Math.min(Math.max(Q,0),1),a[1]=Math.min(Math.max(I,0),1),a[2]=Math.min(Math.max(d,0),1),a[3]=Math.min(Math.max(F,0),1),a):(a=dt.next(),a[0]=-1,a)}var cr=new nA(function(){return[0,0]},256);function _i(g,A,t){let i=cr.next(),n=Math.sin(t),o=Math.cos(t);return i[0]=o*g-n*A,i[1]=o*A+n*g,i}window.rot=_i;var Zt=class{constructor(){this.x=this.y=this.offx=this.offy=this.ix=this.iy=0}load(A,t,i,n,o,r){return this.x=A,this.y=t,this.ix=i,this.iy=n,this.offx=o,this.offy=r,this}},Qt=class{constructor(){this.points=[],this.inner_loop_cachering=nA.fromConstructor(Zt,64),this.errgrid=void 0,this.mask=void 0,this.filter=zi(),this.cur=0,this.gridsize=this.celldim=void 0,this.sampler=void 0,this.r=this.start_r=void 0}step_b(A,t){let i=this.raster_image;if(this.sampler===void 0&&console.log("image hasn't loaded yet"),this.mask===void 0){console.log("mask hasn't loaded yet");return}let n=this.errgrid,o=this.gridsize,r=c.DIMEN,a=c.DIMEN,l=A||c.STEPS,w=this.mask.width,P=this.mask.height;if(this.mask.data===void 0){console.log("WARNING: mask failed to load");return}let B=this.mask.data.data,D=c.SMALL_MASK?1:4,v=[.5,.5,.5],h=[.5,.5,.5],u=this.filter,m=this.points,Q=this.start_r,I=Math.sqrt(3),d=[0,0,0],F=0,p=c.RASTER_MODE===pA.CMYK,H=[0,0],b=[0,0,0,0,0];if(i===void 0||i.data===void 0)return;let L=i.data;for(let M=0;M<l;M++,this.cur++){if(this.cur>=o*o){console.log("Done.");break}let T=this.cur%o,G=~~(this.cur/o),S=T,j=G,Z=~~(T*D%w+.5),R=~~(G*D%P+.5);T/=o,G/=o;let U=this.sampler((T-.5)*2,(G-.5)*2,o,1);if(U[0]<0)continue;v[0]=U[0],v[1]=U[1],v[2]=U[2],U=v;let _=~~(T*i.width*.99999),vA=(~~(G*i.height*.99999)*i.width+_)*4,hA=this.calcIntensity(U[0],U[1],U[2]),sA=0,$=0,C=0,z=0,y=0,Y=0,eA,J;for(let uA=0;uA<D*D;uA++){let tA=uA%D,xA=~~(uA/D);eA=(Z+tA)%w,J=(R+xA)%P;let AA=(J*w+eA)*4;eA=(Z+3+tA)%w,J=(R+xA)%P;let zA=(J*w+eA)*4;eA=(Z+3+tA)%w,J=(R+3+xA)%P;let NA=(J*w+eA)*4;B[AA]>1&&(sA+=B[AA]/255,z+=1),B[zA]>1&&($+=B[zA]/255,y+=1),B[NA]>1&&(C+=B[NA]/255,Y+=1)}if(sA=z?sA/z:sA,$=y?$/y:$,C=Y?C/Y:C,isNaN(sA))throw new Error("NaN!");let V=0,iA=!1,PA;if(iA?PA=Ve(U[0],U[1],U[2]):(PA=h,PA[0]=U[0]*.9,PA[1]=U[1]*.9,PA[2]=U[2]*1.1,U[0]=PA[0],U[1]=PA[1],U[2]=PA[2]),c.DITHER_COLORS){let uA=Gt(U[0],U[1],U[2]),tA=Ii(uA[0],1,uA[2]),xA=tA[0]*.4+tA[1]*.6+tA[2]*.2;b.length=5;let AA=ue(tA,b,0,!0);AA===void 0&&(AA=0);let zA=N[AA],NA=zA[0]-tA[0],FA=zA[1]-tA[1],ce=zA[2]-tA[2],oA=NA*NA+FA*FA+ce*ce;oA=oA!==0?Math.sqrt(oA):0,oA=Math.sqrt(Nt(tA,zA));for(let BA=0;BA<b.length;BA++)if(b[BA]===void 0){b.length=BA;break}let wA=Math.pow(sA,1);wA=Math.pow(wA,1)/4,wA*=1+oA*oA*7*xA,wA=Math.min(Math.max(wA,0),1);let TA=~~(wA*b.length*.999999);AA=b[TA];let cA=1-uA[1];uA[2]*cA>sA&&(AA=0);for(let BA=0;BA<3;BA++)U[BA]=N[AA][BA]}else{let uA=ue(U,b,0,!0),tA=N[uA],xA=Li(U,tA),AA=N.length/8+4;AA=5,window._l!==void 0&&(AA=window._l),sA=1-sA,sA=~~(sA*AA)/AA,V=sA*(window._f!==void 0?window._f:1),V=(Math.fract(V)-.5)*2/AA*(window._f2!==void 0?window._f2:1),U[0]+=V,U[1]+=V,U[2]+=V,uA=ue(U,b,0,!0);let zA=Gt(U[0],U[1],U[2]),NA=1-zA[1];(uA===void 0||zA[2]*NA>sA)&&(uA=0);for(let FA=0;FA<3;FA++)U[FA]=N[uA][FA]}L[vA]=~~(U[0]*255),L[vA+1]=~~(U[1]*255),L[vA+2]=~~(U[2]*255),L[vA+3]=255}}_inner_loop(A,t){let i=A.x,n=A.y,o=A.ix,r=A.iy,a=A.offx,l=A.offy,w=this.points,P=this.raster_image,B=this.gridsize,D=c.DIMEN,v=c.DIMEN,h=D,u=v,m=this.start_r,Q=new Array(16);if(this.sampler===void 0){console.log("image hasn't loaded yet");return}let I=Math.sqrt(3),d=this.sampler(i,n,B,1);if(d[0]<0)return;let F=this.calcIntensity(d[0],d[1],d[2]),p=ye(d[0],d[1],d[2]);c.ADAPTIVE_COLOR_DENSITY&&(F*=Math.pow(1-p,2)),window._f===void 0&&(window._f=0),F=Math.min(Math.max(F,0),.99999);let H=F;F=c.MAKE_NOISE?.65:F;let b=t(F,d,i,n),L=b[3],M=F;if(F=b[2],i=b[0],n=b[1],F=b[2],!(1-F>=L))return;if(L=Math.min(Math.max(L,0),.99999),isNaN(L))throw new Error("NaN");c.DITHER_BLUE&&Je.seed(this.getPixelSeed(1-L));let G;if(c.DITHER_COLORS){let j=c.DITHER_RAND_FAC*Math.random();G=ue(d,void 0,0);let Z=N[G],R=le(d,Z);G=ue(d,void 0,R)}else G=ge(d);let S=w.length;for(let j=0;j<O;j++)w.push(0);if(c.GRID_MODE){let j=B*4,Z=Math.floor(i*j*.5+.5),R=Math.floor(n*j*.5+.5);i=Z*2/j,n=R*2/j}return w[S]=i,w[S+1]=n,w[S+Ce]=m,w[S+te]=H,w[S+ie]=G,w[S+mA]=-1,w[S+fe]=w[S+Re]=w[S],w[S+oe]=w[S+Oe]=w[S+1],this.calc_theta(S),S}step_smask(A){let t=this.inner_loop_cachering.next(),i=this.points,n=this.raster_image,o=A||c.STEPS,r=this.gridsize,a=this.smask,l=c.DIMEN,w=c.DIMEN,P=l,B=w,D=this.start_r;if(this.sampler===void 0){console.log("image hasn't loaded yet");return}if(a===void 0){console.log("mask hasn't loaded yet");return}let v=Math.sqrt(3),h=Math.ceil(r/a.blocksize),u=r/a.blocksize;o=Math.ceil(o/a.blocksize/a.blocksize);let m=[0,0,0,0,0],Q,I,d,F=a;function p(H,b,L,M){if(H=F.evalInverseTone(H),c.SPECIAL_OFFSETS){let T=Q.evaluate(1-H);L=T[0],M=T[1],L=L/u+I/u,M=M/u+d/u,L=L*2-1,M=M*2-1}return m[0]=L,m[1]=M,m[2]=H,m[3]=Q.gen,m[4]=F.evalInverseTone(Q.gen),m}for(let H=0;H<o;H++,this.cur++){if(this.cur>=h*h){console.log("Done.");break}I=this.cur%h,d=~~(this.cur/h);for(Q of a.points){let b=Q.startx,L=Q.starty;b=b/u+I/u,L=L/u+d/u,b=b*2-1,L=L*2-1,!(b<-1||L<-1||b>=1||L>=1)&&(t.load(b,L,I,d,0,0),this._inner_loop(t,p))}}console.log("points",i.length/O),console.log(`
`),this.calc_derivatives(),c.TRI_MODE?(console.log("regenerating triangulation..."),this.del()):c.SCALE_POINTS&&this.calc_radii()}getPixelSeed(A){return A=A**.5,~~(A*c.DITHER_BLUE_STEPS)}calcIntensity(A,t,i){let n=Ye(A,t,i);return c.DENSITY_CURVE!==void 0&&(n=c.DENSITY_CURVE.evaluate(n)),c.BLACK_BG?n=1-n**.5:n*=n**.25,n}step_diffusion(A,t){console.log("Step Diffusion");let i=A===void 0?c.STEPS:A,n=this.raster_image,o=n!==void 0?n.data:void 0;this.sampler===void 0&&console.log("image hasn't loaded yet");let r=this.errgrid,a=this.gridsize,l=c.DIMEN,w=c.DIMEN,P,B,D=new Array(N.length),v=new Array(N.length),h=new Array(N.length),u=N,m=N.length,Q=[.5,.5,.5],I=this.filter,d=this.points,F=this.start_r,p=I.get(0),H=Math.sqrt(3),b=0,L=c.RASTER_MODE===pA.CMYK,M=[0,0],T=[0,0,0,0,0];for(let Z=0;Z<i;Z++,t++){let zA=function(oA,wA,TA,cA,BA,jA){if(n===void 0||o===void 0)return;let dA=~~(oA/2),aA=~~(wA/2),qA=~~(oA-dA),ne=~~(wA-aA),KA=IA.get_searchoff(1),RA=(aA*n.width+dA)*4,gA=1;RA+=qA%3,o[RA]=0},NA=function(oA,wA,TA,cA,BA,jA,dA){let aA=1-TA;cA===BA&&cA===jA&&(aA=TA),aA*=.5,FA(oA,wA,TA,cA,BA,jA,dA,.85),c.RASTER_MODE===pA.CMYK&&(aA=.1,FA(oA-1,wA,TA,cA,BA,jA,dA,aA),FA(oA,wA+1,TA,cA,BA,jA,dA,aA),FA(oA+1,wA,TA,cA,BA,jA,dA,aA),FA(oA,wA-1,TA,cA,BA,jA,dA,aA))},FA=function(oA,wA,TA,cA,BA,jA,dA,aA){if(n===void 0||o===void 0)return;aA=aA===void 0?1:aA;let qA=~~(AA*.25);qA=0;let ne=IA.get_spotfunc(qA,TA);if(qA===0){let HA=(wA*n.width+oA)*4;o[HA]=Math.max(o[HA]-cA*aA,0),o[HA+1]=Math.max(o[HA+1]-BA*aA,0),o[HA+2]=Math.max(o[HA+2]-jA*aA,0),o[HA+3]=255;return}for(let HA=0;HA<ne.length;HA++){let KA=oA+ne[HA][0],RA=wA+ne[HA][1];if(KA<0||RA<0||KA>=n.width||RA>=n.height)continue;let gA=(RA*n.width+KA)*4;o[gA]=Math.max(o[gA]-cA*aA,0),o[gA+1]=Math.max(o[gA+1]-BA*aA,0),o[gA+2]=Math.max(o[gA+2]-jA*aA,0),o[gA+3]=255}};var G=zA,S=NA,j=FA;if(t>=a*a){console.log("Done.");break}let R=t%a,U=~~(t/a),_=U%2===0;_&&(R=a-R-1);let fA=R,vA=U,hA=R,sA=U;R/=a,U/=a,R=(R-.5)*2,U=(U-.5)*2;let $=this.sampler(R,U,a,1);if($[0]<0)continue;let C=this.calcIntensity($[0],$[1],$[2]),z=Math.abs(1-$[0])+Math.abs(1-$[1])+Math.abs(1-$[2]);z/=3,c.ADAPTIVE_COLOR_DENSITY&&(C*=Math.pow(1-z,2));let y=C,Y=0,eA=0,J=0,V=0,iA=0,PA=$[0],uA=$[1],tA=$[2],xA=ge($),AA=n!==void 0?~~Math.ceil(n.width/this.dimen):1;if(Q[0]=$[0],Q[1]=$[1],Q[2]=$[2],c.DITHER_COLORS){let oA=~~((sA*a+hA)*3);Q[0]+=r[oA],Q[1]+=r[oA+1],Q[2]+=r[oA+2],xA=ge(Q),Ke[xA]++;let wA=N[xA],TA=Q[0]-wA[0],cA=Q[1]-wA[1],BA=Q[2]-wA[2],jA=Math.abs(1-$[0])+Math.abs(1-$[1])+Math.abs(1-$[2]);if(jA/=3,c.CORRECT_FOR_SPACING){let dA=ye($[0],$[1],$[2]),aA=Math.pow(1-C,.5);aA=1-C*C*dA,TA*=aA,cA*=aA,BA*=aA}for(let dA=0;dA<p.length;dA++)for(let aA=0;aA<p[dA].length;aA++){let qA=dA,ne=aA-2,HA=hA+(_?-ne:ne),KA=sA+qA;if(HA>=a||KA>=a||HA<0||KA<0)continue;let RA=this.filter.wrand*(this.random()-.5);RA+=(this.random()-.5)*.05;let gA=(KA*a+HA)*3;r[gA]+=p[dA][aA]*TA+RA,r[gA+1]+=p[dA][aA]*cA+RA,r[gA+2]+=p[dA][aA]*BA+RA,r[gA]=Math.min(Math.max(r[gA],-1),1),r[gA+1]=Math.min(Math.max(r[gA+1],-1),1),r[gA+2]=Math.min(Math.max(r[gA+2],-1),1)}}else{xA===void 0&&(xA=ge($));let oA=N[xA];if(oA===void 0)throw console.log(xA),new Error("eek!");Q[0]=oA[0],Q[1]=oA[1],Q[2]=oA[2];let wA=Math.abs(1-oA[0])+Math.abs(1-oA[1])+Math.abs(1-oA[2]);wA/=3}if(c.RASTER_IMAGE&&o!==void 0&&n!==void 0&&o!==void 0){let oA=N[xA],wA=~~((R*.5+.5001)*n.width*.99999),cA=(~~((U*.5+.5001)*n.height*.99999)*n.width+wA)*4;o[cA]=~~(oA[0]*255),o[cA+1]=~~(oA[1]*255),o[cA+2]=~~(oA[2]*255),o[cA+3]=255}}return t}colordiffuse(){let A=this.points,t=this.calc_kdtree(),i=this.gridsize,n,o,r,a,l,w,P=new Float64Array(4*A.length/O),B=new Float64Array(4*A.length/O);P.fill(0,0,P.length);for(let u=0;u<A.length;u+=O){let m=A[u],Q=A[u+1],I=u/O*4,d=this.sampler(m,Q,i,1);(isNaN(d[0])||isNaN(d[1])||isNaN(d[2]))&&(console.log("NaN in sampler!"),d[0]=d[1]=d[2]=d[3]=1),d[0]<0&&(d[0]=d[1]=d[2]=0);for(let F=0;F<4;F++)B[I+F]=d[F]}let D=7/Math.sqrt(A.length/O+1),v=u=>{if(u===n)return;let m=A[u],Q=A[u+1],I=A[u+ie],d=A[u+mA],F=A[u+ZA],p=m-o,H=Q-r,b=p*p+H*H;if(b>=D*D)return;b=Math.sqrt(b);let L=1-b/D;if(isNaN(L))throw console.log(b,p,H,o,r,m,Q),new Error("nan!");L=L*L*(3-2*L);let M=4*n/O,T=4*u/O;for(let G=0;G<3;G++){if(isNaN(P[M+G]))throw console.log(P,M,G),new Error("NaN!");if(isNaN(L)||isNaN(P[M+G]))throw console.log(P,M,G,L),new Error("NaN again!");B[T+G]+=-P[M+G]*L}};for(n=0;n<A.length;n+=O){o=A[n],r=A[n+1],a=A[n+ie],w=A[n+mA],l=A[n+ZA];let u=n/O*4,m=N[a];for(let Q=0;Q<3;Q++){if(isNaN(m[Q]))throw console.log(m,a),new Error("nan!");if(isNaN(B[u+Q]))throw console.log(B,u,Q),new Error("nan!!");P[u+Q]=B[u+Q]-m[Q]}t.forEachPoint(o,r,D,v)}let h=[0,0,0,1];for(n=0;n<A.length;n+=O){let u=n/O*4;for(let Q=0;Q<4;Q++)h[Q]=B[u+Q];let m=ge(h);A[n+ie]=m}console.log("done")}step_cmyk_color_mask(A,t){if(this.mask===void 0||this.mask.data===void 0){console.log("WARNING: mask failed to load");return}let i=this.mask.width,n=this.mask.data.data,o=this.points,r=A||c.STEPS,a=this.mask.width,l=this.mask.height,w,P,B=this.gridsize,D=c.DIMEN,v=c.DIMEN,h=this.raster_image,u=h!==void 0?h.data:void 0;if(h===void 0||u===void 0){console.log("WARNING: raster image not set");return}let m=c.SMALL_MASK?1:c.XLARGE_MASK?8:4,Q=h!==void 0?~~Math.ceil(h.width/this.dimen):1;function I(p,H,b,L,M,T){if(h===void 0||u===void 0)return;let G=~~(p/2),S=~~(H/2),j=~~(p-G),Z=~~(H-S),U=IA.get_searchoff(1),_=(S*h.width+G)*4,fA=1;_+=j%3,u[_]=0}function d(p,H,b,L,M,T,G){let S=1-b;L===M&&L===T&&(S=b),S*=.5,F(p,H,b,L,M,T,G,.4),S=.1,F(p-1,H,b,L,M,T,G,S),F(p,H+1,b,L,M,T,G,S),F(p+1,H,b,L,M,T,G,S),F(p,H-1,b,L,M,T,G,S)}function F(p,H,b,L,M,T,G,S){if(h===void 0||u===void 0)return;S=S===void 0?1:S;let j=~~(Q*.25);j=0;let Z=IA.get_spotfunc(j,b);if(j===0){let R=(H*h.width+p)*4;u[R]=Math.max(u[R]-L*S,0),u[R+1]=Math.max(u[R+1]-M*S,0),u[R+2]=Math.max(u[R+2]-T*S,0),u[R+3]=255;return}for(let R=0;R<Z.length;R++){let U=p+Z[R][0],_=H+Z[R][1];if(U<0||_<0||U>=h.width||_>=h.height)continue;let fA=(_*h.width+U)*4;u[fA]=Math.max(u[fA]-L*S,0),u[fA+1]=Math.max(u[fA+1]-M*S,0),u[fA+2]=Math.max(u[fA+2]-T*S,0),u[fA+3]=255}}for(let p=0;p<r;p++,this.cur++){if(this.cur>=B*B){console.log("Done.");break}let H=this.cur%B,b=~~(this.cur/B),L=b%2===0;L&&(H=B-H-1);let M=H,T=b;w=~~(H*m%a+.5),P=~~(b*m%l+.5);let G=H,S=b;H/=B,b/=B,H=(H-.5)*2,b=(b-.5)*2;let j=this.sampler(H,b,B,1);if(j[0]<0)continue;let Z=this.calcIntensity(j[0],j[1],j[2]),R=Math.abs(1-j[0])+Math.abs(1-j[1])+Math.abs(1-j[2]);R/=3,c.ADAPTIVE_COLOR_DENSITY&&(Z*=Math.pow(1-R,2));let U=Z;Z=c.MAKE_NOISE?.65:Z;let _=j[0],fA=j[1],vA=j[2],hA=St(j[0],j[1],j[2]);_=hA[0],fA=hA[1],vA=hA[2];let sA=this.cur%B,$=~~(this.cur/B);L&&(sA=B-sA-1);let C=~~(h.width*sA/B),z=~~(h.height*$/B),y=(z*h.width+C)*4;for(let Y=0;Y<4;Y++){let eA=~~(i/2),J=Y%2,V=~~(Y/2);J*=eA,V*=eA;let iA=sA%eA,PA=$%eA;iA=~~(iA+J),PA=~~(PA+V);let uA=(PA*i+iA)*4;if(!(hA[Y]*255<n[uA])){switch(Y){case 0:d(C,z,1,255,0,0,0);break;case 1:d(C,z,1,0,255,0,0);break;case 2:d(C,z,1,0,0,255,0);break;case 3:d(C,z,1,255,255,255,255);break}u[y+3]=255}}}t||(console.log("points",o.length/O),console.log(`
`)),c.TRI_MODE&&!t?(console.log("regenerating triangulation..."),this.del()):c.SCALE_POINTS&&!t&&this.calc_radii()}step(A,t){if(c.RASTER_IMAGE&&c.RASTER_MODE===pA.PATTERN){this.step_b(),this.calc_derivatives();return}if(c.RASTER_IMAGE&&c.RASTER_MODE===pA.CMYK&&c.USE_CMYK_MASK){this.step_cmyk_color_mask(),this.calc_derivatives();return}if(c.RASTER_IMAGE&&c.RASTER_MODE===pA.DIFFUSION){this.cur=this.step_diffusion(A,this.cur),this.calc_derivatives();return}else if(this.smask!==void 0){this.step_smask(A);return}this.r=1;let i=this.raster_image,n=i!==void 0?i.data:void 0;if(this.sampler===void 0&&console.log("image hasn't loaded yet"),this.mask===void 0){console.log("mask hasn't loaded yet");return}let o=this.errgrid,r=this.gridsize,a=c.DIMEN,l=c.DIMEN,w=A||c.STEPS,P=this.mask.width,B=this.mask.height;if(this.mask.data===void 0){console.log("WARNING: mask failed to load");return}let D=this.mask.data.data,v=c.SMALL_MASK?1:c.XLARGE_MASK?8:4,h,u,m=new Array(N.length),Q=new Array(N.length),I=new Array(N.length),d=N,F=N.length,p=[.5,.5,.5],H=this.filter,b=this.points,L=this.start_r,M=H.get(H),T=Math.sqrt(3),G=0,S=c.RASTER_MODE===pA.CMYK,j=[0,0],Z=[0,0,0,0,0],R,U;function _(sA,$,C,z,y){let Y=_i(sA,$,y);return R=~~Y[0]+C,U=~~Y[1]+z,R=R%P,U=U%P,R<0&&(R+=P),U<0&&(U+=P),j[0]=R,j[1]=U,j}for(let sA=0;sA<w;sA++,this.cur++){let gn=function(K,rA,MA,EA,QA,GA){if(i===void 0||n===void 0)return;let CA=~~(K/2),lA=~~(rA/2),UA=~~(K-CA),WA=~~(rA-lA),SA=IA.get_searchoff(1),XA=(lA*i.width+CA)*4,bA=1;XA+=UA%3,n[XA]=0},Ne=function(K,rA,MA,EA,QA,GA,CA){let lA=1-MA;EA===QA&&EA===GA&&(lA=MA),lA*=.5,Le(K,rA,MA,EA,QA,GA,CA,.4),c.RASTER_MODE===pA.CMYK&&(lA=.1,Le(K-1,rA,MA,EA,QA,GA,CA,lA),Le(K,rA+1,MA,EA,QA,GA,CA,lA),Le(K+1,rA,MA,EA,QA,GA,CA,lA),Le(K,rA-1,MA,EA,QA,GA,CA,lA))},Le=function(K,rA,MA,EA,QA,GA,CA,lA){if(i===void 0||n===void 0)return;lA=lA===void 0?1:lA;let UA=~~(ln*.25);UA=0;let WA=IA.get_spotfunc(UA,MA);if(UA===0){let LA=(rA*i.width+K)*4;n[LA]=Math.max(n[LA]-EA*lA,0),n[LA+1]=Math.max(n[LA+1]-QA*lA,0),n[LA+2]=Math.max(n[LA+2]-GA*lA,0),n[LA+3]=255;return}for(let LA=0;LA<WA.length;LA++){let SA=K+WA[LA][0],XA=rA+WA[LA][1];if(SA<0||XA<0||SA>=i.width||XA>=i.height)continue;let bA=(XA*i.width+SA)*4;n[bA]=Math.max(n[bA]-EA*lA,0),n[bA+1]=Math.max(n[bA+1]-QA*lA,0),n[bA+2]=Math.max(n[bA+2]-GA*lA,0),n[bA+3]=255}};var fA=gn,vA=Ne,hA=Le;if(this.cur>=r*r){console.log("Done.");break}let $=this.cur%r,C=~~(this.cur/r),z=C%2===0;z&&($=r-$-1);let y=$,Y=C;h=~~($*v%P+.5),u=~~(C*v%B+.5);let eA=$,J=C;$/=r,C/=r,$=($-.5)*2,C=(C-.5)*2;let V=this.sampler($,C,r,1);if(V[0]<0)continue;let iA=this.calcIntensity(V[0],V[1],V[2]),PA=Math.abs(1-V[0])+Math.abs(1-V[1])+Math.abs(1-V[2]);PA/=3,c.ADAPTIVE_COLOR_DENSITY&&(iA*=Math.pow(1-PA,2));let uA=iA;iA=c.MAKE_NOISE?.65:iA;let tA=(u*P+h)*4,xA=D[tA]/255,AA=0,zA=v,NA=0,FA=0,ce=0,oA=~~(iA*64)%3,wA=0,TA=0,cA=0,BA=0,jA=0,dA=V[0],aA=V[1],qA=V[2];if(S&&c.RASTER_IMAGE){G&&(Q=ki(V[0],V[1],V[2]));let K=St(V[0],V[1],V[2]);dA=K[0],aA=K[1],qA=K[2],iA=1-K[3],iA*=iA}let ne=1,HA=0,KA=0,RA=!1;xA=0;for(let K=0;!RA&&K<zA;K++)for(let rA=0;!RA&&rA<zA;rA++){let MA=(h+K)%P,EA=(u+rA)%B,QA=(c.SMALL_MASK,0),GA,CA,lA,UA,WA,LA;ne?(GA=P-1-(h+K+QA)%P,CA=(u+rA+QA)%B,lA=(h+K+QA)%P,UA=(u+rA)%B,LA=(h+K)%P,WA=P-1-(u+rA+QA)%B):(GA=(h+K+QA)%P,CA=(u+rA+QA)%B,UA=(h+K+QA)%P,lA=(u+rA)%B,WA=(h+K)%P,LA=(u+rA+QA)%B);let SA=~~((EA*P+MA)*4),XA=~~((CA*P+GA)*4),bA=~~((lA*P+UA)*4),xt=~~((LA*P+WA)*4);I[0]=xt,I[1]=XA,I[2]=bA,I[3]=SA;let wn=D[SA]>1||c.SMALL_MASK,Pn=D[XA]>1||c.SMALL_MASK,Bn=D[bA]>1||c.SMALL_MASK,Dn=D[xt]>1||c.SMALL_MASK,ai=wn&&iA<=D[SA]/255+NA;BA|=+ai;let re=ai;if(G)for(let pe=0;pe<F;pe++){let vn=I[pe&3];m[pe]=Q[pe]<D[vn]/255,G&&(re=re||m[pe])}let li=Dn&&1-dA<D[xt]/255,gi=Pn&&1-aA<D[XA]/255,wi=Bn&&1-qA<D[bA]/255;wA|=+li,TA|=+gi,cA|=+wi,S&&c.RASTER_IMAGE&&(re=re||li,re=re||gi,re=re||wi),re&&(AA++,HA+=(D[SA+1]/255*2-1)/P,KA+=(D[SA+2]/255*2-1)/P,jA+=D[SA]/255+NA,FA+=K/r,ce+=rA/r,xA+=D[SA]/255)}if(AA>0&&(jA/=AA,xA/=AA),c.SMALL_MASK){let K=~~(($*.5+.5)*r+.05)%P,rA=~~((C*.5+.5)*r+.05)%B;K=y%P,rA=Y%B;let MA=(rA*P+K)*4;AA=iA<=D[MA]/255+NA?1:0,S&&c.RASTER_IMAGE&&(AA=AA||iA<=D[MA+1]/255+NA?1:0,AA=AA||iA<=D[MA+2]/255+NA?1:0)}PA=0;let gA=0;if((AA||c.RASTER_IMAGE)&&(c.DITHER_COLORS?(c.DITHER_BLUE&&Je.seed(this.getPixelSeed(1-xA)),gA=ue(V)):gA=ge(V)),AA>0&&(HA/=AA,KA/=AA),!c.SMALL_MASK&&AA&&!c.GRID_MODE){FA/=AA,ce/=AA;let K=c.XLARGE_MASK?.25:.4;K=2/v,$+=FA*K,C+=ce*K}if(!c.SMALL_MASK&&c.SPECIAL_OFFSETS){let K=Math.pow(Math.max(1-iA,1e-4),3);K*=v/8,$+=HA*K,C+=KA*K}let ln=i!==void 0?~~Math.ceil(i.width/this.dimen):1;if(p[0]=V[0],p[1]=V[1],p[2]=V[2],c.DITHER_COLORS&&c.RASTER_IMAGE&&c.RASTER_MODE!==pA.CMYK){let K=~~((J*r+eA)*3);p[0]+=o[K],p[1]+=o[K+1],p[2]+=o[K+2],gA=ge(p),Ke[gA]++;let rA=N[gA],MA=p[0]-rA[0],EA=p[1]-rA[1],QA=p[2]-rA[2],GA=Math.abs(1-V[0])+Math.abs(1-V[1])+Math.abs(1-V[2]);if(GA/=3,c.CORRECT_FOR_SPACING){let CA=(V[0]+V[1]+V[2])/3,lA=Math.abs(CA-V[0])+Math.abs(CA-V[1])+Math.abs(CA-V[2]);lA/=3;let UA=Math.pow(1-iA,.5);UA=1-iA*iA*lA,MA*=UA,EA*=UA,QA*=UA}for(let CA=0;CA<M.length;CA++)for(let lA=0;lA<M[CA].length;lA++){let UA=CA,WA=lA-2,LA=eA+(z?-WA:WA),SA=J+UA;if(LA>=r||SA>=r||LA<0||SA<0)continue;let XA=this.filter.wrand*(this.random()-.5);XA+=(this.random()-.5)*.05;let bA=(SA*r+LA)*3;o[bA]+=M[CA][lA]*MA+XA,o[bA+1]+=M[CA][lA]*EA+XA,o[bA+2]+=M[CA][lA]*QA+XA,o[bA]=Math.min(Math.max(o[bA],-1),1),o[bA+1]=Math.min(Math.max(o[bA+1],-1),1),o[bA+2]=Math.min(Math.max(o[bA+2],-1),1)}}else{gA===void 0&&(gA=ge(V));let K=N[gA];K===void 0&&(console.warn("eek!",gA),gA=0,N[gA]),p[0]=K[0],p[1]=K[1],p[2]=K[2];let rA=Math.abs(1-K[0])+Math.abs(1-K[1])+Math.abs(1-K[2]);rA/=3}let oi=c.RASTER_IMAGE&&n!==void 0;if(oi&&i!==void 0&&n!==void 0&&c.RASTER_MODE===pA.DIFFUSION){let K=N[gA],rA=~~(($*.5+.5001)*i.width*.99999),EA=(~~((C*.5+.5001)*i.height*.99999)*i.width+rA)*4;n[EA]=~~(K[0]*255),n[EA+1]=~~(K[1]*255),n[EA+2]=~~(K[2]*255),n[EA+3]=255,AA=1}else if(oi&&i!==void 0&&S&&(wA||TA||cA||AA)){let K=~~(($*.5+.5001)*i.width*.99999),rA=~~((C*.5+.5001)*i.height*.99999),MA=(rA*i.width+K)*4,EA=~~(($*.5+.5001)*2*i.width*.99999),QA=~~(2*(C*.5+.5001)*i.height*.99999);cA&&Ne(K,rA,qA,0,0,255,0),wA&&Ne(K,rA,dA,255,0,0,0),TA&&Ne(K,rA,aA,0,255,0,0),BA&&Ne(K,rA,iA,255,255,255,0)}if(c.RASTER_IMAGE||!AA)continue;let OA=b.length;for(let K=0;K<O;K++)b.push(0);b[OA]=$,b[OA+1]=C,b[OA+2]=L,b[OA+te]=uA,b[OA+ie]=gA,b[OA+ZA]=oA,b[OA+mA]=-1,b[OA+fe]=b[OA+Re]=b[OA],b[OA+oe]=b[OA+Oe]=b[OA+1],this.calc_theta(OA)}t||(console.log("points",b.length/O),console.log(`
`)),this.calc_derivatives(),c.TRI_MODE&&!t?(console.log("regenerating triangulation..."),this.del()):c.SCALE_POINTS&&!t&&this.calc_radii()}init(A){let t=1.00001/c.DIMEN;t=Math.sqrt(t*t+t*t),this.r=t,this.cur=0,this.start_r=this.r,this.gridsize=A,this.errgrid=new Float64Array(A*A*3),this.errgrid.fill(0,0,this.errgrid.length),new $A("bluenoise_mask").read("data",void 0).then(i=>{let n=i;n===void 0&&(n=$e),this.load_mask(n)})}load_mask(A){if(A.startsWith("SMOOTHMASK"))A=A.slice(10,A.length),this.smask=new Ct().fromBinary(A);else{this.smask=void 0,this._mask=new Image,this._mask.src=A;let t=this;this._mask.onload=function(i){this.mask=this._mask,t.on_image_read(t._mask,"mask")}}}random(){return this._random!==void 0?this._random.random():Math.random()}reset(A){c.USE_MERSENNE?this._random=new se(0):this._random=void 0,this.raster_image=A,this.dimen=c.DIMEN,this.cur=0,this.points=[],this.errgrid.fill(0,0,this.errgrid.length),_appstate.image!==void 0&&_appstate.image.data!==void 0&&(this.sampler=Vi,this.image=_appstate.image.data,this.image.orig===void 0&&(this.image.orig=new Uint8Array(this.image.data.length),this.image.orig.set(this.image.data)),this.image.data.set(this.image.orig),this.image.fdata=this.image.fdata=new Float32Array(this.image.orig),Oi(this.image.fdata),c.HIST_EQUALIZE&&(this.image.fdata=Yi(this.image).fdata),Wt(this.image.fdata,this.image.data),this.dvimage=Ji(this.image),c.DEBAND_IMAGE?this.dvimage.fdata=Ki(this.dvimage).fdata:this.dvimage.fdata=this.image.fdata,Wt(this.dvimage.fdata,this.dvimage.data)),redraw_all()}on_image_read(A,t){console.log("got",t,"image");let i=this;if(A.width===0){console.log("Problem loading image. . .");let l=window.setInterval(function(){A.width!==0&&(window.clearInterval(l),i.on_image_read(A,t),console.log(". . .or not, image has (finally!) loaded"))},500);return}let n=document.createElement("canvas");n.width=A.width,n.height=A.height;let o=n.getContext("2d");if(o===null)return;o.drawImage(A,0,0);let r=this;if(r[t]=A,A.width===0){console.log("eek",A.width,A.height);return}let a=o.getImageData(0,0,A.width,A.height);r[t].data=a}calc_kdtree(A){console.log("building kdtree. . .");let t=this.points,i=this.kdtree2=new ut([-2,-2,-2],[2,2,2]),n={},o=0;for(;o<t.length/O;){let r=~~(Math.random()*t.length/O*.9999999)*O;if(r in n)continue;n[r]=1,o++;let a=t[r],l=t[r+1];A&&(a=t[r+fe],l=t[r+oe]),i.insert(a,l,r)}return i}calc_theta(A){let t=this.points,i=_appstate.image.width,n=t[A],o=t[A+1],r=0,a=0;for(let l=0;l<1;l++){let w=8/i;if(l){let h=Math.sqrt(r*r+a*a)/Math.sqrt(2);h>.8,h=1-h,h=Math.pow(h,4);let u=Math.pow(4,l),m=Math.pow(4,l+1);w=(u+(m-u)*h)/i}let P=this.sampler(n,o,this.gridsize,1,void 0,!0);if(P[0]<0)return;let B=this.calcIntensity(P[0],P[1],P[2]);P=this.sampler(n+w,o,this.gridsize,1,void 0,!0);let D=this.calcIntensity(P[0],P[1],P[2]);P=this.sampler(n,o+w,this.gridsize,1,void 0,!0);let v=this.calcIntensity(P[0],P[1],P[2]);r=(D-B)/w,a=(v-B)/w}t[A+ke]=-Math.atan2(a,r)}calc_thetas(){let A=this.points,t=_appstate.image.width;for(let i=0;i<A.length;i+=O)this.calc_theta(i)}calc_radii_old(A){let t=this.points,i=this.calc_kdtree(!0),n=0,o=1,r=this.dimen;for(let T=0;T<t.length;T+=O);for(let T=0;T<t.length;T+=O){let G,S;A?(G=t[T+fe],S=t[T+oe]):(G=t[T],S=t[T+1])}let a=1/(this.dimen*Math.sqrt(2)),l=1e17,w,P,B,D,v,h,u,m,Q,I,d=-1,F=a*10;console.log("maxrad",F,a);let p=~~(F*r+2),H=IA.get_searchoff(p),b=Math.min,L=Math.max;console.log("rd",p,a,H.length);function M(T){if(T===d)return;let G=t[T+fe],S=t[T+oe],j=G-v,Z=S-h,R=j*j+Z*Z;R=R!==0?Math.sqrt(R):0;let U=L(1-R/F,0);U*=U*U,B=b(R,B),D=L(R,D),l=b(R,l),P+=R*U,w+=U}for(let T=0;T<t.length;T+=O){let G=t[T+fe],S=t[T+oe];if(t[T+mA]!==-1)continue;if(u=(G*.5+.5)*r+1e-4,m=(S*.5+.5)*r+1e-4,v=G,h=S,Q=u,I=m,B=1e17,D=-1e17,P=0,w=0,i.forEachPoint(G,S,F,M,this),w===0){t[T+mA]=a*4;continue}if(P/=w,isNaN(w)||isNaN(P))throw console.log(P,w,G,S,F),new Error("NaN!");let j=P*.5;t[T+mA]=j}this.minr=l,console.log("MINR2",this.minr)}del(){this.tris=[],this.calc_radii();let A=[],t=this.points;for(let P=0;P<t.length;P+=O)A.push([t[P],t[P+1]]);let i=Delaunay.triangulate(A);this.tris=i;let n=this.points.length/O,o=this.vcells=new Float64Array(n*c.MAX_VCELL_SIZE);o.fill(-1,0,o.length);for(let P=0;P<i.length;P+=3)for(let B=0;B<3;B++){let D=i[P+B],v=i[P+(B+1)%3],h=i[P+(B+2)%3],u=D*c.MAX_VCELL_SIZE,m=0,Q=0;for(Q=0;Q<c.MAX_VCELL_SIZE;Q++,u++)if(o[u]===v){m=1;break}else if(o[u]===-1)break;m||Q>=c.MAX_VCELL_SIZE||(o[u]=v)}let r=new Float64Array(c.MAX_VCELL_SIZE),a,l;function w(P,B){if(P===-1)return 1;if(B===-1)return-1;let D=Math.atan2(t[P*O+1]-l,t[P*O]-a),v=Math.atan2(t[B*O+1]-l,t[B*O]-a);return D-v}for(let P=0;P<o.length;P+=c.MAX_VCELL_SIZE){let B=P/c.MAX_VCELL_SIZE;a=t[B*O],l=t[B*O+1];for(let D=0;D<c.MAX_VCELL_SIZE;D++)r[D]=o[P+D];r.sort(w);for(let D=0;D<c.MAX_VCELL_SIZE;D++)o[P+D]=r[D]}console.log("total tris:",i.length/3)}getMaskPoints(){let A=[];if(this.smask){for(let t of this.smask.points){let i=A.length;for(let o=0;o<O;o++)A.push(0);let n=t.evaluate(t.gen);A[i]=n[0],A[i+1]=n[1],A[i+ZA]=t.gen}return A}else{if(this.mask===void 0||this.mask.data===void 0)return console.warn("Mask hasn't loaded yet"),[];let t=[],i=this.mask.width,n=this.mask.data.data,o=i*i;for(let r=0;r<o;r++){let a=r%i,l=~~(r/i),w=a/i,P=l/i,B=(l*i+a)*4;if(!c.SMALL_MASK&&n[B]===0)continue;let D=t.length;for(let v=0;v<O;v++)t.push(0);t[D]=w,t[D+1]=P,t[D+ZA]=1-n[B]/255}return t}}getMaskCDF(){let A=new Float64Array(1024),t=this.getMaskPoints();A.fill(0,0,A.length);for(let i=0;i<t.length;i+=O){let o=~~(t[i+ZA]*A.length*.999999);A[o]++}for(let i=1;i<A.length;i++)A[i]=A[i-1]+A[i];return A}calc_radii(){console.log("updating radii");let A=this.getMaskCDF(),t;this.smask!==void 0?t=this.smask.blocksize:c.SMALL_MASK?t=this.mask.width:(t=this.mask.width,t=c.XLARGE_MASK?t/8:t/4);let i=t/this.dimen,n=this.dimen,o=this.points,r=Math.sqrt(3),a=.85,l=A[0];for(let B=0;B<A.length;B++)if(A[B]!==0){l=A[B];break}let w=a/Math.sqrt(A[A.length-1]+1)*i,P=a/Math.sqrt(l+t*.005)*i;for(let B=0;B<o.length;B+=O){let D;D=o[B+te],D=1-D,D=Math.min(Math.max(D,0),1)*.999999;let v=~~(D*A.length),h=A[v],u=2*a/Math.sqrt(h+t*.005)*i;o[B+mA]=u}return P}calc_derivatives(){console.log("updating point derivatives with respect to the image");let A=this.dimen,t=_appstate.image.width,i=this.points;for(let n=0;n<i.length;n+=O){let o=i[n],r=i[n+1],a=this.sampler(o,r,this.gridsize,1,void 0,!0);if(i[n+de]!==0||i[n+Qe]!==0||a[0]<0)continue;let l=(a[0]+a[1]+a[2])/3,w=5/t;a=this.sampler(o+w,r,this.gridsize,1,void 0,!0);let P=(a[0]+a[1]+a[2])/3;a=this.sampler(o,r+w,this.gridsize,1,void 0,!0);let B=(a[0]+a[1]+a[2])/3,D=P-l,v=B-l;i[n+te]=l,i[n+de]=D/w,i[n+Qe]=v/w}}relax2(){let A=this.dimen,t=this.points,n=2.5/(Math.sqrt(2)*this.dimen)*6,o=0,r=0,a=0,l=0,w=0,P=0,B=0,D=0,v=this.calc_kdtree(),h=c.ANIS_W1,u=c.ANIS_W2,m=[0,0,0],Q=c.ANISOTROPY?c.ANISOTROPY_FILTERWID:c.FILTERWID,I=Math.sqrt(3);n=this.calc_radii();let d=_appstate.image.width;this.calc_derivatives();function F(H,b){let L=t[H],M=t[H+1],T=t[b],G=t[b+1],S=t[H+ZA],j=t[b+ZA],Z=t[H+mA],R=t[b+mA];if(c.ANISOTROPY){let U=L-T,_=M-G,fA=Math.sqrt(U*U+_*_),vA=t[H+de],hA=t[H+Qe],sA=t[b+de],$=t[b+Qe];U=T-L,_=G-M,vA=Math.sin(t[H+ke]+c.STICK_ROT/180*Math.PI+Math.PI*.5),hA=Math.cos(t[H+ke]+c.STICK_ROT/180*Math.PI+Math.PI*.5),fA=Math.abs(U*hA-_*vA);let C=Math.sqrt(U*U+_*_);return fA*h+C*u}else{let U=L-T,_=M-G;return Math.sqrt(U*U+_*_)}}let p=H=>{let b=t[H],L=t[H+1],M=t[H+mA],T=b-l,G=L-w;if(isNaN(T)||isNaN(G))throw new Error("nan!");let S=F(B,H);if(S===0||S>D)return;let j=1-S/D;c.USE_SPH_CURVE&&c.SPH_CURVE!==void 0?j=c.SPH_CURVE.evaluate(j):j=Math.exp(-((j-1)**2)/(2*.37**2));let Z=P+M;T*=(Z-S)/S,G*=(Z-S)/S,o+=-T*j,r+=-G*j,a+=j};for(console.log("relaxing (sph). . ."),B=0;B<t.length;B+=O){if(l=t[B],w=t[B+1],P=t[B+mA],D=P*Q,o=r=a=0,m[0]=l,m[1]=w,v.search(m,D,p),a===0)continue;o/=a,r/=a;let H=c.RELAX_SPEED*.4625*(c.ANISOTROPY?.4:1);t[B+Mt]>0&&(H*=.15);let b=t[B],L=t[B+1];if(t[B]+=o*H,t[B+1]+=r*H,t[B+Mt]>0){let M=t[B+fe]-t[B],T=t[B+oe]-t[B+1],G=c.RELAX_SPEED*.1;t[B]+=M*G,t[B+1]+=T*G}t[B]=Math.min(Math.max(t[B],-1),1),t[B+1]=Math.min(Math.max(t[B+1],-1),1)}if(c.RELAX_UPDATE_VECTORS)for(let H=0;H<t.length;H+=O)this.calc_theta(H);c.TRI_MODE&&(console.log("regenerating triangulation..."),this.del()),this.calc_radii(),console.log("done")}sample_radii(){let A=this.points,t=2.5/(Math.sqrt(2)*this.dimen),i=t*6;for(let n=0;n<A.length;n+=O){let o=this.sampler(A[n],A[n+1],this.gridsize,1);if(o[0]<0)continue;let r=this.calcIntensity(o[0],o[1],o[2]),a=Math.abs(1-o[0])+Math.abs(1-o[1])+Math.abs(1-o[2]);a/=3,c.ADAPTIVE_COLOR_DENSITY&&(r*=Math.pow(1-a,2)),r=Math.pow(r,.25);let l=t+(i-t)*r;A[n+mA]=l}}relax3(){this.sample_radii(),console.log("relaxing");let A=0,t=1,i=2,n=3,o=4,r=5,a=6,l=this.dimen*2,w=new Float64Array(l*l*a);function P(){w.fill(0,0,w.length)}P();let B=this.points,D=0,v=3;for(let Q=0;Q<B.length;Q+=O){let I=B[Q],d=B[Q+1],F=B[Q+mA],p=F*v,H=Math.ceil(p*l),b=(I*.5+.5)*l,L=(d*.5+.5)*l,M=Math.fract(b),T=Math.fract(L);b=~~b,L=~~L;let G=M*M+T*T;G=G!==0?Math.sqrt(G):0;let S=1-G/Math.sqrt(2);S*=S;let j=(L*l+b)*a;w[j+A]+=H,w[j+o]+=1,w[j+r]+=F*F*S*l,w[j+n]+=S}function h(Q){return w[Q+n]===0?0:w[Q+r]/w[Q+n]}for(let Q=0;Q<2;Q++){let I=w.slice(0,w.length);for(let d=0;d<w.length;d+=a)w[d+n]=w[d+r]=0;for(let d=0;d<l;d++){let F=10;for(let p=0;p<l;p++){let H=(p*l+d)*a;for(let b=-F;b<=F;b++){let L=1-(b+F+1)/(2*F+1);L*=L*L;let M=Q?d:d+b,T=Q?p+b:p;if(M<0||M>=l||T<0||T>=l)continue;let G=(T*l+M)*a;I[G+n]!==0&&(w[H+r]+=L*(I[G+r]/I[G+n]),w[H+n]+=L)}}}}for(let Q=0;Q<l-1;Q++)for(let I=0;I<l-1;I++){let d=(I*l+Q)*a,F=(I*l+Q+1)*a,p=((I+1)*l+Q)*a;if(isNaN(w[d+n])){console.warn("NaN again!");continue}let H=h(F)-h(d),b=h(p)-h(d);if(isNaN(H)||isNaN(b)){console.log("a NaN!");continue}let L=-5;w[d+t]=-H*L,w[d+i]=-b*L,D+=w[d+n]}w.fill(0,0,w.length),D=0;let u=15,m=IA.get_searchoff(u);for(let Q=0;Q<B.length;Q+=O){let I=B[Q],d=B[Q+1],p=B[Q+mA]*v,H=~~((I*.5+.5)*l),b=~~((d*.5+.5)*l);for(let L of m){let M=I+L[0]/l*.5,T=d+L[1]/l*.5,G=H+L[0],S=b+L[1];if(G<0||S<0||G>=l||S>=l)continue;let j=(S*l+G)*a,Z=u,R=L[0]/Z,U=L[1]/Z,_=R*R+U*U;_=_!==0?Math.sqrt(_):0,!(_>1)&&(_=1-_,_*=_*_*_,_*=p,w[j+r]+=p*_,w[j+n]+=_,w[j+t]+=R*_,w[j+i]+=U*_,D+=_)}}console.log("totw:",D);for(let Q=0;Q<B.length;Q+=O){let I=B[Q],d=B[Q+1],F=B[Q+mA],p=~~((I*.5+.5)*l),b=(~~((d*.5+.5)*l)*l+p)*a,L=c.RELAX_SPEED*.5;if(isNaN(w[b+n])||isNaN(w[b+i])||isNaN(w[b+t])){console.warn("NaN!");continue}w[b+n]!==0&&(B[Q]+=L*w[b+t]/w[b+n],B[Q+1]+=L*w[b+i]/w[b+n],B[Q]=Math.min(Math.max(B[Q],-.9999),.99999),B[Q+1]=Math.min(Math.max(B[Q+1],-.9999),.9999))}c.TRI_MODE&&(console.log("regenerating triangulation..."),this.del())}relax(){this.relax2();return;function l(){a.fill(0,0,a.length)}}};var mt=class{constructor(A){this.appstate=A,this.bluenoise=A.bluenoise}reset(A){this.raster_image=A}draw_transform(A){let t=this.appstate.canvas,i=Math.min(t.width,t.height)*.5;A.scale(i,i),A.translate(1,1);let n=c.SCALE;A.scale(n,n),A.translate(n*c.PANX,n*c.PANY)}scale_point_r(A){let t=15/(Math.sqrt(2)*this.bluenoise.dimen),i=4/(Math.sqrt(2)*this.bluenoise.dimen);return A=1/(1+9*A/t),A*=i*.9,Math.max(A,i*.01)}tri_mode_draw(A){let t=this.bluenoise.points,i=this.bluenoise.tris,n=this.bluenoise.vcells;if(i===void 0||n===void 0)return;A.lineWidth=.001,A.beginPath();let o=1/(Math.sqrt(2)*this.bluenoise.dimen);console.log("MINR",o);let r=N.length;for(let a=0;a<r;a++){let l=N[a];l=VA(l[0],l[1],l[2]);let w=~~(l[0]*255),P=~~(l[1]*255),B=~~(l[2]*255);A.fillStyle="rgba("+w+","+P+","+B+", 1)",A.strokeStyle="white",A.beginPath();for(let D=0;D<t.length;D+=O){let v=D,h=t[D],u=t[D+1],m=t[D+mA],Q=D/O;if(t[D+ie]!==a)continue;let I=Q*c.MAX_VCELL_SIZE,d,F,p,H=t[D+Ce]*.9;c.SCALE_POINTS&&(H=this.scale_point_r(t[D+mA]));let b=.6;b*=c.DRAW_RMUL;let L,M,T;for(let R=0;R<c.MAX_VCELL_SIZE;R++,I++){let U=n[I];if(U===-1)break;let _=t[d*O],fA=t[d*O+1],vA=t[U*O],hA=t[U*O+1];d=U,R!==0&&(L=(h+_+vA)/3,M=(u+fA+hA)/3,L=(L-h)*b+h,M=(M-u)*b+u,F===void 0?(F=_,p=fA,A.moveTo(L,M)):A.lineTo(L,M))}let G=t[d*O],S=t[d*O+1],j=t[T*O],Z=t[T*O+1];L=(h+G+F)/3,M=(u+S+p)/3,L=(L-h)*b+h,M=(M-u)*b+u,A.lineTo(L,M)}A.fill()}}draw_points(A){let t=this.bluenoise.points,i=this.bluenoise.gridsize;for(let n=0;n<N.length;n++){let o=N[n];o=VA(o[0],o[1],o[2]);let r=~~(o[0]*255),a=~~(o[1]*255),l=~~(o[2]*255),w=1;c.DRAW_TRANSPARENT&&(w=c.ACCUM_ALPHA),c.SHOW_COLORS||(r=a=l=c.BLACK_BG?255:1),A.fillStyle="rgba("+r+","+a+","+l+","+w+")",A.beginPath(),ee.push(0);let P=1/this.bluenoise.gridsize;for(let B=0;B<t.length;B+=O){if(t[B+ie]!==n)continue;let v=t[B],h=t[B+1],u=t[B+Ce],m=t[B+te],Q=~~((v*.5+.5)*i);c.HEXAGON_MODE&&Q%2===0&&(h-=.5/i),v+=(Ae()-.5)*c.RAND_FAC*(2-m)*P,h+=(Ae()-.5)*c.RAND_FAC*(2-m)*P;let I=u/2;c.SCALE_POINTS&&(I=this.scale_point_r(t[B+mA])*.5),c.DRAW_TRANSPARENT&&A.beginPath(),A.moveTo(v,h),A.arc(v,h,I*c.DRAW_RMUL,0,Math.PI*2),c.DRAW_TRANSPARENT&&A.fill()}c.DRAW_TRANSPARENT||A.fill()}ee.pop()}draw_points2(A){let t=this.bluenoise.points,i=this.bluenoise.gridsize;for(let n=0;n<4;n++){let o=[0,0,0];n>0&&(n===2?o[n-1]=.7:o[n-1]=1);let r=~~(o[0]*255),a=~~(o[1]*255),l=~~(o[2]*255),w=1;c.DRAW_TRANSPARENT&&(w=c.ACCUM_ALPHA),c.SHOW_COLORS||(r=a=l=c.BLACK_BG?255:1),A.fillStyle="rgba("+r+","+a+","+l+","+w+")",A.beginPath(),ee.push(0);let P=1/this.bluenoise.gridsize;for(let B=0;B<t.length;B+=O){if(t[B+ZA]!==n)continue;let v=t[B],h=t[B+1],u=t[B+Ce],m=t[B+te],Q=~~((v*.5+.5)*i);c.HEXAGON_MODE&&Q%2===0&&(h-=.5/i),v+=(Ae()-.5)*c.RAND_FAC*(2-m)*P,h+=(Ae()-.5)*c.RAND_FAC*(2-m)*P;let I=u/2;c.DRAW_TRANSPARENT&&A.beginPath(),A.moveTo(v,h),A.arc(v,h,I*c.DRAW_RMUL,0,Math.PI*2),c.DRAW_TRANSPARENT&&A.fill()}c.DRAW_TRANSPARENT||A.fill()}ee.pop()}draw_fancy_stick(A,t,i,n,o,r,a,l,w,P){r*=1.5,a*=1.5,A.moveTo(t-r,i-a),A.lineTo(t+r,i+a);let B=t+(n-t)/3,D=i+(o-i)/3,v=t+(n-t)*2/3,h=i+(o-i)*2/3,u=3;if(c.STICK_ARROWS){let m=1/(l*.75+.25),Q=.5*m,I=m;A.bezierCurveTo(B+r*u,D+a*u,v+r*-u,h+a*-u,n+r,o+a),A.lineTo(n+r,o+a),A.lineTo(n+r*Q,o+a*Q),A.lineTo(n+w*I,o+P*I),A.lineTo(n-r*Q,o-a*Q),A.lineTo(n-r,o-a),A.lineTo(n-r,o-a),A.bezierCurveTo(v-r*u,h-a*u,B-r*-u,D-a*-u,t-r,i-a)}else A.bezierCurveTo(B+r*u,D+a*u,v+r*-u,h+a*-u,n+r,o+a),A.lineTo(n-r,o-a),A.bezierCurveTo(v-r*u,h-a*u,B-r*-u,D-a*-u,t-r,i-a)}draw_sticks(A){let t=c.STICK_ROT/180*Math.PI,i=this.bluenoise.points,n=this.bluenoise.gridsize;A.save(),A.lineWidth=A.lineWidth/this.bluenoise.gridsize*c.STICK_WIDTH*.5;let o=.25*c.STICK_WIDTH/this.bluenoise.gridsize;for(let r=0;r<N.length;r++){let a=N[r];a=VA(a[0],a[1],a[2]);let l=~~(a[0]*255),w=~~(a[1]*255),P=~~(a[2]*255),B=1;c.DRAW_TRANSPARENT&&(B=c.ACCUM_ALPHA),c.SHOW_COLORS||(l=w=P=c.BLACK_BG?255:1),A.strokeStyle="rgba("+l+","+w+","+P+","+B+")",A.fillStyle="rgba("+l+","+w+","+P+","+B+")",A.beginPath(),ee.push(0);let D=1/this.bluenoise.gridsize;for(let v=0;v<i.length;v+=O){if(i[v+ie]!==r)continue;let u=i[v],m=i[v+1],Q=i[v+Ce],I=i[v+ke],d=i[v+te],F=~~((u*.5+.5)*n);c.HEXAGON_MODE&&F%2===0&&(m-=.5/n),u+=(Ae()-.5)*c.RAND_FAC*(2-d)*D,m+=(Ae()-.5)*c.RAND_FAC*(2-d)*D;let p=1;c.SCALE_POINTS&&(p=1-i[v+te],p=p**.5),c.DRAW_TRANSPARENT&&A.beginPath();let H=1+d,b=Math.sin(I+t)*D*H*c.STICK_LENGTH,L=Math.cos(I+t)*D*H*c.STICK_LENGTH,M=-L,T=b,G=Math.sqrt(M*M+T*T);if(G===0)continue;M*=p*o/G,T*=p*o/G;let S=u-b,j=m-L,Z=u+b,R=m+L;if(b*=p*o/G,L*=p*o/G,c.FANCY_STICKS)this.draw_fancy_stick(A,S,j,Z,R,M,T,p,b,L);else{if(A.moveTo(S-M,j-T),A.lineTo(S+M,j+T),c.STICK_ARROWS){let U=1/(p*.75+.25),_=3*U,fA=7*U;A.lineTo(Z+M,R+T),A.lineTo(Z+M*_,R+T*_),A.lineTo(Z+b*fA,R+L*fA),A.lineTo(Z-M*_,R-T*_),A.lineTo(Z-M,R-T)}else A.lineTo(Z+M,R+T),A.lineTo(Z-M,R-T);A.closePath()}c.DRAW_TRANSPARENT&&A.fill()}c.DRAW_TRANSPARENT||A.fill()}A.restore(),ee.pop()}draw(A){A.save(),A.clearRect(0,0,this.appstate.canvas.width,this.appstate.canvas.height),A.beginPath(),A.rect(0,0,this.appstate.canvas.width,this.appstate.canvas.height),A.fillStyle=c.BLACK_BG?"black":"white",A.fill(),A.fillStyle="white",c.RASTER_IMAGE&&this.raster_image!==void 0?A.putImageData(this.raster_image,20,20):c.DRAW_STICKS?(this.draw_transform(A),this.draw_sticks(A)):c.TRI_MODE?(this.draw_transform(A),this.tri_mode_draw(A)):(this.draw_transform(A),this.draw_points(A)),c.SHOW_KDTREE&&(A.lineWidth=.001,window._appstate.bluenoise.calc_kdtree(),window._appstate.bluenoise.kdtree2.draw(A)),A.restore()}};var X=window.dat=window.dat||{};X.gui=X.gui||{};X.utils=X.utils||{};X.controllers=X.controllers||{};X.dom=X.dom||{};X.color=X.color||{};X.utils.css=(function(){return{load:function(g,A){A=A||document;var t=A.createElement("link");t.type="text/css",t.rel="stylesheet",t.href=g,A.getElementsByTagName("head")[0].appendChild(t)},inject:function(g,A){A=A||document;var t=document.createElement("style");t.type="text/css",t.innerHTML=g,A.getElementsByTagName("head")[0].appendChild(t)}}})();X.utils.common=(function(){var g=Array.prototype.forEach,A=Array.prototype.slice;return{BREAK:{},extend:function(t){return this.each(A.call(arguments,1),function(i){for(var n in i)this.isUndefined(i[n])||(t[n]=i[n])},this),t},defaults:function(t){return this.each(A.call(arguments,1),function(i){for(var n in i)this.isUndefined(t[n])&&(t[n]=i[n])},this),t},compose:function(){var t=A.call(arguments);return function(){for(var i=A.call(arguments),n=t.length-1;n>=0;n--)i=[t[n].apply(this,i)];return i[0]}},each:function(t,i,n){if(t){if(g&&t.forEach&&t.forEach===g)t.forEach(i,n);else if(t.length===t.length+0){for(var o=0,r=t.length;o<r;o++)if(o in t&&i.call(n,t[o],o)===this.BREAK)return}else for(var o in t)if(i.call(n,t[o],o)===this.BREAK)return}},defer:function(t){setTimeout(t,0)},toArray:function(t){return t.toArray?t.toArray():A.call(t)},isUndefined:function(t){return t===void 0},isNull:function(t){return t===null},isNaN:function(t){return t!==t},isArray:Array.isArray||function(t){return t.constructor===Array},isObject:function(t){return t===Object(t)},isNumber:function(t){return t===t+0},isString:function(t){return t===t+""},isBoolean:function(t){return t===!1||t===!0},isFunction:function(t){return Object.prototype.toString.call(t)==="[object Function]"}}})();X.controllers.Controller=(function(g){var A=function(t,i){this.initialValue=t[i],this.domElement=document.createElement("div"),this.object=t,this.property=i,this.__onChange=void 0,this.__onFinishChange=void 0};return g.extend(A.prototype,{onChange:function(t){return this.__onChange=t,this},onFinishChange:function(t){return this.__onFinishChange=t,this},setValue:function(t){return this.object[this.property]=t,this.__onChange&&this.__onChange.call(this,t),this.updateDisplay(),this},getValue:function(){return this.object[this.property]},updateDisplay:function(){return this},isModified:function(){return this.initialValue!==this.getValue()}}),A})(X.utils.common);X.dom.dom=(function(g){var A={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},t={};g.each(A,function(r,a){g.each(r,function(l){t[l]=a})});var i=/(\d+(\.\d+)?)px/;function n(r){if(r==="0"||g.isUndefined(r))return 0;var a=r.match(i);return g.isNull(a)?0:parseFloat(a[1])}var o={makeSelectable:function(r,a){r===void 0||r.style===void 0||(r.onselectstart=a?function(){return!1}:function(){},r.style.MozUserSelect=a?"auto":"none",r.style.KhtmlUserSelect=a?"auto":"none",r.unselectable=a?"on":"off")},makeFullscreen:function(r,a,l){g.isUndefined(a)&&(a=!0),g.isUndefined(l)&&(l=!0),r.style.position="absolute",a&&(r.style.left=0,r.style.right=0),l&&(r.style.top=0,r.style.bottom=0)},fakeEvent:function(r,a,l,w){l=l||{};var P=t[a];if(!P)throw new Error("Event type "+a+" not supported.");var B=document.createEvent(P);switch(P){case"MouseEvents":var D=l.x||l.clientX||0,v=l.y||l.clientY||0;B.initMouseEvent(a,l.bubbles||!1,l.cancelable||!0,window,l.clickCount||1,0,0,D,v,!1,!1,!1,!1,0,null);break;case"KeyboardEvents":var h=B.initKeyboardEvent||B.initKeyEvent;g.defaults(l,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),h(a,l.bubbles||!1,l.cancelable,window,l.ctrlKey,l.altKey,l.shiftKey,l.metaKey,l.keyCode,l.charCode);break;default:B.initEvent(a,l.bubbles||!1,l.cancelable||!0);break}g.defaults(B,w),r.dispatchEvent(B)},bind:function(r,a,l,w){return w=w||!1,r.addEventListener?r.addEventListener(a,l,w):r.attachEvent&&r.attachEvent("on"+a,l),o},unbind:function(r,a,l,w){return w=w||!1,r.removeEventListener?r.removeEventListener(a,l,w):r.detachEvent&&r.detachEvent("on"+a,l),o},addClass:function(r,a){if(r.className===void 0)r.className=a;else if(r.className!==a){var l=r.className.split(/ +/);l.indexOf(a)==-1&&(l.push(a),r.className=l.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return o},removeClass:function(r,a){if(a){if(r.className!==void 0)if(r.className===a)r.removeAttribute("class");else{var l=r.className.split(/ +/),w=l.indexOf(a);w!=-1&&(l.splice(w,1),r.className=l.join(" "))}}else r.className=void 0;return o},hasClass:function(r,a){return new RegExp("(?:^|\\s+)"+a+"(?:\\s+|$)").test(r.className)||!1},getWidth:function(r){var a=getComputedStyle(r);return n(a["border-left-width"])+n(a["border-right-width"])+n(a["padding-left"])+n(a["padding-right"])+n(a.width)},getHeight:function(r){var a=getComputedStyle(r);return n(a["border-top-width"])+n(a["border-bottom-width"])+n(a["padding-top"])+n(a["padding-bottom"])+n(a.height)},getOffset:function(r){var a={left:0,top:0};if(r.offsetParent)do a.left+=r.offsetLeft,a.top+=r.offsetTop;while(r=r.offsetParent);return a},isActive:function(r){return r===document.activeElement&&(r.type||r.href)}};return o})(X.utils.common);X.controllers.OptionController=(function(g,A,t){var i=function(n,o,r){i.superclass.call(this,n,o);var a=this;if(this.__select=document.createElement("select"),t.isArray(r)){var l={};t.each(r,function(w){l[w]=w}),r=l}t.each(r,function(w,P){var B=document.createElement("option");B.innerHTML=P,B.setAttribute("value",w),a.__select.appendChild(B)}),this.updateDisplay(),A.bind(this.__select,"change",function(){var w=this.options[this.selectedIndex].value;a.setValue(w)}),this.domElement.appendChild(this.__select)};return i.superclass=g,t.extend(i.prototype,g.prototype,{setValue:function(n){var o=i.superclass.prototype.setValue.call(this,n);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),o},updateDisplay:function(){return this.__select.value=this.getValue(),i.superclass.prototype.updateDisplay.call(this)}}),i})(X.controllers.Controller,X.dom.dom,X.utils.common);X.controllers.NumberController=(function(g,A){var t=function(n,o,r){t.superclass.call(this,n,o),r=r||{},this.__min=r.min,this.__max=r.max,this.__step=r.step,A.isUndefined(this.__step)?this.initialValue==0?this.__impliedStep=1:this.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(this.initialValue))/Math.LN10))/10:this.__impliedStep=this.__step,this.__precision=i(this.__impliedStep)};t.superclass=g,A.extend(t.prototype,g.prototype,{setValue:function(n){return this.__min!==void 0&&n<this.__min?n=this.__min:this.__max!==void 0&&n>this.__max&&(n=this.__max),this.__step!==void 0&&n%this.__step!=0&&(n=Math.round(n/this.__step)*this.__step),t.superclass.prototype.setValue.call(this,n)},min:function(n){return this.__min=n,this},max:function(n){return this.__max=n,this},step:function(n){return this.__step=n,this.__impliedStep=n,this.__precision=i(n),this}});function i(n){return n=n.toString(),n.indexOf(".")>-1?n.length-n.indexOf(".")-1:0}return t})(X.controllers.Controller,X.utils.common);X.controllers.NumberControllerBox=(function(g,A,t){var i=function(o,r,a){this.__truncationSuspended=!1,i.superclass.call(this,o,r,a);var l=this,w;this.__input=document.createElement("input"),this.__input.setAttribute("type","text"),A.bind(this.__input,"change",P),A.bind(this.__input,"blur",B),A.bind(this.__input,"mousedown",D),A.bind(this.__input,"keydown",function(u){u.keyCode===13&&(l.__truncationSuspended=!0,this.blur(),l.__truncationSuspended=!1)});function P(){var u=parseFloat(l.__input.value);t.isNaN(u)||l.setValue(u)}function B(){P(),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}function D(u){A.bind(window,"mousemove",v),A.bind(window,"mouseup",h),w=u.clientY}function v(u){var m=w-u.clientY;l.setValue(l.getValue()+m*l.__impliedStep),w=u.clientY}function h(){A.unbind(window,"mousemove",v),A.unbind(window,"mouseup",h)}this.updateDisplay(),this.domElement.appendChild(this.__input)};i.superclass=g,t.extend(i.prototype,g.prototype,{updateDisplay:function(){return this.__input.value=this.__truncationSuspended?this.getValue():n(this.getValue(),this.__precision),i.superclass.prototype.updateDisplay.call(this)}});function n(o,r){var a=Math.pow(10,r);return Math.round(o*a)/a}return i})(X.controllers.NumberController,X.dom.dom,X.utils.common);X.controllers.NumberControllerSlider=(function(g,A,t,i,n){var o=function(a,l,w,P,B){o.superclass.call(this,a,l,{min:w,max:P,step:B});var D=this;this.__background=document.createElement("div"),this.__foreground=document.createElement("div"),A.bind(this.__background,"mousedown",v),A.addClass(this.__background,"slider"),A.addClass(this.__foreground,"slider-fg");function v(m){A.bind(window,"mousemove",h),A.bind(window,"mouseup",u),h(m)}function h(m){m.preventDefault();var Q=A.getOffset(D.__background),I=A.getWidth(D.__background);return D.setValue(r(m.clientX,Q.left,Q.left+I,D.__min,D.__max)),!1}function u(){A.unbind(window,"mousemove",h),A.unbind(window,"mouseup",u),D.__onFinishChange&&D.__onFinishChange.call(D,D.getValue())}this.updateDisplay(),this.__background.appendChild(this.__foreground),this.domElement.appendChild(this.__background)};o.superclass=g,o.useDefaultStyles=function(){t.inject(n)},i.extend(o.prototype,g.prototype,{updateDisplay:function(){var a=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=a*100+"%",o.superclass.prototype.updateDisplay.call(this)}});function r(a,l,w,P,B){return P+(B-P)*((a-l)/(w-l))}return o})(X.controllers.NumberController,X.dom.dom,X.utils.css,X.utils.common,`/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

.slider {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
  height: 1em;
  border-radius: 1em;
  background-color: #eee;
  padding: 0 0.5em;
  overflow: hidden;
}

.slider-fg {
  padding: 1px 0 2px 0;
  background-color: #aaa;
  height: 1em;
  margin-left: -0.5em;
  padding-right: 0.5em;
  border-radius: 1em 0 0 1em;
}

.slider-fg:after {
  display: inline-block;
  border-radius: 1em;
  background-color: #fff;
  border:  1px solid #aaa;
  content: '';
  float: right;
  margin-right: -1em;
  margin-top: -1px;
  height: 0.9em;
  width: 0.9em;
}`);X.controllers.FunctionController=(function(g,A,t){var i=function(n,o,r){i.superclass.call(this,n,o);var a=this;this.__button=document.createElement("div"),this.__button.innerHTML=r===void 0?"Fire":r,A.bind(this.__button,"click",function(l){return l.preventDefault(),a.fire(),!1}),A.addClass(this.__button,"button"),this.domElement.appendChild(this.__button)};return i.superclass=g,t.extend(i.prototype,g.prototype,{fire:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}),i})(X.controllers.Controller,X.dom.dom,X.utils.common);X.controllers.BooleanController=(function(g,A,t){var i=function(n,o){i.superclass.call(this,n,o);var r=this;this.__prev=this.getValue(),this.__checkbox=document.createElement("input"),this.__checkbox.setAttribute("type","checkbox"),A.bind(this.__checkbox,"change",a,!1),this.domElement.appendChild(this.__checkbox),this.updateDisplay();function a(){r.setValue(!r.__prev)}};return i.superclass=g,t.extend(i.prototype,g.prototype,{setValue:function(n){var o=i.superclass.prototype.setValue.call(this,n);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),o},updateDisplay:function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0):this.__checkbox.checked=!1,i.superclass.prototype.updateDisplay.call(this)}}),i})(X.controllers.Controller,X.dom.dom,X.utils.common);X.color.toString=(function(g){return function(A){if(A.a==1||g.isUndefined(A.a)){for(var t=A.hex.toString(16);t.length<6;)t="0"+t;return"#"+t}else return"rgba("+Math.round(A.r)+","+Math.round(A.g)+","+Math.round(A.b)+","+A.a+")"}})(X.utils.common);X.color.interpret=(function(g,A){var t,i,n=function(){i=!1;var r=arguments.length>1?A.toArray(arguments):arguments[0];return A.each(o,function(a){if(a.litmus(r))return A.each(a.conversions,function(l,w){if(t=l.read(r),i===!1&&t!==!1)return i=t,t.conversionName=w,t.conversion=l,A.BREAK}),A.BREAK}),i},o=[{litmus:A.isString,conversions:{THREE_CHAR_HEX:{read:function(r){var a=r.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return a===null?!1:{space:"HEX",hex:parseInt("0x"+a[1].toString()+a[1].toString()+a[2].toString()+a[2].toString()+a[3].toString()+a[3].toString())}},write:g},SIX_CHAR_HEX:{read:function(r){var a=r.match(/^#([A-F0-9]{6})$/i);return a===null?!1:{space:"HEX",hex:parseInt("0x"+a[1].toString())}},write:g},CSS_RGB:{read:function(r){var a=r.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);return a===null?!1:{space:"RGB",r:parseFloat(a[1]),g:parseFloat(a[2]),b:parseFloat(a[3])}},write:g},CSS_RGBA:{read:function(r){var a=r.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);return a===null?!1:{space:"RGB",r:parseFloat(a[1]),g:parseFloat(a[2]),b:parseFloat(a[3]),a:parseFloat(a[4])}},write:g}}},{litmus:A.isNumber,conversions:{HEX:{read:function(r){return{space:"HEX",hex:r,conversionName:"HEX"}},write:function(r){return r.hex}}}},{litmus:A.isArray,conversions:{RGB_ARRAY:{read:function(r){return r.length!=3?!1:{space:"RGB",r:r[0],g:r[1],b:r[2]}},write:function(r){return[r.r,r.g,r.b]}},RGBA_ARRAY:{read:function(r){return r.length!=4?!1:{space:"RGB",r:r[0],g:r[1],b:r[2],a:r[3]}},write:function(r){return[r.r,r.g,r.b,r.a]}}}},{litmus:A.isObject,conversions:{RGBA_OBJ:{read:function(r){return A.isNumber(r.r)&&A.isNumber(r.g)&&A.isNumber(r.b)&&A.isNumber(r.a)?{space:"RGB",r:r.r,g:r.g,b:r.b,a:r.a}:!1},write:function(r){return{r:r.r,g:r.g,b:r.b,a:r.a}}},RGB_OBJ:{read:function(r){return A.isNumber(r.r)&&A.isNumber(r.g)&&A.isNumber(r.b)?{space:"RGB",r:r.r,g:r.g,b:r.b}:!1},write:function(r){return{r:r.r,g:r.g,b:r.b}}},HSVA_OBJ:{read:function(r){return A.isNumber(r.h)&&A.isNumber(r.s)&&A.isNumber(r.v)&&A.isNumber(r.a)?{space:"HSV",h:r.h,s:r.s,v:r.v,a:r.a}:!1},write:function(r){return{h:r.h,s:r.s,v:r.v,a:r.a}}},HSV_OBJ:{read:function(r){return A.isNumber(r.h)&&A.isNumber(r.s)&&A.isNumber(r.v)?{space:"HSV",h:r.h,s:r.s,v:r.v}:!1},write:function(r){return{h:r.h,s:r.s,v:r.v}}}}}];return n})(X.color.toString,X.utils.common);X.GUI=X.gui.GUI=(function(g,A,t,i,n,o,r,a,l,w,P,B,D,v,h){g.inject(t);var u="dg",m=72,Q=20,I="Default",d=(function(){try{return"localStorage"in window&&window.localStorage!==null}catch{return!1}})(),F,p=!0,H,b=!1,L=[],M=function(C){var z=this;this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),v.addClass(this.domElement,u),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],C=C||{},C=h.defaults(C,{autoPlace:!0,width:M.DEFAULT_WIDTH}),C=h.defaults(C,{resizable:C.autoPlace,hideable:C.autoPlace}),h.isUndefined(C.load)?C.load={preset:I}:C.preset&&(C.load.preset=C.preset),h.isUndefined(C.parent)&&C.hideable&&L.push(this),C.resizable=h.isUndefined(C.parent)&&C.resizable,C.autoPlace&&h.isUndefined(C.scrollable)&&(C.scrollable=!0);var y=d&&localStorage.getItem(Z(this,"isLocal"))==="true",Y;if(Object.defineProperties(this,{parent:{get:function(){return C.parent}},scrollable:{get:function(){return C.scrollable}},autoPlace:{get:function(){return C.autoPlace}},preset:{get:function(){return z.parent?z.getRoot().preset:C.load.preset},set:function(tA){z.parent?z.getRoot().preset=tA:C.load.preset=tA,hA(this),z.revert()}},width:{get:function(){return C.width},set:function(tA){C.width=tA,_(z,tA)}},name:{get:function(){return C.name},set:function(tA){C.name=tA,J&&(J.innerHTML=C.name)}},closed:{get:function(){return C.closed},set:function(tA){C.closed=tA,C.closed?v.addClass(z.__ul,M.CLASS_CLOSED):v.removeClass(z.__ul,M.CLASS_CLOSED),this.onResize(),z.__closeButton&&(z.__closeButton.innerHTML=tA?M.TEXT_OPEN:M.TEXT_CLOSED)}},load:{get:function(){return C.load}},useLocalStorage:{get:function(){return y},set:function(tA){d&&(y=tA,tA?v.bind(window,"unload",Y):v.unbind(window,"unload",Y),localStorage.setItem(Z(z,"isLocal"),tA))}}}),h.isUndefined(C.parent)){if(C.closed=!1,v.addClass(this.domElement,M.CLASS_MAIN),v.makeSelectable(this.domElement,!1),d&&y){z.useLocalStorage=!0;var eA=localStorage.getItem(Z(this,"gui"));eA&&(C.load=JSON.parse(eA))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=M.TEXT_CLOSED,v.addClass(this.__closeButton,M.CLASS_CLOSE_BUTTON),this.domElement.appendChild(this.__closeButton),v.bind(this.__closeButton,"click",function(){z.closed=!z.closed})}else{C.closed===void 0&&(C.closed=!0);var J=document.createTextNode(C.name);v.addClass(J,"controller-name");var V=G(z,J),iA=function(tA){return tA.preventDefault(),z.closed=!z.closed,!1};v.addClass(this.__ul,M.CLASS_CLOSED),v.addClass(V,"title"),v.bind(V,"click",iA),C.closed||(this.closed=!1)}C.autoPlace&&(h.isUndefined(C.parent)&&(p&&(H=document.createElement("div"),v.addClass(H,u),v.addClass(H,M.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(H),p=!1),H.appendChild(this.domElement),v.addClass(this.domElement,M.CLASS_AUTO_PLACE)),this.parent||_(z,C.width)),v.bind(window,"resize",function(){z.onResize()}),v.bind(this.__ul,"webkitTransitionEnd",function(){z.onResize()}),v.bind(this.__ul,"transitionend",function(){z.onResize()}),v.bind(this.__ul,"oTransitionEnd",function(){z.onResize()}),this.onResize(),C.resizable&&U(this),Y=function(){d&&localStorage.getItem(Z(z,"isLocal"))==="true"&&localStorage.setItem(Z(z,"gui"),JSON.stringify(z.getSaveObject()))},this.saveToLocalStorageIfPossible=Y;var PA=z.getRoot();function uA(){var tA=z.getRoot();tA.width+=1,h.defer(function(){tA.width-=1})}C.parent||uA()};M.toggleHide=function(){b=!b,h.each(L,function(C){C.domElement.style.zIndex=b?-999:999,C.domElement.style.opacity=b?0:1})},M.CLASS_AUTO_PLACE="a",M.CLASS_AUTO_PLACE_CONTAINER="ac",M.CLASS_MAIN="main",M.CLASS_CONTROLLER_ROW="cr",M.CLASS_TOO_TALL="taller-than-window",M.CLASS_CLOSED="closed",M.CLASS_CLOSE_BUTTON="close-button",M.CLASS_DRAG="drag",M.DEFAULT_WIDTH=245,M.TEXT_CLOSED="Close Controls",M.TEXT_OPEN="Open Controls",v.bind(window,"keydown",function(C){document.activeElement.type!=="text"&&(C.which===m||C.keyCode==m)&&M.toggleHide()},!1),h.extend(M.prototype,{add:function(C,z){return T(this,C,z,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(C,z){return T(this,C,z,{color:!0})},remove:function(C){this.__ul.removeChild(C.__li),this.__controllers.splice(this.__controllers.indexOf(C),1);var z=this;h.defer(function(){z.onResize()})},destroy:function(){this.autoPlace&&H.removeChild(this.domElement)},addFolder:function(C){if(this.__folders[C]!==void 0)throw new Error('You already have a folder in this GUI by the name "'+C+'"');var z={name:C,parent:this};z.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[C]&&(z.closed=this.load.folders[C].closed,z.load=this.load.folders[C]);var y=new M(z);this.__folders[C]=y;var Y=G(this,y.domElement);return v.addClass(Y,"folder"),y},open:function(){this.closed=!1},close:function(){this.closed=!0},onResize:function(){var C=this.getRoot();if(C.scrollable){var z=v.getOffset(C.__ul).top,y=0;h.each(C.__ul.childNodes,function(Y){C.autoPlace&&Y===C.__save_row||(y+=v.getHeight(Y))}),window.innerHeight-z-Q<y?(v.addClass(C.domElement,M.CLASS_TOO_TALL),C.__ul.style.height=window.innerHeight-z-Q+"px"):(v.removeClass(C.domElement,M.CLASS_TOO_TALL),C.__ul.style.height="auto")}C.__resize_handle&&h.defer(function(){C.__resize_handle.style.height=C.__ul.offsetHeight+"px"}),C.__closeButton&&(C.__closeButton.style.width=C.width+"px")},remember:function(){if(h.isUndefined(F)&&(F=new D,F.domElement.innerHTML=A),this.parent)throw new Error("You can only call remember on a top level GUI.");var C=this;h.each(Array.prototype.slice.call(arguments),function(z){C.__rememberedObjects.length==0&&R(C),C.__rememberedObjects.indexOf(z)==-1&&C.__rememberedObjects.push(z)}),this.autoPlace&&_(this,this.width)},getRoot:function(){for(var C=this;C.parent;)C=C.parent;return C},getSaveObject:function(){var C=this.load;return C.closed=this.closed,this.__rememberedObjects.length>0&&(C.preset=this.preset,C.remembered||(C.remembered={}),C.remembered[this.preset]=fA(this)),C.folders={},h.each(this.__folders,function(z,y){C.folders[y]=z.getSaveObject()}),C},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=fA(this),sA(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(C){this.load.remembered||(this.load.remembered={},this.load.remembered[I]=fA(this,!0)),this.load.remembered[C]=fA(this),this.preset=C,vA(this,C,!0),this.saveToLocalStorageIfPossible()},revert:function(C){h.each(this.__controllers,function(z){this.getRoot().load.remembered?j(C||this.getRoot(),z):z.setValue(z.initialValue)},this),h.each(this.__folders,function(z){z.revert(z)}),C||sA(this.getRoot(),!1)},listen:function(C){var z=this.__listening.length==0;this.__listening.push(C),z&&$(this.__listening)}});function T(C,z,y,Y){if(z[y]===void 0)throw new Error("Object "+z+' has no property "'+y+'"');var eA;if(Y.color)eA=new P(z,y);else{var J=[z,y].concat(Y.factoryArgs);eA=i.apply(C,J)}Y.before instanceof n&&(Y.before=Y.before.__li),j(C,eA),v.addClass(eA.domElement,"c");var V=document.createElement("span");v.addClass(V,"property-name"),V.innerHTML=eA.property;var iA=document.createElement("div");iA.appendChild(V),iA.appendChild(eA.domElement);var PA=G(C,iA,Y.before);return v.addClass(PA,M.CLASS_CONTROLLER_ROW),v.addClass(PA,typeof eA.getValue()),S(C,PA,eA),C.__controllers.push(eA),eA}function G(C,z,y){var Y=document.createElement("li");return z&&Y.appendChild(z),y?C.__ul.insertBefore(Y,params.before):C.__ul.appendChild(Y),C.onResize(),Y}function S(C,z,y){if(y.__li=z,y.__gui=C,h.extend(y,{options:function(J){if(arguments.length>1)return y.remove(),T(C,y.object,y.property,{before:y.__li.nextElementSibling,factoryArgs:[h.toArray(arguments)]});if(h.isArray(J)||h.isObject(J))return y.remove(),T(C,y.object,y.property,{before:y.__li.nextElementSibling,factoryArgs:[J]})},name:function(J){return y.__li.firstElementChild.firstElementChild.innerHTML=J,y},listen:function(){return y.__gui.listen(y),y},remove:function(){return y.__gui.remove(y),y}}),y instanceof l){var Y=new a(y.object,y.property,{min:y.__min,max:y.__max,step:y.__step});h.each(["updateDisplay","onChange","onFinishChange"],function(J){var V=y[J],iA=Y[J];y[J]=Y[J]=function(){var PA=Array.prototype.slice.call(arguments);return V.apply(y,PA),iA.apply(Y,PA)}}),v.addClass(z,"has-slider"),y.domElement.insertBefore(Y.domElement,y.domElement.firstElementChild)}else if(y instanceof a){var eA=function(J){return h.isNumber(y.__min)&&h.isNumber(y.__max)?(y.remove(),T(C,y.object,y.property,{before:y.__li.nextElementSibling,factoryArgs:[y.__min,y.__max,y.__step]})):J};y.min=h.compose(eA,y.min),y.max=h.compose(eA,y.max)}else y instanceof o?(v.bind(z,"click",function(){v.fakeEvent(y.__checkbox,"click")}),v.bind(y.__checkbox,"click",function(J){J.stopPropagation()})):y instanceof r?(v.bind(z,"click",function(){v.fakeEvent(y.__button,"click")}),v.bind(z,"mouseover",function(){v.addClass(y.__button,"hover")}),v.bind(z,"mouseout",function(){v.removeClass(y.__button,"hover")})):y instanceof P&&(v.addClass(z,"color"),y.updateDisplay=h.compose(function(J){return z.style.borderLeftColor=y.__color.toString(),J},y.updateDisplay),y.updateDisplay());y.setValue=h.compose(function(J){return C.getRoot().__preset_select&&y.isModified()&&sA(C.getRoot(),!0),J},y.setValue)}function j(C,z){var y=C.getRoot(),Y=y.__rememberedObjects.indexOf(z.object);if(Y!=-1){var eA=y.__rememberedObjectIndecesToControllers[Y];if(eA===void 0&&(eA={},y.__rememberedObjectIndecesToControllers[Y]=eA),eA[z.property]=z,y.load&&y.load.remembered){var J=y.load.remembered,V;if(J[C.preset])V=J[C.preset];else if(J[I])V=J[I];else return;if(V[Y]&&V[Y][z.property]!==void 0){var iA=V[Y][z.property];z.initialValue=iA,z.setValue(iA)}}}}function Z(C,z){return document.location.href+"."+z}function R(C){var z=C.__save_row=document.createElement("li");v.addClass(C.domElement,"has-save"),C.__ul.insertBefore(z,C.__ul.firstChild),v.addClass(z,"save-row");var y=document.createElement("span");y.innerHTML="&nbsp;",v.addClass(y,"button gears");var Y=document.createElement("span");Y.innerHTML="Save",v.addClass(Y,"button"),v.addClass(Y,"save");var eA=document.createElement("span");eA.innerHTML="New",v.addClass(eA,"button"),v.addClass(eA,"save-as");var J=document.createElement("span");J.innerHTML="Revert",v.addClass(J,"button"),v.addClass(J,"revert");var V=C.__preset_select=document.createElement("select");if(C.load&&C.load.remembered?h.each(C.load.remembered,function(AA,zA){vA(C,zA,zA==C.preset)}):vA(C,I,!1),v.bind(V,"change",function(){for(var AA=0;AA<C.__preset_select.length;AA++)C.__preset_select[AA].innerHTML=C.__preset_select[AA].value;C.preset=this.value}),z.appendChild(V),z.appendChild(y),z.appendChild(Y),z.appendChild(eA),z.appendChild(J),d){let AA=function(){PA.style.display=C.useLocalStorage?"block":"none"};var xA=AA,iA=document.getElementById("dg-save-locally"),PA=document.getElementById("dg-local-explain");iA.style.display="block";var uA=document.getElementById("dg-local-storage");localStorage.getItem(Z(C,"isLocal"))==="true"&&uA.setAttribute("checked","checked"),AA(),v.bind(uA,"change",function(){C.useLocalStorage=!C.useLocalStorage,AA()})}var tA=document.getElementById("dg-new-constructor");v.bind(tA,"keydown",function(AA){AA.metaKey&&(AA.which===67||AA.keyCode==67)&&F.hide()}),v.bind(y,"click",function(){tA.innerHTML=JSON.stringify(C.getSaveObject(),void 0,2),F.show(),tA.focus(),tA.select()}),v.bind(Y,"click",function(){C.save()}),v.bind(eA,"click",function(){var AA=prompt("Enter a new preset name.");AA&&C.saveAs(AA)}),v.bind(J,"click",function(){C.revert()})}function U(C){C.__resize_handle=document.createElement("div"),h.extend(C.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});var z;v.bind(C.__resize_handle,"mousedown",y),v.bind(C.__closeButton,"mousedown",y),C.domElement.insertBefore(C.__resize_handle,C.domElement.firstElementChild);function y(J){return J.preventDefault(),z=J.clientX,v.addClass(C.__closeButton,M.CLASS_DRAG),v.bind(window,"mousemove",Y),v.bind(window,"mouseup",eA),!1}function Y(J){return J.preventDefault(),C.width+=z-J.clientX,C.onResize(),z=J.clientX,!1}function eA(){v.removeClass(C.__closeButton,M.CLASS_DRAG),v.unbind(window,"mousemove",Y),v.unbind(window,"mouseup",eA)}}function _(C,z){C.domElement.style.width=z+"px",C.__save_row&&C.autoPlace&&(C.__save_row.style.width=z+"px"),C.__closeButton&&(C.__closeButton.style.width=z+"px")}function fA(C,z){var y={};return h.each(C.__rememberedObjects,function(Y,eA){var J={},V=C.__rememberedObjectIndecesToControllers[eA];h.each(V,function(iA,PA){J[PA]=z?iA.initialValue:iA.getValue()}),y[eA]=J}),y}function vA(C,z,y){var Y=document.createElement("option");Y.innerHTML=z,Y.value=z,C.__preset_select.appendChild(Y),y&&(C.__preset_select.selectedIndex=C.__preset_select.length-1)}function hA(C){for(var z=0;z<C.__preset_select.length;z++)C.__preset_select[z].value==C.preset&&(C.__preset_select.selectedIndex=z)}function sA(C,z){var y=C.__preset_select[C.__preset_select.selectedIndex];z?y.innerHTML=y.value+"*":y.innerHTML=y.value}function $(C){C.length!=0&&B(function(){$(C)}),h.each(C,function(z){z.updateDisplay()})}return M})(X.utils.css,`<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.
      
    </div>
    
  </div>

</div>`,`.dg {
  /** Clear list styles */
  /* Auto-place container */
  /* Auto-placed GUI's */
  /* Line items that don't contain folders. */
  /** Folder names */
  /** Hides closed items */
  /** Controller row */
  /** Name-half (left) */
  /** Controller-half (right) */
  /** Controller placement */
  /** Shorter number boxes when slider is present. */
  /** Ensure the entire boolean and function row shows a hand */ }
  .dg ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    clear: both; }
  .dg.ac {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    z-index: 0; }
  .dg:not(.ac) .main {
    /** Exclude mains in ac so that we don't hide close button */
    overflow: hidden; }
  .dg.main {
    -webkit-transition: opacity 0.1s linear;
    -o-transition: opacity 0.1s linear;
    -moz-transition: opacity 0.1s linear;
    transition: opacity 0.1s linear; }
    .dg.main.taller-than-window {
      overflow-y: auto; }
      .dg.main.taller-than-window .close-button {
        opacity: 1;
        /* TODO, these are style notes */
        margin-top: -1px;
        border-top: 1px solid #2c2c2c; }
    .dg.main ul.closed .close-button {
      opacity: 1 !important; }
    .dg.main:hover .close-button,
    .dg.main .close-button.drag {
      opacity: 1; }
    .dg.main .close-button {
      /*opacity: 0;*/
      -webkit-transition: opacity 0.1s linear;
      -o-transition: opacity 0.1s linear;
      -moz-transition: opacity 0.1s linear;
      transition: opacity 0.1s linear;
      border: 0;
      position: absolute;
      line-height: 19px;
      height: 20px;
      /* TODO, these are style notes */
      cursor: pointer;
      text-align: center;
      background-color: #000; }
      .dg.main .close-button:hover {
        background-color: #111; }
  .dg.a {
    float: right;
    margin-right: 15px;
    overflow-x: hidden; }
    .dg.a.has-save > ul {
      margin-top: 27px; }
      .dg.a.has-save > ul.closed {
        margin-top: 0; }
    .dg.a .save-row {
      position: fixed;
      top: 0;
      z-index: 1002; }
  .dg li {
    -webkit-transition: height 0.1s ease-out;
    -o-transition: height 0.1s ease-out;
    -moz-transition: height 0.1s ease-out;
    transition: height 0.1s ease-out; }
  .dg li:not(.folder) {
    cursor: auto;
    height: 27px;
    line-height: 27px;
    overflow: hidden;
    padding: 0 4px 0 5px; }
  .dg li.folder {
    padding: 0;
    border-left: 4px solid rgba(0, 0, 0, 0); }
  .dg li.title {
    cursor: pointer;
    margin-left: -4px; }
  .dg .closed li:not(.title),
  .dg .closed ul li,
  .dg .closed ul li > * {
    height: 0;
    overflow: hidden;
    border: 0; }
  .dg .cr {
    clear: both;
    padding-left: 3px;
    height: 27px; }
  .dg .property-name {
    cursor: default;
    float: left;
    clear: left;
    width: 40%;
    overflow: hidden;
    text-overflow: ellipsis; }
  .dg .c {
    float: left;
    width: 60%; }
  .dg .c input[type=text] {
    border: 0;
    margin-top: 4px;
    padding: 3px;
    width: 100%;
    float: right; }
  .dg .has-slider input[type=text] {
    width: 30%;
    /*display: none;*/
    margin-left: 0; }
  .dg .slider {
    float: left;
    width: 66%;
    margin-left: -5px;
    margin-right: 0;
    height: 19px;
    margin-top: 4px; }
  .dg .slider-fg {
    height: 100%; }
  .dg .c input[type=checkbox] {
    margin-top: 9px; }
  .dg .c select {
    margin-top: 5px; }
  .dg .cr.function,
  .dg .cr.function .property-name,
  .dg .cr.function *,
  .dg .cr.boolean,
  .dg .cr.boolean * {
    cursor: pointer; }
  .dg .selector {
    display: none;
    position: absolute;
    margin-left: -9px;
    margin-top: 23px;
    z-index: 10; }
  .dg .c:hover .selector,
  .dg .selector.drag {
    display: block; }
  .dg li.save-row {
    padding: 0; }
    .dg li.save-row .button {
      display: inline-block;
      padding: 0px 6px; }
  .dg.dialogue {
    background-color: #222;
    width: 460px;
    padding: 15px;
    font-size: 13px;
    line-height: 15px; }

/* TODO Separate style and structure */
#dg-new-constructor {
  padding: 10px;
  color: #222;
  font-family: Monaco, monospace;
  font-size: 10px;
  border: 0;
  resize: none;
  box-shadow: inset 1px 1px 1px #888;
  word-wrap: break-word;
  margin: 12px 0;
  display: block;
  width: 440px;
  overflow-y: scroll;
  height: 100px;
  position: relative; }

#dg-local-explain {
  display: none;
  font-size: 11px;
  line-height: 17px;
  border-radius: 3px;
  background-color: #333;
  padding: 8px;
  margin-top: 10px; }
  #dg-local-explain code {
    font-size: 10px; }

#dat-gui-save-locally {
  display: none; }

/** Main type */
.dg {
  color: #eee;
  font: 11px 'Lucida Grande', sans-serif;
  text-shadow: 0 -1px 0 #111;
  /** Auto place */
  /* Controller row, <li> */
  /** Controllers */ }
  .dg.main {
    /** Scrollbar */ }
    .dg.main::-webkit-scrollbar {
      width: 5px;
      background: #1a1a1a; }
    .dg.main::-webkit-scrollbar-corner {
      height: 0;
      display: none; }
    .dg.main::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: #676767; }
  .dg li:not(.folder) {
    background: #1a1a1a;
    border-bottom: 1px solid #2c2c2c; }
  .dg li.save-row {
    line-height: 25px;
    background: #dad5cb;
    border: 0; }
    .dg li.save-row select {
      margin-left: 5px;
      width: 108px; }
    .dg li.save-row .button {
      margin-left: 5px;
      margin-top: 1px;
      border-radius: 2px;
      font-size: 9px;
      line-height: 7px;
      padding: 4px 4px 5px 4px;
      background: #c5bdad;
      color: #fff;
      text-shadow: 0 1px 0 #b0a58f;
      box-shadow: 0 -1px 0 #b0a58f;
      cursor: pointer; }
      .dg li.save-row .button.gears {
        background: #c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;
        height: 7px;
        width: 8px; }
      .dg li.save-row .button:hover {
        background-color: #bab19e;
        box-shadow: 0 -1px 0 #b0a58f; }
  .dg li.folder {
    border-bottom: 0; }
  .dg li.title {
    padding-left: 16px;
    background: black url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
  .dg .closed li.title {
    background-image: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==); }
  .dg .cr.boolean {
    border-left: 3px solid #806787; }
  .dg .cr.function {
    border-left: 3px solid #e61d5f; }
  .dg .cr.number {
    border-left: 3px solid #2fa1d6; }
    .dg .cr.number input[type=text] {
      color: #2fa1d6; }
  .dg .cr.string {
    border-left: 3px solid #1ed36f; }
    .dg .cr.string input[type=text] {
      color: #1ed36f; }
  .dg .cr.function:hover, .dg .cr.boolean:hover {
    background: #111; }
  .dg .c input[type=text] {
    background: #303030;
    outline: none; }
    .dg .c input[type=text]:hover {
      background: #3c3c3c; }
    .dg .c input[type=text]:focus {
      background: #494949;
      color: #fff; }
  .dg .c .slider {
    background: #303030;
    cursor: ew-resize; }
  .dg .c .slider-fg {
    background: #2fa1d6; }
  .dg .c .slider:hover {
    background: #3c3c3c; }
    .dg .c .slider:hover .slider-fg {
      background: #44abda; }
`,X.controllers.factory=(function(g,A,t,i,n,o,r){return function(a,l){var w=a[l];if(r.isArray(arguments[2])||r.isObject(arguments[2]))return new g(a,l,arguments[2]);if(r.isNumber(w))return r.isNumber(arguments[2])&&r.isNumber(arguments[3])?new t(a,l,arguments[2],arguments[3]):new A(a,l,{min:arguments[2],max:arguments[3]});if(r.isString(w))return new i(a,l);if(r.isFunction(w))return new n(a,l,"");if(r.isBoolean(w))return new o(a,l)}})(X.controllers.OptionController,X.controllers.NumberControllerBox,X.controllers.NumberControllerSlider,X.controllers.StringController=(function(g,A,t){var i=function(n,o){i.superclass.call(this,n,o);var r=this;this.__input=document.createElement("input"),this.__input.setAttribute("type","text"),A.bind(this.__input,"keyup",a),A.bind(this.__input,"change",a),A.bind(this.__input,"blur",l),A.bind(this.__input,"keydown",function(w){w.keyCode===13&&this.blur()});function a(){r.setValue(r.__input.value)}function l(){r.__onFinishChange&&r.__onFinishChange.call(r,r.getValue())}this.updateDisplay(),this.domElement.appendChild(this.__input)};return i.superclass=g,t.extend(i.prototype,g.prototype,{updateDisplay:function(){return A.isActive(this.__input)||(this.__input.value=this.getValue()),i.superclass.prototype.updateDisplay.call(this)}}),i})(X.controllers.Controller,X.dom.dom,X.utils.common),X.controllers.FunctionController,X.controllers.BooleanController,X.utils.common),X.controllers.Controller,X.controllers.BooleanController,X.controllers.FunctionController,X.controllers.NumberControllerBox,X.controllers.NumberControllerSlider,X.controllers.OptionController,X.controllers.ColorController=(function(g,A,t,i,n){var o=function(w,P){o.superclass.call(this,w,P),this.__color=new t(this.getValue()),this.__temp=new t(0);var B=this;this.domElement=document.createElement("div"),A.makeSelectable(this.domElement,!1),this.__selector=document.createElement("div"),this.__selector.className="selector",this.__saturation_field=document.createElement("div"),this.__saturation_field.className="saturation-field",this.__field_knob=document.createElement("div"),this.__field_knob.className="field-knob",this.__field_knob_border="2px solid ",this.__hue_knob=document.createElement("div"),this.__hue_knob.className="hue-knob",this.__hue_field=document.createElement("div"),this.__hue_field.className="hue-field",this.__input=document.createElement("input"),this.__input.type="text",this.__input_textShadow="0 1px 1px ",A.bind(this.__input,"keydown",function(d){d.keyCode===13&&u.call(this)}),A.bind(this.__input,"blur",u),A.bind(this.__selector,"mousedown",function(d){A.addClass(this,"drag").bind(window,"mouseup",function(F){A.removeClass(B.__selector,"drag")})});var D=document.createElement("div");n.extend(this.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),n.extend(this.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:this.__field_knob_border+(this.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),n.extend(this.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),n.extend(this.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),n.extend(D.style,{width:"100%",height:"100%",background:"none"}),a(D,"top","rgba(0,0,0,0)","#000"),n.extend(this.__hue_field.style,{width:"15px",height:"100px",display:"inline-block",border:"1px solid #555",cursor:"ns-resize"}),l(this.__hue_field),n.extend(this.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:this.__input_textShadow+"rgba(0,0,0,0.7)"}),A.bind(this.__saturation_field,"mousedown",v),A.bind(this.__field_knob,"mousedown",v),A.bind(this.__hue_field,"mousedown",function(d){I(d),A.bind(window,"mousemove",I),A.bind(window,"mouseup",m)});function v(d){Q(d),A.bind(window,"mousemove",Q),A.bind(window,"mouseup",h)}function h(){A.unbind(window,"mousemove",Q),A.unbind(window,"mouseup",h)}function u(){var d=i(this.value);d!==!1?(B.__color.__state=d,B.setValue(B.__color.toOriginal())):this.value=B.__color.toString()}function m(){A.unbind(window,"mousemove",I),A.unbind(window,"mouseup",m)}this.__saturation_field.appendChild(D),this.__selector.appendChild(this.__field_knob),this.__selector.appendChild(this.__saturation_field),this.__selector.appendChild(this.__hue_field),this.__hue_field.appendChild(this.__hue_knob),this.domElement.appendChild(this.__input),this.domElement.appendChild(this.__selector),this.updateDisplay();function Q(d){d.preventDefault();var F=A.getWidth(B.__saturation_field),p=A.getOffset(B.__saturation_field),H=(d.clientX-p.left+document.body.scrollLeft)/F,b=1-(d.clientY-p.top+document.body.scrollTop)/F;return b>1?b=1:b<0&&(b=0),H>1?H=1:H<0&&(H=0),B.__color.v=b,B.__color.s=H,B.setValue(B.__color.toOriginal()),!1}function I(d){d.preventDefault();var F=A.getHeight(B.__hue_field),p=A.getOffset(B.__hue_field),H=1-(d.clientY-p.top+document.body.scrollTop)/F;return H>1?H=1:H<0&&(H=0),B.__color.h=H*360,B.setValue(B.__color.toOriginal()),!1}};o.superclass=g,n.extend(o.prototype,g.prototype,{updateDisplay:function(){var w=i(this.getValue());if(w!==!1){var P=!1;n.each(t.COMPONENTS,function(v){if(!n.isUndefined(w[v])&&!n.isUndefined(this.__color.__state[v])&&w[v]!==this.__color.__state[v])return P=!0,{}},this),P&&n.extend(this.__color.__state,w)}n.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var B=this.__color.v<.5||this.__color.s>.5?255:0,D=255-B;n.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toString(),border:this.__field_knob_border+"rgb("+B+","+B+","+B+")"}),this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px",this.__temp.s=1,this.__temp.v=1,a(this.__saturation_field,"left","#fff",this.__temp.toString()),n.extend(this.__input.style,{backgroundColor:this.__input.value=this.__color.toString(),color:"rgb("+B+","+B+","+B+")",textShadow:this.__input_textShadow+"rgba("+D+","+D+","+D+",.7)"})}});var r=["-moz-","-o-","-webkit-","-ms-",""];function a(w,P,B,D){w.style.background="",n.each(r,function(v){w.style.cssText+="background: "+v+"linear-gradient("+P+", "+B+" 0%, "+D+" 100%); "})}function l(w){w.style.background="",w.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",w.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",w.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",w.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",w.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}return o})(X.controllers.Controller,X.dom.dom,X.color.Color=(function(g,A,t,i){var n=function(){if(this.__state=g.apply(this,arguments),this.__state===!1)throw"Failed to interpret color arguments";this.__state.a=this.__state.a||1};n.COMPONENTS=["r","g","b","h","s","v","hex","a"],i.extend(n.prototype,{toString:function(){return t(this)},toOriginal:function(){return this.__state.conversion.write(this)}}),o(n.prototype,"r",2),o(n.prototype,"g",1),o(n.prototype,"b",0),r(n.prototype,"h"),r(n.prototype,"s"),r(n.prototype,"v"),Object.defineProperty(n.prototype,"a",{get:function(){return this.__state.a},set:function(w){this.__state.a=w}}),Object.defineProperty(n.prototype,"hex",{get:function(){return!this.__state.space!=="HEX"&&(this.__state.hex=A.rgb_to_hex(this.r,this.g,this.b)),this.__state.hex},set:function(w){this.__state.space="HEX",this.__state.hex=w}});function o(w,P,B){Object.defineProperty(w,P,{get:function(){return this.__state.space==="RGB"?this.__state[P]:(a(this,P,B),this.__state[P])},set:function(D){this.__state.space!=="RGB"&&(a(this,P,B),this.__state.space="RGB"),this.__state[P]=D}})}function r(w,P){Object.defineProperty(w,P,{get:function(){return this.__state.space==="HSV"?this.__state[P]:(l(this),this.__state[P])},set:function(B){this.__state.space!=="HSV"&&(l(this),this.__state.space="HSV"),this.__state[P]=B}})}function a(w,P,B){if(w.__state.space==="HEX")w.__state[P]=A.component_from_hex(w.__state.hex,B);else if(w.__state.space==="HSV")i.extend(w.__state,A.hsv_to_rgb(w.__state.h,w.__state.s,w.__state.v));else throw"Corrupted color state"}function l(w){var P=A.rgb_to_hsv(w.r,w.g,w.b);i.extend(w.__state,{s:P.s,v:P.v}),i.isNaN(P.h)?i.isUndefined(w.__state.h)&&(w.__state.h=0):w.__state.h=P.h}return n})(X.color.interpret,X.color.math=(function(){var g;return{hsv_to_rgb:function(A,t,i){var n=Math.floor(A/60)%6,o=A/60-Math.floor(A/60),r=i*(1-t),a=i*(1-o*t),l=i*(1-(1-o)*t),w=[[i,l,r],[a,i,r],[r,i,l],[r,a,i],[l,r,i],[i,r,a]][n];return{r:w[0]*255,g:w[1]*255,b:w[2]*255}},rgb_to_hsv:function(A,t,i){var n=Math.min(A,t,i),o=Math.max(A,t,i),r=o-n,a,l;if(o!=0)l=r/o;else return{h:NaN,s:0,v:0};return A==o?a=(t-i)/r:t==o?a=2+(i-A)/r:a=4+(A-t)/r,a/=6,a<0&&(a+=1),{h:a*360,s:l,v:o/255}},rgb_to_hex:function(A,t,i){var n=this.hex_with_component(0,2,A);return n=this.hex_with_component(n,1,t),n=this.hex_with_component(n,0,i),n},component_from_hex:function(A,t){return A>>t*8&255},hex_with_component:function(A,t,i){return i<<(g=t*8)|A&~(255<<g)}}})(),X.color.toString,X.utils.common),X.color.interpret,X.utils.common),X.utils.requestAnimationFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(g,A){window.setTimeout(g,1e3/60)}})(),X.dom.CenteredDiv=(function(g,A){var t=function(){this.backgroundElement=document.createElement("div"),A.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),g.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),A.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var n=this;g.bind(this.backgroundElement,"click",function(){n.hide()})};t.prototype.show=function(){var n=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),A.defer(function(){n.backgroundElement.style.opacity=1,n.domElement.style.opacity=1,n.domElement.style.webkitTransform="scale(1)"})},t.prototype.hide=function(){var n=this,o=function(){n.domElement.style.display="none",n.backgroundElement.style.display="none",g.unbind(n.domElement,"webkitTransitionEnd",o),g.unbind(n.domElement,"transitionend",o),g.unbind(n.domElement,"oTransitionEnd",o)};g.bind(this.domElement,"webkitTransitionEnd",o),g.bind(this.domElement,"transitionend",o),g.bind(this.domElement,"oTransitionEnd",o),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"},t.prototype.layout=function(){this.domElement.style.left=window.innerWidth/2-g.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-g.getHeight(this.domElement)/2+"px"};function i(n){console.log(n)}return t})(X.dom.dom,X.utils.common),X.dom.dom,X.utils.common);var Et={};window._bin_cache=Et;var Qr=nA.fromConstructor(YA,32),mr=.5;function qi(g,A,t,i){let n=g+(A-g)*i,o=A+(t-A)*i;return n+(o-n)*i}function Er(g,A,t,i,n){let o=qi(g,A,t,n),r=qi(A,t,i,n);return o+(r-o)*n}function ri(g,A){if(A>g)throw new Error("Bad call to binomial(n, i), i was > than n");if(A===0||A===g)return 1;let t=""+g+","+A;if(t in Et)return Et[t];let i=ri(g-1,A-1)+window.bin(g-1,A);return Et[t]=i,i}window.bin=ri;var br={SMOOTH:1,BREAK:2},we={BSPLINE:1,CUSTOM:2,GUASSIAN:4},et=class{constructor(A){this.fastmode=!1;this.type=A}toJSON(){return{type:this.type}}loadJSON(A){return this.type=A.type,this}redraw(){this._redraw_hook&&this._redraw_hook()}setRedrawHook(A){return this._redraw_hook=A,this}doSave(){this._save_hook&&this._save_hook()}setSaveHook(A){return this._save_hook=A,this}get hasGUI(){throw new Error("get hasGUI(): implement me!")}makeGUI(A,t,i,n,o){}killGUI(A,t,i,n,o){}evaluate(A){throw new Error("implement me!")}derivative(A){let t=1e-4;return A>1-t*3?(this.evaluate(A)-this.evaluate(A-t))/t:A<t*3?(this.evaluate(A+t)-this.evaluate(A))/t:(this.evaluate(A+t)-this.evaluate(A-t))/(2*t)}derivative2(A){let t=1e-4;return A>1-t*3?(this.derivative(A)-this.derivative(A-t))/t:A<t*3?(this.derivative(A+t)-this.derivative(A))/t:(this.derivative(A+t)-this.derivative(A-t))/(2*t)}inverse(A){let t=9,i=1/t,n=0,o,r;for(let a=0;a<t;a++,n+=i){let l=n,w=n+i,P=(l+w)*.5;for(let D=0;D<11;D++){let v=this.evaluate(l),h=this.evaluate(w);P=(l+w)*.5,Math.abs(v-A)<Math.abs(h-A)?w=P:l=P}let B=this.evaluate(P);(o===void 0||Math.abs(A-B)<o)&&(o=Math.abs(A-B),r=P)}return r===void 0?0:r}onActive(A,t){}onInactive(A,t){}reset(){}destroy(){}update(){}draw(A,t,i){}},Me={SELECT:1},bt=class g extends YA{constructor(A){super(A),this.deg=3,this.rco=new YA(A),this.sco=new YA(A),this.startco=new YA,this.eid=-1,this.flag=0,this.tangent=br.SMOOTH}copy(){let A=new g(this);return A.tangent=this.tangent,A.rco.load(A),A}toJSON(){return{0:this[0],1:this[1],eid:this.eid,flag:this.flag,deg:this.deg,tangent:this.tangent}}static fromJSON(A){let t=new g(A);return t.eid=A.eid,t.flag=A.flag,t.deg=A.deg,t.tangent=A.tangent,t}basis(A,t,i,n,o,r){let a=(i-t)*.5,l=this.rco[0];this.deg=3,t-=this.deg*a,i+=this.deg*a,n!==1&&(t=Math.max(t,0)),n!==2&&(i=Math.min(i,1)),A<=t||A>i;let w;A>l?(w=1+(l-A)/(i-l+1e-5),w=2-w):w=(A-t)/(l-t+1e-5),w*=.5,w=(A-t)/(i-t);let P=o,B=r;return w=Math.min(Math.max(w,0),1),ri(P,B)*Math.pow(w,B)*Math.pow(1-w,P-B);return w===0?0:(w*=w*w,w=1-Math.pow(1-w,2),w)}},Ai=class extends et{constructor(){super(we.BSPLINE),this.fastmode=!1,this.points=[],this.length=0,this.mpos=[0,0],this._ps=[],this.hermite=[],this.fastmode=!1,this.deg=6,this.recalc=1,this.basis_tables=[],this.eidgen=new je,this.add(0,0),this.add(1,1),this.on_mousedown=this.on_mousedown.bind(this),this.on_mousemove=this.on_mousemove.bind(this),this.on_mouseup=this.on_mouseup.bind(this),this.on_keydown=this.on_keydown.bind(this),this.on_touchstart=this.on_touchstart.bind(this),this.on_touchmove=this.on_touchmove.bind(this),this.on_touchend=this.on_touchend.bind(this),this.on_touchcancel=this.on_touchcancel.bind(this)}remove(A){let t=this.points.remove(A);return this.length=this.points.length,t}add(A,t){let i=new bt;return this.recalc=1,i.eid=this.eidgen.next(),i[0]=A,i[1]=t,i.sco.load(i),i.rco.load(i),this.points.push(i),this.update(),this.length=this.points.length,i}update(){this.recalc=1;for(let r=0;r<this.points.length;r++)this.points[r].rco.load(this.points[r]);if(this.points.sort(function(r,a){return r[0]-a[0]}),this._ps=[],this.points.length<2)return;let A=this.points[0][0],t=this.points[this.points.length-1][0];for(let r=0;r<this.points.length-1;r++)this._ps.push(this.points[r]);if(this.points.length<3)return;let i=this.points[this.points.length-1],n=this.points[this.points.length-2],o=i.copy();o.rco[0]=i.rco[0]-4e-5,o.rco[1]=n.rco[1]+(i.rco[1]-n.rco[1])*1/3,o=i.copy(),o.rco[0]=i.rco[0]-3e-5,o.rco[1]=n.rco[1]+(i.rco[1]-n.rco[1])*1/3,o=i.copy(),o.rco[0]=i.rco[0]-1e-5,o.rco[1]=n.rco[1]+(i.rco[1]-n.rco[1])*1/3,this._ps.push(o),o=i.copy(),o.rco[0]=i.rco[0]-1e-5,o.rco[1]=n.rco[1]+(i.rco[1]-n.rco[1])*2/3,this._ps.push(o),this._ps.push(i);for(let r=0;r<this._ps.length;r++)this._ps[r].rco.load(this._ps[r]);for(let r=0;r<this.points.length;r++){let a=this.points[r],l=a[0],w=a[1];a.sco[0]=l,a.sco[1]=w}}toJSON(){let A=super.toJSON(),t=[];for(let i=0;i<this.points.length;i++)t.push(this.points[i].toJSON());return Object.assign(A,{points:t,deg:this.deg,eidgen:this.eidgen.toJSON()})}loadJSON(A){super.loadJSON(A),this.length=0,this.points=[],this._ps=[],this.hightlight=void 0,this.eidgen=je.fromJSON(A.eidgen),this.recalc=1,this.mpos=[0,0],A.deg!==void 0&&(this.deg=A.deg);let t=A.points;for(let i=0;i<t.length;i++)this.points.push(bt.fromJSON(t[i]));return this.redraw(),this}basis(A,t){this.recalc&&this.regen_basis(),t=Math.min(Math.max(t,0),this._ps.length-1),A=Math.min(Math.max(A,0),1)*.999999999;let i=this.basis_tables[t],n=A*(i.length/4)*.99999,o=~~n;return n-=o,o*=4,i[o]+(i[o+3]-i[o])*n;return Er(i[o],i[o+1],i[o+2],i[o+3],n)}reset(){return this.length=0,this.points=[],this._ps=[],this.add(0,0),this.add(.5,.5),this.add(1,1),this.update(),this}regen_hermite(A){console.log("building spline approx"),A=A===void 0?240:A,this.hermite=new Array(A);let t=this.hermite,i=1e-5,n=(1-i*8)/(A-1),o=i*4,r=0,a=0;for(let l=0;l<A;l++,o+=n){let w=this._evaluate(o-i*2),P=this._evaluate(o-i),B=this._evaluate(o),D=this._evaluate(o+i),v=this._evaluate(o+i*2),h=(D-P)/(i*2);if(h/=A,l>0){let u=l-1;t[u*4]=a,t[u*4+1]=a+r/3,t[u*4+2]=B-h/3,t[u*4+3]=B}r=h,a=B}}regen_basis(){console.log("building basis functions"),this.recalc=0;let A=this.fastmode?64:128;this.basis_tables=new Array(this._ps.length);for(let t=0;t<this._ps.length;t++){let i=this.basis_tables[t]=new Array((A-1)*4),n=1e-5,o=(1-n*8)/(A-1),r=n*4,a=0,l=0;for(let w=0;w<A;w++,r+=o){let P=this._basis(r-n*2,t),B=this._basis(r-n,t),D=this._basis(r,t),v=this._basis(r+n,t),h=this._basis(r+n*2,t),u=(v-B)/(n*2);if(u/=A,w>0){let m=w-1;i[m*4]=l,i[m*4+1]=l+a/3,i[m*4+2]=D-u/3,i[m*4+3]=D}a=u,l=D}}this.regen_hermite()}_basis(A,t){let i=this._ps.length,n=this._ps;function o(D){return D===0?0:1/D}function r(D,v,h){let u=Math.min(Math.max(v-1,0),i-1),m=Math.min(Math.max(v+1,0),i-1),Q=Math.min(Math.max(v+h,0),i-1),I=Math.min(Math.max(v+h+1,0),i-1),d=Math.min(Math.max(v,0),i-1);if(h===0)return D>=n[d].rco[0]&&D<n[m].rco[0]?1:0;{let F=(D-n[d].rco[0])*o(n[Q].rco[0]-n[d].rco[0]+1e-4),p=(n[I].rco[0]-D)*o(n[I].rco[0]-n[m].rco[0]+1e-4);return F*r(D,v,h-1)+p*r(D,v+1,h-1)}}let a=this._ps[t].rco,l,w,P=this.deg;return r(A,t-P,P)}evaluate(A){let t=this.points[0].rco,i=this.points[this.points.length-1].rco;if(A<t[0])return t[1];if(A>i[0])return i[1];if(this.points.length===2)return A=(A-t[0])/(i[0]-t[0]),t[1]+(i[1]-t[1])*A;this.recalc&&this.regen_basis(),A*=.999999;let n=this.hermite,o=A*(n.length/4),r=Math.floor(o);return o-=r,r*=4,n[r]+(n[r+3]-n[r])*o}_evaluate(A){let t=A;if(this.points.length>1){let i=this.points[0],n=this.points[this.points.length-1];if(A<i[0])return i[1];if(A>=n[0])return n[1]}for(let i=0;i<35;i++){let n=1e-4,o=this._evaluate2(A<.5?A:A-n),r=this._evaluate2(A<.5?A+n:A),a=Math.abs(o[0]-t),l=Math.abs(r[0]-t),w=(l-a)/n;if(a===l)break;if(a===0||w===0)return this._evaluate2(A)[1];let P=-(a/w)*.5;P===0?P=.01:Math.abs(P)>.1&&(P=.1*Math.sign(P)),A+=P;let B=1e-5;A=Math.min(Math.max(A,B),1-B)}return this._evaluate2(A)[1]}_evaluate2(A){let t=Qr.next();A*=.9999999;let i=0,n=0,o=0;for(let r=0;r<this._ps.length;r++){let a=this._ps[r].rco,l=this.basis(A,r);n+=l*a[0],o+=l*a[1],i+=l}return i!==0&&(n/=i,o/=i),t[0]=n,t[1]=o,t}get hasGUI(){return this.uidata!==void 0}on_touchstart(A){this.mpos[0]=A.touches[0].pageX,this.mpos[1]=A.touches[0].pageY,this.on_mousedown({x:A.touches[0].pageX,y:A.touches[0].pageY,button:0,shiftKey:A.shiftKey,altKey:A.altKey,ctrlKey:A.ctrlKey,isTouch:!0,commandKey:Reflect.get(A,"commandKey")})}on_touchmove(A){this.mpos[0]=A.touches[0].pageX,this.mpos[1]=A.touches[0].pageY,this.on_mousemove({x:A.touches[0].pageX,y:A.touches[0].pageY,button:0,shiftKey:A.shiftKey,altKey:A.altKey,ctrlKey:A.ctrlKey,commandKey:Reflect.get(A,"commandKey"),preventDefault:()=>A.preventDefault(),stopPropagation:()=>A.stopPropagation(),isTouch:!0})}on_touchend(A){this.on_mouseup({x:this.mpos[0],y:this.mpos[1],button:0,shiftKey:A.shiftKey,altKey:A.altKey,ctrlKey:A.ctrlKey,isTouch:!0,commandKey:Reflect.get(A,"commandKey")})}on_touchcancel(A){this.on_touchend(A)}makeGUI(A,t,i,n,o){this.uidata={start_mpos:new YA,transpoints:[],dom:A,gui:t,canvas:i,g:n,transforming:!1,draw_trans:o},i.addEventListener("touchstart",this.on_touchstart),i.addEventListener("touchmove",this.on_touchmove),i.addEventListener("touchend",this.on_touchend),i.addEventListener("touchcancel",this.on_touchcancel),i.addEventListener("mousedown",this.on_mousedown),i.addEventListener("mousemove",this.on_mousemove),i.addEventListener("mouseup",this.on_mouseup),i.addEventListener("keydown",this.on_keydown);let r=document.createElement("button");return r.innerHTML="Delete Point",A.appendChild(r),this.button=r,r.addEventListener("click",a=>{console.log("delete point");for(let l=0;l<this.points.length;l++){let w=this.points[l];w.flag&Me.SELECT&&(this.points.remove(w),l--)}this.update(),this.redraw(),this.doSave()}),this.uidata.button=r,this}killGUI(A,t,i,n,o){if(this.uidata!==void 0){let r=this.uidata;this.uidata=void 0,r.button.remove(),console.log("removing event handlers for bspline curve"),i.removeEventListener("touchstart",this.on_touchstart),i.removeEventListener("touchmove",this.on_touchmove),i.removeEventListener("touchend",this.on_touchend),i.removeEventListener("touchcancel",this.on_touchcancel),i.removeEventListener("mousedown",this.on_mousedown),i.removeEventListener("mousemove",this.on_mousemove),i.removeEventListener("mouseup",this.on_mouseup),i.removeEventListener("keydown",this.on_keydown)}return this}start_transform(){this.uidata.transpoints=[];for(let A of this.points)A.flag&Me.SELECT&&(this.uidata.transpoints.push(A),A.startco.load(A))}on_mousedown(A){console.log("bspline mdown"),this.uidata.start_mpos.load(this.transform_mpos(A.x,A.y)),this.fastmode=!0;let t=this.transform_mpos(A.x,A.y),i=t[0],n=t[1];if(this.do_highlight(i,n),this.points.highlight!==void 0){if(A.shiftKey)this.points.highlight.flag^=Me.SELECT;else{for(let o=0;o<this.points.length;o++)this.points[o].flag&=~Me.SELECT;this.points.highlight.flag|=Me.SELECT}this.uidata.transforming=!0,this.start_transform(),this.redraw();return}else if(!A.isTouch){let o=this.add(this.uidata.start_mpos[0],this.uidata.start_mpos[1]);this.points.highlight=o,this.update(),this.redraw(),this.points.highlight.flag|=Me.SELECT,this.uidata.transforming=!0,this.uidata.transpoints=[this.points.highlight],this.uidata.transpoints[0].startco.load(this.uidata.transpoints[0])}}do_highlight(A,t){let i=this.uidata.draw_trans,n=1e17,o,r=19/i[0],a=r*r;for(let l=0;l<this.points.length;l++){let w=this.points[l],P=A-w.sco[0],B=t-w.sco[1],D=P*P+B*B;D<n&&D<a&&(n=D,o=w)}this.points.highlight!==o&&(this.points.highlight=o,this.redraw())}do_transform(A,t){let i=new YA([A,t]).sub(this.uidata.start_mpos);this.points.recalc=1;for(let n=0;n<this.uidata.transpoints.length;n++){let o=this.uidata.transpoints[n];o.load(o.startco).add(i),o[0]=Math.min(Math.max(o[0],0),1),o[1]=Math.min(Math.max(o[1],0),1)}this.update(),this.redraw()}transform_mpos(A,t){let i=this.uidata.canvas.getClientRects()[0];A-=parseInt(i.left),t-=parseInt(i.top);let n=this.uidata.draw_trans;return A=A/n[0]-n[1][0],t=-t/n[0]-n[1][1],[A,t]}on_mousemove(A){A.isTouch&&this.uidata.transforming&&A.preventDefault();let t=this.transform_mpos(A.x,A.y),i=t[0],n=t[1];this.uidata.transforming?(this.do_transform(i,n),this.doSave()):this.do_highlight(i,n)}on_mouseup(A){console.log("bspline mup"),this.uidata.transforming=!1,this.fastmode=!1,this.update(),window.redraw_all()}on_keydown(A){switch(console.log(A.keyCode),A.keyCode){case 88:case 46:console.log(this.points.highlight),this.points.highlight!==void 0&&(this.points.remove(this.points.highlight),this.recalc=1,this.points.highlight=void 0,this.update(),this._save_hook!==void 0&&this._save_hook(),window.redraw_all());break}}draw(A,t,i){t.save(),this.uidata.canvas=A,this.uidata.g=t,this.uidata.draw_trans=i;let n=i[0],o=i[1];t.lineWidth*=3;let r=.03;for(let a=0;a<2;a++)break;t.lineWidth/=3;for(let a of this.points)t.beginPath(),a===this.points.highlight?t.fillStyle="green":a.flag&Me.SELECT?t.fillStyle="red":t.fillStyle="orange",t.rect(a.sco[0]-r/2,a.sco[1]-r/2,r,r),t.fill();t.restore()}},ei=class extends et{constructor(A){super(we.CUSTOM);this._haserror=!1;this.equation="x"}toJSON(){let A=super.toJSON();return Object.assign(A,{equation:this.equation})}loadJSON(A){return super.loadJSON(A),A.equation!==void 0&&(this.equation=A.equation),this}get hasGUI(){return this.uidata!==void 0}makeGUI(A,t,i,n,o){this.uidata={dom:A,gui:t,canvas:i,g:n,draw_trans:o};let r=document.createElement("input");r.type="text",r.value=this.equation,this.uidata.textbox=r,r.addEventListener("change",a=>{this.equation=r.value,this.update(),this.redraw(),this.doSave()}),A.appendChild(r)}killGUI(A,t,i,n,o){this.uidata!==void 0&&this.uidata.textbox.remove(),this.uidata=void 0}evaluate(s){let sin=Math.sin,cos=Math.cos,pi=Math.PI,PI=Math.PI,e=Math.E,E=Math.E,tan=Math.tan,abs=Math.abs,floor=Math.floor,ceil=Math.ceil,acos=Math.acos,asin=Math.asin,atan=Math.atan,cosh=Math.cos,sinh=Math.sinh,log=Math.log,pow=Math.pow,exp=Math.exp,sqrt=Math.sqrt,cbrt=Math.cbrt,min=Math.min,max=Math.max;try{let x=s,ret=eval(this.equation);return this._haserror=!1,ret}catch(A){return this._haserror=!0,console.log("ERROR!"),0}}derivative(A){let t=1e-4;return A>1-t*3?(this.evaluate(A)-this.evaluate(A-t))/t:A<t*3?(this.evaluate(A+t)-this.evaluate(A))/t:(this.evaluate(A+t)-this.evaluate(A-t))/(2*t)}derivative2(A){let t=1e-4;return A>1-t*3?(this.derivative(A)-this.derivative(A-t))/t:A<t*3?(this.derivative(A+t)-this.derivative(A))/t:(this.derivative(A+t)-this.derivative(A-t))/(2*t)}inverse(A){let t=9,i=1/t,n=0,o,r;for(let a=0;a<t;a++,n+=i){let l=n,w=n+i,P=(l+w)*.5;for(let D=0;D<11;D++){let v=this.evaluate(l),h=this.evaluate(w);P=(l+w)*.5,Math.abs(v-A)<Math.abs(h-A)?w=P:l=P}let B=this.evaluate(P);(o===void 0||Math.abs(A-B)<o)&&(o=Math.abs(A-B),r=P)}return r===void 0?0:r}onActive(A,t){}onInactive(A,t){}reset(){}destroy(){}update(){}draw(A,t,i){if(t.save(),this._haserror){t.fillStyle=t.strokeStyle="rgba(255, 50, 0, 0.25)",t.beginPath(),t.rect(0,0,1,1),t.fill(),t.beginPath(),t.moveTo(0,0),t.lineTo(1,1),t.moveTo(0,1),t.lineTo(1,0),t.lineWidth*=3,t.stroke(),t.restore();return}t.restore()}},ti=class extends et{constructor(A){super(we.GUASSIAN),this.height=1,this.offset=1,this.deviation=.3}toJSON(){let A=super.toJSON();return Object.assign(A,{height:this.height,offset:this.offset,deviation:this.deviation})}loadJSON(A){return super.loadJSON(A),this.height=A.height!==void 0?A.height:1,this.offset=A.offset,this.deviation=A.deviation,this}get hasGUI(){return this.uidata!==void 0}makeGUI(A,t,i,n,o){this.uidata={dom:A,gui:t,canvas:i,g:n,draw_trans:o},this.uidata.hslider=t.slider(void 0,"Height",this.height,-10,10,1e-4,!1,!1,r=>{this.height=r,this.update(),this.redraw()}),this.uidata.oslider=t.slider(void 0,"Offset",this.offset,-2.5,2.5,1e-4,!1,!1,r=>{this.offset=r,this.update(),this.redraw()}),this.uidata.dslider=t.slider(void 0,"STD Deviation",this.deviation,1e-4,1.25,1e-4,!1,!1,r=>{this.deviation=r,this.update(),this.redraw()})}killGUI(A,t,i,n,o){this.uidata!==void 0&&(this.uidata.hslider.remove(),this.uidata.oslider.remove(),this.uidata.dslider.remove()),this.uidata=void 0}evaluate(A){return this.height*Math.exp(-((A-this.offset)*(A-this.offset))/(2*this.deviation*this.deviation))}derivative(A){let t=1e-4;return A>1-t*3?(this.evaluate(A)-this.evaluate(A-t))/t:A<t*3?(this.evaluate(A+t)-this.evaluate(A))/t:(this.evaluate(A+t)-this.evaluate(A-t))/(2*t)}derivative2(A){let t=1e-4;return A>1-t*3?(this.derivative(A)-this.derivative(A-t))/t:A<t*3?(this.derivative(A+t)-this.derivative(A))/t:(this.derivative(A+t)-this.derivative(A-t))/(2*t)}inverse(A){let t=9,i=1/t,n=0,o,r;for(let a=0;a<t;a++,n+=i){let l=n,w=n+i,P=(l+w)*.5;for(let D=0;D<11;D++){let v=this.evaluate(l),h=this.evaluate(w);P=(l+w)*.5,Math.abs(v-A)<Math.abs(h-A)?w=P:l=P}let B=this.evaluate(P);(o===void 0||Math.abs(A-B)<o)&&(o=Math.abs(A-B),r=P)}return r===void 0?0:r}onActive(A,t){}onInactive(A,t){}reset(){}destroy(){}update(){}},$t={[we.BSPLINE]:Ai,[we.CUSTOM]:ei,[we.GUASSIAN]:ti},ii=class{constructor(A){if(this.generators=[],this.setting_id=A,this.uidata=void 0,this._fastmode=!1,A===void 0)throw new Error("setting_id cannot be undefined");for(let t in $t){let i=new $t[t];this.generators.push(i)}this.generators.active=this.generators[0]}redraw(){this._redraw_hook!==void 0&&this._redraw_hook()}setRedrawHook(A){for(let t of this.generators)t.setRedrawHook(A);this._redraw_hook=A}doSave(){this._save_hook&&this._save_hook()}setSaveHook(A){this._save_hook=A;for(let t of this.generators)t.setSaveHook(A);return this}get fastmode(){return this._fastmode}set fastmode(A){this._fastmode=A;for(let t of this.generators)t.fastmode=A}toJSON(){let A={is_new_curve:!0,setting_id:this.setting_id,generators:[],version:mr,active_generator:this.generators.indexOf(this.generators.active)};for(let t of this.generators)A.generators.push(t.toJSON());return A}getGenerator(A){for(let t of this.generators)if(t.type===A)return t;throw new Error("Unknown generator "+A+".")}switchGenerator(A){let t=this.getGenerator(A);if(t!==this.generators.active){let i=this.generators.active;if(this.generators.active=t,this.uidata!==void 0){let n=this.uidata;i.killGUI(n.dom,n.gui,n.canvas,n.g,n.draw_trans)}if(i.onInactive(this),t.onActive(this),this.uidata!==void 0){let n=this.uidata;t.makeGUI(n.dom,n.gui,n.canvas,n.g,n.draw_trans)}}return t}destroy(){if(this.uidata!==void 0){let A=this.uidata;this.killGUI(A.dom,A.gui,A.canvas,A.g,A.draw_trans);for(let t of this.generators)t.destroy()}return this}loadJSON(A){if(A.is_new_curve===void 0){let n=this.uidata!==void 0,o=this.uidata;if(n){let a=o;this.killGUI(a.dom,a.gui,a.canvas,a.g,a.draw_trans)}let r=this.switchGenerator(we.BSPLINE);if(this.generators.active=r,A.type=we.BSPLINE,r.reset(),r.loadJSON(A),n){let a=o;this.makeGUI(a.dom,a.gui,a.canvas,a.g,a.draw_trans)}return this.update(),this.redraw(),this}let t=this.uidata!==void 0,i=this.uidata;if(t){let n=i;this.killGUI(n.dom,n.gui,n.canvas,n.g,n.draw_trans)}this.setting_id===void 0&&(console.warn("Warning, setting setting_id in Curve.loadJSON(); you forgot to pass it to the constructor"),this.setting_id=A.setting_id);for(let n of A.generators){if(!(n.type in $t))throw new Error("Bad generator type "+n.type);this.getGenerator(n.type).loadJSON(n).update()}if(this.generators.active=this.generators[A.active_generator],t){let n=i;this.makeGUI(n.dom,n.gui,n.canvas,n.g,n.draw_trans)}return this.update(),this.redraw(),this}evaluate(A){return this.generators.active.evaluate(A)}derivative(A){return this.generators.active.derivative(A)}derivative2(A){return this.generators.active.derivative2(A)}inverse(A){return this.generators.active.inverse(A)}reset(){this.generators.active.reset()}update(){return this.generators.active.update()}destroy_all_settings(){return delete localStorage[this.setting_id],this}makeGUI(A,t,i,n,o){this.uidata={dom:A,gui:t,canvas:i,g:n,draw_trans:o},this.generators.active.hasGUI&&this.generators.active.killGUI(A,t,i,n,o);let r={},a=we;for(let l in a){let w=a[l];l=l[0].toUpperCase()+l.slice(1,l.length).toLowerCase(),l=l.replace(/_/g," "),r[l]=w}return this.uidata.listenum=t.listenum(void 0,"Type",r,this.generators.active.type,l=>{this.switchGenerator(l),this.doSave(),this.redraw()}),this.generators.active.makeGUI(A,t,i,n,o),this}get hasGUI(){return this.uidata!==void 0}killGUI(A,t,i,n,o){this.uidata.listenum.remove();for(let r of this.generators)this.generators.active.killGUI(A,t,i,n,o);return this.uidata=void 0,this}draw(A,t,i){if(this.uidata===void 0)return;this.uidata.canvas=A,this.uidata.g=t,this.uidata.draw_trans=i;let n=A.width,o=A.height;t.save();let r=i[0],a=i[1];t.beginPath(),t.moveTo(-1,0),t.lineTo(1,0),t.strokeStyle="red",t.stroke(),t.beginPath(),t.moveTo(0,-1),t.lineTo(0,1),t.strokeStyle="green",t.stroke();let l=0,w=64,P=1/(w-1);n=6/r;let B=this.generators.active;t.beginPath();for(let D=0;D<w;D++,l+=P){let v=B.evaluate(l);(D===0?t.moveTo:t.lineTo).call(t,l,v,n,n)}if(t.strokeStyle="grey",t.stroke(),this.overlay_curvefunc!==void 0){t.beginPath(),l=0;for(let D=0;D<w;D++,l+=P){let v=this.overlay_curvefunc(l);(D===0?t.moveTo:t.lineTo).call(t,l,v,n,n)}t.strokeStyle="green",t.stroke()}return this.generators.active.draw(A,t,i),t.restore(),this}},ni=class{constructor(A){this.curve=new ii(A),this.setting_id=A,this._closed=!1,this.mpos=[0,0],this.domparent=void 0,this.canvas=void 0,this.g=void 0,this.overlay_curvefunc=void 0,this.curve.setSaveHook(this.save.bind(this)),this.curve.setRedrawHook(this.redraw.bind(this))}redraw(){this.draw()}save(){localStorage[this.setting_id]=JSON.stringify(this.curve)}clearData(){return delete localStorage[this.setting_id],this}load(A){this.setting_id in localStorage?this.curve.loadJSON(JSON.parse(localStorage[this.setting_id])):A!==void 0&&this.curve.loadJSON(A),this.curve.update(),this.draw()}bind(A,t){this.canvas=document.createElement("canvas"),this.canvas.width=200,this.canvas.height=200,this.g=this.canvas.getContext("2d"),this.gui=t,this.domparent=A,Reflect.set(this.canvas,"class","closed"),Reflect.set(this.canvas.style,"class","closed"),A.appendChild(this.canvas),this.curve.makeGUI(A,t,this.canvas,this.g,this.draw_transform())}draw_transform(A){let t=Math.min(this.canvas.width,this.canvas.height);t*=.8;let i=[.1,-1.1];return A!==void 0&&(A.lineWidth/=t,A.scale(t,-t),A.translate(i[0],i[1])),[t,i]}get closed(){return this._closed}set closed(A){A&&!this._closed?(this.curve.killGUI(this.domparent,this.gui,this.canvas,this.g,this.draw_transform()),this.canvas.remove()):!A&&this._closed&&(this.domparent.appendChild(this.canvas),this.curve.makeGUI(this.domparent,this.gui,this.canvas,this.g,this.draw_transform()),this.redraw()),this._closed=A}draw(){if(this.canvas===void 0)return;let A=this.g,t=this.canvas.width,i=this.canvas.height;A.clearRect(0,0,t,i),A.fillStyle="rgb(50, 50, 50)",A.beginPath(),A.rect(0,0,t,i),A.fill(),A.save();let n=this.draw_transform(A);A.strokeStyle="rgb(100,100,100)",A.beginPath(),A.rect(0,0,1,1),A.stroke(),this.curve.draw(this.canvas,A,n),A.restore()}};function Hs(g,A){let t=localStorage.startup_file_bn6,i;if(t===void 0)i={};else try{i=JSON.parse(t)}catch{console.log("Warning, failed to parse cached settings"),i={}}i[g]=A,localStorage.startup_file_bn6=JSON.stringify(i)}function Ms(g){let A=localStorage.startup_file_bn6,t;if(A===void 0)t={};else try{t=JSON.parse(A)}catch{console.log("Warning, failed to parse cached settings"),t={}}return t[g]}var Se=class extends Array{constructor(A){super();let t=A.split(".");for(let i of t)this.push(i)}},tt=class g{constructor(A,t,i,n,o){this.state=t,this.parent=n,this.name=i!==void 0?i:"undefined",this.storagePrefix=A,this.dat=o||new dat.GUI,this.controls=[],this.curve_widgets=[],this.panelmap={},this._last_closed=!0}save(){this.saveVisibility(),this.saveCurves()}clearData(){for(let A of this.controls)A instanceof g&&A.clearData();for(let A of this.curve_widgets)A.clearData();return this}load(){this.loadVisibility(),this.loadCurves()}loadCurves(){for(let A of this.controls)A instanceof g&&A.loadCurves();for(let A of this.curve_widgets)A.load();return this}saveCurves(){for(let A of this.controls)A instanceof g&&A.loadCurves();for(let A of this.curve_widgets)A.save();return this}saveVisibility(){return localStorage[this.storagePrefix+"_settings"]=JSON.stringify(this),this}loadVisibility(){let A=this.storagePrefix+"_settings",t=!0;if(A in localStorage){console.log("loading UI visibility state. . .");try{this.loadJSON(JSON.parse(localStorage[A]))}catch(i){nt(i),t=!1}}return t}toJSON(){let A={panels:{},opened:!this.dat.closed};for(let t of this.controls)t instanceof g&&(A.panels[t.name]=t.toJSON());return A}loadJSON(A){console.log(A),A.opened?this.open():this.close();for(let t in A.panels){let i=A.panels[t];if(!(t in this.panelmap)){console.warn("Warning, panel",t,"not in panelmap!");continue}this.panelmap[t].loadJSON(i)}return this}redrawCurves(){if(!this.dat.closed){for(let A of this.curve_widgets)A.draw();for(let A of this.controls)A instanceof g&&A.redrawCurves()}}update(){for(let A of this.controls)A instanceof g?A.update():A.updateDisplay()}destroy(){this.dat.destroy()}panel(A){let t=this.dat.addFolder(A);t.open();let i=new g(this.storagePrefix+"_"+A,this.state,A,this,t);return this.controls.push(i),this.panelmap[A]=i,i}close(){this.dat.close()}open(){this.dat.open()}button(A,t,i,n){let o=this.dat.add({cb:function(){n!==void 0?i.call(n):i()}},"cb").name(t);return this.controls.push(o),o}_path_get(A){let t=typeof A=="string"||A instanceof String?new Se(A):A,i=this.state,n;for(let o of t)n=i,i=Reflect.get(i,o);return[i,n]}_path_set(A,t){let i=this.state;for(let n=0;n<A.length-1;n++)i=Reflect.get(i,A[n]);Reflect.set(i,A[A.length-1],t),window._appstate.save()}check(A,t){let i=new Se(A),n=t.replace(/ /g,"_"),o={},r=this;Object.defineProperty(o,n,{get:function(){return r._path_get(i)[0]},set:function(l){r._path_set(i,l),window.redraw_all()}});let a=this.dat.add(o,n).name(t);return this._add_control(a)}listenum(A,t,i,n,o){let r=A!==void 0?new Se(A):void 0,a=t.replace(/ /g,"_"),l={},w=this,P=!1;for(let v in i)typeof i[v]=="number"&&(P=!0);if(n===void 0)throw new Error("missing parameter: defaultval can't be undefined");r===void 0&&(l._val=n),r!==void 0&&w._path_get(r)[0]===void 0&&w._path_set(r,n),Object.defineProperty(l,a,{get:function(){return r!==void 0?w._path_get(r)[0]:this._val},set:function(v){P&&(v=parseInt(v)),r!==void 0?w._path_set(r,v):this._val=v,o!==void 0&&o(v)}});let B=i,D=this.dat.add(l,a,B).name(t);return D.listen(),this._add_control(D)}getroot(){let A=this;for(;A.parent!==void 0;)A=A.parent;return A}on_tick(){if(this.dat===void 0){console.log("warning, dead ui panel");return}this.dat.closed!==this._last_closed&&(this._last_closed=this.dat.closed,this.getroot().saveVisibility());for(let t=0;t<this.controls.length;t++){let i=this.controls[t];i instanceof g&&i.on_tick()}let A=this.dat.closed;for(let t=0;t<this.curve_widgets.length;t++){let i=this.curve_widgets[t];i.closed=A}}curve(A,t,i){let n=new ni(this.storagePrefix+A);i!==void 0&&n.load(i);let o=this.dat.add({bleh:"name"},"bleh"),r=o.domElement.parentElement.parentElement.parentElement;return r.class=r.style.class="closed",n.bind(r,this),n.draw(),o.remove(),this.curve_widgets.push(n),n}slider(A,t,i,n,o,r,a,l,w){let P=A!==void 0?new Se(A):void 0,B=t.replace(/ /g,"_"),D={},v=this;if(i===void 0)throw new Error("missing parameter: defaultval can't be undefined");P!==void 0&&v._path_get(P)[0]===void 0&&v._path_set(P,i),P===void 0&&(D._val=i),Object.defineProperty(D,B,{get:function(){return P!==void 0?v._path_get(P)[0]:this._val},set:function(u){l&&window.redraw_all(),P!==void 0?v._path_set(P,u):this._val=u,w!==void 0&&w(u)}});let h=this.dat.add(D,B).name(t).min(n).max(o).step(r).name(t);return this._add_control(h)}_add_control(A){let t=A.remove,i=this;return A.remove=function(...n){i.controls.indexOf(A)>=0&&i.controls.remove(A),t.apply(A,n)},this.controls.push(A),A}};var Wi=2,Zi=3,$i=4,An=5,en=6,tn=7,nn={black:[0,0,0,1],grey:[.5,.5,.5,1],orange:[1,.7,.1,1],white:[1,1,1,1]},xr=/(rgb|rgba)\([0-9]+\,[0-9]+\,[0-9]+\,(([0-9]*\.[0-9]+)|([0-9]+))\)/;var rn=nA.fromConstructor(W,64),it=class{constructor(A,t){this.circles=[],this.width=A,this.height=t,this.buffer=new Float32Array(A*t*4),this.image=new ImageData(A,t),this.mat=new ae,this.matstack=[],this._color=[0,0,0,1]}arc(A,t,i,n,o){let r=rn.next().zero();r[0]=A,r[1]=t,i*=this.mat.$matrix.m11,r.multVecMatrix(this.mat),A=r[0],t=r[1];let a=this.circles,l=a.length;for(let w=0;w<tn;w++)a.push(0);a[l]=A,a[l+1]=t,a[l+Wi]=i,a[l+Zi]=this._color[0],a[l+$i]=this._color[1],a[l+An]=this._color[2],a[l+en]=this._color[3]}scale(A,t){this.mat.scale(A,t,1)}translate(A,t){this.mat.translate(A,t,0)}clearRect(A,t,i,n){}reset(){this.circles.length=0}lineTo(){}_transform(A,t){let i=rn.next().zero();return i[0]=A,i[1]=t,i.multVecMatrix(this.mat),i}rect(A,t,i,n){}beginPath(){}moveTo(A,t){}save(){this.matstack.push(new ae(this.mat))}restore(){let A=this.matstack.pop();A!==void 0&&this.mat.load(A)}set fillStyle(A){if(A===void 0)throw new Error("fillStyle cannot be undefined");A=A.toLowerCase().replace(/[ \t\n\r]/g,"");let t;if(A in nn)t=nn[A];else{if(!xr.test(A))throw new Error("invalid css color: "+A);let i=A.startsWith("rgba"),n=i?"rgba(":"rgb(";A=A.slice(n.length,A.length-1);let o=A.split(",");t=[parseInt(o[0]),parseInt(o[1]),parseInt(o[2]),i?parseFloat(o[3]):1],isNaN(o[3])&&(t[3]=1),t[0]/=255,t[1]/=255,t[2]/=255}for(let i=0;i<4;i++)this._color[i]=t[i]}get fillStyle(){let A=~~(this._color[0]*255),t=~~(this._color[1]*255),i=~~(this._color[2]*255);return"rgba("+A+","+t+","+i+","+this._color[3]+")"}fill(){}render(){let A=this.circles,t=this.width,i=this.height,n=this.buffer;n.fill(0,0,n.length);let o=.55,r=4,a=IA.get_searchoff(r),l=0;if(r!=0)for(let P of a){let B=P[0]/r*o,D=P[1]/r*o,v=1-Math.sqrt(B*B+D*D)/Math.sqrt(2*o);v*=v,v=v*.95+.05,this.render_intern(B,D,v),l+=v}else this.render_intern(0,0,1),l=1;let w=this.image.data;for(let P=0;P<n.length;P++)n[P]/=l;if(!c.BLACK_BG)for(let P=0;P<n.length;P+=4){for(let B=0;B<3;B++)n[B]+=(1-n[B])*(1-n[3]);n[3]=1}for(let P=0;P<n.length;P++){let B=~~(n[P]*255+(Math.random()-.5)*1.75);B=Math.min(Math.max(B,0),255),w[P]=B}return this.image}render_intern(A,t,i){let n=this.circles,o=this.width,r=this.height,a=this.buffer,l=Math.sqrt(o*r),w=new Uint8Array(o*r);for(let P=0;P<n.length;P+=tn){let B=n[P],D=n[P+1],v=n[P+Wi],h=n[P+Zi],u=n[P+$i],m=n[P+An],Q=n[P+en],I=B+A+.5,d=D+t+.5,F=Math.floor(v+.5);F=Math.max(F,1);let p=IA.get_searchoff(F+1);for(let H of p){let b=H[0]+Math.fract(I),L=H[1]+Math.fract(d),M=~~(I+H[0]+.5),T=~~(d+H[1]+.5),G=i;if(b*b+L*L>=v*v*1.01||M<0||T<0||M>=o||T>=r)continue;let S=T*o+M,j=S*4;w[S]||(w[S]=1,a[j]+=h*G,a[j+1]+=u*G,a[j+2]+=m*G,a[j+3]+=Q*G)}}}};var _A="http://www.w3.org/2000/svg",sn=ae,It=YA;var fn=/rgba\(\d+,\d+,\d+,\d+(\.?\d+)?\)$/;window._rgbaPath=fn;function on(g){return g=g.toLowerCase().replace(/[ \t\n\r]/g,""),!!fn.exec(g)}window._isRGBA=on;function Mr(g){if(!on(g))throw new Error("not rgba pattern");return g=g.toLowerCase(),g=g.replace(/[ \t\n\r]/g,"").replace(/rgba\(/,""),g=g.replace(/\)/,""),g.split(",").map(t=>parseFloat(t))}window._parseRGBA=Mr;function Pe(g){return g.toFixed(4)}var Lr=nA.fromConstructor(It,32),si=class{constructor(){this.svg=document.createElementNS(_A,"svg"),this.svg.setAttribute("xmlns",_A),this.width=this.height=512,this.fillStyle="black",this.strokeStyle="black",this.lineWidth=1,this.stack=[],this.matrix=new sn,this.start=new It,this.hasStart=!1,this.p1=new It,this.p2=new It,this.path="",this.output=""}set width(A){this.svg.setAttributeNS(_A,"width",String(A)),this._width=A}set height(A){this.svg.setAttributeNS(_A,"height",String(A)),this._height=A}get width(){return this._width}get height(){return this._height}getContext(){return this}putImageData(){}drawImage(){}copyState(){return{fillStyle:this.fillStyle,strokeStyle:this.strokeStyle,lineWidth:this.lineWidth,matrix:new sn(this.matrix)}}loadState(A){for(let t in A){let i=t;this[i]=A[i]}return this}_doStart(A,t){this.hasStart||(this.hasStart=!0,this.start[0]=A,this.start[1]=t)}save(){return this.stack.push(this.copyState()),this}restore(){return this.loadState(this.stack.pop()),this}_t(A,t){let i=Lr.next();i[0]=A,i[1]=t,i.multVecMatrix(this.matrix);let n=this.width>this.height?this.width:this.height;return i[0]-=n/2,i[1]-=n/2,i}beginPath(){this.hasStart=!1,this.path="",this.node=document.createElementNS(_A,"path")}moveTo(A,t){[A,t]=this._t(A,t),this._doStart(A,t),this.path+=`M ${Pe(A)} ${Pe(t)} `,this.p1[0]=A,this.p1[1]=t}lineTo(A,t){[A,t]=this._t(A,t),this._doStart(A,t),this.path+=`L ${Pe(A)} ${Pe(t)} `,this.p1[0]=A,this.p1[1]=t}arc(A,t,i,n,o){[A,t]=this._t(A,t),this._doStart(A,t),i*=this.matrix.$matrix.m11,this.path+=`A ${Pe(i)} ${Pe(i)} `,this.path+=`${Pe(o-n)} 1 1 ${Pe(A)} ${Pe(t)} `,this.p1[0]=A,this.p1[1]=t}closePath(){this.path+="Z "}_checkNode(){this.path.length>0&&!this.node.parentNode&&this.svg.appendChild(this.node)}rect(A,t,i,n){[A,t]=this._t(A,t),i*=this.matrix.$matrix.m11,n*=this.matrix.$matrix.m22,this.moveTo(A,t),this.lineTo(A,t+n),this.lineTo(A+n,t+n),this.lineTo(A+n,t),this.lineTo(A,t)}scale(A,t){this.matrix.scale(A,t,1)}translate(A,t){this.matrix.translate(A,t,1)}fill(){this._checkNode();let A=1;this.node.setAttributeNS(_A,"fill",this.fillStyle),this.node.setAttributeNS(_A,"fill-opacity",""+A),this.node.setAttributeNS(_A,"d",this.path)}stroke(){this._checkNode();let A=1;this.node.setAttributeNS(_A,"stroke",this.strokeStyle);let t=this.lineWidth*this.matrix.$matrix.m11;this.node.setAttributeNS(_A,"stroke-width",t+"px"),this.node.setAttributeNS(_A,"stroke-opacity",""+A),this.node.setAttributeNS(_A,"d",this.path)}};function an(g){let A=new si;return g.renderImage(A,A,!1),console.log("SVG",A),window._svg=A,console.log(A.svg.outerHTML),A.svg.outerHTML}window.save_buffer=function(g){let A=new Blob([g],{type:"text/plain"}),t=URL.createObjectURL(A);window.open(t)};window.newline_data_url=function(g){let A=0,t='["';for(let i=0;i<g.length;i++)(i+1)%65===0&&(t+=`",
"`),t+=g[i];return t+=`"].join("");
`,t};var fi=class{#A="";constructor(A,t){this.bluenoise=new Qt,this.drawer=new mt(this),this.image=void 0,this.outimage=void 0,this.canvas=t,this.g=A,this.channel=0,this.color="black",this.drawlines=[]}get gridsize(){throw new Error("Refactor error!")}get cells(){throw new Error("Refactor error!")}get grid(){throw new Error("Refactor error!")}get celldim(){throw new Error("Refactor error!")}get depth(){throw new Error("Refactor error!")}make_drawline(A,t){this.drawlines.push(A[0]),this.drawlines.push(A[1]),this.drawlines.push(t[0]),this.drawlines.push(t[1])}reset_drawlines(){this.drawlines=[]}on_load(){this.cur_raster_i=0;let A=[];if(this.image===void 0&&"startup_image_bn4"in localStorage){this.image=new Image,this.image.src=localStorage.startup_image_bn4;let t=this;this.image.onload=function(){t.on_image_read(t.image,function(){t.source_image_read(t.image)})}}else"startup_image_bn4"in localStorage||this.loadFlowerSvg();this.bluenoise.init(c.DIMEN)}init(){this.bluenoise.init(c.DIMEN)}reset(){if(_e(),c.USE_LAB=c.COLOR_SPACE===Ie.LAB,jt(c.COLOR_SPACE),Fe(),c.RASTER_IMAGE){let A=~~(c.SCALE*Math.min(this.canvas.width,this.canvas.height));A=c.DIMEN;let t=A;this.outimage=new ImageData(t,t);let i=this.outimage,n=new Int32Array(i.data.buffer);i.data[0]=i.data[1]=i.data[2]=255,i.data[3]=255,n.fill(n[0],0,n.length)}else c.HIGH_QUALITY_RASTER&&(this.hqrender=new it(this.canvas.width,this.canvas.height));this.bluenoise.reset(c.RASTER_IMAGE?this.outimage:void 0),this.drawer.reset(c.RASTER_IMAGE?this.outimage:void 0)}draw(){let A=devicePixelRatio,t=~~((window.innerWidth-35)*A),i=~~((window.innerHeight-35)*A);this.canvas.width=t,this.canvas.height=i,this.canvas.style.width=t/A+"px",this.canvas.style.height=i/A+"px",c.HIGH_QUALITY_RASTER&&this.hqrender===void 0?this.hqrender=new it(this.canvas.width,this.canvas.height):c.HIGH_QUALITY_RASTER&&this.hqrender.reset(),this.drawer.draw(c.HIGH_QUALITY_RASTER?this.hqrender:this.g),c.HIGH_QUALITY_RASTER&&(this.hqrender.render(),this.g.putImageData(this.hqrender.image,0,0)),c.SHOW_IMAGE&&this.image!==void 0&&this.image.data!==void 0&&this.g.putImageData(this.image.data,25,25),c.SHOW_DVIMAGE&&this.bluenoise.dvimage!==void 0&&this.g.putImageData(this.bluenoise.dvimage,25,25)}on_keydown(A){switch(console.log(A.keyCode),A.keyCode){case 68:this.bluenoise.step(),window.redraw_all(),console.log("DONE");break;case 75:console.log("relax"),this.bluenoise.relax(),window.redraw_all();break;case 76:this.bluenoise.colordiffuse(),window.redraw_all();break;case 82:this.init(),this.reset(),_e(),window.redraw_all();break}}renderImage(A,t,i=!0){let n=c.RENDERED_IMAGE_SIZE,o=c.SCALE;c.SCALE=1,console.log("rendering image. . .");let r=window._appstate.image.width/window._appstate.image.height,a,l;c.RASTER_IMAGE&&(n=window._appstate.outimage.width),r>1?(a=n,l=n/r):(a=n*r,l=n),A||(A=document.createElement("canvas"),t=A.getContext("2d"));let w=A,P=t;w.width=a,w.height=l,i&&(P.beginPath(),P.rect(0,0,a,l),P.fillStyle=c.BLACK_BG?"black ":"white",P.fill());let B=.5*Math.max(a,l);return P.scale(B,B),r>1,P.translate(1,1),c.RASTER_IMAGE?P.putImageData(window._appstate.outimage,0,0):c.DRAW_STICKS?window._appstate.drawer.draw_sticks(P):c.TRI_MODE?window._appstate.drawer.tri_mode_draw(P):window._appstate.drawer.draw_points(P),console.log("finished rendering image"),c.SCALE=o,new Promise((D,v)=>{D(w)})}toJSON(){return{APP_VERSION:hi,settings:IA.toJSON()}}loadJSON(A){IA.loadJSON(A.settings),A.APP_VERSION<.6&&(A.STICK_ROT=A.STICK_ROT/180*Math.PI)}save(){localStorage.startup_file_bn6=JSON.stringify(this)}load(){try{this.loadJSON(JSON.parse(localStorage.startup_file_bn6))}catch(A){nt(A)}}store_bluenoise_mask(){new $A("bluenoise_mask").write("data",_image_url)}on_filechange(A,t){if(console.log("got file",A,t),t.length===0)return;let i=new FileReader,n=this;i.onload=function(o){let r=new Image,a=o.target.result;r.src=a,window._image_url=a,n.on_image_read(r,function(){n.source_image_read(r)})},i.readAsDataURL(t[0])}on_mask_filechange(A,t){if(console.log("got file",A,t),t.length===0)return;let i=new FileReader,n=this;i.onload=function(o){let r=o.target.result,a="",l=new Uint8Array(r);for(let w=0;w<l.length;w++)a+=String.fromCharCode(l[w]);a.startsWith("SMOOTHMASK")||(a=btoa(a),a="data:image/png;base64,"+a),new $A("bluenoise_mask").write("data",a),window._appstate.bluenoise.load_mask(a)},i.readAsArrayBuffer(t[0])}on_image_read(A,t,i){console.log("got image");let n=this;if(A.width===0){let l=window.setInterval(function(){A.width!==0&&(window.clearInterval(l),n.on_image_read(A,t,i),console.log("delay load imaged"))},500);return}let o=document.createElement("canvas");o.width=A.width,o.height=A.height;let r=o.getContext("2d");if(r.drawImage(A,0,0),A.width===0){console.log("eek",A.width,A.height);return}let a=r.getImageData(0,0,A.width,A.height);A.data=a,t!==void 0&&(i===void 0?t(A):t.call(i,A))}clearData(){new $A("bluenoise_mask").clear(),delete localStorage.startup_image_bn4,delete localStorage.startup_file_bn6,this.gui.clearData(),this.gui2.clearData(),console.log("Cleared saved data")}loadFlowerSvg(){import("./flowersData-KSGFKO4P.js").then(A=>{let t=A.default,i=document.createElement("img"),n="data:image/svg+xml,"+escape(t);i.src=n,i.onload=()=>{console.log("Loaded flower image!"),this.image=i,this.on_image_read(i,()=>{this.source_image_read(i)})}})}source_image_read(A){this.image=A;try{localStorage.startup_image_bn4=A.src}catch{console.log("Failed to cache image data")}this.reset(),window.redraw_all()}on_tick(){let A=`${devicePixelRatio}:${window.innerWidth}:${window.innerHeight}`;this.#A!==A&&(this.#A=A,this.draw()),this.gui.on_tick(),this.gui2.on_tick()}makeGUI(){let A=c,t=this.gui2=new tt("ui2_bn6",A,void 0,void 0,void 0),i=this.gui=new tt("ui1_bn6",A,void 0,void 0,void 0);window.gui=i;let n=i.panel("Actions");n.button("step","Run",function(){window._appstate.bluenoise.step(),window.redraw_all()}),n.button("load_image","Load Image",function(){document.getElementById("input").click()}),n.button("load_mask","Load Mask",function(){document.getElementById("input2").click()}),n.button("reset","Reset",function(){_e(),window._appstate.init(),window._appstate.reset(),window.redraw_all()}),n.button("clear","Clear Saved Data",()=>{this.clearData()});let o=i.panel("Relaxation"),r=o.panel("Custom SPH Curve");c.SPH_CURVE=r.curve("SPH_CURVE","Custom SPH Curve").curve,r.check("USE_SPH_CURVE","Use SPH Curve"),r.close(),o.button("relax","Relax",()=>{window._appstate.bluenoise.relax(),window.redraw_all()});let a=o.button("relax_loop","Start Loop",()=>{if(window._appstate.relaxtimer!==void 0){a.domElement.parentNode.children[0].innerHTML="Start Loop",console.log("stopping timer"),window.clearInterval(window._appstate.relaxtimer),window._appstate.relaxtimer=void 0;return}a.domElement.parentNode.children[0].innerHTML="Stop Loop",window._appstate.relaxtimer=window.setInterval(()=>{window._appstate.bluenoise.relax(),window.redraw_all()},100)});window.relaxbut=a,o.check("ANISOTROPY","Anisotropic"),o.slider("FILTERWID","Filter Wid",3,.001,7,.001,!1,!1),o.slider("ANISOTROPY_FILTERWID","AnisotropicFilterWid",3,.001,7,.001,!1,!1),o.slider("RELAX_SPEED","Relax Speed",1,.001,8,.001,!0,!1),o.check("RELAX_UPDATE_VECTORS","Update Vectors");let l=i.panel("Settings"),w=i;l.slider("DIMEN","Density",32,1,2048,1,!0,!1),l.slider("STEPS","Points Per Step",32,1,5e4,1,!0,!1),l.slider("DRAW_RMUL","Point Size",1,.1,8,.01,!1,!0),l.slider("RAND_FAC","Added Random",0,0,3,.005,!1,!0),l.check("HIGH_QUALITY_RASTER","HQ Renderer"),l.check("SHOW_KDTREE","Show kdtree"),l.check("SCALE_POINTS","Radius Scale"),l.check("TRI_MODE","Triangle Mode");let P=w.panel("Stick Mode");P.check("DRAW_STICKS","Draw Sticks"),P.check("FANCY_STICKS","Fancy Strokes"),P.check("STICK_ARROWS","Use Arrows"),P.slider("STICK_ROT","StickRot",0,-180,180,1e-4,!1,!0),P.slider("STICK_WIDTH","StickWidth",0,1e-4,12,1e-4,!1,!0),P.slider("STICK_LENGTH","StickLength",0,1e-4,12,1e-4,!1,!0),P.slider("ANIS_W1","W1",0,-2,2,1e-4,!1,!1),P.slider("ANIS_W2","W2",0,-2,2,1e-4,!1,!1),P.close();let B=w.panel("Dithering");B.check("DITHER_COLORS","Dither Colors"),B.slider("DITHER_RAND_FAC","Dither Random",0,0,9,.005,!1,!1),B.check("DITHER_BLUE","Blue Noise"),B.slider("DITHER_BLUE_STEPS","Dither Uniformity",6,0,256,.005,!0,!1);let D=w.panel("Image Filtering");D.check("HIST_EQUALIZE","EqualizeHistogram"),D.check("DEBAND_IMAGE","Blur Derivatives"),D.slider("DEBAND_RADIUS","Blur Radius",15,1,90,1,!0,!1),D.slider("DEBAND_BLEND","BlendWithOriginal",0,0,1,1e-4,!1,!1),D.check("SHARPEN","Sharpen"),D.slider("SHARPNESS","Sharpness",.5,0,3.5,.001,!1,!1),D.check("SHARPEN_LUMINENCE","Luminence Only"),D.listenum("COLOR_SPACE","Space",Ie,c.COLOR_SPACE),D.close();let v=i.panel("Save Tool");v.button("save_img","Save Image",()=>{window._appstate.renderImage().then(Q=>{Q.toBlob(I=>{let d=URL.createObjectURL(I);window.open(d)})})}),v.slider("RENDERED_IMAGE_SIZE","Rendered Image Size",1024,1,4096,1,!0,!1),v=i.panel("Canvas Position"),v.slider("SCALE","Scale",1,.05,5,.01,!1,!0),v.slider("PANX","Pan X",0,-1.5,1.5,.01,!1,!0),v.slider("PANY","Pan Y",0,-1.5,1.5,.01,!1,!0);let h=i.panel("Export SVG");h.button("save_svg","Save SVG",()=>{console.log("Export SVG!");let Q=an(this),I=document.createElement("a"),d=new Blob([Q],{type:"image/svg"}),F=URL.createObjectURL(d);I.setAttribute("download","render.svg"),I.setAttribute("href",F),I.click()}),w=t.panel("More Options"),v=w.panel("General"),h=v.panel("Tone Curve"),c.TONE_CURVE=h.curve("TONE_CURVE","Tone Curve",IA.DefaultCurves.TONE_CURVE).curve,h.close(),h=v.panel("Density Curve"),c.DENSITY_CURVE=h.curve("DENSITY_CURVE","Density Curve",IA.DefaultCurves.DENSITY_CURVE).curve,h.close(),v.check("SHOW_IMAGE","Show Image"),v.check("SHOW_DVIMAGE","Show DvImage"),v.check("SHOW_RAW_IMAGE","Raw Image"),v.check("SHOW_COLORS","Show Colors"),v.check("ADAPTIVE_COLOR_DENSITY","Denser For Color"),v.check("HEXAGON_MODE","Hexagonish"),v.check("GRID_MODE","Grid Like"),h=v.panel("Simple Raster"),h.check("RASTER_IMAGE","Enable");let u="";for(let Q in pA)if(pA[Q]===c.RASTER_MODE){u=Q;break}console.log("SDFSDFSDF",u),h.listenum("RASTER_MODE","Mode",pA,u),h.check("USE_CMYK_MASK","CMYK Masksheet"),v.check("MAKE_NOISE","Make Noise (to test relax)"),v.check("SMALL_MASK","Small Mask Mode"),v.check("XLARGE_MASK","Extra Large Mask Mode"),v.check("SPECIAL_OFFSETS","Use Encoded Offsets"),v.check("USE_MERSENNE","Psuedo Random"),v.check("BLACK_BG","Black BG"),v=w.panel("Palette"),v.slider("PAL_COLORS","Number of Colors (Times 9)",4,1,32,1,!0,!1),v.check("ALLOW_PURPLE","Include Purple In Palette"),v.check("ALLOW_GREY","Include Grey In Palette"),v.check("SIMPLE_PALETTE","Simple Palette"),v.check("IMAGE_PALETTE","PaletteFromImage"),v.check("BG_PALETTE","Black/white only");let m="built-in-smooth";v=w.panel("Blue Noise Mask"),v.listenum(void 0,"Mask",{"Built In Smooth":"built-in-smooth","Built In":"built-in","Large 2":"mask_large_2.png","Large 2 (smoothed)":"mask_large_2_smoothed.png","Large 1 (only 16 levels)":"mask_large.png","Small 1 (only 16 levels)":"mask.png","Weighted Sample Removal":"weighted_sample_removal_mask_1.png"},"built-in-smooth",function(Q){m=Q}),v.button("load_mask","Load",function(){let Q=m;if(Q==="built-in-smooth")console.log("Reloading built-in blue noise mask. . ."),new $A("bluenoise_mask").write("data",$e),window._appstate.bluenoise.load_mask($e);else if(Q==="built-in")console.log("Reloading built-in blue noise mask. . ."),new $A("bluenoise_mask").write("data",blue_mask_file),window._appstate.bluenoise.load_mask(blue_mask_file);else{let I="examples/"+Q,d=document.location.pathname;for(;d.length>0&&!d.endsWith("/");)d=d.slice(0,d.length-1);d.length!==0&&(d=d.slice(1,d.length)),I=d+I,Bi(I,!0).then(function(p){let H=p;console.log("DATA LEN1",H.byteLength);let b=new Uint8Array(H),L="";for(let T=0;T<b.length;T++)L+=String.fromCharCode(b[T]);let M=btoa(L);console.log(M.slice(0,100)),M.startsWith("SMOOTHMASK")||(M="data:image/png;base64,"+M),new $A("bluenoise_mask").write("data",M),window._appstate.bluenoise.load_mask(M)})}}),v=w.panel("Misc"),v.check("DRAW_TRANSPARENT","Accumulation Mode"),v.slider("ACCUM_ALPHA","Accum Alpha",1,.001,1,.001,!1,!0),v.check("CORRECT_FOR_SPACING","Correct_For_Spacing"),v.check("LOW_RES_CUBE","Low Res Cube"),_e(),i.load(),t.load()}};window.addEventListener("keydown",function(g){window._appstate.on_keydown(g)});function Fs(){console.log("loaded!");let g=document.getElementById("canvas");g.width=window.innerWidth-30,g.height=window.innerHeight-25;let A=g.getContext("2d");window._appstate=new fi(A,g),window._appstate.load();let t;window.redraw_all=function(){t===void 0&&(t=requestAnimationFrame(function(){t=void 0;let i=window._appstate.g,n=window._appstate.canvas;i.clearRect(0,0,n.width,n.height),window._appstate.draw()}),window.redraw_all())},window._appstate.makeGUI(),window._appstate.init(),window._appstate.tick_timer=window.setInterval(()=>{window._appstate.on_tick()},400),document.getElementById("input").addEventListener("change",function(i){console.log("file!",i,this.files),window._appstate.on_filechange(i,this.files)}),document.getElementById("input2").addEventListener("change",function(i){console.log("file!",i,this.files),window._appstate.on_mask_filechange(i,this.files)}),window._appstate.on_load()}export{fi as AppState,Fs as start};
//# sourceMappingURL=bundle.js.map
