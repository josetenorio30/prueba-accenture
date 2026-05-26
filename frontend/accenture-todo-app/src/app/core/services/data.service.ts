import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _storage: Storage | null = null;
  
  // Manejo de Estado Reactivo
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  // Observables para consumir en los componentes con el pipe async
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private readonly TASKS_KEY = 'my_tasks';
  private readonly CATEGORIES_KEY = 'my_categories';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  // Inicializa el almacenamiento y carga los datos previos
  private async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadInitialData();
  }

  private async loadInitialData() {
    const storedTasks = await this._storage?.get(this.TASKS_KEY) || [];
    const storedCategories = await this._storage?.get(this.CATEGORIES_KEY) || [];
    
    this.tasksSubject.next(storedTasks);
    this.categoriesSubject.next(storedCategories);
  }

  // ==========================================
  // LÓGICA DE TAREAS
  // ==========================================

  public async addTask(title: string, categoryId: string | null = null) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      categoryId
    };
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = [newTask, ...currentTasks]; // Insertar al inicio
    
    await this.saveTasks(updatedTasks);
  }

  public async updateTask(updatedTask: Task) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    await this.saveTasks(updatedTasks);
  }

  public async deleteTask(taskId: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    await this.saveTasks(updatedTasks);
  }

  private async saveTasks(tasks: Task[]) {
    this.tasksSubject.next(tasks);
    await this._storage?.set(this.TASKS_KEY, tasks);
  }

  // ==========================================
  // LÓGICA DE CATEGORÍAS
  // ==========================================

  public async addCategory(name: string, color: string) {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color
    };
    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = [...currentCategories, newCategory];
    
    await this.saveCategories(updatedCategories);
  }

  public async deleteCategory(categoryId: string) {
    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = currentCategories.filter(cat => cat.id !== categoryId);
    
    // Opcional: Actualizar tareas que tenían esta categoría a null
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task => 
      task.categoryId === categoryId ? { ...task, categoryId: null } : task
    );
    
    await Promise.all([
      this.saveCategories(updatedCategories),
      this.saveTasks(updatedTasks)
    ]);
  }

  private async saveCategories(categories: Category[]) {
    this.categoriesSubject.next(categories);
    await this._storage?.set(this.CATEGORIES_KEY, categories);
  }
}