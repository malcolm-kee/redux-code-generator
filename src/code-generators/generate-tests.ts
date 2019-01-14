import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { lastItem, isBoolStrNum } from '../lib';
import {
  getActionCreatorName,
  getAddToArrayActionCreatorName,
  getRemoveFromArrayActionCreatorName
} from './generate-action-creators';
import generateData from './generate-data';
import { getSelectorName } from './generate-selectors';
import getWriter from './get-writer';

const getReducerName = (prefix: string) =>
  prefix ? `${prefix}Reducer` : 'rootReducer';

function writeImports(writer: CodeBlockWriter, prefix: string) {
  if (prefix) {
    writer
      .writeLine(`// ${prefix}-store.test.js`)
      .writeLine(`import * as actionCreators from './${prefix}.actions';`)
      .writeLine(`import ${getReducerName(prefix)} from './${prefix}.reducer';`)
      .writeLine(`import * as selectors from './${prefix}.selectors';`);
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
  valueType: 'string' | 'boolean' | 'number' | null,
  ...keys: string[]
) {
  const actionCreatorName = getActionCreatorName(keys);
  const data = valueType ? generateData(valueType, lastItem(keys)) : `{}`;
  const selectorName = getSelectorName(keys);

  writer
    .write(`test('${actionCreatorName}', () => `)
    .inlineBlock(() => {
      writer
        .write(`const action = actionCreators.${actionCreatorName}(${data});`)
        .conditionalWrite(!valueType, () => ` // populate data?`)
        .newLine()
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

function writeArrayOperationTests(
  writer: CodeBlockWriter,
  value: any,
  ...keys: string[]
) {
  const valueType = typeof value;
  const canGenerateData = !isNil(value) && isBoolStrNum(valueType);
  const setArraysActionCreatorName = getActionCreatorName(keys);
  const addToArrayActionCreatorName = getAddToArrayActionCreatorName(keys);
  const removeFromArrayActionCreatorName = getRemoveFromArrayActionCreatorName(
    keys
  );
  const data = canGenerateData
    ? generateData(valueType as any, lastItem(keys))
    : '{}';
  const secondData = canGenerateData
    ? generateData(valueType as any, lastItem(keys))
    : '{}';
  const selectorName = getSelectorName(keys);

  writer
    .write(`test('${setArraysActionCreatorName}', () => `)
    .inlineBlock(() => {
      writer
        .write(
          `const action = actionCreators.${setArraysActionCreatorName}([${data}]);`
        )
        .conditionalWrite(!canGenerateData, () => ` // populate data?`)
        .newLine()
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
    .blankLine()
    .write(`test('${addToArrayActionCreatorName}', () => `)
    .inlineBlock(() => {
      writer
        .write(
          `const action = actionCreators.${addToArrayActionCreatorName}(${secondData});`
        )
        .conditionalWrite(!canGenerateData, () => ` // populate data?`)
        .newLine()
        .writeLine(
          `const finalState = ${getReducerName(keys[0])}(initialState, action);`
        )
        .blankLine()
        .writeLine(
          `expect(selectors.${selectorName}(finalState)).toContainEqual(${secondData})`
        )
        .writeLine(`// assert new object is created`)
        .writeLine(`expect(finalState).not.toBe(initialState);`);
    })
    .write(');')
    .blankLine()
    .write(`test('${removeFromArrayActionCreatorName}', () => `)
    .inlineBlock(() => {
      writer.writeLine(
        `const oriState = ${getReducerName(
          keys[0]
        )}(initialState, actions.${setArraysActionCreatorName}([${data}, ${secondData}]))`
      );
      writer
        .write(
          `const action = actionCreators.${removeFromArrayActionCreatorName}(0);`
        )
        .conditionalWrite(!canGenerateData, () => ` // populate data?`)
        .newLine()
        .writeLine(
          `const finalState = ${getReducerName(keys[0])}(oriState, action);`
        )
        .blankLine()
        .writeLine(
          `expect(selectors.${selectorName}(finalState)).not.toContainEqual(${data})`
        )
        .writeLine(
          `expect(selectors.${selectorName}(finalState)).toContainEqual(${secondData})`
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
    const isArray = Array.isArray(object[key]);
    const value = isArray ? object[key][0] : object[key];
    const valueType = typeof value;

    if (isArray) {
      writeArrayOperationTests(writer, value, ...prefixes, key);
    }

    if (!isNil(value)) {
      if (isBoolStrNum(valueType)) {
        writeTest(writer, valueType, ...prefixes, key);
      } else {
        writeTests(writer, value, ...prefixes, key);
      }
    } else {
      writeTest(writer, null, ...prefixes, key);
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
