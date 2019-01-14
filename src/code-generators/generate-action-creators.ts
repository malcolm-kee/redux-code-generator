import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { capitalize, lastItem } from '../lib';
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

function writeImportStatements(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer
      .writeLine(`// ${prefix}.actions.js`)
      .writeLine(`import * as actionKeys from './${prefix}.action-keys';`);
  } else {
    writer
      .writeLine(`// actions.js`)
      .writeLine(`import * as actionKeys from './action-keys';`);
  }
}

function writeActionCreator(
  writer: CodeBlockWriter,
  paramType: string,
  ...keys: string[]
) {
  const actionKey = getActionKey(keys);

  const sanitizedKeys = keys.filter(Boolean);

  const paramName = lastItem(sanitizedKeys);

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
}

function writeArrayActionCreator(
  writer: CodeBlockWriter,
  paramType: string,
  ...keys: string[]
) {
  const paramName = lastItem(keys);
  const singularParam = singular(paramName);
  writer
    .writeLine('/**')
    .writeLine(
      ` * @param {${
        paramType === '*' ? 'Array' : `${paramType}[]`
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
      switch (valueType) {
        case 'boolean':
        case 'string':
        case 'number':
          return writeArrayItemActionCreator(writer, valueType, ...keys, key);

        case 'object':
          return writeObjectArrayItemActionCreator(writer, value, ...keys, key);

        default:
          break;
      }
    } else {
      writeArrayItemActionCreator(writer, '*', ...keys, key);
    }
  });
}

function writeActionCreators(
  writer: CodeBlockWriter,
  object: any,
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
          isNil(value) || valueType === 'object' ? '*' : valueType,
          ...prefixes,
          key
        );
      }

      if (!isNil(value)) {
        switch (valueType) {
          case 'boolean':
          case 'string':
          case 'number':
            return isArray
              ? writeArrayItemActionCreator(
                  writer,
                  valueType,
                  ...prefixes,
                  singular(key)
                )
              : writeActionCreator(writer, valueType, ...prefixes, key);

          case 'object':
            return isArray
              ? writeObjectArrayItemActionCreator(
                  writer,
                  value,
                  ...prefixes,
                  singular(key)
                )
              : writeActionCreators(writer, value, ...prefixes, key);

          default:
            break;
        }
      } else {
        writeActionCreator(writer, '*', ...prefixes, key);
      }
    });
  }
}

export const generateActionCreators = (storeInitialState: any, prefix = '') => {
  const writer = getWriter();

  writeImportStatements(writer, prefix);

  writer.blankLine();

  writeActionCreators(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateActionCreators;
