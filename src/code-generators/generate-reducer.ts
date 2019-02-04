import CodeBlockWriter from 'code-block-writer';
import { singular } from 'pluralize';
import { isNil } from 'typesafe-is';
import { lastItem, isBoolStrNum, isJs, capitalize } from '../lib';
import {
  getActionKey,
  getAddToArrayActionKey,
  getRemoveFromArrayActionKey
} from './generate-action-keys';
import getWriter from './get-writer';
import { SupportedLanguage } from '../redux/redux.type';
import { getStoreTypeName } from './generate-type';

function writeImportStatements(
  writer: CodeBlockWriter,
  prefix: string,
  lang: SupportedLanguage
) {
  const isTs = !isJs(lang);
  const ext = isTs ? 'ts' : 'js';

  writer
    .writeLine(
      prefix ? `// ${prefix}.reducer.${ext}` : `// root-reducer.${ext}`
    )
    .conditionalWriteLine(
      isTs,
      () => `import { ActionType } from 'typesafe-actions';`
    )
    .writeLine(
      prefix
        ? `import * as actionKeys from './${prefix}.action-keys';`
        : `import * as actionKeys from './action-keys';`
    )
    .conditionalWriteLine(
      isTs,
      () =>
        `import * as actions from './${
          prefix ? `${prefix}.actions` : 'actions'
        }';`
    )
    .conditionalWriteLine(
      isTs,
      () =>
        `import { ${getStoreTypeName(prefix)} } from './${
          prefix ? `${prefix}.type` : `type`
        }';`
    );
}

function writeDefaultState(
  writer: CodeBlockWriter,
  initialState: any,
  lang: SupportedLanguage,
  prefix: string
) {
  writer
    .write(
      isJs(lang)
        ? `const DEFAULT_STATE = `
        : `const DEFAULT_STATE: ${getStoreTypeName(prefix)} = `
    )
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
  lang: SupportedLanguage,
  initialState: any,
  prefix: string
) {
  const isTs = !isJs(lang);
  const reducerFnName = prefix ? `${prefix}Reducer` : 'rootReducer';
  const actionTypeName = `${capitalize(prefix)}Action`;

  if (isTs) {
    writer
      .writeLine(`type ${actionTypeName} = ActionType<typeof actions>;`)
      .blankLine();
  }

  writer
    .write(
      isTs
        ? `export const ${reducerFnName} = (state = DEFAULT_STATE, action: ${actionTypeName}): ${getStoreTypeName(
            prefix
          )} =>`
        : `export const ${reducerFnName} = (state = DEFAULT_STATE, action) =>`
    )
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

export const generateReducer = (
  storeInitialState: any,
  prefix = '',
  lang: SupportedLanguage
) => {
  const writer = getWriter();

  writeImportStatements(writer, prefix, lang);

  writer.blankLine();

  writeDefaultState(writer, storeInitialState, lang, prefix);

  writer.blankLine();

  writeReducer(writer, lang, storeInitialState, prefix);

  return writer.toString();
};

export default generateReducer;

export const generateRootReducer = (
  prefix: string,
  lang: SupportedLanguage
) => {
  if (!prefix) return '';

  const writer = getWriter();

  const reducerName = `${prefix}Reducer`;
  const isTs = !isJs(lang);
  const ext = isTs ? 'ts' : 'js';

  writer
    .writeLine(`// root-reducer.${ext}`)
    .writeLine(`import { combineReducers } from 'redux';`)
    .conditionalWriteLine(
      isTs,
      () => `import { IRootStore } from './root.type';`
    )
    .writeLine(`import ${reducerName} from './${prefix}.reducer';`)
    .blankLine()
    .write(
      isTs
        ? `const rootReducer = combineReducers<IRootStore>(`
        : `const rootReducer = combineReducers(`
    )
    .inlineBlock(() => {
      writer.writeLine(`${prefix}: ${reducerName}`);
    })
    .write(');')
    .blankLine()
    .writeLine(`export default rootReducer;`);

  return writer.toString();
};
