import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as S}from"./index-DQLiH3RP.js";import{l as j}from"./CaretRight-CIt0Izt5.js";import{C as A}from"./Align-BXKIus7I.js";import"./IconBase-DM5o4K-0.js";const k=function({links:r}){return e.jsx("div",{className:"breadcrumb",children:r==null?void 0:r.map(function({id:s,label:i,url:l,target:y,styles:o},c){return e.jsxs(S.Fragment,{children:[c!=0&&r.length!=c&&e.jsx(j,{}),e.jsx("div",{id:s,children:l?e.jsx("a",{href:l,style:o,target:y,children:i}):e.jsx("span",{style:o,children:i})})]},s)})})};k.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  label: string;
  url?: string;
  target?: React.HTMLAttributeAnchorTarget;
  styles?: React.CSSProperties;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"url",value:{name:"string",required:!1}},{key:"target",value:{name:"ReactHTMLAttributeAnchorTarget",raw:"React.HTMLAttributeAnchorTarget",required:!1}},{key:"styles",value:{name:"ReactCSSProperties",raw:"React.CSSProperties",required:!1}}]}}],raw:`{
  id: string;
  label: string;
  url?: string;
  target?: React.HTMLAttributeAnchorTarget;
  styles?: React.CSSProperties;
}[]`},description:""}}};const H={title:"Components/Breadcrumb",component:k,tags:["autodocs"],decorators:r=>e.jsx(A,{children:e.jsx(r,{})})},a={args:{links:[{id:"home",label:"Home",url:"/"},{id:"financial",label:"Financial"}]}},n={args:{links:[{id:"home",label:"Home",url:"/"},{id:"corporation",label:"Corporation",url:"/corporation"},{id:"workspace",label:"Workspace",url:"/corporation/workspace"},{id:"users",label:"Users"}]}},t={args:{links:[{id:"settings",label:"Settings",url:"/settings"},{id:"externals",label:"Externals",url:"/externals"},{id:"api",label:"API",url:"https://docs.example.com/api",target:"_blank"}]}};var u,p,d;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    links: [{
      id: "home",
      label: "Home",
      url: "/"
    }, {
      id: "financial",
      label: "Financial"
    }]
  }
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,g,b;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    links: [{
      id: "home",
      label: "Home",
      url: "/"
    }, {
      id: "corporation",
      label: "Corporation",
      url: "/corporation"
    }, {
      id: "workspace",
      label: "Workspace",
      url: "/corporation/workspace"
    }, {
      id: "users",
      label: "Users"
    }]
  }
}`,...(b=(g=n.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var h,x,f;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    links: [{
      id: "settings",
      label: "Settings",
      url: "/settings"
    }, {
      id: "externals",
      label: "Externals",
      url: "/externals"
    }, {
      id: "api",
      label: "API",
      url: "https://docs.example.com/api",
      target: "_blank"
    }]
  }
}`,...(f=(x=t.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const v=["Default","WithMultiples","WithExternalLink"];export{a as Default,t as WithExternalLink,n as WithMultiples,v as __namedExportsOrder,H as default};
