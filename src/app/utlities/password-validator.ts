import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordsMathValidators(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>{
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordsDontMatch: true };
      }else {
        return  null;
      }
  
    }
  }