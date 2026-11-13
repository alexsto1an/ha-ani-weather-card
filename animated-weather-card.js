"use strict";(()=>{function Lt(o){if(o===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return o}function Fr(o,e){o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.__proto__=e}var ht={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Be={duration:.5,overwrite:!1,delay:0},vn,tt,B,bt=1e8,I=1/bt,hn=Math.PI*2,Do=hn/4,Fo=0,Wr=Math.sqrt,Wo=Math.cos,zo=Math.sin,Z=function(e){return typeof e=="string"},U=function(e){return typeof e=="function"},Dt=function(e){return typeof e=="number"},wi=function(e){return typeof e>"u"},At=function(e){return typeof e=="object"},dt=function(e){return e!==!1},xn=function(){return typeof window<"u"},ci=function(e){return U(e)||Z(e)},zr=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},nt=Array.isArray,Ho=/random\([^)]+\)/g,Ro=/,\s*/g,Ar=/(?:-?\.?\d|\.)+/gi,Sn=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,ne=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,rn=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Tn=/[+-]=-?[.\d]+/,No=/[^,'"\[\]\s]+/gi,Io=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,V,Tt,un,Cn,gt={},mi={},Hr,Rr=function(e){return(mi=pe(e,gt))&&rt},_i=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},qe=function(e,t){return!t&&console.warn(e)},Nr=function(e,t){return e&&(gt[e]=t)&&mi&&(mi[e]=t)||gt},Ve=function(){return 0},$o={suppressEvents:!0,isStart:!0,kill:!1},di={suppressEvents:!0,kill:!1},Go={suppressEvents:!0},An={},$t=[],mn={},Ir,lt={},an={},kr=30,hi=[],kn="",En=function(e){var t=e[0],i,n;if(At(t)||U(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(n=hi.length;n--&&!hi[n].targetTest(t););i=hi[n]}for(n=e.length;n--;)e[n]&&(e[n]._gsap||(e[n]._gsap=new On(e[n],i)))||e.splice(n,1);return e},Gt=function(e){return e._gsap||En(vt(e))[0]._gsap},Mn=function(e,t,i){return(i=e[t])&&U(i)?e[t]():wi(i)&&e.getAttribute&&e.getAttribute(t)||i},at=function(e,t){return(e=e.split(",")).forEach(t)||e},K=function(e){return Math.round(e*1e5)/1e5||0},q=function(e){return Math.round(e*1e7)/1e7||0},re=function(e,t){var i=t.charAt(0),n=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+n:i==="-"?e-n:i==="*"?e*n:e/n},Bo=function(e,t){for(var i=t.length,n=0;e.indexOf(t[n])<0&&++n<i;);return n<i},pi=function(){var e=$t.length,t=$t.slice(0),i,n;for(mn={},$t.length=0,i=0;i<e;i++)n=t[i],n&&n._lazy&&(n.render(n._lazy[0],n._lazy[1],!0)._lazy=0)},Pn=function(e){return!!(e._initted||e._startAt||e.add)},$r=function(e,t,i,n){$t.length&&!tt&&pi(),e.render(t,i,n||!!(tt&&t<0&&Pn(e))),$t.length&&!tt&&pi()},Gr=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(No).length<2?t:Z(e)?e.trim():e},Br=function(e){return e},yt=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},qo=function(e){return function(t,i){for(var n in i)n in t||n==="duration"&&e||n==="ease"||(t[n]=i[n])}},pe=function(e,t){for(var i in t)e[i]=t[i];return e},Er=function o(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=At(t[i])?o(e[i]||(e[i]={}),t[i]):t[i]);return e},fi=function(e,t){var i={},n;for(n in e)n in t||(i[n]=e[n]);return i},Ie=function(e){var t=e.parent||V,i=e.keyframes?qo(nt(e.keyframes)):yt;if(dt(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},Vo=function(e,t){for(var i=e.length,n=i===t.length;n&&i--&&e[i]===t[i];);return i<0},qr=function(e,t,i,n,r){i===void 0&&(i="_first"),n===void 0&&(n="_last");var a=e[n],s;if(r)for(s=t[r];a&&a[r]>s;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[n]=t,t._prev=a,t.parent=t._dp=e,t},bi=function(e,t,i,n){i===void 0&&(i="_first"),n===void 0&&(n="_last");var r=t._prev,a=t._next;r?r._next=a:e[i]===t&&(e[i]=a),a?a._prev=r:e[n]===t&&(e[n]=r),t._next=t._prev=t.parent=null},Bt=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},te=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},Yo=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},pn=function(e,t,i,n){return e._startAt&&(tt?e._startAt.revert(di):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,n))},Uo=function o(e){return!e||e._ts&&o(e.parent)},Mr=function(e){return e._repeat?fe(e._tTime,e=e.duration()+e._rDelay)*e:0},fe=function(e,t){var i=Math.floor(e=q(e/t));return e&&i===e?i-1:i},gi=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},vi=function(e){return e._end=q(e._start+(e._tDur/Math.abs(e._ts||e._rts||I)||0))},xi=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=q(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),vi(e),i._dirty||te(i,e)),e},Vr=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=gi(e.rawTime(),t),(!t._dur||Ke(0,t.totalDuration(),i)-t._tTime>I)&&t.render(i,!0)),te(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-I}},Ct=function(e,t,i,n){return t.parent&&Bt(t),t._start=q((Dt(i)?i:i||e!==V?_t(e,i,t):e._time)+t._delay),t._end=q(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),qr(e,t,"_first","_last",e._sort?"_start":0),fn(t)||(e._recent=t),n||Vr(e,t),e._ts<0&&xi(e,e._tTime),e},Yr=function(e,t){return(gt.ScrollTrigger||_i("scrollTrigger",t))&&gt.ScrollTrigger.create(t,e)},Ur=function(e,t,i,n,r){if(Wn(e,t,r),!e._initted)return 1;if(!i&&e._pt&&!tt&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Ir!==ct.frame)return $t.push(e),e._lazy=[r,n],1},Ko=function o(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||o(t))},fn=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},jo=function(e,t,i,n){var r=e.ratio,a=t<0||!t&&(!e._start&&Ko(e)&&!(!e._initted&&fn(e))||(e._ts<0||e._dp._ts<0)&&!fn(e))?0:1,s=e._rDelay,l=0,c,d,m;if(s&&e._repeat&&(l=Ke(0,e._tDur,t),d=fe(l,s),e._yoyo&&d&1&&(a=1-a),d!==fe(e._tTime,s)&&(r=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==r||tt||n||e._zTime===I||!t&&e._zTime){if(!e._initted&&Ur(e,t,n,i,l))return;for(m=e._zTime,e._zTime=t||(i?I:0),i||(i=t&&!m),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&pn(e,t,i,!0),e._onUpdate&&!i&&ft(e,"onUpdate"),l&&e._repeat&&!i&&e.parent&&ft(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&Bt(e,1),!i&&!tt&&(ft(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Xo=function(e,t,i){var n;if(i>t)for(n=e._first;n&&n._start<=i;){if(n.data==="isPause"&&n._start>t)return n;n=n._next}else for(n=e._last;n&&n._start>=i;){if(n.data==="isPause"&&n._start<t)return n;n=n._prev}},ge=function(e,t,i,n){var r=e._repeat,a=q(t)||0,s=e._tTime/e._tDur;return s&&!n&&(e._time*=a/e._dur),e._dur=a,e._tDur=r?r<0?1e10:q(a*(r+1)+e._rDelay*r):a,s>0&&!n&&xi(e,e._tTime=e._tDur*s),e.parent&&vi(e),i||te(e.parent,e),e},Pr=function(e){return e instanceof it?te(e):ge(e,e._dur)},Zo={_start:0,endTime:Ve,totalDuration:Ve},_t=function o(e,t,i){var n=e.labels,r=e._recent||Zo,a=e.duration()>=bt?r.endTime(!1):e._dur,s,l,c;return Z(t)&&(isNaN(t)||t in n)?(l=t.charAt(0),c=t.substr(-1)==="%",s=t.indexOf("="),l==="<"||l===">"?(s>=0&&(t=t.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(s<0?r:i).totalDuration()/100:1)):s<0?(t in n||(n[t]=a),n[t]):(l=parseFloat(t.charAt(s-1)+t.substr(s+1)),c&&i&&(l=l/100*(nt(i)?i[0]:i).totalDuration()),s>1?o(e,t.substr(0,s-1),i)+l:a+l)):t==null?a:+t},$e=function(e,t,i){var n=Dt(t[1]),r=(n?2:1)+(e<2?0:1),a=t[r],s,l;if(n&&(a.duration=t[1]),a.parent=i,e){for(s=a,l=i;l&&!("immediateRender"in s);)s=l.vars.defaults||{},l=dt(l.vars.inherit)&&l.parent;a.immediateRender=dt(s.immediateRender),e<2?a.runBackwards=1:a.startAt=t[r-1]}return new j(t[0],a,t[r+1])},qt=function(e,t){return e||e===0?t(e):t},Ke=function(e,t,i){return i<e?e:i>t?t:i},et=function(e,t){return!Z(e)||!(t=Io.exec(e))?"":t[1]},Qo=function(e,t,i){return qt(i,function(n){return Ke(e,t,n)})},gn=[].slice,Kr=function(e,t){return e&&At(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&At(e[0]))&&!e.nodeType&&e!==Tt},Jo=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(n){var r;return Z(n)&&!t||Kr(n,1)?(r=i).push.apply(r,vt(n)):i.push(n)})||i},vt=function(e,t,i){return B&&!t&&B.selector?B.selector(e):Z(e)&&!i&&(un||!ye())?gn.call((t||Cn).querySelectorAll(e),0):nt(e)?Jo(e,i):Kr(e)?gn.call(e,0):e?[e]:[]},yn=function(e){return e=vt(e)[0]||qe("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return vt(t,i.querySelectorAll?i:i===e?qe("Invalid scope")||Cn.createElement("div"):e)}},jr=function(e){return e.sort(function(){return .5-Math.random()})},Xr=function(e){if(U(e))return e;var t=At(e)?e:{each:e},i=ee(t.ease),n=t.from||0,r=parseFloat(t.base)||0,a={},s=n>0&&n<1,l=isNaN(n)||s,c=t.axis,d=n,m=n;return Z(n)?d=m={center:.5,edges:.5,end:1}[n]||0:!s&&l&&(d=n[0],m=n[1]),function(h,p,g){var u=(g||t).length,f=a[u],w,y,b,v,_,x,T,C,A;if(!f){if(A=t.grid==="auto"?0:(t.grid||[1,bt])[1],!A){for(T=-bt;T<(T=g[A++].getBoundingClientRect().left)&&A<u;);A<u&&A--}for(f=a[u]=[],w=l?Math.min(A,u)*d-.5:n%A,y=A===bt?0:l?u*m/A-.5:n/A|0,T=0,C=bt,x=0;x<u;x++)b=x%A-w,v=y-(x/A|0),f[x]=_=c?Math.abs(c==="y"?v:b):Wr(b*b+v*v),_>T&&(T=_),_<C&&(C=_);n==="random"&&jr(f),f.max=T-C,f.min=C,f.v=u=(parseFloat(t.amount)||parseFloat(t.each)*(A>u?u-1:c?c==="y"?u/A:A:Math.max(A,u/A))||0)*(n==="edges"?-1:1),f.b=u<0?r-u:r,f.u=et(t.amount||t.each)||0,i=i&&u<0?us(i):i}return u=(f[h]-f.min)/f.max||0,q(f.b+(i?i(u):u)*f.v)+f.u}},wn=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var n=q(Math.round(parseFloat(i)/e)*e*t);return(n-n%1)/t+(Dt(i)?0:et(i))}},Zr=function(e,t){var i=nt(e),n,r;return!i&&At(e)&&(n=i=e.radius||bt,e.values?(e=vt(e.values),(r=!Dt(e[0]))&&(n*=n)):e=wn(e.increment)),qt(t,i?U(e)?function(a){return r=e(a),Math.abs(r-a)<=n?r:a}:function(a){for(var s=parseFloat(r?a.x:a),l=parseFloat(r?a.y:0),c=bt,d=0,m=e.length,h,p;m--;)r?(h=e[m].x-s,p=e[m].y-l,h=h*h+p*p):h=Math.abs(e[m]-s),h<c&&(c=h,d=m);return d=!n||c<=n?e[d]:a,r||d===a||Dt(a)?d:d+et(a)}:wn(e))},Qr=function(e,t,i,n){return qt(nt(e)?!t:i===!0?!!(i=0):!n,function(){return nt(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(n=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*n)/n})},ts=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(n){return t.reduce(function(r,a){return a(r)},n)}},es=function(e,t){return function(i){return e(parseFloat(i))+(t||et(i))}},is=function(e,t,i){return ta(e,t,0,1,i)},Jr=function(e,t,i){return qt(i,function(n){return e[~~t(n)]})},ns=function o(e,t,i){var n=t-e;return nt(e)?Jr(e,o(0,e.length),t):qt(i,function(r){return(n+(r-e)%n)%n+e})},rs=function o(e,t,i){var n=t-e,r=n*2;return nt(e)?Jr(e,o(0,e.length-1),t):qt(i,function(a){return a=(r+(a-e)%r)%r||0,e+(a>n?r-a:a)})},we=function(e){return e.replace(Ho,function(t){var i=t.indexOf("[")+1,n=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(Ro);return Qr(i?n:+n[0],i?0:+n[1],+n[2]||1e-5)})},ta=function(e,t,i,n,r){var a=t-e,s=n-i;return qt(r,function(l){return i+((l-e)/a*s||0)})},as=function o(e,t,i,n){var r=isNaN(e+t)?0:function(p){return(1-p)*e+p*t};if(!r){var a=Z(e),s={},l,c,d,m,h;if(i===!0&&(n=1)&&(i=null),a)e={p:e},t={p:t};else if(nt(e)&&!nt(t)){for(d=[],m=e.length,h=m-2,c=1;c<m;c++)d.push(o(e[c-1],e[c]));m--,r=function(g){g*=m;var u=Math.min(h,~~g);return d[u](g-u)},i=t}else n||(e=pe(nt(e)?[]:{},e));if(!d){for(l in t)Dn.call(s,e,l,"get",t[l]);r=function(g){return Rn(g,s)||(a?e.p:e)}}}return qt(i,r)},Lr=function(e,t,i){var n=e.labels,r=bt,a,s,l;for(a in n)s=n[a]-t,s<0==!!i&&s&&r>(s=Math.abs(s))&&(l=a,r=s);return l},ft=function(e,t,i){var n=e.vars,r=n[t],a=B,s=e._ctx,l,c,d;if(r)return l=n[t+"Params"],c=n.callbackScope||e,i&&$t.length&&pi(),s&&(B=s),d=l?r.apply(c,l):r.call(c),B=a,d},Re=function(e){return Bt(e),e.scrollTrigger&&e.scrollTrigger.kill(!!tt),e.progress()<1&&ft(e,"onInterrupt"),e},me,ea=[],ia=function(e){if(e)if(e=!e.name&&e.default||e,xn()||e.headless){var t=e.name,i=U(e),n=t&&!i&&e.init?function(){this._props=[]}:e,r={init:Ve,render:Rn,add:Dn,kill:xs,modifier:vs,rawVars:0},a={targetTest:0,get:0,getSetter:Si,aliases:{},register:0};if(ye(),e!==n){if(lt[t])return;yt(n,yt(fi(e,r),a)),pe(n.prototype,pe(r,fi(e,a))),lt[n.prop=t]=n,e.targetTest&&(hi.push(n),An[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Nr(t,n),e.register&&e.register(rt,n,ot)}else ea.push(e)},N=255,Ne={aqua:[0,N,N],lime:[0,N,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,N],navy:[0,0,128],white:[N,N,N],olive:[128,128,0],yellow:[N,N,0],orange:[N,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[N,0,0],pink:[N,192,203],cyan:[0,N,N],transparent:[N,N,N,0]},on=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*N+.5|0},na=function(e,t,i){var n=e?Dt(e)?[e>>16,e>>8&N,e&N]:0:Ne.black,r,a,s,l,c,d,m,h,p,g;if(!n){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),Ne[e])n=Ne[e];else if(e.charAt(0)==="#"){if(e.length<6&&(r=e.charAt(1),a=e.charAt(2),s=e.charAt(3),e="#"+r+r+a+a+s+s+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return n=parseInt(e.substr(1,6),16),[n>>16,n>>8&N,n&N,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),n=[e>>16,e>>8&N,e&N]}else if(e.substr(0,3)==="hsl"){if(n=g=e.match(Ar),!t)l=+n[0]%360/360,c=+n[1]/100,d=+n[2]/100,a=d<=.5?d*(c+1):d+c-d*c,r=d*2-a,n.length>3&&(n[3]*=1),n[0]=on(l+1/3,r,a),n[1]=on(l,r,a),n[2]=on(l-1/3,r,a);else if(~e.indexOf("="))return n=e.match(Sn),i&&n.length<4&&(n[3]=1),n}else n=e.match(Ar)||Ne.transparent;n=n.map(Number)}return t&&!g&&(r=n[0]/N,a=n[1]/N,s=n[2]/N,m=Math.max(r,a,s),h=Math.min(r,a,s),d=(m+h)/2,m===h?l=c=0:(p=m-h,c=d>.5?p/(2-m-h):p/(m+h),l=m===r?(a-s)/p+(a<s?6:0):m===a?(s-r)/p+2:(r-a)/p+4,l*=60),n[0]=~~(l+.5),n[1]=~~(c*100+.5),n[2]=~~(d*100+.5)),i&&n.length<4&&(n[3]=1),n},ra=function(e){var t=[],i=[],n=-1;return e.split(Ot).forEach(function(r){var a=r.match(ne)||[];t.push.apply(t,a),i.push(n+=a.length+1)}),t.c=i,t},Or=function(e,t,i){var n="",r=(e+n).match(Ot),a=t?"hsla(":"rgba(",s=0,l,c,d,m;if(!r)return e;if(r=r.map(function(h){return(h=na(h,t,1))&&a+(t?h[0]+","+h[1]+"%,"+h[2]+"%,"+h[3]:h.join(","))+")"}),i&&(d=ra(e),l=i.c,l.join(n)!==d.c.join(n)))for(c=e.replace(Ot,"1").split(ne),m=c.length-1;s<m;s++)n+=c[s]+(~l.indexOf(s)?r.shift()||a+"0,0,0,0)":(d.length?d:r.length?r:i).shift());if(!c)for(c=e.split(Ot),m=c.length-1;s<m;s++)n+=c[s]+r[s];return n+c[m]},Ot=(function(){var o="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in Ne)o+="|"+e+"\\b";return new RegExp(o+")","gi")})(),os=/hsl[a]?\(/,Ln=function(e){var t=e.join(" "),i;if(Ot.lastIndex=0,Ot.test(t))return i=os.test(t),e[1]=Or(e[1],i),e[0]=Or(e[0],i,ra(e[1])),!0},Ye,ct=(function(){var o=Date.now,e=500,t=33,i=o(),n=i,r=1e3/240,a=r,s=[],l,c,d,m,h,p,g=function u(f){var w=o()-n,y=f===!0,b,v,_,x;if((w>e||w<0)&&(i+=w-t),n+=w,_=n-i,b=_-a,(b>0||y)&&(x=++m.frame,h=_-m.time*1e3,m.time=_=_/1e3,a+=b+(b>=r?4:r-b),v=1),y||(l=c(u)),v)for(p=0;p<s.length;p++)s[p](_,h,x,f)};return m={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(f){return h/(1e3/(f||60))},wake:function(){Hr&&(!un&&xn()&&(Tt=un=window,Cn=Tt.document||{},gt.gsap=rt,(Tt.gsapVersions||(Tt.gsapVersions=[])).push(rt.version),Rr(mi||Tt.GreenSockGlobals||!Tt.gsap&&Tt||{}),ea.forEach(ia)),d=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&m.sleep(),c=d||function(f){return setTimeout(f,a-m.time*1e3+1|0)},Ye=1,g(2))},sleep:function(){(d?cancelAnimationFrame:clearTimeout)(l),Ye=0,c=Ve},lagSmoothing:function(f,w){e=f||1/0,t=Math.min(w||33,e)},fps:function(f){r=1e3/(f||240),a=m.time*1e3+r},add:function(f,w,y){var b=w?function(v,_,x,T){f(v,_,x,T),m.remove(b)}:f;return m.remove(f),s[y?"unshift":"push"](b),ye(),b},remove:function(f,w){~(w=s.indexOf(f))&&s.splice(w,1)&&p>=w&&p--},_listeners:s},m})(),ye=function(){return!Ye&&ct.wake()},P={},ss=/^[\d.\-M][\d.\-,\s]/,ls=/["']/g,cs=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),n=i[0],r=1,a=i.length,s,l,c;r<a;r++)l=i[r],s=r!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,s),t[n]=isNaN(c)?c.replace(ls,"").trim():+c,n=l.substr(s+1).trim();return t},ds=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),n=e.indexOf("(",t);return e.substring(t,~n&&n<i?e.indexOf(")",i+1):i)},hs=function(e){var t=(e+"").split("("),i=P[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[cs(t[1])]:ds(e).split(",").map(Gr)):P._CE&&ss.test(e)?P._CE("",e):i},us=function(e){return function(t){return 1-e(1-t)}},ee=function(e,t){return e&&(U(e)?e:P[e]||hs(e))||t},ae=function(e,t,i,n){i===void 0&&(i=function(l){return 1-t(1-l)}),n===void 0&&(n=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var r={easeIn:t,easeOut:i,easeInOut:n},a;return at(e,function(s){P[s]=gt[s]=r,P[a=s.toLowerCase()]=i;for(var l in r)P[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=P[s+"."+l]=r[l]}),r},aa=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},sn=function o(e,t,i){var n=t>=1?t:1,r=(i||(e?.3:.45))/(t<1?t:1),a=r/hn*(Math.asin(1/n)||0),s=function(d){return d===1?1:n*Math.pow(2,-10*d)*zo((d-a)*r)+1},l=e==="out"?s:e==="in"?function(c){return 1-s(1-c)}:aa(s);return r=hn/r,l.config=function(c,d){return o(e,c,d)},l},ln=function o(e,t){t===void 0&&(t=1.70158);var i=function(a){return a?--a*a*((t+1)*a+t)+1:0},n=e==="out"?i:e==="in"?function(r){return 1-i(1-r)}:aa(i);return n.config=function(r){return o(e,r)},n};at("Linear,Quad,Cubic,Quart,Quint,Strong",function(o,e){var t=e<5?e+1:e;ae(o+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});P.Linear.easeNone=P.none=P.Linear.easeIn;ae("Elastic",sn("in"),sn("out"),sn());(function(o,e){var t=1/e,i=2*t,n=2.5*t,r=function(s){return s<t?o*s*s:s<i?o*Math.pow(s-1.5/e,2)+.75:s<n?o*(s-=2.25/e)*s+.9375:o*Math.pow(s-2.625/e,2)+.984375};ae("Bounce",function(a){return 1-r(1-a)},r)})(7.5625,2.75);ae("Expo",function(o){return Math.pow(2,10*(o-1))*o+o*o*o*o*o*o*(1-o)});ae("Circ",function(o){return-(Wr(1-o*o)-1)});ae("Sine",function(o){return o===1?1:-Wo(o*Do)+1});ae("Back",ln("in"),ln("out"),ln());P.SteppedEase=P.steps=gt.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,n=e+(t?0:1),r=t?1:0,a=1-I;return function(s){return((n*Ke(0,a,s)|0)+r)*i}}};Be.ease=P["quad.out"];at("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(o){return kn+=o+","+o+"Params,"});var On=function(e,t){this.id=Fo++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:Mn,this.set=t?t.getSetter:Si},Ue=(function(){function o(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,ge(this,+t.duration,1,1),this.data=t.data,B&&(this._ctx=B,B.data.push(this)),Ye||ct.wake()}var e=o.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,ge(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,n){if(ye(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(xi(this,i),!r._dp||r.parent||Vr(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&Ct(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!n||this._initted&&Math.abs(this._zTime)===I||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),$r(this,i,n)),this},e.time=function(i,n){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+Mr(this))%(this._dur+this._rDelay)||(i?this._dur:0),n):this._time},e.totalProgress=function(i,n){return arguments.length?this.totalTime(this.totalDuration()*i,n):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,n){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+Mr(this),n):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,n){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*r,n):this._repeat?fe(this._tTime,r)+1:1},e.timeScale=function(i,n){if(!arguments.length)return this._rts===-I?0:this._rts;if(this._rts===i)return this;var r=this.parent&&this._ts?gi(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-I?0:this._rts,this.totalTime(Ke(-Math.abs(this._delay),this.totalDuration(),r),n!==!1),vi(this),Yo(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(ye(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==I&&(this._tTime-=I)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=q(i);var n=this.parent||this._dp;return n&&(n._sort||!this.parent)&&Ct(n,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(dt(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var n=this.parent||this._dp;return n?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?gi(n.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=Go);var n=tt;return tt=i,Pn(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),tt=n,this},e.globalTime=function(i){for(var n=this,r=arguments.length?i:n.rawTime();n;)r=n._start+r/(Math.abs(n._ts)||1),n=n._dp;return!this.parent&&this._sat?this._sat.globalTime(i):r},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,Pr(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var n=this._time;return this._rDelay=i,Pr(this),n?this.time(n):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,n){return this.totalTime(_t(this,i),dt(n))},e.restart=function(i,n){return this.play().totalTime(i?-this._delay:0,dt(n)),this._dur||(this._zTime=-I),this},e.play=function(i,n){return i!=null&&this.seek(i,n),this.reversed(!1).paused(!1)},e.reverse=function(i,n){return i!=null&&this.seek(i||this.totalDuration(),n),this.reversed(!0).paused(!1)},e.pause=function(i,n){return i!=null&&this.seek(i,n),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-I:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-I,this},e.isActive=function(){var i=this.parent||this._dp,n=this._start,r;return!!(!i||this._ts&&this._initted&&i.isActive()&&(r=i.rawTime(!0))>=n&&r<this.endTime(!0)-I)},e.eventCallback=function(i,n,r){var a=this.vars;return arguments.length>1?(n?(a[i]=n,r&&(a[i+"Params"]=r),i==="onUpdate"&&(this._onUpdate=n)):delete a[i],this):a[i]},e.then=function(i){var n=this,r=n._prom;return new Promise(function(a){var s=U(i)?i:Br,l=function(){var d=n.then;n.then=null,r&&r(),U(s)&&(s=s(n))&&(s.then||s===n)&&(n.then=d),a(s),n.then=d};n._initted&&n.totalProgress()===1&&n._ts>=0||!n._tTime&&n._ts<0?l():n._prom=l})},e.kill=function(){Re(this)},o})();yt(Ue.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-I,_prom:0,_ps:!1,_rts:1});var it=(function(o){Fr(e,o);function e(i,n){var r;return i===void 0&&(i={}),r=o.call(this,i)||this,r.labels={},r.smoothChildTiming=!!i.smoothChildTiming,r.autoRemoveChildren=!!i.autoRemoveChildren,r._sort=dt(i.sortChildren),V&&Ct(i.parent||V,Lt(r),n),i.reversed&&r.reverse(),i.paused&&r.paused(!0),i.scrollTrigger&&Yr(Lt(r),i.scrollTrigger),r}var t=e.prototype;return t.to=function(n,r,a){return $e(0,arguments,this),this},t.from=function(n,r,a){return $e(1,arguments,this),this},t.fromTo=function(n,r,a,s){return $e(2,arguments,this),this},t.set=function(n,r,a){return r.duration=0,r.parent=this,Ie(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new j(n,r,_t(this,a),1),this},t.call=function(n,r,a){return Ct(this,j.delayedCall(0,n,r),a)},t.staggerTo=function(n,r,a,s,l,c,d){return a.duration=r,a.stagger=a.stagger||s,a.onComplete=c,a.onCompleteParams=d,a.parent=this,new j(n,a,_t(this,l)),this},t.staggerFrom=function(n,r,a,s,l,c,d){return a.runBackwards=1,Ie(a).immediateRender=dt(a.immediateRender),this.staggerTo(n,r,a,s,l,c,d)},t.staggerFromTo=function(n,r,a,s,l,c,d,m){return s.startAt=a,Ie(s).immediateRender=dt(s.immediateRender),this.staggerTo(n,r,s,l,c,d,m)},t.render=function(n,r,a){var s=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,d=n<=0?0:q(n),m=this._zTime<0!=n<0&&(this._initted||!c),h,p,g,u,f,w,y,b,v,_,x,T;if(this!==V&&d>l&&n>=0&&(d=l),d!==this._tTime||a||m){if(s!==this._time&&c&&(d+=this._time-s,n+=this._time-s),h=d,v=this._start,b=this._ts,w=!b,m&&(c||(s=this._zTime),(n||!r)&&(this._zTime=n)),this._repeat){if(x=this._yoyo,f=c+this._rDelay,this._repeat<-1&&n<0)return this.totalTime(f*100+n,r,a);if(h=q(d%f),d===l?(u=this._repeat,h=c):(_=q(d/f),u=~~_,u&&u===_&&(h=c,u--),h>c&&(h=c)),_=fe(this._tTime,f),!s&&this._tTime&&_!==u&&this._tTime-_*f-this._dur<=0&&(_=u),x&&u&1&&(h=c-h,T=1),u!==_&&!this._lock){var C=x&&_&1,A=C===(x&&u&1);if(u<_&&(C=!C),s=C?0:d%c?c:d,this._lock=1,this.render(s||(T?0:q(u*f)),r,!c)._lock=0,this._tTime=d,!r&&this.parent&&ft(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1,_=u),s&&s!==this._time||w!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,A&&(this._lock=2,s=C?c:-1e-4,this.render(s,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!w)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(y=Xo(this,q(s),q(h)),y&&(d-=h-(h=y._start))),this._tTime=d,this._time=h,this._act=!!b,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=n,s=0),!s&&d&&c&&!r&&!_&&(ft(this,"onStart"),this._tTime!==d))return this;if(h>=s&&n>=0)for(p=this._first;p;){if(g=p._next,(p._act||h>=p._start)&&p._ts&&y!==p){if(p.parent!==this)return this.render(n,r,a);if(p.render(p._ts>0?(h-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(h-p._start)*p._ts,r,a),h!==this._time||!this._ts&&!w){y=0,g&&(d+=this._zTime=-I);break}}p=g}else{p=this._last;for(var S=n<0?n:h;p;){if(g=p._prev,(p._act||S<=p._end)&&p._ts&&y!==p){if(p.parent!==this)return this.render(n,r,a);if(p.render(p._ts>0?(S-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(S-p._start)*p._ts,r,a||tt&&Pn(p)),h!==this._time||!this._ts&&!w){y=0,g&&(d+=this._zTime=S?-I:I);break}}p=g}}if(y&&!r&&(this.pause(),y.render(h>=s?0:-I)._zTime=h>=s?1:-1,this._ts))return this._start=v,vi(this),this.render(n,r,a);this._onUpdate&&!r&&ft(this,"onUpdate",!0),(d===l&&this._tTime>=this.totalDuration()||!d&&s)&&(v===this._start||Math.abs(b)!==Math.abs(this._ts))&&(this._lock||((n||!c)&&(d===l&&this._ts>0||!d&&this._ts<0)&&Bt(this,1),!r&&!(n<0&&!s)&&(d||s||!l)&&(ft(this,d===l&&n>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(n,r){var a=this;if(Dt(r)||(r=_t(this,r,n)),!(n instanceof Ue)){if(nt(n))return n.forEach(function(s){return a.add(s,r)}),this;if(Z(n))return this.addLabel(n,r);if(U(n))n=j.delayedCall(0,n);else return this}return this!==n?Ct(this,n,r):this},t.getChildren=function(n,r,a,s){n===void 0&&(n=!0),r===void 0&&(r=!0),a===void 0&&(a=!0),s===void 0&&(s=-bt);for(var l=[],c=this._first;c;)c._start>=s&&(c instanceof j?r&&l.push(c):(a&&l.push(c),n&&l.push.apply(l,c.getChildren(!0,r,a)))),c=c._next;return l},t.getById=function(n){for(var r=this.getChildren(1,1,1),a=r.length;a--;)if(r[a].vars.id===n)return r[a]},t.remove=function(n){return Z(n)?this.removeLabel(n):U(n)?this.killTweensOf(n):(n.parent===this&&bi(this,n),n===this._recent&&(this._recent=this._last),te(this))},t.totalTime=function(n,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=q(ct.time-(this._ts>0?n/this._ts:(this.totalDuration()-n)/-this._ts))),o.prototype.totalTime.call(this,n,r),this._forcing=0,this):this._tTime},t.addLabel=function(n,r){return this.labels[n]=_t(this,r),this},t.removeLabel=function(n){return delete this.labels[n],this},t.addPause=function(n,r,a){var s=j.delayedCall(0,r||Ve,a);return s.data="isPause",this._hasPause=1,Ct(this,s,_t(this,n))},t.removePause=function(n){var r=this._first;for(n=_t(this,n);r;)r._start===n&&r.data==="isPause"&&Bt(r),r=r._next},t.killTweensOf=function(n,r,a){for(var s=this.getTweensOf(n,a),l=s.length;l--;)It!==s[l]&&s[l].kill(n,r);return this},t.getTweensOf=function(n,r){for(var a=[],s=vt(n),l=this._first,c=Dt(r),d;l;)l instanceof j?Bo(l._targets,s)&&(c?(!It||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&a.push(l):(d=l.getTweensOf(s,r)).length&&a.push.apply(a,d),l=l._next;return a},t.tweenTo=function(n,r){r=r||{};var a=this,s=_t(a,n),l=r,c=l.startAt,d=l.onStart,m=l.onStartParams,h=l.immediateRender,p,g=j.to(a,yt({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:s,overwrite:"auto",duration:r.duration||Math.abs((s-(c&&"time"in c?c.time:a._time))/a.timeScale())||I,onStart:function(){if(a.pause(),!p){var f=r.duration||Math.abs((s-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==f&&ge(g,f,0,1).render(g._time,!0,!0),p=1}d&&d.apply(g,m||[])}},r));return h?g.render(0):g},t.tweenFromTo=function(n,r,a){return this.tweenTo(r,yt({startAt:{time:_t(this,n)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(n){return n===void 0&&(n=this._time),Lr(this,_t(this,n))},t.previousLabel=function(n){return n===void 0&&(n=this._time),Lr(this,_t(this,n),1)},t.currentLabel=function(n){return arguments.length?this.seek(n,!0):this.previousLabel(this._time+I)},t.shiftChildren=function(n,r,a){a===void 0&&(a=0);var s=this._first,l=this.labels,c;for(n=q(n);s;)s._start>=a&&(s._start+=n,s._end+=n),s=s._next;if(r)for(c in l)l[c]>=a&&(l[c]+=n);return te(this)},t.invalidate=function(n){var r=this._first;for(this._lock=0;r;)r.invalidate(n),r=r._next;return o.prototype.invalidate.call(this,n)},t.clear=function(n){n===void 0&&(n=!0);for(var r=this._first,a;r;)a=r._next,this.remove(r),r=a;return this._dp&&(this._time=this._tTime=this._pTime=0),n&&(this.labels={}),te(this)},t.totalDuration=function(n){var r=0,a=this,s=a._last,l=bt,c,d,m;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-n:n));if(a._dirty){for(m=a.parent;s;)c=s._prev,s._dirty&&s.totalDuration(),d=s._start,d>l&&a._sort&&s._ts&&!a._lock?(a._lock=1,Ct(a,s,d-s._delay,1)._lock=0):l=d,d<0&&s._ts&&(r-=d,(!m&&!a._dp||m&&m.smoothChildTiming)&&(a._start+=q(d/a._ts),a._time-=d,a._tTime-=d),a.shiftChildren(-d,!1,-1/0),l=0),s._end>r&&s._ts&&(r=s._end),s=c;ge(a,a===V&&a._time>r?a._time:r,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(n){if(V._ts&&($r(V,gi(n,V)),Ir=ct.frame),ct.frame>=kr){kr+=ht.autoSleep||120;var r=V._first;if((!r||!r._ts)&&ht.autoSleep&&ct._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||ct.sleep()}}},e})(Ue);yt(it.prototype,{_lock:0,_hasPause:0,_forcing:0});var ms=function(e,t,i,n,r,a,s){var l=new ot(this._pt,e,t,0,1,Hn,null,r),c=0,d=0,m,h,p,g,u,f,w,y;for(l.b=i,l.e=n,i+="",n+="",(w=~n.indexOf("random("))&&(n=we(n)),a&&(y=[i,n],a(y,e,t),i=y[0],n=y[1]),h=i.match(rn)||[];m=rn.exec(n);)g=m[0],u=n.substring(c,m.index),p?p=(p+1)%5:u.substr(-5)==="rgba("&&(p=1),g!==h[d++]&&(f=parseFloat(h[d-1])||0,l._pt={_next:l._pt,p:u||d===1?u:",",s:f,c:g.charAt(1)==="="?re(f,g)-f:parseFloat(g)-f,m:p&&p<4?Math.round:0},c=rn.lastIndex);return l.c=c<n.length?n.substring(c,n.length):"",l.fp=s,(Tn.test(n)||w)&&(l.e=0),this._pt=l,l},Dn=function(e,t,i,n,r,a,s,l,c,d){U(n)&&(n=n(r||0,e,a));var m=e[t],h=i!=="get"?i:U(m)?c?e[t.indexOf("set")||!U(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():m,p=U(m)?c?ws:la:zn,g;if(Z(n)&&(~n.indexOf("random(")&&(n=we(n)),n.charAt(1)==="="&&(g=re(h,n)+(et(h)||0),(g||g===0)&&(n=g))),!d||h!==n||_n)return!isNaN(h*n)&&n!==""?(g=new ot(this._pt,e,t,+h||0,n-(h||0),typeof m=="boolean"?bs:ca,0,p),c&&(g.fp=c),s&&g.modifier(s,this,e),this._pt=g):(!m&&!(t in e)&&_i(t,n),ms.call(this,e,t,h,n,p,l||ht.stringFilter,c))},ps=function(e,t,i,n,r){if(U(e)&&(e=Ge(e,r,t,i,n)),!At(e)||e.style&&e.nodeType||nt(e)||zr(e))return Z(e)?Ge(e,r,t,i,n):e;var a={},s;for(s in e)a[s]=Ge(e[s],r,t,i,n);return a},Fn=function(e,t,i,n,r,a){var s,l,c,d;if(lt[e]&&(s=new lt[e]).init(r,s.rawVars?t[e]:ps(t[e],n,r,a,i),i,n,a)!==!1&&(i._pt=l=new ot(i._pt,r,e,0,1,s.render,s,0,s.priority),i!==me))for(c=i._ptLookup[i._targets.indexOf(r)],d=s._props.length;d--;)c[s._props[d]]=l;return s},It,_n,Wn=function o(e,t,i){var n=e.vars,r=n.ease,a=n.startAt,s=n.immediateRender,l=n.lazy,c=n.onUpdate,d=n.runBackwards,m=n.yoyoEase,h=n.keyframes,p=n.autoRevert,g=e._dur,u=e._startAt,f=e._targets,w=e.parent,y=w&&w.data==="nested"?w.vars.targets:f,b=e._overwrite==="auto"&&!vn,v=e.timeline,_=n.easeReverse||m,x,T,C,A,S,E,M,O,F,z,R,H,G;if(v&&(!h||!r)&&(r="none"),e._ease=ee(r,Be.ease),e._rEase=_&&(ee(_)||e._ease),e._from=!v&&!!n.runBackwards,e._from&&(e.ratio=1),!v||h&&!n.stagger){if(O=f[0]?Gt(f[0]).harness:0,H=O&&n[O.prop],x=fi(n,An),u&&(u._zTime<0&&u.progress(1),t<0&&d&&s&&!p?u.render(-1,!0):u.revert(d&&g?di:$o),u._lazy=0),a){if(Bt(e._startAt=j.set(f,yt({data:"isStart",overwrite:!1,parent:w,immediateRender:!0,lazy:!u&&dt(l),startAt:null,delay:0,onUpdate:c&&function(){return ft(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(tt||!s&&!p)&&e._startAt.revert(di),s&&g&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(d&&g&&!u){if(t&&(s=!1),C=yt({overwrite:!1,data:"isFromStart",lazy:s&&!u&&dt(l),immediateRender:s,stagger:0,parent:w},x),H&&(C[O.prop]=H),Bt(e._startAt=j.set(f,C)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(tt?e._startAt.revert(di):e._startAt.render(-1,!0)),e._zTime=t,!s)o(e._startAt,I,I);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&dt(l)||l&&!g,T=0;T<f.length;T++){if(S=f[T],M=S._gsap||En(f)[T]._gsap,e._ptLookup[T]=z={},mn[M.id]&&$t.length&&pi(),R=y===f?T:y.indexOf(S),O&&(F=new O).init(S,H||x,e,R,y)!==!1&&(e._pt=A=new ot(e._pt,S,F.name,0,1,F.render,F,0,F.priority),F._props.forEach(function(pt){z[pt]=A}),F.priority&&(E=1)),!O||H)for(C in x)lt[C]&&(F=Fn(C,x,e,R,S,y))?F.priority&&(E=1):z[C]=A=Dn.call(e,S,C,"get",x[C],R,y,0,n.stringFilter);e._op&&e._op[T]&&e.kill(S,e._op[T]),b&&e._pt&&(It=e,V.killTweensOf(S,z,e.globalTime(t)),G=!e.parent,It=0),e._pt&&l&&(mn[M.id]=1)}E&&Nn(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!G,h&&t<=0&&v.render(bt,!0,!0)},fs=function(e,t,i,n,r,a,s,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],d,m,h,p;if(!c)for(c=e._ptCache[t]=[],h=e._ptLookup,p=e._targets.length;p--;){if(d=h[p][t],d&&d.d&&d.d._pt)for(d=d.d._pt;d&&d.p!==t&&d.fp!==t;)d=d._next;if(!d)return _n=1,e.vars[t]="+=0",Wn(e,s),_n=0,l?qe(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(d)}for(p=c.length;p--;)m=c[p],d=m._pt||m,d.s=(n||n===0)&&!r?n:d.s+(n||0)+a*d.c,d.c=i-d.s,m.e&&(m.e=K(i)+et(m.e)),m.b&&(m.b=d.s+et(m.b))},gs=function(e,t){var i=e[0]?Gt(e[0]).harness:0,n=i&&i.aliases,r,a,s,l;if(!n)return t;r=pe({},t);for(a in n)if(a in r)for(l=n[a].split(","),s=l.length;s--;)r[l[s]]=r[a];return r},ys=function(e,t,i,n){var r=t.ease||n||"power1.inOut",a,s;if(nt(t))s=i[e]||(i[e]=[]),t.forEach(function(l,c){return s.push({t:c/(t.length-1)*100,v:l,e:r})});else for(a in t)s=i[a]||(i[a]=[]),a==="ease"||s.push({t:parseFloat(e),v:t[a],e:r})},Ge=function(e,t,i,n,r){return U(e)?e.call(t,i,n,r):Z(e)&&~e.indexOf("random(")?we(e):e},oa=kn+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",sa={};at(oa+",id,stagger,delay,duration,paused,scrollTrigger",function(o){return sa[o]=1});var j=(function(o){Fr(e,o);function e(i,n,r,a){var s;typeof n=="number"&&(r.duration=n,n=r,r=null),s=o.call(this,a?n:Ie(n))||this;var l=s.vars,c=l.duration,d=l.delay,m=l.immediateRender,h=l.stagger,p=l.overwrite,g=l.keyframes,u=l.defaults,f=l.scrollTrigger,w=n.parent||V,y=(nt(i)||zr(i)?Dt(i[0]):"length"in n)?[i]:vt(i),b,v,_,x,T,C,A,S;if(s._targets=y.length?En(y):qe("GSAP target "+i+" not found. https://gsap.com",!ht.nullTargetWarn)||[],s._ptLookup=[],s._overwrite=p,g||h||ci(c)||ci(d)){n=s.vars;var E=n.easeReverse||n.yoyoEase;if(b=s.timeline=new it({data:"nested",defaults:u||{},targets:w&&w.data==="nested"?w.vars.targets:y}),b.kill(),b.parent=b._dp=Lt(s),b._start=0,h||ci(c)||ci(d)){if(x=y.length,A=h&&Xr(h),At(h))for(T in h)~oa.indexOf(T)&&(S||(S={}),S[T]=h[T]);for(v=0;v<x;v++)_=fi(n,sa),_.stagger=0,E&&(_.easeReverse=E),S&&pe(_,S),C=y[v],_.duration=+Ge(c,Lt(s),v,C,y),_.delay=(+Ge(d,Lt(s),v,C,y)||0)-s._delay,!h&&x===1&&_.delay&&(s._delay=d=_.delay,s._start+=d,_.delay=0),b.to(C,_,A?A(v,C,y):0),b._ease=P.none;b.duration()?c=d=0:s.timeline=0}else if(g){Ie(yt(b.vars.defaults,{ease:"none"})),b._ease=ee(g.ease||n.ease||"none");var M=0,O,F,z;if(nt(g))g.forEach(function(R){return b.to(y,R,">")}),b.duration();else{_={};for(T in g)T==="ease"||T==="easeEach"||ys(T,g[T],_,g.easeEach);for(T in _)for(O=_[T].sort(function(R,H){return R.t-H.t}),M=0,v=0;v<O.length;v++)F=O[v],z={ease:F.e,duration:(F.t-(v?O[v-1].t:0))/100*c},z[T]=F.v,b.to(y,z,M),M+=z.duration;b.duration()<c&&b.to({},{duration:c-b.duration()})}}c||s.duration(c=b.duration())}else s.timeline=0;return p===!0&&!vn&&(It=Lt(s),V.killTweensOf(y),It=0),Ct(w,Lt(s),r),n.reversed&&s.reverse(),n.paused&&s.paused(!0),(m||!c&&!g&&s._start===q(w._time)&&dt(m)&&Uo(Lt(s))&&w.data!=="nested")&&(s._tTime=-I,s.render(Math.max(0,-d)||0)),f&&Yr(Lt(s),f),s}var t=e.prototype;return t.render=function(n,r,a){var s=this._time,l=this._tDur,c=this._dur,d=n<0,m=n>l-I&&!d?l:n<I?0:n,h,p,g,u,f,w,y,b;if(!c)jo(this,n,r,a);else if(m!==this._tTime||!n||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==d||this._lazy){if(h=m,b=this.timeline,this._repeat){if(u=c+this._rDelay,this._repeat<-1&&d)return this.totalTime(u*100+n,r,a);if(h=q(m%u),m===l?(g=this._repeat,h=c):(f=q(m/u),g=~~f,g&&g===f?(h=c,g--):h>c&&(h=c)),w=this._yoyo&&g&1,w&&(h=c-h),f=fe(this._tTime,u),h===s&&!a&&this._initted&&g===f)return this._tTime=m,this;g!==f&&this.vars.repeatRefresh&&!w&&!this._lock&&h!==u&&this._initted&&(this._lock=a=1,this.render(q(u*g),!0).invalidate()._lock=0)}if(!this._initted){if(Ur(this,d?n:h,a,r,m))return this._tTime=0,this;if(s!==this._time&&!(a&&this.vars.repeatRefresh&&g!==f))return this;if(c!==this._dur)return this.render(n,r,a)}if(this._rEase){var v=h<s;if(v!==this._inv){var _=v?s:c-s;this._inv=v,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=s,this._invRecip=_?(v?-1:1)/_:0,this._invScale=v?-this.ratio:1-this.ratio,this._invEase=v?this._rEase:this._ease}this.ratio=y=this._invRatio+this._invScale*this._invEase((h-this._invTime)*this._invRecip)}else this.ratio=y=this._ease(h/c);if(this._from&&(this.ratio=y=1-y),this._tTime=m,this._time=h,!this._act&&this._ts&&(this._act=1,this._lazy=0),!s&&m&&!r&&!f&&(ft(this,"onStart"),this._tTime!==m))return this;for(p=this._pt;p;)p.r(y,p.d),p=p._next;b&&b.render(n<0?n:b._dur*b._ease(h/this._dur),r,a)||this._startAt&&(this._zTime=n),this._onUpdate&&!r&&(d&&pn(this,n,r,a),ft(this,"onUpdate")),this._repeat&&g!==f&&this.vars.onRepeat&&!r&&this.parent&&ft(this,"onRepeat"),(m===this._tDur||!m)&&this._tTime===m&&(d&&!this._onUpdate&&pn(this,n,!0,!0),(n||!c)&&(m===this._tDur&&this._ts>0||!m&&this._ts<0)&&Bt(this,1),!r&&!(d&&!s)&&(m||s||w)&&(ft(this,m===l?"onComplete":"onReverseComplete",!0),this._prom&&!(m<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(n){return(!n||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(n),o.prototype.invalidate.call(this,n)},t.resetTo=function(n,r,a,s,l){Ye||ct.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),d;return this._initted||Wn(this,c),d=this._ease(c/this._dur),fs(this,n,r,a,s,d,c,l)?this.resetTo(n,r,a,s,1):(xi(this,0),this.parent||qr(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(n,r){if(r===void 0&&(r="all"),!n&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?Re(this):this.scrollTrigger&&this.scrollTrigger.kill(!!tt),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(n,r,It&&It.vars.overwrite!==!0)._first||Re(this),this.parent&&a!==this.timeline.totalDuration()&&ge(this,this._dur*this.timeline._tDur/a,0,1),this}var s=this._targets,l=n?vt(n):s,c=this._ptLookup,d=this._pt,m,h,p,g,u,f,w;if((!r||r==="all")&&Vo(s,l))return r==="all"&&(this._pt=0),Re(this);for(m=this._op=this._op||[],r!=="all"&&(Z(r)&&(u={},at(r,function(y){return u[y]=1}),r=u),r=gs(s,r)),w=s.length;w--;)if(~l.indexOf(s[w])){h=c[w],r==="all"?(m[w]=r,g=h,p={}):(p=m[w]=m[w]||{},g=r);for(u in g)f=h&&h[u],f&&((!("kill"in f.d)||f.d.kill(u)===!0)&&bi(this,f,"_pt"),delete h[u]),p!=="all"&&(p[u]=1)}return this._initted&&!this._pt&&d&&Re(this),this},e.to=function(n,r){return new e(n,r,arguments[2])},e.from=function(n,r){return $e(1,arguments)},e.delayedCall=function(n,r,a,s){return new e(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:n,onComplete:r,onReverseComplete:r,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:s})},e.fromTo=function(n,r,a){return $e(2,arguments)},e.set=function(n,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new e(n,r)},e.killTweensOf=function(n,r,a){return V.killTweensOf(n,r,a)},e})(Ue);yt(j.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});at("staggerTo,staggerFrom,staggerFromTo",function(o){j[o]=function(){var e=new it,t=gn.call(arguments,0);return t.splice(o==="staggerFromTo"?5:4,0,0),e[o].apply(e,t)}});var zn=function(e,t,i){return e[t]=i},la=function(e,t,i){return e[t](i)},ws=function(e,t,i,n){return e[t](n.fp,i)},_s=function(e,t,i){return e.setAttribute(t,i)},Si=function(e,t){return U(e[t])?la:wi(e[t])&&e.setAttribute?_s:zn},ca=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},bs=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Hn=function(e,t){var i=t._pt,n="";if(!e&&t.b)n=t.b;else if(e===1&&t.e)n=t.e;else{for(;i;)n=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+n,i=i._next;n+=t.c}t.set(t.t,t.p,n,t)},Rn=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},vs=function(e,t,i,n){for(var r=this._pt,a;r;)a=r._next,r.p===n&&r.modifier(e,t,i),r=a},xs=function(e){for(var t=this._pt,i,n;t;)n=t._next,t.p===e&&!t.op||t.op===e?bi(this,t,"_pt"):t.dep||(i=1),t=n;return!i},Ss=function(e,t,i,n){n.mSet(e,t,n.m.call(n.tween,i,n.mt),n)},Nn=function(e){for(var t=e._pt,i,n,r,a;t;){for(i=t._next,n=r;n&&n.pr>t.pr;)n=n._next;(t._prev=n?n._prev:a)?t._prev._next=t:r=t,(t._next=n)?n._prev=t:a=t,t=i}e._pt=r},ot=(function(){function o(t,i,n,r,a,s,l,c,d){this.t=i,this.s=r,this.c=a,this.p=n,this.r=s||ca,this.d=l||this,this.set=c||zn,this.pr=d||0,this._next=t,t&&(t._prev=this)}var e=o.prototype;return e.modifier=function(i,n,r){this.mSet=this.mSet||this.set,this.set=Ss,this.m=i,this.mt=r,this.tween=n},o})();at(kn+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(o){return An[o]=1});gt.TweenMax=gt.TweenLite=j;gt.TimelineLite=gt.TimelineMax=it;V=new it({sortChildren:!1,defaults:Be,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ht.stringFilter=Ln;var ie=[],ui={},Ts=[],Dr=0,Cs=0,cn=function(e){return(ui[e]||Ts).map(function(t){return t()})},bn=function(){var e=Date.now(),t=[];e-Dr>2&&(cn("matchMediaInit"),ie.forEach(function(i){var n=i.queries,r=i.conditions,a,s,l,c;for(s in n)a=Tt.matchMedia(n[s]).matches,a&&(l=1),a!==r[s]&&(r[s]=a,c=1);c&&(i.revert(),l&&t.push(i))}),cn("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(n){return i.add(null,n)})}),Dr=e,cn("matchMedia"))},da=(function(){function o(t,i){this.selector=i&&yn(i),this.data=[],this._r=[],this.isReverted=!1,this.id=Cs++,t&&this.add(t)}var e=o.prototype;return e.add=function(i,n,r){U(i)&&(r=n,n=i,i=U);var a=this,s=function(){var c=B,d=a.selector,m;return c&&c!==a&&c.data.push(a),r&&(a.selector=yn(r)),B=a,m=n.apply(a,arguments),U(m)&&a._r.push(m),B=c,a.selector=d,a.isReverted=!1,m};return a.last=s,i===U?s(a,function(l){return a.add(null,l)}):i?a[i]=s:s},e.ignore=function(i){var n=B;B=null,i(this),B=n},e.getTweens=function(){var i=[];return this.data.forEach(function(n){return n instanceof o?i.push.apply(i,n.getTweens()):n instanceof j&&!(n.parent&&n.parent.data==="nested")&&i.push(n)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,n){var r=this;if(i?(function(){for(var s=r.getTweens(),l=r.data.length,c;l--;)c=r.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(d){return s.splice(s.indexOf(d),1)}));for(s.map(function(d){return{g:d._dur||d._delay||d._sat&&!d._sat.vars.immediateRender?d.globalTime(0):-1/0,t:d}}).sort(function(d,m){return m.g-d.g||-1/0}).forEach(function(d){return d.t.revert(i)}),l=r.data.length;l--;)c=r.data[l],c instanceof it?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof j)&&c.revert&&c.revert(i);r._r.forEach(function(d){return d(i,r)}),r.isReverted=!0})():this.data.forEach(function(s){return s.kill&&s.kill()}),this.clear(),n)for(var a=ie.length;a--;)ie[a].id===this.id&&ie.splice(a,1)},e.revert=function(i){this.kill(i||{})},o})(),As=(function(){function o(t){this.contexts=[],this.scope=t,B&&B.data.push(this)}var e=o.prototype;return e.add=function(i,n,r){At(i)||(i={matches:i});var a=new da(0,r||this.scope),s=a.conditions={},l,c,d;B&&!a.selector&&(a.selector=B.selector),this.contexts.push(a),n=a.add("onMatch",n),a.queries=i;for(c in i)c==="all"?d=1:(l=Tt.matchMedia(i[c]),l&&(ie.indexOf(a)<0&&ie.push(a),(s[c]=l.matches)&&(d=1),l.addListener?l.addListener(bn):l.addEventListener("change",bn)));return d&&n(a,function(m){return a.add(null,m)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(n){return n.kill(i,!0)})},o})(),yi={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(n){return ia(n)})},timeline:function(e){return new it(e)},getTweensOf:function(e,t){return V.getTweensOf(e,t)},getProperty:function(e,t,i,n){Z(e)&&(e=vt(e)[0]);var r=Gt(e||{}).get,a=i?Br:Gr;return i==="native"&&(i=""),e&&(t?a((lt[t]&&lt[t].get||r)(e,t,i,n)):function(s,l,c){return a((lt[s]&&lt[s].get||r)(e,s,l,c))})},quickSetter:function(e,t,i){if(e=vt(e),e.length>1){var n=e.map(function(d){return rt.quickSetter(d,t,i)}),r=n.length;return function(d){for(var m=r;m--;)n[m](d)}}e=e[0]||{};var a=lt[t],s=Gt(e),l=s.harness&&(s.harness.aliases||{})[t]||t,c=a?function(d){var m=new a;me._pt=0,m.init(e,i?d+i:d,me,0,[e]),m.render(1,m),me._pt&&Rn(1,me)}:s.set(e,l);return a?c:function(d){return c(e,l,i?d+i:d,s,1)}},quickTo:function(e,t,i){var n,r=rt.to(e,yt((n={},n[t]="+=0.1",n.paused=!0,n.stagger=0,n),i||{})),a=function(l,c,d){return r.resetTo(t,l,c,d)};return a.tween=r,a},isTweening:function(e){return V.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=ee(e.ease,Be.ease)),Er(Be,e||{})},config:function(e){return Er(ht,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,n=e.plugins,r=e.defaults,a=e.extendTimeline;(n||"").split(",").forEach(function(s){return s&&!lt[s]&&!gt[s]&&qe(t+" effect requires "+s+" plugin.")}),an[t]=function(s,l,c){return i(vt(s),yt(l||{},r),c)},a&&(it.prototype[t]=function(s,l,c){return this.add(an[t](s,At(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){P[e]=ee(t)},parseEase:function(e,t){return arguments.length?ee(e,t):P},getById:function(e){return V.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new it(e),n,r;for(i.smoothChildTiming=dt(e.smoothChildTiming),V.remove(i),i._dp=0,i._time=i._tTime=V._time,n=V._first;n;)r=n._next,(t||!(!n._dur&&n instanceof j&&n.vars.onComplete===n._targets[0]))&&Ct(i,n,n._start-n._delay),n=r;return Ct(V,i,0),i},context:function(e,t){return e?new da(e,t):B},matchMedia:function(e){return new As(e)},matchMediaRefresh:function(){return ie.forEach(function(e){var t=e.conditions,i,n;for(n in t)t[n]&&(t[n]=!1,i=1);i&&e.revert()})||bn()},addEventListener:function(e,t){var i=ui[e]||(ui[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=ui[e],n=i&&i.indexOf(t);n>=0&&i.splice(n,1)},utils:{wrap:ns,wrapYoyo:rs,distribute:Xr,random:Qr,snap:Zr,normalize:is,getUnit:et,clamp:Qo,splitColor:na,toArray:vt,selector:yn,mapRange:ta,pipe:ts,unitize:es,interpolate:as,shuffle:jr},install:Rr,effects:an,ticker:ct,updateRoot:it.updateRoot,plugins:lt,globalTimeline:V,core:{PropTween:ot,globals:Nr,Tween:j,Timeline:it,Animation:Ue,getCache:Gt,_removeLinkedListItem:bi,reverting:function(){return tt},context:function(e){return e&&B&&(B.data.push(e),e._ctx=B),B},suppressOverwrites:function(e){return vn=e}}};at("to,from,fromTo,delayedCall,set,killTweensOf",function(o){return yi[o]=j[o]});ct.add(it.updateRoot);me=yi.to({},{duration:0});var ks=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},Es=function(e,t){var i=e._targets,n,r,a;for(n in t)for(r=i.length;r--;)a=e._ptLookup[r][n],a&&(a=a.d)&&(a._pt&&(a=ks(a,n)),a&&a.modifier&&a.modifier(t[n],e,i[r],n))},dn=function(e,t){return{name:e,headless:1,rawVars:1,init:function(n,r,a){a._onInit=function(s){var l,c;if(Z(r)&&(l={},at(r,function(d){return l[d]=1}),r=l),t){l={};for(c in r)l[c]=t(r[c]);r=l}Es(s,r)}}}},rt=yi.registerPlugin({name:"attr",init:function(e,t,i,n,r){var a,s,l;this.tween=i;for(a in t)l=e.getAttribute(a)||"",s=this.add(e,"setAttribute",(l||0)+"",t[a],n,r,0,0,a),s.op=a,s.b=l,this._props.push(a)},render:function(e,t){for(var i=t._pt;i;)tt?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},dn("roundProps",wn),dn("modifiers"),dn("snap",Zr))||yi;j.version=it.version=rt.version="3.15.0";Hr=1;xn()&&ye();var Ms=P.Power0,Ps=P.Power1,Ls=P.Power2,Os=P.Power3,Ds=P.Power4,Fs=P.Linear,Ws=P.Quad,zs=P.Cubic,Hs=P.Quart,Rs=P.Quint,Ns=P.Strong,Is=P.Elastic,$s=P.Back,Gs=P.SteppedEase,Bs=P.Bounce,qs=P.Sine,Vs=P.Expo,Ys=P.Circ;var ha,Vt,be,Vn,ce,Us,ua,Yn,Ks=function(){return typeof window<"u"},Wt={},le=180/Math.PI,ve=Math.PI/180,_e=Math.atan2,ma=1e8,Un=/([A-Z])/g,js=/(left|right|width|margin|padding|x)/i,Xs=/[\s,\(]\S/,kt={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},$n=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Zs=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Qs=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Js=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},tl=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},va=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},xa=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},el=function(e,t,i){return e.style[t]=i},il=function(e,t,i){return e.style.setProperty(t,i)},nl=function(e,t,i){return e._gsap[t]=i},rl=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},al=function(e,t,i,n,r){var a=e._gsap;a.scaleX=a.scaleY=i,a.renderTransform(r,a)},ol=function(e,t,i,n,r){var a=e._gsap;a[t]=i,a.renderTransform(r,a)},Y="transform",ut=Y+"Origin",sl=function o(e,t){var i=this,n=this.target,r=n.style,a=n._gsap;if(e in Wt&&r){if(this.tfm=this.tfm||{},e!=="transform")e=kt[e]||e,~e.indexOf(",")?e.split(",").forEach(function(s){return i.tfm[s]=Ft(n,s)}):this.tfm[e]=a.x?a[e]:Ft(n,e),e===ut&&(this.tfm.zOrigin=a.zOrigin);else return kt.transform.split(",").forEach(function(s){return o.call(i,s,t)});if(this.props.indexOf(Y)>=0)return;a.svg&&(this.svgo=n.getAttribute("data-svg-origin"),this.props.push(ut,t,"")),e=Y}(r||t)&&this.props.push(e,t,r[e])},Sa=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},ll=function(){var e=this.props,t=this.target,i=t.style,n=t._gsap,r,a;for(r=0;r<e.length;r+=3)e[r+1]?e[r+1]===2?t[e[r]](e[r+2]):t[e[r]]=e[r+2]:e[r+2]?i[e[r]]=e[r+2]:i.removeProperty(e[r].substr(0,2)==="--"?e[r]:e[r].replace(Un,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)n[a]=this.tfm[a];n.svg&&(n.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),r=Yn(),(!r||!r.isStart)&&!i[Y]&&(Sa(i),n.zOrigin&&i[ut]&&(i[ut]+=" "+n.zOrigin+"px",n.zOrigin=0,n.renderTransform()),n.uncache=1)}},Ta=function(e,t){var i={target:e,props:[],revert:ll,save:sl};return e._gsap||rt.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(n){return i.save(n)}),i},Ca,Gn=function(e,t){var i=Vt.createElementNS?Vt.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Vt.createElement(e);return i&&i.style?i:Vt.createElement(e)},wt=function o(e,t,i){var n=getComputedStyle(e);return n[t]||n.getPropertyValue(t.replace(Un,"-$1").toLowerCase())||n.getPropertyValue(t)||!i&&o(e,xe(t)||t,1)||""},pa="O,Moz,ms,Ms,Webkit".split(","),xe=function(e,t,i){var n=t||ce,r=n.style,a=5;if(e in r&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(pa[a]+e in r););return a<0?null:(a===3?"ms":a>=0?pa[a]:"")+e},Bn=function(){Ks()&&window.document&&(ha=window,Vt=ha.document,be=Vt.documentElement,ce=Gn("div")||{style:{}},Us=Gn("div"),Y=xe(Y),ut=Y+"Origin",ce.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Ca=!!xe("perspective"),Yn=rt.core.reverting,Vn=1)},fa=function(e){var t=e.ownerSVGElement,i=Gn("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=e.cloneNode(!0),r;n.style.display="block",i.appendChild(n),be.appendChild(i);try{r=n.getBBox()}catch{}return i.removeChild(n),be.removeChild(i),r},ga=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},Aa=function(e){var t,i;try{t=e.getBBox()}catch{t=fa(e),i=1}return t&&(t.width||t.height)||i||(t=fa(e)),t&&!t.width&&!t.x&&!t.y?{x:+ga(e,["x","cx","x1"])||0,y:+ga(e,["y","cy","y1"])||0,width:0,height:0}:t},ka=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Aa(e))},Ut=function(e,t){if(t){var i=e.style,n;t in Wt&&t!==ut&&(t=Y),i.removeProperty?(n=t.substr(0,2),(n==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(n==="--"?t:t.replace(Un,"-$1").toLowerCase())):i.removeAttribute(t)}},Yt=function(e,t,i,n,r,a){var s=new ot(e._pt,t,i,0,1,a?xa:va);return e._pt=s,s.b=n,s.e=r,e._props.push(i),s},ya={deg:1,rad:1,turn:1},cl={grid:1,flex:1},Kt=function o(e,t,i,n){var r=parseFloat(i)||0,a=(i+"").trim().substr((r+"").length)||"px",s=ce.style,l=js.test(t),c=e.tagName.toLowerCase()==="svg",d=(c?"client":"offset")+(l?"Width":"Height"),m=100,h=n==="px",p=n==="%",g,u,f,w;if(n===a||!r||ya[n]||ya[a])return r;if(a!=="px"&&!h&&(r=o(e,t,i,"px")),w=e.getCTM&&ka(e),(p||a==="%")&&(Wt[t]||~t.indexOf("adius")))return g=w?e.getBBox()[l?"width":"height"]:e[d],K(p?r/g*m:r/100*g);if(s[l?"width":"height"]=m+(h?a:n),u=n!=="rem"&&~t.indexOf("adius")||n==="em"&&e.appendChild&&!c?e:e.parentNode,w&&(u=(e.ownerSVGElement||{}).parentNode),(!u||u===Vt||!u.appendChild)&&(u=Vt.body),f=u._gsap,f&&p&&f.width&&l&&f.time===ct.time&&!f.uncache)return K(r/f.width*m);if(p&&(t==="height"||t==="width")){var y=e.style[t];e.style[t]=m+n,g=e[d],y?e.style[t]=y:Ut(e,t)}else(p||a==="%")&&!cl[wt(u,"display")]&&(s.position=wt(e,"position")),u===e&&(s.position="static"),u.appendChild(ce),g=ce[d],u.removeChild(ce),s.position="absolute";return l&&p&&(f=Gt(u),f.time=ct.time,f.width=u[d]),K(h?g*r/m:g&&r?m/g*r:0)},Ft=function(e,t,i,n){var r;return Vn||Bn(),t in kt&&t!=="transform"&&(t=kt[t],~t.indexOf(",")&&(t=t.split(",")[0])),Wt[t]&&t!=="transform"?(r=Ze(e,n),r=t!=="transformOrigin"?r[t]:r.svg?r.origin:Ci(wt(e,ut))+" "+r.zOrigin+"px"):(r=e.style[t],(!r||r==="auto"||n||~(r+"").indexOf("calc("))&&(r=Ti[t]&&Ti[t](e,t,i)||wt(e,t)||Mn(e,t)||(t==="opacity"?1:0))),i&&!~(r+"").trim().indexOf(" ")?Kt(e,t,r,i)+i:r},dl=function(e,t,i,n){if(!i||i==="none"){var r=xe(t,e,1),a=r&&wt(e,r,1);a&&a!==i?(t=r,i=a):t==="borderColor"&&(i=wt(e,"borderTopColor"))}var s=new ot(this._pt,e.style,t,0,1,Hn),l=0,c=0,d,m,h,p,g,u,f,w,y,b,v,_;if(s.b=i,s.e=n,i+="",n+="",n.substring(0,6)==="var(--"&&(n=wt(e,n.substring(4,n.indexOf(")")))),n==="auto"&&(u=e.style[t],e.style[t]=n,n=wt(e,t)||n,u?e.style[t]=u:Ut(e,t)),d=[i,n],Ln(d),i=d[0],n=d[1],h=i.match(ne)||[],_=n.match(ne)||[],_.length){for(;m=ne.exec(n);)f=m[0],y=n.substring(l,m.index),g?g=(g+1)%5:(y.substr(-5)==="rgba("||y.substr(-5)==="hsla(")&&(g=1),f!==(u=h[c++]||"")&&(p=parseFloat(u)||0,v=u.substr((p+"").length),f.charAt(1)==="="&&(f=re(p,f)+v),w=parseFloat(f),b=f.substr((w+"").length),l=ne.lastIndex-b.length,b||(b=b||ht.units[t]||v,l===n.length&&(n+=b,s.e+=b)),v!==b&&(p=Kt(e,t,u,b)||0),s._pt={_next:s._pt,p:y||c===1?y:",",s:p,c:w-p,m:g&&g<4||t==="zIndex"?Math.round:0});s.c=l<n.length?n.substring(l,n.length):""}else s.r=t==="display"&&n==="none"?xa:va;return Tn.test(n)&&(s.e=0),this._pt=s,s},wa={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},hl=function(e){var t=e.split(" "),i=t[0],n=t[1]||"50%";return(i==="top"||i==="bottom"||n==="left"||n==="right")&&(e=i,i=n,n=e),t[0]=wa[i]||i,t[1]=wa[n]||n,t.join(" ")},ul=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,n=i.style,r=t.u,a=i._gsap,s,l,c;if(r==="all"||r===!0)n.cssText="",l=1;else for(r=r.split(","),c=r.length;--c>-1;)s=r[c],Wt[s]&&(l=1,s=s==="transformOrigin"?ut:Y),Ut(i,s);l&&(Ut(i,Y),a&&(a.svg&&i.removeAttribute("transform"),n.scale=n.rotate=n.translate="none",Ze(i,1),a.uncache=1,Sa(n)))}},Ti={clearProps:function(e,t,i,n,r){if(r.data!=="isFromStart"){var a=e._pt=new ot(e._pt,t,i,0,0,ul);return a.u=n,a.pr=-10,a.tween=r,e._props.push(i),1}}},Xe=[1,0,0,1,0,0],Ea={},Ma=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},_a=function(e){var t=wt(e,Y);return Ma(t)?Xe:t.substr(7).match(Sn).map(K)},Kn=function(e,t){var i=e._gsap||Gt(e),n=e.style,r=_a(e),a,s,l,c;return i.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?Xe:r):(r===Xe&&!e.offsetParent&&e!==be&&!i.svg&&(l=n.display,n.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,s=e.nextElementSibling,be.appendChild(e)),r=_a(e),l?n.display=l:Ut(e,"display"),c&&(s?a.insertBefore(e,s):a?a.appendChild(e):be.removeChild(e))),t&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},qn=function(e,t,i,n,r,a){var s=e._gsap,l=r||Kn(e,!0),c=s.xOrigin||0,d=s.yOrigin||0,m=s.xOffset||0,h=s.yOffset||0,p=l[0],g=l[1],u=l[2],f=l[3],w=l[4],y=l[5],b=t.split(" "),v=parseFloat(b[0])||0,_=parseFloat(b[1])||0,x,T,C,A;i?l!==Xe&&(T=p*f-g*u)&&(C=v*(f/T)+_*(-u/T)+(u*y-f*w)/T,A=v*(-g/T)+_*(p/T)-(p*y-g*w)/T,v=C,_=A):(x=Aa(e),v=x.x+(~b[0].indexOf("%")?v/100*x.width:v),_=x.y+(~(b[1]||b[0]).indexOf("%")?_/100*x.height:_)),n||n!==!1&&s.smooth?(w=v-c,y=_-d,s.xOffset=m+(w*p+y*u)-w,s.yOffset=h+(w*g+y*f)-y):s.xOffset=s.yOffset=0,s.xOrigin=v,s.yOrigin=_,s.smooth=!!n,s.origin=t,s.originIsAbsolute=!!i,e.style[ut]="0px 0px",a&&(Yt(a,s,"xOrigin",c,v),Yt(a,s,"yOrigin",d,_),Yt(a,s,"xOffset",m,s.xOffset),Yt(a,s,"yOffset",h,s.yOffset)),e.setAttribute("data-svg-origin",v+" "+_)},Ze=function(e,t){var i=e._gsap||new On(e);if("x"in i&&!t&&!i.uncache)return i;var n=e.style,r=i.scaleX<0,a="px",s="deg",l=getComputedStyle(e),c=wt(e,ut)||"0",d,m,h,p,g,u,f,w,y,b,v,_,x,T,C,A,S,E,M,O,F,z,R,H,G,pt,Et,Mt,Q,Pt,W,$;return d=m=h=u=f=w=y=b=v=0,p=g=1,i.svg=!!(e.getCTM&&ka(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(n[Y]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Y]!=="none"?l[Y]:"")),n.scale=n.rotate=n.translate="none"),T=Kn(e,i.svg),i.svg&&(i.uncache?(G=e.getBBox(),c=i.xOrigin-G.x+"px "+(i.yOrigin-G.y)+"px",H=""):H=!t&&e.getAttribute("data-svg-origin"),qn(e,H||c,!!H||i.originIsAbsolute,i.smooth!==!1,T)),_=i.xOrigin||0,x=i.yOrigin||0,T!==Xe&&(E=T[0],M=T[1],O=T[2],F=T[3],d=z=T[4],m=R=T[5],T.length===6?(p=Math.sqrt(E*E+M*M),g=Math.sqrt(F*F+O*O),u=E||M?_e(M,E)*le:0,y=O||F?_e(O,F)*le+u:0,y&&(g*=Math.abs(Math.cos(y*ve))),i.svg&&(d-=_-(_*E+x*O),m-=x-(_*M+x*F))):($=T[6],Pt=T[7],Et=T[8],Mt=T[9],Q=T[10],W=T[11],d=T[12],m=T[13],h=T[14],C=_e($,Q),f=C*le,C&&(A=Math.cos(-C),S=Math.sin(-C),H=z*A+Et*S,G=R*A+Mt*S,pt=$*A+Q*S,Et=z*-S+Et*A,Mt=R*-S+Mt*A,Q=$*-S+Q*A,W=Pt*-S+W*A,z=H,R=G,$=pt),C=_e(-O,Q),w=C*le,C&&(A=Math.cos(-C),S=Math.sin(-C),H=E*A-Et*S,G=M*A-Mt*S,pt=O*A-Q*S,W=F*S+W*A,E=H,M=G,O=pt),C=_e(M,E),u=C*le,C&&(A=Math.cos(C),S=Math.sin(C),H=E*A+M*S,G=z*A+R*S,M=M*A-E*S,R=R*A-z*S,E=H,z=G),f&&Math.abs(f)+Math.abs(u)>359.9&&(f=u=0,w=180-w),p=K(Math.sqrt(E*E+M*M+O*O)),g=K(Math.sqrt(R*R+$*$)),C=_e(z,R),y=Math.abs(C)>2e-4?C*le:0,v=W?1/(W<0?-W:W):0),i.svg&&(H=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!Ma(wt(e,Y)),H&&e.setAttribute("transform",H))),Math.abs(y)>90&&Math.abs(y)<270&&(r?(p*=-1,y+=u<=0?180:-180,u+=u<=0?180:-180):(g*=-1,y+=y<=0?180:-180)),t=t||i.uncache,i.x=d-((i.xPercent=d&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-d)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+a,i.y=m-((i.yPercent=m&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-m)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+a,i.z=h+a,i.scaleX=K(p),i.scaleY=K(g),i.rotation=K(u)+s,i.rotationX=K(f)+s,i.rotationY=K(w)+s,i.skewX=y+s,i.skewY=b+s,i.transformPerspective=v+a,(i.zOrigin=parseFloat(c.split(" ")[2])||!t&&i.zOrigin||0)&&(n[ut]=Ci(c)),i.xOffset=i.yOffset=0,i.force3D=ht.force3D,i.renderTransform=i.svg?pl:Ca?Pa:ml,i.uncache=0,i},Ci=function(e){return(e=e.split(" "))[0]+" "+e[1]},In=function(e,t,i){var n=et(t);return K(parseFloat(t)+parseFloat(Kt(e,"x",i+"px",n)))+n},ml=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,Pa(e,t)},oe="0deg",je="0px",se=") ",Pa=function(e,t){var i=t||this,n=i.xPercent,r=i.yPercent,a=i.x,s=i.y,l=i.z,c=i.rotation,d=i.rotationY,m=i.rotationX,h=i.skewX,p=i.skewY,g=i.scaleX,u=i.scaleY,f=i.transformPerspective,w=i.force3D,y=i.target,b=i.zOrigin,v="",_=w==="auto"&&e&&e!==1||w===!0;if(b&&(m!==oe||d!==oe)){var x=parseFloat(d)*ve,T=Math.sin(x),C=Math.cos(x),A;x=parseFloat(m)*ve,A=Math.cos(x),a=In(y,a,T*A*-b),s=In(y,s,-Math.sin(x)*-b),l=In(y,l,C*A*-b+b)}f!==je&&(v+="perspective("+f+se),(n||r)&&(v+="translate("+n+"%, "+r+"%) "),(_||a!==je||s!==je||l!==je)&&(v+=l!==je||_?"translate3d("+a+", "+s+", "+l+") ":"translate("+a+", "+s+se),c!==oe&&(v+="rotate("+c+se),d!==oe&&(v+="rotateY("+d+se),m!==oe&&(v+="rotateX("+m+se),(h!==oe||p!==oe)&&(v+="skew("+h+", "+p+se),(g!==1||u!==1)&&(v+="scale("+g+", "+u+se),y.style[Y]=v||"translate(0, 0)"},pl=function(e,t){var i=t||this,n=i.xPercent,r=i.yPercent,a=i.x,s=i.y,l=i.rotation,c=i.skewX,d=i.skewY,m=i.scaleX,h=i.scaleY,p=i.target,g=i.xOrigin,u=i.yOrigin,f=i.xOffset,w=i.yOffset,y=i.forceCSS,b=parseFloat(a),v=parseFloat(s),_,x,T,C,A;l=parseFloat(l),c=parseFloat(c),d=parseFloat(d),d&&(d=parseFloat(d),c+=d,l+=d),l||c?(l*=ve,c*=ve,_=Math.cos(l)*m,x=Math.sin(l)*m,T=Math.sin(l-c)*-h,C=Math.cos(l-c)*h,c&&(d*=ve,A=Math.tan(c-d),A=Math.sqrt(1+A*A),T*=A,C*=A,d&&(A=Math.tan(d),A=Math.sqrt(1+A*A),_*=A,x*=A)),_=K(_),x=K(x),T=K(T),C=K(C)):(_=m,C=h,x=T=0),(b&&!~(a+"").indexOf("px")||v&&!~(s+"").indexOf("px"))&&(b=Kt(p,"x",a,"px"),v=Kt(p,"y",s,"px")),(g||u||f||w)&&(b=K(b+g-(g*_+u*T)+f),v=K(v+u-(g*x+u*C)+w)),(n||r)&&(A=p.getBBox(),b=K(b+n/100*A.width),v=K(v+r/100*A.height)),A="matrix("+_+","+x+","+T+","+C+","+b+","+v+")",p.setAttribute("transform",A),y&&(p.style[Y]=A)},fl=function(e,t,i,n,r){var a=360,s=Z(r),l=parseFloat(r)*(s&&~r.indexOf("rad")?le:1),c=l-n,d=n+c+"deg",m,h;return s&&(m=r.split("_")[1],m==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),m==="cw"&&c<0?c=(c+a*ma)%a-~~(c/a)*a:m==="ccw"&&c>0&&(c=(c-a*ma)%a-~~(c/a)*a)),e._pt=h=new ot(e._pt,t,i,n,c,Zs),h.e=d,h.u="deg",e._props.push(i),h},ba=function(e,t){for(var i in t)e[i]=t[i];return e},gl=function(e,t,i){var n=ba({},i._gsap),r="perspective,force3D,transformOrigin,svgOrigin",a=i.style,s,l,c,d,m,h,p,g;n.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),a[Y]=t,s=Ze(i,1),Ut(i,Y),i.setAttribute("transform",c)):(c=getComputedStyle(i)[Y],a[Y]=t,s=Ze(i,1),a[Y]=c);for(l in Wt)c=n[l],d=s[l],c!==d&&r.indexOf(l)<0&&(p=et(c),g=et(d),m=p!==g?Kt(i,l,c,g):parseFloat(c),h=parseFloat(d),e._pt=new ot(e._pt,s,l,m,h-m,$n),e._pt.u=g||0,e._props.push(l));ba(s,n)};at("padding,margin,Width,Radius",function(o,e){var t="Top",i="Right",n="Bottom",r="Left",a=(e<3?[t,i,n,r]:[t+r,t+i,n+i,n+r]).map(function(s){return e<2?o+s:"border"+s+o});Ti[e>1?"border"+o:o]=function(s,l,c,d,m){var h,p;if(arguments.length<4)return h=a.map(function(g){return Ft(s,g,c)}),p=h.join(" "),p.split(h[0]).length===5?h[0]:p;h=(d+"").split(" "),p={},a.forEach(function(g,u){return p[g]=h[u]=h[u]||h[(u-1)/2|0]}),s.init(l,p,m)}});var jn={name:"css",register:Bn,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,n,r){var a=this._props,s=e.style,l=i.vars.startAt,c,d,m,h,p,g,u,f,w,y,b,v,_,x,T,C,A;Vn||Bn(),this.styles=this.styles||Ta(e),C=this.styles.props,this.tween=i;for(u in t)if(u!=="autoRound"&&(d=t[u],!(lt[u]&&Fn(u,t,i,n,e,r)))){if(p=typeof d,g=Ti[u],p==="function"&&(d=d.call(i,n,e,r),p=typeof d),p==="string"&&~d.indexOf("random(")&&(d=we(d)),g)g(this,e,u,d,i)&&(T=1);else if(u.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(u)+"").trim(),d+="",Ot.lastIndex=0,Ot.test(c)||(f=et(c),w=et(d),w?f!==w&&(c=Kt(e,u,c,w)+w):f&&(d+=f)),this.add(s,"setProperty",c,d,n,r,0,0,u),a.push(u),C.push(u,0,s[u]);else if(p!=="undefined"){if(l&&u in l?(c=typeof l[u]=="function"?l[u].call(i,n,e,r):l[u],Z(c)&&~c.indexOf("random(")&&(c=we(c)),et(c+"")||c==="auto"||(c+=ht.units[u]||et(Ft(e,u))||""),(c+"").charAt(1)==="="&&(c=Ft(e,u))):c=Ft(e,u),h=parseFloat(c),y=p==="string"&&d.charAt(1)==="="&&d.substr(0,2),y&&(d=d.substr(2)),m=parseFloat(d),u in kt&&(u==="autoAlpha"&&(h===1&&Ft(e,"visibility")==="hidden"&&m&&(h=0),C.push("visibility",0,s.visibility),Yt(this,s,"visibility",h?"inherit":"hidden",m?"inherit":"hidden",!m)),u!=="scale"&&u!=="transform"&&(u=kt[u],~u.indexOf(",")&&(u=u.split(",")[0]))),b=u in Wt,b){if(this.styles.save(u),A=d,p==="string"&&d.substring(0,6)==="var(--"){if(d=wt(e,d.substring(4,d.indexOf(")"))),d.substring(0,5)==="calc("){var S=e.style.perspective;e.style.perspective=d,d=wt(e,"perspective"),S?e.style.perspective=S:Ut(e,"perspective")}m=parseFloat(d)}if(v||(_=e._gsap,_.renderTransform&&!t.parseTransform||Ze(e,t.parseTransform),x=t.smoothOrigin!==!1&&_.smooth,v=this._pt=new ot(this._pt,s,Y,0,1,_.renderTransform,_,0,-1),v.dep=1),u==="scale")this._pt=new ot(this._pt,_,"scaleY",_.scaleY,(y?re(_.scaleY,y+m):m)-_.scaleY||0,$n),this._pt.u=0,a.push("scaleY",u),u+="X";else if(u==="transformOrigin"){C.push(ut,0,s[ut]),d=hl(d),_.svg?qn(e,d,0,x,0,this):(w=parseFloat(d.split(" ")[2])||0,w!==_.zOrigin&&Yt(this,_,"zOrigin",_.zOrigin,w),Yt(this,s,u,Ci(c),Ci(d)));continue}else if(u==="svgOrigin"){qn(e,d,1,x,0,this);continue}else if(u in Ea){fl(this,_,u,h,y?re(h,y+d):d);continue}else if(u==="smoothOrigin"){Yt(this,_,"smooth",_.smooth,d);continue}else if(u==="force3D"){_[u]=d;continue}else if(u==="transform"){gl(this,d,e);continue}}else u in s||(u=xe(u)||u);if(b||(m||m===0)&&(h||h===0)&&!Xs.test(d)&&u in s)f=(c+"").substr((h+"").length),m||(m=0),w=et(d)||(u in ht.units?ht.units[u]:f),f!==w&&(h=Kt(e,u,c,w)),this._pt=new ot(this._pt,b?_:s,u,h,(y?re(h,y+m):m)-h,!b&&(w==="px"||u==="zIndex")&&t.autoRound!==!1?tl:$n),this._pt.u=w||0,b&&A!==d?(this._pt.b=c,this._pt.e=A,this._pt.r=Js):f!==w&&w!=="%"&&(this._pt.b=c,this._pt.r=Qs);else if(u in s)dl.call(this,e,u,c,y?y+d:d);else if(u in e)this.add(e,u,c||e[u],y?y+d:d,n,r);else if(u!=="parseTransform"){_i(u,d);continue}b||(u in s?C.push(u,0,s[u]):typeof e[u]=="function"?C.push(u,2,e[u]()):C.push(u,1,c||e[u])),a.push(u)}}T&&Nn(this)},render:function(e,t){if(t.tween._time||!Yn())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Ft,aliases:kt,getSetter:function(e,t,i){var n=kt[t];return n&&n.indexOf(",")<0&&(t=n),t in Wt&&t!==ut&&(e._gsap.x||Ft(e,"x"))?i&&ua===i?t==="scale"?rl:nl:(ua=i||{})&&(t==="scale"?al:ol):e.style&&!wi(e.style[t])?el:~t.indexOf("-")?il:Si(e,t)},core:{_removeProperty:Ut,_getMatrix:Kn}};rt.utils.checkPrefix=xe;rt.core.getStyleSaver=Ta;(function(o,e,t,i){var n=at(o+","+e+","+t,function(r){Wt[r]=1});at(e,function(r){ht.units[r]="deg",Ea[r]=1}),kt[n[13]]=o+","+e,at(i,function(r){var a=r.split(":");kt[a[1]]=n[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");at("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(o){ht.units[o]="px"});rt.registerPlugin(jn);var Xn=rt.registerPlugin(jn)||rt,Rc=Xn.core.Tween;var Zn={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},mt={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},Qn={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},Jn={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"};var La={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},Se={humidity:"65%",windSpeed:"10 km/h",pressure:"1013 hPa",indoorTemperature:"22\xB0",indoorHumidity:"45%"},Oa="1.2.0",Da={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function yl(o){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(o)}function Fa(o,e=-1/0,t=1/0){return typeof o=="number"&&!isNaN(o)&&o>=e&&o<=t}function Je(o){return typeof o!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(o)||/^rgba?\(\s*[\d.,%\s/]+\)$/.test(o)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(o.toLowerCase())}function D(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Te(o,e){return Object.prototype.hasOwnProperty.call(o,e)?o[e]:void 0}function zt(o,e,t=0){if(!isFinite(o))return"--";let i=e?.locale?.language||e?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(i,{minimumFractionDigits:t,maximumFractionDigits:t}).format(o)}catch{return o.toFixed(t)}}function Ai(o,e,t){if(o?.localize)try{let i=o.localize(e);if(i&&i!==e)return i}catch{}return t}function Wa(o,e){if(!isFinite(o))return 0;switch((e||"km/h").toLowerCase()){case"m/s":return o*3.6;case"mph":return o*1.609344;case"ft/s":return o*1.09728;case"kn":case"kt":case"knots":return o*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,o),1.5)*3.6;default:return o}}function k(o,e,...t){o&&console.log(`[AWC Dev] ${e}`,...t)}function J(o,e){let t=o.engine_settings||{},i=(a,s,l,c)=>Fa(a,l,c)?a:s,n=i(t.windSpeed,mt.windSpeed,.1,15),r=n;return Fa(e,0,200)&&(r=Math.max(.1,Math.min(15,e/10*n))),{windSpeed:r,rainCount:i(t.rainCount,mt.rainCount,.1,10),leafCount:i(t.leafCount,mt.leafCount,.1,10),snowCount:i(t.snowCount,mt.snowCount,.1,10),cloudBaseSize:i(t.cloudBaseSize,mt.cloudBaseSize,.3,2.5),cloudCount:i(t.cloudCount,mt.cloudCount,1,20),splashBounce:i(t.splashBounce,mt.splashBounce,40,120)}}function tr(o){o.forEach(e=>{e!=null&&clearTimeout(e)}),o.length=0}function za(o){let e=new Set;return o.querySelectorAll("*").forEach(t=>{window.AnimatedWeatherCardGsap.getTweensOf(t).forEach(i=>{let n=i;for(;n.parent?.parent;)n=n.parent;e.add(n)})}),e}function ki(o){window.AnimatedWeatherCardGsap&&za(o).forEach(e=>e.pause())}function Ei(o){window.AnimatedWeatherCardGsap&&za(o).forEach(e=>e.resume())}function er(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)})}function Mi(o,e,t,i,n,r={}){if(typeof o!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(e&&yl(o))return o;if(e)return console.warn(`Invalid dev mode condition: ${o}, using sunny`),"sunny";let a=o.toLowerCase();if(a.includes("sleet")&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"sleety-stormy";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"snowy-stormy";if(a.includes("lightning")||a.includes("thunder")||a.includes("storm"))return"stormy";if(a.includes("fog")||a.includes("mist"))return"foggy";if(a.includes("heavy")&&a.includes("rain"))return"pouring";if(a.includes("pouring")||a.includes("downpour"))return"pouring";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("rain")||a.includes("drizzle")))return"snowy-rainy";if(a.includes("light")&&(a.includes("rain")||a.includes("drizzle")))return"light-rain";if(a.includes("rain")||a.includes("drizzle"))return"rainy";if(a.includes("sleet")||a.includes("hail"))return"sleety";if(a.includes("snow"))return"snowy";if(a.includes("wind"))return"windy";if(a.includes("partly")&&a.includes("cloud"))return"partly-cloudy";if(a.includes("cloud")||a.includes("overcast"))return"cloudy";if(a.includes("clear")||a.includes("sunny")){if(!r.clock){if(a.includes("night"))return"clear-night";if(a.includes("sunny"))return"sunny";if(r.night!==void 0)return r.night?"clear-night":"sunny"}let s=new Date,l;if(n)try{let h=new Intl.DateTimeFormat("en-US",{timeZone:n,hour:"numeric",hour12:!1}).formatToParts(s);l=parseInt(h.find(p=>p.type==="hour")?.value||"0",10)}catch{l=s.getHours()}else l=s.getHours();let c=t??6,d=i??20;return(l<c||l>=d)&&a.includes("clear")?"clear-night":"sunny"}return"sunny"}function ti(o,e,t){if(typeof o!="string"||!o.trim())return console.warn("Invalid animation type provided"),t||Qe("rain");if(!e||!e.isEnabled())return t||Qe(o);let i=Da[o];if(!i)return console.warn(`No color scheme found for animation type: ${o}`),t||Qe(o);try{let n=e.getCurrentState(),r=e.getTimeAwareColor(i);return Je(r)?r:(console.warn(`Invalid color returned from time manager: ${r}`),t||Qe(o))}catch(n){return console.error("Error getting time-aware color:",n),t||Qe(o)}}function Qe(o){let t={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[o];return t||(console.warn(`Unknown animation type: ${o}, using white as fallback`),"#FFFFFF")}var Pi=class Pi{constructor(e,t,i){this.animationHandles=[];this.timeouts=[];this.particles=[];this.element=e,this.config=t,this.cardConfig=i,this.state="created",queueMicrotask(()=>k(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){k(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),k(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(e){throw console.error(`Failed to start ${this.animationType} animation:`,e),this.setState("stopped"),e}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),k(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(e){throw console.error(`Failed to stop ${this.animationType} animation:`,e),e}}async pause(){if(this.state==="active")try{k(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(e){throw console.error(`Failed to pause ${this.animationType} animation:`,e),e}}async resume(){if(this.state==="paused")try{k(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(e){throw console.error(`Failed to resume ${this.animationType} animation:`,e),this.setState("paused"),e}}setWindSpeed(e){this.realWindSpeed=e,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),k(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}setState(e){let t=this.state;this.state=e,k(this.config.devMode,`${this.animationType} state: ${t} \u2192 ${e}`)}ensureLayerVisibility(e){if(this.containerSelector){let i=this.element.querySelector(this.containerSelector);i&&(i.style.display=e?"block":"none",k(this.config.devMode,`Set ${this.animationType} container visibility: ${e}`))}let t=this.element.querySelector(this.layerSelector);t&&!Pi.SHARED_LAYERS.includes(this.layerSelector)&&(t.style.opacity=e?"1":"0",k(this.config.devMode,`Set ${this.animationType} layer opacity: ${e?1:0}`))}cleanup(){this.animationHandles.forEach(e=>{e&&clearInterval(e)}),this.animationHandles=[],this.timeouts.forEach(e=>{if(e)if(typeof e=="function"){let t=e();t&&clearTimeout(t)}else clearTimeout(e)}),this.timeouts=[],window.AnimatedWeatherCardGsap&&this.particles.forEach(e=>{window.AnimatedWeatherCardGsap.killTweensOf(e)}),this.particles.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.particles=[],k(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(e){this.animationHandles.push(e)}addTimeout(e){this.timeouts.push(e)}addParticle(e){this.particles.push(e)}removeParticle(e){let t=this.particles.indexOf(e);t>-1&&this.particles.splice(t,1)}};Pi.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var X=Pi;var jt=class{constructor(e,t,i){this.layer=e;this.create=t;this.cycle=i;this.items=[];this.running=!1;this.paused=!1}start(e){this.running=!0;let t=[];for(let i=0;i<e;i++){let n=this.create(i);this.layer.appendChild(n);let r={el:n};this.items.push(r),t.push(n),this.run(r,!0)}return t}run(e,t){this.running&&(e.anim=this.cycle(e.el,()=>this.run(e,!1),t),this.paused&&e.anim.pause())}pause(){this.paused=!0,this.items.forEach(e=>e.anim?.pause())}resume(){this.paused=!1,this.items.forEach(e=>e.anim?.resume())}stop(){this.running=!1,this.items.forEach(e=>{e.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(e.el),e.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(e=>e.el)}};function Ce(o,e){return e&&o.progress(Math.random()),o}var wl=420*230;function Ae(o,e){return Math.min(3,Math.max(.6,o*e/wl))||1}function L(o,e){return o+Math.random()*(e-o)}var _l={light:10,rain:18,storm:24,pouring:32},bl={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},vl={light:16,rain:24,storm:34,pouring:42},xl=.3,Sl=16,Tl=8,Cl=[10,30],Ha="http://www.w3.org/2000/svg";function Al(o,e,t,i){let n=0,r=0,a=0;for(let s=1;s<=16;s++){let l=s/16,c=2*(1-l)*l*o+l*l*t,d=2*(1-l)*l*e+l*l*i;n+=Math.hypot(c-r,d-a),r=c,a=d}return n}function kl(o,e,t,i){return Math.max(4,Math.round(_l[o]*e*Ae(t,i)))}var Li=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=r,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...i},k(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start rain animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Rain layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=this.rainKind(),a=kl(r,i.rainCount,n.offsetWidth,n.offsetHeight),s=this.getRainColor(this.element.timeOfDayManager),l=this.cardConfig.spill_particles!==!1,c=vl[r],d=r==="pouring"?3:2.4;this.splashLayer=t,this.splashColor=s,this.splashBounce=i.splashBounce/mt.splashBounce,this.pool=new jt(t,()=>{let m=L(1,d),h=document.createElement("div");return h.className="raindrop",h.style.cssText=`
                    width: ${m.toFixed(2)}px;
                    height: ${c}px;
                    background: linear-gradient(0deg, ${s}, transparent);
                    border-radius: ${m.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,h.dataset.width=m.toFixed(2),h},(m,h,p)=>this.fall(m,n,r,c,l,h,p)),this.pool.start(a).forEach(m=>this.addParticle(m)),k(this.config.devMode,`Rain animation started - ${a} drops (${r})`)}fall(t,i,n,r,a,s,l){let c=i.offsetWidth,d=i.offsetHeight,[m,h]=bl[n],p=L(m,h),g=L(6,Math.max(7,c-6)),u=this.rainConfig.splashEnabled&&Math.random()<xl,f=-r,w=u?d-r:a?d+L(60,120):d,y=Math.max(.25,(w-f)/p),b=parseFloat(t.dataset.width||"2");window.AnimatedWeatherCardGsap.set(t,{x:g,scaleY:1,opacity:.55+.45*Math.min(1,b/2.4)});let v=window.AnimatedWeatherCardGsap.timeline({onComplete:s});if(v.fromTo(t,{y:f},{y:w,duration:y,ease:"none"}),u)v.call(()=>this.createSplash(g+b/2,d),[],y),v.to(t,{scaleY:0,duration:r/p,ease:"none"},y);else if(a){let _=(d-r-f)/p;v.to(t,{opacity:0,duration:y-_,ease:"power1.in"},_)}return Ce(v,l)}async onStop(){this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()}),this.splashDots=[],this.rebounds.forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf([t,t.firstChild]),t.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(t=>t.remove()),k(this.config.devMode,"Rain animation stopped")}async onPause(){this.pool?.pause(),k(this.config.devMode,"Rain animation paused")}async onResume(){this.pool?.resume(),k(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(t,i){if(!(!window.AnimatedWeatherCardGsap||!this.splashLayer)){this.createRebound(t,i);for(let n of[-1,1]){let r=this.splashDots[this.nextSplashDot];r||(r=document.createElement("div"),r.className="rain-splash",r.style.background=this.splashColor,this.splashLayer.appendChild(r),this.splashDots[this.nextSplashDot]=r),this.nextSplashDot=(this.nextSplashDot+1)%Sl;let a=L(.22,.28),s=L(4,10)*this.splashBounce,l=n*L(6,12)*this.splashBounce;window.AnimatedWeatherCardGsap.killTweensOf(r),window.AnimatedWeatherCardGsap.set(r,{x:t-1,y:i-2,opacity:.9}),window.AnimatedWeatherCardGsap.timeline().to(r,{x:t-1+l,duration:a,ease:"power1.out"},0).to(r,{y:i-2-s,duration:a*.45,ease:"power2.out"},0).to(r,{y:i-2,duration:a*.55,ease:"power2.in"},a*.45).to(r,{opacity:0,duration:a*.4,ease:"power1.in"},a*.6)}}}createRebound(t,i){let n=this.splashLayer,r=this.rebounds[this.nextRebound];if(!r){r=document.createElementNS(Ha,"svg"),r.classList.add("rain-rebound");let u=document.createElementNS(Ha,"path");u.setAttribute("fill","none"),u.style.stroke=this.splashColor,r.appendChild(u),n.appendChild(r),this.rebounds[this.nextRebound]=r}this.nextRebound=(this.nextRebound+1)%Tl;let a=r.firstChild,[s,l]=Cl,c=L(s,l)*this.splashBounce,d=(Math.random()<.5?-1:1)*L(10,24)*this.splashBounce,m=L(6,18);a.setAttribute("d",`M 0,0 Q ${d.toFixed(1)},${(-2*c).toFixed(1)} ${(2*d).toFixed(1)},${m.toFixed(1)}`);let h=Al(d,-2*c,2*d,m),p=Math.min(h*.45,6+c*.3);a.style.strokeDasharray=`${p.toFixed(1)} ${(h+p).toFixed(1)}`;let g=L(.42,.56);window.AnimatedWeatherCardGsap.killTweensOf([r,a]),window.AnimatedWeatherCardGsap.set(r,{x:t,y:i,opacity:.85}),window.AnimatedWeatherCardGsap.timeline().fromTo(a,{strokeDashoffset:p,strokeWidth:1.6},{strokeDashoffset:-h,strokeWidth:.6,duration:g,ease:"power2.out"},0).to(r,{opacity:0,duration:g*.35,ease:"power1.in"},g*.65)}getRainColor(t){return this.rainConfig.isStorm?ti("lightning",t,"var(--weather-storm-rain-color)"):ti("rain",t,"var(--weather-rain-color)")}};var El=36,Xt=[2,6],ir=[20,38],Ra=10,Ml=.6;function Pl(o,e,t){return Math.max(6,Math.round(El*o*Ae(e,t)))}function rr(o){return Math.min(2.2,Math.max(.3,o/mt.windSpeed))}var Oi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.swings=[];this.realWindSpeed=r,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...i},k(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start snow animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Snow layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=Pl(i.snowCount,n.offsetWidth,n.offsetHeight),a="#ffffff",s=this.cardConfig.spill_particles!==!1,l=rr(i.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation(),this.pool=new jt(t,()=>this.createFlake(a),(c,d,m)=>this.fall(c,n,l,s,d,m)),this.pool.start(r).forEach(c=>this.addParticle(c)),k(this.config.devMode,`Snow animation started - ${r} flakes`)}createFlake(t){let i=L(Xt[0],Xt[1]),n=(i-Xt[0])/(Xt[1]-Xt[0]),r=document.createElement("div");r.className="snowflake",r.dataset.size=i.toFixed(2),r.style.cssText=`
            width: ${i.toFixed(2)}px;
            height: ${i.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${t}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,r.dataset.opacity=(.45+.45*n).toFixed(2),window.AnimatedWeatherCardGsap.set(r,{transformOrigin:"50% -500%",rotation:-Ra});let a=window.AnimatedWeatherCardGsap.to(r,{rotation:Ra,duration:L(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return a.progress(Math.random()),this.swings.push(a),r}fall(t,i,n,r,a,s){let l=i.offsetWidth,c=i.offsetHeight,d=parseFloat(t.dataset.size||"4"),m=(d-Xt[0])/(Xt[1]-Xt[0]),h=(ir[0]+(ir[1]-ir[0])*m)*L(.9,1.1),p=this.snowConfig.accumulation&&Math.random()<Ml,g=-d*2,u=p?c-this.pileHeight()-d:r?c+L(60,120):c+d,f=u-g,w=Math.max(.5,f/h),y=f*L(.04,.13)*n,b=L(-y,Math.max(1,l-d));window.AnimatedWeatherCardGsap.set(t,{x:b,opacity:parseFloat(t.dataset.opacity||"0.7")});let v=window.AnimatedWeatherCardGsap.timeline({onComplete:a});if(v.fromTo(t,{y:g},{y:u,x:b+y,duration:w,ease:"none"}),p)v.call(()=>this.addToAccumulation(),[],w),v.to(t,{opacity:0,duration:.6,ease:"power1.out"},w);else if(r){let _=Math.min(w,(c-g)/h);v.to(t,{opacity:0,duration:Math.max(.1,w-_),ease:"power1.in"},_)}return Ce(v,s)}async onStop(){this.swings.forEach(t=>t.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),k(this.config.devMode,"Snow animation stopped")}async onPause(){this.pool?.pause(),this.swings.forEach(t=>t.pause()),k(this.config.devMode,"Snow animation paused")}async onResume(){this.pool?.resume(),this.swings.forEach(t=>t.resume()),k(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let t=this.element.querySelector(".animated-weather-card");if(!t)return;t.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(n=>n.remove());let i=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
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
        `,t.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let t=this.accumulationElement,i=this.snowConfig.accumulationHeight;if(!t?.parentNode||i<=0)return;let n=this.pileHeight();if(n>=i)return;let r=Math.min(i,n+.8);t.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(t,{scaleY:r/i,opacity:Math.min(.9,r/i),duration:.3,ease:"power2.out"})}};var Ll=30,Na=[150,230],Ol=.3,Di=6,Fi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.realWindSpeed=r,this.sleetConfig={particleCount:40,...i},k(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start sleet animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),r=Math.max(6,Math.round(Ll*i.snowCount*Ae(n.offsetWidth,n.offsetHeight))),a=this.cardConfig.spill_particles!==!1,s=rr(i.windSpeed)*.5;this.pool=new jt(t,()=>{let l=L(1.5,3.5),c=document.createElement("div");return c.className="sleet-particle-gsap",c.dataset.size=l.toFixed(2),c.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${l.toFixed(2)}px;
                    height: ${l.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,c},(l,c,d)=>this.fall(l,n,s,a,c,d)),this.pool.start(r).forEach(l=>this.addParticle(l)),k(this.config.devMode,`Sleet animation started - ${r} pellets`)}fall(t,i,n,r,a,s){let l=i.offsetWidth,c=i.offsetHeight,d=parseFloat(t.dataset.size||"2"),m=L(Na[0],Na[1]),h=Math.random()<Ol,p=-d*2,g=h?c-d:r?c+L(60,120):c+d,u=g-p,f=Math.max(.3,u/m),w=u*L(.03,.08)*n,y=L(-w,Math.max(1,l-d));window.AnimatedWeatherCardGsap.set(t,{x:y,opacity:L(.8,1),rotation:L(0,360)});let b=window.AnimatedWeatherCardGsap.timeline({onComplete:a});if(b.fromTo(t,{y:p},{y:g,x:y+w,duration:f,ease:"none"}),h)b.call(()=>this.addToPile(i),[],f),b.to(t,{opacity:0,duration:.3,ease:"power1.out"},f);else if(r){let v=Math.min(f,(c-p)/m);b.to(t,{opacity:0,duration:Math.max(.1,f-v),ease:"power1.in"},v)}return Ce(b,s)}addToPile(t){if(this.state!=="active")return;let i=t.querySelector(".sleet-accumulation");i||(i=document.createElement("div"),i.className="sleet-accumulation",i.style.cssText=`
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${Di}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `,t.appendChild(i));let n=parseFloat(i.getAttribute("data-target-height")||"0");if(n>=Di)return;let r=Math.min(Di,n+.4);i.setAttribute("data-target-height",String(r)),window.AnimatedWeatherCardGsap.to(i,{scaleY:r/Di,duration:.3,ease:"power2.out"})}async onStop(){this.pool?.stop(),this.pool=void 0;let t=this.element.querySelector(".animated-weather-card");t&&t.querySelectorAll(".sleet-accumulation").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),k(this.config.devMode,"Sleet animation stopped")}async onPause(){this.pool?.pause(),k(this.config.devMode,"Sleet animation paused")}async onResume(){this.pool?.resume(),k(this.config.devMode,"Sleet animation resumed")}};function Ia(o,e,t,i){return t!==null&&t>0?o*Math.max(0,t-e):o*.6*i}var ar=[90,160];function Ga(o,e,t,i,n,r=!0){let a=document.createElement("div");a.className="leaf-gsap";let s=i.offsetWidth,l=i.offsetHeight,c=20+Math.random()*Math.max(40,l-40),d=Math.random(),m=d<.25,h=d>.8&&c>100;a.style.position="absolute",a.style.borderRadius="0 100% 0 100%",a.style.transformOrigin="center",a.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let p=(Math.random()*8+6)*t;a.style.width=a.style.height=p+"px";let g=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];a.style.background=g[Math.floor(Math.random()*g.length)];let u=-p-10,f=s+(r?60+Math.random()*80:p+10),w=(ar[0]+Math.random()*(ar[1]-ar[0]))*ke(e.windSpeed)*(m?.6:1),y=(f-u)/w,b=Math.min(y,(s-u)/w),v=h?-(60+Math.random()*80):m?80+Math.random()*80:(Math.random()-.5)*80;window.AnimatedWeatherCardGsap.set(a,{x:u,y:c,rotation:Math.random()*360,opacity:0}),o.appendChild(a);let _=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{a.parentNode&&a.parentNode.removeChild(a),n&&n(a)}});return _.to(a,{opacity:.85,duration:.25,ease:"power1.out"},0).to(a,{x:f,duration:y,ease:"none"},0).to(a,{y:c+v,duration:y,ease:m?"sine.in":"sine.inOut"},0).to(a,{rotation:`+=${120+Math.random()*180}`,duration:y,ease:"none"},0),r&&y>b&&_.to(a,{opacity:0,duration:y-b,ease:"power1.in"},b),a}function Ba(o,e,t,i,n,r){let a=document.createElement("div");a.className="wind-swoosh-gsap";let s=Math.random(),l=s>.6,c=s>.8;a.style.position="absolute",a.style.height=(c?2:1)*t+"px",a.style.borderRadius=l?"2px 1px":"1px",a.style.transformOrigin="left center",a.style.zIndex="10";let d=n.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";a.style.background=`linear-gradient(90deg, transparent 0%, ${d} 50%, transparent 100%)`;let m=Math.max(15,(20+Math.random()*60)*t);a.style.width=m+"px";let h=i.offsetWidth,p=i.offsetHeight,g=p*.15+Math.random()*(p*.7);window.AnimatedWeatherCardGsap.set(a,{x:-m,y:g,rotation:l?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),o.appendChild(a);let f=(h+m*2)/(Dl*ke(e.windSpeed));return window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{a.parentNode&&a.parentNode.removeChild(a),r&&r(a)}}).to(a,{scaleX:1,opacity:c?.35:.22,duration:.3,ease:"power2.out"},0).to(a,{x:h+m,rotation:l?g>p/2?5:-5:0,duration:f,ease:"none"},0).to(a,{opacity:0,scaleX:.3,duration:Math.min(.5,f*.3)},f-Math.min(.5,f*.3)),a}var Dl=230,Fl=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function ke(o){return Math.min(2.2,Math.max(.6,Math.sqrt(o/mt.windSpeed)))}var Wl=12;function zl(o){let e=Math.round(70*o),t=Math.round(35*o);return{width:e,height:Math.round(26*o),puffs:[{x:Math.round(9*o),y:Math.round(-22*o),size:Math.round(44*o)},{x:e-Math.round(9*o)-t,y:Math.round(-13*o),size:t}]}}var qa=o=>o>0?Math.ceil(o*3)+1:0,$a=new Map;function Hl(o,e,t,i){let n=[o,e,t,i].join(","),r=$a.get(n);if(r)return r;let a=qa(t),s=Math.ceil((o+2*a)*i),l=Math.ceil((e+2*a)*i),c=()=>{let p=document.createElement("canvas");return p.width=s,p.height=l,[p,p.getContext("2d")]},d=null,[m,h]=c();if(h){let[p,g,u]=[a*i,a*i,Math.min(50,o/2,e/2)*i],[f,w]=[p+o*i,g+e*i];if(h.fillStyle="#000",h.beginPath(),h.moveTo(p+u,g),h.arcTo(f,g,f,w,u),h.arcTo(f,w,p,w,u),h.arcTo(p,w,p,g,u),h.arcTo(p,g,f,g,u),h.closePath(),h.fill(),t>0){let[y,b]=c();b&&(b.shadowColor="#000",b.shadowBlur=2*t*i,b.shadowOffsetX=s,b.drawImage(m,-s,0),d=y.toDataURL())}else d=m.toDataURL()}return d&&$a.set(n,d),d}function ei(o){o.querySelectorAll(".cloud-track, .cloud-gsap").forEach(e=>{window.AnimatedWeatherCardGsap?.killTweensOf(e),e.remove()})}function Rl(o){return Math.min(1,Math.max(.5,o/160))||1}function Va(o,e,t,i,n){let r=i.offsetWidth,a=i.offsetHeight,s=Fl,l=ke(e.windSpeed),c=[],d=t||e.cloudCount,m=Rl(a);return s.forEach((h,p)=>{let g=Math.ceil(p===0||p===1?d*.4:d*.6);for(let u=1;u<=g;u++){let f=document.createElement("div");f.className=`cloud-gsap cloud-gsap-${h.name}-${u}`;let w=e.cloudBaseSize*h.scale,y=1+(u-1)*.15,b=Math.max(.3,Math.min(2.5,w))*y*m,v=zl(b);f.style.position="absolute",f.style.opacity=h.opacity.toString(),f.dataset.awcO=String(h.opacity),f.style.zIndex=(10+p).toString();let _=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][p],x=n?.color_palette==="theme"?0:h.blur,T=[{x:0,y:0,width:v.width,height:v.height},...v.puffs.map(W=>({x:W.x,y:W.y,width:W.size,height:W.size}))],C=Math.min(3,Math.max(1,window.devicePixelRatio||1)),A=T.map(W=>Hl(W.width,W.height,x,C)),S=A.every(Boolean),E=S?qa(x):0;if(f.style.width=v.width+"px",f.style.height=v.height+"px",S)f.classList.add("cloud-masked"),T.forEach((W,$)=>{let st=document.createElement("div");st.style.position="absolute",st.style.left=W.x-E+"px",st.style.top=W.y-E+"px",st.style.width=W.width+2*E+"px",st.style.height=W.height+2*E+"px",st.style.background=_;for(let Nt of["-webkit-",""])st.style.setProperty(`${Nt}mask-image`,`url("${A[$]}")`),st.style.setProperty(`${Nt}mask-size`,"100% 100%"),st.style.setProperty(`${Nt}mask-repeat`,"no-repeat");f.appendChild(st)});else{f.style.borderRadius="50px",f.style.background=_,x>0&&(f.style.filter=`blur(${x}px)`);for(let W of v.puffs){let $=document.createElement("div");$.style.position="absolute",$.style.left=W.x+"px",$.style.top=W.y+"px",$.style.width=W.size+"px",$.style.height=W.size+"px",$.style.borderRadius="50px",$.style.background=_,f.appendChild($)}}let M=v.width+2*E,z=([[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][p][u-1]||15+p*10)/60,R=v.height+Math.max(E,Math.ceil(x*3))+2,H=Number(i.dataset?.cloudBand),G=Number.isFinite(H)&&i.dataset?.cloudBand!==void 0?H:null,pt=Math.max(150+p*50,M+Wl),Et=h.speed*l*(.9+Math.random()*.2),Mt=(r+2*pt)/Et,Q=document.createElement("div");Q.className="cloud-track",Q.dataset.awcF=String(z),Q.dataset.awcB=String(R),Q.appendChild(f),window.AnimatedWeatherCardGsap.set(f,{opacity:h.opacity}),window.AnimatedWeatherCardGsap.set(Q,{xPercent:0,x:-pt,y:Ia(z,R,G,a)}),o.appendChild(Q);let Pt=window.AnimatedWeatherCardGsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5});Pt.fromTo(Q,{xPercent:0,x:-pt},{xPercent:100,x:pt,duration:Mt,ease:"none"}),Pt.progress(Math.random()),c.push(Pt)}}),c}function Ya(o){let e=o.querySelector(".snow-accumulation");e&&(window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(e,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{e.parentNode&&e.parentNode.removeChild(e)}}):e.parentNode?.removeChild(e))}function Ua(o,e,t,i,n){let r=document.createElement("div");r.className=`fog-layer fog-layer-${t}`;let a=i.offsetWidth,s=i.offsetHeight,l=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],c=l[t]||l[2],d=n.custom_colors?.fog_color,m=n.color_palette==="default"?Je(d)?d:"#e0e0e0":"var(--secondary-text-color)",h=3+Math.floor(Math.random()*3),p=a*c.scale;r.style.cssText=`
        position: absolute;
        top: ${20+t*15}%;
        left: -50%;
        width: ${p}px;
        height: ${c.height}px;
        opacity: ${c.opacity};
        filter: blur(${c.blur}px);
        pointer-events: none;
        z-index: ${5+t};
        overflow: visible;
    `;for(let x=0;x<h;x++){let T=document.createElement("div"),C=p/h*(2+Math.random()*1.2),A=c.height*(1.2+Math.random()*1.6),S=p/h*x-C*.3,E=(Math.random()-.5)*(c.height*.5);T.style.cssText=`
            position: absolute;
            left: ${S}px;
            top: ${E}px;
            width: ${C}px;
            height: ${A}px;
            background: radial-gradient(ellipse ${C/2}px ${A/2}px at center, 
                ${m} 0%, 
                ${m} 40%, 
                transparent 70%);
            border-radius: ${C/2}px ${A/2}px;
            opacity: ${.7+Math.random()*.6}; // Varied opacity per segment
        `,r.appendChild(T)}o.appendChild(r);let g=e.windSpeed*(.5+Math.random()*.5),u=15/c.speed,f=Math.max(8,u/g),w=a*c.scale,y=-w,b=a+w;window.AnimatedWeatherCardGsap.set(r,{x:y,opacity:c.opacity});let v=window.AnimatedWeatherCardGsap.timeline({repeat:-1,delay:t*2+Math.random()*3});v.to(r,{x:b,duration:f,ease:"none",onComplete:()=>{window.AnimatedWeatherCardGsap.set(r,{x:y})}});let _=window.AnimatedWeatherCardGsap.timeline({repeat:-1,yoyo:!0});return _.to(r,{opacity:c.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:v,opacity:_}}function Wi(o){o.querySelectorAll(".fog-layer").forEach(t=>{t.parentNode&&t.parentNode.removeChild(t)})}var Nl=3,Il=2,Ka=[900,1400],ja=[1800,2600],zi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=r,this.windConfig={leafCount:3,swooshEnabled:!0,...i},k(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(L(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(L(300,900)),k(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(t){let i=J(this.cardConfig,this.realWindSpeed);this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let n=Math.max(1,Math.round(Nl*i.leafCount));if(this.leaves.size<n){let r=Ga(this.layer(),i,1,this.card(),a=>this.forget(a,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(r),this.addParticle(r)}this.scheduleLeaf(L(Ka[0],Ka[1])/Math.max(.5,i.leafCount))},t)}scheduleSwoosh(t){let i=J(this.cardConfig,this.realWindSpeed);this.swooshTimer=setTimeout(()=>{if(this.state==="active"){if(this.swooshes.size<Il){let n=Ba(this.layer(),i,1,this.card(),this.cardConfig,r=>this.forget(r,this.swooshes));this.swooshes.add(n),this.addParticle(n)}this.scheduleSwoosh(L(ja[0],ja[1]))}},t)}forget(t,i){i.delete(t),this.removeParticle(t)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),this.leaves.clear(),this.swooshes.clear(),k(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),ki(this.layer()),k(this.config.devMode,"Wind animation paused")}async onResume(){Ei(this.layer()),this.clearTimers(),this.scheduleLeaf(L(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(L(600,1500)),k(this.config.devMode,"Wind animation resumed")}};var ii=[6e3,18e3],$l=[1500,6e3],Xa=.16,Hi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=r,this.lightningConfig={disableShake:n.disable_lightning_shake||!1,minInterval:ii[0],maxInterval:ii[1],...i},k(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start lightning animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Lightning layer not found: ${this.layerSelector}`);t.style.opacity="0";let[i,n]=$l;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},i+Math.random()*(n-i)),this.addTimeout(this.flashTimeout),k(this.config.devMode,"Lightning animation started")}flash(){if(!window.AnimatedWeatherCardGsap||this.state!=="active")return;let t=this.element.querySelector(this.layerSelector),i=this.element.querySelector(".animated-weather-card");if(!t||!i)return;let n=i.offsetWidth,r=i.offsetHeight,a=parseFloat(i.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let l=document.createElementNS("http://www.w3.org/2000/svg","path"),c=30+Math.random()*(n-60),d=20*a,m=20,h=[c+",0"];for(let f=0;f<m;f++){let w=c+(Math.random()*d-d/2),y=r/m*(f+1);h.push(w+","+y)}l.setAttribute("d","M"+h.join(" L"));let p=this.element.timeOfDayManager,g=ti("lightning",p,"white");l.setAttribute("stroke",g),l.setAttribute("stroke-width",((2+Math.random()*2)*a).toString()),l.setAttribute("fill","none"),s.appendChild(l),t.appendChild(s);let u=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=u,u.set(t,{opacity:.9},0).to(t,{opacity:.3,duration:.06,ease:"none"},0).to(t,{opacity:.8,duration:.04,ease:"none"},.06).to(t,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let f=-6*a;u.to(i,{y:f,duration:.06,ease:"power2.out"},Xa).to(i,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Xa+.06)}}scheduleNext(){if(this.state!=="active")return;let t=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},t),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let t=this.element.querySelector(".animated-weather-card");t&&window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.set(t,{clearProps:"transform"});let i=this.element.querySelector(this.layerSelector);i&&(i.querySelectorAll("svg").forEach(r=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(r.querySelector("path")),r.parentNode&&r.parentNode.removeChild(r)}),i.style.opacity="0"),k(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),k(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),k(this.config.devMode,"Lightning animation resumed")}};var Gl=["dawn","day","dusk","night"],lr=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],Bl={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},Ja=(o,e,t)=>Math.min(e,Math.max(o,t)),Zt=(o,e,t)=>o+(e-o)*t;function ql(o,e,t){let i=(e-o+540)%360-180;return(o+i*t+360)%360}function Ht(o,e,t){let i=([u,f,w])=>[u,f*Math.cos(w*Math.PI/180),f*Math.sin(w*Math.PI/180)],[n,r,a]=i(o),[s,l,c]=i(e),d=Zt(n,s,t),m=Zt(r,l,t),h=Zt(a,c,t),p=Math.hypot(m,h),g=p<1e-6?o[2]:(Math.atan2(h,m)*180/Math.PI+360)%360;return[d,p,g]}function or([o,e,t]){let i=t*Math.PI/180,n=e*Math.cos(i),r=e*Math.sin(i),a=(o+.3963377774*n+.2158037573*r)**3,s=(o-.1055613458*n-.0638541728*r)**3,l=(o-.0894841775*n-1.291485548*r)**3;return[4.0767416621*a-3.3077115913*s+.2309699292*l,-1.2684380046*a+2.6097574011*s-.3413193965*l,-.0041960863*a-.7034186147*s+1.707614701*l]}var Vl=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function St(o){let e=i=>i.every(n=>n>=-1e-4&&n<=1.0001),t=or(o);if(!e(t)){let i=0,n=o[1];for(let r=0;r<24;r++){let a=(i+n)/2;e(or([o[0],a,o[2]]))?i=a:n=a}t=or([o[0],i,o[2]])}return t.map(i=>Vl(Ja(0,1,i)))}var to=o=>Math.round(Ja(0,1,o)*255);function Rt(o){return"#"+o.map(e=>to(e).toString(16).padStart(2,"0")).join("")}function Za(o,e){return`rgba(${o.map(to).join(", ")}, ${Number(e.toFixed(3))})`}function sr(o,e){return[.15+(o[0]-.15)*.42,o[1]*Zt(.75,.5,e),ql(o[2],262,.45)]}function Yl(o,e){let t=Bl[o],i=1-t.overcast*.7,n={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:Zt(.46,.28,t.overcast)};if(o==="clear-night"){if(e==="dawn"||e==="dusk"){let r=e==="dawn"?[.4,.09,20]:[.38,.1,40];return{...n,bottom:Ht(t.bottom,r,.45),glowAlpha:.2,scrimAlpha:.22}}return{...n,scrimAlpha:.2}}switch(e){case"night":return{top:sr(t.top,t.overcast),mid:sr(t.mid,t.overcast),bottom:sr(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:Zt(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:Ht(t.top,[t.top[0]*.8,.075,292],.5*i),mid:Ht(t.mid,[t.mid[0]*.88,.065,350],.42*i),bottom:Ht(t.bottom,[t.bottom[0]*.92,.115,52],.72*i),glow:Ht(t.glow,[.82,.13,58],i),glowAlpha:Zt(t.glowAlpha,.6,i*.6),scrimAlpha:n.scrimAlpha+.04};case"dawn":return{top:Ht(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*i),mid:Ht(t.mid,[t.mid[0]*.95,.05,330],.3*i),bottom:Ht(t.bottom,[t.bottom[0]*.95,.085,32],.62*i),glow:Ht(t.glow,[.88,.09,40],i),glowAlpha:Zt(t.glowAlpha,.5,i*.5),scrimAlpha:n.scrimAlpha+.04};default:return n}}function Ul(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function Ee(o,e){let t=Yl(o,e);return{top:Rt(St(t.top)),mid:Rt(St(t.mid)),bottom:Rt(St(t.bottom)),glow:Za(St(t.glow),t.glowAlpha),scrim:Za(St(Ul(t.top)),t.scrimAlpha)}}var Me=[.985,.006,250],Ri=.8,eo=.55,io=.4,Ni={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},no={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},ro={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64};function Pe(o,e){let t=i=>`${Math.round(i*100)}%`;return`radial-gradient(${t(o.rx)} ${t(o.ry)} at ${t(o.cx)} ${t(o.cy)}, ${e}, transparent ${t(o.fade)})`}function ao(){let o=[];for(let e of lr)for(let t of Gl){let i=Ee(e,t),n=t==="day"?`.animated-weather-card.${e}`:`.animated-weather-card.${e}[data-phase="${t}"]`;o.push(`${n} { --awc-sky-top: ${i.top}; --awc-sky-mid: ${i.mid}; --awc-sky-bottom: ${i.bottom}; --awc-sky-glow: ${i.glow}; --awc-sky-scrim: ${i.scrim}; }`)}return o.join(`
`)}function Ii(o,e,t){return o==null||!Number.isFinite(o)?t?"day":"night":o<-6?"night":o<6?e?"dawn":"dusk":"day"}var Qt=3.2,Le="cubic-bezier(0.37, 0, 0.63, 1)",oo={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},so=Object.keys(oo),cr=so.filter(o=>o.startsWith("--awc-sky-"));function lo(){return so.map(o=>`${o} ${Qt}s ${Le}`).join(`,
            `)}var Qa=!1;function $i(){if(Qa)return;Qa=!0;let o=globalThis.CSS;if(o?.registerProperty)for(let[e,t]of Object.entries(oo))try{o.registerProperty({name:e,syntax:"<color>",inherits:!0,initialValue:t})}catch{}}var dr=Array.from({length:25},(o,e)=>[e%5/2-1,Math.floor(e/5)/2-1]).filter(([o,e])=>o*o+e*e<=1),Kl=1.9,jl=.6,Gi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.cloudTimelines=[];this.startWindFactor=1;this.sunLit=1;this.looks=null;this.realWindSpeed=r,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...i},k(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start clouds animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");ei(t);let r=Math.min(6,Math.max(1,Math.round(i.cloudCount)));this.cloudsConfig.isPartlyCloudy&&(r=Math.max(1,Math.round(r*.6))),this.cloudTimelines=Va(t,i,r,n,this.cardConfig),this.startWindFactor=ke(i.windSpeed),this.looks?.kill(),this.looks=window.AnimatedWeatherCardGsap.timeline({repeat:-1,onRepeat:()=>this.veilSun()}),this.looks.to({},{duration:.12}),this.veilSun(!0),k(this.config.devMode,`Clouds animation started with ${r} clouds`)}async onStop(){this.cloudTimelines.forEach(i=>{window.AnimatedWeatherCardGsap?.killTweensOf(i),i&&typeof i.kill=="function"&&i.kill()}),this.cloudTimelines=[],this.looks?.kill(),this.looks=null;let t=this.element.querySelector(this.layerSelector);t&&ei(t),this.lightSun(1),k(this.config.devMode,"Clouds animation stopped")}async onPause(){this.cloudTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),this.looks?.pause(),k(this.config.devMode,"Clouds animation paused")}async onResume(){this.cloudTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),this.looks?.resume(),k(this.config.devMode,"Clouds animation resumed")}veilSun(t=!1){let i=this.element.querySelector(".sun-track .sun"),n=i?.getBoundingClientRect(),r=Array.from(this.element.querySelectorAll(".cloud-gsap")),a=y=>Number(y.dataset.awcO)||0;if(!i||!n?.width||getComputedStyle(i).opacity==="0"){r.forEach(y=>this.dense(y,a(y),t));return}let s=n.width/2,l=n.left+s,c=n.top+n.height/2,d=this.element.querySelector(this.containerSelector),m=d?parseFloat(getComputedStyle(d).opacity):1,h=Number.isFinite(m)?m:1,p=r.map(y=>Math.min(a(y),parseFloat(getComputedStyle(y).opacity)||0)*jl*h),g=r.map(y=>[y,...Array.from(y.children)].map(b=>b.getBoundingClientRect()).filter(b=>b.width&&b.height)),u=(y,b,v)=>g[y].some(_=>{let x=Math.min(_.width,_.height)/2,T=b-Math.min(Math.max(b,_.left+x),_.right-x),C=v-Math.min(Math.max(v,_.top+x),_.bottom-x);return T*T+C*C<=x*x}),f=0,w=r.map(()=>0);for(let[y,b]of dr)f+=r.reduce((v,_,x)=>u(x,l+y*s,c+b*s)?v*(1-p[x]):v,1),r.forEach((v,_)=>{u(_,l+y*s*1.25,c+b*s*1.25)&&(w[_]+=1/dr.length)});this.lightSun(f/dr.length,t),r.forEach((y,b)=>this.dense(y,a(y)*(1+(Kl-1)*Math.min(1,w[b]*3)),t))}dense(t,i,n){let r=(Math.round(Math.min(.95,i)*100)/100).toString();t.dataset.awcV!==r&&(t.dataset.awcV=r,n?window.AnimatedWeatherCardGsap?.set(t,{opacity:r}):window.AnimatedWeatherCardGsap?.to(t,{opacity:r,duration:.5,ease:"sine.out",overwrite:"auto"}))}lightSun(t,i=!1){let n=this.element.querySelector(".sun-track"),r=Math.round(t*100)/100;!n||r===this.sunLit&&!i||(this.sunLit=r,i?window.AnimatedWeatherCardGsap?.set(n,{opacity:r}):window.AnimatedWeatherCardGsap?.to(n,{opacity:r,duration:.5,ease:"sine.out",overwrite:!0}))}onWindSpeedChange(){if(!window.AnimatedWeatherCardGsap)return;let t=J(this.cardConfig,this.realWindSpeed),i=ke(t.windSpeed)/this.startWindFactor;this.cloudTimelines.forEach(n=>{window.AnimatedWeatherCardGsap.to(n,{timeScale:i,duration:Qt,ease:"sine.inOut",overwrite:!0})})}};var Bi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=r,this.fogConfig={layerCount:3,...i},k(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start fog animation");let t=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!t)throw new Error("Fog container not found");let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");Wi(n),this.fogTimelines=[];for(let r=0;r<this.fogConfig.layerCount;r++){let a=Ua(t,i,r,n,this.cardConfig);this.fogTimelines.push(a.movement),this.fogTimelines.push(a.opacity)}k(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(n=>{n&&typeof n.kill=="function"&&n.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer")?.forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),k(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(t=>{t&&typeof t.pause=="function"&&t.pause()}),k(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(t=>{t&&typeof t.resume=="function"&&t.resume()}),k(this.config.devMode,"Fog animation resumed")}};var Xl=1/3,Zl=.35,qi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=r,this.starsConfig={starCount:30,showMoon:!0,...i},k(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start stars animation");let t=this.element.querySelector(this.layerSelector);if(!t)throw new Error(`Animation layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed);this.element.querySelector(".animated-weather-card")?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(s),s.remove()});let r=Math.max(15,Math.round(i.cloudCount*5)),a=document.createElement("div");a.className="stars-field";for(let s=0;s<r;s++){let l=document.createElement("div");l.className="star-gsap";let c=1+Math.random()*3,d=.3+Math.random()*.5;if(l.style.cssText=`
                width: ${c.toFixed(2)}px;
                height: ${c.toFixed(2)}px;
                left: ${(Math.random()*100).toFixed(2)}%;
                top: ${(Math.random()*70).toFixed(2)}%;
                opacity: ${d.toFixed(2)};
            `,Math.random()<Xl){let m=3+Math.random()*4;l.classList.add("twinkle"),l.style.setProperty("--star-o",d.toFixed(2)),l.style.setProperty("--star-dim",(d*(1-Math.random()*Zl)).toFixed(2)),l.style.animationDuration=`${m.toFixed(2)}s`,l.style.animationDelay=`${(-Math.random()*m).toFixed(2)}s`}a.appendChild(l)}if(t.appendChild(a),this.addParticle(a),window.AnimatedWeatherCardGsap.fromTo(a,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"}),this.starsConfig.showMoon){let s=document.createElement("div");s.className="moon-gsap",t.appendChild(s),this.addParticle(s),window.AnimatedWeatherCardGsap.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"})}k(this.config.devMode,`Stars animation started with ${r} stars`)}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&t.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),k(this.config.devMode,"Stars animation stopped")}setPaused(t){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(i=>i.classList.toggle("paused",t))}async onPause(){this.setPaused(!0),k(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),k(this.config.devMode,"Stars animation resumed")}};var Vi=class extends X{constructor(t,i,n,r){super(t,i,n);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";k(this.config.devMode,"SunAnimation created")}async onStart(){let t=this.element.querySelector(this.layerSelector);if(!t){k(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}t.style.opacity="1",k(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.opacity="0"),k(this.config.devMode,"Sun animation stopped")}async onPause(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="paused"),k(this.config.devMode,"Sun animation paused")}async onResume(){let t=this.element.querySelector(this.layerSelector);t&&(t.style.animationPlayState="running"),k(this.config.devMode,"Sun animation resumed")}};var Yi=class{constructor(e,t,i,n){this.activeAnimations=new Map;this.element=e,this.config=t,this.timeOfDayManager=i,this.realWindSpeed=n}async startModularAnimation(e,t){this.activeAnimations.has(e)&&await this.stopModularAnimation(e);try{let i={intensity:t,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1},n=null;switch(e){case"rain":n=new Li(this.element,{...i,isStorm:t>=2&&t<=4,isPouring:t>4,isLightRain:t<1,particleCount:Math.floor(t*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":n=new Oi(this.element,{...i,particleCount:Math.floor(t*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":n=new Fi(this.element,{...i,particleCount:Math.floor(t*40)},this.config,this.realWindSpeed);break;case"wind":n=new zi(this.element,{...i,leafCount:Math.max(1,Math.floor(t*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":n=new Hi(this.element,{...i,disableShake:this.config.disable_lightning_shake||!1,minInterval:ii[0],maxInterval:ii[1]},this.config,this.realWindSpeed);break;case"clouds":n=new Gi(this.element,{...i,cloudCount:Math.max(1,Math.floor(t*2)),isPartlyCloudy:t<3},this.config,this.realWindSpeed);break;case"fog":n=new Bi(this.element,{...i,layerCount:Math.max(2,Math.min(5,Math.floor(t)))},this.config,this.realWindSpeed);break;case"stars":n=new qi(this.element,{...i,starCount:Math.max(15,Math.floor(t*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":n=new Vi(this.element,i,this.config);break;default:return k(this.config.dev_mode,`No modular animation registered for type: ${e}`),null}return await n.start(),this.activeAnimations.set(e,n),k(this.config.dev_mode,`Started modular ${e} animation with intensity ${t}`),n}catch(i){return console.error(`Failed to start modular ${e} animation:`,i),null}}async stopModularAnimation(e){let t=this.activeAnimations.get(e);if(t)try{await t.destroy(),k(this.config.dev_mode,`Stopped modular ${e} animation`)}catch(i){console.error(`Error stopping modular ${e} animation:`,i)}finally{this.activeAnimations.delete(e)}}async pauseModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isActive())try{await t.pause()}catch(i){console.error(`Error pausing modular ${e} animation:`,i)}}async resumeModularAnimation(e){let t=this.activeAnimations.get(e);if(t&&t.isPaused())try{await t.resume()}catch(i){console.error(`Error resuming modular ${e} animation:`,i)}}updateWindSpeed(e){if(!Object.is(e,this.realWindSpeed)){this.realWindSpeed=e;for(let[t,i]of this.activeAnimations)try{i.setWindSpeed(e)}catch(n){console.warn(`Failed to update wind speed for ${t}:`,n)}}}async cleanup(){let e=Array.from(this.activeAnimations.keys()).map(t=>this.stopModularAnimation(t));await Promise.all(e),this.activeAnimations.clear()}};var Oe=class{constructor(e,t,i,n){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.element=e,this.config=t,this.isPausedFn=i,this.timeOfDayManager=n,this.modularBridge=new Yi(e,t,n,this.currentWindSpeed),k(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(e){this.currentWindSpeed=e,this.modularBridge.updateWindSpeed(e)}async startAnimation(e,t){let i=this.animations[e];if(i.isActive){k(this.config.dev_mode,`Animation ${e} already active \u2014 skipping`);return}let n=t?.intensity??i.intensity??1,r=this.generation;i.isActive=!0,i.intensity=n,this.setAnimationLayerVisibility(e,!0);try{let a=await this.modularBridge.startModularAnimation(e,n);if(r!==this.generation){k(this.config.dev_mode,`Discarding stale start for ${e} (generation drifted)`),await this.modularBridge.stopModularAnimation(e);return}if(!a){i.isActive=!1,console.warn(`No modular animation available for type: ${e}`);return}k(this.config.dev_mode,`Started ${e} animation with intensity ${n}`)}catch(a){console.error(`Failed to start ${e} animation:`,a),i.isActive=!1}}async stopAnimation(e){let t=this.animations[e];if(t.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(e),k(this.config.dev_mode,`Stopped ${e} animation`)}catch(i){console.error(`Error stopping ${e} animation:`,i)}this.setAnimationLayerVisibility(e,!1),t.isActive=!1,t.isPaused=!1}}pauseAnimation(e){let t=this.animations[e];!t.isActive||t.isPaused||(t.isPaused=!0,this.modularBridge.pauseModularAnimation(e),k(this.config.dev_mode,`Paused ${e} animation`))}resumeAnimation(e){let t=this.animations[e];!t.isActive||!t.isPaused||(t.isPaused=!1,this.modularBridge.resumeModularAnimation(e),k(this.config.dev_mode,`Resumed ${e} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(e=>this.stopAnimation(e)))}pauseAllAnimations(){Object.keys(this.animations).forEach(e=>this.pauseAnimation(e))}resumeAllAnimations(){Object.keys(this.animations).forEach(e=>this.resumeAnimation(e))}async applyWeatherCondition(e){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let t=this.defaultWeatherMappings[e.toLowerCase()];if(!t){console.warn(`No animation mapping for weather condition: ${e}`);return}await Promise.all(t.animations.map(i=>{let n=t.overrides?.[i];return this.startAnimation(i,n)})),k(this.config.dev_mode,`Applied weather condition: ${e} with animations: ${t.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(e,t){let i=this.element.querySelector(".animated-weather-card");if(!i)return;let n=`individual-${e}-active`;t?i.classList.add(n):i.classList.remove(n)}clearIndividualAnimationClasses(){let e=this.element.querySelector(".animated-weather-card");if(e)for(let t of Object.keys(this.animations))e.classList.remove(`individual-${t}-active`)}};var Ui=o=>{if(o==null||o==="")return null;let e=typeof o=="number"?o:Number(o);return Number.isFinite(e)?e:null},Jt=o=>typeof o=="string"?o.trim():"";function Ql(o){if(!o||typeof o!="object")return null;let e=o,t=typeof e.id=="number"?String(e.id):Jt(e.id);return t?{id:t,label:Jt(e.flight_number)||Jt(e.callsign),aircraftCode:Jt(e.aircraft_code),originCity:Jt(e.airport_origin_city),originCode:Jt(e.airport_origin_code_iata),destinationCity:Jt(e.airport_destination_city),destinationCode:Jt(e.airport_destination_code_iata),altitudeFt:Ui(e.altitude),groundSpeedKt:Ui(e.ground_speed),heading:Ui(e.heading),verticalSpeed:Ui(e.vertical_speed),onGround:e.on_ground===1||e.on_ground===!0||e.on_ground==="1"}:null}function co(o,e){if(!o||!e)return null;let t=o.states[e];if(!t||t.state==="unavailable"||t.state==="unknown")return null;let i=t.attributes?.flights;if(!Array.isArray(i))return[];let n=[];for(let r of i){let a=Ql(r);a&&n.push(a)}return n}var Ki=class{constructor(){this.known=null}update(e,t=!1){if(!e)return[];let i=e.filter(s=>!s.onGround),n=new Set(i.map(s=>s.id));if(this.known===null)return this.known=n,t?i.filter((s,l)=>i.findIndex(c=>c.id===s.id)===l):[];let r=[],a=new Set;for(let s of i)this.known.has(s.id)||a.has(s.id)||(a.add(s.id),r.push(s));return this.known=n,r}reset(){this.known=null}};var ji=class{constructor(e={}){this.listeners=new Set;this.config={enableDayNightCycle:e.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...e},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(e){let t=this.config.enableDayNightCycle;this.config={...this.config,...e},this.updateState(),this.config.enableDayNightCycle&&!t?this.startAutoUpdate():!this.config.enableDayNightCycle&&t&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(e){this.listeners.add(e)}removeListener(e){this.listeners.delete(e)}getTimeAwareColor(e){let t=this.getCurrentState();if(!this.isEnabled())return e.day;switch(t.timePhase){case"dawn":return e.dawn||this.blendColors(e.night,e.day,.3);case"day":return e.day;case"dusk":return e.dusk||this.blendColors(e.day,e.night,.3);case"night":return e.night;default:return e.day}}setDevOverride(e){this.devTimePhaseOverride=e,this.updateState()}clearDevOverride(){this.devTimePhaseOverride=void 0,this.updateState()}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let e=new Date,t,i;if(!this.config.useBrowserTime&&this.config.timeZone){let s=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(e);t=parseInt(s.find(l=>l.type==="hour")?.value||"0",10),i=parseInt(s.find(l=>l.type==="minute")?.value||"0",10)}else t=e.getHours(),i=e.getMinutes();let n=t+i/60,r;if(this.devTimePhaseOverride)r=this.devTimePhaseOverride;else{let s=this.config.sunriseHour,l=this.config.sunsetHour,c=(s-1+24)%24,d=(s+.5)%24,m=(l-.5+24)%24,h=(l+1)%24,p=(g,u,f)=>u<=f?g>=u&&g<f:g>=u||g<f;p(n,c,d)?r="dawn":p(n,d,m)?r="day":p(n,m,h)?r="dusk":r="night"}let a={isDaytime:r==="day"||r==="dawn",isNighttime:r==="night"||r==="dusk",isDawn:r==="dawn",isDusk:r==="dusk",currentHour:t,timePhase:r};!this.currentState||this.currentState.timePhase!==a.timePhase?(this.currentState=a,this.notifyListeners(a)):this.currentState=a}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},La.UPDATE_INTERVAL)}notifyListeners(e){this.listeners.forEach(t=>{try{t(e)}catch(i){console.error("TimeOfDayManager: Error in listener callback:",i)}})}blendColors(e,t,i){let n=e.replace("#",""),r=t.replace("#",""),a=parseInt(n.substring(0,2),16),s=parseInt(n.substring(2,4),16),l=parseInt(n.substring(4,6),16),c=parseInt(r.substring(0,2),16),d=parseInt(r.substring(2,4),16),m=parseInt(r.substring(4,6),16),h=Math.round(a*(1-i)+c*i),p=Math.round(s*(1-i)+d*i),g=Math.round(l*(1-i)+m*i),u=h.toString(16).padStart(2,"0"),f=p.toString(16).padStart(2,"0"),w=g.toString(16).padStart(2,"0");return`#${u}${f}${w}`}};var hr=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var Jl=ao(),tc=Rt(St(Me)),ho=o=>`${Math.round(o*100)}%`,ec=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,ic=48,ur=()=>`
${hr("animated-weather-card")}
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
          --awc-secondary: ${Ri};

          /* Public color hooks (also set by custom_colors) */
          --weather-text-color: ${tc};
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
            ${lo()};
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
        ${Jl}

        .sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
          --awc-sky-glow-layer: ${Pe(Ni,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer),
            linear-gradient(180deg, transparent ${ho(io)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${ho(eo)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${Pe(no,"var(--awc-sky-glow)")}; }
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
          background-image: ${ec};
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
          --awc-sky-glow-layer: ${Pe(ro,"var(--awc-sky-glow)")};
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
        /* Fog always stays in the frame, corners included; overflow keeps it
           out of the page's size in Firefox (#16) */
        .animation-container.fog-container {
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
          overflow: hidden;
          overflow: clip;
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
          --awc-cloud-overhang: ${ic}px;
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
          transition: opacity ${Qt/2}s ${Le};
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
          transition: transform ${Qt}s ${Le};
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
        /* With both, the flight sits under the route, quieter */
        .plane-label > span { display: block; }
        .plane-flight { font-weight: 500; opacity: 0.72; }

`;var nc={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function rc(o,e){try{let t=o.formatEntityState?.(e);if(t&&t!==e.state)return t}catch{}return Te(nc,e.state)||e.state}var ac=180;function mo(o,e){let t=e.note_entity?o?.states[e.note_entity]:void 0;if(!t)return null;let i=s=>typeof s=="string"?s.trim():"",n=t.state==="unknown"||t.state==="unavailable"?"":i(t.state),r=i(t.attributes?.[e.note_attribute||"note"]);if(!n&&!r)return null;let a=Date.parse(t.attributes?.generated_at);return{line:n||r,note:r||n,writtenAt:Number.isNaN(a)?null:a}}function po(o,e){let t=Number(e.note_max_age??ac);return o.writtenAt===null||!(t>0)?null:o.writtenAt+t*6e4}function mr(o,e,t){if(e.dev_mode){let i=oc(e,t);if(o&&e.sun_entity){let n=o.states[e.sun_entity];n&&(i.sun={sunrise:n.attributes.next_rising||null,sunset:n.attributes.next_setting||null,dawn:n.attributes.next_dawn||null,dusk:n.attributes.next_dusk||null,noon:n.attributes.next_noon||null,elevation:n.attributes.elevation??null,aboveHorizon:n.state==="above_horizon"})}return i}return o?lc(o,e):{temperature:"--",weatherCondition:"",location:e.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--"}}function oc(o,e){let n=Qn[e||"sunny"]||"22",r=Xi(o)?zt(parseFloat(n),void 0,1):n,a=o.name||"",s=Se.humidity,l=Se.windSpeed,c=parseFloat(l.split(" ")[0])||15,d=Se.pressure,h=Jn[e||"sunny"]||e||"sunny",p=Se.indoorTemperature,g=Se.indoorHumidity,u=new Date,f=new Date(u.getFullYear(),u.getMonth(),u.getDate(),6,14),w=new Date(u.getFullYear(),u.getMonth(),u.getDate(),18,32),y=new Date(u.getFullYear(),u.getMonth(),u.getDate(),5,45),b=new Date(u.getFullYear(),u.getMonth(),u.getDate(),19,1),v=new Date(u.getFullYear(),u.getMonth(),u.getDate(),12,23),_=Date.now(),x={sunrise:f.toISOString(),sunset:w.toISOString(),dawn:y.toISOString(),dusk:b.toISOString(),noon:v.toISOString(),elevation:42.5,aboveHorizon:_>=f.getTime()&&_<=w.getTime()};return{temperature:r,weatherCondition:h,location:a,humidity:s,windSpeed:l,windSpeedValue:c,windBearing:null,pressure:d,pressureValue:null,feelsLike:null,indoorTemperature:p,indoorHumidity:g,sun:x}}var sc={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function uo(o){let e=typeof o=="number"?o:typeof o=="string"?parseFloat(o):NaN;return isFinite(e)?(e%360+360)%360:typeof o=="string"?sc[o.trim().toUpperCase()]??null:null}function Xi(o){return Number(o.temperature_decimals)===1?1:0}function lc(o,e){if(!e.entity)throw new Error("Weather entity is required");let t=o.states[e.entity];if(!t)throw new Error(`Entity ${e.entity} not found`);let i;if(e.outdoor_sensor_entity){let S=o.states[e.outdoor_sensor_entity];S&&S.state&&!isNaN(parseFloat(S.state))?i=parseFloat(S.state):i=t.attributes.temperature}else i=t.attributes.temperature;let n=Xi(e),r=S=>zt(n?S:Math.round(S),o,n),a=i!=null&&!isNaN(i)?r(i):"--",s=rc(o,t),l=e.name||t.attributes.friendly_name||"",c=S=>{let E=typeof S=="number"?S:parseFloat(S);return isFinite(E)?zt(Math.round(E),o)+"%":null},d="--";if(e.humidity_sensor_entity){let S=o.states[e.humidity_sensor_entity];d=S&&c(S.state)||c(t.attributes.humidity)||"--"}else d=c(t.attributes.humidity)||"--";let m="--",h=10,p=(S,E)=>{let M=typeof S=="number"?S:parseFloat(S);return isFinite(M)?(h=Wa(M,E||"km/h"),m=zt(Math.round(M),o)+" "+(E||"km/h"),!0):!1},g=e.wind_speed_sensor_entity?o.states[e.wind_speed_sensor_entity]:void 0;g&&p(g.state,g.attributes?.unit_of_measurement)||p(t.attributes.wind_speed,t.attributes.wind_speed_unit);let u=e.wind_direction_sensor_entity?o.states[e.wind_direction_sensor_entity]:void 0,f=uo(u?.state)??uo(t.attributes.wind_bearing),w=(S,E)=>{let M=typeof S=="number"?S:parseFloat(S);if(!isFinite(M))return null;let O=E.toLowerCase()==="inhg"?2:0;return zt(M,o,O)+" "+E},y=S=>{let E=typeof S=="number"?S:parseFloat(S);return isFinite(E)?E:null},b="--",v=null;if(e.pressure_sensor_entity){let S=o.states[e.pressure_sensor_entity];if(S){let E=S.attributes.unit_of_measurement||"hPa",M=w(S.state,E);M&&(b=M,v=y(S.state))}if(b==="--"&&t.attributes.pressure!==void 0){let E=t.attributes.pressure_unit||"hPa";b=w(t.attributes.pressure,E)||"--",v=y(t.attributes.pressure)}}else if(t.attributes.pressure!==void 0){let S=t.attributes.pressure_unit||"hPa";b=w(t.attributes.pressure,S)||"--",v=y(t.attributes.pressure)}let _=null,x;if(e.feels_like_entity&&(x=o.states[e.feels_like_entity]?.state),x===void 0&&t.attributes.apparent_temperature!==void 0&&(x=t.attributes.apparent_temperature),x!==void 0){let S=typeof x=="number"?x:parseFloat(x);isFinite(S)&&(_=r(S)+"\xB0")}let T="--";if(e.indoor_temperature_entity){let S=o.states[e.indoor_temperature_entity];S&&S.state&&!isNaN(parseFloat(S.state))&&(T=r(parseFloat(S.state))+"\xB0")}let C="--";if(e.indoor_humidity_entity){let S=o.states[e.indoor_humidity_entity];S&&S.state&&!isNaN(parseFloat(S.state))&&(C=zt(Math.round(parseFloat(S.state)),o)+"%")}let A;if(e.sun_entity){let S=o.states[e.sun_entity];S&&(A={sunrise:S.attributes.next_rising||null,sunset:S.attributes.next_setting||null,dawn:S.attributes.next_dawn||null,dusk:S.attributes.next_dusk||null,noon:S.attributes.next_noon||null,elevation:S.attributes.elevation??null,aboveHorizon:S.state==="above_horizon"})}return{temperature:a,weatherCondition:s,location:l,humidity:d,windSpeed:m,windSpeedValue:h,windBearing:f,pressure:b,pressureValue:v,feelsLike:_,indoorTemperature:T,indoorHumidity:C,sun:A}}var cc={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota"}};function ni(o){return o?.locale?.language||o?.language||"en"}function De(o){return`${ni(o)}|${o?.locale?.time_format??""}|${pr(o)??""}`}function pr(o){if(o?.locale?.time_zone!=="server")return;let e=o.config?.time_zone;if(e)try{return new Intl.DateTimeFormat("en",{timeZone:e}),e}catch{return}}function xt(o,e,t={}){return dc(cc,o,e,t)}function dc(o,e,t,i={}){let n=ni(e).toLowerCase();return(o[n]?.[t]??o[n.split("-")[0]]?.[t]??o.en[t]).replace(/\{(\w+)\}/g,(a,s)=>i[s]??"")}function hc(o){let e=o?.locale;if(!e?.time_format)return;if(e.time_format==="12")return!0;if(e.time_format==="24")return!1;let t=e.time_format==="language"?ni(o):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(t).includes("10")}catch{return}}function de(o,e){if(!o)return"--";let t=new Date(o);if(isNaN(t.getTime()))return"--";try{return uc(e,{hour:"numeric",minute:"2-digit"}).format(t)}catch{return t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function uc(o,e){let t=hc(o),i={...e,timeZone:pr(o)};return t!==void 0&&(i.hourCycle=t?"h12":"h23"),new Intl.DateTimeFormat(o?ni(o):void 0,i)}function fr(o,e){try{let t=new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23",timeZone:pr(e)}).formatToParts(o),i=n=>Number(t.find(r=>r.type===n)?.value??0);return i("hour")+i("minute")/60+i("second")/3600}catch{return o.getHours()+o.getMinutes()/60+o.getSeconds()/3600}}function gr(o,e){let t=Math.round(Math.abs(o)*60),i=Math.floor(t/60),n=t%60,r=Intl.DurationFormat;if(r&&e)try{return new r(ni(e),{style:"narrow"}).format(i>0?{hours:i,minutes:n}:{minutes:n})}catch{}return i>0?`${i}h ${n}m`:`${n}m`}function ri(o,e){let t=o.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return t?`${D(t[1])}<span class="${e}">${D(t[2])}</span>`:D(o)}function yr(o){return o&&typeof o=="object"&&typeof o.action=="string"?o:void 0}function Zi(o,e){return{entity:e,tap_action:yr(o?.tap_action),hold_action:yr(o?.hold_action),double_tap_action:yr(o?.double_tap_action)}}function Fe(o){return!!o&&o.action!=="none"}function fo(o){return o.tap_action?Fe(o.tap_action):!!o.entity}function ai(o,e,t,i={}){let n=e[`${t}_action`],r=n&&Object.prototype.hasOwnProperty.call(i,n.action)?i[n.action]:void 0;if(r){r(t);return}if(t==="tap"&&!n){e.entity&&o.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.entity},bubbles:!0,composed:!0}));return}Fe(n)&&o.dispatchEvent(new CustomEvent("hass-action",{detail:{config:e,action:t},bubbles:!0,composed:!0}))}function Qi(o,e,t,i={}){if(o.dataset.actionsBound)return;o.dataset.actionsBound="1";let n=null,r=!1,a,s,l=()=>{clearTimeout(a),a=void 0},c=()=>{n=null,l()},d=()=>{Fe(t().double_tap_action)?s?(clearTimeout(s),s=void 0,ai(e,t(),"double_tap",i)):s=setTimeout(()=>{s=void 0,ai(e,t(),"tap",i)},250):ai(e,t(),"tap",i)},m=h=>h.target!==o&&!!h.target?.closest?.('button, a, input, [role="slider"], [role="radio"]');o.addEventListener("pointerdown",h=>{h.button!==0||m(h)||(n={x:h.clientX,y:h.clientY},r=!1,l(),Fe(t().hold_action)&&(a=setTimeout(()=>{a=void 0,r=!0,ai(e,t(),"hold",i)},500)))}),o.addEventListener("pointermove",h=>{n&&Math.hypot(h.clientX-n.x,h.clientY-n.y)>10&&c()}),o.addEventListener("pointerup",()=>{let h=!!n&&!r;c(),h&&d()}),o.addEventListener("pointercancel",c),o.addEventListener("pointerleave",c),o.addEventListener("keydown",h=>{h.key!=="Enter"&&h.key!==" "||h.target!==o||!fo(t())||(h.preventDefault(),ai(e,t(),"tap",i))}),o.addEventListener("contextmenu",h=>{Fe(t().hold_action)&&h.preventDefault()})}function oi(o,e,t){fo(e)?(o.setAttribute("role","button"),o.tabIndex=0,o.style.cursor="pointer"):(t?o.setAttribute("role",t):o.removeAttribute("role"),o.removeAttribute("tabindex"),o.style.cursor="");let i=Fe(e.hold_action);o.style.userSelect=i?"none":"",o.style.setProperty("-webkit-user-select",i?"none":""),o.style.setProperty("-webkit-touch-callout",i?"none":"")}var wr=new Map;function We(o,e){let t=wr.get(o);if(t)return t;let i=new Promise((n,r)=>{let s=Array.from(document.querySelectorAll("script[src]")).find(d=>/animated-weather-card(?:\.min)?\.js/.test(d.src)),l=s?s.src.replace(/animated-weather-card(\.min)?\.js/,`${o}$1.js`):`${o}.js`,c=document.createElement("script");c.src=l,c.type="module",c.async=!0,c.onload=()=>e()?n():r(new Error(`${l} loaded but registered nothing`)),c.onerror=()=>r(new Error(`Failed to load ${l}`)),document.head.appendChild(c)});return i.catch(()=>wr.delete(o)),wr.set(o,i),i}function si(o){return We("animated-weather-card-editor",()=>!!customElements.get(o))}var go={humidity:"m12.1 2.2c-4.7 6.5-7.1 10.9-7.1 13.6 0 4 3.4 7.2 7.5 7.2 4.1 0 7.5-3.2 7.5-7.2 0-2.7-2.4-7.1-7.1-13.6-.1-.1-.2-.2-.4-.2-.2 0-.3.1-.4.2",wind:"m14.4 5c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.3c1.3 0 2.3 1 2.3 2.3 0 1.2-1 2.2-2.3 2.2h-10.4c-1.3 0-2.3 1-2.3 2.3 0 1.2 1 2.2 2.3 2.2h.8c.5 0 .8-.3.8-.7 0-.5-.3-.8-.8-.8h-.8c-.5 0-.8-.3-.8-.7 0-.5.3-.8.8-.8h10.4c2.1 0 3.8-1.7 3.8-3.7 0-2.1-1.7-3.8-3.8-3.8zm6.2 3.8c0 .4.3.7.8.7.3 0 .6.3.6.7 0 .5-.3.8-.7.8h-2.5c-.5 0-.8.3-.8.7 0 .5.3.8.8.8h2.5c1.2 0 2.2-1 2.2-2.3 0-1.2-.9-2.2-2.1-2.2-.5 0-.8.3-.8.8m-12.8 5.2c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h6.1c.6 0 1.1.6 1.1 1.3 0 .6-.5 1.2-1.1 1.2h-.1c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.1c1.5 0 2.6-1.2 2.6-2.7 0-1.6-1.1-2.8-2.6-2.8zm0 0m-1-6c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h4.9c.5 0 .8-.3.8-.7 0-.5-.3-.8-.8-.8zm11.5 6.5c-.5 0-.8.3-.8.8 0 .4.3.7.8.7h2.5c.4 0 .7.3.7.8 0 .4-.3.7-.7.7h-.8c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h.8c1.2 0 2.2-1 2.2-2.2 0-1.3-1-2.3-2.2-2.3z",pressure:"m5.1 20.9a10.5 10.5 0 1 1 14.8 0 .8.8 0 0 1-1-1 9 9 0 1 0-12.8 0 .8.8 0 0 1-1 1zm6.8-7.9l4.1-4.9a.8.8 0 0 1 1.2 1l-4.1 4.9a.8.8 0 0 1-1.2-1zm-1.5.5a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 1 1-4.2 0z",sunrise:"m6.9 15.4c0 .7.2 1.5.5 2.2h-4.7c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h5.9c.1 0 .3 0 .4-.1.3-.2.4-.7.2-1-.5-.7-.9-1.7-.9-2.5 0-2.2 1.9-4 4.2-4 2.3 0 4.2 1.8 4.2 4 0 .9-.3 1.7-.8 2.4-.1.1-.2.3-.2.5 0 .4.3.7.7.7h5.9c.9 0 .9-1.4 0-1.4h-4.6c.3-.7.4-1.4.4-2.2 0-3-2.5-5.4-5.6-5.4-3.1 0-5.6 2.4-5.6 5.4m4.9-9.7v1.9c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-1.9c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.3l-1.4 1.4c-.3.2-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.2.3-.7 0-1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m-13.8 1.1l1.4 1.3c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.6 0-1 .7-.5 1.3m15.2 5.5c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4zm9.4.6l-1.7 2c-.2.2-.2.5 0 .7.2.2.6.1.7-.1l.9-1v3.7c0 .3.2.5.5.5.3 0 .5-.2.5-.5v-3.7l.9 1c.1.2.5.3.7.1.2-.2.2-.5 0-.7l-1.7-2c0 0-.1-.1-.1-.1-.1-.1-.2-.1-.3-.1-.1 0-.3.1-.4.2",sunset:"m11.8 14.7v2.9l-.6-.6c-.3-.3-.7-.3-1 0-.3.2-.3.7 0 .9l1.8 1.8c0 .1.1.2.2.2.1.1.2.1.3.1.1 0 .2 0 .3-.1.1 0 .2-.1.3-.2l1.7-1.8c.3-.2.3-.7 0-.9-.3-.3-.7-.3-1 0l-.6.6v-2.9c0-.5-.4-.7-.7-.7-.3 0-.7.2-.7.7m-4.9-1.8c0 .7.1 1.4.4 2.1h-4.6c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h5.9c.4 0 .7-.3.7-.7 0-.1 0-.1 0-.1 0-.2-.1-.3-.2-.5-.5-.8-.8-1.6-.8-2.3 0-2.5 1.9-4.4 4.2-4.4 2.3 0 4.2 1.9 4.2 4.4 0 .8-.3 1.5-.8 2.3-.1.2-.2.3-.2.5 0 0 0 0 0 .1 0 .4.3.7.7.7h5.9c.9 0 .9-1.5 0-1.5h-4.6c.3-.7.4-1.4.4-2.1 0-3.3-2.5-5.9-5.6-5.9-3.1 0-5.6 2.6-5.6 5.9",indoor:"m13.4 3.5l7.7 6.5a1.4 1.4 0 0 1 .5 1.1v9.1a1.4 1.4 0 0 1-1.4 1.4h-15.4a1.4 1.4 0 0 1-1.4-1.4v-9.1a1.4 1.4 0 0 1 .5-1.1l7.7-6.5a1.4 1.4 0 0 1 1.8 0zm-2 6.1v5.2a2.4 2.4 0 1 0 2.2 0v-5.2a1.1 1.1 0 0 0-2.2 0z",alert:"m5.2 12.5c-1.8.1-3.2 1.5-3.2 3.3 0 1.8 1.4 3.2 3.2 3.2h12.5c.1 0 .2 0 .2 0 .2 0 .3 0 .4 0 2.6 0 4.7-2.2 4.7-4.9 0-2.6-2.1-4.8-4.7-4.8-.4 0-.9 0-1.3.2-1.1-2.1-3.2-3.5-5.6-3.5-3.4 0-6.2 2.9-6.2 6.5m6.6-3.1a.8.8 0 0 1 1.5 0v4a.8.8 0 0 1-1.5 0zm-.1 6.5a.8.8 0 1 1 1.6 0 .8.8 0 1 1-1.6 0z",noon:"m7 12.5c0 3 2.5 5.5 5.5 5.5 3 0 5.5-2.5 5.5-5.5 0-3-2.5-5.5-5.5-5.5-3 0-5.5 2.5-5.5 5.5m4.8-9.8v2c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-2c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.4l-1.4 1.4c-.3.2-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.3.3-.7 0-1-.1-.2-.3-.2-.5-.2-.2 0-.4 0-.5.2m-13.8 0c-.3.3-.3.7 0 1l1.4 1.4c.7.7 1.7-.3 1-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m15.2 6.7c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4zm14.8 5.7c-.3.3-.3.7 0 1l1.4 1.4c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.2-.3-.2-.5-.2-.2 0-.4 0-.5.2m-11 0l-1.4 1.4c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1.4-1.4c.3-.3.3-.7 0-1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m5.3 2.8v2c0 .9 1.4.9 1.4 0v-2c0-.5-.3-.7-.7-.7-.4 0-.7.2-.7.7",daylight:"m7.4 5h10.2a.9.9 0 0 1 .9.9v1.4a.9.9 0 0 1-.2.5l-3.1 4.2a.9.9 0 0 1 0 1l3.1 4.2a.9.9 0 0 1 .2.5v1.4a.9.9 0 0 1-.9.9h-10.2a.9.9 0 0 1-.9-.9v-1.4a.9.9 0 0 1 .2-.5l3.1-4.2a.9.9 0 0 1 0-1l-3.1-4.2a.9.9 0 0 1-.2-.5v-1.4a.9.9 0 0 1 .9-.9zm.6 2.1l4.1 5.4-4.1 5.4v.6h9v-.6l-4.1-5.4 4.1-5.4v-.6h-9zm-3-3.4h15a.8.8 0 0 1 0 1.5h-15a.8.8 0 0 1 0-1.5zm0 16.2h15a.8.8 0 0 1 0 1.5h-15a.8.8 0 0 1 0-1.5zm5.9-11h3.2a.4.4 0 0 1 .3.7l-1.6 1.7a.4.4 0 0 1-.6 0l-1.6-1.7a.4.4 0 0 1 .3-.7zm1.9 6.1l2.5 2.9a.4.4 0 0 1-.3.7h-5a.4.4 0 0 1-.3-.7l2.5-2.9a.4.4 0 0 1 .6 0z","first-light":"m6.9 15.9c0 .7.1 1.4.4 2.1h-4.6c-.4 0-.7.3-.7.8 0 .4.3.7.7.7h19.6c.9 0 .9-1.5 0-1.5h-4.5c.2-.6.3-1.3.3-2.1 0-3.3-2.5-5.9-5.6-5.9-3.1 0-5.6 2.6-5.6 5.9m4.9-9.2v1.9c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-1.9c0-.4-.3-.7-.7-.7-.4 0-.7.3-.7.7m7.1 2.3l-1.4 1.4c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1.4-1.3c.3-.3.3-.8 0-1.1-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m-13.8 0c-.3.3-.3.8 0 1.1l1.4 1.3c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-1.4-1.4c-.1-.1-.3-.2-.5-.2-.2 0-.4.1-.5.2m15.2 6.6c-1 0-1 1.4 0 1.4h2c.9 0 .9-1.4 0-1.4zm-17.6 0c-.9 0-.9 1.4 0 1.4h2c1 0 1-1.4 0-1.4z","last-light":"m12 3.5c-4.8.3-8.5 4.2-8.5 9 0 5 4.1 9 9.2 9 3.3 0 6.3-1.7 7.9-4.5.2-.3 0-.7-.4-.7-.2.1-.4.1-.6.1-4.5 0-8.3-3.7-8.3-8.2 0-1.5.4-2.9 1.1-4.1.2-.3 0-.6-.3-.6 0 0-.1 0-.1 0","moon-new":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0z","moon-waxing-crescent":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21 5.8 10.5 0 0 0 0-21z","moon-first-quarter":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21v-21z","moon-waxing-gibbous":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-10.5a10.5 10.5 0 0 1 0 21 4.2 10.5 0 0 1 0-21z","moon-full":"m2 12.5c0 5.8 4.7 10.5 10.5 10.5 5.8 0 10.5-4.7 10.5-10.5 0-5.8-4.7-10.5-10.5-10.5-5.8 0-10.5 4.7-10.5 10.5m9-6.5c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m5 4c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m-11 4c0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2m7-8c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1m-6 8c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1m11-4c0 .6.4 1 1 1 .6 0 1-.4 1-1 0-.6-.4-1-1-1-.6 0-1 .4-1 1","moon-waning-gibbous":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21 4.2 10.5 0 0 1 0 21z","moon-last-quarter":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21v21z","moon-waning-crescent":"m2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 1 1-21 0zm1.5 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9 10.5a10.5 10.5 0 0 1 0-21 5.8 10.5 0 0 0 0 21z"};function he(o,e){return`<svg class="${e} awc-icon" data-icon="${o}" viewBox="0 0 25 25" aria-hidden="true" focusable="false"><path d="${go[o]}"/></svg>`}function yo(o,e){!o||o.getAttribute("data-icon")===e||(o.setAttribute("data-icon",e),o.firstElementChild?.setAttribute("d",go[e]))}var wo=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function _o(o){let e=o.color_palette||"default",t=o.custom_colors||{},i="";if(e!=="theme"){let r=d=>{if(typeof d!="string"||!wo.test(d))return null;let m=d.replace("#","");m.length===3&&(m=m[0]+m[0]+m[1]+m[1]+m[2]+m[2]);let h=parseInt(m,16);return{r:h>>16&255,g:h>>8&255,b:h&255}},a=(d,m,h)=>"#"+(d<<16|m<<8|h).toString(16).padStart(6,"0"),s=(d,m)=>{let h=r(d);if(!h)return d;let p=1-m/100;return a(Math.max(0,Math.floor(h.r*p)),Math.max(0,Math.floor(h.g*p)),Math.max(0,Math.floor(h.b*p)))},l=(d,m)=>{let h=r(d);if(!h)return d;let p=m/100;return a(Math.min(255,Math.floor(h.r+(255-h.r)*p)),Math.min(255,Math.floor(h.g+(255-h.g)*p)),Math.min(255,Math.floor(h.b+(255-h.b)*p)))},c=(d,m)=>{let h=t[d];if(!h||typeof h!="string"||!wo.test(h))return;let p=l(h,12),g=s(h,22);i+=`--weather-${m}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${p} 0%, ${h} 55%, ${g} 100%); `};c("sunny_bg","sunny"),c("rainy_bg","rainy"),c("snowy_bg","snowy"),c("stormy_bg","stormy"),c("windy_bg","windy"),c("cloudy_bg","cloudy")}let n=(r,a)=>{r&&Je(r)&&(i+=a.replace(/\$\{value\}/g,r))};return n(t.text_color,"--weather-text-color: ${value} !important; "),n(t.temperature_color,"--awc-hero-color: ${value} !important; "),n(t.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),n(t.rain_color,"--weather-rain-color: ${value} !important; "),n(t.snow_color,"--weather-snow-color: ${value} !important; "),i}var _r="animated-weather-card-hour";var bo={horizon:196,peak:34,trough:276,twilightRy:78},vo={horizon:200,peak:96,trough:262,twilightRy:44};function br(o,e,t){let i=t-e;if(i<=0||i>=24)return 0;if(o>=e&&o<=t)return Math.sin(Math.PI*(o-e)/i);let n=((o-t)%24+24)%24;return-Math.sin(Math.PI*n/(24-i))}var vr=(o,e=!1)=>e?1-o/24:o/24,ue=(o,e=!1)=>vr(o,e)*1e3,xr=(o,e)=>o>=0?e.horizon-o*(e.horizon-e.peak):e.horizon-o*(e.trough-e.horizon);var To={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"},mc={new_moon:"moon-new",waxing_crescent:"moon-waxing-crescent",first_quarter:"moon-first-quarter",waxing_gibbous:"moon-waxing-gibbous",full_moon:"moon-full",waning_gibbous:"moon-waning-gibbous",last_quarter:"moon-last-quarter",waning_crescent:"moon-waning-crescent"};function pc(o){return Te(mc,o)??"last-light"}function Sr(o,e){let t=n=>n.startsWith("sensor.")&&Te(To,e.states[n]?.state)!==void 0,i=e?t("sensor.moon_phase")?"sensor.moon_phase":Object.keys(e.states).find(t):"sensor.moon_phase";return i?{sun_entity:o,moon_entity:i}:{sun_entity:o}}var fc=124,xo=16;function gc(o,e){if(o<1)return 1;let t=Math.max(2,Math.floor((e+xo)/(fc+xo))),i=Math.ceil(o/t);return Math.ceil(o/i)}function yc(o,e,t,i){let n=[];for(let r=0;r<=240;r++){let a=r/10;n.push(`${ue(a,i).toFixed(1)},${xr(br(a,o,e),t).toFixed(1)}`)}return"M"+n.join(" L")}function tn(o,e){if(!o)return 0;let t=new Date(o);return isNaN(t.getTime())?0:fr(t,e)}var wc=o=>ri(o,"st-ampm");$i();var So=Rt(St(Me)),_c=`
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
        --st-text: ${So};
        --st-secondary: ${So};
        --st-secondary-opacity: ${Ri};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${Pe(Ni,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${cr.map(o=>`${o} ${Qt}s ${Le}`).join(", ")};
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
`,Tr=class extends HTMLElement{constructor(){super();this.config={};this._path=null;this._link=null;this._onHour=t=>this._follow(t.detail);this._shadow=this.attachShadow({mode:"open"})}setConfig(t){if(!t.sun_entity)throw new Error("Please define a sun_entity (e.g. sun.sun)");this.config={...t},this._render()}set hass(t){let i=this.config.sun_entity||"",n=this.config.moon_entity||"",r=this._hass?.states[i],a=t.states[i],s=this._hass?.states[n]?.state,l=t.states[n]?.state,c=De(this._hass)!==De(t),d=this.config.weather_entity||"",m=d&&this._hass?.states[d]?.state!==t.states[d]?.state;this._hass=t;let h=r?.attributes?.elevation,p=a?.attributes?.elevation;(!r||r.state!==a?.state||r.attributes?.next_rising!==a?.attributes?.next_rising||r.attributes?.next_setting!==a?.attributes?.next_setting||Math.abs((h||0)-(p||0))>=.5||n&&s!==l||c||m)&&this._render()}connectedCallback(){this._clock||(this._clock=setInterval(()=>this._render(),6e4)),window.addEventListener(_r,this._onHour),!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._fit()),this._resizeObserver.observe(this))}disconnectedCallback(){this._clock&&clearInterval(this._clock),this._clock=void 0,window.removeEventListener(_r,this._onHour),this._link=null,this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_fit(){let t=this._shadow.querySelector(".st-card");if(!t)return;let i=t.querySelector(".st-metrics");for(let n of["regular","compact","short","tight"]){if(t.dataset.fit=n,i){let r=Array.from(i.children).filter(a=>getComputedStyle(a).display!=="none").length;i.style.setProperty("--st-cols",String(gc(r,i.clientWidth)))}if(t.scrollHeight<=t.clientHeight+1)return}}_actions(){return Zi(this.config,this.config.sun_entity)}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}_skyCondition(t){let i=this.config.weather_entity,n=i?this._hass?.states[i]?.state:void 0;if(n&&n!=="unavailable"&&n!=="unknown"){let r=Mi(n,!1,void 0,void 0,this._hass?.config?.time_zone,{night:t==="night"});if(lr.includes(r))return r}return t==="night"?"clear-night":"sunny"}static async getConfigElement(){return customElements.get("animated-sun-tracker-editor")||await si("animated-sun-tracker-editor"),document.createElement("animated-sun-tracker-editor")}static getStubConfig(t,i=[],n=[]){let r=[...i,...n,...Object.keys(t?.states??{})];return Sr(r.find(a=>a.startsWith("sun."))??"sun.sun",t)}_getSunData(){if(!this._hass||!this.config.sun_entity)return null;let t=this._hass.states[this.config.sun_entity];return t?{sunrise:t.attributes.next_rising||null,sunset:t.attributes.next_setting||null,dawn:t.attributes.next_dawn||null,dusk:t.attributes.next_dusk||null,noon:t.attributes.next_noon||null,elevation:typeof t.attributes.elevation=="number"?t.attributes.elevation:null,aboveHorizon:t.state==="above_horizon",rising:!!t.attributes.rising}:null}_getMoonData(){if(!this._hass||!this.config.moon_entity)return null;let t=this._hass.states[this.config.moon_entity];if(!t)return null;let i=t.state,n;try{n=this._hass.formatEntityState?.(t)}catch{}return{phase:i,phaseName:(n&&n!==i?n:void 0)||Te(To,i)||i.replace(/_/g," ").replace(/\b\w/g,r=>r.toUpperCase()),icon:pc(i)}}_render(){let t=this._getSunData(),i=this._getMoonData(),n=this.config.color_palette!=="theme";if(!t||!t.sunrise||!t.sunset){this._path=null,this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let r=new Date,a=fr(r,this._hass),s=tn(t.sunrise,this._hass),l=tn(t.sunset,this._hass),c=t.dawn?tn(t.dawn,this._hass):Math.max(0,s-.5),d=t.dusk?tn(t.dusk,this._hass):Math.min(24,l+.5),m=l-s,h=t.aboveHorizon,p=h?t.sunset:t.sunrise,g=new Date(p).getTime()-r.getTime(),u=this._hass,f=$=>D(xt(u,$)),w=$=>wc(de($,u)),y=g>0?xt(u,"in_duration",{duration:gr(g/36e5,u)}):"",b=Ii(t.elevation,t.rising,t.aboveHorizon),v=Ee(this._skyCondition(b),b),_=n?{"--awc-sky-top":v.top,"--awc-sky-mid":v.mid,"--awc-sky-bottom":v.bottom,"--awc-sky-glow":v.glow,"--awc-sky-scrim":v.scrim}:null,x=this.config.compact?vo:bo,T=this.config.direction,C=T==="right_to_left"||T!=="left_to_right"&&(this._hass?.config?.latitude??0)<0;this._path={riseH:s,setH:l,rtl:C};let A=yc(s,l,x,C),S=`${A} L${ue(24,C)},${x.horizon} L${ue(0,C)},${x.horizon} Z`,E=br(a,s,l),M=vr(a,C)*100,O=xr(E,x)/300*100,F=($,st)=>{let Nt=Math.max(70,Math.abs(st)/24*1e3*2.4);return`<ellipse cx="${ue($,C).toFixed(1)}" cy="${x.horizon}" rx="${Nt.toFixed(1)}" ry="${x.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},z=!!this.config.compact,R=this.config.show_header!==!1,H=R?`
            <div class="st-hero">
                ${this.config.title&&!z?`<div class="st-title">${D(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    ${he(h?"sunset":"sunrise","st-glyph")}
                    <span>${f(h?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${w(p)}</div>
                ${y?`<div class="st-countdown">${D(y)}</div>`:""}
            </div>`:this.config.title&&!z?`<div class="st-hero"><div class="st-title">${D(this.config.title)}</div></div>`:"",G=($,st,Nt,Lo,Oo=!1)=>`
                <div class="st-metric" data-kind="${D($)}">
                    <div class="st-metric-label">${he(st,"st-glyph")}<span title="${D(Nt)}">${D(Nt)}</span></div>
                    <div class="st-metric-value${Oo?" wrap":""}">${Lo}</div>
                </div>`,pt=!z&&this.config.show_details!==!1,Et=z&&R?`
                        <div class="st-chart-note">${f(h?"sunrise":"sunset")}<span class="st-chart-note-time">${w(h?t.sunrise:t.sunset)}</span></div>`:"",Mt=pt?`
            <div class="st-metrics">
                ${h?G("sunrise","sunrise",f("sunrise"),w(t.sunrise)):G("sunset","sunset",f("sunset"),w(t.sunset))}
                ${G("noon","noon",f("solar_noon"),w(t.noon))}
                ${G("daylight","daylight",f("daylight"),D(gr(m,u)))}
                ${G("first-light","first-light",f("first_light"),w(t.dawn))}
                ${G("last-light","last-light",f("last_light"),w(t.dusk))}
                ${i?G("moon",i.icon,f("moon"),D(i.phaseName),!0):""}
            </div>`:"",Q=this.config.sun_entity?u?.states[this.config.sun_entity]:void 0,Pt="";try{Pt=Q&&u?.formatEntityState?.(Q)||""}catch{}let W=[`${xt(u,"sunrise")} ${de(t.sunrise,u)}`,`${xt(u,"sunset")} ${de(t.sunset,u)}`,Pt].filter(Boolean).join(" \xB7 ");this._mount(`
                    ${H}
                    <div class="st-chart" role="img" aria-label="${D(W)}">
                        <svg viewBox="0 0 ${1e3} ${300}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${1e3}" height="${x.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${x.horizon}" width="${1e3}" height="${300-x.horizon}"/></clipPath>
                            </defs>
                            ${F(s,s-c)}
                            ${F(l,d-l)}
                            <path d="${S}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${x.horizon}" x2="${1e3}" y2="${x.horizon}" class="st-horizon"/>
                            <line x1="${ue(a,C).toFixed(1)}" y1="0" x2="${ue(a,C).toFixed(1)}" y2="${300}" class="st-now-line"/>
                            <path d="${A}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${A}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${E<0?"below":""}" style="left: ${M.toFixed(2)}%; top: ${O.toFixed(2)}%;"></div>${Et}
                    </div>
                    ${Mt}`,_)}_mount(t,i){let n=this._shadow.querySelector(".st-card");n||(this._shadow.innerHTML=`<style>${_c}</style><ha-card><div class="st-card"></div></ha-card>`,n=this._shadow.querySelector(".st-card"),Qi(n.parentElement,this,()=>this._actions())),oi(n.parentElement,this._actions());let r=!!i;n.classList.toggle("sky",r),n.classList.toggle("compact",!!this.config.compact),n.parentElement?.classList.toggle("sky",r);for(let a of cr)i?n.style.setProperty(a,i[a]):n.style.removeProperty(a);n.innerHTML=t,this._link&&this._follow(),this._fit()}_follow(t){if(t){if(!t.source||t.sun!==this.config.sun_entity||t.at===null&&!this._link)return;if(this._link=t.at===null?null:t,!this._link){this._shadow.querySelector(".st-card")?.classList.remove("following"),this._render();return}}let i=this._shadow.querySelector(".st-card");i&&this._path&&this._link&&window.AnimatedWeatherCardForecast?.followTracker?.({card:i,hass:this._hass,weather:this.config.weather_entity,...this._path,compact:!!this.config.compact},this._link)}};customElements.define("animated-sun-tracker-card",Tr);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,e)=>e.startsWith("sun.")?[{label:"Regular",config:{type:"custom:animated-sun-tracker-card",...Sr(e,o)}},{label:"Compact",config:{type:"custom:animated-sun-tracker-card",...Sr(e,o),compact:!0}}]:null});function ze(o){let e=Number(o?.attributes?.supported_features);if(!isFinite(e))return["hourly","daily"];let t=[];return e&2&&t.push("hourly"),e&4&&t.push("twice_daily"),e&1&&t.push("daily"),t}function Co(o){let e=ze(o);return e.includes("daily")?"daily":e.includes("twice_daily")?"twice_daily":null}var bc=5e3;function vc(){let o=new WeakMap;return{subscribe(e,t,i,n){let r=o.get(e);r||o.set(e,r=new Map);let a=`${t}|${i}`,s=r.get(a);if(!s){let c={listeners:new Set};s=c,r.set(a,c);let d=m=>{c.last=m;for(let h of[...c.listeners])h(m)};c.unsubscribe=e.subscribeMessage(m=>d({type:m?.type??i,forecast:Array.isArray(m?.forecast)?m.forecast:null}),{type:"weather/subscribe_forecast",entity_id:t,forecast_type:i}).catch(()=>{r.get(a)===c&&r.delete(a),d({type:i,forecast:null,failed:!0})})}let l=s;return clearTimeout(l.closing),l.closing=void 0,l.listeners.add(n),l.last&&n(l.last),()=>{!l.listeners.delete(n)||l.listeners.size||(l.closing=setTimeout(()=>{l.listeners.size||(r.get(a)===l&&r.delete(a),l.unsubscribe?.then(c=>{typeof c=="function"&&c()}).catch(()=>{}))},bc))}}}}function xc(){return window.AnimatedWeatherCardForecasts??(window.AnimatedWeatherCardForecasts=vc())}function Ao(o,e,t,i){return o?.connection?.subscribeMessage?xc().subscribe(o.connection,e,t,i):()=>{}}var en=class{constructor(e){this.changed=e;this.hourly=null;this.daily=null;this.dailyType=null;this.settled=!1;this.stops=[];this.pending=new Set}sync(e,t,i){let n=t?e?.states[t]:void 0,r=ze(n),a=i.hourly&&r.includes("hourly"),s=i.daily?Co(n):null,l=`${t}|${a}|${s}`;if(!e?.connection||!t||!n){this.key&&this.stop();return}if(l===this.key&&this.connection===e.connection)return;this.stop(),this.key=l,this.connection=e.connection,this.dailyType=s,this.pending=new Set([a?"hourly":"",s??""].filter(Boolean)),this.settled=this.pending.size===0;let c=(d,m)=>{this.stops.push(Ao(e,t,d,h=>{h.failed||m(h.forecast),this.pending.delete(d),this.settled=this.pending.size===0,this.changed()}))};a&&c("hourly",d=>{this.hourly=d}),s&&c(s,d=>{this.daily=d}),this.settled&&this.changed()}stop(){for(let e of this.stops)e();this.stops=[],this.key=void 0,this.connection=void 0,this.hourly=null,this.daily=null,this.dailyType=null,this.settled=!1}};$i();var ko=o=>`Wind from ${Math.round(o)}\xB0`,Eo=o=>o==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",Mo=o=>o?"sunset":"sunrise",Sc=18,Tc=450,Cc=1600;function He(o,e){return e?.states["sun.sun"]?{entity:o,sun_entity:"sun.sun"}:{entity:o}}var Ac=400,kc=120,Ec=220,Mc=24;window.AnimatedWeatherCardGsap=Xn;var Po=["regular","compact","short","tight","minimal"],Pc=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...Po.map(o=>[o,"none"])],nn=class extends HTMLElement{constructor(){super(...arguments);this._initialRender=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this._needsAnimationRestart=!1;this.currentWindSpeedValue=10;this.devTimeOverride=!1;this._animationGeneration=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new Ki;this.writtenNote=null;this.noteComing=!1;this.surface="card";this.forecastFeed=new en(()=>this.extras?.update())}static getStubConfig(t,i=[],n=[]){let r=[...i,...n,...Object.keys(t?.states??{})];return He(r.find(a=>a.startsWith("weather."))??Zn.entity,t)}actionsConfig(){if(this.config?.dev_mode||this.surface==="view")return{};let t=Zi(this.config,this.config?.entity);return t.tap_action?t:this.config?.layout==="nightstand"&&this.surface==="card"?{...t,tap_action:{action:"none"}}:this.forecastOn()?{...t,tap_action:{action:"forecast"}}:t}forecastOn(){return!this.config?.dev_mode&&(this.surface!=="card"||!!this.config?.show_forecast||this.config?.layout==="nightstand")}extrasWanted(){return this.forecastOn()||!!this.config?.show_clock&&!this.config?.dev_mode}syncForecastFeed(){if(!this.isConnected||!this.forecastOn()){this.forecastFeed.stop();return}let t=this.surface!=="forecast"||this.config?.show_hours!==!1||this.config?.compact;this.forecastFeed.sync(this._hass,this.config?.entity,{hourly:t!==!1,daily:!0})}mountExtras(){if(this.extras?.destroy(),this.extras=void 0,!this.isConnected||!this.extrasWanted()||!this.querySelector(".animated-weather-card .weather-info"))return;let t=window.AnimatedWeatherCardForecast;if(!t){We("animated-weather-card-forecast",()=>!!window.AnimatedWeatherCardForecast).then(()=>{this.isConnected&&!this.extras&&this.mountExtras()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`));return}t.version===2&&(this.extras=t.attach(this.forecastHost()),this.extras.update(),this.applySizeState())}forecastHost(){return{element:this,surface:this.surface,config:()=>this.config,hass:()=>this._hass,forecast:()=>this.forecastFeed,layers:()=>this.animationController,skyColors:Ee,phase:()=>this.currentSkyPhase(),current:()=>{let t=this.config?.outdoor_sensor_entity||this.config?.entity,i=Number(t?this.config?.outdoor_sensor_entity?this._hass?.states[t]?.state:this._hass?.states[t]?.attributes?.temperature:NaN);return isFinite(i)?i:void 0},temperature:t=>{let i=this.config?Xi(this.config):0;return zt(i?t:Math.round(t),this._hass,i).replace(/^-/,"\u2212")},conditionName:t=>this._hass?.formatEntityState?.({entity_id:this.config?.entity??"",state:t,attributes:{},last_changed:"",last_updated:""})??t,fit:()=>this.applySizeState(),refresh:()=>this._updateDataInPlace(),seen:()=>this.noteVisible,still:()=>this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,moreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config?.entity},bubbles:!0,composed:!0}))}}openForecast(){this.extras?this.extras.open():this.mountExtras()}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entity&&!t.dev_mode)throw new Error("You need to define an entity or enable dev mode");let i=a=>a===void 0||typeof a=="number"&&isFinite(a)&&a>=0&&a<=23;if(!i(t.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${t.sunrise_hour})`);if(!i(t.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${t.sunset_hour})`);let n=this.config?.auto_pause;this.config?.flights_entity!==t.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0),this.config=t;let r=this.querySelector(".weather-info");if(r&&oi(r,this.actionsConfig(),"group"),this.isConnected){this.initializeTimeOfDayManager();let a=this.animationController;this._animationGeneration++,this.animationController=new Oe(this,this.config,()=>this.animationsPaused,this.timeOfDayManager),a&&a.stopAllAnimations().catch(s=>k(this.config?.dev_mode,"Error stopping previous animation controller:",s))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&(this.syncForecastFeed(),this.mountExtras()),this.isConnected&&!!t.auto_pause!=!!n&&(this.removeVisibilityTracking(),this.setupVisibilityTracking())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>{this.applySizeState(),this.devPanel?.isOpen&&this.devPanel.dock()}),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this._initialRender&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=new Oe(this,this.config,()=>this.animationsPaused,this.timeOfDayManager))),this.attachEventListeners(),this.setupVisibilityTracking(),this.syncForecastFeed(),this.mountExtras(),this._updateDataInPlace(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=new Oe(this,this.config,()=>this.animationsPaused,this.timeOfDayManager)),this._initialRender=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let i=this.querySelector(".animated-weather-card");i&&(i.classList.remove("no-transitions"),i.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass&&!this.config.dev_mode)return;er(this),this.stopPlanes();let t=this.config.color_palette||"default",i;try{i=mr(this.hass,this.config,this.currentDevCondition)}catch(O){let F=O?.message||"Error loading weather data";this.innerHTML=`
              <ha-card>
                <div class="awc-empty-state" role="status">
                  ${he("alert","awc-empty-icon")}
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${D(F)}</div>
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
            `;return}let{temperature:n,weatherCondition:r,location:a,humidity:s,windSpeed:l,windSpeedValue:c,windBearing:d,pressure:m,pressureValue:h,feelsLike:p,indoorTemperature:g,indoorHumidity:u,sun:f}=i,w=this.updatePressureTrend(h);this.currentWindSpeedValue=c;let y=f?.aboveHorizon??!1,b=f?de(y?f.sunset:f.sunrise,this._hass):"--",v=this.config.show_sun!==!1&&!!f&&b!=="--",_=!!this.config.compact,x=_o(this.config),T=this.config.show_attribute_icons!==!1,C=this.config.show_attribute_labels!==!1,A=(O,F,z,R,H="")=>{let G=T||C?`<div class="attribute-label">${T?he(F,"attribute-icon"):""}${C?`<span>${D(z)}</span>`:""}</div>`:"";return`<div class="attribute" data-kind="${O}">${G}<div class="attribute-value"><span class="attribute-text">${R}</span>${H}</div></div>`},S=typeof d=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${d+180}deg);" aria-label="${ko(d)}"></ha-icon>`:"",E=w?`<ha-icon class="pressure-trend ${w}" icon="${Eo(w)}" aria-label="Pressure ${w}"></ha-icon>`:"",M=this.config.show_attributes!==!1?`
              <div class="weather-attributes${C?"":" values-only"}">${[A("humidity","humidity",Ai(this._hass,"ui.card.weather.attributes.humidity","Humidity"),D(s)),A("wind","wind",Ai(this._hass,"ui.card.weather.attributes.wind_speed","Wind"),D(l),S),A("pressure","pressure",Ai(this._hass,"ui.card.weather.attributes.air_pressure","Pressure"),D(m),E),v?A("sun",Mo(y),xt(this._hass,y?"sunset":"sunrise"),ri(b,"awc-ampm")):""].join("")}</div>`:"";this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions${this.surface==="view"?"":" loading"} ${t==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${_?' data-variant="compact"':""} style="${D(x)}">
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
                ${this.locationHtml(_,a)}
                <div class="temperature" aria-live="polite"><span class="temperature-value">${D(n)}</span><span class="degree">\xB0</span></div>
                <div class="weather-desc" aria-live="polite">${D(r)}</div>
                ${_?`<div class="compact-meta">${this.config.show_clock?'<span class="awc-clock"></span>':""}<span class="awc-meta-text">${D(this.compactMeta(a,p))}</span></div>`:`<div class="hero-meta">${this.heroMetaHtml(p,g,u)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
              </div>
              ${_?"":M}
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
        ${ur()}
      </style>
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill(),this.syncForecastFeed(),this.mountExtras()}locationHtml(t,i){if(t)return"";let n=this.config?.show_location!==!1&&i?`<span class="awc-place">${D(i)}</span>`:"",r=this.config?.show_clock&&!this.config.dev_mode?'<span class="awc-clock"></span>':"";return n||r?`<div class="location">${r}${n}</div>`:""}applySpill(){let t=this.querySelector("ha-card");if(!t)return;let i=this.config?.spill_particles!==!1?"visible":"hidden";t.style.setProperty("overflow",i,"important");let n=()=>{let r=t.shadowRoot;if(!r)return;let a=r.querySelector("#awc-overflow");a||(a=document.createElement("style"),a.id="awc-overflow",r.appendChild(a)),a.textContent=`:host { overflow: ${i} !important; }`};n(),!t.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(n))}transitionCondition(){let t=this.querySelector(".animated-weather-card");if(!t||t.classList.contains("loading")){this.initializeAnimations();return}t.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},Ac)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&!this.config.dev_mode}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let t=window.AnimatedWeatherCardNote;if(t){this.noteWriter??(this.noteWriter=new t(this)),this.noteWriter.start();return}We("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(t){this.writtenNote=t,this.updateNote()}noteWriting(t){this.noteComing!==t&&(this.noteComing=t,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let t=this.config.note_entity?mo(this._hass,this.config):this.writtenNote,i=t?po(t,this.config):null;if(!t||i===null)return t;let n=i-Date.now();return n<=0?null:(n<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),n+50)),t)}noteHtml(t){return`<p class="weather-note"${t?"":" hidden"}><span class="note-long">${D(t?.note??"")}</span><span class="note-short">${D(t?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let t=this.querySelector(".weather-note");if(!t)return;let i=t.querySelector(".note-long"),n=t.querySelector(".note-short"),r=t.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let l=t.querySelector(".note-phrase"),c=xt(this._hass,this.noteComing==="forecast"?"note_reading":"note_writing");!r||t.hidden?(l&&(l.textContent=c),t.dataset.writing="",t.setAttribute("aria-busy","true"),t.hidden=!1,this.applySizeState()):this.fadeThrough(l,c);return}r&&(delete t.dataset.writing,t.removeAttribute("aria-busy"));let a=this.currentNote();if(!a){this.noteTyping?.finish(),(!t.hidden||r)&&(t.hidden=!0,this.applySizeState());return}if(t.hidden||r){this.noteTyping?.finish(),i&&(i.textContent=a.note),n&&(n.textContent=a.line),t.hidden=!1,this.applySizeState(),r&&this.typeIn(t);return}if(this.noteTyping){if(this.noteTyping.text===a.note+a.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(i,a.note,s),this.fadeThrough(n,a.line,s)}compactMeta(t,i){return[this.config?.show_location!==!1?t:"",i?`${xt(this._hass,"feels_like")} ${i}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let t=this.config?.indoor_style,i=D(xt(this._hass,"indoors")),n=he("indoor","indoor-icon");if(t==="icon")return`${n}<span class="awc-visually-hidden">${i} </span>`;let r=`<span class="indoor-label">${i}</span>`;return t==="both"?n+r:r}heroMetaHtml(t,i,n){let r=[];t&&r.push(`<span class="feels-like">${D(xt(this._hass,"feels_like"))} ${D(t)}</span>`);let a=[i,n].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&a.length&&r.push(`<span class="indoor-climate-inline">${this.indoorLead()}${a.map(s=>D(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),r.join("")}mountDevPanel(){if(!this.config?.dev_mode){this.devPanel?.disconnect(),this.devPanel=void 0;return}let t=window.AnimatedWeatherCardDevPanel;if(t){this.devPanel??(this.devPanel=new t(this)),this.devPanel.mount();return}We("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevPanel).then(()=>{this.isConnected&&this.mountDevPanel()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}attachEventListeners(){this.mountDevPanel(),this.mountNoteWriter();let t=this.querySelector(".weather-info");if(t&&(Qi(t,this,()=>this.actionsConfig(),{forecast:()=>this.openForecast()}),oi(t,this.actionsConfig(),"group")),!this.isInitializing){let i=window.setTimeout(()=>{this.initializeAnimations(),this.config?.dev_mode&&!this.currentDevCondition&&(this.currentDevCondition="sunny")},100);this.pendingTimeouts.push(i)}}setAnimationsPaused(t){this.animationsPaused=t,this.toggleAttribute("data-paused",t),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),ki(this)):this._needsAnimationRestart?(this._needsAnimationRestart=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),Ei(this)),this.devPanel?.updatePauseButton()}getWeatherSettings(t){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return J(this.config,t)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let t=++this._animationGeneration;try{if(!this.config)return;let i=this.config,n=this.querySelector(".animated-weather-card");if(!n)return;this.clearAnimations();let r;if(i.dev_mode)r=this.currentDevCondition||"sunny";else{if(!this.hass||!i.entity)return;let m=this.hass.states[i.entity];if(!m)return;r=m.state.toLowerCase()}let a=Mi(r,i.dev_mode??!1,i.sunrise_hour,i.sunset_hour,this._hass?.config?.time_zone,{clock:!!i.enable_day_night_cycle,night:this.skyIsNight()}),s=(i.color_palette||"default")==="theme"?"theme-colors":"",l=n.classList.contains("loading"),c=(...m)=>{n.className=["animated-weather-card",a,...m,s,l?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),l&&requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.remove("no-transitions"),n.classList.add("transitions-enabled")}))},d=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(i.animate===!1||d){c(i.animate===!1?"static":""),this.currentWeatherClass=a;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&t===this._animationGeneration){if(c(),this.animationsPaused){this.currentWeatherClass=a,this._needsAnimationRestart=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.animationController.applyWeatherCondition(a)),this.startPlanes()}},i.dev_mode?50:this.surface==="view"?0:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),er(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(a=>{a.innerHTML=""});let i=this.querySelector(".animated-weather-card"),n=this.querySelector(".animation-layer");n&&(ei(this),n.querySelectorAll(".star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),n.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),i&&(Wi(i),Ya(i));let r=this.querySelector(".lightning");r&&(r.classList.remove("flash"),r.innerHTML=""),tr(this.pendingTimeouts)}set hass(t){let i=this._hass;if(this._hass=t,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),this.syncForecastFeed(),this.extras?.update(),!i){this.render(),this.initializeAnimations();return}if(De(i)!==De(t)){this.render(),this.initializeAnimations();return}if(this.config.dev_mode||!this.config.entity)return;let n=i.states[this.config.entity],r=t.states[this.config.entity];if(!n||!r){this.render(),this.initializeAnimations();return}if(n.state!==r.state){this._updateDataInPlace(),this.transitionCondition();return}let a=!1,s=c=>c==null?"__missing__":String(c),l=["temperature","apparent_temperature","humidity","wind_speed","pressure","wind_bearing","friendly_name"];for(let c of l)if(s(n.attributes[c])!==s(r.attributes[c])){a=!0;break}if(this.config.note_entity&&i.states[this.config.note_entity]!==t.states[this.config.note_entity]&&(a=!0),!a){let c=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.humidity_sensor_entity,this.config.pressure_sensor_entity,this.config.wind_speed_sensor_entity,this.config.wind_direction_sensor_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity];for(let d of c){if(!d)continue;let m=i.states[d]?.state,h=t.states[d]?.state;if(m!==h){a=!0;break}}}if(a)this._updateDataInPlace();else{let c=this.config.sun_entity||"sun.sun";i.states[c]!==t.states[c]&&this.applySkyPhase()}}}_updateDataInPlace(){if(!this.config||!this._hass&&!this.config.dev_mode)return;let t;try{t=mr(this._hass,this.config,this.currentDevCondition)}catch{return}let{temperature:i,weatherCondition:n,humidity:r,windSpeed:a,windSpeedValue:s,windBearing:l,pressure:c,pressureValue:d,feelsLike:m,indoorTemperature:h,indoorHumidity:p,sun:g}=t;this.currentWindSpeedValue=s;let u=!!this.extras?.away(),f=this.config.entity?this._hass?.states[this.config.entity]?.state:void 0,w=f&&this.extras?.conditionText(f)||n,y=(_,x)=>{_&&_.textContent!==x&&(_.textContent=x)};if(!u){this.fadeThrough(this.querySelector(".temperature-value"),i),this.fadeThrough(this.querySelector(".weather-desc"),w);let _=(T,C)=>{y(this.querySelector(`.weather-attributes .attribute[data-kind="${T}"] .attribute-text`),C)};u||(_("humidity",r),_("wind",a),_("pressure",c)),u||this.syncValueIcon("wind","wind-bearing-arrow",typeof l=="number"?{icon:"mdi:navigation",transform:`rotate(${l+180}deg)`,label:ko(l)}:null);let x=this.updatePressureTrend(d);if(this.syncValueIcon("pressure","pressure-trend",x?{icon:Eo(x),label:`Pressure ${x}`,className:x}:null),g){let T=this.querySelector('.weather-attributes .attribute[data-kind="sun"]'),C=T?.querySelector(".attribute-text"),A=ri(de(g.aboveHorizon?g.sunset:g.sunrise,this._hass),"awc-ampm");C&&C.innerHTML!==A&&(C.innerHTML=A),y(T?.querySelector(".attribute-label > span")??null,xt(this._hass,g.aboveHorizon?"sunset":"sunrise")),yo(T?.querySelector(".attribute-icon"),Mo(g.aboveHorizon))}}let b=this.querySelector(".compact-meta .awc-meta-text");b&&y(b,this.compactMeta(t.location,m)),y(this.querySelector(".location .awc-place"),t.location);let v=this.querySelector(".hero-meta");if(v){let _=this.heroMetaHtml(m,h,p),x=v.querySelector(".awc-line");Array.from(v.children).filter(C=>C!==x).map(C=>C.outerHTML).join("")!==_&&(v.innerHTML=_,x&&v.prepend(x))}this.updateNote(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(s)}updatePressureTrend(t){return typeof t!="number"?this._pressureTrend??null:(typeof this._lastPressureValue!="number"?this._lastPressureValue=t:Math.abs(t-this._lastPressureValue)>=.5&&(this._pressureTrend=t>this._lastPressureValue?"rising":"falling",this._lastPressureValue=t),this._pressureTrend??null)}syncValueIcon(t,i,n){let r=this.querySelector(`.weather-attributes .attribute[data-kind="${t}"] .attribute-value`);if(!r)return;let a=r.querySelector(`.${i}`);if(!n){a?.remove();return}a||(a=document.createElement("ha-icon"),r.appendChild(a)),a.className=[i,n.className].filter(Boolean).join(" "),a.getAttribute("icon")!==n.icon&&a.setAttribute("icon",n.icon),a.setAttribute("aria-label",n.label),a.style.transform=n.transform??""}typeIn(t){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let i=Array.from(t.querySelectorAll(".note-long, .note-short")).map(h=>{let p=h.textContent??"",g=document.createElement("span");g.className="note-typed";let u=document.createElement("span");return u.className="note-untyped",u.textContent=p,h.replaceChildren(g,u),{span:h,text:p,typed:g,rest:u}}),n=Math.max(0,...i.map(h=>h.text.length)),r=Math.min(Cc,Math.max(Tc,n*Sc)),a=window.requestAnimationFrame?.bind(window)??(h=>window.setTimeout(()=>h(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),l=Date.now(),c=0,d={text:i.map(h=>h.text).join(""),finish:()=>{s(c);for(let h of i)h.span.textContent=h.text;this.noteTyping===d&&(this.noteTyping=void 0)}},m=()=>{let h=Math.min(1,(Date.now()-l)/r);for(let p of i){let g=Math.round(h*p.text.length);p.typed.textContent=p.text.slice(0,g),p.rest.textContent=p.text.slice(g)}h<1?c=a(m):d.finish()};this.noteTyping=d,c=a(m)}fadeThrough(t,i,n){if(!t)return;let r=this.heroTextPending.get(t);if((r??t.textContent)===i)return;let a=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof t.animate!="function"||a){t.textContent=i,n?.();return}if(this.heroTextPending.set(t,i),r!==void 0)return;let s=()=>{let c=this.heroTextPending.get(t);this.heroTextPending.delete(t),c!==void 0&&(t.textContent=c),n?.()},l=t.animate([{opacity:1},{opacity:0}],{duration:kc,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});l.onfinish=()=>{s(),t.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:Ec,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),l.cancel()},l.oncancel=s}get hass(){return this._hass}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.config.dev_mode)return;this.planesWanted=!0;let t=window.AnimatedWeatherCardPlanes;if(!t){We("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}let i=new t(this,{intensity:1,scale:1,devMode:this.config.dev_mode||!1},this.config);this.planes=i,i.start().then(()=>{this.animationsPaused&&i.pause()}).catch(n=>{console.error("Failed to start plane fly-overs:",n),this.planes===i&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let t=this.planes;t&&(this.planes=void 0,t.destroy().catch(i=>k(this.config?.dev_mode,"Error stopping plane fly-overs:",i)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let t=this._hass?.states[this.config.flights_entity];if(t&&t===this.lastFlightsState)return;this.lastFlightsState=t;let i=this.flightTracker.update(co(this._hass,this.config.flights_entity),!!this.config.planes_on_load);i.length&&this.flyPlanes(i)}flyPlanes(t){!this.planes||this.animationsPaused||this.planes.flyOver(t,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1,labelMode:this.config?.flight_label,speed:this.config?.plane_speed})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride)?this.timeOfDayManager.getCurrentState().isNighttime:this._hass?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.extras?.seen(this.noteVisible),this.wasManuallyPaused)return;let t=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;t!==this.animationsPaused&&this.setAnimationsPaused(t)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(t=>{this.offscreen=!t[t.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}disconnectedCallback(){this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.extras?.destroy(),this.extras=void 0,this.forecastFeed.stop(),this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.devPanel?.disconnect(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),tr(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new ji({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(t=>{this.onTimeOfDayChanged(t)}),this.config?.enable_day_night_cycle){let t=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(t)}}onTimeOfDayChanged(t){this.config?.enable_day_night_cycle&&(k(this.config?.dev_mode,`Time of day changed to: ${t.timePhase}`),this.updateDayNightBackground(t))}updateDayNightBackground(t){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))return this.timeOfDayManager.getCurrentState().timePhase;let t=this._hass?.states[this.config?.sun_entity||"sun.sun"];if(!t)return"day";let i=t.attributes?.elevation;return Ii(typeof i=="number"?i:Number(i),!!t.attributes?.rising,t.state!=="below_horizon")}skyIsNight(){if(!(!(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))&&!this._hass?.states[this.config?.sun_entity||"sun.sun"]))return this.currentSkyPhase()==="night"}applySkyPhase(){let t=this.querySelector(".animated-weather-card");if(!t)return;let i=this.currentSkyPhase();t.dataset.phase!==i&&(t.dataset.phase=i)}applySizeState(){let t=this.querySelector(".animated-weather-card"),i=t?.querySelector(".weather-info");if(!t||!i)return;let n=t.querySelector(".main-weather-info"),r=t.querySelector(".weather-attributes");if(t.dataset.height="regular",r){let u=t.dataset.metrics;t.dataset.metrics="row";let f=Array.from(r.children),w=parseFloat(getComputedStyle(r).columnGap)||0,y=f.reduce((_,x)=>_+x.getBoundingClientRect().width,0)+w*Math.max(0,f.length-1),b=r.clientWidth-y,v=b<-.5||u==="grid"&&b<Mc;t.dataset.metrics=v?"grid":"row"}let a=t.dataset.variant==="compact",s=a?t.querySelector(".weather-desc"):null,l=t.querySelector(".weather-note"),c=()=>i.scrollHeight>i.clientHeight+1||!a&&!!n&&n.scrollHeight>n.clientHeight+1||!!s&&s.scrollWidth>s.clientWidth+1||!!l&&!l.hidden&&l.scrollHeight>l.clientHeight+1,m=!!l&&!l.hidden?Pc:Po.map(u=>[u,void 0]),h=([u,f])=>{t.dataset.height=u,f?t.dataset.note=f:delete t.dataset.note},p=this.extras,g=p?.levels()??[];if(!p||!g.length){for(let u of m)if(h(u),!c())break;p?.fitted();return}for(let u=0;u<g.length;u++){p.setLevel(g[u]);let f=u===g.length-1;for(let w of m){if(!f&&!["regular","close","compact"].includes(w[0]))break;if(h(w),!c()&&(f||p.levelOk(c))){p.fitted();return}}}p.fitted()}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:this.gridRows(),min_columns:6,min_rows:3}}gridRows(){let t=this.noteEnabled()?1:0;return this.config?.layout==="nightstand"?6:this.config?.show_forecast&&!this.config.dev_mode?(ze(this.config.entity?this._hass?.states[this.config.entity]:void 0).includes("hourly")?8:5)+t:4+t}getCardSize(){if(this.config?.compact)return 2;let t=3;return this.config?.show_indoor!==!1&&(t+=1),this.config?.show_attributes!==!1&&(t+=1),this.noteEnabled()&&(t+=1),this.config?.show_forecast&&(t+=3),t}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await si("animated-weather-card-editor"),document.createElement("animated-weather-card-editor")}};customElements.define("animated-weather-card",nn);var Cr=class extends nn{constructor(){super(),this.surface="forecast"}setConfig(e){if(!e.entity)throw new Error("Please define a weather entity (entity: weather.home)");super.setConfig(e)}gridRows(){if(this.config?.compact)return 2;let e=this.config?.show_hours!==!1&&ze(this.config?.entity?this.hass?.states[this.config.entity]:void 0).includes("hourly"),t=Math.max(0,Math.min(10,this.config?.forecast_days??7));return e?t<=3?5:7:Math.max(3,Math.ceil((58+t*32+20)/64))}getCardSize(){return this.config?.compact?2:this.gridRows()}static getStubConfig(e,t=[],i=[]){let n=[...t,...i,...Object.keys(e?.states??{})];return He(n.find(r=>r.startsWith("weather."))??Zn.entity,e)}static async getConfigElement(){return customElements.get("animated-forecast-card-editor")||await si("animated-forecast-card-editor"),document.createElement("animated-forecast-card-editor")}};customElements.define("animated-forecast-card",Cr);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,e)=>e.startsWith("weather.")?[{label:"Regular",config:{type:"custom:animated-weather-card",...He(e,o)}},{label:"Compact",config:{type:"custom:animated-weather-card",...He(e,o),compact:!0}}]:null});window.customCards.push({type:"animated-forecast-card",name:"Animated Forecast",description:"The next hours and days of a weather entity, in its own sky: drag through the hours and the sky goes there",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card#the-forecast-card",getEntitySuggestion:(o,e)=>e.startsWith("weather.")?[{label:"Forecast",config:{type:"custom:animated-forecast-card",...He(e,o)}},{label:"Forecast strip",config:{type:"custom:animated-forecast-card",...He(e,o),compact:!0}}]:null});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let o=Ee("sunny","day"),e=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${Oa} `,[`background: linear-gradient(90deg, ${o.top}, ${o.mid} 55%, ${o.bottom})`,`color: ${Rt(St(Me))}`,"border-radius: 4px 0 0 4px",...e].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${o.top}`,"border-radius: 0 4px 4px 0",...e].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
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
