"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import { Modal } from "../../../../components/Modal/Modal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string; // Приймаємо рядок тегу від серверного компонента
}

export default function NotesClient({ tag: currentTag }: NotesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Отримуємо параметри пагінації та пошуку безпосередньо з URL-адреси
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const urlSearchQuery = searchParams.get("search") || "";

  // Текст в інпуті синхронізується з URL-пошуком
  const [searchInputValue, setSearchInputValue] =
    useState<string>(urlSearchQuery);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Стан для модалки

  // Оновлюємо URL при зміні дебаунс-пошуку через setTimeout (без зависань)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (searchInputValue) {
        params.set("search", searchInputValue);
      } else {
        params.delete("search");
      }

      params.set("page", "1"); // Повертаємо на першу сторінку при новому пошуку

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue, pathname, router]);

  // Запит до API (GoIT бекенд) через React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, urlSearchQuery, currentTag],
    queryFn: () =>
      fetchNotes({
        page,
        limit: 10,
        search: urlSearchQuery,
        tag: currentTag,
      }),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={css.app || "app-container"}>
      <div className={css.toolbar || "toolbar"}>
        <SearchBox value={searchInputValue} onChange={setSearchInputValue} />

        {/* Кнопка створення суворо відповідно до вимог ТЗ */}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {isError && (
        <div className="error" style={{ color: "#dc3545", margin: "10px 0" }}>
          Error loading notes: {(error as Error).message}
        </div>
      )}

      {isLoading ?
        <div className="loading">Loading notes...</div>
      : <NoteList notes={data?.notes || []} />}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Рендеримо модальне вікно та форму суворо за логікою ТЗ */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
