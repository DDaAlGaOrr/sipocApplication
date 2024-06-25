import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChecklistTaskService {
  selectedItems: { [itemId: string]: ChecklistAnswer } = {};

  setSelectedItem(
    itemId: string,
    answer: string,
    description: string,
    urlImage: string = '',
    customer_responsibility: boolean,
    correctiveTaskAction: string
  ) {
    console.log('Me llamaron')
    const existingItem = this.selectedItems[itemId];
    if (existingItem) {
      existingItem.answer = answer;
      existingItem.description = description;
      existingItem.urlImage = urlImage;
      existingItem.customer_responsibility = customer_responsibility;
      existingItem.correctiveTaskAction = correctiveTaskAction;
    } else {
      this.selectedItems[itemId] = {
        id: itemId,
        answer: answer,
        description: description,
        urlImage: urlImage,
        customer_responsibility: customer_responsibility,
        correctiveTaskAction: correctiveTaskAction,
      };
    }
    console.log(this.selectedItems);
  }

  getSelectedItem(itemId: string): ChecklistAnswer | undefined {
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
}

interface ChecklistAnswer {
  id: string;
  answer: string;
  description: string;
  urlImage: string;
  customer_responsibility: boolean;
  correctiveTaskAction: string;
}
