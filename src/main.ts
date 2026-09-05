import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideToastr } from '@openng/ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideToastr(),
  ],
}).catch(err => console.error(err));
