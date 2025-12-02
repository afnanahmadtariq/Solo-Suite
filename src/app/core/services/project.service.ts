import { Injectable, signal, computed } from '@angular/core';

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  progress: number;
  dueDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>([
    { id: 1, name: 'Website Redesign', client: 'Acme Corp', status: 'In Progress', progress: 65, dueDate: 'Dec 20' },
    { id: 2, name: 'Mobile App MVP', client: 'TechStart', status: 'Planning', progress: 10, dueDate: 'Jan 15' },
    { id: 3, name: 'Marketing Campaign', client: 'Design Co', status: 'Completed', progress: 100, dueDate: 'Nov 30' },
    { id: 4, name: 'SEO Optimization', client: 'Local Shop', status: 'In Progress', progress: 45, dueDate: 'Dec 10' },
  ]);

  readonly projects = this.projectsSignal.asReadonly();
  
  readonly activeProjectsCount = computed(() => 
    this.projectsSignal().filter(p => p.status === 'In Progress').length
  );

  addProject(project: Omit<Project, 'id'>) {
    const newProject = { ...project, id: Date.now() };
    this.projectsSignal.update(projects => [...projects, newProject]);
  }

  updateProject(id: number, updatedProject: Partial<Project>) {
    this.projectsSignal.update(projects => 
      projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
    );
  }

  deleteProject(id: number) {
    this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
  }
}
