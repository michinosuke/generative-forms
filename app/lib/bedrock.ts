import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { fetchAuthSession } from "@aws-amplify/auth";

export const getBedrockClient = async () => {
  const { credentials } = await fetchAuthSession();
  const bedrockClient = new BedrockRuntimeClient({
    region: "ap-northeast-1",
    credentials,
  });
  return bedrockClient;
};
