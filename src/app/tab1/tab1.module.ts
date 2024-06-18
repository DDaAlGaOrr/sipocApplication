import { MbscModule } from '@mobiscroll/angular';
import { Tab1Page } from './tab1.page';
import { IonicModule } from '@ionic/angular';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import localeEs from '@angular/common/locales/es'; // Importa el módulo de idioma español

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzCardModule } from 'ng-zorro-antd/card';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { HeaderModule } from '../header/header.module';

// Registra el idioma español
registerLocaleData(localeEs);

@NgModule({
  imports: [
    NzDescriptionsModule,
    NzPaginationModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzDividerModule,
    NzSwitchModule,
    NzUploadModule,
    NzSelectModule,
    NzModalModule,
    NzTableModule,
    NzSpaceModule,
    NzTreeModule,
    HeaderModule,
    CommonModule,
    NzCardModule,
    IonicModule,
    FormsModule,
    MbscModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  bootstrap: [Tab1Page],
  declarations: [Tab1Page],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } // Establece el idioma como 'es' para español
  ]
})
export class Tab1PageModule {}
