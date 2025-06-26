import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{B as c}from"./Button-CPWqWagk.js";import{C as j,H as T}from"./Align-BXKIus7I.js";import{T as a}from"./Tooltip-XHa1yek-.js";import"./index-DQLiH3RP.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";const b={title:"Components/Tooltip",component:a,tags:["autodocs"],decorators:o=>t.jsx(j,{children:t.jsx(o,{})})},r={render:()=>t.jsx(a,{content:"Tooltip message",children:t.jsx(c,{text:"Hover me",category:"Success"})})},n={render:()=>{const o=["top","bottom","left","right"];return t.jsx(T,{internal:1,children:o.map(e=>t.jsx(a,{theme:"light",content:`Tooltip ${e}`,placement:e,children:t.jsx(c,{text:e,category:"Success"})},e))})}},s={render:()=>{const o=["top","bottom","left","right"];return t.jsx(T,{internal:1,children:o.map(e=>t.jsx(a,{theme:"dark",content:`Tooltip ${e}`,placement:e,children:t.jsx(c,{text:e,category:"Success"})},e))})}};var p,l,m;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Tooltip content="Tooltip message">
      <Button text="Hover me" category="Success" />
    </Tooltip>
}`,...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var i,d,u;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return <Horizontal internal={1}>
        {placements.map(placement => <Tooltip theme="light" key={placement} content={\`Tooltip \${placement}\`} placement={placement as TooltipPlacement}>
            <Button text={placement} category="Success" />
          </Tooltip>)}
      </Horizontal>;
  }
}`,...(u=(d=n.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,x,h;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return <Horizontal internal={1}>
        {placements.map(placement => <Tooltip theme="dark" key={placement} content={\`Tooltip \${placement}\`} placement={placement as TooltipPlacement}>
            <Button text={placement} category="Success" />
          </Tooltip>)}
      </Horizontal>;
  }
}`,...(h=(x=s.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};const D=["Default","Light","Dark"];export{s as Dark,r as Default,n as Light,D as __namedExportsOrder,b as default};
