import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{a as n,i as r,n as i,r as a,t as o}from"./tabs-BkS5qnlx.js";function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){s(e,t,n[t])})}return e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function u(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var d,f,p,m;e((()=>{d=t(),n(),f={title:`Components/Controls/Tabs`,component:r,subcomponents:{TabList:i,Tab:o,TabPanel:a},tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible tabs primitives built on React Aria Components. Use Tabs as the root, TabList for the tab triggers, Tab for each selectable tab, and TabPanel for the matching content.`}}},argTypes:{defaultSelectedKey:{control:`text`,description:`Initial selected tab key when the tabs are uncontrolled.`,table:{category:`State`,type:{summary:`Key`}}},selectedKey:{control:!1,description:`Selected tab key when the tabs are controlled.`,table:{category:`State`,type:{summary:`Key`}}},onSelectionChange:{action:`selection changed`,description:`Callback fired when the selected tab changes.`,table:{category:`Events`,type:{summary:`(key: Key) => void`}}},orientation:{control:`select`,options:[`horizontal`,`vertical`],description:`Tab orientation.`,table:{category:`Behavior`,type:{summary:`'horizontal' | 'vertical'`},defaultValue:{summary:`horizontal`}}},isDisabled:{control:`boolean`,description:`Disables the whole tabs collection.`,table:{category:`State`,type:{summary:`boolean`}}},className:{control:!1,description:`Optional className passed to the Tabs root.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}},children:{control:!1,description:`Tabs content composed from TabList, Tab, and TabPanel.`,table:{category:`Content`,type:{summary:`ReactNode`},disable:!0}}},args:{defaultSelectedKey:`overview`}},p={parameters:{docs:{source:{code:`<Tabs defaultSelectedKey="overview">
  <TabList aria-label="Profile sections">
    <Tab id="overview">Overview</Tab>
    <Tab id="friends">Friends</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>

  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="friends">Friends content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>`}}},render:function(e){return(0,d.jsx)(`div`,{className:`w-full max-w-md`,children:(0,d.jsxs)(r,u(c({},e),{children:[(0,d.jsxs)(i,{"aria-label":`Profile sections`,children:[(0,d.jsx)(o,{id:`overview`,children:`Overview`}),(0,d.jsx)(o,{id:`friends`,children:`Friends`}),(0,d.jsx)(o,{id:`settings`,children:`Settings`})]}),(0,d.jsx)(a,{id:`overview`,children:(0,d.jsx)(`div`,{className:`py-4 text-text-secondary`,children:`Overview content`})}),(0,d.jsx)(a,{id:`friends`,children:(0,d.jsx)(`div`,{className:`py-4 text-text-secondary`,children:`Friends content`})}),(0,d.jsx)(a,{id:`settings`,children:(0,d.jsx)(`div`,{className:`py-4 text-text-secondary`,children:`Settings content`})})]}))})}},p.parameters=u(c({},p.parameters),{docs:u(c({},p.parameters?.docs),{source:c({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Tabs defaultSelectedKey="overview">
  <TabList aria-label="Profile sections">
    <Tab id="overview">Overview</Tab>
    <Tab id="friends">Friends</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>

  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="friends">Friends content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>\`
      }
    }
  },
  render: args => <div className="w-full max-w-md">
      <Tabs {...args}>
        <TabList aria-label="Profile sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="friends">Friends</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>

        <TabPanel id="overview">
          <div className="py-4 text-text-secondary">Overview content</div>
        </TabPanel>

        <TabPanel id="friends">
          <div className="py-4 text-text-secondary">Friends content</div>
        </TabPanel>

        <TabPanel id="settings">
          <div className="py-4 text-text-secondary">Settings content</div>
        </TabPanel>
      </Tabs>
    </div>
}`},p.parameters?.docs?.source)})}),m=[`Default`]}))();export{p as Default,m as __namedExportsOrder,f as default};