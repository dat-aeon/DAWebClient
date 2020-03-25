import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  todayDate = new Date(Date.now());
  nowYear = this.todayDate.getFullYear();

  constructor( private translate: TranslateService) { }

  ngOnInit() {
  }

}
