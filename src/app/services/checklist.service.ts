import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  selectedItems: { [itemId: string]: ChecklistAnswer } = {};

  setSelectedItem(
    itemId: string,
    answer: string,
    description: string = '',
    urlImage: string = ''
  ) {
    if (!this.selectedItems) {
      this.selectedItems = {}; // Asegurar la inicialización
    }
    const existingItem = this.selectedItems[itemId];

    if (existingItem) {
      if (existingItem.answer !== answer) {
        existingItem.answer = answer;
        existingItem.description = description;
        existingItem.urlImage = urlImage;
      }
    } else {
      this.selectedItems[itemId] = {
        id: itemId,
        answer: answer,
        description: description,
        urlImage: urlImage,
      };
    }
    console.log(this.selectedItems);
  }

  getSelectedItem(itemId: string) {
    if (!this.selectedItems) {
      // console.error('selectedItems is undefined');
      return false;
    }
    return this.selectedItems[itemId];
  }

  getAllItems() {
    return this.selectedItems;
  }

  clearItems() {
    this.selectedItems = {};
  }

  getLength() {
    return Object.keys(this.selectedItems).length;
  }

  setCurrentProgress(progress: any) {
    this.selectedItems = progress;
  }
}

interface ChecklistAnswer {
  id: string;
  answer: string;
  description: string;
  urlImage: string;
}
