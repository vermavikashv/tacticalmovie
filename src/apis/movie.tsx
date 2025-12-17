/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getMovies = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}/movies`, {
      params: { page, limit }, // send page and limit as query params
    });
    return response.data; // assuming your NestJS API returns { data: [], meta: { totalPages, page, totalItems } }
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

type CreateMoviePayload = {
  title: string;
  year: number;
  image?: File;
};

export const createMovie = async (data: CreateMoviePayload) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("year", String(data.year));

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axios.post(`${API_URL}/movies`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export type Movie = {
  id?: string;
  title?: string;
  year?: number;
  image?: string;
};

export const getMovieById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateMovie = async (
  id: string,
  data: { title: string; year: number; image?: File }
) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("year", String(data.year));
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axios.put(`${API_URL}/movies/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
