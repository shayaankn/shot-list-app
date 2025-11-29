import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-xl mx-auto">
      <h2 class="text-stone-800 text-xl font-semibold mb-3">Disclaimer</h2>
      <p class="text-sm text-stone-600 mb-4">
        The Shot List App is provided as-is for planning and organizing shots. The author is not responsible for data loss or production decisions.
        Keep backups of important data and verify critical information through your production workflows.
      </p>
      <a routerLink="/projects" class="text-sm text-stone-800 hover:underline">← Back to projects</a>
    </div>
  `,
})
export class Disclaimer {}
