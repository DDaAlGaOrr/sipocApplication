import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageProjectService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async saveProgress(checklist: any, title: any) {
    await this.storage.set(title, checklist);
  }

  async loadProgress() {
    const savedProgress = await this.storage.get('checklistProgress');
    const project_data = await this.storage.get('current_project');
    const documentalProgress = await this.storage.get('documentalProgress');
    const evidenceType = await this.storage.get('evidenceType');
    if (savedProgress || documentalProgress) {
      return { savedProgress, project_data, documentalProgress, evidenceType };
    } else {
      return []; // o tu valor inicial
    }
  }

  async clearItems() {
    await this.storage.remove('checklistProgress');
    await this.storage.remove('current_project');
    await this.storage.remove('documentalProgress');
    await this.storage.remove('evidenceType');
  }

  async getSelectedItem(itemId: string) {
    const savedProgress = await this.storage.get('checklistProgress');
    return savedProgress[itemId];
  }

  async getDataBykey(key: any) {
    return await this.storage.get(key);
  }
}
