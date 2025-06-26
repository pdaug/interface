import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-DQLiH3RP.js";import{a as x}from"./Badge-BKalkeN7.js";import{P as w}from"./Profile-BsT31ePo.js";import{T as o}from"./Table-Chz7YusX.js";import{C as k}from"./Align-BXKIus7I.js";import"./Avatar-KQlzqCkx.js";import"./Dropdown-B2VCto3_.js";import"./IconBase-DM5o4K-0.js";import"./Tooltip-XHa1yek-.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";import"./Input-DRRgvZdm.js";const O={title:"Components/Table",component:o,tags:["autodocs"],decorators:e=>a.jsx(k,{children:a.jsx(e,{})})},l={123:{name:"Edward Cullen",description:"Product Designer",photo:"https://randomuser.me/api/portraits/men/75.jpg"}},d={status:{label:"Status",maxWidth:"96px",handler:function(e){return a.jsx(x,{category:e.status?"Success":"Danger",value:e.status?"Active":"Disabled"})}},name:{label:"Name"},model:{label:"Model"},description:{label:"Description"},userId:{label:"Owner",maxWidth:"18%",handler:function(e){const t=l==null?void 0:l[e.userId];return a.jsx(w,{padding:!1,name:t.name,photo:t.photo,description:t.description,photoSize:3})}},createdAt:{label:"Created at",handler:function(e){return new Date(String(e.createdAt)).toLocaleString()}}},c=[{id:"A123",status:!0,name:"Volkswagen",model:"Taos",description:"Volkswagen is a German automobile manufacturer based in Wolfsburg, Lower Saxony, Germany. Established in 1937 by The German Labour Front, it was revitalized into the global brand it is today after World War II by British Army officer Ivan Hirst. The company is well known for the Beetle and serves as the flagship marque of the Volkswagen Group, which became the world's largest automotive manufacturer by global sales in 2016 and 2017",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"B124",name:"Fiat",model:"500",status:!0,description:"Fiat Automobiles S.p.A., commonly known as simply Fiat, is an Italian automobile manufacturer. It became a part of Fiat Chrysler Automobiles in 2014 and, in 2021, became a subsidiary of Stellantis through its Italian division, Stellantis Europe.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"C125",name:"Renault",model:"Clio",status:!1,description:"Renault S.A., commonly referred to as Groupe Renault, also known as the Renault Group in English), is a French multinational automobile manufacturer established in 1899. The company currently produces a range of cars and vans. It has manufactured trucks, tractors, tanks, buses/coaches, aircraft and aircraft engines, as well as autorail vehicles.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"},{id:"D126",name:"Peugeot",model:"206",status:!1,description:"The family business that preceded the current Peugeot companies was established in 1810, making it the oldest car company in the world. On 20 November 1858, Émile Peugeot applied for the lion trademark. Armand Peugeot (1849-1915) built the company's first vehicle, a steam-powered tricycle. In 1886, the company collaborated with Léon Serpollet, followed by the development of an internal combustion car in 1890, which used a Panhard-Daimler engine.",userId:123,createdAt:"2025-01-01T00:00:00.000Z"}],r={render:()=>{const[e,t]=i.useState([]);return a.jsx(o,{columns:d,data:c,selected:e,setSelected:t,styles:{maxWidth:"60rem"}})}},s={render:()=>{const[e,t]=i.useState([]);return a.jsx(o,{border:!0,columns:d,data:c,selected:e,setSelected:t,styles:{maxWidth:"60rem"}})}},n={render:()=>{const[e,t]=i.useState([]);return a.jsx(o,{border:!0,columns:d,data:c,selected:e,setSelected:t,options:[{id:"1",label:"Paste",onClick:()=>alert("Paste clicked!")},{id:"2",label:"Copy",onClick:()=>alert("Copy clicked!")},{id:"3",label:"Delete",disabled:!0}],styles:{maxWidth:"60rem"}})}};var m,u,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <Table columns={columns} data={data} selected={selected} setSelected={setSelected} styles={{
      maxWidth: "60rem"
    }} />;
  }
}`,...(p=(u=r.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var h,b,f;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <Table border columns={columns} data={data} selected={selected} setSelected={setSelected} styles={{
      maxWidth: "60rem"
    }} />;
  }
}`,...(f=(b=s.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var g,y,S;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(S=(y=n.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};const R=["Default","WithBorder","WithOptions"];export{r as Default,s as WithBorder,n as WithOptions,R as __namedExportsOrder,O as default};
