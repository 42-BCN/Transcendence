'use client';
import { Button } from '@components/controls/button';
import { Button as AButton, Input as Ainput } from 'react-aria-components';
import { ComponentViewer } from '@components/primitives/componentViewer';
import { Input } from '@components/controls/input';
import { useTranslations } from 'next-intl';

export default function UiPage() {
  const t = useTranslations('pages.ui.index');

  return (
    <>
      <main className="p-5">
        <h1 className="text-2xl font-semibold mb-2">{t('controlComponents')}</h1>
        <h2 className="text-l font-semibold">{t('buttons')}</h2>
        <div className="grid grid-cols-[150px_150px_150px] gap-[10px] my-2.5">
          <ComponentViewer title={t('viewerTitles.buttonPrimitive')}>
            <button>{t('sampleButtonText')}</button>
          </ComponentViewer>
          <ComponentViewer title={t('viewerTitles.ariaButton')}>
            <AButton>{t('sampleButtonText')}</AButton>
          </ComponentViewer>
          <ComponentViewer title={t('viewerTitles.uiButton')}>
            <Button>{t('sampleButtonText')}</Button>
          </ComponentViewer>
        </div>
        <h2 className="text-l font-semibold mt-3">{t('input')}</h2>
        <div className="grid grid-cols-[150px_150px_150px] gap-[10px] my-2.5">
          <ComponentViewer title={t('viewerTitles.inputPrimitive')}>
            <input type="text" />
          </ComponentViewer>
          <ComponentViewer title={t('viewerTitles.ariaInput')}>
            <Ainput />
          </ComponentViewer>
          <ComponentViewer title={t('viewerTitles.uiInput')}>
            <Input />
          </ComponentViewer>
        </div>
      </main>
    </>
  );
}
