import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private signatureSource = new BehaviorSubject<string>(''); // Inicializa con una cadena vacía
  currentSignature = this.signatureSource.asObservable();

  constructor(
    private messageService: NzMessageService
  ) { }

  updateSignature(signature: string) {
    this.signatureSource.next(signature);
    this.messageService.create('success', 'Firma guardada con éxito');
  }
}
