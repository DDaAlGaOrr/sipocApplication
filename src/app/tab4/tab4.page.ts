import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { addDays, formatDistance } from 'date-fns';
import { AuthService } from './../services/auth.service';

import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  Storage,
} from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastService } from './../services/toast.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {
  commentArea: string = '';

  commentForm = this.formBuilder.group({
    comment: ['', Validators.required],
  });

  inputValue?: string;
  options: [{ value: string; label: string }] = [{ value: '', label: '' }];
  client_name: string = '';
  subsidiary_id: string = '';
  responsible: string = '';
  status: string = '';
  priority: string = '';
  description: string = '';
  start_date: string = '';
  subject: string = '';
  userdata = this.authService.getUserData_();
  evidenceImageTicket: any = '';
  ticket_id: any = '';
  tickets_responses: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private authService: AuthService,
    private storage: Storage,
    private androidPermissions: AndroidPermissions,
    private toastService: ToastService
  ) {
    for (let i = 10; i < 36; i++) {
      this.options.push({
        value: i.toString(36) + i,
        label: i.toString(36) + i,
      });
    }
    this.load_ticket_data();
    console.log(this.userdata);
  }

  updateCommet() {
    this.commentForm.patchValue({
      comment: 'Comentario aquí',
    });
  }

  async onSubmit() {
    const blob = this.dataUrlToBlob(this.evidenceImageTicket);
    const url = await this.uploadImage(blob, 'ticketEvidenceResponse');
    const data = {
      description: this.inputValue,
      image_url: url,
      ticket_id: this.ticket_id,
    };

    this.httpService
      .post(
        `staffs/${this.userdata.staffid}/save_ticket_response`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {
            this.evidenceImageTicket = '';
            this.commentForm.patchValue({
              comment: '',
            });
            console.log(res);
            this.load_ticket_data();
          },
          (error: any) => {
            this.toastService.presentToast(
              'Error en la red, comuníquese con un administrador.'
            );
          }
        );
      })
      .catch((error) => {
        // Manejar errores relacionados con la promesa
        console.error('Error al realizar la solicitud de login:', error);
      });
  }

  load_ticket_data() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.ticket_id = params['tickect'];
      this.httpService
        .get(`staffs/${this.ticket_id}/getTickets`, true)
        .then((observableResult) => {
          observableResult.subscribe(
            (response: any) => {
              this.client_name = response.tickets.client_name;
              this.subsidiary_id = response.tickets.subsidiary_id;
              this.responsible = response.tickets.responsible;
              this.status = response.tickets.status;
              this.priority = response.tickets.priority;
              this.description = response.tickets.description;
              this.start_date = response.tickets.start_date;
              this.subject = response.tickets.subject;
              this.tickets_responses = response.tickets_responses;
              console.log(response);
            },
            (error: any) => {
              console.error('Error al enviar datos:', error);
            }
          );
          // return this.modal.present();
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud de calendar:', error);
        });
    });
  }
  // Upload Files
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.msg.success(`${file.name} archivo subido exitosamente.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} error al subir archivo.`);
    }
  }

  async takePictureTicket() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(
            (result: any) => {
              if (result.hasPermission) {
                // Acceder a la cámara
              } else {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.CAMERA
                );
              }
            },
            (err: any) =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.CAMERA
              )
          );
      }
      const evidenceImageTicket = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      this.evidenceImageTicket = evidenceImageTicket.dataUrl;
    } catch (error) {
      console.log(error);
    }
  }

  dataUrlToBlob(dataUrl: string) {
    const arr = dataUrl.split(',');
    if (arr.length !== 2) {
      throw new Error('Invalid data URL format');
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: Blob, route: string) {
    try {
      const currentDate = Date.now();
      const filePath = `${route}/${currentDate}.jpg`; // Cambié la extensión a jpg, puedes ajustarla según necesites
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      const url = getDownloadURL(fileRef); // Espera a que se obtenga la URL de descarga
      return url;
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      throw error; // Lanza el error para que pueda ser manejado por el llamador
    }
  }
}
