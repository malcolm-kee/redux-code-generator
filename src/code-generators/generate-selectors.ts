import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { capitalize, lastItem, isBoolStrNum } from '../lib';
import getWriter from './get-writer';
import { singular } from 'pluralize';

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

function writeArraySelector(
  writer: CodeBlockWriter,
  returnType: string | null,
  keysToArray: string[],
  pathsToProps: string[] = []
) {
  const pathsToArray = keysToArray.slice(1);

  if (returnType) {
    writer
      .writeLine('/**')
      .writeLine(` * @returns {${returnType}}`)
      .writeLine(' */');
  }

  writer
    .writeLine(
      `export const ${getSelectorName([
        ...keysToArray.slice(0, -1),
        singular(lastItem(keysToArray)),
        ...pathsToProps
      ])} = (state, index) => ${getBaseSelectorName(
        keysToArray[0]
      )}(state).${pathsToArray.join('.')}[index]${
        pathsToProps.length === 0 ? '' : `.${pathsToProps.join('.')}`
      };`
    )
    .blankLine();
}

function writeArrayDescendentSelector(
  writer: CodeBlockWriter,
  object: any,
  keysToArray: string[],
  pathsToProps: string[] = []
) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    const valueType = typeof value;

    if (!isNil(value)) {
      isBoolStrNum(valueType)
        ? writeArraySelector(writer, valueType, keysToArray, [
            ...pathsToProps,
            key
          ])
        : writeArrayDescendentSelector(writer, value, keysToArray, [
            ...pathsToProps,
            key
          ]);
    } else {
      writeArraySelector(writer, null, keysToArray, [...pathsToProps, key]);
    }
  });
}

function writeSelectors(
  writer: CodeBlockWriter,
  object: any,
  ...prefix: string[]
) {
  if (object) {
    Object.keys(object).forEach(key => {
      const isArray = Array.isArray(object[key]);
      const value = isArray ? object[key][0] : object[key];
      const valueType = typeof value;

      if (isArray) {
        const arrayType =
          !isNil(value) && valueType !== 'object' ? `${valueType}[]` : null;

        writeSelector(writer, arrayType, ...prefix, key);
      }

      if (!isNil(value)) {
        if (isBoolStrNum(valueType)) {
          isArray
            ? writeArraySelector(writer, valueType, [...prefix, key])
            : writeSelector(writer, valueType, ...prefix, key);
        } else {
          isArray
            ? writeArrayDescendentSelector(writer, value, [...prefix, key])
            : writeSelectors(writer, value, ...prefix, key);
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
    .writeLine(prefix ? `// ${prefix}.selectors.js` : '// selectors.js')
    .blankLine();

  writeBaseSelector(writer, prefix);

  writer.blankLine();

  writeSelectors(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateSelectors;
