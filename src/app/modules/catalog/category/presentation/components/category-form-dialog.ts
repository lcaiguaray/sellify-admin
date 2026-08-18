import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { CategoryFormModel } from '../../infrastructure/dtos/category-form.dto';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { CategoryFacade } from '../../application/facades/category.facade';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { Category } from '../../domain/models/category.model';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategorySearchableDefault } from '../../domain/models/category.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';

@Component({
  selector: 'app-category-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmNativeSelectImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Categoría</h3>
      <p hlmDialogDescription>
        Complete los campos para {{ data ? 'editar la' : 'crear una nueva' }} categoría.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-category">
        <hlm-field-group>
          <hlm-field>
            <label hlmFieldLabel for="parentId">Categoría superior</label>
            <select id="parentId" hlmNativeSelect [formField]="form.parentId">
              <option value="">Sin categoría superior</option>
              @for (category of parentCategories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </hlm-field>
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
                rows="4"
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
      <button hlmBtn type="submit" form="form-create-category" [disabled]="form().submitting()">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class CategoryCreateDialog {
  private readonly categoryFacade = inject(CategoryFacade);
  private readonly categoryRepository = inject(CategoryRepository);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly _dialogContext = injectBrnDialogContext<{ category: Category }>();
  protected readonly data = this._dialogContext.category;

  protected readonly formModel = signal<CategoryFormModel>({
    parentId: this.data?.parentId ?? '',
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
        message: 'La descripción no puede exceder 150 caracteres',
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            const response = this.data
              ? await this.categoryFacade.update({
                  ...this.data,
                  parentId: fields.parentId || null,
                  name: fields.name,
                  slug: fields.slug,
                  description: fields.description,
                })
              : await this.categoryFacade.create({ ...fields, parentId: fields.parentId || null });
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
  readonly parentCategoriesResource = rxResource({
    stream: () =>
      this.categoryRepository
        .get({ ...CategorySearchableDefault, active: true, size: 100 })
        .pipe(map((response) => response.data.content.filter((item) => item.id !== this.data?.id))),
  });
  readonly parentCategories = () => this.parentCategoriesResource.value() ?? [];

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
