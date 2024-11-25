import { LocaleText, Question } from "~/types/questions";

export const FormQuestion = ({
  questionIndex,
  question,
  locale,
}: {
  questionIndex: number;
  question: Question;
  locale: "ja" | "en";
}) => (
  <div key={questionIndex} className="px-5 py-5">
    <h2 className="font-bold">
      {/* Q.{questionIndex + 1} {question.text[locale]} */}
      Q.4 {question.text[locale]}
    </h2>
    {question.type === "text" && (
      <textarea
        rows={5}
        placeholder={question.placeholder[locale]}
        name={`answers[${questionIndex}]`}
        className="w-full mt-5 px-5 py-3 border-slate-300 border rounded"
      ></textarea>
    )}
    {question.type === "radio" && (
      <ul className="mt-5">
        {question.choices.map((choice, j) => (
          <li key={j} className="py-1">
            <label key={j}>
              <input
                type="radio"
                value={choice.value}
                name={`answers[${questionIndex}]`}
              />
              <span className="pl-3">{choice.label[locale]}</span>
            </label>
          </li>
        ))}
      </ul>
    )}
    {question.type === "checkbox" && (
      <ul className="mt-5">
        {question.choices.map((choice, j) => (
          <li key={j} className="py-1">
            <label key={j}>
              <input
                type="checkbox"
                value={choice.value}
                name={`answers[${questionIndex}]`}
              />
              <span className="pl-3">{choice.label[locale]}</span>
            </label>
          </li>
        ))}
      </ul>
    )}
  </div>
);
