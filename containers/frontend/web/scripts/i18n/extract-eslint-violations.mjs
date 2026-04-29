import fs from 'node:fs';
import { parse } from '@typescript-eslint/typescript-estree';
import util from 'node:util';

const input = JSON.parse(fs.readFileSync('.tmp/i18n-violations.json', 'utf8'));

function visit(node, cb) {
  if (!node || typeof node !== 'object') return;
  cb(node);

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item, cb);
    } else if (value && typeof value === 'object' && value.type) {
      visit(value, cb);
    }
  }
}

function matchesViolation(node, violation) {
  if (!node.loc) return false;
  return node.loc.start.line === violation.line && node.loc.start.column + 1 === violation.column;
}

function extractText(node, source) {
  if (node.type === 'JSXText') return node.value.trim();

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type === 'TemplateLiteral') {
    return source.slice(node.range[0], node.range[1]);
  }

  return source.slice(node.range[0], node.range[1]);
}

function buildLocation(filePath, line, column) {
  return `${filePath}:${line}:${column}`;
}

function getComponentType(ast) {
  const firstStatement = ast.body?.[0];

  if (
    firstStatement?.type === 'ExpressionStatement' &&
    firstStatement.expression?.type === 'Literal' &&
    firstStatement.expression.value === 'use client'
  ) {
    return 'client';
  }

  return 'server';
}

function getTranslationImports(ast) {
  let hasUseTranslations = false;
  let hasGetTranslations = false;

  for (const node of ast.body ?? []) {
    if (node.type !== 'ImportDeclaration') continue;

    for (const specifier of node.specifiers ?? []) {
      if (specifier.type !== 'ImportSpecifier') continue;

      const importedName =
        specifier.imported.type === 'Identifier'
          ? specifier.imported.name
          : specifier.imported.value;

      if (importedName === 'useTranslations') hasUseTranslations = true;
      if (importedName === 'getTranslations') hasGetTranslations = true;
    }
  }

  return {
    useTranslations: hasUseTranslations,
    getTranslations: hasGetTranslations,
  };
}

function isFunctionNode(node) {
  return (
    node?.type === 'FunctionDeclaration' ||
    node?.type === 'FunctionExpression' ||
    node?.type === 'ArrowFunctionExpression'
  );
}

function containsLocation(node, violation) {
  if (!node.loc) return false;

  const line = violation.line;
  const column = violation.column - 1;

  const startsBefore =
    node.loc.start.line < line || (node.loc.start.line === line && node.loc.start.column <= column);

  const endsAfter =
    node.loc.end.line > line || (node.loc.end.line === line && node.loc.end.column >= column);

  return startsBefore && endsAfter;
}

function findEnclosingFunction(ast, violation) {
  let best = null;

  visit(ast, (node) => {
    if (!isFunctionNode(node)) return;
    if (!containsLocation(node, violation)) return;

    if (!best) {
      best = node;
      return;
    }

    const bestSpan =
      (best.loc.end.line - best.loc.start.line) * 10000 +
      (best.loc.end.column - best.loc.start.column);

    const nodeSpan =
      (node.loc.end.line - node.loc.start.line) * 10000 +
      (node.loc.end.column - node.loc.start.column);

    if (nodeSpan < bestSpan) best = node;
  });

  return best;
}

function getFunctionName(fnNode, ast) {
  if (!fnNode) return null;

  if (fnNode.type === 'FunctionDeclaration' && fnNode.id?.name) {
    return fnNode.id.name;
  }

  let foundName = null;

  visit(ast, (node) => {
    if (foundName) return;

    if (
      node.type === 'VariableDeclarator' &&
      node.id?.type === 'Identifier' &&
      node.init === fnNode
    ) {
      foundName = node.id.name;
      return;
    }

    if (
      node.type === 'Property' &&
      node.value === fnNode &&
      !node.computed &&
      node.key?.type === 'Identifier'
    ) {
      foundName = node.key.name;
    }
  });

  return foundName;
}

function getTranslationBindingsInNode(rootNode) {
  const bindings = [];

  visit(rootNode, (node) => {
    if (node !== rootNode && isFunctionNode(node)) return;

    if (node.type !== 'VariableDeclarator') return;
    if (!node.init) return;
    if (node.id.type !== 'Identifier') return;

    let callNode = null;
    let kind = null;

    if (node.init.type === 'CallExpression' && node.init.callee?.type === 'Identifier') {
      if (node.init.callee.name === 'useTranslations') {
        callNode = node.init;
        kind = 'useTranslations';
      } else if (node.init.callee.name === 'getTranslations') {
        callNode = node.init;
        kind = 'getTranslations';
      }
    }

    if (
      node.init.type === 'AwaitExpression' &&
      node.init.argument?.type === 'CallExpression' &&
      node.init.argument.callee?.type === 'Identifier' &&
      node.init.argument.callee.name === 'getTranslations'
    ) {
      callNode = node.init.argument;
      kind = 'getTranslations';
    }

    if (!callNode || !kind) return;

    const firstArg = callNode.arguments?.[0];
    let namespace = null;

    if (firstArg?.type === 'Literal' && typeof firstArg.value === 'string') {
      namespace = firstArg.value;
    }

    if (
      firstArg?.type === 'TemplateLiteral' &&
      firstArg.expressions.length === 0 &&
      firstArg.quasis.length === 1
    ) {
      namespace = firstArg.quasis[0].value.cooked ?? null;
    }

    bindings.push({
      kind,
      variable: node.id.name,
      namespace,
    });
  });

  return bindings;
}

const enriched = input.map((file) => {
  const ast = parse(file.source, {
    loc: true,
    range: true,
    jsx: true,
  });

  const componentType = getComponentType(ast);
  const imports = getTranslationImports(ast);

  const nextViolations = file.violations.map((violation) => {
    let found = null;

    visit(ast, (node) => {
      if (found) return;
      if (matchesViolation(node, violation)) found = node;
    });

    const enclosingFunction = findEnclosingFunction(ast, violation);
    const functionName = getFunctionName(enclosingFunction, ast);
    const scopeBindings = enclosingFunction ? getTranslationBindingsInNode(enclosingFunction) : [];

    return {
      ...violation,
      text: found ? extractText(found, file.source) : null,
      matchedNodeType: found?.type ?? null,
      location: buildLocation(file.filePath, violation.line, violation.column),
      functionName,
      scopeBindings,
    };
  });

  return {
    filePath: file.filePath,
    componentType,
    imports,
    violations: nextViolations,
  };
});

fs.writeFileSync('.tmp/i18n-literals.json', JSON.stringify(enriched, null, 2));

console.log(
  util.inspect(enriched, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  }),
);

const filesWithErrors = enriched.length;

console.log(`\nFiles with errors: ${filesWithErrors}`);
