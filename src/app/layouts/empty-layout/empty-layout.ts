import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'empty-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export default class EmptyLayout {}
