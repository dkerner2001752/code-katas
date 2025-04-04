import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class AppComponent {
  public temperatureFormGroup = new FormGroup({
    fahrenheitInput: new FormControl<number>(32, { nonNullable: true }),
    celsiusInput: new FormControl<number>(0.0, { nonNullable: true }),
});

  fahrenheitToCelsius() {
    const celsiusRounded = Math.round((this.temperatureFormGroup.controls.fahrenheitInput.value - 32) * (5/9) * 10) / 10;
    this.temperatureFormGroup.controls.celsiusInput.patchValue(celsiusRounded);
  }

  celsiusToFahrenheit() {
    const fahrenheitRounded = Math.round(this.temperatureFormGroup.controls.celsiusInput.value * (9/5) + 32);
    this.temperatureFormGroup.controls.fahrenheitInput.patchValue(fahrenheitRounded);
  }
}
