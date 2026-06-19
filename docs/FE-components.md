# Frontend Components

## 1. Folder structure 

```
src  
|  
+-- app               # application layout and pages as stated by Next.js App Router  
|   +-- subroutes     # nested routes  
|   +-- \[locale]     # dynamic locale route  
|   +-- (group)       # group -> the folder is ignored on route construction
|   +-- page.tsx      # a page is UI rendered on a specific route  
|   +-- layout.tsx    # UI shared between multiple pages  
|   +-- error.tsx     # error boundary fallback UI  
|   +-- loading.tsx   # React Suspense boundary  
|   +-- not-found.tsx # 404 UI  
|  
+-- components        # shared components used across the entire application  
|   +-- composites    # reusable UI patterns composed of controls, still feature-agnostic.  
|   +-- controls      # reusable interactive elements wrapping native inputs with accessibility built in.   
|   +-- primitives    # reusable visual building blocks with no business logic.  
|  
+-- contracts         # frontend-local type copies / re-exports from the shared contracts workspace
|
+-- features          # feature-based modules
|
+-- hooks             # shared React hooks
|
+-- i18n              # i18n configuration and message loading
|
+-- lib               # reusable libraries and exported variables preconfigured for the application
|
+-- providers         # React context providers
|
+-- types             # shared TypeScript type definitions

```
---

## 2.Component 


### 2.1 Component overview
| Layer       | Purpose  | Styling Responsibility | Can Import From |
|-------------|----------|------------------------|-----------------|
| Primitives  | Low-level visual + layout building blocks | Layout, spacing, typography, tokens | `@/lib` |
| Controls (Controllers) | Accessible interactive components wrapping RAC | Variants, sizes, focus, disabled, invalid states | `@/components/primitives` + RAC |
| Composites  | Reusable combinations of primitives + controls | Layout composition + slot styling | `@/components/primitives` + `@/components/controls` |

---

### 2.2 File Structure

```
component/[primitive|controls|composites]
|  
+-- component-name    				# component directory 
|   +-- component-name.tsx     		# component structure  
|   +-- component-name.style.ts     # component classes
|   +-- index.ts					# component export
```

### 2.3 Component Clases
``` tsx
// Base classes
const componentNameBase = '....'; 

// Dinamic variants classes [variant|size|etc]
const componentNameVariants = [
	primary: '...',
  	secondary: '...',
];

const componentNameSizes = [
  sm: '...',
  md: '...',
  lg: '...',
]; 

// React aria data-[state] variations
const  componentNameRAC = [
	`data-[disabled]:...`,
	`data-[disabled]:...`,
	`data-[focus-visible]:...`,
	`data-[focus-visible]:...`,
	// ... etc check base component base
]

```

When a component is composite export each member style as individual function.