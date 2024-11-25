import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const getBedrockClient = async () => {
  const bedrockClient = new BedrockRuntimeClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });
  return bedrockClient;
};
