import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { fetchAuthSession } from "@aws-amplify/auth";

const { credentials } = await fetchAuthSession();
export const bedrockClient = new BedrockRuntimeClient({
  region: "ap-northeast-1",
  credentials,
});
