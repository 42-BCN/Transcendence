# Frontend Components

## src/struture

src
|
+-- app               # application layout and pages as stated by (Next.js)[https://nextjs.org/docs/app/getting-started/layouts-and-pages]
|   +-- (subroutes)   # nested routes | groups | dinamic routes - see documentation
|   +-- page.tsx      # a page is UI that is rendered on a specific route. 
|   +-- layout.tsx    # a layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.
|   +-- error.tsx     # catch errors in their child components and display a fallback UI instead of the component tree that crashed.
|	+-- loading.tsx   # react suspense boundary
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
|
+ ------------------- current implementation ends here
|
+-- types             # shared types used across the application
|
+-- stores            # global state stores
|
+-- hooks             # shared hooks used across the entire application

