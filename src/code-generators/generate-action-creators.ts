import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { capitalize, lastItem } from '../lib';
import { getActionKey } from './generate-action-keys';
import getWriter from './get-writer';

export const getActionCreatorName = (keys: string[]) =>
  ['set', ...keys.filter(Boolean).map(capitalize)].join('');

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

/**
 *
 * @param writer
 * @param keys
 */
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
    .writeLine(' */');

  writer
    .write(`export const ${getActionCreatorName(keys)} = ${paramName} => (`)
    .inlineBlock(() => {
      writer.writeLine(`type: actionKeys.${actionKey},`);
      writer.writeLine(`payload: ${paramName}`);
    });

  writer.write(');');

  writer.blankLine();
}

function writeActionCreators(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
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
            writeActionCreator(writer, valueType, ...prefixes, key);
            break;

          case 'object':
            writeActionCreators(writer, value, ...prefixes, key);
            break;

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
