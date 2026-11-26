"use strict";(()=>{function qt(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function Co(a,e){a.prototype=Object.create(e.prototype),a.prototype.constructor=a,a.__proto__=e}var wt={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},cn={duration:.5,overwrite:!1,delay:0},Wr,it,B,Pt=1e8,W=1/Pt,kr=Math.PI*2,fd=kr/4,pd=0,Ao=Math.sqrt,gd=Math.cos,yd=Math.sin,nt=function(e){return typeof e=="string"},X=function(e){return typeof e=="function"},Vt=function(e){return typeof e=="number"},ui=function(e){return typeof e>"u"},Nt=function(e){return typeof e=="object"},yt=function(e){return e!==!1},zr=function(){return typeof window<"u"},ni=function(e){return X(e)||nt(e)},To=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},lt=Array.isArray,wd=/random\([^)]+\)/g,_d=/,\s*/g,go=/(?:-?\.?\d|\.)+/gi,Nr=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,me=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,vr=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Ir=/[+-]=-?[.\d]+/,vd=/[^,'"\[\]\s]+/gi,bd=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,U,Wt,Er,$r,Ct={},oi={},ko,Eo=function(e){return(oi=ke(e,Ct))&&dt},hi=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},un=function(e,t){return!t&&console.warn(e)},Mo=function(e,t){return e&&(Ct[e]=t)&&oi&&(oi[e]=t)||Ct},hn=function(){return 0},xd={suppressEvents:!0,isStart:!0,kill:!1},ii={suppressEvents:!0,kill:!1},Sd={suppressEvents:!0},Gr={},Zt=[],Mr={},Po,pt={},br={},yo=30,ri=[],qr="",Br=function(e){var t=e[0],n,i;if(Nt(t)||X(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(i=ri.length;i--&&!ri[i].targetTest(t););n=ri[i]}for(i=e.length;i--;)e[i]&&(e[i]._gsap||(e[i]._gsap=new Kr(e[i],n)))||e.splice(i,1);return e},Qt=function(e){return e._gsap||Br(Lt(e))[0]._gsap},Vr=function(e,t,n){return(n=e[t])&&X(n)?e[t]():ui(n)&&e.getAttribute&&e.getAttribute(t)||n},ht=function(e,t){return(e=e.split(",")).forEach(t)||e},Z=function(e){return Math.round(e*1e5)/1e5||0},V=function(e){return Math.round(e*1e7)/1e7||0},fe=function(e,t){var n=t.charAt(0),i=parseFloat(t.substr(2));return e=parseFloat(e),n==="+"?e+i:n==="-"?e-i:n==="*"?e*i:e/i},Cd=function(e,t){for(var n=t.length,i=0;e.indexOf(t[i])<0&&++i<n;);return i<n},si=function(){var e=Zt.length,t=Zt.slice(0),n,i;for(Mr={},Zt.length=0,n=0;n<e;n++)i=t[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Ur=function(e){return!!(e._initted||e._startAt||e.add)},Lo=function(e,t,n,i){Zt.length&&!it&&si(),e.render(t,n,i||!!(it&&t<0&&Ur(e))),Zt.length&&!it&&si()},Ro=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(vd).length<2?t:nt(e)?e.trim():e},Oo=function(e){return e},At=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Ad=function(e){return function(t,n){for(var i in n)i in t||i==="duration"&&e||i==="ease"||(t[i]=n[i])}},ke=function(e,t){for(var n in t)e[n]=t[n];return e},wo=function a(e,t){for(var n in t)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(e[n]=Nt(t[n])?a(e[n]||(e[n]={}),t[n]):t[n]);return e},li=function(e,t){var n={},i;for(i in e)i in t||(n[i]=e[i]);return n},sn=function(e){var t=e.parent||U,n=e.keyframes?Ad(lt(e.keyframes)):At;if(yt(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},Td=function(e,t){for(var n=e.length,i=n===t.length;i&&n--&&e[n]===t[n];);return n<0},Do=function(e,t,n,i,r){n===void 0&&(n="_first"),i===void 0&&(i="_last");var o=e[i],s;if(r)for(s=t[r];o&&o[r]>s;)o=o._prev;return o?(t._next=o._next,o._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[i]=t,t._prev=o,t.parent=t._dp=e,t},mi=function(e,t,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var r=t._prev,o=t._next;r?r._next=o:e[n]===t&&(e[n]=o),o?o._prev=r:e[i]===t&&(e[i]=r),t._next=t._prev=t.parent=null},Jt=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},ce=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},kd=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Pr=function(e,t,n,i){return e._startAt&&(it?e._startAt.revert(ii):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,i))},Ed=function a(e){return!e||e._ts&&a(e.parent)},_o=function(e){return e._repeat?Ee(e._tTime,e=e.duration()+e._rDelay)*e:0},Ee=function(e,t){var n=Math.floor(e=V(e/t));return e&&n===e?n-1:n},di=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},fi=function(e){return e._end=V(e._start+(e._tDur/Math.abs(e._ts||e._rts||W)||0))},pi=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=V(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),fi(e),n._dirty||ce(n,e)),e},Fo=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=di(e.rawTime(),t),(!t._dur||pn(0,t.totalDuration(),n)-t._tTime>W)&&t.render(n,!0)),ce(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-W}},zt=function(e,t,n,i){return t.parent&&Jt(t),t._start=V((Vt(n)?n:n||e!==U?Mt(e,n,t):e._time)+t._delay),t._end=V(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Do(e,t,"_first","_last",e._sort?"_start":0),Lr(t)||(e._recent=t),i||Fo(e,t),e._ts<0&&pi(e,e._tTime),e},Ho=function(e,t){return(Ct.ScrollTrigger||hi("scrollTrigger",t))&&Ct.ScrollTrigger.create(t,e)},Wo=function(e,t,n,i,r){if(Zr(e,t,r),!e._initted)return 1;if(!n&&e._pt&&!it&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Po!==gt.frame)return Zt.push(e),e._lazy=[r,i],1},Md=function a(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||a(t))},Lr=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Pd=function(e,t,n,i){var r=e.ratio,o=t<0||!t&&(!e._start&&Md(e)&&!(!e._initted&&Lr(e))||(e._ts<0||e._dp._ts<0)&&!Lr(e))?0:1,s=e._rDelay,l=0,d,c,h;if(s&&e._repeat&&(l=pn(0,e._tDur,t),c=Ee(l,s),e._yoyo&&c&1&&(o=1-o),c!==Ee(e._tTime,s)&&(r=1-o,e.vars.repeatRefresh&&e._initted&&e.invalidate())),o!==r||it||i||e._zTime===W||!t&&e._zTime){if(!e._initted&&Wo(e,t,i,n,l))return;for(h=e._zTime,e._zTime=t||(n?W:0),n||(n=t&&!h),e.ratio=o,e._from&&(o=1-o),e._time=0,e._tTime=l,d=e._pt;d;)d.r(o,d.d),d=d._next;t<0&&Pr(e,t,n,!0),e._onUpdate&&!n&&St(e,"onUpdate"),l&&e._repeat&&!n&&e.parent&&St(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===o&&(o&&Jt(e,1),!n&&!it&&(St(e,o?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Ld=function(e,t,n){var i;if(n>t)for(i=e._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>t)return i;i=i._next}else for(i=e._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<t)return i;i=i._prev}},Me=function(e,t,n,i){var r=e._repeat,o=V(t)||0,s=e._tTime/e._tDur;return s&&!i&&(e._time*=o/e._dur),e._dur=o,e._tDur=r?r<0?1e10:V(o*(r+1)+e._rDelay*r):o,s>0&&!i&&pi(e,e._tTime=e._tDur*s),e.parent&&fi(e),n||ce(e.parent,e),e},vo=function(e){return e instanceof st?ce(e):Me(e,e._dur)},Rd={_start:0,endTime:hn,totalDuration:hn},Mt=function a(e,t,n){var i=e.labels,r=e._recent||Rd,o=e.duration()>=Pt?r.endTime(!1):e._dur,s,l,d;return nt(t)&&(isNaN(t)||t in i)?(l=t.charAt(0),d=t.substr(-1)==="%",s=t.indexOf("="),l==="<"||l===">"?(s>=0&&(t=t.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(t.substr(1))||0)*(d?(s<0?r:n).totalDuration()/100:1)):s<0?(t in i||(i[t]=o),i[t]):(l=parseFloat(t.charAt(s-1)+t.substr(s+1)),d&&n&&(l=l/100*(lt(n)?n[0]:n).totalDuration()),s>1?a(e,t.substr(0,s-1),n)+l:o+l)):t==null?o:+t},ln=function(e,t,n){var i=Vt(t[1]),r=(i?2:1)+(e<2?0:1),o=t[r],s,l;if(i&&(o.duration=t[1]),o.parent=n,e){for(s=o,l=n;l&&!("immediateRender"in s);)s=l.vars.defaults||{},l=yt(l.vars.inherit)&&l.parent;o.immediateRender=yt(s.immediateRender),e<2?o.runBackwards=1:o.startAt=t[r-1]}return new J(t[0],o,t[r+1])},te=function(e,t){return e||e===0?t(e):t},pn=function(e,t,n){return n<e?e:n>t?t:n},rt=function(e,t){return!nt(e)||!(t=bd.exec(e))?"":t[1]},Od=function(e,t,n){return te(n,function(i){return pn(e,t,i)})},Rr=[].slice,zo=function(e,t){return e&&Nt(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Nt(e[0]))&&!e.nodeType&&e!==Wt},Dd=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(i){var r;return nt(i)&&!t||zo(i,1)?(r=n).push.apply(r,Lt(i)):n.push(i)})||n},Lt=function(e,t,n){return B&&!t&&B.selector?B.selector(e):nt(e)&&!n&&(Er||!Pe())?Rr.call((t||$r).querySelectorAll(e),0):lt(e)?Dd(e,n):zo(e)?Rr.call(e,0):e?[e]:[]},Or=function(e){return e=Lt(e)[0]||un("Invalid scope")||{},function(t){var n=e.current||e.nativeElement||e;return Lt(t,n.querySelectorAll?n:n===e?un("Invalid scope")||$r.createElement("div"):e)}},No=function(e){return e.sort(function(){return .5-Math.random()})},Io=function(e){if(X(e))return e;var t=Nt(e)?e:{each:e},n=ue(t.ease),i=t.from||0,r=parseFloat(t.base)||0,o={},s=i>0&&i<1,l=isNaN(i)||s,d=t.axis,c=i,h=i;return nt(i)?c=h={center:.5,edges:.5,end:1}[i]||0:!s&&l&&(c=i[0],h=i[1]),function(u,f,p){var m=(p||t).length,g=o[m],y,w,_,b,v,C,S,A,T;if(!g){if(T=t.grid==="auto"?0:(t.grid||[1,Pt])[1],!T){for(S=-Pt;S<(S=p[T++].getBoundingClientRect().left)&&T<m;);T<m&&T--}for(g=o[m]=[],y=l?Math.min(T,m)*c-.5:i%T,w=T===Pt?0:l?m*h/T-.5:i/T|0,S=0,A=Pt,C=0;C<m;C++)_=C%T-y,b=w-(C/T|0),g[C]=v=d?Math.abs(d==="y"?b:_):Ao(_*_+b*b),v>S&&(S=v),v<A&&(A=v);i==="random"&&No(g),g.max=S-A,g.min=A,g.v=m=(parseFloat(t.amount)||parseFloat(t.each)*(T>m?m-1:d?d==="y"?m/T:T:Math.max(T,m/T))||0)*(i==="edges"?-1:1),g.b=m<0?r-m:r,g.u=rt(t.amount||t.each)||0,n=n&&m<0?Yd(n):n}return m=(g[u]-g.min)/g.max||0,V(g.b+(n?n(m):m)*g.v)+g.u}},Dr=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(n){var i=V(Math.round(parseFloat(n)/e)*e*t);return(i-i%1)/t+(Vt(n)?0:rt(n))}},$o=function(e,t){var n=lt(e),i,r;return!n&&Nt(e)&&(i=n=e.radius||Pt,e.values?(e=Lt(e.values),(r=!Vt(e[0]))&&(i*=i)):e=Dr(e.increment)),te(t,n?X(e)?function(o){return r=e(o),Math.abs(r-o)<=i?r:o}:function(o){for(var s=parseFloat(r?o.x:o),l=parseFloat(r?o.y:0),d=Pt,c=0,h=e.length,u,f;h--;)r?(u=e[h].x-s,f=e[h].y-l,u=u*u+f*f):u=Math.abs(e[h]-s),u<d&&(d=u,c=h);return c=!i||d<=i?e[c]:o,r||c===o||Vt(o)?c:c+rt(o)}:Dr(e))},Go=function(e,t,n,i){return te(lt(e)?!t:n===!0?!!(n=0):!i,function(){return lt(e)?e[~~(Math.random()*e.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*i)/i})},Fd=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(i){return t.reduce(function(r,o){return o(r)},i)}},Hd=function(e,t){return function(n){return e(parseFloat(n))+(t||rt(n))}},Wd=function(e,t,n){return Bo(e,t,0,1,n)},qo=function(e,t,n){return te(n,function(i){return e[~~t(i)]})},zd=function a(e,t,n){var i=t-e;return lt(e)?qo(e,a(0,e.length),t):te(n,function(r){return(i+(r-e)%i)%i+e})},Nd=function a(e,t,n){var i=t-e,r=i*2;return lt(e)?qo(e,a(0,e.length-1),t):te(n,function(o){return o=(r+(o-e)%r)%r||0,e+(o>i?r-o:o)})},Le=function(e){return e.replace(wd,function(t){var n=t.indexOf("[")+1,i=t.substring(n||7,n?t.indexOf("]"):t.length-1).split(_d);return Go(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},Bo=function(e,t,n,i,r){var o=t-e,s=i-n;return te(r,function(l){return n+((l-e)/o*s||0)})},Id=function a(e,t,n,i){var r=isNaN(e+t)?0:function(f){return(1-f)*e+f*t};if(!r){var o=nt(e),s={},l,d,c,h,u;if(n===!0&&(i=1)&&(n=null),o)e={p:e},t={p:t};else if(lt(e)&&!lt(t)){for(c=[],h=e.length,u=h-2,d=1;d<h;d++)c.push(a(e[d-1],e[d]));h--,r=function(p){p*=h;var m=Math.min(u,~~p);return c[m](p-m)},n=t}else i||(e=ke(lt(e)?[]:{},e));if(!c){for(l in t)jr.call(s,e,l,"get",t[l]);r=function(p){return ta(p,s)||(o?e.p:e)}}}return te(n,r)},bo=function(e,t,n){var i=e.labels,r=Pt,o,s,l;for(o in i)s=i[o]-t,s<0==!!n&&s&&r>(s=Math.abs(s))&&(l=o,r=s);return l},St=function(e,t,n){var i=e.vars,r=i[t],o=B,s=e._ctx,l,d,c;if(r)return l=i[t+"Params"],d=i.callbackScope||e,n&&Zt.length&&si(),s&&(B=s),c=l?r.apply(d,l):r.call(d),B=o,c},an=function(e){return Jt(e),e.scrollTrigger&&e.scrollTrigger.kill(!!it),e.progress()<1&&St(e,"onInterrupt"),e},Te,Vo=[],Uo=function(e){if(e)if(e=!e.name&&e.default||e,zr()||e.headless){var t=e.name,n=X(e),i=t&&!n&&e.init?function(){this._props=[]}:e,r={init:hn,render:ta,add:jr,kill:ic,modifier:nc,rawVars:0},o={targetTest:0,get:0,getSetter:gi,aliases:{},register:0};if(Pe(),e!==i){if(pt[t])return;At(i,At(li(e,r),o)),ke(i.prototype,ke(r,li(e,o))),pt[i.prop=t]=i,e.targetTest&&(ri.push(i),Gr[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Mo(t,i),e.register&&e.register(dt,i,mt)}else Vo.push(e)},H=255,on={aqua:[0,H,H],lime:[0,H,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,H],navy:[0,0,128],white:[H,H,H],olive:[128,128,0],yellow:[H,H,0],orange:[H,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[H,0,0],pink:[H,192,203],cyan:[0,H,H],transparent:[H,H,H,0]},xr=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*H+.5|0},Yo=function(e,t,n){var i=e?Vt(e)?[e>>16,e>>8&H,e&H]:0:on.black,r,o,s,l,d,c,h,u,f,p;if(!i){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),on[e])i=on[e];else if(e.charAt(0)==="#"){if(e.length<6&&(r=e.charAt(1),o=e.charAt(2),s=e.charAt(3),e="#"+r+r+o+o+s+s+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return i=parseInt(e.substr(1,6),16),[i>>16,i>>8&H,i&H,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),i=[e>>16,e>>8&H,e&H]}else if(e.substr(0,3)==="hsl"){if(i=p=e.match(go),!t)l=+i[0]%360/360,d=+i[1]/100,c=+i[2]/100,o=c<=.5?c*(d+1):c+d-c*d,r=c*2-o,i.length>3&&(i[3]*=1),i[0]=xr(l+1/3,r,o),i[1]=xr(l,r,o),i[2]=xr(l-1/3,r,o);else if(~e.indexOf("="))return i=e.match(Nr),n&&i.length<4&&(i[3]=1),i}else i=e.match(go)||on.transparent;i=i.map(Number)}return t&&!p&&(r=i[0]/H,o=i[1]/H,s=i[2]/H,h=Math.max(r,o,s),u=Math.min(r,o,s),c=(h+u)/2,h===u?l=d=0:(f=h-u,d=c>.5?f/(2-h-u):f/(h+u),l=h===r?(o-s)/f+(o<s?6:0):h===o?(s-r)/f+2:(r-o)/f+4,l*=60),i[0]=~~(l+.5),i[1]=~~(d*100+.5),i[2]=~~(c*100+.5)),n&&i.length<4&&(i[3]=1),i},Ko=function(e){var t=[],n=[],i=-1;return e.split(Bt).forEach(function(r){var o=r.match(me)||[];t.push.apply(t,o),n.push(i+=o.length+1)}),t.c=n,t},xo=function(e,t,n){var i="",r=(e+i).match(Bt),o=t?"hsla(":"rgba(",s=0,l,d,c,h;if(!r)return e;if(r=r.map(function(u){return(u=Yo(u,t,1))&&o+(t?u[0]+","+u[1]+"%,"+u[2]+"%,"+u[3]:u.join(","))+")"}),n&&(c=Ko(e),l=n.c,l.join(i)!==c.c.join(i)))for(d=e.replace(Bt,"1").split(me),h=d.length-1;s<h;s++)i+=d[s]+(~l.indexOf(s)?r.shift()||o+"0,0,0,0)":(c.length?c:r.length?r:n).shift());if(!d)for(d=e.split(Bt),h=d.length-1;s<h;s++)i+=d[s]+r[s];return i+d[h]},Bt=(function(){var a="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in on)a+="|"+e+"\\b";return new RegExp(a+")","gi")})(),$d=/hsl[a]?\(/,Yr=function(e){var t=e.join(" "),n;if(Bt.lastIndex=0,Bt.test(t))return n=$d.test(t),e[1]=xo(e[1],n),e[0]=xo(e[0],n,Ko(e[1])),!0},mn,gt=(function(){var a=Date.now,e=500,t=33,n=a(),i=n,r=1e3/240,o=r,s=[],l,d,c,h,u,f,p=function m(g){var y=a()-i,w=g===!0,_,b,v,C;if((y>e||y<0)&&(n+=y-t),i+=y,v=i-n,_=v-o,(_>0||w)&&(C=++h.frame,u=v-h.time*1e3,h.time=v=v/1e3,o+=_+(_>=r?4:r-_),b=1),w||(l=d(m)),b)for(f=0;f<s.length;f++)s[f](v,u,C,g)};return h={time:0,frame:0,tick:function(){p(!0)},deltaRatio:function(g){return u/(1e3/(g||60))},wake:function(){ko&&(!Er&&zr()&&(Wt=Er=window,$r=Wt.document||{},Ct.gsap=dt,(Wt.gsapVersions||(Wt.gsapVersions=[])).push(dt.version),Eo(oi||Wt.GreenSockGlobals||!Wt.gsap&&Wt||{}),Vo.forEach(Uo)),c=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&h.sleep(),d=c||function(g){return setTimeout(g,o-h.time*1e3+1|0)},mn=1,p(2))},sleep:function(){(c?cancelAnimationFrame:clearTimeout)(l),mn=0,d=hn},lagSmoothing:function(g,y){e=g||1/0,t=Math.min(y||33,e)},fps:function(g){r=1e3/(g||240),o=h.time*1e3+r},add:function(g,y,w){var _=y?function(b,v,C,S){g(b,v,C,S),h.remove(_)}:g;return h.remove(g),s[w?"unshift":"push"](_),Pe(),_},remove:function(g,y){~(y=s.indexOf(g))&&s.splice(y,1)&&f>=y&&f--},_listeners:s},h})(),Pe=function(){return!mn&&gt.wake()},O={},Gd=/^[\d.\-M][\d.\-,\s]/,qd=/["']/g,Bd=function(e){for(var t={},n=e.substr(1,e.length-3).split(":"),i=n[0],r=1,o=n.length,s,l,d;r<o;r++)l=n[r],s=r!==o-1?l.lastIndexOf(","):l.length,d=l.substr(0,s),t[i]=isNaN(d)?d.replace(qd,"").trim():+d,i=l.substr(s+1).trim();return t},Vd=function(e){var t=e.indexOf("(")+1,n=e.indexOf(")"),i=e.indexOf("(",t);return e.substring(t,~i&&i<n?e.indexOf(")",n+1):n)},Ud=function(e){var t=(e+"").split("("),n=O[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf("{")?[Bd(t[1])]:Vd(e).split(",").map(Ro)):O._CE&&Gd.test(e)?O._CE("",e):n},Yd=function(e){return function(t){return 1-e(1-t)}},ue=function(e,t){return e&&(X(e)?e:O[e]||Ud(e))||t},pe=function(e,t,n,i){n===void 0&&(n=function(l){return 1-t(1-l)}),i===void 0&&(i=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var r={easeIn:t,easeOut:n,easeInOut:i},o;return ht(e,function(s){O[s]=Ct[s]=r,O[o=s.toLowerCase()]=n;for(var l in r)O[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=O[s+"."+l]=r[l]}),r},jo=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},Sr=function a(e,t,n){var i=t>=1?t:1,r=(n||(e?.3:.45))/(t<1?t:1),o=r/kr*(Math.asin(1/i)||0),s=function(c){return c===1?1:i*Math.pow(2,-10*c)*yd((c-o)*r)+1},l=e==="out"?s:e==="in"?function(d){return 1-s(1-d)}:jo(s);return r=kr/r,l.config=function(d,c){return a(e,d,c)},l},Cr=function a(e,t){t===void 0&&(t=1.70158);var n=function(o){return o?--o*o*((t+1)*o+t)+1:0},i=e==="out"?n:e==="in"?function(r){return 1-n(1-r)}:jo(n);return i.config=function(r){return a(e,r)},i};ht("Linear,Quad,Cubic,Quart,Quint,Strong",function(a,e){var t=e<5?e+1:e;pe(a+",Power"+(t-1),e?function(n){return Math.pow(n,t)}:function(n){return n},function(n){return 1-Math.pow(1-n,t)},function(n){return n<.5?Math.pow(n*2,t)/2:1-Math.pow((1-n)*2,t)/2})});O.Linear.easeNone=O.none=O.Linear.easeIn;pe("Elastic",Sr("in"),Sr("out"),Sr());(function(a,e){var t=1/e,n=2*t,i=2.5*t,r=function(s){return s<t?a*s*s:s<n?a*Math.pow(s-1.5/e,2)+.75:s<i?a*(s-=2.25/e)*s+.9375:a*Math.pow(s-2.625/e,2)+.984375};pe("Bounce",function(o){return 1-r(1-o)},r)})(7.5625,2.75);pe("Expo",function(a){return Math.pow(2,10*(a-1))*a+a*a*a*a*a*a*(1-a)});pe("Circ",function(a){return-(Ao(1-a*a)-1)});pe("Sine",function(a){return a===1?1:-gd(a*fd)+1});pe("Back",Cr("in"),Cr("out"),Cr());O.SteppedEase=O.steps=Ct.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,i=e+(t?0:1),r=t?1:0,o=1-W;return function(s){return((i*pn(0,o,s)|0)+r)*n}}};cn.ease=O["quad.out"];ht("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(a){return qr+=a+","+a+"Params,"});var Kr=function(e,t){this.id=pd++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:Vr,this.set=t?t.getSetter:gi},fn=(function(){function a(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Me(this,+t.duration,1,1),this.data=t.data,B&&(this._ctx=B,B.data.push(this)),mn||gt.wake()}var e=a.prototype;return e.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},e.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},e.totalDuration=function(n){return arguments.length?(this._dirty=0,Me(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(n,i){if(Pe(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(pi(this,n),!r._dp||r.parent||Fo(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&zt(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===W||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Lo(this,n,i)),this},e.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+_o(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},e.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+_o(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(n,i){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*r,i):this._repeat?Ee(this._tTime,r)+1:1},e.timeScale=function(n,i){if(!arguments.length)return this._rts===-W?0:this._rts;if(this._rts===n)return this;var r=this.parent&&this._ts?di(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-W?0:this._rts,this.totalTime(pn(-Math.abs(this._delay),this.totalDuration(),r),i!==!1),fi(this),kd(this)},e.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Pe(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==W&&(this._tTime-=W)))),this):this._ps},e.startTime=function(n){if(arguments.length){this._start=V(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&zt(i,this,this._start-this._delay),this}return this._start},e.endTime=function(n){return this._start+(yt(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?di(i.rawTime(n),this):this._tTime:this._tTime},e.revert=function(n){n===void 0&&(n=Sd);var i=it;return it=n,Ur(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),it=i,this},e.globalTime=function(n){for(var i=this,r=arguments.length?n:i.rawTime();i;)r=i._start+r/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):r},e.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,vo(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,vo(this),i?this.time(i):this}return this._rDelay},e.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},e.seek=function(n,i){return this.totalTime(Mt(this,n),yt(i))},e.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,yt(i)),this._dur||(this._zTime=-W),this},e.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},e.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},e.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-W:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-W,this},e.isActive=function(){var n=this.parent||this._dp,i=this._start,r;return!!(!n||this._ts&&this._initted&&n.isActive()&&(r=n.rawTime(!0))>=i&&r<this.endTime(!0)-W)},e.eventCallback=function(n,i,r){var o=this.vars;return arguments.length>1?(i?(o[n]=i,r&&(o[n+"Params"]=r),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},e.then=function(n){var i=this,r=i._prom;return new Promise(function(o){var s=X(n)?n:Oo,l=function(){var c=i.then;i.then=null,r&&r(),X(s)&&(s=s(i))&&(s.then||s===i)&&(i.then=c),o(s),i.then=c};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},e.kill=function(){an(this)},a})();At(fn.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-W,_prom:0,_ps:!1,_rts:1});var st=(function(a){Co(e,a);function e(n,i){var r;return n===void 0&&(n={}),r=a.call(this,n)||this,r.labels={},r.smoothChildTiming=!!n.smoothChildTiming,r.autoRemoveChildren=!!n.autoRemoveChildren,r._sort=yt(n.sortChildren),U&&zt(n.parent||U,qt(r),i),n.reversed&&r.reverse(),n.paused&&r.paused(!0),n.scrollTrigger&&Ho(qt(r),n.scrollTrigger),r}var t=e.prototype;return t.to=function(i,r,o){return ln(0,arguments,this),this},t.from=function(i,r,o){return ln(1,arguments,this),this},t.fromTo=function(i,r,o,s){return ln(2,arguments,this),this},t.set=function(i,r,o){return r.duration=0,r.parent=this,sn(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new J(i,r,Mt(this,o),1),this},t.call=function(i,r,o){return zt(this,J.delayedCall(0,i,r),o)},t.staggerTo=function(i,r,o,s,l,d,c){return o.duration=r,o.stagger=o.stagger||s,o.onComplete=d,o.onCompleteParams=c,o.parent=this,new J(i,o,Mt(this,l)),this},t.staggerFrom=function(i,r,o,s,l,d,c){return o.runBackwards=1,sn(o).immediateRender=yt(o.immediateRender),this.staggerTo(i,r,o,s,l,d,c)},t.staggerFromTo=function(i,r,o,s,l,d,c,h){return s.startAt=o,sn(s).immediateRender=yt(s.immediateRender),this.staggerTo(i,r,s,l,d,c,h)},t.render=function(i,r,o){var s=this._time,l=this._dirty?this.totalDuration():this._tDur,d=this._dur,c=i<=0?0:V(i),h=this._zTime<0!=i<0&&(this._initted||!d),u,f,p,m,g,y,w,_,b,v,C,S;if(this!==U&&c>l&&i>=0&&(c=l),c!==this._tTime||o||h){if(s!==this._time&&d&&(c+=this._time-s,i+=this._time-s),u=c,b=this._start,_=this._ts,y=!_,h&&(d||(s=this._zTime),(i||!r)&&(this._zTime=i)),this._repeat){if(C=this._yoyo,g=d+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(g*100+i,r,o);if(u=V(c%g),c===l?(m=this._repeat,u=d):(v=V(c/g),m=~~v,m&&m===v&&(u=d,m--),u>d&&(u=d)),v=Ee(this._tTime,g),!s&&this._tTime&&v!==m&&this._tTime-v*g-this._dur<=0&&(v=m),C&&m&1&&(u=d-u,S=1),m!==v&&!this._lock){var A=C&&v&1,T=A===(C&&m&1);if(m<v&&(A=!A),s=A?0:c%d?d:c,this._lock=1,this.render(s||(S?0:V(m*g)),r,!d)._lock=0,this._tTime=c,!r&&this.parent&&St(this,"onRepeat"),this.vars.repeatRefresh&&!S&&(this.invalidate()._lock=1,v=m),s&&s!==this._time||y!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(d=this._dur,l=this._tDur,T&&(this._lock=2,s=A?d:-1e-4,this.render(s,!0),this.vars.repeatRefresh&&!S&&this.invalidate()),this._lock=0,!this._ts&&!y)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(w=Ld(this,V(s),V(u)),w&&(c-=u-(u=w._start))),this._tTime=c,this._time=u,this._act=!!_,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,s=0),!s&&c&&d&&!r&&!v&&(St(this,"onStart"),this._tTime!==c))return this;if(u>=s&&i>=0)for(f=this._first;f;){if(p=f._next,(f._act||u>=f._start)&&f._ts&&w!==f){if(f.parent!==this)return this.render(i,r,o);if(f.render(f._ts>0?(u-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(u-f._start)*f._ts,r,o),u!==this._time||!this._ts&&!y){w=0,p&&(c+=this._zTime=-W);break}}f=p}else{f=this._last;for(var x=i<0?i:u;f;){if(p=f._prev,(f._act||x<=f._end)&&f._ts&&w!==f){if(f.parent!==this)return this.render(i,r,o);if(f.render(f._ts>0?(x-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(x-f._start)*f._ts,r,o||it&&Ur(f)),u!==this._time||!this._ts&&!y){w=0,p&&(c+=this._zTime=x?-W:W);break}}f=p}}if(w&&!r&&(this.pause(),w.render(u>=s?0:-W)._zTime=u>=s?1:-1,this._ts))return this._start=b,fi(this),this.render(i,r,o);this._onUpdate&&!r&&St(this,"onUpdate",!0),(c===l&&this._tTime>=this.totalDuration()||!c&&s)&&(b===this._start||Math.abs(_)!==Math.abs(this._ts))&&(this._lock||((i||!d)&&(c===l&&this._ts>0||!c&&this._ts<0)&&Jt(this,1),!r&&!(i<0&&!s)&&(c||s||!l)&&(St(this,c===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(c<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(i,r){var o=this;if(Vt(r)||(r=Mt(this,r,i)),!(i instanceof fn)){if(lt(i))return i.forEach(function(s){return o.add(s,r)}),this;if(nt(i))return this.addLabel(i,r);if(X(i))i=J.delayedCall(0,i);else return this}return this!==i?zt(this,i,r):this},t.getChildren=function(i,r,o,s){i===void 0&&(i=!0),r===void 0&&(r=!0),o===void 0&&(o=!0),s===void 0&&(s=-Pt);for(var l=[],d=this._first;d;)d._start>=s&&(d instanceof J?r&&l.push(d):(o&&l.push(d),i&&l.push.apply(l,d.getChildren(!0,r,o)))),d=d._next;return l},t.getById=function(i){for(var r=this.getChildren(1,1,1),o=r.length;o--;)if(r[o].vars.id===i)return r[o]},t.remove=function(i){return nt(i)?this.removeLabel(i):X(i)?this.killTweensOf(i):(i.parent===this&&mi(this,i),i===this._recent&&(this._recent=this._last),ce(this))},t.totalTime=function(i,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=V(gt.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),a.prototype.totalTime.call(this,i,r),this._forcing=0,this):this._tTime},t.addLabel=function(i,r){return this.labels[i]=Mt(this,r),this},t.removeLabel=function(i){return delete this.labels[i],this},t.addPause=function(i,r,o){var s=J.delayedCall(0,r||hn,o);return s.data="isPause",this._hasPause=1,zt(this,s,Mt(this,i))},t.removePause=function(i){var r=this._first;for(i=Mt(this,i);r;)r._start===i&&r.data==="isPause"&&Jt(r),r=r._next},t.killTweensOf=function(i,r,o){for(var s=this.getTweensOf(i,o),l=s.length;l--;)Xt!==s[l]&&s[l].kill(i,r);return this},t.getTweensOf=function(i,r){for(var o=[],s=Lt(i),l=this._first,d=Vt(r),c;l;)l instanceof J?Cd(l._targets,s)&&(d?(!Xt||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&o.push(l):(c=l.getTweensOf(s,r)).length&&o.push.apply(o,c),l=l._next;return o},t.tweenTo=function(i,r){r=r||{};var o=this,s=Mt(o,i),l=r,d=l.startAt,c=l.onStart,h=l.onStartParams,u=l.immediateRender,f,p=J.to(o,At({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:s,overwrite:"auto",duration:r.duration||Math.abs((s-(d&&"time"in d?d.time:o._time))/o.timeScale())||W,onStart:function(){if(o.pause(),!f){var g=r.duration||Math.abs((s-(d&&"time"in d?d.time:o._time))/o.timeScale());p._dur!==g&&Me(p,g,0,1).render(p._time,!0,!0),f=1}c&&c.apply(p,h||[])}},r));return u?p.render(0):p},t.tweenFromTo=function(i,r,o){return this.tweenTo(r,At({startAt:{time:Mt(this,i)}},o))},t.recent=function(){return this._recent},t.nextLabel=function(i){return i===void 0&&(i=this._time),bo(this,Mt(this,i))},t.previousLabel=function(i){return i===void 0&&(i=this._time),bo(this,Mt(this,i),1)},t.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+W)},t.shiftChildren=function(i,r,o){o===void 0&&(o=0);var s=this._first,l=this.labels,d;for(i=V(i);s;)s._start>=o&&(s._start+=i,s._end+=i),s=s._next;if(r)for(d in l)l[d]>=o&&(l[d]+=i);return ce(this)},t.invalidate=function(i){var r=this._first;for(this._lock=0;r;)r.invalidate(i),r=r._next;return a.prototype.invalidate.call(this,i)},t.clear=function(i){i===void 0&&(i=!0);for(var r=this._first,o;r;)o=r._next,this.remove(r),r=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),ce(this)},t.totalDuration=function(i){var r=0,o=this,s=o._last,l=Pt,d,c,h;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(h=o.parent;s;)d=s._prev,s._dirty&&s.totalDuration(),c=s._start,c>l&&o._sort&&s._ts&&!o._lock?(o._lock=1,zt(o,s,c-s._delay,1)._lock=0):l=c,c<0&&s._ts&&(r-=c,(!h&&!o._dp||h&&h.smoothChildTiming)&&(o._start+=V(c/o._ts),o._time-=c,o._tTime-=c),o.shiftChildren(-c,!1,-1/0),l=0),s._end>r&&s._ts&&(r=s._end),s=d;Me(o,o===U&&o._time>r?o._time:r,1,1),o._dirty=0}return o._tDur},e.updateRoot=function(i){if(U._ts&&(Lo(U,di(i,U)),Po=gt.frame),gt.frame>=yo){yo+=wt.autoSleep||120;var r=U._first;if((!r||!r._ts)&&wt.autoSleep&&gt._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||gt.sleep()}}},e})(fn);At(st.prototype,{_lock:0,_hasPause:0,_forcing:0});var Kd=function(e,t,n,i,r,o,s){var l=new mt(this._pt,e,t,0,1,Jr,null,r),d=0,c=0,h,u,f,p,m,g,y,w;for(l.b=n,l.e=i,n+="",i+="",(y=~i.indexOf("random("))&&(i=Le(i)),o&&(w=[n,i],o(w,e,t),n=w[0],i=w[1]),u=n.match(vr)||[];h=vr.exec(i);)p=h[0],m=i.substring(d,h.index),f?f=(f+1)%5:m.substr(-5)==="rgba("&&(f=1),p!==u[c++]&&(g=parseFloat(u[c-1])||0,l._pt={_next:l._pt,p:m||c===1?m:",",s:g,c:p.charAt(1)==="="?fe(g,p)-g:parseFloat(p)-g,m:f&&f<4?Math.round:0},d=vr.lastIndex);return l.c=d<i.length?i.substring(d,i.length):"",l.fp=s,(Ir.test(i)||y)&&(l.e=0),this._pt=l,l},jr=function(e,t,n,i,r,o,s,l,d,c){X(i)&&(i=i(r||0,e,o));var h=e[t],u=n!=="get"?n:X(h)?d?e[t.indexOf("set")||!X(e["get"+t.substr(3)])?t:"get"+t.substr(3)](d):e[t]():h,f=X(h)?d?Jd:Qo:Qr,p;if(nt(i)&&(~i.indexOf("random(")&&(i=Le(i)),i.charAt(1)==="="&&(p=fe(u,i)+(rt(u)||0),(p||p===0)&&(i=p))),!c||u!==i||Fr)return!isNaN(u*i)&&i!==""?(p=new mt(this._pt,e,t,+u||0,i-(u||0),typeof h=="boolean"?ec:Jo,0,f),d&&(p.fp=d),s&&p.modifier(s,this,e),this._pt=p):(!h&&!(t in e)&&hi(t,i),Kd.call(this,e,t,u,i,f,l||wt.stringFilter,d))},jd=function(e,t,n,i,r){if(X(e)&&(e=dn(e,r,t,n,i)),!Nt(e)||e.style&&e.nodeType||lt(e)||To(e))return nt(e)?dn(e,r,t,n,i):e;var o={},s;for(s in e)o[s]=dn(e[s],r,t,n,i);return o},Xr=function(e,t,n,i,r,o){var s,l,d,c;if(pt[e]&&(s=new pt[e]).init(r,s.rawVars?t[e]:jd(t[e],i,r,o,n),n,i,o)!==!1&&(n._pt=l=new mt(n._pt,r,e,0,1,s.render,s,0,s.priority),n!==Te))for(d=n._ptLookup[n._targets.indexOf(r)],c=s._props.length;c--;)d[s._props[c]]=l;return s},Xt,Fr,Zr=function a(e,t,n){var i=e.vars,r=i.ease,o=i.startAt,s=i.immediateRender,l=i.lazy,d=i.onUpdate,c=i.runBackwards,h=i.yoyoEase,u=i.keyframes,f=i.autoRevert,p=e._dur,m=e._startAt,g=e._targets,y=e.parent,w=y&&y.data==="nested"?y.vars.targets:g,_=e._overwrite==="auto"&&!Wr,b=e.timeline,v=i.easeReverse||h,C,S,A,T,x,E,L,D,z,I,G,F,q;if(b&&(!u||!r)&&(r="none"),e._ease=ue(r,cn.ease),e._rEase=v&&(ue(v)||e._ease),e._from=!b&&!!i.runBackwards,e._from&&(e.ratio=1),!b||u&&!i.stagger){if(D=g[0]?Qt(g[0]).harness:0,F=D&&i[D.prop],C=li(i,Gr),m&&(m._zTime<0&&m.progress(1),t<0&&c&&s&&!f?m.render(-1,!0):m.revert(c&&p?ii:xd),m._lazy=0),o){if(Jt(e._startAt=J.set(g,At({data:"isStart",overwrite:!1,parent:y,immediateRender:!0,lazy:!m&&yt(l),startAt:null,delay:0,onUpdate:d&&function(){return St(e,"onUpdate")},stagger:0},o))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(it||!s&&!f)&&e._startAt.revert(ii),s&&p&&t<=0&&n<=0){t&&(e._zTime=t);return}}else if(c&&p&&!m){if(t&&(s=!1),A=At({overwrite:!1,data:"isFromStart",lazy:s&&!m&&yt(l),immediateRender:s,stagger:0,parent:y},C),F&&(A[D.prop]=F),Jt(e._startAt=J.set(g,A)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(it?e._startAt.revert(ii):e._startAt.render(-1,!0)),e._zTime=t,!s)a(e._startAt,W,W);else if(!t)return}for(e._pt=e._ptCache=0,l=p&&yt(l)||l&&!p,S=0;S<g.length;S++){if(x=g[S],L=x._gsap||Br(g)[S]._gsap,e._ptLookup[S]=I={},Mr[L.id]&&Zt.length&&si(),G=w===g?S:w.indexOf(x),D&&(z=new D).init(x,F||C,e,G,w)!==!1&&(e._pt=T=new mt(e._pt,x,z.name,0,1,z.render,z,0,z.priority),z._props.forEach(function(xt){I[xt]=T}),z.priority&&(E=1)),!D||F)for(A in C)pt[A]&&(z=Xr(A,C,e,G,x,w))?z.priority&&(E=1):I[A]=T=jr.call(e,x,A,"get",C[A],G,w,0,i.stringFilter);e._op&&e._op[S]&&e.kill(x,e._op[S]),_&&e._pt&&(Xt=e,U.killTweensOf(x,I,e.globalTime(t)),q=!e.parent,Xt=0),e._pt&&l&&(Mr[L.id]=1)}E&&ea(e),e._onInit&&e._onInit(e)}e._onUpdate=d,e._initted=(!e._op||e._pt)&&!q,u&&t<=0&&b.render(Pt,!0,!0)},Xd=function(e,t,n,i,r,o,s,l){var d=(e._pt&&e._ptCache||(e._ptCache={}))[t],c,h,u,f;if(!d)for(d=e._ptCache[t]=[],u=e._ptLookup,f=e._targets.length;f--;){if(c=u[f][t],c&&c.d&&c.d._pt)for(c=c.d._pt;c&&c.p!==t&&c.fp!==t;)c=c._next;if(!c)return Fr=1,e.vars[t]="+=0",Zr(e,s),Fr=0,l?un(t+" not eligible for reset. Try splitting into individual properties"):1;d.push(c)}for(f=d.length;f--;)h=d[f],c=h._pt||h,c.s=(i||i===0)&&!r?i:c.s+(i||0)+o*c.c,c.c=n-c.s,h.e&&(h.e=Z(n)+rt(h.e)),h.b&&(h.b=c.s+rt(h.b))},Zd=function(e,t){var n=e[0]?Qt(e[0]).harness:0,i=n&&n.aliases,r,o,s,l;if(!i)return t;r=ke({},t);for(o in i)if(o in r)for(l=i[o].split(","),s=l.length;s--;)r[l[s]]=r[o];return r},Qd=function(e,t,n,i){var r=t.ease||i||"power1.inOut",o,s;if(lt(t))s=n[e]||(n[e]=[]),t.forEach(function(l,d){return s.push({t:d/(t.length-1)*100,v:l,e:r})});else for(o in t)s=n[o]||(n[o]=[]),o==="ease"||s.push({t:parseFloat(e),v:t[o],e:r})},dn=function(e,t,n,i,r){return X(e)?e.call(t,n,i,r):nt(e)&&~e.indexOf("random(")?Le(e):e},Xo=qr+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Zo={};ht(Xo+",id,stagger,delay,duration,paused,scrollTrigger",function(a){return Zo[a]=1});var J=(function(a){Co(e,a);function e(n,i,r,o){var s;typeof i=="number"&&(r.duration=i,i=r,r=null),s=a.call(this,o?i:sn(i))||this;var l=s.vars,d=l.duration,c=l.delay,h=l.immediateRender,u=l.stagger,f=l.overwrite,p=l.keyframes,m=l.defaults,g=l.scrollTrigger,y=i.parent||U,w=(lt(n)||To(n)?Vt(n[0]):"length"in i)?[n]:Lt(n),_,b,v,C,S,A,T,x;if(s._targets=w.length?Br(w):un("GSAP target "+n+" not found. https://gsap.com",!wt.nullTargetWarn)||[],s._ptLookup=[],s._overwrite=f,p||u||ni(d)||ni(c)){i=s.vars;var E=i.easeReverse||i.yoyoEase;if(_=s.timeline=new st({data:"nested",defaults:m||{},targets:y&&y.data==="nested"?y.vars.targets:w}),_.kill(),_.parent=_._dp=qt(s),_._start=0,u||ni(d)||ni(c)){if(C=w.length,T=u&&Io(u),Nt(u))for(S in u)~Xo.indexOf(S)&&(x||(x={}),x[S]=u[S]);for(b=0;b<C;b++)v=li(i,Zo),v.stagger=0,E&&(v.easeReverse=E),x&&ke(v,x),A=w[b],v.duration=+dn(d,qt(s),b,A,w),v.delay=(+dn(c,qt(s),b,A,w)||0)-s._delay,!u&&C===1&&v.delay&&(s._delay=c=v.delay,s._start+=c,v.delay=0),_.to(A,v,T?T(b,A,w):0),_._ease=O.none;_.duration()?d=c=0:s.timeline=0}else if(p){sn(At(_.vars.defaults,{ease:"none"})),_._ease=ue(p.ease||i.ease||"none");var L=0,D,z,I;if(lt(p))p.forEach(function(G){return _.to(w,G,">")}),_.duration();else{v={};for(S in p)S==="ease"||S==="easeEach"||Qd(S,p[S],v,p.easeEach);for(S in v)for(D=v[S].sort(function(G,F){return G.t-F.t}),L=0,b=0;b<D.length;b++)z=D[b],I={ease:z.e,duration:(z.t-(b?D[b-1].t:0))/100*d},I[S]=z.v,_.to(w,I,L),L+=I.duration;_.duration()<d&&_.to({},{duration:d-_.duration()})}}d||s.duration(d=_.duration())}else s.timeline=0;return f===!0&&!Wr&&(Xt=qt(s),U.killTweensOf(w),Xt=0),zt(y,qt(s),r),i.reversed&&s.reverse(),i.paused&&s.paused(!0),(h||!d&&!p&&s._start===V(y._time)&&yt(h)&&Ed(qt(s))&&y.data!=="nested")&&(s._tTime=-W,s.render(Math.max(0,-c)||0)),g&&Ho(qt(s),g),s}var t=e.prototype;return t.render=function(i,r,o){var s=this._time,l=this._tDur,d=this._dur,c=i<0,h=i>l-W&&!c?l:i<W?0:i,u,f,p,m,g,y,w,_;if(!d)Pd(this,i,r,o);else if(h!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==c||this._lazy){if(u=h,_=this.timeline,this._repeat){if(m=d+this._rDelay,this._repeat<-1&&c)return this.totalTime(m*100+i,r,o);if(u=V(h%m),h===l?(p=this._repeat,u=d):(g=V(h/m),p=~~g,p&&p===g?(u=d,p--):u>d&&(u=d)),y=this._yoyo&&p&1,y&&(u=d-u),g=Ee(this._tTime,m),u===s&&!o&&this._initted&&p===g)return this._tTime=h,this;p!==g&&this.vars.repeatRefresh&&!y&&!this._lock&&u!==m&&this._initted&&(this._lock=o=1,this.render(V(m*p),!0).invalidate()._lock=0)}if(!this._initted){if(Wo(this,c?i:u,o,r,h))return this._tTime=0,this;if(s!==this._time&&!(o&&this.vars.repeatRefresh&&p!==g))return this;if(d!==this._dur)return this.render(i,r,o)}if(this._rEase){var b=u<s;if(b!==this._inv){var v=b?s:d-s;this._inv=b,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=s,this._invRecip=v?(b?-1:1)/v:0,this._invScale=b?-this.ratio:1-this.ratio,this._invEase=b?this._rEase:this._ease}this.ratio=w=this._invRatio+this._invScale*this._invEase((u-this._invTime)*this._invRecip)}else this.ratio=w=this._ease(u/d);if(this._from&&(this.ratio=w=1-w),this._tTime=h,this._time=u,!this._act&&this._ts&&(this._act=1,this._lazy=0),!s&&h&&!r&&!g&&(St(this,"onStart"),this._tTime!==h))return this;for(f=this._pt;f;)f.r(w,f.d),f=f._next;_&&_.render(i<0?i:_._dur*_._ease(u/this._dur),r,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!r&&(c&&Pr(this,i,r,o),St(this,"onUpdate")),this._repeat&&p!==g&&this.vars.onRepeat&&!r&&this.parent&&St(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(c&&!this._onUpdate&&Pr(this,i,!0,!0),(i||!d)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&Jt(this,1),!r&&!(c&&!s)&&(h||s||y)&&(St(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),a.prototype.invalidate.call(this,i)},t.resetTo=function(i,r,o,s,l){mn||gt.wake(),this._ts||this.play();var d=Math.min(this._dur,(this._dp._time-this._start)*this._ts),c;return this._initted||Zr(this,d),c=this._ease(d/this._dur),Xd(this,i,r,o,s,c,d,l)?this.resetTo(i,r,o,s,1):(pi(this,0),this.parent||Do(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(i,r){if(r===void 0&&(r="all"),!i&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?an(this):this.scrollTrigger&&this.scrollTrigger.kill(!!it),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,r,Xt&&Xt.vars.overwrite!==!0)._first||an(this),this.parent&&o!==this.timeline.totalDuration()&&Me(this,this._dur*this.timeline._tDur/o,0,1),this}var s=this._targets,l=i?Lt(i):s,d=this._ptLookup,c=this._pt,h,u,f,p,m,g,y;if((!r||r==="all")&&Td(s,l))return r==="all"&&(this._pt=0),an(this);for(h=this._op=this._op||[],r!=="all"&&(nt(r)&&(m={},ht(r,function(w){return m[w]=1}),r=m),r=Zd(s,r)),y=s.length;y--;)if(~l.indexOf(s[y])){u=d[y],r==="all"?(h[y]=r,p=u,f={}):(f=h[y]=h[y]||{},p=r);for(m in p)g=u&&u[m],g&&((!("kill"in g.d)||g.d.kill(m)===!0)&&mi(this,g,"_pt"),delete u[m]),f!=="all"&&(f[m]=1)}return this._initted&&!this._pt&&c&&an(this),this},e.to=function(i,r){return new e(i,r,arguments[2])},e.from=function(i,r){return ln(1,arguments)},e.delayedCall=function(i,r,o,s){return new e(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:r,onReverseComplete:r,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:s})},e.fromTo=function(i,r,o){return ln(2,arguments)},e.set=function(i,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new e(i,r)},e.killTweensOf=function(i,r,o){return U.killTweensOf(i,r,o)},e})(fn);At(J.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});ht("staggerTo,staggerFrom,staggerFromTo",function(a){J[a]=function(){var e=new st,t=Rr.call(arguments,0);return t.splice(a==="staggerFromTo"?5:4,0,0),e[a].apply(e,t)}});var Qr=function(e,t,n){return e[t]=n},Qo=function(e,t,n){return e[t](n)},Jd=function(e,t,n,i){return e[t](i.fp,n)},tc=function(e,t,n){return e.setAttribute(t,n)},gi=function(e,t){return X(e[t])?Qo:ui(e[t])&&e.setAttribute?tc:Qr},Jo=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},ec=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Jr=function(e,t){var n=t._pt,i="";if(!e&&t.b)i=t.b;else if(e===1&&t.e)i=t.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+i,n=n._next;i+=t.c}t.set(t.t,t.p,i,t)},ta=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},nc=function(e,t,n,i){for(var r=this._pt,o;r;)o=r._next,r.p===i&&r.modifier(e,t,n),r=o},ic=function(e){for(var t=this._pt,n,i;t;)i=t._next,t.p===e&&!t.op||t.op===e?mi(this,t,"_pt"):t.dep||(n=1),t=i;return!n},rc=function(e,t,n,i){i.mSet(e,t,i.m.call(i.tween,n,i.mt),i)},ea=function(e){for(var t=e._pt,n,i,r,o;t;){for(n=t._next,i=r;i&&i.pr>t.pr;)i=i._next;(t._prev=i?i._prev:o)?t._prev._next=t:r=t,(t._next=i)?i._prev=t:o=t,t=n}e._pt=r},mt=(function(){function a(t,n,i,r,o,s,l,d,c){this.t=n,this.s=r,this.c=o,this.p=i,this.r=s||Jo,this.d=l||this,this.set=d||Qr,this.pr=c||0,this._next=t,t&&(t._prev=this)}var e=a.prototype;return e.modifier=function(n,i,r){this.mSet=this.mSet||this.set,this.set=rc,this.m=n,this.mt=r,this.tween=i},a})();ht(qr+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(a){return Gr[a]=1});Ct.TweenMax=Ct.TweenLite=J;Ct.TimelineLite=Ct.TimelineMax=st;U=new st({sortChildren:!1,defaults:cn,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});wt.stringFilter=Yr;var he=[],ai={},ac=[],So=0,oc=0,Ar=function(e){return(ai[e]||ac).map(function(t){return t()})},Hr=function(){var e=Date.now(),t=[];e-So>2&&(Ar("matchMediaInit"),he.forEach(function(n){var i=n.queries,r=n.conditions,o,s,l,d;for(s in i)o=Wt.matchMedia(i[s]).matches,o&&(l=1),o!==r[s]&&(r[s]=o,d=1);d&&(n.revert(),l&&t.push(n))}),Ar("matchMediaRevert"),t.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),So=e,Ar("matchMedia"))},ts=(function(){function a(t,n){this.selector=n&&Or(n),this.data=[],this._r=[],this.isReverted=!1,this.id=oc++,t&&this.add(t)}var e=a.prototype;return e.add=function(n,i,r){X(n)&&(r=i,i=n,n=X);var o=this,s=function(){var d=B,c=o.selector,h;return d&&d!==o&&d.data.push(o),r&&(o.selector=Or(r)),B=o,h=i.apply(o,arguments),X(h)&&o._r.push(h),B=d,o.selector=c,o.isReverted=!1,h};return o.last=s,n===X?s(o,function(l){return o.add(null,l)}):n?o[n]=s:s},e.ignore=function(n){var i=B;B=null,n(this),B=i},e.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof a?n.push.apply(n,i.getTweens()):i instanceof J&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(n,i){var r=this;if(n?(function(){for(var s=r.getTweens(),l=r.data.length,d;l--;)d=r.data[l],d.data==="isFlip"&&(d.revert(),d.getChildren(!0,!0,!1).forEach(function(c){return s.splice(s.indexOf(c),1)}));for(s.map(function(c){return{g:c._dur||c._delay||c._sat&&!c._sat.vars.immediateRender?c.globalTime(0):-1/0,t:c}}).sort(function(c,h){return h.g-c.g||-1/0}).forEach(function(c){return c.t.revert(n)}),l=r.data.length;l--;)d=r.data[l],d instanceof st?d.data!=="nested"&&(d.scrollTrigger&&d.scrollTrigger.revert(),d.kill()):!(d instanceof J)&&d.revert&&d.revert(n);r._r.forEach(function(c){return c(n,r)}),r.isReverted=!0})():this.data.forEach(function(s){return s.kill&&s.kill()}),this.clear(),i)for(var o=he.length;o--;)he[o].id===this.id&&he.splice(o,1)},e.revert=function(n){this.kill(n||{})},a})(),sc=(function(){function a(t){this.contexts=[],this.scope=t,B&&B.data.push(this)}var e=a.prototype;return e.add=function(n,i,r){Nt(n)||(n={matches:n});var o=new ts(0,r||this.scope),s=o.conditions={},l,d,c;B&&!o.selector&&(o.selector=B.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(d in n)d==="all"?c=1:(l=Wt.matchMedia(n[d]),l&&(he.indexOf(o)<0&&he.push(o),(s[d]=l.matches)&&(c=1),l.addListener?l.addListener(Hr):l.addEventListener("change",Hr)));return c&&i(o,function(h){return o.add(null,h)}),this},e.revert=function(n){this.kill(n||{})},e.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},a})(),ci={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(i){return Uo(i)})},timeline:function(e){return new st(e)},getTweensOf:function(e,t){return U.getTweensOf(e,t)},getProperty:function(e,t,n,i){nt(e)&&(e=Lt(e)[0]);var r=Qt(e||{}).get,o=n?Oo:Ro;return n==="native"&&(n=""),e&&(t?o((pt[t]&&pt[t].get||r)(e,t,n,i)):function(s,l,d){return o((pt[s]&&pt[s].get||r)(e,s,l,d))})},quickSetter:function(e,t,n){if(e=Lt(e),e.length>1){var i=e.map(function(c){return dt.quickSetter(c,t,n)}),r=i.length;return function(c){for(var h=r;h--;)i[h](c)}}e=e[0]||{};var o=pt[t],s=Qt(e),l=s.harness&&(s.harness.aliases||{})[t]||t,d=o?function(c){var h=new o;Te._pt=0,h.init(e,n?c+n:c,Te,0,[e]),h.render(1,h),Te._pt&&ta(1,Te)}:s.set(e,l);return o?d:function(c){return d(e,l,n?c+n:c,s,1)}},quickTo:function(e,t,n){var i,r=dt.to(e,At((i={},i[t]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,d,c){return r.resetTo(t,l,d,c)};return o.tween=r,o},isTweening:function(e){return U.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=ue(e.ease,cn.ease)),wo(cn,e||{})},config:function(e){return wo(wt,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,i=e.plugins,r=e.defaults,o=e.extendTimeline;(i||"").split(",").forEach(function(s){return s&&!pt[s]&&!Ct[s]&&un(t+" effect requires "+s+" plugin.")}),br[t]=function(s,l,d){return n(Lt(s),At(l||{},r),d)},o&&(st.prototype[t]=function(s,l,d){return this.add(br[t](s,Nt(l)?l:(d=l)&&{},this),d)})},registerEase:function(e,t){O[e]=ue(t)},parseEase:function(e,t){return arguments.length?ue(e,t):O},getById:function(e){return U.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new st(e),i,r;for(n.smoothChildTiming=yt(e.smoothChildTiming),U.remove(n),n._dp=0,n._time=n._tTime=U._time,i=U._first;i;)r=i._next,(t||!(!i._dur&&i instanceof J&&i.vars.onComplete===i._targets[0]))&&zt(n,i,i._start-i._delay),i=r;return zt(U,n,0),n},context:function(e,t){return e?new ts(e,t):B},matchMedia:function(e){return new sc(e)},matchMediaRefresh:function(){return he.forEach(function(e){var t=e.conditions,n,i;for(i in t)t[i]&&(t[i]=!1,n=1);n&&e.revert()})||Hr()},addEventListener:function(e,t){var n=ai[e]||(ai[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=ai[e],i=n&&n.indexOf(t);i>=0&&n.splice(i,1)},utils:{wrap:zd,wrapYoyo:Nd,distribute:Io,random:Go,snap:$o,normalize:Wd,getUnit:rt,clamp:Od,splitColor:Yo,toArray:Lt,selector:Or,mapRange:Bo,pipe:Fd,unitize:Hd,interpolate:Id,shuffle:No},install:Eo,effects:br,ticker:gt,updateRoot:st.updateRoot,plugins:pt,globalTimeline:U,core:{PropTween:mt,globals:Mo,Tween:J,Timeline:st,Animation:fn,getCache:Qt,_removeLinkedListItem:mi,reverting:function(){return it},context:function(e){return e&&B&&(B.data.push(e),e._ctx=B),B},suppressOverwrites:function(e){return Wr=e}}};ht("to,from,fromTo,delayedCall,set,killTweensOf",function(a){return ci[a]=J[a]});gt.add(st.updateRoot);Te=ci.to({},{duration:0});var lc=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},dc=function(e,t){var n=e._targets,i,r,o;for(i in t)for(r=n.length;r--;)o=e._ptLookup[r][i],o&&(o=o.d)&&(o._pt&&(o=lc(o,i)),o&&o.modifier&&o.modifier(t[i],e,n[r],i))},Tr=function(e,t){return{name:e,headless:1,rawVars:1,init:function(i,r,o){o._onInit=function(s){var l,d;if(nt(r)&&(l={},ht(r,function(c){return l[c]=1}),r=l),t){l={};for(d in r)l[d]=t(r[d]);r=l}dc(s,r)}}}},dt=ci.registerPlugin({name:"attr",init:function(e,t,n,i,r){var o,s,l;this.tween=n;for(o in t)l=e.getAttribute(o)||"",s=this.add(e,"setAttribute",(l||0)+"",t[o],i,r,0,0,o),s.op=o,s.b=l,this._props.push(o)},render:function(e,t){for(var n=t._pt;n;)it?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:"endArray",headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},Tr("roundProps",Dr),Tr("modifiers"),Tr("snap",$o))||ci;J.version=st.version=dt.version="3.15.0";ko=1;zr()&&Pe();var cc=O.Power0,uc=O.Power1,hc=O.Power2,mc=O.Power3,fc=O.Power4,pc=O.Linear,gc=O.Quad,yc=O.Cubic,wc=O.Quart,_c=O.Quint,vc=O.Strong,bc=O.Elastic,xc=O.Back,Sc=O.SteppedEase,Cc=O.Bounce,Ac=O.Sine,Tc=O.Expo,kc=O.Circ;var es,ee,Oe,sa,_e,Ec,ns,la,Mc=function(){return typeof window<"u"},Yt={},we=180/Math.PI,De=Math.PI/180,Re=Math.atan2,is=1e8,da=/([A-Z])/g,Pc=/(left|right|width|margin|padding|x)/i,Lc=/[\s,\(]\S/,It={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},ia=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Rc=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Oc=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Dc=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Fc=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},us=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},hs=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},Hc=function(e,t,n){return e.style[t]=n},Wc=function(e,t,n){return e.style.setProperty(t,n)},zc=function(e,t,n){return e._gsap[t]=n},Nc=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},Ic=function(e,t,n,i,r){var o=e._gsap;o.scaleX=o.scaleY=n,o.renderTransform(r,o)},$c=function(e,t,n,i,r){var o=e._gsap;o[t]=n,o.renderTransform(r,o)},Y="transform",_t=Y+"Origin",Gc=function a(e,t){var n=this,i=this.target,r=i.style,o=i._gsap;if(e in Yt&&r){if(this.tfm=this.tfm||{},e!=="transform")e=It[e]||e,~e.indexOf(",")?e.split(",").forEach(function(s){return n.tfm[s]=Ut(i,s)}):this.tfm[e]=o.x?o[e]:Ut(i,e),e===_t&&(this.tfm.zOrigin=o.zOrigin);else return It.transform.split(",").forEach(function(s){return a.call(n,s,t)});if(this.props.indexOf(Y)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(_t,t,"")),e=Y}(r||t)&&this.props.push(e,t,r[e])},ms=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},qc=function(){var e=this.props,t=this.target,n=t.style,i=t._gsap,r,o;for(r=0;r<e.length;r+=3)e[r+1]?e[r+1]===2?t[e[r]](e[r+2]):t[e[r]]=e[r+2]:e[r+2]?n[e[r]]=e[r+2]:n.removeProperty(e[r].substr(0,2)==="--"?e[r]:e[r].replace(da,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),r=la(),(!r||!r.isStart)&&!n[Y]&&(ms(n),i.zOrigin&&n[_t]&&(n[_t]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},fs=function(e,t){var n={target:e,props:[],revert:qc,save:Gc};return e._gsap||dt.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(i){return n.save(i)}),n},ps,ra=function(e,t){var n=ee.createElementNS?ee.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):ee.createElement(e);return n&&n.style?n:ee.createElement(e)},Tt=function a(e,t,n){var i=getComputedStyle(e);return i[t]||i.getPropertyValue(t.replace(da,"-$1").toLowerCase())||i.getPropertyValue(t)||!n&&a(e,Fe(t)||t,1)||""},rs="O,Moz,ms,Ms,Webkit".split(","),Fe=function(e,t,n){var i=t||_e,r=i.style,o=5;if(e in r&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);o--&&!(rs[o]+e in r););return o<0?null:(o===3?"ms":o>=0?rs[o]:"")+e},aa=function(){Mc()&&window.document&&(es=window,ee=es.document,Oe=ee.documentElement,_e=ra("div")||{style:{}},Ec=ra("div"),Y=Fe(Y),_t=Y+"Origin",_e.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",ps=!!Fe("perspective"),la=dt.core.reverting,sa=1)},as=function(e){var t=e.ownerSVGElement,n=ra("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=e.cloneNode(!0),r;i.style.display="block",n.appendChild(i),Oe.appendChild(n);try{r=i.getBBox()}catch{}return n.removeChild(i),Oe.removeChild(n),r},os=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},gs=function(e){var t,n;try{t=e.getBBox()}catch{t=as(e),n=1}return t&&(t.width||t.height)||n||(t=as(e)),t&&!t.width&&!t.x&&!t.y?{x:+os(e,["x","cx","x1"])||0,y:+os(e,["y","cy","y1"])||0,width:0,height:0}:t},ys=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&gs(e))},ie=function(e,t){if(t){var n=e.style,i;t in Yt&&t!==_t&&(t=Y),n.removeProperty?(i=t.substr(0,2),(i==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),n.removeProperty(i==="--"?t:t.replace(da,"-$1").toLowerCase())):n.removeAttribute(t)}},ne=function(e,t,n,i,r,o){var s=new mt(e._pt,t,n,0,1,o?hs:us);return e._pt=s,s.b=i,s.e=r,e._props.push(n),s},ss={deg:1,rad:1,turn:1},Bc={grid:1,flex:1},re=function a(e,t,n,i){var r=parseFloat(n)||0,o=(n+"").trim().substr((r+"").length)||"px",s=_e.style,l=Pc.test(t),d=e.tagName.toLowerCase()==="svg",c=(d?"client":"offset")+(l?"Width":"Height"),h=100,u=i==="px",f=i==="%",p,m,g,y;if(i===o||!r||ss[i]||ss[o])return r;if(o!=="px"&&!u&&(r=a(e,t,n,"px")),y=e.getCTM&&ys(e),(f||o==="%")&&(Yt[t]||~t.indexOf("adius")))return p=y?e.getBBox()[l?"width":"height"]:e[c],Z(f?r/p*h:r/100*p);if(s[l?"width":"height"]=h+(u?o:i),m=i!=="rem"&&~t.indexOf("adius")||i==="em"&&e.appendChild&&!d?e:e.parentNode,y&&(m=(e.ownerSVGElement||{}).parentNode),(!m||m===ee||!m.appendChild)&&(m=ee.body),g=m._gsap,g&&f&&g.width&&l&&g.time===gt.time&&!g.uncache)return Z(r/g.width*h);if(f&&(t==="height"||t==="width")){var w=e.style[t];e.style[t]=h+i,p=e[c],w?e.style[t]=w:ie(e,t)}else(f||o==="%")&&!Bc[Tt(m,"display")]&&(s.position=Tt(e,"position")),m===e&&(s.position="static"),m.appendChild(_e),p=_e[c],m.removeChild(_e),s.position="absolute";return l&&f&&(g=Qt(m),g.time=gt.time,g.width=m[c]),Z(u?p*r/h:p&&r?h/p*r:0)},Ut=function(e,t,n,i){var r;return sa||aa(),t in It&&t!=="transform"&&(t=It[t],~t.indexOf(",")&&(t=t.split(",")[0])),Yt[t]&&t!=="transform"?(r=wn(e,i),r=t!=="transformOrigin"?r[t]:r.svg?r.origin:wi(Tt(e,_t))+" "+r.zOrigin+"px"):(r=e.style[t],(!r||r==="auto"||i||~(r+"").indexOf("calc("))&&(r=yi[t]&&yi[t](e,t,n)||Tt(e,t)||Vr(e,t)||(t==="opacity"?1:0))),n&&!~(r+"").trim().indexOf(" ")?re(e,t,r,n)+n:r},Vc=function(e,t,n,i){if(!n||n==="none"){var r=Fe(t,e,1),o=r&&Tt(e,r,1);o&&o!==n?(t=r,n=o):t==="borderColor"&&(n=Tt(e,"borderTopColor"))}var s=new mt(this._pt,e.style,t,0,1,Jr),l=0,d=0,c,h,u,f,p,m,g,y,w,_,b,v;if(s.b=n,s.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Tt(e,i.substring(4,i.indexOf(")")))),i==="auto"&&(m=e.style[t],e.style[t]=i,i=Tt(e,t)||i,m?e.style[t]=m:ie(e,t)),c=[n,i],Yr(c),n=c[0],i=c[1],u=n.match(me)||[],v=i.match(me)||[],v.length){for(;h=me.exec(i);)g=h[0],w=i.substring(l,h.index),p?p=(p+1)%5:(w.substr(-5)==="rgba("||w.substr(-5)==="hsla(")&&(p=1),g!==(m=u[d++]||"")&&(f=parseFloat(m)||0,b=m.substr((f+"").length),g.charAt(1)==="="&&(g=fe(f,g)+b),y=parseFloat(g),_=g.substr((y+"").length),l=me.lastIndex-_.length,_||(_=_||wt.units[t]||b,l===i.length&&(i+=_,s.e+=_)),b!==_&&(f=re(e,t,m,_)||0),s._pt={_next:s._pt,p:w||d===1?w:",",s:f,c:y-f,m:p&&p<4||t==="zIndex"?Math.round:0});s.c=l<i.length?i.substring(l,i.length):""}else s.r=t==="display"&&i==="none"?hs:us;return Ir.test(i)&&(s.e=0),this._pt=s,s},ls={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Uc=function(e){var t=e.split(" "),n=t[0],i=t[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(e=n,n=i,i=e),t[0]=ls[n]||n,t[1]=ls[i]||i,t.join(" ")},Yc=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,i=n.style,r=t.u,o=n._gsap,s,l,d;if(r==="all"||r===!0)i.cssText="",l=1;else for(r=r.split(","),d=r.length;--d>-1;)s=r[d],Yt[s]&&(l=1,s=s==="transformOrigin"?_t:Y),ie(n,s);l&&(ie(n,Y),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",wn(n,1),o.uncache=1,ms(i)))}},yi={clearProps:function(e,t,n,i,r){if(r.data!=="isFromStart"){var o=e._pt=new mt(e._pt,t,n,0,0,Yc);return o.u=i,o.pr=-10,o.tween=r,e._props.push(n),1}}},yn=[1,0,0,1,0,0],ws={},_s=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},ds=function(e){var t=Tt(e,Y);return _s(t)?yn:t.substr(7).match(Nr).map(Z)},ca=function(e,t){var n=e._gsap||Qt(e),i=e.style,r=ds(e),o,s,l,d;return n.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?yn:r):(r===yn&&!e.offsetParent&&e!==Oe&&!n.svg&&(l=i.display,i.display="block",o=e.parentNode,(!o||!e.offsetParent&&!e.getBoundingClientRect().width)&&(d=1,s=e.nextElementSibling,Oe.appendChild(e)),r=ds(e),l?i.display=l:ie(e,"display"),d&&(s?o.insertBefore(e,s):o?o.appendChild(e):Oe.removeChild(e))),t&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},oa=function(e,t,n,i,r,o){var s=e._gsap,l=r||ca(e,!0),d=s.xOrigin||0,c=s.yOrigin||0,h=s.xOffset||0,u=s.yOffset||0,f=l[0],p=l[1],m=l[2],g=l[3],y=l[4],w=l[5],_=t.split(" "),b=parseFloat(_[0])||0,v=parseFloat(_[1])||0,C,S,A,T;n?l!==yn&&(S=f*g-p*m)&&(A=b*(g/S)+v*(-m/S)+(m*w-g*y)/S,T=b*(-p/S)+v*(f/S)-(f*w-p*y)/S,b=A,v=T):(C=gs(e),b=C.x+(~_[0].indexOf("%")?b/100*C.width:b),v=C.y+(~(_[1]||_[0]).indexOf("%")?v/100*C.height:v)),i||i!==!1&&s.smooth?(y=b-d,w=v-c,s.xOffset=h+(y*f+w*m)-y,s.yOffset=u+(y*p+w*g)-w):s.xOffset=s.yOffset=0,s.xOrigin=b,s.yOrigin=v,s.smooth=!!i,s.origin=t,s.originIsAbsolute=!!n,e.style[_t]="0px 0px",o&&(ne(o,s,"xOrigin",d,b),ne(o,s,"yOrigin",c,v),ne(o,s,"xOffset",h,s.xOffset),ne(o,s,"yOffset",u,s.yOffset)),e.setAttribute("data-svg-origin",b+" "+v)},wn=function(e,t){var n=e._gsap||new Kr(e);if("x"in n&&!t&&!n.uncache)return n;var i=e.style,r=n.scaleX<0,o="px",s="deg",l=getComputedStyle(e),d=Tt(e,_t)||"0",c,h,u,f,p,m,g,y,w,_,b,v,C,S,A,T,x,E,L,D,z,I,G,F,q,xt,at,Et,R,j,N,ot;return c=h=u=m=g=y=w=_=b=0,f=p=1,n.svg=!!(e.getCTM&&ys(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Y]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Y]!=="none"?l[Y]:"")),i.scale=i.rotate=i.translate="none"),S=ca(e,n.svg),n.svg&&(n.uncache?(q=e.getBBox(),d=n.xOrigin-q.x+"px "+(n.yOrigin-q.y)+"px",F=""):F=!t&&e.getAttribute("data-svg-origin"),oa(e,F||d,!!F||n.originIsAbsolute,n.smooth!==!1,S)),v=n.xOrigin||0,C=n.yOrigin||0,S!==yn&&(E=S[0],L=S[1],D=S[2],z=S[3],c=I=S[4],h=G=S[5],S.length===6?(f=Math.sqrt(E*E+L*L),p=Math.sqrt(z*z+D*D),m=E||L?Re(L,E)*we:0,w=D||z?Re(D,z)*we+m:0,w&&(p*=Math.abs(Math.cos(w*De))),n.svg&&(c-=v-(v*E+C*D),h-=C-(v*L+C*z))):(ot=S[6],j=S[7],at=S[8],Et=S[9],R=S[10],N=S[11],c=S[12],h=S[13],u=S[14],A=Re(ot,R),g=A*we,A&&(T=Math.cos(-A),x=Math.sin(-A),F=I*T+at*x,q=G*T+Et*x,xt=ot*T+R*x,at=I*-x+at*T,Et=G*-x+Et*T,R=ot*-x+R*T,N=j*-x+N*T,I=F,G=q,ot=xt),A=Re(-D,R),y=A*we,A&&(T=Math.cos(-A),x=Math.sin(-A),F=E*T-at*x,q=L*T-Et*x,xt=D*T-R*x,N=z*x+N*T,E=F,L=q,D=xt),A=Re(L,E),m=A*we,A&&(T=Math.cos(A),x=Math.sin(A),F=E*T+L*x,q=I*T+G*x,L=L*T-E*x,G=G*T-I*x,E=F,I=q),g&&Math.abs(g)+Math.abs(m)>359.9&&(g=m=0,y=180-y),f=Z(Math.sqrt(E*E+L*L+D*D)),p=Z(Math.sqrt(G*G+ot*ot)),A=Re(I,G),w=Math.abs(A)>2e-4?A*we:0,b=N?1/(N<0?-N:N):0),n.svg&&(F=e.getAttribute("transform"),n.forceCSS=e.setAttribute("transform","")||!_s(Tt(e,Y)),F&&e.setAttribute("transform",F))),Math.abs(w)>90&&Math.abs(w)<270&&(r?(f*=-1,w+=m<=0?180:-180,m+=m<=0?180:-180):(p*=-1,w+=w<=0?180:-180)),t=t||n.uncache,n.x=c-((n.xPercent=c&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-c)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+o,n.y=h-((n.yPercent=h&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-h)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+o,n.z=u+o,n.scaleX=Z(f),n.scaleY=Z(p),n.rotation=Z(m)+s,n.rotationX=Z(g)+s,n.rotationY=Z(y)+s,n.skewX=w+s,n.skewY=_+s,n.transformPerspective=b+o,(n.zOrigin=parseFloat(d.split(" ")[2])||!t&&n.zOrigin||0)&&(i[_t]=wi(d)),n.xOffset=n.yOffset=0,n.force3D=wt.force3D,n.renderTransform=n.svg?jc:ps?vs:Kc,n.uncache=0,n},wi=function(e){return(e=e.split(" "))[0]+" "+e[1]},na=function(e,t,n){var i=rt(t);return Z(parseFloat(t)+parseFloat(re(e,"x",n+"px",i)))+i},Kc=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,vs(e,t)},ge="0deg",gn="0px",ye=") ",vs=function(e,t){var n=t||this,i=n.xPercent,r=n.yPercent,o=n.x,s=n.y,l=n.z,d=n.rotation,c=n.rotationY,h=n.rotationX,u=n.skewX,f=n.skewY,p=n.scaleX,m=n.scaleY,g=n.transformPerspective,y=n.force3D,w=n.target,_=n.zOrigin,b="",v=y==="auto"&&e&&e!==1||y===!0;if(_&&(h!==ge||c!==ge)){var C=parseFloat(c)*De,S=Math.sin(C),A=Math.cos(C),T;C=parseFloat(h)*De,T=Math.cos(C),o=na(w,o,S*T*-_),s=na(w,s,-Math.sin(C)*-_),l=na(w,l,A*T*-_+_)}g!==gn&&(b+="perspective("+g+ye),(i||r)&&(b+="translate("+i+"%, "+r+"%) "),(v||o!==gn||s!==gn||l!==gn)&&(b+=l!==gn||v?"translate3d("+o+", "+s+", "+l+") ":"translate("+o+", "+s+ye),d!==ge&&(b+="rotate("+d+ye),c!==ge&&(b+="rotateY("+c+ye),h!==ge&&(b+="rotateX("+h+ye),(u!==ge||f!==ge)&&(b+="skew("+u+", "+f+ye),(p!==1||m!==1)&&(b+="scale("+p+", "+m+ye),w.style[Y]=b||"translate(0, 0)"},jc=function(e,t){var n=t||this,i=n.xPercent,r=n.yPercent,o=n.x,s=n.y,l=n.rotation,d=n.skewX,c=n.skewY,h=n.scaleX,u=n.scaleY,f=n.target,p=n.xOrigin,m=n.yOrigin,g=n.xOffset,y=n.yOffset,w=n.forceCSS,_=parseFloat(o),b=parseFloat(s),v,C,S,A,T;l=parseFloat(l),d=parseFloat(d),c=parseFloat(c),c&&(c=parseFloat(c),d+=c,l+=c),l||d?(l*=De,d*=De,v=Math.cos(l)*h,C=Math.sin(l)*h,S=Math.sin(l-d)*-u,A=Math.cos(l-d)*u,d&&(c*=De,T=Math.tan(d-c),T=Math.sqrt(1+T*T),S*=T,A*=T,c&&(T=Math.tan(c),T=Math.sqrt(1+T*T),v*=T,C*=T)),v=Z(v),C=Z(C),S=Z(S),A=Z(A)):(v=h,A=u,C=S=0),(_&&!~(o+"").indexOf("px")||b&&!~(s+"").indexOf("px"))&&(_=re(f,"x",o,"px"),b=re(f,"y",s,"px")),(p||m||g||y)&&(_=Z(_+p-(p*v+m*S)+g),b=Z(b+m-(p*C+m*A)+y)),(i||r)&&(T=f.getBBox(),_=Z(_+i/100*T.width),b=Z(b+r/100*T.height)),T="matrix("+v+","+C+","+S+","+A+","+_+","+b+")",f.setAttribute("transform",T),w&&(f.style[Y]=T)},Xc=function(e,t,n,i,r){var o=360,s=nt(r),l=parseFloat(r)*(s&&~r.indexOf("rad")?we:1),d=l-i,c=i+d+"deg",h,u;return s&&(h=r.split("_")[1],h==="short"&&(d%=o,d!==d%(o/2)&&(d+=d<0?o:-o)),h==="cw"&&d<0?d=(d+o*is)%o-~~(d/o)*o:h==="ccw"&&d>0&&(d=(d-o*is)%o-~~(d/o)*o)),e._pt=u=new mt(e._pt,t,n,i,d,Rc),u.e=c,u.u="deg",e._props.push(n),u},cs=function(e,t){for(var n in t)e[n]=t[n];return e},Zc=function(e,t,n){var i=cs({},n._gsap),r="perspective,force3D,transformOrigin,svgOrigin",o=n.style,s,l,d,c,h,u,f,p;i.svg?(d=n.getAttribute("transform"),n.setAttribute("transform",""),o[Y]=t,s=wn(n,1),ie(n,Y),n.setAttribute("transform",d)):(d=getComputedStyle(n)[Y],o[Y]=t,s=wn(n,1),o[Y]=d);for(l in Yt)d=i[l],c=s[l],d!==c&&r.indexOf(l)<0&&(f=rt(d),p=rt(c),h=f!==p?re(n,l,d,p):parseFloat(d),u=parseFloat(c),e._pt=new mt(e._pt,s,l,h,u-h,ia),e._pt.u=p||0,e._props.push(l));cs(s,i)};ht("padding,margin,Width,Radius",function(a,e){var t="Top",n="Right",i="Bottom",r="Left",o=(e<3?[t,n,i,r]:[t+r,t+n,i+n,i+r]).map(function(s){return e<2?a+s:"border"+s+a});yi[e>1?"border"+a:a]=function(s,l,d,c,h){var u,f;if(arguments.length<4)return u=o.map(function(p){return Ut(s,p,d)}),f=u.join(" "),f.split(u[0]).length===5?u[0]:f;u=(c+"").split(" "),f={},o.forEach(function(p,m){return f[p]=u[m]=u[m]||u[(m-1)/2|0]}),s.init(l,f,h)}});var ua={name:"css",register:aa,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,i,r){var o=this._props,s=e.style,l=n.vars.startAt,d,c,h,u,f,p,m,g,y,w,_,b,v,C,S,A,T;sa||aa(),this.styles=this.styles||fs(e),A=this.styles.props,this.tween=n;for(m in t)if(m!=="autoRound"&&(c=t[m],!(pt[m]&&Xr(m,t,n,i,e,r)))){if(f=typeof c,p=yi[m],f==="function"&&(c=c.call(n,i,e,r),f=typeof c),f==="string"&&~c.indexOf("random(")&&(c=Le(c)),p)p(this,e,m,c,n)&&(S=1);else if(m.substr(0,2)==="--")d=(getComputedStyle(e).getPropertyValue(m)+"").trim(),c+="",Bt.lastIndex=0,Bt.test(d)||(g=rt(d),y=rt(c),y?g!==y&&(d=re(e,m,d,y)+y):g&&(c+=g)),this.add(s,"setProperty",d,c,i,r,0,0,m),o.push(m),A.push(m,0,s[m]);else if(f!=="undefined"){if(l&&m in l?(d=typeof l[m]=="function"?l[m].call(n,i,e,r):l[m],nt(d)&&~d.indexOf("random(")&&(d=Le(d)),rt(d+"")||d==="auto"||(d+=wt.units[m]||rt(Ut(e,m))||""),(d+"").charAt(1)==="="&&(d=Ut(e,m))):d=Ut(e,m),u=parseFloat(d),w=f==="string"&&c.charAt(1)==="="&&c.substr(0,2),w&&(c=c.substr(2)),h=parseFloat(c),m in It&&(m==="autoAlpha"&&(u===1&&Ut(e,"visibility")==="hidden"&&h&&(u=0),A.push("visibility",0,s.visibility),ne(this,s,"visibility",u?"inherit":"hidden",h?"inherit":"hidden",!h)),m!=="scale"&&m!=="transform"&&(m=It[m],~m.indexOf(",")&&(m=m.split(",")[0]))),_=m in Yt,_){if(this.styles.save(m),T=c,f==="string"&&c.substring(0,6)==="var(--"){if(c=Tt(e,c.substring(4,c.indexOf(")"))),c.substring(0,5)==="calc("){var x=e.style.perspective;e.style.perspective=c,c=Tt(e,"perspective"),x?e.style.perspective=x:ie(e,"perspective")}h=parseFloat(c)}if(b||(v=e._gsap,v.renderTransform&&!t.parseTransform||wn(e,t.parseTransform),C=t.smoothOrigin!==!1&&v.smooth,b=this._pt=new mt(this._pt,s,Y,0,1,v.renderTransform,v,0,-1),b.dep=1),m==="scale")this._pt=new mt(this._pt,v,"scaleY",v.scaleY,(w?fe(v.scaleY,w+h):h)-v.scaleY||0,ia),this._pt.u=0,o.push("scaleY",m),m+="X";else if(m==="transformOrigin"){A.push(_t,0,s[_t]),c=Uc(c),v.svg?oa(e,c,0,C,0,this):(y=parseFloat(c.split(" ")[2])||0,y!==v.zOrigin&&ne(this,v,"zOrigin",v.zOrigin,y),ne(this,s,m,wi(d),wi(c)));continue}else if(m==="svgOrigin"){oa(e,c,1,C,0,this);continue}else if(m in ws){Xc(this,v,m,u,w?fe(u,w+c):c);continue}else if(m==="smoothOrigin"){ne(this,v,"smooth",v.smooth,c);continue}else if(m==="force3D"){v[m]=c;continue}else if(m==="transform"){Zc(this,c,e);continue}}else m in s||(m=Fe(m)||m);if(_||(h||h===0)&&(u||u===0)&&!Lc.test(c)&&m in s)g=(d+"").substr((u+"").length),h||(h=0),y=rt(c)||(m in wt.units?wt.units[m]:g),g!==y&&(u=re(e,m,d,y)),this._pt=new mt(this._pt,_?v:s,m,u,(w?fe(u,w+h):h)-u,!_&&(y==="px"||m==="zIndex")&&t.autoRound!==!1?Fc:ia),this._pt.u=y||0,_&&T!==c?(this._pt.b=d,this._pt.e=T,this._pt.r=Dc):g!==y&&y!=="%"&&(this._pt.b=d,this._pt.r=Oc);else if(m in s)Vc.call(this,e,m,d,w?w+c:c);else if(m in e)this.add(e,m,d||e[m],w?w+c:c,i,r);else if(m!=="parseTransform"){hi(m,c);continue}_||(m in s?A.push(m,0,s[m]):typeof e[m]=="function"?A.push(m,2,e[m]()):A.push(m,1,d||e[m])),o.push(m)}}S&&ea(this)},render:function(e,t){if(t.tween._time||!la())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:Ut,aliases:It,getSetter:function(e,t,n){var i=It[t];return i&&i.indexOf(",")<0&&(t=i),t in Yt&&t!==_t&&(e._gsap.x||Ut(e,"x"))?n&&ns===n?t==="scale"?Nc:zc:(ns=n||{})&&(t==="scale"?Ic:$c):e.style&&!ui(e.style[t])?Hc:~t.indexOf("-")?Wc:gi(e,t)},core:{_removeProperty:ie,_getMatrix:ca}};dt.utils.checkPrefix=Fe;dt.core.getStyleSaver=fs;(function(a,e,t,n){var i=ht(a+","+e+","+t,function(r){Yt[r]=1});ht(e,function(r){wt.units[r]="deg",ws[r]=1}),It[i[13]]=a+","+e,ht(n,function(r){var o=r.split(":");It[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");ht("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(a){wt.units[a]="px"});dt.registerPlugin(ua);var ha=dt.registerPlugin(ua)||dt,rm=ha.core.Tween;var ma={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},ct={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},bs={windSpeed:[.1,15],rainCount:[.1,10],leafCount:[.1,10],snowCount:[.1,10],cloudBaseSize:[.3,2.5],cloudCount:[1,20],splashBounce:[40,120]},xs={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},Ss="1.4.0",Cs={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function ve(){return Date.now()+(typeof window>"u"?0:window.AnimatedWeatherCardDev?.offset??0)}function kt(){return new Date(ve())}function fa(a,e=-1/0,t=1/0){return typeof a=="number"&&!isNaN(a)&&a>=e&&a<=t}function vn(a){return typeof a!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(a)||/^rgba?\(\s*[\d.,%\s/]+\)$/.test(a)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(a.toLowerCase())}function M(a){return a==null?"":String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ot(a,e){return Object.prototype.hasOwnProperty.call(a,e)?a[e]:void 0}function ft(a,e,t=0){if(!isFinite(a))return"--";Math.abs(a)<.5/10**t&&(a=0);let n=e?.locale?.language||e?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(n,{minimumFractionDigits:t,maximumFractionDigits:t}).format(a)}catch{return a.toFixed(t)}}function bn(a,e,t){if(a?.localize)try{let n=a.localize(e);if(n&&n!==e)return n}catch{}return t}function Dt(a,e){if(!isFinite(a))return 0;switch((e||"km/h").toLowerCase()){case"m/s":return a*3.6;case"mph":return a*1.609344;case"ft/s":return a*1.09728;case"kn":case"kt":case"knots":return a*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,a),1.5)*3.6;default:return a}}function k(a,e,...t){a&&console.log(`[AWC Dev] ${e}`,...t)}function Qc(a){let e=a?.engine_settings;return!e||typeof e!="object"?!1:Object.keys(ct).some(t=>{let n=e[t],[i,r]=bs[t];return fa(n,i,r)&&Math.abs(n-ct[t])>1e-9})}function _i(a){let e=a?.engine_mode;return e==="auto"||e==="manual"?e:Qc(a)?"manual":"auto"}function K(a,e){let t=_i(a)==="manual"?a.engine_settings||{}:{},n=(o,s,l,d)=>fa(o,l,d)?o:s,i=n(t.windSpeed,ct.windSpeed,.1,15),r=i;return fa(e,0,200)&&(r=Math.max(.1,Math.min(15,e/10*i))),{windSpeed:r,rainCount:n(t.rainCount,ct.rainCount,.1,10),leafCount:n(t.leafCount,ct.leafCount,.1,10),snowCount:n(t.snowCount,ct.snowCount,.1,10),cloudBaseSize:n(t.cloudBaseSize,ct.cloudBaseSize,.3,2.5),cloudCount:n(t.cloudCount,ct.cloudCount,1,20),splashBounce:n(t.splashBounce,ct.splashBounce,40,120)}}function pa(a){a.forEach(e=>{e!=null&&clearTimeout(e)}),a.length=0}function As(a){let e=new Set;return a.querySelectorAll("*").forEach(t=>{window.AnimatedWeatherCardGsap.getTweensOf(t).forEach(n=>{let i=n;for(;i.parent?.parent;)i=i.parent;e.add(i)})}),e}function vi(a){window.AnimatedWeatherCardGsap&&As(a).forEach(e=>e.pause())}function bi(a){window.AnimatedWeatherCardGsap&&As(a).forEach(e=>e.resume())}function ga(a){window.AnimatedWeatherCardGsap&&a.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)})}function xn(a,e,t,n,i={}){if(typeof a!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";let r=a.toLowerCase();if(r.includes("sleet")&&(r.includes("lightning")||r.includes("thunder")||r.includes("storm")))return"sleety-stormy";if((r.includes("snow")||r.includes("sleet"))&&(r.includes("lightning")||r.includes("thunder")||r.includes("storm")))return"snowy-stormy";if(r.includes("lightning")||r.includes("thunder")||r.includes("storm"))return"stormy";if(r.includes("fog")||r.includes("mist"))return"foggy";if(r.includes("heavy")&&r.includes("rain"))return"pouring";if(r.includes("pouring")||r.includes("downpour"))return"pouring";if((r.includes("snow")||r.includes("sleet"))&&(r.includes("rain")||r.includes("drizzle")))return"snowy-rainy";if(r.includes("light")&&(r.includes("rain")||r.includes("drizzle")))return"light-rain";if(r.includes("rain")||r.includes("drizzle"))return"rainy";if(r.includes("sleet")||r.includes("hail"))return"sleety";if(r.includes("snow"))return"snowy";if(r.includes("wind"))return"windy";if(r.includes("partly")&&r.includes("cloud"))return"partly-cloudy";if(r.includes("cloud")||r.includes("overcast"))return"cloudy";if(r.includes("clear")||r.includes("sunny")){if(!i.clock){if(r.includes("night"))return"clear-night";if(r.includes("sunny"))return"sunny";if(i.night!==void 0)return i.night?"clear-night":"sunny"}let o=kt(),s;if(n)try{let h=new Intl.DateTimeFormat("en-US",{timeZone:n,hour:"numeric",hour12:!1}).formatToParts(o);s=parseInt(h.find(u=>u.type==="hour")?.value||"0",10)}catch{s=o.getHours()}else s=o.getHours();let l=e??6,d=t??20;return(s<l||s>=d)&&r.includes("clear")?"clear-night":"sunny"}return"sunny"}function Sn(a,e,t){if(typeof a!="string"||!a.trim())return console.warn("Invalid animation type provided"),t||_n("rain");if(!e||!e.isEnabled())return t||_n(a);let n=Cs[a];if(!n)return console.warn(`No color scheme found for animation type: ${a}`),t||_n(a);try{let i=e.getCurrentState(),r=e.getTimeAwareColor(n);return vn(r)?r:(console.warn(`Invalid color returned from time manager: ${r}`),t||_n(a))}catch(i){return console.error("Error getting time-aware color:",i),t||_n(a)}}function _n(a){let t={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[a];return t||(console.warn(`Unknown animation type: ${a}, using white as fallback`),"#FFFFFF")}var xi=class xi{constructor(e,t,n){this.animationHandles=[];this.timeouts=[];this.particles=[];this.amounts=null;this.element=e,this.config=t,this.cardConfig=n,this.amounts=t.amounts??null,this.state="created",queueMicrotask(()=>k(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){k(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),k(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(e){throw console.error(`Failed to start ${this.animationType} animation:`,e),this.setState("stopped"),e}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),k(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(e){throw console.error(`Failed to stop ${this.animationType} animation:`,e),e}}async pause(){if(this.state==="active")try{k(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(e){throw console.error(`Failed to pause ${this.animationType} animation:`,e),e}}async resume(){if(this.state==="paused")try{k(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(e){throw console.error(`Failed to resume ${this.animationType} animation:`,e),this.setState("paused"),e}}setWindSpeed(e){this.realWindSpeed=e,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}setAmounts(e,t=!1){let n=this.amounts;this.amounts=e,(this.state==="active"||this.state==="paused")&&this.onAmountsChange(n,t)}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),k(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}onAmountsChange(e,t){}setState(e){let t=this.state;this.state=e,k(this.config.devMode,`${this.animationType} state: ${t} \u2192 ${e}`)}ensureLayerVisibility(e){if(this.containerSelector){let n=this.element.querySelector(this.containerSelector);n&&(n.style.display=e?"block":"none",k(this.config.devMode,`Set ${this.animationType} container visibility: ${e}`))}let t=this.element.querySelector(this.layerSelector);t&&!xi.SHARED_LAYERS.includes(this.layerSelector)&&(t.style.opacity=e?"1":"0",k(this.config.devMode,`Set ${this.animationType} layer opacity: ${e?1:0}`))}cleanup(){this.animationHandles.forEach(e=>{e&&clearInterval(e)}),this.animationHandles=[],this.timeouts.forEach(e=>{if(e)if(typeof e=="function"){let t=e();t&&clearTimeout(t)}else clearTimeout(e)}),this.timeouts=[],window.AnimatedWeatherCardGsap&&this.particles.forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)}),this.particles.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.particles=[],k(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(e){this.animationHandles.push(e)}addTimeout(e){this.timeouts.push(e)}addParticle(e){this.particles.push(e)}removeParticle(e){let t=this.particles.indexOf(e);t>-1&&this.particles.splice(t,1)}};xi.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var tt=xi;var ae=class{constructor(e,t,n,i){this.layer=e;this.create=t;this.cycle=n;this.onRetire=i;this.items=[];this.running=!1;this.paused=!1}start(e){this.running=!0;let t=[];for(let n=0;n<e;n++){let i=this.create(n);this.layer.appendChild(i);let r={el:i};this.items.push(r),t.push(i),this.run(r,!0)}return t}run(e,t){if(this.running){if(e.retiring){this.retire(e);return}e.el.style.visibility="",e.anim=this.cycle(e.el,()=>this.run(e,!1),t),this.paused&&e.anim.pause()}}resize(e,t=1,n=!1){if(!this.running)return[];let i=Math.max(0,Math.round(e)),r=this.items.filter(d=>!d.retiring);if(i<r.length)return r.slice(i).forEach(d=>{d.retiring=!0,n&&(d.el.style.visibility="hidden")}),[];let o=i-r.length;for(let d of this.items){if(o<=0)break;d.retiring&&(d.retiring=!1,d.anim&&(d.el.style.visibility=""),o--)}let s=window.AnimatedWeatherCardGsap,l=[];for(let d=0;d<o;d++){let c=this.create(this.items.length);c.style.visibility="hidden",this.layer.appendChild(c);let h={el:c};this.items.push(h),l.push(c);let u=n?0:t*Math.random();n?this.run(h,!0):s?.delayedCall&&u>0?(h.anim=s.delayedCall(u,()=>this.run(h,!1)),this.paused&&h.anim.pause()):this.run(h,!1)}return l}get live(){return this.items.filter(e=>!e.retiring).length}retire(e){e.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(e.el),e.el.remove(),this.items=this.items.filter(t=>t!==e),this.onRetire?.(e.el)}pause(){this.paused=!0,this.items.forEach(e=>e.anim?.pause())}resume(){this.paused=!1,this.items.forEach(e=>e.anim?.resume())}stop(){this.running=!1,this.items.forEach(e=>{e.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(e.el),e.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(e=>e.el)}};function He(a,e){return e&&a.progress(Math.random()),a}var Jc=420*230;function oe(a,e){return Math.min(3,Math.max(.6,a*e/Jc))||1}function P(a,e){return a+Math.random()*(e-a)}var Ts={light:10,rain:18,storm:24,pouring:32},ks={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},ya={light:16,rain:24,storm:34,pouring:42},Es=.3,Cn=16,We=8,Si=.8,Ms=[10,30],wa=48;function Ps(a,e,t,n){let i=0,r=0,o=0;for(let s=1;s<=16;s++){let l=s/16,d=2*(1-l)*l*a+l*l*t,c=2*(1-l)*l*e+l*l*n;i+=Math.hypot(d-r,c-o),r=d,o=c}return i}function _a(a,e,t,n){return Math.max(4,Math.round(Ts[a]*e*oe(t,n)))}function Ci(a){return P(1,a==="pouring"?3:2.4)}function Ai(a){return .55+.45*Math.min(1,a/2.4)}function Ti(a,e,t,n,i){let r=ya[a],o=P(...ks[a]),s=P(6,Math.max(7,e-6)),l=i&&Math.random()<Es,d=-r,c=l?t-r:n?t+P(60,120):t,h=Math.max(.25,(c-d)/o),u=l?h:n?t/o:h,f=l?h+r/o:h;return{length:r,x:s,splash:l,startY:d,endY:c,fallSec:h,fadeStart:u,endSec:f}}function ki(a,e){let t=P(.22,.28),n=P(4,10)*e,i=a*P(6,12)*e;return{duration:t,rise:n,spread:i}}function Ei(a){let e=P(...Ms)*a,t=(Math.random()<.5?-1:1)*P(10,wa/2)*a,n=P(6,18),i=Ps(t,-2*e,2*t,n),r=Math.min(i*.45,6+e*.3),o=P(.42,.56);return{rise:e,reach:t,fall:n,length:i,streak:r,duration:o}}var ut=12,tu=15e5,Ls=8,eu=200;function Ne(a,e,t,n,i){let r=document.createElement("canvas");r.className=`${e}-webgl`,a.appendChild(r);let o;try{return o=t(r,()=>{console.warn(`Animated Weather Card: WebGL ${e} context lost; using standard ${e}.`),o?.stop(),i()}),n(o),o}catch(s){console.warn(`Animated Weather Card: WebGL ${e} could not start; using standard ${e}.`,s),o?.stop(),r.remove();return}}function Rs(a,e,t){let n=a.createShader(e);if(!n)throw new Error("Could not allocate a precipitation shader");if(a.shaderSource(n,t),a.compileShader(n),a.getShaderParameter(n,a.COMPILE_STATUS))return n;let i=a.getShaderInfoLog(n);throw a.deleteShader(n),new Error(`Could not compile a precipitation shader: ${i}`)}function nu(a,e,t){let n=a.createProgram();if(!n)throw new Error("Could not allocate the precipitation program");let i=[];try{i.push(Rs(a,a.VERTEX_SHADER,e)),i.push(Rs(a,a.FRAGMENT_SHADER,t));for(let r of i)a.attachShader(n,r);if(a.linkProgram(n),a.getProgramParameter(n,a.LINK_STATUS))return n;throw new Error(`Could not link the precipitation shaders: ${a.getProgramInfoLog(n)}`)}catch(r){throw a.deleteProgram(n),r}finally{for(let r of i)a.deleteShader(r)}}var ze=class{constructor(e,t,n,i,r){this.canvas=e;this.card=t;this.surface=n;this.data=new Float32Array(0);this.dirty=!1;this.time=0;this.width=-1;this.height=-1;this.drawnCount=0;this.frameId=0;this.lastColor="";this.nextColorRead=0;this.resize=()=>{let{gl:e,canvas:t,card:n,surface:i}=this,r=n.offsetWidth,o=n.offsetHeight;if(r===this.width&&o===this.height)return;this.width=r,this.height=o;let s=i.spill?Math.min(eu,Math.ceil(i.sideSpill(o))+Ls):0,l=Math.max(1,r+s*2),d=Math.max(1,o+(i.spill?120+Ls:0)),c=Math.min(window.devicePixelRatio||1,2,Math.sqrt(tu/(l*d)),this.maxBufferSize/Math.max(l,d));t.style.left=`${-s}px`,t.style.width=`${l}px`,t.style.height=`${d}px`,t.width=Math.max(1,Math.round(l*c)),t.height=Math.max(1,Math.round(d*c)),e.viewport(0,0,t.width,t.height),e.uniform4f(this.frameUniform,l,d,s,0),this.frameId||this.draw(this.drawnCount)};this.tick=e=>{this.lastFrame!==void 0&&(this.time+=Math.min(.1,(e-this.lastFrame)/1e3)),this.lastFrame=e,this.drawnCount=this.advance(),this.draw(this.drawnCount),this.frameId=window.requestAnimationFrame(this.tick)};this.contextLost=()=>this.surface.lost();let o=document.createElement("canvas");o.width=o.height=1;let s=o.getContext("2d",{willReadFrequently:!0});if(!s||typeof ResizeObserver!="function")throw new Error("Canvas color or size tracking unavailable");this.colorReader=s;let l=e.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0});if(!l)throw new Error("Hardware WebGL 2 unavailable");this.gl=l;let d,c=null,h=null,u;try{if(this.program=d=nu(l,i,r),c=l.createBuffer(),h=l.createBuffer(),!c||!h)throw new Error("Could not allocate the precipitation buffers");this.buffer=c,this.quad=h,this.maxBufferSize=l.getParameter(l.MAX_TEXTURE_SIZE),this.timeUniform=l.getUniformLocation(d,"time"),this.frameUniform=l.getUniformLocation(d,"frame"),this.tintUniform=l.getUniformLocation(d,"tint"),l.useProgram(d),l.bindBuffer(l.ARRAY_BUFFER,h),l.bufferData(l.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),l.STATIC_DRAW),l.enableVertexAttribArray(0),l.vertexAttribPointer(0,2,l.FLOAT,!1,0,0),l.bindBuffer(l.ARRAY_BUFFER,c);for(let f=1;f<=3;f++)l.enableVertexAttribArray(f),l.vertexAttribPointer(f,4,l.FLOAT,!1,ut*4,(f-1)*16),l.vertexAttribDivisor(f,1);l.enable(l.BLEND),l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),this.resize(),this.observer=u=new ResizeObserver(this.resize),u.observe(t),e.addEventListener("webglcontextlost",this.contextLost)}catch(f){throw u?.disconnect(),l.deleteBuffer(h),l.deleteBuffer(c),d&&l.deleteProgram(d),this.releaseContext(),f}}reserve(e){if(e*ut<=this.data.length)return;let t=new Float32Array(Math.max(this.data.length*2,e*ut));t.set(this.data),this.data=t,this.gl.bufferData(this.gl.ARRAY_BUFFER,t.byteLength,this.gl.DYNAMIC_DRAW),this.dirty=!0}readTint(){let e=getComputedStyle(this.canvas).color||"#fff";if(e===this.lastColor)return;this.lastColor=e;let t=this.colorReader;t.clearRect(0,0,1,1),t.fillStyle=e,t.fillRect(0,0,1,1);let[n,i,r,o]=t.getImageData(0,0,1,1).data;this.gl.uniform4f(this.tintUniform,n/255,i/255,r/255,o/255)}draw(e){let{gl:t}=this;this.time>=this.nextColorRead&&(this.readTint(),this.nextColorRead=this.time+1),t.clear(t.COLOR_BUFFER_BIT),e&&(this.dirty&&(t.bufferSubData(t.ARRAY_BUFFER,0,this.data,0,e*ut),this.dirty=!1),t.uniform1f(this.timeUniform,this.time),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,e))}paint(e,t){if(this.drawnCount=e,this.frameId||this.draw(e),t&&this.gl.getError()!==this.gl.NO_ERROR)throw new Error("WebGL could not draw the particle field")}pause(){this.frameId&&window.cancelAnimationFrame(this.frameId),this.frameId=0,this.lastFrame=void 0}resume(){this.frameId||(this.frameId=window.requestAnimationFrame(this.tick))}stop(){this.pause(),this.observer.disconnect(),this.canvas.removeEventListener("webglcontextlost",this.contextLost),this.gl.deleteBuffer(this.quad),this.gl.deleteBuffer(this.buffer),this.gl.deleteProgram(this.program),this.releaseContext(),this.canvas.remove()}releaseContext(){this.gl.isContextLost()||this.gl.getExtension("WEBGL_lose_context")?.loseContext()}};var iu=`#version 300 es
layout(location=0) in vec2 corner;
layout(location=1) in vec4 path;
layout(location=2) in vec4 timing;
layout(location=3) in vec4 look;
uniform vec4 frame;
uniform float time;
out vec2 point;
out float opacity;
out float halfLine;
out float radius;
flat out int effect;

float ramp(float t, float edge) { return clamp((t - edge) / (1.0 - edge), 0.0, 1.0); }
float squared(float x) { return x * x; }
vec2 arc(float t) { return vec2(2.0 * path.z * t, -4.0 * path.w * (1.0 - t) * t + look.x * t * t); }

void main() {
    float age = time - timing.x;
    effect = int(look.w);
    opacity = look.y;
    point = corner;
    radius = 0.0;
    halfLine = 0.0;
    if (age < 0.0 || age >= timing.z) {
        gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
        return;
    }
    vec2 pos;
    if (effect == 0) {
        // path: origin, width, length. look.x is the end of the fall.
        float head = mix(path.y, look.x, min(1.0, age / timing.y)) + path.w;
        float shrink = clamp((age - timing.y) / max(0.001, timing.z - timing.y), 0.0, 1.0);
        float length = path.w * (1.0 - shrink);
        float fade = clamp((age - timing.w) / max(0.001, timing.z - timing.w), 0.0, 1.0);
        opacity *= 1.0 - fade * fade;
        point = (corner + 1.0) * 0.5;
        pos = vec2(path.x, head - length) + point * vec2(path.z, length);
    } else if (effect == 1) {
        // A round splash droplet travels out and back to the lip.
        float t = age / timing.z;
        float up = 1.0 - pow(max(0.0, 1.0 - t / 0.45), 3.0);
        float down = pow(ramp(t, 0.45), 3.0);
        pos = path.xy + vec2(path.z * (1.0 - squared(1.0 - t)), -path.w * (up - down)) + corner;
        opacity *= 1.0 - squared(ramp(t, 0.6));
    } else {
        // The SVG's travelling dash becomes a short, rounded chord of the same arc.
        float t = age / timing.z;
        float travel = 1.0 - pow(1.0 - t, 3.0);
        float end = travel * (1.0 + look.z);
        vec2 a = arc(clamp(end - look.z, 0.0, 1.0));
        vec2 b = arc(min(end, 1.0));
        vec2 chord = b - a;
        float span = length(chord);
        vec2 direction = span > 0.001 ? chord / span : vec2(1.0, 0.0);
        radius = mix(0.8, 0.3, travel);
        halfLine = span * 0.5;
        point = corner * vec2(halfLine + radius + 0.45, radius + 0.45);
        pos = path.xy + (a + b) * 0.5 + direction * point.x + vec2(-direction.y, direction.x) * point.y;
        opacity *= 1.0 - squared(ramp(t, 0.65));
    }
    gl_Position = vec4((pos + frame.zw) / frame.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`,ru=`#version 300 es
precision mediump float;
in vec2 point;
in float opacity;
in float halfLine;
in float radius;
flat in int effect;
uniform vec4 tint;
out vec4 color;
void main() {
    float shape = point.y;
    if (effect == 1) shape = 1.0 - smoothstep(0.55, 1.0, length(point));
    if (effect == 2) {
        float dist = length(vec2(max(abs(point.x) - halfLine, 0.0), point.y));
        shape = 1.0 - smoothstep(max(radius - 0.25, 0.0), radius + 0.45, dist);
    }
    float alpha = shape * opacity * tint.a;
    color = vec4(tint.rgb * alpha, alpha);
}`,au=We+Cn,Mi=class extends ze{constructor(t,n,i){super(t,n,{spill:i.spill,sideSpill:()=>i.splash?wa*i.bounce:0,lost:i.lost},iu,ru);this.options=i;this.drops=[];this.kind="rain";this.count=0;this.nextDot=0;this.nextRebound=0;this.splashSlots=i.splash?au:0}resizePopulation(t,n,i=!1){for(this.kind=t,this.count=n,this.reserve(this.splashSlots+n);this.drops.length<n;)this.drops.push({width:Ci(t),end:0,impact:1/0,x:0,y:0}),this.assign(this.drops.length-1,i,i?0:P(0,Si));this.paint(this.splashSlots+this.drops.length,i)}assign(t,n=!1,i=0){let r=this.drops[t],{length:o,x:s,splash:l,startY:d,endY:c,fallSec:h,fadeStart:u,endSec:f}=Ti(this.kind,this.width,this.height,this.options.spill,this.options.splash),p=this.time+i-(n?P(0,f):0);r.end=p+f,r.impact=l?p+h:1/0,r.x=s+r.width/2,r.y=c+o,this.data.set([s,d,r.width,o,p,h,f,l?f:u,c,Ai(r.width),0,0],(this.splashSlots+t)*ut),this.dirty=!0}splash(t){let{x:n,y:i,impact:r}=t,{bounce:o}=this.options,{rise:s,reach:l,fall:d,length:c,streak:h,duration:u}=Ei(o);this.data.set([n,i,l,s,r,0,u,0,d,.85,h/c,2],this.nextRebound*ut),this.nextRebound=(this.nextRebound+1)%We;for(let f of[-1,1]){let p=ki(f,o);this.data.set([n,i-1,p.spread,p.rise,r,0,p.duration,0,0,.9,0,1],(We+this.nextDot)*ut),this.nextDot=(this.nextDot+1)%Cn}this.dirty=!0}advance(){for(let t=this.drops.length-1;t>=0;t--){let n=this.drops[t];if(n.impact<=this.time&&(this.splash(n),n.impact=1/0),!(n.end>this.time))if(this.drops.length>this.count){let i=this.drops.length-1,r=(this.splashSlots+i)*ut;this.drops[t]=this.drops[i],this.drops.pop(),this.data.copyWithin((this.splashSlots+t)*ut,r,r+ut),this.dirty=!0}else this.assign(t)}return this.splashSlots+this.drops.length}};var Os="http://www.w3.org/2000/svg",Pi=class extends tt{constructor(t,n,i,r){super(t,n,i);this.kind="rain";this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.paused=!1;this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=r,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...n},k(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start rain animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Rain layer not found: ${this.layerSelector}`);let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");if(!i)throw new Error("Rain card not found");this.card=i,this.kind=this.amounts?.rain.kind??this.rainKind();let r=this.getRainColor(this.element.timeOfDayManager),o=this.cardConfig.spill_particles!==!1;this.splashBounce=n.splashBounce/ct.splashBounce;let s=()=>this.startDom(t,i,o,r);if(this.cardConfig.use_webgl===!0&&(this.gpu=Ne(t,"rain",(l,d)=>(l.style.color=r,new Mi(l,i,{spill:o,splash:this.rainConfig.splashEnabled,bounce:this.splashBounce,lost:d})),l=>l.resizePopulation(this.kind,this.dropCount(),!0),()=>{this.gpu=void 0,s()}),this.gpu)){this.paused||this.gpu.resume();return}s()}startDom(t,n,i,r){this.splashLayer=t,this.splashColor=r;let o=this.dropCount();this.pool=new ae(t,()=>{let s=Ci(this.kind),l=ya[this.kind],d=document.createElement("div");return d.className="raindrop",d.dataset.kind=this.kind,d.style.cssText=`
                    width: ${s.toFixed(2)}px;
                    height: ${l}px;
                    background: linear-gradient(0deg, ${r}, transparent);
                    border-radius: ${s.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,d.dataset.width=s.toFixed(2),d},(s,l,d)=>this.fall(s,n,i,l,d),s=>this.removeParticle(s)),this.paused&&this.pool.pause(),this.pool.start(o).forEach(s=>this.addParticle(s)),k(this.config.devMode,`Rain animation started - ${o} drops (${this.kind})`)}dropCount(){let t=this.card;if(!t)return 0;if(this.amounts)return Math.max(4,Math.round(this.amounts.rain.drops*oe(t.offsetWidth,t.offsetHeight)));let n=K(this.cardConfig,this.realWindSpeed);return _a(this.kind,n.rainCount,t.offsetWidth,t.offsetHeight)}onAmountsChange(t,n){this.kind=this.amounts?.rain.kind??this.rainKind();let i=this.dropCount();this.gpu?.resizePopulation(this.kind,i),this.pool?.resize(i,Si).forEach(r=>this.addParticle(r))}fall(t,n,i,r,o){let s=n.offsetHeight,l=this.kind,{length:d,x:c,splash:h,startY:u,endY:f,fallSec:p,fadeStart:m,endSec:g}=Ti(l,n.offsetWidth,s,i,this.rainConfig.splashEnabled);t.dataset.kind!==l&&(t.style.height=`${d}px`,t.dataset.kind=l);let y=parseFloat(t.dataset.width||"2");window.AnimatedWeatherCardGsap.set(t,{x:c,scaleY:1,opacity:Ai(y)});let w=window.AnimatedWeatherCardGsap.timeline({onComplete:r});return w.fromTo(t,{y:u},{y:f,duration:p,ease:"none"}),h?(w.call(()=>this.createSplash(c+y/2,s),[],p),w.to(t,{scaleY:0,duration:g-p,ease:"none"},p)):i&&w.to(t,{opacity:0,duration:g-m,ease:"power1.in"},m),He(w,o)}async onStop(){this.gpu?.stop(),this.gpu=void 0,this.paused=!1,this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()}),this.splashDots=[],this.rebounds.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf([t,t.firstChild]),t.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(t=>t.remove()),k(this.config.devMode,"Rain animation stopped")}async onPause(){this.paused=!0,this.gpu?.pause(),this.pool?.pause(),k(this.config.devMode,"Rain animation paused")}async onResume(){this.paused=!1,this.gpu?.resume(),this.pool?.resume(),k(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(t,n){if(!(this.paused||!window.AnimatedWeatherCardGsap||!this.splashLayer)){this.createRebound(t,n);for(let i of[-1,1]){let r=this.splashDots[this.nextSplashDot];r||(r=document.createElement("div"),r.className="rain-splash",r.style.background=this.splashColor,this.splashLayer.appendChild(r),this.splashDots[this.nextSplashDot]=r),this.nextSplashDot=(this.nextSplashDot+1)%Cn;let{duration:o,rise:s,spread:l}=ki(i,this.splashBounce);window.AnimatedWeatherCardGsap.killTweensOf(r),window.AnimatedWeatherCardGsap.set(r,{x:t-1,y:n-2,opacity:.9}),window.AnimatedWeatherCardGsap.timeline().to(r,{x:t-1+l,duration:o,ease:"power1.out"},0).to(r,{y:n-2-s,duration:o*.45,ease:"power2.out"},0).to(r,{y:n-2,duration:o*.55,ease:"power2.in"},o*.45).to(r,{opacity:0,duration:o*.4,ease:"power1.in"},o*.6)}}}createRebound(t,n){let i=this.splashLayer,r=this.rebounds[this.nextRebound];if(!r){r=document.createElementNS(Os,"svg"),r.classList.add("rain-rebound");let f=document.createElementNS(Os,"path");f.setAttribute("fill","none"),f.style.stroke=this.splashColor,r.appendChild(f),i.appendChild(r),this.rebounds[this.nextRebound]=r}this.nextRebound=(this.nextRebound+1)%We;let o=r.firstChild,{rise:s,reach:l,fall:d,length:c,streak:h,duration:u}=Ei(this.splashBounce);o.setAttribute("d",`M 0,0 Q ${l.toFixed(1)},${(-2*s).toFixed(1)} ${(2*l).toFixed(1)},${d.toFixed(1)}`),o.style.strokeDasharray=`${h.toFixed(1)} ${(c+h).toFixed(1)}`,window.AnimatedWeatherCardGsap.killTweensOf([r,o]),window.AnimatedWeatherCardGsap.set(r,{x:t,y:n,opacity:.85}),window.AnimatedWeatherCardGsap.timeline().fromTo(o,{strokeDashoffset:h,strokeWidth:1.6},{strokeDashoffset:-c,strokeWidth:.6,duration:u,ease:"power2.out"},0).to(r,{opacity:0,duration:u*.35,ease:"power1.in"},u*.65)}getRainColor(t){return this.rainConfig.isStorm?Sn("lightning",t,"var(--weather-storm-rain-color)"):Sn("rain",t,"var(--weather-rain-color)")}};var Ds=36,$t=[2,6],Li=[20,38],An=10,va=2.2,ba=.13,xa=30,Fs=[150,230],Tn=[1.5,3.5],Sa=.08;function Ca(a,e,t){return Math.max(6,Math.round(Ds*a*oe(e,t)))}function kn(a){return Math.min(va,Math.max(.3,a/ct.windSpeed))}function En(a){return(a-$t[0])/($t[1]-$t[0])}function Ri(a,e,t,n,i,r){let o=En(a),s=(Li[0]+(Li[1]-Li[0])*o)*P(.9,1.1),l=r!==void 0&&Math.random()<.6,d=-a*2,c=l?t-r-a:t+(i?P(60,120):a),h=c-d,u=Math.max(.5,h/s),f=h*P(.04,ba)*n,p=P(-f,Math.max(1,e-a)),m=l?u:i?Math.min(u,(t-d)/s):u,g=l?u+.6:i?Math.max(u,m+.1):u;return{startY:d,endY:c,fallSec:u,settles:l,drift:f,x:p,fadeStart:m,endSec:g}}function Oi(a,e,t,n,i){let r=P(...Fs),o=Math.random()<.3,s=-a*2,l=o?t-a:i?t+P(60,120):t+a,d=l-s,c=Math.max(.3,d/r),h=d*P(.03,Sa)*n,u=P(-h,Math.max(1,e-a)),f=o?c:i?Math.min(c,(t-s)/r):c,p=o?c+.3:i?Math.max(c,f+.1):c;return{startY:s,endY:l,fallSec:c,settles:o,drift:h,x:u,fadeStart:f,endSec:p}}var ou=`
layout(location=0) in vec2 corner;
layout(location=1) in vec4 path;
layout(location=2) in vec4 timing;
layout(location=3) in vec4 flake;
uniform vec4 frame;
uniform float time;
out vec2 point;
out float opacity;
#ifdef SLEET
out mediump float halfSize;
#endif
void main() {
    float age = time - timing.x;
    float fall = clamp(age / timing.y, 0.0, 1.0);
    float fade = clamp((age - timing.z) / max(0.001, timing.w - timing.z), 0.0, 1.0);
    opacity = age < 0.0 ? 0.0 : flake.y * (flake.w < 0.0 ? (1.0 - fade) * (1.0 - fade) : 1.0 - fade * fade);
    vec2 pos = mix(path.xy, path.zw, fall) + frame.zw;
#ifdef SLEET
    halfSize = flake.x * 0.5;
    point = corner * (halfSize + 1.5);
    float c = cos(flake.z);
    float s = sin(flake.z);
    pos += vec2(halfSize) + mat2(c, s, -s, c) * point;
#else
    float angle = radians(${An}.0) * cos(6.2831853 * (age / abs(flake.w) + flake.z));
    pos += vec2(-sin(angle), cos(angle) - 1.0) * flake.x * 5.5 + flake.x * (corner + 1.0) * 0.5;
    point = corner;
#endif
    gl_Position = vec4(pos / frame.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`,su=`
precision mediump float;
in vec2 point;
in float opacity;
#ifdef SLEET
in float halfSize;
#endif
uniform vec4 tint;
out vec4 color;
void main() {
#ifdef SLEET
    float radius = halfSize * 0.4;
    vec2 q = abs(point) - (halfSize - radius);
    float edge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float core = 1.0 - smoothstep(-0.3, 0.3, edge);
    float halo = (1.0 - core) * 0.75 * (1.0 - smoothstep(0.0, 1.5, edge));
    color = vec4(tint.rgb * core + vec3(0.784, 0.863, 1.0) * halo, core + halo) * opacity * tint.a;
#else
    float alpha = clamp((1.0 - length(point)) / 0.55, 0.0, 1.0) * opacity * tint.a;
    color = vec4(tint.rgb * alpha, alpha);
#endif
}`,Ie=class extends ze{constructor(t,n,i){let r=i.kind==="sleet",o=`#version 300 es
${r?`#define SLEET
`:""}`,s=r?Tn:$t,l=r?Sa*i.wind:ba*va;super(t,n,{spill:i.spill,sideSpill:d=>(d+120+s[1]*2)*l,lost:i.lost},o+ou,o+su);this.options=i;this.particles=[];this.count=0}resizePopulation(t,n,i=!1){this.count=t,n&&(this.particles.length=Math.min(t,this.particles.length)),this.reserve(t);let r=this.options.kind==="sleet";for(;this.particles.length<t;){let o=P(...r?Tn:$t);this.particles.push({size:o,end:0,settleAt:1/0}),this.assign(this.particles.length-1,i||n,i||n?0:P(0,r?1.5:6))}this.paint(this.particles.length,i)}assign(t,n=!1,i=0){let r=this.particles[t],{size:o}=r,{wind:s,spill:l,pile:d,kind:c}=this.options,h=c==="sleet",{startY:u,endY:f,fallSec:p,settles:m,x:g,drift:y,fadeStart:w,endSec:_}=h?Oi(o,this.width,this.height,s,l):Ri(o,this.width,this.height,s,l,d?.()),b=this.time+i-(n?P(0,_):0);r.end=b+_,r.settleAt=m?b+p:1/0;let v=h?P(.8,1):.45+.45*En(o),C=Math.random()*(h?2*Math.PI:1),S=h?1:P(2.8,4.4);this.data.set([g,u,g+y,f,b,p,w,_,o,v,C,S*(m?-1:1)],t*ut),this.dirty=!0}advance(){for(let t=this.particles.length-1;t>=0;t--){let n=this.particles[t];if(n.settleAt<=this.time&&(n.settleAt=1/0,this.options.settle()),!(n.end>this.time))if(this.particles.length>this.count){let i=this.particles.length-1;this.particles[t]=this.particles[i],this.particles.pop(),this.data.copyWithin(t*ut,i*ut,(i+1)*ut),this.dirty=!0}else this.assign(t)}return this.particles.length}};var Di=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.paused=!1;this.swings=[];this.swingOf=new WeakMap;this.realWindSpeed=r,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...n},k(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start snow animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Snow layer not found: ${this.layerSelector}`);let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");if(!i)throw new Error("Snow card not found");this.card=i;let r=this.cardConfig.spill_particles!==!1,o=kn(n.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation();let s=()=>this.startDom(t,i,r,o);if(this.cardConfig.use_webgl===!0&&(this.gpu=Ne(t,"snow",(l,d)=>new Ie(l,i,{kind:"snow",spill:r,wind:o,lost:d,pile:()=>this.snowConfig.accumulation?this.pileHeight():void 0,settle:()=>this.addToAccumulation()}),l=>l.resizePopulation(this.flakeCount(),!0,!0),()=>{this.gpu=void 0,s()}),this.gpu)){this.paused||this.gpu.resume();return}s()}startDom(t,n,i,r){let o=this.flakeCount();this.pool=new ae(t,()=>this.createFlake(),(s,l,d)=>this.fall(s,n,r,i,l,d),s=>{let l=this.swingOf.get(s);l?.kill(),this.swings=this.swings.filter(d=>d!==l),this.removeParticle(s)}),this.paused&&this.pool.pause(),this.pool.start(o).forEach(s=>this.addParticle(s)),k(this.config.devMode,`Snow animation started - ${o} flakes`)}flakeCount(){let t=this.card;if(!t)return 0;let n=this.amounts?.snow??K(this.cardConfig,this.realWindSpeed).snowCount;return Ca(n,t.offsetWidth,t.offsetHeight)}onAmountsChange(t,n){let i=this.flakeCount();this.gpu?.resizePopulation(i,n),this.pool?.resize(i,6,n).forEach(r=>this.addParticle(r))}createFlake(){let t=P($t[0],$t[1]),n=En(t),i=document.createElement("div");i.className="snowflake",i.dataset.size=t.toFixed(2),i.style.cssText=`
            width: ${t.toFixed(2)}px;
            height: ${t.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, #ffffff) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,i.dataset.opacity=(.45+.45*n).toFixed(2),window.AnimatedWeatherCardGsap.set(i,{transformOrigin:"50% -500%",rotation:-An});let r=window.AnimatedWeatherCardGsap.to(i,{rotation:An,duration:P(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return r.progress(Math.random()),this.paused&&r.pause(),this.swings.push(r),this.swingOf.set(i,r),i}fall(t,n,i,r,o,s){let l=parseFloat(t.dataset.size||"4"),{startY:d,endY:c,fallSec:h,settles:u,drift:f,x:p,fadeStart:m,endSec:g}=Ri(l,n.offsetWidth,n.offsetHeight,i,r,this.snowConfig.accumulation?this.pileHeight():void 0);window.AnimatedWeatherCardGsap.set(t,{x:p,opacity:parseFloat(t.dataset.opacity||"0.7")});let y=window.AnimatedWeatherCardGsap.timeline({onComplete:o});return y.fromTo(t,{y:d},{y:c,x:p+f,duration:h,ease:"none"}),u&&y.call(()=>this.addToAccumulation(),[],h),(u||r)&&y.to(t,{opacity:0,duration:g-m,ease:u?"power1.out":"power1.in"},m),He(y,s)}async onStop(){this.gpu?.stop(),this.gpu=void 0,this.paused=!1,this.swings.forEach(t=>t.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),k(this.config.devMode,"Snow animation stopped")}async onPause(){this.paused=!0,this.gpu?.pause(),this.pool?.pause(),this.swings.forEach(t=>t.pause()),k(this.config.devMode,"Snow animation paused")}async onResume(){this.paused=!1,this.gpu?.resume(),this.pool?.resume(),this.swings.forEach(t=>t.resume()),k(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let t=this.element.querySelector(".animated-weather-card");if(!t)return;t.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(i=>i.remove());let n=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${n}px;
            background: linear-gradient(to top, #ffffff, transparent);
            transform-origin: 50% 100%;
            transform: scaleY(0);
            pointer-events: none;
            z-index: 5;
        `,t.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let t=this.accumulationElement,n=this.snowConfig.accumulationHeight;if(!t?.parentNode||n<=0)return;let i=this.pileHeight();if(i>=n)return;let r=Math.min(n,i+.8);t.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(t,{scaleY:r/n,opacity:Math.min(.9,r/n),duration:.3,ease:"power2.out"})}};var Hi=6,Wi=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.paused=!1;this.realWindSpeed=r,this.sleetConfig={particleCount:40,...n},k(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start sleet animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");if(!i)throw new Error("Sleet card not found");this.card=i;let r=this.cardConfig.spill_particles!==!1,o=kn(n.windSpeed)*.5,s=()=>this.startDom(t,i,r,o);if(this.cardConfig.use_webgl===!0&&(this.gpu=Ne(t,"sleet",(l,d)=>new Ie(l,i,{kind:"sleet",spill:r,wind:o,lost:d,settle:()=>this.addToPile(i)}),l=>l.resizePopulation(this.pelletCount(),!0,!0),()=>{this.gpu=void 0,s()}),this.gpu)){this.paused||this.gpu.resume();return}s()}startDom(t,n,i,r){let o=this.pelletCount();this.pool=new ae(t,()=>{let s=P(...Tn),l=document.createElement("div");return l.className="sleet-particle-gsap",l.dataset.size=s.toFixed(2),l.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${s.toFixed(2)}px;
                    height: ${s.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,l},(s,l,d)=>this.fall(s,n,r,i,l,d),s=>this.removeParticle(s)),this.paused&&this.pool.pause(),this.pool.start(o).forEach(s=>this.addParticle(s)),k(this.config.devMode,`Sleet animation started - ${o} pellets`)}pelletCount(){let t=this.card;if(!t)return 0;let n=this.amounts?.sleet??K(this.cardConfig,this.realWindSpeed).snowCount;return Math.max(6,Math.round(xa*n*oe(t.offsetWidth,t.offsetHeight)))}onAmountsChange(t,n){let i=this.pelletCount();this.gpu?.resizePopulation(i,n),this.pool?.resize(i,1.5,n).forEach(r=>this.addParticle(r))}fall(t,n,i,r,o,s){let l=parseFloat(t.dataset.size||"2"),{startY:d,endY:c,fallSec:h,settles:u,drift:f,x:p,fadeStart:m,endSec:g}=Oi(l,n.offsetWidth,n.offsetHeight,i,r);window.AnimatedWeatherCardGsap.set(t,{x:p,opacity:P(.8,1),rotation:P(0,360)});let y=window.AnimatedWeatherCardGsap.timeline({onComplete:o});return y.fromTo(t,{y:d},{y:c,x:p+f,duration:h,ease:"none"}),u&&y.call(()=>this.addToPile(n),[],h),(u||r)&&y.to(t,{opacity:0,duration:g-m,ease:u?"power1.out":"power1.in"},m),He(y,s)}addToPile(t){if(this.state!=="active")return;let n=t.querySelector(".sleet-accumulation");n||(n=document.createElement("div"),n.className="sleet-accumulation",n.style.cssText=`
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${Hi}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `,t.appendChild(n));let i=parseFloat(n.getAttribute("data-target-height")||"0");if(i>=Hi)return;let r=Math.min(Hi,i+.4);n.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(n,{scaleY:r/Hi,duration:.3,ease:"power2.out"})}async onStop(){this.gpu?.stop(),this.gpu=void 0,this.paused=!1,this.pool?.stop(),this.pool=void 0;let t=this.element.querySelector(".animated-weather-card");t&&t.querySelectorAll(".sleet-accumulation").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.remove()}),k(this.config.devMode,"Sleet animation stopped")}async onPause(){this.paused=!0,this.gpu?.pause(),this.pool?.pause(),k(this.config.devMode,"Sleet animation paused")}async onResume(){this.paused=!1,this.gpu?.resume(),this.pool?.resume(),k(this.config.devMode,"Sleet animation resumed")}};function Hs(a,e,t,n){return t!==null&&t>0?a*Math.max(0,t-e):a*.6*n}var Aa=[90,160];function zs(a,e,t,n,i,r=!0){let o=document.createElement("div");o.className="leaf-gsap";let s=n.offsetWidth,l=n.offsetHeight,d=20+Math.random()*Math.max(40,l-40),c=Math.random(),h=c<.25,u=c>.8&&d>100;o.style.position="absolute",o.style.borderRadius="0 100% 0 100%",o.style.transformOrigin="center",o.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let f=(Math.random()*8+6)*t;o.style.width=o.style.height=f+"px";let p=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];o.style.background=p[Math.floor(Math.random()*p.length)];let m=-f-10,g=s+(r?60+Math.random()*80:f+10),y=(Aa[0]+Math.random()*(Aa[1]-Aa[0]))*be(e.windSpeed)*(h?.6:1),w=(g-m)/y,_=Math.min(w,(s-m)/y),b=u?-(60+Math.random()*80):h?80+Math.random()*80:(Math.random()-.5)*80;window.AnimatedWeatherCardGsap.set(o,{x:m,y:d,rotation:Math.random()*360,opacity:0}),a.appendChild(o);let v=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{o.parentNode&&o.parentNode.removeChild(o),i&&i(o)}});return v.to(o,{opacity:.85,duration:.25,ease:"power1.out"},0).to(o,{x:g,duration:w,ease:"none"},0).to(o,{y:d+b,duration:w,ease:h?"sine.in":"sine.inOut"},0).to(o,{rotation:`+=${120+Math.random()*180}`,duration:w,ease:"none"},0),r&&w>_&&v.to(o,{opacity:0,duration:w-_,ease:"power1.in"},_),o}function Ns(a,e,t,n,i,r,o=.2){let s=document.createElement("div");s.className="wind-swoosh-gsap";let l=Math.random(),d=l>.6,c=l>1-o;s.style.position="absolute",s.style.height=(c?2:1)*t+"px",s.style.borderRadius=d?"2px 1px":"1px",s.style.transformOrigin="left center",s.style.zIndex="10";let h=i.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";s.style.background=`linear-gradient(90deg, transparent 0%, ${h} 50%, transparent 100%)`;let u=Math.max(15,(20+Math.random()*60)*t);s.style.width=u+"px";let f=n.offsetWidth,p=n.offsetHeight,m=p*.15+Math.random()*(p*.7);window.AnimatedWeatherCardGsap.set(s,{x:-u,y:m,rotation:d?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),a.appendChild(s);let y=(f+u*2)/(lu*be(e.windSpeed));return window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s),r&&r(s)}}).to(s,{scaleX:1,opacity:c?.35:.22,duration:.3,ease:"power2.out"},0).to(s,{x:f+u,rotation:d?m>p/2?5:-5:0,duration:y,ease:"none"},0).to(s,{opacity:0,scaleX:.3,duration:Math.min(.5,y*.3)},y-Math.min(.5,y*.3)),s}var lu=230,du=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function be(a){return Math.min(2.2,Math.max(.6,Math.sqrt(a/ct.windSpeed)))}var cu=12;function uu(a){let e=Math.round(70*a),t=Math.round(35*a);return{width:e,height:Math.round(26*a),puffs:[{x:Math.round(9*a),y:Math.round(-22*a),size:Math.round(44*a)},{x:e-Math.round(9*a)-t,y:Math.round(-13*a),size:t}]}}var Is=a=>a>0?Math.ceil(a*3)+1:0,Ws=new Map;function hu(a,e,t,n){let i=[a,e,t,n].join(","),r=Ws.get(i);if(r)return r;let o=Is(t),s=Math.ceil((a+2*o)*n),l=Math.ceil((e+2*o)*n),d=()=>{let f=document.createElement("canvas");return f.width=s,f.height=l,[f,f.getContext("2d")]},c=null,[h,u]=d();if(u){let[f,p,m]=[o*n,o*n,Math.min(50,a/2,e/2)*n],[g,y]=[f+a*n,p+e*n];if(u.fillStyle="#000",u.beginPath(),u.moveTo(f+m,p),u.arcTo(g,p,g,y,m),u.arcTo(g,y,f,y,m),u.arcTo(f,y,f,p,m),u.arcTo(f,p,g,p,m),u.closePath(),u.fill(),t>0){let[w,_]=d();_&&(_.shadowColor="#000",_.shadowBlur=2*t*n,_.shadowOffsetX=s,_.drawImage(h,-s,0),c=w.toDataURL())}else c=h.toDataURL()}return c&&Ws.set(i,c),c}function Mn(a){(a.closest?.(".clouds-container")??a).querySelectorAll(".cloud-track, .cloud-gsap, .cloud-occluder").forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()})}function mu(a){return Math.min(1,Math.max(.5,a/160))||1}function Ta(a){return[Math.ceil(a*.4),Math.ceil(a*.4),Math.ceil(a*.6)]}function $s(a,e,t,n,i,r,o={}){let s=i.offsetWidth,l=i.offsetHeight,d=du[t],c=o.windFactor??be(e.windSpeed),h=mu(l),u=document.createElement("div");u.className=`cloud-gsap cloud-gsap-${d.name}-${n}`;let f=e.cloudBaseSize*d.scale,p=1+(n-1)*.15,m=Math.max(.3,Math.min(2.5,f))*p*h,g=uu(m);u.style.position="absolute",u.style.opacity=d.opacity.toString(),u.dataset.awcO=String(d.opacity),u.style.zIndex=(10+t).toString();let y=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][t],w=r?.color_palette==="theme"?0:d.blur,_=[{x:0,y:0,width:g.width,height:g.height},...g.puffs.map(R=>({x:R.x,y:R.y,width:R.size,height:R.size}))],b=Math.min(3,Math.max(1,window.devicePixelRatio||1)),v=_.map(R=>hu(R.width,R.height,w,b)),C=v.every(Boolean),S=C?Is(w):0;if(u.style.width=g.width+"px",u.style.height=g.height+"px",C)u.classList.add("cloud-masked"),_.forEach((R,j)=>{let N=document.createElement("div");N.style.position="absolute",N.style.left=R.x-S+"px",N.style.top=R.y-S+"px",N.style.width=R.width+2*S+"px",N.style.height=R.height+2*S+"px",N.style.background=y;for(let ot of["-webkit-",""])N.style.setProperty(`${ot}mask-image`,`url("${v[j]}")`),N.style.setProperty(`${ot}mask-size`,"100% 100%"),N.style.setProperty(`${ot}mask-repeat`,"no-repeat");u.appendChild(N)});else{u.style.borderRadius="50px",u.style.background=y,w>0&&(u.style.filter=`blur(${w}px)`);for(let R of g.puffs){let j=document.createElement("div");j.style.position="absolute",j.style.left=R.x+"px",j.style.top=R.y+"px",j.style.width=R.size+"px",j.style.height=R.size+"px",j.style.borderRadius="50px",j.style.background=y,u.appendChild(j)}}let A=g.width+2*S,E=([[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][t][n-1]||15+t*10)/60,L=g.height+Math.max(S,Math.ceil(w*3))+2,D=Number(i.dataset?.cloudBand),z=Number.isFinite(D)&&i.dataset?.cloudBand!==void 0?D:null,I=Math.max(150+t*50,A+cu),G=d.speed*c*(.9+Math.random()*.2),F=(s+2*I)/G,q=document.createElement("div");q.className="cloud-track",q.dataset.awcF=String(E),q.dataset.awcB=String(L),q.appendChild(u),window.AnimatedWeatherCardGsap.set(u,{opacity:d.opacity});let xt=[q];if(r?.color_palette==="theme"){let R=a.parentElement?.querySelector(".clouds-occluders")??a.insertAdjacentElement("beforebegin",Object.assign(document.createElement("div"),{className:"clouds-occluders"})),j=u.cloneNode(!0);j.className="cloud-occluder",j.style.opacity="1";for(let ot of[j,...Array.from(j.querySelectorAll("div"))])ot.style.background&&(ot.style.background="var(--awc-card-bg)");let N=q.cloneNode(!1);N.appendChild(j),R?.appendChild(N),xt.push(N)}let at=xt.length>1?xt:q;window.AnimatedWeatherCardGsap.set(at,{xPercent:0,x:-I,y:Hs(E,L,z,l)}),a.appendChild(q);let Et=window.AnimatedWeatherCardGsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5,...o.enter!==void 0?{delay:o.enter*F}:{},...o.onRepeat?{onRepeat:o.onRepeat}:{}});return Et.fromTo(at,{xPercent:0,x:-I},{xPercent:100,x:I,duration:F,ease:"none"}),o.enter===void 0&&Et.progress(Math.random()),{layer:t,i:n,tracks:xt,tl:Et}}function Gs(a){let e=a.querySelector(".snow-accumulation");e&&(window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(e,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{e.parentNode&&e.parentNode.removeChild(e)}}):e.parentNode?.removeChild(e))}function qs(a,e,t,n,i){let r=document.createElement("div");r.className=`fog-layer fog-layer-${t}`;let o=n.offsetWidth,s=n.offsetHeight,l=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],d=l[t]||l[2],c=i.custom_colors?.fog_color,h=(i.color_palette||"default")!=="theme"?vn(c)?c:"#e0e0e0":"var(--secondary-text-color)",u=3+Math.floor(Math.random()*3),f=o*d.scale;r.style.cssText=`
        position: absolute;
        top: ${20+t*15}%;
        left: -50%;
        width: ${f}px;
        height: ${d.height}px;
        opacity: ${d.opacity};
        filter: blur(${d.blur}px);
        pointer-events: none;
        z-index: ${5+t};
        overflow: visible;
    `;for(let C=0;C<u;C++){let S=document.createElement("div"),A=f/u*(2+Math.random()*1.2),T=d.height*(1.2+Math.random()*1.6),x=f/u*C-A*.3,E=(Math.random()-.5)*(d.height*.5);S.style.cssText=`
            position: absolute;
            left: ${x}px;
            top: ${E}px;
            width: ${A}px;
            height: ${T}px;
            background: radial-gradient(ellipse ${A/2}px ${T/2}px at center, 
                ${h} 0%, 
                ${h} 40%, 
                transparent 70%);
            border-radius: ${A/2}px ${T/2}px;
            opacity: ${.7+Math.random()*.6}; // Varied opacity per segment
        `,r.appendChild(S)}a.appendChild(r);let p=e.windSpeed*(.5+Math.random()*.5),m=15/d.speed,g=Math.max(8,m/p),y=o*d.scale,w=-y,_=o+y;window.AnimatedWeatherCardGsap.set(r,{x:w,opacity:d.opacity});let b=window.AnimatedWeatherCardGsap.timeline({repeat:-1,delay:t*2+Math.random()*3});b.to(r,{x:_,duration:g,ease:"none",onComplete:()=>{window.AnimatedWeatherCardGsap.set(r,{x:w})}});let v=window.AnimatedWeatherCardGsap.timeline({repeat:-1,yoyo:!0});return v.to(r,{opacity:d.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:b,opacity:v}}function zi(a){a.querySelectorAll(".fog-layer, .fog-amount").forEach(t=>{t.parentNode&&t.parentNode.removeChild(t)})}var fu=3,pu=2,Bs=[900,1400],Vs=[1800,2600],gu=.2,Ni=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=r,this.windConfig={leafCount:3,swooshEnabled:!0,...n},k(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(P(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(P(300,900)),k(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(t){this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let n=K(this.cardConfig,this.realWindSpeed),i=n.leafCount*(this.amounts?.leaves??1),r=Math.max(1,Math.round(fu*i));if(this.leaves.size<r){let o=zs(this.layer(),n,1,this.card(),s=>this.forget(s,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(o),this.addParticle(o)}this.scheduleLeaf(P(Bs[0],Bs[1])/Math.max(.5,i))},t)}scheduleSwoosh(t){this.swooshTimer=setTimeout(()=>{if(this.state!=="active")return;let n=K(this.cardConfig,this.realWindSpeed),i=this.amounts?.gusts??0;if(this.swooshes.size<pu+Math.round(2*i)){let r=Ns(this.layer(),n,1,this.card(),this.cardConfig,o=>this.forget(o,this.swooshes),gu+.3*i);this.swooshes.add(r),this.addParticle(r)}this.scheduleSwoosh(P(Vs[0],Vs[1])/(1+i))},t)}forget(t,n){n.delete(t),this.removeParticle(t)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.remove()}),this.leaves.clear(),this.swooshes.clear(),k(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),vi(this.layer()),k(this.config.devMode,"Wind animation paused")}async onResume(){bi(this.layer()),this.clearTimers(),this.scheduleLeaf(P(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(P(600,1500)),k(this.config.devMode,"Wind animation resumed")}};var Pn=[6e3,18e3],yu=[1500,6e3],Us=.16,Ii=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=r,this.lightningConfig={disableShake:i.disable_lightning_shake||!1,minInterval:Pn[0],maxInterval:Pn[1],...n},k(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start lightning animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Lightning layer not found: ${this.layerSelector}`);t.style.opacity="0";let[n,i]=yu;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},n+Math.random()*(i-n)),this.addTimeout(this.flashTimeout),k(this.config.devMode,"Lightning animation started")}flash(){if(!window.AnimatedWeatherCardGsap||this.state!=="active")return;let t=this.element.querySelector(this.layerSelector),n=this.element.querySelector(".animated-weather-card");if(!t||!n)return;let i=n.offsetWidth,r=n.offsetHeight,o=parseFloat(n.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let l=document.createElementNS("http://www.w3.org/2000/svg","path"),d=30+Math.random()*(i-60),c=20*o,h=20,u=[d+",0"];for(let g=0;g<h;g++){let y=d+(Math.random()*c-c/2),w=r/h*(g+1);u.push(y+","+w)}l.setAttribute("d","M"+u.join(" L"));let f=this.element.timeOfDayManager,p=Sn("lightning",f,"white");l.setAttribute("stroke",p),l.setAttribute("stroke-width",((2+Math.random()*2)*o).toString()),l.setAttribute("fill","none"),s.appendChild(l),t.appendChild(s);let m=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=m,m.set(t,{opacity:.9},0).to(t,{opacity:.3,duration:.06,ease:"none"},0).to(t,{opacity:.8,duration:.04,ease:"none"},.06).to(t,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let g=-6*o;m.to(n,{y:g,duration:.06,ease:"power2.out"},Us).to(n,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Us+.06)}}scheduleNext(){if(this.state!=="active")return;let t=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},t),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let t=this.element.querySelector(".animated-weather-card");t&&window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.set(t,{clearProps:"transform"});let n=this.element.querySelector(this.layerSelector);n&&(n.querySelectorAll("svg").forEach(r=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(r.querySelector("path")),r.parentNode&&r.parentNode.removeChild(r)}),n.style.opacity="0"),k(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),k(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),k(this.config.devMode,"Lightning animation resumed")}};var wu=["dawn","day","dusk","night"],Ma=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],_u={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},js=(a,e,t)=>Math.min(e,Math.max(a,t)),le=(a,e,t)=>a+(e-a)*t;function vu(a,e,t){let n=(e-a+540)%360-180;return(a+n*t+360)%360}function Kt(a,e,t){let n=([m,g,y])=>[m,g*Math.cos(y*Math.PI/180),g*Math.sin(y*Math.PI/180)],[i,r,o]=n(a),[s,l,d]=n(e),c=le(i,s,t),h=le(r,l,t),u=le(o,d,t),f=Math.hypot(h,u),p=f<1e-6?a[2]:(Math.atan2(u,h)*180/Math.PI+360)%360;return[c,f,p]}function ka([a,e,t]){let n=t*Math.PI/180,i=e*Math.cos(n),r=e*Math.sin(n),o=(a+.3963377774*i+.2158037573*r)**3,s=(a-.1055613458*i-.0638541728*r)**3,l=(a-.0894841775*i-1.291485548*r)**3;return[4.0767416621*o-3.3077115913*s+.2309699292*l,-1.2684380046*o+2.6097574011*s-.3413193965*l,-.0041960863*o-.7034186147*s+1.707614701*l]}var bu=a=>a<=.0031308?12.92*a:1.055*Math.pow(a,1/2.4)-.055;function Ft(a){let e=n=>n.every(i=>i>=-1e-4&&i<=1.0001),t=ka(a);if(!e(t)){let n=0,i=a[1];for(let r=0;r<24;r++){let o=(n+i)/2;e(ka([a[0],o,a[2]]))?n=o:i=o}t=ka([a[0],n,a[2]])}return t.map(n=>bu(js(0,1,n)))}var Xs=a=>Math.round(js(0,1,a)*255);function jt(a){return"#"+a.map(e=>Xs(e).toString(16).padStart(2,"0")).join("")}function Ys(a,e){return`rgba(${a.map(Xs).join(", ")}, ${Number(e.toFixed(3))})`}function Ea(a,e){return[.15+(a[0]-.15)*.42,a[1]*le(.75,.5,e),vu(a[2],262,.45)]}function xu(a,e){let t=_u[a],n=1-t.overcast*.7,i={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:le(.46,.28,t.overcast)};if(a==="clear-night"){if(e==="dawn"||e==="dusk"){let r=e==="dawn"?[.4,.09,20]:[.38,.1,40];return{...i,bottom:Kt(t.bottom,r,.45),glowAlpha:.2,scrimAlpha:.22}}return{...i,scrimAlpha:.2}}switch(e){case"night":return{top:Ea(t.top,t.overcast),mid:Ea(t.mid,t.overcast),bottom:Ea(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:le(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:Kt(t.top,[t.top[0]*.8,.075,292],.5*n),mid:Kt(t.mid,[t.mid[0]*.88,.065,350],.42*n),bottom:Kt(t.bottom,[t.bottom[0]*.92,.115,52],.72*n),glow:Kt(t.glow,[.82,.13,58],n),glowAlpha:le(t.glowAlpha,.6,n*.6),scrimAlpha:i.scrimAlpha+.04};case"dawn":return{top:Kt(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*n),mid:Kt(t.mid,[t.mid[0]*.95,.05,330],.3*n),bottom:Kt(t.bottom,[t.bottom[0]*.95,.085,32],.62*n),glow:Kt(t.glow,[.88,.09,40],n),glowAlpha:le(t.glowAlpha,.5,n*.5),scrimAlpha:i.scrimAlpha+.04};default:return i}}function Su(a){return[.16,Math.min(.04,a[1]*.6),a[2]]}function $e(a,e){let t=xu(a,e);return{top:jt(Ft(t.top)),mid:jt(Ft(t.mid)),bottom:jt(Ft(t.bottom)),glow:Ys(Ft(t.glow),t.glowAlpha),scrim:Ys(Ft(Su(t.top)),t.scrimAlpha)}}var Ge=[.985,.006,250],$i=.8,Zs=.55,Qs=.4,Gi={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},Js={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},tl={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64},qi=312,el=a=>a.clientWidth>=640&&a.clientHeight>=540;function qe(a,e){let t=n=>`${Math.round(n*100)}%`;return`radial-gradient(${t(a.rx)} ${t(a.ry)} at ${t(a.cx)} ${t(a.cy)}, ${e}, transparent ${t(a.fade)})`}function nl(){let a=[];for(let e of Ma)for(let t of wu){let n=$e(e,t),i=t==="day"?`.animated-weather-card.${e}`:`.animated-weather-card.${e}[data-phase="${t}"]`;a.push(`${i} { --awc-sky-top: ${n.top}; --awc-sky-mid: ${n.mid}; --awc-sky-bottom: ${n.bottom}; --awc-sky-glow: ${n.glow}; --awc-sky-scrim: ${n.scrim}; }`)}return a.join(`
`)}function Bi(a,e,t){return a==null||!Number.isFinite(a)?t?"day":"night":a<-6?"night":a<6?e?"dawn":"dusk":"day"}var Rt=3.2,Be="cubic-bezier(0.37, 0, 0.63, 1)",il={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},rl=Object.keys(il),Pa=rl.filter(a=>a.startsWith("--awc-sky-"));function al(){return rl.map(a=>`${a} ${Rt}s ${Be}`).join(`,
            `)}var Ks=!1;function Vi(){if(Ks)return;Ks=!0;let a=globalThis.CSS;if(a?.registerProperty)for(let[e,t]of Object.entries(il))try{a.registerProperty({name:e,syntax:"<color>",inherits:!0,initialValue:t})}catch{}}var La=Array.from({length:25},(a,e)=>[e%5/2-1,Math.floor(e/5)/2-1]).filter(([a,e])=>a*a+e*e<=1),Cu=1.9,Au=.6,Tu=.3,ku=.3,Ui=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.clouds=[];this.startWindFactor=1;this.sunLit=1;this.looks=null;this.realWindSpeed=r,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...n},k(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start clouds animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");Mn(t);let r=this.amounts?.clouds??Ta(this.cloudCount(n));this.startWindFactor=be(n.windSpeed),this.clouds=[],r.forEach((o,s)=>{for(let l=1;l<=o;l++)this.addCloud(s,l,n)}),this.looks?.kill(),this.looks=window.AnimatedWeatherCardGsap.timeline({repeat:-1,onRepeat:()=>this.veilSun()}),this.looks.to({},{duration:.12}),this.veilSun(!0),k(this.config.devMode,`Clouds animation started with ${this.clouds.length} clouds`)}async onStop(){this.clouds.forEach(({tl:n})=>{window.AnimatedWeatherCardGsap?.killTweensOf(n),n&&typeof n.kill=="function"&&n.kill()}),this.clouds=[],this.looks?.kill(),this.looks=null;let t=this.element.querySelector(this.layerSelector);t&&Mn(t),this.lightSun(1),this.element.querySelector(".animated-weather-card")?.removeAttribute("data-occlude"),k(this.config.devMode,"Clouds animation stopped")}async onPause(){this.clouds.forEach(({tl:t})=>{t&&typeof t.pause=="function"&&t.pause()}),this.looks?.pause(),k(this.config.devMode,"Clouds animation paused")}async onResume(){this.clouds.forEach(({tl:t})=>{t&&typeof t.resume=="function"&&t.resume()}),this.looks?.resume(),k(this.config.devMode,"Clouds animation resumed")}veilSun(t=!1){if(this.occlude()){this.lightSun(1,t);return}let n=this.element.querySelector(".sun-track .sun"),i=n?.getBoundingClientRect(),r=Array.from(this.element.querySelectorAll(".cloud-gsap")),o=_=>Number(_.dataset.awcO)||0;if(!n||!i?.width||getComputedStyle(n).opacity==="0"){r.forEach(_=>this.dense(_,o(_),t));return}let s=i.width/2,l=i.left+s,d=i.top+i.height/2,c=this.element.querySelector(this.containerSelector),h=c?parseFloat(getComputedStyle(c).opacity):1,u=Number.isFinite(h)?h:1,f=_=>{let b=_?parseFloat(getComputedStyle(_).opacity):1;return Number.isFinite(b)?b:1},p=r.map(_=>Math.min(o(_),f(_)||0)*f(_.parentElement)*Au*u),m=r.map(_=>[_,...Array.from(_.children)].map(b=>b.getBoundingClientRect()).filter(b=>b.width&&b.height)),g=(_,b,v)=>m[_].some(C=>{let S=Math.min(C.width,C.height)/2,A=b-Math.min(Math.max(b,C.left+S),C.right-S),T=v-Math.min(Math.max(v,C.top+S),C.bottom-S);return A*A+T*T<=S*S}),y=0,w=r.map(()=>0);for(let[_,b]of La)y+=r.reduce((v,C,S)=>g(S,l+_*s,d+b*s)?v*(1-p[S]):v,1),r.forEach((v,C)=>{g(C,l+_*s*1.25,d+b*s*1.25)&&(w[C]+=1/La.length)});this.lightSun(y/La.length,t),r.forEach((_,b)=>this.dense(_,o(_)*(1+(Cu-1)*Math.min(1,w[b]*3)),t))}occlude(){let t=this.element.querySelector(".animated-weather-card");if(!t||this.cardConfig.color_palette!=="theme")return!1;let n=t.closest("ha-card"),i=n?getComputedStyle(n):null,r=!!i&&(i.backgroundImage||"none")==="none"&&!!i.backgroundColor&&!/rgba|\/|transparent/.test(i.backgroundColor);return r&&t.style.getPropertyValue("--awc-card-bg")!==i.backgroundColor&&t.style.setProperty("--awc-card-bg",i.backgroundColor),t.toggleAttribute("data-occlude",r),r}dense(t,n,i){let r=(Math.round(Math.min(.95,n)*100)/100).toString();t.dataset.awcV!==r&&(t.dataset.awcV=r,i?window.AnimatedWeatherCardGsap?.set(t,{opacity:r}):window.AnimatedWeatherCardGsap?.to(t,{opacity:r,duration:.5,ease:"sine.out",overwrite:"auto"}))}lightSun(t,n=!1){let i=this.element.querySelector(".sun-track"),r=Math.round(t*100)/100;!i||r===this.sunLit&&!n||(this.sunLit=r,n?window.AnimatedWeatherCardGsap?.set(i,{opacity:r}):window.AnimatedWeatherCardGsap?.to(i,{opacity:r,duration:.5,ease:"sine.out",overwrite:!0}))}onWindSpeedChange(){if(!window.AnimatedWeatherCardGsap)return;let t=K(this.cardConfig,this.realWindSpeed),n=be(t.windSpeed)/this.startWindFactor;this.clouds.forEach(({tl:i})=>{window.AnimatedWeatherCardGsap.to(i,{timeScale:n,duration:Rt,ease:"sine.inOut",overwrite:!0})})}cloudCount(t){let n=Math.min(6,Math.max(1,Math.round(t.cloudCount)));return this.cloudsConfig.isPartlyCloudy?Math.max(1,Math.round(n*.6)):n}addCloud(t,n,i,r){let o=this.element.querySelector(this.layerSelector),s=this.element.querySelector(".animated-weather-card"),l=$s(o,i,t,n,s,this.cardConfig,{enter:r,windFactor:this.startWindFactor,onRepeat:()=>{(l.retiring||l.hidden)&&this.retire(l)}}),d=be(i.windSpeed)/this.startWindFactor;return Math.abs(d-1)>1e-6&&l.tl.timeScale(d),this.state==="paused"&&l.tl.pause(),this.clouds.push(l),l}retire(t){t.tl.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(t.tl);for(let n of t.tracks)window.AnimatedWeatherCardGsap?.killTweensOf([n,...Array.from(n.children)]),n.remove();this.clouds=this.clouds.filter(n=>n!==t)}freePlace(t){let n=new Set(this.clouds.filter(r=>r.layer===t).map(r=>r.i)),i=1;for(;n.has(i);)i++;return i}onAmountsChange(t,n){let i=K(this.cardConfig,this.realWindSpeed);(this.amounts?.clouds??Ta(this.cloudCount(i))).forEach((o,s)=>n?this.showClouds(s,o,i):this.driftClouds(s,o,i))}driftClouds(t,n,i){let r=this.clouds.filter(s=>s.layer===t).sort((s,l)=>s.i-l.i);r.filter(s=>s.hidden).forEach(s=>this.retire(s));let o=r.filter(s=>!s.hidden&&!s.retiring);for(let s of r.filter(l=>l.retiring)){if(o.length>=n)break;s.retiring=!1,o.push(s)}for(let s=0,l=n-o.length;s<l;s++)this.addCloud(t,this.freePlace(t),i,s*ku);o.sort((s,l)=>s.i-l.i).slice(n).forEach(s=>{s.retiring=!0})}showClouds(t,n,i){let r=this.clouds.filter(o=>o.layer===t).sort((o,s)=>o.i-s.i);r.forEach((o,s)=>this.fadeCloud(o,s<n));for(let o=r.length;o<n;o++){let s=this.addCloud(t,this.freePlace(t),i);window.AnimatedWeatherCardGsap?.set(s.tracks,{opacity:0}),s.hidden=!0,this.fadeCloud(s,!0)}}fadeCloud(t,n){t.retiring=!1,!!t.hidden!=!n&&(t.hidden=!n,window.AnimatedWeatherCardGsap?.to(t.tracks,{opacity:n?1:0,duration:Tu,ease:"sine.out",overwrite:"auto"}))}};var Yi=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=r,this.fogConfig={layerCount:3,...n},k(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start fog animation");let t=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!t)throw new Error("Fog container not found");let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");zi(i);let r=document.createElement("div");r.className="fog-amount",t.appendChild(r),window.AnimatedWeatherCardGsap.set(r,{opacity:this.amounts?.fog??1}),this.fogTimelines=[];for(let o=0;o<this.fogConfig.layerCount;o++){let s=qs(r,n,o,i,this.cardConfig);this.fogTimelines.push(s.movement),this.fogTimelines.push(s.opacity)}k(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(i=>{i&&typeof i.kill=="function"&&i.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer, .fog-amount")?.forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.parentNode&&i.parentNode.removeChild(i)}),k(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),k(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),k(this.config.devMode,"Fog animation resumed")}onAmountsChange(t,n){let i=this.element.querySelector(".fog-amount");i&&window.AnimatedWeatherCardGsap?.to(i,{opacity:this.amounts?.fog??1,duration:n?.3:Rt,ease:"sine.inOut",overwrite:!0})}};var Eu=5,ol=353,Mu=1440,Pu=1/2,Lu=.25,Ru=.2,Ou=2,Du=2;function Ra(a,e){let t=e>0?Math.min(e,Mu):ol;return Math.max(15,Math.round(a*Eu*Math.max(1,t/ol)))}var Ki=4;function Fu(a,e){return Math.round(Math.min(1,Math.max(0,a*Ki-e))*100)/100}function Xi(a,e,t=0){a.querySelectorAll(".stars-band").forEach((n,i)=>{let r=Fu(e,i%Ki);t>0&&window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(n,{opacity:r,duration:t,ease:"sine.inOut",overwrite:!0}):(window.AnimatedWeatherCardGsap?.killTweensOf(n),n.style.opacity=r<1?String(r):"")})}var sl=20,ll=10,Hu=12,dl=(a,e)=>a.right>e.left-sl&&a.left<e.right+sl&&a.bottom>e.top-ll&&a.top<e.bottom+ll;function Ln(a){let e=[],t=document.createRange();if(typeof t.getClientRects!="function")return e;let n=".animation-layer, .animation-container, style, script",i=document.createTreeWalker(a,NodeFilter.SHOW_TEXT);for(let r=i.nextNode();r;r=i.nextNode())if(!(!r.nodeValue?.trim()||r.parentElement?.closest(n))){t.selectNodeContents(r);for(let o of Array.from(t.getClientRects()))o.width&&o.height&&e.push(o)}for(let r of Array.from(a.querySelectorAll("svg, ha-icon"))){if(r.closest(n))continue;let o=r.getBoundingClientRect();o.width&&o.height&&e.push(o)}return e}function Wu(a,e){for(let t of a){let n=t.getBoundingClientRect();t.classList.toggle("awc-veiled",!!n.width&&e.some(i=>dl(n,i)))}}function cl(a){let e=a.querySelectorAll(".stars-field .star-gsap");if(!e.length)return;let t=a.querySelector(".moon-gsap")?.getBoundingClientRect();Wu(e,t?.width?[...Ln(a),t]:Ln(a))}function Oa(a,e,{moon:t,still:n=!1,words:i=[],share:r=1}){let o=document.createElement("div");o.className="stars-field";let s=Array.from({length:Ki},()=>o.appendChild(Object.assign(document.createElement("div"),{className:"stars-band"}))),l=t?document.createElement("div"):null;if(l){l.className="moon-gsap",a.appendChild(l);let h=l.getBoundingClientRect();h.width&&h.height&&(i=[...i,h])}let d=a.getBoundingClientRect(),c=i.length>0&&d.width>0&&d.height>0;for(let h=0;h<e;h++){let u=document.createElement("div");u.className="star-gsap";let f=1+Math.random()*3,p=.3+Math.random()*.5,m=0,g=0,y=!1;for(let w=0;w<(c?Hu:1)&&!y;w++){m=Math.random()*100,g=Math.random()*70;let _=d.left+m/100*d.width,b=d.top+g/100*d.height;y=!c||!i.some(v=>dl({left:_,top:b,right:_+f,bottom:b+f},v))}if(y||u.classList.add("awc-veiled"),u.style.cssText=`
            width: ${f.toFixed(2)}px;
            height: ${f.toFixed(2)}px;
            left: ${m.toFixed(2)}%;
            top: ${g.toFixed(2)}%;
            opacity: ${p.toFixed(2)};
        `,!n&&Math.random()<Pu){let w=Ou+Math.random()*Du;u.classList.add("twinkle"),u.style.setProperty("--star-o",p.toFixed(2)),u.style.setProperty("--star-dim",(p*(Lu+Math.random()*Ru)).toFixed(2)),u.style.animationDuration=`${w.toFixed(2)}s`,u.style.animationDelay=`${(-Math.random()*w).toFixed(2)}s`}s[h%Ki].appendChild(u)}return Xi(o,r),l?a.insertBefore(o,l):a.appendChild(o),l?[o,l]:[o]}var ji=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=r,this.starsConfig={starCount:30,showMoon:!0,...n},k(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start stars animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Animation layer not found: ${this.layerSelector}`);let n=K(this.cardConfig,this.realWindSpeed),i=this.element.querySelector(".animated-weather-card");i?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(o=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(o),o.remove()});let r=Ra(n.cloudCount,t.clientWidth||i?.clientWidth||0);for(let o of Oa(t,r,{moon:this.starsConfig.showMoon,words:i?Ln(i):[],share:this.amounts?.stars??1}))this.addParticle(o),window.AnimatedWeatherCardGsap.fromTo(o,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"});k(this.config.devMode,`Stars animation started with ${r} stars`)}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&t.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.parentNode&&i.parentNode.removeChild(i)}),k(this.config.devMode,"Stars animation stopped")}setPaused(t){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(n=>n.classList.toggle("paused",t))}async onPause(){this.setPaused(!0),k(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),k(this.config.devMode,"Stars animation resumed")}onAmountsChange(t,n){let i=this.element.querySelector(`${this.layerSelector} .stars-field`);i&&Xi(i,this.amounts?.stars??1,n?.3:Rt)}};var Zi=class extends tt{constructor(t,n,i,r){super(t,n,i);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";k(this.config.devMode,"SunAnimation created")}async onStart(){let t=this.element.querySelector(this.layerSelector);if(!t){k(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}t.style.opacity="1",k(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.opacity="0"),k(this.config.devMode,"Sun animation stopped")}async onPause(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="paused"),k(this.config.devMode,"Sun animation paused")}async onResume(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="running"),k(this.config.devMode,"Sun animation resumed")}};var Qi=class{constructor(e,t,n,i){this.amounts=null;this.activeAnimations=new Map;this.element=e,this.config=t,this.timeOfDayManager=n,this.realWindSpeed=i}async startModularAnimation(e,t){this.activeAnimations.has(e)&&await this.stopModularAnimation(e);try{let n={intensity:t,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1,amounts:this.amounts},i=null;switch(e){case"rain":i=new Pi(this.element,{...n,isStorm:t>=2&&t<=4,isPouring:t>4,isLightRain:t<1,particleCount:Math.floor(t*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":i=new Di(this.element,{...n,particleCount:Math.floor(t*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":i=new Wi(this.element,{...n,particleCount:Math.floor(t*40)},this.config,this.realWindSpeed);break;case"wind":i=new Ni(this.element,{...n,leafCount:Math.max(1,Math.floor(t*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":i=new Ii(this.element,{...n,disableShake:this.config.disable_lightning_shake||!1,minInterval:Pn[0],maxInterval:Pn[1]},this.config,this.realWindSpeed);break;case"clouds":i=new Ui(this.element,{...n,cloudCount:Math.max(1,Math.floor(t*2)),isPartlyCloudy:t<3},this.config,this.realWindSpeed);break;case"fog":i=new Yi(this.element,{...n,layerCount:Math.max(2,Math.min(5,Math.floor(t)))},this.config,this.realWindSpeed);break;case"stars":i=new ji(this.element,{...n,starCount:Math.max(15,Math.floor(t*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":i=new Zi(this.element,n,this.config);break;default:return k(this.config.dev_mode,`No modular animation registered for type: ${e}`),null}return await i.start(),this.activeAnimations.set(e,i),k(this.config.dev_mode,`Started modular ${e} animation with intensity ${t}`),i}catch(n){return console.error(`Failed to start modular ${e} animation:`,n),null}}async stopModularAnimation(e){let t=this.activeAnimations.get(e);if(t)try{await t.destroy(),k(this.config.dev_mode,`Stopped modular ${e} animation`)}catch(n){console.error(`Error stopping modular ${e} animation:`,n)}finally{this.activeAnimations.delete(e)}}async pauseModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isActive())try{await t.pause()}catch(n){console.error(`Error pausing modular ${e} animation:`,n)}}async resumeModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isPaused())try{await t.resume()}catch(n){console.error(`Error resuming modular ${e} animation:`,n)}}updateWindSpeed(e){if(!Object.is(e,this.realWindSpeed)){this.realWindSpeed=e;for(let[t,n]of this.activeAnimations)try{n.setWindSpeed(e)}catch(i){console.warn(`Failed to update wind speed for ${t}:`,i)}}}updateAmounts(e,t=!1){if(JSON.stringify(e)!==JSON.stringify(this.amounts)){this.amounts=e;for(let[n,i]of this.activeAnimations)try{i.setAmounts(e,t)}catch(r){console.warn(`Failed to update amounts for ${n}:`,r)}}}async cleanup(){let e=Array.from(this.activeAnimations.keys()).map(t=>this.stopModularAnimation(t));await Promise.all(e),this.activeAnimations.clear()}};var Ji=class{constructor(e,t,n,i){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.homeAmounts=null;this.hourAmounts=null;this.element=e,this.config=t,this.isPausedFn=n,this.timeOfDayManager=i,this.modularBridge=new Qi(e,t,i,this.currentWindSpeed),k(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(e){this.currentWindSpeed=e,this.modularBridge.updateWindSpeed(e)}setAmounts(e){this.homeAmounts=e,this.modularBridge.updateAmounts(this.hourAmounts??e)}showAmounts(e){this.hourAmounts=e,this.modularBridge.updateAmounts(e??this.homeAmounts,!0)}get amounts(){return this.hourAmounts??this.homeAmounts}async startAnimation(e,t){let n=this.animations[e];if(n.isActive){k(this.config.dev_mode,`Animation ${e} already active \u2014 skipping`);return}let i=t?.intensity??1,r=this.generation;n.isActive=!0,n.intensity=i,this.setAnimationLayerVisibility(e,!0);try{let o=await this.modularBridge.startModularAnimation(e,i);if(r!==this.generation){k(this.config.dev_mode,`Discarding stale start for ${e} (generation drifted)`),await this.modularBridge.stopModularAnimation(e);return}if(!o){n.isActive=!1,console.warn(`No modular animation available for type: ${e}`);return}k(this.config.dev_mode,`Started ${e} animation with intensity ${i}`)}catch(o){console.error(`Failed to start ${e} animation:`,o),n.isActive=!1}}async stopAnimation(e){let t=this.animations[e];if(t.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(e),k(this.config.dev_mode,`Stopped ${e} animation`)}catch(n){console.error(`Error stopping ${e} animation:`,n)}this.setAnimationLayerVisibility(e,!1),t.isActive=!1,t.isPaused=!1,t.intensity=1}}pauseAnimation(e){let t=this.animations[e];!t.isActive||t.isPaused||(t.isPaused=!0,this.modularBridge.pauseModularAnimation(e),k(this.config.dev_mode,`Paused ${e} animation`))}resumeAnimation(e){let t=this.animations[e];!t.isActive||!t.isPaused||(t.isPaused=!1,this.modularBridge.resumeModularAnimation(e),k(this.config.dev_mode,`Resumed ${e} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(e=>this.stopAnimation(e)))}pauseAllAnimations(){Object.keys(this.animations).forEach(e=>this.pauseAnimation(e))}resumeAllAnimations(){Object.keys(this.animations).forEach(e=>this.resumeAnimation(e))}async applyWeatherCondition(e){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let t=this.defaultWeatherMappings[e.toLowerCase()];if(!t){console.warn(`No animation mapping for weather condition: ${e}`);return}await Promise.all(t.animations.map(n=>{let i=t.overrides?.[n];return this.startAnimation(n,i)})),k(this.config.dev_mode,`Applied weather condition: ${e} with animations: ${t.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(e,t){let n=this.element.querySelector(".animated-weather-card");if(!n)return;let i=`individual-${e}-active`;t?n.classList.add(i):n.classList.remove(i)}clearIndividualAnimationClasses(){let e=this.element.querySelector(".animated-weather-card");if(e)for(let t of Object.keys(this.animations))e.classList.remove(`individual-${t}-active`)}};var tr=new Map,Da=new Set;function Fa(a,e,t){let n=tr.get(a);if(!e){n&&(tr.delete(a),ul());return}let i={entity:e,sun:t||"sun.sun"};n&&n.entity===i.entity&&n.sun===i.sun||(tr.set(a,i),ul())}function hl(a){if(a){for(let e of tr.values())if(e.sun===a)return e.entity}}function ml(a){return Da.add(a),()=>{Da.delete(a)}}function ul(){for(let a of[...Da])a()}var er=a=>{if(a==null||a==="")return null;let e=typeof a=="number"?a:Number(a);return Number.isFinite(e)?e:null},de=a=>typeof a=="string"?a.trim():"";function zu(a){if(!a||typeof a!="object")return null;let e=a,t=typeof e.id=="number"?String(e.id):de(e.id);return t?{id:t,label:de(e.flight_number)||de(e.callsign),aircraftCode:de(e.aircraft_code),originCity:de(e.airport_origin_city),originCode:de(e.airport_origin_code_iata),destinationCity:de(e.airport_destination_city),destinationCode:de(e.airport_destination_code_iata),altitudeFt:er(e.altitude),groundSpeedKt:er(e.ground_speed),heading:er(e.heading),verticalSpeed:er(e.vertical_speed),onGround:e.on_ground===1||e.on_ground===!0||e.on_ground==="1"}:null}function Ha(a,e){if(!a||!e)return null;let t=a.states[e];if(!t||t.state==="unavailable"||t.state==="unknown")return null;let n=t.attributes?.flights;if(!Array.isArray(n))return[];let i=[];for(let r of n){let o=zu(r);o&&i.push(o)}return i}var nr=class{constructor(){this.known=null}get seeded(){return this.known!==null}update(e,t=!1){if(!e)return[];let n=e.filter(s=>!s.onGround),i=new Set(n.map(s=>s.id));if(this.known===null)return this.known=i,t?n.filter((s,l)=>n.findIndex(d=>d.id===s.id)===l):[];let r=[],o=new Set;for(let s of n)this.known.has(s.id)||o.has(s.id)||(o.add(s.id),r.push(s));return this.known=i,r}reset(){this.known=null}};var ir=class{constructor(e={}){this.listeners=new Set;this.config={enableDayNightCycle:e.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...e},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(e){let t=this.config.enableDayNightCycle;this.config={...this.config,...e},this.updateState(),this.config.enableDayNightCycle&&!t?this.startAutoUpdate():!this.config.enableDayNightCycle&&t&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}getTimeAwareColor(e){let t=this.getCurrentState();if(!this.isEnabled())return e.day;switch(t.timePhase){case"dawn":return e.dawn||this.blendColors(e.night,e.day,.3);case"day":return e.day;case"dusk":return e.dusk||this.blendColors(e.day,e.night,.3);case"night":return e.night;default:return e.day}}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let e=kt(),t,n;if(!this.config.useBrowserTime&&this.config.timeZone){let p=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(e);t=parseInt(p.find(m=>m.type==="hour")?.value||"0",10),n=parseInt(p.find(m=>m.type==="minute")?.value||"0",10)}else t=e.getHours(),n=e.getMinutes();let i=t+n/60,r,o=this.config.sunriseHour,s=this.config.sunsetHour,l=(o-1+24)%24,d=(o+.5)%24,c=(s-.5+24)%24,h=(s+1)%24,u=(p,m,g)=>m<=g?p>=m&&p<g:p>=m||p<g;u(i,l,d)?r="dawn":u(i,d,c)?r="day":u(i,c,h)?r="dusk":r="night";let f={isDaytime:r==="day"||r==="dawn",isNighttime:r==="night"||r==="dusk",isDawn:r==="dawn",isDusk:r==="dusk",currentHour:t,timePhase:r};!this.currentState||this.currentState.timePhase!==f.timePhase?(this.currentState=f,this.notifyListeners(f)):this.currentState=f}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},xs.UPDATE_INTERVAL)}notifyListeners(e){this.listeners.forEach(t=>{try{t(e)}catch(n){console.error("TimeOfDayManager: Error in listener callback:",n)}})}blendColors(e,t,n){let i=e.replace("#",""),r=t.replace("#",""),o=parseInt(i.substring(0,2),16),s=parseInt(i.substring(2,4),16),l=parseInt(i.substring(4,6),16),d=parseInt(r.substring(0,2),16),c=parseInt(r.substring(2,4),16),h=parseInt(r.substring(4,6),16),u=Math.round(o*(1-n)+d*n),f=Math.round(s*(1-n)+c*n),p=Math.round(l*(1-n)+h*n),m=u.toString(16).padStart(2,"0"),g=f.toString(16).padStart(2,"0"),y=p.toString(16).padStart(2,"0");return`#${m}${g}${y}`}};var fl=a=>`
        ${a} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var On={text:"#f4f6fa",fill:"rgba(12, 16, 24, 0.62)",alpha:.62,ink:[12,16,24]},Nu=nl(),Iu=jt(Ft(Ge)),Ve=a=>`${Math.round(a*100)}%`,$u=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,Gu=48,Rn=.2,qu={low:"#84ef8a",moderate:"#f2db49",high:"#ffd1a9",very_high:"#ffcdc8",extreme:"#e5d0ff"},Bu={good:"#84ef8a",moderate:"#f2db49",sensitive:"#ffd1a9",unhealthy:"#ffcdc8",very_unhealthy:"#e5d0ff",hazardous:"#fcd5e3"},pl=()=>`
${fl("animated-weather-card")}
        /* The card's own icons (icons.ts): inline SVG, sized like ha-icon and in the text's colour */
        .awc-icon {
          display: inline-block;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          fill: currentColor;
          vertical-align: middle;
        }
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
          --awc-secondary: ${$i};

          /* Public color hooks (also set by custom_colors) */
          --weather-text-color: ${Iu};
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
            ${al()};
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
        ${Nu}

        .sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
          --awc-sky-glow-layer: ${qe(Gi,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer) 0 0 / var(--awc-sky-glow-box, 100% 100%) no-repeat,
            linear-gradient(180deg, transparent ${Ve(Qs)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${Ve(Zs)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${qe(Js,"var(--awc-sky-glow)")}; }
        }
        /* A card taller than five rows keeps a five-row card's glow, around the
           sun beside the temperature, rather than a long streak down its side:
           the light is painted in a box no taller than that card, from the top
           (it fades out well inside it). Behind @supports, since a browser that
           can't read min() there would drop the whole sky. The compact strip,
           the wall, the view and the forecast card light the whole card. */
        @supports (background-size: 100% min(100%, 1px)) {
          .sky { --awc-sky-glow-box: 100% min(100%, ${qi}px); }
        }
        .animated-weather-card[data-variant="compact"] .sky,
        .animated-weather-card[data-wall-frame] .sky,
        .animated-weather-card[data-fw] .sky,
        .animated-weather-card[data-fc-view] .sky,
        .animated-weather-card[data-fc-card] .sky { --awc-sky-glow-box: 100% 100%; }

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
          background-image: ${$u};
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
        /* Seen at 16%, the sun showed through them, as if in front. Under each
           cloud rides a twin in the card's own fill (.cloud-occluder, read into
           --awc-card-bg by the clouds animation), in a layer clipped to the
           card: unseen against the card, it hides the sun behind the cloud,
           while the cloud itself, above the card and where clouds overlap,
           is drawn as it always was. Only over an opaque fill (data-occlude):
           over a see-through one or an image the twin would show. */
        .clouds-occluders { position: absolute; left: 0; right: 0; bottom: 0; top: var(--awc-cloud-overhang); clip-path: inset(0 round calc(var(--ha-card-border-radius, 12px) - var(--ha-card-border-width, 1px))); }
        .animated-weather-card:not([data-occlude]) .clouds-occluders { display: none; }
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

        /* dev_mode with no dev card on the page: a marker says the weather is simulated, on any sky or theme */
        animated-weather-card[data-awc-dev] .animated-weather-card::after,
        animated-forecast-card[data-awc-dev] .animated-weather-card::after {
          content: 'Simulated';
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 40;
          padding: 0 8px;
          border-radius: 9px;
          font: 600 11px/18px var(--awc-font);
          letter-spacing: 0.01em;
          color: ${On.text};
          background: ${On.fill};
          pointer-events: none;
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
          /* custom_colors.temperature_color, else the text's (the theme palette sets its accent below) */
          color: var(--awc-hero-color, inherit);
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

        .weather-desc, .awc-temp-lead {
          margin-top: 8px;
          font-size: 17px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: -0.012em;
        }
        /* hero: clock: the time in the temperature's place, "21\xB0 Partly cloudy" */
        .awc-hero-clock { font-variant-numeric: proportional-nums; font-feature-settings: "case" 1; letter-spacing: -0.02em; }
        .awc-hero-clock .awc-ampm { font-family: var(--awc-font); font-size: max(13px, 0.22em); font-weight: 500; letter-spacing: 0.04em; vertical-align: top; margin-left: 0.1em; position: relative; top: 0.16em; }
        .awc-lead-row { display: flex; align-items: baseline; column-gap: 12px; margin-top: 8px; min-width: 0; white-space: nowrap; }
        /* One line: the condition never wraps out of sight */
        .awc-lead-row.awc-desc-row { flex-wrap: nowrap; }
        .awc-lead-row > * { margin-top: 0 !important; align-self: baseline !important; }
        .awc-lead-row > .awc-temp-lead { flex-shrink: 0; margin-right: -6px; }
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
        ${Object.entries(qu).map(([a,e])=>`.animated-weather-card:not(.theme-colors) .attribute[data-kind="uv"][data-level="${a}"] .attribute-icon { color: ${e}; }`).join(`
        `)}
        ${Object.entries(Bu).map(([a,e])=>`.animated-weather-card:not(.theme-colors) .attribute[data-kind="aqi"][data-level="${a}"] .attribute-icon { color: ${e}; }`).join(`
        `)}

        /* \u2500\u2500 Adaptive layout: width \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        @container awc (max-width: 319px) {
          .weather-info, .weather-skeleton { --awc-pad: 16px; }
          .temperature { font-size: 64px; font-weight: 250; }
          .weather-desc, .awc-temp-lead { font-size: 16px; line-height: 21px; margin-top: 6px; }
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
          .weather-desc, .awc-temp-lead { font-size: 18px; line-height: 24px; }
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
        .animated-weather-card[data-variant="compact"] .compact-meta,
        .animated-weather-card[data-variant="compact"] .awc-lead-row {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .animated-weather-card[data-variant="compact"] .weather-desc,
        .animated-weather-card[data-variant="compact"] .awc-lead-row {
          grid-area: desc;
          align-self: end;
          margin: 0;
          font-size: 16px;
          line-height: 21px;
        }
        .animated-weather-card[data-variant="compact"] .awc-temp-lead { font-size: inherit; line-height: inherit; }
        .animated-weather-card[data-variant="compact"] .awc-lead-row { margin: 0 !important; height: auto; max-width: none; }
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
          --awc-sky-glow-layer: ${qe(tl,"var(--awc-sky-glow)")};
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
        .animated-weather-card[data-variant="compact"][data-height="tight"] :is(.weather-desc, .awc-lead-row),
        .animated-weather-card[data-variant="compact"][data-height="minimal"] :is(.weather-desc, .awc-lead-row) { align-self: center; font-size: 15px; }
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
        .animated-weather-card.condition-out .cloud-occluder,
        .animated-weather-card.condition-out .star-gsap,
        .animated-weather-card.condition-out .moon-gsap,
        .animated-weather-card.condition-out .snow-accumulation,
        .animated-weather-card.condition-out .sleet-accumulation {
          opacity: 0 !important;
          transition: opacity 0.4s cubic-bezier(0.5, 0, 0.75, 0) !important;
        }
        /* Fog always stays in the frame, corners included; overflow keeps it
           out of the page's size in Firefox (#16) */
        .animation-container.fog-container {
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
          overflow: hidden;
          overflow: clip;
        }
        /* How thick the fog is (auto mode's amounts), apart from the container's fades */
        .fog-amount { position: absolute; inset: 0; pointer-events: none; }
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
        /* Firefox would count spilled leaves in the page's size (#16) */
        @supports (-moz-appearance: none) {
          .animated-weather-card[data-spill] .wind-container { overflow: clip; }
        }

        /* Clouds drift in front of the sun, stars and planes, in their own
           layer. In the frame by default; with spill they can rise past the
           top edge, fading out over the top half of CLOUD_OVERHANG_PX. The sides and
           bottom stay closed: clouds cross the card, not the dashboard. */
        .clouds-container {
          --awc-cloud-overhang: 0px;
          z-index: 25;
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
          overflow: hidden;
          overflow: clip;
        }
        .clouds-layer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: var(--awc-cloud-overhang);
        }
        .animated-weather-card[data-spill] .clouds-container {
          --awc-cloud-overhang: ${Gu}px;
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
          top: ${Ve(Rn)};
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
          transition: opacity ${Rt/2}s ${Be};
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
        /* The sun's height follows the time of day on a track as tall as the
           card, up to a five-row card's height (a transform, so .sun keeps its
           breathing): low at dawn and dusk and below the horizon at night, so
           it sets downward and rises upward. A taller card keeps the sun and
           its setting where a five-row card has them; the slide's drop is a
           share of the same track. The compact strip, the wall (from the first
           paint: data-wall-frame) and the view place the sun on the whole card. */
        .sun-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          max-height: ${qi}px;
          pointer-events: none;
          transition: transform ${Rt}s ${Be};
        }
        .animated-weather-card[data-variant="compact"] .sun-track,
        .animated-weather-card[data-wall-frame] .sun-track,
        .animated-weather-card[data-fw] .sun-track,
        .animated-weather-card[data-fc-view] .sun-track { max-height: none; }
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
        .animated-weather-card.static .sun::before,
        .animated-weather-card.static .moon-gsap::before { animation: none; }
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
        .stars-field, .stars-band { position: absolute; inset: 0; pointer-events: none; }
        .star-gsap {
          position: absolute;
          border-radius: 50%;
          background: white;
          pointer-events: none;
        }
        .star-gsap.twinkle { animation: awcTwinkle 5s ease-in-out infinite alternate; }
        /* A star on a word would read as part of it; it steps out of sight until the word moves away */
        .star-gsap.awc-veiled { visibility: hidden; }
        @keyframes awcTwinkle {
          from { opacity: var(--star-o); }
          to { opacity: var(--star-dim); }
        }
        /* The moon takes the sun's place in the top-right, clear of the
           temperature: soft maria, a steady disc and a slowly breathing halo,
           in its real phase (moon.ts). Like the sun, no lower than on a
           five-row card; the wall places it on the whole card. */
        .moon-gsap {
          position: absolute;
          left: 84%;
          top: ${Ve(Rn)};
          top: min(${Ve(Rn)}, ${+(Rn*qi).toFixed(1)}px);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background:
            radial-gradient(circle at 38% 40%, rgba(120, 132, 160, 0.08) 0 12%, transparent 13%),
            radial-gradient(circle at 34% 30%, rgba(196, 206, 230, 0.15) 0%, rgba(170, 182, 210, 0.09) 100%);
          opacity: 0;
          pointer-events: none;
        }
        .animated-weather-card[data-wall-frame] .moon-gsap,
        .animated-weather-card[data-fw] .moon-gsap { top: ${Ve(Rn)}; }
        .moon-gsap::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 38% 40%, rgba(160, 166, 180, 0.28) 0 12%, transparent 13%),
            radial-gradient(circle at 62% 62%, rgba(160, 166, 180, 0.22) 0 9%, transparent 10%),
            radial-gradient(circle at 58% 32%, rgba(160, 166, 180, 0.16) 0 6%, transparent 7%),
            radial-gradient(circle at 34% 30%, #fbfaf4 0%, #ece8dc 55%, #cfcabc 100%);
          -webkit-mask: var(--awc-moon-mask, none) center / 100% 100% no-repeat;
          mask: var(--awc-moon-mask, none) center / 100% 100% no-repeat;
        }
        .moon-gsap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: var(--awc-moon-halo, 0 0 16px 2px rgba(226, 232, 255, 0.28), 0 0 56px 12px rgba(190, 206, 255, 0.12));
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
        .snow-webgl, .rain-webgl, .sleet-webgl { position: absolute; top: 0; pointer-events: none; }
        .snow-webgl { color: var(--weather-snow-color, #fff); }
        .sleet-webgl { color: #e8f4fd; }

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
        /* With both, the flight sits under the route, quieter */
        .plane-label > span { display: block; }
        .plane-flight { font-weight: 500; opacity: 0.72; }

`;var Wa={feels_like:"F\xF8les som",indoors:"Inne",sunrise:"Soloppgang",sunset:"Solnedgang",solar_noon:"Solens h\xF8ydepunkt",daylight:"Dagslengde",first_light:"Morgengry",last_light:"Kveldsskumring",moon:"M\xE5ne",in_duration:"om {duration}",daylight_day:"{delta} siden i g\xE5r",daylight_week:"{delta} siden forrige uke",daylight_month:"{delta} siden forrige m\xE5ned",shift_earlier:"{delta} tidligere",shift_later:"{delta} senere",shift_day:"{shift} enn i g\xE5r",shift_week:"{shift} enn forrige uke",shift_month:"{shift} enn forrige m\xE5ned",note_reading:"Leser v\xE6rmeldingen",note_writing:"Skriver notatet",uv_index:"UV-indeks",uv_low:"Lav",uv_moderate:"Moderat",uv_high:"H\xF8y",uv_very_high:"Sv\xE6rt h\xF8y",uv_extreme:"Ekstrem",rain_today:"Regn i dag",rain_now:"Regn n\xE5",dew_point:"Duggpunkt",visibility:"Sikt",cloud_cover:"Skydekke",gusts:"Vindkast",aqi:"Luftkvalitet",aqi_good:"God",aqi_moderate:"Moderat",aqi_sensitive:"Usunn for f\xF8lsomme",aqi_unhealthy:"Usunn",aqi_very_unhealthy:"Sv\xE6rt usunn",aqi_hazardous:"Farlig"},Vu={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",daylight_day:"{delta} since yesterday",daylight_week:"{delta} since last week",daylight_month:"{delta} since last month",shift_earlier:"{delta} earlier",shift_later:"{delta} later",shift_day:"{shift} than yesterday",shift_week:"{shift} than last week",shift_month:"{shift} than last month",note_reading:"Reading the forecast",note_writing:"Writing the note",uv_index:"UV index",uv_low:"Low",uv_moderate:"Moderate",uv_high:"High",uv_very_high:"Very high",uv_extreme:"Extreme",rain_today:"Rain today",rain_now:"Rain now",dew_point:"Dew point",visibility:"Visibility",cloud_cover:"Cloud cover",gusts:"Gusts",aqi:"Air quality",aqi_good:"Good",aqi_moderate:"Moderate",aqi_sensitive:"Unhealthy for some",aqi_unhealthy:"Unhealthy",aqi_very_unhealthy:"Very unhealthy",aqi_hazardous:"Hazardous"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",daylight_day:"{delta} seit gestern",daylight_week:"{delta} seit letzter Woche",daylight_month:"{delta} seit letztem Monat",shift_earlier:"{delta} fr\xFCher",shift_later:"{delta} sp\xE4ter",shift_day:"{shift} als gestern",shift_week:"{shift} als letzte Woche",shift_month:"{shift} als letzten Monat",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben",uv_index:"UV-Index",uv_low:"Niedrig",uv_moderate:"M\xE4\xDFig",uv_high:"Hoch",uv_very_high:"Sehr hoch",uv_extreme:"Extrem",rain_today:"Regen heute",rain_now:"Regen jetzt",dew_point:"Taupunkt",visibility:"Sichtweite",cloud_cover:"Bew\xF6lkung",gusts:"B\xF6en",aqi:"Luftqualit\xE4t",aqi_good:"Gut",aqi_moderate:"M\xE4\xDFig",aqi_sensitive:"Ungesund f\xFCr Empfindliche",aqi_unhealthy:"Ungesund",aqi_very_unhealthy:"Sehr ungesund",aqi_hazardous:"Gef\xE4hrlich"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",daylight_day:"{delta} desde ayer",daylight_week:"{delta} desde la semana pasada",daylight_month:"{delta} desde el mes pasado",shift_earlier:"{delta} antes",shift_later:"{delta} despu\xE9s",shift_day:"{shift} que ayer",shift_week:"{shift} que la semana pasada",shift_month:"{shift} que el mes pasado",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota",uv_index:"\xCDndice UV",uv_low:"Bajo",uv_moderate:"Moderado",uv_high:"Alto",uv_very_high:"Muy alto",uv_extreme:"Extremo",rain_today:"Lluvia hoy",rain_now:"Lluvia ahora",dew_point:"Punto de roc\xEDo",visibility:"Visibilidad",cloud_cover:"Nubosidad",gusts:"R\xE1fagas",aqi:"Calidad del aire",aqi_good:"Buena",aqi_moderate:"Moderada",aqi_sensitive:"Da\xF1ina para sensibles",aqi_unhealthy:"Da\xF1ina",aqi_very_unhealthy:"Muy da\xF1ina",aqi_hazardous:"Peligrosa"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",daylight_day:"{delta} depuis hier",daylight_week:"{delta} depuis la semaine derni\xE8re",daylight_month:"{delta} depuis le mois dernier",shift_earlier:"{delta} plus t\xF4t",shift_later:"{delta} plus tard",shift_day:"{shift} qu\u2019hier",shift_week:"{shift} que la semaine derni\xE8re",shift_month:"{shift} que le mois dernier",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note",uv_index:"Indice UV",uv_low:"Faible",uv_moderate:"Mod\xE9r\xE9",uv_high:"\xC9lev\xE9",uv_very_high:"Tr\xE8s \xE9lev\xE9",uv_extreme:"Extr\xEAme",rain_today:"Pluie aujourd\u2019hui",rain_now:"Pluie en cours",dew_point:"Point de ros\xE9e",visibility:"Visibilit\xE9",cloud_cover:"Couverture nuageuse",gusts:"Rafales",aqi:"Qualit\xE9 de l'air",aqi_good:"Bonne",aqi_moderate:"Mod\xE9r\xE9e",aqi_sensitive:"Mauvaise pour les sensibles",aqi_unhealthy:"Mauvaise",aqi_very_unhealthy:"Tr\xE8s mauvaise",aqi_hazardous:"Dangereuse"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",daylight_day:"{delta} da ieri",daylight_week:"{delta} dalla settimana scorsa",daylight_month:"{delta} dal mese scorso",shift_earlier:"{delta} prima",shift_later:"{delta} dopo",shift_day:"{shift} rispetto a ieri",shift_week:"{shift} rispetto alla settimana scorsa",shift_month:"{shift} rispetto al mese scorso",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota",uv_index:"Indice UV",uv_low:"Basso",uv_moderate:"Moderato",uv_high:"Alto",uv_very_high:"Molto alto",uv_extreme:"Estremo",rain_today:"Pioggia oggi",rain_now:"Pioggia ora",dew_point:"Punto di rugiada",visibility:"Visibilit\xE0",cloud_cover:"Copertura nuvolosa",gusts:"Raffiche",aqi:"Qualit\xE0 dell'aria",aqi_good:"Buona",aqi_moderate:"Moderata",aqi_sensitive:"Nociva per i sensibili",aqi_unhealthy:"Nociva",aqi_very_unhealthy:"Molto nociva",aqi_hazardous:"Pericolosa"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",daylight_day:"{delta} sinds gisteren",daylight_week:"{delta} sinds vorige week",daylight_month:"{delta} sinds vorige maand",shift_earlier:"{delta} eerder",shift_later:"{delta} later",shift_day:"{shift} dan gisteren",shift_week:"{shift} dan vorige week",shift_month:"{shift} dan vorige maand",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven",uv_index:"UV-index",uv_low:"Laag",uv_moderate:"Matig",uv_high:"Hoog",uv_very_high:"Zeer hoog",uv_extreme:"Extreem",rain_today:"Regen vandaag",rain_now:"Regen nu",dew_point:"Dauwpunt",visibility:"Zicht",cloud_cover:"Bewolking",gusts:"Windstoten",aqi:"Luchtkwaliteit",aqi_good:"Goed",aqi_moderate:"Matig",aqi_sensitive:"Ongezond voor gevoeligen",aqi_unhealthy:"Ongezond",aqi_very_unhealthy:"Zeer ongezond",aqi_hazardous:"Gevaarlijk"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",daylight_day:"{delta} od wczoraj",daylight_week:"{delta} od zesz\u0142ego tygodnia",daylight_month:"{delta} od zesz\u0142ego miesi\u0105ca",shift_earlier:"{delta} wcze\u015Bniej",shift_later:"{delta} p\xF3\u017Aniej",shift_day:"{shift} ni\u017C wczoraj",shift_week:"{shift} ni\u017C w zesz\u0142ym tygodniu",shift_month:"{shift} ni\u017C w zesz\u0142ym miesi\u0105cu",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki",uv_index:"Indeks UV",uv_low:"Niski",uv_moderate:"Umiarkowany",uv_high:"Wysoki",uv_very_high:"Bardzo wysoki",uv_extreme:"Ekstremalny",rain_today:"Deszcz dzi\u015B",rain_now:"Deszcz teraz",dew_point:"Punkt rosy",visibility:"Widoczno\u015B\u0107",cloud_cover:"Zachmurzenie",gusts:"Porywy",aqi:"Jako\u015B\u0107 powietrza",aqi_good:"Dobra",aqi_moderate:"Umiarkowana",aqi_sensitive:"Szkodliwa dla wra\u017Cliwych",aqi_unhealthy:"Szkodliwa",aqi_very_unhealthy:"Bardzo szkodliwa",aqi_hazardous:"Niebezpieczna"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",daylight_day:"{delta} desde ontem",daylight_week:"{delta} desde a semana passada",daylight_month:"{delta} desde o m\xEAs passado",shift_earlier:"{delta} mais cedo",shift_later:"{delta} mais tarde",shift_day:"{shift} do que ontem",shift_week:"{shift} do que na semana passada",shift_month:"{shift} do que no m\xEAs passado",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota",uv_index:"\xCDndice UV",uv_low:"Baixo",uv_moderate:"Moderado",uv_high:"Alto",uv_very_high:"Muito alto",uv_extreme:"Extremo",rain_today:"Chuva hoje",rain_now:"Chuva agora",dew_point:"Ponto de orvalho",visibility:"Visibilidade",cloud_cover:"Nebulosidade",gusts:"Rajadas",aqi:"Qualidade do ar",aqi_good:"Boa",aqi_moderate:"Moderada",aqi_sensitive:"M\xE1 para sens\xEDveis",aqi_unhealthy:"M\xE1",aqi_very_unhealthy:"Muito m\xE1",aqi_hazardous:"Perigosa"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",daylight_day:"{delta} fa\u021B\u0103 de ieri",daylight_week:"{delta} fa\u021B\u0103 de s\u0103pt\u0103m\xE2na trecut\u0103",daylight_month:"{delta} fa\u021B\u0103 de luna trecut\u0103",shift_earlier:"cu {delta} mai devreme",shift_later:"cu {delta} mai t\xE2rziu",shift_day:"{shift} dec\xE2t ieri",shift_week:"{shift} dec\xE2t s\u0103pt\u0103m\xE2na trecut\u0103",shift_month:"{shift} dec\xE2t luna trecut\u0103",note_reading:"Citesc prognoza",note_writing:"Scriu nota",uv_index:"Indice UV",uv_low:"Sc\u0103zut",uv_moderate:"Moderat",uv_high:"Ridicat",uv_very_high:"Foarte ridicat",uv_extreme:"Extrem",rain_today:"Ploaie azi",rain_now:"Ploaie acum",dew_point:"Punct de rou\u0103",visibility:"Vizibilitate",cloud_cover:"Nebulozitate",gusts:"Rafale",aqi:"Calitatea aerului",aqi_good:"Bun\u0103",aqi_moderate:"Moderat\u0103",aqi_sensitive:"Nociv\u0103 pentru sensibili",aqi_unhealthy:"Nociv\u0103",aqi_very_unhealthy:"Foarte nociv\u0103",aqi_hazardous:"Periculoas\u0103"},nb:Wa,no:Wa,nn:Wa,uk:{feels_like:"\u0412\u0456\u0434\u0447\u0443\u0432\u0430\u0454\u0442\u044C\u0441\u044F \u044F\u043A",indoors:"\u0423 \u043F\u0440\u0438\u043C\u0456\u0449\u0435\u043D\u043D\u0456",sunrise:"\u0421\u0445\u0456\u0434 \u0441\u043E\u043D\u0446\u044F",sunset:"\u0417\u0430\u0445\u0456\u0434 \u0441\u043E\u043D\u0446\u044F",solar_noon:"\u0421\u043E\u043D\u044F\u0447\u043D\u0438\u0439 \u043F\u043E\u043B\u0443\u0434\u0435\u043D\u044C",daylight:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0434\u043D\u044F",first_light:"\u0421\u0432\u0456\u0442\u0430\u043D\u043E\u043A",last_light:"\u0412\u0435\u0447\u0456\u0440\u043D\u0456 \u0441\u0443\u0442\u0456\u043D\u043A\u0438",moon:"\u041C\u0456\u0441\u044F\u0446\u044C",in_duration:"\u0447\u0435\u0440\u0435\u0437 {duration}",daylight_day:"{delta} \u0437 \u0443\u0447\u043E\u0440\u0430\u0448\u043D\u044C\u043E\u0433\u043E \u0434\u043D\u044F",daylight_week:"{delta} \u0437 \u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E \u0442\u0438\u0436\u043D\u044F",daylight_month:"{delta} \u0437 \u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E \u043C\u0456\u0441\u044F\u0446\u044F",shift_earlier:"\u043D\u0430 {delta} \u0440\u0430\u043D\u0456\u0448\u0435",shift_later:"\u043D\u0430 {delta} \u043F\u0456\u0437\u043D\u0456\u0448\u0435",shift_day:"{shift}, \u043D\u0456\u0436 \u0443\u0447\u043E\u0440\u0430",shift_week:"{shift}, \u043D\u0456\u0436 \u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E \u0442\u0438\u0436\u043D\u044F",shift_month:"{shift}, \u043D\u0456\u0436 \u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E \u043C\u0456\u0441\u044F\u0446\u044F",note_reading:"\u0410\u043D\u0430\u043B\u0456\u0437 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0443",note_writing:"\u041F\u0456\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",uv_index:"\u0423\u0424-\u0456\u043D\u0434\u0435\u043A\u0441",uv_low:"\u041D\u0438\u0437\u044C\u043A\u0438\u0439",uv_moderate:"\u041F\u043E\u043C\u0456\u0440\u043D\u0438\u0439",uv_high:"\u0412\u0438\u0441\u043E\u043A\u0438\u0439",uv_very_high:"\u0414\u0443\u0436\u0435 \u0432\u0438\u0441\u043E\u043A\u0438\u0439",uv_extreme:"\u0415\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u0438\u0439",rain_today:"\u0414\u043E\u0449 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456",rain_now:"\u0414\u043E\u0449 \u0437\u0430\u0440\u0430\u0437",dew_point:"\u0422\u043E\u0447\u043A\u0430 \u0440\u043E\u0441\u0438",visibility:"\u0412\u0438\u0434\u0438\u043C\u0456\u0441\u0442\u044C",cloud_cover:"\u0425\u043C\u0430\u0440\u043D\u0456\u0441\u0442\u044C",gusts:"\u041F\u043E\u0440\u0438\u0432\u0438",aqi:"\u042F\u043A\u0456\u0441\u0442\u044C \u043F\u043E\u0432\u0456\u0442\u0440\u044F",aqi_good:"\u0414\u043E\u0431\u0440\u0430",aqi_moderate:"\u041F\u043E\u043C\u0456\u0440\u043D\u0430",aqi_sensitive:"\u0428\u043A\u0456\u0434\u043B\u0438\u0432\u0430 \u0434\u043B\u044F \u0447\u0443\u0442\u043B\u0438\u0432\u0438\u0445",aqi_unhealthy:"\u0428\u043A\u0456\u0434\u043B\u0438\u0432\u0430",aqi_very_unhealthy:"\u0414\u0443\u0436\u0435 \u0448\u043A\u0456\u0434\u043B\u0438\u0432\u0430",aqi_hazardous:"\u041D\u0435\u0431\u0435\u0437\u043F\u0435\u0447\u043D\u0430"}};function Ue(a){return a?.locale?.language||a?.language||"en"}function Ye(a){return`${Ue(a)}|${a?.locale?.time_format??""}|${Dn(a)??""}`}function Dn(a){if(a?.locale?.time_zone!=="server")return;let e=a.config?.time_zone;if(e)try{return new Intl.DateTimeFormat("en",{timeZone:e}),e}catch{return}}function $(a,e,t={}){return Uu(Vu,a,e,t)}function Uu(a,e,t,n={}){let i=Ue(e).toLowerCase();return(a[i]?.[t]??a[i.split("-")[0]]?.[t]??a.en[t]).replace(/\{(\w+)\}/g,(o,s)=>n[s]??"")}function Yu(a){let e=a?.locale;if(!e?.time_format)return;if(e.time_format==="12")return!0;if(e.time_format==="24")return!1;let t=e.time_format==="language"?Ue(a):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(t).includes("10")}catch{return}}function Ke(a,e){if(!a)return"--";let t=new Date(a);if(isNaN(t.getTime()))return"--";try{return gl(e,{hour:"numeric",minute:"2-digit"}).format(t)}catch{return t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function gl(a,e){let t=Yu(a),n={...e,timeZone:Dn(a)};return t!==void 0&&(n.hourCycle=t?"h12":"h23"),new Intl.DateTimeFormat(a?Ue(a):void 0,n)}function yl(a,e){try{let t=gl(e,{hour:"numeric",minute:"2-digit"}).formatToParts(a),n=t.filter(r=>r.type==="dayPeriod").map(r=>r.value).join("");return{time:t.filter(r=>r.type!=="dayPeriod").map(r=>r.value).join("").trim(),period:n}}catch{return{time:a.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),period:""}}}function rr(a,e){try{let t=new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23",timeZone:Dn(e)}).formatToParts(a),n=i=>Number(t.find(r=>r.type===i)?.value??0);return n("hour")+n("minute")/60+n("second")/3600}catch{return a.getHours()+a.getMinutes()/60+a.getSeconds()/3600}}function za(a,e){let t=Math.round(Math.abs(a)*60),n=Math.floor(t/60),i=t%60,r=Ue(e),o=Intl.DurationFormat;if(o&&e)try{return new o(r,{style:"narrow"}).format(n>0?{hours:n,minutes:i}:{minutes:i})}catch{}return r.toLowerCase().split("-")[0]==="uk"?n>0?`${n}\xA0\u0433\u043E\u0434 ${i}\xA0\u0445\u0432`:`${i}\xA0\u0445\u0432`:n>0?`${n}h ${i}m`:`${i}m`}function ar(a,e,t=!0){let n=Math.round(Math.abs(a)),i=t?n===0?"\xB1":a>0?"+":"\u2212":"",r=Math.floor(n/3600),o=Math.floor(n%3600/60),s=n%60,l=r?{hours:r,minutes:o}:o?{minutes:o,seconds:s}:{seconds:s};for(let f of Object.keys(l).slice(1))l[f]||delete l[f];let d=Ue(e),c=Intl.DurationFormat;if(c&&e)try{let f=new c(d,n?{style:"narrow"}:{style:"narrow",secondsDisplay:"always"}).format(l);if(f)return i+f}catch{}let u=d.toLowerCase().split("-")[0]==="uk"?{hours:"\xA0\u0433\u043E\u0434",minutes:"\xA0\u0445\u0432",seconds:"\xA0\u0441"}:{hours:"h",minutes:"m",seconds:"s"};return i+Object.entries(l).map(([f,p])=>`${p}${u[f]}`).join(" ")}function Na(a,e){let t=Dn(e);if(t)try{let n=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(new Date(a)),i=o=>Number(n.find(s=>s.type===o)?.value),r=Date.UTC(i("year"),i("month")-1,i("day"),i("hour"),i("minute"),i("second"));if(Number.isFinite(r))return r-Math.floor(a/1e3)*1e3}catch{}return-new Date(a).getTimezoneOffset()*6e4}function Ia(a,e){let t=a.getFullYear(),n=a.getMonth()+1,i=a.getDate();try{let o=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"numeric",day:"numeric",timeZone:Dn(e)}).formatToParts(a),s=l=>Number(o.find(d=>d.type===l)?.value);[s("year"),s("month"),s("day")].every(Number.isFinite)&&([t,n,i]=[s("year"),s("month"),s("day")])}catch{}let r=new Date(Date.UTC(t,n-1,0)).getUTCDate();return Math.round((Date.UTC(t,n-1,i)-Date.UTC(t,n-2,Math.min(i,r)))/864e5)}function or(a,e){let t=a.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return t?`${M(t[1])}<span class="${e}">${M(t[2])}</span>`:M(a)}var wl=["humidity","wind","pressure","sun","uv","rain"],_l=["humidity","wind","pressure","sun"];function $a(a){let e=a.metrics,t=Array.isArray(e)?e:typeof e=="string"?e.split(","):null;if(!t)return[..._l];let n=[];for(let i of t){let r=String(i).trim().toLowerCase();wl.includes(r)&&!n.includes(r)&&n.push(r)}return n}var sr=[3,6,8,11],vl=["low","moderate","high","very_high","extreme"];function Fn(a){let e=a.uv_levels,t=Array.isArray(e)?e:typeof e=="string"?e.split(","):null;if(!t||t.length!==4)return sr;let n=t.map(i=>typeof i=="number"?i:parseFloat(String(i)));return n.every((i,r)=>isFinite(i)&&(r===0||i>n[r-1]))?n:sr}function Hn(a,e=sr){let t=Math.round(a),n=0;for(;n<4&&t>=e[n];)n++;return vl[n]}var Ku={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function ju(a,e){try{let t=a.formatEntityState?.(e);if(t&&t!==e.state)return t}catch{}return Ot(Ku,e.state)||e.state}var Ga=a=>{if(a==null||a==="")return null;let e=typeof a=="number"?a:parseFloat(String(a));return isFinite(e)?e:null};function qa(a,e){return(e.uv_entity?Ga(a?.states[e.uv_entity]?.state):null)??Ga(e.entity?a?.states[e.entity]?.attributes?.uv_index:void 0)}function bl(a,e,t){if(t===null||!isFinite(t))return{text:"--",level:null};let n=Hn(t,Fn(e));return{text:`${ft(Math.max(0,Math.round(t)),a)} ${Ba(a,n)}`,level:n}}function Ba(a,e){return $(a,`uv_${e}`)}function zn(a,e,t){let n=/\bin\b|inch/i.test(e)?2:1;return`${ft(Math.max(0,a),t,n)} ${e}`.trim()}function xe(a,e,t){let n=e?a?.states[e]:void 0,i=Ga(n?.state);return i===null?null:{value:i,unit:typeof n?.attributes?.unit_of_measurement=="string"?n.attributes.unit_of_measurement:t}}var lr=(a,e)=>$(a,e?"rain_now":"rain_today"),Xu=180;function xl(a,e){let t=e.note_entity?a?.states[e.note_entity]:void 0;if(!t)return null;let n=s=>typeof s=="string"?s.trim():"",i=t.state==="unknown"||t.state==="unavailable"?"":n(t.state),r=n(t.attributes?.[e.note_attribute||"note"]);if(!i&&!r)return null;let o=Date.parse(t.attributes?.generated_at);return{line:i||r,note:r||i,writtenAt:Number.isNaN(o)?null:o}}function Sl(a,e){let t=Number(e.note_max_age??Xu);return a.writtenAt===null||!(t>0)?null:a.writtenAt+t*6e4}function Va(a,e){return a?Qu(a,e):{temperature:"--",weatherCondition:"",location:e.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--",uv:null}}var Zu={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function Wn(a){let e=typeof a=="number"?a:typeof a=="string"?parseFloat(a):NaN;return isFinite(e)?(e%360+360)%360:typeof a=="string"?Zu[a.trim().toUpperCase()]??null:null}function je(a){return Number(a.temperature_decimals)===1?1:0}function Qu(a,e){if(!e.entity)throw new Error("Weather entity is required");let t=a.states[e.entity];if(!t)throw new Error(`Entity ${e.entity} not found`);let n;if(e.outdoor_sensor_entity){let x=a.states[e.outdoor_sensor_entity];x&&x.state&&!isNaN(parseFloat(x.state))?n=parseFloat(x.state):n=t.attributes.temperature}else n=t.attributes.temperature;let i=je(e),r=x=>ft(i?x:Math.round(x),a,i),o=n!=null&&!isNaN(n)?r(n):"--",s=ju(a,t),l=e.name||t.attributes.friendly_name||"",d=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?ft(Math.round(E),a)+"%":null},c="--";if(e.humidity_sensor_entity){let x=a.states[e.humidity_sensor_entity];c=x&&d(x.state)||d(t.attributes.humidity)||"--"}else c=d(t.attributes.humidity)||"--";let h="--",u=10,f=(x,E)=>{let L=typeof x=="number"?x:parseFloat(x);return isFinite(L)?(u=Dt(L,E||"km/h"),h=ft(Math.round(L),a)+" "+(E||"km/h"),!0):!1},p=e.wind_speed_sensor_entity?a.states[e.wind_speed_sensor_entity]:void 0;p&&f(p.state,p.attributes?.unit_of_measurement)||f(t.attributes.wind_speed,t.attributes.wind_speed_unit);let m=e.wind_direction_sensor_entity?a.states[e.wind_direction_sensor_entity]:void 0,g=Wn(m?.state)??Wn(t.attributes.wind_bearing),y=(x,E)=>{let L=typeof x=="number"?x:parseFloat(x);if(!isFinite(L))return null;let D=E.toLowerCase()==="inhg"?2:0;return ft(L,a,D)+" "+E},w=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?E:null},_="--",b=null;if(e.pressure_sensor_entity){let x=a.states[e.pressure_sensor_entity];if(x){let E=x.attributes.unit_of_measurement||"hPa",L=y(x.state,E);L&&(_=L,b=w(x.state))}if(_==="--"&&t.attributes.pressure!==void 0){let E=t.attributes.pressure_unit||"hPa";_=y(t.attributes.pressure,E)||"--",b=w(t.attributes.pressure)}}else if(t.attributes.pressure!==void 0){let x=t.attributes.pressure_unit||"hPa";_=y(t.attributes.pressure,x)||"--",b=w(t.attributes.pressure)}let v=null,C;if(e.feels_like_entity&&(C=a.states[e.feels_like_entity]?.state),C===void 0&&t.attributes.apparent_temperature!==void 0&&(C=t.attributes.apparent_temperature),C!==void 0){let x=typeof C=="number"?C:parseFloat(C);isFinite(x)&&(v=r(x)+"\xB0")}let S="--";if(e.indoor_temperature_entity){let x=a.states[e.indoor_temperature_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(S=r(parseFloat(x.state))+"\xB0")}let A="--";if(e.indoor_humidity_entity){let x=a.states[e.indoor_humidity_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(A=ft(Math.round(parseFloat(x.state)),a)+"%")}let T;if(e.sun_entity){let x=a.states[e.sun_entity];x&&(T={sunrise:x.attributes.next_rising||null,sunset:x.attributes.next_setting||null,dawn:x.attributes.next_dawn||null,dusk:x.attributes.next_dusk||null,noon:x.attributes.next_noon||null,elevation:x.attributes.elevation??null,aboveHorizon:x.state==="above_horizon"})}return{temperature:o,weatherCondition:s,location:l,humidity:c,windSpeed:h,windSpeedValue:u,windBearing:g,pressure:_,pressureValue:b,feelsLike:v,indoorTemperature:S,indoorHumidity:A,uv:qa(a,e),sun:T}}var Ju=["humidity","wind","pressure","sun","uv","rain","aqi","feels_like","dew_point","visibility","cloud_cover","gust","uv_max","rain_event","rain_week","rain_month","rain_year","sensor"],In={humidity:"humidity",wind:"wind_speed",pressure:"pressure",uv:"uv_index",feels_like:"apparent_temperature",dew_point:"dew_point",visibility:"visibility",cloud_cover:"cloud_coverage",gust:"wind_gust_speed"},Ua=["uv_max","rain_event","rain_week","rain_month","rain_year"],th=a=>a!=="sun"&&!Object.prototype.hasOwnProperty.call(In,a);var Cl=a=>typeof a=="string"&&Ju.includes(a),dr=a=>typeof a=="string"&&a.trim()?a.trim():void 0;function eh(a){if(typeof a=="string"){let l=a.trim().toLowerCase();return Cl(l)?{type:l,view:Ua.includes(l)}:null}if(!a||typeof a!="object")return null;let e=a,t=typeof e.type=="string"?e.type.trim().toLowerCase():"";if(!Cl(t))return null;let n={type:t,view:e.view===!0||Ua.includes(t)},i=dr(e.entity);i&&(n.entity=i);let r=dr(e.direction_entity);t==="wind"&&r&&(n.direction_entity=r);let o=dr(e.rate_entity);t==="rain"&&o&&(n.rate_entity=o);let s=dr(e.name);return s&&(n.name=s),n}function $n(a){let e=a.readings;if(Array.isArray(e))return e.map(eh).filter(r=>!!r);let t=[],n=r=>{let o=Object.fromEntries(Object.entries(r).filter(([,s])=>s!==void 0&&s!==""));t.push({...o,view:!!r.view||Ua.includes(r.type)})},i=$a(a);for(let r of i){if(r==="sun"){a.show_sun!==!1&&n({type:"sun"});continue}r==="humidity"?n({type:"humidity",entity:a.humidity_sensor_entity}):r==="wind"?n({type:"wind",entity:a.wind_speed_sensor_entity,direction_entity:a.wind_direction_sensor_entity}):r==="pressure"?n({type:"pressure",entity:a.pressure_sensor_entity}):r==="uv"?n({type:"uv",entity:a.uv_entity}):r==="rain"&&n({type:"rain",entity:a.rain_entity,rate_entity:a.rain_rate_entity})}!i.includes("wind")&&(a.wind_speed_sensor_entity||a.wind_direction_sensor_entity)&&n({type:"wind",entity:a.wind_speed_sensor_entity,direction_entity:a.wind_direction_sensor_entity,view:!0}),!i.includes("uv")&&a.uv_entity&&n({type:"uv",entity:a.uv_entity,view:!0}),!i.includes("rain")&&(a.rain_entity||a.rain_rate_entity)&&n({type:"rain",entity:a.rain_entity,rate_entity:a.rain_rate_entity,view:!0}),a.uv_max_entity&&n({type:"uv_max",entity:a.uv_max_entity});for(let r of["rain_event","rain_week","rain_month","rain_year"]){let o=a[`${r}_entity`];o&&n({type:r,entity:o})}return t}var Ka=["metrics","show_sun","humidity_sensor_entity","wind_speed_sensor_entity","wind_direction_sensor_entity","pressure_sensor_entity","uv_entity","uv_max_entity","rain_entity","rain_rate_entity","rain_event_entity","rain_week_entity","rain_month_entity","rain_year_entity"],Nn=a=>a?.entity&&!a.entity.startsWith("weather.")?a.entity:void 0;function Al(a){if(!Array.isArray(a.readings))return a;let e=$n(a),t=s=>e.find(l=>l.type===s),n={...a};for(let s of Ka)delete n[s];let i=t("wind"),r=t("rain"),o={humidity_sensor_entity:Nn(t("humidity")),wind_speed_sensor_entity:Nn(i),wind_direction_sensor_entity:i?.direction_entity,pressure_sensor_entity:Nn(t("pressure")),uv_entity:Nn(t("uv")),uv_max_entity:t("uv_max")?.entity,rain_entity:Nn(r),rain_rate_entity:r?.rate_entity,rain_event_entity:t("rain_event")?.entity,rain_week_entity:t("rain_week")?.entity,rain_month_entity:t("rain_month")?.entity,rain_year_entity:t("rain_year")?.entity};for(let[s,l]of Object.entries(o))l&&(n[s]=l);return n}var Tl=a=>a.map((e,t)=>({r:e,i:t})).filter(({r:e})=>!e.view&&!(th(e.type)&&!e.entity)),kl=a=>[...new Set(a.flatMap(e=>[e.entity,e.direction_entity,e.rate_entity]).filter(e=>!!e))];var Ya=[51,101,151,201,301],nh=["good","moderate","sensitive","unhealthy","very_unhealthy","hazardous"];function El(a){let e=a.aqi_levels,t=Array.isArray(e)?e:typeof e=="string"?e.split(","):null;if(!t||t.length!==5)return Ya;let n=t.map(i=>typeof i=="number"?i:parseFloat(String(i)));return n.every((i,r)=>isFinite(i)&&(r===0||i>n[r-1]))?n:Ya}function Ml(a,e=Ya){let t=Math.round(a),n=0;for(;n<5&&t>=e[n];)n++;return nh[n]}var ja=a=>{if(a==null||a==="")return null;let e=typeof a=="number"?a:parseFloat(String(a));return isFinite(e)?e:null},Pl=(a,e,t)=>{let n=t.entity?.startsWith("weather.")?t.entity:e.entity;return n?a?.states[n]:void 0},ih=(a,e)=>e.entity&&!e.entity.startsWith("weather.")?a?.states[e.entity]:void 0;function Gt(a,e,t,n,i=""){let r=ih(a,t),o=ja(r?.state);if(o!==null)return{value:o,unit:typeof r?.attributes?.unit_of_measurement=="string"?r.attributes.unit_of_measurement:i};let s=Ot(In,t.type);if(!s)return{value:null,unit:""};let l=Pl(a,e,t),d=n?l?.attributes?.[n]:void 0;return{value:ja(l?.attributes?.[s]),unit:typeof d=="string"?d:i}}var Gn=(a,e)=>e?`${a} ${e}`:a,vt="--",cr=(a,e,t)=>bn(a,`ui.card.weather.attributes.${e}`,$(a,t)),rh={temperature:"thermometer",apparent_temperature:"thermometer",humidity:"humidity",moisture:"humidity",pressure:"pressure",atmospheric_pressure:"pressure",wind_speed:"wind",precipitation:"rain",precipitation_intensity:"rain",illuminance:"noon",irradiance:"noon",aqi:"aqi",pm25:"aqi",pm10:"aqi",pm1:"aqi",carbon_dioxide:"aqi",carbon_monoxide:"aqi",nitrogen_dioxide:"aqi",ozone:"aqi",sulphur_dioxide:"aqi",volatile_organic_compounds:"aqi",volatile_organic_compounds_parts:"aqi",distance:"eye"},ah=(a,e)=>$(a,`aqi_${e}`);function oh(a,e){let t=e.sun_entity?a?.states[e.sun_entity]:void 0,n=t?.state==="above_horizon",i=t?Ke(n?t.attributes?.next_setting:t.attributes?.next_rising,a):vt;return{label:$(a,n?"sunset":"sunrise"),icon:n?"sunset":"sunrise",html:or(i,"awc-ampm"),text:i}}function Xa(a,e,t){let n=(o,s=0)=>ft(s?o:Math.round(o),a,s),i=o=>`${ft(je(e)?o:Math.round(o),a,je(e))}\xB0`,r=(o,s,l)=>({label:o,icon:s,html:M(l),text:l});switch(t.type){case"humidity":{let{value:o}=Gt(a,e,t);return r(bn(a,"ui.card.weather.attributes.humidity","Humidity"),"humidity",o===null?vt:`${n(o)}%`)}case"wind":{let{value:o,unit:s}=Gt(a,e,t,"wind_speed_unit","km/h"),l=t.direction_entity?a?.states[t.direction_entity]?.state:void 0,d=Wn(l)??Wn(Pl(a,e,t)?.attributes?.wind_bearing);return{...r(bn(a,"ui.card.weather.attributes.wind_speed","Wind"),"wind",o===null?vt:Gn(n(o),s||"km/h")),bearing:d}}case"pressure":{let{value:o,unit:s}=Gt(a,e,t,"pressure_unit","hPa"),l=s||"hPa";return{...r(bn(a,"ui.card.weather.attributes.air_pressure","Pressure"),"pressure",o===null?vt:Gn(n(o,l.toLowerCase()==="inhg"?2:0),l)),pressure:o}}case"sun":return oh(a,e);case"uv":{let{value:o}=Gt(a,e,t),s=bl(a,e,o);return{label:$(a,"uv_index"),icon:"noon",html:M(s.text),text:s.text,level:s.level}}case"rain":{let o=xe(a,t.rate_entity,"mm/h"),s=xe(a,t.entity,"mm"),l=!!o&&o.value>0,d=l?o:s;return r(lr(a,l),"rain",d?zn(d.value,d.unit,a):vt)}case"aqi":{let{value:o}=Gt(a,e,t);if(o===null)return{label:$(a,"aqi"),icon:"aqi",html:vt,text:vt,level:null};let s=Ml(o,El(e)),l=n(Math.max(0,o)),d=ah(a,s);return{label:$(a,"aqi"),icon:"aqi",html:M(`${l} ${d}`),text:`${l} ${d}`,value:l,word:d,level:s}}case"feels_like":{let{value:o}=Gt(a,e,t);return r($(a,"feels_like"),"thermometer",o===null?vt:i(o))}case"dew_point":{let{value:o}=Gt(a,e,t);return r(cr(a,"dew_point","dew_point"),"thermometer",o===null?vt:i(o))}case"visibility":{let{value:o,unit:s}=Gt(a,e,t,"visibility_unit","km");return r(cr(a,"visibility","visibility"),"eye",o===null?vt:Gn(n(o,o<10?1:0),s))}case"cloud_cover":{let{value:o}=Gt(a,e,t);return r(cr(a,"cloud_coverage","cloud_cover"),"cloud",o===null?vt:`${n(o)}%`)}case"gust":{let{value:o,unit:s}=Gt(a,e,t,"wind_speed_unit","km/h");return r(cr(a,"wind_gust_speed","gusts"),"wind",o===null?vt:Gn(n(o),s||"km/h"))}case"sensor":{let o=t.entity?a?.states[t.entity]:void 0,s=t.name||(typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name:t.entity??""),l=Ot(rh,String(o?.attributes?.device_class??""))??"pressure";if(!o||o.state==="unavailable"||o.state==="unknown")return r(s,l,vt);let d;try{d=a?.formatEntityState?.(o)}catch{}if(!d||d===o.state){let c=ja(o.state),h=typeof o.attributes?.unit_of_measurement=="string"?o.attributes.unit_of_measurement:"";d=c===null?o.state:Gn(ft(c,a,Math.min(2,(String(o.state).split(".")[1]??"").length)),h)}return r(s,l,d)}default:{let o=xe(a,t.entity,t.type==="uv_max"?"":"mm");return r(t.type,t.type==="uv_max"?"noon":"rain",o?t.type==="uv_max"?n(o.value):zn(o.value,o.unit,a):vt)}}}function Za(a){return a&&typeof a=="object"&&typeof a.action=="string"?a:void 0}function ur(a,e){return{entity:e,tap_action:Za(a?.tap_action),hold_action:Za(a?.hold_action),double_tap_action:Za(a?.double_tap_action)}}function Xe(a){return!!a&&a.action!=="none"}function Ll(a){return a.tap_action?Xe(a.tap_action):!!a.entity}function qn(a,e,t,n={}){let i=e[`${t}_action`],r=i&&Object.prototype.hasOwnProperty.call(n,i.action)?n[i.action]:void 0;if(r){r(t);return}if(t==="tap"&&!i){e.entity&&a.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.entity},bubbles:!0,composed:!0}));return}Xe(i)&&a.dispatchEvent(new CustomEvent("hass-action",{detail:{config:e,action:t},bubbles:!0,composed:!0}))}function hr(a,e,t,n={}){if(a.dataset.actionsBound)return;a.dataset.actionsBound="1";let i=null,r=!1,o,s,l=()=>{clearTimeout(o),o=void 0},d=()=>{i=null,l()},c=()=>{Xe(t().double_tap_action)?s?(clearTimeout(s),s=void 0,qn(e,t(),"double_tap",n)):s=setTimeout(()=>{s=void 0,qn(e,t(),"tap",n)},250):qn(e,t(),"tap",n)},h=u=>u.target!==a&&!!u.target?.closest?.('button, a, input, [role="slider"], [role="radio"]');a.addEventListener("pointerdown",u=>{u.button!==0||h(u)||(i={x:u.clientX,y:u.clientY},r=!1,l(),Xe(t().hold_action)&&(o=setTimeout(()=>{o=void 0,r=!0,qn(e,t(),"hold",n)},500)))}),a.addEventListener("pointermove",u=>{i&&Math.hypot(u.clientX-i.x,u.clientY-i.y)>10&&d()}),a.addEventListener("pointerup",()=>{let u=!!i&&!r;d(),u&&c()}),a.addEventListener("pointercancel",d),a.addEventListener("pointerleave",d),a.addEventListener("keydown",u=>{u.key!=="Enter"&&u.key!==" "||u.target!==a||!Ll(t())||(u.preventDefault(),qn(e,t(),"tap",n))}),a.addEventListener("contextmenu",u=>{Xe(t().hold_action)&&u.preventDefault()})}function Bn(a,e,t){Ll(e)?(a.setAttribute("role","button"),a.tabIndex=0,a.style.cursor="pointer"):(t?a.setAttribute("role",t):a.removeAttribute("role"),a.removeAttribute("tabindex"),a.style.cursor="");let n=Xe(e.hold_action);a.style.userSelect=n?"none":"",a.style.setProperty("-webkit-user-select",n?"none":""),a.style.setProperty("-webkit-touch-callout",n?"none":"")}var Qa=new Map;function Se(a,e){let t=Qa.get(a);if(t)return t;let n=new Promise((i,r)=>{let s=Array.from(document.querySelectorAll("script[src]")).find(c=>/animated-weather-card(?:\.min)?\.js/.test(c.src)),l=s?s.src.replace(/animated-weather-card(\.min)?\.js/,`${a}$1.js`):`${a}.js`,d=document.createElement("script");d.src=l,d.type="module",d.async=!0,d.onload=()=>e()?i():r(new Error(`${l} loaded but registered nothing`)),d.onerror=()=>r(new Error(`Failed to load ${l}`)),document.head.appendChild(d)});return n.catch(()=>Qa.delete(a)),Qa.set(a,n),n}function Vn(a){return Se("animated-weather-card-editor",()=>!!customElements.get(a))}var Rl={humidity:"m12.1 2.2c-4.7 6.5-7.1 10.9-7.1 13.6 0 4 3.4 7.2 7.5 7.2 4.1 0 7.5-3.2 7.5-7.2 0-2.7-2.4-7.1-7.1-13.6-.1-.1-.2-.2-.4-.2-.2 0-.3.1-.4.2",rain:"m5.16 9.5v.05h-.11c-1.69 0-3.05 1.45-3.05 3.22 0 1.78 1.36 3.23 3.05 3.23h13.24c2.6 0 4.71-2.18 4.71-4.86 0-2.69-2.11-4.87-4.71-4.87-.44 0-.87.07-1.29.18-1.07-2.09-3.19-3.45-5.55-3.45-3.48 0-6.29 2.91-6.29 6.5M18 18.5v3.89c0 .27.22.5.5.5.28 0 .5-.23.5-.5v-3.89c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v3.89c0 .27.22.5.5.5.28 0 .5-.23.5-.5v-3.89c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5",wind:"m14.4 5c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.3c1.3 0 2.3 1 2.3 2.3 0 1.2-1 2.2-2.3 2.2h-10.4c-1.3 0-2.3 1-2.3 2.3 0 1.2 1 2.2 2.3 2.2h.8c.5 0 .8-.3.8-.7 0-.5-.3-.8-.8-.8h-.8c-.5 0-.8-.3-.8-.7 0-.5.3-.8.8-.8h10.4c2.1 0 3.8-1.7 3.8-3.7 0-2.1-1.7-3.8-3.8-3.8zm6.2 3.8c0 .4.3.7.8.7.3 0 .6.3.6.7 0 .5-.3.8-.7.8h-2.5c-.5 0-.8.3-.8.7 0 .5.3.8.8.8h2.5c1.2 0 2.2-1 2.2-2.3 0-1.2-.9-2.2-2.1-2.2-.5 0-.8.3-.8.8m-12.8 5.2c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h6.1c.6 0 1.1.6 1.1 1.3 0 .6-.5 1.2-1.1 1.2h-.1c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.1c1.5 0 2.6-1.2 2.6-2.7 0-1.6-1.1-2.8-2.6-2.8zm0 0m-1-6c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h4.9c.5 0 .8-.3.8-.7 0-.5-.3-.8-.8-.8zm11.5 6.5c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h2.5c.4 0 .7.3.7.8 0 .4-.3.7-.7.7h-.8c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.8c1.2 0 2.2-1 2.2-2.2 0-1.3-1-2.3-2.2-2.3z",cloud:"m5.16 12.5v.05h-.11c-1.69 0-3.05 1.45-3.05 3.22 0 1.78 1.36 3.23 3.05 3.23h13.24c2.6 0 4.71-2.18 4.71-4.86 0-2.69-2.11-4.87-4.71-4.87-.44 0-.87.07-1.29.18-1.07-2.09-3.19-3.45-5.55-3.45-3.48 0-6.29 2.91-6.29 6.5",thermometer:"m10 5.5a2.5 2.5 0 0 1 5 0v8.7a4.6 4.6 0 1 1-5 0zm1.5 0v9.4a3.1 3.1 0 1 0 2 0v-9.4a1 1 0 0 0-2 0zm.5 4.5a.5.5 0 0 1 1 0v7h-1zm-1.1 7.9a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 1 1-3.2 0z",eye:"m2.5 12.5c2.5-5 6.5-7 10-7s7.5 2 10 7c-2.5 5-6.5 7-10 7s-7.5-2-10-7zm1.8 0c2.3 3.9 5.3 5.5 8.2 5.5s5.9-1.6 8.2-5.5c-2.3-3.9-5.3-5.5-8.2-5.5s-5.9 1.6-8.2 5.5zm5.2 0a3 3 0 1 1 6 0 3 3 0 1 1-6 0z",aqi:"m5 19.5c0-8.5 5-14 15-14.5-.5 10-6 15-14.5 15zm2 -.5l8.6-8.6-.8-.8-8.6 8.6z",pressure:"m5.1 20.9a10.5 10.5 0 1 1 14.8 0 .8.8 0 0 1-1-1 9 9 0 1 0-12.8 0 .8.8 0 0 1-1 1zm6.8-7.9l4.1-4.9a.8.8 0 0 1 1.2 1l-4.1 4.9a.8.8 0 0 1-1.2-1zm-1.5.5a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 1 1-4.2 0z",sunrise:"m6.9 15.4c0 .7.2 1.5.5 2.2h-4.7c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h5.9c.1 0 .3 0 .4-.1.3-.2.4-.7.2-1-.5-.7-.9-1.7-.9-2.5 0-2.2 1.9-4 4.2-4 2.3 0 4.2 1.8 4.2 4 0 .9-.3 1.7-.8 2.4-.1.1-.2.3-.2.5 0 .4.3.7.7.7h5.9c.9 0 .9-1.4 0-1.4h-4.6c.3-.7.4-1.4.4-2.2 0-3-2.5-5.4-5.6-5.4-3.1 0-5.6 2.4-5.6 5.4m4.9-9.7v1.9c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-1.9c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.3l-1.4 1.4c-.3.2-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.2.3-.7 0-1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m-13.8 1.1l1.4 1.3c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.6 0-1 .7-.5 1.3m15.2 5.5c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4zm9.4.6l-1.7 2c-.2.2-.2.5 0 .7.2.2.6.1.7-.1l.9-1v3.7c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-3.7l.9 1c.1.2.5.3.7.1.2-.2.2-.5 0-.7l-1.7-2c0 0-.1-.1-.1-.1-.1-.1-.2-.1-.3-.1-.1 0-.3.1-.4.2",sunset:"m11.8 14.7v2.9l-.6-.6c-.3-.3-.7-.3-1 0-.3.2-.3.7 0 .9l1.8 1.8c0 .1.1.2.2.2.1.1.2.1.3.1.1 0 .2 0 .3-.1.1 0 .2-.1.3-.2l1.7-1.8c.3-.2.3-.7 0-.9-.3-.3-.7-.3-1 0l-.6.6v-2.9c0-.5-.4-.7-.7-.7-.3 0-.7.2-.7.7m-4.9-1.8c0 .7.1 1.4.4 2.1h-4.6c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h5.9c.4 0 .7-.3.7-.7 0-.1 0-.1 0-.1 0-.2-.1-.3-.2-.5-.5-.8-.8-1.6-.8-2.3 0-2.5 1.9-4.4 4.2-4.4 2.3 0 4.2 1.9 4.2 4.4 0 .8-.3 1.5-.8 2.3-.1.2-.2.3-.2.5 0 0 0 0 0 .1 0 .4.3.7.7.7h5.9c.9 0 .9-1.5 0-1.5h-4.6c.3-.7.4-1.4.4-2.1 0-3.3-2.5-5.9-5.6-5.9-3.1 0-5.6 2.6-5.6 5.9",indoor:"m13.4 3.5l7.7 6.5a1.4 1.4 0 0 1 .5 1.1v9.1a1.4 1.4 0 0 1-1.4 1.4h-15.4a1.4 1.4 0 0 1-1.4-1.4v-9.1a1.4 1.4 0 0 1 .5-1.1l7.7-6.5a1.4 1.4 0 0 1 1.8 0zm-2 6.1v5.2a2.4 2.4 0 1 0 2.2 0v-5.2a1.1 1.1 0 0 0-2.2 0z",alert:"m5.2 12.5c-1.8.1-3.2 1.5-3.2 3.3 0 1.8 1.4 3.2 3.2 3.2h12.5c.1 0 .2 0 .2 0 .2 0 .3 0 .4 0 2.6 0 4.7-2.2 4.7-4.9 0-2.6-2.1-4.8-4.7-4.8-.4 0-.9 0-1.3.2-1.1-2.1-3.2-3.5-5.6-3.5-3.4 0-6.2 2.9-6.2 6.5m6.6-3.1a.8.8 0 0 1 1.5 0v4a.8.8 0 0 1-1.5 0zm-.1 6.5a.8.8 0 1 1 1.6 0 .8.8 0 1 1-1.6 0z",noon:"m7 12.5c0 3 2.5 5.5 5.5 5.5 3 0 5.5-2.5 5.5-5.5 0-3-2.5-5.5-5.5-5.5-3 0-5.5 2.5-5.5 5.5m4.8-9.8v2c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-2c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.4l-1.4 1.4c-.3.2-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.3.3-.7 0-1-.1-.2-.3-.2-.5-.2-.2 0-.4 0-.5.2m-13.8 0c-.3.3-.3.7 0 1l1.4 1.4c.7.7 1.7-.3 1-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m15.2 6.7c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4zm14.8 5.7c-.3.3-.3.7 0 1l1.4 1.4c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.2-.3-.2-.5-.2-.2 0-.4 0-.5.2m-11 0l-1.4 1.4c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.3.3-.7 0-1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m5.3 2.8v2c0 .9 1.4.9 1.4 0v-2c0-.5-.3-.7-.7-.7-.4 0-.7.2-.7.7",daylight:"m7.4 5h10.2a.9.9 0 0 1 .9.9v1.4a.9.9 0 0 1-.2.5l-3.1 4.2a.9.9 0 0 1 0 1l3.1 4.2a.9.9 0 0 1 .2.5v1.4a.9.9 0 0 1-.9.9h-10.2a.9.9 0 0 1-.9-.9v-1.4a.9.9 0 0 1 .2-.5l3.1-4.2a.9.9 0 0 1 0-1l-3.1-4.2a.9.9 0 0 1-.2-.5v-1.4a.9.9 0 0 1 .9-.9zm.6 2.1l4.1 5.4-4.1 5.4v.6h9v-.6l-4.1-5.4 4.1-5.4v-.6h-9zm-3-3.4h15a.8.8 0 0 1 0 1.5h-15a.8.8 0 0 1 0-1.5zm0 16.2h15a.8.8 0 0 1 0 1.5h-15a.8.8 0 0 1 0-1.5zm5.9-11h3.2a.4.4 0 0 1 .3.7l-1.6 1.7a.4.4 0 0 1-.6 0l-1.6-1.7a.4.4 0 0 1 .3-.7zm1.9 6.1l2.5 2.9a.4.4 0 0 1-.3.7h-5a.4.4 0 0 1-.3-.7l2.5-2.9a.4.4 0 0 1 .6 0z","first-light":"m6.9 15.9c0 .7.1 1.4.4 2.1h-4.6c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h19.6c.9 0 .9-1.5 0-1.5h-4.5c.2-.6.3-1.3.3-2.1 0-3.3-2.5-5.9-5.6-5.9-3.1 0-5.6 2.6-5.6 5.9m4.9-9.2v1.9c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-1.9c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.3l-1.4 1.4c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1.4-1.3c.3-.3.3-.8 0-1.1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m-13.8 0c-.3.3-.3.8 0 1.1l1.4 1.3c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m15.2 6.6c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4z","last-light":"m12 3.5c-4.8.3-8.5 4.2-8.5 9 0 5 4.1 9 9.2 9 3.3 0 6.3-1.7 7.9-4.5.2-.3 0-.7-.4-.7-.2.1-.4.1-.6.1-4.5 0-8.3-3.7-8.3-8.2 0-1.5.4-2.9 1.1-4.1.2-.3 0-.6-.3-.6 0 0-.1 0-.1 0","moon-new":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0z","moon-waxing-crescent":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21 5.8 10.5 0 0 0 0-21z","moon-first-quarter":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21v-21z","moon-waxing-gibbous":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21 4.2 10.5 0 0 1 0-21z","moon-full":"m2 12.5c0 5.8 4.7 10.5 10.5 10.5 5.8 0 10.5-4.7 10.5-10.5 0-5.8-4.7-10.5-10.5-10.5-5.8 0-10.5 4.7-10.5 10.5m9-6.5c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m5 4c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m-11 4c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m7-8c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1m-6 8c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1m11-4c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1","moon-waning-gibbous":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21 4.2 10.5 0 0 1 0 21z","moon-last-quarter":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21v21z","moon-waning-crescent":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21 5.8 10.5 0 0 0 0 21z"};function Ce(a,e){return`<svg class="${e} awc-icon" data-icon="${a}" viewBox="0 0 25 25" aria-hidden="true" focusable="false"><path d="${Rl[a]}"/></svg>`}function Ol(a,e){!a||a.getAttribute("data-icon")===e||(a.setAttribute("data-icon",e),a.firstElementChild?.setAttribute("d",Rl[e]))}var sh=29.530588853,lh=Date.UTC(2e3,0,6,18,14),dh={new_moon:[-.5,.5],waxing_crescent:[.5,6.5],first_quarter:[6.5,7.5],waxing_gibbous:[7.5,13.5],full_moon:[13.5,14.5],waning_gibbous:[14.5,20.5],last_quarter:[20.5,21.5],waning_crescent:[21.5,27.5]};function Dl(a,e){let n=((a.getTime()-lh)/864e5/sh%1+1)%1,i=e?Ot(dh,e):void 0;if(!i)return n;let r=n*28;return r>=27.5&&(r-=28),r=Math.min(i[1],Math.max(i[0],r)),(r/28%1+1)%1}function Fl(a,e=!1){let t=Math.cos(2*Math.PI*a),n=(1-t)/2,i=a<.5!==e,r=n<.5,o=(Math.abs(t)*50).toFixed(1),s=i===r?1:0,l=i?130:-30,c=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><filter id='s' x='-1' y='-1' width='3' height='3'><feGaussianBlur stdDeviation='2.5'/></filter><path filter='url(#s)' d='${`M50 -30L50 0A${o} 50 0 0 ${s} 50 100L50 130L${l} 130L${l} -30Z`}'/></svg>`,h=.3+.7*n;return{mask:`url("data:image/svg+xml,${encodeURIComponent(c)}")`,halo:`0 0 16px 2px rgba(226, 232, 255, ${(.28*h).toFixed(3)}), 0 0 56px 12px rgba(190, 206, 255, ${(.12*h).toFixed(3)})`}}var Q=Math.PI/180,Yn=6e4,bt=864e5;function Ja(a){let e=(a/bt+24405875e-1-2451545)/36525,t=(280.46646+e*(36000.76983+e*3032e-7))%360,n=357.52911+e*(35999.05029-1537e-7*e),i=.016708634-e*(42037e-9+1267e-10*e),r=Math.sin(n*Q)*(1.914602-e*(.004817+14e-6*e))+Math.sin(2*n*Q)*(.019993-101e-6*e)+Math.sin(3*n*Q)*289e-6,o=125.04-1934.136*e,s=t+r-.00569-.00478*Math.sin(o*Q),l=23+(26+(21.448-e*(46.815+e*(59e-5-e*.001813)))/60)/60+.00256*Math.cos(o*Q),d=Math.asin(Math.sin(l*Q)*Math.sin(s*Q)),c=Math.tan(l/2*Q)**2,h=4/Q*(c*Math.sin(2*t*Q)-2*i*Math.sin(n*Q)+4*i*c*Math.sin(n*Q)*Math.cos(2*t*Q)-.5*c*c*Math.sin(4*t*Q)-1.25*i*i*Math.sin(2*n*Q));return{declination:d,equationOfTime:h}}function Wl(a,e,t){let{declination:n,equationOfTime:i}=Ja(a.getTime()),o=((a.getUTCHours()*60+a.getUTCMinutes()+a.getUTCSeconds()/60+a.getUTCMilliseconds()/6e4+i+4*t)%1440+1440)%1440/4-180,s=Math.sin(e*Q)*Math.sin(n)+Math.cos(e*Q)*Math.cos(n)*Math.cos(o*Q);return 90-Math.acos(Math.max(-1,Math.min(1,s)))/Q}function zl(a,e){let t=a+(720-4*e)*Yn,{equationOfTime:n}=Ja(t),i=a+(720-4*e-n)*Yn;return{noon:i,declination:Ja(i).declination}}var ch=-.833;function Un(a,e){let t=Math.floor(e/bt)*bt,n=NaN;for(let i=-1;i<=1;i++){let r=zl(t+i*bt,a).noon;Math.abs(r-e)>=Math.abs(n-e)||(n=r)}return n}function to(a,e,t){let n=l=>Wl(new Date(l),a,e)>ch,i=t-bt/2,r=t+bt/2,o=n(t);if(!o)return{up:o,start:i,end:r,rise:null,set:null};let s=(l,d)=>{for(let c=0;c<24;c++){let h=(l+d)/2;n(h)?d=h:l=h}return(l+d)/2};return{up:o,start:i,end:r,rise:n(i)?null:s(i,t),set:n(r)?null:s(r,t)}}function Hl(a,e,t){let n=to(a,e,Un(e,t));return n.up?n.rise===null&&n.set===null?{minutes:1440,polar:!0}:{minutes:((n.set??n.end)-(n.rise??n.start))/Yn,polar:!1}:{minutes:0,polar:!0}}function Nl(a,e,t,n,i){let r=Un(e,t),o=null,s=r;for(let d of[r-bt,r,r+bt]){let c=to(a,e,Un(e,d))[n];c!==null&&(o===null||Math.abs(c-t)<Math.abs(o-t))&&(o=c,s=Un(e,d))}if(o===null)return null;let l=to(a,e,Un(e,s-i*bt))[n];return l===null?null:{now:o,then:l}}function Il(a,e,t,n){let i=Hl(a,e,t);return i.polar?null:Math.round((i.minutes-Hl(a,e,t-n*bt).minutes)*60)}function $l(a,e,t=kt()){let n=t.getTime(),i=Math.floor(n/bt)*bt,r={noon:[],midnight:[],rising:[],setting:[],dawn:[],dusk:[]},o=a*Q;for(let m=-1;m<=2;m++){let{noon:g,declination:y}=zl(i+m*bt,e);r.noon.push(g),r.midnight.push(g+bt/2);for(let[w,_,b]of[[-.833,"rising","setting"],[-6,"dawn","dusk"]]){let v=(Math.sin(w*Q)-Math.sin(o)*Math.sin(y))/(Math.cos(o)*Math.cos(y));if(!(Math.abs(v)<=1))continue;let C=Math.acos(v)/Q*4;r[_].push(g-C*Yn),r[b].push(g+C*Yn)}}let s=m=>m.filter(g=>g>n).sort((g,y)=>g-y)[0]??null,l=m=>m===null?null:new Date(m).toISOString(),d=Wl(t,a,e),c=s(r.rising),h=s(r.setting),u=s(r.noon),f=s(r.midnight);return{state:(h!==null&&c!==null?h<c:h!==null?!0:c!==null?!1:d>-.833)?"above_horizon":"below_horizon",attributes:{next_dawn:l(s(r.dawn)),next_dusk:l(s(r.dusk)),next_midnight:l(f),next_noon:l(u),next_rising:l(c),next_setting:l(h),elevation:Math.round(d*100)/100,rising:u!==null&&f!==null?u<f:!1}}}var Gl=a=>typeof a=="number"?a:typeof a=="string"&&a.trim()?Number(a):NaN;function uh(a){let e=a.latitude!==void 0&&a.latitude!==null&&a.latitude!=="",t=a.longitude!==void 0&&a.longitude!==null&&a.longitude!=="",n=typeof a.time_zone=="string"&&a.time_zone.trim()?a.time_zone.trim():void 0;if(!e&&!t&&!n)return null;let i,r;if(e||t){if(i=Gl(a.latitude),r=Gl(a.longitude),!e||!t)throw new Error("latitude and longitude go together: set both, or neither");if(!(i>=-90&&i<=90))throw new Error(`latitude must be a number between -90 and 90 (got ${a.latitude})`);if(!(r>=-180&&r<=180))throw new Error(`longitude must be a number between -180 and 180 (got ${a.longitude})`)}if(n)try{new Intl.DateTimeFormat("en",{timeZone:n})}catch{throw new Error(`time_zone must be a time zone name, such as Europe/Rome (got ${n})`)}let o=l=>String(Math.round(l*1e4)).replace("-","m"),s=i!==void 0&&r!==void 0?`sun.awc_${o(i)}_${o(r)}`:void 0;return{latitude:i,longitude:r,timeZone:n,sunId:s,key:`${s??""}|${n??""}`}}function hh(a,e,t,n=[]){let i=a;if(i.awcPlace===e.key)return a;let r=i.awcHome??a,o=Object.create(r);if(e.sunId&&t){let s=Object.create(r.states);s[e.sunId]=t;let l=t.state==="above_horizon"?"sunny":"clear-night";for(let d of n){let c=d?r.states[d]:void 0;d&&c&&(c.state==="sunny"||c.state==="clear-night")&&c.state!==l&&(s[d]={...c,state:l})}o.states=s}return o.config={...r.config,...e.latitude!==void 0?{latitude:e.latitude,longitude:e.longitude}:{},...e.timeZone?{time_zone:e.timeZone}:{}},e.timeZone&&(o.locale={...r.locale??{},time_zone:"server"}),o.awcPlace=e.key,o.awcHome=r,o}function mh(a,e=kt()){if(!a.sunId||a.latitude===void 0||a.longitude===void 0)return;let t=$l(a.latitude,a.longitude,e),n=e.toISOString();return{entity_id:a.sunId,state:t.state,attributes:{...t.attributes,friendly_name:"Sun"},last_changed:n,last_updated:n,context:{id:"",parent_id:null,user_id:null}}}var Ze=class{constructor(e=()=>[]){this.weather=e;this.place=null;this.timer=0}set(e){let t=uh(e),n=(t?.key??"")!==(this.place?.key??"");return this.place=t,n&&(this.sun=void 0),n}see(e){if(!this.place)return e;let t=Math.floor(ve()/6e4);if(this.place.sunId&&this.sun?.minute!==t){let n=mh(this.place);this.sun=n?{minute:t,entity:n}:void 0}return hh(e,this.place,this.sun?.entity,this.weather())}tick(e){this.stop(),this.place?.sunId&&(this.timer=window.setInterval(e,6e4))}stop(){this.timer&&window.clearInterval(this.timer),this.timer=0}};var ql=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function Bl(a){let e=a.color_palette||"default",t=a.custom_colors||{},n="";if(e!=="theme"){let r=c=>{if(typeof c!="string"||!ql.test(c))return null;let h=c.replace("#","");h.length===3&&(h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]);let u=parseInt(h,16);return{r:u>>16&255,g:u>>8&255,b:u&255}},o=(c,h,u)=>"#"+(c<<16|h<<8|u).toString(16).padStart(6,"0"),s=(c,h)=>{let u=r(c);if(!u)return c;let f=1-h/100;return o(Math.max(0,Math.floor(u.r*f)),Math.max(0,Math.floor(u.g*f)),Math.max(0,Math.floor(u.b*f)))},l=(c,h)=>{let u=r(c);if(!u)return c;let f=h/100;return o(Math.min(255,Math.floor(u.r+(255-u.r)*f)),Math.min(255,Math.floor(u.g+(255-u.g)*f)),Math.min(255,Math.floor(u.b+(255-u.b)*f)))},d=(c,h)=>{let u=t[c];if(!u||typeof u!="string"||!ql.test(u))return;let f=l(u,12),p=s(u,22);n+=`--weather-${h}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${f} 0%, ${u} 55%, ${p} 100%); `};d("sunny_bg","sunny"),d("rainy_bg","rainy"),d("snowy_bg","snowy"),d("stormy_bg","stormy"),d("windy_bg","windy"),d("cloudy_bg","cloudy")}let i=(r,o)=>{r&&vn(r)&&(n+=o.replace(/\$\{value\}/g,r))};return i(t.text_color,"--weather-text-color: ${value} !important; "),i(t.temperature_color,"--awc-hero-color: ${value} !important; "),i(t.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),i(t.rain_color,"--weather-rain-color: ${value} !important; "),i(t.snow_color,"--weather-snow-color: ${value} !important; "),n}var Qe="animated-weather-card-hour";var Je="animated-weather-card-dev",Vl="weather.awc_dev";function Kn(a){return a.awcDevBase??a}function fr(a,e){let t=Kn(a),n=window.AnimatedWeatherCardDev;if(!n||!e)return t;try{return n.wants(e)?n.lens(t,e):t}catch(i){return console.warn("Animated Weather Card: the dev card's world failed",i),t}}function jn(a){if(!a)return!1;let e=window.AnimatedWeatherCardDev;if(!e)return!!a.dev_mode;try{return e.wants(a)}catch{return!!a.dev_mode}}function pr(){return window.AnimatedWeatherCardDev?.offset??0}function tn(){return window.AnimatedWeatherCardsOnPage??(window.AnimatedWeatherCardsOnPage=new Set)}function Xn(){return window.AnimatedWeatherCardDevCards?Promise.resolve():Se("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevCards)}var mr=class extends HTMLElement{setConfig(e){this.devCardConfig={...e},this.view?.update()}set hass(e){this.devCardHass=e,this.view?.update()}connectedCallback(){if(this.view){this.view.connected();return}Xn().then(()=>{this.isConnected&&!this.view&&(this.view=window.AnimatedWeatherCardDevCards.attach(this))}).catch(e=>{console.warn(`Animated Weather Card: ${e.message}`),this.view||(this.innerHTML=`<ha-card style="display:block;padding:16px;line-height:20px">The dev card needs animated-weather-card-dev.js from the same build, beside animated-weather-card.js. Copy it in, change the resource's ?v= and reload.</ha-card>`)})}disconnectedCallback(){this.view?.disconnected()}getCardSize(){return 8}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}};var Ul={horizon:196,peak:34,trough:276,twilightRy:78},Yl={horizon:200,peak:96,trough:262,twilightRy:44};function eo(a,e,t){let n=t-e;if(n<=0||n>=24)return 0;if(a>=e&&a<=t)return Math.sin(Math.PI*(a-e)/n);let i=((a-t)%24+24)%24;return-Math.sin(Math.PI*i/(24-n))}var no=(a,e=!1)=>e?1-a/24:a/24,Ae=(a,e=!1)=>no(a,e)*1e3,io=(a,e)=>a>=0?e.horizon-a*(e.horizon-e.peak):e.horizon-a*(e.trough-e.horizon);var Xl={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"},fh={new_moon:"moon-new",waxing_crescent:"moon-waxing-crescent",first_quarter:"moon-first-quarter",waxing_gibbous:"moon-waxing-gibbous",full_moon:"moon-full",waning_gibbous:"moon-waning-gibbous",last_quarter:"moon-last-quarter",waning_crescent:"moon-waning-crescent"};function ph(a){return Ot(fh,a)??"last-light"}function ro(a,e){let t=i=>i.startsWith("sensor.")&&Ot(Xl,e.states[i]?.state)!==void 0,n=e?t("sensor.moon_phase")?"sensor.moon_phase":Object.keys(e.states).find(t):"sensor.moon_phase";return n?{sun_entity:a,moon_entity:n}:{sun_entity:a}}var gh=124,Kl=16;function yh(a,e){if(a<1)return 1;let t=Math.max(2,Math.floor((e+Kl)/(gh+Kl))),n=Math.ceil(a/t);return Math.ceil(a/n)}function wh(a,e,t){if(e==="none")return null;let n=a?.config?.latitude,i=a?.config?.longitude;if(typeof n!="number"||typeof i!="number"||!Number.isFinite(n)||!Number.isFinite(i))return null;let r=e==="week"||e==="month"?e:"day",o=r==="week"?7:r==="month"?Ia(t,a):1,s=t.getTime()+(12-rr(t,a))*36e5,l=Il(n,i,s,o);if(l===null)return null;let d="\0",[c="",h=""]=$(a,r==="week"?"daylight_week":r==="month"?"daylight_month":"daylight_day",{delta:d}).split(d);return{before:c,figure:ar(l,a),after:h}}function _h(a,e,t,n){if(e==="none"||!n)return null;let i=a?.config?.latitude,r=a?.config?.longitude;if(typeof i!="number"||typeof r!="number"||!Number.isFinite(i)||!Number.isFinite(r))return null;let o=Date.parse(n);if(!Number.isFinite(o))return null;let s=e==="week"?7:e==="month"?Ia(new Date(o),a):1,l=Nl(i,r,o,t,s);if(!l)return null;let d=l.now-l.then-s*864e5+Na(l.now,a)-Na(l.then,a),c=Math.round(d/1e3);return c===0?null:c}function vh(a,e,t,n){let i=[];for(let r=0;r<=240;r++){let o=r/10;i.push(`${Ae(o,n).toFixed(1)},${io(eo(o,a,e),t).toFixed(1)}`)}return"M"+i.join(" L")}function yr(a,e){if(!a)return 0;let t=new Date(a);return isNaN(t.getTime())?0:rr(t,e)}var bh=a=>or(a,"st-ampm");Vi();var jl=jt(Ft(Ge)),xh=`
    :host([data-awc-dev]) .st-card::after {
        content: 'Simulated';
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 5;
        padding: 0 8px;
        border-radius: 9px;
        font-size: 11px;
        line-height: 18px;
        font-weight: 600;
        letter-spacing: 0.01em;
        color: ${On.text};
        background: ${On.fill};
        pointer-events: none;
    }
    /* The compact strip's next event sits in its top right: the marker takes the bottom corner */
    :host([data-awc-dev]) .st-card.compact::after { top: auto; bottom: 8px; }
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
        --st-text: ${jl};
        --st-secondary: ${jl};
        --st-secondary-opacity: ${$i};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${qe(Gi,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${Pa.map(a=>`${a} ${Rt}s ${Be}`).join(", ")};
    }
    .st-card.following { transition: none; }

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
    /* The tracker's icons (icons.ts): inline SVG, sized like ha-icon and in the text's colour */
    .st-eyebrow .awc-icon,
    .st-metric-label .awc-icon {
        --mdc-icon-size: 13px;
        display: inline-block;
        width: var(--mdc-icon-size);
        height: var(--mdc-icon-size);
        fill: currentColor;
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
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    /* How much earlier or later the sunrise or sunset is, after the countdown: in words, or the signed figure where
       they don't fit, or nothing (_fit). What it's compared with is its tooltip, and screen readers hear it all.
       Never cut short, never on a second line */
    .st-shift-sign { display: none; }
    .st-shift[data-form="sign"] .st-shift-sign { display: inline; }
    .st-shift-period,
    .st-shift[data-form="sign"] .st-shift-words {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .st-shift[hidden] { display: none; }

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
    .st-card:not(.sky) .st-eyebrow .awc-icon,
    .st-card:not(.sky) .st-metric-label .awc-icon {
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
    /* How much the daylight changed, quiet after its value on the same line, so the details take no more room. Its
       words show where the column has room for them; where it doesn't, the figure stands alone and the words stay for
       screen readers; where even that doesn't fit, it's left out (_fit). Never cut short. */
    .st-delta {
        margin-left: 0.5em;
        font-size: 13px;
        /* Its own smaller line box, so the value's line keeps its height */
        line-height: 1;
        font-weight: 400;
        letter-spacing: 0;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    .st-delta[data-words="off"] .st-delta-words {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .st-delta[hidden] { display: none; }

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
`,ao=class extends HTMLElement{constructor(){super();this.config={};this._place=new Ze(()=>[this.config?this._weatherId():void 0]);this._path=null;this._link=null;this._onHour=t=>this._follow(t.detail);this.devKind="tracker";this._onDev=()=>{this.toggleAttribute("data-awc-dev",jn(this.config)),this._homeHass&&this.isConnected&&(this.hass=this._homeHass);let t=pr();t!==this._devClock&&(this._devClock=t,this._render())};this._devClock=0;this._shadow=this.attachShadow({mode:"open"})}devConfig(){return this.config}_see(t){return this._place.see(fr(t,this.config))}setConfig(t){let n=this._place.set(t),i=this._place.place?.sunId;if(!t.sun_entity&&!i&&!t.dev_mode)throw new Error("Please define a sun_entity (e.g. sun.sun), or the latitude and longitude of a place");let r=!!this.config.dev_mode!=!!t.dev_mode;this.config={...t,sun_entity:i||t.sun_entity||"sun.sun"},this.toggleAttribute("data-awc-dev",jn(this.config)),t.dev_mode&&Xn().then(this._onDev).catch(o=>console.warn(`Animated Weather Card: ${o.message}`)),(n||r)&&this._homeHass&&(this._hass=this._see(this._homeHass)),this._render()}set hass(t){this._homeHass=Kn(t),t=this._see(t);let n=this.config.sun_entity||"",i=this.config.moon_entity||"",r=this._hass?.states[n],o=t.states[n],s=this._hass?.states[i]?.state,l=t.states[i]?.state,d=Ye(this._hass)!==Ye(t),c=this._weatherId()||"",h=c&&this._hass?.states[c]?.state!==t.states[c]?.state;this._hass=t;let u=r?.attributes?.elevation,f=o?.attributes?.elevation;(!r||r.state!==o?.state||r.attributes?.next_rising!==o?.attributes?.next_rising||r.attributes?.next_setting!==o?.attributes?.next_setting||Math.abs((u||0)-(f||0))>=.5||i&&s!==l||d||h)&&this._render()}connectedCallback(){this._clock||(this._clock=setInterval(()=>{this._homeHass&&this._place.place&&(this._hass=this._see(this._homeHass)),this._render()},6e4)),window.addEventListener(Qe,this._onHour),window.addEventListener(Je,this._onDev),tn().add(this),this._unshare||(this._unshare=ml(()=>{this._weatherId()!==this._drawnWeather&&this._render()})),!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._fit()),this._resizeObserver.observe(this))}disconnectedCallback(){this._clock&&clearInterval(this._clock),this._clock=void 0,window.removeEventListener(Qe,this._onHour),window.removeEventListener(Je,this._onDev),tn().delete(this),this._unshare?.(),this._unshare=void 0,this._link=null,this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_fit(){let t=this._shadow.querySelector(".st-card");if(!t)return;let n=t.querySelector(".st-metrics"),i=t.querySelector(".st-delta");for(let r of["regular","compact","short","tight"]){if(t.dataset.fit=r,this._fitShift(t),n){let o=Array.from(n.children).filter(s=>getComputedStyle(s).display!=="none").length;n.style.setProperty("--st-cols",String(yh(o,n.clientWidth)))}if(i?.parentElement){let o=i.parentElement,s=()=>o.scrollWidth>o.clientWidth+.5;i.hidden=!1,delete i.dataset.words,s()&&(i.dataset.words="off"),s()&&(i.hidden=!0)}if(t.scrollHeight<=t.clientHeight+1)return}}_shiftHtml(t,n){let i=this.config.daylight_delta,r=$(n,t<0?"shift_earlier":"shift_later",{delta:ar(t,n,!1)}),o="\0",s=$(n,i==="week"?"shift_week":i==="month"?"shift_month":"shift_day",{shift:o}),[l="",d=""]=s.split(o),c=h=>h?`<span class="st-shift-period">${M(h)}</span>`:"";return`<span class="st-shift" title="${M(l+r+d)}"><span class="st-shift-sep" aria-hidden="true"> \xB7 </span>${c(l)}<span class="st-shift-words">${M(r)}</span>${c(d)}<span class="st-shift-sign" aria-hidden="true">${M(ar(t,n))}</span></span>`}_fitShift(t){let n=t.querySelector(".st-shift"),i=n?.parentElement;if(!n||!i||(n.hidden=!1,getComputedStyle(i).display==="none"))return;let r=i.clientWidth;t.classList.contains("compact")&&(n.hidden=!0,r=(t.querySelector(".st-hero")?.getBoundingClientRect().width??i.clientWidth)+Math.min(40,.08*t.clientWidth),n.hidden=!1);for(let o of["words","sign"])if(n.dataset.form=o,i.scrollWidth<=r+.5)return;n.hidden=!0}_actions(){let t=this.config.sun_entity===this._place.place?.sunId?void 0:this.config.sun_entity;return ur(this.config,t)}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}_weatherId(){return this.config.weather_entity||hl(this.config.sun_entity)}_skyCondition(t){let n=this._weatherId(),i=n?this._hass?.states[n]?.state:void 0;if(i&&i!=="unavailable"&&i!=="unknown"){let r=xn(i,void 0,void 0,this._hass?.config?.time_zone,{night:t==="night"});if(Ma.includes(r))return r}return t==="night"?"clear-night":"sunny"}static async getConfigElement(){return customElements.get("animated-sun-tracker-editor")||await Vn("animated-sun-tracker-editor"),document.createElement("animated-sun-tracker-editor")}static getStubConfig(t,n=[],i=[]){let r=[...n,...i,...Object.keys(t?.states??{})];return ro(r.find(o=>o.startsWith("sun."))??"sun.sun",t)}_getSunData(){if(!this._hass||!this.config.sun_entity)return null;let t=this._hass.states[this.config.sun_entity];return t?{sunrise:t.attributes.next_rising||null,sunset:t.attributes.next_setting||null,dawn:t.attributes.next_dawn||null,dusk:t.attributes.next_dusk||null,noon:t.attributes.next_noon||null,elevation:typeof t.attributes.elevation=="number"?t.attributes.elevation:null,aboveHorizon:t.state==="above_horizon",rising:!!t.attributes.rising}:null}_getMoonData(){if(!this._hass||!this.config.moon_entity)return null;let t=this._hass.states[this.config.moon_entity];if(!t)return null;let n=t.state,i;try{i=this._hass.formatEntityState?.(t)}catch{}return{phase:n,phaseName:(i&&i!==n?i:void 0)||Ot(Xl,n)||n.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase()),icon:ph(n)}}_render(){this._drawnWeather=this._weatherId();let t=this._getSunData(),n=this._getMoonData(),i=this.config.color_palette!=="theme";if(!t||!t.sunrise||!t.sunset){this._path=null,this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let r=kt(),o=rr(r,this._hass),s=yr(t.sunrise,this._hass),l=yr(t.sunset,this._hass),d=t.dawn?yr(t.dawn,this._hass):Math.max(0,s-.5),c=t.dusk?yr(t.dusk,this._hass):Math.min(24,l+.5),h=l-s,u=t.aboveHorizon,f=u?t.sunset:t.sunrise,p=new Date(f).getTime()-r.getTime(),m=this._hass,g=Ht=>M($(m,Ht)),y=Ht=>bh(Ke(Ht,m)),w=p>0?$(m,"in_duration",{duration:za(p/36e5,m)}):"",_=w&&this.config.show_header!==!1?_h(m,this.config.daylight_delta,u?"set":"rise",f):null,b=_===null?"":this._shiftHtml(_,m),v=Bi(t.elevation,t.rising,t.aboveHorizon),C=$e(this._skyCondition(v),v),S=i?{"--awc-sky-top":C.top,"--awc-sky-mid":C.mid,"--awc-sky-bottom":C.bottom,"--awc-sky-glow":C.glow,"--awc-sky-scrim":C.scrim}:null,A=this.config.compact?Yl:Ul,T=this.config.direction,x=T==="right_to_left"||T!=="left_to_right"&&(this._hass?.config?.latitude??0)<0;this._path={riseH:s,setH:l,rtl:x};let E=vh(s,l,A,x),L=`${E} L${Ae(24,x)},${A.horizon} L${Ae(0,x)},${A.horizon} Z`,D=eo(o,s,l),z=no(o,x)*100,I=io(D,A)/300*100,G=(Ht,_r)=>{let ei=Math.max(70,Math.abs(_r)/24*1e3*2.4);return`<ellipse cx="${Ae(Ht,x).toFixed(1)}" cy="${A.horizon}" rx="${ei.toFixed(1)}" ry="${A.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},F=!!this.config.compact,q=this.config.show_header!==!1,xt=q?`
            <div class="st-hero">
                ${this.config.title&&!F?`<div class="st-title">${M(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    ${Ce(u?"sunset":"sunrise","st-glyph")}
                    <span>${g(u?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${y(f)}</div>
                ${w?`<div class="st-countdown">${M(w)}${b}</div>`:""}
            </div>`:this.config.title&&!F?`<div class="st-hero"><div class="st-title">${M(this.config.title)}</div></div>`:"",at=(Ht,_r,ei,hd,md=!1)=>`
                <div class="st-metric" data-kind="${M(Ht)}">
                    <div class="st-metric-label">${Ce(_r,"st-glyph")}<span title="${M(ei)}">${M(ei)}</span></div>
                    <div class="st-metric-value${md?" wrap":""}">${hd}</div>
                </div>`,Et=!F&&this.config.show_details!==!1,R=Et?wh(m,this.config.daylight_delta,r):null,j=Ht=>Ht.trim()?`<span class="st-delta-words">${M(Ht)}</span>`:"",N=R?`<span class="st-delta" title="${M(R.before+R.figure+R.after)}">${j(R.before)}<span class="st-delta-figure">${M(R.figure)}</span>${j(R.after)}</span>`:"",ot=F&&q?`
                        <div class="st-chart-note">${g(u?"sunrise":"sunset")}<span class="st-chart-note-time">${y(u?t.sunrise:t.sunset)}</span></div>`:"",cd=Et?`
            <div class="st-metrics">
                ${u?at("sunrise","sunrise",g("sunrise"),y(t.sunrise)):at("sunset","sunset",g("sunset"),y(t.sunset))}
                ${at("noon","noon",g("solar_noon"),y(t.noon))}
                ${at("daylight","daylight",g("daylight"),M(za(h,m))+N)}
                ${at("first-light","first-light",g("first_light"),y(t.dawn))}
                ${at("last-light","last-light",g("last_light"),y(t.dusk))}
                ${n?at("moon",n.icon,g("moon"),M(n.phaseName),!0):""}
            </div>`:"",fo=this.config.sun_entity?m?.states[this.config.sun_entity]:void 0,po="";try{po=fo&&m?.formatEntityState?.(fo)||""}catch{}let ud=[`${$(m,"sunrise")} ${Ke(t.sunrise,m)}`,`${$(m,"sunset")} ${Ke(t.sunset,m)}`,po].filter(Boolean).join(" \xB7 ");this._mount(`
                    ${xt}
                    <div class="st-chart" role="img" aria-label="${M(ud)}">
                        <svg viewBox="0 0 ${1e3} ${300}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${1e3}" height="${A.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${A.horizon}" width="${1e3}" height="${300-A.horizon}"/></clipPath>
                            </defs>
                            ${G(s,s-d)}
                            ${G(l,c-l)}
                            <path d="${L}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${A.horizon}" x2="${1e3}" y2="${A.horizon}" class="st-horizon"/>
                            <line x1="${Ae(o,x).toFixed(1)}" y1="0" x2="${Ae(o,x).toFixed(1)}" y2="${300}" class="st-now-line"/>
                            <path d="${E}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${E}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${D<0?"below":""}" style="left: ${z.toFixed(2)}%; top: ${I.toFixed(2)}%;"></div>${ot}
                    </div>
                    ${cd}`,S)}_mount(t,n){let i=this._shadow.querySelector(".st-card");i||(this._shadow.innerHTML=`<style>${xh}</style><ha-card><div class="st-card"></div></ha-card>`,i=this._shadow.querySelector(".st-card"),hr(i.parentElement,this,()=>this._actions())),Bn(i.parentElement,this._actions());let r=!!n;i.classList.toggle("sky",r),i.classList.toggle("compact",!!this.config.compact),i.parentElement?.classList.toggle("sky",r);for(let o of Pa)n?i.style.setProperty(o,n[o]):i.style.removeProperty(o);i.innerHTML=t,this._link&&this._follow(),this._fit()}_follow(t){if(t){if(!t.source||t.sun!==this.config.sun_entity||t.at===null&&!this._link)return;if(this._link=t.at===null?null:t,!this._link){this._shadow.querySelector(".st-card")?.classList.remove("following"),this._render();return}}let n=this._shadow.querySelector(".st-card");n&&this._path&&this._link&&window.AnimatedWeatherCardForecast?.followTracker?.({card:n,hass:this._hass,weather:this._weatherId(),...this._path,compact:!!this.config.compact},this._link)}};customElements.define("animated-sun-tracker-card",ao);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(a,e)=>e.startsWith("sun.")?[{label:"Regular",config:{type:"custom:animated-sun-tracker-card",...ro(e,a)}},{label:"Compact",config:{type:"custom:animated-sun-tracker-card",...ro(e,a),compact:!0}}]:null});function en(a){let e=Number(a?.attributes?.supported_features);if(!isFinite(e))return["hourly","daily"];let t=[];return e&2&&t.push("hourly"),e&4&&t.push("twice_daily"),e&1&&t.push("daily"),t}function Zl(a){let e=en(a);return e.includes("daily")?"daily":e.includes("twice_daily")?"twice_daily":null}var Sh=5e3;function Ch(){let a=new WeakMap;return{subscribe(e,t,n,i){let r=a.get(e);r||a.set(e,r=new Map);let o=`${t}|${n}`,s=r.get(o);if(!s){let d={listeners:new Set};s=d,r.set(o,d);let c=h=>{d.last=h;for(let u of[...d.listeners])u(h)};d.unsubscribe=e.subscribeMessage(h=>c({type:h?.type??n,forecast:Array.isArray(h?.forecast)?h.forecast:null}),{type:"weather/subscribe_forecast",entity_id:t,forecast_type:n}).catch(()=>{r.get(o)===d&&r.delete(o),c({type:n,forecast:null,failed:!0})})}let l=s;return clearTimeout(l.closing),l.closing=void 0,l.listeners.add(i),l.last&&i(l.last),()=>{!l.listeners.delete(i)||l.listeners.size||(l.closing=setTimeout(()=>{l.listeners.size||(r.get(o)===l&&r.delete(o),l.unsubscribe?.then(d=>{typeof d=="function"&&d()}).catch(()=>{}))},Sh))}}}}function Ah(){return window.AnimatedWeatherCardForecasts??(window.AnimatedWeatherCardForecasts=Ch())}function Ql(a,e,t,n){return a?.connection?.subscribeMessage?Ah().subscribe(a.connection,e,t,n):()=>{}}var Qn=class{constructor(e){this.changed=e;this.hourly=null;this.daily=null;this.dailyType=null;this.settled=!1;this.stops=[];this.pending=new Set}sync(e,t,n){let i=t?e?.states[t]:void 0,r=en(i),o=n.hourly&&r.includes("hourly"),s=n.daily?Zl(i):null,l=`${t}|${o}|${s}`;if(!e?.connection||!t||!i){this.key&&this.stop();return}if(l===this.key&&this.connection===e.connection)return;this.stop(),this.key=l,this.connection=e.connection,this.dailyType=s,this.pending=new Set([o?"hourly":"",s??""].filter(Boolean)),this.settled=this.pending.size===0;let d=(c,h)=>{this.stops.push(Ql(e,t,c,u=>{u.failed||h(u.forecast),this.pending.delete(c),this.settled=this.pending.size===0,this.changed()}))};o&&d("hourly",c=>{this.hourly=c}),s&&d(s,c=>{this.daily=c}),this.settled&&this.changed()}stop(){for(let e of this.stops)e();this.stops=[],this.key=void 0,this.connection=void 0,this.hourly=null,this.daily=null,this.dailyType=null,this.settled=!1}};function oo(a,e){let t=a?.precipitation_unit;return t!=null&&t!==""?String(t):e?.accumulated_precipitation||(e?.length==="mi"?"in":"mm")}var so=36e5,co=a=>String(a??"").toLowerCase().replace(/\s+/g,"");function Th(a,e){let t=co(e),n=a;return t.startsWith("in")||t.includes("inch")?n*=25.4:t.startsWith("cm")&&(n*=10),/\/(d|day|24h)$/.test(t)&&(n/=24),n}function nd(a,e){let t=co(e);return t.startsWith("in")||t.includes("inch")?a*25.4:t.startsWith("cm")?a*10:a}function Jl(a,e){let t=co(e);return t.startsWith("mi")?a*1.609344:t.startsWith("ft")?a*3048e-7:t==="m"||t.startsWith("met")?a/1e3:a}var et=a=>{let e=typeof a=="number"?a:typeof a=="string"&&a.trim()!==""?Number(a):NaN;return Number.isFinite(e)?e:void 0};function id(a,e){let t=(a??[]).map(i=>({e:i,t:Date.parse(i.datetime)})).filter(i=>!isNaN(i.t)).sort((i,r)=>i.t-r.t);for(let i=0;i<t.length;i++){let r=t[i+1]?.t??t[i].t+so;if(t[i].t<=e&&e<Math.min(r,t[i].t+so))return t[i].e}let n=t[0];return n&&n.t>e&&n.t-e<=so?n.e:void 0}function rd(a,e,t){let n=a?.states??{},r=(e.entity?n[e.entity]:void 0)?.attributes??{},o={},s=(()=>{try{return $n(e)}catch{return[]}})(),l=y=>{let w=s.find(v=>v.type===y&&v.entity),_=w?.entity?n[w.entity]:void 0;if(!w?.entity||!_)return;if(w.entity.startsWith("weather.")){let v=_.attributes??{},C=et(v[In[y]??""]);return C===void 0?void 0:{value:C,unit:void 0,attrs:v}}let b=et(_.state);return b===void 0?void 0:{value:b,unit:_.attributes?.unit_of_measurement}},d=e.rain_rate_entity?n[e.rain_rate_entity]:void 0,c=et(d?.state);if(c!==void 0&&c>0)o.rate=Th(c,d?.attributes?.unit_of_measurement);else{let y=et(t?.precipitation);y!==void 0&&y>0&&(o.rate=nd(y,oo(r,a?.config?.unit_system)))}let h=l("cloud_cover")?.value??et(r.cloud_coverage)??et(t?.cloud_coverage);h!==void 0&&(o.cloud=Math.min(100,Math.max(0,h)));let u=l("visibility");if(u)o.visibility=Jl(u.value,u.attrs?u.attrs.visibility_unit??"km":u.unit);else{let y=et(r.visibility);y!==void 0&&(o.visibility=Jl(y,r.visibility_unit??"km"))}let f=e.wind_speed_sensor_entity?n[e.wind_speed_sensor_entity]:void 0,p=et(f?.state),m=r.wind_speed_unit;p!==void 0?o.wind=Dt(p,f?.attributes?.unit_of_measurement):et(r.wind_speed)!==void 0?o.wind=Dt(et(r.wind_speed),m):et(t?.wind_speed)!==void 0&&(o.wind=Dt(et(t?.wind_speed),m));let g=l("gust");return g?o.gust=Dt(g.value,g.attrs?g.attrs.wind_speed_unit:g.unit):et(r.wind_gust_speed)!==void 0?o.gust=Dt(et(r.wind_gust_speed),m):et(t?.wind_gust_speed)!==void 0&&(o.gust=Dt(et(t?.wind_gust_speed),m)),o}function ad(a,e,t){let n={},i=e?.wind_speed_unit,r=et(a.precipitation);r!==void 0&&r>0&&(n.rate=nd(r,oo(e,t)));let o=et(a.cloud_coverage);o!==void 0&&(n.cloud=Math.min(100,Math.max(0,o)));let s=et(a.wind_speed);s!==void 0&&(n.wind=Dt(s,i));let l=et(a.wind_gust_speed);return l!==void 0&&(n.gust=Dt(l,i)),n}function nn(a,e,t=!1){if(e<=a[0][0])return a[0][1];let n=a[a.length-1];if(e>=n[0])return n[1];for(let i=1;i<a.length;i++){let[r,o]=a[i-1],[s,l]=a[i];if(e<=s){let d=t?Math.log(e/r)/Math.log(s/r):(e-r)/(s-r);return o+(l-o)*d}}return n[1]}var Jn=(a,e,t)=>Math.min(t,Math.max(e,a)),rn=["light","rain","storm","pouring"],kh=[.5,2.5,8],td=1.15,Eh=[[.1,6],[.3,10],[1.5,18],[4,24],[10,32],[30,44]],Mh={"light-rain":[.05,.3,2.4],rainy:[.1,1.5,60],stormy:[1,4,60],pouring:[8,10,60],"snowy-rainy":[.1,1.5,60]},Ph={"light-rain":"light",rainy:"rain",stormy:"storm",pouring:"pouring","snowy-rainy":"rain"},Lh={light:10,rain:18,storm:24,pouring:32},Rh=[[.1,.4],[.3,.6],[1,1],[2.5,1.6],[5,2.2]],Oh=[[0,2],[25,3],[50,4],[75,6],[100,8]],Dh={"partly-cloudy":[3,5],cloudy:[4,8]},Fh=[[.2,1],[1,.8],[3,.6],[8,.45]],Hh=[[10,.5],[20,.75],[30,1],[50,1.6],[80,2.4]],Wh=[[0,1],[10,.85],[25,.6],[50,.35],[75,.25]];function lo(a,e){let t=e?rn.indexOf(e):-1,n=0;return kh.forEach((i,r)=>{let o=t<0?i:r<t?i/td:i*td;a>=o&&(n=r+1)}),rn[n]}function zh(a){let e=Math.max(1,Math.floor(a*.3)),t=Math.max(1,Math.round(a*.3));return[e,t,Math.max(1,a-e-t)]}var ed={rain:{kind:"rain",drops:18},snow:1,sleet:1,clouds:[1,1,2],fog:1,leaves:1,gusts:0,stars:1};function uo(a,e,t){let n={...ed,rain:{kind:Ph[a]??"rain",drops:0},clouds:[...ed.clouds]};n.rain.drops=Lh[n.rain.kind];let i=Mh[a];if(i&&e.rate!==void 0){let o=Jn(e.rate,i[0],i[2]),s=rn.indexOf(lo(i[0])),l=rn.indexOf(lo(i[2])),d=rn[Jn(rn.indexOf(lo(o,t)),s,l)];n.rain={kind:d,drops:Math.round(nn(Eh,o,!0))}}if(e.rate!==void 0){let o=nn(Rh,Jn(e.rate,.1,10),!0);n.snow=Math.round(o*100)/100,n.sleet=n.snow}let r=Dh[a];if(r&&e.cloud!==void 0&&(n.clouds=zh(Jn(Math.round(nn(Oh,e.cloud)),r[0],r[1]))),e.visibility!==void 0&&(n.fog=Math.round(nn(Fh,e.visibility)*100)/100),e.wind!==void 0&&(n.leaves=Math.round(nn(Hh,e.wind)*100)/100),e.gust!==void 0){let o=e.wind!==void 0?(e.gust-e.wind)/25:(e.gust-30)/40;n.gusts=Math.round(Jn(o,0,1)*100)/100}return e.cloud!==void 0&&(n.stars=Math.round(nn(Wh,e.cloud)*100)/100),n}var Nh=["compact","layout","show_forecast","show_days","show_clock","show_date","hero","show_attributes","grid_options"];var Ih=[{id:"standard",label:"Standard",description:"The sky, the temperature and four readings",options:{}},{id:"simple",label:"Simple",description:"The sky, the temperature and the condition, nothing else",options:{show_attributes:!1}},{id:"forecast",label:"Forecast",description:"The next hours under the readings; drag through them",options:{show_forecast:!0}},{id:"full",label:"Full info",description:"The time and date, the hours and the week",options:{show_forecast:!0,show_days:!0,show_clock:!0,show_date:!0}},{id:"strip",label:"Strip",description:"One line, to sit under other cards",options:{compact:!0}},{id:"bedside",label:"Bedside",description:"A clock that goes red on black at night",options:{layout:"nightstand"}},{id:"wall",label:"Wall",description:"A panel to read across the room",options:{show_forecast:!0,show_clock:!0,show_date:!0,grid_options:{columns:"full",rows:10}}}];var ho=a=>Ih.find(e=>e.id===a);function od(a,e){let t=ho(e);if(!t)return a;let n={...a};for(let i of Nh)delete n[i];return{...n,...t.options}}Vi();var sd=a=>`Wind from ${Math.round(a)}\xB0`,ld=a=>a==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",$h=18,Gh=450,qh=1600,Bh=["standard","forecast","full","strip"];function ti(a,e){return e?.states["sun.sun"]?{entity:a,sun_entity:"sun.sun"}:{entity:a}}var Vh=400,Uh=120,Yh=220,Kh=24;window.AnimatedWeatherCardGsap=ha;var dd=["regular","compact","short","tight","minimal"],jh=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...dd.map(a=>[a,"none"])],Xh=new Set(["tap_action","hold_action","double_tap_action","readings","uv_levels","aqi_levels","show_attributes","show_attribute_labels","show_attribute_icons",...Ka]),wr=class extends HTMLElement{constructor(){super(...arguments);this.placeView=new Ze(()=>[this.config?.entity]);this.readingList=[];this._initialRender=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this._needsAnimationRestart=!1;this.currentWindSpeedValue=10;this._animationGeneration=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new nr;this.devPlanes=!1;this.writtenNote=null;this.noteComing=!1;this.surface="card";this.forecastFeed=new Qn(()=>this.extras?.update());this.engineHours=new Qn(()=>this.syncEngine());this.lastPicture=null;this.following=!1;this.starFrame=0;this.devChanged=()=>{this.markDev(),this.homeHass&&this.isConnected&&(this.hass=this.homeHass);let t=pr();t!==this.devClock&&(this.devClock=t,this.timeOfDayManager?.updateConfig({}),this.noteVisible&&this.extras?.seen(!0),this.syncEngine())};this.devClock=0;this.onNeedle=t=>{let n=t.detail;this.following||this.forecastOn()||n?.at==null||n.source===this||n.entity!==this.config?.entity||(this.following=!0,this.syncForecastFeed(),this.extras?this.extras.update():this.mountExtras())}}static getStubConfig(t,n=[],i=[]){let r=[...n,...i,...Object.keys(t?.states??{})];return ti(r.find(o=>o.startsWith("weather."))??ma.entity,t)}actionsConfig(){if(this.surface==="view")return{};let t=ur(this.config,this.config?.entity);return t.tap_action?t:this.config?.layout==="nightstand"&&this.surface==="card"?{...t,tap_action:{action:"none"}}:this.forecastOn()?{...t,tap_action:{action:"forecast"}}:t}see(t){return this.placeView.see(fr(t,this.config))}markDev(){this.toggleAttribute("data-awc-dev",this.surface!=="view"&&jn(this.config))}get devKind(){return this.surface==="forecast"?"forecast":"weather"}devConfig(){return this.config}forecastOn(){return this.surface!=="card"||!!this.config?.show_forecast||this.config?.layout==="nightstand"}extrasWanted(){return this.forecastOn()||this.following||!!this.config?.show_clock||!!this.config?.show_date||this.heroClock()}shareSky(){let t=this.isConnected&&this.surface!=="view";Fa(this,t?this.config?.entity:void 0,this.config?.sun_entity)}weatherShown(){return this.surface!=="forecast"||this.config?.weather_effects===!0}heroClock(){return this.config?.hero==="clock"&&this.surface!=="forecast"&&this.config.layout!=="nightstand"}newController(){let t=new Ji(this,this.config,()=>this.animationsPaused,this.timeOfDayManager);return _i(this.config)==="auto"&&(t.amountsAt=n=>this.hourAmounts(n)),t}weatherClassNow(){let t=this.config,n=t?.entity?this._hass?.states[t.entity]:void 0;if(!(!t||!n))return xn(n.state.toLowerCase(),t.sunrise_hour,t.sunset_hour,this._hass?.config?.time_zone,{clock:!!t.enable_day_night_cycle,night:this.skyIsNight()})}engineAuto(){return!!this.config&&_i(this.config)==="auto"&&this.weatherShown()}enginePicture(){let t=this.engineAuto()?this.weatherClassNow():void 0;if(!t||!this.config)return null;let n=id(this.engineHours.hourly,ve());return uo(t,rd(this._hass,this.config,n),this.lastPicture?.rain.kind)}hourAmounts(t){if(!this.engineAuto()||!this.config)return;let n=this.config.entity?this._hass?.states[this.config.entity]:void 0,i=xn(String(t.condition??"").toLowerCase(),this.config.sunrise_hour,this.config.sunset_hour,this._hass?.config?.time_zone);return uo(i,ad(t,n?.attributes,this._hass?.config?.unit_system))}syncEngine(){clearTimeout(this.engineTimer),this.engineTimer=void 0;let t=this.syncEngineHours(),n=t?this.enginePicture():null;this.lastPicture=n;let i=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(this.config?.animate===!1||i){let r=this.querySelector(".animation-layer .stars-field");r&&Xi(r,n?.stars??1)}else this.animationController?.setAmounts(n);t&&this.engineHours.hourly?.length&&(clearTimeout(this.engineTimer),this.engineTimer=setTimeout(()=>this.syncEngine(),36e5-ve()%36e5+1e3))}syncEngineHours(){let t=this.isConnected&&this.engineAuto();return t?this.engineHours.sync(this._hass,this.config?.entity,{hourly:!0,daily:!1}):this.engineHours.stop(),t}syncForecastFeed(){if(!this.isConnected||!(this.forecastOn()||this.following)){this.forecastFeed.stop();return}let t=this.surface!=="forecast"||this.config?.show_hours!==!1||this.config?.compact;this.forecastFeed.sync(this._hass,this.config?.entity,{hourly:t!==!1,daily:!0})}mountExtras(){if(this.extras?.destroy(),this.extras=void 0,!this.isConnected||!this.extrasWanted()||!this.querySelector(".animated-weather-card .weather-info"))return;let t=window.AnimatedWeatherCardForecast;if(!t){Se("animated-weather-card-forecast",()=>!!window.AnimatedWeatherCardForecast).then(()=>{this.isConnected&&!this.extras&&this.mountExtras()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}t.version===2&&(this.extras=t.attach(this.forecastHost()),this.extras.update(),this.applySizeState())}forecastHost(){return{element:this,surface:this.surface,config:()=>this.config,hass:()=>this._hass,forecast:()=>this.forecastFeed,layers:()=>this.weatherShown()?this.animationController:void 0,skyColors:$e,phase:()=>this.currentSkyPhase(),current:()=>{let t=this.config?.outdoor_sensor_entity||this.config?.entity,n=Number(t?this.config?.outdoor_sensor_entity?this._hass?.states[t]?.state:this._hass?.states[t]?.attributes?.temperature:NaN);return isFinite(n)?n:void 0},temperature:t=>{let n=this.config?je(this.config):0;return ft(n?t:Math.round(t),this._hass,n).replace(/^-/,"\u2212")},conditionName:t=>this._hass?.formatEntityState?.({entity_id:this.config?.entity??"",state:t,attributes:{},last_changed:"",last_updated:""})??t,fit:()=>this.applySizeState(),refresh:()=>this._updateDataInPlace(),following:()=>this.following,seen:()=>this.noteVisible,still:()=>this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,moreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config?.entity},bubbles:!0,composed:!0})),readings:()=>this.readingList.filter(t=>(t.type==="aqi"||t.type==="sensor")&&!!t.entity).map(t=>{let n=Xa(this._hass,this.config,t);return{label:n.label,value:n.value??n.text,...n.word?{word:n.word}:{},...n.level?{level:n.level}:{}}}),reading:(t,n)=>{if(!this.config)return null;if(t==="rain_today"||t==="rain_now"){let o=t==="rain_now"?xe(this._hass,this.config.rain_rate_entity,"mm/h"):xe(this._hass,this.config.rain_entity,"mm");return!o||t==="rain_now"&&!(o.value>0)?null:{label:lr(this._hass,t==="rain_now"),value:zn(o.value,o.unit,this._hass)}}if(t!=="uv")return null;let i=n??qa(this._hass,this.config);if(i===null||!isFinite(i))return null;let r=Hn(i,Fn(this.config));return{label:$(this._hass,"uv_index"),value:ft(Math.max(0,Math.round(i)),this._hass),word:Ba(this._hass,r),level:r}}}}openForecast(){this.extras?this.extras.open():this.mountExtras()}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entity&&!t.dev_mode)throw new Error("You need to define an entity or enable dev mode");let n=p=>p===void 0||typeof p=="number"&&isFinite(p)&&p>=0&&p<=23;if(!n(t.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${t.sunrise_hour})`);if(!n(t.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${t.sunset_hour})`);let i=JSON.stringify(t);if(this.config&&i===this.configGiven)return;let r=this.configBefore,o=!!r&&[...new Set([...Object.keys(r),...Object.keys(t)])].filter(p=>JSON.stringify(r[p])!==JSON.stringify(t[p])).every(p=>Xh.has(p));this.configGiven=i,this.configBefore={...t};let s=this.placeView.set(t),l=this.placeView.place?.sunId;l&&(t={...t,sun_entity:l}),t=Al(t),t.layout==="nightstand"&&t.compact&&this.surface==="card"&&(t={...t,compact:!1});let d=$n(t),c=JSON.stringify(d)!==JSON.stringify(this.readingList)||["show_attributes","show_attribute_labels","show_attribute_icons"].some(p=>this.config?.[p]!==t[p]);this.readingList=d;let h=!!this.config?.dev_mode!=!!t.dev_mode;t.dev_mode&&(t.entity||(t={...t,entity:Vl}),Xn().then(()=>this.devChanged()).catch(p=>console.warn(`Animated Weather Card: ${p.message}`)));let u=this.config?.auto_pause;this.config?.flights_entity!==t.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0,this.heldPlanes=void 0),this.config?.entity!==t.entity&&(this.following=!1),this.config=t,this.markDev(),c&&this.redrawRow(),(s||h)&&this.homeHass&&(this._hass=this.see(this.homeHass)),this.isConnected&&this.tickPlace(),this.shareSky();let f=this.querySelector(".weather-info");if(f&&Bn(f,this.actionsConfig(),"group"),this.isConnected&&!o){this.initializeTimeOfDayManager();let p=this.animationController;this._animationGeneration++,this.animationController=this.newController(),p&&p.stopAllAnimations().catch(m=>k(this.config?.dev_mode,"Error stopping previous animation controller:",m))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&(this.syncForecastFeed(),this.mountExtras(),this.syncEngine()),this.isConnected&&!!t.auto_pause!=!!u&&(this.removeVisibilityTracking(),this.setupVisibilityTracking()),!o&&this.isConnected&&this._hass&&this.querySelector(".animated-weather-card")&&(this.render(),this.initializeAnimations())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",this.shareSky(),window.addEventListener(Qe,this.onNeedle),window.addEventListener(Je,this.devChanged),this.surface!=="view"&&tn().add(this),this.tickPlace(),!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>this.applySizeState()),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this._initialRender&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=this.newController())),this.attachEventListeners(),this.setupVisibilityTracking(),this.syncForecastFeed(),this.mountExtras(),this._updateDataInPlace(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=this.newController()),this._initialRender=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let n=this.querySelector(".animated-weather-card");n&&(n.classList.remove("no-transitions"),n.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass||this.config.dev_mode&&!this.hass.states[this.config.entity??""])return;ga(this),this.stopPlanes();let t=this.config.color_palette||"default",n;try{n=Va(this.hass,this.config)}catch(y){let w=y?.message||"Error loading weather data";this.innerHTML=`
              <ha-card>
                <div class="awc-empty-state" role="status">
                  ${Ce("alert","awc-empty-icon")}
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${M(w)}</div>
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
                    width: 48px;
                    height: 48px;
                    fill: currentColor;
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
            `;return}let{temperature:i,weatherCondition:r,location:o,windSpeedValue:s,pressureValue:l,feelsLike:d,indoorTemperature:c,indoorHumidity:h}=n,u=this.updatePressureTrend(l);this.currentWindSpeedValue=s;let f=!!this.config.compact,p=this.heroClock(),m=Bl(this.config),g=this.rowHtml(u);this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions${this.surface==="view"?"":" loading"} ${t==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${f?' data-variant="compact"':""} style="${M(m)}">
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
                ${this.locationHtml(f,o)}
                ${p?`<div class="temperature awc-hero-clock"><span class="awc-clock">${this.heroTime()}</span></div>
                <div class="awc-desc-row awc-lead-row"><span class="awc-temp-lead" aria-live="polite"><span class="temperature-value">${M(i)}</span><span class="degree">\xB0</span></span><div class="weather-desc" aria-live="polite">${M(r)}</div></div>`:`<div class="temperature" aria-live="polite"><span class="temperature-value">${M(i)}</span><span class="degree">\xB0</span></div>
                <div class="weather-desc" aria-live="polite">${M(r)}</div>`}
                ${f?`<div class="compact-meta">${this.config.show_clock&&!p?'<span class="awc-clock"></span>':""}${this.config.show_date?'<span class="awc-date"></span>':""}<span class="awc-meta-text">${M(this.compactMeta(o,d))}</span></div>`:`<div class="hero-meta">${this.heroMetaHtml(d,c,h)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
              </div>
              ${f?"":g}
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
        ${pl()}
      </style>
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill(),this.syncForecastFeed(),this.mountExtras()}locationHtml(t,n){if(t)return"";let i=this.config?.show_location!==!1&&n?`<span class="awc-place">${M(n)}</span>`:"",r=this.config?.show_clock&&!this.heroClock()?'<span class="awc-clock"></span>':"",o=this.config?.show_date?'<span class="awc-date"></span>':"";return i||r||o?`<div class="location">${r}${o}${i}</div>`:""}heroTime(){let{time:t,period:n}=yl(kt(),this._hass);return n?`${M(t)}<span class="awc-ampm">${M(n)}</span>`:M(t.replace(/^(\d)(\D)/,"0$1$2"))}applySpill(){let t=this.querySelector("ha-card");if(!t)return;let n=this.config?.spill_particles!==!1?"visible":"hidden";t.style.setProperty("overflow",n,"important");let i=()=>{let r=t.shadowRoot;if(!r)return;let o=r.querySelector("#awc-overflow");o||(o=document.createElement("style"),o.id="awc-overflow",r.appendChild(o)),o.textContent=`:host { overflow: ${n} !important; }`};i(),!t.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(i))}transitionCondition(){let t=this.querySelector(".animated-weather-card");if(!t||t.classList.contains("loading")){this.initializeAnimations();return}t.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},Vh)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&this.surface!=="forecast"&&this.config.layout!=="nightstand"}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let t=window.AnimatedWeatherCardNote;if(t){this.noteWriter??(this.noteWriter=new t(this)),this.noteWriter.start();return}Se("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(t){this.writtenNote=t,this.updateNote()}noteWriting(t){this.noteComing!==t&&(this.noteComing=t,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let t=this.config.note_entity?xl(this._hass,this.config):this.writtenNote,n=t?Sl(t,this.config):null;if(!t||n===null)return t;let i=n-ve();return i<=0?null:(i<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),i+50)),t)}noteHtml(t){return`<p class="weather-note"${t?"":" hidden"}><span class="note-long">${M(t?.note??"")}</span><span class="note-short">${M(t?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let t=this.querySelector(".weather-note");if(!t)return;let n=t.querySelector(".note-long"),i=t.querySelector(".note-short"),r=t.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let l=t.querySelector(".note-phrase"),d=$(this._hass,this.noteComing==="forecast"?"note_reading":"note_writing");!r||t.hidden?(l&&(l.textContent=d),t.dataset.writing="",t.setAttribute("aria-busy","true"),t.hidden=!1,this.applySizeState()):this.fadeThrough(l,d);return}r&&(delete t.dataset.writing,t.removeAttribute("aria-busy"));let o=this.currentNote();if(!o){this.noteTyping?.finish(),(!t.hidden||r)&&(t.hidden=!0,this.applySizeState());return}if(t.hidden||r){this.noteTyping?.finish(),n&&(n.textContent=o.note),i&&(i.textContent=o.line),t.hidden=!1,this.applySizeState(),r&&this.typeIn(t);return}if(this.noteTyping){if(this.noteTyping.text===o.note+o.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(n,o.note,s),this.fadeThrough(i,o.line,s)}compactMeta(t,n){return[this.config?.show_location!==!1?t:"",n?`${$(this._hass,"feels_like")} ${n}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let t=this.config?.indoor_style,n=M($(this._hass,"indoors")),i=Ce("indoor","indoor-icon");if(t==="icon")return`${i}<span class="awc-visually-hidden">${n} </span>`;let r=`<span class="indoor-label">${n}</span>`;return t==="both"?i+r:r}heroMetaHtml(t,n,i){let r=[];t&&r.push(`<span class="feels-like">${M($(this._hass,"feels_like"))} ${M(t)}</span>`);let o=[n,i].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&o.length&&r.push(`<span class="indoor-climate-inline">${this.indoorLead()}${o.map(s=>M(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),r.join("")}attachEventListeners(){this.mountNoteWriter();let t=this.querySelector(".weather-info");if(t&&(hr(t,this,()=>this.actionsConfig(),{forecast:()=>this.openForecast()}),Bn(t,this.actionsConfig(),"group")),!this.isInitializing){let n=window.setTimeout(()=>this.initializeAnimations(),100);this.pendingTimeouts.push(n)}}setAnimationsPaused(t){this.animationsPaused=t,this.toggleAttribute("data-paused",t),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),vi(this)):this._needsAnimationRestart?(this._needsAnimationRestart=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),bi(this),this.flyHeldPlanes())}getWeatherSettings(t){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return K(this.config,t)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let t=++this._animationGeneration;try{if(!this.config)return;let n=this.config,i=this.querySelector(".animated-weather-card");if(!i||(this.clearAnimations(),!this.hass||!n.entity)||!this.hass.states[n.entity])return;let o=this.weatherClassNow(),s=(n.color_palette||"default")==="theme"?"theme-colors":"",l=i.classList.contains("loading"),d=(...h)=>{i.className=["animated-weather-card",o,...h,s,l?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),l&&requestAnimationFrame(()=>requestAnimationFrame(()=>{i.classList.remove("no-transitions"),i.classList.add("transitions-enabled")}))},c=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(n.animate===!1||c||!this.weatherShown()){let h=o==="clear-night"&&this.surface!=="forecast";d(n.animate===!1?"static":"",h?"individual-stars-active":"");let u=i.querySelector(".animation-layer");h&&u&&Oa(u,Ra(K(n).cloudCount,i.clientWidth),{moon:!0,still:!0,words:Ln(i),share:this.enginePicture()?.stars??1}),this.currentWeatherClass=o;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&t===this._animationGeneration){if(d(),this.animationsPaused){this.currentWeatherClass=o,this._needsAnimationRestart=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.syncEngine(),this.animationController.applyWeatherCondition(o)),this.startPlanes()}},n.dev_mode?50:this.surface==="view"?0:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),ga(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(o=>{o.innerHTML=""});let n=this.querySelector(".animated-weather-card"),i=this.querySelector(".animation-layer");i&&(Mn(this),i.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),i.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),n&&(zi(n),Gs(n));let r=this.querySelector(".lightning");r&&(r.classList.remove("flash"),r.innerHTML=""),pa(this.pendingTimeouts)}set hass(t){this.homeHass=Kn(t),t=this.see(t);let n=this._hass;if(this._hass=t,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),this.syncForecastFeed(),this.syncEngineHours(),this.extras?.update(),!n){this.render(),this.initializeAnimations();return}if(Ye(n)!==Ye(t)){this.render(),this.initializeAnimations();return}if(!this.config.entity)return;let i=n.states[this.config.entity],r=t.states[this.config.entity];if(!i||!r){this.render(),this.initializeAnimations();return}if(i.state!==r.state){this._updateDataInPlace(),this.transitionCondition();return}let o=!1,s=d=>d==null?"__missing__":String(d),l=["temperature","apparent_temperature","humidity","wind_speed","pressure","wind_bearing","uv_index","friendly_name","dew_point","visibility","cloud_coverage","wind_gust_speed"];for(let d of l)if(s(i.attributes[d])!==s(r.attributes[d])){o=!0;break}if(this.config.note_entity&&n.states[this.config.note_entity]!==t.states[this.config.note_entity]&&(o=!0),!o){let d=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity,...kl(this.readingList)];for(let c of d){if(!c)continue;let h=n.states[c],u=t.states[c];if(h?.state!==u?.state||h?.attributes?.unit_of_measurement!==u?.attributes?.unit_of_measurement){o=!0;break}}}if(o)this._updateDataInPlace();else{let d=this.config.sun_entity||"sun.sun";n.states[d]!==t.states[d]&&this.applySkyPhase()}}}_updateDataInPlace(){if(!this.config||!this._hass)return;let t;try{t=Va(this._hass,this.config)}catch{return}let{temperature:n,weatherCondition:i,windSpeedValue:r,pressureValue:o,feelsLike:s,indoorTemperature:l,indoorHumidity:d}=t;this.currentWindSpeedValue=r;let c=!!this.extras?.away(),h=this.config.entity?this._hass?.states[this.config.entity]?.state:void 0,u=h&&this.extras?.conditionText(h)||i,f=(y,w)=>{y&&y.textContent!==w&&(y.textContent=w)};c||(this.fadeThrough(this.querySelector(".temperature-value"),n),this.fadeThrough(this.querySelector(".weather-desc"),u));let p=this.updatePressureTrend(o);c||this.updateRow(p);let m=this.querySelector(".compact-meta .awc-meta-text");m&&f(m,this.compactMeta(t.location,s)),f(this.querySelector(".location .awc-place"),t.location);let g=this.querySelector(".hero-meta");if(g){let y=this.heroMetaHtml(s,l,d),w=g.querySelector(".awc-line");Array.from(g.children).filter(b=>b!==w).map(b=>b.outerHTML).join("")!==y&&(g.innerHTML=y,w&&g.prepend(w))}this.updateNote(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(r),this.syncEngine()}rowItem(t,n,i,r){let o=this.config?.show_attribute_icons!==!1,s=this.config?.show_attribute_labels!==!1,l=o||s?`<div class="attribute-label">${o?Ce(i.icon,"attribute-icon"):""}${s?`<span>${M(i.label)}</span>`:""}</div>`:"",d=t.type==="wind"&&typeof i.bearing=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${i.bearing+180}deg);" aria-label="${sd(i.bearing)}"></ha-icon>`:t.type==="pressure"&&r?`<ha-icon class="pressure-trend ${r}" icon="${ld(r)}" aria-label="Pressure ${r}"></ha-icon>`:"",c=i.level?` data-level="${M(i.level)}"`:"";return`<div class="attribute" data-kind="${t.type}" data-i="${n}"${c}>${l}<div class="attribute-value"><span class="attribute-text">${i.html}</span>${d}</div></div>`}shownReadings(){return this.config?Tl(this.readingList).map(({r:t,i:n})=>({r:t,i:n,v:Xa(this._hass,this.config,t)})).filter(({r:t,v:n})=>t.type!=="sun"||n.html.replace(/<[^>]*>/g,"")!=="--"):[]}rowHtml(t){return!this.config||this.config.show_attributes===!1?"":`
              <div class="weather-attributes${this.config.show_attribute_labels!==!1?"":" values-only"}">${this.shownReadings().map(({r:i,i:r,v:o})=>this.rowItem(i,r,o,t)).join("")}</div>`}redrawRow(){let t=this.querySelector(".animated-weather-card .weather-info");if(!t||this.config?.compact)return;let n=t.querySelector(":scope > .weather-attributes"),i=this.rowHtml(this._pressureTrend??null).trim();if(n&&i){let r=document.createRange().createContextualFragment(i).firstElementChild;n.querySelectorAll(":scope > .attribute").forEach(o=>o.remove()),n.prepend(...Array.from(r.querySelectorAll(":scope > .attribute"))),n.classList.toggle("values-only",r.classList.contains("values-only"))}else if(n)n.remove();else if(i){let r=t.querySelector(":scope > .fc-section");r?r.insertAdjacentHTML("beforebegin",i):t.insertAdjacentHTML("beforeend",i)}this.applySizeState()}updateRow(t){let n=this.querySelector(".weather-attributes");if(!n||!this.config)return;let i=this.shownReadings();if([...n.querySelectorAll(":scope > .attribute")].map(o=>o.dataset.i).join()!==i.map(o=>String(o.i)).join()){this.redrawRow();return}for(let{r:o,i:s,v:l}of i){let d=n.querySelector(`:scope > .attribute[data-i="${s}"]`);if(!d)continue;let c=d.querySelector(".attribute-text");c&&c.innerHTML!==l.html&&(c.innerHTML=l.html);let h=d.querySelector(".attribute-label > span");h&&h.textContent!==l.label&&(h.textContent=l.label),Ol(d.querySelector(".attribute-icon"),l.icon),l.level?d.dataset.level=l.level:delete d.dataset.level,o.type==="wind"&&this.syncValueIcon(d,"wind-bearing-arrow",typeof l.bearing=="number"?{icon:"mdi:navigation",transform:`rotate(${l.bearing+180}deg)`,label:sd(l.bearing)}:null),o.type==="pressure"&&this.syncValueIcon(d,"pressure-trend",t?{icon:ld(t),label:`Pressure ${t}`,className:t}:null)}}updatePressureTrend(t){return typeof t!="number"?this._pressureTrend??null:(typeof this._lastPressureValue!="number"?this._lastPressureValue=t:Math.abs(t-this._lastPressureValue)>=.5&&(this._pressureTrend=t>this._lastPressureValue?"rising":"falling",this._lastPressureValue=t),this._pressureTrend??null)}syncValueIcon(t,n,i){let r=t.querySelector(".attribute-value");if(!r)return;let o=r.querySelector(`.${n}`);if(!i){o?.remove();return}o||(o=document.createElement("ha-icon"),r.appendChild(o)),o.className=[n,i.className].filter(Boolean).join(" "),o.getAttribute("icon")!==i.icon&&o.setAttribute("icon",i.icon),o.setAttribute("aria-label",i.label),o.style.transform=i.transform??""}typeIn(t){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let n=Array.from(t.querySelectorAll(".note-long, .note-short")).map(u=>{let f=u.textContent??"",p=document.createElement("span");p.className="note-typed";let m=document.createElement("span");return m.className="note-untyped",m.textContent=f,u.replaceChildren(p,m),{span:u,text:f,typed:p,rest:m}}),i=Math.max(0,...n.map(u=>u.text.length)),r=Math.min(qh,Math.max(Gh,i*$h)),o=window.requestAnimationFrame?.bind(window)??(u=>window.setTimeout(()=>u(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),l=Date.now(),d=0,c={text:n.map(u=>u.text).join(""),finish:()=>{s(d);for(let u of n)u.span.textContent=u.text;this.noteTyping===c&&(this.noteTyping=void 0)}},h=()=>{let u=Math.min(1,(Date.now()-l)/r);for(let f of n){let p=Math.round(u*f.text.length);f.typed.textContent=f.text.slice(0,p),f.rest.textContent=f.text.slice(p)}u<1?d=o(h):c.finish()};this.noteTyping=c,d=o(h)}fadeThrough(t,n,i){if(!t)return;let r=this.heroTextPending.get(t);if((r??t.textContent)===n)return;let o=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof t.animate!="function"||o){t.textContent=n,i?.();return}if(this.heroTextPending.set(t,n),r!==void 0)return;let s=()=>{let d=this.heroTextPending.get(t);this.heroTextPending.delete(t),d!==void 0&&(t.textContent=d),i?.()},l=t.animate([{opacity:1},{opacity:0}],{duration:Uh,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});l.onfinish=()=>{s(),t.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:Yh,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),l.cancel()},l.oncancel=s}get hass(){return this._hass}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.devPlanes)return;this.planesWanted=!0;let t=window.AnimatedWeatherCardPlanes;if(!t){Se("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`));return}let n=new t(this,{intensity:1,scale:1,devMode:!!this.config.dev_mode},this.config);this.planes=n,n.start().then(()=>{if(this.animationsPaused)n.pause();else if(this.planes===n){this.flyHeldPlanes();let i=this.askedPlanes;this.askedPlanes=void 0,i&&this.flyPlanes(i)}}).catch(i=>{console.error("Failed to start plane fly-overs:",i),this.planes===n&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let t=this.planes;t&&(this.planes=void 0,t.destroy().catch(n=>k(this.config?.dev_mode,"Error stopping plane fly-overs:",n)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let t=this._hass?.states[this.config.flights_entity];if(t&&t===this.lastFlightsState)return;this.lastFlightsState=t;let n=!this.flightTracker.seeded,i=!!this.config.planes_on_load&&this.surface!=="view",r=this.flightTracker.update(Ha(this._hass,this.config.flights_entity),i);r.length&&(n&&(!this.planes||this.animationsPaused)?this.heldPlanes=new Set(r.map(o=>o.id)):this.flyPlanes(r))}flyHeldPlanes(){let t=this.heldPlanes;if(!t||!this.planes||this.animationsPaused)return;this.heldPlanes=void 0;let n=(Ha(this._hass,this.config?.flights_entity)??[]).filter(i=>!i.onGround&&t.has(i.id));n.length&&this.flyPlanes(n)}flyOver(t){let n=this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||!this.weatherShown();if(!(this.animationsPaused||n)){if(this.planes){this.flyPlanes(t);return}this.devPlanes=!0,this.askedPlanes=t,this.startPlanes()}}flyPlanes(t){!this.planes||this.animationsPaused||this.planes.flyOver(t,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1,labelMode:this.config?.flight_label,speed:this.config?.plane_speed})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager?.isEnabled()?this.timeOfDayManager.getCurrentState().isNighttime:this._hass?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.extras?.seen(this.noteVisible),this.wasManuallyPaused)return;let t=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;t!==this.animationsPaused&&this.setAnimationsPaused(t)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(t=>{this.offscreen=!t[t.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}tickPlace(){this.placeView.tick(()=>{this.homeHass&&this.isConnected&&(this.hass=this.homeHass)})}disconnectedCallback(){this.placeView.stop(),Fa(this),window.removeEventListener(Qe,this.onNeedle),window.removeEventListener(Je,this.devChanged),tn().delete(this),cancelAnimationFrame(this.starFrame),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.extras?.destroy(),this.extras=void 0,this.forecastFeed.stop(),this.engineHours.stop(),clearTimeout(this.engineTimer),this.engineTimer=void 0,this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),pa(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new ir({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(t=>{this.onTimeOfDayChanged(t)}),this.config?.enable_day_night_cycle){let t=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(t)}}onTimeOfDayChanged(t){this.config?.enable_day_night_cycle&&(k(this.config?.dev_mode,`Time of day changed to: ${t.timePhase}`),this.updateDayNightBackground(t))}updateDayNightBackground(t){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager?.isEnabled())return this.timeOfDayManager.getCurrentState().timePhase;let t=this._hass?.states[this.config?.sun_entity||"sun.sun"];if(!t)return"day";let n=t.attributes?.elevation;return Bi(typeof n=="number"?n:Number(n),!!t.attributes?.rising,t.state!=="below_horizon")}skyIsNight(){if(!(!this.timeOfDayManager?.isEnabled()&&!this._hass?.states[this.config?.sun_entity||"sun.sun"]))return this.currentSkyPhase()==="night"}applySkyPhase(){let t=this.querySelector(".animated-weather-card");if(!t)return;let n=this.currentSkyPhase();t.dataset.phase!==n&&(t.dataset.phase=n),this.applyMoon(t)}applyMoon(t){let n=t.querySelector(".animation-layer");if(!n)return;let i=this.config?.moon_entity,r=Dl(kt(),i?this._hass?.states[i]?.state:void 0),o=(this.latitude()??0)<0,s=`${r.toFixed(3)}${o?"s":"n"}`;if(n.dataset.moon===s)return;n.dataset.moon=s;let l=Fl(r,o);n.style.setProperty("--awc-moon-mask",l.mask),n.style.setProperty("--awc-moon-halo",l.halo)}latitude(){let t=Number(this._hass?.config?.latitude);return this._hass?.config?.latitude!==void 0&&isFinite(t)?t:void 0}applySizeState(){let t=this.querySelector(".animated-weather-card"),n=t?.querySelector(".weather-info");if(!t||!n)return;t.toggleAttribute("data-wall-frame",this.surface==="card"&&!!this.config?.show_forecast&&this.config?.layout!=="nightstand"&&el(t)),cancelAnimationFrame(this.starFrame),this.starFrame=requestAnimationFrame(()=>cl(t));let i=t.querySelector(".main-weather-info"),r=t.querySelector(".weather-attributes");if(t.dataset.height="regular",t.querySelector(".awc-hero-clock")?.style.removeProperty("font-size"),r){let m=t.dataset.metrics;t.dataset.metrics="row";let g=Array.from(r.children),y=parseFloat(getComputedStyle(r).columnGap)||0,w=g.reduce((v,C)=>v+C.getBoundingClientRect().width,0)+y*Math.max(0,g.length-1),_=r.clientWidth-w,b=_<-.5||m==="grid"&&_<Kh;t.dataset.metrics=b?"grid":"row"}let o=t.dataset.variant==="compact",s=o?t.querySelector(".weather-desc"):null,l=t.querySelector(".weather-note"),d=()=>n.scrollHeight>n.clientHeight+1||!o&&!!i&&i.scrollHeight>i.clientHeight+1||!!s&&s.scrollWidth>s.clientWidth+1||!!l&&!l.hidden&&l.scrollHeight>l.clientHeight+1,h=!!l&&!l.hidden?jh:dd.map(m=>[m,void 0]),u=([m,g])=>{t.dataset.height=m,g?t.dataset.note=g:delete t.dataset.note},f=this.extras,p=f?.levels()??[];if(!f||!p.length){for(let m of h)if(u(m),!d())break;f?.fitted();return}for(let m=0;m<p.length;m++){f.setLevel(p[m]);let g=m===p.length-1;for(let y of h){if(!g&&!["regular","close","compact"].includes(y[0]))break;if(u(y),!d()&&(g||f.levelOk(d))){f.fitted();return}}}f.fitted()}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:this.gridRows(),min_columns:6,min_rows:3}}gridRows(){let t=this.noteEnabled()?1:0;return this.config?.layout==="nightstand"?6:this.config?.show_forecast?(en(this.config.entity?this._hass?.states[this.config.entity]:void 0).includes("hourly")?8:5)+this.dayRows()+t:4+t}dayRows(){if(!this.config?.show_days||this.config.compact)return 0;let t=Math.max(0,Math.min(10,Math.round(Number(this.config.forecast_days??7))||0));return t?Math.ceil((t*32+12)/64):0}getCardSize(){if(this.config?.compact)return 2;let t=3;return this.config?.show_indoor!==!1&&(t+=1),this.config?.show_attributes!==!1&&(t+=1),this.noteEnabled()&&(t+=1),this.config?.show_forecast&&(t+=3+this.dayRows()),t}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await Vn("animated-weather-card-editor"),document.createElement("animated-weather-card-editor")}};customElements.define("animated-weather-card",wr);var mo=class extends wr{constructor(){super(),this.surface="forecast"}setConfig(e){if(!e.entity&&!e.dev_mode)throw new Error("Please define a weather entity (entity: weather.home)");super.setConfig(e)}gridRows(){if(this.config?.compact)return 2;let e=this.config?.show_hours!==!1&&en(this.config?.entity?this.hass?.states[this.config.entity]:void 0).includes("hourly"),t=Math.max(0,Math.min(10,this.config?.forecast_days??7));return e?t<=3?5:7:Math.max(3,Math.ceil((58+t*32+20)/64))}getCardSize(){return this.config?.compact?2:this.gridRows()}static getStubConfig(e,t=[],n=[]){let i=[...t,...n,...Object.keys(e?.states??{})];return ti(i.find(r=>r.startsWith("weather."))??ma.entity,e)}static async getConfigElement(){return customElements.get("animated-forecast-card-editor")||await Vn("animated-forecast-card-editor"),document.createElement("animated-forecast-card-editor")}};customElements.define("animated-forecast-card",mo);customElements.define("animated-weather-dev-card",mr);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(a,e)=>e.startsWith("weather.")?Bh.map(t=>({label:ho(t).label,config:od({type:"custom:animated-weather-card",...ti(e,a)},t)})):null});window.customCards.push({type:"animated-forecast-card",name:"Animated Forecast",description:"The next hours and days of a weather entity, in its own sky: drag through the hours and the sky goes there",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card#the-forecast-card",getEntitySuggestion:(a,e)=>e.startsWith("weather.")?[{label:"Forecast",config:{type:"custom:animated-forecast-card",...ti(e,a)}},{label:"Forecast strip",config:{type:"custom:animated-forecast-card",...ti(e,a),compact:!0}}]:null});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let a=$e("sunny","day"),e=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${Ss} `,[`background: linear-gradient(90deg, ${a.top}, ${a.mid} 55%, ${a.bottom})`,`color: ${jt(Ft(Ge))}`,"border-radius: 4px 0 0 4px",...e].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${a.top}`,"border-radius: 0 4px 4px 0",...e].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
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
