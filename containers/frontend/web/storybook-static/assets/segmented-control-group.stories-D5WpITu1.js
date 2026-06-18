import{n as e,o as t}from"./chunk-BEldbCjX.js";import{C as n,X as r}from"./iframe-DMHpIwzT.js";import{t as i}from"./icon-DJi6_AGr.js";import{t as a}from"./icon-BCjfB7j6.js";import{n as o,t as s}from"./segmented-control-group-BCBCAnOj.js";function c(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function l(e){if(Array.isArray(e))return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function d(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r=[],i=!0,a=!1,o,s;try{for(n=n.call(e);!(i=(o=n.next()).done)&&(r.push(o.value),!(t&&r.length===t));i=!0);}catch(e){a=!0,s=e}finally{try{!i&&n.return!=null&&n.return()}finally{if(a)throw s}}return r}}function f(){throw TypeError(`Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function p(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){u(e,t,n[t])})}return e}function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function h(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):m(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function g(e,t){return l(e)||d(e,t)||_(e,t)||f()}function _(e,t){if(e){if(typeof e==`string`)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`)return Array.from(n);if(n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(e,t)}}function v(){var e=g((0,b.useState)(`light`),2),t=e[0],n=e[1];return(0,y.jsxs)(`div`,{className:`grid gap-4`,children:[(0,y.jsx)(s,{"aria-label":`Controlled theme mode`,options:x,selectedKey:t,onSelectionChange:n}),(0,y.jsxs)(`p`,{className:`text-sm text-text-secondary`,children:[`Selected: `,String(t)]})]})}var y,b,x,S,C,w,T,E;e((()=>{y=n(),b=t(r(),1),a(),o(),x=[{id:`light`,label:(0,y.jsx)(i,{name:`lightMode`,size:18}),ariaLabel:`Light mode`,tooltipLabel:`Light mode`},{id:`dark`,label:(0,y.jsx)(i,{name:`darkMode`,size:18}),ariaLabel:`Dark mode`,tooltipLabel:`Dark mode`},{id:`settings`,label:(0,y.jsx)(i,{name:`settings`,size:18}),ariaLabel:`Settings`,tooltipLabel:`Settings`}],S={title:`Components/Composites/SegmentedControlGroup`,component:s,tags:[`autodocs`],parameters:{docs:{description:{component:`Icon-only segmented control built on React Aria ToggleButtonGroup. Each option must provide an ariaLabel because the visible label is decorative icon content.`}}},argTypes:{"aria-label":{control:`text`,description:`Accessible label for the segmented control group.`,table:{category:`Accessibility`,type:{summary:`string`}}},options:{control:!1,description:`Icon-only options. Each option should include ariaLabel and may include tooltipLabel.`,table:{category:`Content`,type:{summary:`readonly { id: Key; label: ReactNode; ariaLabel: string; tooltipLabel?: string }[]`}}},defaultSelectedKey:{control:`text`,description:`Initial selected option key when uncontrolled.`,table:{category:`State`,type:{summary:`Key`}}},selectedKey:{control:!1,description:`Selected option key when controlled.`,table:{category:`State`,type:{summary:`Key`}}},onSelectionChange:{action:`selection changed`,description:`Callback fired when the selected option changes.`,table:{category:`Events`,type:{summary:`(key: Key) => void`}}}},args:{"aria-label":`Theme mode`,options:x,defaultSelectedKey:`light`}},C={},w={args:{"aria-label":`Theme mode`,defaultSelectedKey:`light`,options:[{id:`light`,label:(0,y.jsx)(i,{name:`lightMode`,size:18}),ariaLabel:`Light mode`,tooltipLabel:`Light mode`},{id:`dark`,label:(0,y.jsx)(i,{name:`darkMode`,size:18}),ariaLabel:`Dark mode`,tooltipLabel:`Dark mode`,isDisabled:!0},{id:`settings`,label:(0,y.jsx)(i,{name:`settings`,size:18}),ariaLabel:`Settings`,tooltipLabel:`Settings`}]}},T={parameters:{docs:{source:{code:`const [selectedKey, setSelectedKey] = useState<Key>('light');

return (
  <SegmentedControlGroup
    aria-label="Controlled theme mode"
    options={themeOptions}
    selectedKey={selectedKey}
    onSelectionChange={setSelectedKey}
  />
);`}}},render:function(){return(0,y.jsx)(v,{})}},C.parameters=h(p({},C.parameters),{docs:h(p({},C.parameters?.docs),{source:p({originalSource:`{}`},C.parameters?.docs?.source)})}),w.parameters=h(p({},w.parameters),{docs:h(p({},w.parameters?.docs),{source:p({originalSource:`{
  args: {
    'aria-label': 'Theme mode',
    defaultSelectedKey: 'light',
    options: [{
      id: 'light',
      label: <Icon name="lightMode" size={18} />,
      ariaLabel: 'Light mode',
      tooltipLabel: 'Light mode'
    }, {
      id: 'dark',
      label: <Icon name="darkMode" size={18} />,
      ariaLabel: 'Dark mode',
      tooltipLabel: 'Dark mode',
      isDisabled: true
    }, {
      id: 'settings',
      label: <Icon name="settings" size={18} />,
      ariaLabel: 'Settings',
      tooltipLabel: 'Settings'
    }]
  }
}`},w.parameters?.docs?.source)})}),T.parameters=h(p({},T.parameters),{docs:h(p({},T.parameters?.docs),{source:p({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`const [selectedKey, setSelectedKey] = useState<Key>('light');

return (
  <SegmentedControlGroup
    aria-label="Controlled theme mode"
    options={themeOptions}
    selectedKey={selectedKey}
    onSelectionChange={setSelectedKey}
  />
);\`
      }
    }
  },
  render: () => <ControlledIconSegmentedControl />
}`},T.parameters?.docs?.source)})}),E=[`Default`,`WithDisabledIcon`,`Controlled`]}))();export{T as Controlled,C as Default,w as WithDisabledIcon,E as __namedExportsOrder,S as default};