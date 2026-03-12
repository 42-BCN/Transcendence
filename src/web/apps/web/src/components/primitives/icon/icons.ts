import {
  X,
  User,
  Settings,
  Home,
  Gamepad2,
  MessageSquare,
  Wrench,
  LogIn,
  Box,
  PanelRightClose,
  PanelLeftClose,
} from 'lucide-react';

export const icons = {
  close: X,
  user: User,
  settings: Settings,
  home: Home,
  gamepad: Gamepad2,
  messages: MessageSquare,
  ui: Wrench,
  logIn: LogIn,
  app: Box,
  expand: PanelRightClose,
  collapse: PanelLeftClose,
};

export type IconName = keyof typeof icons;
