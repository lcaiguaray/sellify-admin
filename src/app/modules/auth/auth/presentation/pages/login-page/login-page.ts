import { Component } from '@angular/core';
import SplitLayout from '@layouts/split-layout/split-layout';
import { HlmAlertImports } from '@ui-spartan/alert';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmSpinnerImports } from '@ui-spartan/spinner';
import { LoginForm } from '../../components/login-form';
import BenefitItem from '../../components/benefit-item';
import { PlatformLogo } from '@ui/platform-logo';

@Component({
  selector: 'app-login-page',
  imports: [
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmAlertImports,
    HlmSpinnerImports,
    SplitLayout,
    PlatformLogo,
    LoginForm,
    BenefitItem,
  ],
  styleUrl: './login-page.css',
  template: `
    <app-split-layout rightClass="bg-panel" leftClass="flex flex-col justify-center items-center">
      <ng-container left-layout>
        <div class="max-w-md w-full">
          <div class="flex items-center gap-1 mb-5">
            <span class="w-6 h-2 rounded-full bg-primary/80"></span>
            <span class="w-3 h-2 rounded-full bg-primary/50"></span>
            <span class="w-3 h-2 rounded-full bg-primary/50"></span>
          </div>

          <!-- Header -->
          <div class="mb-10">
            <h1 class="text-3xl font-semibold">Inicia sesión en tu cuenta</h1>
            <span class="text-muted-foreground">Accede a tu panel y gestiona tus ventas</span>
          </div>

          <app-login-form />
        </div>
      </ng-container>

      <ng-container right-layout>
        <app-platform-logo />

        <div class="flex-1 flex flex-col justify-center z-10">
          <span
            class="text-5xl text-panel-foreground font-bold font-inter tracking-wide mb-2"
            >Todo tu <span class="text-primary">negocio</span> en un solo lugar.</span
          >
          <span class="text-xl text-panel-foreground/60 tracking-wide">
            Una plataforma diseñada para empresas que priorizan la eficiencia en cada venta, compra
            y movimiento de inventario
          </span>
        </div>

        <div class="flex flex-col gap-2 z-10">
          <app-benefit-item
            icon="tablerChartBar"
            title="Ventas en tiempo real"
            description="Visualiza cada oportunidad al instante."
          />

          <app-benefit-item
            icon="tablerUsers"
            title="Gestión de clientes"
            description="Historial, contactos y seguimiento unificado."
          />

          <app-benefit-item
            icon="tablerReportAnalytics"
            title="Reportes automáticos"
            description="KPIs actualizados sin trabajo manual."
          />
        </div>

        <div
          class="absolute -right-50 -top-50 z-0 h-120 w-120 rounded-full bg-panel-accent/20"
        ></div>
        <div
          class="absolute -bottom-50 -left-50 z-0 h-120 w-120 rounded-full bg-panel-accent/20"
        ></div>
      </ng-container>
    </app-split-layout>
  `,
})
export default class LoginPage {}
