import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { capitalize, isBoolStrNum, lastItem, isJs } from '../lib';
import { SupportedLanguage } from '../redux/redux.type';
import {
  getActionKey,
  getAddToArrayActionKey,
  getRemoveFromArrayActionKey
} from './generate-action-keys';
import getWriter from './get-writer';

export const getActionCreatorName = (keys: string[]) =>
  ['set', ...keys.filter(Boolean).map(capitalize)].join('');

export const getAddToArrayActionCreatorName = (keys: string[]) => {
  const terms = keys.filter(Boolean);
  const finalKeys = [...terms.slice(0, -1), singular(lastItem(terms))].map(
    capitalize
  );

  return ['add', ...finalKeys].join('');
};

export const getRemoveFromArrayActionCreatorName = (keys: string[]) => {
  const terms = keys.filter(Boolean);
  const finalKeys = [...terms.slice(0, -1), singular(lastItem(terms))].map(
    capitalize
  );

  return ['remove', ...finalKeys].join('');
};

function writeImportStatements(
  writer: CodeBlockWriter,
  prefix: string,
  language: SupportedLanguage
) {
  const ext = isJs(language) ? 'js' : 'ts';

  if (prefix) {
    writer
      .writeLine(`// ${prefix}.actions.${ext}`)
      .conditionalWriteLine(
        !isJs(language),
        () => `import { action } from 'typesafe-actions';`
      )
      .writeLine(`import * as actionKeys from './${prefix}.action-keys';`);
  } else {
    writer
      .writeLine(`// actions.${ext}`)
      .conditionalWriteLine(
        !isJs(language),
        () => `import { action } from 'typesafe-actions';`
      )
      .writeLine(`import * as actionKeys from './action-keys';`);
  }
}

function writeActionCreator(
  writer: CodeBlockWriter,
  paramType: string,
  lang: SupportedLanguage,
  ...keys: string[]
) {
  const actionKey = getActionKey(keys);

  const sanitizedKeys = keys.filter(Boolean);

  const paramName = lastItem(sanitizedKeys);

  if (isJs(lang)) {
    writer
      .writeLine('/**')
      .writeLine(` * @param {${paramType}} ${paramName} `)
      .writeLine(' */')
      .write(`export const ${getActionCreatorName(keys)} = ${paramName} => (`)
      .inlineBlock(() => {
        writer.writeLine(`type: actionKeys.${actionKey},`);
        writer.writeLine(`payload: ${paramName}`);
      })
      .write(');')
      .blankLine();
  } else {
    writer
      .writeLine(
        `export const ${getActionCreatorName(
          keys
        )} = (${paramName}: ${paramType}) => action(actionKeys.${actionKey}, ${paramName})`
      )
      .blankLine();
  }
}

function writeArrayActionCreator(
  writer: CodeBlockWriter,
  paramType: string,
  lang: SupportedLanguage,
  ...keys: string[]
) {
  const paramName = lastItem(keys);
  const singularParam = singular(paramName);

  if (isJs(lang)) {
    writer
      .writeLine('/**')
      .writeLine(
        ` * @param {${
          paramType === 'any' ? 'Array' : `${paramType}[]`
        }} ${paramName} `
      )
      .writeLine(' */')
      .write(`export const ${getActionCreatorName(keys)} = ${paramName} => (`)
      .inlineBlock(() => {
        writer.writeLine(`type: actionKeys.${getActionKey(keys)},`);
        writer.writeLine(`payload: ${paramName}`);
      })
      .write(');')
      .blankLine()
      .writeLine('/**')
      .writeLine(` * @param {${paramType}} ${singularParam} `)
      .writeLine(' */')
      .write(
        `export const ${getAddToArrayActionCreatorName(
          keys
        )} = ${singularParam} => (`
      )
      .inlineBlock(() => {
        writer.writeLine(`type: actionKeys.${getAddToArrayActionKey(keys)},`);
        writer.writeLine(`payload: ${singularParam}`);
      })
      .write(');')
      .blankLine()
      .writeLine('/**')
      .writeLine(` * @param {number} index `)
      .writeLine(' */')
      .write(
        `export const ${getRemoveFromArrayActionCreatorName(keys)} = index => (`
      )
      .inlineBlock(() => {
        writer.writeLine(
          `type: actionKeys.${getRemoveFromArrayActionKey(keys)},`
        );
        writer.writeLine(`payload: index`);
      })
      .write(');')
      .blankLine();
  } else {
    writer
      .write(
        `export const ${getActionCreatorName(
          keys
        )} = (${paramName}: ${paramType}[]) => (`
      )
      .inlineBlock(() => {
        writer.writeLine(`type: actionKeys.${getActionKey(keys)},`);
        writer.writeLine(`payload: ${paramName}`);
      })
      .write(');')
      .blankLine()
      .writeLine('/**')
      .writeLine(` * @param {${paramType}} ${singularParam} `)
      .writeLine(' */')
      .write(
        `export const ${getAddToArrayActionCreatorName(
          keys
        )} = ${singularParam} => (`
      )
      .inlineBlock(() => {
        writer.writeLine(`type: actionKeys.${getAddToArrayActionKey(keys)},`);
        writer.writeLine(`payload: ${singularParam}`);
      })
      .write(');')
      .blankLine()
      .writeLine('/**')
      .writeLine(` * @param {number} index `)
      .writeLine(' */')
      .write(
        `export const ${getRemoveFromArrayActionCreatorName(keys)} = index => (`
      )
      .inlineBlock(() => {
        writer.writeLine(
          `type: actionKeys.${getRemoveFromArrayActionKey(keys)},`
        );
        writer.writeLine(`payload: index`);
      })
      .write(');')
      .blankLine();
  }
}

