import { date, internet, name, random } from 'faker/locale/en';

const generateStringData = (propName: string = '') => {
  if (propName) {
    if (/email/gi.test(propName)) {
      return internet.email();
    }

    if (/url/gi.test(propName)) {
      return internet.email();
    }

    if (/password/gi.test(propName)) {
      return internet.password();
    }

    if (/date/gi.test(propName)) {
      return date.past().toString();
    }

    if (/name/gi.test(propName)) {
      return name.findName();
    }
  }
  return '';
};

export const generateData = (
  type: 'boolean' | 'number' | 'string',
  propName?: string
) => {
  switch (type) {
    case 'boolean':
      return random.boolean();

    case 'number':
      return random.number();

    case 'string':
      return `"${generateStringData(propName)}"`;

    default:
      return null;
  }
};

export default generateData;
