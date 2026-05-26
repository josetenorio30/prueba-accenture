import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule, AlertController, MenuController, ToastController } from '@ionic/angular'; 
import { Observable, BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { addIcons } from 'ionicons';
import { pencilOutline } from 'ionicons/icons';
import {

  add,
  trash,
  menu,
  pencil,
  addOutline,
  trashOutline,
  searchOutline,
  sparklesOutline,
  gridOutline,
  notificationsOutline,
  timeOutline,
  checkmarkDoneCircleOutline

} from 'ionicons/icons';

import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Task } from '../../domain/models/task.model';
import { Category } from '../../domain/models/category.model';
import { FeatureFlagService } from '../../core/services/feature-flag';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true, 
  imports: [CommonModule, FormsModule, IonicModule], 
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TasksPage {
  
  // Creación de tareas
  newTaskTitle: string = '';
  selectedCategoryIdForNewTask: string | null = null;
  
  // Edición de tareas (Variables para el Modal)
  isEditModalOpen = false;
  taskToEdit: Task | null = null;
  editTaskTitle = '';
  editTaskCategoryId: string | null = null;
  pendingTasksCount$: Observable<number>;
completedTasksCount$: Observable<number>;

  categories$: Observable<Category[]>;
  
  private featureFlagService = inject(FeatureFlagService);
premiumUiEnabled$ = this.featureFlagService.isPremiumUiEnabled$;
  private selectedCategorySubject = new BehaviorSubject<string | null>(null);
  selectedCategoryId$ = this.selectedCategorySubject.asObservable();
  filteredTasks$: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private cdr: ChangeDetectorRef
  ) {
    // Registrar los íconos explícitamente con su nombre en kebab-case
  addIcons({

  'add': add,
  'trash': trash,
  'menu': menu,

  'add-outline': addOutline,

  'pencil-outline': pencilOutline,
  'trash-outline': trashOutline,

  'search-outline': searchOutline,
  'sparkles-outline': sparklesOutline,
  'grid-outline': gridOutline,

  'notifications-outline': notificationsOutline,

  'time-outline': timeOutline,

  'checkmark-done-circle-outline':
    checkmarkDoneCircleOutline

});
    this.categories$ = this.categoryService.categories$;
    this.pendingTasksCount$ = this.taskService.tasks$.pipe(
      map(tasks => tasks.filter(t => !t.completed).length)
    );

    this.completedTasksCount$ = this.taskService.tasks$.pipe(
      map(tasks => tasks.filter(t => t.completed).length)
    );
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$,
      this.selectedCategorySubject
    ]).pipe(
      map(([tasks, categoryId]) => {
        if (!categoryId) return tasks; 
        return tasks.filter(t => t.categoryId === categoryId);
      })
    );
  }

  
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message, duration: 2000, position: 'top', color: color,
      cssClass: 'premium-toast', buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  setFilter(categoryId: string | null) {
    this.selectedCategorySubject.next(categoryId);
  }

  async addTask() {
    if (this.newTaskTitle.trim().length === 0) return;
    await this.taskService.addTask(this.newTaskTitle, this.selectedCategoryIdForNewTask || undefined);
    this.newTaskTitle = '';
    this.presentToast('Tarea agregada exitosamente', 'success');
    this.cdr.markForCheck();
  }

 // ⚡ ABRIR MODAL DE EDICIÓN
  openEditModal(task: Task, event?: Event) {
    if (event) event.stopPropagation();
    this.taskToEdit = task;
    this.editTaskTitle = task.title;
    this.editTaskCategoryId = task.categoryId || null;
    this.isEditModalOpen = true;
    this.cdr.detectChanges(); // FORZAMOS EL DIBUJADO INMEDIATO
  }

  // ⚡ CERRAR MODAL
  closeEditModal() {
    this.isEditModalOpen = false;
    this.cdr.detectChanges(); // FORZAMOS EL DIBUJADO INMEDIATO
    setTimeout(() => {
      this.taskToEdit = null;
      this.cdr.markForCheck();
    }, 300);
  }

  // ⚡ GUARDAR EDICIÓN DESDE EL MODAL
  async saveEdit() {
    if (!this.taskToEdit || this.editTaskTitle.trim() === '') return;
    await this.taskService.updateTask(this.taskToEdit.id, this.editTaskTitle, this.editTaskCategoryId || undefined);
    this.closeEditModal();
    this.presentToast('Tarea actualizada', 'primary');
    this.cdr.markForCheck();
  }

  async toggleComplete(task: Task) {
    await this.taskService.toggleTaskCompletion(task.id);
    const message = task.completed ? 'Marcada como pendiente' : '¡Tarea completada!';
    const color = task.completed ? 'medium' : 'success';
    this.presentToast(message, color);
  }

  async delete(task: Task) {
    const alert = await this.alertController.create({
      header: '¿Eliminar tarea?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
            await this.taskService.deleteTask(task.id);
            this.presentToast('Tarea eliminada', 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAddCategory() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Ej. Diseño, Backend...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Crear', handler: (data) => {
            if (data.name.trim() !== '') {
              const colors = ['#1a73e8', '#ea4335', '#34a853', '#fbbc05', '#9334e6'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              this.categoryService.addCategory(data.name, randomColor);
              this.presentToast('Categoría creada', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Renombrar Categoría',
      inputs: [{ name: 'name', type: 'text', value: category.name }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: async (data) => {
            if (data.name.trim() !== '' && data.name !== category.name) {
              await this.categoryService.updateCategory(category.id, data.name);
              this.presentToast('Categoría actualizada', 'primary');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCategory(category: Category) {
    const currentTasks = await firstValueFrom(this.taskService.tasks$);
    const hasLinkedTasks = currentTasks.some(task => task.categoryId === category.id);

    if (hasLinkedTasks) {
      const alert = await this.alertController.create({
        header: 'Acción denegada',
        message: `No puedes eliminar "${category.name}" porque tiene tareas asignadas.`,
        buttons: ['Entendido']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: '¿Eliminar categoría?',
      message: `Se borrará la categoría "${category.name}".`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
            await this.categoryService.deleteCategory(category.id);
            if (this.selectedCategorySubject.getValue() === category.id) {
              this.setFilter(null);
            }
            this.presentToast('Categoría eliminada', 'medium');
          }
        }
      ]
    });
    await alert.present();
  }

  trackById(index: number, task: Task): string { return task.id; }
}