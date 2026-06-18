import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{n,t as r}from"./api-feedback-C_41immD.js";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){i(e,t,n[t])})}return e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function s(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}var c,l,u,d,f,p,m;e((()=>{c=t(),n(),l={title:`Components/Composites/ApiFeedback`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Small API result feedback component. It renders nothing when result is null, a success message when ok is true, and a translated error message from the errors namespace when ok is false.`}}},argTypes:{result:{control:`object`,description:`API result object. When null, no feedback is rendered. When ok is false, error.code is resolved through the errors translation namespace.`,table:{category:`State`,type:{summary:`{ ok: true } | { ok: false; error: { code: string } } | null`}}},successMessage:{control:`text`,description:`Message rendered when the API result is successful.`,table:{category:`Content`,type:{summary:`string`}}}},args:{result:{ok:!0},successMessage:`Changes saved successfully.`}},u={args:{result:{ok:!0},successMessage:`Changes saved successfully.`}},d={args:{result:{ok:!1,error:{code:`generic`}},successMessage:`Changes saved successfully.`},parameters:{docs:{source:{code:`<ApiFeedback
  result={{
    ok: false,
    error: {
      code: 'generic',
    },
  }}
  successMessage="Changes saved successfully."
/>`}}}},f={args:{result:null,successMessage:`Changes saved successfully.`},parameters:{docs:{description:{story:`When result is null, the component renders nothing.`},source:{code:`<ApiFeedback result={null} successMessage="Changes saved successfully." />`}}}},p={parameters:{docs:{source:{code:`<div className="grid gap-3">
  <ApiFeedback
    result={{ ok: true }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback
    result={{
      ok: false,
      error: {
        code: 'generic',
      },
    }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback result={null} successMessage="Changes saved successfully." />
</div>`}}},render:function(){return(0,c.jsxs)(`div`,{className:`grid gap-3`,children:[(0,c.jsx)(r,{result:{ok:!0},successMessage:`Changes saved successfully.`}),(0,c.jsx)(r,{result:{ok:!1,error:{code:`generic`}},successMessage:`Changes saved successfully.`}),(0,c.jsx)(r,{result:null,successMessage:`Changes saved successfully.`})]})}},u.parameters=s(a({},u.parameters),{docs:s(a({},u.parameters?.docs),{source:a({originalSource:`{
  args: {
    result: {
      ok: true
    },
    successMessage: 'Changes saved successfully.'
  }
}`},u.parameters?.docs?.source)})}),d.parameters=s(a({},d.parameters),{docs:s(a({},d.parameters?.docs),{source:a({originalSource:`{
  args: {
    result: {
      ok: false,
      error: {
        code: 'generic'
      }
    },
    successMessage: 'Changes saved successfully.'
  },
  parameters: {
    docs: {
      source: {
        code: \`<ApiFeedback
  result={{
    ok: false,
    error: {
      code: 'generic',
    },
  }}
  successMessage="Changes saved successfully."
/>\`
      }
    }
  }
}`},d.parameters?.docs?.source)})}),f.parameters=s(a({},f.parameters),{docs:s(a({},f.parameters?.docs),{source:a({originalSource:`{
  args: {
    result: null,
    successMessage: 'Changes saved successfully.'
  },
  parameters: {
    docs: {
      description: {
        story: 'When result is null, the component renders nothing.'
      },
      source: {
        code: \`<ApiFeedback result={null} successMessage="Changes saved successfully." />\`
      }
    }
  }
}`},f.parameters?.docs?.source)})}),p.parameters=s(a({},p.parameters),{docs:s(a({},p.parameters?.docs),{source:a({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-3">
  <ApiFeedback
    result={{ ok: true }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback
    result={{
      ok: false,
      error: {
        code: 'generic',
      },
    }}
    successMessage="Changes saved successfully."
  />

  <ApiFeedback result={null} successMessage="Changes saved successfully." />
</div>\`
      }
    }
  },
  render: () => <div className="grid gap-3">
      <ApiFeedback result={{
      ok: true
    }} successMessage="Changes saved successfully." />

      <ApiFeedback result={{
      ok: false,
      error: {
        code: 'generic'
      }
    }} successMessage="Changes saved successfully." />

      <ApiFeedback result={null} successMessage="Changes saved successfully." />
    </div>
}`},p.parameters?.docs?.source)})}),m=[`Success`,`Error`,`Empty`,`States`]}))();export{f as Empty,d as Error,p as States,u as Success,m as __namedExportsOrder,l as default};