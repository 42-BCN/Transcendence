export const gameRoomTestStyles = {
  wrapper: 'h-full min-h-0',
  header: 'px-4 pb-2 pt-10 lg:px-6 lg:pt-8',
  content: 'px-4 pb-6 lg:px-6',
  footer: 'px-4 pb-6 pt-2 lg:px-6',
  sections: 'flex flex-col gap-4',
  avatarSection: 'min-w-0',
  avatarScroll: 'min-w-0 overflow-x-auto overflow-y-hidden',
  avatarRow: 'flex w-max min-w-full gap-4 py-1',
  avatarItem: 'flex w-20 min-w-20 shrink-0 flex-col items-center gap-1',
  invitationAvatarItem: 'flex w-20 min-w-20 shrink-0 flex-col items-center gap-1 opacity-50',
  avatarName: 'block w-full min-w-0 truncate text-center',
} as const;
