import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{r as n,t as r}from"./import-thrSrD-k.js";import{t as i}from"./button-C-dueEF_.js";import{t as a}from"./button-BR_7llt8.js";import{o,s}from"./tooltip-trigger-BPWuUCGR.js";import{n as c,t as l}from"./icon-button-B09sRi6u.js";function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function d(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){u(e,t,n[t])})}return e}function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function p(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var m,h,g,_,v,y;e((()=>{m=t(),r(),a(),c(),s(),h={title:`Components/Controls/Tooltip`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible tooltip built on React Aria Components. It renders an overlay arrow and project tooltip styles. Use it inside TooltipTrigger.`}}},argTypes:{children:{control:`text`,description:`Tooltip content.`,table:{category:`Content`,type:{summary:`ReactNode`}}},placement:{control:`select`,options:[`top`,`bottom`,`left`,`right`],description:`Tooltip placement relative to the trigger.`,table:{category:`Position`,type:{summary:`'top' | 'bottom' | 'left' | 'right'`}}},offset:{control:{type:`number`,min:0,max:32,step:1},description:`Distance between the tooltip and trigger. Note: the current component overrides this internally with offset={14}.`,table:{category:`Position`,type:{summary:`number`},defaultValue:{summary:`14`}}},className:{control:!1,description:`Optional className composed with the tooltip styles.`,table:{category:`Styling`,type:{summary:`string | ((values) => string)`},disable:!0}}},args:{children:`Tooltip content`,placement:`top`}},g={parameters:{docs:{source:{code:`<TooltipTrigger>
  <Button w="auto">Hover or focus me</Button>
  <Tooltip placement="top">Tooltip content</Tooltip>
</TooltipTrigger>`}}},render:function(e){return(0,m.jsx)(`div`,{className:`p-12`,children:(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(i,{w:`auto`,children:`Hover or focus me`}),(0,m.jsx)(o,d({},e))]})})}},_={parameters:{docs:{source:{code:`<TooltipTrigger>
  <IconButton label="Settings" icon="settings" />
  <Tooltip placement="top">Open settings</Tooltip>
</TooltipTrigger>`}}},render:function(){return(0,m.jsx)(`div`,{className:`p-12`,children:(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(l,{label:`Settings`,icon:`settings`}),(0,m.jsx)(o,{placement:`top`,children:`Open settings`})]})})}},v={parameters:{docs:{source:{code:`<div className="grid grid-cols-2 gap-10 p-12">
  <TooltipTrigger>
    <Button w="auto">Top</Button>
    <Tooltip placement="top">Top tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Right</Button>
    <Tooltip placement="right">Right tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Bottom</Button>
    <Tooltip placement="bottom">Bottom tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Left</Button>
    <Tooltip placement="left">Left tooltip</Tooltip>
  </TooltipTrigger>
</div>`}}},render:function(){return(0,m.jsxs)(`div`,{className:`grid grid-cols-2 gap-10 p-12`,children:[(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(i,{w:`auto`,children:`Top`}),(0,m.jsx)(o,{placement:`top`,children:`Top tooltip`})]}),(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(i,{w:`auto`,children:`Right`}),(0,m.jsx)(o,{placement:`right`,children:`Right tooltip`})]}),(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(i,{w:`auto`,children:`Bottom`}),(0,m.jsx)(o,{placement:`bottom`,children:`Bottom tooltip`})]}),(0,m.jsxs)(n,{delay:0,children:[(0,m.jsx)(i,{w:`auto`,children:`Left`}),(0,m.jsx)(o,{placement:`left`,children:`Left tooltip`})]})]})}},g.parameters=p(d({},g.parameters),{docs:p(d({},g.parameters?.docs),{source:d({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<TooltipTrigger>
  <Button w="auto">Hover or focus me</Button>
  <Tooltip placement="top">Tooltip content</Tooltip>
</TooltipTrigger>\`
      }
    }
  },
  render: args => <div className="p-12">
      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Hover or focus me</Button>
        <Tooltip {...args} />
      </AriaTooltipTrigger>
    </div>
}`},g.parameters?.docs?.source)})}),_.parameters=p(d({},_.parameters),{docs:p(d({},_.parameters?.docs),{source:d({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<TooltipTrigger>
  <IconButton label="Settings" icon="settings" />
  <Tooltip placement="top">Open settings</Tooltip>
</TooltipTrigger>\`
      }
    }
  },
  render: () => <div className="p-12">
      <AriaTooltipTrigger delay={0}>
        <IconButton label="Settings" icon="settings" />
        <Tooltip placement="top">Open settings</Tooltip>
      </AriaTooltipTrigger>
    </div>
}`},_.parameters?.docs?.source)})}),v.parameters=p(d({},v.parameters),{docs:p(d({},v.parameters?.docs),{source:d({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid grid-cols-2 gap-10 p-12">
  <TooltipTrigger>
    <Button w="auto">Top</Button>
    <Tooltip placement="top">Top tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Right</Button>
    <Tooltip placement="right">Right tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Bottom</Button>
    <Tooltip placement="bottom">Bottom tooltip</Tooltip>
  </TooltipTrigger>

  <TooltipTrigger>
    <Button w="auto">Left</Button>
    <Tooltip placement="left">Left tooltip</Tooltip>
  </TooltipTrigger>
</div>\`
      }
    }
  },
  render: () => <div className="grid grid-cols-2 gap-10 p-12">
      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Top</Button>
        <Tooltip placement="top">Top tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Right</Button>
        <Tooltip placement="right">Right tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Bottom</Button>
        <Tooltip placement="bottom">Bottom tooltip</Tooltip>
      </AriaTooltipTrigger>

      <AriaTooltipTrigger delay={0}>
        <Button w="auto">Left</Button>
        <Tooltip placement="left">Left tooltip</Tooltip>
      </AriaTooltipTrigger>
    </div>
}`},v.parameters?.docs?.source)})}),y=[`Default`,`WithIconButton`,`Placements`]}))();export{g as Default,v as Placements,_ as WithIconButton,y as __namedExportsOrder,h as default};