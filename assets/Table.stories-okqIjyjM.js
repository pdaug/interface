import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{R as n,r as h}from"./index-DQLiH3RP.js";import{a as F}from"./Badge-BKalkeN7.js";import{P as L}from"./Profile-VdGXXxlS.js";import{b as $}from"./IconBase-DM5o4K-0.js";import{T as _}from"./Tooltip-XHa1yek-.js";import{d as Z}from"./Input-Bmji1q52.js";import{D as G}from"./Dropdown-B2VCto3_.js";import{C as z}from"./Align-BXKIus7I.js";import"./Avatar-KQlzqCkx.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";const U=new Map([["bold",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,128,136Zm80-40a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,208,136ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,40a8,8,0,1,1,8-8A8,8,0,0,1,48,136Z"}))],["duotone",n.createElement(n.Fragment,null,n.createElement("path",{d:"M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128ZM48,104a24,24,0,1,0,24,24A24,24,0,0,0,48,104Zm160,0a24,24,0,1,0,24,24A24,24,0,0,0,208,104Z",opacity:"0.2"}),n.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"}))],["fill",n.createElement(n.Fragment,null,n.createElement("path",{d:"M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28,28,0,0,0,208,100Z"}))],["light",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,98a30,30,0,1,0,30,30A30,30,0,0,0,128,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,128,146ZM48,98a30,30,0,1,0,30,30A30,30,0,0,0,48,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,48,146ZM208,98a30,30,0,1,0,30,30A30,30,0,0,0,208,98Zm0,48a18,18,0,1,1,18-18A18,18,0,0,1,208,146Z"}))],["regular",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"}))],["thin",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,100a28,28,0,1,0,28,28A28,28,0,0,0,128,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,128,148ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,48,148Zm160-48a28,28,0,1,0,28,28A28,28,0,0,0,208,100Zm0,48a20,20,0,1,1,20-20A20,20,0,0,1,208,148Z"}))]]);var J=Object.defineProperty,Q=Object.defineProperties,X=Object.getOwnPropertyDescriptors,k=Object.getOwnPropertySymbols,Y=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable,R=(t,e,s)=>e in t?J(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,V=(t,e)=>{for(var s in e||(e={}))Y.call(e,s)&&R(t,s,e[s]);if(k)for(var s of k(e))K.call(e,s)&&R(t,s,e[s]);return t},ee=(t,e)=>Q(t,X(e));const B=h.forwardRef((t,e)=>n.createElement($,ee(V({ref:e},t),{weights:U})));B.displayName="DotsThreeOutline";const m=function({columns:t,data:e,border:s,selected:d,setSelected:i,options:g,styles:O}){var w;const A=e.map(r=>r.id),x=d?A.every(r=>d.includes(r)):!1;return a.jsxs("div",{style:O,className:`table ${s?"tableBorder":""}`,children:[a.jsx("div",{className:"tableHead",children:a.jsxs("div",{className:"tableHeadRow",children:[a.jsx("div",{style:{maxWidth:32},className:"tableHeadData",children:a.jsx(Z,{value:x,onChange:function(){x?i==null||i([]):i==null||i(A)},options:[{id:"all",value:"all",label:""}]})}),(w=Object.entries(t))==null?void 0:w.map(function([r,l],c){return a.jsx("div",{className:"tableHeadData",style:{maxWidth:l==null?void 0:l.maxWidth},children:l.label},`${r}-${c}`)}),g&&a.jsx("div",{style:{maxWidth:32},className:"tableHeadData"})]})}),a.jsx("div",{className:"tableBody",children:e==null?void 0:e.map(function(r,l){var c;return a.jsxs("div",{className:`tableBodyRow ${d!=null&&d.includes(r.id)?"tableBodyRowSelected":""}`,children:[a.jsx("div",{style:{maxWidth:32},className:"tableBodyData",children:a.jsx(Z,{value:d||[],onChange:i,options:[{id:r.id,value:r.id,label:""}]})}),(c=Object.entries(t))==null?void 0:c.map(function([E,o],H){const N=r==null?void 0:r[E],j=o.handler?o.handler(r,l):N;return a.jsx("div",{className:"tableBodyData",style:{maxWidth:o==null?void 0:o.maxWidth},children:o.tooltip?a.jsx(_,{content:o.tooltip,children:j}):j},`${r.id}-${E}-${H}`)}),g&&a.jsx("div",{style:{maxWidth:32},className:"tableBodyData",children:a.jsx(G,{values:g,children:a.jsx("div",{style:{cursor:"pointer"},children:a.jsx(B,{weight:"fill"})})})})]},`${r.id}-${l}`)})})]})};m.__docgenInfo={description:"",methods:[],displayName:"Table",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
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
}[]`},description:""},styles:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};const pe={title:"Components/Table",component:m,tags:["autodocs"],decorators:t=>a.jsx(z,{children:a.jsx(t,{})})},y={123:{name:"Edward Cullen",description:"Product Designer",photo:"https://randomuser.me/api/portraits/men/75.jpg"}},f={status:{label:"Status",maxWidth:"96px",handler:function(t){return a.jsx(F,{category:t.status?"Success":"Danger",value:t.status?"Active":"Disabled"})}},name:{label:"Name"},model:{label:"Model"},description:{label:"Description"},userId:{label:"Owner",maxWidth:"18%",handler:function(t){const e=y==null?void 0:y[t.userId];return a.jsx(L,{padding:!1,name:e.name,photo:e.photo,description:e.description,photoSize:3})}},createdAt:{label:"Created at",handler:function(t){return new Date(String(t.createdAt)).toLocaleString()}}},v=[{id:"A123",status:!0,name:"Volkswagen",model:"Taos",description:"Volkswagen is a German automobile manufacturer based in Wolfsburg, Lower Saxony, Germany. Established in 1937 by The German Labour Front, it was revitalized into the global brand it is today after World War II by British Army officer Ivan Hirst. The company is well known for the Beetle and serves as the flagship marque of the Volkswagen Group, which became the world's largest automotive manufacturer by global sales in 2016 and 2017",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"B124",name:"Fiat",model:"500",status:!0,description:"Fiat Automobiles S.p.A., commonly known as simply Fiat, is an Italian automobile manufacturer. It became a part of Fiat Chrysler Automobiles in 2014 and, in 2021, became a subsidiary of Stellantis through its Italian division, Stellantis Europe.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"C125",name:"Renault",model:"Clio",status:!1,description:"Renault S.A., commonly referred to as Groupe Renault, also known as the Renault Group in English), is a French multinational automobile manufacturer established in 1899. The company currently produces a range of cars and vans. It has manufactured trucks, tractors, tanks, buses/coaches, aircraft and aircraft engines, as well as autorail vehicles.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"D126",name:"Peugeot",model:"206",status:!1,description:"The family business that preceded the current Peugeot companies was established in 1810, making it the oldest car company in the world. On 20 November 1858, Émile Peugeot applied for the lion trademark. Armand Peugeot (1849-1915) built the company's first vehicle, a steam-powered tricycle. In 1886, the company collaborated with Léon Serpollet, followed by the development of an internal combustion car in 1890, which used a Panhard-Daimler engine.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"}],u={render:()=>{const[t,e]=h.useState([]);return a.jsx(m,{columns:f,data:v,selected:t,setSelected:e,styles:{maxWidth:"60rem"}})}},p={render:()=>{const[t,e]=h.useState([]);return a.jsx(m,{border:!0,columns:f,data:v,selected:t,setSelected:e,styles:{maxWidth:"60rem"}})}},b={render:()=>{const[t,e]=h.useState([]);return a.jsx(m,{border:!0,columns:f,data:v,selected:t,setSelected:e,options:[{id:"1",label:"Paste",onClick:()=>alert("Paste clicked!")},{id:"2",label:"Copy",onClick:()=>alert("Copy clicked!")},{id:"3",label:"Delete",disabled:!0}],styles:{maxWidth:"60rem"}})}};var S,T,D;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <Table columns={columns} data={data} selected={selected} setSelected={setSelected} styles={{
      maxWidth: "60rem"
    }} />;
  }
}`,...(D=(T=u.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var M,W,I;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <Table border columns={columns} data={data} selected={selected} setSelected={setSelected} styles={{
      maxWidth: "60rem"
    }} />;
  }
}`,...(I=(W=p.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var C,q,P;b.parameters={...b.parameters,docs:{...(C=b.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <Table border columns={columns} data={data} selected={selected} setSelected={setSelected} options={[{
      id: "1",
      label: "Paste",
      onClick: () => alert(\`Paste clicked!\`)
    }, {
      id: "2",
      label: "Copy",
      onClick: () => alert(\`Copy clicked!\`)
    }, {
      id: "3",
      label: "Delete",
      disabled: true
    }]} styles={{
      maxWidth: "60rem"
    }} />;
  }
}`,...(P=(q=b.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};const be=["Default","WithBorder","WithOptions"];export{u as Default,p as WithBorder,b as WithOptions,be as __namedExportsOrder,pe as default};
