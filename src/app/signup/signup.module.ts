import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupPage } from './signup.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { IonicStorageModule } from '@ionic/storage-angular';

import { SignupPageRoutingModule } from './signup-routing.module';

@NgModule({
  imports: [
    MbscModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SignupPageRoutingModule,
    IonicStorageModule,
  ],
  declarations: [SignupPage],
})
export class SignupPageModule {}
