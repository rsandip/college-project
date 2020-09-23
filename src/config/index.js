import { config } from 'dotenv';

const { parsed } = config();

export const {
  PORT,
  MODE,
  IN_PROD = MODE !== 'prod',
  DB_URI,
  BASE_URL,
  URL = `${BASE_URL}${PORT}`,
  SECRET,
} = parsed;
