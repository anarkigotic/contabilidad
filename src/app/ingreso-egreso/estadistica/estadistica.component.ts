import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  // Doughnut
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData;

  ingresos: number;
  egresos: number;
  totalIngreso: number;
  totalEgresos: number;
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe(ingresoEgreso => {
        this.contarIngresoEgresos(ingresoEgreso.items);
      })

  }

  contarIngresoEgresos(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalEgresos = 0;
    this.totalIngreso = 0;

    items.forEach(item => {
      if (item.tipo === "ingreso") {
        this.totalIngreso++;
        this.ingresos += item.monto;
      } else {
        this.totalEgresos++;
        this.egresos += item.monto;
      }
    })
    this.doughnutChartData = [this.ingresos,this.egresos];

  }



}
