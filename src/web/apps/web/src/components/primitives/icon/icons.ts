import { X, User, Settings, Home, Gamepad2, MessageSquare } from 'lucide-react';

export const icons = {
  close: X,
  user: User,
  settings: Settings,
  home: Home,
  gamepad: Gamepad2,
  messages: MessageSquare,
};

export type IconName = keyof typeof icons;
