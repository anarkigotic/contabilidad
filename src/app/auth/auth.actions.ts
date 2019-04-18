import { Action } from '@ngrx/store';
import { User } from './user.models';

export const SET_USER = '[Auth] Set User';


export class SetUserActions implements Action{
      readonly type = SET_USER;

      constructor(public user: User){

      }
}

export type acciones = SetUserActions;