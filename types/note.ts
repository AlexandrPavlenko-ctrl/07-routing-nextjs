export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt?: string;

  // Додаткові альтернативні поля бекенду для безпечного зчитування
  name?: string;
  text?: string;
  description?: string;
}
