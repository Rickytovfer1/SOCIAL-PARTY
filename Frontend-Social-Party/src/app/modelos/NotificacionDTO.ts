export interface NotificacionDTO {
    id: number;
    idUsuario: number;
    tipo: string;
    mensaje: string;
    fecha: Date;
    idReferencia?: number;
}
