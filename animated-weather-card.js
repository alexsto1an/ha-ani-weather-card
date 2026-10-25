"use strict";(()=>{function Ot(o){if(o===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return o}function cr(o,e){o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.__proto__=e}var lt={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Fe={duration:.5,overwrite:!1,delay:0},on,Z,H,_t=1e8,N=1/_t,ji=Math.PI*2,io=ji/4,no=0,hr=Math.sqrt,ro=Math.cos,ao=Math.sin,K=function(e){return typeof e=="string"},q=function(e){return typeof e=="function"},Dt=function(e){return typeof e=="number"},li=function(e){return typeof e>"u"},kt=function(e){return typeof e=="object"},st=function(e){return e!==!1},sn=function(){return typeof window<"u"},Je=function(e){return q(e)||K(e)},ur=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},tt=Array.isArray,oo=/random\([^)]+\)/g,so=/,\s*/g,ir=/(?:-?\.?\d|\.)+/gi,ln=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,ee=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Gi=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,dn=/[+-]=-?[.\d]+/,lo=/[^,'"\[\]\s]+/gi,co=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,G,Ct,Xi,cn,mt={},ni={},mr,pr=function(e){return(ni=he(e,mt))&&et},di=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},We=function(e,t){return!t&&console.warn(e)},fr=function(e,t){return e&&(mt[e]=t)&&ni&&(ni[e]=t)||mt},Re=function(){return 0},ho={suppressEvents:!0,isStart:!0,kill:!1},ti={suppressEvents:!0,kill:!1},uo={suppressEvents:!0},hn={},Ht=[],Zi={},gr,at={},Bi={},nr=30,ei=[],un="",mn=function(e){var t=e[0],i,n;if(kt(t)||q(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(n=ei.length;n--&&!ei[n].targetTest(t););i=ei[n]}for(n=e.length;n--;)e[n]&&(e[n]._gsap||(e[n]._gsap=new yn(e[n],i)))||e.splice(n,1);return e},$t=function(e){return e._gsap||mn(bt(e))[0]._gsap},pn=function(e,t,i){return(i=e[t])&&q(i)?e[t]():li(i)&&e.getAttribute&&e.getAttribute(t)||i},it=function(e,t){return(e=e.split(",")).forEach(t)||e},V=function(e){return Math.round(e*1e5)/1e5||0},I=function(e){return Math.round(e*1e7)/1e7||0},ie=function(e,t){var i=t.charAt(0),n=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+n:i==="-"?e-n:i==="*"?e*n:e/n},mo=function(e,t){for(var i=t.length,n=0;e.indexOf(t[n])<0&&++n<i;);return n<i},ri=function(){var e=Ht.length,t=Ht.slice(0),i,n;for(Zi={},Ht.length=0,i=0;i<e;i++)n=t[i],n&&n._lazy&&(n.render(n._lazy[0],n._lazy[1],!0)._lazy=0)},fn=function(e){return!!(e._initted||e._startAt||e.add)},yr=function(e,t,i,n){Ht.length&&!Z&&ri(),e.render(t,i,n||!!(Z&&t<0&&fn(e))),Ht.length&&!Z&&ri()},wr=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(lo).length<2?t:K(e)?e.trim():e},_r=function(e){return e},pt=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},po=function(e){return function(t,i){for(var n in i)n in t||n==="duration"&&e||n==="ease"||(t[n]=i[n])}},he=function(e,t){for(var i in t)e[i]=t[i];return e},rr=function o(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=kt(t[i])?o(e[i]||(e[i]={}),t[i]):t[i]);return e},ai=function(e,t){var i={},n;for(n in e)n in t||(i[n]=e[n]);return i},Oe=function(e){var t=e.parent||G,i=e.keyframes?po(tt(e.keyframes)):pt;if(st(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},fo=function(e,t){for(var i=e.length,n=i===t.length;n&&i--&&e[i]===t[i];);return i<0},br=function(e,t,i,n,r){i===void 0&&(i="_first"),n===void 0&&(n="_last");var a=e[n],s;if(r)for(s=t[r];a&&a[r]>s;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[n]=t,t._prev=a,t.parent=t._dp=e,t},ci=function(e,t,i,n){i===void 0&&(i="_first"),n===void 0&&(n="_last");var r=t._prev,a=t._next;r?r._next=a:e[i]===t&&(e[i]=a),a?a._prev=r:e[n]===t&&(e[n]=r),t._next=t._prev=t.parent=null},It=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Qt=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},go=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Qi=function(e,t,i,n){return e._startAt&&(Z?e._startAt.revert(ti):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,n))},yo=function o(e){return!e||e._ts&&o(e.parent)},ar=function(e){return e._repeat?ue(e._tTime,e=e.duration()+e._rDelay)*e:0},ue=function(e,t){var i=Math.floor(e=I(e/t));return e&&i===e?i-1:i},oi=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},hi=function(e){return e._end=I(e._start+(e._tDur/Math.abs(e._ts||e._rts||N)||0))},ui=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=I(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),hi(e),i._dirty||Qt(i,e)),e},vr=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=oi(e.rawTime(),t),(!t._dur||He(0,t.totalDuration(),i)-t._tTime>N)&&t.render(i,!0)),Qt(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-N}},At=function(e,t,i,n){return t.parent&&It(t),t._start=I((Dt(i)?i:i||e!==G?wt(e,i,t):e._time)+t._delay),t._end=I(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),br(e,t,"_first","_last",e._sort?"_start":0),Ji(t)||(e._recent=t),n||vr(e,t),e._ts<0&&ui(e,e._tTime),e},xr=function(e,t){return(mt.ScrollTrigger||di("scrollTrigger",t))&&mt.ScrollTrigger.create(t,e)},Sr=function(e,t,i,n,r){if(bn(e,t,r),!e._initted)return 1;if(!i&&e._pt&&!Z&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&gr!==ot.frame)return Ht.push(e),e._lazy=[r,n],1},wo=function o(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||o(t))},Ji=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},_o=function(e,t,i,n){var r=e.ratio,a=t<0||!t&&(!e._start&&wo(e)&&!(!e._initted&&Ji(e))||(e._ts<0||e._dp._ts<0)&&!Ji(e))?0:1,s=e._rDelay,l=0,d,c,h;if(s&&e._repeat&&(l=He(0,e._tDur,t),c=ue(l,s),e._yoyo&&c&1&&(a=1-a),c!==ue(e._tTime,s)&&(r=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==r||Z||n||e._zTime===N||!t&&e._zTime){if(!e._initted&&Sr(e,t,n,i,l))return;for(h=e._zTime,e._zTime=t||(i?N:0),i||(i=t&&!h),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,d=e._pt;d;)d.r(a,d.d),d=d._next;t<0&&Qi(e,t,i,!0),e._onUpdate&&!i&&ut(e,"onUpdate"),l&&e._repeat&&!i&&e.parent&&ut(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&It(e,1),!i&&!Z&&(ut(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},bo=function(e,t,i){var n;if(i>t)for(n=e._first;n&&n._start<=i;){if(n.data==="isPause"&&n._start>t)return n;n=n._next}else for(n=e._last;n&&n._start>=i;){if(n.data==="isPause"&&n._start<t)return n;n=n._prev}},me=function(e,t,i,n){var r=e._repeat,a=I(t)||0,s=e._tTime/e._tDur;return s&&!n&&(e._time*=a/e._dur),e._dur=a,e._tDur=r?r<0?1e10:I(a*(r+1)+e._rDelay*r):a,s>0&&!n&&ui(e,e._tTime=e._tDur*s),e.parent&&hi(e),i||Qt(e.parent,e),e},or=function(e){return e instanceof J?Qt(e):me(e,e._dur)},vo={_start:0,endTime:Re,totalDuration:Re},wt=function o(e,t,i){var n=e.labels,r=e._recent||vo,a=e.duration()>=_t?r.endTime(!1):e._dur,s,l,d;return K(t)&&(isNaN(t)||t in n)?(l=t.charAt(0),d=t.substr(-1)==="%",s=t.indexOf("="),l==="<"||l===">"?(s>=0&&(t=t.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(t.substr(1))||0)*(d?(s<0?r:i).totalDuration()/100:1)):s<0?(t in n||(n[t]=a),n[t]):(l=parseFloat(t.charAt(s-1)+t.substr(s+1)),d&&i&&(l=l/100*(tt(i)?i[0]:i).totalDuration()),s>1?o(e,t.substr(0,s-1),i)+l:a+l)):t==null?a:+t},Le=function(e,t,i){var n=Dt(t[1]),r=(n?2:1)+(e<2?0:1),a=t[r],s,l;if(n&&(a.duration=t[1]),a.parent=i,e){for(s=a,l=i;l&&!("immediateRender"in s);)s=l.vars.defaults||{},l=st(l.vars.inherit)&&l.parent;a.immediateRender=st(s.immediateRender),e<2?a.runBackwards=1:a.startAt=t[r-1]}return new Y(t[0],a,t[r+1])},Gt=function(e,t){return e||e===0?t(e):t},He=function(e,t,i){return i<e?e:i>t?t:i},Q=function(e,t){return!K(e)||!(t=co.exec(e))?"":t[1]},xo=function(e,t,i){return Gt(i,function(n){return He(e,t,n)})},tn=[].slice,Tr=function(e,t){return e&&kt(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&kt(e[0]))&&!e.nodeType&&e!==Ct},So=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(n){var r;return K(n)&&!t||Tr(n,1)?(r=i).push.apply(r,bt(n)):i.push(n)})||i},bt=function(e,t,i){return H&&!t&&H.selector?H.selector(e):K(e)&&!i&&(Xi||!pe())?tn.call((t||cn).querySelectorAll(e),0):tt(e)?So(e,i):Tr(e)?tn.call(e,0):e?[e]:[]},en=function(e){return e=bt(e)[0]||We("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return bt(t,i.querySelectorAll?i:i===e?We("Invalid scope")||cn.createElement("div"):e)}},Cr=function(e){return e.sort(function(){return .5-Math.random()})},Ar=function(e){if(q(e))return e;var t=kt(e)?e:{each:e},i=Jt(t.ease),n=t.from||0,r=parseFloat(t.base)||0,a={},s=n>0&&n<1,l=isNaN(n)||s,d=t.axis,c=n,h=n;return K(n)?c=h={center:.5,edges:.5,end:1}[n]||0:!s&&l&&(c=n[0],h=n[1]),function(m,p,g){var u=(g||t).length,f=a[u],y,w,x,_,v,A,T,b,S;if(!f){if(S=t.grid==="auto"?0:(t.grid||[1,_t])[1],!S){for(T=-_t;T<(T=g[S++].getBoundingClientRect().left)&&S<u;);S<u&&S--}for(f=a[u]=[],y=l?Math.min(S,u)*c-.5:n%S,w=S===_t?0:l?u*h/S-.5:n/S|0,T=0,b=_t,A=0;A<u;A++)x=A%S-y,_=w-(A/S|0),f[A]=v=d?Math.abs(d==="y"?_:x):hr(x*x+_*_),v>T&&(T=v),v<b&&(b=v);n==="random"&&Cr(f),f.max=T-b,f.min=b,f.v=u=(parseFloat(t.amount)||parseFloat(t.each)*(S>u?u-1:d?d==="y"?u/S:S:Math.max(S,u/S))||0)*(n==="edges"?-1:1),f.b=u<0?r-u:r,f.u=Q(t.amount||t.each)||0,i=i&&u<0?Ro(i):i}return u=(f[m]-f.min)/f.max||0,I(f.b+(i?i(u):u)*f.v)+f.u}},nn=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var n=I(Math.round(parseFloat(i)/e)*e*t);return(n-n%1)/t+(Dt(i)?0:Q(i))}},kr=function(e,t){var i=tt(e),n,r;return!i&&kt(e)&&(n=i=e.radius||_t,e.values?(e=bt(e.values),(r=!Dt(e[0]))&&(n*=n)):e=nn(e.increment)),Gt(t,i?q(e)?function(a){return r=e(a),Math.abs(r-a)<=n?r:a}:function(a){for(var s=parseFloat(r?a.x:a),l=parseFloat(r?a.y:0),d=_t,c=0,h=e.length,m,p;h--;)r?(m=e[h].x-s,p=e[h].y-l,m=m*m+p*p):m=Math.abs(e[h]-s),m<d&&(d=m,c=h);return c=!n||d<=n?e[c]:a,r||c===a||Dt(a)?c:c+Q(a)}:nn(e))},Er=function(e,t,i,n){return Gt(tt(e)?!t:i===!0?!!(i=0):!n,function(){return tt(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(n=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*n)/n})},To=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(n){return t.reduce(function(r,a){return a(r)},n)}},Co=function(e,t){return function(i){return e(parseFloat(i))+(t||Q(i))}},Ao=function(e,t,i){return Pr(e,t,0,1,i)},Mr=function(e,t,i){return Gt(i,function(n){return e[~~t(n)]})},ko=function o(e,t,i){var n=t-e;return tt(e)?Mr(e,o(0,e.length),t):Gt(i,function(r){return(n+(r-e)%n)%n+e})},Eo=function o(e,t,i){var n=t-e,r=n*2;return tt(e)?Mr(e,o(0,e.length-1),t):Gt(i,function(a){return a=(r+(a-e)%r)%r||0,e+(a>n?r-a:a)})},fe=function(e){return e.replace(oo,function(t){var i=t.indexOf("[")+1,n=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(so);return Er(i?n:+n[0],i?0:+n[1],+n[2]||1e-5)})},Pr=function(e,t,i,n,r){var a=t-e,s=n-i;return Gt(r,function(l){return i+((l-e)/a*s||0)})},Mo=function o(e,t,i,n){var r=isNaN(e+t)?0:function(p){return(1-p)*e+p*t};if(!r){var a=K(e),s={},l,d,c,h,m;if(i===!0&&(n=1)&&(i=null),a)e={p:e},t={p:t};else if(tt(e)&&!tt(t)){for(c=[],h=e.length,m=h-2,d=1;d<h;d++)c.push(o(e[d-1],e[d]));h--,r=function(g){g*=h;var u=Math.min(m,~~g);return c[u](g-u)},i=t}else n||(e=he(tt(e)?[]:{},e));if(!c){for(l in t)wn.call(s,e,l,"get",t[l]);r=function(g){return Sn(g,s)||(a?e.p:e)}}}return Gt(i,r)},sr=function(e,t,i){var n=e.labels,r=_t,a,s,l;for(a in n)s=n[a]-t,s<0==!!i&&s&&r>(s=Math.abs(s))&&(l=a,r=s);return l},ut=function(e,t,i){var n=e.vars,r=n[t],a=H,s=e._ctx,l,d,c;if(r)return l=n[t+"Params"],d=n.callbackScope||e,i&&Ht.length&&ri(),s&&(H=s),c=l?r.apply(d,l):r.call(d),H=a,c},Me=function(e){return It(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Z),e.progress()<1&&ut(e,"onInterrupt"),e},ce,Or=[],Lr=function(e){if(e)if(e=!e.name&&e.default||e,sn()||e.headless){var t=e.name,i=q(e),n=t&&!i&&e.init?function(){this._props=[]}:e,r={init:Re,render:Sn,add:wn,kill:Yo,modifier:Vo,rawVars:0},a={targetTest:0,get:0,getSetter:mi,aliases:{},register:0};if(pe(),e!==n){if(at[t])return;pt(n,pt(ai(e,r),a)),he(n.prototype,he(r,ai(e,a))),at[n.prop=t]=n,e.targetTest&&(ei.push(n),hn[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}fr(t,n),e.register&&e.register(et,n,nt)}else Or.push(e)},z=255,Pe={aqua:[0,z,z],lime:[0,z,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,z],navy:[0,0,128],white:[z,z,z],olive:[128,128,0],yellow:[z,z,0],orange:[z,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[z,0,0],pink:[z,192,203],cyan:[0,z,z],transparent:[z,z,z,0]},qi=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*z+.5|0},Dr=function(e,t,i){var n=e?Dt(e)?[e>>16,e>>8&z,e&z]:0:Pe.black,r,a,s,l,d,c,h,m,p,g;if(!n){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),Pe[e])n=Pe[e];else if(e.charAt(0)==="#"){if(e.length<6&&(r=e.charAt(1),a=e.charAt(2),s=e.charAt(3),e="#"+r+r+a+a+s+s+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return n=parseInt(e.substr(1,6),16),[n>>16,n>>8&z,n&z,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),n=[e>>16,e>>8&z,e&z]}else if(e.substr(0,3)==="hsl"){if(n=g=e.match(ir),!t)l=+n[0]%360/360,d=+n[1]/100,c=+n[2]/100,a=c<=.5?c*(d+1):c+d-c*d,r=c*2-a,n.length>3&&(n[3]*=1),n[0]=qi(l+1/3,r,a),n[1]=qi(l,r,a),n[2]=qi(l-1/3,r,a);else if(~e.indexOf("="))return n=e.match(ln),i&&n.length<4&&(n[3]=1),n}else n=e.match(ir)||Pe.transparent;n=n.map(Number)}return t&&!g&&(r=n[0]/z,a=n[1]/z,s=n[2]/z,h=Math.max(r,a,s),m=Math.min(r,a,s),c=(h+m)/2,h===m?l=d=0:(p=h-m,d=c>.5?p/(2-h-m):p/(h+m),l=h===r?(a-s)/p+(a<s?6:0):h===a?(s-r)/p+2:(r-a)/p+4,l*=60),n[0]=~~(l+.5),n[1]=~~(d*100+.5),n[2]=~~(c*100+.5)),i&&n.length<4&&(n[3]=1),n},Fr=function(e){var t=[],i=[],n=-1;return e.split(Lt).forEach(function(r){var a=r.match(ee)||[];t.push.apply(t,a),i.push(n+=a.length+1)}),t.c=i,t},lr=function(e,t,i){var n="",r=(e+n).match(Lt),a=t?"hsla(":"rgba(",s=0,l,d,c,h;if(!r)return e;if(r=r.map(function(m){return(m=Dr(m,t,1))&&a+(t?m[0]+","+m[1]+"%,"+m[2]+"%,"+m[3]:m.join(","))+")"}),i&&(c=Fr(e),l=i.c,l.join(n)!==c.c.join(n)))for(d=e.replace(Lt,"1").split(ee),h=d.length-1;s<h;s++)n+=d[s]+(~l.indexOf(s)?r.shift()||a+"0,0,0,0)":(c.length?c:r.length?r:i).shift());if(!d)for(d=e.split(Lt),h=d.length-1;s<h;s++)n+=d[s]+r[s];return n+d[h]},Lt=(function(){var o="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in Pe)o+="|"+e+"\\b";return new RegExp(o+")","gi")})(),Po=/hsl[a]?\(/,gn=function(e){var t=e.join(" "),i;if(Lt.lastIndex=0,Lt.test(t))return i=Po.test(t),e[1]=lr(e[1],i),e[0]=lr(e[0],i,Fr(e[1])),!0},ze,ot=(function(){var o=Date.now,e=500,t=33,i=o(),n=i,r=1e3/240,a=r,s=[],l,d,c,h,m,p,g=function u(f){var y=o()-n,w=f===!0,x,_,v,A;if((y>e||y<0)&&(i+=y-t),n+=y,v=n-i,x=v-a,(x>0||w)&&(A=++h.frame,m=v-h.time*1e3,h.time=v=v/1e3,a+=x+(x>=r?4:r-x),_=1),w||(l=d(u)),_)for(p=0;p<s.length;p++)s[p](v,m,A,f)};return h={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(f){return m/(1e3/(f||60))},wake:function(){mr&&(!Xi&&sn()&&(Ct=Xi=window,cn=Ct.document||{},mt.gsap=et,(Ct.gsapVersions||(Ct.gsapVersions=[])).push(et.version),pr(ni||Ct.GreenSockGlobals||!Ct.gsap&&Ct||{}),Or.forEach(Lr)),c=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&h.sleep(),d=c||function(f){return setTimeout(f,a-h.time*1e3+1|0)},ze=1,g(2))},sleep:function(){(c?cancelAnimationFrame:clearTimeout)(l),ze=0,d=Re},lagSmoothing:function(f,y){e=f||1/0,t=Math.min(y||33,e)},fps:function(f){r=1e3/(f||240),a=h.time*1e3+r},add:function(f,y,w){var x=y?function(_,v,A,T){f(_,v,A,T),h.remove(x)}:f;return h.remove(f),s[w?"unshift":"push"](x),pe(),x},remove:function(f,y){~(y=s.indexOf(f))&&s.splice(y,1)&&p>=y&&p--},_listeners:s},h})(),pe=function(){return!ze&&ot.wake()},O={},Oo=/^[\d.\-M][\d.\-,\s]/,Lo=/["']/g,Do=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),n=i[0],r=1,a=i.length,s,l,d;r<a;r++)l=i[r],s=r!==a-1?l.lastIndexOf(","):l.length,d=l.substr(0,s),t[n]=isNaN(d)?d.replace(Lo,"").trim():+d,n=l.substr(s+1).trim();return t},Fo=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),n=e.indexOf("(",t);return e.substring(t,~n&&n<i?e.indexOf(")",i+1):i)},Wo=function(e){var t=(e+"").split("("),i=O[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[Do(t[1])]:Fo(e).split(",").map(wr)):O._CE&&Oo.test(e)?O._CE("",e):i},Ro=function(e){return function(t){return 1-e(1-t)}},Jt=function(e,t){return e&&(q(e)?e:O[e]||Wo(e))||t},ne=function(e,t,i,n){i===void 0&&(i=function(l){return 1-t(1-l)}),n===void 0&&(n=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var r={easeIn:t,easeOut:i,easeInOut:n},a;return it(e,function(s){O[s]=mt[s]=r,O[a=s.toLowerCase()]=i;for(var l in r)O[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=O[s+"."+l]=r[l]}),r},Wr=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},Vi=function o(e,t,i){var n=t>=1?t:1,r=(i||(e?.3:.45))/(t<1?t:1),a=r/ji*(Math.asin(1/n)||0),s=function(c){return c===1?1:n*Math.pow(2,-10*c)*ao((c-a)*r)+1},l=e==="out"?s:e==="in"?function(d){return 1-s(1-d)}:Wr(s);return r=ji/r,l.config=function(d,c){return o(e,d,c)},l},Yi=function o(e,t){t===void 0&&(t=1.70158);var i=function(a){return a?--a*a*((t+1)*a+t)+1:0},n=e==="out"?i:e==="in"?function(r){return 1-i(1-r)}:Wr(i);return n.config=function(r){return o(e,r)},n};it("Linear,Quad,Cubic,Quart,Quint,Strong",function(o,e){var t=e<5?e+1:e;ne(o+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});O.Linear.easeNone=O.none=O.Linear.easeIn;ne("Elastic",Vi("in"),Vi("out"),Vi());(function(o,e){var t=1/e,i=2*t,n=2.5*t,r=function(s){return s<t?o*s*s:s<i?o*Math.pow(s-1.5/e,2)+.75:s<n?o*(s-=2.25/e)*s+.9375:o*Math.pow(s-2.625/e,2)+.984375};ne("Bounce",function(a){return 1-r(1-a)},r)})(7.5625,2.75);ne("Expo",function(o){return Math.pow(2,10*(o-1))*o+o*o*o*o*o*o*(1-o)});ne("Circ",function(o){return-(hr(1-o*o)-1)});ne("Sine",function(o){return o===1?1:-ro(o*io)+1});ne("Back",Yi("in"),Yi("out"),Yi());O.SteppedEase=O.steps=mt.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,n=e+(t?0:1),r=t?1:0,a=1-N;return function(s){return((n*He(0,a,s)|0)+r)*i}}};Fe.ease=O["quad.out"];it("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(o){return un+=o+","+o+"Params,"});var yn=function(e,t){this.id=no++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:pn,this.set=t?t.getSetter:mi},Ne=(function(){function o(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,me(this,+t.duration,1,1),this.data=t.data,H&&(this._ctx=H,H.data.push(this)),ze||ot.wake()}var e=o.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,me(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,n){if(pe(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(ui(this,i),!r._dp||r.parent||vr(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&At(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!n||this._initted&&Math.abs(this._zTime)===N||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),yr(this,i,n)),this},e.time=function(i,n){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+ar(this))%(this._dur+this._rDelay)||(i?this._dur:0),n):this._time},e.totalProgress=function(i,n){return arguments.length?this.totalTime(this.totalDuration()*i,n):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,n){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+ar(this),n):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,n){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*r,n):this._repeat?ue(this._tTime,r)+1:1},e.timeScale=function(i,n){if(!arguments.length)return this._rts===-N?0:this._rts;if(this._rts===i)return this;var r=this.parent&&this._ts?oi(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-N?0:this._rts,this.totalTime(He(-Math.abs(this._delay),this.totalDuration(),r),n!==!1),hi(this),go(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(pe(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==N&&(this._tTime-=N)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=I(i);var n=this.parent||this._dp;return n&&(n._sort||!this.parent)&&At(n,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(st(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var n=this.parent||this._dp;return n?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?oi(n.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=uo);var n=Z;return Z=i,fn(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Z=n,this},e.globalTime=function(i){for(var n=this,r=arguments.length?i:n.rawTime();n;)r=n._start+r/(Math.abs(n._ts)||1),n=n._dp;return!this.parent&&this._sat?this._sat.globalTime(i):r},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,or(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var n=this._time;return this._rDelay=i,or(this),n?this.time(n):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,n){return this.totalTime(wt(this,i),st(n))},e.restart=function(i,n){return this.play().totalTime(i?-this._delay:0,st(n)),this._dur||(this._zTime=-N),this},e.play=function(i,n){return i!=null&&this.seek(i,n),this.reversed(!1).paused(!1)},e.reverse=function(i,n){return i!=null&&this.seek(i||this.totalDuration(),n),this.reversed(!0).paused(!1)},e.pause=function(i,n){return i!=null&&this.seek(i,n),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-N:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-N,this},e.isActive=function(){var i=this.parent||this._dp,n=this._start,r;return!!(!i||this._ts&&this._initted&&i.isActive()&&(r=i.rawTime(!0))>=n&&r<this.endTime(!0)-N)},e.eventCallback=function(i,n,r){var a=this.vars;return arguments.length>1?(n?(a[i]=n,r&&(a[i+"Params"]=r),i==="onUpdate"&&(this._onUpdate=n)):delete a[i],this):a[i]},e.then=function(i){var n=this,r=n._prom;return new Promise(function(a){var s=q(i)?i:_r,l=function(){var c=n.then;n.then=null,r&&r(),q(s)&&(s=s(n))&&(s.then||s===n)&&(n.then=c),a(s),n.then=c};n._initted&&n.totalProgress()===1&&n._ts>=0||!n._tTime&&n._ts<0?l():n._prom=l})},e.kill=function(){Me(this)},o})();pt(Ne.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-N,_prom:0,_ps:!1,_rts:1});var J=(function(o){cr(e,o);function e(i,n){var r;return i===void 0&&(i={}),r=o.call(this,i)||this,r.labels={},r.smoothChildTiming=!!i.smoothChildTiming,r.autoRemoveChildren=!!i.autoRemoveChildren,r._sort=st(i.sortChildren),G&&At(i.parent||G,Ot(r),n),i.reversed&&r.reverse(),i.paused&&r.paused(!0),i.scrollTrigger&&xr(Ot(r),i.scrollTrigger),r}var t=e.prototype;return t.to=function(n,r,a){return Le(0,arguments,this),this},t.from=function(n,r,a){return Le(1,arguments,this),this},t.fromTo=function(n,r,a,s){return Le(2,arguments,this),this},t.set=function(n,r,a){return r.duration=0,r.parent=this,Oe(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new Y(n,r,wt(this,a),1),this},t.call=function(n,r,a){return At(this,Y.delayedCall(0,n,r),a)},t.staggerTo=function(n,r,a,s,l,d,c){return a.duration=r,a.stagger=a.stagger||s,a.onComplete=d,a.onCompleteParams=c,a.parent=this,new Y(n,a,wt(this,l)),this},t.staggerFrom=function(n,r,a,s,l,d,c){return a.runBackwards=1,Oe(a).immediateRender=st(a.immediateRender),this.staggerTo(n,r,a,s,l,d,c)},t.staggerFromTo=function(n,r,a,s,l,d,c,h){return s.startAt=a,Oe(s).immediateRender=st(s.immediateRender),this.staggerTo(n,r,s,l,d,c,h)},t.render=function(n,r,a){var s=this._time,l=this._dirty?this.totalDuration():this._tDur,d=this._dur,c=n<=0?0:I(n),h=this._zTime<0!=n<0&&(this._initted||!d),m,p,g,u,f,y,w,x,_,v,A,T;if(this!==G&&c>l&&n>=0&&(c=l),c!==this._tTime||a||h){if(s!==this._time&&d&&(c+=this._time-s,n+=this._time-s),m=c,_=this._start,x=this._ts,y=!x,h&&(d||(s=this._zTime),(n||!r)&&(this._zTime=n)),this._repeat){if(A=this._yoyo,f=d+this._rDelay,this._repeat<-1&&n<0)return this.totalTime(f*100+n,r,a);if(m=I(c%f),c===l?(u=this._repeat,m=d):(v=I(c/f),u=~~v,u&&u===v&&(m=d,u--),m>d&&(m=d)),v=ue(this._tTime,f),!s&&this._tTime&&v!==u&&this._tTime-v*f-this._dur<=0&&(v=u),A&&u&1&&(m=d-m,T=1),u!==v&&!this._lock){var b=A&&v&1,S=b===(A&&u&1);if(u<v&&(b=!b),s=b?0:c%d?d:c,this._lock=1,this.render(s||(T?0:I(u*f)),r,!d)._lock=0,this._tTime=c,!r&&this.parent&&ut(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1,v=u),s&&s!==this._time||y!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(d=this._dur,l=this._tDur,S&&(this._lock=2,s=b?d:-1e-4,this.render(s,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!y)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(w=bo(this,I(s),I(m)),w&&(c-=m-(m=w._start))),this._tTime=c,this._time=m,this._act=!!x,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=n,s=0),!s&&c&&d&&!r&&!v&&(ut(this,"onStart"),this._tTime!==c))return this;if(m>=s&&n>=0)for(p=this._first;p;){if(g=p._next,(p._act||m>=p._start)&&p._ts&&w!==p){if(p.parent!==this)return this.render(n,r,a);if(p.render(p._ts>0?(m-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(m-p._start)*p._ts,r,a),m!==this._time||!this._ts&&!y){w=0,g&&(c+=this._zTime=-N);break}}p=g}else{p=this._last;for(var k=n<0?n:m;p;){if(g=p._prev,(p._act||k<=p._end)&&p._ts&&w!==p){if(p.parent!==this)return this.render(n,r,a);if(p.render(p._ts>0?(k-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(k-p._start)*p._ts,r,a||Z&&fn(p)),m!==this._time||!this._ts&&!y){w=0,g&&(c+=this._zTime=k?-N:N);break}}p=g}}if(w&&!r&&(this.pause(),w.render(m>=s?0:-N)._zTime=m>=s?1:-1,this._ts))return this._start=_,hi(this),this.render(n,r,a);this._onUpdate&&!r&&ut(this,"onUpdate",!0),(c===l&&this._tTime>=this.totalDuration()||!c&&s)&&(_===this._start||Math.abs(x)!==Math.abs(this._ts))&&(this._lock||((n||!d)&&(c===l&&this._ts>0||!c&&this._ts<0)&&It(this,1),!r&&!(n<0&&!s)&&(c||s||!l)&&(ut(this,c===l&&n>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(c<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(n,r){var a=this;if(Dt(r)||(r=wt(this,r,n)),!(n instanceof Ne)){if(tt(n))return n.forEach(function(s){return a.add(s,r)}),this;if(K(n))return this.addLabel(n,r);if(q(n))n=Y.delayedCall(0,n);else return this}return this!==n?At(this,n,r):this},t.getChildren=function(n,r,a,s){n===void 0&&(n=!0),r===void 0&&(r=!0),a===void 0&&(a=!0),s===void 0&&(s=-_t);for(var l=[],d=this._first;d;)d._start>=s&&(d instanceof Y?r&&l.push(d):(a&&l.push(d),n&&l.push.apply(l,d.getChildren(!0,r,a)))),d=d._next;return l},t.getById=function(n){for(var r=this.getChildren(1,1,1),a=r.length;a--;)if(r[a].vars.id===n)return r[a]},t.remove=function(n){return K(n)?this.removeLabel(n):q(n)?this.killTweensOf(n):(n.parent===this&&ci(this,n),n===this._recent&&(this._recent=this._last),Qt(this))},t.totalTime=function(n,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=I(ot.time-(this._ts>0?n/this._ts:(this.totalDuration()-n)/-this._ts))),o.prototype.totalTime.call(this,n,r),this._forcing=0,this):this._tTime},t.addLabel=function(n,r){return this.labels[n]=wt(this,r),this},t.removeLabel=function(n){return delete this.labels[n],this},t.addPause=function(n,r,a){var s=Y.delayedCall(0,r||Re,a);return s.data="isPause",this._hasPause=1,At(this,s,wt(this,n))},t.removePause=function(n){var r=this._first;for(n=wt(this,n);r;)r._start===n&&r.data==="isPause"&&It(r),r=r._next},t.killTweensOf=function(n,r,a){for(var s=this.getTweensOf(n,a),l=s.length;l--;)Nt!==s[l]&&s[l].kill(n,r);return this},t.getTweensOf=function(n,r){for(var a=[],s=bt(n),l=this._first,d=Dt(r),c;l;)l instanceof Y?mo(l._targets,s)&&(d?(!Nt||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&a.push(l):(c=l.getTweensOf(s,r)).length&&a.push.apply(a,c),l=l._next;return a},t.tweenTo=function(n,r){r=r||{};var a=this,s=wt(a,n),l=r,d=l.startAt,c=l.onStart,h=l.onStartParams,m=l.immediateRender,p,g=Y.to(a,pt({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:s,overwrite:"auto",duration:r.duration||Math.abs((s-(d&&"time"in d?d.time:a._time))/a.timeScale())||N,onStart:function(){if(a.pause(),!p){var f=r.duration||Math.abs((s-(d&&"time"in d?d.time:a._time))/a.timeScale());g._dur!==f&&me(g,f,0,1).render(g._time,!0,!0),p=1}c&&c.apply(g,h||[])}},r));return m?g.render(0):g},t.tweenFromTo=function(n,r,a){return this.tweenTo(r,pt({startAt:{time:wt(this,n)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(n){return n===void 0&&(n=this._time),sr(this,wt(this,n))},t.previousLabel=function(n){return n===void 0&&(n=this._time),sr(this,wt(this,n),1)},t.currentLabel=function(n){return arguments.length?this.seek(n,!0):this.previousLabel(this._time+N)},t.shiftChildren=function(n,r,a){a===void 0&&(a=0);var s=this._first,l=this.labels,d;for(n=I(n);s;)s._start>=a&&(s._start+=n,s._end+=n),s=s._next;if(r)for(d in l)l[d]>=a&&(l[d]+=n);return Qt(this)},t.invalidate=function(n){var r=this._first;for(this._lock=0;r;)r.invalidate(n),r=r._next;return o.prototype.invalidate.call(this,n)},t.clear=function(n){n===void 0&&(n=!0);for(var r=this._first,a;r;)a=r._next,this.remove(r),r=a;return this._dp&&(this._time=this._tTime=this._pTime=0),n&&(this.labels={}),Qt(this)},t.totalDuration=function(n){var r=0,a=this,s=a._last,l=_t,d,c,h;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-n:n));if(a._dirty){for(h=a.parent;s;)d=s._prev,s._dirty&&s.totalDuration(),c=s._start,c>l&&a._sort&&s._ts&&!a._lock?(a._lock=1,At(a,s,c-s._delay,1)._lock=0):l=c,c<0&&s._ts&&(r-=c,(!h&&!a._dp||h&&h.smoothChildTiming)&&(a._start+=I(c/a._ts),a._time-=c,a._tTime-=c),a.shiftChildren(-c,!1,-1/0),l=0),s._end>r&&s._ts&&(r=s._end),s=d;me(a,a===G&&a._time>r?a._time:r,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(n){if(G._ts&&(yr(G,oi(n,G)),gr=ot.frame),ot.frame>=nr){nr+=lt.autoSleep||120;var r=G._first;if((!r||!r._ts)&&lt.autoSleep&&ot._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||ot.sleep()}}},e})(Ne);pt(J.prototype,{_lock:0,_hasPause:0,_forcing:0});var zo=function(e,t,i,n,r,a,s){var l=new nt(this._pt,e,t,0,1,xn,null,r),d=0,c=0,h,m,p,g,u,f,y,w;for(l.b=i,l.e=n,i+="",n+="",(y=~n.indexOf("random("))&&(n=fe(n)),a&&(w=[i,n],a(w,e,t),i=w[0],n=w[1]),m=i.match(Gi)||[];h=Gi.exec(n);)g=h[0],u=n.substring(d,h.index),p?p=(p+1)%5:u.substr(-5)==="rgba("&&(p=1),g!==m[c++]&&(f=parseFloat(m[c-1])||0,l._pt={_next:l._pt,p:u||c===1?u:",",s:f,c:g.charAt(1)==="="?ie(f,g)-f:parseFloat(g)-f,m:p&&p<4?Math.round:0},d=Gi.lastIndex);return l.c=d<n.length?n.substring(d,n.length):"",l.fp=s,(dn.test(n)||y)&&(l.e=0),this._pt=l,l},wn=function(e,t,i,n,r,a,s,l,d,c){q(n)&&(n=n(r||0,e,a));var h=e[t],m=i!=="get"?i:q(h)?d?e[t.indexOf("set")||!q(e["get"+t.substr(3)])?t:"get"+t.substr(3)](d):e[t]():h,p=q(h)?d?Go:Nr:vn,g;if(K(n)&&(~n.indexOf("random(")&&(n=fe(n)),n.charAt(1)==="="&&(g=ie(m,n)+(Q(m)||0),(g||g===0)&&(n=g))),!c||m!==n||rn)return!isNaN(m*n)&&n!==""?(g=new nt(this._pt,e,t,+m||0,n-(m||0),typeof h=="boolean"?qo:Hr,0,p),d&&(g.fp=d),s&&g.modifier(s,this,e),this._pt=g):(!h&&!(t in e)&&di(t,n),zo.call(this,e,t,m,n,p,l||lt.stringFilter,d))},No=function(e,t,i,n,r){if(q(e)&&(e=De(e,r,t,i,n)),!kt(e)||e.style&&e.nodeType||tt(e)||ur(e))return K(e)?De(e,r,t,i,n):e;var a={},s;for(s in e)a[s]=De(e[s],r,t,i,n);return a},_n=function(e,t,i,n,r,a){var s,l,d,c;if(at[e]&&(s=new at[e]).init(r,s.rawVars?t[e]:No(t[e],n,r,a,i),i,n,a)!==!1&&(i._pt=l=new nt(i._pt,r,e,0,1,s.render,s,0,s.priority),i!==ce))for(d=i._ptLookup[i._targets.indexOf(r)],c=s._props.length;c--;)d[s._props[c]]=l;return s},Nt,rn,bn=function o(e,t,i){var n=e.vars,r=n.ease,a=n.startAt,s=n.immediateRender,l=n.lazy,d=n.onUpdate,c=n.runBackwards,h=n.yoyoEase,m=n.keyframes,p=n.autoRevert,g=e._dur,u=e._startAt,f=e._targets,y=e.parent,w=y&&y.data==="nested"?y.vars.targets:f,x=e._overwrite==="auto"&&!on,_=e.timeline,v=n.easeReverse||h,A,T,b,S,k,D,F,E,P,$,W,R,j;if(_&&(!m||!r)&&(r="none"),e._ease=Jt(r,Fe.ease),e._rEase=v&&(Jt(v)||e._ease),e._from=!_&&!!n.runBackwards,e._from&&(e.ratio=1),!_||m&&!n.stagger){if(E=f[0]?$t(f[0]).harness:0,R=E&&n[E.prop],A=ai(n,hn),u&&(u._zTime<0&&u.progress(1),t<0&&c&&s&&!p?u.render(-1,!0):u.revert(c&&g?ti:ho),u._lazy=0),a){if(It(e._startAt=Y.set(f,pt({data:"isStart",overwrite:!1,parent:y,immediateRender:!0,lazy:!u&&st(l),startAt:null,delay:0,onUpdate:d&&function(){return ut(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Z||!s&&!p)&&e._startAt.revert(ti),s&&g&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(c&&g&&!u){if(t&&(s=!1),b=pt({overwrite:!1,data:"isFromStart",lazy:s&&!u&&st(l),immediateRender:s,stagger:0,parent:y},A),R&&(b[E.prop]=R),It(e._startAt=Y.set(f,b)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Z?e._startAt.revert(ti):e._startAt.render(-1,!0)),e._zTime=t,!s)o(e._startAt,N,N);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&st(l)||l&&!g,T=0;T<f.length;T++){if(k=f[T],F=k._gsap||mn(f)[T]._gsap,e._ptLookup[T]=$={},Zi[F.id]&&Ht.length&&ri(),W=w===f?T:w.indexOf(k),E&&(P=new E).init(k,R||A,e,W,w)!==!1&&(e._pt=S=new nt(e._pt,k,P.name,0,1,P.render,P,0,P.priority),P._props.forEach(function(St){$[St]=S}),P.priority&&(D=1)),!E||R)for(b in A)at[b]&&(P=_n(b,A,e,W,k,w))?P.priority&&(D=1):$[b]=S=wn.call(e,k,b,"get",A[b],W,w,0,n.stringFilter);e._op&&e._op[T]&&e.kill(k,e._op[T]),x&&e._pt&&(Nt=e,G.killTweensOf(k,$,e.globalTime(t)),j=!e.parent,Nt=0),e._pt&&l&&(Zi[F.id]=1)}D&&Tn(e),e._onInit&&e._onInit(e)}e._onUpdate=d,e._initted=(!e._op||e._pt)&&!j,m&&t<=0&&_.render(_t,!0,!0)},Ho=function(e,t,i,n,r,a,s,l){var d=(e._pt&&e._ptCache||(e._ptCache={}))[t],c,h,m,p;if(!d)for(d=e._ptCache[t]=[],m=e._ptLookup,p=e._targets.length;p--;){if(c=m[p][t],c&&c.d&&c.d._pt)for(c=c.d._pt;c&&c.p!==t&&c.fp!==t;)c=c._next;if(!c)return rn=1,e.vars[t]="+=0",bn(e,s),rn=0,l?We(t+" not eligible for reset. Try splitting into individual properties"):1;d.push(c)}for(p=d.length;p--;)h=d[p],c=h._pt||h,c.s=(n||n===0)&&!r?n:c.s+(n||0)+a*c.c,c.c=i-c.s,h.e&&(h.e=V(i)+Q(h.e)),h.b&&(h.b=c.s+Q(h.b))},$o=function(e,t){var i=e[0]?$t(e[0]).harness:0,n=i&&i.aliases,r,a,s,l;if(!n)return t;r=he({},t);for(a in n)if(a in r)for(l=n[a].split(","),s=l.length;s--;)r[l[s]]=r[a];return r},Io=function(e,t,i,n){var r=t.ease||n||"power1.inOut",a,s;if(tt(t))s=i[e]||(i[e]=[]),t.forEach(function(l,d){return s.push({t:d/(t.length-1)*100,v:l,e:r})});else for(a in t)s=i[a]||(i[a]=[]),a==="ease"||s.push({t:parseFloat(e),v:t[a],e:r})},De=function(e,t,i,n,r){return q(e)?e.call(t,i,n,r):K(e)&&~e.indexOf("random(")?fe(e):e},Rr=un+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",zr={};it(Rr+",id,stagger,delay,duration,paused,scrollTrigger",function(o){return zr[o]=1});var Y=(function(o){cr(e,o);function e(i,n,r,a){var s;typeof n=="number"&&(r.duration=n,n=r,r=null),s=o.call(this,a?n:Oe(n))||this;var l=s.vars,d=l.duration,c=l.delay,h=l.immediateRender,m=l.stagger,p=l.overwrite,g=l.keyframes,u=l.defaults,f=l.scrollTrigger,y=n.parent||G,w=(tt(i)||ur(i)?Dt(i[0]):"length"in n)?[i]:bt(i),x,_,v,A,T,b,S,k;if(s._targets=w.length?mn(w):We("GSAP target "+i+" not found. https://gsap.com",!lt.nullTargetWarn)||[],s._ptLookup=[],s._overwrite=p,g||m||Je(d)||Je(c)){n=s.vars;var D=n.easeReverse||n.yoyoEase;if(x=s.timeline=new J({data:"nested",defaults:u||{},targets:y&&y.data==="nested"?y.vars.targets:w}),x.kill(),x.parent=x._dp=Ot(s),x._start=0,m||Je(d)||Je(c)){if(A=w.length,S=m&&Ar(m),kt(m))for(T in m)~Rr.indexOf(T)&&(k||(k={}),k[T]=m[T]);for(_=0;_<A;_++)v=ai(n,zr),v.stagger=0,D&&(v.easeReverse=D),k&&he(v,k),b=w[_],v.duration=+De(d,Ot(s),_,b,w),v.delay=(+De(c,Ot(s),_,b,w)||0)-s._delay,!m&&A===1&&v.delay&&(s._delay=c=v.delay,s._start+=c,v.delay=0),x.to(b,v,S?S(_,b,w):0),x._ease=O.none;x.duration()?d=c=0:s.timeline=0}else if(g){Oe(pt(x.vars.defaults,{ease:"none"})),x._ease=Jt(g.ease||n.ease||"none");var F=0,E,P,$;if(tt(g))g.forEach(function(W){return x.to(w,W,">")}),x.duration();else{v={};for(T in g)T==="ease"||T==="easeEach"||Io(T,g[T],v,g.easeEach);for(T in v)for(E=v[T].sort(function(W,R){return W.t-R.t}),F=0,_=0;_<E.length;_++)P=E[_],$={ease:P.e,duration:(P.t-(_?E[_-1].t:0))/100*d},$[T]=P.v,x.to(w,$,F),F+=$.duration;x.duration()<d&&x.to({},{duration:d-x.duration()})}}d||s.duration(d=x.duration())}else s.timeline=0;return p===!0&&!on&&(Nt=Ot(s),G.killTweensOf(w),Nt=0),At(y,Ot(s),r),n.reversed&&s.reverse(),n.paused&&s.paused(!0),(h||!d&&!g&&s._start===I(y._time)&&st(h)&&yo(Ot(s))&&y.data!=="nested")&&(s._tTime=-N,s.render(Math.max(0,-c)||0)),f&&xr(Ot(s),f),s}var t=e.prototype;return t.render=function(n,r,a){var s=this._time,l=this._tDur,d=this._dur,c=n<0,h=n>l-N&&!c?l:n<N?0:n,m,p,g,u,f,y,w,x;if(!d)_o(this,n,r,a);else if(h!==this._tTime||!n||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==c||this._lazy){if(m=h,x=this.timeline,this._repeat){if(u=d+this._rDelay,this._repeat<-1&&c)return this.totalTime(u*100+n,r,a);if(m=I(h%u),h===l?(g=this._repeat,m=d):(f=I(h/u),g=~~f,g&&g===f?(m=d,g--):m>d&&(m=d)),y=this._yoyo&&g&1,y&&(m=d-m),f=ue(this._tTime,u),m===s&&!a&&this._initted&&g===f)return this._tTime=h,this;g!==f&&this.vars.repeatRefresh&&!y&&!this._lock&&m!==u&&this._initted&&(this._lock=a=1,this.render(I(u*g),!0).invalidate()._lock=0)}if(!this._initted){if(Sr(this,c?n:m,a,r,h))return this._tTime=0,this;if(s!==this._time&&!(a&&this.vars.repeatRefresh&&g!==f))return this;if(d!==this._dur)return this.render(n,r,a)}if(this._rEase){var _=m<s;if(_!==this._inv){var v=_?s:d-s;this._inv=_,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=s,this._invRecip=v?(_?-1:1)/v:0,this._invScale=_?-this.ratio:1-this.ratio,this._invEase=_?this._rEase:this._ease}this.ratio=w=this._invRatio+this._invScale*this._invEase((m-this._invTime)*this._invRecip)}else this.ratio=w=this._ease(m/d);if(this._from&&(this.ratio=w=1-w),this._tTime=h,this._time=m,!this._act&&this._ts&&(this._act=1,this._lazy=0),!s&&h&&!r&&!f&&(ut(this,"onStart"),this._tTime!==h))return this;for(p=this._pt;p;)p.r(w,p.d),p=p._next;x&&x.render(n<0?n:x._dur*x._ease(m/this._dur),r,a)||this._startAt&&(this._zTime=n),this._onUpdate&&!r&&(c&&Qi(this,n,r,a),ut(this,"onUpdate")),this._repeat&&g!==f&&this.vars.onRepeat&&!r&&this.parent&&ut(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(c&&!this._onUpdate&&Qi(this,n,!0,!0),(n||!d)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&It(this,1),!r&&!(c&&!s)&&(h||s||y)&&(ut(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(n){return(!n||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(n),o.prototype.invalidate.call(this,n)},t.resetTo=function(n,r,a,s,l){ze||ot.wake(),this._ts||this.play();var d=Math.min(this._dur,(this._dp._time-this._start)*this._ts),c;return this._initted||bn(this,d),c=this._ease(d/this._dur),Ho(this,n,r,a,s,c,d,l)?this.resetTo(n,r,a,s,1):(ui(this,0),this.parent||br(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(n,r){if(r===void 0&&(r="all"),!n&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?Me(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Z),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(n,r,Nt&&Nt.vars.overwrite!==!0)._first||Me(this),this.parent&&a!==this.timeline.totalDuration()&&me(this,this._dur*this.timeline._tDur/a,0,1),this}var s=this._targets,l=n?bt(n):s,d=this._ptLookup,c=this._pt,h,m,p,g,u,f,y;if((!r||r==="all")&&fo(s,l))return r==="all"&&(this._pt=0),Me(this);for(h=this._op=this._op||[],r!=="all"&&(K(r)&&(u={},it(r,function(w){return u[w]=1}),r=u),r=$o(s,r)),y=s.length;y--;)if(~l.indexOf(s[y])){m=d[y],r==="all"?(h[y]=r,g=m,p={}):(p=h[y]=h[y]||{},g=r);for(u in g)f=m&&m[u],f&&((!("kill"in f.d)||f.d.kill(u)===!0)&&ci(this,f,"_pt"),delete m[u]),p!=="all"&&(p[u]=1)}return this._initted&&!this._pt&&c&&Me(this),this},e.to=function(n,r){return new e(n,r,arguments[2])},e.from=function(n,r){return Le(1,arguments)},e.delayedCall=function(n,r,a,s){return new e(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:n,onComplete:r,onReverseComplete:r,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:s})},e.fromTo=function(n,r,a){return Le(2,arguments)},e.set=function(n,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new e(n,r)},e.killTweensOf=function(n,r,a){return G.killTweensOf(n,r,a)},e})(Ne);pt(Y.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});it("staggerTo,staggerFrom,staggerFromTo",function(o){Y[o]=function(){var e=new J,t=tn.call(arguments,0);return t.splice(o==="staggerFromTo"?5:4,0,0),e[o].apply(e,t)}});var vn=function(e,t,i){return e[t]=i},Nr=function(e,t,i){return e[t](i)},Go=function(e,t,i,n){return e[t](n.fp,i)},Bo=function(e,t,i){return e.setAttribute(t,i)},mi=function(e,t){return q(e[t])?Nr:li(e[t])&&e.setAttribute?Bo:vn},Hr=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},qo=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},xn=function(e,t){var i=t._pt,n="";if(!e&&t.b)n=t.b;else if(e===1&&t.e)n=t.e;else{for(;i;)n=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+n,i=i._next;n+=t.c}t.set(t.t,t.p,n,t)},Sn=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},Vo=function(e,t,i,n){for(var r=this._pt,a;r;)a=r._next,r.p===n&&r.modifier(e,t,i),r=a},Yo=function(e){for(var t=this._pt,i,n;t;)n=t._next,t.p===e&&!t.op||t.op===e?ci(this,t,"_pt"):t.dep||(i=1),t=n;return!i},Uo=function(e,t,i,n){n.mSet(e,t,n.m.call(n.tween,i,n.mt),n)},Tn=function(e){for(var t=e._pt,i,n,r,a;t;){for(i=t._next,n=r;n&&n.pr>t.pr;)n=n._next;(t._prev=n?n._prev:a)?t._prev._next=t:r=t,(t._next=n)?n._prev=t:a=t,t=i}e._pt=r},nt=(function(){function o(t,i,n,r,a,s,l,d,c){this.t=i,this.s=r,this.c=a,this.p=n,this.r=s||Hr,this.d=l||this,this.set=d||vn,this.pr=c||0,this._next=t,t&&(t._prev=this)}var e=o.prototype;return e.modifier=function(i,n,r){this.mSet=this.mSet||this.set,this.set=Uo,this.m=i,this.mt=r,this.tween=n},o})();it(un+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(o){return hn[o]=1});mt.TweenMax=mt.TweenLite=Y;mt.TimelineLite=mt.TimelineMax=J;G=new J({sortChildren:!1,defaults:Fe,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});lt.stringFilter=gn;var te=[],ii={},Ko=[],dr=0,jo=0,Ui=function(e){return(ii[e]||Ko).map(function(t){return t()})},an=function(){var e=Date.now(),t=[];e-dr>2&&(Ui("matchMediaInit"),te.forEach(function(i){var n=i.queries,r=i.conditions,a,s,l,d;for(s in n)a=Ct.matchMedia(n[s]).matches,a&&(l=1),a!==r[s]&&(r[s]=a,d=1);d&&(i.revert(),l&&t.push(i))}),Ui("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(n){return i.add(null,n)})}),dr=e,Ui("matchMedia"))},$r=(function(){function o(t,i){this.selector=i&&en(i),this.data=[],this._r=[],this.isReverted=!1,this.id=jo++,t&&this.add(t)}var e=o.prototype;return e.add=function(i,n,r){q(i)&&(r=n,n=i,i=q);var a=this,s=function(){var d=H,c=a.selector,h;return d&&d!==a&&d.data.push(a),r&&(a.selector=en(r)),H=a,h=n.apply(a,arguments),q(h)&&a._r.push(h),H=d,a.selector=c,a.isReverted=!1,h};return a.last=s,i===q?s(a,function(l){return a.add(null,l)}):i?a[i]=s:s},e.ignore=function(i){var n=H;H=null,i(this),H=n},e.getTweens=function(){var i=[];return this.data.forEach(function(n){return n instanceof o?i.push.apply(i,n.getTweens()):n instanceof Y&&!(n.parent&&n.parent.data==="nested")&&i.push(n)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,n){var r=this;if(i?(function(){for(var s=r.getTweens(),l=r.data.length,d;l--;)d=r.data[l],d.data==="isFlip"&&(d.revert(),d.getChildren(!0,!0,!1).forEach(function(c){return s.splice(s.indexOf(c),1)}));for(s.map(function(c){return{g:c._dur||c._delay||c._sat&&!c._sat.vars.immediateRender?c.globalTime(0):-1/0,t:c}}).sort(function(c,h){return h.g-c.g||-1/0}).forEach(function(c){return c.t.revert(i)}),l=r.data.length;l--;)d=r.data[l],d instanceof J?d.data!=="nested"&&(d.scrollTrigger&&d.scrollTrigger.revert(),d.kill()):!(d instanceof Y)&&d.revert&&d.revert(i);r._r.forEach(function(c){return c(i,r)}),r.isReverted=!0})():this.data.forEach(function(s){return s.kill&&s.kill()}),this.clear(),n)for(var a=te.length;a--;)te[a].id===this.id&&te.splice(a,1)},e.revert=function(i){this.kill(i||{})},o})(),Xo=(function(){function o(t){this.contexts=[],this.scope=t,H&&H.data.push(this)}var e=o.prototype;return e.add=function(i,n,r){kt(i)||(i={matches:i});var a=new $r(0,r||this.scope),s=a.conditions={},l,d,c;H&&!a.selector&&(a.selector=H.selector),this.contexts.push(a),n=a.add("onMatch",n),a.queries=i;for(d in i)d==="all"?c=1:(l=Ct.matchMedia(i[d]),l&&(te.indexOf(a)<0&&te.push(a),(s[d]=l.matches)&&(c=1),l.addListener?l.addListener(an):l.addEventListener("change",an)));return c&&n(a,function(h){return a.add(null,h)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(n){return n.kill(i,!0)})},o})(),si={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(n){return Lr(n)})},timeline:function(e){return new J(e)},getTweensOf:function(e,t){return G.getTweensOf(e,t)},getProperty:function(e,t,i,n){K(e)&&(e=bt(e)[0]);var r=$t(e||{}).get,a=i?_r:wr;return i==="native"&&(i=""),e&&(t?a((at[t]&&at[t].get||r)(e,t,i,n)):function(s,l,d){return a((at[s]&&at[s].get||r)(e,s,l,d))})},quickSetter:function(e,t,i){if(e=bt(e),e.length>1){var n=e.map(function(c){return et.quickSetter(c,t,i)}),r=n.length;return function(c){for(var h=r;h--;)n[h](c)}}e=e[0]||{};var a=at[t],s=$t(e),l=s.harness&&(s.harness.aliases||{})[t]||t,d=a?function(c){var h=new a;ce._pt=0,h.init(e,i?c+i:c,ce,0,[e]),h.render(1,h),ce._pt&&Sn(1,ce)}:s.set(e,l);return a?d:function(c){return d(e,l,i?c+i:c,s,1)}},quickTo:function(e,t,i){var n,r=et.to(e,pt((n={},n[t]="+=0.1",n.paused=!0,n.stagger=0,n),i||{})),a=function(l,d,c){return r.resetTo(t,l,d,c)};return a.tween=r,a},isTweening:function(e){return G.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=Jt(e.ease,Fe.ease)),rr(Fe,e||{})},config:function(e){return rr(lt,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,n=e.plugins,r=e.defaults,a=e.extendTimeline;(n||"").split(",").forEach(function(s){return s&&!at[s]&&!mt[s]&&We(t+" effect requires "+s+" plugin.")}),Bi[t]=function(s,l,d){return i(bt(s),pt(l||{},r),d)},a&&(J.prototype[t]=function(s,l,d){return this.add(Bi[t](s,kt(l)?l:(d=l)&&{},this),d)})},registerEase:function(e,t){O[e]=Jt(t)},parseEase:function(e,t){return arguments.length?Jt(e,t):O},getById:function(e){return G.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new J(e),n,r;for(i.smoothChildTiming=st(e.smoothChildTiming),G.remove(i),i._dp=0,i._time=i._tTime=G._time,n=G._first;n;)r=n._next,(t||!(!n._dur&&n instanceof Y&&n.vars.onComplete===n._targets[0]))&&At(i,n,n._start-n._delay),n=r;return At(G,i,0),i},context:function(e,t){return e?new $r(e,t):H},matchMedia:function(e){return new Xo(e)},matchMediaRefresh:function(){return te.forEach(function(e){var t=e.conditions,i,n;for(n in t)t[n]&&(t[n]=!1,i=1);i&&e.revert()})||an()},addEventListener:function(e,t){var i=ii[e]||(ii[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=ii[e],n=i&&i.indexOf(t);n>=0&&i.splice(n,1)},utils:{wrap:ko,wrapYoyo:Eo,distribute:Ar,random:Er,snap:kr,normalize:Ao,getUnit:Q,clamp:xo,splitColor:Dr,toArray:bt,selector:en,mapRange:Pr,pipe:To,unitize:Co,interpolate:Mo,shuffle:Cr},install:pr,effects:Bi,ticker:ot,updateRoot:J.updateRoot,plugins:at,globalTimeline:G,core:{PropTween:nt,globals:fr,Tween:Y,Timeline:J,Animation:Ne,getCache:$t,_removeLinkedListItem:ci,reverting:function(){return Z},context:function(e){return e&&H&&(H.data.push(e),e._ctx=H),H},suppressOverwrites:function(e){return on=e}}};it("to,from,fromTo,delayedCall,set,killTweensOf",function(o){return si[o]=Y[o]});ot.add(J.updateRoot);ce=si.to({},{duration:0});var Zo=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},Qo=function(e,t){var i=e._targets,n,r,a;for(n in t)for(r=i.length;r--;)a=e._ptLookup[r][n],a&&(a=a.d)&&(a._pt&&(a=Zo(a,n)),a&&a.modifier&&a.modifier(t[n],e,i[r],n))},Ki=function(e,t){return{name:e,headless:1,rawVars:1,init:function(n,r,a){a._onInit=function(s){var l,d;if(K(r)&&(l={},it(r,function(c){return l[c]=1}),r=l),t){l={};for(d in r)l[d]=t(r[d]);r=l}Qo(s,r)}}}},et=si.registerPlugin({name:"attr",init:function(e,t,i,n,r){var a,s,l;this.tween=i;for(a in t)l=e.getAttribute(a)||"",s=this.add(e,"setAttribute",(l||0)+"",t[a],n,r,0,0,a),s.op=a,s.b=l,this._props.push(a)},render:function(e,t){for(var i=t._pt;i;)Z?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},Ki("roundProps",nn),Ki("modifiers"),Ki("snap",kr))||si;Y.version=J.version=et.version="3.15.0";mr=1;sn()&&pe();var Jo=O.Power0,ts=O.Power1,es=O.Power2,is=O.Power3,ns=O.Power4,rs=O.Linear,as=O.Quad,os=O.Cubic,ss=O.Quart,ls=O.Quint,ds=O.Strong,cs=O.Elastic,hs=O.Back,us=O.SteppedEase,ms=O.Bounce,ps=O.Sine,fs=O.Expo,gs=O.Circ;var Ir,Bt,ye,Pn,se,ys,Gr,On,ws=function(){return typeof window<"u"},Wt={},oe=180/Math.PI,we=Math.PI/180,ge=Math.atan2,Br=1e8,Ln=/([A-Z])/g,_s=/(left|right|width|margin|padding|x)/i,bs=/[\s,\(]\S/,Et={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},An=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},vs=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},xs=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Ss=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Ts=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},Zr=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Qr=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},Cs=function(e,t,i){return e.style[t]=i},As=function(e,t,i){return e.style.setProperty(t,i)},ks=function(e,t,i){return e._gsap[t]=i},Es=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},Ms=function(e,t,i,n,r){var a=e._gsap;a.scaleX=a.scaleY=i,a.renderTransform(r,a)},Ps=function(e,t,i,n,r){var a=e._gsap;a[t]=i,a.renderTransform(r,a)},B="transform",dt=B+"Origin",Os=function o(e,t){var i=this,n=this.target,r=n.style,a=n._gsap;if(e in Wt&&r){if(this.tfm=this.tfm||{},e!=="transform")e=Et[e]||e,~e.indexOf(",")?e.split(",").forEach(function(s){return i.tfm[s]=Ft(n,s)}):this.tfm[e]=a.x?a[e]:Ft(n,e),e===dt&&(this.tfm.zOrigin=a.zOrigin);else return Et.transform.split(",").forEach(function(s){return o.call(i,s,t)});if(this.props.indexOf(B)>=0)return;a.svg&&(this.svgo=n.getAttribute("data-svg-origin"),this.props.push(dt,t,"")),e=B}(r||t)&&this.props.push(e,t,r[e])},Jr=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},Ls=function(){var e=this.props,t=this.target,i=t.style,n=t._gsap,r,a;for(r=0;r<e.length;r+=3)e[r+1]?e[r+1]===2?t[e[r]](e[r+2]):t[e[r]]=e[r+2]:e[r+2]?i[e[r]]=e[r+2]:i.removeProperty(e[r].substr(0,2)==="--"?e[r]:e[r].replace(Ln,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)n[a]=this.tfm[a];n.svg&&(n.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),r=On(),(!r||!r.isStart)&&!i[B]&&(Jr(i),n.zOrigin&&i[dt]&&(i[dt]+=" "+n.zOrigin+"px",n.zOrigin=0,n.renderTransform()),n.uncache=1)}},ta=function(e,t){var i={target:e,props:[],revert:Ls,save:Os};return e._gsap||et.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(n){return i.save(n)}),i},ea,kn=function(e,t){var i=Bt.createElementNS?Bt.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Bt.createElement(e);return i&&i.style?i:Bt.createElement(e)},ft=function o(e,t,i){var n=getComputedStyle(e);return n[t]||n.getPropertyValue(t.replace(Ln,"-$1").toLowerCase())||n.getPropertyValue(t)||!i&&o(e,_e(t)||t,1)||""},qr="O,Moz,ms,Ms,Webkit".split(","),_e=function(e,t,i){var n=t||se,r=n.style,a=5;if(e in r&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(qr[a]+e in r););return a<0?null:(a===3?"ms":a>=0?qr[a]:"")+e},En=function(){ws()&&window.document&&(Ir=window,Bt=Ir.document,ye=Bt.documentElement,se=kn("div")||{style:{}},ys=kn("div"),B=_e(B),dt=B+"Origin",se.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",ea=!!_e("perspective"),On=et.core.reverting,Pn=1)},Vr=function(e){var t=e.ownerSVGElement,i=kn("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=e.cloneNode(!0),r;n.style.display="block",i.appendChild(n),ye.appendChild(i);try{r=n.getBBox()}catch{}return i.removeChild(n),ye.removeChild(i),r},Yr=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},ia=function(e){var t,i;try{t=e.getBBox()}catch{t=Vr(e),i=1}return t&&(t.width||t.height)||i||(t=Vr(e)),t&&!t.width&&!t.x&&!t.y?{x:+Yr(e,["x","cx","x1"])||0,y:+Yr(e,["y","cy","y1"])||0,width:0,height:0}:t},na=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&ia(e))},Vt=function(e,t){if(t){var i=e.style,n;t in Wt&&t!==dt&&(t=B),i.removeProperty?(n=t.substr(0,2),(n==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(n==="--"?t:t.replace(Ln,"-$1").toLowerCase())):i.removeAttribute(t)}},qt=function(e,t,i,n,r,a){var s=new nt(e._pt,t,i,0,1,a?Qr:Zr);return e._pt=s,s.b=n,s.e=r,e._props.push(i),s},Ur={deg:1,rad:1,turn:1},Ds={grid:1,flex:1},Yt=function o(e,t,i,n){var r=parseFloat(i)||0,a=(i+"").trim().substr((r+"").length)||"px",s=se.style,l=_s.test(t),d=e.tagName.toLowerCase()==="svg",c=(d?"client":"offset")+(l?"Width":"Height"),h=100,m=n==="px",p=n==="%",g,u,f,y;if(n===a||!r||Ur[n]||Ur[a])return r;if(a!=="px"&&!m&&(r=o(e,t,i,"px")),y=e.getCTM&&na(e),(p||a==="%")&&(Wt[t]||~t.indexOf("adius")))return g=y?e.getBBox()[l?"width":"height"]:e[c],V(p?r/g*h:r/100*g);if(s[l?"width":"height"]=h+(m?a:n),u=n!=="rem"&&~t.indexOf("adius")||n==="em"&&e.appendChild&&!d?e:e.parentNode,y&&(u=(e.ownerSVGElement||{}).parentNode),(!u||u===Bt||!u.appendChild)&&(u=Bt.body),f=u._gsap,f&&p&&f.width&&l&&f.time===ot.time&&!f.uncache)return V(r/f.width*h);if(p&&(t==="height"||t==="width")){var w=e.style[t];e.style[t]=h+n,g=e[c],w?e.style[t]=w:Vt(e,t)}else(p||a==="%")&&!Ds[ft(u,"display")]&&(s.position=ft(e,"position")),u===e&&(s.position="static"),u.appendChild(se),g=se[c],u.removeChild(se),s.position="absolute";return l&&p&&(f=$t(u),f.time=ot.time,f.width=u[c]),V(m?g*r/h:g&&r?h/g*r:0)},Ft=function(e,t,i,n){var r;return Pn||En(),t in Et&&t!=="transform"&&(t=Et[t],~t.indexOf(",")&&(t=t.split(",")[0])),Wt[t]&&t!=="transform"?(r=Ge(e,n),r=t!=="transformOrigin"?r[t]:r.svg?r.origin:fi(ft(e,dt))+" "+r.zOrigin+"px"):(r=e.style[t],(!r||r==="auto"||n||~(r+"").indexOf("calc("))&&(r=pi[t]&&pi[t](e,t,i)||ft(e,t)||pn(e,t)||(t==="opacity"?1:0))),i&&!~(r+"").trim().indexOf(" ")?Yt(e,t,r,i)+i:r},Fs=function(e,t,i,n){if(!i||i==="none"){var r=_e(t,e,1),a=r&&ft(e,r,1);a&&a!==i?(t=r,i=a):t==="borderColor"&&(i=ft(e,"borderTopColor"))}var s=new nt(this._pt,e.style,t,0,1,xn),l=0,d=0,c,h,m,p,g,u,f,y,w,x,_,v;if(s.b=i,s.e=n,i+="",n+="",n.substring(0,6)==="var(--"&&(n=ft(e,n.substring(4,n.indexOf(")")))),n==="auto"&&(u=e.style[t],e.style[t]=n,n=ft(e,t)||n,u?e.style[t]=u:Vt(e,t)),c=[i,n],gn(c),i=c[0],n=c[1],m=i.match(ee)||[],v=n.match(ee)||[],v.length){for(;h=ee.exec(n);)f=h[0],w=n.substring(l,h.index),g?g=(g+1)%5:(w.substr(-5)==="rgba("||w.substr(-5)==="hsla(")&&(g=1),f!==(u=m[d++]||"")&&(p=parseFloat(u)||0,_=u.substr((p+"").length),f.charAt(1)==="="&&(f=ie(p,f)+_),y=parseFloat(f),x=f.substr((y+"").length),l=ee.lastIndex-x.length,x||(x=x||lt.units[t]||_,l===n.length&&(n+=x,s.e+=x)),_!==x&&(p=Yt(e,t,u,x)||0),s._pt={_next:s._pt,p:w||d===1?w:",",s:p,c:y-p,m:g&&g<4||t==="zIndex"?Math.round:0});s.c=l<n.length?n.substring(l,n.length):""}else s.r=t==="display"&&n==="none"?Qr:Zr;return dn.test(n)&&(s.e=0),this._pt=s,s},Kr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Ws=function(e){var t=e.split(" "),i=t[0],n=t[1]||"50%";return(i==="top"||i==="bottom"||n==="left"||n==="right")&&(e=i,i=n,n=e),t[0]=Kr[i]||i,t[1]=Kr[n]||n,t.join(" ")},Rs=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,n=i.style,r=t.u,a=i._gsap,s,l,d;if(r==="all"||r===!0)n.cssText="",l=1;else for(r=r.split(","),d=r.length;--d>-1;)s=r[d],Wt[s]&&(l=1,s=s==="transformOrigin"?dt:B),Vt(i,s);l&&(Vt(i,B),a&&(a.svg&&i.removeAttribute("transform"),n.scale=n.rotate=n.translate="none",Ge(i,1),a.uncache=1,Jr(n)))}},pi={clearProps:function(e,t,i,n,r){if(r.data!=="isFromStart"){var a=e._pt=new nt(e._pt,t,i,0,0,Rs);return a.u=n,a.pr=-10,a.tween=r,e._props.push(i),1}}},Ie=[1,0,0,1,0,0],ra={},aa=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},jr=function(e){var t=ft(e,B);return aa(t)?Ie:t.substr(7).match(ln).map(V)},Dn=function(e,t){var i=e._gsap||$t(e),n=e.style,r=jr(e),a,s,l,d;return i.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?Ie:r):(r===Ie&&!e.offsetParent&&e!==ye&&!i.svg&&(l=n.display,n.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(d=1,s=e.nextElementSibling,ye.appendChild(e)),r=jr(e),l?n.display=l:Vt(e,"display"),d&&(s?a.insertBefore(e,s):a?a.appendChild(e):ye.removeChild(e))),t&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},Mn=function(e,t,i,n,r,a){var s=e._gsap,l=r||Dn(e,!0),d=s.xOrigin||0,c=s.yOrigin||0,h=s.xOffset||0,m=s.yOffset||0,p=l[0],g=l[1],u=l[2],f=l[3],y=l[4],w=l[5],x=t.split(" "),_=parseFloat(x[0])||0,v=parseFloat(x[1])||0,A,T,b,S;i?l!==Ie&&(T=p*f-g*u)&&(b=_*(f/T)+v*(-u/T)+(u*w-f*y)/T,S=_*(-g/T)+v*(p/T)-(p*w-g*y)/T,_=b,v=S):(A=ia(e),_=A.x+(~x[0].indexOf("%")?_/100*A.width:_),v=A.y+(~(x[1]||x[0]).indexOf("%")?v/100*A.height:v)),n||n!==!1&&s.smooth?(y=_-d,w=v-c,s.xOffset=h+(y*p+w*u)-y,s.yOffset=m+(y*g+w*f)-w):s.xOffset=s.yOffset=0,s.xOrigin=_,s.yOrigin=v,s.smooth=!!n,s.origin=t,s.originIsAbsolute=!!i,e.style[dt]="0px 0px",a&&(qt(a,s,"xOrigin",d,_),qt(a,s,"yOrigin",c,v),qt(a,s,"xOffset",h,s.xOffset),qt(a,s,"yOffset",m,s.yOffset)),e.setAttribute("data-svg-origin",_+" "+v)},Ge=function(e,t){var i=e._gsap||new yn(e);if("x"in i&&!t&&!i.uncache)return i;var n=e.style,r=i.scaleX<0,a="px",s="deg",l=getComputedStyle(e),d=ft(e,dt)||"0",c,h,m,p,g,u,f,y,w,x,_,v,A,T,b,S,k,D,F,E,P,$,W,R,j,St,rt,gt,Pt,Tt,ht,yt;return c=h=m=u=f=y=w=x=_=0,p=g=1,i.svg=!!(e.getCTM&&na(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(n[B]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[B]!=="none"?l[B]:"")),n.scale=n.rotate=n.translate="none"),T=Dn(e,i.svg),i.svg&&(i.uncache?(j=e.getBBox(),d=i.xOrigin-j.x+"px "+(i.yOrigin-j.y)+"px",R=""):R=!t&&e.getAttribute("data-svg-origin"),Mn(e,R||d,!!R||i.originIsAbsolute,i.smooth!==!1,T)),v=i.xOrigin||0,A=i.yOrigin||0,T!==Ie&&(D=T[0],F=T[1],E=T[2],P=T[3],c=$=T[4],h=W=T[5],T.length===6?(p=Math.sqrt(D*D+F*F),g=Math.sqrt(P*P+E*E),u=D||F?ge(F,D)*oe:0,w=E||P?ge(E,P)*oe+u:0,w&&(g*=Math.abs(Math.cos(w*we))),i.svg&&(c-=v-(v*D+A*E),h-=A-(v*F+A*P))):(yt=T[6],Tt=T[7],rt=T[8],gt=T[9],Pt=T[10],ht=T[11],c=T[12],h=T[13],m=T[14],b=ge(yt,Pt),f=b*oe,b&&(S=Math.cos(-b),k=Math.sin(-b),R=$*S+rt*k,j=W*S+gt*k,St=yt*S+Pt*k,rt=$*-k+rt*S,gt=W*-k+gt*S,Pt=yt*-k+Pt*S,ht=Tt*-k+ht*S,$=R,W=j,yt=St),b=ge(-E,Pt),y=b*oe,b&&(S=Math.cos(-b),k=Math.sin(-b),R=D*S-rt*k,j=F*S-gt*k,St=E*S-Pt*k,ht=P*k+ht*S,D=R,F=j,E=St),b=ge(F,D),u=b*oe,b&&(S=Math.cos(b),k=Math.sin(b),R=D*S+F*k,j=$*S+W*k,F=F*S-D*k,W=W*S-$*k,D=R,$=j),f&&Math.abs(f)+Math.abs(u)>359.9&&(f=u=0,y=180-y),p=V(Math.sqrt(D*D+F*F+E*E)),g=V(Math.sqrt(W*W+yt*yt)),b=ge($,W),w=Math.abs(b)>2e-4?b*oe:0,_=ht?1/(ht<0?-ht:ht):0),i.svg&&(R=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!aa(ft(e,B)),R&&e.setAttribute("transform",R))),Math.abs(w)>90&&Math.abs(w)<270&&(r?(p*=-1,w+=u<=0?180:-180,u+=u<=0?180:-180):(g*=-1,w+=w<=0?180:-180)),t=t||i.uncache,i.x=c-((i.xPercent=c&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-c)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+a,i.y=h-((i.yPercent=h&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-h)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+a,i.z=m+a,i.scaleX=V(p),i.scaleY=V(g),i.rotation=V(u)+s,i.rotationX=V(f)+s,i.rotationY=V(y)+s,i.skewX=w+s,i.skewY=x+s,i.transformPerspective=_+a,(i.zOrigin=parseFloat(d.split(" ")[2])||!t&&i.zOrigin||0)&&(n[dt]=fi(d)),i.xOffset=i.yOffset=0,i.force3D=lt.force3D,i.renderTransform=i.svg?Ns:ea?oa:zs,i.uncache=0,i},fi=function(e){return(e=e.split(" "))[0]+" "+e[1]},Cn=function(e,t,i){var n=Q(t);return V(parseFloat(t)+parseFloat(Yt(e,"x",i+"px",n)))+n},zs=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,oa(e,t)},re="0deg",$e="0px",ae=") ",oa=function(e,t){var i=t||this,n=i.xPercent,r=i.yPercent,a=i.x,s=i.y,l=i.z,d=i.rotation,c=i.rotationY,h=i.rotationX,m=i.skewX,p=i.skewY,g=i.scaleX,u=i.scaleY,f=i.transformPerspective,y=i.force3D,w=i.target,x=i.zOrigin,_="",v=y==="auto"&&e&&e!==1||y===!0;if(x&&(h!==re||c!==re)){var A=parseFloat(c)*we,T=Math.sin(A),b=Math.cos(A),S;A=parseFloat(h)*we,S=Math.cos(A),a=Cn(w,a,T*S*-x),s=Cn(w,s,-Math.sin(A)*-x),l=Cn(w,l,b*S*-x+x)}f!==$e&&(_+="perspective("+f+ae),(n||r)&&(_+="translate("+n+"%, "+r+"%) "),(v||a!==$e||s!==$e||l!==$e)&&(_+=l!==$e||v?"translate3d("+a+", "+s+", "+l+") ":"translate("+a+", "+s+ae),d!==re&&(_+="rotate("+d+ae),c!==re&&(_+="rotateY("+c+ae),h!==re&&(_+="rotateX("+h+ae),(m!==re||p!==re)&&(_+="skew("+m+", "+p+ae),(g!==1||u!==1)&&(_+="scale("+g+", "+u+ae),w.style[B]=_||"translate(0, 0)"},Ns=function(e,t){var i=t||this,n=i.xPercent,r=i.yPercent,a=i.x,s=i.y,l=i.rotation,d=i.skewX,c=i.skewY,h=i.scaleX,m=i.scaleY,p=i.target,g=i.xOrigin,u=i.yOrigin,f=i.xOffset,y=i.yOffset,w=i.forceCSS,x=parseFloat(a),_=parseFloat(s),v,A,T,b,S;l=parseFloat(l),d=parseFloat(d),c=parseFloat(c),c&&(c=parseFloat(c),d+=c,l+=c),l||d?(l*=we,d*=we,v=Math.cos(l)*h,A=Math.sin(l)*h,T=Math.sin(l-d)*-m,b=Math.cos(l-d)*m,d&&(c*=we,S=Math.tan(d-c),S=Math.sqrt(1+S*S),T*=S,b*=S,c&&(S=Math.tan(c),S=Math.sqrt(1+S*S),v*=S,A*=S)),v=V(v),A=V(A),T=V(T),b=V(b)):(v=h,b=m,A=T=0),(x&&!~(a+"").indexOf("px")||_&&!~(s+"").indexOf("px"))&&(x=Yt(p,"x",a,"px"),_=Yt(p,"y",s,"px")),(g||u||f||y)&&(x=V(x+g-(g*v+u*T)+f),_=V(_+u-(g*A+u*b)+y)),(n||r)&&(S=p.getBBox(),x=V(x+n/100*S.width),_=V(_+r/100*S.height)),S="matrix("+v+","+A+","+T+","+b+","+x+","+_+")",p.setAttribute("transform",S),w&&(p.style[B]=S)},Hs=function(e,t,i,n,r){var a=360,s=K(r),l=parseFloat(r)*(s&&~r.indexOf("rad")?oe:1),d=l-n,c=n+d+"deg",h,m;return s&&(h=r.split("_")[1],h==="short"&&(d%=a,d!==d%(a/2)&&(d+=d<0?a:-a)),h==="cw"&&d<0?d=(d+a*Br)%a-~~(d/a)*a:h==="ccw"&&d>0&&(d=(d-a*Br)%a-~~(d/a)*a)),e._pt=m=new nt(e._pt,t,i,n,d,vs),m.e=c,m.u="deg",e._props.push(i),m},Xr=function(e,t){for(var i in t)e[i]=t[i];return e},$s=function(e,t,i){var n=Xr({},i._gsap),r="perspective,force3D,transformOrigin,svgOrigin",a=i.style,s,l,d,c,h,m,p,g;n.svg?(d=i.getAttribute("transform"),i.setAttribute("transform",""),a[B]=t,s=Ge(i,1),Vt(i,B),i.setAttribute("transform",d)):(d=getComputedStyle(i)[B],a[B]=t,s=Ge(i,1),a[B]=d);for(l in Wt)d=n[l],c=s[l],d!==c&&r.indexOf(l)<0&&(p=Q(d),g=Q(c),h=p!==g?Yt(i,l,d,g):parseFloat(d),m=parseFloat(c),e._pt=new nt(e._pt,s,l,h,m-h,An),e._pt.u=g||0,e._props.push(l));Xr(s,n)};it("padding,margin,Width,Radius",function(o,e){var t="Top",i="Right",n="Bottom",r="Left",a=(e<3?[t,i,n,r]:[t+r,t+i,n+i,n+r]).map(function(s){return e<2?o+s:"border"+s+o});pi[e>1?"border"+o:o]=function(s,l,d,c,h){var m,p;if(arguments.length<4)return m=a.map(function(g){return Ft(s,g,d)}),p=m.join(" "),p.split(m[0]).length===5?m[0]:p;m=(c+"").split(" "),p={},a.forEach(function(g,u){return p[g]=m[u]=m[u]||m[(u-1)/2|0]}),s.init(l,p,h)}});var Fn={name:"css",register:En,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,n,r){var a=this._props,s=e.style,l=i.vars.startAt,d,c,h,m,p,g,u,f,y,w,x,_,v,A,T,b,S;Pn||En(),this.styles=this.styles||ta(e),b=this.styles.props,this.tween=i;for(u in t)if(u!=="autoRound"&&(c=t[u],!(at[u]&&_n(u,t,i,n,e,r)))){if(p=typeof c,g=pi[u],p==="function"&&(c=c.call(i,n,e,r),p=typeof c),p==="string"&&~c.indexOf("random(")&&(c=fe(c)),g)g(this,e,u,c,i)&&(T=1);else if(u.substr(0,2)==="--")d=(getComputedStyle(e).getPropertyValue(u)+"").trim(),c+="",Lt.lastIndex=0,Lt.test(d)||(f=Q(d),y=Q(c),y?f!==y&&(d=Yt(e,u,d,y)+y):f&&(c+=f)),this.add(s,"setProperty",d,c,n,r,0,0,u),a.push(u),b.push(u,0,s[u]);else if(p!=="undefined"){if(l&&u in l?(d=typeof l[u]=="function"?l[u].call(i,n,e,r):l[u],K(d)&&~d.indexOf("random(")&&(d=fe(d)),Q(d+"")||d==="auto"||(d+=lt.units[u]||Q(Ft(e,u))||""),(d+"").charAt(1)==="="&&(d=Ft(e,u))):d=Ft(e,u),m=parseFloat(d),w=p==="string"&&c.charAt(1)==="="&&c.substr(0,2),w&&(c=c.substr(2)),h=parseFloat(c),u in Et&&(u==="autoAlpha"&&(m===1&&Ft(e,"visibility")==="hidden"&&h&&(m=0),b.push("visibility",0,s.visibility),qt(this,s,"visibility",m?"inherit":"hidden",h?"inherit":"hidden",!h)),u!=="scale"&&u!=="transform"&&(u=Et[u],~u.indexOf(",")&&(u=u.split(",")[0]))),x=u in Wt,x){if(this.styles.save(u),S=c,p==="string"&&c.substring(0,6)==="var(--"){if(c=ft(e,c.substring(4,c.indexOf(")"))),c.substring(0,5)==="calc("){var k=e.style.perspective;e.style.perspective=c,c=ft(e,"perspective"),k?e.style.perspective=k:Vt(e,"perspective")}h=parseFloat(c)}if(_||(v=e._gsap,v.renderTransform&&!t.parseTransform||Ge(e,t.parseTransform),A=t.smoothOrigin!==!1&&v.smooth,_=this._pt=new nt(this._pt,s,B,0,1,v.renderTransform,v,0,-1),_.dep=1),u==="scale")this._pt=new nt(this._pt,v,"scaleY",v.scaleY,(w?ie(v.scaleY,w+h):h)-v.scaleY||0,An),this._pt.u=0,a.push("scaleY",u),u+="X";else if(u==="transformOrigin"){b.push(dt,0,s[dt]),c=Ws(c),v.svg?Mn(e,c,0,A,0,this):(y=parseFloat(c.split(" ")[2])||0,y!==v.zOrigin&&qt(this,v,"zOrigin",v.zOrigin,y),qt(this,s,u,fi(d),fi(c)));continue}else if(u==="svgOrigin"){Mn(e,c,1,A,0,this);continue}else if(u in ra){Hs(this,v,u,m,w?ie(m,w+c):c);continue}else if(u==="smoothOrigin"){qt(this,v,"smooth",v.smooth,c);continue}else if(u==="force3D"){v[u]=c;continue}else if(u==="transform"){$s(this,c,e);continue}}else u in s||(u=_e(u)||u);if(x||(h||h===0)&&(m||m===0)&&!bs.test(c)&&u in s)f=(d+"").substr((m+"").length),h||(h=0),y=Q(c)||(u in lt.units?lt.units[u]:f),f!==y&&(m=Yt(e,u,d,y)),this._pt=new nt(this._pt,x?v:s,u,m,(w?ie(m,w+h):h)-m,!x&&(y==="px"||u==="zIndex")&&t.autoRound!==!1?Ts:An),this._pt.u=y||0,x&&S!==c?(this._pt.b=d,this._pt.e=S,this._pt.r=Ss):f!==y&&y!=="%"&&(this._pt.b=d,this._pt.r=xs);else if(u in s)Fs.call(this,e,u,d,w?w+c:c);else if(u in e)this.add(e,u,d||e[u],w?w+c:c,n,r);else if(u!=="parseTransform"){di(u,c);continue}x||(u in s?b.push(u,0,s[u]):typeof e[u]=="function"?b.push(u,2,e[u]()):b.push(u,1,d||e[u])),a.push(u)}}T&&Tn(this)},render:function(e,t){if(t.tween._time||!On())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Ft,aliases:Et,getSetter:function(e,t,i){var n=Et[t];return n&&n.indexOf(",")<0&&(t=n),t in Wt&&t!==dt&&(e._gsap.x||Ft(e,"x"))?i&&Gr===i?t==="scale"?Es:ks:(Gr=i||{})&&(t==="scale"?Ms:Ps):e.style&&!li(e.style[t])?Cs:~t.indexOf("-")?As:mi(e,t)},core:{_removeProperty:Vt,_getMatrix:Dn}};et.utils.checkPrefix=_e;et.core.getStyleSaver=ta;(function(o,e,t,i){var n=it(o+","+e+","+t,function(r){Wt[r]=1});it(e,function(r){lt.units[r]="deg",ra[r]=1}),Et[n[13]]=o+","+e,it(i,function(r){var a=r.split(":");Et[a[1]]=n[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");it("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(o){lt.units[o]="px"});et.registerPlugin(Fn);var Wn=et.registerPlugin(Fn)||et,td=Wn.core.Tween;var sa={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},ct={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},Rn={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},zn={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"};var la={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},be={humidity:"65%",windSpeed:"10 km/h",pressure:"1013 hPa",indoorTemperature:"22\xB0",indoorHumidity:"45%"},da="1.1.0",ca={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function Is(o){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(o)}function ha(o,e=-1/0,t=1/0){return typeof o=="number"&&!isNaN(o)&&o>=e&&o<=t}function qe(o){return typeof o!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(o)||/^rgba?\(\s*[\d.,%\s/]+\)$/.test(o)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(o.toLowerCase())}function M(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ve(o,e){return Object.prototype.hasOwnProperty.call(o,e)?o[e]:void 0}function ua(o){let e=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:t,label:i,value:n,placeholder:r,hint:a,type:s,min:l,max:d}=o,c=[`id="${M(t)}"`,`label="${M(i)}"`,`value="${M(n)}"`,r?`placeholder="${M(r)}"`:"",s?`type="${s}"`:"",l!==void 0?`min="${l}"`:"",d!==void 0?`max="${d}"`:"",a?e==="ha-input"?`hint="${M(a)}"`:`helper="${M(a)}" helperPersistent`:""].filter(Boolean);return`<${e} ${c.join(" ")}></${e}>`}function Ut(o,e,t=0){if(!isFinite(o))return"--";let i=e?.locale?.language||e?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(i,{minimumFractionDigits:t,maximumFractionDigits:t}).format(o)}catch{return o.toFixed(t)}}function gi(o,e,t){if(o?.localize)try{let i=o.localize(e);if(i&&i!==e)return i}catch{}return t}function ma(o,e){if(!isFinite(o))return 0;switch((e||"km/h").toLowerCase()){case"m/s":return o*3.6;case"mph":return o*1.609344;case"ft/s":return o*1.09728;case"kn":case"kt":case"knots":return o*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,o),1.5)*3.6;default:return o}}function C(o,e,...t){o&&console.log(`[AWC Dev] ${e}`,...t)}function X(o,e){let t=o.engine_settings||{},i=(a,s,l,d)=>ha(a,l,d)?a:s,n=i(t.windSpeed,ct.windSpeed,.1,15),r=n;return ha(e,0,200)&&(r=Math.max(.1,Math.min(15,e/10*n))),{windSpeed:r,rainCount:i(t.rainCount,ct.rainCount,.1,10),leafCount:i(t.leafCount,ct.leafCount,.1,10),snowCount:i(t.snowCount,ct.snowCount,.1,10),cloudBaseSize:i(t.cloudBaseSize,ct.cloudBaseSize,.3,2.5),cloudCount:i(t.cloudCount,ct.cloudCount,1,20),splashBounce:i(t.splashBounce,ct.splashBounce,40,120)}}function Nn(o){o.forEach(e=>{e!=null&&clearTimeout(e)}),o.length=0}function pa(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.getTweensOf(e).forEach(t=>t.pause())})}function fa(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.getTweensOf(e).forEach(t=>t.resume())})}function Hn(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)})}function yi(o,e,t,i,n){if(typeof o!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(e&&Is(o))return o;if(e)return console.warn(`Invalid dev mode condition: ${o}, using sunny`),"sunny";let r=o.toLowerCase();if(r.includes("sleet")&&(r.includes("lightning")||r.includes("thunder")||r.includes("storm")))return"sleety-stormy";if((r.includes("snow")||r.includes("sleet"))&&(r.includes("lightning")||r.includes("thunder")||r.includes("storm")))return"snowy-stormy";if(r.includes("lightning")||r.includes("thunder")||r.includes("storm"))return"stormy";if(r.includes("fog")||r.includes("mist"))return"foggy";if(r.includes("heavy")&&r.includes("rain"))return"pouring";if(r.includes("pouring")||r.includes("downpour"))return"pouring";if((r.includes("snow")||r.includes("sleet"))&&(r.includes("rain")||r.includes("drizzle")))return"snowy-rainy";if(r.includes("light")&&(r.includes("rain")||r.includes("drizzle")))return"light-rain";if(r.includes("rain")||r.includes("drizzle"))return"rainy";if(r.includes("sleet")||r.includes("hail"))return"sleety";if(r.includes("snow"))return"snowy";if(r.includes("wind"))return"windy";if(r.includes("partly")&&r.includes("cloud"))return"partly-cloudy";if(r.includes("cloud")||r.includes("overcast"))return"cloudy";if(r.includes("clear")||r.includes("sunny")){let a=new Date,s;if(n)try{let h=new Intl.DateTimeFormat("en-US",{timeZone:n,hour:"numeric",hour12:!1}).formatToParts(a);s=parseInt(h.find(m=>m.type==="hour")?.value||"0",10)}catch{s=a.getHours()}else s=a.getHours();let l=t??6,d=i??20;return(s<l||s>=d)&&r.includes("clear")?"clear-night":"sunny"}return"sunny"}function Ye(o,e,t){if(typeof o!="string"||!o.trim())return console.warn("Invalid animation type provided"),t||Be("rain");if(!e||!e.isEnabled())return t||Be(o);let i=ca[o];if(!i)return console.warn(`No color scheme found for animation type: ${o}`),t||Be(o);try{let n=e.getCurrentState(),r=e.getTimeAwareColor(i);return qe(r)?r:(console.warn(`Invalid color returned from time manager: ${r}`),t||Be(o))}catch(n){return console.error("Error getting time-aware color:",n),t||Be(o)}}function Be(o){let t={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[o];return t||(console.warn(`Unknown animation type: ${o}, using white as fallback`),"#FFFFFF")}var wi=class wi{constructor(e,t,i){this.animationHandles=[];this.timeouts=[];this.particles=[];this.element=e,this.config=t,this.cardConfig=i,this.state="created",queueMicrotask(()=>C(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){C(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),C(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(e){throw console.error(`Failed to start ${this.animationType} animation:`,e),this.setState("stopped"),e}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),C(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(e){throw console.error(`Failed to stop ${this.animationType} animation:`,e),e}}async pause(){if(this.state==="active")try{C(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(e){throw console.error(`Failed to pause ${this.animationType} animation:`,e),e}}async resume(){if(this.state==="paused")try{C(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(e){throw console.error(`Failed to resume ${this.animationType} animation:`,e),this.setState("paused"),e}}setWindSpeed(e){this.realWindSpeed=e,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),C(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}setState(e){let t=this.state;this.state=e,C(this.config.devMode,`${this.animationType} state: ${t} \u2192 ${e}`)}ensureLayerVisibility(e){if(this.containerSelector){let i=this.element.querySelector(this.containerSelector);i&&(i.style.display=e?"block":"none",C(this.config.devMode,`Set ${this.animationType} container visibility: ${e}`))}let t=this.element.querySelector(this.layerSelector);t&&!wi.SHARED_LAYERS.includes(this.layerSelector)&&(t.style.opacity=e?"1":"0",C(this.config.devMode,`Set ${this.animationType} layer opacity: ${e?1:0}`))}cleanup(){this.animationHandles.forEach(e=>{e&&clearInterval(e)}),this.animationHandles=[],this.timeouts.forEach(e=>{if(e)if(typeof e=="function"){let t=e();t&&clearTimeout(t)}else clearTimeout(e)}),this.timeouts=[],window.AnimatedWeatherCardGsap&&this.particles.forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)}),this.particles.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.particles=[],C(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(e){this.animationHandles.push(e)}addTimeout(e){this.timeouts.push(e)}addParticle(e){this.particles.push(e)}removeParticle(e){let t=this.particles.indexOf(e);t>-1&&this.particles.splice(t,1)}};wi.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var U=wi;var Kt=class{constructor(e,t,i){this.layer=e;this.create=t;this.cycle=i;this.items=[];this.running=!1;this.paused=!1}start(e){this.running=!0;let t=[];for(let i=0;i<e;i++){let n=this.create(i);this.layer.appendChild(n);let r={el:n};this.items.push(r),t.push(n),this.run(r,!0)}return t}run(e,t){this.running&&(e.anim=this.cycle(e.el,()=>this.run(e,!1),t),this.paused&&e.anim.pause())}pause(){this.paused=!0,this.items.forEach(e=>e.anim?.pause())}resume(){this.paused=!1,this.items.forEach(e=>e.anim?.resume())}stop(){this.running=!1,this.items.forEach(e=>{e.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(e.el),e.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(e=>e.el)}};function ve(o,e){return e&&o.progress(Math.random()),o}var Gs=420*230;function xe(o,e){return Math.min(3,Math.max(.6,o*e/Gs))||1}function L(o,e){return o+Math.random()*(e-o)}var Bs={light:10,rain:18,storm:24,pouring:32},qs={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},Vs={light:16,rain:24,storm:34,pouring:42},Ys=.3,Us=16,Ks=8,js=[10,30],ga="http://www.w3.org/2000/svg";function Xs(o,e,t,i){let n=0,r=0,a=0;for(let s=1;s<=16;s++){let l=s/16,d=2*(1-l)*l*o+l*l*t,c=2*(1-l)*l*e+l*l*i;n+=Math.hypot(d-r,c-a),r=d,a=c}return n}function Zs(o,e,t,i){return Math.max(4,Math.round(Bs[o]*e*xe(t,i)))}var _i=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=r,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...i},C(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start rain animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Rain layer not found: ${this.layerSelector}`);let i=X(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=this.rainKind(),a=Zs(r,i.rainCount,n.offsetWidth,n.offsetHeight),s=this.getRainColor(this.element.timeOfDayManager),l=this.cardConfig.spill_particles!==!1,d=Vs[r],c=r==="pouring"?3:2.4;this.splashLayer=t,this.splashColor=s,this.splashBounce=i.splashBounce/ct.splashBounce,this.pool=new Kt(t,()=>{let h=L(1,c),m=document.createElement("div");return m.className="raindrop",m.style.cssText=`
                    width: ${h.toFixed(2)}px;
                    height: ${d}px;
                    background: linear-gradient(0deg, ${s}, transparent);
                    border-radius: ${h.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,m.dataset.width=h.toFixed(2),m},(h,m,p)=>this.fall(h,n,r,d,l,m,p)),this.pool.start(a).forEach(h=>this.addParticle(h)),C(this.config.devMode,`Rain animation started - ${a} drops (${r})`)}fall(t,i,n,r,a,s,l){let d=i.offsetWidth,c=i.offsetHeight,[h,m]=qs[n],p=L(h,m),g=L(6,Math.max(7,d-6)),u=this.rainConfig.splashEnabled&&Math.random()<Ys,f=-r,y=u?c-r:a?c+L(60,120):c,w=Math.max(.25,(y-f)/p),x=parseFloat(t.dataset.width||"2");window.AnimatedWeatherCardGsap.set(t,{x:g,scaleY:1,opacity:.55+.45*Math.min(1,x/2.4)});let _=window.AnimatedWeatherCardGsap.timeline({onComplete:s});if(_.fromTo(t,{y:f},{y,duration:w,ease:"none"}),u)_.call(()=>this.createSplash(g+x/2,c),[],w),_.to(t,{scaleY:0,duration:r/p,ease:"none"},w);else if(a){let v=(c-r-f)/p;_.to(t,{opacity:0,duration:w-v,ease:"power1.in"},v)}return ve(_,l)}async onStop(){this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()}),this.splashDots=[],this.rebounds.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf([t,t.firstChild]),t.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(t=>t.remove()),C(this.config.devMode,"Rain animation stopped")}async onPause(){this.pool?.pause(),C(this.config.devMode,"Rain animation paused")}async onResume(){this.pool?.resume(),C(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(t,i){if(!(!window.AnimatedWeatherCardGsap||!this.splashLayer)){this.createRebound(t,i);for(let n of[-1,1]){let r=this.splashDots[this.nextSplashDot];r||(r=document.createElement("div"),r.className="rain-splash",r.style.background=this.splashColor,this.splashLayer.appendChild(r),this.splashDots[this.nextSplashDot]=r),this.nextSplashDot=(this.nextSplashDot+1)%Us;let a=L(.22,.28),s=L(4,10)*this.splashBounce,l=n*L(6,12)*this.splashBounce;window.AnimatedWeatherCardGsap.killTweensOf(r),window.AnimatedWeatherCardGsap.set(r,{x:t-1,y:i-2,opacity:.9}),window.AnimatedWeatherCardGsap.timeline().to(r,{x:t-1+l,duration:a,ease:"power1.out"},0).to(r,{y:i-2-s,duration:a*.45,ease:"power2.out"},0).to(r,{y:i-2,duration:a*.55,ease:"power2.in"},a*.45).to(r,{opacity:0,duration:a*.4,ease:"power1.in"},a*.6)}}}createRebound(t,i){let n=this.splashLayer,r=this.rebounds[this.nextRebound];if(!r){r=document.createElementNS(ga,"svg"),r.classList.add("rain-rebound");let u=document.createElementNS(ga,"path");u.setAttribute("fill","none"),u.style.stroke=this.splashColor,r.appendChild(u),n.appendChild(r),this.rebounds[this.nextRebound]=r}this.nextRebound=(this.nextRebound+1)%Ks;let a=r.firstChild,[s,l]=js,d=L(s,l)*this.splashBounce,c=(Math.random()<.5?-1:1)*L(10,24)*this.splashBounce,h=L(6,18);a.setAttribute("d",`M 0,0 Q ${c.toFixed(1)},${(-2*d).toFixed(1)} ${(2*c).toFixed(1)},${h.toFixed(1)}`);let m=Xs(c,-2*d,2*c,h),p=Math.min(m*.45,6+d*.3);a.style.strokeDasharray=`${p.toFixed(1)} ${(m+p).toFixed(1)}`;let g=L(.42,.56);window.AnimatedWeatherCardGsap.killTweensOf([r,a]),window.AnimatedWeatherCardGsap.set(r,{x:t,y:i,opacity:.85}),window.AnimatedWeatherCardGsap.timeline().fromTo(a,{strokeDashoffset:p,strokeWidth:1.6},{strokeDashoffset:-m,strokeWidth:.6,duration:g,ease:"power2.out"},0).to(r,{opacity:0,duration:g*.35,ease:"power1.in"},g*.65)}getRainColor(t){return this.rainConfig.isStorm?Ye("lightning",t,"var(--weather-storm-rain-color)"):Ye("rain",t,"var(--weather-rain-color)")}};var Qs=36,jt=[2,6],$n=[20,38],ya=10,Js=.6;function tl(o,e,t){return Math.max(6,Math.round(Qs*o*xe(e,t)))}function Gn(o){return Math.min(2.2,Math.max(.3,o/ct.windSpeed))}var bi=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.swings=[];this.realWindSpeed=r,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...i},C(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start snow animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Snow layer not found: ${this.layerSelector}`);let i=X(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=tl(i.snowCount,n.offsetWidth,n.offsetHeight),a="#ffffff",s=this.cardConfig.spill_particles!==!1,l=Gn(i.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation(),this.pool=new Kt(t,()=>this.createFlake(a),(d,c,h)=>this.fall(d,n,l,s,c,h)),this.pool.start(r).forEach(d=>this.addParticle(d)),C(this.config.devMode,`Snow animation started - ${r} flakes`)}createFlake(t){let i=L(jt[0],jt[1]),n=(i-jt[0])/(jt[1]-jt[0]),r=document.createElement("div");r.className="snowflake",r.dataset.size=i.toFixed(2),r.style.cssText=`
            width: ${i.toFixed(2)}px;
            height: ${i.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${t}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,r.dataset.opacity=(.45+.45*n).toFixed(2),window.AnimatedWeatherCardGsap.set(r,{transformOrigin:"50% -500%",rotation:-ya});let a=window.AnimatedWeatherCardGsap.to(r,{rotation:ya,duration:L(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return a.progress(Math.random()),this.swings.push(a),r}fall(t,i,n,r,a,s){let l=i.offsetWidth,d=i.offsetHeight,c=parseFloat(t.dataset.size||"4"),h=(c-jt[0])/(jt[1]-jt[0]),m=($n[0]+($n[1]-$n[0])*h)*L(.9,1.1),p=this.snowConfig.accumulation&&Math.random()<Js,g=-c*2,u=p?d-this.pileHeight()-c:r?d+L(60,120):d+c,f=u-g,y=Math.max(.5,f/m),w=f*L(.04,.13)*n,x=L(-w,Math.max(1,l-c));window.AnimatedWeatherCardGsap.set(t,{x,opacity:parseFloat(t.dataset.opacity||"0.7")});let _=window.AnimatedWeatherCardGsap.timeline({onComplete:a});if(_.fromTo(t,{y:g},{y:u,x:x+w,duration:y,ease:"none"}),p)_.call(()=>this.addToAccumulation(),[],y),_.to(t,{opacity:0,duration:.6,ease:"power1.out"},y);else if(r){let v=Math.min(y,(d-g)/m);_.to(t,{opacity:0,duration:Math.max(.1,y-v),ease:"power1.in"},v)}return ve(_,s)}async onStop(){this.swings.forEach(t=>t.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),C(this.config.devMode,"Snow animation stopped")}async onPause(){this.pool?.pause(),this.swings.forEach(t=>t.pause()),C(this.config.devMode,"Snow animation paused")}async onResume(){this.pool?.resume(),this.swings.forEach(t=>t.resume()),C(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let t=this.element.querySelector(".animated-weather-card");if(!t)return;t.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(n=>n.remove());let i=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
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
        `,t.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let t=this.accumulationElement,i=this.snowConfig.accumulationHeight;if(!t?.parentNode||i<=0)return;let n=this.pileHeight();if(n>=i)return;let r=Math.min(i,n+.8);t.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(t,{scaleY:r/i,opacity:Math.min(.9,r/i),duration:.3,ease:"power2.out"})}};var el=30,wa=[150,230],il=.3,vi=6,xi=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.realWindSpeed=r,this.sleetConfig={particleCount:40,...i},C(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start sleet animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let i=X(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=Math.max(6,Math.round(el*i.snowCount*xe(n.offsetWidth,n.offsetHeight))),a=this.cardConfig.spill_particles!==!1,s=Gn(i.windSpeed)*.5;this.pool=new Kt(t,()=>{let l=L(1.5,3.5),d=document.createElement("div");return d.className="sleet-particle-gsap",d.dataset.size=l.toFixed(2),d.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${l.toFixed(2)}px;
                    height: ${l.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,d},(l,d,c)=>this.fall(l,n,s,a,d,c)),this.pool.start(r).forEach(l=>this.addParticle(l)),C(this.config.devMode,`Sleet animation started - ${r} pellets`)}fall(t,i,n,r,a,s){let l=i.offsetWidth,d=i.offsetHeight,c=parseFloat(t.dataset.size||"2"),h=L(wa[0],wa[1]),m=Math.random()<il,p=-c*2,g=m?d-c:r?d+L(60,120):d+c,u=g-p,f=Math.max(.3,u/h),y=u*L(.03,.08)*n,w=L(-y,Math.max(1,l-c));window.AnimatedWeatherCardGsap.set(t,{x:w,opacity:L(.8,1),rotation:L(0,360)});let x=window.AnimatedWeatherCardGsap.timeline({onComplete:a});if(x.fromTo(t,{y:p},{y:g,x:w+y,duration:f,ease:"none"}),m)x.call(()=>this.addToPile(i),[],f),x.to(t,{opacity:0,duration:.3,ease:"power1.out"},f);else if(r){let _=Math.min(f,(d-p)/h);x.to(t,{opacity:0,duration:Math.max(.1,f-_),ease:"power1.in"},_)}return ve(x,s)}addToPile(t){if(this.state!=="active")return;let i=t.querySelector(".sleet-accumulation");i||(i=document.createElement("div"),i.className="sleet-accumulation",i.style.cssText=`
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${vi}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `,t.appendChild(i));let n=parseFloat(i.getAttribute("data-target-height")||"0");if(n>=vi)return;let r=Math.min(vi,n+.4);i.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(i,{scaleY:r/vi,duration:.3,ease:"power2.out"})}async onStop(){this.pool?.stop(),this.pool=void 0;let t=this.element.querySelector(".animated-weather-card");t&&t.querySelectorAll(".sleet-accumulation").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),C(this.config.devMode,"Sleet animation stopped")}async onPause(){this.pool?.pause(),C(this.config.devMode,"Sleet animation paused")}async onResume(){this.pool?.resume(),C(this.config.devMode,"Sleet animation resumed")}};var Bn=[90,160];function _a(o,e,t,i,n,r=!0){let a=document.createElement("div");a.className="leaf-gsap";let s=i.offsetWidth,l=i.offsetHeight,d=20+Math.random()*Math.max(40,l-40),c=Math.random(),h=c<.25,m=c>.8&&d>100;a.style.position="absolute",a.style.borderRadius="0 100% 0 100%",a.style.transformOrigin="center",a.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let p=(Math.random()*8+6)*t;a.style.width=a.style.height=p+"px";let g=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];a.style.background=g[Math.floor(Math.random()*g.length)];let u=-p-10,f=s+(r?60+Math.random()*80:p+10),y=(Bn[0]+Math.random()*(Bn[1]-Bn[0]))*Se(e.windSpeed)*(h?.6:1),w=(f-u)/y,x=Math.min(w,(s-u)/y),_=m?-(60+Math.random()*80):h?80+Math.random()*80:(Math.random()-.5)*80;window.AnimatedWeatherCardGsap.set(a,{x:u,y:d,rotation:Math.random()*360,opacity:0}),o.appendChild(a);let v=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{a.parentNode&&a.parentNode.removeChild(a),n&&n(a)}});return v.to(a,{opacity:.85,duration:.25,ease:"power1.out"},0).to(a,{x:f,duration:w,ease:"none"},0).to(a,{y:d+_,duration:w,ease:h?"sine.in":"sine.inOut"},0).to(a,{rotation:`+=${120+Math.random()*180}`,duration:w,ease:"none"},0),r&&w>x&&v.to(a,{opacity:0,duration:w-x,ease:"power1.in"},x),a}function ba(o,e,t,i,n,r){let a=document.createElement("div");a.className="wind-swoosh-gsap";let s=Math.random(),l=s>.6,d=s>.8;a.style.position="absolute",a.style.height=(d?2:1)*t+"px",a.style.borderRadius=l?"2px 1px":"1px",a.style.transformOrigin="left center",a.style.zIndex="10";let c=n.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";a.style.background=`linear-gradient(90deg, transparent 0%, ${c} 50%, transparent 100%)`;let h=Math.max(15,(20+Math.random()*60)*t);a.style.width=h+"px";let m=i.offsetWidth,p=i.offsetHeight,g=p*.15+Math.random()*(p*.7);window.AnimatedWeatherCardGsap.set(a,{x:-h,y:g,rotation:l?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),o.appendChild(a);let f=(m+h*2)/(nl*Se(e.windSpeed));return window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{a.parentNode&&a.parentNode.removeChild(a),r&&r(a)}}).to(a,{scaleX:1,opacity:d?.35:.22,duration:.3,ease:"power2.out"},0).to(a,{x:m+h,rotation:l?g>p/2?5:-5:0,duration:f,ease:"none"},0).to(a,{opacity:0,scaleX:.3,duration:Math.min(.5,f*.3)},f-Math.min(.5,f*.3)),a}var nl=230,rl=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function Se(o){return Math.min(2.2,Math.max(.6,Math.sqrt(o/ct.windSpeed)))}var al=12;function Ue(o){o.querySelectorAll(".cloud-track, .cloud-gsap").forEach(e=>{window.AnimatedWeatherCardGsap?.killTweensOf(e),e.remove()})}function ol(o){return Math.min(1,Math.max(.5,o/160))||1}function va(o,e,t,i,n){let r=i.offsetWidth,a=i.offsetHeight,s=rl,l=Se(e.windSpeed),d=[],c=t||e.cloudCount,h=ol(a);return s.forEach((m,p)=>{let g=Math.ceil(p===0||p===1?c*.4:c*.6);for(let u=1;u<=g;u++){let f=document.createElement("div");f.className=`cloud-gsap cloud-gsap-${m.name}-${u}`;let y=e.cloudBaseSize*m.scale,w=1+(u-1)*.15,x=Math.max(.3,Math.min(2.5,y))*w*h,_=70,v=26,A=44,T=44,b=35,S=35,k=Math.round(_*x),D=Math.round(v*x);f.style.position="absolute",f.style.width=k+"px",f.style.height=D+"px",f.style.borderRadius="50px",f.style.opacity=m.opacity.toString(),f.style.zIndex=(10+p).toString(),m.blur>0&&(f.style.filter=`blur(${m.blur}px)`);let F=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][p];f.style.background=F;let E=document.createElement("div");E.style.position="absolute",E.style.width=Math.round(A*x)+"px",E.style.height=Math.round(T*x)+"px",E.style.top=Math.round(-22*x)+"px",E.style.left=Math.round(9*x)+"px",E.style.borderRadius="50px",E.style.background=F,f.appendChild(E);let P=document.createElement("div");P.style.position="absolute",P.style.width=Math.round(b*x)+"px",P.style.height=Math.round(S*x)+"px",P.style.top=Math.round(-13*x)+"px",P.style.right=Math.round(9*x)+"px",P.style.borderRadius="50px",P.style.background=F,f.appendChild(P);let W=[[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][p][u-1]||15+p*10,R=Math.max(150+p*50,k+al),j=m.speed*l*(.9+Math.random()*.2),St=(r+2*R)/j,rt=document.createElement("div");rt.className="cloud-track",rt.appendChild(f),window.AnimatedWeatherCardGsap.set(f,{opacity:m.opacity}),window.AnimatedWeatherCardGsap.set(rt,{xPercent:0,x:-R,y:a*W/100}),o.appendChild(rt);let gt=window.AnimatedWeatherCardGsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5});gt.fromTo(rt,{xPercent:0,x:-R},{xPercent:100,x:R,duration:St,ease:"none"}),gt.progress(Math.random()),d.push(gt)}}),d}function xa(o){let e=o.querySelector(".snow-accumulation");e&&(window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(e,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{e.parentNode&&e.parentNode.removeChild(e)}}):e.parentNode?.removeChild(e))}function Sa(o,e,t,i,n){let r=document.createElement("div");r.className=`fog-layer fog-layer-${t}`;let a=i.offsetWidth,s=i.offsetHeight,l=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],d=l[t]||l[2],c=n.custom_colors?.fog_color,h=n.color_palette==="default"?qe(c)?c:"#e0e0e0":"var(--secondary-text-color)",m=3+Math.floor(Math.random()*3),p=a*d.scale;r.style.cssText=`
        position: absolute;
        top: ${20+t*15}%;
        left: -50%;
        width: ${p}px;
        height: ${d.height}px;
        opacity: ${d.opacity};
        filter: blur(${d.blur}px);
        pointer-events: none;
        z-index: ${5+t};
        overflow: visible;
    `;for(let A=0;A<m;A++){let T=document.createElement("div"),b=p/m*(2+Math.random()*1.2),S=d.height*(1.2+Math.random()*1.6),k=p/m*A-b*.3,D=(Math.random()-.5)*(d.height*.5);T.style.cssText=`
            position: absolute;
            left: ${k}px;
            top: ${D}px;
            width: ${b}px;
            height: ${S}px;
            background: radial-gradient(ellipse ${b/2}px ${S/2}px at center, 
                ${h} 0%, 
                ${h} 40%, 
                transparent 70%);
            border-radius: ${b/2}px ${S/2}px;
            opacity: ${.7+Math.random()*.6}; // Varied opacity per segment
        `,r.appendChild(T)}o.appendChild(r);let g=e.windSpeed*(.5+Math.random()*.5),u=15/d.speed,f=Math.max(8,u/g),y=a*d.scale,w=-y,x=a+y;window.AnimatedWeatherCardGsap.set(r,{x:w,opacity:d.opacity});let _=window.AnimatedWeatherCardGsap.timeline({repeat:-1,delay:t*2+Math.random()*3});_.to(r,{x,duration:f,ease:"none",onComplete:()=>{window.AnimatedWeatherCardGsap.set(r,{x:w})}});let v=window.AnimatedWeatherCardGsap.timeline({repeat:-1,yoyo:!0});return v.to(r,{opacity:d.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:_,opacity:v}}function Si(o){o.querySelectorAll(".fog-layer").forEach(t=>{t.parentNode&&t.parentNode.removeChild(t)})}var sl=3,ll=2,Ta=[900,1400],Ca=[1800,2600],Ti=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=r,this.windConfig={leafCount:3,swooshEnabled:!0,...i},C(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(L(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(L(300,900)),C(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(t){let i=X(this.cardConfig,this.realWindSpeed);this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let n=Math.max(1,Math.round(sl*i.leafCount));if(this.leaves.size<n){let r=_a(this.layer(),i,1,this.card(),a=>this.forget(a,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(r),this.addParticle(r)}this.scheduleLeaf(L(Ta[0],Ta[1])/Math.max(.5,i.leafCount))},t)}scheduleSwoosh(t){let i=X(this.cardConfig,this.realWindSpeed);this.swooshTimer=setTimeout(()=>{if(this.state==="active"){if(this.swooshes.size<ll){let n=ba(this.layer(),i,1,this.card(),this.cardConfig,r=>this.forget(r,this.swooshes));this.swooshes.add(n),this.addParticle(n)}this.scheduleSwoosh(L(Ca[0],Ca[1]))}},t)}forget(t,i){i.delete(t),this.removeParticle(t)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),this.leaves.clear(),this.swooshes.clear(),C(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(t=>{window.AnimatedWeatherCardGsap?.getTweensOf(t).forEach(i=>i.pause())}),C(this.config.devMode,"Wind animation paused")}async onResume(){this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(t=>{window.AnimatedWeatherCardGsap?.getTweensOf(t).forEach(i=>i.resume())}),this.clearTimers(),this.scheduleLeaf(L(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(L(600,1500)),C(this.config.devMode,"Wind animation resumed")}};var Ke=[6e3,18e3],dl=[1500,6e3],Aa=.16,Ci=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=r,this.lightningConfig={disableShake:n.disable_lightning_shake||!1,minInterval:Ke[0],maxInterval:Ke[1],...i},C(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start lightning animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Lightning layer not found: ${this.layerSelector}`);t.style.opacity="0";let[i,n]=dl;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},i+Math.random()*(n-i)),this.addTimeout(this.flashTimeout),C(this.config.devMode,"Lightning animation started")}flash(){if(!window.AnimatedWeatherCardGsap||this.state!=="active")return;let t=this.element.querySelector(this.layerSelector),i=this.element.querySelector(".animated-weather-card");if(!t||!i)return;let n=i.offsetWidth,r=i.offsetHeight,a=parseFloat(i.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let l=document.createElementNS("http://www.w3.org/2000/svg","path"),d=30+Math.random()*(n-60),c=20*a,h=20,m=[d+",0"];for(let f=0;f<h;f++){let y=d+(Math.random()*c-c/2),w=r/h*(f+1);m.push(y+","+w)}l.setAttribute("d","M"+m.join(" L"));let p=this.element.timeOfDayManager,g=Ye("lightning",p,"white");l.setAttribute("stroke",g),l.setAttribute("stroke-width",((2+Math.random()*2)*a).toString()),l.setAttribute("fill","none"),s.appendChild(l),t.appendChild(s);let u=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=u,u.set(t,{opacity:.9},0).to(t,{opacity:.3,duration:.06,ease:"none"},0).to(t,{opacity:.8,duration:.04,ease:"none"},.06).to(t,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let f=-6*a;u.to(i,{y:f,duration:.06,ease:"power2.out"},Aa).to(i,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Aa+.06)}}scheduleNext(){if(this.state!=="active")return;let t=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},t),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let t=this.element.querySelector(".animated-weather-card");t&&window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.set(t,{clearProps:"transform"});let i=this.element.querySelector(this.layerSelector);i&&(i.querySelectorAll("svg").forEach(r=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(r.querySelector("path")),r.parentNode&&r.parentNode.removeChild(r)}),i.style.opacity="0"),C(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),C(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),C(this.config.devMode,"Lightning animation resumed")}};var cl=["dawn","day","dusk","night"],Yn=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],hl={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},Ma=(o,e,t)=>Math.min(e,Math.max(o,t)),Xt=(o,e,t)=>o+(e-o)*t;function ul(o,e,t){let i=(e-o+540)%360-180;return(o+i*t+360)%360}function Rt(o,e,t){let i=([u,f,y])=>[u,f*Math.cos(y*Math.PI/180),f*Math.sin(y*Math.PI/180)],[n,r,a]=i(o),[s,l,d]=i(e),c=Xt(n,s,t),h=Xt(r,l,t),m=Xt(a,d,t),p=Math.hypot(h,m),g=p<1e-6?o[2]:(Math.atan2(m,h)*180/Math.PI+360)%360;return[c,p,g]}function qn([o,e,t]){let i=t*Math.PI/180,n=e*Math.cos(i),r=e*Math.sin(i),a=(o+.3963377774*n+.2158037573*r)**3,s=(o-.1055613458*n-.0638541728*r)**3,l=(o-.0894841775*n-1.291485548*r)**3;return[4.0767416621*a-3.3077115913*s+.2309699292*l,-1.2684380046*a+2.6097574011*s-.3413193965*l,-.0041960863*a-.7034186147*s+1.707614701*l]}var ml=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function xt(o){let e=i=>i.every(n=>n>=-1e-4&&n<=1.0001),t=qn(o);if(!e(t)){let i=0,n=o[1];for(let r=0;r<24;r++){let a=(i+n)/2;e(qn([o[0],a,o[2]]))?i=a:n=a}t=qn([o[0],i,o[2]])}return t.map(i=>ml(Ma(0,1,i)))}var Pa=o=>Math.round(Ma(0,1,o)*255);function zt(o){return"#"+o.map(e=>Pa(e).toString(16).padStart(2,"0")).join("")}function ka(o,e){return`rgba(${o.map(Pa).join(", ")}, ${Number(e.toFixed(3))})`}function Vn(o,e){return[.15+(o[0]-.15)*.42,o[1]*Xt(.75,.5,e),ul(o[2],262,.45)]}function pl(o,e){let t=hl[o],i=1-t.overcast*.7,n={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:Xt(.46,.28,t.overcast)};if(o==="clear-night"){if(e==="dawn"||e==="dusk"){let r=e==="dawn"?[.4,.09,20]:[.38,.1,40];return{...n,bottom:Rt(t.bottom,r,.45),glowAlpha:.2,scrimAlpha:.22}}return{...n,scrimAlpha:.2}}switch(e){case"night":return{top:Vn(t.top,t.overcast),mid:Vn(t.mid,t.overcast),bottom:Vn(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:Xt(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:Rt(t.top,[t.top[0]*.8,.075,292],.5*i),mid:Rt(t.mid,[t.mid[0]*.88,.065,350],.42*i),bottom:Rt(t.bottom,[t.bottom[0]*.92,.115,52],.72*i),glow:Rt(t.glow,[.82,.13,58],i),glowAlpha:Xt(t.glowAlpha,.6,i*.6),scrimAlpha:n.scrimAlpha+.04};case"dawn":return{top:Rt(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*i),mid:Rt(t.mid,[t.mid[0]*.95,.05,330],.3*i),bottom:Rt(t.bottom,[t.bottom[0]*.95,.085,32],.62*i),glow:Rt(t.glow,[.88,.09,40],i),glowAlpha:Xt(t.glowAlpha,.5,i*.5),scrimAlpha:n.scrimAlpha+.04};default:return n}}function fl(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function je(o,e){let t=pl(o,e);return{top:zt(xt(t.top)),mid:zt(xt(t.mid)),bottom:zt(xt(t.bottom)),glow:ka(xt(t.glow),t.glowAlpha),scrim:ka(xt(fl(t.top)),t.scrimAlpha)}}var Te=[.985,.006,250],Ai=.8,Oa=.55,La=.4,ki={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},Da={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},Fa={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64};function Ce(o,e){let t=i=>`${Math.round(i*100)}%`;return`radial-gradient(${t(o.rx)} ${t(o.ry)} at ${t(o.cx)} ${t(o.cy)}, ${e}, transparent ${t(o.fade)})`}function Wa(){let o=[];for(let e of Yn)for(let t of cl){let i=je(e,t),n=t==="day"?`.animated-weather-card.${e}`:`.animated-weather-card.${e}[data-phase="${t}"]`;o.push(`${n} { --awc-sky-top: ${i.top}; --awc-sky-mid: ${i.mid}; --awc-sky-bottom: ${i.bottom}; --awc-sky-glow: ${i.glow}; --awc-sky-scrim: ${i.scrim}; }`)}return o.join(`
`)}function Ei(o,e,t){return o==null||!Number.isFinite(o)?t?"day":"night":o<-6?"night":o<6?e?"dawn":"dusk":"day"}var Zt=3.2,Ae="cubic-bezier(0.37, 0, 0.63, 1)",Ra={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},za=Object.keys(Ra),Un=za.filter(o=>o.startsWith("--awc-sky-"));function Na(){return za.map(o=>`${o} ${Zt}s ${Ae}`).join(`,
            `)}var Ea=!1;function Mi(){if(Ea)return;Ea=!0;let o=globalThis.CSS;if(o?.registerProperty)for(let[e,t]of Object.entries(Ra))try{o.registerProperty({name:e,syntax:"<color>",inherits:!0,initialValue:t})}catch{}}var Pi=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.cloudTimelines=[];this.startWindFactor=1;this.realWindSpeed=r,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...i},C(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start clouds animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let i=X(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");Ue(t);let r=Math.min(6,Math.max(1,Math.round(i.cloudCount)));this.cloudsConfig.isPartlyCloudy&&(r=Math.max(1,Math.round(r*.6))),this.cloudTimelines=va(t,i,r,n,this.cardConfig),this.startWindFactor=Se(i.windSpeed),C(this.config.devMode,`Clouds animation started with ${r} clouds`)}async onStop(){this.cloudTimelines.forEach(i=>{window.AnimatedWeatherCardGsap?.killTweensOf(i),i&&typeof i.kill=="function"&&i.kill()}),this.cloudTimelines=[];let t=this.element.querySelector(this.layerSelector);t&&Ue(t),C(this.config.devMode,"Clouds animation stopped")}async onPause(){this.cloudTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),C(this.config.devMode,"Clouds animation paused")}async onResume(){this.cloudTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),C(this.config.devMode,"Clouds animation resumed")}onWindSpeedChange(){if(!window.AnimatedWeatherCardGsap)return;let t=X(this.cardConfig,this.realWindSpeed),i=Se(t.windSpeed)/this.startWindFactor;this.cloudTimelines.forEach(n=>{window.AnimatedWeatherCardGsap.to(n,{timeScale:i,duration:Zt,ease:"sine.inOut",overwrite:!0})})}};var Oi=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=r,this.fogConfig={layerCount:3,...i},C(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start fog animation");let t=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!t)throw new Error("Fog container not found");let i=X(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");Si(n),this.fogTimelines=[];for(let r=0;r<this.fogConfig.layerCount;r++){let a=Sa(t,i,r,n,this.cardConfig);this.fogTimelines.push(a.movement),this.fogTimelines.push(a.opacity)}C(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(n=>{n&&typeof n.kill=="function"&&n.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer")?.forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),C(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),C(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),C(this.config.devMode,"Fog animation resumed")}};var gl=1/3,yl=.35,Li=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=r,this.starsConfig={starCount:30,showMoon:!0,...i},C(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start stars animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Animation layer not found: ${this.layerSelector}`);let i=X(this.cardConfig,this.realWindSpeed);this.element.querySelector(".animated-weather-card")?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(s),s.remove()});let r=Math.max(15,Math.round(i.cloudCount*5)),a=document.createElement("div");a.className="stars-field";for(let s=0;s<r;s++){let l=document.createElement("div");l.className="star-gsap";let d=1+Math.random()*3,c=.3+Math.random()*.5;if(l.style.cssText=`
                width: ${d.toFixed(2)}px;
                height: ${d.toFixed(2)}px;
                left: ${(Math.random()*100).toFixed(2)}%;
                top: ${(Math.random()*70).toFixed(2)}%;
                opacity: ${c.toFixed(2)};
            `,Math.random()<gl){let h=3+Math.random()*4;l.classList.add("twinkle"),l.style.setProperty("--star-o",c.toFixed(2)),l.style.setProperty("--star-dim",(c*(1-Math.random()*yl)).toFixed(2)),l.style.animationDuration=`${h.toFixed(2)}s`,l.style.animationDelay=`${(-Math.random()*h).toFixed(2)}s`}a.appendChild(l)}if(t.appendChild(a),this.addParticle(a),window.AnimatedWeatherCardGsap.fromTo(a,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"}),this.starsConfig.showMoon){let s=document.createElement("div");s.className="moon-gsap",t.appendChild(s),this.addParticle(s),window.AnimatedWeatherCardGsap.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"})}C(this.config.devMode,`Stars animation started with ${r} stars`)}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&t.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),C(this.config.devMode,"Stars animation stopped")}setPaused(t){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(i=>i.classList.toggle("paused",t))}async onPause(){this.setPaused(!0),C(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),C(this.config.devMode,"Stars animation resumed")}};var Di=class extends U{constructor(t,i,n,r){super(t,i,n);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";C(this.config.devMode,"SunAnimation created")}async onStart(){let t=this.element.querySelector(this.layerSelector);if(!t){C(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}t.style.opacity="1",C(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.opacity="0"),C(this.config.devMode,"Sun animation stopped")}async onPause(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="paused"),C(this.config.devMode,"Sun animation paused")}async onResume(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="running"),C(this.config.devMode,"Sun animation resumed")}};var Fi=class{constructor(e,t,i,n){this.activeAnimations=new Map;this.element=e,this.config=t,this.timeOfDayManager=i,this.realWindSpeed=n}async startModularAnimation(e,t){this.activeAnimations.has(e)&&await this.stopModularAnimation(e);try{let i={intensity:t,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1},n=null;switch(e){case"rain":n=new _i(this.element,{...i,isStorm:t>=2&&t<=4,isPouring:t>4,isLightRain:t<1,particleCount:Math.floor(t*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":n=new bi(this.element,{...i,particleCount:Math.floor(t*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":n=new xi(this.element,{...i,particleCount:Math.floor(t*40)},this.config,this.realWindSpeed);break;case"wind":n=new Ti(this.element,{...i,leafCount:Math.max(1,Math.floor(t*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":n=new Ci(this.element,{...i,disableShake:this.config.disable_lightning_shake||!1,minInterval:Ke[0],maxInterval:Ke[1]},this.config,this.realWindSpeed);break;case"clouds":n=new Pi(this.element,{...i,cloudCount:Math.max(1,Math.floor(t*2)),isPartlyCloudy:t<3},this.config,this.realWindSpeed);break;case"fog":n=new Oi(this.element,{...i,layerCount:Math.max(2,Math.min(5,Math.floor(t)))},this.config,this.realWindSpeed);break;case"stars":n=new Li(this.element,{...i,starCount:Math.max(15,Math.floor(t*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":n=new Di(this.element,i,this.config);break;default:return C(this.config.dev_mode,`No modular animation registered for type: ${e}`),null}return await n.start(),this.activeAnimations.set(e,n),C(this.config.dev_mode,`Started modular ${e} animation with intensity ${t}`),n}catch(i){return console.error(`Failed to start modular ${e} animation:`,i),null}}async stopModularAnimation(e){let t=this.activeAnimations.get(e);if(t)try{await t.destroy(),C(this.config.dev_mode,`Stopped modular ${e} animation`)}catch(i){console.error(`Error stopping modular ${e} animation:`,i)}finally{this.activeAnimations.delete(e)}}async pauseModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isActive())try{await t.pause()}catch(i){console.error(`Error pausing modular ${e} animation:`,i)}}async resumeModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isPaused())try{await t.resume()}catch(i){console.error(`Error resuming modular ${e} animation:`,i)}}updateWindSpeed(e){if(!Object.is(e,this.realWindSpeed)){this.realWindSpeed=e;for(let[t,i]of this.activeAnimations)try{i.setWindSpeed(e)}catch(n){console.warn(`Failed to update wind speed for ${t}:`,n)}}}async cleanup(){let e=Array.from(this.activeAnimations.keys()).map(t=>this.stopModularAnimation(t));await Promise.all(e),this.activeAnimations.clear()}};var ke=class{constructor(e,t,i,n){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.element=e,this.config=t,this.isPausedFn=i,this.timeOfDayManager=n,this.modularBridge=new Fi(e,t,n,this.currentWindSpeed),C(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(e){this.currentWindSpeed=e,this.modularBridge.updateWindSpeed(e)}async startAnimation(e,t){let i=this.animations[e];if(i.isActive){C(this.config.dev_mode,`Animation ${e} already active \u2014 skipping`);return}let n=t?.intensity??i.intensity??1,r=this.generation;i.isActive=!0,i.intensity=n,this.setAnimationLayerVisibility(e,!0);try{let a=await this.modularBridge.startModularAnimation(e,n);if(r!==this.generation){C(this.config.dev_mode,`Discarding stale start for ${e} (generation drifted)`),await this.modularBridge.stopModularAnimation(e);return}if(!a){i.isActive=!1,console.warn(`No modular animation available for type: ${e}`);return}C(this.config.dev_mode,`Started ${e} animation with intensity ${n}`)}catch(a){console.error(`Failed to start ${e} animation:`,a),i.isActive=!1}}async stopAnimation(e){let t=this.animations[e];if(t.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(e),C(this.config.dev_mode,`Stopped ${e} animation`)}catch(i){console.error(`Error stopping ${e} animation:`,i)}this.setAnimationLayerVisibility(e,!1),t.isActive=!1,t.isPaused=!1}}pauseAnimation(e){let t=this.animations[e];!t.isActive||t.isPaused||(t.isPaused=!0,this.modularBridge.pauseModularAnimation(e),C(this.config.dev_mode,`Paused ${e} animation`))}resumeAnimation(e){let t=this.animations[e];!t.isActive||!t.isPaused||(t.isPaused=!1,this.modularBridge.resumeModularAnimation(e),C(this.config.dev_mode,`Resumed ${e} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(e=>this.stopAnimation(e)))}pauseAllAnimations(){Object.keys(this.animations).forEach(e=>this.pauseAnimation(e))}resumeAllAnimations(){Object.keys(this.animations).forEach(e=>this.resumeAnimation(e))}async applyWeatherCondition(e){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let t=this.defaultWeatherMappings[e.toLowerCase()];if(!t){console.warn(`No animation mapping for weather condition: ${e}`);return}await Promise.all(t.animations.map(i=>{let n=t.overrides?.[i];return this.startAnimation(i,n)})),C(this.config.dev_mode,`Applied weather condition: ${e} with animations: ${t.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(e,t){let i=this.element.querySelector(".animated-weather-card");if(!i)return;let n=`individual-${e}-active`;t?i.classList.add(n):i.classList.remove(n)}clearIndividualAnimationClasses(){let e=this.element.querySelector(".animated-weather-card");if(e)for(let t of Object.keys(this.animations))e.classList.remove(`individual-${t}-active`)}};var Wi=o=>{if(o==null||o==="")return null;let e=typeof o=="number"?o:Number(o);return Number.isFinite(e)?e:null},Ri=o=>typeof o=="string"?o.trim():"";function wl(o){if(!o||typeof o!="object")return null;let e=o,t=typeof e.id=="number"?String(e.id):Ri(e.id);return t?{id:t,label:Ri(e.flight_number)||Ri(e.callsign),aircraftCode:Ri(e.aircraft_code),altitudeFt:Wi(e.altitude),groundSpeedKt:Wi(e.ground_speed),heading:Wi(e.heading),verticalSpeed:Wi(e.vertical_speed),onGround:e.on_ground===1||e.on_ground===!0||e.on_ground==="1"}:null}function Ha(o,e){if(!o||!e)return null;let t=o.states[e];if(!t||t.state==="unavailable"||t.state==="unknown")return null;let i=t.attributes?.flights;if(!Array.isArray(i))return[];let n=[];for(let r of i){let a=wl(r);a&&n.push(a)}return n}var zi=class{constructor(){this.known=null}update(e){if(!e)return[];let t=e.filter(a=>!a.onGround),i=new Set(t.map(a=>a.id));if(this.known===null)return this.known=i,[];let n=[],r=new Set;for(let a of t)this.known.has(a.id)||r.has(a.id)||(r.add(a.id),n.push(a));return this.known=i,n}reset(){this.known=null}};var Ni=class{constructor(e={}){this.listeners=new Set;this.config={enableDayNightCycle:e.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...e},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(e){let t=this.config.enableDayNightCycle;this.config={...this.config,...e},this.updateState(),this.config.enableDayNightCycle&&!t?this.startAutoUpdate():!this.config.enableDayNightCycle&&t&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}getTimeAwareColor(e){let t=this.getCurrentState();if(!this.isEnabled())return e.day;switch(t.timePhase){case"dawn":return e.dawn||this.blendColors(e.night,e.day,.3);case"day":return e.day;case"dusk":return e.dusk||this.blendColors(e.day,e.night,.3);case"night":return e.night;default:return e.day}}setDevOverride(e){this.devTimePhaseOverride=e,this.updateState()}clearDevOverride(){this.devTimePhaseOverride=void 0,this.updateState()}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let e=new Date,t,i;if(!this.config.useBrowserTime&&this.config.timeZone){let s=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(e);t=parseInt(s.find(l=>l.type==="hour")?.value||"0",10),i=parseInt(s.find(l=>l.type==="minute")?.value||"0",10)}else t=e.getHours(),i=e.getMinutes();let n=t+i/60,r;if(this.devTimePhaseOverride)r=this.devTimePhaseOverride;else{let s=this.config.sunriseHour,l=this.config.sunsetHour,d=(s-1+24)%24,c=(s+.5)%24,h=(l-.5+24)%24,m=(l+1)%24,p=(g,u,f)=>u<=f?g>=u&&g<f:g>=u||g<f;p(n,d,c)?r="dawn":p(n,c,h)?r="day":p(n,h,m)?r="dusk":r="night"}let a={isDaytime:r==="day"||r==="dawn",isNighttime:r==="night"||r==="dusk",isDawn:r==="dawn",isDusk:r==="dusk",currentHour:t,timePhase:r};!this.currentState||this.currentState.timePhase!==a.timePhase?(this.currentState=a,this.notifyListeners(a)):this.currentState=a}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},la.UPDATE_INTERVAL)}notifyListeners(e){this.listeners.forEach(t=>{try{t(e)}catch(i){console.error("TimeOfDayManager: Error in listener callback:",i)}})}blendColors(e,t,i){let n=e.replace("#",""),r=t.replace("#",""),a=parseInt(n.substring(0,2),16),s=parseInt(n.substring(2,4),16),l=parseInt(n.substring(4,6),16),d=parseInt(r.substring(0,2),16),c=parseInt(r.substring(2,4),16),h=parseInt(r.substring(4,6),16),m=Math.round(a*(1-i)+d*i),p=Math.round(s*(1-i)+c*i),g=Math.round(l*(1-i)+h*i),u=m.toString(16).padStart(2,"0"),f=p.toString(16).padStart(2,"0"),y=g.toString(16).padStart(2,"0");return`#${u}${f}${y}`}};var Xe=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var _l=Wa(),bl=zt(xt(Te)),$a=o=>`${Math.round(o*100)}%`,vl=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,xl=48,Kn=()=>`
${Xe("animated-weather-card")}
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
          --awc-secondary: ${Ai};

          /* Public color hooks (also set by custom_colors) */
          --weather-text-color: ${bl};
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
            ${Na()};
        }

        .animated-weather-card[data-spill] { overflow: visible; }

        .animated-weather-card.no-transitions,
        .animated-weather-card.no-transitions * {
          transition: none !important;
        }

        /* \u2500\u2500 Sky \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        ${_l}

        .sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
          --awc-sky-glow-layer: ${Ce(ki,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer),
            linear-gradient(180deg, transparent ${$a(La)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${$a(Oa)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${Ce(Da,"var(--awc-sky-glow)")}; }
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
          background-image: ${vl};
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
           smudges; draw them as faint, crisp shapes instead */
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
          --awc-sky-glow-layer: ${Ce(Fa,"var(--awc-sky-glow)")};
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
          --awc-cloud-overhang: ${xl}px;
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
          transition: opacity ${Zt/2}s ${Ae};
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
          transition: transform ${Zt}s ${Ae};
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

`;var Sl={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function Tl(o,e){try{let t=o.formatEntityState?.(e);if(t&&t!==e.state)return t}catch{}return Ve(Sl,e.state)||e.state}var Cl=180;function Ga(o,e){let t=e.note_entity?o?.states[e.note_entity]:void 0;if(!t)return null;let i=s=>typeof s=="string"?s.trim():"",n=t.state==="unknown"||t.state==="unavailable"?"":i(t.state),r=i(t.attributes?.[e.note_attribute||"note"]);if(!n&&!r)return null;let a=Date.parse(t.attributes?.generated_at);return{line:n||r,note:r||n,writtenAt:Number.isNaN(a)?null:a}}function Ba(o,e){let t=Number(e.note_max_age??Cl);return o.writtenAt===null||!(t>0)?null:o.writtenAt+t*6e4}function jn(o,e,t){if(e.dev_mode){let i=Al(e,t);if(o&&e.sun_entity){let n=o.states[e.sun_entity];n&&(i.sun={sunrise:n.attributes.next_rising||null,sunset:n.attributes.next_setting||null,dawn:n.attributes.next_dawn||null,dusk:n.attributes.next_dusk||null,noon:n.attributes.next_noon||null,elevation:n.attributes.elevation??null,aboveHorizon:n.state==="above_horizon"})}return i}return o?El(o,e):{temperature:"--",weatherCondition:"",location:e.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--"}}function Al(o,e){let n=Rn[e||"sunny"]||"22",r=o.name||"",a=be.humidity,s=be.windSpeed,l=parseFloat(s.split(" ")[0])||15,d=be.pressure,h=zn[e||"sunny"]||e||"sunny",m=be.indoorTemperature,p=be.indoorHumidity,g=new Date,u=new Date(g.getFullYear(),g.getMonth(),g.getDate(),6,14),f=new Date(g.getFullYear(),g.getMonth(),g.getDate(),18,32),y=new Date(g.getFullYear(),g.getMonth(),g.getDate(),5,45),w=new Date(g.getFullYear(),g.getMonth(),g.getDate(),19,1),x=new Date(g.getFullYear(),g.getMonth(),g.getDate(),12,23),_=Date.now(),v={sunrise:u.toISOString(),sunset:f.toISOString(),dawn:y.toISOString(),dusk:w.toISOString(),noon:x.toISOString(),elevation:42.5,aboveHorizon:_>=u.getTime()&&_<=f.getTime()};return{temperature:n,weatherCondition:h,location:r,humidity:a,windSpeed:s,windSpeedValue:l,windBearing:null,pressure:d,pressureValue:null,feelsLike:null,indoorTemperature:m,indoorHumidity:p,sun:v}}var kl={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function Ia(o){let e=typeof o=="number"?o:typeof o=="string"?parseFloat(o):NaN;return isFinite(e)?(e%360+360)%360:typeof o=="string"?kl[o.trim().toUpperCase()]??null:null}function El(o,e){if(!e.entity)throw new Error("Weather entity is required");let t=o.states[e.entity];if(!t)throw new Error(`Entity ${e.entity} not found`);let i;if(e.outdoor_sensor_entity){let b=o.states[e.outdoor_sensor_entity];b&&b.state&&!isNaN(parseFloat(b.state))?i=parseFloat(b.state):i=t.attributes.temperature}else i=t.attributes.temperature;let n=i!=null&&!isNaN(i)?Ut(Math.round(i),o):"--",r=Tl(o,t),a=e.name||t.attributes.friendly_name||"",s=b=>{let S=typeof b=="number"?b:parseFloat(b);return isFinite(S)?Ut(Math.round(S),o)+"%":null},l="--";if(e.humidity_sensor_entity){let b=o.states[e.humidity_sensor_entity];l=b&&s(b.state)||s(t.attributes.humidity)||"--"}else l=s(t.attributes.humidity)||"--";let d="--",c=10,h=(b,S)=>{let k=typeof b=="number"?b:parseFloat(b);return isFinite(k)?(c=ma(k,S||"km/h"),d=Ut(Math.round(k),o)+" "+(S||"km/h"),!0):!1},m=e.wind_speed_sensor_entity?o.states[e.wind_speed_sensor_entity]:void 0;m&&h(m.state,m.attributes?.unit_of_measurement)||h(t.attributes.wind_speed,t.attributes.wind_speed_unit);let p=e.wind_direction_sensor_entity?o.states[e.wind_direction_sensor_entity]:void 0,g=Ia(p?.state)??Ia(t.attributes.wind_bearing),u=(b,S)=>{let k=typeof b=="number"?b:parseFloat(b);if(!isFinite(k))return null;let D=S.toLowerCase()==="inhg"?2:0;return Ut(k,o,D)+" "+S},f=b=>{let S=typeof b=="number"?b:parseFloat(b);return isFinite(S)?S:null},y="--",w=null;if(e.pressure_sensor_entity){let b=o.states[e.pressure_sensor_entity];if(b){let S=b.attributes.unit_of_measurement||"hPa",k=u(b.state,S);k&&(y=k,w=f(b.state))}if(y==="--"&&t.attributes.pressure!==void 0){let S=t.attributes.pressure_unit||"hPa";y=u(t.attributes.pressure,S)||"--",w=f(t.attributes.pressure)}}else if(t.attributes.pressure!==void 0){let b=t.attributes.pressure_unit||"hPa";y=u(t.attributes.pressure,b)||"--",w=f(t.attributes.pressure)}let x=null,_;if(e.feels_like_entity&&(_=o.states[e.feels_like_entity]?.state),_===void 0&&t.attributes.apparent_temperature!==void 0&&(_=t.attributes.apparent_temperature),_!==void 0){let b=typeof _=="number"?_:parseFloat(_);isFinite(b)&&(x=Ut(Math.round(b),o)+"\xB0")}let v="--";if(e.indoor_temperature_entity){let b=o.states[e.indoor_temperature_entity];b&&b.state&&!isNaN(parseFloat(b.state))&&(v=Ut(Math.round(parseFloat(b.state)),o)+"\xB0")}let A="--";if(e.indoor_humidity_entity){let b=o.states[e.indoor_humidity_entity];b&&b.state&&!isNaN(parseFloat(b.state))&&(A=Ut(Math.round(parseFloat(b.state)),o)+"%")}let T;if(e.sun_entity){let b=o.states[e.sun_entity];b&&(T={sunrise:b.attributes.next_rising||null,sunset:b.attributes.next_setting||null,dawn:b.attributes.next_dawn||null,dusk:b.attributes.next_dusk||null,noon:b.attributes.next_noon||null,elevation:b.attributes.elevation??null,aboveHorizon:b.state==="above_horizon"})}return{temperature:n,weatherCondition:r,location:a,humidity:l,windSpeed:d,windSpeedValue:c,windBearing:g,pressure:y,pressureValue:w,feelsLike:x,indoorTemperature:v,indoorHumidity:A,sun:T}}var Xn={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota"}};function Ze(o){return o?.locale?.language||o?.language||"en"}function Ee(o){return`${Ze(o)}|${o?.locale?.time_format??""}`}function vt(o,e,t={}){let i=Ze(o).toLowerCase();return(Xn[i]?.[e]??Xn[i.split("-")[0]]?.[e]??Xn.en[e]).replace(/\{(\w+)\}/g,(r,a)=>t[a]??"")}function Ml(o){let e=o?.locale;if(!e?.time_format)return;if(e.time_format==="12")return!0;if(e.time_format==="24")return!1;let t=e.time_format==="language"?Ze(o):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(t).includes("10")}catch{return}}function le(o,e){if(!o)return"--";let t=new Date(o);if(isNaN(t.getTime()))return"--";let i=Ml(e),n={hour:"numeric",minute:"2-digit"};i!==void 0&&(n.hourCycle=i?"h12":"h23");try{return new Intl.DateTimeFormat(e?Ze(e):void 0,n).format(t)}catch{return t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function Zn(o,e){let t=Math.round(Math.abs(o)*60),i=Math.floor(t/60),n=t%60,r=Intl.DurationFormat;if(r&&e)try{return new r(Ze(e),{style:"narrow"}).format(i>0?{hours:i,minutes:n}:{minutes:n})}catch{}return i>0?`${i}h ${n}m`:`${n}m`}function Qe(o,e){let t=o.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return t?`${M(t[1])}<span class="${e}">${M(t[2])}</span>`:M(o)}var qa=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function Va(o){let e=o.color_palette||"default",t=o.custom_colors||{},i="";if(e!=="theme"){let r=c=>{if(typeof c!="string"||!qa.test(c))return null;let h=c.replace("#","");h.length===3&&(h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]);let m=parseInt(h,16);return{r:m>>16&255,g:m>>8&255,b:m&255}},a=(c,h,m)=>"#"+(c<<16|h<<8|m).toString(16).padStart(6,"0"),s=(c,h)=>{let m=r(c);if(!m)return c;let p=1-h/100;return a(Math.max(0,Math.floor(m.r*p)),Math.max(0,Math.floor(m.g*p)),Math.max(0,Math.floor(m.b*p)))},l=(c,h)=>{let m=r(c);if(!m)return c;let p=h/100;return a(Math.min(255,Math.floor(m.r+(255-m.r)*p)),Math.min(255,Math.floor(m.g+(255-m.g)*p)),Math.min(255,Math.floor(m.b+(255-m.b)*p)))},d=(c,h)=>{let m=t[c];if(!m||typeof m!="string"||!qa.test(m))return;let p=l(m,12),g=s(m,22);i+=`--weather-${h}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${p} 0%, ${m} 55%, ${g} 100%); `};d("sunny_bg","sunny"),d("rainy_bg","rainy"),d("snowy_bg","snowy"),d("stormy_bg","stormy"),d("windy_bg","windy"),d("cloudy_bg","cloudy")}let n=(r,a)=>{r&&qe(r)&&(i+=a.replace(/\$\{value\}/g,r))};return n(t.text_color,"--weather-text-color: ${value} !important; "),n(t.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),n(t.rain_color,"--weather-rain-color: ${value} !important; "),n(t.snow_color,"--weather-snow-color: ${value} !important; "),i}var Ka={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"};function Pl(o){return Ve(Ka,o)===void 0?"mdi:weather-night":`mdi:moon-${o.replace(/_moon$/,"").replace(/_/g,"-")}`}var de=1e3,Hi=300,Ol={horizon:196,peak:34,trough:276,twilightRy:78},Ll={horizon:200,peak:96,trough:262,twilightRy:44},Dl=124,Ya=16;function Fl(o,e){if(o<1)return 1;let t=Math.max(2,Math.floor((e+Ya)/(Dl+Ya))),i=Math.ceil(o/t);return Math.ceil(o/i)}function ja(o,e,t){let i=t-e;if(i<=0||i>=24)return 0;if(o>=e&&o<=t)return Math.sin(Math.PI*(o-e)/i);let n=((o-t)%24+24)%24;return-Math.sin(Math.PI*n/(24-i))}var Ii=o=>o/24*de,Xa=(o,e)=>o>=0?e.horizon-o*(e.horizon-e.peak):e.horizon-o*(e.trough-e.horizon);function Wl(o,e,t){let i=[];for(let n=0;n<=240;n++){let r=n/10;i.push(`${Ii(r).toFixed(1)},${Xa(ja(r,o,e),t).toFixed(1)}`)}return"M"+i.join(" L")}function $i(o){if(!o)return 0;let e=new Date(o);return isNaN(e.getTime())?0:e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}var Rl=o=>Qe(o,"st-ampm");Mi();var Ua=zt(xt(Te)),zl=`
${Xe("")}
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
        --st-text: ${Ua};
        --st-secondary: ${Ua};
        --st-secondary-opacity: ${Ai};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${Ce(ki,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${Un.map(o=>`${o} ${Zt}s ${Ae}`).join(", ")};
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
`,Qn=class extends HTMLElement{constructor(){super();this.config={};this._shadow=this.attachShadow({mode:"open"})}setConfig(t){if(!t.sun_entity)throw new Error("Please define a sun_entity (e.g. sun.sun)");this.config={...t},this._render()}set hass(t){let i=this.config.sun_entity||"",n=this.config.moon_entity||"",r=this._hass?.states[i],a=t.states[i],s=this._hass?.states[n]?.state,l=t.states[n]?.state,d=Ee(this._hass)!==Ee(t),c=this.config.weather_entity||"",h=c&&this._hass?.states[c]?.state!==t.states[c]?.state;this._hass=t;let m=r?.attributes?.elevation,p=a?.attributes?.elevation;(!r||r.state!==a?.state||r.attributes?.next_rising!==a?.attributes?.next_rising||r.attributes?.next_setting!==a?.attributes?.next_setting||Math.abs((m||0)-(p||0))>=.5||n&&s!==l||d||h)&&this._render()}connectedCallback(){this._clock||(this._clock=setInterval(()=>this._render(),6e4)),!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._fit()),this._resizeObserver.observe(this))}disconnectedCallback(){this._clock&&clearInterval(this._clock),this._clock=void 0,this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_fit(){let t=this._shadow.querySelector(".st-card");if(!t)return;let i=t.querySelector(".st-metrics");for(let n of["regular","compact","short","tight"]){if(t.dataset.fit=n,i){let r=Array.from(i.children).filter(a=>getComputedStyle(a).display!=="none").length;i.style.setProperty("--st-cols",String(Fl(r,i.clientWidth)))}if(t.scrollHeight<=t.clientHeight+1)return}}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}_skyCondition(t){let i=this.config.weather_entity,n=i?this._hass?.states[i]?.state:void 0;if(n&&n!=="unavailable"&&n!=="unknown"){let r=yi(n,!1,void 0,void 0,this._hass?.config?.time_zone);if(Yn.includes(r))return r}return t==="night"?"clear-night":"sunny"}static getConfigElement(){return document.createElement("animated-sun-tracker-editor")}static getStubConfig(){return{sun_entity:"sun.sun",moon_entity:"sensor.moon_phase"}}_getSunData(){if(!this._hass||!this.config.sun_entity)return null;let t=this._hass.states[this.config.sun_entity];return t?{sunrise:t.attributes.next_rising||null,sunset:t.attributes.next_setting||null,dawn:t.attributes.next_dawn||null,dusk:t.attributes.next_dusk||null,noon:t.attributes.next_noon||null,elevation:typeof t.attributes.elevation=="number"?t.attributes.elevation:null,aboveHorizon:t.state==="above_horizon",rising:!!t.attributes.rising}:null}_getMoonData(){if(!this._hass||!this.config.moon_entity)return null;let t=this._hass.states[this.config.moon_entity];if(!t)return null;let i=t.state,n;try{n=this._hass.formatEntityState?.(t)}catch{}return{phase:i,phaseName:(n&&n!==i?n:void 0)||Ve(Ka,i)||i.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase()),icon:Pl(i)}}_render(){let t=this._getSunData(),i=this._getMoonData(),n=this.config.color_palette!=="theme";if(!t||!t.sunrise||!t.sunset){this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let r=new Date,a=r.getHours()+r.getMinutes()/60,s=$i(t.sunrise),l=$i(t.sunset),d=t.dawn?$i(t.dawn):Math.max(0,s-.5),c=t.dusk?$i(t.dusk):Math.min(24,l+.5),h=l-s,m=t.aboveHorizon,p=m?t.sunset:t.sunrise,g=new Date(p).getTime()-r.getTime(),u=this._hass,f=Tt=>M(vt(u,Tt)),y=Tt=>Rl(le(Tt,u)),w=g>0?vt(u,"in_duration",{duration:Zn(g/36e5,u)}):"",x=Ei(t.elevation,t.rising,t.aboveHorizon),_=je(this._skyCondition(x),x),v=n?{"--awc-sky-top":_.top,"--awc-sky-mid":_.mid,"--awc-sky-bottom":_.bottom,"--awc-sky-glow":_.glow,"--awc-sky-scrim":_.scrim}:null,A=this.config.compact?Ll:Ol,T=Wl(s,l,A),b=`${T} L${de},${A.horizon} L0,${A.horizon} Z`,S=ja(a,s,l),k=a/24*100,D=Xa(S,A)/Hi*100,F=(Tt,ht)=>{let yt=Math.max(70,Math.abs(ht)/24*de*2.4);return`<ellipse cx="${Ii(Tt).toFixed(1)}" cy="${A.horizon}" rx="${yt.toFixed(1)}" ry="${A.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},E=!!this.config.compact,P=this.config.show_header!==!1,$=P?`
            <div class="st-hero">
                ${this.config.title&&!E?`<div class="st-title">${M(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    <ha-icon icon="${m?"mdi:weather-sunset-down":"mdi:weather-sunset-up"}"></ha-icon>
                    <span>${f(m?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${y(p)}</div>
                ${w?`<div class="st-countdown">${M(w)}</div>`:""}
            </div>`:this.config.title&&!E?`<div class="st-hero"><div class="st-title">${M(this.config.title)}</div></div>`:"",W=(Tt,ht,yt,to,eo=!1)=>`
                <div class="st-metric" data-kind="${M(Tt)}">
                    <div class="st-metric-label"><ha-icon icon="${M(ht)}"></ha-icon><span title="${M(yt)}">${M(yt)}</span></div>
                    <div class="st-metric-value${eo?" wrap":""}">${to}</div>
                </div>`,R=!E&&this.config.show_details!==!1,j=E&&P?`
                        <div class="st-chart-note">${f(m?"sunrise":"sunset")}<span class="st-chart-note-time">${y(m?t.sunrise:t.sunset)}</span></div>`:"",St=R?`
            <div class="st-metrics">
                ${m?W("sunrise","mdi:weather-sunset-up",f("sunrise"),y(t.sunrise)):W("sunset","mdi:weather-sunset-down",f("sunset"),y(t.sunset))}
                ${W("noon","mdi:white-balance-sunny",f("solar_noon"),y(t.noon))}
                ${W("daylight","mdi:timer-sand",f("daylight"),M(Zn(h,u)))}
                ${W("first-light","mdi:weather-sunset",f("first_light"),y(t.dawn))}
                ${W("last-light","mdi:weather-night",f("last_light"),y(t.dusk))}
                ${i?W("moon",i.icon,f("moon"),M(i.phaseName),!0):""}
            </div>`:"",rt=this.config.sun_entity?u?.states[this.config.sun_entity]:void 0,gt="";try{gt=rt&&u?.formatEntityState?.(rt)||""}catch{}let Pt=[`${vt(u,"sunrise")} ${le(t.sunrise,u)}`,`${vt(u,"sunset")} ${le(t.sunset,u)}`,gt].filter(Boolean).join(" \xB7 ");this._mount(`
                    ${$}
                    <div class="st-chart" role="img" aria-label="${M(Pt)}">
                        <svg viewBox="0 0 ${de} ${Hi}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${de}" height="${A.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${A.horizon}" width="${de}" height="${Hi-A.horizon}"/></clipPath>
                            </defs>
                            ${F(s,s-d)}
                            ${F(l,c-l)}
                            <path d="${b}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${A.horizon}" x2="${de}" y2="${A.horizon}" class="st-horizon"/>
                            <line x1="${Ii(a).toFixed(1)}" y1="0" x2="${Ii(a).toFixed(1)}" y2="${Hi}" class="st-now-line"/>
                            <path d="${T}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${T}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${S<0?"below":""}" style="left: ${k.toFixed(2)}%; top: ${D.toFixed(2)}%;"></div>${j}
                    </div>
                    ${St}`,v)}_mount(t,i){let n=this._shadow.querySelector(".st-card");n||(this._shadow.innerHTML=`<style>${zl}</style><ha-card><div class="st-card"></div></ha-card>`,n=this._shadow.querySelector(".st-card"));let r=!!i;n.classList.toggle("sky",r),n.classList.toggle("compact",!!this.config.compact),n.parentElement?.classList.toggle("sky",r);for(let a of Un)i?n.style.setProperty(a,i[a]):n.style.removeProperty(a);n.innerHTML=t,this._fit()}},Nl=`
    .st-editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0;
    }
    .st-editor .st-switches {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 4px;
    }
    .st-editor .st-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 48px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
    }
    .st-editor .st-switch small {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
`,Jn=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1}setConfig(t){this._config={...t},this._initialized&&this._render()}set hass(t){this._hass=t,this._initialized&&this.isConnected&&this._updatePickers()}async connectedCallback(){this._config=this._config||{},await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let i=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),n=r=>{(r.reason?.message?.includes("localize")||r.reason?.message?.includes("hass"))&&r.preventDefault()};window.addEventListener("unhandledrejection",n);try{await i.constructor.getConfigElement()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",n),2e3)}catch{}}_render(){let t=this._config,i=(n,r,a,s)=>`
                    <label class="st-switch" for="${n}">
                        <span>${r}<small>${a}</small></span>
                        <ha-switch id="${n}" ${s?"checked":""}></ha-switch>
                    </label>`;this.innerHTML=`
            <style>${Nl}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${ua({id:"title",label:"Title (optional)",value:t.title})}
                <div class="st-switches">
                    ${i("compact","Compact","One line: the next sunrise or sunset beside the sun's path",!!t.compact)}
                    ${i("show_header","Next sunrise or sunset","The headline time and countdown",t.show_header!==!1)}
                    ${i("show_details","Details","First and last light, solar noon, daylight, moon",t.show_details!==!1)}
                    ${i("theme_palette","Blend with dashboard theme","Use theme colors instead of the sky",t.color_palette==="theme")}
                </div>
            </div>
        `,this._updatePickers(),this._attachListeners()}_updatePickers(){let t=[{id:"#sun-picker",value:this._config.sun_entity||"",label:"Sun entity",domains:["sun"]},{id:"#moon-picker",value:this._config.moon_entity||"",label:"Moon phase entity (optional)",domains:["sensor"]},{id:"#weather-picker",value:this._config.weather_entity||"",label:"Share the sky of a weather entity (optional)",domains:["weather"]}];for(let i of t){let n=this.querySelector(i.id);n&&(this._hass&&(n.hass=this._hass),n.value=i.value,n.label=i.label,n.includeDomains=i.domains)}}_attachListeners(){this.querySelector("#sun-picker")?.addEventListener("value-changed",i=>{this._update({sun_entity:i.detail.value})}),this.querySelector("#moon-picker")?.addEventListener("value-changed",i=>{this._update({moon_entity:i.detail.value||void 0})}),this.querySelector("#weather-picker")?.addEventListener("value-changed",i=>{this._update({weather_entity:i.detail.value||void 0})}),this.querySelector("#title")?.addEventListener("input",i=>{this._update({title:i.target.value||void 0})});let t=(i,n)=>{this.querySelector(`#${i}`)?.addEventListener("change",r=>{this._update(n(r.target.checked))})};t("compact",i=>({compact:i||void 0})),t("show_header",i=>({show_header:i})),t("show_details",i=>({show_details:i})),t("theme_palette",i=>({color_palette:i?"theme":void 0}))}_update(t){let i={...this._config,...t};for(let n of Object.keys(i))(i[n]===void 0||i[n]==="")&&delete i[n];this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};customElements.define("animated-sun-tracker-card",Qn);customElements.define("animated-sun-tracker-editor",Jn);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!1,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card"});Mi();var Za=o=>`Wind from ${Math.round(o)}\xB0`,Qa=o=>o==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",tr=o=>o?"mdi:weather-sunset-down":"mdi:weather-sunset-up",Hl=18,$l=450,Il=1600,Gl=400,Bl=120,ql=220,Vl=24;window.AnimatedWeatherCardGsap=Wn;var Ja=["regular","compact","short","tight","minimal"],Yl=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...Ja.map(o=>[o,"none"])],Mt=class Mt extends HTMLElement{constructor(){super(...arguments);this._initialRender=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this._needsAnimationRestart=!1;this.currentWindSpeedValue=10;this.devTimeOverride=!1;this._animationGeneration=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new zi;this.writtenNote=null;this.noteComing=!1}static getStubConfig(){return sa}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entity&&!t.dev_mode)throw new Error("You need to define an entity or enable dev mode");let i=r=>r===void 0||typeof r=="number"&&isFinite(r)&&r>=0&&r<=23;if(!i(t.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${t.sunrise_hour})`);if(!i(t.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${t.sunset_hour})`);let n=this.config?.auto_pause;if(this.config?.flights_entity!==t.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0),this.config=t,this.isConnected){this.initializeTimeOfDayManager();let r=this.animationController;this._animationGeneration++,this.animationController=new ke(this,this.config,()=>this.animationsPaused,this.timeOfDayManager),r&&r.stopAllAnimations().catch(a=>C(this.config?.dev_mode,"Error stopping previous animation controller:",a))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&!!t.auto_pause!=!!n&&(this.removeVisibilityTracking(),this.setupVisibilityTracking())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>{this.applySizeState(),this.devPanel?.isOpen&&this.devPanel.dock()}),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this._initialRender&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=new ke(this,this.config,()=>this.animationsPaused,this.timeOfDayManager))),this.attachEventListeners(),this.setupVisibilityTracking(),this._updateDataInPlace(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=new ke(this,this.config,()=>this.animationsPaused,this.timeOfDayManager)),this._initialRender=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let i=this.querySelector(".animated-weather-card");i&&(i.classList.remove("no-transitions"),i.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass&&!this.config.dev_mode)return;Hn(this),this.stopPlanes();let t=this.config.color_palette||"default",i;try{i=jn(this.hass,this.config,this.currentDevCondition)}catch(E){let P=E?.message||"Error loading weather data";this.innerHTML=`
              <ha-card>
                <div class="awc-empty-state" role="status">
                  <ha-icon class="awc-empty-icon" icon="mdi:weather-cloudy-alert"></ha-icon>
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${M(P)}</div>
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
            `;return}let{temperature:n,weatherCondition:r,location:a,humidity:s,windSpeed:l,windSpeedValue:d,windBearing:c,pressure:h,pressureValue:m,feelsLike:p,indoorTemperature:g,indoorHumidity:u,sun:f}=i,y=this.updatePressureTrend(m);this.currentWindSpeedValue=d;let w=f?.aboveHorizon??!1,x=f?le(w?f.sunset:f.sunrise,this._hass):"--",_=this.config.show_sun!==!1&&!!f&&x!=="--",v=!!this.config.compact,A=Va(this.config),T=this.config.show_attribute_icons!==!1,b=this.config.show_attribute_labels!==!1,S=(E,P,$,W,R="")=>{let j=T||b?`<div class="attribute-label">${T?`<ha-icon class="attribute-icon" icon="${P}"></ha-icon>`:""}${b?`<span>${M($)}</span>`:""}</div>`:"";return`<div class="attribute" data-kind="${E}">${j}<div class="attribute-value"><span class="attribute-text">${W}</span>${R}</div></div>`},k=typeof c=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${c+180}deg);" aria-label="${Za(c)}"></ha-icon>`:"",D=y?`<ha-icon class="pressure-trend ${y}" icon="${Qa(y)}" aria-label="Pressure ${y}"></ha-icon>`:"",F=this.config.show_attributes!==!1?`
              <div class="weather-attributes${b?"":" values-only"}">${[S("humidity","mdi:water-percent",gi(this._hass,"ui.card.weather.attributes.humidity","Humidity"),M(s)),S("wind","mdi:weather-windy",gi(this._hass,"ui.card.weather.attributes.wind_speed","Wind"),M(l),k),S("pressure","mdi:gauge",gi(this._hass,"ui.card.weather.attributes.air_pressure","Pressure"),M(h),D),_?S("sun",tr(w),vt(this._hass,w?"sunset":"sunrise"),Qe(x,"awc-ampm")):""].join("")}</div>`:"";this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions loading ${t==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${v?' data-variant="compact"':""} style="${M(A)}">
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
                ${!v&&this.config.show_location!==!1&&a?`<div class="location">${M(a)}</div>`:""}
                <div class="temperature" aria-live="polite"><span class="temperature-value">${M(n)}</span><span class="degree">\xB0</span></div>
                <div class="weather-desc" aria-live="polite">${M(r)}</div>
                ${v?`<div class="compact-meta">${M(this.compactMeta(a,p))}</div>`:`<div class="hero-meta">${this.heroMetaHtml(p,g,u)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
              </div>
              ${v?"":F}
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
        ${Kn()}
      </style>
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill()}applySpill(){let t=this.querySelector("ha-card");if(!t)return;let i=this.config?.spill_particles!==!1?"visible":"hidden";t.style.setProperty("overflow",i,"important");let n=()=>{let r=t.shadowRoot;if(!r)return;let a=r.querySelector("#awc-overflow");a||(a=document.createElement("style"),a.id="awc-overflow",r.appendChild(a)),a.textContent=`:host { overflow: ${i} !important; }`};n(),!t.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(n))}transitionCondition(){let t=this.querySelector(".animated-weather-card");if(!t||t.classList.contains("loading")){this.initializeAnimations();return}t.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},Gl)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&!this.config.dev_mode}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let t=window.AnimatedWeatherCardNote;if(t){this.noteWriter??(this.noteWriter=new t(this)),this.noteWriter.start();return}Mt.loadSiblingBundle("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(t){this.writtenNote=t,this.updateNote()}noteWriting(t){this.noteComing!==t&&(this.noteComing=t,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let t=this.config.note_entity?Ga(this._hass,this.config):this.writtenNote,i=t?Ba(t,this.config):null;if(!t||i===null)return t;let n=i-Date.now();return n<=0?null:(n<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),n+50)),t)}noteHtml(t){return`<p class="weather-note"${t?"":" hidden"}><span class="note-long">${M(t?.note??"")}</span><span class="note-short">${M(t?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let t=this.querySelector(".weather-note");if(!t)return;let i=t.querySelector(".note-long"),n=t.querySelector(".note-short"),r=t.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let l=t.querySelector(".note-phrase"),d=vt(this._hass,this.noteComing==="forecast"?"note_reading":"note_writing");!r||t.hidden?(l&&(l.textContent=d),t.dataset.writing="",t.setAttribute("aria-busy","true"),t.hidden=!1,this.applySizeState()):this.fadeThrough(l,d);return}r&&(delete t.dataset.writing,t.removeAttribute("aria-busy"));let a=this.currentNote();if(!a){this.noteTyping?.finish(),(!t.hidden||r)&&(t.hidden=!0,this.applySizeState());return}if(t.hidden||r){this.noteTyping?.finish(),i&&(i.textContent=a.note),n&&(n.textContent=a.line),t.hidden=!1,this.applySizeState(),r&&this.typeIn(t);return}if(this.noteTyping){if(this.noteTyping.text===a.note+a.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(i,a.note,s),this.fadeThrough(n,a.line,s)}compactMeta(t,i){return[this.config?.show_location!==!1?t:"",i?`${vt(this._hass,"feels_like")} ${i}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let t=this.config?.indoor_style,i=M(vt(this._hass,"indoors")),n='<ha-icon class="indoor-icon" icon="mdi:home-thermometer-outline"></ha-icon>';if(t==="icon")return`${n}<span class="awc-visually-hidden">${i} </span>`;let r=`<span class="indoor-label">${i}</span>`;return t==="both"?n+r:r}heroMetaHtml(t,i,n){let r=[];t&&r.push(`<span class="feels-like">${M(vt(this._hass,"feels_like"))} ${M(t)}</span>`);let a=[i,n].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&a.length&&r.push(`<span class="indoor-climate-inline">${this.indoorLead()}${a.map(s=>M(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),r.join("")}mountDevPanel(){if(!this.config?.dev_mode){this.devPanel?.disconnect(),this.devPanel=void 0;return}let t=window.AnimatedWeatherCardDevPanel;if(t){this.devPanel??(this.devPanel=new t(this)),this.devPanel.mount();return}Mt.loadSiblingBundle("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevPanel).then(()=>{this.isConnected&&this.mountDevPanel()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}attachEventListeners(){if(this.mountDevPanel(),this.mountNoteWriter(),!this.config?.dev_mode&&this.config?.entity){let t=this.config.entity,i=this.querySelector(".weather-info");if(i&&!i.dataset.tapBound){i.dataset.tapBound="1",i.style.cursor="pointer",i.setAttribute("role","button"),i.setAttribute("tabindex","0");let n=()=>{this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))};i.addEventListener("click",n),i.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),n())})}}if(!this.isInitializing){let t=window.setTimeout(()=>{this.initializeAnimations(),this.config?.dev_mode&&!this.currentDevCondition&&(this.currentDevCondition="sunny")},100);this.pendingTimeouts.push(t)}}setAnimationsPaused(t){this.animationsPaused=t,this.toggleAttribute("data-paused",t),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),pa(this)):this._needsAnimationRestart?(this._needsAnimationRestart=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),fa(this)),this.devPanel?.updatePauseButton()}getWeatherSettings(t){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return X(this.config,t)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let t=++this._animationGeneration;try{if(!this.config)return;let i=this.config,n=this.querySelector(".animated-weather-card");if(!n)return;this.clearAnimations();let r;if(i.dev_mode)r=this.currentDevCondition||"sunny";else{if(!this.hass||!i.entity)return;let h=this.hass.states[i.entity];if(!h)return;r=h.state.toLowerCase()}let a=yi(r,i.dev_mode??!1,i.sunrise_hour,i.sunset_hour,this._hass?.config?.time_zone),s=(i.color_palette||"default")==="theme"?"theme-colors":"",l=n.classList.contains("loading"),d=(...h)=>{n.className=["animated-weather-card",a,...h,s,l?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),l&&requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.remove("no-transitions"),n.classList.add("transitions-enabled")}))},c=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(i.animate===!1||c){d(i.animate===!1?"static":""),this.currentWeatherClass=a;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&t===this._animationGeneration){if(d(),this.animationsPaused){this.currentWeatherClass=a,this._needsAnimationRestart=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.animationController.applyWeatherCondition(a)),this.startPlanes()}},i.dev_mode?50:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),Hn(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(a=>{a.innerHTML=""});let i=this.querySelector(".animated-weather-card"),n=this.querySelector(".animation-layer");n&&(Ue(this),n.querySelectorAll(".star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),n.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),i&&(Si(i),xa(i));let r=this.querySelector(".lightning");r&&(r.classList.remove("flash"),r.innerHTML=""),Nn(this.pendingTimeouts)}set hass(t){let i=this._hass;if(this._hass=t,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),!i){this.render(),this.initializeAnimations();return}if(Ee(i)!==Ee(t)){this.render(),this.initializeAnimations();return}if(this.config.dev_mode||!this.config.entity)return;let n=i.states[this.config.entity],r=t.states[this.config.entity];if(!n||!r){this.render(),this.initializeAnimations();return}if(n.state!==r.state){this._updateDataInPlace(),this.transitionCondition();return}let a=!1,s=d=>d==null?"__missing__":typeof d=="number"?Math.round(d):String(d),l=["temperature","humidity","wind_speed","pressure","wind_bearing","friendly_name"];for(let d of l)if(s(n.attributes[d])!==s(r.attributes[d])){a=!0;break}if(this.config.note_entity&&i.states[this.config.note_entity]!==t.states[this.config.note_entity]&&(a=!0),!a){let d=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.humidity_sensor_entity,this.config.pressure_sensor_entity,this.config.wind_speed_sensor_entity,this.config.wind_direction_sensor_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity];for(let c of d){if(!c)continue;let h=i.states[c]?.state,m=t.states[c]?.state;if(h!==m){a=!0;break}}}if(a)this._updateDataInPlace();else{let d=this.config.sun_entity||"sun.sun";i.states[d]!==t.states[d]&&this.applySkyPhase()}}}_updateDataInPlace(){if(!this.config||!this._hass&&!this.config.dev_mode)return;let t;try{t=jn(this._hass,this.config,this.currentDevCondition)}catch{return}let{temperature:i,weatherCondition:n,humidity:r,windSpeed:a,windSpeedValue:s,windBearing:l,pressure:d,pressureValue:c,feelsLike:h,indoorTemperature:m,indoorHumidity:p,sun:g}=t;this.currentWindSpeedValue=s;let u=(_,v)=>{_&&_.textContent!==v&&(_.textContent=v)};this.fadeThrough(this.querySelector(".temperature-value"),i),this.fadeThrough(this.querySelector(".weather-desc"),n);let f=(_,v)=>{u(this.querySelector(`.weather-attributes .attribute[data-kind="${_}"] .attribute-text`),v)};f("humidity",r),f("wind",a),f("pressure",d),this.syncValueIcon("wind","wind-bearing-arrow",typeof l=="number"?{icon:"mdi:navigation",transform:`rotate(${l+180}deg)`,label:Za(l)}:null);let y=this.updatePressureTrend(c);if(this.syncValueIcon("pressure","pressure-trend",y?{icon:Qa(y),label:`Pressure ${y}`,className:y}:null),g){let _=this.querySelector('.weather-attributes .attribute[data-kind="sun"]'),v=_?.querySelector(".attribute-text"),A=Qe(le(g.aboveHorizon?g.sunset:g.sunrise,this._hass),"awc-ampm");v&&v.innerHTML!==A&&(v.innerHTML=A),u(_?.querySelector(".attribute-label > span")??null,vt(this._hass,g.aboveHorizon?"sunset":"sunrise"));let T=_?.querySelector(".attribute-icon");T&&T.getAttribute("icon")!==tr(g.aboveHorizon)&&T.setAttribute("icon",tr(g.aboveHorizon))}let w=this.querySelector(".compact-meta");w&&u(w,this.compactMeta(t.location,h)),u(this.querySelector(".location"),t.location);let x=this.querySelector(".hero-meta");if(x){let _=this.heroMetaHtml(h,m,p);x.innerHTML!==_&&(x.innerHTML=_)}this.updateNote(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(s)}updatePressureTrend(t){return typeof t!="number"?this._pressureTrend??null:(typeof this._lastPressureValue!="number"?this._lastPressureValue=t:Math.abs(t-this._lastPressureValue)>=.5&&(this._pressureTrend=t>this._lastPressureValue?"rising":"falling",this._lastPressureValue=t),this._pressureTrend??null)}syncValueIcon(t,i,n){let r=this.querySelector(`.weather-attributes .attribute[data-kind="${t}"] .attribute-value`);if(!r)return;let a=r.querySelector(`.${i}`);if(!n){a?.remove();return}a||(a=document.createElement("ha-icon"),r.appendChild(a)),a.className=[i,n.className].filter(Boolean).join(" "),a.getAttribute("icon")!==n.icon&&a.setAttribute("icon",n.icon),a.setAttribute("aria-label",n.label),a.style.transform=n.transform??""}typeIn(t){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let i=Array.from(t.querySelectorAll(".note-long, .note-short")).map(m=>{let p=m.textContent??"",g=document.createElement("span");g.className="note-typed";let u=document.createElement("span");return u.className="note-untyped",u.textContent=p,m.replaceChildren(g,u),{span:m,text:p,typed:g,rest:u}}),n=Math.max(0,...i.map(m=>m.text.length)),r=Math.min(Il,Math.max($l,n*Hl)),a=window.requestAnimationFrame?.bind(window)??(m=>window.setTimeout(()=>m(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),l=Date.now(),d=0,c={text:i.map(m=>m.text).join(""),finish:()=>{s(d);for(let m of i)m.span.textContent=m.text;this.noteTyping===c&&(this.noteTyping=void 0)}},h=()=>{let m=Math.min(1,(Date.now()-l)/r);for(let p of i){let g=Math.round(m*p.text.length);p.typed.textContent=p.text.slice(0,g),p.rest.textContent=p.text.slice(g)}m<1?d=a(h):c.finish()};this.noteTyping=c,d=a(h)}fadeThrough(t,i,n){if(!t)return;let r=this.heroTextPending.get(t);if((r??t.textContent)===i)return;let a=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof t.animate!="function"||a){t.textContent=i,n?.();return}if(this.heroTextPending.set(t,i),r!==void 0)return;let s=()=>{let d=this.heroTextPending.get(t);this.heroTextPending.delete(t),d!==void 0&&(t.textContent=d),n?.()},l=t.animate([{opacity:1},{opacity:0}],{duration:Bl,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});l.onfinish=()=>{s(),t.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:ql,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),l.cancel()},l.oncancel=s}get hass(){return this._hass}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.config.dev_mode)return;this.planesWanted=!0;let t=window.AnimatedWeatherCardPlanes;if(!t){Mt.loadSiblingBundle("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}let i=new t(this,{intensity:1,scale:1,devMode:this.config.dev_mode||!1},this.config);this.planes=i,i.start().then(()=>{this.animationsPaused&&i.pause()}).catch(n=>{console.error("Failed to start plane fly-overs:",n),this.planes===i&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let t=this.planes;t&&(this.planes=void 0,t.destroy().catch(i=>C(this.config?.dev_mode,"Error stopping plane fly-overs:",i)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let t=this._hass?.states[this.config.flights_entity];if(t&&t===this.lastFlightsState)return;this.lastFlightsState=t;let i=this.flightTracker.update(Ha(this._hass,this.config.flights_entity));i.length&&this.flyPlanes(i)}flyPlanes(t){!this.planes||this.animationsPaused||this.planes.flyOver(t,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride)?this.timeOfDayManager.getCurrentState().isNighttime:this._hass?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.wasManuallyPaused)return;let t=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;t!==this.animationsPaused&&this.setAnimationsPaused(t)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(t=>{this.offscreen=!t[t.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}disconnectedCallback(){this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.devPanel?.disconnect(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),Nn(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new Ni({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(t=>{this.onTimeOfDayChanged(t)}),this.config?.enable_day_night_cycle){let t=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(t)}}onTimeOfDayChanged(t){this.config?.enable_day_night_cycle&&(C(this.config?.dev_mode,`Time of day changed to: ${t.timePhase}`),this.updateDayNightBackground(t))}updateDayNightBackground(t){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))return this.timeOfDayManager.getCurrentState().timePhase;let t=this._hass?.states[this.config?.sun_entity||"sun.sun"];if(!t)return"day";let i=t.attributes?.elevation;return Ei(typeof i=="number"?i:Number(i),!!t.attributes?.rising,t.state!=="below_horizon")}applySkyPhase(){let t=this.querySelector(".animated-weather-card");if(!t)return;let i=this.currentSkyPhase();t.dataset.phase!==i&&(t.dataset.phase=i)}applySizeState(){let t=this.querySelector(".animated-weather-card"),i=t?.querySelector(".weather-info");if(!t||!i)return;let n=t.querySelector(".main-weather-info"),r=t.querySelector(".weather-attributes");if(t.dataset.height="regular",r){let d=t.dataset.metrics;t.dataset.metrics="row";let c=Array.from(r.children),h=parseFloat(getComputedStyle(r).columnGap)||0,m=c.reduce((u,f)=>u+f.getBoundingClientRect().width,0)+h*Math.max(0,c.length-1),p=r.clientWidth-m,g=p<-.5||d==="grid"&&p<Vl;t.dataset.metrics=g?"grid":"row"}let a=t.dataset.variant==="compact",s=t.querySelector(".weather-note"),l=()=>i.scrollHeight>i.clientHeight+1||!a&&!!n&&n.scrollHeight>n.clientHeight+1||!!s&&!s.hidden&&s.scrollHeight>s.clientHeight+1;if(!s||s.hidden){delete t.dataset.note;for(let d of Ja)if(t.dataset.height=d,!l())return;return}for(let[d,c]of Yl)if(t.dataset.height=d,t.dataset.note=c,!l())return}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:this.noteEnabled()?{columns:12,rows:5,min_columns:6,min_rows:3}:{columns:12,rows:4,min_columns:6,min_rows:3}}getCardSize(){if(this.config?.compact)return 2;let t=3;return this.config?.show_indoor!==!1&&(t+=1),this.config?.show_attributes!==!1&&(t+=1),this.noteEnabled()&&(t+=1),t}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await Mt.loadSiblingBundle("animated-weather-card-editor",()=>!!customElements.get("animated-weather-card-editor")),document.createElement("animated-weather-card-editor")}static loadSiblingBundle(t,i){let n=Mt.bundleLoads.get(t);if(n)return n;let r=new Promise((a,s)=>{let d=Array.from(document.querySelectorAll("script[src]")).find(m=>/animated-weather-card(?:\.min)?\.js/.test(m.src)),c=d?d.src.replace(/animated-weather-card(\.min)?\.js/,`${t}$1.js`):`${t}.js`,h=document.createElement("script");h.src=c,h.type="module",h.async=!0,h.onload=()=>i()?a():s(new Error(`${c} loaded but registered nothing`)),h.onerror=()=>s(new Error(`Failed to load ${c}`)),document.head.appendChild(h)});return r.catch(()=>Mt.bundleLoads.delete(t)),Mt.bundleLoads.set(t,r),r}};Mt.bundleLoads=new Map;var er=Mt;customElements.define("animated-weather-card",er);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!1,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card"});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let o=je("sunny","day"),e=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${da} `,[`background: linear-gradient(90deg, ${o.top}, ${o.mid} 55%, ${o.bottom})`,`color: ${zt(xt(Te))}`,"border-radius: 4px 0 0 4px",...e].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${o.top}`,"border-radius: 0 4px 4px 0",...e].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
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
