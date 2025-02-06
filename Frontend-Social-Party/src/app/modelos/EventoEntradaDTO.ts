import {EmpresaEntradaDTO} from "./EmpresaEntradaDTO";

export interface EventoEntradaDTO {
    id: number;
    titulo: string;
    empresa: EmpresaEntradaDTO;
}
