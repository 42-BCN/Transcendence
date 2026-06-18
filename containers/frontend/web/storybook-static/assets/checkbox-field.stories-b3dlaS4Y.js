import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./checkbox-field-BExvVzlO.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g;e((()=>{c=t(),n(),l={title:`Components/Composites/CheckboxField`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible checkbox field composed from CheckboxGroup, Checkbox, FieldError, and optional rich translated link content.`}}},argTypes:{labelKey:{control:`text`,description:`Translation key used for the checkbox label. Can be a rich-text message when linkHref is provided.`,table:{category:`Content`,type:{summary:`string`}}},errorKey:{control:`text`,description:`Optional translation key for the validation error. When provided, the field is marked as invalid.`,table:{category:`Validation`,type:{summary:`string`}}},linkHref:{control:`text`,description:`Optional internal link href used to render a rich link inside the translated label.`,table:{category:`Content`,type:{summary:`string`}}},defaultSelected:{control:`boolean`,description:`Initial selected state when the checkbox is uncontrolled.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isSelected:{control:`boolean`,description:`Controls whether the checkbox is selected.`,table:{category:`State`,type:{summary:`boolean`}}},isDisabled:{control:`boolean`,description:`Disables the checkbox and prevents user interaction.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Makes the checkbox read-only while keeping it focusable.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isRequired:{control:`boolean`,description:`Marks the checkbox as required for validation.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isInvalid:{control:`boolean`,description:`Marks the checkbox field as invalid. This is also inferred automatically when errorKey is provided.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},onChange:{action:`changed`,description:`Callback fired when the selected state changes.`,table:{category:`Events`,type:{summary:`(isSelected: boolean) => void`}}},name:{control:`text`,description:`Form field name used for submission.`,table:{category:`Form`,type:{summary:`string`}}},value:{control:`text`,description:`Submitted value for the checkbox.`,table:{category:`Form`,type:{summary:`string`}}},className:{control:!1,description:`Optional className passed to the field wrapper.`,table:{category:`Styling`,type:{summary:`ClassValue`},disable:!0}}},args:{labelKey:`features.auth.signup.privacy.label`,name:`terms`,value:`accepted`,defaultSelected:!1,isDisabled:!1,isReadOnly:!1,isRequired:!1}},u={},d={args:{defaultSelected:!0}},f={args:{errorKey:`validation.REQUIRED`},parameters:{docs:{source:{code:`<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.privacy.label"
  errorKey="validation.REQUIRED"
/>`}}}},p={args:{labelKey:`features.auth.signup.privacy.label`,linkHref:`/privacy`},parameters:{docs:{source:{code:`<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.privacy.label"
  linkHref="/privacy"
/>`}}}},m={args:{isDisabled:!0}},h={parameters:{docs:{source:{code:`<div className="grid gap-4">
  <CheckboxField
    name="terms"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
  />

  <CheckboxField
    name="terms-checked"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    defaultSelected
  />

  <CheckboxField
    name="terms-error"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    errorKey="validation.REQUIRED"
  />

  <CheckboxField
    name="terms-link"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    linkHref="/privacy"
  />

  <CheckboxField
    name="terms-disabled"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    isDisabled
  />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid gap-4`,children:[(0,c.jsx)(r,{name:`terms`,value:`accepted`,labelKey:`features.auth.signup.privacy.label`}),(0,c.jsx)(r,{name:`terms-checked`,value:`accepted`,labelKey:`features.auth.signup.privacy.label`,defaultSelected:!0}),(0,c.jsx)(r,{name:`terms-error`,value:`accepted`,labelKey:`features.auth.signup.privacy.label`,errorKey:`validation.REQUIRED`}),(0,c.jsx)(r,{name:`terms-link`,value:`accepted`,labelKey:`features.auth.signup.privacy.label`,linkHref:`/privacy`}),(0,c.jsx)(r,{name:`terms-disabled`,value:`accepted`,labelKey:`features.auth.signup.privacy.label`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    defaultSelected: true
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    errorKey: 'validation.REQUIRED'
  },
  parameters: {
    docs: {
      source: {
        code: \`<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.privacy.label"
  errorKey="validation.REQUIRED"
/>\`
      }
    }
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    labelKey: 'features.auth.signup.privacy.label',
    linkHref: '/privacy'
  },
  parameters: {
    docs: {
      source: {
        code: \`<CheckboxField
  name="terms"
  value="accepted"
  labelKey="features.auth.signup.privacy.label"
  linkHref="/privacy"
/>\`
      }
    }
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    isDisabled: true
  }
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-4">
  <CheckboxField
    name="terms"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
  />

  <CheckboxField
    name="terms-checked"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    defaultSelected
  />

  <CheckboxField
    name="terms-error"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    errorKey="validation.REQUIRED"
  />

  <CheckboxField
    name="terms-link"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    linkHref="/privacy"
  />

  <CheckboxField
    name="terms-disabled"
    value="accepted"
    labelKey="features.auth.signup.privacy.label"
    isDisabled
  />
</div>\`
      }
    }
  },
  render: () => <div className="grid gap-4">
      <CheckboxField name="terms" value="accepted" labelKey="features.auth.signup.privacy.label" />

      <CheckboxField name="terms-checked" value="accepted" labelKey="features.auth.signup.privacy.label" defaultSelected />

      <CheckboxField name="terms-error" value="accepted" labelKey="features.auth.signup.privacy.label" errorKey="validation.REQUIRED" />

      <CheckboxField name="terms-link" value="accepted" labelKey="features.auth.signup.privacy.label" linkHref="/privacy" />

      <CheckboxField name="terms-disabled" value="accepted" labelKey="features.auth.signup.privacy.label" />
    </div>
}`},h.parameters?.docs?.source)})}),g=[`Default`,`Checked`,`WithError`,`WithLink`,`Disabled`,`States`]}))();export{d as Checked,u as Default,m as Disabled,h as States,f as WithError,p as WithLink,g as __namedExportsOrder,l as default};