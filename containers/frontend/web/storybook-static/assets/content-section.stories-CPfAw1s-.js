import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./content-section-00ibUth2.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g;e((()=>{c=t(),n(),l={title:`Components/Composites/ContentSection`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Reusable content section for structured text blocks. It can render a title, description, optional list items, and custom children inside a Stack layout.`}}},argTypes:{title:{control:`text`,description:`Optional section title rendered as an h2.`,table:{category:`Content`,type:{summary:`ReactNode`}}},description:{control:`text`,description:`Optional supporting description rendered as a paragraph.`,table:{category:`Content`,type:{summary:`ReactNode`}}},items:{control:`object`,description:`Optional list of items rendered as a bullet list.`,table:{category:`Content`,type:{summary:`ReactNode[]`}}},children:{control:!1,description:`Optional custom content rendered after title, description, and list items.`,table:{category:`Content`,type:{summary:`ReactNode`}}},as:{control:`select`,options:[`section`,`article`,`header`,`div`],description:`HTML element used for the root Stack container.`,table:{category:`Semantics`,type:{summary:`'section' | 'article' | 'header' | 'div'`},defaultValue:{summary:`section`}}}},args:{as:`section`,title:`Account security`,description:`Keep your account protected by using a strong password and reviewing active sessions regularly.`,items:[`Use a unique password.`,`Do not share your credentials.`,`Review suspicious activity.`]}},u={},d={args:{title:`Profile`,description:void 0,items:void 0}},f={args:{title:`Privacy settings`,description:`Control who can see your profile, game status, and social activity.`,items:void 0}},p={args:{title:`Before you continue`,description:void 0,items:[`Check your email address.`,`Confirm your username.`,`Accept the terms.`]}},m={args:{title:`Custom content`,description:`Children are rendered after the standard content blocks.`,items:void 0,children:(0,c.jsx)(`div`,{className:`rounded-md border border-border-primary p-4 text-text-secondary`,children:`This is custom child content.`})},parameters:{docs:{source:{code:`<ContentSection
  title="Custom content"
  description="Children are rendered after the standard content blocks."
>
  <div className="rounded-md border border-border-primary p-4 text-text-secondary">
    This is custom child content.
  </div>
</ContentSection>`}}}},h={args:{as:`article`,title:`Article section`,description:`Use the as prop to change the semantic root element.`,items:[`Rendered as article.`,`Keeps the same visual layout.`]},parameters:{docs:{source:{code:`<ContentSection
  as="article"
  title="Article section"
  description="Use the as prop to change the semantic root element."
  items={['Rendered as article.', 'Keeps the same visual layout.']}
/>`}}}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    title: 'Profile',
    description: undefined,
    items: undefined
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    title: 'Privacy settings',
    description: 'Control who can see your profile, game status, and social activity.',
    items: undefined
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    title: 'Before you continue',
    description: undefined,
    items: ['Check your email address.', 'Confirm your username.', 'Accept the terms.']
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    title: 'Custom content',
    description: 'Children are rendered after the standard content blocks.',
    items: undefined,
    children: <div className="rounded-md border border-border-primary p-4 text-text-secondary">
        This is custom child content.
      </div>
  },
  parameters: {
    docs: {
      source: {
        code: \`<ContentSection
  title="Custom content"
  description="Children are rendered after the standard content blocks."
>
  <div className="rounded-md border border-border-primary p-4 text-text-secondary">
    This is custom child content.
  </div>
</ContentSection>\`
      }
    }
  }
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  args: {
    as: 'article',
    title: 'Article section',
    description: 'Use the as prop to change the semantic root element.',
    items: ['Rendered as article.', 'Keeps the same visual layout.']
  },
  parameters: {
    docs: {
      source: {
        code: \`<ContentSection
  as="article"
  title="Article section"
  description="Use the as prop to change the semantic root element."
  items={['Rendered as article.', 'Keeps the same visual layout.']}
/>\`
      }
    }
  }
}`},h.parameters?.docs?.source)})}),g=[`Default`,`TitleOnly`,`WithDescription`,`WithItems`,`WithChildren`,`ArticleSemanticElement`]}))();export{h as ArticleSemanticElement,u as Default,d as TitleOnly,m as WithChildren,f as WithDescription,p as WithItems,g as __namedExportsOrder,l as default};