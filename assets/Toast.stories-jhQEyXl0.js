import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{T as r,t as c}from"./Toast-BeI45n8t.js";import{C as m,V as p}from"./Align-BXKIus7I.js";import{B as l}from"./Button-BWtuNQej.js";import"./index-DQLiH3RP.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";import"./WarningOctagon-BQjrwpCv.js";import"./IconBase-DM5o4K-0.js";const B={title:"components/Toast",component:r,tags:["autodocs"],decorators:t=>o.jsxs(m,{children:[o.jsx(r,{}),o.jsx(t,{})]})},u=[{category:"Success",name:"success"},{category:"Info",name:"info"},{category:"Warning",name:"warning"},{category:"Danger",name:"error"},{category:"Neutral",name:"message"}],e=()=>o.jsx(p,{internal:1,children:u.map(function({category:t,name:i}){return o.jsx(l,{text:t,category:t,onClick:()=>c[i]("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")},t)})});e.__docgenInfo={description:"",methods:[],displayName:"All"};var s,a,n;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  return <Vertical internal={1}>
      {toasts.map(function ({
      category,
      name
    }) {
      return <Button key={category} text={category} category={category as ButtonCategories} onClick={() => toast[name as toastTypes]("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")} />;
    })}
    </Vertical>;
}`,...(n=(a=e.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const V=["All"];export{e as All,V as __namedExportsOrder,B as default};
