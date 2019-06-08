import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { isLoggedIn } from './auth/auth.selector';
import { AppState } from './reducers';
import { TdNavigationDrawerComponent } from '@covalent/core';
import { tap } from 'rxjs/operators';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoggedIn$: Observable<boolean>;

  @ViewChild('slackDrawer')
  slackDrawerRef: TdNavigationDrawerComponent;

  constructor(private afAuth: AngularFireAuth,
              private _iconRegistry: MatIconRegistry,
              private _domSanitizer: DomSanitizer,
              private store: Store<AppState>) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      // tslint:disable-next-line:max-line-length
      this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));

    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
      // tslint:disable-next-line:max-line-length
      this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      // tslint:disable-next-line:max-line-length
      this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      // tslint:disable-next-line:max-line-length
      this._domSanitizer.bypassSecurityTrustResourceUrl('https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent-mark.svg'));
  }

  async ngOnInit() {
    this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn),
        tap(
          async x => {
            if (!x) {
              await this.close();
            }
          }
        )
      );
  }

  async close() {
    await this.slackDrawerRef.close();
  }

  ngAfterViewInit(): void {
  }
}
