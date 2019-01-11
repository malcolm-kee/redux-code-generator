import CodeBlockWriter from 'code-block-writer';
import { capitalize, lastItem } from '../lib';
import generateData from './generate-data';
import getWriter from './get-writer';

const getReducerName = (prefix: string) =>
  prefix ? `${prefix}Reducer` : 'rootReducer';

const getActionCreatorName = (keys: string[]) =>
  ['set', ...keys.filter(Boolean).map(capitalize)].join('');

const getSelectorName = (keys: string[]) =>
  ['select', ...keys.filter(Boolean).map(capitalize)].join('');

function writeImports(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer
      .writeLine(`// ${prefix}-store.test.js`)
      .writeLine(`import * as actionCreators from './${prefix}-actions';`)
      .writeLine(`import ${getReducerName(prefix)} from './${prefix}-reducer';`)
      .writeLine(`import * as selectors from './${prefix}-selectors';`);
  } else {
    writer
      .writeLine(`// store.test.js`)
      .writeLine(`import * as actionCreators from './actions';`)
      .writeLine(`import ${getReducerName(prefix)} from './root-reducer';`)
      .writeLine(`import * as selectors from './selectors';`);
  }
}

function writeTest(
  writer: CodeBlockWriter,
  valueType: 'string' | 'boolean' | 'number',
  ...keys: string[]
) {
  const actionCreatorName = getActionCreatorName(keys);
  const data = generateData(valueType, lastItem(keys));
  const selectorName = getSelectorName(keys);

  writer
    .write(`test('${actionCreatorName}', () => `)
    .inlineBlock(() => {
      writer
        .writeLine(
          `const action = actionCreators.${actionCreatorName}(${data});`
        )
        .writeLine(
          `const finalState = ${getReducerName(keys[0])}(initialState, action);`
        )
        .blankLine()
        .writeLine(
          `expect(selectors.${selectorName}(finalState)).toEqual(${data})`
        )
        .writeLine(`// assert new object is created`)
        .writeLine(`expect(finalState).not.toBe(initialState);`);
    })
    .write(');')
    .blankLine();
}

function writeTests(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    const valueType = typeof value;

    switch (valueType) {
      case 'boolean':
      case 'string':
      case 'number':
        writeTest(writer, valueType, ...prefixes, key);
        break;

      case 'object':
        writeTests(writer, value, ...prefixes, key);
        break;

      default:
        break;
    }
  });
}

function writeAllTests(writer: CodeBlockWriter, object: any, prefix: string) {
  const reducerName = getReducerName(prefix);

  writer
    .write(`describe('${reducerName}', () => `)
    .inlineBlock(() => {
      writer
        .writeLine(
          `const initialState = ${reducerName}(undefined, '@/Init_Store');`
        )
        .blankLine();

      writeTests(writer, object, prefix);
    })
    .write(');');
}

const generateTests = (storeInitialState: any, prefix = '') => {
  const writer = getWriter();

  writeImports(writer, prefix);

  writer.blankLine();

  writeAllTests(writer, storeInitialState, prefix);

  return writer.toString();
};

export default generateTests;
