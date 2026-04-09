import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { Services } from './components/services/services';
import { AppLogo } from '../shared/logo/logo';

@Component({
  selector: 'app-web-client',
  imports: [Navbar, Hero, Services, AppLogo],
  templateUrl: './web-client.html',
  styleUrl: './web-client.scss',
})
export class WebClient {}
