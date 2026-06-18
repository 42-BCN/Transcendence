import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{t as n}from"./button-C-dueEF_.js";import{t as r}from"./button-BR_7llt8.js";import{i,n as a,r as o}from"./tooltip-trigger-BPWuUCGR.js";import{n as s,t as c}from"./icon-button-B09sRi6u.js";function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){l(e,t,n[t])})}return e}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function f(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function p(e,t){if(e==null)return{};var n={},r,i,a;if(typeof Reflect<`u`&&Reflect.ownKeys){for(r=Reflect.ownKeys(e),a=0;a<r.length;a++)i=r[a],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i]);return n}if(n=m(e,t),Object.getOwnPropertySymbols)for(r=Object.getOwnPropertySymbols(e),a=0;a<r.length;a++)i=r[a],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i]);return n}function m(e,t){if(e==null)return{};var n={},r=Object.getOwnPropertyNames(e),i,a;for(a=0;a<r.length;a++)i=r[a],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i]);return n}function h(e){var t=e.children;return(0,g.jsx)(o,f(u({},p(e,[`children`])),{children:t??(0,g.jsx)(n,{w:`auto`,children:`Hover or focus me`})}))}var g,_,v,y,b,x,S;e((()=>{g=t(),r(),s(),i(),_={title:`Components/Composites/TooltipTrigger`,component:h,tags:[`autodocs`],parameters:{docs:{description:{component:`Tooltip trigger composition built on React Aria Components. It wraps an interactive child and renders a project Tooltip with configurable placement and offset.`}}},argTypes:{children:{control:!1,description:`Interactive element that triggers the tooltip. Usually a Button, IconButton, or Link.`,table:{category:`Content`,type:{summary:`ReactNode`}}},label:{control:`text`,description:`Tooltip text content.`,table:{category:`Content`,type:{summary:`string`}}},placement:{control:`select`,options:[`left`,`right`,`top`,`bottom`],description:`Tooltip placement relative to the trigger.`,table:{category:`Position`,type:{summary:`'left' | 'right' | 'top' | 'bottom'`},defaultValue:{summary:`right`}}},offset:{control:{type:`number`,min:0,max:32,step:1},description:`Distance in pixels between the trigger and the tooltip.`,table:{category:`Position`,type:{summary:`number`}}}},args:{label:`Tooltip content`,placement:`right`,offset:8}},v={parameters:{docs:{source:{code:`<TooltipTrigger label="Tooltip content" placement="right" offset={8}>
  <Button w="auto">Hover or focus me</Button>
</TooltipTrigger>`}}}},y={args:{label:`Open settings`,placement:`top`,offset:8,children:(0,g.jsx)(c,{label:`Settings`,icon:`settings`})},parameters:{docs:{source:{code:`<TooltipTrigger label="Open settings" placement="top" offset={8}>
  <IconButton label="Settings" icon="settings" />
</TooltipTrigger>`}}}},b={parameters:{docs:{source:{code:`<div className="grid grid-cols-2 gap-8">
  <TooltipTrigger label="Top tooltip" placement="top">
    <Button w="auto">Top</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Right tooltip" placement="right">
    <Button w="auto">Right</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Bottom tooltip" placement="bottom">
    <Button w="auto">Bottom</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Left tooltip" placement="left">
    <Button w="auto">Left</Button>
  </TooltipTrigger>
</div>`}}},render:function(){return(0,g.jsxs)(`div`,{className:`grid grid-cols-2 gap-8 p-12`,children:[(0,g.jsx)(o,{label:`Top tooltip`,placement:`top`,children:(0,g.jsx)(n,{w:`auto`,children:`Top`})}),(0,g.jsx)(o,{label:`Right tooltip`,placement:`right`,children:(0,g.jsx)(n,{w:`auto`,children:`Right`})}),(0,g.jsx)(o,{label:`Bottom tooltip`,placement:`bottom`,children:(0,g.jsx)(n,{w:`auto`,children:`Bottom`})}),(0,g.jsx)(o,{label:`Left tooltip`,placement:`left`,children:(0,g.jsx)(n,{w:`auto`,children:`Left`})})]})}},x={parameters:{docs:{description:{story:`TooltipLink composes InternalLink with TooltipTrigger for link-specific tooltip usage.`},source:{code:`<TooltipLink href="/settings" label="Go to settings">
  Settings
</TooltipLink>`}}},render:function(){return(0,g.jsx)(a,{href:`/me`,label:`Go to settings`,placement:`left`,children:`Settings`})}},v.parameters=f(u({},v.parameters),{docs:f(u({},v.parameters?.docs),{source:u({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<TooltipTrigger label="Tooltip content" placement="right" offset={8}>
  <Button w="auto">Hover or focus me</Button>
</TooltipTrigger>\`
      }
    }
  }
}`},v.parameters?.docs?.source)})}),y.parameters=f(u({},y.parameters),{docs:f(u({},y.parameters?.docs),{source:u({originalSource:`{
  args: {
    label: 'Open settings',
    placement: 'top',
    offset: 8,
    children: <IconButton label="Settings" icon="settings" />
  },
  parameters: {
    docs: {
      source: {
        code: \`<TooltipTrigger label="Open settings" placement="top" offset={8}>
  <IconButton label="Settings" icon="settings" />
</TooltipTrigger>\`
      }
    }
  }
}`},y.parameters?.docs?.source)})}),b.parameters=f(u({},b.parameters),{docs:f(u({},b.parameters?.docs),{source:u({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid grid-cols-2 gap-8">
  <TooltipTrigger label="Top tooltip" placement="top">
    <Button w="auto">Top</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Right tooltip" placement="right">
    <Button w="auto">Right</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Bottom tooltip" placement="bottom">
    <Button w="auto">Bottom</Button>
  </TooltipTrigger>

  <TooltipTrigger label="Left tooltip" placement="left">
    <Button w="auto">Left</Button>
  </TooltipTrigger>
</div>\`
      }
    }
  },
  render: () => <div className="grid grid-cols-2 gap-8 p-12">
      <TooltipTrigger label="Top tooltip" placement="top">
        <Button w="auto">Top</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Right tooltip" placement="right">
        <Button w="auto">Right</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Bottom tooltip" placement="bottom">
        <Button w="auto">Bottom</Button>
      </TooltipTrigger>

      <TooltipTrigger label="Left tooltip" placement="left">
        <Button w="auto">Left</Button>
      </TooltipTrigger>
    </div>
}`},b.parameters?.docs?.source)})}),x.parameters=f(u({},x.parameters),{docs:f(u({},x.parameters?.docs),{source:u({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'TooltipLink composes InternalLink with TooltipTrigger for link-specific tooltip usage.'
      },
      source: {
        code: \`<TooltipLink href="/settings" label="Go to settings">
  Settings
</TooltipLink>\`
      }
    }
  },
  render: () => <TooltipLink href="/me" label="Go to settings" placement="left">
      Settings
    </TooltipLink>
}`},x.parameters?.docs?.source)})}),S=[`WithButton`,`WithIconButton`,`Placements`,`Link`]}))();export{x as Link,b as Placements,v as WithButton,y as WithIconButton,S as __namedExportsOrder,_ as default};