import { getTranslations } from 'next-intl/server';
import { protectedMeProfileAction } from './profile.action';

// TODO WIP
export async function Profile() {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();
  return !data.ok ? (
    <div className="p-[100px]">{t('fail')}</div>
  ) : (
    <div className="p-[100px]">
      <h3>{t('userId')}</h3>
      <p>{data.data.id}</p>
      <h3>{t('username')}</h3>
      <p>{data.data.username}</p>
    </div>
  );
}
