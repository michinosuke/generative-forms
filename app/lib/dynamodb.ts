import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const getDynamoDBDocClient = async () => {
  const dynamodbClient = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });
  const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);
  return dynamodbDocClient;
};
