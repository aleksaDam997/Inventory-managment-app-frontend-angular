import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(ReactiveFormsModule, BsDatepickerModule.forRoot(), ModalModule.forRoot())
    //  importProvidersFrom(FormsModule)
  ]
};
