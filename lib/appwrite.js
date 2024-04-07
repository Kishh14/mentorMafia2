import { Client, Account, Databases, Storage } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("660c275423de8aa208b6");

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";
