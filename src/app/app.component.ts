import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { AuthService } from './cores/services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  currentUser: any = {};
  cookie: any = { access_token: null, phone: null, refresh_token: null };

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private translateCacheService: TranslateCacheService,
    public titleService: Title,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) {

    translate.addLangs(['en', 'mm']);
    translate.setDefaultLang('en');
    
    translateCacheService.init();

    this.authService.currentUser.subscribe((res: any) => {
      this.currentUser = res;
    });

  }

  ngOnInit() {
    const appTitle = this.titleService.getTitle();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {

        const child = this.activedRoute.firstChild;

        if(child.snapshot.data['title']) {
          return child.snapshot.data['title'];
        }

        return appTitle;
      })
    ).subscribe((ttl: string) => {
      this.titleService.setTitle(ttl);
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  
}
