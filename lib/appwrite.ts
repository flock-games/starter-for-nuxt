import { Client, Account, Databases } from "appwrite";
import type { RuntimeConfig } from "nuxt/schema";

function getAppwrite(config: RuntimeConfig) {
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);

  const account = new Account(client);
  const databases = new Databases(client);

  return { client, account, databases };
}

export { getAppwrite };
