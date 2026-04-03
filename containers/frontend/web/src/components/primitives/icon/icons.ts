import {
  X,
  User,
  Settings,
  Home,
  Gamepad2,
  MessageSquare,
  Wrench,
  LogIn,
  LogOut,
  Box,
  PanelRightClose,
  PanelLeftClose,
  Sun,
  Moon,
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
  logOut: LogOut,
  app: Box,
  expand: PanelRightClose,
  collapse: PanelLeftClose,
  lightMode: Sun,
  darkMode: Moon,
};

export type IconName = keyof typeof icons;
