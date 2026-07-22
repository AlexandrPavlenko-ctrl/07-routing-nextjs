import React from "react";
import Link from "next/link";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import { Note } from "../../../types/note";
import css from "./NoteDetailsPage.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: PageProps) {
  // 1. Очікуємо вирішення Promise params (вимога рев'ю)
  const { id } = await params;

  const queryClient = new QueryClient();

  // 2. Попередньо завантажуємо дані на сервері через axios (SSR)
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  // 3. Дістаємо завантажені дані з кешу
  const note = queryClient.getQueryData<Note>(["note", id]);

  if (!note) {
    return (
      <div className={css.container}>
        <h1 className={css.error}>Note not found</h1>
        <Link href="/notes/filter/all" className={css.backBtn}>
          Back to notes
        </Link>
      </div>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={css.main}>
        <div className={css.container}>
          <article className={css.item}>
            {/* Шапка картки із заголовком та тегом */}
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag} title={note.tag}>
                {note.tag}
              </span>
            </div>

            {/* Контент нотатки */}
            <p className={css.content}>{note.content}</p>

            {/* Дата створення (якщо є в об'єкті) */}
            {note.createdAt && (
              <div className={css.date}>
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            )}

            {/* Кнопка повернення */}
            <Link href="/notes/filter/all" className={css.backBtn}>
              Back to notes
            </Link>
          </article>
        </div>
      </main>
    </HydrationBoundary>
  );
}
