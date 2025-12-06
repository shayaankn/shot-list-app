import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { FormsModule, NgFor } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Storage } from '../services/storage';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-shotlist',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, DragDropModule],
  templateUrl: './shotlist.html',
  styleUrls: ['./shotlist.css'],
})
export class Shotlist implements OnInit, OnDestroy {
  projectId = '';
  projectName = 'Shot List';
  shots: any[] = [];

  constructor(private route: ActivatedRoute, private storage: Storage, private router: Router) {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
  }

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    const projects = (await this.storage.getProjects()) || [];
    const proj = projects.find((p: any) => p.id === this.projectId);
    this.projectName = proj ? proj.name : 'Shot List';

    this.shots = (await this.storage.getShots(this.projectId)) || [];
    // normalize
    this.shots = this.shots.map((s: any) => ({
      scene: '',
      shot: '',
      description: '',
      lens: '',
      movement: '',
      completed: false,
      image: null,
      ...s,
    }));
  }

  addShot() {
    // create shot with new structure
    this.shots.push({
      scene: '',
      shot: '',
      description: '',
      lens: '',
      movement: '',
      completed: false,
      image: null,
    });
    void this.saveShots();
  }

  removeShot(i: number) {
    this.shots.splice(i, 1);
    void this.saveShots();
  }

  async saveShots() {
    await this.storage.saveShots(this.projectId, this.shots);
  }

  // save when component is destroyed (navigation away)
  ngOnDestroy(): void {
    void this.saveShots();
  }

  // called from the Back link to save then navigate
  async goBack(event: Event) {
    event.preventDefault();
    await this.saveShots();
    this.router.navigate(['/projects']);
  }

  // Image upload handler
  onImageSelected(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      this.shots[i].image = reader.result as string;
      await this.saveShots();
    };
    reader.readAsDataURL(file);
    // reset input so same file can be selected again if needed
    input.value = '';
  }

  // Remove image from shot
  async removeImage(i: number) {
    this.shots[i].image = null;
    await this.saveShots();
  }

  // handle drop from CDK Drag & Drop
  async drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.shots, event.previousIndex, event.currentIndex);
    await this.saveShots();
  }
}
