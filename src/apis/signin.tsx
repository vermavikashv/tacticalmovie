// services/auth.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const signIn = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username,
      password,
    });
    return response.data; // { access_token: '...' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
