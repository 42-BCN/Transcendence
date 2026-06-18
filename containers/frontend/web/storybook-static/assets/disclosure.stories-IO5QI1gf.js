import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{a as n,i as r,n as i,r as a,t as o}from"./disclosure-DdWqEsU-.js";function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){s(e,t,n[t])})}return e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function u(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var d,f,p,m,h,g,_;e((()=>{d=t(),n(),f={title:`Components/Controls/Disclosure`,component:o,subcomponents:{DisclosureGroup:i,DisclosureTrigger:r,DisclosurePanel:a},tags:[`autodocs`],parameters:{docs:{description:{component:`Accessible disclosure components built on React Aria Components. Use Disclosure for a single expandable section, DisclosureGroup for grouped sections, DisclosureTrigger for the clickable header, and DisclosurePanel for the expandable content.`}}},argTypes:{id:{control:`text`,description:`Unique identifier for the disclosure item.`,table:{category:`Behavior`,type:{summary:`string`}}},defaultExpanded:{control:`boolean`,description:`Whether the disclosure is expanded by default when uncontrolled.`,table:{category:`State`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},isExpanded:{control:`boolean`,description:`Controls the expanded state when using the component as controlled.`,table:{category:`State`,type:{summary:`boolean`}}},onExpandedChange:{action:`expanded changed`,description:`Callback fired when the expanded state changes.`,table:{category:`Events`,type:{summary:`(isExpanded: boolean) => void`}}},className:{control:!1,description:`Optional className passed to the disclosure container.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}},children:{control:!1,description:`Disclosure content. Can be React nodes or a render function supported by React Aria Components.`,table:{category:`Content`,type:{summary:`ReactNode | ((values) => ReactNode)`},disable:!0}}},args:{id:`account-settings`,defaultExpanded:!1}},p={parameters:{docs:{source:{code:`<Disclosure id="account-settings">
  <DisclosureTrigger title="Account settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Manage your account profile, email, and password settings.
    </div>
  </DisclosurePanel>
</Disclosure>`}}},render:function(e){return(0,d.jsx)(`div`,{className:`w-full max-w-md`,children:(0,d.jsxs)(o,u(c({},e),{children:[(0,d.jsx)(r,{title:`Account settings`}),(0,d.jsx)(a,{children:(0,d.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Manage your account profile, email, and password settings.`})})]}))})}},m={args:{defaultExpanded:!0},parameters:{docs:{source:{code:`<Disclosure id="privacy-settings" defaultExpanded>
  <DisclosureTrigger title="Privacy settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Control profile visibility, blocked users, and account privacy.
    </div>
  </DisclosurePanel>
</Disclosure>`}}},render:function(e){return(0,d.jsx)(`div`,{className:`w-full max-w-md`,children:(0,d.jsxs)(o,u(c({},e),{id:`privacy-settings`,children:[(0,d.jsx)(r,{title:`Privacy settings`}),(0,d.jsx)(a,{children:(0,d.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Control profile visibility, blocked users, and account privacy.`})})]}))})}},h={parameters:{docs:{description:{story:`Use DisclosureGroup to render a list of related expandable sections.`},source:{code:`<DisclosureGroup>
  <Disclosure id="profile">
    <DisclosureTrigger title="Profile" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Update your public profile information.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="security">
    <DisclosureTrigger title="Security" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Manage password, sessions, and account security.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="notifications">
    <DisclosureTrigger title="Notifications" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Configure email and in-app notification preferences.
      </div>
    </DisclosurePanel>
  </Disclosure>
</DisclosureGroup>`}}},render:function(){return(0,d.jsx)(`div`,{className:`w-full max-w-md`,children:(0,d.jsxs)(i,{children:[(0,d.jsxs)(o,{id:`profile`,children:[(0,d.jsx)(r,{title:`Profile`}),(0,d.jsx)(a,{children:(0,d.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Update your public profile information.`})})]}),(0,d.jsxs)(o,{id:`security`,children:[(0,d.jsx)(r,{title:`Security`}),(0,d.jsx)(a,{children:(0,d.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Manage password, sessions, and account security.`})})]}),(0,d.jsxs)(o,{id:`notifications`,children:[(0,d.jsx)(r,{title:`Notifications`}),(0,d.jsx)(a,{children:(0,d.jsx)(`div`,{className:`py-3 text-text-secondary`,children:`Configure email and in-app notification preferences.`})})]})]})})}},g={parameters:{docs:{description:{story:`DisclosurePanel accepts any React content, so it can be used for text, links, actions, or structured layouts.`},source:{code:`<Disclosure id="danger-zone">
  <DisclosureTrigger title="Danger zone" />
  <DisclosurePanel>
    <div className="grid gap-3 py-3">
      <p className="text-text-secondary">
        These actions can affect your account permanently.
      </p>
      <button type="button" className="text-left text-red-600">
        Delete account
      </button>
    </div>
  </DisclosurePanel>
</Disclosure>`}}},render:function(){return(0,d.jsx)(`div`,{className:`w-full max-w-md`,children:(0,d.jsxs)(o,{id:`danger-zone`,children:[(0,d.jsx)(r,{title:`Danger zone`}),(0,d.jsx)(a,{children:(0,d.jsxs)(`div`,{className:`grid gap-3 py-3`,children:[(0,d.jsx)(`p`,{className:`text-text-secondary`,children:`These actions can affect your account permanently.`}),(0,d.jsx)(`button`,{type:`button`,className:`text-left text-red-600`,children:`Delete account`})]})})]})})}},p.parameters=u(c({},p.parameters),{docs:u(c({},p.parameters?.docs),{source:c({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<Disclosure id="account-settings">
  <DisclosureTrigger title="Account settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Manage your account profile, email, and password settings.
    </div>
  </DisclosurePanel>
</Disclosure>\`
      }
    }
  },
  render: args => <div className="w-full max-w-md">
      <Disclosure {...args}>
        <DisclosureTrigger title="Account settings" />
        <DisclosurePanel>
          <div className="py-3 text-text-secondary">
            Manage your account profile, email, and password settings.
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
}`},p.parameters?.docs?.source)})}),m.parameters=u(c({},m.parameters),{docs:u(c({},m.parameters?.docs),{source:c({originalSource:`{
  args: {
    defaultExpanded: true
  },
  parameters: {
    docs: {
      source: {
        code: \`<Disclosure id="privacy-settings" defaultExpanded>
  <DisclosureTrigger title="Privacy settings" />
  <DisclosurePanel>
    <div className="py-3 text-text-secondary">
      Control profile visibility, blocked users, and account privacy.
    </div>
  </DisclosurePanel>
</Disclosure>\`
      }
    }
  },
  render: args => <div className="w-full max-w-md">
      <Disclosure {...args} id="privacy-settings">
        <DisclosureTrigger title="Privacy settings" />
        <DisclosurePanel>
          <div className="py-3 text-text-secondary">
            Control profile visibility, blocked users, and account privacy.
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
}`},m.parameters?.docs?.source)})}),h.parameters=u(c({},h.parameters),{docs:u(c({},h.parameters?.docs),{source:c({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Use DisclosureGroup to render a list of related expandable sections.'
      },
      source: {
        code: \`<DisclosureGroup>
  <Disclosure id="profile">
    <DisclosureTrigger title="Profile" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Update your public profile information.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="security">
    <DisclosureTrigger title="Security" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Manage password, sessions, and account security.
      </div>
    </DisclosurePanel>
  </Disclosure>

  <Disclosure id="notifications">
    <DisclosureTrigger title="Notifications" />
    <DisclosurePanel>
      <div className="py-3 text-text-secondary">
        Configure email and in-app notification preferences.
      </div>
    </DisclosurePanel>
  </Disclosure>
</DisclosureGroup>\`
      }
    }
  },
  render: () => <div className="w-full max-w-md">
      <DisclosureGroup>
        <Disclosure id="profile">
          <DisclosureTrigger title="Profile" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">Update your public profile information.</div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="security">
          <DisclosureTrigger title="Security" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">
              Manage password, sessions, and account security.
            </div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="notifications">
          <DisclosureTrigger title="Notifications" />
          <DisclosurePanel>
            <div className="py-3 text-text-secondary">
              Configure email and in-app notification preferences.
            </div>
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>
    </div>
}`},h.parameters?.docs?.source)})}),g.parameters=u(c({},g.parameters),{docs:u(c({},g.parameters?.docs),{source:c({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'DisclosurePanel accepts any React content, so it can be used for text, links, actions, or structured layouts.'
      },
      source: {
        code: \`<Disclosure id="danger-zone">
  <DisclosureTrigger title="Danger zone" />
  <DisclosurePanel>
    <div className="grid gap-3 py-3">
      <p className="text-text-secondary">
        These actions can affect your account permanently.
      </p>
      <button type="button" className="text-left text-red-600">
        Delete account
      </button>
    </div>
  </DisclosurePanel>
</Disclosure>\`
      }
    }
  },
  render: () => <div className="w-full max-w-md">
      <Disclosure id="danger-zone">
        <DisclosureTrigger title="Danger zone" />
        <DisclosurePanel>
          <div className="grid gap-3 py-3">
            <p className="text-text-secondary">
              These actions can affect your account permanently.
            </p>
            <button type="button" className="text-left text-red-600">
              Delete account
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
}`},g.parameters?.docs?.source)})}),_=[`Default`,`ExpandedByDefault`,`Group`,`WithCustomPanelContent`]}))();export{p as Default,m as ExpandedByDefault,h as Group,g as WithCustomPanelContent,_ as __namedExportsOrder,f as default};