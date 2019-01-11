import CodeBlockWriter from 'code-block-writer';
import getWriter from './get-writer';

function writeDefaultState(writer: CodeBlockWriter, initialState: any) {
  writer
    .write(`const DEFAULT_STATE = `)
    .write(JSON.stringify(initialState))
    .write(';');
}

function writeReducerCase(writer: CodeBlockWriter, ...keys: string[]) {
  const sanitizedKeys = keys.filter(Boolean);

  const ACTION_KEY = [
    'SET',
    ...sanitizedKeys.map(key => key.toUpperCase())
  ].join('_');

  writer.writeLine(`case actionKeys.${ACTION_KEY}:`);
  writer.indentBlock(() => {
    writer.write('return ').block(() => {
      writer.writeLine(`...state,`);
    });
  });
}

function writeReducerForObject(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  Object.keys(object).forEach(key => {
    const defaultValue = object[key];

    switch (typeof defaultValue) {
      case 'boolean':
      case 'string':
      case 'number':
        writeReducerCase(writer, ...prefixes, key);
        break;

      case 'object':
        writeReducerForObject(writer, defaultValue, ...prefixes, key);
        break;

      default:
        break;
    }
  });
}

function writeReducer(
  writer: CodeBlockWriter,
  initialState: any,
  prefix: string
) {
  writer
    .write(`export const ${prefix}Reducer = (state = DEFAULT_STATE, action) =>`)
    .block(() => {
      writer.writeLine(`switch (action.type)`).block(() => {
        writeReducerForObject(writer, initialState, prefix);

        writer.writeLine(`default:`).indentBlock(() => {
          writer.writeLine(`return state;`);
        });
      });
    });
}

export const generateReducer = (storeInitialState: any, prefix = '') => {
  const writer = getWriter();

  if (prefix) {
    writer.writeLine(`// ${prefix}-reducer.js`);
    writer.writeLine(`import * as actionKeys from './${prefix}-action-keys';`);
  } else {
    writer.writeLine(`// reducer.js`);
    writer.writeLine(`import * as actionKeys from './action-keys';`);
  }

  writer.blankLine();

  writeDefaultState(writer, storeInitialState);

  writer.blankLine();

  writeReducer(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateReducer;
