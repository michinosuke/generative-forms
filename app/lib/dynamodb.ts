import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = new DynamoDBClient({ region: "ap-northeast-1" });
export const dynamodbDocClient = DynamoDBDocumentClient.from(dynamodbClient);
