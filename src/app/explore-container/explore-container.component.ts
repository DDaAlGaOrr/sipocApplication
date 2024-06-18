import { Component, OnInit } from '@angular/core';
import {
  setOptions,
  MbscEventcalendarView,
  MbscCalendarEvent,
  localeEs,
} from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { AuthService } from './../services/auth.service';

setOptions({
  locale: localeEs,
  theme: 'material',
  themeVariant: 'light',
  clickToCreate: false,
  dragToCreate: false,
  dragToMove: false,
  dragToResize: false,
  eventDelete: false,
});

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  // Redirection to Incident Detail (tab4)
  linkIncidentDetail(event: any) {
    this.router.navigate(['/tabs', 'tab4'], {
      queryParams: { tickect: event.event.id },
    });
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {}
  userdata = this.authService.getUserData_();

  myEvents: MbscCalendarEvent[] = [];
  view = 'day';
  calView: MbscEventcalendarView = {
    // calendar: { type: 'month' },
    agenda: { type: 'day' },
  };

  ngOnInit(): void {
    this.httpService
      .get(`staffs/${this.userdata.staffid}/tickets`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            console.log(response);
            this.myEvents = response.map((apiEvent: any) => {
              const localDate = new Date(apiEvent.start_date);

              // Agregar un día
              localDate.setDate(localDate.getDate() + 1);
              return {
                start: localDate,
                title: apiEvent.subject,
                color: '#00ca10',
                id: apiEvent.ticketid,
                allDay: true,
                accepted: true,
                // project_id: apiEvent.id,
                // description: `Trampa: ${apiEvent.name}`,
              };
            });
            console.log(this.myEvents);
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
      this.calView = {
        agenda: { type: 'day' },
      };
    });
  }
}
