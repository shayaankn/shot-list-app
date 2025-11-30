import { Component, OnInit } from '@angular/core';
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
export class Projects implements OnInit {
  newProjectName = '';
  projects: any[] = [];

  constructor(private storage: Storage, private router: Router) {}

  async ngOnInit() {
    this.projects = await this.storage.getProjects();
  }

  async createProject() {
    if (!this.newProjectName.trim()) return;
    const id = Date.now().toString();
    await this.storage.addProject({ id, name: this.newProjectName });
    this.newProjectName = '';
    this.projects = await this.storage.getProjects();
  }

  openProject(project: any) {
    this.router.navigate(['/shotlist', project.id]);
  }

  async deleteProject(project: any) {
    if (!confirm(`Delete project "${project.name}" and all its shots?`)) return;
    await this.storage.deleteProject(project.id);
    this.projects = await this.storage.getProjects();
  }
}
