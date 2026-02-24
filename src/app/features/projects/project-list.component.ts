import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProjectService, Project } from '../../core/services/project.service';
import { ClientService } from '../../core/services/client.service';
import { PopupService } from '../../core/services/popup.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-heading tracking-tight">Projects</h2>
          <p class="text-subtle mt-1 text-sm">Manage and track your active projects</p>
        </div>
        <button (click)="openAddModal()" class="btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          New Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (project of projectService.projects(); track project.id) {
          <div class="card p-6 hover:border-orange-500/40 group">
            <div class="flex justify-between items-start mb-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">{{ project.name.charAt(0) }}</div>
              <span [class]="getStatusClass(project.status)">{{ project.status }}</span>
            </div>
            <h3 class="text-lg font-bold text-heading mb-0.5 group-hover:text-orange-400 transition-colors">{{ project.name }}</h3>
            <p class="text-xs text-subtle mb-4">{{ project.client }}</p>
            <div class="mb-4">
              <div class="flex justify-between text-xs text-subtle mb-1.5">
                <span>Progress</span>
                <span class="font-semibold text-body">{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-inset rounded-full h-1.5 overflow-hidden border border-theme">
                <div class="h-full rounded-full transition-all duration-500" [class]="project.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'" [style.width.%]="project.progress"></div>
              </div>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-theme">
              <div class="flex items-center gap-1.5 text-subtle text-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span>{{ project.dueDate }}</span>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="openEditModal(project)" class="p-1.5 text-muted hover:text-orange-400 hover:bg-orange-500/10 rounded-md transition-all" aria-label="Edit project"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                <button (click)="deleteProject(project.id)" class="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all" aria-label="Delete project"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-16 text-center text-subtle text-sm">No projects yet. Click "New Project" to get started.</div>
        }
      </div>
    </div>

    @if (showModal()) {
      <div class="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop" (click)="closeModal()">
        <div class="rounded-xl p-8 max-w-md w-full border border-theme shadow-2xl modal-panel" style="background:var(--modal-bg)" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold text-heading mb-6">{{ editingProjectId() ? 'Edit Project' : 'Add New Project' }}</h3>
          <form [formGroup]="form" (ngSubmit)="saveProject()" class="space-y-5">
            <div>
              <label for="project-name" class="form-label">Project Name *</label>
              <input formControlName="name" id="project-name" type="text" class="form-input" placeholder="Website Redesign">
              @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) { <p class="field-error">Project name is required</p> }
            </div>
            <div>
              <label for="project-client" class="form-label">Client *</label>
              <select formControlName="clientId" id="project-client" class="form-select">
                <option [value]="0" disabled>Select a client</option>
                @for (client of clientService.clients(); track client.id) { <option [value]="client.id">{{ client.name }}</option> }
              </select>
              @if (form.get('clientId')?.touched && form.get('clientId')?.errors?.['min']) { <p class="field-error">Please select a client</p> }
            </div>
            <div>
              <label for="project-dueDate" class="form-label">Due Date *</label>
              <input formControlName="dueDate" id="project-dueDate" type="date" class="form-input">
              @if (form.get('dueDate')?.touched && form.get('dueDate')?.errors?.['required']) { <p class="field-error">Due date is required</p> }
            </div>
            <div>
              <label for="project-status" class="form-label">Status</label>
              <select formControlName="status" id="project-status" class="form-select">
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            @if (editingProjectId()) {
              <div>
                <label for="project-progress" class="form-label">Progress ({{ form.get('progress')?.value }}%)</label>
                <input formControlName="progress" id="project-progress" type="range" min="0" max="100" step="5" class="w-full accent-orange-500">
              </div>
            }
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="form.invalid" class="btn-primary flex-1">{{ editingProjectId() ? 'Save Changes' : 'Add Project' }}</button>
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
  private readonly fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  clientService = inject(ClientService);
  showModal = signal(false);
  editingProjectId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]], clientId: [0, [Validators.required, Validators.min(1)]],
    status: ['Planning' as 'Planning' | 'In Progress' | 'Completed'], progress: [0], dueDate: ['', [Validators.required]],
  });

  openAddModal() { this.editingProjectId.set(null); this.form.reset({ name: '', clientId: 0, status: 'Planning', progress: 0, dueDate: '' }); this.showModal.set(true); }
  openEditModal(project: Project) { this.editingProjectId.set(project.id); this.form.patchValue({ name: project.name, clientId: project.clientId ?? 0, status: project.status, progress: project.progress, dueDate: project.dueDate }); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  saveProject() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue(); const id = this.editingProjectId();
    id ? this.projectService.updateProject(id, v) : this.projectService.addProject(v as any);
    this.closeModal();
  }
  async deleteProject(id: number) {
    if (await this.popupService.confirm({ title: 'Delete Project', message: 'Are you sure you want to delete this project?', confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' }))
      this.projectService.deleteProject(id);
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'In Progress': return 'badge bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/30';
      case 'Completed': return 'badge bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30';
      case 'Planning': return 'badge bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30';
      default: return 'badge bg-gray-500/15 text-muted ring-1 ring-gray-500/30';
    }
  }
}
