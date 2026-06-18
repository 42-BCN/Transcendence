import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./icon-button-B09sRi6u.js";import{n as i,t as a}from"./user-item-HdyfTz9G.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var u,d,f,p,m;e((()=>{u=t(),n(),i(),d={title:`Components/Composites/UserItem`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Compact user row composed from Avatar, Text, Stack, and optional trailing actions. Useful for friends lists, search results, requests, and chat user lists.`}}},argTypes:{avatarUrl:{control:`text`,description:`Optional avatar image URL. When empty, Avatar fallback behavior is used.`,table:{category:`Content`,type:{summary:`string | null`}}},username:{control:`text`,description:`Primary username displayed in the user row.`,table:{category:`Content`,type:{summary:`string`}}},subtitle:{control:`text`,description:`Optional secondary text. Currently not rendered because the subtitle block is commented out in the component.`,table:{category:`Content`,type:{summary:`string`}}},children:{control:!1,description:`Optional trailing content, usually action buttons.`,table:{category:`Content`,type:{summary:`ReactNode`}}},href:{control:`text`,description:`Optional internal link href. When provided, the entire user item becomes a clickable link.`,table:{category:`Navigation`,type:{summary:`InternalLinkProps["href"]`}}},subtitleClassName:{control:`text`,description:`Optional className applied to the subtitle text element.`,table:{category:`Styling`,type:{summary:`string`}}},className:{control:!1,description:`Optional className merged into the user item root styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{avatarUrl:null,username:`carolina`}},f={},p={args:{username:`friend-request`,avatarUrl:`https://i.pravatar.cc/120?img=12`,className:`w-[400px]`,children:(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(r,{label:`Accept`,icon:`check`}),(0,u.jsx)(r,{label:`Reject`,icon:`close`})]})},parameters:{docs:{source:{code:`<UserItem
  username="friend-request"
  avatarUrl="https://i.pravatar.cc/120?img=12"
>
    <IconButton label="Accept" icon="check" />
    <IconButton label="Reject" icon="close" />
</UserItem>`}}}},f.parameters=l(s({},f.parameters),{docs:l(s({},f.parameters?.docs),{source:s({originalSource:`{}`},f.parameters?.docs?.source)})}),p.parameters=l(s({},p.parameters),{docs:l(s({},p.parameters?.docs),{source:s({originalSource:`{
  args: {
    username: 'friend-request',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    className: 'w-[400px]',
    children: <>
        <IconButton label="Accept" icon="check" />
        <IconButton label="Reject" icon="close" />
      </>
  },
  parameters: {
    docs: {
      source: {
        code: \`<UserItem
  username="friend-request"
  avatarUrl="https://i.pravatar.cc/120?img=12"
>
    <IconButton label="Accept" icon="check" />
    <IconButton label="Reject" icon="close" />
</UserItem>\`
      }
    }
  }
}`},p.parameters?.docs?.source)})}),m=[`Default`,`WithActions`]}))();export{f as Default,p as WithActions,m as __namedExportsOrder,d as default};