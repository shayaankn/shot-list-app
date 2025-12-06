import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { FormsModule, NgFor } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { Storage } from '../services/storage';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    // Create shot with new structure
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

  // Save when component is destroyed (navigation away)
  ngOnDestroy(): void {
    void this.saveShots();
  }

  // Called from the Back link to save then navigate
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

  // Handle drop from CDK Drag & Drop
  async drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.shots, event.previousIndex, event.currentIndex);
    await this.saveShots();
  }

  // Export current shotlist to PDF using jspdf + autotable
  exportPdf() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const head = [['Image', 'Scene', 'Shot', 'Description', 'Lens', 'Movement', 'Status']];

    // 1. Pass an empty string '' for the image column
    // This prevents the library from trying to render the base64 string as text
    const body = this.shots.map((s) => [
      '',
      s.scene || '',
      s.shot || '',
      s.description || '',
      s.lens || '',
      s.movement || '',
      s.completed ? 'Done' : 'Pending',
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 20,
      // 2. Set a minCellHeight to ensure there is physical space for the image
      styles: { fontSize: 10, cellPadding: 2, minCellHeight: 50, valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 70 }, // Fixed width for image column
        3: { cellWidth: 200 }, // Description gets more space
      },
      didDrawCell: (data: any) => {
        // Ensure we only draw in the body rows, not the header
        if (data.section === 'body' && data.column.index === 0) {
          // 3. Retrieve the image using the row index from your source data
          const originalShot = this.shots[data.row.index];

          if (originalShot && originalShot.image) {
            const imgData = originalShot.image;

            // Calculate dimensions to fit image nicely
            const padding = 5;
            const cellWidth = data.cell.width;
            const cellHeight = data.cell.height;

            // Draw image inside the cell bounds
            try {
              // jspdf is smart enough to detect format usually, or you can specify 'PNG'/'JPEG'
              doc.addImage(
                imgData,
                'JPEG',
                data.cell.x + padding,
                data.cell.y + padding,
                cellWidth - padding * 2,
                cellHeight - padding * 2
              );
            } catch (err) {
              // Fallback or silent fail if image format is weird
              console.warn('Could not add image to PDF', err);
            }
          }
        }
      },
    });

    const fileName = `${(this.projectName || 'project').replace(/\s+/g, '_')}_shotlist.pdf`;
    doc.save(fileName);
  }
}
