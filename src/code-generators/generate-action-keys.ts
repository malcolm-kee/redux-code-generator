import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { lastItem, upperCase, isBoolStrNum } from '../lib';
import getWriter from './get-writer';

const splitKeyWords = (words: string[]) =>
  words.reduce<string[]>(
    (result, key) => result.concat(key.split(/(?=[A-Z])/)),
    []
  );

export const getActionKey = (keys: string[]) =>
  [
    'SET',
    ...splitKeyWords(keys)
      .map(upperCase)
      .filter(Boolean)
  ].join('_');

export const getAddToArrayActionKey = (keys: string[]) => {
  const terms = splitKeyWords(keys.filter(Boolean));
  const finalKeys = [...terms.slice(0, -1), singular(lastItem(terms))].map(
    upperCase
  );

  return ['ADD', ...finalKeys].join('_');
};

export const getRemoveFromArrayActionKey = (keys: string[]) => {
  const terms = splitKeyWords(keys.filter(Boolean));
  const finalKeys = [...terms.slice(0, -1), singular(lastItem(terms))].map(
    upperCase
  );

  return ['REMOVE', ...finalKeys].join('_');
};

function writeActionKey(writer: CodeBlockWriter, actionName: string) {
  writer.writeLine(`export const ${actionName} = '${actionName}';`);
}

function writeActionKeysForValue(writer: CodeBlockWriter, ...keys: string[]) {
  writeActionKey(writer, getActionKey(keys));
}

function writeActionKeysForArray(writer: CodeBlockWriter, ...keys: string[]) {
  writeActionKey(writer, getActionKey(keys));
  writeActionKey(writer, getAddToArrayActionKey(keys));
  writeActionKey(writer, getRemoveFromArrayActionKey(keys));
}

function writeActionKeysForObject(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  if (object) {
    Object.keys(object).forEach(key => {
      const isArray = Array.isArray(object[key]);

      const value = isArray ? object[key][0] : object[key];

      if (isArray) {
        writeActionKeysForArray(writer, ...prefixes, key);
      }

      if (!isNil(value)) {
        isBoolStrNum(typeof value)
          ? writeActionKeysForValue(writer, ...prefixes, singular(key))
          : writeActionKeysForObject(writer, value, ...prefixes, singular(key));
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
