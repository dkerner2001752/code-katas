import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: []
})
export class AppComponent {
  title = 'Temperature Calculator';

  public fahrenheit = 32;
  public celsius = 0.0;
}
