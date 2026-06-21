import { Component } from '@angular/core';
import { HlmSidebarImports } from '@ui-spartan/sidebar';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [HlmSidebarImports, Header, Sidebar, RouterOutlet],
  host: {
    class: 'block',
  },
  styleUrl: './dashboard-layout.css',
  template: `
    <app-sidebar>
      <main hlmSidebarInset>
        <app-header />
        <div class="flex flex-1 flex-col gap-4 p-4">
          <router-outlet />
        </div>
      </main>
    </app-sidebar>
  `,
})
export default class DashboardLayout {}
