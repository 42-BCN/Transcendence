import { GlassCard } from '@components/primitives/glass-card';
import { Button } from '@components/controls/button';

export default function GlassCardAnimatedV2Page() {
  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* ⚠️ ESTILO CSS INLINE PARA ANIMACIONES REALES SIN TOCAR CONFIGS ⚠️ */}
      <style>{`
        @keyframes floatBall1 {
          0% { transform: translate(-200px, -200px) scale(0.9); }
          100% { transform: translate(300px, 300px) scale(1.1); }
        }
        @keyframes floatBall2 {
          0% { transform: translate(400px, 200px) scale(1); }
          100% { transform: translate(-300px, -200px) scale(0.8); }
        }
        @keyframes floatBall3 {
          0% { transform: translate(-100px, 400px) scale(1.1); }
          100% { transform: translate(100px, -300px) scale(0.9); }
        }
      `}</style>

      {/* Esferas de Colores con MOVIMIENTO REAL (Entran y salen) */}
      <div
        className="absolute w-[200px] h-[200px] bg-red-500 rounded-full filter blur-[40px] opacity-80"
        style={{ animation: 'floatBall1 10s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute w-[220px] h-[220px] bg-blue-600 rounded-full filter blur-[50px] opacity-70"
        style={{ animation: 'floatBall2 12s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute w-[180px] h-[180px] bg-yellow-400 rounded-full filter blur-[35px] opacity-85"
        style={{ animation: 'floatBall3 8s infinite alternate ease-in-out' }}
      />

      {/* Grid sutil para dar textura al fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <GlassCard className="w-96 z-10" intensity="medium" blur="xl">
        <h3 className="text-2xl font-bold text-white mb-2">Reflexión Dinámica</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          Aquí las esferas{' '}
          <span className="text-yellow-400 font-semibold">se mueven detrás del cristal</span>.
          <br />
          El color fluye y refracta con suavidad al cruzar los bordes.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Button className="w-full bg-white text-slate-950 hover:bg-white/90 rounded-none">
            Opción 1
          </Button>
          <Button className="w-full bg-white text-slate-950 hover:bg-white/90 rounded-2xl">
            Opción 2
          </Button>
          <Button className="w-full bg-white text-slate-950 hover:bg-white/90 rounded-full">
            Opción 3
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
