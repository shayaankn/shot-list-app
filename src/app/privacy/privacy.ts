import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-xl mx-auto">
      <h2 class="text-stone-800 text-xl font-semibold mb-3">Privacy Policy</h2>
      <p class="text-sm text-stone-600 mb-4">
        This app stores project and shot data locally in your browser (localStorage). Uploaded images are stored as data URLs in localStorage.
        No data is sent to any server by default. Remove projects or clear browser storage to delete local data.
      </p>
      <a routerLink="/projects" class="text-sm text-stone-800 hover:underline">← Back to projects</a>
    </div>
  `,
})
export class Privacy {}
