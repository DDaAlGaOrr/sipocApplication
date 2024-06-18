import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { calendar, calendarOutline, exit, todayOutline } from 'ionicons/icons';
import { HttpService } from '../services/http.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { AuthConstants } from '../config/auth-constants';
import { StorageService } from './../services/storage.service';
import { AlertController } from '@ionic/angular';

import { IonInput, IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastService } from './../services/toast.service';

import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

// Mobiscroll imports
import {
  setOptions,
  MbscEventcalendarView,
  MbscCalendarEvent,
  localeEs,
  MbscEventcalendarOptions,
} from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import {
  ApiCalendarEvent,
  DataJsonEvents,
  TopLevel,
} from '../interfaces/calendar-events.interface';
import { StorageProjectService } from '../services/storage-project.service';

setOptions({
  locale: localeEs,
  theme: 'ios',
  themeVariant: 'light',
  clickToCreate: false,
  dragToCreate: false,
  dragToMove: false,
  dragToResize: false,
  eventDelete: false,
});

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  /* Check Productos Start */
  allChecked = false;
  indeterminate = false;
  checkOptionsOne = [
    { label: 'Registro sanitario', value: 'RS', checked: false },
    { label: 'Hoja seguridad', value: 'HS', checked: false },
    { label: 'Ficha técnica ', value: 'FT', checked: false },
    { label: 'Etiqueta a color', value: 'EC', checked: false },
  ];
  checkOptionsTwo = [
    { label: 'Registro sanitario', value: 'RS', checked: false },
    { label: 'Hoja seguridad', value: 'HS', checked: false },
    { label: 'Ficha técnica ', value: 'FT', checked: false },
    { label: 'Etiqueta a color', value: 'EC', checked: false },
  ];

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne[0].checked = true;
      this.checkOptionsTwo[0].checked = true;
    } else {
      this.checkOptionsOne[0].checked = false;
      this.checkOptionsTwo[0].checked = false;
    }
  }

  updateSingleChecked(): void {
    const firstOptionOneChecked = this.checkOptionsOne[0].checked;
    const firstOptionTwoChecked = this.checkOptionsTwo[0].checked;

    if (firstOptionOneChecked && firstOptionTwoChecked) {
      this.allChecked = true;
      this.indeterminate = false;
    } else if (firstOptionOneChecked || firstOptionTwoChecked) {
      this.indeterminate = true;
      this.allChecked = false;
    } else {
      this.allChecked = false;
      this.indeterminate = false;
    }
  }

  validateForm: FormGroup<{
    comentario: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    comentario: ['', [Validators.required]],
    remember: [true],
  });

  submitForm(): void {}

  /* Código del Collapse */
  selectedItem: number | null = null; // Variable para mantener el índice del elemento seleccionado

  // Método para alternar la visibilidad de un elemento y cerrar los demás
  toggleItem(index: number) {
    if (this.selectedItem === index) {
      // Si ya está seleccionado, ciérralo
      this.selectedItem = null;
    } else {
      // Si es diferente al seleccionado, ábrelo y cierra los demás
      this.selectedItem = index;
    }
  }

  // Método para verificar si un elemento está abierto
  isItemOpen(index: number): boolean {
    return this.selectedItem === index;
  }

  currentEvent: any[] = [];
  async presentAlert(event: any) {
    const alert = await this.alertController.create({
      header: `Desea iniciar el plan de trabajo con ${this.client_name} ?`,
      buttons: this.alertButtons,
    });
    this.currentEvent = event;

    await alert.present();
  }

  public alertButtons = [
    {
      text: 'Cancelar',
      cssClass: 'alert-button-cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Iniciar',
      cssClass: 'alert-button-confirm',
      role: 'confirm',
      handler: () => {
        // this.goTab3();
        this.linkIncident(this.currentEvent);
      },
    },
  ];

  /* this.linkIncident(this.abrirModalDocument()); */

  radioValue: any = null; // Valor predeterminado para el grupo de radio buttons
  reason: string = ''; // Variable para almacenar la razón

  isModalSurveyOpen = false;
  id_item_checklist: string = '';

  @ViewChild(IonModal)
  modal!: IonModal;

  message = 'Hello! ';
  name: string = '';

  fechaActual: Date = new Date(); // Esta es la variable que contiene la fecha actual

  selectedSegment: 'agenda' | 'incidencia' = 'agenda';

  selectedValue = null;

  selectedOption: string = ''; // Variable para almacenar la opción seleccionada
  showInput: boolean = false; // Variable para controlar la visibilidad del input
  classDblock: string = '';
  checklist_answers: any[] = [];

  inputValue?: string;

  // Checkbox items complete
  checked = true;

  userdata = this.authService.getUserData_();
  checklist_id: string = '';
  project_id: string = '';
  checklist: any[] = [];
  // Pagination
  currentPage: number = 1; // Página actual, inicializada en 1
  totalPages: number = 50; // Número total de páginas
  client_name: string = '';
  project_folio: string = '';
  subsidiary: string = '';
  currentDocumentalItem: number = -1;
  task_id: number = 0;

  myEvents: TopLevel[] = [];
  view = 'month';
  calView: MbscEventcalendarView = {
    calendar: {
      type: 'month',
      labels: false,
      popover: true,
      popoverClass: 'custom-event-popover',
    },
    agenda: { type: 'month' },
  };

  setOpen(isOpen: boolean, id: string, index: number) {
    this.isModalSurveyOpen = isOpen;
    this.id_item_checklist = id;
    this.currentDocumentalItem = index;
  }

  closeCheck(isOpen: boolean) {
    this.isModalSurveyOpen = isOpen;
    this.radioValue = null;
  }

  setClose(isOpen: boolean) {
    this.checklist_answers.push({
      id: this.id_item_checklist,
      answer: 'no',
      description: this.reason,
    });
    this.radioValue = '';
    this.reason = '';
    this.isModalSurveyOpen = isOpen;
  }
  answerDocumentalYes(idItemChecklist: string) {
    this.checklist_answers.push({
      id: idItemChecklist,
      answer: 'yes',
      description: '',
    });
  }

  // Método para abrir el modal
  abrirModalDocument() {
    return this.modal.present();
  }

  async goTab3() {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate(['/tabs/tab3'], {
      queryParams: {
        task_id: this.task_id,
        project_id: this.project_id,
      },
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate(['/tabs', 'tab1']);
  }

  skip() {
    this.modal.dismiss(null, 'cancel');
    this.router.navigate([
      '/tabs',
      'tab3',
      { task_id: this.task_id, project_id: this.project_id },
    ]);
    /* {queryParams: { task_id: this.task_id, project_id: this.project_id }} */
  }

  // Se redirecciona a la pantalla de actividades (tab3)
  confirm() {
    const data = {
      rel_id: this.project_id,
      rel_type: 'project',
      id_checklist: this.checklist_id,
      checklist_answers: this.checklist_answers,
    };
    if (this.checklist_answers.length != this.checklist.length) {
      this.toastService.presentToast('Faltan preguntas por responder');
      return;
    }

    this.httpService
      .post(
        `staffs/${this.userdata.staffid}/save_checklist`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {
            // this.id_task = '';
            // this.checklist_id = '';
            // this.checklist_answers = [];
            // // this.handlePlanSelect('');
            // this.get_detail_plan();
            this.toastService.presentToast('Tarea completada.');
            this.modal.dismiss(this.name, 'confirm');
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
    this.router.navigate(['/tabs/tab3']);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  eventSettings: MbscEventcalendarOptions = {
    view: {
      calendar: { type: 'month' },
      agenda: { type: 'month' },
    },
    onEventClick: (event, inst) => {
      // console.log(event);
      // console.log(inst);
      // this.abrirModalDocument();
    },
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router,
    private msg: NzMessageService,
    private httpService: HttpService,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private storageProjectService: StorageProjectService
  ) {}

  /* Método para manejar el cambio en el valor del radio button */
  handleRadioChange(value: string) {
    this.radioValue = value;
    if (value === 'no') {
      this.setOpen;
      this.classDblock = 'd-flex';
    } else {
      this.classDblock = '';
    }
  }

  segmentChanged() {
    this.showInput = this.selectedOption === 'no'; // Mostrar el input si se selecciona "No cumple"
    /* this.classDblock = this.showInput ? 'd-block' : 'd-none'; */
  }

  nzEvent(event: NzFormatEmitEvent): void {}

  linkIncident(event: any) {
    this.task_id = event.event.id;
    const project_id = event.event.project_id;
    const type = event.event.rel_type;

    if (type == 'project') {
      this.httpService
        .get(`staffs/${project_id}/documentalChecklist`, true)
        .then((observableResult) => {
          observableResult.subscribe(
            async (response: any) => {
              if (response.items) {
                const storage: any =
                  await this.storageProjectService.loadProgress();
                if (
                  storage.project_data?.queyParams?.project_id != project_id
                ) {
                  await this.storageProjectService.clearItems();
                }
                this.router.navigate(['/tabs', 'tab3'], {
                  queryParams: {
                    task_id: this.task_id,
                    project_id: project_id,
                    type: type,
                    is_active: false,
                  },
                });
                this.storageProjectService.saveProgress(
                  {
                    queyParams: {
                      task_id: this.task_id,
                      project_id: project_id,
                      type: type,
                    },
                  },
                  'current_project'
                );
              } else {
                this.toastService.presentToast('Plan de trabajo finalizado');
              }
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
    } else {
      this.httpService
        .get(`staffs/${project_id}/taskCompleted`, true)
        .then((observableResult) => {
          observableResult.subscribe(
            (response: any) => {
              console.log(response);
              if (response) {
                this.router.navigate(['/tabs', 'tab3'], {
                  queryParams: {
                    task_id: this.task_id,
                    project_id: project_id,
                    type: type,
                    is_active: false,
                  },
                });
              } else {
                this.toastService.presentToast('tarea ya finalizada');
              }
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
    }

    // this.router.navigate(['/tabs', 'tab3']);
    // this.router.navigate(['/tabs', 'tab3'], {
    //   queryParams: { title: title, project_id: project_id },
    // });
  }
  async borrarDatos() {
    await this.storageProjectService.clearItems();
    this.handleIfExistProject();
  }

  ngOnInit(): void {
    this.handleIfExistProject();

    this.httpService
      .get(`tasks/${this.userdata.staffid}/tasks`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            if (response.tasks) {
              const tasksEvents = response.tasks.map((apiEvent: any) => {
                const localDate = new Date(apiEvent.start_date);
                // Agregar un día
                localDate.setDate(localDate.getDate() + 1);
                return {
                  start: localDate,
                  end: localDate,
                  title: `${apiEvent.company} - ${apiEvent.subsidiary_id}`,
                  description: `Trampa: ${apiEvent.name}`,
                  id: apiEvent.userid,
                  project_id: apiEvent.id,
                  rel_type: 'project',
                  color: 'green',
                  // Otras propiedades según tus necesidades
                };
              });
              this.myEvents = tasksEvents;
            }

            if (response.tasks_uv) {
              const tasksUv = response.tasks_uv.map((apiEvent: any) => {
                const localDate = new Date(apiEvent.startdate);
                // Agregar un día
                localDate.setDate(localDate.getDate() + 1);
                return {
                  start: localDate,
                  end: localDate,
                  title: `${apiEvent.name} - ${apiEvent.subsidiary_id}`,
                  description: `${apiEvent.name}`,
                  id: apiEvent.rel_id,
                  project_id: apiEvent.id,
                  rel_type: 'task_uv',
                  color: 'purple',
                };
              });
              this.myEvents = this.myEvents.concat(tasksUv);
            }

            if (response.tasks_sup) {
              const tasksSup = response.tasks_sup.map((apiEvent: any) => {
                const localDate = new Date(apiEvent.startdate);
                // Agregar un día
                localDate.setDate(localDate.getDate() + 1);
                return {
                  start: localDate,
                  end: localDate,
                  title: `${apiEvent.name} - ${apiEvent.subsidiary_id}`,
                  description: `${apiEvent.name}`,
                  id: apiEvent.rel_id,
                  project_id: apiEvent.id,
                  rel_type: 'task_sup',
                  color: 'red',
                };
              });
              this.myEvents = this.myEvents.concat(tasksSup);
            }
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

  changeView(): void {
    setTimeout(() => {
      switch (this.view) {
        case 'month':
          this.calView = {
            calendar: { type: 'month' },
            agenda: { type: 'month' },
          };
          break;
        case 'week':
          this.calView = {
            calendar: { type: 'week' },
            agenda: { type: 'week' },
          };
          break;
        /* case 'day':
                    this.calView = {
                        agenda: { type: 'day' }
                    };
                    break; */
      }
    });
  }

  handleSegmentChange(event = []) {
    // this.selectedSegment = event.detail.value as 'agenda' | 'incidencia';
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

  async handleIfExistProject() {
    const storage = await this.storageProjectService.loadProgress();
    if (Object.keys(storage).length > 0) {
      const alert = await this.alertController.create({
        header: `Hay un plan de trabajo sin terminar, ¿desea continuar con este?`,
        buttons: this.alertStorageButtons,
      });
      await alert.present();
    }
  }
  public alertStorageButtons = [
    {
      text: 'Eliminar progreso',
      cssClass: 'alert-button-cancel',
      role: 'cancel',
      handler: async () => {
        await this.storageProjectService.clearItems();
      },
    },
    {
      text: 'Continuar',
      cssClass: 'alert-button-confirm',
      role: 'confirm',
      handler: async () => {
        const storage: any = await this.storageProjectService.loadProgress();
        this.router.navigate(['/tabs', 'tab3'], {
          queryParams: {
            task_id: storage.project_data.queyParams.task_id,
            project_id: storage.project_data.queyParams.project_id,
            type: storage.project_data.queyParams.type,
            is_active: true,
          },
        });
      },
    },
  ];
}
