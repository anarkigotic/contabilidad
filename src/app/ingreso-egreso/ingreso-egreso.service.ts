import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemActions, UnsetItemActions } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class IngresoEgresoService {

    ingresoEgresoListenerSubscriptions: Subscription = new Subscription();
    ingresoEgresoItemsSubscriptions: Subscription = new Subscription();

    constructor(
        private afBD: AngularFirestore,
        public authService: AuthService,
        private store: Store<AppState>
    ) {

    }


    initIngresoEgresoListener() {
        this.ingresoEgresoListenerSubscriptions = this.store.select('auth')
            .pipe(
                filter(auth => auth.user != null)
            )
            .subscribe(auth => {
                // console.log(auth.user);
                this.ingresoEgresosItems(auth.user.uid)
            })
    }

    private ingresoEgresosItems(uid: string) {
        this.ingresoEgresoItemsSubscriptions = this.afBD.collection(`${uid}/ingresos-egresos/items`)
            // .valueChanges()
            .snapshotChanges()
            .pipe(
                map(docData => {
                    return docData.map(doc => {
                        return {
                            uid: doc.payload.doc.id,
                            ...doc.payload.doc.data()
                        }
                    })
                })
            )
            .subscribe((collection: any[]) => {
                this.store.dispatch(new SetItemActions(collection))
            })
    }



    crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const user = this.authService.getUser();
        return this.afBD.doc(`${user.uid}/ingresos-egresos`)
            .collection('items').add({ ...ingresoEgreso })

    }


    cancelarSubscriptions() {
        this.ingresoEgresoListenerSubscriptions.unsubscribe();
        this.ingresoEgresoItemsSubscriptions.unsubscribe();
        this.store.dispatch(new UnsetItemActions());
    }

    borrarIngresoEgreso(uid: string) {
        const user = this.authService.getUser();
        console.log(`${user.uid}/ingresos-egresos/${uid}`);
        
        return this.afBD.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
            .delete();
    }
}

