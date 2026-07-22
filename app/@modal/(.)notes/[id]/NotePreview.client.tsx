"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api";
import { Modal } from "../../../../components/Modal/Modal";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({
  id,
}: NotePreviewClientProps): React.JSX.Element {
  const router = useRouter();
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal isOpen={true} onClose={() => router.back()}>
      <div style={{ padding: "20px" }}>
        {isLoading ?
          <p>Loading details...</p>
        : note ?
          <article>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <span
              style={{
                background: "#eee",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {note.tag}
            </span>
          </article>
        : <p>Note not found.</p>}
      </div>
    </Modal>
  );
}
