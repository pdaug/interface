import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as u}from"./index-DQLiH3RP.js";import{P as n}from"./Pagination-BRs2Oksn.js";import{C as d,V as l}from"./Align-BXKIus7I.js";import"./IconBase-DM5o4K-0.js";import"./CaretRight-CIt0Izt5.js";const h={title:"Components/Pagination",tags:["autodocs"],component:n,decorators:e=>t.jsx(d,{children:t.jsx(e,{})})},a={render:()=>{const[e,s]=u.useState(1);return t.jsx(l,{internal:1,children:t.jsx(n,{pageCurrent:e,pageSize:10,itemsTotal:42,setPage:s})})}},r={render:()=>{const[e,s]=u.useState(1);return t.jsx(n,{data:!0,pageCurrent:e,pageSize:10,itemsTotal:42,setPage:s})}};var o,i,p;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <Vertical internal={1}>
        <Pagination pageCurrent={page} pageSize={10} itemsTotal={42} setPage={setPage} />
      </Vertical>;
  }
}`,...(p=(i=a.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var g,c,m;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination data pageCurrent={page} pageSize={10} itemsTotal={42} setPage={setPage} />;
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const z=["Default","WithData"];export{a as Default,r as WithData,z as __namedExportsOrder,h as default};
