import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { distinctUntilChanged, map, Observable, startWith, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  public temperatureFormGroup = new FormGroup({
    fahrenheitInput: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    }),
    celsiusInput: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    }),
    kelvinInput: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    })
});
  public condition$!: Observable<string>;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.condition$ = this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      startWith(this.temperatureFormGroup.controls.fahrenheitInput.value),
      map(fahrenheit => this.updateCondition(fahrenheit))
    );
    this.subscription.add(this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(fahrenheitValue => {
      const toNumber = Number(fahrenheitValue);
      const toCelsius = this.fahrenheitToCelsius(toNumber);
      const toKelvin = this.celsiusToKelvin(toCelsius);
      this.temperatureFormGroup.patchValue({
          fahrenheitInput: toNumber.toString(),
          celsiusInput: toCelsius.toFixed(1),
          kelvinInput: toKelvin.toFixed(2)
        })
     }
    ));

    this.subscription.add(this.temperatureFormGroup.controls.celsiusInput.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe(celsiusValue => {
      const toNumber = Number(celsiusValue);
      const toFahrenheit = this.celsiusToFahrenheit(toNumber);
      const toKelvin = this.celsiusToKelvin(toNumber);
      this.temperatureFormGroup.patchValue({
          fahrenheitInput: toFahrenheit.toString(),
          celsiusInput: toNumber.toFixed(1),
          kelvinInput: toKelvin.toFixed(2)
        });
      }));

    this.subscription.add(this.temperatureFormGroup.controls.kelvinInput.valueChanges.pipe(
      distinctUntilChanged(),
      ).subscribe(kelvinValue => {
        const toNumber = Number(kelvinValue);
        const toCelsius = this.kelvinToCelsius(toNumber);
        const toFahrenheit = this.celsiusToFahrenheit(toCelsius);
        this.temperatureFormGroup.patchValue({
          fahrenheitInput: toFahrenheit.toString(),
          celsiusInput: toCelsius.toFixed(1),
          kelvinInput: toNumber.toFixed(2)
        })
      }
    ));

    this.temperatureFormGroup.controls.fahrenheitInput.setValue('32');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fahrenheitToCelsius(num: number) {
    return Math.round((num - 32) * (5/9) * 10) / 10
  }

  celsiusToFahrenheit(num: number) {
    return Math.round(num * (9/5) + 32)
  }

  celsiusToKelvin(num: number) {
    return (num + 273.15)
  }

  kelvinToCelsius(num: number) {
    return (num - 273.15)
  }

  updateCondition(num: string) {
    const fahrenheit = Number(num);
    switch (true) {
      case fahrenheit > 212:
        return 'Unspeakably Hot';
      case fahrenheit === 212:
        return 'Boiling';
      case fahrenheit >= 108 && fahrenheit <= 211:
        return 'Way too Hot';
      case fahrenheit >= 100 && fahrenheit <= 107:
        return 'Very Hot';
      case fahrenheit >= 90 && fahrenheit <= 99:
        return 'Hot';
      case fahrenheit >= 80 && fahrenheit <= 89:
        return 'Getting Hot';
      case fahrenheit >= 73 && fahrenheit <= 79:
        return 'Warm';
      case fahrenheit >= 67 && fahrenheit <= 72:
        return 'Nice';
      case fahrenheit >= 61 && fahrenheit <= 66:
        return 'Pleasant';
      case fahrenheit >= 51 && fahrenheit <= 60:
        return 'Cool';
      case fahrenheit >= 37 && fahrenheit <= 50:
        return 'Cold';
      case fahrenheit >= 33 && fahrenheit <= 36:
        return 'Freezing';
      case fahrenheit >= 0 && fahrenheit <= 32:
        return 'Frozen';
      case fahrenheit >= -459 && fahrenheit <= -1:
        return 'Below Zero';
      case fahrenheit >= -460 && fahrenheit <= -459:
        return 'Absolute Zero';
      case fahrenheit <= -461:
        return 'Impossible';
      default:
        return '';
    }
  }
}
