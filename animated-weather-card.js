"use strict";(()=>{function Pe(o){if(o===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return o}function Pa(o,t){o.prototype=Object.create(t.prototype),o.prototype.constructor=o,o.__proto__=t}var he={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Ut={duration:.5,overwrite:!1,delay:0},bn,ee,I,xe=1e8,N=1/xe,dn=Math.PI*2,Mo=dn/4,Po=0,La=Math.sqrt,Lo=Math.cos,Oo=Math.sin,Q=function(t){return typeof t=="string"},Y=function(t){return typeof t=="function"},Oe=function(t){return typeof t=="number"},xi=function(t){return typeof t>"u"},Ee=function(t){return typeof t=="object"},de=function(t){return t!==!1},vn=function(){return typeof window<"u"},mi=function(t){return Y(t)||Q(t)},Oa=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},ne=Array.isArray,Fo=/random\([^)]+\)/g,Do=/,\s*/g,xa=/(?:-?\.?\d|\.)+/gi,xn=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,et=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,nn=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Sn=/[+-]=-?[.\d]+/,Wo=/[^,'"\[\]\s]+/gi,Ho=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,B,ke,hn,Tn,ge={},wi={},Fa,Da=function(t){return(wi=gt(t,ge))&&ae},Si=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},Kt=function(t,e){return!e&&console.warn(t)},Wa=function(t,e){return t&&(ge[t]=e)&&wi&&(wi[t]=e)||ge},jt=function(){return 0},zo={suppressEvents:!0,isStart:!0,kill:!1},pi={suppressEvents:!0,kill:!1},Ro={suppressEvents:!0},Cn={},Ne=[],un={},Ha,le={},an={},Sa=30,fi=[],kn="",An=function(t){var e=t[0],i,n;if(Ee(e)||Y(e)||(t=[t]),!(i=(e._gsap||{}).harness)){for(n=fi.length;n--&&!fi[n].targetTest(e););i=fi[n]}for(n=t.length;n--;)t[n]&&(t[n]._gsap||(t[n]._gsap=new Ln(t[n],i)))||t.splice(n,1);return t},$e=function(t){return t._gsap||An(Se(t))[0]._gsap},En=function(t,e,i){return(i=t[e])&&Y(i)?t[e]():xi(i)&&t.getAttribute&&t.getAttribute(e)||i},re=function(t,e){return(t=t.split(",")).forEach(e)||t},U=function(t){return Math.round(t*1e5)/1e5||0},G=function(t){return Math.round(t*1e7)/1e7||0},tt=function(t,e){var i=e.charAt(0),n=parseFloat(e.substr(2));return t=parseFloat(t),i==="+"?t+n:i==="-"?t-n:i==="*"?t*n:t/n},No=function(t,e){for(var i=e.length,n=0;t.indexOf(e[n])<0&&++n<i;);return n<i},yi=function(){var t=Ne.length,e=Ne.slice(0),i,n;for(un={},Ne.length=0,i=0;i<t;i++)n=e[i],n&&n._lazy&&(n.render(n._lazy[0],n._lazy[1],!0)._lazy=0)},Mn=function(t){return!!(t._initted||t._startAt||t.add)},za=function(t,e,i,n){Ne.length&&!ee&&yi(),t.render(e,i,n||!!(ee&&e<0&&Mn(t))),Ne.length&&!ee&&yi()},Ra=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(Wo).length<2?e:Q(t)?t.trim():t},Na=function(t){return t},we=function(t,e){for(var i in e)i in t||(t[i]=e[i]);return t},$o=function(t){return function(e,i){for(var n in i)n in e||n==="duration"&&t||n==="ease"||(e[n]=i[n])}},gt=function(t,e){for(var i in e)t[i]=e[i];return t},Ta=function o(t,e){for(var i in e)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(t[i]=Ee(e[i])?o(t[i]||(t[i]={}),e[i]):e[i]);return t},_i=function(t,e){var i={},n;for(n in t)n in e||(i[n]=t[n]);return i},qt=function(t){var e=t.parent||B,i=t.keyframes?$o(ne(t.keyframes)):we;if(de(t.inherit))for(;e;)i(t,e.vars.defaults),e=e.parent||e._dp;return t},Io=function(t,e){for(var i=t.length,n=i===e.length;n&&i--&&t[i]===e[i];);return i<0},$a=function(t,e,i,n,a){i===void 0&&(i="_first"),n===void 0&&(n="_last");var r=t[n],s;if(a)for(s=e[a];r&&r[a]>s;)r=r._prev;return r?(e._next=r._next,r._next=e):(e._next=t[i],t[i]=e),e._next?e._next._prev=e:t[n]=e,e._prev=r,e.parent=e._dp=t,e},Ti=function(t,e,i,n){i===void 0&&(i="_first"),n===void 0&&(n="_last");var a=e._prev,r=e._next;a?a._next=r:t[i]===e&&(t[i]=r),r?r._prev=a:t[n]===e&&(t[n]=a),e._next=e._prev=e.parent=null},Ie=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Ze=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var i=t;i;)i._dirty=1,i=i.parent;return t},Go=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},mn=function(t,e,i,n){return t._startAt&&(ee?t._startAt.revert(pi):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,n))},Bo=function o(t){return!t||t._ts&&o(t.parent)},Ca=function(t){return t._repeat?wt(t._tTime,t=t.duration()+t._rDelay)*t:0},wt=function(t,e){var i=Math.floor(t=G(t/e));return t&&i===t?i-1:i},bi=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Ci=function(t){return t._end=G(t._start+(t._tDur/Math.abs(t._ts||t._rts||N)||0))},ki=function(t,e){var i=t._dp;return i&&i.smoothChildTiming&&t._ts&&(t._start=G(i._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ci(t),i._dirty||Ze(i,t)),t},Ia=function(t,e){var i;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(i=bi(t.rawTime(),e),(!e._dur||Qt(0,e.totalDuration(),i)-e._tTime>N)&&e.render(i,!0)),Ze(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(i=t;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;t._zTime=-N}},Ae=function(t,e,i,n){return e.parent&&Ie(e),e._start=G((Oe(i)?i:i||t!==B?ve(t,i,e):t._time)+e._delay),e._end=G(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),$a(t,e,"_first","_last",t._sort?"_start":0),pn(e)||(t._recent=e),n||Ia(t,e),t._ts<0&&ki(t,t._tTime),t},Ga=function(t,e){return(ge.ScrollTrigger||Si("scrollTrigger",e))&&ge.ScrollTrigger.create(e,t)},Ba=function(t,e,i,n,a){if(Dn(t,e,a),!t._initted)return 1;if(!i&&t._pt&&!ee&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&Ha!==ce.frame)return Ne.push(t),t._lazy=[a,n],1},qo=function o(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||o(e))},pn=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},Vo=function(t,e,i,n){var a=t.ratio,r=e<0||!e&&(!t._start&&qo(t)&&!(!t._initted&&pn(t))||(t._ts<0||t._dp._ts<0)&&!pn(t))?0:1,s=t._rDelay,l=0,c,d,h;if(s&&t._repeat&&(l=Qt(0,t._tDur,e),d=wt(l,s),t._yoyo&&d&1&&(r=1-r),d!==wt(t._tTime,s)&&(a=1-r,t.vars.repeatRefresh&&t._initted&&t.invalidate())),r!==a||ee||n||t._zTime===N||!e&&t._zTime){if(!t._initted&&Ba(t,e,n,i,l))return;for(h=t._zTime,t._zTime=e||(i?N:0),i||(i=e&&!h),t.ratio=r,t._from&&(r=1-r),t._time=0,t._tTime=l,c=t._pt;c;)c.r(r,c.d),c=c._next;e<0&&mn(t,e,i,!0),t._onUpdate&&!i&&fe(t,"onUpdate"),l&&t._repeat&&!i&&t.parent&&fe(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===r&&(r&&Ie(t,1),!i&&!ee&&(fe(t,r?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},Yo=function(t,e,i){var n;if(i>e)for(n=t._first;n&&n._start<=i;){if(n.data==="isPause"&&n._start>e)return n;n=n._next}else for(n=t._last;n&&n._start>=i;){if(n.data==="isPause"&&n._start<e)return n;n=n._prev}},yt=function(t,e,i,n){var a=t._repeat,r=G(e)||0,s=t._tTime/t._tDur;return s&&!n&&(t._time*=r/t._dur),t._dur=r,t._tDur=a?a<0?1e10:G(r*(a+1)+t._rDelay*a):r,s>0&&!n&&ki(t,t._tTime=t._tDur*s),t.parent&&Ci(t),i||Ze(t.parent,t),t},ka=function(t){return t instanceof ie?Ze(t):yt(t,t._dur)},Uo={_start:0,endTime:jt,totalDuration:jt},ve=function o(t,e,i){var n=t.labels,a=t._recent||Uo,r=t.duration()>=xe?a.endTime(!1):t._dur,s,l,c;return Q(e)&&(isNaN(e)||e in n)?(l=e.charAt(0),c=e.substr(-1)==="%",s=e.indexOf("="),l==="<"||l===">"?(s>=0&&(e=e.replace(/=/,"")),(l==="<"?a._start:a.endTime(a._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(s<0?a:i).totalDuration()/100:1)):s<0?(e in n||(n[e]=r),n[e]):(l=parseFloat(e.charAt(s-1)+e.substr(s+1)),c&&i&&(l=l/100*(ne(i)?i[0]:i).totalDuration()),s>1?o(t,e.substr(0,s-1),i)+l:r+l)):e==null?r:+e},Vt=function(t,e,i){var n=Oe(e[1]),a=(n?2:1)+(t<2?0:1),r=e[a],s,l;if(n&&(r.duration=e[1]),r.parent=i,t){for(s=r,l=i;l&&!("immediateRender"in s);)s=l.vars.defaults||{},l=de(l.vars.inherit)&&l.parent;r.immediateRender=de(s.immediateRender),t<2?r.runBackwards=1:r.startAt=e[a-1]}return new K(e[0],r,e[a+1])},Ge=function(t,e){return t||t===0?e(t):e},Qt=function(t,e,i){return i<t?t:i>e?e:i},te=function(t,e){return!Q(t)||!(e=Ho.exec(t))?"":e[1]},Ko=function(t,e,i){return Ge(i,function(n){return Qt(t,e,n)})},fn=[].slice,qa=function(t,e){return t&&Ee(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&Ee(t[0]))&&!t.nodeType&&t!==ke},jo=function(t,e,i){return i===void 0&&(i=[]),t.forEach(function(n){var a;return Q(n)&&!e||qa(n,1)?(a=i).push.apply(a,Se(n)):i.push(n)})||i},Se=function(t,e,i){return I&&!e&&I.selector?I.selector(t):Q(t)&&!i&&(hn||!_t())?fn.call((e||Tn).querySelectorAll(t),0):ne(t)?jo(t,i):qa(t)?fn.call(t,0):t?[t]:[]},gn=function(t){return t=Se(t)[0]||Kt("Invalid scope")||{},function(e){var i=t.current||t.nativeElement||t;return Se(e,i.querySelectorAll?i:i===t?Kt("Invalid scope")||Tn.createElement("div"):t)}},Va=function(t){return t.sort(function(){return .5-Math.random()})},Ya=function(t){if(Y(t))return t;var e=Ee(t)?t:{each:t},i=Qe(e.ease),n=e.from||0,a=parseFloat(e.base)||0,r={},s=n>0&&n<1,l=isNaN(n)||s,c=e.axis,d=n,h=n;return Q(n)?d=h={center:.5,edges:.5,end:1}[n]||0:!s&&l&&(d=n[0],h=n[1]),function(m,p,g){var u=(g||e).length,f=r[u],w,_,v,b,y,C,S,k,T;if(!f){if(T=e.grid==="auto"?0:(e.grid||[1,xe])[1],!T){for(S=-xe;S<(S=g[T++].getBoundingClientRect().left)&&T<u;);T<u&&T--}for(f=r[u]=[],w=l?Math.min(T,u)*d-.5:n%T,_=T===xe?0:l?u*h/T-.5:n/T|0,S=0,k=xe,C=0;C<u;C++)v=C%T-w,b=_-(C/T|0),f[C]=y=c?Math.abs(c==="y"?b:v):La(v*v+b*b),y>S&&(S=y),y<k&&(k=y);n==="random"&&Va(f),f.max=S-k,f.min=k,f.v=u=(parseFloat(e.amount)||parseFloat(e.each)*(T>u?u-1:c?c==="y"?u/T:T:Math.max(T,u/T))||0)*(n==="edges"?-1:1),f.b=u<0?a-u:a,f.u=te(e.amount||e.each)||0,i=i&&u<0?ls(i):i}return u=(f[m]-f.min)/f.max||0,G(f.b+(i?i(u):u)*f.v)+f.u}},wn=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(i){var n=G(Math.round(parseFloat(i)/t)*t*e);return(n-n%1)/e+(Oe(i)?0:te(i))}},Ua=function(t,e){var i=ne(t),n,a;return!i&&Ee(t)&&(n=i=t.radius||xe,t.values?(t=Se(t.values),(a=!Oe(t[0]))&&(n*=n)):t=wn(t.increment)),Ge(e,i?Y(t)?function(r){return a=t(r),Math.abs(a-r)<=n?a:r}:function(r){for(var s=parseFloat(a?r.x:r),l=parseFloat(a?r.y:0),c=xe,d=0,h=t.length,m,p;h--;)a?(m=t[h].x-s,p=t[h].y-l,m=m*m+p*p):m=Math.abs(t[h]-s),m<c&&(c=m,d=h);return d=!n||c<=n?t[d]:r,a||d===r||Oe(r)?d:d+te(r)}:wn(t))},Ka=function(t,e,i,n){return Ge(ne(t)?!e:i===!0?!!(i=0):!n,function(){return ne(t)?t[~~(Math.random()*t.length)]:(i=i||1e-5)&&(n=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((t-i/2+Math.random()*(e-t+i*.99))/i)*i*n)/n})},Xo=function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return function(n){return e.reduce(function(a,r){return r(a)},n)}},Zo=function(t,e){return function(i){return t(parseFloat(i))+(e||te(i))}},Qo=function(t,e,i){return Xa(t,e,0,1,i)},ja=function(t,e,i){return Ge(i,function(n){return t[~~e(n)]})},Jo=function o(t,e,i){var n=e-t;return ne(t)?ja(t,o(0,t.length),e):Ge(i,function(a){return(n+(a-t)%n)%n+t})},es=function o(t,e,i){var n=e-t,a=n*2;return ne(t)?ja(t,o(0,t.length-1),e):Ge(i,function(r){return r=(a+(r-t)%a)%a||0,t+(r>n?a-r:r)})},bt=function(t){return t.replace(Fo,function(e){var i=e.indexOf("[")+1,n=e.substring(i||7,i?e.indexOf("]"):e.length-1).split(Do);return Ka(i?n:+n[0],i?0:+n[1],+n[2]||1e-5)})},Xa=function(t,e,i,n,a){var r=e-t,s=n-i;return Ge(a,function(l){return i+((l-t)/r*s||0)})},ts=function o(t,e,i,n){var a=isNaN(t+e)?0:function(p){return(1-p)*t+p*e};if(!a){var r=Q(t),s={},l,c,d,h,m;if(i===!0&&(n=1)&&(i=null),r)t={p:t},e={p:e};else if(ne(t)&&!ne(e)){for(d=[],h=t.length,m=h-2,c=1;c<h;c++)d.push(o(t[c-1],t[c]));h--,a=function(g){g*=h;var u=Math.min(m,~~g);return d[u](g-u)},i=e}else n||(t=gt(ne(t)?[]:{},t));if(!d){for(l in e)On.call(s,t,l,"get",e[l]);a=function(g){return zn(g,s)||(r?t.p:t)}}}return Ge(i,a)},Aa=function(t,e,i){var n=t.labels,a=xe,r,s,l;for(r in n)s=n[r]-e,s<0==!!i&&s&&a>(s=Math.abs(s))&&(l=r,a=s);return l},fe=function(t,e,i){var n=t.vars,a=n[e],r=I,s=t._ctx,l,c,d;if(a)return l=n[e+"Params"],c=n.callbackScope||t,i&&Ne.length&&yi(),s&&(I=s),d=l?a.apply(c,l):a.call(c),I=r,d},Gt=function(t){return Ie(t),t.scrollTrigger&&t.scrollTrigger.kill(!!ee),t.progress()<1&&fe(t,"onInterrupt"),t},ft,Za=[],Qa=function(t){if(t)if(t=!t.name&&t.default||t,vn()||t.headless){var e=t.name,i=Y(t),n=e&&!i&&t.init?function(){this._props=[]}:t,a={init:jt,render:zn,add:On,kill:ys,modifier:ws,rawVars:0},r={targetTest:0,get:0,getSetter:Ai,aliases:{},register:0};if(_t(),t!==n){if(le[e])return;we(n,we(_i(t,a),r)),gt(n.prototype,gt(a,_i(t,r))),le[n.prop=e]=n,t.targetTest&&(fi.push(n),Cn[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}Wa(e,n),t.register&&t.register(ae,n,oe)}else Za.push(t)},R=255,Bt={aqua:[0,R,R],lime:[0,R,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,R],navy:[0,0,128],white:[R,R,R],olive:[128,128,0],yellow:[R,R,0],orange:[R,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[R,0,0],pink:[R,192,203],cyan:[0,R,R],transparent:[R,R,R,0]},rn=function(t,e,i){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(i-e)*t*6:t<.5?i:t*3<2?e+(i-e)*(2/3-t)*6:e)*R+.5|0},Ja=function(t,e,i){var n=t?Oe(t)?[t>>16,t>>8&R,t&R]:0:Bt.black,a,r,s,l,c,d,h,m,p,g;if(!n){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),Bt[t])n=Bt[t];else if(t.charAt(0)==="#"){if(t.length<6&&(a=t.charAt(1),r=t.charAt(2),s=t.charAt(3),t="#"+a+a+r+r+s+s+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return n=parseInt(t.substr(1,6),16),[n>>16,n>>8&R,n&R,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),n=[t>>16,t>>8&R,t&R]}else if(t.substr(0,3)==="hsl"){if(n=g=t.match(xa),!e)l=+n[0]%360/360,c=+n[1]/100,d=+n[2]/100,r=d<=.5?d*(c+1):d+c-d*c,a=d*2-r,n.length>3&&(n[3]*=1),n[0]=rn(l+1/3,a,r),n[1]=rn(l,a,r),n[2]=rn(l-1/3,a,r);else if(~t.indexOf("="))return n=t.match(xn),i&&n.length<4&&(n[3]=1),n}else n=t.match(xa)||Bt.transparent;n=n.map(Number)}return e&&!g&&(a=n[0]/R,r=n[1]/R,s=n[2]/R,h=Math.max(a,r,s),m=Math.min(a,r,s),d=(h+m)/2,h===m?l=c=0:(p=h-m,c=d>.5?p/(2-h-m):p/(h+m),l=h===a?(r-s)/p+(r<s?6:0):h===r?(s-a)/p+2:(a-r)/p+4,l*=60),n[0]=~~(l+.5),n[1]=~~(c*100+.5),n[2]=~~(d*100+.5)),i&&n.length<4&&(n[3]=1),n},er=function(t){var e=[],i=[],n=-1;return t.split(Le).forEach(function(a){var r=a.match(et)||[];e.push.apply(e,r),i.push(n+=r.length+1)}),e.c=i,e},Ea=function(t,e,i){var n="",a=(t+n).match(Le),r=e?"hsla(":"rgba(",s=0,l,c,d,h;if(!a)return t;if(a=a.map(function(m){return(m=Ja(m,e,1))&&r+(e?m[0]+","+m[1]+"%,"+m[2]+"%,"+m[3]:m.join(","))+")"}),i&&(d=er(t),l=i.c,l.join(n)!==d.c.join(n)))for(c=t.replace(Le,"1").split(et),h=c.length-1;s<h;s++)n+=c[s]+(~l.indexOf(s)?a.shift()||r+"0,0,0,0)":(d.length?d:a.length?a:i).shift());if(!c)for(c=t.split(Le),h=c.length-1;s<h;s++)n+=c[s]+a[s];return n+c[h]},Le=(function(){var o="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in Bt)o+="|"+t+"\\b";return new RegExp(o+")","gi")})(),is=/hsl[a]?\(/,Pn=function(t){var e=t.join(" "),i;if(Le.lastIndex=0,Le.test(e))return i=is.test(e),t[1]=Ea(t[1],i),t[0]=Ea(t[0],i,er(t[1])),!0},Xt,ce=(function(){var o=Date.now,t=500,e=33,i=o(),n=i,a=1e3/240,r=a,s=[],l,c,d,h,m,p,g=function u(f){var w=o()-n,_=f===!0,v,b,y,C;if((w>t||w<0)&&(i+=w-e),n+=w,y=n-i,v=y-r,(v>0||_)&&(C=++h.frame,m=y-h.time*1e3,h.time=y=y/1e3,r+=v+(v>=a?4:a-v),b=1),_||(l=c(u)),b)for(p=0;p<s.length;p++)s[p](y,m,C,f)};return h={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(f){return m/(1e3/(f||60))},wake:function(){Fa&&(!hn&&vn()&&(ke=hn=window,Tn=ke.document||{},ge.gsap=ae,(ke.gsapVersions||(ke.gsapVersions=[])).push(ae.version),Da(wi||ke.GreenSockGlobals||!ke.gsap&&ke||{}),Za.forEach(Qa)),d=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&h.sleep(),c=d||function(f){return setTimeout(f,r-h.time*1e3+1|0)},Xt=1,g(2))},sleep:function(){(d?cancelAnimationFrame:clearTimeout)(l),Xt=0,c=jt},lagSmoothing:function(f,w){t=f||1/0,e=Math.min(w||33,t)},fps:function(f){a=1e3/(f||240),r=h.time*1e3+a},add:function(f,w,_){var v=w?function(b,y,C,S){f(b,y,C,S),h.remove(v)}:f;return h.remove(f),s[_?"unshift":"push"](v),_t(),v},remove:function(f,w){~(w=s.indexOf(f))&&s.splice(w,1)&&p>=w&&p--},_listeners:s},h})(),_t=function(){return!Xt&&ce.wake()},O={},ns=/^[\d.\-M][\d.\-,\s]/,as=/["']/g,rs=function(t){for(var e={},i=t.substr(1,t.length-3).split(":"),n=i[0],a=1,r=i.length,s,l,c;a<r;a++)l=i[a],s=a!==r-1?l.lastIndexOf(","):l.length,c=l.substr(0,s),e[n]=isNaN(c)?c.replace(as,"").trim():+c,n=l.substr(s+1).trim();return e},os=function(t){var e=t.indexOf("(")+1,i=t.indexOf(")"),n=t.indexOf("(",e);return t.substring(e,~n&&n<i?t.indexOf(")",i+1):i)},ss=function(t){var e=(t+"").split("("),i=O[e[0]];return i&&e.length>1&&i.config?i.config.apply(null,~t.indexOf("{")?[rs(e[1])]:os(t).split(",").map(Ra)):O._CE&&ns.test(t)?O._CE("",t):i},ls=function(t){return function(e){return 1-t(1-e)}},Qe=function(t,e){return t&&(Y(t)?t:O[t]||ss(t))||e},it=function(t,e,i,n){i===void 0&&(i=function(l){return 1-e(1-l)}),n===void 0&&(n=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var a={easeIn:e,easeOut:i,easeInOut:n},r;return re(t,function(s){O[s]=ge[s]=a,O[r=s.toLowerCase()]=i;for(var l in a)O[r+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=O[s+"."+l]=a[l]}),a},tr=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},on=function o(t,e,i){var n=e>=1?e:1,a=(i||(t?.3:.45))/(e<1?e:1),r=a/dn*(Math.asin(1/n)||0),s=function(d){return d===1?1:n*Math.pow(2,-10*d)*Oo((d-r)*a)+1},l=t==="out"?s:t==="in"?function(c){return 1-s(1-c)}:tr(s);return a=dn/a,l.config=function(c,d){return o(t,c,d)},l},sn=function o(t,e){e===void 0&&(e=1.70158);var i=function(r){return r?--r*r*((e+1)*r+e)+1:0},n=t==="out"?i:t==="in"?function(a){return 1-i(1-a)}:tr(i);return n.config=function(a){return o(t,a)},n};re("Linear,Quad,Cubic,Quart,Quint,Strong",function(o,t){var e=t<5?t+1:t;it(o+",Power"+(e-1),t?function(i){return Math.pow(i,e)}:function(i){return i},function(i){return 1-Math.pow(1-i,e)},function(i){return i<.5?Math.pow(i*2,e)/2:1-Math.pow((1-i)*2,e)/2})});O.Linear.easeNone=O.none=O.Linear.easeIn;it("Elastic",on("in"),on("out"),on());(function(o,t){var e=1/t,i=2*e,n=2.5*e,a=function(s){return s<e?o*s*s:s<i?o*Math.pow(s-1.5/t,2)+.75:s<n?o*(s-=2.25/t)*s+.9375:o*Math.pow(s-2.625/t,2)+.984375};it("Bounce",function(r){return 1-a(1-r)},a)})(7.5625,2.75);it("Expo",function(o){return Math.pow(2,10*(o-1))*o+o*o*o*o*o*o*(1-o)});it("Circ",function(o){return-(La(1-o*o)-1)});it("Sine",function(o){return o===1?1:-Lo(o*Mo)+1});it("Back",sn("in"),sn("out"),sn());O.SteppedEase=O.steps=ge.SteppedEase={config:function(t,e){t===void 0&&(t=1);var i=1/t,n=t+(e?0:1),a=e?1:0,r=1-N;return function(s){return((n*Qt(0,r,s)|0)+a)*i}}};Ut.ease=O["quad.out"];re("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(o){return kn+=o+","+o+"Params,"});var Ln=function(t,e){this.id=Po++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:En,this.set=e?e.getSetter:Ai},Zt=(function(){function o(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,yt(this,+e.duration,1,1),this.data=e.data,I&&(this._ctx=I,I.data.push(this)),Xt||ce.wake()}var t=o.prototype;return t.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},t.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},t.totalDuration=function(i){return arguments.length?(this._dirty=0,yt(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(i,n){if(_t(),!arguments.length)return this._tTime;var a=this._dp;if(a&&a.smoothChildTiming&&this._ts){for(ki(this,i),!a._dp||a.parent||Ia(a,this);a&&a.parent;)a.parent._time!==a._start+(a._ts>=0?a._tTime/a._ts:(a.totalDuration()-a._tTime)/-a._ts)&&a.totalTime(a._tTime,!0),a=a.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&Ae(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!n||this._initted&&Math.abs(this._zTime)===N||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),za(this,i,n)),this},t.time=function(i,n){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+Ca(this))%(this._dur+this._rDelay)||(i?this._dur:0),n):this._time},t.totalProgress=function(i,n){return arguments.length?this.totalTime(this.totalDuration()*i,n):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(i,n){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+Ca(this),n):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(i,n){var a=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*a,n):this._repeat?wt(this._tTime,a)+1:1},t.timeScale=function(i,n){if(!arguments.length)return this._rts===-N?0:this._rts;if(this._rts===i)return this;var a=this.parent&&this._ts?bi(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-N?0:this._rts,this.totalTime(Qt(-Math.abs(this._delay),this.totalDuration(),a),n!==!1),Ci(this),Go(this)},t.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(_t(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==N&&(this._tTime-=N)))),this):this._ps},t.startTime=function(i){if(arguments.length){this._start=G(i);var n=this.parent||this._dp;return n&&(n._sort||!this.parent)&&Ae(n,this,this._start-this._delay),this}return this._start},t.endTime=function(i){return this._start+(de(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(i){var n=this.parent||this._dp;return n?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?bi(n.rawTime(i),this):this._tTime:this._tTime},t.revert=function(i){i===void 0&&(i=Ro);var n=ee;return ee=i,Mn(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),ee=n,this},t.globalTime=function(i){for(var n=this,a=arguments.length?i:n.rawTime();n;)a=n._start+a/(Math.abs(n._ts)||1),n=n._dp;return!this.parent&&this._sat?this._sat.globalTime(i):a},t.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,ka(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(i){if(arguments.length){var n=this._time;return this._rDelay=i,ka(this),n?this.time(n):this}return this._rDelay},t.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},t.seek=function(i,n){return this.totalTime(ve(this,i),de(n))},t.restart=function(i,n){return this.play().totalTime(i?-this._delay:0,de(n)),this._dur||(this._zTime=-N),this},t.play=function(i,n){return i!=null&&this.seek(i,n),this.reversed(!1).paused(!1)},t.reverse=function(i,n){return i!=null&&this.seek(i||this.totalDuration(),n),this.reversed(!0).paused(!1)},t.pause=function(i,n){return i!=null&&this.seek(i,n),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-N:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-N,this},t.isActive=function(){var i=this.parent||this._dp,n=this._start,a;return!!(!i||this._ts&&this._initted&&i.isActive()&&(a=i.rawTime(!0))>=n&&a<this.endTime(!0)-N)},t.eventCallback=function(i,n,a){var r=this.vars;return arguments.length>1?(n?(r[i]=n,a&&(r[i+"Params"]=a),i==="onUpdate"&&(this._onUpdate=n)):delete r[i],this):r[i]},t.then=function(i){var n=this,a=n._prom;return new Promise(function(r){var s=Y(i)?i:Na,l=function(){var d=n.then;n.then=null,a&&a(),Y(s)&&(s=s(n))&&(s.then||s===n)&&(n.then=d),r(s),n.then=d};n._initted&&n.totalProgress()===1&&n._ts>=0||!n._tTime&&n._ts<0?l():n._prom=l})},t.kill=function(){Gt(this)},o})();we(Zt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-N,_prom:0,_ps:!1,_rts:1});var ie=(function(o){Pa(t,o);function t(i,n){var a;return i===void 0&&(i={}),a=o.call(this,i)||this,a.labels={},a.smoothChildTiming=!!i.smoothChildTiming,a.autoRemoveChildren=!!i.autoRemoveChildren,a._sort=de(i.sortChildren),B&&Ae(i.parent||B,Pe(a),n),i.reversed&&a.reverse(),i.paused&&a.paused(!0),i.scrollTrigger&&Ga(Pe(a),i.scrollTrigger),a}var e=t.prototype;return e.to=function(n,a,r){return Vt(0,arguments,this),this},e.from=function(n,a,r){return Vt(1,arguments,this),this},e.fromTo=function(n,a,r,s){return Vt(2,arguments,this),this},e.set=function(n,a,r){return a.duration=0,a.parent=this,qt(a).repeatDelay||(a.repeat=0),a.immediateRender=!!a.immediateRender,new K(n,a,ve(this,r),1),this},e.call=function(n,a,r){return Ae(this,K.delayedCall(0,n,a),r)},e.staggerTo=function(n,a,r,s,l,c,d){return r.duration=a,r.stagger=r.stagger||s,r.onComplete=c,r.onCompleteParams=d,r.parent=this,new K(n,r,ve(this,l)),this},e.staggerFrom=function(n,a,r,s,l,c,d){return r.runBackwards=1,qt(r).immediateRender=de(r.immediateRender),this.staggerTo(n,a,r,s,l,c,d)},e.staggerFromTo=function(n,a,r,s,l,c,d,h){return s.startAt=r,qt(s).immediateRender=de(s.immediateRender),this.staggerTo(n,a,s,l,c,d,h)},e.render=function(n,a,r){var s=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,d=n<=0?0:G(n),h=this._zTime<0!=n<0&&(this._initted||!c),m,p,g,u,f,w,_,v,b,y,C,S;if(this!==B&&d>l&&n>=0&&(d=l),d!==this._tTime||r||h){if(s!==this._time&&c&&(d+=this._time-s,n+=this._time-s),m=d,b=this._start,v=this._ts,w=!v,h&&(c||(s=this._zTime),(n||!a)&&(this._zTime=n)),this._repeat){if(C=this._yoyo,f=c+this._rDelay,this._repeat<-1&&n<0)return this.totalTime(f*100+n,a,r);if(m=G(d%f),d===l?(u=this._repeat,m=c):(y=G(d/f),u=~~y,u&&u===y&&(m=c,u--),m>c&&(m=c)),y=wt(this._tTime,f),!s&&this._tTime&&y!==u&&this._tTime-y*f-this._dur<=0&&(y=u),C&&u&1&&(m=c-m,S=1),u!==y&&!this._lock){var k=C&&y&1,T=k===(C&&u&1);if(u<y&&(k=!k),s=k?0:d%c?c:d,this._lock=1,this.render(s||(S?0:G(u*f)),a,!c)._lock=0,this._tTime=d,!a&&this.parent&&fe(this,"onRepeat"),this.vars.repeatRefresh&&!S&&(this.invalidate()._lock=1,y=u),s&&s!==this._time||w!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,T&&(this._lock=2,s=k?c:-1e-4,this.render(s,!0),this.vars.repeatRefresh&&!S&&this.invalidate()),this._lock=0,!this._ts&&!w)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(_=Yo(this,G(s),G(m)),_&&(d-=m-(m=_._start))),this._tTime=d,this._time=m,this._act=!!v,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=n,s=0),!s&&d&&c&&!a&&!y&&(fe(this,"onStart"),this._tTime!==d))return this;if(m>=s&&n>=0)for(p=this._first;p;){if(g=p._next,(p._act||m>=p._start)&&p._ts&&_!==p){if(p.parent!==this)return this.render(n,a,r);if(p.render(p._ts>0?(m-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(m-p._start)*p._ts,a,r),m!==this._time||!this._ts&&!w){_=0,g&&(d+=this._zTime=-N);break}}p=g}else{p=this._last;for(var x=n<0?n:m;p;){if(g=p._prev,(p._act||x<=p._end)&&p._ts&&_!==p){if(p.parent!==this)return this.render(n,a,r);if(p.render(p._ts>0?(x-p._start)*p._ts:(p._dirty?p.totalDuration():p._tDur)+(x-p._start)*p._ts,a,r||ee&&Mn(p)),m!==this._time||!this._ts&&!w){_=0,g&&(d+=this._zTime=x?-N:N);break}}p=g}}if(_&&!a&&(this.pause(),_.render(m>=s?0:-N)._zTime=m>=s?1:-1,this._ts))return this._start=b,Ci(this),this.render(n,a,r);this._onUpdate&&!a&&fe(this,"onUpdate",!0),(d===l&&this._tTime>=this.totalDuration()||!d&&s)&&(b===this._start||Math.abs(v)!==Math.abs(this._ts))&&(this._lock||((n||!c)&&(d===l&&this._ts>0||!d&&this._ts<0)&&Ie(this,1),!a&&!(n<0&&!s)&&(d||s||!l)&&(fe(this,d===l&&n>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(n,a){var r=this;if(Oe(a)||(a=ve(this,a,n)),!(n instanceof Zt)){if(ne(n))return n.forEach(function(s){return r.add(s,a)}),this;if(Q(n))return this.addLabel(n,a);if(Y(n))n=K.delayedCall(0,n);else return this}return this!==n?Ae(this,n,a):this},e.getChildren=function(n,a,r,s){n===void 0&&(n=!0),a===void 0&&(a=!0),r===void 0&&(r=!0),s===void 0&&(s=-xe);for(var l=[],c=this._first;c;)c._start>=s&&(c instanceof K?a&&l.push(c):(r&&l.push(c),n&&l.push.apply(l,c.getChildren(!0,a,r)))),c=c._next;return l},e.getById=function(n){for(var a=this.getChildren(1,1,1),r=a.length;r--;)if(a[r].vars.id===n)return a[r]},e.remove=function(n){return Q(n)?this.removeLabel(n):Y(n)?this.killTweensOf(n):(n.parent===this&&Ti(this,n),n===this._recent&&(this._recent=this._last),Ze(this))},e.totalTime=function(n,a){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=G(ce.time-(this._ts>0?n/this._ts:(this.totalDuration()-n)/-this._ts))),o.prototype.totalTime.call(this,n,a),this._forcing=0,this):this._tTime},e.addLabel=function(n,a){return this.labels[n]=ve(this,a),this},e.removeLabel=function(n){return delete this.labels[n],this},e.addPause=function(n,a,r){var s=K.delayedCall(0,a||jt,r);return s.data="isPause",this._hasPause=1,Ae(this,s,ve(this,n))},e.removePause=function(n){var a=this._first;for(n=ve(this,n);a;)a._start===n&&a.data==="isPause"&&Ie(a),a=a._next},e.killTweensOf=function(n,a,r){for(var s=this.getTweensOf(n,r),l=s.length;l--;)Re!==s[l]&&s[l].kill(n,a);return this},e.getTweensOf=function(n,a){for(var r=[],s=Se(n),l=this._first,c=Oe(a),d;l;)l instanceof K?No(l._targets,s)&&(c?(!Re||l._initted&&l._ts)&&l.globalTime(0)<=a&&l.globalTime(l.totalDuration())>a:!a||l.isActive())&&r.push(l):(d=l.getTweensOf(s,a)).length&&r.push.apply(r,d),l=l._next;return r},e.tweenTo=function(n,a){a=a||{};var r=this,s=ve(r,n),l=a,c=l.startAt,d=l.onStart,h=l.onStartParams,m=l.immediateRender,p,g=K.to(r,we({ease:a.ease||"none",lazy:!1,immediateRender:!1,time:s,overwrite:"auto",duration:a.duration||Math.abs((s-(c&&"time"in c?c.time:r._time))/r.timeScale())||N,onStart:function(){if(r.pause(),!p){var f=a.duration||Math.abs((s-(c&&"time"in c?c.time:r._time))/r.timeScale());g._dur!==f&&yt(g,f,0,1).render(g._time,!0,!0),p=1}d&&d.apply(g,h||[])}},a));return m?g.render(0):g},e.tweenFromTo=function(n,a,r){return this.tweenTo(a,we({startAt:{time:ve(this,n)}},r))},e.recent=function(){return this._recent},e.nextLabel=function(n){return n===void 0&&(n=this._time),Aa(this,ve(this,n))},e.previousLabel=function(n){return n===void 0&&(n=this._time),Aa(this,ve(this,n),1)},e.currentLabel=function(n){return arguments.length?this.seek(n,!0):this.previousLabel(this._time+N)},e.shiftChildren=function(n,a,r){r===void 0&&(r=0);var s=this._first,l=this.labels,c;for(n=G(n);s;)s._start>=r&&(s._start+=n,s._end+=n),s=s._next;if(a)for(c in l)l[c]>=r&&(l[c]+=n);return Ze(this)},e.invalidate=function(n){var a=this._first;for(this._lock=0;a;)a.invalidate(n),a=a._next;return o.prototype.invalidate.call(this,n)},e.clear=function(n){n===void 0&&(n=!0);for(var a=this._first,r;a;)r=a._next,this.remove(a),a=r;return this._dp&&(this._time=this._tTime=this._pTime=0),n&&(this.labels={}),Ze(this)},e.totalDuration=function(n){var a=0,r=this,s=r._last,l=xe,c,d,h;if(arguments.length)return r.timeScale((r._repeat<0?r.duration():r.totalDuration())/(r.reversed()?-n:n));if(r._dirty){for(h=r.parent;s;)c=s._prev,s._dirty&&s.totalDuration(),d=s._start,d>l&&r._sort&&s._ts&&!r._lock?(r._lock=1,Ae(r,s,d-s._delay,1)._lock=0):l=d,d<0&&s._ts&&(a-=d,(!h&&!r._dp||h&&h.smoothChildTiming)&&(r._start+=G(d/r._ts),r._time-=d,r._tTime-=d),r.shiftChildren(-d,!1,-1/0),l=0),s._end>a&&s._ts&&(a=s._end),s=c;yt(r,r===B&&r._time>a?r._time:a,1,1),r._dirty=0}return r._tDur},t.updateRoot=function(n){if(B._ts&&(za(B,bi(n,B)),Ha=ce.frame),ce.frame>=Sa){Sa+=he.autoSleep||120;var a=B._first;if((!a||!a._ts)&&he.autoSleep&&ce._listeners.length<2){for(;a&&!a._ts;)a=a._next;a||ce.sleep()}}},t})(Zt);we(ie.prototype,{_lock:0,_hasPause:0,_forcing:0});var cs=function(t,e,i,n,a,r,s){var l=new oe(this._pt,t,e,0,1,Hn,null,a),c=0,d=0,h,m,p,g,u,f,w,_;for(l.b=i,l.e=n,i+="",n+="",(w=~n.indexOf("random("))&&(n=bt(n)),r&&(_=[i,n],r(_,t,e),i=_[0],n=_[1]),m=i.match(nn)||[];h=nn.exec(n);)g=h[0],u=n.substring(c,h.index),p?p=(p+1)%5:u.substr(-5)==="rgba("&&(p=1),g!==m[d++]&&(f=parseFloat(m[d-1])||0,l._pt={_next:l._pt,p:u||d===1?u:",",s:f,c:g.charAt(1)==="="?tt(f,g)-f:parseFloat(g)-f,m:p&&p<4?Math.round:0},c=nn.lastIndex);return l.c=c<n.length?n.substring(c,n.length):"",l.fp=s,(Sn.test(n)||w)&&(l.e=0),this._pt=l,l},On=function(t,e,i,n,a,r,s,l,c,d){Y(n)&&(n=n(a||0,t,r));var h=t[e],m=i!=="get"?i:Y(h)?c?t[e.indexOf("set")||!Y(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():h,p=Y(h)?c?ps:ar:Wn,g;if(Q(n)&&(~n.indexOf("random(")&&(n=bt(n)),n.charAt(1)==="="&&(g=tt(m,n)+(te(m)||0),(g||g===0)&&(n=g))),!d||m!==n||yn)return!isNaN(m*n)&&n!==""?(g=new oe(this._pt,t,e,+m||0,n-(m||0),typeof h=="boolean"?gs:rr,0,p),c&&(g.fp=c),s&&g.modifier(s,this,t),this._pt=g):(!h&&!(e in t)&&Si(e,n),cs.call(this,t,e,m,n,p,l||he.stringFilter,c))},ds=function(t,e,i,n,a){if(Y(t)&&(t=Yt(t,a,e,i,n)),!Ee(t)||t.style&&t.nodeType||ne(t)||Oa(t))return Q(t)?Yt(t,a,e,i,n):t;var r={},s;for(s in t)r[s]=Yt(t[s],a,e,i,n);return r},Fn=function(t,e,i,n,a,r){var s,l,c,d;if(le[t]&&(s=new le[t]).init(a,s.rawVars?e[t]:ds(e[t],n,a,r,i),i,n,r)!==!1&&(i._pt=l=new oe(i._pt,a,t,0,1,s.render,s,0,s.priority),i!==ft))for(c=i._ptLookup[i._targets.indexOf(a)],d=s._props.length;d--;)c[s._props[d]]=l;return s},Re,yn,Dn=function o(t,e,i){var n=t.vars,a=n.ease,r=n.startAt,s=n.immediateRender,l=n.lazy,c=n.onUpdate,d=n.runBackwards,h=n.yoyoEase,m=n.keyframes,p=n.autoRevert,g=t._dur,u=t._startAt,f=t._targets,w=t.parent,_=w&&w.data==="nested"?w.vars.targets:f,v=t._overwrite==="auto"&&!bn,b=t.timeline,y=n.easeReverse||h,C,S,k,T,x,E,M,L,D,H,W,z,V;if(b&&(!m||!a)&&(a="none"),t._ease=Qe(a,Ut.ease),t._rEase=y&&(Qe(y)||t._ease),t._from=!b&&!!n.runBackwards,t._from&&(t.ratio=1),!b||m&&!n.stagger){if(L=f[0]?$e(f[0]).harness:0,z=L&&n[L.prop],C=_i(n,Cn),u&&(u._zTime<0&&u.progress(1),e<0&&d&&s&&!p?u.render(-1,!0):u.revert(d&&g?pi:zo),u._lazy=0),r){if(Ie(t._startAt=K.set(f,we({data:"isStart",overwrite:!1,parent:w,immediateRender:!0,lazy:!u&&de(l),startAt:null,delay:0,onUpdate:c&&function(){return fe(t,"onUpdate")},stagger:0},r))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(ee||!s&&!p)&&t._startAt.revert(pi),s&&g&&e<=0&&i<=0){e&&(t._zTime=e);return}}else if(d&&g&&!u){if(e&&(s=!1),k=we({overwrite:!1,data:"isFromStart",lazy:s&&!u&&de(l),immediateRender:s,stagger:0,parent:w},C),z&&(k[L.prop]=z),Ie(t._startAt=K.set(f,k)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(ee?t._startAt.revert(pi):t._startAt.render(-1,!0)),t._zTime=e,!s)o(t._startAt,N,N);else if(!e)return}for(t._pt=t._ptCache=0,l=g&&de(l)||l&&!g,S=0;S<f.length;S++){if(x=f[S],M=x._gsap||An(f)[S]._gsap,t._ptLookup[S]=H={},un[M.id]&&Ne.length&&yi(),W=_===f?S:_.indexOf(x),L&&(D=new L).init(x,z||C,t,W,_)!==!1&&(t._pt=T=new oe(t._pt,x,D.name,0,1,D.render,D,0,D.priority),D._props.forEach(function(_e){H[_e]=T}),D.priority&&(E=1)),!L||z)for(k in C)le[k]&&(D=Fn(k,C,t,W,x,_))?D.priority&&(E=1):H[k]=T=On.call(t,x,k,"get",C[k],W,_,0,n.stringFilter);t._op&&t._op[S]&&t.kill(x,t._op[S]),v&&t._pt&&(Re=t,B.killTweensOf(x,H,t.globalTime(e)),V=!t.parent,Re=0),t._pt&&l&&(un[M.id]=1)}E&&Rn(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!V,m&&e<=0&&b.render(xe,!0,!0)},hs=function(t,e,i,n,a,r,s,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],d,h,m,p;if(!c)for(c=t._ptCache[e]=[],m=t._ptLookup,p=t._targets.length;p--;){if(d=m[p][e],d&&d.d&&d.d._pt)for(d=d.d._pt;d&&d.p!==e&&d.fp!==e;)d=d._next;if(!d)return yn=1,t.vars[e]="+=0",Dn(t,s),yn=0,l?Kt(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(d)}for(p=c.length;p--;)h=c[p],d=h._pt||h,d.s=(n||n===0)&&!a?n:d.s+(n||0)+r*d.c,d.c=i-d.s,h.e&&(h.e=U(i)+te(h.e)),h.b&&(h.b=d.s+te(h.b))},us=function(t,e){var i=t[0]?$e(t[0]).harness:0,n=i&&i.aliases,a,r,s,l;if(!n)return e;a=gt({},e);for(r in n)if(r in a)for(l=n[r].split(","),s=l.length;s--;)a[l[s]]=a[r];return a},ms=function(t,e,i,n){var a=e.ease||n||"power1.inOut",r,s;if(ne(e))s=i[t]||(i[t]=[]),e.forEach(function(l,c){return s.push({t:c/(e.length-1)*100,v:l,e:a})});else for(r in e)s=i[r]||(i[r]=[]),r==="ease"||s.push({t:parseFloat(t),v:e[r],e:a})},Yt=function(t,e,i,n,a){return Y(t)?t.call(e,i,n,a):Q(t)&&~t.indexOf("random(")?bt(t):t},ir=kn+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",nr={};re(ir+",id,stagger,delay,duration,paused,scrollTrigger",function(o){return nr[o]=1});var K=(function(o){Pa(t,o);function t(i,n,a,r){var s;typeof n=="number"&&(a.duration=n,n=a,a=null),s=o.call(this,r?n:qt(n))||this;var l=s.vars,c=l.duration,d=l.delay,h=l.immediateRender,m=l.stagger,p=l.overwrite,g=l.keyframes,u=l.defaults,f=l.scrollTrigger,w=n.parent||B,_=(ne(i)||Oa(i)?Oe(i[0]):"length"in n)?[i]:Se(i),v,b,y,C,S,k,T,x;if(s._targets=_.length?An(_):Kt("GSAP target "+i+" not found. https://gsap.com",!he.nullTargetWarn)||[],s._ptLookup=[],s._overwrite=p,g||m||mi(c)||mi(d)){n=s.vars;var E=n.easeReverse||n.yoyoEase;if(v=s.timeline=new ie({data:"nested",defaults:u||{},targets:w&&w.data==="nested"?w.vars.targets:_}),v.kill(),v.parent=v._dp=Pe(s),v._start=0,m||mi(c)||mi(d)){if(C=_.length,T=m&&Ya(m),Ee(m))for(S in m)~ir.indexOf(S)&&(x||(x={}),x[S]=m[S]);for(b=0;b<C;b++)y=_i(n,nr),y.stagger=0,E&&(y.easeReverse=E),x&&gt(y,x),k=_[b],y.duration=+Yt(c,Pe(s),b,k,_),y.delay=(+Yt(d,Pe(s),b,k,_)||0)-s._delay,!m&&C===1&&y.delay&&(s._delay=d=y.delay,s._start+=d,y.delay=0),v.to(k,y,T?T(b,k,_):0),v._ease=O.none;v.duration()?c=d=0:s.timeline=0}else if(g){qt(we(v.vars.defaults,{ease:"none"})),v._ease=Qe(g.ease||n.ease||"none");var M=0,L,D,H;if(ne(g))g.forEach(function(W){return v.to(_,W,">")}),v.duration();else{y={};for(S in g)S==="ease"||S==="easeEach"||ms(S,g[S],y,g.easeEach);for(S in y)for(L=y[S].sort(function(W,z){return W.t-z.t}),M=0,b=0;b<L.length;b++)D=L[b],H={ease:D.e,duration:(D.t-(b?L[b-1].t:0))/100*c},H[S]=D.v,v.to(_,H,M),M+=H.duration;v.duration()<c&&v.to({},{duration:c-v.duration()})}}c||s.duration(c=v.duration())}else s.timeline=0;return p===!0&&!bn&&(Re=Pe(s),B.killTweensOf(_),Re=0),Ae(w,Pe(s),a),n.reversed&&s.reverse(),n.paused&&s.paused(!0),(h||!c&&!g&&s._start===G(w._time)&&de(h)&&Bo(Pe(s))&&w.data!=="nested")&&(s._tTime=-N,s.render(Math.max(0,-d)||0)),f&&Ga(Pe(s),f),s}var e=t.prototype;return e.render=function(n,a,r){var s=this._time,l=this._tDur,c=this._dur,d=n<0,h=n>l-N&&!d?l:n<N?0:n,m,p,g,u,f,w,_,v;if(!c)Vo(this,n,a,r);else if(h!==this._tTime||!n||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==d||this._lazy){if(m=h,v=this.timeline,this._repeat){if(u=c+this._rDelay,this._repeat<-1&&d)return this.totalTime(u*100+n,a,r);if(m=G(h%u),h===l?(g=this._repeat,m=c):(f=G(h/u),g=~~f,g&&g===f?(m=c,g--):m>c&&(m=c)),w=this._yoyo&&g&1,w&&(m=c-m),f=wt(this._tTime,u),m===s&&!r&&this._initted&&g===f)return this._tTime=h,this;g!==f&&this.vars.repeatRefresh&&!w&&!this._lock&&m!==u&&this._initted&&(this._lock=r=1,this.render(G(u*g),!0).invalidate()._lock=0)}if(!this._initted){if(Ba(this,d?n:m,r,a,h))return this._tTime=0,this;if(s!==this._time&&!(r&&this.vars.repeatRefresh&&g!==f))return this;if(c!==this._dur)return this.render(n,a,r)}if(this._rEase){var b=m<s;if(b!==this._inv){var y=b?s:c-s;this._inv=b,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=s,this._invRecip=y?(b?-1:1)/y:0,this._invScale=b?-this.ratio:1-this.ratio,this._invEase=b?this._rEase:this._ease}this.ratio=_=this._invRatio+this._invScale*this._invEase((m-this._invTime)*this._invRecip)}else this.ratio=_=this._ease(m/c);if(this._from&&(this.ratio=_=1-_),this._tTime=h,this._time=m,!this._act&&this._ts&&(this._act=1,this._lazy=0),!s&&h&&!a&&!f&&(fe(this,"onStart"),this._tTime!==h))return this;for(p=this._pt;p;)p.r(_,p.d),p=p._next;v&&v.render(n<0?n:v._dur*v._ease(m/this._dur),a,r)||this._startAt&&(this._zTime=n),this._onUpdate&&!a&&(d&&mn(this,n,a,r),fe(this,"onUpdate")),this._repeat&&g!==f&&this.vars.onRepeat&&!a&&this.parent&&fe(this,"onRepeat"),(h===this._tDur||!h)&&this._tTime===h&&(d&&!this._onUpdate&&mn(this,n,!0,!0),(n||!c)&&(h===this._tDur&&this._ts>0||!h&&this._ts<0)&&Ie(this,1),!a&&!(d&&!s)&&(h||s||w)&&(fe(this,h===l?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(n){return(!n||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(n),o.prototype.invalidate.call(this,n)},e.resetTo=function(n,a,r,s,l){Xt||ce.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),d;return this._initted||Dn(this,c),d=this._ease(c/this._dur),hs(this,n,a,r,s,d,c,l)?this.resetTo(n,a,r,s,1):(ki(this,0),this.parent||$a(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(n,a){if(a===void 0&&(a="all"),!n&&(!a||a==="all"))return this._lazy=this._pt=0,this.parent?Gt(this):this.scrollTrigger&&this.scrollTrigger.kill(!!ee),this;if(this.timeline){var r=this.timeline.totalDuration();return this.timeline.killTweensOf(n,a,Re&&Re.vars.overwrite!==!0)._first||Gt(this),this.parent&&r!==this.timeline.totalDuration()&&yt(this,this._dur*this.timeline._tDur/r,0,1),this}var s=this._targets,l=n?Se(n):s,c=this._ptLookup,d=this._pt,h,m,p,g,u,f,w;if((!a||a==="all")&&Io(s,l))return a==="all"&&(this._pt=0),Gt(this);for(h=this._op=this._op||[],a!=="all"&&(Q(a)&&(u={},re(a,function(_){return u[_]=1}),a=u),a=us(s,a)),w=s.length;w--;)if(~l.indexOf(s[w])){m=c[w],a==="all"?(h[w]=a,g=m,p={}):(p=h[w]=h[w]||{},g=a);for(u in g)f=m&&m[u],f&&((!("kill"in f.d)||f.d.kill(u)===!0)&&Ti(this,f,"_pt"),delete m[u]),p!=="all"&&(p[u]=1)}return this._initted&&!this._pt&&d&&Gt(this),this},t.to=function(n,a){return new t(n,a,arguments[2])},t.from=function(n,a){return Vt(1,arguments)},t.delayedCall=function(n,a,r,s){return new t(a,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:n,onComplete:a,onReverseComplete:a,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:s})},t.fromTo=function(n,a,r){return Vt(2,arguments)},t.set=function(n,a){return a.duration=0,a.repeatDelay||(a.repeat=0),new t(n,a)},t.killTweensOf=function(n,a,r){return B.killTweensOf(n,a,r)},t})(Zt);we(K.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});re("staggerTo,staggerFrom,staggerFromTo",function(o){K[o]=function(){var t=new ie,e=fn.call(arguments,0);return e.splice(o==="staggerFromTo"?5:4,0,0),t[o].apply(t,e)}});var Wn=function(t,e,i){return t[e]=i},ar=function(t,e,i){return t[e](i)},ps=function(t,e,i,n){return t[e](n.fp,i)},fs=function(t,e,i){return t.setAttribute(e,i)},Ai=function(t,e){return Y(t[e])?ar:xi(t[e])&&t.setAttribute?fs:Wn},rr=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},gs=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Hn=function(t,e){var i=e._pt,n="";if(!t&&e.b)n=e.b;else if(t===1&&e.e)n=e.e;else{for(;i;)n=i.p+(i.m?i.m(i.s+i.c*t):Math.round((i.s+i.c*t)*1e4)/1e4)+n,i=i._next;n+=e.c}e.set(e.t,e.p,n,e)},zn=function(t,e){for(var i=e._pt;i;)i.r(t,i.d),i=i._next},ws=function(t,e,i,n){for(var a=this._pt,r;a;)r=a._next,a.p===n&&a.modifier(t,e,i),a=r},ys=function(t){for(var e=this._pt,i,n;e;)n=e._next,e.p===t&&!e.op||e.op===t?Ti(this,e,"_pt"):e.dep||(i=1),e=n;return!i},_s=function(t,e,i,n){n.mSet(t,e,n.m.call(n.tween,i,n.mt),n)},Rn=function(t){for(var e=t._pt,i,n,a,r;e;){for(i=e._next,n=a;n&&n.pr>e.pr;)n=n._next;(e._prev=n?n._prev:r)?e._prev._next=e:a=e,(e._next=n)?n._prev=e:r=e,e=i}t._pt=a},oe=(function(){function o(e,i,n,a,r,s,l,c,d){this.t=i,this.s=a,this.c=r,this.p=n,this.r=s||rr,this.d=l||this,this.set=c||Wn,this.pr=d||0,this._next=e,e&&(e._prev=this)}var t=o.prototype;return t.modifier=function(i,n,a){this.mSet=this.mSet||this.set,this.set=_s,this.m=i,this.mt=a,this.tween=n},o})();re(kn+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(o){return Cn[o]=1});ge.TweenMax=ge.TweenLite=K;ge.TimelineLite=ge.TimelineMax=ie;B=new ie({sortChildren:!1,defaults:Ut,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});he.stringFilter=Pn;var Je=[],gi={},bs=[],Ma=0,vs=0,ln=function(t){return(gi[t]||bs).map(function(e){return e()})},_n=function(){var t=Date.now(),e=[];t-Ma>2&&(ln("matchMediaInit"),Je.forEach(function(i){var n=i.queries,a=i.conditions,r,s,l,c;for(s in n)r=ke.matchMedia(n[s]).matches,r&&(l=1),r!==a[s]&&(a[s]=r,c=1);c&&(i.revert(),l&&e.push(i))}),ln("matchMediaRevert"),e.forEach(function(i){return i.onMatch(i,function(n){return i.add(null,n)})}),Ma=t,ln("matchMedia"))},or=(function(){function o(e,i){this.selector=i&&gn(i),this.data=[],this._r=[],this.isReverted=!1,this.id=vs++,e&&this.add(e)}var t=o.prototype;return t.add=function(i,n,a){Y(i)&&(a=n,n=i,i=Y);var r=this,s=function(){var c=I,d=r.selector,h;return c&&c!==r&&c.data.push(r),a&&(r.selector=gn(a)),I=r,h=n.apply(r,arguments),Y(h)&&r._r.push(h),I=c,r.selector=d,r.isReverted=!1,h};return r.last=s,i===Y?s(r,function(l){return r.add(null,l)}):i?r[i]=s:s},t.ignore=function(i){var n=I;I=null,i(this),I=n},t.getTweens=function(){var i=[];return this.data.forEach(function(n){return n instanceof o?i.push.apply(i,n.getTweens()):n instanceof K&&!(n.parent&&n.parent.data==="nested")&&i.push(n)}),i},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(i,n){var a=this;if(i?(function(){for(var s=a.getTweens(),l=a.data.length,c;l--;)c=a.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(d){return s.splice(s.indexOf(d),1)}));for(s.map(function(d){return{g:d._dur||d._delay||d._sat&&!d._sat.vars.immediateRender?d.globalTime(0):-1/0,t:d}}).sort(function(d,h){return h.g-d.g||-1/0}).forEach(function(d){return d.t.revert(i)}),l=a.data.length;l--;)c=a.data[l],c instanceof ie?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof K)&&c.revert&&c.revert(i);a._r.forEach(function(d){return d(i,a)}),a.isReverted=!0})():this.data.forEach(function(s){return s.kill&&s.kill()}),this.clear(),n)for(var r=Je.length;r--;)Je[r].id===this.id&&Je.splice(r,1)},t.revert=function(i){this.kill(i||{})},o})(),xs=(function(){function o(e){this.contexts=[],this.scope=e,I&&I.data.push(this)}var t=o.prototype;return t.add=function(i,n,a){Ee(i)||(i={matches:i});var r=new or(0,a||this.scope),s=r.conditions={},l,c,d;I&&!r.selector&&(r.selector=I.selector),this.contexts.push(r),n=r.add("onMatch",n),r.queries=i;for(c in i)c==="all"?d=1:(l=ke.matchMedia(i[c]),l&&(Je.indexOf(r)<0&&Je.push(r),(s[c]=l.matches)&&(d=1),l.addListener?l.addListener(_n):l.addEventListener("change",_n)));return d&&n(r,function(h){return r.add(null,h)}),this},t.revert=function(i){this.kill(i||{})},t.kill=function(i){this.contexts.forEach(function(n){return n.kill(i,!0)})},o})(),vi={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];e.forEach(function(n){return Qa(n)})},timeline:function(t){return new ie(t)},getTweensOf:function(t,e){return B.getTweensOf(t,e)},getProperty:function(t,e,i,n){Q(t)&&(t=Se(t)[0]);var a=$e(t||{}).get,r=i?Na:Ra;return i==="native"&&(i=""),t&&(e?r((le[e]&&le[e].get||a)(t,e,i,n)):function(s,l,c){return r((le[s]&&le[s].get||a)(t,s,l,c))})},quickSetter:function(t,e,i){if(t=Se(t),t.length>1){var n=t.map(function(d){return ae.quickSetter(d,e,i)}),a=n.length;return function(d){for(var h=a;h--;)n[h](d)}}t=t[0]||{};var r=le[e],s=$e(t),l=s.harness&&(s.harness.aliases||{})[e]||e,c=r?function(d){var h=new r;ft._pt=0,h.init(t,i?d+i:d,ft,0,[t]),h.render(1,h),ft._pt&&zn(1,ft)}:s.set(t,l);return r?c:function(d){return c(t,l,i?d+i:d,s,1)}},quickTo:function(t,e,i){var n,a=ae.to(t,we((n={},n[e]="+=0.1",n.paused=!0,n.stagger=0,n),i||{})),r=function(l,c,d){return a.resetTo(e,l,c,d)};return r.tween=a,r},isTweening:function(t){return B.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=Qe(t.ease,Ut.ease)),Ta(Ut,t||{})},config:function(t){return Ta(he,t||{})},registerEffect:function(t){var e=t.name,i=t.effect,n=t.plugins,a=t.defaults,r=t.extendTimeline;(n||"").split(",").forEach(function(s){return s&&!le[s]&&!ge[s]&&Kt(e+" effect requires "+s+" plugin.")}),an[e]=function(s,l,c){return i(Se(s),we(l||{},a),c)},r&&(ie.prototype[e]=function(s,l,c){return this.add(an[e](s,Ee(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){O[t]=Qe(e)},parseEase:function(t,e){return arguments.length?Qe(t,e):O},getById:function(t){return B.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var i=new ie(t),n,a;for(i.smoothChildTiming=de(t.smoothChildTiming),B.remove(i),i._dp=0,i._time=i._tTime=B._time,n=B._first;n;)a=n._next,(e||!(!n._dur&&n instanceof K&&n.vars.onComplete===n._targets[0]))&&Ae(i,n,n._start-n._delay),n=a;return Ae(B,i,0),i},context:function(t,e){return t?new or(t,e):I},matchMedia:function(t){return new xs(t)},matchMediaRefresh:function(){return Je.forEach(function(t){var e=t.conditions,i,n;for(n in e)e[n]&&(e[n]=!1,i=1);i&&t.revert()})||_n()},addEventListener:function(t,e){var i=gi[t]||(gi[t]=[]);~i.indexOf(e)||i.push(e)},removeEventListener:function(t,e){var i=gi[t],n=i&&i.indexOf(e);n>=0&&i.splice(n,1)},utils:{wrap:Jo,wrapYoyo:es,distribute:Ya,random:Ka,snap:Ua,normalize:Qo,getUnit:te,clamp:Ko,splitColor:Ja,toArray:Se,selector:gn,mapRange:Xa,pipe:Xo,unitize:Zo,interpolate:ts,shuffle:Va},install:Da,effects:an,ticker:ce,updateRoot:ie.updateRoot,plugins:le,globalTimeline:B,core:{PropTween:oe,globals:Wa,Tween:K,Timeline:ie,Animation:Zt,getCache:$e,_removeLinkedListItem:Ti,reverting:function(){return ee},context:function(t){return t&&I&&(I.data.push(t),t._ctx=I),I},suppressOverwrites:function(t){return bn=t}}};re("to,from,fromTo,delayedCall,set,killTweensOf",function(o){return vi[o]=K[o]});ce.add(ie.updateRoot);ft=vi.to({},{duration:0});var Ss=function(t,e){for(var i=t._pt;i&&i.p!==e&&i.op!==e&&i.fp!==e;)i=i._next;return i},Ts=function(t,e){var i=t._targets,n,a,r;for(n in e)for(a=i.length;a--;)r=t._ptLookup[a][n],r&&(r=r.d)&&(r._pt&&(r=Ss(r,n)),r&&r.modifier&&r.modifier(e[n],t,i[a],n))},cn=function(t,e){return{name:t,headless:1,rawVars:1,init:function(n,a,r){r._onInit=function(s){var l,c;if(Q(a)&&(l={},re(a,function(d){return l[d]=1}),a=l),e){l={};for(c in a)l[c]=e(a[c]);a=l}Ts(s,a)}}}},ae=vi.registerPlugin({name:"attr",init:function(t,e,i,n,a){var r,s,l;this.tween=i;for(r in e)l=t.getAttribute(r)||"",s=this.add(t,"setAttribute",(l||0)+"",e[r],n,a,0,0,r),s.op=r,s.b=l,this._props.push(r)},render:function(t,e){for(var i=e._pt;i;)ee?i.set(i.t,i.p,i.b,i):i.r(t,i.d),i=i._next}},{name:"endArray",headless:1,init:function(t,e){for(var i=e.length;i--;)this.add(t,i,t[i]||0,e[i],0,0,0,0,0,1)}},cn("roundProps",wn),cn("modifiers"),cn("snap",Ua))||vi;K.version=ie.version=ae.version="3.15.0";Fa=1;vn()&&_t();var Cs=O.Power0,ks=O.Power1,As=O.Power2,Es=O.Power3,Ms=O.Power4,Ps=O.Linear,Ls=O.Quad,Os=O.Cubic,Fs=O.Quart,Ds=O.Quint,Ws=O.Strong,Hs=O.Elastic,zs=O.Back,Rs=O.SteppedEase,Ns=O.Bounce,$s=O.Sine,Is=O.Expo,Gs=O.Circ;var sr,Be,xt,qn,ot,Bs,lr,Vn,qs=function(){return typeof window<"u"},De={},rt=180/Math.PI,St=Math.PI/180,vt=Math.atan2,cr=1e8,Yn=/([A-Z])/g,Vs=/(left|right|width|margin|padding|x)/i,Ys=/[\s,\(]\S/,Me={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},$n=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Us=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Ks=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},js=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Xs=function(t,e){var i=e.s+e.c*t;e.set(e.t,e.p,~~(i+(i<0?-.5:.5))+e.u,e)},wr=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},yr=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Zs=function(t,e,i){return t.style[e]=i},Qs=function(t,e,i){return t.style.setProperty(e,i)},Js=function(t,e,i){return t._gsap[e]=i},el=function(t,e,i){return t._gsap.scaleX=t._gsap.scaleY=i},tl=function(t,e,i,n,a){var r=t._gsap;r.scaleX=r.scaleY=i,r.renderTransform(a,r)},il=function(t,e,i,n,a){var r=t._gsap;r[e]=i,r.renderTransform(a,r)},q="transform",ue=q+"Origin",nl=function o(t,e){var i=this,n=this.target,a=n.style,r=n._gsap;if(t in De&&a){if(this.tfm=this.tfm||{},t!=="transform")t=Me[t]||t,~t.indexOf(",")?t.split(",").forEach(function(s){return i.tfm[s]=Fe(n,s)}):this.tfm[t]=r.x?r[t]:Fe(n,t),t===ue&&(this.tfm.zOrigin=r.zOrigin);else return Me.transform.split(",").forEach(function(s){return o.call(i,s,e)});if(this.props.indexOf(q)>=0)return;r.svg&&(this.svgo=n.getAttribute("data-svg-origin"),this.props.push(ue,e,"")),t=q}(a||e)&&this.props.push(t,e,a[t])},_r=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},al=function(){var t=this.props,e=this.target,i=e.style,n=e._gsap,a,r;for(a=0;a<t.length;a+=3)t[a+1]?t[a+1]===2?e[t[a]](t[a+2]):e[t[a]]=t[a+2]:t[a+2]?i[t[a]]=t[a+2]:i.removeProperty(t[a].substr(0,2)==="--"?t[a]:t[a].replace(Yn,"-$1").toLowerCase());if(this.tfm){for(r in this.tfm)n[r]=this.tfm[r];n.svg&&(n.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),a=Vn(),(!a||!a.isStart)&&!i[q]&&(_r(i),n.zOrigin&&i[ue]&&(i[ue]+=" "+n.zOrigin+"px",n.zOrigin=0,n.renderTransform()),n.uncache=1)}},br=function(t,e){var i={target:t,props:[],revert:al,save:nl};return t._gsap||ae.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(n){return i.save(n)}),i},vr,In=function(t,e){var i=Be.createElementNS?Be.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Be.createElement(t);return i&&i.style?i:Be.createElement(t)},ye=function o(t,e,i){var n=getComputedStyle(t);return n[e]||n.getPropertyValue(e.replace(Yn,"-$1").toLowerCase())||n.getPropertyValue(e)||!i&&o(t,Tt(e)||e,1)||""},dr="O,Moz,ms,Ms,Webkit".split(","),Tt=function(t,e,i){var n=e||ot,a=n.style,r=5;if(t in a&&!i)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);r--&&!(dr[r]+t in a););return r<0?null:(r===3?"ms":r>=0?dr[r]:"")+t},Gn=function(){qs()&&window.document&&(sr=window,Be=sr.document,xt=Be.documentElement,ot=In("div")||{style:{}},Bs=In("div"),q=Tt(q),ue=q+"Origin",ot.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",vr=!!Tt("perspective"),Vn=ae.core.reverting,qn=1)},hr=function(t){var e=t.ownerSVGElement,i=In("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=t.cloneNode(!0),a;n.style.display="block",i.appendChild(n),xt.appendChild(i);try{a=n.getBBox()}catch{}return i.removeChild(n),xt.removeChild(i),a},ur=function(t,e){for(var i=e.length;i--;)if(t.hasAttribute(e[i]))return t.getAttribute(e[i])},xr=function(t){var e,i;try{e=t.getBBox()}catch{e=hr(t),i=1}return e&&(e.width||e.height)||i||(e=hr(t)),e&&!e.width&&!e.x&&!e.y?{x:+ur(t,["x","cx","x1"])||0,y:+ur(t,["y","cy","y1"])||0,width:0,height:0}:e},Sr=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&xr(t))},Ve=function(t,e){if(e){var i=t.style,n;e in De&&e!==ue&&(e=q),i.removeProperty?(n=e.substr(0,2),(n==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),i.removeProperty(n==="--"?e:e.replace(Yn,"-$1").toLowerCase())):i.removeAttribute(e)}},qe=function(t,e,i,n,a,r){var s=new oe(t._pt,e,i,0,1,r?yr:wr);return t._pt=s,s.b=n,s.e=a,t._props.push(i),s},mr={deg:1,rad:1,turn:1},rl={grid:1,flex:1},Ye=function o(t,e,i,n){var a=parseFloat(i)||0,r=(i+"").trim().substr((a+"").length)||"px",s=ot.style,l=Vs.test(e),c=t.tagName.toLowerCase()==="svg",d=(c?"client":"offset")+(l?"Width":"Height"),h=100,m=n==="px",p=n==="%",g,u,f,w;if(n===r||!a||mr[n]||mr[r])return a;if(r!=="px"&&!m&&(a=o(t,e,i,"px")),w=t.getCTM&&Sr(t),(p||r==="%")&&(De[e]||~e.indexOf("adius")))return g=w?t.getBBox()[l?"width":"height"]:t[d],U(p?a/g*h:a/100*g);if(s[l?"width":"height"]=h+(m?r:n),u=n!=="rem"&&~e.indexOf("adius")||n==="em"&&t.appendChild&&!c?t:t.parentNode,w&&(u=(t.ownerSVGElement||{}).parentNode),(!u||u===Be||!u.appendChild)&&(u=Be.body),f=u._gsap,f&&p&&f.width&&l&&f.time===ce.time&&!f.uncache)return U(a/f.width*h);if(p&&(e==="height"||e==="width")){var _=t.style[e];t.style[e]=h+n,g=t[d],_?t.style[e]=_:Ve(t,e)}else(p||r==="%")&&!rl[ye(u,"display")]&&(s.position=ye(t,"position")),u===t&&(s.position="static"),u.appendChild(ot),g=ot[d],u.removeChild(ot),s.position="absolute";return l&&p&&(f=$e(u),f.time=ce.time,f.width=u[d]),U(m?g*a/h:g&&a?h/g*a:0)},Fe=function(t,e,i,n){var a;return qn||Gn(),e in Me&&e!=="transform"&&(e=Me[e],~e.indexOf(",")&&(e=e.split(",")[0])),De[e]&&e!=="transform"?(a=ti(t,n),a=e!=="transformOrigin"?a[e]:a.svg?a.origin:Mi(ye(t,ue))+" "+a.zOrigin+"px"):(a=t.style[e],(!a||a==="auto"||n||~(a+"").indexOf("calc("))&&(a=Ei[e]&&Ei[e](t,e,i)||ye(t,e)||En(t,e)||(e==="opacity"?1:0))),i&&!~(a+"").trim().indexOf(" ")?Ye(t,e,a,i)+i:a},ol=function(t,e,i,n){if(!i||i==="none"){var a=Tt(e,t,1),r=a&&ye(t,a,1);r&&r!==i?(e=a,i=r):e==="borderColor"&&(i=ye(t,"borderTopColor"))}var s=new oe(this._pt,t.style,e,0,1,Hn),l=0,c=0,d,h,m,p,g,u,f,w,_,v,b,y;if(s.b=i,s.e=n,i+="",n+="",n.substring(0,6)==="var(--"&&(n=ye(t,n.substring(4,n.indexOf(")")))),n==="auto"&&(u=t.style[e],t.style[e]=n,n=ye(t,e)||n,u?t.style[e]=u:Ve(t,e)),d=[i,n],Pn(d),i=d[0],n=d[1],m=i.match(et)||[],y=n.match(et)||[],y.length){for(;h=et.exec(n);)f=h[0],_=n.substring(l,h.index),g?g=(g+1)%5:(_.substr(-5)==="rgba("||_.substr(-5)==="hsla(")&&(g=1),f!==(u=m[c++]||"")&&(p=parseFloat(u)||0,b=u.substr((p+"").length),f.charAt(1)==="="&&(f=tt(p,f)+b),w=parseFloat(f),v=f.substr((w+"").length),l=et.lastIndex-v.length,v||(v=v||he.units[e]||b,l===n.length&&(n+=v,s.e+=v)),b!==v&&(p=Ye(t,e,u,v)||0),s._pt={_next:s._pt,p:_||c===1?_:",",s:p,c:w-p,m:g&&g<4||e==="zIndex"?Math.round:0});s.c=l<n.length?n.substring(l,n.length):""}else s.r=e==="display"&&n==="none"?yr:wr;return Sn.test(n)&&(s.e=0),this._pt=s,s},pr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},sl=function(t){var e=t.split(" "),i=e[0],n=e[1]||"50%";return(i==="top"||i==="bottom"||n==="left"||n==="right")&&(t=i,i=n,n=t),e[0]=pr[i]||i,e[1]=pr[n]||n,e.join(" ")},ll=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var i=e.t,n=i.style,a=e.u,r=i._gsap,s,l,c;if(a==="all"||a===!0)n.cssText="",l=1;else for(a=a.split(","),c=a.length;--c>-1;)s=a[c],De[s]&&(l=1,s=s==="transformOrigin"?ue:q),Ve(i,s);l&&(Ve(i,q),r&&(r.svg&&i.removeAttribute("transform"),n.scale=n.rotate=n.translate="none",ti(i,1),r.uncache=1,_r(n)))}},Ei={clearProps:function(t,e,i,n,a){if(a.data!=="isFromStart"){var r=t._pt=new oe(t._pt,e,i,0,0,ll);return r.u=n,r.pr=-10,r.tween=a,t._props.push(i),1}}},ei=[1,0,0,1,0,0],Tr={},Cr=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},fr=function(t){var e=ye(t,q);return Cr(e)?ei:e.substr(7).match(xn).map(U)},Un=function(t,e){var i=t._gsap||$e(t),n=t.style,a=fr(t),r,s,l,c;return i.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,a=[l.a,l.b,l.c,l.d,l.e,l.f],a.join(",")==="1,0,0,1,0,0"?ei:a):(a===ei&&!t.offsetParent&&t!==xt&&!i.svg&&(l=n.display,n.display="block",r=t.parentNode,(!r||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,s=t.nextElementSibling,xt.appendChild(t)),a=fr(t),l?n.display=l:Ve(t,"display"),c&&(s?r.insertBefore(t,s):r?r.appendChild(t):xt.removeChild(t))),e&&a.length>6?[a[0],a[1],a[4],a[5],a[12],a[13]]:a)},Bn=function(t,e,i,n,a,r){var s=t._gsap,l=a||Un(t,!0),c=s.xOrigin||0,d=s.yOrigin||0,h=s.xOffset||0,m=s.yOffset||0,p=l[0],g=l[1],u=l[2],f=l[3],w=l[4],_=l[5],v=e.split(" "),b=parseFloat(v[0])||0,y=parseFloat(v[1])||0,C,S,k,T;i?l!==ei&&(S=p*f-g*u)&&(k=b*(f/S)+y*(-u/S)+(u*_-f*w)/S,T=b*(-g/S)+y*(p/S)-(p*_-g*w)/S,b=k,y=T):(C=xr(t),b=C.x+(~v[0].indexOf("%")?b/100*C.width:b),y=C.y+(~(v[1]||v[0]).indexOf("%")?y/100*C.height:y)),n||n!==!1&&s.smooth?(w=b-c,_=y-d,s.xOffset=h+(w*p+_*u)-w,s.yOffset=m+(w*g+_*f)-_):s.xOffset=s.yOffset=0,s.xOrigin=b,s.yOrigin=y,s.smooth=!!n,s.origin=e,s.originIsAbsolute=!!i,t.style[ue]="0px 0px",r&&(qe(r,s,"xOrigin",c,b),qe(r,s,"yOrigin",d,y),qe(r,s,"xOffset",h,s.xOffset),qe(r,s,"yOffset",m,s.yOffset)),t.setAttribute("data-svg-origin",b+" "+y)},ti=function(t,e){var i=t._gsap||new Ln(t);if("x"in i&&!e&&!i.uncache)return i;var n=t.style,a=i.scaleX<0,r="px",s="deg",l=getComputedStyle(t),c=ye(t,ue)||"0",d,h,m,p,g,u,f,w,_,v,b,y,C,S,k,T,x,E,M,L,D,H,W,z,V,_e,$,Z,j,se,pe,be;return d=h=m=u=f=w=_=v=b=0,p=g=1,i.svg=!!(t.getCTM&&Sr(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(n[q]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[q]!=="none"?l[q]:"")),n.scale=n.rotate=n.translate="none"),S=Un(t,i.svg),i.svg&&(i.uncache?(V=t.getBBox(),c=i.xOrigin-V.x+"px "+(i.yOrigin-V.y)+"px",z=""):z=!e&&t.getAttribute("data-svg-origin"),Bn(t,z||c,!!z||i.originIsAbsolute,i.smooth!==!1,S)),y=i.xOrigin||0,C=i.yOrigin||0,S!==ei&&(E=S[0],M=S[1],L=S[2],D=S[3],d=H=S[4],h=W=S[5],S.length===6?(p=Math.sqrt(E*E+M*M),g=Math.sqrt(D*D+L*L),u=E||M?vt(M,E)*rt:0,_=L||D?vt(L,D)*rt+u:0,_&&(g*=Math.abs(Math.cos(_*St))),i.svg&&(d-=y-(y*E+C*L),h-=C-(y*M+C*D))):(be=S[6],se=S[7],$=S[8],Z=S[9],j=S[10],pe=S[11],d=S[12],h=S[13],m=S[14],k=vt(be,j),f=k*rt,k&&(T=Math.cos(-k),x=Math.sin(-k),z=H*T+$*x,V=W*T+Z*x,_e=be*T+j*x,$=H*-x+$*T,Z=W*-x+Z*T,j=be*-x+j*T,pe=se*-x+pe*T,H=z,W=V,be=_e),k=vt(-L,j),w=k*rt,k&&(T=Math.cos(-k),x=Math.sin(-k),z=E*T-$*x,V=M*T-Z*x,_e=L*T-j*x,pe=D*x+pe*T,E=z,M=V,L=_e),k=vt(M,E),u=k*rt,k&&(T=Math.cos(k),x=Math.sin(k),z=E*T+M*x,V=H*T+W*x,M=M*T-E*x,W=W*T-H*x,E=z,H=V),f&&Math.abs(f)+Math.abs(u)>359.9&&(f=u=0,w=180-w),p=U(Math.sqrt(E*E+M*M+L*L)),g=U(Math.sqrt(W*W+be*be)),k=vt(H,W),_=Math.abs(k)>2e-4?k*rt:0,b=pe?1/(pe<0?-pe:pe):0),i.svg&&(z=t.getAttribute("transform"),i.forceCSS=t.setAttribute("transform","")||!Cr(ye(t,q)),z&&t.setAttribute("transform",z))),Math.abs(_)>90&&Math.abs(_)<270&&(a?(p*=-1,_+=u<=0?180:-180,u+=u<=0?180:-180):(g*=-1,_+=_<=0?180:-180)),e=e||i.uncache,i.x=d-((i.xPercent=d&&(!e&&i.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-d)?-50:0)))?t.offsetWidth*i.xPercent/100:0)+r,i.y=h-((i.yPercent=h&&(!e&&i.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-h)?-50:0)))?t.offsetHeight*i.yPercent/100:0)+r,i.z=m+r,i.scaleX=U(p),i.scaleY=U(g),i.rotation=U(u)+s,i.rotationX=U(f)+s,i.rotationY=U(w)+s,i.skewX=_+s,i.skewY=v+s,i.transformPerspective=b+r,(i.zOrigin=parseFloat(c.split(" ")[2])||!e&&i.zOrigin||0)&&(n[ue]=Mi(c)),i.xOffset=i.yOffset=0,i.force3D=he.force3D,i.renderTransform=i.svg?dl:vr?kr:cl,i.uncache=0,i},Mi=function(t){return(t=t.split(" "))[0]+" "+t[1]},Nn=function(t,e,i){var n=te(e);return U(parseFloat(e)+parseFloat(Ye(t,"x",i+"px",n)))+n},cl=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,kr(t,e)},nt="0deg",Jt="0px",at=") ",kr=function(t,e){var i=e||this,n=i.xPercent,a=i.yPercent,r=i.x,s=i.y,l=i.z,c=i.rotation,d=i.rotationY,h=i.rotationX,m=i.skewX,p=i.skewY,g=i.scaleX,u=i.scaleY,f=i.transformPerspective,w=i.force3D,_=i.target,v=i.zOrigin,b="",y=w==="auto"&&t&&t!==1||w===!0;if(v&&(h!==nt||d!==nt)){var C=parseFloat(d)*St,S=Math.sin(C),k=Math.cos(C),T;C=parseFloat(h)*St,T=Math.cos(C),r=Nn(_,r,S*T*-v),s=Nn(_,s,-Math.sin(C)*-v),l=Nn(_,l,k*T*-v+v)}f!==Jt&&(b+="perspective("+f+at),(n||a)&&(b+="translate("+n+"%, "+a+"%) "),(y||r!==Jt||s!==Jt||l!==Jt)&&(b+=l!==Jt||y?"translate3d("+r+", "+s+", "+l+") ":"translate("+r+", "+s+at),c!==nt&&(b+="rotate("+c+at),d!==nt&&(b+="rotateY("+d+at),h!==nt&&(b+="rotateX("+h+at),(m!==nt||p!==nt)&&(b+="skew("+m+", "+p+at),(g!==1||u!==1)&&(b+="scale("+g+", "+u+at),_.style[q]=b||"translate(0, 0)"},dl=function(t,e){var i=e||this,n=i.xPercent,a=i.yPercent,r=i.x,s=i.y,l=i.rotation,c=i.skewX,d=i.skewY,h=i.scaleX,m=i.scaleY,p=i.target,g=i.xOrigin,u=i.yOrigin,f=i.xOffset,w=i.yOffset,_=i.forceCSS,v=parseFloat(r),b=parseFloat(s),y,C,S,k,T;l=parseFloat(l),c=parseFloat(c),d=parseFloat(d),d&&(d=parseFloat(d),c+=d,l+=d),l||c?(l*=St,c*=St,y=Math.cos(l)*h,C=Math.sin(l)*h,S=Math.sin(l-c)*-m,k=Math.cos(l-c)*m,c&&(d*=St,T=Math.tan(c-d),T=Math.sqrt(1+T*T),S*=T,k*=T,d&&(T=Math.tan(d),T=Math.sqrt(1+T*T),y*=T,C*=T)),y=U(y),C=U(C),S=U(S),k=U(k)):(y=h,k=m,C=S=0),(v&&!~(r+"").indexOf("px")||b&&!~(s+"").indexOf("px"))&&(v=Ye(p,"x",r,"px"),b=Ye(p,"y",s,"px")),(g||u||f||w)&&(v=U(v+g-(g*y+u*S)+f),b=U(b+u-(g*C+u*k)+w)),(n||a)&&(T=p.getBBox(),v=U(v+n/100*T.width),b=U(b+a/100*T.height)),T="matrix("+y+","+C+","+S+","+k+","+v+","+b+")",p.setAttribute("transform",T),_&&(p.style[q]=T)},hl=function(t,e,i,n,a){var r=360,s=Q(a),l=parseFloat(a)*(s&&~a.indexOf("rad")?rt:1),c=l-n,d=n+c+"deg",h,m;return s&&(h=a.split("_")[1],h==="short"&&(c%=r,c!==c%(r/2)&&(c+=c<0?r:-r)),h==="cw"&&c<0?c=(c+r*cr)%r-~~(c/r)*r:h==="ccw"&&c>0&&(c=(c-r*cr)%r-~~(c/r)*r)),t._pt=m=new oe(t._pt,e,i,n,c,Us),m.e=d,m.u="deg",t._props.push(i),m},gr=function(t,e){for(var i in e)t[i]=e[i];return t},ul=function(t,e,i){var n=gr({},i._gsap),a="perspective,force3D,transformOrigin,svgOrigin",r=i.style,s,l,c,d,h,m,p,g;n.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),r[q]=e,s=ti(i,1),Ve(i,q),i.setAttribute("transform",c)):(c=getComputedStyle(i)[q],r[q]=e,s=ti(i,1),r[q]=c);for(l in De)c=n[l],d=s[l],c!==d&&a.indexOf(l)<0&&(p=te(c),g=te(d),h=p!==g?Ye(i,l,c,g):parseFloat(c),m=parseFloat(d),t._pt=new oe(t._pt,s,l,h,m-h,$n),t._pt.u=g||0,t._props.push(l));gr(s,n)};re("padding,margin,Width,Radius",function(o,t){var e="Top",i="Right",n="Bottom",a="Left",r=(t<3?[e,i,n,a]:[e+a,e+i,n+i,n+a]).map(function(s){return t<2?o+s:"border"+s+o});Ei[t>1?"border"+o:o]=function(s,l,c,d,h){var m,p;if(arguments.length<4)return m=r.map(function(g){return Fe(s,g,c)}),p=m.join(" "),p.split(m[0]).length===5?m[0]:p;m=(d+"").split(" "),p={},r.forEach(function(g,u){return p[g]=m[u]=m[u]||m[(u-1)/2|0]}),s.init(l,p,h)}});var Kn={name:"css",register:Gn,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,i,n,a){var r=this._props,s=t.style,l=i.vars.startAt,c,d,h,m,p,g,u,f,w,_,v,b,y,C,S,k,T;qn||Gn(),this.styles=this.styles||br(t),k=this.styles.props,this.tween=i;for(u in e)if(u!=="autoRound"&&(d=e[u],!(le[u]&&Fn(u,e,i,n,t,a)))){if(p=typeof d,g=Ei[u],p==="function"&&(d=d.call(i,n,t,a),p=typeof d),p==="string"&&~d.indexOf("random(")&&(d=bt(d)),g)g(this,t,u,d,i)&&(S=1);else if(u.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(u)+"").trim(),d+="",Le.lastIndex=0,Le.test(c)||(f=te(c),w=te(d),w?f!==w&&(c=Ye(t,u,c,w)+w):f&&(d+=f)),this.add(s,"setProperty",c,d,n,a,0,0,u),r.push(u),k.push(u,0,s[u]);else if(p!=="undefined"){if(l&&u in l?(c=typeof l[u]=="function"?l[u].call(i,n,t,a):l[u],Q(c)&&~c.indexOf("random(")&&(c=bt(c)),te(c+"")||c==="auto"||(c+=he.units[u]||te(Fe(t,u))||""),(c+"").charAt(1)==="="&&(c=Fe(t,u))):c=Fe(t,u),m=parseFloat(c),_=p==="string"&&d.charAt(1)==="="&&d.substr(0,2),_&&(d=d.substr(2)),h=parseFloat(d),u in Me&&(u==="autoAlpha"&&(m===1&&Fe(t,"visibility")==="hidden"&&h&&(m=0),k.push("visibility",0,s.visibility),qe(this,s,"visibility",m?"inherit":"hidden",h?"inherit":"hidden",!h)),u!=="scale"&&u!=="transform"&&(u=Me[u],~u.indexOf(",")&&(u=u.split(",")[0]))),v=u in De,v){if(this.styles.save(u),T=d,p==="string"&&d.substring(0,6)==="var(--"){if(d=ye(t,d.substring(4,d.indexOf(")"))),d.substring(0,5)==="calc("){var x=t.style.perspective;t.style.perspective=d,d=ye(t,"perspective"),x?t.style.perspective=x:Ve(t,"perspective")}h=parseFloat(d)}if(b||(y=t._gsap,y.renderTransform&&!e.parseTransform||ti(t,e.parseTransform),C=e.smoothOrigin!==!1&&y.smooth,b=this._pt=new oe(this._pt,s,q,0,1,y.renderTransform,y,0,-1),b.dep=1),u==="scale")this._pt=new oe(this._pt,y,"scaleY",y.scaleY,(_?tt(y.scaleY,_+h):h)-y.scaleY||0,$n),this._pt.u=0,r.push("scaleY",u),u+="X";else if(u==="transformOrigin"){k.push(ue,0,s[ue]),d=sl(d),y.svg?Bn(t,d,0,C,0,this):(w=parseFloat(d.split(" ")[2])||0,w!==y.zOrigin&&qe(this,y,"zOrigin",y.zOrigin,w),qe(this,s,u,Mi(c),Mi(d)));continue}else if(u==="svgOrigin"){Bn(t,d,1,C,0,this);continue}else if(u in Tr){hl(this,y,u,m,_?tt(m,_+d):d);continue}else if(u==="smoothOrigin"){qe(this,y,"smooth",y.smooth,d);continue}else if(u==="force3D"){y[u]=d;continue}else if(u==="transform"){ul(this,d,t);continue}}else u in s||(u=Tt(u)||u);if(v||(h||h===0)&&(m||m===0)&&!Ys.test(d)&&u in s)f=(c+"").substr((m+"").length),h||(h=0),w=te(d)||(u in he.units?he.units[u]:f),f!==w&&(m=Ye(t,u,c,w)),this._pt=new oe(this._pt,v?y:s,u,m,(_?tt(m,_+h):h)-m,!v&&(w==="px"||u==="zIndex")&&e.autoRound!==!1?Xs:$n),this._pt.u=w||0,v&&T!==d?(this._pt.b=c,this._pt.e=T,this._pt.r=js):f!==w&&w!=="%"&&(this._pt.b=c,this._pt.r=Ks);else if(u in s)ol.call(this,t,u,c,_?_+d:d);else if(u in t)this.add(t,u,c||t[u],_?_+d:d,n,a);else if(u!=="parseTransform"){Si(u,d);continue}v||(u in s?k.push(u,0,s[u]):typeof t[u]=="function"?k.push(u,2,t[u]()):k.push(u,1,c||t[u])),r.push(u)}}S&&Rn(this)},render:function(t,e){if(e.tween._time||!Vn())for(var i=e._pt;i;)i.r(t,i.d),i=i._next;else e.styles.revert()},get:Fe,aliases:Me,getSetter:function(t,e,i){var n=Me[e];return n&&n.indexOf(",")<0&&(e=n),e in De&&e!==ue&&(t._gsap.x||Fe(t,"x"))?i&&lr===i?e==="scale"?el:Js:(lr=i||{})&&(e==="scale"?tl:il):t.style&&!xi(t.style[e])?Zs:~e.indexOf("-")?Qs:Ai(t,e)},core:{_removeProperty:Ve,_getMatrix:Un}};ae.utils.checkPrefix=Tt;ae.core.getStyleSaver=br;(function(o,t,e,i){var n=re(o+","+t+","+e,function(a){De[a]=1});re(t,function(a){he.units[a]="deg",Tr[a]=1}),Me[n[13]]=o+","+t,re(i,function(a){var r=a.split(":");Me[r[1]]=n[r[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");re("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(o){he.units[o]="px"});ae.registerPlugin(Kn);var jn=ae.registerPlugin(Kn)||ae,Dc=jn.core.Tween;var Ar={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},me={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},Xn={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},Zn={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"};var Er={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},Ct={humidity:"65%",windSpeed:"10 km/h",pressure:"1013 hPa",indoorTemperature:"22\xB0",indoorHumidity:"45%"},Mr="1.2.0",Pr={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function ml(o){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(o)}function Lr(o,t=-1/0,e=1/0){return typeof o=="number"&&!isNaN(o)&&o>=t&&o<=e}function ni(o){return typeof o!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(o)||/^rgba?\(\s*[\d.,%\s/]+\)$/.test(o)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(o.toLowerCase())}function P(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function kt(o,t){return Object.prototype.hasOwnProperty.call(o,t)?o[t]:void 0}function st(o,t,e=0){if(!isFinite(o))return"--";let i=t?.locale?.language||t?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(i,{minimumFractionDigits:e,maximumFractionDigits:e}).format(o)}catch{return o.toFixed(e)}}function Pi(o,t,e){if(o?.localize)try{let i=o.localize(t);if(i&&i!==t)return i}catch{}return e}function Or(o,t){if(!isFinite(o))return 0;switch((t||"km/h").toLowerCase()){case"m/s":return o*3.6;case"mph":return o*1.609344;case"ft/s":return o*1.09728;case"kn":case"kt":case"knots":return o*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,o),1.5)*3.6;default:return o}}function A(o,t,...e){o&&console.log(`[AWC Dev] ${t}`,...e)}function J(o,t){let e=o.engine_settings||{},i=(r,s,l,c)=>Lr(r,l,c)?r:s,n=i(e.windSpeed,me.windSpeed,.1,15),a=n;return Lr(t,0,200)&&(a=Math.max(.1,Math.min(15,t/10*n))),{windSpeed:a,rainCount:i(e.rainCount,me.rainCount,.1,10),leafCount:i(e.leafCount,me.leafCount,.1,10),snowCount:i(e.snowCount,me.snowCount,.1,10),cloudBaseSize:i(e.cloudBaseSize,me.cloudBaseSize,.3,2.5),cloudCount:i(e.cloudCount,me.cloudCount,1,20),splashBounce:i(e.splashBounce,me.splashBounce,40,120)}}function Qn(o){o.forEach(t=>{t!=null&&clearTimeout(t)}),o.length=0}function Fr(o){let t=new Set;return o.querySelectorAll("*").forEach(e=>{window.AnimatedWeatherCardGsap.getTweensOf(e).forEach(i=>{let n=i;for(;n.parent?.parent;)n=n.parent;t.add(n)})}),t}function Li(o){window.AnimatedWeatherCardGsap&&Fr(o).forEach(t=>t.pause())}function Oi(o){window.AnimatedWeatherCardGsap&&Fr(o).forEach(t=>t.resume())}function Jn(o){window.AnimatedWeatherCardGsap&&o.querySelectorAll("*").forEach(t=>{window.AnimatedWeatherCardGsap.killTweensOf(t)})}function At(o,t,e,i,n){if(typeof o!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(t&&ml(o))return o;if(t)return console.warn(`Invalid dev mode condition: ${o}, using sunny`),"sunny";let a=o.toLowerCase();if(a.includes("sleet")&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"sleety-stormy";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"snowy-stormy";if(a.includes("lightning")||a.includes("thunder")||a.includes("storm"))return"stormy";if(a.includes("fog")||a.includes("mist"))return"foggy";if(a.includes("heavy")&&a.includes("rain"))return"pouring";if(a.includes("pouring")||a.includes("downpour"))return"pouring";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("rain")||a.includes("drizzle")))return"snowy-rainy";if(a.includes("light")&&(a.includes("rain")||a.includes("drizzle")))return"light-rain";if(a.includes("rain")||a.includes("drizzle"))return"rainy";if(a.includes("sleet")||a.includes("hail"))return"sleety";if(a.includes("snow"))return"snowy";if(a.includes("wind"))return"windy";if(a.includes("partly")&&a.includes("cloud"))return"partly-cloudy";if(a.includes("cloud")||a.includes("overcast"))return"cloudy";if(a.includes("clear")||a.includes("sunny")){let r=new Date,s;if(n)try{let h=new Intl.DateTimeFormat("en-US",{timeZone:n,hour:"numeric",hour12:!1}).formatToParts(r);s=parseInt(h.find(m=>m.type==="hour")?.value||"0",10)}catch{s=r.getHours()}else s=r.getHours();let l=e??6,c=i??20;return(s<l||s>=c)&&a.includes("clear")?"clear-night":"sunny"}return"sunny"}function ai(o,t,e){if(typeof o!="string"||!o.trim())return console.warn("Invalid animation type provided"),e||ii("rain");if(!t||!t.isEnabled())return e||ii(o);let i=Pr[o];if(!i)return console.warn(`No color scheme found for animation type: ${o}`),e||ii(o);try{let n=t.getCurrentState(),a=t.getTimeAwareColor(i);return ni(a)?a:(console.warn(`Invalid color returned from time manager: ${a}`),e||ii(o))}catch(n){return console.error("Error getting time-aware color:",n),e||ii(o)}}function ii(o){let e={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[o];return e||(console.warn(`Unknown animation type: ${o}, using white as fallback`),"#FFFFFF")}var Fi=class Fi{constructor(t,e,i){this.animationHandles=[];this.timeouts=[];this.particles=[];this.element=t,this.config=e,this.cardConfig=i,this.state="created",queueMicrotask(()=>A(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){A(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),A(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(t){throw console.error(`Failed to start ${this.animationType} animation:`,t),this.setState("stopped"),t}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),A(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(t){throw console.error(`Failed to stop ${this.animationType} animation:`,t),t}}async pause(){if(this.state==="active")try{A(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(t){throw console.error(`Failed to pause ${this.animationType} animation:`,t),t}}async resume(){if(this.state==="paused")try{A(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(t){throw console.error(`Failed to resume ${this.animationType} animation:`,t),this.setState("paused"),t}}setWindSpeed(t){this.realWindSpeed=t,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),A(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}setState(t){let e=this.state;this.state=t,A(this.config.devMode,`${this.animationType} state: ${e} \u2192 ${t}`)}ensureLayerVisibility(t){if(this.containerSelector){let i=this.element.querySelector(this.containerSelector);i&&(i.style.display=t?"block":"none",A(this.config.devMode,`Set ${this.animationType} container visibility: ${t}`))}let e=this.element.querySelector(this.layerSelector);e&&!Fi.SHARED_LAYERS.includes(this.layerSelector)&&(e.style.opacity=t?"1":"0",A(this.config.devMode,`Set ${this.animationType} layer opacity: ${t?1:0}`))}cleanup(){this.animationHandles.forEach(t=>{t&&clearInterval(t)}),this.animationHandles=[],this.timeouts.forEach(t=>{if(t)if(typeof t=="function"){let e=t();e&&clearTimeout(e)}else clearTimeout(t)}),this.timeouts=[],window.AnimatedWeatherCardGsap&&this.particles.forEach(t=>{window.AnimatedWeatherCardGsap.killTweensOf(t)}),this.particles.forEach(t=>{t.parentNode&&t.parentNode.removeChild(t)}),this.particles=[],A(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(t){this.animationHandles.push(t)}addTimeout(t){this.timeouts.push(t)}addParticle(t){this.particles.push(t)}removeParticle(t){let e=this.particles.indexOf(t);e>-1&&this.particles.splice(e,1)}};Fi.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var X=Fi;var Ue=class{constructor(t,e,i){this.layer=t;this.create=e;this.cycle=i;this.items=[];this.running=!1;this.paused=!1}start(t){this.running=!0;let e=[];for(let i=0;i<t;i++){let n=this.create(i);this.layer.appendChild(n);let a={el:n};this.items.push(a),e.push(n),this.run(a,!0)}return e}run(t,e){this.running&&(t.anim=this.cycle(t.el,()=>this.run(t,!1),e),this.paused&&t.anim.pause())}pause(){this.paused=!0,this.items.forEach(t=>t.anim?.pause())}resume(){this.paused=!1,this.items.forEach(t=>t.anim?.resume())}stop(){this.running=!1,this.items.forEach(t=>{t.anim?.kill(),window.AnimatedWeatherCardGsap?.killTweensOf(t.el),t.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(t=>t.el)}};function Et(o,t){return t&&o.progress(Math.random()),o}var pl=420*230;function Mt(o,t){return Math.min(3,Math.max(.6,o*t/pl))||1}function F(o,t){return o+Math.random()*(t-o)}var fl={light:10,rain:18,storm:24,pouring:32},gl={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},wl={light:16,rain:24,storm:34,pouring:42},yl=.3,_l=16,bl=8,vl=[10,30],Dr="http://www.w3.org/2000/svg";function xl(o,t,e,i){let n=0,a=0,r=0;for(let s=1;s<=16;s++){let l=s/16,c=2*(1-l)*l*o+l*l*e,d=2*(1-l)*l*t+l*l*i;n+=Math.hypot(c-a,d-r),a=c,r=d}return n}function Sl(o,t,e,i){return Math.max(4,Math.round(fl[o]*t*Mt(e,i)))}var Di=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=a,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...i},A(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start rain animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Rain layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=this.rainKind(),r=Sl(a,i.rainCount,n.offsetWidth,n.offsetHeight),s=this.getRainColor(this.element.timeOfDayManager),l=this.cardConfig.spill_particles!==!1,c=wl[a],d=a==="pouring"?3:2.4;this.splashLayer=e,this.splashColor=s,this.splashBounce=i.splashBounce/me.splashBounce,this.pool=new Ue(e,()=>{let h=F(1,d),m=document.createElement("div");return m.className="raindrop",m.style.cssText=`
                    width: ${h.toFixed(2)}px;
                    height: ${c}px;
                    background: linear-gradient(0deg, ${s}, transparent);
                    border-radius: ${h.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,m.dataset.width=h.toFixed(2),m},(h,m,p)=>this.fall(h,n,a,c,l,m,p)),this.pool.start(r).forEach(h=>this.addParticle(h)),A(this.config.devMode,`Rain animation started - ${r} drops (${a})`)}fall(e,i,n,a,r,s,l){let c=i.offsetWidth,d=i.offsetHeight,[h,m]=gl[n],p=F(h,m),g=F(6,Math.max(7,c-6)),u=this.rainConfig.splashEnabled&&Math.random()<yl,f=-a,w=u?d-a:r?d+F(60,120):d,_=Math.max(.25,(w-f)/p),v=parseFloat(e.dataset.width||"2");window.AnimatedWeatherCardGsap.set(e,{x:g,scaleY:1,opacity:.55+.45*Math.min(1,v/2.4)});let b=window.AnimatedWeatherCardGsap.timeline({onComplete:s});if(b.fromTo(e,{y:f},{y:w,duration:_,ease:"none"}),u)b.call(()=>this.createSplash(g+v/2,d),[],_),b.to(e,{scaleY:0,duration:a/p,ease:"none"},_);else if(r){let y=(d-a-f)/p;b.to(e,{opacity:0,duration:_-y,ease:"power1.in"},y)}return Et(b,l)}async onStop(){this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(e=>{window.AnimatedWeatherCardGsap?.killTweensOf(e),e.remove()}),this.splashDots=[],this.rebounds.forEach(e=>{window.AnimatedWeatherCardGsap?.killTweensOf([e,e.firstChild]),e.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(e=>e.remove()),A(this.config.devMode,"Rain animation stopped")}async onPause(){this.pool?.pause(),A(this.config.devMode,"Rain animation paused")}async onResume(){this.pool?.resume(),A(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(e,i){if(!(!window.AnimatedWeatherCardGsap||!this.splashLayer)){this.createRebound(e,i);for(let n of[-1,1]){let a=this.splashDots[this.nextSplashDot];a||(a=document.createElement("div"),a.className="rain-splash",a.style.background=this.splashColor,this.splashLayer.appendChild(a),this.splashDots[this.nextSplashDot]=a),this.nextSplashDot=(this.nextSplashDot+1)%_l;let r=F(.22,.28),s=F(4,10)*this.splashBounce,l=n*F(6,12)*this.splashBounce;window.AnimatedWeatherCardGsap.killTweensOf(a),window.AnimatedWeatherCardGsap.set(a,{x:e-1,y:i-2,opacity:.9}),window.AnimatedWeatherCardGsap.timeline().to(a,{x:e-1+l,duration:r,ease:"power1.out"},0).to(a,{y:i-2-s,duration:r*.45,ease:"power2.out"},0).to(a,{y:i-2,duration:r*.55,ease:"power2.in"},r*.45).to(a,{opacity:0,duration:r*.4,ease:"power1.in"},r*.6)}}}createRebound(e,i){let n=this.splashLayer,a=this.rebounds[this.nextRebound];if(!a){a=document.createElementNS(Dr,"svg"),a.classList.add("rain-rebound");let u=document.createElementNS(Dr,"path");u.setAttribute("fill","none"),u.style.stroke=this.splashColor,a.appendChild(u),n.appendChild(a),this.rebounds[this.nextRebound]=a}this.nextRebound=(this.nextRebound+1)%bl;let r=a.firstChild,[s,l]=vl,c=F(s,l)*this.splashBounce,d=(Math.random()<.5?-1:1)*F(10,24)*this.splashBounce,h=F(6,18);r.setAttribute("d",`M 0,0 Q ${d.toFixed(1)},${(-2*c).toFixed(1)} ${(2*d).toFixed(1)},${h.toFixed(1)}`);let m=xl(d,-2*c,2*d,h),p=Math.min(m*.45,6+c*.3);r.style.strokeDasharray=`${p.toFixed(1)} ${(m+p).toFixed(1)}`;let g=F(.42,.56);window.AnimatedWeatherCardGsap.killTweensOf([a,r]),window.AnimatedWeatherCardGsap.set(a,{x:e,y:i,opacity:.85}),window.AnimatedWeatherCardGsap.timeline().fromTo(r,{strokeDashoffset:p,strokeWidth:1.6},{strokeDashoffset:-m,strokeWidth:.6,duration:g,ease:"power2.out"},0).to(a,{opacity:0,duration:g*.35,ease:"power1.in"},g*.65)}getRainColor(e){return this.rainConfig.isStorm?ai("lightning",e,"var(--weather-storm-rain-color)"):ai("rain",e,"var(--weather-rain-color)")}};var Tl=36,Ke=[2,6],ea=[20,38],Wr=10,Cl=.6;function kl(o,t,e){return Math.max(6,Math.round(Tl*o*Mt(t,e)))}function ia(o){return Math.min(2.2,Math.max(.3,o/me.windSpeed))}var Wi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.swings=[];this.realWindSpeed=a,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...i},A(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start snow animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Snow layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=kl(i.snowCount,n.offsetWidth,n.offsetHeight),r="#ffffff",s=this.cardConfig.spill_particles!==!1,l=ia(i.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation(),this.pool=new Ue(e,()=>this.createFlake(r),(c,d,h)=>this.fall(c,n,l,s,d,h)),this.pool.start(a).forEach(c=>this.addParticle(c)),A(this.config.devMode,`Snow animation started - ${a} flakes`)}createFlake(e){let i=F(Ke[0],Ke[1]),n=(i-Ke[0])/(Ke[1]-Ke[0]),a=document.createElement("div");a.className="snowflake",a.dataset.size=i.toFixed(2),a.style.cssText=`
            width: ${i.toFixed(2)}px;
            height: ${i.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${e}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,a.dataset.opacity=(.45+.45*n).toFixed(2),window.AnimatedWeatherCardGsap.set(a,{transformOrigin:"50% -500%",rotation:-Wr});let r=window.AnimatedWeatherCardGsap.to(a,{rotation:Wr,duration:F(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return r.progress(Math.random()),this.swings.push(r),a}fall(e,i,n,a,r,s){let l=i.offsetWidth,c=i.offsetHeight,d=parseFloat(e.dataset.size||"4"),h=(d-Ke[0])/(Ke[1]-Ke[0]),m=(ea[0]+(ea[1]-ea[0])*h)*F(.9,1.1),p=this.snowConfig.accumulation&&Math.random()<Cl,g=-d*2,u=p?c-this.pileHeight()-d:a?c+F(60,120):c+d,f=u-g,w=Math.max(.5,f/m),_=f*F(.04,.13)*n,v=F(-_,Math.max(1,l-d));window.AnimatedWeatherCardGsap.set(e,{x:v,opacity:parseFloat(e.dataset.opacity||"0.7")});let b=window.AnimatedWeatherCardGsap.timeline({onComplete:r});if(b.fromTo(e,{y:g},{y:u,x:v+_,duration:w,ease:"none"}),p)b.call(()=>this.addToAccumulation(),[],w),b.to(e,{opacity:0,duration:.6,ease:"power1.out"},w);else if(a){let y=Math.min(w,(c-g)/m);b.to(e,{opacity:0,duration:Math.max(.1,w-y),ease:"power1.in"},y)}return Et(b,s)}async onStop(){this.swings.forEach(e=>e.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),A(this.config.devMode,"Snow animation stopped")}async onPause(){this.pool?.pause(),this.swings.forEach(e=>e.pause()),A(this.config.devMode,"Snow animation paused")}async onResume(){this.pool?.resume(),this.swings.forEach(e=>e.resume()),A(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let e=this.element.querySelector(".animated-weather-card");if(!e)return;e.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(n=>n.remove());let i=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
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
        `,e.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let e=this.accumulationElement,i=this.snowConfig.accumulationHeight;if(!e?.parentNode||i<=0)return;let n=this.pileHeight();if(n>=i)return;let a=Math.min(i,n+.8);e.setAttribute("data-target-height",String(a)),window.AnimatedWeatherCardGsap.to(e,{scaleY:a/i,opacity:Math.min(.9,a/i),duration:.3,ease:"power2.out"})}};var Al=30,Hr=[150,230],El=.3,Hi=6,zi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.realWindSpeed=a,this.sleetConfig={particleCount:40,...i},A(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start sleet animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card"),a=Math.max(6,Math.round(Al*i.snowCount*Mt(n.offsetWidth,n.offsetHeight))),r=this.cardConfig.spill_particles!==!1,s=ia(i.windSpeed)*.5;this.pool=new Ue(e,()=>{let l=F(1.5,3.5),c=document.createElement("div");return c.className="sleet-particle-gsap",c.dataset.size=l.toFixed(2),c.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${l.toFixed(2)}px;
                    height: ${l.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,c},(l,c,d)=>this.fall(l,n,s,r,c,d)),this.pool.start(a).forEach(l=>this.addParticle(l)),A(this.config.devMode,`Sleet animation started - ${a} pellets`)}fall(e,i,n,a,r,s){let l=i.offsetWidth,c=i.offsetHeight,d=parseFloat(e.dataset.size||"2"),h=F(Hr[0],Hr[1]),m=Math.random()<El,p=-d*2,g=m?c-d:a?c+F(60,120):c+d,u=g-p,f=Math.max(.3,u/h),w=u*F(.03,.08)*n,_=F(-w,Math.max(1,l-d));window.AnimatedWeatherCardGsap.set(e,{x:_,opacity:F(.8,1),rotation:F(0,360)});let v=window.AnimatedWeatherCardGsap.timeline({onComplete:r});if(v.fromTo(e,{y:p},{y:g,x:_+w,duration:f,ease:"none"}),m)v.call(()=>this.addToPile(i),[],f),v.to(e,{opacity:0,duration:.3,ease:"power1.out"},f);else if(a){let b=Math.min(f,(c-p)/h);v.to(e,{opacity:0,duration:Math.max(.1,f-b),ease:"power1.in"},b)}return Et(v,s)}addToPile(e){if(this.state!=="active")return;let i=e.querySelector(".sleet-accumulation");i||(i=document.createElement("div"),i.className="sleet-accumulation",i.style.cssText=`
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
            `,e.appendChild(i));let n=parseFloat(i.getAttribute("data-target-height")||"0");if(n>=Hi)return;let a=Math.min(Hi,n+.4);i.setAttribute("data-target-height",String(a)),window.AnimatedWeatherCardGsap.to(i,{scaleY:a/Hi,duration:.3,ease:"power2.out"})}async onStop(){this.pool?.stop(),this.pool=void 0;let e=this.element.querySelector(".animated-weather-card");e&&e.querySelectorAll(".sleet-accumulation").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),A(this.config.devMode,"Sleet animation stopped")}async onPause(){this.pool?.pause(),A(this.config.devMode,"Sleet animation paused")}async onResume(){this.pool?.resume(),A(this.config.devMode,"Sleet animation resumed")}};var na=[90,160];function Rr(o,t,e,i,n,a=!0){let r=document.createElement("div");r.className="leaf-gsap";let s=i.offsetWidth,l=i.offsetHeight,c=20+Math.random()*Math.max(40,l-40),d=Math.random(),h=d<.25,m=d>.8&&c>100;r.style.position="absolute",r.style.borderRadius="0 100% 0 100%",r.style.transformOrigin="center",r.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let p=(Math.random()*8+6)*e;r.style.width=r.style.height=p+"px";let g=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];r.style.background=g[Math.floor(Math.random()*g.length)];let u=-p-10,f=s+(a?60+Math.random()*80:p+10),w=(na[0]+Math.random()*(na[1]-na[0]))*Pt(t.windSpeed)*(h?.6:1),_=(f-u)/w,v=Math.min(_,(s-u)/w),b=m?-(60+Math.random()*80):h?80+Math.random()*80:(Math.random()-.5)*80;window.AnimatedWeatherCardGsap.set(r,{x:u,y:c,rotation:Math.random()*360,opacity:0}),o.appendChild(r);let y=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),n&&n(r)}});return y.to(r,{opacity:.85,duration:.25,ease:"power1.out"},0).to(r,{x:f,duration:_,ease:"none"},0).to(r,{y:c+b,duration:_,ease:h?"sine.in":"sine.inOut"},0).to(r,{rotation:`+=${120+Math.random()*180}`,duration:_,ease:"none"},0),a&&_>v&&y.to(r,{opacity:0,duration:_-v,ease:"power1.in"},v),r}function Nr(o,t,e,i,n,a){let r=document.createElement("div");r.className="wind-swoosh-gsap";let s=Math.random(),l=s>.6,c=s>.8;r.style.position="absolute",r.style.height=(c?2:1)*e+"px",r.style.borderRadius=l?"2px 1px":"1px",r.style.transformOrigin="left center",r.style.zIndex="10";let d=n.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";r.style.background=`linear-gradient(90deg, transparent 0%, ${d} 50%, transparent 100%)`;let h=Math.max(15,(20+Math.random()*60)*e);r.style.width=h+"px";let m=i.offsetWidth,p=i.offsetHeight,g=p*.15+Math.random()*(p*.7);window.AnimatedWeatherCardGsap.set(r,{x:-h,y:g,rotation:l?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),o.appendChild(r);let f=(m+h*2)/(Ml*Pt(t.windSpeed));return window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),a&&a(r)}}).to(r,{scaleX:1,opacity:c?.35:.22,duration:.3,ease:"power2.out"},0).to(r,{x:m+h,rotation:l?g>p/2?5:-5:0,duration:f,ease:"none"},0).to(r,{opacity:0,scaleX:.3,duration:Math.min(.5,f*.3)},f-Math.min(.5,f*.3)),r}var Ml=230,Pl=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function Pt(o){return Math.min(2.2,Math.max(.6,Math.sqrt(o/me.windSpeed)))}var Ll=12;function Ol(o){let t=Math.round(70*o),e=Math.round(35*o);return{width:t,height:Math.round(26*o),puffs:[{x:Math.round(9*o),y:Math.round(-22*o),size:Math.round(44*o)},{x:t-Math.round(9*o)-e,y:Math.round(-13*o),size:e}]}}var $r=o=>o>0?Math.ceil(o*3)+1:0,zr=new Map;function Fl(o,t,e,i){let n=[o,t,e,i].join(","),a=zr.get(n);if(a)return a;let r=$r(e),s=Math.ceil((o+2*r)*i),l=Math.ceil((t+2*r)*i),c=()=>{let p=document.createElement("canvas");return p.width=s,p.height=l,[p,p.getContext("2d")]},d=null,[h,m]=c();if(m){let[p,g,u]=[r*i,r*i,Math.min(50,o/2,t/2)*i],[f,w]=[p+o*i,g+t*i];if(m.fillStyle="#000",m.beginPath(),m.moveTo(p+u,g),m.arcTo(f,g,f,w,u),m.arcTo(f,w,p,w,u),m.arcTo(p,w,p,g,u),m.arcTo(p,g,f,g,u),m.closePath(),m.fill(),e>0){let[_,v]=c();v&&(v.shadowColor="#000",v.shadowBlur=2*e*i,v.shadowOffsetX=s,v.drawImage(h,-s,0),d=_.toDataURL())}else d=h.toDataURL()}return d&&zr.set(n,d),d}function ri(o){o.querySelectorAll(".cloud-track, .cloud-gsap").forEach(t=>{window.AnimatedWeatherCardGsap?.killTweensOf(t),t.remove()})}function Dl(o){return Math.min(1,Math.max(.5,o/160))||1}function Ir(o,t,e,i,n){let a=i.offsetWidth,r=i.offsetHeight,s=Pl,l=Pt(t.windSpeed),c=[],d=e||t.cloudCount,h=Dl(r);return s.forEach((m,p)=>{let g=Math.ceil(p===0||p===1?d*.4:d*.6);for(let u=1;u<=g;u++){let f=document.createElement("div");f.className=`cloud-gsap cloud-gsap-${m.name}-${u}`;let w=t.cloudBaseSize*m.scale,_=1+(u-1)*.15,v=Math.max(.3,Math.min(2.5,w))*_*h,b=Ol(v);f.style.position="absolute",f.style.opacity=m.opacity.toString(),f.style.zIndex=(10+p).toString();let y=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][p],C=n?.color_palette==="theme"?0:m.blur,S=[{x:0,y:0,width:b.width,height:b.height},...b.puffs.map($=>({x:$.x,y:$.y,width:$.size,height:$.size}))],k=Math.min(3,Math.max(1,window.devicePixelRatio||1)),T=S.map($=>Fl($.width,$.height,C,k)),x=T.every(Boolean),E=x?$r(C):0;if(f.style.width=b.width+"px",f.style.height=b.height+"px",x)f.classList.add("cloud-masked"),S.forEach(($,Z)=>{let j=document.createElement("div");j.style.position="absolute",j.style.left=$.x-E+"px",j.style.top=$.y-E+"px",j.style.width=$.width+2*E+"px",j.style.height=$.height+2*E+"px",j.style.background=y;for(let se of["-webkit-",""])j.style.setProperty(`${se}mask-image`,`url("${T[Z]}")`),j.style.setProperty(`${se}mask-size`,"100% 100%"),j.style.setProperty(`${se}mask-repeat`,"no-repeat");f.appendChild(j)});else{f.style.borderRadius="50px",f.style.background=y,C>0&&(f.style.filter=`blur(${C}px)`);for(let $ of b.puffs){let Z=document.createElement("div");Z.style.position="absolute",Z.style.left=$.x+"px",Z.style.top=$.y+"px",Z.style.width=$.size+"px",Z.style.height=$.size+"px",Z.style.borderRadius="50px",Z.style.background=y,f.appendChild(Z)}}let M=b.width+2*E,D=[[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][p][u-1]||15+p*10,H=Math.max(150+p*50,M+Ll),W=m.speed*l*(.9+Math.random()*.2),z=(a+2*H)/W,V=document.createElement("div");V.className="cloud-track",V.appendChild(f),window.AnimatedWeatherCardGsap.set(f,{opacity:m.opacity}),window.AnimatedWeatherCardGsap.set(V,{xPercent:0,x:-H,y:r*D/100}),o.appendChild(V);let _e=window.AnimatedWeatherCardGsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5});_e.fromTo(V,{xPercent:0,x:-H},{xPercent:100,x:H,duration:z,ease:"none"}),_e.progress(Math.random()),c.push(_e)}}),c}function Gr(o){let t=o.querySelector(".snow-accumulation");t&&(window.AnimatedWeatherCardGsap?window.AnimatedWeatherCardGsap.to(t,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{t.parentNode&&t.parentNode.removeChild(t)}}):t.parentNode?.removeChild(t))}function Br(o,t,e,i,n){let a=document.createElement("div");a.className=`fog-layer fog-layer-${e}`;let r=i.offsetWidth,s=i.offsetHeight,l=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],c=l[e]||l[2],d=n.custom_colors?.fog_color,h=n.color_palette==="default"?ni(d)?d:"#e0e0e0":"var(--secondary-text-color)",m=3+Math.floor(Math.random()*3),p=r*c.scale;a.style.cssText=`
        position: absolute;
        top: ${20+e*15}%;
        left: -50%;
        width: ${p}px;
        height: ${c.height}px;
        opacity: ${c.opacity};
        filter: blur(${c.blur}px);
        pointer-events: none;
        z-index: ${5+e};
        overflow: visible;
    `;for(let C=0;C<m;C++){let S=document.createElement("div"),k=p/m*(2+Math.random()*1.2),T=c.height*(1.2+Math.random()*1.6),x=p/m*C-k*.3,E=(Math.random()-.5)*(c.height*.5);S.style.cssText=`
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
        `,a.appendChild(S)}o.appendChild(a);let g=t.windSpeed*(.5+Math.random()*.5),u=15/c.speed,f=Math.max(8,u/g),w=r*c.scale,_=-w,v=r+w;window.AnimatedWeatherCardGsap.set(a,{x:_,opacity:c.opacity});let b=window.AnimatedWeatherCardGsap.timeline({repeat:-1,delay:e*2+Math.random()*3});b.to(a,{x:v,duration:f,ease:"none",onComplete:()=>{window.AnimatedWeatherCardGsap.set(a,{x:_})}});let y=window.AnimatedWeatherCardGsap.timeline({repeat:-1,yoyo:!0});return y.to(a,{opacity:c.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:b,opacity:y}}function Ri(o){o.querySelectorAll(".fog-layer").forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)})}var Wl=3,Hl=2,qr=[900,1400],Vr=[1800,2600],Ni=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=a,this.windConfig={leafCount:3,swooshEnabled:!0,...i},A(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(F(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(F(300,900)),A(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(e){let i=J(this.cardConfig,this.realWindSpeed);this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let n=Math.max(1,Math.round(Wl*i.leafCount));if(this.leaves.size<n){let a=Rr(this.layer(),i,1,this.card(),r=>this.forget(r,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(a),this.addParticle(a)}this.scheduleLeaf(F(qr[0],qr[1])/Math.max(.5,i.leafCount))},e)}scheduleSwoosh(e){let i=J(this.cardConfig,this.realWindSpeed);this.swooshTimer=setTimeout(()=>{if(this.state==="active"){if(this.swooshes.size<Hl){let n=Nr(this.layer(),i,1,this.card(),this.cardConfig,a=>this.forget(a,this.swooshes));this.swooshes.add(n),this.addParticle(n)}this.scheduleSwoosh(F(Vr[0],Vr[1]))}},e)}forget(e,i){i.delete(e),this.removeParticle(e)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(i=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(i),i.remove()}),this.leaves.clear(),this.swooshes.clear(),A(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),Li(this.layer()),A(this.config.devMode,"Wind animation paused")}async onResume(){Oi(this.layer()),this.clearTimers(),this.scheduleLeaf(F(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(F(600,1500)),A(this.config.devMode,"Wind animation resumed")}};var oi=[6e3,18e3],zl=[1500,6e3],Yr=.16,$i=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=a,this.lightningConfig={disableShake:n.disable_lightning_shake||!1,minInterval:oi[0],maxInterval:oi[1],...i},A(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start lightning animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Lightning layer not found: ${this.layerSelector}`);e.style.opacity="0";let[i,n]=zl;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},i+Math.random()*(n-i)),this.addTimeout(this.flashTimeout),A(this.config.devMode,"Lightning animation started")}flash(){if(!window.AnimatedWeatherCardGsap||this.state!=="active")return;let e=this.element.querySelector(this.layerSelector),i=this.element.querySelector(".animated-weather-card");if(!e||!i)return;let n=i.offsetWidth,a=i.offsetHeight,r=parseFloat(i.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let l=document.createElementNS("http://www.w3.org/2000/svg","path"),c=30+Math.random()*(n-60),d=20*r,h=20,m=[c+",0"];for(let f=0;f<h;f++){let w=c+(Math.random()*d-d/2),_=a/h*(f+1);m.push(w+","+_)}l.setAttribute("d","M"+m.join(" L"));let p=this.element.timeOfDayManager,g=ai("lightning",p,"white");l.setAttribute("stroke",g),l.setAttribute("stroke-width",((2+Math.random()*2)*r).toString()),l.setAttribute("fill","none"),s.appendChild(l),e.appendChild(s);let u=window.AnimatedWeatherCardGsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=u,u.set(e,{opacity:.9},0).to(e,{opacity:.3,duration:.06,ease:"none"},0).to(e,{opacity:.8,duration:.04,ease:"none"},.06).to(e,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let f=-6*r;u.to(i,{y:f,duration:.06,ease:"power2.out"},Yr).to(i,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Yr+.06)}}scheduleNext(){if(this.state!=="active")return;let e=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},e),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let e=this.element.querySelector(".animated-weather-card");e&&window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.set(e,{clearProps:"transform"});let i=this.element.querySelector(this.layerSelector);i&&(i.querySelectorAll("svg").forEach(a=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(a.querySelector("path")),a.parentNode&&a.parentNode.removeChild(a)}),i.style.opacity="0"),A(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),A(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),A(this.config.devMode,"Lightning animation resumed")}};var Rl=["dawn","day","dusk","night"],si=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],Nl={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},jr=(o,t,e)=>Math.min(t,Math.max(o,e)),je=(o,t,e)=>o+(t-o)*e;function $l(o,t,e){let i=(t-o+540)%360-180;return(o+i*e+360)%360}function We(o,t,e){let i=([u,f,w])=>[u,f*Math.cos(w*Math.PI/180),f*Math.sin(w*Math.PI/180)],[n,a,r]=i(o),[s,l,c]=i(t),d=je(n,s,e),h=je(a,l,e),m=je(r,c,e),p=Math.hypot(h,m),g=p<1e-6?o[2]:(Math.atan2(m,h)*180/Math.PI+360)%360;return[d,p,g]}function aa([o,t,e]){let i=e*Math.PI/180,n=t*Math.cos(i),a=t*Math.sin(i),r=(o+.3963377774*n+.2158037573*a)**3,s=(o-.1055613458*n-.0638541728*a)**3,l=(o-.0894841775*n-1.291485548*a)**3;return[4.0767416621*r-3.3077115913*s+.2309699292*l,-1.2684380046*r+2.6097574011*s-.3413193965*l,-.0041960863*r-.7034186147*s+1.707614701*l]}var Il=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function Ce(o){let t=i=>i.every(n=>n>=-1e-4&&n<=1.0001),e=aa(o);if(!t(e)){let i=0,n=o[1];for(let a=0;a<24;a++){let r=(i+n)/2;t(aa([o[0],r,o[2]]))?i=r:n=r}e=aa([o[0],i,o[2]])}return e.map(i=>Il(jr(0,1,i)))}var Xr=o=>Math.round(jr(0,1,o)*255);function He(o){return"#"+o.map(t=>Xr(t).toString(16).padStart(2,"0")).join("")}function Ur(o,t){return`rgba(${o.map(Xr).join(", ")}, ${Number(t.toFixed(3))})`}function ra(o,t){return[.15+(o[0]-.15)*.42,o[1]*je(.75,.5,t),$l(o[2],262,.45)]}function Gl(o,t){let e=Nl[o],i=1-e.overcast*.7,n={top:e.top,mid:e.mid,bottom:e.bottom,glow:e.glow,glowAlpha:e.glowAlpha,scrimAlpha:je(.46,.28,e.overcast)};if(o==="clear-night"){if(t==="dawn"||t==="dusk"){let a=t==="dawn"?[.4,.09,20]:[.38,.1,40];return{...n,bottom:We(e.bottom,a,.45),glowAlpha:.2,scrimAlpha:.22}}return{...n,scrimAlpha:.2}}switch(t){case"night":return{top:ra(e.top,e.overcast),mid:ra(e.mid,e.overcast),bottom:ra(e.bottom,e.overcast),glow:[.86,.03,250],glowAlpha:je(.14,.06,e.overcast),scrimAlpha:.2};case"dusk":return{top:We(e.top,[e.top[0]*.8,.075,292],.5*i),mid:We(e.mid,[e.mid[0]*.88,.065,350],.42*i),bottom:We(e.bottom,[e.bottom[0]*.92,.115,52],.72*i),glow:We(e.glow,[.82,.13,58],i),glowAlpha:je(e.glowAlpha,.6,i*.6),scrimAlpha:n.scrimAlpha+.04};case"dawn":return{top:We(e.top,[e.top[0]*.95,e.top[1]*.85,262],.4*i),mid:We(e.mid,[e.mid[0]*.95,.05,330],.3*i),bottom:We(e.bottom,[e.bottom[0]*.95,.085,32],.62*i),glow:We(e.glow,[.88,.09,40],i),glowAlpha:je(e.glowAlpha,.5,i*.5),scrimAlpha:n.scrimAlpha+.04};default:return n}}function Bl(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function lt(o,t){let e=Gl(o,t);return{top:He(Ce(e.top)),mid:He(Ce(e.mid)),bottom:He(Ce(e.bottom)),glow:Ur(Ce(e.glow),e.glowAlpha),scrim:Ur(Ce(Bl(e.top)),e.scrimAlpha)}}var Lt=[.985,.006,250],Ii=.8,Zr=.55,Qr=.4,Gi={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},Jr={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},eo={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64};function Ot(o,t){let e=i=>`${Math.round(i*100)}%`;return`radial-gradient(${e(o.rx)} ${e(o.ry)} at ${e(o.cx)} ${e(o.cy)}, ${t}, transparent ${e(o.fade)})`}function to(){let o=[];for(let t of si)for(let e of Rl){let i=lt(t,e),n=e==="day"?`.animated-weather-card.${t}`:`.animated-weather-card.${t}[data-phase="${e}"]`;o.push(`${n} { --awc-sky-top: ${i.top}; --awc-sky-mid: ${i.mid}; --awc-sky-bottom: ${i.bottom}; --awc-sky-glow: ${i.glow}; --awc-sky-scrim: ${i.scrim}; }`)}return o.join(`
`)}function Ft(o,t,e){return o==null||!Number.isFinite(o)?e?"day":"night":o<-6?"night":o<6?t?"dawn":"dusk":"day"}var Xe=3.2,Dt="cubic-bezier(0.37, 0, 0.63, 1)",io={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},no=Object.keys(io),li=no.filter(o=>o.startsWith("--awc-sky-"));function ao(){return no.map(o=>`${o} ${Xe}s ${Dt}`).join(`,
            `)}var Kr=!1;function Wt(){if(Kr)return;Kr=!0;let o=globalThis.CSS;if(o?.registerProperty)for(let[t,e]of Object.entries(io))try{o.registerProperty({name:t,syntax:"<color>",inherits:!0,initialValue:e})}catch{}}var Bi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.cloudTimelines=[];this.startWindFactor=1;this.realWindSpeed=a,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...i},A(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start clouds animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");ri(e);let a=Math.min(6,Math.max(1,Math.round(i.cloudCount)));this.cloudsConfig.isPartlyCloudy&&(a=Math.max(1,Math.round(a*.6))),this.cloudTimelines=Ir(e,i,a,n,this.cardConfig),this.startWindFactor=Pt(i.windSpeed),A(this.config.devMode,`Clouds animation started with ${a} clouds`)}async onStop(){this.cloudTimelines.forEach(i=>{window.AnimatedWeatherCardGsap?.killTweensOf(i),i&&typeof i.kill=="function"&&i.kill()}),this.cloudTimelines=[];let e=this.element.querySelector(this.layerSelector);e&&ri(e),A(this.config.devMode,"Clouds animation stopped")}async onPause(){this.cloudTimelines.forEach(e=>{e&&typeof e.pause=="function"&&e.pause()}),A(this.config.devMode,"Clouds animation paused")}async onResume(){this.cloudTimelines.forEach(e=>{e&&typeof e.resume=="function"&&e.resume()}),A(this.config.devMode,"Clouds animation resumed")}onWindSpeedChange(){if(!window.AnimatedWeatherCardGsap)return;let e=J(this.cardConfig,this.realWindSpeed),i=Pt(e.windSpeed)/this.startWindFactor;this.cloudTimelines.forEach(n=>{window.AnimatedWeatherCardGsap.to(n,{timeScale:i,duration:Xe,ease:"sine.inOut",overwrite:!0})})}};var qi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=a,this.fogConfig={layerCount:3,...i},A(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start fog animation");let e=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!e)throw new Error("Fog container not found");let i=J(this.cardConfig,this.realWindSpeed),n=this.element.querySelector(".animated-weather-card");Ri(n),this.fogTimelines=[];for(let a=0;a<this.fogConfig.layerCount;a++){let r=Br(e,i,a,n,this.cardConfig);this.fogTimelines.push(r.movement),this.fogTimelines.push(r.opacity)}A(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(n=>{n&&typeof n.kill=="function"&&n.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer")?.forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),A(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(e=>{e&&typeof e.pause=="function"&&e.pause()}),A(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(e=>{e&&typeof e.resume=="function"&&e.resume()}),A(this.config.devMode,"Fog animation resumed")}};var ql=1/3,Vl=.35,Vi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=a,this.starsConfig={starCount:30,showMoon:!0,...i},A(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.AnimatedWeatherCardGsap)throw new Error("GSAP not loaded - cannot start stars animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Animation layer not found: ${this.layerSelector}`);let i=J(this.cardConfig,this.realWindSpeed);this.element.querySelector(".animated-weather-card")?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(s),s.remove()});let a=Math.max(15,Math.round(i.cloudCount*5)),r=document.createElement("div");r.className="stars-field";for(let s=0;s<a;s++){let l=document.createElement("div");l.className="star-gsap";let c=1+Math.random()*3,d=.3+Math.random()*.5;if(l.style.cssText=`
                width: ${c.toFixed(2)}px;
                height: ${c.toFixed(2)}px;
                left: ${(Math.random()*100).toFixed(2)}%;
                top: ${(Math.random()*70).toFixed(2)}%;
                opacity: ${d.toFixed(2)};
            `,Math.random()<ql){let h=3+Math.random()*4;l.classList.add("twinkle"),l.style.setProperty("--star-o",d.toFixed(2)),l.style.setProperty("--star-dim",(d*(1-Math.random()*Vl)).toFixed(2)),l.style.animationDuration=`${h.toFixed(2)}s`,l.style.animationDelay=`${(-Math.random()*h).toFixed(2)}s`}r.appendChild(l)}if(e.appendChild(r),this.addParticle(r),window.AnimatedWeatherCardGsap.fromTo(r,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"}),this.starsConfig.showMoon){let s=document.createElement("div");s.className="moon-gsap",e.appendChild(s),this.addParticle(s),window.AnimatedWeatherCardGsap.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"})}A(this.config.devMode,`Stars animation started with ${a} stars`)}async onStop(){let e=this.element.querySelector(this.layerSelector);e&&e.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(n=>{window.AnimatedWeatherCardGsap&&window.AnimatedWeatherCardGsap.killTweensOf(n),n.parentNode&&n.parentNode.removeChild(n)}),A(this.config.devMode,"Stars animation stopped")}setPaused(e){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(i=>i.classList.toggle("paused",e))}async onPause(){this.setPaused(!0),A(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),A(this.config.devMode,"Stars animation resumed")}};var Yi=class extends X{constructor(e,i,n,a){super(e,i,n);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";A(this.config.devMode,"SunAnimation created")}async onStart(){let e=this.element.querySelector(this.layerSelector);if(!e){A(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}e.style.opacity="1",A(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.opacity="0"),A(this.config.devMode,"Sun animation stopped")}async onPause(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.animationPlayState="paused"),A(this.config.devMode,"Sun animation paused")}async onResume(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.animationPlayState="running"),A(this.config.devMode,"Sun animation resumed")}};var Ui=class{constructor(t,e,i,n){this.activeAnimations=new Map;this.element=t,this.config=e,this.timeOfDayManager=i,this.realWindSpeed=n}async startModularAnimation(t,e){this.activeAnimations.has(t)&&await this.stopModularAnimation(t);try{let i={intensity:e,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1},n=null;switch(t){case"rain":n=new Di(this.element,{...i,isStorm:e>=2&&e<=4,isPouring:e>4,isLightRain:e<1,particleCount:Math.floor(e*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":n=new Wi(this.element,{...i,particleCount:Math.floor(e*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":n=new zi(this.element,{...i,particleCount:Math.floor(e*40)},this.config,this.realWindSpeed);break;case"wind":n=new Ni(this.element,{...i,leafCount:Math.max(1,Math.floor(e*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":n=new $i(this.element,{...i,disableShake:this.config.disable_lightning_shake||!1,minInterval:oi[0],maxInterval:oi[1]},this.config,this.realWindSpeed);break;case"clouds":n=new Bi(this.element,{...i,cloudCount:Math.max(1,Math.floor(e*2)),isPartlyCloudy:e<3},this.config,this.realWindSpeed);break;case"fog":n=new qi(this.element,{...i,layerCount:Math.max(2,Math.min(5,Math.floor(e)))},this.config,this.realWindSpeed);break;case"stars":n=new Vi(this.element,{...i,starCount:Math.max(15,Math.floor(e*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":n=new Yi(this.element,i,this.config);break;default:return A(this.config.dev_mode,`No modular animation registered for type: ${t}`),null}return await n.start(),this.activeAnimations.set(t,n),A(this.config.dev_mode,`Started modular ${t} animation with intensity ${e}`),n}catch(i){return console.error(`Failed to start modular ${t} animation:`,i),null}}async stopModularAnimation(t){let e=this.activeAnimations.get(t);if(e)try{await e.destroy(),A(this.config.dev_mode,`Stopped modular ${t} animation`)}catch(i){console.error(`Error stopping modular ${t} animation:`,i)}finally{this.activeAnimations.delete(t)}}async pauseModularAnimation(t){let e=this.activeAnimations.get(t);if(e&&e.isActive())try{await e.pause()}catch(i){console.error(`Error pausing modular ${t} animation:`,i)}}async resumeModularAnimation(t){let e=this.activeAnimations.get(t);if(e&&e.isPaused())try{await e.resume()}catch(i){console.error(`Error resuming modular ${t} animation:`,i)}}updateWindSpeed(t){if(!Object.is(t,this.realWindSpeed)){this.realWindSpeed=t;for(let[e,i]of this.activeAnimations)try{i.setWindSpeed(t)}catch(n){console.warn(`Failed to update wind speed for ${e}:`,n)}}}async cleanup(){let t=Array.from(this.activeAnimations.keys()).map(e=>this.stopModularAnimation(e));await Promise.all(t),this.activeAnimations.clear()}};var Ht=class{constructor(t,e,i,n){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.element=t,this.config=e,this.isPausedFn=i,this.timeOfDayManager=n,this.modularBridge=new Ui(t,e,n,this.currentWindSpeed),A(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(t){this.currentWindSpeed=t,this.modularBridge.updateWindSpeed(t)}async startAnimation(t,e){let i=this.animations[t];if(i.isActive){A(this.config.dev_mode,`Animation ${t} already active \u2014 skipping`);return}let n=e?.intensity??i.intensity??1,a=this.generation;i.isActive=!0,i.intensity=n,this.setAnimationLayerVisibility(t,!0);try{let r=await this.modularBridge.startModularAnimation(t,n);if(a!==this.generation){A(this.config.dev_mode,`Discarding stale start for ${t} (generation drifted)`),await this.modularBridge.stopModularAnimation(t);return}if(!r){i.isActive=!1,console.warn(`No modular animation available for type: ${t}`);return}A(this.config.dev_mode,`Started ${t} animation with intensity ${n}`)}catch(r){console.error(`Failed to start ${t} animation:`,r),i.isActive=!1}}async stopAnimation(t){let e=this.animations[t];if(e.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(t),A(this.config.dev_mode,`Stopped ${t} animation`)}catch(i){console.error(`Error stopping ${t} animation:`,i)}this.setAnimationLayerVisibility(t,!1),e.isActive=!1,e.isPaused=!1}}pauseAnimation(t){let e=this.animations[t];!e.isActive||e.isPaused||(e.isPaused=!0,this.modularBridge.pauseModularAnimation(t),A(this.config.dev_mode,`Paused ${t} animation`))}resumeAnimation(t){let e=this.animations[t];!e.isActive||!e.isPaused||(e.isPaused=!1,this.modularBridge.resumeModularAnimation(t),A(this.config.dev_mode,`Resumed ${t} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(t=>this.stopAnimation(t)))}pauseAllAnimations(){Object.keys(this.animations).forEach(t=>this.pauseAnimation(t))}resumeAllAnimations(){Object.keys(this.animations).forEach(t=>this.resumeAnimation(t))}async applyWeatherCondition(t){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let e=this.defaultWeatherMappings[t.toLowerCase()];if(!e){console.warn(`No animation mapping for weather condition: ${t}`);return}await Promise.all(e.animations.map(i=>{let n=e.overrides?.[i];return this.startAnimation(i,n)})),A(this.config.dev_mode,`Applied weather condition: ${t} with animations: ${e.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(t,e){let i=this.element.querySelector(".animated-weather-card");if(!i)return;let n=`individual-${t}-active`;e?i.classList.add(n):i.classList.remove(n)}clearIndividualAnimationClasses(){let t=this.element.querySelector(".animated-weather-card");if(t)for(let e of Object.keys(this.animations))t.classList.remove(`individual-${e}-active`)}};var Ki=o=>{if(o==null||o==="")return null;let t=typeof o=="number"?o:Number(o);return Number.isFinite(t)?t:null},ji=o=>typeof o=="string"?o.trim():"";function Yl(o){if(!o||typeof o!="object")return null;let t=o,e=typeof t.id=="number"?String(t.id):ji(t.id);return e?{id:e,label:ji(t.flight_number)||ji(t.callsign),aircraftCode:ji(t.aircraft_code),altitudeFt:Ki(t.altitude),groundSpeedKt:Ki(t.ground_speed),heading:Ki(t.heading),verticalSpeed:Ki(t.vertical_speed),onGround:t.on_ground===1||t.on_ground===!0||t.on_ground==="1"}:null}function ro(o,t){if(!o||!t)return null;let e=o.states[t];if(!e||e.state==="unavailable"||e.state==="unknown")return null;let i=e.attributes?.flights;if(!Array.isArray(i))return[];let n=[];for(let a of i){let r=Yl(a);r&&n.push(r)}return n}var Xi=class{constructor(){this.known=null}update(t){if(!t)return[];let e=t.filter(r=>!r.onGround),i=new Set(e.map(r=>r.id));if(this.known===null)return this.known=i,[];let n=[],a=new Set;for(let r of e)this.known.has(r.id)||a.has(r.id)||(a.add(r.id),n.push(r));return this.known=i,n}reset(){this.known=null}};var Zi=class{constructor(t={}){this.listeners=new Set;this.config={enableDayNightCycle:t.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...t},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(t){let e=this.config.enableDayNightCycle;this.config={...this.config,...t},this.updateState(),this.config.enableDayNightCycle&&!e?this.startAutoUpdate():!this.config.enableDayNightCycle&&e&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(t){this.listeners.add(t)}removeListener(t){this.listeners.delete(t)}getTimeAwareColor(t){let e=this.getCurrentState();if(!this.isEnabled())return t.day;switch(e.timePhase){case"dawn":return t.dawn||this.blendColors(t.night,t.day,.3);case"day":return t.day;case"dusk":return t.dusk||this.blendColors(t.day,t.night,.3);case"night":return t.night;default:return t.day}}setDevOverride(t){this.devTimePhaseOverride=t,this.updateState()}clearDevOverride(){this.devTimePhaseOverride=void 0,this.updateState()}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let t=new Date,e,i;if(!this.config.useBrowserTime&&this.config.timeZone){let s=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(t);e=parseInt(s.find(l=>l.type==="hour")?.value||"0",10),i=parseInt(s.find(l=>l.type==="minute")?.value||"0",10)}else e=t.getHours(),i=t.getMinutes();let n=e+i/60,a;if(this.devTimePhaseOverride)a=this.devTimePhaseOverride;else{let s=this.config.sunriseHour,l=this.config.sunsetHour,c=(s-1+24)%24,d=(s+.5)%24,h=(l-.5+24)%24,m=(l+1)%24,p=(g,u,f)=>u<=f?g>=u&&g<f:g>=u||g<f;p(n,c,d)?a="dawn":p(n,d,h)?a="day":p(n,h,m)?a="dusk":a="night"}let r={isDaytime:a==="day"||a==="dawn",isNighttime:a==="night"||a==="dusk",isDawn:a==="dawn",isDusk:a==="dusk",currentHour:e,timePhase:a};!this.currentState||this.currentState.timePhase!==r.timePhase?(this.currentState=r,this.notifyListeners(r)):this.currentState=r}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},Er.UPDATE_INTERVAL)}notifyListeners(t){this.listeners.forEach(e=>{try{e(t)}catch(i){console.error("TimeOfDayManager: Error in listener callback:",i)}})}blendColors(t,e,i){let n=t.replace("#",""),a=e.replace("#",""),r=parseInt(n.substring(0,2),16),s=parseInt(n.substring(2,4),16),l=parseInt(n.substring(4,6),16),c=parseInt(a.substring(0,2),16),d=parseInt(a.substring(2,4),16),h=parseInt(a.substring(4,6),16),m=Math.round(r*(1-i)+c*i),p=Math.round(s*(1-i)+d*i),g=Math.round(l*(1-i)+h*i),u=m.toString(16).padStart(2,"0"),f=p.toString(16).padStart(2,"0"),w=g.toString(16).padStart(2,"0");return`#${u}${f}${w}`}};var ct=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var Ul=to(),Kl=He(Ce(Lt)),oo=o=>`${Math.round(o*100)}%`,jl=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,Xl=48,oa=()=>`
${ct("animated-weather-card")}
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
          --awc-secondary: ${Ii};

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
            ${ao()};
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
          --awc-sky-glow-layer: ${Ot(Gi,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer),
            linear-gradient(180deg, transparent ${oo(Qr)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${oo(Zr)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${Ot(Jr,"var(--awc-sky-glow)")}; }
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
           last line; b and c, the hero's first line with the place. */
        .awc-clock { white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-clock-period[hidden] { display: none; }
        .awc-clock-date-long { display: none; }

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
        .main-weather-info > .awc-clock :is(.awc-clock-date, .awc-clock-date-long) {
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
        .animated-weather-card[data-clock-date="none"] .awc-clock-date { display: none; }
        /* Wide, beside the temperature at 48 px, the long date under it */
        @container awc (min-width: 640px) {
          .animated-weather-card[data-clock-place="beside"] .main-weather-info {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            grid-template-areas: "loc loc" "temp clock" "desc desc" "meta meta" "note note";
            column-gap: 32px;
            align-items: baseline;
            align-content: end;
          }
          .animated-weather-card[data-clock-place="beside"] .main-weather-info > * { grid-column: 1 / -1; }
          .animated-weather-card[data-clock-place="beside"] .main-weather-info > .temperature { grid-column: 1; }
          .animated-weather-card[data-clock-place="beside"] .main-weather-info > .awc-clock {
            --awc-clock-size: 48px;
            grid-column: 2;
            grid-row: 2;
            /* Its own width, not the column's: the fit measures it */
            justify-self: start;
            flex-direction: column;
            align-items: flex-start;
            row-gap: 6px;
            margin-top: 0;
          }
          .animated-weather-card[data-clock-place="beside"] .main-weather-info > .awc-clock .awc-clock-period { margin-left: 0.32em; }
          .animated-weather-card[data-clock-place="beside"] .main-weather-info > .awc-clock > :is(.awc-clock-time) { display: inline; }
          .animated-weather-card[data-clock-place="beside"] .awc-clock-date { display: none; }
          .animated-weather-card[data-clock-place="beside"] .awc-clock-date-long { display: block; }
        }
        .animated-weather-card.theme-colors .main-weather-info > .awc-clock { color: var(--secondary-text-color); }

        /* b and c: the hero's first line, the time and the date with the
           place after them. It's the location's line, so it shows and goes
           with it (tight drops it). Full strength: its right end reaches
           into the light, where the tint fails; capped so it never meets
           the sun. Whole parts or nothing: the place goes first, then the
           date (applySizeState), never the time. */
        .location.awc-headline {
          display: flex;
          align-items: baseline;
          opacity: 1;
          max-width: calc(66cqi - var(--awc-pad));
          text-overflow: clip;
        }
        .awc-headline .awc-clock { display: inline-flex; align-items: baseline; }
        .awc-headline-sep { margin: 0 6px; opacity: 0.6; }
        .awc-headline .awc-clock-date::before { content: '\xB7'; margin: 0 6px; opacity: 0.6; }
        .awc-headline-place { font-weight: 400; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .awc-headline .awc-clock-date { font-weight: 400; }
        .animated-weather-card[data-headline="time-date"] .awc-headline :is(.awc-headline-sep, .awc-headline-place),
        .animated-weather-card[data-headline="time"] .awc-headline :is(.awc-headline-sep, .awc-headline-place, .awc-clock-date) { display: none; }
        /* b: at the location's own size, the time in its weight */
        .awc-headline[data-clock="b"] .awc-clock-time { font-weight: 600; letter-spacing: -0.01em; }
        .awc-headline[data-clock="b"] .awc-clock-period { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }
        /* c: the time at 0.3\xD7 the temperature, so the ratio never changes;
           the date only from 460 px, where wall and bedside frames live */
        .awc-headline[data-clock="c"] {
          --awc-clock-size: 24px;
          gap: 0;
          max-width: calc(62cqi - var(--awc-pad));
        }
        .awc-headline[data-clock="c"] .awc-clock { margin-right: 12px; }
        .awc-headline[data-clock="c"] .awc-clock-time {
          font-family: var(--awc-font-display);
          font-size: var(--awc-clock-size);
          line-height: 1;
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        .awc-headline[data-clock="c"] .awc-clock-period { font-size: calc(var(--awc-clock-size) * 0.5); font-weight: 500; letter-spacing: 0.04em; margin-left: 0.2em; }
        .awc-headline[data-clock="c"] .awc-clock-date { display: none; }
        .awc-headline[data-clock="c"] .awc-headline-sep { display: none; }
        .awc-headline[data-clock="c"] .awc-headline-place { font-weight: 500; opacity: 0.94; }
        @container awc (max-width: 319px) {
          .awc-headline[data-clock="c"] { --awc-clock-size: 19px; }
          .awc-headline[data-clock="c"] .awc-clock-time { font-weight: 400; }
        }
        @container awc (min-width: 460px) {
          .awc-headline[data-clock="c"] { --awc-clock-size: 29px; }
          .awc-headline[data-clock="c"] .awc-clock-date { display: inline; font-size: 16px; }
          .awc-headline[data-clock="c"] .awc-clock-date::before { content: none; }
          .awc-headline[data-clock="c"] .awc-clock-date + * { margin-left: 0; }
          .awc-headline[data-clock="c"] .awc-headline-sep { display: inline; }
        }
        @container awc (min-width: 640px) { .awc-headline[data-clock="c"] { --awc-clock-size: 36px; max-width: none; } }
        .animated-weather-card:is([data-height="short"], [data-height="snug"]) .awc-headline[data-clock="c"] { --awc-clock-size: 18px; }
        .animated-weather-card:is([data-height="short"], [data-height="snug"]) .awc-headline[data-clock="c"] .awc-clock-time { font-weight: 400; }
        .animated-weather-card.theme-colors .awc-headline .awc-clock-time { color: var(--primary-text-color); }
        .animated-weather-card.theme-colors .awc-headline :is(.awc-clock-period, .awc-clock-date, .awc-headline-place, .awc-headline-sep) { color: var(--secondary-text-color); }

        /* \u2500\u2500 Forecast (forecast) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Between the hero and the metrics, kept with them at the foot. Its
           drawing comes with the forecast bundle; until it and the forecast
           are in, its place is held at the size it'll take. */
        .awc-forecast { position: relative; flex-shrink: 0; margin-top: auto; }
        .animated-weather-card .awc-forecast ~ .weather-attributes { margin-top: 0; }
        .awc-forecast[data-pending][data-variant="a"] { height: 67px; }
        .awc-forecast[data-pending][data-variant="b"] { height: 122px; }
        .awc-forecast[data-pending][data-variant="c"] { height: 96px; }
        .animated-weather-card[data-forecast="none"] .awc-forecast,
        .awc-forecast[hidden] { display: none; }
        /* Wide: under the hero, in the hero's column; the metrics keep theirs */
        @container awc (min-width: 640px) {
          .weather-info:has(> .awc-forecast) {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            grid-template-rows: minmax(0, 1fr) auto;
            column-gap: 40px;
            align-items: end;
          }
          .weather-info:has(> .awc-forecast) > .main-weather-info { grid-column: 1; grid-row: 1; min-height: 0; }
          .weather-info:has(> .awc-forecast) > .awc-forecast { grid-column: 1; grid-row: 2; margin-top: 20px; }
          .weather-info:has(> .awc-forecast) > .weather-attributes { grid-column: 2; grid-row: 1 / span 2; align-self: end; }
          .animated-weather-card[data-forecast="none"] .weather-info:has(> .awc-forecast) > .main-weather-info { grid-row: 1 / span 2; }
        }
        .animated-weather-card[data-forecast="none"] .awc-forecast ~ .weather-attributes { margin-top: auto; }
        .awc-hl[hidden] { display: none; }
        /* Today's high and low on the condition's line: no height of its own,
           a line of its own only where it has to wrap (and the fit lets it).
           Narrow, the line stops short of the light, where its full-strength
           text would fall under 4.5:1. */
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
          --awc-sky-glow-layer: ${Ot(eo,"var(--awc-sky-glow)")};
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
          transition: opacity ${Xe/2}s ${Dt};
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
          transition: transform ${Xe}s ${Dt};
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

`;var Zl={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function Ql(o,t){try{let e=o.formatEntityState?.(t);if(e&&e!==t.state)return e}catch{}return kt(Zl,t.state)||t.state}var Jl=180;function lo(o,t){let e=t.note_entity?o?.states[t.note_entity]:void 0;if(!e)return null;let i=s=>typeof s=="string"?s.trim():"",n=e.state==="unknown"||e.state==="unavailable"?"":i(e.state),a=i(e.attributes?.[t.note_attribute||"note"]);if(!n&&!a)return null;let r=Date.parse(e.attributes?.generated_at);return{line:n||a,note:a||n,writtenAt:Number.isNaN(r)?null:r}}function co(o,t){let e=Number(t.note_max_age??Jl);return o.writtenAt===null||!(e>0)?null:o.writtenAt+e*6e4}function sa(o,t,e){if(t.dev_mode){let i=ec(t,e);if(o&&t.sun_entity){let n=o.states[t.sun_entity];n&&(i.sun={sunrise:n.attributes.next_rising||null,sunset:n.attributes.next_setting||null,dawn:n.attributes.next_dawn||null,dusk:n.attributes.next_dusk||null,noon:n.attributes.next_noon||null,elevation:n.attributes.elevation??null,aboveHorizon:n.state==="above_horizon"})}return i}return o?ic(o,t):{temperature:"--",weatherCondition:"",location:t.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--"}}function ec(o,t){let n=Xn[t||"sunny"]||"22",a=ho(o)?st(parseFloat(n),void 0,1):n,r=o.name||"",s=Ct.humidity,l=Ct.windSpeed,c=parseFloat(l.split(" ")[0])||15,d=Ct.pressure,m=Zn[t||"sunny"]||t||"sunny",p=Ct.indoorTemperature,g=Ct.indoorHumidity,u=new Date,f=new Date(u.getFullYear(),u.getMonth(),u.getDate(),6,14),w=new Date(u.getFullYear(),u.getMonth(),u.getDate(),18,32),_=new Date(u.getFullYear(),u.getMonth(),u.getDate(),5,45),v=new Date(u.getFullYear(),u.getMonth(),u.getDate(),19,1),b=new Date(u.getFullYear(),u.getMonth(),u.getDate(),12,23),y=Date.now(),C={sunrise:f.toISOString(),sunset:w.toISOString(),dawn:_.toISOString(),dusk:v.toISOString(),noon:b.toISOString(),elevation:42.5,aboveHorizon:y>=f.getTime()&&y<=w.getTime()};return{temperature:a,weatherCondition:m,location:r,humidity:s,windSpeed:l,windSpeedValue:c,windBearing:null,pressure:d,pressureValue:null,feelsLike:null,indoorTemperature:p,indoorHumidity:g,sun:C}}var tc={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function so(o){let t=typeof o=="number"?o:typeof o=="string"?parseFloat(o):NaN;return isFinite(t)?(t%360+360)%360:typeof o=="string"?tc[o.trim().toUpperCase()]??null:null}function ho(o){return Number(o.temperature_decimals)===1?1:0}function ic(o,t){if(!t.entity)throw new Error("Weather entity is required");let e=o.states[t.entity];if(!e)throw new Error(`Entity ${t.entity} not found`);let i;if(t.outdoor_sensor_entity){let x=o.states[t.outdoor_sensor_entity];x&&x.state&&!isNaN(parseFloat(x.state))?i=parseFloat(x.state):i=e.attributes.temperature}else i=e.attributes.temperature;let n=ho(t),a=x=>st(n?x:Math.round(x),o,n),r=i!=null&&!isNaN(i)?a(i):"--",s=Ql(o,e),l=t.name||e.attributes.friendly_name||"",c=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?st(Math.round(E),o)+"%":null},d="--";if(t.humidity_sensor_entity){let x=o.states[t.humidity_sensor_entity];d=x&&c(x.state)||c(e.attributes.humidity)||"--"}else d=c(e.attributes.humidity)||"--";let h="--",m=10,p=(x,E)=>{let M=typeof x=="number"?x:parseFloat(x);return isFinite(M)?(m=Or(M,E||"km/h"),h=st(Math.round(M),o)+" "+(E||"km/h"),!0):!1},g=t.wind_speed_sensor_entity?o.states[t.wind_speed_sensor_entity]:void 0;g&&p(g.state,g.attributes?.unit_of_measurement)||p(e.attributes.wind_speed,e.attributes.wind_speed_unit);let u=t.wind_direction_sensor_entity?o.states[t.wind_direction_sensor_entity]:void 0,f=so(u?.state)??so(e.attributes.wind_bearing),w=(x,E)=>{let M=typeof x=="number"?x:parseFloat(x);if(!isFinite(M))return null;let L=E.toLowerCase()==="inhg"?2:0;return st(M,o,L)+" "+E},_=x=>{let E=typeof x=="number"?x:parseFloat(x);return isFinite(E)?E:null},v="--",b=null;if(t.pressure_sensor_entity){let x=o.states[t.pressure_sensor_entity];if(x){let E=x.attributes.unit_of_measurement||"hPa",M=w(x.state,E);M&&(v=M,b=_(x.state))}if(v==="--"&&e.attributes.pressure!==void 0){let E=e.attributes.pressure_unit||"hPa";v=w(e.attributes.pressure,E)||"--",b=_(e.attributes.pressure)}}else if(e.attributes.pressure!==void 0){let x=e.attributes.pressure_unit||"hPa";v=w(e.attributes.pressure,x)||"--",b=_(e.attributes.pressure)}let y=null,C;if(t.feels_like_entity&&(C=o.states[t.feels_like_entity]?.state),C===void 0&&e.attributes.apparent_temperature!==void 0&&(C=e.attributes.apparent_temperature),C!==void 0){let x=typeof C=="number"?C:parseFloat(C);isFinite(x)&&(y=a(x)+"\xB0")}let S="--";if(t.indoor_temperature_entity){let x=o.states[t.indoor_temperature_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(S=a(parseFloat(x.state))+"\xB0")}let k="--";if(t.indoor_humidity_entity){let x=o.states[t.indoor_humidity_entity];x&&x.state&&!isNaN(parseFloat(x.state))&&(k=st(Math.round(parseFloat(x.state)),o)+"%")}let T;if(t.sun_entity){let x=o.states[t.sun_entity];x&&(T={sunrise:x.attributes.next_rising||null,sunset:x.attributes.next_setting||null,dawn:x.attributes.next_dawn||null,dusk:x.attributes.next_dusk||null,noon:x.attributes.next_noon||null,elevation:x.attributes.elevation??null,aboveHorizon:x.state==="above_horizon"})}return{temperature:r,weatherCondition:s,location:l,humidity:d,windSpeed:h,windSpeedValue:m,windBearing:f,pressure:v,pressureValue:b,feelsLike:y,indoorTemperature:S,indoorHumidity:k,sun:T}}var la={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note",now:"Now",today:"Today",high_short:"H",low_short:"L",high:"High",low:"Low",rain:"Rain",snow:"Snow",sleet:"Sleet",hail:"Hail",storms:"Storms",dry:"Dry",chance:"{percent} chance",forecast:"Forecast",more_info:"History and settings",close:"Close",next_hours:"Next hours",next_days:"Next days"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben",now:"Jetzt",today:"Heute",high_short:"H",low_short:"T",high:"H\xF6chstwert",low:"Tiefstwert",rain:"Regen",snow:"Schnee",sleet:"Schneeregen",hail:"Hagel",storms:"Gewitter",dry:"Trocken",chance:"{percent} Wahrscheinlichkeit",forecast:"Vorhersage",more_info:"Verlauf und Einstellungen",close:"Schlie\xDFen",next_hours:"N\xE4chste Stunden",next_days:"N\xE4chste Tage"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota",now:"Ahora",today:"Hoy",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Lluvia",snow:"Nieve",sleet:"Aguanieve",hail:"Granizo",storms:"Tormentas",dry:"Seco",chance:"{percent} de probabilidad",forecast:"Pron\xF3stico",more_info:"Historial y ajustes",close:"Cerrar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos d\xEDas"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note",now:"Maint.",today:"Auj.",high_short:"Max",low_short:"Min",high:"Maximale",low:"Minimale",rain:"Pluie",snow:"Neige",sleet:"Neige fondue",hail:"Gr\xEAle",storms:"Orages",dry:"Sec",chance:"{percent} de probabilit\xE9",forecast:"Pr\xE9visions",more_info:"Historique et param\xE8tres",close:"Fermer",next_hours:"Prochaines heures",next_days:"Prochains jours"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota",now:"Ora",today:"Oggi",high_short:"Max",low_short:"Min",high:"Massima",low:"Minima",rain:"Pioggia",snow:"Neve",sleet:"Nevischio",hail:"Grandine",storms:"Temporali",dry:"Asciutto",chance:"{percent} di probabilit\xE0",forecast:"Previsioni",more_info:"Cronologia e impostazioni",close:"Chiudi",next_hours:"Prossime ore",next_days:"Prossimi giorni"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven",now:"Nu",today:"Vandaag",high_short:"H",low_short:"L",high:"Hoogste",low:"Laagste",rain:"Regen",snow:"Sneeuw",sleet:"Natte sneeuw",hail:"Hagel",storms:"Onweer",dry:"Droog",chance:"{percent} kans",forecast:"Verwachting",more_info:"Geschiedenis en instellingen",close:"Sluiten",next_hours:"Komende uren",next_days:"Komende dagen"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki",now:"Teraz",today:"Dzi\u015B",high_short:"Maks",low_short:"Min",high:"Maksymalna",low:"Minimalna",rain:"Deszcz",snow:"\u015Anieg",sleet:"Deszcz ze \u015Bniegiem",hail:"Grad",storms:"Burze",dry:"Sucho",chance:"{percent} szans",forecast:"Prognoza",more_info:"Historia i ustawienia",close:"Zamknij",next_hours:"Najbli\u017Csze godziny",next_days:"Najbli\u017Csze dni"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota",now:"Agora",today:"Hoje",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Chuva",snow:"Neve",sleet:"Chuva e neve",hail:"Granizo",storms:"Trovoadas",dry:"Seco",chance:"{percent} de probabilidade",forecast:"Previs\xE3o",more_info:"Hist\xF3rico e defini\xE7\xF5es",close:"Fechar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos dias"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota",now:"Acum",today:"Azi",high_short:"Max",low_short:"Min",high:"Maxima",low:"Minima",rain:"Ploaie",snow:"Ninsoare",sleet:"Lapovi\u021B\u0103",hail:"Grindin\u0103",storms:"Furtuni",dry:"Uscat",chance:"{percent} probabilitate",forecast:"Prognoz\u0103",more_info:"Istoric \u0219i set\u0103ri",close:"\xCEnchide",next_hours:"Orele urm\u0103toare",next_days:"Zilele urm\u0103toare"}};function dt(o){return o?.locale?.language||o?.language||"en"}function ze(o){return`${dt(o)}|${o?.locale?.time_format??""}|${ci(o)??""}`}function ci(o){if(o?.locale?.time_zone!=="server")return;let t=o.config?.time_zone;if(t)try{return new Intl.DateTimeFormat("en",{timeZone:t}),t}catch{return}}function Te(o,t,e={}){let i=dt(o).toLowerCase();return(la[i]?.[t]??la[i.split("-")[0]]?.[t]??la.en[t]).replace(/\{(\w+)\}/g,(a,r)=>e[r]??"")}function nc(o){let t=o?.locale;if(!t?.time_format)return;if(t.time_format==="12")return!0;if(t.time_format==="24")return!1;let e=t.time_format==="language"?dt(o):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(e).includes("10")}catch{return}}function ht(o,t){if(!o)return"--";let e=new Date(o);if(isNaN(e.getTime()))return"--";try{return uo(t,{hour:"numeric",minute:"2-digit"}).format(e)}catch{return e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function uo(o,t){let e=nc(o),i={...t,timeZone:ci(o)};return e!==void 0&&(i.hourCycle=e?"h12":"h23"),new Intl.DateTimeFormat(o?dt(o):void 0,i)}function mo(o,t){try{let e=uo(t,{hour:"numeric",minute:"2-digit"}).formatToParts(o),i=e.filter(a=>a.type==="dayPeriod").map(a=>a.value).join("");return{time:e.filter(a=>a.type!=="dayPeriod").map(a=>a.value).join("").trim(),period:i}}catch{return{time:o.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),period:""}}}function ca(o,t,e={weekday:"long",day:"numeric",month:"long"}){try{return new Intl.DateTimeFormat(t?dt(t):void 0,{...e,timeZone:ci(t)}).format(o)}catch{return o.toDateString()}}function po(o,t,e=!1){let i=t?dt(t):void 0,n=e?{weekday:"short",day:"numeric",month:"short",timeZone:ci(t)}:{weekday:"short",day:"numeric",timeZone:ci(t)};try{let a=new Intl.DateTimeFormat(i,n);if(!e&&(i??"en").toLowerCase().startsWith("en")){let r=a.formatToParts(o),s=r.find(c=>c.type==="weekday")?.value??"",l=r.find(c=>c.type==="day")?.value??"";return`${s} ${l}`.trim()}return a.format(o)}catch{return o.toDateString()}}function da(o,t){let e=Math.round(Math.abs(o)*60),i=Math.floor(e/60),n=e%60,a=Intl.DurationFormat;if(a&&t)try{return new a(dt(t),{style:"narrow"}).format(i>0?{hours:i,minutes:n}:{minutes:n})}catch{}return i>0?`${i}h ${n}m`:`${n}m`}function di(o,t){let e=o.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return e?`${P(e[1])}<span class="${t}">${P(e[2])}</span>`:P(o)}function ha(o){return o&&typeof o=="object"&&typeof o.action=="string"?o:void 0}function Rt(o,t){return{entity:t,tap_action:ha(o?.tap_action),hold_action:ha(o?.hold_action),double_tap_action:ha(o?.double_tap_action)}}function zt(o){return!!o&&o.action!=="none"}function fo(o){return o.tap_action?zt(o.tap_action):!!o.entity}function hi(o,t,e,i={}){let n=t[`${e}_action`],a=n&&Object.prototype.hasOwnProperty.call(i,n.action)?i[n.action]:void 0;if(a){a(e);return}if(e==="tap"&&!n){t.entity&&o.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t.entity},bubbles:!0,composed:!0}));return}zt(n)&&o.dispatchEvent(new CustomEvent("hass-action",{detail:{config:t,action:e},bubbles:!0,composed:!0}))}function Nt(o,t,e,i={}){if(o.dataset.actionsBound)return;o.dataset.actionsBound="1";let n=null,a=!1,r,s,l=()=>{clearTimeout(r),r=void 0},c=()=>{n=null,l()},d=()=>{zt(e().double_tap_action)?s?(clearTimeout(s),s=void 0,hi(t,e(),"double_tap",i)):s=setTimeout(()=>{s=void 0,hi(t,e(),"tap",i)},250):hi(t,e(),"tap",i)};o.addEventListener("pointerdown",h=>{h.button===0&&(n={x:h.clientX,y:h.clientY},a=!1,l(),zt(e().hold_action)&&(r=setTimeout(()=>{r=void 0,a=!0,hi(t,e(),"hold",i)},500)))}),o.addEventListener("pointermove",h=>{n&&Math.hypot(h.clientX-n.x,h.clientY-n.y)>10&&c()}),o.addEventListener("pointerup",()=>{let h=!!n&&!a;c(),h&&d()}),o.addEventListener("pointercancel",c),o.addEventListener("pointerleave",c),o.addEventListener("keydown",h=>{h.key!=="Enter"&&h.key!==" "||!fo(e())||(h.preventDefault(),hi(t,e(),"tap",i))}),o.addEventListener("contextmenu",h=>{zt(e().hold_action)&&h.preventDefault()})}function ut(o,t,e){fo(t)?(o.setAttribute("role","button"),o.tabIndex=0,o.style.cursor="pointer"):(e?o.setAttribute("role",e):o.removeAttribute("role"),o.removeAttribute("tabindex"),o.style.cursor="");let i=zt(t.hold_action);o.style.userSelect=i?"none":"",o.style.setProperty("-webkit-user-select",i?"none":""),o.style.setProperty("-webkit-touch-callout",i?"none":"")}var ua=new Map;function mt(o,t){let e=ua.get(o);if(e)return e;let i=new Promise((n,a)=>{let s=Array.from(document.querySelectorAll("script[src]")).find(d=>/animated-weather-card(?:\.min)?\.js/.test(d.src)),l=s?s.src.replace(/animated-weather-card(\.min)?\.js/,`${o}$1.js`):`${o}.js`,c=document.createElement("script");c.src=l,c.type="module",c.async=!0,c.onload=()=>t()?n():a(new Error(`${l} loaded but registered nothing`)),c.onerror=()=>a(new Error(`Failed to load ${l}`)),document.head.appendChild(c)});return i.catch(()=>ua.delete(o)),ua.set(o,i),i}function $t(o){return mt("animated-weather-card-editor",()=>!!customElements.get(o))}var go=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function wo(o){let t=o.color_palette||"default",e=o.custom_colors||{},i="";if(t!=="theme"){let a=d=>{if(typeof d!="string"||!go.test(d))return null;let h=d.replace("#","");h.length===3&&(h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]);let m=parseInt(h,16);return{r:m>>16&255,g:m>>8&255,b:m&255}},r=(d,h,m)=>"#"+(d<<16|h<<8|m).toString(16).padStart(6,"0"),s=(d,h)=>{let m=a(d);if(!m)return d;let p=1-h/100;return r(Math.max(0,Math.floor(m.r*p)),Math.max(0,Math.floor(m.g*p)),Math.max(0,Math.floor(m.b*p)))},l=(d,h)=>{let m=a(d);if(!m)return d;let p=h/100;return r(Math.min(255,Math.floor(m.r+(255-m.r)*p)),Math.min(255,Math.floor(m.g+(255-m.g)*p)),Math.min(255,Math.floor(m.b+(255-m.b)*p)))},c=(d,h)=>{let m=e[d];if(!m||typeof m!="string"||!go.test(m))return;let p=l(m,12),g=s(m,22);i+=`--weather-${h}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${p} 0%, ${m} 55%, ${g} 100%); `};c("sunny_bg","sunny"),c("rainy_bg","rainy"),c("snowy_bg","snowy"),c("stormy_bg","stormy"),c("windy_bg","windy"),c("cloudy_bg","cloudy")}let n=(a,r)=>{a&&ni(a)&&(i+=r.replace(/\$\{value\}/g,a))};return n(e.text_color,"--weather-text-color: ${value} !important; "),n(e.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),n(e.rain_color,"--weather-rain-color: ${value} !important; "),n(e.snow_color,"--weather-snow-color: ${value} !important; "),i}var fa={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"};function ac(o){return kt(fa,o)===void 0?"mdi:weather-night":`mdi:moon-${o.replace(/_moon$/,"").replace(/_/g,"-")}`}function ma(o,t){let e=n=>n.startsWith("sensor.")&&kt(fa,t.states[n]?.state)!==void 0,i=t?e("sensor.moon_phase")?"sensor.moon_phase":Object.keys(t.states).find(e):"sensor.moon_phase";return i?{sun_entity:o,moon_entity:i}:{sun_entity:o}}var pt=1e3,Qi=300,rc={horizon:196,peak:34,trough:276,twilightRy:78},oc={horizon:200,peak:96,trough:262,twilightRy:44},sc=124,yo=16;function lc(o,t){if(o<1)return 1;let e=Math.max(2,Math.floor((t+yo)/(sc+yo))),i=Math.ceil(o/e);return Math.ceil(o/i)}function bo(o,t,e){let i=e-t;if(i<=0||i>=24)return 0;if(o>=t&&o<=e)return Math.sin(Math.PI*(o-t)/i);let n=((o-e)%24+24)%24;return-Math.sin(Math.PI*n/(24-i))}var en=o=>o/24*pt,vo=(o,t)=>o>=0?t.horizon-o*(t.horizon-t.peak):t.horizon-o*(t.trough-t.horizon);function cc(o,t,e){let i=[];for(let n=0;n<=240;n++){let a=n/10;i.push(`${en(a).toFixed(1)},${vo(bo(a,o,t),e).toFixed(1)}`)}return"M"+i.join(" L")}function Ji(o){if(!o)return 0;let t=new Date(o);return isNaN(t.getTime())?0:t.getHours()+t.getMinutes()/60+t.getSeconds()/3600}var dc=o=>di(o,"st-ampm");Wt();var _o=He(Ce(Lt)),hc=`
${ct("")}
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
        --st-text: ${_o};
        --st-secondary: ${_o};
        --st-secondary-opacity: ${Ii};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${Ot(Gi,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${li.map(o=>`${o} ${Xe}s ${Dt}`).join(", ")};
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
`,pa=class extends HTMLElement{constructor(){super();this.config={};this._shadow=this.attachShadow({mode:"open"})}setConfig(e){if(!e.sun_entity)throw new Error("Please define a sun_entity (e.g. sun.sun)");this.config={...e},this._render()}set hass(e){let i=this.config.sun_entity||"",n=this.config.moon_entity||"",a=this._hass?.states[i],r=e.states[i],s=this._hass?.states[n]?.state,l=e.states[n]?.state,c=ze(this._hass)!==ze(e),d=this.config.weather_entity||"",h=d&&this._hass?.states[d]?.state!==e.states[d]?.state;this._hass=e;let m=a?.attributes?.elevation,p=r?.attributes?.elevation;(!a||a.state!==r?.state||a.attributes?.next_rising!==r?.attributes?.next_rising||a.attributes?.next_setting!==r?.attributes?.next_setting||Math.abs((m||0)-(p||0))>=.5||n&&s!==l||c||h)&&this._render()}connectedCallback(){this._clock||(this._clock=setInterval(()=>this._render(),6e4)),!this._resizeObserver&&typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>this._fit()),this._resizeObserver.observe(this))}disconnectedCallback(){this._clock&&clearInterval(this._clock),this._clock=void 0,this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_fit(){let e=this._shadow.querySelector(".st-card");if(!e)return;let i=e.querySelector(".st-metrics");for(let n of["regular","compact","short","tight"]){if(e.dataset.fit=n,i){let a=Array.from(i.children).filter(r=>getComputedStyle(r).display!=="none").length;i.style.setProperty("--st-cols",String(lc(a,i.clientWidth)))}if(e.scrollHeight<=e.clientHeight+1)return}}_actions(){return Rt(this.config,this.config.sun_entity)}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}_skyCondition(e){let i=this.config.weather_entity,n=i?this._hass?.states[i]?.state:void 0;if(n&&n!=="unavailable"&&n!=="unknown"){let a=At(n,!1,void 0,void 0,this._hass?.config?.time_zone);if(si.includes(a))return a}return e==="night"?"clear-night":"sunny"}static async getConfigElement(){return customElements.get("animated-sun-tracker-editor")||await $t("animated-sun-tracker-editor"),document.createElement("animated-sun-tracker-editor")}static getStubConfig(e,i=[],n=[]){let a=[...i,...n,...Object.keys(e?.states??{})];return ma(a.find(r=>r.startsWith("sun."))??"sun.sun",e)}_getSunData(){if(!this._hass||!this.config.sun_entity)return null;let e=this._hass.states[this.config.sun_entity];return e?{sunrise:e.attributes.next_rising||null,sunset:e.attributes.next_setting||null,dawn:e.attributes.next_dawn||null,dusk:e.attributes.next_dusk||null,noon:e.attributes.next_noon||null,elevation:typeof e.attributes.elevation=="number"?e.attributes.elevation:null,aboveHorizon:e.state==="above_horizon",rising:!!e.attributes.rising}:null}_getMoonData(){if(!this._hass||!this.config.moon_entity)return null;let e=this._hass.states[this.config.moon_entity];if(!e)return null;let i=e.state,n;try{n=this._hass.formatEntityState?.(e)}catch{}return{phase:i,phaseName:(n&&n!==i?n:void 0)||kt(fa,i)||i.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase()),icon:ac(i)}}_render(){let e=this._getSunData(),i=this._getMoonData(),n=this.config.color_palette!=="theme";if(!e||!e.sunrise||!e.sunset){this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let a=new Date,r=a.getHours()+a.getMinutes()/60,s=Ji(e.sunrise),l=Ji(e.sunset),c=e.dawn?Ji(e.dawn):Math.max(0,s-.5),d=e.dusk?Ji(e.dusk):Math.min(24,l+.5),h=l-s,m=e.aboveHorizon,p=m?e.sunset:e.sunrise,g=new Date(p).getTime()-a.getTime(),u=this._hass,f=se=>P(Te(u,se)),w=se=>dc(ht(se,u)),_=g>0?Te(u,"in_duration",{duration:da(g/36e5,u)}):"",v=Ft(e.elevation,e.rising,e.aboveHorizon),b=lt(this._skyCondition(v),v),y=n?{"--awc-sky-top":b.top,"--awc-sky-mid":b.mid,"--awc-sky-bottom":b.bottom,"--awc-sky-glow":b.glow,"--awc-sky-scrim":b.scrim}:null,C=this.config.compact?oc:rc,S=cc(s,l,C),k=`${S} L${pt},${C.horizon} L0,${C.horizon} Z`,T=bo(r,s,l),x=r/24*100,E=vo(T,C)/Qi*100,M=(se,pe)=>{let be=Math.max(70,Math.abs(pe)/24*pt*2.4);return`<ellipse cx="${en(se).toFixed(1)}" cy="${C.horizon}" rx="${be.toFixed(1)}" ry="${C.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},L=!!this.config.compact,D=this.config.show_header!==!1,H=D?`
            <div class="st-hero">
                ${this.config.title&&!L?`<div class="st-title">${P(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    <ha-icon icon="${m?"mdi:weather-sunset-down":"mdi:weather-sunset-up"}"></ha-icon>
                    <span>${f(m?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${w(p)}</div>
                ${_?`<div class="st-countdown">${P(_)}</div>`:""}
            </div>`:this.config.title&&!L?`<div class="st-hero"><div class="st-title">${P(this.config.title)}</div></div>`:"",W=(se,pe,be,Ao,Eo=!1)=>`
                <div class="st-metric" data-kind="${P(se)}">
                    <div class="st-metric-label"><ha-icon icon="${P(pe)}"></ha-icon><span title="${P(be)}">${P(be)}</span></div>
                    <div class="st-metric-value${Eo?" wrap":""}">${Ao}</div>
                </div>`,z=!L&&this.config.show_details!==!1,V=L&&D?`
                        <div class="st-chart-note">${f(m?"sunrise":"sunset")}<span class="st-chart-note-time">${w(m?e.sunrise:e.sunset)}</span></div>`:"",_e=z?`
            <div class="st-metrics">
                ${m?W("sunrise","mdi:weather-sunset-up",f("sunrise"),w(e.sunrise)):W("sunset","mdi:weather-sunset-down",f("sunset"),w(e.sunset))}
                ${W("noon","mdi:white-balance-sunny",f("solar_noon"),w(e.noon))}
                ${W("daylight","mdi:timer-sand",f("daylight"),P(da(h,u)))}
                ${W("first-light","mdi:weather-sunset",f("first_light"),w(e.dawn))}
                ${W("last-light","mdi:weather-night",f("last_light"),w(e.dusk))}
                ${i?W("moon",i.icon,f("moon"),P(i.phaseName),!0):""}
            </div>`:"",$=this.config.sun_entity?u?.states[this.config.sun_entity]:void 0,Z="";try{Z=$&&u?.formatEntityState?.($)||""}catch{}let j=[`${Te(u,"sunrise")} ${ht(e.sunrise,u)}`,`${Te(u,"sunset")} ${ht(e.sunset,u)}`,Z].filter(Boolean).join(" \xB7 ");this._mount(`
                    ${H}
                    <div class="st-chart" role="img" aria-label="${P(j)}">
                        <svg viewBox="0 0 ${pt} ${Qi}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${pt}" height="${C.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${C.horizon}" width="${pt}" height="${Qi-C.horizon}"/></clipPath>
                            </defs>
                            ${M(s,s-c)}
                            ${M(l,d-l)}
                            <path d="${k}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${C.horizon}" x2="${pt}" y2="${C.horizon}" class="st-horizon"/>
                            <line x1="${en(r).toFixed(1)}" y1="0" x2="${en(r).toFixed(1)}" y2="${Qi}" class="st-now-line"/>
                            <path d="${S}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${S}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${T<0?"below":""}" style="left: ${x.toFixed(2)}%; top: ${E.toFixed(2)}%;"></div>${V}
                    </div>
                    ${_e}`,y)}_mount(e,i){let n=this._shadow.querySelector(".st-card");n||(this._shadow.innerHTML=`<style>${hc}</style><ha-card><div class="st-card"></div></ha-card>`,n=this._shadow.querySelector(".st-card"),Nt(n.parentElement,this,()=>this._actions())),ut(n.parentElement,this._actions());let a=!!i;n.classList.toggle("sky",a),n.classList.toggle("compact",!!this.config.compact),n.parentElement?.classList.toggle("sky",a);for(let r of li)i?n.style.setProperty(r,i[r]):n.style.removeProperty(r);n.innerHTML=e,this._fit()}};customElements.define("animated-sun-tracker-card",pa);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,t)=>t.startsWith("sun.")?[{label:"Regular",config:{type:"custom:animated-sun-tracker-card",...ma(t,o)}},{label:"Compact",config:{type:"custom:animated-sun-tracker-card",...ma(t,o),compact:!0}}]:null});function ga(o){let t=Number(o?.attributes?.supported_features);if(!isFinite(t))return["hourly","daily"];let e=[];return t&2&&e.push("hourly"),t&4&&e.push("twice_daily"),t&1&&e.push("daily"),e}function xo(o){let t=ga(o);return t.includes("daily")?"daily":t.includes("twice_daily")?"twice_daily":null}var uc=5e3;function mc(){let o=new WeakMap;return{subscribe(t,e,i,n){let a=o.get(t);a||o.set(t,a=new Map);let r=`${e}|${i}`,s=a.get(r);if(!s){let c={listeners:new Set};s=c,a.set(r,c);let d=h=>{c.last=h;for(let m of[...c.listeners])m(h)};c.unsubscribe=t.subscribeMessage(h=>d({type:h?.type??i,forecast:Array.isArray(h?.forecast)?h.forecast:null}),{type:"weather/subscribe_forecast",entity_id:e,forecast_type:i}).catch(()=>{a.get(r)===c&&a.delete(r),d({type:i,forecast:null,failed:!0})})}let l=s;return clearTimeout(l.closing),l.closing=void 0,l.listeners.add(n),l.last&&n(l.last),()=>{!l.listeners.delete(n)||l.listeners.size||(l.closing=setTimeout(()=>{l.listeners.size||(a.get(r)===l&&a.delete(r),l.unsubscribe?.then(c=>{typeof c=="function"&&c()}).catch(()=>{}))},uc))}}}}function pc(){return window.AnimatedWeatherCardForecasts??(window.AnimatedWeatherCardForecasts=mc())}function So(o,t,e,i){return o?.connection?.subscribeMessage?pc().subscribe(o.connection,t,e,i):()=>{}}var It=class{constructor(t){this.changed=t;this.hourly=null;this.daily=null;this.dailyType=null;this.settled=!1;this.stops=[];this.pending=new Set}sync(t,e,i){let n=e?t?.states[e]:void 0,a=ga(n),r=i.hourly&&a.includes("hourly"),s=i.daily?xo(n):null,l=`${e}|${r}|${s}`;if(!t?.connection||!e||!n){this.key&&this.stop();return}if(l===this.key&&this.connection===t.connection)return;this.stop(),this.key=l,this.connection=t.connection,this.dailyType=s,this.pending=new Set([r?"hourly":"",s??""].filter(Boolean)),this.settled=this.pending.size===0;let c=(d,h)=>{this.stops.push(So(t,e,d,m=>{m.failed||h(m.forecast),this.pending.delete(d),this.settled=this.pending.size===0,this.changed()}))};r&&c("hourly",d=>{this.hourly=d}),s&&c(s,d=>{this.daily=d}),this.settled&&this.changed()}stop(){for(let t of this.stops)t();this.stops=[],this.key=void 0,this.connection=void 0,this.hourly=null,this.daily=null,this.dailyType=null,this.settled=!1}};Wt();function ui(){return mt("animated-weather-card-forecast",()=>!!window.AnimatedWeatherCardForecast)}var fc=`
${ct("")}
    :host { display: block; height: 100%; }
    ha-card { height: 100%; overflow: hidden; }
    ha-card.sky { background: none; border-color: transparent; }
`;function wa(o,t){return t?.states["sun.sun"]?{entity:o,sun_entity:"sun.sun"}:{entity:o}}var ya=class extends HTMLElement{constructor(){super();this.config={};this.feed=new It(()=>this.render());this.root=this.attachShadow({mode:"open"})}setConfig(e){if(!e.entity)throw new Error("Please define a weather entity (entity: weather.home)");this.config={...e},this.syncFeed(),this.render()}set hass(e){let i=this._hass;this._hass=e,this.syncFeed();let n=this.config.entity??"",a=this.config.sun_entity||"sun.sun";(!i||i.states[n]!==e.states[n]||i.states[a]?.state!==e.states[a]?.state||Math.abs((i.states[a]?.attributes?.elevation??0)-(e.states[a]?.attributes?.elevation??0))>=.5||ze(i)!==ze(e))&&this.render()}get hass(){return this._hass}connectedCallback(){this.syncFeed(),this.hourTimer??(this.hourTimer=setInterval(()=>this.render(),5*6e4)),!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>this.fit()),this.resizeObserver.observe(this)),this.render()}disconnectedCallback(){this.feed.stop(),clearInterval(this.hourTimer),this.hourTimer=void 0,this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.closePopup?.()}wantsHours(){return this.config.forecast!=="daily"}wantsDays(){return this.config.forecast==="daily"||this.config.forecast==="both"||!this.config.compact}syncFeed(){this.isConnected&&this.feed.sync(this._hass,this.config.entity,{hourly:this.wantsHours(),daily:this.wantsDays()})}sky(){let e=this._hass?.states[this.config.sun_entity||"sun.sun"],i=e?.attributes?.elevation,n=e?Ft(typeof i=="number"?i:Number(i),!!e.attributes?.rising,e.state!=="below_horizon"):"day",a=this.config.entity?this._hass?.states[this.config.entity]?.state:void 0,r=n==="night"?"clear-night":"sunny";if(a&&a!=="unavailable"&&a!=="unknown"){let s=At(a,!1,void 0,void 0,this._hass?.config?.time_zone);si.includes(s)&&(r=s)}return{condition:r,phase:n}}context(){let e=this.config.entity?this._hass?.states[this.config.entity]:void 0,{condition:i,phase:n}=this.sky(),a=Number(e?.attributes?.temperature);return{hass:this._hass,entityId:this.config.entity??"",hourly:this.feed.hourly,daily:this.feed.daily,dailyType:this.feed.dailyType,current:isFinite(a)?a:void 0,unit:String(e?.attributes?.temperature_unit??this._hass?.config?.unit_system?.temperature??"\xB0"),now:Date.now(),condition:i,phase:n,theme:this.config.color_palette==="theme",width:this.root.querySelector(".fc-card")?.clientWidth??0,show:this.config.forecast??(this.config.compact?"hourly":"both"),variant:this.config.review_card,compact:!!this.config.compact}}actions(){return Rt(this.config,this.config.entity)}actionsWithDefault(){let e=this.actions();return e.tap_action?e:{...e,tap_action:{action:"forecast"}}}openForecast(){let e=window.AnimatedWeatherCardForecast;if(!e){ui().then(()=>this.openForecast()).catch(a=>console.warn(`Animated Weather Card: ${a.message}`));return}this.closePopup?.();let i=this.root.querySelector("ha-card"),n=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;this.closePopup=e.openPopup({...this.context(),variant:this.config.review_popup,returnFocus:i,note:null,still:n,openMoreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config.entity},bubbles:!0,composed:!0}))})}render(){if(!this.config.entity)return;let e=this.root.querySelector(".fc-card");e||(this.root.innerHTML=`<style>${fc}</style><style class="fc-views"></style><ha-card><div class="fc-card"></div></ha-card>`,e=this.root.querySelector(".fc-card"),Nt(e.parentElement,this,()=>this.actionsWithDefault(),{forecast:()=>this.openForecast()})),ut(e.parentElement,this.actionsWithDefault());let i=this.context(),n=!i.theme;e.classList.toggle("sky",n),e.classList.toggle("compact",i.compact),e.parentElement?.classList.toggle("sky",n),e.dataset.variant=i.variant??"";let a=lt(i.condition,i.phase),r={"--awc-sky-top":a.top,"--awc-sky-mid":a.mid,"--awc-sky-bottom":a.bottom,"--awc-sky-glow":a.glow,"--awc-sky-scrim":a.scrim};for(let c of li)n?e.style.setProperty(c,r[c]):e.style.removeProperty(c);e.dataset.phase=i.phase,e.dataset.condition=i.condition;let s=window.AnimatedWeatherCardForecast;if(!s){e.setAttribute("aria-busy","true"),ui().then(()=>this.render()).catch(c=>{console.warn(`Animated Weather Card: ${c.message}`),e.innerHTML=`<div class="fc-empty">${P(c.message)}</div>`});return}e.removeAttribute("aria-busy");let l=this.root.querySelector(".fc-views");l.textContent!==s.cardCss&&(l.textContent=s.cardCss),e.innerHTML=s.renderCard(i),this.fit()}fit(){let e=this.root.querySelector(".fc-card");if(!e)return;let i=e.firstElementChild,n=(i?.dataset.fitSteps??"regular").split(" "),a=()=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1||!!i&&i.scrollHeight>i.clientHeight+1;for(let r of n)if(e.dataset.fit=r,!a())break;window.AnimatedWeatherCardForecast?.fit(e)}getCardSize(){return this.config.compact?2:this.config.forecast==="both"?5:3}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:this.config.forecast==="both"?{columns:12,rows:5,min_columns:6,min_rows:3}:{columns:12,rows:3,min_columns:6,min_rows:2}}static async getConfigElement(){return customElements.get("animated-forecast-card-editor")||await $t("animated-forecast-card-editor"),document.createElement("animated-forecast-card-editor")}static getStubConfig(e,i=[],n=[]){let a=[...i,...n,...Object.keys(e?.states??{})];return wa(a.find(r=>r.startsWith("weather."))??"weather.forecast_home",e)}};customElements.define("animated-forecast-card",ya);window.customCards=window.customCards||[];window.customCards.push({type:"animated-forecast-card",name:"Animated Forecast",description:"The next hours or days of a weather entity, in its sky",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,t)=>t.startsWith("weather.")?[{label:"Forecast",config:{type:"custom:animated-forecast-card",...wa(t,o)}},{label:"Forecast strip",config:{type:"custom:animated-forecast-card",...wa(t,o),compact:!0}}]:null});var tn=class{constructor(t){this.tick=t;this.running=!1}start(){this.running||(this.running=!0,this.tick(),this.arm())}stop(){this.running=!1,clearTimeout(this.timer),this.timer=void 0}get isRunning(){return this.running}arm(){clearTimeout(this.timer);let t=6e4-Date.now()%6e4+20;this.timer=setTimeout(()=>{this.running&&(this.tick(),this.arm())},t)}};Wt();var To=o=>`Wind from ${Math.round(o)}\xB0`,Co=o=>o==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",_a=o=>o?"mdi:weather-sunset-down":"mdi:weather-sunset-up",gc=18,wc=450,yc=1600;function ba(o,t){return t?.states["sun.sun"]?{entity:o,sun_entity:"sun.sun"}:{entity:o}}var _c=400,bc=120,vc=220,ko=24,xc=.43,Sc=.55;window.AnimatedWeatherCardGsap=jn;var Tc=["regular","compact","short","tight","minimal"],Cc=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...Tc.map(o=>[o,"none"])];function kc(o,t,e,i=!1){let n=[],a=t?t.roomy[0]??t.keep:"none",r=(l,c,d,h=!0,m)=>n.push({height:l,note:c,forecast:d,clock:h?"on":"off",...m?{range:m}:{}});if(o)for(let[l,c]of Cc.slice(0,4))r(l,c,a);r("regular","none",a);for(let l of t?.roomy.slice(1)??[])r("regular","none",l);let s=t?t.keep:"none";s!==a&&r("regular","none",s);for(let l of["compact","short","tight"])r(l,"none",s);if(t){for(let l of t.drop)r("tight","none",l);r("tight","none","none")}return e&&r("tight","none","none",!1),i&&r("tight","none","none",!1,"none"),r("minimal","none","none",!1,i?"none":void 0),n}var va=class extends HTMLElement{constructor(){super(...arguments);this._initialRender=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this._needsAnimationRestart=!1;this.currentWindSpeedValue=10;this.devTimeOverride=!1;this._animationGeneration=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new Xi;this.writtenNote=null;this.noteComing=!1;this.minuteTicker=new tn(()=>this.onMinute());this.forecastHour=-1;this.forecastHtml="";this.forecastWidth=0;this.forecastFeed=new It(()=>this.updateForecast())}static getStubConfig(e,i=[],n=[]){let a=[...i,...n,...Object.keys(e?.states??{})];return ba(a.find(r=>r.startsWith("weather."))??Ar.entity,e)}actionsConfig(){return this.config?.dev_mode?{}:Rt(this.config,this.config?.entity)}static get properties(){return{hass:{},config:{}}}setConfig(e){if(!e.entity&&!e.dev_mode)throw new Error("You need to define an entity or enable dev mode");let i=r=>r===void 0||typeof r=="number"&&isFinite(r)&&r>=0&&r<=23;if(!i(e.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${e.sunrise_hour})`);if(!i(e.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${e.sunset_hour})`);let n=this.config?.auto_pause;this.config?.flights_entity!==e.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0),this.config=e;let a=this.querySelector(".weather-info");if(a&&ut(a,this.actionsConfig(),"group"),this.isConnected){this.initializeTimeOfDayManager();let r=this.animationController;this._animationGeneration++,this.animationController=new Ht(this,this.config,()=>this.animationsPaused,this.timeOfDayManager),r&&r.stopAllAnimations().catch(s=>A(this.config?.dev_mode,"Error stopping previous animation controller:",s))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&(this.syncForecast(),this.syncMinuteTicker()),this.isConnected&&!!e.auto_pause!=!!n&&(this.removeVisibilityTracking(),this.setupVisibilityTracking())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>{let i=this.querySelector(".awc-forecast");i&&Math.abs(i.clientWidth-this.forecastWidth)>8?this.updateForecast():i&&window.AnimatedWeatherCardForecast?.fit(i),this.applySizeState(),this.devPanel?.isOpen&&this.devPanel.dock()}),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this._initialRender&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=new Ht(this,this.config,()=>this.animationsPaused,this.timeOfDayManager))),this.attachEventListeners(),this.setupVisibilityTracking(),this._updateDataInPlace(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=new Ht(this,this.config,()=>this.animationsPaused,this.timeOfDayManager)),this._initialRender=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let i=this.querySelector(".animated-weather-card");i&&(i.classList.remove("no-transitions"),i.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass&&!this.config.dev_mode)return;Jn(this),this.stopPlanes();let e=this.config.color_palette||"default",i;try{i=sa(this.hass,this.config,this.currentDevCondition)}catch(L){let D=L?.message||"Error loading weather data";this.innerHTML=`
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
            `;return}let{temperature:n,weatherCondition:a,location:r,humidity:s,windSpeed:l,windSpeedValue:c,windBearing:d,pressure:h,pressureValue:m,feelsLike:p,indoorTemperature:g,indoorHumidity:u,sun:f}=i,w=this.updatePressureTrend(m);this.currentWindSpeedValue=c;let _=f?.aboveHorizon??!1,v=f?ht(_?f.sunset:f.sunrise,this._hass):"--",b=this.config.show_sun!==!1&&!!f&&v!=="--",y=!!this.config.compact,C=wo(this.config),S=this.config.show_attribute_icons!==!1,k=this.config.show_attribute_labels!==!1,T=(L,D,H,W,z="")=>{let V=S||k?`<div class="attribute-label">${S?`<ha-icon class="attribute-icon" icon="${D}"></ha-icon>`:""}${k?`<span>${P(H)}</span>`:""}</div>`:"";return`<div class="attribute" data-kind="${L}">${V}<div class="attribute-value"><span class="attribute-text">${W}</span>${z}</div></div>`},x=typeof d=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${d+180}deg);" aria-label="${To(d)}"></ha-icon>`:"",E=w?`<ha-icon class="pressure-trend ${w}" icon="${Co(w)}" aria-label="Pressure ${w}"></ha-icon>`:"",M=this.config.show_attributes!==!1?`
              <div class="weather-attributes${k?"":" values-only"}">${[T("humidity","mdi:water-percent",Pi(this._hass,"ui.card.weather.attributes.humidity","Humidity"),P(s)),T("wind","mdi:weather-windy",Pi(this._hass,"ui.card.weather.attributes.wind_speed","Wind"),P(l),x),T("pressure","mdi:gauge",Pi(this._hass,"ui.card.weather.attributes.air_pressure","Pressure"),P(h),E),b?T("sun",_a(_),Te(this._hass,_?"sunset":"sunrise"),di(v,"awc-ampm")):""].join("")}</div>`:"";this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions loading ${e==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${y?' data-variant="compact"':""} style="${P(C)}">
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
                ${this.headlineHtml(y,r)}
                <div class="temperature" aria-live="polite"><span class="temperature-value">${P(n)}</span><span class="degree">\xB0</span>${this.highLowPlace()==="stack"?'<span class="awc-hl awc-hl-stack" hidden></span>':""}</div>
                ${this.highLowPlace()==="line"?`<div class="awc-desc-line"><div class="weather-desc" aria-live="polite">${P(a)}</div><span class="awc-hl awc-hl-line" hidden></span></div>`:`<div class="weather-desc" aria-live="polite">${P(a)}</div>`}
                ${y?`<div class="compact-meta">${P(this.compactMeta(r,p))}</div>`:`<div class="hero-meta">${this.heroMetaHtml(p,g,u)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
                ${!y&&this.clockStyle()==="a"?this.clockHtml():""}
              </div>
              ${this.forecastWants()?`<div class="awc-forecast" data-variant="${this.forecastStyle()}" data-pending></div>`:""}
              ${y?"":M}
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
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill()}applySpill(){let e=this.querySelector("ha-card");if(!e)return;let i=this.config?.spill_particles!==!1?"visible":"hidden";e.style.setProperty("overflow",i,"important");let n=()=>{let a=e.shadowRoot;if(!a)return;let r=a.querySelector("#awc-overflow");r||(r=document.createElement("style"),r.id="awc-overflow",a.appendChild(r)),r.textContent=`:host { overflow: ${i} !important; }`};n(),!e.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(n))}transitionCondition(){let e=this.querySelector(".animated-weather-card");if(!e||e.classList.contains("loading")){this.initializeAnimations();return}e.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},_c)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&!this.config.dev_mode}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let e=window.AnimatedWeatherCardNote;if(e){this.noteWriter??(this.noteWriter=new e(this)),this.noteWriter.start();return}mt("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(e){this.writtenNote=e,this.updateNote()}noteWriting(e){this.noteComing!==e&&(this.noteComing=e,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let e=this.config.note_entity?lo(this._hass,this.config):this.writtenNote,i=e?co(e,this.config):null;if(!e||i===null)return e;let n=i-Date.now();return n<=0?null:(n<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),n+50)),e)}noteHtml(e){return`<p class="weather-note"${e?"":" hidden"}><span class="note-long">${P(e?.note??"")}</span><span class="note-short">${P(e?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let e=this.querySelector(".weather-note");if(!e)return;let i=e.querySelector(".note-long"),n=e.querySelector(".note-short"),a=e.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let l=e.querySelector(".note-phrase"),c=Te(this._hass,this.noteComing==="forecast"?"note_reading":"note_writing");!a||e.hidden?(l&&(l.textContent=c),e.dataset.writing="",e.setAttribute("aria-busy","true"),e.hidden=!1,this.applySizeState()):this.fadeThrough(l,c);return}a&&(delete e.dataset.writing,e.removeAttribute("aria-busy"));let r=this.currentNote();if(!r){this.noteTyping?.finish(),(!e.hidden||a)&&(e.hidden=!0,this.applySizeState());return}if(e.hidden||a){this.noteTyping?.finish(),i&&(i.textContent=r.note),n&&(n.textContent=r.line),e.hidden=!1,this.applySizeState(),a&&this.typeIn(e);return}if(this.noteTyping){if(this.noteTyping.text===r.note+r.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(i,r.note,s),this.fadeThrough(n,r.line,s)}clockStyle(){if(!this.clockEnabled())return null;let e=this.config?.review_clock;return e==="b"||e==="c"?e:"a"}forecastStyle(){let e=this.config?.review_forecast;return e==="b"||e==="c"?e:"a"}highLowPlace(){return this.forecastWants()?{a:"line",b:"none",c:"stack"}[this.forecastStyle()]:"none"}clockHtml(){return'<time class="awc-clock"><span class="awc-clock-time"></span><span class="awc-clock-period"></span><span class="awc-clock-date" aria-hidden="true"></span><span class="awc-clock-date-long" aria-hidden="true"></span><span class="awc-visually-hidden awc-clock-spoken"></span></time>'}headlineHtml(e,i){let n=!e&&this.config?.show_location!==!1&&i?i:"",a=e?null:this.clockStyle();return a==="b"||a==="c"?`<div class="location awc-headline" data-clock="${a}">${this.clockHtml()}`+(n?`<span class="awc-headline-sep" aria-hidden="true">\xB7</span><span class="awc-headline-place">${P(n)}</span>`:"")+"</div>":n?`<div class="location">${P(n)}</div>`:""}clockEnabled(){return!!this.config?.show_clock}forecastWants(){let e=this.config?.forecast;return!e||e==="none"||this.config?.compact||this.config?.dev_mode?null:{hourly:e!=="daily",daily:!0}}syncForecast(){let e=this.forecastWants();if(!e||!this.isConnected){this.forecastFeed.stop();return}this.forecastFeed.sync(this._hass,this.config?.entity,e)}syncMinuteTicker(){this.isConnected&&!this.animationsPaused&&(this.clockEnabled()||!!this.forecastWants())?this.minuteTicker.start():this.minuteTicker.stop()}onMinute(){this.updateClock();let e=Math.floor(Date.now()/36e5);this.forecastWants()&&e!==this.forecastHour&&this.updateForecast()}updateClock(){let e=this.querySelector(".awc-clock");if(!e)return;let i=new Date,{time:n,period:a}=mo(i,this._hass),r=(l,c)=>{let d=e.querySelector(l);d&&d.textContent!==c&&(d.textContent=c)};r(".awc-clock-time",n),r(".awc-clock-period",a),r(".awc-clock-date",po(i,this._hass,this.clockStyle()!=="a")),r(".awc-clock-date-long",ca(i,this._hass)),r(".awc-clock-spoken",ca(i,this._hass)),e.querySelector(".awc-clock-period")?.toggleAttribute("hidden",!a);let s=i.toISOString().slice(0,16);e.getAttribute("datetime")!==s&&e.setAttribute("datetime",s)}forecastContext(e){let i=this.config?.entity?this._hass?.states[this.config.entity]:void 0,n=this.querySelector(".animated-weather-card"),a=Number(i?.attributes?.temperature);return{hass:this._hass,entityId:this.config?.entity??"",hourly:this.forecastFeed.hourly,daily:this.forecastFeed.daily,dailyType:this.forecastFeed.dailyType,current:isFinite(a)?a:void 0,unit:String(i?.attributes?.temperature_unit??this._hass?.config?.unit_system?.temperature??"\xB0"),now:Date.now(),condition:this.currentWeatherClass||"sunny",phase:n?.dataset.phase??this.currentSkyPhase(),theme:this.config?.color_palette==="theme",width:this.querySelector(".awc-forecast")?.clientWidth??0,show:this.config?.forecast==="daily"||this.config?.forecast==="both"?this.config.forecast:"hourly",variant:e}}updateForecast(){let e=this.querySelector(".awc-forecast");if(!e)return;let i=window.AnimatedWeatherCardForecast;if(!i){ui().then(()=>{this.isConnected&&this.updateForecast()}).catch(s=>console.warn(`Animated Weather Card: ${s.message}`));return}if(!this.querySelector("style.awc-forecast-css")){let s=document.createElement("style");s.className="awc-forecast-css",s.textContent=i.sectionCss,this.appendChild(s)}this.forecastHour=Math.floor(Date.now()/36e5);let n=this.forecastContext(this.config?.review_forecast);this.forecastWidth=n.width;let a=!1;for(let s of["line","stack"]){let l=this.querySelector(`.awc-hl-${s}`);if(!l)continue;let c=this.forecastFeed.settled?i.renderHighLow(n,s):"";l.innerHTML!==c&&(l.innerHTML=c,l.hidden=!c,a=!0)}let r=this.forecastFeed.settled?i.renderSection(n):"";if(e.toggleAttribute("data-pending",!this.forecastFeed.settled),r!==this.forecastHtml){this.forecastHtml=r,e.innerHTML=r,e.hidden=this.forecastFeed.settled&&!r;let s=e.firstElementChild;for(let l of["roomy","keep","drop"]){let c=s?.dataset[l];c!==void 0?e.dataset[l]=c:delete e.dataset[l]}a=!0}i.fit(e),a&&this.applySizeState()}openForecast(){let e=window.AnimatedWeatherCardForecast;if(!e){ui().then(()=>{this.isConnected&&this.openForecast()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}this.closePopup?.();let i=this.config?.animate===!1||!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;this.closePopup=e.openPopup({...this.forecastContext(this.config?.review_popup),returnFocus:this.querySelector(".weather-info"),note:this.noteEnabled()?this.currentNote()?.note??null:null,still:i,openMoreInfo:()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.config?.entity},bubbles:!0,composed:!0}))})}compactMeta(e,i){return[this.config?.show_location!==!1?e:"",i?`${Te(this._hass,"feels_like")} ${i}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let e=this.config?.indoor_style,i=P(Te(this._hass,"indoors")),n='<ha-icon class="indoor-icon" icon="mdi:home-thermometer-outline"></ha-icon>';if(e==="icon")return`${n}<span class="awc-visually-hidden">${i} </span>`;let a=`<span class="indoor-label">${i}</span>`;return e==="both"?n+a:a}heroMetaHtml(e,i,n){let a=[];e&&a.push(`<span class="feels-like">${P(Te(this._hass,"feels_like"))} ${P(e)}</span>`);let r=[i,n].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&r.length&&a.push(`<span class="indoor-climate-inline">${this.indoorLead()}${r.map(s=>P(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),a.join("")}mountDevPanel(){if(!this.config?.dev_mode){this.devPanel?.disconnect(),this.devPanel=void 0;return}let e=window.AnimatedWeatherCardDevPanel;if(e){this.devPanel??(this.devPanel=new e(this)),this.devPanel.mount();return}mt("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevPanel).then(()=>{this.isConnected&&this.mountDevPanel()}).catch(i=>console.warn(`Animated Weather Card: ${i.message}`))}attachEventListeners(){this.mountDevPanel(),this.mountNoteWriter();let e=this.querySelector(".weather-info");if(e&&(Nt(e,this,()=>this.actionsConfig(),{forecast:()=>this.openForecast()}),ut(e,this.actionsConfig(),"group")),this.forecastHtml="",this.syncForecast(),this.syncMinuteTicker(),this.updateClock(),this.forecastWants()&&this.updateForecast(),!this.isInitializing){let i=window.setTimeout(()=>{this.initializeAnimations(),this.config?.dev_mode&&!this.currentDevCondition&&(this.currentDevCondition="sunny")},100);this.pendingTimeouts.push(i)}}setAnimationsPaused(e){this.animationsPaused=e,this.toggleAttribute("data-paused",e),this.syncMinuteTicker(),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),Li(this)):this._needsAnimationRestart?(this._needsAnimationRestart=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),Oi(this)),this.devPanel?.updatePauseButton()}getWeatherSettings(e){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return J(this.config,e)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let e=++this._animationGeneration;try{if(!this.config)return;let i=this.config,n=this.querySelector(".animated-weather-card");if(!n)return;this.clearAnimations();let a;if(i.dev_mode)a=this.currentDevCondition||"sunny";else{if(!this.hass||!i.entity)return;let h=this.hass.states[i.entity];if(!h)return;a=h.state.toLowerCase()}let r=At(a,i.dev_mode??!1,i.sunrise_hour,i.sunset_hour,this._hass?.config?.time_zone),s=(i.color_palette||"default")==="theme"?"theme-colors":"",l=n.classList.contains("loading"),c=(...h)=>{n.className=["animated-weather-card",r,...h,s,l?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),l&&requestAnimationFrame(()=>requestAnimationFrame(()=>{n.classList.remove("no-transitions"),n.classList.add("transitions-enabled")}))},d=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(i.animate===!1||d){c(i.animate===!1?"static":""),this.currentWeatherClass=r;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&e===this._animationGeneration){if(c(),this.animationsPaused){this.currentWeatherClass=r,this._needsAnimationRestart=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.animationController.applyWeatherCondition(r)),this.startPlanes()}},i.dev_mode?50:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),Jn(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(r=>{r.innerHTML=""});let i=this.querySelector(".animated-weather-card"),n=this.querySelector(".animation-layer");n&&(ri(this),n.querySelectorAll(".star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),n.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),i&&(Ri(i),Gr(i));let a=this.querySelector(".lightning");a&&(a.classList.remove("flash"),a.innerHTML=""),Qn(this.pendingTimeouts)}set hass(e){let i=this._hass;if(this._hass=e,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),this.syncForecast(),!i){this.render(),this.initializeAnimations();return}if(ze(i)!==ze(e)){this.render(),this.initializeAnimations();return}if(this.config.dev_mode||!this.config.entity)return;let n=i.states[this.config.entity],a=e.states[this.config.entity];if(!n||!a){this.render(),this.initializeAnimations();return}if(n.state!==a.state){this._updateDataInPlace(),this.transitionCondition();return}let r=!1,s=c=>c==null?"__missing__":String(c),l=["temperature","apparent_temperature","humidity","wind_speed","pressure","wind_bearing","friendly_name"];for(let c of l)if(s(n.attributes[c])!==s(a.attributes[c])){r=!0;break}if(this.config.note_entity&&i.states[this.config.note_entity]!==e.states[this.config.note_entity]&&(r=!0),!r){let c=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.humidity_sensor_entity,this.config.pressure_sensor_entity,this.config.wind_speed_sensor_entity,this.config.wind_direction_sensor_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity];for(let d of c){if(!d)continue;let h=i.states[d]?.state,m=e.states[d]?.state;if(h!==m){r=!0;break}}}if(r)this._updateDataInPlace();else{let c=this.config.sun_entity||"sun.sun";i.states[c]!==e.states[c]&&this.applySkyPhase()}}}_updateDataInPlace(){if(!this.config||!this._hass&&!this.config.dev_mode)return;let e;try{e=sa(this._hass,this.config,this.currentDevCondition)}catch{return}let{temperature:i,weatherCondition:n,humidity:a,windSpeed:r,windSpeedValue:s,windBearing:l,pressure:c,pressureValue:d,feelsLike:h,indoorTemperature:m,indoorHumidity:p,sun:g}=e;this.currentWindSpeedValue=s;let u=(b,y)=>{b&&b.textContent!==y&&(b.textContent=y)};this.fadeThrough(this.querySelector(".temperature-value"),i),this.fadeThrough(this.querySelector(".weather-desc"),n);let f=(b,y)=>{u(this.querySelector(`.weather-attributes .attribute[data-kind="${b}"] .attribute-text`),y)};f("humidity",a),f("wind",r),f("pressure",c),this.syncValueIcon("wind","wind-bearing-arrow",typeof l=="number"?{icon:"mdi:navigation",transform:`rotate(${l+180}deg)`,label:To(l)}:null);let w=this.updatePressureTrend(d);if(this.syncValueIcon("pressure","pressure-trend",w?{icon:Co(w),label:`Pressure ${w}`,className:w}:null),g){let b=this.querySelector('.weather-attributes .attribute[data-kind="sun"]'),y=b?.querySelector(".attribute-text"),C=di(ht(g.aboveHorizon?g.sunset:g.sunrise,this._hass),"awc-ampm");y&&y.innerHTML!==C&&(y.innerHTML=C),u(b?.querySelector(".attribute-label > span")??null,Te(this._hass,g.aboveHorizon?"sunset":"sunrise"));let S=b?.querySelector(".attribute-icon");S&&S.getAttribute("icon")!==_a(g.aboveHorizon)&&S.setAttribute("icon",_a(g.aboveHorizon))}let _=this.querySelector(".compact-meta");_&&u(_,this.compactMeta(e.location,h)),u(this.querySelector(".location:not(.awc-headline), .awc-headline-place"),e.location);let v=this.querySelector(".hero-meta");if(v){let b=this.heroMetaHtml(h,m,p);v.innerHTML!==b&&(v.innerHTML=b)}this.updateNote(),this.forecastWants()&&this.updateForecast(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(s)}updatePressureTrend(e){return typeof e!="number"?this._pressureTrend??null:(typeof this._lastPressureValue!="number"?this._lastPressureValue=e:Math.abs(e-this._lastPressureValue)>=.5&&(this._pressureTrend=e>this._lastPressureValue?"rising":"falling",this._lastPressureValue=e),this._pressureTrend??null)}syncValueIcon(e,i,n){let a=this.querySelector(`.weather-attributes .attribute[data-kind="${e}"] .attribute-value`);if(!a)return;let r=a.querySelector(`.${i}`);if(!n){r?.remove();return}r||(r=document.createElement("ha-icon"),a.appendChild(r)),r.className=[i,n.className].filter(Boolean).join(" "),r.getAttribute("icon")!==n.icon&&r.setAttribute("icon",n.icon),r.setAttribute("aria-label",n.label),r.style.transform=n.transform??""}typeIn(e){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let i=Array.from(e.querySelectorAll(".note-long, .note-short")).map(m=>{let p=m.textContent??"",g=document.createElement("span");g.className="note-typed";let u=document.createElement("span");return u.className="note-untyped",u.textContent=p,m.replaceChildren(g,u),{span:m,text:p,typed:g,rest:u}}),n=Math.max(0,...i.map(m=>m.text.length)),a=Math.min(yc,Math.max(wc,n*gc)),r=window.requestAnimationFrame?.bind(window)??(m=>window.setTimeout(()=>m(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),l=Date.now(),c=0,d={text:i.map(m=>m.text).join(""),finish:()=>{s(c);for(let m of i)m.span.textContent=m.text;this.noteTyping===d&&(this.noteTyping=void 0)}},h=()=>{let m=Math.min(1,(Date.now()-l)/a);for(let p of i){let g=Math.round(m*p.text.length);p.typed.textContent=p.text.slice(0,g),p.rest.textContent=p.text.slice(g)}m<1?c=r(h):d.finish()};this.noteTyping=d,c=r(h)}fadeThrough(e,i,n){if(!e)return;let a=this.heroTextPending.get(e);if((a??e.textContent)===i)return;let r=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof e.animate!="function"||r){e.textContent=i,n?.();return}if(this.heroTextPending.set(e,i),a!==void 0)return;let s=()=>{let c=this.heroTextPending.get(e);this.heroTextPending.delete(e),c!==void 0&&(e.textContent=c),n?.()},l=e.animate([{opacity:1},{opacity:0}],{duration:bc,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});l.onfinish=()=>{s(),e.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:vc,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),l.cancel()},l.oncancel=s}get hass(){return this._hass}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.config.dev_mode)return;this.planesWanted=!0;let e=window.AnimatedWeatherCardPlanes;if(!e){mt("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(n=>console.warn(`Animated Weather Card: ${n.message}`));return}let i=new e(this,{intensity:1,scale:1,devMode:this.config.dev_mode||!1},this.config);this.planes=i,i.start().then(()=>{this.animationsPaused&&i.pause()}).catch(n=>{console.error("Failed to start plane fly-overs:",n),this.planes===i&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let e=this.planes;e&&(this.planes=void 0,e.destroy().catch(i=>A(this.config?.dev_mode,"Error stopping plane fly-overs:",i)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let e=this._hass?.states[this.config.flights_entity];if(e&&e===this.lastFlightsState)return;this.lastFlightsState=e;let i=this.flightTracker.update(ro(this._hass,this.config.flights_entity));i.length&&this.flyPlanes(i)}flyPlanes(e){!this.planes||this.animationsPaused||this.planes.flyOver(e,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride)?this.timeOfDayManager.getCurrentState().isNighttime:this._hass?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.wasManuallyPaused)return;let e=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;e!==this.animationsPaused&&this.setAnimationsPaused(e)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(e=>{this.offscreen=!e[e.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}disconnectedCallback(){this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.minuteTicker.stop(),this.forecastFeed.stop(),this.closePopup?.(),this.closePopup=void 0,this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.devPanel?.disconnect(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),Qn(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new Zi({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(e=>{this.onTimeOfDayChanged(e)}),this.config?.enable_day_night_cycle){let e=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(e)}}onTimeOfDayChanged(e){this.config?.enable_day_night_cycle&&(A(this.config?.dev_mode,`Time of day changed to: ${e.timePhase}`),this.updateDayNightBackground(e))}updateDayNightBackground(e){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))return this.timeOfDayManager.getCurrentState().timePhase;let e=this._hass?.states[this.config?.sun_entity||"sun.sun"];if(!e)return"day";let i=e.attributes?.elevation;return Ft(typeof i=="number"?i:Number(i),!!e.attributes?.rising,e.state!=="below_horizon")}applySkyPhase(){let e=this.querySelector(".animated-weather-card");if(!e)return;let i=this.currentSkyPhase();e.dataset.phase!==i&&(e.dataset.phase=i)}applySizeState(){let e=this.querySelector(".animated-weather-card"),i=e?.querySelector(".weather-info");if(!e||!i)return;let n=e.querySelector(".main-weather-info"),a=e.querySelector(".weather-attributes");if(e.dataset.height="regular",a){let y=e.dataset.metrics;e.dataset.metrics="row";let C=Array.from(a.children),S=parseFloat(getComputedStyle(a).columnGap)||0,k=C.reduce((E,M)=>E+M.getBoundingClientRect().width,0)+S*Math.max(0,C.length-1),T=a.clientWidth-k,x=T<-.5||y==="grid"&&T<ko;e.dataset.metrics=x?"grid":"row"}let r=e.dataset.variant==="compact",s=r?e.querySelector(".weather-desc"):null,l=e.querySelector(".weather-note"),c=e.querySelector(".awc-forecast"),d=e.querySelector(".main-weather-info > .awc-clock"),h=e.querySelector(".awc-hl-line:not([hidden])"),m=e.querySelector(".weather-desc"),p=e.clientWidth>=640;this.applyClockPlace(e,n);let g=!!l&&!l.hidden,u=c&&!c.hidden?this.forecastLevels(c):null,f=()=>!!h&&!!m&&h.offsetTop>m.offsetTop+4,w=kc(g,u,!!d,!!h),_=y=>{e.dataset.height=y.height,g?e.dataset.note=y.note:delete e.dataset.note,u?e.dataset.forecast=y.forecast:delete e.dataset.forecast,d?e.dataset.clock=y.clock:delete e.dataset.clock,y.range?e.dataset.range=y.range:delete e.dataset.range},v=!0;if(u){_(w[0]);let y=this.getBoundingClientRect().height;_(w[w.length-1]),v=Math.abs(this.getBoundingClientRect().height-y)<1}let b=y=>i.scrollHeight>i.clientHeight+1||!r&&!!n&&n.scrollHeight>n.clientHeight+1||!!s&&s.scrollWidth>s.clientWidth+1||g&&l.scrollHeight>l.clientHeight+1||p&&!!n&&!!n.firstElementChild&&n.firstElementChild.getBoundingClientRect().top<n.getBoundingClientRect().top-1||!!u&&!p&&y.forecast!=="none"&&(v||u.roomy.includes(y.forecast)&&y.forecast!==u.roomy[u.roomy.length-1])&&c.getBoundingClientRect().top-e.getBoundingClientRect().top<xc*e.clientHeight||f()&&y.range!=="none"&&["short","snug","tight","minimal"].includes(y.height);for(let y of w)if(_(y),!b(y))return}forecastLevels(e){let i=a=>(e.dataset[a]??"").split(" ").filter(Boolean),n=e.dataset.keep;return n?{roomy:i("roomy"),keep:n,drop:i("drop")}:{roomy:[],keep:"all",drop:[]}}applyClockPlace(e,i){let n=e.querySelector(".main-weather-info > .awc-clock");if(n&&i&&e.clientWidth>=640){let r=i.querySelector(".temperature"),s=e.dataset.clockPlace;e.dataset.clockPlace="beside";let l=(r?.getBoundingClientRect().width??0)+32+n.getBoundingClientRect().width,c=i.clientWidth-l;e.dataset.clockPlace=c<0||s==="below"&&c<ko?"below":"beside"}else delete e.dataset.clockPlace;if(delete e.dataset.clockDate,n&&e.dataset.clockPlace!=="beside"){let r=n.querySelector(".awc-clock-date");r&&r.getBoundingClientRect().right-e.getBoundingClientRect().left>Sc*e.clientWidth&&(e.dataset.clockDate="none")}let a=e.querySelector(".awc-headline");if(delete e.dataset.headline,a)for(let r of["time-date","time"]){if(a.scrollWidth<=a.clientWidth+1)break;e.dataset.headline=r}}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:this.noteEnabled()?{columns:12,rows:5,min_columns:6,min_rows:3}:{columns:12,rows:4,min_columns:6,min_rows:3}}getCardSize(){if(this.config?.compact)return 2;let e=3;return this.config?.show_indoor!==!1&&(e+=1),this.config?.show_attributes!==!1&&(e+=1),this.noteEnabled()&&(e+=1),e}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await $t("animated-weather-card-editor"),document.createElement("animated-weather-card-editor")}};customElements.define("animated-weather-card",va);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!0,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card",getEntitySuggestion:(o,t)=>t.startsWith("weather.")?[{label:"Regular",config:{type:"custom:animated-weather-card",...ba(t,o)}},{label:"Compact",config:{type:"custom:animated-weather-card",...ba(t,o),compact:!0}}]:null});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let o=lt("sunny","day"),t=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${Mr} `,[`background: linear-gradient(90deg, ${o.top}, ${o.mid} 55%, ${o.bottom})`,`color: ${He(Ce(Lt))}`,"border-radius: 4px 0 0 4px",...t].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${o.top}`,"border-radius: 0 4px 4px 0",...t].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
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
