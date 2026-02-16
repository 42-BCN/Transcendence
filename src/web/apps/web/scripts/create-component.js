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
  str
    .replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

const kebabName = toKebabCase(nameArg);
const componentName = toPascalCase(kebabName);

const componentDir = path.join(process.cwd(), targetPathArg, kebabName);

if (fs.existsSync(componentDir)) {
  console.error(`❌ Folder already exists: ${componentDir}`);
  process.exit(1);
}

fs.mkdirSync(componentDir, { recursive: true });

// index.ts
fs.writeFileSync(
  path.join(componentDir, 'index.ts'),
  `export * from './${kebabName}';\n`
);

// component file
fs.writeFileSync(
  path.join(componentDir, `${kebabName}.ts`),
`export type ${componentName}Props = {};

export function ${componentName}(props: ${componentName}Props) {
  return null;
}
`
);

// styles file
fs.writeFileSync(
  path.join(componentDir, `${kebabName}.styles.ts`),
`export const ${componentName}Styles = {};
`
);

console.log(`✅ Component created at: ${componentDir}`);