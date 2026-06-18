import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{t as n}from"./button-C-dueEF_.js";import{t as r}from"./button-BR_7llt8.js";import{t as i}from"./text-field-Cnf5oMGf.js";import{n as a,r as o,t as s}from"./text-field-eZWeBiKW.js";function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){c(e,t,n[t])})}return e}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function d(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var f,p,m,h,g;e((()=>{f=t(),r(),s(),o(),p={title:`Components/Composites/Form`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Base form wrapper that applies project form styles and supports native form actions, server actions, and GET/POST methods.`}}},argTypes:{action:{control:!1,description:`Native form action URL or server action function. Usually provided by feature-level forms.`,table:{category:`Behavior`,type:{summary:`string | (formData: FormData) => void | Promise<void>`}}},method:{control:`select`,options:[`GET`,`POST`],description:`Native form method. Defaults to browser behavior when omitted.`,table:{category:`Behavior`,type:{summary:`'GET' | 'POST'`}}},className:{control:!1,description:`Optional className merged with the base form styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}},children:{control:!1,description:`Form content, usually fields, feedback, and submit controls.`,table:{category:`Content`,type:{summary:`ReactNode`}}},onSubmit:{action:`submitted`,description:`Optional submit handler. Feature forms can use this for client-side validation before calling a server action.`,table:{category:`Events`,type:{summary:`FormEventHandler<HTMLFormElement>`}}}}},m={parameters:{docs:{source:{code:`<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <Button type="submit" variant="cta">
    Submit
  </Button>
</Form>`}}},render:function(){return(0,f.jsx)(`div`,{className:`w-full max-w-md`,children:(0,f.jsxs)(a,{onSubmit:function(e){e.preventDefault()},children:[(0,f.jsx)(i,{name:`email`,labelKey:`features.auth.fields.email.label`,inputProps:{placeholder:`email@example.com`,type:`email`}}),(0,f.jsx)(n,{type:`submit`,variant:`cta`,children:`Submit`})]})})}},h={parameters:{docs:{source:{code:`<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <Button type="submit" variant="cta">
    Create account
  </Button>
</Form>`}}},render:function(){return(0,f.jsx)(`div`,{className:`w-full max-w-md`,children:(0,f.jsxs)(a,{onSubmit:function(e){e.preventDefault()},children:[(0,f.jsx)(i,{name:`email`,labelKey:`features.auth.fields.email.label`,inputProps:{placeholder:`email@example.com`,type:`email`}}),(0,f.jsx)(i,{name:`password`,labelKey:`features.auth.fields.password.label`,inputProps:{placeholder:`Password`,type:`password`}}),(0,f.jsx)(n,{type:`submit`,variant:`cta`,children:`Create account`})]})})}},m.parameters=d(l({},m.parameters),{docs:d(l({},m.parameters?.docs),{source:l({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <Button type="submit" variant="cta">
    Submit
  </Button>
</Form>\`
      }
    }
  },
  render: () => <div className="w-full max-w-md">
      <Form onSubmit={event => {
      event.preventDefault();
    }}>
        <TextField name="email" labelKey="features.auth.fields.email.label" inputProps={{
        placeholder: 'email@example.com',
        type: 'email'
      }} />

        <Button type="submit" variant="cta">
          Submit
        </Button>
      </Form>
    </div>
}`},m.parameters?.docs?.source)})}),h.parameters=d(l({},h.parameters),{docs:d(l({},h.parameters?.docs),{source:l({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Form>
  <TextField
    name="email"
    labelKey="features.auth.fields.email.label"
    inputProps={{ placeholder: 'email@example.com', type: 'email' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <Button type="submit" variant="cta">
    Create account
  </Button>
</Form>\`
      }
    }
  },
  render: () => <div className="w-full max-w-md">
      <Form onSubmit={event => {
      event.preventDefault();
    }}>
        <TextField name="email" labelKey="features.auth.fields.email.label" inputProps={{
        placeholder: 'email@example.com',
        type: 'email'
      }} />

        <TextField name="password" labelKey="features.auth.fields.password.label" inputProps={{
        placeholder: 'Password',
        type: 'password'
      }} />

        <Button type="submit" variant="cta">
          Create account
        </Button>
      </Form>
    </div>
}`},h.parameters?.docs?.source)})}),g=[`Default`,`WithMultipleFields`]}))();export{m as Default,h as WithMultipleFields,g as __namedExportsOrder,p as default};