import{n as e}from"./chunk-BEldbCjX.js";import{C as t}from"./iframe-DMHpIwzT.js";import{t as n}from"./text-DiWBaZ2Q.js";import{t as r}from"./text-D4DF58Ng.js";import{n as i,t as a}from"./glass-card-CYH6usxg.js";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e,t){return t??={},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}function u(){return(0,f.jsxs)(`div`,{className:`grid gap-2`,children:[(0,f.jsx)(n,{as:`h3`,variant:`heading-sm`,children:`Glass card`}),(0,f.jsx)(n,{as:`p`,variant:`body-sm`,color:`secondary`,children:`This surface is useful for panels, navigation containers, overlays, and floating UI.`})]})}function d(e){var t=e.children;return(0,f.jsxs)(`div`,{className:`relative min-h-[420px] w-full max-w-md overflow-hidden rounded-md border border-border-primary bg-bg-primary p-8`,children:[(0,f.jsx)(`div`,{className:`absolute inset-y-0 left-0 w-1/3 bg-blue-500`,"aria-hidden":`true`}),(0,f.jsx)(`div`,{className:`absolute inset-y-0 left-1/3 w-1/3 bg-white`,"aria-hidden":`true`}),(0,f.jsx)(`div`,{className:`absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-purple-500 to-transparent`,"aria-hidden":`true`}),(0,f.jsx)(`div`,{className:`absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(var(--color-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid-line)_1px,transparent_1px)] bg-[size:18px_18px] opacity-80`,"aria-hidden":`true`}),(0,f.jsx)(`div`,{className:`absolute left-0 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-white/70`,children:`Solid`}),(0,f.jsx)(`div`,{className:`absolute left-1/3 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-slate-500`,children:`Empty`}),(0,f.jsx)(`div`,{className:`absolute right-0 top-4 w-1/3 text-center text-sm font-bold uppercase tracking-wide text-white/70`,children:`Fade`}),(0,f.jsx)(`div`,{className:`relative z-10 pt-10`,children:t})]})}var f,p,m,h,g,_,v,y,b,x;e((()=>{f=t(),r(),i(),p={title:`Components/Primitives/GlassCard`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`Glass-style surface primitive. It applies backdrop blur, translucent gradient intensity, border intensity, shadow, radius, padding, and optional backdrop saturation.`}}},argTypes:{blur:{control:`select`,options:[`none`,`sm`,`sm2`,`md`,`lg`,`xl`,`2xl`],description:`Controls the backdrop blur strength.`,table:{category:`Appearance`,type:{summary:`'none' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl' | '2xl'`},defaultValue:{summary:`sm2`}}},intensity:{control:`select`,options:[`low`,`medium`,`high`],description:`Controls the translucent glass background intensity.`,table:{category:`Appearance`,type:{summary:`'low' | 'medium' | 'high'`},defaultValue:{summary:`medium`}}},borderIntensity:{control:`select`,options:[`low`,`medium`,`high`],description:`Controls the glass border intensity.`,table:{category:`Appearance`,type:{summary:`'low' | 'medium' | 'high'`},defaultValue:{summary:`medium`}}},saturate:{control:`boolean`,description:`Enables or disables backdrop saturation.`,table:{category:`Appearance`,type:{summary:`boolean`},defaultValue:{summary:`true`}}},children:{control:!1,description:`Content rendered inside the card.`,table:{category:`Content`,type:{summary:`ReactNode`}}},className:{control:!1,description:`Optional className merged into the glass card styles.`,table:{category:`Styling`,type:{summary:`string`},disable:!0}}},args:{blur:`sm2`,intensity:`medium`,borderIntensity:`medium`,saturate:!0}},m={parameters:{docs:{source:{code:`<GlassCard>
  <Text as="h3" variant="heading-sm">
    Glass card
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This surface is useful for panels, navigation containers, overlays, and floating UI.
  </Text>
</GlassCard>`}}},render:function(e){return(0,f.jsx)(d,{children:(0,f.jsx)(a,l(s({},e),{children:(0,f.jsx)(u,{})}))})}},h={render:function(){return(0,f.jsx)(d,{children:(0,f.jsxs)(`div`,{className:`grid gap-4`,children:[(0,f.jsxs)(a,{intensity:`low`,blur:`sm2`,className:`w-full p-5`,children:[(0,f.jsx)(n,{variant:`heading-sm`,children:`Low`}),(0,f.jsx)(n,{variant:`body-sm`,color:`secondary`,children:`More transparent`})]}),(0,f.jsxs)(a,{intensity:`medium`,blur:`sm2`,className:`w-full p-5`,children:[(0,f.jsx)(n,{variant:`heading-sm`,children:`Medium`}),(0,f.jsx)(n,{variant:`body-sm`,color:`secondary`,children:`Default balance`})]}),(0,f.jsxs)(a,{intensity:`high`,blur:`sm2`,className:`w-full p-5`,children:[(0,f.jsx)(n,{variant:`heading-sm`,children:`High`}),(0,f.jsx)(n,{variant:`body-sm`,color:`secondary`,children:`More visible surface`})]})]})})}},g={render:function(){return(0,f.jsx)(d,{children:(0,f.jsxs)(`div`,{className:`grid gap-4`,children:[(0,f.jsx)(a,{blur:`none`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`None`})}),(0,f.jsx)(a,{blur:`sm`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`SM`})}),(0,f.jsx)(a,{blur:`sm2`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`SM2`})}),(0,f.jsx)(a,{blur:`md`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`MD`})}),(0,f.jsx)(a,{blur:`lg`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`LG`})}),(0,f.jsx)(a,{blur:`xl`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`XL`})}),(0,f.jsx)(a,{blur:`2xl`,intensity:`medium`,className:`w-full p-5`,children:(0,f.jsx)(n,{variant:`heading-sm`,children:`2XL`})})]})})}},_={parameters:{docs:{source:{code:`<div className="grid gap-4">
  <GlassCard borderIntensity="low">
    Low border
  </GlassCard>

  <GlassCard borderIntensity="medium">
    Medium border
  </GlassCard>

  <GlassCard borderIntensity="high">
    High border
  </GlassCard>
</div>`}}},render:function(){return(0,f.jsx)(d,{children:(0,f.jsxs)(`div`,{className:`grid gap-4`,children:[(0,f.jsx)(a,{borderIntensity:`low`,className:`w-full p-4`,children:(0,f.jsx)(n,{variant:`body-sm`,children:`Low border`})}),(0,f.jsx)(a,{borderIntensity:`medium`,className:`w-full p-4`,children:(0,f.jsx)(n,{variant:`body-sm`,children:`Medium border`})}),(0,f.jsx)(a,{borderIntensity:`high`,className:`w-full p-4`,children:(0,f.jsx)(n,{variant:`body-sm`,children:`High border`})})]})})}},v={args:{saturate:!1},parameters:{docs:{source:{code:`<GlassCard saturate={false}>
  Content
</GlassCard>`}}},render:function(e){return(0,f.jsx)(d,{children:(0,f.jsx)(a,l(s({},e),{children:(0,f.jsx)(u,{})}))})}},y={parameters:{docs:{source:{code:`<GlassCard className="grid gap-3">
  <Text as="h3" variant="heading-sm">
    Settings panel
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    Use GlassCard for floating panels and elevated surfaces.
  </Text>
</GlassCard>`}}},render:function(){return(0,f.jsx)(d,{children:(0,f.jsxs)(a,{className:`grid gap-3`,children:[(0,f.jsx)(n,{as:`h3`,variant:`heading-sm`,children:`Settings panel`}),(0,f.jsx)(n,{as:`p`,variant:`body-sm`,color:`secondary`,children:`Use GlassCard for floating panels and elevated surfaces.`})]})})}},b={parameters:{docs:{description:{story:`GlassCard has default rounded corners and padding. Use className only for intentional layout overrides.`},source:{code:`<GlassCard className="rounded-xl p-4">
  Compact glass card
</GlassCard>`}}},render:function(){return(0,f.jsx)(d,{children:(0,f.jsx)(a,{className:`rounded-xl p-4`,children:(0,f.jsx)(n,{variant:`body-sm`,children:`Compact glass card`})})})}},m.parameters=l(s({},m.parameters),{docs:l(s({},m.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<GlassCard>
  <Text as="h3" variant="heading-sm">
    Glass card
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    This surface is useful for panels, navigation containers, overlays, and floating UI.
  </Text>
</GlassCard>\`
      }
    }
  },
  render: args => <DemoBackground>
      <GlassCard {...args}>
        <CardContent />
      </GlassCard>
    </DemoBackground>
}`},m.parameters?.docs?.source)})}),h.parameters=l(s({},h.parameters),{docs:l(s({},h.parameters?.docs),{source:s({originalSource:`{
  render: () => <DemoBackground>
      <div className="grid gap-4">
        <GlassCard intensity="low" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">Low</Text>
          <Text variant="body-sm" color="secondary">
            More transparent
          </Text>
        </GlassCard>

        <GlassCard intensity="medium" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">Medium</Text>
          <Text variant="body-sm" color="secondary">
            Default balance
          </Text>
        </GlassCard>

        <GlassCard intensity="high" blur="sm2" className="w-full p-5">
          <Text variant="heading-sm">High</Text>
          <Text variant="body-sm" color="secondary">
            More visible surface
          </Text>
        </GlassCard>
      </div>
    </DemoBackground>
}`},h.parameters?.docs?.source)})}),g.parameters=l(s({},g.parameters),{docs:l(s({},g.parameters?.docs),{source:s({originalSource:`{
  render: () => <DemoBackground>
      <div className="grid gap-4">
        <GlassCard blur="none" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">None</Text>
        </GlassCard>

        <GlassCard blur="sm" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">SM</Text>
        </GlassCard>

        <GlassCard blur="sm2" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">SM2</Text>
        </GlassCard>

        <GlassCard blur="md" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">MD</Text>
        </GlassCard>

        <GlassCard blur="lg" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">LG</Text>
        </GlassCard>

        <GlassCard blur="xl" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">XL</Text>
        </GlassCard>

        <GlassCard blur="2xl" intensity="medium" className="w-full p-5">
          <Text variant="heading-sm">2XL</Text>
        </GlassCard>
      </div>
    </DemoBackground>
}`},g.parameters?.docs?.source)})}),_.parameters=l(s({},_.parameters),{docs:l(s({},_.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<div className="grid gap-4">
  <GlassCard borderIntensity="low">
    Low border
  </GlassCard>

  <GlassCard borderIntensity="medium">
    Medium border
  </GlassCard>

  <GlassCard borderIntensity="high">
    High border
  </GlassCard>
</div>\`
      }
    }
  },
  render: () => <DemoBackground>
      <div className="grid gap-4">
        <GlassCard borderIntensity="low" className="w-full p-4">
          <Text variant="body-sm">Low border</Text>
        </GlassCard>

        <GlassCard borderIntensity="medium" className="w-full p-4">
          <Text variant="body-sm">Medium border</Text>
        </GlassCard>

        <GlassCard borderIntensity="high" className="w-full p-4">
          <Text variant="body-sm">High border</Text>
        </GlassCard>
      </div>
    </DemoBackground>
}`},_.parameters?.docs?.source)})}),v.parameters=l(s({},v.parameters),{docs:l(s({},v.parameters?.docs),{source:s({originalSource:`{
  args: {
    saturate: false
  },
  parameters: {
    docs: {
      source: {
        code: \`<GlassCard saturate={false}>
  Content
</GlassCard>\`
      }
    }
  },
  render: args => <DemoBackground>
      <GlassCard {...args}>
        <CardContent />
      </GlassCard>
    </DemoBackground>
}`},v.parameters?.docs?.source)})}),y.parameters=l(s({},y.parameters),{docs:l(s({},y.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      source: {
        code: \`<GlassCard className="grid gap-3">
  <Text as="h3" variant="heading-sm">
    Settings panel
  </Text>

  <Text as="p" variant="body-sm" color="secondary">
    Use GlassCard for floating panels and elevated surfaces.
  </Text>
</GlassCard>\`
      }
    }
  },
  render: () => <DemoBackground>
      <GlassCard className="grid gap-3">
        <Text as="h3" variant="heading-sm">
          Settings panel
        </Text>

        <Text as="p" variant="body-sm" color="secondary">
          Use GlassCard for floating panels and elevated surfaces.
        </Text>
      </GlassCard>
    </DemoBackground>
}`},y.parameters?.docs?.source)})}),b.parameters=l(s({},b.parameters),{docs:l(s({},b.parameters?.docs),{source:s({originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'GlassCard has default rounded corners and padding. Use className only for intentional layout overrides.'
      },
      source: {
        code: \`<GlassCard className="rounded-xl p-4">
  Compact glass card
</GlassCard>\`
      }
    }
  },
  render: () => <DemoBackground>
      <GlassCard className="rounded-xl p-4">
        <Text variant="body-sm">Compact glass card</Text>
      </GlassCard>
    </DemoBackground>
}`},b.parameters?.docs?.source)})}),x=[`Default`,`Intensities`,`BlurLevels`,`Borders`,`WithoutSaturation`,`AsPanel`,`CompactOverride`]}))();export{y as AsPanel,g as BlurLevels,_ as Borders,b as CompactOverride,m as Default,h as Intensities,v as WithoutSaturation,x as __namedExportsOrder,p as default};