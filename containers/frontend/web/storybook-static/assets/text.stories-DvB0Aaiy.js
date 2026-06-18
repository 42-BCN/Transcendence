import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./text-DiWBaZ2Q.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g;e((()=>{c=t(),n(),l={title:`Components/Primitives/Text`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Typography primitive that maps semantic HTML tags, project text variants, and design-token text colors.`}}},argTypes:{as:{control:`select`,options:[`span`,`p`,`strong`,`em`,`small`,`code`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`div`],description:`HTML element rendered by the Text component.`,table:{category:`Semantics`,type:{summary:`'span' | 'p' | 'strong' | 'em' | 'small' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'`},defaultValue:{summary:`span`}}},variant:{control:`select`,options:[`divider`,`caption`,`body-xs`,`body-sm`,`body`,`body-lg`,`heading-sm`,`heading-md`,`heading-lg`,`heading-xl`,`code`],description:`Typography style variant.`,table:{category:`Appearance`,type:{summary:`TextVariant`},defaultValue:{summary:`body`}}},color:{control:`select`,options:[`primary`,`secondary`,`tertiary`,`disabled`,`inverse`,`info`,`danger`,`success`,`muted`],description:`Text color token.`,table:{category:`Appearance`,type:{summary:`TextColor`},defaultValue:{summary:`primary`}}},children:{control:`text`,description:`Text content.`,table:{category:`Content`,type:{summary:`ReactNode`}}},className:{control:!1,description:`Optional className merged with the generated text styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{as:`p`,variant:`body`,color:`primary`,children:`The quick brown fox jumps over the lazy dog.`}},u={},d={parameters:{docs:{source:{code:`<div className="grid gap-3">
  <Text variant="heading-xl">Heading XL</Text>
  <Text variant="heading-lg">Heading LG</Text>
  <Text variant="heading-md">Heading MD</Text>
  <Text variant="heading-sm">Heading SM</Text>
  <Text variant="body-lg">Body LG</Text>
  <Text variant="body">Body</Text>
  <Text variant="body-sm">Body SM</Text>
  <Text variant="body-xs">Body XS</Text>
  <Text variant="caption">Caption</Text>
  <Text variant="code">const value = true;</Text>
  <Text variant="divider">or</Text>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-3`,children:[(0,c.jsx)(r,{variant:`heading-xl`,children:`Heading XL`}),(0,c.jsx)(r,{variant:`heading-lg`,children:`Heading LG`}),(0,c.jsx)(r,{variant:`heading-md`,children:`Heading MD`}),(0,c.jsx)(r,{variant:`heading-sm`,children:`Heading SM`}),(0,c.jsx)(r,{variant:`body-lg`,children:`Body LG`}),(0,c.jsx)(r,{variant:`body`,children:`Body`}),(0,c.jsx)(r,{variant:`body-sm`,children:`Body SM`}),(0,c.jsx)(r,{variant:`body-xs`,children:`Body XS`}),(0,c.jsx)(r,{variant:`caption`,children:`Caption`}),(0,c.jsx)(r,{variant:`code`,children:`const value = true;`}),(0,c.jsx)(r,{variant:`divider`,children:`or`})]})}},f={parameters:{docs:{source:{code:`<div className="grid gap-2">
  <Text color="primary">Primary text</Text>
  <Text color="secondary">Secondary text</Text>
  <Text color="tertiary">Tertiary text</Text>
  <Text color="disabled">Disabled text</Text>
  <Text color="info">Info text</Text>
  <Text color="danger">Danger text</Text>
  <Text color="success">Success text</Text>
  <Text color="muted">Muted text</Text>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-2`,children:[(0,c.jsx)(r,{color:`primary`,children:`Primary text`}),(0,c.jsx)(r,{color:`secondary`,children:`Secondary text`}),(0,c.jsx)(r,{color:`tertiary`,children:`Tertiary text`}),(0,c.jsx)(r,{color:`disabled`,children:`Disabled text`}),(0,c.jsx)(r,{color:`info`,children:`Info text`}),(0,c.jsx)(r,{color:`danger`,children:`Danger text`}),(0,c.jsx)(r,{color:`success`,children:`Success text`}),(0,c.jsx)(r,{color:`muted`,children:`Muted text`})]})}},p={parameters:{docs:{source:{code:`<div className="grid gap-3">
  <Text as="h1" variant="heading-xl">Page title</Text>
  <Text as="h2" variant="heading-lg">Section title</Text>
  <Text as="h3" variant="heading-md">Subsection title</Text>
  <Text as="h4" variant="heading-sm">Group title</Text>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-md gap-3`,children:[(0,c.jsx)(r,{as:`h1`,variant:`heading-xl`,children:`Page title`}),(0,c.jsx)(r,{as:`h2`,variant:`heading-lg`,children:`Section title`}),(0,c.jsx)(r,{as:`h3`,variant:`heading-md`,children:`Subsection title`}),(0,c.jsx)(r,{as:`h4`,variant:`heading-sm`,children:`Group title`})]})}},m={parameters:{docs:{source:{code:`<div className="grid max-w-md gap-3">
  <Text as="p" variant="body">
    This is regular body copy for common page content.
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This is supporting body copy with secondary color.
  </Text>

  <Text as="small" variant="caption" color="tertiary">
    This is caption text for metadata or helper copy.
  </Text>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid max-w-md gap-3`,children:[(0,c.jsx)(r,{as:`p`,variant:`body`,children:`This is regular body copy for common page content.`}),(0,c.jsx)(r,{as:`p`,variant:`body-sm`,color:`secondary`,children:`This is supporting body copy with secondary color.`}),(0,c.jsx)(r,{as:`small`,variant:`caption`,color:`tertiary`,children:`This is caption text for metadata or helper copy.`})]})}},h={args:{as:`span`,variant:`divider`,color:`disabled`,children:`or`},parameters:{docs:{source:{code:`<Text as="span" variant="divider" color="disabled">
  or
</Text>`}}}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-3">
  <Text variant="heading-xl">Heading XL</Text>
  <Text variant="heading-lg">Heading LG</Text>
  <Text variant="heading-md">Heading MD</Text>
  <Text variant="heading-sm">Heading SM</Text>
  <Text variant="body-lg">Body LG</Text>
  <Text variant="body">Body</Text>
  <Text variant="body-sm">Body SM</Text>
  <Text variant="body-xs">Body XS</Text>
  <Text variant="caption">Caption</Text>
  <Text variant="code">const value = true;</Text>
  <Text variant="divider">or</Text>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-3">
      <Text variant="heading-xl">Heading XL</Text>
      <Text variant="heading-lg">Heading LG</Text>
      <Text variant="heading-md">Heading MD</Text>
      <Text variant="heading-sm">Heading SM</Text>
      <Text variant="body-lg">Body LG</Text>
      <Text variant="body">Body</Text>
      <Text variant="body-sm">Body SM</Text>
      <Text variant="body-xs">Body XS</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="code">const value = true;</Text>
      <Text variant="divider">or</Text>
    </div>
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-2">
  <Text color="primary">Primary text</Text>
  <Text color="secondary">Secondary text</Text>
  <Text color="tertiary">Tertiary text</Text>
  <Text color="disabled">Disabled text</Text>
  <Text color="info">Info text</Text>
  <Text color="danger">Danger text</Text>
  <Text color="success">Success text</Text>
  <Text color="muted">Muted text</Text>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-2">
      <Text color="primary">Primary text</Text>
      <Text color="secondary">Secondary text</Text>
      <Text color="tertiary">Tertiary text</Text>
      <Text color="disabled">Disabled text</Text>
      <Text color="info">Info text</Text>
      <Text color="danger">Danger text</Text>
      <Text color="success">Success text</Text>
      <Text color="muted">Muted text</Text>
    </div>
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-3">
  <Text as="h1" variant="heading-xl">Page title</Text>
  <Text as="h2" variant="heading-lg">Section title</Text>
  <Text as="h3" variant="heading-md">Subsection title</Text>
  <Text as="h4" variant="heading-sm">Group title</Text>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-md gap-3">
      <Text as="h1" variant="heading-xl">
        Page title
      </Text>
      <Text as="h2" variant="heading-lg">
        Section title
      </Text>
      <Text as="h3" variant="heading-md">
        Subsection title
      </Text>
      <Text as="h4" variant="heading-sm">
        Group title
      </Text>
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid max-w-md gap-3">
  <Text as="p" variant="body">
    This is regular body copy for common page content.
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This is supporting body copy with secondary color.
  </Text>

  <Text as="small" variant="caption" color="tertiary">
    This is caption text for metadata or helper copy.
  </Text>
</div>\`
      }
    }
  },
  render: () => <div className="grid max-w-md gap-3">
      <Text as="p" variant="body">
        This is regular body copy for common page content.
      </Text>

      <Text as="p" variant="body-sm" color="secondary">
        This is supporting body copy with secondary color.
      </Text>

      <Text as="small" variant="caption" color="tertiary">
        This is caption text for metadata or helper copy.
      </Text>
    </div>
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  args: {
    as: 'span',
    variant: 'divider',
    color: 'disabled',
    children: 'or'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Text as="span" variant="divider" color="disabled">
  or
</Text>\`
      }
    }
  }
}`},h.parameters?.docs?.source)})}),g=[`Default`,`Variants`,`Colors`,`Headings`,`BodyCopy`,`Divider`]}))();export{m as BodyCopy,f as Colors,u as Default,h as Divider,p as Headings,d as Variants,g as __namedExportsOrder,l as default};