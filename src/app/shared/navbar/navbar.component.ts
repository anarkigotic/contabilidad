import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { User } from 'src/app/auth/user.models';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  public nombre: string;
  public subscription: Subscription
  constructor(public store: Store<AppState>) { }
  ngOnInit() {
    this.subscription = this.store.select('auth')
    .pipe(
      filter(auth=> auth.user != null)
    )
    .subscribe(ui => {
      this.nombre = ui.user.nombre;
    })
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
