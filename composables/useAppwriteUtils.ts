import { Client, Account, ID, Databases } from "appwrite";

export const useAppwriteUtils = () => {
  const client = new Client();
  client.setEndpoint("https://nyc.cloud.appwrite.io/v1").setProject("flock"); // Replace with your project ID

  const account = new Account(client);
  const databases = new Databases(client);

  return { client, account, ID, databases };
};
