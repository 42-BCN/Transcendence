import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{i as n,r}from"./icon-DJi6_AGr.js";import{n as i,t as a}from"./icon-button-B09sRi6u.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var u,d,f,p,m,h,g,_,v;e((()=>{u=t(),i(),n(),d=Object.keys(r),f={title:`Components/Composites/IconButton`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible icon-only button composed from Button, Icon, and TooltipTrigger. The visible tooltip and aria-label both come from the required label prop.`}}},argTypes:{label:{control:`text`,description:`Accessible label for the icon button. Also used as the tooltip content.`,table:{category:`Accessibility`,type:{summary:`string`}}},icon:{control:`select`,options:d,description:`Name of the icon rendered inside the button.`,table:{category:`Content`,type:{summary:`IconName`}}},placement:{control:`select`,options:[`top`,`bottom`,`left`,`right`],description:`Tooltip placement relative to the button.`,table:{category:`Tooltip`,type:{summary:`'top' | 'bottom' | 'left' | 'right'`},defaultValue:{summary:`top`}}},variant:{control:`select`,options:[`primary`,`secondary`],description:`Visual style passed to the underlying Button.`,table:{category:`Appearance`,type:{summary:`InteractiveControlVariant`},defaultValue:{summary:`secondary`}}},isDisabled:{control:`boolean`,description:`Disables the icon button and prevents user interaction.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},onPress:{action:`pressed`,description:`Callback fired when the button is pressed through mouse, touch, keyboard, or assistive technology.`,table:{category:`Events`,type:{summary:`(event) => void`}}},type:{control:`select`,options:[`button`,`submit`,`reset`],description:`Native button type passed to the underlying Button.`,table:{category:`Form`,type:{summary:`'button' | 'submit' | 'reset'`}}},id:{control:`text`,description:`Optional id passed to the underlying Button.`,table:{category:`DOM`,type:{summary:`string`}}},className:{control:!1,description:`Optional className passed to the underlying Button. Hidden from controls to keep the component API constrained.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{label:`Open chat`,icon:d[0],placement:`top`,variant:`secondary`,isDisabled:!1,type:`button`}},p={},m={args:{label:`Disabled action`,isDisabled:!0}},h={parameters:{docs:{description:{story:`Shows the available tooltip placements.`},source:{code:`<div className="flex items-center gap-4">
  <IconButton label="Tooltip top" icon="messages" placement="top" />
  <IconButton label="Tooltip bottom" icon="messages" placement="bottom" />
  <IconButton label="Tooltip left" icon="messages" placement="left" />
  <IconButton label="Tooltip right" icon="messages" placement="right" />
</div>`}}},render:function(){return(0,u.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,u.jsx)(a,{label:`Tooltip top`,icon:d[0],placement:`top`}),(0,u.jsx)(a,{label:`Tooltip bottom`,icon:d[0],placement:`bottom`}),(0,u.jsx)(a,{label:`Tooltip left`,icon:d[0],placement:`left`}),(0,u.jsx)(a,{label:`Tooltip right`,icon:d[0],placement:`right`})]})}},g={parameters:{docs:{description:{story:`Shows the supported visual variants.`},source:{code:`<div className="flex items-center gap-4">
  <IconButton label="Primary action" icon="check" variant="primary" />
  <IconButton label="Secondary action" icon="messages" variant="secondary" />
</div>`}}},render:function(){return(0,u.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,u.jsx)(a,{label:`Primary action`,icon:d[0],variant:`primary`}),(0,u.jsx)(a,{label:`Secondary action`,icon:d[0],variant:`secondary`})]})}},_={parameters:{docs:{description:{story:`Example icon buttons for common UI actions.`},source:{code:`<div className="flex items-center gap-4">
  <IconButton label="Accept" icon="check" />
  <IconButton label="Reject" icon="close" />
  <IconButton label="Open chat" icon="messages" />
</div>`}}},render:function(){return(0,u.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,u.jsx)(a,{label:`Accept`,icon:d[0]}),(0,u.jsx)(a,{label:`Reject`,icon:d[0]}),(0,u.jsx)(a,{label:`Open chat`,icon:d[0]})]})}},p.parameters=l(s({},p.parameters),{docs:l(s({},p.parameters?.docs),{source:s({originalSource:`{}`},p.parameters?.docs?.source)})}),m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{
  args: {
    label: 'Disabled action',
    isDisabled: true
  }
}`},m.parameters?.docs?.source)})}),h.parameters=l(s({},h.parameters),{docs:l(s({},h.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Shows the available tooltip placements.'
      },
      source: {
        code: \`<div className="flex items-center gap-4">
  <IconButton label="Tooltip top" icon="messages" placement="top" />
  <IconButton label="Tooltip bottom" icon="messages" placement="bottom" />
  <IconButton label="Tooltip left" icon="messages" placement="left" />
  <IconButton label="Tooltip right" icon="messages" placement="right" />
</div>\`
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <IconButton label="Tooltip top" icon={iconNames[0]} placement="top" />
      <IconButton label="Tooltip bottom" icon={iconNames[0]} placement="bottom" />
      <IconButton label="Tooltip left" icon={iconNames[0]} placement="left" />
      <IconButton label="Tooltip right" icon={iconNames[0]} placement="right" />
    </div>
}`},h.parameters?.docs?.source)})}),g.parameters=l(s({},g.parameters),{docs:l(s({},g.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Shows the supported visual variants.'
      },
      source: {
        code: \`<div className="flex items-center gap-4">
  <IconButton label="Primary action" icon="check" variant="primary" />
  <IconButton label="Secondary action" icon="messages" variant="secondary" />
</div>\`
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <IconButton label="Primary action" icon={iconNames[0]} variant="primary" />
      <IconButton label="Secondary action" icon={iconNames[0]} variant="secondary" />
    </div>
}`},g.parameters?.docs?.source)})}),_.parameters=l(s({},_.parameters),{docs:l(s({},_.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Example icon buttons for common UI actions.'
      },
      source: {
        code: \`<div className="flex items-center gap-4">
  <IconButton label="Accept" icon="check" />
  <IconButton label="Reject" icon="close" />
  <IconButton label="Open chat" icon="messages" />
</div>\`
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <IconButton label="Accept" icon={iconNames[0]} />
      <IconButton label="Reject" icon={iconNames[0]} />
      <IconButton label="Open chat" icon={iconNames[0]} />
    </div>
}`},_.parameters?.docs?.source)})}),v=[`Default`,`Disabled`,`Placements`,`Variants`,`CommonActions`]}))();export{_ as CommonActions,p as Default,m as Disabled,h as Placements,g as Variants,v as __namedExportsOrder,f as default};