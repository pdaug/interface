import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-DQLiH3RP.js";const g=function({children:m,values:p}){const[a,u]=r.useState(!1),c=r.useRef(null),l=r.useRef(null),d=r.useRef(null),f=function(){u(!a)};return r.useEffect(function(){var s;if(!a||!d.current)return;const e=d.current,n=e.getBoundingClientRect();if(n.right>window.innerWidth&&(e.style.left="auto",e.style.right="0"),n.bottom>window.innerHeight){const i=(s=c.current)==null?void 0:s.firstElementChild,t=i==null?void 0:i.getBoundingClientRect();e.style.top="auto",e.style.bottom=`${window.innerHeight-((t==null?void 0:t.top)||0)}px`}},[a]),r.useEffect(function(){const e=function(n){if(n.target&&l.current&&!l.current.contains(n.target)){u(!1);return}};return document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}},[]),o.jsxs("div",{ref:l,className:"dropdown",children:[o.jsx("div",{ref:c,onClick:f,children:m}),o.jsx("div",{ref:d,className:`dropdownContent ${a?"dropdownContentOpen":""}`,children:p.map(function({id:e,label:n,Icon:s,disabled:i,onClick:t}){const w=function(E){t==null||t(E),u(!1)};return o.jsxs("button",{disabled:i,onClick:w,className:"dropdownContentOption",children:[s&&o.jsx(s,{size:16}),o.jsx("span",{children:n})]},e)})})]})};g.__docgenInfo={description:"",methods:[],displayName:"Dropdown",props:{values:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
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
}[]`},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""}}};export{g as D};
