import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface Project {
  id: number;
  name: string;
  client: string;
  clientId?: number;
  status: 'Planning' | 'In Progress' | 'Completed';
  progress: number;
  dueDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private api = inject(ApiService);
  private projectsSignal = signal<Project[]>([]);
  loading = signal(false);

  readonly projects = this.projectsSignal.asReadonly();

  readonly activeProjectsCount = computed(() =>
    this.projectsSignal().filter(p => p.status === 'In Progress').length
  );

  private nextTempId = -1;

  loadProjects() {
    this.loading.set(true);
    this.api.get<Project[]>('/projects').subscribe({
      next: (projects) => {
        this.projectsSignal.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addProject(project: Omit<Project, 'id'>) {
    const tempId = this.nextTempId--;
    const optimistic = { ...project, id: tempId } as Project;
    this.projectsSignal.update(projects => [optimistic, ...projects]);

    this.api.post<Project>('/projects', project).subscribe({
      next: (serverProject) => {
        this.projectsSignal.update(projects =>
          projects.map(p => p.id === tempId ? serverProject : p)
        );
      },
      error: () => {
        this.projectsSignal.update(projects => projects.filter(p => p.id !== tempId));
      },
    });
  }

  updateProject(id: number, updatedProject: Partial<Project>) {
    const previous = this.projectsSignal().find(p => p.id === id);
    this.projectsSignal.update(projects =>
      projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
    );

    this.api.put<Project>(`/projects/${id}`, updatedProject).subscribe({
      next: (serverProject) => {
        this.projectsSignal.update(projects =>
          projects.map(p => p.id === id ? serverProject : p)
        );
      },
      error: () => {
        if (previous) {
          this.projectsSignal.update(projects =>
            projects.map(p => p.id === id ? previous : p)
          );
        }
      },
    });
  }

  deleteProject(id: number) {
    const previous = this.projectsSignal();
    this.projectsSignal.update(projects => projects.filter(p => p.id !== id));

    this.api.delete(`/projects/${id}`).subscribe({
      error: () => {
        this.projectsSignal.set(previous);
      },
    });
  }

  clearData() {
    this.projectsSignal.set([]);
  }
}
