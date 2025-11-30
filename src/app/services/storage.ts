import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Storage {
  private dbName = 'shotlist_db';
  private dbVersion = 1;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.dbVersion);
      req.onupgradeneeded = (ev: any) => {
        const db = ev.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('shots')) {
          db.createObjectStore('shots', { keyPath: 'projectId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async getProjects(): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const store = tx.objectStore('projects');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async addProject(project: any): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      const req = store.add(project);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['projects', 'shots'], 'readwrite');
      const projectsStore = tx.objectStore('projects');
      const shotsStore = tx.objectStore('shots');
      const req1 = projectsStore.delete(projectId);
      const req2 = shotsStore.delete(projectId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getShots(projectId: string): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('shots', 'readonly');
      const store = tx.objectStore('shots');
      const req = store.get(projectId);
      req.onsuccess = () => {
        const res = req.result;
        resolve((res && res.shots) || []);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async saveShots(projectId: string, shots: any[]): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('shots', 'readwrite');
      const store = tx.objectStore('shots');
      const req = store.put({ projectId, shots });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}
