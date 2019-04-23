import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingActions, DesactivarLoadingActions } from '../shared/ui.accions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  cargando: boolean;
  constructor(public ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading
    })
    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    });
  }

  crearIngresoEgreso() {

    this.store.dispatch(new ActivarLoadingActions());

    const ingresoEgreso = new IngresoEgreso({ ...this.forma.value, tipo: this.tipo });
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(doc => {
      Swal.fire('Creado', ingresoEgreso.descripcion, 'success');
      this.forma.reset({ monto: 0 })
      this.store.dispatch(new DesactivarLoadingActions());

    }).catch(err => {
      Swal.fire("error en el login", err.message, "error");
      this.store.dispatch(new DesactivarLoadingActions());


    })

  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }



}
