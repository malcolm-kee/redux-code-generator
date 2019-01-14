import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { lastItem, isBoolStrNum } from '../lib';
import {
  getActionKey,
  getAddToArrayActionKey,
  getRemoveFromArrayActionKey
} from './generate-action-keys';
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

function writeReducerArrayOperationCaseReturn(
  writer: CodeBlockWriter,
  keys: string[],
  operation: 'add' | 'remove' | 'set',
  depth = 0
) {
  writer.block(() => {
    if (keys.length === depth + 1) {
      const parentPaths = keys.slice(0, -1);
      writer.writeLine(`...${['state', ...parentPaths].join('.')},`);
      if (operation === 'add') {
        writer.writeLine(
          `${lastItem(keys)}: ${['state', ...keys].join(
            '.'
          )}.concat(action.payload)`
        );
      } else if (operation === 'remove') {
        writer.writeLine(
          `${lastItem(keys)}: ${['state', ...keys].join(
            '.'
          )}.filter((_, index) => index !== action.payload)`
        );
      } else {
        writer.writeLine(
          `${lastItem(keys)}: ${['state', ...keys].join(
            '.'
          )}.map((item, index) => index === action.payload.index ? action.payload.${singular(
            lastItem(keys)
          )} : item)`
        );
      }
    } else {
      const currentPaths = keys.slice(0, depth);
      writer.writeLine(`...${['state', ...currentPaths].join('.')},`);
      writer.write(`${keys[depth]}: `);
      writeReducerArrayOperationCaseReturn(writer, keys, operation, depth + 1);
    }
  });
}

function writeReducerArrayItemCaseReturn(
  writer: CodeBlockWriter,
  propPath: string[] = [],
  depth = 0
) {
  writer.block(() => {
    if (propPath.length === depth + 1) {
      const parentPaths = propPath.slice(0, -1);
      writer.writeLine(`...${['item', ...parentPaths].join('.')},`);
      writer.writeLine(
        `${lastItem(propPath)}: action.payload.${lastItem(propPath)}`
      );
    } else {
      const currentPaths = propPath.slice(0, depth);
      writer.writeLine(`...${['item', ...currentPaths].join('.')},`);
      writer.write(`${propPath[depth]}: `);
      writeReducerArrayItemCaseReturn(writer, propPath, depth + 1);
    }
  });
}

function writeReducerCase(writer: CodeBlockWriter, ...keys: string[]) {
  writer
    .writeLine(`case actionKeys.${getActionKey(keys)}:`)
    .indentBlock(() => {
      writer.write('return ');
      writeReducerCaseReturn(writer, keys.slice(1)); // exclude prefix
    })
    .blankLine();
}

function writeReducerArrayCase(writer: CodeBlockWriter, ...keys: string[]) {
  writer
    .writeLine(`case actionKeys.${getActionKey(keys)}:`)
    .indentBlock(() => {
      writer.write('return ');
      writeReducerCaseReturn(writer, keys.slice(1)); // exclude prefix
    })
    .blankLine()
    .writeLine(`case actionKeys.${getAddToArrayActionKey(keys)}:`)
    .indentBlock(() => {
      writer.write('return');
      writeReducerArrayOperationCaseReturn(writer, keys.slice(1), 'add');
    })
    .blankLine()
    .writeLine(`case actionKeys.${getRemoveFromArrayActionKey(keys)}:`)
    .indentBlock(() => {
      writer.write('return');
      writeReducerArrayOperationCaseReturn(writer, keys.slice(1), 'remove');
    })
    .blankLine();
}

function writeReducerArrayItemCase(writer: CodeBlockWriter, ...keys: string[]) {
  writer
    .writeLine(
      `case actionKeys.${getActionKey([
        ...keys.slice(0, -1),
        singular(lastItem(keys))
      ])}:`
    )
    .indentBlock(() => {
      writer.write('return ');
      writeReducerArrayOperationCaseReturn(writer, keys.slice(1), 'set'); // exclude prefix
    })
    .blankLine();
}

function writeReducerArrayItemDescendantCase(
  writer: CodeBlockWriter,
  keysToArray: string[],
  propPath: string[]
) {
  const pathsToArray = keysToArray.slice(1);

  writer
    .writeLine(
      `case actionKeys.${getActionKey([
        ...keysToArray.slice(0, -1),
        singular(lastItem(keysToArray)),
        ...propPath
      ])}:`
    )
    .indentBlock(() => {
      writer.write('return ').block(() => {
        pathsToArray.forEach((_, index) => {
          if (pathsToArray.length === index + 1) {
            const parentPaths = pathsToArray.slice(0, -1);
            writer
              .writeLine(`...${['state', ...parentPaths].join('.')},`)
              .writeLine(
                `${lastItem(pathsToArray)}: ${['state', ...pathsToArray].join(
                  '.'
                )}.map((item, index) => index !== action.payload.index`
              )
              .writeLine(`? item`)
              .write(':');
            writeReducerArrayItemCaseReturn(writer, propPath);

            writer.write(')');
          } else {
            const currentPaths = pathsToArray.slice(0, index);
            writer.writeLine(`...${['state', ...currentPaths].join('.')},`);
            writer.write(`${pathsToArray[index]}: `);
          }
        });
      });
    })
    .blankLine();
}

function writeReducerArrayItemObjectCase(
  writer: CodeBlockWriter,
  value: any,
  keysToArray: string[],
  propPath: string[] = []
) {
  Object.keys(value).forEach(key => {
    const propValue = value[key];

    if (!isNil(propValue)) {
      isBoolStrNum(typeof propValue)
        ? writeReducerArrayItemDescendantCase(writer, keysToArray, [
            ...propPath,
            key
          ])
        : writeReducerArrayItemObjectCase(writer, propValue, keysToArray, [
            ...propPath,
            key
          ]);
    } else {
      writeReducerArrayItemDescendantCase(writer, keysToArray, [
        ...propPath,
        key
      ]);
    }
  });
}

function writeReducerForObject(
  writer: CodeBlockWriter,
  object: any,
  ...prefixes: string[]
) {
  Object.keys(object).forEach(key => {
    const isArray = Array.isArray(object[key]);
    const value = isArray ? object[key][0] : object[key];

    if (isArray) {
      writeReducerArrayCase(writer, ...prefixes, key);
    }

    if (!isNil(value)) {
      if (isBoolStrNum(typeof value)) {
        isArray
          ? writeReducerArrayItemCase(writer, ...prefixes, key)
          : writeReducerCase(writer, ...prefixes, key);
      } else {
        isArray
          ? writeReducerArrayItemObjectCase(writer, value, [...prefixes, key])
          : writeReducerForObject(writer, value, ...prefixes, key);
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
