import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  selectedItems: { [rel_id: string]: ProjectAnswers } = {};

  setGeneralChecklist(
    rel_id: string,
    rel_type: string,
    id_checklist: string,
    checklist_answers: any,
    // taskStatus: any = '',
    description: any = ''
  ) {
    if (!this.selectedItems) {
      this.selectedItems = {}; // Asegurar la inicialización
    }
    const existingItem = this.selectedItems[rel_id];
    if (existingItem) {
      existingItem.rel_id = rel_id;
      existingItem.checklist_answers = checklist_answers;
      existingItem.rel_type = rel_type;
      existingItem.id_checklist = id_checklist;
      // existingItem.taskStatus = taskStatus;
      existingItem.description = description;
    } else {
      this.selectedItems[rel_id] = {
        rel_id: rel_id,
        checklist_answers: checklist_answers,
        rel_type: rel_type,
        id_checklist: id_checklist,
        // taskStatus: taskStatus,
        description: description,
      };
    }
    console.log(this.selectedItems);
  }
  getSelectedItem(rel_id: string) {
    if (!this.selectedItems) {
      // console.error('selectedItems is undefined');
      return false;
    }
    return this.selectedItems[rel_id];
  }

  getAllItems() {
    return this.selectedItems;
  }

  clearItems() {
    this.selectedItems = {};
  }

  setCurrentProgress(progress: any) {
    this.selectedItems = progress;
  }

  getLength() {
    return Object.keys(this.selectedItems).length;
  }
}
interface ProjectAnswers {
  rel_id: string;
  rel_type: string;
  id_checklist: string;
  checklist_answers: any;
  // taskStatus: string;
  description: string;
}
interface ChecklistAnswer {
  id: string;
  answer: string;
  description: string;
  urlImage: string;
}
