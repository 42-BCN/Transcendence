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
    function isWhitespaceOnly(value) {
      return typeof value !== 'string' || value.trim().length === 0;
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

    function isAllowedLiteral(value) {
      return ['', ' ', ':', '-', '/', '|', '·', '&'].includes(value);
    }

    return {
      JSXText(node) {
        if (isWhitespaceOnly(node.value)) return;

        context.report({
          node,
          messageId: 'noLiteral',
        });
      },

      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (isWhitespaceOnly(node.value)) return;
        if (isAllowedLiteral(node.value)) return;
        if (!isRenderedAsJsxChild(node)) return;
        if (isInsideTCall(node)) return;

        context.report({
          node,
          messageId: 'noLiteral',
        });
      },

      TemplateLiteral(node) {
        if (!isRenderedAsJsxChild(node)) return;
        if (isInsideTCall(node)) return;

        const rawText = node.quasis.map((q) => q.value.cooked ?? '').join('');
        if (isWhitespaceOnly(rawText)) return;

        context.report({
          node,
          messageId: 'noLiteral',
        });
      },
    };
  },
};

export default noLiteralUiStrings;
