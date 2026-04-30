import fs from 'node:fs';
import util from 'node:util';

const aiResponse = JSON.parse(fs.readFileSync('.tmp/i18n-ai-response.json', 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function toNestedObject(path, value) {
  const parts = path.split('.');
  const root = {};
  let current = root;

  for (let i = 0; i < parts.length - 1; i += 1) {
    current[parts[i]] = {};
    current = current[parts[i]];
  }

  current[parts.at(-1)] = value;
  return root;
}

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      mergeDeep(targetValue, sourceValue);
    } else if (!(key in target)) {
      target[key] = sourceValue;
    }
  }
}

function normalizeViolation(violation) {
  const normalized = { ...violation };

  if (normalized.namespace === undefined) normalized.namespace = null;
  if (normalized.fullKey === undefined) normalized.fullKey = null;
  if (normalized.text === undefined) normalized.text = null;
  if (normalized.functionName === undefined) normalized.functionName = null;
  if (normalized.replacement === undefined) normalized.replacement = null;
  if (normalized.key === undefined) normalized.key = null;

  if (normalized.localeValues === undefined || normalized.localeValues === null) {
    normalized.localeValues = {
      ca: null,
      en: null,
      es: null,
    };
  } else {
    normalized.localeValues = {
      ca: normalized.localeValues.ca ?? null,
      en: normalized.localeValues.en ?? null,
      es: normalized.localeValues.es ?? null,
    };
  }

  if (normalized.translator === undefined || normalized.translator === null) {
    normalized.translator = {
      kind: null,
      variable: null,
      needsImport: false,
      needsBinding: false,
      suggestedBinding: null,
    };
  } else {
    normalized.translator = {
      kind: normalized.translator.kind ?? null,
      variable: normalized.translator.variable ?? null,
      needsImport: normalized.translator.needsImport ?? false,
      needsBinding: normalized.translator.needsBinding ?? false,
      suggestedBinding: normalized.translator.suggestedBinding ?? null,
    };
  }

  if (normalized.reusedExistingKey === undefined) {
    normalized.reusedExistingKey = false;
  }

  if (normalized.namespace === null && typeof normalized.fullKey === 'string') {
    const parts = normalized.fullKey.split('.');
    if (parts.length > 1) {
      normalized.namespace = parts.slice(0, -1).join('.');
    }
  }

  if (
    normalized.fullKey === null &&
    typeof normalized.namespace === 'string' &&
    typeof normalized.key === 'string'
  ) {
    normalized.fullKey = `${normalized.namespace}.${normalized.key}`;
  }

  return normalized;
}

function normalizeResponse(data) {
  return {
    ...data,
    files: (data.files ?? []).map((file) => ({
      ...file,
      violations: (file.violations ?? []).map((violation) => normalizeViolation(violation)),
    })),
  };
}

function validateTranslator(translator, location) {
  assert(translator && typeof translator === 'object', `Invalid translator at ${location}`);

  assert(
    translator.kind === null ||
      translator.kind === 'useTranslations' ||
      translator.kind === 'getTranslations',
    `Invalid translator.kind at ${location}`,
  );

  assert(
    translator.variable === null || typeof translator.variable === 'string',
    `Invalid translator.variable at ${location}`,
  );

  assert(
    typeof translator.needsImport === 'boolean',
    `Invalid translator.needsImport at ${location}`,
  );

  assert(
    typeof translator.needsBinding === 'boolean',
    `Invalid translator.needsBinding at ${location}`,
  );

  assert(
    translator.suggestedBinding === null || typeof translator.suggestedBinding === 'string',
    `Invalid translator.suggestedBinding at ${location}`,
  );
}

function validateLocaleValues(localeValues, location) {
  assert(localeValues && typeof localeValues === 'object', `Missing localeValues at ${location}`);

  for (const lang of ['ca', 'en', 'es']) {
    assert(
      localeValues[lang] === null || typeof localeValues[lang] === 'string',
      `Invalid localeValues.${lang} at ${location}`,
    );
  }
}

function validateViolation(violation, filePath) {
  const location = `${filePath}:${violation.line}:${violation.column}`;

  assert(typeof violation.line === 'number', `Invalid line at ${filePath}`);
  assert(typeof violation.column === 'number', `Invalid column at ${filePath}`);
  assert(
    violation.functionName === null || typeof violation.functionName === 'string',
    `Invalid functionName at ${location}`,
  );

  assert(
    violation.namespace === null || typeof violation.namespace === 'string',
    `Invalid namespace at ${location}`,
  );

  validateTranslator(violation.translator, location);

  assert(
    violation.text === null || typeof violation.text === 'string',
    `Invalid text at ${location}`,
  );

  assert(
    violation.kind === 'plain-text' ||
      violation.kind === 'template-with-variable' ||
      violation.kind === 'template-with-count' ||
      violation.kind === 'partially-translated-template' ||
      violation.kind === 'unknown',
    `Invalid kind at ${location}`,
  );

  assert(violation.key === null || typeof violation.key === 'string', `Invalid key at ${location}`);

  assert(
    violation.fullKey === null || typeof violation.fullKey === 'string',
    `Invalid fullKey at ${location}`,
  );

  validateLocaleValues(violation.localeValues, location);

  assert(
    violation.replacement === null || typeof violation.replacement === 'string',
    `Invalid replacement at ${location}`,
  );

  assert(
    typeof violation.reusedExistingKey === 'boolean',
    `Invalid reusedExistingKey at ${location}`,
  );

  assert(typeof violation.needsReview === 'boolean', `Invalid needsReview at ${location}`);

  assert(
    violation.confidence === 'high' ||
      violation.confidence === 'medium' ||
      violation.confidence === 'low',
    `Invalid confidence at ${location}`,
  );

  assert(typeof violation.rationale === 'string', `Invalid rationale at ${location}`);
}

