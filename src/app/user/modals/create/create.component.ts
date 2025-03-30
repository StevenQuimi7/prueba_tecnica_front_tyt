import { Component, OnInit, Inject } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserModel } from '../../model/user.model';
import { UsersService } from '../../services/users.service';
import { DepartamentoModel } from 'src/app/departamento/model/departamento.model';
import { CargoModel } from 'src/app/cargo/model/cargo.model';
import { MensajesComponent } from 'src/app/components/mensajes/mensajes.component';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  usuarioForm: FormGroup;
  departamentos: DepartamentoModel[] = [];
  cargos: CargoModel[] = [];
  tituloModal: string | any;
  opcionModal: string | any;
  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateComponent>,
    private dialog : MatDialog
  ) {
    this.usuarioForm = this.formBuilder.group({
      idDepartamento: ['', Validators.required],
      idCargo: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      primerNombre: ['', Validators.required],
      segundoNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
    });

    this.departamentos = data.departamentos;
    this.cargos = data.cargos;
    this.tituloModal = data.titulo;
    this.opcionModal = data.opcion;
  }

  ngOnInit(): void {
    if (this.data.opcion === 'crear') {
      this.usuarioForm.reset();
    } else if (this.data.opcion === 'editar') {
      const user = this.data.users;
      this.usuarioForm.patchValue({
        idDepartamento: Number(user.idDepartamento),
        idCargo: Number(user.idCargo),
        usuario: user.usuario,
        email: user.email,
        primerNombre: user.primerNombre,
        segundoNombre: user.segundoNombre,
        primerApellido: user.primerApellido,
        segundoApellido: user.segundoApellido,
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.usuarioForm.valid) {
      if (this.data.opcion === 'crear') {
        let datos: UserModel;
        datos = new UserModel(
          this.usuarioForm.get('usuario')?.value,
          this.usuarioForm.get('primerNombre')?.value,
          this.usuarioForm.get('primerApellido')?.value,
          this.usuarioForm.get('segundoNombre')?.value,
          this.usuarioForm.get('segundoApellido')?.value,
          this.usuarioForm.get('idDepartamento')?.value,
          this.usuarioForm.get('idCargo')?.value,
          this.usuarioForm.get('email')?.value
        );

        this.userService.storeUser(datos).subscribe({
          next: (resp) => {
            this.onClose();
        
            const mensaje = resp?.text ?? (resp?.ok ? 'Usuario registrado con éxito' : 'Error al registrar usuario');
            const bandera = resp?.ok ?? false;
        
            if (bandera) {
              this.data.action();
            }
            this.openMessageDialog(mensaje, bandera);
          },
          error: (error) => {
            this.onClose();
        
            const mensajeError = error?.error?.errors ? this.formatValidationErrors(error.error.errors) : 'Error en el servidor';
            this.openMessageDialog(mensajeError, false);
          }
        });
      } else if (this.data.opcion === 'editar') {
        let datos: UserModel;
        datos = new UserModel(
          this.usuarioForm.get('usuario')?.value,
          this.usuarioForm.get('primerNombre')?.value,
          this.usuarioForm.get('primerApellido')?.value,
          this.usuarioForm.get('segundoNombre')?.value,
          this.usuarioForm.get('segundoApellido')?.value,
          this.usuarioForm.get('idDepartamento')?.value,
          this.usuarioForm.get('idCargo')?.value,
          this.usuarioForm.get('email')?.value,
          this.data.users.idUser
        );
        this.userService.updateUser(datos).subscribe({
          next: (resp) => {
            this.onClose();
            
            const mensaje = resp?.text ?? (resp?.ok ? 'Usuario actualizado con éxito' : 'Error al actualizar usuario');
            const bandera = resp?.ok ?? false;
            
            if (bandera) {
              this.data.action();
            }
        
            this.openMessageDialog(mensaje, bandera);
          },
          error: (error) => {
            this.onClose();
        
            if (error?.error?.errors) {
              const mensajeError = this.formatValidationErrors(error.error.errors);
              this.openMessageDialog(mensajeError, false);
            } else {
              this.openMessageDialog('Error en el servidor', false);
            }
          }
        });
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  private openMessageDialog(mensaje: string, bandera: boolean): void {
    this.dialog.open(MensajesComponent, {
      height: '150px',
      width: '300px',
      data: { mensaje, bandera }
    });
  }

  private formatValidationErrors(errors: any): string {
    let mensajeError = '';
    for (let campo in errors) {
      if (errors.hasOwnProperty(campo)) {
        mensajeError += `${campo}: ${errors[campo].join(', ')}\n`;
      }
    }
    return mensajeError;
  }
}
