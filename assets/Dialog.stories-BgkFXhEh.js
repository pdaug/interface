import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{I as f}from"./Trash-PcOC7TgW.js";import{r}from"./index-DQLiH3RP.js";import{B as d}from"./Button-CPWqWagk.js";import{C as O}from"./Align-BXKIus7I.js";import"./IconBase-DM5o4K-0.js";const N=r.createContext(void 0),L=function({children:e}){const o={open:!1,title:"",description:"",confirmText:"Confirmar",category:"Success",onConfirm:function(){},onCancel:function(){g()}},[i,t]=r.useState(o),s=function(W){t({...W,open:!0})},g=function(){t(o)};return n.jsx(N.Provider,{value:{dialogProps:i,OpenDialog:s,CloseDialog:g},children:e})},q=function(){const e=r.useContext(N);if(!e)throw new Error("useDialog must be used within a DialogProvider");return e},E=function(){const{dialogProps:e,CloseDialog:o}=q(),i=r.useRef(null);return r.useEffect(function(){const t=function(s){if(s.target&&i.current&&!i.current.contains(s.target)){o();return}};return document.addEventListener("mousedown",t),function(){document.removeEventListener("mousedown",t)}},[]),n.jsx("div",{className:`dialog ${e!=null&&e.open?"dialogOpen":""}`,children:n.jsxs("div",{ref:i,className:`dialogContainer ${e!=null&&e.open?"dialogContainerOpen":""}`,children:[n.jsxs("div",{className:"dialogContent",children:[n.jsxs("div",{className:"dialogTitle",children:[e.Icon&&n.jsx(e.Icon,{}),n.jsx("span",{children:e.title})]}),n.jsx("div",{className:"dialogDescription",children:e.description})]}),n.jsxs("div",{className:"dialogFooter",children:[n.jsx(d,{type:"button",category:"Neutral",text:e.cancelText||"Cancel",onClick:(e==null?void 0:e.onCancel)||o}),n.jsx(d,{type:"submit",Icon:e.confirmIcon,text:e.confirmText,category:e.category,onClick:e.onConfirm})]})]})})};L.__docgenInfo={description:"",methods:[],displayName:"DialogProvider",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};E.__docgenInfo={description:"",methods:[],displayName:"DialogElement"};const F={title:"Components/Dialog",tags:["autodocs"],decorators:e=>n.jsx(O,{children:n.jsxs(L,{children:[n.jsx(e,{}),n.jsx(E,{})]})})},m=e=>{const{OpenDialog:o,CloseDialog:i}=q();return n.jsx(d,{text:e.buttonText,category:e.buttonCategory,onClick:()=>o({...e,onConfirm:()=>{var t;(t=e.onConfirm)==null||t.call(e),i()}})})},a={render:()=>m({buttonText:"Dialog Success",buttonCategory:"Success",title:"Title",category:"Success",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",confirmText:"Confirm",onConfirm:()=>null})},c={render:()=>m({buttonText:"Dialog Info",buttonCategory:"Info",title:"Title",category:"Info",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",confirmText:"Ok",onConfirm:()=>null,cancelText:"Close"})},u={render:()=>m({buttonText:"Dialog Warning",buttonCategory:"Warning",title:"Title",category:"Warning",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",confirmText:"I agree",onConfirm:()=>null,cancelText:"Don't agree"})},l={render:()=>m({buttonText:"Dialog Danger",buttonCategory:"Danger",Icon:f,title:"Title",category:"Danger",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",confirmText:"Delete",cancelText:"No",confirmIcon:f,onConfirm:()=>null})};var p,x,C;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => Template({
    buttonText: "Dialog Success",
    buttonCategory: "Success",
    title: "Title",
    category: "Success",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
    confirmText: "Confirm",
    onConfirm: () => null
  })
}`,...(C=(x=a.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var b,T,D;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => Template({
    buttonText: "Dialog Info",
    buttonCategory: "Info",
    title: "Title",
    category: "Info",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
    confirmText: "Ok",
    onConfirm: () => null,
    cancelText: "Close"
  })
}`,...(D=(T=c.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var y,v,I;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => Template({
    buttonText: "Dialog Warning",
    buttonCategory: "Warning",
    title: "Title",
    category: "Warning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
    confirmText: "I agree",
    onConfirm: () => null,
    cancelText: "Don't agree"
  })
}`,...(I=(v=u.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var j,h,S;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => Template({
    buttonText: "Dialog Danger",
    buttonCategory: "Danger",
    Icon: Trash,
    title: "Title",
    category: "Danger",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras venenatis metus est, finibus dignissim ex bibendum quis. ",
    confirmText: "Delete",
    cancelText: "No",
    confirmIcon: Trash,
    onConfirm: () => null
  })
}`,...(S=(h=l.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};const H=["Success","Info","Warn","Danger"];export{l as Danger,c as Info,a as Success,u as Warn,H as __namedExportsOrder,F as default};
