export interface Evento {
    id: number;
    horaApertura: string;
    horaFinalizacion: string;
    fecha: string;
    titulo: string;
    descripcion: string;
    foto: string;
    idEmpresa?: number;
    precio: number;
}
