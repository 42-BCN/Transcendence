import fs from 'node:fs';
import util from 'node:util';

const targets = [
  {
    patchPath: '.tmp/i18n-locale-patch.ca.json',
    localePath: './src/i18n/messages/ca.json',
    language: 'ca',
  },
  {
    patchPath: '.tmp/i18n-locale-patch.en.json',
    localePath: './src/i18n/messages/en.json',
    language: 'en',
  },
  {
    patchPath: '.tmp/i18n-locale-patch.es.json',
    localePath: './src/i18n/messages/es.json',
    language: 'es',
  },
];

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(target, source, collisions, prefix = '') {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    const nextPath = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      mergeDeep(targetValue, sourceValue, collisions, nextPath);
      continue;
    }

    if (!(key in target)) {
      target[key] = sourceValue;
      continue;
    }

    if (JSON.stringify(targetValue) === JSON.stringify(sourceValue)) {
      continue;
    }

    collisions.push({
      path: nextPath,
      existing: targetValue,
      incoming: sourceValue,
    });
  }
}

const summary = [];

for (const target of targets) {
  if (!fs.existsSync(target.patchPath)) {
    summary.push({
      language: target.language,
      status: 'skipped',
      reason: `Patch not found: ${target.patchPath}`,
    });
    continue;
  }

  if (!fs.existsSync(target.localePath)) {
    summary.push({
      language: target.language,
      status: 'skipped',
      reason: `Locale file not found: ${target.localePath}`,
    });
    continue;
  }

  const patch = readJson(target.patchPath);
  const locale = readJson(target.localePath);
  const collisions = [];

  mergeDeep(locale, patch, collisions);

  writeJson(target.localePath, locale);

  summary.push({
    language: target.language,
    status: 'updated',
    localePath: target.localePath,
    patchPath: target.patchPath,
    collisions,
  });
}

console.log(
  util.inspect(summary, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  }),
);

const updated = summary.filter((item) => item.status === 'updated').length;
const skipped = summary.filter((item) => item.status === 'skipped').length;
const collisions = summary.reduce((total, item) => total + (item.collisions?.length ?? 0), 0);

console.log(`\nLocales updated: ${updated}`);
console.log(`Locales skipped: ${skipped}`);
console.log(`Collisions found: ${collisions}`);
