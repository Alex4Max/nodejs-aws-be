const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_TIMEOUT } = process.env;

export const dbOptions = {
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // to avoid warring in this example
  },
  connectionTimeoutMillis: Number(DB_TIMEOUT) || 5000 // time in millisecond for termination of the database query
};
