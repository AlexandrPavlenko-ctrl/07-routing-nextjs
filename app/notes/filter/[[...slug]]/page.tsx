import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../../../lib/api";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;

  // Перетворюємо масив на чистий рядок: якщо slug = ['Work'], то currentTag = 'Work'
  const currentTag = slug && slug.length > 0 ? String(slug[0]) : "all";

  const queryClient = new QueryClient();

  // Виконуємо prefetch із точним рядковим ключем
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", currentTag],
    queryFn: () => fetchNotes(1, "", currentTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
