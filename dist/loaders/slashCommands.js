"use strict";var V=Object.create;var c=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var x=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var k=(s,t)=>{for(var n in t)c(s,n,{get:t[n],enumerable:!0})},g=(s,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of I(t))!D.call(s,e)&&e!==n&&c(s,e,{get:()=>t[e],enumerable:!(a=y(t,e))||a.enumerable});return s};var O=(s,t,n)=>(n=s!=null?V(x(s)):{},g(t||!s||!s.__esModule?c(n,"default",{value:s,enumerable:!0}):n,s)),A=s=>g(c({},"__esModule",{value:!0}),s);var _={};k(_,{loadSlashCommands:()=>$});module.exports=A(_);var o=O(require("path")),E=require("../env"),N=require("discord.js"),b=O(require("fs-extra")),d=require("../lib/logger");const L=o.default.join(__dirname,"../commands/slash"),R=E.env.NODE_ENV!=="production",p=R?".ts":".js";async function $(){const s=[],t=[],a=(await b.default.readdir(L,{recursive:!0})).map(e=>e.toString()).filter(e=>e.endsWith(p));for(const e of a){const h=o.default.basename(e,p),w=o.default.dirname(e).replaceAll(o.default.sep,"/");try{const m=await import(`../commands/slash/${e}`),l=m.default?.default?m.default:m;if(!l.default)continue;const{command:M,config:i}=l.default;if(!i){d.Logger.error(`Missing config in slash command "${h}"`);continue}i?.name==null&&(i.name=h),i.fileName=e;const C=w.split("/"),u=C.findIndex(S=>!S.startsWith("(")&&!S.endsWith(")")),f=u!==-1?C.slice(u).join("/").trim():void 0;f&&f!=="."&&(i.category=f),s.push(T(i,M)),t.push(i)}catch(m){d.Logger.error(`Error loading slash command "${h}": 
	${m}`)}}return d.Logger.debug(`Loaded ${s.length} slash commands`),{slashCommands:s,slashConfigs:t}}function T(s,t){const n=new N.SlashCommandBuilder;if(!s.name)throw new Error("Missing name in slash command");if(n.setName(s.name),!s.description)throw new Error(`Missing description in slash command '${s.name}'`);return n.setDescription(s.description),n.setDefaultMemberPermissions(t.permissions),n.setNSFW(s.nsfw??!1),s.options&&F(n,s.options),n}function F(s,t){t.forEach(n=>{switch(n.type){case"STRING":{s.addStringOption(a=>{const e=n;return r(a,e),e.choices&&a.addChoices(...e.choices),a});break}case"INTEGER":{s.addIntegerOption(a=>{const e=n;return r(a,e),e.choices&&a.addChoices(...e.choices),e.minValue&&a.setMinValue(e.minValue),e.maxValue&&a.setMaxValue(e.maxValue),a});break}case"NUMBER":s.addNumberOption(a=>{const e=n;return r(a,n),e.choices&&a.addChoices(...e.choices),e.minValue&&a.setMinValue(e.minValue),e.maxValue&&a.setMaxValue(e.maxValue),a});case"BOOLEAN":{s.addBooleanOption(a=>(r(a,n),a));break}case"USER":{s.addUserOption(a=>(r(a,n),a));break}case"CHANNEL":{s.addChannelOption(a=>(r(a,n),a));break}case"ROLE":{s.addRoleOption(a=>(r(a,n),a));break}case"MENTIONABLE":{s.addMentionableOption(a=>(r(a,n),a));break}case"ATTACHMENT":{s.addAttachmentOption(a=>(r(a,n),a));break}default:throw new Error(`Invalid option type '${n.type}'`)}})}function r(s,t){if(!t.name)throw new Error("Missing name in slash command option");if(s.setName(t.name),!t.description)throw new Error(`Missing description in slash command '${s.name}'`);s.setDescription(t.description),t.required&&s.setRequired(t.required)}0&&(module.exports={loadSlashCommands});
