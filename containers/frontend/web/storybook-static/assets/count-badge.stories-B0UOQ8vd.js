import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./count-badge-Ds6kKr6L.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m;e((()=>{c=t(),n(),l={title:`Components/Primitives/CountBadge`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Numeric badge used for notification counts in navigation and social sections. Renders nothing when count is 0 or undefined.`}}},argTypes:{count:{control:{type:`number`,min:0,max:200},description:`The count value to display. Badge is hidden when count <= 0.`,table:{category:`Content`,type:{summary:`number`}}},max:{control:{type:`number`,min:1,max:999},description:`Maximum displayable count. Values above this show as "max+".`,table:{category:`Content`,type:{summary:`number`},defaultValue:{summary:`99`}}},tone:{control:`select`,options:[`danger`],description:`Visual tone/color scheme.`,table:{category:`Appearance`,type:{summary:`'danger'`},defaultValue:{summary:`danger`}}},placement:{control:`select`,options:[`inline`,`overlay`],description:`Positioning mode: inline within text flow or overlaid on a parent element.`,table:{category:`Layout`,type:{summary:`'inline' | 'overlay'`},defaultValue:{summary:`inline`}}}},args:{count:5,max:99,tone:`danger`,placement:`inline`}},u={},d={args:{count:0}},f={args:{count:150,max:99}},p={args:{count:3,placement:`overlay`},render:function(e){return(0,c.jsxs)(`div`,{className:`relative inline-block rounded-md border border-gray-300 p-4`,children:[(0,c.jsx)(`span`,{children:`Inbox`}),(0,c.jsx)(r,a({},e))]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    count: 0
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    count: 150,
    max: 99
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    count: 3,
    placement: 'overlay'
  },
  render: args => <div className="relative inline-block rounded-md border border-gray-300 p-4">
      <span>Inbox</span>
      <CountBadge {...args} />
    </div>
}`},p.parameters?.docs?.source)})}),m=[`Default`,`Zero`,`HighCount`,`OverlayPlacement`]}))();export{u as Default,f as HighCount,p as OverlayPlacement,d as Zero,m as __namedExportsOrder,l as default};