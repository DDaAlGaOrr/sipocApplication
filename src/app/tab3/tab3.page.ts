import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonInput, IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { NzMessageService } from 'ng-zorro-antd/message';
import { formatDate } from '@angular/common';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service';
import { StorageProjectService } from '../services/storage-project.service';
import { AuthService } from './../services/auth.service';
import { ChecklistService } from './../services/checklist.service';
import { ChecklistUvService } from './../services/uv-checklist.service';
import { ChecklistTaskService } from './../services/checklist-tasks.service';
import { ToastService } from './../services/toast.service';
import { SignatureService } from './../services/signature-service.service';
import { ProjectService } from './../services/project.service';
import { IonicSelectableComponent } from 'ionic-selectable';

import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NonNullableFormBuilder,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageReference } from '@firebase/storage';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { timeSharp } from 'ionicons/icons';
import { Observable, from } from 'rxjs';

interface Task {
  id: string;
  description: string;
  cinturon: string;
}

interface TasksGroup {
  [key: string]: Task[];
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
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

  generalUvChecklist = [
    { question: 'BAJO', value: 1 },
    { question: 'MODERADO', value: 2 },
    { question: 'ALTA', value: 3 },
    { question: 'MUY ALTA', value: 4 },
    { question: 'EXTREMO', value: 5 },
  ];

