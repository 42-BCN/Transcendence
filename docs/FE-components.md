# Frontend Components

## 1. Folder structure 

```
src  
|  
+-- app               # application layout and pages as stated by [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)  
|   +-- subroutes     # nested routes  
|   +-- \[locale]     # dynamic route  
|   +-- (group)       # group -> the folder will be ignored on route construction
|   +----------------- files  
|   +-- page.tsx      # a page is UI that is rendered on a specific route.  
|   +-- layout.tsx    # a layout is UI that is shared between multiple pages. On   navigation, layouts preserve state, remain interactive, and do not rerender.  
|   +-- error.tsx     # catch errors in their child components and display a fallback UI instead of the component tree that crashed.  
|   +-- loading.tsx   # react suspense boundary  
|   +-- not-found.tsx # react error boundary for "not found" UI  
|  
+-- components        # shared components used across the entire application  
|   +-- composites    # reusable UI patterns composed of controls, still feature-agnostic.  
|   +-- controls      # reusable interactive elements wrapping native inputs with accessibility built in.   
|   +-- primitives    # reusable visual building blocks with no business logic.  
|  
+-- features          # feature based modules
|
+-- lib               # reusable libraries and exported variables preconfigured for the application
|
+-- i18n              # i18n configuration

```
---

## 2.Component 


### 2.1 Component overview
| Layer       | Purpose  | Styling Responsibility | Can Import From |
|-------------|----------|------------------------|-----------------|
| Primitives  | Low-level visual + layout building blocks | Layout, spacing, typography, tokens | shared/ui/primitives, shared/lib |
| Controls (Controllers) | Accessible interactive components wrapping RAC | Variants, sizes, focus, disabled, invalid states | primitives + RAC |
| Composites  | Reusable combinations of primitives + controls | Layout composition + slot styling | primitives + controls |

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