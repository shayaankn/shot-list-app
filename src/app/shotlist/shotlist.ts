import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { FormsModule, NgFor } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Storage } from '../services/storage';

@Component({
  selector: 'app-shotlist',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './shotlist.html',
  styleUrl: './shotlist.css',
})
export class Shotlist {
  projectId = '';
  shots: any[] = [];

  constructor(private route: ActivatedRoute, private storage: Storage) {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.shots = this.storage.getShots(this.projectId);
  }

  addShot() {
    this.shots.push({ completed: false });
    this.saveShots();
  }

  removeShot(i: number) {
    this.shots.splice(i, 1);
    this.saveShots();
  }

  saveShots() {
    this.storage.saveShots(this.projectId, this.shots);
  }
}
