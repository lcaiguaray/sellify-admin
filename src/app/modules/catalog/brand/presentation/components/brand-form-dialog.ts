import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { CreateFormModel } from '../../infrastructure/dtos/brand-form.dto';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { BrandFacade } from '../../application/facades/brand.facade';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { Brand } from '../../domain/models/brand.model';

@Component({
  selector: 'app-brand-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Crear Marca</h3>
      <p hlmDialogDescription>
        This dialog has a sticky footer that stays visible while the content scrolls.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel for="name">Nombre</label>
              <input id="name" hlmInput autoComplete="off" [formField]="form.name" />

              @for (error of form.name().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="slug">Slug</label>
              <input
                id="slug"
                hlmInput
                autoComplete="off"
                [formField]="form.slug"
                (input)="onSlugInput()"
              />

              @for (error of form.slug().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>
          <hlm-field>
            <label hlmFieldLabel for="description">Descripción</label>
            <hlm-input-group>
              <textarea
                hlmInputGroupTextarea
                id="description"
                class="min-h-24"
                rows="6"
                [formField]="form.description"
              ></textarea>
              <hlm-input-group-addon align="block-end">
                <span hlmInputGroupText>{{ descriptionLength() }}/150 caracteres</span>
              </hlm-input-group-addon>
            </hlm-input-group>

            @for (error of form.description().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>
        </hlm-field-group>
      </form>
    </div>
    <hlm-dialog-footer>
      <button
        hlmBtn
        type="button"
        variant="outline"
        (click)="close()"
        [disabled]="form().submitting()"
      >
        Cerrar
      </button>
      <button hlmBtn type="submit" form="form-create" [disabled]="form().submitting()">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class BrandCreateDialog {
  private readonly brandFacade = inject(BrandFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly _dialogContext = injectBrnDialogContext<{ brand: Brand }>();
  protected readonly data = this._dialogContext.brand;

  protected readonly formModel = signal<CreateFormModel>({
    name: this.data?.name ?? '',
    description: this.data?.description ?? '',
    slug: this.data?.slug ?? '',
  });

  private readonly slugTouched = signal<boolean>(false);

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.name, { message: 'El campo es requerido' });
      required(schema.slug, { message: 'El campo es requerido' });
      maxLength(schema.description, 150, {
        message: 'Description must be at most 150 characters',
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            const response = this.data
              ? await this.brandFacade.update({
                  ...this.data,
                  name: fields.name,
                  slug: fields.slug,
                  description: fields.description,
                })
              : await this.brandFacade.create(fields);
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  public readonly descriptionLength = computed(() => this.form.description().value().length);

  constructor() {
    effect(() => {
      const nameValue = this.form.name().value();
      if (this.slugTouched() || this.data) return;

      untracked(() => {
        const slugified = this.slugify(nameValue);
        this.form.slug().value.set(slugified);
      });
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  protected onSlugInput(): void {
    this.slugTouched.set(true);
  }

  public close() {
    this.dialogRef.close();
  }
}
