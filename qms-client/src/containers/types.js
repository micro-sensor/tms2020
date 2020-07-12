export type topState = {
  snackGood: boolean,
  snackBad: boolean,
  snackGoodText: string,
  snackBadText: string,
  confirmDialogOpen: boolean,
  confirmDialogText: string,
  activeQuestion: Question
};

export type Choice = {
  id: number,
  uuid: string,
  body: string,
  correct: boolean
};

export type Code = {
  id: number,
  languageId: number,
  body: string
};

export type Question = {
  id: number,
  title: string,
  level: number,
  body: string,
  type: string,
  categories: Array<number>,
  choices: Array<Choice>,
  codes: Array<Code>
};
