import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./message-bubble-BoyMYNzO.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m,h;e((()=>{c=t(),n(),l={title:`Components/Primitives/MessageBubble`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Message bubble component for chat-like UI. It renders message content with a visual variant for different message ownership or states.`}}},argTypes:{children:{control:`text`,description:`Message content rendered inside the bubble.`,table:{category:`Content`,type:{summary:`ReactNode`}}},variant:{control:`select`,options:[`error`,`user`,`me`,`system`,`game-event`],description:`Visual style variant of the message bubble.`,table:{category:`Appearance`,type:{summary:`messageVariantType`}}}},args:{children:`Hey! Want to play a match?`,variant:`user`}},u={args:{variant:`me`,children:`Hey! Want to play a match?`}},d={args:{variant:`user`,children:`Sure, give me two minutes.`}},f={parameters:{docs:{source:{code:`<div className="grid w-full max-w-sm gap-3">
  <div className="justify-self-start">
    <MessageBubble variant="user">
      Sure, give me two minutes.
    </MessageBubble>
  </div>

  <div className="justify-self-end">
    <MessageBubble variant="me">
      Perfect, I will create the room.
    </MessageBubble>
  </div>
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid w-full max-w-sm gap-3`,children:[(0,c.jsx)(`div`,{className:`justify-self-start`,children:(0,c.jsx)(r,{variant:`user`,children:`Sure, give me two minutes.`})}),(0,c.jsx)(`div`,{className:`justify-self-end`,children:(0,c.jsx)(r,{variant:`me`,children:`Perfect, I will create the room.`})}),(0,c.jsx)(`div`,{className:`justify-self-start`,children:(0,c.jsx)(r,{variant:`user`,children:`Nice, send me the invite.`})})]})}},p={args:{variant:`game-event`,children:`Player scored a point!`}},m={args:{variant:`error`,children:`This is a longer message to check wrapping behavior inside the message bubble and make sure the layout stays readable.`},render:function(e){return(0,c.jsx)(`div`,{className:`w-full max-w-sm`,children:(0,c.jsx)(r,a({},e))})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{
  args: {
    variant: 'me',
    children: 'Hey! Want to play a match?'
  }
}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    variant: 'user',
    children: 'Sure, give me two minutes.'
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid w-full max-w-sm gap-3">
  <div className="justify-self-start">
    <MessageBubble variant="user">
      Sure, give me two minutes.
    </MessageBubble>
  </div>

  <div className="justify-self-end">
    <MessageBubble variant="me">
      Perfect, I will create the room.
    </MessageBubble>
  </div>
</div>\`
      }
    }
  },
  render: () => <div className="grid w-full max-w-sm gap-3">
      <div className="justify-self-start">
        <MessageBubble variant="user">Sure, give me two minutes.</MessageBubble>
      </div>

      <div className="justify-self-end">
        <MessageBubble variant="me">Perfect, I will create the room.</MessageBubble>
      </div>

      <div className="justify-self-start">
        <MessageBubble variant="user">Nice, send me the invite.</MessageBubble>
      </div>
    </div>
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  args: {
    variant: 'game-event',
    children: 'Player scored a point!'
  }
}`},p.parameters?.docs?.source)})}),m.parameters=s(a({},m.parameters),{docs:s(a({},m.parameters?.docs),{source:a({originalSource:`{
  args: {
    variant: 'error',
    children: 'This is a longer message to check wrapping behavior inside the message bubble and make sure the layout stays readable.'
  },
  render: args => <div className="w-full max-w-sm">
      <MessageBubble {...args} />
    </div>
}`},m.parameters?.docs?.source)})}),h=[`Sent`,`Received`,`Conversation`,`GameEvent`,`LongMessage`]}))();export{f as Conversation,p as GameEvent,m as LongMessage,d as Received,u as Sent,h as __namedExportsOrder,l as default};