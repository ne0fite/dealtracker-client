import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DealList } from './deal-list/deal-list.component';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FontAwesomeModule,
    RouterLink,
    DealList
  ],
  templateUrl: './deal.component.html',
  styleUrl: './deal.component.scss'
})
export class DealComponent implements OnInit {
  constructor(

  ) { }
  faPlus = faPlus;

  async ngOnInit() {

  }
}
