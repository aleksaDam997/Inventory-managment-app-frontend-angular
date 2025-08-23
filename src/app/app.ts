import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from './components/header/main-header/main-header';
import { NavigationPanel } from './components/header/navigation-panel/navigation-panel';
import { MainPanel } from './components/main-panel/main-panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainHeader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend_angular';
}
