import{n as e}from"./chunk-BEldbCjX.js";import{n as t,t as n}from"./inline-link-prompt-CE32aOsM.js";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],i=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){r(e,t,n[t])})}return e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function o(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var s,c,l,u,d;e((()=>{t(),s={title:`Components/Composites/InlineLinkPrompt`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:`Inline prompt composed from Text, Stack, and InternalLink. Useful for short authentication or navigation prompts such as sign-in/sign-up links.`}}},argTypes:{text:{control:`text`,description:`Text displayed before the inline link.`,table:{category:`Content`,type:{summary:`string`}}},linkLabel:{control:`text`,description:`Visible label for the inline link.`,table:{category:`Content`,type:{summary:`string`}}},href:{control:`text`,description:`Internal route passed to the InternalLink component.`,table:{category:`Navigation`,type:{summary:`string`}}}},args:{text:`Already have an account?`,linkLabel:`Sign in`,href:`/login`}},c={},l={args:{text:`Don't have an account?`,linkLabel:`Create account`,href:`/create-account`},parameters:{docs:{source:{code:`<InlineLinkPrompt
  text="Don't have an account?"
  linkLabel="Create account"
  href="/signup"
/>`}}}},u={args:{text:`Forgot your password?`,linkLabel:`Reset it`,href:`/reset-password`},parameters:{docs:{source:{code:`<InlineLinkPrompt
  text="Forgot your password?"
  linkLabel="Reset it"
  href="/forgot-password"
/>`}}}},c.parameters=o(i({},c.parameters),{docs:o(i({},c.parameters?.docs),{source:i({originalSource:`{}`},c.parameters?.docs?.source)})}),l.parameters=o(i({},l.parameters),{docs:o(i({},l.parameters?.docs),{source:i({originalSource:`{
  args: {
    text: "Don't have an account?",
    linkLabel: 'Create account',
    href: '/create-account'
  },
  parameters: {
    docs: {
      source: {
        code: \`<InlineLinkPrompt
  text="Don't have an account?"
  linkLabel="Create account"
  href="/signup"
/>\`
      }
    }
  }
}`},l.parameters?.docs?.source)})}),u.parameters=o(i({},u.parameters),{docs:o(i({},u.parameters?.docs),{source:i({originalSource:`{
  args: {
    text: 'Forgot your password?',
    linkLabel: 'Reset it',
    href: '/reset-password'
  },
  parameters: {
    docs: {
      source: {
        code: \`<InlineLinkPrompt
  text="Forgot your password?"
  linkLabel="Reset it"
  href="/forgot-password"
/>\`
      }
    }
  }
}`},u.parameters?.docs?.source)})}),d=[`Default`,`SignUpPrompt`,`ForgotPasswordPrompt`]}))();export{c as Default,u as ForgotPasswordPrompt,l as SignUpPrompt,d as __namedExportsOrder,s as default};