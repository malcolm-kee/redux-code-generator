import {
  address,
  commerce,
  date,
  internet,
  name,
  phone,
  random
} from 'faker/locale/en';
import { isNil } from 'typesafe-is';
import { isBoolStrNum } from '../lib';
import getWriter from './get-writer';

const generateStringData = (propName: string = '') => {
  if (propName) {
    if (/email/gi.test(propName)) return internet.email();
    if (/phone/gi.test(propName)) return phone.phoneNumber();
    if (/url/gi.test(propName)) return internet.url();
    if (/username/gi.test(propName)) return internet.userName();
    if (/password/gi.test(propName)) return internet.password();
    if (/zipcode/gi.test(propName)) return address.zipCode();
    if (/date/gi.test(propName)) return date.past().toString();
    if (/firstName/gi.test(propName)) return name.firstName();
    if (/lastName/gi.test(propName)) return name.lastName();
    if (/productName/gi.test(propName)) return commerce.productName();
    if (/jobTitle/gi.test(propName)) return name.jobTitle();
    if (/name/gi.test(propName)) return name.findName();
  }
  return '';
};

const objToString = (value: any): string => {
  const writer = getWriter();

  function writeRow(value: any, props?: string) {
    if (isBoolStrNum(typeof value)) {
      writer.write(`${props}: ${value},`).newLine();
    } else {
      writer
        .conditionalWrite(!!props, () => `${props}:`)
        .block(() => {
          Object.keys(value).forEach(key => {
            writeRow(value[key], key);
          });
        });
    }
  }

  writeRow(value);

  return writer.toString();
};

export const generateData = (
  value: any,
  propName?: string
): string | boolean | number | {} => {
  if (!isNil(value)) {
    switch (typeof value) {
      case 'boolean':
        return random.boolean();

      case 'number':
        return random.number();

      case 'string':
        return `'${generateStringData(propName)}'`;

      case 'object':
        return objToString(
          Object.keys(value).reduce(
            (result, key) => ({
              ...result,
              [key]: generateData(value[key], key)
            }),
            {}
          )
        );

      default:
        return '{}';
    }
  }

  return '{}';
};

export default generateData;
