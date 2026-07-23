"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({
  tag,
}: NotesClientProps): React.JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Переконуємося, що початкові стани (1 та '') ідентичні серверному prefetchQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(page, search, tag),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });

  if (isError) {
    return (
      <div className={css.error}>Error loading notes: {error?.message}</div>
    );
  }

  // Всеїдне розбирання об'єкта відповіді від GoIT API
  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(val: string) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search notes..."
        />
        {!isFormOpen && (
          <button
            type="button"
            className={css.button}
            onClick={() => setIsFormOpen(true)}
          >
            Add New Note
          </button>
        )}
      </div>

      {isFormOpen ?
        <NoteForm onCancel={() => setIsFormOpen(false)} />
      : isLoading ?
        <p className={css.loading}>Loading notes...</p>
      : notes.length === 0 ?
        // Якщо токен новий і нотаток у базі немає, показуємо заглушку з пропозицією створити нотатку
        <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
          <p>No notes found for this account yet.</p>
          <button
            type="button"
            className={css.button}
            onClick={() => setIsFormOpen(true)}
          >
            Create your first note
          </button>
        </div>
      : <>
          <NoteList notes={notes} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      }
    </div>
  );
}
