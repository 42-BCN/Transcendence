// eslint/rules/no-literal-ui-strings.js

/** @type {import('eslint').Rule.RuleModule} */
const noLiteralUiStrings = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow literal user-facing strings rendered in JSX unless wrapped in t()',
    },
    schema: [],
    messages: {
      noLiteral: 'User-facing rendered strings must use t("...") for i18n.',
    },
  },

  create(context) {
    const USER_FACING_ATTRIBUTES = new Set([
      'aria-label',
      'aria-description',
      'title',
      'placeholder',
      'alt',
      'label',
      'helperText',
      'description',
      'errorMessage',
    ]);

    const IGNORED_KEYS = new Set(['copyright']);

    function isWhitespaceOnly(value) {
      return typeof value !== 'string' || value.trim().length === 0;
    }

    function normalizeValue(value) {
      return typeof value === 'string' ? value.trim() : '';
    }

    function isAllowedLiteral(value) {
      const normalized = normalizeValue(value);

      return (
        normalized === '' ||
        ['', ' ', ':', '-', '/', '|', '·', '&'].includes(value) ||
        ['', ':', '-', '/', '|', '·', '&'].includes(normalized)
      );
    }

    function isIgnoredKeyName(name) {
      return typeof name === 'string' && IGNORED_KEYS.has(name);
    }

    function getObjectPropertyKeyName(node) {
      if (!node || node.type !== 'Property' || node.computed) return null;

      if (node.key.type === 'Identifier') return node.key.name;
      if (node.key.type === 'Literal' && typeof node.key.value === 'string') {
        return node.key.value;
      }

      return null;
    }

    function isInsideIgnoredProperty(node) {
      let current = node;
      while (current) {
        const keyName = getObjectPropertyKeyName(current);
        if (isIgnoredKeyName(keyName)) return true;
        current = current.parent;
      }
      return false;
    }

    function isInsideTCall(node) {
      let current = node;
      while (current) {
        if (
          current.type === 'CallExpression' &&
          current.callee &&
          current.callee.type === 'Identifier' &&
          current.callee.name === 't'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    function isJsxChildExpression(node) {
      return node.parent && node.parent.type === 'JSXExpressionContainer';
    }

    function isRenderedAsJsxChild(node) {
      if (!isJsxChildExpression(node)) return false;

      const jsxExpr = node.parent;
      return (
        jsxExpr.parent &&
        (jsxExpr.parent.type === 'JSXElement' || jsxExpr.parent.type === 'JSXFragment')
      );
    }

    function getJsxAttributeName(node) {
      if (!node || node.type !== 'JSXAttribute') return null;
      if (!node.name || node.name.type !== 'JSXIdentifier') return null;

      return node.name.name;
    }

    function isUserFacingJsxAttribute(node) {
      const attrName = getJsxAttributeName(node);
      return attrName ? USER_FACING_ATTRIBUTES.has(attrName) : false;
    }

    function report(node) {
      context.report({
        node,
        messageId: 'noLiteral',
      });
    }

    return {
      JSXText(node) {
        if (isWhitespaceOnly(node.value)) return;
        if (isAllowedLiteral(node.value)) return;
        if (isInsideIgnoredProperty(node)) return;

        report(node);
      },

      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (isWhitespaceOnly(node.value)) return;
        if (isAllowedLiteral(node.value)) return;
        if (isInsideIgnoredProperty(node)) return;

        if (isRenderedAsJsxChild(node)) {
          if (isInsideTCall(node)) return;
          report(node);
          return;
        }

        if (
          node.parent &&
          node.parent.type === 'JSXAttribute' &&
          isUserFacingJsxAttribute(node.parent)
        ) {
          if (isInsideTCall(node)) return;
          report(node);
        }
      },

      TemplateLiteral(node) {
        const rawText = node.quasis.map((q) => q.value.cooked ?? '').join('');

        if (isWhitespaceOnly(rawText)) return;
        if (isAllowedLiteral(rawText)) return;
        if (isInsideIgnoredProperty(node)) return;
        if (isInsideTCall(node)) return;

        if (isRenderedAsJsxChild(node)) {
          report(node);
          return;
        }

        if (
          node.parent &&
          node.parent.type === 'JSXExpressionContainer' &&
          node.parent.parent &&
          node.parent.parent.type === 'JSXAttribute' &&
          isUserFacingJsxAttribute(node.parent.parent)
        ) {
          report(node);
        }
      },
    };
  },
};

export default noLiteralUiStrings;
