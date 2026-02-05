# Frontend documentation

## 1. Project structure 
*root at: /src/web*

- apps | *where fe apps live*
	- web | *frontend web with next.js*
		- .next | *nextjs build output. git ignore*
		- app | section 2.1
		- components | section 2.2
			- controls
				- *componente-name*
					- index.ts
					- *componente-name*.tsx
					- *componente-name*.style.ts
			- primitive
				- *componente-name*
					- index.ts
					- *componente-name*.tsx
					- *componente-name*.style.ts
		- features 
		- dev
		- hooks
		- lib
		- node_modules | *dependencies. ignored.*
		- types
		- utils
		- scripts | *Development utils*  
			- create-index.sh | *Creates a component structure*
			- lint-test.tsx  
		- ------ | *config files*  
		.prettierignore   
		.prettierrc.json  
		eslint.config.msj  
		next-env.d.ts  
		postcss.config.js  
		tailwind.config.js  
		tsconfig.json  
		- ---- | *node*  
		package-lock.json  
		package.json  
		- ---- utils | misc

		tsconfig.tsbuildinfo | *git ignore | ignore*  

- docker | *docker related files*
	- dockerfile
	- bash confing ffor colours
	- docker entrypoint
- ---- | *./*  
README.md | *this documentation*  
.dockerignore | *files docker should ignore when working on the directory*  

# 2. section apps/web/
## 2.1. ./app
Is the routing and composition layer.
It wires features together but owns no business logic itself.

| Area                | ✅ **DO**                                    | ❌ **DON’T**                                |
| ------------------- | ------------------------------------------- | ------------------------------------------ |
| **Purpose**         | Use `app/` to define routes & URL structure | Use `app/` as a generic code folder        |
| **Responsibility**  | Treat `app/` as an orchestration layer      | Treat `app/` as a business or domain layer |
| **Server / Client** | Default to Server Components                | Add `'use client'` by default              |
| **Data fetching**   | Fetch data in Server Components             | Fetch data inside UI components            |





 Area                 |                                             |                     
| --------------------|---------------------------------------------|
| **Pages**           | Keep `page.tsx` thin and declarative        |
| **Mutations**       | Use Server Actions                          |
| **Layouts**         | Use `layout.tsx` for persistent UI          |
| **Loading**         | Scope `loading.tsx` per route segment       |
| **Errors**          | Use `error.tsx` as route boundaries         |
| **Dependencies**    | Import features, never the opposite         |

## 2.1. ./components

Highly reusable UI components with extremely high reuse potential.
They are intentionally small, simple, and constrained. Any complexity they contain is explicit and bounded.

This layer is responsible for:

- Visual consistency

- Interaction consistency

- Accessibility foundations

Style rules live here (except layout composition).
All interactions must be expressed using React Aria props (onPress, onChange, etc.).
Raw DOM event handlers are forbidden in public component APIs.

This guarantees consistent accessibility, device-agnostic behavior, and enforceable architectural boundaries.


| Category                         | **UI Primitives**                                                                | **UI Controls**                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Definition**                   | Foundational UI building blocks                                                  | Foundational user-interaction building blocks                                                 |
| **Reusability**                  | Extremely high                                                                   | High                                                                                          |
| **Complexity**                   | Intentionally dumb                                                               | Intentionally constrained                                                                     |
| **State**                        | ❌ No state                                                                       | ✅ UI state only (controlled / uncontrolled via React Aria)                                    |
| **User interaction**             | ❌ None                                                                           | ✅ Core responsibility                                                                         |
| **Interaction handling**         | ❌ None                                                                           | ✅ Exclusively via React Aria hooks                                                            |
| **Interaction API**              | ❌ No interaction props exposed                                                   | ✅ React Aria interaction props only (`onPress`, `onChange`, etc.)                             |
| **DOM event exposure**           | ❌ Never                                                                          | ❌ Never (`onClick`, `onKeyDown`, `onMouse*` forbidden)                                        |
| **Accessibility responsibility** | Mechanics (roles, focus, ARIA attributes)                                        | Semantics (interaction patterns, relationships)                                               |
| **Accessibility examples**       | `role`, focus ring, ARIA attributes                                              | Label ↔ control wiring, keyboard navigation, focus management                                 |
| **Business logic**               | ❌ Never                                                                          | ❌ Never                                                                                       |
| **Data fetching**                | ❌ Never                                                                          | ❌ Never                                                                                       |
| **Validation logic**             | ❌ Never                                                                          | ❌ Never                                                                                       |
| **App / feature awareness**      | ❌ None                                                                           | ❌ None                                                                                        |
| **Assumptions about usage**      | ❌ None                                                                           | ❌ None                                                                                        |
| **React Aria usage**             | ❌ Never                                                                          | ✅ Mandatory for all interactions                                                              |
| **Interaction examples**         | —                                                                                | `useButton`, `useTextField`, `useCheckbox`, `useSelect`, `useDialog`, `useMenu`, `useTooltip` |
| **Typical dependencies**         | Styling, design tokens, React                                                    | UI primitives, React Aria                                                                     |
| **Examples**                     | `Box`, `Text`, `Stack`, `Icon`, `VisuallyHidden`, `FocusRing`, `PrimitiveButton` | `Button`, `Checkbox`, `Input`, `Select`, `Dialog`, `Menu`, `Tooltip`                          |

### component structure structure

#### Exports 
``` ts
// index.ts
export { ComponentName } from './component-name';
export type { ComponentNameProps } from './component-name';
```


### styles

Examples reference for *customizable styles props source of truth*:
- variant: semantic intent (primary/secondary/destructive/outline/success...)
- size: spacing + rhythm (xs/sm/md/lg/xl)
- tone: emphasis (neutral/muted/strong/inverted)
- align: alignment (start/center/end/stretch)
- status: feedback state (idle/loading/success/error/warning)
- orientation: layout direction (horizontal/vertical)


// Interaction + accessibility states (RAC-driven)
Minimal React Aria Components render-state we rely on for styling.  
(Keeps styles typed without coupling to library internals.)

 - Public API: expose intent, not mechanics  
	- ✅ Allowed: onPress, onChange, onSelectionChange, onOpenChange, ...
 	- ❌ Forbidden: onClick, onMouseDown, onKeyDown, onTouchStart, ...
 - Common RAC state flags styles may consume:
	isPressed, isHovered, isFocused, isFocusVisible, isDisabled,
	isSelected, isExpanded, isOpen, isInvalid, isReadOnly, isRequired

```ts
// component-name.styles.ts
import { cn } from '@/lib/styles/cn'; // cn conciliator fn

const componentNameBase = 'base classes shared by all comoponent-name instances';

// Custom styles props
const componentNamePropsStyles = {
  variant: {
    primary: 'add your taildwind classes here',
    secondary: 'add your taildwind classes here',
    // destructive: '...',
    // outline: '...',
  },
  // size: { ... },
} as const;

export type ComponentNameVariant = keyof typeof componentNamePropsStyles.variant;

// RAC-driven styles -> only for controlled components
export type ComponentNameRacState = {
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  isOpen: boolean;
  isInvalid: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
};

function componentNameState(state: ComponentNameRacState) { 
  return cn(
    state.isPressed && 'add your taildwind classes here',
    state.isHovered && 'add your taildwind classes here',
    state.isFocusVisible && 'add your taildwind classes here',
    state.isDisabled && 'add your taildwind classes here',
    state.isInvalid && 'add your taildwind classes here',
  );
}

// Class getter
export function componentNameClass(args: { 
  variant?: ComponentNameVariant;
  size?: ComponentNameSize;
  state: ComponentNameRacState;
  className?: string;
}) {
  const {
    variant = 'primary',
    size = 'md',
    state,
    className,
  } = args;

  return cn(
    componentNameBase,
    componentNameOptions.variant[variant],
    componentNameOptions.size[size],
    componentNameState(state),
    className,
  );
}
```


```tsx
//component-name.tsx
'use client';

// RAC imports
import type { ComponentAriaNameProps as AriaComponentProps } from 'react-aria-components';
import { ComponentAriaName as AriaComponent } from 'react-aria-components';

// Component styles imports
import { componentNameClass } from './component-name.styles';
import type { ComponentNameVariant } from './component-name.styles';

// Omit is used to remove props we intentionally take ownership of (like className) so the component API stays controlled and predictable.
export type ComponentNameProps = Omit<AriaComponentProps,   | 'className'
  | 'style'
  | 'onClick'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onTouchStart'
  | 'onTouchEnd'> & {
  variant?: ComponentNameVariant;
  size?: ComponentNameSize;
//className?: string; enable if style escape hatch is needed (it should not)
};

export function ComponentName({
  variant = 'primary',
  size = 'md',
//   className, enable if style escape hatch is needed (it should not)
  ...props
}: ComponentNameProps) {
  return (
    <AriaComponent
      {...props}
      className={(state) =>
        componentNameClass({
          variant,
          size,
          state: state as ComponentNameRacState,
          // className, enable if style escape hatch is needed (it should not)
        })
      }
    />
  );
}
```