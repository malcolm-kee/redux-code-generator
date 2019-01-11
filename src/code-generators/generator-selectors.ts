import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';
import { capitalize } from '../lib';

function writeBaseSelector(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer
      .writeLine(`// get the state of this store`)
      .writeLine(
        `const select${prefix.toUpperCase()}State = state => state.${prefix};`
      );
  } else {
    writer
      .writeLine(`// get the state of this store`)
      .writeLine(`const selectState = state => state;`);
  }
}

function writeSelector(
  writer: CodeBlockWriter,
  returnType: string,
  ...keys: string[]
) {
  const selectorName = ['select', ...keys.filter(Boolean).map(capitalize)].join(
    ''
  );

  const baseSelectorName = keys[0]
    ? `select${keys[0].toUpperCase()}State`
    : `selectState`;

  const paths = keys.slice(1);

  writer
    .writeLine('/**')
    .writeLine(` * @returns {${returnType}}`)
    .writeLine(' */')
    .writeLine(
      `export const ${selectorName} = state => ${baseSelectorName}(state).${paths.join(
        '.'
      )}`
    )
    .blankLine();
}

function writeSelectors(
  writer: CodeBlockWriter,
  object: any,
  ...prefix: string[]
) {
  if (object) {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const valueType = typeof value;

      switch (valueType) {
        case 'boolean':
        case 'string':
        case 'number':
          writeSelector(writer, valueType, ...prefix, key);
          break;

        case 'object':
          writeSelectors(writer, value, ...prefix, key);
          break;

        default:
          break;
      }
    });
  }
}

export const generateSelectors = (storeInitialState: any, prefix = '') => {
  const writer = getWriter();

  writer
    .writeLine(prefix ? `// ${prefix}-selectors.js` : '// selectors.js')
    .blankLine();

  writeBaseSelector(writer, prefix);

  writer.blankLine();

  writeSelectors(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateSelectors;
