export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId?: string; // Relación con la categoría
  createdAt: Date;
}