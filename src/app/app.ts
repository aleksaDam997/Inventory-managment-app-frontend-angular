import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from './components/header/main-header/main-header';
import { Toast } from './components/pop-up/toast/toast';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainHeader, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend_angular';
}
