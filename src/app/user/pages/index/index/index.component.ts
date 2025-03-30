import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/user/model/user.model';
import { UsersService } from 'src/app/user/services/users.service';
import { UserInterfase } from 'src/app/user/interfase/user.interfase';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoService } from 'src/app/departamento/services/departamento.service';
import { CargoService } from 'src/app/cargo/services/cargo.service';
import { DepartamentoModel } from 'src/app/departamento/model/departamento.model';
import { CargoModel } from 'src/app/cargo/model/cargo.model';
import { forkJoin } from 'rxjs';
import { CreateComponent } from 'src/app/user/modals/create/create.component';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';
import { MensajesComponent } from 'src/app/components/mensajes/mensajes.component';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  users: UserModel[] = [];
  departamentos: DepartamentoModel[] = [];
  id_departamento?: number | any;
  id_cargo?: number | any;
  cargos: CargoModel[] = [];
  perPage: number = 10;
  page: number = 1;
  totalItems: number = 0;
  isLoading: boolean = false;

  displayedColumns: string[] = [
    'usuario',
    'primerNombre',
    'primerApellido',
    'nombreDepartamento',
    'nombreCargo',
    'email',
    'Acciones',
  ];
  dataSource: MatTableDataSource<UserInterfase> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private userService: UsersService,
    private departamentoSerivce: DepartamentoService,
    private cargoService: CargoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      usuarios: this.userService.getUsers({}),
      cargos: this.cargoService.getCargos(),
      departamentos: this.departamentoSerivce.getDepartamentos(),
    }).subscribe({
      next: ({ usuarios, cargos, departamentos }) => {
        this.users = usuarios.text.data;
        this.dataSource.data = this.users;
        this.cargos = cargos;
        this.departamentos = departamentos;
        this.totalItems = usuarios.text.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  onChangeDepartamento(event: any) {
    const filtro = {
      idDepartamento: event.value,
      idCargo: this.id_cargo,
    };
    this.isLoading = true;
    this.userService.getUsers(filtro).subscribe({
      next: (resp) => {
        this.users = resp.text.data;
        this.dataSource.data = this.users;
        this.totalItems = resp.text.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
  onChangeCargo(event: any) {
    const filtro = {
      idDepartamento: this.id_departamento,
      idCargo: event.value,
    };
    this.isLoading=true;
    this.userService.getUsers(filtro).subscribe({
      next: (resp) => {
        this.users = resp.text.data;
        this.dataSource.data = this.users;
        this.totalItems = resp.text.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  onChangePage(event: PageEvent) {
    this.perPage = event.pageSize;
    this.page = event.pageIndex + 1;
    const filtro = {
      idCargo: this.id_cargo,
      idDepartamento: this.id_departamento,
      perPage: this.perPage,
      page: this.page,
    };
    this.isLoading = true;
    this.userService.getUsers(filtro).subscribe({
      next: (resp) => {
        this.users = resp.text.data;
        this.dataSource.data = this.users;
        this.totalItems = resp.text.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  openModalCreate() {
    const dialogRef = this.dialog.open(CreateComponent, {
      height: '500px',
      width: '750px',
      data: {
        opcion: 'crear',
        titulo: 'Registrar usuario',
        departamentos: this.departamentos,
        cargos: this.cargos,
        action: () => this.getUsers(),
      },
    });
  }

  openModalEditar(idUser: number) {
    const dialogRef = this.dialog.open(CreateComponent, {
      height: '500px',
      width: '750px',
      data: {
        opcion: 'editar',
        titulo: 'Editar usuario',
        departamentos: this.departamentos,
        cargos: this.cargos,
        users: this.users.find((x) => x.idUser === idUser),
        action: () => this.getUsers(),
      },
    });
  }

  openModalEliminar(idUser: number) {
    const dialogRef = this.dialog.open(ConfirmarComponent, {
      height: '200',
      width: '200',
      data: {
        titulo: 'Eliminar usuario',
        mensaje: '¿Está seguro de eliminar el usuario seleccionado?',
        action: () => this.deleteUser(idUser, dialogRef),
      },
    });
  }

  deleteUser(idUser: number, dialogRef: MatDialogRef<ConfirmarComponent>) {
    this.userService.deleteUser({ idUser }).subscribe((resp) => {
      dialogRef.close();

      const mensaje =
        resp?.text ??
        (resp?.ok
          ? 'Usuario eliminado con éxito'
          : 'Error al eliminar usuario');
      const bandera = resp?.ok ?? false;
      if (bandera) {
        this.getUsers();
      }
      this.dialog.open(MensajesComponent, {
        height: '150px',
        width: '300px',
        data: { mensaje, bandera },
      });
    });
  }

  getUsers() {
    this.isLoading=true;
    this.userService.getUsers({}).subscribe({
      next: (resp) => {
        this.users = resp.text.data;
        this.totalItems = resp.text.total;
        this.dataSource.data = this.users;
        this.id_departamento = undefined;
        this.id_cargo = undefined;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
