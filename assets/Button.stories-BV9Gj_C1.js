import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{I as j}from"./Plus-MU5-FXwH.js";import{I as k}from"./Trash-PcOC7TgW.js";import{C as A,H as z}from"./Align-BXKIus7I.js";import{a as c,B as i}from"./Button-CPWqWagk.js";import"./index-DQLiH3RP.js";import"./IconBase-DM5o4K-0.js";const _={title:"Components/Button",component:i,tags:["autodocs"],decorators:e=>t.jsx(A,{children:t.jsx(e,{})}),argTypes:{category:{control:"select",options:c},Icon:{control:!1},onClick:{action:"clicked"}}},r={args:{text:"Default",category:"Success"}},o={render:()=>t.jsx(z,{internal:1,children:c.map(e=>t.jsx(i,{category:e,onClick:()=>alert(`${e} clicked`),text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},a={args:{text:"Add",category:"Success",Icon:j,IconSize:16,IconWeight:"regular",IconPosition:"left"}},n={args:{text:"Delete",category:"Danger",Icon:k,IconSize:16,IconWeight:"regular",IconPosition:"right"}},s={render:()=>t.jsx(z,{internal:1,children:c.map(e=>t.jsx(i,{disabled:!0,category:e,text:e.charAt(0).toUpperCase()+e.slice(1)},e))})};var l,p,u;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    text: "Default",
    category: "Success"
  }
}`,...(u=(p=r.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var g,d,m;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    return <Horizontal internal={1}>
        {ButtonCategoriesList.map(category => <Button key={category} category={category as ButtonCategories} onClick={() => alert(\`\${category} clicked\`)} text={category.charAt(0).toUpperCase() + category.slice(1)} />)}
      </Horizontal>;
  }
}`,...(m=(d=o.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var I,h,x;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    text: "Add",
    category: "Success",
    Icon: Plus,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "left"
  }
}`,...(x=(h=a.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var y,f,C;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    text: "Delete",
    category: "Danger",
    Icon: Trash,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "right"
  }
}`,...(C=(f=n.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var S,B,D;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    return <Horizontal internal={1}>
        {ButtonCategoriesList.map(category => <Button disabled key={category} category={category as ButtonCategories} text={category.charAt(0).toUpperCase() + category.slice(1)} />)}
      </Horizontal>;
  }
}`,...(D=(B=s.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};const $=["Default","All","WithLeftIcon","WithRightIcon","Disabled"];export{o as All,r as Default,s as Disabled,a as WithLeftIcon,n as WithRightIcon,$ as __namedExportsOrder,_ as default};
