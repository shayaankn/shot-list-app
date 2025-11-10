import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Storage {
  private key = 'shotlist_projects';

  getProjects() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  addProject(project: any) {
    const projects = this.getProjects();
    projects.push(project);
    localStorage.setItem(this.key, JSON.stringify(projects));
  }

  getShots(projectId: string) {
    return JSON.parse(localStorage.getItem(`shots_${projectId}`) || '[]');
  }

  saveShots(projectId: string, shots: any[]) {
    localStorage.setItem(`shots_${projectId}`, JSON.stringify(shots));
  }

  deleteProject(projectId: string) {
    const projects = this.getProjects().filter((p: any) => p.id !== projectId);
    localStorage.setItem(this.key, JSON.stringify(projects));
    localStorage.removeItem(`shots_${projectId}`);
  }
}
