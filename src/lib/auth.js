import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "collaborator",
        input: true, // Works now because admin() plugin isn't locking 'role'
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "collaborator_free",
        input: false, // Prevents client from altering their pricing plan
      },
    },
  },
});
