import { protectedMeAction } from '../auth/me/protected.action';
import { getMainNavItems } from './navigation.config';
import { NavigationClient } from './navigation.client';

export async function NavigationServer({ locale }: { locale: string }) {
  const me = await protectedMeAction();
  const mainNavItems = getMainNavItems(me);
  return <NavigationClient locale={locale} mainNavItems={mainNavItems} isAuthenticated={me} />;
}
