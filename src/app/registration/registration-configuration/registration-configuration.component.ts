import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-configuration',
  templateUrl: './registration-configuration.component.html',
  styleUrls: ['./registration-configuration.component.css']
})
export class RegistrationConfigurationComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
