import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { capitalize, isBoolStrNum, isJs, lastItem } from '../lib';
import { SupportedLanguage } from '../redux/redux.type';
import getWriter from './get-writer';

const getBaseSelectorName = (prefix: string) =>
  prefix ? `select${capitalize(prefix)}State` : 'selectState';

export const getSelectorName = (keys: string[]) =>
  ['select', ...keys.filter(Boolean).map(capitalize)].join('');

function writeBaseSelector(
  writer: CodeBlockWriter,
  prefix: string,
  lang: SupportedLanguage
) {
  const isTs = !isJs(lang);

  writer
    .writeLine(`// get the state of this store`)
    .writeLine(
      prefix
        ? `const ${getBaseSelectorName(prefix)} = ${
            isTs ? '(state: IRootStore)' : 'state'
          } => state.${prefix};`
        : `const ${getBaseSelectorName(prefix)} = ${
            isTs ? '(state: IRootStore)' : 'state'
          } => state;`
    );
}

function writeSelector(
  writer: CodeBlockWriter,
  lang: SupportedLanguage,
  returnType: string | null,
  ...keys: string[]
) {
  const paths = keys.slice(1);
  const isTs = !isJs(lang);

  if (returnType && !isTs) {
    writer
      .writeLine('/**')
      .writeLine(` * @returns {${returnType}}`)
      .writeLine(' */');
  }

  writer
    .writeLine(
      `export const ${getSelectorName(keys)} = ${
        isTs ? '(state: IRootStore)' : 'state'
      } => ${getBaseSelectorName(keys[0])}(state).${paths.join('.')};`
    )
    .blankLine();
}

function writeArraySelector(
  writer: CodeBlockWriter,
  lang: SupportedLanguage,
  returnType: string | null,
  keysToArray: string[],
  pathsToProps: string[] = []
) {
  const pathsToArray = keysToArray.slice(1);
  const isTs = !isJs(lang);

  if (returnType && !isTs) {
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
      ])} = ${
        isTs ? '(state: IRootStore, index: number)' : '(state, index)'
      } => ${getBaseSelectorName(keysToArray[0])}(state).${pathsToArray.join(
        '.'
      )}[index]${
        pathsToProps.length === 0 ? '' : `.${pathsToProps.join('.')}`
      };`
    )
    .blankLine();
}

function writeArrayDescendentSelector(
  writer: CodeBlockWriter,
  lang: SupportedLanguage,
  object: any,
  keysToArray: string[],
  pathsToProps: string[] = []
) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    const valueType = typeof value;

    if (!isNil(value)) {
      isBoolStrNum(valueType)
        ? writeArraySelector(writer, lang, valueType, keysToArray, [
            ...pathsToProps,
            key
          ])
        : writeArrayDescendentSelector(writer, lang, value, keysToArray, [
            ...pathsToProps,
            key
          ]);
    } else {
      writeArraySelector(writer, lang, null, keysToArray, [
        ...pathsToProps,
        key
      ]);
    }
  });
}

function writeSelectors(
  writer: CodeBlockWriter,
  lang: SupportedLanguage,
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

        writeSelector(writer, lang, arrayType, ...prefix, key);
      }

      if (!isNil(value)) {
        if (isBoolStrNum(valueType)) {
          isArray
            ? writeArraySelector(writer, lang, valueType, [...prefix, key])
            : writeSelector(writer, lang, valueType, ...prefix, key);
        } else {
          isArray
            ? writeArrayDescendentSelector(writer, lang, value, [
                ...prefix,
                key
              ])
            : writeSelectors(writer, lang, value, ...prefix, key);
        }
      } else {
        writeSelector(writer, lang, null, ...prefix, key);
      }
    });
  }
}

export const generateSelectors = (
  storeInitialState: any,
  prefix = '',
  lang: SupportedLanguage
) => {
  const writer = getWriter();

  const ext = isJs(lang) ? 'js' : 'ts';

  writer
    .writeLine(prefix ? `// ${prefix}.selectors.${ext}` : `// selectors.${ext}`)
    .conditionalWriteLine(
      !isJs(lang),
      () => `import { IRootStore } from './root.type';`
    )
    .blankLine();

  writeBaseSelector(writer, prefix, lang);

  writer.blankLine();

  writeSelectors(writer, lang, storeInitialState, prefix);

  return writer.toString();
};

export default generateSelectors;
