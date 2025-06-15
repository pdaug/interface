import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as u}from"./Avatar-KQlzqCkx.js";import{D as p}from"./Dropdown-B2VCto3_.js";const m=function({border:t,padding:s=!0,photo:i,photoSize:o=4,photoCircle:l=!1,photoIcon:d,name:a,description:r,styles:c,dropdown:n}){return e.jsxs("div",{style:c,className:`profile ${t?"profileBorder":""} ${s?"profilePadding":""}`,children:[e.jsx("div",{children:e.jsx(u,{label:a,photo:i,size:o,Icon:d,circle:l})}),e.jsxs("div",{className:"profileData",children:[e.jsx("div",{className:"profileDataName",children:a}),r&&e.jsx("div",{className:"profileDataDescription",children:r})]}),n&&e.jsx("div",{className:"profileDropdown",children:e.jsx(p,{...n})})]})};m.__docgenInfo={description:"",methods:[],displayName:"Profile",props:{name:{required:!0,tsType:{name:"string"},description:""},border:{required:!1,tsType:{name:"boolean"},description:""},description:{required:!1,tsType:{name:"string"},description:""},photo:{required:!1,tsType:{name:"string"},description:""},photoSize:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"4",computed:!1}},photoCircle:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},photoIcon:{required:!1,tsType:{name:"Icon"},description:""},padding:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},styles:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""},dropdown:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  values: DropdownValues;
  children: React.ReactElement;
}`,signature:{properties:[{key:"values",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
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
}[]`,required:!0}},{key:"children",value:{name:"ReactReactElement",raw:"React.ReactElement",required:!0}}]}},description:""},dropdownChildren:{required:!1,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""}}};export{m as P};
