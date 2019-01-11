import CodeBlockWriter from 'code-block-writer';

export const getWriter = () =>
  new CodeBlockWriter({
    useSingleQuote: true
  });

export default getWriter;
