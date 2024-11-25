import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCopy } from "react-icons/io5";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QRCodeSVG } from "qrcode.react";
import { createPrompt } from "../prompts/create";
import { getBedrockClient } from "~/lib/bedrock";
import { getDynamoDBDocClient } from "~/lib/dynamodb";
import { getHost } from "~/lib/host";
import { localeAtom } from "~/atoms/locale";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";
import { useState } from "react";

export const loader = async () => null;

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const prompt = formData.get("prompt");
  if (!prompt) return null;
  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: createPrompt(prompt.toString()) }],
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
  const questions = JSON.parse(json.content[0].text);
  const formId = nanoid(10);
  const putCommand = new PutCommand({
    TableName: "GenerativeForms",
    Item: {
      PK: formId,
      SK: "form",
      questions: questions,
    },
  });
  const dynamodbDocClient = await getDynamoDBDocClient();
  const putResult = await dynamodbDocClient.send(putCommand);
  console.log(putResult);
  return { formId };
};

export default function Create() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [copied, setCopied] = useState(false);
  const [locale] = useAtom(localeAtom);

  if (actionData) {
    console.log(actionData.formId);
  }

  return (
    <Form method="post">
      <label className="">
        <p className="mt-10 font-bold">
          {locale === "ja"
            ? "何についてのアンケートを作成しますか？"
            : "What is the survey about?"}
        </p>
        <input
          name="prompt"
          className="px-5 py-3 border border-slate-600 rounded w-full mt-3"
        />
      </label>
      <button
        type="submit"
        className="bg-white border-slate-500 border px-4 py-2 mt-5 rounded hover:bg-slate-50"
      >
        {locale === "ja" ? "作成" : "CREATE"}
      </button>
      {navigation.state === "submitting" && (
        <div className="flex items-center gap-2 mt-5">
          <AiOutlineLoading3Quarters className="animate-spin" />
          <span className="animate-pulse text-slate-700">
            {locale === "ja" ? "フォームを生成しています" : "Generating"}
          </span>
        </div>
      )}
      {actionData && (
        <div className="border-2 border-slate-100 bg-slate-50 rounded-lg py-5 px-5 mt-5">
          <p className="font-bold text-slate-700">
            {locale === "ja"
              ? "生成されたアンケートフォーム"
              : "Generated survey form"}
          </p>
          <div className="flex items-center flex-wrap gap-3 mt-3">
            <div>
              <IoCopy
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${getHost()}/forms/${actionData.formId}`
                  );
                  setCopied(true);
                }}
              />
            </div>
            <a
              href={`${getHost()}/forms/${actionData.formId}`}
              className="text-slate-800 underline whitespace-pre-wrap w-full"
            >
              {getHost()}/forms/${actionData.formId}
            </a>
            {copied && (
              <div className="py-1 px-3 rounded bg-slate-800 text-white text-sm">
                {locale === "ja" ? "コピーしました" : "Copied"}
              </div>
            )}
          </div>
          <QRCodeSVG
            value={`${getHost()}/forms/${actionData.formId}`}
            className="mt-5"
          />
        </div>
      )}
    </Form>
  );
}
