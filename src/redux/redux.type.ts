export type SupportedLanguage = 'javascript' | 'typescript';

export type ReduxCodeStore = {
  readonly initialState: string;
  readonly storePrefix: string;
  readonly language: SupportedLanguage;
};
