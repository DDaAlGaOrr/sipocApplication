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
}  