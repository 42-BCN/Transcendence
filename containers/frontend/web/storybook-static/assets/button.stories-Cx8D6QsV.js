import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./button-C-dueEF_.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h;e((()=>{c=t(),n(),l={title:`Components/Controls/Button`,component:r,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Accessible button built on React Aria Components.`}}},argTypes:{variant:{control:`select`,options:[`primary`,`secondary`],description:`Controls the visual style of the button.`,table:{category:`Appearance`,type:{summary:`'primary' | 'secondary'`},defaultValue:{summary:`primary`}}},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Controls the button size, including height, padding, and text size.`,table:{category:`Appearance`,type:{summary:`'sm' | 'md' | 'lg'`},defaultValue:{summary:`md`}}},w:{control:`select`,options:[`full`,`auto`],description:`Controls whether the button fills the available width or only takes the space it needs.`,table:{category:`Appearance`,type:{summary:`'full' | 'auto'`},defaultValue:{summary:`auto`}}},isDisabled:{control:`boolean`,description:`Disables the button and prevents user interaction.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},onPress:{action:`pressed`,description:`Callback fired when the button is pressed through mouse, touch, keyboard, or assistive technology.`,table:{category:`Events`,type:{summary:`(event) => void`}}},className:{control:!1,description:`Optional internal styling escape hatch. Hidden from controls to keep the public API constrained.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}},children:{control:!1,description:`Button content. Usually plain text, but it can also be composed content when needed.`,table:{category:`Content`,type:{summary:`ReactNode`},disable:!0}}},args:{w:`auto`,variant:`primary`,size:`md`,children:`Button`}},u={},d=function(){return(0,c.jsx)(`svg`,{"aria-hidden":`true`,width:`16`,height:`16`,viewBox:`0 0 16 16`,fill:`currentColor`,children:(0,c.jsx)(`path`,{d:`M8.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.19 8.75H3a.75.75 0 0 1 0-1.5h8.19L8.22 4.28a.75.75 0 0 1 0-1.06Z`})})},f={parameters:{layout:`padded`},args:{w:`full`,children:`Full width`}},p={render:function(){return(0,c.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,c.jsx)(r,{size:`icon`,w:`auto`,icon:(0,c.jsx)(d,{}),"aria-label":`Icon`}),(0,c.jsx)(r,{size:`sm`,w:`auto`,children:`Small`}),(0,c.jsx)(r,{size:`md`,w:`auto`,children:`Medium`}),(0,c.jsx)(r,{size:`lg`,w:`auto`,children:`Large`})]})}},m={render:function(){return(0,c.jsxs)(`div`,{className:`flex w-full items-center gap-4`,children:[(0,c.jsx)(r,{variant:`primary`,w:`auto`,children:`Primary`}),(0,c.jsx)(r,{variant:`secondary`,w:`auto`,children:`Secondary`}),(0,c.jsx)(r,{variant:`cta`,w:`auto`,children:`Call to action`}),(0,c.jsx)(r,{variant:`ghost`,w:`auto`,children:`Ghost`}),(0,c.jsx)(r,{w:`auto`,icon:(0,c.jsx)(d,{}),children:`With icon`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    layout: 'padded'
  },
  args: {
    w: 'full',
    children: 'Full width'
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Button size="icon" w="auto" icon={<ArrowRightIcon />} aria-label="Icon" />

      <Button size="sm" w="auto">
        Small
      </Button>
      <Button size="md" w="auto">
        Medium
      </Button>
      <Button size="lg" w="auto">
        Large
      </Button>
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  render: () => <div className="flex w-full items-center gap-4">
      <Button variant="primary" w="auto">
        Primary
      </Button>
      <Button variant="secondary" w="auto">
        Secondary
      </Button>
      <Button variant="cta" w="auto">
        Call to action
      </Button>
      <Button variant="ghost" w="auto">
        Ghost
      </Button>
      <Button w="auto" icon={<ArrowRightIcon />}>
        With icon
      </Button>
    </div>
}`},m.parameters?.docs?.source)})}),h=[`Default`,`FullWidth`,`Sizes`,`Variants`]}))();export{u as Default,f as FullWidth,p as Sizes,m as Variants,h as __namedExportsOrder,l as default};