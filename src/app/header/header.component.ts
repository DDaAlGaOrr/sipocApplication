import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { TopLevel } from '../interfaces/calendar-events.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  fechaActual: Date = new Date();

  /* obtenerFechaFormateada(): any {
    this.datePipe.transform(this.fechaActual, 'EEEE, d \'de\' MMMM \'del\' y', 'local', 'es-MX');
  } */

  myEvents: TopLevel[] = [];

  userdata = this.authService.getUserData_();

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.httpService
      .get(`tasks/${this.userdata.staffid}/tasks`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            this.myEvents = response.tasks.map((apiEvent: any) => {
              // console.log(apiEvent);
              const localDate = new Date(apiEvent.start_date);

              // Agregar un día
              localDate.setDate(localDate.getDate() + 1);
              return {
                start: localDate,
                end: localDate,
                title: apiEvent.company,
                description: `Trampa: ${apiEvent.name}`,
                id: apiEvent.userid,
                project_id: apiEvent.id,
                // Otras propiedades según tus necesidades
              };
            });

            // console.log('calendar info: ', this.myEvents);
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
}
