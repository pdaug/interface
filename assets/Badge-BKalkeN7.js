import{j as e}from"./jsx-runtime-D_zvdyIk.js";const o=["Success","Info","Warning","Danger","Neutral"],g=function({id:r,name:i,value:a,options:n,category:t,onChange:d}){return n&&n.length>0?e.jsx("select",{id:r,name:i,value:a,onChange:d,className:`badge badge${t}`,children:n.map(function({id:s,value:l,label:u}){return e.jsx("option",{id:s,value:l,children:u},s)})}):e.jsx("div",{id:r,className:`badge badge${t}`,children:e.jsx("span",{children:a||"badge_empty_text"})})};g.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{id:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},value:{required:!0,tsType:{name:"string"},description:""},category:{required:!0,tsType:{name:"unknown[number]",raw:"(typeof BadgeCategoriesList)[number]"},description:""},onChange:{required:!1,tsType:{name:"ReactChangeEventHandler",raw:"React.ChangeEventHandler<HTMLSelectElement>",elements:[{name:"HTMLSelectElement"}]},description:""},options:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  value: string;
  label: string;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}],raw:`{
  id: string;
  value: string;
  label: string;
}[]`},description:""}}};export{o as B,g as a};
