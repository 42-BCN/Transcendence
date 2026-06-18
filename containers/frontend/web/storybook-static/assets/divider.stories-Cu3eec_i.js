import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./divider-PVGMsKon.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p;e((()=>{c=t(),n(),l={title:`Components/Composites/Divider`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Simple text divider used to separate related UI sections, commonly between alternative actions such as email sign-in and OAuth sign-in.`}}},argTypes:{label:{control:`text`,description:`Text displayed inside the divider.`,table:{category:`Content`,type:{summary:`string`}}}},args:{label:`or`}},u={},d={args:{label:`or continue with`},parameters:{docs:{source:{code:`<Divider label="or continue with" />`}}}},f={parameters:{docs:{description:{story:`Example of the divider between two authentication sections.`},source:{code:`<div className="grid w-full max-w-sm gap-4">
  <button type="button">Continue with email</button>
  <Divider label="or" />
  <button type="button">Continue with Google</button>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-sm gap-4`,children:[(0,c.jsx)(`button`,{type:`button`,className:`rounded-md border border-border-primary px-4 py-2 text-text-primary`,children:`Continue with email`}),(0,c.jsx)(r,{label:`or`}),(0,c.jsx)(`button`,{type:`button`,className:`rounded-md border border-border-primary px-4 py-2 text-text-primary`,children:`Continue with Google`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'or continue with'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Divider label="or continue with" />\`
      }
    }
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Example of the divider between two authentication sections.'
      },
      source: {
        code: \`<div className="grid w-full max-w-sm gap-4">
  <button type="button">Continue with email</button>
  <Divider label="or" />
  <button type="button">Continue with Google</button>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-sm gap-4">
      <button type="button" className="rounded-md border border-border-primary px-4 py-2 text-text-primary">
        Continue with email
      </button>

      <Divider label="or" />

      <button type="button" className="rounded-md border border-border-primary px-4 py-2 text-text-primary">
        Continue with Google
      </button>
    </div>
}`},f.parameters?.docs?.source)})}),p=[`Default`,`AuthDivider`,`InContext`]}))();export{d as AuthDivider,u as Default,f as InContext,p as __namedExportsOrder,l as default};