import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
// const { Storage } = Plugins;
import { Storage } from '@ionic/storage';
const store = new Storage();

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  constructor() {

  }

  // Store the value
  async store(storageKey: string, value: any) {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    await store.set(storageKey,encryptedValue);
  }

  // Get the value
  async get(storageKey: string) {
    const ret = await store.get(storageKey);
    return JSON.parse(unescape(atob(ret.value)));
  }

  async removeStorageItem(storageKey: string) {
    await store.remove(storageKey);
  }

  // Clear storage
  async clear() {
    await store.clear();
  }
}