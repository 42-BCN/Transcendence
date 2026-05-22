export const MOBILE_MENU_OPEN_EVENT = 'navigation:mobile-menu-open';

export function dispatchMobileMenuOpenEvent() {
  window.dispatchEvent(new Event(MOBILE_MENU_OPEN_EVENT));
}
