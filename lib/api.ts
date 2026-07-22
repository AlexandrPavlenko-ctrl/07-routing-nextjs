import axios from "axios";
import { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

// Обов'язково переконайтеся, що у файлі .env.local ваш токен вставлений без слів Bearer і без лапок
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // СУВОРИЙ СТАНДАРТ GOIT API: слово Bearer, ОДИН пробіл і сам токен
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes?: number;
}

export type CreateNoteInput = Omit<Note, "id">;

export const fetchNotes = async (
  page?: number,
  search?: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {};
  if (page) params.page = page;
  if (search && search.trim() !== "") params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const response = await api.get<FetchNotesResponse>("notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`notes/${id}`);
  return response.data;
};

export const createNoteApi = async (data: CreateNoteInput): Promise<void> => {
  await api.post<void>("notes", data);
};

export const deleteNoteApi = async (id: string): Promise<void> => {
  await api.delete<void>(`notes/${id}`);
};
