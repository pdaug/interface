import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as k}from"./CaretDown-iWlDRJZr.js";import{S as y,I as b,w as g,a as P,P as S,G as x}from"./Sidebar-Bns5blwk.js";import{R as t,r as v}from"./index-DQLiH3RP.js";import{b as O}from"./IconBase-DM5o4K-0.js";import{w as z}from"./QuestionMark-CDjdN23n.js";import{S as i}from"./Stats-CYr4CZ_L.js";import{B as c}from"./Button-CPWqWagk.js";import{W as l}from"./Wrapper-tybq-k-v.js";import{C as s}from"./Chart-D3W4nkVZ.js";import{D as j}from"./Dropdown-B2VCto3_.js";import{H as r,V as W}from"./Align-BXKIus7I.js";import{f as L,b as C}from"./Input-DRRgvZdm.js";import"./Profile-BsT31ePo.js";import"./Avatar-KQlzqCkx.js";import"./tiny-invariant-CopsF_GD.js";const R=new Map([["bold",t.createElement(t.Fragment,null,t.createElement("path",{d:"M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z"}))],["duotone",t.createElement(t.Fragment,null,t.createElement("path",{d:"M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",opacity:"0.2"}),t.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"}))],["fill",t.createElement(t.Fragment,null,t.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z"}))],["light",t.createElement(t.Fragment,null,t.createElement("path",{d:"M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z"}))],["regular",t.createElement(t.Fragment,null,t.createElement("path",{d:"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"}))],["thin",t.createElement(t.Fragment,null,t.createElement("path",{d:"M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0Zm-94.83,2.83a4,4,0,0,0,5.66,0l40-40a4,4,0,1,0-5.66-5.66L132,134.34V32a4,4,0,0,0-8,0V134.34L90.83,101.17a4,4,0,0,0-5.66,5.66Z"}))]]);var B=Object.defineProperty,D=Object.defineProperties,V=Object.getOwnPropertyDescriptors,u=Object.getOwnPropertySymbols,E=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable,p=(a,n,o)=>n in a?B(a,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[n]=o,I=(a,n)=>{for(var o in n||(n={}))E.call(n,o)&&p(a,o,n[o]);if(u)for(var o of u(n))H.call(n,o)&&p(a,o,n[o]);return a},K=(a,n)=>D(a,V(n));const w=v.forwardRef((a,n)=>t.createElement(O,K(I({ref:n},a),{weights:R})));w.displayName="DownloadSimple";const ne={title:"Layout/Dashboard",tags:["autodocs"]},d={render:()=>{const[a,n]=v.useState("dashboard");return e.jsxs(r,{styles:{height:"100vh"},children:[e.jsx(y,{path:a,header:{name:"Company Name",description:"Workspace Selected",dropdown:{children:e.jsx("div",{className:"cursor",children:e.jsx(k,{})}),values:[{id:"workspace_1",label:"Workspace 1"},{id:"workspace_2",label:"Workspace 2"}]}},menu:[{id:"financial",name:"Financial",Icon:b,items:[{id:"dashboard",label:"Dashboard",onClick:()=>n("dashboard")},{id:"orders",label:"Orders",onClick:()=>n("orders")},{id:"inflow",label:"Inflow",onClick:()=>n("inflow")},{id:"outflow",label:"Outflow",onClick:()=>n("outflow")},{id:"statements",label:"Statements",onClick:()=>n("statements")}]},{id:"administrative",name:"Administrative",Icon:g,items:[{id:"customers",label:"Customers",onClick:()=>n("customers")},{id:"suppliers",label:"Suppliers",onClick:()=>n("suppliers")},{id:"employees",label:"Employees",onClick:()=>n("employees")}]},{id:"operational",name:"Operational",Icon:P,items:[{id:"products",label:"Products",onClick:()=>n("products")},{id:"services",label:"Services",onClick:()=>n("services")},{id:"vehicles",label:"Vehicles",onClick:()=>n("vehicles")}]},{id:"tools",name:"Tools",Icon:S,items:[{id:"documents",label:"Documents",onClick:()=>n("documents")},{id:"schedules",label:"Schedules",onClick:()=>n("schedules")}]}],footer:{name:"",description:"John Doe",photoCircle:!0,dropdown:{children:e.jsx("div",{className:"cursor",children:e.jsx(x,{})}),values:[{id:"settings",label:"Settings"},{id:"sign_out",label:"Sign Out"}]}}}),e.jsxs(W,{internal:1,styles:{padding:"1rem",flex:1,overflowY:"scroll"},children:[e.jsx(r,{children:e.jsx("h1",{children:"Dashboard"})}),e.jsxs(r,{internal:1,children:[e.jsx(L,{label:"",empty:"",value:"general",options:[{id:"inflow",text:"Entradas",value:"inflow"},{id:"outflow",text:"Saídas",value:"outflow"},{id:"general",text:"Geral",value:"general"}]}),e.jsx(C,{label:"",value:["2025-01-01","2025-02-02"]}),e.jsx("div",{style:{flex:1}}),e.jsx(j,{values:[{id:"pdf",label:"Arquivo PDF"},{id:"xlsx",label:"Planilha XSL"},{id:"csv",label:"Arquivo CSV"},{id:"json",label:"Formato JSON"}],children:e.jsx(c,{category:"Neutral",text:"Baixar",Icon:w})}),e.jsx(c,{category:"Neutral",text:"",Icon:z,onlyIcon:!0})]}),e.jsxs(r,{internal:1,children:[e.jsx(i,{title:"Entradas",value:5e3,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de entradas já realizadas"}),e.jsx(i,{metric:.1,metricStatus:"Up",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Entradas a receber",value:500,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de entradas que ainda serão recebidas"}),e.jsx(i,{metric:.2,metricStatus:"Up",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Entradas em atraso",value:1e3,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de entradas que já deveriam ter sido recebidas"})]}),e.jsxs(r,{internal:1,children:[e.jsx(i,{title:"Saídas",value:1e3,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de saídas já realizadas"}),e.jsx(i,{metric:.05,metricStatus:"Down",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Saídas a realizar",value:50,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de saídas que ainda serão realizadas"}),e.jsx(i,{metric:.1,metricStatus:"Down",metricLocale:"pt-BR",metricOptions:{style:"percent"},title:"Saídas em atraso",value:100,valueLocale:"pt-BR",valueOptions:{style:"currency",currency:"BRL"},footer:"Total de saídas que já deveriam ter sido realizadas"})]}),e.jsxs(r,{internal:1,children:[e.jsx(l,{title:"Entradas Financeiras",description:"As entradas distribuídas ao longo do intervalo de tempo.",children:e.jsx(s,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"inflow",stroke:"#22c55e",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{stroke:"#bebebe",strokeWidth:1,dataKey:"date",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:15,right:15}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{date:"01/01",inflow:1e3},{date:"02/01",inflow:500},{date:"03/01",inflow:2e3},{date:"04/01",inflow:500},{date:"05/01",inflow:0},{date:"06/01",inflow:0},{date:"07/01",inflow:1e3}]})}),e.jsx(l,{title:"Saídas Financeiras",description:"As saídas distribuídas ao longo do intervalo de tempo.",children:e.jsx(s,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"outflow",stroke:"#ef4444",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{stroke:"#bebebe",strokeWidth:1,dataKey:"date",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:10,right:10}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{date:"01/01",outflow:50},{date:"02/01",outflow:100},{date:"03/01",outflow:200},{date:"04/01",outflow:150},{date:"05/01",outflow:50},{date:"06/01",outflow:100},{date:"07/01",outflow:100}]})})]}),e.jsxs(r,{internal:1,children:[e.jsx(l,{title:"Resumo de Entradas",description:"Visualização das entradas a receber e em atraso.",children:e.jsx(s,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"inflowPending",stroke:"#22c55e",strokeDasharray:"1",strokeWidth:4,dot:!1},{type:"monotone",dataKey:"inflowOverdue",stroke:"#22c55e",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{stroke:"#bebebe",strokeWidth:1,dataKey:"date",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:15,right:15}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{date:"01/01",inflowPending:0,inflowOverdue:100},{date:"02/01",inflowPending:50,inflowOverdue:100},{date:"03/01",inflowPending:100,inflowOverdue:200},{date:"04/01",inflowPending:50,inflowOverdue:200},{date:"05/01",inflowPending:0,inflowOverdue:200},{date:"06/01",inflowPending:150,inflowOverdue:200},{date:"07/01",inflowPending:150,inflowOverdue:200}]})}),e.jsx(l,{title:"Resumo de Saídas",description:"Visualização das sáidas a realizar e em atraso.",children:e.jsx(s,{height:320,gridProps:{stroke:"#dedede",strokeWidth:1,vertical:!1,horizontal:!0},lines:[{type:"monotone",dataKey:"outflowPending",stroke:"#ef4444",strokeDasharray:"1",strokeWidth:4,dot:!1},{type:"monotone",dataKey:"outflowOverdue",stroke:"#ef4444",strokeDasharray:"1",strokeWidth:4,dot:!1}],axisXProps:{angle:20,stroke:"#bebebe",strokeWidth:1,dataKey:"date",tick:{fontSize:10,fill:"#222"},interval:0,padding:{left:10,right:10}},axisYProps:{tick:{fontSize:10,fill:"#222"},stroke:"",strokeWidth:0,width:24},data:[{date:"01/01",outflowPending:0,outflowOverdue:10},{date:"02/01",outflowPending:10,outflowOverdue:20},{date:"03/01",outflowPending:0,outflowOverdue:10},{date:"04/01",outflowPending:10,outflowOverdue:20},{date:"05/01",outflowPending:10,outflowOverdue:20},{date:"06/01",outflowPending:10,outflowOverdue:10},{date:"07/01",outflowPending:10,outflowOverdue:10}]})})]})]})]})}};var f,m,h;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [path, setPath] = useState("dashboard");
    return <Horizontal styles={{
      height: "100vh"
    }}>
        <Sidebar path={path} header={{
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
      }} />
        <Vertical internal={1} styles={{
        padding: "1rem",
        flex: 1,
        overflowY: "scroll"
      }}>
          <Horizontal>
            <h1>Dashboard</h1>
          </Horizontal>
          <Horizontal internal={1}>
            <InputSelect label="" empty="" value="general" options={[{
            id: "inflow",
            text: "Entradas",
            value: "inflow"
          }, {
            id: "outflow",
            text: "Saídas",
            value: "outflow"
          }, {
            id: "general",
            text: "Geral",
            value: "general"
          }]} />
            <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
            <div style={{
            flex: 1
          }}></div>
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
              <Button category="Neutral" text="Baixar" Icon={DownloadSimple} />
            </Dropdown>
            <Button category="Neutral" text="" Icon={QuestionMark} onlyIcon />
          </Horizontal>
          <Horizontal internal={1}>
            <Stats title="Entradas" value={5000} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de entradas já realizadas" />
            <Stats metric={0.1} metricStatus="Up" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Entradas a receber" value={500} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de entradas que ainda serão recebidas" />
            <Stats metric={0.2} metricStatus="Up" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Entradas em atraso" value={1000} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de entradas que já deveriam ter sido recebidas" />
          </Horizontal>
          <Horizontal internal={1}>
            <Stats title="Saídas" value={1000} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de saídas já realizadas" />
            <Stats metric={0.05} metricStatus="Down" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Saídas a realizar" value={50} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de saídas que ainda serão realizadas" />
            <Stats metric={0.1} metricStatus="Down" metricLocale="pt-BR" metricOptions={{
            style: "percent"
          }} title="Saídas em atraso" value={100} valueLocale="pt-BR" valueOptions={{
            style: "currency",
            currency: "BRL"
          }} footer="Total de saídas que já deveriam ter sido realizadas" />
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper title="Entradas Financeiras" description="As entradas distribuídas ao longo do intervalo de tempo.">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "inflow",
              stroke: "#22c55e",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              interval: 0,
              padding: {
                left: 15,
                right: 15
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
              date: "01/01",
              inflow: 1000
            }, {
              date: "02/01",
              inflow: 500
            }, {
              date: "03/01",
              inflow: 2000
            }, {
              date: "04/01",
              inflow: 500
            }, {
              date: "05/01",
              inflow: 0
            }, {
              date: "06/01",
              inflow: 0
            }, {
              date: "07/01",
              inflow: 1000
            }]} />
            </Wrapper>
            <Wrapper title="Saídas Financeiras" description="As saídas distribuídas ao longo do intervalo de tempo.">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "outflow",
              stroke: "#ef4444",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
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
              date: "01/01",
              outflow: 50
            }, {
              date: "02/01",
              outflow: 100
            }, {
              date: "03/01",
              outflow: 200
            }, {
              date: "04/01",
              outflow: 150
            }, {
              date: "05/01",
              outflow: 50
            }, {
              date: "06/01",
              outflow: 100
            }, {
              date: "07/01",
              outflow: 100
            }]} />
            </Wrapper>
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper title="Resumo de Entradas" description="Visualização das entradas a receber e em atraso.">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "inflowPending",
              stroke: "#22c55e",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }, {
              type: "monotone",
              dataKey: "inflowOverdue",
              stroke: "#22c55e",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
              tick: {
                fontSize: 10,
                fill: "#222"
              },
              interval: 0,
              padding: {
                left: 15,
                right: 15
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
              date: "01/01",
              inflowPending: 0,
              inflowOverdue: 100
            }, {
              date: "02/01",
              inflowPending: 50,
              inflowOverdue: 100
            }, {
              date: "03/01",
              inflowPending: 100,
              inflowOverdue: 200
            }, {
              date: "04/01",
              inflowPending: 50,
              inflowOverdue: 200
            }, {
              date: "05/01",
              inflowPending: 0,
              inflowOverdue: 200
            }, {
              date: "06/01",
              inflowPending: 150,
              inflowOverdue: 200
            }, {
              date: "07/01",
              inflowPending: 150,
              inflowOverdue: 200
            }]} />
            </Wrapper>
            <Wrapper title="Resumo de Saídas" description="Visualização das sáidas a realizar e em atraso.">
              <ChartLine height={320} gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true
            }} lines={[{
              type: "monotone",
              dataKey: "outflowPending",
              stroke: "#ef4444",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }, {
              type: "monotone",
              dataKey: "outflowOverdue",
              stroke: "#ef4444",
              strokeDasharray: "1",
              strokeWidth: 4,
              dot: false
            }]} axisXProps={{
              angle: 20,
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
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
              date: "01/01",
              outflowPending: 0,
              outflowOverdue: 10
            }, {
              date: "02/01",
              outflowPending: 10,
              outflowOverdue: 20
            }, {
              date: "03/01",
              outflowPending: 0,
              outflowOverdue: 10
            }, {
              date: "04/01",
              outflowPending: 10,
              outflowOverdue: 20
            }, {
              date: "05/01",
              outflowPending: 10,
              outflowOverdue: 20
            }, {
              date: "06/01",
              outflowPending: 10,
              outflowOverdue: 10
            }, {
              date: "07/01",
              outflowPending: 10,
              outflowOverdue: 10
            }]} />
            </Wrapper>
          </Horizontal>
        </Vertical>
      </Horizontal>;
  }
}`,...(h=(m=d.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};const te=["Default"];export{d as Default,te as __namedExportsOrder,ne as default};
