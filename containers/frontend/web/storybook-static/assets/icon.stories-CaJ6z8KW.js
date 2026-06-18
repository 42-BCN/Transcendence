import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{i as n,n as r,r as i,t as a}from"./icon-DJi6_AGr.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var u,d,f,p,m,h,g;e((()=>{u=t(),r(),n(),d=Object.keys(i),f={title:`Components/Primitives/Icon`,component:a,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Decorative icon component. Icons are hidden from assistive technologies with aria-hidden, so meaningful labels must be provided by the parent component when needed.`}}},argTypes:{name:{control:`select`,options:d,description:`Name of the icon to render.`,table:{category:`Content`,type:{summary:`IconName`}}},size:{control:{type:`number`,min:12,max:64,step:4},description:`Icon size in pixels.`,table:{category:`Appearance`,type:{summary:`number`},defaultValue:{summary:`20`}}},className:{control:!1,description:`Optional className for internal styling overrides. Prefer design-token-based usage from parent components.`,table:{category:`Styling`,type:{summary:`string`}}}},args:{name:d[0],size:20}},p={},m={parameters:{docs:{description:{story:`Shows the same icon rendered at different supported sizes.`}}},render:function(){return(0,u.jsxs)(`div`,{className:`flex items-center gap-4 text-text-primary`,children:[(0,u.jsx)(a,{name:d[0],size:16}),(0,u.jsx)(a,{name:d[0],size:20}),(0,u.jsx)(a,{name:d[0],size:24}),(0,u.jsx)(a,{name:d[0],size:32})]})}},h={parameters:{layout:`padded`,docs:{description:{story:`Displays every available icon from the project icon registry.`}}},render:function(){return(0,u.jsx)(`div`,{className:`grid grid-cols-2 gap-4 text-text-primary sm:grid-cols-4 md:grid-cols-6`,children:d.map(function(e){return(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2 rounded-md border border-border-primary bg-bg-primary p-4`,children:[(0,u.jsx)(a,{name:e,size:24}),(0,u.jsx)(`span`,{className:`text-xs`,children:e})]},e)})})}},p.parameters=l(s({},p.parameters),{docs:l(s({},p.parameters?.docs),{source:s({originalSource:`{}`},p.parameters?.docs?.source)})}),m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Shows the same icon rendered at different supported sizes.'
      }
    }
  },
  render: () => <div className="flex items-center gap-4 text-text-primary">
      <Icon name={iconNames[0]} size={16} />
      <Icon name={iconNames[0]} size={20} />
      <Icon name={iconNames[0]} size={24} />
      <Icon name={iconNames[0]} size={32} />
    </div>
}`},m.parameters?.docs?.source)})}),h.parameters=l(s({},h.parameters),{docs:l(s({},h.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Displays every available icon from the project icon registry.'
      }
    }
  },
  render: () => <div className="grid grid-cols-2 gap-4 text-text-primary sm:grid-cols-4 md:grid-cols-6">
      {iconNames.map(name => <div key={name} className="flex flex-col items-center gap-2 rounded-md border border-border-primary bg-bg-primary p-4">
          <Icon name={name} size={24} />
          <span className="text-xs">{name}</span>
        </div>)}
    </div>
}`},h.parameters?.docs?.source)})}),g=[`Default`,`Sizes`,`AllIcons`]}))();export{h as AllIcons,p as Default,m as Sizes,g as __namedExportsOrder,f as default};