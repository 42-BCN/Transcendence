import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./disclosure-full-D60_9uFA.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f;e((()=>{c=t(),n(),l={title:`Components/Composites/DisclosureFull`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Composed disclosure component that combines Disclosure, DisclosureTrigger, and DisclosurePanel into a simpler API for common expandable content sections.`}}},argTypes:{id:{control:`text`,description:`Unique identifier passed to the underlying Disclosure.`,table:{category:`Behavior`,type:{summary:`string`}}},title:{control:`text`,description:`Text shown in the disclosure trigger.`,table:{category:`Content`,type:{summary:`string`}}},children:{control:!1,description:`Content rendered inside the disclosure panel.`,table:{category:`Content`,type:{summary:`ReactNode`}}}},args:{id:`faq-account`,title:`How do I update my account?`,children:(0,c.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Open your profile settings and update the fields you want to change.`})}},u={},d={parameters:{docs:{source:{code:`<DisclosureFull id="faq-account" title="How do I update my account?">
  <div className="py-3 text-text-secondary">
    Open your profile settings and update the fields you want to change.
  </div>
</DisclosureFull>`}}},args:{id:`faq-account`,title:`How do I update my account?`,children:(0,c.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Open your profile settings and update the fields you want to change.`})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<DisclosureFull id="faq-account" title="How do I update my account?">
  <div className="py-3 text-text-secondary">
    Open your profile settings and update the fields you want to change.
  </div>
</DisclosureFull>\`
      }
    }
  },
  args: {
    id: 'faq-account',
    title: 'How do I update my account?',
    children: <div className="py-3 text-text-secondary">
        Open your profile settings and update the fields you want to change.
      </div>
  }
}`},d.parameters?.docs?.source)})}),f=[`Default`,`FAQ`]}))();export{u as Default,d as FAQ,f as __namedExportsOrder,l as default};