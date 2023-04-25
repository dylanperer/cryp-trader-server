import mongoose from "mongoose";
import { ActionType, ModuleType, serverError, serverSuccess } from '../logger';

export const connectDatabase = async () => {
  const connectionUri = process.env.DB_URI;
  try {
    if (!connectionUri) throw new Error(`Invalid database connect uri`);

    const conn = await mongoose.connect(connectionUri);

    serverSuccess(ModuleType.Database, ActionType.connectDatabase);
  } catch (error: any) {
    serverError(ModuleType.Database, ActionType.connectDatabase, error.message);
  }
};
