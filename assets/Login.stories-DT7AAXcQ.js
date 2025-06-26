import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as p,t as d}from"./Toast-BeI45n8t.js";import{r as f}from"./index-DQLiH3RP.js";import{I as m}from"./Input-DRRgvZdm.js";import{W as g}from"./Wrapper-tybq-k-v.js";import{C as w,V as x,H as h}from"./Align-BXKIus7I.js";import"./index-BvAV3pQe.js";import"./index-CJPVTaBz.js";import"./WarningOctagon-BQjrwpCv.js";import"./IconBase-DM5o4K-0.js";import"./Button-CPWqWagk.js";const W={title:"Layout/Login",tags:["autodocs"],decorators:n=>e.jsxs(w,{children:[e.jsx(p,{}),e.jsx(n,{})]})},s={render:()=>{const[n,a]=f.useState({username:"",password:""}),c=function(r){r.preventDefault()};return e.jsx("form",{onSubmit:c,children:e.jsx(g,{styles:{maxWidth:"35rem"},actions:[{type:"button",category:"Neutral",text:"Forgot Password",onClick:function(){d.message("Forgot Password!")}},{type:"submit",category:"Success",text:"Login"}],children:e.jsxs(x,{internal:1,children:[e.jsx(h,{styles:{flex:1,justifyContent:"center"},children:e.jsx("img",{src:"https://placehold.co/400x200",alt:"logo"})}),e.jsx(m,{required:!0,id:"login_username",name:"username",label:"Username",placeholder:"John Doe",value:n.username,onChange:function(r){var o;const t={...n};t.username=((o=r.currentTarget)==null?void 0:o.value)||"",a(t)}}),e.jsx(m,{required:!0,id:"login_password",name:"password",type:"password",label:"Password",placeholder:"********",value:n.password,onChange:function(r){var o;const t={...n};t.password=((o=r.currentTarget)==null?void 0:o.value)||"",a(t)}})]})})})}};var u,i,l;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [form, setForm] = useState({
      username: "",
      password: ""
    });
    const OnSubmit = function (event: React.FormEvent) {
      event.preventDefault();
      return;
    };
    return <form onSubmit={OnSubmit}>
        <Wrapper styles={{
        maxWidth: "35rem"
      }} actions={[{
        type: "button",
        category: "Neutral",
        text: "Forgot Password",
        onClick: function () {
          toast.message("Forgot Password!");
          return;
        }
      }, {
        type: "submit",
        category: "Success",
        text: "Login"
      }]}>
          <Vertical internal={1}>
            <Horizontal styles={{
            flex: 1,
            justifyContent: "center"
          }}>
              <img src="https://placehold.co/400x200" alt="logo" />
            </Horizontal>
            <Input required id="login_username" name="username" label="Username" placeholder="John Doe" value={form.username} onChange={function (event) {
            const newForm = {
              ...form
            };
            newForm.username = event.currentTarget?.value || "";
            setForm(newForm);
            return;
          }} />
            <Input required id="login_password" name="password" type="password" label="Password" placeholder="********" value={form.password} onChange={function (event) {
            const newForm = {
              ...form
            };
            newForm.password = event.currentTarget?.value || "";
            setForm(newForm);
            return;
          }} />
          </Vertical>
        </Wrapper>
      </form>;
  }
}`,...(l=(i=s.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const E=["Default"];export{s as Default,E as __namedExportsOrder,W as default};
