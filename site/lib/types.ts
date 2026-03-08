export interface ThoughtData {
  id: number;
  content: string;
  type: "aphorism" | "essay" | "reflection";
  era?: string;
  createdAt: string;
}
