import * as fromAuth from './auth.actions';
import { User } from './user.models';

export interface AuthState {
    user: User
}

const estadoInicial: AuthState = {
    user: null
};

export function authReducer(state = estadoInicial, action: fromAuth.acciones): AuthState {
    switch (action.type) {
        case fromAuth.SET_USER:
            return {
                user: {
                    ... action.user
                }
            }
        default:
            return state
    }
}