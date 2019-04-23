import { Action } from '@ngrx/store';
import { IngresoEgreso } from './ingreso-egreso.model';

export const SET_ITEMS = "[Ingreso egreso] Set items";
export const UNSET_ITEMS = "[Ingreso egreso] UnSet items";

export class SetItemActions implements Action {
    readonly type = SET_ITEMS;

    constructor(public items: IngresoEgreso[]) {

    }
}
export class UnsetItemActions implements Action {
    readonly type = UNSET_ITEMS;

}


export type acciones = SetItemActions | UnsetItemActions;