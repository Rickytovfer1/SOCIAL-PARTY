export interface Cliente {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    fechaNacimiento: string;
    valoracion: number;
    biografia: string;
    amigos: number[];
    entradas: number[];
    grupos: number[];
    fotoPerfil: string;
    evento: number;
    idUsuario: number;
}
