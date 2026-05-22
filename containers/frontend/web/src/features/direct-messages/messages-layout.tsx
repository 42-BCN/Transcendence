'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';
import { IconButton } from '@components';
import { useSocialStore } from '@/providers/social-provider';
import { MessagesList } from './messages-list';
import { MOBILE_MENU_OPEN_EVENT } from '../navigation/mobile-menu.events';
import { messagesLayoutStyles } from './messages-layout.styles';

type MessagesLayoutProps = {
  friends: FriendPublic[];
  selectedUsername?: string;
  children: ReactNode;
};

export function MessagesLayout({ friends, selectedUsername, children }: MessagesLayoutProps) {
  const liveFriends = useSocialStore((state) => state.friends);
  const resolvedFriends = liveFriends.length > 0 ? liveFriends : friends;
  const [isListVisible, setIsListVisible] = useState(!selectedUsername);
  const pathname = usePathname();
  const t = useTranslations('features.directMessages');

  useEffect(() => {
    setIsListVisible(!selectedUsername);
  }, [pathname, selectedUsername]);

  useEffect(() => {
    const closeMessagesList = () => {
      setIsListVisible(false);
    };

    window.addEventListener(MOBILE_MENU_OPEN_EVENT, closeMessagesList);

    return () => {
      window.removeEventListener(MOBILE_MENU_OPEN_EVENT, closeMessagesList);
    };
  }, []);

  return (
    <div className={messagesLayoutStyles.root}>
      {resolvedFriends.length > 0 && (
        <IconButton
          onPress={() => setIsListVisible((visible) => !visible)}
          icon={isListVisible ? 'close' : 'messages'}
          label={isListVisible ? t('closeList') : t('openList')}
          className={messagesLayoutStyles.toggleButton}
        />
      )}

      <div className={messagesLayoutStyles.overlay}>
        {resolvedFriends.length > 0 && (
          <button
            type="button"
            aria-label={t('closeList')}
            className={messagesLayoutStyles.backdrop(isListVisible)}
            onClick={() => setIsListVisible(false)}
          />
        )}

        <div className={messagesLayoutStyles.panel(isListVisible)}>
          <div className={messagesLayoutStyles.panelInner}>
            <MessagesList friends={resolvedFriends} selectedUsername={selectedUsername} />
          </div>
        </div>
      </div>

      <div className={messagesLayoutStyles.content}>{children}</div>
    </div>
  );
}
