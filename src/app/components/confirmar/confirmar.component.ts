import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {

  titulo:string|any;
  mensaje:string|any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmarComponent>) {

    this.titulo = data.titulo
    this.mensaje = data.mensaje

   }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.data.action();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
