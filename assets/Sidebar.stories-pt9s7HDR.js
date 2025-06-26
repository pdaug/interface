import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{D as O}from"./CaretDown-iWlDRJZr.js";import{S as s,I as _,w as D,G as x,a as W,P as N}from"./Sidebar-Bns5blwk.js";import{r as d}from"./index-DQLiH3RP.js";import"./IconBase-DM5o4K-0.js";import"./Profile-BsT31ePo.js";import"./Avatar-KQlzqCkx.js";import"./Dropdown-B2VCto3_.js";const H={title:"components/Sidebar",component:s,tags:["autodocs"]},o=()=>{const[a,e]=d.useState("dashboard");return n.jsx(s,{path:a,menu:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")},{id:"inflow",label:"Inflow",onClick:()=>e("inflow")},{id:"outflow",label:"Outflow",onClick:()=>e("outflow")},{id:"statements",label:"Statements",onClick:()=>e("statements")}]})},t=()=>{const[a,e]=d.useState("dashboard");return n.jsx(s,{path:a,menu:[{id:"financial",name:"Financial",Icon:_,items:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")}]},{id:"administrative",name:"Administrative",Icon:D,items:[{id:"customers",label:"Customers",onClick:()=>e("customers")},{id:"suppliers",label:"Suppliers",onClick:()=>e("suppliers")}]}]})},l=()=>{const[a,e]=d.useState("dashboard");return n.jsx(s,{path:a,header:{name:"Company Name",description:"Workspace Selected",dropdown:{children:n.jsx("div",{className:"cursor",children:n.jsx(O,{})}),values:[{id:"workspace_1",label:"Workspace 1"},{id:"workspace_2",label:"Workspace 2"}]}},menu:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")},{id:"inflow",label:"Inflow",onClick:()=>e("inflow")},{id:"outflow",label:"Outflow",onClick:()=>e("outflow")},{id:"statements",label:"Statements",onClick:()=>e("statements")}]})},i=()=>{const[a,e]=d.useState("dashboard");return n.jsx(s,{path:a,menu:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")},{id:"inflow",label:"Inflow",onClick:()=>e("inflow")},{id:"outflow",label:"Outflow",onClick:()=>e("outflow")},{id:"statements",label:"Statements",onClick:()=>e("statements")}],footer:{name:"",description:"John Doe",photoCircle:!0,dropdown:{children:n.jsx("div",{className:"cursor",children:n.jsx(x,{})}),values:[{id:"settings",label:"Settings"},{id:"sign_out",label:"Sign Out"}]}}})},r=()=>{const[a,e]=d.useState("dashboard");return n.jsx(s,{path:a,header:{name:"Company Name",description:"Workspace Selected",dropdown:{children:n.jsx("div",{className:"cursor",children:n.jsx(O,{})}),values:[{id:"workspace_1",label:"Workspace 1"},{id:"workspace_2",label:"Workspace 2"}]}},menu:[{id:"financial",name:"Financial",Icon:_,items:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")},{id:"inflow",label:"Inflow",onClick:()=>e("inflow")},{id:"outflow",label:"Outflow",onClick:()=>e("outflow")},{id:"statements",label:"Statements",onClick:()=>e("statements")}]},{id:"administrative",name:"Administrative",Icon:D,items:[{id:"customers",label:"Customers",onClick:()=>e("customers")},{id:"suppliers",label:"Suppliers",onClick:()=>e("suppliers")},{id:"employees",label:"Employees",onClick:()=>e("employees")}]},{id:"operational",name:"Operational",Icon:W,items:[{id:"products",label:"Products",onClick:()=>e("products")},{id:"services",label:"Services",onClick:()=>e("services")},{id:"vehicles",label:"Vehicles",onClick:()=>e("vehicles")}]},{id:"tools",name:"Tools",Icon:N,items:[{id:"documents",label:"Documents",onClick:()=>e("documents")},{id:"schedules",label:"Schedules",onClick:()=>e("schedules")}]}],footer:{name:"",description:"John Doe",photoCircle:!0,dropdown:{children:n.jsx("div",{className:"cursor",children:n.jsx(x,{})}),values:[{id:"settings",label:"Settings"},{id:"sign_out",label:"Sign Out"}]}}})};o.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"Group"};l.__docgenInfo={description:"",methods:[],displayName:"WithHeader"};i.__docgenInfo={description:"",methods:[],displayName:"WithFooter"};r.__docgenInfo={description:"",methods:[],displayName:"All"};var c,m,p;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [path, setPath] = useState("dashboard");
  return <Sidebar path={path} menu={[{
    id: "dashboard",
    label: "Dashboard",
    onClick: () => setPath("dashboard")
  }, {
    id: "orders",
    label: "Orders",
    onClick: () => setPath("orders")
  }, {
    id: "inflow",
    label: "Inflow",
    onClick: () => setPath("inflow")
  }, {
    id: "outflow",
    label: "Outflow",
    onClick: () => setPath("outflow")
  }, {
    id: "statements",
    label: "Statements",
    onClick: () => setPath("statements")
  }]} />;
}`,...(p=(m=o.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,h,b;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const [path, setPath] = useState("dashboard");
  return <Sidebar path={path} menu={[{
    id: "financial",
    name: "Financial",
    Icon: Table,
    items: [{
      id: "dashboard",
      label: "Dashboard",
      onClick: () => setPath("dashboard")
    }, {
      id: "orders",
      label: "Orders",
      onClick: () => setPath("orders")
    }]
  }, {
    id: "administrative",
    name: "Administrative",
    Icon: SuitcaseSimple,
    items: [{
      id: "customers",
      label: "Customers",
      onClick: () => setPath("customers")
    }, {
      id: "suppliers",
      label: "Suppliers",
      onClick: () => setPath("suppliers")
    }]
  }]} />;
}`,...(b=(h=t.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var k,C,f;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`() => {
  const [path, setPath] = useState("dashboard");
  return <Sidebar path={path} header={{
    name: "Company Name",
    description: "Workspace Selected",
    dropdown: {
      children: <div className="cursor">
              <CaretDown />
            </div>,
      values: [{
        id: "workspace_1",
        label: "Workspace 1"
      }, {
        id: "workspace_2",
        label: "Workspace 2"
      }]
    }
  }} menu={[{
    id: "dashboard",
    label: "Dashboard",
    onClick: () => setPath("dashboard")
  }, {
    id: "orders",
    label: "Orders",
    onClick: () => setPath("orders")
  }, {
    id: "inflow",
    label: "Inflow",
    onClick: () => setPath("inflow")
  }, {
    id: "outflow",
    label: "Outflow",
    onClick: () => setPath("outflow")
  }, {
    id: "statements",
    label: "Statements",
    onClick: () => setPath("statements")
  }]} />;
}`,...(f=(C=l.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var w,S,P;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const [path, setPath] = useState("dashboard");
  return <Sidebar path={path} menu={[{
    id: "dashboard",
    label: "Dashboard",
    onClick: () => setPath("dashboard")
  }, {
    id: "orders",
    label: "Orders",
    onClick: () => setPath("orders")
  }, {
    id: "inflow",
    label: "Inflow",
    onClick: () => setPath("inflow")
  }, {
    id: "outflow",
    label: "Outflow",
    onClick: () => setPath("outflow")
  }, {
    id: "statements",
    label: "Statements",
    onClick: () => setPath("statements")
  }]} footer={{
    name: "",
    description: "John Doe",
    photoCircle: true,
    dropdown: {
      children: <div className="cursor">
              <GearSix />
            </div>,
      values: [{
        id: "settings",
        label: "Settings"
      }, {
        id: "sign_out",
        label: "Sign Out"
      }]
    }
  }} />;
}`,...(P=(S=i.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};var v,g,I;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`() => {
  const [path, setPath] = useState("dashboard");
  return <Sidebar path={path} header={{
    name: "Company Name",
    description: "Workspace Selected",
    dropdown: {
      children: <div className="cursor">
              <CaretDown />
            </div>,
      values: [{
        id: "workspace_1",
        label: "Workspace 1"
      }, {
        id: "workspace_2",
        label: "Workspace 2"
      }]
    }
  }} menu={[{
    id: "financial",
    name: "Financial",
    Icon: Table,
    items: [{
      id: "dashboard",
      label: "Dashboard",
      onClick: () => setPath("dashboard")
    }, {
      id: "orders",
      label: "Orders",
      onClick: () => setPath("orders")
    }, {
      id: "inflow",
      label: "Inflow",
      onClick: () => setPath("inflow")
    }, {
      id: "outflow",
      label: "Outflow",
      onClick: () => setPath("outflow")
    }, {
      id: "statements",
      label: "Statements",
      onClick: () => setPath("statements")
    }]
  }, {
    id: "administrative",
    name: "Administrative",
    Icon: SuitcaseSimple,
    items: [{
      id: "customers",
      label: "Customers",
      onClick: () => setPath("customers")
    }, {
      id: "suppliers",
      label: "Suppliers",
      onClick: () => setPath("suppliers")
    }, {
      id: "employees",
      label: "Employees",
      onClick: () => setPath("employees")
    }]
  }, {
    id: "operational",
    name: "Operational",
    Icon: Cube,
    items: [{
      id: "products",
      label: "Products",
      onClick: () => setPath("products")
    }, {
      id: "services",
      label: "Services",
      onClick: () => setPath("services")
    }, {
      id: "vehicles",
      label: "Vehicles",
      onClick: () => setPath("vehicles")
    }]
  }, {
    id: "tools",
    name: "Tools",
    Icon: Paperclip,
    items: [{
      id: "documents",
      label: "Documents",
      onClick: () => setPath("documents")
    }, {
      id: "schedules",
      label: "Schedules",
      onClick: () => setPath("schedules")
    }]
  }]} footer={{
    name: "",
    description: "John Doe",
    photoCircle: true,
    dropdown: {
      children: <div className="cursor">
              <GearSix />
            </div>,
      values: [{
        id: "settings",
        label: "Settings"
      }, {
        id: "sign_out",
        label: "Sign Out"
      }]
    }
  }} />;
}`,...(I=(g=r.parameters)==null?void 0:g.docs)==null?void 0:I.source}}};const V=["Default","Group","WithHeader","WithFooter","All"];export{r as All,o as Default,t as Group,i as WithFooter,l as WithHeader,V as __namedExportsOrder,H as default};
