import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideToastr } from '@openng/ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideToastr(),
    provideHttpClient(),
    provideCheckNoChangesConfig({
      exhaustive: true,
      interval: 1000,
    }),
  ],
}).catch(err => console.error(err));
