import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from '../services/http.service';

import { AuthService } from './../services/auth.service';

export interface TreeNodeInterface {
  key: string;
  checklist: string;
  plan_trabajo?: string;
  cliente?: string;
  total_cumple?: number;
  total_nocumple?: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  // Header Aquí
  fechaActual: Date = new Date(); // Esta es la variable que contiene la fecha actual
  userdata = this.authService.getUserData_();

  constructor(
    private authService: AuthService,
    private router: Router,
    private msg: NzMessageService,
    private modalController: ModalController,
    private httpService: HttpService
  ) {}

  // Datos de tabla aquí
  // listOfData = [
  //   {
  //     key: '1',
  //     checklist: 'Documental',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 60,
  //     total_nocumple: 8,
  //   },
  //   {
  //     key: '2',
  //     checklist: 'EDC - trampa 001',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 21,
  //     total_nocumple: 3,
  //   },
  //   {
  //     key: '3',
  //     checklist: 'EDC - trampa 002',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 24,
  //     total_nocumple: 0,
  //   },
  //   {
  //     key: '4',
  //     checklist: 'EDCM - trampa 001',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 19,
  //     total_nocumple: 5,
  //   },
  //   {
  //     key: '5',
  //     checklist: 'LLN - trampa 001',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 19,
  //     total_nocumple: 5,
  //   },
  //   {
  //     key: '5',
  //     checklist: 'RNP - Area almacen',
  //     plan_trabajo: 'plan-2024000001',
  //     cliente: 'Pilgrims pride planta los cues',
  //     total_cumple: 19,
  //     total_nocumple: 5,
  //   }
  // ];
  listOfData: any = [];

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [key: string]: boolean },
    array: TreeNodeInterface[]
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.authService
      .getUserData()
      .then((userData: any) => {
        this.userdata = userData;
        this.httpService
          .get(`staffs/${this.userdata.staffid}/get_projects_report`, true)
          .then((observableResult) => {
            observableResult.subscribe(
              (response: any) => {
                console.log(response);
                this.listOfData = response;
              },
              (error: any) => {
                console.error('Error al enviar datos:', error);
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
  }
}
