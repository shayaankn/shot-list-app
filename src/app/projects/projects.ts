import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '../services/storage';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  newProjectName = '';
  projects: any[] = [];

  constructor(private storage: Storage, private router: Router) {
    this.projects = this.storage.getProjects();
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    const id = Date.now().toString();
    this.storage.addProject({ id, name: this.newProjectName });
    this.newProjectName = '';
    this.projects = this.storage.getProjects();
  }

  openProject(project: any) {
    this.router.navigate(['/shotlist', project.id]);
  }

  deleteProject(project: any) {
    if (!confirm(`Delete project "${project.name}" and all its shots?`)) return;
    this.storage.deleteProject(project.id);
    this.projects = this.storage.getProjects();
  }
}
