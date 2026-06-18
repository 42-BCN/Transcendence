import{n as e,o as t}from"./chunk-BEldbCjX.js";import{C as n,X as r}from"./iframe-DMHpIwzT.js";import{t as i}from"./text-DiWBaZ2Q.js";import{t as a}from"./text-D4DF58Ng.js";import{t as o}from"./button-C-dueEF_.js";import{t as s}from"./button-BR_7llt8.js";import{n as c,t as l}from"./drawer-FKL-sHwD.js";import{t as u}from"./stack-rA09-aBK.js";import{t as d}from"./stack-DhlingQz.js";function f(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function p(e){if(Array.isArray(e))return e}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function h(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r=[],i=!0,a=!1,o,s;try{for(n=n.call(e);!(i=(o=n.next()).done)&&(r.push(o.value),!(t&&r.length===t));i=!0);}catch(e){a=!0,s=e}finally{try{!i&&n.return!=null&&n.return()}finally{if(a)throw s}}return r}}function g(){throw TypeError(`Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function _(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){m(e,t,n[t])})}return e}function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function y(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):v(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function b(e,t){return p(e)||h(e,t)||x(e,t)||g()}function x(e,t){if(e){if(typeof e==`string`)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`)return Array.from(n);if(n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return f(e,t)}}function S(e){var t=e.onClose;return(0,w.jsx)(`div`,{className:`h-full w-[320px] bg-bg-primary p-6 text-text-primary shadow-lg`,children:(0,w.jsxs)(u,{gap:`md`,children:[(0,w.jsx)(i,{as:`h2`,variant:`heading-sm`,children:`Drawer title`}),(0,w.jsx)(i,{variant:`body`,color:`secondary`,children:`This is drawer content. Use it for navigation, filters, settings, or secondary flows.`}),(0,w.jsx)(o,{w:`full`,variant:`primary`,children:`Primary action`}),(0,w.jsx)(o,{w:`full`,variant:`secondary`,onPress:t,children:`Close drawer`})]})})}function C(e){var t=b((0,T.useState)(!1),2),n=t[0],r=t[1];return(0,w.jsxs)(`div`,{className:`min-h-[240px]`,children:[(0,w.jsx)(o,{w:`auto`,onPress:function(){return r(!0)},children:`Open drawer`}),(0,w.jsx)(l,y(_({},e),{isOpen:n,onOpenChange:r,children:(0,w.jsx)(S,{onClose:function(){r(!1)}})}))]})}var w,T,E,D,O,k;e((()=>{w=n(),T=t(r(),1),s(),a(),d(),c(),E={title:`Components/Composites/Drawer`,component:l,tags:[`autodocs`],parameters:{docs:{description:{component:`Drawer overlay built on React Aria Components ModalOverlay, Modal, and Dialog. It is intended for full-height side-panel content.`}}},argTypes:{children:{control:!1,description:`Content rendered inside the drawer dialog.`,table:{category:`Content`,type:{summary:`ReactNode | RenderProps`}}},isOpen:{control:!1,description:`Controls whether the drawer is open.`,table:{category:`State`,type:{summary:`boolean`}}},isDismissable:{control:`boolean`,description:`Allows the drawer to be dismissed by interacting outside of it.`,table:{category:`Behavior`,type:{summary:`boolean`}}},isKeyboardDismissDisabled:{control:`boolean`,description:`Prevents the drawer from being dismissed with the Escape key.`,table:{category:`Behavior`,type:{summary:`boolean`}}},onOpenChange:{control:!1,description:`Callback fired when the drawer open state changes.`,table:{category:`Events`,type:{summary:`(isOpen: boolean) => void`}}}},args:{isDismissable:!0,isKeyboardDismissDisabled:!1}},D={parameters:{docs:{source:{code:`const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onPress={() => setIsOpen(true)}>
      Open drawer
    </Button>

    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDismissable
    >
      <DrawerContent />
    </Drawer>
  </>
);`}}},render:function(e){return(0,w.jsx)(C,_({},e))}},O={args:{isDismissable:!1,isKeyboardDismissDisabled:!0},parameters:{docs:{source:{code:`<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  isDismissable={false}
  isKeyboardDismissDisabled
>
  <DrawerContent />
</Drawer>`}}},render:function(e){return(0,w.jsx)(C,_({},e))}},D.parameters=y(_({},D.parameters),{docs:y(_({},D.parameters?.docs),{source:_({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onPress={() => setIsOpen(true)}>
      Open drawer
    </Button>

    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDismissable
    >
      <DrawerContent />
    </Drawer>
  </>
);\`
      }
    }
  },
  render: args => <ControlledDrawer {...args} />
}`},D.parameters?.docs?.source)})}),O.parameters=y(_({},O.parameters),{docs:y(_({},O.parameters?.docs),{source:_({originalSource:`{
  args: {
    isDismissable: false,
    isKeyboardDismissDisabled: true
  },
  parameters: {
    docs: {
      source: {
        code: \`<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  isDismissable={false}
  isKeyboardDismissDisabled
>
  <DrawerContent />
</Drawer>\`
      }
    }
  },
  render: args => <ControlledDrawer {...args} />
}`},O.parameters?.docs?.source)})}),k=[`Default`,`NonDismissable`]}))();export{D as Default,O as NonDismissable,k as __namedExportsOrder,E as default};