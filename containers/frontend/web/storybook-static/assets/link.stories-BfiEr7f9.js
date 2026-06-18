import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,r,t as i}from"./link-7vWkGsv6.js";import{t as a}from"./icon-DJi6_AGr.js";import{t as o}from"./icon-BCjfB7j6.js";function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){s(e,t,n[t])})}return e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function u(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var d,f,p,m,h,g,_,v,y,b;e((()=>{d=t(),o(),r(),f={title:`Components/Controls/Link`,component:n,tags:[`autodocs`],parameters:{nextjs:{appDirectory:!0,navigation:{pathname:`/`}},docs:{description:{component:`Internal and external link controls. InternalLink uses the localized app navigation Link, while ExternalLink renders a React Aria Link and defaults to opening in a new tab.`}}},argTypes:{href:{control:`text`,description:`Destination URL or route.`,table:{category:`Navigation`,type:{summary:`string`}}},children:{control:`text`,description:`Visible link content.`,table:{category:`Content`,type:{summary:`ReactNode`}}},as:{control:`select`,options:[`link`,`button`],description:`Controls whether the link is styled as text link or button.`,table:{category:`Appearance`,type:{summary:`'link' | 'button'`}}},variant:{control:`select`,options:[`primary`,`secondary`,`cta`],description:`Visual variant used when the link is styled as a button.`,table:{category:`Appearance`,type:{summary:`InteractiveControlVariant`},defaultValue:{summary:`secondary`}}},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Size used when the link is styled as a button.`,table:{category:`Appearance`,type:{summary:`InteractiveControlSize`},defaultValue:{summary:`md`}}},w:{control:`select`,options:[`full`,`auto`],description:`Width behavior used when the link is styled as a button.`,table:{category:`Layout`,type:{summary:`InteractiveControlWidth`},defaultValue:{summary:`full`}}},icon:{control:!1,description:`Optional icon rendered before the link content.`,table:{category:`Content`,type:{summary:`ReactNode`}}},className:{control:!1,description:`Optional className merged into the link styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{href:`/me`,children:`Profile`,as:`link`,variant:`secondary`,size:`md`,w:`auto`}},p={},m={args:{href:`/create-account`,children:`Create account`,as:`button`,variant:`cta`,w:`auto`},parameters:{docs:{source:{code:`<InternalLink href="/signup" as="button" variant="cta" w="auto">
  Create account
</InternalLink>`}}}},h={args:{href:`/me`,children:`Settings`,as:`button`,variant:`secondary`,w:`auto`,icon:(0,d.jsx)(a,{name:`settings`,size:18})},parameters:{docs:{source:{code:`<InternalLink
  href="/settings"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="settings" size={18} />}
>
  Settings
</InternalLink>`}}}},g={render:function(){return(0,d.jsx)(i,{href:`https://example.com`,as:`link`,children:`External website`})},parameters:{docs:{source:{code:`<ExternalLink href="https://example.com" as="link">
  External website
</ExternalLink>`}}}},_={render:function(){return(0,d.jsx)(i,{href:`https://example.com`,as:`button`,variant:`secondary`,w:`auto`,children:`Open external link`})},parameters:{docs:{source:{code:`<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
>
  Open external link
</ExternalLink>`}}}},v={render:function(){return(0,d.jsx)(i,{href:`https://example.com`,as:`button`,variant:`secondary`,w:`auto`,icon:(0,d.jsx)(a,{name:`logOut`,size:18}),children:`Open external link`})},parameters:{docs:{source:{code:`<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="logOut" size={18} />}
>
  Open external link
</ExternalLink>`}}}},y={parameters:{docs:{source:{code:`<div className="grid w-full max-w-xs gap-4">
  <InternalLink href="/profile">Text link</InternalLink>

  <InternalLink href="/signup" as="button" variant="cta" w="auto">
    Button link
  </InternalLink>

  <ExternalLink href="https://example.com" as="link">
    External text link
  </ExternalLink>

  <ExternalLink href="https://example.com" as="button" w="auto">
    External button link
  </ExternalLink>
</div>`}}},render:function(){return(0,d.jsxs)(`div`,{className:`grid w-full max-w-xs gap-4`,children:[(0,d.jsx)(n,{href:`/me`,children:`Text link`}),(0,d.jsx)(n,{href:`/login`,as:`button`,variant:`cta`,w:`auto`,children:`Button link`}),(0,d.jsx)(i,{href:`https://example.com`,as:`link`,children:`External text link`}),(0,d.jsx)(i,{href:`https://example.com`,as:`button`,w:`auto`,children:`External button link`})]})}},p.parameters=u(c({},p.parameters),{docs:u(c({},p.parameters?.docs),{source:c({originalSource:`{}`},p.parameters?.docs?.source)})}),m.parameters=u(c({},m.parameters),{docs:u(c({},m.parameters?.docs),{source:c({originalSource:`{
  args: {
    href: '/create-account',
    children: 'Create account',
    as: 'button',
    variant: 'cta',
    w: 'auto'
  },
  parameters: {
    docs: {
      source: {
        code: \`<InternalLink href="/signup" as="button" variant="cta" w="auto">
  Create account
</InternalLink>\`
      }
    }
  }
}`},m.parameters?.docs?.source)})}),h.parameters=u(c({},h.parameters),{docs:u(c({},h.parameters?.docs),{source:c({originalSource:`{
  args: {
    href: '/me',
    children: 'Settings',
    as: 'button',
    variant: 'secondary',
    w: 'auto',
    icon: <Icon name="settings" size={18} />
  },
  parameters: {
    docs: {
      source: {
        code: \`<InternalLink
  href="/settings"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="settings" size={18} />}
>
  Settings
</InternalLink>\`
      }
    }
  }
}`},h.parameters?.docs?.source)})}),g.parameters=u(c({},g.parameters),{docs:u(c({},g.parameters?.docs),{source:c({originalSource:`{
  render: () => <ExternalLink href="https://example.com" as="link">
      External website
    </ExternalLink>,
  parameters: {
    docs: {
      source: {
        code: \`<ExternalLink href="https://example.com" as="link">
  External website
</ExternalLink>\`
      }
    }
  }
}`},g.parameters?.docs?.source)})}),_.parameters=u(c({},_.parameters),{docs:u(c({},_.parameters?.docs),{source:c({originalSource:`{
  render: () => <ExternalLink href="https://example.com" as="button" variant="secondary" w="auto">
      Open external link
    </ExternalLink>,
  parameters: {
    docs: {
      source: {
        code: \`<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
>
  Open external link
</ExternalLink>\`
      }
    }
  }
}`},_.parameters?.docs?.source)})}),v.parameters=u(c({},v.parameters),{docs:u(c({},v.parameters?.docs),{source:c({originalSource:`{
  render: () => <ExternalLink href="https://example.com" as="button" variant="secondary" w="auto" icon={<Icon name="logOut" size={18} />}>
      Open external link
    </ExternalLink>,
  parameters: {
    docs: {
      source: {
        code: \`<ExternalLink
  href="https://example.com"
  as="button"
  variant="secondary"
  w="auto"
  icon={<Icon name="logOut" size={18} />}
>
  Open external link
</ExternalLink>\`
      }
    }
  }
}`},v.parameters?.docs?.source)})}),y.parameters=u(c({},y.parameters),{docs:u(c({},y.parameters?.docs),{source:c({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-xs gap-4">
  <InternalLink href="/profile">Text link</InternalLink>

  <InternalLink href="/signup" as="button" variant="cta" w="auto">
    Button link
  </InternalLink>

  <ExternalLink href="https://example.com" as="link">
    External text link
  </ExternalLink>

  <ExternalLink href="https://example.com" as="button" w="auto">
    External button link
  </ExternalLink>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-xs gap-4">
      <InternalLink href="/me">Text link</InternalLink>

      <InternalLink href="/login" as="button" variant="cta" w="auto">
        Button link
      </InternalLink>

      <ExternalLink href="https://example.com" as="link">
        External text link
      </ExternalLink>

      <ExternalLink href="https://example.com" as="button" w="auto">
        External button link
      </ExternalLink>
    </div>
}`},y.parameters?.docs?.source)})}),b=[`InternalTextLink`,`InternalButtonLink`,`InternalWithIcon`,`ExternalTextLink`,`ExternalButtonLink`,`ExternalWithIcon`,`States`]}))();export{_ as ExternalButtonLink,g as ExternalTextLink,v as ExternalWithIcon,m as InternalButtonLink,p as InternalTextLink,h as InternalWithIcon,y as States,b as __namedExportsOrder,f as default};