import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from './shared/components/popup/popup.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('solo-suite');
}
