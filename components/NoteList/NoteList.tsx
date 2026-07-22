import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "../../types/note";
import { deleteNoteApi } from "../../lib/api";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteNote } = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        // Чиста і безпечна типізація альтернативних полів без any
        const noteTitle = note.title || note.name || "Untitled";
        const noteContent =
          note.content ||
          note.text ||
          note.description ||
          "No content provided";

        return (
          <li key={note.id} className={css.listItem}>
            <h3 className={css.title}>{noteTitle}</h3>
            <p className={css.content}>{noteContent}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View Details
              </Link>
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className={css.button}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NoteList;
