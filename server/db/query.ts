import { Sequelize, Transaction } from "sequelize";
import sequelize from "./db";

// Define types for database clients
export type QueryClient = Sequelize;
export type TransactionClient = Transaction;
export type QueryResult<T = any> = T[];

// Transaction function with proper typing using Sequelize
export async function transaction<T>(
  callback: (client: TransactionClient) => Promise<T>
): Promise<T> {
  try {
    const result = await sequelize.transaction(callback);
    return result;
  } catch (error) {
    throw error;
  }
}

const queryUtils = {
  transaction,
};

export default queryUtils;
