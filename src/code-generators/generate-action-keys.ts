import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';

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

      if (value) {
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
      }
    });
  }
}

export const generateActionKeys = (
  storeInitialState: any,
  prefix: string = ''
): string => {
  const writer = getWriter();

  writeActionKeysForObject(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateActionKeys;
