import fs from 'node:fs';
import util from 'node:util';

const ROOT_ORDER = ['common', 'components', 'layouts', 'pages', 'features', 'validation', 'errors'];

const LOCALE_FILES = [
  './src/i18n/messages/ca.json',
  './src/i18n/messages/en.json',
  './src/i18n/messages/es.json',
];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sortObjectRecursively(value) {
  if (!isPlainObject(value)) return value;

  const sortedKeys = Object.keys(value).sort((a, b) => a.localeCompare(b));
  const result = {};

  for (const key of sortedKeys) {
    result[key] = sortObjectRecursively(value[key]);
  }

  return result;
}

function sortLocaleRoot(locale) {
  const result = {};

  for (const key of ROOT_ORDER) {
    if (key in locale) {
      result[key] = sortObjectRecursively(locale[key]);
    }
  }

  const extraKeys = Object.keys(locale)
    .filter((key) => !ROOT_ORDER.includes(key))
    .sort((a, b) => a.localeCompare(b));

  for (const key of extraKeys) {
    result[key] = sortObjectRecursively(locale[key]);
  }

  return result;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const summary = [];

for (const filePath of LOCALE_FILES) {
  if (!fs.existsSync(filePath)) {
    summary.push({
      filePath,
      status: 'skipped',
      reason: 'File not found',
    });
    continue;
  }

  const original = readJson(filePath);
  const sorted = sortLocaleRoot(original);
  const changed = JSON.stringify(original) !== JSON.stringify(sorted);

  writeJson(filePath, sorted);

  summary.push({
    filePath,
    status: 'sorted',
    changed,
  });
}

console.log(
  util.inspect(summary, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  }),
);

const changedCount = summary.filter((item) => item.changed).length;
console.log(`\nLocale files processed: ${summary.length}`);
console.log(`Locale files changed: ${changedCount}`);
