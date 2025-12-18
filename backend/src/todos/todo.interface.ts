export interface Todo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  completedDate?: string;
}
