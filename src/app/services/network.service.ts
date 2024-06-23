import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private isOnline: boolean = true;

  constructor() {
    this.initializeNetworkStatus();
  }

  private async initializeNetworkStatus() {
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    Network.addListener('networkStatusChange', (status) => {
      this.isOnline = status.connected;
      console.log('Network status changed', status);
    });
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }
}
