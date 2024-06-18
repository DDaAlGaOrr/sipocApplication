import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { AuthConstants } from '../config/auth-constants';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userData: any;
  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  private async init() {
    await this.storage.create();
  }

  login(postData: any): Promise<Observable<any>> {
    return this.httpService.post('login/auth', postData, true);
  }

  signup(postData: any): Promise<Observable<any>> {
    return this.httpService.post('signup', postData);
  }

  setUserData(userData: any) {
    this._userData = userData;
    this.storage.set('userdata', userData);
  }

  getUserData(): any {
    return this.storage.get('userdata');
  }

  getUserData_(): any {
    return this._userData;
  }

  isAuthenticated(): boolean {
    return !!this._userData;
  }

  logout() {
    this._userData = null;
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
