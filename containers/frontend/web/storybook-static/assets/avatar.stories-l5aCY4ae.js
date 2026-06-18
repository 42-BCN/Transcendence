import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./avatar-BPHyDpPo.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h;e((()=>{c=t(),n(),l={title:`Components/Primitives/Avatar`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Avatar primitive that renders a user image when src is provided, and a user icon fallback when src is missing.`}}},argTypes:{src:{control:`text`,description:`Optional image URL for the avatar.`,table:{category:`Content`,type:{summary:`string | null`}}},alt:{control:`text`,description:`Accessible label and image alt text.`,table:{category:`Accessibility`,type:{summary:`string`},defaultValue:{summary:`Avatar`}}},size:{control:`select`,options:[`sm`,`md`,`lg`],description:`Avatar size.`,table:{category:`Appearance`,type:{summary:`AvatarSize`},defaultValue:{summary:`md`}}},className:{control:!1,description:`Optional className merged into the avatar root styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{src:null,alt:`User avatar`,size:`md`}},u={},d={args:{src:`https://i.pravatar.cc/120?img=5`,alt:`Player avatar`},parameters:{docs:{source:{code:`<Avatar
  src="https://i.pravatar.cc/120?img=5"
  alt="Player avatar"
/>`}}}},f={parameters:{docs:{source:{code:`<div className="flex items-center gap-4">
  <Avatar size="sm" />
  <Avatar size="md" />
  <Avatar size="lg" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,c.jsx)(r,{size:`sm`,alt:`Small avatar`}),(0,c.jsx)(r,{size:`md`,alt:`Medium avatar`}),(0,c.jsx)(r,{size:`lg`,alt:`Large avatar`})]})}},p={parameters:{docs:{source:{code:`<div className="flex items-center gap-4">
  <Avatar size="sm" src="https://i.pravatar.cc/120?img=1" alt="Small avatar" />
  <Avatar size="md" src="https://i.pravatar.cc/120?img=2" alt="Medium avatar" />
  <Avatar size="lg" src="https://i.pravatar.cc/120?img=3" alt="Large avatar" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,c.jsx)(r,{size:`sm`,src:`https://i.pravatar.cc/120?img=1`,alt:`Small avatar`}),(0,c.jsx)(r,{size:`md`,src:`https://i.pravatar.cc/120?img=2`,alt:`Medium avatar`}),(0,c.jsx)(r,{size:`lg`,src:`https://i.pravatar.cc/120?img=3`,alt:`Large avatar`})]})}},m={parameters:{docs:{source:{code:`<div className="grid gap-4">
  <Avatar alt="Fallback avatar" />
  <Avatar src="https://i.pravatar.cc/120?img=5" alt="Image avatar" />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid gap-4`,children:[(0,c.jsx)(r,{alt:`Fallback avatar`}),(0,c.jsx)(r,{src:`https://i.pravatar.cc/120?img=5`,alt:`Image avatar`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    src: 'https://i.pravatar.cc/120?img=5',
    alt: 'Player avatar'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Avatar
  src="https://i.pravatar.cc/120?img=5"
  alt="Player avatar"
/>\`
      }
    }
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="flex items-center gap-4">
  <Avatar size="sm" />
  <Avatar size="md" />
  <Avatar size="lg" />
</div>\`
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <Avatar size="sm" alt="Small avatar" />
      <Avatar size="md" alt="Medium avatar" />
      <Avatar size="lg" alt="Large avatar" />
    </div>
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="flex items-center gap-4">
  <Avatar size="sm" src="https://i.pravatar.cc/120?img=1" alt="Small avatar" />
  <Avatar size="md" src="https://i.pravatar.cc/120?img=2" alt="Medium avatar" />
  <Avatar size="lg" src="https://i.pravatar.cc/120?img=3" alt="Large avatar" />
</div>\`
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <Avatar size="sm" src="https://i.pravatar.cc/120?img=1" alt="Small avatar" />
      <Avatar size="md" src="https://i.pravatar.cc/120?img=2" alt="Medium avatar" />
      <Avatar size="lg" src="https://i.pravatar.cc/120?img=3" alt="Large avatar" />
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-4">
  <Avatar alt="Fallback avatar" />
  <Avatar src="https://i.pravatar.cc/120?img=5" alt="Image avatar" />
</div>\`
      }
    }
  },
  render: () => <div className="grid gap-4">
      <Avatar alt="Fallback avatar" />
      <Avatar src="https://i.pravatar.cc/120?img=5" alt="Image avatar" />
    </div>
}`},m.parameters?.docs?.source)})}),h=[`Fallback`,`WithImage`,`Sizes`,`ImageSizes`,`States`]}))();export{u as Fallback,p as ImageSizes,f as Sizes,m as States,d as WithImage,h as __namedExportsOrder,l as default};