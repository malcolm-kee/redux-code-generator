import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { capitalize, isBoolStrNum } from '../lib';
import getWriter from './get-writer';

export const getStoreTypeName = (prefix: string) =>
  prefix ? `${capitalize(prefix)}Store` : 'RootStore';

function writeType(writer: CodeBlockWriter, object: any, name: string = '') {
  const isArray = Array.isArray(object);
  const value = isArray ? object[0] : object;
  const valType = typeof value;

  if (isNil(value)) {
    writer.writeLine(`readonly ${name}: ${isArray ? 'any[]' : 'any'};`);
  } else if (isBoolStrNum(valType)) {
    writer.writeLine(
      `readonly ${name}: ${isArray ? `${valType}[]` : valType};`
    );
  } else {
    if (isArray) {
      writer.write(`readonly ${name}: Array<`);
      writeType(writer, value);
      writer.write('>;');
    } else {
      writer
        .conditionalWrite(!!name, () => `readonly ${name}: `)
        .inlineBlock(() => {
          Object.keys(object).forEach(key =>
            writeType(writer, object[key], key)
          );
        });
    }
  }
}

export const generateType = (storeInitialState: any, prefix: string = '') => {
  const writer = getWriter();

  writer
    .writeLine(prefix ? `// ${prefix}.type.ts` : `// type.ts`)
    .write(`export interface ${getStoreTypeName(prefix)} `);

  writeType(writer, storeInitialState);

  return writer.toString();
};

export default generateType;
