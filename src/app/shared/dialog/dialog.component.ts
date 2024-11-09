import { OnInit, Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, } from '@angular/material/dialog';
import { DialogModel } from './dialog-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, CommonModule]
})
export class DialogComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel) { }

  ngOnInit() {
  }

  public action(): void {
    // if (this.data.isSuccessful) {
    //   if (this.data.action) {
    //     switch (this.data.action) {
    //       case DialogActions.SignOut:
    //         this.singOut();
    //         break;
    //     }
    //   }
    //   if (this.data.redirectTo) {
    //     this.router.navigate([this.data.redirectTo]);
    //   }
    // }
    this.dialogRef.close({ success: true });
  }

  public cancel() {
    this.dialogRef.close({ success: false });
  }
}
