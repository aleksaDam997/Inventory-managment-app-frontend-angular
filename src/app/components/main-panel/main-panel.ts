import { Component, inject, ViewChild } from '@angular/core';
import { NavigationPanel } from '../header/navigation-panel/navigation-panel';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { fadeSlideAnimation } from '../../animations/animations';
import { filter, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-main-panel',
  imports: [NavigationPanel, RouterOutlet, AsyncPipe, CommonModule],
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.css',
  animations: [fadeSlideAnimation]
})
export class MainPanel {

  private router = inject(Router);


  routeState$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(() => {
      const childRoute = this.router.routerState.root.firstChild?.firstChild;
      return childRoute?.snapshot?.data?.['animation'] ?? 'None';
    }),
    startWith(
      this.router.routerState.root.firstChild?.firstChild?.snapshot?.data?.['animation'] ?? 'None'
    )
  );
}