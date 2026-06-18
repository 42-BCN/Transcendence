import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./input-DGo3Z4NG.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h;e((()=>{c=t(),n(),l={title:`Components/Controls/Input`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible input control built on React Aria Components. It provides project styling through controlled variant and size props.`}}},argTypes:{variant:{control:`select`,options:[`default`],description:`Visual style variant of the input.`,table:{category:`Appearance`,type:{summary:`InputVariant`},defaultValue:{summary:`default`}}},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Input size, usually controlling height, padding, and text size.`,table:{category:`Appearance`,type:{summary:`InputSize`},defaultValue:{summary:`md`}}},placeholder:{control:`text`,description:`Placeholder text shown when the input is empty.`,table:{category:`Content`,type:{summary:`string`}}},value:{control:`text`,description:`Controlled input value.`,table:{category:`State`,type:{summary:`string`}}},defaultValue:{control:`text`,description:`Initial input value when uncontrolled.`,table:{category:`State`,type:{summary:`string`}}},type:{control:`select`,options:[`text`,`email`,`password`,`search`,`url`,`tel`,`number`],description:`Native input type.`,table:{category:`Behavior`,type:{summary:`HTML input type`},defaultValue:{summary:`text`}}},name:{control:`text`,description:`Input name used during form submission.`,table:{category:`Form`,type:{summary:`string`}}},onChange:{action:`changed`,description:`Callback fired when the input value changes.`,table:{category:`Events`,type:{summary:`(value: string) => void`}}},ref:{control:!1,description:`Forwarded ref to the underlying HTML input element.`,table:{category:`Refs`,type:{summary:`Ref<HTMLInputElement>`},disable:!0}}},args:{variant:`default`,size:`md`,type:`text`,placeholder:`Type something...`,name:`example`}},u={},d={args:{type:`email`,placeholder:`email@example.com`,name:`email`}},f={args:{type:`password`,placeholder:`Password`,name:`password`}},p={parameters:{docs:{source:{code:`<div className="grid w-full max-w-xs gap-4">
  <Input size="sm" placeholder="Small input" />
  <Input size="md" placeholder="Medium input" />
  <Input size="lg" placeholder="Large input" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-xs gap-4`,children:[(0,c.jsx)(r,{size:`sm`,placeholder:`Small input`}),(0,c.jsx)(r,{size:`md`,placeholder:`Medium input`}),(0,c.jsx)(r,{size:`lg`,placeholder:`Large input`})]})}},m={parameters:{docs:{source:{code:`<div className="grid w-full max-w-xs gap-4">
  <Input placeholder="Default input" />
  <Input defaultValue="Filled input" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-xs gap-4`,children:[(0,c.jsx)(r,{placeholder:`Default input`}),(0,c.jsx)(r,{defaultValue:`Filled input`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    type: 'email',
    placeholder: 'email@example.com',
    name: 'email'
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Password',
    name: 'password'
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-xs gap-4">
  <Input size="sm" placeholder="Small input" />
  <Input size="md" placeholder="Medium input" />
  <Input size="lg" placeholder="Large input" />
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-xs gap-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-xs gap-4">
  <Input placeholder="Default input" />
  <Input defaultValue="Filled input" />
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-xs gap-4">
      <Input placeholder="Default input" />
      <Input defaultValue="Filled input" />
    </div>
}`},m.parameters?.docs?.source)})}),h=[`Default`,`Email`,`Password`,`Sizes`,`States`]}))();export{u as Default,d as Email,f as Password,p as Sizes,m as States,h as __namedExportsOrder,l as default};