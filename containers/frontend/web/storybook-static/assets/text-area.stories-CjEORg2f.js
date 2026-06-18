import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./text-area-1MJMrt4c.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m;e((()=>{c=t(),n(),l={title:`Components/Controls/TextArea`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible textarea control built on React Aria Components. It auto-resizes on input by updating the textarea height based on scrollHeight.`}}},argTypes:{placeholder:{control:`text`,description:`Placeholder text shown when the textarea is empty.`,table:{category:`Content`,type:{summary:`string`}}},value:{control:`text`,description:`Controlled textarea value.`,table:{category:`State`,type:{summary:`string`}}},defaultValue:{control:`text`,description:`Initial textarea value when uncontrolled.`,table:{category:`State`,type:{summary:`string`}}},name:{control:`text`,description:`Textarea name used during form submission.`,table:{category:`Form`,type:{summary:`string`}}},rows:{control:{type:`number`,min:1,max:12,step:1},description:`Initial visible row count.`,table:{category:`Layout`,type:{summary:`number`}}},maxLength:{control:{type:`number`,min:10,max:1e3,step:10},description:`Maximum number of characters allowed.`,table:{category:`Validation`,type:{summary:`number`}}},onChange:{action:`changed`,description:`Callback fired when the textarea value changes.`,table:{category:`Events`,type:{summary:`(value: string) => void`}}},className:{control:!1,description:`Optional className merged into the textarea styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{placeholder:`Write something...`,name:`message`,rows:3}},u={},d={args:{defaultValue:`This textarea has an initial value. Try typing more text to see it resize automatically.`}},f={args:{placeholder:`Type multiple lines to test auto-resize...`,rows:2},parameters:{docs:{source:{code:`<TextArea
  rows={2}
  placeholder="Type multiple lines to test auto-resize..."
/>`}}}},p={parameters:{docs:{source:{code:`<div className="grid w-full max-w-md gap-4">
  <TextArea placeholder="Default textarea" />
  <TextArea defaultValue="Textarea with value" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-4`,children:[(0,c.jsx)(r,{placeholder:`Default textarea`}),(0,c.jsx)(r,{defaultValue:`Textarea with value`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    defaultValue: 'This textarea has an initial value. Try typing more text to see it resize automatically.'
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    placeholder: 'Type multiple lines to test auto-resize...',
    rows: 2
  },
  parameters: {
    docs: {
      source: {
        code: \`<TextArea
  rows={2}
  placeholder="Type multiple lines to test auto-resize..."
/>\`
      }
    }
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-md gap-4">
  <TextArea placeholder="Default textarea" />
  <TextArea defaultValue="Textarea with value" />
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-4">
      <TextArea placeholder="Default textarea" />
      <TextArea defaultValue="Textarea with value" />
    </div>
}`},p.parameters?.docs?.source)})}),m=[`Default`,`WithDefaultValue`,`AutoResize`,`States`]}))();export{f as AutoResize,u as Default,p as States,d as WithDefaultValue,m as __namedExportsOrder,l as default};