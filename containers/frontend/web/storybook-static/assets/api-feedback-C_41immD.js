import{n as e}from"./chunk-BEldbCjX.js";import{C as t,n,t as r}from"./iframe-DMHpIwzT.js";import{t as i}from"./text-DiWBaZ2Q.js";import{t as a}from"./text-D4DF58Ng.js";var o,s=e((()=>{o={success:`text-green-500 before:content-["✓"] before:inline-block before:font-bold before:mr-1`,error:`text-red-500 before:content-["✗"] before:inline-block before:font-bold before:mr-1`}}));function c(e){var t=e.result,r=e.successMessage;if(!t)return null;var a=n(`errors`);if(t.ok)return(0,l.jsx)(i,{variant:`body-xs`,className:o.success,children:r});var s=t?.error.code;return(0,l.jsx)(i,{variant:`body-xs`,className:o.error,children:a(s)})}var l,u=e((()=>{l=t(),a(),r(),s(),c.__docgenInfo={description:``,methods:[],displayName:`ApiFeedback`,props:{result:{required:!0,tsType:{name:`union`,raw:`ApiFeedbackResult<TCode> | null`,elements:[{name:`union`,raw:`ApiSuccessResult | ApiErrorResult<TCode>`,elements:[{name:`signature`,type:`object`,raw:`{
  ok: true;
}`,signature:{properties:[{key:`ok`,value:{name:`literal`,value:`true`,required:!0}}]}},{name:`signature`,type:`object`,raw:`{
  ok: false;
  error: {
    code: TCode;
  };
}`,signature:{properties:[{key:`ok`,value:{name:`literal`,value:`false`,required:!0}},{key:`error`,value:{name:`signature`,type:`object`,raw:`{
  code: TCode;
}`,signature:{properties:[{key:`code`,value:{name:`TCode`,required:!0}}]},required:!0}}]}}]},{name:`null`}]},description:``},successMessage:{required:!0,tsType:{name:`string`},description:``}}}}));export{u as n,c as t};