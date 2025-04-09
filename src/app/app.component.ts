import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { distinctUntilChanged, Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {
  public temperatureFormGroup = new FormGroup({
    fahrenheitInput: new FormControl<number>(32, { nonNullable: true, validators: [Validators.required], updateOn: "blur" }),
    celsiusInput: new FormControl<number>(0.0, { nonNullable: true, validators: [Validators.required], updateOn: "blur" }),
    kelvinInput: new FormControl<number>(273.15, { nonNullable: true, validators: [Validators.required], updateOn: "blur" }),
});
  private subscription: Subscription = new Subscription();

  testNumValue(num: number) {
    return Number(num);
  }

  toOneDecimal(num: number) {
    return Math.round(num * 10) / 10
  }

  celsiusToFahrenheit(num: number) {
    return Math.round(num * (9 / 5) + 32)
  }

  celsiusToKelvin(num: number) {
    return Math.round((num + 273.15) * 100) / 100;
  }

  ngOnInit() {
    this.subscription.add(this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(
      (fahrenheitValue) => {
        const fahrenheitCalculatedValue = this.testNumValue(fahrenheitValue);
        const fahrenheitIsRounded = Math.round(fahrenheitCalculatedValue);
        const celsiusCalculatedValue = (fahrenheitCalculatedValue - 32) * (5 / 9);
        const celsiusValueRounded = this.toOneDecimal(celsiusCalculatedValue);
        const celsiusToKelvinValue = this.celsiusToKelvin(celsiusValueRounded);
        this.temperatureFormGroup.patchValue({
          fahrenheitInput: fahrenheitIsRounded, celsiusInput: celsiusValueRounded, kelvinInput: celsiusToKelvinValue
        });
      }
    ));

    this.subscription.add(this.temperatureFormGroup.controls.celsiusInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(
      (celsiusValue) => {
        const celsiusCalculatedValue = this.testNumValue(celsiusValue);
        const celsiusInputRounded = this.toOneDecimal(celsiusCalculatedValue);
        const celsiusToKelvin = this.celsiusToKelvin(celsiusInputRounded);
        const fahrenheitCalculatedValue = this.celsiusToFahrenheit(celsiusInputRounded);
        this.temperatureFormGroup.patchValue({
          fahrenheitInput: fahrenheitCalculatedValue, celsiusInput: celsiusInputRounded, kelvinInput: celsiusToKelvin })
      }));

    this.subscription.add(this.temperatureFormGroup.controls.kelvinInput.valueChanges.pipe(
      distinctUntilChanged(),
      ).subscribe(
      (kelvinValue) => {
        const kelvinInput = this.testNumValue(kelvinValue);
        const kelvinValueRounded = Math.round(kelvinInput * 100) / 100;
        const kelvinToCelsius = Math.round((kelvinValueRounded - 273.15) * 10) / 10;
        const celsiusToFahrenheit = this.celsiusToFahrenheit(kelvinToCelsius);
        this.temperatureFormGroup.patchValue({
          fahrenheitInput: celsiusToFahrenheit, celsiusInput: kelvinToCelsius, kelvinInput: kelvinValueRounded
        })
      }
    ))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
