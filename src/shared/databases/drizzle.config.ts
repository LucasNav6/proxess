import { drizzle } from 'drizzle-orm/libsql';

export const databaseConnection = (databaseName: string, token: string) => {
  const database = drizzle({
    connection: {
      url: `libsql://${databaseName}.turso.io`,
      authToken: token,
    },
  });

  return database;
};
