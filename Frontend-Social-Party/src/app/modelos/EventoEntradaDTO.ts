import {EmpresaEntradaDTO} from "./EmpresaEntradaDTO";

export interface EventoEntradaDTO {
    id: number;
    titulo: string;
    fecha: string;
    horaApertura: string;
    horaFinalizacion: string;
    precio: number;
    empresa: EmpresaEntradaDTO;
}
