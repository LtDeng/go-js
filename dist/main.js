(()=>{"use strict";var e={208:(e,t,n)=>{n.d(t,{A:()=>i});var o=n(601),r=n.n(o),a=n(314),c=n.n(a)()(r());c.push([e.id,"body {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  font-family: Arial, sans-serif;\n  background-color: #f5f5dc; /* Light tan background for the page */\n}\n\ncanvas {\n  border: 1px solid black;\n  background-color: #d2b48c; /* Tan color for the Go board */\n}\n\nbutton, input {\n  margin: 10px;\n}\n",""]);const i=c},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",o=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),o&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),o&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,o,r,a){"string"==typeof e&&(e=[[null,e,void 0]]);var c={};if(o)for(var i=0;i<this.length;i++){var s=this[i][0];null!=s&&(c[s]=!0)}for(var l=0;l<e.length;l++){var d=[].concat(e[l]);o&&c[d[0]]||(void 0!==a&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=a),n&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=n):d[2]=n),r&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=r):d[4]="".concat(r)),t.push(d))}},t}},601:e=>{e.exports=function(e){return e[1]}},72:e=>{var t=[];function n(e){for(var n=-1,o=0;o<t.length;o++)if(t[o].identifier===e){n=o;break}return n}function o(e,o){for(var a={},c=[],i=0;i<e.length;i++){var s=e[i],l=o.base?s[0]+o.base:s[0],d=a[l]||0,u="".concat(l," ").concat(d);a[l]=d+1;var p=n(u),f={css:s[1],media:s[2],sourceMap:s[3],supports:s[4],layer:s[5]};if(-1!==p)t[p].references++,t[p].updater(f);else{var y=r(f,o);o.byIndex=i,t.splice(i,0,{identifier:u,updater:y,references:1})}c.push(u)}return c}function r(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,r){var a=o(e=e||[],r=r||{});return function(e){e=e||[];for(var c=0;c<a.length;c++){var i=n(a[c]);t[i].references--}for(var s=o(e,r),l=0;l<a.length;l++){var d=n(a[l]);0===t[d].references&&(t[d].updater(),t.splice(d,1))}a=s}}},659:e=>{var t={};e.exports=function(e,n){var o=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(n)}},540:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},56:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},825:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var o="";n.supports&&(o+="@supports (".concat(n.supports,") {")),n.media&&(o+="@media ".concat(n.media," {"));var r=void 0!==n.layer;r&&(o+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),o+=n.css,r&&(o+="}"),n.media&&(o+="}"),n.supports&&(o+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(o,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},113:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={id:o,exports:{}};return e[o](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nc=void 0;var o=n(72),r=n.n(o),a=n(825),c=n.n(a),i=n(659),s=n.n(i),l=n(56),d=n.n(l),u=n(540),p=n.n(u),f=n(113),y=n.n(f),h=n(208),m={};m.styleTagTransform=y(),m.setAttributes=d(),m.insert=s().bind(null,"head"),m.domAPI=c(),m.insertStyleElement=p(),r()(h.A,m),h.A&&h.A.locals&&h.A.locals;const v=document.getElementById("goBoard"),g=v.getContext("2d"),b=v.width/18,x=document.getElementById("startButton"),k=document.getElementById("undoButton"),S=document.getElementById("joinButton"),w=document.getElementById("sessionId"),I=document.getElementById("sessionDisplay");let C,E,T,A=Array(19).fill().map((()=>Array(19).fill(null))),M="black",O=[],D=0,N=!1;function P(){g.strokeStyle="black";for(let e=0;e<19;e++)g.beginPath(),g.moveTo(e*b,0),g.lineTo(e*b,v.height),g.stroke(),g.beginPath(),g.moveTo(0,e*b),g.lineTo(v.width,e*b),g.stroke();[[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]].forEach((([e,t])=>{!function(e,t){g.beginPath(),g.arc(e*b,t*b,b/6,0,2*Math.PI),g.fillStyle="black",g.fill()}(e,t)}))}function B(e,t,n){g.beginPath(),g.arc(e*b,t*b,b/2-2,0,2*Math.PI),g.fillStyle=n,g.fill(),g.stroke()}function L(){C=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),E=C.createDataChannel("game"),E.onmessage=e=>{const t=JSON.parse(e.data);"move"===t.type&&(A[t.y][t.x]=t.player,B(t.x,t.y,t.player),O.push({x:t.x,y:t.y,player:t.player}),M="black"===t.player?"white":"black")},C.onicecandidate=e=>{e.candidate&&T.send(JSON.stringify({type:"candidate",candidate:e.candidate}))},C.ondatachannel=e=>{E=e.channel,E.onmessage=e=>{const t=JSON.parse(e.data);"move"===t.type&&(A[t.y][t.x]=t.player,B(t.x,t.y,t.player),O.push({x:t.x,y:t.y,player:t.player}),M="black"===t.player?"white":"black")}}}v.addEventListener("click",(e=>{const t=Math.round(e.offsetX/b),n=Math.round(e.offsetY/b);N?null===A[n][t]&&(A[n][t]=M,B(t,n,M),O.push({x:t,y:n,player:M}),M="black"===M?"white":"black",E.send(JSON.stringify({type:"move",x:t,y:n,player:M}))):(D<9&&null===A[n][t]&&(A[n][t]="black",B(t,n,"black"),O.push({x:t,y:n,player:"black"}),D++),9===D&&(N=!0,M="white"))})),x.addEventListener("click",(function(){L();const e=Math.random().toString(36).substr(2,9);I.textContent=`Session ID: ${e}`,C.createOffer().then((e=>C.setLocalDescription(e))).then((()=>{T.send(JSON.stringify({type:"offer",offer:C.localDescription,sessionId:e}))}))})),k.addEventListener("click",(function(){if(O.length>0){const e=O.pop();A[e.y][e.x]=null,g.clearRect(0,0,v.width,v.height),P(),O.forEach((e=>{B(e.x,e.y,e.player)})),M=e.player,N||D--}})),S.addEventListener("click",(()=>{var e;e=w.value,L(),T.send(JSON.stringify({type:"join",sessionId:e}))})),T=new WebSocket("ws://localhost:8080"),T.onopen=()=>{console.log("WebSocket connection established")},T.onmessage=function(e){console.log(e);const t=JSON.parse(e.data);"offer"===t.type?C.setRemoteDescription(new RTCSessionDescription(t.offer)).then((()=>C.createAnswer())).then((e=>C.setLocalDescription(e))).then((()=>{T.send(JSON.stringify({type:"answer",answer:C.localDescription}))})):"answer"===t.type?C.setRemoteDescription(new RTCSessionDescription(t.answer)):"candidate"===t.type&&C.addIceCandidate(new RTCIceCandidate(t.candidate))},T.onerror=e=>{console.error("WebSocket error:",e)},T.onclose=()=>{console.log("WebSocket connection closed")},P()})();