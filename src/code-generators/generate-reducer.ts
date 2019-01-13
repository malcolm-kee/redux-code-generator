import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { lastItem } from '../lib';
import { getActionKey } from './generate-action-keys';
import getWriter from './get-writer';

function writeImportStatements(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer.writeLine(`// ${prefix}.reducer.js`);
    writer.writeLine(`import * as actionKeys from './${prefix}.action-keys';`);
  } else {
    writer.writeLine(`// root-reducer.js`);
    writer.writeLine(`import * as actionKeys from './action-keys';`);
  }
}

function writeDefaultState(writer: CodeBlockWriter, initialState: any) {
  writer
    .write(`const DEFAULT_STATE = `)
    .write(JSON.stringify(initialState, null, 2))
    .write(';');
}

function writeReducerCaseReturn(
  writer: CodeBlockWriter,
  keys: string[],
  depth = 0
) {
  writer.block(() => {
    if (keys.length === depth + 1) {
      const parentPaths = keys.slice(0, -1);
      writer.writeLine(`...${['state', ...parentPaths].join('.')},`);
      writer.writeLine(`${lastItem(keys)}: action.payload`);
    } else {
      const currentPaths = keys.slice(0, depth);
      writer.writeLine(`...${['state', ...currentPaths].join('.')},`);
      writer.write(`${keys[depth]}: `);
      writeReducerCaseReturn(writer, keys, depth + 1);
    }
  });
}

function writeReducerCase(writer: CodeBlockWriter, ...keys: string[]) {
  const ACTION_KEY = getActionKey(keys);

  writer.writeLine(`case actionKeys.${ACTION_KEY}:`);
  writer.indentBlock(() => {
    writer.write('return ');

    writeReducerCaseReturn(writer, keys.slice(1));
  });

  writer.blankLine();
}

function writeReducerForObject(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  Object.keys(object).forEach(key => {
    const value = object[key];

    if (!isNil(value)) {
      switch (typeof value) {
        case 'boolean':
        case 'string':
        case 'number':
          writeReducerCase(writer, ...prefixes, key);
          break;

        case 'object':
          writeReducerForObject(writer, value, ...prefixes, key);
          break;

        default:
          break;
      }
    } else {
      writeReducerCase(writer, ...prefixes, key);
    }
  });
}

function writeReducer(
  writer: CodeBlockWriter,
  initialState: any,
  prefix: string
) {
  const reducerFnName = prefix ? `${prefix}Reducer` : 'rootReducer';

  writer
    .write(`export const ${reducerFnName} = (state = DEFAULT_STATE, action) =>`)
    .block(() => {
      writer.writeLine(`switch (action.type)`).block(() => {
        writeReducerForObject(writer, initialState, prefix);

        writer.writeLine(`default:`).indentBlock(() => {
          writer.writeLine(`return state;`);
        });
      });
    });

  writer.blankLine();

  writer.writeLine(`export default ${reducerFnName};`);
}

export const generateReducer = (storeInitialState: any, prefix = '') => {
  const writer = getWriter();

  writeImportStatements(writer, prefix);

  writer.blankLine();

  writeDefaultState(writer, storeInitialState);

  writer.blankLine();

  writeReducer(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateReducer;
