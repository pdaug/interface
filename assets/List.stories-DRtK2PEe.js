import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as f}from"./CaretDown-iWlDRJZr.js";import{S as x,I as S,w as C,a as P,P as k,G as y}from"./Sidebar-Bns5blwk.js";import{I as w}from"./Plus-MU5-FXwH.js";import{w as I}from"./QuestionMark-CDjdN23n.js";import{r}from"./index-DQLiH3RP.js";import{T as j}from"./Table-Chz7YusX.js";import{a as D}from"./Badge-BKalkeN7.js";import{B as o}from"./Button-CPWqWagk.js";import{P as N}from"./Profile-BsT31ePo.js";import{H as i,V as d}from"./Align-BXKIus7I.js";import{f as T,b as O}from"./Input-DRRgvZdm.js";import{P as F}from"./Pagination-BRs2Oksn.js";import"./IconBase-DM5o4K-0.js";import"./Tooltip-XHa1yek-.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";import"./Dropdown-B2VCto3_.js";import"./Avatar-KQlzqCkx.js";import"./CaretRight-CIt0Izt5.js";const X={title:"Layout/List",tags:["autodocs"]},l={render:()=>{const s={123:{name:"Edward Cullen",description:"Product Designer",photo:"https://randomuser.me/api/portraits/men/75.jpg"}},[p,h]=r.useState(1),[b,n]=r.useState("orders"),[g,v]=r.useState([]);return e.jsxs(i,{styles:{height:"100vh"},children:[e.jsx(x,{path:b,header:{name:"Company Name",description:"Workspace Selected",dropdown:{children:e.jsx("div",{className:"cursor",children:e.jsx(f,{})}),values:[{id:"workspace_1",label:"Workspace 1"},{id:"workspace_2",label:"Workspace 2"}]}},menu:[{id:"financial",name:"Financial",Icon:S,items:[{id:"dashboard",label:"Dashboard",onClick:()=>n("dashboard")},{id:"orders",label:"Orders",onClick:()=>n("orders")},{id:"inflow",label:"Inflow",onClick:()=>n("inflow")},{id:"outflow",label:"Outflow",onClick:()=>n("outflow")},{id:"statements",label:"Statements",onClick:()=>n("statements")}]},{id:"administrative",name:"Administrative",Icon:C,items:[{id:"customers",label:"Customers",onClick:()=>n("customers")},{id:"suppliers",label:"Suppliers",onClick:()=>n("suppliers")},{id:"employees",label:"Employees",onClick:()=>n("employees")}]},{id:"operational",name:"Operational",Icon:P,items:[{id:"products",label:"Products",onClick:()=>n("products")},{id:"services",label:"Services",onClick:()=>n("services")},{id:"vehicles",label:"Vehicles",onClick:()=>n("vehicles")}]},{id:"tools",name:"Tools",Icon:k,items:[{id:"documents",label:"Documents",onClick:()=>n("documents")},{id:"schedules",label:"Schedules",onClick:()=>n("schedules")}]}],footer:{name:"",description:"John Doe",photoCircle:!0,dropdown:{children:e.jsx("div",{className:"cursor",children:e.jsx(y,{})}),values:[{id:"settings",label:"Settings"},{id:"sign_out",label:"Sign Out"}]}}}),e.jsxs(d,{internal:1,styles:{padding:"1rem",flex:1,overflowY:"scroll"},children:[e.jsx(i,{children:e.jsx("h1",{children:"Pedidos"})}),e.jsxs(i,{internal:1,children:[e.jsx(o,{category:"Success",text:"Novo Pedido",Icon:w}),e.jsx("div",{children:e.jsx(T,{label:"",empty:"",value:"general",options:[{id:"inflow",text:"Entradas",value:"inflow"},{id:"outflow",text:"Saídas",value:"outflow"},{id:"general",text:"Geral",value:"general"}]})}),e.jsx("div",{children:e.jsx(O,{label:"",value:["2025-01-01","2025-02-02"]})}),e.jsx("div",{style:{flex:1}}),e.jsx(o,{category:"Neutral",text:"Importar"}),e.jsx(o,{category:"Neutral",text:"Exportar"}),e.jsx(o,{category:"Neutral",text:"",Icon:I,onlyIcon:!0})]}),e.jsxs(d,{internal:1,styles:{flex:1},children:[e.jsx(j,{border:!0,data:[{id:"123",status:!0,originName:"Fulano de Tal",priceMethod:"pix",priceTotal:"200",dateOverdue:"2025-01-01T00:00:00.000Z",datePayment:"",destinationName:"Cliente de Tal",userId:123}],columns:{status:{label:"Status",maxWidth:"96px",handler:function(t){return e.jsx(D,{category:t.status?"Success":"Danger",value:t.status?"Active":"Disabled"})}},originName:{label:"Origem"},priceMethod:{label:"Forma de pagamento"},priceTotal:{label:"Valor"},dateOverdue:{label:"Data do vencimento",handler:function(t){return new Date(String(t.dateOverdue)).toLocaleString()}},datePayment:{label:"Data do pagamento",handler:function(t){return t.datePayment?new Date(String(t.datePayment)).toLocaleString():"no data"}},destinationName:{label:"Destino"},userId:{label:"Responsável",maxWidth:"15%",handler:function(t){const a=s==null?void 0:s[t.userId];return e.jsx(N,{padding:!1,name:a.name,photo:a.photo,description:a.description,photoSize:3})}}},selected:g,setSelected:v,options:[{id:"1",label:"Paste",onClick:()=>alert("Paste clicked!")},{id:"2",label:"Copy",onClick:()=>alert("Copy clicked!")},{id:"3",label:"Delete",disabled:!0}]}),e.jsx(F,{display:!0,pageCurrent:p,setPage:h,itemsTotal:100,pageSize:10})]})]})]})}};var c,u,m;l.parameters={...l.parameters,docs:{...(c=l.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const user: {
      [key: number]: {
        name: string;
        description: string;
        photo: string;
      };
    } = {
      123: {
        name: "Edward Cullen",
        description: "Product Designer",
        photo: "https://randomuser.me/api/portraits/men/75.jpg"
      }
    };
    const [page, setPage] = useState(1);
    const [path, setPath] = useState("orders");
    const [selected, setSelected] = useState<string[]>([]);
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
        Icon: TableIcon,
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
            <h1>Pedidos</h1>
          </Horizontal>
          <Horizontal internal={1}>
            <Button category="Success" text="Novo Pedido" Icon={Plus} />
            <div>
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
            </div>
            <div>
              <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
            </div>
            <div style={{
            flex: 1
          }}></div>
            <Button category="Neutral" text="Importar" />
            <Button category="Neutral" text="Exportar" />
            <Button category="Neutral" text="" Icon={QuestionMark} onlyIcon />
          </Horizontal>
          <Vertical internal={1} styles={{
          flex: 1
        }}>
            <Table border data={[{
            id: "123",
            status: true,
            originName: "Fulano de Tal",
            priceMethod: "pix",
            priceTotal: "200",
            dateOverdue: "2025-01-01T00:00:00.000Z",
            datePayment: "",
            destinationName: "Cliente de Tal",
            userId: 123
          }]} columns={{
            status: {
              label: "Status",
              maxWidth: "96px",
              handler: function (data) {
                return <Badge category={data.status ? "Success" : "Danger"} value={data.status ? "Active" : "Disabled"} />;
              }
            },
            originName: {
              label: "Origem"
            },
            priceMethod: {
              label: "Forma de pagamento"
            },
            priceTotal: {
              label: "Valor"
            },
            dateOverdue: {
              label: "Data do vencimento",
              handler: function (data) {
                const dateFormatted = new Date(String(data.dateOverdue)).toLocaleString();
                return dateFormatted;
              }
            },
            datePayment: {
              label: "Data do pagamento",
              handler: function (data) {
                const dateFormatted = data.datePayment ? new Date(String(data.datePayment)).toLocaleString() : "no data";
                return dateFormatted;
              }
            },
            destinationName: {
              label: "Destino"
            },
            userId: {
              label: "Responsável",
              maxWidth: "15%",
              handler: function (data) {
                const currentUser = user?.[data.userId as number];
                return <Profile padding={false} name={currentUser.name} photo={currentUser.photo} description={currentUser.description} photoSize={3} />;
              }
            }
          }} selected={selected} setSelected={setSelected} options={[{
            id: "1",
            label: "Paste",
            onClick: () => alert(\`Paste clicked!\`)
          }, {
            id: "2",
            label: "Copy",
            onClick: () => alert(\`Copy clicked!\`)
          }, {
            id: "3",
            label: "Delete",
            disabled: true
          }]} />
            <Pagination display pageCurrent={page} setPage={setPage} itemsTotal={100} pageSize={10} />
          </Vertical>
        </Vertical>
      </Horizontal>;
  }
}`,...(m=(u=l.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};const ee=["Default"];export{l as Default,ee as __namedExportsOrder,X as default};
