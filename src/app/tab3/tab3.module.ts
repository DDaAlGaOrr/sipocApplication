import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { HeaderModule } from '../header/header.module';
import { ModalService } from './../services/modal.service';

import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SignaturePadComponent } from './../signature-pad/signature-pad.component';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@NgModule({
  declarations: [Tab3Page, SignaturePadComponent],
  imports: [
    ReactiveFormsModule,
    HeaderModule,
    MbscModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    NzPaginationModule,
    NzTypographyModule,
    NzPopconfirmModule,
    NzSkeletonModule,
    NzProgressModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzMessageModule,
    NzCommentModule,
    NzDividerModule,
    NzSelectModule,
    NzUploadModule,
    NzTableModule,
    NzRadioModule,
    NzModalModule,
    NzSpaceModule,
    NzFormModule,
    NzTreeModule,
    NzIconModule,
    NzTagModule,
    NzSpinModule,
    IonicSelectableComponent,
  ],
  providers: [ModalService, AndroidPermissions],
})
export class Tab3PageModule {}
