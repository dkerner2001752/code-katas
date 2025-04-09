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
});
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(
      (fahrenheitValue) => {
        const fahrenheitCalculatedValue = Number(fahrenheitValue);
        const celsiusCalculatedValue = (fahrenheitCalculatedValue - 32) * (5 / 9);
        const celsiusValueRounded = Math.round(celsiusCalculatedValue * 10) / 10;
        this.temperatureFormGroup.controls.celsiusInput.patchValue(celsiusValueRounded);
      }
    ));

    this.subscription.add(this.temperatureFormGroup.controls.celsiusInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(
      (celsiusValue) => {
        const celsiusCalculatedValue = Number(celsiusValue);
        const fahrenheitCalculatedValue = Math.round(celsiusCalculatedValue * (9 / 5) + 32);
        const celsiusInputRounded = Math.round(celsiusCalculatedValue * 10) / 10;
        this.temperatureFormGroup.controls.fahrenheitInput.patchValue(fahrenheitCalculatedValue);
        this.temperatureFormGroup.controls.celsiusInput.patchValue(celsiusInputRounded);
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
