import { GlassCard } from '@components/primitives/glass-card';
import { Button } from '@components/controls/button';
import { getTranslations } from 'next-intl/server';

export default async function GlassCardAnimatedV3Page() {
  const t = await getTranslations('pages.ui.glassCardAnimatedV3');

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* INLINE CSS STYLE FOR REAL ANIMATIONS WITHOUT TOUCHING CONFIGS */}
      <style>{`
        @keyframes floatBall1 {
          0% { transform: translate(-250px, -200px) scale(0.9); }
          100% { transform: translate(350px, 250px) scale(1.1); }
        }
        @keyframes floatBall2 {
          0% { transform: translate(350px, 180px) scale(1); }
          100% { transform: translate(-350px, -180px) scale(0.8); }
        }
        @keyframes floatBall3 {
          0% { transform: translate(-100px, 350px) scale(1.1); }
          100% { transform: translate(150px, -250px) scale(0.9); }
        }
      `}</style>

      {/* SOLID spheres with REAL MOTION (no pre-blur) */}
      <div
        className="absolute w-[180px] h-[180px] bg-red-500 rounded-full opacity-90 shadow-lg"
        style={{ animation: 'floatBall1 10s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-90 shadow-lg"
        style={{ animation: 'floatBall2 12s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute w-[160px] h-[160px] bg-yellow-400 rounded-full opacity-95 shadow-lg"
        style={{ animation: 'floatBall3 8s infinite alternate ease-in-out' }}
      />

      {/* Subtle grid to give texture to the background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <GlassCard className="w-96 z-10" saturate={true} intensity="medium" blur="xl">
        <h3 className="text-2xl font-bold text-white mb-2">{t('title')}</h3>
        <div className="text-white/80 text-sm leading-relaxed mb-4">
          {t('descriptionPrefix')}{' '}
          <span className="text-yellow-400 font-semibold">{t('highlight')}</span>.{' '}
          {t('descriptionMiddle')}
          <br />
          {t('nestedPrefix')} <GlassCard />
        </div>
        <Button variant="primary" w="full">
          {t('activate')}
        </Button>
      </GlassCard>
    </div>
  );
}
