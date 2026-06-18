import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./stack-rA09-aBK.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h,g,_;e((()=>{c=t(),n(),l=function(e){var t=e.label;return(0,c.jsx)(`div`,{className:`rounded-md border border-border-primary bg-bg-secondary px-4 py-2 text-text-primary`,children:t})},u={title:`Components/Primitives/Stack`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Layout primitive for vertical and horizontal flex composition. It centralizes direction, gap, alignment, justification, and semantic root element selection.`}}},argTypes:{as:{control:`select`,options:[`div`,`nav`,`section`,`footer`,`header`,`article`],description:`Semantic HTML element used as the root container.`,table:{category:`Semantics`,type:{summary:`'div' | 'nav' | 'section' | 'footer' | 'header' | 'article'`},defaultValue:{summary:`div`}}},direction:{control:`select`,options:[`vertical`,`horizontal`],description:`Stack direction.`,table:{category:`Layout`,type:{summary:`'vertical' | 'horizontal'`},defaultValue:{summary:`vertical`}}},gap:{control:`select`,options:[`none`,`xs`,`sm`,`regular`,`md`,`lg`],description:`Spacing between children.`,table:{category:`Layout`,type:{summary:`'none' | 'xs' | 'sm' | 'regular' | 'md' | 'lg'`},defaultValue:{summary:`md`}}},align:{control:`select`,options:[`start`,`center`,`end`,`stretch`,`baseline`],description:`Cross-axis alignment.`,table:{category:`Layout`,type:{summary:`'start' | 'center' | 'end' | 'stretch' | 'baseline'`},defaultValue:{summary:`stretch`}}},justify:{control:`select`,options:[`start`,`center`,`end`,`between`],description:`Main-axis distribution.`,table:{category:`Layout`,type:{summary:`'start' | 'center' | 'end' | 'between'`},defaultValue:{summary:`start`}}},className:{control:!1,description:`Optional className merged into the stack root styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}},children:{control:!1,description:`Content rendered inside the stack.`,table:{category:`Content`,type:{summary:`ReactNode`}}}},args:{as:`div`,direction:`vertical`,gap:`md`,align:`stretch`,justify:`start`}},d={render:function(e){return(0,c.jsxs)(r,s(a({},e),{className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`First`}),(0,c.jsx)(l,{label:`Second`}),(0,c.jsx)(l,{label:`Third`})]}))}},f={args:{direction:`horizontal`,align:`center`},render:function(e){return(0,c.jsxs)(r,s(a({},e),{children:[(0,c.jsx)(l,{label:`First`}),(0,c.jsx)(l,{label:`Second`}),(0,c.jsx)(l,{label:`Third`})]}))}},p={parameters:{docs:{source:{code:`<Stack gap="xs">
  <Box label="First" />
  <Box label="Second" />
</Stack>

<Stack gap="lg">
  <Box label="First" />
  <Box label="Second" />
</Stack>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid gap-8`,children:[(0,c.jsxs)(r,{gap:`xs`,className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`gap: xs`}),(0,c.jsx)(l,{label:`Second`})]}),(0,c.jsxs)(r,{gap:`sm`,className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`gap: sm`}),(0,c.jsx)(l,{label:`Second`})]}),(0,c.jsxs)(r,{gap:`md`,className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`gap: md`}),(0,c.jsx)(l,{label:`Second`})]}),(0,c.jsxs)(r,{gap:`lg`,className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`gap: lg`}),(0,c.jsx)(l,{label:`Second`})]})]})}},m={parameters:{docs:{source:{code:`<Stack direction="horizontal" align="center" className="h-32">
  <Box label="First" />
  <Box label="Second" />
  <Box label="Third" />
</Stack>`}}},render:function(){return(0,c.jsxs)(r,{direction:`horizontal`,align:`center`,gap:`sm`,className:`h-32 w-full max-w-md rounded-md border border-border-primary p-4`,children:[(0,c.jsx)(l,{label:`First`}),(0,c.jsx)(l,{label:`Second`}),(0,c.jsx)(l,{label:`Third`})]})}},h={args:{direction:`horizontal`,justify:`between`,align:`center`},render:function(e){return(0,c.jsxs)(r,s(a({},e),{className:`w-full max-w-md rounded-md border border-border-primary p-4`,children:[(0,c.jsx)(l,{label:`Left`}),(0,c.jsx)(l,{label:`Center`}),(0,c.jsx)(l,{label:`Right`})]}))}},g={args:{as:`section`,gap:`sm`},parameters:{docs:{source:{code:`<Stack as="section" gap="sm">
  <Box label="Section content" />
  <Box label="More content" />
</Stack>`}}},render:function(e){return(0,c.jsxs)(r,s(a({},e),{className:`w-full max-w-xs`,children:[(0,c.jsx)(l,{label:`Section content`}),(0,c.jsx)(l,{label:`More content`})]}))}},d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  render: args => <Stack {...args} className="w-full max-w-xs">
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    direction: 'horizontal',
    align: 'center'
  },
  render: args => <Stack {...args}>
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Stack gap="xs">
  <Box label="First" />
  <Box label="Second" />
</Stack>

<Stack gap="lg">
  <Box label="First" />
  <Box label="Second" />
</Stack>\`
      }
    }
  },
  render: () => <div className="grid gap-8">
      <Stack gap="xs" className="w-full max-w-xs">
        <Box label="gap: xs" />
        <Box label="Second" />
      </Stack>

      <Stack gap="sm" className="w-full max-w-xs">
        <Box label="gap: sm" />
        <Box label="Second" />
      </Stack>

      <Stack gap="md" className="w-full max-w-xs">
        <Box label="gap: md" />
        <Box label="Second" />
      </Stack>

      <Stack gap="lg" className="w-full max-w-xs">
        <Box label="gap: lg" />
        <Box label="Second" />
      </Stack>
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Stack direction="horizontal" align="center" className="h-32">
  <Box label="First" />
  <Box label="Second" />
  <Box label="Third" />
</Stack>\`
      }
    }
  },
  render: () => <Stack direction="horizontal" align="center" gap="sm" className="h-32 w-full max-w-md rounded-md border border-border-primary p-4">
      <Box label="First" />
      <Box label="Second" />
      <Box label="Third" />
    </Stack>
}`},m.parameters?.docs?.source)})}),h.parameters=s(a({},h.parameters),{docs:s(a({},h.parameters?.docs),{source:a({originalSource:`{
  args: {
    direction: 'horizontal',
    justify: 'between',
    align: 'center'
  },
  render: args => <Stack {...args} className="w-full max-w-md rounded-md border border-border-primary p-4">
      <Box label="Left" />
      <Box label="Center" />
      <Box label="Right" />
    </Stack>
}`},h.parameters?.docs?.source)})}),g.parameters=s(a({},g.parameters),{docs:s(a({},g.parameters?.docs),{source:a({originalSource:`{
  args: {
    as: 'section',
    gap: 'sm'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Stack as="section" gap="sm">
  <Box label="Section content" />
  <Box label="More content" />
</Stack>\`
      }
    }
  },
  render: args => <Stack {...args} className="w-full max-w-xs">
      <Box label="Section content" />
      <Box label="More content" />
    </Stack>
}`},g.parameters?.docs?.source)})}),_=[`Vertical`,`Horizontal`,`Gaps`,`Alignment`,`JustifyBetween`,`SemanticSection`]}))();export{m as Alignment,p as Gaps,f as Horizontal,h as JustifyBetween,g as SemanticSection,d as Vertical,_ as __namedExportsOrder,u as default};