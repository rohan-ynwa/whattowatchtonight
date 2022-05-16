export async function handler() {
    const API_KEY = process.env.API_KEY;
    return {
      statusCode: 200,
      body: `hello world! I have a ${API_KEY}`,
    };
  }