function writeArrayItemActionCreator(
  writer: CodeBlockWriter,
  paramType: string,
  ...keys: string[]
) {
  const actionKey = getActionKey(keys);

  const sanitizedKeys = keys.filter(Boolean);

  const paramName = lastItem(sanitizedKeys);

  writer
    .writeLine('/**')
    .writeLine(` * @param {number} index `)
    .writeLine(` * @param {${paramType}} ${paramName} `)
    .writeLine(' */')
    .write(
      `export const ${getActionCreatorName(keys)} = (index, ${paramName}) => (`
    )
    .inlineBlock(() => {
      writer.writeLine(`type: actionKeys.${actionKey},`);
      writer.writeLine(`payload: { index, ${paramName} }`);
    })
    .write(');')
    .blankLine();
}

function writeObjectArrayItemActionCreator(
  writer: CodeBlockWriter,
  object: any,
  ...keys: string[]
) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    const valueType = typeof value;

    if (!isNil(value)) {
      isBoolStrNum(valueType)
        ? writeArrayItemActionCreator(writer, valueType, ...keys, key)
        : writeObjectArrayItemActionCreator(writer, value, ...keys, key);
    } else {
      writeArrayItemActionCreator(writer, '*', ...keys, key);
    }
  });
}

function writeActionCreators(
  writer: CodeBlockWriter,
  object: any,
  language: SupportedLanguage,
  ...prefixes: string[]
) {
  if (object) {
    Object.keys(object).forEach(key => {
      const isArray = Array.isArray(object[key]);
      const value = isArray ? object[key][0] : object[key];
      const valueType = typeof value;

      if (isArray) {
        writeArrayActionCreator(
          writer,
          isNil(value) || valueType === 'object' ? 'any' : valueType,
          language,
          ...prefixes,
          key
        );
      }

      if (!isNil(value)) {
        if (isBoolStrNum(valueType)) {
          isArray
            ? writeArrayItemActionCreator(
                writer,
                valueType,
                ...prefixes,
                singular(key)
              )
            : writeActionCreator(writer, valueType, language, ...prefixes, key);
        } else {
          isArray
            ? writeObjectArrayItemActionCreator(
                writer,
                value,
                ...prefixes,
                singular(key)
              )
            : writeActionCreators(writer, value, language, ...prefixes, key);
        }
      } else {
        writeActionCreator(writer, 'any', language, ...prefixes, key);
      }
    });
  }
}

export const generateActionCreators = (
  storeInitialState: any,
  prefix = '',
  language: SupportedLanguage
) => {
  const writer = getWriter();

  writeImportStatements(writer, prefix, language);

  writer.blankLine();

  writeActionCreators(writer, storeInitialState, language, prefix);

  return writer.toString();
};

export default generateActionCreators;
