import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/UserService.service';
import { PublicacionService } from '../../services/PublicactionService.service';
import { Publicacion } from '../models.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  tabActiva: 'usuarios' | 'publicaciones' = 'usuarios';
  
  // Usuarios
  usuarios: User[] = [];
  loadingUsuarios = true;
  
  // Publicaciones
  publicaciones: Publicacion[] = [];
  loadingPublicaciones = false;
  
  // Modal de confirmación
  showDeleteModal = false;
  deleteTarget: { type: 'usuario' | 'publicacion'; id: number; nombre: string } | null = null;

  constructor(
    private userService: UserService,
    private publicacionService: PublicacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cambiarTab(tab: 'usuarios' | 'publicaciones'): void {
    this.tabActiva = tab;
    if (tab === 'publicaciones' && this.publicaciones.length === 0) {
      this.cargarPublicaciones();
    }
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    console.log('Cargando usuarios...');
    this.userService.getUsers().subscribe({
      next: (usuarios) => {
        console.log('Usuarios cargados:', usuarios);
        this.usuarios = usuarios;
        this.loadingUsuarios = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        alert('Error al cargar usuarios: ' + (error.error?.message || error.message));
        this.loadingUsuarios = false;
      }
    });
  }

  cargarPublicaciones(): void {
    this.loadingPublicaciones = true;
    console.log('Cargando publicaciones...');
    this.publicacionService.getPublicacions().subscribe({
      next: (publicaciones: Publicacion[]) => {
        console.log('Publicaciones cargadas:', publicaciones);
        this.publicaciones = publicaciones;
        this.loadingPublicaciones = false;
      },
      error: (error: any) => {
        console.error('Error cargando publicaciones:', error);
        alert('Error al cargar publicaciones: ' + (error.error?.message || error.message));
        this.loadingPublicaciones = false;
      }
    });
  }

  confirmarEliminarUsuario(usuario: User): void {
    this.deleteTarget = {
      type: 'usuario',
      id: usuario.id,
      nombre: `${usuario.nombre} ${usuario.apellido}`
    };
    this.showDeleteModal = true;
  }

  confirmarEliminarPublicacion(publicacion: Publicacion): void {
    this.deleteTarget = {
      type: 'publicacion',
      id: publicacion.id,
      nombre: `Publicación de ${publicacion.mascota.nombre}`
    };
    this.showDeleteModal = true;
  }

  ejecutarEliminacion(): void {
    if (!this.deleteTarget) return;

    if (this.deleteTarget.type === 'usuario') {
      this.userService.deleteUser(this.deleteTarget.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== this.deleteTarget!.id);
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          alert('Error al eliminar usuario');
          this.cerrarModal();
        }
      });
    } else {
      this.publicacionService.deletePublicacion(this.deleteTarget.id).subscribe({
        next: () => {
          this.publicaciones = this.publicaciones.filter(p => p.id !== this.deleteTarget!.id);
          this.cerrarModal();
        },
        error: (error: any) => {
          console.error('Error eliminando publicación:', error);
          alert('Error al eliminar publicación');
          this.cerrarModal();
        }
      });
    }
  }

  cerrarModal(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }

  editarPublicacion(id: number): void {
    this.router.navigate(['/editar-publicacion', id]);
  }

  verPublicacion(id: number): void {
    this.router.navigate(['/publicacion', id]);
  }

  getRolDisplay(usuario: User): string {
    return usuario.rolNuevo?.nombre || usuario.rolPersistido || 'Sin rol';
  }

  getEstadoBadgeColor(estado: string): string {
    switch (estado) {
      case 'PERDIDO_PROPIO': return 'bg-red-600';
      case 'PERDIDO_AJENO': return 'bg-orange-600';
      case 'RECUPERADO': return 'bg-green-600';
      case 'ADOPTADO': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  }
}
