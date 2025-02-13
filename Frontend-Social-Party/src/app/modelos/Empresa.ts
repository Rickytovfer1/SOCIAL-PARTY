export interface Empresa {
    id: number;
    nombre: string;
    direccion: string;
    cp: string;
    nif: string;
    telefono: string;
    valoracionMinima: number;
    edadMinima: number;
    eventos?: number[];
    idUsuario: number;
    correo?: string;
    fotoPerfil: string;
}
