import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{D as k}from"./CaretDown-iWlDRJZr.js";import{S as f,I as b,w as S,a as g,P,G as x}from"./Sidebar-DjRrwX27.js";import{R as n,r as y}from"./index-DQLiH3RP.js";import{b as w}from"./IconBase-DM5o4K-0.js";import{S as l}from"./Stats-C0x9h409.js";import{W as s}from"./Wrapper-DGQdYDwj.js";import{C as m}from"./Chart-C7XBGuff.js";import{H as r,V as C}from"./Align-BXKIus7I.js";import{b as L}from"./Input-BWeslvyc.js";import{B as D}from"./Button-BWtuNQej.js";import{T as O}from"./Tooltip-XHa1yek-.js";import{D as j}from"./Dropdown-B2VCto3_.js";import"./Profile-BsT31ePo.js";import"./Avatar-KQlzqCkx.js";import"./tiny-invariant-CopsF_GD.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";const W=new Map([["bold",n.createElement(n.Fragment,null,n.createElement("path",{d:"M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z"}))],["duotone",n.createElement(n.Fragment,null,n.createElement("path",{d:"M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",opacity:"0.2"}),n.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"}))],["fill",n.createElement(n.Fragment,null,n.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z"}))],["light",n.createElement(n.Fragment,null,n.createElement("path",{d:"M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z"}))],["regular",n.createElement(n.Fragment,null,n.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"}))],["thin",n.createElement(n.Fragment,null,n.createElement("path",{d:"M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0Zm-94.83,2.83a4,4,0,0,0,5.66,0l40-40a4,4,0,1,0-5.66-5.66L132,134.34V32a4,4,0,0,0-8,0V134.34L90.83,101.17a4,4,0,0,0-5.66,5.66Z"}))]]);var B=Object.defineProperty,V=Object.defineProperties,H=Object.getOwnPropertyDescriptors,d=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable,c=(a,e,i)=>e in a?B(a,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[e]=i,I=(a,e)=>{for(var i in e||(e={}))R.call(e,i)&&c(a,i,e[i]);if(d)for(var i of d(e))E.call(e,i)&&c(a,i,e[i]);return a},z=(a,e)=>V(a,H(e));const v=y.forwardRef((a,e)=>n.createElement(w,z(I({ref:e},a),{weights:W})));v.displayName="DownloadSimple";const ne={title:"Layout/Home",tags:["autodocs"]},o={render:()=>{const[a,e]=y.useState("`");return t.jsxs(r,{children:[t.jsx(f,{path:a,header:{padding:!1,name:"Company Name",description:"Workspace Selected",dropdown:{children:t.jsx("div",{className:"cursor",children:t.jsx(k,{})}),values:[{id:"workspace_1",label:"Workspace 1"},{id:"workspace_2",label:"Workspace 2"}]}},menu:[{id:"financial",name:"Financial",Icon:b,items:[{id:"dashboard",label:"Dashboard",onClick:()=>e("dashboard")},{id:"orders",label:"Orders",onClick:()=>e("orders")},{id:"inflow",label:"Inflow",onClick:()=>e("inflow")},{id:"outflow",label:"Outflow",onClick:()=>e("outflow")},{id:"statements",label:"Statements",onClick:()=>e("statements")}]},{id:"administrative",name:"Administrative",Icon:S,items:[{id:"customers",label:"Customers",onClick:()=>e("customers")},{id:"suppliers",label:"Suppliers",onClick:()=>e("suppliers")},{id:"employees",label:"Employees",onClick:()=>e("employees")}]},{id:"operational",name:"Operational",Icon:g,items:[{id:"products",label:"Products",onClick:()=>e("products")},{id:"services",label:"Services",onClick:()=>e("services")},{id:"vehicles",label:"Vehicles",onClick:()=>e("vehicles")}]},{id:"tools",name:"Tools",Icon:P,items:[{id:"documents",label:"Documents",onClick:()=>e("documents")},{id:"schedules",label:"Schedules",onClick:()=>e("schedules")}]}],footer:{padding:!1,name:"",description:"John Doe",photoCircle:!0,dropdown:{children:t.jsx("div",{className:"cursor",children:t.jsx(x,{})}),values:[{id:"settings",label:"Settings"},{id:"sign_out",label:"Sign Out"}]}}}),t.jsxs(C,{internal:1,external:1,styles:{flex:1},children:[t.jsx(r,{children:t.jsx("h1",{children:"Dashboard"})}),t.jsxs(r,{internal:1,styles:{alignItems:"center"},children:[t.jsx("div",{children:t.jsx(L,{label:"",value:["2025-01-01","2025-02-02"]})}),t.jsx(O,{content:"Download PDF",children:t.jsx(j,{values:[{id:"pdf",label:"Arquivo PDF"},{id:"xlsx",label:"Planilha XSL"},{id:"csv",label:"Arquivo CSV"},{id:"json",label:"Formato JSON"}],children:t.jsx(D,{category:"Neutral",text:"",Icon:v,onlyIcon:!0})})})]}),t.jsxs(r,{internal:1,children:[t.jsx(l,{metric:.5,metricStatus:"Up",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Entradas Pagas",value:5e3,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"}}),t.jsx(l,{metric:.05,metricStatus:"Up",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Entradas Pendentes",value:50,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"}}),t.jsx(l,{metric:.122,metricStatus:"Down",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Saídas Pagas",value:1e3,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"}}),t.jsx(l,{metric:.5,metricStatus:"Down",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Saídas em Atraso",value:500,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"}})]}),t.jsxs(r,{internal:1,children:[t.jsx(s,{title:"Chart Pie Basic",children:t.jsx(m,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"temperature",stroke:"#22c55e",strokeDasharray:"1",strokeWidth:4,dot:!1},{type:"monotone",dataKey:"humidity",stroke:"#0ea5e9",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{angle:20,stroke:"#bebebe",strokeWidth:1,dataKey:"time",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:10,right:10}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{time:"06:00",temperature:9,humidity:50},{time:"07:00",temperature:10,humidity:48},{time:"08:00",temperature:15,humidity:48},{time:"09:00",temperature:18,humidity:44},{time:"10:00",temperature:21,humidity:40},{time:"11:00",temperature:21,humidity:40},{time:"12:00",temperature:25,humidity:40},{time:"13:00",temperature:25,humidity:40},{time:"14:00",temperature:25,humidity:40},{time:"15:00",temperature:25,humidity:41},{time:"16:00",temperature:22,humidity:42},{time:"17:00",temperature:21,humidity:47},{time:"18:00",temperature:20,humidity:51}]})}),t.jsx(s,{title:"Chart Pie Basic",children:t.jsx(m,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"temperature",stroke:"#22c55e",strokeDasharray:"1",strokeWidth:4,dot:!1},{type:"monotone",dataKey:"humidity",stroke:"#0ea5e9",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{angle:20,stroke:"#bebebe",strokeWidth:1,dataKey:"time",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:10,right:10}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{time:"06:00",temperature:9,humidity:50},{time:"07:00",temperature:10,humidity:48},{time:"08:00",temperature:15,humidity:48},{time:"09:00",temperature:18,humidity:44},{time:"10:00",temperature:21,humidity:40},{time:"11:00",temperature:21,humidity:40},{time:"12:00",temperature:25,humidity:40},{time:"13:00",temperature:25,humidity:40},{time:"14:00",temperature:25,humidity:40},{time:"15:00",temperature:25,humidity:41},{time:"16:00",temperature:22,humidity:42},{time:"17:00",temperature:21,humidity:47},{time:"18:00",temperature:20,humidity:51}]})})]})]})]})}};var u,p,h;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [path, setPath] = useState("\`");
    return <Horizontal>
        <Sidebar path={path} header={{
        padding: false,
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
        padding: false,
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
      }} />
        <Vertical internal={1} external={1} styles={{
        flex: 1
      }}>
          <Horizontal>
            <h1>Dashboard</h1>
          </Horizontal>
          <Horizontal internal={1} styles={{
          alignItems: "center"
        }}>
            <div>
              <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
            </div>
            <Tooltip content="Download PDF">
              <Dropdown values={[{
              id: "pdf",
              label: "Arquivo PDF"
            }, {
              id: "xlsx",
              label: "Planilha XSL"
            }, {
              id: "csv",
              label: "Arquivo CSV"
            }, {
              id: "json",
              label: "Formato JSON"
            }]}>
                <Button category="Neutral" text="" Icon={DownloadSimple} onlyIcon />
              </Dropdown>
            </Tooltip>
          </Horizontal>
          <Horizontal internal={1}>
            <Stats metric={0.5} metricStatus="Up" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Entradas Pagas" value={5000} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} />
            <Stats metric={0.05} metricStatus="Up" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Entradas Pendentes" value={50} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} />
            <Stats metric={0.122} metricStatus="Down" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Saídas Pagas" value={1000} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} />
            <Stats metric={0.5} metricStatus="Down" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Saídas em Atraso" value={500} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} />
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper title="Chart Pie Basic">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "temperature",
              stroke: "#22c55e",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }, {
              type: "monotone",
              dataKey: "humidity",
              stroke: "#0ea5e9",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              angle: 20,
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "time",
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              interval: 0,
              padding: {
                left: 10,
                right: 10
              }
            }} axisYProps={{
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              stroke: "",
              strokeWidth: 0,
              width: 24
            }} data={[{
              time: "06:00",
              temperature: 9,
              humidity: 50
            }, {
              time: "07:00",
              temperature: 10,
              humidity: 48
            }, {
              time: "08:00",
              temperature: 15,
              humidity: 48
            }, {
              time: "09:00",
              temperature: 18,
              humidity: 44
            }, {
              time: "10:00",
              temperature: 21,
              humidity: 40
            }, {
              time: "11:00",
              temperature: 21,
              humidity: 40
            }, {
              time: "12:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "13:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "14:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "15:00",
              temperature: 25,
              humidity: 41
            }, {
              time: "16:00",
              temperature: 22,
              humidity: 42
            }, {
              time: "17:00",
              temperature: 21,
              humidity: 47
            }, {
              time: "18:00",
              temperature: 20,
              humidity: 51
            }]} />
            </Wrapper>
            <Wrapper title="Chart Pie Basic">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "temperature",
              stroke: "#22c55e",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }, {
              type: "monotone",
              dataKey: "humidity",
              stroke: "#0ea5e9",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              angle: 20,
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "time",
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              interval: 0,
              padding: {
                left: 10,
                right: 10
              }
            }} axisYProps={{
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              stroke: "",
              strokeWidth: 0,
              width: 24
            }} data={[{
              time: "06:00",
              temperature: 9,
              humidity: 50
            }, {
              time: "07:00",
              temperature: 10,
              humidity: 48
            }, {
              time: "08:00",
              temperature: 15,
              humidity: 48
            }, {
              time: "09:00",
              temperature: 18,
              humidity: 44
            }, {
              time: "10:00",
              temperature: 21,
              humidity: 40
            }, {
              time: "11:00",
              temperature: 21,
              humidity: 40
            }, {
              time: "12:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "13:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "14:00",
              temperature: 25,
              humidity: 40
            }, {
              time: "15:00",
              temperature: 25,
              humidity: 41
            }, {
              time: "16:00",
              temperature: 22,
              humidity: 42
            }, {
              time: "17:00",
              temperature: 21,
              humidity: 47
            }, {
              time: "18:00",
              temperature: 20,
              humidity: 51
            }]} />
            </Wrapper>
          </Horizontal>
        </Vertical>
      </Horizontal>;
  }
}`,...(h=(p=o.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const ae=["Default"];export{o as Default,ae as __namedExportsOrder,ne as default};
