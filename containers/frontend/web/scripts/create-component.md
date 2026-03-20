create-component.mjs

Creates a new React component scaffold inside the specified directory.

Usage:
  	node create-component.mjs <ComponentName> <targetPath>
	or
	npm run component Button src/components/controls
Arguments:
  ComponentName  Name of the component (PascalCase or kebab-case).
  targetPath     Directory where the component folder will be created.

What it generates:
  <targetPath>/<component-name>/
    ├── index.ts
    ├── <component-name>.tsx
    └── <component-name>.styles.ts