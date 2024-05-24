import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  Input,
  inject,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, noop, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NumericInputOptions {
  id?: string;
  name?: string;
  class?: string;
  format?: string;
}

const defaultOptions: NumericInputOptions = {
  name: 'input-1',
  class: 'form-control'
};

/**
 * @see https://blog.bitsrc.io/how-ive-created-custom-inputs-in-angular-16-43f4c2d37d07
 */
@Component({
  selector: 'dt-numeric-input',
  standalone: true,
  templateUrl: './numeric-input.component.html',
  styleUrl: './numeric-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInput),
      multi: true,
    },
  ],
})
export class NumericInput implements ControlValueAccessor {
  @Input() options?: NumericInputOptions;

  @ViewChild('numericInput') inputRef?: ElementRef | null;

  formControl: FormControl = new FormControl<string>('');

  destroyRef: DestroyRef = inject(DestroyRef);

  inputOptions: NumericInputOptions = {};

  onChange: (value: string) => void = noop;
  onTouch: () => void = noop;

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  onFocus() {
    if (!this.inputRef) {
      return;
    }
    this.inputRef.nativeElement.select();
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault(); // Prevent default context menu behavior
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  writeValue(value: number): void {
    this.formControl.setValue(value);
  }

  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        debounceTime(200),
        tap(value => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    if (this.options == null) {
      this.inputOptions = defaultOptions;
    } else {
      this.inputOptions = {
        ...defaultOptions,
        ...this.options
      };
    }

    if (this.inputOptions.id == null) {
      this.inputOptions.id = this.inputOptions.name;
    }
  }
}
