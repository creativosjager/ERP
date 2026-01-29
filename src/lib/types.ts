export type CalendarEvent = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: "import" | "workshop" | "sales";
};
