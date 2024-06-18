import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  ticketsModal: boolean = false;
  public showTicketsModal(open: boolean): void {
    this.ticketsModal = open;
  }
  public getTicketsModalValue(): boolean {
    return this.ticketsModal;
  }
}
