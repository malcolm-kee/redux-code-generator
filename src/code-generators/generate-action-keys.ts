import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import getWriter from './get-writer';

export const getActionKey = (keys: string[]) =>
  [
    'SET',
    ...keys
      .reduce<string[]>(
        (result, key) => result.concat(key.split(/(?=[A-Z])/)),
        []
      )
      .map(key => key.toUpperCase())
      .filter(Boolean)
  ].join('_');

function writeActionKeysForValue(writer: CodeBlockWriter, ...keys: string[]) {
  const ACTION_NAME = getActionKey(keys);
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

  writer.writeLine(
    prefix ? `// ${prefix}.action-keys.js` : `// action-keys.js`
  );

  writeActionKeysForObject(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateActionKeys;
