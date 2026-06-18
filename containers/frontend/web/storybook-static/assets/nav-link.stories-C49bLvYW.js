import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{t as n}from"./icon-DJi6_AGr.js";import{t as r}from"./icon-BCjfB7j6.js";import{n as i,t as a}from"./nav-link-DpS5YvTv.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var u,d,f,p,m,h;e((()=>{u=t(),r(),i(),d={title:`Components/Controls/NavLink`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Navigation link control built on React Aria Link. It supports current-page state through aria-current and data-current, plus project size and width styles.`}}},argTypes:{href:{control:`text`,description:`Destination URL for the navigation link.`,table:{category:`Navigation`,type:{summary:`string`}}},isCurrent:{control:`boolean`,description:`Marks the link as the current page. Adds aria-current="page" and data-current="true".`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},children:{control:`text`,description:`Visible link content.`,table:{category:`Content`,type:{summary:`ReactNode`}}},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Controls the navigation link size.`,table:{category:`Appearance`,type:{summary:`InteractiveControlSize`},defaultValue:{summary:`md`}}},w:{control:`select`,options:[`auto`,`full`],description:`Controls whether the link fits its content or fills the available width.`,table:{category:`Layout`,type:{summary:`InteractiveControlW`},defaultValue:{summary:`auto`}}},className:{control:!1,description:`Optional className merged into the navigation link styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{href:`/`,children:`Home`,isCurrent:!1,size:`md`,w:`auto`}},f={},p={args:{href:`/`,children:`Home`,isCurrent:!0},parameters:{docs:{source:{code:`<NavLink href="/" isCurrent>
  Home
</NavLink>`}}}},m={args:{href:`/settings`,isCurrent:!1,children:(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n,{name:`settings`,size:18}),`Settings`]})},parameters:{docs:{source:{code:`<NavLink href="/settings">
  <Icon name="settings" size={18} />
  Settings
</NavLink>`}}}},f.parameters=l(s({},f.parameters),{docs:l(s({},f.parameters?.docs),{source:s({originalSource:`{}`},f.parameters?.docs?.source)})}),p.parameters=l(s({},p.parameters),{docs:l(s({},p.parameters?.docs),{source:s({originalSource:`{
  args: {
    href: '/',
    children: 'Home',
    isCurrent: true
  },
  parameters: {
    docs: {
      source: {
        code: \`<NavLink href="/" isCurrent>
  Home
</NavLink>\`
      }
    }
  }
}`},p.parameters?.docs?.source)})}),m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{
  args: {
    href: '/settings',
    isCurrent: false,
    children: <>
        <Icon name="settings" size={18} />
        Settings
      </>
  },
  parameters: {
    docs: {
      source: {
        code: \`<NavLink href="/settings">
  <Icon name="settings" size={18} />
  Settings
</NavLink>\`
      }
    }
  }
}`},m.parameters?.docs?.source)})}),h=[`Default`,`Current`,`WithIcon`]}))();export{p as Current,f as Default,m as WithIcon,h as __namedExportsOrder,d as default};