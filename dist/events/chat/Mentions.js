"use strict";var D=Object.create;var l=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,M=Object.prototype.hasOwnProperty;var $=(n,e)=>{for(var t in e)l(n,t,{get:e[t],enumerable:!0})},p=(n,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of I(e))!M.call(n,r)&&r!==t&&l(n,r,{get:()=>e[r],enumerable:!(s=f(e,r))||s.enumerable});return n};var m=(n,e,t)=>(t=n!=null?D(L(n)):{},p(e||!n||!n.__esModule?l(t,"default",{value:n,enumerable:!0}):t,n)),y=n=>p(l({},"__esModule",{value:!0}),n),h=(n,e,t,s)=>{for(var r=s>1?void 0:s?f(e,t):e,o=n.length-1,a;o>=0;o--)(a=n[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&l(e,t,r),r},d=(n,e)=>(t,s)=>e(t,s,n);var T={};$(T,{default:()=>H});module.exports=y(T);var C=m(require("../../lib/decorators/MessageListener")),c=require("../../lib/filter"),g=m(require("../../lib/decorators/Message")),u=m(require("../../constants")),x=m(require("../../lib/decorators/Client"));let i=class{async handler(e,t){const r=e.mentions.users.map(a=>a.id),o=t.channels.cache.find(a=>a.id===u.default.notifyChannel);r.forEach(a=>{o.send(`<@${e.author.id}> \u0111\xE3 tag <@${a}> t\u1EA1i channel <#${e.channelId}>`)})}};h([d(0,(0,g.default)()),d(1,x.default)],i.prototype,"handler",1),i=h([(0,C.default)([c.Filter.includes("@"),c.Filter.not(c.Filter.startWith("*"))])],i);var H=i;
