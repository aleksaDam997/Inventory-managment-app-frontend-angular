import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nonZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    return control.value === 0 ? { nonZero: true } : null;
  };
}
