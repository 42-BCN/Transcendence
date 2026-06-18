'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { IconButton } from '@components';
import { Icon } from '@components/primitives/icon';

type SkillData = { name: string; details: string[] };

const PLAYABLE_CLASS_KEYS = ['assassin', 'paladin', 'alchemist', 'mage'] as const;
const ENEMY_CLASS_KEYS = ['drone', 'tracker', 'centurion', 'jaeger'] as const;

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

function Skill({ name, details }: SkillData) {
  return (
    <div className="mb-3 pl-3 border-l-2 border-border-primary">
      <p className="font-semibold text-text-primary text-sm">{name}</p>
      <ul className="mt-1 space-y-0.5">
        {details.map((detail, index) => (
          <li key={index} className="text-xs text-text-secondary">
            {detail}
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
  skills?: SkillData[];
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-bg-secondary border border-border-primary">
      <p className="font-bold text-text-primary mb-1">{name}</p>
      <ul className="mb-2 space-y-0.5">
        {stats.map((stat, index) => (
          <li key={index} className="text-xs text-text-secondary">
            {stat}
          </li>
        ))}
      </ul>
      {skills?.map((skill) => (
        <Skill key={skill.name} name={skill.name} details={skill.details} />
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
  skills: SkillData[];
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-bg-secondary border border-border-primary">
      <p className="font-bold text-text-primary">{name}</p>
      <p className="text-xs text-text-secondary italic mb-2">{role}</p>
      <ul className="mb-2 space-y-0.5">
        {stats.map((stat, index) => (
          <li key={index} className="text-xs text-text-secondary">
            {stat}
          </li>
        ))}
      </ul>
      {skills.map((skill) => (
        <Skill key={skill.name} name={skill.name} details={skill.details} />
      ))}
    </div>
  );
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asSkillArray(value: unknown): SkillData[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is SkillData =>
      typeof item === 'object' &&
      item !== null &&
      'name' in item &&
      'details' in item &&
      typeof item.name === 'string' &&
      Array.isArray(item.details),
  );
}

export function GameInstructions() {
  const t = useTranslations('features.game.instructions');
  const [open, setOpen] = useState(false);

  const energyItems = asStringArray(t.raw('objective.energyItems'));
  const loseItems = asStringArray(t.raw('objective.loseItems'));
  const enemyTurnItems = asStringArray(t.raw('turnStructure.enemy.items'));
  const generalRuleItems = asStringArray(t.raw('generalRules.items'));
  const abilitySteps = asStringArray(t.raw('abilities.steps'));

  return (
    <>
      <IconButton
        onPress={() => setOpen(true)}
        icon="help"
        label={t('title')}
        placement="left"
      />

      <ModalOverlay
        isOpen={open}
        onOpenChange={setOpen}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <Modal className="relative w-[min(90vw,780px)] max-h-[85vh] overflow-hidden rounded-2xl border border-border-primary bg-bg-primary shadow-2xl flex flex-col">
          <Dialog className="flex flex-col h-full overflow-hidden" aria-label={t('title')}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary shrink-0">
              <div className="flex items-center gap-2">
                <Icon name="help" className="w-5 h-5 text-text-secondary" />
                <span className="font-bold text-text-primary text-base">{t('title')}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                aria-label={t('close')}
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 text-sm">
              <Section title={t('objective.title')}>
                <p className="text-text-secondary mb-2">
                  {t.rich('objective.intro', {
                    strong: (chunks) => (
                      <strong className="text-text-primary">{chunks}</strong>
                    ),
                  })}
                </p>
                <p className="text-text-secondary mb-1 font-semibold">{t('objective.energyTitle')}</p>
                <ul className="list-disc list-inside text-text-secondary space-y-0.5 mb-3">
                  {energyItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-text-secondary font-semibold mb-1">{t('objective.loseTitle')}</p>
                <ul className="list-disc list-inside text-text-secondary space-y-0.5 mb-3">
                  {loseItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-text-secondary">
                  {t.rich('objective.height', {
                    strong: (chunks) => (
                      <strong className="text-text-primary">{chunks}</strong>
                    ),
                  })}
                </p>
              </Section>

              <Section title={t('turnStructure.title')}>
                <SubSection title={t('turnStructure.planning.title')}>
                  <p className="text-text-secondary mb-1">{t('turnStructure.planning.body')}</p>
                </SubSection>
                <SubSection title={t('turnStructure.execution.title')}>
                  <p className="text-text-secondary">{t('turnStructure.execution.body')}</p>
                </SubSection>
                <SubSection title={t('turnStructure.enemy.title')}>
                  <ul className="list-disc list-inside text-text-secondary space-y-0.5">
                    {enemyTurnItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </SubSection>
              </Section>

              <Section title={t('generalRules.title')}>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {generalRuleItems.map((item, index) => (
                    <li key={index}>
                      {index === 1 ? (
                        <strong className="text-text-primary">{t('generalRules.diceAction')}</strong>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title={t('abilities.title')}>
                <ol className="list-decimal list-inside text-text-secondary space-y-1">
                  {abilitySteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </Section>

              <Section title={t('playableClasses.title')}>
                {PLAYABLE_CLASS_KEYS.map((classKey) => {
                  const prefix = `playableClasses.${classKey}` as const;

                  return (
                    <ClassCard
                      key={classKey}
                      name={t(`${prefix}.name`)}
                      role={t(`${prefix}.role`)}
                      stats={asStringArray(t.raw(`${prefix}.stats`))}
                      skills={asSkillArray(t.raw(`${prefix}.skills`))}
                    />
                  );
                })}
              </Section>

              <Section title={t('enemyClasses.title')}>
                {ENEMY_CLASS_KEYS.map((enemyKey) => {
                  const prefix = `enemyClasses.${enemyKey}` as const;
                  const skills = t.has(`${prefix}.skills`)
                    ? asSkillArray(t.raw(`${prefix}.skills`))
                    : undefined;

                  return (
                    <EnemyCard
                      key={enemyKey}
                      name={t(`${prefix}.name`)}
                      stats={asStringArray(t.raw(`${prefix}.stats`))}
                      skills={skills}
                    />
                  );
                })}
              </Section>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
