import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { IonicSelectableComponent } from 'ionic-selectable';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { TabsPage } from './tabs.page';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    MbscModule,
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    NzDatePickerModule,
    NzSelectModule,
    HeaderModule,
    NzUploadModule,
    NzModalModule,
    NzSpaceModule,
    NzTagModule,
    DatePipe,
    IonicSelectableComponent,
    NzSpinModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
