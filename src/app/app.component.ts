import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { distinctUntilChanged, map, Observable, startWith, Subscription } from 'rxjs';

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
    fahrenheitInput: new FormControl<string>('32', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    }),
    celsiusInput: new FormControl<string>('0.0', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    }),
    kelvinInput: new FormControl<string>('273.15', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "blur"
    })
  });

  public weatherCondition$!: Observable<string>;
  public temperatureColor$!: Observable<string>;

  private subscriptions: Subscription = new Subscription();

  public ngOnInit() {
    this.weatherCondition$ = this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      startWith(this.temperatureFormGroup.controls.fahrenheitInput.value),
      map(fahrenheit => this.updateCondition(fahrenheit))
    );

    this.temperatureColor$ = this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      startWith(this.temperatureFormGroup.controls.fahrenheitInput.value),
      map(fahrenheit => this.tempColorChange(fahrenheit))
    );

    this.subscriptions.add(this.temperatureFormGroup.controls.fahrenheitInput.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(fahrenheit => {
        this.onFahrenheitChange(fahrenheit);
    }));

    this.subscriptions.add(this.temperatureFormGroup.controls.celsiusInput.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(celsius => {
      const toFahrenheit = this.tempCalculations.celsiusToFahrenheit(Number(celsius));
      this.onFahrenheitChange(toFahrenheit.toString());
    }));

    this.subscriptions.add(this.temperatureFormGroup.controls.kelvinInput.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(kelvin => {
      const toCelsius = this.tempCalculations.kelvinToCelsius(Number(kelvin));
      const toFahrenheit = this.tempCalculations.celsiusToFahrenheit(toCelsius);
      this.onFahrenheitChange(toFahrenheit.toString());
    }));
  }

  public sliderUpdate(value: string) {
    this.temperatureFormGroup.controls.fahrenheitInput.patchValue(value ?? this.temperatureFormGroup.controls.fahrenheitInput.defaultValue);
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public tempCalculations = {
    fahrenheitToCelsius: (fahrenheit: number): number => {
      return Math.round((fahrenheit - 32) * (5 / 9) * 10) / 10;
    },
    celsiusToFahrenheit: (celsius: number): number => {
      return Math.round(celsius * (9 / 5) + 32);
    },
    celsiusToKelvin: (celsius: number): number => {
      return celsius + 273.15;
    },
    kelvinToCelsius: (kelvin: number): number => {
      return kelvin - 273.15;
    }
  };

  public absoluteZeroButton() {
    this.temperatureFormGroup.controls.kelvinInput.setValue('0.00');
  }

  public iceButton() {
    this.temperatureFormGroup.controls.celsiusInput.setValue('0');
  }

  public niceButton() {
    this.temperatureFormGroup.controls.fahrenheitInput.setValue('72');
  }

  public hotButton() {
    this.temperatureFormGroup.controls.fahrenheitInput.setValue('90');
  }

  public boilingButton() {
    this.temperatureFormGroup.controls.fahrenheitInput.setValue('212');
  }

  public randomButton() {
    const minFahrenheit = 32;
    const maxFahrenheit = 100;
    const randomNumberFahrenheit = Math.floor(Math.random() * (maxFahrenheit - minFahrenheit + 1)) + minFahrenheit;

    const toCelsius = this.tempCalculations.fahrenheitToCelsius(randomNumberFahrenheit);
    const toKelvin = this.tempCalculations.celsiusToKelvin(toCelsius);

    this.temperatureFormGroup.patchValue({
      fahrenheitInput: randomNumberFahrenheit.toString(),
      celsiusInput: toCelsius.toFixed(1),
      kelvinInput: toKelvin.toFixed(2)
    });
  }

  private onFahrenheitChange(value: string) {
    const toNumber = Number(value);
    const toCelsius = this.tempCalculations.fahrenheitToCelsius(toNumber);
    const toKelvin = this.tempCalculations.celsiusToKelvin(toCelsius);
    this.temperatureFormGroup.patchValue({
      fahrenheitInput: value,
      celsiusInput: toCelsius.toFixed(1),
      kelvinInput: toKelvin.toFixed(2)
    })
  }

  private tempColorChange(value: string) {
    const fahrenheit = Number(value);
    const minFahrenheit = 32;
    const maxFahrenheit = 100;

    const tempCalc = (fahrenheit - minFahrenheit) / (maxFahrenheit - minFahrenheit);
    const tempInRange = Math.max(0, Math.min(1, tempCalc));

    const inverted = 1 - tempInRange;
    const hue = inverted * 240;

    return `hsl(${hue}, 100%, 50%)`;
  }

  private updateCondition(num: string) {
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
