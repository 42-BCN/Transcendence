import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./checkbox-CxX4E7W1.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g,_;e((()=>{c=t(),n(),l={title:`Components/Controls/Checkbox`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible checkbox control built on React Aria Components. It supports selected, indeterminate, invalid, disabled, read-only, and required states.`}}},argTypes:{children:{control:`text`,description:`Optional visible label rendered next to the checkbox.`,table:{category:`Content`,type:{summary:`ReactNode`}}},isSelected:{control:`boolean`,description:`Controls whether the checkbox is selected.`,table:{category:`State`,type:{summary:`boolean`}}},defaultSelected:{control:`boolean`,description:`Initial selected state when the checkbox is uncontrolled.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isIndeterminate:{control:`boolean`,description:`Displays the checkbox in an indeterminate mixed state.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isInvalid:{control:`boolean`,description:`Marks the checkbox as invalid for validation styling.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables the checkbox and prevents user interaction.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Makes the checkbox read-only while keeping it focusable.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isRequired:{control:`boolean`,description:`Marks the checkbox as required for form validation.`,table:{category:`Validation`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},onChange:{action:`changed`,description:`Callback fired when the selected state changes.`,table:{category:`Events`,type:{summary:`(isSelected: boolean) => void`}}},name:{control:`text`,description:`Name used when submitting the checkbox in a form.`,table:{category:`Form`,type:{summary:`string`}}},value:{control:`text`,description:`Value submitted when the checkbox is selected.`,table:{category:`Form`,type:{summary:`string`}}},className:{control:!1,description:`Optional className merged into the checkbox root styles.`,table:{category:`Styling`,type:{summary:`string | ((values) => string)`},disable:!0}}},args:{children:`Accept terms`,name:`terms`,value:`accepted`,defaultSelected:!1,isDisabled:!1,isReadOnly:!1,isRequired:!1,isInvalid:!1,isIndeterminate:!1}},u={},d={args:{defaultSelected:!0}},f={args:{isIndeterminate:!0,children:`Partially selected`}},p={args:{isInvalid:!0,children:`Invalid checkbox`}},m={args:{isDisabled:!0,children:`Disabled checkbox`}},h={args:{children:void 0,"aria-label":`Accept terms`},parameters:{docs:{source:{code:`<Checkbox aria-label="Accept terms" />`}}}},g={parameters:{docs:{source:{code:`<div className="grid gap-4">
  <Checkbox>Default</Checkbox>
  <Checkbox defaultSelected>Selected</Checkbox>
  <Checkbox isIndeterminate>Indeterminate</Checkbox>
  <Checkbox isInvalid>Invalid</Checkbox>
  <Checkbox isDisabled>Disabled</Checkbox>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid gap-4`,children:[(0,c.jsx)(r,{children:`Default`}),(0,c.jsx)(r,{defaultSelected:!0,children:`Selected`}),(0,c.jsx)(r,{isIndeterminate:!0,children:`Indeterminate`}),(0,c.jsx)(r,{isInvalid:!0,children:`Invalid`}),(0,c.jsx)(r,{isDisabled:!0,children:`Disabled`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    defaultSelected: true
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    isIndeterminate: true,
    children: 'Partially selected'
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    isInvalid: true,
    children: 'Invalid checkbox'
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    isDisabled: true,
    children: 'Disabled checkbox'
  }
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  args: {
    children: undefined,
    'aria-label': 'Accept terms'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Checkbox aria-label="Accept terms" />\`
      }
    }
  }
}`},h.parameters?.docs?.source)})}),g.parameters=s(a({},g.parameters),{docs:s(a({},g.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-4">
  <Checkbox>Default</Checkbox>
  <Checkbox defaultSelected>Selected</Checkbox>
  <Checkbox isIndeterminate>Indeterminate</Checkbox>
  <Checkbox isInvalid>Invalid</Checkbox>
  <Checkbox isDisabled>Disabled</Checkbox>
</div>\`
      }
    }
  },
  render: () => <div className="grid gap-4">
      <Checkbox>Default</Checkbox>
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isInvalid>Invalid</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
    </div>
}`},g.parameters?.docs?.source)})}),_=[`Default`,`Selected`,`Indeterminate`,`Invalid`,`Disabled`,`WithoutLabel`,`States`]}))();export{u as Default,m as Disabled,f as Indeterminate,p as Invalid,d as Selected,g as States,h as WithoutLabel,_ as __namedExportsOrder,l as default};