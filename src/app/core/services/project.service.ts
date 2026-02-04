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
    this.api.post<Project>('/projects', project).subscribe({
      next: (newProject) => {
        this.projectsSignal.update(projects => [newProject, ...projects]);
      },
    });
  }

  updateProject(id: number, updatedProject: Partial<Project>) {
    this.api.put<Project>(`/projects/${id}`, updatedProject).subscribe({
      next: (updated) => {
        this.projectsSignal.update(projects => 
          projects.map(p => p.id === id ? updated : p)
        );
      },
    });
  }

  deleteProject(id: number) {
    this.api.delete(`/projects/${id}`).subscribe({
      next: () => {
        this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
      },
    });
  }

  clearData() {
    this.projectsSignal.set([]);
  }
}
