import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonTabs } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { HttpService } from '../services/http.service';
import { ToastService } from './../services/toast.service';
import { ModalService } from './../services/modal.service';
import { formatDate } from '@angular/common';
import { IonicSelectableComponent } from 'ionic-selectable';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MbscSelectOptions, setOptions, localeEs } from '@mobiscroll/angular';

import { DatePipe } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  Storage,
} from '@angular/fire/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  selectedOption: string = '';
  inputValue?: string;
  userdata: any;
  clientes: any[] = [];
  subsidiaries: any[] = [];
  subsidiarySelect: string = '';
  servicesRnp: any[] = [];
  // subsidiarySelect: string = '';
  clientSelect: string = '';
  areaSelect: string = '';
  startDate: string = '';
  endDate: string = '';
  prioritySelect: string = '';
  ResponsibleSelect: string = '';
  ticketType: string = '';
  cinturones: any[] = [];
  trampas: any[] = [];
  titleTicket: string = '';
  isOpenTicketsModal: boolean = false;
  evidenceImageTicket: any;
  cliente_select: any;
  cliente_select_id: any = '';
  port: any;
  correctiveAction: any = '';
  selected_task: any = 0;
  selectedTabModal: any = 'modalTab';
  isTicketSpinning: boolean = false;
  // selectSettings: any;
  selectSettings: MbscSelectOptions = {
    context: '#tickets_modal',
  };
  userdata_: any = {};

  @ViewChild(IonModal) modal?: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name?: string;

  cancel() {
    this.modal?.dismiss(null, 'Cancelar');
  }

  async confirm() {
    this.isTicketSpinning = true;
    let validate = true;
    if (this.titleTicket == '') {
      this.toastService.presentToast('Debes agregar un titulo');
      validate = false;
      return;
    }

    if (this.titleTicket == '') {
      this.toastService.presentToast('Debes agregar un titulo');
      validate = false;
      return;
    }

    if (this.prioritySelect == '') {
      this.toastService.presentToast('Debes seleccionar una prioridad');
      validate = false;
      return;
    }

    if (this.ResponsibleSelect == '') {
      this.toastService.presentToast('Debes seleccionar a un responsable');
      validate = false;
      return;
    }

    if (this.inputValue == '') {
      this.toastService.presentToast('Debes agregar un comentario');
      validate = false;
      return;
    }

    // if (!this.evidenceImageTicket) {
    //   this.toastService.presentToast('Debes agregar una imagen');
    //   validate = false;
    //   return;
    // }

    if (this.startDate == '') {
      this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    }
    if (this.ResponsibleSelect == '1') {
      if (this.endDate == '') {
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
      }
    }
    console.log(validate);

    if (validate) {
      let url = '';
      if (this.evidenceImageTicket) {
        const blob = this.dataUrlToBlob(this.evidenceImageTicket);
        url = await this.uploadImage(blob, 'ticketEvidence');
        this.evidenceImageTicket = '';
      }

      const data = {
        client_id: this.cliente_select_id,
        subsidiary_id: this.subsidiarySelect,
        area_select: this.areaSelect,
        start_date: this.startDate,
        end_date: this.endDate,
        priority: this.prioritySelect,
        responsible: this.ResponsibleSelect,
        userid: 1,
        department: 16,
        contactid: 1,
        subject: this.titleTicket,
        type: this.ticketType,
        description: this.inputValue,
        url_image: url,
        create_for: 'incidencia',
        trampa: this.selected_task,
        staff_id: this.userdata_.staffid,
        correctiveAction: this.correctiveAction,
      };
      console.log(this.userdata_);
      console.log(data);
      this.httpService
        .post(`tickets`, JSON.stringify(data), true)
        .then((observableResult) => {
          observableResult.subscribe(
            (res: any) => {
              if (res.status) {
                this.toastService.presentToast('Incidencia creada');
                this.clientSelect = '';
                this.titleTicket = '';
                this.cliente_select = '';
                this.selectedOption = '';
                this.cliente_select_id = '';
                this.subsidiarySelect = '';
                this.areaSelect = '';
                this.startDate = '';
                this.endDate = '';
                this.prioritySelect = '';
                this.ResponsibleSelect = '';
                this.inputValue = '';
                this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
                this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
                this.correctiveAction = '';
                this.isTicketSpinning = false;
                this.isOpenTicketsModal = false;
              } else {
                this.toastService.presentToast('Error al crear incidencia');
              }
            },
            (error: any) => {
              console.log(error);
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
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'Aceptar') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  // Upload Files
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} archivo subido exitosamente.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} error al subir archivo.`);
    }
  }

  handleType(event: any) {
    const type = event.detail.value;

    if (type == 'areas') {
      this.trampas = [];
      this.ticketType = 'area';
      this.httpService
        .get(`staffs/${this.subsidiarySelect}/getRnp`, true)
        .then((observableResult) => {
          observableResult.subscribe(
            (response: any) => {
              this.servicesRnp = response;
            },
            (error: any) => {
              console.error('Error al enviar datos:', error);
              // Puedes manejar el error aquí
            }
          );
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud de calendar:', error);
          // Puedes manejar el error aquí
        });
    } else if (type == 'trampas') {
      this.ticketType = 'task';
    }
  }

  selectedTab: any = 'login';
  @ViewChild('tabs', { static: false }) tabs!: IonTabs;
  constructor(
    private authservice: AuthService,
    private msg: NzMessageService,
    private httpService: HttpService,
    private toastService: ToastService,
    private modalService: ModalService,
    private storage: Storage
  ) {
    // this.authservice
    //   .getUserData()
    //   .then((userData: any) => {
    //     this.userdata = userData;
    //     // this.userdata_ = userData;
    //     this.userdata.staffid;
    //     console.log(this.userdata);
    //   })
    //   .catch((error: any) => {
    //     console.error('Error al obtener datos del usuario:', error);
    //   });
    // this.authservice
    //   .getUserData()
    //   .then((userData: any) => {
    // this.userdata = userData;
    // })
    // .catch((error: any) => {
    //   console.error('Error al obtener datos del usuario:', error);
    // });
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
    console.log('Selected tab:', this.selectedTab);
  }

  logout() {
    this.authservice.logout();
  }

  handleClientSelect(event: any) {
    const selectClient = event.detail.value;
    this.clientSelect = selectClient;
    this.httpService
      .get(`staffs/${selectClient}/subsidary`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.subsidiaries = response;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
            // Puedes manejar el error aquí
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
        // Puedes manejar el error aquí
      });
  }

  subsidiaryChange(event: { component: IonicSelectableComponent; value: any }) {
    this.subsidiarySelect = event.value.id_subsidiary;
    this.ticketType = 'subsidiary';
    this.httpService
      .get(`staffs/${this.subsidiarySelect}/get_clients_operator`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.cliente_select_id = response.userid;
            this.cliente_select = response.company;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
      });
  }

  handleSubsidiarySelect(event: any) {
    this.subsidiarySelect = event.value;
    this.ticketType = 'subsidiary';
    // $this->clients_model->get_clients_operator($subsidiary_id);
    this.httpService
      .get(`staffs/${this.subsidiarySelect}/get_clients_operator`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            console.log(response);
            this.cliente_select_id = response.userid;
            this.cliente_select = response.company;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
            // Puedes manejar el error aquí
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
        // Puedes manejar el error aquí
      });
  }

  handleControl(event: any) {
    const control = event.detail.value;
    this.subsidiarySelect;
    const data = {
      control: control,
      subsidiary_id: this.subsidiarySelect,
    };
    this.httpService
      .post(
        `staffs/${this.userdata_.staffid}/getTasks`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.cinturones = response;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
            // Puedes manejar el error aquí
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
        // Puedes manejar el error aquí
      });
  }

  handleCinturon(event: any) {
    const cinturon = event.detail.value;
    const data = {
      cinturon: cinturon,
      subsidiary_id: this.subsidiarySelect,
    };
    this.httpService
      .post(
        `staffs/${this.userdata_.staffid}/get_trampas`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.trampas = response;
            // this.cinturones = response;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
            // Puedes manejar el error aquí
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
        // Puedes manejar el error aquí
      });
  }

  handleArea(event: any) {
    this.areaSelect = event.detail.value;
  }
  onStartDateChange(event: any) {
    this.startDate = new Date(event.detail.value).toLocaleDateString();
  }
  onEndDateChange(event: any) {
    this.endDate = new Date(event.detail.value).toLocaleDateString();
  }
  handlePriority(event: any) {
    this.prioritySelect = event.detail.value;
  }
  handleResponsible(event: any) {
    this.ResponsibleSelect = event.detail.value;
  }

  showTicketsModal(open: boolean): void {
    this.isOpenTicketsModal = open;
    this.get_subsidiary_tieckets();
  }

  async takePicture() {
    try {
      if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();
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
      const filePath = `${route}/${currentDate}.jpg`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      throw error;
    }
  }

  getSelectedtask(task_id: any) {
    return this.selected_task == task_id;
  }

  setSelectedTask(task_id: any) {
    this.selected_task = task_id;
  }

  get_subsidiary_tieckets() {
    this.userdata_ = this.authservice.getUserData_();

    console.log(this.userdata_);
    this.httpService
      .get(`staffs/${this.userdata_.staffid}/get_subsidiaries_for_staff`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            const subsidiaries: any[] = [];

            response.forEach((element: any) => {
              subsidiaries.push({
                text: `${element.id_subsidiary} - ${element.client_name}`,
                value: element.id_subsidiary,
              });
            });
            this.subsidiaries = subsidiaries;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
            // Puedes manejar el error aquí
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
      });
  }
}
