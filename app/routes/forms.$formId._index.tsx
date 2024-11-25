import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import {
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FormQuestion } from "~/components/question";
import { Question } from "~/types/questions";
import { getBedrockClient } from "~/lib/bedrock";
import { getDynamoDBDocClient } from "~/lib/dynamodb";
import { getHost } from "~/lib/host";
import { localeAtom } from "~/atoms/locale";
import { nanoid } from "nanoid";
import { secondPrompt } from "~/prompts/second";
import { useAtom } from "jotai";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  const queryCommand = new QueryCommand({
    TableName: "GenerativeForms",
    KeyConditionExpression: "PK = :PK AND SK = :SK",
    ExpressionAttributeValues: {
      ":PK": formId,
      ":SK": "form",
    },
  });
  const dynamodbDocClient = await getDynamoDBDocClient();
  const { Items } = await dynamodbDocClient.send(queryCommand);
  if (!Items) return null;
  const questions: Question[] = Items[0].questions;
  return { formId, questions };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const questionLength = Number(formData.get("questionLength")?.toString());
  if (!questionLength) return null;
  const formId = params.formId;

  const expressions = [];
  const expressionValues: any = {};

  const queryFormCommand = new QueryCommand({
    TableName: "GenerativeForms",
    KeyConditionExpression: "PK = :PK AND SK = :SK",
    ExpressionAttributeValues: {
      ":PK": formId,
      ":SK": "form",
    },
  });
  const dynamodbDocClient = await getDynamoDBDocClient();
  const { Items: FormItems } = await dynamodbDocClient.send(queryFormCommand);
  if (!FormItems) return null;
  const questions: Question[] = FormItems[0].questions;

  const answers: {
    question: string;
    choices: { value: string; label: string }[];
    answer: string;
  }[] = [];

  for (let questionIndex = 0; questionIndex < questionLength; questionIndex++) {
    const questionNo = questionIndex + 1;
    const question = questions[questionIndex];
    const allAnswer = formData.getAll(`answers[${questionIndex}]`);
    const answer = allAnswer.length > 1 ? allAnswer.join(",") : allAnswer[0];
    expressions.push(`Q${questionNo} = :${questionNo}`);
    expressionValues[`:${questionNo}`] = answer;
    answers.push({
      question: question.text.ja,
      choices: (() => {
        if (question.type === "text") return [];
        else
          return question.choices.map((x) => ({
            label: x.label.ja,
            value: x.value,
          }));
      })(),
      answer: answer.toString(),
    });
  }

  const prompt = secondPrompt(answers);
  console.log(prompt);

  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
    contentType: "application/json",
    accept: "*/*",
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  };
  const command = new InvokeModelCommand(input);
  const bedrockClient = await getBedrockClient();
  const { body } = await bedrockClient.send(command);
  const result = new TextDecoder().decode(body);
  const json = JSON.parse(result);
  const exQuestions: Question = JSON.parse(json.content[0].text);

  const answerId = nanoid(10);

  const updateAnswerCommand = new UpdateCommand({
    TableName: "GenerativeForms",
    Key: { PK: formId, SK: answerId },
    UpdateExpression: `SET ${expressions.join(", ")}`,
    ExpressionAttributeValues: expressionValues,
  });

  const updateFormCommand = new UpdateCommand({
    TableName: "GenerativeForms",
    Key: { PK: formId, SK: "form" },
    UpdateExpression: `SET exQuestions = :exQuestions`,
    ExpressionAttributeValues: { ":exQuestions": exQuestions },
  });

  await dynamodbDocClient.send(updateAnswerCommand);
  await dynamodbDocClient.send(updateFormCommand);

  return redirect(`${getHost()}/forms/${formId}/${answerId}`);
};

export default function Forms() {
  const [locale] = useAtom(localeAtom);
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="post">
        <input
          className="hidden"
          name="questionLength"
          value={loaderData?.questions.length}
          readOnly
        />
        {loaderData?.questions.map((question, i) => (
          <FormQuestion
            key={i}
            questionIndex={i}
            locale={locale}
            question={question}
          />
        ))}
        <div className="flex justify-center mt-7">
          <button className="py-3 px-5 mb-10 rounded bg-white border border-slate-700 hover:bg-slate-100">
            {locale === "ja" ? "次のページへ" : "Next page"}
          </button>
        </div>
      </Form>

      {navigation.state === "submitting" && (
        <div className="fixed m-auto w-72 h-20 flex items-center justify-center gap-3 top-0 right-0 bottom-0 left-0 bg-slate-700 text-white rounded">
          <AiOutlineLoading3Quarters className="animate-spin" color="white" />
          <span className="animate-pulse">
            {locale === "ja" ? "質問を生成しています" : "Generating"}
          </span>
        </div>
      )}
    </>
  );
}
