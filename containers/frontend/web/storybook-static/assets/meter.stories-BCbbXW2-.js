import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./meter-DNf5fubi.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g,_;e((()=>{c=t(),n(),l={title:`Components/Composites/Meter`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible meter component built on React Aria Components. It displays a labeled progress value, value text, and a visual bar.`}}},argTypes:{label:{control:`text`,description:`Optional visible label for the meter.`,table:{category:`Content`,type:{summary:`string`}}},value:{control:{type:`number`,min:0,max:100,step:1},description:`Current meter value.`,table:{category:`State`,type:{summary:`number`}}},minValue:{control:{type:`number`,min:0,max:100,step:1},description:`Minimum meter value.`,table:{category:`State`,type:{summary:`number`},defaultValue:{summary:`0`}}},maxValue:{control:{type:`number`,min:1,max:100,step:1},description:`Maximum value used by React Aria to calculate the percentage.`,table:{category:`State`,type:{summary:`number`}}},max:{control:{type:`number`,min:1,max:100,step:1},description:`Maximum value displayed in the visible value text. This should usually match maxValue.`,table:{category:`Content`,type:{summary:`number`}}},valueLabel:{control:`text`,description:`Accessible value label passed to React Aria. When omitted, React Aria generates valueText.`,table:{category:`Accessibility`,type:{summary:`string`}}},className:{control:!1,description:`Optional className passed to the meter root.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{label:`Profile completion`,value:60,minValue:0,maxValue:100,max:100}},u={},d={args:{label:`Storage used`,value:20,maxValue:100,max:100}},f={args:{label:`Storage used`,value:50,maxValue:100,max:100}},p={args:{label:`Storage used`,value:85,maxValue:100,max:100}},m={args:{label:`Upload progress`,value:100,maxValue:100,max:100}},h={args:{label:`Players ready`,value:3,minValue:0,maxValue:4,max:4},parameters:{docs:{source:{code:`<Meter
  label="Players ready"
  value={3}
  minValue={0}
  maxValue={4}
  max={4}
/>`}}}},g={parameters:{docs:{source:{code:`<div className="grid w-full max-w-md gap-4">
  <Meter label="Low" value={20} maxValue={100} max={100} />
  <Meter label="Medium" value={50} maxValue={100} max={100} />
  <Meter label="High" value={85} maxValue={100} max={100} />
  <Meter label="Complete" value={100} maxValue={100} max={100} />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-4`,children:[(0,c.jsx)(r,{label:`Low`,value:20,maxValue:100,max:100}),(0,c.jsx)(r,{label:`Medium`,value:50,maxValue:100,max:100}),(0,c.jsx)(r,{label:`High`,value:85,maxValue:100,max:100}),(0,c.jsx)(r,{label:`Complete`,value:100,maxValue:100,max:100})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'Storage used',
    value: 20,
    maxValue: 100,
    max: 100
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'Storage used',
    value: 50,
    maxValue: 100,
    max: 100
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'Storage used',
    value: 85,
    maxValue: 100,
    max: 100
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'Upload progress',
    value: 100,
    maxValue: 100,
    max: 100
  }
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  args: {
    label: 'Players ready',
    value: 3,
    minValue: 0,
    maxValue: 4,
    max: 4
  },
  parameters: {
    docs: {
      source: {
        code: \`<Meter
  label="Players ready"
  value={3}
  minValue={0}
  maxValue={4}
  max={4}
/>\`
      }
    }
  }
}`},h.parameters?.docs?.source)})}),g.parameters=s(a({},g.parameters),{docs:s(a({},g.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-md gap-4">
  <Meter label="Low" value={20} maxValue={100} max={100} />
  <Meter label="Medium" value={50} maxValue={100} max={100} />
  <Meter label="High" value={85} maxValue={100} max={100} />
  <Meter label="Complete" value={100} maxValue={100} max={100} />
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-4">
      <Meter label="Low" value={20} maxValue={100} max={100} />
      <Meter label="Medium" value={50} maxValue={100} max={100} />
      <Meter label="High" value={85} maxValue={100} max={100} />
      <Meter label="Complete" value={100} maxValue={100} max={100} />
    </div>
}`},g.parameters?.docs?.source)})}),_=[`Default`,`LowValue`,`MediumValue`,`HighValue`,`Complete`,`CustomMaximum`,`States`]}))();export{m as Complete,h as CustomMaximum,u as Default,p as HighValue,d as LowValue,f as MediumValue,g as States,_ as __namedExportsOrder,l as default};