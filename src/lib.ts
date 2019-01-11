export const callAll = <Params extends Array<any>>(
  ...fns: Array<((...params: Params) => void) | undefined | boolean>
) => (...params: Params) =>
  fns.forEach(fn => typeof fn === 'function' && fn(...params));

export const removeNewLine = (oriString: string) =>
  oriString.trim().replace(/[\n\r]/g, '');
