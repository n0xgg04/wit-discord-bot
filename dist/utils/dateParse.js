"use strict";var f=Object.defineProperty;var o=Object.getOwnPropertyDescriptor;var s=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var a=(e,t)=>{for(var n in t)f(e,n,{get:t[n],enumerable:!0})},g=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of s(t))!D.call(e,r)&&r!==n&&f(e,r,{get:()=>t[r],enumerable:!(i=o(t,r))||i.enumerable});return e};var p=e=>g(f({},"__esModule",{value:!0}),e);var c={};a(c,{default:()=>u});module.exports=p(c);function u(e){return typeof e=="string"?new Date(e):e}
