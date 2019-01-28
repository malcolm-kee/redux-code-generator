import CodeBlockWriter from 'code-block-writer';
import { isNil } from 'typesafe-is';
import { capitalize, isBoolStrNum } from '../lib';
import getWriter from './get-writer';

export const getStoreTypeName = (prefix: string) =>
  prefix ? `${capitalize(prefix)}Store` : 'RootStore';

function writeType(writer: CodeBlockWriter, object: any) {
  if (object) {
    writer.inlineBlock(() => {
      Object.keys(object).forEach(key => {
        const isArray = Array.isArray(object[key]);

        const value = isArray ? object[key][0] : object[key];
        const valType = typeof value;

        if (isNil(value)) {
          writer.writeLine(`readonly ${key}: ${isArray ? 'any[]' : 'any'};`);
        } else if (isBoolStrNum(valType)) {
          writer.writeLine(
            `readonly ${key}: ${isArray ? `${valType}[]` : valType};`
          );
        } else {
          if (isArray) {
            writer.write(`readonly ${key}: Array<`);
            writeType(writer, value);
            writer.write('>;');
          } else {
            writer.write(`readonly ${key}: `).inlineBlock(() => {
              writeType(writer, value);
            });
          }
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

  writeType(writer, storeInitialState);

  return writer.toString();
};

export default generateType;
