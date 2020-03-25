
import { AbstractControl, ValidatorFn, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { NumeralPipe } from 'ngx-numeral';

export function languageValidator(control: AbstractControl) {
  if(control.value === null || control.value === undefined) { 
    return null;
  }

  const filter = control.value.replace(/[^\x00-\x7F]+/ig, '');

  if (filter !== control.value) {
    return { langError: true };
  }

  return null;
}

export function specialchar (control: AbstractControl) {
  if(control.value === null || control.value === undefined) {
    return null;
  }

  const filter = control.value.replace(/[!@#$%^&*(),.?":{}|<>]/g, '');

  if(filter !== control.value) {
    return { specialchar: true }
  }
}

// Number Length Between two number Validator;
export function numLengthValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean } | null => {
    const numLength = control.value.length;

    if (control.value !== undefined && control.value !== '' && (isNaN(control.value) || numLength < min || numLength > max)) {
      return {numLength: true };
    }

    return null;
  };
}

// Min Digit 
export function minLength (min: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean } | null => {

    if(control.value === null || control.value === undefined) {
      return null;
    }
    
    if(control.value !== null) {
      const numLength = control.value.length;
      if (control.value !== undefined && control.value !== '' && (isNaN(control.value) || numLength < min)) {
        return { minDigit: true };
      }
    }
    return null;
  };
}

// Only Support Number Validator;
export function numOnlyValidator(control: AbstractControl) {
  if(control.value === null || control.value === undefined) { 
    return null;
  }

  const numOnly = control.value.toString().replace(/[^0-9]*/g, '');

  if (control.value !== undefined && control.value !== '' && numOnly !== control.value) {
    return { onlyNumber: true };
  }

  return null;
}

// White Space Validator;
export function removeSpacesValidator(control: AbstractControl) {
  const controlInput = control.value.replace(/\s/g, '');
  if (control.value !== undefined && control.value !== controlInput) {
    return { whitespace: true };
  }

  return null;
}

// Registeration password and confirm password check;
export function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password').value;
  const confirm = control.get('compwd').value;

  if (password !== confirm) {
    control.get('compwd').setErrors({ passwordMatch: true });
  }

  return null;
}

// check phone number start 09;
export function phoneNumValidator(control: AbstractControl) {

  if(control.value === null || control.value === undefined) {
    return null;
  }

  if(control.value !== null) {
    const str = control.value.substring(0, 2);
    if (str !== '09' ) {
      return { validPhone: true };
    }
  }

  return null;
}

// Currency Format Validation
export function currencyFormat (control: AbstractControl) {

  if(control.value === 0) {
    return { invalidValue: true }
  }

  return null;
}

export function imageValidator(control: AbstractControl){
  if(control.value === null) {
    return {required: true }
  }
}

export const securityQuestionValidatorsCheck: ValidatorFn = (fg: FormGroup) => {
  console.log(fg.get(''));
  return null;
}

// Service Peroid Validation
export const servicePeriodValidator: ValidatorFn = (fg: FormGroup) => {
  let year = fg.get('yearOfServiceYear');
  let month = fg.get('yearOfServiceMonth');
  
  if(Number(year.value) === 0 && Number(month.value) === 0) {
    year.setErrors({ required: true });
    month.setErrors({ required: true });
    return { required: true }
  }
  
  year.setErrors(null);
  month.setErrors(null);
  return null;
}

// Say Peroid Validation
export const stayPeriodValidator: ValidatorFn = (fg: FormGroup) => {
  let year = fg.get('yearOfStayYear');
  let month = fg.get('yearOfStayMonth');
  
  if(Number(year.value) === 0 && Number(month.value) === 0) {
    year.setErrors({ required: true });
    month.setErrors({ required: true });
    return { required: true }
  }
  
  year.setErrors(null);
  month.setErrors(null);
  return null;
}

export const guarantorPeriodValidator: ValidatorFn = (fg: FormGroup) => {
  let year = fg.get('yearOfStayYear');
  let month = fg.get('yearOfStayMonth');
  
  if(Number(year.value) === 0 && Number(month.value) === 0) {
    year.setErrors({ required: true });
    month.setErrors({ required: true });
    return { required: true }
  }
  
  year.setErrors(null);
  month.setErrors(null);
  return null;
}

// Max Amount of finance;
export function maxAmountOfFinance(max: number, min: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean } | null => {

    if (control.value !== undefined && control.value !== '') {
      const financeAmount = new NumeralPipe(control.value).value();

      if(financeAmount > max || financeAmount < min) {
        return {maxAmount: true };
      }
      
    }

    return null;
  };
}

export function securityQuestionValidators(questionForm: FormGroup): ValidatorFn {

  return (control: AbstractControl) : {[key: string]: boolean} | null => {
    let QuestionFormArray = <FormArray>questionForm.get('question');
    let QuestionValue: any = [];

    for (let i=0; i<QuestionFormArray.controls.length; i++) {
      let questionFormGroup = <FormGroup>QuestionFormArray.controls[i];
      let questionFormGroupControl = <FormControl>questionFormGroup.controls.secQuesId;

      QuestionValue.push(questionFormGroupControl.value);
      QuestionValue.some((arrayValue: any) => {
      

        if(arrayValue === questionFormGroupControl.value) {
          questionFormGroupControl.setErrors({ 'duplicated' : true });
        }

      });
    }

    return null;
  }
}

export function dateValidation (control: AbstractControl) {
  
  if(control.errors !== null) {
    return { invalidDate: true }
  }

  return null;
}
// Error Message;
export const errorMessage = {
  blank: '* Must not blank',
  whitespace: '* Must not only spaces',
  language: '* Must input only ASCII characters.',
  password: 'Length is from 6 to 16.',
  nrc: '* Registration Code | Must have only 6 digits.',
  number: '* Must input only 0-9 characters.',
  phoneNo: '* Length is from 9 to 11.',
  date: '* Invalid Date',
  passwordMatch: '* Must equal with Password field.',
  validPhone: '* Must be started with "09"',
  questionAnswer: '* The selected question must not be duplicated.',
  questionChoose: '* Choose security question',
  answerLength: '* Max number of length is ',
  usrMisMatch: '* Username and password does not match',
  unknown: '* Unknown Error!',
  email: '* Invalid Email Address',
  maxAmount: " Max Finance Amount is ",
  loanCalculateError: " Finance Amount is required and Finance Amount must be value.",
  selectedError: " Select One Category",
  maxName: 'max length of characters is 50'
};
