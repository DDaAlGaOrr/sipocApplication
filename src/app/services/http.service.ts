import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from './../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  private async handleOfflineRequest(
    method: string,
    serviceName: string,
    data: any = null
  ) {
    const offlineRequests =
      (await this.storageService.get('offlineRequests')) || [];
    offlineRequests.push({ method, serviceName, data });
    await this.storageService.store('offlineRequests', offlineRequests);
    return this.storageService.get('offlineRequests') || false;
  }

  private async handleOnlineRequests() {
    const offlineRequests =
      (await this.storageService.get('offlineRequests')) || [];

    if (offlineRequests.length > 0) {
      for (const request of offlineRequests) {
        switch (request.method) {
          case 'post':
            await this.post(request.serviceName, request.data);
            break;
          case 'get':
            await this.get(request.serviceName);
            break;
          case 'put':
            await this.put(request.serviceName, request.data);
            break;
          case 'delete':
            await this.delete(request.serviceName);
            break;
        }
      }

      await this.storageService.removeStorageItem('offlineRequests');
    }
  }

  async post(
    serviceName: string,
    data: any,
    sipoc: any = false
  ): Promise<Observable<any>> {
    const headers = new HttpHeaders()
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/json')
      .set('authtoken', environment.token);
    const options = { headers, withCredentials: false };
    const url = (sipoc ? environment.sipoc : environment.apiUrl) + serviceName;

    console.log(url);
    console.log(data);

    // await this.handleOnlineRequests();
    return this.http.post(url, data, options).pipe(
      catchError((error: any) => {
        // Manejar errores aquí si es necesario
        console.error('Error en la solicitud POST:', error);
        throw error;
      })
    );
  }

  async get(serviceName: string, sipoc: any = false) {
    // const headers = new HttpHeaders();
    const headers = new HttpHeaders().set('authtoken', environment.token);
    const options = { headers, withCredentials: false };
    const url = (sipoc ? environment.sipoc : environment.apiUrl) + serviceName;

    try {
      // await this.handleOnlineRequests();
      return this.http.get(url, { ...options });
    } catch (error) {
      return this.handleOfflineRequest('get', serviceName);
    }
  }

  async put(serviceName: string, data: any, sipoc: any = false) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const options = { headers, withCredentials: false };
    const url = (sipoc ? environment.sipoc : environment.apiUrl) + serviceName;

    try {
      await this.handleOnlineRequests();
      return this.http.put(url, data, options);
    } catch (error) {
      return this.handleOfflineRequest('put', serviceName, data);
    }
  }

  async delete(serviceName: string, sipoc: any = false) {
    const headers = new HttpHeaders();
    const options = { headers, withCredentials: false };
    const url = (sipoc ? environment.sipoc : environment.apiUrl) + serviceName;

    try {
      await this.handleOnlineRequests();
      return this.http.delete(url, options);
    } catch (error) {
      return this.handleOfflineRequest('delete', serviceName);
    }
  }
}
