import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar-component',
  imports: [MatIcon],
  templateUrl: './custom-snackbar-component.html',
  styleUrl: './custom-snackbar-component.css',
})
export class CustomSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, icon: string }) {}
}
