import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCardModule } from 'ng-zorro-antd/card';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { Tab4PageRoutingModule } from './tab4-routing.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    HeaderModule,
    MbscModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab4PageRoutingModule,
    NzDescriptionsModule,
    NzCollapseModule,
    NzCommentModule,
    NzButtonModule,
    NzUploadModule,
    NzImageModule,
    NzCardModule,
  ],
  declarations: [Tab4Page],
  providers: [AndroidPermissions],
})
export class Tab4PageModule {}
