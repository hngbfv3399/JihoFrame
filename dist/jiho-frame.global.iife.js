var JihoFrame=function(l){"use strict";let s={},u=[];function d(a){const e=Object.keys(s).length;s[e]=s[e]??a;const t=new Set;return{get value(){return s[e]},set(r){s[e]=r,u.forEach(n=>n()),t.forEach(n=>n())},subscribe(r){return t.add(r),()=>t.delete(r)}}}function o(a){u.push(a)}function y(a,e){const t=()=>{e.innerHTML="";const c=a();Array.isArray(c.layout)&&c.layout.forEach(r=>{const n=typeof r=="function"?r():r;for(const[i,b]of Object.entries(n)){const h=f(i,b);e.appendChild(h)}})};o(t),t()}function f(a,e){const t=document.createElement(a);if(typeof e=="string")return t.textContent=e,t;e.text&&(t.textContent=e.text),e.style&&Object.assign(t.style,e.style),e.id&&(t.id=e.id),e.className&&(t.className=e.className),Array.isArray(e.event)&&e.event.forEach(c=>{for(const[r,n]of Object.entries(c)){const i=r.toLowerCase().replace(/^on/,"");t.addEventListener(i,n)}});for(const[c,r]of Object.entries(e)){if(["text","style","id","className","event"].includes(c))continue;const n=f(c,r);t.appendChild(n)}return t}return l.createState=d,l.renderApp=y,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}),l}({});
