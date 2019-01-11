import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';
import { lastItem, capitalize, isNil } from '../lib';

function writeImportStatements(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer
      .writeLine(`// ${prefix}-actions.js`)
      .writeLine(`import * as actionKeys from './${prefix}-action-keys';`);
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
  const sanitizedKeys = keys.filter(Boolean);

  const actionKey = [
    'SET',
    ...sanitizedKeys.map(key => key.toUpperCase())
  ].join('_');

  const paramName = lastItem(sanitizedKeys);

  const functionName = ['set', ...sanitizedKeys.map(capitalize)].join('');

  writer
    .writeLine('/**')
    .writeLine(` * @param {${paramType}} ${paramName} `)
    .writeLine(' */');

  writer
    .write(`export const ${functionName} = ${paramName} => (`)
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
