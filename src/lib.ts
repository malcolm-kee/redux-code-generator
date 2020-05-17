import { SupportedLanguage } from './redux/redux.type';

export const callAll = <Params extends any[]>(
  ...fns: Array<((...params: Params) => void) | undefined | boolean>
) => (...params: Params) =>
  fns.forEach((fn) => typeof fn === 'function' && fn(...params));

export const removeNewLine = (oriString: string) =>
  oriString.trim().replace(/[\n\r]/g, '');

export const capitalize = (oriString: string) =>
  oriString.charAt(0).toUpperCase() + oriString.slice(1);

export const upperCase = (oriString: string) =>
  oriString && oriString.toUpperCase();

export const lastItem = <T>(array: T[]) => array[array.length - 1];

export const isBoolStrNum = (
  type: string
): type is 'boolean' | 'string' | 'number' =>
  type === 'boolean' || type === 'string' || type === 'number';

export const isJs = (lang: SupportedLanguage): lang is 'javascript' =>
  lang === 'javascript';

export const safeEval = (code: string, params: Record<string, any> = {}) => {
  const parameters = Object.keys(params);
  const args = Object.values(params);
  const wrappedCode = `
    'use strict';
    return (${code});
  `;
  // eslint-disable-next-line no-new-func
  const runCode = new Function(...parameters, wrappedCode);
  return runCode(...args);
};