  pestUvChecklist = [
    { question: 'VERDE', value: 1 },
    { question: 'AMARILLO', value: 2 },
    { question: 'ROJO', value: 3 },
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
  /* Check Productos End */

  /* Pagination Code Start */
  paginaActual: number = 1;
  totalPaginas: number = 30;
  porcentajeProgreso = 5;
  opcionSeleccionada: number = 0;
  paginaActualAux = 1;

  calcularPorcentajeProgreso() {
    this.porcentajeProgreso = (this.paginaActual / this.totalPaginas) * 100;
  }

  paginaCambiada(evento: number): void {
    this.paginaActual = evento;
    this.opcionSeleccionada = evento - 1;
  }

  mostrarDiv(): void {
    this.paginaActual = this.opcionSeleccionada + 1;
    this.calcularPorcentajeProgreso();
  }

  /* Pagination Code End */

  /* TABS LOGIC START */
  selectedSegment: 'documental' | 'piso' = 'documental';
  handleSegmentChange(event = []) {
    // this.selectedSegment = event.detail.value as 'agenda' | 'incidencia';
  }
  /* TABS LOGIC END */

  /* COLLAPSE CODE START */
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
  handleSelectedGroup(ev: any) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const project_id = params['project_id'];
      this.httpService
        .get(`staffs/${project_id}/cinturones`, true)
        .then((observableResult) => {
          observableResult.subscribe(
            (response: any) => {
              this.cinturones = response.split(',');
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
  /* COLLAPSE CODE END */

  selectedValue = null;

  selectedOption: string = ''; // Variable para almacenar la opción seleccionada
  showInput: boolean = false; // Variable para controlar la visibilidad del input
  classDblock: string = '';
  documental_checklist_answers: any[] = [];
  checklist_answers: any[] = [];
  cinturones: any[] = [];
  tasksCinturones: any[] = [];
  signaturePicture: string = '';
  evidenceType: string = '';
  emailsignature: any = '';
  lastnamesignature: any = '';
  namesignature: any = '';
  uvTotalTasks: TasksGroup = {};
  typeProject: any = '';
  port: any;

  emailSignatureValue: any = '';
  lastNameSignatureValue: any = '';
  nameSignatureValue: any = '';
  isSpinning: boolean = false;
  // isSpinning: boolean = true;

  currentUvChecklist: any = [];
  correctiveAction: any = '';
  taskStatus: any = '';

  uv_task: any = 0;

  showModalAddMinuteItem = false;
  taskAgreement: string = '';
  taskResponsable: string = '';
  taskMinuteStatus: string = '';
  minuteDate: any = '';
  minuteTable: any[] = [];

  signatureValidator(control: AbstractControl): ValidationErrors | null {
    const signature = control.value as string; // Suponiendo que el valor es una cadena base64
    if (!signature) {
      return { noSignature: true }; // Retorna un error si no hay firma
    }
    return null; // Retorna null si la firma está presente
  }

  /* Variables de inputs de modal Signature */
  validateSignForm: FormGroup<{
    namesignature: FormControl<string>;
    lastnamesignature: FormControl<string>;
    emailsignature: FormControl<string>;
    /* signature: FormControl<string>; */
  }> = this.fb.group({
    namesignature: ['', [Validators.required]],
    lastnamesignature: ['', [Validators.required]],
    emailsignature: ['', [Validators.required, Validators.email]],
    /* signature: ['', [this.signatureValidator]] */
  });
  userdata_ = this.authService.getUserData_();

  constructor(
    private signatureService: SignatureService,
    private formBuilder: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private authService: AuthService,
    private httpService: HttpService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private checklistService: ChecklistService,
    private checklistTaskService: ChecklistTaskService,
    private storage: Storage,
    private androidPermissions: AndroidPermissions,
    private projectService: ProjectService,
    private checklistUvService: ChecklistUvService,
    private storageProjectService: StorageProjectService,
    private cdr: ChangeDetectorRef
  ) {
    /* Inicializar los check en si por default */
    // this.radioValue = 'yes';

    this.authService
      .getUserData()
      .then((userData: any) => {
        this.userdata = userData;
        this.httpService
          .get(`staffs/${this.userdata.staffid}/clients`, true)
          .then((observableResult) => {
            observableResult.subscribe(
              (response: any) => {
                this.clientes = response;
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
      })
      .catch((error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      });

    for (let i = 10; i < 36; i++) {
      this.options.push({
        value: i.toString(36) + i,
        label: i.toString(36) + i,
      });
    }
  }

  submitSignatureForm() {
    this.signatureService.currentSignature.subscribe(async (signature) => {
      let type = '';
      this.activatedRoute.queryParams.subscribe((params) => {
        type = params['type'];
      });
      const blob = this.dataUrlToBlob(signature);
      const url = await this.uploadImage(blob, 'singatureEvidence');
      this.signaturePicture = url;
      if (type == 'task_sup') {
        this.saveMinuteTask(this.project_id);
      } else {
        this.validateTaskChecklists(this.project_id);
      }

      this.isSpinning = true;
    });
  }

  clientes: any[] = [];
  subsidiaries: any[] = [];
  planes: any[] = [];
  tasksData: any[] = [];
  subsidiarySelected: any;
  checklist: any[] = [];
  id_task: string = '';
  task_number: string = '';
  task_control: string = '';
  checklist_id: string = '';
  documental_checklist_id: string = '';
  inputValue?: string;
  checked = true;
  @ViewChild(IonModal)
  modal!: IonModal;
  message = 'Hello! ';
  name: string = '';
  userdata: any;
  planSelect: any;
  client_name: any = '';
  subsdiary_name: any = '';
  plan_name: any = '';

  openSignatureModal = false;
  openDocumentModal = false;
  modalTaskAnswerNo = false;
  openTaskModal = false;
  id_item_checklist: string = '';

  // radioValue: string = 'yes'; // Valor predeterminado para el grupo de radio buttons
  reason: string = ''; // Variable para almacenar la razón
  taskReason: string = ''; // Variable para almacenar la razón
  services_areas: any[] = [];
  formattedTasks: any[] = [];
  sectionList: any[] = [];
  sectionListItems: any[] = [];
  currentDocumentalItem: number = 0;
  project_id: any = '';
  currentTaskChecklistItem: string = '';
  allDocumentalChecklistItems = [];
  productsDocumntalChecklist: any = [];
  productsDocumntalChecklistAnswers: any = {};
  techniciansDocumntalChecklistAnswers: any = {};
  evaluationAnswers: any = {};
  techniciansDocumntalChecklist: any = [];
  isOpenTicketsModal: boolean = false;
  isTicketSpinning: boolean = false;

  ticketClientSelectId: string = '';
  ticketClientSelect: string = '';
  ticketSubsidiarySelect: string = '';
  ticketSubsidiarySelectid: string = '';
  ticketAreaSelect: string = '';
  ticketAreaSelectid: string = '';

  titleTicket: string = '';
  responsibleSelect: string = '';
  prioritySelect: string = '';
  descriptionTicket: string = '';
  endDate: string = '';
  startDate: string = '';

  evidenceImageTask: any;
  evidenceImageDocumental: any;
  evidenceImageTicket: any;
  techniciansResponse: any;
  productsResponse: any;

  isSelectUvMeasure: any = false;

  taskChecked: boolean = false;

  checklistMeasureSelected: any = '';

  selectedText: string = 'Seleccionado';
  selectedTexts: string[] = [];
  selectedTextsTechnicians: string[] = [];
  uv_checklist_name: string = '';
  uv_question_id: string = '';
  correctiveTaskAction: string = '';

  uvDescription: string = '';

  openSignature(opened: boolean) {
    this.openSignatureModal = opened;
  }

  setOpen(isOpen: boolean, id: string, index: number) {
    this.openDocumentModal = isOpen;
    this.id_item_checklist = id;
    this.currentDocumentalItem = index;
  }
  async setCloseDocumentalNo(isOpen: boolean) {
    if (this.evidenceImageDocumental) {
      const blob = this.dataUrlToBlob(this.evidenceImageDocumental);
      const url = await this.uploadImage(blob, 'documentalEvidence');
      this.checklistService.setSelectedItem(
        this.id_item_checklist,
        'no',
        this.reason,
        url
      );
    } else {
      this.checklistService.setSelectedItem(
        this.id_item_checklist,
        'no',
        this.reason,
        ''
      );
    }
    this.reason = '';
    this.evidenceImageDocumental = '';
    this.openDocumentModal = isOpen;

    await this.storageProjectService.saveProgress(
      this.checklistService.getAllItems(),
      'documentalProgress'
    );
    console.log(
      await this.storageProjectService.getDataBykey('documentalProgress')
    );
    console.log(this.checklistService.getAllItems());
  }
  setClose(isOpen: boolean) {
    this.openDocumentModal = isOpen;
  }

  closeCheck(isOpen: boolean) {
    this.openDocumentModal = isOpen;
    /* this.radioValue = null; */
  }

  closeTaskModal() {
    this.openTaskModal = false;
  }

  validateForm: FormGroup<{
    comentario: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    comentario: ['', [Validators.required]],
    remember: [true],
  });
  answerTaskYes(idItemChecklist: string) {
    this.checklistTaskService.setSelectedItem(
      idItemChecklist,
      'yes',
      '',
      '',
      false,
      ''
    );
    // if (isRnp) {
    //   this.showTicketsModal(true);
    // }
  }

  submitForm(): void {}

  async saveDocumentalAnswers() {
    let type = '';
    this.activatedRoute.queryParams.subscribe((params) => {
      type = params['type'];
    });
    const data = {
      rel_id: this.project_id,
      rel_type: type,
      id_checklist: 31,
      checklist_answers: this.checklistService.getAllItems(),
      signaturePicture: this.signaturePicture,
      tasksAnswers: this.projectService.getAllItems(),
      productsResponse: this.productsResponse,
      techniciansResponse: this.techniciansResponse,
      evidenceType: this.evidenceType == 'fisica' ? 1 : 2,
      namesignature: this.nameSignatureValue,
      lastnamesignature: this.lastNameSignatureValue,
      emailsignature: this.emailSignatureValue,
      staff_id: this.userdata_.staffid,
    };
    console.log(data);
    this.httpService
      .post(
        `staffs/${this.userdata_.staffid}/save_checklist`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          async (res: any) => {
            this.openSignatureModal = false;
            this.isSpinning = false;
            this.openSignature(false);
            this.openDocumentModal = false;
            this.id_task = '';
            this.checklist_id = '';
            this.checklist_answers = [];
            this.projectService.clearItems();
            this.toastService.presentToast('Plan de trabajo finalizado');
            this.checklistService.clearItems();
            this.emailSignatureValue = '';
            this.nameSignatureValue = '';
            this.lastNameSignatureValue = '';
            await this.storageProjectService.clearItems();
            this.cdr.detectChanges();

            // Navegar a la nueva página después de un pequeño retraso
            setTimeout(() => {
              this.router.navigate(['tabs/tab1']);
            }, 100); //
            this.router.navigate(['tabs/tab1']);
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
  cancel() {
    this.modalTaskAnswerNo = false;
    // this.modal.dismiss(null, 'cancel');
  }
  // Redirection to Daily Work (tab2)
  linkIncident() {
    this.router.navigate(['/tabs', 'tab2']);
  }
  validateTaskChecklists(project_id: any) {
    if (this.projectService.getLength() < this.tasksData.length) {
      this.toastService.presentToast('Faltan trampas por revisar');
    } else {
      this.validateDocumentalChecklists();
    }
    // this.httpService
    //   .get(`staffs/${project_id}/validateTaskChecklists`, true)
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         if (response == 2) {
    //           this.validateDocumentalChecklists();
    //         } else {
    //
    //         }
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
  }

  validateDocumentalChecklists() {
    // console.log(allDocumentalChecklistItems.length);
    // console.log(this.checklistService.getLength());
    // if (
    //   this.allDocumentalChecklistItems.length !=
    //   this.checklistService.getLength()
    // ) {
    //   this.toastService.presentToast('Faltan reactivos de documental');
    // } else {
    this.saveDocumentalAnswers();
    // }
  }

  get_detail_plan() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const project_id = params['project_id'];
      this.project_id = project_id;
      this.typeProject = params['type'];
      if (this.typeProject == 'project') {
        this.httpService
          .get(`staffs/${project_id}/tasks`, true)
          .then((observableResult) => {
            observableResult.subscribe(
              (response: any) => {
                // console.log(response);
                this.tasksData = response.tasks;
                this.services_areas = response.service_area;
                this.client_name = `${response.plan_detail[0].client} - ${response.plan_detail[0].id_subsidiary}`;
                this.subsdiary_name = response.plan_detail[0].subsidiary;
                this.plan_name = response.plan_detail[0].folio;
                this.formatTasksObject(
                  response.tasks,
                  response.service_area,
                  response.cinturones.split(', ')
                );
                // if (response.items.length > 0) {
                this.checklist = response.items;
                this.documental_checklist_id = response.checklist[0].id;
                /* this.modal.present(); */
                // }
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
          .get(`staffs/${project_id}/tasks_uv`, true)
          .then((observableResult) => {
            observableResult.subscribe(
              (response: any) => {
                console.log(response);
                const groupedTasks = response.tasks.reduce(
                  (acc: any, task: any) => {
                    const { cinturon } = task;
                    if (!acc[cinturon]) {
                      acc[cinturon] = [];
                    }
                    acc[cinturon].push(task);
                    return acc;
                  },
                  {}
                );

                console.log(groupedTasks);
                this.client_name = response.plan_detail[0].name_client;
                this.subsdiary_name = response.plan_detail[0].client_name;
                this.uvTotalTasks = groupedTasks;
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
    });
  }

  getDocumentalChecklist() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const project_id = params['project_id'];
      this.typeProject = params['type'];
      if (this.typeProject == 'project') {
        this.httpService
          .get(`staffs/${project_id}/documentalChecklist`, true)
          .then((observableResult) => {
            this.storageProjectService.init();
            observableResult.subscribe(
              (response: any) => {
                console.log('Documental');
                console.log(response);
                const checklistItemsBySection: any = {};
                this.totalPaginas = response.checklist_sections.length;
                for (const sectionId in response.items) {
                  if (response.items.hasOwnProperty(sectionId)) {
                    const sectionItems = response.items[sectionId];
                    if (Array.isArray(sectionItems)) {
                      checklistItemsBySection[sectionId] = sectionItems;
                    } else {
                      const indexName = Object.keys(sectionItems)[0];
                      checklistItemsBySection[sectionId] = {
                        subsection: true,
                        name: indexName,
                        items: sectionItems[indexName],
                      };
                      this.evaluationAnswers[sectionId] = {
                        items: sectionItems[indexName],
                      };
                    }
                  }
                }

                // Guardar la lista de secciones con sus elementos
                this.sectionListItems = response.checklist_sections.map(
                  (section: any) => {
                    let extraAnswerDescription = '';
                    let sections = [19, 16, 8, 9];
                    if (sections.includes(parseInt(section.id))) {
                      switch (parseInt(section.id)) {
                        case 19:
                          extraAnswerDescription =
                            'TECNICO NO SE ENCUENTRA EN PISO/NA';
                          break;
                        case 16:
                          extraAnswerDescription =
                            'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                          break;
                        case 8:
                          extraAnswerDescription =
                            'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                          break;
                        case 9:
                          extraAnswerDescription =
                            'CUMPLE EN REVISIÓN POR EL CLIENTE';
                          break;
                      }
                    }

                    return {
                      extraAnswer: sections.includes(parseInt(section.id)),
                      extraAnswerDescription,
                      ...section,
                      items: checklistItemsBySection[section.id] || [],
                    };
                  }
                );
                this.sectionList = response.checklist_sections;
                this.productsDocumntalChecklist = response.products.products;
                this.techniciansDocumntalChecklist =
                  response.products.technicians_name;
                this.selectedTexts = Array(
                  response.products.products.length
                ).fill('Seleccionado');

                this.selectedTextsTechnicians = Array(
                  response.products.technicians_name.length
                ).fill('Seleccionado');
                // console.log(this.evaluationAnswers);
                this.evaluationAnswers[7].items.forEach((item: any) => {
                  this.techniciansDocumntalChecklistAnswers[item.question_id] =
                    {
                      question_id: item.question_id,
                      answer: true,
                    };
                });
                console.log(this.evaluationAnswers);
                this.evaluationAnswers[15].items.forEach((item: any) => {
                  this.productsDocumntalChecklistAnswers[item.question_id] = {
                    question_id: item.question_id,
                    answer: true,
                  };
                });
              },
              (error: any) => {
                console.error('Error al enviar datos:', error);
              }
            );
          })
          .catch((error) => {
            console.error('Error al realizar la solicitud de calendar:', error);
          });
      } else {
        this.httpService
          .get(`staffs/${project_id}/documentalUvChecklist`, true)
          .then((observableResult) => {
            observableResult.subscribe(
              (response: any) => {
                const checklistItemsBySection: any = {};
                this.totalPaginas = response.checklist_sections.length;
                for (const sectionId in response.items) {
                  if (response.items.hasOwnProperty(sectionId)) {
                    const sectionItems = response.items[sectionId];
                    if (Array.isArray(sectionItems)) {
                      checklistItemsBySection[sectionId] = sectionItems;
                    } else {
                      const indexName = Object.keys(sectionItems)[0];
                      checklistItemsBySection[sectionId] = {
                        subsection: true,
                        name: indexName,
                        items: sectionItems[indexName],
                      };
                    }
                  }
                }
                this.sectionListItems = response.checklist_sections.map(
                  (section: any) => {
                    let extraAnswerDescription = '';
                    let sections = [19, 16, 8, 9];
                    if (sections.includes(parseInt(section.id))) {
                      switch (parseInt(section.id)) {
                        case 19:
                          extraAnswerDescription =
                            'TECNICO NO SE ENCUENTRA EN PISO/NA';
                          break;
                        case 16:
                          extraAnswerDescription =
                            'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                          break;
                        case 8:
                          extraAnswerDescription =
                            'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                          break;
                        case 9:
                          extraAnswerDescription =
                            'CUMPLE EN REVISIÓN POR EL CLIENTE';
                          break;
                      }
                    }
                    return {
                      extraAnswer: sections.includes(parseInt(section.id)),
                      extraAnswerDescription,
                      ...section,
                      items: checklistItemsBySection[section.id] || [],
                    };
                  }
                );
                this.sectionList = response.checklist_sections;
                this.productsDocumntalChecklist = response.products.products;
                this.techniciansDocumntalChecklist =
                  response.products.technicians_name;
                this.selectedTexts = Array(
                  response.products.products.length
                ).fill('Seleccionado');
                this.selectedTextsTechnicians = Array(
                  response.products.technicians_name.length
                ).fill('Seleccionado');
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
    });
  }

  formatTasksObject(tasks: any[], services: any[], cinturones: any[]) {
    this.tasksCinturones = cinturones;
    this.formattedTasks = [];
    const edc: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const edcm: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const lln: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const rnp: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };

    // Agrupar tareas por tipo de control y ubicación
    tasks.forEach((task) => {
      const controlType = task.group_control;
      let cinturon = task.cinturon;

      switch (controlType) {
        case '1':
          if (!edc.area_service[cinturon]) {
            edc.area_service[cinturon] = [];
          }
          edc.area_service[cinturon].push(task);
          edc.total_tasks++;
          break;
        case '2':
          if (!edcm.area_service[cinturon]) {
            edcm.area_service[cinturon] = [];
          }
          edcm.area_service[cinturon].push(task);
          edcm.total_tasks++;
          break;
        case '3':
          if (!lln.area_service[cinturon]) {
            lln.area_service[cinturon] = [];
          }
          lln.area_service[cinturon].push(task);
          lln.total_tasks++;
          break;
        case '4':
          if (cinturon != 'areas') {
            cinturon = 'areas';
          }
          if (!rnp.area_service[cinturon]) {
            rnp.area_service[cinturon] = [];
          }
          rnp.area_service[cinturon].push(task);
          rnp.total_tasks++;
          break;
      }
    });

    // Agrupar servicios por tipo de control
    services.forEach((service) => {
      switch (service.name) {
        case 'EDC':
          edc.service = service;
          edc.cinturones.push(service.cinturon.trim());
          break;
        case 'EDCM':
          edcm.service = service;
          edcm.cinturones.push(service.cinturon.trim());
          break;
        case 'LLN':
          lln.service = service;
          lln.cinturones.push(service.cinturon.trim());
          break;
        case 'RNP':
          rnp.service = service;
          rnp.cinturones.push(service.cinturon.trim());
          break;
      }
    });

    this.formattedTasks.push({
      edc,
      edcm,
      lln,
      rnp,
    });
  }

  async confirm() {
    this.checklist.forEach((item) => {
      if (item.id != 258 && item.id != 99 && item.id != 105) {
        this.checklistTaskService.setSelectedItem(
          item.id,
          'yes',
          '',
          '',
          false,
          ''
        );
      }
    });
    const items = this.checklistTaskService.getAllItems();
    this.projectService.setGeneralChecklist(
      this.id_task,
      'task',
      this.checklist_id,
      items,
      this.taskStatus
    );
    console.log(this.taskStatus)
    this.id_task = '';
    this.checklist_id = '';
    this.checklist_answers = [];
    this.openTaskModal = false;
    this.taskStatus = '';
    this.toastService.presentToast('Tarea completada.');
    this.checklistTaskService.clearItems();
    await this.storageProjectService.saveProgress(
      this.projectService.getAllItems(),
      'checklistProgress'
    );
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  options: [{ value: string; label: string }] = [
    { value: 'cinturon1', label: 'Cinturon A' },
  ];
  // Método para abrir el modal
  async openModalTask(id_task: any, number_task: any, control: any) {
    this.id_task = id_task;
    this.task_control = control;
    this.task_number = number_task;
    this.httpService
      .get(`staffs/${id_task}/checklist`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.checklist = response.items;
            this.checklist_id = response.checklist[0].id;
            this.taskStatus =
              response.status_task != null ? response.status_task.content : 0;

            this.checklist.forEach((item) => {
              this.checklistTaskService.setSelectedItem(
                item.id,
                'yes',
                '',
                '',
                false,
                ''
              );
            });
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
    this.openTaskModal = true;
    // return this.modal.present(); // Mostrar el modal
  }
  showModalTaskAnswerNo(
    open: boolean,
    item_id: any,
    index: any,
    isRnp: any = false
  ) {
    this.currentTaskChecklistItem = item_id;
    if (isRnp) {
      this.showTicketsModal(true);
    } else {
      this.modalTaskAnswerNo = open;
    }
  }
  setNoTaskAnswer(open: boolean) {
    setTimeout(async () => {
      if (this.evidenceImageTask) {
        const blob = this.dataUrlToBlob(this.evidenceImageTask);
        const url = await this.uploadImage(blob, 'taskEvidence');
        this.checklistTaskService.setSelectedItem(
          this.currentTaskChecklistItem,
          'no',
          this.taskReason,
          url,
          this.taskChecked,
          this.correctiveTaskAction
        );
      } else {
        this.checklistTaskService.setSelectedItem(
          this.currentTaskChecklistItem,
          'no',
          this.taskReason,
          '',
          this.taskChecked,
          this.correctiveTaskAction
        );
      }
      this.taskReason = '';
      this.evidenceImageTask = '';
      this.taskChecked = false;
    }, 5);
    this.modalTaskAnswerNo = open;
  }
  handleClientSelect(event: any) {
    const selectClient = event.detail.value;
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

  handleSubsidiarySelect(event: any) {
    const subsidiarySelect = event.detail.value;
    this.httpService
      .get(`staffs/${subsidiarySelect}/projects`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.planes = response;
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
  ionViewDidEnter() {
    this.get_detail_plan();
    this.getDocumentalChecklist();
    this.activatedRoute.queryParams.subscribe(async (params) => {
      const storage: any = await this.storageProjectService.loadProgress();
      if (params['is_active'] || Object.keys(storage).length > 0) {
        this.projectService.clearItems();
        this.evidenceType = storage.evidenceType;
        this.projectService.setCurrentProgress(storage.savedProgress);
        this.checklistService.setCurrentProgress(storage.documentalProgress);
      }
    });
  }
  handlePlanSelect(event: any) {
    if (!this.planSelect) {
      this.planSelect = event.detail.value;
    }
    this.httpService
      .get(`staffs/${this.planSelect}/tasks`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.tasksData = response;
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

  async dailyWorkLink() {
    // Agrega la lógica para redireccionar a la página Dailywork
    // Ejemplo: this.router.navigate(['/dailywork']);
  }

  toggleInput(id: any, item: any) {
    this.checklist_answers.push({
      id: id,
      answer: item.selectedOption,
      description: item.selectedOption === 'no' ? item.inputValue : null,
    });
    this.showInput = item.selectedOption === 'no';
  }

  /* Método para manejar el cambio en el valor del radio button */
  // handleRadioChange(value: string) {
  //   this.radioValue = value;
  //   if (value === 'no') {
  //     this.classDblock = 'd-flex';
  //   } else {
  //     this.classDblock = '';
  //   }
  // }

  async setAnswerDocumental(
    idItemChecklist: string,
    answer: any,
    description = ''
  ) {
    setTimeout(() => {
      this.checklistService.setSelectedItem(
        idItemChecklist,
        answer,
        description
      );
    }, 0);
    await this.storageProjectService.saveProgress(
      this.checklistService.getAllItems(),
      'documentalProgress'
    );
  }

  segmentChanged() {
    this.showInput = this.selectedOption === 'no'; // Mostrar el input si se selecciona "No cumple"
    /* this.classDblock = this.showInput ? 'd-block' : 'd-none'; */
  }

  // Upload Files
  handleChange(event: any): void {
    const fileList: FileList = event.fileList.map(
      (file: any) => file.originFileObj
    );

    const photos = Array.from(fileList).map((file: File) => ({
      name: file.name,
      file: file,
    }));

    const payload = {
      photos: photos,
    };
    this.httpService
      .post(`staffs/${this.id_task}/uploadPhoto`, JSON.stringify(payload), true)
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {},
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

  nzEvent(event: NzFormatEmitEvent): void {}

  getSelectedItem(itemId: string): {} | undefined {
    const answer = this.checklistService.getSelectedItem(itemId);
    return answer ? answer.answer : undefined;
  }

  getSelectedTaskItem(itemId: string): {} | undefined {
    const answer = this.checklistTaskService.getSelectedItem(itemId);
    return answer ? answer.answer : undefined;
  }

  // async getSelectedProjectItem(itemId: string) {
  //   const project = this.projectService.getSelectedItem(itemId);
  //   const storage = await this.storageProjectService.getSelectedItem(itemId);
  //   return project || storage ? project : false;
  // }
  // getSelectedProjectItem(itemId: string): Observable<any | false> {
  //   return from(this.getSelectedProjectItemAsync(itemId));
  // }

  // private async getSelectedProjectItemAsync(
  //   itemId: string
  // ): Promise<any | false> {
  //   const project = this.projectService.getSelectedItem(itemId);
  //   const storage = await this.storageProjectService.getSelectedItem(itemId);
  //   return project || storage ? project : false;
  // }

  getSelectedProjectItem(itemId: string) {
    const project = this.projectService.getSelectedItem(itemId);
    return project ? project : false;
  }

  showTicketsModal(open: boolean) {
    this.isOpenTicketsModal = open;
    const data = {
      project_id: this.project_id,
      task_id: this.id_task,
      user_id: this.userdata_.staffid,
    };
    this.httpService
      .post(
        `staffs/${this.userdata_.staffid}/get_ticket_data`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {
            this.ticketClientSelectId = res[0].userid;
            this.ticketClientSelect = res[0].client_name;

            this.ticketSubsidiarySelectid = res[0].id_subsidiary;
            this.ticketSubsidiarySelect = res[0].company;

            this.ticketAreaSelect = res[0].name;
            this.ticketAreaSelectid = res[0].id;
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

  async createTicket() {
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

    if (this.responsibleSelect == '') {
      this.toastService.presentToast('Debes seleccionar a un responsable');
      validate = false;
      return;
    }

    if (this.descriptionTicket == '') {
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

    if (this.responsibleSelect == '1') {
      if (this.endDate == '') {
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
      }
    }

    if (validate) {
      let url = '';
      if (this.evidenceImageTicket) {
        const blob = this.dataUrlToBlob(this.evidenceImageTicket);
        url = await this.uploadImage(blob, 'ticketEvidence');
      }
      const data = {
        client_id: this.ticketClientSelectId,
        subsidiary_id: this.ticketSubsidiarySelectid,
        area_select: this.ticketAreaSelectid,
        start_date: this.startDate,
        end_date: this.endDate,
        priority: this.prioritySelect,
        responsible: this.responsibleSelect,
        userid: 1,
        department: 16,
        contactid: 1,
        subject: this.titleTicket,
        type: 'area',
        description: this.descriptionTicket,
        url_image: url,
        create_for: 'project',
        project_id: this.project_id,
        staff_id: this.userdata_.staffid,
        correctiveAction: this.correctiveAction,
      };
      this.httpService
        .post(`tickets`, JSON.stringify(data), true)
        .then((observableResult) => {
          observableResult.subscribe(
            (res: any) => {
              if (res.status) {
                // this.toastService.presentToast('Incidencia creada');
                this.ticketClientSelectId = '';
                this.ticketSubsidiarySelectid = '';
                this.ticketClientSelect = '';
                this.ticketAreaSelectid = '';
                this.ticketSubsidiarySelect = '';
                this.startDate = '';
                this.ticketAreaSelect = '';
                this.endDate = '';
                this.prioritySelect = '';
                this.responsibleSelect = '';
                this.isOpenTicketsModal = false;
                this.openTaskModal = false;
                this.titleTicket = '';
                this.descriptionTicket = '';
                this.evidenceImageTicket = '';
                this.correctiveAction = '';
                this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
                this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');

                this.checklistTaskService.setSelectedItem(
                  this.currentTaskChecklistItem,
                  'no',
                  this.taskReason,
                  url,
                  this.taskChecked,
                  ''
                );

                const items = this.checklistTaskService.getAllItems();
                this.projectService.setGeneralChecklist(
                  this.id_task,
                  'task',
                  this.checklist_id,
                  items
                );
                this.toastService.presentToast('Incidencia creada');
                this.isOpenTicketsModal = false;
                this.isTicketSpinning = false;
              } else {
                this.toastService.presentToast('Error al crear incidencia');
              }
            },
            (error: any) => {
              console.log(error);
              // this.toastService.presentToast(
              //   'Error en la red, comuníquese con un administrador.'
              // );
            }
          );
        })
        .catch((error) => {
          // Manejar errores relacionados con la promesa
          console.error('Error al realizar la solicitud de login:', error);
        });
    }
  }

  onStartDateChange(event: any) {
    this.startDate = new Date(event.detail.value).toLocaleDateString();
  }
  onEndDateChange(event: any) {
    this.endDate = new Date(event.detail.value).toLocaleDateString();
  }

  async takePicture() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(
            (result) => {
              if (result.hasPermission) {
                // Acceder a la cámara
              } else {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.CAMERA
                );
              }
            },
            (err) =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.CAMERA
              )
          );
      }
      const evidenceImageTask = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      this.evidenceImageTask = evidenceImageTask.dataUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async takePictureDocumental() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(
            (result) => {
              if (result.hasPermission) {
                // Acceder a la cámara
              } else {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.CAMERA
                );
              }
            },
            (err) =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.CAMERA
              )
          );
      }
      const evidenceImageDocumental = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      this.evidenceImageDocumental = evidenceImageDocumental.dataUrl;
    } catch (error) {
      console.log(error);
    }
  }

  async takePictureTicket() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(
            (result) => {
              if (result.hasPermission) {
                // Acceder a la cámara
              } else {
                this.androidPermissions.requestPermission(
                  this.androidPermissions.PERMISSION.CAMERA
                );
              }
            },
            (err) =>
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
  getSelectedOptionsTechnicians(event: any, index: any) {
    const questions_ids = event.detail.value;
    Object.keys(this.techniciansDocumntalChecklistAnswers).forEach(
      (element: any) => {
        if (questions_ids.includes(element)) {
          if (this.techniciansDocumntalChecklistAnswers[element].answer) {
            this.checklistService.setSelectedItem(element, 'yes', '');
            this.techniciansDocumntalChecklistAnswers[element].answer = true;
          }
        } else {
          this.checklistService.setSelectedItem(element, 'no', '');
          this.techniciansDocumntalChecklistAnswers[element].answer = false;
        }
      }
    );
  }
  getSelectedOptionsProducts(event: any, index: any) {
    const questions_ids = event.detail.value;
    Object.keys(this.productsDocumntalChecklistAnswers).forEach(
      (element: any) => {
        if (questions_ids.includes(element)) {
          if (this.productsDocumntalChecklistAnswers[element].answer) {
            this.checklistService.setSelectedItem(element, 'yes', '');
            this.productsDocumntalChecklistAnswers[element].answer = true;
          }
        } else {
          this.checklistService.setSelectedItem(element, 'no', '');
          this.productsDocumntalChecklistAnswers[element].answer = false;
        }
      }
    );
  }

  getSelectedUvChecklist(event: any) {
    this.checklist_id = event.detail.value;
    if (parseInt(this.checklist_id) == 36) {
      this.currentUvChecklist = this.pestUvChecklist;
    } else {
      this.currentUvChecklist = this.generalUvChecklist;
    }
    const data = {
      checklistid: this.checklist_id,
      taskid: this.uv_task,
    };
    this.httpService
      .post(
        `staffs/${this.project_id}/assign_uv_checklist`,
        JSON.stringify(data),
        true
      )
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {
            this.uv_checklist_name = res[0].description;
            this.uv_question_id = res[0].id;
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

  handleCorrectiveAction(event: any) {
    this.correctiveTaskAction = event.detail.value;
  }

  openSelectUvMeasure(isOpen: any, indexTask: any) {
    this.uv_task = indexTask;
    this.isSelectUvMeasure = isOpen;
  }

  answerTaskUvChecklist(value: string, question_id: string) {
    this.checklistUvService.setSelectedItem(
      question_id,
      value,
      this.taskStatus
    );
  }

  setUvChecklist() {
    const items = this.checklistUvService.getAllItems();
    this.projectService.setGeneralChecklist(
      this.uv_task,
      'uv_task_item',
      this.checklist_id,
      items,
      this.uvDescription
    );
    this.uv_task = '';
    this.checklist_id = '';
    this.checklist_answers = [];
    this.currentUvChecklist = [];
    this.uv_checklist_name = '';
    this.isSelectUvMeasure = false;
    this.toastService.presentToast('Tarea completada.');
    this.checklistUvService.clearItems();
    this.uvDescription = '';
  }

  async handleChangeEvidence(event: any) {
    this.evidenceType = event.detail.value;
    await this.storageProjectService.saveProgress(
      this.evidenceType,
      'evidenceType'
    );
  }

  handleTaskStatus(event: any) {
    console.log(event.detail.value)
    this.taskStatus = event.detail.value;
    if (this.taskStatus == '10' || this.taskStatus == '13') {
      this.checklist.forEach((item) => {
        if (item.id == 258 || item.id == 99 || item.id == 105) {
          this.showModalTaskAnswerNo(true, item.id, 1, false);
        }
        this.checklistTaskService.setSelectedItem(
          item.id,
          'no',
          this.taskStatus == '10' ? ' Equipo Extraviado' : 'Equipo Oculto',
          '',
          false,
          ''
        );
      });
    }
  }

  onMinuteDateChange(event: any) {
    this.minuteDate = new Date(event.detail.value).toLocaleDateString();
  }

  modalAddMinuteItem(status: boolean) {
    this.showModalAddMinuteItem = status;
  }

  addItemMinuteTable() {
    this.minuteTable.push({
      taskAgreement: this.taskAgreement,
      taskResponsable: this.taskResponsable,
      taskMinuteStatus: this.taskMinuteStatus,
      minuteDate: this.minuteDate,
    });
    this.taskAgreement = '';
    this.taskResponsable = '';
    this.taskMinuteStatus = '';
    this.minuteDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    this.modalAddMinuteItem(false);
  }

  saveMinuteTask(task_id: any) {
    const data = {
      task_id: task_id,
      minute: this.minuteTable,
    };
    this.httpService
      .post(`staffs/${task_id}/saveTaskMinutes`, JSON.stringify(data), true)
      .then((observableResult) => {
        observableResult.subscribe(
          (res: any) => {
            this.openSignature(false);
            this.toastService.presentToast('Minuta guardada');
            this.emailSignatureValue = '';
            this.nameSignatureValue = '';
            this.lastNameSignatureValue = '';
            this.minuteTable = [];
            this.isSpinning = false;
            this.cdr.detectChanges();

            // Navegar a la nueva página después de un pequeño retraso
            setTimeout(() => {
              this.router.navigate(['tabs/tab1']);
            }, 100); //
            this.router.navigate(['tabs/tab1']);
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

  setTaskResponsiveValue(event: any) {
    this.taskChecked = !this.taskChecked;
  }
}
