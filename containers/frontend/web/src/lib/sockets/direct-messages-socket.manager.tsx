'use client';

import { useEffect } from 'react';
import { envPublic } from '@/lib/config/env.public';

import { ensureChatSessionIdentity } from './socket';
import {
  directMessageSocketEvents,
  type DirectMessage,
  type DirectMessageError,
  type DirectMessageHistory,
  type DirectMessageRead,
} from '@/contracts/sockets/direct-messages/direct-messages.schema';

import { directMessagesSocket } from './direct-messages-socket.client';

type DirectMessagesSocketManagerProps = {
  friendUserId: string;
  onDirectMessage: (message: DirectMessage) => void;
  onDirectHistory: (history: DirectMessageHistory) => void;
  onDirectRead: (payload: DirectMessageRead) => void;
  onDirectError: (error: DirectMessageError) => void;
};

export function DirectMessagesSocketManager({
  friendUserId,
  onDirectMessage,
  onDirectHistory,
  onDirectRead,
  onDirectError,
}: DirectMessagesSocketManagerProps) {
  useEffect(() => {
    const handleConnect = () => {
      envPublic.processEnv === 'development' &&
        console.log('✅ Connected to direct-messages socket server', directMessagesSocket.id);
    };

    const handleConnectError = (error: Error) => {
      envPublic.processEnv === 'development' &&
        console.error('❌ Direct messages socket connect error:', error);
    };

    const handleDisconnect = (reason: string) => {
      envPublic.processEnv === 'development' &&
        console.log('⚠️ Disconnected from direct-messages socket server:', reason);
    };

    const handleMessage = (message: DirectMessage) => {
      envPublic.processEnv === 'development' && console.log('📨 Received message:', message);
      onDirectMessage(message);
    };

    const handleHistory = (history: DirectMessageHistory) => {
      envPublic.processEnv === 'development' &&
        console.log('📜 Received history:', history.length, 'messages');
      onDirectHistory(history);
    };

    const handleRead = (payload: DirectMessageRead) => {
      envPublic.processEnv === 'development' && console.log('👀 Received read state:', payload);
      onDirectRead(payload);
    };

    const handleError = (error: DirectMessageError) => {
      envPublic.processEnv === 'development' && console.error('⚠️ Direct message error:', error);
      onDirectError(error);
    };

    const reservedListeners = [
      ['connect', handleConnect],
      ['connect_error', handleConnectError],
      ['disconnect', handleDisconnect],
    ] as const;

    const messageListeners = [
      [directMessageSocketEvents.message, handleMessage],
      [directMessageSocketEvents.history, handleHistory],
      [directMessageSocketEvents.read, handleRead],
      [directMessageSocketEvents.error, handleError],
    ] as const;

    let isMounted = true;

    directMessagesSocket.auth = { friendUserId };
    reservedListeners.forEach(([event, handler]) => directMessagesSocket.on(event, handler));
    messageListeners.forEach(([event, handler]) => directMessagesSocket.on(event, handler));

    void ensureChatSessionIdentity()
      .catch((error) => {
        envPublic.processEnv === 'development' &&
          console.error('Failed to initialize direct-messages session identity', error);
      })
      .finally(() => {
        if (isMounted) {
          directMessagesSocket.connect();
        }
      });

    return () => {
      isMounted = false;
      reservedListeners.forEach(([event, handler]) => directMessagesSocket.off(event, handler));
      messageListeners.forEach(([event, handler]) => directMessagesSocket.off(event, handler));
      directMessagesSocket.disconnect();
    };
  }, [friendUserId, onDirectMessage, onDirectHistory, onDirectRead, onDirectError]);

  return null;
}
