import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      accountType: {
        defaultValue: "collaborator",
      },
      plan: {
        defaultValue: "collaborator_free",
      },
      status: {
        defaultValue: "active",
      },
    },
  },
  plugins: [admin()],
});
