import {Component} from '@angular/core';

@Component({
  selector: 'ons-page[first]',
  template: `
    <div class="content">
      <p>I am the first tab.</p>
      <p>Yamasaki modified</p>
    </div>
  `
})
export class First {
  constructor() {}
}
