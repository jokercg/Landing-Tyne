import { Injectable } from '@angular/core';
import { DialogModel } from './dialog-model';
import { DialogComponent } from './dialog.component';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})

export class DialogService {

  private enterAnimationDuration = '200ms';
  private exitAnimationDuration = '200ms';

  public constructor(private dialog: MatDialog) {
  }

  public openDialog(dialogModel: DialogModel): MatDialogRef<DialogComponent, any> {
    let disableClose = dialogModel.disableClose === undefined ? true : dialogModel.disableClose;
    const ref = this.dialog.open(DialogComponent, {
      data: dialogModel,
      panelClass: 'dialog',
      enterAnimationDuration: this.enterAnimationDuration,
      exitAnimationDuration: this.exitAnimationDuration,
      // Establece el tamaño del diálogo
      width: '400px', // Ajusta el ancho según tus necesidades
      height: '200px', // Ajusta la altura según tus necesidades
      hasBackdrop: true, // Asegúrate de que el fondo se oscurezca
      disableClose: disableClose,
    });
    return ref;
  }
}