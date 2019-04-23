import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit ,OnDestroy {
  nombre:string;
  public sub:Subscription;
  constructor(
    public authService: AuthService, 
    public store: Store<AppState>,
    public ingresoEgresoService:IngresoEgresoService
    ) { }

  ngOnInit() {
    this.sub = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(auth => {
          this.nombre = auth.user.nombre;
      })

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

}
