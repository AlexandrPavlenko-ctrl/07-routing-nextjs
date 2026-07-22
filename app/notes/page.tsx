import { redirect } from "next/navigation";

export default function NotesRootPage(): null {
  redirect("/notes/filter/all");
  return null;
}
