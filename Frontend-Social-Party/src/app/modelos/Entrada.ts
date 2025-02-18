import {Evento} from "./Evento";
import {EventoEntradaDTO} from "./EventoEntradaDTO";

export interface Entrada{
    id?: number;
    fecha: string;
    codigoEntrada: number;
    idCliente?: number;
    evento: EventoEntradaDTO;
}
