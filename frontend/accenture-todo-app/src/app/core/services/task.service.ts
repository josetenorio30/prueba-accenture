import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../../domain/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _storage: Storage | null = null;
  private readonly STORAGE_KEY = 'todo_tasks';
  
  // El estado global de las tareas (Optimización de memoria)
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  // 1. Inicializar el almacenamiento
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadTasks();
  }

  // 2. Cargar tareas en memoria
  private async loadTasks() {
    const tasks = await this._storage?.get(this.STORAGE_KEY) || [];
    this.tasksSubject.next(tasks);
  }

  // 3. Obtener tareas filtradas por categoría (Requerimiento de la prueba)
  getTasksByCategory(categoryId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.categoryId === categoryId))
    );
  }

  // 4. Agregar nueva tarea
  async addTask(title: string, categoryId?: string) {
    const newTask: Task = {
      id: crypto.randomUUID(), // Genera un ID único nativo
      title,
      completed: false,
      categoryId,
      createdAt: new Date()
    };
    
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = [newTask, ...currentTasks];
    
    await this.saveAndEmit(updatedTasks);
  }
  // 7. ACTUALIZAR tarea (Título y Categoría)
  async updateTask(id: string, newTitle: string, newCategoryId?: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task => 
      task.id === id ? { ...task, title: newTitle, categoryId: newCategoryId } : task
    );
    await this.saveAndEmit(updatedTasks);
  }

  // 5. Marcar como completada
  async toggleTaskCompletion(taskId: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    await this.saveAndEmit(updatedTasks);
  }

  // 6. Eliminar tarea
  async deleteTask(taskId: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    await this.saveAndEmit(updatedTasks);
  }

  // Función auxiliar para centralizar el guardado y evitar código repetido
  private async saveAndEmit(tasks: Task[]) {
    await this._storage?.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks);
  }
}