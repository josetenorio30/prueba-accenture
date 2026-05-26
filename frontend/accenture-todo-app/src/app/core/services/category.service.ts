import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../domain/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _storage: Storage | null = null;
  private readonly STORAGE_KEY = 'todo_categories';

  // Estado global reactivo para las categorías
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.loadCategories();
  }

  private async loadCategories() {
    const categories = await this._storage?.get(this.STORAGE_KEY) || [];
    this.categoriesSubject.next(categories);
  }

  // 1. CREAR Categoría
  async addCategory(name: string, color: string = '#0054e9') {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color
    };
    const currentCategories = this.categoriesSubject.getValue();
    await this.saveAndEmit([...currentCategories, newCategory]);
  }

  // 2. EDITAR Categoría
  async updateCategory(id: string, newName: string) {
    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = currentCategories.map(cat => 
      cat.id === id ? { ...cat, name: newName } : cat
    );
    await this.saveAndEmit(updatedCategories);
  }

  // 3. ELIMINAR Categoría
  async deleteCategory(id: string) {
    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = currentCategories.filter(cat => cat.id !== id);
    await this.saveAndEmit(updatedCategories);
  }

  private async saveAndEmit(categories: Category[]) {
    await this._storage?.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }
}