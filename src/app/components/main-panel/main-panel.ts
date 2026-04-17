import { Component, ViewChild } from '@angular/core';
import { NavigationPanel } from '../header/navigation-panel/navigation-panel';
import { RouterOutlet } from '@angular/router';
import { fadeSlideAnimation } from '../../animations/animations';

@Component({
  selector: 'app-main-panel',
  imports: [NavigationPanel, RouterOutlet],
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.css',
  animations: [fadeSlideAnimation]
})
export class MainPanel {

  @ViewChild(RouterOutlet) outlet!: RouterOutlet;


  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? null;
  }

  
}
