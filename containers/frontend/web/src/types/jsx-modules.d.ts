declare module '*.jsx' {
  import type { ComponentType } from 'react';
  const DefaultComponent: ComponentType<any>;
  export default DefaultComponent;
  export const Crawler: ComponentType<any>;
  export const Drone: ComponentType<any>;
  export const Gunner: ComponentType<any>;
  export const Fighter: ComponentType<any>;
  export const Generator: ComponentType<any>;
  export const Mage: ComponentType<any>;
  export const Alchemist: ComponentType<any>;
  export const Assassin: ComponentType<any>;
  export const Paladin: ComponentType<any>;
}
