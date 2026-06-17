'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { IconButton } from '@components';
import { Icon } from '@components/primitives/icon';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-text-primary border-b border-border-primary pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Skill({
  name,
  details,
}: {
  name: string;
  details: string[];
}) {
  return (
    <div className="mb-3 pl-3 border-l-2 border-border-primary">
      <p className="font-semibold text-text-primary text-sm">{name}</p>
      <ul className="mt-1 space-y-0.5">
        {details.map((d, i) => (
          <li key={i} className="text-xs text-text-secondary">
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EnemyCard({
  name,
  stats,
  skills,
}: {
  name: string;
  stats: string[];
  skills?: { name: string; details: string[] }[];
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-bg-secondary/40 border border-border-primary">
      <p className="font-bold text-text-primary mb-1">{name}</p>
      <ul className="mb-2 space-y-0.5">
        {stats.map((s, i) => (
          <li key={i} className="text-xs text-text-secondary">
            {s}
          </li>
        ))}
      </ul>
      {skills?.map((sk) => (
        <Skill key={sk.name} name={sk.name} details={sk.details} />
      ))}
    </div>
  );
}

function ClassCard({
  name,
  stats,
  role,
  skills,
}: {
  name: string;
  stats: string[];
  role: string;
  skills: { name: string; details: string[] }[];
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-bg-secondary/40 border border-border-primary">
      <p className="font-bold text-text-primary">{name}</p>
      <p className="text-xs text-text-secondary italic mb-2">{role}</p>
      <ul className="mb-2 space-y-0.5">
        {stats.map((s, i) => (
          <li key={i} className="text-xs text-text-secondary">
            {s}
          </li>
        ))}
      </ul>
      {skills.map((sk) => (
        <Skill key={sk.name} name={sk.name} details={sk.details} />
      ))}
    </div>
  );
}

export function GameInstructions({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onPress={() => setOpen(true)}
        icon="help"
        label={label}
        placement="left"
      />

      <ModalOverlay
        isOpen={open}
        onOpenChange={setOpen}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <Modal className="relative w-[min(90vw,780px)] max-h-[85vh] overflow-hidden rounded-2xl border border-border-primary bg-bg-primary/90 backdrop-blur-md shadow-2xl flex flex-col">
          <Dialog className="flex flex-col h-full overflow-hidden" aria-label={label}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary shrink-0">
              <div className="flex items-center gap-2">
                <Icon name="help" className="w-5 h-5 text-text-secondary" />
                <span className="font-bold text-text-primary text-base">Instrucciones del juego</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                aria-label="Cerrar"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 py-5 text-sm">

              {/* --- OBJETIVO --- */}
              <Section title="Objetivo">
                <p className="text-text-secondary mb-2">
                  Sois un escuadrón cooperativo de 4 personajes. Debéis destruir el{' '}
                  <strong className="text-text-primary">Generador enemigo</strong> antes de que su
                  energía llegue al 100%.
                </p>
                <p className="text-text-secondary mb-1 font-semibold">La energía sube al final de cada ronda:</p>
                <ul className="list-disc list-inside text-text-secondary space-y-0.5 mb-3">
                  <li>+5% por el generador.</li>
                  <li>+3% por cada enemigo élite.</li>
                  <li>+1% por cada enemigo común.</li>
                </ul>
                <p className="text-text-secondary font-semibold mb-1">Perdéis si:</p>
                <ul className="list-disc list-inside text-text-secondary space-y-0.5 mb-3">
                  <li>el generador llega al 100%, o</li>
                  <li>mueren los 4 personajes del escuadrón.</li>
                </ul>
                <p className="text-text-secondary">
                  La <strong className="text-text-primary">altura</strong> afecta a movimiento, alcance, empujes y ataques que solo funcionan arriba o abajo.
                </p>
              </Section>

              {/* --- ESTRUCTURA DEL TURNO --- */}
              <Section title="Estructura del turno">
                <SubSection title="A. Planificación conjunta (120 seg.)">
                  <p className="text-text-secondary mb-1">Los jugadores deciden qué hace cada personaje, qué habilidad usa, a qué objetivo apunta y qué enemigo atacará a cada uno. Todos deben estar de acuerdo para continuar.</p>
                </SubSection>
                <SubSection title="B. Ejecución">
                  <p className="text-text-secondary">El juego ejecuta automáticamente el plan.</p>
                </SubSection>
                <SubSection title="C. Turno enemigo">
                  <ul className="list-disc list-inside text-text-secondary space-y-0.5">
                    <li>Sube la energía del generador.</li>
                    <li>Los enemigos usan sus dados y acciones.</li>
                    <li>La interfaz puede mostrar pistas de objetivo.</li>
                  </ul>
                </SubSection>
              </Section>

              {/* --- REGLAS GENERALES --- */}
              <Section title="Reglas generales">
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  <li>Cada personaje y enemigo tiene su propio set de dados.</li>
                  <li><strong className="text-text-primary">Cada acción consume 1 dado.</strong></li>
                  <li>En un turno: moverse <em>o</em> usar habilidades (no ambos).</li>
                  <li>Movimiento: una vez por turno, hasta el valor más alto de los dados.</li>
                  <li>Habilidades: se aplican si se cumple la condición de la tirada.</li>
                  <li>Las unidades con 0 PV mueren.</li>
                </ul>
              </Section>

              {/* --- USO DE HABILIDADES --- */}
              <Section title="Cómo usar las habilidades">
                <ol className="list-decimal list-inside text-text-secondary space-y-1">
                  <li>Selecciona tu personaje.</li>
                  <li>Elige una habilidad.</li>
                  <li>Pasa el ratón sobre un dado para ver el rango o efecto.</li>
                  <li>Selecciona la casilla u objetivo.</li>
                  <li>Confirma dentro de la planificación.</li>
                </ol>
              </Section>

              {/* --- CLASES JUGABLES --- */}
              <Section title="Clases jugables">
                <ClassCard
                  name="Asesino"
                  stats={['PV: 13', 'Dados: 4d4 + 1d8']}
                  role="Daño rápido, empujes y control."
                  skills={[
                    { name: 'Puñalada', details: ['melee · sin CD · daño: resultado / 2 · cond: par'] },
                    { name: 'Tiro de navajas', details: ['rango lineal · daño: 2 · sin CD · cond: > 3'] },
                    { name: 'Patada', details: ['melee · sin CD · daño: 1 · empuja 1 casilla · cond: impar', 'el empuje se aplica aunque falle'] },
                    { name: 'Atar', details: ['melee · sin CD · elimina 1 dado del enemigo · cond: > 1', 'no se puede aplicar varias veces al mismo enemigo'] },
                  ]}
                />
                <ClassCard
                  name="Paladín"
                  stats={['PV: 16', 'Dados: 4d6']}
                  role="Tanque y protector."
                  skills={[
                    { name: 'Estocada', details: ['rango 1 línea recta · CD 1 · daño: 2 · cond: > 3'] },
                    { name: 'Defender', details: ['rango 2 · área circular, objetivo único · sin CD', 'reduce a la mitad las próximas x instancias de daño · cond: > 1'] },
                    { name: 'Golpe de escudo', details: ['AOE en cruz · CD 2 · daño: 4x · cond: > 5', 'empuja 1 casilla a los enemigos de los extremos (aunque falle)'] },
                    { name: 'Corte vertical', details: ['melee · CD 1 · cubre todos los niveles', 'daño: 2x + 2 si distinto nivel · cond: > 3'] },
                  ]}
                />
                <ClassCard
                  name="Alquimista"
                  stats={['PV: 10', 'Dados: 1d6 + 1d8 + 1d10']}
                  role="Apoyo, control de zona y debilitación."
                  skills={[
                    { name: 'Dopaje', details: ['rango 2 en línea · CD 1 · puede aplicarse a sí mismo', 'dona mitad del dado como bonificación a la próxima acción del objetivo'] },
                    { name: 'Matraz de vacío', details: ['rango circular 2 · centro hasta 3 casillas · AOE · CD 2', 'daño: (resultado - 2) / 2 · absorbe hacia el centro · cond: > 5'] },
                    { name: 'Matraz bombástico', details: ['rango circular 1 en cruz · centro hasta 3 casillas · CD 2', 'daño: (resultado - 2) / 2 · empuja diag. hacia arriba · cond: > 5'] },
                    { name: 'Oxidación', details: ['rango 1 circular · sin CD · reduce armadura del objetivo en x · cond: > 2'] },
                  ]}
                />
                <ClassCard
                  name="Mago"
                  stats={['PV: 8', 'Dados: 1d4 + 1d8 + 1d12']}
                  role="Daño en área, fuego y control de niveles."
                  skills={[
                    {
                      name: 'Aliento de fuego', details: [
                        'rango 3 · AOE · CD 2 · aplica quemadura 2 turnos (1 daño/turno) · cond: > 3',
                        'melee: daño = resultado / 3 + 2',
                        'media: daño = resultado / 4 + 1 (distinto nivel)',
                        'lejana: daño = resultado / 4 - 2 + 1 (distinto nivel)',
                      ]
                    },
                    { name: 'Cometa azur', details: ['rango infinito mismo plano · CD 3 · daño: resultado / 2 + 2 · cond: > 3'] },
                    { name: 'Pequeño meteoro', details: ['rango 4 circular · CD 1 · solo zona superior', 'daño: x + 2 si distinto nivel · cond: > 2'] },
                    { name: 'Espinas emergentes', details: ['rango 4 circular · CD 1 · solo zona inferior', 'daño: x + 2 si distinto nivel · cond: > 2'] },
                  ]}
                />
              </Section>

              {/* --- ENEMIGOS --- */}
              <Section title="Clases enemigas">
                <EnemyCard
                  name="Dron"
                  stats={['PV: 3 · Dados: 3d4', 'ataque melee · daño: 1 · cond: x > 1']}
                />
                <EnemyCard
                  name="Rastreador"
                  stats={['PV: 4 · Dados: 2d4 + 1d6', 'ataque melee · daño: 1 · cond: x > 1']}
                />
                <EnemyCard
                  name="Centurión (élite)"
                  stats={['PV: 20 · Escudo: 2 · Dados: d6 + 2d8']}
                  skills={[
                    { name: 'Embestida', details: ['rango línea 3 · sin CD · se mueve 3 casillas · empuja perpendicular', 'daño: resultado / 2 · cond: > 4 (empuje igualmente se aplica)'] },
                    { name: 'Mini bomba atómica', details: ['rango circular 2 · CD 2 · se daña 4 a sí misma', 'daño: resultado / 2 + 2 · cond: > 3'] },
                  ]}
                />
                <EnemyCard
                  name="Jaeger (élite)"
                  stats={['PV: 10 · Escudo: 1 · Dados: 2d6 + 1d10']}
                  skills={[
                    { name: 'Empujón', details: ['melee · sin CD · empuja 2 casillas · daño: x · cond: x > 3'] },
                    { name: 'Disparo de impacto', details: ['rango circular 6 · CD 1 · ignora barreras · al de más vida (empate: más lejano)', 'daño: resultado / 2 · cond: > 5'] },
                  ]}
                />
              </Section>

            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
