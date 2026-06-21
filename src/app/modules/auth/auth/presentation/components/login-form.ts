import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeLogin03 } from '@ng-icons/huge-icons';
import { lucideAlertCircle } from '@ng-icons/lucide';
import { tablerEye, tablerEyeOff, tablerLockPassword, tablerUser } from '@ng-icons/tabler-icons';
import { form, FormRoot, FormField, required } from '@angular/forms/signals';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmAlertImports } from '@ui-spartan/alert';
import { HlmSpinnerImports } from '@ui-spartan/spinner';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { LoginFormModel } from '../../infrastructure/dtos/auth-form.dto';
import { AuthFacade } from '../../application/facades/auth.facade';
import { parseHttpError } from '@core/utils/http-error.util';

@Component({
  selector: 'app-login-form',
  imports: [
    RouterLink,
    FormRoot,
    FormField,
    NgIcon,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmAlertImports,
    HlmSpinnerImports,
    HlmInputGroupImports,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      tablerLockPassword,
      tablerEye,
      tablerUser,
      tablerEyeOff,
      hugeLogin03,
    }),
  ],
  template: `
    <form [formRoot]="loginForm">
      <hlm-field-group>
        @if (errorMessage()) {
          <hlm-alert variant="destructive">
            <ng-icon name="lucideAlertCircle" />
            <h4 hlmAlertTitle>Error</h4>
            <p hlmAlertDescription>{{ errorMessage() }}</p>
          </hlm-alert>
        }

        <hlm-field>
          <label hlmFieldLabel for="username">Usuario</label>

          <hlm-input-group>
            <hlm-input-group-addon>
              <ng-icon name="tablerUser" />
            </hlm-input-group-addon>
            <input
              hlmInputGroupInput
              type="text"
              id="username"
              autocomplete="off"
              [formField]="loginForm.username"
            />
          </hlm-input-group>

          @for (error of loginForm.username().errors(); track error) {
            <hlm-field-error [validator]="error.kind">
              {{ error.message }}
            </hlm-field-error>
          }
        </hlm-field>

        <hlm-field>
          <div class="flex items-center">
            <label hlmFieldLabel for="password">Contraseña</label>
            <a
              hlmFieldDescription
              class="ml-auto text-sm underline-offset-4 hover:underline"
              routerLink="."
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <hlm-input-group>
            <hlm-input-group-addon>
              <ng-icon name="tablerLockPassword" />
            </hlm-input-group-addon>

            <input
              hlmInputGroupInput
              [type]="showPassword() ? 'text' : 'password'"
              id="password"
              autocomplete="off"
              [formField]="loginForm.password"
            />

            <hlm-input-group-addon align="inline-end">
              <button hlmInputGroupButton type="button" size="icon-xs" (click)="togglePassword()">
                <ng-icon [name]="showPassword() ? 'tablerEyeOff' : 'tablerEye'" />
              </button>
            </hlm-input-group-addon>
          </hlm-input-group>

          @for (error of loginForm.password().errors(); track error) {
            <hlm-field-error [validator]="error.kind">
              {{ error.message }}
            </hlm-field-error>
          }
        </hlm-field>
        <hlm-field>
          <button hlmBtn type="submit" [disabled]="loginForm().submitting()">
            @if (loginForm().submitting()) {
              <hlm-spinner data-icon="inline-start" />
            } @else {
              <ng-icon name="hugeLogin03" size="1.3em" />
            }
            Acceder
          </button>
        </hlm-field>
      </hlm-field-group>
    </form>
  `,
})
export class LoginForm {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  protected readonly _loginModel = signal<LoginFormModel>({ username: '', password: '' });
  public readonly loginForm = form(
    this._loginModel,
    (schema) => {
      required(schema.username, { message: 'El campo es requerido' });
      required(schema.password, { message: 'El campo es requerido' });
    },
    {
      submission: {
        action: async (field) => {
          this.errorMessage.set(null);

          try {
            await this.authFacade.login(field().value());
            this.router.navigate(['/admin/analytics/dashboard']);
          } catch (err: any) {
            this.errorMessage.set(parseHttpError(err));
          }
        },
      },
    },
  );

  public errorMessage = signal<string | null>(null);
  public showPassword = signal<boolean>(false);

  public togglePassword() {
    this.showPassword.update((show) => !show);
  }
}
