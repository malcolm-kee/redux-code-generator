import { removeNewLine } from '../lib';
import generateActionKeys from './generate-action-keys';

describe('generateActionKeys', () => {
  test('simple object', () => {
    const code = generateActionKeys({ name: 'Malcolm', age: 6, active: true });
    const expectedCode = `
export const SET_NAME = 'SET_NAME';
export const SET_AGE = 'SET_AGE';
export const SET_ACTIVE = 'SET_ACTIVE';
    `;

    expect(removeNewLine(code)).toBe(removeNewLine(expectedCode));
  });

  test('nested object', () => {
    const code = generateActionKeys({
      active: true,
      user: { name: 'Malcolm', age: 6, profile: { id: '1234' } }
    });
    const expectedCode = `
export const SET_ACTIVE = 'SET_ACTIVE';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_AGE = 'SET_USER_AGE';
export const SET_USER_PROFILE_ID = 'SET_USER_PROFILE_ID';
    `;

    expect(removeNewLine(code)).toBe(removeNewLine(expectedCode));
  });

  test('prefix store', () => {
    const code = generateActionKeys(
      { name: 'Malcolm', age: 6, active: true },
      'user'
    );
    const expectedCode = `
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_AGE = 'SET_USER_AGE';
export const SET_USER_ACTIVE = 'SET_USER_ACTIVE';
    `;

    expect(removeNewLine(code)).toBe(removeNewLine(expectedCode));
  });
});
