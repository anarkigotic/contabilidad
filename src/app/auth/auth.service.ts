import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.models';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }


  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);

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
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(usuario => {
      const user: User = {
        uid: usuario.user.uid,
        nombre: name,
        email: email
      }
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(() => {
        this.router.navigate(['/'])

      })

    }).catch(error => {
      Swal.fire("error en el login", error.message, "error");
      console.error(error);
    });
  }

  logint(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(usuario => {
      this.router.navigate(['/'])
    }).catch(err => {
      Swal.fire("error en el login", err.message, "error");
      console.error(err);
    })
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
