import { MbscModule } from '@mobiscroll/angular';
import { Tab2Page } from './tab2.page';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import localeEs from '@angular/common/locales/es'; // Importa el módulo de idioma español

/* AntDesign Modules Import */
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { HeaderModule } from '../header/header.module';

// Registra el idioma español
registerLocaleData(localeEs);

@NgModule({
  imports: [
    MbscModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    NzTypographyModule,
    HeaderModule,
    NzDividerModule,
    NzTableModule,
    NzIconModule,
  ],
  declarations: [Tab2Page],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } // Establece el idioma como 'es' para español
  ]
})
export class Tab2PageModule {}
