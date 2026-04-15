import {
  X,
  User,
  Settings,
  Home,
  Gamepad2,
  MessageSquareText,
  Wrench,
  LogIn,
  LogOut,
  Box,
  PanelRightClose,
  PanelLeftClose,
  Sun,
  Moon,
  UserPlus,
  Check,
} from 'lucide-react';

export const icons = {
  close: X,
  user: User,
  settings: Settings,
  home: Home,
  gamepad: Gamepad2,
  messages: MessageSquareText,
  ui: Wrench,
  logIn: LogIn,
  logOut: LogOut,
  app: Box,
  expand: PanelRightClose,
  collapse: PanelLeftClose,
  lightMode: Sun,
  darkMode: Moon,
  userAdd: UserPlus,
  check: Check,
};

export type IconName = keyof typeof icons;
