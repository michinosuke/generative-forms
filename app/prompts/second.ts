export const secondPrompt = (
  answers: {
    question: string;
    choices: { label: string; value: string }[];
    answer: string;
  }[]
): string =>
  `命令：イベント終了後のアンケートにユーザが回答してくれました。このユーザに対して追加で質問するべき項目を出力してください。
入力：アンケートの質問内容と、ユーザの回答です。
出力形式：必ず次の JSON 形式で出力してください。

[
  {
    "id": "question1",
    "type": "text",
    "text": {
      "ja": "次の質問が最後になります。１つ目の質問で『イベントの時間が長く、辛かった』とお答えいただきました。この度は、御不快な思いをおかけし、誠に申し訳ございませんでした。今後改善させていただく上で参考にさせていただきたいのですが、具体的にはどれくらいの長さが適切でしたでしょうか？",
      "en": "This is the last question. In your answer to the first question, you mentioned 'The event was too long and tiring'. We sincerely apologize for any discomfort caused. To help us improve in the future, could you please specify what duration would be appropriate?"
    },
    "required": true,
    "placeholder": {
      "ja": "例：1時間程度が良い",
      "en": "e.g., About 1 hour would be suitable"
    }
  }
]

制約：
・質問の数は１つで、type は text で生成してください。

入力：
${answers
  .map((answer) => {
    const arr = [`・質問: ${answer.question}`];
    if (answer.choices) {
      let str = "　・選択肢";
      for (const choice of answer.choices) {
        str += `\n　　・${choice.value}: ${choice.label}`;
      }
      arr.push(str);
    }
    arr.push(`　・回答: ${answer.answer}`);
    return arr.join("\n");
  })
  .join("\n\n")}`;
