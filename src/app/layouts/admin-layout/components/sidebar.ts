import { Component } from '@angular/core';
import { Navigation } from './navigation';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'admin-sidebar',
  imports: [Navigation, NgOptimizedImage],
  host: {
    class: 'relative flex w-full flex-auto flex-col',
  },
  template: `
    <!-- Header -->
    <header>
      <div class="relative flex items-center gap-x-2.5 pt-5 pr-4 pb-0 pl-6">
        <!-- Logo -->
        <div class="relative h-8 w-8">
          <img ngSrc="/branding/logo-iso.svg" alt="Logo" fill />
        </div>

        <div class="flex flex-col">
          <div class="text-on-surface text-lg leading-4 font-bold tracking-wider">Sellify</div>
          <div class="font-mono text-xs leading-3 font-medium tracking-wide">Admin</div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <navigation class="my-4 flex-auto" />
  `,
})
export class AdminSidebar {}
