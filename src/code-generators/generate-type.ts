import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { capitalize, isBoolStrNum } from '../lib';
import getWriter from './get-writer';

export const getStoreTypeName = (prefix: string) =>
  prefix ? `${capitalize(prefix)}Store` : 'RootStore';

function writeType(writer: CodeBlockWriter, name: string, type: string) {
  writer.writeLine(`readonly ${name}: ${type};`);
}

function writeObjectType(writer: CodeBlockWriter, object: any) {
  if (object) {
    writer.inlineBlock(() => {
      Object.keys(object).forEach(key => {
        const isArray = Array.isArray(object[key]);

        const value = isArray ? object[key][0] : object[key];
        const valType = typeof value;

        if (!isNil(value)) {
          if (isBoolStrNum(valType)) {
            writeType(writer, key, isArray ? `${valType}[]` : valType);
          } else {
            if (isArray) {
              writer.write(`readonly ${key}: Array<`);
              writeObjectType(writer, value);
              writer.write('>;');
              // writeTypeForObjectArray(writer, value, key);
            } else {
              writer.write(`readonly ${key}: `).inlineBlock(() => {
                writeObjectType(writer, value);
              });
            }
          }
        } else {
          writeType(writer, key, isArray ? 'any[]' : 'any');
        }
      });
    });
  }
}

export const generateType = (storeInitialState: any, prefix: string = '') => {
  const writer = getWriter();

  writer
    .writeLine(prefix ? `// ${prefix}.type.ts` : `// type.ts`)
    .write(`export interface ${getStoreTypeName(prefix)} `);

  writeObjectType(writer, storeInitialState);

  return writer.toString();
};

export default generateType;
