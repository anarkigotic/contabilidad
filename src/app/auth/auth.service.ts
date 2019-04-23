import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivarLoadingActions, DesactivarLoadingActions } from '../shared/ui.accions';


import Swal from 'sweetalert2';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.models';
import { AppState } from '../app.reducer';
import { SetUserActions,UnsetUserActions } from './auth.actions';
import { Subscription } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSuscription: Subscription = new Subscription();
  private usuario: User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) { }


  initAuthListener() {
    
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.userSuscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe((usuarioObj: any) => {
            
            const newUser = new User(usuarioObj);
            this.usuario = newUser;
            this.store.dispatch(new SetUserActions(newUser));
          })
      } else {
        this.usuario = null;
        this.userSuscription.unsubscribe();
      }
    })
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null
      })
    );
  }



  crearUsuario(name: string, email: string, password: string) {

    this.store.dispatch(new ActivarLoadingActions());

    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(usuario => {
      const user: User = {
        uid: usuario.user.uid,
        nombre: name,
        email: email
      }
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(() => {
        this.router.navigate(['/'])
        this.store.dispatch(new DesactivarLoadingActions());


      })

    }).catch(error => {
      Swal.fire("error en el login", error.message, "error");
      this.store.dispatch(new DesactivarLoadingActions());
      console.error(error);
    });
  }

  logint(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingActions());
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(usuario => {
      this.router.navigate(['/'])
      this.store.dispatch(new DesactivarLoadingActions());

    }).catch(err => {
      Swal.fire("error en el login", err.message, "error");
      this.store.dispatch(new DesactivarLoadingActions());
      console.error(err);
    })
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();

    this.store.dispatch(new UnsetUserActions());
  }


  getUser(){
    return {... this.usuario};
  }
}
