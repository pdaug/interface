import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{R as t,r as P}from"./index-DQLiH3RP.js";import{b as O}from"./IconBase-DM5o4K-0.js";import{I as z}from"./Trash-PcOC7TgW.js";import{C as M,H as B}from"./Align-BXKIus7I.js";import{a as p,B as m}from"./Button-CPWqWagk.js";const k=new Map([["bold",t.createElement(t.Fragment,null,t.createElement("path",{d:"M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"}))],["duotone",t.createElement(t.Fragment,null,t.createElement("path",{d:"M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",opacity:"0.2"}),t.createElement("path",{d:"M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"}))],["fill",t.createElement(t.Fragment,null,t.createElement("path",{d:"M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"}))],["light",t.createElement(t.Fragment,null,t.createElement("path",{d:"M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"}))],["regular",t.createElement(t.Fragment,null,t.createElement("path",{d:"M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"}))],["thin",t.createElement(t.Fragment,null,t.createElement("path",{d:"M220,128a4,4,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4,4,0,0,1,220,128Z"}))]]);var W=Object.defineProperty,Z=Object.defineProperties,w=Object.getOwnPropertyDescriptors,u=Object.getOwnPropertySymbols,F=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable,g=(e,r,a)=>r in e?W(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a,L=(e,r)=>{for(var a in r||(r={}))F.call(r,a)&&g(e,a,r[a]);if(u)for(var a of u(r))R.call(r,a)&&g(e,a,r[a]);return e},_=(e,r)=>Z(e,w(r));const D=P.forwardRef((e,r)=>t.createElement(O,_(L({ref:r},e),{weights:k})));D.displayName="Plus";const J={title:"Components/Button",component:m,tags:["autodocs"],decorators:e=>o.jsx(M,{children:o.jsx(e,{})}),argTypes:{category:{control:"select",options:p},Icon:{control:!1},onClick:{action:"clicked"}}},n={args:{text:"Default",category:"Success"}},c={render:()=>o.jsx(B,{internal:1,children:p.map(e=>o.jsx(m,{category:e,onClick:()=>alert(`${e} clicked`),text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},s={args:{text:"Add",category:"Success",Icon:D,IconSize:16,IconWeight:"regular",IconPosition:"left"}},l={args:{text:"Delete",category:"Danger",Icon:z,IconSize:16,IconWeight:"regular",IconPosition:"right"}},i={render:()=>o.jsx(B,{internal:1,children:p.map(e=>o.jsx(m,{disabled:!0,category:e,text:e.charAt(0).toUpperCase()+e.slice(1)},e))})};var d,h,f;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    text: "Default",
    category: "Success"
  }
}`,...(f=(h=n.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var y,I,H;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    return <Horizontal internal={1}>
        {ButtonCategoriesList.map(category => <Button key={category} category={category as ButtonCategories} onClick={() => alert(\`\${category} clicked\`)} text={category.charAt(0).toUpperCase() + category.slice(1)} />)}
      </Horizontal>;
  }
}`,...(H=(I=c.parameters)==null?void 0:I.docs)==null?void 0:H.source}}};var x,v,E;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    text: "Add",
    category: "Success",
    Icon: Plus,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "left"
  }
}`,...(E=(v=s.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};var b,A,V;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    text: "Delete",
    category: "Danger",
    Icon: Trash,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "right"
  }
}`,...(V=(A=l.parameters)==null?void 0:A.docs)==null?void 0:V.source}}};var C,j,S;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return <Horizontal internal={1}>
        {ButtonCategoriesList.map(category => <Button disabled key={category} category={category as ButtonCategories} text={category.charAt(0).toUpperCase() + category.slice(1)} />)}
      </Horizontal>;
  }
}`,...(S=(j=i.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};const K=["Default","All","WithLeftIcon","WithRightIcon","Disabled"];export{c as All,n as Default,i as Disabled,s as WithLeftIcon,l as WithRightIcon,K as __namedExportsOrder,J as default};
