import { Action } from '@ngrx/store';
import { User } from './user.models';

export const SET_USER = '[Auth] Set User';
export const UNSET_USER = '[Auth] UnSet User';


export class SetUserActions implements Action {
      readonly type = SET_USER;

      constructor(public user: User) {

      }
}
export class UnsetUserActions implements Action {
      readonly type = UNSET_USER;

      constructor() {

      }
}

export type acciones = SetUserActions | UnsetUserActions;