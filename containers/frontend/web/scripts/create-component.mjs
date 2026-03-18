#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const [, , nameArg, targetPathArg] = process.argv;

if (!nameArg || !targetPathArg) {
  console.error('Usage: node create-component.mjs <ComponentName> <targetPath>');
  process.exit(1);
}

const toKebabCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

const toPascalCase = (str) =>
  str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

const kebabName = toKebabCase(nameArg);
const componentName = toPascalCase(kebabName);
const stylesName = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}Styles`;

const componentDir = path.join(process.cwd(), targetPathArg, kebabName);

if (fs.existsSync(componentDir)) {
  console.error(`❌ Folder already exists: ${componentDir}`);
  process.exit(1);
}

fs.mkdirSync(componentDir, { recursive: true });

/* ---------------- index.ts ---------------- */

fs.writeFileSync(
  path.join(componentDir, 'index.ts'),
  `export { ${componentName} } from './${kebabName}';
export type { ${componentName}Props } from './${kebabName}';
`,
);

/* ---------------- component ---------------- */

fs.writeFileSync(
  path.join(componentDir, `${kebabName}.tsx`),
  `import type { ReactNode } from 'react';
 import { ${stylesName} } from './${kebabName}.styles';

export type ${componentName}Props = {
  children?: ReactNode;
};

export function ${componentName}({ children }: ${componentName}Props) {
  return (
    <div className={${stylesName}()}>
      {children}
    </div>
  );
}
`,
);

/* ---------------- styles ---------------- */

fs.writeFileSync(
  path.join(componentDir, `${kebabName}.styles.ts`),
  `import { cn } from '@/lib/styles/cn';

 export function ${stylesName} () {
   return cn()
 };
`,
);

console.log(`✅ Component created at: ${componentDir}`);
