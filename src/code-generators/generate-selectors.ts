import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';
import { capitalize, isNil } from '../lib';

const getBaseSelectorName = (prefix: string) =>
  prefix ? `select${capitalize(prefix)}State` : 'selectState';

export const getSelectorName = (keys: string[]) =>
  ['select', ...keys.filter(Boolean).map(capitalize)].join('');

function writeBaseSelector(writer: CodeBlockWriter, prefix: string) {
  writer
    .writeLine(`// get the state of this store`)
    .writeLine(
      prefix
        ? `const ${getBaseSelectorName(prefix)} = state => state.${prefix};`
        : `const ${getBaseSelectorName(prefix)} = state => state;`
    );
}

function writeSelector(
  writer: CodeBlockWriter,
  returnType: string | null,
  ...keys: string[]
) {
  const paths = keys.slice(1);

  if (returnType) {
    writer
      .writeLine('/**')
      .writeLine(` * @returns {${returnType}}`)
      .writeLine(' */');
  }

  writer
    .writeLine(
      `export const ${getSelectorName(keys)} = state => ${getBaseSelectorName(
        keys[0]
      )}(state).${paths.join('.')};`
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

      if (!isNil(value)) {
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
      } else {
        writeSelector(writer, null, ...prefix, key);
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
