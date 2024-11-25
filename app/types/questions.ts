export type LocaleText = {
  ja: string;
  en: string;
};

type Choice = {
  value: string;
  label: LocaleText;
};

type BaseQuestion = {
  id: string;
  text: LocaleText;
  required: boolean;
};

type TextQuestion = BaseQuestion & {
  type: "text";
  placeholder: LocaleText;
};

type RadioQuestion = BaseQuestion & {
  type: "radio";
  choices: Choice[];
};

type CheckboxQuestion = BaseQuestion & {
  type: "checkbox";
  choices: Choice[];
};

export type Question = TextQuestion | RadioQuestion | CheckboxQuestion;
