import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./async-cooldown-button-WKJMB9jR.js";function i(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function a(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var o=e.apply(t,n);function s(e){i(o,r,a,s,c,`next`,e)}function c(e){i(o,r,a,s,c,`throw`,e)}s(void 0)})}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function u(e,t){var n,r,i,a={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},o=Object.create((typeof Iterator==`function`?Iterator:Object).prototype),s=Object.defineProperty;return s(o,`next`,{value:c(0)}),s(o,`throw`,{value:c(1)}),s(o,`return`,{value:c(2)}),typeof Symbol==`function`&&s(o,Symbol.iterator,{value:function(){return this}}),o;function c(e){return function(t){return l([e,t])}}function l(s){if(n)throw TypeError(`Generator is already executing.`);for(;o&&(o=0,s[0]&&(a=0)),a;)try{if(n=1,r&&(i=s[0]&2?r.return:s[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,s[1])).done)return i;switch(r=0,i&&(s=[s[0]&2,i.value]),s[0]){case 0:case 1:i=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,r=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if((i=a.trys,!(i=i.length>0&&i[i.length-1]))&&(s[0]===6||s[0]===2)){a=0;continue}if(s[0]===3&&(!i||s[1]>i[0]&&s[1]<i[3])){a.label=s[1];break}if(s[0]===6&&a.label<i[1]){a.label=i[1],i=s;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(s);break}i[2]&&a.ops.pop(),a.trys.pop();continue}s=t.call(e,a)}catch(e){s=[6,e],r=0}finally{n=i=0}if(s[0]&5)throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}}var d,f,p,m,h,g,_,v,y;e((()=>{d=t(),n(),f=function(e){return new Promise(function(t){window.setTimeout(t,e)})},p={title:`Components/Composites/AsyncCooldownButton`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Button that runs an async action, disables itself while pending, and starts a cooldown before it can be pressed again.`}}},argTypes:{onPress:{action:`pressed`,description:`Callback fired when the button is pressed. Can be synchronous or asynchronous.`,table:{category:`Events`,type:{summary:`() => void | Promise<void>`}}},cooldownSeconds:{control:{type:`number`,min:1,max:120,step:1},description:`Cooldown duration in seconds after the button is pressed.`,table:{category:`Behavior`,type:{summary:`number`},defaultValue:{summary:`30`}}},startOnMount:{control:`boolean`,description:`Starts the cooldown as soon as the component is mounted.`,table:{category:`Behavior`,type:{summary:`boolean`},defaultValue:{summary:`false`}}},idleLabel:{control:`text`,description:`Text shown when the button is idle and available.`,table:{category:`Content`,type:{summary:`string`}}},pendingLabel:{control:`text`,description:`Text shown while the async action is running.`,table:{category:`Content`,type:{summary:`string`}}},formatCooldownLabel:{control:!1,description:`Optional formatter for the cooldown text.`,table:{category:`Content`,type:{summary:`(remaining: number) => string`}}}},args:{idleLabel:`Resend email`,pendingLabel:`Sending...`,cooldownSeconds:5,startOnMount:!1,onPress:function(){return a(function(){return u(this,function(e){switch(e.label){case 0:return[4,f(1e3)];case 1:return e.sent(),[2]}})})()}}},m={},h={args:{startOnMount:!0,cooldownSeconds:10,idleLabel:`Resend email`,pendingLabel:`Sending...`}},g={args:{cooldownSeconds:10,idleLabel:`Try again`,pendingLabel:`Submitting...`,formatCooldownLabel:function(e){return`Available again in ${e}s`}},parameters:{docs:{source:{code:`<AsyncCooldownButton
  idleLabel="Try again"
  pendingLabel="Submitting..."
  cooldownSeconds={10}
  formatCooldownLabel={(remaining) => \`Available again in \${remaining}s\`}
  onPress={async () => {
    await submitAction();
  }}
/>`}}}},_={args:{cooldownSeconds:8,idleLabel:`Submit`,pendingLabel:`Submitting...`,onPress:function(){return a(function(){return u(this,function(e){switch(e.label){case 0:return[4,f(2500)];case 1:return e.sent(),[2]}})})()}}},v={parameters:{docs:{source:{code:`<div className="grid gap-4">
  <AsyncCooldownButton
    idleLabel="Resend email"
    pendingLabel="Sending..."
    cooldownSeconds={5}
    onPress={async () => {
      await resendEmail();
    }}
  />

  <AsyncCooldownButton
    idleLabel="Verify again"
    pendingLabel="Checking..."
    cooldownSeconds={10}
    startOnMount
    onPress={async () => {
      await verifyEmail();
    }}
  />
</div>`}}},render:function(){return(0,d.jsxs)(`div`,{className:`grid gap-4`,children:[(0,d.jsx)(r,{idleLabel:`Resend email`,pendingLabel:`Sending...`,cooldownSeconds:5,onPress:function(){return a(function(){return u(this,function(e){switch(e.label){case 0:return[4,f(1e3)];case 1:return e.sent(),[2]}})})()}}),(0,d.jsx)(r,{idleLabel:`Verify again`,pendingLabel:`Checking...`,cooldownSeconds:10,startOnMount:!0,onPress:function(){return a(function(){return u(this,function(e){switch(e.label){case 0:return[4,f(1e3)];case 1:return e.sent(),[2]}})})()}})]})}},m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{}`},m.parameters?.docs?.source)})}),h.parameters=l(s({},h.parameters),{docs:l(s({},h.parameters?.docs),{source:s({originalSource:`{
  args: {
    startOnMount: true,
    cooldownSeconds: 10,
    idleLabel: 'Resend email',
    pendingLabel: 'Sending...'
  }
}`},h.parameters?.docs?.source)})}),g.parameters=l(s({},g.parameters),{docs:l(s({},g.parameters?.docs),{source:s({originalSource:`{
  args: {
    cooldownSeconds: 10,
    idleLabel: 'Try again',
    pendingLabel: 'Submitting...',
    formatCooldownLabel: remaining => \`Available again in \${remaining}s\`
  },
  parameters: {
    docs: {
      source: {
        code: \`<AsyncCooldownButton
  idleLabel="Try again"
  pendingLabel="Submitting..."
  cooldownSeconds={10}
  formatCooldownLabel={(remaining) => \\\`Available again in \\\${remaining}s\\\`}
  onPress={async () => {
    await submitAction();
  }}
/>\`
      }
    }
  }
}`},g.parameters?.docs?.source)})}),_.parameters=l(s({},_.parameters),{docs:l(s({},_.parameters?.docs),{source:s({originalSource:`{
  args: {
    cooldownSeconds: 8,
    idleLabel: 'Submit',
    pendingLabel: 'Submitting...',
    onPress: async () => {
      await wait(2500);
    }
  }
}`},_.parameters?.docs?.source)})}),v.parameters=l(s({},v.parameters),{docs:l(s({},v.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-4">
  <AsyncCooldownButton
    idleLabel="Resend email"
    pendingLabel="Sending..."
    cooldownSeconds={5}
    onPress={async () => {
      await resendEmail();
    }}
  />

  <AsyncCooldownButton
    idleLabel="Verify again"
    pendingLabel="Checking..."
    cooldownSeconds={10}
    startOnMount
    onPress={async () => {
      await verifyEmail();
    }}
  />
</div>\`
      }
    }
  },
  render: () => <div className="grid gap-4">
      <AsyncCooldownButton idleLabel="Resend email" pendingLabel="Sending..." cooldownSeconds={5} onPress={async () => {
      await wait(1000);
    }} />

      <AsyncCooldownButton idleLabel="Verify again" pendingLabel="Checking..." cooldownSeconds={10} startOnMount onPress={async () => {
      await wait(1000);
    }} />
    </div>
}`},v.parameters?.docs?.source)})}),y=[`Default`,`StartsOnMount`,`CustomCooldownLabel`,`SlowAsyncAction`,`Examples`]}))();export{g as CustomCooldownLabel,m as Default,v as Examples,_ as SlowAsyncAction,h as StartsOnMount,y as __namedExportsOrder,p as default};