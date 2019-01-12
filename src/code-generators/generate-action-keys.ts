import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';
import { isNil } from '../lib';

function writeActionKeysForValue(writer: CodeBlockWriter, ...keys: string[]) {
  const ACTION_NAME = [
    'SET',
    ...keys.map(key => key.toUpperCase()).filter(Boolean)
  ].join('_');
  writer.writeLine(`export const ${ACTION_NAME} = '${ACTION_NAME}';`);
}

function writeActionKeysForObject(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  if (object) {
    Object.keys(object).forEach(key => {
      const value = object[key];

      if (!isNil(value)) {
        switch (typeof value) {
          case 'boolean':
          case 'string':
          case 'number':
            writeActionKeysForValue(writer, ...prefixes, key);
            break;

          case 'object':
            writeActionKeysForObject(writer, value, ...prefixes, key);
            break;

          default:
            break;
        }
      } else {
        writeActionKeysForValue(writer, ...prefixes, key);
      }
    });
  }
}

export const generateActionKeys = (
  storeInitialState: any,
  prefix: string = ''
) => {
  const writer = getWriter();

  if (prefix) {
    writer.writeLine(`// ${prefix}-action-keys.js`);
  } else {
    writer.writeLine(`// action-keys.js`);
  }

  writeActionKeysForObject(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateActionKeys;
