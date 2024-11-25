import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fetchAuthSession } from "@aws-amplify/auth";

const { credentials } = await fetchAuthSession();
const dynamodbClient = new DynamoDBClient({
  region: "ap-northeast-1",
  credentials,
});
export const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);
