import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class FormService {

  constructor(private fb: FormBuilder) { }

  loginMdoel() {
    return this.fb.group({
      username: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }
}

export const loginFormModel = [
  {
    name: 'username',
    placeholder: 'User Name',
    type: 'text',
    control: ['', Validators.required],
    invalidMessage: 'error'
  },

  {
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    control: ['', Validators.required],
    invalidMessage: 'error'
  }
];
