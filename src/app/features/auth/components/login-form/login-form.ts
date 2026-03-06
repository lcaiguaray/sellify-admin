import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
  ],
})
export default class LoginForm {
  // Dependencies
  private router = inject(Router);

  // State
  protected signInFormModel = signal({
    user: '',
    password: '',
  });
  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.user, { message: 'El campo es obligatorio' });
    required(form.password, { message: 'El campo es obligatorio' });
  });

  handleSubmit(event: Event) {
    event.preventDefault();

    submit(this.signInForm, async () => {
      this.router.navigateByUrl('/admin');
    });
  }
}
