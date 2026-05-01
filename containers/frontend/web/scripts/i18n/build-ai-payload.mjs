import fs from 'node:fs';
import util from 'node:util';

const violations = JSON.parse(fs.readFileSync('.tmp/i18n-literals.json', 'utf8'));
const locales = {
  ca: JSON.parse(fs.readFileSync('./src/i18n/messages/ca.json', 'utf8')),
  en: JSON.parse(fs.readFileSync('./src/i18n/messages/en.json', 'utf8')),
  es: JSON.parse(fs.readFileSync('./src/i18n/messages/es.json', 'utf8')),
};

const i18nRules = {
  decisionRule: {
    globalOrReused: 'common',
    reusableUi: 'components',
    layoutRelated: 'layouts',
    routeSpecific: 'pages',
    businessOrDomain: 'features',
    validation: 'validation',
    backendErrors: 'errors',
  },
  naming: {
    namespaces: 'lowercase',
    keys: 'camelCase',
  },
  featuresRule: 'features.<feature>.<section>.<key>',
  specialRules: [
    'validation and errors must stay top-level',
    'backend error codes must match backend codes',
    'shared UI copy that is not a backend error code should live under common',
    'if a translation binding already exists in scope, prefer reusing that namespace',
    'if multiple bindings exist, choose the nearest relevant one',
    'a single file may contain violations from different namespaces',
    'namespace must be returned per violation, not per file',
    'return translations for ca, en, and es',
    'reuse existing keys from locale files when possible',
    'return only structured JSON',
  ],
  localeTreeShape: {
    common: {},
    components: {},
    layouts: {},
    pages: {},
    features: {},
    validation: {},
    errors: {},
  },
};

function compactViolation(violation) {
  return {
    line: violation.line,
    column: violation.column,
    location: violation.location,
    text: violation.text,
    nodeType: violation.nodeType,
    matchedNodeType: violation.matchedNodeType,
    functionName: violation.functionName,
    scopeBindings: violation.scopeBindings,
  };
}

function compactFile(file) {
  return {
    filePath: file.filePath,
    componentType: file.componentType,
    imports: file.imports,
    violations: file.violations.map((violation) => compactViolation(violation)),
  };
}

const aiPayload = {
  instructions: {
    goal: 'Generate precise i18n proposals for the reported violations.',
    constraints: [
      'Resolve namespace per violation, not per file.',
      'Reuse existing translation namespace bindings when appropriate.',
      'If no binding exists, propose the best namespace according to the project rules.',
      'Prefer local keys in replacements when a namespace binding is used.',
      'If equivalent meaning already exists in locale files, reuse that key instead of creating a new one.',
      'For template strings with variables or counts, prefer interpolation.',
      'Mark ambiguous cases with needsReview: true.',
      'Do not return prose. Return only valid JSON.',
    ],
    expectedResponseShape: {
      files: [
        {
          filePath: 'string',
          violations: [
            {
              line: 'number',
              column: 'number',
              functionName: 'string|null',
              namespace: 'string|null',
              translator: {
                kind: 'useTranslations|getTranslations|null',
                variable: 'string|null',
                needsImport: 'boolean',
                needsBinding: 'boolean',
                suggestedBinding: 'string|null',
              },
              text: 'string|null',
              kind: 'plain-text|template-with-variable|template-with-count|partially-translated-template|unknown',
              key: 'string|null',
              fullKey: 'string|null',
              localeValues: {
                ca: 'string|null',
                en: 'string|null',
                es: 'string|null',
              },
              replacement: 'string|null',
              reusedExistingKey: 'boolean',
              needsReview: 'boolean',
              confidence: 'high|medium|low',
              rationale: 'string',
            },
          ],
        },
      ],
    },
  },
  projectI18nRules: i18nRules,
  existingLocales: locales,
  files: violations.map((file) => compactFile(file)),
};

fs.mkdirSync('.tmp', { recursive: true });
fs.writeFileSync('.tmp/i18n-ai-payload.json', JSON.stringify(aiPayload, null, 2));

console.log(
  util.inspect(aiPayload, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  }),
);

console.log('\nSaved .tmp/i18n-ai-payload.json');
console.log(`Files in payload: ${aiPayload.files.length}`);

const totalViolations = aiPayload.files.reduce((total, file) => total + file.violations.length, 0);

console.log(`Violations in payload: ${totalViolations}`);
