import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { FormQuestion } from "~/components/question";
import { Question } from "~/types/questions";
import { getDynamoDBDocClient } from "~/lib/dynamodb";
import { getHost } from "~/lib/host";
import { localeAtom } from "~/atoms/locale";
import { useAtom } from "jotai";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
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
  const questions: Question[] = FormItems[0].exQuestions;
  return { questions };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const answerId = params.answerId;
  const formId = params.formId;
  const questionLength = Number(formData.get("questionLength")?.toString());
  if (!questionLength) return null;
  const expressions = [];
  const expressionValues: any = {};
  for (let questionIndex = 0; questionIndex < questionLength; questionIndex++) {
    const questionNo = questionIndex + 1;
    const allAnswer = formData.getAll(`answers[${questionIndex}]`);
    const answer = allAnswer.length > 1 ? allAnswer.join(",") : allAnswer[0];
    expressions.push(`EXQ${questionNo} = :${questionNo}`);
    expressionValues[`:${questionNo}`] = answer;
  }
  console.log({ expressions, expressionValues });
  const updateCommand = new UpdateCommand({
    TableName: "GenerativeForms",
    Key: { PK: formId, SK: answerId },
    UpdateExpression: `SET ${expressions.join(", ")}`,
    ExpressionAttributeValues: expressionValues,
  });
  const dynamodbDocClient = await getDynamoDBDocClient();
  await dynamodbDocClient.send(updateCommand);
  return redirect(`${getHost()}/forms/result`);
};

export default function Forms() {
  const [locale] = useAtom(localeAtom);
  const loaderData = useLoaderData<typeof loader>();
  return (
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
        <button className="py-3 px-5 mb-10 rounded bg-white border border-slate-700">
          {locale === "ja" ? "送信" : "SUBMIT"}
        </button>
      </div>
    </Form>
  );
}
