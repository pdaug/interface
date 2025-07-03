import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as t}from"./index-DQLiH3RP.js";import{I as s,a as ve,b as g,c as D,d as y,e as I,f as d,g as p,h as N}from"./Input-Bmji1q52.js";import{C as me,V as u}from"./Align-BXKIus7I.js";const Ce={title:"Components/Input",tags:["autodocs"],decorators:n=>a.jsx(me,{children:a.jsx(n,{})})},C={render:()=>{const[n,l]=t.useState("");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(s,{label:"Input Text",value:n,placeholder:"John Doe",onChange:e=>l(e.target.value)}),a.jsx(s,{required:!0,label:"Input with Required",value:n,placeholder:"John Doe",onChange:e=>l(e.target.value)}),a.jsx(s,{label:"Input with Helper",value:n,placeholder:"John Doe",helper:n.length?"":"Invalid",onChange:e=>l(e.target.value)}),a.jsx(s,{readOnly:!0,label:"Input Read Only",value:n,placeholder:"John Doe",onChange:e=>l(e.target.value)}),a.jsx(s,{disabled:!0,label:"Input Disabled",value:n,placeholder:"John Doe",onChange:e=>l(e.target.value)}),a.jsx(ve,{label:"Input Text Area",value:n,placeholder:"Type here your name",height:4,resize:"vertical",onChange:e=>l(e.target.value)})]})}},c=()=>{const[n,l]=t.useState("");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(s,{label:"Input Number",type:"number",value:n,placeholder:"Type a number",onChange:e=>l(e.target.value)}),a.jsx(s,{label:"Input Number with Limit",type:"number",value:n,placeholder:"Type a number",onChange:e=>l(e.target.value),min:1,max:100,step:1}),a.jsx(s,{label:"Input Number Float",type:"number",value:n,placeholder:"Type a number",onChange:e=>l(e.target.value),min:1,max:100,step:.1})]})},h=()=>{const[n,l]=t.useState("");return a.jsx(u,{internal:1,styles:{width:"30rem"},children:a.jsx(s,{label:"Password",type:"password",value:n,placeholder:"**********",onChange:e=>l(e.target.value)})})},v=()=>{const[n,l]=t.useState(["2025-01-01","2025-01-28"]);return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(g,{value:n,label:"Input Interval",onChange:e=>l(e)}),a.jsx(g,{required:!0,value:n,label:"Input Interval Required",onChange:e=>l(e)}),a.jsx(g,{readOnly:!0,value:n,label:"Input Interval Read Only",onChange:e=>l(e)}),a.jsx(g,{disabled:!0,value:n,label:"Input Interval Disabled",onChange:e=>l(e)})]})},m=()=>{const[n,l]=t.useState("2025-01-01");return a.jsx(u,{internal:1,styles:{width:"30rem"},children:a.jsx(s,{label:"Input Date",type:"date",value:n,placeholder:"DD/MM/AAAA",onChange:e=>l(e.target.value)})})},b=()=>{const[n,l]=t.useState("2025-01-01T00:00:00");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(s,{label:"Input Date, Hour and Minutes",type:"datetime-local",value:n,placeholder:"DD/MM/AAAA HH:MM:SS",onChange:e=>l(e.target.value)}),a.jsx(s,{label:"Input Date and Time",type:"datetime-local",value:n,step:1,placeholder:"DD/MM/AAAA HH:MM:SS",onChange:e=>l(e.target.value)})]})},x={render:()=>{const[n,l]=t.useState("");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(D,{label:"Input Mask only Numbers",mask:"9999",value:n,placeholder:"1234",onChange:e=>l(e.target.value)}),a.jsx(D,{label:"Input Mask only Text",mask:"AAA",value:n,placeholder:"ABC",onChange:e=>l(e.target.value)}),a.jsx(D,{label:"Input Mask Numbers and Text",mask:"AAA-9999",value:n,placeholder:"ABC-1234",onChange:e=>l(e.target.value)})]})}},V={render:()=>{const[n,l]=t.useState(!1),[e,i]=t.useState(!1),[r,A]=t.useState([""]),[ce,he]=t.useState(["apple"]);return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(y,{value:n,onChange:o=>{l(o),console.log(o)},options:[{id:"check",value:"check",label:"Without label"}]}),a.jsx(y,{value:e,label:"Input Check",onChange:o=>{i(o),console.log(o)},options:[{id:"agree",value:"agree",label:"Agree"}]}),a.jsx(y,{value:ce,label:"Input Check Multiple",onChange:o=>{he(o),console.log(o)},options:[{id:"apple",value:"apple",label:"Apple"},{id:"banana",value:"banana",label:"Banana"},{id:"orange",value:"orange",label:"Orange"},{id:"kiwi",value:"kiwi",label:"Kiwi"}]}),a.jsx(y,{value:r,horizontal:!0,label:"Input Check Horizontal",onChange:o=>{A(o),console.log(o)},options:[{id:"galaga",value:"galaga",label:"Galaga"},{id:"tetris",value:"tetris",label:"Tetris"},{id:"pitfall",value:"pitfall",label:"Pitfall"}]})]})}},S={render:()=>{const[n,l]=t.useState("none"),[e,i]=t.useState("yes"),[r,A]=t.useState("maybe");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(I,{name:"input-radio-option",value:"option",onChange:()=>{},options:[{id:"option",value:"option",label:"Option 1"}]}),a.jsx(I,{name:"input-radio-label",label:"Input Radio Label",value:e,onChange:i,options:[{id:"yes",value:"yes",label:"Yes"},{id:"no",value:"no",label:"No"}]}),a.jsx(I,{name:"input-radio-multiple",label:"Input Radio Multiple",value:r,onChange:A,options:[{id:"yes",value:"yes",label:"Yes"},{id:"no",value:"no",label:"No"},{id:"maybe",value:"maybe",label:"Maybe"}]}),a.jsx(I,{horizontal:!0,name:"input-radio-horizontal",label:"Input Radio Horizontal",value:n,onChange:l,options:[{id:"male",value:"male",label:"Male"},{id:"female",value:"female",label:"Female"},{id:"none",value:"none",label:"None"}]})]})}},M={render:()=>{const[n,l]=t.useState("");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(d,{label:"Select",value:n,empty:"No options selected",onChange:e=>l(e.target.value),options:[{id:"br",value:"br",text:"Brazil"},{id:"us",value:"us",text:"United States"}]}),a.jsx(d,{required:!0,empty:"No options selected",label:"Select with Required",value:n,onChange:e=>l(e.target.value),options:[{id:"br",value:"br",text:"Brazil"},{id:"us",value:"us",text:"United States"}]}),a.jsx(d,{empty:"No options selected",label:"Select with Helper",helper:n?"":"Invalid",value:n,onChange:e=>l(e.target.value),options:[{id:"br",value:"br",text:"Brazil"},{id:"us",value:"us",text:"United States"}]}),a.jsx(d,{empty:"No options selected",label:"Select with Group Option",value:n,onChange:e=>l(e.target.value),options:[{id:"br",value:"br",text:"Brazil",group:"America"},{id:"cl",value:"cl",text:"Chile",group:"America"},{id:"ar",value:"ar",text:"Argentina",group:"America"},{id:"fr",value:"fr",text:"France",group:"Europe"},{id:"it",value:"it",text:"Italy",group:"Europe",disabled:!0}]}),a.jsx(d,{disabled:!0,empty:"No options selected",label:"Select Disabled",value:"",onChange:()=>{},options:[]})]})}},w={render:()=>{const[n,l]=t.useState("0.00"),[e,i]=t.useState("USD");return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(p,{label:"Money",value:n,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{required:!0,label:"Money with Required",value:n,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{helper:parseFloat(n)?"":"No value",label:"Money with Helper",value:n,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{label:"Money with Currency",value:n,currency:e,setCurrency:i,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{readOnly:!0,currency:e,setCurrency:i,label:"Money Read Only",value:n,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{disabled:!0,label:"Money Disabled",value:n,placeholder:"0.00",onChange:r=>l(r)}),a.jsx(p,{disabled:!0,currency:e,setCurrency:i,label:"Money Disabled With Currency",value:n,placeholder:"0.00",onChange:r=>l(r)})]})}},j={render:()=>{const[n,l]=t.useState(null);return a.jsxs(u,{internal:1,styles:{width:"30rem"},children:[a.jsx(N,{id:"input-file",label:"Input File",value:n,onChange:e=>l(e.target.files)}),a.jsx(N,{id:"input-file-required",required:!0,accept:"image/*",label:"Input File Required",mimetype:"Send image",value:n,onChange:e=>l(e.target.files)}),a.jsx(N,{id:"input-file-disabled",disabled:!0,multiple:!0,accept:"video/*",label:"Input File Disabled",mimetype:"Choose videos",value:n,onChange:e=>l(e.target.files)})]})}};c.__docgenInfo={description:"",methods:[],displayName:"Number"};h.__docgenInfo={description:"",methods:[],displayName:"Password"};v.__docgenInfo={description:"",methods:[],displayName:"Interval"};m.__docgenInfo={description:"",methods:[],displayName:"Date"};b.__docgenInfo={description:"",methods:[],displayName:"DateTime"};var k,f,T;C.parameters={...C.parameters,docs:{...(k=C.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <Input label="Input Text" value={value} placeholder="John Doe" onChange={e => setValue(e.target.value)} />
        <Input required label="Input with Required" value={value} placeholder="John Doe" onChange={e => setValue(e.target.value)} />
        <Input label="Input with Helper" value={value} placeholder="John Doe" helper={value.length ? "" : "Invalid"} onChange={e => setValue(e.target.value)} />
        <Input readOnly label="Input Read Only" value={value} placeholder="John Doe" onChange={e => setValue(e.target.value)} />
        <Input disabled label="Input Disabled" value={value} placeholder="John Doe" onChange={e => setValue(e.target.value)} />
        <InputText label="Input Text Area" value={value} placeholder="Type here your name" height={4} resize="vertical" onChange={e => setValue(e.target.value)} />
      </Vertical>;
  }
}`,...(T=(f=C.parameters)==null?void 0:f.docs)==null?void 0:T.source}}};var O,R,F;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`() => {
  const [value, setValue] = useState("");
  return <Vertical internal={1} styles={{
    width: "30rem"
  }}>
      <Input label="Input Number" type="number" value={value} placeholder="Type a number" onChange={e => setValue(e.target.value)} />
      <Input label="Input Number with Limit" type="number" value={value} placeholder="Type a number" onChange={e => setValue(e.target.value)} min={1} max={100} step={1} />
      <Input label="Input Number Float" type="number" value={value} placeholder="Type a number" onChange={e => setValue(e.target.value)} min={1} max={100} step={0.1} />
    </Vertical>;
}`,...(F=(R=c.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};var q,z,H;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const [value, setValue] = useState("");
  return <Vertical internal={1} styles={{
    width: "30rem"
  }}>
      <Input label="Password" type="password" value={value} placeholder="**********" onChange={e => setValue(e.target.value)} />
    </Vertical>;
}`,...(H=(z=h.parameters)==null?void 0:z.docs)==null?void 0:H.source}}};var B,_,G;v.parameters={...v.parameters,docs:{...(B=v.parameters)==null?void 0:B.docs,source:{originalSource:`() => {
  const [value, setValue] = useState<[string, string]>(["2025-01-01", "2025-01-28"]);
  return <Vertical internal={1} styles={{
    width: "30rem"
  }}>
      <InputInterval value={value} label="Input Interval" onChange={newValue => setValue(newValue)} />
      <InputInterval required value={value} label="Input Interval Required" onChange={newValue => setValue(newValue)} />
      <InputInterval readOnly value={value} label="Input Interval Read Only" onChange={newValue => setValue(newValue)} />
      <InputInterval disabled value={value} label="Input Interval Disabled" onChange={newValue => setValue(newValue)} />
    </Vertical>;
}`,...(G=(_=v.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var J,Y,U;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`() => {
  const [value, setValue] = useState<string>("2025-01-01");
  return <Vertical internal={1} styles={{
    width: "30rem"
  }}>
      <Input label="Input Date" type="date" value={value} placeholder="DD/MM/AAAA" onChange={e => setValue(e.target.value)} />
    </Vertical>;
}`,...(U=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:U.source}}};var E,P,L;b.parameters={...b.parameters,docs:{...(E=b.parameters)==null?void 0:E.docs,source:{originalSource:`() => {
  const [value, setValue] = useState("2025-01-01T00:00:00");
  return <Vertical internal={1} styles={{
    width: "30rem"
  }}>
      <Input label="Input Date, Hour and Minutes" type="datetime-local" value={value} placeholder="DD/MM/AAAA HH:MM:SS" onChange={e => setValue(e.target.value)} />
      <Input label="Input Date and Time" type="datetime-local" value={value} step={1} placeholder="DD/MM/AAAA HH:MM:SS" onChange={e => setValue(e.target.value)} />
    </Vertical>;
}`,...(L=(P=b.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var W,K,Q;x.parameters={...x.parameters,docs:{...(W=x.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputMask label="Input Mask only Numbers" mask="9999" value={value} placeholder="1234" onChange={e => setValue(e.target.value)} />
        <InputMask label="Input Mask only Text" mask="AAA" value={value} placeholder="ABC" onChange={e => setValue(e.target.value)} />
        <InputMask label="Input Mask Numbers and Text" mask="AAA-9999" value={value} placeholder="ABC-1234" onChange={e => setValue(e.target.value)} />
      </Vertical>;
  }
}`,...(Q=(K=x.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var X,Z,$;V.parameters={...V.parameters,docs:{...(X=V.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<boolean>(false);
    const [terms, setTerms] = useState<boolean>(false);
    const [games, setGames] = useState<string[]>([""]);
    const [fruits, setFruits] = useState<string[]>(["apple"]);
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputCheck value={checked} onChange={newChecked => {
        setChecked(newChecked);
        console.log(newChecked);
      }} options={[{
        id: "check",
        value: "check",
        label: "Without label"
      }]} />
        <InputCheck value={terms} label="Input Check" onChange={newTerms => {
        setTerms(newTerms);
        console.log(newTerms);
      }} options={[{
        id: "agree",
        value: "agree",
        label: "Agree"
      }]} />
        <InputCheck value={fruits} label="Input Check Multiple" onChange={newFruits => {
        setFruits(newFruits);
        console.log(newFruits);
      }} options={[{
        id: "apple",
        value: "apple",
        label: "Apple"
      }, {
        id: "banana",
        value: "banana",
        label: "Banana"
      }, {
        id: "orange",
        value: "orange",
        label: "Orange"
      }, {
        id: "kiwi",
        value: "kiwi",
        label: "Kiwi"
      }]} />
        <InputCheck value={games} horizontal label="Input Check Horizontal" onChange={newGames => {
        setGames(newGames);
        console.log(newGames);
      }} options={[{
        id: "galaga",
        value: "galaga",
        label: "Galaga"
      }, {
        id: "tetris",
        value: "tetris",
        label: "Tetris"
      }, {
        id: "pitfall",
        value: "pitfall",
        label: "Pitfall"
      }]} />
      </Vertical>;
  }
}`,...($=(Z=V.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,ne;S.parameters={...S.parameters,docs:{...(ee=S.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    const [gender, setGender] = useState("none");
    const [yesOrNot, setYesOrNot] = useState("yes");
    const [yesNotOrMaybe, setYesNotOrMaybe] = useState("maybe");
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputRadio name="input-radio-option" value="option" onChange={() => {}} options={[{
        id: "option",
        value: "option",
        label: "Option 1"
      }]} />
        <InputRadio name="input-radio-label" label="Input Radio Label" value={yesOrNot} onChange={setYesOrNot} options={[{
        id: "yes",
        value: "yes",
        label: "Yes"
      }, {
        id: "no",
        value: "no",
        label: "No"
      }]} />
        <InputRadio name="input-radio-multiple" label="Input Radio Multiple" value={yesNotOrMaybe} onChange={setYesNotOrMaybe} options={[{
        id: "yes",
        value: "yes",
        label: "Yes"
      }, {
        id: "no",
        value: "no",
        label: "No"
      }, {
        id: "maybe",
        value: "maybe",
        label: "Maybe"
      }]} />
        <InputRadio horizontal name="input-radio-horizontal" label="Input Radio Horizontal" value={gender} onChange={setGender} options={[{
        id: "male",
        value: "male",
        label: "Male"
      }, {
        id: "female",
        value: "female",
        label: "Female"
      }, {
        id: "none",
        value: "none",
        label: "None"
      }]} />
      </Vertical>;
  }
}`,...(ne=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var le,te,re;M.parameters={...M.parameters,docs:{...(le=M.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputSelect label="Select" value={value} empty="No options selected" onChange={e => setValue(e.target.value)} options={[{
        id: "br",
        value: "br",
        text: "Brazil"
      }, {
        id: "us",
        value: "us",
        text: "United States"
      }]} />
        <InputSelect required empty="No options selected" label="Select with Required" value={value} onChange={e => setValue(e.target.value)} options={[{
        id: "br",
        value: "br",
        text: "Brazil"
      }, {
        id: "us",
        value: "us",
        text: "United States"
      }]} />
        <InputSelect empty="No options selected" label="Select with Helper" helper={value ? "" : "Invalid"} value={value} onChange={e => setValue(e.target.value)} options={[{
        id: "br",
        value: "br",
        text: "Brazil"
      }, {
        id: "us",
        value: "us",
        text: "United States"
      }]} />

        <InputSelect empty="No options selected" label="Select with Group Option" value={value} onChange={e => setValue(e.target.value)} options={[{
        id: "br",
        value: "br",
        text: "Brazil",
        group: "America"
      }, {
        id: "cl",
        value: "cl",
        text: "Chile",
        group: "America"
      }, {
        id: "ar",
        value: "ar",
        text: "Argentina",
        group: "America"
      }, {
        id: "fr",
        value: "fr",
        text: "France",
        group: "Europe"
      }, {
        id: "it",
        value: "it",
        text: "Italy",
        group: "Europe",
        disabled: true
      }]} />

        <InputSelect disabled empty="No options selected" label="Select Disabled" value={""} onChange={() => {}} options={[]} />
      </Vertical>;
  }
}`,...(re=(te=M.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var se,ue,oe;w.parameters={...w.parameters,docs:{...(se=w.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("0.00");
    const [currency, setCurrency] = useState("USD");
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputMoney label="Money" value={value} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney required label="Money with Required" value={value} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney helper={parseFloat(value) ? "" : "No value"} label="Money with Helper" value={value} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney label="Money with Currency" value={value} currency={currency} setCurrency={setCurrency} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney readOnly currency={currency} setCurrency={setCurrency} label="Money Read Only" value={value} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney disabled label="Money Disabled" value={value} placeholder="0.00" onChange={val => setValue(val)} />
        <InputMoney disabled currency={currency} setCurrency={setCurrency} label="Money Disabled With Currency" value={value} placeholder="0.00" onChange={val => setValue(val)} />
      </Vertical>;
  }
}`,...(oe=(ue=w.parameters)==null?void 0:ue.docs)==null?void 0:oe.source}}};var ie,pe,de;j.parameters={...j.parameters,docs:{...(ie=j.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<FileList | null>(null);
    return <Vertical internal={1} styles={{
      width: "30rem"
    }}>
        <InputFile id="input-file" label="Input File" value={value} onChange={e => setValue(e.target.files)} />
        <InputFile id="input-file-required" required accept="image/*" label="Input File Required" mimetype="Send image" value={value} onChange={e => setValue(e.target.files)} />
        <InputFile id="input-file-disabled" disabled multiple accept="video/*" label="Input File Disabled" mimetype="Choose videos" value={value} onChange={e => setValue(e.target.files)} />
      </Vertical>;
  }
}`,...(de=(pe=j.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};const xe=["Text","Number","Password","Interval","Date","DateTime","Mask","Check","Radio","Select","Money","File"];export{V as Check,m as Date,b as DateTime,j as File,v as Interval,x as Mask,w as Money,c as Number,h as Password,S as Radio,M as Select,C as Text,xe as __namedExportsOrder,Ce as default};
