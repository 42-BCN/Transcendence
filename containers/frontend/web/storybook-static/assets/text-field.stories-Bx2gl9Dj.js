import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./text-field-Cnf5oMGf.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g;e((()=>{c=t(),n(),l={title:`Components/Composites/TextField`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible text field built on React Aria Components. Labels, descriptions, and errors are resolved through next-intl translation keys.`}}},argTypes:{labelKey:{control:`text`,description:`Translation key used for the field label.`,table:{category:`Content`,type:{summary:`string`}}},descriptionKey:{control:`text`,description:`Optional translation key used for helper text below the input.`,table:{category:`Content`,type:{summary:`string`}}},errorKey:{control:`text`,description:`Optional translation key used for the validation error. When provided, the field is automatically marked as invalid.`,table:{category:`Validation`,type:{summary:`string`}}},isInvalid:{control:`boolean`,description:`Marks the field as invalid. This is also inferred automatically when errorKey is provided.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables the field and prevents user interaction.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Makes the field read-only while keeping it focusable.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isRequired:{control:`boolean`,description:`Marks the field as required for form validation.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},name:{control:`text`,description:`Field name used for form submission. Also used as a stable id when id is not provided.`,table:{category:`Form`,type:{summary:`string`}}},id:{control:`text`,description:`Optional explicit id for the text field.`,table:{category:`Form`,type:{summary:`string`}}},inputProps:{control:`object`,description:`Props forwarded to the inner Input component.`,table:{category:`Input`,type:{summary:`InputProps`}}},inputRef:{control:!1,description:`Optional ref forwarded to the inner input element.`,table:{category:`Refs`,type:{summary:`Ref<HTMLInputElement>`},disable:!0}}},args:{name:`username`,labelKey:`features.auth.fields.username.label`,inputProps:{placeholder:`username`},isDisabled:!1,isReadOnly:!1,isRequired:!1}},u={},d={args:{name:`email`,labelKey:`features.auth.fields.email.label`,inputProps:{placeholder:`email@example.com`,type:`email`}}},f={args:{name:`password`,labelKey:`features.auth.fields.password.label`,errorKey:`validation.REQUIRED`,inputProps:{placeholder:`Password`,type:`password`}}},p={args:{name:`disabled-field`,labelKey:`features.auth.fields.username.label`,inputProps:{placeholder:`Disabled field`},isDisabled:!0}},m={args:{name:`readonly-field`,labelKey:`features.auth.fields.username.label`,inputProps:{value:`Readonly value`,readOnly:!0},isReadOnly:!0}},h={parameters:{docs:{source:{code:`<div className="grid w-full max-w-md gap-6">
  <TextField
    name="username"
    labelKey="features.auth.fields.username.label"
    inputProps={{ placeholder: 'username' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    errorKey="validation.REQUIRED"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <TextField
    name="disabled"
    labelKey="features.auth.fields.username.label"
    inputProps={{ placeholder: 'Disabled field' }}
    isDisabled
  />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-6`,children:[(0,c.jsx)(r,{name:`username`,labelKey:`features.auth.fields.username.label`,inputProps:{placeholder:`username`}}),(0,c.jsx)(r,{name:`password`,labelKey:`features.auth.fields.password.label`,errorKey:`validation.REQUIRED`,inputProps:{placeholder:`Password`,type:`password`}}),(0,c.jsx)(r,{name:`disabled`,labelKey:`features.auth.fields.username.label`,inputProps:{placeholder:`Disabled field`},isDisabled:!0})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    name: 'email',
    labelKey: 'features.auth.fields.email.label',
    inputProps: {
      placeholder: 'email@example.com',
      type: 'email'
    }
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    name: 'password',
    labelKey: 'features.auth.fields.password.label',
    errorKey: 'validation.REQUIRED',
    inputProps: {
      placeholder: 'Password',
      type: 'password'
    }
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    name: 'disabled-field',
    labelKey: 'features.auth.fields.username.label',
    inputProps: {
      placeholder: 'Disabled field'
    },
    isDisabled: true
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    name: 'readonly-field',
    labelKey: 'features.auth.fields.username.label',
    inputProps: {
      value: 'Readonly value',
      readOnly: true
    },
    isReadOnly: true
  }
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-md gap-6">
  <TextField
    name="username"
    labelKey="features.auth.fields.username.label"
    inputProps={{ placeholder: 'username' }}
  />

  <TextField
    name="password"
    labelKey="features.auth.fields.password.label"
    errorKey="validation.REQUIRED"
    inputProps={{ placeholder: 'Password', type: 'password' }}
  />

  <TextField
    name="disabled"
    labelKey="features.auth.fields.username.label"
    inputProps={{ placeholder: 'Disabled field' }}
    isDisabled
  />
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-6">
      <TextField name="username" labelKey="features.auth.fields.username.label" inputProps={{
      placeholder: 'username'
    }} />

      <TextField name="password" labelKey="features.auth.fields.password.label" errorKey="validation.REQUIRED" inputProps={{
      placeholder: 'Password',
      type: 'password'
    }} />

      <TextField name="disabled" labelKey="features.auth.fields.username.label" inputProps={{
      placeholder: 'Disabled field'
    }} isDisabled />
    </div>
}`},h.parameters?.docs?.source)})}),g=[`Default`,`WithDescription`,`WithError`,`Disabled`,`ReadOnly`,`States`]}))();export{u as Default,p as Disabled,m as ReadOnly,h as States,d as WithDescription,f as WithError,g as __namedExportsOrder,l as default};