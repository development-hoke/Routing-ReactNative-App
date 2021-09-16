module.exports = {
  plugins: ['stylelint-order'],
  extends: [
    'stylelint-config-standard',
    './node_modules/prettier-stylelint/config.js',
  ],
  ignoreFiles: ['**/node_modules/**'],
  rules: {
    indentation: 2,
    'string-quotes': 'single',
    'order/properties-alphabetical-order': true,
    'selector-type-no-unknown': null,
    'selector-type-case': null,
    'font-family-no-missing-generic-family-keyword': null,
    'rule-empty-line-before': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'padding-vertical',
          'padding-horizontal',
          'margin-vertical',
          'margin-horizontal',
          'shadow-color',
          'shadow-offset',
          'shadow-radius',
          'shadow-opacity',
        ],
      },
    ],
    'declaration-empty-line-before': null,
    'value-keyword-case': null,
  },
};
