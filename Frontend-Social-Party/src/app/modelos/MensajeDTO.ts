export interface MensajeDTO {
    id?: number;
    texto: string;
    hora?: string;
    fecha?: string;
    idEmisor: number;
    idReceptor: number;
    editado?: boolean;
    borrado?: boolean;
}
