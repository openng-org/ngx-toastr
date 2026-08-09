import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, HomeComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
