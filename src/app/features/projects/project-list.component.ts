import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { PopupService } from '../../core/services/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-white">Projects</h2>
          <p class="text-gray-400 mt-1">Manage and track your active projects</p>
        </div>
        <button (click)="showAddModal = true" class="bg-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (project of projectService.projects(); track project.id) {
          <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-orange-500 transition-all">
            <div class="flex justify-between items-start mb-4">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {{ project.name.charAt(0) }}
              </div>
              <span [class]="getStatusClass(project.status)">
                {{ project.status }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-1">{{ project.name }}</h3>
            <p class="text-sm text-gray-400 mb-4">{{ project.client }}</p>
            
            <div class="mb-4">
              <div class="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span class="font-semibold">{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-gray-900 rounded-full h-2.5 border border-gray-700">
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500" [style.width.%]="project.progress"></div>
              </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-gray-700">
              <div class="flex items-center gap-2 text-gray-400 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ project.dueDate }}</span>
              </div>
              <button (click)="deleteProject(project.id)" class="text-red-400 hover:text-red-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Add Project Modal -->
    @if (showAddModal) {
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="showAddModal = false">
        <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700" (click)="$event.stopPropagation()">
          <h3 class="text-2xl font-bold text-white mb-6">Add New Project</h3>
          <form (submit)="addProject(); $event.preventDefault()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
              <input [(ngModel)]="newProject.name" name="name" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Client</label>
              <input [(ngModel)]="newProject.client" name="client" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input [(ngModel)]="newProject.dueDate" name="dueDate" type="text" required placeholder="e.g., Dec 20" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select [(ngModel)]="newProject.status" name="status" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="showAddModal = false" class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent {
  private readonly popupService = inject(PopupService);
  projectService = inject(ProjectService);
  showAddModal = false;
  newProject = {
    name: '',
    client: '',
    status: 'Planning' as 'Planning' | 'In Progress' | 'Completed',
    progress: 0,
    dueDate: ''
  };

  addProject() {
    this.projectService.addProject(this.newProject);
    this.newProject = {
      name: '',
      client: '',
      status: 'Planning',
      progress: 0,
      dueDate: ''
    };
    this.showAddModal = false;
  }

  async deleteProject(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.projectService.deleteProject(id);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Progress': return 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Completed': return 'px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Planning': return 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  }
}
