import { lexgiConfig } from "./lexgi.config.mjs";
const port = lexgiConfig.port || 3400;
export const API_URL = `http://localhost:${port}/api/`;