import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-DQLiH3RP.js";import{C as B,H as C}from"./Align-BXKIus7I.js";import{B as f,a as n}from"./Badge-BKalkeN7.js";const D={title:"Components/Badge",component:n,decorators:e=>a.jsx(B,{children:a.jsx(e,{})}),tags:["autodocs"],argTypes:{category:{control:"select",options:f}}},t={args:{id:"default-badge",value:"Default",category:"Success"}},r={render:()=>a.jsx(C,{internal:1,children:f.map(e=>a.jsx(n,{category:e,value:e.charAt(0).toUpperCase()+e.slice(1)},e))})},o={render:function(s){const[h,b]=y.useState(s.value);return a.jsx(n,{...s,value:h,onChange:x=>b(x.target.value)})},args:{id:"badge-with-options",value:"opt1",category:"Info",options:[{id:"1",value:"opt1",label:"Option 1"},{id:"2",value:"opt2",label:"Option 2"},{id:"3",value:"opt3",label:"Option 3"}]}};var l,i,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    id: "default-badge",
    value: "Default",
    category: "Success"
  }
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var u,p,d;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    return <Horizontal internal={1}>
        {BadgeCategoriesList.map(category => <Badge key={category} category={category} value={category.charAt(0).toUpperCase() + category.slice(1)} />)}
      </Horizontal>;
  }
}`,...(d=(p=r.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var g,m,v;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: function BadgeWithState(args) {
    const [value, setValue] = useState(args.value);
    return <Badge {...args} value={value} onChange={e => setValue(e.target.value)} />;
  },
  args: {
    id: "badge-with-options",
    value: "opt1",
    category: "Info",
    options: [{
      id: "1",
      value: "opt1",
      label: "Option 1"
    }, {
      id: "2",
      value: "opt2",
      label: "Option 2"
    }, {
      id: "3",
      value: "opt3",
      label: "Option 3"
    }]
  }
}`,...(v=(m=o.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};const H=["Default","All","WithOptions"];export{r as All,t as Default,o as WithOptions,H as __namedExportsOrder,D as default};
