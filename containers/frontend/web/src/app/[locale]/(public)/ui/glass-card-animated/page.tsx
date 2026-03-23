import { GlassCard } from '@components/primitives/glass-card';
import { Button } from '@components/controls/button';

export default function GlassCardAnimatedPage() {
  return (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Colored Spheres (Glow Ambient) */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600 rounded-full filter blur-[80px] opacity-40 animate-pulse [animation-duration:4s]" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-fuchsia-600 rounded-full filter blur-[100px] opacity-30 animate-pulse [animation-duration:6s] [animation-delay:1000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-cyan-400 rounded-full filter blur-[60px] opacity-25 animate-pulse [animation-duration:5s] [animation-delay:500ms]" />

      {/* Subtle grid to give texture to the background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <GlassCard className="w-96 z-10" saturate={true} intensity="medium" blur="xl">
        <h3 className="text-2xl font-bold text-white mb-2">Probando la saturación</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          Esta tarjeta utiliza{' '}
          <span className="text-cyan-400 font-semibold">backdrop-saturate</span>. Las esferas de luz
          cobran más vida y color al pasar detrás del cristal.
        </p>
        <Button className="w-full bg-white text-slate-950 hover:bg-white/90 rounded-full">
          Activar
        </Button>
      </GlassCard>
    </div>
  );
}
