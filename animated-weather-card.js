"use strict";(()=>{function Pt(o){if(o===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return o}function Ma(o,e){o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.__proto__=e}var ht={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Ke={duration:.5,overwrite:!1,delay:0},bn,tt,I,xt=1e8,N=1/xt,dn=Math.PI*2,Mo=dn/4,Po=0,Pa=Math.sqrt,Lo=Math.cos,Fo=Math.sin,Q=function(e){return typeof e=="string"},Y=function(e){return typeof e=="function"},Ft=function(e){return typeof e=="number"},Si=function(e){return typeof e>"u"},Et=function(e){return typeof e=="object"},dt=function(e){return e!==!1},vn=function(){return typeof window<"u"},pi=function(e){return Y(e)||Q(e)},La=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},nt=Array.isArray,Oo=/random\([^)]+\)/g,Do=/,\s*/g,va=/(?:-?\.?\d|\.)+/gi,xn=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,te=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,nn=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Sn=/[+-]=-?[.\d]+/,Wo=/[^,'"\[\]\s]+/gi,Ho=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,B,kt,hn,Tn,gt={},yi={},Fa,Oa=function(e){return(yi=ge(e,gt))&&at},Ti=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},je=function(e,t){return!t&&console.warn(e)},Da=function(e,t){return e&&(gt[e]=t)&&yi&&(yi[e]=t)||gt},Xe=function(){return 0},Ro={suppressEvents:!0,isStart:!0,kill:!1},fi={suppressEvents:!0,kill:!1},zo={suppressEvents:!0},Cn={},Nt=[],un={},Wa,lt={},an={},xa=30,gi=[],kn="",An=function(e){var t=e[0],i,n;if(Et(t)||Y(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(n=gi.length;n--&&!gi[n].targetTest(t););i=gi[n]}for(n=e.length;n--;)e[n]&&(e[n]._gsap||(e[n]._gsap=new Ln(e[n],i)))||e.splice(n,1);return e},$t=function(e){return e._gsap||An(St(e))[0]._gsap},En=function(e,t,i){return(i=e[t])&&Y(i)?e[t]():Si(i)&&e.getAttribute&&e.getAttribute(t)||i},rt=function(e,t){return(e=e.split(",")).forEach(t)||e},U=function(e){return Math.round(e*1e5)/1e5||0},G=function(e){return Math.round(e*1e7)/1e7||0},ee=function(e,t){var i=t.charAt(0),n=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+n:i==="-"?e-n:i==="*"?e*n:e/n},No=function(e,t){for(var i=t.length,n=0;e.indexOf(t[n])<0&&++n<i;);return n<i},_i=function(){var e=Nt.length,t=Nt.slice(0),i,n;for(un={},Nt.length=0,i=0;i<e;i++)n=t[i],n&&n._lazy&&(n.render(n._lazy[0],n._lazy[1],!0)._lazy=0)},Mn=function(e){return!!(e._initted||e._startAt||e.add)},Ha=function(e,t,i,n){Nt.length&&!tt&&_i(),e.render(t,i,n||!!(tt&&t<0&&Mn(e))),Nt.length&&!tt&&_i()},Ra=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(Wo).length<2?t:Q(e)?e.trim():e},za=function(e){return e},wt=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},$o=function(e){return function(t,i){for(var n in i)n in t||n==="duration"&&e||n==="ease"||(t[n]=i[n])}},ge=function(e,t){for(var i in t)e[i]=t[i];return e},Sa=function o(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=Et(t[i])?o(e[i]||(e[i]={}),t[i]):t[i]);return e},bi=function(e,t){var i={},n;for(n in e)n in t||(i[n]=e[n]);return i},Ve=function(e){var t=e.parent||B,i=e.keyframes?$o(nt(e.keyframes)):wt;if(dt(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},Io=function(e,t){for(var i=e.length,n=i===t.length;n&&i--&&e[i]===t[i];);return i<0},Na=function(e,t,i,n,a){i===void 0&&(i="_first"),n===void 0&&(n="_last");var r=e[n],s;if(a)for(s=t[a];r&&r[a]>s;)r=r._prev;return r?(t._next=r._next,r._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[n]=t,t._prev=r,t.parent=t._dp=e,t},Ci=function(e,t,i,n){i===void 0&&(i="_first"),n===void 0&&(n="_last");var a=t._prev,r=t._next;a?a._next=r:e[i]===t&&(e[i]=r),r?r._prev=a:e[n]===t&&(e[n]=a),t._next=t._prev=t.parent=null},It=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Zt=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},Go=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},mn=function(e,t,i,n){return e._startAt&&(tt?e._startAt.revert(fi):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,n))},Bo=function o(e){return!e||e._ts&&o(e.parent)},Ta=function(e){return e._repeat?we(e._tTime,e=e.duration()+e._rDelay)*e:0},we=function(e,t){var i=Math.floor(e=G(e/t));return e&&i===e?i-1:i},vi=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},ki=function(e){return e._end=G(e._start+(e._tDur/Math.abs(e._ts||e._rts||N)||0))},Ai=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=G(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),ki(e),i._dirty||Zt(i,e)),e},$a=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=vi(e.rawTime(),t),(!t._dur||Je(0,t.totalDuration(),i)-t._tTime>N)&&t.render(i,!0)),Zt(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-N}},At=function(e,t,i,n){return t.parent&&It(t),t._start=G((Ft(i)?i:i||e!==B?vt(e,i,t):e._time)+t._delay),t._end=G(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Na(e,t,"_first","_last",e._sort?"_start":0),pn(t)||(e._recent=t),n||$a(e,t),e._ts<0&&Ai(e,e._tTime),e},Ia=function(e,t){return(gt.ScrollTrigger||Ti("scrollTrigger",t))&&gt.ScrollTrigger.create(t,e)},Ga=function(e,t,i,n,a){if(Dn(e,t,a),!e._initted)return 1;if(!i&&e._pt&&!tt&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Wa!==ct.frame)return Nt.push(e),e._lazy=[a,n],1},qo=function o(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||o(t))},pn=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Vo=function(e,t,i,n){var a=e.ratio,r=t<0||!t&&(!e._start&&qo(e)&&!(!e._initted&&pn(e))||(e._ts<0||e._dp._ts<0)&&!pn(e))?0:1,s=e._rDelay,c=0,l,d,h;if(s&&e._repeat&&(c=Je(0,e._tDur,t),d=we(c,s),e._yoyo&&d&1&&(r=1-r),d!==we(e._tTime,s)&&(a=1-r,e.vars.repeatRefresh&&e._initted&&e.invalidate())),r!==a||tt||n||e._zTime===N||!t&&e._zTime){if(!e._initted&&Ga(e,t,n,i,c))return;for(h=e._zTime,e._zTime=t||(i?N:0),i||(i=t&&!h),e.ratio=r,e._from&&(r=1-r),e._time=0,e._tTime=c,l=e._pt;l;)l.r(r,l.d),l=l._next;t<0&&mn(e,t,i,!0),e._onUpdate&&!i&&ft(e,"onUpdate"),c&&e._repeat&&!i&&e.parent&&ft(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===r&&(r&&It(e,1),!i&&!tt&&(ft(e,r?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Yo=function(e,t,i){var n;if(i>t)for(n=e._first;n&&n._start<=i;){if(n.data==="isPause"&&n._start>t)return n;n=n._next}else for(n=e._last;n&&n._start>=i;){if(n.data==="isPause"&&n._start<t)return n;n=n._prev}},ye=function(e,t,i,n){var a=e._repeat,r=G(t)||0,s=e._tTime/e._tDur;return s&&!n&&(e._time*=r/e._dur),e._dur=r,e._tDur=a?a<0?1e10:G(r*(a+1)+e._rDelay*a):r,s>0&&!n&&Ai(e,e._tTime=e._tDur*s),e.parent&&ki(e),i||Zt(e.parent,e),e},Ca=function(e){return e instanceof it?Zt(e):ye(e,e._dur)},Uo={_start:0,endTime:Xe,totalDuration:Xe},vt=function o(e,t,i){var n=e.labels,a=e._recent||Uo,r=e.duration()>=xt?a.endTime(!1):e._dur,s,c,l;return Q(t)&&(isNaN(t)||t in n)?(c=t.charAt(0),l=t.substr(-1)==="%",s=t.indexOf("="),c==="<"||c===">"?(s>=0&&(t=t.replace(/=/,"")),(c==="<"?a._start:a.endTime(a._repeat>=0))+(parseFloat(t.substr(1))||0)*(l?(s<0?a:i).totalDuration()/100:1)):s<0?(t in n||(n[t]=r),n[t]):(c=parseFloat(t.charAt(s-1)+t.substr(s+1)),l&&i&&(c=c/100*(nt(i)?i[0]:i).totalDuration()),s>1?o(e,t.substr(0,s-1),i)+c:r+c)):t==null?r:+t},Ye=function(e,t,i){var n=Ft(t[1]),a=(n?2:1)+(e<2?0:1),r=t[a],s,c;if(n&&(r.duration=t[1]),r.parent=i,e){for(s=r,c=i;c&&!("immediateRender"in s);)s=c.vars.defaults||{},c=dt(c.vars.inherit)&&c.parent;r.immediateRender=dt(s.immediateRender),e<2?r.runBackwards=1:r.startAt=t[a-1]}return new K(t[0],r,t[a+1])},Gt=function(e,t){return e||e===0?t(e):t},Je=function(e,t,i){return i<e?e:i>t?t:i},et=function(e,t){return!Q(e)||!(t=Ho.exec(e))?"":t[1]},Ko=function(e,t,i){return Gt(i,function(n){return Je(e,t,n)})},fn=[].slice,Ba=function(e,t){return e&&Et(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Et(e[0]))&&!e.nodeType&&e!==kt},jo=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(n){var a;return Q(n)&&!t||Ba(n,1)?(a=i).push.apply(a,St(n)):i.push(n)})||i},St=function(e,t,i){return I&&!t&&I.selector?I.selector(e):Q(e)&&!i&&(hn||!_e())?fn.call((t||Tn).querySelectorAll(e),0):nt(e)?jo(e,i):Ba(e)?fn.call(e,0):e?[e]:[]},gn=function(e){return e=St(e)[0]||je("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return St(t,i.querySelectorAll?i:i===e?je("Invalid scope")||Tn.createElement("div"):e)}},qa=function(e){return e.sort(function(){return .5-Math.random()})},Va=function(e){if(Y(e))return e;var t=Et(e)?e:{each:e},i=Qt(t.ease),n=t.from||0,a=parseFloat(t.base)||0,r={},s=n>0&&n<1,c=isNaN(n)||s,l=t.axis,d=n,h=n;return Q(n)?d=h={center:.5,edges:.5,end:1}[n]||0:!s&&c&&(d=n[0],h=n[1]),function(m,p,g){var u=(g||t).length,f=r[u],y,_,v,b,w,C,S,k,T;if(!f){if(T=t.grid==="auto"?0:(t.grid||[1,xt])[1],!T){for(S=-xt;S<(S=g[T++].getBoundingClientRect().left)&&T<u;);T<u&&T--}for(f=r[u]=[],y=c?Math.min(T,u)*d-.5:n%T,_=T===xt?0:c?u*h/T-.5:n/T|0,S=0,k=xt,C=0;C<u;C++)v=C%T-y,b=_-(C/T|0),f[C]=w=l?Math.abs(l==="y"?b:v):Pa(v*v+b*b),w>S&&(S=w),w<k&&(k=w);n==="random"&&qa(f),f.max=S-k,f.min=k,f.v=u=(parseFloat(t.amount)||parseFloat(t.each)*(T>u?u-1:l?l==="y"?u/T:T:Math.max(T,u/T))||0)*(n==="edges"?-1:1),f.b=u<0?a-u:a,f.u=et(t.amount||t.each)||0,i=i&&u<0?ls(i):i}return u=(f[m]-f.min)/f.max||0,G(f.b+(i?i(u):u)*f.v)+f.u}},wn=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var n=G(Math.round(parseFloat(i)/e)*e*t);return(n-n%1)/t+(Ft(i)?0:et(i))}},Ya=function(e,t){var i=nt(e),n,a;return!i&&Et(e)&&(n=i=e.radius||xt,e.values?(e=St(e.values),(a=!Ft(e[0]))&&(n*=n)):e=wn(e.increment)),Gt(t,i?Y(e)?function(r){return a=e(r),Math.abs(a-r)<=n?a:r}:function(r){for(var s=parseFloat(a?r.x:r),c=parseFloat(a?r.y:0),l=xt,d=0,h=e.length,m,p;h--;)a?(m=e[h].x-s,p=e[h].y-c,m=m*m+p*p):m=Math.abs(e[h]-s),m<l&&(l=m,d=h);return d=!n||l<=n?e[d]:r,a||d===r||Ft(r)?d:d+et(r)}:wn(e))},Ua=function(e,t,i,n){return Gt(nt(e)?!t:i===!0?!!(i=0):!n,function(){return nt(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(n=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*n)/n})},Xo=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(n){return t.reduce(function(a,r){return r(a)},n)}},Zo=function(e,t){return function(i){return e(parseFloat(i))+(t||et(i))}},Qo=function(e,t,i){return ja(e,t,0,1,i)},Ka=function(e,t,i){return Gt(i,function(n){return e[~~t(n)]})},Jo=function o(e,t,i){var n=t-e;return nt(e)?Ka(e,o(0,e.length),t):Gt(i,function(a){return(n+(a-e)%n)%n+e})},ts=function o(e,t,i){var n=t-e,a=n*2;return nt(e)?Ka(e,o(0,e.length-1),t):Gt(i,function(r){return r=(a+(r-e)%a)%a||0,e+(r>n?a-r:r)})},be=function(e){return e.replace(Oo,function(t){var i=t.indexOf("[")+1,n=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(Do);return Ua(i?n:+n[0],i?0:+n[1],+n[2]||1e-5)})},ja=function(e,t,i,n,a){var r=t-e,s=n-i;return Gt(a,function(c){return i+((c-e)/r*s||0)})},es=function o(e,t,i,n){var a=isNaN(e+t)?0:function(p){return(1-p)*e+p*t};if(!a){var r=Q(e),s={},c,l,d,h,m;if(i===!0&&(n=1)&&(i=null),r)e={p:e},t={p:t};else if(nt(e)&&!nt(t)){for(d=[],h=e.length,m=h-2,l=1;l<h;l++)d.push(o(e[l-1],e[l]));h--,a=function(g){g*=h;var u=Math.min(m,~~g);return d[u](g-u)},i=t}else n||(e=ge(nt(e)?[]:{},e));if(!d){for(c in t)Fn.call(s,e,c,"get",t[c]);a=function(g){return Rn(g,s)||(r?e.p:e)}}}return Gt(i,a)},ka=function(e,t,i){var n=e.labels,a=xt,r,s,c;for(r in n)s=n[r]-t,s<0==!!i&&s&&a>(s=Math.abs(s))&&(c=r,a=s);return c},ft=function(e,t,i){var n=e.vars,a=n[t],r=I,s=e._ctx,c,l,d;if(a)return c=n[t+"Params"],l=n.callbackScope||e,i&&Nt.length&&_i(),s&&(I=s),d=c?a.apply(l,c):a.call(l),I=r,d},Be=function(e){return It(e),e.scrollTrigger&&e.scrollTrigger.kill(!!tt),e.progress()<1&&ft(e,"onInterrupt"),e},fe,Xa=[],Za=function(e){if(e)if(e=!e.name&&e.default||e,vn()||e.headless){var t=e.name,i=Y(e),n=t&&!i&&e.init?function(){this._props=[]}:e,a={init:Xe,render:Rn,add:Fn,kill:ys,modifier:ws,rawVars:0},r={targetTest:0,get:0,getSetter:Ei,aliases:{},register:0};if(_e(),e!==n){if(lt[t])return;wt(n,wt(bi(e,a),r)),ge(n.prototype,ge(a,bi(e,r))),lt[n.prop=t]=n,e.targetTest&&(gi.push(n),Cn[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Da(t,n),e.register&&e.register(at,n,ot)}else Xa.push(e)},z=255,qe={aqua:[0,z,z],lime:[0,z,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,z],navy:[0,0,128],white:[z,z,z],olive:[128,128,0],yellow:[z,z,0],orange:[z,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[z,0,0],pink:[z,192,203],cyan:[0,z,z],transparent:[z,z,z,0]},rn=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*z+.5|0},Qa=function(e,t,i){var n=e?Ft(e)?[e>>16,e>>8&z,e&z]:0:qe.black,a,r,s,c,l,d,h,m,p,g;if(!n){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),qe[e])n=qe[e];else if(e.charAt(0)==="#"){if(e.length<6&&(a=e.charAt(1),r=e.charAt(2),s=e.charAt(3),e="#"+a+a+r+r+s+s+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return n=parseInt(e.substr(1,6),16),[n>>16,n>>8&z,n&z,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),n=[e>>16,e>>8&z,e&z]}else if(e.substr(0,3)==="hsl"){if(n=g=e.match(va),!t)c=+n[0]%360/360,l=+n[1]/100,d=+n[2]/100,r=d<=.5?d*(l+1):d+l-d*l,a=d*2-r,n.length>3&&(n[3]*=1),n[0]=rn(c+1/3,a,r),n[1]=rn(c,a,r),n[2]=rn(c-1/3,a,r);else if(~e.indexOf("="))return n=e.match(xn),i&&n.length<4&&(n[3]=1),n}else n=e.match(va)||qe.transparent;n=n.map(Number)}return t&&!g&&(a=n[0]/z,r=n[1]/z,s=n[2]/z,h=Math.max(a,r,s),m=Math.min(a,r,s),d=(h+m)/2,h===m?c=l=0:(p=h-m,l=d>.5?p/(2-h-m):p/(h+m),c=h===a?(r-s)/p+(r<s?6:0):h===r?(s-a)/p+2:(a-r)/p+4,c*=60),n[0]=~~(c+.5),n[1]=~~(l*100+.5),n[2]=~~(d*100+.5)),i&&n.length<4&&(n[3]=1),n},Ja=function(e){var t=[],i=[],n=-1;return e.split(Lt).forEach(function(a){var r=a.match(te)||[];t.push.apply(t,r),i.push(n+=r.length+1)}),t.c=i,t},Aa=function(e,t,i){var n="",a=(e+n).match(Lt),r=t?"hsla(":"rgba(",s=0,c,l,d,h;if(!a)return e;if(a=a.map(function(m){return(m=Qa(m,t,1))&&r+(t?m[0]+","+m[1]+"%,"+m[2]+"%,"+m[3]:m.join(","))+")"}),i&&(d=Ja(e),c=i.c,c.join(n)!==d.c.join(n)))for(l=e.replace(Lt,"1").split(te),h=l.length-1;s<h;s++)n+=l[s]+(~c.indexOf(s)?a.shift()||r+"0,0,0,0)":(d.length?d:a.length?a:i).shift());if(!l)for(l=e.split(Lt),h=l.length-1;s<h;s++)n+=l[s]+a[s];return n+l[h]},Lt=(function(){var o="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in qe)o+="|"+e+"\\b";return new RegExp(o+")","gi")})(),is=/hsl[a]?\(/,Pn=function(e){var t=e.join(" "),i;if(Lt.lastIndex=0,Lt.test(t))return i=is.test(t),e[1]=Aa(e[1],i),e[0]=Aa(e[0],i,Ja(e[1])),!0},Ze,ct=(function(){var o=Date.now,e=500,t=33,i=o(),n=i,a=1e3/240,r=a,s=[],c,l,d,h,m,p,g=function u(f){var y=o()-n,_=f===!0,v,b,w,C;if((y>e||y<0)&&(i+=y-t),n+=y,w=n-i,v=w-r,(v>0||_)&&(C=++h.frame,m=w-h.time*1e3,h.time=w=w/1e3,r+=v+(v>=a?4:a-v),b=1),_||(c=l(u)),b)for(p=0;p<s.length;p++)s[p](w,m,C,f)};return h={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(f){return m/(1e3/(f||60))},wake:function(){Fa&&(!hn&&vn()&&(kt=hn=window,Tn=kt.document||{},gt.gsap=at,(kt.gsapVersions||(kt.gsapVersions=[])).push(at.version),Oa(yi||kt.GreenSockGlobals||!kt.gsap&&kt||{}),Xa.forEach(Za)),d=typeof requestAnimationFrame<"u"&&requestAnimationFrame,c&&h.sleep(),l=d||function(f){return setTimeout(f,r-h.time*1e3+1|0)},Ze=1,g(2))},sleep:function(){(d?cancelAnimationFrame:clearTimeout)(c),Ze=0,l=Xe},lagSmoothing:function(f,y){e=f||1/0,t=Math.min(y||33,e)},fps:function(f){a=1e3/(f||240),r=h.time*1e3+a},add:function(f,y,_){var v=y?function(b,w,C,S){f(b,w,C,S),h.remove(v)}:f;return h.remove(f),s[_?"unshift":"push"](v),_e(),v},remove:function(f,y){~(y=s.indexOf(f))&&s.splice(y,1)&&p>=y&&p--},_listeners:s},h})(),_e=function(){return!Ze&&ct.wake()},F={},ns=/^[\d.\-M][\d.\-,\s]/,as=/["']/g,rs=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),n=i[0],a=1,r=i.length,s,c,l;a<r;a++)c=i[a],s=a!==r-1?c.lastIndexOf(","):c.length,l=c.substr(0,s),t[n]=isNaN(l)?l.replace(as,"").trim():+l,n=c.substr(s+1).trim();return t},os=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),n=e.indexOf("(",t);return e.substring(t,~n&&n<i?e.indexOf(")",i+1):i)},ss=function(e){var t=(e+"").split("("),i=F[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[rs(t[1])]:os(e).split(",").map(Ra)):F._CE&&ns.test(e)?F._CE("",e):i},ls=function(e){return function(t){return 1-e(1-t)}},Qt=function(e,t){return e&&(Y(e)?e:F[e]||ss(e))||t},ie=function(e,t,i,n){i===void 0&&(i=function(c){return 1-t(1-c)}),n===void 0&&(n=function(c){return c<.5?t(c*2)/2:1-t((1-c)*2)/2});var a={easeIn:t,easeOut:i,easeInOut:n},r;return rt(e,function(s){F[s]=gt[s]=a,F[r=s.toLowerCase()]=i;for(var c in a)F[r+(c==="easeIn"?".in":c==="easeOut"?".out":".inOut")]=F[s+"."+c]=a[c]}),a},tr=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},on=function o(e,t,i){var n=t>=1?t:1,a=(i||(e?.3:.45))/(t<1?t:1),r=a/dn*(Math.asin(1/n)||0),s=function(d){return d===1?1:n*Math.pow(2,-10*d)*Fo((d-r)*a)+1},c=e==="out"?s:e==="in"?function(l){return 1-s(1-l)}:tr(s);return a=dn/a,c.config=function(l,d){return o(e,l,d)},c},sn=function o(e,t){t===void 0&&(t=1.70158);var i=function(r){return r?--r*r*((t+1)*r+t)+1:0},n=e==="out"?i:e==="in"?function(a){return 1-i(1-a)}:tr(i);return n.config=function(a){return o(e,a)},n};rt("Linear,Quad,Cubic,Quart,Quint,Strong",function(o,e){var t=e<5?e+1:e;ie(o+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});F.Linear.easeNone=F.none=F.Linear.easeIn;ie("Elastic",on("in"),on("out"),on());(function(o,e){var t=1/e,i=2*t,n=2.5*t,a=function(s){return s<t?o*s*s:s<i?o*Math.pow(s-1.5/e,2)+.75:s<n?o*(s-=2.25/e)*s+.9375:o*Math.pow(s-2.625/e,2)+.984375};ie("Bounce",function(r){return 1-a(1-r)},a)})(7.5625,2.75);ie("Expo",function(o){return Math.pow(2,10*(o-1))*o+o*o*o*o*o*o*(1-o)});ie("Circ",function(o){return-(Pa(1-o*o)-1)});ie("Sine",function(o){return o===1?1:-Lo(o*Mo)+1});ie("Back",sn("in"),sn("out"),sn());F.SteppedEase=F.steps=gt.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,n=e+(t?0:1),a=t?1:0,r=1-N;return function(s){return((n*Je(0,r,s)|0)+a)*i}}};Ke.ease=F["quad.out"];rt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(o){return kn+=o+","+o+"Params,"});var Ln=function(e,t){this.id=Po++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:En,this.set=t?t.getSetter:Ei},Qe=(function(){function o(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,ye(this,+t.duration,1,1),this.data=t.data,I&&(this._ctx=I,I.data.push(this)),Ze||ct.wake()}var e=o.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,ye(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,n){if(_e(),!arguments.length)return this._tTime;var a=this._dp;if(a&&a.smoothChildTiming&&this._ts){for(Ai(this,i),!a._dp||a.parent||$a(a,this);a&&a.parent;)a.parent._time!==a._start+(a._ts>=0?a._tTime/a._ts:(a.totalDuration()-a._tTime)/-a._ts)&&a.totalTime(a._tTime,!0),a=a.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&At(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!n||this._initted&&Math.abs(this._zTime)===N||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),Ha(this,i,n)),this},e.time=function(i,n){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+Ta(this))%(this._dur+this._rDelay)||(i?this._dur:0),n):this._time},e.totalProgress=function(i,n){return arguments.length?this.totalTime(this.totalDuration()*i,n):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,n){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+Ta(this),n):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,n){var a=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*a,n):this._repeat?we(this._tTime,a)+1:1},e.timeScale=function(i,n){if(!arguments.length)return this._rts===-N?0:this._rts;if(this._rts===i)return this;var a=this.parent&&this._ts?vi(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-N?0:this._rts,this.totalTime(Je(-Math.abs(this._delay),this.totalDuration(),a),n!==!1),ki(this),Go(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(_e(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==N&&(this._tTime-=N)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=G(i);var n=this.parent||this._dp;return n&&(n._sort||!this.parent)&&At(n,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(dt(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var n=this.parent||this._dp;return n?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?vi(n.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=zo);var n=tt;return tt=i,Mn(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),tt=n,this},e.globalTime=function(i){for(var n=this,a=arguments.length?i:n.rawTime();n;)a=n._start+a/(Math.abs(n._ts)||1),n=n._dp;return!this.parent&&this._sat?this._sat.globalTime(i):a},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,Ca(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var n=this._time;return this._rDelay=i,Ca(this),n?this.time(n):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,n){return this.totalTime(vt(this,i),dt(n))},e.restart=function(i,n){return this.play().totalTime(i?-this._delay:0,dt(n)),this._dur||(this._zTime=-N),this},e.play=function(i,n){return i!=null&&this.seek(i,n),this.reversed(!1).paused(!1)},e.reverse=function(i,n){return i!=null&&this.seek(i||this.totalDuration(),n),this.reversed(!0).paused(!1)},e.pause=function(i,n){return i!=null&&this.seek(i,n),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-N:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-N,this},e.isActive=function(){var i=this.parent||this._dp,n=this._start,a;return!!(!i||this._ts&&this._initted&&i.isActive()&&(a=i.rawTime(!0))>=n&&a<this.endTime(!0)-N)},e.eventCallback=function(i,n,a){var r=this.vars;return arguments.length>1?(n?(r[i]=n,a&&(r[i+"Params"]=a),i==="onUpdate"&&(this._onUpdate=n)):delete r[i],this):r[i]},e.then=function(i){var n=this,a=n._prom;return new Promise(function(r){var s=Y(i)?i:za,c=function(){var d=n.then;n.then=null,a&&a(),Y(s)&&(s=s(n))&&(s.then||s===n)&&(n.then=d),r(s),n.then=d};n._initted&&n.totalProgress()===1&&n._ts>=0||!n._tTime&&n._ts<0?c():n._prom=c})},e.kill=function(){Be(this)},o})();wt(Qe.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-N,_prom:0,_ps:!1,_rts:1});var it=(function(o){Ma(e,o);function e(i,n){var a;return i===void 0&&(i={}),a=o.call(this,i)||this,a.labels={},a.smoothChildTiming=!!i.smoothChildTiming,a.autoRemoveChildren=!!i.autoRemoveChildren,a._sort=dt(i.sortChildren),B&&At(i.parent||B,Pt(a),n),i.reversed&&a.reverse(),i.paused&&a.paused(!0),i.scrollTrigger&&Ia(Pt(a),i.scrollTrigger),a}var t=e.prototype;return t.to=function(n,a,r){return Ye(0,arguments,this),this},t.from=function(n,a,r){return Ye(1,arguments,this),this},t.fromTo=function(n,a,r,s){return Ye(2,arguments,this),this},t.set=function(n,a,r){return a.duration=0,a.parent=this,Ve(a).repeatDelay||(a.repeat=0),a.immediateRender=!!a.immediateRender,new K(n,a,vt(this,r),1),this},t.call=function(n,a,r){return At(this,K.delayedCall(0,n,a),r)},t.staggerTo=function(n,a,r,s,c,l,d){return r.duration=a,r.stagger=r.stagger||s,r.onComplete=l,r.onCompleteParams=d,r.parent=this,new K(n,r,vt(this,c)),this},t.staggerFrom=function(n,a,r,s,c,l,d){return r.runBackwards=1,Ve(r).immediateRender=dt(r.immediateRender),this.staggerTo(n,a,r,s,c,l,d)},t.staggerFromTo=function(n,a,r,s,c,l,d,h){return s.startAt=r,Ve(s).immediateRender=dt(s.immediateRender),this.staggerTo(n,a,s,c,l,d,h)},t.render=function(n,a,r){var s=this._time,c=this._dirty?this.totalDuration():this._tDur,l=this._dur,d=n<=0?0:G(n),h=this._zTime<0!=n<0&&(this._initted||!l),m,p,g,u,f,y,_,v,b,w,C,S;if(this!==B&&d>c&&n>=0&&(d=c),d!==this._tTime||r||h){if(s!==this._time&&l&&(d+=this._time-s,n+=this._time-s),m=d,b=this._start,v=this._ts,y=!v,h&&(l||(s=this._zTime),(n||!a)&&(this._zTime=n)),this._repeat){if(C=this._yoyo,f=l+this._rDelay,this._repeat<-1&&n<0)return this.totalTime(f*100+n,a,r);if(m=G(d%f),d===c?(u=this._repeat,m=l):(w=G(d/f),u=~~w,u&&u===w&&(m=l,u--),m>l&&(m=l)),w=we(this._tTime,f),!s&&this._tTime&&w!==u&&this._tTime-w*f-this._dur<=0&&(w=u),C&&u&1&&(m=l-m,S=1),u!==w&&!this._lock){var k=C&&w&1,T=k===(C&&u&1);if(u<w&&(k=!k),s=k?0:d%l?l:d,this._lock=1,this.render(s||(S?0:G(u*f)),a,!l)._lock=0,this._tTime=d,!a&&this.parent&&ft(this,"onRepeat"),this.vars.repeatRefresh&&!S&&(this.invalidate()._lock=1,w=u),s&&s!==this._time||y!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(l=this._dur,c=this._tDur,T&&(this._lock=2,s=k?l:-1e-4,this.render(s,!0),this.vars.repeatRefresh&&!S&&this.invalidate()),this._lock=0,!this._ts&&!y)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(_=Yo(this,G(s),G(m)),_&&(d-=m-(m=_._start))),this._tTime=d,this._time=m,this._act=!!v,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=n,s=0),!s&&d&&l&&!a&&!w&&(ft(this,"onStart"),this._tTime!==d))return this;if(m>=s&&n>=0)for(p=this._first;p;){if(g=p._next,(p._act||m>=p._start)&&p._ts&&_!==p){if(p.parent!==this)return this.render(n,a,r);if(p.render(p._ts>0?(m-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(m-p._start)*p._ts,a,r),m!==this._time||!this._ts&&!y){_=0,g&&(d+=this._zTime=-N);break}}p=g}else{p=this._last;for(var x=n<0?n:m;p;){if(g=p._prev,(p._act||x<=p._end)&&p._ts&&_!==p){if(p.parent!==this)return this.render(n,a,r);if(p.render(p._ts>0?(x-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(x-p._start)*p._ts,a,r||tt&&Mn(p)),m!==this._time||!this._ts&&!y){_=0,g&&(d+=this._zTime=x?-N:N);break}}p=g}}if(_&&!a&&(this.pause(),_.render(m>=s?0:-N)._zTime=m>=s?1:-1,this._ts))return this._start=b,ki(this),this.render(n,a,r);this._onUpdate&&!a&&ft(this,"onUpdate",!0),(d===c&&this._tTime>=this.totalDuration()||!d&&s)&&(b===this._start||Math.abs(v)!==Math.abs(this._ts))&&(this._lock||((n||!l)&&(d===c&&this._ts>0||!d&&this._ts<0)&&It(this,1),!a&&!(n<0&&!s)&&(d||s||!c)&&(ft(this,d===c&&n>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(d<c&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(n,a){var r=this;if(Ft(a)||(a=vt(this,a,n)),!(n instanceof Qe)){if(nt(n))return n.forEach(function(s){return r.add(s,a)}),this;if(Q(n))return this.addLabel(n,a);if(Y(n))n=K.delayedCall(0,n);else return this}return this!==n?At(this,n,a):this},t.getChildren=function(n,a,r,s){n===void 0&&(n=!0),a===void 0&&(a=!0),r===void 0&&(r=!0),s===void 0&&(s=-xt);for(var c=[],l=this._first;l;)l._start>=s&&(l instanceof K?a&&c.push(l):(r&&c.push(l),n&&c.push.apply(c,l.getChildren(!0,a,r)))),l=l._next;return c},t.getById=function(n){for(var a=this.getChildren(1,1,1),r=a.length;r--;)if(a[r].vars.id===n)return a[r]},t.remove=function(n){return Q(n)?this.removeLabel(n):Y(n)?this.killTweensOf(n):(n.parent===this&&Ci(this,n),n===this._recent&&(this._recent=this._last),Zt(this))},t.totalTime=function(n,a){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=G(ct.time-(this._ts>0?n/this._ts:(this.totalDuration()-n)/-this._ts))),o.prototype.totalTime.call(this,n,a),this._forcing=0,this):this._tTime},t.addLabel=function(n,a){return this.labels[n]=vt(this,a),this},t.removeLabel=function(n){return delete this.labels[n],this},t.addPause=function(n,a,r){var s=K.delayedCall(0,a||Xe,r);return s.data="isPause",this._hasPause=1,At(this,s,vt(this,n))},t.removePause=function(n){var a=this._first;for(n=vt(this,n);a;)a._start===n&&a.data==="isPause"&&It(a),a=a._next},t.killTweensOf=function(n,a,r){for(var s=this.getTweensOf(n,r),c=s.length;c--;)zt!==s[c]&&s[c].kill(n,a);return this},t.getTweensOf=function(n,a){for(var r=[],s=St(n),c=this._first,l=Ft(a),d;c;)c instanceof K?No(c._targets,s)&&(l?(!zt||c._initted&&c._ts)&&c.globalTime(0)<=a&&c.globalTime(c.totalDuration())>a:!a||c.isActive())&&r.push(c):(d=c.getTweensOf(s,a)).length&&r.push.apply(r,d),c=c._next;return r},t.tweenTo=function(n,a){a=a||{};var r=this,s=vt(r,n),c=a,l=c.startAt,d=c.onStart,h=c.onStartParams,m=c.immediateRender,p,g=K.to(r,wt({ease:a.ease||"none",lazy:!1,immediateRender:!1,time:s,overwrite:"auto",duration:a.duration||Math.abs((s-(l&&"time"in l?l.time:r._time))/r.timeScale())||N,onStart:function(){if(r.pause(),!p){var f=a.duration||Math.abs((s-(l&&"time"in l?l.time:r._time))/r.timeScale());g._dur!==f&&ye(g,f,0,1).render(g._time,!0,!0),p=1}d&&d.apply(g,h||[])}},a));return m?g.render(0):g},t.tweenFromTo=function(n,a,r){return this.tweenTo(a,wt({startAt:{time:vt(this,n)}},r))},t.recent=function(){return this._recent},t.nextLabel=function(n){return n===void 0&&(n=this._time),ka(this,vt(this,n))},t.previousLabel=function(n){return n===void 0&&(n=this._time),ka(this,vt(this,n),1)},t.currentLabel=function(n){return arguments.length?this.seek(n,!0):this.previousLabel(this._time+N)},t.shiftChildren=function(n,a,r){r===void 0&&(r=0);var s=this._first,c=this.labels,l;for(n=G(n);s;)s._start>=r&&(s._start+=n,s._end+=n),s=s._next;if(a)for(l in c)c[l]>=r&&(c[l]+=n);return Zt(this)},t.invalidate=function(n){var a=this._first;for(this._lock=0;a;)a.invalidate(n),a=a._next;return o.prototype.invalidate.call(this,n)},t.clear=function(n){n===void 0&&(n=!0);for(var a=this._first,r;a;)r=a._next,this.remove(a),a=r;return this._dp&&(this._time=this._tTime=this._pTime=0),n&&(this.labels={}),Zt(this)},t.totalDuration=function(n){var a=0,r=this,s=r._last,c=xt,l,d,h;if(arguments.length)return r.timeScale((r._repeat<0?r.duration():r.totalDuration())/(r.reversed()?-n:n));if(r._dirty){for(h=r.parent;s;)l=s._prev,s._dirty&&s.totalDuration(),d=s._start,d>c&&r._sort&&s._ts&&!r._lock?(r._lock=1,At(r,s,d-s._delay,1)._lock=0):c=d,d<0&&s._ts&&(a-=d,(!h&&!r._dp||h&&h.smoothChildTiming)&&(r._start+=G(d/r._ts),r._time-=d,r._tTime-=d),r.shiftChildren(-d,!1,-1/0),c=0),s._end>a&&s._ts&&(a=s._end),s=l;ye(r,r===B&&r._time>a?r._time:a,1,1),r._dirty=0}return r._tDur},e.updateRoot=function(n){if(B._ts&&(Ha(B,vi(n,B)),Wa=ct.frame),ct.frame>=xa){xa+=ht.autoSleep||120;var a=B._first;if((!a||!a._ts)&&ht.autoSleep&&ct._listeners.length<2){for(;a&&!a._ts;)a=a._next;a||ct.sleep()}}},e})(Qe);wt(it.prototype,{_lock:0,_hasPause:0,_forcing:0});var cs=function(e,t,i,n,a,r,s){var c=new ot(this._pt,e,t,0,1,Hn,null,a),l=0,d=0,h,m,p,g,u,f,y,_;for(c.b=i,c.e=n,i+="",n+="",(y=~n.indexOf("random("))&&(n=be(n)),r&&(_=[i,n],r(_,e,t),i=_[0],n=_[1]),m=i.match(nn)||[];h=nn.exec(n);)g=h[0],u=n.substring(l,h.index),p?p=(p+1)%5:u.substr(-5)==="rgba("&&(p=1),g!==m[d++]&&(f=parseFloat(m[d-1])||0,c._pt={_next:c._pt,p:u||d===1?u:",",s:f,c:g.charAt(1)==="="?ee(f,g)-f:parseFloat(g)-f,m:p&&p<4?Math.round:0},l=nn.lastIndex);return c.c=l<n.length?n.substring(l,n.length):"",c.fp=s,(Sn.test(n)||y)&&(c.e=0),this._pt=c,c},Fn=function(e,t,i,n,a,r,s,c,l,d){Y(n)&&(n=n(a||0,e,r));var h=e[t],m=i!=="get"?i:Y(h)?l?e[t.indexOf("set")||!Y(e["get"+t.substr(3)])?t:"get"+t.substr(3)](l):e[t]():h,p=Y(h)?l?ps:nr:Wn,g;if(Q(n)&&(~n.indexOf("random(")&&(n=be(n)),n.charAt(1)==="="&&(g=ee(m,n)+(et(m)||0),(g||g===0)&&(n=g))),!d||m!==n||yn)return!isNaN(m*n)&&n!==""?(g=new ot(this._pt,e,t,+m||0,n-(m||0),typeof h=="boolean"?gs:ar,0,p),l&&(g.fp=l),s&&g.modifier(s,this,e),this._pt=g):(!h&&!(t in e)&&Ti(t,n),cs.call(this,e,t,m,n,p,c||ht.stringFilter,l))},ds=function(e,t,i,n,a){if(Y(e)&&(e=Ue(e,a,t,i,n)),!Et(e)||e.style&&e.nodeType||nt(e)||La(e))return Q(e)?Ue(e,a,t,i,n):e;var r={},s;for(s in e)r[s]=Ue(e[s],a,t,i,n);return r},On=function(e,t,i,n,a,r){var s,c,l,d;if(lt[e]&&(s=new lt[e]).init(a,s.rawVars?t[e]:ds(t[e],n,a,r,i),i,n,r)!==!1&&(i._pt=c=new ot(i._pt,a,e,0,1,s.render,s,0,s.priority),i!==fe))for(l=i._ptLookup[i._targets.indexOf(a)],d=s._props.length;d--;)l[s._props[d]]=c;return s},zt,yn,Dn=function o(e,t,i){var n=e.vars,a=n.ease,r=n.startAt,s=n.immediateRender,c=n.lazy,l=n.onUpdate,d=n.runBackwards,h=n.yoyoEase,m=n.keyframes,p=n.autoRevert,g=e._dur,u=e._startAt,f=e._targets,y=e.parent,_=y&&y.data==="nested"?y.vars.targets:f,v=e._overwrite==="auto"&&!bn,b=e.timeline,w=n.easeReverse||h,C,S,k,T,x,E,M,L,D,H,W,R,V;if(b&&(!m||!a)&&(a="none"),e._ease=Qt(a,Ke.ease),e._rEase=w&&(Qt(w)||e._ease),e._from=!b&&!!n.runBackwards,e._from&&(e.ratio=1),!b||m&&!n.stagger){if(L=f[0]?$t(f[0]).harness:0,R=L&&n[L.prop],C=bi(n,Cn),u&&(u._zTime<0&&u.progress(1),t<0&&d&&s&&!p?u.render(-1,!0):u.revert(d&&g?fi:Ro),u._lazy=0),r){if(It(e._startAt=K.set(f,wt({data:"isStart",overwrite:!1,parent:y,immediateRender:!0,lazy:!u&&dt(c),startAt:null,delay:0,onUpdate:l&&function(){return ft(e,"onUpdate")},stagger:0},r))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(tt||!s&&!p)&&e._startAt.revert(fi),s&&g&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(d&&g&&!u){if(t&&(s=!1),k=wt({overwrite:!1,data:"isFromStart",lazy:s&&!u&&dt(c),immediateRender:s,stagger:0,parent:y},C),R&&(k[L.prop]=R),It(e._startAt=K.set(f,k)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(tt?e._startAt.revert(fi):e._startAt.render(-1,!0)),e._zTime=t,!s)o(e._startAt,N,N);else if(!t)return}for(e._pt=e._ptCache=0,c=g&&dt(c)||c&&!g,S=0;S<f.length;S++){if(x=f[S],M=x._gsap||An(f)[S]._gsap,e._ptLookup[S]=H={},un[M.id]&&Nt.length&&_i(),W=_===f?S:_.indexOf(x),L&&(D=new L).init(x,R||C,e,W,_)!==!1&&(e._pt=T=new ot(e._pt,x,D.name,0,1,D.render,D,0,D.priority),D._props.forEach(function(_t){H[_t]=T}),D.priority&&(E=1)),!L||R)for(k in C)lt[k]&&(D=On(k,C,e,W,x,_))?D.priority&&(E=1):H[k]=T=Fn.call(e,x,k,"get",C[k],W,_,0,n.stringFilter);e._op&&e._op[S]&&e.kill(x,e._op[S]),v&&e._pt&&(zt=e,B.killTweensOf(x,H,e.globalTime(t)),V=!e.parent,zt=0),e._pt&&c&&(un[M.id]=1)}E&&zn(e),e._onInit&&e._onInit(e)}e._onUpdate=l,e._initted=(!e._op||e._pt)&&!V,m&&t<=0&&b.render(xt,!0,!0)},hs=function(e,t,i,n,a,r,s,c){var l=(e._pt&&e._ptCache||(e._ptCache={}))[t],d,h,m,p;if(!l)for(l=e._ptCache[t]=[],m=e._ptLookup,p=e._targets.length;p--;){if(d=m[p][t],d&&d.d&&d.d._pt)for(d=d.d._pt;d&&d.p!==t&&d.fp!==t;)d=d._next;if(!d)return yn=1,e.vars[t]="+=0",Dn(e,s),yn=0,c?je(t+" not eligible for reset. Try splitting into individual properties"):1;l.push(d)}for(p=l.length;p--;)h=l[p],d=h._pt||h,d.s=(n||n===0)&&!a?n:d.s+(n||0)+r*d.c,d.c=i-d.s,h.e&&(h.e=U(i)+et(h.e)),h.b&&(h.b=d.s+et(h.b))},us=function(e,t){var i=e[0]?$t(e[0]).harness:0,n=i&&i.aliases,a,r,s,c;if(!n)return t;a=ge({},t);for(r in n)if(r in a)for(c=n[r].split(","),s=c.length;s--;)a[c[s]]=a[r];return a},ms=function(e,t,i,n){var a=t.ease||n||"power1.inOut",r,s;if(nt(t))s=i[e]||(i[e]=[]),t.forEach(function(c,l){return s.push({t:l/(t.length-1)*100,v:c,e:a})});else for(r in t)s=i[r]||(i[r]=[]),r==="ease"||s.push({t:parseFloat(e),v:t[r],e:a})},Ue=function(e,t,i,n,a){return Y(e)?e.call(t,i,n,a):Q(e)&&~e.indexOf("random(")?be(e):e},er=kn+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",ir={};rt(er+",id,stagger,delay,duration,paused,scrollTrigger",function(o){return ir[o]=1});var K=(function(o){Ma(e,o);function e(i,n,a,r){var s;typeof n=="number"&&(a.duration=n,n=a,a=null),s=o.call(this,r?n:Ve(n))||this;var c=s.vars,l=c.duration,d=c.delay,h=c.immediateRender,m=c.stagger,p=c.overwrite,g=c.keyframes,u=c.defaults,f=c.scrollTrigger,y=n.parent||B,_=(nt(i)||La(i)?Ft(i[0]):"length"in n)?[i]:St(i),v,b,w,C,S,k,T,x;if(s._targets=_.length?An(_):je("GSAP target "+i+" not found. https://gsap.com",!ht.nullTargetWarn)||[],s._ptLookup=[],s._overwrite=p,g||m||pi(l)||pi(d)){n=s.vars;var E=n.easeReverse||n.yoyoEase;if(v=s.timeline=new it({data:"nested",defaults:u||{},targets:y&&y.data==="nested"?y.vars.targets:_}),v.kill(),v.parent=v._dp=Pt(s),v._start=0,m||pi(l)||pi(d)){if(C=_.length,T=m&&Va(m),Et(m))for(S in m)~er.indexOf(S)&&(x||(x={}),x[S]=m[S]);for(b=0;b<C;b++)w=bi(n,ir),w.stagger=0,E&&(w.easeReverse=E),x&&ge(w,x),k=_[b],w.duration=+Ue(l,Pt(s),b,k,_),w.delay=(+Ue(d,Pt(s),b,k,_)||0)-s._delay,!m&&C===1&&w.delay&&(s._delay=d=w.delay,s._start+=d,w.delay=0),v.to(k,w,T?T(b,k,_):0),v._ease=F.none;v.duration()?l=d=0:s.timeline=0}else if(g){Ve(wt(v.vars.defaults,{ease:"none"})),v._ease=Qt(g.ease||n.ease||"none");var M=0,L,D,H;if(nt(g))g.forEach(function(W){return v.to(_,W,">")}),v.duration();else{w={};for(S in g)S==="ease"||S==="easeEach"||ms(S,g[S],w,g.easeEach);for(S in w)for(L=w[S].sort(function(W,R){return W.t-R.t}),M=0,b=0;b<L.length;b++)D=L[b],H={ease:D.e,duration:(D.t-(b?L[b-1].t:0))/100*l},H[S]=D.v,v.to(_,H,M),M+=H.duration;v.duration()<l&&v.to({},{duration:l-v.duration()})}}l||s.duration(l=v.duration())}else s.timeline=0;return p===!0&&!bn&&(zt=Pt(s),B.killTweensOf(_),zt=0),At(y,Pt(s),a),n.reversed&&s.reverse(),n.paused&&s.paused(!0),(h||!l&&!g&&s._start===G(y._time)&&dt(h)&&Bo(Pt(s))&&y.data!=="nested")&&(s._tTime=-N,s.render(Math.max(0,-d)||0)),f&&Ia(Pt(s),f),s}var t=e.prototype;return t.render=function(n,a,r){var s=this._time,c=this._tDur,l=this._dur,d=n<0,h=n>c-N&&!d?c:n<N?0:n,m,p,g,u,f,y,_,v;if(!l)Vo(this,n,a,r);else if(h!==this._tTime||!n||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==d||this._lazy){if(m=h,v=this.timeline,this._repeat){if(u=l+this._rDelay,this._repeat<-1&&d)return this.totalTime(u*100+n,a,r);if(m=G(h%u),h===c?(g=this._repeat,m=l):(f=G(h/u),g=~~f,g&&g===f?(m=l,g--):m>l&&(m=l)),y=this._yoyo&&g&1,y&&(m=l-m),f=we(this._tTime,u),m===s&&!r&&this._initted&&g===f)return this._tTime=h,this;g!==f&&this.vars.repeatRefresh&&!y&&!this._lock&&m!==u&&this._initted&&(this._lock=r=1,this.render(G(u*g),!0).invalidate()._lock=0)}if(!this._initted){if(Ga(this,d?n:m,r,a,h))return this._tTime=0,this;if(s!==this._time&&!(r&&this.vars.repeatRefresh&&g!==f))return this;if(l!==this._dur)return this.render(n,a,r)}if(this._rEase){var b=m<s;if(b!==this._inv){var w=b?s:l-s;this._inv=b,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=s,this._invRecip=w?(b?-1:1)/w:0,this._invScale=b?-this.ratio:1-this.ratio,this._invEase=b?this._rEase:this._ease}this.ratio=_=this._invRatio+this._invScale*this._invEase((m-this._invTime)*this._invRecip)}else this.ratio=_=this._ease(m/l);if(this._from&&(this.ratio=_=1-_),this._tTime=h,this._time=m,!this._act&&this._ts&&(this._act=1,this._lazy=0),!s&&h&&!a&&!f&&(ft(this,"onStart"),this._tTime!==h))return this;for(p=this._pt;p;)p.r(_,p.d),p=p._next;v&&v.render(n<0?n:v._dur*v._ease(m/this._dur),a,r)||this._startAt&&(this._zTime=n),this._onUpdate&&!a&&(d&&mn(this,n,a,r),ft(this,"onUpdate")),this._repeat&&g!==f&&this.vars.onRepeat&&!a&&this.parent&&ft(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(d&&!this._onUpdate&&mn(this,n,!0,!0),(n||!l)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&It(this,1),!a&&!(d&&!s)&&(h||s||y)&&(ft(this,h===c?"onComplete":"onReverseComplete",!0),this._prom&&!(h<c&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(n){return(!n||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(n),o.prototype.invalidate.call(this,n)},t.resetTo=function(n,a,r,s,c){Ze||ct.wake(),this._ts||this.play();var l=Math.min(this._dur,(this._dp._time-this._start)*this._ts),d;return this._initted||Dn(this,l),d=this._ease(l/this._dur),hs(this,n,a,r,s,d,l,c)?this.resetTo(n,a,r,s,1):(Ai(this,0),this.parent||Na(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(n,a){if(a===void 0&&(a="all"),!n&&(!a||a==="all"))return this._lazy=this._pt=0,this.parent?Be(this):this.scrollTrigger&&this.scrollTrigger.kill(!!tt),this;if(this.timeline){var r=this.timeline.totalDuration();return this.timeline.killTweensOf(n,a,zt&&zt.vars.overwrite!==!0)._first||Be(this),this.parent&&r!==this.timeline.totalDuration()&&ye(this,this._dur*this.timeline._tDur/r,0,1),this}var s=this._targets,c=n?St(n):s,l=this._ptLookup,d=this._pt,h,m,p,g,u,f,y;if((!a||a==="all")&&Io(s,c))return a==="all"&&(this._pt=0),Be(this);for(h=this._op=this._op||[],a!=="all"&&(Q(a)&&(u={},rt(a,function(_){return u[_]=1}),a=u),a=us(s,a)),y=s.length;y--;)if(~c.indexOf(s[y])){m=l[y],a==="all"?(h[y]=a,g=m,p={}):(p=h[y]=h[y]||{},g=a);for(u in g)f=m&&m[u],f&&((!("kill"in f.d)||f.d.kill(u)===!0)&&Ci(this,f,"_pt"),delete m[u]),p!=="all"&&(p[u]=1)}return this._initted&&!this._pt&&d&&Be(this),this},e.to=function(n,a){return new e(n,a,arguments[2])},e.from=function(n,a){return Ye(1,arguments)},e.delayedCall=function(n,a,r,s){return new e(a,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:n,onComplete:a,onReverseComplete:a,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:s})},e.fromTo=function(n,a,r){return Ye(2,arguments)},e.set=function(n,a){return a.duration=0,a.repeatDelay||(a.repeat=0),new e(n,a)},e.killTweensOf=function(n,a,r){return B.killTweensOf(n,a,r)},e})(Qe);wt(K.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});rt("staggerTo,staggerFrom,staggerFromTo",function(o){K[o]=function(){var e=new it,t=fn.call(arguments,0);return t.splice(o==="staggerFromTo"?5:4,0,0),e[o].apply(e,t)}});var Wn=function(e,t,i){return e[t]=i},nr=function(e,t,i){return e[t](i)},ps=function(e,t,i,n){return e[t](n.fp,i)},fs=function(e,t,i){return e.setAttribute(t,i)},Ei=function(e,t){return Y(e[t])?nr:Si(e[t])&&e.setAttribute?fs:Wn},ar=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},gs=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Hn=function(e,t){var i=t._pt,n="";if(!e&&t.b)n=t.b;else if(e===1&&t.e)n=t.e;else{for(;i;)n=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+n,i=i._next;n+=t.c}t.set(t.t,t.p,n,t)},Rn=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},ws=function(e,t,i,n){for(var a=this._pt,r;a;)r=a._next,a.p===n&&a.modifier(e,t,i),a=r},ys=function(e){for(var t=this._pt,i,n;t;)n=t._next,t.p===e&&!t.op||t.op===e?Ci(this,t,"_pt"):t.dep||(i=1),t=n;return!i},_s=function(e,t,i,n){n.mSet(e,t,n.m.call(n.tween,i,n.mt),n)},zn=function(e){for(var t=e._pt,i,n,a,r;t;){for(i=t._next,n=a;n&&n.pr>t.pr;)n=n._next;(t._prev=n?n._prev:r)?t._prev._next=t:a=t,(t._next=n)?n._prev=t:r=t,t=i}e._pt=a},ot=(function(){function o(t,i,n,a,r,s,c,l,d){this.t=i,this.s=a,this.c=r,this.p=n,this.r=s||ar,this.d=c||this,this.set=l||Wn,this.pr=d||0,this._next=t,t&&(t._prev=this)}var e=o.prototype;return e.modifier=function(i,n,a){this.mSet=this.mSet||this.set,this.set=_s,this.m=i,this.mt=a,this.tween=n},o})();rt(kn+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(o){return Cn[o]=1});gt.TweenMax=gt.TweenLite=K;gt.TimelineLite=gt.TimelineMax=it;B=new it({sortChildren:!1,defaults:Ke,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ht.stringFilter=Pn;var Jt=[],wi={},bs=[],Ea=0,vs=0,ln=function(e){return(wi[e]||bs).map(function(t){return t()})},_n=function(){var e=Date.now(),t=[];e-Ea>2&&(ln("matchMediaInit"),Jt.forEach(function(i){var n=i.queries,a=i.conditions,r,s,c,l;for(s in n)r=kt.matchMedia(n[s]).matches,r&&(c=1),r!==a[s]&&(a[s]=r,l=1);l&&(i.revert(),c&&t.push(i))}),ln("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(n){return i.add(null,n)})}),Ea=e,ln("matchMedia"))},rr=(function(){function o(t,i){this.selector=i&&gn(i),this.data=[],this._r=[],this.isReverted=!1,this.id=vs++,t&&this.add(t)}var e=o.prototype;return e.add=function(i,n,a){Y(i)&&(a=n,n=i,i=Y);var r=this,s=function(){var l=I,d=r.selector,h;return l&&l!==r&&l.data.push(r),a&&(r.selector=gn(a)),I=r,h=n.apply(r,arguments),Y(h)&&r._r.push(h),I=l,r.selector=d,r.isReverted=!1,h};return r.last=s,i===Y?s(r,function(c){return r.add(null,c)}):i?r[i]=s:s},e.ignore=function(i){var n=I;I=null,i(this),I=n},e.getTweens=function(){var i=[];return this.data.forEach(function(n){return n instanceof o?i.push.apply(i,n.getTweens()):n instanceof K&&!(n.parent&&n.parent.data==="nested")&&i.push(n)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,n){var a=this;if(i?(function(){for(var s=a.getTweens(),c=a.data.length,l;c--;)l=a.data[c],l.data==="isFlip"&&(l.revert(),l.getChildren(!0,!0,!1).forEach(function(d){return s.splice(s.indexOf(d),1)}));for(s.map(function(d){return{g:d._dur||d._delay||d._sat&&!d._sat.vars.immediateRender?d.globalTime(0):-1/0,t:d}}).sort(function(d,h){return h.g-d.g||-1/0}).forEach(function(d){return d.t.revert(i)}),c=a.data.length;c--;)l=a.data[c],l instanceof it?l.data!=="nested"&&(l.scrollTrigger&&l.scrollTrigger.revert(),l.kill()):!(l instanceof K)&&l.revert&&l.revert(i);a._r.forEach(function(d){return d(i,a)}),a.isReverted=!0})():this.data.forEach(function(s){return s.kill&&s.kill()}),this.clear(),n)for(var r=Jt.length;r--;)Jt[r].id===this.id&&Jt.splice(r,1)},e.revert=function(i){this.kill(i||{})},o})(),xs=(function(){function o(t){this.contexts=[],this.scope=t,I&&I.data.push(this)}var e=o.prototype;return e.add=function(i,n,a){Et(i)||(i={matches:i});var r=new rr(0,a||this.scope),s=r.conditions={},c,l,d;I&&!r.selector&&(r.selector=I.selector),this.contexts.push(r),n=r.add("onMatch",n),r.queries=i;for(l in i)l==="all"?d=1:(c=kt.matchMedia(i[l]),c&&(Jt.indexOf(r)<0&&Jt.push(r),(s[l]=c.matches)&&(d=1),c.addListener?c.addListener(_n):c.addEventListener("change",_n)));return d&&n(r,function(h){return r.add(null,h)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(n){return n.kill(i,!0)})},o})(),xi={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(n){return Za(n)})},timeline:function(e){return new it(e)},getTweensOf:function(e,t){return B.getTweensOf(e,t)},getProperty:function(e,t,i,n){Q(e)&&(e=St(e)[0]);var a=$t(e||{}).get,r=i?za:Ra;return i==="native"&&(i=""),e&&(t?r((lt[t]&&lt[t].get||a)(e,t,i,n)):function(s,c,l){return r((lt[s]&&lt[s].get||a)(e,s,c,l))})},quickSetter:function(e,t,i){if(e=St(e),e.length>1){var n=e.map(function(d){return at.quickSetter(d,t,i)}),a=n.length;return function(d){for(var h=a;h--;)n[h](d)}}e=e[0]||{};var r=lt[t],s=$t(e),c=s.harness&&(s.harness.aliases||{})[t]||t,l=r?function(d){var h=new r;fe._pt=0,h.init(e,i?d+i:d,fe,0,[e]),h.render(1,h),fe._pt&&Rn(1,fe)}:s.set(e,c);return r?l:function(d){return l(e,c,i?d+i:d,s,1)}},quickTo:function(e,t,i){var n,a=at.to(e,wt((n={},n[t]="+=0.1",n.paused=!0,n.stagger=0,n),i||{})),r=function(c,l,d){return a.resetTo(t,c,l,d)};return r.tween=a,r},isTweening:function(e){return B.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=Qt(e.ease,Ke.ease)),Sa(Ke,e||{})},config:function(e){return Sa(ht,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,n=e.plugins,a=e.defaults,r=e.extendTimeline;(n||"").split(",").forEach(function(s){return s&&!lt[s]&&!gt[s]&&je(t+" effect requires "+s+" plugin.")}),an[t]=function(s,c,l){return i(St(s),wt(c||{},a),l)},r&&(it.prototype[t]=function(s,c,l){return this.add(an[t](s,Et(c)?c:(l=c)&&{},this),l)})},registerEase:function(e,t){F[e]=Qt(t)},parseEase:function(e,t){return arguments.length?Qt(e,t):F},getById:function(e){return B.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new it(e),n,a;for(i.smoothChildTiming=dt(e.smoothChildTiming),B.remove(i),i._dp=0,i._time=i._tTime=B._time,n=B._first;n;)a=n._next,(t||!(!n._dur&&n instanceof K&&n.vars.onComplete===n._targets[0]))&&At(i,n,n._start-n._delay),n=a;return At(B,i,0),i},context:function(e,t){return e?new rr(e,t):I},matchMedia:function(e){return new xs(e)},matchMediaRefresh:function(){return Jt.forEach(function(e){var t=e.conditions,i,n;for(n in t)t[n]&&(t[n]=!1,i=1);i&&e.revert()})||_n()},addEventListener:function(e,t){var i=wi[e]||(wi[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=wi[e],n=i&&i.indexOf(t);n>=0&&i.splice(n,1)},utils:{wrap:Jo,wrapYoyo:ts,distribute:Va,random:Ua,snap:Ya,normalize:Qo,getUnit:et,clamp:Ko,splitColor:Qa,toArray:St,selector:gn,mapRange:ja,pipe:Xo,unitize:Zo,interpolate:es,shuffle:qa},install:Oa,effects:an,ticker:ct,updateRoot:it.updateRoot,plugins:lt,globalTimeline:B,core:{PropTween:ot,globals:Da,Tween:K,Timeline:it,Animation:Qe,getCache:$t,_removeLinkedListItem:Ci,reverting:function(){return tt},context:function(e){return e&&I&&(I.data.push(e),e._ctx=I),I},suppressOverwrites:function(e){return bn=e}}};rt("to,from,fromTo,delayedCall,set,killTweensOf",function(o){return xi[o]=K[o]});ct.add(it.updateRoot);fe=xi.to({},{duration:0});var Ss=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},Ts=function(e,t){var i=e._targets,n,a,r;for(n in t)for(a=i.length;a--;)r=e._ptLookup[a][n],r&&(r=r.d)&&(r._pt&&(r=Ss(r,n)),r&&r.modifier&&r.modifier(t[n],e,i[a],n))},cn=function(e,t){return{name:e,headless:1,rawVars:1,init:function(n,a,r){r._onInit=function(s){var c,l;if(Q(a)&&(c={},rt(a,function(d){return c[d]=1}),a=c),t){c={};for(l in a)c[l]=t(a[l]);a=c}Ts(s,a)}}}},at=xi.registerPlugin({name:"attr",init:function(e,t,i,n,a){var r,s,c;this.tween=i;for(r in t)c=e.getAttribute(r)||"",s=this.add(e,"setAttribute",(c||0)+"",t[r],n,a,0,0,r),s.op=r,s.b=c,this._props.push(r)},render:function(e,t){for(var i=t._pt;i;)tt?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},cn("roundProps",wn),cn("modifiers"),cn("snap",Ya))||xi;K.version=it.version=at.version="3.15.0";Fa=1;vn()&&_e();var Cs=F.Power0,ks=F.Power1,As=F.Power2,Es=F.Power3,Ms=F.Power4,Ps=F.Linear,Ls=F.Quad,Fs=F.Cubic,Os=F.Quart,Ds=F.Quint,Ws=F.Strong,Hs=F.Elastic,Rs=F.Back,zs=F.SteppedEase,Ns=F.Bounce,$s=F.Sine,Is=F.Expo,Gs=F.Circ;var or,Bt,xe,qn,oe,Bs,sr,Vn,qs=function(){return typeof window<"u"},Dt={},re=180/Math.PI,Se=Math.PI/180,ve=Math.atan2,lr=1e8,Yn=/([A-Z])/g,Vs=/(left|right|width|margin|padding|x)/i,Ys=/[\s,\(]\S/,Mt={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},$n=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Us=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Ks=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},js=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Xs=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},gr=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},wr=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},Zs=function(e,t,i){return e.style[t]=i},Qs=function(e,t,i){return e.style.setProperty(t,i)},Js=function(e,t,i){return e._gsap[t]=i},tl=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},el=function(e,t,i,n,a){var r=e._gsap;r.scaleX=r.scaleY=i,r.renderTransform(a,r)},il=function(e,t,i,n,a){var r=e._gsap;r[t]=i,r.renderTransform(a,r)},q="transform",ut=q+"Origin",nl=function o(e,t){var i=this,n=this.target,a=n.style,r=n._gsap;if(e in Dt&&a){if(this.tfm=this.tfm||{},e!=="transform")e=Mt[e]||e,~e.indexOf(",")?e.split(",").forEach(function(s){return i.tfm[s]=Ot(n,s)}):this.tfm[e]=r.x?r[e]:Ot(n,e),e===ut&&(this.tfm.zOrigin=r.zOrigin);else return Mt.transform.split(",").forEach(function(s){return o.call(i,s,t)});if(this.props.indexOf(q)>=0)return;r.svg&&(this.svgo=n.getAttribute("data-svg-origin"),this.props.push(ut,t,"")),e=q}(a||t)&&this.props.push(e,t,a[e])},yr=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},al=function(){var e=this.props,t=this.target,i=t.style,n=t._gsap,a,r;for(a=0;a<e.length;a+=3)e[a+1]?e[a+1]===2?t[e[a]](e[a+2]):t[e[a]]=e[a+2]:e[a+2]?i[e[a]]=e[a+2]:i.removeProperty(e[a].substr(0,2)==="--"?e[a]:e[a].replace(Yn,"-$1").toLowerCase());if(this.tfm){for(r in this.tfm)n[r]=this.tfm[r];n.svg&&(n.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),a=Vn(),(!a||!a.isStart)&&!i[q]&&(yr(i),n.zOrigin&&i[ut]&&(i[ut]+=" "+n.zOrigin+"px",n.zOrigin=0,n.renderTransform()),n.uncache=1)}},_r=function(e,t){var i={target:e,props:[],revert:al,save:nl};return e._gsap||at.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(n){return i.save(n)}),i},br,In=function(e,t){var i=Bt.createElementNS?Bt.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Bt.createElement(e);return i&&i.style?i:Bt.createElement(e)},yt=function o(e,t,i){var n=getComputedStyle(e);return n[t]||n.getPropertyValue(t.replace(Yn,"-$1").toLowerCase())||n.getPropertyValue(t)||!i&&o(e,Te(t)||t,1)||""},cr="O,Moz,ms,Ms,Webkit".split(","),Te=function(e,t,i){var n=t||oe,a=n.style,r=5;if(e in a&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);r--&&!(cr[r]+e in a););return r<0?null:(r===3?"ms":r>=0?cr[r]:"")+e},Gn=function(){qs()&&window.document&&(or=window,Bt=or.document,xe=Bt.documentElement,oe=In("div")||{style:{}},Bs=In("div"),q=Te(q),ut=q+"Origin",oe.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",br=!!Te("perspective"),Vn=at.core.reverting,qn=1)},dr=function(e){var t=e.ownerSVGElement,i=In("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=e.cloneNode(!0),a;n.style.display="block",i.appendChild(n),xe.appendChild(i);try{a=n.getBBox()}catch{}return i.removeChild(n),xe.removeChild(i),a},hr=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},vr=function(e){var t,i;try{t=e.getBBox()}catch{t=dr(e),i=1}return t&&(t.width||t.height)||i||(t=dr(e)),t&&!t.width&&!t.x&&!t.y?{x:+hr(e,["x","cx","x1"])||0,y:+hr(e,["y","cy","y1"])||0,width:0,height:0}:t},xr=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&vr(e))},Vt=function(e,t){if(t){var i=e.style,n;t in Dt&&t!==ut&&(t=q),i.removeProperty?(n=t.substr(0,2),(n==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(n==="--"?t:t.replace(Yn,"-$1").toLowerCase())):i.removeAttribute(t)}},qt=function(e,t,i,n,a,r){var s=new ot(e._pt,t,i,0,1,r?wr:gr);return e._pt=s,s.b=n,s.e=a,e._props.push(i),s},ur={deg:1,rad:1,turn:1},rl={grid:1,flex:1},Yt=function o(e,t,i,n){var a=parseFloat(i)||0,r=(i+"").trim().substr((a+"").length)||"px",s=oe.style,c=Vs.test(t),l=e.tagName.toLowerCase()==="svg",d=(l?"client":"offset")+(c?"Width":"Height"),h=100,m=n==="px",p=n==="%",g,u,f,y;if(n===r||!a||ur[n]||ur[r])return a;if(r!=="px"&&!m&&(a=o(e,t,i,"px")),y=e.getCTM&&xr(e),(p||r==="%")&&(Dt[t]||~t.indexOf("adius")))return g=y?e.getBBox()[c?"width":"height"]:e[d],U(p?a/g*h:a/100*g);if(s[c?"width":"height"]=h+(m?r:n),u=n!=="rem"&&~t.indexOf("adius")||n==="em"&&e.appendChild&&!l?e:e.parentNode,y&&(u=(e.ownerSVGElement||{}).parentNode),(!u||u===Bt||!u.appendChild)&&(u=Bt.body),f=u._gsap,f&&p&&f.width&&c&&f.time===ct.time&&!f.uncache)return U(a/f.width*h);if(p&&(t==="height"||t==="width")){var _=e.style[t];e.style[t]=h+n,g=e[d],_?e.style[t]=_:Vt(e,t)}else(p||r==="%")&&!rl[yt(u,"display")]&&(s.position=yt(e,"position")),u===e&&(s.position="static"),u.appendChild(oe),g=oe[d],u.removeChild(oe),s.position="absolute";return c&&p&&(f=$t(u),f.time=ct.time,f.width=u[d]),U(m?g*a/h:g&&a?h/g*a:0)},Ot=function(e,t,i,n){var a;return qn||Gn(),t in Mt&&t!=="transform"&&(t=Mt[t],~t.indexOf(",")&&(t=t.split(",")[0])),Dt[t]&&t!=="transform"?(a=ii(e,n),a=t!=="transformOrigin"?a[t]:a.svg?a.origin:Pi(yt(e,ut))+" "+a.zOrigin+"px"):(a=e.style[t],(!a||a==="auto"||n||~(a+"").indexOf("calc("))&&(a=Mi[t]&&Mi[t](e,t,i)||yt(e,t)||En(e,t)||(t==="opacity"?1:0))),i&&!~(a+"").trim().indexOf(" ")?Yt(e,t,a,i)+i:a},ol=function(e,t,i,n){if(!i||i==="none"){var a=Te(t,e,1),r=a&&yt(e,a,1);r&&r!==i?(t=a,i=r):t==="borderColor"&&(i=yt(e,"borderTopColor"))}var s=new ot(this._pt,e.style,t,0,1,Hn),c=0,l=0,d,h,m,p,g,u,f,y,_,v,b,w;if(s.b=i,s.e=n,i+="",n+="",n.substring(0,6)==="var(--"&&(n=yt(e,n.substring(4,n.indexOf(")")))),n==="auto"&&(u=e.style[t],e.style[t]=n,n=yt(e,t)||n,u?e.style[t]=u:Vt(e,t)),d=[i,n],Pn(d),i=d[0],n=d[1],m=i.match(te)||[],w=n.match(te)||[],w.length){for(;h=te.exec(n);)f=h[0],_=n.substring(c,h.index),g?g=(g+1)%5:(_.substr(-5)==="rgba("||_.substr(-5)==="hsla(")&&(g=1),f!==(u=m[l++]||"")&&(p=parseFloat(u)||0,b=u.substr((p+"").length),f.charAt(1)==="="&&(f=ee(p,f)+b),y=parseFloat(f),v=f.substr((y+"").length),c=te.lastIndex-v.length,v||(v=v||ht.units[t]||b,c===n.length&&(n+=v,s.e+=v)),b!==v&&(p=Yt(e,t,u,v)||0),s._pt={_next:s._pt,p:_||l===1?_:",",s:p,c:y-p,m:g&&g<4||t==="zIndex"?Math.round:0});s.c=c<n.length?n.substring(c,n.length):""}else s.r=t==="display"&&n==="none"?wr:gr;return Sn.test(n)&&(s.e=0),this._pt=s,s},mr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},sl=function(e){var t=e.split(" "),i=t[0],n=t[1]||"50%";return(i==="top"||i==="bottom"||n==="left"||n==="right")&&(e=i,i=n,n=e),t[0]=mr[i]||i,t[1]=mr[n]||n,t.join(" ")},ll=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,n=i.style,a=t.u,r=i._gsap,s,c,l;if(a==="all"||a===!0)n.cssText="",c=1;else for(a=a.split(","),l=a.length;--l>-1;)s=a[l],Dt[s]&&(c=1,s=s==="transformOrigin"?ut:q),Vt(i,s);c&&(Vt(i,q),r&&(r.svg&&i.removeAttribute("transform"),n.scale=n.rotate=n.translate="none",ii(i,1),r.uncache=1,yr(n)))}},Mi={clearProps:function(e,t,i,n,a){if(a.data!=="isFromStart"){var r=e._pt=new ot(e._pt,t,i,0,0,ll);return r.u=n,r.pr=-10,r.tween=a,e._props.push(i),1}}},ei=[1,0,0,1,0,0],Sr={},Tr=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},pr=function(e){var t=yt(e,q);return Tr(t)?ei:t.substr(7).match(xn).map(U)},Un=function(e,t){var i=e._gsap||$t(e),n=e.style,a=pr(e),r,s,c,l;return i.svg&&e.getAttribute("transform")?(c=e.transform.baseVal.consolidate().matrix,a=[c.a,c.b,c.c,c.d,c.e,c.f],a.join(",")==="1,0,0,1,0,0"?ei:a):(a===ei&&!e.offsetParent&&e!==xe&&!i.svg&&(c=n.display,n.display="block",r=e.parentNode,(!r||!e.offsetParent&&!e.getBoundingClientRect().width)&&(l=1,s=e.nextElementSibling,xe.appendChild(e)),a=pr(e),c?n.display=c:Vt(e,"display"),l&&(s?r.insertBefore(e,s):r?r.appendChild(e):xe.removeChild(e))),t&&a.length>6?[a[0],a[1],a[4],a[5],a[12],a[13]]:a)},Bn=function(e,t,i,n,a,r){var s=e._gsap,c=a||Un(e,!0),l=s.xOrigin||0,d=s.yOrigin||0,h=s.xOffset||0,m=s.yOffset||0,p=c[0],g=c[1],u=c[2],f=c[3],y=c[4],_=c[5],v=t.split(" "),b=parseFloat(v[0])||0,w=parseFloat(v[1])||0,C,S,k,T;i?c!==ei&&(S=p*f-g*u)&&(k=b*(f/S)+w*(-u/S)+(u*_-f*y)/S,T=b*(-g/S)+w*(p/S)-(p*_-g*y)/S,b=k,w=T):(C=vr(e),b=C.x+(~v[0].indexOf("%")?b/100*C.width:b),w=C.y+(~(v[1]||v[0]).indexOf("%")?w/100*C.height:w)),n||n!==!1&&s.smooth?(y=b-l,_=w-d,s.xOffset=h+(y*p+_*u)-y,s.yOffset=m+(y*g+_*f)-_):s.xOffset=s.yOffset=0,s.xOrigin=b,s.yOrigin=w,s.smooth=!!n,s.origin=t,s.originIsAbsolute=!!i,e.style[ut]="0px 0px",r&&(qt(r,s,"xOrigin",l,b),qt(r,s,"yOrigin",d,w),qt(r,s,"xOffset",h,s.xOffset),qt(r,s,"yOffset",m,s.yOffset)),e.setAttribute("data-svg-origin",b+" "+w)},ii=function(e,t){var i=e._gsap||new Ln(e);if("x"in i&&!t&&!i.uncache)return i;var n=e.style,a=i.scaleX<0,r="px",s="deg",c=getComputedStyle(e),l=yt(e,ut)||"0",d,h,m,p,g,u,f,y,_,v,b,w,C,S,k,T,x,E,M,L,D,H,W,R,V,_t,$,Z,j,st,pt,bt;return d=h=m=u=f=y=_=v=b=0,p=g=1,i.svg=!!(e.getCTM&&xr(e)),c.translate&&((c.translate!=="none"||c.scale!=="none"||c.rotate!=="none")&&(n[q]=(c.translate!=="none"?"translate3d("+(c.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(c.rotate!=="none"?"rotate("+c.rotate+") ":"")+(c.scale!=="none"?"scale("+c.scale.split(" ").join(",")+") ":"")+(c[q]!=="none"?c[q]:"")),n.scale=n.rotate=n.translate="none"),S=Un(e,i.svg),i.svg&&(i.uncache?(V=e.getBBox(),l=i.xOrigin-V.x+"px "+(i.yOrigin-V.y)+"px",R=""):R=!t&&e.getAttribute("data-svg-origin"),Bn(e,R||l,!!R||i.originIsAbsolute,i.smooth!==!1,S)),w=i.xOrigin||0,C=i.yOrigin||0,S!==ei&&(E=S[0],M=S[1],L=S[2],D=S[3],d=H=S[4],h=W=S[5],S.length===6?(p=Math.sqrt(E*E+M*M),g=Math.sqrt(D*D+L*L),u=E||M?ve(M,E)*re:0,_=L||D?ve(L,D)*re+u:0,_&&(g*=Math.abs(Math.cos(_*Se))),i.svg&&(d-=w-(w*E+C*L),h-=C-(w*M+C*D))):(bt=S[6],st=S[7],$=S[8],Z=S[9],j=S[10],pt=S[11],d=S[12],h=S[13],m=S[14],k=ve(bt,j),f=k*re,k&&(T=Math.cos(-k),x=Math.sin(-k),R=H*T+$*x,V=W*T+Z*x,_t=bt*T+j*x,$=H*-x+$*T,Z=W*-x+Z*T,j=bt*-x+j*T,pt=st*-x+pt*T,H=R,W=V,bt=_t),k=ve(-L,j),y=k*re,k&&(T=Math.cos(-k),x=Math.sin(-k),R=E*T-$*x,V=M*T-Z*x,_t=L*T-j*x,pt=D*x+pt*T,E=R,M=V,L=_t),k=ve(M,E),u=k*re,k&&(T=Math.cos(k),x=Math.sin(k),R=E*T+M*x,V=H*T+W*x,M=M*T-E*x,W=W*T-H*x,E=R,H=V),f&&Math.abs(f)+Math.abs(u)>359.9&&(f=u=0,y=180-y),p=U(Math.sqrt(E*E+M*M+L*L)),g=U(Math.sqrt(W*W+bt*bt)),k=ve(H,W),_=Math.abs(k)>2e-4?k*re:0,b=pt?1/(pt<0?-pt:pt):0),i.svg&&(R=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!Tr(yt(e,q)),R&&e.setAttribute("transform",R))),Math.abs(_)>90&&Math.abs(_)<270&&(a?(p*=-1,_+=u<=0?180:-180,u+=u<=0?180:-180):(g*=-1,_+=_<=0?180:-180)),t=t||i.uncache,i.x=d-((i.xPercent=d&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-d)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+r,i.y=h-((i.yPercent=h&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-h)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+r,i.z=m+r,i.scaleX=U(p),i.scaleY=U(g),i.rotation=U(u)+s,i.rotationX=U(f)+s,i.rotationY=U(y)+s,i.skewX=_+s,i.skewY=v+s,i.transformPerspective=b+r,(i.zOrigin=parseFloat(l.split(" ")[2])||!t&&i.zOrigin||0)&&(n[ut]=Pi(l)),i.xOffset=i.yOffset=0,i.force3D=ht.force3D,i.renderTransform=i.svg?dl:br?Cr:cl,i.uncache=0,i},Pi=function(e){return(e=e.split(" "))[0]+" "+e[1]},Nn=function(e,t,i){var n=et(t);return U(parseFloat(t)+parseFloat(Yt(e,"x",i+"px",n)))+n},cl=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,Cr(e,t)},ne="0deg",ti="0px",ae=") ",Cr=function(e,t){var i=t||this,n=i.xPercent,a=i.yPercent,r=i.x,s=i.y,c=i.z,l=i.rotation,d=i.rotationY,h=i.rotationX,m=i.skewX,p=i.skewY,g=i.scaleX,u=i.scaleY,f=i.transformPerspective,y=i.force3D,_=i.target,v=i.zOrigin,b="",w=y==="auto"&&e&&e!==1||y===!0;if(v&&(h!==ne||d!==ne)){var C=parseFloat(d)*Se,S=Math.sin(C),k=Math.cos(C),T;C=parseFloat(h)*Se,T=Math.cos(C),r=Nn(_,r,S*T*-v),s=Nn(_,s,-Math.sin(C)*-v),c=Nn(_,c,k*T*-v+v)}f!==ti&&(b+="perspective("+f+ae),(n||a)&&(b+="translate("+n+"%, "+a+"%) "),(w||r!==ti||s!==ti||c!==ti)&&(b+=c!==ti||w?"translate3d("+r+", "+s+", "+c+") ":"translate("+r+", "+s+ae),l!==ne&&(b+="rotate("+l+ae),d!==ne&&(b+="rotateY("+d+ae),h!==ne&&(b+="rotateX("+h+ae),(m!==ne||p!==ne)&&(b+="skew("+m+", "+p+ae),(g!==1||u!==1)&&(b+="scale("+g+", "+u+ae),_.style[q]=b||"translate(0, 0)"},dl=function(e,t){var i=t||this,n=i.xPercent,a=i.yPercent,r=i.x,s=i.y,c=i.rotation,l=i.skewX,d=i.skewY,h=i.scaleX,m=i.scaleY,p=i.target,g=i.xOrigin,u=i.yOrigin,f=i.xOffset,y=i.yOffset,_=i.forceCSS,v=parseFloat(r),b=parseFloat(s),w,C,S,k,T;c=parseFloat(c),l=parseFloat(l),d=parseFloat(d),d&&(d=parseFloat(d),l+=d,c+=d),c||l?(c*=Se,l*=Se,w=Math.cos(c)*h,C=Math.sin(c)*h,S=Math.sin(c-l)*-m,k=Math.cos(c-l)*m,l&&(d*=Se,T=Math.tan(l-d),T=Math.sqrt(1+T*T),S*=T,k*=T,d&&(T=Math.tan(d),T=Math.sqrt(1+T*T),w*=T,C*=T)),w=U(w),C=U(C),S=U(S),k=U(k)):(w=h,k=m,C=S=0),(v&&!~(r+"").indexOf("px")||b&&!~(s+"").indexOf("px"))&&(v=Yt(p,"x",r,"px"),b=Yt(p,"y",s,"px")),(g||u||f||y)&&(v=U(v+g-(g*w+u*S)+f),b=U(b+u-(g*C+u*k)+y)),(n||a)&&(T=p.getBBox(),v=U(v+n/100*T.width),b=U(b+a/100*T.height)),T="matrix("+w+","+C+","+S+","+k+","+v+","+b+")",p.setAttribute("transform",T),_&&(p.style[q]=T)},hl=function(e,t,i,n,a){var r=360,s=Q(a),c=parseFloat(a)*(s&&~a.indexOf("rad")?re:1),l=c-n,d=n+l+"deg",h,m;return s&&(h=a.split("_")[1],h==="short"&&(l%=r,l!==l%(r/2)&&(l+=l<0?r:-r)),h==="cw"&&l<0?l=(l+r*lr)%r-~~(l/r)*r:h==="ccw"&&l>0&&(l=(l-r*lr)%r-~~(l/r)*r)),e._pt=m=new ot(e._pt,t,i,n,l,Us),m.e=d,m.u="deg",e._props.push(i),m},fr=function(e,t){for(var i in t)e[i]=t[i];return e},ul=function(e,t,i){var n=fr({},i._gsap),a="perspective,force3D,transformOrigin,svgOrigin",r=i.style,s,c,l,d,h,m,p,g;n.svg?(l=i.getAttribute("transform"),i.setAttribute("transform",""),r[q]=t,s=ii(i,1),Vt(i,q),i.setAttribute("transform",l)):(l=getComputedStyle(i)[q],r[q]=t,s=ii(i,1),r[q]=l);for(c in Dt)l=n[c],d=s[c],l!==d&&a.indexOf(c)<0&&(p=et(l),g=et(d),h=p!==g?Yt(i,c,l,g):parseFloat(l),m=parseFloat(d),e._pt=new ot(e._pt,s,c,h,m-h,$n),e._pt.u=g||0,e._props.push(c));fr(s,n)};rt("padding,margin,Width,Radius",function(o,e){var t="Top",i="Right",n="Bottom",a="Left",r=(e<3?[t,i,n,a]:[t+a,t+i,n+i,n+a]).map(function(s){return e<2?o+s:"border"+s+o});Mi[e>1?"border"+o:o]=function(s,c,l,d,h){var m,p;if(arguments.length<4)return m=r.map(function(g){return Ot(s,g,l)}),p=m.join(" "),p.split(m[0]).length===5?m[0]:p;m=(d+"").split(" "),p={},r.forEach(function(g,u){return p[g]=m[u]=m[u]||m[(u-1)/2|0]}),s.init(c,p,h)}});var Kn={name:"css",register:Gn,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,n,a){var r=this._props,s=e.style,c=i.vars.startAt,l,d,h,m,p,g,u,f,y,_,v,b,w,C,S,k,T;qn||Gn(),this.styles=this.styles||_r(e),k=this.styles.props,this.tween=i;for(u in t)if(u!=="autoRound"&&(d=t[u],!(lt[u]&&On(u,t,i,n,e,a)))){if(p=typeof d,g=Mi[u],p==="function"&&(d=d.call(i,n,e,a),p=typeof d),p==="string"&&~d.indexOf("random(")&&(d=be(d)),g)g(this,e,u,d,i)&&(S=1);else if(u.substr(0,2)==="--")l=(getComputedStyle(e).getPropertyValue(u)+"").trim(),d+="",Lt.lastIndex=0,Lt.test(l)||(f=et(l),y=et(d),y?f!==y&&(l=Yt(e,u,l,y)+y):f&&(d+=f)),this.add(s,"setProperty",l,d,n,a,0,0,u),r.push(u),k.push(u,0,s[u]);else if(p!=="undefined"){if(c&&u in c?(l=typeof c[u]=="function"?c[u].call(i,n,e,a):c[u],Q(l)&&~l.indexOf("random(")&&(l=be(l)),et(l+"")||l==="auto"||(l+=ht.units[u]||et(Ot(e,u))||""),(l+"").charAt(1)==="="&&(l=Ot(e,u))):l=Ot(e,u),m=parseFloat(l),_=p==="string"&&d.charAt(1)==="="&&d.substr(0,2),_&&(d=d.substr(2)),h=parseFloat(d),u in Mt&&(u==="autoAlpha"&&(m===1&&Ot(e,"visibility")==="hidden"&&h&&(m=0),k.push("visibility",0,s.visibility),qt(this,s,"visibility",m?"inherit":"hidden",h?"inherit":"hidden",!h)),u!=="scale"&&u!=="transform"&&(u=Mt[u],~u.indexOf(",")&&(u=u.split(",")[0]))),v=u in Dt,v){if(this.styles.save(u),T=d,p==="string"&&d.substring(0,6)==="var(--"){if(d=yt(e,d.substring(4,d.indexOf(")"))),d.substring(0,5)==="calc("){var x=e.style.perspective;e.style.perspective=d,d=yt(e,"perspective"),x?e.style.perspective=x:Vt(e,"perspective")}h=parseFloat(d)}if(b||(w=e._gsap,w.renderTransform&&!t.parseTransform||ii(e,t.parseTransform),C=t.smoothOrigin!==!1&&w.smooth,b=this._pt=new ot(this._pt,s,q,0,1,w.renderTransform,w,0,-1),b.dep=1),u==="scale")this._pt=new ot(this._pt,w,"scaleY",w.scaleY,(_?ee(w.scaleY,_+h):h)-w.scaleY||0,$n),this._pt.u=0,r.push("scaleY",u),u+="X";else if(u==="transformOrigin"){k.push(ut,0,s[ut]),d=sl(d),w.svg?Bn(e,d,0,C,0,this):(y=parseFloat(d.split(" ")[2])||0,y!==w.zOrigin&&qt(this,w,"zOrigin",w.zOrigin,y),qt(this,s,u,Pi(l),Pi(d)));continue}else if(u==="svgOrigin"){Bn(e,d,1,C,0,this);continue}else if(u in Sr){hl(this,w,u,m,_?ee(m,_+d):d);continue}else if(u==="smoothOrigin"){qt(this,w,"smooth",w.smooth,d);continue}else if(u==="force3D"){w[u]=d;continue}else if(u==="transform"){ul(this,d,e);continue}}else u in s||(u=Te(u)||u);if(v||(h||h===0)&&(m||m===0)&&!Ys.test(d)&&u in s)f=(l+"").substr((m+"").length),h||(h=0),y=et(d)||(u in ht.units?ht.units[u]:f),f!==y&&(m=Yt(e,u,l,y)),this._pt=new ot(this._pt,v?w:s,u,m,(_?ee(m,_+h):h)-m,!v&&(y==="px"||u==="zIndex")&&t.autoRound!==!1?Xs:$n),this._pt.u=y||0,v&&T!==d?(this._pt.b=l,this._pt.e=T,this._pt.r=js):f!==y&&y!=="%"&&(this._pt.b=l,this._pt.r=Ks);else if(u in s)ol.call(this,e,u,l,_?_+d:d);else if(u in e)this.add(e,u,l||e[u],_?_+d:d,n,a);else if(u!=="parseTransform"){Ti(u,d);continue}v||(u in s?k.push(u,0,s[u]):typeof e[u]=="function"?k.push(u,2,e[u]()):k.push(u,1,l||e[u])),r.push(u)}}S&&zn(this)},render:function(e,t){if(t.tween._time||!Vn())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Ot,aliases:Mt,getSetter:function(e,t,i){var n=Mt[t];return n&&n.indexOf(",")<0&&(t=n),t in Dt&&t!==ut&&(e._gsap.x||Ot(e,"x"))?i&&sr===i?t==="scale"?tl:Js:(sr=i||{})&&(t==="scale"?el:il):e.style&&!Si(e.style[t])?Zs:~t.indexOf("-")?Qs:Ei(e,t)},core:{_removeProperty:Vt,_getMatrix:Un}};at.utils.checkPrefix=Te;at.core.getStyleSaver=_r;(function(o,e,t,i){var n=rt(o+","+e+","+t,function(a){Dt[a]=1});rt(e,function(a){ht.units[a]="deg",Sr[a]=1}),Mt[n[13]]=o+","+e,rt(i,function(a){var r=a.split(":");Mt[r[1]]=n[r[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");rt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(o){ht.units[o]="px"});at.registerPlugin(Kn);var jn=at.registerPlugin(Kn)||at,Hc=jn.core.Tween;var kr={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},mt={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},Xn={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},Zn={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"};var Ar={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},Ce={humidity:"65%",windSpeed:"10 km/h",pressure:"1013 hPa",indoorTemperature:"22\xB0",indoorHumidity:"45%"},Er="1.2.0",Mr={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function ml(o){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(o)}function Pr(o,e=-1/0,t=1/0){return typeof o=="number"&&!isNaN(o)&&o>=e&&o<=t}function ai(o){return typeof o!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(o)||/^rgba?\(\s*[\d.,%\s/]+\)$/.test(o)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(o.toLowerCase())}function P(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ke(o,e){return Object.prototype.hasOwnProperty.call(o,e)?o[e]:void 0}function se(o,e,t=0){if(!isFinite(o))return"--";let i=e?.locale?.language||e?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(i,{minimumFractionDigits:t,maximumFractionDigits:t}).format(o)}catch{return o.toFixed(t)}}function Li(o,e,t){if(o?.localize)try{let i=o.localize(e);if(i&&i!==e)return i}catch{}return t}function Lr(o,e){if(!isFinite(o))return 0;switch((e||"km/h").toLowerCase()){case"m/s":return o*3.6;case"mph":return o*1.609344;case"ft/s":return o*1.09728;case"kn":case"kt":case"knots":return o*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,o),1.5)*3.6;default:return o}}function A(o,e,...t){o&&console.log(`[AWC Dev] ${e}`,...t)}function J(o,e){let t=o.engine_settings||{},i=(r,s,c,l)=>Pr(r,c,l)?r:s,n=i(t.windSpeed,mt.windSpeed,.1,15),a=n;return Pr(e,0,200)&&(a=Math.max(.1,Math.min(15,e/10*n))),{windSpeed:a,rainCount:i(t.rainCount,mt.rainCount,.1,10),leafCount:i(t.leafCount,mt.leafCount,.1,10),snowCount:i(t.snowCount,mt.snowCount,.1,10),cloudBaseSize:i(t.cloudBaseSize,mt.cloudBaseSize,.3,2.5),cloudCount:i(t.cloudCount,mt.cloudCount,1,20),splashBounce:i(t.splashBounce,mt.splashBounce,40,120)}}function Qn(o){o.forEach(e=>{e!=null&&clearTimeout(e)}),o.length=0}function Fr(o){let e=new Set;return o.querySelectorAll("*").forEach(t=>{window.AnimatedWeatherCardGsap.getTweensOf(t).forEach(i=>{let n=i;for(;n.parent?.parent;)n=n.parent;e.add(n)})}),e}function Fi(o){window.AnimatedWeatherCardGsap&&Fr(o).forEach(e=>e.pause())}function Oi(o){window.AnimatedWeatherCardGsap&&Fr(o).forEach(e=>e.resume())}function Jn(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)})}function Ae(o,e,t,i,n){if(typeof o!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(e&&ml(o))return o;if(e)return console.warn(`Invalid dev mode condition: ${o}, using sunny`),"sunny";let a=o.toLowerCase();if(a.includes("sleet")&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"sleety-stormy";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"snowy-stormy";if(a.includes("lightning")||a.includes("thunder")||a.includes("storm"))return"stormy";if(a.includes("fog")||a.includes("mist"))return"foggy";if(a.includes("heavy")&&a.includes("rain"))return"pouring";if(a.includes("pouring")||a.includes("downpour"))return"pouring";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("rain")||a.includes("drizzle")))return"snowy-rainy";if(a.includes("light")&&(a.includes("rain")||a.includes("drizzle")))return"light-rain";if(a.includes("rain")||a.includes("drizzle"))return"rainy";if(a.includes("sleet")||a.includes("hail"))return"sleety";if(a.includes("snow"))return"snowy";if(a.includes("wind"))return"windy";if(a.includes("partly")&&a.includes("cloud"))return"partly-cloudy";if(a.includes("cloud")||a.includes("overcast"))return"cloudy";if(a.includes("clear")||a.includes("sunny")){let r=new Date,s;if(n)try{let h=new Intl.DateTimeFormat("en-US",{timeZone:n,hour:"numeric",hour12:!1}).formatToParts(r);s=parseInt(h.find(m=>m.type==="hour")?.value||"0",10)}catch{s=r.getHours()}else s=r.getHours();let c=t??6,l=i??20;return(s<c||s>=l)&&a.includes("clear")?"clear-night":"sunny"}return"sunny"}function ri(o,e,t){if(typeof o!="string"||!o.trim())return console.warn("Invalid animation type provided"),t||ni("rain");if(!e||!e.isEnabled())return t||ni(o);let i=Mr[o];if(!i)return console.warn(`No color scheme found for animation type: ${o}`),t||ni(o);try{let n=e.getCurrentState(),a=e.getTimeAwareColor(i);return ai(a)?a:(console.warn(`Invalid color returned from time manager: ${a}`),t||ni(o))}catch(n){return console.error("Error getting time-aware color:",n),t||ni(o)}}function ni(o){let t={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[o];return t||(console.warn(`Unknown animation type: ${o}, using white as fallback`),"#FFFFFF")}var Di=class Di{constructor(e,t,i){this.animationHandles=[];this.timeouts=[];this.particles=[];this.element=e,this.config=t,this.cardConfig=i,this.state="created",queueMicrotask(()=>A(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){A(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),A(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(e){throw console.error(`Failed to start ${this.animationType} animation:`,e),this.setState("stopped"),e}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),A(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(e){throw console.error(`Failed to stop ${this.animationType} animation:`,e),e}}async pause(){if(this.state==="active")try{A(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(e){throw console.error(`Failed to pause ${this.animationType} animation:`,e),e}}async resume(){if(this.state==="paused")try{A(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(e){throw console.error(`Failed to resume ${this.animationType} animation:`,e),this.setState("paused"),e}}setWindSpeed(e){this.realWindSpeed=e,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),A(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}setState(e){let t=this.state;this.state=e,A(this.config.devMode,`${this.animationType} state: ${t} \u2192 ${e}`)}ensureLayerVisibility(e){if(this.containerSelector){let i=this.element.querySelector(this.containerSelector);i&&(i.style.display=e?"block":"none",A(this.config.devMode,`Set ${this.animationType} container visibility: ${e}`))}let t=this.element.querySelector(this.layerSelector);t&&!Di.SHARED_LAYERS.includes(this.layerSelector)&&(t.style.opacity=e?"1":"0",A(this.config.devMode,`Set ${this.animationType} layer opacity: ${e?1:0}`))}cleanup(){this.animationHandles.forEach(e=>{e&&clearInterval(e)}),this.animationHandles=[],this.timeouts.forEach(e=>{if(e)if(typeof e=="function"){let t=e();t&&clearTimeout(t)}else clearTimeout(e)}),this.timeouts=[],window.AnimatedWeatherCardGsap&&this.particles.forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)}),this.particles.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.particles=[],A(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(e){this.animationHandles.push(e)}addTimeout(e){this.timeouts.push(e)}addParticle(e){this.particles.push(e)}removeParticle(e){let t=this.particles.indexOf(e);t>-1&&this.particles.splice(t,1)}};Di.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var X=Di;var Ut=class{constructor(e,t,i){this.layer=e;this.create=t;this.cycle=i;this.items=[];this.running=!1;this.paused=!1}start(e){this.running=!0;let t=[];for(let i=0;i<e;i++){let n=this.create(i);this.layer.appendChild(n);let a={el:n};this.items.push(a),t.push(n),this.run(a,!0)}return t}run(e,t){this.running&&(e.anim=this.cycle(e.el,()=>this.run(e,!1),t),this.paused&&e.anim.pause())}pause(){this.paused=!0,this.items.forEach(e=>e.anim?.pause())}resume(){this.paused=!1,this.items.forEach(e=>e.anim?.resume())}stop(){this.running=!1,this.items.forEach(e=>{e.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(e.el),e.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(e=>e.el)}};function Ee(o,e){return e&&o.progress(Math.random()),o}var pl=420*230;function Me(o,e){return Math.min(3,Math.max(.6,o*e/pl))||1}function O(o,e){return o+Math.random()*(e-o)}var fl={light:10,rain:18,storm:24,pouring:32},gl={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},wl={light:16,rain:24,storm:34,pouring:42},yl=.3,_l=16,bl=8,vl=[10,30],Or="http://www.w3.org/2000/svg";function xl(o,e,t,i){let n=0,a=0,r=0;for(let s=1;s<=16;s++){let c=s/16,l=2*(1-c)*c*o+c*c*t,d=2*(1-c)*c*e+c*c*i;n+=Math.hypot(l-a,d-r),a=l,r=d}return n}function Sl(o,e,t,i){return Math.max(4,Math.round(fl[o]*e*Me(t,i)))}var Wi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=a,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...i},A(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start rain animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Rain layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=this.rainKind(),r=Sl(a,i.rainCount,n.offsetWidth,n.offsetHeight),s=this.getRainColor(this.element.timeOfDayManager),c=this.cardConfig.spill_particles!==!1,l=wl[a],d=a==="pouring"?3:2.4;this.splashLayer=t,this.splashColor=s,this.splashBounce=i.splashBounce/mt.splashBounce,this.pool=new Ut(t,()=>{let h=O(1,d),m=document.createElement("div");return m.className="raindrop",m.style.cssText=`
                    width: ${h.toFixed(2)}px;
                    height: ${l}px;
                    background: linear-gradient(0deg, ${s}, transparent);
                    border-radius: ${h.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,m.dataset.width=h.toFixed(2),m},(h,m,p)=>this.fall(h,n,a,l,c,m,p)),this.pool.start(r).forEach(h=>this.addParticle(h)),A(this.config.devMode,`Rain animation started - ${r} drops (${a})`)}fall(t,i,n,a,r,s,c){let l=i.offsetWidth,d=i.offsetHeight,[h,m]=gl[n],p=O(h,m),g=O(6,Math.max(7,l-6)),u=this.rainConfig.splashEnabled&&Math.random()<yl,f=-a,y=u?d-a:r?d+O(60,120):d,_=Math.max(.25,(y-f)/p),v=parseFloat(t.dataset.width||"2");window.AnimatedWeatherCardGsap.set(t,{x:g,scaleY:1,opacity:.55+.45*Math.min(1,v/2.4)});let b=window.AnimatedWeatherCardGsap.timeline({onComplete:s});if(b.fromTo(t,{y:f},{y,duration:_,ease:"none"}),u)b.call(()=>this.createSplash(g+v/2,d),[],_),b.to(t,{scaleY:0,duration:a/p,ease:"none"},_);else if(r){let w=(d-a-f)/p;b.to(t,{opacity:0,duration:_-w,ease:"power1.in"},w)}return Ee(b,c)}async onStop(){this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()}),this.splashDots=[],this.rebounds.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf([t,t.firstChild]),t.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(t=>t.remove()),A(this.config.devMode,"Rain animation stopped")}async onPause(){this.pool?.pause(),A(this.config.devMode,"Rain animation paused")}async onResume(){this.pool?.resume(),A(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(t,i){if(!(!window.AnimatedWeatherCardGsap||!this.splashLayer)){this.createRebound(t,i);for(let n of[-1,1]){let a=this.splashDots[this.nextSplashDot];a||(a=document.createElement("div"),a.className="rain-splash",a.style.background=this.splashColor,this.splashLayer.appendChild(a),this.splashDots[this.nextSplashDot]=a),this.nextSplashDot=(this.nextSplashDot+1)%_l;let r=O(.22,.28),s=O(4,10)*this.splashBounce,c=n*O(6,12)*this.splashBounce;window.AnimatedWeatherCardGsap.killTweensOf(a),window.AnimatedWeatherCardGsap.set(a,{x:t-1,y:i-2,opacity:.9}),window.AnimatedWeatherCardGsap.timeline().to(a,{x:t-1+c,duration:r,ease:"power1.out"},0).to(a,{y:i-2-s,duration:r*.45,ease:"power2.out"},0).to(a,{y:i-2,duration:r*.55,ease:"power2.in"},r*.45).to(a,{opacity:0,duration:r*.4,ease:"power1.in"},r*.6)}}}createRebound(t,i){let n=this.splashLayer,a=this.rebounds[this.nextRebound];if(!a){a=document.createElementNS(Or,"svg"),a.classList.add("rain-rebound");let u=document.createElementNS(Or,"path");u.setAttribute("fill","none"),u.style.stroke=this.splashColor,a.appendChild(u),n.appendChild(a),this.rebounds[this.nextRebound]=a}this.nextRebound=(this.nextRebound+1)%bl;let r=a.firstChild,[s,c]=vl,l=O(s,c)*this.splashBounce,d=(Math.random()<.5?-1:1)*O(10,24)*this.splashBounce,h=O(6,18);r.setAttribute("d",`M 0,0 Q ${d.toFixed(1)},${(-2*l).toFixed(1)} ${(2*d).toFixed(1)},${h.toFixed(1)}`);let m=xl(d,-2*l,2*d,h),p=Math.min(m*.45,6+l*.3);r.style.strokeDasharray=`${p.toFixed(1)} ${(m+p).toFixed(1)}`;let g=O(.42,.56);window.AnimatedWeatherCardGsap.killTweensOf([a,r]),window.AnimatedWeatherCardGsap.set(a,{x:t,y:i,opacity:.85}),window.AnimatedWeatherCardGsap.timeline().fromTo(r,{strokeDashoffset:p,strokeWidth:1.6},{strokeDashoffset:-m,strokeWidth:.6,duration:g,ease:"power2.out"},0).to(a,{opacity:0,duration:g*.35,ease:"power1.in"},g*.65)}getRainColor(t){return this.rainConfig.isStorm?ri("lightning",t,"var(--weather-storm-rain-color)"):ri("rain",t,"var(--weather-rain-color)")}};var Tl=36,Kt=[2,6],ta=[20,38],Dr=10,Cl=.6;function kl(o,e,t){return Math.max(6,Math.round(Tl*o*Me(e,t)))}function ia(o){return Math.min(2.2,Math.max(.3,o/mt.windSpeed))}var Hi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.swings=[];this.realWindSpeed=a,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...i},A(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start snow animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Snow layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=kl(i.snowCount,n.offsetWidth,n.offsetHeight),r="#ffffff",s=this.cardConfig.spill_particles!==!1,c=ia(i.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation(),this.pool=new Ut(t,()=>this.createFlake(r),(l,d,h)=>this.fall(l,n,c,s,d,h)),this.pool.start(a).forEach(l=>this.addParticle(l)),A(this.config.devMode,`Snow animation started - ${a} flakes`)}createFlake(t){let i=O(Kt[0],Kt[1]),n=(i-Kt[0])/(Kt[1]-Kt[0]),a=document.createElement("div");a.className="snowflake",a.dataset.size=i.toFixed(2),a.style.cssText=`
            width: ${i.toFixed(2)}px;
            height: ${i.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${t}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,a.dataset.opacity=(.45+.45*n).toFixed(2),window.AnimatedWeatherCardGsap.set(a,{transformOrigin:"50% -500%",rotation:-Dr});let r=window.AnimatedWeatherCardGsap.to(a,{rotation:Dr,duration:O(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return r.progress(Math.random()),this.swings.push(r),a}fall(t,i,n,a,r,s){let c=i.offsetWidth,l=i.offsetHeight,d=parseFloat(t.dataset.size||"4"),h=(d-Kt[0])/(Kt[1]-Kt[0]),m=(ta[0]+(ta[1]-ta[0])*h)*O(.9,1.1),p=this.snowConfig.accumulation&&Math.random()<Cl,g=-d*2,u=p?l-this.pileHeight()-d:a?l+O(60,120):l+d,f=u-g,y=Math.max(.5,f/m),_=f*O(.04,.13)*n,v=O(-_,Math.max(1,c-d));window.AnimatedWeatherCardGsap.set(t,{x:v,opacity:parseFloat(t.dataset.opacity||"0.7")});let b=window.AnimatedWeatherCardGsap.timeline({onComplete:r});if(b.fromTo(t,{y:g},{y:u,x:v+_,duration:y,ease:"none"}),p)b.call(()=>this.addToAccumulation(),[],y),b.to(t,{opacity:0,duration:.6,ease:"power1.out"},y);else if(a){let w=Math.min(y,(l-g)/m);b.to(t,{opacity:0,duration:Math.max(.1,y-w),ease:"power1.in"},w)}return Ee(b,s)}async onStop(){this.swings.forEach(t=>t.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),A(this.config.devMode,"Snow animation stopped")}async onPause(){this.pool?.pause(),this.swings.forEach(t=>t.pause()),A(this.config.devMode,"Snow animation paused")}async onResume(){this.pool?.resume(),this.swings.forEach(t=>t.resume()),A(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let t=this.element.querySelector(".animated-weather-card");if(!t)return;t.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(n=>n.remove());let i=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${i}px;
            background: linear-gradient(to top, #ffffff, transparent);
            transform-origin: 50% 100%;
            transform: scaleY(0);
            pointer-events: none;
            z-index: 5;
        `,t.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let t=this.accumulationElement,i=this.snowConfig.accumulationHeight;if(!t?.parentNode||i<=0)return;let n=this.pileHeight();if(n>=i)return;let a=Math.min(i,n+.8);t.setAttribute("data-target-height",String(a)),window.AnimatedWeatherCardGsap.to(t,{scaleY:a/i,opacity:Math.min(.9,a/i),duration:.3,ease:"power2.out"})}};var Al=30,Wr=[150,230],El=.3,Ri=6,zi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.realWindSpeed=a,this.sleetConfig={particleCount:40,...i},A(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start sleet animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=Math.max(6,Math.round(Al*i.snowCount*Me(n.offsetWidth,n.offsetHeight))),r=this.cardConfig.spill_particles!==!1,s=ia(i.windSpeed)*.5;this.pool=new Ut(t,()=>{let c=O(1.5,3.5),l=document.createElement("div");return l.className="sleet-particle-gsap",l.dataset.size=c.toFixed(2),l.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${c.toFixed(2)}px;
                    height: ${c.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,l},(c,l,d)=>this.fall(c,n,s,r,l,d)),this.pool.start(a).forEach(c=>this.addParticle(c)),A(this.config.devMode,`Sleet animation started - ${a} pellets`)}fall(t,i,n,a,r,s){let c=i.offsetWidth,l=i.offsetHeight,d=parseFloat(t.dataset.size||"2"),h=O(Wr[0],Wr[1]),m=Math.random()<El,p=-d*2,g=m?l-d:a?l+O(60,120):l+d,u=g-p,f=Math.max(.3,u/h),y=u*O(.03,.08)*n,_=O(-y,Math.max(1,c-d));window.AnimatedWeatherCardGsap.set(t,{x:_,opacity:O(.8,1),rotation:O(0,360)});let v=window.AnimatedWeatherCardGsap.timeline({onComplete:r});if(v.fromTo(t,{y:p},{y:g,x:_+y,duration:f,ease:"none"}),m)v.call(()=>this.addToPile(i),[],f),v.to(t,{opacity:0,duration:.3,ease:"power1.out"},f);else if(a){let b=Math.min(f,(l-p)/h);v.to(t,{opacity:0,duration:Math.max(.1,f-b),ease:"power1.in"},b)}return Ee(v,s)}addToPile(t){if(this.state!=="active")return;let i=t.querySelector(".sleet-accumulation");i||(i=document.createElement("div"),i.className="sleet-accumulation",i.style.cssText=`
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${Ri}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `,t.appendChild(i));let n=parseFloat(i.getAttribute("data-target-height")||"0");if(n>=Ri)return;let a=Math.min(Ri,n+.4);i.setAttribute("data-target-height",String(a)),window.AnimatedWeatherCardGsap.to(i,{scaleY:a/Ri,duration:.3,ease:"power2.out"})}async onStop(){this.pool?.stop(),this.pool=void 0;let t=this.element.querySelector(".animated-weather-card");t&&t.querySelectorAll(".sleet-accumulation").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),A(this.config.devMode,"Sleet animation stopped")}async onPause(){this.pool?.pause(),A(this.config.devMode,"Sleet animation paused")}async onResume(){this.pool?.resume(),A(this.config.devMode,"Sleet animation resumed")}};var na=[90,160];function Rr(o,e,t,i,n,a=!0){let r=document.createElement("div");r.className="leaf-gsap";let s=i.offsetWidth,c=i.offsetHeight,l=20+Math.random()*Math.max(40,c-40),d=Math.random(),h=d<.25,m=d>.8&&l>100;r.style.position="absolute",r.style.borderRadius="0 100% 0 100%",r.style.transformOrigin="center",r.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let p=(Math.random()*8+6)*t;r.style.width=r.style.height=p+"px";let g=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];r.style.background=g[Math.floor(Math.random()*g.length)];let u=-p-10,f=s+(a?60+Math.random()*80:p+10),y=(na[0]+Math.random()*(na[1]-na[0]))*Pe(e.windSpeed)*(h?.6:1),_=(f-u)/y,v=Math.min(_,(s-u)/y),b=m?-(60+Math.random()*80):h?80+Math.random()*80:(Math.random()-.5)*80;window.AnimatedWeatherCardGsap.set(r,{x:u,y:l,rotation:Math.random()*360,opacity:0}),o.appendChild(r);let w=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),n&&n(r)}});return w.to(r,{opacity:.85,duration:.25,ease:"power1.out"},0).to(r,{x:f,duration:_,ease:"none"},0).to(r,{y:l+b,duration:_,ease:h?"sine.in":"sine.inOut"},0).to(r,{rotation:`+=${120+Math.random()*180}`,duration:_,ease:"none"},0),a&&_>v&&w.to(r,{opacity:0,duration:_-v,ease:"power1.in"},v),r}function zr(o,e,t,i,n,a){let r=document.createElement("div");r.className="wind-swoosh-gsap";let s=Math.random(),c=s>.6,l=s>.8;r.style.position="absolute",r.style.height=(l?2:1)*t+"px",r.style.borderRadius=c?"2px 1px":"1px",r.style.transformOrigin="left center",r.style.zIndex="10";let d=n.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";r.style.background=`linear-gradient(90deg, transparent 0%, ${d} 50%, transparent 100%)`;let h=Math.max(15,(20+Math.random()*60)*t);r.style.width=h+"px";let m=i.offsetWidth,p=i.offsetHeight,g=p*.15+Math.random()*(p*.7);window.AnimatedWeatherCardGsap.set(r,{x:-h,y:g,rotation:c?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),o.appendChild(r);let f=(m+h*2)/(Ml*Pe(e.windSpeed));return window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),a&&a(r)}}).to(r,{scaleX:1,opacity:l?.35:.22,duration:.3,ease:"power2.out"},0).to(r,{x:m+h,rotation:c?g>p/2?5:-5:0,duration:f,ease:"none"},0).to(r,{opacity:0,scaleX:.3,duration:Math.min(.5,f*.3)},f-Math.min(.5,f*.3)),r}var Ml=230,Pl=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function Pe(o){return Math.min(2.2,Math.max(.6,Math.sqrt(o/mt.windSpeed)))}var Ll=12;function Fl(o){let e=Math.round(70*o),t=Math.round(35*o);return{width:e,height:Math.round(26*o),puffs:[{x:Math.round(9*o),y:Math.round(-22*o),size:Math.round(44*o)},{x:e-Math.round(9*o)-t,y:Math.round(-13*o),size:t}]}}var Nr=o=>o>0?Math.ceil(o*3)+1:0,Hr=new Map;function Ol(o,e,t,i){let n=[o,e,t,i].join(","),a=Hr.get(n);if(a)return a;let r=Nr(t),s=Math.ceil((o+2*r)*i),c=Math.ceil((e+2*r)*i),l=()=>{let p=document.createElement("canvas");return p.width=s,p.height=c,[p,p.getContext("2d")]},d=null,[h,m]=l();if(m){let[p,g,u]=[r*i,r*i,Math.min(50,o/2,e/2)*i],[f,y]=[p+o*i,g+e*i];if(m.fillStyle="#000",m.beginPath(),m.moveTo(p+u,g),m.arcTo(f,g,f,y,u),m.arcTo(f,y,p,y,u),m.arcTo(p,y,p,g,u),m.arcTo(p,g,f,g,u),m.closePath(),m.fill(),t>0){let[_,v]=l();v&&(v.shadowColor="#000",v.shadowBlur=2*t*i,v.shadowOffsetX=s,v.drawImage(h,-s,0),d=_.toDataURL())}else d=h.toDataURL()}return d&&Hr.set(n,d),d}function oi(o){o.querySelectorAll(".cloud-track, .cloud-gsap").forEach(e=>{window.AnimatedWeatherCardGsap?.killTweensOf(e),e.remove()})}function Dl(o){return Math.min(1,Math.max(.5,o/160))||1}function $r(o,e,t,i,n){let a=i.offsetWidth,r=i.offsetHeight,s=Pl,c=Pe(e.windSpeed),l=[],d=t||e.cloudCount,h=Dl(r);return s.forEach((m,p)=>{let g=Math.ceil(p===0||p===1?d*.4:d*.6);for(let u=1;u<=g;u++){let f=document.createElement("div");f.className=`cloud-gsap cloud-gsap-${m.name}-${u}`;let y=e.cloudBaseSize*m.scale,_=1+(u-1)*.15,v=Math.max(.3,Math.min(2.5,y))*_*h,b=Fl(v);f.style.position="absolute",f.style.opacity=m.opacity.toString(),f.style.zIndex=(10+p).toString();let w=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][p],C=n?.color_palette==="theme"?0:m.blur,S=[{x:0,y:0,width:b.width,height:b.height},...b.puffs.map($=>({x:$.x,y:$.y,width:$.size,height:$.size}))],k=Math.min(3,Math.max(1,window.devicePixelRatio||1)),T=S.map($=>Ol($.width,$.height,C,k)),x=T.every(Boolean),E=x?Nr(C):0;if(f.style.width=b.width+"px",f.style.height=b.height+"px",x)f.classList.add("cloud-masked"),S.forEach(($,Z)=>{let j=document.createElement("div");j.style.position="absolute",j.style.left=$.x-E+"px",j.style.top=$.y-E+"px",j.style.width=$.width+2*E+"px",j.style.height=$.height+2*E+"px",j.style.background=w;for(let st of["-webkit-",""])j.style.setProperty(`${st}mask-image`,`url("${T[Z]}")`),j.style.setProperty(`${st}mask-size`,"100% 100%"),j.style.setProperty(`${st}mask-repeat`,"no-repeat");f.appendChild(j)});else{f.style.borderRadius="50px",f.style.background=w,C>0&&(f.style.filter=`blur(${C}px)`);for(let $ of b.puffs){let Z=document.createElement("div");Z.style.position="absolute",Z.style.left=$.x+"px",Z.style.top=$.y+"px",Z.style.width=$.size+"px",Z.style.height=$.size+"px",Z.style.borderRadius="50px",Z.style.background=w,f.appendChild(Z)}}let M=b.width+2*E,D=[[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][p][u-1]||15+p*10,H=Math.max(150+p*50,M+Ll),W=m.speed*c*(.9+Math.random()*.2),R=(a+2*H)/W,V=document.createElement("div");V.className="cloud-track",V.appendChild(f),window.AnimatedWeatherCardGsap.set(f,{opacity:m.opacity}),window.AnimatedWeatherCardGsap.set(V,{xPercent:0,x:-H,y:r*D/100}),o.appendChild(V);let _t=window.AnimatedWeatherCardGsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5});_t.fromTo(V,{xPercent:0,x:-H},{xPercent:100,x:H,duration:R,ease:"none"}),_t.progress(Math.random()),l.push(_t)}}),l}function Ir(o){let e=o.querySelector(".snow-accumulation");e&&(window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(e,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{e.parentNode&&e.parentNode.removeChild(e)}}):e.parentNode?.removeChild(e))}function Gr(o,e,t,i,n){let a=document.createElement("div");a.className=`fog-layer fog-layer-${t}`;let r=i.offsetWidth,s=i.offsetHeight,c=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],l=c[t]||c[2],d=n.custom_colors?.fog_color,h=n.color_palette==="default"?ai(d)?d:"#e0e0e0":"var(--secondary-text-color)",m=3+Math.floor(Math.random()*3),p=r*l.scale;a.style.cssText=`
        position: absolute;
        top: ${20+t*15}%;
        left: -50%;
        width: ${p}px;
        height: ${l.height}px;
        opacity: ${l.opacity};
        filter: blur(${l.blur}px);
        pointer-events: none;
        z-index: ${5+t};
        overflow: visible;
    `;for(let C=0;C<m;C++){let S=document.createElement("div"),k=p/m*(2+Math.random()*1.2),T=l.height*(1.2+Math.random()*1.6),x=p/m*C-k*.3,E=(Math.random()-.5)*(l.height*.5);S.style.cssText=`
            position: absolute;
            left: ${x}px;
            top: ${E}px;
            width: ${k}px;
            height: ${T}px;
            background: radial-gradient(ellipse ${k/2}px ${T/2}px at center, 
                ${h} 0%, 
                ${h} 40%, 
                transparent 70%);
            border-radius: ${k/2}px ${T/2}px;
            opacity: ${.7+Math.random()*.6}; // Varied opacity per segment
        `,a.appendChild(S)}o.appendChild(a);let g=e.windSpeed*(.5+Math.random()*.5),u=15/l.speed,f=Math.max(8,u/g),y=r*l.scale,_=-y,v=r+y;window.AnimatedWeatherCardGsap.set(a,{x:_,opacity:l.opacity});let b=window.AnimatedWeatherCardGsap.timeline({repeat:-1,delay:t*2+Math.random()*3});b.to(a,{x:v,duration:f,ease:"none",onComplete:()=>{window.AnimatedWeatherCardGsap.set(a,{x:_})}});let w=window.AnimatedWeatherCardGsap.timeline({repeat:-1,yoyo:!0});return w.to(a,{opacity:l.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:b,opacity:w}}function Ni(o){o.querySelectorAll(".fog-layer").forEach(t=>{t.parentNode&&t.parentNode.removeChild(t)})}var Wl=3,Hl=2,Br=[900,1400],qr=[1800,2600],$i=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=a,this.windConfig={leafCount:3,swooshEnabled:!0,...i},A(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(O(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(O(300,900)),A(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(t){let i=J(this.cardConfig,this.realWindSpeed);this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let n=Math.max(1,Math.round(Wl*i.leafCount));if(this.leaves.size<n){let a=Rr(this.layer(),i,1,this.card(),r=>this.forget(r,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(a),this.addParticle(a)}this.scheduleLeaf(O(Br[0],Br[1])/Math.max(.5,i.leafCount))},t)}scheduleSwoosh(t){let i=J(this.cardConfig,this.realWindSpeed);this.swooshTimer=setTimeout(()=>{if(this.state==="active"){if(this.swooshes.size<Hl){let n=zr(this.layer(),i,1,this.card(),this.cardConfig,a=>this.forget(a,this.swooshes));this.swooshes.add(n),this.addParticle(n)}this.scheduleSwoosh(O(qr[0],qr[1]))}},t)}forget(t,i){i.delete(t),this.removeParticle(t)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),this.leaves.clear(),this.swooshes.clear(),A(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),Fi(this.layer()),A(this.config.devMode,"Wind animation paused")}async onResume(){Oi(this.layer()),this.clearTimers(),this.scheduleLeaf(O(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(O(600,1500)),A(this.config.devMode,"Wind animation resumed")}};var si=[6e3,18e3],Rl=[1500,6e3],Vr=.16,Ii=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=a,this.lightningConfig={disableShake:n.disable_lightning_shake||!1,minInterval:si[0],maxInterval:si[1],...i},A(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start lightning animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Lightning layer not found: ${this.layerSelector}`);t.style.opacity="0";let[i,n]=Rl;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},i+Math.random()*(n-i)),this.addTimeout(this.flashTimeout),A(this.config.devMode,"Lightning animation started")}flash(){if(!window.AnimatedWeatherCardGsap||this.state!=="active")return;let t=this.element.querySelector(this.layerSelector),i=this.element.querySelector(".animated-weather-card");if(!t||!i)return;let n=i.offsetWidth,a=i.offsetHeight,r=parseFloat(i.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let c=document.createElementNS("http://www.w3.org/2000/svg","path"),l=30+Math.random()*(n-60),d=20*r,h=20,m=[l+",0"];for(let f=0;f<h;f++){let y=l+(Math.random()*d-d/2),_=a/h*(f+1);m.push(y+","+_)}c.setAttribute("d","M"+m.join(" L"));let p=this.element.timeOfDayManager,g=ri("lightning",p,"white");c.setAttribute("stroke",g),c.setAttribute("stroke-width",((2+Math.random()*2)*r).toString()),c.setAttribute("fill","none"),s.appendChild(c),t.appendChild(s);let u=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=u,u.set(t,{opacity:.9},0).to(t,{opacity:.3,duration:.06,ease:"none"},0).to(t,{opacity:.8,duration:.04,ease:"none"},.06).to(t,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let f=-6*r;u.to(i,{y:f,duration:.06,ease:"power2.out"},Vr).to(i,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Vr+.06)}}scheduleNext(){if(this.state!=="active")return;let t=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},t),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let t=this.element.querySelector(".animated-weather-card");t&&window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.set(t,{clearProps:"transform"});let i=this.element.querySelector(this.layerSelector);i&&(i.querySelectorAll("svg").forEach(a=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(a.querySelector("path")),a.parentNode&&a.parentNode.removeChild(a)}),i.style.opacity="0"),A(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),A(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),A(this.config.devMode,"Lightning animation resumed")}};var zl=["dawn","day","dusk","night"],li=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],Nl={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},Kr=(o,e,t)=>Math.min(e,Math.max(o,t)),jt=(o,e,t)=>o+(e-o)*t;function $l(o,e,t){let i=(e-o+540)%360-180;return(o+i*t+360)%360}function Wt(o,e,t){let i=([u,f,y])=>[u,f*Math.cos(y*Math.PI/180),f*Math.sin(y*Math.PI/180)],[n,a,r]=i(o),[s,c,l]=i(e),d=jt(n,s,t),h=jt(a,c,t),m=jt(r,l,t),p=Math.hypot(h,m),g=p<1e-6?o[2]:(Math.atan2(m,h)*180/Math.PI+360)%360;return[d,p,g]}function aa([o,e,t]){let i=t*Math.PI/180,n=e*Math.cos(i),a=e*Math.sin(i),r=(o+.3963377774*n+.2158037573*a)**3,s=(o-.1055613458*n-.0638541728*a)**3,c=(o-.0894841775*n-1.291485548*a)**3;return[4.0767416621*r-3.3077115913*s+.2309699292*c,-1.2684380046*r+2.6097574011*s-.3413193965*c,-.0041960863*r-.7034186147*s+1.707614701*c]}var Il=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function Ct(o){let e=i=>i.every(n=>n>=-1e-4&&n<=1.0001),t=aa(o);if(!e(t)){let i=0,n=o[1];for(let a=0;a<24;a++){let r=(i+n)/2;e(aa([o[0],r,o[2]]))?i=r:n=r}t=aa([o[0],i,o[2]])}return t.map(i=>Il(Kr(0,1,i)))}var jr=o=>Math.round(Kr(0,1,o)*255);function Ht(o){return"#"+o.map(e=>jr(e).toString(16).padStart(2,"0")).join("")}function Yr(o,e){return`rgba(${o.map(jr).join(", ")}, ${Number(e.toFixed(3))})`}function ra(o,e){return[.15+(o[0]-.15)*.42,o[1]*jt(.75,.5,e),$l(o[2],262,.45)]}function Gl(o,e){let t=Nl[o],i=1-t.overcast*.7,n={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:jt(.46,.28,t.overcast)};if(o==="clear-night"){if(e==="dawn"||e==="dusk"){let a=e==="dawn"?[.4,.09,20]:[.38,.1,40];return{...n,bottom:Wt(t.bottom,a,.45),glowAlpha:.2,scrimAlpha:.22}}return{...n,scrimAlpha:.2}}switch(e){case"night":return{top:ra(t.top,t.overcast),mid:ra(t.mid,t.overcast),bottom:ra(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:jt(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:Wt(t.top,[t.top[0]*.8,.075,292],.5*i),mid:Wt(t.mid,[t.mid[0]*.88,.065,350],.42*i),bottom:Wt(t.bottom,[t.bottom[0]*.92,.115,52],.72*i),glow:Wt(t.glow,[.82,.13,58],i),glowAlpha:jt(t.glowAlpha,.6,i*.6),scrimAlpha:n.scrimAlpha+.04};case"dawn":return{top:Wt(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*i),mid:Wt(t.mid,[t.mid[0]*.95,.05,330],.3*i),bottom:Wt(t.bottom,[t.bottom[0]*.95,.085,32],.62*i),glow:Wt(t.glow,[.88,.09,40],i),glowAlpha:jt(t.glowAlpha,.5,i*.5),scrimAlpha:n.scrimAlpha+.04};default:return n}}function Bl(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function le(o,e){let t=Gl(o,e);return{top:Ht(Ct(t.top)),mid:Ht(Ct(t.mid)),bottom:Ht(Ct(t.bottom)),glow:Yr(Ct(t.glow),t.glowAlpha),scrim:Yr(Ct(Bl(t.top)),t.scrimAlpha)}}var Le=[.985,.006,250],Gi=.8,Xr=.55,Zr=.4,Bi={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},Qr={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},Jr={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64};function Fe(o,e){let t=i=>`${Math.round(i*100)}%`;return`radial-gradient(${t(o.rx)} ${t(o.ry)} at ${t(o.cx)} ${t(o.cy)}, ${e}, transparent ${t(o.fade)})`}function to(){let o=[];for(let e of li)for(let t of zl){let i=le(e,t),n=t==="day"?`.animated-weather-card.${e}`:`.animated-weather-card.${e}[data-phase="${t}"]`;o.push(`${n} { --awc-sky-top: ${i.top}; --awc-sky-mid: ${i.mid}; --awc-sky-bottom: ${i.bottom}; --awc-sky-glow: ${i.glow}; --awc-sky-scrim: ${i.scrim}; }`)}return o.join(`
`)}function Oe(o,e,t){return o==null||!Number.isFinite(o)?t?"day":"night":o<-6?"night":o<6?e?"dawn":"dusk":"day"}var Xt=3.2,De="cubic-bezier(0.37, 0, 0.63, 1)",eo={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},io=Object.keys(eo),ci=io.filter(o=>o.startsWith("--awc-sky-"));function no(){return io.map(o=>`${o} ${Xt}s ${De}`).join(`,
            `)}var Ur=!1;function We(){if(Ur)return;Ur=!0;let o=globalThis.CSS;if(o?.registerProperty)for(let[e,t]of Object.entries(eo))try{o.registerProperty({name:e,syntax:"<color>",inherits:!0,initialValue:t})}catch{}}var qi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.cloudTimelines=[];this.startWindFactor=1;this.realWindSpeed=a,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...i},A(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start clouds animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");oi(t);let a=Math.min(6,Math.max(1,Math.round(i.cloudCount)));this.cloudsConfig.isPartlyCloudy&&(a=Math.max(1,Math.round(a*.6))),this.cloudTimelines=$r(t,i,a,n,this.cardConfig),this.startWindFactor=Pe(i.windSpeed),A(this.config.devMode,`Clouds animation started with ${a} clouds`)}async onStop(){this.cloudTimelines.forEach(i=>{window.AnimatedWeatherCardGsap?.killTweensOf(i),i&&typeof i.kill=="function"&&i.kill()}),this.cloudTimelines=[];let t=this.element.querySelector(this.layerSelector);t&&oi(t),A(this.config.devMode,"Clouds animation stopped")}async onPause(){this.cloudTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),A(this.config.devMode,"Clouds animation paused")}async onResume(){this.cloudTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),A(this.config.devMode,"Clouds animation resumed")}onWindSpeedChange(){if(!window.AnimatedWeatherCardGsap)return;let t=J(this.cardConfig,this.realWindSpeed),i=Pe(t.windSpeed)/this.startWindFactor;this.cloudTimelines.forEach(n=>{window.AnimatedWeatherCardGsap.to(n,{timeScale:i,duration:Xt,ease:"sine.inOut",overwrite:!0})})}};var Vi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=a,this.fogConfig={layerCount:3,...i},A(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start fog animation");let t=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!t)throw new Error("Fog container not found");let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");Ni(n),this.fogTimelines=[];for(let a=0;a<this.fogConfig.layerCount;a++){let r=Gr(t,i,a,n,this.cardConfig);this.fogTimelines.push(r.movement),this.fogTimelines.push(r.opacity)}A(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(n=>{n&&typeof n.kill=="function"&&n.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer")?.forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),A(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),A(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),A(this.config.devMode,"Fog animation resumed")}};var ql=1/3,Vl=.35,Yi=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=a,this.starsConfig={starCount:30,showMoon:!0,...i},A(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start stars animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Animation layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed);this.element.querySelector(".animated-weather-card")?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(s),s.remove()});let a=Math.max(15,Math.round(i.cloudCount*5)),r=document.createElement("div");r.className="stars-field";for(let s=0;s<a;s++){let c=document.createElement("div");c.className="star-gsap";let l=1+Math.random()*3,d=.3+Math.random()*.5;if(c.style.cssText=`
                width: ${l.toFixed(2)}px;
                height: ${l.toFixed(2)}px;
                left: ${(Math.random()*100).toFixed(2)}%;
                top: ${(Math.random()*70).toFixed(2)}%;
                opacity: ${d.toFixed(2)};
            `,Math.random()<ql){let h=3+Math.random()*4;c.classList.add("twinkle"),c.style.setProperty("--star-o",d.toFixed(2)),c.style.setProperty("--star-dim",(d*(1-Math.random()*Vl)).toFixed(2)),c.style.animationDuration=`${h.toFixed(2)}s`,c.style.animationDelay=`${(-Math.random()*h).toFixed(2)}s`}r.appendChild(c)}if(t.appendChild(r),this.addParticle(r),window.AnimatedWeatherCardGsap.fromTo(r,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"}),this.starsConfig.showMoon){let s=document.createElement("div");s.className="moon-gsap",t.appendChild(s),this.addParticle(s),window.AnimatedWeatherCardGsap.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"})}A(this.config.devMode,`Stars animation started with ${a} stars`)}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&t.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),A(this.config.devMode,"Stars animation stopped")}setPaused(t){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(i=>i.classList.toggle("paused",t))}async onPause(){this.setPaused(!0),A(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),A(this.config.devMode,"Stars animation resumed")}};var Ui=class extends X{constructor(t,i,n,a){super(t,i,n);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";A(this.config.devMode,"SunAnimation created")}async onStart(){let t=this.element.querySelector(this.layerSelector);if(!t){A(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}t.style.opacity="1",A(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.opacity="0"),A(this.config.devMode,"Sun animation stopped")}async onPause(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="paused"),A(this.config.devMode,"Sun animation paused")}async onResume(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="running"),A(this.config.devMode,"Sun animation resumed")}};var Ki=class{constructor(e,t,i,n){this.activeAnimations=new Map;this.element=e,this.config=t,this.timeOfDayManager=i,this.realWindSpeed=n}async startModularAnimation(e,t){this.activeAnimations.has(e)&&await this.stopModularAnimation(e);try{let i={intensity:t,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1},n=null;switch(e){case"rain":n=new Wi(this.element,{...i,isStorm:t>=2&&t<=4,isPouring:t>4,isLightRain:t<1,particleCount:Math.floor(t*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":n=new Hi(this.element,{...i,particleCount:Math.floor(t*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":n=new zi(this.element,{...i,particleCount:Math.floor(t*40)},this.config,this.realWindSpeed);break;case"wind":n=new $i(this.element,{...i,leafCount:Math.max(1,Math.floor(t*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":n=new Ii(this.element,{...i,disableShake:this.config.disable_lightning_shake||!1,minInterval:si[0],maxInterval:si[1]},this.config,this.realWindSpeed);break;case"clouds":n=new qi(this.element,{...i,cloudCount:Math.max(1,Math.floor(t*2)),isPartlyCloudy:t<3},this.config,this.realWindSpeed);break;case"fog":n=new Vi(this.element,{...i,layerCount:Math.max(2,Math.min(5,Math.floor(t)))},this.config,this.realWindSpeed);break;case"stars":n=new Yi(this.element,{...i,starCount:Math.max(15,Math.floor(t*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":n=new Ui(this.element,i,this.config);break;default:return A(this.config.dev_mode,`No modular animation registered for type: ${e}`),null}return await n.start(),this.activeAnimations.set(e,n),A(this.config.dev_mode,`Started modular ${e} animation with intensity ${t}`),n}catch(i){return console.error(`Failed to start modular ${e} animation:`,i),null}}async stopModularAnimation(e){let t=this.activeAnimations.get(e);if(t)try{await t.destroy(),A(this.config.dev_mode,`Stopped modular ${e} animation`)}catch(i){console.error(`Error stopping modular ${e} animation:`,i)}finally{this.activeAnimations.delete(e)}}async pauseModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isActive())try{await t.pause()}catch(i){console.error(`Error pausing modular ${e} animation:`,i)}}async resumeModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isPaused())try{await t.resume()}catch(i){console.error(`Error resuming modular ${e} animation:`,i)}}updateWindSpeed(e){if(!Object.is(e,this.realWindSpeed)){this.realWindSpeed=e;for(let[t,i]of this.activeAnimations)try{i.setWindSpeed(e)}catch(n){console.warn(`Failed to update wind speed for ${t}:`,n)}}}async cleanup(){let e=Array.from(this.activeAnimations.keys()).map(t=>this.stopModularAnimation(t));await Promise.all(e),this.activeAnimations.clear()}};var He=class{constructor(e,t,i,n){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.element=e,this.config=t,this.isPausedFn=i,this.timeOfDayManager=n,this.modularBridge=new Ki(e,t,n,this.currentWindSpeed),A(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(e){this.currentWindSpeed=e,this.modularBridge.updateWindSpeed(e)}async startAnimation(e,t){let i=this.animations[e];if(i.isActive){A(this.config.dev_mode,`Animation ${e} already active \u2014 skipping`);return}let n=t?.intensity??i.intensity??1,a=this.generation;i.isActive=!0,i.intensity=n,this.setAnimationLayerVisibility(e,!0);try{let r=await this.modularBridge.startModularAnimation(e,n);if(a!==this.generation){A(this.config.dev_mode,`Discarding stale start for ${e} (generation drifted)`),await this.modularBridge.stopModularAnimation(e);return}if(!r){i.isActive=!1,console.warn(`No modular animation available for type: ${e}`);return}A(this.config.dev_mode,`Started ${e} animation with intensity ${n}`)}catch(r){console.error(`Failed to start ${e} animation:`,r),i.isActive=!1}}async stopAnimation(e){let t=this.animations[e];if(t.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(e),A(this.config.dev_mode,`Stopped ${e} animation`)}catch(i){console.error(`Error stopping ${e} animation:`,i)}this.setAnimationLayerVisibility(e,!1),t.isActive=!1,t.isPaused=!1}}pauseAnimation(e){let t=this.animations[e];!t.isActive||t.isPaused||(t.isPaused=!0,this.modularBridge.pauseModularAnimation(e),A(this.config.dev_mode,`Paused ${e} animation`))}resumeAnimation(e){let t=this.animations[e];!t.isActive||!t.isPaused||(t.isPaused=!1,this.modularBridge.resumeModularAnimation(e),A(this.config.dev_mode,`Resumed ${e} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(e=>this.stopAnimation(e)))}pauseAllAnimations(){Object.keys(this.animations).forEach(e=>this.pauseAnimation(e))}resumeAllAnimations(){Object.keys(this.animations).forEach(e=>this.resumeAnimation(e))}async applyWeatherCondition(e){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let t=this.defaultWeatherMappings[e.toLowerCase()];if(!t){console.warn(`No animation mapping for weather condition: ${e}`);return}await Promise.all(t.animations.map(i=>{let n=t.overrides?.[i];return this.startAnimation(i,n)})),A(this.config.dev_mode,`Applied weather condition: ${e} with animations: ${t.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(e,t){let i=this.element.querySelector(".animated-weather-card");if(!i)return;let n=`individual-${e}-active`;t?i.classList.add(n):i.classList.remove(n)}clearIndividualAnimationClasses(){let e=this.element.querySelector(".animated-weather-card");if(e)for(let t of Object.keys(this.animations))e.classList.remove(`individual-${t}-active`)}};var ji=o=>{if(o==null||o==="")return null;let e=typeof o=="number"?o:Number(o);return Number.isFinite(e)?e:null},Xi=o=>typeof o=="string"?o.trim():"";function Yl(o){if(!o||typeof o!="object")return null;let e=o,t=typeof e.id=="number"?String(e.id):Xi(e.id);return t?{id:t,label:Xi(e.flight_number)||Xi(e.callsign),aircraftCode:Xi(e.aircraft_code),altitudeFt:ji(e.altitude),groundSpeedKt:ji(e.ground_speed),heading:ji(e.heading),verticalSpeed:ji(e.vertical_speed),onGround:e.on_ground===1||e.on_ground===!0||e.on_ground==="1"}:null}function ao(o,e){if(!o||!e)return null;let t=o.states[e];if(!t||t.state==="unavailable"||t.state==="unknown")return null;let i=t.attributes?.flights;if(!Array.isArray(i))return[];let n=[];for(let a of i){let r=Yl(a);r&&n.push(r)}return n}var Zi=class{constructor(){this.known=null}update(e){if(!e)return[];let t=e.filter(r=>!r.onGround),i=new Set(t.map(r=>r.id));if(this.known===null)return this.known=i,[];let n=[],a=new Set;for(let r of t)this.known.has(r.id)||a.has(r.id)||(a.add(r.id),n.push(r));return this.known=i,n}reset(){this.known=null}};var Qi=class{constructor(e={}){this.listeners=new Set;this.config={enableDayNightCycle:e.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...e},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(e){let t=this.config.enableDayNightCycle;this.config={...this.config,...e},this.updateState(),this.config.enableDayNightCycle&&!t?this.startAutoUpdate():!this.config.enableDayNightCycle&&t&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}getTimeAwareColor(e){let t=this.getCurrentState();if(!this.isEnabled())return e.day;switch(t.timePhase){case"dawn":return e.dawn||this.blendColors(e.night,e.day,.3);case"day":return e.day;case"dusk":return e.dusk||this.blendColors(e.day,e.night,.3);case"night":return e.night;default:return e.day}}setDevOverride(e){this.devTimePhaseOverride=e,this.updateState()}clearDevOverride(){this.devTimePhaseOverride=void 0,this.updateState()}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let e=new Date,t,i;if(!this.config.useBrowserTime&&this.config.timeZone){let s=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(e);t=parseInt(s.find(c=>c.type==="hour")?.value||"0",10),i=parseInt(s.find(c=>c.type==="minute")?.value||"0",10)}else t=e.getHours(),i=e.getMinutes();let n=t+i/60,a;if(this.devTimePhaseOverride)a=this.devTimePhaseOverride;else{let s=this.config.sunriseHour,c=this.config.sunsetHour,l=(s-1+24)%24,d=(s+.5)%24,h=(c-.5+24)%24,m=(c+1)%24,p=(g,u,f)=>u<=f?g>=u&&g<f:g>=u||g<f;p(n,l,d)?a="dawn":p(n,d,h)?a="day":p(n,h,m)?a="dusk":a="night"}let r={isDaytime:a==="day"||a==="dawn",isNighttime:a==="night"||a==="dusk",isDawn:a==="dawn",isDusk:a==="dusk",currentHour:t,timePhase:a};!this.currentState||this.currentState.timePhase!==r.timePhase?(this.currentState=r,this.notifyListeners(r)):this.currentState=r}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},Ar.UPDATE_INTERVAL)}notifyListeners(e){this.listeners.forEach(t=>{try{t(e)}catch(i){console.error("TimeOfDayManager: Error in listener callback:",i)}})}blendColors(e,t,i){let n=e.replace("#",""),a=t.replace("#",""),r=parseInt(n.substring(0,2),16),s=parseInt(n.substring(2,4),16),c=parseInt(n.substring(4,6),16),l=parseInt(a.substring(0,2),16),d=parseInt(a.substring(2,4),16),h=parseInt(a.substring(4,6),16),m=Math.round(r*(1-i)+l*i),p=Math.round(s*(1-i)+d*i),g=Math.round(c*(1-i)+h*i),u=m.toString(16).padStart(2,"0"),f=p.toString(16).padStart(2,"0"),y=g.toString(16).padStart(2,"0");return`#${u}${f}${y}`}};var ce=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var Ul=to(),Kl=Ht(Ct(Le)),ro=o=>`${Math.round(o*100)}%`,jl=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,Xl=48,oa=()=>`
${ce("animated-weather-card")}
        /* \u2500\u2500 Reduced motion (WCAG 2.3.3): static sky, no weather motion \u2500\u2500\u2500\u2500\u2500 */
        @media (prefers-reduced-motion: reduce) {
          .animated-weather-card *,
          .animated-weather-card *::before,
          .animated-weather-card *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
          /* Weather motion goes; the sun stays, still */
          .animated-weather-card .animation-container {
            display: none !important;
          }
        }

        /* \u2500\u2500 Frame \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* The sky is the card: in the colorized palette ha-card's own fill and
           border step aside so the sky reaches the rounded edge. Theme mode
           keeps ha-card's frame and blends with the dashboard. */
        ha-card:has(> .animated-weather-card) {
          height: 100%;
          overflow: hidden;
          isolation: isolate;
        }
        /* spill_particles (default on): rain, snow, sleet and leaves fall out
           of the card onto the dashboard, and clouds can rise a little above
           its top edge. The sky, sun, planes and text stay inside the rounded
           frame either way. */
        ha-card:has(> .animated-weather-card[data-spill]) { overflow: visible; }
        ha-card:has(> .animated-weather-card:not(.theme-colors)) {
          background: none;
          border-color: transparent;
        }

        .animated-weather-card {
          --awc-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          --awc-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          --awc-ease: cubic-bezier(0.25, 1, 0.5, 1);
          --awc-pad: 20px;
          --awc-secondary: ${Gi};

          /* Public color hooks (also set by custom_colors) */
          --weather-text-color: ${Kl};
          --weather-text-shadow: var(--weather-text-shadow-color, rgba(6, 12, 28, 0.22));
          --weather-sun-primary: var(--weather-sun-color-primary, #ffd67a);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ffb547);
          --weather-sun-glow: var(--weather-sun-glow-color, rgba(255, 214, 140, 0.55));
          --weather-sun-halo: var(--weather-sun-halo-color, rgba(255, 214, 140, 0.24));
          --weather-rain-color: var(--weather-rain-particle-color, rgba(222, 234, 255, 0.62));
          --weather-storm-rain-color: var(--weather-storm-rain-particle-color, rgba(206, 214, 236, 0.5));
          --weather-snow-color: var(--weather-snow-particle-color, #f7fbff);
          --weather-wind-color: var(--weather-wind-particle-color, rgba(255, 255, 255, 0.4));
          --awc-cloud-far: rgba(214, 226, 242, 0.85);
          --awc-cloud-mid: rgba(232, 239, 248, 0.92);
          --awc-cloud-near: rgba(248, 250, 253, 0.96);

          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          min-height: 168px;
          border-radius: var(--ha-card-border-radius, 12px);
          overflow: hidden;
          isolation: isolate;
          container: awc / inline-size;
          color: var(--weather-text-color);
          font-family: var(--awc-font);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          /* Day \u2192 dusk \u2192 night and condition changes cross-fade through the
             registered sky, sun and cloud colors, all on one curve */
          transition:
            ${no()};
        }

        /* clip-path only hides what lies past the card: a fog bank or a cloud
           track still widens the page and brings up its scrollbars. Layout
           containment leaves spilled weather painted but never scrolled to. */
        .animated-weather-card[data-spill] { overflow: visible; contain: layout; }

        .animated-weather-card.no-transitions,
        .animated-weather-card.no-transitions * {
          transition: none !important;
        }

        /* \u2500\u2500 Sky \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        ${Ul}

        .sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
          --awc-sky-glow-layer: ${Fe(Bi,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer),
            linear-gradient(180deg, transparent ${ro(Zr)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${ro(Xr)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${Fe(Qr,"var(--awc-sky-glow)")}; }
        }

        /* Edge falloff: the frame darkens slightly, like a lens */
        .sky::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(150% 120% at 40% 30%, transparent 58%, rgba(4, 8, 20, 0.2) 100%);
        }

        .sky::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: ${jl};
          background-size: 160px 160px;
          opacity: 0.07;
          mix-blend-mode: overlay;
        }

        /* Theme overrides: --weather-<condition>-background replaces the whole sky */
        .animated-weather-card.sunny { --awc-sky-override: var(--weather-sunny-background); }
        .animated-weather-card.partly-cloudy { --awc-sky-override: var(--weather-partly-cloudy-background); }
        .animated-weather-card.windy { --awc-sky-override: var(--weather-windy-background); }
        .animated-weather-card.cloudy { --awc-sky-override: var(--weather-cloudy-background); }
        .animated-weather-card.foggy { --awc-sky-override: var(--weather-foggy-background); }
        .animated-weather-card.light-rain { --awc-sky-override: var(--weather-light-rain-background); }
        .animated-weather-card.rainy { --awc-sky-override: var(--weather-rainy-background); }
        .animated-weather-card.pouring { --awc-sky-override: var(--weather-pouring-background); }
        .animated-weather-card.stormy { --awc-sky-override: var(--weather-stormy-background); }
        .animated-weather-card.snowy { --awc-sky-override: var(--weather-snowy-background); }
        .animated-weather-card.snowy-rainy { --awc-sky-override: var(--weather-snowy-rainy-background); }
        .animated-weather-card.sleety { --awc-sky-override: var(--weather-sleety-background); }
        .animated-weather-card.snowy-stormy { --awc-sky-override: var(--weather-snowy-stormy-background); }
        .animated-weather-card.sleety-stormy { --awc-sky-override: var(--weather-sleety-stormy-background); }
        .animated-weather-card.clear-night { --awc-sky-override: var(--weather-clear-night-background); }

        /* Overcast and night skies get greyer, dimmer clouds */
        .animated-weather-card.cloudy,
        .animated-weather-card.foggy {
          --awc-cloud-far: rgba(170, 182, 198, 0.8);
          --awc-cloud-mid: rgba(196, 206, 220, 0.88);
          --awc-cloud-near: rgba(222, 229, 238, 0.94);
        }
        .animated-weather-card[data-phase="night"] {
          --awc-cloud-far: rgba(96, 108, 132, 0.7);
          --awc-cloud-mid: rgba(122, 134, 158, 0.78);
          --awc-cloud-near: rgba(150, 162, 186, 0.85);
          --weather-rain-color: var(--weather-rain-particle-color, rgba(180, 198, 230, 0.48));
        }
        .animated-weather-card[data-phase="dusk"] {
          --awc-cloud-near: rgba(255, 226, 214, 0.94);
          --awc-cloud-mid: rgba(236, 210, 214, 0.9);
          --weather-sun-primary: var(--weather-sun-color-primary, #ffc58a);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ff9a5c);
          --weather-sun-glow: var(--weather-sun-glow-color, rgba(255, 170, 110, 0.55));
          --weather-sun-halo: var(--weather-sun-halo-color, rgba(255, 170, 110, 0.24));
        }
        .animated-weather-card[data-phase="dawn"] {
          --awc-cloud-near: rgba(255, 234, 228, 0.94);
          --weather-sun-primary: var(--weather-sun-color-primary, #ffe0b0);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ffb98a);
        }

        /* \u2500\u2500 Theme palette: blend with the dashboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .animated-weather-card.theme-colors {
          --weather-text-color: var(--primary-text-color);
          --weather-text-shadow: transparent;
          --awc-secondary: 1;
          --weather-rain-color: var(--weather-rain-particle-color, var(--primary-color, #03a9f4));
          --weather-storm-rain-color: var(--weather-storm-rain-particle-color, var(--secondary-text-color, #8a8a8a));
          --weather-snow-color: var(--weather-snow-particle-color, var(--secondary-text-color, #9a9a9a));
          --weather-wind-color: var(--secondary-text-color, rgba(0, 0, 0, 0.3));
          --weather-sun-primary: var(--weather-sun-color-primary, var(--state-sun-above_horizon-color, #ffc107));
          --weather-sun-secondary: var(--weather-sun-color-secondary, var(--state-sun-above_horizon-color, #ff9800));
          --weather-sun-glow: transparent;
          --awc-cloud-far: var(--secondary-text-color, #888);
          --awc-cloud-mid: var(--secondary-text-color, #888);
          --awc-cloud-near: var(--secondary-text-color, #888);
          /* Icons take the theme's icon colour, as Home Assistant's own
             cards do for sensors (the tile card's default) */
          --awc-icon-color: var(--state-icon-color, var(--primary-color));
          /* The hero temperature carries the theme's primary colour */
          --awc-hero-color: var(--primary-color, var(--primary-text-color));
          border-radius: 0;
        }
        .animated-weather-card.theme-colors .sky { display: none; }
        /* Without a sky behind them, blurred translucent clouds read as
           smudges; draw them as faint, crisp shapes instead (their masks
           are crisp; the filter is for clouds without a canvas) */
        .animated-weather-card.theme-colors .cloud-gsap {
          opacity: 0.16 !important;
          filter: none !important;
        }
        .animated-weather-card.theme-colors .secondary,
        .animated-weather-card.theme-colors .attribute-label,
        .animated-weather-card.theme-colors .hero-meta {
          color: var(--secondary-text-color);
        }
        .animated-weather-card.theme-colors .weather-info { text-shadow: none; }
        .animated-weather-card.theme-colors .attribute-icon,
        .animated-weather-card.theme-colors .indoor-icon {
          color: var(--awc-icon-color);
        }
        .animated-weather-card.theme-colors .temperature {
          color: var(--awc-hero-color);
        }

        /* \u2500\u2500 Loading \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .weather-skeleton {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: none;
          flex-direction: column;
          padding: var(--awc-pad);
          gap: 10px;
        }
        .animated-weather-card.loading .weather-skeleton { display: flex; }
        .animated-weather-card.loading .weather-content { opacity: 0; }
        .animated-weather-card.loading .animation-layer,
        .animated-weather-card.loading .animation-container { display: none !important; }

        .skeleton-line {
          height: 12px;
          width: 34%;
          border-radius: 6px;
          background: currentColor;
          opacity: 0.12;
          animation: awcSkeleton 1.6s ease-in-out infinite;
        }
        .skeleton-line.large { height: 56px; width: 38%; border-radius: 12px; }
        .skeleton-line.medium { width: 26%; }
        .skeleton-line.small { width: 100%; height: 30px; margin-top: auto; border-radius: 8px; }
        @keyframes awcSkeleton {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }

        /* \u2500\u2500 Content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Clips the sky-borne layer (sun, moon, clouds, planes, lightning) to
           the frame even when precipitation is allowed to spill. */
        .weather-content {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-radius: inherit;
          overflow: hidden;
          transition: opacity 0.5s var(--awc-ease);
        }

        .weather-info {
          position: relative;
          z-index: 30;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: var(--awc-pad);
          min-height: 0;
          text-shadow: 0 1px 12px var(--weather-text-shadow);
        }

        .main-weather-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          /* Safety net for frames shorter than the content: the hero gives
             way at its bottom edge and the metric row is never cut. The
             card normally steps down first (see applySizeState). */
          flex: 0 1 auto;
          min-height: 0;
          clip-path: inset(-60px -60px 0 -60px);
        }
        /* Never squash a line to fit: let it overflow so the card can
           measure it and step down to a compact layout instead. */
        .main-weather-info > *,
        .weather-attributes { flex-shrink: 0; }

        .location {
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.01em;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.94;
        }

        .temperature {
          font-family: var(--awc-font-display);
          font-size: 80px;
          font-weight: 200;
          line-height: 0.9;
          letter-spacing: -0.045em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          /* Optical alignment: big numerals carry extra left side-bearing */
          margin: 4px 0 0 -0.055em;
          white-space: nowrap;
        }
        /* inline-block so a new value can rise into place (fadeThrough) */
        .temperature-value { display: inline-block; }
        .temperature .degree {
          font-weight: 200;
          letter-spacing: 0;
          margin-left: 0.02em;
        }

        .weather-desc {
          margin-top: 8px;
          font-size: 17px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: -0.012em;
        }
        /* Conditions come in the user's language and casing ("Partly cloudy",
           "Teilweise bew\xF6lkt"); only make sure they start with a capital */
        .weather-desc::first-letter { text-transform: uppercase; }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 2px 14px;
          margin-top: 2px;
          font-size: 15px;
          line-height: 20px;
          letter-spacing: -0.006em;
          font-variant-numeric: tabular-nums;
          opacity: var(--awc-secondary);
        }
        .hero-meta:empty { display: none; }
        .indoor-climate-inline { white-space: nowrap; }
        .indoor-label { font-weight: 400; margin-right: 4px; }
        .indoor-icon {
          --mdc-icon-size: 14px;
          margin-right: 4px;
          /* Sits on the line like a letter: centred on the digits beside it */
          vertical-align: -1.5px;
        }
        .awc-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        /* "6:32" + a smaller "PM", matching the sun tracker */
        .awc-ampm {
          font-size: 0.7em;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-left: 0.24em;
        }
        .indoor-sep { margin: 0 4px; opacity: 0.6; }

        /* \u2500\u2500 Note \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* A sentence about the weather, last under the hero. It comes in two
           lengths, both in the markup: the height step shows the one that
           fits (see the adaptive height rules below). Full-strength text at
           the quiet tier's size, not its tint: on a narrow card the second
           half of a line runs into the sun's glow, where the tint falls
           below 4.5:1 (sky.test.ts samples it). A sentence is read, not
           glanced at. */
        .weather-note {
          margin: 10px 0 0;
          max-width: 46ch;
          font-size: 15px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: -0.006em;
          text-wrap: pretty;
          /* Whole or not at all: the fit shows a length only if all of it
             fits, and treats a clamped one as not fitting (applySizeState).
             The clamp only stops runaway text from growing the card. */
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          line-clamp: 4;
          overflow: hidden;
        }
        .weather-note[hidden],
        .weather-note .note-short { display: none; }
        /* Which length, or none: the fit decides (NOTE_FIT_STEPS) */
        .animated-weather-card[data-note="line"] .weather-note { -webkit-line-clamp: 2; line-clamp: 2; }
        .animated-weather-card[data-note="line"] .note-long { display: none; }
        .animated-weather-card[data-note="line"] .note-short { display: inline; }
        .animated-weather-card[data-note="none"] .weather-note { display: none; }
        /* While a new note is written: a status in its place, typing dots
           and what's happening, the size of the note it stands for (two
           lines, or one), so nothing moves when the note arrives. A plain
           block, unclamped: a clamp would read the status as text cut
           short, and the fit would turn it away. */
        .note-status { display: none; }
        .weather-note[data-writing] {
          display: block;
          box-sizing: border-box;
          /* The hero column sizes its lines to their text: take the note's
             full measure (max-width: 46ch) instead */
          width: 100%;
          height: 40px;
        }
        .animated-weather-card .weather-note[data-writing] { -webkit-line-clamp: none; line-clamp: none; }
        /* Outranks the length rules above, which show one span or the other */
        .animated-weather-card .weather-note[data-writing] > .note-long,
        .animated-weather-card .weather-note[data-writing] > .note-short { display: none; }
        /* The secondary tint, short and at the left: well inside the part
           of the card the glow leaves at AA (x up to 0.55 on narrow cards,
           see sky.test.ts). A much longer status would need checking. */
        .weather-note[data-writing] > .note-status {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 20px;
          opacity: var(--awc-secondary);
          white-space: nowrap;
          overflow: hidden;
        }
        .note-dots { display: inline-flex; gap: 3px; flex: none; }
        .note-dots i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: awcNoteDot 1.2s ease-in-out infinite;
        }
        .note-dots i:nth-child(2) { animation-delay: 0.15s; }
        .note-dots i:nth-child(3) { animation-delay: 0.3s; }
        @keyframes awcNoteDot {
          0%, 70%, 100% { opacity: 0.3; transform: none; }
          35% { opacity: 1; transform: translateY(-2px); }
        }
        .note-phrase { overflow: hidden; text-overflow: ellipsis; }
        .animated-weather-card[data-note="line"] .weather-note[data-writing] { height: 20px; }
        /* Typing in: the rest of the note is laid out but not yet shown, so
           its lines already break where they'll end up. No caret: even one
           with no width can change where a line breaks. */
        .note-untyped { color: transparent; text-shadow: none; }

        /* \u2500\u2500 Clock (show_clock) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* The time, on the minute, always a step below the temperature. Three
           placements while they're compared (review_clock): a, the hero's
           last line; b and c, the hero's first line with the place. Each
           digit is its own span, so only the ones that change fade. */
        .awc-clock { white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-clock-time { display: inline-flex; }
        .awc-clock-time > span { display: inline-block; }
        .awc-clock-period[hidden] { display: none; }
        .awc-date-month { display: none; }
        @container awc (min-width: 460px) {
          .awc-headline .awc-date-short { display: none; }
          .awc-headline .awc-date-month { display: inline; }
        }

        /* a: the hero's last line. Thin numerals at about 0.42\xD7 the
           temperature, in the quiet tint, with the short date; it leads into
           the forecast below. Line height 1 and a clip: the font's content
           area is taller than its line and would read as overflow. */
        .main-weather-info > .awc-clock {
          --awc-clock-size: 34px;
          display: flex;
          align-items: baseline;
          column-gap: 12px;
          margin-top: 6px;
          overflow: clip;
          opacity: var(--awc-secondary);
        }
        .main-weather-info > .awc-clock .awc-clock-time {
          font-family: var(--awc-font-display);
          font-size: var(--awc-clock-size);
          line-height: 1;
          font-weight: 250;
          letter-spacing: -0.035em;
          margin-left: -0.04em;
        }
        .main-weather-info > .awc-clock .awc-clock-period {
          font-size: calc(var(--awc-clock-size) * 0.42);
          font-weight: 500;
          letter-spacing: 0.02em;
          /* Takes back the line's gap: 0.32em of its own size after the digits */
          margin-left: calc(0.32em - 12px);
        }
        .main-weather-info > .awc-clock .awc-clock-date {
          font-size: 15px;
          line-height: 15px;
          font-weight: 400;
          letter-spacing: -0.006em;
        }
        @container awc (max-width: 319px) { .main-weather-info > .awc-clock { --awc-clock-size: 28px; } }
        @container awc (min-width: 460px) { .main-weather-info > .awc-clock { --awc-clock-size: 40px; } }
        .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"]) .main-weather-info > .awc-clock {
          --awc-clock-size: 28px;
          margin-top: 4px;
        }
        .animated-weather-card[data-clock="off"] .main-weather-info > .awc-clock,
        .animated-weather-card[data-clock-date="none"] .main-weather-info > .awc-clock .awc-clock-date { display: none; }
        .animated-weather-card.theme-colors .main-weather-info > .awc-clock { color: var(--secondary-text-color); }

        /* b and c: the hero's first line, the time and the date with the
           place after them. It's the location's line, so it shows and goes
           with it (tight drops it). Full strength, and stopped at 62% of the
           card: past that it reaches the light, where even full-strength text
           falls under 4.5:1. Whole parts or nothing: the place goes first,
           then the date, never the time (applySizeState). */
        .location.awc-headline {
          display: flex;
          align-items: baseline;
          opacity: 1;
          max-width: calc(62cqi - var(--awc-pad));
          text-overflow: clip;
        }
        @container awc (min-width: 640px) { .location.awc-headline { max-width: none; } }
        .awc-headline .awc-clock { display: inline-flex; align-items: baseline; }
        .awc-headline-sep { margin: 0 6px; opacity: 0.6; }
        .awc-headline .awc-clock-date::before { content: '\xB7'; margin: 0 6px; opacity: 0.6; }
        .awc-headline-place { font-weight: 400; }
        .awc-headline .awc-clock-date { font-weight: 400; }
        .animated-weather-card[data-headline="time-date"] .awc-headline :is(.awc-headline-sep, .awc-headline-place),
        .animated-weather-card[data-headline="time"] .awc-headline :is(.awc-headline-sep, .awc-headline-place, .awc-clock-date) { display: none; }
        /* b: at the location's own size, the time in its weight */
        .awc-headline[data-clock="b"] .awc-clock-time { font-weight: 600; letter-spacing: -0.01em; }
        .awc-headline[data-clock="b"] .awc-clock-period { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }
        /* c: the time at 0.3\xD7 the temperature, so the ratio never changes,
           then the date and the place at the location's size */
        .awc-headline[data-clock="c"] { --awc-clock-size: 24px; }
        .awc-headline[data-clock="c"] .awc-clock-time {
          font-family: var(--awc-font-display);
          font-size: var(--awc-clock-size);
          line-height: 1;
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        .awc-headline[data-clock="c"] .awc-clock-period { font-size: calc(var(--awc-clock-size) * 0.5); font-weight: 500; letter-spacing: 0.04em; margin-left: 0.2em; }
        .awc-headline[data-clock="c"] .awc-clock-date::before { content: none; }
        .awc-headline[data-clock="c"] .awc-clock-date { margin-left: 12px; }
        .awc-headline[data-clock="c"] .awc-headline-place { font-weight: 500; opacity: 0.94; }
        @container awc (max-width: 319px) {
          .awc-headline[data-clock="c"] { --awc-clock-size: 19px; }
          .awc-headline[data-clock="c"] .awc-clock-time { font-weight: 400; }
        }
        @container awc (min-width: 460px) { .awc-headline[data-clock="c"] { --awc-clock-size: 29px; } }
        @container awc (min-width: 640px) { .awc-headline[data-clock="c"] { --awc-clock-size: 36px; } }
        .animated-weather-card:is([data-height="short"], [data-height="snug"]) .awc-headline[data-clock="c"] { --awc-clock-size: 18px; }
        .animated-weather-card:is([data-height="short"], [data-height="snug"]) .awc-headline[data-clock="c"] .awc-clock-time { font-weight: 400; }
        .animated-weather-card.theme-colors .awc-headline .awc-clock-time { color: var(--primary-text-color); }
        .animated-weather-card.theme-colors .awc-headline :is(.awc-clock-period, .awc-clock-date, .awc-headline-place, .awc-headline-sep) { color: var(--secondary-text-color); }

        /* \u2500\u2500 Forecast (forecast) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Narrow: between the hero and the metrics, 10 px above the metrics'
           divider, which is its ground; a tall frame's spare height opens
           above it, as open sky under the hero. Its drawing comes with the
           forecast bundle; until it and the forecast are in, its place is
           held, silently, at the size it'll take. */
        .awc-forecast { position: relative; flex-shrink: 0; margin-top: auto; margin-bottom: -10px; }
        .animated-weather-card:is([data-height="close"], [data-height="short"], [data-height="snug"], [data-height="tight"], [data-height="minimal"]) .awc-forecast { margin-bottom: -2px; }
        .animated-weather-card .awc-forecast ~ .weather-attributes { margin-top: 0; }
        .awc-forecast[data-pending][data-variant="a"] { height: 55px; }
        .awc-forecast[data-pending][data-variant="b"] { height: 44px; }
        .awc-forecast[data-pending][data-variant="c"] { height: 68px; }
        .animated-weather-card[data-forecast="none"] .awc-forecast,
        .awc-forecast[hidden] { display: none; }
        .animated-weather-card[data-forecast="none"] .awc-forecast ~ .weather-attributes { margin-top: auto; }
        /* Wide: a full-width row under the hero and the metrics, with a
           hairline of its own (the metrics' divider is vertical there) */
        @container awc (min-width: 640px) {
          .weather-info:has(> .awc-forecast:not([hidden])) {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            grid-template-rows: minmax(0, 1fr) auto;
            column-gap: 40px;
            row-gap: 24px;
            align-items: end;
          }
          .weather-info:has(> .awc-forecast) > .main-weather-info { grid-column: 1; grid-row: 1; min-height: 0; }
          .weather-info:has(> .awc-forecast) > .weather-attributes { grid-column: 2; grid-row: 1; align-self: end; }
          .weather-info > .awc-forecast { grid-column: 1 / -1; grid-row: 2; margin: 0; padding-top: 14px; }
          .weather-info > .awc-forecast::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
          .animated-weather-card.theme-colors .weather-info > .awc-forecast::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
          .animated-weather-card[data-forecast="none"] .weather-info:has(> .awc-forecast) > .main-weather-info { grid-row: 1 / span 2; }
          .awc-forecast[data-pending] { height: auto; min-height: 68px; }
        }
        .awc-hl[hidden] { display: none; }
        /* Today's high and low on the condition's line (a): no height of its
           own, a line of its own only where it has to wrap (and the fit lets
           it). Narrow, the line stops short of the light. */
        .awc-desc-line {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          column-gap: 12px;
          margin-top: 8px;
          max-width: calc(65cqi - var(--awc-pad));
        }
        /* The line takes over the condition's margin; the height steps would add theirs inside it */
        .animated-weather-card .awc-desc-line > .weather-desc { margin-top: 0 !important; }
        .animated-weather-card:is([data-height="close"], [data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-desc-line { margin-top: 4px; }
        .animated-weather-card[data-height="minimal"] .awc-desc-line { margin-top: 2px; }
        .animated-weather-card[data-range="none"] .awc-hl-line { display: none; }
        @container awc (min-width: 640px) { .awc-desc-line { max-width: none; } }
        @container awc (max-width: 319px) { .awc-desc-line { margin-top: 6px; } }
        /* Beside the temperature (b, c): inside its own line, so it costs no
           height at any step; gone when it would reach the light */
        .temperature[data-hl="stack"] { display: flex; align-items: center; }
        .animated-weather-card[data-hl-fit="none"] .awc-hl-stack { display: none; }

        /* \u2500\u2500 Metrics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .weather-attributes {
          position: relative;
          display: grid;
          grid-auto-flow: column;
          /* Columns hug their content and share the leftover space, so the
             longest label (PRESSURE) never truncates */
          grid-auto-columns: max-content;
          justify-content: space-between;
          column-gap: 24px;
          row-gap: 14px;
          margin-top: auto;
          padding-top: 14px;
        }
        .weather-attributes::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: currentColor;
          opacity: 0.2;
        }
        .animated-weather-card.theme-colors .weather-attributes::before {
          background: var(--divider-color, rgba(0, 0, 0, 0.12));
          opacity: 1;
        }

        .attribute {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .attribute-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          line-height: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          opacity: var(--awc-secondary);
        }
        .attribute-label > span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attribute-icon {
          --mdc-icon-size: 13px;
          flex-shrink: 0;
          /* Optical: centred on the capitals of the uppercase label */
          margin-top: -0.5px;
        }

        .attribute-value {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 16px;
          font-weight: 500;
          line-height: 21px;
          letter-spacing: -0.012em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          min-width: 0;
        }
        .attribute-text {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wind-bearing-arrow,
        .pressure-trend {
          --mdc-icon-size: 14px;
          flex-shrink: 0;
          opacity: var(--awc-secondary);
        }

        /* One row when the (localized) labels fit, else a 2\xD72 grid. Measured
           in applySizeState, since label length depends on the language. */
        .animated-weather-card[data-metrics="grid"] .weather-attributes {
          grid-auto-flow: row;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          justify-content: stretch;
        }

        /* Values only (labels hidden): give the numbers a touch more presence */
        .weather-attributes.values-only .attribute-value { font-size: 18px; }
        .weather-attributes.values-only .attribute { flex-direction: row; align-items: center; gap: 6px; }
        .weather-attributes.values-only .attribute-icon { --mdc-icon-size: 16px; opacity: var(--awc-secondary); }

        /* \u2500\u2500 Adaptive layout: width \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        @container awc (max-width: 319px) {
          .weather-info, .weather-skeleton { --awc-pad: 16px; }
          .temperature { font-size: 64px; font-weight: 250; }
          .weather-desc { font-size: 16px; line-height: 21px; margin-top: 6px; }
          .hero-meta, .weather-note { font-size: 14px; }
          .attribute-value { font-size: 16px; }
        }
        @container awc (max-width: 259px) {
          .temperature { font-size: 56px; font-weight: 300; }
          .location { font-size: 14px; }
          .hero-meta, .weather-note { display: none; }
        }
        @container awc (min-width: 460px) {
          .weather-info, .weather-skeleton { --awc-pad: 24px; }
          .location { font-size: 16px; }
          .temperature { font-size: 96px; letter-spacing: -0.05em; }
          .weather-desc { font-size: 18px; line-height: 24px; }
          .attribute-value { font-size: 18px; line-height: 24px; }
        }
        /* Wide frames (wall tablets, full-width rows): hero left, metrics right */
        @container awc (min-width: 640px) {
          .weather-info, .weather-skeleton { --awc-pad: 28px; }
          .weather-info {
            flex-direction: row;
            align-items: flex-end;
            gap: 40px;
          }
          .main-weather-info { flex: 1; align-self: stretch; justify-content: flex-end; }
          .temperature { font-size: 120px; }
          /* [data-metrics] beats the measured row/grid rules: wide cards
             always use this two-column block */
          .weather-attributes,
          .animated-weather-card[data-metrics] .weather-attributes {
            flex: 0 0 auto;
            width: auto;
            margin-top: 0;
            padding: 0 0 4px 24px;
            grid-auto-flow: row;
            grid-template-columns: repeat(2, max-content);
            column-gap: 56px;
            justify-content: end;
            row-gap: 18px;
          }
          .weather-attributes::before {
            top: 0;
            bottom: 4px;
            left: 0;
            right: auto;
            width: 1px;
            height: auto;
          }
        }

        /* \u2500\u2500 Adaptive layout: height (stepped down until nothing overflows) \u2500
           Each step keeps the one before it and gives up a little more:
           compact drops the line under the condition, short shrinks the
           temperature, tight drops the location, minimal drops the metric
           labels and shrinks the temperature again. A phone's sections row
           (353 \xD7 248) lands on tight, with the labels. */
        .animated-weather-card[data-height="compact"] .hero-meta,
        .animated-weather-card[data-height="short"] .hero-meta,
        .animated-weather-card[data-height="tight"] .hero-meta,
        .animated-weather-card[data-height="minimal"] .hero-meta { display: none; }
        .animated-weather-card[data-height="short"] .weather-info,
        .animated-weather-card[data-height="tight"] .weather-info,
        .animated-weather-card[data-height="minimal"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="short"] .temperature,
        .animated-weather-card[data-height="tight"] .temperature { font-size: 60px; font-weight: 250; }
        .animated-weather-card[data-height="short"] .weather-desc,
        .animated-weather-card[data-height="tight"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="short"] .weather-attributes,
        .animated-weather-card[data-height="tight"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="tight"] .location,
        .animated-weather-card[data-height="minimal"] .location,
        .animated-weather-card[data-height="minimal"] .attribute-label > span { display: none; }
        /* Minimal: icon beside value, so the numbers keep their meaning */
        .animated-weather-card[data-height="minimal"] .attribute { flex-direction: row; align-items: center; gap: 6px; }
        .animated-weather-card[data-height="minimal"] .attribute-icon { --mdc-icon-size: 15px; }
        .animated-weather-card[data-height="minimal"] .temperature { font-size: 52px; font-weight: 300; }
        .animated-weather-card[data-height="minimal"] .weather-desc { margin-top: 2px; }
        .animated-weather-card[data-height="minimal"] .weather-attributes { padding-top: 8px; }

        /* Close, with a note only: everything at its regular size, with
           short's gaps, so a longer note's third line fits where there's
           a line's room less one gap: 12 px back before the note shortens */
        .animated-weather-card[data-height="close"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="close"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="close"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="close"] .weather-note { margin-top: 6px; }

        /* Snug, with a note only: short's sizes, keeping the location and
           the line under the condition, so the note's one-line version fits
           without either giving way. A phone's five-row section (353 \xD7 312,
           metrics in a labelled grid) has 155 px for the hero; snug needs
           152 with the note 6 px below the line above it. At 10 px it no
           longer fits. */
        .animated-weather-card[data-height="snug"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="snug"] .temperature { font-size: 60px; font-weight: 250; }
        .animated-weather-card[data-height="snug"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="snug"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="snug"] .weather-note { margin-top: 6px; }

        /* \u2500\u2500 Compact: the hero on one line, the sky still moving behind \u2500\u2500 */
        /* The temperature leads on the left; the condition, then where and
           what it feels like, sit beside it; the sun keeps its corner of the
           sky on the right, at mid-height. Built to share a column with the
           compact sun tracker. */
        .animated-weather-card[data-variant="compact"] { min-height: 0; }
        .animated-weather-card[data-variant="compact"] .weather-info {
          flex-direction: row;
          align-items: center;
          gap: 0;
          padding-block: 16px;
        }
        .animated-weather-card[data-variant="compact"] .main-weather-info {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          grid-template-areas: "temp desc" "temp meta";
          column-gap: 14px;
          align-items: center;
          align-content: center;
          justify-content: start;
          flex: 1 1 auto;
          align-self: center;
          /* Text stops short of the sun */
          margin-right: calc(14% + 22px);
          clip-path: none;
        }
        .animated-weather-card[data-variant="compact"] .temperature {
          grid-area: temp;
          font-size: 56px;
          /* 1, not the hero's 0.9: the numerals must fit their box here, or
             the fit check reads them as overflowing the strip */
          line-height: 1;
          font-weight: 200;
          letter-spacing: -0.045em;
          margin: 0 0 0 -0.055em;
        }
        .animated-weather-card[data-variant="compact"] .weather-desc,
        .animated-weather-card[data-variant="compact"] .compact-meta {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .animated-weather-card[data-variant="compact"] .weather-desc {
          grid-area: desc;
          align-self: end;
          margin: 0;
          font-size: 16px;
          line-height: 21px;
        }
        .compact-meta {
          grid-area: meta;
          align-self: start;
          margin-top: 2px;
          font-size: 13px;
          line-height: 18px;
          letter-spacing: -0.004em;
          font-variant-numeric: tabular-nums;
          opacity: var(--awc-secondary);
        }
        .compact-meta:empty { display: none; }
        .animated-weather-card[data-variant="compact"] .sun {
          top: 50%;
          left: 86%;
          width: 30px;
          height: 30px;
        }
        .animated-weather-card[data-variant="compact"].theme-colors .sun { width: 26px; height: 26px; }
        .animated-weather-card[data-variant="compact"] .moon-gsap {
          top: 50%;
          left: 86%;
          width: 26px;
          height: 26px;
        }
        /* The light sits around the sun at mid-height */
        .animated-weather-card[data-variant="compact"] .sky {
          --awc-sky-glow-layer: ${Fe(Jr,"var(--awc-sky-glow)")};
        }
        /* Loading: the temperature and condition placeholders, side by side */
        .animated-weather-card[data-variant="compact"] .weather-skeleton {
          flex-direction: row;
          align-items: center;
          gap: 14px;
        }
        .animated-weather-card[data-variant="compact"] .skeleton-line:not(.large):not(.medium) { display: none; }
        .animated-weather-card[data-variant="compact"] .skeleton-line.large { width: 72px; height: 44px; }
        .animated-weather-card[data-variant="compact"] .skeleton-line.medium { width: 30%; }
        /* Short frames (a one-row section): smaller numerals, then one line.
           The strip has no step past tight: minimal looks the same. */
        .animated-weather-card[data-variant="compact"][data-height="short"] .temperature { font-size: 44px; font-weight: 250; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .weather-info,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .weather-info { padding-block: 8px; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .temperature,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .temperature { font-size: 36px; font-weight: 300; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .main-weather-info,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .main-weather-info { grid-template-areas: "temp desc"; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .weather-desc,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .weather-desc { align-self: center; font-size: 15px; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .compact-meta,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .compact-meta { display: none; }

        /* \u2500\u2500 Animation layers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .animation-layer {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          contain: style;
        }

        .animation-container {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.6s var(--awc-ease);
        }

        /* Condition change: the old weather fades out (0.4s, see
           CONDITION_FADE_OUT_MS) before the new one starts, while the sky
           cross-fades through its registered colors. !important beats the
           inline opacity GSAP keeps writing to clouds and stars. */
        .animated-weather-card.condition-out .animation-container,
        .animated-weather-card.condition-out .cloud-gsap,
        .animated-weather-card.condition-out .star-gsap,
        .animated-weather-card.condition-out .moon-gsap,
        .animated-weather-card.condition-out .snow-accumulation,
        .animated-weather-card.condition-out .sleet-accumulation {
          opacity: 0 !important;
          transition: opacity 0.4s cubic-bezier(0.5, 0, 0.75, 0) !important;
        }
        /* Fog always stays in the frame, corners included */
        .animation-container.fog-container {
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
        }
        /* Spill: precipitation escapes the sides and bottom, never the top;
           wind carries leaves out to the right */
        .animated-weather-card[data-spill] .rain-container,
        .animated-weather-card[data-spill] .snow-container,
        .animated-weather-card[data-spill] .sleet-container,
        .animated-weather-card[data-spill] .lightning-container {
          clip-path: inset(0 -200px -200px -200px);
        }
        .animated-weather-card[data-spill] .wind-container {
          clip-path: inset(0 -500px -200px 0);
        }

        /* Clouds drift in front of the sun, stars and planes, in their own
           layer. In the frame by default; with spill they can rise past the
           top edge, fading out over the top half of CLOUD_OVERHANG_PX. The sides and
           bottom stay closed: clouds cross the card, not the dashboard. */
        .clouds-container {
          --awc-cloud-overhang: 0px;
          z-index: 25;
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
        }
        .clouds-layer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: var(--awc-cloud-overhang);
        }
        .animated-weather-card[data-spill] .clouds-container {
          --awc-cloud-overhang: ${Xl}px;
          top: calc(-1 * var(--awc-cloud-overhang));
          clip-path: inset(0 round 0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px));
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 calc(var(--awc-cloud-overhang) / 2));
          mask-image: linear-gradient(to bottom, transparent 0, #000 calc(var(--awc-cloud-overhang) / 2));
        }

        .rain-layer, .snow-layer, .sleet-layer, .wind-layer {
          position: absolute;
          inset: 0;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s var(--awc-ease);
        }

        .animated-weather-card.rainy .rain-layer,
        .animated-weather-card.stormy .rain-layer,
        .animated-weather-card.pouring .rain-layer,
        .animated-weather-card.snowy-rainy .rain-layer,
        .animated-weather-card.light-rain .rain-layer { opacity: 1; }
        .animated-weather-card.snowy .snow-layer,
        .animated-weather-card.snowy-rainy .snow-layer,
        .animated-weather-card.snowy-stormy .snow-layer { opacity: 1; }
        .animated-weather-card.sleety .sleet-layer,
        .animated-weather-card.sleety-stormy .sleet-layer { opacity: 1; }
        .animated-weather-card.windy .wind-layer { opacity: 1; }

        .animated-weather-card.individual-rain-active .rain-layer { opacity: 1; }
        .animated-weather-card.individual-snow-active .snow-layer { opacity: 1; }
        .animated-weather-card.individual-sleet-active .sleet-layer { opacity: 1; }
        .animated-weather-card.individual-wind-active .wind-layer { opacity: 1; }
        .animated-weather-card.individual-clouds-active .cloud-gsap { opacity: 1; }
        .animated-weather-card.individual-fog-active .fog-layer { opacity: 1; }
        .animated-weather-card.individual-stars-active .star-gsap,
        .animated-weather-card.individual-stars-active .moon-gsap { opacity: 1; }
        .animated-weather-card.individual-sun-active .sun { opacity: 1; }

        /* \u2500\u2500 Sun: a light source, not a disc \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .sun {
          position: absolute;
          top: 20%;
          left: 84%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #fff3d6 34%, var(--weather-sun-primary) 70%, var(--weather-sun-secondary) 100%);
          box-shadow:
            0 0 18px 4px var(--weather-sun-glow),
            0 0 64px 18px var(--weather-sun-halo);
          opacity: 0;
          transition: opacity ${Xt/2}s ${De};
          animation: awcSunBreathe 9s ease-in-out infinite;
        }
        .sun::before {
          content: '';
          position: absolute;
          inset: -90%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--weather-sun-glow) 0%, transparent 62%);
          opacity: 0.55;
          animation: awcSunCorona 7s ease-in-out infinite alternate;
        }
        /* The sun's height follows the time of day on a full-card track (a
           transform, so .sun keeps its breathing): low at dawn and dusk and
           below the horizon at night, so it sets downward and rises upward. */
        .sun-track {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: transform ${Xt}s ${De};
        }
        .animated-weather-card[data-phase="dusk"] .sun-track,
        .animated-weather-card[data-phase="dawn"] .sun-track { transform: translateY(14%); }
        .animated-weather-card[data-phase="night"] .sun-track { transform: translateY(26%); }

        .animated-weather-card.sunny .sun { opacity: 1; }
        .animated-weather-card.partly-cloudy .sun { opacity: 0.85; }
        .animated-weather-card.rainy .sun,
        .animated-weather-card.snowy .sun,
        .animated-weather-card.stormy .sun,
        .animated-weather-card.windy .sun,
        .animated-weather-card.cloudy .sun,
        .animated-weather-card.foggy .sun,
        .animated-weather-card.snowy-rainy .sun,
        .animated-weather-card.clear-night .sun,
        .animated-weather-card[data-phase="night"] .sun {
          opacity: 0 !important;
        }
        /* animate: false is fully still: the light stays, the breathing stops */
        .animated-weather-card.static .sun,
        .animated-weather-card.static .sun::before { animation: none; }
        .animated-weather-card.theme-colors .sun { box-shadow: none !important; }
        .animated-weather-card.theme-colors .moon-gsap::before { display: none; }
        .animated-weather-card.theme-colors .sun {
          width: 32px;
          height: 32px;
          background: radial-gradient(circle, var(--weather-sun-primary) 0 62%, var(--weather-sun-secondary) 100%);
        }
        .animated-weather-card.theme-colors .sun::before { display: none; }

        @keyframes awcSunBreathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.04); }
        }
        @keyframes awcSunCorona {
          0% { transform: scale(0.96); opacity: 0.45; }
          100% { transform: scale(1.08); opacity: 0.65; }
        }

        /* \u2500\u2500 Lightning: the sky lights up from inside the cloud deck \u2500\u2500\u2500\u2500\u2500\u2500 */
        .lightning {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          background:
            radial-gradient(110% 80% at 50% 0%, rgba(232, 238, 255, 0.62) 0%, rgba(214, 224, 255, 0.16) 55%, transparent 85%);
        }
        .lightning svg path {
          filter: drop-shadow(0 0 4px rgba(214, 228, 255, 0.95)) drop-shadow(0 0 14px rgba(170, 196, 255, 0.6));
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .animated-weather-card.theme-colors .lightning {
          background: radial-gradient(110% 80% at 50% 0%, rgba(128, 128, 140, 0.2), transparent 80%);
        }

        /* \u2500\u2500 Stars and moon \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .stars-field { position: absolute; inset: 0; pointer-events: none; }
        .star-gsap {
          position: absolute;
          border-radius: 50%;
          background: white;
          pointer-events: none;
        }
        .star-gsap.twinkle { animation: awcTwinkle 5s ease-in-out infinite alternate; }
        @keyframes awcTwinkle {
          from { opacity: var(--star-o); }
          to { opacity: var(--star-dim); }
        }
        /* The moon takes the sun's place in the top-right, clear of the
           temperature: soft maria, a steady disc and a slowly breathing halo. */
        .moon-gsap {
          position: absolute;
          left: 84%;
          top: 20%;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background:
            radial-gradient(circle at 38% 40%, rgba(160, 166, 180, 0.28) 0 12%, transparent 13%),
            radial-gradient(circle at 62% 62%, rgba(160, 166, 180, 0.22) 0 9%, transparent 10%),
            radial-gradient(circle at 58% 32%, rgba(160, 166, 180, 0.16) 0 6%, transparent 7%),
            radial-gradient(circle at 34% 30%, #fbfaf4 0%, #ece8dc 55%, #cfcabc 100%);
          opacity: 0;
          pointer-events: none;
        }
        .moon-gsap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: 0 0 16px 2px rgba(226, 232, 255, 0.28), 0 0 56px 12px rgba(190, 206, 255, 0.12);
          animation: awcMoonHalo 6s ease-in-out infinite alternate;
        }
        @keyframes awcMoonHalo {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
        .stars-field.paused .star-gsap,
        .moon-gsap.paused::before { animation-play-state: paused; }
        /* While the card is paused (hidden or off-screen) its CSS loops rest too */
        animated-weather-card[data-paused] .animated-weather-card *,
        animated-weather-card[data-paused] .animated-weather-card *::before {
          animation-play-state: paused !important;
        }

        /* \u2500\u2500 Particles \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .wind-swoosh-gsap { position: absolute; transform-origin: left center; }
        .leaf-gsap { position: absolute; border-radius: 0 100% 0 100%; transform-origin: center; }
        /* A full-width track carries each cloud; the track is what moves */
        .cloud-track { position: absolute; top: 0; left: 0; width: 100%; height: 0; will-change: transform; }
        .raindrop { position: absolute; pointer-events: none; }
        .rain-rebound {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          overflow: visible;
          opacity: 0;
          pointer-events: none;
        }
        .rain-rebound path { stroke-linecap: round; }
        .rain-splash {
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .snowflake { position: absolute; border-radius: 50%; pointer-events: none; }

        /* \u2500\u2500 Planes (Flightradar24) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Inside .animation-layer at z-index 5: in front of the sun, stars and
           moon, behind the clouds (their own layer above) and the text. */
        .planes-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          transition: opacity 0.3s var(--awc-ease);
        }
        .plane-gsap {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--weather-plane-color, var(--weather-text-color, #fff));
          will-change: transform, opacity;
        }
        .plane-body { position: relative; line-height: 0; }
        .plane-svg {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0.9;
          filter: drop-shadow(0 1px 2px rgba(6, 12, 28, 0.25));
        }
        /* At night a plane is its lights: the outline only faintly there.
           At dusk and dawn, with the sun just below the horizon, a plane up
           high is still in sunlight: it keeps its outline, lights on. */
        .animated-weather-card[data-phase="night"] .plane-gsap.night .plane-svg { opacity: 0.22; filter: none; }
        /* Its lights, where they are on the aircraft (aircraft.ts), in a
           fixed size whatever the plane's: steady red or green at the near
           wingtip, white strobes that flash twice, the red beacon on the
           belly, and white at the tail. A plane flying right shows its
           right side, whose wingtip is green; flying left, its red left. */
        .plane-light {
          position: absolute;
          width: 2px;
          height: 2px;
          margin: -1px 0 0 -1px;
          border-radius: 50%;
        }
        .plane-light.nav { background: #3ee07a; box-shadow: 0 0 3px 1px rgba(62, 224, 122, 0.7); }
        .plane-gsap.westbound .plane-light.nav { background: #ff4d40; box-shadow: 0 0 3px 1px rgba(255, 77, 64, 0.7); }
        .plane-light.tail { background: #f6f3ea; box-shadow: 0 0 2px rgba(246, 243, 234, 0.6); }
        .plane-light.strobe,
        .plane-light.beacon {
          width: 3px;
          height: 3px;
          margin: -1.5px 0 0 -1.5px;
          opacity: 0;
        }
        .plane-light.strobe {
          background: #fbfbff;
          box-shadow: 0 0 6px 2px rgba(251, 251, 255, 0.8);
          animation: planeStrobe 1.2s steps(1, end) infinite;
        }
        .plane-light.beacon {
          background: #ff3b30;
          box-shadow: 0 0 5px 1px rgba(255, 59, 48, 0.85);
          animation: planeBeacon 1s steps(1, end) infinite 0.35s;
        }
        @keyframes planeStrobe {
          0% { opacity: 1; }
          5% { opacity: 0; }
          13% { opacity: 1; }
          18%, 100% { opacity: 0; }
        }
        @keyframes planeBeacon {
          0% { opacity: 1; }
          12%, 100% { opacity: 0; }
        }
        /* A flight tracker's tag: beside the plane at fuselage height, on
           the open-sky side (right), so it adds no height to the plane */
        .plane-label {
          position: absolute;
          top: 50%;
          left: calc(100% + 6px);
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: 600;
          line-height: 12px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: var(--weather-text-color, #fff);
          opacity: 0.72;
          text-shadow: 0 1px 4px var(--weather-text-shadow);
          font-variant-numeric: tabular-nums;
        }

`;var Zl={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function Ql(o,e){try{let t=o.formatEntityState?.(e);if(t&&t!==e.state)return t}catch{}return ke(Zl,e.state)||e.state}var Jl=180;function so(o,e){let t=e.note_entity?o?.states[e.note_entity]:void 0;if(!t)return null;let i=s=>typeof s=="string"?s.trim():"",n=t.state==="unknown"||t.state==="unavailable"?"":i(t.state),a=i(t.attributes?.[e.note_attribute||"note"]);if(!n&&!a)return null;let r=Date.parse(t.attributes?.generated_at);return{line:n||a,note:a||n,writtenAt:Number.isNaN(r)?null:r}}function lo(o,e){let t=Number(e.note_max_age??Jl);return o.writtenAt===null||!(t>0)?null:o.writtenAt+t*6e4}function sa(o,e,t){if(e.dev_mode){let i=tc(e,t);if(o&&e.sun_entity){let n=o.states[e.sun_entity];n&&(i.sun={sunrise:n.attributes.next_rising||null,sunset:n.attributes.next_setting||null,dawn:n.attributes.next_dawn||null,dusk:n.attributes.next_dusk||null,noon:n.attributes.next_noon||null,elevation:n.attributes.elevation??null,aboveHorizon:n.state==="above_horizon"})}return i}return o?ic(o,e):{temperature:"--",weatherCondition:"",location:e.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--"}}function tc(o,e){let n=Xn[e||"sunny"]||"22",a=co(o)?se(parseFloat(n),void 0,1):n,r=o.name||"",s=Ce.humidity,c=Ce.windSpeed,l=parseFloat(c.split(" ")[0])||15,d=Ce.pressure,m=Zn[e||"sunny"]||e||"sunny",p=Ce.indoorTemperature,g=Ce.indoorHumidity,u=new Date,f=new Date(u.getFullYear(),u.getMonth(),u.getDate(),6,14),y=new Date(u.getFullYear(),u.getMonth(),u.getDate(),18,32),_=new Date(u.getFullYear(),u.getMonth(),u.getDate(),5,45),v=new Date(u.getFullYear(),u.getMonth(),u.getDate(),19,1),b=new Date(u.getFullYear(),u.getMonth(),u.getDate(),12,23),w=Date.now(),C={sunrise:f.toISOString(),sunset:y.toISOString(),dawn:_.toISOString(),dusk:v.toISOString(),noon:b.toISOString(),elevation:42.5,aboveHorizon:w>=f.getTime()&&w<=y.getTime()};return{temperature:a,weatherCondition:m,location:r,humidity:s,windSpeed:c,windSpeedValue:l,windBearing:null,pressure:d,pressureValue:null,feelsLike:null,indoorTemperature:p,indoorHumidity:g,sun:C}}var ec={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function oo(o){let e=typeof o=="number"?o:typeof o=="string"?parseFloat(o):NaN;return isFinite(e)?(e%360+360)%360:typeof o=="string"?ec[o.trim().toUpperCase()]??null:null}function co(o){return Number(o.temperature_decimals)===1?1:0}function ic(o,e){if(!e.entity)throw new Error("Weather entity is required");let t=o.states[e.entity];if(!t)throw new Error(`Entity ${e.entity} not found`);let i;if(e.outdoor_sensor_entity){let x=o.states[e.outdoor_sensor_entity];x&&x.state&&!isNaN(parseFloat(x.state))?i=parseFloat(x.state):i=t.attributes.temperature}else i=t.attributes.temperature;let n=co(e),a=x=>se(n?x:Math.round(x),o,n),r=i!=null&&!isNaN(i)?a(i):"--",s=Ql(o,t),c=e.name||t.attributes.friendly_name||"",l=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?se(Math.round(E),o)+"%":null},d="--";if(e.humidity_sensor_entity){let x=o.states[e.humidity_sensor_entity];d=x&&l(x.state)||l(t.attributes.humidity)||"--"}else d=l(t.attributes.humidity)||"--";let h="--",m=10,p=(x,E)=>{let M=typeof x=="number"?x:parseFloat(x);return isFinite(M)?(m=Lr(M,E||"km/h"),h=se(Math.round(M),o)+" "+(E||"km/h"),!0):!1},g=e.wind_speed_sensor_entity?o.states[e.wind_speed_sensor_entity]:void 0;g&&p(g.state,g.attributes?.unit_of_measurement)||p(t.attributes.wind_speed,t.attributes.wind_speed_unit);let u=e.wind_direction_sensor_entity?o.states[e.wind_direction_sensor_entity]:void 0,f=oo(u?.state)??oo(t.attributes.wind_bearing),y=(x,E)=>{let M=typeof x=="number"?x:parseFloat(x);if(!isFinite(M))return null;let L=E.toLowerCase()==="inhg"?2:0;return se(M,o,L)+" "+E},_=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?E:null},v="--",b=null;if(e.pressure_sensor_entity){let x=o.states[e.pressure_sensor_entity];if(x){let E=x.attributes.unit_of_measurement||"hPa",M=y(x.state,E);M&&(v=M,b=_(x.state))}if(v==="--"&&t.attributes.pressure!==void 0){let E=t.attributes.pressure_unit||"hPa";v=y(t.attributes.pressure,E)||"--",b=_(t.attributes.pressure)}}else if(t.attributes.pressure!==void 0){let x=t.attributes.pressure_unit||"hPa";v=y(t.attributes.pressure,x)||"--",b=_(t.attributes.pressure)}let w=null,C;if(e.feels_like_entity&&(C=o.states[e.feels_like_entity]?.state),C===void 0&&t.attributes.apparent_temperature!==void 0&&(C=t.attributes.apparent_temperature),C!==void 0){let x=typeof C=="number"?C:parseFloat(C);isFinite(x)&&(w=a(x)+"\xB0")}let S="--";if(e.indoor_temperature_entity){let x=o.states[e.indoor_temperature_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(S=a(parseFloat(x.state))+"\xB0")}let k="--";if(e.indoor_humidity_entity){let x=o.states[e.indoor_humidity_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(k=se(Math.round(parseFloat(x.state)),o)+"%")}let T;if(e.sun_entity){let x=o.states[e.sun_entity];x&&(T={sunrise:x.attributes.next_rising||null,sunset:x.attributes.next_setting||null,dawn:x.attributes.next_dawn||null,dusk:x.attributes.next_dusk||null,noon:x.attributes.next_noon||null,elevation:x.attributes.elevation??null,aboveHorizon:x.state==="above_horizon"})}return{temperature:r,weatherCondition:s,location:c,humidity:d,windSpeed:h,windSpeedValue:m,windBearing:f,pressure:v,pressureValue:b,feelsLike:w,indoorTemperature:S,indoorHumidity:k,sun:T}}var nc={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota"}};function de(o){return o?.locale?.language||o?.language||"en"}function Rt(o){return`${de(o)}|${o?.locale?.time_format??""}|${di(o)??""}`}function di(o){if(o?.locale?.time_zone!=="server")return;let e=o.config?.time_zone;if(e)try{return new Intl.DateTimeFormat("en",{timeZone:e}),e}catch{return}}function Tt(o,e,t={}){return ac(nc,o,e,t)}function ac(o,e,t,i={}){let n=de(e).toLowerCase();return(o[n]?.[t]??o[n.split("-")[0]]?.[t]??o.en[t]).replace(/\{(\w+)\}/g,(r,s)=>i[s]??"")}function rc(o){let e=o?.locale;if(!e?.time_format)return;if(e.time_format==="12")return!0;if(e.time_format==="24")return!1;let t=e.time_format==="language"?de(o):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(t).includes("10")}catch{return}}function he(o,e){if(!o)return"--";let t=new Date(o);if(isNaN(t.getTime()))return"--";try{return ho(e,{hour:"numeric",minute:"2-digit"}).format(t)}catch{return t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function ho(o,e){let t=rc(o),i={...e,timeZone:di(o)};return t!==void 0&&(i.hourCycle=t?"h12":"h23"),new Intl.DateTimeFormat(o?de(o):void 0,i)}function uo(o,e){try{let t=ho(e,{hour:"numeric",minute:"2-digit"}).formatToParts(o),i=t.filter(a=>a.type==="dayPeriod").map(a=>a.value).join("");return{time:t.filter(a=>a.type!=="dayPeriod").map(a=>a.value).join("").trim(),period:i}}catch{return{time:o.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),period:""}}}function mo(o,e,t={weekday:"long",day:"numeric",month:"long"}){try{return new Intl.DateTimeFormat(e?de(e):void 0,{...t,timeZone:di(e)}).format(o)}catch{return o.toDateString()}}function la(o,e,t=!1){let i=e?de(e):void 0,n=t?{weekday:"short",day:"numeric",month:"short",timeZone:di(e)}:{weekday:"short",day:"numeric",timeZone:di(e)};try{let a=new Intl.DateTimeFormat(i,n);if(!t&&(i??"en").toLowerCase().startsWith("en")){let r=a.formatToParts(o),s=r.find(l=>l.type==="weekday")?.value??"",c=r.find(l=>l.type==="day")?.value??"";return`${s} ${c}`.trim()}return a.format(o)}catch{return o.toDateString()}}function ca(o,e){let t=Math.round(Math.abs(o)*60),i=Math.floor(t/60),n=t%60,a=Intl.DurationFormat;if(a&&e)try{return new a(de(e),{style:"narrow"}).format(i>0?{hours:i,minutes:n}:{minutes:n})}catch{}return i>0?`${i}h ${n}m`:`${n}m`}function hi(o,e){let t=o.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return t?`${P(t[1])}<span class="${e}">${P(t[2])}</span>`:P(o)}function da(o){return o&&typeof o=="object"&&typeof o.action=="string"?o:void 0}function ze(o,e){return{entity:e,tap_action:da(o?.tap_action),hold_action:da(o?.hold_action),double_tap_action:da(o?.double_tap_action)}}function Re(o){return!!o&&o.action!=="none"}function po(o){return o.tap_action?Re(o.tap_action):!!o.entity}function ui(o,e,t,i={}){let n=e[`${t}_action`],a=n&&Object.prototype.hasOwnProperty.call(i,n.action)?i[n.action]:void 0;if(a){a(t);return}if(t==="tap"&&!n){e.entity&&o.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.entity},bubbles:!0,composed:!0}));return}Re(n)&&o.dispatchEvent(new CustomEvent("hass-action",{detail:{config:e,action:t},bubbles:!0,composed:!0}))}function Ne(o,e,t,i={}){if(o.dataset.actionsBound)return;o.dataset.actionsBound="1";let n=null,a=!1,r,s,c=()=>{clearTimeout(r),r=void 0},l=()=>{n=null,c()},d=()=>{Re(t().double_tap_action)?s?(clearTimeout(s),s=void 0,ui(e,t(),"double_tap",i)):s=setTimeout(()=>{s=void 0,ui(e,t(),"tap",i)},250):ui(e,t(),"tap",i)};o.addEventListener("pointerdown",h=>{h.button===0&&(n={x:h.clientX,y:h.clientY},a=!1,c(),Re(t().hold_action)&&(r=setTimeout(()=>{r=void 0,a=!0,ui(e,t(),"hold",i)},500)))}),o.addEventListener("pointermove",h=>{n&&Math.hypot(h.clientX-n.x,h.clientY-n.y)>10&&l()}),o.addEventListener("pointerup",()=>{let h=!!n&&!a;l(),h&&d()}),o.addEventListener("pointercancel",l),o.addEventListener("pointerleave",l),o.addEventListener("keydown",h=>{h.key!=="Enter"&&h.key!==" "||!po(t())||(h.preventDefault(),ui(e,t(),"tap",i))}),o.addEventListener("contextmenu",h=>{Re(t().hold_action)&&h.preventDefault()})}function ue(o,e,t){po(e)?(o.setAttribute("role","button"),o.tabIndex=0,o.style.cursor="pointer"):(t?o.setAttribute("role",t):o.removeAttribute("role"),o.removeAttribute("tabindex"),o.style.cursor="");let i=Re(e.hold_action);o.style.userSelect=i?"none":"",o.style.setProperty("-webkit-user-select",i?"none":""),o.style.setProperty("-webkit-touch-callout",i?"none":"")}var ha=new Map;function me(o,e){let t=ha.get(o);if(t)return t;let i=new Promise((n,a)=>{let s=Array.from(document.querySelectorAll("script[src]")).find(d=>/animated-weather-card(?:\.min)?\.js/.test(d.src)),c=s?s.src.replace(/animated-weather-card(\.min)?\.js/,`${o}$1.js`):`${o}.js`,l=document.createElement("script");l.src=c,l.type="module",l.async=!0,l.onload=()=>e()?n():a(new Error(`${c} loaded but registered nothing`)),l.onerror=()=>a(new Error(`Failed to load ${c}`)),document.head.appendChild(l)});return i.catch(()=>ha.delete(o)),ha.set(o,i),i}function $e(o){return me("animated-weather-card-editor",()=>!!customElements.get(o))}var fo=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function go(o){let e=o.color_palette||"default",t=o.custom_colors||{},i="";if(e!=="theme"){let a=d=>{if(typeof d!="string"||!fo.test(d))return null;let h=d.replace("#","");h.length===3&&(h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]);let m=parseInt(h,16);return{r:m>>16&255,g:m>>8&255,b:m&255}},r=(d,h,m)=>"#"+(d<<16|h<<8|m).toString(16).padStart(6,"0"),s=(d,h)=>{let m=a(d);if(!m)return d;let p=1-h/100;return r(Math.max(0,Math.floor(m.r*p)),Math.max(0,Math.floor(m.g*p)),Math.max(0,Math.floor(m.b*p)))},c=(d,h)=>{let m=a(d);if(!m)return d;let p=h/100;return r(Math.min(255,Math.floor(m.r+(255-m.r)*p)),Math.min(255,Math.floor(m.g+(255-m.g)*p)),Math.min(255,Math.floor(m.b+(255-m.b)*p)))},l=(d,h)=>{let m=t[d];if(!m||typeof m!="string"||!fo.test(m))return;let p=c(m,12),g=s(m,22);i+=`--weather-${h}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${p} 0%, ${m} 55%, ${g} 100%); `};l("sunny_bg","sunny"),l("rainy_bg","rainy"),l("snowy_bg","snowy"),l("stormy_bg","stormy"),l("windy_bg","windy"),l("cloudy_bg","cloudy")}let n=(a,r)=>{a&&ai(a)&&(i+=r.replace(/\$\{value\}/g,a))};return n(t.text_color,"--weather-text-color: ${value} !important; "),n(t.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),n(t.rain_color,"--weather-rain-color: ${value} !important; "),n(t.snow_color,"--weather-snow-color: ${value} !important; "),i}var pa={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"};function oc(o){return ke(pa,o)===void 0?"mdi:weather-night":`mdi:moon-${o.replace(/_moon$/,"").replace(/_/g,"-")}`}function ua(o,e){let t=n=>n.startsWith("sensor.")&&ke(pa,e.states[n]?.state)!==void 0,i=e?t("sensor.moon_phase")?"sensor.moon_phase":Object.keys(e.states).find(t):"sensor.moon_phase";return i?{sun_entity:o,moon_entity:i}:{sun_entity:o}}var pe=1e3,Ji=300,sc={horizon:196,peak:34,trough:276,twilightRy:78},lc={horizon:200,peak:96,trough:262,twilightRy:44},cc=124,wo=16;function dc(o,e){if(o<1)return 1;let t=Math.max(2,Math.floor((e+wo)/(cc+wo))),i=Math.ceil(o/t);return Math.ceil(o/i)}function _o(o,e,t){let i=t-e;if(i<=0||i>=24)return 0;if(o>=e&&o<=t)return Math.sin(Math.PI*(o-e)/i);let n=((o-t)%24+24)%24;return-Math.sin(Math.PI*n/(24-i))}var en=o=>o/24*pe,bo=(o,e)=>o>=0?e.horizon-o*(e.horizon-e.peak):e.horizon-o*(e.trough-e.horizon);function hc(o,e,t){let i=[];for(let n=0;n<=240;n++){let a=n/10;i.push(`${en(a).toFixed(1)},${bo(_o(a,o,e),t).toFixed(1)}`)}return"M"+i.join(" L")}function tn(o){if(!o)return 0;let e=new Date(o);return isNaN(e.getTime())?0:e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}var uc=o=>hi(o,"st-ampm");We();var yo=Ht(Ct(Le)),mc=`
${ce("")}
    :host {
        display: block;
        height: 100%;
        --st-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
        --st-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
    }

    ha-card {
        height: 100%;
        overflow: hidden;
    }
    ha-card.sky {
        background: none;
        border-color: transparent;
    }

    .st-card {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 220px;
        padding: 20px;
        gap: 14px;
        container: st / inline-size;
        font-family: var(--st-font);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--st-text);
        --st-text: var(--primary-text-color);
        --st-secondary: var(--secondary-text-color);
        --st-secondary-opacity: 1;
        /* Theme palette: the headline time and the day's arc in the theme's
           primary color, with a faint tint of it under the arc (an amber
           fill turns muddy on dark themes), icons in its icon color, and no
           twilight glows */
        --st-path: var(--primary-color);
        --st-path-night: var(--secondary-text-color);
        --st-horizon: var(--divider-color, rgba(0, 0, 0, 0.12));
        --st-icon: var(--state-icon-color, var(--primary-color));
        --st-hero: var(--primary-color, var(--primary-text-color));
        --st-day-fill: var(--primary-color);
        --st-day-fill-opacity: 0.08;
        --st-twilight: var(--state-sun-above_horizon-color, #ffb300);
        --st-twilight-opacity: 0;
    }

    /* Colorized: the card's sky follows the sun */
    .st-card.sky {
        --st-text: ${yo};
        --st-secondary: ${yo};
        --st-secondary-opacity: ${Gi};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${Fe(Bi,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${ci.map(o=>`${o} ${Xt}s ${De}`).join(", ")};
    }

    /* \u2500\u2500 Headline: the next sunrise or sunset \u2500\u2500 */
    .st-hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-shrink: 0;
        min-width: 0;
    }
    .st-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: -0.01em;
        margin-bottom: 6px;
        opacity: 0.94;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .st-eyebrow,
    .st-metric-label {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    /* Long labels (German "Sonnenh\xF6chststand") end in an ellipsis rather
       than running into the next column; the full word is in the title */
    .st-metric-label { min-width: 0; }
    .st-metric-label > span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-eyebrow ha-icon,
    .st-metric-label ha-icon {
        --mdc-icon-size: 13px;
        /* Optical: centred on the capitals of the uppercase label */
        margin-top: -0.5px;
        flex-shrink: 0;
    }
    .st-time {
        margin: 6px 0 0 -0.04em;
        font-family: var(--st-font-display);
        font-size: 52px;
        font-weight: 250;
        line-height: 0.95;
        letter-spacing: -0.035em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }
    .st-ampm {
        font-size: 0.42em;
        font-weight: 500;
        letter-spacing: 0.02em;
        margin-left: 0.32em;
    }
    .st-countdown {
        margin-top: 6px;
        font-size: 15px;
        line-height: 20px;
        font-variant-numeric: tabular-nums;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }

    /* \u2500\u2500 Sun path \u2500\u2500 */
    .st-chart {
        position: relative;
        flex: 1 1 auto;
        min-height: 64px;
        /* The path stretches to the chart, so cap its height: the arc keeps
           the same gentle shape in a tall frame instead of becoming a peak */
        max-height: 96px;
        margin: auto -20px;
    }
    .st-chart svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .st-path-day,
    .st-path-night {
        fill: none;
        stroke-width: 2.25;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
    }
    .st-path-day { stroke: var(--st-path); }
    .st-path-night { stroke: var(--st-path-night); stroke-dasharray: 2 5; }
    .st-day-fill { fill: var(--st-day-fill); opacity: var(--st-day-fill-opacity); }
    .st-twilight { opacity: var(--st-twilight-opacity); }
    .st-horizon {
        stroke: var(--st-horizon);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
    }
    .st-now-line {
        stroke: var(--st-horizon);
        stroke-width: 1;
        stroke-dasharray: 2 4;
        vector-effect: non-scaling-stroke;
    }

    /* The sun (or the moon, when it's below the horizon) at this moment */
    .st-dot {
        position: absolute;
        width: 14px;
        height: 14px;
        margin: -7px 0 0 -7px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #ffe3a3 55%, #ffb547 100%);
        box-shadow: 0 0 10px 3px rgba(255, 200, 110, 0.55), 0 0 30px 10px rgba(255, 200, 110, 0.22);
    }
    .st-dot.below {
        width: 10px;
        height: 10px;
        margin: -5px 0 0 -5px;
        background: radial-gradient(circle at 40% 40%, #ffffff 0%, #dfe6f5 70%, #b9c3d8 100%);
        box-shadow: 0 0 10px 2px rgba(200, 214, 255, 0.35);
    }
    /* Theme palette: a flat sun in Home Assistant's sun color, like the
       weather card's. Below the horizon it takes the night path's color:
       HA's indigo for a set sun is too faint on dark themes. */
    .st-card:not(.sky) .st-dot {
        box-shadow: none;
        background: var(--state-sun-above_horizon-color, #ffc107);
    }
    .st-card:not(.sky) .st-dot.below {
        background: var(--st-path-night);
    }
    .st-card:not(.sky) .st-eyebrow ha-icon,
    .st-card:not(.sky) .st-metric-label ha-icon {
        color: var(--st-icon);
    }
    /* The headline time is the tracker's hero, like the weather card's temperature */
    .st-card:not(.sky) .st-time {
        color: var(--st-hero);
    }

    /* \u2500\u2500 Facts \u2500\u2500 */
    .st-metrics {
        position: relative;
        display: grid;
        /* The column count comes from _fit (detailColumns) */
        grid-template-columns: repeat(var(--st-cols, 2), minmax(0, 1fr));
        gap: 14px 16px;
        padding-top: 14px;
        flex-shrink: 0;
    }
    .st-metrics::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
    }
    .st-card:not(.sky) .st-metrics::before {
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        opacity: 1;
    }
    .st-metric {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    .st-metric-value {
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        letter-spacing: -0.012em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-metric-value .st-ampm { font-size: 0.7em; margin-left: 0.24em; }
    /* Moon phase names are long; let them wrap rather than truncate */
    .st-metric-value.wrap {
        white-space: normal;
        text-wrap: balance;
    }

    /* Fit to the frame, stepped down until nothing overflows (see _fit) */
    .st-card[data-fit="compact"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="compact"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-countdown,
    .st-card[data-fit="tight"] .st-countdown,
    .st-card[data-fit="tight"] .st-metrics { display: none; }
    .st-card[data-fit="short"] .st-time,
    .st-card[data-fit="tight"] .st-time { font-size: 40px; }
    .st-card[data-fit="short"],
    .st-card[data-fit="tight"] { gap: 10px; }
    .st-card[data-fit="short"] .st-chart,
    .st-card[data-fit="tight"] .st-chart { min-height: 44px; }

    @container st (max-width: 299px) {
        .st-time { font-size: 44px; }
        .st-metric-value { font-size: 16px; }
    }
    @container st (min-width: 460px) {
        .st-time { font-size: 60px; }
        .st-metric-value { font-size: 18px; line-height: 24px; }
    }

    /* \u2500\u2500 Compact: the next sunrise or sunset beside the sun's day \u2500\u2500
       One line, built to sit under a weather card: same left edge and
       label style, the time a quiet step down from the temperature. */
    .st-card.compact {
        flex-direction: row;
        align-items: center;
        gap: 20px;
        min-height: 0;
        padding: 16px 20px;
    }
    /* Under a weather card the real sun is just above, so no second light
       source: the sky's gradient and scrim only */
    .st-card.sky.compact {
        /* From the sky's mid tone down: under a weather card it reads as
           the lower sky, not a brighter strip below a darker card */
        background:
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-mid) 0%, var(--awc-sky-bottom) 100%);
        --st-twilight-opacity: 0.3;
    }
    .st-card.compact .st-hero { flex: 0 0 auto; }
    .st-card.compact .st-time { font-size: 34px; margin-top: 5px; }
    .st-card.compact .st-countdown { margin-top: 5px; font-size: 13px; line-height: 18px; }
    .st-card.compact .st-chart {
        flex: 1 1 auto;
        align-self: stretch;
        max-height: none;
        /* Full height of the card, out to its right edge */
        margin: -16px -20px -16px 0;
        /* The path fades in beside the headline instead of starting at a hard edge */
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 36px);
        mask-image: linear-gradient(90deg, transparent 0, #000 36px);
    }
    .st-card.compact[data-fit] .st-chart { min-height: 0; }
    /* The other event, small, in the open sky at the top-right */
    .st-chart-note {
        position: absolute;
        top: 14px;
        right: 20px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    .st-chart-note .st-chart-note-time {
        margin-left: 4px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        font-variant-numeric: tabular-nums;
    }
    .st-chart-note .st-ampm { font-size: 1em; margin-left: 0.2em; font-weight: 500; }
    @container st (max-width: 419px) {
        .st-chart-note { display: none; }
    }
    /* Short frames (a one-row section): the countdown goes, then the label */
    .st-card.compact[data-fit="short"],
    .st-card.compact[data-fit="tight"] { gap: 16px; }
    .st-card.compact[data-fit="short"] .st-time,
    .st-card.compact[data-fit="tight"] .st-time { font-size: 28px; }
    .st-card.compact[data-fit="tight"] .st-eyebrow { display: none; }
    .st-card.compact[data-fit="tight"] { padding-block: 12px; }
    .st-card.compact[data-fit="tight"] .st-chart { margin-block: -12px; }
    .st-card.compact[data-fit="tight"] .st-time { margin-top: 0; }

    .st-no-data {
        margin: auto;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
`,ma=class extends HTMLElement{constructor(){super();this.config={};this._shadow=this.attachShadow({mode:"open"})}setConfig(t){if(!t.sun_entity)throw new Error("Please define a sun_entity (e.g. sun.sun)");this.config={...t},this._render()}set hass(t){let i=this.config.sun_entity||"",n=this.config.moon_entity||"",a=this._hass?.states[i],r=t.states[i],s=this._hass?.states[n]?.state,c=t.states[n]?.state,l=Rt(this._hass)!==Rt(t),d=this.config.weather_entity||"",h=d&&this._hass?.states[d]?.state!==t.states[d]?.state;this._hass=t;let m=a?.attributes?.elevation,p=r?.attributes?.elevation;(!a||a.state!==r?.state||a.attributes?.next_rising!==r?.attributes?.next_rising||a.attributes?.next_setting!==r?.attributes?.next_setting||Math.abs((m||0)-(p||0))>=.5||n&&s!==c||l||h)&&this._render()}connectedCallback(){this._clock||(this._clock=setInterval(()=>this._render(),6e4)),!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._fit()),this._resizeObserver.observe(this))}disconnectedCallback(){this._clock&&clearInterval(this._clock),this._clock=void 0,this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_fit(){let t=this._shadow.querySelector(".st-card");if(!t)return;let i=t.querySelector(".st-metrics");for(let n of["regular","compact","short","tight"]){if(t.dataset.fit=n,i){let a=Array.from(i.children).filter(r=>getComputedStyle(r).display!=="none").length;i.style.setProperty("--st-cols",String(dc(a,i.clientWidth)))}if(t.scrollHeight<=t.clientHeight+1)return}}_actions(){return ze(this.config,this.config.sun_entity)}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}_skyCondition(t){let i=this.config.weather_entity,n=i?this._hass?.states[i]?.state:void 0;if(n&&n!=="unavailable"&&n!=="unknown"){let a=Ae(n,!1,void 0,void 0,this._hass?.config?.time_zone);if(li.includes(a))return a}return t==="night"?"clear-night":"sunny"}static async getConfigElement(){return customElements.get("animated-sun-tracker-editor")||await $e("animated-sun-tracker-editor"),document.createElement("animated-sun-tracker-editor")}static getStubConfig(t,i=[],n=[]){let a=[...i,...n,...Object.keys(t?.states??{})];return ua(a.find(r=>r.startsWith("sun."))??"sun.sun",t)}_getSunData(){if(!this._hass||!this.config.sun_entity)return null;let t=this._hass.states[this.config.sun_entity];return t?{sunrise:t.attributes.next_rising||null,sunset:t.attributes.next_setting||null,dawn:t.attributes.next_dawn||null,dusk:t.attributes.next_dusk||null,noon:t.attributes.next_noon||null,elevation:typeof t.attributes.elevation=="number"?t.attributes.elevation:null,aboveHorizon:t.state==="above_horizon",rising:!!t.attributes.rising}:null}_getMoonData(){if(!this._hass||!this.config.moon_entity)return null;let t=this._hass.states[this.config.moon_entity];if(!t)return null;let i=t.state,n;try{n=this._hass.formatEntityState?.(t)}catch{}return{phase:i,phaseName:(n&&n!==i?n:void 0)||ke(pa,i)||i.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase()),icon:oc(i)}}_render(){let t=this._getSunData(),i=this._getMoonData(),n=this.config.color_palette!=="theme";if(!t||!t.sunrise||!t.sunset){this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let a=new Date,r=a.getHours()+a.getMinutes()/60,s=tn(t.sunrise),c=tn(t.sunset),l=t.dawn?tn(t.dawn):Math.max(0,s-.5),d=t.dusk?tn(t.dusk):Math.min(24,c+.5),h=c-s,m=t.aboveHorizon,p=m?t.sunset:t.sunrise,g=new Date(p).getTime()-a.getTime(),u=this._hass,f=st=>P(Tt(u,st)),y=st=>uc(he(st,u)),_=g>0?Tt(u,"in_duration",{duration:ca(g/36e5,u)}):"",v=Oe(t.elevation,t.rising,t.aboveHorizon),b=le(this._skyCondition(v),v),w=n?{"--awc-sky-top":b.top,"--awc-sky-mid":b.mid,"--awc-sky-bottom":b.bottom,"--awc-sky-glow":b.glow,"--awc-sky-scrim":b.scrim}:null,C=this.config.compact?lc:sc,S=hc(s,c,C),k=`${S} L${pe},${C.horizon} L0,${C.horizon} Z`,T=_o(r,s,c),x=r/24*100,E=bo(T,C)/Ji*100,M=(st,pt)=>{let bt=Math.max(70,Math.abs(pt)/24*pe*2.4);return`<ellipse cx="${en(st).toFixed(1)}" cy="${C.horizon}" rx="${bt.toFixed(1)}" ry="${C.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},L=!!this.config.compact,D=this.config.show_header!==!1,H=D?`
            <div class="st-hero">
                ${this.config.title&&!L?`<div class="st-title">${P(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    <ha-icon icon="${m?"mdi:weather-sunset-down":"mdi:weather-sunset-up"}"></ha-icon>
                    <span>${f(m?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${y(p)}</div>
                ${_?`<div class="st-countdown">${P(_)}</div>`:""}
            </div>`:this.config.title&&!L?`<div class="st-hero"><div class="st-title">${P(this.config.title)}</div></div>`:"",W=(st,pt,bt,Ao,Eo=!1)=>`
                <div class="st-metric" data-kind="${P(st)}">
                    <div class="st-metric-label"><ha-icon icon="${P(pt)}"></ha-icon><span title="${P(bt)}">${P(bt)}</span></div>
                    <div class="st-metric-value${Eo?" wrap":""}">${Ao}</div>
                </div>`,R=!L&&this.config.show_details!==!1,V=L&&D?`
                        <div class="st-chart-note">${f(m?"sunrise":"sunset")}<span class="st-chart-note-time">${y(m?t.sunrise:t.sunset)}</span></div>`:"",_t=R?`
            <div class="st-metrics">
                ${m?W("sunrise","mdi:weather-sunset-up",f("sunrise"),y(t.sunrise)):W("sunset","mdi:weather-sunset-down",f("sunset"),y(t.sunset))}
                ${W("noon","mdi:white-balance-sunny",f("solar_noon"),y(t.noon))}
                ${W("daylight","mdi:timer-sand",f("daylight"),P(ca(h,u)))}
                ${W("first-light","mdi:weather-sunset",f("first_light"),y(t.dawn))}
                ${W("last-light","mdi:weather-night",f("last_light"),y(t.dusk))}
                ${i?W("moon",i.icon,f("moon"),P(i.phaseName),!0):""}
            </div>`:"",$=this.config.sun_entity?u?.states[this.config.sun_entity]:void 0,Z="";try{Z=$&&u?.formatEntityState?.($)||""}catch{}let j=[`${Tt(u,"sunrise")} ${he(t.sunrise,u)}`,`${Tt(u,"sunset")} ${he(t.sunset,u)}`,Z].filter(Boolean).join(" \xB7 ");this._mount(`
                    ${H}
                    <div class="st-chart" role="img" aria-label="${P(j)}">
                        <svg viewBox="0 0 ${pe} ${Ji}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${pe}" height="${C.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${C.horizon}" width="${pe}" height="${Ji-C.horizon}"/></clipPath>
                            </defs>
                            ${M(s,s-l)}
                            ${M(c,d-c)}
                            <path d="${k}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${C.horizon}" x2="${pe}" y2="${C.horizon}" class="st-horizon"/>
                            <line x1="${en(r).toFixed(1)}" y1="0" x2="${en(r).toFixed(1)}" y2="${Ji}" class="st-now-line"/>
                            <path d="${S}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${S}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${T<0?"below":""}" style="left: ${x.toFixed(2)}%; top: ${E.toFixed(2)}%;"></div>${V}
                    </div>
                    ${_t}`,w)}_mount(t,i){let n=this._shadow.querySelector(".st-card");n||(this._shadow.innerHTML=`<style>${mc}</style><ha-card><div class="st-card"></div></ha-card>`,n=this._shadow.querySelector(".st-card"),Ne(n.parentElement,this,()=>this._actions())),ue(n.parentElement,this._actions());let a=!!i;n.classList.toggle("sky",a),n.classList.toggle("compact",!!this.config.compact),n.parentElement?.classList.toggle("sky",a);for(let r of ci)i?n.style.setProperty(r,i[r]):n.style.removeProperty(r);n.innerHTML=t,this._fit()}};customElements.define("animated-sun-tracker-card",ma);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,e)=>e.startsWith("sun.")?[{label:"Regular",config:{type:"custom:animated-sun-tracker-card",...ua(e,o)}},{label:"Compact",config:{type:"custom:animated-sun-tracker-card",...ua(e,o),compact:!0}}]:null});function fa(o){let e=Number(o?.attributes?.supported_features);if(!isFinite(e))return["hourly","daily"];let t=[];return e&2&&t.push("hourly"),e&4&&t.push("twice_daily"),e&1&&t.push("daily"),t}function vo(o){let e=fa(o);return e.includes("daily")?"daily":e.includes("twice_daily")?"twice_daily":null}var pc=5e3;function fc(){let o=new WeakMap;return{subscribe(e,t,i,n){let a=o.get(e);a||o.set(e,a=new Map);let r=`${t}|${i}`,s=a.get(r);if(!s){let l={listeners:new Set};s=l,a.set(r,l);let d=h=>{l.last=h;for(let m of[...l.listeners])m(h)};l.unsubscribe=e.subscribeMessage(h=>d({type:h?.type??i,forecast:Array.isArray(h?.forecast)?h.forecast:null}),{type:"weather/subscribe_forecast",entity_id:t,forecast_type:i}).catch(()=>{a.get(r)===l&&a.delete(r),d({type:i,forecast:null,failed:!0})})}let c=s;return clearTimeout(c.closing),c.closing=void 0,c.listeners.add(n),c.last&&n(c.last),()=>{!c.listeners.delete(n)||c.listeners.size||(c.closing=setTimeout(()=>{c.listeners.size||(a.get(r)===c&&a.delete(r),c.unsubscribe?.then(l=>{typeof l=="function"&&l()}).catch(()=>{}))},pc))}}}}function gc(){return window.AnimatedWeatherCardForecasts??(window.AnimatedWeatherCardForecasts=fc())}function xo(o,e,t,i){return o?.connection?.subscribeMessage?gc().subscribe(o.connection,e,t,i):()=>{}}var Ie=class{constructor(e){this.changed=e;this.hourly=null;this.daily=null;this.dailyType=null;this.settled=!1;this.stops=[];this.pending=new Set}sync(e,t,i){let n=t?e?.states[t]:void 0,a=fa(n),r=i.hourly&&a.includes("hourly"),s=i.daily?vo(n):null,c=`${t}|${r}|${s}`;if(!e?.connection||!t||!n){this.key&&this.stop();return}if(c===this.key&&this.connection===e.connection)return;this.stop(),this.key=c,this.connection=e.connection,this.dailyType=s,this.pending=new Set([r?"hourly":"",s??""].filter(Boolean)),this.settled=this.pending.size===0;let l=(d,h)=>{this.stops.push(xo(e,t,d,m=>{m.failed||h(m.forecast),this.pending.delete(d),this.settled=this.pending.size===0,this.changed()}))};r&&l("hourly",d=>{this.hourly=d}),s&&l(s,d=>{this.daily=d}),this.settled&&this.changed()}stop(){for(let e of this.stops)e();this.stops=[],this.key=void 0,this.connection=void 0,this.hourly=null,this.daily=null,this.dailyType=null,this.settled=!1}};var Ge=class{constructor(e){this.tick=e;this.running=!1}start(){this.running||(this.running=!0,this.tick(),this.arm())}stop(){this.running=!1,clearTimeout(this.timer),this.timer=void 0}get isRunning(){return this.running}arm(){clearTimeout(this.timer);let e=6e4-Date.now()%6e4+20;this.timer=setTimeout(()=>{this.running&&(this.tick(),this.arm())},e)}};We();function mi(){return me("animated-weather-card-forecast",()=>!!window.AnimatedWeatherCardForecast)}var wc=`
${ce("")}
    :host { display: block; height: 100%; }
    ha-card { height: 100%; overflow: hidden; }
    ha-card.sky { background: none; border-color: transparent; }
`;function ga(o,e){return e?.states["sun.sun"]?{entity:o,sun_entity:"sun.sun"}:{entity:o}}var wa=class extends HTMLElement{constructor(){super();this.config={};this.feed=new Ie(()=>this.render());this.ticker=new Ge(()=>this.render());this.root=this.attachShadow({mode:"open"})}setConfig(t){if(!t.entity)throw new Error("Please define a weather entity (entity: weather.home)");this.config={...t},this.isConnected&&t.show_clock?this.ticker.start():this.ticker.stop(),this.syncFeed(),this.render()}set hass(t){let i=this._hass;this._hass=t,this.syncFeed();let n=this.config.entity??"",a=this.config.sun_entity||"sun.sun";(!i||i.states[n]!==t.states[n]||i.states[a]?.state!==t.states[a]?.state||Math.abs((i.states[a]?.attributes?.elevation??0)-(t.states[a]?.attributes?.elevation??0))>=.5||Rt(i)!==Rt(t))&&this.render()}get hass(){return this._hass}connectedCallback(){this.syncFeed(),this.hourTimer??(this.hourTimer=setInterval(()=>this.render(),5*6e4)),this.config.show_clock&&this.ticker.start(),!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>this.fit()),this.resizeObserver.observe(this)),this.render()}disconnectedCallback(){this.feed.stop(),clearInterval(this.hourTimer),this.hourTimer=void 0,this.ticker.stop(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.closePopup?.()}wantsHours(){return this.config.forecast!=="daily"}wantsDays(){return this.config.forecast==="daily"||this.config.forecast==="both"||!this.config.compact}syncFeed(){this.isConnected&&this.feed.sync(this._hass,this.config.entity,{hourly:this.wantsHours(),daily:this.wantsDays()})}sky(){let t=this._hass?.states[this.config.sun_entity||"sun.sun"],i=t?.attributes?.elevation,n=t?Oe(typeof i=="number"?i:Number(i),!!t.attributes?.rising,t.state!=="below_horizon"):"day",a=this.config.entity?this._hass?.states[this.config.entity]?.state:void 0,r=n==="night"?"clear-night":"sunny";if(a&&a!=="unavailable"&&a!=="unknown"){let s=Ae(a,!1,void 0,void 0,this._hass?.config?.time_zone);li.includes(s)&&(r=s)}return{condition:r,phase:n}}context(){let t=this.config.entity?this._hass?.states[this.config.entity]:void 0,{condition:i,phase:n}=this.sky(),a=Number(t?.attributes?.temperature);return{hass:this._hass,entityId:this.config.entity??"",hourly:this.feed.hourly,daily:this.feed.daily,dailyType:this.feed.dailyType,current:isFinite(a)?a:void 0,unit:String(t?.attributes?.temperature_unit??this._hass?.config?.unit_system?.temperature??"\xB0"),now:Date.now(),condition:i,phase:n,theme:this.config.color_palette==="theme",width:this.root.querySelector(".fc-card")?.clientWidth??0,show:this.config.forecast??(this.config.compact?"hourly":"both"),variant:this.config.review_card,compact:!!this.config.compact,clock:!!this.config.show_clock}}actions(){return ze(this.config,this.config.entity)}actionsWithDefault(){let t=this.actions();return t.tap_action?t:{...t,tap_action:{action:"forecast"}}}openForecast(){let t=window.AnimatedWeatherCardForecast;if(!t){mi().then(()=>this.openForecast()).catch(a=>console.warn(`Animated Weather Card: ${a.message}`));return}this.closePopup?.();let i=this.root.querySelector("ha-card"),n=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;this.closePopup=t.openPopup({...this.context(),variant:this.config.review_popup,returnFocus:i,note:null,still:n,openMoreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config.entity},bubbles:!0,composed:!0}))})}render(){if(!this.config.entity)return;let t=this.root.querySelector(".fc-card");t||(this.root.innerHTML=`<style>${wc}</style><style class="fc-views"></style><ha-card><div class="fc-card"></div></ha-card>`,t=this.root.querySelector(".fc-card"),Ne(t.parentElement,this,()=>this.actionsWithDefault(),{forecast:()=>this.openForecast()})),ue(t.parentElement,this.actionsWithDefault());let i=this.context(),n=!i.theme;t.classList.toggle("sky",n),t.classList.toggle("compact",i.compact),t.parentElement?.classList.toggle("sky",n),t.dataset.variant=i.variant??"",t.classList.toggle("fc-skies",i.variant==="b");let a=le(i.condition,i.phase),r={"--awc-sky-top":a.top,"--awc-sky-mid":a.mid,"--awc-sky-bottom":a.bottom,"--awc-sky-glow":a.glow,"--awc-sky-scrim":a.scrim};for(let l of ci)n?t.style.setProperty(l,r[l]):t.style.removeProperty(l);t.dataset.phase=i.phase,t.dataset.condition=i.condition;let s=window.AnimatedWeatherCardForecast;if(!s){t.setAttribute("aria-busy","true"),mi().then(()=>this.render()).catch(l=>{console.warn(`Animated Weather Card: ${l.message}`),t.innerHTML=`<div class="fc-empty">${P(l.message)}</div>`});return}t.removeAttribute("aria-busy");let c=this.root.querySelector(".fc-views");c.textContent!==s.cardCss&&(c.textContent=s.cardCss),t.innerHTML=s.renderCard(i),this.fit()}fit(){let t=this.root.querySelector(".fc-card");if(!t)return;let i=t.firstElementChild,n=(i?.dataset.fitSteps??"regular").split(" "),a=()=>t.scrollHeight>t.clientHeight+1||t.scrollWidth>t.clientWidth+1||!!i&&i.scrollHeight>i.clientHeight+1;for(let r of n)if(t.dataset.fit=r.replace(/,/g," "),!a())break;window.AnimatedWeatherCardForecast?.fit(t)}getCardSize(){return this.config.compact?2:this.gridRows()}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:this.gridRows(),min_columns:6,min_rows:2}}gridRows(){let t=this.config.forecast??"both";return(this.config.review_card==="b"?t==="both"?5:3:this.config.review_card==="c"?6:5)+(this.config.show_clock?3:0)}static async getConfigElement(){return customElements.get("animated-forecast-card-editor")||await $e("animated-forecast-card-editor"),document.createElement("animated-forecast-card-editor")}static getStubConfig(t,i=[],n=[]){let a=[...i,...n,...Object.keys(t?.states??{})];return ga(a.find(r=>r.startsWith("weather."))??"weather.forecast_home",t)}};customElements.define("animated-forecast-card",wa);window.customCards=window.customCards||[];window.customCards.push({type:"animated-forecast-card",name:"Animated Forecast",description:"The next hours or days of a weather entity, in its sky",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,e)=>e.startsWith("weather.")?[{label:"Forecast",config:{type:"custom:animated-forecast-card",...ga(e,o)}},{label:"Forecast strip",config:{type:"custom:animated-forecast-card",...ga(e,o),compact:!0}}]:null});We();var So=o=>`Wind from ${Math.round(o)}\xB0`,To=o=>o==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",ya=o=>o?"mdi:weather-sunset-down":"mdi:weather-sunset-up",yc=18,_c=450,bc=1600;function _a(o,e){return e?.states["sun.sun"]?{entity:o,sun_entity:"sun.sun"}:{entity:o}}var vc=400,Co=120,ko=220,xc=24,Sc=.43,Tc=.55,Cc=.65;window.AnimatedWeatherCardGsap=jn;var kc=["regular","compact","short","tight","minimal"],Ac=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...kc.map(o=>[o,"none"])];function Ec(o,e,t,i=!1){let n=[],a=(c,l,d,h=!0,m)=>n.push({height:c,note:l,forecast:d,clock:h?"on":"off",...m?{range:m}:{}}),r=e?.full??"none",s=e?.trims[e.trims.length-1]??r;if(o)for(let[c,l]of Ac.slice(0,4))a(c,l,r);a("regular","none",r);for(let c of e?.trims??[])a("regular","none",c);return a("compact","none",s),a("short","none",s),e?.first&&a("short","none",e.first),e?.short?(a("compact","none",e.short),a("short","none",e.short),a("tight","none",e.short)):a("tight","none",e?.first??s),e&&a("tight","none","none"),t&&a("tight","none","none",!1),i&&a("tight","none","none",!1,"none"),a("minimal","none","none",!1,i?"none":void 0),n}var ba=class extends HTMLElement{constructor(){super(...arguments);this._initialRender=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this._needsAnimationRestart=!1;this.currentWindSpeedValue=10;this.devTimeOverride=!1;this._animationGeneration=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new Zi;this.writtenNote=null;this.noteComing=!1;this.minuteTicker=new Ge(()=>this.onMinute());this.forecastHour=-1;this.forecastHtml="";this.forecastWidth=0;this.clockReadAt=0;this.forecastFeed=new Ie(()=>this.updateForecast())}static getStubConfig(t,i=[],n=[]){let a=[...i,...n,...Object.keys(t?.states??{})];return _a(a.find(r=>r.startsWith("weather."))??kr.entity,t)}actionsConfig(){return this.config?.dev_mode?{}:ze(this.config,this.config?.entity)}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entity&&!t.dev_mode)throw new Error("You need to define an entity or enable dev mode");let i=r=>r===void 0||typeof r=="number"&&isFinite(r)&&r>=0&&r<=23;if(!i(t.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${t.sunrise_hour})`);if(!i(t.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${t.sunset_hour})`);let n=this.config?.auto_pause;this.config?.flights_entity!==t.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0),this.config=t;let a=this.querySelector(".weather-info");if(a&&ue(a,this.actionsConfig(),"group"),this.isConnected){this.initializeTimeOfDayManager();let r=this.animationController;this._animationGeneration++,this.animationController=new He(this,this.config,()=>this.animationsPaused,this.timeOfDayManager),r&&r.stopAllAnimations().catch(s=>A(this.config?.dev_mode,"Error stopping previous animation controller:",s))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&(this.syncForecast(),this.syncMinuteTicker()),this.isConnected&&!!t.auto_pause!=!!n&&(this.removeVisibilityTracking(),this.setupVisibilityTracking())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>{let i=this.querySelector(".awc-forecast");i&&Math.abs(i.clientWidth-this.forecastWidth)>8?this.updateForecast():i&&window.AnimatedWeatherCardForecast?.fit(i),this.applySizeState(),this.devPanel?.isOpen&&this.devPanel.dock()}),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this._initialRender&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=new He(this,this.config,()=>this.animationsPaused,this.timeOfDayManager))),this.attachEventListeners(),this.setupVisibilityTracking(),this._updateDataInPlace(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=new He(this,this.config,()=>this.animationsPaused,this.timeOfDayManager)),this._initialRender=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let i=this.querySelector(".animated-weather-card");i&&(i.classList.remove("no-transitions"),i.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass&&!this.config.dev_mode)return;Jn(this),this.stopPlanes();let t=this.config.color_palette||"default",i;try{i=sa(this.hass,this.config,this.currentDevCondition)}catch(L){let D=L?.message||"Error loading weather data";this.innerHTML=`
              <ha-card>
                <div class="awc-empty-state" role="status">
                  <ha-icon class="awc-empty-icon" icon="mdi:weather-cloudy-alert"></ha-icon>
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${P(D)}</div>
                  <div class="awc-empty-hint">Open the card editor to choose a weather entity.</div>
                </div>
                <style>
                  .awc-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 32px 16px;
                    text-align: center;
                    color: var(--primary-text-color, #333);
                  }
                  .awc-empty-icon {
                    --mdc-icon-size: 48px;
                    color: var(--secondary-text-color, #888);
                  }
                  .awc-empty-title {
                    font-size: 1.1rem;
                    font-weight: 500;
                  }
                  .awc-empty-message {
                    font-size: 0.9rem;
                    color: var(--secondary-text-color, #888);
                  }
                  .awc-empty-hint {
                    font-size: 0.85rem;
                    color: var(--secondary-text-color, #888);
                    opacity: 0.8;
                  }
                </style>
              </ha-card>
            `;return}let{temperature:n,weatherCondition:a,location:r,humidity:s,windSpeed:c,windSpeedValue:l,windBearing:d,pressure:h,pressureValue:m,feelsLike:p,indoorTemperature:g,indoorHumidity:u,sun:f}=i,y=this.updatePressureTrend(m);this.currentWindSpeedValue=l;let _=f?.aboveHorizon??!1,v=f?he(_?f.sunset:f.sunrise,this._hass):"--",b=this.config.show_sun!==!1&&!!f&&v!=="--",w=!!this.config.compact,C=go(this.config),S=this.config.show_attribute_icons!==!1,k=this.config.show_attribute_labels!==!1,T=(L,D,H,W,R="")=>{let V=S||k?`<div class="attribute-label">${S?`<ha-icon class="attribute-icon" icon="${D}"></ha-icon>`:""}${k?`<span>${P(H)}</span>`:""}</div>`:"";return`<div class="attribute" data-kind="${L}">${V}<div class="attribute-value"><span class="attribute-text">${W}</span>${R}</div></div>`},x=typeof d=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${d+180}deg);" aria-label="${So(d)}"></ha-icon>`:"",E=y?`<ha-icon class="pressure-trend ${y}" icon="${To(y)}" aria-label="Pressure ${y}"></ha-icon>`:"",M=this.config.show_attributes!==!1?`
              <div class="weather-attributes${k?"":" values-only"}">${[T("humidity","mdi:water-percent",Li(this._hass,"ui.card.weather.attributes.humidity","Humidity"),P(s)),T("wind","mdi:weather-windy",Li(this._hass,"ui.card.weather.attributes.wind_speed","Wind"),P(c),x),T("pressure","mdi:gauge",Li(this._hass,"ui.card.weather.attributes.air_pressure","Pressure"),P(h),E),b?T("sun",ya(_),Tt(this._hass,_?"sunset":"sunrise"),hi(v,"awc-ampm")):""].join("")}</div>`:"";this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions loading ${t==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${w?' data-variant="compact"':""} style="${P(C)}">
          <div class="sky" aria-hidden="true"></div>
          <div class="weather-skeleton" aria-hidden="true">
            <div class="skeleton-line"></div>
            <div class="skeleton-line large"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line small"></div>
          </div>
          <div class="weather-content">
            <!-- Sky-borne animation layer (decorative) -->
            <div class="animation-layer" role="presentation" aria-hidden="true">
              <div class="sun-track"><div class="sun"></div></div>
              <div class="lightning" id="lightning"></div>
              <div class="planes-layer"></div>
            </div>

            <div class="weather-info" role="group" aria-label="Current weather">
              <div class="main-weather-info">
                ${this.headlineHtml(w,r)}
                <div class="temperature" aria-live="polite"${this.highLowPlace()==="stack"?' data-hl="stack"':""}><span class="temperature-value">${P(n)}</span><span class="degree">\xB0</span>${this.highLowPlace()==="stack"?'<span class="awc-hl awc-hl-stack" hidden></span>':""}</div>
                ${this.highLowPlace()==="line"?`<div class="awc-desc-line"><div class="weather-desc" aria-live="polite">${P(a)}</div><span class="awc-hl awc-hl-line" hidden></span></div>`:`<div class="weather-desc" aria-live="polite">${P(a)}</div>`}
                ${w?`<div class="compact-meta">${P(this.compactMeta(r,p))}</div>`:`<div class="hero-meta">${this.heroMetaHtml(p,g,u)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
                ${!w&&this.clockStyle()==="a"?this.clockHtml():""}
              </div>
              ${this.forecastWants()?`<div class="awc-forecast" data-variant="${this.forecastStyle()}" data-pending></div>`:""}
              ${w?"":M}
            </div>
          </div>

          <!-- Precipitation and wind containers (decorative) -->
          <div class="animation-container rain-container" aria-hidden="true">
            <div class="rain-layer"></div>
          </div>
          <div class="animation-container snow-container" aria-hidden="true">
            <div class="snow-layer"></div>
          </div>
          <div class="animation-container sleet-container" aria-hidden="true">
            <div class="sleet-layer"></div>
          </div>
          <div class="animation-container wind-container" aria-hidden="true">
            <div class="wind-layer"></div>
          </div>
          <div class="animation-container lightning-container" aria-hidden="true">
            <div class="lightning"></div>
          </div>
          <div class="animation-container clouds-container" aria-hidden="true">
            <div class="clouds-layer"></div>
          </div>
          <div class="animation-container fog-container" aria-hidden="true"></div>
          <div class="animation-container stars-container" aria-hidden="true"></div>
          <div class="animation-container sun-container" aria-hidden="true"></div>
        </div>
      </ha-card>
      
      <style>
        ${oa()}
      </style>
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill()}applySpill(){let t=this.querySelector("ha-card");if(!t)return;let i=this.config?.spill_particles!==!1?"visible":"hidden";t.style.setProperty("overflow",i,"important");let n=()=>{let a=t.shadowRoot;if(!a)return;let r=a.querySelector("#awc-overflow");r||(r=document.createElement("style"),r.id="awc-overflow",a.appendChild(r)),r.textContent=`:host { overflow: ${i} !important; }`};n(),!t.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(n))}transitionCondition(){let t=this.querySelector(".animated-weather-card");if(!t||t.classList.contains("loading")){this.initializeAnimations();return}t.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},vc)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&!this.config.dev_mode}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let t=window.AnimatedWeatherCardNote;if(t){this.noteWriter??(this.noteWriter=new t(this)),this.noteWriter.start();return}me("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(t){this.writtenNote=t,this.updateNote()}noteWriting(t){this.noteComing!==t&&(this.noteComing=t,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let t=this.config.note_entity?so(this._hass,this.config):this.writtenNote,i=t?lo(t,this.config):null;if(!t||i===null)return t;let n=i-Date.now();return n<=0?null:(n<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),n+50)),t)}noteHtml(t){return`<p class="weather-note"${t?"":" hidden"}><span class="note-long">${P(t?.note??"")}</span><span class="note-short">${P(t?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let t=this.querySelector(".weather-note");if(!t)return;let i=t.querySelector(".note-long"),n=t.querySelector(".note-short"),a=t.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let c=t.querySelector(".note-phrase"),l=Tt(this._hass,this.noteComing==="forecast"?"note_reading":"note_writing");!a||t.hidden?(c&&(c.textContent=l),t.dataset.writing="",t.setAttribute("aria-busy","true"),t.hidden=!1,this.applySizeState()):this.fadeThrough(c,l);return}a&&(delete t.dataset.writing,t.removeAttribute("aria-busy"));let r=this.currentNote();if(!r){this.noteTyping?.finish(),(!t.hidden||a)&&(t.hidden=!0,this.applySizeState());return}if(t.hidden||a){this.noteTyping?.finish(),i&&(i.textContent=r.note),n&&(n.textContent=r.line),t.hidden=!1,this.applySizeState(),a&&this.typeIn(t);return}if(this.noteTyping){if(this.noteTyping.text===r.note+r.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(i,r.note,s),this.fadeThrough(n,r.line,s)}clockStyle(){if(!this.clockEnabled())return null;let t=this.config?.review_clock;return t==="b"||t==="c"?t:"a"}forecastStyle(){let t=this.config?.review_forecast;return t==="b"||t==="c"?t:"a"}highLowPlace(){return this.forecastWants()?this.forecastStyle()==="a"?"line":"stack":"none"}clockHtml(){return'<time class="awc-clock"><span class="awc-clock-time"></span><span class="awc-clock-period"></span><span class="awc-clock-date" aria-hidden="true"><span class="awc-date-short"></span><span class="awc-date-month"></span></span><span class="awc-visually-hidden awc-clock-spoken"></span></time>'}headlineHtml(t,i){let n=!t&&this.config?.show_location!==!1&&i?i:"",a=t?null:this.clockStyle();return a==="b"||a==="c"?`<div class="location awc-headline" data-clock="${a}">${this.clockHtml()}`+(n?`<span class="awc-headline-sep" aria-hidden="true">\xB7</span><span class="awc-headline-place">${P(n)}</span>`:"")+"</div>":n?`<div class="location">${P(n)}</div>`:""}clockEnabled(){return!!this.config?.show_clock}forecastWants(){let t=this.config?.forecast;return!t||t==="none"||this.config?.compact||this.config?.dev_mode?null:{hourly:t!=="daily",daily:!0}}syncForecast(){let t=this.forecastWants();if(!t||!this.isConnected){this.forecastFeed.stop();return}this.forecastFeed.sync(this._hass,this.config?.entity,t)}syncMinuteTicker(){this.isConnected&&!this.animationsPaused&&(this.clockEnabled()||!!this.forecastWants())?this.minuteTicker.start():this.minuteTicker.stop()}onMinute(){this.updateClock();let t=Math.floor(Date.now()/36e5);this.forecastWants()&&t!==this.forecastHour&&this.updateForecast()}updateClock(){let t=this.querySelector(".awc-clock");if(!t)return;let i=new Date,{time:n,period:a}=uo(i,this._hass),r=(c,l)=>{let d=t.querySelector(c);d&&d.textContent!==l&&(d.textContent=l)};this.setClockDigits(t.querySelector(".awc-clock-time"),n),r(".awc-clock-period",a),r(".awc-date-short",la(i,this._hass)),r(".awc-date-month",la(i,this._hass,!0)),r(".awc-clock-spoken",`${n}${a?` ${a}`:""}, ${mo(i,this._hass)}`),t.querySelector(".awc-clock-period")?.toggleAttribute("hidden",!a);let s=i.toISOString().slice(0,16);t.getAttribute("datetime")!==s&&t.setAttribute("datetime",s)}setClockDigits(t,i){if(!t||t.dataset.text===i)return;let n=t.dataset.text??"",a=Date.now()-this.clockReadAt<7e4;if(this.clockReadAt=Date.now(),t.dataset.text=i,t.setAttribute("aria-hidden","true"),!a||n.length!==i.length||this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||typeof t.animate!="function"){t.replaceChildren(...Array.from(i,s=>Object.assign(document.createElement("span"),{textContent:s})));return}Array.from(i).forEach((s,c)=>{let l=t.children[c];if(!l||l.textContent===s)return;let d=l.animate([{opacity:1},{opacity:0}],{duration:Co,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});d.onfinish=()=>{l.textContent=s,l.animate([{opacity:0},{opacity:1}],{duration:ko,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),d.cancel()},d.oncancel=()=>{l.textContent=s}})}forecastContext(t){let i=this.config?.entity?this._hass?.states[this.config.entity]:void 0,n=this.querySelector(".animated-weather-card"),a=Number(i?.attributes?.temperature);return{hass:this._hass,entityId:this.config?.entity??"",hourly:this.forecastFeed.hourly,daily:this.forecastFeed.daily,dailyType:this.forecastFeed.dailyType,current:isFinite(a)?a:void 0,unit:String(i?.attributes?.temperature_unit??this._hass?.config?.unit_system?.temperature??"\xB0"),now:Date.now(),condition:this.currentWeatherClass||"sunny",phase:n?.dataset.phase??this.currentSkyPhase(),theme:this.config?.color_palette==="theme",width:this.querySelector(".awc-forecast")?.clientWidth??0,show:this.config?.forecast==="daily"||this.config?.forecast==="both"?this.config.forecast:"hourly",variant:t}}updateForecast(){let t=this.querySelector(".awc-forecast");if(!t)return;let i=window.AnimatedWeatherCardForecast;if(!i){mi().then(()=>{this.isConnected&&this.updateForecast()}).catch(s=>console.warn(`Animated Weather Card: ${s.message}`));return}if(!this.querySelector("style.awc-forecast-css")){let s=document.createElement("style");s.className="awc-forecast-css",s.textContent=i.sectionCss,this.appendChild(s)}this.forecastHour=Math.floor(Date.now()/36e5);let n=this.forecastContext(this.config?.review_forecast);this.forecastWidth=n.width;let a=!1;for(let s of["line","stack"]){let c=this.querySelector(`.awc-hl-${s}`);if(!c)continue;let l=this.forecastFeed.settled?i.renderHighLow(n,s):"";c.innerHTML!==l&&(c.innerHTML=l,c.hidden=!l,a=!0)}let r=this.forecastFeed.settled?i.renderSection(n):"";if(t.toggleAttribute("data-pending",!this.forecastFeed.settled),r!==this.forecastHtml){!this.forecastHtml&&r&&(t.setAttribute("data-arrive",""),setTimeout(()=>t.removeAttribute("data-arrive"),400)),this.forecastHtml=r,t.innerHTML=r,t.hidden=this.forecastFeed.settled&&!r;let s=t.firstElementChild;for(let c of["full","trims","first","short"]){let l=s?.dataset[c];l!==void 0?t.dataset[c]=l:delete t.dataset[c]}a=!0}i.fit(t),a&&this.applySizeState()}openForecast(){let t=window.AnimatedWeatherCardForecast;if(!t){mi().then(()=>{this.isConnected&&this.openForecast()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}this.closePopup?.();let i=this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;this.closePopup=t.openPopup({...this.forecastContext(this.config?.review_popup),returnFocus:this.querySelector(".weather-info"),note:this.noteEnabled()?this.currentNote()?.note??null:null,still:i,openMoreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config?.entity},bubbles:!0,composed:!0}))})}compactMeta(t,i){return[this.config?.show_location!==!1?t:"",i?`${Tt(this._hass,"feels_like")} ${i}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let t=this.config?.indoor_style,i=P(Tt(this._hass,"indoors")),n='<ha-icon class="indoor-icon" icon="mdi:home-thermometer-outline"></ha-icon>';if(t==="icon")return`${n}<span class="awc-visually-hidden">${i} </span>`;let a=`<span class="indoor-label">${i}</span>`;return t==="both"?n+a:a}heroMetaHtml(t,i,n){let a=[];t&&a.push(`<span class="feels-like">${P(Tt(this._hass,"feels_like"))} ${P(t)}</span>`);let r=[i,n].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&r.length&&a.push(`<span class="indoor-climate-inline">${this.indoorLead()}${r.map(s=>P(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),a.join("")}mountDevPanel(){if(!this.config?.dev_mode){this.devPanel?.disconnect(),this.devPanel=void 0;return}let t=window.AnimatedWeatherCardDevPanel;if(t){this.devPanel??(this.devPanel=new t(this)),this.devPanel.mount();return}me("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevPanel).then(()=>{this.isConnected&&this.mountDevPanel()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}attachEventListeners(){this.mountDevPanel(),this.mountNoteWriter();let t=this.querySelector(".weather-info");if(t&&(Ne(t,this,()=>this.actionsConfig(),{forecast:()=>this.openForecast()}),ue(t,this.actionsConfig(),"group")),this.forecastHtml="",this.syncForecast(),this.syncMinuteTicker(),this.updateClock(),this.forecastWants()&&this.updateForecast(),!this.isInitializing){let i=window.setTimeout(()=>{this.initializeAnimations(),this.config?.dev_mode&&!this.currentDevCondition&&(this.currentDevCondition="sunny")},100);this.pendingTimeouts.push(i)}}setAnimationsPaused(t){this.animationsPaused=t,this.toggleAttribute("data-paused",t),this.syncMinuteTicker(),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),Fi(this)):this._needsAnimationRestart?(this._needsAnimationRestart=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),Oi(this)),this.devPanel?.updatePauseButton()}getWeatherSettings(t){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return J(this.config,t)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let t=++this._animationGeneration;try{if(!this.config)return;let i=this.config,n=this.querySelector(".animated-weather-card");if(!n)return;this.clearAnimations();let a;if(i.dev_mode)a=this.currentDevCondition||"sunny";else{if(!this.hass||!i.entity)return;let h=this.hass.states[i.entity];if(!h)return;a=h.state.toLowerCase()}let r=Ae(a,i.dev_mode??!1,i.sunrise_hour,i.sunset_hour,this._hass?.config?.time_zone),s=(i.color_palette||"default")==="theme"?"theme-colors":"",c=n.classList.contains("loading"),l=(...h)=>{n.className=["animated-weather-card",r,...h,s,c?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),c&&requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.remove("no-transitions"),n.classList.add("transitions-enabled")}))},d=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(i.animate===!1||d){l(i.animate===!1?"static":""),this.currentWeatherClass=r;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&t===this._animationGeneration){if(l(),this.animationsPaused){this.currentWeatherClass=r,this._needsAnimationRestart=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.animationController.applyWeatherCondition(r)),this.startPlanes()}},i.dev_mode?50:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),Jn(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(r=>{r.innerHTML=""});let i=this.querySelector(".animated-weather-card"),n=this.querySelector(".animation-layer");n&&(oi(this),n.querySelectorAll(".star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),n.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),i&&(Ni(i),Ir(i));let a=this.querySelector(".lightning");a&&(a.classList.remove("flash"),a.innerHTML=""),Qn(this.pendingTimeouts)}set hass(t){let i=this._hass;if(this._hass=t,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),this.syncForecast(),!i){this.render(),this.initializeAnimations();return}if(Rt(i)!==Rt(t)){this.render(),this.initializeAnimations();return}if(this.config.dev_mode||!this.config.entity)return;let n=i.states[this.config.entity],a=t.states[this.config.entity];if(!n||!a){this.render(),this.initializeAnimations();return}if(n.state!==a.state){this._updateDataInPlace(),this.transitionCondition();return}let r=!1,s=l=>l==null?"__missing__":String(l),c=["temperature","apparent_temperature","humidity","wind_speed","pressure","wind_bearing","friendly_name"];for(let l of c)if(s(n.attributes[l])!==s(a.attributes[l])){r=!0;break}if(this.config.note_entity&&i.states[this.config.note_entity]!==t.states[this.config.note_entity]&&(r=!0),!r){let l=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.humidity_sensor_entity,this.config.pressure_sensor_entity,this.config.wind_speed_sensor_entity,this.config.wind_direction_sensor_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity];for(let d of l){if(!d)continue;let h=i.states[d]?.state,m=t.states[d]?.state;if(h!==m){r=!0;break}}}if(r)this._updateDataInPlace();else{let l=this.config.sun_entity||"sun.sun";i.states[l]!==t.states[l]&&this.applySkyPhase()}}}_updateDataInPlace(){if(!this.config||!this._hass&&!this.config.dev_mode)return;let t;try{t=sa(this._hass,this.config,this.currentDevCondition)}catch{return}let{temperature:i,weatherCondition:n,humidity:a,windSpeed:r,windSpeedValue:s,windBearing:c,pressure:l,pressureValue:d,feelsLike:h,indoorTemperature:m,indoorHumidity:p,sun:g}=t;this.currentWindSpeedValue=s;let u=(b,w)=>{b&&b.textContent!==w&&(b.textContent=w)};this.fadeThrough(this.querySelector(".temperature-value"),i),this.fadeThrough(this.querySelector(".weather-desc"),n);let f=(b,w)=>{u(this.querySelector(`.weather-attributes .attribute[data-kind="${b}"] .attribute-text`),w)};f("humidity",a),f("wind",r),f("pressure",l),this.syncValueIcon("wind","wind-bearing-arrow",typeof c=="number"?{icon:"mdi:navigation",transform:`rotate(${c+180}deg)`,label:So(c)}:null);let y=this.updatePressureTrend(d);if(this.syncValueIcon("pressure","pressure-trend",y?{icon:To(y),label:`Pressure ${y}`,className:y}:null),g){let b=this.querySelector('.weather-attributes .attribute[data-kind="sun"]'),w=b?.querySelector(".attribute-text"),C=hi(he(g.aboveHorizon?g.sunset:g.sunrise,this._hass),"awc-ampm");w&&w.innerHTML!==C&&(w.innerHTML=C),u(b?.querySelector(".attribute-label > span")??null,Tt(this._hass,g.aboveHorizon?"sunset":"sunrise"));let S=b?.querySelector(".attribute-icon");S&&S.getAttribute("icon")!==ya(g.aboveHorizon)&&S.setAttribute("icon",ya(g.aboveHorizon))}let _=this.querySelector(".compact-meta");_&&u(_,this.compactMeta(t.location,h)),u(this.querySelector(".location:not(.awc-headline), .awc-headline-place"),t.location);let v=this.querySelector(".hero-meta");if(v){let b=this.heroMetaHtml(h,m,p);v.innerHTML!==b&&(v.innerHTML=b)}this.updateNote(),this.forecastWants()&&this.updateForecast(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(s)}updatePressureTrend(t){return typeof t!="number"?this._pressureTrend??null:(typeof this._lastPressureValue!="number"?this._lastPressureValue=t:Math.abs(t-this._lastPressureValue)>=.5&&(this._pressureTrend=t>this._lastPressureValue?"rising":"falling",this._lastPressureValue=t),this._pressureTrend??null)}syncValueIcon(t,i,n){let a=this.querySelector(`.weather-attributes .attribute[data-kind="${t}"] .attribute-value`);if(!a)return;let r=a.querySelector(`.${i}`);if(!n){r?.remove();return}r||(r=document.createElement("ha-icon"),a.appendChild(r)),r.className=[i,n.className].filter(Boolean).join(" "),r.getAttribute("icon")!==n.icon&&r.setAttribute("icon",n.icon),r.setAttribute("aria-label",n.label),r.style.transform=n.transform??""}typeIn(t){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let i=Array.from(t.querySelectorAll(".note-long, .note-short")).map(m=>{let p=m.textContent??"",g=document.createElement("span");g.className="note-typed";let u=document.createElement("span");return u.className="note-untyped",u.textContent=p,m.replaceChildren(g,u),{span:m,text:p,typed:g,rest:u}}),n=Math.max(0,...i.map(m=>m.text.length)),a=Math.min(bc,Math.max(_c,n*yc)),r=window.requestAnimationFrame?.bind(window)??(m=>window.setTimeout(()=>m(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),c=Date.now(),l=0,d={text:i.map(m=>m.text).join(""),finish:()=>{s(l);for(let m of i)m.span.textContent=m.text;this.noteTyping===d&&(this.noteTyping=void 0)}},h=()=>{let m=Math.min(1,(Date.now()-c)/a);for(let p of i){let g=Math.round(m*p.text.length);p.typed.textContent=p.text.slice(0,g),p.rest.textContent=p.text.slice(g)}m<1?l=r(h):d.finish()};this.noteTyping=d,l=r(h)}fadeThrough(t,i,n){if(!t)return;let a=this.heroTextPending.get(t);if((a??t.textContent)===i)return;let r=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof t.animate!="function"||r){t.textContent=i,n?.();return}if(this.heroTextPending.set(t,i),a!==void 0)return;let s=()=>{let l=this.heroTextPending.get(t);this.heroTextPending.delete(t),l!==void 0&&(t.textContent=l),n?.()},c=t.animate([{opacity:1},{opacity:0}],{duration:Co,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});c.onfinish=()=>{s(),t.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:ko,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),c.cancel()},c.oncancel=s}get hass(){return this._hass}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.config.dev_mode)return;this.planesWanted=!0;let t=window.AnimatedWeatherCardPlanes;if(!t){me("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}let i=new t(this,{intensity:1,scale:1,devMode:this.config.dev_mode||!1},this.config);this.planes=i,i.start().then(()=>{this.animationsPaused&&i.pause()}).catch(n=>{console.error("Failed to start plane fly-overs:",n),this.planes===i&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let t=this.planes;t&&(this.planes=void 0,t.destroy().catch(i=>A(this.config?.dev_mode,"Error stopping plane fly-overs:",i)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let t=this._hass?.states[this.config.flights_entity];if(t&&t===this.lastFlightsState)return;this.lastFlightsState=t;let i=this.flightTracker.update(ao(this._hass,this.config.flights_entity));i.length&&this.flyPlanes(i)}flyPlanes(t){!this.planes||this.animationsPaused||this.planes.flyOver(t,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride)?this.timeOfDayManager.getCurrentState().isNighttime:this._hass?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.wasManuallyPaused)return;let t=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;t!==this.animationsPaused&&this.setAnimationsPaused(t)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(t=>{this.offscreen=!t[t.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}disconnectedCallback(){this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.minuteTicker.stop(),this.forecastFeed.stop(),this.closePopup?.(),this.closePopup=void 0,this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.devPanel?.disconnect(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),Qn(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new Qi({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(t=>{this.onTimeOfDayChanged(t)}),this.config?.enable_day_night_cycle){let t=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(t)}}onTimeOfDayChanged(t){this.config?.enable_day_night_cycle&&(A(this.config?.dev_mode,`Time of day changed to: ${t.timePhase}`),this.updateDayNightBackground(t))}updateDayNightBackground(t){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))return this.timeOfDayManager.getCurrentState().timePhase;let t=this._hass?.states[this.config?.sun_entity||"sun.sun"];if(!t)return"day";let i=t.attributes?.elevation;return Oe(typeof i=="number"?i:Number(i),!!t.attributes?.rising,t.state!=="below_horizon")}applySkyPhase(){let t=this.querySelector(".animated-weather-card");if(!t)return;let i=this.currentSkyPhase();t.dataset.phase!==i&&(t.dataset.phase=i)}applySizeState(){let t=this.querySelector(".animated-weather-card"),i=t?.querySelector(".weather-info");if(!t||!i)return;let n=t.querySelector(".main-weather-info"),a=t.querySelector(".weather-attributes");if(t.dataset.height="regular",a){let w=t.dataset.metrics;t.dataset.metrics="row";let C=Array.from(a.children),S=parseFloat(getComputedStyle(a).columnGap)||0,k=C.reduce((E,M)=>E+M.getBoundingClientRect().width,0)+S*Math.max(0,C.length-1),T=a.clientWidth-k,x=T<-.5||w==="grid"&&T<xc;t.dataset.metrics=x?"grid":"row"}let r=t.dataset.variant==="compact",s=r?t.querySelector(".weather-desc"):null,c=t.querySelector(".weather-note"),l=t.querySelector(".awc-forecast"),d=t.querySelector(".main-weather-info > .awc-clock"),h=t.querySelector(".awc-hl-line:not([hidden])"),m=t.querySelector(".weather-desc"),p=t.clientWidth>=640;this.applyClockPlace(t,n);let g=!!c&&!c.hidden,u=l&&!l.hidden?this.forecastLevels(l):null,f=()=>!!h&&!!m&&h.offsetTop>m.offsetTop+4,y=Ec(g,u,!!d,!!h),_=w=>{t.dataset.height=w.height,g?t.dataset.note=w.note:delete t.dataset.note,u?t.dataset.forecast=w.forecast:delete t.dataset.forecast,d?t.dataset.clock=w.clock:delete t.dataset.clock,w.range?t.dataset.range=w.range:delete t.dataset.range},v=!0;if(u){_(y[0]);let w=this.getBoundingClientRect().height;_(y[y.length-1]),v=Math.abs(this.getBoundingClientRect().height-w)<1}let b=w=>i.scrollHeight>i.clientHeight+1||!r&&!!n&&n.scrollHeight>n.clientHeight+1||!!s&&s.scrollWidth>s.clientWidth+1||g&&c.scrollHeight>c.clientHeight+1||p&&!!n&&!!n.firstElementChild&&n.firstElementChild.getBoundingClientRect().top<n.getBoundingClientRect().top-1||!!u&&!p&&w.forecast!=="none"&&(v||w.height==="regular"&&w.forecast!==u.trims[u.trims.length-1]&&(w.forecast===u.full||u.trims.includes(w.forecast)))&&l.getBoundingClientRect().top-t.getBoundingClientRect().top<Sc*t.clientHeight||f()&&w.range!=="none"&&["short","snug","tight","minimal"].includes(w.height);for(let w of y)if(_(w),!b(w))return}forecastLevels(t){let i=t.dataset;return i.full?{full:i.full,trims:(i.trims??"").split(" ").filter(Boolean),first:i.first||void 0,short:i.short||void 0}:{full:"full",trims:[]}}applyClockPlace(t,i){let n=t.clientWidth<640,a=t.getBoundingClientRect().left;delete t.dataset.clockDate;let s=t.querySelector(".main-weather-info > .awc-clock")?.querySelector(".awc-clock-date");s&&n&&s.getBoundingClientRect().right-a>Tc*t.clientWidth&&(t.dataset.clockDate="none");let c=t.querySelector(".awc-headline");if(delete t.dataset.headline,c)for(let d of["time-date","time"]){if(c.scrollWidth<=c.clientWidth+1)break;t.dataset.headline=d}delete t.dataset.hlFit;let l=t.querySelector(".awc-hl-stack:not([hidden])");l&&n&&l.getBoundingClientRect().right-a>Cc*t.clientWidth&&(t.dataset.hlFit="none")}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:this.gridRows(),min_columns:6,min_rows:3}}gridRows(){let t=this.noteEnabled();return this.forecastWants()?this.config?.forecast==="both"?t?9:8:(this.forecastStyle()==="b"?5:6)+(t?1:0):this.clockEnabled()?t&&this.clockStyle()==="a"?6:5:t?5:4}getCardSize(){if(this.config?.compact)return 2;let t=3;return this.config?.show_indoor!==!1&&(t+=1),this.config?.show_attributes!==!1&&(t+=1),this.noteEnabled()&&(t+=1),this.forecastWants()?t+=this.config?.forecast==="both"?3:2:this.clockEnabled()&&(t+=1),t}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await $e("animated-weather-card-editor"),document.createElement("animated-weather-card-editor")}};customElements.define("animated-weather-card",ba);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,e)=>e.startsWith("weather.")?[{label:"Regular",config:{type:"custom:animated-weather-card",..._a(e,o)}},{label:"Compact",config:{type:"custom:animated-weather-card",..._a(e,o),compact:!0}}]:null});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let o=le("sunny","day"),e=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${Er} `,[`background: linear-gradient(90deg, ${o.top}, ${o.mid} 55%, ${o.bottom})`,`color: ${Ht(Ct(Le))}`,"border-radius: 4px 0 0 4px",...e].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${o.top}`,"border-radius: 0 4px 4px 0",...e].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.15.0
   * https://gsap.com
   *
   * Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