function validateResponse(data) {
  assert(data && typeof data === 'object', 'AI response must be an object');
  assert(Array.isArray(data.files), 'AI response must contain files[]');

  for (const file of data.files) {
    assert(typeof file.filePath === 'string', 'Each file must have filePath');
    assert(Array.isArray(file.violations), `Violations must be an array for ${file.filePath}`);

    for (const violation of file.violations) {
      validateViolation(violation, file.filePath);
    }
  }
}

function buildProposals(data) {
  return data.files.map((file) => ({
    filePath: file.filePath,
    proposals: file.violations.map((violation) => ({
      line: violation.line,
      column: violation.column,
      functionName: violation.functionName,
      namespace: violation.namespace,
      translator: violation.translator,
      text: violation.text,
      kind: violation.kind,
      key: violation.key,
      fullKey: violation.fullKey,
      localeValues: violation.localeValues,
      replacement: violation.replacement,
      reusedExistingKey: violation.reusedExistingKey,
      needsReview: violation.needsReview,
      confidence: violation.confidence,
      rationale: violation.rationale,
    })),
  }));
}

function buildLocalePatchForLanguage(data, language) {
  const localePatch = {};

  for (const file of data.files) {
    for (const violation of file.violations) {
      if (!violation.fullKey || !violation.localeValues?.[language]) continue;

      const nestedPatch = toNestedObject(violation.fullKey, violation.localeValues[language]);
      mergeDeep(localePatch, nestedPatch);
    }
  }

  return localePatch;
}

function buildCodePatch(data) {
  return data.files.map((file) => ({
    filePath: file.filePath,
    edits: file.violations
      .filter((violation) => violation.replacement)
      .map((violation) => ({
        line: violation.line,
        column: violation.column,
        functionName: violation.functionName,
        namespace: violation.namespace,
        translator: violation.translator,
        key: violation.key,
        fullKey: violation.fullKey,
        replacement: violation.replacement,
        needsReview: violation.needsReview,
        confidence: violation.confidence,
      })),
  }));
}

const normalizedResponse = normalizeResponse(aiResponse);

validateResponse(normalizedResponse);

const proposals = buildProposals(normalizedResponse);
const localePatchCa = buildLocalePatchForLanguage(normalizedResponse, 'ca');
const localePatchEn = buildLocalePatchForLanguage(normalizedResponse, 'en');
const localePatchEs = buildLocalePatchForLanguage(normalizedResponse, 'es');
const codePatch = buildCodePatch(normalizedResponse);

fs.mkdirSync('.tmp', { recursive: true });
fs.writeFileSync('.tmp/i18n-proposals.json', JSON.stringify(proposals, null, 2));
fs.writeFileSync('.tmp/i18n-locale-patch.ca.json', JSON.stringify(localePatchCa, null, 2));
fs.writeFileSync('.tmp/i18n-locale-patch.en.json', JSON.stringify(localePatchEn, null, 2));
fs.writeFileSync('.tmp/i18n-locale-patch.es.json', JSON.stringify(localePatchEs, null, 2));
fs.writeFileSync('.tmp/i18n-code-patch.json', JSON.stringify(codePatch, null, 2));

console.log(
  util.inspect(
    {
      proposals,
      localePatchCa,
      localePatchEn,
      localePatchEs,
      codePatch,
    },
    {
      depth: null,
      colors: true,
      maxArrayLength: null,
    },
  ),
);

const filesWithErrors = proposals.length;
const totalProposals = proposals.reduce((total, file) => total + file.proposals.length, 0);
const needsReview = proposals.reduce(
  (total, file) => total + file.proposals.filter((proposal) => proposal.needsReview).length,
  0,
);

console.log(`\nFiles with errors: ${filesWithErrors}`);
console.log(`Proposals generated: ${totalProposals}`);
console.log(`Needs review: ${needsReview}`);
console.log('Saved .tmp/i18n-proposals.json');
console.log('Saved .tmp/i18n-locale-patch.ca.json');
console.log('Saved .tmp/i18n-locale-patch.en.json');
console.log('Saved .tmp/i18n-locale-patch.es.json');
console.log('Saved .tmp/i18n-code-patch.json');
