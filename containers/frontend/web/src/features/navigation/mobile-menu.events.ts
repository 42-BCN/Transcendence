export const MOBILE_MENU_OPEN_EVENT = 'navigation:mobile-menu-open';
export const MOBILE_MENU_CLOSE_EVENT = 'navigation:mobile-menu-close';

export function dispatchMobileMenuOpenEvent() {
  window.dispatchEvent(new Event(MOBILE_MENU_OPEN_EVENT));
}

export function dispatchMobileMenuCloseEvent() {
  window.dispatchEvent(new Event(MOBILE_MENU_CLOSE_EVENT));
}
