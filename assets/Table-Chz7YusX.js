import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{R as a,r as R}from"./index-DQLiH3RP.js";import{b as j}from"./IconBase-DM5o4K-0.js";import{T as M}from"./Tooltip-XHa1yek-.js";import{d as h}from"./Input-DRRgvZdm.js";import{D as w}from"./Dropdown-B2VCto3_.js";const T=new Map([["bold",a.createElement(a.Fragment,null,a.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,128,136Zm80-40a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,208,136ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,48,136Z"}))],["duotone",a.createElement(a.Fragment,null,a.createElement("path",{d:"M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128ZM48,104a24,24,0,1,0,24,24A24,24,0,0,0,48,104Zm160,0a24,24,0,1,0,24,24A24,24,0,0,0,208,104Z",opacity:"0.2"}),a.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"}))],["fill",a.createElement(a.Fragment,null,a.createElement("path",{d:"M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28,28,0,0,0,208,100Z"}))],["light",a.createElement(a.Fragment,null,a.createElement("path",{d:"M128,98a30,30,0,1,0,30,30A30,30,0,0,0,128,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,128,146ZM48,98a30,30,0,1,0,30,30A30,30,0,0,0,48,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,48,146ZM208,98a30,30,0,1,0,30,30A30,30,0,0,0,208,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,208,146Z"}))],["regular",a.createElement(a.Fragment,null,a.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"}))],["thin",a.createElement(a.Fragment,null,a.createElement("path",{d:"M128,100a28,28,0,1,0,28,28A28,28,0,0,0,128,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,128,148ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,48,148Zm160-48a28,28,0,1,0,28,28A28,28,0,0,0,208,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,208,148Z"}))]]);var k=Object.defineProperty,q=Object.defineProperties,D=Object.getOwnPropertyDescriptors,v=Object.getOwnPropertySymbols,H=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable,A=(r,e,i)=>e in r?k(r,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[e]=i,B=(r,e)=>{for(var i in e||(e={}))H.call(e,i)&&A(r,i,e[i]);if(v)for(var i of v(e))N.call(e,i)&&A(r,i,e[i]);return r},O=(r,e)=>q(r,D(e));const f=R.forwardRef((r,e)=>a.createElement(j,O(B({ref:e},r),{weights:T})));f.displayName="DotsThreeOutline";const I=function({columns:r,data:e,border:i,selected:o,setSelected:s,options:u,styles:E}){var b;const c=e.map(t=>t.id),p=o?c.every(t=>o.includes(t)):!1;return n.jsxs("div",{style:E,className:`table ${i?"tableBorder":""}`,children:[n.jsx("div",{className:"tableHead",children:n.jsxs("div",{className:"tableHeadRow",children:[n.jsx("div",{style:{maxWidth:32},className:"tableHeadData",children:n.jsx(h,{value:p,onChange:function(){p?s==null||s([]):s==null||s(c)},options:[{id:"all",value:"all",label:""}]})}),(b=Object.entries(r))==null?void 0:b.map(function([t,l],d){return n.jsx("div",{className:"tableHeadData",style:{maxWidth:l==null?void 0:l.maxWidth},children:l.label},`${t}-${d}`)}),u&&n.jsx("div",{style:{maxWidth:32},className:"tableHeadData"})]})}),n.jsx("div",{className:"tableBody",children:e==null?void 0:e.map(function(t,l){var d;return n.jsxs("div",{className:`tableBodyRow ${o!=null&&o.includes(t.id)?"tableBodyRowSelected":""}`,children:[n.jsx("div",{style:{maxWidth:32},className:"tableBodyData",children:n.jsx(h,{value:o||[],onChange:s,options:[{id:t.id,value:t.id,label:""}]})}),(d=Object.entries(r))==null?void 0:d.map(function([g,m],Z){const x=t==null?void 0:t[g],y=m.handler?m.handler(t,l):x;return n.jsx("div",{className:"tableBodyData",style:{maxWidth:m==null?void 0:m.maxWidth},children:m.tooltip?n.jsx(M,{content:m.tooltip,children:y}):y},`${t.id}-${g}-${Z}`)}),u&&n.jsx("div",{style:{maxWidth:32},className:"tableBodyData",children:n.jsx(w,{values:u,children:n.jsx("div",{style:{cursor:"pointer"},children:n.jsx(f,{weight:"fill"})})})})]},`${t.id}-${l}`)})})]})};I.__docgenInfo={description:"",methods:[],displayName:"Table",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  [key: string]: string | number | boolean;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number | boolean",elements:[{name:"string"},{name:"number"},{name:"boolean"}],required:!0}}]}}],raw:"TableData[]"},description:""},columns:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  [key: string]: {
    label: string;
    tooltip?: string;
    maxWidth?: number | string;
    handler?: (
      data: TableData,
      index: number,
    ) => React.ReactElement | number | string;
  };
}`,signature:{properties:[{key:{name:"string"},value:{name:"signature",type:"object",raw:`{
  label: string;
  tooltip?: string;
  maxWidth?: number | string;
  handler?: (
    data: TableData,
    index: number,
  ) => React.ReactElement | number | string;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"tooltip",value:{name:"string",required:!1}},{key:"maxWidth",value:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}],required:!1}},{key:"handler",value:{name:"signature",type:"function",raw:`(
  data: TableData,
  index: number,
) => React.ReactElement | number | string`,signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  id: string;
  [key: string]: string | number | boolean;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number | boolean",elements:[{name:"string"},{name:"number"},{name:"boolean"}],required:!0}}]}},name:"data"},{type:{name:"number"},name:"index"}],return:{name:"union",raw:"React.ReactElement | number | string",elements:[{name:"ReactReactElement",raw:"React.ReactElement"},{name:"number"},{name:"string"}]}},required:!1}}]},required:!0}}]}},description:""},border:{required:!1,tsType:{name:"boolean"},description:""},selected:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},setSelected:{required:!1,tsType:{name:"ReactDispatch",raw:"React.Dispatch<React.SetStateAction<string[]>>",elements:[{name:"ReactSetStateAction",raw:"React.SetStateAction<string[]>",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"}]}]},description:""},options:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"Icon",value:{name:"PhosphorIcons",required:!1}},{key:"onClick",value:{name:"ReactEventHandler",raw:"React.EventHandler<React.MouseEvent<HTMLButtonElement>>",elements:[{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLButtonElement>",elements:[{name:"HTMLButtonElement"}]}],required:!1}}]}}],raw:`{
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[]`},description:""},styles:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};export{I as T};
