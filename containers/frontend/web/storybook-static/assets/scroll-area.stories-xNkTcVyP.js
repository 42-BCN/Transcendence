import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{t as n}from"./text-DiWBaZ2Q.js";import{t as r}from"./text-D4DF58Ng.js";import{n as i,t as a}from"./scroll-area-DrPPgJKz.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var u,d,f,p,m,h,g;e((()=>{u=t(),r(),i(),d={title:`Components/Primitives/ScrollArea`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Scrollable container primitive. It applies the project scroll area styles to a div and forwards native div attributes.`}}},argTypes:{children:{control:!1,description:`Scrollable content rendered inside the container.`,table:{category:`Content`,type:{summary:`ReactNode`}}}}},f=Array.from({length:24},function(e,t){return`Item ${t+1}`}),p={parameters:{docs:{source:{code:`<ScrollArea style={{ maxHeight: 240 }}>
  {items.map((item) => (
    <Text key={item} as="p" variant="body-sm">
      {item}
    </Text>
  ))}
</ScrollArea>`}}},render:function(){return(0,u.jsx)(`div`,{className:`w-full max-w-xs rounded-md border border-border-primary`,children:(0,u.jsx)(a,{style:{maxHeight:240},children:(0,u.jsx)(`div`,{className:`grid gap-2 p-4`,children:f.map(function(e){return(0,u.jsx)(n,{as:`p`,variant:`body-sm`,children:e},e)})})})})}},m={parameters:{docs:{source:{code:`<ScrollArea style={{ maxHeight: 320 }}>
  <div className="grid gap-3 p-4">
    {messages.map((message) => (
      <div key={message} className="rounded-md border border-border-primary p-3">
        {message}
      </div>
    ))}
  </div>
</ScrollArea>`}}},render:function(){return(0,u.jsx)(`div`,{className:`w-full max-w-sm rounded-md border border-border-primary`,children:(0,u.jsx)(a,{style:{maxHeight:320},children:(0,u.jsx)(`div`,{className:`grid gap-3 p-4`,children:f.map(function(e){return(0,u.jsx)(`div`,{className:`rounded-md border border-border-primary p-3`,children:(0,u.jsxs)(n,{as:`p`,variant:`body-sm`,children:[`Message content for `,e.toLowerCase(),`.`]})},e)})})})})}},h={parameters:{docs:{source:{code:`<ScrollArea>
  <div className="flex w-max gap-3 p-4">
    {items.map((item) => (
      <div key={item} className="w-32 rounded-md border border-border-primary p-3">
        {item}
      </div>
    ))}
  </div>
</ScrollArea>`}}},render:function(){return(0,u.jsx)(`div`,{className:`w-full max-w-sm rounded-md border border-border-primary`,children:(0,u.jsx)(a,{children:(0,u.jsx)(`div`,{className:`flex w-max gap-3 p-4`,children:f.slice(0,10).map(function(e){return(0,u.jsx)(`div`,{className:`w-32 rounded-md border border-border-primary p-3`,children:(0,u.jsx)(n,{as:`p`,variant:`body-sm`,children:e})},e)})})})})}},p.parameters=l(s({},p.parameters),{docs:l(s({},p.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<ScrollArea style={{ maxHeight: 240 }}>
  {items.map((item) => (
    <Text key={item} as="p" variant="body-sm">
      {item}
    </Text>
  ))}
</ScrollArea>\`
      }
    }
  },
  render: () => <div className="w-full max-w-xs rounded-md border border-border-primary">
      <ScrollArea style={{
      maxHeight: 240
    }}>
        <div className="grid gap-2 p-4">
          {items.map(item => <Text key={item} as="p" variant="body-sm">
              {item}
            </Text>)}
        </div>
      </ScrollArea>
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<ScrollArea style={{ maxHeight: 320 }}>
  <div className="grid gap-3 p-4">
    {messages.map((message) => (
      <div key={message} className="rounded-md border border-border-primary p-3">
        {message}
      </div>
    ))}
  </div>
</ScrollArea>\`
      }
    }
  },
  render: () => <div className="w-full max-w-sm rounded-md border border-border-primary">
      <ScrollArea style={{
      maxHeight: 320
    }}>
        <div className="grid gap-3 p-4">
          {items.map(item => <div key={item} className="rounded-md border border-border-primary p-3">
              <Text as="p" variant="body-sm">
                Message content for {item.toLowerCase()}.
              </Text>
            </div>)}
        </div>
      </ScrollArea>
    </div>
}`},m.parameters?.docs?.source)})}),h.parameters=l(s({},h.parameters),{docs:l(s({},h.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<ScrollArea>
  <div className="flex w-max gap-3 p-4">
    {items.map((item) => (
      <div key={item} className="w-32 rounded-md border border-border-primary p-3">
        {item}
      </div>
    ))}
  </div>
</ScrollArea>\`
      }
    }
  },
  render: () => <div className="w-full max-w-sm rounded-md border border-border-primary">
      <ScrollArea>
        <div className="flex w-max gap-3 p-4">
          {items.slice(0, 10).map(item => <div key={item} className="w-32 rounded-md border border-border-primary p-3">
              <Text as="p" variant="body-sm">
                {item}
              </Text>
            </div>)}
        </div>
      </ScrollArea>
    </div>
}`},h.parameters?.docs?.source)})}),g=[`Default`,`ChatMessages`,`HorizontalContent`]}))();export{m as ChatMessages,p as Default,h as HorizontalContent,g as __namedExportsOrder,d as default};