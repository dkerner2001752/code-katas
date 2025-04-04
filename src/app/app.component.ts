import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ]
})
export class AppComponent {
  public temperatureFormGroup = new FormGroup({
    fahrenheitInput: new FormControl<number>(32, { nonNullable: true, validators: [Validators.required] }),
    celsiusInput: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
});

  fahrenheitToCelsius() {
    const fahrenheit = Number(this.temperatureFormGroup.controls.fahrenheitInput.value);
    const celsiusCalculated = (fahrenheit - 32) * (5/9);
    const celsiusRounded = Math.round(celsiusCalculated * 10) / 10;
    this.temperatureFormGroup.controls.celsiusInput.patchValue(celsiusRounded);
    this.temperatureFormGroup.controls.fahrenheitInput.patchValue(fahrenheit);
  }

  celsiusToFahrenheit() {
    const celsius = Number(this.temperatureFormGroup.controls.celsiusInput.value);
    const fahrenheitRounded = Math.round(celsius * (9/5) + 32);
    this.temperatureFormGroup.controls.fahrenheitInput.patchValue(fahrenheitRounded);
    this.temperatureFormGroup.controls.celsiusInput.patchValue(celsius);
  }
}
