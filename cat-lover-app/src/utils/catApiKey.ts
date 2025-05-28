if (!process.env.CAT_API_KEY) {
  throw new Error("Cat API key is not configured");
}

export const CAT_API_KEY = process.env.CAT_API_KEY;
