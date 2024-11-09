import { Component, OnInit } from '@angular/core';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MainBannerComponent } from './components/main-banner/main-banner.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [
    BenefitsComponent,
    MainContentComponent,
    MainBannerComponent,
    HeaderComponent,
  ],
})
export class IndexComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
